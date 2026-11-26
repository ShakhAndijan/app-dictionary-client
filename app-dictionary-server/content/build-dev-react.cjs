// Builds src/main/resources/dev/frontend-react-junior.json from react-part*.cjs (lessons) and react-labs*.cjs (labs).
// Labs are React labs: the learner's JSX runs with real React (web/lab/react-runtime.js).
// Build the runtime first: node app-dictionary-web/scripts/build-react-lab.mjs
// Options: --draft allows lessons whose labs are not written yet and does not write the file.
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const draft = process.argv.includes('--draft');
const h = makeHelpers('react', 'fe-react-jr');
const parts = (prefix) => fs.readdirSync(__dirname).filter((f) => new RegExp(`^${prefix}\\d+\\.cjs$`).test(f)).sort();
parts('react-part').forEach((p) => require(`./${p}`)(h));

let items = 0;
h.L.forEach((l) => {
  l.items.forEach((it) => {
    items += 1;
    if (!it.answer) throw new Error(`${l.code}#${it.id}: empty answer`);
    if (it.kind !== 'CHOICE') return;
    if (!it.options.includes(it.answer)) throw new Error(`${l.code}#${it.id}: answer not in options`);
    if (new Set(it.options).size !== it.options.length) throw new Error(`${l.code}#${it.id}: duplicate options`);
    const longestOther = Math.max(...it.options.filter((o) => o !== it.answer).map((o) => o.length));
    if (it.answer.length > longestOther + 3) console.warn(`${l.code}#${it.id} answer stands out: ${it.answer} (${it.answer.length} > ${longestOther})`);
  });
  if (l.items.length < 10) console.warn(`${l.code} has only ${l.items.length} items`);
});

(async () => {
  // L(title, task, starter, solution, tests, hint, preview, setup)
  const L = (title, task, starter, solution, tests, hint, preview, setup) => ({
    title, task, starter, solution, tests: tests.map(([call, expect]) => ({ call, expect })), hint, kind: 'react',
    setup: `${setup ? setup + '\n' : ''}${preview ? '//@preview ' + preview : ''}`,
  });
  const labs = {};
  parts('react-labs').forEach((p) => Object.assign(labs, require(`./${p}`)(L)));
  const only = process.argv.find((a) => a.startsWith('--from='));
  const from = only ? Number(only.slice(7)) : 1;
  Object.values(labs).forEach((list) => list.forEach((b, i) => { b.id = String(i + 1); }));
  const check = await require('./lab-check.cjs')(Object.fromEntries(Object.entries(labs).filter(([k]) => Number(k) >= from)));
  h.L.forEach((l) => {
    if (labs[l.order]) l.labs = labs[l.order];
    if (!l.labs || l.labs.length < 10) console.warn(`${l.code} has ${l.labs ? l.labs.length : 0} labs`);
  });
  console.log('lessons', h.L.length, 'items', items, 'labs checked', check);
  if (draft) return;
  fs.writeFileSync('E:/frontend/app-dictionary/app-dictionary-server/src/main/resources/dev/frontend-react-junior.json', JSON.stringify(h.L, null, 1));
  // richer theory blocks and Uzbek meanings of English terms
  require('./add-dev-theory.cjs')('react');
})().then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1); });
