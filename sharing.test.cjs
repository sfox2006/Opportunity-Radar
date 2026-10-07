const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync('dist/app.js', 'utf8');

function setup() {
  const elements = new Map();
  const make = () => ({value: '', checked: false, hidden: false, innerHTML: '', textContent: '', options: [],
    addEventListener() {}, appendChild(child) { this.options.push(child); }, setAttribute() {},
    focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; },
    querySelector() { return this.disclosure ||= {addEventListener() {}}; }});
  const context = vm.createContext({console, URL, document: {
    getElementById(id) { if (!elements.has(id)) elements.set(id, make()); return elements.get(id); },
    createElement: make, querySelectorAll: () => []
  }});
  vm.runInContext(code.replace(/initMap\(\);\s*registerWebMcpTools\(\);\s*$/, ''), context);
  context.window = {location: {href: 'https://example.test/Opportunity-Radar/?old=1#newsletter'},
    matchMedia: () => ({matches: true}), setTimeout() {}};
  const evaluate = source => vm.runInContext(source, context);
  return {context, evaluate, elements};
}

test('shared opportunity clears all hiding filters and opens the correct catalogue and disclosure', () => {
  const {context, evaluate, elements} = setup();
  evaluate(`state.query='old'; state.directoryOrganisation={programIds:['other']};
    els.query.value='old'; els.regionFilter.value='Australia'; els.typeFilter.value='Seminar'; els.paidFilter.value='No';`);
  context.window.location.href += '&unused=1';
  context.window.location.href = 'https://example.test/Opportunity-Radar/?opportunity=yaf-njc-summer-2027#programs';
  evaluate('openSharedOpportunity()');
  assert.equal(evaluate('state.catalog'), 'opening');
  assert.equal(evaluate('state.directoryOrganisation'), null);
  assert.equal(evaluate('state.query'), '');
  assert.equal(evaluate('state.region'), 'All');
  assert.equal(evaluate('state.type'), 'All');
  assert.equal(evaluate('state.paid'), 'All');
  assert.equal(evaluate('state.selectedId'), 'yaf-njc-summer-2027');
  assert.equal(elements.get('opportunity-yaf-njc-summer-2027').disclosure.open, true);
  assert.equal(elements.get('opportunity-yaf-njc-summer-2027').focused, true);
  context.window.location.href = 'https://example.test/Opportunity-Radar/?opportunity=tfas-washington-2027';
  evaluate('openSharedOpportunity()');
  assert.equal(evaluate('state.catalog'), 'open');
  assert.equal(elements.get('opportunity-tfas-washington-2027').disclosure.open, true);
});

test('missing and expired shared records give a visible explanation and clear stale selection', () => {
  const {context, evaluate, elements} = setup();
  evaluate("state.selectedId='tfas-washington-2027'");
  context.window.location.href = 'https://example.test/Opportunity-Radar/?opportunity=expired-or-removed';
  evaluate('openSharedOpportunity()');
  assert.equal(evaluate('state.selectedId'), null);
  assert.equal(elements.get('shared-opportunity-notice').hidden, false);
  assert.match(elements.get('shared-opportunity-notice').textContent, /no longer listed/);
  assert.equal(elements.get('shared-opportunity-notice').focused, true);
});

test('native share and copy fallback use the website record URL and cancellation does not copy', async () => {
  const {context, evaluate, elements} = setup();
  let payload, copied;
  context.navigator = {share: async value => {payload = value;}, clipboard: {writeText: async text => {copied = text;}}};
  context.button = {textContent: 'Share', isConnected: true, focus() {}};
  await evaluate('shareOpportunity(opportunities[0], button)');
  const expected = 'https://example.test/Opportunity-Radar/?opportunity=tfas-washington-2027#programs';
  assert.equal(payload.url, expected);
  assert.notEqual(payload.url, evaluate('opportunities[0].url'));
  context.navigator.share = async () => {throw new Error('unsupported');};
  await evaluate('shareOpportunity(opportunities[0], button)');
  assert.equal(copied, expected);
  assert.equal(context.button.textContent, 'Copied');
  assert.match(elements.get('share-status').textContent, /copied to clipboard/);
  copied = undefined;
  context.navigator.share = async () => {const error = new Error('cancelled'); error.name = 'AbortError'; throw error;};
  await evaluate('shareOpportunity(opportunities[0], button)');
  assert.equal(copied, undefined);
});
