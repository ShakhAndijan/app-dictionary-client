import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi, Announcement, AnnouncementSeverity, AdminUserDetail, AuditEntry, errorMessage } from '../api';
import { Button, Confirm, Spinner } from '../ui';
import { ago, day, Failed, nf } from './Admin';

/* ------------------------------------------------------------ user page */

type Tab = 'words' | 'history' | 'week' | 'achievements';

const FORMAT_LABEL: Record<string, string> = {
  TYPED: 'Yozma',
  CHOICE: 'Tanlov',
  LISTENING: 'Eshitish',
  FLASHCARD: 'Flesh-karta',
};

const STATE_LABEL: Record<string, string> = {
  NEW: 'Yangi',
  LEARNING: "O'rganilmoqda",
  MASTERED: "O'zlashtirilgan",
};

export function AdminUserPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [deleteAsk, setDeleteAsk] = useState(false);
  const [d, setD] = useState<AdminUserDetail | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('words');
  const [roleAsk, setRoleAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = () => {
    setError('');
    adminApi.detail(Number(id)).then(setD).catch((e) => setError(errorMessage(e, "Foydalanuvchini yuklab bo'lmadi")));
  };
  useEffect(load, [id]);

  if (error && !d) return <Failed message={error} retry={load} />;
  if (!d) return <Spinner />;

  const u = d.user;
  const isAdmin = u.role === 'ADMIN';
  const pct = u.reviewCount ? Math.round((u.correctCount / u.reviewCount) * 100) : null;
  const weekMax = Math.max(1, ...d.weekly.days.map((x) => x.answers));

  const changeRole = async () => {
    setBusy(true);
    setActionError('');
    try {
      const row = await adminApi.setRole(u.id, isAdmin ? 'USER' : 'ADMIN');
      setD({ ...d, user: row });
      setRoleAsk(false);
    } catch (e) {
      setActionError(errorMessage(e, "Bajarib bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  const toggleBlock = async () => {
    setBusy(true);
    try {
      setD({ ...d, user: await adminApi.setBlocked(u.id, !u.blocked) });
    } catch (e) {
      setActionError(errorMessage(e, "Bajarib bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  const removeUser = async () => {
    setBusy(true);
    setActionError('');
    try {
      await adminApi.deleteUser(u.id);
      nav('/admin/users', { replace: true });
    } catch (e) {
      setActionError(errorMessage(e, "O'chirib bo'lmadi"));
      setBusy(false);
    }
  };

  return (
    <>
      <header className="home-head rise">
        <div>
          <Link to="/admin/users" className="eyebrow ad-back">← Foydalanuvchilar</Link>
          <h1 className="home-title">
            {u.fullName || u.username}
            <span className="dot">.</span>
            {isAdmin && <span className="ad-chip admin">Admin</span>}
            {u.blocked && <span className="ad-chip">Bloklangan</span>}
          </h1>
          <div className="muted">@{u.username} · {u.email}</div>
        </div>
        <div className="row gap">
          {!isAdmin && (
            <Button variant="outline" onClick={toggleBlock} loading={busy}>
              {u.blocked ? 'Blokdan chiqarish' : 'Bloklash'}
            </Button>
          )}
          {!isAdmin && (
            <Button variant="danger" onClick={() => { setActionError(''); setDeleteAsk(true); }}>
              O'chirish
            </Button>
          )}
          <Button onClick={() => { setActionError(''); setRoleAsk(true); }}>
            {isAdmin ? 'Adminlikni olib tashlash' : 'Admin qilish'}
          </Button>
        </div>
      </header>

      {actionError && !roleAsk && <div className="notice notice-error">{actionError}</div>}

      <div className="ad-stats">
        <div className="ad-stat rise"><div className="eyebrow">Daraja</div><div className="ad-stat-val">{d.level}</div><div className="ad-stat-hint">{d.levelTitle}</div></div>
        <div className="ad-stat rise"><div className="eyebrow">XP</div><div className="ad-stat-val">{nf.format(u.totalXp)}</div></div>
        <div className="ad-stat rise"><div className="eyebrow">So'zlar</div><div className="ad-stat-val">{u.wordCount}</div></div>
        <div className="ad-stat rise"><div className="eyebrow">Javoblar</div><div className="ad-stat-val">{nf.format(u.reviewCount)}</div><div className="ad-stat-hint">{pct === null ? '—' : `${pct}% to'g'ri`}</div></div>
        <div className="ad-stat rise"><div className="eyebrow">Yutuqlar</div><div className="ad-stat-val">{d.achievements.length}<small>/{d.totalAchievements}</small></div></div>
      </div>

      <div className="muted ad-note">
        Ro'yxatdan o'tgan: {day(u.createdAt)} · oxirgi kirish: {ago(u.lastLoginAt)} · oxirgi mashq: {ago(u.lastActiveAt)}
      </div>

      <div className="tabs ad-tabs" role="tablist">
        {([['words', "So'zlar"], ['history', 'Mashq tarixi'], ['week', 'Haftalik grafik'], ['achievements', 'Yutuqlar']] as [Tab, string][]).map(([k, label]) => (
          <button key={k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      <section className="b ad-card">
        {tab === 'words' &&
          (d.words.length === 0 ? (
            <div className="muted center" style={{ padding: 24 }}>So'z qo'shilmagan.</div>
          ) : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr><th>Inglizcha</th><th>O'zbekcha</th><th>Holat</th><th className="num">Xatolar</th><th>Qo'shilgan</th></tr></thead>
                <tbody>
                  {d.words.map((w) => (
                    <tr key={w.id}>
                      <td className="ad-name">{w.english}{w.weak && <span className="ad-chip">Qiyin</span>}</td>
                      <td>{w.uzbek}</td>
                      <td>{STATE_LABEL[w.state] ?? w.state}</td>
                      <td className="num">{w.lapses}</td>
                      <td className="muted">{day(w.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {tab === 'history' &&
          (d.recentReviews.length === 0 ? (
            <div className="muted center" style={{ padding: 24 }}>Hali mashq qilinmagan.</div>
          ) : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr><th>So'z</th><th>Natija</th><th>Tur</th><th>Qachon</th></tr></thead>
                <tbody>
                  {d.recentReviews.map((r, i) => (
                    <tr key={i}>
                      <td className="ad-name">{r.english}</td>
                      <td><span className={`ad-res ${r.correct ? 'ok' : 'bad'}`}>{r.correct ? "✓ To'g'ri" : '✗ Xato'}</span></td>
                      <td>{FORMAT_LABEL[r.format] ?? r.format}</td>
                      <td className="muted">{ago(r.answeredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {tab === 'week' && (
          <>
            <div className="row">
              <div className="eyebrow">{day(d.weekly.weekStart)} – {day(d.weekly.weekEnd)}</div>
              <div className="grow" />
              <span className="muted">{d.weekly.totals.answers} javob · {d.weekly.totals.xp} XP</span>
            </div>
            <div className="ad-chart">
              {d.weekly.days.map((x) => (
                <div key={x.date} className="ad-col" title={`${x.date}: ${x.answers} javob, ${x.correct} to'g'ri, +${x.xp} XP`}>
                  <div className="ad-bars">
                    <i className="b-active" style={{ height: `${(x.answers / weekMax) * 100}%` }} />
                    <i className="b-new" style={{ height: `${(x.correct / weekMax) * 100}%` }} />
                  </div>
                  <span>{['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'][new Date(x.date).getDay()]}</span>
                </div>
              ))}
            </div>
            <div className="row">
              <span className="ad-legend"><i className="b-active" /> Javoblar</span>
              <span className="ad-legend"><i className="b-new" /> To'g'ri</span>
            </div>
          </>
        )}

        {tab === 'achievements' &&
          (d.achievements.length === 0 ? (
            <div className="muted center" style={{ padding: 24 }}>Hali yutuq yo'q.</div>
          ) : (
            <div className="ad-ach">
              {d.achievements.map((a) => (
                <div key={a.code} className={`ad-ach-item ${a.tier.toLowerCase()}`}>
                  <span className="ad-ach-ico">{a.icon}</span>
                  <div>
                    <div className="ad-name">{a.title}</div>
                    <div className="muted ad-sub">{a.description}</div>
                    <div className="muted ad-sub">{day(a.unlockedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </section>

      {deleteAsk && (
        <Confirm
          title="Foydalanuvchi o'chirilsinmi?"
          text={`@${u.username} va uning barcha ma'lumotlari (so'zlar, javoblar, XP, yutuqlar, guruhlari) butunlay o'chadi. Buni qaytarib bo'lmaydi. Vaqtincha to'xtatish kerak bo'lsa, bloklang.${actionError ? ' ' + actionError : ''}`}
          confirmLabel="Butunlay o'chirish"
          danger
          loading={busy}
          onCancel={() => setDeleteAsk(false)}
          onConfirm={removeUser}
        />
      )}

      {roleAsk && (
        <Confirm
          title={isAdmin ? 'Adminlik olib tashlansinmi?' : 'Admin qilinsinmi?'}
          text={
            (isAdmin
              ? `@${u.username} admin panelga kira olmaydi.`
              : `@${u.username} admin panelga to'liq kirish huquqini oladi: foydalanuvchilarni bloklashi, e'lon yuborishi va boshqalarni admin qilishi mumkin.`) +
            (actionError ? ` ${actionError}` : '')
          }
          confirmLabel={isAdmin ? 'Olib tashlash' : 'Admin qilish'}
          danger={isAdmin}
          loading={busy}
          onCancel={() => setRoleAsk(false)}
          onConfirm={changeRole}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------ announcements */

const SEVERITY: Record<AnnouncementSeverity, string> = {
  INFO: "Ma'lumot",
  WARNING: 'Ogohlantirish',
  CRITICAL: 'Muhim',
};

export function AdminAnnouncementsPage() {
  const [list, setList] = useState<Announcement[] | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AnnouncementSeverity>('INFO');
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<Announcement | null>(null);

  const load = () => {
    setError('');
    adminApi.announcements().then(setList).catch((e) => setError(errorMessage(e, "Yuklab bo'lmadi")));
  };
  useEffect(load, []);

  const send = async () => {
    if (!message.trim()) return;
    setBusy(true);
    setError('');
    try {
      const a = await adminApi.announce(message.trim(), severity);
      setList((l) => [a, ...(l ?? [])]);
      setMessage('');
    } catch (e) {
      setError(errorMessage(e, "Yuborib bo'lmadi"));
    } finally {
      setBusy(false);
    }
  };

  if (error && !list) return <Failed message={error} retry={load} />;
  if (!list) return <Spinner />;

  return (
    <>
      <header className="home-head rise">
        <div>
          <div className="eyebrow">Modul</div>
          <h1 className="home-title">E'lonlar<span className="dot">.</span></h1>
        </div>
      </header>

      <section className="b ad-card rise">
        <div className="eyebrow">Yangi e'lon</div>
        {error && <div className="notice notice-error">{error}</div>}
        <textarea
          className="input ad-textarea"
          placeholder="Masalan: Bugun 22:00 da texnik ishlar bo'ladi, ilova qisqa vaqt ishlamasligi mumkin."
          value={message}
          maxLength={500}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="row gap">
          <select className="select ad-sort" value={severity} onChange={(e) => setSeverity(e.target.value as AnnouncementSeverity)}>
            {(Object.keys(SEVERITY) as AnnouncementSeverity[]).map((k) => (
              <option key={k} value={k}>{SEVERITY[k]}</option>
            ))}
          </select>
          <span className="muted">{message.length}/500</span>
          <div className="grow" />
          <Button onClick={send} loading={busy} disabled={!message.trim()}>Hammaga yuborish</Button>
        </div>
        <p className="muted ad-note">E'lon veb-saytda va mobil ilovada barcha foydalanuvchilarga ko'rinadi (oxirgi 5 tasi).</p>
      </section>

      <section className="b ad-card rise" style={{ ['--d' as string]: '0.1s' }}>
        <div className="eyebrow">Hozirgi e'lonlar ({list.length})</div>
        {list.length === 0 ? (
          <div className="muted center" style={{ padding: 24 }}>E'lon yo'q.</div>
        ) : (
          <div className="ad-anns">
            {list.map((a) => (
              <div key={a.id} className={`ad-ann ${a.severity.toLowerCase()}`}>
                <div className="grow">
                  <div>{a.message}</div>
                  <div className="muted ad-sub">{SEVERITY[a.severity]} · @{a.createdBy} · {ago(a.createdAt)}</div>
                </div>
                <button className="ad-edit block" onClick={() => setRemoving(a)} title="O'chirish">🗑</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {removing && (
        <Confirm
          title="E'lon o'chirilsinmi?"
          text="Foydalanuvchilar uni endi ko'rmaydi."
          confirmLabel="O'chirish"
          danger
          onCancel={() => setRemoving(null)}
          onConfirm={async () => {
            try {
              await adminApi.deleteAnnouncement(removing.id);
              setList((l) => (l ?? []).filter((x) => x.id !== removing.id));
              setRemoving(null);
            } catch (e) {
              setError(errorMessage(e, "O'chirib bo'lmadi"));
              setRemoving(null);
            }
          }}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------ audit log */

const ACTION: Record<string, string> = {
  RENAME: "ismini o'zgartirdi",
  BLOCK: 'bloklandi',
  UNBLOCK: 'blokdan chiqarildi',
  GRANT_ADMIN: 'admin qilindi',
  REVOKE_ADMIN: 'adminlikdan olindi',
  DELETE_USER: "o'chirildi",
  ANNOUNCE: "e'lon yubordi",
  ANNOUNCE_DELETE: "e'lonni o'chirdi",
};

export function AdminAuditPage() {
  const [list, setList] = useState<AuditEntry[] | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    setError('');
    adminApi.audit(200).then(setList).catch((e) => setError(errorMessage(e, "Yuklab bo'lmadi")));
  };
  useEffect(load, []);

  if (error && !list) return <Failed message={error} retry={load} />;
  if (!list) return <Spinner />;

  return (
    <>
      <header className="home-head rise">
        <div>
          <div className="eyebrow">Modul</div>
          <h1 className="home-title">Jurnal<span className="dot">.</span></h1>
        </div>
        <button className="xp-chip" onClick={load} title="Yangilash">↻ Yangilash</button>
      </header>

      <section className="b ad-card rise">
        {list.length === 0 ? (
          <div className="muted center" style={{ padding: 28 }}>Hali harakat yo'q.</div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr><th>Qachon</th><th>Kim</th><th>Nima</th><th>Kimga</th><th>Tafsilot</th></tr></thead>
              <tbody>
                {list.map((e) => (
                  <tr key={e.id}>
                    <td className="muted" title={new Date(e.at).toLocaleString()}>{ago(e.at)}</td>
                    <td className="ad-name">@{e.actor}</td>
                    <td>{ACTION[e.action] ?? e.action}</td>
                    <td>{e.target ? `@${e.target}` : '—'}</td>
                    <td className="muted">{e.details ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
