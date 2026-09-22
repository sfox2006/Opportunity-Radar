"""Export search coverage separately from verified programme availability."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent / 'runs' / '2026-09-11'
jobs = json.loads((ROOT / 'crawl-seeds.json').read_text(encoding='utf-8'))
verified = json.loads((ROOT / 'verified-programmes.json').read_text(encoding='utf-8'))
searches = {}
for path in ROOT.glob('domain-search-*.json'):
    for row in json.loads(path.read_text(encoding='utf-8')):
        searches[row['index']] = row
assert len(searches) == len(jobs) == 182
checks = json.loads((ROOT / 'programme-checks.json').read_text(encoding='utf-8'))
coverage = []
leads = []
for job in jobs:
    i = job['index']
    crawl_path = ROOT / 'crawl' / ('%03d.json' % i)
    try:
        crawl = json.loads(crawl_path.read_text(encoding='utf-8')) if crawl_path.exists() else {}
    except json.JSONDecodeError:
        crawl = {}
    urls = []
    for block in re.split(r'-{20,}', searches[i]['result']):
        match = re.search(r'\((https?://[^\s]+)\)', block)
        if match:
            url = match.group(1)
            title = block[:match.start()].strip()
            if url not in urls:
                urls.append(url)
                leads.append(dict(index=i, organisation=job['name'], title=title, url=url,
                                  verification='Search lead; not an availability finding'))
    row = dict(index=i, organisation=job['name'], region=job['region'],
               discoverySearch='completed', domainSearch='completed',
               crawlStage=crawl.get('stage', 'not_finished'),
               pagesRetrieved=len(crawl.get('pages', [])),
               accessLimitations=len(crawl.get('blocked', [])),
               crawlFinished=crawl.get('crawlFinished', False),
               candidateReview='not_complete',
               verifiedProgrammes=[p['program'] for p in verified if p['orgIndex'] == i],
               programmeChecks=[c for c in checks if c['orgIndex'] == i],
               sourceLeads=urls)
    coverage.append(row)
(ROOT / 'coverage.json').write_text(json.dumps(coverage, ensure_ascii=False, indent=2), encoding='utf-8')
with (ROOT / 'source-leads.csv').open('w', newline='', encoding='utf-8-sig') as handle:
    writer = csv.DictWriter(handle, fieldnames=['index', 'organisation', 'title', 'url', 'verification'])
    writer.writeheader()
    writer.writerows(leads)
with (ROOT / 'coverage.csv').open('w', newline='', encoding='utf-8-sig') as handle:
    fields = ['index', 'organisation', 'region', 'discoverySearch', 'domainSearch', 'crawlStage',
              'pagesRetrieved', 'accessLimitations', 'candidateReview', 'verifiedProgrammes']
    writer = csv.DictWriter(handle, fieldnames=fields, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(dict(row, verifiedProgrammes='; '.join(row['verifiedProgrammes'])) for row in coverage)
finished = sum(row['crawlFinished'] for row in coverage)
pages = sum(row['pagesRetrieved'] for row in coverage)
lines = ['# Student and Young Professional Opportunities', '',
         '## Coverage and Limitations', '',
         f'The registry contains 182 entries, including aliases and programme directories. All 182 received an individual discovery search and a second domain-focused search. {finished} automated site passes have ended; {pages:,} pages were retrieved. An ended pass can include access restrictions and is not proof of exhaustive coverage.', '',
         f'{len(verified)} programme records have been reviewed for current application or enrolment availability. Remaining search leads require verification. This is an incomplete verification audit, not a claim that every organisation or page has been fully checked.', '',
         'The crawler follows programme-related links and sitemaps subject to robots rules. Author pages, tag pagination and MEF third-party monitoring archives are excluded. Retrieved-page totals include historical and irrelevant material collected before filtering was refined; they are not counts of verified programme pages.', '',
         'The Atlas partner directory redirects to Atlas Network Connect. The wider partner network has not been fully enumerated or searched. Renamed, merged and ambiguous entries remain in the coverage table. A missing verified programme does not mean an organisation has no programmes.', '',
         'Findings were reviewed on 11 September 2026. Deadlines, funding and availability can change; the linked organiser pages control admission. City markers are approximate and are omitted where a placement city is not established.', '',
         '## Reviewed Programmes', '']
for p in verified:
    lines.extend([f"### {p['organisation']}: {p['program']}", '', p['description'], '',
                  f"- Location: {p['location']}", f"- Timing: {p['duration']}",
                  f"- Deadline: {p['deadline']}", f"- Funding: {p.get('fundingDetails', p['paid'])}",
                  f"- Eligibility: {p['eligibilityDetails']}", f"- Apply: {p['application']}",
                  f"- [Official programme source]({p['url']})", ''])
lines.extend(['## Organisation Coverage', '',
              '| Entry | Organisation | Retrieved Pages | Access Issues | Findings / Remaining Work |',
              '| --- | --- | ---: | ---: | --- |'])
for row in coverage:
    findings = ['Reviewed: ' + '; '.join(row['verifiedProgrammes'])] if row['verifiedProgrammes'] else []
    findings.extend(c['finding'] for c in row['programmeChecks'])
    findings.append('Further candidate review outstanding')
    lines.append('| %s | %s | %s | %s | %s |' % (row['index'] + 1, row['organisation'],
                 row['pagesRetrieved'], row['accessLimitations'], '; '.join(findings).replace('|', '/')))
lines.extend(['', '## Sources', '',
              'Each reviewed programme links directly to its official source above. Additional checked pages are listed below. The separate source-leads.csv contains discovered URLs that are not yet verified opportunities.', ''])
for check in checks:
    lines.append('- [%s](%s): %s' % (check['program'], check['url'], check['finding']))
(ROOT / 'search-audit.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(json.dumps(dict(registryEntries=len(coverage), reviewedProgrammes=len(verified),
                      endedSitePasses=finished, retrievedPages=pages, searchLeads=len(leads))))
