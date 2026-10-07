const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('footer enquiries use the authorised contact, distinct site subjects, and static HTML links', () => {
  const links = new Map(['listing','organisation','promotion'].map(key=>[key,{hidden:true}]));
  const context = vm.createContext({document:{querySelector(selector){
    return selector.includes('pending') ? null : links.get(/="(.*?)"/.exec(selector)[1]);
  }}});
  vm.runInContext(fs.readFileSync('dist/footer.js','utf8'),context);
  const html=fs.readFileSync('dist/index.html','utf8');
  const subjects=new Set();
  for(const [key,link] of links) {
    const url=new URL(link.href);
    assert.equal(url.protocol,'mailto:');
    assert.equal(url.pathname,'samfoxanu@gmail.com');
    const subject=url.searchParams.get('subject');
    assert.ok(subject.startsWith('Free Society Noticeboard - '));
    subjects.add(subject);
    assert.equal(link.hidden,false);
    assert.ok(html.includes('data-footer-route="'+key+'" href="mailto:samfoxanu@gmail.com?'));
  }
  assert.equal(subjects.size,3);
  assert.equal(html.includes('Submission details coming soon.'),false);
});
