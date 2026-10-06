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
The searchable organisation directory follows the economics site's grouped card
layout, using the political site's existing colours. Its 182 organisation and
resource entries come from the supplied political newsletter reference and are
grouped into 11 regions, including individual European countries within Europe.
Repeated Federalist Society mentions are consolidated; combined source entries
are split into named organisations. The Atlas partner directory and named regional
forums remain reference resources. Inclusion and program counts do not certify
current availability. Each card links to an official About page or homepage;
entries without an identifiable official website remain marked unavailable.

Edit `research/organisations.json` for directory membership and
`research/directory-reference.json` for source links, display names and aliases.
Edit `research/directory-websites.json` for the reviewed About/homepage URL and
link type. It records organisation link evidence separately from program research.
Use a clearly named parent/successor link when an organisation has merged, and
never retain a former domain that now belongs to an unrelated website.
Run `node research/build_directory.cjs` to regenerate `dist/organisations.js`;
CI checks that the generated file matches its inputs. These changes do not alter
the program catalog or research status in the organisation registry.

Only `dist/` is uploaded as the Pages website, never private agent databases or
Google response data. The repository itself is public; keep credentials and
subscriber records out of all commits.

Public open programmes: 131. Opening in the next 3 months: 3.

Added 5 October 2026: `hudson-political-studies-summer-fellowship-2027`, `hertog-humanities-winter-2027`. `aier-harwood-visiting-fellowships` is the Harwood card already on main from PR #9.

Batch 18, 5 October 2026: `young-voices-contributor-spring-2027` (replaces `young-voices`), `heritage-young-leaders-spring-2027`, `heritage-young-leaders-summer-2027`, `goldwater-ronald-reagan-fellowship`, `mrc-internships-spring-2027`.

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

## Sharing and community actions

Each open or opening-soon programme has a Share control. It shares this website's stable `?opportunity=<id>#programs` URL with native sharing when supported and copy fallback with accessible feedback. Fresh and reloaded URLs resolve either catalogue, clear search/category/organisation/profile filters that could hide the record, expand its details and focus its card. Missing or expired records show an explanation. Official application URLs remain separate.

The footer reuses this site's existing political newsletter signup. `dist/footer.js` has separate `listing`, `organisation` and `promotion` destinations. Sam authorised the public enquiry address `samfoxanu@gmail.com` for all three on 6 October 2026; each mailto link has a distinct political-site subject and the correct website URL. The same routes appear in HTML for visitors without JavaScript. Opening a link prepares an email in the visitor's mail app; it does not send it. Do not use London's suggestion or newsletter forms or the Economic Radar signup.

`research/refresh-workflow.md` includes the separately authorised future-review instruction to prepare deduplicated, unsent clarification drafts for material unknowns using official published contacts. It does not send emails or start a new review. Keep correspondence outside this public repository.
