// Builds src/main/resources/learn/b1-*.json from b1-grammar.txt and b1-skills.cjs.
// Run:  node content/build-b1.cjs   (from app-dictionary-server)
const fs = require('fs');
const path = require('path');
const PER_LESSON = 30;
const PASSAGES_PER_LESSON = 6;
const READING_PER_LESSON = 3; // long one-page texts, 10 questions each
const genDir = path.join(__dirname, 'b1-gen');
const gen = (p) => { let out = []; for (let i = 1; i <= 8; i++) { const f = path.join(genDir, p + '-' + i + '.cjs'); if (fs.existsSync(f)) out = out.concat(require(f)); } return out; };
const reading = gen('long');
const listening = gen('longl');
function addInference(passages, prefix) {
  const dir = path.join(__dirname, 'b1-infer');
  const byTopic = {};
  for (let i = 1; i <= 6; i++) {
    const f = path.join(dir, prefix + i + '.cjs');
    if (fs.existsSync(f)) Object.assign(byTopic, require(f));
  }
  for (const p of passages) {
    const extra = byTopic[p.topic];
    if (!extra) { errors.push('no inference questions for ' + prefix + ': ' + p.topic); continue; }
    p.qs = p.qs.concat(extra);
    delete byTopic[p.topic];
  }
  Object.keys(byTopic).forEach((t) => errors.push('unused inference topic ' + prefix + ': ' + t));
}
const errors = [];
addInference(reading, 'r');
addInference(listening, 'l');
const speaking = gen('speak');
const writing = gen('write').slice(0, 30);

const OUT = path.join(__dirname, '..', 'src', 'main', 'resources', 'learn');
const UNITS = 24;
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
  const lines = [1, 2, 3, 4, 5, 6].flatMap((i) => fs.readFileSync(path.join(genDir, 'gram-' + i + '.txt'), 'utf8').split(/\r?\n/));
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
    const code = (kind) => `b1-gram-${t.num}-${kind}`;
    const rows = t.rows;
    if (rows.length < PER_LESSON) fail(`T${t.num} has only ${rows.length} rows`);
    const base = { level: 'B1', skill: 'GRAMMAR', topic: t.title, order: unit, intro: t.rule };

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
      code: `b1-${prefix}-${k + 1}`, level: 'B1', skill, topic: g.map((p) => p.topic).slice(0, 3).join(', ').slice(0, 110) + ', ...', title: `${label} ${k + 1}`,
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
    code: `b1-speaking-${k + 1}`, level: 'B1', skill: 'SPEAKING', topic: r.topic, title: r.title, order: spread(k, speaking.length),
    intro: "Jumlani ovoz chiqarib ayting. 🔊 bilan namunani eshiting, 🎤 bilan o'zingiz gapiring.",
    items: r.phrases.map((p, i) => ({ id: String(i + 1), kind: 'SPEAK', prompt: p, answer: p })),
  }));
}

const CONTRACT = [['I am', "I'm"], ['you are', "you're"], ['he is', "he's"], ['she is', "she's"], ['it is', "it's"], ['we are', "we're"], ['they are', "they're"],
  ['do not', "don't"], ['does not', "doesn't"], ['did not', "didn't"], ['is not', "isn't"], ['are not', "aren't"], ['was not', "wasn't"], ['were not', "weren't"],
  ['can not', "can't"], ['cannot', "can't"], ['will not', "won't"], ['there is', "there's"], ['have not', "haven't"], ['has not', "hasn't"], ['had not', "hadn't"],
  ['I have', "I've"], ['you have', "you've"], ['we have', "we've"], ['they have', "they've"],
  ['I will', "I'll"], ['you will', "you'll"], ['he will', "he'll"], ['she will', "she'll"], ['we will', "we'll"], ['they will', "they'll"],
  ['I would', "I'd"], ['let us', "let's"], ['what is', "what's"], ['where is', "where's"], ['who is', "who's"], ['that is', "that's"], ['could not', "couldn't"], ['would not', "wouldn't"], ['should not', "shouldn't"], ['must not', "mustn't"]];
// Negative short forms: "he is not" -> "he's not", "they are not" -> "they're not" (the pronoun contraction plus "not").
const NEG_PRON = [['I am not', "I'm not"], ['you are not', "you're not"], ['he is not', "he's not"], ['she is not', "she's not"], ['it is not', "it's not"], ['we are not', "we're not"], ['they are not', "they're not"],
  ["you aren't", "you're not"], ["he isn't", "he's not"], ["she isn't", "she's not"], ["it isn't", "it's not"], ["we aren't", "we're not"], ["they aren't", "they're not"]];
// Equivalent words and phrases an A2 learner may reasonably use (both directions are accepted).
const SYNONYMS = [
  ['a lot of', 'lots of'], ['photos', 'pictures'], ['children', 'kids'], ['big', 'large'], ['small', 'little'], ['TV', 'television'],
  ['film', 'movie'], ['shop', 'store'], ['shops', 'stores'], ['flat', 'apartment'], ['holiday', 'vacation'], ['autumn', 'fall'], ['Mom', 'Mum'],
  ['begin', 'start'], ['began', 'started'], ['very', 'really'], ['quickly', 'fast'], ['glad', 'happy'], ['tasty', 'delicious'],
  ['at the weekend', 'on the weekend'], ['at weekends', 'on weekends'], ['trousers', 'pants'],
  ['to the cinema', 'to the movies'],
  ['fix', 'repair'], ['sick', 'ill'], ['mobile phone', 'cell phone'], ['maths', 'math'], ['grandma', 'grandmother'], ['grandpa', 'grandfather'],
];
// "must" and "have to" only swap in positive sentences ("don't have to" is not "must not").
const MODAL = [['I must', 'I have to'], ['you must', 'you have to'], ['we must', 'we have to'], ['they must', 'they have to'], ['he must', 'he has to'], ['she must', 'she has to']];
const NUM_WORDS = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', fifteen: '15', twenty: '20', thirty: '30', fifty: '50', hundred: '100' };
const DAYS = 'monday|tuesday|wednesday|thursday|friday|saturday|sunday';
const TIME_PHRASE = `last (?:week|month|year|night|summer|winter|spring|autumn|weekend|${DAYS})|yesterday(?: (?:morning|afternoon|evening))?|today|tomorrow(?: (?:morning|afternoon|evening))?|next (?:week|month|year|summer|winter|weekend)|every (?:day|morning|evening|week|year|night|weekend|summer|winter)|this (?:morning|evening|afternoon|week|year|summer)|in the (?:morning|evening|afternoon)|at (?:the )?weekend|on (?:${DAYS})s?|at night`;
const TIME_START = new RegExp(`^(${TIME_PHRASE})\\b,?\\s+(.+)$`, 'i');
const TIME_END = new RegExp(`^(.+?)\\s+(${TIME_PHRASE})$`, 'i');
const QUESTION_START = /^(have|has|had|do|does|did|is|are|was|were|am|can|could|will|would|shall|should|may|might|must|what|where|when|why|how|who|which|whose|whom)\b/i;
const SUBORDINATE = /\b(if|that|because|when|while|although|which|who|whose|unless|until|since|before|after)\b/i;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ALTS = {
  "I don't have a sister": ["I haven't got a sister"], 'I like music': ['I love music'], 'Have you got a pen': ['Do you have a pen'],
  'Fruit is healthy': ['Fruit is good for you'], 'Our house is big': ['Our house is large', 'Our home is big'], 'My room is small': ['My room is little'],
  'My town is small': ['My town is little'], 'I am from Uzbekistan': ["I'm from Uzbekistan"], 'I am a student': ['I am a university student'],
};
/** One-step rewrites of a sentence: each entry is a different string that means the same thing. */
function rewrites(s) {
  const out = [];
  const swapPair = (a, b) => {
    const re = new RegExp(`(^|[^\\w'])${escapeRe(a)}(?![\\w'])`, 'i');
    if (re.test(s)) out.push(s.replace(re, (m, pre) => pre + b));
  };
  for (const [a, b] of CONTRACT) { swapPair(a, b); swapPair(b, a); }
  for (const [a, b] of NEG_PRON) { swapPair(a, b); swapPair(b, a); }
  for (const [a, b] of SYNONYMS) { swapPair(a, b); swapPair(b, a); }
  if (!/must(n't| not)|(n't| not) (have|has) to/i.test(s)) for (const [a, b] of MODAL) { swapPair(a, b); swapPair(b, a); }
  // optional "that" after think / hope / know
  for (const v of ['think', 'hope', 'know', 'believe']) {
    const withThat = new RegExp(`\\b(I ${v}) that\\b`, 'i');
    const without = new RegExp(`\\b(I ${v}) (?!that\\b)`, 'i');
    if (withThat.test(s)) out.push(s.replace(withThat, '$1'));
    else if (without.test(s)) out.push(s.replace(without, '$1 that '));
  }
  // a time phrase may open or close the sentence (the server compares in lower case, so the casing of the first word does not matter)
  // Only in plain statements: not in questions, conditionals or sentences with a subordinate clause, where moving it changes the meaning.
  const plain = !QUESTION_START.test(s) && !SUBORDINATE.test(s) && !/[,;]/.test(s);
  if (plain) {
    let m = TIME_START.exec(s);
    if (m) out.push(`${m[2]} ${m[1]}`);
    m = TIME_END.exec(s);
    // "since yesterday" / "until Friday" belong to the preposition and must stay where they are
    if (m && !/\b(since|until|till|by|before|after|from|for|than|of|with|to)$/i.test(m[1])) out.push(`${m[2]} ${m[1]}`);
  }
  // number words and digits
  for (const [w, d] of Object.entries(NUM_WORDS)) {
    const reW = new RegExp(`\\b${w}\\b`, 'i');
    if (reW.test(s)) out.push(s.replace(reW, d));
    const reD = new RegExp(`\\b${d}\\b`);
    if (reD.test(s)) out.push(s.replace(reD, w));
  }
  return out;
}
const normVariant = (s) => s.toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();
// Variants that would be ungrammatical ("I've to", "Do I must") are dropped.
const BAD_VARIANT = /'ve to\b|\b(do|does|did) \w+ (must|have to|has to)\b|\b(have|has) to not\b|\b(had|has|have|'ve|'d) (never |already |just |not )?began\b|\b(has|have) to have\b|, \w+ not (it|you|he|she|we|they|I)$/i;
function variants(en, limit = 40) {
  const base = stripEnd(en).replace(/\u2019/g, "'");
  const seen = new Set([normVariant(base)]);
  const result = [];
  let frontier = [base];
  for (let depth = 0; depth < 2 && result.length < limit; depth++) {
    const next = [];
    for (const s of frontier) {
      for (const v of rewrites(s)) {
        const n = normVariant(v);
        if (seen.has(n) || BAD_VARIANT.test(v)) continue;
        seen.add(n);
        result.push(v);
        next.push(v);
        if (result.length >= limit) break;
      }
      if (result.length >= limit) break;
    }
    frontier = next;
  }
  (ALTS[base] || []).forEach((v) => { if (!seen.has(normVariant(v))) { seen.add(normVariant(v)); result.push(v); } });
  return result;
}
function writingLessons() {
  return writing.map((r, k) => ({
    code: `b1-writing-${k + 1}`, level: 'B1', skill: 'WRITING', topic: r.topic, title: r.title, order: spread(k, writing.length),
    intro: "O'zbekcha gaplarni inglizchaga tarjima qiling. Qisqartmalar (I'm, don't) va ma'nosi bir xil boshqa to'g'ri variantlar (sinonim, vaqt iborasining o'rni, raqam) ham qabul qilinadi.",
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
  'b1-grammar.json': grammarLessons(parseGrammar()),
  'b1-reading.json': readingLessons(),
  'b1-listening.json': listeningLessons(),
  'b1-speaking.json': speakingLessons(),
  'b1-writing.json': writingLessons(),
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
