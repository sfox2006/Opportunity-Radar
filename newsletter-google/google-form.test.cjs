const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/GoogleForm.gs', 'utf8');
const id = 'YOUR_FORM_RESPONSE_SHEET_ID';
let rows = [], creates = 0, labels = 0, fail = false, existing = null, triggers = [];
const log = {getLastRow: () => rows.length, getRange: (row, col, count) => ({
  getValues: () => rows.map(r => [r]), setValue: value => {rows[row-1] = value;}
})};
const ctx = vm.createContext({
  PropertiesService: {getScriptProperties: () => ({getProperty: () => 'contactGroups/future'})},
  SpreadsheetApp: {flush() {}, openById: () => ({getSheetByName: () => ({getRange: () => ({getValues: () => [['Timestamp','Full name','Email']]})})})},
  ScriptApp: {getProjectTriggers: () => triggers, newTrigger: handler => ({forSpreadsheet: () => ({onFormSubmit: () => ({create: () => triggers.push({getHandlerFunction: () => handler, getTriggerSourceId: () => id})})})})},
  LockService: {getScriptLock: () => ({waitLock() {}, releaseLock() {}})},
  sheet_: () => ({getParent: () => ({getSheetByName: () => log})}),
  hash_: value => value,
  findContact_: () => existing,
  people_: (path) => {
    if (path === 'people:createContact') {creates++; return {resourceName:'people/new'};}
    labels++; if (fail) throw Error('Temporary failure'); return {};
  }
});
vm.runInContext(source, ctx);
const event = {triggerUid:'test', source:{getId:()=>id}, range:{getSheet:()=>({getName:()=> 'Form responses 1'}),getRow:()=>2}, namedValues:{'Full name':['Test Person'],Email:['test@example.com']},values:['date','Test Person','test@example.com']};
ctx.setupGoogleFormTrigger(); ctx.setupGoogleFormTrigger(); assert.equal(triggers.length,1);
assert.equal(creates,0);
ctx.newsletterFormSubmitted_(event); ctx.newsletterFormSubmitted_(event);
assert.equal(creates,1); assert.equal(labels,1);
rows=[]; existing='people/existing'; ctx.newsletterFormSubmitted_(event); assert.equal(creates,1);
rows=[]; existing=null; fail=true;
assert.throws(()=>ctx.newsletterFormSubmitted_(event));
const before=creates; fail=false; ctx.newsletterFormSubmitted_(event); assert.equal(creates,before);
assert.throws(()=>ctx.newsletterFormSubmitted_({...event,source:{getId:()=> 'wrong'}}));
assert.throws(()=>ctx.newsletterFormSubmitted_({...event,namedValues:{'Full name':['Test'],Email:['bad']}}));
console.log('PASS: new submissions, duplicates, existing contacts, retry, validation and idempotent trigger setup; no historical import.');
