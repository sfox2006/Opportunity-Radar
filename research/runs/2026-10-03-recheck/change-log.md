# Change log — 3 October 2026, batch 10 recheck

Public programmes: 97 (96 already listed after batch 9, 1 added).
Removed from the public site: 0.
Edited: 7 existing cards. Verified with no field change: Cato spring 2027 and TFAS D.C. Academic Summer 2027.

`verified-programmes.json` is the full public list. `research/sync_verified.cjs 2026-10-03-recheck` writes it into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged.

Inferred years are marked below. Stacked on #9. Merge order #1 to #10.

## Added

### `cei-internships-spring-2027` — Competitive Enterprise Institute, Internships, Spring 2027

New card. There was no CEI card on the public list.

| Field | Value |
| --- | --- |
| type | Internship |
| status | open |
| url | https://cei.org/about/internships/ |
| location | 1310 L Street NW, Washington, DC; in person only |
| lat, lon | 38.9072, -77.0369 (existing Washington city marker, not a street geocode) |
| paid | Stipend $500/week |
| fundingDetails | $500 per week for in-person interns. Not combinable with college credit or with a stipend from another organisation. |
| deadline | Tuesday 15 December 2026. The page prints no year; the 2026 year is inferred from the cycle. |
| duration | Approximately January-April. Full-time and part-time schedules are considered. |
| application | Resume plus three answers of no more than 250 words. One is on political or philosophical views. Contact interns@cei.org. The current page also lists sharon.pollard@cei.org for the PDF. |
| reviewedAt | 2026-10-03 |

The extract's CEI object still quotes https://cei.org/careers/internships/, which the recheck marks as superseded (modified 2025-07-22). These extract fields were not used: hybrid or remote eligibility, "KIP stipend additional", and matthew.adams@cei.org. The current page says the stipend cannot be combined with college credit or with another stipend, including KIP.

Inferred year: Tuesday 15 December 2026. The page prints 15 December and does not print the year.

## Edited

Pay that already matched was left as it was. `reviewedAt` moved to 2026-10-03 on each edited card except Markets & Society, which was already 2026-10-03.

### `reason-journalism` and `reason-video-production`

Pay was already `Paid` / `US$20/hour`. Duration already said full-time. Neither field changed. No $17.50 figure was on these cards.

- deadline: `20 November 2026 (deadline year inferred; confirm on the official page)` -> `Spring: Friday 20 November 2026 (deadline year inferred; confirm on the official page). Summer: Friday 5 March 2027.`
- location: `Washington, DC; on-site` -> `Washington, DC only; in person`
- reviewedAt: `2026-10-01` -> `2026-10-03`

The spring year was already flagged as inferred. That flag stays. The role pages print "November 20" and do not print 2026. Summer Friday 5 March 2027 is under the hub heading "2027 Internship Dates and Deadlines". Fall's 30 July date was not added.

### `reason-policy` and `reason-marketing`

Pay was already `Paid` / `US$20/hour`. Duration already said full-time. Neither field changed.

- deadline: same change as journalism and video production, above.
- location: `Washington, DC or remote` -> `Washington, DC or virtual`
- reviewedAt: `2026-10-01` -> `2026-10-03`

The role pages say "Washington, D.C. or Virtual".

### `atlas-network-spring-2027-internships`

Pay was already `Paid US$15/hour` / `US$15 per hour`. It was not changed. US work authorisation and "visa sponsorship is not offered" were already in `eligibilityDetails` and were kept.

- deadline: `31 December 2026 (time zone not stated). Hiring is on a rolling basis.` -> `Thursday 31 December 2026 (the page prints no year; the 2026 year is inferred; time zone not stated). Hiring is on a rolling basis.`
- location: `Hybrid. Washington, DC or Arlington, Virginia preferred; some work can be done from home.` -> `In person or hybrid. Washington, DC or Arlington, Virginia preferred.`
- description: `with hybrid working and a preference for Washington, DC or Arlington` -> `in person or hybrid, with a preference for Washington, DC or Arlington`
- eligibilityDetails: `OPT and CPT are accepted.` -> `We do accept OPT/CPT candidates.`
- reviewedAt: `2026-10-01` -> `2026-10-03`

Inferred year: Thursday 31 December 2026. The page prints "December 31" and does not print the year.

### `stand-together-koch-internship-spring-2027`

The published card did not say "hybrid". It still does not. Pay was already `Stipend $7,500 full-time or $5,500 part-time`. The deadline was already rolling through December 2026, including the requirement to apply and accept a partner offer. Those fields were not changed. Summer dates already on the card were kept.

- duration: `Spring: Thursday 28 January to Thursday 8 April 2027, with a summit on Thursday 4 and Friday 5 February 2027. Summer: Thursday 27 May to Thursday 5 August 2027. Six online Thursday sessions plus a two-day summit in Arlington, Virginia.` -> `Spring: Thursday 28 January to Thursday 8 April 2027 (about 10 weeks by the dates), with a required two-day summit at headquarters in Arlington on Thursday 4 and Friday 5 February 2027. Summer: Thursday 27 May to Thursday 5 August 2027. Six Thursday online sessions (1:00-4:00 pm ET) plus the required summit.`
- location: `Partner organisations in the Washington, DC area and elsewhere; remote and in-person roles vary by partner. The summit is in Arlington, Virginia.` -> `The internship is at a partner organisation, typically remote or in-person roles. The required summit is at Stand Together headquarters in Arlington, Virginia.`
- description: the placement line now says the internship itself is at a partner organisation, typically remote or in-person roles; the spring sentence adds "about 10 weeks by the dates"; the programming sentence now says six Thursday online sessions (1:00-4:00 pm ET) and a required two-day summit at headquarters in Arlington.
- reviewedAt: `2026-10-02` -> `2026-10-03`

28 January to 8 April 2027 is 70 days, which is 10 weeks. The card says "about 10 weeks by the dates" because the page prints the dates and does not print "10 weeks".

### `mercatus-markets-society-conference-2026`

`deadline` stays `Registration open, no cutoff printed.` `paid` stays `Fee not stated on the page`. The card does not say the event is free and does not say there is no registration fee.

- description: after the existing fee sentence, adds that registration is on an external Cvent page, the hotel rate is $143 a night and must be booked by Friday 9 October 2026, and parking is $18 a day for overnight guests.
- fundingDetails: `Registration open, no cutoff printed, fee not stated on the page.` -> that same sentence, plus the Cvent line, the $143 rate, the Friday 9 October 2026 booking date, and parking at $18 a day for overnight guests.
- application: `The external registration link was not opened.` -> `Registration is on an external Cvent page (https://cvent.me/8gZA5V). The Cvent form was not opened.` The fee sentence stays. The hotel rate, booking date and parking line were added.

Inferred year: the hotel page prints "Friday, October 9th" and does not print the year. 2026 is the conference year printed on the conference page. The card says so.

## Verified, no field change

### `cato-internship-spring-2027`

Checked against the recheck and the live internships page. Already present, and not wrong:

- Spring due 25 October 2026, 11:59 pm ET. 25 October 2026 is a Sunday. The card states the date and the time and does not spell the weekday.
- Pay US$17.50/hour.
- Summer window 11 January-15 February 2027. The page says it opens 11 January 2027 and is due 15 February 2027 at 11:59 pm ET. 15 February 2027 is a Monday.
- Fall window 28 May-27 June 2027. The page says it opens 28 May 2027 and is due 27 June 2027 at 11:59 pm ET. 27 June 2027 is a Sunday.
- Not rolling. The card says applications are taken in published windows, not on a rolling basis. Status is `open`.

### `tfas-dc-academic-internship-summer-2027`

Checked against the recheck and https://www.dcinternships.org/. Already present, and not wrong:

- International 8 October 2026, early 5 November 2026, priority 8 January 2027, final 8 February 2027.
- The card already says the deadline year is inferred. The page does not print the years.
- Weekdays in the extract (Thursday, Thursday, Friday, Monday) are not written on the card. The dates match, so the card was not rewritten.

## Held out

- Hudson Summer Fellowship 2027 (`hudson-political-studies-summer-fellowship-2027`) is `publishableNow: false` in the recheck. It was not added. No other card was added or edited.
