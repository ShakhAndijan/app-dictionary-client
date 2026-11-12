import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  errorMessage,
  QuizMode,
  QuizProgress,
  QuizPromptType,
  quizApi,
  QuizSummary,
  ReviewSummary,
  reviewApi,
  SentenceStatus,
  sentencesApi,
  Word,
  wordsApi,
} from '../api';
import { Button, Card, Notice, PageHeader, ProgressBar, SpeakButton, Spinner } from '../ui';
import { dayKey, DECK_TITLES, requestProgressCheck, speakEnglish, stopSpeaking } from '../util';
import { FlashcardGame, GameResult, MatchingGame, SpeedGame } from './StudyGames';
import SentencesPage from './Sentences';

type View = 'hub' | 'quiz' | 'flash' | 'match' | 'speed' | 'sentence';
type QuizFormat = 'TYPED' | 'CHOICE' | 'LISTENING';

export interface DeckOption {
  mode: QuizMode;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  enabled: boolean;
}

/** The word pools offered by the games. */
export function buildDeckOptions(review: ReviewSummary | null, totalWords: number, favoriteCount: number, todayCount?: number): DeckOption[] {
  const waiting = (review?.dueCount ?? 0) + (review?.newCount ?? 0);
  const opts: DeckOption[] = [
    {
      mode: 'DUE',
      title: 'Takrorlash',
      subtitle:
        waiting > 0
          ? `${review?.dueCount ?? 0} ta takrorlash · ${review?.newCount ?? 0} ta yangi so'z`
          : "Bugun takrorlash uchun so'z yo'q",
      icon: '🔁',
      color: '#4f46e5',
      enabled: waiting > 0,
    },
  ];
  if (todayCount !== undefined) {
    opts.push({
      mode: 'TODAY',
      title: "Bugungi so'zlar",
      subtitle: todayCount > 0 ? `Bugun qo'shilgan ${todayCount} ta so'z` : "Bugun so'z qo'shilmagan",
      icon: '📅',
      color: '#0ea5e9',
      enabled: todayCount > 0,
    });
  }
  opts.push(
    {
      mode: 'WEAK',
      title: "Zaif so'zlar",
      subtitle: (review?.weakCount ?? 0) > 0 ? `${review?.weakCount} ta so'z ko'p xato qilingan` : "Hozircha zaif so'z yo'q",
      icon: '⚡',
      color: '#ef4444',
      enabled: (review?.weakCount ?? 0) > 0,
    },
    {
      mode: 'FAVORITES',
      title: "Sevimli so'zlar",
      subtitle: favoriteCount > 0 ? `Yulduzcha qo'yilgan ${favoriteCount} ta so'z` : "Hali sevimli so'z yo'q",
      icon: '⭐',
      color: '#f59e0b',
      enabled: favoriteCount > 0,
    },
    {
      mode: 'ALL',
      title: "Tasodifiy so'zlar",
      subtitle: `Lug'atingizdan 20 tagacha so'z (${totalWords} ta ichidan)`,
      icon: '🔀',
      color: '#10b981',
      enabled: totalWords > 0,
    }
  );
  return opts;
}

export function ModeCards({ options, disabled, onPick }: { options: DeckOption[]; disabled?: boolean; onPick: (m: QuizMode) => void }) {
  return (
    <>
      {options.map((o) => (
        <button key={o.mode} className="mode-card" disabled={!o.enabled || disabled} onClick={() => onPick(o.mode)}>
          <div className="mode-icon" style={{ background: `${o.color}1f` }}>
            {o.icon}
          </div>
          <div className="grow">
            <div className="mode-title">{o.title}</div>
            <div className="mode-sub">{o.subtitle}</div>
          </div>
          <span className="muted">›</span>
        </button>
      ))}
    </>
  );
}

const FORMATS: { key: QuizFormat; label: string; hint: string }[] = [
  { key: 'TYPED', label: '⌨️ Yozma', hint: "Javobni o'zingiz yozasiz." },
  { key: 'CHOICE', label: '☑️ Variantli', hint: "4 ta variantdan birini tanlaysiz. Variantli javob so'zni faqat o'rta darajagacha ko'taradi." },
  { key: 'LISTENING', label: '🎧 Eshitib yozish', hint: "So'z o'qiladi, siz eshitib inglizcha yozasiz." },
];

export default function StudyPage() {
  const [view, setView] = useState<View>('hub');
  const [words, setWords] = useState<Word[]>([]);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState<QuizFormat>('TYPED');
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [ai, setAi] = useState<SentenceStatus | null>(null);

  const load = useCallback(async () => {
    try {
      const [w, r] = await Promise.all([wordsApi.list(), reviewApi.summary()]);
      setWords(w);
      setReview(r);
      sentencesApi.status().then(setAi).catch(() => setAi(null));
    } catch {
      // keep what we have
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'hub') load();
  }, [view, load]);

  const exit = () => setView('hub');

  if (loading) return <Spinner />;

  const favoriteCount = words.filter((w) => w.favorite).length;
  const today = dayKey(new Date());
  const todayCount = words.filter((w) => dayKey(new Date(w.createdAt)) === today).length;

  if (view === 'flash')
    return <FlashcardGame review={review} totalWords={words.length} favoriteCount={favoriteCount} onExit={exit} />;
  if (view === 'match')
    return <MatchingGame review={review} totalWords={words.length} favoriteCount={favoriteCount} onExit={exit} />;
  if (view === 'sentence') return <SentencesPage onBack={exit} />;
  if (view === 'speed') return <SpeedGame review={review} totalWords={words.length} onExit={exit} />;
  if (view === 'quiz' && quizMode) return <QuizSession mode={quizMode} format={format} onExit={exit} />;

  const goal = review ? Math.min(100, Math.round((review.todayDone / Math.max(1, review.dailyGoal)) * 100)) : 0;

  const done = review?.todayDone ?? 0;
  const target = review?.dailyGoal ?? 0;
  const games: { key: View; icon: string; title: string; sub: string; tone: string; min: number }[] = [
    { key: 'flash', icon: '🃏', title: 'Fleshkart', sub: "Kartani aylantiring va bilganingizni belgilang", tone: '#6366f1', min: 1 },
    { key: 'match', icon: '🧩', title: 'Juftlarni moslash', sub: "Inglizcha so'zlarni tarjimasi bilan juftlang", tone: '#a855f7', min: 3 },
    { key: 'speed', icon: '⏱️', title: 'Tez raund', sub: "60 soniyada iloji boricha ko'p savolga javob bering", tone: '#f59e0b', min: 4 },
    ...(ai?.enabled
      ? [{ key: 'sentence' as View, icon: '✍️', title: 'Gap tuzish', sub: "So'z bilan gap yozing, sun'iy intellekt tekshirib baho beradi", tone: '#10b981', min: 1 }]
      : []),
  ];

  return (
    <>
      <header className="sx-head rise">
        <div>
          <div className="eyebrow">Bilimni mustahkamlang</div>
          <h1 className="dx-title">Mashq</h1>
        </div>
        {review && (
          <div className="sx-goal">
            <div className="sx-goal-row">
              <span>Bugungi maqsad</span>
              <b>
                {done} <small>/ {target} so'z</small>
              </b>
            </div>
            <ProgressBar pct={goal} color={goal >= 100 ? 'var(--secondary)' : undefined} />
          </div>
        )}
      </header>

      {words.length === 0 ? (
        <Card className="empty">
          <div className="empty-emoji">📝</div>
          <p className="muted">Mashq qilish uchun avval so'z qo'shing.</p>
        </Card>
      ) : (
        <>
          <section className="sx-sec rise" style={{ ['--d' as string]: '0.05s' }}>
            <div className="sx-sec-head">
              <div>
                <h2>Baholash</h2>
                <p>{FORMATS.find((f) => f.key === format)?.hint}</p>
              </div>
              <div className="dx-filters" role="tablist">
                {FORMATS.map((f) => (
                  <button key={f.key} role="tab" aria-selected={format === f.key} className={`dx-seg ${format === f.key ? 'on' : ''}`} onClick={() => setFormat(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sx-grid">
              <ModeCards
                options={buildDeckOptions(review, words.length, favoriteCount, todayCount)}
                onPick={(m) => {
                  setQuizMode(m);
                  setView('quiz');
                }}
              />
            </div>
          </section>

          <section className="sx-sec rise" style={{ ['--d' as string]: '0.12s' }}>
            <div className="sx-sec-head">
              <div>
                <h2>O'yinlar</h2>
                <p>Mashqni qiziqarli qiling.</p>
              </div>
            </div>
            <div className="sx-games">
              {games.map((g) => (
                <button key={g.key} className="sx-game" style={{ ['--tone' as string]: g.tone }} disabled={words.length < g.min} onClick={() => setView(g.key)}>
                  <span className="sx-game-ico">{g.icon}</span>
                  <b>{g.title}</b>
                  <small>{g.sub}</small>
                  <span className="sx-game-go" aria-hidden="true">Boshlash →</span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------ quiz session */

const PROMPT_META: Record<QuizPromptType, { label: string; badge: string; bg: string; fg: string }> = {
  english: { label: "O'zbekcha tarjimasini yozing", badge: "Inglizcha so'z", bg: 'var(--indigo-bg)', fg: 'var(--indigo-text)' },
  uzbek: { label: "Inglizcha so'zini yozing", badge: "O'zbekcha tarjima", bg: 'var(--green-bg)', fg: 'var(--green-text)' },
  definition: { label: "Bu qaysi so'z? Inglizcha yoki o'zbekcha javob yozing", badge: 'Definition', bg: 'var(--amber-bg)', fg: 'var(--amber-text)' },
};

function answerHint(q: Question): string {
  return q.answerLanguage === "uzbek" ? "O'zbekcha tarjimasini yozing" : "Inglizcha so'zini yozing";
}

function resultTier(accuracy: number, total: number) {
  if (total === 0) return { icon: '❔', title: 'Yakunlandi', message: 'Birorta ham savolga javob berilmadi.' };
  if (accuracy >= 80) return { icon: '🏆', title: 'Ajoyib natija!', message: "So'zlarni juda yaxshi bilasiz, shu zaylda davom eting." };
  if (accuracy >= 50) return { icon: '👍', title: 'Yaxshi natija!', message: "Yana biroz mashq qilsangiz, mukammal bo'ladi." };
  return { icon: '🔄', title: 'Yana mashq qiling', message: "So'zlarni takrorlab, bilimingizni mustahkamlang." };
}

function duration(start?: string, end?: string | null): string | null {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms < 0) return null;
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s} soniya` : `${Math.floor(s / 60)} daqiqa ${s % 60} soniya`;
}

interface Question {
  promptType: QuizPromptType;
  promptText: string;
  options: string[] | null;
  answerLanguage: "english" | "uzbek";
}

function QuizSession({ mode, format, onExit }: { mode: QuizMode; format: QuizFormat; onExit: () => void }) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<QuizProgress | null>(null);
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState('');
  const [chosen, setChosen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; closeMatch: boolean; correctAnswer: string; xpGained: number } | null>(null);
  const [next, setNext] = useState<Question | null>(null);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [done, setDone] = useState(false);
  const [starting, setStarting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = useCallback(async () => {
    setStarting(true);
    setError('');
    setDone(false);
    setSummary(null);
    setResult(null);
    setNext(null);
    setAnswer('');
    setChosen(null);
    try {
      const q = await quizApi.start(mode, format);
      setSessionId(q.sessionId);
      setQuestion({ promptType: q.promptType, promptText: q.promptText, options: q.options, answerLanguage: q.answerLanguage });
      setProgress(q.progress);
    } catch (e) {
      setError(errorMessage(e, "Baholashni boshlab bo'lmadi"));
    } finally {
      setStarting(false);
    }
  }, [mode, format]);

  useEffect(() => {
    start();
    return stopSpeaking;
  }, [start]);

  // Dictation mode reads every new word aloud.
  useEffect(() => {
    if (format === 'LISTENING' && question && !done) speakEnglish(question.promptText);
  }, [question, format, done]);

  useEffect(() => {
    if (!result) inputRef.current?.focus();
  }, [question, result]);

  const submit = async (given: string) => {
    if (!sessionId || !given || result || submitting) return;
    setSubmitting(true);
    try {
      const res = await quizApi.answer(sessionId, given);
      setProgress(res.progress);
      setResult({ correct: res.correct, closeMatch: res.closeMatch, correctAnswer: res.correctAnswer, xpGained: res.xpGained ?? 0 });
      setNext(
        res.progress.finished || !res.nextPromptType || !res.nextPromptText
          ? null
          : { promptType: res.nextPromptType, promptText: res.nextPromptText, options: res.nextOptions, answerLanguage: res.nextAnswerLanguage ?? "english" }
      );
    } catch (e) {
      setError(errorMessage(e, "Javobni yuborib bo'lmadi"));
    } finally {
      setSubmitting(false);
    }
  };

  const finish = async () => {
    if (!sessionId) return;
    try {
      setSummary(await quizApi.finish(sessionId));
    } catch {
      setSummary(null);
    }
    setDone(true);
    requestProgressCheck();
  };

  const goNext = () => {
    if (!next) return;
    setQuestion(next);
    setNext(null);
    setResult(null);
    setAnswer('');
    setChosen(null);
  };

  const leave = () => {
    if (sessionId && !done) quizApi.finish(sessionId).catch(() => undefined);
    onExit();
  };

  if (starting) return <Spinner />;

  if (error && !question) {
    return (
      <>
        <PageHeader title="Baholash" back={onExit} />
        <Notice>{error}</Notice>
        <Button onClick={start}>Qayta urinish</Button>
      </>
    );
  }

  if (done) {
    const correct = summary?.correctCount ?? progress?.correctCount ?? 0;
    const wrong = summary?.incorrectCount ?? progress?.incorrectCount ?? 0;
    const total = correct + wrong;
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    const tier = resultTier(acc, total);
    const took = duration(summary?.startedAt, summary?.finishedAt);
    return (
      <>
        <GameResult
          icon={tier.icon}
          title={tier.title}
          value={acc}
          unit={tier.message}
          valueSuffix="%"
          tone={acc >= 80 ? '#10b981' : acc >= 50 ? '#6366f1' : '#f59e0b'}
          celebrate={acc >= 80 && total > 0}
          stats={[
            { label: "To'g'ri", value: String(correct) },
            { label: 'Xato', value: String(wrong) },
            ...(took ? [{ label: DECK_TITLES[mode], value: took }] : []),
          ]}
          againLabel="↻ Qayta boshlash"
          exitLabel="Bosh sahifa"
          onAgain={start}
          onExit={onExit}
        />
      </>
    );
  }

  if (!question || !progress) return null;
  const meta = PROMPT_META[question.promptType];
  const isChoice = format === 'CHOICE' && question.options;
  const isListening = format === 'LISTENING';
  const pct = progress.unlimited ? 0 : (progress.answered / Math.max(1, progress.totalWords)) * 100;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(answer.trim());
  };

  const kind = result ? (result.correct ? 'good' : result.closeMatch ? 'close' : 'bad') : '';
  const answered = progress.answered;
  const total = progress.totalWords;
  const steps = !progress.unlimited && total <= 30 ? total : 0;

  return (
    <>
      <header className="qx-top rise">
        <button className="gp-back" onClick={leave} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>Baholash</small>
          <b>{DECK_TITLES[mode]}</b>
        </div>
        <div className="qx-pills">
          <span className="qx-pill">{answered + 1}{progress.unlimited ? '' : ` / ${total}`}</span>
          <span className="qx-pill ok">✓ {progress.correctCount}</span>
          <span className="qx-pill bad">✕ {progress.incorrectCount}</span>
        </div>
      </header>
      {!progress.unlimited &&
        (steps > 0 ? (
          <div className="qx-steps" aria-hidden="true">
            {Array.from({ length: steps }, (_, i) => (
              <i key={i} className={i < answered ? 'done' : i === answered ? 'now' : ''} />
            ))}
          </div>
        ) : (
          <ProgressBar pct={pct} />
        ))}
      {error && <Notice>{error}</Notice>}

      <section className={`qx-card ${kind}`} key={question.promptText}>
        {isListening ? (
          <>
            <span className="qx-badge" style={{ background: meta.bg, color: meta.fg }}>Eshiting va yozing</span>
            <div className="qx-listen">
              <SpeakButton text={question.promptText} />
              <SpeakButton text={question.promptText} slow />
            </div>
          </>
        ) : (
          <>
            <span className="qx-badge" style={{ background: meta.bg, color: meta.fg }}>{meta.badge}</span>
            <div className={question.promptType === 'definition' ? 'qx-def' : 'qx-word'}>{question.promptText}</div>
            {question.promptType === 'english' && <SpeakButton text={question.promptText} />}
          </>
        )}
        <p className="qx-hint">{isChoice ? "To'g'ri javobni tanlang" : isListening ? "Eshitgan so'zingizni inglizcha yozing" : answerHint(question)}</p>

        {isChoice ? (
          <div className="qx-options">
            {question.options!.map((o, i) => {
              const cls = result ? (o === result.correctAnswer ? 'right' : o === chosen ? 'wrong' : 'dim') : '';
              return (
                <button
                  key={o}
                  className={`qx-opt ${cls}`}
                  disabled={!!result || submitting}
                  onClick={() => {
                    setChosen(o);
                    submit(o);
                  }}
                >
                  <span className="qx-key">{cls === 'right' ? '✓' : cls === 'wrong' ? '✕' : String.fromCharCode(65 + i)}</span>
                  <span className="qx-opt-text">{o}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="qx-form">
            <input
              ref={inputRef}
              className="qx-input"
              placeholder="Javobingizni yozing…"
              value={answer}
              disabled={!!result}
              onChange={(e) => setAnswer(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            {!result && (
              <Button type="submit" block loading={submitting} disabled={!answer.trim()}>
                Tekshirish
              </Button>
            )}
          </form>
        )}

        {result && (
          <div className={`qx-feedback ${kind}`}>
            <span className="qx-fb-ico">{result.correct ? '✓' : result.closeMatch ? '≈' : '✕'}</span>
            <div className="qx-fb-txt">
              <b>{result.correct ? "To'g'ri!" : result.closeMatch ? 'Deyarli to\'g\'ri' : "Noto'g'ri"}</b>
              {!result.correct && <span>To'g'ri javob: <em>{result.correctAnswer}</em></span>}
            </div>
            {result.correct && result.xpGained > 0 && <span className="qx-xp">+{result.xpGained} XP</span>}
          </div>
        )}

        {result && (
          <div className="qx-actions">
            {next ? <Button onClick={goNext} autoFocus>Keyingi savol →</Button> : <Button onClick={finish} autoFocus>Natijani ko'rish</Button>}
            {next && <Button variant="outline" onClick={finish}>Tugatish</Button>}
          </div>
        )}
      </section>

      {!result && progress.answered > 0 && (
        <div className="qx-finish">
          <button onClick={finish}>Tugatish va natijani ko'rish</button>
        </div>
      )}
    </>
  );
}
