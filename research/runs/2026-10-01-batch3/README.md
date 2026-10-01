# Batch 3 audit — 1 October 2026

Public programmes: 81 (75 already listed after batch 2, 6 added).
Removed from the public site: 0.
Published from this batch: the 6 verified records in `batch3-verified-extract.json` only.

Held, closed and upcoming batch 3 items are not in that verified extract and are not published. No existing programme was removed or edited.

`verified-programmes.json` is the full public list (the previous 75 plus these 6) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `manning-foundation-student-essay-contest-2026` — Manning Foundation: 4th Annual Patricia Trottier and Gwyn Morgan Student Essay Contest (2026). One-off essay, not an internship. Canadian undergraduates only, including Canadians studying abroad. Deadline midnight, Sunday 8 November 2026 (time zone not stated). $7,000 in prizes. Online submission, so there is no map pin.
- `fundacion-piensa-jovenes-lideres-2026` — Fundación P!ensa: Concurso Jóvenes Líderes P!ensa 2026. Recognition award, no prize money. Ages 18-35 with an impact in Chile's Valparaíso Region. Spanish. Deadline 23:59, Friday 30 October 2026 (Chile time implied; time zone not stated).
- `ifese-studentenpresentaties-2027` — Ifese: Studentenpresentaties, summer 2027. Dutch-language research presentations in Belgium. Bachelor, master and PhD students, and recent graduates, present their own research. Five places, first come, first served. The official page's closing date was not copied onto the card: the printed weekday does not match the calendar date, so the card says "Closing date unclear on the official page, apply early." Contact: jens.vanmieghem@ifese.be. The 2027 format is not stated, so there is no map pin.
- `hayek-gesellschaft-juniorenkreis-wissenschaft-potsdam-2026` — Hayek-Gesellschaft: Juniorenkreis Wissenschaft, Potsdam. Academic weekend, not an internship. Friday 6 to Sunday 8 November 2026. Ages 18-35. German. Register by email. No fixed deadline.
- `iw-koeln-insm-studentischer-mitarbeiter-volkswirtschaft` — IW / INSM Berlin: student job (Werkstudent) in economics and economic policy, not an internship. German. Rolling until filled. Starts 1 December 2026.
- `iw-koeln-student-finanz-immobilienmaerkte` — IW Köln: student job (Werkstudent) on finance and property markets, not an internship. German. Rolling until filled. Starts 1 October 2026 and may already be filled.

## Stayed off

Held, closed and upcoming batch 3 candidates are not published. They were not part of the verified extract supplied for this update, so this folder does not list them by name. Nothing from those groups was added to the public programme list.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. None of these organisations already had a registry index (the Austrian "Hayek Institute" entry is a different organisation and was not reused). The new records have no `orgIndex`.
- The Manning contest is an online submission, so its region is Online and it has no geographic pin. The Kelowna foundation address is not used as a venue.
- Valparaíso (-33.0472, -71.6127) is an approximate city marker for the named region, not a street address or a headquarters coordinate.
- Potsdam (52.3906, 13.0645), Berlin (52.52, 13.405) and Köln (50.9375, 6.9603) are approximate city markers for the cities named on the pages, not street addresses.
- Ifese names Flanders and does not state the 2027 format, so `mapped` is false and it has no pin.
- The site filter has no "award" or "student job" type. The Fundación card uses the Scholarship filter and the two IW cards use the Internship filter. The card text states the real category: recognition award with no prize money, and student job (Werkstudent), not an internship.
- Public links use the reviewer's `sourceUrl`. Where `applicationUrl` is a different https link (the Fundación form), it is included in the application text. Email applications use the address the reviewer recorded.
