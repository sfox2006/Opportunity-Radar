const vm=require('node:vm'), fs=require('node:fs'), assert=require('node:assert/strict');
let children;
vm.runInNewContext(fs.readFileSync(__dirname+'/dist/newsletter.js','utf8'),{URL,document:{createElement:tag=>({tag}),getElementById:()=>({replaceChildren:(...items)=>{children=items;}})}});
assert.equal(children[0].tag,'a');assert.equal(children[1].tag,'iframe');
assert.equal(new URL(children[1].src).hostname,'docs.google.com');
assert.equal(new URL(children[1].src).searchParams.get('embedded'),'true');
assert.ok(children[0].href.endsWith('/viewform'));
assert.ok(!children[1].src.includes('script.google.com'));
console.log('PASS: canonical Google Form embed and independent signup link.');
