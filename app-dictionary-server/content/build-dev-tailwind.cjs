// Builds src/main/resources/dev/frontend-tailwind-junior.json from tailwind-part*.cjs (lessons) and tailwind-labs*.cjs.
// JavaScript labs are checked here by lab-check.cjs; Tailwind labs need a browser (pages/twLab.ts).
const fs = require('fs');
const makeHelpers = require('./dev-helpers.cjs');

const h = makeHelpers('tailwind', 'fe-tw-jr');
[1, 2, 3].forEach((n) => require(`./tailwind-part${n}.cjs`)(h));

h.L.forEach((l) => {
  if (l.items.length < 10) throw new Error(`${l.code} has only ${l.items.length} items`);
  l.items.forEach((it) => {
    if (!it.answer) throw new Error(`${l.code}#${it.id}: empty answer`);
    if (it.kind !== 'CHOICE') return;
    if (new Set(it.options).size !== it.options.length) throw new Error(`${l.code}#${it.id}: duplicate options`);
    // the correct option must not be the longest one
    const longestOther = Math.max(...it.options.filter((o) => o !== it.answer).map((o) => o.length));
    if (it.answer.length > longestOther) console.warn(`${l.code}#${it.id} answer stands out: ${it.answer} (${it.answer.length} > ${longestOther})`);
  });
});

const labelled = (tests) => tests.map(([label, call, expect]) => ({ label, call, expect }));
const make = {
  T: (title, task, starter, solution, tests, hint, setup) => ({ title, task, starter, solution, tests: labelled(tests), hint, kind: 'tw', setup: setup || '' }),
  C: (title, task, html, solution, tests, hint, starter) => ({ title, task, starter: starter ? starter + '\n' : '/* Tailwind CSS ni shu yerga yozing */\n', solution, tests: labelled(tests), hint, kind: 'twcss', setup: html }),
  J: (title, task, starter, solution, tests, hint) => ({ title, task, starter, solution, tests: tests.map(([call, expect]) => ({ call, expect })), hint }),
};

(async () => {
  const labs = {};
  [1, 2, 3].forEach((n) => Object.assign(labs, require(`./tailwind-labs${n}.cjs`)(make)));
  Object.values(labs).forEach((list) => list.forEach((b, i) => { b.id = String(i + 1); }));
  const script = Object.fromEntries(Object.entries(labs).filter(([, list]) => !list[0].kind));
  const checked = await require('./lab-check.cjs')(script);
  h.L.forEach((l) => {
    l.labs = labs[l.order];
    if (!l.labs || l.labs.length !== 10) throw new Error(`${l.code} has ${l.labs ? l.labs.length : 0} labs`);
  });
  const items = h.L.reduce((n, l) => n + l.items.length, 0);
  console.log('lessons', h.L.length, 'items', items, 'script labs checked', checked);
  fs.writeFileSync(require('path').join(__dirname, '..', 'src', 'main', 'resources', 'dev', 'frontend-tailwind-junior.json'), JSON.stringify(h.L, null, 1));
  // richer theory blocks and Uzbek meanings of English terms
  require('./add-dev-theory.cjs')('tailwind');
})().then(() => process.exit(0), (e) => { console.error(e.message); process.exit(1); });
