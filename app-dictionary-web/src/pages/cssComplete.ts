/** Editor suggestions for CSS labs: property names, values of the property being written, and selectors of the lab's HTML. */

export type SuggestionKind = 'property' | 'value' | 'selector' | 'pseudo' | 'at';

export type Suggestion = { label: string; insert: string; caret: number; kind: SuggestionKind };

export type Completion = { from: number; items: Suggestion[] };

const words = (s: string) => s.split(' ');

const PROPERTIES = words(
  'align-content align-items align-self animation animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-timing-function aspect-ratio ' +
  'background background-attachment background-clip background-color background-image background-position background-repeat background-size border border-bottom border-bottom-color border-bottom-width border-collapse border-color border-left border-left-color border-left-width border-radius border-right border-style border-top border-top-color border-top-width border-width bottom box-shadow box-sizing ' +
  'caret-color clear color column-gap columns container container-name container-type content cursor direction display ' +
  'filter flex flex-basis flex-direction flex-flow flex-grow flex-shrink flex-wrap float font font-family font-size font-style font-variant font-weight ' +
  'gap grid grid-area grid-auto-columns grid-auto-flow grid-auto-rows grid-column grid-column-end grid-column-start grid-row grid-row-end grid-row-start grid-template grid-template-areas grid-template-columns grid-template-rows ' +
  'height inset isolation justify-content justify-items justify-self left letter-spacing line-height list-style list-style-type ' +
  'margin margin-bottom margin-left margin-right margin-top max-height max-width min-height min-width mix-blend-mode object-fit object-position opacity order outline outline-color outline-offset outline-width overflow overflow-wrap overflow-x overflow-y overscroll-behavior ' +
  'padding padding-bottom padding-left padding-right padding-top place-content place-items place-self pointer-events position resize right rotate row-gap ' +
  'scale scroll-behavior scroll-margin scroll-margin-top scroll-padding scroll-snap-align scroll-snap-type scrollbar-gutter ' +
  'text-align text-decoration text-indent text-overflow text-shadow text-transform top transform transform-origin transition transition-delay transition-duration transition-property transition-timing-function translate ' +
  'user-select vertical-align visibility white-space width will-change word-break word-spacing z-index -webkit-box-orient -webkit-line-clamp ' +
  // @property descriptors
  'syntax inherits initial-value',
);

const GLOBAL = words('inherit initial unset revert revert-layer');
const COLORS = words('red blue green black white gray yellow orange purple pink gold transparent currentColor rgb() hsl() color-mix()');
const LENGTHS = words('auto 0 100% 50% calc() min() max() clamp() var()');
const ALIGN = words('center flex-start flex-end start end stretch baseline');
const SPREAD = words('center flex-start flex-end start end space-between space-around space-evenly stretch');
const LINE = words('solid dashed dotted double none');
const EASING = words('ease ease-in ease-out ease-in-out linear steps() cubic-bezier()');
const TRACKS = words('1fr repeat() minmax() auto min-content max-content subgrid fit-content()');

const VALUES: Record<string, string[]> = {
  display: words('block inline inline-block flex inline-flex grid inline-grid none contents flow-root table -webkit-box'),
  position: words('static relative absolute fixed sticky'),
  'box-sizing': words('border-box content-box'),
  'font-weight': words('normal bold bolder lighter 100 200 300 400 500 600 700 800 900'),
  'font-style': words('normal italic oblique'),
  'font-size': words('1rem 1.5em 16px small medium large clamp() calc()'),
  'font-family': words('Arial Georgia Verdana serif sans-serif monospace system-ui'),
  font: words('italic bold sans-serif serif'),
  'text-align': words('left center right justify start end'),
  'text-transform': words('none uppercase lowercase capitalize'),
  'text-decoration': words('none underline line-through overline'),
  'text-overflow': words('ellipsis clip'),
  'white-space': words('normal nowrap pre pre-wrap pre-line'),
  'word-break': words('normal break-all keep-all break-word'),
  'overflow-wrap': words('normal anywhere break-word'),
  'line-height': words('normal 1 1.5 2'),
  'flex-direction': words('row row-reverse column column-reverse'),
  'flex-wrap': words('nowrap wrap wrap-reverse'),
  flex: words('1 auto none'),
  'justify-content': SPREAD,
  'align-content': SPREAD,
  'place-content': SPREAD,
  'align-items': ALIGN,
  'justify-items': ALIGN,
  'place-items': ALIGN,
  'align-self': ['auto', ...ALIGN],
  'justify-self': ['auto', ...ALIGN],
  'place-self': ['auto', ...ALIGN],
  'grid-template-columns': TRACKS,
  'grid-template-rows': TRACKS,
  'grid-auto-columns': TRACKS,
  'grid-auto-rows': TRACKS,
  'grid-auto-flow': words('row column dense'),
  'grid-column': words('span auto'),
  'grid-row': words('span auto'),
  overflow: words('visible hidden clip scroll auto'),
  'overflow-x': words('visible hidden clip scroll auto'),
  'overflow-y': words('visible hidden clip scroll auto'),
  'overscroll-behavior': words('auto contain none'),
  'scroll-behavior': words('auto smooth'),
  'scroll-snap-type': ['x mandatory', 'y mandatory', 'x proximity', 'none'],
  'scroll-snap-align': words('start center end none'),
  'scrollbar-gutter': ['stable', 'auto', 'stable both-edges'],
  visibility: words('visible hidden collapse'),
  float: words('left right none'),
  clear: words('left right both none'),
  cursor: words('pointer default text move not-allowed grab wait'),
  'object-fit': words('fill contain cover none scale-down'),
  'background-repeat': words('repeat no-repeat repeat-x repeat-y'),
  'background-size': words('cover contain auto'),
  'background-position': words('center top bottom left right'),
  background: ['linear-gradient()', 'radial-gradient()', 'url()', 'none', ...COLORS],
  'background-image': words('linear-gradient() radial-gradient() url() none'),
  border: LINE,
  'border-style': LINE,
  outline: LINE,
  'container-type': words('inline-size size normal'),
  isolation: words('isolate auto'),
  'transform-origin': ['center', 'top left', 'top right', 'bottom left', 'bottom right'],
  transform: words('translate() translateX() translateY() translateZ() scale() rotate() skew() none'),
  transition: ['transform', 'opacity', 'background-color', 'color', 'all', ...EASING],
  'transition-timing-function': EASING,
  'animation-timing-function': EASING,
  animation: words('infinite alternate forwards backwards both paused linear ease-in-out'),
  'animation-fill-mode': words('none forwards backwards both'),
  'animation-direction': words('normal reverse alternate alternate-reverse'),
  'animation-play-state': words('running paused'),
  'animation-iteration-count': words('infinite 1 2 3'),
  content: ['""', '"*"', 'none'],
  '-webkit-box-orient': words('vertical horizontal'),
  'list-style': words('none disc circle square decimal'),
};

const PSEUDO = words(
  ':hover :focus :focus-visible :focus-within :active :checked :disabled :first-child :last-child :nth-child() :first-of-type :last-of-type :not() :is() :where() :has() :empty ::before ::after ::first-line ::first-letter ::placeholder ::selection',
);

const AT_RULES: [string, string][] = [
  ['@media', '@media (min-width: |) {\n  \n}'],
  ['@container', '@container (min-width: |) {\n  \n}'],
  ['@keyframes', '@keyframes | {\n  \n}'],
  ['@layer', '@layer |;'],
  ['@property', '@property --| {\n  syntax: "<length>";\n  inherits: false;\n  initial-value: 0px;\n}'],
  ['@supports', '@supports (|) {\n  \n}'],
];

/** Classes, ids and tags written in the lab's HTML. */
export function htmlSelectors(html: string): string[] {
  const classes = [...html.matchAll(/\bclass="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/).filter(Boolean).map((c) => `.${c}`));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => `#${m[1]}`);
  const tags = [...html.matchAll(/<([a-z][a-z0-9]*)/g)].map((m) => m[1]);
  return [...new Set([...classes, ...ids, ...tags])];
}

/** how well a label answers what was typed: lower is better, -1 means not at all ("fw" finds font-weight) */
function score(label: string, typed: string): number {
  const l = label.toLowerCase();
  const t = typed.toLowerCase();
  if (l.startsWith(t)) return 0;
  const initials = l.split('-').map((p) => p[0] ?? '').join('');
  if (t.length > 1 && initials.startsWith(t)) return 1;
  if (t.length > 1 && l.includes(t)) return 2;
  return -1;
}

const rank = (items: Suggestion[], typed: string) =>
  items
    .map((item, order) => ({ item, order, s: score(item.label, typed) }))
    .filter((r) => r.s >= 0)
    .sort((a, b) => a.s - b.s || a.order - b.order)
    .map((r) => r.item);

const plain = (label: string, kind: SuggestionKind): Suggestion => ({
  label,
  insert: label,
  // functions leave the caret between the brackets
  caret: label.endsWith('()') ? label.length - 1 : label.length,
  kind,
});

/**
 * What to offer with the caret at `caret`. `forced` (Ctrl+Space) lists everything even before a letter is typed.
 * Returns null when there is nothing worth showing.
 */
export function completeCss(code: string, caret: number, selectors: string[], forced = false): Completion | null {
  const before = code.slice(0, caret);
  // inside a comment or a string nothing is suggested
  const bare = before.replace(/\/\*[\s\S]*?\*\/|"[^"\n]*"|'[^'\n]*'/g, ' ');
  if (/\/\*|["']/.test(bare)) return null;

  const open: string[] = [];
  let statement = '';
  for (const ch of bare) {
    if (ch === '{') { open.push(statement.trim()); statement = ''; }
    else if (ch === '}') { open.pop(); statement = ''; }
    else if (ch === ';') statement = '';
    else statement += ch;
  }
  const block = open[open.length - 1];
  const inDeclarations = block !== undefined && !/^@(media|container|supports|layer|keyframes)\b/.test(block);
  const text = statement.replace(/^\s+/, '');
  const nestedSelector = /^[.#&:>+~[*]/.test(text);

  let typed: string;
  let items: Suggestion[];

  if (inDeclarations && !nestedSelector && text.includes(':')) {
    const property = text.slice(0, text.indexOf(':')).trim().toLowerCase();
    const value = text.slice(text.indexOf(':') + 1);
    typed = /[\w#!%-]*$/.exec(value)![0];
    // numbers are the learner's own, except where the property's values are numbers
    const own = VALUES[property] ?? [];
    if (/^\d/.test(typed) && !own.some((v) => v.startsWith(typed))) return null;
    if (!typed && !forced && value.trim()) return null;
    const colored = /color|^background$|^border|shadow$|^outline$/.test(property);
    const sized = /width|height|margin|padding|gap|top|left|right|bottom|inset|basis|size|radius/.test(property);
    const all = [...new Set([...own, ...(colored ? COLORS : []), ...(sized ? LENGTHS : []), 'var()', ...GLOBAL])];
    items = all.map((v) => plain(v, 'value'));
  } else if (inDeclarations && !nestedSelector) {
    typed = /[a-z-]*$/i.exec(text)![0];
    if (!typed && !forced) return null;
    if (text !== typed) return null;
    const hasColon = /^\s*:/.test(code.slice(caret));
    items = PROPERTIES.map((p) => ({
      label: p,
      insert: hasColon ? p : `${p}: ;`,
      caret: hasColon ? p.length : p.length + 2,
      kind: 'property' as const,
    }));
  } else {
    typed = /(::?[\w-]*|[.#@]?[\w-]*)$/.exec(text)![0];
    if (!typed && !forced) return null;
    if (typed.startsWith(':')) items = PSEUDO.map((p) => plain(p, 'pseudo'));
    else if (typed.startsWith('@')) {
      items = AT_RULES.map(([label, snippet]) => ({ label, insert: snippet.replace('|', ''), caret: snippet.indexOf('|'), kind: 'at' as const }));
    } else items = selectors.map((s) => plain(s, 'selector'));
  }

  const found = rank(items, typed).slice(0, 40);
  if (!found.length || (found.length === 1 && found[0].label === typed)) return null;
  return { from: caret - typed.length, items: found };
}
