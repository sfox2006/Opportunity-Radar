const assert = require('node:assert/strict');
const { loadOpeningSoon, openingDue } = require('./research/check_opening_due.cjs');

const records = loadOpeningSoon();
assert.deepEqual(records.map((item) => item.id).sort(), [
  'centrum-for-rattvisa-sommarnotarie-2027',
  'claremont-publius-fellowship-2027',
  'yaf-njc-summer-2027'
]);

assert.deepEqual(openingDue(records, new Date(2026, 9, 5)).map((item) => item.id), []);
assert.deepEqual(
  openingDue(records, new Date(2026, 10, 1)).map((item) => item.id).sort(),
  ['centrum-for-rattvisa-sommarnotarie-2027', 'yaf-njc-summer-2027']
);
assert.deepEqual(
  openingDue(records, new Date(2026, 11, 1)).map((item) => item.id).sort(),
  ['centrum-for-rattvisa-sommarnotarie-2027', 'claremont-publius-fellowship-2027', 'yaf-njc-summer-2027']
);

const dueNow = openingDue(records, new Date());
assert.deepEqual(
  dueNow.map((item) => `${item.id} ${item.opensOn}`),
  [],
  'An Opening card has an opensOn of today or earlier. Move it into Open: Sun 1 Nov 2026 for yaf-njc-summer-2027 and centrum-for-rattvisa-sommarnotarie-2027; Tue 1 Dec 2026 for claremont-publius-fellowship-2027.'
);

console.log('PASS: opening-soon dates are still ahead, and past opensOn dates are detected.');
