# Batch 8 audit — 2 October 2026

Public programmes: 93 (91 already listed after batch 7, 2 added).
Removed from the public site: 0.
The reviewer extract has 2 verified records. Published from this batch: 2. Both are on-brief (right-of-centre / free-market / conservative / classical-liberal). Nothing in this extract was held out.

No existing programme was removed or edited, including the Hudson fall 2026 internship.

`verified-programmes.json` is the full public list (the previous 91 plus these 2) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

See `change-log.md` for the ids, the count, and the filter choices.

## Added

- `afpi-spring-2027-internships` — America First Policy Institute: Internships for Spring 2027, Washington, DC. Site type Internship, the same type as other internships. Students and recent graduates; no further eligibility is stated, and no citizenship rule is printed. Full-time and in person, January-April 2027. Departments include Policy (including Trade and Economics), Communications, Development, Digital, Events, Government Affairs, the America 250 Civics Education Coalition, and Operations. Applicants pick their top 2-3 departments and submit a cover letter, resume and a writing sample. Monthly stipend; the amount is not stated. Deadline Friday 30 October 2026. The page prints no year; the 2026 year is resolved from the 22 September 2026 posting and the Spring 2027 title. Interviews are on a rolling basis, so earlier is better. The formal window is 21 August through 30 October. The AFPI careers application was not opened. No contact email is printed on the page. On-brief (America First / free enterprise).
- `tpif-fellowship-2027` — Public Interest Fellowship: The Public Interest Fellowship (TPIF). Site type Fellowship, the same type as other fellowships. A two-year full-time paid placement with host organisations, for recent college graduates or young professionals with up to five years of relevant work experience. Two professional rotations, each about nine to twelve months, in Washington, DC or New York. Paid full-time employment; the amount is not stated. A separate stipend fellowship for people already employed opens in March 2027 and is not open now. Deadline Wednesday 16 December 2026 (no time or time zone stated). The page calls this the 2026 cohort, although the deadline is December 2026. The online application was not opened. No email is printed on the programme page. An address that is not on an official page was not added to the card. On-brief (liberty, free markets, constitutionalism).

## Held out

This extract has no held-out records. Nothing from the earlier held lists was added, including CBCF, CHCI, APAICS, IFS, Fedea, Truman, Boren, TWC, CSR, EPC and FOS Berlin. No neutral organisation was added in this batch.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- AFPI reuses the existing Washington, DC marker (38.9072, -77.0369).
- TPIF is in person in Washington, DC or New York, NY. It has no single workplace, so the card is not pinned (`mapped` false, no coordinates). That matches other programmes that span more than one city. No new marker was added, and the Washington, DC pin was not reused for it.
- Public links are the reviewer's `sourceUrl`. Application portals named in the cards were not opened.
- AFPI site type is Internship. Eligibility is "Some restrictions" because it is for students and recent graduates, full-time and in person. The `paid` value contains "stipend" and not "free", so the funding filter treats it as paid or stipend. The amount is not stated.
- TPIF site type is Fellowship. Eligibility is "Some restrictions" because it is for recent college graduates and young professionals with up to five years of relevant work experience. The `paid` value starts with "Paid" and does not contain "free", so the funding filter treats it as paid or stipend. The amount is not stated. The March 2027 stipend track is described on the card and is not a second public listing.
- The AFPI card states that the page prints no year and that 2026 is resolved from the 22 September 2026 posting and the Spring 2027 title.
- The TPIF card states that the page calls this the 2026 cohort, although the deadline is December 2026.
- No email address was added for either programme. The reviewer note that named an unofficial TPIF address was not copied onto the card or into the extract.
