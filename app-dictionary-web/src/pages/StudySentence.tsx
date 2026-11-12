import { useRef, useState } from 'react';
import { errorStatus, sentencesApi, SentenceResult, Word } from '../api';
import { Button, Notice, SpeakButton } from '../ui';
import { requestProgressCheck } from '../util';

const MAX = 300;

function failure(e: unknown): string {
  switch (errorStatus(e)) {
    case 503:
      return "Sun'iy intellekt hozircha sozlanmagan.";
    case 429:
      return "Bugungi tekshiruvlar limiti tugadi. Ertaga davom eting.";
    case 502:
      return "Sun'iy intellekt javob bermadi. Qayta urinib ko'ring, bu urinish hisoblanmadi.";
    default:
      return "Tekshirib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.";
  }
}

function verdict(score: number): { label: string; tone: string; icon: string } {
  if (score >= 85) return { label: 'Ajoyib!', tone: '#10b981', icon: '🏆' };
  if (score >= 65) return { label: 'Yaxshi', tone: '#6366f1', icon: '👍' };
  if (score >= 40) return { label: "Yomon emas, tuzating", tone: '#f59e0b', icon: '✍️' };
  return { label: 'Qayta urinib ko‘ring', tone: '#ef4444', icon: '🔄' };
}

export function SentenceGame({
  words,
  remaining,
  onExit,
  title = 'Gap tuzish',
  goal,
  onChecked,
}: {
  words: Word[];
  remaining: number;
  onExit: () => void;
  title?: string;
  goal?: { done: number; target: number };
  onChecked?: (r: SentenceResult) => void;
}) {
  const last = useRef<number | null>(null);
  const pick = (): Word => {
    const pool = words.length > 1 ? words.filter((w) => w.id !== last.current) : words;
    const w = pool[Math.floor(Math.random() * pool.length)];
    last.current = w.id;
    return w;
  };

  const [word, setWord] = useState<Word>(pick);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SentenceResult | null>(null);
  const [left, setLeft] = useState(remaining);
  const [checked, setChecked] = useState(0);
  const [xp, setXp] = useState(0);

  const submit = async () => {
    const sentence = text.trim();
    if (!sentence || busy || result) return;
    setBusy(true);
    setError('');
    try {
      const r = await sentencesApi.check(word.id, sentence);
      setResult(r);
      setLeft(r.remainingToday);
      setChecked((n) => n + 1);
      setXp((n) => n + r.xpGained);
      onChecked?.(r);
      requestProgressCheck();
    } catch (e) {
      setError(failure(e));
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setWord(pick());
    setText('');
    setResult(null);
    setError('');
  };

  const retry = () => {
    setResult(null);
    setError('');
  };

  const v = result ? verdict(result.score) : null;
  const norm = (t: string) => t.trim().replace(/\s+/g, ' ').toLowerCase();
  const same = !!result && norm(result.corrected) === norm(text);
  const outOfChecks = left <= 0;

  return (
    <>
      <header className="qx-top rise">
        <button className="gp-back" onClick={onExit} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>Sun'iy intellekt bilan</small>
          <b>{title}</b>
        </div>
        <div className="qx-pills">
          {goal ? (
            <span className={`qx-pill ${goal.done + checked >= goal.target ? 'ok' : ''}`} title="Kunlik maqsad">
              🎯 {Math.min(goal.done + checked, goal.target)} / {goal.target}
            </span>
          ) : (
            <span className="qx-pill">{checked} ta gap</span>
          )}
          {xp > 0 && <span className="qx-pill ok">+{xp} XP</span>}
          <span className="qx-pill" title="Bugun qolgan tekshiruvlar">⚡ {left}</span>
        </div>
      </header>

      <section className="qx-card sn-card" key={word.id}>
        <span className="qx-badge" style={{ background: 'var(--indigo-bg)', color: 'var(--indigo-text)' }}>Shu so'z bilan gap tuzing</span>
        <div className="qx-word">{word.english}</div>
        <div className="sn-tr">
          {word.uzbek}
          <SpeakButton text={word.english} />
        </div>
        {word.definition && <p className="sn-def">{word.definition}</p>}

        {!result && (
        <div className="sn-box">
          <textarea
            className="sn-input"
            value={text}
            maxLength={MAX}
            disabled={busy || !!result}
            placeholder={`Masalan: ${word.english} so'zini ishlatib inglizcha gap yozing…`}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submit();
            }}
            rows={3}
            spellCheck={false}
          />
          <div className="sn-count">{text.length} / {MAX}</div>
        </div>
        )}

        {error && <Notice>{error}</Notice>}

        {!result && (
          <div className="sn-actions">
            <Button loading={busy} disabled={!text.trim() || outOfChecks} onClick={submit}>
              ✨ Tekshirish
            </Button>
            <Button variant="outline" disabled={busy} onClick={next}>
              Boshqa so'z
            </Button>
          </div>
        )}
        {!result && outOfChecks && <p className="sn-hint">Bugungi tekshiruvlar tugadi. Ertaga davom eting.</p>}
        {!result && !outOfChecks && <p className="sn-hint">Ctrl + Enter bosib ham tekshirishingiz mumkin.</p>}

        {result && v && (
          <div className="sn-result" style={{ ['--tone' as string]: v.tone }}>
            <div className="sn-score">
              <div className="sn-ring" style={{ ['--p' as string]: `${result.score * 3.6}deg` }}>
                <b>{result.score}</b>
              </div>
              <div>
                <div className="sn-verdict">{v.icon} {v.label}</div>
                <div className="sn-tags">
                  <span className={result.usesWord ? 'ok' : 'bad'}>{result.usesWord ? "✓ So'z ishlatilgan" : "✕ So'z ishlatilmagan"}</span>
                  {result.xpGained > 0 && <span className="xp">+{result.xpGained} XP</span>}
                </div>
              </div>
            </div>

            {same ? (
              <div className="sn-cmp one">
                <div className="fix">
                  <small>✓ Gapingiz to'g'ri</small>
                  <p>{text.trim()}</p>
                </div>
              </div>
            ) : (
              <div className="sn-cmp">
                <div>
                  <small>Sizning gapingiz</small>
                  <p>{text.trim()}</p>
                </div>
                <div className="fix">
                  <small>To'g'ri variant</small>
                  <p>{result.corrected}</p>
                </div>
              </div>
            )}

            {result.feedback && <p className="sn-feedback">💬 {result.feedback}</p>}

            <div className="sn-actions">
              <Button onClick={next}>Keyingi so'z →</Button>
              <Button variant="outline" onClick={retry}>Qayta yozish</Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
