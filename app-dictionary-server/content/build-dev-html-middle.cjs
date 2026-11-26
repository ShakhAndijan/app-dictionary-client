// Builds src/main/resources/dev/frontend-html-middle.json (Frontend course, module "html", level MIDDLE)
// from html-mid-part1..3.cjs. Topics: the Middle column of the HTML roadmap. Run: node content/build-dev-html-middle.cjs
const fs = require('fs');
const path = require('path');
const makeHelpers = require('./dev-helpers.cjs');

const { ch, fill, order } = makeHelpers('html', 'fe-html-md');
const L = [];
// Same theory layout as the enriched Junior lessons, but written in place (the glossary pass is Junior only).
function lesson(o) {
  const n = L.length + 1;
  const sections = [
    { heading: 'Bu nima?', text: o.what },
    { heading: "Asosiy ta'riflar", defs: o.defs.map(([term, text]) => ({ term, text })) },
    { heading: "Qachon kerak bo'ladi", defs: o.uses.map(([term, text]) => ({ term, text })) },
    ...o.sections,
    { heading: 'Hayotdan misollar', life: o.life.map(([icon, title, text]) => ({ icon, title, text })) },
    { heading: 'Eslab qoling', callout: { kind: 'tip', text: o.tip } },
    { heading: "Ko'p uchraydigan xatolar", mistakes: o.mistakes },
  ];
  L.push({
    code: `fe-html-md-${String(n).padStart(2, '0')}`, level: 'MIDDLE', module: 'html', order: n, title: o.title, intro: o.intro,
    theory: { analogy: o.analogy, sections, recap: o.recap }, practice: o.practice,
    items: o.items.map((it, i) => ({ id: String(i + 1), ...it })),
  });
}
['./html-mid-part1.cjs', './html-mid-part2.cjs', './html-mid-part3.cjs'].forEach((p) => require(p)({ lesson, ch, fill, order }));

let items = 0;
const long = [];
L.forEach((l) => {
  l.items.forEach((it) => {
    items += 1;
    if (!it.answer) throw new Error(`${l.code}#${it.id}: empty answer`);
    if (it.kind !== 'CHOICE') return;
    if (new Set(it.options).size !== it.options.length || it.options.length !== 4) throw new Error(`${l.code}#${it.id}: bad options`);
    const other = Math.max(...it.options.slice(1).map((x) => x.length));
    if (it.answer.length > other + 3) long.push(`${l.code}#${it.id} (+${it.answer.length - other}): ${it.options.join(' | ')}`);
  });
  if (l.items.length < 10) throw new Error(`${l.code}: only ${l.items.length} items`);
});
if (long.length) console.warn(`correct answer is the longest in ${long.length}:\n${long.join('\n')}`);

const out = path.join(__dirname, '..', 'src', 'main', 'resources', 'dev', 'frontend-html-middle.json');
fs.writeFileSync(out, JSON.stringify(L, null, 1));
console.log('lessons', L.length, 'items', items);
