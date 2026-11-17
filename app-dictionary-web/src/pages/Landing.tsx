import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import '../landing.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** English word, its Uzbek meaning, and where it floats in the hero (percent of the hero box). */
const LENS_WORDS: { en: string; uz: string; x: number; y: number; s: number }[] = [
  { en: 'hello', uz: 'salom', x: 74, y: 24, s: 1.15 },
  { en: 'friend', uz: "do'st", x: 16, y: 76, s: 0.9 },
  { en: 'learn', uz: "o'rganmoq", x: 84, y: 58, s: 1 },
  { en: 'home', uz: 'uy', x: 46, y: 88, s: 0.8 },
  { en: 'book', uz: 'kitob', x: 10, y: 40, s: 0.75 },
  { en: 'water', uz: 'suv', x: 58, y: 9, s: 0.85 },
  { en: 'future', uz: 'kelajak', x: 90, y: 86, s: 0.9 },
  { en: 'dream', uz: 'orzu', x: 30, y: 12, s: 0.8 },
];

const LEVELS = [
  { code: 'A1', name: "Boshlang'ich", text: "Birinchi gaplar: to be, Present Simple, o'tgan zamon, predloglar. Oddiy, aniq, ko'p mashq bilan.", tags: ['25 grammatika mavzusi', "O'qish · Tinglash · Yozish"] },
  { code: 'A2', name: 'Asosiy', text: "Present Perfect, kelasi zamon, modal fe'llar va qiyoslash: kundalik suhbatga yetarli poydevor.", tags: ['24 grammatika mavzusi', 'Hayotiy matnlar'] },
  { code: 'B1', name: "O'rta", text: "Shart gaplar, majhul nisbat, ko'chirma gap va relative clauses: fikringizni erkin ifodalay boshlaysiz.", tags: ['24 grammatika mavzusi', 'Uzunroq matn va audio'] },
  { code: 'B2', name: "O'rta-yuqori", text: "Aralash shart gaplar, hikoya zamonlari va aynan ko'p adashiladigan joylar: nozik farqlarga e'tibor.", tags: ['24 grammatika mavzusi', "Xatolarga yo'naltirilgan darslar"] },
];

const FEATURES = [
  { n: '01', title: "Dars yo'li", text: "O'qish, tinglash, yozish va grammatika: har kuni kichik maqsad. 70% dan yuqori natija darsni o'zlashtiradi.", tone: 'a' },
  { n: '02', title: 'Tinglash', text: "Bitta audio, o'nta savol. Tezlikni 0.5× dan 2× gacha o'zgartiring, oldinga va orqaga suring.", tone: 'b' },
  { n: '03', title: 'Grammatika', text: "Avval mavzu: ta'rif, formulalar va hayotiy misollar. Tushunganingizdan keyin savollar boshlanadi.", tone: 'c' },
  { n: '04', title: 'Gap tuzish', text: "So'z bilan gap tuzing, sun'iy intellekt xatongizni topib, sababini tushuntiradi.", tone: 'a' },
  { n: '05', title: "So'zlar", text: "O'z lug'atingiz, kartochkalar, takrorlash va zaif so'zlar bilan ishlash.", tone: 'b' },
  { n: '06', title: 'Yutuqlar', text: "XP, yutuqlar va haftalik hisobot: o'sishingiz ko'z oldingizda.", tone: 'c' },
];

const STATS = [
  { value: 4, suffix: '', label: 'daraja: A1 dan B2 gacha' },
  { value: 650, suffix: '+', label: 'dars va mashq to‘plami' },
  { value: 97, suffix: '', label: 'grammatika mavzusi' },
  { value: 2, suffix: '×', label: 'tinglash tezligi, 0.5× gacha' },
];

const ROW_EN = ['hello', 'learn', 'friend', 'future', 'dream', 'home', 'book', 'water', 'speak', 'listen'];
const ROW_UZ = ['salom', "o'rganmoq", "do'st", 'kelajak', 'orzu', 'uy', 'kitob', 'suv', 'gapirmoq', 'tinglamoq'];

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector(sel) as T | null;
    const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel, root);

    document.documentElement.classList.add('lp-active');
    const prevTitle = document.title;
    document.title = "Lug'at — ingliz tilini so'z bilan boshla";

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    root.classList.toggle('lp-fine', fine);

    const lenis = new Lenis({ lerp: 0.1 });
    const raf = (t: number) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia(root);

    mm.add(
      { desk: '(min-width: 900px)', mob: '(max-width: 899px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { desk, reduce } = ctx.conditions as { desk: boolean; reduce: boolean };
        let dead = false;
        const cleanups: (() => void)[] = [];

        // Counters always end on their real number, even without motion.
        $$('.lp-count').forEach((el) => {
          const to = Number(el.dataset.to);
          const suffix = el.dataset.suffix ?? '';
          if (reduce) {
            el.textContent = `${to}${suffix}`;
            return;
          }
          const o = { v: 0 };
          gsap.to(o, {
            v: to, duration: 1.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
          });
        });

        const pre = $('.lp-pre');
        if (reduce) {
          if (pre) pre.style.display = 'none';
          return;
        }

        lenis.stop();

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

        /* ---------- custom cursor ---------- */
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

          // Magnetic buttons.
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

        /* ---------- intro: preloader count, wipe, hero reveal ---------- */
        const intro = () => {
          if (dead) return;
          const h1 = $('.lp-h1');
          const split = h1 ? SplitText.create(h1, { type: 'lines', mask: 'lines' }) : null;
          const num = $('.lp-pre-num');
          const counter = { v: 0 };
          const tl = gsap.timeline({ onComplete: () => { if (pre) pre.style.display = 'none'; lenis.start(); } });
          gsap.set('.lp-nav, .lp-sub, .lp-hero .lp-cta-row, .lp-hint', { autoAlpha: 0, y: 24 });
          gsap.set('.lp-lens', { autoAlpha: 0, scale: 1.08 });
          if (split) gsap.set(split.lines, { yPercent: 115 });

          tl.to(counter, {
            v: 100, duration: 1.5, ease: 'power2.inOut',
            onUpdate: () => { if (num) num.textContent = String(Math.round(counter.v)).padStart(2, '0'); },
          })
            .to('.lp-pre-bar i', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
            .to('.lp-pre-inner', { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power3.in' }, '>0.1')
            .to(pre, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '>-0.1')
            .to('.lp-lens', { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, '<0.25');
          if (split) tl.to(split.lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, '<0.2');
          tl.to('.lp-nav, .lp-sub, .lp-hero .lp-cta-row, .lp-hint', { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 }, '<0.5');
        };
        document.fonts.ready.then(intro);

        // Hero drifts away as you scroll.
        gsap.to('.lp-hero-inner', {
          yPercent: -14, autoAlpha: 0.2, ease: 'none',
          scrollTrigger: { trigger: '.lp-hero', start: 'top top', end: 'bottom top', scrub: true },
        });

        /* ---------- marquee strips tied to scroll ---------- */
        gsap.to('.lp-row-a', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.lp-marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.lp-row-b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.lp-marquee', start: 'top bottom', end: 'bottom top', scrub: 1 } });

        /* ---------- generic reveals ---------- */
        $$('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 50, autoAlpha: 0, duration: 1.1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
        $$('.lp-split').forEach((el) => {
          const s = SplitText.create(el, { type: 'lines', mask: 'lines' });
          gsap.from(s.lines, {
            yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });

        /* ---------- scene: the road through the levels ---------- */
        const lvs = $$('.lp-lv');
        const txt = $$('.lp-lvtext');
        if (desk && lvs.length === txt.length && lvs.length > 1) {
          gsap.set([...lvs.slice(1), ...txt.slice(1)], { autoAlpha: 0, yPercent: 14 });
          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: { trigger: '.lp-path', start: 'top top', end: '+=320%', pin: true, scrub: 0.6 },
          });
          for (let i = 1; i < lvs.length; i++) {
            tl.addLabel(`s${i}`, '+=0.5')
              .to([lvs[i - 1], txt[i - 1]], { autoAlpha: 0, yPercent: -14, duration: 0.6 }, `s${i}`)
              .to([lvs[i], txt[i]], { autoAlpha: 1, yPercent: 0, duration: 0.6 }, `s${i}+=0.15`);
          }
          tl.to({}, { duration: 0.5 });
          tl.fromTo('.lp-rail i', { scaleY: 0.04 }, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0);
        }

        /* ---------- scene: features on a horizontal track ---------- */
        const track = $('.lp-track');
        if (desk && track) {
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);
          gsap.to(track, {
            x: () => -dist(), ease: 'none',
            scrollTrigger: { trigger: '.lp-feat', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
          });
        } else {
          $$('.lp-card').forEach((el) => {
            gsap.from(el, { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
          });
        }

        /* ---------- closing call ---------- */
        gsap.from('.lp-foot-word', {
          yPercent: 40, autoAlpha: 0, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: '.lp-foot', start: 'top 85%', once: true },
        });

        document.fonts.ready.then(() => { if (!dead) ScrollTrigger.refresh(); });

        return () => {
          dead = true;
          cleanups.forEach((fn) => fn());
        };
      },
    );

    return () => {
      mm.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
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
          <span className="lp-pre-word">Lug'at</span>
          <span className="lp-pre-num">00</span>
        </div>
        <div className="lp-pre-bar"><i /></div>
      </div>

      <header className="lp-nav">
        <Link to="/" className="lp-logo">Lug'at<sup>®</sup></Link>
        <nav>
          <Link to="/login" className="lp-link">Kirish</Link>
          <Link to="/register" className="lp-btn lp-btn-sm" data-magnetic>Boshlash</Link>
        </nav>
      </header>

      {/* 01 — hero */}
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
          <p className="lp-eyebrow">01 — Ingliz tili, o'zbekcha tushuntirish</p>
          <h1 className="lp-h1">
            So'zdan <em>gapgacha,</em> gapdan <em>erkin</em> nutqgacha.
          </h1>
          <p className="lp-sub">
            Darslar, grammatika, tinglash, lug'at va sun'iy intellekt bilan gap tuzish: A1 dan B2 gacha bitta joyda.
          </p>
          <div className="lp-cta-row">
            <Link to="/register" className="lp-btn" data-magnetic>Bepul boshlash <span aria-hidden>↗</span></Link>
            <Link to="/login" className="lp-btn lp-btn-ghost" data-magnetic>Hisobim bor</Link>
          </div>
        </div>
        <p className="lp-hint">{fineHint()}</p>
      </section>

      {/* marquee */}
      <section className="lp-marquee" aria-hidden>
        <div className="lp-row lp-row-a">
          {[...ROW_EN, ...ROW_EN, ...ROW_EN].map((w, i) => (<span key={i}>{w}<i>✦</i></span>))}
        </div>
        <div className="lp-row lp-row-b lp-row-uz">
          {[...ROW_UZ, ...ROW_UZ, ...ROW_UZ].map((w, i) => (<span key={i}>{w}<i>✦</i></span>))}
        </div>
      </section>

      {/* 02 — levels */}
      <section className="lp-path">
        <div className="lp-path-pin">
          <p className="lp-eyebrow">02 — Yo'l</p>
          <div className="lp-path-grid">
            <div className="lp-level-big" aria-hidden>
              {LEVELS.map((l) => (<span key={l.code} className="lp-lv">{l.code}</span>))}
            </div>
            <div className="lp-path-copy">
              {LEVELS.map((l) => (
                <article key={l.code} className="lp-lvtext">
                  <h2 className="lp-serif"><span className="lp-lvcode">{l.code}</span> {l.name}</h2>
                  <p>{l.text}</p>
                  <ul>{l.tags.map((t) => (<li key={t}>{t}</li>))}</ul>
                </article>
              ))}
            </div>
          </div>
          <div className="lp-rail" aria-hidden><i /></div>
        </div>
      </section>

      {/* 03 — features */}
      <section className="lp-feat">
        <div className="lp-feat-head">
          <p className="lp-eyebrow">03 — Ichida nima bor</p>
          <h2 className="lp-split lp-serif lp-h2">Nazariyadan amaliyotgacha, <em>bir yo'lda.</em></h2>
        </div>
        <div className="lp-track">
          {FEATURES.map((f) => (
            <article key={f.n} className={`lp-card lp-tone-${f.tone}`} data-cursor>
              <span className="lp-card-n">{f.n}</span>
              <div>
                <h3 className="lp-serif">{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 04 — numbers */}
      <section className="lp-stats">
        <p className="lp-eyebrow" data-reveal>04 — Raqamlarda</p>
        <div className="lp-stat-grid">
          {STATS.map((s) => (
            <div key={s.label} className="lp-stat" data-reveal>
              <strong className="lp-serif lp-count" data-to={s.value} data-suffix={s.suffix}>{s.value}{s.suffix}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — call */}
      <section className="lp-end">
        <p className="lp-eyebrow" data-reveal>05 — Boshlaymiz</p>
        <h2 className="lp-split lp-serif lp-h2 lp-h2-xl">Bugun bitta <em>so'zdan</em> boshlang.</h2>
        <div className="lp-cta-row" data-reveal>
          <Link to="/register" className="lp-btn lp-btn-lg" data-magnetic>Hisob yaratish <span aria-hidden>↗</span></Link>
          <Link to="/login" className="lp-btn lp-btn-ghost lp-btn-lg" data-magnetic>Kirish</Link>
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-foot-row">
          <span>© {new Date().getFullYear()} Lug'at</span>
          <span>Ingliz tilini o'zbek tilida o'rganing</span>
        </div>
        <div className="lp-foot-word lp-serif" aria-hidden>Lug'at</div>
      </footer>
    </div>
  );
}

function fineHint() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ? "Kursorni so'zlar ustida yurgizing — tarjimasi ochiladi ↘"
    : "So'zlar ustida tarjima ochilib turadi ↘";
}
