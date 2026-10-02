# Change log — 2 October 2026, batch 7

Public programmes: 91 (87 already listed after batch 6, 4 added).
Removed from the public site: 0.
Published from this batch: 4 of the 9 reviewer-verified records in `batch7-verified-extract.json`.

Sam Fox limited the site to right-of-centre / free-market / conservative / classical-liberal organisations. Five reviewer-verified programmes were held out for that reason. They stay in the extract and are not in `verified-programmes.json` or `dist/app.js`.

`verified-programmes.json` is the full public list (the previous 87 plus these 4) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `aeasp-summer-2027` — American Economic Association (hosted by American University): AEA Summer Training and Scholarship Program 2027. Undergraduates and recent graduates (also BA/MA holders) planning an economics PhD. Designed for students who would bring greater diversity to the profession, but open to all ethnicities. Applicants need the full 8 weeks free. The $3,250 stipend is only for US citizens and permanent residents; international students pay about $25,000 themselves. In person in Washington, DC, Monday 31 May to Friday 23 July 2027. Deadline Sunday 31 January 2027 (no time or time zone stated).
- `partnership-public-service-internship-spring-2027` — Partnership for Public Service: Partnership Internship Program, Spring 2027. Undergraduates, graduate students and recent graduates. Priority deadline Monday 19 October 2026. The page prints no year; the 2026 year is inferred from the weekday and the Spring 2027 section. No email is printed; phone (202) 775-9111. Paid $2,000 per month full-time, pro-rated part-time. Washington, DC.
- `siepr-predoctoral-fellows-2027` — Stanford Institute for Economic Policy Research (SIEPR): Predoctoral Research Fellows Program, start 6 July 2027. A paid predoctoral position: a 2-year full-time Stanford staff job in Stanford, California, not Washington, DC. Bachelor's needed by the 6 July 2027 start. US work authorisation needed. Deadline Thursday 8 October 2026 for full consideration (no time or time zone stated).
- `stand-together-koch-internship-spring-2027` — Stand Together Fellowships: Koch Internship Program (KIP), Spring 2027. Current students only. Rolling through December 2026 for Spring 2027: apply and accept a partner offer by then. Stipend $7,500 full-time or $5,500 part-time. The same record also lists Summer 2027, rolling through March 2027.

## Held out

These five ids are in `batch7-verified-extract.json` with outcome `verified`. They were not added. Sam Fox (coordinator) limited batch 7 to right-of-centre / free-market / conservative / classical-liberal organisations. These organisations sit outside that scope.

- `cbcf-pathways-csuite-summer-2027` — Congressional Black Caucus Foundation: Pathways to the C-Suite Internship Program, Summer 2027
- `chci-congressional-internship-summer-2027` — Congressional Hispanic Caucus Institute: Congressional Internship Program, Summer 2027
- `chci-public-policy-fellowship-2027-28` — Congressional Hispanic Caucus Institute: Public Policy Fellowship Program 2027-2028
- `apaics-office-internship-spring-2027` — Asian Pacific American Institute for Congressional Studies: Office Internship, Spring 2027
- `apaics-congressional-internship-summer-2027` — Asian Pacific American Institute for Congressional Studies: Congressional Internship, Summer 2027

Also not added, because they were not in the published set: CBCF Pathways Spring 2027, any CBCF Walmart, State Farm or Congressional track, IFS, Fedea, Truman, Boren, TWC, CHCI Postgraduate, APAICS Congressional Fellowship, CSR, EPC and FOS Berlin.

## Pending Sam's call

AEA (AEASP), SIEPR and Partnership for Public Service are politically neutral. Sam has not decided whether neutral organisations count. Those three cards are on the public list in this batch pending that call. Stand Together Fellowships (Koch Internship Program) is inside the free-market / classical-liberal scope.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- Washington, DC programmes reuse the existing city marker (38.9072, -77.0369): AEASP and Partnership for Public Service.
- SIEPR reuses the existing Stanford, California marker (37.4275, -122.1697) already used by the Hoover Fellow listing. No new marker was added. The card says the job is in Stanford, California, not Washington, DC.
- The Koch Internship Program has no single workplace (partner organisations in the DC area and elsewhere, remote and in person). The spring summit is in Arlington, Virginia, so the card reuses the existing Arlington marker (38.8816, -77.091), the same pin as the Koch Associate Program. It is not a new marker and it is not the Washington, DC pin.
- Public links are the reviewer's `sourceUrl`. Application portals named in the cards were not opened.
- AEASP site type is Fellowship, the closest type for an eight-week residential training programme (the same type as the PPIA Junior Summer Institute). The official name includes "Scholarship". Eligibility is "Some restrictions" because of the academic and time conditions. The `paid` value contains "stipend" and does not contain "free", so the funding filter treats it as paid or stipend. The phrase "full 8 weeks free" is about having the weeks clear, and it is not in the `paid` field.
- Partnership for Public Service site type is Internship. Eligibility is "Some restrictions". The `paid` value starts with "Paid", so the funding filter treats it as paid or stipend.
- SIEPR site type is Fellowship, the closest existing filter for a predoctoral fellows programme. The card says it is a paid predoctoral position and a full-time Stanford staff job. The `paid` value is `Paid predoctoral staff position`, so the funding filter treats it as paid or stipend. No salary figure is stated.
- Koch Internship Program site type is Internship. Status is `rolling` because admissions are rolling. Eligibility is "Some restrictions" because it is for current students only. The `paid` value contains "Stipend", so the funding filter treats it as paid or stipend.
