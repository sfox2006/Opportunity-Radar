# Batch 4 audit — 1 October 2026

Public programmes: 84 (81 already listed after batch 3, 3 added).
Removed from the public site: 0.
Published from this batch: the 3 verified records in `batch4-verified-extract.json` only.

Held, closed and upcoming batch 4 items are not in that verified extract and are not published. No existing programme was removed or edited.

`verified-programmes.json` is the full public list (the previous 81 plus these 3) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `iness-ekonomicky-base-camp-2026` — INESS: Ekonomický Base Camp 2026. Slovak-language economics seminar, in person near Martin, Slovakia, Thursday 15 to Sunday 18 October 2026. Students are prioritised; non-students can apply. FEE-BASED: EUR 159 students, EUR 299 non-students, EUR 109 reduced if requesting a scholarship; lodging and meals included. Deadline Monday 5 October 2026 (no time or time zone stated). The deadline is a few days away and is repeated in the card text. Contact: iness@iness.sk.
- `centrum-for-rattvisa-praktik-var-2027` — Centrum för rättvisa: Praktik, spring 2027. Unpaid legal internship in Stockholm for law students, about 10 weeks. Probably Swedish-language. Interviews are rolling and places may fill earlier. Deadline Sunday 11 October 2026 (no time or time zone stated). Apply by email to rekrytering@centrumforrattvisa.se.
- `fil-vi-premio-periodismo-joven-carlos-alberto-montaner` — FIL: VI Premio de Periodismo Joven 'Carlos Alberto Montaner'. A prize for journalists under 35, any nationality. USD 10,000. Spanish-language work. Not a student programme or internship. Closes Sunday 25 October 2026 (no time or time zone stated). Online submission.

## Stayed off

Held, closed and upcoming batch 4 candidates are not published. They were not part of the verified extract supplied for this update, so this folder does not list them by name. Nothing from those groups was added to the public programme list.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- Martin (49.066, 18.924) is an approximate city marker for Martin, Slovakia, not the street address of Hotel Bystrička.
- Stockholm (59.325, 18.071) is an approximate marker for Gamla stan, not a street address.
- The journalism prize is an online submission, so its region is Online and it has no geographic pin. Madrid and Mexico City are named in the location text and are not used as a venue pin.
- The site filter has no "prize" type. The FIL card uses the Essay competition filter. The card text states the real category: a prize for journalists, not a student programme or internship.
- The INESS `paid` value is `FEE-BASED` and does not contain the words Paid, Free, stipend, Scholarship or Prize, so the funding filter does not treat the fee as pay or as free. The scholarship reduction is stated in the card text.
- The INESS page disagrees on the edition number (headline 5th, body 4th), so the card does not state an edition.
- Public links use the reviewer's `sourceUrl`. Where `applicationUrl` is a different https link (the INESS form), it is included in the application text. Email applications use the address the reviewer recorded.
