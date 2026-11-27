/**
 * Runner for CSS labs. The learner's CSS is applied to the lab's HTML inside a sandboxed iframe (no scripts run there),
 * and the tests read computed styles and element boxes from outside.
 *
 * A test is {call, expect}: `call` is an expression over the helpers below, `expect` is a literal.
 *   css(sel, prop, pseudo?)  computed value          all(sel, prop)  computed values of every match
 *   x/y/w/h(sel)             element box in px       rule(sel, prop) declared value, for :hover and other states
 *   color(value)             value as rgb(...)       at(width)       resize the viewport (default 600px)
 *   count(sel, prop, value)  matches having value
 *   src()                    the learner's CSS without comments
 */
import type { LabRun, LabTest, LabTestResult } from './devLab';

const WIDTH = 600;
const HEIGHT = 400;
const BASE = 'html,body{margin:0;padding:0}body{font:16px/1.5 Arial,sans-serif;color:#000;background:#fff}';

/** The page the learner's CSS is applied to. `<style>` blocks of the lab's HTML go before the learner's CSS. */
export function cssDocument(setup: string, code: string): string {
  const scaffold: string[] = [];
  const body = setup.replace(/<style>([\s\S]*?)<\/style>/g, (_, s: string) => { scaffold.push(s); return ''; });
  const safe = code.replace(/<\/style/gi, '<\\/style');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}${scaffold.join('\n')}</style><style id="lab">${safe}</style></head><body>${body}</body></html>`;
}

function helpers(frame: HTMLIFrameElement) {
  const doc = () => frame.contentDocument!;
  const style = (el: Element, pseudo?: string) => frame.contentWindow!.getComputedStyle(el, pseudo);
  const find = (sel: string): HTMLElement => {
    const el = doc().querySelector<HTMLElement>(sel);
    if (!el) throw new Error(`Element topilmadi: ${sel}`);
    return el;
  };
  const read = (el: Element, prop: string, pseudo?: string) => style(el, pseudo).getPropertyValue(prop).trim();
  const css = (sel: string, prop: string, pseudo?: string) => read(find(sel), prop, pseudo);
  const all = (sel: string, prop: string) => [...doc().querySelectorAll(sel)].map((el) => read(el, prop));
  const count = (sel: string, prop: string, value: string) => all(sel, prop).filter((v) => v === value).length;
  const rect = (sel: string) => find(sel).getBoundingClientRect();
  const x = (sel: string) => Math.round(rect(sel).left);
  const y = (sel: string) => Math.round(rect(sel).top);
  const w = (sel: string) => Math.round(rect(sel).width);
  const h = (sel: string) => Math.round(rect(sel).height);
  const at = (width: number) => {
    frame.style.width = `${width}px`;
    void frame.offsetWidth;
    void doc().documentElement.offsetWidth;
  };
  const color = (value: string) => {
    if (!value) return '';
    const probe = doc().createElement('i');
    probe.style.color = value;
    doc().body.appendChild(probe);
    const out = style(probe).color;
    probe.remove();
    return out;
  };
  /** The value declared for a selector (nested rules are expanded, `&` included); the last declaration wins. */
  const rule = (selector: string, prop: string) => {
    const norm = (s: string) => s.replace(/\s*([>+~,])\s*/g, '$1').replace(/\s+/g, ' ').trim();
    const wanted = norm(selector);
    let found = '';
    const walk = (list: CSSRuleList, parent: string) => {
      for (const r of Array.from(list) as (CSSRule & { selectorText?: string; style?: CSSStyleDeclaration; cssRules?: CSSRuleList })[]) {
        let current = parent;
        if (r.selectorText !== undefined) {
          // split the selector list on top-level commas only: ":is(a, b)" is one selector
          const parts = r.selectorText.split(/,(?![^(]*\))/).map((s) => s.trim());
          const full = parent
            ? parts.map((s) => (s.includes('&') ? s.replace(/&/g, parent) : `${parent} ${s}`))
            : parts;
          current = full.join(', ');
          if (full.map(norm).includes(wanted)) found = r.style?.getPropertyValue(prop).trim() || found;
        } else if (r.style && norm(parent) === wanted) {
          found = r.style.getPropertyValue(prop).trim() || found; // declarations after a nested block
        }
        if (r.cssRules) walk(r.cssRules, current);
      }
    };
    walk((doc().getElementById('lab') as HTMLStyleElement).sheet!.cssRules, '');
    return found;
  };
  const src = () => (doc().getElementById('lab')!.textContent ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
  return { css, all, count, x, y, w, h, at, color, rule, src };
}

const PX = /^-?\d+(\.\d+)?px$/;

const equal = (a: unknown, b: unknown): boolean => {
  // zoomed screens snap borders to device pixels (2px is computed as 1.6px at 125%)
  if (typeof a === 'string' && typeof b === 'string' && PX.test(a) && PX.test(b)) return Math.abs(parseFloat(a) - parseFloat(b)) < 0.75;
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equal(v, b[i]));
  return a === b;
};

export function runCssLab(setup: string, code: string, tests: LabTest[]): Promise<LabRun> {
  return runInFrame(cssDocument(setup, code), tests);
}

/** Extra helpers of a runner built on this one; `reset` runs before every test. */
export interface FrameExtension {
  helpers: Record<string, unknown>;
  reset: () => void;
}

/** Loads the page in a hidden sandboxed iframe and evaluates every test against it. */
export function runInFrame(
  page: string,
  tests: LabTest[],
  extend?: (frame: HTMLIFrameElement, base: ReturnType<typeof helpers>) => FrameExtension,
): Promise<LabRun> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-same-origin');
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.style.cssText = `position:fixed;left:-10000px;top:0;border:0;width:${WIDTH}px;height:${HEIGHT}px;visibility:hidden`;
    const finish = (run: LabRun) => {
      window.clearTimeout(timer);
      frame.remove();
      resolve(run);
    };
    const timer = window.setTimeout(() => finish({ error: "Brauzer sahifani ochib bera olmadi, qayta urinib ko'ring", tests: [], logs: [] }), 4000);
    frame.onload = () => {
      const api = helpers(frame);
      const extension = extend?.(frame, api);
      const all = { ...api, ...extension?.helpers };
      const names = Object.keys(all);
      const values = Object.values(all);
      const results: LabTestResult[] = tests.map((t) => {
        const r: LabTestResult = { ok: false, got: '', expected: t.expect };
        try {
          api.at(WIDTH);
          extension?.reset();
          const want: unknown = new Function(`return (${t.expect});`)();
          const got: unknown = new Function(...names, `return (${t.call});`)(...values);
          r.got = JSON.stringify(got);
          r.ok = equal(got, want);
        } catch (err) {
          r.error = err instanceof Error ? err.message : String(err);
        }
        return r;
      });
      finish({ tests: results, logs: [] });
    };
    frame.srcdoc = page;
    document.body.appendChild(frame);
  });
}
