const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const runsDir = path.join(__dirname, 'runs');
const requested = process.argv[2];
const newest = fs.readdirSync(runsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort()
  .at(-1);
const runDir = requested
  ? (requested.includes(path.sep) || requested.startsWith('.') ? path.resolve(requested) : path.join(runsDir, requested))
  : path.join(runsDir, newest || '');
if (!requested && !newest) throw new Error('No research run directory found');
const records = JSON.parse(fs.readFileSync(path.join(runDir, 'verified-programmes.json'), 'utf8'));
const target = path.join(root, 'dist/app.js');
const source = fs.readFileSync(target, 'utf8');
const boundary = source.indexOf('const typeOrder');
if (!source.startsWith('const opportunities = [') || boundary < 0) throw new Error('Unexpected app data layout');
JSON.parse(source.slice('const opportunities = '.length, boundary).trim().replace(/;$/, ''));
// The public "reviewed" label is still 11 Sep 2026. Do not change it in this sync.
const data = records.map(record => ({ ...record, source: 'Official source reviewed 11 Sep 2026' }));
fs.writeFileSync(target, `const opportunities = ${JSON.stringify(data, null, 2)};\n\n${source.slice(boundary)}`);
console.log(`Synced ${data.length} reviewed programmes from ${path.basename(runDir)}.`);
