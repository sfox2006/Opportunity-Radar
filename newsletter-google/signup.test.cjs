const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { randomUUID, createHash } = require("node:crypto");
const rows = [];
let creates = 0, additions = 0, removals = 0, fail = false;
const context = vm.createContext({
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => "contactGroups/future-leaders" }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ScriptApp: { getService: () => ({ getUrl: () => "https://script.google.com/macros/s/test/exec" }) },
  Utilities: { getUuid: randomUUID }
});
const source = fs.readFileSync("newsletter-google/Code.gs", "utf8");
assert.ok(!source.includes("MailApp"));
vm.runInContext(source, context);
context.sheet_ = () => ({ getLastRow: () => rows.length + 1 });
context.records_ = () => rows.map((data, i) => ({ row: i + 2, data: structuredClone(data) }));
context.save_ = (_, row, data) => { rows[row - 2] = structuredClone(data); };
context.hash_ = token => createHash("sha256").update(token).digest("hex");
context.findContact_ = () => null;
context.people_ = (path, method, body) => {
  if (path === "people:createContact") { creates++; return { resourceName: "people/test" }; }
  if (body.resourceNamesToAdd) { if (fail) throw new Error("Service unavailable"); additions++; }
  if (body.resourceNamesToRemove) removals++;
  return {};
};
const input = { name: "Test", email: "test@example.com", country: "Australia", consent: true };
assert.throws(() => context.subscribe({ ...input, consent: false }));
assert.throws(() => context.subscribe({ ...input, email: "invalid" }));
const result = context.subscribe(input);
assert.equal(rows[0].status, "subscribed");
assert.equal(additions, 1);
assert.equal(creates, 1);
assert.ok(result.unsubscribe);
context.subscribe(input);
assert.equal(creates, 1);
assert.equal(additions, 1);
const token = new URL(result.unsubscribe).searchParams.get("token");
context.completeSubscription("unsubscribe", token);
assert.equal(rows[0].status, "unsubscribed");
assert.equal(removals, 1);
fail = true;
assert.throws(() => context.subscribe(input));
assert.equal(rows[0].status, "saving");
fail = false;
context.subscribe(input);
assert.equal(rows[0].status, "subscribed");
assert.equal(creates, 1);
assert.throws(() => context.completeSubscription("confirm", token));
console.log("PASS: immediate signup, consent, validation, deduplication, unsubscribe, retry and no confirmation-email path.");
