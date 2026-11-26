/**
 * Runs a learner's JavaScript for a coding lab inside a Web Worker (own thread, no access to the page), so an endless
 * loop or a crash cannot freeze the app: the worker is terminated after a timeout.
 *
 * A test is {call, expect}: both are JavaScript expressions. `call` is evaluated after the learner's code (same scope),
 * `expect` is evaluated on its own and the two values are compared deeply.
 */
import GIT_SIM from './gitSim.js?raw';
import NPM_SIM from './npmSim.js?raw';

export interface LabTest {
  call: string;
  expect: string;
}

export interface LabTestResult {
  ok: boolean;
  got: string;
  expected: string;
  error?: string;
}

export interface LabRun {
  /** Syntax or top-level error of the learner's code (then `tests` is empty). */
  error?: string;
  timedOut?: boolean;
  tests: LabTestResult[];
  /** console.log lines written by the learner's code. */
  logs: string[];
}

const WORKER_SOURCE = `
const show = (v, seen = new Set()) => {
  if (v === undefined) return 'undefined';
  if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v);
  if (typeof v === 'bigint') return v + 'n';
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'symbol') return v.toString();
  if (typeof v === 'function') return 'function ' + (v.name || '(anonymous)');
  if (v === null || typeof v !== 'object') return String(v);
  if (seen.has(v)) return '[Circular]';
  seen.add(v);
  let out;
  if (Array.isArray(v)) out = '[' + v.map((x) => show(x, seen)).join(', ') + ']';
  else if (v instanceof Date) out = 'Date(' + (isNaN(v) ? 'Invalid' : v.toISOString()) + ')';
  else if (v instanceof Map) out = 'Map{' + [...v].map(([k, x]) => show(k, seen) + ' => ' + show(x, seen)).join(', ') + '}';
  else if (v instanceof Set) out = 'Set{' + [...v].map((x) => show(x, seen)).join(', ') + '}';
  else if (v instanceof RegExp) out = String(v);
  else if (v instanceof Error) out = v.name + ': ' + v.message;
  else if (v instanceof Promise) out = 'Promise';
  else out = '{' + Object.keys(v).map((k) => k + ': ' + show(v[k], seen)).join(', ') + '}';
  seen.delete(v);
  return out;
};

const same = (a, b, seen = []) => {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (seen.some(([x, y]) => x === a && y === b)) return true;
  seen.push([a, b]);
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Date) return b instanceof Date && Object.is(a.getTime(), b.getTime());
  if (a instanceof RegExp) return b instanceof RegExp && String(a) === String(b);
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;
    for (const [k, v] of a) if (!b.has(k) || !same(v, b.get(k), seen)) return false;
    return true;
  }
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }
  if (a instanceof Error) return b instanceof Error && a.name === b.name && a.message === b.message;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && same(a[k], b[k], seen));
};

self.onmessage = async (e) => {
  const { code, tests } = e.data;
  const logs = [];
  const fmt = (args) => args.map((x) => (typeof x === 'string' ? x : show(x))).join(' ');
  const fakeConsole = {
    log: (...a) => { if (logs.length < 50) logs.push(fmt(a)); },
    info: (...a) => { if (logs.length < 50) logs.push(fmt(a)); },
    warn: (...a) => { if (logs.length < 50) logs.push('warn: ' + fmt(a)); },
    error: (...a) => { if (logs.length < 50) logs.push('error: ' + fmt(a)); },
  };
  const results = [];
  for (const t of tests) {
    const r = { ok: false, got: '', expected: '' };
    try {
      r.expected = show(await (0, eval)('(' + t.expect + ')'));
    } catch (err) {
      r.expected = '?';
    }
    try {
      const run = new Function('console', code + '\\n;return (async () => (' + t.call + '))();');
      const got = await run(fakeConsole);
      const want = await (0, eval)('(' + t.expect + ')');
      r.got = show(got);
      r.expected = show(want);
      r.ok = same(got, want);
    } catch (err) {
      const isSyntax = err instanceof SyntaxError;
      r.error = (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err));
      if (isSyntax) {
        self.postMessage({ error: r.error, tests: [], logs });
        return;
      }
    }
    results.push(r);
  }
  self.postMessage({ tests: results, logs });
};
`;

let workerUrl: string | null = null;

function url(): string {
  if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
  return workerUrl;
}

/** The code the worker really runs: a git or npm lab's text is run by a built-in simulator, which exposes `repo` or `proj` to the tests. */
export function labProgram(lab: { kind?: string | null; setup?: string | null }, code: string): string {
  const args = '(' + JSON.stringify(lab.setup ?? '') + ', ' + JSON.stringify(code) + ');\n';
  if (lab.kind === 'git') return GIT_SIM + '\nconst repo = gitRun' + args;
  if (lab.kind === 'npm') return NPM_SIM + '\nconst proj = npmRun' + args;
  return code;
}

/** Runs the code against the tests; resolves with every test's outcome (never rejects). */
export function runLab(code: string, tests: LabTest[], timeoutMs = 3000): Promise<LabRun> {
  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(url());
    } catch {
      resolve({ error: "Brauzer kodni ishga tushira olmadi (Web Worker mavjud emas)", tests: [], logs: [] });
      return;
    }
    const timer = window.setTimeout(() => {
      worker.terminate();
      resolve({ timedOut: true, error: 'Kod juda uzoq ishladi (cheksiz sikl bo\'lishi mumkin)', tests: [], logs: [] });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<LabRun>) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      window.clearTimeout(timer);
      worker.terminate();
      resolve({ error: e.message || 'Xatolik', tests: [], logs: [] });
    };
    worker.postMessage({ code, tests });
  });
}
