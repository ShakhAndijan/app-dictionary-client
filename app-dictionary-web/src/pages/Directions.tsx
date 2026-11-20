import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, errorMessage } from '../api';
import { useAuth } from '../auth';
import { Notice } from '../ui';

interface ModuleDef {
  key: string;
  icon: string;
  title: string;
  sub: string;
  ready: boolean;
}

interface DirectionDef {
  key: string;
  icon: string;
  title: string;
  sub: string;
  color: string;
  modules: ModuleDef[];
}

/** What can be studied. A module is switched on in the profile and then shows up in the menu. */
export const DIRECTIONS: DirectionDef[] = [
  {
    key: 'english',
    icon: '🇬🇧',
    title: 'Ingliz tili',
    sub: "So'zlar, kurs va imtihonga tayyorgarlik",
    color: '#4f46e5',
    modules: [
      { key: 'words', icon: '📚', title: "So'z qo'shish", sub: "O'z so'zlaringizni qo'shing, mashq qiling va ingliz tili kursidan o'ting", ready: true },
      { key: 'ielts', icon: '🎓', title: 'IELTS', sub: 'Imtihonga tayyorgarlik: reading, listening, writing, speaking', ready: false },
    ],
  },
  {
    key: 'programming',
    icon: '💻',
    title: 'Dasturlash',
    sub: "Noldan kasbgacha",
    color: '#0ea5e9',
    modules: [
      { key: 'frontend', icon: '🎨', title: 'Frontend', sub: 'HTML, CSS, JavaScript va React', ready: false },
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
    <>
      <header className="ac-head rise">
        <button className="gp-back" onClick={() => nav('/profile')} aria-label="Orqaga">←</button>
        <div>
          <div className="eyebrow">Moslashtiring</div>
          <h1 className="dx-title">Yo'nalishlarim</h1>
        </div>
      </header>
      <p className="dr-lead rise">Nimani o'rganmoqchisiz? Kerakli yo'nalishni oching va o'zingizga kerak bo'limlarni qo'shing. Ular asosiy menyuda paydo bo'ladi.</p>
      {error && <Notice>{error}</Notice>}

      {DIRECTIONS.map((d, i) => {
        const count = d.modules.filter((m) => chosen.includes(m.key)).length;
        const isOpen = open === d.key;
        return (
          <section key={d.key} className={`dr-card rise ${isOpen ? 'open' : ''}`} style={{ ['--tone' as string]: d.color, ['--d' as string]: `${0.04 + i * 0.06}s` }}>
            <button className="dr-head" onClick={() => setOpen(isOpen ? '' : d.key)} aria-expanded={isOpen}>
              <span className="dr-ico">{d.icon}</span>
              <span className="dr-txt">
                <b>{d.title}</b>
                <small>{d.sub}</small>
              </span>
              <span className="dr-count">{count > 0 ? `${count} ta tanlandi` : 'Tanlanmagan'}</span>
              <span className="dr-chev" aria-hidden="true">{isOpen ? '▴' : '▾'}</span>
            </button>
            {isOpen && (
              <div className="dr-body">
                {d.modules.map((m) => {
                  const on = chosen.includes(m.key);
                  return (
                    <button key={m.key} className={`dr-mod ${on ? 'on' : ''}`} onClick={() => toggle(m.key)} disabled={saving} role="switch" aria-checked={on}>
                      <span className="dr-mod-ico">{m.icon}</span>
                      <span className="dr-mod-txt">
                        <b>
                          {m.title}
                          {!m.ready && <em>Tez orada</em>}
                        </b>
                        <small>{m.sub}</small>
                      </span>
                      <span className="dr-switch" aria-hidden="true"><i /></span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}

/** A section that is chosen in the profile but not built yet. */
export function ComingSoonPage({ icon, title, text }: { icon: string; title: string; text: string }) {
  const nav = useNavigate();
  return (
    <section className="dr-soon rise">
      <div className="dr-soon-ico">{icon}</div>
      <h1 className="dx-title">{title}</h1>
      <span className="dr-soon-badge">Tez orada</span>
      <p>{text}</p>
      <button className="dr-soon-btn" onClick={() => nav('/profile/directions')}>Yo'nalishlarni o'zgartirish</button>
    </section>
  );
}

export const IeltsPage = () => (
  <ComingSoonPage icon="🎓" title="IELTS" text="IELTS imtihoniga tayyorgarlik bo'limi ustida ishlayapmiz: reading, listening, writing va speaking mashqlari, namunaviy testlar." />
);

export const FrontendPage = () => (
  <ComingSoonPage icon="🎨" title="Frontend" text="Frontend yo'nalishi (HTML, CSS, JavaScript, React) tez orada ochiladi. Darslar va amaliy topshiriqlar tayyorlanmoqda." />
);
