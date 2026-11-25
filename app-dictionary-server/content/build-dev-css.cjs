// Builds src/main/resources/dev/frontend-css-junior.json from css-part1..3.cjs
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const h = makeHelpers('css', 'fe-css-jr');
['./css-part1.cjs', './css-part2.cjs', './css-part3.cjs'].forEach((p) => require(p)(h));

// Sanity checks: CHOICE answers must be among options, options unique, FILL answers non-empty.
let items = 0;
h.L.forEach((l) => {
  l.items.forEach((it) => {
    items += 1;
    if (it.kind === 'CHOICE') {
      if (!it.options.includes(it.answer)) throw new Error(`${l.code}#${it.id}: answer not in options`);
      if (new Set(it.options).size !== it.options.length) throw new Error(`${l.code}#${it.id}: duplicate options`);
    }
    if (!it.answer) throw new Error(`${l.code}#${it.id}: empty answer`);
  });
  if (l.items.length < 10) console.warn(`${l.code} has only ${l.items.length} items`);
});

// 10 coding labs per lesson. They need a real browser to run (web pages/cssLab.ts), so here only the shape is checked.
const lab = (title, task, setup, solution, tests, hint) => ({
  title, task, starter: '/* CSS ni shu yerga yozing */\n', solution, tests: tests.map(([call, expect]) => ({ call, expect: JSON.stringify(expect) })), hint, kind: 'css', setup,
});
const labs = {};
['./css-labs1.cjs', './css-labs2.cjs', './css-labs3.cjs'].forEach((p) => Object.assign(labs, require(p)(lab)));
let labCount = 0;
h.L.forEach((l) => {
  const list = labs[l.order];
  if (!list || list.length !== 10) throw new Error(`${l.code}: needs 10 labs, has ${list ? list.length : 0}`);
  list.forEach((b, i) => { b.id = String(i + 1); });
  l.labs = list;
  labCount += list.length;
});
console.log('labs', labCount);

fs.writeFileSync('E:/frontend/app-dictionary/app-dictionary-server/src/main/resources/dev/frontend-css-junior.json', JSON.stringify(h.L, null, 1));
console.log('lessons', h.L.length, 'items', items);

// richer theory blocks and Uzbek meanings of English terms
require('./add-dev-theory.cjs')('css');
