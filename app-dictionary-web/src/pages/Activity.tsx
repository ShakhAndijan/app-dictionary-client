import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ActivityDay, ActivityReport } from '../api';

/** The three study areas, always in this order and colour (see .act-* in styles.css). */
export const AREAS = [
  { key: 'words', code: 'WORDS', label: "So'zlar", icon: '📚', to: '/profile/stats' },
  { key: 'english', code: 'ENGLISH', label: 'Ingliz tili', icon: '🎓', to: '/profile/stats?tab=english' },
  { key: 'dev', code: 'DEV', label: 'Dasturlash', icon: '💻', to: '/profile/stats?tab=dev' },
] as const;

const SKILL_LABEL: Record<string, string> = { READING: "O'qish", LISTENING: 'Eshitish', WRITING: 'Yozish', GRAMMAR: 'Grammatika' };
const MODULE_LABEL: Record<string, string> = { internet: 'Internet', html: 'HTML', css: 'CSS', javascript: 'JavaScript', git: 'Git' };
const DEV_LEVEL: Record<string, string> = { JUNIOR: 'Junior', MIDDLE: 'Middle', SENIOR: 'Senior' };

const shortDate = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/** How this period compares with the one before it. */
function Trend({ now, before }: { now: number; before: number }) {
  if (!before) return now ? <span className="act-trend up">yangi faollik</span> : null;
  const change = Math.round(((now - before) / before) * 100);
  if (change === 0) return <span className="act-trend">o'zgarmadi</span>;
  return <span className={`act-trend ${change > 0 ? 'up' : 'down'}`}>{change > 0 ? '▲' : '▼'} {Math.abs(change)}%</span>;
}

function Meter({ done, total }: { done: number; total: number }) {
  return (
    <div className="act-meter">
      <i style={{ width: `${pct(done, total)}%` }} />
    </div>
  );
}

/** One card per area: answers in the period, accuracy and how far the course has got. */
export function AreaCards({ report, links }: { report: ActivityReport; links?: boolean }) {
  const { words, english, dev } = report;
  const cards = [
    {
      area: AREAS[0], data: words.answers,
      done: words.mastered, total: words.total,
      progress: words.total ? `${words.mastered} / ${words.total} so'z o'zlashtirilgan` : "Hali so'z qo'shilmagan",
      extra: `${words.learning} ta o'rganilmoqda · ${words.due} ta takrorlashda`,
    },
    {
      area: AREAS[1], data: english.answers,
      done: english.lessonsPassed, total: english.lessonsTotal,
      progress: english.level ? `${english.level}: ${english.lessonsPassed} / ${english.lessonsTotal} dars` : 'Daraja tanlanmagan',
      extra: `${english.sentences} ta gap tuzilgan · ${english.examsPassed} / ${english.exams} imtihon`,
    },
    {
      area: AREAS[2], data: dev.answers,
      done: dev.lessonsPassed, total: dev.lessonsTotal,
      progress: dev.level ? `${DEV_LEVEL[dev.level] ?? dev.level}: ${dev.lessonsPassed} / ${dev.lessonsTotal} dars` : 'Daraja tanlanmagan',
      extra: `${dev.labsDone} / ${dev.labsTotal} laboratoriya · ${dev.examsPassed} / ${dev.exams} imtihon`,
    },
  ];
  return (
    <div className="act-cards">
      {cards.map((c) => {
        const body = (
          <>
            <header>
              <span className="act-ico" aria-hidden="true">{c.area.icon}</span>
              <b>{c.area.label}</b>
              <Trend now={c.data.periodAnswered} before={c.data.previousAnswered} />
            </header>
            <div className="act-figure">
              <strong>{c.data.periodAnswered}</strong>
              <span>javob, {report.days} kunda</span>
            </div>
            <div className="act-sub">
              {c.data.answered ? `Jami ${c.data.answered} javob, ${c.data.accuracy}% to'g'ri` : 'Hali javob yo\'q'}
            </div>
            <Meter done={c.done} total={c.total} />
            <div className="act-progress">{c.progress}</div>
            <div className="act-sub">{c.extra}</div>
          </>
        );
        return links
          ? <Link key={c.area.key} to={c.area.to} className={`act-card ${c.area.key}`}>{body}</Link>
          : <div key={c.area.key} className={`act-card ${c.area.key}`}>{body}</div>;
      })}
    </div>
  );
}

/** A round number at or above the tallest column, so the axis reads cleanly. */
function niceMax(value: number): number {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value));
  return [1, 2, 4, 6, 8, 10].map((m) => m * step).find((m) => m >= value) ?? value;
}

/** Stacked columns: what was done each day, split by area. Hover or focus a day for its numbers. */
export function ActivityChart({ series, unit = 'amal' }: { series: Pick<ActivityDay, 'date' | 'words' | 'english' | 'dev'>[]; unit?: string }) {
  const [at, setAt] = useState<number | null>(null);
  const totals = series.map((d) => d.words + d.english + d.dev);
  const max = niceMax(Math.max(0, ...totals));
  const sum = (key: 'words' | 'english' | 'dev') => series.reduce((n, d) => n + d[key], 0);
  const every = Math.ceil(series.length / 8);
  const shown = at === null ? null : series[at];

  return (
    <div className="act-chart">
      <div className="act-legend">
        {AREAS.map((a) => (
          <span key={a.key}><i className={a.key} />{a.label} <b>{sum(a.key)}</b></span>
        ))}
      </div>
      <div className="act-plot" onMouseLeave={() => setAt(null)}>
        <div className="act-grid" aria-hidden="true">
          <span>{max}</span>
          <span>{max / 2}</span>
          <span>0</span>
        </div>
        <div className="act-cols">
          {series.map((d, i) => (
            <button
              key={d.date}
              type="button"
              className={`act-col ${at === i ? 'on' : ''}`}
              aria-label={`${d.date}: so'zlar ${d.words}, ingliz tili ${d.english}, dasturlash ${d.dev}`}
              onMouseEnter={() => setAt(i)}
              onFocus={() => setAt(i)}
              onBlur={() => setAt(null)}
              onClick={() => setAt(i)}
            >
              <span className="act-stack">
                {AREAS.map((a) => (d[a.key] > 0 ? <i key={a.key} className={a.key} style={{ height: `${(d[a.key] / max) * 100}%` }} /> : null))}
              </span>
              <small>{(series.length - 1 - i) % every === 0 ? shortDate(d.date) : ''}</small>
            </button>
          ))}
        </div>
        {shown && at !== null && (
          <div className="act-tip" style={{ left: `${((at + 0.5) / series.length) * 100}%`, transform: `translateX(-${((at + 0.5) / series.length) * 100}%)` }}>
            <b>{shortDate(shown.date)}: {totals[at]} {unit}</b>
            {AREAS.map((a) => (
              <span key={a.key}><i className={a.key} />{a.label}<em>{shown[a.key]}</em></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Rows({ rows }: { rows: { label: string; done: number; total: number; note?: string }[] }) {
  return (
    <ul className="act-rows">
      {rows.map((r) => (
        <li key={r.label}>
          <span>{r.label}</span>
          <Meter done={r.done} total={r.total} />
          <em>{r.done} / {r.total}{r.note ? ` · ${r.note}` : ''}</em>
        </li>
      ))}
    </ul>
  );
}

const KIND_LABEL: Record<string, string> = { LESSON: 'Dars', EXAM: 'Imtihon', LAB: 'Laboratoriya' };

/** The long view of one learner: skills, modules, hours of the day and the latest results. */
export function ActivityDetails({ report }: { report: ActivityReport }) {
  const { english, dev, hours, recent } = report;
  const busiest = Math.max(1, ...hours);
  return (
    <div className="act-details">
      <section className="b act-box english">
        <h3>Ingliz tili yo'nalishlari{english.level ? ` (${english.level})` : ''}</h3>
        {english.skills.length === 0 ? <p className="muted">Daraja hali tanlanmagan.</p> : (
          <Rows rows={english.skills.map((s) => ({ label: SKILL_LABEL[s.skill] ?? s.skill, done: s.lessonsPassed, total: s.lessonsTotal, note: s.percent === null ? undefined : `${s.percent}%` }))} />
        )}
        {english.sentences > 0 && <p className="muted">Tuzilgan gaplar: {english.sentences}, o'rtacha ball {english.sentenceScore}.</p>}
      </section>
      <section className="b act-box dev">
        <h3>Dasturlash modullari{dev.level ? ` (${DEV_LEVEL[dev.level] ?? dev.level})` : ''}</h3>
        {dev.modules.length === 0 ? <p className="muted">Daraja hali tanlanmagan.</p> : (
          <Rows rows={dev.modules.map((m) => ({ label: MODULE_LABEL[m.key] ?? m.key, done: m.passed, total: m.lessons }))} />
        )}
      </section>
      <section className="b act-box">
        <h3>Qaysi soatlarda shug'ullanadi</h3>
        <div className="act-hours">
          {hours.map((n, h) => (
            <span key={h} title={`${h}:00 dan ${h + 1}:00 gacha: ${n} amal`}>
              <i style={{ height: `${(n / busiest) * 100}%` }} />
              <small>{h % 6 === 0 ? h : ''}</small>
            </span>
          ))}
        </div>
        <p className="muted">So'nggi {report.days} kun bo'yicha.</p>
      </section>
      <section className="b act-box">
        <h3>So'nggi natijalar</h3>
        {recent.length === 0 ? <p className="muted">Hali dars yoki laboratoriya bajarilmagan.</p> : (
          <ul className="act-events">
            {recent.map((e, i) => (
              <li key={i}>
                <i className={e.area === 'DEV' ? 'dev' : 'english'} title={e.area === 'DEV' ? 'Dasturlash' : 'Ingliz tili'} />
                <div>
                  <b>{e.title}</b>
                  <small>{e.area === 'DEV' ? 'Dasturlash' : 'Ingliz tili'}, {KIND_LABEL[e.kind] ?? e.kind}, {new Date(e.at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</small>
                </div>
                <em className={e.passed ? 'ok' : 'bad'}>{e.percent === null ? '✓' : `${e.percent}%`}</em>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
