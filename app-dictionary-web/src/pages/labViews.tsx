/** Presentation pieces of the lab workbench: highlighted code, the editor, and the browser preview with its ruler. */
import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Completion, Suggestion } from './cssComplete';

export type Lang = 'css' | 'html' | 'plain';

const span = (kind: string, text: string, key: number) => <span key={key} className={`tk-${kind}`}>{text}</span>;

function highlightCss(code: string): ReactNode[] {
  const parts = code.split(/(\/\*[\s\S]*?(?:\*\/|$)|"[^"\n]*"?|'[^'\n]*'?|[{};])/);
  const out: ReactNode[] = [];
  let key = 0;
  let depth = 0;
  // what comes after a chunk decides what it is: "{" ends a selector, ";" or "}" ends a declaration
  const nextDelimiter = (from: number) => parts.slice(from).find((p) => p === '{' || p === '}' || p === ';');
  let afterColon = false;
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith('/*')) out.push(span('com', part, key++));
    else if (part.startsWith('"') || part.startsWith("'")) out.push(span('str', part, key++));
    else if (part === '{' || part === '}' || part === ';') {
      depth = Math.max(0, depth + (part === '{' ? 1 : part === '}' ? -1 : 0));
      afterColon = false;
      out.push(span('pun', part, key++));
    } else if (nextDelimiter(i + 1) === '{') out.push(span('sel', part, key++));
    else if (afterColon) out.push(span('val', part, key++));
    else {
      const colon = part.indexOf(':');
      if (depth > 0 && colon >= 0) {
        afterColon = true;
        out.push(span('prop', part.slice(0, colon), key++), span('pun', ':', key++), span('val', part.slice(colon + 1), key++));
      } else out.push(span(depth > 0 ? 'prop' : 'sel', part, key++));
    }
  });
  return out;
}

function highlightHtml(code: string): ReactNode[] {
  return code.split(/(<!--[\s\S]*?-->|<\/?[a-zA-Z][\w-]*|\/?>|"[^"\n]*"|\s[a-zA-Z_:][\w:-]*(?==))/).map((part, i) => {
    if (part.startsWith('<!--')) return span('com', part, i);
    if (part.startsWith('<') || part === '>' || part === '/>') return span('sel', part, i);
    if (part.startsWith('"')) return span('str', part, i);
    if (/^\s[a-zA-Z_:][\w:-]*$/.test(part)) return span('prop', part, i);
    return part;
  });
}

export function highlight(code: string, lang: Lang): ReactNode {
  return lang === 'css' ? highlightCss(code) : lang === 'html' ? highlightHtml(code) : code;
}

const LINE_HEIGHT = 22;
const MENU_WIDTH = 270;
const MENU_ROW = 28;
const KIND_MARK: Record<Suggestion['kind'], string> = { property: '◆', value: '●', selector: '▣', pseudo: ':', at: '@' };

type Menu = Completion & { active: number; x: number; y: number };

/** viewport position of the suggestion list: under the caret, or above it near the bottom of the window */
function menuPlace(el: HTMLTextAreaElement, from: number, rows: number) {
  const lines = el.value.slice(0, from).split('\n');
  const probe = document.createElement('canvas').getContext('2d')!;
  const style = getComputedStyle(el);
  probe.font = `${style.fontSize} ${style.fontFamily}`;
  const box = el.getBoundingClientRect();
  const x = box.left + parseFloat(style.paddingLeft) + probe.measureText(lines[lines.length - 1]).width;
  const top = box.top + (lines.length - 1) * LINE_HEIGHT;
  const height = Math.min(rows, 8) * MENU_ROW + 34;
  const below = top + LINE_HEIGHT + height < window.innerHeight;
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - MENU_WIDTH - 8)),
    y: below ? top + LINE_HEIGHT : Math.max(8, top - height),
  };
}

/**
 * A textarea laid over its highlighted copy; the copy gives both their size, so they never drift apart.
 * With `complete` it offers suggestions while typing: arrows choose, Enter or Tab accepts, Esc closes.
 */
export function CodeEditor({ value, lang, label, placeholder, complete, onChange, onKeyDown }: {
  value: string;
  lang: Lang;
  label: string;
  placeholder?: string;
  complete?: (code: string, caret: number, forced: boolean) => Completion | null;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const lines = Math.max(10, value.split('\n').length + 1);
  const area = useRef<HTMLTextAreaElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const accepting = useRef(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const listId = useId();

  const suggest = (forced: boolean) => {
    const el = area.current;
    if (!el || !complete || el.selectionStart !== el.selectionEnd) return setMenu(null);
    const found = complete(el.value, el.selectionStart, forced);
    setMenu(found && { ...found, active: 0, ...menuPlace(el, found.from, found.items.length) });
  };

  const accept = (item: Suggestion) => {
    const el = area.current;
    if (!el || !menu) return;
    // don't write a second ";" when one is already there
    const doubled = item.insert.endsWith(';') && el.value[el.selectionEnd] === ';';
    const text = doubled ? item.insert.slice(0, -1) : item.insert;
    accepting.current = true;
    el.focus();
    el.setSelectionRange(menu.from, el.selectionEnd);
    // insertText keeps Ctrl+Z working
    if (!document.execCommand('insertText', false, text)) {
      el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
      onChange(el.value);
    }
    el.setSelectionRange(menu.from + item.caret, menu.from + item.caret);
    accepting.current = false;
    setMenu(null);
    // after a property comes its value, so offer those straight away
    if (item.kind === 'property') requestAnimationFrame(() => suggest(true));
  };

  // the list is pinned to the window, so it closes when anything behind it moves
  const isOpen = !!menu;
  useEffect(() => {
    if (!isOpen) return;
    const close = (e: Event) => { if (!(e.target instanceof Node && list.current?.contains(e.target))) setMenu(null); };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  useEffect(() => {
    list.current?.children[menu?.active ?? 0]?.scrollIntoView({ block: 'nearest' });
  }, [menu?.active]);

  const keys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (complete && e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      return suggest(true);
    }
    if (menu && !e.ctrlKey && !e.metaKey) {
      const n = menu.items.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        return setMenu({ ...menu, active: (menu.active + (e.key === 'ArrowDown' ? 1 : n - 1)) % n });
      }
      if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        return accept(menu.items[menu.active]);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        return setMenu(null);
      }
    }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) || e.key === 'Enter') setMenu(null);
    onKeyDown(e);
  };

  return (
    <div className="dl-code">
      <div className="dl-gutter" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => <span key={i}>{i + 1}</span>)}
      </div>
      <div className="dl-scroll">
        <div className="dl-layer">
          <pre aria-hidden="true">{highlight(value, lang)}{'\n '}</pre>
          <textarea
            ref={area}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (accepting.current) return;
              const type = (e.nativeEvent as InputEvent).inputType ?? 'insertText';
              // open while writing words; deleting only narrows or widens a list that is already open
              if (type === 'insertText' || type === 'insertCompositionText' || (menu && type.startsWith('delete'))) suggest(false);
              else setMenu(null);
            }}
            onKeyDown={keys}
            onClick={() => setMenu(null)}
            onBlur={() => setMenu(null)}
            aria-autocomplete={complete ? 'list' : undefined}
            aria-controls={menu ? listId : undefined}
            aria-activedescendant={menu ? `${listId}-${menu.active}` : undefined}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            aria-label={label}
            placeholder={placeholder}
          />
        </div>
      </div>
      {menu && createPortal(
        // keeping the press from reaching the page leaves the caret in the editor
        <div className="dl-suggest" style={{ left: menu.x, top: menu.y, width: MENU_WIDTH }} onMouseDown={(e) => e.preventDefault()}>
          <ul ref={list} id={listId} role="listbox" aria-label="Maslahatlar">
            {menu.items.map((item, i) => (
              <li
                key={item.label}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === menu.active}
                className={i === menu.active ? 'on' : ''}
                onClick={() => accept(item)}
              >
                <i className={`k-${item.kind}`} aria-hidden="true">{KIND_MARK[item.kind]}</i>
                {item.label}
              </li>
            ))}
          </ul>
          <small>Enter yoki Tab: qo'yish · Esc: yopish</small>
        </div>,
        document.body,
      )}
    </div>
  );
}

const STAGE_HEIGHT = 400;

/**
 * The lab page in a browser window. The iframe is laid out at the checker's real width and scaled down to fit,
 * so what the learner sees is what the tests measure. The ruler marks pixels of that page.
 */
export function BrowserPreview({ doc, widths }: { doc: string; widths: number[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(600);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const watch = new ResizeObserver(([entry]) => setRoom(entry.contentRect.width));
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const scale = Math.min(1, room / width);
  const left = Math.max(0, (room - width * scale) / 2);
  const step = width > 600 ? 200 : 100;

  return (
    <section className="dl-win dl-browser">
      <header className="dl-winbar">
        <span className="dl-dots" aria-hidden="true"><i /><i /><i /></span>
        <b>Natija</b>
        {widths.length > 1 ? (
          <div className="dl-widths" role="group" aria-label="Oyna kengligi">
            {widths.map((w) => (
              <button key={w} className={w === width ? 'on' : ''} aria-pressed={w === width} onClick={() => setWidth(w)}>{w}px</button>
            ))}
          </div>
        ) : (
          <span className="dl-size">{width}px</span>
        )}
      </header>
      <div className="dl-view">
        <div ref={box}>
          <div className="dl-ruler" style={{ marginLeft: left, width: width * scale }} aria-hidden="true">
            {Array.from({ length: Math.floor(width / step) + 1 }, (_, i) => i * step).map((mark) => (
              <span key={mark} style={{ left: mark * scale }} className={mark === 0 ? 'first' : mark === width ? 'last' : ''}>{mark}</span>
            ))}
          </div>
          <div className="dl-stage" style={{ height: STAGE_HEIGHT * scale }}>
            <iframe title="Natija" sandbox="" srcDoc={doc} style={{ left, width, height: STAGE_HEIGHT, transform: `scale(${scale})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Selectors, properties and lengths inside a task sentence are shown as code. */
export function TaskText({ text }: { text: string }) {
  const code = /(@[a-z-]+|::?[a-z][a-z-]*(?:\([^()]*\))?|(?<![\w/])[.#][a-zA-Z][\w-]*|--[a-z][\w-]*|\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|fr|vw|vh|deg|ch|cqw|%)(?![\w]))/;
  return (
    <p>
      {text.split(code).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))}
    </p>
  );
}
