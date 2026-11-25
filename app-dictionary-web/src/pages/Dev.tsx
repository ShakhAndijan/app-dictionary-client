import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DevExamQuestion,
  DevExamResult,
  DevFinish,
  DevLessonDetail,
  DevLessonSummary,
  DevLevel,
  DevOverview,
  devApi,
  errorMessage,
  errorStatus,
} from '../api';
import { Button, Card, Notice, PageHeader, ProgressBar, Spinner } from '../ui';
import { requestProgressCheck } from '../util';
import { GameResult } from './StudyGames';
import { ExerciseCard, Gauge, Steps } from './Learn';
import { PLAN, PLAN_GROUPS } from './devPlan';
import { DevLabs } from './DevLabs';

/* ------------------------------------------------------------------ content shapes */

interface Section {
  heading?: string;
  text?: string;
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
  code?: { lang: string; text: string };
  flow?: string[];
  callout?: { kind: 'tip' | 'warn' | 'info'; text: string };
  defs?: { term: string; text: string }[];
  life?: { icon: string; title: string; text: string }[];
  mistakes?: [wrong: string, right: string, note: string][];
}

interface DevTheoryData {
  analogy?: { icon: string; title: string; text: string };
  sections: Section[];
  recap: string[];
}

interface Practice {
  title: string;
  text: string;
  cmd?: string;
}

function parseJson<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const LEVEL_META: Record<DevLevel, { title: string; icon: string; tone: string; tone2: string; about: string; goals: string[] }> = {
  JUNIOR: {
    title: 'Junior',
    icon: '🌱',
    tone: '#10b981',
    tone2: '#34d399',
    about: "Asoslarni o'rganasiz: nima nima bilan bog'liq va qanday ishlaydi.",
    goals: ['Atamalarni tushunish', "Oddiy so'rov va javobni o'qish", 'Sayt qanday ochilishini aytib berish'],
  },
  MIDDLE: {
    title: 'Middle',
    icon: '🚀',
    tone: '#6366f1',
    tone2: '#a855f7',
    about: "Amaliyotga o'tasiz: sabab-oqibatni ko'rib, muammolarni o'zingiz hal qilasiz.",
    goals: ['Kesh, cookie, CORS, HTTPS', 'Sekinlik sababini topish', 'Deploy va sozlash'],
  },
  SENIOR: {
    title: 'Senior',
    icon: '🏔️',
    tone: '#f59e0b',
    tone2: '#f97316',
    about: "Arxitektura darajasi: trafik, narx va ishonchlilikka qarab qaror qilasiz.",
    goals: ["Arxitektura tanlash", 'Optimizatsiya va xavfsizlik', 'Jamoaga yo\'l ko\'rsatish'],
  },
};

interface ModuleMeta {
  key: string;
  icon: string;
  title: string;
  sub: string;
  topics: string[];
  ready: boolean;
}

// Modules with written lessons; every other plan module only shows its topic names for now.
const READY = new Set(['internet', 'html', 'css', 'javascript', 'git']);
const MODULES: ModuleMeta[] = PLAN.map((m) => ({
  key: m.key,
  icon: m.icon,
  title: m.title,
  sub: `${m.topics.length} mavzu · ${m.src}`,
  topics: m.topics.slice(0, 3),
  ready: READY.has(m.key),
}));

/* ------------------------------------------------------------------ theory renderer */

const CALLOUT_ICON = { tip: '💡', warn: '⚠️', info: 'ℹ️' } as const;

function Cell({ text }: { text: string }) {
  return <>{text}</>;
}

function SectionView({ s }: { s: Section }) {
  return (
    <div className="dv-sec">
      {s.heading && <h3 className="dv-h">{s.heading}</h3>}
      {s.text && <p className="dv-p">{s.text}</p>}
      {s.bullets && (
        <ul className="dv-list">
          {s.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {s.flow && (
        <div className="dv-flow" role="list">
          {s.flow.map((f, i) => (
            <span key={f + i} className="dv-flow-item" role="listitem">
              {/^[←→]|[←→]$/.test(f.trim()) ? <em>{f}</em> : <b>{f}</b>}
              {i < s.flow!.length - 1 && !/[←→]/.test(f) && !/[←→]/.test(s.flow![i + 1]) && <i aria-hidden="true">→</i>}
            </span>
          ))}
        </div>
      )}
      {s.table && (
        <div className="dv-table-wrap">
          <table className="dv-table">
            <thead>
              <tr>
                {s.table.head.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Cell text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.defs && (
        <div className="dv-defs">
          {s.defs.map((d) => (
            <div className="dv-def" key={d.term}>
              <b>{d.term}</b>
              <p>{d.text}</p>
            </div>
          ))}
        </div>
      )}
      {s.life && (
        <div className="dv-lives">
          {s.life.map((l) => (
            <div className="dv-life" key={l.title}>
              <span className="dv-life-ic">{l.icon}</span>
              <div>
                <b>{l.title}</b>
                <p>{l.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {s.code && <CodeBlock lang={s.code.lang} text={s.code.text} />}
      {s.mistakes && (
        <div className="th-errs">
          {s.mistakes.map(([wrong, right, note]) => (
            <div key={wrong} className="th-err">
              <div className="th-wrong">✗ {wrong}</div>
              <div className="th-right">✓ {right}</div>
              <small>{note}</small>
            </div>
          ))}
        </div>
      )}
      {s.callout && (
        <div className={`dv-callout ${s.callout.kind}`}>
          <span>{CALLOUT_ICON[s.callout.kind]}</span>
          <p>{s.callout.text}</p>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ lang, text }: { lang: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }).catch(() => undefined);
  };
  return (
    <div className="dv-code">
      <div className="dv-code-bar">
        <span>{lang}</span>
        <button type="button" onClick={copy}>{copied ? 'Nusxalandi ✓' : 'Nusxalash'}</button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}

function TheoryView({ data }: { data: DevTheoryData }) {
  return (
    <div className="dv-theory">
      {data.analogy && (
        <div className="dv-analogy">
          <span className="dv-analogy-ico">{data.analogy.icon}</span>
          <div>
            <small>Hayotiy o'xshatish</small>
            <b>{data.analogy.title}</b>
            <p>{data.analogy.text}</p>
          </div>
        </div>
      )}
      {data.sections.map((s, i) => (
        <SectionView key={i} s={s} />
      ))}
      {data.recap.length > 0 && (
        <div className="dv-recap">
          <h3>Xulosa</h3>
          <ul>
            {data.recap.map((r) => (
              <li key={r}>
                <span>✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PracticeView({ tasks }: { tasks: Practice[] }) {
  const [done, setDone] = useState<boolean[]>([]);
  if (tasks.length === 0) return null;
  return (
    <div className="dv-practice">
      <h3>🛠 Amaliy topshiriq</h3>
      <p className="dv-practice-sub">Shuni o'zingiz kompyuteringizda bajarib ko'ring: ko'rib o'rganilgan mavzu ancha tez o'zlashadi.</p>
      {tasks.map((t, i) => (
        <label key={t.title} className={`dv-task ${done[i] ? 'done' : ''}`}>
          <input type="checkbox" checked={!!done[i]} onChange={() => setDone((p) => { const n = [...p]; n[i] = !n[i]; return n; })} />
          <span className="dv-task-box" aria-hidden="true">✓</span>
          <span className="dv-task-body">
            <b>{t.title}</b>
            <span>{t.text}</span>
            {t.cmd && <code>{t.cmd}</code>}
          </span>
        </label>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ level picker */

function LevelPicker({ ov, onPick, onCancel }: { ov: DevOverview; onPick: (l: DevLevel) => void; onCancel?: () => void }) {
  return (
    <div className="dv-levels">
      <header className="dv-hero rise">
        <div className="eyebrow">Frontend</div>
        <h1 className="dx-title">Darajangizni tanlang</h1>
        <p>Savollar va imtihon tanlangan darajaga qarab tuziladi. Imtihondan kerakli ball to'plasangiz, keyingi darajaga o'tasiz.</p>
      </header>
      <div className="dv-level-grid">
        {ov.levels.map((l, i) => {
          const m = LEVEL_META[l.level];
          return (
            <button
              key={l.level}
              className={`dv-level rise ${ov.level === l.level ? 'on' : ''}`}
              style={{ ['--tone' as string]: m.tone, ['--tone2' as string]: m.tone2, ['--d' as string]: `${0.05 + i * 0.07}s` }}
              onClick={() => onPick(l.level)}
            >
              <span className="dv-level-ico">{m.icon}</span>
              <b>{m.title}</b>
              {!l.ready && <em className="dr-soon-tag">Tez orada</em>}
              <small>{m.about}</small>
              <ul>
                {m.goals.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              <span className="dv-level-go">{l.ready ? `${l.lessons} ta dars` : 'Tez orada ochiladi'}</span>
            </button>
          );
        })}
      </div>
      {onCancel && (
        <Button variant="ghost" onClick={onCancel}>
          Bekor qilish
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ home */

export function DevPage() {
  const navigate = useNavigate();
  const [ov, setOv] = useState<DevOverview | null>(null);
  const [error, setError] = useState('');
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    devApi.overview().then(setOv).catch((e) => setError(errorMessage(e, "Kursni yuklab bo'lmadi")));
  }, []);

  if (!ov) return error ? <Notice>{error}</Notice> : <Spinner />;

  const pick = async (level: DevLevel) => {
    try {
      setOv(await devApi.setLevel(level));
      setPicking(false);
    } catch (e) {
      setError(errorMessage(e, "Darajani saqlab bo'lmadi"));
    }
  };

  if (!ov.level || picking) return <LevelPicker ov={ov} onPick={pick} onCancel={ov.level ? () => setPicking(false) : undefined} />;

  const meta = LEVEL_META[ov.level];
  const ready = ov.levels.find((l) => l.level === ov.level)?.ready ?? false;

  return (
    <div className="dv">
      <header className="dv-hero rise" style={{ ['--tone' as string]: meta.tone, ['--tone2' as string]: meta.tone2 }}>
        <div className="dv-hero-txt">
          <div className="eyebrow">Frontend yo'li</div>
          <h1 className="dx-title">Frontend dasturchi bo'ling</h1>
          <button className="dv-chip" onClick={() => setPicking(true)}>
            <span>{meta.icon}</span>
            <b>{meta.title}</b>
            <em>darajani o'zgartirish</em>
          </button>
        </div>
        {ready && (
          <div className="dv-meter" aria-label={`${ov.percent}%`}>
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <circle cx="22" cy="22" r="18" className="dr-meter-bg" />
              <circle cx="22" cy="22" r="18" className="dv-meter-fg" style={{ strokeDasharray: `${(ov.percent / 100) * 113.1} 113.1` }} />
            </svg>
            <b>{ov.percent}<small>%</small></b>
          </div>
        )}
      </header>
      {error && <Notice>{error}</Notice>}

      {!ready ? (
        <Card className="dv-soon rise">
          <span className="dv-level-ico">{meta.icon}</span>
          <h2>{meta.title} darajasi tez orada</h2>
          <p>Bu daraja uchun darslar tayyorlanmoqda. Hozircha Junior darajasidan boshlashingiz mumkin.</p>
          <Button onClick={() => pick('JUNIOR')}>Junior darajasiga o'tish</Button>
        </Card>
      ) : (
        <>
          <h2 className="dv-title2">Mavzular</h2>
          {PLAN_GROUPS.map((g) => (
            <section key={g.title} className="dv-group">
              <h3 className="dv-group-t">{g.title}</h3>
              <div className="dv-mods">
            {MODULES.filter((m) => g.keys.includes(m.key)).map((m, i) => {
              const info = ov.modules.find((x) => x.key === m.key);
              const pct = info ? Math.round((info.passed / Math.max(1, info.lessons)) * 100) : 0;
              const open = m.ready && !!info;
              return (
                <button
                  key={m.key}
                  className={`dv-mod rise ${open ? '' : 'soon'}`}
                  style={{ ['--d' as string]: `${0.05 + i * 0.06}s` }}
                  onClick={() => navigate(`/frontend/${m.key}`)}
                >
                  <span className="dv-mod-ico">{m.icon}</span>
                  <b>{m.title}</b>
                  <small>{m.sub}</small>
                  <span className="dr-perks">
                    {m.topics.map((t) => (
                      <i key={t}>{t}</i>
                    ))}
                  </span>
                  {open && info ? (
                    <span className="dv-mod-foot">
                      <ProgressBar pct={pct} color={meta.tone} />
                      <em>{info.passed} / {info.lessons} dars</em>
                    </span>
                  ) : (
                    <em className="dr-soon-tag">Tez orada</em>
                  )}
                </button>
              );
            })}
              </div>
            </section>
          ))}
          <ExamCard ov={ov} onGo={() => navigate('/frontend/exam')} />
        </>
      )}
    </div>
  );
}

function ExamCard({ ov, onGo }: { ov: DevOverview; onGo: () => void }) {
  const meta = LEVEL_META[ov.level!];
  const next = ov.level === 'JUNIOR' ? 'Middle' : ov.level === 'MIDDLE' ? 'Senior' : null;
  return (
    <button className={`dv-exam rise ${ov.examUnlocked ? '' : 'locked'}`} disabled={!ov.examUnlocked} onClick={onGo} style={{ ['--tone' as string]: meta.tone }}>
      <span className="dv-exam-ico">{ov.examUnlocked ? '🎓' : '🔒'}</span>
      <span className="dv-exam-txt">
        <b>{meta.title} darajasi imtihoni</b>
        <small>
          {ov.examUnlocked
            ? `${ov.examPassMark}% dan yuqori natija ${next ? `sizni ${next} darajaga o'tkazadi` : 'darajani yakunlaydi'}`
            : `Barcha darslarni o'zlashtiring (${ov.passed} / ${ov.total}), keyin imtihon ochiladi`}
          {ov.lastExam && ` · Oxirgi natija: ${ov.lastExam.percent}%`}
        </small>
      </span>
      {ov.examUnlocked && <span className="dv-exam-go">→</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ module page */

export function DevModulePage() {
  const { module = '' } = useParams();
  const navigate = useNavigate();
  const [ov, setOv] = useState<DevOverview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    devApi.overview().then(setOv).catch((e) => setError(errorMessage(e, "Darslarni yuklab bo'lmadi")));
  }, []);

  if (!ov) return error ? <Notice>{error}</Notice> : <Spinner />;
  const meta = MODULES.find((m) => m.key === module);
  const lessons = ov.lessons.filter((l) => l.module === module);
  const level = ov.level ? LEVEL_META[ov.level] : null;
  const plan = PLAN.find((m) => m.key === module);
  if (plan && meta && level && lessons.length === 0) {
    return (
      <div className="dv">
        <header className="dv-hero rise" style={{ ['--tone' as string]: level.tone, ['--tone2' as string]: level.tone2 }}>
          <button className="gp-back" onClick={() => navigate('/frontend')} aria-label="Orqaga">←</button>
          <div className="dv-hero-txt">
            <div className="eyebrow">{level.title} · {plan.days} kunlik reja{plan.star ? ' · ⭐ asosiy' : ''}</div>
            <h1 className="dx-title">{plan.icon} {plan.title}</h1>
            <p>Manba: {plan.src}</p>
          </div>
        </header>
        <Notice kind="info">Darslar tayyorlanmoqda. Mavzular rejasi quyida.</Notice>
        <ol className="dv-lessons">
          {plan.topics.map((t, i) => (
            <li key={t} className="rise" style={{ ['--d' as string]: `${Math.min(i, 10) * 0.03}s` }}>
              <div className="dv-lesson plan">
                <span className="dv-lesson-no">{i + 1}</span>
                <span className="dv-lesson-txt"><b>{t}</b></span>
                <span className="dv-lesson-go">Tez orada</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (!meta || lessons.length === 0 || !level) {
    return (
      <>
        <PageHeader title="Mavzu" back={() => navigate('/frontend')} />
        <Notice kind="info">Bu mavzu uchun darslar hali yo'q.</Notice>
      </>
    );
  }
  // The first lesson not passed yet is the one to continue with.
  const nextCode = lessons.find((l) => !l.passed)?.code;

  return (
    <div className="dv">
      <header className="dv-hero rise" style={{ ['--tone' as string]: level.tone, ['--tone2' as string]: level.tone2 }}>
        <button className="gp-back" onClick={() => navigate('/frontend')} aria-label="Orqaga">←</button>
        <div className="dv-hero-txt">
          <div className="eyebrow">{level.title} · {meta.title}</div>
          <h1 className="dx-title">{meta.icon} {meta.title}</h1>
          <p>{meta.sub}</p>
        </div>
      </header>
      {error && <Notice>{error}</Notice>}
      <ol className="dv-lessons">
        {lessons.map((l, i) => (
          <LessonRow key={l.code} l={l} delay={i} next={l.code === nextCode} tone={level.tone} onOpen={() => navigate(`/frontend/lesson/${l.code}`)} />
        ))}
      </ol>
      <ExamCard ov={ov} onGo={() => navigate('/frontend/exam')} />
    </div>
  );
}

function LessonRow({ l, next, delay, tone, onOpen }: { l: DevLessonSummary; next: boolean; delay: number; tone: string; onOpen: () => void }) {
  return (
    <li className="rise" style={{ ['--d' as string]: `${Math.min(delay, 10) * 0.03}s` }}>
      <button className={`dv-lesson ${l.passed ? 'passed' : ''} ${next ? 'next' : ''}`} style={{ ['--tone' as string]: tone }} onClick={onOpen}>
        <span className="dv-lesson-no">{l.passed ? '✓' : l.unit}</span>
        <span className="dv-lesson-txt">
          <b>{l.title}</b>
          {l.intro && <small>{l.intro}</small>}
        </span>
        <span className="dv-lesson-meta">
          {l.bestScore !== null && <em className={l.passed ? 'ok' : 'low'}>{l.bestScore}%</em>}
          <i>{l.itemCount} mashq{l.labCount > 0 ? ` · 🧪 ${l.labsDone}/${l.labCount}` : ''}</i>
        </span>
        <span className="dv-lesson-go">{next ? 'Davom etish' : '→'}</span>
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ lesson */

export function DevLessonPage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<DevLessonDetail | null>(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState<'theory' | 'play' | 'done' | 'lab'>('theory');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ itemId: string; answer: string }[]>([]);
  const [marks, setMarks] = useState<(boolean | undefined)[]>([]);
  const [result, setResult] = useState<DevFinish | null>(null);

  useEffect(() => {
    devApi.lesson(code).then(setLesson).catch((e) => setError(errorMessage(e, "Darsni yuklab bo'lmadi")));
  }, [code]);

  if (!lesson) return error ? <Notice>{error}</Notice> : <Spinner />;
  const exit = () => navigate(`/frontend/${lesson.module}`);
  const labsDone = lesson.labsDone.length;

  const restart = () => {
    setIndex(0);
    setAnswers([]);
    setMarks([]);
    setResult(null);
    setStage('play');
  };

  const finishWith = async (next: { itemId: string; answer: string }[]) => {
    setAnswers(next);
    try {
      setResult(await devApi.finish(lesson.code, next));
      setStage('done');
      requestProgressCheck();
    } catch (e) {
      setError(errorMessage(e, "Natijani saqlab bo'lmadi"));
    }
  };

  const done = async (answer: string) => {
    const next = [...answers, { itemId: lesson.items[index].id, answer }];
    if (index + 1 < lesson.items.length) {
      setAnswers(next);
      setIndex(index + 1);
      return;
    }
    await finishWith(next);
  };

  const labCard = lesson.labs.length > 0 && (
    <Card className="dv-start dv-labcard rise">
      <b>🧪 Laboratoriya</b>
      <p>{lesson.labs.length} ta amaliy topshiriq: {lesson.labs[0].kind === 'css' ? 'CSS stillarini' : lesson.labs[0].kind === 'git' ? 'git buyruqlarini' : 'JavaScript kodini'} o'zingiz yozasiz, tizim to'g'riligini tekshiradi · bajarildi: {labsDone}/{lesson.labs.length}</p>
      <Button variant="outline" block onClick={() => setStage('lab')}>{labsDone > 0 ? 'Laboratoriyani davom ettirish' : 'Laboratoriyani boshlash'}</Button>
    </Card>
  );

  if (stage === 'lab') {
    return (
      <DevLabs
        lessonCode={lesson.code}
        title={lesson.title}
        labs={lesson.labs}
        doneIds={lesson.labsDone}
        onBack={() => {
          devApi.lesson(code).then(setLesson).catch(() => undefined);
          setStage(result ? 'done' : 'theory');
        }}
      />
    );
  }

  if (stage === 'theory') {
    const theory = parseJson<DevTheoryData>(lesson.theory);
    const practice = parseJson<Practice[]>(lesson.practice) ?? [];
    return (
      <div className="dv dv-read">
        <PageHeader title={lesson.title} back={exit} />
        <div className="dv-lesson-head rise">
          <span className="dr-soon-badge" style={{ background: '#6366f126', color: 'var(--primary)' }}>{lesson.level}</span>
          {lesson.intro && <p>{lesson.intro}</p>}
        </div>
        {theory && <TheoryView data={theory} />}
        <PracticeView tasks={practice} />
        <Card className="dv-start rise">
          <p>{lesson.items.length} ta mashq · 70% va undan yuqori natija darsni o'zlashtiradi</p>
          <Button block onClick={() => setStage('play')}>Mavzuni tushundim: mashqlarni boshlash</Button>
        </Card>
        {labCard}
      </div>
    );
  }

  if (stage === 'done' && result) {
    const wrong = result.results.filter((r) => !r.correct);
    return (
      <>
        <GameResult
          icon={result.passed ? '🏆' : '📚'}
          title={result.passed ? "Dars o'zlashtirildi!" : "Yana urinib ko'ring"}
          value={result.score}
          valueSuffix="%"
          unit={`${result.total} ta mashqdan ${result.correct} tasi to'g'ri`}
          tone={result.passed ? '#10b981' : '#f59e0b'}
          celebrate={result.passed}
          againLabel="Qayta bajarish"
          exitLabel="Darslarga qaytish"
          stats={[
            { label: "To'g'ri", value: String(result.correct) },
            { label: 'Xato', value: String(result.total - result.correct) },
          ]}
          onAgain={restart}
          onExit={exit}
        />
        {labCard}
        {wrong.length > 0 && (
          <Card className="lr-review">
            <h3>Xatolar ustida ishlang</h3>
            {wrong.map((r) => {
              const it = lesson.items.find((i) => i.id === r.itemId);
              return (
                <div key={r.itemId} className="lr-review-row">
                  <span>{it?.prompt}</span>
                  <b>{r.answer.replace(/ /g, ' ')}</b>
                  {r.explain && <small>{r.explain}</small>}
                </div>
              );
            })}
          </Card>
        )}
      </>
    );
  }

  const item = lesson.items[index];
  return (
    <div className="dv-play">
      <header className="qx-top">
        <button className="gp-back" onClick={exit} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>🌐 {lesson.level}</small>
          <b>{lesson.title}</b>
        </div>
        <div className="qx-pills"><span className="qx-pill">{index + 1} / {lesson.items.length}</span></div>
      </header>
      <Steps total={lesson.items.length} index={index} marks={marks} />
      {error && <Notice>{error}</Notice>}
      <ExerciseCard
        key={item.id}
        item={item}
        last={index + 1 === lesson.items.length}
        instant={(answer) => devApi.check(lesson.code, item.id, answer)}
        onDone={done}
        onChecked={(ok) => setMarks((p) => { const n = [...p]; n[index] = ok; return n; })}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ exam */

export function DevExamPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<DevExamQuestion[] | null>(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ ref: string; answer: string }[]>([]);
  const [result, setResult] = useState<DevExamResult | null>(null);

  const start = () => {
    setQuestions(null);
    setIndex(0);
    setAnswers([]);
    setResult(null);
    setError('');
    devApi
      .exam()
      .then(setQuestions)
      .catch((e) => setError(errorStatus(e) === 409 ? "Imtihon hali ochilmagan: avval barcha darslarni o'zlashtiring." : errorMessage(e, "Imtihonni yuklab bo'lmadi")));
  };

  useEffect(start, []);
  const exit = () => navigate('/frontend');

  if (error) {
    return (
      <>
        <PageHeader title="Daraja imtihoni" back={exit} />
        <Notice>{error}</Notice>
      </>
    );
  }
  if (!questions) return <Spinner />;

  if (result) {
    const wrong = result.review.filter((r) => !r.correct);
    const levelName = result.newLevel ? LEVEL_META[result.newLevel].title : '';
    return (
      <>
        <GameResult
          icon={result.passed ? '🎓' : '📚'}
          title={result.passed ? (result.newLevel ? `Tabriklaymiz! Endi ${levelName} daraja` : "Imtihondan o'tdingiz!") : "Imtihondan o'tolmadingiz"}
          value={result.percent}
          valueSuffix="%"
          unit={result.passed ? `O'tish balli: ${result.passMark}%` : `O'tish uchun kamida ${result.passMark}% kerak. Darslarni takrorlab, qayta urinib ko'ring`}
          tone={result.passed ? '#10b981' : '#f59e0b'}
          celebrate={result.passed}
          againLabel={result.passed ? 'Davom etish' : 'Qayta topshirish'}
          exitLabel="Kursga qaytish"
          stats={[{ label: "To'g'ri", value: String(result.correct) }, { label: 'Savol', value: String(result.total) }]}
          onAgain={result.passed ? exit : start}
          onExit={exit}
        />
        {wrong.length > 0 && (
          <Card className="lr-review">
            <h3>Xatolar ustida ishlang</h3>
            {wrong.map((r) => {
              const q = questions.find((x) => x.ref === r.ref);
              return (
                <div key={r.ref} className="lr-review-row">
                  <span>{q?.prompt}</span>
                  <b>{r.answer.replace(/ /g, ' ')}</b>
                  {r.explain && <small>{r.explain}</small>}
                </div>
              );
            })}
          </Card>
        )}
      </>
    );
  }

  const q = questions[index];
  const finish = async (all: { ref: string; answer: string }[]) => {
    try {
      setResult(await devApi.submitExam(all));
      requestProgressCheck();
    } catch (e) {
      setError(errorMessage(e, "Natijani yuborib bo'lmadi"));
    }
  };
  const next = (answer: string) => {
    const all = [...answers, { ref: q.ref, answer }];
    setAnswers(all);
    if (index + 1 < questions.length) setIndex(index + 1);
    else finish(all);
  };

  return (
    <div className="dv-play">
      <header className="qx-top">
        <button className="gp-back" onClick={exit} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>🎓 Frontend</small>
          <b>Daraja imtihoni</b>
        </div>
        <div className="qx-pills"><span className="qx-pill">{index + 1} / {questions.length}</span></div>
      </header>
      <Steps total={questions.length} index={index} />
      <ExerciseCard key={q.ref} item={q} last={index + 1 === questions.length} onDone={next} />
    </div>
  );
}

/* ------------------------------------------------------------------ statistics tab */

/** `load` and `readOnly` let the admin see another learner's progress, without course links. */
export function DevStats({ load = devApi.overview, readOnly = false }: { load?: () => Promise<DevOverview>; readOnly?: boolean } = {}) {
  const navigate = useNavigate();
  const [ov, setOv] = useState<DevOverview | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    load().then((o) => {
      setOv(o);
      setOpen(o.modules.find((m) => m.lessons > 0)?.key ?? null);
    }).catch((e) => setError(errorMessage(e, "Statistikani yuklab bo'lmadi")));
  }, []);

  if (!ov) return error ? <Notice>{error}</Notice> : <Spinner />;
  if (!ov.level) {
    return (
      <Card className="rise lr-es-empty">
        <span className="lr-es-bigicon">💻</span>
        <b>Dasturlash kursi hali boshlanmagan</b>
        {!readOnly && <p>Darajangizni tanlang va birinchi darsni bajaring, shundan keyin bu yerda natijalar paydo bo'ladi.</p>}
        {!readOnly && <Button onClick={() => navigate('/frontend')}>Kursga o'tish</Button>}
      </Card>
    );
  }
  const meta = LEVEL_META[ov.level];
  const scored = ov.lessons.filter((l) => l.bestScore !== null);
  const avgOf = (list: DevLessonSummary[]) => {
    const s = list.filter((l) => l.bestScore !== null);
    return s.length ? Math.round(s.reduce((a, l) => a + (l.bestScore ?? 0), 0) / s.length) : null;
  };
  const avg = avgOf(ov.lessons);
  const best = scored.length ? Math.max(...scored.map((l) => l.bestScore ?? 0)) : null;
  const mods = ov.modules.filter((m) => m.lessons > 0);
  const sel = mods.find((m) => m.key === open) ?? null;

  return (
    <>
      <section className="lr-es-hero rise">
        <Gauge pct={ov.percent} tone={meta.tone} size={112}>
          <b>{ov.percent}%</b>
          <small>daraja</small>
        </Gauge>
        <div className="lr-es-hero-main">
          <div className="lr-es-hero-top">
            <span className="lr-es-lvl">{meta.icon}</span>
            <div>
              <b>{meta.title} darajasi</b>
              <small>{ov.passed} / {ov.total} dars o'zlashtirilgan</small>
            </div>
          </div>
          <div className="lr-es-nums">
            <div><span>✅</span><b>{ov.passed}</b><small>dars</small></div>
            <div><span>🎯</span><b>{avg == null ? '—' : avg + '%'}</b><small>o'rtacha</small></div>
            <div><span>🏆</span><b>{best == null ? '—' : best + '%'}</b><small>eng yaxshi</small></div>
            <div><span>🎓</span><b>{ov.lastExam ? ov.lastExam.percent + '%' : '—'}</b><small>imtihon</small></div>
          </div>
        </div>
      </section>

      <div className="lr-es-gauges rise">
        {mods.map((m) => {
          const p = PLAN.find((x) => x.key === m.key);
          const pct = Math.round((m.passed / Math.max(1, m.lessons)) * 100);
          return (
            <button key={m.key} className={`lr-es-gcard ${open === m.key ? 'on' : ''}`} style={{ ['--tone' as string]: meta.tone }} onClick={() => setOpen(m.key)}>
              <Gauge pct={pct} tone={meta.tone} size={78}><span className="lr-g-ico">{p?.icon}</span></Gauge>
              <b>{p?.title ?? m.key}</b>
              <em>{pct}%</em>
              <small>{m.passed}/{m.lessons} dars</small>
            </button>
          );
        })}
      </div>

      {sel && (() => {
        const p = PLAN.find((x) => x.key === sel.key);
        const lessons = ov.lessons.filter((l) => l.module === sel.key);
        const mAvg = avgOf(lessons);
        const pct = Math.round((sel.passed / Math.max(1, sel.lessons)) * 100);
        const weak = lessons.filter((l) => l.bestScore !== null && (l.bestScore ?? 0) < 85).sort((a, b) => (a.bestScore ?? 0) - (b.bestScore ?? 0));
        return (
          <Card key={sel.key} className="lr-es-detail rise" style={{ ['--tone' as string]: meta.tone }}>
            <header className="lr-es-skill-head">
              <span className="lr-es-skill-ico">{p?.icon}</span>
              <div><b>{p?.title}</b><small>{sel.passed} / {sel.lessons} dars o'zlashtirilgan</small></div>
            </header>
            {mAvg === null ? (
              <div className="lr-es-startbox">
                <p>Bu mavzu bo'yicha hali dars bajarilmagan.</p>
                {!readOnly && <Button onClick={() => navigate(`/frontend/${sel.key}`)}>Boshlash →</Button>}
              </div>
            ) : (
              <>
                <div className="lr-es-triple">
                  <div><Gauge pct={pct} tone={meta.tone} size={74}><b>{pct}%</b></Gauge><small>Darslar</small></div>
                  <div><Gauge pct={mAvg} tone={meta.tone} size={74}><b>{mAvg}%</b></Gauge><small>O'rtacha</small></div>
                </div>
                <div className="lr-es-bars2">
                  <b>Darslar natijasi</b>
                  <div className="lr-es-columns">
                    <span className="lr-es-passline" style={{ bottom: ov.passMark + '%' }}><em>{ov.passMark}%</em></span>
                    {lessons.map((l) => (
                      <span key={l.code} className="lr-es-col" title={l.title}>
                        <i className={l.passed ? 'ok' : 'no'} style={{ height: Math.max(l.bestScore ?? 0, 4) + '%' }} />
                        <small>{l.bestScore ?? '·'}</small>
                      </span>
                    ))}
                  </div>
                </div>
                {weak.length > 0 && (
                  <div className="lr-es-weaklist">
                    <b>⚠️ Qayta ishlash kerak</b>
                    {weak.map((l) => (
                      <button key={l.code} disabled={readOnly} onClick={() => navigate(`/frontend/lesson/${l.code}`)}>
                        <span>{l.title}</span><em>{l.bestScore}%</em>{!readOnly && <i>→</i>}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
        );
      })()}
    </>
  );
}
