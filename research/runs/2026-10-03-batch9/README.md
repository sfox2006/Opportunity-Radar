# Batch 9 audit — 3 October 2026

Public programmes: 96 (93 already listed after batch 8, 3 added).
Removed from the public site: 0.
The reviewer extract has 9 verified records. Published from this batch: 3. The other 6 were left untouched pending a Reviewer recheck of CEI, Cato, Reason, Atlas Network and Stand Together. TFAS DC Academic was in the same hold.

No existing programme was edited, including the Hudson fall 2026 internship, the Cato spring 2027 internship, the four Reason spring 2027 internships, the Atlas Network spring 2027 internships, the Stand Together Koch Internship, and the TFAS D.C. Academic Internship Summer 2027.

`verified-programmes.json` is the full public list (the previous 93 plus these 3) in the site data shape. `research/sync_verified.cjs` writes that file into `dist/app.js` and sets every public source line to `Official source reviewed 11 Sep 2026`. The visible freshness label is unchanged. Sam has not decided on a new date.

See `change-log.md` for the ids, the count, and the filter choices.

## Added

- `mercatus-emergent-ventures` — Mercatus Center: Emergent Ventures. Site type Fellowship, the same type as other fellowships. A low-overhead fellowship and grant programme, not an internship, for anyone aged 13 or older in any country. One application per applicant and project. The page says no feedback or status updates are given. No deadline: rolling. The programme page is undated (no cycle year printed). Grant amount not stated. The application route was not opened. Contact emergentventures@mercatus.gmu.edu, decoded from the page. Not pinned: there is no workplace. On-brief (classical liberal).
- `manhattan-institute-collegiate-associates` — Manhattan Institute for Policy Research: Collegiate Associates Program. Site type Internship. Undergraduates, recent graduates and graduate students. Minimum GPA 3.25. A cover letter, a letter of recommendation and a writing sample are required. Paid $17/hour in New York and California. Pay for other locations is not stated. Remote and hybrid options; in person is preferred. 10-12 weeks. Spring runs from late January to mid-April, 5-20 hours a week. The page does not print the year of those dates. Rolling. Apply before Sunday 15 November 2026 for the spring term. The page prints no year; the 2026 year is inferred. Summer is encouraged before 15 April and fall before 15 July. The application form was not opened. Recommenders email cap@manhattan.institute. On-brief (economic opportunity, individual liberty, rule of law).
- `mercatus-markets-society-conference-2026` — Mercatus Center: Markets & Society Conference 2026. Site type Conference, which already exists as a card type and in the filters. In person in Falls Church, Virginia, Friday 23 to Monday 26 October 2026. Opening reception and dinner on Friday; the conference ends after lunch on Monday. Open to students, scholars, analysts and policymakers. The hotel named on the page is the Falls Church Marriott Fairview Park. Registration open, no cutoff printed, fee not stated on the page. The external registration link was not opened. Contact marketsandsociety@mercatus.gmu.edu. The page also lists hayekprogram@mercatus.gmu.edu. This is a conference, not an internship or fellowship. On-brief (Mercatus / classical liberal).

## Held out

These six ids are in `batch9-verified-extract.json` and were not published and did not change any existing card. The Reviewer is rechecking CEI, Cato, Reason, Atlas Network and Stand Together. TFAS was held with them.

- `stand-together-koch-internship-program` — the existing card `stand-together-koch-internship-spring-2027` was left exactly as on PR #8.
- `cato-internship-spring-2027` — the existing card was left exactly as on PR #8.
- `cei-internships-spring-2027` — Competitive Enterprise Institute spring internships were not added.
- `tfas-dc-academic-internship-summer-2027` — the existing card was left exactly as on PR #8.
- `reason-internships-spring-2027` — the existing cards `reason-journalism`, `reason-policy`, `reason-marketing` and `reason-video-production` were left exactly as on PR #8. No fifth Reason card was added.
- `atlas-network-internships-spring-2027` — the existing card `atlas-network-spring-2027-internships` was left exactly as on PR #8.

Nothing from the earlier held or closed lists was added, including Ideas at Work, MRU College Fellowship, Emerging Scholars, the 1991 Fellowship, Humane Studies, ScholarsEdge, PERC, Lincoln, Institute for Justice law programmes, FIRE, Buckeye, Cascade, Pacific Legal Foundation clerkships, Fraser, CBCF, CHCI, APAICS, IFS, Fedea, Truman, Boren, TWC, CSR, EPC and FOS Berlin.

## Mapping notes

- The visible "Source reviewed 11 Sep 2026" label is unchanged.
- No organisations were added to `research/organisations.json`. The new records have no `orgIndex`.
- Emergent Ventures has no workplace (any country). `country` is Global, `region` is Online, and there are no coordinates, so it is not pinned. The Mercatus headquarters pin was not reused.
- Collegiate Associates is named as New York, with remote and hybrid options. It uses a new approximate New York City marker (40.7128, -74.006). That is a city marker, not a street address. No California marker was added. Pay of $17/hour is stated for New York and California only.
- Markets & Society is in person in Falls Church, Virginia. It uses a new approximate Falls Church city marker (38.8823, -77.1711). That is not the Falls Church Marriott Fairview Park and not a Mercatus headquarters coordinate. The hotel name is only in the card text, because the page names it.
- Public links are the reviewer's `sourceUrl`. Application and registration routes named in the cards were not opened.
- Emergent Ventures site type is Fellowship. Eligibility is "Some restrictions" because applicants must be 13 or older. Status is `rolling`. The `paid` value is `Grant (amount not stated)`. It does not contain "Paid", "stipend", "Scholarship", "Prize" or "free", so the funding filter does not treat the word Grant as paid or free. The amount is not stated. The card says the page is undated.
- Collegiate Associates site type is Internship. Eligibility is "Some restrictions" because of the GPA, the student audience, and the required recommendation and writing sample. Status is `rolling`. The `paid` value starts with "Paid" and does not contain "free", so the funding filter treats it as paid or stipend. The card states that the page prints no year and that 2026 is inferred.
- Markets & Society site type is Conference. The reviewer outcome was upcoming. The site status field only allows open, rolling or on-demand, and the page has a Register Here link with no cutoff, so the card status is `open`. Event dates are in `duration`. The deadline is `Registration open, no cutoff printed.` The `paid` value is `Fee not stated on the page`. It does not say the event is free, and it does not repeat an older call-for-papers line about no registration fee. That older page was not re-read. The funding filter does not treat this card as paid, free or unpaid.
- Emails on these three cards are the addresses the reviewer found on the official pages. The Emergent Ventures address was decoded from the page. No other address was added.
