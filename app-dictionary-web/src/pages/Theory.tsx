import { speakEnglish } from '../util';

export interface TheoryData {
  def: string;
  forms: [string, string, string][];
  rules: string[];
  ex: [string, string][];
  err?: [string, string, string][];
  /** When the structure is used: meaning and an English example. */
  uses?: [string, string][];
  /** Signal words that point to this structure. */
  signals?: string[];
  /** A short memory trick. */
  tip?: string;
}

/** Parses the lesson's explanation (JSON text from the server); null when absent or malformed. */
export function parseTheory(raw: string | null | undefined): TheoryData | null {
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as TheoryData;
    return t && typeof t.def === 'string' ? t : null;
  } catch {
    return null;
  }
}

interface FormRow {
  kind: string;
  formula: string;
  example: string;
}

/** Consecutive rows labelled "Name — kind" share one card named "Name". */
function groupForms(forms: TheoryData['forms']) {
  const groups: { title: string; rows: FormRow[] }[] = [];
  for (const [label, formula, example] of forms) {
    const cut = label.indexOf(' — ');
    const title = cut < 0 ? label : label.slice(0, cut);
    const kind = cut < 0 ? '' : label.slice(cut + 3);
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.rows.push({ kind, formula, example });
    else groups.push({ title, rows: [{ kind, formula, example }] });
  }
  return groups;
}

const SIGNS: [string, string, string][] = [
  ['(+)', '+', 'pos'],
  ['(−)', '−', 'neg'],
  ['(?)', '?', 'ask'],
];

function Kind({ kind }: { kind: string }) {
  if (!kind) return null;
  const sign = SIGNS.find(([mark]) => kind.includes(mark));
  const text = sign ? kind.replace(sign[0], '').trim() : kind;
  return (
    <span className={'th-kind' + (sign ? ' ' + sign[2] : '')}>
      {sign && <b>{sign[1]}</b>}
      {text}
    </span>
  );
}

const SEPARATORS = /(\s\+\s|,\s|\s;\s|\s≠\s|\s↔\s|\s+yoki\s+)/;
const chipTone = (part: string) =>
  /^(S|boshqa S|ega)$/.test(part) ? ' subj' : /\b(V1|V2|V3|V-s|V-ed|V-ing|Present|Past)\b/.test(part) ? ' verb' : '';

/** "S + have + V3" as coloured blocks; a trailing "(word list)" goes on its own line. */
function Formula({ text }: { text: string }) {
  const hinted = /^(.*?)\s{2,}\((.*)\)$/.exec(text);
  const body = hinted ? hinted[1] : text;
  return (
    <div className="th-formula">
      {body.includes(' + ') ? (
        body.split(SEPARATORS).map((part, i) =>
          i % 2 ? (
            <span key={i} className="th-op">
              {part.trim()}
            </span>
          ) : (
            <code key={i} className={'th-chip' + chipTone(part.trim())}>
              {part.trim()}
            </code>
          ),
        )
      ) : (
        <code className="th-chip">{body}</code>
      )}
      {hinted && <small className="th-hint">{hinted[2]}</small>}
    </div>
  );
}

/** What the symbols in the formulas mean; only the ones this topic actually uses. */
const SYMBOLS: [RegExp, string][] = [
  [/\bS\b/, 'S — ega (kim, nima)'],
  [/\bV1\b/, "V1 — fe'lning asosiy shakli (go)"],
  [/\bV-s\b/, "V-s — he, she, it uchun (goes)"],
  [/\bV2\b/, "V2 — o'tgan zamon (went)"],
  [/\bV3\b/, "V3 — uchinchi shakl (gone)"],
  [/\bV-ing\b/, '-ing shakli (going)'],
];
const legend = (forms: TheoryData['forms']) => {
  const all = forms.map((f) => f[1]).join(' | ');
  return SYMBOLS.filter(([re]) => re.test(all)).map(([, text]) => text);
};

/** Grammar explanation shown before the exercises: definition, uses, formulas, signal words, rules, examples, mistakes. */
export default function Theory({ data }: { data: TheoryData }) {
  return (
    <div className="th">
      <div className="th-def">
        <span className="th-eyebrow">Bu nima?</span>
        <p>{data.def}</p>
      </div>

      {data.uses && data.uses.length > 0 && (
        <>
          <h3 className="th-h">🎯 Qachon ishlatiladi</h3>
          <ol className="th-uses">
            {data.uses.map(([meaning, example]) => (
              <li key={meaning}>
                <strong>{meaning}</strong>
                <button type="button" className="th-say" onClick={() => speakEnglish(example)} title="Tinglash">
                  🔊 <span>{example}</span>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      <h3 className="th-h">📐 Formulalar</h3>
      <div className="th-forms">
        {groupForms(data.forms).map((group) => (
          <section key={group.title + group.rows[0].formula} className="th-form">
            <h4 className="th-label">{group.title}</h4>
            {group.rows.map((row) => (
              <div key={row.kind + row.formula} className="th-row">
                <Kind kind={row.kind} />
                <Formula text={row.formula} />
                <button type="button" className="th-say th-sample" onClick={() => speakEnglish(row.example)} title="Tinglash">
                  🔊 <span>{row.example}</span>
                </button>
              </div>
            ))}
          </section>
        ))}
      </div>

      {legend(data.forms).length > 0 && <p className="th-legend">{legend(data.forms).join(' · ')}</p>}

      {data.signals && data.signals.length > 0 && (
        <>
          <h3 className="th-h">🔎 Signal so'zlar</h3>
          <div className="th-signals">
            {data.signals.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </>
      )}

      {data.tip && (
        <div className="th-tip">
          <span aria-hidden="true">💡</span>
          <p>
            <strong>Eslab qoling. </strong>
            {data.tip}
          </p>
        </div>
      )}

      <h3 className="th-h">📌 Qoidalar</h3>
      <ul className="th-rules">
        {data.rules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h3 className="th-h">💬 Hayotiy misollar</h3>
      <div className="th-ex">
        {data.ex.map(([en, uz]) => (
          <button type="button" key={en} className="th-say th-sentence" onClick={() => speakEnglish(en)}>
            <span className="th-en">🔊 {en}</span>
            <span className="th-uz">{uz}</span>
          </button>
        ))}
      </div>

      {data.err && data.err.length > 0 && (
        <>
          <h3 className="th-h">⚠️ Ko'p uchraydigan xatolar</h3>
          <div className="th-errs">
            {data.err.map(([wrong, right, note]) => (
              <div key={wrong} className="th-err">
                <div className="th-wrong">✗ {wrong}</div>
                <div className="th-right">✓ {right}</div>
                <small>{note}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
