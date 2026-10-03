# Batch 10 recheck — 3 October 2026

Public programmes: 97 (96 already listed after batch 9, 1 added).
Removed from the public site: 0.
Edited in place: the four Reason spring 2027 internships, the Atlas Network spring 2027 internships, the Stand Together Koch Internship, and the Markets & Society Conference 2026 card.
Verified and left unchanged: the Cato spring 2027 internship and the TFAS D.C. Academic Internship Summer 2027 card.

The reviewer recheck is in `batch10-recheck-extract.json`. The CEI object in that file was read from the superseded careers page. The card uses the current page, https://cei.org/about/internships/, and the corrected facts checked on 3 October 2026. Hudson Summer Fellowship 2027 stays out.

`verified-programmes.json` is the full public list (the previous 96 plus the CEI card) in the site data shape. `research/sync_verified.cjs 2026-10-03-recheck` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

This run directory is named `2026-10-03-recheck` so it sorts after `2026-10-03-batch9`. A directory named `batch10` would sort before `batch9`, and a sync with no argument would publish the older list.

See `change-log.md` for the field-level before and after text.

## Added

- `cei-internships-spring-2027` — Competitive Enterprise Institute: Internships, spring 2027. Site type Internship. Washington, DC, in person only. The current page says CEI is only accepting applicants who are able to work in-person at the DC office. Stipend $500 per week, not combinable with college credit or another organisation's stipend. Deadline Tuesday 15 December 2026. The page prints no year; the 2026 year is inferred from the cycle. Application: a resume and three answers of no more than 250 words, one on political or philosophical views. Contact interns@cei.org. The page also lists sharon.pollard@cei.org for the PDF. On-brief (limited government, free enterprise, individual liberty).

## Edited

- `reason-journalism`, `reason-policy`, `reason-marketing`, `reason-video-production` — pay was already US$20/hour on all four, so pay was not changed. Journalism and video production are Washington, DC only and were already full-time. Policy and marketing are Washington, DC or virtual. Spring deadline Friday 20 November 2026. Summer deadline Friday 5 March 2027. The spring year was already flagged as inferred.
- `atlas-network-spring-2027-internships` — pay was already US$15/hour. Delivery is in person or hybrid. The page says "We do accept OPT/CPT candidates." Visa sponsorship is not offered, and US work authorisation is required. Spring deadline Thursday 31 December 2026. The page prints no year; the 2026 year is inferred.
- `stand-together-koch-internship-spring-2027` — not described as hybrid. Spring 2027 is Thursday 28 January to Thursday 8 April 2027, about 10 weeks by the dates. Six Thursday online sessions, 1:00-4:00 pm ET, plus a required two-day summit at headquarters in Arlington on Thursday 4 and Friday 5 February 2027. The internship itself is at a partner organisation, typically remote or in-person roles. Pay was already $7,500 full-time or $5,500 part-time. Rolling admission through December 2026 was already on the card.
- `mercatus-markets-society-conference-2026` — still says registration open, no cutoff printed, fee not stated on the page. It does not say the event is free. Registration is on an external Cvent page. The conference hotel rate is $143 a night and must be booked by Friday 9 October 2026. Parking is $18 a day for overnight guests.

## Verified, not edited

- `cato-internship-spring-2027` — already says spring is due 25 October 2026, 11:59 pm ET, pay is US$17.50/hour, summer is 11 January-15 February 2027, fall is 28 May-27 June 2027, and applications are not rolling. No field was wrong, so none was changed.
- `tfas-dc-academic-internship-summer-2027` — already says international 8 October 2026, early 5 November 2026, priority 8 January 2027, final 8 February 2027, and that the deadline year is inferred. No field was wrong, so none was changed.

## Held out

- `hudson-political-studies-summer-fellowship-2027` — the recheck outcome is unclear. The page still says the 2027 application will open on 1 October, and the application form was not opened. It was not added. The existing Hudson fall internship card was not touched.

Nothing else was added or edited.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The CEI record has no `orgIndex`.
- CEI reuses the existing Washington, DC marker (38.9072, -77.0369). That is a city marker, not a geocode of 1310 L Street NW. The street is named because the current page prints it.
- The public CEI link is https://cei.org/about/internships/. The extract's `sourceUrl`, https://cei.org/careers/internships/, is the superseded 2025 page. Its hybrid and remote wording, the extra KIP stipend, and matthew.adams@cei.org were not copied onto the card.
- CEI site type is Internship. Eligibility is "Some restrictions" because it is for students and recent graduates and is in person in Washington, DC. Status is `open`. The `paid` value contains "Stipend" and does not contain "free", so the funding filter treats it as paid or stipend.
- Reason pay stays in `fundingDetails` as US$20/hour, with `paid` set to "Paid", which is how those four cards were already stored. Policy and marketing say virtual, which is the word on the role pages. Journalism and video production say DC only. Their duration already said full-time.
- Atlas stays on the Washington, DC marker. The location text now says in person or hybrid. The card still says Washington, DC or Arlington is preferred. The page's newer line is a preference for the DC metro area and a hybrid schedule. Arlington was already on the card and was not removed.
- Stand Together stays on the Arlington marker (38.8816, -77.091) because the required summit is at headquarters there. The internship itself is not pinned to a single partner workplace.
- Markets & Society stays on the Falls Church city marker (38.8823, -77.1711). The hotel rate and the Friday 9 October 2026 booking date come from https://www.marketsandsociety.org/hotel. That page prints "Friday, October 9th" and does not print the year. 2026 is the conference year. Register Here on the conference page points at https://cvent.me/8gZA5V. The Cvent form was not opened. Parking on the hotel page is $18 a day for overnight guests.
- Reviewed at 2026-10-03 for the new card and the edited cards. Cato and TFAS were checked and their `reviewedAt` values were left as they were.
