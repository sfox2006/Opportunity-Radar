const { readFileSync } = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const elements = new Map();
const element = () => ({
  value: "", checked: false, hidden: false, innerHTML: "", textContent: "",
  options: [], addEventListener() {}, appendChild(child) { this.options.push(child); }
});
const context = vm.createContext({
  console,
  document: {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement: element,
    querySelectorAll: () => []
  }
});
vm.runInContext(readFileSync("dist/app.js", "utf8").replace(/initMap\(\);\s*registerWebMcpTools\(\);\s*$/, ""), context);
const evaluate = (code) => vm.runInContext(code, context);

evaluate(`
  for (const control of [els.regionFilter, els.typeFilter, els.eligibilityFilter, els.paidFilter]) control.value = "All";
  updateState();
`);

assert.equal(evaluate("state.selectedId"), null);
assert.equal(evaluate("els.selectionStrip.hidden"), true);
assert.equal(evaluate("els.detail.innerHTML"), "");
assert.equal(evaluate("els.legendSelected.hidden"), true);
assert.match(evaluate("els.openingSoonList.innerHTML"), /None of the reviewed programmes/);
assert.equal(evaluate("els.openingSoonList.innerHTML.includes('program-row')"), false);
assert.equal(evaluate("els.openingSoonHead.hidden"), true);

assert.equal(evaluate("opportunities.length"), 108);
assert.equal(evaluate("filteredItems().length"), 108);
assert.equal(Number(evaluate("els.scanCount.textContent")), 108);
assert.equal(evaluate("opportunities.some(item => item.opensOn)"), false);
assert.equal(evaluate("opportunities[0].id"), "tfas-washington-2027");
assert.equal(evaluate("opportunities[0].program"), "TFAS Washington Fellowship - Spring 2027");
assert.equal(evaluate("programmesOpeningSoon(new Date(2026, 9, 4)).length"), 0);

assert.equal(evaluate("isOpeningSoon({ id: 'today', opensOn: '2026-10-04' }, new Date(2026, 9, 4))"), true);
assert.equal(evaluate("isOpeningSoon({ id: 'end', opensOn: '2027-01-04' }, new Date(2026, 9, 4))"), true);
assert.equal(evaluate("isOpeningSoon({ id: 'before', opensOn: '2026-10-03' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'after', opensOn: '2027-01-05' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'past-open', opensOn: '2026-10-01' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'month', opensOn: 'October 2026' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'partial', opensOn: '2026-10' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'invalid', opensOn: '2026-02-31' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'missing' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'open-status', status: 'open', opensOn: '2026-11-01' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'rolling-status', status: 'rolling', opensOn: '2026-11-01' }, new Date(2026, 9, 4))"), false);
assert.equal(evaluate("isOpeningSoon({ id: 'clamped', opensOn: '2026-04-30' }, new Date(2026, 0, 31))"), true);
assert.equal(evaluate("isOpeningSoon({ id: 'past-clamp', opensOn: '2026-05-01' }, new Date(2026, 0, 31))"), false);

const fixture = [{
  id: "example-opening",
  organisation: "Example Institute",
  program: "Example Fellowship",
  country: "United States",
  type: "Fellowship",
  opensOn: "2026-11-15",
  url: "https://example.org/fellowship",
  description: "A dated opening."
}];
assert.equal(
  evaluate(`programmesOpeningSoon(new Date(2026, 9, 4), ${JSON.stringify(fixture)}).map(item => item.id).join(",")`),
  "example-opening"
);
assert.equal(evaluate(`programmesOpeningSoon(new Date(2026, 9, 4), ${JSON.stringify([{ ...fixture[0], id: "tfas-washington-2027" }])}).length`), 0);
const markup = evaluate(`openingSoonMarkup(programmesOpeningSoon(new Date(2026, 9, 4), ${JSON.stringify(fixture)}))`);
assert.match(markup, /<details class="program-disclosure">/);
assert.match(markup, /Example Fellowship/);
assert.match(markup, /Opens 15 Nov 2026/);
assert.match(markup, /https:\/\/example\.org\/fellowship/);
assert.equal(markup.includes("View on globe"), false);
assert.equal(evaluate("opportunities.length"), 108);
assert.equal(evaluate("filteredItems().some(item => item.id === 'example-opening')"), false);

evaluate("state.selectedId = 'tfas-washington-2027'; render()");
assert.equal(evaluate("els.selectionStrip.hidden"), false);
assert.equal(evaluate("els.legendSelected.hidden"), false);
assert.match(evaluate("els.detail.innerHTML"), /TFAS Washington Fellowship - Spring 2027/);
assert.match(evaluate("els.detail.innerHTML"), /The Fund for American Studies/);
assert.equal(Number(evaluate("els.scanCount.textContent")), 108);

console.log("PASS: no default selection; opening-soon window is inclusive for three calendar months and excludes the open catalogue.");
