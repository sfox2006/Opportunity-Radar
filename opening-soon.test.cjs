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
assert.equal(evaluate("state.catalog"), "open");
assert.equal(evaluate("els.tabOpen.ariaSelected"), "true");
assert.equal(evaluate("els.tabOpening.ariaSelected"), "false");
assert.equal(evaluate("els.tabOpen.tabIndex"), 0);
assert.equal(evaluate("els.tabOpening.tabIndex"), -1);
assert.equal(evaluate("els.panelOpen.hidden"), false);
assert.equal(evaluate("els.panelOpening.hidden"), true);
assert.equal(evaluate("els.selectionStrip.hidden"), true);
assert.equal(evaluate("els.detail.innerHTML"), "");
assert.equal(evaluate("els.legendSelected.hidden"), true);
assert.match(evaluate("els.openingSoonList.innerHTML"), /No reviewed programmes have a confirmed opening date in the next three months right now\./);
assert.equal(evaluate("els.openingSoonList.innerHTML.includes('program-row')"), false);
assert.equal(evaluate("els.openingSoonHead.hidden"), true);
assert.equal(Number(evaluate("els.openCount.textContent")), 107);
assert.equal(Number(evaluate("els.openingCount.textContent")), 0);

assert.equal(evaluate("opportunities.length"), 107);
assert.equal(evaluate("filteredItems().length"), 107);
assert.equal(Number(evaluate("els.scanCount.textContent")), 107);
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
assert.equal(evaluate("opportunities.length"), 107);
assert.equal(evaluate("filteredItems().some(item => item.id === 'example-opening')"), false);

evaluate("state.selectedId = 'tfas-washington-2027'; render()");
assert.equal(evaluate("els.selectionStrip.hidden"), false);
assert.equal(evaluate("els.legendSelected.hidden"), false);
assert.match(evaluate("els.detail.innerHTML"), /TFAS Washington Fellowship - Spring 2027/);
assert.match(evaluate("els.detail.innerHTML"), /The Fund for American Studies/);
assert.equal(Number(evaluate("els.scanCount.textContent")), 107);

function isoOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function prettyDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[month - 1]} ${year}`;
}
const opensIn30 = isoOffset(30);
const opensIn200 = isoOffset(200);
const soon = {
  id: "test-opening-30",
  organisation: "Example Institute",
  program: "Example Opening Fellowship",
  country: "United Kingdom",
  region: "United Kingdom",
  lat: 51.5074,
  lon: -0.1278,
  type: "Fellowship",
  opensOn: opensIn30,
  url: "https://example.org/opening-fellowship",
  description: "A test-only opening.",
  location: "London"
};
const unpinned = {
  id: "test-opening-30-unpinned",
  organisation: "Example Institute",
  program: "Example Unpinned Seminar",
  country: "Global",
  region: "Online",
  type: "Seminar",
  opensOn: opensIn30,
  url: "https://example.org/unpinned-seminar",
  description: "Listed without a map pin."
};
const later = {
  id: "test-opening-200",
  organisation: "Example Institute",
  program: "Example Far Fellowship",
  country: "United Kingdom",
  region: "United Kingdom",
  lat: 51.5074,
  lon: -0.1278,
  type: "Fellowship",
  opensOn: opensIn200,
  url: "https://example.org/far-fellowship",
  description: "Opens outside the three-month window."
};
assert.match(readFileSync("dist/app.js", "utf8"), /const openingSoon = \[\];/);
assert.equal(evaluate(`isOpeningSoon(${JSON.stringify(soon)}, new Date())`), true);
assert.equal(evaluate(`isOpeningSoon(${JSON.stringify(later)}, new Date())`), false);
evaluate(`openingSoon.push(${JSON.stringify(soon)}, ${JSON.stringify(unpinned)}, ${JSON.stringify(later)}); render();`);
assert.equal(evaluate("state.catalog"), "open");
assert.equal(evaluate("opportunities.length"), 107);
assert.equal(evaluate("filteredItems().some(item => item.id.startsWith('test-opening'))"), false);
assert.equal(evaluate("mapMarkers.includes('test-opening-30')"), false);
assert.equal(evaluate("mapMarkers.includes('test-opening-200')"), false);
assert.equal(evaluate("mapMarkers.includes('test-opening-30-unpinned')"), false);
assert.equal(evaluate("mapMarkers.includes('tfas-washington-2027')"), true);
assert.equal(Number(evaluate("els.openCount.textContent")), 107);
assert.equal(Number(evaluate("els.openingCount.textContent")), 2);
assert.equal(Number(evaluate("els.scanCount.textContent")), 107);
assert.equal(evaluate("els.panelOpening.hidden"), true);

evaluate("state.selectedId = 'tfas-washington-2027'; selectCatalog('opening');");
assert.equal(evaluate("state.catalog"), "opening");
assert.equal(evaluate("state.selectedId"), null);
assert.equal(evaluate("els.selectionStrip.hidden"), true);
assert.equal(evaluate("els.tabOpen.ariaSelected"), "false");
assert.equal(evaluate("els.tabOpening.ariaSelected"), "true");
assert.equal(evaluate("els.tabOpen.tabIndex"), -1);
assert.equal(evaluate("els.tabOpening.tabIndex"), 0);
assert.equal(evaluate("els.panelOpen.hidden"), true);
assert.equal(evaluate("els.panelOpening.hidden"), false);
assert.equal(evaluate("els.openingSoonHead.hidden"), false);
const openingList = evaluate("els.openingSoonList.innerHTML");
assert.match(openingList, /Example Opening Fellowship/);
assert.match(openingList, new RegExp(`Opens ${prettyDate(opensIn30).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
assert.match(openingList, /Example Unpinned Seminar/);
assert.equal(openingList.includes("Example Far Fellowship"), false);
assert.equal(openingList.includes("test-opening-200"), false);
assert.match(openingList, /View on globe/);
assert.equal((openingList.match(/View on globe/g) || []).length, 1);
assert.equal(evaluate("mapMarkers.join(',')"), "test-opening-30");
assert.equal(evaluate("mapFeaturesFor(activeProgrammes()).features[0].geometry.coordinates.join(',')"), "-0.1278,51.5074");
assert.equal(Number(evaluate("els.openCount.textContent")), 107);
assert.equal(Number(evaluate("els.openingCount.textContent")), 2);
assert.equal(Number(evaluate("els.scanCount.textContent")), 2);
assert.equal(evaluate("activeProgrammes().some(item => item.id === 'test-opening-200')"), false);
assert.equal(evaluate("opportunities.some(item => item.id === 'test-opening-200')"), false);

evaluate(`
  const added = [];
  const sourceData = [];
  map = {
    layers: added,
    sourceData,
    getSource() { return { setData: (data) => sourceData.push(data) }; },
    addLayer: (layer) => added.push(layer),
    on() {},
    getZoom: () => 2,
    setPaintProperty() {},
    getCanvas: () => ({ style: {} })
  };
  state.mapReady = true;
  syncMap();
`);
assert.equal(evaluate("map.layers.some(layer => layer.id === 'pin-test-opening-30')"), true);
assert.equal(evaluate("map.layers.some(layer => layer.id === 'pin-test-opening-200')"), false);
assert.equal(evaluate("map.layers.some(layer => layer.id === 'pin-test-opening-30-unpinned')"), false);
assert.equal(
  evaluate("JSON.stringify(map.layers.find(layer => layer.id === 'pin-test-opening-30').filter)"),
  JSON.stringify(["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], "test-opening-30"]])
);
assert.equal(evaluate("map.sourceData.at(-1).features.map(feature => feature.properties.id).join(',')"), "test-opening-30");

evaluate("onCatalogTabKeydown({ key: 'ArrowLeft', currentTarget: els.tabOpening, preventDefault() { this.defaultPrevented = true; } });");
assert.equal(evaluate("state.catalog"), "open");
assert.equal(evaluate("els.panelOpen.hidden"), false);
assert.equal(evaluate("els.panelOpening.hidden"), true);
assert.equal(evaluate("els.tabOpen.ariaSelected"), "true");
assert.equal(evaluate("mapMarkers.includes('tfas-washington-2027')"), true);
assert.equal(evaluate("mapMarkers.includes('test-opening-30')"), false);
assert.equal(evaluate("mapMarkers.includes('test-opening-200')"), false);
assert.equal(evaluate("map.sourceData.at(-1).features.some(feature => feature.properties.id === 'test-opening-30')"), false);
assert.equal(evaluate("map.sourceData.at(-1).features.some(feature => feature.properties.id === 'tfas-washington-2027')"), true);
assert.equal(Number(evaluate("els.scanCount.textContent")), 107);

evaluate("onCatalogTabKeydown({ key: 'ArrowRight', currentTarget: els.tabOpen, preventDefault() {} });");
assert.equal(evaluate("state.catalog"), "opening");
assert.equal(evaluate("mapMarkers.join(',')"), "test-opening-30");
evaluate("els.query.value = 'Unpinned'; updateState();");
assert.equal(Number(evaluate("els.openingCount.textContent")), 1);
assert.equal(Number(evaluate("els.openCount.textContent")), 0);
assert.match(evaluate("els.openingSoonList.innerHTML"), /Example Unpinned Seminar/);
assert.equal(evaluate("els.openingSoonList.innerHTML.includes('Example Opening Fellowship')"), false);
assert.equal(evaluate("mapMarkers.length"), 0);
evaluate("els.query.value = 'no-such-programme'; updateState();");
assert.match(evaluate("els.openingSoonList.innerHTML"), /No matches yet/);
assert.equal(evaluate("els.openingSoonList.innerHTML.includes('next three months right now')"), false);
assert.equal(evaluate("els.openingSoonList.innerHTML.includes('Example Far Fellowship')"), false);
assert.equal(Number(evaluate("els.openingCount.textContent")), 0);
assert.equal(Number(evaluate("els.scanCount.textContent")), 0);
evaluate("resetFilters();");
assert.equal(evaluate("state.catalog"), "opening");
assert.equal(Number(evaluate("els.openingCount.textContent")), 2);
assert.equal(Number(evaluate("els.openCount.textContent")), 107);
evaluate("onCatalogTabKeydown({ key: 'Home', currentTarget: els.tabOpening, preventDefault() {} });");
assert.equal(evaluate("state.catalog"), "open");
evaluate("onCatalogTabKeydown({ key: 'End', currentTarget: els.tabOpen, preventDefault() {} });");
assert.equal(evaluate("state.catalog"), "opening");
assert.equal(evaluate("els.tabOpen.ariaSelected === els.tabOpening.ariaSelected"), false);

console.log("PASS: no default selection; opening-soon window is inclusive for three calendar months and excludes the open catalogue.");
