import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Progress, progressApi, reviewApi, ReviewSummary, statsApi, StatsSummary, Word, wordsApi } from '../api';
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

/** A circular gauge; the arc eases from empty to `pct` on first paint. */
function Ring({ pct, size = 132, stroke = 11, children }: { pct: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(Math.max(0, Math.min(1, pct / 100))));
    return () => cancelAnimationFrame(t);
  }, [pct]);
  const id = `g${size}`;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
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
  const [words, setWords] = useState<Word[] | null>(null);
  const [flip, setFlip] = useState(false);
  const [pick, setPick] = useState(0);

  useEffect(() => {
    progressApi.get().then(setProgress).catch(() => undefined);
    reviewApi.summary().then(setReview).catch(() => undefined);
    statsApi.summary().then(setStats).catch(() => undefined);
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

  return (
    <div className="home">
      <header className="home-head rise">
        <div>
          <div className="eyebrow">{greeting()}</div>
          <h1 className="home-title">
            {user.firstName || user.username}<span className="dot">.</span>
          </h1>
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
            <Ring pct={goalPct}>
              <div className="ring-num">{review?.todayDone ?? 0}</div>
              <div className="ring-sub">/ {review?.dailyGoal ?? user.dailyGoal}</div>
            </Ring>
            <div className="goal-text">
              {goalPct >= 100 ? 'Maqsad bajarildi 🎉' : `Yana ${Math.max(0, (review?.dailyGoal ?? user.dailyGoal) - (review?.todayDone ?? 0))} ta so'z`}
            </div>
          </div>
        </section>

        {/* level */}
        <section className="b b-level rise" style={{ ['--d' as string]: '0.19s' }}>
          <div className="eyebrow">Daraja</div>
          <div className="lvl-num">{progress?.level ?? 1}</div>
          <div className="lvl-title">{progress?.levelTitle ?? '—'}</div>
          <div className="lvl-bar">
            <i style={{ width: `${Math.min(100, levelPct)}%` }} />
          </div>
          <div className="lvl-sub">
            {progress ? `${progress.xpIntoLevel} / ${progress.xpForLevel} XP` : ''}
          </div>
        </section>

        {/* streak */}
        <section className="b b-streak rise" style={{ ['--d' as string]: '0.26s' }}>
          <div className="eyebrow">Ketma-ketlik</div>
          <div className="streak-row">
            <span className="flame" aria-hidden="true">🔥</span>
            <span className="streak-num">{stats?.currentStreak ?? 0}</span>
            <span className="streak-unit">kun</span>
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
