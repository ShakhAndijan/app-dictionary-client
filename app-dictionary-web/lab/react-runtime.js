// Runtime of the React coding labs. scripts/build-react-lab.mjs bundles it (with real React 18, react-test-renderer,
// sucrase and react-router) into src/pages/reactLab.gen.js, which runs inside a Web Worker. `show` and `same` come from
// src/pages/devLab.ts and are prepended by the build, so JavaScript and React labs compare results the same way.
/* global show, same */
import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import * as Router from 'react-router-dom';
import { transform } from 'sucrase';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act } = TestRenderer;

const REACT_NAMES = ['useState', 'useEffect', 'useRef', 'useReducer', 'useMemo', 'useCallback', 'useContext', 'createContext',
  'memo', 'forwardRef', 'useLayoutEffect', 'useId', 'useSyncExternalStore', 'useTransition', 'useDeferredValue',
  'useImperativeHandle', 'Component', 'PureComponent', 'Fragment', 'Suspense', 'lazy', 'StrictMode', 'startTransition',
  'Children', 'cloneElement', 'isValidElement'];
const ROUTER_NAMES = ['MemoryRouter', 'Routes', 'Route', 'Link', 'NavLink', 'Outlet', 'Navigate', 'useNavigate', 'useParams',
  'useLocation', 'useSearchParams', 'useOutletContext', 'useMatch'];

/* ------------------------------------------------------------------ querying the rendered tree */

const kids = (node) => (node && node.children) || [];
const textOf = (node) => (typeof node === 'string' ? node : kids(node).map(textOf).join(''));

function parseSelector(sel) {
  return sel.trim().split(/\s+/).map((part) => {
    const m = /^([a-zA-Z][\w-]*|\*)?((?:[.#][\w-]+|\[[\w-]+(?:=(?:"[^"]*"|'[^']*'|[\w-]+))?\])*)$/.exec(part);
    if (!m) throw new Error('selektor tushunarsiz: ' + sel);
    return { tag: m[1] && m[1] !== '*' ? m[1] : null, rest: m[2].match(/[.#][\w-]+|\[[^\]]+\]/g) || [] };
  });
}
function matches(node, q) {
  if (q.tag && node.type !== q.tag) return false;
  return q.rest.every((r) => {
    if (r[0] === '.') return String(node.props.className || '').split(/\s+/).includes(r.slice(1));
    if (r[0] === '#') return node.props.id === r.slice(1);
    const [name, raw] = r.slice(1, -1).split('=');
    const value = node.props[name] !== undefined ? node.props[name] : node.props[name === 'for' ? 'htmlFor' : name];
    if (raw === undefined) return value !== undefined && value !== false;
    return String(value) === raw.replace(/^["']|["']$/g, '');
  });
}
/** Every match as the chain root → node. */
function query(roots, sel) {
  const parts = parseSelector(sel);
  const out = [];
  const walk = (node, chain) => {
    if (typeof node === 'string' || !node) return;
    const here = chain.concat(node);
    if (matches(node, parts[parts.length - 1])) {
      let i = parts.length - 2;
      for (let j = chain.length - 1; j >= 0 && i >= 0; j--) if (matches(chain[j], parts[i])) i--;
      if (i < 0) out.push(here);
    }
    kids(node).forEach((c) => walk(c, here));
  };
  roots.forEach((r) => walk(r, []));
  return out;
}

const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'area', 'col', 'wbr']);
const ATTR = { className: 'class', htmlFor: 'for', defaultValue: 'value', defaultChecked: 'checked', tabIndex: 'tabindex' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const cssName = (k) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
function toHtml(node) {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return esc(node);
  if (Array.isArray(node)) return node.map(toHtml).join('');
  let attrs = '';
  for (const [k, v] of Object.entries(node.props)) {
    if (k === 'children' || k === 'key' || k === 'ref' || /^on[A-Z]/.test(k) || v === undefined || v === null || v === false || typeof v === 'function') continue;
    if (k === 'style') attrs += ' style="' + esc(Object.entries(v).map(([a, b]) => cssName(a) + ':' + b).join(';')) + '"';
    else if (typeof v !== 'object') attrs += ' ' + (ATTR[k] || k) + (v === true ? '' : '="' + esc(v) + '"');
  }
  if (VOID.has(node.type)) return '<' + node.type + attrs + '>';
  return '<' + node.type + attrs + '>' + kids(node).map(toHtml).join('') + '</' + node.type + '>';
}

/* ------------------------------------------------------------------ a rendered component */

function makeView(element, env) {
  const mocks = new Map();
  const keyOf = (props, type) => props.name || props.id || type;
  const mockFor = (props, type) => {
    const key = keyOf(props, type);
    if (!mocks.has(key)) {
      const node = {
        tagName: String(type).toUpperCase(), id: props.id || '', name: props.name || '', type: props.type || '',
        value: props.value !== undefined ? props.value : props.defaultValue !== undefined ? props.defaultValue : '',
        checked: !!(props.checked || props.defaultChecked), style: {}, scrollTop: 0,
        focus() { env.focused = key; }, blur() { if (env.focused === key) env.focused = null; },
        select() {}, scrollIntoView() { env.scrolled = key; }, play() { env.media = 'play'; }, pause() { env.media = 'pause'; },
        getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 40, right: 100, bottom: 40 }),
      };
      mocks.set(key, node);
    }
    return mocks.get(key);
  };

  let renderer;
  act(() => {
    renderer = TestRenderer.create(element, { unstable_isConcurrent: true, createNodeMock: (el) => mockFor(el.props, el.type) });
  });

  const roots = () => {
    const json = renderer.toJSON();
    return json === null ? [] : Array.isArray(json) ? json : [json];
  };
  const all = (sel) => query(roots(), sel);
  const one = (sel, i = 0) => {
    const found = all(sel)[i];
    if (!found) throw new Error('topilmadi: ' + sel + (i ? ' (' + (i + 1) + '-chi)' : ''));
    return found;
  };

  const formFields = (form) => {
    const out = [];
    query([form], '*').forEach((chain) => {
      const n = chain[chain.length - 1];
      if (!['input', 'textarea', 'select'].includes(n.type) || !n.props.name) return;
      const m = mockFor(n.props, n.type);
      if (n.props.value !== undefined) m.value = n.props.value;
      if (n.props.checked !== undefined) m.checked = n.props.checked;
      out.push(m);
    });
    return out;
  };

  /** Runs handlers like the browser: capture from the root down, then bubbling from the target up. */
  const dispatch = (chain, name, target, extra = {}) => {
    let stopped = false;
    const event = {
      type: name.slice(2).toLowerCase(), target, button: 0, nativeEvent: {}, defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; }, stopPropagation() { stopped = true; }, persist() {},
      isDefaultPrevented() { return this.defaultPrevented; }, isPropagationStopped: () => stopped, ...extra,
    };
    const path = chain.map((n) => [n, name + 'Capture']).concat(chain.slice().reverse().map((n) => [n, name]));
    act(() => {
      for (const [node, prop] of path) {
        if (stopped) break;
        const handler = node.props[prop];
        if (typeof handler === 'function') {
          event.currentTarget = mockFor(node.props, node.type);
          handler(event);
        }
      }
    });
    return event;
  };

  const targetOf = (node, patch) => {
    const m = mockFor(node.props, node.type);
    if (node.props.value !== undefined) m.value = node.props.value;
    if (node.props.checked !== undefined) m.checked = node.props.checked;
    Object.assign(m, patch);
    m.dataset = Object.fromEntries(Object.entries(node.props).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase()), String(v)]));
    m.getAttribute = (a) => (node.props[a] === undefined ? null : String(node.props[a]));
    return m;
  };

  const submitChain = (chain) => {
    const form = chain[chain.length - 1];
    const target = targetOf(form, {});
    const fields = formFields(form);
    target.fields = fields;
    target.elements = Object.fromEntries(fields.map((f) => [f.name, f]));
    target.reset = () => fields.forEach((f) => { f.value = ''; f.checked = false; });
    dispatch(chain, 'onSubmit', target);
  };

  const view = {
    text: (sel, i = 0) => (sel ? (all(sel)[i] ? textOf(all(sel)[i].slice(-1)[0]) : null) : roots().map(textOf).join('')),
    texts: (sel) => all(sel).map((c) => textOf(c.slice(-1)[0])),
    count: (sel) => all(sel).length,
    has: (sel) => all(sel).length > 0,
    html: () => toHtml(roots()),
    attr: (sel, name, i) => { const p = one(sel, i).slice(-1)[0].props; return p[name] === undefined ? null : p[name]; },
    value: (sel, i) => { const n = one(sel, i).slice(-1)[0]; return n.props.value !== undefined ? n.props.value : mockFor(n.props, n.type).value; },
    checked: (sel, i) => { const n = one(sel, i).slice(-1)[0]; return n.props.checked !== undefined ? !!n.props.checked : !!mockFor(n.props, n.type).checked; },
    disabled: (sel, i) => !!one(sel, i).slice(-1)[0].props.disabled,
    click(sel, i) {
      const chain = one(sel, i);
      const node = chain[chain.length - 1];
      if (node.props.disabled) return view;
      const box = node.type === 'input' && (node.props.type === 'checkbox' || node.props.type === 'radio');
      const target = targetOf(node, {});
      if (box) target.checked = node.props.type === 'radio' ? true : !target.checked;
      const event = dispatch(chain, 'onClick', target);
      if (box) dispatch(chain, 'onChange', target);
      const submits = (node.type === 'button' && (node.props.type === undefined || node.props.type === 'submit')) || (node.type === 'input' && node.props.type === 'submit');
      if (submits && !event.defaultPrevented) {
        const at = chain.map((n) => n.type).lastIndexOf('form');
        if (at >= 0) submitChain(chain.slice(0, at + 1));
      }
      return view;
    },
    type(sel, value, i) {
      const chain = one(sel, i);
      const target = targetOf(chain[chain.length - 1], { value: String(value) });
      dispatch(chain, 'onInput', target);
      dispatch(chain, 'onChange', target);
      return view;
    },
    submit(sel = 'form', i) { submitChain(one(sel, i)); return view; },
    key(sel, key, i) {
      const chain = one(sel, i);
      const target = targetOf(chain[chain.length - 1], {});
      dispatch(chain, 'onKeyDown', target, { key, code: key });
      dispatch(chain, 'onKeyUp', target, { key, code: key });
      return view;
    },
    focus(sel, i) { const c = one(sel, i); const t = targetOf(c.slice(-1)[0], {}); env.focused = keyOf(c.slice(-1)[0].props, c.slice(-1)[0].type); dispatch(c, 'onFocus', t); return view; },
    blur(sel, i) { const c = one(sel, i); dispatch(c, 'onBlur', targetOf(c.slice(-1)[0], {})); return view; },
    hover(sel, i) { const c = one(sel, i); dispatch([c.slice(-1)[0]], 'onMouseEnter', targetOf(c.slice(-1)[0], {})); return view; },
    focused: () => env.focused,
    rerender(next) { act(() => { renderer.update(next); }); return view; },
    unmount() { act(() => { renderer.unmount(); }); return view; },
    // short slices, so renders and effects happen while time passes (as in a real browser)
    async wait(ms = 25) {
      const end = Date.now() + ms;
      do { await act(async () => { await env.sleep(4); }); } while (Date.now() < end);
      return view;
    },
  };
  return view;
}

/* ------------------------------------------------------------------ a tiny fake server */

function makeApi(sleep) {
  const users = [{ id: 1, name: 'Ali', role: 'admin' }, { id: 2, name: 'Vali', role: 'user' }, { id: 3, name: 'Gani', role: 'user' }];
  const posts = [{ id: 1, userId: 1, title: 'Salom' }, { id: 2, userId: 2, title: 'React' }, { id: 3, userId: 1, title: 'Hooks' }];
  const api = { calls: [], aborted: 0 };
  const fetch = (url, opts = {}) => new Promise((resolve, reject) => {
    const method = (opts.method || 'GET').toUpperCase();
    api.calls.push(method + ' ' + url);
    const signal = opts.signal;
    const abort = () => { api.aborted += 1; const e = new Error('The operation was aborted'); e.name = 'AbortError'; reject(e); };
    if (signal && signal.aborted) { abort(); return; }
    if (signal) signal.addEventListener('abort', abort);
    const [path, search] = String(url).split('?');
    const params = new URLSearchParams(search || '');
    let status = 200;
    let body = null;
    let m;
    if (path === '/api/users' && method === 'GET') body = users;
    else if (path === '/api/users' && method === 'POST') { status = 201; body = { id: users.length + 1, ...JSON.parse(opts.body || '{}') }; users.push(body); }
    else if ((m = /^\/api\/users\/(\d+)$/.exec(path))) { body = users.find((u) => u.id === +m[1]) || null; if (!body) status = 404; }
    else if (path === '/api/posts') body = params.has('userId') ? posts.filter((p) => p.userId === +params.get('userId')) : posts;
    else if (path === '/api/fail') status = 500;
    else status = 404;
    const delay = path === '/api/users/1' ? 15 : 5; // user 1 answers slower: handy to reproduce race conditions
    setTimeout(() => {
      if (signal) signal.removeEventListener('abort', abort);
      if (signal && signal.aborted) return;
      resolve({ ok: status < 400, status, json: async () => JSON.parse(JSON.stringify(body)), text: async () => JSON.stringify(body) });
    }, delay);
    void sleep;
  });
  return { api, fetch };
}

/* ------------------------------------------------------------------ running a lab */

const compile = (source) => transform(source, { transforms: ['jsx', 'imports'], production: true }).code;

function makeScope() {
  const env = { focused: null, sleep: (ms) => new Promise((r) => setTimeout(r, ms)) };
  const logs = [];
  const warnings = [];
  const fmt = (args) => args.map((x) => (typeof x === 'string' ? x : show(x))).join(' ');
  const fakeConsole = {
    log: (...a) => { if (logs.length < 200) logs.push(fmt(a)); },
    info: (...a) => { if (logs.length < 200) logs.push(fmt(a)); },
    warn: (...a) => { warnings.push(fmt(a)); },
    error: (...a) => { warnings.push(fmt(a)); },
  };
  const store = new Map();
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); }, clear: () => store.clear(),
  };
  class FakeFormData {
    constructor(form) {
      this.list = [];
      ((form && form.fields) || []).forEach((f) => { if ((f.type === 'checkbox' || f.type === 'radio') && !f.checked) return; this.list.push([f.name, f.type === 'checkbox' && f.value === '' ? 'on' : f.value]); });
    }
    get(k) { const hit = this.list.find((e) => e[0] === k); return hit ? hit[1] : null; }
    getAll(k) { return this.list.filter((e) => e[0] === k).map((e) => e[1]); }
    entries() { return this.list[Symbol.iterator](); }
    [Symbol.iterator]() { return this.list[Symbol.iterator](); }
  }
  const { api, fetch } = makeApi(env.sleep);
  const scope = {
    React,
    ...Object.fromEntries(REACT_NAMES.map((n) => [n, React[n]])),
    ...Object.fromEntries(ROUTER_NAMES.map((n) => [n, Router[n]])),
    render: (element) => makeView(element, env),
    logs: () => logs.slice(),
    warnings: () => warnings.slice(),
    sleep: env.sleep,
    fetch,
    api,
    localStorage,
    FormData: FakeFormData,
    document: { title: '' },
    window: { addEventListener() {}, removeEventListener() {}, innerWidth: 1024, localStorage },
    console: fakeConsole,
  };
  const modules = { react: React, 'react-router-dom': Router, 'react-router': Router };
  scope.require = (name) => { if (!modules[name]) throw new Error("bu laboratoriyada '" + name + "' kutubxonasi yo'q"); return modules[name]; };
  scope.exports = {};
  return { scope, logs, warnings, fakeConsole };
}

/** Evaluates `body` in a fresh scope; React's own warnings are collected, not printed. */
async function evaluate(body) {
  const { scope, logs, fakeConsole } = makeScope();
  const real = { error: globalThis.console.error, warn: globalThis.console.warn };
  globalThis.console.error = (...a) => { const text = a.map(String).join(' '); if (!/act\(|react-test-renderer is deprecated/.test(text)) fakeConsole.error(...a); };
  globalThis.console.warn = (...a) => { if (!/React Router Future Flag/.test(String(a[0]))) fakeConsole.warn(...a); };
  try {
    const names = Object.keys(scope);
    const run = new Function(...names, '{\n' + compile(body) + '\n}');
    const value = await run(...names.map((n) => scope[n]));
    return { value, logs };
  } finally {
    globalThis.console.error = real.error;
    globalThis.console.warn = real.warn;
  }
}

/** The lab's `setup` may end with one "//@preview <App />" line: what the preview pane renders. */
function splitSetup(setup) {
  const m = /^\/\/@preview (.*)$/m.exec(setup || '');
  return { before: (setup || '').replace(/^\/\/@preview .*$/m, ''), preview: m ? m[1] : null };
}

const message = (e) => (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message.split('\n')[0] : String(e));

async function runReactLab({ setup, code, tests }) {
  const { before, preview } = splitSetup(setup);
  try {
    compile(before + '\n' + code);
  } catch (e) {
    return { error: message(e), tests: [], logs: [] };
  }
  const results = [];
  let logs = [];
  for (const t of tests) {
    const r = { ok: false, got: '', expected: '' };
    try {
      const want = (await evaluate('return (' + t.expect + ');')).value;
      r.expected = show(want);
      const run = await evaluate(before + '\n' + code + '\n;return (async () => (' + t.call + '))();');
      if (!logs.length) logs = run.logs.slice(0, 50);
      r.got = show(run.value);
      r.ok = same(run.value, want);
    } catch (e) {
      r.error = message(e);
    }
    results.push(r);
  }
  let html = null;
  if (preview) {
    try {
      const shown = await evaluate(before + '\n' + code + '\n;return (async () => { const v = render(' + preview + '); await v.wait(40); return v.html(); })();');
      html = shown.value;
    } catch (e) {
      html = null;
    }
  }
  return { tests: results, logs, preview: html };
}

globalThis.__runReactLab = runReactLab;
if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
  self.onmessage = (e) => { runReactLab(e.data).then((out) => self.postMessage(out), (err) => self.postMessage({ error: message(err), tests: [], logs: [] })); };
}
