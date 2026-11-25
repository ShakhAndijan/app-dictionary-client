// Builds src/main/resources/dev/frontend-javascript-junior.json from js-js-part1..4.cjs
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const h = makeHelpers("javascript", "fe-js-jr");
['./js-part1.cjs', './js-part2.cjs', './js-part3.cjs', './js-part4.cjs'].forEach((p) => require(p)(h));

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

(async () => {
  const lab = (title, task, starter, solution, tests, hint) => ({ title, task, starter, solution, tests: tests.map(([call, expect]) => ({ call, expect })), hint });
  const labs = {};
  ["./js-labs1.cjs", "./js-labs2.cjs", "./js-labs3.cjs", "./js-labs4.cjs"].forEach((p) => { if (fs.existsSync(require("path").join(__dirname, p))) Object.assign(labs, require(p)(lab)); });
  Object.values(labs).forEach((list) => list.forEach((b, i) => { b.id = String(i + 1); }));
  const checked = await require("./lab-check.cjs")(labs);
  h.L.forEach((l) => { if (labs[l.order]) { l.labs = labs[l.order]; if (l.labs.length < 10) console.warn(l.code + " has only " + l.labs.length + " labs"); } });
  fs.writeFileSync('E:/frontend/app-dictionary/app-dictionary-server/src/main/resources/dev/frontend-javascript-junior.json', JSON.stringify(h.L, null, 1));
console.log('lessons', h.L.length, 'items', items, 'labs', checked);
  // richer theory blocks and Uzbek meanings of English terms
  require('./add-dev-theory.cjs')('javascript');
})().catch((e) => { console.error(e.message); process.exit(1); });
