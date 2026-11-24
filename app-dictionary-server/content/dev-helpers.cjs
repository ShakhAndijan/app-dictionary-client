// Shared builders for Frontend course lesson files (see build-dev-css.cjs).
// lesson({title,intro,theory,defs,life,practice,items}) -> pushes { code, level, module, order, ... } to the list.
// Items: ch (CHOICE), fill (FILL), order (ORDER); `passage` (last argument) is a code snippet shown above the question.
module.exports = function makeHelpers(moduleKey, codePrefix) {
  const L = [];
  let n = 0;
  function lesson(o) {
    n += 1;
    const code = `${codePrefix}-${String(n).padStart(2, '0')}`;
    const items = o.items.map((it, i) => ({ id: String(i + 1), ...it }));
    const t = o.theory;
    const sections = [];
    if (o.defs) sections.push({ heading: "Asosiy ta'riflar", defs: o.defs.map(([term, text]) => ({ term, text })) });
    sections.push(...t.sections);
    if (o.life) sections.push({ heading: 'Hayotdan misollar', life: o.life.map(([icon, title, text]) => ({ icon, title, text })) });
    L.push({ code, level: 'JUNIOR', module: moduleKey, order: n, title: o.title, intro: o.intro, theory: { analogy: t.analogy, sections, recap: t.recap }, practice: o.practice || [], items });
  }
  const withPassage = (it, passage) => (passage ? { ...it, passage } : it);
  const ch = (prompt, answer, wrong, explain, passage) => withPassage({ kind: 'CHOICE', prompt, options: [answer, ...wrong], answer, explain }, passage);
  const fill = (prompt, answer, explain, alsoAccept, passage) => withPassage({ kind: 'FILL', prompt, answer, explain, ...(alsoAccept ? { alsoAccept } : {}) }, passage);
  const order = (prompt, steps, explain) => {
    const w = steps.map((x) => x.replace(/ /g, ' '));
    return { kind: 'ORDER', prompt, words: w, answer: w.join(' '), explain };
  };
  return { L, lesson, ch, fill, order };
};
