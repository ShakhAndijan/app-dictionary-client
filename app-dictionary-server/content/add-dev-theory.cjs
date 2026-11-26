// Enriches the Frontend course lessons: adds the "Bu nima? / Qachon kerak / Eslab qoling / Xatolar" blocks from
// content/dev-extra/<module>.cjs and writes the Uzbek meaning after English terms (content/dev-extra/glossary.cjs).
// Safe to run repeatedly. The build-dev-*.cjs scripts call it; by hand: node content/add-dev-theory.cjs
const fs = require('fs');
const path = require('path');
const GLOSSARY = require('./dev-extra/glossary.cjs');

const MODULES = ['internet', 'html', 'css', 'javascript', 'git', 'npm'];
const lower = new Map(Object.entries(GLOSSARY).map(([k, v]) => [k.toLowerCase(), v]));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Longest first, so "event loop" wins over "event". A match must not be part of code: <tag>, .class, a-b, x=y, fn(...)
const terms = [...lower.keys()].sort((a, b) => b.length - a.length).map(escape).join('|');
const TERM = new RegExp(`(?<![\\w<>.#@/\\\\\\-'"\`=:\\[(])(${terms})(s|es)?(?![\\w=(\\[\\-/]|\\.\\w|:\\S)((?:'[a-z']+)?)`, 'gi');

// These words mean something else outside Git (array push, checkout page, reset button ...), so only the Git module
// translates them.
const GIT_ONLY = ['commit', 'branch', 'merge', 'rebase', 'conflict', 'remote', 'push', 'pull', 'clone', 'fork', 'stash',
  'checkout', 'revert', 'reset', 'release', 'cherry-pick', 'repository', 'staging area', 'working directory', 'pull request', 'code review'];

function meanings(module) {
  const map = new Map(lower);
  if (module === 'git') map.set('tag', "versiya yorlig'i");
  else {
    GIT_ONLY.forEach((k) => map.delete(k));
    map.set('fetch', "tarmoqdan so'rash funksiyasi");
  }
  return map;
}

function annotator(done, map) {
  return (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(TERM, (match, term, plural, suffix, offset, whole) => {
      const key = term.toLowerCase();
      if (done.has(key) || !map.has(key)) return match;
      // inside an existing "(...)" explanation: leave it alone
      const before = whole.slice(0, offset);
      if (before.lastIndexOf('(') > before.lastIndexOf(')')) return match;
      done.add(key);
      if (/^\s*\(/.test(whole.slice(offset + match.length))) return match;
      return `${match} (${map.get(key)})`;
    });
  };
}

function blocks(extra) {
  const top = [{ x: 'what', heading: 'Bu nima?', text: extra.what }];
  const uses = [{ x: 'uses', heading: "Qachon kerak bo'ladi", defs: extra.uses.map(([term, text]) => ({ term, text })) }];
  const end = [
    { x: 'tip', heading: 'Eslab qoling', callout: { kind: 'tip', text: extra.tip } },
    { x: 'mistakes', heading: "Ko'p uchraydigan xatolar", mistakes: extra.mistakes },
  ];
  return { top, uses, end };
}

// content/dev-extra/options-<module>.txt: "lesson.item ~ wrong ~ wrong ~ wrong". Replaces the wrong options so that
// the correct one does not stand out as the longest.
function balanceOptions(module, lessons) {
  const file = path.join(__dirname, 'dev-extra', `options-${module}.txt`);
  if (!fs.existsSync(file)) return;
  const rows = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  for (const row of rows) {
    const [key, ...wrong] = row.split(' ~ ');
    const [order, id] = key.split('.');
    const lesson = lessons.find((l) => String(l.order) === order);
    const item = lesson && lesson.items.find((i) => i.id === id);
    if (!item || item.kind !== 'CHOICE') throw new Error(`${module} ${key}: no such choice question`);
    const options = [item.answer, ...wrong];
    if (options.length !== item.options.length) throw new Error(`${module} ${key}: expected ${item.options.length - 1} wrong options`);
    if (new Set(options).size !== options.length) throw new Error(`${module} ${key}: duplicate options`);
    item.options = options; // the server shuffles them for every attempt
  }
}

function enrich(module) {
  const file = path.join(__dirname, '..', 'src', 'main', 'resources', 'dev', `frontend-${module}-junior.json`);
  const extraFile = path.join(__dirname, 'dev-extra', `${module}.cjs`);
  const lessons = JSON.parse(fs.readFileSync(file, 'utf8'));
  const extras = require(extraFile);
  const orders = new Set(lessons.map((l) => String(l.order)));
  for (const key of Object.keys(extras)) if (!orders.has(key)) throw new Error(`${module}: no lesson ${key}`);

  for (const lesson of lessons) {
    const extra = extras[lesson.order];
    if (!extra) throw new Error(`${module}: lesson ${lesson.order} has no extra theory`);
    for (const k of ['what', 'uses', 'tip', 'mistakes']) if (!extra[k] || !extra[k].length) throw new Error(`${module} ${lesson.order} lacks ${k}`);
    const base = lesson.theory.sections.filter((s) => !s.x);
    const { top, uses, end } = blocks(extra);
    const hasDefs = base[0] && base[0].defs;
    const life = base.filter((s) => s.life);
    const middle = base.slice(hasDefs ? 1 : 0).filter((s) => !s.life);
    const sections = [...top, ...(hasDefs ? [base[0]] : []), ...uses, ...middle, ...life, ...end];

    // Terms a lesson already translates in its definitions are not annotated again.
    const done = new Set();
    for (const d of (hasDefs ? base[0].defs : [])) {
      const m = /^(.*?)\s*\(/.exec(d.term);
      if (m) done.add(m[1].toLowerCase());
    }
    const map = meanings(module);
    const note = annotator(done, map);
    for (const s of sections) {
      if (s.text) s.text = note(s.text);
      if (s.defs) s.defs.forEach((d) => {
        const key = d.term.toLowerCase();
        if (map.has(key) && !d.term.includes('(')) { d.term = `${d.term} (${map.get(key)})`; done.add(key); }
        d.text = note(d.text);
      });
      if (s.bullets) s.bullets = s.bullets.map(note);
      if (s.callout) s.callout.text = note(s.callout.text);
      if (s.life) s.life.forEach((l) => { l.text = note(l.text); });
    }
    lesson.theory.sections = sections;
    if (lesson.theory.analogy) lesson.theory.analogy.text = note(lesson.theory.analogy.text);
    lesson.theory.recap = lesson.theory.recap.map(note);
    (lesson.practice || []).forEach((p) => { p.text = note(p.text); });
    // answers and options stay untouched; only the explanation shown after answering
    lesson.items.forEach((it) => { if (it.explain) it.explain = annotator(new Set(), map)(it.explain); });
  }
  balanceOptions(module, lessons);
  fs.writeFileSync(file, JSON.stringify(lessons, null, 1));
  console.log(`${module}: enriched ${lessons.length} lessons`);
}

module.exports = enrich;
if (require.main === module) MODULES.filter((m) => fs.existsSync(path.join(__dirname, 'dev-extra', `${m}.cjs`))).forEach(enrich);
