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

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  const names = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  return `${names[m - 1]} ${y}`;
}

/** Accuracy gauge; the arc eases in on first paint. */
function AccuracyRing({ pct, size = 150, stroke = 13 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(Math.max(0, Math.min(1, pct / 100))));
    return () => cancelAnimationFrame(t);
  }, [pct]);
  return (
    <div className="st-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="st-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#st-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="st-ring-in">
        <b>{pct}%</b>
        <small>aniqlik</small>
      </div>
    </div>
  );
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

  const head = (
    <header className="st-head rise">
      <button className="st-back" onClick={back} aria-label="Orqaga">←</button>
      <div>
        <div className="eyebrow">Natijalaringiz</div>
        <h1 className="dx-title">Statistika</h1>
      </div>
    </header>
  );

  if (state === 'loading') {
    return (
      <>
        {head}
        <Spinner />
      </>
    );
  }
  if (state === 'error' || !summary || !review) {
    return (
      <>
        {head}
        <Card className="empty">
          <p className="muted">Statistikani yuklab bo'lmadi</p>
          <Button variant="outline" onClick={load}>Qayta urinish</Button>
        </Card>
      </>
    );
  }

  const goalPct = Math.min(100, Math.round((review.todayDone / Math.max(1, review.dailyGoal)) * 100));
  const reached = review.todayDone >= review.dailyGoal;
  const hardest = [...words].filter((w) => w.lapses > 0).sort((x, y) => y.lapses - x.lapses).slice(0, 5);
  const maxLapses = Math.max(1, ...hardest.map((w) => w.lapses));
  const states = [
    { label: 'Yangi', n: review.newCount, color: '#818cf8' },
    { label: "O'rganilmoqda", n: review.learningCount, color: '#fbbf24' },
    { label: "O'zlashtirilgan", n: review.masteredCount, color: '#34d399' },
  ];
  const totalWords = Math.max(1, review.totalWords);
  const last7 = daily.slice(-7);
  const maxDay = Math.max(1, ...last7.map((d) => d.correctAnswers + d.incorrectAnswers));
  const kpis = [
    { icon: '📚', value: summary.totalWords, label: "Jami so'z" },
    { icon: '📝', value: summary.totalQuizzes, label: 'Baholashlar' },
    { icon: '📆', value: summary.activeDays, label: 'Faol kunlar' },
    { icon: '🏅', value: `${summary.bestStreak}`, unit: 'kun', label: 'Eng uzun seriya' },
  ];

  return (
    <div className="st">
      {head}

      <section className="st-top rise" style={{ ['--d' as string]: '0.04s' }}>
        <div className="st-card st-acc">
          <AccuracyRing pct={summary.accuracyPercent} />
          <div className="st-acc-side">
            <div className="eyebrow">Umumiy natija</div>
            <div className="st-acc-row ok"><i />{summary.totalCorrect} <span>to'g'ri</span></div>
            <div className="st-acc-row bad"><i />{summary.totalIncorrect} <span>xato</span></div>
          </div>
        </div>

        <div className="st-card st-goal">
          <div className="st-goal-top">
            <div>
              <div className="eyebrow">Bugungi maqsad</div>
              <div className="st-goal-num">
                {review.todayDone}
                <small> / {review.dailyGoal} so'z</small>
              </div>
            </div>
            <div className="st-streak">
              <span className="st-flame" aria-hidden="true">🔥</span>
              <b>{summary.currentStreak}</b>
              <small>kun ketma-ket</small>
            </div>
          </div>
          <ProgressBar pct={goalPct} color={reached ? 'var(--secondary)' : undefined} />
          <div className="st-goal-msg">{reached ? '🎉 Bugungi maqsad bajarildi! Yana mashq qilishingiz mumkin.' : `Yana ${review.dailyGoal - review.todayDone} ta so'z qoldi`}</div>
        </div>
      </section>

      <section className="st-kpis rise" style={{ ['--d' as string]: '0.08s' }}>
        {kpis.map((k) => (
          <div key={k.label} className="st-kpi">
            <span className="st-kpi-ico">{k.icon}</span>
            <b>
              {k.value}
              {k.unit && <em> {k.unit}</em>}
            </b>
            <small>{k.label}</small>
          </div>
        ))}
      </section>

      <section className="st-card rise" style={{ ['--d' as string]: '0.12s' }}>
        <div className="st-card-head">
          <h2>So'zlar holati</h2>
          <span>{review.totalWords} ta so'z</span>
        </div>
        <div className="st-stack" aria-hidden="true">
          {states.map((x) => (
            <i key={x.label} style={{ flex: x.n, background: x.color }} />
          ))}
          {review.totalWords === 0 && <i style={{ flex: 1, background: 'var(--track)' }} />}
        </div>
        <div className="st-legend">
          {states.map((x) => (
            <span key={x.label}>
              <i style={{ background: x.color }} />
              <b>{x.n}</b> {x.label}
              <em>{Math.round((x.n / totalWords) * 100)}%</em>
            </span>
          ))}
        </div>
      </section>

      <section className="st-card rise" style={{ ['--d' as string]: '0.16s' }}>
        <div className="st-card-head">
          <h2>Oxirgi kunlar</h2>
          <div className="st-key">
            <span><i className="ok" /> To'g'ri</span>
            <span><i className="bad" /> Xato</span>
          </div>
        </div>
        {last7.length === 0 ? (
          <p className="muted">Hali ma'lumot yo'q</p>
        ) : (
          <div className="st-chart">
            {last7.map((d) => {
              const total = d.correctAnswers + d.incorrectAnswers;
              const h = total === 0 ? 0 : Math.max(6, Math.round((total / maxDay) * 100));
              return (
                <div key={d.date} className="st-col" title={`${shortDate(d.date)}: ${d.correctAnswers} to'g'ri, ${d.incorrectAnswers} xato`}>
                  <div className="st-col-val">{total > 0 ? total : ''}</div>
                  <div className="st-col-track">
                    <div className="st-bar" style={{ height: `${h}%` }}>
                      <i className="bad" style={{ flex: d.incorrectAnswers }} />
                      <i className="ok" style={{ flex: d.correctAnswers }} />
                    </div>
                  </div>
                  <div className="st-col-lbl">{shortDate(d.date)}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {(hardest.length > 0 || summary.formats.length > 0) && (
        <div className="st-two rise" style={{ ['--d' as string]: '0.2s' }}>
          {hardest.length > 0 && (
            <section className="st-card">
              <div className="st-card-head">
                <h2>Eng qiyin so'zlar</h2>
              </div>
              {hardest.map((w, i) => (
                <div key={w.id} className="st-hard">
                  <span className="st-rank">{i + 1}</span>
                  <div className="st-hard-main">
                    <div className="st-hard-top">
                      <b>{w.english}</b>
                      <span>{w.uzbek}</span>
                    </div>
                    <div className="st-hard-bar"><i style={{ width: `${(w.lapses / maxLapses) * 100}%` }} /></div>
                  </div>
                  <em>{w.lapses}×</em>
                </div>
              ))}
            </section>
          )}
          {summary.formats.length > 0 && (
            <section className="st-card">
              <div className="st-card-head">
                <h2>Javob turlari</h2>
              </div>
              {summary.formats.map((f) => (
                <div key={f.format} className="st-fmt">
                  <div className="st-fmt-top">
                    <span>{FORMAT_LABEL[f.format] ?? f.format}</span>
                    <b>{f.accuracyPercent}%</b>
                  </div>
                  <ProgressBar pct={f.accuracyPercent} />
                  <small>{f.correct} / {f.total} to'g'ri</small>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      <section className="st-card rise" style={{ ['--d' as string]: '0.24s' }}>
        <div className="st-card-head">
          <h2>Tarix</h2>
          <div className="dx-filters" role="tablist">
            <button role="tab" aria-selected={mode === 'daily'} className={`dx-seg ${mode === 'daily' ? 'on' : ''}`} onClick={() => setMode('daily')}>Kunlar</button>
            <button role="tab" aria-selected={mode === 'monthly'} className={`dx-seg ${mode === 'monthly' ? 'on' : ''}`} onClick={() => setMode('monthly')}>Oylar</button>
          </div>
        </div>
        {(mode === 'daily' ? daily.length : monthly.length) === 0 ? (
          <p className="muted center">Hali ma'lumot yo'q</p>
        ) : (
          <div className="st-hist">
            {[...(mode === 'daily' ? daily : monthly)].reverse().map((r) => {
              const key = 'date' in r ? r.date : r.month;
              const answered = r.correctAnswers + r.incorrectAnswers;
              return (
                <div key={key} className="st-hist-row">
                  <div className="st-hist-date">{'date' in r ? shortDate(r.date) : monthLabel(r.month)}</div>
                  <div className="st-hist-info">
                    <span>+{r.wordsAdded} so'z</span>
                    <span>{r.quizzesTaken} baholash</span>
                    <span>{answered} javob</span>
                  </div>
                  {answered > 0 ? <span className="st-pct">{r.accuracyPercent}%</span> : <span className="st-pct none">—</span>}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
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
