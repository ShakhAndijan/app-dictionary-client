// Builds src/main/resources/learn/a2-*.json from a2-grammar.txt and a2-skills.cjs.
// Run:  node content/build-a1.cjs   (from app-dictionary-server)
const fs = require('fs');
const path = require('path');
const text = require('./a2-text.cjs');
const prod = require('./a2-prod.cjs');
const PER_LESSON = 30;
const PASSAGES_PER_LESSON = 6;
const READING_PER_LESSON = 3; // long one-page texts, 10 questions each
const more = require('./a2-text-more.cjs');
const genDir = path.join(__dirname, 'a2-gen');
const gen = (p) => { let out = []; for (let i = 1; i <= 6; i++) { const f = path.join(genDir, p + '-' + i + '.cjs'); if (fs.existsSync(f)) out = out.concat(require(f)); } return out; };
const reading = gen('long');
const listening = gen('longl');
const speaking = prod.speaking.concat(gen('speak')).slice(0, 30);
const writing = prod.writing.concat(gen('write')).slice(0, 30);

const OUT = path.join(__dirname, '..', 'src', 'main', 'resources', 'learn');
const UNITS = 24;
const errors = [];
const fail = (m) => errors.push(m);

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

// ---------------------------------------------------------------- grammar
function parseGrammar() {
  const lines = fs.readFileSync(path.join(__dirname, 'a2-grammar.txt'), 'utf8').split(/\r?\n/);
  const topics = [];
  let cur = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^# \d/.test(line)) {
      const p = line.slice(2).split(' | ');
      if (p.length < 4) { fail('bad header: ' + line); continue; }
      cur = { num: p[0].trim(), title: p[1].trim(), rule: p[2].trim(), tip: p.slice(3).join(' | ').trim(), rows: [] };
      topics.push(cur);
    } else if (line.startsWith('#')) {
      continue;
    } else {
      if (!cur) { fail('row before header: ' + line); continue; }
      const cut = line.lastIndexOf(' | ');
      if (cut < 0) { fail(`T${cur.num} no options: ${line}`); continue; }
      const sentence = line.slice(0, cut).trim();
      let rest = line.slice(cut + 3);
      let hint = '';
      const tilde = rest.indexOf(' ~ ');
      if (tilde >= 0) { hint = rest.slice(tilde + 3).trim(); rest = rest.slice(0, tilde); }
      const wrongs = rest.split(',').map((s) => s.trim()).filter(Boolean);
      const m = sentence.match(/\[([^\]]+)\]/);
      if (!m) { fail(`T${cur.num} no [answer]: ${line}`); continue; }
      cur.rows.push({ sentence, answer: m[1].trim(), wrongs, hint });
    }
  }
  // extra rows: "+ <topic no>" sections
  let extra = null;
  for (const raw of fs.readFileSync(path.join(__dirname, 'a2-grammar-more.txt'), 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('+ ')) { extra = topics.find((t) => t.num === line.slice(2).trim()); if (!extra) fail('unknown topic ' + line); continue; }
    if (!extra) { fail('row before section: ' + line); continue; }
    const cut = line.lastIndexOf(' | ');
    const sentence = line.slice(0, cut).trim();
    let rest = line.slice(cut + 3), hint = '';
    const tilde = rest.indexOf(' ~ ');
    if (tilde >= 0) { hint = rest.slice(tilde + 3).trim(); rest = rest.slice(0, tilde); }
    const m = sentence.match(/\[([^\]]+)\]/);
    if (cut < 0 || !m) { fail('bad extra row: ' + line); continue; }
    extra.rows.push({ sentence, answer: m[1].trim(), wrongs: rest.split(',').map((x) => x.trim()).filter(Boolean), hint });
  }
  return topics;
}

// the part of the row that is used for the ORDER exercise (null if too long / unsuitable)
function orderSentence(row) {
  const s = row.sentence;
  const parts = s.split(/(?<=[.!?])\s+/);
  const part = parts.find((p) => p.includes('[')) || s;
  const full = clean(part.replace(/\[([^\]]+)\]/, '$1'));
  const text = stripEnd(full);
  const words = text.split(' ');
  if (words.length < 3 || words.length > 9) return null;
  return { answer: text, words };
}

function grammarLessons(topics) {
  const out = [];
  topics.forEach((t, idx) => {
    const unit = idx + 1;
    const code = (kind) => `a2-gram-${t.num}-${kind}`;
    const rows = t.rows;
    if (rows.length < PER_LESSON) fail(`T${t.num} has only ${rows.length} rows`);
    const base = { level: 'A2', skill: 'GRAMMAR', topic: t.title, order: unit, intro: t.rule };

    const test = rows.slice(0, PER_LESSON).map((r, i) => {
      const opts = shuffled([...new Set([r.answer, ...r.wrongs])], `${t.num}-${i}`);
      return { id: String(i + 1), kind: 'CHOICE', prompt: clean(r.sentence.replace(/\[[^\]]+\]/, '___')), options: opts, answer: r.answer, explain: t.tip };
    });
    out.push({ ...base, code: code('test'), title: `${t.title} · test`, items: test });

    const fill = rows.slice(0, PER_LESSON).map((r, i) => ({
      id: String(i + 1), kind: 'FILL',
      prompt: clean(r.sentence.replace(/\[[^\]]+\]/, '___')) + (r.hint ? ` (${r.hint})` : ''),
      answer: r.answer, explain: t.tip,
    }));
    out.push({ ...base, code: code('fill'), title: `${t.title} · to'ldirish`, items: fill });

    const order = [];
    for (const r of rows) {
      if (order.length >= PER_LESSON) break;
      const o = orderSentence(r);
      if (!o) continue;
      let words = shuffled(o.words, `${t.num}-o${order.length}`);
      if (words.join(' ') === o.answer && words.length > 1) words = words.slice(1).concat(words[0]);
      order.push({ id: String(order.length + 1), kind: 'ORDER', prompt: "Gapni to'g'ri tartibga soling", words, answer: o.answer, explain: t.tip });
    }
    if (order.length < PER_LESSON) fail(`T${t.num} has only ${order.length} ORDER items`);
    out.push({ ...base, code: code('order'), title: `${t.title} · gap tuzish`, items: order });
  });
  return out;
}

// ---------------------------------------------------------------- other skills
const spread = (k, n) => (n <= 1 ? 1 : Math.round(1 + (k * (UNITS - 1)) / (n - 1)));
const NUMBERS = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12' };

function questionItems(qs, extra = {}, startId = 1) {
  return qs.map((q, i) => {
    const item = { id: String(startId + i), prompt: q.prompt, answer: q.answer, ...extra };
    if (q.options) { item.kind = 'CHOICE'; item.options = q.options; }
    else {
      item.kind = 'FILL';
      const a = q.answer.toLowerCase();
      if (NUMBERS[a]) item.alsoAccept = [NUMBERS[a]];
      else if (Object.values(NUMBERS).includes(a)) item.alsoAccept = [Object.keys(NUMBERS).find((k) => NUMBERS[k] === a)];
    }
    if (q.explain) item.explain = q.explain;
    return item;
  });
}

function chunked(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function textLessons(passages, prefix, skill, label, intro, extraOf, perLesson = PASSAGES_PER_LESSON) {
  const groups = chunked(passages, perLesson);
  return groups.map((g, k) => {
    const items = [];
    for (const p of g) items.push(...questionItems(p.qs, extraOf(p), items.length + 1));
    return {
      code: `a2-${prefix}-${k + 1}`, level: 'A2', skill, topic: g.map((p) => p.topic).slice(0, 4).join(', ') + ', ...', title: `${label} ${k + 1}`,
      order: spread(k, groups.length), intro, items,
    };
  });
}

function readingLessons() {
  return textLessons(reading, 'reading', 'READING', "O'qish", "Har bir matnni diqqat bilan o'qing va uning savollariga javob bering.", (p) => ({ passage: p.passage }), READING_PER_LESSON);
}
function listeningLessons() {
  return textLessons(listening, 'listening', 'LISTENING', 'Tinglash',
    "Har bir savol uchun 🔊 tugmasini bosib matnni tinglang (kerak bo'lsa qayta tinglang), so'ng javob bering.", (p) => ({ audio: p.audioText }), READING_PER_LESSON);
}
function speakingLessons() {
  return speaking.map((r, k) => ({
    code: `a2-speaking-${k + 1}`, level: 'A2', skill: 'SPEAKING', topic: r.topic, title: r.title, order: spread(k, speaking.length),
    intro: "Jumlani ovoz chiqarib ayting. 🔊 bilan namunani eshiting, 🎤 bilan o'zingiz gapiring.",
    items: r.phrases.map((p, i) => ({ id: String(i + 1), kind: 'SPEAK', prompt: p, answer: p })),
  }));
}

const CONTRACT = [['I am', "I'm"], ['you are', "you're"], ['he is', "he's"], ['she is', "she's"], ['it is', "it's"], ['we are', "we're"], ['they are', "they're"],
  ['do not', "don't"], ['does not', "doesn't"], ['did not', "didn't"], ['is not', "isn't"], ['are not', "aren't"], ['was not', "wasn't"], ['can not', "can't"], ['will not', "won't"], ['there is', "there's"]];
const ALTS = {
  "I don't have a sister": ["I haven't got a sister"], 'I like music': ['I love music'], 'Have you got a pen': ['Do you have a pen'],
  'Fruit is healthy': ['Fruit is good for you'], 'Our house is big': ['Our house is large', 'Our home is big'], 'My room is small': ['My room is little'],
  'My town is small': ['My town is little'], 'I am from Uzbekistan': ["I'm from Uzbekistan"], 'I am a student': ['I am a university student'],
};
function variants(en) {
  const set = new Set();
  const base = stripEnd(en);
  for (const [a, b] of CONTRACT) {
    const reA = new RegExp(`\\b${a}\\b`, 'i');
    const reB = new RegExp(`\\b${b.replace("'", "'")}\\b`, 'i');
    if (reA.test(base)) set.add(base.replace(reA, b));
    if (reB.test(base)) set.add(base.replace(reB, a));
  }
  (ALTS[base] || []).forEach((v) => set.add(v));
  set.delete(base);
  return [...set];
}
function writingLessons() {
  return writing.map((r, k) => ({
    code: `a2-writing-${k + 1}`, level: 'A2', skill: 'WRITING', topic: r.topic, title: r.title, order: spread(k, writing.length),
    intro: "O'zbekcha gaplarni inglizchaga tarjima qiling. Qisqartmalar (I'm, don't) ham qabul qilinadi.",
    items: r.items.map(([uz, en], i) => {
      const item = { id: String(i + 1), kind: 'FILL', prompt: `Inglizchaga tarjima qiling: ${uz}`, answer: stripEnd(en) };
      const alt = variants(en);
      if (alt.length) item.alsoAccept = alt;
      return item;
    }),
  }));
}

// ---------------------------------------------------------------- validate and write
function validate(lessons, file) {
  const codes = new Set();
  for (const l of lessons) {
    if (codes.has(l.code)) fail(`duplicate code ${l.code}`);
    codes.add(l.code);
    if (l.items.length < PER_LESSON) fail(`${l.code} has only ${l.items.length} items`);
    for (const it of l.items) {
      if (!it.prompt || !it.answer) fail(`${l.code}#${it.id} missing prompt/answer`);
      if (it.kind === 'CHOICE') {
        const norm = (s) => s.toLowerCase().trim();
        if (!it.options.some((o) => norm(o) === norm(it.answer))) fail(`${l.code}#${it.id} answer not in options`);
        if (new Set(it.options.map(norm)).size !== it.options.length) fail(`${l.code}#${it.id} duplicate options`);
      }
      if (it.kind === 'FILL' && l.skill === 'GRAMMAR' && !it.prompt.includes('___')) fail(`${l.code}#${it.id} no blank`);
    }
  }
}

fs.mkdirSync(OUT, { recursive: true });
const sets = {
  'a2-grammar.json': grammarLessons(parseGrammar()),
  'a2-reading.json': readingLessons(),
  'a2-listening.json': listeningLessons(),
  'a2-speaking.json': speakingLessons(),
  'a2-writing.json': writingLessons(),
};
let total = 0;
for (const [file, lessons] of Object.entries(sets)) {
  validate(lessons, file);
  total += lessons.length;
  if (!errors.length) fs.writeFileSync(path.join(OUT, file), JSON.stringify(lessons, null, 1));
  console.log(file, lessons.length, 'lessons,', lessons.reduce((s, l) => s + l.items.length, 0), 'items');
}
if (errors.length) { console.error('\nERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('total', total, 'lessons');
