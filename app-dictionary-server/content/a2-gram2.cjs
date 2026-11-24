// A2 grammar, second generation: three DIFFERENT lessons per topic (not the same 30 sentences three times).
//   1. trap   - 12 CHOICE items inside a short context (dialogue / 2-3 sentences), plausible distractors, own explanation each
//   2. error  - 12 CHOICE items: "which part of this text is wrong?" (segments are options), explanation shows the fix
//   3. write  - 6 FILL rewrites (answer + accepted variants) and 6 ORDER items made of longer sentences
// Topic data lives in content/a2-g/*.cjs  ->  { <topic num>: { trap:[[prompt, answer, [wrong..], explain]], error:[[text, wrongPart, [otherParts..], explain]],
//   fill:[[instruction, answer, [alsoAccept..], explain]], order:[[sentence, explain]] } }
const fs = require('fs');
const path = require('path');

function rng(seedText) {
  let h = 2166136261;
  for (const c of seedText) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
}
function shuffled(list, seed) {
  const r = rng(seed); const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const stripEnd = (s) => s.trim().replace(/[.!?]+$/, '');
const clean = (s) => s.replace(/\s+/g, ' ').trim();

const CONTRACT = [['I am', "I'm"], ['you are', "you're"], ['he is', "he's"], ['she is', "she's"], ['it is', "it's"], ['we are', "we're"], ['they are', "they're"],
  ['I have', "I've"], ['we have', "we've"], ['they have', "they've"], ['I will', "I'll"], ['you will', "you'll"], ['we will', "we'll"], ['they will', "they'll"],
  ['do not', "don't"], ['does not', "doesn't"], ['did not', "didn't"], ['is not', "isn't"], ['are not', "aren't"], ['was not', "wasn't"], ['were not', "weren't"],
  ['have not', "haven't"], ['has not', "hasn't"], ['will not', "won't"], ['must not', "mustn't"], ['should not', "shouldn't"], ['cannot', "can't"], ['there is', "there's"]];
function variants(en) {
  const set = new Set();
  const base = stripEnd(en);
  for (const [a, b] of CONTRACT) {
    const reA = new RegExp(`\\b${a}\\b`, 'i');
    const reB = new RegExp(`(^|\\s)${b}(?=\\s|$|,)`, 'i');
    if (reA.test(base)) set.add(base.replace(reA, b));
    if (reB.test(base)) set.add(base.replace(reB, (m, p) => p + a));
  }
  set.delete(base);
  return [...set];
}

module.exports = function build({ topics, fail }) {
  const dir = path.join(__dirname, 'a2-g');
  const data = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.cjs')).sort()) Object.assign(data, require(path.join(dir, f)));
  const out = [];
  topics.forEach((t, idx) => {
    const d = data[t.num];
    if (!d) { fail(`a2-g: no data for topic ${t.num}`); return; }
    const base = { level: 'A2', skill: 'GRAMMAR', topic: t.title, order: idx + 1, intro: t.rule };
    const code = (k) => `a2-gram-${t.num}-${k}`;
    const where = (kind, i) => `T${t.num} ${kind} #${i + 1}`;

    // 1. trap
    const trap = d.trap.map(([prompt, answer, wrongs, explain], i) => {
      if (!/___/.test(prompt)) fail(`${where('trap', i)}: no blank`);
      if (!explain) fail(`${where('trap', i)}: no explain`);
      const opts = [...new Set([answer, ...wrongs])];
      if (opts.length !== wrongs.length + 1) fail(`${where('trap', i)}: duplicate options`);
      return { id: String(i + 1), kind: 'CHOICE', prompt: clean(prompt), options: shuffled(opts, `${t.num}-t${i}`), answer, explain };
    });
    // 2. error
    const error = d.error.map(([text, wrong, others, explain], i) => {
      if (!explain) fail(`${where('error', i)}: no explain`);
      const cand = [wrong, ...others];
      for (const p of cand) if (!text.toLowerCase().includes(p.toLowerCase())) fail(`${where('error', i)}: part "${p}" is not in the text`);
      if (new Set(cand.map((p) => p.toLowerCase())).size !== cand.length) fail(`${where('error', i)}: duplicate parts`);
      // options must not contain each other ("I" next to "I have known"): keep the wrong part, drop overlapping distractors
      const parts = [];
      for (const p of cand) {
        const lp = ' ' + p.toLowerCase() + ' ';
        if (parts.every((q) => { const lq = ' ' + q.toLowerCase() + ' '; return !lq.includes(lp) && !lp.includes(lq); })) parts.push(p);
      }
      if (parts.length < 3) fail(`${where('error', i)}: only ${parts.length} non-overlapping options`);
      return { id: String(i + 1), kind: 'CHOICE', prompt: `Qaysi qism xato? «${clean(text)}»`, options: shuffled(parts, `${t.num}-e${i}`), answer: wrong, explain };
    });
    // 3. write
    const write = [];
    d.fill.forEach(([prompt, answer, alts, explain], i) => {
      if (!explain) fail(`${where('fill', i)}: no explain`);
      const also = [...new Set([...(alts || []), ...variants(answer)])].filter((x) => x.toLowerCase() !== answer.toLowerCase());
      const item = { id: String(write.length + 1), kind: 'FILL', prompt: clean(prompt), answer: stripEnd(answer), explain };
      if (also.length) item.alsoAccept = also.map(stripEnd);
      write.push(item);
    });
    d.order.forEach(([sentence, explain], i) => {
      const text = stripEnd(clean(sentence));
      const words = text.split(' ');
      if (words.length < 6 || words.length > 15) fail(`${where('order', i)}: ${words.length} words`);
      if (!explain) fail(`${where('order', i)}: no explain`);
      let w = shuffled(words, `${t.num}-o${i}`);
      if (w.join(' ') === text) w = w.slice(1).concat(w[0]);
      write.push({ id: String(write.length + 1), kind: 'ORDER', prompt: "Gapni to'g'ri tartibga soling", words: w, answer: text, explain });
    });
    if (trap.length !== 12 || error.length !== 12 || write.length !== 12) fail(`T${t.num}: expected 12/12/12 items, got ${trap.length}/${error.length}/${write.length}`);

    out.push({ ...base, code: code('test'), title: `${t.title} · tuzoqli test`, items: trap });
    out.push({ ...base, code: code('fill'), title: `${t.title} · xatoni toping`, items: error });
    out.push({ ...base, code: code('order'), title: `${t.title} · qayta yozish va tuzish`, items: write });
  });
  return out;
};
