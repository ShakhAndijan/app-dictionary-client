// Builds src/main/resources/dev/frontend-git-junior.json from git-part1..2.cjs (lessons) and git-labs1..2.cjs (labs).
// Labs are git-command labs: the learner types git commands that run in the in-browser simulator (web/src/pages/gitSim.js).
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const h = makeHelpers('git', 'fe-git-jr');
['./git-part1.cjs', './git-part2.cjs'].forEach((p) => require(p)(h));

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

(async () => {
  const STARTER = '# Buyruqlarni shu yerga yozing (har qatorga bitta)\n';
  const glab = (title, task, setup, solution, tests, hint) => ({ title, task, starter: STARTER, solution, tests: tests.map(([call, expect]) => ({ call, expect })), hint, kind: 'git', setup });
  const labs = {};
  ['./git-labs1.cjs', './git-labs2.cjs'].forEach((p) => Object.assign(labs, require(p)(glab)));
  Object.values(labs).forEach((list) => list.forEach((b, i) => { b.id = String(i + 1); }));
  const checked = await require('./lab-check.cjs')(labs);
  h.L.forEach((l) => { if (labs[l.order]) { l.labs = labs[l.order]; if (l.labs.length < 10) console.warn(`${l.code} has only ${l.labs.length} labs`); } });
  fs.writeFileSync('E:/frontend/app-dictionary/app-dictionary-server/src/main/resources/dev/frontend-git-junior.json', JSON.stringify(h.L, null, 1));
  console.log('lessons', h.L.length, 'items', items, 'labs', checked);
})().catch((e) => { console.error(e.message); process.exit(1); });
