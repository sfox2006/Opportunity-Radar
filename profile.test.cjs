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
assert.equal(evaluate("els.detail.innerHTML.includes('% profile fit')"), false);
evaluate("state.selectedId = opportunities[0].id; render()");
assert.equal(evaluate("els.detail.innerHTML.includes('% profile fit')"), true);
const saved = evaluate("matchScore(opportunities[0])");
evaluate('els.homeRegion.value = "Canada"; state.interests.clear(); updateState()');
assert.equal(evaluate("matchScore(opportunities[0])"), saved);
evaluate("clearProfile()");
noScores();
assert.equal(evaluate("els.query.value"), "internship");
console.log("PASS: no default scores, no filter/draft activation, explicit apply, saved snapshot, clear.");

evaluate('els.query.value=""; els.typeFilter.value="Job"; els.paidFilter.value="Paid"; updateState()');
assert.equal(evaluate('filteredItems().map(item => item.id).join(",")'), 'cato-innovation-project');
assert.equal(evaluate('els.typeFilter.options.some(option => option.value === "Job")'), true);
assert.equal(evaluate('els.interestChips.options.some(option => option.textContent === "Job")'), true);
const catoScore = () => evaluate('matchScore(opportunities.find(item => item.id === "cato-innovation-project"))');
assert.equal(catoScore(), null);
evaluate('els.homeRegion.value="United States"; state.interests.add("Job"); els.needsFunded.checked=true; applyProfile()');
const interestedScore = catoScore();
assert.equal(typeof interestedScore, 'number');
evaluate('state.interests.delete("Job"); updateState()');
assert.equal(catoScore(), interestedScore, 'draft interest edits must not change saved matching');
evaluate('applyProfile()');
assert.equal(catoScore(), interestedScore - 22);
evaluate('clearProfile()');
assert.equal(catoScore(), null);
console.log('PASS: Job type and paid filter, explicit Job profile interest, saved snapshot and clear.');

context.AbortController = AbortController;
evaluate('globalThis.registeredTools=[]; document.modelContext={registerTool(tool){registeredTools.push(tool);}}; registerWebMcpTools()');
assert.equal(evaluate('registeredTools.find(tool => tool.name === "filter_opportunities").execute({type:"Job",paid:"Paid",query:""}).count'), 1);
assert.equal(catoScore(), null);
evaluate('registeredTools.find(tool => tool.name === "set_profile_match").execute({homeRegion:"United States",interests:["Job","Unknown"],needsFunded:true})');
assert.equal(evaluate('state.profile.interests.has("Job")'), true);
assert.equal(evaluate('state.profile.interests.has("Unknown")'), false);
assert.equal(typeof catoScore(), 'number');
console.log('PASS: imported WebMCP Job filters and explicitly supplied Job profile; unsupported interests ignored.');
