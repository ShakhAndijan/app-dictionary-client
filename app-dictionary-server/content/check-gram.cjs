const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
let cur = null; const topics = []; let bad = 0;
const err = (m) => { bad++; console.log('ERR', m); };
for (const raw of lines) {
  const line = raw.trim(); if (!line) continue;
  if (/^# \d/.test(line)) {
    const p = line.slice(2).split(' | ');
    if (p.length !== 4) err('header needs 4 parts: ' + line.slice(0, 60));
    cur = { num: p[0], rows: 0, order: 0, seen: new Set() }; topics.push(cur); continue;
  }
  if (!cur) { err('row before header'); continue; }
  const cut = line.lastIndexOf(' | ');
  if (cut < 0) { err('no options: ' + line); continue; }
  const s = line.slice(0, cut);
  let rest = line.slice(cut + 3); const t = rest.indexOf(' ~ '); if (t >= 0) rest = rest.slice(0, t);
  const m = s.match(/\[([^\]]+)\]/);
  if (!m || (s.match(/\[/g) || []).length !== 1) { err('need exactly one [answer]: ' + line); continue; }
  const w = rest.split(',').map((x) => x.trim()).filter(Boolean);
  if (w.length < 2 || w.length > 3) err('need 2-3 wrong options: ' + line);
  const all = [m[1].trim(), ...w].map((x) => x.toLowerCase());
  if (new Set(all).size !== all.length) err('duplicate options: ' + line);
  if (cur.seen.has(s)) err('duplicate sentence: ' + s); cur.seen.add(s);
  cur.rows++;
  const parts = s.split(/(?<=[.!?])\s+/); const part = parts.find((x) => x.includes('[')) || s;
  const n = part.replace(/\[([^\]]+)\]/, '$1').replace(/[.!?]+$/, '').trim().split(/\s+/).length;
  if (n >= 4 && n <= 9) cur.order++;
}
for (const t of topics) {
  const ok = t.rows >= 38 && t.order >= 34;
  if (!ok) bad++;
  console.log('topic', t.num, 'rows', t.rows, 'orderable', t.order, ok ? 'OK' : 'TOO FEW');
}
if (topics.length !== 4) { bad++; console.log('need exactly 4 topics, got', topics.length); }
if (bad) process.exit(1);
