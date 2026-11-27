/**
 * Runner for HTML labs. The learner's markup is parsed with DOMParser (the browser's real HTML parser; scripts do not run
 * and nothing is downloaded), and the tests ask questions about the resulting document.
 *
 * A test is {call, expect}: `call` is an expression over the helpers below, `expect` is a literal.
 *   n(sel)            number of matches            tag(sel)      tag name of the first match
 *   attr(sel, name)   attribute value or null      attrs(sel, name)  of every match
 *   has(sel, name)    is the attribute present     text(sel) / texts(sel)  text with spaces collapsed
 *   tags(sel)         tag names of every match     name(sel)     accessible name (simplified)
 *   names(sel)        accessible name of every match
 *   dups()            id values used more than once
 *   fd(sel)           what the form would send     valid(sel, value?)  constraint validation of a field
 *   src()             the learner's code without comments
 *   raw()             the learner's code as written
 */
import type { LabRun, LabTest, LabTestResult } from './devLab';

/** The page shown in the preview. */
export function htmlDocument(code: string): string {
  return `<!doctype html><meta charset="utf-8"><style>body{font:16px/1.5 Arial,sans-serif;margin:12px;color:#000;background:#fff}img,video,iframe{max-width:100%}</style>${code}`;
}

const squash = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

/** Text a screen reader would read from the content: images give their alt, hidden decoration is skipped. */
function content(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as Element;
  if (el.getAttribute('aria-hidden') === 'true') return '';
  const label = el.getAttribute('aria-label');
  if (label) return ` ${label} `;
  if (el.localName === 'img') return ` ${el.getAttribute('alt') ?? ''} `;
  return Array.from(el.childNodes, content).join('');
}

const FROM_CONTENT = /^(a|button|h[1-6]|summary|option|th|td|label|legend|caption|figcaption)$/;

function accessibleName(doc: Document, el: Element): string {
  const ids = squash(el.getAttribute('aria-labelledby'));
  if (ids) {
    const out = squash(ids.split(' ').map((id) => { const t = doc.getElementById(id); return t ? content(t) : ''; }).join(' '));
    if (out) return out;
  }
  const label = squash(el.getAttribute('aria-label'));
  if (label) return label;
  const tag = el.localName;
  const type = (el.getAttribute('type') ?? '').toLowerCase();
  let native = '';
  if (tag === 'input' && ['submit', 'button', 'reset'].includes(type)) native = el.getAttribute('value') ?? '';
  else if (tag === 'img' || tag === 'area' || (tag === 'input' && type === 'image')) native = el.getAttribute('alt') ?? '';
  else if (tag === 'input' || tag === 'select' || tag === 'textarea') {
    native = Array.from((el as HTMLInputElement).labels ?? [], (l) => content(l)).join(' ');
  } else if (tag === 'fieldset') native = el.querySelector(':scope > legend')?.textContent ?? '';
  else if (tag === 'table') native = el.querySelector(':scope > caption')?.textContent ?? '';
  else if (tag === 'figure') native = el.querySelector(':scope > figcaption')?.textContent ?? '';
  else if (FROM_CONTENT.test(tag)) native = content(el);
  return squash(native) || squash(el.getAttribute('title'));
}

function helpers(code: string) {
  const doc = new DOMParser().parseFromString(code, 'text/html');
  const find = (sel: string): Element => {
    const el = doc.querySelector(sel);
    if (!el) throw new Error(`Element topilmadi: ${sel}`);
    return el;
  };
  const every = (sel: string) => Array.from(doc.querySelectorAll(sel));
  const n = (sel: string) => every(sel).length;
  const tag = (sel: string) => find(sel).localName;
  const tags = (sel: string) => every(sel).map((el) => el.localName);
  const attr = (sel: string, name: string) => find(sel).getAttribute(name);
  const attrs = (sel: string, name: string) => every(sel).map((el) => el.getAttribute(name));
  const has = (sel: string, name: string) => find(sel).hasAttribute(name);
  const text = (sel: string) => squash(find(sel).textContent);
  const texts = (sel: string) => every(sel).map((el) => squash(el.textContent));
  const name = (sel: string) => accessibleName(doc, find(sel));
  const names = (sel: string) => every(sel).map((el) => accessibleName(doc, el));
  const dups = () => every('[id]').map((el) => el.id).filter((id, i, all) => all.indexOf(id) !== i);
  const fd = (sel: string) => Array.from(new FormData(find(sel) as HTMLFormElement), ([k, v]) => [k, typeof v === 'string' ? v : 'File']);
  const valid = (sel: string, value?: string) => {
    const el = find(sel) as HTMLInputElement;
    if (value !== undefined) el.value = value;
    return el.validity.valid;
  };
  const src = () => code.replace(/<!--[\s\S]*?-->/g, '');
  const raw = () => code;
  return { n, tag, tags, attr, attrs, has, text, texts, name, names, dups, fd, valid, src, raw };
}

export function runHtmlLab(code: string, tests: LabTest[]): Promise<LabRun> {
  const results: LabTestResult[] = tests.map((t) => {
    const r: LabTestResult = { ok: false, got: '', expected: t.expect };
    try {
      // parsed again for every test: a test may change a field's value
      const api = helpers(code);
      const want: unknown = new Function(`return (${t.expect});`)();
      const got: unknown = new Function(...Object.keys(api), `return (${t.call});`)(...Object.values(api));
      r.got = JSON.stringify(got) ?? 'undefined';
      r.ok = r.got === JSON.stringify(want);
    } catch (err) {
      r.error = err instanceof Error ? err.message : String(err);
    }
    return r;
  });
  return Promise.resolve({ tests: results, logs: [] });
}
