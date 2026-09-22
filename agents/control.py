"""Offline control plane. No network, email, publication or scheduling side effects."""

import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sqlite3
import uuid


CHECKS = (
    "official_domain", "navigation_hubs", "pagination", "sitemaps",
    "site_search", "local_language", "pdfs", "application_portals",
    "partner_discovery", "all_candidates_verified",
)


class Control:
    def __init__(self, path):
        self.db = sqlite3.connect(path, isolation_level=None)
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.execute("PRAGMA journal_mode=WAL")
        self.db.executescript("""
            CREATE TABLE IF NOT EXISTS organisations (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, source TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS cycles (
                id TEXT PRIMARY KEY, created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS reviews (
                cycle TEXT REFERENCES cycles(id), org TEXT REFERENCES organisations(id),
                status TEXT NOT NULL DEFAULT 'pending', evidence TEXT,
                PRIMARY KEY(cycle, org)
            );
            CREATE TABLE IF NOT EXISTS finished_cycles (
                cycle TEXT PRIMARY KEY REFERENCES cycles(id)
            );
            CREATE TABLE IF NOT EXISTS budgets (
                month TEXT PRIMARY KEY, cap INTEGER NOT NULL CHECK(cap >= 0),
                fixed INTEGER NOT NULL CHECK(fixed >= 0 AND fixed <= cap)
            );
            CREATE TABLE IF NOT EXISTS costs (
                id TEXT PRIMARY KEY, month TEXT REFERENCES budgets(month),
                reserved INTEGER NOT NULL CHECK(reserved > 0),
                actual INTEGER CHECK(actual >= 0), purpose TEXT NOT NULL
            );
        """)

    @contextmanager
    def transaction(self):
        self.db.execute("BEGIN IMMEDIATE")
        try:
            yield
            self.db.execute("COMMIT")
        except BaseException:
            self.db.execute("ROLLBACK")
            raise

    def import_registry(self, entries):
        with self.transaction():
            for entry in entries:
                name = entry["name"].strip()
                if not name:
                    raise ValueError("Organisation name required")
                key = hashlib.sha256(name.casefold().encode()).hexdigest()
                self.db.execute(
                    "INSERT INTO organisations VALUES (?, ?, ?) "
                    "ON CONFLICT(id) DO UPDATE SET source=excluded.source",
                    (key, name, json.dumps(entry)),
                )
                # New discoveries enter every unfinished cycle, not a later tier.
                self.db.execute(
                    "INSERT OR IGNORE INTO reviews(cycle, org) SELECT id, ? FROM cycles "
                    "WHERE id NOT IN (SELECT cycle FROM finished_cycles)",
                    (key,),
                )

    def start_cycle(self, cycle):
        with self.transaction():
            if self.db.execute("SELECT 1 FROM finished_cycles WHERE cycle=?", (cycle,)).fetchone():
                raise ValueError("Finished cycles cannot be restarted")
            self.db.execute("INSERT OR IGNORE INTO cycles VALUES (?, ?)",
                            (cycle, datetime.now(timezone.utc).isoformat()))
            self.db.execute(
                "INSERT OR IGNORE INTO reviews(cycle, org) SELECT ?, id FROM organisations",
                (cycle,),
            )

    def record_review(self, cycle, org, status, evidence):
        if status not in {"pending", "in_progress", "complete", "blocked"}:
            raise ValueError("Unknown review status")
        if status in {"complete", "blocked"}:
            if not evidence.get("sources") or not evidence.get("summary"):
                raise ValueError("Sources and outcome explanation required")
            if status == "blocked" and not evidence.get("limitations"):
                raise ValueError("Blocked reviews require concrete limitations")
            if status == "complete":
                for check in CHECKS:
                    item = evidence.get("checks", {}).get(check, {})
                    if item.get("status") not in {"done", "not_applicable"} or not item.get("evidence"):
                        raise ValueError(f"Unfinished or unsupported check: {check}")
                if evidence.get("limitations") or evidence.get("pending_candidates", 0):
                    raise ValueError("Unfinished work cannot be complete")
        with self.transaction():
            if self.db.execute("SELECT 1 FROM finished_cycles WHERE cycle=?", (cycle,)).fetchone():
                raise ValueError("Finished reviews cannot be edited")
            result = self.db.execute(
                "UPDATE reviews SET status=?, evidence=? WHERE cycle=? AND org=?",
                (status, json.dumps(evidence), cycle, org),
            )
            if result.rowcount != 1:
                raise ValueError("Unknown cycle or organisation")

    def finish_cycle(self, cycle):
        with self.transaction():
            if not self.coverage(cycle)["full_coverage"]:
                raise ValueError("Cannot finish while coverage is incomplete")
            self.db.execute("INSERT INTO finished_cycles VALUES (?)", (cycle,))

    def coverage(self, cycle):
        if not self.db.execute("SELECT 1 FROM cycles WHERE id=?", (cycle,)).fetchone():
            raise ValueError("Unknown cycle")
        counts = {s: 0 for s in ("pending", "in_progress", "complete", "blocked")}
        for row in self.db.execute(
            "SELECT status, COUNT(*) AS n FROM reviews WHERE cycle=? GROUP BY status", (cycle,)
        ):
            counts[row["status"]] = row["n"]
        total = sum(counts.values())
        return {"cycle": cycle, "total": total, **counts,
                "full_coverage": total > 0 and counts["complete"] == total}

    def configure_budget(self, month, cap=5000, fixed=2000):
        datetime.strptime(month, "%Y-%m")
        if type(cap) is not int or type(fixed) is not int or not 0 <= fixed <= cap <= 5000:
            raise ValueError("Budget must fit the USD 50 ceiling, in whole cents")
        with self.transaction():
            self.db.execute("INSERT INTO budgets VALUES (?, ?, ?)", (month, cap, fixed))

    def reserve(self, month, cents, purpose):
        if type(cents) is not int or cents <= 0 or not purpose.strip():
            raise ValueError("Positive integer cents and purpose required")
        with self.transaction():
            budget = self.db.execute("SELECT * FROM budgets WHERE month=?", (month,)).fetchone()
            if budget is None:
                raise ValueError("Budget is not configured")
            used = self.db.execute(
                "SELECT COALESCE(SUM(COALESCE(actual, reserved)), 0) FROM costs WHERE month=?",
                (month,),
            ).fetchone()[0]
            if budget["fixed"] + used + cents > budget["cap"]:
                raise ValueError("Budget exhausted: checkpoint and report incomplete")
            key = str(uuid.uuid4())
            self.db.execute("INSERT INTO costs VALUES (?, ?, ?, NULL, ?)",
                            (key, month, cents, purpose))
            return key

    def settle(self, key, cents):
        if type(cents) is not int or cents < 0:
            raise ValueError("Actual charge must be nonnegative whole cents")
        with self.transaction():
            row = self.db.execute("SELECT * FROM costs WHERE id=?", (key,)).fetchone()
            if row is None or row["actual"] is not None:
                raise ValueError("Unknown or already settled reservation")
            # Record overruns honestly; subsequent reservations then stop.
            self.db.execute("UPDATE costs SET actual=? WHERE id=?", (cents, key))
            return {"overrun": cents > row["reserved"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["prepare", "status"])
    parser.add_argument("--cycle", required=True)
    parser.add_argument("--database", default=str(Path(__file__).parent / "state/control.sqlite"))
    parser.add_argument("--registry", default=str(Path(__file__).parent.parent / "research/organisations.json"))
    args = parser.parse_args()
    path = Path(args.database)
    path.parent.mkdir(parents=True, exist_ok=True)
    control = Control(path)
    try:
        if args.command == "prepare":
            entries = json.loads(Path(args.registry).read_text(encoding="utf-8-sig"))["organisations"]
            control.import_registry(entries)
            control.start_cycle(args.cycle)
        print(json.dumps(control.coverage(args.cycle), indent=2))
    finally:
        control.db.close()


if __name__ == "__main__":
    main()
