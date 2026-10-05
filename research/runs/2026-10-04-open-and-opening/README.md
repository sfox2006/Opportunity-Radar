# Open now and opening soon — 4 October 2026

Public open programmes: 128 after the 5 October 2026 audit corrections, the batch 17 additions, and the Harwood card (131 on this branch, then 9 removed and 3 added, then 2 added, then 1 added).
Opening-soon programmes: 3. Removed from the public site in the original batch: 1 (`heritage-young-leaders`).

## Batch 17, 5 October 2026

Added to Open now. `research/sync_verified.cjs` was not used. It would replace the live list with this folder's `verified-programmes.json`, which still holds the nine programmes taken off the site and does not include the three later additions.

- `hudson-political-studies-summer-fellowship-2027` — open fellowship. Early Decision Sat 9 Jan 2027 11:59 p.m. EST; Regular Tue 16 Mar 2027 11:59 p.m. EST (extended). Applications opened Thu 1 Oct 2026. `hudson-policy-oct2026` was not edited.
- `hertog-humanities-winter-2027` — open. Deadline Mon 16 Nov 2026. Online Zoom seminars. No description or contact for this id was in the research records, so those fields stay "Not stated" except the programme title and deadline.
- `aier-harwood-visiting-fellowships` — open. Fri 15 Jan 2027 for Summer 2027. Applications are accepted year-round and count toward the chosen season if they arrive before that season's deadline. Early-career researchers are welcome; advanced PhD students only in exceptional cases. Undergraduates and early-stage MA students should apply to the AIER student internship instead. Residency on campus in Great Barrington, MA for most of the fellowship, plus two 45-minute research presentations. $350/week stipend, accommodation and travel assistance, confirmed as still current. The Summer 2027 date and the year-round rule were confirmed by AIER (Jason Sorens) on 5 Oct 2026. On-brief in the research note only; the live card has no ideology field.

Not added: Mannkal, Menzies, Maxim, FIRE, CIS expressions of interest, and the already-listed Liberales, ALEC, Capital Research Center, Independent Institute, James Madison Institute, Mises University, MEI, and ISI Collegiate Network cards.

## Audit corrections, 5 October 2026

Removed from the live site. The records below stay in `verified-programmes.json` in this folder so they can be restored:

- `hudson-internship-program-fall-2026`
- `iw-koeln-student-finanz-immobilienmaerkte`
- `texas-scorecard-fellowship-spring-2027`
- `ij-fall-2026-legal-intensive`
- `ij-semester-clerkship-spring-2027`
- `yal-law-clerk-spring-2027`
- `aier-graduate-fellowships-spring-2027`
- `ppia-junior-summer-institute-2027`
- `siepr-predoctoral-fellows-2027`

Added: `koch-internship-program-summer-2027`, `prometheus-praktikum`, `ccs-scnc-2026`.

On Sun 1 Nov 2026 move `yaf-njc-summer-2027` and `centrum-for-rattvisa-sommarnotarie-2027` into Open. On Tue 1 Dec 2026 move `claremont-publius-fellowship-2027` into Open. `node research/check_opening_due.cjs` prints when an `opensOn` date is today or in the past.

The reviewer payload was checked 4 October 2026. `batch-extract.json` keeps that payload. Published open cards are the 22 `open` records. Published opening cards are 3 of the 4 `opening` records. `verified-programmes.json` is the full Open now list in the site data shape, without the public source line. `opening-soon.json` is the Opening list.

`research/sync_verified.cjs` was not used. It replaces the whole `opportunities` array and rewrites every public source line to `Official source reviewed 11 Sep 2026`. These cards were appended in `dist/app.js`. Existing cards were not rewritten. The visible freshness label is unchanged.

Checked date on the new cards only: `reviewedAt` `2026-10-04`.

## Added to Open now

- `iea-media-internship`
- `vinson-hayek-internships`
- `liberales-institut-liberty-summer-school-2027`
- `heritage-young-leaders-summer-2027`
- `capital-research-center-internships`
- `alec-internship-program`
- `beacon-center-tn-internships`
- `moving-picture-institute-hollywood-career-launch`
- `martin-center-internship-next-semester`
- `sfl-global-performance-department-intern`
- `frc-internship-spring-2027`
- `frc-internship-summer-2027`
- `american-moment-fellowship-summer-2027`
- `cra-internship-spring-2027`
- `haultain-internship-winter-2027`
- `texas-scorecard-fellowship-spring-2027`
- `sfpa-college-fix-dc-journalism-spring-2027`
- `jmi-internship-spring-2027`
- `mises-university-2027`
- `mei-liberty-leadership-seminar-2027`
- `isi-collegiate-network-internship-2027`
- `hillsdale-in-dc-internship`
- `libertas-institute-research-internship`
- `independence-institute-kip-spring-2027`
- `independent-institute-learning-to-lead-internships`

## Added to Opening in the next 3 months

- `yaf-njc-summer-2027` — opens 2026-11-01
- `centrum-for-rattvisa-sommarnotarie-2027` — opens 2026-11-01
- `claremont-publius-fellowship-2027` — opens 2026-12-01

## Removed

- `heritage-young-leaders` — Young Leaders Program, Spring 2027. Deadline 4 October 2026 has passed. There was no separate Daily Signal spring card to remove. `heritage-young-leaders-summer-2027` (deadline Sun 31 Jan 2027, $18.50 per hour) is the replacement. It uses the same programme URL.

## Held out

- `atlantic-council-ygp-spring-2027` — Atlantic Council Young Global Professionals, Spring 2027. Opens 2026-10-19. Apply by Sun 8 Nov 2026, 11:59 pm ET. Tagged neutral. Held until the owner decides whether neutral organisations count. Not added to either list.

Not in this payload, and not added: programmes that open after 4 January 2027, programmes with only a month, and neutral organisations such as FIRE, Becket, FPRI and the Boston Fed.

## Date logic

The Opening tab uses the real current date. On 4 October 2026 all three `opensOn` dates fall inside the next three months. After an `opensOn` date has passed, that card leaves the Opening tab. It does not move into Open now by itself. `yaf-njc-summer-2027` and `centrum-for-rattvisa-sommarnotarie-2027` need to be moved to the open list on 1 November 2026 if they are actually open. `claremont-publius-fellowship-2027` needs the same check on 1 December 2026. Until then, a past `opensOn` shows in neither tab.

## Mapping notes

- New cards have no `orgIndex`. `research/organisations.json` was not edited.
- `type`, `duration`, `deadline`, `paid`, `fundingDetails`, `location` and `eligibilityDetails` on Open now cards are the payload `siteFields`. Opening cards have no `siteFields`. Their `deadline` is the payload deadline text. `opensOn` is `YYYY-MM-DD`.
- Where the payload says `Not stated`, the card keeps that wording.
- Public links are the payload `sourceUrl`.
- Reused city markers already in `dist/app.js`: London (51.5074, -0.1278), Washington, DC (38.9072, -77.0369), Auburn (32.6099, -85.4808), Stockholm (59.325, 18.071). No new coordinates were added.
- Unpinned (`mapped: false`) because the city is not already marked, the location is several cities, or the page does not state the city: Buckingham, Weggis, Nashville, Raleigh, Los Angeles / New York / Washington, Tallahassee, Montreal, Central Texas, newsroom placements, Arlington (not on the ALEC page), and Claremont.
- Virtual or remote with no country in the payload: Students For Liberty and Haultain use `country` Global and `region` Online, so they are not pinned.
- Montreal uses a new region value, `Canada`, taken from the payload location. No Canada marker was invented.
- Family Research Council spring and summer share one programme URL and are two cards. The YAF summer opening card shares the National Journalism Center URL with the existing spring card `njc-spring-2027`. That spring card was not edited.
- `status` on Opening cards is `upcoming`, so the open-status check does not hide them. Open now statuses are the payload values `open` or `rolling`.
