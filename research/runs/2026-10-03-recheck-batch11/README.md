# Batch 11 conferences — 3 October 2026

Public programmes: 107 (97 already listed after the batch 10 recheck, 10 added, 1 updated).
Removed from the public site: 0.
Edited in place: `atlas-society-gulch-2027` only.

The reviewer extract is `batch11-conferences-extract.json` (11 records, soonest first). Ten are new cards. Record 500, Galt's Gulch 2027, was already the card `atlas-society-gulch-2027` and was updated. No other extract URL or programme name matched a public card.

`verified-programmes.json` is the full public list. `research/sync_verified.cjs 2026-10-03-recheck-batch11` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

This directory is named `2026-10-03-recheck-batch11` so it sorts after `2026-10-03-recheck`. A directory named `2026-10-03-batch11` would sort before `recheck`, and a sync with no argument would publish the 97-card list again.

See `change-log.md` for the field-level text.

## Added

- `li-yls-reagan-library-2026-10` — Leadership Institute: Youth Leadership School at the Ronald Reagan Presidential Library. Site type Conference. Sat 10 - Sun 11 Oct 2026 in Simi Valley, CA. The agenda runs from arrival Fri 9 Oct to departure Mon 12 Oct. Registration $750. Scholarships (flight, lodging, meals, materials) are for first-time YLS students only. No deadline printed. Register soon: as of the 3 October 2026 check the event is 7 days away. Contact ctomaine@leadershipinstitute.org.
- `acton-academic-conference-2026` — Acton Institute: Sixth Annual Academic Conference. Site type Conference. Fri 16 Oct 2026, Grand Rapids, MI 49503. Registration $25, or $20 each for groups of 5 or more. No funding stated. No deadline printed. Who can attend is not stated. Contact lstrobel@acton.org.
- `isi-retreat-george-fox-2026` — ISI: Intercollegiate Retreat at George Fox University, Newberg, OR. Fri 30 Oct - Sun 1 Nov 2026. Undergraduates only. Pacific Northwest preference. About 20 participants. Travel and lodging covered. $250 stipend on completion. Closing date "Friday, October 16th"; year inferred. Contact amckinnon@isi.org.
- `isi-retreat-san-francisco-2026` — ISI: Intercollegiate Retreat, San Francisco. Fri 13 - Sun 15 Nov 2026. Undergraduates only. Western region preference. Reindustrialization and localism theme. About 20 participants. Travel and lodging covered. $250 stipend on completion. Closing date "Friday Oct 23rd"; year inferred. Contact amckinnon@isi.org.
- `isi-retreat-south-carolina-2026` — ISI: Intercollegiate Retreat at the University of South Carolina, Columbia, SC. Fri 13 - Sun 15 Nov 2026. Undergraduates only. Southeast preference. Adam Smith and classical liberalism theme. About 20 participants. Travel and lodging covered. $250 stipend on completion. Closing date "Friday Oct 23"; year inferred. Contact ataylor@isi.org.
- `isi-retreat-toledo-2026` — ISI: Intercollegiate Retreat at the University of Toledo, Toledo, OH. Fri 13 - Sun 15 Nov 2026. Undergraduates only. Midwest preference. Early American economy theme. About 20 participants. Travel and lodging covered. $250 stipend on completion. Closing date "Friday Oct 23"; year inferred. Contact pvanheyningen@isi.org.
- `cato-university-on-campus-san-diego-2026` — Cato Institute: Cato University on Campus, San Diego. Sat 14 Nov 2026, 8:30 AM-5:00 PM PST, University of San Diego. College and graduate students. No fee stated; meals included; $100 travel stipend on completion. The card does not say free. Applications close Fri 30 Oct 2026, 5:00 PM EDT. Contact events@cato.org.
- `li-yls-cozumel-cruise-2026-11` — Leadership Institute: Youth Leadership School Cozumel cruise. Departs New Orleans Thu 5 Nov 2026, 7:30 AM CST, returns Mon 9 Nov 2026, 8:00 AM CST. Registration $850. Limited full cruise scholarships cover fare, lodging and meals. Travel to New Orleans is not covered. 18 or older, and a valid US passport or an original birth certificate with seal plus photo ID. No deadline printed. Contact ctomaine@leadershipinstitute.org.
- `cato-university-winter-2027` — Cato Institute: Cato University 2027 Winter Term. Thu 4 - Sat 6 Feb 2027 in Washington, DC. Free, with room and board and a $500 travel stipend on completion. US-based applicants only. No deadline printed; treat as rolling, check page. Contact events@cato.org, taken from the San Diego page, not from this page.
- `mises-libertarian-scholars-conference-2027` — Mises Institute: Libertarian Scholars Conference 2027. Thu 18 Mar 2027 in Auburn, AL. Registration $99. The page body says 2026; the header and the weekday indicate 2027. Student application terms were not read and are unconfirmed. No deadline printed. Contact felicia@mises.org.

## Edited

- `atlas-society-gulch-2027` — The Atlas Society: Galt's Gulch 2027. Still one card. Thu 3 - Sat 5 Jun 2027 in New Orleans. Ticket $1,250 early bird until Mon 1 Feb 2027 (the page prints Feb 1 and does not print the year; year inferred), then $1,500. Scholarships for ages 18 to 35 cover travel and lodging. The scholarship deadline is not printed. Whether the ticket is waived is not stated. Contact galtsgulch@atlassociety.org.

## Held out

Not in the extract, and not added: Fraser seminars, IHS, Mises member events, CEI Sedona, Atlas Liberty Forum, ASI Rally, FIRE Soapbox, and Hudson Summer Fellowship 2027. The existing Hudson fall internship card was not touched.

Nothing else was added or edited.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`. The Galt's Gulch card keeps `orgIndex` 88.
- Public links are the reviewer's `sourceUrl`. Where the application or register link was not opened, the card links only to that page.
- Site type is Conference, which already exists in the type filter and the interests list. Status is `open` on every card in this batch, including Cato University Winter. That page does not state a rolling policy. The deadline line says to treat it as rolling and check the page.
- Event dates are in `duration`, not only the length from `siteFields.duration`.
- ISI closing dates and the Galt's Gulch early-bird date print no year. Those cards say `year inferred`.
- Where no deadline is printed, the deadline line says so. Cato University Winter uses `No deadline printed; treat as rolling, check page`.
- Cato University on Campus San Diego does not use the word free. `paid` is `No fee stated; meals included; $100 travel stipend on completion`. That string contains "stipend", so the funding filter treats the card as paid or stipend. It does not contain "free", so the free filter does not match it.
- ISI retreats say free and name the $250 stipend, so both the free filter and the paid-or-stipend filter match. Cato University Winter does the same because the page says the programme is free and pays a $500 stipend.
- Leadership Institute Reagan Library says register soon because, on the 3 October 2026 check, the event on Sat 10 Oct 2026 is 7 days away. Scholarships are only for first-time YLS attendees.
- The Cozumel cruise requires 18 or older and a US passport, or a birth certificate plus photo ID. Travel to New Orleans is not covered. The pin is New Orleans, the departure city, not Cozumel.
- The Mises card says the student application terms were not read and are unconfirmed, and that the body says 2026 while the header and the weekday indicate 2027. 18 March 2027 is a Thursday. 18 March 2026 was a Wednesday.
- The Acton event URL path contains `/2026/07/14/`. The page's event date is Fri 16 Oct 2026. The card uses 16 October, not 14 July.
- The Cato winter extract has no early-bird date and no printed deadline. The card does not invent one.
- New approximate city markers, not street or campus geocodes: Simi Valley (34.2694, -118.7815), Newberg (45.3001, -122.9732), San Francisco (37.7749, -122.4194), Columbia, SC (34.0007, -81.0348), Toledo (41.6528, -83.5379), San Diego (32.7157, -117.1611). Streets printed on the pages are in the card text only.
- Reused city markers: Grand Rapids (42.9634, -85.6681), New Orleans (29.9511, -90.0715) for both the cruise departure and Galt's Gulch, Washington, DC (38.9072, -77.0369), Auburn (32.6099, -85.4808). None of these is a geocode of the named building or hotel.
- The public list is not sorted or expired by deadline. `dist/app.js` keeps array order, and with a profile it sorts by match score and type. A deadline that is not a date does not throw. No data-side workaround was required.
