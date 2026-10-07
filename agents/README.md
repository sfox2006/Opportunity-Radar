# Political Opportunity Radar agents

## Current state

Local foundation only. No cloud server, recurring job, AI account, Gmail connection,
outreach sender or website publisher is active in this package. The existing site
and its private audience have not been changed.

`control.py` uses Python's standard-library SQLite support. It imports the complete
registry without assuming prior review, persists per-organisation checkpoints,
adds new discoveries to unfinished cycles, and reports pending/blocked separately
from completed work. Finished cycles are frozen. Completion requires evidence for
every discovery check and no pending candidates. These are structural checks, not
an independent assessment of the truth of supplied evidence.

The spending ledger reserves maximum anticipated costs before requests, counts
unsettled requests against the ceiling, and records actual costs afterwards.
Unknown request outcomes must retain their reservation until reconciled, never
be released merely because a request timed out. Provider adapters must calculate
real upper bounds and route every paid request through this ledger before it can
protect spending. It does not control billing at an external provider yet.

## Local commands

From the site directory:

```powershell
python -m unittest discover -s agents -p test_control.py -v
python agents/control.py prepare --cycle pilot-2026-09-15
python agents/control.py status --cycle pilot-2026-09-15
```

Prepare imports records, not research results. A repeated prepare resumes without
resetting existing reviews. The ignored `state/` folder contains the private local
database; it is outside published `dist/`. No credentials are required for these
commands. The initial pilot has 182 registry entries, all pending.

## Cloud design and budget proposal

Use one small Linux server with a persistent database and resumable background
workers. Keep website hosting separate. A 2 GiB DigitalOcean Basic server is listed
at USD 12/month before tax on 15 September 2026:
https://www.digitalocean.com/pricing/droplets

Proposed monthly allocation, not a vendor billing guarantee:
- USD 12 server.
- USD 8 reserved for tax, backup and contingency; validate actual fixed costs.
- At most USD 30 for AI, search and browser services combined.
- USD 50 total ceiling. No automatic upgrade or paid account activation.

Measure browser memory use and total research cost in the pilot. Do not promise
that exhaustive coverage fits this budget until measured. When funds or access run
out, checkpoint and report incomplete coverage rather than omit organisations.

## Remaining implementation and activation gates

1. User approves the cloud provider and owns its billing account. Configure secure
   access, firewall, restricted service user, secrets and encrypted backups.
2. Implement leased jobs, retries and failure recovery. Run the seven-day scheduler
   on the server, not on this computer. Resume unfinished cycles instead of creating
   overlapping sweeps. Persist dated evidence and coverage exports.
3. Connect discovery/research workers to official pages, sitemap trees, pagination,
   local-language search, PDFs and application portals. Resolve and follow the Atlas
   directory individually. Use safe public-URL fetching, robots restrictions,
   host rate limits and browser fallback. Never bypass blocked access.
4. Connect an independent verifier. Store dated source evidence and field-level
   support. Publish only verified currently open opportunities, including suitable paid general vacancies. Separately publish officially confirmed future openings only within the next three calendar months, clearly not open yet; keep farther-future, recurring and unknown candidates private and reverify before promotion. Apply the student-to-early-career audience guidance and published eligibility restrictions in `research/refresh-workflow.md`; title or audience age guidance alone is not an employer restriction. Old listings and
   search snippets are leads, not proof. Keep source text isolated from instructions.
5. Connect approved AI/search accounts with securely stored credentials and bounded
   request pricing. Reconcile actual charges, including uncertain requests. Do not
   paste API keys into chat or commit them to this repository.
6. Add an outreach review queue with proposed recipient, reason, sources and exact
   message. Initially draft only. Authorise the owner's Gmail account separately.
   Honour declines and avoid duplicate outreach; do not send newsletter contacts
   to research providers or email organisations without approval.
7. Add a private coverage/cost/approval dashboard. Stage website data changes and
   validate filtering, globe, profile opt-in and newsletter preservation. Regenerate the catalogue from its authoritative source and confirm
   supported unattended publishing for this repository's GitHub Pages workflow;
   do not reuse short-lived desktop credentials.
8. Run one complete pilot, show measured cost and verified/pending/blocked counts,
   obtain publication approval, then separately enable weekly cloud operation.
   Notify only meaningful updates, incomplete/failed runs or required action.

The existing `research/refresh-workflow.md` remains the research specification.
No email-sending, publication or paid network adapter exists here yet, deliberately:
those capabilities must not become active before the corresponding approvals.
