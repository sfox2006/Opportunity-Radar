# Change log — 2 October 2026, batch 8

Public programmes: 93 (91 already listed after batch 7, 2 added).
Removed from the public site: 0.
Published from this batch: 2 of the 2 reviewer-verified records in `batch8-verified-extract.json`.

Both records are on-brief. Nothing in this extract was held out. No existing programme was removed or edited, including the Hudson fall 2026 internship.

`verified-programmes.json` is the full public list (the previous 91 plus these 2) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `afpi-spring-2027-internships` — America First Policy Institute: Internships for Spring 2027, Washington, DC. Students and recent graduates. Full-time, in person, January-April 2027. Monthly stipend; the amount is not stated. Deadline Friday 30 October 2026. The page prints no year; the 2026 year is resolved from the 22 September 2026 posting and the Spring 2027 title. No contact email is printed on the page.
- `tpif-fellowship-2027` — Public Interest Fellowship: The Public Interest Fellowship (TPIF). A two-year full-time paid placement fellowship for recent college graduates and young professionals with up to five years of relevant work experience. Washington, DC or New York. Deadline Wednesday 16 December 2026 (no time or time zone stated). The page calls this the 2026 cohort, although the deadline is December 2026. No email is printed on the programme page.

## Held out

Nothing from this extract was held out. Nothing from the earlier held lists was added: CBCF, CHCI, APAICS, IFS, Fedea, Truman, Boren, TWC, CSR, EPC and FOS Berlin. No neutral organisation was added.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- Washington, DC: AFPI reuses the existing city marker (38.9072, -77.0369).
- TPIF has no single workplace (Washington, DC or New York, NY), so it is not pinned. `mapped` is false and there are no coordinates. No new marker was added.
- Public links are the reviewer's `sourceUrl`. The AFPI careers application and the TPIF online application were not opened.
- AFPI site type is Internship. Eligibility is "Some restrictions". The `paid` value is `Monthly stipend (amount not stated)`, so the funding filter treats it as paid or stipend.
- TPIF site type is Fellowship. Eligibility is "Some restrictions". The `paid` value is `Paid full-time employment (amount not stated)`, so the funding filter treats it as paid or stipend.
- An unofficial email address that is not on an official TPIF page was not included on the card or in the extract.
