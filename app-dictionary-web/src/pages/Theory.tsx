import { speakEnglish } from '../util';

export interface TheoryData {
  def: string;
  forms: [string, string, string][];
  rules: string[];
  ex: [string, string][];
  err?: [string, string, string][];
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

/** Grammar explanation shown before the exercises: definition, formulas with examples, rules, real-life sentences, common mistakes. */
export default function Theory({ data }: { data: TheoryData }) {
  return (
    <div className="th">
      <p className="th-def">{data.def}</p>

      <h3 className="th-h">📐 Formulalar</h3>
      <div className="th-forms">
        {data.forms.map(([label, formula, example]) => (
          <div key={label + formula} className="th-form">
            <span className="th-label">{label}</span>
            <code className="th-formula">{formula}</code>
            <button type="button" className="th-say" onClick={() => speakEnglish(example)} title="Tinglash">
              🔊 <span>{example}</span>
            </button>
          </div>
        ))}
      </div>

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
