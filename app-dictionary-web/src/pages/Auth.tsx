import { FormEvent, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { errorMessage, errorStatus } from '../api';
import { useAuth } from '../auth';

/* ------------------------------------------------------------- icons */

const ico = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const IconUser = () => (
  <svg {...ico}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg>
);
const IconLock = () => (
  <svg {...ico}><rect x="4" y="10.5" width="16" height="10.5" rx="3" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
);
const IconMail = () => (
  <svg {...ico}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7.5 8 6 8-6" /></svg>
);
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

/* -------------------------------------------------- constellation canvas */

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/** Slowly drifting points joined by faint lines; the cursor pulls nearby points in and lights its own links. */
function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, on: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(110, Math.round((w * h) / 15000)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 0.7 + Math.random() * 1.5,
      }));
    };

    const LINK = 150;
    const PULL = 190;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -10) d.x = w + 10;
          else if (d.x > w + 10) d.x = -10;
          if (d.y < -10) d.y = h + 10;
          else if (d.y > h + 10) d.y = -10;
          if (mouse.on) {
            const dx = mouse.x - d.x;
            const dy = mouse.y - d.y;
            const dist = Math.hypot(dx, dy);
            if (dist < PULL && dist > 1) {
              const f = (1 - dist / PULL) * 0.035;
              d.x += dx * f;
              d.y += dy * f;
            }
          }
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            ctx.strokeStyle = `rgba(148,163,255,${(1 - dist / LINK) * 0.28})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.on) {
          const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dist < PULL) {
            ctx.strokeStyle = `rgba(103,232,249,${(1 - dist / PULL) * 0.7})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      for (const d of dots) {
        ctx.fillStyle = 'rgba(199,210,254,0.9)';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const move = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
    };
    const leave = () => {
      mouse.on = false;
    };
    const visibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return <canvas ref={ref} className="au-canvas" aria-hidden="true" />;
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
      <div className="au-stage-row">
        <span className="au-stage-tag">EN</span>
        <Scramble text={en} className="au-stage-en" />
      </div>
      <div className="au-stage-line">
        <span key={i} className="au-stage-fill" style={{ animationDuration: `${PAIR_MS}ms` }} />
      </div>
      <div className="au-stage-row">
        <span className="au-stage-tag">UZ</span>
        <Scramble text={uz} className="au-stage-uz" />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- shell */

function AuthShell({ eyebrow, title, subtitle, children, footer }: { eyebrow: string; title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const card = useRef<HTMLDivElement>(null);

  // The glow inside the card follows the cursor.
  const spot = (e: React.MouseEvent) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div className="au-root">
      <div className="au-aurora" aria-hidden="true" />
      <Constellation />
      <div className="au-grain" aria-hidden="true" />

      <div className="au-layout">
        <section className="au-story">
          <div className="au-mark">
            <span className="au-mark-dot" />
            Lug'at
          </div>
          <h2 className="au-headline">
            <span className="au-line"><span>So'zlarni</span></span>
            <span className="au-line"><span className="au-grad">eslab qoling,</span></span>
            <span className="au-line"><span>unutmang.</span></span>
          </h2>
          <p className="au-lede">Aqlli takrorlash, fleshkartlar va o'yinlar. Har kuni bir oz, lekin abadiy.</p>
          <WordStage />
        </section>

        <section className="au-formside">
          <div className="au-card" ref={card} onMouseMove={spot}>
            <div className="au-card-inner">
              <div className="au-eyebrow">{eyebrow}</div>
              <h1 className="au-title">{title}</h1>
              <p className="au-sub">{subtitle}</p>
              {children}
              <p className="au-foot">{footer}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuField({ label, icon, type = 'text', ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon: ReactNode }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className="au-field">
      <span className="au-field-icon">{icon}</span>
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
  // A fresh key on every message replays the shake.
  return (
    <div className="au-error" key={`${message}-${Date.now()}`} role="alert">
      {message}
    </div>
  );
}

function AuButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button type="submit" className="au-btn" disabled={busy}>
      <span className="au-btn-bg" />
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
        <AuField label="Foydalanuvchi nomi" icon={<IconUser />} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" autoFocus />
        <AuField label="Parol" icon={<IconLock />} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
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
          <AuField label="Ism" icon={<IconUser />} value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
          <AuField label="Familiya" icon={<IconUser />} value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
        </div>
        <AuField label="Email" icon={<IconMail />} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        <AuField label="Foydalanuvchi nomi" icon={<IconUser />} value={form.username} onChange={set('username')} autoComplete="username" autoCapitalize="none" />
        <AuField label="Parol" icon={<IconLock />} type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
        <AuButton busy={busy}>Ro'yxatdan o'tish</AuButton>
      </form>
    </AuthShell>
  );
}
