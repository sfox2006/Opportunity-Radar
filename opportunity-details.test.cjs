const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync('dist/app.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(code.slice(0, code.indexOf('const state =')), context);
const items = vm.runInContext('opportunities', context);
const supportedTypes = vm.runInContext('typeOrder', context);
assert.equal(items.length, 75);
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
const byId = id => items.find(item => item.id === id);
const bpc = byId('bpc-spring-2027-internships');
assert.match(`${bpc.paid} ${bpc.fundingDetails} ${bpc.description}`, /part-time/i);
assert.match(`${bpc.paid} ${bpc.fundingDetails}`, /3,000/);
assert.equal(/6,?000/.test(`${bpc.paid} ${bpc.fundingDetails} ${bpc.description} ${bpc.deadline}`), false);
const fai = byId('fai-conservative-ai-policy-fellowship');
assert.match(fai.deadline, /30 October 2026/);
assert.match(`${fai.description} ${fai.eligibilityDetails}`, /conservative policy professionals/i);
assert.match(fai.eligibilityDetails, /not a general student programme/i);
const volcker = byId('volcker-nextgen-summer-policy-academy-2027');
assert.match(volcker.deadline, /15 December 2026, 11:59 pm PT \(Pacific\)/);
assert.equal(volcker.mapped, false);
const ppia = byId('ppia-junior-summer-institute-2027');
assert.match(ppia.deadline, /6 November 2026, 11:59 pm EST \(Eastern\)/);
assert.equal(ppia.mapped, false);
assert.match(byId('ij-semester-clerkship-spring-2027').eligibilityDetails, /law students/i);
assert.match(byId('ij-fall-2026-legal-intensive').eligibilityDetails, /law students/i);
assert.match(byId('ij-development-internship').description, /not a policy placement/i);
assert.match(byId('acton-spring-2027-semester-internship').deadline, /30 November 2026/);
assert.match(byId('atlas-network-spring-2027-internships').deadline, /31 December 2026/);
assert.equal(byId('yal-law-clerk-spring-2027').region, 'Online');
assert.equal(byId('ij-semester-clerkship-spring-2027').mapped, false);
for (const id of [
  'atlantic-council-ygp-spring-2027', 'bpc-summer-2027-internships', 'acton-emerging-leaders-program-2027',
  'ij-dave-kennedy-fellowship', 'ij-hellman-undergraduate-fellowship', 'roosevelt-network-forge',
  'roosevelt-network-roosevelt-in-washington', 'roosevelt-network-emerging', 'ashbrook-academy',
  'ifg-research-internship-2027-28', 'cbpp-spring-2027-internships', 'ppi-policy-fellow',
  'ppi-communications-government-relations-fellow', 'wilson-center-research-fellowship',
  'niskanen-internship-program', 'takshashila-nas-fellowship-2026-27', 'ile-puerto-rico-academia-libertad-liderazgo',
  'iseas-wang-gungwu-visiting-fellows'
]) {
  assert.equal(items.some(item => item.id === id), false, id);
}
assert.match(code, /Source reviewed 11 Sep 2026/);
console.log('PASS: 75 reviewed records, official HTTPS sources, status fields and independent link controls.');
