// Builds src/main/resources/dev/frontend-<module>-middle.json from <module>-mid-part*.cjs files.
// Theory has the same layout as the enriched Junior lessons but is written in place (the glossary pass is Junior only).
const fs = require('fs');
const path = require('path');
const makeHelpers = require('./dev-helpers.cjs');

module.exports = function buildMiddle(moduleKey, codePrefix, parts, labs) {
  const { ch, fill, order } = makeHelpers(moduleKey, codePrefix);
  const L = [];
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
      code: `${codePrefix}-${String(n).padStart(2, '0')}`, level: 'MIDDLE', module: moduleKey, order: n, title: o.title, intro: o.intro,
      theory: { analogy: o.analogy, sections, recap: o.recap }, practice: o.practice,
      items: o.items.map((it, i) => ({ id: String(i + 1), ...it })),
    });
  }
  parts.forEach((p) => require(p)({ lesson, ch, fill, order }));

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

  // optional coding labs, by lesson number: 10 for every lesson
  if (labs) {
    L.forEach((l) => {
      const list = labs[l.order];
      if (!list || list.length !== 10) throw new Error(`${l.code}: needs 10 labs, has ${list ? list.length : 0}`);
      list.forEach((b, i) => { b.id = String(i + 1); });
      l.labs = list;
    });
    console.log('labs', L.length * 10);
  }

  const out = path.join(__dirname, '..', 'src', 'main', 'resources', 'dev', `frontend-${moduleKey}-middle.json`);
  fs.writeFileSync(out, JSON.stringify(L, null, 1));
  console.log(moduleKey, 'middle: lessons', L.length, 'items', items);
};
