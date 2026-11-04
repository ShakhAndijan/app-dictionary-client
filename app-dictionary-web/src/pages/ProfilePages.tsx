import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, errorMessage, Progress, progressApi } from '../api';
import { useAuth } from '../auth';
import { ThemeMode, useTheme } from '../theme';
import { Button, Card, Field, Notice, PageHeader, ProgressBar, Spinner } from '../ui';
import { TIER_META } from '../util';

export function EditProfilePage() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    setBusy(true);
    setError('');
    try {
      setUser(await authApi.updateProfile({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() }));
      nav('/profile');
    } catch (err) {
      setError(errorMessage(err, "Profilni saqlab bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Profilni tahrirlash" back={() => nav('/profile')} />
      <Card>
        <form onSubmit={submit}>
          {error && <Notice>{error}</Notice>}
          <Field label="Ism" value={form.firstName} onChange={set('firstName')} />
          <Field label="Familiya" value={form.lastName} onChange={set('lastName')} />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} />
          <Button type="submit" block loading={busy}>
            Saqlash
          </Button>
        </form>
      </Card>
    </>
  );
}

export function ChangePasswordPage() {
  const { adopt } = useAuth();
  const nav = useNavigate();
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setOk(false);
    if (newPassword.length < 6) return setError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
    if (newPassword !== confirm) return setError('Yangi parollar mos kelmadi');
    setBusy(true);
    setError('');
    try {
      // The server signs out every other session and returns fresh tokens for this one.
      adopt(await authApi.changePassword(oldPassword, newPassword));
      setOk(true);
      setOld('');
      setNew('');
      setConfirm('');
    } catch (err) {
      setError(errorMessage(err, "Parolni almashtirib bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Parolni almashtirish" back={() => nav('/profile')} />
      <Card>
        <form onSubmit={submit}>
          {error && <Notice>{error}</Notice>}
          {ok && <Notice kind="ok">Parol almashtirildi. Boshqa qurilmalardagi seanslar yopildi.</Notice>}
          <Field label="Joriy parol" type="password" value={oldPassword} onChange={(e) => setOld(e.target.value)} autoComplete="current-password" />
          <Field label="Yangi parol" type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} autoComplete="new-password" />
          <Field label="Yangi parolni tasdiqlang" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          <Button type="submit" block loading={busy} disabled={!oldPassword || !newPassword}>
            Almashtirish
          </Button>
        </form>
      </Card>
    </>
  );
}

const GOALS = [5, 10, 15, 20, 30];
const MODES: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'Tizim' },
  { key: 'light', label: 'Kunduzgi' },
  { key: 'dark', label: 'Tungi' },
];

export function SettingsPage() {
  const { user, setUser } = useAuth();
  const { mode, setMode } = useTheme();
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const goal = user?.dailyGoal ?? 10;

  const pickGoal = async (g: number) => {
    if (g === goal || saving) return;
    setSaving(true);
    setError('');
    try {
      setUser(await authApi.updateProfile({ dailyGoal: g }));
    } catch (e) {
      setError(errorMessage(e, "Maqsadni saqlab bo'lmadi"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Maqsad va ko'rinish" back={() => nav('/profile')} />
      {error && <Notice>{error}</Notice>}
      <Card className="mb">
        <b>Kunlik maqsad</b>
        <p className="muted">Kuniga nechta so'z mashq qilmoqchisiz?</p>
        <div className="tabs" style={{ marginBottom: 0 }}>
          {GOALS.map((g) => (
            <button key={g} className={`tab ${g === goal ? 'on' : ''}`} disabled={saving} onClick={() => pickGoal(g)}>
              {g} ta
            </button>
          ))}
        </div>
      </Card>
      <Card>
        <b>Ko'rinish</b>
        <p className="muted">Tizim rejimi qurilmangiz sozlamasiga ergashadi.</p>
        <div className="segment">
          {MODES.map((m) => (
            <button key={m.key} className={mode === m.key ? 'on' : ''} onClick={() => setMode(m.key)}>
              {m.label}
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}

export function AchievementsPage() {
  const nav = useNavigate();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    progressApi
      .get()
      .then(setProgress)
      .catch(() => setError(true));
  }, []);

  if (!progress) {
    return (
      <>
        <PageHeader title="Yutuqlar" back={() => nav('/profile')} />
        {error ? <p className="muted center">Yutuqlarni yuklab bo'lmadi</p> : <Spinner />}
      </>
    );
  }

  // Unlocked first, then the closest to unlocking.
  const sorted = [...progress.achievements].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return b.current / b.target - a.current / a.target;
  });

  return (
    <>
      <PageHeader title="Yutuqlar" back={() => nav('/profile')} />
      <p style={{ fontWeight: 700 }}>
        {progress.unlockedCount} / {progress.totalAchievements} yutuq ochilgan
      </p>
      {sorted.map((a) => {
        const tier = TIER_META[a.tier];
        const pct = Math.min(100, Math.round((a.current / Math.max(1, a.target)) * 100));
        return (
          <Card key={a.code} className="mb">
            <div className="ach-row" style={{ marginBottom: 0 }}>
              <div
                className="ach-badge"
                style={a.unlocked ? { background: `${tier.color}22`, borderColor: tier.color } : { background: 'var(--bg)' }}
              >
                {a.unlocked ? '🏅' : '🔒'}
              </div>
              <div className="grow">
                <div className="row">
                  <b className="grow">{a.title}</b>
                  <span style={{ fontSize: 11, fontWeight: 800, color: tier.color }}>{tier.label}</span>
                </div>
                <div className="muted" style={{ fontSize: 13 }}>{a.description}</div>
                {a.unlocked ? (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--secondary)', marginTop: 6 }}>
                    Ochilgan · +{a.xpReward} XP
                  </div>
                ) : (
                  <>
                    <div style={{ marginTop: 8 }}>
                      <ProgressBar pct={pct} color={tier.color} />
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {a.current} / {a.target} · +{a.xpReward} XP
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
}
