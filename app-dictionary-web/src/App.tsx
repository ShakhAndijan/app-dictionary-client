import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Achievement, Announcement, announcementsApi, progressApi } from './api';
import { useAuth } from './auth';
import { useTheme } from './theme';
import { Spinner } from './ui';
import HomePage from './pages/Home';
import { AdminLayout, AdminStatsPage, AdminUsersPage } from './pages/Admin';
import { AdminAnnouncementsPage, AdminAuditPage, AdminUserPage } from './pages/AdminMore';
import { onProgressCheck, TIER_META } from './util';
import { LoginPage, RegisterPage } from './pages/Auth';
import WordsPage from './pages/Words';
import StudyPage from './pages/Study';
import ProfilePage from './pages/Profile';
import { AchievementsPage, ChangePasswordPage, EditProfilePage, SettingsPage } from './pages/ProfilePages';
import { GroupDetailPage, GroupsPage } from './pages/Groups';
import { StatsPage, WeeklyPage } from './pages/Stats';
import { ExamPage, LearnPage, LearnStatsPage, LessonPage } from './pages/Learn';

const ico = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const NAV = [
  { to: '/', label: 'Bosh sahifa', end: true, icon: <svg {...ico}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /></svg> },
  { to: '/words', label: "So'zlar", icon: <svg {...ico}><path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z" /><path d="M9 9h5M9 12.5h5" /></svg> },
  { to: '/study', label: 'Mashq', icon: <svg {...ico}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg> },
  { to: '/learn', label: 'Ingliz tili', icon: <svg {...ico}><path d="M3 6.5 12 3l9 3.5-9 3.5-9-3.5Z" /><path d="M7 9v5c0 1.5 2.2 3 5 3s5-1.5 5-3V9" /><path d="M21 7v6" /></svg> },
  { to: '/profile', label: 'Profil', icon: <svg {...ico}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg> },
];

function Celebration({ items, onClose }: { items: Achievement[]; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast" role="status" onClick={onClose}>
      {items.map((a) => (
        <div key={a.code} style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: TIER_META[a.tier].color }}>
            🏆 Yangi yutuq · {TIER_META[a.tier].label}
          </div>
          <div style={{ fontWeight: 800 }}>{a.title}</div>
          <div className="muted" style={{ fontSize: 13 }}>
            {a.description} · +{a.xpReward} XP
          </div>
        </div>
      ))}
    </div>
  );
}

const DISMISSED_KEY = 'dismissed_announcements';

function readDismissed(): number[] {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/** Notices from the admins; a closed one stays closed on this browser. */
function Notices() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [hidden, setHidden] = useState<number[]>(readDismissed);

  useEffect(() => {
    announcementsApi.current().then(setItems).catch(() => undefined);
  }, []);

  const shown = items.filter((a) => !hidden.includes(a.id));
  if (shown.length === 0) return null;

  const close = (id: number) => {
    const next = [...hidden, id];
    setHidden(next);
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(next.slice(-50)));
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <div className="notices">
      {shown.map((a) => (
        <div key={a.id} className={`notice-bar ${a.severity.toLowerCase()}`} role="status">
          <span>{a.severity === 'INFO' ? 'ℹ️' : a.severity === 'WARNING' ? '⚠️' : '🚨'}</span>
          <div className="grow">{a.message}</div>
          <button onClick={() => close(a.id)} aria-label="Yopish">✕</button>
        </div>
      ))}
    </div>
  );
}

function Layout() {
  const { user, logout } = useAuth();
  const { scheme, setMode } = useTheme();
  const loc = useLocation();
  const [fresh, setFresh] = useState<Achievement[]>([]);

  useEffect(
    () =>
      onProgressCheck(() => {
        progressApi
          .get()
          .then((p) => {
            const unlocked = p.achievements.filter((a) => a.justUnlocked);
            if (unlocked.length > 0) {
              setFresh(unlocked);
              progressApi.seen().catch(() => undefined);
            }
          })
          .catch(() => undefined);
      }),
    []
  );

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || (user?.username?.[0] ?? '?').toUpperCase();

  return (
    <div className="shell">
      <div className="bg-aurora" aria-hidden="true" />
      <header className="dock-wrap">
        <div className="dock">
          <NavLink to="/" className="dock-brand" aria-label="Bosh sahifa">
            <span className="dock-mark" />
            <span className="dock-name">Lug'at</span>
          </NavLink>
          <nav className="dock-nav">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `dock-link ${isActive ? 'active' : ''}`}>
                {n.icon}
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="dock-tools">
            <button className="dock-btn" onClick={() => setMode(scheme === 'dark' ? 'light' : 'dark')} aria-label="Mavzuni almashtirish" title="Mavzu">
              {scheme === 'dark' ? '☀' : '☾'}
            </button>
            <NavLink to="/profile" className="dock-avatar" aria-label="Profil">
              {initials}
            </NavLink>
            <button className="dock-btn" onClick={logout} aria-label="Chiqish" title="Chiqish">
              ⎋
            </button>
          </div>
        </div>
      </header>
      <main className="main" key={loc.pathname}>
        <div className="container">
          <Notices />
          <Outlet />
        </div>
      </main>
      {fresh.length > 0 && <Celebration items={fresh} onClose={() => setFresh([])} />}
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (user.role === 'ADMIN') {
    return (
      <Routes>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminStatsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserPage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/lesson/:code" element={<LessonPage />} />
        <Route path="learn/exam" element={<ExamPage />} />
        <Route path="learn/stats" element={<LearnStatsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<EditProfilePage />} />
        <Route path="profile/password" element={<ChangePasswordPage />} />
        <Route path="profile/settings" element={<SettingsPage />} />
        <Route path="profile/achievements" element={<AchievementsPage />} />
        <Route path="profile/weekly" element={<WeeklyPage />} />
        <Route path="profile/stats" element={<StatsPage />} />
        <Route path="profile/groups" element={<GroupsPage />} />
        <Route path="profile/groups/:id" element={<GroupDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
