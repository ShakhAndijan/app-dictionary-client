import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { adminApi, AdminInsights, AdminOverview, AdminUser, errorMessage } from '../api';
import { useAuth } from '../auth';
import { useTheme } from '../theme';
import { Button, Confirm, Field, Modal, Spinner } from '../ui';

export const nf = new Intl.NumberFormat('uz-UZ');

export function day(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB').split('/').join('.') : '—';
}

export function ago(iso: string | null): string {
  if (!iso) return '—';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'hozir';
  if (s < 3600) return `${Math.floor(s / 60)} daq oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} kun oldin`;
  return day(iso);
}

/* ------------------------------------------------------------ layout */

const ico = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const MODULES = [
  { to: '/admin', label: 'Statistika', end: true, icon: <svg {...ico}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg> },
  { to: '/admin/users', label: 'Foydalanuvchilar', end: false, icon: <svg {...ico}><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20c0-3.6 2.9-5.8 6.5-5.8s6.5 2.2 6.5 5.8" /><path d="M16 4.6a3.6 3.6 0 0 1 0 6.8M18 14.6c2 .7 3.5 2.4 3.5 5.4" /></svg> },
  { to: '/admin/announcements', label: "E'lonlar", end: false, icon: <svg {...ico}><path d="M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg> },
  { to: '/admin/audit', label: 'Jurnal', end: false, icon: <svg {...ico}><path d="M8 3h8l4 4v14H4V3z" /><path d="M8 11h8M8 15h8M8 7h4" /></svg> },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { scheme, setMode } = useTheme();
  const loc = useLocation();

  return (
    <div className="adm-shell">
      <div className="bg-aurora" aria-hidden="true" />
      <aside className="adm-side">
        <div className="adm-brand">
          <span className="dock-mark" />
          <div>
            <div className="adm-brand-name">Lug'at</div>
            <div className="adm-brand-tag">Admin</div>
          </div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-title">Modullar</div>
          {MODULES.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => `adm-link ${isActive ? 'active' : ''}`}>
              {m.icon}
              <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-foot">
          <div className="adm-me">
            <span className="ad-ava">{(user?.username ?? '?').slice(0, 1).toUpperCase()}</span>
            <div>
              <div className="ad-name">{user?.username}</div>
              <div className="muted ad-sub">Super admin</div>
            </div>
          </div>
          <div className="adm-foot-btns">
            <button className="adm-ghost" onClick={() => setMode(scheme === 'dark' ? 'light' : 'dark')}>
              {scheme === 'dark' ? '☀ Kunduzgi' : '☾ Tungi'}
            </button>
            <button className="adm-ghost" onClick={logout}>
              ⎋ Chiqish
            </button>
          </div>
        </div>
      </aside>

      <main className="adm-main" key={loc.pathname}>
        <Outlet />
      </main>
    </div>
  );
}

/* ------------------------------------------------------------ statistics */

function Stat({ label, value, hint, accent, delay }: { label: string; value: string; hint?: string; accent?: boolean; delay: number }) {
  return (
    <div className={`ad-stat rise ${accent ? 'accent' : ''}`} style={{ ['--d' as string]: `${delay}s` }}>
      <div className="eyebrow">{label}</div>
      <div className="ad-stat-val">{value}</div>
      {hint && <div className="ad-stat-hint">{hint}</div>}
    </div>
  );
}

function Chart({ series }: { series: AdminOverview['series'] }) {
  const max = Math.max(1, ...series.map((p) => Math.max(p.newUsers, p.activeUsers)));
  return (
    <div className="ad-chart">
      {series.map((p) => (
        <div key={p.date} className="ad-col" title={`${p.date}: ${p.activeUsers} faol, ${p.newUsers} yangi`}>
          <div className="ad-bars">
            <i className="b-active" style={{ height: `${(p.activeUsers / max) * 100}%` }} />
            <i className="b-new" style={{ height: `${(p.newUsers / max) * 100}%` }} />
          </div>
          <span>{new Date(p.date).getDate()}</span>
        </div>
      ))}
    </div>
  );
}

export function Failed({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="card center">
      <div className="notice notice-error">{message}</div>
      <button className="btn btn-primary" onClick={retry}>Qayta urinish</button>
    </div>
  );
}

export function AdminStatsPage() {
  const [o, setO] = useState<AdminOverview | null>(null);
  const [ins, setIns] = useState<AdminInsights | null>(null);
  const [days, setDays] = useState(14);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    adminApi.overview(days).then(setO).catch((e) => setError(errorMessage(e, "Ma'lumotlarni yuklab bo'lmadi")));
    adminApi.insights(days).then(setIns).catch(() => setIns(null));
  };
  useEffect(load, [days]);

  if (error && !o) return <Failed message={error} retry={load} />;
  if (!o) return <Spinner />;

  const activePct = o.totalUsers ? Math.round((o.activeLast7Days / o.totalUsers) * 100) : 0;

  return (
    <>
      <header className="home-head rise">
        <div>
          <div className="eyebrow">Modul</div>
          <h1 className="home-title">
            Statistika<span className="dot">.</span>
          </h1>
        </div>
        <div className="row gap">
          <div className="tabs" role="tablist">
            {[7, 14, 30, 90].map((n) => (
              <button key={n} className={`tab ${days === n ? 'on' : ''}`} onClick={() => setDays(n)}>
                {n} kun
              </button>
            ))}
          </div>
          <button className="xp-chip" onClick={load} title="Yangilash">
            ↻
          </button>
        </div>
      </header>

      <div className="ad-hero rise" style={{ ['--d' as string]: '0.05s' }}>
        <div className="cta-glow" aria-hidden="true" />
        <div>
          <div className="eyebrow light">Jami foydalanuvchilar</div>
          <div className="ad-big">{nf.format(o.totalUsers)}</div>
          <div className="ad-hero-sub">
            Bugun <b>+{o.newToday}</b> yangi · haftada <b>+{o.newLast7Days}</b> · oyda <b>+{o.newLast30Days}</b>
          </div>
        </div>
        <div className="ad-hero-side">
          <div>
            <b>{o.activeToday}</b>
            <span>bugun faol</span>
          </div>
          <div>
            <b>{o.activeLast7Days}</b>
            <span>7 kunda faol</span>
          </div>
          <div>
            <b>{o.activeLast30Days}</b>
            <span>30 kunda faol</span>
          </div>
        </div>
      </div>

      <div className="ad-stats">
        <Stat label="So'zlar" value={nf.format(o.totalWords)} hint="barcha lug'atlarda" delay={0.1} />
        <Stat label="Javoblar" value={nf.format(o.totalReviews)} hint="jami mashq javoblari" delay={0.15} />
        <Stat label="Aniqlik" value={`${o.accuracyPercent}%`} hint="to'g'ri javoblar ulushi" delay={0.2} accent />
        <Stat label="Testlar" value={nf.format(o.totalQuizSessions)} hint="boshlangan sessiyalar" delay={0.25} />
        <Stat label="Haftalik faollik" value={`${activePct}%`} hint="so'nggi 7 kunda mashq qilganlar" delay={0.3} />
      </div>

      <section className="b ad-card rise" style={{ ['--d' as string]: '0.35s' }}>
        <div className="row">
          <div className="eyebrow">So'nggi {days} kun</div>
          <div className="grow" />
          <span className="ad-legend"><i className="b-active" /> Faol</span>
          <span className="ad-legend"><i className="b-new" /> Yangi</span>
        </div>
        <Chart series={o.series} />
      </section>

      {ins && <Insights ins={ins} />}
    </>
  );
}

const FORMAT_LABEL: Record<string, string> = {
  TYPED: 'Yozma',
  CHOICE: 'Tanlov',
  LISTENING: 'Eshitish',
  FLASHCARD: 'Flesh-kartalar',
  SPEED: 'Tezlik',
};

function Insights({ ins }: { ins: AdminInsights }) {
  const total = ins.formats.reduce((s, f) => s + f.answers, 0);
  const top = Math.max(1, ...ins.formats.map((f) => f.answers));
  const hardMax = Math.max(1, ...ins.hardestWords.map((w) => w.answers));
  return (
    <div className="ad-two">
      <section className="b ad-card rise" style={{ ['--d' as string]: '0.4s' }}>
        <div className="eyebrow">Mashq turlari · {ins.days} kun</div>
        {ins.formats.length === 0 ? (
          <div className="muted" style={{ padding: '16px 0' }}>Bu davrda javob yo'q.</div>
        ) : (
          <div className="ad-bars-h">
            {[...ins.formats].sort((a, b) => b.answers - a.answers).map((f) => (
              <div key={f.format} className="ad-hrow">
                <span className="ad-hlabel">{FORMAT_LABEL[f.format] ?? f.format}</span>
                <div className="ad-htrack">
                  <i style={{ width: `${(f.answers / top) * 100}%` }} />
                </div>
                <span className="ad-hval">
                  {nf.format(f.answers)} <small>({total ? Math.round((f.answers / total) * 100) : 0}% · {f.answers ? Math.round((f.correct / f.answers) * 100) : 0}% to'g'ri)</small>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="b ad-card rise" style={{ ['--d' as string]: '0.45s' }}>
        <div className="eyebrow">Ushlab qolish (retention)</div>
        <div className="ad-ret">
          {ins.retention.map((r) => {
            const pct = r.cohort ? Math.round((r.retained / r.cohort) * 100) : null;
            return (
              <div key={r.days} className="ad-ret-item">
                <b>{pct === null ? '—' : `${pct}%`}</b>
                <span>{r.days} kundan keyin</span>
                <small>{r.retained} / {r.cohort} kishi</small>
              </div>
            );
          })}
        </div>
        <p className="muted ad-note">Ro'yxatdan o'tganiga kamida shuncha kun bo'lganlar ichida, o'sha kundan keyin ham mashq qilganlar ulushi.</p>
      </section>

      <section className="b ad-card ad-wide rise" style={{ ['--d' as string]: '0.5s' }}>
        <div className="eyebrow">Eng qiyin so'zlar (hamma foydalanuvchilar bo'yicha)</div>
        {ins.hardestWords.length === 0 ? (
          <div className="muted" style={{ padding: '16px 0' }}>Hali yetarli ma'lumot yo'q (kamida 3 ta javob kerak).</div>
        ) : (
          <div className="ad-bars-h">
            {ins.hardestWords.map((w) => (
              <div key={w.english} className="ad-hrow">
                <span className="ad-hlabel">{w.english}</span>
                <div className="ad-htrack danger">
                  <i style={{ width: `${(w.answers / hardMax) * 100}%` }} />
                </div>
                <span className="ad-hval">
                  {Math.round((w.wrong / w.answers) * 100)}% xato <small>({w.wrong}/{w.answers})</small>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------ users */

type SortKey = 'recent' | 'created' | 'words' | 'reviews' | 'xp' | 'accuracy';

export function AdminUsersPage() {
  const nav = useNavigate();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [toggling, setToggling] = useState<AdminUser | null>(null);
  const [toggleBusy, setToggleBusy] = useState(false);
  const [toggleError, setToggleError] = useState('');

  const load = () => {
    setError('');
    adminApi.users().then(setUsers).catch((e) => setError(errorMessage(e, "Ma'lumotlarni yuklab bo'lmadi")));
  };
  useEffect(load, []);

  const rows = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    const list = q ? users.filter((u) => `${u.username} ${u.fullName} ${u.email}`.toLowerCase().includes(q)) : [...users];
    const acc = (u: AdminUser) => (u.reviewCount ? u.correctCount / u.reviewCount : -1);
    const time = (iso: string | null) => (iso ? new Date(iso).getTime() : 0);
    const by: Record<SortKey, (a: AdminUser, b: AdminUser) => number> = {
      recent: (a, b) => Math.max(time(b.lastActiveAt), time(b.lastLoginAt)) - Math.max(time(a.lastActiveAt), time(a.lastLoginAt)),
      created: (a, b) => time(b.createdAt) - time(a.createdAt),
      words: (a, b) => b.wordCount - a.wordCount,
      reviews: (a, b) => b.reviewCount - a.reviewCount,
      xp: (a, b) => b.totalXp - a.totalXp,
      accuracy: (a, b) => acc(b) - acc(a),
    };
    return list.sort(by[sort]);
  }, [users, query, sort]);

  if (error && !users) return <Failed message={error} retry={load} />;
  if (!users) return <Spinner />;

  return (
    <>
      <header className="home-head rise">
        <div>
          <div className="eyebrow">Modul</div>
          <h1 className="home-title">
            Foydalanuvchilar<span className="dot">.</span>
          </h1>
        </div>
        <button className="xp-chip" onClick={load} title="Yangilash">
          ↻ Yangilash
        </button>
      </header>

      <section className="b ad-card rise" style={{ ['--d' as string]: '0.05s' }}>
        <div className="ad-toolbar">
          <div className="eyebrow">Ro'yxat ({rows.length})</div>
          <div className="grow" />
          <input className="input ad-search" placeholder="Ism, login yoki email..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="select ad-sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="recent">Oxirgi faollik</option>
            <option value="created">Yangi ro'yxatdan o'tgan</option>
            <option value="words">Ko'p so'z</option>
            <option value="reviews">Ko'p javob</option>
            <option value="xp">Ko'p XP</option>
            <option value="accuracy">Aniqlik</option>
          </select>
        </div>

        {rows.length === 0 ? (
          <div className="muted center" style={{ padding: 28 }}>Hech kim topilmadi.</div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th className="num">So'z</th>
                  <th className="num">Javob</th>
                  <th className="num">Aniqlik</th>
                  <th className="num">XP</th>
                  <th>Ro'yxatdan o'tgan</th>
                  <th>Oxirgi faollik</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => {
                  const pct = u.reviewCount ? Math.round((u.correctCount / u.reviewCount) * 100) : null;
                  const last = u.lastActiveAt ?? u.lastLoginAt;
                  const fresh = last ? Date.now() - new Date(last).getTime() < 86400000 : false;
                  return (
                    <tr key={u.id} className={`ad-click ${u.blocked ? 'ad-blocked' : ''}`} onClick={() => nav(`/admin/users/${u.id}`)}>
                      <td>
                        <div className="ad-user">
                          <span className="ad-ava">{(u.fullName || u.username).slice(0, 1).toUpperCase()}</span>
                          <div>
                            <div className="ad-name">
                              {u.fullName || u.username}
                              {u.role === 'ADMIN' && <span className="ad-chip admin">Admin</span>}
                              {u.blocked && <span className="ad-chip">Bloklangan</span>}
                            </div>
                            <div className="muted ad-sub">@{u.username} · {u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="num">{u.wordCount}</td>
                      <td className="num">{u.reviewCount}</td>
                      <td className="num">{pct === null ? '—' : `${pct}%`}</td>
                      <td className="num">{u.totalXp}</td>
                      <td className="muted">{day(u.createdAt)}</td>
                      <td>
                        <span className={`ad-dot ${fresh ? 'on' : ''}`} />
                        {ago(last)}
                      </td>
                      <td className="num" onClick={(e) => e.stopPropagation()}>
                        {u.role !== 'ADMIN' && (
                          <>
                            <button className="ad-edit" onClick={() => setEditing(u)} title="Ism-familiyani tahrirlash">
                              ✎
                            </button>
                            <button
                              className={`ad-edit ${u.blocked ? 'unblock' : 'block'}`}
                              onClick={() => {
                                setToggleError('');
                                setToggling(u);
                              }}
                              title={u.blocked ? 'Blokdan chiqarish' : 'Bloklash'}
                            >
                              {u.blocked ? '✓' : '⛔'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {toggling && (
        <Confirm
          title={toggling.blocked ? 'Blokdan chiqarilsinmi?' : 'Foydalanuvchi bloklansinmi?'}
          text={
            toggling.blocked
              ? `@${toggling.username} yana tizimga kira oladi.`
              : `@${toggling.username} barcha qurilmalardan chiqariladi va qayta kira olmaydi. Keyin blokdan chiqarishingiz mumkin.${toggleError ? ' ' + toggleError : ''}`
          }
          confirmLabel={toggling.blocked ? 'Blokdan chiqarish' : 'Bloklash'}
          danger={!toggling.blocked}
          loading={toggleBusy}
          onCancel={() => setToggling(null)}
          onConfirm={async () => {
            setToggleBusy(true);
            try {
              const row = await adminApi.setBlocked(toggling.id, !toggling.blocked);
              setUsers((list) => (list ? list.map((x) => (x.id === row.id ? row : x)) : list));
              setToggling(null);
            } catch (e) {
              setToggleError(errorMessage(e, "Bajarib bo'lmadi"));
            } finally {
              setToggleBusy(false);
            }
          }}
        />
      )}

      {editing && (
        <RenameModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={(row) => {
            setUsers((list) => (list ? list.map((x) => (x.id === row.id ? row : x)) : list));
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function RenameModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: (row: AdminUser) => void }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Ism va familiyani kiriting');
      return;
    }
    setBusy(true);
    setError('');
    try {
      onSaved(await adminApi.rename(user.id, firstName.trim(), lastName.trim()));
    } catch (e) {
      setError(errorMessage(e, "Saqlab bo'lmadi"));
      setBusy(false);
    }
  };

  return (
    <Modal title="Ism-familiyani tahrirlash" onClose={onClose}>
      <div className="muted" style={{ marginBottom: 14 }}>@{user.username} · {user.email}</div>
      {error && <div className="notice notice-error">{error}</div>}
      <Field label="Ism" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} autoFocus />
      <Field label="Familiya" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={100} />
      <div className="row gap end">
        <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
        <Button onClick={save} loading={busy}>Saqlash</Button>
      </div>
    </Modal>
  );
}
