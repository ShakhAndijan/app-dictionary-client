import { FormEvent, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { errorMessage, errorStatus } from '../api';
import { useAuth } from '../auth';
import '../auth.css';

/* ------------------------------------------------------------- icons */

const ico = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const IconEye = ({ off }: { off: boolean }) => (
  <svg {...ico}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.8" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);
const IconArrow = () => (
  <svg {...ico} strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* ------------------------------------------------------------- lens */

// word, meaning, left %, top %, size
const LENS: [string, string, number, number, number][] = [
  ['hello', 'salom', 78, 11, 1],
  ['learn', "o'rganmoq", 86, 39, 0.8],
  ['<div>', 'quti', 22, 13, 0.62],
  ['book', 'kitob', 83, 25, 0.55],
  ['return', 'qaytarmoq', 83, 59, 0.7],
  ['future', 'kelajak', 77, 79, 0.9],
  ['const', "o'zgarmas", 46, 8, 0.6],
];

/** The spotlight follows the cursor; without a mouse it wanders on its own. */
function Lens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const target = { x: 0, y: 0, mouse: false };
    const cur = { x: -300, y: -300 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      target.mouse = true;
    };
    const frame = (now: number) => {
      if (!target.mouse) {
        target.x = el.clientWidth * (0.5 + 0.36 * Math.sin(now / 2300));
        target.y = el.clientHeight * (0.45 + 0.34 * Math.sin(now / 1700));
      }
      cur.x += (target.x - cur.x) * 0.09;
      cur.y += (target.y - cur.y) * 0.09;
      el.style.setProperty('--mx', `${cur.x.toFixed(1)}px`);
      el.style.setProperty('--my', `${cur.y.toFixed(1)}px`);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener('pointermove', move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <div className="au-lens" ref={ref} aria-hidden="true">
      <div className="au-lens-base">
        {LENS.map(([w, , x, y, s]) => (
          <span key={w} style={{ left: `${x}%`, top: `${y}%`, fontSize: `calc(${s} * clamp(44px, 7vw, 118px))` }}>{w}</span>
        ))}
      </div>
      <div className="au-lens-rev">
        {LENS.map(([w, m, x, y, s]) => (
          <span key={w} style={{ left: `${x}%`, top: `${y}%`, fontSize: `calc(${s} * clamp(44px, 7vw, 118px))` }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- scrambling text */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz'";

/** Text that decodes letter by letter from random glyphs to the target whenever the target changes. */
function Scramble({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState(text);
  const prev = useRef(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text);
      prev.current = text;
      return undefined;
    }
    const from = prev.current;
    const len = Math.max(from.length, text.length);
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      let out = '';
      for (let i = 0; i < len; i++) {
        // Each letter settles at its own moment, left to right.
        const settleAt = (i / len) * 0.7 + 0.2;
        const target = text[i] ?? '';
        if (t >= settleAt || target === ' ') out += target;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setShown(text);
        prev.current = text;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return <span className={className}>{shown}</span>;
}

const PAIRS: [string, string][] = [
  ['journey', 'sayohat'],
  ['brave', 'jasur'],
  ['library', 'kutubxona'],
  ['knowledge', 'bilim'],
  ['horizon', 'ufq'],
  ['friend', "do'st"],
  ['curious', 'qiziquvchan'],
  ['dream', 'orzu'],
];
const PAIR_MS = 3800;

function WordStage() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % PAIRS.length), PAIR_MS);
    return () => clearInterval(id);
  }, []);
  const [en, uz] = PAIRS[i];
  return (
    <div className="au-stage" aria-hidden="true">
      <div className="au-stage-line">
        <span key={i} className="au-stage-fill" style={{ animationDuration: `${PAIR_MS}ms` }} />
      </div>
      <div className="au-stage-row">
        <Scramble text={en} className="au-stage-en" />
        <Scramble text={uz} className="au-stage-uz" />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- shell */

function AuthShell({ eyebrow, title, subtitle, children, footer }: { eyebrow: string; title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="au-root">
      <section className="au-story">
        <Lens />
        <Link to="/" className="au-mark">
          Qadam<sup>®</sup>
        </Link>
        <div className="au-copy">
          <h2 className="au-headline">
            <span className="au-line"><span>Har kuni</span></span>
            <span className="au-line"><span><em>bir qadam</em></span></span>
            <span className="au-line"><span>oldinga.</span></span>
          </h2>
          <p className="au-lede">So'z yodlang, ingliz tilini o'rganing, kod yozing. Hammasi bitta hisobda.</p>
        </div>
        <WordStage />
      </section>

      <section className="au-sheet">
        <div className="au-form">
          <div className="au-eyebrow">{eyebrow}</div>
          <h1 className="au-title">{title}</h1>
          <p className="au-sub">{subtitle}</p>
          {children}
          <p className="au-foot">{footer}</p>
        </div>
      </section>
    </div>
  );
}

function AuField({ label, type = 'text', ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className="au-field">
      <input {...rest} type={isPassword && show ? 'text' : type} placeholder=" " className="au-input" />
      <span className="au-field-label">{label}</span>
      <span className="au-field-line" />
      {isPassword && (
        <button type="button" className="au-eye" tabIndex={-1} onClick={() => setShow((s) => !s)} aria-label={show ? 'Parolni yashirish' : "Parolni ko'rsatish"}>
          <IconEye off={show} />
        </button>
      )}
    </label>
  );
}

function AuError({ message }: { message: string }) {
  if (!message) return null;
  // Keyed by message so a new error replays the shake.
  return (
    <div className="au-error" key={message} role="alert">
      {message}
    </div>
  );
}

function AuButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button type="submit" className="au-btn" disabled={busy}>
      <span className="au-btn-label">
        {busy ? <span className="au-spin" /> : (<>{children}<IconArrow /></>)}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------- pages */

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Foydalanuvchi nomi va parolni kiriting');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(errorStatus(err) === 403 ? "Hisobingiz bloklangan. Administrator bilan bog'laning." : errorMessage(err, "Login yoki parol noto'g'ri"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Kirish"
      title="Qaytganingiz yaxshi"
      subtitle="Davom etish uchun hisobingizga kiring."
      footer={
        <>
          Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </>
      }
    >
      <form onSubmit={submit} className="au-stagger">
        <AuError message={error} />
        <AuField label="Foydalanuvchi nomi" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" autoFocus />
        <AuField label="Parol" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <AuButton busy={busy}>Kirish</AuButton>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, username, password } = form;
    if (![firstName, lastName, email, username, password].every((v) => v.trim())) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    if (username.trim().length < 3) {
      setError("Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    setBusy(true);
    setError('');
    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), username.trim(), password);
    } catch (err) {
      setError(errorMessage(err, "Ro'yxatdan o'tishda xatolik yuz berdi"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Yangi hisob"
      title="Boshlaymiz"
      subtitle="Bir daqiqada hisob yarating."
      footer={
        <>
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </>
      }
    >
      <form onSubmit={submit} className="au-stagger">
        <AuError message={error} />
        <div className="au-two">
          <AuField label="Ism" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
          <AuField label="Familiya" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
        </div>
        <AuField label="Email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        <AuField label="Foydalanuvchi nomi" value={form.username} onChange={set('username')} autoComplete="username" autoCapitalize="none" />
        <AuField label="Parol" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
        <AuButton busy={busy}>Ro'yxatdan o'tish</AuButton>
      </form>
    </AuthShell>
  );
}
