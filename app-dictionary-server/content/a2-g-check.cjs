// Dry-run of a2-gram2 for the topics that already have data: node content/a2-g-check.cjs
const fs = require('fs');
const have = new Set();
for (const f of fs.readdirSync(__dirname + '/a2-g').filter((x) => x.endsWith('.cjs'))) for (const k of Object.keys(require('./a2-g/' + f))) have.add(k);
const topics = fs.readFileSync(__dirname + '/a2-grammar.txt', 'utf8').split(/\r?\n/).filter((l) => /^# \d/.test(l)).map((l) => {
  const p = l.slice(2).split(' | ');
  return { num: p[0].trim(), title: p[1].trim(), rule: p[2].trim(), tip: p[3] };
}).filter((t) => have.has(t.num));
const errors = [];
const lessons = require('./a2-gram2.cjs')({ topics, fail: (m) => errors.push(m) });
console.log('topics', topics.length, 'lessons', lessons.length, 'items', lessons.reduce((s, l) => s + l.items.length, 0));
const exp = new Map();
for (const l of lessons) for (const it of l.items) exp.set(it.explain, (exp.get(it.explain) || 0) + 1);
console.log('unique explanations', exp.size);
if (errors.length) { console.log('ERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('OK');
