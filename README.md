# Political Opportunity Radar

This repository is an independent copy of `sfox2006/Opportunity-Radar` for further
development. Tests run on updates to `main`; website deployment is disabled by
default. The existing live website remains in the original repository.

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

To publish this copy separately, select GitHub Actions in Settings > Pages and set
the repository Actions variable `ENABLE_PAGES` to `true`, then run the workflow.
Only `dist/` is uploaded as the Pages website, never private agent databases or
Google response data. The repository itself is public; keep credentials and
subscriber records out of all commits.

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
