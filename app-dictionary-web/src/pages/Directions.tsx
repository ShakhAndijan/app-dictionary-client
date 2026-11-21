import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, errorMessage } from '../api';
import { useAuth } from '../auth';
import { Notice } from '../ui';

const svg = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const ICON = {
  english: (
    <svg {...svg}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.5 3.9 5.5 3.9 9s-1.3 6.5-3.9 9c-2.6-2.5-3.9-5.5-3.9-9S9.4 5.5 12 3Z" />
    </svg>
  ),
  code: (
    <svg {...svg}>
      <path d="m8 8-4.5 4L8 16" />
      <path d="m16 8 4.5 4L16 16" />
      <path d="m13.6 5.5-3.2 13" />
    </svg>
  ),
  words: (
    <svg {...svg}>
      <path d="M4.5 5.2A1.7 1.7 0 0 1 6.2 3.5H19v15H6.2a1.7 1.7 0 0 0-1.7 1.7V5.2Z" />
      <path d="M8.5 8h6M8.5 11.5h4" />
      <path d="M4.5 20.2A1.7 1.7 0 0 1 6.2 18.5H19v2H6.2a1.7 1.7 0 0 1-1.7-.3Z" />
    </svg>
  ),
  ielts: (
    <svg {...svg}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m9.2 13.6-1.6 7 4.4-2.4 4.4 2.4-1.6-7" />
      <path d="m10 8.8 1.5 1.5L14.3 7.6" />
    </svg>
  ),
  frontend: (
    <svg {...svg}>
      <rect x="3" y="4.5" width="18" height="15" rx="2.6" />
      <path d="M3 9h18" />
      <circle cx="6.2" cy="6.8" r=".6" fill="currentColor" />
      <circle cx="8.6" cy="6.8" r=".6" fill="currentColor" />
      <path d="m10.5 13-2 1.8 2 1.8M14.5 13l2 1.8-2 1.8" />
    </svg>
  ),
} satisfies Record<string, ReactNode>;

type IconKey = keyof typeof ICON;

interface ModuleDef {
  key: string;
  icon: IconKey;
  title: string;
  sub: string;
  perks: string[];
  ready: boolean;
  locked?: boolean;
}

interface DirectionDef {
  key: string;
  icon: IconKey;
  title: string;
  sub: string;
  tone: string;
  tone2: string;
  modules: ModuleDef[];
}

/** What can be studied. A module is switched on in the profile and then shows up in the menu. */
export const DIRECTIONS: DirectionDef[] = [
  {
    key: 'english',
    icon: 'english',
    title: 'Ingliz tili',
    sub: "So'zlar, kurs va imtihonga tayyorgarlik",
    tone: '#6366f1',
    tone2: '#a855f7',
    modules: [
      { key: 'words', icon: 'words', title: "So'z qo'shish", sub: "O'z so'zlaringizni qo'shing va takrorlab yodlang", perks: ["So'zlar lug'ati", 'Mashqlar', 'Takrorlash'], ready: true },
      { key: 'course', icon: 'english', title: 'Ingliz tili kursi', sub: "A1 dan C1 gacha darslar, mashqlar va daraja imtihonlari", perks: ['Grammar', 'Reading', 'Listening', 'Writing'], ready: true },
      { key: 'ielts', icon: 'ielts', title: 'IELTS', sub: 'Imtihonga bosqichma-bosqich tayyorlaning', perks: ['Reading', 'Listening', 'Writing', 'Speaking'], ready: false },
    ],
  },
  {
    key: 'programming',
    icon: 'code',
    title: 'Dasturlash',
    sub: 'Noldan kasbgacha',
    tone: '#0ea5e9',
    tone2: '#22d3ee',
    modules: [
      { key: 'frontend', icon: 'frontend', title: 'Frontend', sub: "Saytlar va interfeyslar yaratishni o'rganing: junior dan senior gacha", perks: ['Internet', 'HTML', 'CSS', 'JavaScript', 'React'], ready: true },
      { key: 'backend', icon: 'code', title: 'Backend', sub: 'Serverlar, bazalar va API', perks: ['Server', 'Baza', 'API'], ready: false, locked: true },
    ],
  },
];

export function DirectionsPage() {
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState<string>('english');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const chosen = user?.modules ?? ['words'];
  const total = DIRECTIONS.reduce((n, d) => n + d.modules.length, 0);
  const picked = DIRECTIONS.reduce((n, d) => n + d.modules.filter((m) => chosen.includes(m.key)).length, 0);

  const toggle = async (key: string) => {
    if (saving) return;
    const next = chosen.includes(key) ? chosen.filter((k) => k !== key) : [...chosen, key];
    setSaving(true);
    setError('');
    try {
      setUser(await authApi.updateProfile({ modules: next }));
    } catch (e) {
      setError(errorMessage(e, "Saqlab bo'lmadi"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dr">
      <header className="dr-hero rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div className="dr-hero-txt">
          <div className="eyebrow">Moslashtiring</div>
          <h1 className="dx-title">Yo'nalishlarim</h1>
          <p>Nimani o'rganmoqchisiz? O'zingizga kerak bo'limlarni yoqing: ular asosiy menyuda paydo bo'ladi.</p>
        </div>
        <div className="dr-meter" aria-label={`${picked} / ${total} tanlandi`}>
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="18" className="dr-meter-bg" />
            <circle cx="22" cy="22" r="18" className="dr-meter-fg" style={{ strokeDasharray: `${(picked / total) * 113.1} 113.1` }} />
          </svg>
          <b>{picked}<small>/{total}</small></b>
        </div>
      </header>
      {error && <Notice>{error}</Notice>}

      <div className="dr-list">
        {DIRECTIONS.map((d, i) => {
          const count = d.modules.filter((m) => chosen.includes(m.key)).length;
          const isOpen = open === d.key;
          return (
            <section
              key={d.key}
              className={`dr-card rise ${isOpen ? 'open' : ''} ${count > 0 ? 'has' : ''}`}
              style={{ ['--tone' as string]: d.tone, ['--tone2' as string]: d.tone2, ['--d' as string]: `${0.06 + i * 0.07}s` }}
            >
              <button className="dr-head" onClick={() => setOpen(isOpen ? '' : d.key)} aria-expanded={isOpen}>
                <span className="dr-ico">{ICON[d.icon]}</span>
                <span className="dr-txt">
                  <b>{d.title}</b>
                  <small>{d.sub}</small>
                </span>
                <span className="dr-count">
                  {count > 0 ? <><i />{count} ta faol</> : 'Tanlanmagan'}
                </span>
                <span className="dr-chev" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </button>

              <div className="dr-fold">
                <div className="dr-fold-in">
                  <div className="dr-grid">
                    {d.modules.map((m) => {
                      const on = chosen.includes(m.key) && !m.locked;
                      return (
                        <button key={m.key} className={`dr-mod ${on ? 'on' : ''}`} onClick={() => toggle(m.key)} disabled={saving || m.locked} role="switch" aria-checked={on && !m.locked} style={m.locked ? { opacity: 0.55, cursor: "not-allowed" } : undefined}>
                          <span className="dr-mod-top">
                            <span className="dr-mod-ico">{ICON[m.icon]}</span>
                            {!m.ready && <em className="dr-soon-tag">Tez orada</em>}
                            <span className="dr-check" aria-hidden="true">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                            </span>
                          </span>
                          <b>{m.title}</b>
                          <small>{m.sub}</small>
                          <span className="dr-perks">
                            {m.perks.map((p) => (
                              <i key={p}>{p}</i>
                            ))}
                          </span>
                          <span className="dr-state">{m.locked ? "Tez orada" : on ? 'Menyuga qo\'shilgan' : "Menyuga qo'shish"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** A section that is chosen in the profile but not built yet. */
export function ComingSoonPage({ icon, title, text, topics }: { icon: IconKey; title: string; text: string; topics?: string[] }) {
  const nav = useNavigate();
  return (
    <section className="dr-soon rise">
      <div className="dr-soon-halo" aria-hidden="true" />
      <div className="dr-soon-ico">{ICON[icon]}</div>
      <span className="dr-soon-badge">Tez orada</span>
      <h1 className="dx-title">{title}</h1>
      <p>{text}</p>
      {topics && (
        <div className="dr-perks" style={{ justifyContent: 'center' }}>
          {topics.map((t) => (
            <i key={t}>{t}</i>
          ))}
        </div>
      )}
      <button className="dr-soon-btn" onClick={() => nav('/profile/directions')}>Yo'nalishlarni o'zgartirish</button>
    </section>
  );
}
