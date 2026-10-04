# Batch 6 audit — 1 October 2026

Public programmes: 87 (85 already listed after batch 5, 2 added).
Removed from the public site: 0.
Published from this batch: the 2 verified records in `batch6-verified-extract.json` only.

Held, closed and upcoming batch 6 items are not in that verified extract and are not published. No existing programme was removed or edited.

`verified-programmes.json` is the full public list (the previous 85 plus these 2) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `john-jay-fellows-spring-2027` — John Jay Institute for Faith, Society and Law: John Jay Fellows Program, Spring 2027. An explicitly Christian programme (demonstrated Christian commitment is a selection criterion; daily group prayer and a live-in Christian community). For recent college graduates and young professionals, not current students. Completed college, GPA 3.0+. In person live-in residency in Langhorne, Pennsylvania, Friday 8 January to Saturday 24 April 2027 (about four months). Tuition free, free housing, and an $875 monthly stipend for four months. The externship afterwards is unpaid unless the host pays. Deadline Sunday 1 November 2026 (no time or time zone stated). The application form was not opened by us. Contact admin@johnjayinstitute.org.
- `ocpa-fears-fellowship-okc-2027` — Oklahoma Council of Public Affairs (OCPA): J. Rufus Fears Fellowship, Oklahoma City 2027. A reading and lecture seminar for young leaders aged 18 to 35, professionals and students. Five in-person Saturday sessions in Oklahoma City, 9:30 am to 1:00 pm, on 23 January, 6 February, 20 February, 6 March and 20 March 2027. Limited places. Apply by request form only. Funding is not stated (no fee mentioned on the pages we read). Deadline Friday 18 December 2026 (no time or time zone stated). Contact Matt@OCPAthink.org.

## Stayed off

Held, closed and upcoming batch 6 candidates are not published. They were not part of the verified extract supplied for this update, so this folder does not list them by name. Nothing from those groups was added to the public programme list.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- Langhorne (40.1775, -74.9189) is an approximate borough marker for Langhorne, Pennsylvania, not a street address of Fairview Manor. Fairview Manor is named in the location text and is not used as a separate pin.
- Oklahoma City (35.4676, -97.5164) is an approximate city marker for Oklahoma City, Oklahoma, not a street address.
- Public links are the reviewer's `sourceUrl`. The John Jay application form was not opened and is not used as the link. The OCPA request form on https://www.fearsfellowship.com/ was not submitted; that page is named in the application text, and the public link stays the schedule page.
- The John Jay `paid` value is `Tuition free, free housing, $875 monthly stipend`, so the funding filter treats it as both paid or stipend (the word stipend) and free / no cost (the word free). It is not the unpaid filter. The unpaid externship is stated in the card text and is not the `paid` value.
- The OCPA `paid` value is `Not stated`, so it does not match the paid, free, or unpaid funding filters. The card says funding is not stated and that no fee is mentioned on the pages we read.
- The John Jay site type is Fellowship. Eligibility is "Some restrictions" because it is limited to recent college graduates and young professionals who have completed college, with a GPA of 3.0+ and demonstrated Christian commitment. It is not open to current students.
- The OCPA site type is Seminar. The programme is named a fellowship, and the card states that it is a reading and lecture seminar of five Saturday sessions. Eligibility is "Some restrictions" because it is for young leaders aged 18 to 35, with limited places.
- Stale template text (a 2023 copyright footer, and a line that cohorts are planned for 2026) is not repeated on the card.
