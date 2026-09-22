const { readFileSync } = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const elements = new Map();
const element = () => ({
  value: "", checked: false, innerHTML: "", textContent: "",
  options: [], addEventListener() {}, appendChild(child) { this.options.push(child); }
});
const context = vm.createContext({
  console,
  document: {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement: element
  }
});
vm.runInContext(readFileSync("dist/app.js", "utf8").replace(/initMap\(\);\s*registerWebMcpTools\(\);\s*$/, ""), context);
vm.runInContext(`
  for (const control of [els.regionFilter, els.typeFilter, els.eligibilityFilter, els.paidFilter]) control.value = "All";
`, context);
const evaluate = code => vm.runInContext(code, context);
function noScores() {
  assert.equal(evaluate("matchScore(opportunities[0])"), null);
  assert.equal(evaluate("filteredItems().some(item => 'score' in item)"), false);
  assert.equal(evaluate("els.detail.innerHTML.includes('% profile fit')"), false);
}
noScores();
evaluate("applyProfile()");
noScores();
evaluate('els.query.value = "internship"; updateState()');
noScores();
evaluate('els.homeRegion.value = "Australia"; state.interests.add("Internship"); updateState()');
noScores();
evaluate("applyProfile()");
assert.equal(evaluate("typeof matchScore(opportunities[0])"), "number");
assert.equal(evaluate("els.detail.innerHTML.includes('% profile fit')"), true);
const saved = evaluate("matchScore(opportunities[0])");
evaluate('els.homeRegion.value = "Canada"; state.interests.clear(); updateState()');
assert.equal(evaluate("matchScore(opportunities[0])"), saved);
evaluate("clearProfile()");
noScores();
assert.equal(evaluate("els.query.value"), "internship");
console.log("PASS: no default scores, no filter/draft activation, explicit apply, saved snapshot, clear.");
