import { useEffect, useRef, useState } from 'react';
import { errorMessage, flashcardApi, QuizMode, QuizPromptType, quizApi, ReviewSummary, Word } from '../api';
import { Button, Card, Notice, PageHeader, ProgressBar, SpeakButton, Spinner, WordImage } from '../ui';
import { requestProgressCheck, shuffle } from '../util';
import { buildDeckOptions, ModeCards } from './Study';

interface BaseProps {
  review: ReviewSummary | null;
  totalWords: number;
  favoriteCount?: number;
  onExit: () => void;
}

/* ---------------------------------------------------------- flashcards */

function GameResult({ icon, title, value, unit, tone, celebrate, stats, onAgain, onExit }: {
  icon: string;
  title: string;
  value: number;
  unit: string;
  tone: string;
  celebrate?: boolean;
  stats: { label: string; value: string }[];
  onAgain: () => void;
  onExit: () => void;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <section className="gr rise" style={{ ['--tone' as string]: tone }}>
      {celebrate && (
        <div className="gr-confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <i key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      )}
      <div className="gr-ico">{icon}</div>
      <h2>{title}</h2>
      <div className="gr-score">{shown}</div>
      <p className="gr-unit">{unit}</p>
      <div className="gr-stats">
        {stats.map((st) => (
          <div key={st.label}>
            <b>{st.value}</b>
            <small>{st.label}</small>
          </div>
        ))}
      </div>
      <div className="gr-actions">
        <Button onClick={onAgain}>↻ Yana o'ynash</Button>
        <Button variant="outline" onClick={onExit}>Tugatish</Button>
      </div>
    </section>
  );
}

export function FlashcardGame({ review, totalWords, favoriteCount = 0, onExit }: BaseProps) {
  const [stage, setStage] = useState<'choose' | 'play' | 'done'>('choose');
  const [mode, setMode] = useState<QuizMode>('DUE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deck, setDeck] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [englishFirst, setEnglishFirst] = useState(true);
  const [known, setKnown] = useState(0);
  const [missed, setMissed] = useState<Word[]>([]);
  // The retry round re-shows missed cards without writing to the schedule a second time.
  const [recording, setRecording] = useState(true);
  const [saving, setSaving] = useState(false);

  const startRound = (cards: Word[], record: boolean) => {
    setDeck(cards);
    setIndex(0);
    setFlipped(false);
    setEnglishFirst(Math.random() < 0.5);
    setKnown(0);
    setMissed([]);
    setRecording(record);
    setStage('play');
  };

  const begin = async (selected: QuizMode) => {
    setLoading(true);
    setError('');
    try {
      const cards = await flashcardApi.deck(selected);
      if (cards.length === 0) {
        setError("Bu to'plamda so'z yo'q");
        return;
      }
      setMode(selected);
      startRound(cards, true);
    } catch (e) {
      setError(errorMessage(e, "Kartalarni yuklab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  const answer = async (knew: boolean) => {
    const card = deck[index];
    if (!card || saving) return;
    setSaving(true);
    if (recording) {
      try {
        await flashcardApi.answer(card.id, knew);
      } catch (e) {
        setSaving(false);
        setError(errorMessage(e, "Javobni saqlab bo'lmadi"));
        return;
      }
    }
    setSaving(false);
    if (knew) setKnown((k) => k + 1);
    else setMissed((m) => [...m, card]);
    if (index + 1 >= deck.length) {
      setStage('done');
      if (recording) requestProgressCheck();
    } else {
      setFlipped(false);
      setEnglishFirst(Math.random() < 0.5);
      setIndex(index + 1);
    }
  };

  // Keyboard: space flips, arrows answer once flipped.
  useEffect(() => {
    if (stage !== 'play') return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && e.key === 'ArrowRight') answer(true);
      else if (flipped && e.key === 'ArrowLeft') answer(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (stage === 'choose') {
    return (
      <>
        <PageHeader title="Fleshkart" back={onExit} />
        <p className="muted">
          Kartani bosib aylantiring, javobni ko'ring va bilganingizni belgilang. Javobingiz takrorlash jadvaliga ta'sir qiladi.
        </p>
        {error && <Notice>{error}</Notice>}
        <ModeCards options={buildDeckOptions(review, totalWords, favoriteCount)} disabled={loading} onPick={begin} />
        {loading && <Spinner />}
      </>
    );
  }

  if (stage === 'done') {
    const total = deck.length;
    const pct = total > 0 ? Math.round((known / total) * 100) : 0;
    return (
      <>
        <Card className="result-card">
          <div style={{ fontSize: 48 }}>{pct >= 50 ? '🏆' : '🔄'}</div>
          <div className="big-pct">{pct}%</div>
          <p className="muted">
            {total} ta kartadan {known} tasini bildingiz
          </p>
          <div className="stat-pair">
            <div>
              <div className="stat-num" style={{ color: 'var(--secondary)' }}>{known}</div>
              <div className="muted">Bildim</div>
            </div>
            <div>
              <div className="stat-num" style={{ color: 'var(--danger)' }}>{missed.length}</div>
              <div className="muted">Bilmadim</div>
            </div>
          </div>
        </Card>
        <div className="col gap">
          {missed.length > 0 && <Button onClick={() => startRound(missed, false)}>Bilmaganlarni takrorlash ({missed.length})</Button>}
          <Button variant="outline" loading={loading} onClick={() => begin(mode)}>Yangi to'plam</Button>
          <Button variant="outline" onClick={onExit}>Tugatish</Button>
        </div>
      </>
    );
  }

  const card = deck[index];
  const front = englishFirst ? card.english : card.uzbek;
  const back = englishFirst ? card.uzbek : card.english;
  const frontBadge = englishFirst ? "Inglizcha so'z" : "O'zbekcha tarjima";
  const backBadge = englishFirst ? "O'zbekcha tarjima" : "Inglizcha so'z";
  const enStyle = { background: 'var(--indigo-bg)', color: 'var(--indigo-text)' };
  const uzStyle = { background: 'var(--green-bg)', color: 'var(--green-text)' };

  return (
    <>
      <PageHeader title={recording ? 'Fleshkart' : 'Qayta urinish'} back={onExit} right={<span className="muted">{index + 1} / {deck.length}</span>} />
      <ProgressBar pct={(index / deck.length) * 100} />
      {error && <Notice>{error}</Notice>}
      <div className="flip-area mt" onClick={() => setFlipped((f) => !f)} role="button" aria-label="Kartani aylantirish">
        <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
          <div className="face">
            <div className="q-badge" style={englishFirst ? enStyle : uzStyle}>{frontBadge}</div>
            <div className="q-text">{front}</div>
            <WordImage wordId={card.id} version={card.imageVersion} />
            <div className="tap-hint">Aylantirish uchun bosing (Space)</div>
          </div>
          <div className="face back">
            <div className="q-badge" style={englishFirst ? uzStyle : enStyle}>{backBadge}</div>
            <div className="q-text">{back}</div>
            {card.definition && <div className="def-box"><b>Definition</b><div>{card.definition}</div></div>}
          </div>
        </div>
      </div>
      {(englishFirst || flipped) && (
        <div className="row gap" style={{ justifyContent: 'center', marginBottom: 14 }}>
          <SpeakButton text={card.english} />
          <SpeakButton text={card.english} slow />
        </div>
      )}
      {flipped ? (
        <div className="answer-row">
          <Button variant="danger" disabled={saving} onClick={() => answer(false)}>✗ Bilmadim</Button>
          <Button disabled={saving} onClick={() => answer(true)} style={{ background: 'var(--secondary)' }}>✓ Bildim</Button>
        </div>
      ) : (
        <Button variant="outline" block onClick={() => setFlipped(true)}>Javobni ko'rsatish</Button>
      )}
    </>
  );
}

/* ------------------------------------------------------------ matching */

const PAIRS_PER_ROUND = 5;
const MATCH_MIN = 3;
const WRONG_FLASH_MS = 650;
const ROUND_PAUSE_MS = 700;

/** Splits the deck into rounds of five pairs; a short tail is folded into the previous round. */
function toRounds(words: Word[]): Word[][] {
  const rounds: Word[][] = [];
  for (let i = 0; i < words.length; i += PAIRS_PER_ROUND) rounds.push(words.slice(i, i + PAIRS_PER_ROUND));
  if (rounds.length > 1 && rounds[rounds.length - 1].length < MATCH_MIN) {
    const tail = rounds.pop() as Word[];
    rounds[rounds.length - 1].push(...tail);
  }
  return rounds;
}

export function MatchingGame({ review, totalWords, favoriteCount = 0, onExit }: BaseProps) {
  const [stage, setStage] = useState<'choose' | 'play' | 'done'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rounds, setRounds] = useState<Word[][]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [left, setLeft] = useState<Word[]>([]);
  const [right, setRight] = useState<Word[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [selRight, setSelRight] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ l: number; r: number } | null>(null);
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const locked = useRef(false);

  const setupRound = (words: Word[]) => {
    setLeft(shuffle(words));
    setRight(shuffle(words));
    setMatched([]);
    setSelLeft(null);
    setSelRight(null);
    setWrong(null);
    locked.current = false;
  };

  const begin = async (mode: QuizMode) => {
    setLoading(true);
    setError('');
    try {
      const deck = await flashcardApi.deck(mode);
      if (deck.length < MATCH_MIN) {
        setError(`Bu o'yin uchun kamida ${MATCH_MIN} ta so'z kerak.`);
        return;
      }
      const built = toRounds(shuffle(deck));
      setRounds(built);
      setTotal(deck.length);
      setMistakes([]);
      setRoundIdx(0);
      setupRound(built[0]);
      setStage('play');
    } catch (e) {
      setError(errorMessage(e, "So'zlarni yuklab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  const finishRound = async (words: Word[], failed: number[]) => {
    locked.current = true;
    await Promise.all(words.map((w) => flashcardApi.answer(w.id, !failed.includes(w.id), 'MATCHING').catch(() => undefined)));
    setTimeout(() => {
      if (roundIdx + 1 >= rounds.length) {
        setStage('done');
        requestProgressCheck();
      } else {
        setRoundIdx(roundIdx + 1);
        setupRound(rounds[roundIdx + 1]);
      }
    }, ROUND_PAUSE_MS);
  };

  const resolve = (l: number, r: number) => {
    if (l === r) {
      const nextMatched = [...matched, l];
      setMatched(nextMatched);
      setSelLeft(null);
      setSelRight(null);
      if (nextMatched.length === rounds[roundIdx].length) {
        const ids = rounds[roundIdx].map((w) => w.id);
        finishRound(rounds[roundIdx], mistakes.filter((id) => ids.includes(id)));
      }
      return;
    }
    setMistakes(Array.from(new Set([...mistakes, l, r])));
    setWrong({ l, r });
    locked.current = true;
    setTimeout(() => {
      setWrong(null);
      setSelLeft(null);
      setSelRight(null);
      locked.current = false;
    }, WRONG_FLASH_MS);
  };

  const tapLeft = (id: number) => {
    if (locked.current || matched.includes(id)) return;
    setSelLeft(id);
    if (selRight !== null) resolve(id, selRight);
  };
  const tapRight = (id: number) => {
    if (locked.current || matched.includes(id)) return;
    setSelRight(id);
    if (selLeft !== null) resolve(selLeft, id);
  };

  if (stage === 'choose') {
    return (
      <>
        <PageHeader title="Juftlarni moslash" back={onExit} />
        <p className="muted">Inglizcha so'zlarni o'zbekcha tarjimasi bilan juftlang. Har raundda 5 ta juft bor.</p>
        {error && <Notice>{error}</Notice>}
        <ModeCards options={buildDeckOptions(review, totalWords, favoriteCount)} disabled={loading} onPick={begin} />
        {loading && <Spinner />}
      </>
    );
  }

  if (stage === 'done') {
    const wrongCount = mistakes.length;
    return (
      <>
        <GameResult
          icon="🧩"
          title="Tugadi!"
          value={Math.max(0, total - wrongCount)}
          unit={`/ ${total} so'z xatosiz juftlandi`}
          tone="#a855f7"
          stats={[
            { label: 'Xatolar', value: String(wrongCount) },
            { label: 'Aniqlik', value: `${total > 0 ? Math.round((Math.max(0, total - wrongCount) / total) * 100) : 0}%` },
          ]}
          onAgain={() => setStage('choose')}
          onExit={onExit}
        />
      </>
    );
  }

  const cls = (id: number, side: 'l' | 'r') => {
    if (matched.includes(id)) return 'done';
    if (wrong && (side === 'l' ? wrong.l === id : wrong.r === id)) return 'wrong';
    if ((side === 'l' ? selLeft : selRight) === id) return 'sel';
    return '';
  };

  return (
    <>
      <PageHeader title="Juftlarni moslash" back={onExit} right={<span className="muted">Raund {roundIdx + 1} / {rounds.length}</span>} />
      <ProgressBar pct={(roundIdx / rounds.length) * 100} />
      <div className="match-grid mt">
        <div className="match-col">
          {left.map((w) => (
            <button key={w.id} className={`match-item ${cls(w.id, 'l')}`} onClick={() => tapLeft(w.id)}>
              {w.english}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((w) => (
            <button key={w.id} className={`match-item ${cls(w.id, 'r')}`} onClick={() => tapRight(w.id)}>
              {w.uzbek}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------------------- speed */

const ROUND_SECONDS = 60;
const FEEDBACK_MS = 500;
const SPEED_MIN = 4;
const BEST_KEY = 'speed_round_best';

const QUESTION_LABEL: Record<QuizPromptType, string> = {
  english: "O'zbekcha tarjimasi qaysi?",
  uzbek: "Inglizcha so'zi qaysi?",
  definition: "Bu ta'rif qaysi so'zga tegishli?",
};

interface Tally {
  correct: number;
  answered: number;
  combo: number;
  bestCombo: number;
}
const EMPTY: Tally = { correct: 0, answered: 0, combo: 0, bestCombo: 0 };

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function SpeedGame({ review, totalWords, onExit }: Omit<BaseProps, 'favoriteCount'>) {
  const [stage, setStage] = useState<'choose' | 'play' | 'done'>('choose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [best, setBest] = useState(readBest);
  const [newRecord, setNewRecord] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState<{ promptType: QuizPromptType; promptText: string; options: string[] } | null>(null);
  const [msLeft, setMsLeft] = useState(ROUND_SECONDS * 1000);
  const [tally, setTally] = useState<Tally>(EMPTY);
  const [feedback, setFeedback] = useState<{ chosen: string; correctAnswer: string; correct: boolean } | null>(null);

  // Refs hold what timers and async callbacks need to read without going stale.
  const endAt = useRef(0);
  const busy = useRef(false);
  const over = useRef(false);
  const tallyRef = useRef<Tally>(EMPTY);
  const sessionRef = useRef<number | null>(null);

  const finish = () => {
    if (over.current) return;
    over.current = true;
    const result = tallyRef.current;
    if (sessionRef.current !== null) quizApi.finish(sessionRef.current).catch(() => undefined);
    const previous = readBest();
    if (result.correct > previous) {
      try {
        localStorage.setItem(BEST_KEY, String(result.correct));
      } catch {
        // the record is a nicety
      }
    }
    setNewRecord(result.correct > previous && result.correct > 0);
    setBest(Math.max(previous, result.correct));
    setTally(result);
    setStage('done');
    requestProgressCheck();
  };

  useEffect(() => {
    if (stage !== 'play') return undefined;
    const timer = setInterval(() => {
      const left = endAt.current - Date.now();
      if (left <= 0) {
        clearInterval(timer);
        setMsLeft(0);
        if (!busy.current) finish();
      } else {
        setMsLeft(left);
      }
    }, 100);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(
    () => () => {
      over.current = true;
    },
    []
  );

  const begin = async (mode: QuizMode) => {
    setLoading(true);
    setError('');
    try {
      const q = await quizApi.start(mode, 'SPEED');
      sessionRef.current = q.sessionId;
      setSessionId(q.sessionId);
      setQuestion({ promptType: q.promptType, promptText: q.promptText, options: q.options ?? [] });
      tallyRef.current = EMPTY;
      setTally(EMPTY);
      setFeedback(null);
      busy.current = false;
      over.current = false;
      setNewRecord(false);
      setMsLeft(ROUND_SECONDS * 1000);
      endAt.current = Date.now() + ROUND_SECONDS * 1000;
      setStage('play');
    } catch (e) {
      setError(errorMessage(e, "Raundni boshlab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  };

  const pick = async (option: string) => {
    if (busy.current || over.current || sessionId === null || !question) return;
    busy.current = true;
    try {
      const res = await quizApi.answer(sessionId, option);
      const t = tallyRef.current;
      const combo = res.correct ? t.combo + 1 : 0;
      tallyRef.current = {
        correct: t.correct + (res.correct ? 1 : 0),
        answered: t.answered + 1,
        combo,
        bestCombo: Math.max(t.bestCombo, combo),
      };
      setTally(tallyRef.current);
      setFeedback({ chosen: option, correctAnswer: res.correctAnswer, correct: res.correct });
      setTimeout(() => {
        busy.current = false;
        if (over.current) return;
        if (Date.now() >= endAt.current || !res.nextPromptText || !res.nextPromptType) {
          finish();
          return;
        }
        setQuestion({ promptType: res.nextPromptType, promptText: res.nextPromptText, options: res.nextOptions ?? [] });
        setFeedback(null);
      }, FEEDBACK_MS);
    } catch (e) {
      busy.current = false;
      setError(errorMessage(e, "Javobni yuborib bo'lmadi"));
    }
  };

  if (stage === 'choose') {
    const canPlay = totalWords >= SPEED_MIN;
    const pools = [
      { mode: 'ALL' as QuizMode, title: "Tasodifiy so'zlar", subtitle: `Butun lug'atingizdan (${totalWords} ta so'z)`, icon: '🔀', color: '#10b981', enabled: canPlay },
      {
        mode: 'WEAK' as QuizMode,
        title: "Zaif so'zlar",
        subtitle: (review?.weakCount ?? 0) > 0 ? `${review?.weakCount} ta so'z ko'p xato qilingan` : "Hozircha zaif so'z yo'q",
        icon: '⚡',
        color: '#ef4444',
        enabled: canPlay && (review?.weakCount ?? 0) > 0,
      },
    ];
    return (
      <>
        <PageHeader title="Tez raund" back={onExit} right={best > 0 ? <span className="chip chip-learning">🏆 Rekord: {best}</span> : undefined} />
        <p className="muted">
          {ROUND_SECONDS} soniyada iloji boricha ko'p savolga javob bering. Har savolda 4 ta variant bor, xato qilsangiz ketma-ket
          to'g'ri javoblar (combo) uziladi. Javoblar takrorlash jadvaliga ta'sir qiladi (faqat 3-qutigacha).
          {canPlay ? '' : ` Buning uchun kamida ${SPEED_MIN} ta so'z kerak.`}
        </p>
        {error && <Notice>{error}</Notice>}
        <ModeCards options={pools} disabled={loading} onPick={begin} />
        {loading && <Spinner />}
      </>
    );
  }

  if (stage === 'done') {
    const acc = tally.answered > 0 ? Math.round((tally.correct / tally.answered) * 100) : 0;
    return (
      <>
        <GameResult
          icon={newRecord ? '🏆' : '⏱️'}
          title={newRecord ? 'Yangi rekord!' : 'Vaqt tugadi!'}
          value={tally.correct}
          unit="to'g'ri javob"
          tone={newRecord ? '#f59e0b' : '#6366f1'}
          celebrate={newRecord}
          stats={[
            { label: 'Aniqlik', value: `${acc}%` },
            { label: 'Eng uzun combo', value: String(tally.bestCombo) },
            { label: 'Rekord', value: String(best) },
          ]}
          onAgain={() => setStage('choose')}
          onExit={onExit}
        />
      </>
    );
  }

  const secs = Math.ceil(msLeft / 1000);
  return (
    <>
      <PageHeader
        title="Tez raund"
        back={() => {
          over.current = true;
          if (sessionRef.current !== null) quizApi.finish(sessionRef.current).catch(() => undefined);
          onExit();
        }}
        right={<span className={`timer ${secs <= 10 ? 'low' : ''}`}>⏱ {secs}s</span>}
      />
      <ProgressBar pct={(msLeft / (ROUND_SECONDS * 1000)) * 100} color={secs <= 10 ? 'var(--danger)' : undefined} />
      <div className="row gap mt" style={{ justifyContent: 'center' }}>
        <span className="chip chip-mastered">✅ {tally.correct}</span>
        {tally.combo >= 2 && <span className="chip chip-learning">🔥 combo ×{tally.combo}</span>}
      </div>
      {error && <Notice>{error}</Notice>}
      {question && (
        <Card className="q-card mt">
          <p className="muted">{QUESTION_LABEL[question.promptType]}</p>
          <div className={question.promptType === 'definition' ? 'q-def' : 'q-text'}>{question.promptText}</div>
          <div className="options">
            {question.options.map((o) => {
              const cls = feedback ? (o === feedback.correctAnswer ? 'right' : o === feedback.chosen ? 'wrong' : '') : '';
              return (
                <button key={o} className={`option ${cls}`} disabled={!!feedback} onClick={() => pick(o)}>
                  {o}
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}
