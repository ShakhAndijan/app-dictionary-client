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

  const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`.toUpperCase() || (user?.username[0] ?? '?').toUpperCase();
  const fullName = `${form.firstName} ${form.lastName}`.trim() || user?.username || '';
  const dirty = form.firstName !== (user?.firstName ?? '') || form.lastName !== (user?.lastName ?? '') || form.email !== (user?.email ?? '');
  const emailBad = form.email.trim() !== '' && !/^\S+@\S+\.\S+$/.test(form.email.trim());

  return (
    <>
      <header className="ac-head rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div>
          <div className="eyebrow">Hisob</div>
          <h1 className="dx-title">Profilni tahrirlash</h1>
        </div>
      </header>

      <div className="pe-wrap">
        <aside className="pe-card rise" style={{ ['--d' as string]: '0.04s' }}>
          <div className="pe-cover" aria-hidden="true" />
          <div className="pe-avatar">{initials}</div>
          <h2>{fullName}</h2>
          <div className="pe-user">@{user?.username}</div>
          <div className="pe-mail">{form.email || 'Email kiritilmagan'}</div>
          <p className="pe-hint">Bu ma'lumotlar guruhlar reytingida va profilingizda ko'rinadi.</p>
        </aside>

        <form className="pe-form rise" style={{ ['--d' as string]: '0.1s' }} onSubmit={submit}>
          <h3>Shaxsiy ma'lumotlar</h3>
          {error && <Notice>{error}</Notice>}
          <div className="pe-row">
            <label className="pe-field">
              <span>Ism</span>
              <div className="pe-input">
                <i aria-hidden="true">👤</i>
                <input value={form.firstName} onChange={set('firstName')} placeholder="Ismingiz" autoComplete="given-name" />
              </div>
            </label>
            <label className="pe-field">
              <span>Familiya</span>
              <div className="pe-input">
                <i aria-hidden="true">👤</i>
                <input value={form.lastName} onChange={set('lastName')} placeholder="Familiyangiz" autoComplete="family-name" />
              </div>
            </label>
          </div>
          <label className="pe-field">
            <span>Email</span>
            <div className={`pe-input ${emailBad ? 'bad' : ''}`}>
              <i aria-hidden="true">✉️</i>
              <input type="email" value={form.email} onChange={set('email')} placeholder="nom@example.com" autoComplete="email" />
            </div>
            {emailBad && <em className="pe-err">Email manzilni to'g'ri kiriting</em>}
          </label>
          <label className="pe-field">
            <span>Foydalanuvchi nomi</span>
            <div className="pe-input locked">
              <i aria-hidden="true">@</i>
              <input value={user?.username ?? ''} disabled />
              <b aria-hidden="true">🔒</b>
            </div>
            <em className="pe-note">Foydalanuvchi nomini o'zgartirib bo'lmaydi.</em>
          </label>
          <div className="pe-actions">
            <Button type="button" variant="outline" onClick={() => nav('/profile')}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={busy} disabled={!dirty || emailBad}>
              Saqlash
            </Button>
          </div>
        </form>
      </div>
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

  const [show, setShow] = useState(false);
  const rules = [
    { ok: newPassword.length >= 6, text: 'Kamida 6 ta belgi' },
    { ok: /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword), text: 'Harf va raqam aralash' },
    { ok: newPassword.length >= 10, text: '10 va undan ko\'p belgi (kuchliroq)' },
    { ok: confirm.length > 0 && confirm === newPassword, text: 'Parollar mos keladi' },
  ];
  const score = rules.slice(0, 3).filter((r) => r.ok).length;
  const level = ['', 'Zaif', "O'rtacha", 'Kuchli'][newPassword ? Math.max(1, score) : 0];
  const type = show ? 'text' : 'password';

  return (
    <>
      <header className="ac-head rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div>
          <div className="eyebrow">Xavfsizlik</div>
          <h1 className="dx-title">Parolni almashtirish</h1>
        </div>
      </header>

      <div className="pe-wrap">
        <aside className="pe-card rise" style={{ ['--d' as string]: '0.04s' }}>
          <div className="pe-cover pw" aria-hidden="true" />
          <div className="pe-avatar pw">🔒</div>
          <h2>Hisobingizni himoya qiling</h2>
          <ul className="pw-rules">
            {rules.map((r) => (
              <li key={r.text} className={r.ok ? 'ok' : ''}>
                <span>{r.ok ? '✓' : ''}</span>
                {r.text}
              </li>
            ))}
          </ul>
          <p className="pe-hint">Parol almashgach, boshqa qurilmalardagi seanslar yopiladi.</p>
        </aside>

        <form className="pe-form rise" style={{ ['--d' as string]: '0.1s' }} onSubmit={submit}>
          <h3>Yangi parol o'rnating</h3>
          {error && <Notice>{error}</Notice>}
          {ok && <Notice kind="ok">Parol almashtirildi. Boshqa qurilmalardagi seanslar yopildi.</Notice>}
          <label className="pe-field">
            <span>Joriy parol</span>
            <div className="pe-input">
              <i aria-hidden="true">🔑</i>
              <input type={type} value={oldPassword} onChange={(e) => setOld(e.target.value)} autoComplete="current-password" placeholder="Joriy parolingiz" />
            </div>
          </label>
          <label className="pe-field">
            <span>Yangi parol</span>
            <div className="pe-input">
              <i aria-hidden="true">🔒</i>
              <input type={type} value={newPassword} onChange={(e) => setNew(e.target.value)} autoComplete="new-password" placeholder="Yangi parol" />
              <button type="button" className="pe-eye" onClick={() => setShow(!show)} aria-label="Parolni ko'rsatish">
                {show ? 'Yashirish' : "Ko'rsatish"}
              </button>
            </div>
            <div className={`pw-meter s${newPassword ? Math.max(1, score) : 0}`}>
              <i /><i /><i />
              <b>{level}</b>
            </div>
          </label>
          <label className="pe-field">
            <span>Yangi parolni tasdiqlang</span>
            <div className={`pe-input ${confirm && confirm !== newPassword ? 'bad' : ''}`}>
              <i aria-hidden="true">🔒</i>
              <input type={type} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" placeholder="Parolni qayta kiriting" />
            </div>
            {confirm && confirm !== newPassword && <em className="pe-err">Parollar mos kelmadi</em>}
          </label>
          <div className="pe-actions">
            <Button type="button" variant="outline" onClick={() => nav('/profile')}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={busy} disabled={!oldPassword || !newPassword}>
              Almashtirish
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

const GOALS = [
  { n: 5, label: 'Yengil', icon: '🌱', min: 3 },
  { n: 10, label: 'Optimal', icon: '⚡', min: 6 },
  { n: 15, label: 'Faol', icon: '🔥', min: 9 },
  { n: 20, label: 'Qat\'iy', icon: '🚀', min: 12 },
  { n: 30, label: 'Jiddiy', icon: '🏆', min: 18 },
];
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
      <header className="ac-head rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div>
          <div className="eyebrow">Moslashtiring</div>
          <h1 className="dx-title">Maqsad va ko'rinish</h1>
        </div>
      </header>
      {error && <Notice>{error}</Notice>}

      <section className="st-set rise" style={{ ['--d' as string]: '0.04s' }}>
        <div className="st-set-head">
          <div>
            <h2>Kunlik maqsad</h2>
            <p>Kuniga nechta so'zni mashq qilmoqchisiz? Maqsadga yetsangiz seriya davom etadi.</p>
          </div>
          <div className="st-set-now">
            <b>{goal}</b>
            <small>so'z / kun</small>
          </div>
        </div>
        <div className="gs-grid">
          {GOALS.map((g) => (
            <button key={g.n} className={`gs-tile ${g.n === goal ? 'on' : ''}`} disabled={saving} onClick={() => pickGoal(g.n)}>
              <span className="gs-ico">{g.icon}</span>
              <b>{g.n} ta</b>
              <small>{g.label}</small>
              <em>~{g.min} daqiqa</em>
            </button>
          ))}
        </div>
      </section>

      <section className="st-set rise" style={{ ['--d' as string]: '0.1s' }}>
        <div className="st-set-head">
          <div>
            <h2>Ko'rinish</h2>
            <p>Tizim rejimi qurilmangiz sozlamasiga ergashadi.</p>
          </div>
        </div>
        <div className="th-grid">
          {MODES.map((m) => (
            <button key={m.key} className={`th-tile ${mode === m.key ? 'on' : ''}`} onClick={() => setMode(m.key)}>
              <span className={`th-prev ${m.key}`} aria-hidden="true">
                <i /><i /><i />
              </span>
              <b>{m.label}</b>
              {mode === m.key && <span className="th-check">✓</span>}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

type AchFilter = 'all' | 'done' | 'todo';

export function AchievementsPage() {
  const nav = useNavigate();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<AchFilter>('all');

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

  const all = progress.achievements;
  const done = all.filter((a) => a.unlocked);
  const total = Math.max(1, progress.totalAchievements);
  const pct = Math.round((progress.unlockedCount / total) * 100);
  const earnedXp = done.reduce((sum, a) => sum + a.xpReward, 0);
  const next = all.filter((a) => !a.unlocked).sort((a, b) => b.current / b.target - a.current / a.target)[0];

  // Unlocked first, then the closest to unlocking.
  const sorted = [...all].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return b.current / b.target - a.current / a.target;
  });
  const shown = sorted.filter((a) => (filter === 'all' ? true : filter === 'done' ? a.unlocked : !a.unlocked));
  const tabs: { key: AchFilter; label: string; n: number }[] = [
    { key: 'all', label: 'Hammasi', n: all.length },
    { key: 'done', label: 'Ochilgan', n: done.length },
    { key: 'todo', label: 'Jarayonda', n: all.length - done.length },
  ];
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <>
      <header className="ac-head rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div>
          <div className="eyebrow">Sizning nishonlaringiz</div>
          <h1 className="dx-title">Yutuqlar</h1>
        </div>
      </header>

      <section className="ac-hero rise" style={{ ['--d' as string]: '0.04s' }}>
        <div className="ac-ring">
          <svg viewBox="0 0 108 108" aria-hidden="true">
            <circle cx="54" cy="54" r={R} className="ac-ring-bg" />
            <circle cx="54" cy="54" r={R} className="ac-ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
          </svg>
          <div className="ac-ring-txt">
            <b>{pct}%</b>
            <small>ochilgan</small>
          </div>
        </div>
        <div className="ac-hero-info">
          <h2>
            {progress.unlockedCount} <small>/ {progress.totalAchievements} yutuq</small>
          </h2>
          <p>Mashq qiling, so'z qo'shing va seriyani saqlang. Har bir yutuq sizga XP beradi.</p>
          <div className="ac-chips">
            <span>✦ {earnedXp} XP yutuqlardan</span>
            {(['GOLD', 'SILVER', 'BRONZE'] as const).map((t) => (
              <span key={t} style={{ ['--tone' as string]: TIER_META[t].color }} className="tier">
                <i /> {done.filter((a) => a.tier === t).length} {TIER_META[t].label.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
        {next && (
          <div className="ac-next">
            <small>Keyingi nishon</small>
            <div className="ac-next-row">
              <span className="ac-next-ico">{next.icon}</span>
              <b>{next.title}</b>
            </div>
            <ProgressBar pct={Math.min(100, (next.current / Math.max(1, next.target)) * 100)} color={TIER_META[next.tier].color} />
            <small>
              {next.current} / {next.target} · +{next.xpReward} XP
            </small>
          </div>
        )}
      </section>

      <div className="dx-filters ac-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={filter === t.key} className={`dx-seg ${filter === t.key ? 'on' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label} <em>{t.n}</em>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="muted center" style={{ padding: 30 }}>Bu bo'limda hozircha yutuq yo'q.</p>
      ) : (
        <div className="ac-grid">
          {shown.map((a, i) => {
            const tier = TIER_META[a.tier];
            const p = Math.min(100, Math.round((a.current / Math.max(1, a.target)) * 100));
            return (
              <article key={a.code} className={`ac-card rise ${a.unlocked ? 'on' : ''}`} style={{ ['--tone' as string]: tier.color, ['--d' as string]: `${Math.min(i, 12) * 0.03}s` }}>
                <div className="ac-ico">{a.unlocked ? a.icon : '🔒'}</div>
                <div className="ac-body">
                  <div className="ac-top">
                    <b>{a.title}</b>
                    <span className="ac-tier">{tier.label}</span>
                  </div>
                  <p>{a.description}</p>
                  {a.unlocked ? (
                    <div className="ac-done">
                      ✓ Ochilgan <em>+{a.xpReward} XP</em>
                    </div>
                  ) : (
                    <>
                      <div className="ac-bar"><i style={{ width: `${p}%` }} /></div>
                      <div className="ac-meta">
                        <span>
                          {a.current} / {a.target}
                        </span>
                        <em>+{a.xpReward} XP</em>
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
