const vm = require('node:vm'), fs = require('node:fs'), assert = require('node:assert/strict');
const rows = Array.from({length:31}, (_,i)=>['date','Person',`p${i%30}@example.com`]);
const properties = new Map([['GROUP','contactGroups/future']]);
const people = new Map([['people/old',{emailAddresses:[{value:'p0@example.com'}],memberships:[]}]]);
let writes=0, report;
const ctx=vm.createContext({FORM_RESPONSE_SHEET:'sheet',FORM_RESPONSE_TAB:'tab',Map,
  SpreadsheetApp:{openById:()=>({getSheetByName:()=>({getRange:()=>({getValues:()=>rows})})})},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>properties.get(k),setProperty:(k,v)=>properties.set(k,v)})},
  hash_:s=>s, findContact_:email=>[...people].find(([id,p])=>p.emailAddresses.some(a=>a.value===email))?.[0],
  people_:(path,method,body)=>{
    if(path==='contactGroups/future') return {name:'Future Leaders'};
    if(path==='people:createContact') {const id='people/'+people.size;people.set(id,{...body,memberships:[]});writes++;return {resourceName:id};}
    if(path.endsWith('/members:modify')) {people.get(body.resourceNamesToAdd[0]).memberships=[{contactGroupMembership:{contactGroupResourceName:'contactGroups/future'}}];writes++;return {};}
    return people.get(path.split('?')[0]);
  },console:{log:r=>{report=JSON.parse(r);}}
});
vm.runInContext(fs.readFileSync(__dirname+'/Backfill.gs','utf8'),ctx);
ctx.checkExisting31Responses();
assert.equal(report.verified,30);assert.equal(report.created,29);assert.equal(report.existing,1);
const before=writes;ctx.checkExisting31Responses();assert.equal(writes,before);assert.equal(report.alreadyLabelled,30);
rows[0][2]='bad';assert.throws(()=>ctx.checkExisting31Responses());assert.equal(writes,before);
console.log('PASS: 31 rows / 30 contacts, preserves existing contacts, readback verifies labels, reruns do not duplicate, invalid input stops before writes.');
