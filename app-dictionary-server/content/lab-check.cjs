// Verifies coding labs the same way the browser does (src/pages/devLab.ts): the helpers `show` and `same` are
// taken from the worker source itself, so results match. Every lab's reference solution must pass all its tests,
// and the starter code must NOT pass them all (otherwise the lab would be solved by doing nothing).
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('E:/frontend/app-dictionary/app-dictionary-web/src/pages/devLab.ts', 'utf8');
const start = src.indexOf('const show = ');
const end = src.indexOf('self.onmessage');
if (start < 0 || end < 0) throw new Error('devLab.ts worker source not found');
const HELPERS = src.slice(start, end).replace(/\\\\/g, '\\');

const RUNNER = `
${HELPERS}
globalThis.__check = async (code, call, expect) => {
  const logs = [];
  const fake = { log: (...a) => logs.push(a.join(' ')), info() {}, warn() {}, error() {} };
  try {
    const run = new Function('console', code + '\\n;return (async () => (' + call + '))();');
    const got = await run(fake);
    const want = await (0, eval)('(' + expect + ')');
    return same(got, want) ? { ok: true } : { ok: false, msg: 'got ' + show(got) + ' expected ' + show(want) };
  } catch (e) {
    return { ok: false, msg: 'threw ' + (e && e.message) };
  }
};
`;

// Broken starter code may throw inside a timer callback; the browser worker reports that as an error, here we ignore it.
process.on('uncaughtException', () => {});

function ctx() {
  const c = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, structuredClone, AbortController, URL, URLSearchParams, TextEncoder, TextDecoder, EventTarget, Event, DOMException });
  vm.runInContext(RUNNER, c);
  return c;
}

async function runTests(code, tests) {
  const out = [];
  for (const [call, expect] of tests) {
    const c = ctx();
    c.__code = code;
    c.__call = call;
    c.__expect = expect;
    let r;
    try {
      const p = vm.runInContext('__check(__code, __call, __expect)', c, { timeout: 1000 });
      r = await Promise.race([p, new Promise((res) => setTimeout(() => res({ ok: false, msg: 'timeout' }), 3000))]);
    } catch (e) {
      r = { ok: false, msg: 'sync timeout/error: ' + e.message };
    }
    out.push(r);
  }
  return out;
}

const GIT_SIM = fs.readFileSync('E:/frontend/app-dictionary/app-dictionary-web/src/pages/gitSim.js', 'utf8');
const prog = (lab, code) => (lab.kind === 'git' ? GIT_SIM + '\nconst repo = gitRun(' + JSON.stringify(lab.setup || '') + ', ' + JSON.stringify(code || '') + ');\n' : code);
module.exports = async function checkLabs(lessonLabs) {
  let n = 0;
  let bad = 0;
  for (const [lesson, labs] of Object.entries(lessonLabs)) {
    for (const lab of labs) {
      n += 1;
      const tag = `lesson ${lesson} lab ${lab.id} (${lab.title})`;
      const sol = await runTests(prog(lab, lab.solution), lab.tests.map((t) => [t.call, t.expect]));
      const fails = sol.map((r, i) => (r.ok ? null : `${lab.tests[i].call}: ${r.msg}`)).filter(Boolean);
      if (fails.length) {
        bad += 1;
        console.error(`SOLUTION FAILS ${tag}\n   ${fails.join('\n   ')}`);
      }
      const st = await runTests(prog(lab, lab.starter || ''), lab.tests.map((t) => [t.call, t.expect]));
      if (st.every((r) => r.ok)) {
        bad += 1;
        console.error(`STARTER ALREADY PASSES ${tag}`);
      }
    }
  }
  if (bad) throw new Error(`${bad} lab problem(s)`);
  return n;
};
