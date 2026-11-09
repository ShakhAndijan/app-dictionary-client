import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { errorMessage, GroupDetail, GroupMember, groupsApi, GroupSummary } from '../api';
import { Button, Card, Confirm, Field, Modal, Notice, PageHeader, ProgressBar, Spinner } from '../ui';

const EMOJIS = ['🏆', '🚀', '🔥', '📚', '🎯', '⭐', '🦁', '🌟'];
const MEDALS = ['🥇', '🥈', '🥉'];

export function GroupsPage() {
  const nav = useNavigate();
  const [groups, setGroups] = useState<GroupSummary[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [sheet, setSheet] = useState<'create' | 'join' | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoadError(false);
    groupsApi
      .list()
      .then(setGroups)
      .catch(() => setLoadError(true));
  }, []);

  useEffect(load, [load]);

  const open = (s: 'create' | 'join') => {
    setName('');
    setCode('');
    setFormError('');
    setSheet(s);
  };

  const submit = async () => {
    setBusy(true);
    setFormError('');
    try {
      const g = sheet === 'create' ? await groupsApi.create(name.trim(), emoji) : await groupsApi.join(code.trim());
      setSheet(null);
      nav(`/profile/groups/${g.id}`);
    } catch (e) {
      setFormError(errorMessage(e, "Amalni bajarib bo'lmadi. Internetni tekshiring."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="gp-head rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div className="grow">
          <div className="eyebrow">Birga o'rganing</div>
          <h1 className="dx-title">Do'stlar bilan reyting</h1>
        </div>
        <div className="gp-actions">
          <Button variant="outline" onClick={() => open('join')}>Kod bilan qo'shilish</Button>
          <Button onClick={() => open('create')}>＋ Guruh ochish</Button>
        </div>
      </header>

      {groups == null ? (
        loadError ? <p className="muted center">Guruhlarni yuklab bo'lmadi</p> : <Spinner />
      ) : groups.length === 0 ? (
        <section className="gp-empty rise">
          <div className="gp-empty-ico">👥</div>
          <h3>Hali guruhingiz yo'q</h3>
          <p>Guruh oching va kodni do'stlaringizga yuboring. Hammangizning haftalik XP reytingingiz shu yerda ko'rinadi.</p>
          <div className="gp-actions center-row">
            <Button onClick={() => open('create')}>＋ Guruh ochish</Button>
            <Button variant="outline" onClick={() => open('join')}>Kod bilan qo'shilish</Button>
          </div>
        </section>
      ) : (
        <div className="gp-grid">
          {groups.map((g, i) => (
            <button key={g.id} className="gp-card rise" style={{ ['--d' as string]: `${i * 0.05}s` }} onClick={() => nav(`/profile/groups/${g.id}`)}>
              <span className="gp-emoji">{g.emoji}</span>
              <span className="gp-card-txt">
                <b>{g.name}</b>
                <small>
                  {g.memberCount} a'zo{g.ownedByMe ? ' · siz egasisiz' : ''}
                </small>
              </span>
              <span className="gp-go" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      )}

      {sheet && (
        <Modal title={sheet === 'create' ? 'Yangi guruh' : "Guruhga qo'shilish"} onClose={() => setSheet(null)}>
          {formError && <Notice>{formError}</Notice>}
          {sheet === 'create' ? (
            <>
              <Field label="Guruh nomi" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Sinfdoshlar" maxLength={40} autoFocus />
              <div className="emoji-pick">
                {EMOJIS.map((e) => (
                  <button key={e} type="button" className={`emoji-btn ${e === emoji ? 'on' : ''}`} onClick={() => setEmoji(e)}>
                    {e}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <Field label="Taklif kodi" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="K7P2QX" maxLength={8} autoFocus />
          )}
          <Button block loading={busy} onClick={submit} disabled={sheet === 'create' ? !name.trim() : code.trim().length < 4}>
            {sheet === 'create' ? 'Ochish' : "Qo'shilish"}
          </Button>
        </Modal>
      )}
    </>
  );
}

type Period = 'week' | 'all';
const xpOf = (m: GroupMember, p: Period) => (p === 'week' ? m.weekXp : m.totalXp);

export function GroupDetailPage() {
  const nav = useNavigate();
  const id = Number(useParams().id);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<Period>('week');
  const [copied, setCopied] = useState(false);
  const [action, setAction] = useState<{ title: string; text: string; label: string; run: () => Promise<unknown> } | null>(null);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = useCallback(() => {
    groupsApi
      .get(id)
      .then((g) => {
        setGroup(g);
        setError(false);
      })
      .catch(() => setError(true));
  }, [id]);

  useEffect(load, [load]);

  const copyInvite = async () => {
    if (!group) return;
    const text = `"${group.name}" guruhimizga qo'shiling! Lug'at ilovasida Profil → Do'stlar bilan reyting → Kod bilan qo'shilish, kod: ${group.inviteCode}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt('Nusxa oling:', text);
    }
  };

  const runAction = async () => {
    if (!action) return;
    setActing(true);
    setActionError('');
    try {
      await action.run();
      setAction(null);
    } catch (e) {
      setActionError(errorMessage(e, "Amalni bajarib bo'lmadi"));
    } finally {
      setActing(false);
    }
  };

  if (!group) {
    return (
      <>
        <PageHeader title="Guruh" back={() => nav('/profile/groups')} />
        {error ? <p className="muted center">Guruhni yuklab bo'lmadi</p> : <Spinner />}
      </>
    );
  }

  const ranked = [...group.members].sort(
    (a, b) => xpOf(b, period) - xpOf(a, period) || b.totalXp - a.totalXp || a.name.localeCompare(b.name)
  );
  const top = Math.max(1, ...ranked.map((m) => xpOf(m, period)));

  return (
    <>
      <section className="gp-hero rise">
        <button className="gp-back" onClick={() => nav('/profile/groups')} aria-label="Orqaga">←</button>
        <div className="gp-hero-emoji">{group.emoji}</div>
        <div className="grow">
          <div className="eyebrow">Guruh</div>
          <h1 className="dx-title gp-hero-name">{group.name}</h1>
          <div className="gp-hero-sub">
            {group.members.length} a'zo · jami {group.members.reduce((s, m) => s + xpOf(m, period), 0)} XP
          </div>
        </div>
        <div className="gp-invite">
          <small>Taklif kodi</small>
          <b>{group.inviteCode}</b>
          <button onClick={copyInvite}>{copied ? '✓ Nusxalandi' : '📋 Nusxalash'}</button>
        </div>
      </section>

      <div className="dx-filters gp-period" role="tablist">
        {(['week', 'all'] as Period[]).map((p) => (
          <button key={p} role="tab" aria-selected={period === p} className={`dx-seg ${period === p ? 'on' : ''}`} onClick={() => setPeriod(p)}>
            {p === 'week' ? 'Shu hafta' : 'Hammasi'}
          </button>
        ))}
      </div>

      {ranked.length >= 3 && (
        <section className="gp-podium rise" style={{ ['--d' as string]: '0.05s' }}>
          {[1, 0, 2].map((idx) => {
            const m = ranked[idx];
            const xp = xpOf(m, period);
            return (
              <div key={m.userId} className={`gp-pod p${idx + 1} ${m.me ? 'me' : ''}`}>
                <div className="gp-pod-medal">{MEDALS[idx]}</div>
                <div className="gp-pod-av">{m.name[0]?.toUpperCase()}</div>
                <b className="gp-pod-name">{m.name}</b>
                <small>{m.me ? 'Siz' : `@${m.username}`}</small>
                <div className="gp-pod-xp">{xp} <em>XP</em></div>
                {group.ownedByMe && !m.me && (
                  <button
                    className="gp-kick gp-pod-kick"
                    title="Guruhdan chiqarish"
                    onClick={() =>
                      setAction({
                        title: "A'zoni chiqarish",
                        text: `${m.name} guruhdan chiqarilsinmi?`,
                        label: 'Chiqarish',
                        run: () => groupsApi.removeMember(id, m.userId).then(load),
                      })
                    }
                  >
                    ✕
                  </button>
                )}
                <div className="gp-pod-step" />
              </div>
            );
          })}
        </section>
      )}

      <section className="gp-list rise" style={{ ['--d' as string]: '0.1s' }}>
        {ranked.map((m, i) => {
          if (ranked.length >= 3 && i < 3) return null;
          const xp = xpOf(m, period);
          return (
            <div key={m.userId} className={`gp-row ${m.me ? 'me' : ''}`}>
              <div className="gp-rank">{i + 1}</div>
              <div className="gp-av">{m.name[0]?.toUpperCase()}</div>
              <div className="gp-info">
                <div className="gp-name">
                  <b>{m.name}</b>
                  {m.me && <span className="gp-tag you">Siz</span>}
                  {m.owner && <span className="gp-tag">Egasi</span>}
                </div>
                <small>
                  @{m.username} · {m.level}-daraja · {m.levelTitle}
                </small>
                <div className="gp-bar"><i style={{ width: `${(xp / top) * 100}%` }} /></div>
              </div>
              <div className="gp-xp">
                <b>{xp}</b>
                <small>XP</small>
              </div>
              {group.ownedByMe && !m.me && (
                <button
                  className="gp-kick"
                  title="Guruhdan chiqarish"
                  onClick={() =>
                    setAction({
                      title: "A'zoni chiqarish",
                      text: `${m.name} guruhdan chiqarilsinmi?`,
                      label: 'Chiqarish',
                      run: () => groupsApi.removeMember(id, m.userId).then(load),
                    })
                  }
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </section>

      <div className="row gap mt">
        <Button
          variant="outline"
          onClick={() =>
            setAction({
              title: 'Guruhdan chiqish',
              text: group.members.length === 1 ? "Siz oxirgi a'zosiz, guruh o'chib ketadi." : 'Guruhdan chiqmoqchimisiz?',
              label: 'Chiqish',
              run: () => groupsApi.leave(id).then(() => nav('/profile/groups')),
            })
          }
        >
          Guruhdan chiqish
        </Button>
        {group.ownedByMe && (
          <Button
            variant="danger"
            onClick={() =>
              setAction({
                title: "Guruhni o'chirish",
                text: "Guruh va uning reytingi hamma uchun o'chadi.",
                label: "O'chirish",
                run: () => groupsApi.remove(id).then(() => nav('/profile/groups')),
              })
            }
          >
            Guruhni o'chirish
          </Button>
        )}
      </div>

      {action && (
        <Confirm
          title={action.title}
          text={actionError || action.text}
          confirmLabel={action.label}
          danger
          loading={acting}
          onConfirm={runAction}
          onCancel={() => {
            setAction(null);
            setActionError('');
          }}
        />
      )}
    </>
  );
}
