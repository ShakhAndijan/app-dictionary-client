import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Progress, progressApi, reviewApi, ReviewSummary, statsApi, StatsSummary } from '../api';
import { useAuth } from '../auth';
import { ProgressBar } from '../ui';

interface Item {
  to: string;
  icon: string;
  label: string;
  sub: string;
  color: string;
}

const ACTIVITY: Item[] = [
  { to: '/profile/achievements', icon: '🏆', label: 'Yutuqlar', sub: 'Ochilgan nishonlar va mukofotlar', color: '#e5a100' },
  { to: '/profile/weekly', icon: '📅', label: 'Haftalik hisobot', sub: 'Haftaning natijalari', color: '#0ea5e9' },
  { to: '/profile/stats', icon: '📊', label: 'Statistika', sub: "Kunlar va oylar bo'yicha", color: '#10b981' },
  { to: '/profile/groups', icon: '👥', label: "Do'stlar bilan reyting", sub: 'Guruhlar va musobaqa', color: '#8b5cf6' },
];

const ACCOUNT: Item[] = [
  { to: '/profile/edit', icon: '✏️', label: 'Profilni tahrirlash', sub: 'Ism, familiya va email', color: '#4f46e5' },
  { to: '/profile/password', icon: '🔒', label: 'Parolni almashtirish', sub: 'Xavfsizlik', color: '#f59e0b' },
  { to: '/profile/settings', icon: '⚙️', label: 'Maqsad va ko‘rinish', sub: 'Kunlik maqsad, mavzu', color: '#ec4899' },
];

function Tiles({ items }: { items: Item[] }) {
  return (
    <div className="pf-menu">
      {items.map((m) => (
        <Link key={m.to} to={m.to} className="pf-item" style={{ ['--tone' as string]: m.color }}>
          <span className="pf-ico">{m.icon}</span>
          <span className="pf-txt">
            <b>{m.label}</b>
            <small>{m.sub}</small>
          </span>
          <span className="pf-go" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [review, setReview] = useState<ReviewSummary | null>(null);
  const [stats, setStats] = useState<StatsSummary | null>(null);

  useEffect(() => {
    progressApi.get().then(setProgress).catch(() => undefined);
    reviewApi.summary().then(setReview).catch(() => undefined);
    statsApi.summary().then(setStats).catch(() => undefined);
  }, []);

  if (!user) return null;
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.username[0].toUpperCase();
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username;
  const levelPct = progress ? (progress.xpIntoLevel / Math.max(1, progress.xpForLevel)) * 100 : 0;
  const goalPct = review ? (review.todayDone / Math.max(1, review.dailyGoal)) * 100 : 0;

  return (
    <div className="pf">
      <section className="pf-hero rise">
        <div className="pf-cover" aria-hidden="true" />
        <div className="pf-id">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-who">
            <h1 className="pf-name">{fullName}</h1>
            <div className="pf-meta">
              <span>@{user.username}</span>
              {user.email && <span>{user.email}</span>}
            </div>
          </div>
          <Link to="/profile/edit" className="pf-edit">
            Tahrirlash
          </Link>
        </div>
        {progress && (
          <div className="pf-level">
            <div className="pf-level-top">
              <span className="pf-badge">{progress.level}-daraja</span>
              <b>{progress.levelTitle}</b>
              <div className="grow" />
              <span className="pf-xp">
                {progress.xpIntoLevel} / {progress.xpForLevel} XP
              </span>
            </div>
            <ProgressBar pct={levelPct} />
            <div className="pf-level-sub">Keyingi darajagacha {Math.max(0, progress.xpForLevel - progress.xpIntoLevel)} XP</div>
          </div>
        )}
      </section>

      <section className="pf-stats rise" style={{ ['--d' as string]: '0.06s' }}>
        <div className="pf-stat">
          <span className="pf-stat-ico">✦</span>
          <b>{progress?.totalXp ?? 0}</b>
          <small>Jami XP</small>
        </div>
        <div className="pf-stat">
          <span className="pf-stat-ico">🔥</span>
          <b>{stats?.currentStreak ?? 0}</b>
          <small>Kun ketma-ket</small>
        </div>
        <div className="pf-stat">
          <span className="pf-stat-ico">📚</span>
          <b>{review?.totalWords ?? 0}</b>
          <small>So'zlar</small>
        </div>
        <div className="pf-stat">
          <span className="pf-stat-ico">🏆</span>
          <b>
            {progress?.unlockedCount ?? 0}
            <em>/{progress?.totalAchievements ?? 0}</em>
          </b>
          <small>Yutuqlar</small>
        </div>
      </section>

      {review && (
        <section className="pf-goal rise" style={{ ['--d' as string]: '0.1s' }}>
          <div className="pf-goal-top">
            <b>Bugungi maqsad</b>
            <span>
              {review.todayDone} / {review.dailyGoal} so'z
              {progress && progress.todayXp > 0 ? ` · +${progress.todayXp} XP` : ''}
            </span>
          </div>
          <ProgressBar pct={goalPct} color={goalPct >= 100 ? 'var(--secondary)' : undefined} />
        </section>
      )}

      <section className="rise" style={{ ['--d' as string]: '0.14s' }}>
        <h2 className="pf-sec">Faollik va natijalar</h2>
        <Tiles items={ACTIVITY} />
      </section>

      <section className="rise" style={{ ['--d' as string]: '0.18s' }}>
        <h2 className="pf-sec">Hisob</h2>
        <Tiles items={ACCOUNT} />
      </section>

      <button className="pf-logout" onClick={logout}>
        <span aria-hidden="true">⎋</span> Hisobdan chiqish
      </button>
    </div>
  );
}
