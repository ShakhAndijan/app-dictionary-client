import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Progress, progressApi, reviewApi, ReviewSummary } from '../api';
import { useAuth } from '../auth';
import { Button, Card, ProgressBar } from '../ui';

const MENU = [
  { to: '/profile/edit', icon: '✏️', label: 'Profilni tahrirlash', color: '#4f46e5' },
  { to: '/profile/password', icon: '🔒', label: 'Parolni almashtirish', color: '#f59e0b' },
  { to: '/profile/achievements', icon: '🏆', label: 'Yutuqlar', color: '#e5a100' },
  { to: '/profile/groups', icon: '👥', label: "Do'stlar bilan reyting", color: '#8b5cf6' },
  { to: '/profile/weekly', icon: '📅', label: 'Haftalik hisobot', color: '#0ea5e9' },
  { to: '/profile/stats', icon: '📊', label: 'Statistika', color: '#10b981' },
  { to: '/profile/settings', icon: '⚙️', label: 'Maqsad va ko‘rinish', color: '#ec4899' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [review, setReview] = useState<ReviewSummary | null>(null);

  useEffect(() => {
    progressApi.get().then(setProgress).catch(() => undefined);
    reviewApi.summary().then(setReview).catch(() => undefined);
  }, []);

  if (!user) return null;
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.username[0].toUpperCase();

  return (
    <>
      <div className="col" style={{ alignItems: 'center', marginBottom: 22 }}>
        <div className="avatar">{initials}</div>
        <h1 style={{ fontSize: 22, marginTop: 10 }}>
          {user.firstName} {user.lastName}
        </h1>
        <div className="muted">@{user.username}</div>
        <div className="muted">{user.email}</div>
      </div>

      {progress && (
        <Card className="mb">
          <div className="row">
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)' }}>DARAJA {progress.level}</div>
              <div style={{ fontSize: 19, fontWeight: 800 }}>{progress.levelTitle}</div>
            </div>
            <div className="grow" />
            <div className="center">
              <div style={{ fontSize: 22, fontWeight: 800 }}>{progress.totalXp}</div>
              <div className="muted" style={{ fontSize: 12 }}>jami XP</div>
            </div>
          </div>
          <div style={{ margin: '12px 0 6px' }}>
            <ProgressBar pct={(progress.xpIntoLevel / Math.max(1, progress.xpForLevel)) * 100} />
          </div>
          <div className="row muted" style={{ fontSize: 12 }}>
            <span>
              {progress.xpIntoLevel} / {progress.xpForLevel} XP
            </span>
            <div className="grow" />
            <span>
              Bugun +{progress.todayXp} · Hafta +{progress.weekXp}
            </span>
          </div>
        </Card>
      )}

      {review && (
        <Card className="mb">
          <div className="row">
            <b>Bugungi maqsad</b>
            <div className="grow" />
            <span className="muted">
              {review.todayDone} / {review.dailyGoal} so'z
            </span>
          </div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar
              pct={(review.todayDone / Math.max(1, review.dailyGoal)) * 100}
              color={review.todayDone >= review.dailyGoal ? 'var(--secondary)' : undefined}
            />
          </div>
        </Card>
      )}

      <Card className="mb">
        {MENU.map((m) => (
          <Link key={m.to} to={m.to} className="menu-row">
            <div className="menu-ico" style={{ background: `${m.color}1f` }}>
              {m.icon}
            </div>
            <span className="grow">{m.label}</span>
            <span className="muted">›</span>
          </Link>
        ))}
      </Card>

      <Button variant="outline" block onClick={logout}>
        Chiqish
      </Button>
    </>
  );
}
