const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('footer actions use distinct public forms and agree with the static HTML links', () => {
  const links = new Map(['listing','organisation','promotion'].map(key=>[key,{hidden:true}]));
  const context = vm.createContext({document:{querySelector(selector){
    return selector.includes('pending') ? null : links.get(/="(.*?)"/.exec(selector)[1]);
  }}});
  vm.runInContext(fs.readFileSync('dist/footer.js','utf8'),context);
  const html=fs.readFileSync('dist/index.html','utf8');
  const destinations=new Set();
  for(const [key,link] of links) {
    const url=new URL(link.href);
    assert.equal(url.protocol,'https:');
    assert.equal(url.hostname,'docs.google.com');
    assert.match(url.pathname,/^\/forms\/d\/e\/[^/]+\/viewform$/);
    assert.equal(url.search,'');
    destinations.add(link.href);
    assert.equal(link.hidden,false);
    assert.ok(html.includes('data-footer-route="'+key+'" href="'+link.href+'" target="_blank" rel="noopener noreferrer"'));
  }
  assert.equal(destinations.size,3);
  const signup='https://docs.google.com/forms/d/e/1FAIpQLSdhSlAeNGTWPpnG3ZrEx8mASD-W70i7KKJsN-8llZlmvkwTJw/viewform';
  assert.ok(html.includes('href="'+signup+'"'));
  assert.equal(destinations.has(signup),false);
  assert.equal(html.includes('Email a missing listing'),false);
  assert.equal(html.includes('Submission details coming soon.'),false);
});
