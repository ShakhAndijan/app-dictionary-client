// Builds src/main/resources/dev/frontend-npm-junior.json from npm-part1..2.cjs (lessons) and npm-labs.cjs (labs).
// Labs are package manager labs: the learner types commands that run in the in-browser simulator (web/src/pages/npmSim.js).
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const h = makeHelpers('npm', 'fe-npm-jr');
['./npm-part1.cjs', './npm-part2.cjs'].forEach((p) => require(p)(h));

let items = 0;
let longest = 0;
h.L.forEach((l) => {
  l.items.forEach((it) => {
    items += 1;
    if (!it.answer) throw new Error(`${l.code}#${it.id}: empty answer`);
    if (it.kind !== 'CHOICE') return;
    if (!it.options.includes(it.answer)) throw new Error(`${l.code}#${it.id}: answer not in options`);
    if (new Set(it.options).size !== it.options.length) throw new Error(`${l.code}#${it.id}: duplicate options`);
    // the right option must not give itself away by being clearly the longest
    const others = Math.max(...it.options.filter((o) => o !== it.answer).map((o) => o.length));
    if (it.answer.length > others + 3) { longest += 1; console.warn(`${l.code}#${it.id}: answer stands out (${it.answer.length}/${others}) ${it.answer}`); }
  });
  if (l.items.length < 10) console.warn(`${l.code} has only ${l.items.length} items`);
});

(async () => {
  const STARTER = '# Buyruqlarni shu yerga yozing (har qatorga bitta)\n';
  const nlab = (title, task, setup, solution, tests, hint) => ({ title, task, starter: STARTER, solution, tests: tests.map(([call, expect]) => ({ call, expect })), hint, kind: 'npm', setup });
  const labs = require('./npm-labs.cjs')(nlab);
  Object.values(labs).forEach((list) => list.forEach((b, i) => { b.id = String(i + 1); }));
  const checked = await require('./lab-check.cjs')(labs);
  h.L.forEach((l) => { if (labs[l.order]) { l.labs = labs[l.order]; if (l.labs.length < 10) console.warn(`${l.code} has only ${l.labs.length} labs`); } });
  fs.writeFileSync('E:/frontend/app-dictionary/app-dictionary-server/src/main/resources/dev/frontend-npm-junior.json', JSON.stringify(h.L, null, 1));
  console.log('lessons', h.L.length, 'items', items, 'labs', checked, 'standing out', longest);
  // richer theory blocks and Uzbek meanings of English terms
  require('./add-dev-theory.cjs')('npm');
})().catch((e) => { console.error(e.message); process.exit(1); });
