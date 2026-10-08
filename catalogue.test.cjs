const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { validateCatalogue, generate } = require('./research/build_catalogue.cjs');
const data = JSON.parse(fs.readFileSync('research/catalogue.json', 'utf8'));
const today = new Date(2026, 9, 7);
const clone = () => structuredClone(data);

test('canonical catalogue regenerates exactly without mutating source fields or review dates', () => {
  const snapshot = JSON.stringify(data);
  validateCatalogue(data, today);
  assert.equal(generate(data, fs.readFileSync('src/app.js', 'utf8')), fs.readFileSync('dist/app.js', 'utf8'));
  assert.equal(JSON.stringify(data), snapshot);
  assert.equal(data.opportunities.length, 133);
  assert.equal(data.openingSoon.length, 3);
  assert.equal(data.opportunities.filter(item => item.type === 'Job').length, 1);
  assert.equal(data.opportunities.find(item => item.id === 'cato-innovation-project').status, 'rolling');
});

test('upcoming publication rejects unknown, recurring, distant, elapsed or unreviewed candidates', () => {
  for (const change of [
    {status:'unknown'}, {status:'recurring'}, {status:'open'}, {opensOn:'2027-01-08'},
    {opensOn:'2026-10-07'}, {opensOn:'2026-10-06'}, {opensOn:'2026-02-31'},
    {opensOn:'2026-11'}, {reviewedAt:null}
  ]) {
    const candidate = clone(); Object.assign(candidate.openingSoon[0], change);
    assert.throws(() => validateCatalogue(candidate, today), /Upcoming record requires/);
  }
  const candidate = clone(); candidate.openingSoon[0].opensOn = '2027-01-07';
  assert.doesNotThrow(() => validateCatalogue(candidate, today));
  candidate.openingSoon = [{...candidate.openingSoon[0], opensOn:'2026-04-30'}];
  assert.doesNotThrow(() => validateCatalogue(candidate, new Date(2026, 0, 31)));
  candidate.openingSoon[0].opensOn = '2026-05-01';
  assert.throws(() => validateCatalogue(candidate, new Date(2026, 0, 31)), /three calendar months/);
});

test('catalogue rejects duplicate records, missing source links, and unsupported types', () => {
  for (const [mutate, expected] of [
    [candidate => candidate.opportunities.push(candidate.opportunities[0]), /duplicate id/],
    [candidate => candidate.opportunities[0].type='Mystery', /Unknown type/],
    [candidate => candidate.opportunities[0].url='javascript:alert(1)', /Missing public source/]
  ]) {
    const candidate = clone(); mutate(candidate);
    assert.throws(() => validateCatalogue(candidate, today), expected);
  }
});
