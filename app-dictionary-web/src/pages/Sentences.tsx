import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { errorMessage, SentenceMode, SentenceStats, SentenceStatus, sentencesApi, Word, wordsApi } from '../api';
import { Card, Notice, ProgressBar, Spinner } from '../ui';
import { SentenceGame } from './StudySentence';

const MODES: { mode: SentenceMode; icon: string; title: string; sub: string; color: string }[] = [
  { mode: 'TODAY', icon: '📅', title: "Bugungi so'zlar", sub: "Bugun qo'shgan so'zlaringiz bilan", color: '#0ea5e9' },
  { mode: 'WEAK', icon: '⚡', title: "Zaif so'zlar", sub: "Ko'p xato qilgan so'zlaringiz bilan", color: '#ef4444' },
  { mode: 'ALL', icon: '🔀', title: "Barcha so'zlar", sub: "Butun lug'atingizdan tasodifiy so'zlar", color: '#10b981' },
];

const DAYS = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

export default function SentencesPage({ onBack }: { onBack?: () => void }) {
  const [words, setWords] = useState<Word[]>([]);
  const [status, setStatus] = useState<SentenceStatus | null>(null);
  const [stats, setStats] = useState<SentenceStats | null>(null);
  const [counts, setCounts] = useState<Record<SentenceMode, number[]>>({ TODAY: [], WEAK: [], ALL: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [active, setActive] = useState<SentenceMode | null>(null);
  const [pool, setPool] = useState<Word[]>([]);
  const [session, setSession] = useState(0);

  const load = useCallback(async () => {
    try {
      const [w, s, st, t, wk, al] = await Promise.all([
        wordsApi.list(),
        sentencesApi.status(),
        sentencesApi.stats(),
        sentencesApi.words('TODAY'),
        sentencesApi.words('WEAK'),
        sentencesApi.words('ALL'),
      ]);
      setWords(w);
      setStatus(s);
      setStats(st);
      setCounts({ TODAY: t, WEAK: wk, ALL: al });
      setError('');
    } catch (e) {
      setError(errorMessage(e, "Ma'lumotni yuklab bo'lmadi"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!active) load();
  }, [active, load]);

  if (loading) return <Spinner />;

  if (active && status) {
    const m = MODES.find((x) => x.mode === active)!;
    return (
      <SentenceGame
        key={session}
        words={pool}
        remaining={status.remainingToday}
        title={m.title}
        goal={{ done: status.doneToday, target: status.dailyGoal }}
        onExit={() => setActive(null)}
      />
    );
  }

  const start = (mode: SentenceMode) => {
    const ids = new Set(counts[mode]);
    const list = words.filter((w) => ids.has(w.id));
    if (list.length === 0) return;
    setPool(list);
    setSession((n) => n + 1);
    setActive(mode);
  };

  const goal = status?.dailyGoal ?? 10;
  const done = status?.doneToday ?? 0;
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const max = Math.max(1, ...(stats?.last7.map((d) => d.count) ?? [1]), goal);

  return (
    <>
      <header className="sx-head rise">
        <div>
          {onBack && (
            <button className="gp-back" onClick={onBack} aria-label="Orqaga" style={{ marginBottom: 10 }}>←</button>
          )}
          <div className="eyebrow">Sun'iy intellekt bilan</div>
          <h1 className="dx-title">Gap tuzish</h1>
        </div>
        {status?.enabled && (
          <div className="sx-goal">
            <div className="sx-goal-row">
              <span>Bugungi maqsad</span>
              <b>
                {Math.min(done, goal)} <small>/ {goal} ta gap</small>
              </b>
            </div>
            <ProgressBar pct={pct} color={pct >= 100 ? 'var(--secondary)' : undefined} />
          </div>
        )}
      </header>

      {error && <Notice>{error}</Notice>}
      {status && !status.enabled && <Notice>Gap tekshirish hozircha sozlanmagan (sun'iy intellekt kaliti yo'q).</Notice>}

      {words.length === 0 ? (
        <Card className="empty">
          <div className="empty-emoji">✍️</div>
          <p className="muted">Gap tuzish uchun avval so'z qo'shing.</p>
          <Link to="/words" className="muted">So'zlarga o'tish →</Link>
        </Card>
      ) : (
        <>
          <section className="sx-sec rise" style={{ ['--d' as string]: '0.05s' }}>
            <div className="sx-sec-head">
              <div>
                <h2>Qaysi so'zlar bilan?</h2>
                <p>Bittasini tanlang, so'z bilan gap yozing, sun'iy intellekt baho beradi.</p>
              </div>
            </div>
            <div className="sx-grid">
              {MODES.map((m) => {
                const n = counts[m.mode].length;
                return (
                  <button key={m.mode} className="mode-card" disabled={!status?.enabled || n === 0} onClick={() => start(m.mode)}>
                    <div className="mode-icon" style={{ background: `${m.color}1f` }}>{m.icon}</div>
                    <div className="grow">
                      <div className="mode-title">{m.title}</div>
                      <div className="mode-sub">{n > 0 ? `${m.sub} · ${n} ta` : m.mode === 'WEAK' ? "Hozircha zaif so'z yo'q" : m.mode === 'TODAY' ? "Bugun so'z qo'shilmagan" : "So'z yo'q"}</div>
                    </div>
                    <span className="muted">›</span>
                  </button>
                );
              })}
            </div>
          </section>

          {stats && (
            <section className="sx-sec rise" style={{ ['--d' as string]: '0.12s' }}>
              <div className="sx-sec-head">
                <div>
                  <h2>Natijalar</h2>
                  <p>Oxirgi 30 kun bo'yicha.</p>
                </div>
              </div>
              <Card>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
                  <Fact label="Jami gaplar" value={String(stats.total)} />
                  <Fact label="O'rtacha ball" value={stats.total ? `${stats.averageScore}` : '—'} />
                  <Fact label="Yaxshi gaplar (70+)" value={String(stats.good)} />
                  <Fact label="Maqsad bajarilgan kunlar" value={String(stats.goalDays)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 96 }}>
                  {stats.last7.map((d) => {
                    const dt = new Date(`${d.date}T00:00:00`);
                    return (
                      <div key={d.date} style={{ flex: 1, textAlign: 'center' }} title={`${d.count} ta gap`}>
                        <div
                          style={{
                            height: Math.max(4, (d.count / max) * 64),
                            borderRadius: 6,
                            background: d.count >= goal ? 'var(--secondary)' : 'var(--primary)',
                            opacity: d.count ? 1 : 0.25,
                          }}
                        />
                        <small className="muted">{DAYS[dt.getDay()]}</small>
                        <div style={{ fontSize: 12 }}>{d.count}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </section>
          )}
        </>
      )}
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
      <small className="muted">{label}</small>
    </div>
  );
}
