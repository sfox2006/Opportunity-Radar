# Batch 7 audit — 2 October 2026

Public programmes: 91 (87 already listed after batch 6, 4 added).
Removed from the public site: 0.
The reviewer extract has 9 verified records. Published from this batch: 4. The other 5 were held out after Sam Fox limited the site to right-of-centre / free-market / conservative / classical-liberal organisations.

No existing programme was removed or edited, including the Hudson fall 2026 internship.

`verified-programmes.json` is the full public list (the previous 87 plus these 4) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

See `change-log.md` for the ids, the count, and the filter choices.

## Added

- `aeasp-summer-2027` — American Economic Association (hosted by American University): AEA Summer Training and Scholarship Program 2027. Undergraduates and recent graduates (also BA/MA holders) planning an economics PhD. Designed for students who would bring greater diversity to the profession, but open to all ethnicities. Applicants need the full 8 weeks free. The $3,250 stipend is only for US citizens and permanent residents; international students pay about $25,000 themselves. In person in Washington, DC (American University), Monday 31 May to Friday 23 July 2027. Deadline Sunday 31 January 2027 (no time or time zone stated). The application portal was not opened. Contact aeasp@american.edu. Politically neutral; pending Sam's call on whether neutral organisations count.
- `partnership-public-service-internship-spring-2027` — Partnership for Public Service: Partnership Internship Program, Spring 2027. Undergraduates, graduate students and recent graduates with a commitment to public service. Hybrid in Washington, DC. Paid $2,000 per month full-time (40 hours a week), pro-rated part-time. Priority deadline Monday 19 October 2026. The page prints no year; the 2026 year is inferred from the weekday and the Spring 2027 section. No email is printed on the page. Phone (202) 775-9111. The Apply link was not opened. Politically neutral; pending Sam's call on whether neutral organisations count.
- `siepr-predoctoral-fellows-2027` — Stanford Institute for Economic Policy Research (SIEPR): Predoctoral Research Fellows Program, start 6 July 2027. Filed as a Fellowship, the closest existing filter, and described as a paid predoctoral position. A 2-year full-time Stanford staff job in Stanford, California, not Washington, DC. Bachelor's degree needed by the 6 July 2027 start. US work authorisation needed (J-1 sponsorship possible, OPT accepted, no H-1B). Deadline Thursday 8 October 2026 for full consideration (no time or time zone stated). The Stanford Careers site was not opened. Contact siepr-fellowships@stanford.edu. Politically neutral; pending Sam's call on whether neutral organisations count.
- `stand-together-koch-internship-spring-2027` — Stand Together Fellowships: Koch Internship Program (KIP), Spring 2027. Current students only. Rolling through December 2026: applicants must both apply and accept a partner offer by then (no day stated). Stipend $7,500 full-time or $5,500 part-time. The same verified record also includes Summer 2027, rolling through March 2027. Summit in Arlington, Virginia. The partner job board was not opened. Contact admissions@standtogether.org. Inside the free-market / classical-liberal scope.

## Held out

These five ids are reviewer-verified in `batch7-verified-extract.json` and were not published. The reason is Sam Fox's scope rule: the site is for right-of-centre / free-market / conservative / classical-liberal organisations only.

- `cbcf-pathways-csuite-summer-2027` — Congressional Black Caucus Foundation: Pathways to the C-Suite Internship Program, Summer 2027
- `chci-congressional-internship-summer-2027` — Congressional Hispanic Caucus Institute: Congressional Internship Program, Summer 2027
- `chci-public-policy-fellowship-2027-28` — Congressional Hispanic Caucus Institute: Public Policy Fellowship Program 2027-2028
- `apaics-office-internship-spring-2027` — Asian Pacific American Institute for Congressional Studies: Office Internship, Spring 2027
- `apaics-congressional-internship-summer-2027` — Asian Pacific American Institute for Congressional Studies: Congressional Internship, Summer 2027

CBCF Pathways Spring 2027, CBCF Walmart, State Farm and Congressional tracks, IFS, Fedea, Truman, Boren, TWC, CHCI Postgraduate, APAICS Congressional Fellowship, CSR, EPC and FOS Berlin were not in the published set and were not added.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- AEASP and Partnership for Public Service reuse the existing Washington, DC marker (38.9072, -77.0369).
- SIEPR reuses the existing Stanford, California marker (37.4275, -122.1697) from the Hoover Fellow listing. No new California marker was added.
- The Koch Internship Program reuses the existing Arlington, Virginia marker (38.8816, -77.091) because the summit is in Arlington and placements vary. That is the same pin as the Koch Associate Program. It is not a street address.
- The AEASP `paid` value contains "stipend" and not "free", so the funding filter treats it as paid or stipend. "Full 8 weeks free" means the applicant must have those weeks clear.
- The SIEPR `paid` value is `Paid predoctoral staff position`, so the funding filter treats it as paid or stipend. The site type is Fellowship.
- The Koch Internship Program `paid` value contains "Stipend". Its site status is `rolling`.
