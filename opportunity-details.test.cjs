const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync('dist/app.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(code.slice(0, code.indexOf('const state =')), context);
const items = vm.runInContext('opportunities', context);
const supportedTypes = vm.runInContext('typeOrder', context);
assert.equal(items.length, 81);
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
const manning = byId('manning-foundation-student-essay-contest-2026');
assert.equal(manning.type, 'Essay competition');
assert.equal(manning.region, 'Online');
assert.match(manning.deadline, /Midnight, Sunday 8 November 2026 \(time zone not stated\)/);
assert.match(`${manning.description} ${manning.eligibilityDetails}`, /Canadian undergraduates/i);
assert.match(`${manning.description} ${manning.eligibilityDetails}`, /not an internship/i);
assert.match(`${manning.paid} ${manning.fundingDetails}`, /\$7,000 in prizes/);
assert.equal(manning.url, 'https://manningfoundation.org/4th-annual-morgan-trottier-student-essay-contest/');
const piensa = byId('fundacion-piensa-jovenes-lideres-2026');
assert.match(`${piensa.description} ${piensa.fundingDetails}`, /recognition award/i);
assert.match(`${piensa.description} ${piensa.fundingDetails} ${piensa.paid}`, /no prize money|no money awarded/i);
assert.match(`${piensa.description} ${piensa.eligibilityDetails}`, /18-35/);
assert.match(`${piensa.description} ${piensa.eligibilityDetails}`, /Valpara[ií]so/);
assert.match(`${piensa.description} ${piensa.eligibilityDetails}`, /Spanish/);
assert.match(piensa.deadline, /23:59, Friday 30 October 2026 \(Chile time implied; time zone not stated\)/);
assert.equal(piensa.url, 'https://jovenesliderespiensa.cl/');
assert.match(piensa.application, /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSediVYK3-CZngcu0QNnN3BTAFcvySatmS6EP0nFvGiDPGCG3w\/viewform/);
const ifese = byId('ifese-studentenpresentaties-2027');
assert.equal(ifese.deadline, 'Closing date unclear on the official page, apply early.');
assert.equal(/1 May 2027|May 2027|mei 2027|donderdag/i.test(JSON.stringify(ifese)), false);
assert.match(`${ifese.description} ${ifese.eligibilityDetails}`, /Dutch-language/);
assert.match(`${ifese.description} ${ifese.eligibilityDetails}`, /[Bb]achelor/);
assert.match(`${ifese.description} ${ifese.eligibilityDetails}`, /five places/);
assert.match(`${ifese.description} ${ifese.eligibilityDetails}`, /first come, first served/);
assert.match(ifese.application, /jens\.vanmieghem@ifese\.be/);
assert.equal(ifese.mapped, false);
assert.equal(ifese.url, 'https://www.ifese.be/studenten/studentenpresentaties/');
const hayek = byId('hayek-gesellschaft-juniorenkreis-wissenschaft-potsdam-2026');
assert.equal(hayek.type, 'Seminar');
assert.match(`${hayek.program} ${hayek.description}`, /academic weekend/i);
assert.match(`${hayek.description} ${hayek.eligibilityDetails}`, /not an internship/i);
assert.match(`${hayek.description} ${hayek.duration} ${hayek.deadline}`, /Friday 6 to Sunday 8 November 2026/);
assert.match(`${hayek.eligibilityDetails} ${hayek.description}`, /18-35/);
assert.match(`${hayek.eligibilityDetails} ${hayek.description}`, /German/);
assert.match(`${hayek.deadline} ${hayek.application}`, /[Nn]o fixed deadline/);
assert.match(hayek.application, /KF_Israel\[at\]gmx\.de/);
assert.equal(hayek.url, 'https://hayek.de/veranstaltungen/juniorenkreis-wissenschaft-kapital-produktion-und-kapitalismus/');
const insm = byId('iw-koeln-insm-studentischer-mitarbeiter-volkswirtschaft');
const koeln = byId('iw-koeln-student-finanz-immobilienmaerkte');
for (const job of [insm, koeln]) {
  assert.match(`${job.program} ${job.description} ${job.eligibilityDetails}`, /[Ss]tudent job \(Werkstudent/);
  assert.match(`${job.description} ${job.eligibilityDetails}`, /not an internship/i);
  assert.match(`${job.description} ${job.eligibilityDetails}`, /German/);
  assert.match(job.deadline, /Rolling until filled/);
}
assert.match(koeln.deadline, /Starts 1 October 2026 and may already be filled/);
assert.equal(/already be filled/.test(insm.deadline), false);
assert.equal(insm.url, 'https://k60828.coveto.de/job-studentischer-mitarbeiter-volkswirtschaft-wirtschaftspolitik-m-w-d-berlin-1173.html');
assert.equal(koeln.url, 'https://k60828.coveto.de/job-studentischer-mitarbeiter-m-w-d-mit-dem-schwerpunkt-finanz-und-immobilienmaerkte-koeln-1174.html');
console.log('PASS: 81 reviewed records, official HTTPS sources, status fields and independent link controls.');
