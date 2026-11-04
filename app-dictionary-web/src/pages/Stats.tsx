import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnswerFormat,
  DailyStats,
  errorMessage,
  MonthlyStats,
  reviewApi,
  ReviewSummary,
  statsApi,
  StatsSummary,
  Word,
  wordsApi,
  WeeklyReport,
  WeeklyTotals,
} from '../api';
import { Button, Card, PageHeader, ProgressBar, Spinner } from '../ui';
import { shortDate } from '../util';

const FORMAT_LABEL: Record<AnswerFormat, string> = {
  TYPED: '⌨️ Yozma',
  CHOICE: '☑️ Variantli',
  FLASHCARD: '🃏 Fleshkart',
  LISTENING: '🎧 Eshitib yozish',
  MATCHING: '🧩 Juftlash',
  SPEED: '⏱️ Tez raund',
};

function Tile({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="tile">
      <div className="tile-value">{value}</div>
      <div className="tile-label">{label}</div>
      {hint && <div className="muted" style={{ fontSize: 12 }}>{hint}</div>}
    </div>
  );
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  const names = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  return `${names[m - 1]} ${y}`;
}

export function StatsPage() {
  const nav = useNavigate();
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [monthly, setMonthly] = useState<MonthlyStats[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [mode, setMode] = useState<'daily' | 'monthly'>('daily');
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  const load = () => {
    setState('loading');
    Promise.all([statsApi.summary(), reviewApi.summary(), statsApi.daily(), statsApi.monthly(), wordsApi.list()])
      .then(([s, r, d, m, w]) => {
        setSummary(s);
        setReview(r);
        setDaily(d);
        setMonthly(m);
        setWords(w);
        setState('ok');
      })
      .catch(() => setState('error'));
  };

  useEffect(load, []);

  const back = () => nav('/profile');

  if (state === 'loading') {
    return (
      <>
        <PageHeader title="Statistika" back={back} />
        <Spinner />
      </>
    );
  }
  if (state === 'error' || !summary || !review) {
    return (
      <>
        <PageHeader title="Statistika" back={back} />
        <Card className="empty">
          <p className="muted">Statistikani yuklab bo'lmadi</p>
          <Button variant="outline" onClick={load}>Qayta urinish</Button>
        </Card>
      </>
    );
  }

  const goalPct = Math.min(100, Math.round((review.todayDone / Math.max(1, review.dailyGoal)) * 100));
  const reached = review.todayDone >= review.dailyGoal;
  const hardest = [...words].filter((w) => w.lapses > 0).sort((a, b) => b.lapses - a.lapses).slice(0, 5);
  const states = [
    { label: 'Yangi', n: review.newCount, color: 'var(--indigo-text)' },
    { label: "O'rganilmoqda", n: review.learningCount, color: 'var(--amber-text)' },
    { label: "O'zlashtirilgan", n: review.masteredCount, color: 'var(--green-text)' },
  ];
  const totalWords = Math.max(1, review.totalWords);
  const last7 = daily.slice(-7);
  const maxDay = Math.max(1, ...last7.map((d) => d.correctAnswers + d.incorrectAnswers));

  return (
    <>
      <PageHeader title="Statistika" back={back} />

      <Card className="mb">
        <div className="row">
          <div>
            <b>{reached ? '🎉 Bugungi maqsad bajarildi!' : 'Bugungi maqsad'}</b>
            <div className="muted" style={{ fontSize: 13 }}>
              {reached ? "Ajoyib! Yana mashq qilishingiz mumkin." : `Yana ${review.dailyGoal - review.todayDone} ta so'z qoldi`}
            </div>
          </div>
          <div className="grow" />
          <div className="center">
            <div style={{ fontSize: 22, fontWeight: 800 }}>🔥 {summary.currentStreak}</div>
            <div className="muted" style={{ fontSize: 12 }}>kun ketma-ket</div>
          </div>
        </div>
        <div style={{ margin: '12px 0 6px' }}>
          <ProgressBar pct={goalPct} color={reached ? 'var(--secondary)' : undefined} />
        </div>
        <div className="muted" style={{ fontSize: 13 }}>
          {review.todayDone} / {review.dailyGoal} so'z
        </div>
      </Card>

      <div className="grid mb">
        <Tile label="Jami so'z" value={summary.totalWords} />
        <Tile label="Baholashlar" value={summary.totalQuizzes} />
        <Tile label="Aniqlik" value={`${summary.accuracyPercent}%`} hint={`${summary.totalCorrect} to'g'ri · ${summary.totalIncorrect} xato`} />
        <Tile label="Faol kunlar" value={summary.activeDays} />
        <Tile label="Eng uzun seriya" value={`${summary.bestStreak} kun`} />
      </div>

      <Card className="mb">
        <div className="row">
          <b className="grow">So'zlar holati</b>
          <span className="muted">{review.totalWords} ta so'z</span>
        </div>
        <div className="row" style={{ height: 12, borderRadius: 6, overflow: 'hidden', margin: '12px 0', background: 'var(--border)' }}>
          {states.map((s) => (
            <div key={s.label} style={{ width: `${(s.n / totalWords) * 100}%`, background: s.color, height: '100%' }} />
          ))}
        </div>
        <div className="row gap wrap">
          {states.map((s) => (
            <span key={s.label} className="row gap" style={{ gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: s.color }} />
              <b>{s.n}</b> <span className="muted">{s.label}</span>
            </span>
          ))}
        </div>
      </Card>

      <Card className="mb">
        <b>Oxirgi kunlar</b>
        {last7.length === 0 ? (
          <p className="muted">Hali ma'lumot yo'q</p>
        ) : (
          <div className="chart">
            {last7.map((d) => {
              const right = d.correctAnswers;
              const wrong = d.incorrectAnswers;
              const total = right + wrong;
              const h = total === 0 ? 0 : Math.max(8, Math.round((total / maxDay) * 100));
              return (
                <div key={d.date} className="chart-col">
                  <div className="chart-val">{total > 0 ? total : ''}</div>
                  <div style={{ width: '100%', maxWidth: 34, height: `${h}%`, display: 'flex', flexDirection: 'column-reverse', minHeight: 3, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ height: `${total ? (right / total) * 100 : 0}%`, background: 'var(--secondary)' }} />
                    <div style={{ height: `${total ? (wrong / total) * 100 : 0}%`, background: 'var(--danger)' }} />
                  </div>
                  <div className="chart-lbl">{shortDate(d.date)}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className="row gap muted" style={{ fontSize: 12, marginTop: 8 }}>
          <span>🟩 To'g'ri</span>
          <span>🟥 Xato</span>
        </div>
      </Card>

      {hardest.length > 0 && (
        <Card className="mb">
          <b>Eng qiyin so'zlar</b>
          {hardest.map((w, i) => (
            <div key={w.id} className="row gap" style={{ padding: '10px 0', borderBottom: i < hardest.length - 1 ? '1px solid var(--border)' : 0 }}>
              <div className="rank">{i + 1}</div>
              <div className="grow">
                <b>{w.english}</b>
                <div className="muted" style={{ fontSize: 13 }}>{w.uzbek}</div>
              </div>
              <span className="chip chip-weak">{w.lapses} marta xato</span>
            </div>
          ))}
        </Card>
      )}

      {summary.formats.length > 0 && (
        <Card className="mb">
          <b>Javob turlari bo'yicha</b>
          {summary.formats.map((f) => (
            <div key={f.format} style={{ marginTop: 12 }}>
              <div className="row">
                <span className="grow">{FORMAT_LABEL[f.format] ?? f.format}</span>
                <span className="muted">
                  {f.correct}/{f.total} · {f.accuracyPercent}%
                </span>
              </div>
              <ProgressBar pct={f.accuracyPercent} />
            </div>
          ))}
        </Card>
      )}

      <div className="tabs">
        <button className={`tab ${mode === 'daily' ? 'on' : ''}`} onClick={() => setMode('daily')}>Kunlar bo'yicha</button>
        <button className={`tab ${mode === 'monthly' ? 'on' : ''}`} onClick={() => setMode('monthly')}>Oylar bo'yicha</button>
      </div>
      {(mode === 'daily' ? daily.length : monthly.length) === 0 ? (
        <p className="muted center">Hali ma'lumot yo'q</p>
      ) : (
        [...(mode === 'daily' ? daily : monthly)].reverse().map((r) => {
          const key = 'date' in r ? r.date : r.month;
          const answered = r.correctAnswers + r.incorrectAnswers;
          return (
            <div key={key} className="word-row" style={{ cursor: 'default' }}>
              <div className="word-main">
                <b>{'date' in r ? shortDate(r.date) : monthLabel(r.month)}</b>
                <div className="muted" style={{ fontSize: 13 }}>
                  +{r.wordsAdded} so'z · {r.quizzesTaken} baholash · {answered} javob
                </div>
              </div>
              {answered > 0 && <span className="chip chip-mastered">{r.accuracyPercent}%</span>}
            </div>
          );
        })
      )}
    </>
  );
}

/* ------------------------------------------------------------ weekly */

function Delta({ now, before, suffix = '' }: { now: number; before: number; suffix?: string }) {
  const diff = Math.round((now - before) * 10) / 10;
  if (diff === 0) return <div className="muted" style={{ fontSize: 12 }}>o'zgarmagan</div>;
  const up = diff > 0;
  return (
    <div className="tile-hint" style={{ color: up ? 'var(--secondary)' : 'var(--danger)' }}>
      {up ? '▲' : '▼'} {Math.abs(diff)}
      {suffix}
    </div>
  );
}

function verdict(t: WeeklyTotals, p: WeeklyTotals): string {
  if (t.answers === 0 && t.wordsAdded === 0) return "Bu hafta hali faollik yo'q. Bugun boshlang!";
  if (t.answers > p.answers && t.accuracyPercent >= p.accuracyPercent) return "Ajoyib hafta: ko'proq va aniqroq!";
  if (t.answers > p.answers) return "O'tgan haftadan ko'proq mashq qildingiz.";
  if (t.accuracyPercent > p.accuracyPercent) return 'Aniqlik oshdi, davom eting!';
  return 'Barqaror davom eting, har kun bir oz.';
}

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

export function WeeklyPage() {
  const nav = useNavigate();
  const [weeksBack, setWeeksBack] = useState(0);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setReport(null);
    setError('');
    statsApi
      .weekly(weeksBack)
      .then(setReport)
      .catch((e) => setError(errorMessage(e, "Hisobotni yuklab bo'lmadi")));
  }, [weeksBack]);

  const nav2 = (
    <div className="row mb" style={{ justifyContent: 'space-between' }}>
      <button className="icon-btn" onClick={() => setWeeksBack(weeksBack + 1)} aria-label="Oldingi hafta">‹</button>
      <div className="center">
        <b>{weeksBack === 0 ? 'Shu hafta' : weeksBack === 1 ? "O'tgan hafta" : `${weeksBack} hafta oldin`}</b>
        {report && <div className="muted" style={{ fontSize: 12 }}>{shortDate(report.weekStart)} – {shortDate(report.weekEnd)}</div>}
      </div>
      <button className="icon-btn" disabled={weeksBack === 0} style={{ opacity: weeksBack === 0 ? 0.3 : 1 }} onClick={() => setWeeksBack(weeksBack - 1)} aria-label="Keyingi hafta">›</button>
    </div>
  );

  if (!report) {
    return (
      <>
        <PageHeader title="Haftalik hisobot" back={() => nav('/profile')} />
        {nav2}
        {error ? <p className="muted center">{error}</p> : <Spinner />}
      </>
    );
  }

  const t = report.totals;
  const p = report.previous;
  const maxAnswers = Math.max(1, ...report.days.map((d) => d.answers));
  const tiles: { label: string; value: string; now: number; before: number; suffix?: string }[] = [
    { label: 'Javoblar', value: String(t.answers), now: t.answers, before: p.answers },
    { label: 'Aniqlik', value: `${t.accuracyPercent}%`, now: t.accuracyPercent, before: p.accuracyPercent, suffix: '%' },
    { label: 'XP', value: String(t.xp), now: t.xp, before: p.xp },
    { label: "Yangi so'zlar", value: String(t.wordsAdded), now: t.wordsAdded, before: p.wordsAdded },
    { label: "Mashq qilingan so'z", value: String(t.wordsPracticed), now: t.wordsPracticed, before: p.wordsPracticed },
    { label: 'Maqsad kunlari', value: String(t.goalDays), now: t.goalDays, before: p.goalDays },
  ];

  return (
    <>
      <PageHeader title="Haftalik hisobot" back={() => nav('/profile')} />
      {nav2}
      <Card className="mb">
        <b>{verdict(t, p)}</b>
        <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
          {t.activeDays} / 7 kun faol · maqsad {t.goalDays} kun bajarildi
        </div>
      </Card>
      <div className="grid">
        {tiles.map((x) => (
          <div key={x.label} className="tile">
            <div className="tile-value">{x.value}</div>
            <div className="tile-label">{x.label}</div>
            <Delta now={x.now} before={x.before} suffix={x.suffix} />
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 12 }}>Yashil/qizil belgi o'tgan haftaga nisbatan farqni ko'rsatadi.</p>

      <Card className="mb">
        <b>Kunlar bo'yicha javoblar</b>
        <div className="chart">
          {report.days.map((d, i) => {
            const best = d.date === report.bestDay;
            const h = d.answers === 0 ? 3 : Math.max(6, Math.round((d.answers / maxAnswers) * 100));
            return (
              <div key={d.date} className="chart-col">
                <div className="chart-val">{d.answers > 0 ? d.answers : ''}</div>
                <div
                  className="chart-bar"
                  style={{ height: `${h}%`, background: best ? 'var(--secondary)' : d.answers ? 'var(--primary)' : 'var(--border)' }}
                />
                <div className="chart-lbl" style={best ? { color: 'var(--secondary)', fontWeight: 800 } : undefined}>{WEEKDAYS[i]}</div>
              </div>
            );
          })}
        </div>
        {report.bestDay && <p className="center muted" style={{ fontSize: 13 }}>Eng faol kun: {shortDate(report.bestDay)}</p>}
      </Card>
    </>
  );
}
