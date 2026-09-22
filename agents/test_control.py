import unittest

from control import CHECKS, Control


class ControlTests(unittest.TestCase):
    def setUp(self):
        self.c = Control(":memory:")
        self.c.import_registry([{"name": "First"}, {"name": "Second"}])
        self.c.start_cycle("pilot")
        self.org = self.c.db.execute("SELECT id FROM organisations LIMIT 1").fetchone()[0]

    def tearDown(self):
        self.c.db.close()

    def test_import_and_resume_do_not_duplicate(self):
        self.c.import_registry([{"name": "First"}])
        self.c.start_cycle("pilot")
        self.assertEqual(self.c.coverage("pilot")["total"], 2)

    def test_discovery_expands_current_cycle(self):
        self.c.import_registry([{"name": "Third"}])
        self.assertEqual(self.c.coverage("pilot")["pending"], 3)

    def test_new_cycle_reviews_everyone_again(self):
        self.c.start_cycle("next")
        self.assertEqual(self.c.coverage("next")["pending"], 2)

    def test_cannot_claim_completion_without_checks(self):
        with self.assertRaises(ValueError):
            self.c.record_review("pilot", self.org, "complete", {"sources": ["source"], "summary": "done"})

    def test_supported_completion_checkpoint(self):
        evidence = {"sources": ["source"], "summary": "No open opportunities",
                    "checks": {k: {"status": "done", "evidence": "record"} for k in CHECKS}}
        self.c.record_review("pilot", self.org, "complete", evidence)
        self.c.start_cycle("pilot")
        self.assertEqual(self.c.coverage("pilot")["complete"], 1)
        self.assertFalse(self.c.coverage("pilot")["full_coverage"])

    def test_blocked_is_not_complete(self):
        self.c.record_review("pilot", self.org, "blocked", {
            "sources": ["attempted URL"], "summary": "Blocked", "limitations": ["HTTP 403"]})
        self.assertEqual(self.c.coverage("pilot")["blocked"], 1)
        self.assertFalse(self.c.coverage("pilot")["full_coverage"])

    def test_unknown_cycle_is_not_empty_success(self):
        with self.assertRaises(ValueError):
            self.c.coverage("missing")

    def test_incomplete_cycle_cannot_be_finished(self):
        with self.assertRaises(ValueError):
            self.c.finish_cycle("pilot")

    def test_finished_cycle_is_frozen(self):
        evidence = {"sources": ["source"], "summary": "Checked",
                    "checks": {k: {"status": "done", "evidence": "record"} for k in CHECKS}}
        for row in self.c.db.execute("SELECT id FROM organisations").fetchall():
            self.c.record_review("pilot", row[0], "complete", evidence)
        self.c.finish_cycle("pilot")
        self.c.import_registry([{"name": "Third"}])
        self.assertEqual(self.c.coverage("pilot")["total"], 2)
        with self.assertRaises(ValueError):
            self.c.start_cycle("pilot")
        with self.assertRaises(ValueError):
            self.c.record_review("pilot", self.org, "pending", {})

    def test_reserved_cost_counts_against_cap(self):
        self.c.configure_budget("2026-09")
        self.c.reserve("2026-09", 3000, "Worst case research")
        with self.assertRaises(ValueError):
            self.c.reserve("2026-09", 1, "One more call")

    def test_settlement_releases_only_unused_reservation(self):
        self.c.configure_budget("2026-09")
        key = self.c.reserve("2026-09", 3000, "Research")
        self.c.settle(key, 2500)
        self.c.reserve("2026-09", 500, "Next")
        with self.assertRaises(ValueError):
            self.c.settle(key, 0)

    def test_overrun_is_recorded_and_stops_more_spend(self):
        self.c.configure_budget("2026-09")
        key = self.c.reserve("2026-09", 3000, "Research")
        self.assertTrue(self.c.settle(key, 3100)["overrun"])
        with self.assertRaises(ValueError):
            self.c.reserve("2026-09", 1, "More")

    def test_negative_and_raised_budgets_rejected(self):
        with self.assertRaises(ValueError):
            self.c.configure_budget("2026-09", 5100)
        with self.assertRaises(ValueError):
            self.c.reserve("2026-09", -1, "Bad")


if __name__ == "__main__":
    unittest.main()
