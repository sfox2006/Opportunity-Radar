const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync('dist/app.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(code.slice(0, code.indexOf('const state =')), context);
const items = vm.runInContext('opportunities', context);
const supportedTypes = vm.runInContext('typeOrder', context);
assert.equal(items.length, 65);
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
assert.equal(items.some(item => item.id === 'heritage-high-school-fellowship-2027'), false);
for (const id of ['fire-campus-2026', 'mercatus-complex-2027', 'tfas-santiago-2027', 'hoover-student-2026', 'aei-2601', 'aei-2602', 'aei-2607', 'aei-2627', 'tfas-asia', 'hudson-summer-fellowship-2027']) {
  assert.equal(items.some(item => item.id === id), false, id);
}
const hudson = items.find(item => item.id === 'hudson-policy-oct2026');
assert.equal(/fully funded/i.test(`${hudson.paid} ${hudson.fundingDetails}`), false);
assert.match(`${hudson.paid} ${hudson.fundingDetails}`, /free of charge/i);
assert.match(items.find(item => item.id === 'reason-journalism').deadline, /deadline year inferred; confirm on the official page/);
assert.match(items.find(item => item.id === 'tfas-dc-academic-internship-summer-2027').deadline, /deadline year inferred; confirm on the official page/);
assert.equal(items.find(item => item.id === 'hillsdale-online').region, 'Online');
assert.equal(items.find(item => item.id === 'plf-research-spring-2027').region, 'Online');
assert.equal(new Set(items.map(item => item.id)).size, items.length);
console.log('PASS: 65 reviewed records, official HTTPS sources, status fields and independent link controls.');
