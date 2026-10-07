# Free Society Noticeboard

A static opportunity explorer with a labelled interactive globe, zoom-dependent
clusters, searchable programme cards and Freedom Brief newsletter signup.

Website: https://sfox2006.github.io/Opportunity-Radar/

## Project layout

- `dist/`: published website assets; `app.js` is generated from `research/catalogue.json` and `src/app.js`.
- `research/`: organisation registry, research workflow and dated evidence records.
- `agents/`: offline research tracking and spending-control foundation, not a running service.
- `newsletter-google/`: Google Apps Script integration and mocked tests.
- `.github/workflows/pages.yml`: test and publish `dist/` to GitHub Pages on `main` updates.

## Run and test

Open `dist/index.html` in a browser. External map assets and the Google Form require
internet access. Website paths are relative so the GitHub Pages project URL works.

```sh
node research/build_catalogue.cjs --check
node research/build_directory.cjs --check
node research/check_opening_due.cjs
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

Public open opportunities: 132 (including one paid Job). Opening in the next 3 months: 3.

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

## Catalogue sources and audience

The catalogue serves students through early-career professionals, roughly up to ages 26–28. This is audience guidance, not an employer age limit. Include paid general vacancies as `Job`, as well as internships and other opportunity types. Evaluate actual responsibilities, required experience and qualifications; do not exclude solely because a title says senior or manager. Hold roles requiring experience implausible for this audience. Preserve published geographic, citizenship and work-authorisation restrictions and distinguish possible visa sponsorship from a guarantee.

Edit the authoritative `research/catalogue.json` after reviewing official programme and linked application evidence. Edit behaviour in `src/app.js`, then run `node research/build_catalogue.cjs`. CI checks exact regeneration. Preserve existing ids, source fields and individual review dates; never refresh a global date merely because one record changed. `research/sync_verified.cjs` is retired: old dated snapshots omit later additions and contain held records, so never restore a snapshot wholesale.

Publish upcoming records only with an officially confirmed, exact opening date strictly after today and within the next three calendar months (inclusive end date, with month-end clamping). Mark them `upcoming` and show them separately as not open yet. Farther-future, recurring and unknown candidates belong in private tracking outside this public repository. Reverify official programme and application pages before publication and again before promotion into Open now. An elapsed date never promotes a record automatically.

`node research/check_opening_due.cjs` flags records whose opening date has arrived. Recheck `yaf-njc-summer-2027` and `centrum-for-rattvisa-sommarnotarie-2027` on 1 November 2026, and `claremont-publius-fellowship-2027` on 1 December 2026. Confirm that applications actually opened, then update the authoritative catalogue; otherwise hold the record privately.

Added 7 October 2026: `cato-innovation-project`, independently corroborated against the official programme page and its linked application. No broader organisation sweep was performed for this change.

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

## Branding and newsletter template

`dist/assets/fsn-logo.png` is Sam's supplied Free Society Noticeboard artwork, copied unchanged on 7 October 2026. The website displays its monogram in the header, Freedom Brief banner and footer; the original image is also available for link previews, icons and newsletters. Keep the source artwork intact. The website's monogram framing is CSS only.

`dist/newsletter-template.html` is the reusable Freedom Brief email wrapper, with inline styles, the public logo URL and placeholders instead of opportunity listings. Replace the placeholders with verified edition content before use; preserve the regular country/programme order and attach the matching spreadsheet. This template is not a current edition and contains no recipient data. It does not send emails. The installed political-newsletter skill's email template also points to these assets.

## Sharing and community actions

Each open or opening-soon programme has a Share control. It shares this website's stable `?opportunity=<id>#programs` URL with native sharing when supported and copy fallback with accessible feedback. Fresh and reloaded URLs resolve either catalogue, clear search/category/organisation filters that could hide the record, expand its details and focus its card. Missing or expired records show an explanation. Official application URLs remain separate.

The footer reuses this site's existing Freedom Brief signup and links to separate Google Forms for opportunity suggestions, organisation suggestions and promotion enquiries. Each form has its own linked response spreadsheet. All four forms and their four response sheets are organised in the `Newsletter` folder of Sam's designated Google Drive account. Submissions require review before publication; promotion enquiries do not create a booking. `dist/footer.js` and the static HTML use the same public responder URLs, so the buttons also work without JavaScript. Keep editor URLs, private response-sheet links and submitted contact details out of the public repository. Do not use London's suggestion or newsletter forms or the Economic Radar signup.

`research/refresh-workflow.md` includes the separately authorised future-review instruction to prepare deduplicated, unsent clarification drafts for material unknowns using official published contacts. It does not send emails or start a new review. Keep correspondence outside this public repository.
