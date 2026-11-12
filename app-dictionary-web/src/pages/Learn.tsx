import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  errorMessage,
  errorStatus,
  learnApi,
  LearnCheck,
  LearnExamQuestion,
  LearnExamResult,
  LearnFinish,
  LearnItemView,
  LearnLessonDetail,
  LearnLessonSummary,
  LearnOverview,
  LearnStats,
  Skill,
} from '../api';
import { Button, Card, Notice, PageHeader, ProgressBar, Spinner } from '../ui';
import { requestProgressCheck, speakEnglish } from '../util';
import { GameResult } from './StudyGames';

export const SKILL_META: Record<Skill, { icon: string; label: string; tone: string; tip: string }> = {
  READING: { icon: '📖', label: "O'qish", tone: '#6366f1', tip: "Har kuni 1–2 ta qisqa matn o'qing va noma'lum so'zlarni lug'atingizga qo'shing." },
  LISTENING: { icon: '🎧', label: 'Tinglash', tone: '#0ea5e9', tip: "Matnni avval tinglang, keyin savollarga javob bering. Kerak bo'lsa sekinroq tinglab ko'ring." },
  SPEAKING: { icon: '🎤', label: 'Gapirish', tone: '#f59e0b', tip: "Gaplarni ovoz chiqarib takrorlang va o'zingizni eshiting." },
  WRITING: { icon: '✍️', label: 'Yozish', tone: '#10b981', tip: "Kuniga 2–3 ta gap yozing, \"Gap tuzish\" mashqi bilan tekshirib boring." },
  GRAMMAR: { icon: '🧩', label: 'Grammatika', tone: '#a855f7', tip: "Qoidani o'qib, mashqlarni xatosiz bajarguncha takrorlang." },
};

/** A picture for a lesson: matched on what it is about (most specific first), then a rotating set per skill. */
const TOPIC_ICONS: [RegExp, string][] = [
  // grammar
  [/perfect continuous/i, '⏳'], [/present perfect|past perfect/i, '⌛'], [/narrative/i, '📜'],
  [/used to|be used to/i, '🕰️'], [/future|\bwill\b|going to|rejalar/i, '🔮'], [/third conditional|mixed conditional/i, '🌀'],
  [/conditional|unless|if only|wish/i, '🔀'], [/passive|have something done/i, '🔁'], [/reported|reporting verb/i, '🗨️'],
  [/deduction|must have|modals?/i, '🕵️'], [/gerund|infinitive|verb pattern/i, '🔗'], [/relative clause/i, '🧷'],
  [/article|a \/ an|^the$/i, '🔤'], [/quantifier|much|many|few|little|uncountable|countable|sanal/i, '🧮'], [/comparison|comparative|superlative|degree/i, '⚖️'],
  [/confusing|look-alike|sound-alike|say\/tell|adashtir/i, '🔍'], [/preposition|predlog|at \/ on \/ in/i, '📍'], [/phrasal/i, '🧩'], [/linking|contrast|connector/i, '🌉'],
  [/to be|am \/ is/i, '🧱'], [/present continuous/i, '🔄'], [/present simple/i, '📆'], [/past simple|was \/ were|\bdid\b/i, '⏪'], [/have \/ have got/i, '🤲'],
  [/can \/ could|\bcan\b/i, '💪'], [/would like/i, '🙏'], [/who \/ what|savol|question/i, '❓'], [/some \/ any/i, '🥣'], [/there is|there are/i, '📌'], [/my \/ mine|possessive/i, '🧢'],
  // people, introductions
  [/greeting|salom/i, '👋'], [/introduc|about me|myself/i, '🙋'], [/making friends|friend|neighbour|neighbor/i, '🤝'], [/family|oila/i, '👨‍👩‍👧'], [/birthday|party/i, '🎂'],
  [/wedding/i, '💍'], [/feeling|emotion|body|hissiyot/i, '🫀'],
  // places and daily life
  [/hotel|complaint/i, '🏨'], [/airport|flight|check-in|plane/i, '✈️'], [/railway|train|station|timetable|metro/i, '🚆'], [/taxi|\bbus\b|transport|bike|driver|shuttle/i, '🚌'],
  [/doctor|pharmacy|nurse|dentist|clinic|hospital|injury|medic|health|shifokor/i, '🩺'], [/sleep|burnout|stress|mental|detox|nutrition/i, '🧘'],
  [/school|teacher|class|lesson|student|university|exam|scholarship|study|maktab/i, '🏫'], [/library|book|novel|reading/i, '📚'],
  [/shop|supermarket|market|bazaar|buying|present|gift|price|money|bank|salary|saving|rent|mortgage/i, '🛍️'], [/pizza|food|cafe|café|restaurant|lunch|dinner|cook|kitchen|bakery|canteen|meal|recipe|drink|ovqat/i, '🍲'],
  [/clothes|shoes|colou?r|kiyim/i, '👕'], [/house|home|flat|room|furniture|garden/i, '🏠'], [/city|town|tashkent|direction|street|shahar|yo'l/i, '🏙️'],
  [/park|walk|picnic|lake|forest|nature|camping/i, '🌳'], [/mountain|desert|trip|travel|holiday|beach|tour|vlog|sayohat|gap year/i, '🏔️'],
  [/weather|forecast|season|winter|autumn|snow|rain|storm|flood|ob-havo/i, '⛅'], [/navruz|new year|festival|celebration|bayram/i, '🎉'], [/zoo|animal|\bpets?\b|\bdog\b|\bcat\b|wildlife|hayvon/i, '🦁'],
  // activities
  [/sport|football|tennis|volley|match|game|chess|o'yin/i, '⚽'], [/music|concert|song|piano|guitar/i, '🎵'], [/draw|paint|\bart\b|museum|gallery/i, '🎨'], [/hobb|interest|qiziq/i, '🎯'],
  [/phone|call|message|email|letter|postcard|post office|telefon/i, '📞'], [/news|media|journalist|editor|bulletin|podcast|social media|algorithm/i, '📰'],
  [/tech|\bapp\b|smart|computer|internet|digital|artificial|robot|laborator|invent|science|research/i, '💡'], [/environment|plastic|aral|reserve|climate|tourism|recycle/i, '🌍'],
  [/routine|morning|tartib/i, '🌅'], [/job|work|career|interview|office|meeting|freelanc|promot|boss|kasb/i, '💼'], [/time|\bday\b|date|routine|morning|weekend|busy|kun|vaqt|tartib/i, '⏰'],
  [/history|village|town hall|protest|oak tree|argument|quarrel|community|volunteer|food bank/i, '🏛️'], [/number|raqam/i, '🔢'], [/opinion|hedging|agree|clarif|polite|request|stress|pronounc|talaffuz|sound/i, '🗣️'],
  [/regret|speculat|hypothetic|narrat|story|report/i, '💭'], [/help|yordam/i, '🆘'], [/like|dislike|yoqtir/i, '👍'], [/plan|goal|future|maqsad/i, '🗺️'],
];
const SKILL_ICON_SET: Record<Skill, string[]> = {
  READING: ['📖', '📰', '📜', '🔖', '📕', '🗞️'], LISTENING: ['🎧', '🔊', '📻', '🎵', '📞', '🎙️'], SPEAKING: ['🎤', '🗣️', '💬', '📢', '🙋', '🎬'],
  WRITING: ['✍️', '📝', '🖋️', '📓', '✏️', '📄'], GRAMMAR: ['🧩', '📐', '🔧', '🧠', '⚙️', '🔠'],
};
export function lessonIcon(l: { skill: Skill; topic: string; title: string }): string {
  const text = l.skill === 'GRAMMAR' ? l.topic : l.topic.split(',')[0];
  const hit = TOPIC_ICONS.find(([re]) => re.test(text));
  if (hit) return hit[1];
  const n = parseInt(l.title.replace(/\D+/g, ''), 10) || 1;
  const set = SKILL_ICON_SET[l.skill];
  return set[(n - 1) % set.length];
}

const LEVEL_INFO: Record<string, { title: string; sub: string }> = {
  A1: { title: "Boshlang'ich", sub: "Oddiy so'z va gaplar, o'zingiz haqingizda gapirish" },
  A2: { title: 'Elementar', sub: 'Kundalik mavzular, oddiy suhbatlar' },
  B1: { title: "O'rta", sub: "Fikr bildirish, sayohat va ish bo'yicha suhbat" },
  B2: { title: "O'rta-yuqori", sub: "Murakkab matnlarni tushunish va erkin gapirish" },
  C1: { title: "Ilg'or", sub: "Deyarli ona tili darajasida erkin muloqot" },
};

const SKILL_ORDER: Skill[] = ['READING', 'LISTENING', 'SPEAKING', 'WRITING', 'GRAMMAR'];

/* ------------------------------------------------------------------ overview */

function LevelPicker({ current, levels, onPick, onCancel }: { current: string | null; levels: string[]; onPick: (l: string) => void; onCancel?: () => void }) {
  return (
    <>
      <PageHeader title="Ingliz tili" back={onCancel} />
      <Card className="lr-picker rise">
        <h2>Darajangizni tanlang</h2>
        <p>Bilmasangiz, A1 dan boshlang. Daraja imtihonini topshirib, keyingisiga o'tasiz.</p>
        <div className="lr-levels">
          {levels.map((l) => (
            <button key={l} className={`lr-level ${l === current ? 'on' : ''}`} onClick={() => onPick(l)}>
              <b>{l}</b>
              <span>{LEVEL_INFO[l]?.title}</span>
              <small>{LEVEL_INFO[l]?.sub}</small>
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}

const ROW = 152;
const NODE = 78;
const WAVE = [0, 70, 104, 70, 0, -70, -104, -70];

/** Today's goal as one big ring. */
function DayRing({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="lr-dayring" style={{ ['--p' as string]: `${pct * 3.6}deg` }}>
      <div>
        <b>{done}<i>/{total}</i></b>
        <small>bugun</small>
      </div>
    </div>
  );
}

export function LearnPage() {
  const navigate = useNavigate();
  const [ov, setOv] = useState<LearnOverview | null>(null);
  const [lessons, setLessons] = useState<LearnLessonSummary[]>([]);
  const [picking, setPicking] = useState(false);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [leaving, setLeaving] = useState<Skill | null>(null);
  // The chosen card grows and the others fade out first, then the skill's road builds itself.
  const openSkill = (sk: Skill) => {
    setLeaving(sk);
    window.setTimeout(() => { setSkill(sk); setLeaving(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 320);
  };
  const [showDone, setShowDone] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const o = await learnApi.overview();
      setOv(o);
      setLessons(o.level ? await learnApi.lessons() : []);
    } catch (e) {
      setError(errorMessage(e, "Ma'lumotlarni yuklab bo'lmadi"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pick = async (level: string) => {
    try {
      const o = await learnApi.setLevel(level);
      setOv(o);
      setLessons(await learnApi.lessons());
      setPicking(false);
    } catch (e) {
      setError(errorMessage(e, "Darajani saqlab bo'lmadi"));
    }
  };

  // The road: lessons in course order (unit, then skill), with finished ones folded away.
  const road = useMemo(() => {
    const sorted = [...lessons].sort((a, b) => a.unit - b.unit || SKILL_ORDER.indexOf(a.skill) - SKILL_ORDER.indexOf(b.skill));
    const visible = skill ? sorted.filter((l) => l.skill === skill) : sorted;
    return { done: visible.filter((l) => l.passed), todo: visible.filter((l) => !l.passed) };
  }, [lessons, skill]);

  if (!ov) return error ? <Notice>{error}</Notice> : <Spinner />;
  if (!ov.level || picking) {
    return <LevelPicker current={ov.level} levels={ov.levels} onPick={pick} onCancel={ov.level ? () => setPicking(false) : undefined} />;
  }

  const level = ov.level;
  const goalsTotal = ov.goals.reduce((s, g) => s + g.target, 0);
  const goalsDone = ov.goals.reduce((s, g) => s + g.done, 0);
  const todayCodes = new Set(ov.goals.flatMap((g) => g.suggested.map((l) => l.code)));
  const nextCode = road.todo[0]?.code;
  const nodes = road.todo.slice(0, ROAD_SHOWN);
  const more = road.todo.length - nodes.length;
  const stops = nodes.length + 1; // + the exam (or the "more" stop)
  const x = (i: number) => WAVE[i % WAVE.length];
  const y = (i: number) => i * ROW + NODE / 2 + 14;

  return (
    <>
      <PageHeader title="Ingliz tili" right={<Link to="/profile/stats?tab=english" className="btn btn-outline lr-small">📊 Statistika</Link>} />
      {error && <Notice>{error}</Notice>}

      <Card className="lr-top rise">
        <DayRing done={goalsDone} total={goalsTotal} />
        <div className="lr-top-main">
          <div className="lr-top-row">
            <button className="lr-levelchip" onClick={() => setPicking(true)} title="Darajani o'zgartirish">{level} ▾</button>
            <span className={`lr-chip ${ov.goalsDone ? 'ok' : ''}`}>{ov.goalsDone ? '✓ Bugungi maqsad bajarildi' : 'Bugungi maqsad'}</span>
          </div>
          <b className="lr-top-title">{ov.progress.passed} / {ov.progress.total} dars o'zlashtirildi</b>
          <ProgressBar pct={ov.progress.percent} />
        </div>
      </Card>

      {skill === null ? (
        <>
          <div className={`lr-cards rise ${leaving ? 'leaving' : ''}`}>
            {SKILL_ORDER.map((sk) => {
              const g = ov.goals.find((x) => x.skill === sk);
              const st = ov.skills.find((k) => k.skill === sk);
              const m = SKILL_META[sk];
              const has = !!st && st.lessonsTotal > 0;
              const pct = st && st.lessonsTotal ? Math.round((st.lessonsPassed / st.lessonsTotal) * 100) : 0;
              const goalOk = !!g && g.done >= g.target;
              return (
                <button
                  key={sk}
                  disabled={!has}
                  className={`lr-card ${goalOk ? 'done' : ''} ${leaving === sk ? 'chosen' : ''}`}
                  style={{ ['--tone' as string]: m.tone }}
                  onClick={() => openSkill(sk)}
                >
                  <span className="lr-card-ico">{m.icon}</span>
                  <b>{m.label}</b>
                  <small>{has ? `${st!.lessonsPassed} / ${st!.lessonsTotal} dars` : 'Tez orada'}</small>
                  <span className="lr-card-bar"><i style={{ width: pct + '%' }} /></span>
                  {g && has && (
                    <em className={goalOk ? 'ok' : ''}>{goalOk ? '✓ Bugungi maqsad' : `Bugun: ${g.done} / ${g.target}`}</em>
                  )}
                </button>
              );
            })}
            <button
              className={`lr-card lr-card-exam ${ov.examUnlocked ? 'open' : ''}`}
              disabled={!ov.examUnlocked}
              onClick={() => navigate('/learn/exam')}
            >
              <span className="lr-card-ico">{ov.examUnlocked ? '🎓' : '🔒'}</span>
              <b>{level} imtihoni</b>
              <small>{ov.lastExam ? `Oxirgi: ${ov.lastExam.percent}%` : ov.examUnlocked ? 'Keyingi darajaga' : 'Barcha darslardan keyin'}</small>
            </button>
          </div>
          {ov.progress.total === 0 && <p className="lr-empty">Bu daraja uchun darslar tez orada qo'shiladi.</p>}
        </>
      ) : (
        <section className="lr-hero2 lr-enter" style={{ ['--tone' as string]: SKILL_META[skill].tone }}>
          <button className="lr-back" onClick={() => { setSkill(null); setShowDone(false); }}>← Yo'nalishlar</button>
          <div className="lr-hero2-main">
            <span className="lr-hero2-ico">{SKILL_META[skill].icon}</span>
            <div className="lr-hero2-text">
              <h2>{SKILL_META[skill].label}</h2>
              <p>{road.done.length} / {road.done.length + road.todo.length} dars o'zlashtirilgan</p>
              <span className="lr-hero2-track"><i style={{ width: Math.round((road.done.length / Math.max(1, road.done.length + road.todo.length)) * 100) + '%' }} /></span>
            </div>
          </div>
          {road.todo[0] && (
            <button className="lr-hero2-go" onClick={() => navigate(`/learn/lesson/${road.todo[0].code}`)}>
              <span>{lessonIcon(road.todo[0])}</span>
              <b>Davom etish<small>{road.todo[0].title}</small></b>
              <i>→</i>
            </button>
          )}
        </section>
      )}

      {skill !== null && road.done.length > 0 && (
        <div className="lr-donebar">
          <button onClick={() => setShowDone(!showDone)}>✓ {road.done.length} ta dars tugatilgan {showDone ? '▴' : '▾'}</button>
          {showDone && (
            <div className="lr-donelist">
              {road.done.map((l) => (
                <button key={l.code} className="lr-chipbtn" style={{ ['--tone' as string]: SKILL_META[l.skill].tone }} onClick={() => navigate(`/learn/lesson/${l.code}`)}>
                  {lessonIcon(l)} {l.title} · {l.bestScore}%
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {skill !== null && ov.progress.total > 0 && (() => {
        const W = 360, AMP = 86, TOP = 24, ROW2 = 132, BANNER = 44;
        type Entry = { l: LearnLessonSummary; kind: 'done' | 'next' | 'todo' };
        const entries: Entry[] = [
          ...road.done.slice(-2).map((l) => ({ l, kind: 'done' as const })),
          ...nodes.map((l) => ({ l, kind: (l.code === nextCode ? 'next' : 'todo') as 'next' | 'todo' })),
        ];
        // positions: a gentle S-curve; a banner row is inserted whenever the unit changes
        let yCursor = TOP;
        let prevUnit = -1;
        const pts = entries.map((e, i) => {
          let banner = false;
          if (e.l.unit !== prevUnit) { banner = true; yCursor += i === 0 ? 0 : 0; }
          prevUnit = e.l.unit;
          const top = yCursor + (banner ? BANNER : 0);
          yCursor = top + ROW2 + (e.kind === 'next' ? 30 : 0);
          return { ...e, banner, top, cx: Math.round(Math.sin(i * 0.95 + 0.3) * AMP), cy: top + (e.kind === 'next' ? 64 : 32) };
        });
        const endTop = yCursor;
        const endPt = { cx: Math.round(Math.sin(entries.length * 0.95 + 0.3) * AMP), cy: endTop + 32 };
        const all = [...pts.map((p) => ({ cx: p.cx, cy: p.cy })), endPt];
        const H = endTop + 110;
        let d = '';
        all.forEach((p, i) => {
          const px = W / 2 + p.cx;
          if (i === 0) { d += `M ${px} ${p.cy}`; return; }
          const q = all[i - 1];
          const qx = W / 2 + q.cx;
          const mid = (q.cy + p.cy) / 2;
          d += ` C ${qx} ${mid}, ${px} ${mid}, ${px} ${p.cy}`;
        });
        const doneCount = pts.filter((p) => p.kind === 'done').length;
        return (
          <div className="lr-road2" style={{ height: H, ['--tone' as string]: SKILL_META[skill].tone }}>
            <i className="lr-bg-blob b1" /><i className="lr-bg-blob b2" /><i className="lr-bg-blob b3" />
            <svg className="lr-path" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              <defs>
                <linearGradient id="lr-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="45%" stopColor={SKILL_META[skill].tone} />
                  <stop offset="100%" stopColor={SKILL_META[skill].tone} stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path d={d} className="lr-path-base" pathLength={1} />
              <path d={d} className="lr-path-glow" pathLength={1} stroke="url(#lr-grad)" />
            </svg>

            {pts.map((p, i) => {
              const m = SKILL_META[p.l.skill];
              const score = p.l.bestScore ?? 0;
              const isDone = p.kind === 'done';
              return (
                <div key={p.l.code} className="lr-rowwrap" style={{ top: p.banner ? p.top - BANNER : p.top, animationDelay: `${i * 80}ms` }}>
                  {p.banner && <div className="lr-banner"><span>{p.l.unit}-bosqich</span></div>}
                  <button
                    className={`lr-n2 ${p.kind}`}
                    style={{ left: `calc(50% + ${p.cx}px)`, top: p.banner ? BANNER : 0, ['--tone' as string]: m.tone, ['--p' as string]: (isDone ? 100 : score) + '%' }}
                    onClick={() => navigate(`/learn/lesson/${p.l.code}`)}
                  >
                    {p.kind === 'next' && <span className="lr-go">BOSHLASH</span>}
                    <span className="lr-ring">
                      <span className="lr-core">
                        <span className="lr-ico">{isDone ? '✓' : lessonIcon(p.l)}</span>
                      </span>
                      {todayCodes.has(p.l.code) && !isDone && <em title="Bugungi maqsad">★</em>}
                    </span>
                    <b>{p.l.title}</b>
                    <small>{isDone ? `${score}% · tugatilgan` : `${m.label}${p.l.bestScore != null ? ' · ' + p.l.bestScore + '%' : ''}`}</small>
                  </button>
                </div>
              );
            })}

            <div className="lr-rowwrap" style={{ top: endTop, animationDelay: `${pts.length * 80}ms` }}>
              <div className="lr-n2 finish" style={{ left: `calc(50% + ${endPt.cx}px)`, top: 0 }}>
                <span className="lr-ring">
                  <span className="lr-core"><span className="lr-ico">{more > 0 ? '🎁' : '🏆'}</span></span>
                </span>
                <b>{more > 0 ? `yana ${more} ta dars` : "Yo'nalish tugadi"}</b>
                <small>{more > 0 ? 'oldinda sizni kutmoqda' : 'Barakalla!'}</small>
              </div>
            </div>
            {doneCount > 0 && <span className="lr-doneflag">✓ {road.done.length} ta dars tugatilgan</span>}
          </div>
        );
      })()}
    </>
  );
}

/* ------------------------------------------------------------------ one exercise */

type Exercise = Pick<LearnItemView, 'kind' | 'prompt' | 'options' | 'words' | 'passage' | 'audioText'>;

const ROAD_SHOWN = 8;

/** Speech recognition of the browser (Chrome, Edge, Safari); undefined where it does not exist. */
function speechRecognitionClass(): (new () => any) | undefined {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

function SpeakBox({ phrase, value, setValue, locked }: { phrase: string; value: string; setValue: (v: string) => void; locked: boolean }) {
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState('');
  const supported = !!speechRecognitionClass();

  const listen = () => {
    const Rec = speechRecognitionClass();
    if (!Rec || listening) return;
    const rec = new Rec();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setNote('');
    rec.onresult = (e: any) => setValue(e.results[0][0].transcript);
    rec.onerror = (e: any) => setNote(e.error === 'not-allowed' ? "Mikrofonga ruxsat bering" : "Eshitilmadi, qayta urinib ko'ring");
    rec.onend = () => setListening(false);
    setListening(true);
    try { rec.start(); } catch { setListening(false); }
  };

  return (
    <div className="lr-speak">
      <div className="lr-speak-btns">
        <Button variant="outline" onClick={() => speakEnglish(phrase)}>🔊 Eshitish</Button>
        {supported && <Button disabled={locked} loading={listening} onClick={listen}>{listening ? 'Eshitayapman…' : '🎤 Gapirish'}</Button>}
      </div>
      <input
        className="qx-input"
        value={value}
        disabled={locked}
        placeholder={supported ? 'Aytganingiz shu yerda chiqadi (tahrirlash mumkin)' : "Brauzer ovozni tanimaydi — jumlani yozing"}
        onChange={(e) => setValue(e.target.value)}
      />
      {note && <p className="lr-speak-note">{note}</p>}
    </div>
  );
}

function ExerciseCard({ item, instant, last, onDone }: {
  item: Exercise;
  /** Returns feedback right away (lessons). Without it (exam) the answer is only collected. */
  instant?: (answer: string) => Promise<LearnCheck>;
  last: boolean;
  onDone: (answer: string) => void;
}) {
  const [value, setValue] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<LearnCheck | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const answer = item.kind === 'ORDER' ? picked.map((i) => item.words![i]).join(' ') : value.trim();

  const submit = async () => {
    if (!answer || busy) return;
    if (!instant) return onDone(answer);
    setBusy(true);
    setError('');
    try {
      setFeedback(await instant(answer));
    } catch (e) {
      setError(errorMessage(e, "Tekshirib bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  const locked = !!feedback;

  // Keyboard: 1-9 picks an option, Enter checks / continues.
  const stateRef = useRef({ locked, answer, submit, onDone, item });
  stateRef.current = { locked, answer, submit, onDone, item };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (s.item.kind === 'CHOICE' && !s.locked && /^[1-9]$/.test(e.key) && tag !== 'INPUT') {
        const opt = s.item.options?.[Number(e.key) - 1];
        if (opt) setValue(opt);
      } else if (e.key === 'Enter' && tag !== 'INPUT' && tag !== 'BUTTON') {
        if (s.locked) s.onDone(s.answer);
        else void s.submit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const heading: Record<string, string> = {
    CHOICE: 'To\'g\'ri variantni tanlang',
    FILL: item.prompt.includes('___') ? 'Bo\'sh joyni to\'ldiring' : 'Javobni yozing',
    ORDER: 'Gapni to\'g\'ri tartibga soling',
    SPEAK: 'Ovoz chiqarib ayting',
  };
  const blank = item.kind === 'CHOICE' || item.kind === 'FILL' ? item.prompt.split('___') : null;
  const showBlank = blank && blank.length > 1;
  const slotState = feedback ? (feedback.correct ? 'good' : 'bad') : value ? 'filled' : '';

  return (
    <section className={`ex2 ${feedback ? (feedback.correct ? 'good' : 'bad') : ''}`}>
      {(item.passage || item.audioText) && <Context passage={item.passage ?? null} audioText={item.audioText ?? null} />}
      <span className="ex2-tag">{heading[item.kind]}</span>

      {item.kind === 'ORDER' ? (
        <h3 className="ex2-prompt small">{item.prompt === "Gapni to'g'ri tartibga soling" ? 'Quyidagi so\'zlardan gap tuzing' : item.prompt}</h3>
      ) : showBlank ? (
        <h3 className="ex2-prompt">
          {blank!.map((part, i) => (
            <span key={i}>
              {part}
              {i < blank!.length - 1 && <span className={`ex2-slot ${slotState}`}>{value || ' '}</span>}
            </span>
          ))}
        </h3>
      ) : (
        <h3 className={`ex2-prompt ${item.kind === 'SPEAK' ? 'speak' : ''}`}>{item.prompt}</h3>
      )}

      {item.kind === 'CHOICE' && (
        <div className="ex2-options">
          {item.options!.map((opt, i) => {
            const right = locked && opt.toLowerCase() === feedback!.answer.toLowerCase();
            const wrong = locked && !feedback!.correct && opt === value;
            return (
              <button
                key={opt}
                className={`ex2-opt ${value === opt && !locked ? 'sel' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''} ${locked && !right && !wrong ? 'dim' : ''}`}
                disabled={locked}
                onClick={() => setValue(opt)}
              >
                <span className="ex2-key">{i + 1}</span>
                <span className="ex2-opt-text">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {item.kind === 'FILL' && (
        <input
          className={`ex2-input ${slotState}`}
          value={value}
          disabled={locked}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          placeholder="Javobni yozing…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (locked ? onDone(answer) : submit())}
        />
      )}

      {item.kind === 'SPEAK' && <SpeakBox phrase={item.prompt} value={value} setValue={setValue} locked={locked} />}

      {item.kind === 'ORDER' && (
        <>
          <div className={`ex2-line ${slotState}`}>
            {picked.length === 0 && <span className="ex2-line-hint">So'zlarni bosib gap tuzing</span>}
            {picked.map((wi, pos) => (
              <button key={pos} className="ex2-chip" disabled={locked} onClick={() => setPicked(picked.filter((_, p) => p !== pos))}>
                {item.words![wi]}
              </button>
            ))}
          </div>
          <div className="ex2-bank">
            {item.words!.map((w, i) => (
              <button key={i} className={`ex2-chip ${picked.includes(i) ? 'used' : ''}`} disabled={locked || picked.includes(i)} onClick={() => setPicked([...picked, i])}>
                {w}
              </button>
            ))}
          </div>
        </>
      )}

      {error && <Notice>{error}</Notice>}

      <div className={`ex2-bar ${feedback ? (feedback.correct ? 'good' : 'bad') : ''}`}>
        {feedback ? (
          <>
            <span className="ex2-bar-ico">{feedback.correct ? '✓' : '✕'}</span>
            <div className="ex2-bar-text">
              <b>{feedback.correct ? "To'g'ri!" : "Noto'g'ri"}</b>
              {!feedback.correct && <span className="ex2-bar-answer">To'g'ri javob: <em>{feedback.answer}</em></span>}
              {feedback.explain && <span className="ex2-bar-explain">{feedback.explain}</span>}
            </div>
            <button className="ex2-go" onClick={() => onDone(answer)}>{last ? 'Natija' : 'Davom etish'} →</button>
          </>
        ) : (
          <>
            <span className="ex2-hint">{item.kind === 'CHOICE' ? '1–3 tugmalari bilan tanlang · Enter' : 'Enter — tekshirish'}</span>
            <button className="ex2-go" disabled={!answer || busy} onClick={submit}>{busy ? '…' : instant ? 'Tekshirish' : last ? 'Tugatish' : 'Keyingi'}</button>
          </>
        )}
      </div>
    </section>
  );
}

function Steps({ total, index }: { total: number; index: number }) {
  return (
    <div className="qx-steps">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < index ? 'done' : i === index ? 'now' : ''} />
      ))}
    </div>
  );
}

function Context({ passage, audioText }: { passage: string | null; audioText: string | null }) {
  if (!passage && !audioText) return null;
  return (
    <Card className="lr-context">
      {passage && <p className="lr-passage">{passage}</p>}
      {audioText && (
        <div className="lr-listen">
          <Button onClick={() => speakEnglish(audioText)}>🔊 Tinglash</Button>
          <Button variant="outline" onClick={() => speakEnglish(audioText, true)}>🐢 Sekin</Button>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ listening */

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function splitSentences(text: string): string[] {
  const parts = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+["')]*|[^.!?]+$/g);
  const list = (parts ?? [text]).map((s) => s.trim()).filter(Boolean);
  return list.length ? list : [text];
}

/**
 * Audio player on top of the browser's speech synthesis. The text is spoken sentence by sentence,
 * so the player can jump forward and back, seek with a slider and change the speed.
 */
function AudioPlayer({ text }: { text: string }) {
  const sentences = useMemo(() => splitSentences(text), [text]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const token = useRef(0);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = () => {
    token.current += 1;
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
  };

  useEffect(() => stop, []);

  const playFrom = (start: number, r: number) => {
    if (!supported) return;
    stop();
    const t = token.current;
    setPlaying(true);
    const run = (k: number) => {
      if (t !== token.current) return;
      if (k >= sentences.length) {
        setPlaying(false);
        setIdx(0);
        return;
      }
      setIdx(k);
      const u = new SpeechSynthesisUtterance(sentences[k]);
      u.lang = 'en-US';
      u.rate = r;
      u.onend = () => run(k + 1);
      u.onerror = () => { if (t === token.current) setPlaying(false); };
      window.speechSynthesis.speak(u);
    };
    run(Math.max(0, Math.min(start, sentences.length - 1)));
  };

  const pause = () => {
    stop();
    setPlaying(false);
  };

  const seek = (to: number) => {
    const k = Math.max(0, Math.min(to, sentences.length - 1));
    if (playing) playFrom(k, rate);
    else setIdx(k);
  };

  const changeRate = (r: number) => {
    setRate(r);
    if (playing) playFrom(idx, r);
  };

  if (!supported) return <Notice>Brauzer ovozni ijro eta olmaydi. Boshqa brauzerda (Chrome, Edge) oching.</Notice>;

  const pct = Math.round(((idx + (playing ? 0.5 : 0)) / sentences.length) * 100);

  return (
    <div className="ap">
      <div className="ap-row">
        <button className="ap-btn" onClick={() => seek(idx - 1)} aria-label="Orqaga" title="Oldingi gap">⏮</button>
        <button className="ap-play" onClick={() => (playing ? pause() : playFrom(idx, rate))} aria-label={playing ? 'To\'xtatish' : 'Ijro etish'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="ap-btn" onClick={() => seek(idx + 1)} aria-label="Oldinga" title="Keyingi gap">⏭</button>
        <div className="ap-track">
          <input
            type="range"
            min={0}
            max={sentences.length - 1}
            value={idx}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Audio joylashuvi"
            style={{ ['--p' as string]: `${pct}%` }}
          />
          <small>{idx + 1} / {sentences.length}</small>
        </div>
      </div>
      <div className="ap-speeds" role="group" aria-label="Tezlik">
        {SPEEDS.map((s) => (
          <button key={s} className={`ap-speed ${rate === s ? 'on' : ''}`} onClick={() => changeRate(s)}>{s}×</button>
        ))}
      </div>
    </div>
  );
}

/** Consecutive items that share the same audio form one listening page. */
function listeningGroups(items: LearnItemView[]): LearnItemView[][] | null {
  if (items.length === 0) return null;
  if (items.some((i) => !i.audioText || (i.kind !== 'CHOICE' && i.kind !== 'FILL'))) return null;
  const groups: LearnItemView[][] = [];
  for (const it of items) {
    const g = groups[groups.length - 1];
    if (g && g[0].audioText === it.audioText) g.push(it);
    else groups.push([it]);
  }
  return groups;
}

function ListeningPage({ lesson, onFinish, onExit, error }: {
  lesson: LearnLessonDetail;
  onFinish: (answers: { itemId: string; answer: string }[]) => void;
  onExit: () => void;
  error: string;
}) {
  const groups = useMemo(() => listeningGroups(lesson.items)!, [lesson]);
  const m = SKILL_META[lesson.skill];
  const [gi, setGi] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, LearnCheck> | null>(null);
  const [collected, setCollected] = useState<{ itemId: string; answer: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  const group = groups[gi];
  const last = gi + 1 === groups.length;
  const answered = group.filter((it) => (values[it.id] ?? '').trim()).length;
  const correctCount = feedback ? group.filter((it) => feedback[it.id]?.correct).length : 0;

  const check = async () => {
    if (busy || answered < group.length) return;
    setBusy(true);
    setProblem('');
    try {
      const res = await Promise.all(group.map((it) => learnApi.check(lesson.code, it.id, values[it.id].trim())));
      const map: Record<string, LearnCheck> = {};
      group.forEach((it, i) => { map[it.id] = res[i]; });
      setFeedback(map);
    } catch (e) {
      setProblem(errorMessage(e, "Tekshirib bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    const all = [...collected, ...group.map((it) => ({ itemId: it.id, answer: values[it.id].trim() }))];
    if (last) return onFinish(all);
    setCollected(all);
    setFeedback(null);
    setGi(gi + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="qx-top">
        <button className="gp-back" onClick={onExit} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>{m.icon} {m.label}</small>
          <b>{lesson.title}</b>
        </div>
        <div className="qx-pills"><span className="qx-pill">{gi + 1} / {groups.length}</span></div>
      </header>
      <Steps total={groups.length} index={gi} />
      {(error || problem) && <Notice>{error || problem}</Notice>}

      <div className="ls">
        <div className="ls-audio" key={`a${gi}`}>
          <div className="ls-audio-head">
            <span>🎧 Audio {gi + 1}</span>
            <small>Savollarga javob berishdan oldin tinglang · {group.length} ta savol</small>
          </div>
          <AudioPlayer text={group[0].audioText!} />
        </div>

        <ol className="ls-list">
          {group.map((it, n) => {
            const fb = feedback?.[it.id];
            const v = values[it.id] ?? '';
            const blank = it.prompt.split('___');
            return (
              <li key={it.id} className={`ls-q ${fb ? (fb.correct ? 'good' : 'bad') : ''}`}>
                <div className="ls-q-head">
                  <span className="ls-num">{n + 1}</span>
                  <p className="ls-prompt">
                    {blank.length > 1
                      ? blank.map((part, i) => (
                          <span key={i}>
                            {part}
                            {i < blank.length - 1 && <span className="ls-blank">{v || '      '}</span>}
                          </span>
                        ))
                      : it.prompt}
                  </p>
                </div>

                {it.kind === 'CHOICE' ? (
                  <div className="ls-opts">
                    {it.options!.map((opt) => {
                      const right = !!fb && opt.toLowerCase() === fb.answer.toLowerCase();
                      const wrong = !!fb && !fb.correct && opt === v;
                      return (
                        <button
                          key={opt}
                          className={`ls-opt ${v === opt && !fb ? 'sel' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''}`}
                          disabled={!!fb}
                          onClick={() => setValues((p) => ({ ...p, [it.id]: opt }))}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    className={`ls-input ${fb ? (fb.correct ? 'good' : 'bad') : ''}`}
                    value={v}
                    disabled={!!fb}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Javobni yozing…"
                    onChange={(e) => setValues((p) => ({ ...p, [it.id]: e.target.value }))}
                  />
                )}

                {fb && (
                  <div className="ls-fb">
                    <b>{fb.correct ? "✓ To'g'ri" : "✕ Noto'g'ri"}</b>
                    {!fb.correct && <span>To'g'ri javob: <em>{fb.answer}</em></span>}
                    {fb.explain && <small>{fb.explain}</small>}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <div className={`ls-bar ${feedback ? (correctCount >= group.length * 0.7 ? 'good' : 'bad') : ''}`}>
          {feedback ? (
            <>
              <div className="ls-bar-text">
                <b>{correctCount} / {group.length} to'g'ri</b>
                <small>Xatolarni ko'rib chiqing, so'ng davom eting</small>
              </div>
              <button className="ex2-go" onClick={next}>{last ? 'Natija' : `Keyingi ${groups[gi + 1].length} ta`} →</button>
            </>
          ) : (
            <>
              <span className="ex2-hint">{answered} / {group.length} belgilandi</span>
              <button className="ex2-go" disabled={answered < group.length || busy} onClick={check}>{busy ? '…' : 'Tekshirish'}</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ lesson */

export function LessonPage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LearnLessonDetail | null>(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState<'intro' | 'play' | 'done'>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ itemId: string; answer: string }[]>([]);
  const [result, setResult] = useState<LearnFinish | null>(null);

  useEffect(() => {
    learnApi.lesson(code).then(setLesson).catch((e) => setError(errorMessage(e, "Darsni yuklab bo'lmadi")));
  }, [code]);

  if (!lesson) return error ? <Notice>{error}</Notice> : <Spinner />;
  const m = SKILL_META[lesson.skill];
  const exit = () => navigate('/learn');

  const restart = () => {
    setIndex(0);
    setAnswers([]);
    setResult(null);
    setStage('play');
  };

  const finishWith = async (next: { itemId: string; answer: string }[]) => {
    setAnswers(next);
    try {
      setResult(await learnApi.finish(lesson.code, next));
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

  if (stage === 'play' && listeningGroups(lesson.items)) {
    return <ListeningPage lesson={lesson} onFinish={finishWith} onExit={exit} error={error} />;
  }

  if (stage === 'intro') {
    return (
      <>
        <PageHeader title={lesson.title} back={exit} />
        <Card className="lr-intro rise" >
          <span className="lr-badge-skill" style={{ ['--tone' as string]: m.tone }}>{m.icon} {m.label} · {lesson.level}</span>
          <h2>{lesson.topic}</h2>
          {lesson.intro && <p className="lr-intro-text">{lesson.intro}</p>}
          <Context passage={lesson.passage} audioText={lesson.audioText} />
          <p className="lr-meta">{lesson.items.length} ta mashq · {70}% dan yuqori natija darsni o'zlashtiradi</p>
          <Button block onClick={() => setStage('play')}>Boshlash</Button>
        </Card>
      </>
    );
  }

  if (stage === 'done' && result) {
    const wrong = result.results.filter((r) => !r.correct);
    return (
      <>
        <GameResult
          icon={result.passed ? '🏆' : '📚'}
          title={result.passed ? "Dars o'zlashtirildi!" : 'Yana urinib ko\'ring'}
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
            { label: 'XP', value: `+${result.xpGained}` },
          ]}
          onAgain={restart}
          onExit={exit}
        />
        {wrong.length > 0 && (
          <Card className="lr-review">
            <h3>Xatolar ustida ishlang</h3>
            {wrong.map((r) => {
              const it = lesson.items.find((i) => i.id === r.itemId);
              return (
                <div key={r.itemId} className="lr-review-row">
                  <span>{it?.prompt}</span>
                  <b>{r.answer}</b>
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
    <>
      <header className="qx-top">
        <button className="gp-back" onClick={exit} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>{m.icon} {m.label}</small>
          <b>{lesson.title}</b>
        </div>
        <div className="qx-pills"><span className="qx-pill">{index + 1} / {lesson.items.length}</span></div>
      </header>
      <Steps total={lesson.items.length} index={index} />
      {error && <Notice>{error}</Notice>}
      <Context passage={lesson.passage} audioText={lesson.audioText} />
      <ExerciseCard
        key={item.id}
        item={item}
        last={index + 1 === lesson.items.length}
        instant={(answer) => learnApi.check(lesson.code, item.id, answer)}
        onDone={done}
      />
    </>
  );
}

/* ------------------------------------------------------------------ exam */

export function ExamPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<LearnExamQuestion[] | null>(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ ref: string; answer: string }[]>([]);
  const [result, setResult] = useState<LearnExamResult | null>(null);

  const start = () => {
    setQuestions(null);
    setIndex(0);
    setAnswers([]);
    setResult(null);
    setError('');
    learnApi
      .exam()
      .then(setQuestions)
      .catch((e) => setError(errorStatus(e) === 409 ? "Imtihon hali ochilmagan: avval barcha darslarni o'zlashtiring." : errorMessage(e, "Imtihonni yuklab bo'lmadi")));
  };

  useEffect(start, []);
  const exit = () => navigate('/learn');

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
    return (
      <>
        <GameResult
          icon={result.passed ? '🎓' : '📚'}
          title={result.passed ? (result.newLevel ? `Tabriklaymiz! Endi ${result.newLevel} daraja` : 'Imtihondan o\'tdingiz!') : "Imtihondan o'tolmadingiz"}
          value={result.percent}
          valueSuffix="%"
          unit={result.passed ? "O'tish balli: 70%" : "O'tish uchun umumiy 70% va har yo'nalishda kamida 50% kerak"}
          tone={result.passed ? '#10b981' : '#f59e0b'}
          celebrate={result.passed}
          againLabel={result.passed ? 'Yangi daraja' : 'Qayta topshirish'}
          exitLabel="Darslarga qaytish"
          stats={[{ label: "To'g'ri", value: String(result.skills.reduce((s, k) => s + k.correct, 0)) }, { label: 'Savol', value: String(result.skills.reduce((s, k) => s + k.total, 0)) }, { label: 'XP', value: `+${result.xpGained}` }]}
          onAgain={result.passed ? exit : start}
          onExit={exit}
        />
        <Card className="lr-review">
          <h3>Yo'nalishlar bo'yicha</h3>
          {result.skills.map((s) => (
            <div key={s.skill} className="lr-skillrow">
              <span>{SKILL_META[s.skill].icon} {SKILL_META[s.skill].label}</span>
              <ProgressBar pct={s.percent} color={SKILL_META[s.skill].tone} />
              <b className={s.percent < 50 ? 'lr-bad' : ''}>{s.percent}%</b>
            </div>
          ))}
        </Card>
      </>
    );
  }

  const q = questions[index];
  const finish = async (all: { ref: string; answer: string }[]) => {
    try {
      setResult(await learnApi.submitExam(all));
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
    <>
      <header className="qx-top">
        <button className="gp-back" onClick={exit} aria-label="Orqaga">←</button>
        <div className="qx-title">
          <small>{SKILL_META[q.skill].icon} {SKILL_META[q.skill].label}</small>
          <b>Daraja imtihoni</b>
        </div>
        <div className="qx-pills"><span className="qx-pill">{index + 1} / {questions.length}</span></div>
      </header>
      <Steps total={questions.length} index={index} />
      <ExerciseCard key={q.ref} item={q} last={index + 1 === questions.length} onDone={next} />
    </>
  );
}

/* ------------------------------------------------------------------ statistics */

const SKILL_ABOUT: Record<Skill, { icon: string; what: string; how: string }> = {
  READING: { icon: '📚', what: "Matnni tushunish: asosiy fikr, aniq ma'lumot (kim, qachon, qancha) va to'g'ri / noto'g'ri savollar.", how: "Har bir o'qish darsida 6 ta qisqa matn va 30 ta savol bor." },
  LISTENING: { icon: '🎧', what: "Quloq bilan tushunish: so'zlarni, sonlarni, vaqtni va qisqa suhbatlarni eshitib javob berish.", how: "Matn ovoz bilan o'qiladi (kerak bo'lsa sekin), siz savollarga javob berasiz." },
  SPEAKING: { icon: '🗣️', what: "Talaffuz va ravon gapirish: jumlani ovoz chiqarib aytish va u to'g'ri tanib olinishi.", how: "Aytganingiz tanib olinadi, jumlaning kamida 75% so'zi tartib bilan to'g'ri bo'lsa, javob to'g'ri hisoblanadi." },
  WRITING: { icon: '✏️', what: "O'zbekchadan inglizchaga to'g'ri tarjima qilish: so'z tartibi, fe'l shakli va imlo.", how: "Gapni o'zingiz yozasiz; qisqartmalar (I'm, don't) ham qabul qilinadi." },
  GRAMMAR: { icon: '🧠', what: "Qoidalarni bilish: Murphy tartibidagi 25 mavzu (to be, zamonlar, can, a/an, predloglar va h.k.).", how: "Har mavzu uchun 3 ta dars: test, bo'sh joyni to'ldirish va gap tuzish, har birida 30 ta mashq." },
};

function levelWord(p: number | null): { label: string; tone: string; icon: string } {
  if (p == null) return { label: "Hali ma'lumot yo'q", tone: '#94a3b8', icon: '⏳' };
  if (p >= 85) return { label: "Ajoyib", tone: '#10b981', icon: '🏆' };
  if (p >= 70) return { label: "Yaxshi", tone: '#22c55e', icon: '👍' };
  if (p >= 50) return { label: "O'rtacha", tone: '#f59e0b', icon: '📈' };
  return { label: "Kuchaytirish kerak", tone: '#ef4444', icon: '🎯' };
}

function whenText(iso: string | null): string {
  if (!iso) return '—';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return days <= 0 ? 'bugun' : days === 1 ? 'kecha' : days + ' kun oldin';
}

/* ---- small chart pieces ---- */

function Radar({ stats }: { stats: LearnStats }) {
  const SIZE = 320, C = SIZE / 2, R = 108;
  const order = SKILL_ORDER;
  const pt = (i: number, v: number) => {
    const ang = (-90 + i * (360 / order.length)) * (Math.PI / 180);
    return [C + Math.cos(ang) * R * v, C + Math.sin(ang) * R * v] as const;
  };
  const poly = (v: (i: number) => number) => order.map((_, i) => pt(i, v(i)).join(',')).join(' ');
  const val = (i: number) => (stats.skills.find((s) => s.skill === order[i])?.percent ?? 0) / 100;
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="lr-radar" role="img" aria-label="Yo'nalishlar bo'yicha radar diagramma">
      {[0.25, 0.5, 0.75, 1].map((r) => <polygon key={r} points={poly(() => r)} className="lr-radar-ring" />)}
      {order.map((_, i) => <line key={i} x1={C} y1={C} x2={pt(i, 1)[0]} y2={pt(i, 1)[1]} className="lr-radar-axis" />)}
      <polygon points={poly(val)} className="lr-radar-area" />
      {order.map((sk, i) => {
        const [x, y] = pt(i, val(i));
        const [lx, ly] = pt(i, 1.28);
        return (
          <g key={sk}>
            <circle cx={x} cy={y} r={5} fill={SKILL_META[sk].tone} className="lr-radar-dot" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" className="lr-radar-label">{SKILL_META[sk].icon}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Gauge({ pct, tone, size = 84, children }: { pct: number | null; tone: string; size?: number; children?: React.ReactNode }) {
  const r = (size - 12) / 2;
  const len = 2 * Math.PI * r;
  return (
    <span className="lr-gauge" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} className="lr-gauge-track" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={tone} className="lr-gauge-bar"
          strokeDasharray={`${((pct ?? 0) / 100) * len} ${len}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="lr-gauge-in">{children}</span>
    </span>
  );
}

/** The "Ingliz tili" tab of the profile statistics: charts first, one skill explained at a time. */
export function EnglishStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<LearnStats | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<Skill | null>(null);

  useEffect(() => {
    learnApi.stats().then((s) => {
      setStats(s);
      setOpen(s.weakest ?? s.skills.find((k) => k.attempts > 0)?.skill ?? null);
    }).catch((e) => setError(errorMessage(e, "Statistikani yuklab bo'lmadi")));
  }, []);

  if (!stats) return error ? <Notice>{error}</Notice> : <Spinner />;
  if (!stats.level) {
    return (
      <Card className="rise lr-es-empty">
        <span className="lr-es-bigicon">🇬🇧</span>
        <b>Ingliz tili kursi hali boshlanmagan</b>
        <p>Darajangizni tanlang va birinchi darsni bajaring, shundan keyin bu yerda grafiklar paydo bo'ladi.</p>
        <Button onClick={() => navigate('/learn')}>Kursga o'tish</Button>
      </Card>
    );
  }

  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : null;
  const totalLessons = stats.skills.reduce((x, s) => x + s.lessonsTotal, 0);
  const passedLessons = stats.skills.reduce((x, s) => x + s.lessonsPassed, 0);
  const coursePct = totalLessons ? Math.round((passedLessons / totalLessons) * 100) : 0;
  const hasData = stats.skills.some((s) => s.attempts > 0);
  const sel = stats.skills.find((s) => s.skill === open) ?? null;

  return (
    <>
      <section className="lr-es-hero rise">
        <Gauge pct={coursePct} tone="var(--primary)" size={112}>
          <b>{coursePct}%</b>
          <small>kurs</small>
        </Gauge>
        <div className="lr-es-hero-main">
          <div className="lr-es-hero-top">
            <span className="lr-es-lvl">{stats.level}</span>
            <div>
              <b>{LEVEL_INFO[stats.level]?.title ?? stats.level}</b>
              <small>{passedLessons} / {totalLessons} dars o'zlashtirilgan</small>
            </div>
          </div>
          <div className="lr-es-nums">
            <div><span>✅</span><b>{stats.answered}</b><small>mashq</small></div>
            <div><span>🎯</span><b>{accuracy == null ? '—' : accuracy + '%'}</b><small>aniqlik</small></div>
            <div><span>📅</span><b>{stats.activeDays}</b><small>faol kun</small></div>
            <div><span>🎓</span><b>{stats.examsTaken}</b><small>imtihon</small></div>
          </div>
        </div>
      </section>

      <Card className="rise lr-es-chartcard">
        <div className="lr-sec-head"><h2>📊 Yo'nalishlar xaritasi</h2></div>
        {!hasData && <p className="lr-es-note">Birinchi darsni bajaring, shunda diagramma to'ladi.</p>}
        <div className="lr-es-chartrow">
          <Radar stats={stats} />
          <div className="lr-es-rank">
            {[...stats.skills].sort((x, y) => (y.percent ?? -1) - (x.percent ?? -1)).map((s) => {
              const m = SKILL_META[s.skill];
              return (
                <button key={s.skill} className={`lr-es-rankrow ${open === s.skill ? 'on' : ''}`} style={{ ['--tone' as string]: m.tone }} onClick={() => setOpen(s.skill)}>
                  <span className="lr-es-rank-ico">{m.icon}</span>
                  <span className="lr-es-rank-main">
                    <span className="lr-es-rank-top"><b>{m.label}</b><em>{s.percent == null ? '—' : s.percent + '%'}</em></span>
                    <span className="lr-es-rank-track"><i style={{ width: (s.percent ?? 0) + '%' }} /></span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="lr-es-legend">
          <span><i className="lg-strong" /> 70% va yuqori — yaxshi</span>
          <span><i className="lg-mid" /> 50–70% — o'rtacha</span>
          <span><i className="lg-low" /> 50% dan past — kuchaytirish kerak</span>
        </div>
      </Card>

      <div className="lr-es-gauges rise">
        {stats.skills.map((s) => {
          const m = SKILL_META[s.skill];
          const lw = levelWord(s.percent);
          return (
            <button key={s.skill} className={`lr-es-gcard ${open === s.skill ? 'on' : ''}`} style={{ ['--tone' as string]: m.tone }} onClick={() => setOpen(s.skill)}>
              <Gauge pct={s.percent} tone={m.tone} size={78}><span className="lr-g-ico">{m.icon}</span></Gauge>
              <b>{m.label}</b>
              <em style={{ color: lw.tone }}>{s.percent == null ? 'boshlanmagan' : s.percent + '%'}</em>
              <small>{s.lessonsPassed}/{s.lessonsTotal} dars</small>
            </button>
          );
        })}
      </div>

      {sel && (() => {
        const m = SKILL_META[sel.skill];
        const about = SKILL_ABOUT[sel.skill];
        const lw = levelWord(sel.percent);
        const acc = sel.answered ? Math.round((sel.correct / sel.answered) * 100) : null;
        const lessonPct = sel.lessonsTotal ? Math.round((sel.lessonsPassed / sel.lessonsTotal) * 100) : 0;
        const recent = [...sel.recent].reverse();
        return (
          <Card key={sel.skill} className="lr-es-detail rise" style={{ ['--tone' as string]: m.tone }}>
            <header className="lr-es-skill-head">
              <span className="lr-es-skill-ico">{m.icon}</span>
              <div><b>{m.label}</b><small>{about.icon} {about.what}</small></div>
            </header>

            {sel.attempts === 0 ? (
              <div className="lr-es-startbox">
                <p>Bu yo'nalish bo'yicha hali dars bajarilmagan.</p>
                {sel.lessonsTotal > 0 && <Button onClick={() => navigate('/learn')}>Boshlash →</Button>}
              </div>
            ) : (
              <>
                <div className="lr-es-triple">
                  <div><Gauge pct={lessonPct} tone={m.tone} size={74}><b>{lessonPct}%</b></Gauge><small>Darslar</small></div>
                  <div><Gauge pct={acc} tone={m.tone} size={74}><b>{acc == null ? '—' : acc + '%'}</b></Gauge><small>Aniqlik</small></div>
                  <div><Gauge pct={sel.examPercent} tone={m.tone} size={74}><b>{sel.examPercent == null ? '—' : sel.examPercent + '%'}</b></Gauge><small>Imtihon</small></div>
                </div>

                {recent.length > 0 && (
                  <div className="lr-es-bars2">
                    <b>Oxirgi {recent.length} ta dars natijasi</b>
                    <div className="lr-es-columns">
                      <span className="lr-es-passline" style={{ bottom: stats.passMark + '%' }}><em>{stats.passMark}%</em></span>
                      {recent.map((r, i) => (
                        <span key={i} className="lr-es-col" title={r.title}>
                          <i className={r.passed ? 'ok' : 'no'} style={{ height: Math.max(r.percent, 4) + '%' }} />
                          <small>{r.percent}%</small>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="lr-es-facts">
                  <span>🔁 {sel.attempts} ta urinish</span>
                  <span>🧮 {sel.correct} / {sel.answered} to'g'ri</span>
                  <span>🕒 {whenText(sel.lastAt)}</span>
                  <span style={{ color: lw.tone }}>{lw.icon} {lw.label}</span>
                </div>

                <div className={`lr-es-verdict ${sel.skill === stats.weakest ? 'weak' : ''}`}>
                  <b>{sel.skill === stats.weakest ? '🎯 Nimani kuchaytirish kerak' : '📝 Xulosa'}</b>
                  <p>
                    {sel.percent != null && sel.percent >= 85 && "Natijangiz juda yaxshi. Darajani saqlash uchun haftada bir marta takrorlash yetarli."}
                    {sel.percent != null && sel.percent >= 70 && sel.percent < 85 && "Yaxshi natija. Quyidagi darslarni qayta ishlasangiz, 85% dan oshasiz."}
                    {sel.percent != null && sel.percent >= 50 && sel.percent < 70 && "O'rtacha: qoidalar tushunilgan, lekin aniqlik yetmayapti. Bir darsni bir necha marta ishlang."}
                    {sel.percent != null && sel.percent < 50 && "Bu yo'nalish zaif. Kunlik maqsadga avval shuni qo'shing va oson darslardan boshlang."}
                  </p>
                  <p className="lr-es-tip">💡 {m.tip}</p>
                </div>

                {sel.weakLessons.length > 0 && (
                  <div className="lr-es-weaklist">
                    <b>⚠️ Qayta ishlash kerak</b>
                    {sel.weakLessons.map((w) => (
                      <button key={w.code} onClick={() => navigate(`/learn/lesson/${w.code}`)}>
                        <span>{w.title}</span><em>{w.bestScore}%</em><i>→</i>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <details className="lr-es-about"><summary>ℹ️ Foiz qanday hisoblanadi?</summary>
              <p>{about.how}</p>
              <p>Yo'nalish foizi — mashqlar aniqligi va oxirgi imtihon natijasining o'rtachasi. Dars {stats.passMark}% va undan yuqori bilan o'zlashtirilgan hisoblanadi.</p>
            </details>
          </Card>
        );
      })()}
    </>
  );
}

export function LearnStatsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<LearnStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    learnApi.stats().then(setStats).catch((e) => setError(errorMessage(e, "Statistikani yuklab bo'lmadi")));
  }, []);

  if (!stats) return error ? <Notice>{error}</Notice> : <Spinner />;
  const weakest = stats.weakest ? SKILL_META[stats.weakest] : null;

  return (
    <>
      <PageHeader title="Ingliz tili statistikasi" back={() => navigate('/learn')} />
      {!stats.level && <Notice kind="info">Avval darajangizni tanlang.</Notice>}

      {weakest && (
        <Card className="lr-weak rise" >
          <span className="lr-weak-ico">{weakest.icon}</span>
          <div>
            <small>Eng ko'proq kuchaytirish kerak</small>
            <b>{weakest.label}</b>
            <p>{weakest.tip}</p>
          </div>
        </Card>
      )}
      {stats.level && !weakest && <Notice kind="info">Hali ma'lumot yo'q. Bir nechta dars bajaring, shunda qaysi yo'nalish zaifligi ko'rinadi.</Notice>}

      {stats.skills.length > 0 && (
        <Card className="rise">
          <div className="lr-sec-head"><h2>Yo'nalishlar ({stats.level})</h2></div>
          {stats.skills.map((s) => {
            const m = SKILL_META[s.skill];
            return (
              <div key={s.skill} className={`lr-stat ${s.skill === stats.weakest ? 'weak' : ''}`}>
                <div className="lr-stat-head">
                  <b>{m.icon} {m.label}</b>
                  <span>{s.lessonsTotal === 0 ? 'tez orada' : s.percent == null ? "ma'lumot yo'q" : `${s.percent}%`}</span>
                </div>
                <ProgressBar pct={s.percent ?? 0} color={m.tone} />
                <small>
                  {s.lessonsTotal === 0 && "Bu yo'nalish bo'yicha darslar hali qo'shilmagan"}
                  {s.lessonsTotal > 0 && `Darslar: ${s.lessonsPassed}/${s.lessonsTotal}`}
                  {s.lessonPercent != null && ` · mashqlar ${s.lessonPercent}%`}
                  {s.examPercent != null && ` · imtihon ${s.examPercent}%`}
                </small>
              </div>
            );
          })}
        </Card>
      )}
    </>
  );
}
