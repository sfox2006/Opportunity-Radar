const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const code = fs.readFileSync('dist/app.js', 'utf8');

function setup() {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const elements = new Map();
  const make = () => ({value: '', hidden: false, innerHTML: '', textContent: '', options: [],
    addEventListener() {}, appendChild(child) { this.options.push(child); }, setAttribute() {},
    querySelector() { return {addEventListener() {}}; }});
  for (const match of html.matchAll(/<select\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    const select = make();
    select.options = [...match[2].matchAll(/<option\b[^>]*value="([^"]*)"/g)].map(option => ({value: option[1]}));
    select.value = select.options[0]?.value || '';
    elements.set(match[1], select);
  }
  const context = vm.createContext({console, AbortController, document: {
    getElementById(id) {
      if (!ids.has(id) && !id.startsWith('opportunity-')) return null;
      if (!elements.has(id)) elements.set(id, make());
      return elements.get(id);
    },
    createElement: make, querySelectorAll: () => []
  }});
  vm.runInContext(code.replace(/initMap\(\);\s*registerWebMcpTools\(\);\s*$/, ''), context);
  return {context, evaluate: source => vm.runInContext(source, context)};
}

test('app starts against the current page and search, Job/funding filters and reset still work', () => {
  const {evaluate} = setup();
  const count = evaluate('opportunities.length');
  assert.equal(evaluate('filteredItems().length'), count);
  assert.equal(evaluate('els.typeFilter.options.some(option => option.value === "Job")'), true);
  evaluate('els.query.value="internship"; updateState()');
  assert.ok(evaluate('filteredItems().length') > 0);
  assert.ok(evaluate('filteredItems().length') < count);
  evaluate('els.query.value=""; els.typeFilter.value="Job"; els.paidFilter.value="Paid"; updateState()');
  assert.equal(evaluate('filteredItems().map(item => item.id).join(",")'), 'cato-innovation-project');
  evaluate('resetFilters()');
  assert.equal(evaluate('filteredItems().length'), count);
  assert.equal(evaluate('state.query'), '');
  assert.equal(evaluate('state.type'), 'All');
  assert.equal(evaluate('state.paid'), 'All');
});

test('WebMCP exposes working catalogue filters and ignores unavailable select options', () => {
  const {context, evaluate} = setup();
  const tools = [];
  context.document.modelContext = {registerTool(tool) { tools.push(tool); }};
  evaluate('registerWebMcpTools()');
  assert.deepEqual(tools.map(tool => tool.name), ['filter_opportunities']);
  const result = tools[0].execute({type: 'Job', paid: 'Paid', query: ''});
  assert.equal(result.count, 1);
  assert.equal(result.results[0].type, 'Job');
  assert.match(result.results[0].organisation, /Cato/);
  tools[0].execute({type: 'Unavailable', paid: 'Unavailable'});
  assert.equal(evaluate('state.type'), 'Job');
  assert.equal(evaluate('state.paid'), 'Paid');
  assert.equal(tools[0].execute({type: 'All', paid: 'All'}).count, evaluate('opportunities.length'));
});

test('FAI internship is searchable and paid, with work rights retained by eligibility filters', () => {
  const {evaluate} = setup();
  evaluate('els.query.value="Artificial Intelligence Policy Team"; els.typeFilter.value="Internship"; els.paidFilter.value="Paid"; els.eligibilityFilter.value="Some restrictions"; updateState()');
  assert.equal(evaluate('filteredItems().map(item => item.id).join(",")'), 'fai-artificial-intelligence-policy-team-intern-fall-2026');
  evaluate('els.eligibilityFilter.value="Yes"; updateState()');
  assert.equal(evaluate('filteredItems().length'), 0);
  evaluate('resetFilters()');
  assert.equal(evaluate('filteredItems().length'), evaluate('opportunities.length'));
});
