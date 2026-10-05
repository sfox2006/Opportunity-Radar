# Political Opportunity Radar

A static opportunity explorer with a labelled interactive globe, zoom-dependent
clusters, searchable programme cards, optional profile matching and newsletter signup.

Website: https://sfox2006.github.io/Opportunity-Radar/

## Project layout

- `dist/`: authored website HTML, CSS and JavaScript; no build step required.
- `research/`: organisation registry, research workflow and dated evidence records.
- `agents/`: offline research tracking and spending-control foundation, not a running service.
- `newsletter-google/`: Google Apps Script integration and mocked tests.
- `.github/workflows/pages.yml`: test and publish `dist/` to GitHub Pages on `main` updates.

## Run and test

Open `dist/index.html` in a browser. External map assets and the Google Form require
internet access. Website paths are relative so the GitHub Pages project URL works.

```sh
node --test *.test.cjs newsletter-google/*.test.cjs
python -m unittest discover -s agents -p test_control.py -v
```

In GitHub Settings > Pages, select GitHub Actions as the publishing source.
Only `dist/` is uploaded as the Pages website, never private agent databases or
Google response data. The repository itself is public; keep credentials and
subscriber records out of all commits.

## Held off the live Open now list (5 October 2026)

These ids were taken off the site. The records are still in
`research/runs/2026-10-04-open-and-opening/verified-programmes.json` so they can be restored:

- `hudson-internship-program-fall-2026` — stale; the Fall 2026 term is already running
- `iw-koeln-student-finanz-immobilienmaerkte` — stale; the 1 October 2026 start has passed
- `texas-scorecard-fellowship-spring-2027` — fit hold
- `ij-fall-2026-legal-intensive` — fit hold (law students)
- `ij-semester-clerkship-spring-2027` — fit hold (law students)
- `yal-law-clerk-spring-2027` — fit hold (law preferred)
- `aier-graduate-fellowships-spring-2027` — fit hold (graduate fellowship)
- `ppia-junior-summer-institute-2027` — fit hold (off-brief)
- `siepr-predoctoral-fellows-2027` — fit hold (post-baccalaureate PhD-prep role; closes Thu 8 Oct 2026)

Neutral-tagged cards that stay on the live list: `hudson-policy-oct2026`, `bpc-spring-2027-internships`, `tax-foundation-spring-2027`, `volcker-nextgen-summer-policy-academy-2027`, `ifese-studentenpresentaties-2027`, `aeasp-summer-2027`, `partnership-public-service-internship-spring-2027`.

## Opening tab: move these into Open by hand

A card whose `opensOn` date has passed leaves the Opening tab. It does not appear under Open now until its status is flipped. Do not forget these moves:

- On Sun 1 Nov 2026 move `yaf-njc-summer-2027` and `centrum-for-rattvisa-sommarnotarie-2027` into Open.
- On Tue 1 Dec 2026 move `claremont-publius-fellowship-2027` into Open.

`node research/check_opening_due.cjs` prints those ids and exits with an error when any Opening card has an `opensOn` of today or earlier.

## Important status

This is a hosting migration, not a fresh programme verification. Imported listings
were last reviewed on 11 September 2026 and must be checked against current official
sources before relying on their open status. The research records document coverage
limitations; they do not establish that every candidate or Atlas partner was verified.

GitHub Pages serves the website only. It does not activate the research agents,
weekly refreshes, Google Contacts integration or email sending. Those require
separate hosting, account authorisation and end-to-end verification.

The initial GitHub import is a clean source snapshot, not the old site's Git history.
Private Google setup notes, real response-sheet identifiers, local runtime state,
credentials, raw crawl caches and the original hosting metadata are omitted or
replaced with configuration placeholders. The original site remains unchanged.
