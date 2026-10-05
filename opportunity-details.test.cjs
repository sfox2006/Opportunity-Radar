const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = readFileSync('dist/app.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(code.slice(0, code.indexOf('const state =')), context);
const items = vm.runInContext('opportunities', context);
const supportedTypes = vm.runInContext('typeOrder', context);
assert.equal(items.length, 130);
assert.equal(items.some(item => item.id === 'martin-center-internship-next-semester'), true);
for (const [id, status, deadline] of [
  ['libertas-institute-research-internship', 'rolling', 'Rolling (no deadline printed); apply by email with cover letter, resume and one writing sample'],
  ['independence-institute-kip-spring-2027', 'rolling', 'Rolling through December 2026 (KIP); see posting for exact deadline'],
  ['independent-institute-learning-to-lead-internships', 'rolling', 'Winter/Spring deadline Thu 1 Oct 2026 has passed, but the page says late applications are considered while positions remain; Summer deadline Thu 1 Apr 2027 (year inferred)']
]) {
  const added = items.find(item => item.id === id);
  assert.ok(added, id);
  assert.equal(added.status, status);
  assert.equal(added.type, 'Internship');
  assert.equal(added.deadline, deadline);
  assert.equal(added.reviewedAt, '2026-10-04');
  assert.equal(added.mapped, false);
}
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
assert.match(items.find(item => item.id === 'tfas-dc-academic-internship-summer-2027').deadline, /Thursday 8 October 2026/);
assert.match(items.find(item => item.id === 'tfas-dc-academic-internship-summer-2027').deadline, /deadline year inferred; confirm on the official page/);
assert.equal(items.find(item => item.id === 'tfas-dc-academic-internship-summer-2027').deadlineOn, '2026-10-08');
assert.equal(items.find(item => item.id === 'hillsdale-in-dc-internship').status, 'rolling');
assert.equal(items.find(item => item.id === 'libertas-institute-research-internship').url, 'https://libertas.institute/about/internships/');
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
for (const id of [
  'ppia-junior-summer-institute-2027',
  'ij-semester-clerkship-spring-2027',
  'ij-fall-2026-legal-intensive',
  'yal-law-clerk-spring-2027',
  'aier-graduate-fellowships-spring-2027',
  'siepr-predoctoral-fellows-2027',
  'hudson-internship-program-fall-2026',
  'iw-koeln-student-finanz-immobilienmaerkte',
  'texas-scorecard-fellowship-spring-2027'
]) {
  assert.equal(items.some(item => item.id === id), false, id);
}
assert.match(byId('ij-development-internship').description, /not a policy placement/i);
assert.match(byId('acton-spring-2027-semester-internship').deadline, /30 November 2026/);
assert.match(byId('atlas-network-spring-2027-internships').deadline, /31 December 2026/);
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
assert.ok(items.every((item) => item.source === "Official source reviewed 11 Sep 2026"));
const sourceLabel = vm.runInContext('sourceLabel', context);
const octoberReviewed = [
  'iea-media-internship', 'vinson-hayek-internships', 'liberales-institut-liberty-summer-school-2027',
  'capital-research-center-internships', 'alec-internship-program',
  'beacon-center-tn-internships', 'moving-picture-institute-hollywood-career-launch',
  'martin-center-internship-next-semester', 'sfl-global-performance-department-intern',
  'frc-internship-spring-2027', 'frc-internship-summer-2027', 'american-moment-fellowship-summer-2027',
  'cra-internship-spring-2027', 'haultain-internship-winter-2027', 'sfpa-college-fix-dc-journalism-spring-2027',
  'jmi-internship-spring-2027', 'mises-university-2027', 'mei-liberty-leadership-seminar-2027',
  'isi-collegiate-network-internship-2027', 'hillsdale-in-dc-internship', 'libertas-institute-research-internship',
  'independence-institute-kip-spring-2027', 'independent-institute-learning-to-lead-internships',
  'koch-internship-program-summer-2027', 'prometheus-praktikum', 'ccs-scnc-2026'
];
for (const id of octoberReviewed) {
  assert.equal(sourceLabel(byId(id)), 'Official source reviewed 4 Oct 2026', id);
}
assert.equal(
  items.filter(item => item.reviewedAt === '2026-10-04').map(item => item.id).sort().join('|'),
  octoberReviewed.slice().sort().join('|')
);
assert.equal(sourceLabel(byId('hudson-policy-oct2026')), 'Official source reviewed 11 Sep 2026');
assert.equal(hudson.organisation, 'Hudson Institute');
assert.equal(hudson.program, "Policy Certificate: Israel's Place in the American Order");
assert.equal(hudson.status, 'rolling');
assert.equal(hudson.reviewedAt, '2026-10-01');
assert.equal(hudson.url, 'https://hudsonpoliticalstudies.org/policy/5BC60zDKIwHJwPNvxxGJpG');
const batch17 = ['hudson-political-studies-summer-fellowship-2027', 'hertog-humanities-winter-2027'];
const batch18 = [
  'young-voices-contributor-spring-2027',
  'heritage-young-leaders-spring-2027',
  'heritage-young-leaders-summer-2027',
  'goldwater-ronald-reagan-fellowship',
  'mrc-internships-spring-2027'
];
assert.equal(
  items.filter(item => item.reviewedAt === '2026-10-05').map(item => item.id).sort().join('|'),
  batch17.concat(batch18).slice().sort().join('|')
);
for (const id of batch17.concat(batch18)) {
  assert.equal(sourceLabel(byId(id)), 'Official source reviewed 5 Oct 2026', id);
  assert.equal(byId(id).source, 'Official source reviewed 11 Sep 2026', id);
}
for (const id of batch17) {
  assert.equal(byId(id).status, 'open', id);
}
assert.equal(sourceLabel(byId('mercatus-markets-society-conference-2026')), 'Official source reviewed 11 Sep 2026');
const openingCards = vm.runInContext('openingSoon', context);
for (const id of ['yaf-njc-summer-2027', 'centrum-for-rattvisa-sommarnotarie-2027', 'claremont-publius-fellowship-2027']) {
  assert.equal(sourceLabel(openingCards.find(item => item.id === id)), 'Official source reviewed 4 Oct 2026', id);
}
assert.match(code, /sourceLabel\(item\)/);
assert.match(code, /reviewed\.replace\(\/\^Official source reviewed \/, ""\)/);
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
assert.match(`${insm.program} ${insm.description} ${insm.eligibilityDetails}`, /[Ss]tudent job \(Werkstudent/);
assert.match(`${insm.description} ${insm.eligibilityDetails}`, /not an internship/i);
assert.match(`${insm.description} ${insm.eligibilityDetails}`, /German/);
assert.match(insm.deadline, /Rolling until filled/);
assert.equal(/already be filled/.test(insm.deadline), false);
assert.equal(insm.url, 'https://k60828.coveto.de/job-studentischer-mitarbeiter-volkswirtschaft-wirtschaftspolitik-m-w-d-berlin-1173.html');
const iness = byId('iness-ekonomicky-base-camp-2026');
assert.equal(iness.type, 'Seminar');
assert.equal(iness.region, 'Europe');
assert.match(iness.deadline, /Monday 5 October 2026/);
assert.match(iness.deadline, /no time or time zone stated/);
assert.match(`${iness.description} ${iness.deadline}`, /few days away|Closes in a few days/);
assert.match(`${iness.description} ${iness.paid} ${iness.fundingDetails}`, /FEE-BASED/);
assert.match(`${iness.description} ${iness.paid} ${iness.fundingDetails}`, /EUR 159/);
assert.match(`${iness.description} ${iness.paid} ${iness.fundingDetails}`, /EUR 299/);
assert.match(`${iness.description} ${iness.paid} ${iness.fundingDetails}`, /EUR 109/);
assert.match(`${iness.description} ${iness.fundingDetails}`, /scholarship/);
assert.match(`${iness.description} ${iness.eligibilityDetails}`, /Slovak-language/);
assert.match(`${iness.description} ${iness.eligibilityDetails}`, /[Ss]tudents are prioritised/);
assert.match(`${iness.description} ${iness.location}`, /Martin/);
assert.match(iness.application, /iness@iness\.sk/);
assert.match(iness.application, /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLScJGDp8ak8PZd3MjZFUTg51H8KSKSnLxRj3QzoM1P8rodomRg\/viewform/);
assert.equal(iness.url, 'https://ekonomickybasecamp.sk/prihlasovanie/');
const praktik = byId('centrum-for-rattvisa-praktik-var-2027');
assert.equal(praktik.type, 'Internship');
assert.equal(praktik.region, 'Europe');
assert.equal(praktik.paid, 'No');
assert.match(`${praktik.description} ${praktik.eligibilityDetails} ${praktik.fundingDetails}`, /[Uu]npaid/);
assert.match(`${praktik.description} ${praktik.eligibilityDetails}`, /[Ll]aw students/);
assert.match(`${praktik.description} ${praktik.eligibilityDetails}`, /[Pp]robably Swedish-language/);
assert.match(`${praktik.description} ${praktik.duration}`, /10 weeks/);
assert.match(`${praktik.description} ${praktik.deadline} ${praktik.application}`, /[Rr]olling/);
assert.match(praktik.deadline, /Sunday 11 October 2026/);
assert.match(praktik.deadline, /no time or time zone stated/);
assert.match(praktik.application, /rekrytering@centrumforrattvisa\.se/);
assert.equal(praktik.url, 'https://centrumforrattvisa.se/student/praktik/');
const fil = byId('fil-vi-premio-periodismo-joven-carlos-alberto-montaner');
assert.equal(fil.type, 'Essay competition');
assert.equal(fil.region, 'Online');
assert.match(`${fil.program} ${fil.description} ${fil.paid}`, /PRIZE/);
assert.match(`${fil.description} ${fil.eligibilityDetails}`, /journalists under 35/);
assert.match(`${fil.description} ${fil.eligibilityDetails}`, /any nationality/);
assert.match(`${fil.description} ${fil.eligibilityDetails}`, /Spanish-language/);
assert.match(`${fil.description} ${fil.eligibilityDetails} ${fil.fundingDetails}`, /not a student programme or internship/);
assert.match(`${fil.paid} ${fil.fundingDetails}`, /USD 10,000/);
assert.match(fil.deadline, /Sunday 25 October 2026/);
assert.match(fil.deadline, /no time or time zone stated/);
assert.equal(fil.url, 'https://catedravargasllosa.org/inicio/index.php/premio-periodismo-joven/');
const shaftesbury = byId('first-liberty-crcd-shaftesbury-fellowship-2027');
assert.equal(shaftesbury.type, 'Fellowship');
assert.equal(shaftesbury.region, 'United States');
assert.equal(shaftesbury.eligibility, 'Some restrictions');
assert.equal(shaftesbury.paid, 'Stipend plus housing');
assert.match(shaftesbury.paid, /stipend/i);
assert.match(`${shaftesbury.paid} ${shaftesbury.fundingDetails}`, /housing/i);
assert.match(`${shaftesbury.description} ${shaftesbury.eligibilityDetails}`, /upper-level undergraduates and recent graduates/i);
assert.match(`${shaftesbury.description} ${shaftesbury.eligibilityDetails}`, /liberty-related field/i);
assert.match(`${shaftesbury.description} ${shaftesbury.eligibilityDetails}`, /Christian-oriented religion, culture and democracy/i);
assert.match(`${shaftesbury.description} ${shaftesbury.location} ${shaftesbury.duration}`, /Plano, Texas/);
assert.match(`${shaftesbury.description} ${shaftesbury.duration}`, /24 May to 30 July 2027/);
assert.match(`${shaftesbury.description} ${shaftesbury.duration}`, /about 10 weeks/i);
assert.match(`${shaftesbury.description} ${shaftesbury.fundingDetails}`, /weekly stipend/i);
assert.match(`${shaftesbury.description} ${shaftesbury.fundingDetails}`, /non-US citizens may be ineligible for the stipend/i);
assert.match(`${shaftesbury.deadline} ${shaftesbury.description} ${shaftesbury.application}`, /Monday 15 February 2027/);
assert.match(`${shaftesbury.deadline} ${shaftesbury.application}`, /no time or time zone stated/);
assert.match(`${shaftesbury.deadline} ${shaftesbury.description} ${shaftesbury.application}`, /[Rr]olling/);
assert.match(shaftesbury.application, /Paycor portal \(not checked by us\)/);
assert.match(shaftesbury.application, /jbarr@firstliberty\.org/);
assert.equal(shaftesbury.url, 'https://crcd.net/programs/shaftesbury-fellowship/');
assert.equal(shaftesbury.source, 'Official source reviewed 11 Sep 2026');
const johnjay = byId('john-jay-fellows-spring-2027');
assert.equal(johnjay.type, 'Fellowship');
assert.equal(johnjay.region, 'United States');
assert.equal(johnjay.eligibility, 'Some restrictions');
assert.match(johnjay.paid, /stipend/i);
assert.match(johnjay.paid, /free/i);
assert.notEqual(johnjay.paid, 'No');
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /explicitly Christian programme/);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /demonstrated Christian commitment/i);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /daily group prayer/);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /live-in Christian community/);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /recent college graduates and young professionals/i);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /not current students/i);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /completed college/i);
assert.match(`${johnjay.description} ${johnjay.eligibilityDetails}`, /GPA 3\.0\+/);
assert.match(`${johnjay.description} ${johnjay.location} ${johnjay.duration}`, /Langhorne, Pennsylvania/);
assert.match(`${johnjay.description} ${johnjay.location}`, /live-in residency/i);
assert.match(`${johnjay.description} ${johnjay.duration}`, /Friday 8 January to Saturday 24 April 2027/);
assert.match(`${johnjay.description} ${johnjay.duration}`, /about four months/i);
assert.match(`${johnjay.description} ${johnjay.paid} ${johnjay.fundingDetails}`, /\$875 monthly stipend/);
assert.match(`${johnjay.description} ${johnjay.fundingDetails}`, /[Tt]uition free/);
assert.match(`${johnjay.description} ${johnjay.fundingDetails}`, /free housing/);
assert.match(`${johnjay.description} ${johnjay.fundingDetails}`, /externship afterwards is unpaid unless the host pays/);
assert.match(`${johnjay.deadline} ${johnjay.application}`, /Sunday 1 November 2026/);
assert.match(`${johnjay.deadline} ${johnjay.application}`, /no time or time zone stated/);
assert.match(johnjay.application, /not opened by us/);
assert.match(johnjay.application, /admin@johnjayinstitute\.org/);
assert.equal(johnjay.url, 'https://www.johnjayfellows.com/academic-calendar');
assert.equal(johnjay.source, 'Official source reviewed 11 Sep 2026');
const ocpa = byId('ocpa-fears-fellowship-okc-2027');
assert.equal(ocpa.type, 'Seminar');
assert.equal(ocpa.region, 'United States');
assert.equal(ocpa.eligibility, 'Some restrictions');
assert.equal(ocpa.paid, 'Not stated');
assert.equal(/Paid|stipend|Scholarship|Prize|Free/i.test(ocpa.paid), false);
assert.match(`${ocpa.description} ${ocpa.eligibilityDetails}`, /young leaders aged 18 to 35/i);
assert.match(`${ocpa.description} ${ocpa.eligibilityDetails}`, /professionals and students/i);
assert.match(`${ocpa.program} ${ocpa.description} ${ocpa.eligibilityDetails}`, /reading and lecture seminar/i);
assert.match(`${ocpa.description} ${ocpa.location} ${ocpa.duration}`, /Oklahoma City/);
assert.match(`${ocpa.description} ${ocpa.duration}`, /in-person Saturday sessions/i);
assert.match(`${ocpa.description} ${ocpa.duration}`, /9:30 am to 1:00 pm/);
assert.match(`${ocpa.description} ${ocpa.duration}`, /23 January, 6 February, 20 February, 6 March and 20 March 2027/);
assert.match(`${ocpa.description} ${ocpa.eligibilityDetails}`, /[Ll]imited places/);
assert.match(`${ocpa.description} ${ocpa.application}`, /request form only/i);
assert.match(`${ocpa.description} ${ocpa.paid} ${ocpa.fundingDetails}`, /[Nn]ot stated/);
assert.match(`${ocpa.description} ${ocpa.fundingDetails}`, /no fee mentioned on the pages we read/);
assert.match(`${ocpa.deadline} ${ocpa.application}`, /Friday 18 December 2026/);
assert.match(`${ocpa.deadline} ${ocpa.application}`, /no time or time zone stated/);
assert.match(ocpa.application, /Matt@OCPAthink\.org/);
assert.equal(ocpa.url, 'https://www.fearsfellowship.com/a-3-lightbox.html');
assert.equal(ocpa.source, 'Official source reviewed 11 Sep 2026');
assert.equal(/2023|Copyright|planned for OKC and Tulsa/i.test(JSON.stringify(ocpa)), false);
const aeasp = byId('aeasp-summer-2027');
assert.equal(aeasp.type, 'Fellowship');
assert.equal(aeasp.region, 'United States');
assert.equal(aeasp.eligibility, 'Some restrictions');
assert.equal(aeasp.lat, 38.9072);
assert.equal(aeasp.lon, -77.0369);
assert.match(aeasp.paid, /stipend/i);
assert.equal(/free/i.test(aeasp.paid), false);
assert.match(`${aeasp.description} ${aeasp.eligibilityDetails}`, /open to all ethnicities/i);
assert.match(`${aeasp.description} ${aeasp.eligibilityDetails}`, /regardless of ethnicity/i);
assert.match(`${aeasp.description} ${aeasp.eligibilityDetails}`, /full 8 weeks free/i);
assert.match(`${aeasp.description} ${aeasp.paid} ${aeasp.fundingDetails}`, /\$3,250/);
assert.match(`${aeasp.description} ${aeasp.eligibilityDetails} ${aeasp.fundingDetails}`, /US citizens and permanent residents/);
assert.match(`${aeasp.description} ${aeasp.eligibilityDetails} ${aeasp.fundingDetails}`, /about \$25,000/);
assert.match(`${aeasp.description} ${aeasp.location}`, /Washington, DC/);
assert.match(`${aeasp.deadline} ${aeasp.application}`, /Sunday 31 January 2027/);
assert.match(`${aeasp.deadline} ${aeasp.application}`, /no time or time zone stated/);
assert.match(aeasp.application, /aeasp@american\.edu/);
assert.equal(aeasp.url, 'https://www.aeaweb.org/about-aea/committees/aeasp');
assert.equal(aeasp.source, 'Official source reviewed 11 Sep 2026');
const partnership = byId('partnership-public-service-internship-spring-2027');
assert.equal(partnership.type, 'Internship');
assert.equal(partnership.lat, 38.9072);
assert.equal(partnership.lon, -77.0369);
assert.match(partnership.paid, /Paid/);
assert.match(`${partnership.paid} ${partnership.fundingDetails}`, /\$2,000 per month/);
assert.match(`${partnership.description} ${partnership.eligibilityDetails}`, /[Uu]ndergraduates, graduate students and recent graduates/);
assert.match(`${partnership.deadline} ${partnership.description} ${partnership.application}`, /Monday 19 October 2026/);
assert.match(`${partnership.deadline} ${partnership.description} ${partnership.application}`, /page prints no year/);
assert.match(`${partnership.deadline} ${partnership.description} ${partnership.application}`, /2026 year is inferred from the weekday and the Spring 2027 section/);
assert.match(`${partnership.description} ${partnership.application}`, /[Nn]o email is printed/);
assert.match(`${partnership.description} ${partnership.application}`, /\(202\) 775-9111/);
assert.equal(partnership.url, 'https://ourpublicservice.org/about/work-with-us/partnership-internship-program');
const kip = byId('stand-together-koch-internship-spring-2027');
assert.equal(kip.type, 'Internship');
assert.equal(kip.status, 'rolling');
assert.equal(kip.lat, 38.8816);
assert.equal(kip.lon, -77.091);
assert.match(kip.paid, /[Ss]tipend/);
assert.match(`${kip.paid} ${kip.fundingDetails} ${kip.description}`, /\$7,500/);
assert.match(`${kip.paid} ${kip.fundingDetails} ${kip.description}`, /\$5,500/);
assert.match(`${kip.description} ${kip.eligibilityDetails}`, /[Cc]urrent students only/);
assert.match(`${kip.deadline} ${kip.description} ${kip.application}`, /[Rr]olling through December 2026/);
assert.match(`${kip.deadline} ${kip.description} ${kip.application}`, /apply and accept a partner offer/);
assert.equal(kip.url, 'https://standtogetherfellowships.org/koch-internship-program/');
for (const id of [
  'cbcf-pathways-csuite-summer-2027',
  'chci-congressional-internship-summer-2027',
  'chci-public-policy-fellowship-2027-28',
  'apaics-office-internship-spring-2027',
  'apaics-congressional-internship-summer-2027'
]) {
  assert.equal(items.some(item => item.id === id), false, id);
}
assert.equal(items.some(item => item.id === 'hudson-policy-oct2026'), true);
const afpi = byId('afpi-spring-2027-internships');
assert.equal(afpi.type, 'Internship');
assert.equal(afpi.region, 'United States');
assert.equal(afpi.eligibility, 'Some restrictions');
assert.equal(afpi.lat, 38.9072);
assert.equal(afpi.lon, -77.0369);
assert.match(afpi.paid, /stipend/i);
assert.equal(/free/i.test(afpi.paid), false);
assert.match(`${afpi.paid} ${afpi.fundingDetails}`, /amount not stated/);
assert.match(`${afpi.description} ${afpi.eligibilityDetails}`, /[Ss]tudents and recent graduates/);
assert.match(`${afpi.description} ${afpi.duration} ${afpi.location}`, /January-April 2027/);
assert.match(`${afpi.description} ${afpi.location}`, /Washington, DC/);
assert.match(`${afpi.description} ${afpi.location}`, /in person/);
assert.match(`${afpi.deadline} ${afpi.description} ${afpi.application}`, /Friday 30 October 2026/);
assert.match(`${afpi.deadline} ${afpi.description} ${afpi.application}`, /page prints no year/);
assert.match(`${afpi.deadline} ${afpi.description} ${afpi.application}`, /22 September 2026 posting/);
assert.match(`${afpi.deadline} ${afpi.description} ${afpi.application}`, /Spring 2027 title/);
assert.match(`${afpi.description} ${afpi.application}`, /[Nn]o contact email/);
assert.equal(/@/.test(`${afpi.application} ${afpi.description}`), false);
assert.equal(afpi.url, 'https://americafirstpolicy.com/careers/internships-for-spring-2027-washington-dc/');
assert.equal(afpi.source, 'Official source reviewed 11 Sep 2026');
const tpif = byId('tpif-fellowship-2027');
assert.equal(tpif.type, 'Fellowship');
assert.equal(tpif.region, 'United States');
assert.equal(tpif.eligibility, 'Some restrictions');
assert.equal(tpif.mapped, false);
assert.match(tpif.paid, /Paid/);
assert.equal(/free/i.test(tpif.paid), false);
assert.match(`${tpif.paid} ${tpif.fundingDetails}`, /amount not stated/);
assert.match(`${tpif.description} ${tpif.eligibilityDetails}`, /up to five years/);
assert.match(`${tpif.description} ${tpif.duration}`, /[Tt]wo years/);
assert.match(`${tpif.description} ${tpif.location}`, /Washington, DC or New York/);
assert.match(`${tpif.deadline} ${tpif.description} ${tpif.application}`, /Wednesday 16 December 2026/);
assert.match(`${tpif.deadline} ${tpif.description} ${tpif.application}`, /2026 cohort/);
assert.match(`${tpif.description} ${tpif.application}`, /[Nn]o email is printed/);
assert.equal(/abby@/i.test(JSON.stringify(tpif)), false);
assert.equal(tpif.url, 'https://publicinterestfellowship.org/programs/the-public-interest-fellowship-tpif/');
assert.equal(tpif.source, 'Official source reviewed 11 Sep 2026');
assert.equal(/abby@/i.test(JSON.stringify(items)), false);
const ev = byId('mercatus-emergent-ventures');
assert.equal(ev.type, 'Fellowship');
assert.equal(ev.status, 'rolling');
assert.equal(ev.region, 'Online');
assert.equal(ev.country, 'Global');
assert.equal(ev.lat, null);
assert.equal(ev.lon, null);
assert.equal(ev.eligibility, 'Some restrictions');
assert.match(ev.deadline, /No deadline: rolling/);
assert.match(`${ev.deadline} ${ev.description}`, /[Uu]ndated/);
assert.match(`${ev.paid} ${ev.fundingDetails}`, /amount not stated/);
assert.match(ev.paid, /Grant/);
assert.equal(/free/i.test(ev.paid), false);
assert.match(`${ev.description} ${ev.eligibilityDetails}`, /13/);
assert.match(ev.application, /emergentventures@mercatus\.gmu\.edu/);
assert.equal(ev.url, 'https://www.mercatus.org/emergent-ventures');
assert.equal(ev.reviewedAt, '2026-10-03');
assert.equal(ev.source, 'Official source reviewed 11 Sep 2026');
const collegiate = byId('manhattan-institute-collegiate-associates');
assert.equal(collegiate.type, 'Internship');
assert.equal(collegiate.status, 'rolling');
assert.equal(collegiate.eligibility, 'Some restrictions');
assert.equal(collegiate.lat, 40.7128);
assert.equal(collegiate.lon, -74.006);
assert.match(collegiate.paid, /Paid/);
assert.equal(/free/i.test(collegiate.paid), false);
assert.match(`${collegiate.paid} ${collegiate.fundingDetails}`, /\$17/);
assert.match(`${collegiate.paid} ${collegiate.fundingDetails}`, /New York and California/);
assert.match(`${collegiate.description} ${collegiate.eligibilityDetails}`, /3\.25/);
assert.match(`${collegiate.description} ${collegiate.location}`, /remote/i);
assert.match(`${collegiate.deadline} ${collegiate.description} ${collegiate.application}`, /Sunday 15 November 2026/);
assert.match(`${collegiate.deadline} ${collegiate.description} ${collegiate.application}`, /page prints no year/);
assert.match(`${collegiate.deadline} ${collegiate.description} ${collegiate.application}`, /2026 year is inferred/);
assert.match(collegiate.application, /cap@manhattan\.institute/);
assert.equal(collegiate.url, 'https://job-boards.greenhouse.io/manhattaninstituteforpolicyresearchinc/jobs/4001718009');
assert.equal(collegiate.reviewedAt, '2026-10-03');
assert.equal(collegiate.source, 'Official source reviewed 11 Sep 2026');
const markets = byId('mercatus-markets-society-conference-2026');
assert.equal(markets.type, 'Conference');
assert.equal(markets.status, 'open');
assert.equal(markets.region, 'United States');
assert.equal(markets.lat, 38.8823);
assert.equal(markets.lon, -77.1711);
assert.match(markets.duration, /Friday 23 to Monday 26 October 2026/);
assert.match(markets.location, /Falls Church, Virginia/);
assert.match(markets.deadline, /Hotel conference-rate booking deadline Fri 9 Oct 2026/);
assert.match(markets.deadline, /Fri 23 to Mon 26 Oct 2026, Falls Church, VA/);
assert.equal(markets.deadlineOn, '2026-10-09');
assert.equal(/no cutoff printed/i.test(JSON.stringify(markets)), false);
assert.equal(/no registration fee/i.test(JSON.stringify(markets)), false);
assert.equal(/free/i.test(markets.paid), false);
assert.match(markets.application, /marketsandsociety@mercatus\.gmu\.edu/);
assert.equal(markets.url, 'https://www.marketsandsociety.org/conference');
assert.equal(markets.reviewedAt, '2026-10-03');
assert.equal(markets.source, 'Official source reviewed 11 Sep 2026');
assert.match(`${markets.description} ${markets.application} ${markets.fundingDetails}`, /external Cvent page/);
assert.match(`${markets.description} ${markets.application} ${markets.fundingDetails}`, /\$143/);
assert.match(`${markets.description} ${markets.application} ${markets.fundingDetails}`, /Friday 9 October 2026/);
assert.match(`${markets.description} ${markets.application} ${markets.fundingDetails}`, /\$18 a day/);
assert.equal(/free/i.test(`${markets.paid} ${markets.deadline}`), false);
for (const id of ['reason-journalism', 'reason-policy', 'reason-marketing', 'reason-video-production']) {
  const role = byId(id);
  assert.match(`${role.paid} ${role.fundingDetails}`, /\$20\/hour/);
  assert.equal(/17\.50/.test(`${role.paid} ${role.fundingDetails} ${role.description}`), false);
  assert.match(role.deadline, /Friday 20 November 2026/);
  assert.match(role.deadline, /Friday 5 March 2027/);
  assert.match(role.deadline, /deadline year inferred; confirm on the official page/);
}
assert.match(byId('reason-policy').location, /Washington, DC or virtual/);
assert.match(byId('reason-marketing').location, /Washington, DC or virtual/);
assert.match(byId('reason-journalism').location, /Washington, DC only/);
assert.match(byId('reason-journalism').duration, /full-time/);
assert.match(byId('reason-video-production').location, /Washington, DC only/);
assert.match(byId('reason-video-production').duration, /full-time/);
const atlas = byId('atlas-network-spring-2027-internships');
assert.match(atlas.deadline, /Thursday 31 December 2026/);
assert.match(atlas.deadline, /2026 year is inferred/);
assert.match(`${atlas.paid} ${atlas.fundingDetails}`, /\$15/);
assert.match(`${atlas.location} ${atlas.description}`, /[Ii]n person or hybrid/);
assert.match(atlas.eligibilityDetails, /We do accept OPT\/CPT candidates/);
assert.match(atlas.eligibilityDetails, /[Vv]isa sponsorship is not offered/);
assert.match(atlas.eligibilityDetails, /US work authorisation is required/);
assert.match(`${kip.description} ${kip.duration} ${kip.location}`, /about 10 weeks by the dates/);
assert.match(`${kip.description} ${kip.duration}`, /1:00-4:00 pm ET/);
assert.match(`${kip.description} ${kip.duration} ${kip.location}`, /headquarters/);
assert.equal(/hybrid/i.test(JSON.stringify(kip)), false);
const cei = byId('cei-internships-spring-2027');
assert.equal(cei.type, 'Internship');
assert.equal(cei.status, 'open');
assert.equal(cei.eligibility, 'Some restrictions');
assert.equal(cei.lat, 38.9072);
assert.equal(cei.lon, -77.0369);
assert.match(cei.paid, /[Ss]tipend/);
assert.equal(/free/i.test(cei.paid), false);
assert.match(`${cei.paid} ${cei.fundingDetails} ${cei.description}`, /\$500/);
assert.match(`${cei.fundingDetails} ${cei.description}`, /not combinable with college credit/);
assert.match(`${cei.location} ${cei.description}`, /in person only|in-person/i);
assert.match(cei.description, /only accepting applicants who are able to work in-person at our DC-based office/);
assert.equal(/hybrid|remote/i.test(JSON.stringify(cei)), false);
assert.match(`${cei.deadline} ${cei.description} ${cei.application}`, /Tuesday 15 December 2026/);
assert.match(`${cei.deadline} ${cei.description} ${cei.application}`, /2026 year is inferred from the cycle/);
assert.match(`${cei.description} ${cei.application}`, /250 words/);
assert.match(`${cei.description} ${cei.application}`, /political or philosophical views/);
assert.match(`${cei.description} ${cei.application}`, /interns@cei\.org/);
assert.equal(cei.url, 'https://cei.org/about/internships/');
assert.equal(cei.reviewedAt, '2026-10-03');
assert.equal(cei.source, 'Official source reviewed 11 Sep 2026');
assert.equal(items.some(item => item.id === 'hudson-summer-fellowship-2027'), false);
assert.equal(items.filter(item => item.type === 'Conference').length, 13);
const batch11 = [
  'li-yls-reagan-library-2026-10',
  'acton-academic-conference-2026',
  'isi-retreat-george-fox-2026',
  'isi-retreat-san-francisco-2026',
  'isi-retreat-south-carolina-2026',
  'isi-retreat-toledo-2026',
  'cato-university-on-campus-san-diego-2026',
  'li-yls-cozumel-cruise-2026-11',
  'cato-university-winter-2027',
  'mises-libertarian-scholars-conference-2027'
];
for (const id of batch11) {
  const card = byId(id);
  assert.equal(card.type, 'Conference', id);
  assert.equal(card.status, 'open', id);
  assert.equal(card.region, 'United States', id);
  assert.equal(card.reviewedAt, '2026-10-03', id);
  assert.equal(card.source, 'Official source reviewed 11 Sep 2026', id);
  assert.equal(card.eligibility, 'Some restrictions', id);
}
const yls = byId('li-yls-reagan-library-2026-10');
assert.match(yls.duration, /Sat 10 - Sun 11 Oct 2026/);
assert.match(yls.deadline, /No deadline printed; event Sat 10 Oct 2026/);
assert.match(`${yls.deadline} ${yls.description} ${yls.application}`, /[Rr]egister soon/);
assert.match(`${yls.fundingDetails} ${yls.eligibilityDetails} ${yls.description}`, /first-time YLS/);
assert.match(yls.application, /ctomaine@leadershipinstitute\.org/);
assert.equal(yls.url, 'https://leadershipinstitute.org/event/701VL00000wfLezYAE');
const actonConf = byId('acton-academic-conference-2026');
assert.match(actonConf.duration, /Fri 16 Oct 2026/);
assert.match(actonConf.deadline, /No deadline printed; event Fri 16 Oct 2026/);
assert.match(actonConf.paid, /\$25/);
assert.match(actonConf.application, /lstrobel@acton\.org/);
assert.equal(/July 14|14 July/.test(JSON.stringify(actonConf)), false);
for (const id of ['isi-retreat-george-fox-2026', 'isi-retreat-san-francisco-2026', 'isi-retreat-south-carolina-2026', 'isi-retreat-toledo-2026']) {
  const retreat = byId(id);
  assert.match(retreat.paid, /Free/);
  assert.match(`${retreat.paid} ${retreat.fundingDetails} ${retreat.description}`, /\$250/);
  assert.match(`${retreat.fundingDetails} ${retreat.description}`, /about 20/);
  assert.match(`${retreat.eligibilityDetails} ${retreat.description}`, /[Uu]ndergraduates only/);
  assert.match(`${retreat.deadline} ${retreat.description} ${retreat.application}`, /year inferred/);
}
assert.match(byId('isi-retreat-george-fox-2026').duration, /Fri 30 Oct - Sun 1 Nov 2026/);
assert.match(byId('isi-retreat-george-fox-2026').application, /amckinnon@isi\.org/);
assert.match(byId('isi-retreat-george-fox-2026').eligibilityDetails, /Pacific Northwest/);
assert.match(byId('isi-retreat-san-francisco-2026').duration, /Fri 13 - Sun 15 Nov 2026/);
assert.match(byId('isi-retreat-san-francisco-2026').eligibilityDetails, /Western region/);
assert.match(byId('isi-retreat-south-carolina-2026').application, /ataylor@isi\.org/);
assert.match(byId('isi-retreat-south-carolina-2026').eligibilityDetails, /Southeast/);
assert.match(byId('isi-retreat-toledo-2026').application, /pvanheyningen@isi\.org/);
assert.match(byId('isi-retreat-toledo-2026').eligibilityDetails, /Midwest/);
const catoSd = byId('cato-university-on-campus-san-diego-2026');
assert.equal(catoSd.paid, 'No fee stated; meals included; $100 travel stipend on completion');
assert.equal(/free/i.test(JSON.stringify(catoSd)), false);
assert.match(catoSd.duration, /Sat 14 Nov 2026/);
assert.match(catoSd.deadline, /Fri 30 Oct 2026, 5:00 PM EDT/);
assert.match(catoSd.application, /events@cato\.org/);
const cruise = byId('li-yls-cozumel-cruise-2026-11');
assert.match(cruise.duration, /Thu 5 Nov/);
assert.match(cruise.deadline, /No deadline printed; departs Thu 5 Nov 2026/);
assert.match(`${cruise.eligibilityDetails} ${cruise.description}`, /18\+/);
assert.match(`${cruise.eligibilityDetails} ${cruise.description}`, /passport/i);
assert.match(`${cruise.fundingDetails} ${cruise.eligibilityDetails} ${cruise.description}`, /Travel to New Orleans is not covered/);
assert.equal(cruise.lat, 29.9511);
assert.equal(cruise.lon, -90.0715);
const catoWinter = byId('cato-university-winter-2027');
assert.equal(catoWinter.deadline, 'No deadline printed; treat as rolling, check page');
assert.match(catoWinter.duration, /Thu 4 - Sat 6 Feb 2027/);
assert.match(`${catoWinter.paid} ${catoWinter.fundingDetails}`, /\$500/);
assert.match(catoWinter.eligibilityDetails, /US-based applicants only/);
assert.match(`${catoWinter.description} ${catoWinter.application}`, /not from this page/);
assert.equal(/early bird/i.test(JSON.stringify(catoWinter)), false);
const misesConf = byId('mises-libertarian-scholars-conference-2027');
assert.match(misesConf.duration, /Thu 18 Mar 2027/);
assert.match(`${misesConf.duration} ${misesConf.description} ${misesConf.application}`, /page body says 2026/);
assert.match(`${misesConf.duration} ${misesConf.description} ${misesConf.application}`, /header and the weekday indicate 2027/);
assert.match(`${misesConf.fundingDetails} ${misesConf.eligibilityDetails} ${misesConf.application}`, /not read and are unconfirmed/);
assert.match(misesConf.paid, /\$99/);
assert.match(misesConf.application, /felicia@mises\.org/);
const gulch = byId('atlas-society-gulch-2027');
assert.equal(gulch.type, 'Conference');
assert.match(gulch.duration, /Thu 3 - Sat 5 Jun 2027/);
assert.match(gulch.deadline, /Mon 1 Feb 2027/);
assert.match(gulch.deadline, /year inferred/);
assert.match(gulch.deadline, /Scholarship deadline not printed/);
assert.match(`${gulch.paid} ${gulch.description}`, /\$1,250/);
assert.match(`${gulch.paid} ${gulch.description}`, /\$1,500/);
assert.match(`${gulch.fundingDetails} ${gulch.description} ${gulch.application}`, /whether the ticket is waived is not stated/);
assert.match(`${gulch.description} ${gulch.application}`, /galtsgulch@atlassociety\.org/);
assert.equal(gulch.url, 'https://www.atlassociety.org/galts-gulch-2027');
assert.equal(items.filter(item => item.url === gulch.url).length, 1);
assert.match(byId('mises-university-2027').deadline, /Fri 28 May 2027/);
assert.match(byId('mises-university-2027').deadline, /international deadline Fri 30 Apr 2027/);
assert.match(byId('mises-university-2027').deadline, /Sun 18 to Sat 24 Jul 2027/);
assert.match(byId('bpc-spring-2027-internships').deadline, /about four weeks from Mon 28 Sep 2026 \(about Mon 26 Oct 2026, estimate\)/);
assert.equal(/no fixed closing date/i.test(byId('bpc-spring-2027-internships').deadline), false);
const ccsLegal = byId('ccs-legal');
assert.equal(/15 October 2025|confirm it is still open/i.test(JSON.stringify(ccsLegal)), false);
assert.match(ccsLegal.deadline, /Rolling basis/);
assert.match(`${ccsLegal.deadline} ${ccsLegal.duration}`, /minimum two months/i);
assert.match(`${ccsLegal.deadline} ${ccsLegal.application}`, /30 days before the start/);
assert.match(ccsLegal.application, /internship@ccs\.in/);
for (const id of ['frc-internship-spring-2027', 'frc-internship-summer-2027']) {
  const frc = byId(id);
  assert.match(`${frc.description} ${frc.fundingDetails}`, /contradicts itself on housing/);
  assert.match(`${frc.description} ${frc.fundingDetails}`, /Free Housing/);
  assert.match(`${frc.description} ${frc.fundingDetails}`, /housing is not available/);
}
assert.equal(byId('frc-internship-spring-2027').deadline, 'Sat 31 Oct 2026');
assert.equal(byId('frc-internship-summer-2027').deadline, 'Sun 14 Feb 2027');
const kochSummer = byId('koch-internship-program-summer-2027');
assert.equal(kochSummer.status, 'rolling');
assert.equal(kochSummer.url, kip.url);
assert.match(kochSummer.deadline, /Rolling through March 2027/);
assert.match(kochSummer.duration, /27 May to Thu 5 Aug 2027/);
const prometheus = byId('prometheus-praktikum');
assert.equal(prometheus.status, 'rolling');
assert.equal(prometheus.url, 'https://heimatderfreiheit.de/project/praktikum/');
assert.match(prometheus.duration, /6 weeks to 3 months/);
assert.match(`${prometheus.description} ${prometheus.eligibilityDetails} ${prometheus.application}`, /German-language/);
assert.match(`${prometheus.description} ${prometheus.location}`, /Berlin/);
const scnc = byId('ccs-scnc-2026');
assert.equal(scnc.type, 'Conference');
assert.equal(scnc.url, 'https://ccs.in/scnc2026');
assert.equal(scnc.deadlineOn, '2026-10-15');
assert.match(scnc.deadline, /Thu 15 Oct 2026/);
assert.match(scnc.duration, /Sat 31 Oct 2026/);
assert.match(`${scnc.paid} ${scnc.fundingDetails}`, /INR 3,000/);
assert.match(scnc.location, /New Delhi/);
const hudsonFellowship = byId('hudson-political-studies-summer-fellowship-2027');
assert.equal(hudsonFellowship.organisation, 'Hudson Institute Political Studies');
assert.equal(hudsonFellowship.program, 'Summer Fellowship 2027');
assert.equal(hudsonFellowship.type, 'Fellowship');
assert.equal(hudsonFellowship.status, 'open');
assert.equal(hudsonFellowship.reviewedAt, '2026-10-05');
assert.equal(hudsonFellowship.url, 'https://hudsonpoliticalstudies.org/fellowship/apply');
assert.equal(hudsonFellowship.location, 'Washington, DC');
assert.equal(hudsonFellowship.lat, 38.9072);
assert.equal(hudsonFellowship.lon, -77.0369);
assert.equal(hudsonFellowship.deadline, 'Early Decision Sat 9 Jan 2027 11:59 p.m. EST; Regular Tue 16 Mar 2027 11:59 p.m. EST (extended)');
assert.match(hudsonFellowship.duration, /Session I Mon 24 May - Mon 5 Jul 2027/);
assert.match(hudsonFellowship.duration, /Session II Mon 28 Jun - Sat 7 Aug 2027/);
assert.match(`${hudsonFellowship.paid} ${hudsonFellowship.fundingDetails} ${hudsonFellowship.description}`, /\$3,000/);
assert.match(`${hudsonFellowship.paid} ${hudsonFellowship.fundingDetails}`, /complimentary/);
assert.match(`${hudsonFellowship.eligibilityDetails} ${hudsonFellowship.description}`, /[Cc]ollege students and recent graduates/);
assert.match(`${hudsonFellowship.eligibilityDetails} ${hudsonFellowship.description}`, /[Ff]ull-time/);
assert.match(`${hudsonFellowship.description} ${hudsonFellowship.application}`, /Thu 1 Oct 2026/);
assert.match(hudsonFellowship.application, /amcbreen@hudson\.org/);
const hertog = byId('hertog-humanities-winter-2027');
assert.equal(hertog.organisation, 'Hertog Foundation');
assert.equal(hertog.program, 'Humanities at Hertog - Winter 2027 online seminars (Zoom)');
assert.equal(hertog.type, 'Seminar');
assert.equal(hertog.status, 'open');
assert.equal(hertog.reviewedAt, '2026-10-05');
assert.equal(hertog.region, 'Online');
assert.equal(hertog.deadline, 'Mon 16 Nov 2026');
assert.equal(hertog.url, 'https://hertogfoundation.org/programs/humanities');
assert.match(hertog.location, /Zoom/);
for (const id of [
  'mannkal-scholarship-program-2027',
  'menzies-future-leader-initiative',
  'maxim-leadership-academy-2027-28',
  'cis-liberty-society-student-fellowship-2027',
  'cis-liberty-society-student-conference-2027',
  'fire-summer-2027'
]) {
  assert.equal(items.some(item => item.id === id), false, id);
}
const youngVoices = byId('young-voices-contributor-spring-2027');
assert.equal(items.some(item => item.id === 'young-voices'), false);
assert.equal(youngVoices.organisation, 'Young Voices');
assert.equal(youngVoices.program, 'Contributor Program - Spring 2027');
assert.equal(youngVoices.status, 'open');
assert.equal(youngVoices.reviewedAt, '2026-10-05');
assert.equal(youngVoices.region, 'Online');
assert.equal(youngVoices.deadline, 'Mon 30 Nov 2026, 11:59 pm ET');
assert.equal(youngVoices.url, 'https://www.joinyv.org/join');
assert.match(youngVoices.application, /https:\/\/www\.tfaforms\.com\/4874619/);
assert.match(`${youngVoices.description} ${youngVoices.duration}`, /[Tt]hree months/);
assert.match(`${youngVoices.description} ${youngVoices.eligibilityDetails}`, /18-35/);
assert.match(`${youngVoices.description} ${youngVoices.eligibilityDetails}`, /United States/);
assert.match(youngVoices.application, /op-ed draft/);
assert.match(youngVoices.application, /2-minute intro video/);
assert.equal(youngVoices.paid, 'Not stated');
const heritageSpring = byId('heritage-young-leaders-spring-2027');
assert.equal(items.some(item => item.id === 'heritage-young-leaders'), false);
assert.equal(heritageSpring.status, 'rolling');
assert.equal(heritageSpring.reviewedAt, '2026-10-05');
assert.equal(heritageSpring.deadline, 'Rolling hiring. No fixed deadline.');
assert.equal(/4 Oct(?:ober)? 2026/.test(JSON.stringify(heritageSpring)), false);
assert.match(heritageSpring.duration, /Mon 11 Jan to Fri 9 Apr 2027/);
assert.match(`${heritageSpring.paid} ${heritageSpring.fundingDetails}`, /\$18\.50\/hr/);
assert.equal(heritageSpring.url, 'https://www.heritage.org/young-leaders-program');
const heritageSummer = byId('heritage-young-leaders-summer-2027');
assert.equal(heritageSummer.status, 'open');
assert.equal(heritageSummer.reviewedAt, '2026-10-05');
assert.equal(heritageSummer.deadline, 'Sun 31 Jan 2027');
assert.match(heritageSummer.duration, /Mon 10 May to Fri 6 Aug 2027/);
assert.match(`${heritageSummer.paid} ${heritageSummer.fundingDetails}`, /\$18\.50\/hr/);
assert.equal(/Fall 2027/.test(JSON.stringify(heritageSummer)), false);
assert.equal(heritageSummer.url, 'https://www.heritage.org/young-leaders-program');
const goldwater = byId('goldwater-ronald-reagan-fellowship');
assert.equal(goldwater.status, 'rolling');
assert.equal(goldwater.reviewedAt, '2026-10-05');
assert.equal(goldwater.mapped, false);
assert.match(goldwater.location, /Phoenix/);
assert.match(goldwater.deadline, /Mon 30 Nov 2026/);
assert.match(goldwater.deadline, /Wed 31 Mar 2027/);
assert.match(goldwater.deadline, /Tue 30 Jun 2027/);
assert.equal(goldwater.url, 'https://www.goldwaterinstitute.org/clerkships-and-internships/');
const mrc = byId('mrc-internships-spring-2027');
assert.equal(mrc.status, 'open');
assert.equal(mrc.reviewedAt, '2026-10-05');
assert.equal(mrc.deadline, 'Mon 21 Dec 2026');
assert.match(`${mrc.paid} ${mrc.fundingDetails}`, /\$14\/hr/);
assert.match(mrc.location, /in office/i);
assert.match(mrc.location, /Northern Virginia/);
assert.equal(mrc.url, 'https://www.mrc.org/internships');
for (const id of [
  'nri-buckley-journalism-fellowship',
  'heritage-young-leaders-fall-2027',
  'steamboat-fellowship',
  'nri-rhodes',
  'heartland-internship',
  'bow-group'
]) {
  assert.equal(items.some(item => item.id === id), false, id);
}
console.log('PASS: 130 reviewed records, official HTTPS sources, status fields and independent link controls.');
