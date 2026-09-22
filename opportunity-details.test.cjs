const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync('dist/app.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(code.slice(0, code.indexOf('const state =')), context);
const items = vm.runInContext('opportunities', context);
const supportedTypes = vm.runInContext('typeOrder', context);
assert.equal(items.length, 56);
for (const item of items) {
  assert.ok(supportedTypes.includes(item.type), `${item.id}: unsupported filter type ${item.type}`);
  for (const key of ['description', 'location', 'duration', 'paid', 'deadline', 'eligibilityDetails', 'application', 'url']) {
    assert.ok(item[key] && item[key].length > 0, `${item.id}: missing ${key}`);
  }
  assert.equal(new URL(item.url).protocol, 'https:');
  assert.notEqual(item.deadline, 'Applications open');
  assert.ok(['open', 'rolling', 'on-demand'].includes(item.status));
  if (item.mapped !== false && item.region !== 'Online' && item.country !== 'Global') {
    assert.ok(Number.isFinite(item.lat) && Number.isFinite(item.lon));
  }
}
assert.match(code, /if \(!event.target.closest\("a, button, summary, input"\)\) select\(\)/);
assert.match(code, /if \(event.target !== card\) return/);
assert.match(code, /class="opportunity-facts"/);
assert.match(code, /rel="noopener noreferrer"/);
assert.equal(items.some(item => item.id === 'maxim-internship'), false);
assert.equal(new Set(items.map(item => item.id)).size, items.length);
console.log('PASS: 56 reviewed records, official HTTPS sources, status fields and independent link controls.');
