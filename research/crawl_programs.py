"""Checkpointed, robots-aware public programme discovery; never infers openness."""
import concurrent.futures
import datetime
import gzip
import io
import json
import re
import threading
import time
import urllib.parse
import urllib.robotparser
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent / 'runs' / '2026-09-11'
OUT = ROOT / 'crawl'
OUT.mkdir(exist_ok=True)
JOBS = json.loads((ROOT / 'crawl-seeds.json').read_text(encoding='utf-8'))
UA = 'OpportunityResearch/1.0 (public student-programme discovery)'
KEYWORDS = re.compile(r'\b(?:internships?|interns?|fellow\w*|scholar\w*|career\w*|vacan\w*|student\w*|young|youth|academy|summer.school|seminar\w*|grants?|essay|competition\w*|beca\w*|pasant\w*|estagio\w*|estágio\w*|praktik\w*|stipend\w*|akadem\w*|formacion|formación|utbild\w*|uddannelse|kurs\w*|opportunit\w*|talent|join-us|work-with-us|get-involved|recrut\w*|stages?|szkol\w*|staz\w*|école|sommer\w*|leadership)\b', re.I)
HUBS = re.compile(r'/(?:events|education|courses|training|learning|programs?|programmes|opportunities|careers?|vacancies|students)(?:/|$)', re.I)
PROGRAM_PATH = re.compile(r'\b(?:internships?|fellowships?|scholarships?|programs?|programmes|academy|courses?|summer.school|essay|competition\w*|career\w*|vacan\w*|beca\w*|pasant\w*|estagio\w*|estágio\w*|praktik\w*|stipend\w*|akadem\w*|formacion|formación|utbild\w*|uddannelse|kurs\w*|opportunit\w*|join-us|work-with-us|recrut\w*|szkol\w*|staz\w*|école|sommer\w*)\b', re.I)
ASSETS = re.compile(r'\.(jpg|jpeg|png|gif|svg|webp|mp4|mp3|zip|css|js|woff2?)(?:\?|$)', re.I)
PRINT_LOCK = threading.Lock()


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def run(job):
    dest = OUT / ('%03d.json' % job['index'])
    if dest.exists():
        previous = json.loads(dest.read_text(encoding='utf-8'))
        if previous.get('crawlFinished'):
            return previous
    result = previous if dest.exists() else dict(job, startedAt=now(), pages=[], sitemaps=[], blocked=[], candidates=[], stage='crawl_in_progress', crawlFinished=False)
    seen = {p['url'] for p in result['pages']}
    robots = {}
    last_request = {}
    session = requests.Session()
    session.headers['User-Agent'] = UA

    def save():
        checkpoint = dest.with_suffix('.tmp')
        checkpoint.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        checkpoint.replace(dest)

    def raw(url):
        host = urllib.parse.urlsplit(url).netloc
        delay = max(0, .4 - (time.monotonic() - last_request.get(host, 0)))
        if delay:
            time.sleep(delay)
        last_request[host] = time.monotonic()
        response = session.get(url, timeout=(8, 15))
        response.raise_for_status()
        return response

    def allowed(url):
        u = urllib.parse.urlsplit(url)
        origin = '%s://%s' % (u.scheme, u.netloc)
        if origin not in robots:
            rp = urllib.robotparser.RobotFileParser()
            rp.set_url(origin + '/robots.txt')
            try:
                response = raw(rp.url)
                rp.parse(response.text.splitlines())
                result['sitemaps'].extend(rp.site_maps() or [])
            except requests.HTTPError as e:
                status = e.response.status_code
                rp.parse(['User-agent: *', 'Disallow: /'] if status in (401, 403, 429) else [])
                result['blocked'].append({'url': rp.url, 'reason': 'HTTP %s' % status})
            except requests.RequestException as e:
                rp.parse(['User-agent: *', 'Disallow: /'])
                result['blocked'].append({'url': rp.url, 'reason': str(e)})
            robots[origin] = rp
        return robots[origin].can_fetch(UA, url)

    def fetch(url):
        if not allowed(url):
            result['blocked'].append({'url': url, 'reason': 'Robots restrictions or unavailable robots policy'})
            return None
        try:
            return raw(url)
        except requests.RequestException as e:
            result['blocked'].append({'url': url, 'reason': str(e)})
            return None

    if not job['base']:
        result.update(stage='identity_unresolved', crawlFinished=True, finishedAt=now())
        save()
        return result

    base = urllib.parse.urlsplit(job['base'])
    host = base.hostname.removeprefix('www.')
    prefix = base.path.rstrip('/')

    def eligible(url):
        u = urllib.parse.urlsplit(url)
        return u.scheme in ('http', 'https') and (u.hostname or '').removeprefix('www.') == host and (not prefix or u.path.startswith(prefix)) and not ASSETS.search(url)

    def canonical(url):
        u = urllib.parse.urlsplit(url)
        query = urllib.parse.parse_qsl(u.query)
        query = [(k, v) for k, v in query if not k.startswith('utm_') and k not in ('fbclid', 'gclid', 'replytocom')]
        return urllib.parse.urlunsplit((u.scheme, u.netloc, u.path, urllib.parse.urlencode(query), ''))

    def relevant(url):
        path = urllib.parse.unquote(urllib.parse.urlsplit(url).path).rstrip('/')
        leaf = path.rsplit('/', 1)[-1]
        if re.search(r'/(?:authors?|people|tags?|category|labels|cimkek|campus-watch|islamist-watch)/', path, re.I):
            return False
        if re.search(r'/(?:blog|news|article|articles|opinion|publication|publications|campus-watch|islamist-watch)/', path, re.I):
            return bool(re.search(r'internship|fellowship|scholarship|application|recruit|academy|summer-school|essay-prize|student-program', leaf, re.I))
        is_hub = bool(re.fullmatch(r'/(?:[a-z]{2}/)?(?:events|education|courses|training|learning|programs?|programmes|opportunities|careers?|vacancies|students)', path, re.I))
        return bool(PROGRAM_PATH.search(leaf) or is_hub)

    queue = [job['base']] + [u for u in job['seedUrls'] if eligible(u)]
    queue.extend(link['url'] for page in result['pages'] for link in page.get('links', []) if eligible(link['url']) and relevant(link['url']))
    allowed(job['base'])
    sitemap_queue = list(dict.fromkeys(item if isinstance(item, str) else item['url'] for item in result['sitemaps'])) or ['%s://%s/sitemap.xml' % (base.scheme, base.netloc)]
    sitemap_seen = set()
    while sitemap_queue:
        url = sitemap_queue.pop(0)
        if url in sitemap_seen:
            continue
        sitemap_seen.add(url)
        r = fetch(url)
        if r is None:
            continue
        try:
            payload = gzip.decompress(r.content) if url.endswith('.gz') else r.content
            tree = ET.fromstring(payload)
            locations = [e.text for e in tree.iter() if e.tag.split('}')[-1] == 'loc' and e.text]
            result['sitemaps'].append({'url': url, 'entries': len(locations)})
            if tree.tag.split('}')[-1] == 'sitemapindex':
                sitemap_queue.extend(u for u in locations if eligible(u))
            else:
                queue.extend(u for u in locations if eligible(u) and relevant(u))
        except (ET.ParseError, OSError):
            result['blocked'].append({'url': url, 'reason': 'Sitemap not parseable XML'})
        save()

    while queue:
        url = canonical(queue.pop(0))
        if url in seen:
            continue
        seen.add(url)
        r = fetch(url)
        if r is None:
            save()
            continue
        page = {'url': url, 'finalUrl': r.url, 'checkedAt': now(), 'httpStatus': r.status_code}
        if 'pdf' in r.headers.get('content-type', '') or urllib.parse.urlsplit(url).path.endswith('.pdf'):
            try:
                from pypdf import PdfReader
                body = '\n'.join(p.extract_text() or '' for p in PdfReader(io.BytesIO(r.content)).pages)
                page.update(title=url.rsplit('/', 1)[-1], text=body, links=[])
            except Exception as e:
                result['blocked'].append({'url': url, 'reason': 'PDF extraction unavailable: ' + str(e)})
                save()
                continue
        else:
            soup = BeautifulSoup(r.content, 'html.parser')
            links = []
            for a in soup.find_all('a', href=True):
                absolute = canonical(urllib.parse.urljoin(r.url, a['href']))
                label = a.get_text(' ', strip=True)
                if KEYWORDS.search(label + ' ' + urllib.parse.unquote(absolute)) or HUBS.search(absolute):
                    links.append({'url': absolute, 'label': label})
                    if eligible(absolute) and relevant(absolute):
                        queue.append(absolute)
            for node in soup(['script', 'style', 'nav', 'footer', 'header']):
                node.decompose()
            page.update(title=soup.title.get_text(' ', strip=True) if soup.title else '', text=soup.get_text(' ', strip=True), links=links)
            if len(page['text']) < 150:
                result['blocked'].append({'url': url, 'reason': 'Sparse page; needs rendered/manual review'})
        result['pages'].append(page)
        if KEYWORDS.search(page['title'] + ' ' + url):
            result['candidates'].append({'url': r.url, 'title': page['title'], 'status': 'requires_manual_verification'})
        result['queuedPages'] = len(set(queue) - seen)
        save()
    result.update(stage='crawl_finished_needs_review', crawlFinished=True, finishedAt=now())
    save()
    with PRINT_LOCK:
        print('%03d %s: %d pages, %d candidates, %d limitations' % (job['index'], job['name'], len(result['pages']), len(result['candidates']), len(result['blocked'])), flush=True)
    return result


if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=64) as executor:
        for _ in executor.map(run, JOBS):
            pass
    print('All registry entries attempted; manual verification and access limitations remain.', flush=True)
