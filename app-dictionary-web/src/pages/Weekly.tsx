import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { errorMessage, statsApi, WeeklyCourse, WeeklyReport } from '../api';
import { Spinner } from '../ui';
import { shortDate } from '../util';
import { ActivityChart, AREAS } from './Activity';

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const SKILLS: [string, string][] = [['READING', "O'qish"], ['LISTENING', 'Eshitish'], ['WRITING', 'Yozish'], ['GRAMMAR', 'Grammatika']];
const MODULE_LABEL: Record<string, string> = { internet: 'Internet', html: 'HTML', css: 'CSS', javascript: 'JavaScript', git: 'Git', exam: 'Imtihon' };

type AreaKey = (typeof AREAS)[number]['key'];

const percent = (correct: number, answers: number) => (answers ? Math.round((correct / answers) * 100) : 0);

/** Difference with the week before; nothing to say when both weeks are empty. */
function Change({ now, before, unit = '' }: { now: number; before: number; unit?: string }) {
  const diff = Math.round(now - before);
  if (!now && !before) return null;
  if (!diff) return <span className="wk-change">o'tgan haftadek</span>;
  return (
    <span className={`wk-change ${diff > 0 ? 'up' : 'down'}`}>
      {diff > 0 ? '▲' : '▼'} {Math.abs(diff)}
      {unit}
    </span>
  );
}

function verdict(answers: number, before: number, accuracy: number, accuracyBefore: number, activeDays: number): string {
  if (!answers && !activeDays) return 'Bu haftada mashq qilinmagan';
  if (activeDays === 7) return "To'liq hafta: har kuni shug'ullandingiz";
  if (answers > before && accuracy >= accuracyBefore) return "Ajoyib hafta: ko'proq va aniqroq";
  if (answers > before) return "O'tgan haftadan ko'proq mashq qildingiz";
  if (accuracy > accuracyBefore) return 'Aniqligingiz oshdi';
  return "Har kuni oz-ozdan davom eting";
}

interface Direction {
  key: AreaKey;
  answers: number;
  before: number;
  correct: number;
  activeDays: number;
  daily: number[];
  empty: boolean;
  facts: { label: string; value: string }[];
  rows: { label: string; answers: number; correct: number; note?: string }[];
  rowsTitle?: string;
  start: { to: string; label: string };
}

const courseDaily = (c: WeeklyCourse) => c.days.map((d) => d.answers + d.labs);

function directions(r: WeeklyReport): Direction[] {
  const { totals, previous, english, programming } = r;
  return [
    {
      key: 'words',
      answers: totals.answers,
      before: previous.answers,
      correct: totals.correct,
      activeDays: totals.activeDays,
      daily: r.days.map((d) => d.answers),
      empty: !totals.answers && !totals.wordsAdded,
      facts: [
        { label: "yangi so'z", value: String(totals.wordsAdded) },
        { label: "mashq qilingan so'z", value: String(totals.wordsPracticed) },
        { label: 'maqsad bajarilgan kun', value: String(totals.goalDays) },
      ],
      rows: [],
      start: { to: '/study', label: 'Mashqni boshlash' },
    },
    {
      key: 'english',
      answers: english.answers,
      before: english.previous.answers,
      correct: english.correct,
      activeDays: english.activeDays,
      daily: courseDaily(english),
      empty: !english.answers,
      facts: [
        { label: 'bajarilgan dars', value: String(english.lessons) },
        { label: "o'zlashtirilgan", value: String(english.passed) },
        { label: "o'tgan hafta dars", value: String(english.previous.lessons) },
      ],
      rowsTitle: "Ko'nikmalar bo'yicha",
      rows: SKILLS.map(([key, label]) => {
        const p = english.parts.find((x) => x.key === key);
        return { label, answers: p?.answers ?? 0, correct: p?.correct ?? 0, note: p?.lessons ? `${p.lessons} dars` : undefined };
      }),
      start: { to: '/learn', label: 'Darsga o\'tish' },
    },
    {
      key: 'dev',
      answers: programming.answers,
      before: programming.previous.answers,
      correct: programming.correct,
      activeDays: programming.activeDays,
      daily: courseDaily(programming),
      empty: !programming.answers && !programming.labs,
      facts: [
        { label: 'bajarilgan dars', value: String(programming.lessons) },
        { label: "o'zlashtirilgan", value: String(programming.passed) },
        { label: 'laboratoriya', value: String(programming.labs) },
      ],
      rowsTitle: "Modullar bo'yicha",
      rows: programming.parts.map((p) => ({
        label: MODULE_LABEL[p.key] ?? p.key,
        answers: p.answers,
        correct: p.correct,
        note: p.lessons ? `${p.lessons} dars` : undefined,
      })),
      start: { to: '/frontend', label: 'Darsga o\'tish' },
    },
  ];
}

function DirectionCard({ d }: { d: Direction }) {
  const area = AREAS.find((a) => a.key === d.key)!;
  const max = Math.max(1, ...d.daily);
  return (
    <section className={`wk-dir ${d.key}`} aria-label={area.label}>
      <header>
        <span className="wk-dir-ico" aria-hidden="true">{area.icon}</span>
        <h2>{area.label}</h2>
        <Change now={d.answers} before={d.before} />
      </header>

      {d.empty ? (
        <div className="wk-empty">
          <p>Bu haftada bu yo'nalishda mashq qilinmagan.</p>
          <Link to={d.start.to}>{d.start.label}</Link>
        </div>
      ) : (
        <>
          <div className="wk-main">
            <div>
              <strong>{d.answers}</strong>
              <span>javob</span>
            </div>
            <div>
              <strong>{d.answers ? `${percent(d.correct, d.answers)}%` : '—'}</strong>
              <span>aniqlik</span>
            </div>
            <div>
              <strong>{d.activeDays}<small>/7</small></strong>
              <span>faol kun</span>
            </div>
          </div>

          <div className="wk-spark" role="img" aria-label={`Kunlar bo'yicha: ${d.daily.map((n, i) => `${WEEKDAYS[i]} ${n}`).join(', ')}`}>
            {d.daily.map((n, i) => (
              <span key={i} title={`${WEEKDAYS[i]}: ${n}`}>
                <span><i className={n ? '' : 'none'} style={{ height: n ? `${Math.max(12, (n / max) * 100)}%` : 4 }} /></span>
                <small>{WEEKDAYS[i]}</small>
              </span>
            ))}
          </div>

          <ul className="wk-facts">
            {d.facts.map((f) => (
              <li key={f.label}>
                <span>{f.label}</span>
                <b>{f.value}</b>
              </li>
            ))}
          </ul>

          {d.rows.length > 0 && (
            <div className="wk-parts">
              <h3>{d.rowsTitle}</h3>
              {d.rows.map((row) => (
                <div key={row.label} className={`wk-part ${row.answers ? '' : 'idle'}`}>
                  <div>
                    <span>{row.label}</span>
                    <em>{row.answers ? `${row.correct} / ${row.answers}${row.note ? `, ${row.note}` : ''}` : "mashq yo'q"}</em>
                    <b>{row.answers ? `${percent(row.correct, row.answers)}%` : ''}</b>
                  </div>
                  <div className="wk-meter"><i style={{ width: `${percent(row.correct, row.answers)}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Report({ report }: { report: WeeklyReport }) {
  const dirs = directions(report);
  const { totals, previous, english, programming } = report;
  const answers = dirs.reduce((n, d) => n + d.answers, 0);
  const before = dirs.reduce((n, d) => n + d.before, 0);
  const correct = dirs.reduce((n, d) => n + d.correct, 0);
  const correctBefore = previous.correct
    + Math.round((english.previous.answers * english.previous.accuracyPercent) / 100)
    + Math.round((programming.previous.answers * programming.previous.accuracyPercent) / 100);
  const accuracy = percent(correct, answers);
  const accuracyBefore = percent(correctBefore, before);
  // A day counts once, however many directions were practised on it.
  const active = report.days.map((_, i) => dirs.filter((d) => d.daily[i] > 0 || (d.key === 'words' && report.days[i].wordsAdded > 0)));
  const activeDays = active.filter((a) => a.length > 0).length;
  const series = report.days.map((d, i) => ({ date: d.date, words: dirs[0].daily[i], english: dirs[1].daily[i], dev: dirs[2].daily[i] }));

  return (
    <>
      <section className="wk-hero">
        <h2>{verdict(answers, before, accuracy, accuracyBefore, activeDays)}</h2>
        <div className="wk-totals">
          <div>
            <span>Jami javob</span>
            <strong>{answers}</strong>
            <Change now={answers} before={before} />
          </div>
          <div>
            <span>Aniqlik</span>
            <strong>{answers ? `${accuracy}%` : '—'}</strong>
            {answers > 0 && before > 0 && <Change now={accuracy} before={accuracyBefore} unit="%" />}
          </div>
          <div>
            <span>Faol kunlar</span>
            <strong>{activeDays}<small>/7</small></strong>
          </div>
          <div>
            <span>XP</span>
            <strong>{totals.xp}</strong>
            <Change now={totals.xp} before={previous.xp} />
          </div>
        </div>
        <ol className="wk-days">
          {report.days.map((d, i) => (
            <li key={d.date} className={active[i].length ? 'on' : ''}>
              <small>{WEEKDAYS[i]}</small>
              <b>{Number(d.date.slice(8, 10))}</b>
              <span aria-label={active[i].map((x) => AREAS.find((a) => a.key === x.key)!.label).join(', ') || "mashq yo'q"}>
                {active[i].map((x) => <i key={x.key} className={x.key} />)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wk-chart">
        <div>
          <h2>Kunlar bo'yicha</h2>
          <p>Javoblar soni. Dasturlashda yechilgan laboratoriyalar ham qo'shiladi.</p>
        </div>
        <ActivityChart series={series} />
      </section>

      <div className="wk-dirs">
        {dirs.map((d) => <DirectionCard key={d.key} d={d} />)}
      </div>
    </>
  );
}

export function WeeklyPage() {
  const nav = useNavigate();
  const [weeksBack, setWeeksBack] = useState(0);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let stale = false;
    setReport(null);
    setError('');
    statsApi
      .weekly(weeksBack)
      .then((r) => !stale && setReport(r))
      .catch((e) => !stale && setError(errorMessage(e, "Hisobotni yuklab bo'lmadi")));
    return () => { stale = true; };
  }, [weeksBack]);

  return (
    <div className="wk">
      <header className="wk-top">
        <button className="st-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <h1 className="dx-title">Haftalik hisobot</h1>
        <div className="wk-switch">
          <button onClick={() => setWeeksBack(weeksBack + 1)} aria-label="Oldingi hafta">‹</button>
          <div aria-live="polite">
            <b>{weeksBack === 0 ? 'Shu hafta' : weeksBack === 1 ? "O'tgan hafta" : `${weeksBack} hafta oldin`}</b>
            <small>{report ? `${shortDate(report.weekStart)} – ${shortDate(report.weekEnd)}` : ' '}</small>
          </div>
          <button onClick={() => setWeeksBack(weeksBack - 1)} disabled={weeksBack === 0} aria-label="Keyingi hafta">›</button>
        </div>
      </header>
      {report ? <Report report={report} /> : error ? <p className="muted center">{error}</p> : <Spinner />}
    </div>
  );
}
