import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DailyStats, Progress, progressApi, reviewApi, ReviewSummary, statsApi, StatsSummary, Word, wordsApi } from '../api';
import { useAuth } from '../auth';
import { Spinner } from '../ui';
import { speakEnglish } from '../util';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Xayrli tun';
  if (h < 12) return 'Xayrli tong';
  if (h < 18) return 'Xayrli kun';
  return 'Xayrli kech';
}

const WEEKDAYS = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const DAY_NAMES = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];

function isoDay(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Counts up to `value` once it arrives, so the numbers feel alive. */
function useCountUp(value: number, ms = 900): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return n;
}

function Count({ value }: { value: number }) {
  return <>{useCountUp(value)}</>;
}

/** A circular gauge; the arc eases from empty to `pct` on first paint. */
function Ring({ pct, size = 132, stroke = 11, done = false, children }: { pct: number; size?: number; stroke?: number; done?: boolean; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(Math.max(0, Math.min(1, pct / 100))));
    return () => cancelAnimationFrame(t);
  }, [pct]);
  const id = `g${size}`;
  return (
    <div className={`ring ${done ? 'done' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={done ? '#34d399' : '#6366f1'} />
            <stop offset="100%" stopColor={done ? '#fbbf24' : '#22d3ee'} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="ring-in">{children}</div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [words, setWords] = useState<Word[] | null>(null);
  const [flip, setFlip] = useState(false);
  const [pick, setPick] = useState(0);

  useEffect(() => {
    progressApi.get().then(setProgress).catch(() => undefined);
    reviewApi.summary().then(setReview).catch(() => undefined);
    statsApi.summary().then(setStats).catch(() => undefined);
    statsApi.daily().then(setDaily).catch(() => undefined);
    wordsApi.list().then(setWords).catch(() => setWords([]));
  }, []);

  const spotlight = useMemo(() => {
    if (!words || words.length === 0) return null;
    const pool = words.filter((w) => w.state !== 'MASTERED');
    const list = pool.length > 0 ? pool : words;
    return list[pick % list.length];
  }, [words, pick]);

  if (!user) return null;
  if (!review && !progress && words === null) return <Spinner />;

  const goalPct = review ? (review.todayDone / Math.max(1, review.dailyGoal)) * 100 : 0;
  const levelPct = progress ? (progress.xpIntoLevel / Math.max(1, progress.xpForLevel)) * 100 : 0;
  const due = review?.dueCount ?? 0;
  const recent = (words ?? []).slice(0, 5);
  const goal = review?.dailyGoal ?? user.dailyGoal;
  const done = review?.todayDone ?? 0;
  const reached = done >= goal && goal > 0;
  const streak = stats?.currentStreak ?? 0;
  const now = new Date();

  const activeDays = new Set(daily.filter((d) => d.quizzesTaken > 0 || d.wordsAdded > 0).map((d) => d.date.slice(0, 10)));
  if (done > 0) activeDays.add(isoDay(now));
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { key: isoDay(d), label: WEEKDAYS[d.getDay()], today: i === 6 };
  });

  const vibe =
    review && review.totalWords === 0
      ? "Keling, birinchi so'zingizdan boshlaymiz."
      : reached
        ? "Bugungi maqsad bajarildi — zo'r ish! Xohlasangiz davom eting."
        : streak >= 3
          ? `${streak} kunlik ketma-ketlik! Uni uzib qo'ymang.`
          : done > 0
            ? `Yaxshi boshlandi, maqsadga ${Math.max(0, goal - done)} ta so'z qoldi.`
            : "Kichik qadam ham katta natijaga olib boradi.";

  const actions = [
    { to: '/study', icon: '🃏', title: 'Fleshkart', sub: 'Kartani aylantiring', tone: '#6366f1' },
    { to: '/study', icon: '✍️', title: 'Test', sub: 'Yozib javob bering', tone: '#10b981' },
    { to: '/study', icon: '🧩', title: 'Juftlash', sub: "So'z va tarjima", tone: '#a855f7' },
    { to: '/words', icon: '➕', title: 'Yangi so\'z', sub: "Lug'atni boyiting", tone: '#f59e0b' },
  ];

  return (
    <div className="home">
      <header className="home-head rise">
        <div>
          <div className="eyebrow">
            {greeting()} · {DAY_NAMES[now.getDay()]}, {now.getDate()}-{MONTHS[now.getMonth()]}
          </div>
          <h1 className="home-title">
            {user.firstName || user.username}
            <span className="wave" aria-hidden="true">👋</span>
          </h1>
          <p className="home-vibe">{vibe}</p>
        </div>
        <Link to="/profile/achievements" className="xp-chip" title="Yutuqlar">
          <span className="xp-spark">✦</span>
          {progress ? `${progress.totalXp} XP` : '—'}
          {progress && <span className="xp-lvl">{progress.level}-daraja</span>}
        </Link>
      </header>

      <div className="bento">
        {/* primary call to action */}
        <section className="b b-cta rise" style={{ ['--d' as string]: '0.05s' }}>
          <div className="cta-glow" aria-hidden="true" />
          <div className="eyebrow light">Bugungi mashq</div>
          <h2 className="cta-title">
            {due > 0 ? (
              <>
                <b>{due}</b> ta so'z takrorlashni kutyapti
              </>
            ) : review && review.totalWords === 0 ? (
              <>Birinchi so'zingizni qo'shing</>
            ) : (
              <>Hammasi joyida — yangisini o'rganamiz</>
            )}
          </h2>
          {progress && progress.todayXp > 0 && <div className="cta-pill">✦ Bugun +{progress.todayXp} XP</div>}
          <div className="cta-row">
            <Link to={review && review.totalWords === 0 ? '/words' : '/study'} className="cta-btn">
              {review && review.totalWords === 0 ? "So'z qo'shish" : 'Boshlash'}
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/words" className="cta-link">
              Lug'atni ochish
            </Link>
          </div>
        </section>

        {/* daily goal */}
        <section className="b b-goal rise" style={{ ['--d' as string]: '0.12s' }}>
          <div className="eyebrow">Kunlik maqsad</div>
          <div className="goal-body">
            <Ring pct={goalPct} done={reached}>
              <div className="ring-num">
                <Count value={done} />
              </div>
              <div className="ring-sub">/ {goal}</div>
            </Ring>
            <div className={`goal-text ${reached ? 'ok' : ''}`}>{reached ? 'Maqsad bajarildi 🎉' : `Yana ${Math.max(0, goal - done)} ta so'z`}</div>
          </div>
        </section>

        {/* level */}
        <section className="b b-level rise" style={{ ['--d' as string]: '0.19s' }}>
          <div className="eyebrow">Daraja</div>
          <div className="lvl-num">
            <Count value={progress?.level ?? 1} />
          </div>
          <div className="lvl-title">{progress?.levelTitle ?? '—'}</div>
          <div className="lvl-bar">
            <i style={{ width: `${Math.min(100, levelPct)}%` }} />
          </div>
          <div className="lvl-sub">
            {progress ? `Keyingi darajagacha ${Math.max(0, progress.xpForLevel - progress.xpIntoLevel)} XP` : ''}
          </div>
        </section>

        {/* streak */}
        <section className="b b-streak rise" style={{ ['--d' as string]: '0.26s' }}>
          <div className="eyebrow">Ketma-ketlik</div>
          <div className="streak-row">
            <span className="flame" aria-hidden="true">🔥</span>
            <span className="streak-num">
              <Count value={streak} />
            </span>
            <span className="streak-unit">kun</span>
          </div>
          <div className="week" aria-label="So'nggi 7 kun">
            {week.map((d) => (
              <div key={d.key} className={`wd ${activeDays.has(d.key) ? 'on' : ''} ${d.today ? 'today' : ''}`}>
                <i>{activeDays.has(d.key) ? '✓' : ''}</i>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="lvl-sub">Eng yaxshisi: {stats?.bestStreak ?? 0} kun</div>
        </section>

        {/* word spotlight */}
        <section className="b b-word rise" style={{ ['--d' as string]: '0.33s' }}>
          <div className="row">
            <div className="eyebrow">So'z e'tiborda</div>
            <div className="grow" />
            {spotlight && (
              <button className="mini" onClick={() => { setFlip(false); setPick((n) => n + 1); }} title="Boshqa so'z">
                ↻
              </button>
            )}
          </div>
          {spotlight ? (
            <button className={`flipper ${flip ? 'on' : ''}`} onClick={() => setFlip((f) => !f)} aria-label="So'zni aylantirish">
              <span className="flip-face">
                <span className="flip-word">{spotlight.english}</span>
                <span className="flip-hint">tarjimasini ko'rish</span>
              </span>
              <span className="flip-face flip-back">
                <span className="flip-word uz">{spotlight.uzbek}</span>
                {spotlight.definition && <span className="flip-def">{spotlight.definition}</span>}
              </span>
            </button>
          ) : (
            <div className="muted" style={{ padding: '22px 0' }}>Hozircha so'z yo'q.</div>
          )}
          {spotlight && (
            <button className="say" onClick={() => speakEnglish(spotlight.english)}>
              🔊 Eshitish
            </button>
          )}
        </section>

        {/* totals */}
        <section className="b b-totals rise" style={{ ['--d' as string]: '0.4s' }}>
          <div className="eyebrow">Lug'at</div>
          <div className="totals">
            <div>
              <b>{review?.totalWords ?? 0}</b>
              <span>jami</span>
            </div>
            <div>
              <b>{review?.learningCount ?? 0}</b>
              <span>o'rganilmoqda</span>
            </div>
            <div>
              <b>{review?.masteredCount ?? 0}</b>
              <span>o'zlashtirilgan</span>
            </div>
          </div>
          {review && review.totalWords > 0 && (
            <div className="stack-bar" aria-hidden="true">
              <i className="s-new" style={{ flex: review.newCount }} />
              <i className="s-learn" style={{ flex: review.learningCount }} />
              <i className="s-done" style={{ flex: review.masteredCount }} />
            </div>
          )}
        </section>

        {/* quick actions */}
        <section className="b-actions rise" style={{ ['--d' as string]: '0.44s' }}>
          {actions.map((a) => (
            <Link key={a.title} to={a.to} className="qa" style={{ ['--tone' as string]: a.tone }}>
              <span className="qa-ico">{a.icon}</span>
              <span className="qa-txt">
                <b>{a.title}</b>
                <small>{a.sub}</small>
              </span>
              <span className="qa-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </section>

        {/* recent */}
        <section className="b b-recent rise" style={{ ['--d' as string]: '0.47s' }}>
          <div className="row">
            <div className="eyebrow">So'nggi qo'shilganlar</div>
            <div className="grow" />
            <Link to="/words" className="cta-link dark">Barchasi →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="muted" style={{ padding: '14px 0' }}>Hali so'z qo'shilmagan.</div>
          ) : (
            <ul className="recent">
              {recent.map((w) => (
                <li key={w.id}>
                  <span className="r-en">{w.english}</span>
                  <span className="r-line" />
                  <span className="r-uz">{w.uzbek}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
