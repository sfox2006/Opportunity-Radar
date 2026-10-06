const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(__dirname + '/dist/directory.js', 'utf8');
const registryContext = vm.createContext({});
vm.runInContext(fs.readFileSync(__dirname + '/dist/organisations.js', 'utf8') + '\nthis.registry = radarRegistry;', registryContext);
const registry = registryContext.registry;
function load(radarRegistry = registry, opportunities = []) {
  const elements = {};
  for (const id of ['organisation-directory', 'organisation-query', 'directory-count', 'organisation-count', 'organisation-region-count']) {
    elements[id] = {value: '', textContent: '', innerHTML: '', addEventListener(event, handler) {this[event] = handler;}};
  }
  vm.runInNewContext(code, {radarRegistry, opportunities, URL, document: {getElementById: id => elements[id]}});
  return {elements, search(query) {elements['organisation-query'].value = query; elements['organisation-query'].input();}};
}
test('directory covers the complete research reference without mutating programs', () => {
  const source = JSON.parse(fs.readFileSync(__dirname + '/research/organisations.json', 'utf8'));
  assert.equal(registry.organisations.length, source.organisations.length);
  assert.equal(registry.organisations.length, 182);
  for (const org of source.organisations) assert.ok(registry.organisations.some(entry => entry.aliases.includes(org.name)), org.name);
  assert.equal(new Set(registry.organisations.map(org => org.id)).size, 182);
  const entries = Object.freeze([Object.freeze({organisation: 'Institute of Economic Affairs'})]);
  const {elements} = load(registry, entries);
  assert.equal(elements['organisation-region-count'].textContent, 11);
  assert.match(elements['directory-count'].textContent, /^182 of 182/);
});
test('search finds regions, country names, accents and aliases and opens matching groups', () => {
  const {elements, search} = load();
  search('mexico evalua');
  assert.match(elements['organisation-directory'].innerHTML, /México Evalúa/);
  assert.match(elements['directory-count'].textContent, /^1 of 182/);
  assert.match(elements['organisation-directory'].innerHTML, /class="sector-directory" open/);
  search('Germany');
  assert.match(elements['organisation-directory'].innerHTML, /Friedrich Naumann Foundation/);
  assert.match(elements['directory-count'].textContent, /^3 of 182/);
  search('AIER');
  assert.match(elements['organisation-directory'].innerHTML, /American Institute for Economic Research/);
  search('no such organisation xyz');
  assert.match(elements['organisation-directory'].innerHTML, /No organisations match/);
  search('');
  assert.match(elements['directory-count'].textContent, /^182 of 182/);
});
test('program counts match acronym aliases and keep similarly named organisations distinct', () => {
  const {elements, search} = load(registry, [
    {organisation:'American Institute for Economic Research'},
    {organisation:'Free Market Foundation'},
    {organisation:'Tax Foundation / Stand Together Fellowships'}
  ]);
  search('AIER');
  assert.match(elements['organisation-directory'].innerHTML, /1 program on this site/);
  search('Free Market Foundation Hungary');
  assert.match(elements['organisation-directory'].innerHTML, /0 programs on this site/);
  search('Tax Foundation');
  assert.match(elements['organisation-directory'].innerHTML, /1 program on this site/);
});
test('reference cards escape imported text and reject unsafe links', () => {
  const {elements} = load({groups:[{id:'test',label:'<Region>'}],organisations:[{
    id:'test',name:'<img src=x onerror=alert(1)>',group:'test',location:'',aliases:[],
    referenceUrls:['javascript:alert(1)', 'https://user:password@example.org/', 'https://example.org/?q="<test>']
  }]});
  const html = elements['organisation-directory'].innerHTML;
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;Region&gt;/);
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('user:password'));
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /availability not checked here/);
});
