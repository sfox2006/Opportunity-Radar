const fs = require('node:fs');
const path = require('node:path');
const { parseIsoDate } = require('./check_opening_due.cjs');
const root = path.resolve(__dirname, '..');

function validateCatalogue(data, today = new Date()) {
  if (data.schema_version !== 1 || !Array.isArray(data.typeOrder) || !data.typeOrder.includes('Job')) throw new Error('Unsupported catalogue schema/types');
  if (new Set(data.typeOrder).size !== data.typeOrder.length) throw new Error('Duplicate opportunity types');
  if (!Array.isArray(data.opportunities) || !Array.isArray(data.openingSoon)) throw new Error('Missing catalogue arrays');
  const ids = new Set();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const month = start.getMonth() + 3;
  const end = new Date(start.getFullYear(), month, Math.min(start.getDate(), new Date(start.getFullYear(), month + 1, 0).getDate()));
  for (const [records, upcoming] of [[data.opportunities, false], [data.openingSoon, true]]) {
    for (const item of records) {
      if (!item.id || ids.has(item.id)) throw new Error(`Missing or duplicate id: ${item.id}`);
      ids.add(item.id);
      if (!data.typeOrder.includes(item.type)) throw new Error(`Unknown type: ${item.id}`);
      if (!item.organisation || !item.program || !item.source || !/^https:\/\//.test(item.url)) throw new Error(`Missing public source: ${item.id}`);
      if (item.reviewedAt && !parseIsoDate(item.reviewedAt)) throw new Error(`Invalid review date: ${item.id}`);
      if (upcoming) {
        const opens = parseIsoDate(item.opensOn);
        if (item.status !== 'upcoming' || !opens || !item.reviewedAt || opens <= start || opens > end) throw new Error(`Upcoming record requires review and a confirmed future opening within three calendar months: ${item.id}`);
      } else if (!['open', 'rolling', 'on-demand'].includes(item.status)) throw new Error(`Non-open record in Open now: ${item.id}`);
    }
  }
  return data;
}

function generate(data, runtime) {
  return `const opportunities = ${JSON.stringify(data.opportunities, null, 2)};\n\nconst typeOrder = ${JSON.stringify(data.typeOrder)};\n\n// Not-yet-open programmes with confirmed dates; never promote automatically.\nconst openingSoon = ${JSON.stringify(data.openingSoon, null, 2)};\n\n${runtime}`;
}

if (require.main === module) {
  const data = validateCatalogue(JSON.parse(fs.readFileSync(path.join(__dirname, 'catalogue.json'), 'utf8')));
  const expected = generate(data, fs.readFileSync(path.join(root, 'src/app.js'), 'utf8'));
  const target = path.join(root, 'dist/app.js');
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(target, 'utf8') !== expected) throw new Error('dist/app.js is stale; run node research/build_catalogue.cjs');
    console.log('Catalogue generated asset matches its authoritative inputs.');
  } else {
    fs.writeFileSync(target, expected);
    console.log(`Built ${data.opportunities.length} open and ${data.openingSoon.length} upcoming opportunities.`);
  }
}
module.exports = { validateCatalogue, generate };
