/**
 * Runner for Tailwind labs: the real Tailwind v4 compiler runs in the browser (loaded only when such a lab is opened).
 *
 * kind "tw":    the learner writes HTML with utility classes; `setup` is optional extra Tailwind CSS.
 * kind "twcss": the learner writes Tailwind CSS (@theme, @utility, @apply ...) for the page in `setup`.
 *
 * Tests are the CSS lab helpers (css, w, h, x, y, at, count ...) plus:
 *   cls(sel)         class names of the element        n(sel)          number of matches
 *   tok(name)        a theme color, e.g. tok('red-500'), in the same form css() returns
 *   state(sel, s)    force "hover" | "focus" | "focus-visible" | "focus-within" | "active" on the element
 *   dark()           switch the page to dark mode (the `.dark` class on <html>)
 */
import { useEffect, useState } from 'react';
import themeCss from 'tailwindcss/theme.css?raw';
import preflightCss from 'tailwindcss/preflight.css?raw';
import type { LabRun, LabTest } from './devLab';
import { runInFrame } from './cssLab';

const STATES = ['hover', 'focus', 'focus-visible', 'focus-within', 'active'];

/** Forced states: every state variant also matches a data attribute the tests can set. */
const FORCE = STATES.map((s) => `@custom-variant ${s} (&:is([data-${s}], :${s}));`).join('\n');

const BASE = 'html{font-family:Arial,sans-serif}';
const STILL = '*,*::before,*::after{transition:none!important;animation:none!important}';

function page(kind: string, setup: string, code: string) {
  return kind === 'twcss' ? { html: setup, css: code } : { html: code, css: setup };
}

async function build(kind: string, setup: string, code: string, extra = '') {
  const { compile } = await import('tailwindcss');
  const { html, css } = page(kind, setup, code);
  const input = [
    '@layer theme, base, components, utilities;',
    // static: every theme variable exists in the page, so tests can read any color
    '@layer theme {', themeCss.replace('@theme default', '@theme default static'), '}',
    '@layer base {', preflightCss, BASE, '}',
    '@layer utilities { @tailwind utilities; }',
    FORCE,
    // in "tw" labs dark mode is switched by the `.dark` class; "twcss" learners declare their own variant
    kind === 'tw' ? '@custom-variant dark (&:where(.dark, .dark *));' : '',
    // the import every real project starts with is already done above
    css.replace(/@import\s+["']tailwindcss["']\s*;/g, ''),
  ].join('\n');
  const compiler = await compile(input, {});
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const classes = new Set<string>();
  doc.querySelectorAll('[class]').forEach((el) => el.classList.forEach((c) => classes.add(c)));
  const out = compiler.build([...classes]) + extra;
  const safe = out.replace(/<\/style/gi, '<\\/style');
  return `<!doctype html><html><head><meta charset="utf-8"><style id="lab">${safe}</style></head><body>${html}</body></html>`;
}

export async function runTwLab(kind: string, setup: string, code: string, tests: LabTest[]): Promise<LabRun> {
  let document_: string;
  try {
    document_ = await build(kind, setup, code, STILL);
  } catch (err) {
    return { error: `Tailwind: ${err instanceof Error ? err.message : String(err)}`, tests: [], logs: [] };
  }
  return runInFrame(document_, tests, (frame, base) => {
    const doc = () => frame.contentDocument!;
    const find = (sel: string) => {
      const el = doc().querySelector(sel);
      if (!el) throw new Error(`Element topilmadi: ${sel}`);
      return el;
    };
    return {
      reset: () => {
        doc().documentElement.classList.remove('dark');
        for (const s of STATES) doc().querySelectorAll(`[data-${s}]`).forEach((el) => el.removeAttribute(`data-${s}`));
      },
      helpers: {
        cls: (sel: string) => Array.from(find(sel).classList),
        n: (sel: string) => doc().querySelectorAll(sel).length,
        tok: (name: string) => base.color(`var(--color-${name})`),
        state: (sel: string, name: string) => find(sel).setAttribute(`data-${name}`, ''),
        dark: () => doc().documentElement.classList.add('dark'),
        src: () => code.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, ''),
      },
    };
  });
}

/** The live preview page; keeps the last good one while the CSS being typed does not compile. */
export function useTwDocument(kind: string | null, setup: string, code: string): string {
  const [doc, setDoc] = useState('');
  useEffect(() => {
    if (!kind) return;
    let live = true;
    const timer = window.setTimeout(() => {
      build(kind, setup, code).then(
        (next) => { if (live) setDoc(next); },
        () => {},
      );
    }, 200);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [kind, setup, code]);
  return doc;
}
