# Batch 5 audit — 1 October 2026

Public programmes: 85 (84 already listed after batch 4, 1 added).
Removed from the public site: 0.
Published from this batch: the 1 verified record in `batch5-verified-extract.json` only.

Held, closed and upcoming batch 5 items are not in that verified extract and are not published. No existing programme was removed or edited.

`verified-programmes.json` is the full public list (the previous 84 plus this 1) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `first-liberty-crcd-shaftesbury-fellowship-2027` — First Liberty Institute / Center for Religion, Culture & Democracy (CRCD): 2027 Shaftesbury Fellowship. A Christian-oriented religion, culture and democracy summer fellowship for upper-level undergraduates and recent graduates intending graduate study in a liberty-related field. In person in Plano, Texas, 24 May to 30 July 2027 (about 10 weeks). Stipend plus housing: housing in the Dallas area and a weekly stipend (non-US citizens may be ineligible for the stipend depending on visa). Applications are rolling until Monday 15 February 2027 (no time or time zone stated). Questions: jbarr@firstliberty.org. The application goes through First Liberty's Paycor portal, which was not checked.

## Stayed off

Held, closed and upcoming batch 5 candidates are not published. They were not part of the verified extract supplied for this update, so this folder does not list them by name. Nothing from those groups was added to the public programme list.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new record has no `orgIndex`.
- Plano (33.0198, -96.6989) is an approximate city marker for Plano, Texas, not a street address. Dallas-area housing is named in the location text and is not used as a separate pin.
- The public link is the reviewer's `sourceUrl` (https://crcd.net/programs/shaftesbury-fellowship/). The Paycor application portal was not checked and is not used as the link.
- The `paid` value is `Stipend plus housing`, so the funding filter treats it as paid or stipend. The visa limit on the stipend is stated in the card text.
- The site type is Fellowship. Eligibility is "Some restrictions" because it is limited to upper-level undergraduates and recent graduates intending graduate study in a liberty-related field.
