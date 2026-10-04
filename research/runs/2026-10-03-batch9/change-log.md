# Change log — 3 October 2026, batch 9

Public programmes: 96 (93 already listed after batch 8, 3 added).
Removed from the public site: 0.
Published from this batch: 3 of the 9 reviewer-verified records in `batch9-verified-extract.json`.

The other 6 were left untouched pending a Reviewer recheck. No existing programme was edited, including the Hudson fall 2026 internship.

`verified-programmes.json` is the full public list (the previous 93 plus these 3) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

## Added

- `mercatus-emergent-ventures` — Mercatus Center: Emergent Ventures. Fellowship and grant programme, not an internship. Age 13 or older, any country. No deadline: rolling. Undated programme page (no cycle year printed). Grant amount not stated. Contact emergentventures@mercatus.gmu.edu, decoded from the page. Not pinned.
- `manhattan-institute-collegiate-associates` — Manhattan Institute for Policy Research: Collegiate Associates Program. Internship. GPA 3.25. Paid $17/hour in New York and California. Remote and hybrid options. Rolling. Apply before Sunday 15 November 2026 for spring. The page prints no year; the 2026 year is inferred. Recommenders email cap@manhattan.institute.
- `mercatus-markets-society-conference-2026` — Mercatus Center: Markets & Society Conference 2026. Conference. Friday 23 to Monday 26 October 2026, Falls Church, Virginia. Registration open, no cutoff printed, fee not stated on the page.

## Held out

Left untouched pending the Reviewer recheck. No field on an existing card was changed.

- `stand-together-koch-internship-program` — existing card `stand-together-koch-internship-spring-2027` unchanged.
- `cato-internship-spring-2027` — existing card unchanged.
- `cei-internships-spring-2027` — not added. There is no CEI card on the public list.
- `tfas-dc-academic-internship-summer-2027` — existing card unchanged.
- `reason-internships-spring-2027` — existing cards `reason-journalism`, `reason-policy`, `reason-marketing` and `reason-video-production` unchanged. No duplicate Reason card was added.
- `atlas-network-internships-spring-2027` — existing card `atlas-network-spring-2027-internships` unchanged.

Nothing from the earlier held or closed lists was added.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- Emergent Ventures is not pinned (`country` Global, `region` Online, no coordinates).
- New York City (40.7128, -74.006) is a new approximate city marker for Collegiate Associates. It is not a street address.
- Falls Church, Virginia (38.8823, -77.1711) is a new approximate city marker for Markets & Society. It is not the hotel and not a headquarters coordinate.
- Public links are the reviewer's `sourceUrl`. The Emergent Ventures application route, the Collegiate Associates form, and the Markets & Society registration link were not opened.
- Emergent Ventures site type is Fellowship. Status is `rolling`. The `paid` value is `Grant (amount not stated)`. The funding filter does not treat "Grant" as paid or free.
- Collegiate Associates site type is Internship. Status is `rolling`. The `paid` value starts with "Paid", so the funding filter treats it as paid or stipend. The card states that the November 2026 year is inferred.
- Markets & Society site type is Conference. Status is `open` because the site has no upcoming status and the page shows Register Here with no cutoff. The `paid` value is `Fee not stated on the page`. The card does not say the fee is free.
- Reviewed at 2026-10-03 for the three new cards only.
