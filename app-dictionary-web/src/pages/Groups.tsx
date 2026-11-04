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
      <PageHeader title="Do'stlar bilan reyting" back={() => nav('/profile')} />
      <div className="row gap mb wrap">
        <Button onClick={() => open('create')}>＋ Guruh ochish</Button>
        <Button variant="outline" onClick={() => open('join')}>Kod bilan qo'shilish</Button>
      </div>

      {groups == null ? (
        loadError ? <p className="muted center">Guruhlarni yuklab bo'lmadi</p> : <Spinner />
      ) : groups.length === 0 ? (
        <Card className="empty">
          <div className="empty-emoji">👥</div>
          <h3>Hali guruhingiz yo'q</h3>
          <p className="muted">Guruh oching va kodni do'stlaringizga yuboring. Hammangizning haftalik XP reytingingiz shu yerda ko'rinadi.</p>
        </Card>
      ) : (
        groups.map((g) => (
          <Card key={g.id} className="mb" onClick={() => nav(`/profile/groups/${g.id}`)}>
            <div className="row gap">
              <span style={{ fontSize: 30 }}>{g.emoji}</span>
              <div className="grow">
                <b>{g.name}</b>
                <div className="muted" style={{ fontSize: 13 }}>
                  {g.memberCount} a'zo{g.ownedByMe ? ' · siz egasisiz' : ''}
                </div>
              </div>
              <span className="muted">›</span>
            </div>
          </Card>
        ))
      )}

      {sheet && (
        <Modal title={sheet === 'create' ? 'Yangi guruh' : "Guruhga qo'shilish"} onClose={() => setSheet(null)}>
          {formError && <Notice>{formError}</Notice>}
          {sheet === 'create' ? (
            <>
              <Field label="Guruh nomi" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Sinfdoshlar" maxLength={40} autoFocus />
              <div className="emoji-pick">
                {EMOJIS.map((e) => (
                  <button key={e} className={`emoji-btn ${e === emoji ? 'on' : ''}`} onClick={() => setEmoji(e)}>
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
      <PageHeader title="Guruh" back={() => nav('/profile/groups')} />
      <div className="center mb">
        <div style={{ fontSize: 46 }}>{group.emoji}</div>
        <h2>{group.name}</h2>
        <div className="muted">{group.members.length} a'zo</div>
      </div>

      <Card className="mb">
        <div className="row gap">
          <div className="grow">
            <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>Taklif kodi</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 4 }}>{group.inviteCode}</div>
          </div>
          <Button onClick={copyInvite}>{copied ? '✓ Nusxalandi' : '📋 Nusxalash'}</Button>
        </div>
      </Card>

      <div className="tabs">
        {(['week', 'all'] as Period[]).map((p) => (
          <button key={p} className={`tab ${period === p ? 'on' : ''}`} onClick={() => setPeriod(p)}>
            {p === 'week' ? 'Shu hafta' : 'Hammasi'}
          </button>
        ))}
      </div>

      {ranked.map((m, i) => {
        const xp = xpOf(m, period);
        return (
          <Card key={m.userId} className="mb" >
            <div className="row gap" style={m.me ? { outline: '0' } : undefined}>
              <div className="rank">{i < 3 && xp > 0 ? MEDALS[i] : i + 1}</div>
              <div className="grow">
                <div className="row gap">
                  <b>{m.name}</b>
                  {m.me && <span className="chip chip-new">Siz</span>}
                  {m.owner && <span className="chip chip-learning">Egasi</span>}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  @{m.username} · {m.level}-daraja · {m.levelTitle}
                </div>
                <div style={{ marginTop: 6 }}>
                  <ProgressBar pct={(xp / top) * 100} color={m.me ? 'var(--primary)' : 'var(--secondary)'} />
                </div>
              </div>
              <div className="center">
                <div style={{ fontWeight: 800, fontSize: 18 }}>{xp}</div>
                <div className="muted" style={{ fontSize: 11 }}>XP</div>
              </div>
              {group.ownedByMe && !m.me && (
                <Button
                  variant="ghost"
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
                </Button>
              )}
            </div>
          </Card>
        );
      })}

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
