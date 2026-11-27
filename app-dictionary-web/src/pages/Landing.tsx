import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { speakEnglish } from '../util';
import { LabRun, LabTest, runLab } from './devLab';
import { PLAN, PLAN_GROUPS } from './devPlan';
import '../landing.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ facts
 * Counted from app-dictionary-server/src/main/resources (learn/ and dev/).
 * Recount when new lessons are added.
 */

/** English course, per level. Reading, listening and writing have 30 lessons each. */
const LEVELS = [
  { code: 'A1', name: "Boshlang'ich", topics: 25, grammar: 75 },
  { code: 'A2', name: 'Elementar', topics: 24, grammar: 72 },
  { code: 'B1', name: "O'rta", topics: 24, grammar: 72 },
  { code: 'B2', name: "O'rta-yuqori", topics: 24, grammar: 72 },
];
const SKILL_LESSONS = 30;

/** Frontend modules that already have lessons: [Junior, Middle]. */
const DEV_LESSONS: Record<string, [number, number]> = {
  internet: [13, 12],
  html: [7, 12],
  css: [23, 12],
  javascript: [33, 12],
  git: [8, 0],
  npm: [7, 0],
  react: [28, 0],
  tailwind: [9, 0],
};
const DEV_TOTAL = Object.values(DEV_LESSONS).reduce((s, [j, m]) => s + j + m, 0);

/* ------------------------------------------------------------------ try it: dictionary */

const WORDS = [
  { en: 'improve', uz: 'yaxshilamoq', def: 'to become better, or to make something better' },
  { en: 'journey', uz: 'sayohat, safar', def: 'travel from one place to another' },
  { en: 'curious', uz: 'qiziquvchan', def: 'wanting to know or learn something' },
];

function WordDemo() {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const w = WORDS[i];

  return (
    <div className="lp-demo-body">
      <p className="lp-demo-task">Kartani bosing va tarjimasini tekshiring.</p>
      <button type="button" className={`lp-flip ${flipped ? 'on' : ''}`} onClick={() => setFlipped((f) => !f)}>
        <span className="lp-flip-face" aria-hidden={flipped}>
          <b lang="en">{w.en}</b>
          <small lang="en">{w.def}</small>
        </span>
        <span className="lp-flip-face lp-flip-back" aria-hidden={!flipped}>
          <b>{w.uz}</b>
          <small lang="en">{w.en}</small>
        </span>
      </button>
      <div className="lp-demo-row">
        <button type="button" className="lp-chip" onClick={() => speakEnglish(w.en)}>Eshitish</button>
        <button type="button" className="lp-chip" onClick={() => { setFlipped(false); setI((n) => (n + 1) % WORDS.length); }}>
          Keyingi so'z
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ try it: English */

/** Taken from the A1 Present Simple lesson. */
const QUESTIONS = [
  { prompt: 'She ___ in a bank.', options: ['working', 'works', 'work'], answer: 'works' },
  { prompt: 'They ___ in London.', options: ['living', 'live', 'lives'], answer: 'live' },
  { prompt: 'I ___ in a shop.', options: ['work', 'worked', 'works'], answer: 'work' },
];
const RULE = "Faqat he / she / it bilan fe'lga -s qo'shiladi.";

function EnglishDemo() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = QUESTIONS[i];
  const [before, after] = q.prompt.split('___');

  return (
    <div className="lp-demo-body">
      <p className="lp-demo-task">A1 darsidan savol: bo'sh joyga mos so'zni tanlang.</p>
      <p className="lp-sentence" lang="en">
        {before}
        <span className={`lp-gap ${picked ? (picked === q.answer ? 'ok' : 'bad') : ''}`}>{picked ?? ' '}</span>
        {after}
      </p>
      <div className="lp-options">
        {q.options.map((o) => (
          <button
            key={o}
            type="button"
            lang="en"
            className={picked && o === q.answer ? 'ok' : picked === o ? 'bad' : ''}
            disabled={!!picked}
            onClick={() => setPicked(o)}
          >
            {o}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="lp-feedback">
        {picked && (
          <>
            <p><b>{picked === q.answer ? "To'g'ri." : `Noto'g'ri, javob: ${q.answer}.`}</b> {RULE}</p>
            <button type="button" className="lp-chip" onClick={() => { setPicked(null); setI((n) => (n + 1) % QUESTIONS.length); }}>
              Keyingi savol
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ try it: code */

/** Taken from the JavaScript Junior lab "Oraliqqa moslash"; it runs in the same sandboxed worker as the course labs. */
const STARTER = 'function clamp(n, min, max) {\n  return n;\n}';
const SOLUTION = 'function clamp(n, min, max) {\n  return Math.min(Math.max(n, min), max);\n}';
const TESTS: LabTest[] = [
  { call: 'clamp(5, 0, 10)', expect: '5' },
  { call: 'clamp(-3, 0, 10)', expect: '0' },
  { call: 'clamp(99, 0, 10)', expect: '10' },
];

function CodeDemo() {
  const [code, setCode] = useState(STARTER);
  const [run, setRun] = useState<LabRun | null>(null);
  const [busy, setBusy] = useState(false);
  const passed = !!run && !run.error && run.tests.length === TESTS.length && run.tests.every((t) => t.ok);

  const check = async () => {
    if (busy) return;
    setBusy(true);
    setRun(await runLab(code, TESTS));
    setBusy(false);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void check();
    }
  };

  return (
    <div className="lp-demo-body">
      <p className="lp-demo-task">
        <code>clamp</code> sonni <code>min</code> va <code>max</code> oralig'ida ushlab tursin.
      </p>
      <textarea
        className="lp-code"
        aria-label="JavaScript kodi"
        spellCheck={false}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        rows={4}
        data-lenis-prevent
        value={code}
        onChange={(e) => { setCode(e.target.value); setRun(null); }}
        onKeyDown={onKey}
      />
      <div className="lp-demo-row">
        <button type="button" className="lp-chip solid" onClick={check} disabled={busy}>{busy ? 'Tekshirilyapti…' : 'Tekshirish'}</button>
        <button type="button" className="lp-chip" onClick={() => { setCode(SOLUTION); setRun(null); }}>Yechimni qo'yish</button>
      </div>
      <div aria-live="polite">
        {run?.error && <p className="lp-test bad">{run.error}</p>}
        <ul className="lp-tests">
          {TESTS.map((t, i) => {
            const r = run && !run.error ? run.tests[i] : undefined;
            return (
              <li key={t.call} className={r ? (r.ok ? 'ok' : 'bad') : ''}>
                <span aria-hidden="true">{r ? (r.ok ? '✓' : '✗') : '○'}</span>
                <code>{t.call}</code>
                <small>{r && !r.ok ? `${r.error ?? r.got}, kutilgan ${t.expect}` : `kutilgan ${t.expect}`}</small>
              </li>
            );
          })}
        </ul>
        {passed && <p className="lp-test ok">Barcha testlar o'tdi.</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page content */

const TABS = [
  { key: 'lugat', label: "Lug'at", Demo: WordDemo },
  { key: 'ingliz', label: 'Ingliz tili', Demo: EnglishDemo },
  { key: 'kod', label: 'Dasturlash', Demo: CodeDemo },
] as const;

/** A word (or a piece of code), what the spotlight reveals, and where it floats (percent of the hero box). */
const LENS_WORDS = [
  { en: 'hello', uz: 'salom', x: 78, y: 23, s: 1.1 },
  { en: '<div>', uz: 'blok', x: 18, y: 78, s: 0.85 },
  { en: 'learn', uz: "o'rganmoq", x: 85, y: 56, s: 0.95 },
  { en: 'return', uz: 'qaytar', x: 50, y: 90, s: 0.75 },
  { en: 'book', uz: 'kitob', x: 9, y: 38, s: 0.75 },
  { en: 'const', uz: "o'zgarmas", x: 56, y: 11, s: 0.8 },
  { en: 'future', uz: 'kelajak', x: 88, y: 85, s: 0.85 },
  { en: 'grid', uz: "to'r", x: 28, y: 13, s: 0.8 },
];

const ROW_EN = ['hello', 'learn', 'friend', 'future', 'dream', 'journey', 'improve', 'curious'];
const ROW_CODE = ['<div>', 'const', 'flex', 'useState', 'git push', 'npm run', 'grid', 'return'];

const WORD_CARDS = [
  { title: 'Takrorlash', text: "Javobni yozasiz, variantlardan tanlaysiz yoki eshitib yozasiz." },
  { title: 'Fleshkart', text: "Kartani aylantirib, bilgan-bilmaganingizni belgilaysiz." },
  { title: 'Juftlarni moslash', text: "Inglizcha so'zlarni tarjimasi bilan juftlaysiz." },
  { title: 'Tez raund', text: "60 soniyada iloji boricha ko'p savolga javob berasiz." },
  { title: 'Gap tuzish', text: "So'z bilan gap yozasiz, sun'iy intellekt tekshirib, xatoni tushuntiradi." },
];

const LEVEL_TEXT: Record<string, string> = {
  A1: "Birinchi gaplar: to be, Present Simple, o'tgan zamon va predloglar.",
  A2: "Present Perfect, kelasi zamon, modal fe'llar va qiyoslash.",
  B1: "Shart gaplar, majhul nisbat, ko'chirma gap va relative clauses.",
  B2: "Aralash shart gaplar, hikoya zamonlari va ko'p adashiladigan joylar.",
};

const ENGLISH_NOTES = [
  { title: 'Avval qoida, keyin savol', text: "Grammatika darsi ta'rif, formulalar, signal so'zlar, hayotiy misollar va ko'p uchraydigan xatolardan boshlanadi." },
  { title: "Tinglashni o'zingizga moslang", text: "Audio tezligini 0.5× dan 2× gacha o'zgartiring, kerakli joyni qayta eshiting." },
  { title: 'Imtihon bilan keyingi darajaga', text: "Darsni 70% natija o'zlashtiradi. Daraja imtihonida umumiy 70% va har yo'nalishda kamida 50% kerak." },
];

const PROGRESS = [
  { title: 'Kunlik maqsad va ketma-ketlik', text: "Bugun qancha qolgani va necha kundan beri to'xtamaganingiz bosh sahifada." },
  { title: 'XP va yutuqlar', text: "Mashq va darslar tajriba ballari beradi, darajangiz va yutuqlaringiz ochilib boradi." },
  { title: 'Statistika va haftalik hisobot', text: "Qaysi mavzu kuchli, qaysi biri qaytarishni talab qilishini ko'rasiz." },
  { title: "Do'stlar bilan guruh", text: "Guruh oching, kodini do'stlaringizga yuboring va haftalik XP reytingida bellashing." },
];

const STATS = [
  { value: LEVELS.reduce((s, l) => s + l.grammar + SKILL_LESSONS * 3, 0), suffix: '', label: 'ingliz tili darsi, A1 dan B2 gacha' },
  { value: DEV_TOTAL, suffix: '', label: 'Frontend darsi' },
  { value: 1400, suffix: '+', label: 'brauzerda tekshiriladigan kod topshirig‘i' },
  { value: Object.keys(DEV_LESSONS).length, suffix: '', label: 'tayyor Frontend moduli' },
];

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('lugat');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector(sel) as T | null;
    const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root);

    document.documentElement.classList.add('lp-active');
    const prevTitle = document.title;
    document.title = "Qadam: so'z, ingliz tili va dasturlash";

    const fine = finePointer();
    root.classList.toggle('lp-fine', fine);

    const mm = gsap.matchMedia(root);

    mm.add(
      { desk: '(min-width: 900px)', mob: '(max-width: 899px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { desk, reduce } = ctx.conditions as { desk: boolean; reduce: boolean };
        const pre = $('.lp-pre');
        // Without motion the page is a plain, fully visible document.
        if (reduce) {
          if (pre) pre.style.display = 'none';
          return;
        }

        let dead = false;
        const cleanups: (() => void)[] = [];

        const lenis = new Lenis({ lerp: 0.1, anchors: true });
        const raf = (t: number) => lenis.raf(t * 1000);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        lenis.stop();
        cleanups.push(() => {
          gsap.ticker.remove(raf);
          lenis.destroy();
        });

        /* ---------- spotlight: the signature interaction ---------- */
        const hero = $('.lp-hero');
        const lens = $('.lp-lens');
        if (hero && lens) {
          const cur = { x: hero.clientWidth * 0.5, y: hero.clientHeight * 0.55, r: fine ? 0 : 150 };
          const tgt = { x: cur.x, y: cur.y };
          const onMove = (e: PointerEvent) => {
            const b = hero.getBoundingClientRect();
            tgt.x = e.clientX - b.left;
            tgt.y = e.clientY - b.top;
          };
          const onEnter = () => gsap.to(cur, { r: 190, duration: 0.6, ease: 'expo.out' });
          const onLeave = () => gsap.to(cur, { r: 0, duration: 0.6, ease: 'power3.out' });
          if (fine) {
            hero.addEventListener('pointermove', onMove);
            hero.addEventListener('pointerenter', onEnter);
            hero.addEventListener('pointerleave', onLeave);
          }
          const loop = (time: number) => {
            if (!fine) {
              // No hover on touch screens: the lens drifts on its own path.
              tgt.x = hero.clientWidth * (0.5 + 0.34 * Math.sin(time * 0.45));
              tgt.y = hero.clientHeight * (0.58 + 0.22 * Math.sin(time * 0.7 + 1));
            }
            cur.x += (tgt.x - cur.x) * 0.14;
            cur.y += (tgt.y - cur.y) * 0.14;
            lens.style.setProperty('--mx', cur.x.toFixed(1));
            lens.style.setProperty('--my', cur.y.toFixed(1));
            lens.style.setProperty('--r', cur.r.toFixed(1));
          };
          gsap.ticker.add(loop);
          cleanups.push(() => {
            gsap.ticker.remove(loop);
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerenter', onEnter);
            hero.removeEventListener('pointerleave', onLeave);
          });
        }

        /* ---------- custom cursor and magnetic buttons ---------- */
        if (fine) {
          const dot = $('.lp-cur-dot');
          const ring = $('.lp-cur-ring');
          if (dot && ring) {
            const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
            const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
            const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
            const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
            const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
            const over = (e: PointerEvent) => {
              const hot = (e.target as HTMLElement).closest('a, button, [data-cursor]');
              ring.classList.toggle('hot', !!hot);
            };
            window.addEventListener('pointermove', move);
            root.addEventListener('pointerover', over);
            cleanups.push(() => {
              window.removeEventListener('pointermove', move);
              root.removeEventListener('pointerover', over);
            });
          }
          $$('[data-magnetic]').forEach((el) => {
            const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
            const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
            const mv = (e: PointerEvent) => {
              const b = el.getBoundingClientRect();
              qx((e.clientX - (b.left + b.width / 2)) * 0.3);
              qy((e.clientY - (b.top + b.height / 2)) * 0.3);
            };
            const lv = () => { qx(0); qy(0); };
            el.addEventListener('pointermove', mv);
            el.addEventListener('pointerleave', lv);
            cleanups.push(() => {
              el.removeEventListener('pointermove', mv);
              el.removeEventListener('pointerleave', lv);
            });
          });
        }

        /* ---------- intro: count to 100, wipe, hero reveal ---------- */
        const h1 = $('.lp-h1');
        const rest = '.lp-nav, .lp-sub, .lp-hero .lp-cta-row, .lp-hint';
        gsap.set(rest, { autoAlpha: 0, y: 24 });
        gsap.set('.lp-lens', { autoAlpha: 0, scale: 1.08 });
        gsap.set(h1, { autoAlpha: 0 });
        const intro = () => {
          if (dead) return;
          const split = h1 ? SplitText.create(h1, { type: 'lines', mask: 'lines' }) : null;
          const num = $('.lp-pre-num');
          const counter = { v: 0 };
          const tl = gsap.timeline({ onComplete: () => { if (pre) pre.style.display = 'none'; lenis.start(); } });
          gsap.set(h1, { autoAlpha: 1 });
          if (split) gsap.set(split.lines, { yPercent: 115 });
          tl.to(counter, {
            v: 100, duration: 1.4, ease: 'power2.inOut',
            onUpdate: () => { if (num) num.textContent = String(Math.round(counter.v)).padStart(2, '0'); },
          })
            .to('.lp-pre-bar i', { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0)
            .to('.lp-pre-inner', { autoAlpha: 0, y: -30, duration: 0.45, ease: 'power3.in' }, '>0.1')
            .to(pre, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '>-0.1')
            .to('.lp-lens', { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, '<0.25');
          if (split) tl.to(split.lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, '<0.2');
          tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 }, '<0.5');
        };
        document.fonts.ready.then(intro);

        gsap.to('.lp-hero-inner', {
          yPercent: -14, autoAlpha: 0.2, ease: 'none',
          scrollTrigger: { trigger: '.lp-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        gsap.to('.lp-row-a', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.lp-marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.lp-row-b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.lp-marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } });

        /* ---------- pinned scenes, created in page order ---------- */
        const track = $('.lp-track');
        if (desk && track) {
          const dist = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
          gsap.to(track, {
            x: () => -dist(), ease: 'none',
            scrollTrigger: { trigger: '.lp-words', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
          });
        }

        const lvs = $$('.lp-lv');
        const txt = $$('.lp-lvtext');
        if (desk && lvs.length === txt.length && lvs.length > 1) {
          gsap.set([...lvs.slice(1), ...txt.slice(1)], { autoAlpha: 0, yPercent: 14 });
          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: { trigger: '.lp-path', start: 'top top', end: '+=300%', pin: true, scrub: 0.6 },
          });
          for (let i = 1; i < lvs.length; i++) {
            tl.addLabel(`s${i}`, '+=0.5')
              .to([lvs[i - 1], txt[i - 1]], { autoAlpha: 0, yPercent: -14, duration: 0.6 }, `s${i}`)
              .to([lvs[i], txt[i]], { autoAlpha: 1, yPercent: 0, duration: 0.6 }, `s${i}+=0.15`);
          }
          tl.to({}, { duration: 0.5 });
          tl.fromTo('.lp-rail i', { scaleY: 0.04 }, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0);
        }

        /* ---------- reveals and counters ---------- */
        $$('[data-reveal]').forEach((el) => {
          gsap.from(el, { y: 50, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
        $$('.lp-split').forEach((el) => {
          const s = SplitText.create(el, { type: 'lines', mask: 'lines' });
          gsap.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        });
        $$('.lp-group ul').forEach((ul) => {
          gsap.from(ul.children, { y: 26, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: ul, start: 'top 90%', once: true } });
        });
        $$('.lp-count').forEach((el) => {
          const to = Number(el.dataset.to);
          const suffix = el.dataset.suffix ?? '';
          const o = { v: 0 };
          gsap.to(o, {
            v: to, duration: 1.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
          });
        });
        gsap.from('.lp-foot-word', { yPercent: 40, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.lp-foot', start: 'top 85%', once: true } });

        // The demos grow when answered, which moves every trigger below them.
        const demo = $('.lp-demo');
        if (demo) {
          let timer = 0;
          const ro = new ResizeObserver(() => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
          });
          ro.observe(demo);
          cleanups.push(() => {
            window.clearTimeout(timer);
            ro.disconnect();
          });
        }

        document.fonts.ready.then(() => { if (!dead) ScrollTrigger.refresh(); });

        return () => {
          dead = true;
          cleanups.forEach((fn) => fn());
        };
      },
    );

    return () => {
      mm.revert();
      document.documentElement.classList.remove('lp-active');
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="lp" ref={rootRef}>
      <div className="lp-grain" aria-hidden />
      <div className="lp-cur-ring" aria-hidden />
      <div className="lp-cur-dot" aria-hidden />

      <div className="lp-pre" aria-hidden>
        <div className="lp-pre-inner">
          <span className="lp-pre-word">Qadam</span>
          <span className="lp-pre-num">00</span>
        </div>
        <div className="lp-pre-bar"><i /></div>
      </div>

      <header className="lp-nav">
        <a href="#top" className="lp-logo">Qadam<sup>®</sup></a>
        <nav className="lp-anchors" aria-label="Sahifa bo'limlari">
          <a href="#lugat" className="lp-link">Lug'at</a>
          <a href="#ingliz" className="lp-link">Ingliz tili</a>
          <a href="#dasturlash" className="lp-link">Dasturlash</a>
        </nav>
        <div className="lp-auth">
          <Link to="/login" className="lp-link">Kirish</Link>
          <Link to="/register" className="lp-btn lp-btn-sm" data-magnetic>Boshlash</Link>
        </div>
      </header>

      <main id="top">
        <section className="lp-hero">
          <div className="lp-lens" aria-hidden>
            <div className="lp-lens-base">
              {LENS_WORDS.map((w) => (
                <span key={w.en} className="lp-w" style={{ left: `${w.x}%`, top: `${w.y}%`, ['--s' as string]: w.s }}>{w.en}</span>
              ))}
            </div>
            <div className="lp-lens-rev">
              {LENS_WORDS.map((w) => (
                <span key={w.en} className="lp-w" style={{ left: `${w.x}%`, top: `${w.y}%`, ['--s' as string]: w.s }}>{w.uz}</span>
              ))}
            </div>
          </div>
          <div className="lp-hero-inner">
            <p className="lp-eyebrow">So'z, ingliz tili va dasturlash, o'zbek tilida</p>
            <h1 className="lp-h1">So'z yodlang, <em>ingliz tilini</em> o'rganing, <em>kod</em> yozing.</h1>
            <p className="lp-sub">
              Shaxsiy lug'at, A1 dan B2 gacha ingliz tili kursi va amaliy topshiriqli Frontend kursi. Hammasi bitta hisobda.
            </p>
            <div className="lp-cta-row">
              <Link to="/register" className="lp-btn" data-magnetic>Bepul boshlash <span aria-hidden>↗</span></Link>
              <Link to="/login" className="lp-btn lp-btn-ghost" data-magnetic>Hisobim bor</Link>
            </div>
          </div>
          <p className="lp-hint">
            {finePointer() ? "Kursorni so'zlar ustida yurgizing, ma'nosi ochiladi" : "So'zlar ustida ma'nosi ochilib turadi"}
          </p>
        </section>

        <section className="lp-marquee" aria-hidden>
          <div className="lp-row lp-row-a">
            {[...ROW_EN, ...ROW_EN, ...ROW_EN].map((w, i) => (<span key={i}>{w}<i>✦</i></span>))}
          </div>
          <div className="lp-row lp-row-b lp-row-code">
            {[...ROW_CODE, ...ROW_CODE, ...ROW_CODE].map((w, i) => (<span key={i}>{w}<i>✦</i></span>))}
          </div>
        </section>

        {/* 01: try all three before signing up */}
        <section className="lp-try">
          <div className="lp-try-head">
            <p className="lp-eyebrow">01 / 05. Sinab ko'ring</p>
            <h2 className="lp-split lp-serif lp-h2">Ro'yxatdan o'tmasdan <em>tatib ko'ring.</em></h2>
          </div>
          <div className="lp-demo" data-reveal>
            <div className="lp-tabs" role="group" aria-label="Yo'nalishni tanlang">
              {TABS.map((t) => (
                <button key={t.key} type="button" className="lp-tab" aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
            {/* every demo stays mounted so switching tabs keeps what the visitor did */}
            {TABS.map(({ key, Demo }) => (
              <div key={key} className="lp-pane" hidden={tab !== key}>
                <Demo />
              </div>
            ))}
          </div>
        </section>

        {/* 02: dictionary, a horizontal track. The wrapper carries the anchor because pinning moves the section. */}
        <div id="lugat">
          <section className="lp-words">
            <div className="lp-head">
              <p className="lp-eyebrow">02 / 05. Lug'at</p>
              <h2 className="lp-split lp-serif lp-h2">O'zingizga kerak so'zlardan <em>lug'at tuzing.</em></h2>
              <p className="lp-lead">
                So'zga tarjima, izoh va rasm qo'shing, talaffuzini eshiting. So'z yangi, o'rganilmoqda va o'zlashtirilgan
                bosqichlaridan o'tadi, qiynalganlaringiz esa zaif so'zlar ro'yxatiga tushadi.
              </p>
            </div>
            <div className="lp-track">
              {WORD_CARDS.map((c, i) => (
                <article key={c.title} className={`lp-card lp-tone-${'abc'[i % 3]}`} data-cursor>
                  <span className="lp-card-n">0{i + 1}</span>
                  <div>
                    <h3 className="lp-serif">{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* 03: English, one level per scroll step */}
        <div id="ingliz">
          <section className="lp-path">
            <div className="lp-path-pin">
              <p className="lp-eyebrow">03 / 05. Ingliz tili kursi, A1 dan B2 gacha</p>
              <div className="lp-path-grid">
                <div className="lp-level-big" aria-hidden>
                  {LEVELS.map((l) => (<span key={l.code} className="lp-lv">{l.code}</span>))}
                </div>
                <div className="lp-path-copy">
                  {LEVELS.map((l) => (
                    <article key={l.code} className="lp-lvtext">
                      <h2 className="lp-serif"><span className="lp-lvcode">{l.code}</span> {l.name}</h2>
                      <p>{LEVEL_TEXT[l.code]}</p>
                      <ul>
                        <li>{l.topics} grammatika mavzusi</li>
                        <li>{l.grammar + SKILL_LESSONS * 3} dars</li>
                        <li>O'qish, tinglash, yozish</li>
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
              <div className="lp-rail" aria-hidden><i /></div>
            </div>
          </section>
        </div>
        <section className="lp-notes">
          {ENGLISH_NOTES.map((n) => (
            <div key={n.title} data-reveal>
              <h3 className="lp-serif">{n.title}</h3>
              <p>{n.text}</p>
            </div>
          ))}
        </section>

        {/* 04: programming roadmap */}
        <section id="dasturlash" className="lp-code-sec">
          <div className="lp-head">
            <p className="lp-eyebrow">04 / 05. Dasturlash</p>
            <h2 className="lp-split lp-serif lp-h2">Internet asoslaridan <em>React gacha.</em></h2>
            <p className="lp-lead">
              Har dars hayotiy o'xshatish va nazariyadan boshlanib, test bilan tekshiriladi. Ko'p modullarda kodni
              brauzerning o'zida yozasiz: JavaScript, HTML, CSS, React, Tailwind, hatto Git va npm buyruqlari.
            </p>
          </div>

          <div className="lp-stat-grid">
            {STATS.map((s) => (
              <div key={s.label} className="lp-stat">
                <strong className="lp-serif lp-count" data-to={s.value} data-suffix={s.suffix}>{s.value}{s.suffix}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <ol className="lp-map">
            {PLAN_GROUPS.map((g) => (
              <li key={g.title} className="lp-group">
                <h3 className="lp-serif">{g.title}</h3>
                <ul>
                  {g.keys.map((key) => {
                    const m = PLAN.find((p) => p.key === key);
                    if (!m) return null;
                    const n = DEV_LESSONS[key];
                    return (
                      <li key={key} className={`lp-mod ${n ? 'ready' : ''}`}>
                        <b>{m.title}</b>
                        <small>{n ? `${n[0] + n[1]} dars. ${n[1] ? 'Junior, Middle' : 'Junior'}` : 'Tayyorlanmoqda'}</small>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* 05: shared by all three */}
        <section className="lp-progress">
          <p className="lp-eyebrow">05 / 05. O'sish</p>
          <h2 className="lp-split lp-serif lp-h2">Uchala yo'nalishda <em>ko'rinib turadi.</em></h2>
          <ul>
            {PROGRESS.map((p) => (
              <li key={p.title} data-reveal>
                <h3 className="lp-serif">{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="lp-end">
          <h2 className="lp-split lp-serif lp-h2 lp-h2-xl">Bugun birinchi <em>darsni</em> boshlang.</h2>
          <p className="lp-lead" data-reveal>Hisob oching, keyin profilda o'zingizga kerak yo'nalishlarni yoqing.</p>
          <div className="lp-cta-row" data-reveal>
            <Link to="/register" className="lp-btn lp-btn-lg" data-magnetic>Hisob yaratish <span aria-hidden>↗</span></Link>
            <Link to="/login" className="lp-btn lp-btn-ghost lp-btn-lg" data-magnetic>Kirish</Link>
          </div>
        </section>
      </main>

      <footer className="lp-foot">
        <div className="lp-foot-row">
          <span>© {new Date().getFullYear()} Qadam</span>
          <span>So'z, ingliz tili va dasturlash</span>
        </div>
        <div className="lp-foot-word lp-serif" aria-hidden>Qadam</div>
      </footer>
    </div>
  );
}
