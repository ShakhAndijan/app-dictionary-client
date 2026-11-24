// CSS, lessons 17-23: responsive, container queries, custom properties, modern selectors, transform, animation, architecture.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 17 */
  lesson({
    title: 'Responsive dizayn',
    intro: "viewport meta, mobile-first, media query, nisbiy o'lchamlar va responsiv rasm.",
    theory: {
      analogy: { icon: '💧', title: 'Suv va idish', text: "Suv idish shakliga moslashadi. Yaxshi sahifa ham telefon, planshet, monitor — qaysi idishga solinsa, shunga moslashadi." },
      sections: [
        { code: { lang: 'html', text: '<meta name="viewport" content="width=device-width, initial-scale=1">' } },
        { code: { lang: 'css', text: '/* mobile-first: avval kichik ekran, keyin min-width bilan kengaytirish */\n.cols { display: grid; gap: 16px; }\n@media (min-width: 768px) { .cols { grid-template-columns: 1fr 1fr; } }\n@media (prefers-reduced-motion: reduce) { * { animation: none; } }\n@media (hover: hover) { .btn:hover { background: #eee; } }\nimg { max-width: 100%; height: auto; }' } },
        { bullets: ["Viewport meta bo'lmasa, mobil brauzer sahifani ~980px deb hisoblab kichraytiradi.", "min-width — mobile-first, max-width — desktop-first.", "(768px <= width < 1024px) kabi oraliqlarni (min-width: 768px) and (max-width: 1023.98px) bilan beriladi.", "Breakpoint qurilmaga emas, MAZMUN buzilgan joyga qo'yiladi.", "srcset va sizes — ekran zichligi/kengligiga mos rasm yuklash.", "prefers-color-scheme, prefers-reduced-motion, hover: hover, pointer: coarse kabi imkoniyat so'rovlari."] },
      ],
      recap: ["Viewport meta shart.", "Mobile-first: min-width.", "Breakpoint — mazmun buzilganda.", "hover: hover — sichqoncha borligini aniqlaydi."],
    },
    defs: [
      ['Viewport meta', "mobil brauzerga sahifa kengligini qurilma kengligiga tenglashtirishni aytadi."],
      ['Media query', "ekran xususiyatlariga qarab CSS ni shartli qo'llash."],
      ['Mobile-first', "avval mobil uchun yozib, keyin min-width bilan kengaytirish."],
      ['Breakpoint', "maket o'zgaradigan kenglik chegarasi."],
    ],
    life: [
      ['👟', 'Kiyim o\'lchami', "Do'konda S, M, L o'lcham bo'ladi, lekin hammaga mos kelish uchun mato cho'ziladi (fluid), faqat juda katta o'lchamga alohida andoza kerak (breakpoint)."],
      ['🚌', "Transport yo'nalishi", "Odamlar ko'p bo'lsa (keng ekran) qo'shimcha reys qo'shiladi (ustun), kam bo'lsa bitta avtobus."],
    ],
    practice: [
      { title: 'Mobile-first maket', text: "1 ustundan boshlab 768px da 2, 1100px da 3 ustunli maket yozing; faqat min-width ishlating." },
      { title: 'Responsiv rasm', text: "srcset va sizes bilan 400w, 800w, 1600w variantli rasm qo'ying va Network panelida qaysi biri yuklanganini ko'ring." },
    ],
    items: [
      ch("Telefonda sahifa juda kichik ko'rinyapti, desktop maketi kichraygan. Sabab?", "Viewport meta tegi yo'q", ["CSS fayl yuklanmagan", "min-width noto'g'ri", "Rasm juda katta"], "Meta bo'lmasa brauzer ~980px layout kengligi deb oladi."),
      ch("Mobile-first yondashuvda asosiy media query qaysi?", "@media (min-width: ...)", ["@media (max-width: ...)", "@media print", "@media (orientation)"], "Avval kichik ekran stili, keyin kattalar uchun min-width bilan qo'shiladi."),
      ch("Qaysi stil 800px kenglikda ishlaydi?", "Ikkala qoida: ko'k ham, keyin qizil (qizil yutadi)", ["Faqat ko'k", "Faqat qizil", "Hech biri"], "800 >= 600 va 800 >= 700: ikkala qoida mos, oxirgi yutadi.", '@media (min-width: 600px) { .a { color: blue; } }\n@media (min-width: 700px) { .a { color: red; } }'),
      ch("Qaysi biri 700px kenglikda ISHLAMAYDI?", "@media (min-width: 701px)", ["@media (max-width: 700px)", "@media (min-width: 700px)", "@media (min-width: 0)"], "700 < 701."),
      ch("Sensorli qurilmalarda hover effekti 'yopishib qolmasligi' uchun?", "@media (hover: hover) ichiga o'rash", ["@media (hover: none) faqat sensor uchun emas", "pointer-events: none", "touch-action: none"], "hover: hover — asosiy kiritish qurilmasi hover qila oladi."),
      ch("srcset va sizes nima beradi?", "Brauzer qurilmaga mos o'lchamli rasmni tanlab yuklaydi", ["Rasmni siqadi", "Rasmni animatsiya qiladi", "Rasmni xiralashtiradi"], "Kichik ekranga katta rasm yuklanmaydi."),
      ch("Breakpoint larni qanday tanlash to'g'ri?", "Mazmun buzila boshlagan kenglik bo'yicha", ["Mashhur qurilmalar kengligi bo'yicha", "Faqat 768 va 1024", "Tasodifiy"], "Qurilmalar o'zgaradi, mazmun esa o'zgarmaydi."),
      ch("img { max-width: 100%; height: auto } nima qiladi?", "Rasm konteynerdan chiqmaydi va nisbati saqlanadi", ["Rasmni cho'zadi", "Rasmni kesadi", "Faqat kichraytiradi, kattalashtira olmaydi hamda nisbatni buzadi"], "height: auto — nisbatni saqlash."),
      ch("prefers-reduced-motion: reduce nimani anglatadi?", "Foydalanuvchi tizimda animatsiyalarni kamaytirishni so'ragan", ["Qurilma sekin", "Internet sekin", "Ekran kichik"], "Animatsiyani o'chirish yoki kamaytirish kerak."),
      ch("(min-width: 768px) and (max-width: 1023px) qaysi oraliq?", "768px dan 1023px gacha (ikkalasi ham kiradi)", ["769 dan 1022 gacha", "768 dan 1024 gacha", "Faqat 768"], "min va max chegaralarni o'z ichiga oladi."),
      ch("Nega rem lik breakpoint (48rem) px dan yaxshiroq?", "Foydalanuvchi shrift kattalashtirsa, breakpoint ham mos ravishda siljiydi", ["rem tezroq", "px ishlamaydi", "rem faqat min-width da"], "Shrift sozlamasiga mos moslashadi."),
    ],
  });

  /* 18 */
  lesson({
    title: 'Container queries',
    intro: "container-type, @container, cqw va komponent asosidagi responsivlik.",
    theory: {
      analogy: { icon: '🪑', title: 'Stol atrofida', text: "Stulning o'lchami xona o'lchamiga emas, o'zi turgan stolga qarab tanlanadi. Komponent ham ekranga emas, o'zi turgan konteynerga qarab moslashadi." },
      sections: [
        { code: { lang: 'css', text: '.sidebar, .main { container-type: inline-size; container-name: box; }\n\n.card { display: grid; gap: 8px; }\n@container box (min-width: 400px) {\n  .card { grid-template-columns: 120px 1fr; }\n}\n\n.title { font-size: clamp(1rem, 4cqw, 2rem); } /* cqw: konteyner kengligining 1% */' } },
        { table: { head: ['Birlik', 'Ma\'no'], rows: [['cqw', "Konteyner kengligining 1%"], ['cqh', "Konteyner balandligining 1%"], ['cqi / cqb', "Inline / block o'qdagi 1%"]] } },
        { bullets: ["@container FAQAT container-type berilgan ajdod ni so'raydi, elementning o'zini emas.", "container-type: inline-size konteynerning inline o'lchamini boshqa narsaga bog'liq qilmaydi (layout containment), shuning uchun ichki mazmun kengligi uni o'zgartira olmaydi.", "Komponent qayerda joylashsa ham (sidebar yoki main) o'zini moslashtiradi: media query buni qila olmaydi.", "container-type: size — ikkala o'lcham, qattiq o'lchamli konteyner talab qiladi."] },
      ],
      recap: ["Media query — oyna, container query — ajdod konteyner.", "container-type shart.", "Element o'zini so'ray olmaydi: faqat ajdodni.", "cqw — konteyner kengligining 1%."],
    },
    defs: [
      ['Container query', "ajdod konteyner o'lchamiga bog'liq stil qoidasi."],
      ['container-type', "elementni so'rov uchun konteyner qiladigan xususiyat."],
      ['cqw', "konteyner kengligining 1% ga teng birlik."],
      ['Layout containment', "ichki mazmun tashqi o'lchamga ta'sir qilmasligini kafolatlash."],
    ],
    life: [
      ['🪑', 'Divan va stullar', "Bir xil mebel keng zalda katta, tor xonada ixcham ko'rinadi: mebel xonaga (konteynerga) moslashadi, binoga emas."],
      ['🧩', 'Qayta ishlatiladigan komponent', "Karta sidebar da vertikal, asosiy qismda gorizontal chiqadi, bitta kod bilan."],
    ],
    practice: [
      { title: 'Moslashuvchan karta', text: "Bitta karta komponentini ham tor sidebar, ham keng main ichida joylang: container query bilan har joyda mos ko'rinishga keltiring." },
      { title: 'cqw bilan shrift', text: "Sarlavha shriftini cqw bilan konteyner kengligiga bog'lang va clamp bilan chegaralang." },
    ],
    items: [
      ch("@container (min-width: 400px) qoidasi ishlamayapti. Birinchi tekshirish?", "Ajdodda container-type berilganmi", ["Elementga width berilganmi", "Brauzer eski emasmi (har doim)", "z-index kerak"], "Konteyner e'lon qilinmasa, so'rov hech kimga qarab ishlamaydi.", '.card-wrap { /* container-type yo\'q */ }\n@container (min-width: 400px) { .card { display: flex; } }'),
      ch("Element o'zining container-type ini so'ray oladimi?", "Yo'q: faqat ajdod konteynerni so'raydi", ["Ha", "Faqat inline-size bilan", "Faqat bola uchun"], "Stil qoidasi kimni so'rasa, shuning ajdodi bo'lishi kerak."),
      ch("container-type: inline-size nima beradi?", "Inline (gorizontal) o'lchamni so'rash imkonini, ichki mazmun shu o'lchamni o'zgartirmaydi", ["Balandlik so'rovi", "Animatsiya", "Qattiq o'lcham"], "Layout containment inline o'qda qo'llanadi."),
      ch("Media query va container query asosiy farqi?", "Birinchisi oyna o'lchamiga, ikkinchisi ajdod konteyner o'lchamiga bog'liq", ["Farq yo'q", "Container faqat balandlik uchun", "Media query faqat print"], "Komponent o'z joyiga moslashadi."),
      fill("Konteyner kengligining 1% — qaysi birlik? (4 harf)", 'cqw', "cqw — container query width.", ['cqw']),
      ch("Bir karta ham 300px sidebar da, ham 800px main da. Container query bilan nima beradi?", "Har joyda mos maket: sidebar da vertikal, main da gorizontal", ["Ikkalasida bir xil", "Faqat main da ishlaydi", "Faqat sidebar da"], "Bu media query yecha olmaydigan muammo."),
      ch("container-type: size ning kamchiligi?", "Konteynerning ikkala o'lchami ham mazmundan mustaqil: balandlik aniq berilishi kerak", ["Sekin ishlaydi", "Faqat tablet da", "Matn uchun ishlamaydi"], "Aks holda konteyner balandligi 0 ga kollaps qiladi."),
      ch("container-name nima uchun?", "Bir nechta konteyner orasida aynan birini so'rash uchun", ["Animatsiya nomi uchun", "Stil nomini qisqartirish", "class o'rniga"], "@container box (…) deb ma'lum ajdodni tanlaysiz."),
      ch("Ikkita ichma-ich konteyner bor, nomsiz @container so'rovi qaysi birini so'raydi?", "Eng yaqin ajdodni", ["Eng uzoq ajdodni", "Ikkalasini", "Hech birini"], "Nomsiz so'rov eng yaqin container-type li ajdodga qaraydi."),
      ch("font-size: 5cqw, konteyner 600px. Natija?", "30px", ["5px", "60px", "300px"], "5% × 600 = 30."),
    ],
  });

  /* 19 */
  lesson({
    title: 'Custom properties',
    intro: "var(), fallback, scope, @property va tema (dark mode) yaratish.",
    theory: {
      analogy: { icon: '🎛️', title: 'Pult tugmalari', text: "Bitta tugma (o'zgaruvchi) bosilsa, butun uyning chiroqlari (rang, masofa) birdan o'zgaradi." },
      sections: [
        { code: { lang: 'css', text: ':root {\n  --brand: #2563eb;\n  --gap: 16px;\n}\n.btn { background: var(--brand); padding: var(--gap, 12px); }  /* fallback: 12px */\n.btn.alt { --brand: #dc2626; }  /* faqat shu element va avlodlarida o\'zgaradi */\n\n@media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; } }\n\n@property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }' } },
        { bullets: ["Custom property MEROS bo'ladi (standart): ota ga berilgan avlodga o'tadi.", "var(--x, qiymat): --x yo'q yoki yaroqsiz bo'lsa fallback.", "Qiymat hisoblash vaqtida o'rniga qo'yiladi: yaroqsiz bo'lsa, xususiyat 'guaranteed-invalid' ga tushib, meros yoki initial qiymatni oladi.", "calc(var(--n) * 8px) — raqam saqlab, hisoblash.", "@property tur beradi: animatsiya (interpolatsiya) va tur tekshiruvini yoqadi.", "JS orqali el.style.setProperty('--x', v) bilan o'zgartiriladi."] },
        { callout: { kind: 'warn', text: "var(--gap) da --gap: 16 (birliksiz) bo'lsa, margin: var(--gap) yaroqsiz bo'ladi. calc(var(--gap) * 1px) kerak." } },
      ],
      recap: ["Custom property meros bo'ladi.", "var(--x, fallback).", "@property animatsiyani va turni ta'minlaydi.", "Birliksiz raqamni calc bilan birlikka aylantiring."],
    },
    defs: [
      ['Custom property', "--nom bilan e'lon qilingan, o'zi qiymat saqlovchi CSS xususiyati."],
      ['var()', "custom property qiymatini ishlatish funksiyasi."],
      ['Fallback', "o'zgaruvchi yo'q bo'lsa ishlatiladigan zaxira qiymat."],
      ['@property', "custom property ga tur, boshlang'ich qiymat va meros berish."],
    ],
    life: [
      ['🌗', 'Yorug\'lik pulti', "Bir tugma (--bg) butun uyni qorong'ilashtiradi. Dark mode shunday ishlaydi."],
      ['🧪', 'Retsept', "Bir miqdor (--gap) belgilanadi va hamma joyda ishlatiladi; o'zgartirsangiz, butun taom mos o'zgaradi."],
    ],
    practice: [
      { title: 'Tema o\'zgartirgich', text: "light/dark tema yasang: :root da ranglar, [data-theme=dark] da qayta e'lon va tugma bilan almashtirish." },
      { title: '@property animatsiyasi', text: "--angle ni @property bilan e'lon qilib, conic-gradient burchagini animatsiya qiling." },
    ],
    items: [
      ch("Tugma qaysi rangda?", "Qizil", ["Ko'k", "Qora", "Rang yo'q"], "Element ichida --c qayta e'lon qilingan: lokal qiymat yutadi.", ':root { --c: blue; }\n.btn { color: var(--c); --c: red; }'),
      ch("p ning padding i necha?", "12px", ["0", "16px", "Yaroqsiz"], "--gap e'lon qilinmagan: fallback 12px.", 'p { padding: var(--gap, 12px); }'),
      ch("Quyidagi margin nima bo'ladi?", "Yaroqsiz: margin standart (0) bo'ladi", ["16px", "16 ta piksel", "Xato bilan sahifa buziladi"], "--s: 16 birliksiz: margin: 16 yaroqsiz.", ':root { --s: 16; }\n.box { margin: var(--s); }'),
      ch("Yuqoridagini to'g'rilash?", "margin: calc(var(--s) * 1px)", ["margin: var(--s)px", "margin: var(--s) + px", "margin: '16px'"], "var(--s)px yozib bo'lmaydi: calc bilan ko'paytiriladi."),
      ch("Custom property meros bo'ladimi?", "Ha, standart bo'yicha", ["Yo'q", "Faqat :root da", "Faqat @property bilan"], "Ota ga berilgan avlodga o'tadi."),
      ch("@property ning asosiy foydasi nima?", "Turni bilish tufayli o'zgaruvchini animatsiya qilish mumkin", ["Fayl hajmini kamaytirish", "JS siz hisoblash", "Meros ni o'chirish"], "Oddiy custom property interpolatsiya qilinmaydi (matn deb qaraladi)."),
      ch("Element ichida --x e'lon qilingan. Tashqarida ishlatsak?", "Mavjud emas: faqat shu element va avlodlarida", ["Hamma joyda", "Faqat siblings da", "Faqat :root da"], "Scope — e'lon qilingan element va avlodlari."),
      ch("Dark mode uchun eng toza yo'l?", "Ranglarni o'zgaruvchiga solib, media query/atribut ichida qayta e'lon qilish", ["Har bir qoidaga dark versiya yozish", "Rasmlarni almashtirish", "JS bilan har elementni bo'yash"], "Bitta joyda qayta e'lon qilinadi."),
      ch("JS orqali o'zgaruvchini qanday o'zgartirasiz?", "el.style.setProperty('--x', value)", ["el.style.--x = value", "el.setVar('x', value)", "el.css('--x', value)"], "Custom property uchun setProperty ishlatiladi."),
      ch("var(--a, var(--b, red)) --a va --b yo'q bo'lsa?", "red", ["Xato", "Yaroqsiz", "inherit"], "Fallback ichida yana var ishlatish mumkin."),
    ],
  });

  /* 20 */
  lesson({
    title: 'Zamonaviy selektorlar va nesting',
    intro: ":has(), :is(), :where(), :not(), :focus-within va CSS nesting.",
    theory: {
      analogy: { icon: '🔍', title: 'Aqlli qidiruv', text: "Eski selektor faqat pastga qaraydi (ota → bola). :has() esa 'ichida mana bunday bola bor ota ni top' deydi: yuqoriga qarab qidiradi." },
      sections: [
        { code: { lang: 'css', text: '.card:has(img)          { padding: 0; }        /* ichida rasm bor card */\nlabel:has(input:checked) { font-weight: 700; }\nform:focus-within        { outline: 2px solid; } /* ichida fokus bor */\n:is(h1, h2, h3) a        { color: inherit; }\n:where(.a, .b) p         { margin: 0; }          /* specificity 0 */\nli:not(.done)            { }\n\n.card {\n  padding: 16px;\n  & .title { font-weight: 700; }   /* .card .title */\n  &:hover { background: #eee; }    /* .card:hover */\n  @media (min-width: 600px) { padding: 24px; }\n}' } },
        { bullets: [":has() — 'ota selektor'; ichki shartga qarab ota ni bo'yaydi.", ":is() eng kuchli argument specificity sini oladi, :where() har doim 0, :not() ham ichidagi eng kuchli argumentniki.", ":focus-within — ichidagi biror element fokusda bo'lsa.", "Nesting da & hozirgi selektorni bildiradi; & .a va .a & farq qiladi.", "Nesting specificity ni :is() kabi hisoblaydi."] },
      ],
      recap: [":has() ota ni tanlaydi.", ":where() — 0 specificity.", ":focus-within — bola fokusida.", "& — joriy selektor."],
    },
    defs: [
      [':has()', "ichida berilgan shartga mos element bo'lgan elementni tanlaydi."],
      [':is() / :where()', "selektor ro'yxatini qisqartiradi; where specificity ni 0 qiladi."],
      [':focus-within', "o'zi yoki avlodlaridan biri fokusda bo'lgan element."],
      ['CSS nesting', "qoidani qoida ichiga yozish, & bilan ota selektorga murojaat."],
    ],
    life: [
      ['📦', 'Rasmli quti', "'Ichida rasm bor qutini top' — oldin CSS da buni qilib bo'lmas edi."],
      ['🛎️', 'Mehmonxona', "Xona (form) ning ichida mehmon (input) turganini bilsangiz, butun xonaning chirog'ini yoqasiz: :focus-within."],
    ],
    practice: [
      { title: ':has() sinovi', text: "Checkbox belgilanganda butun kartani :has(input:checked) bilan ajrating." },
      { title: 'Nesting ga o\'tkazish', text: "Eski tekis CSS dagi 10 ta qoidani nesting va :is() bilan qisqartiring." },
    ],
    items: [
      ch("Qaysi elementlar bo'yaladi?", "Faqat rasmli card", ["Barcha card lar", "Barcha img lar", "Hech biri"], ":has(img) — ichida img bor card.", '.card:has(img) { border: 1px solid red; }\n\n<div class="card"><img></div>\n<div class="card">Matn</div>'),
      ch(":where(.a, .b) p ning specificity si?", "0-0-1 (faqat p)", ["0-1-1", "0-2-1", "0-0-0"], ":where() 0 beradi, p esa 0-0-1."),
      ch(":is(.a, #b) p ning specificity si?", "1-0-1", ["0-1-1", "0-0-1", "1-1-1"], ":is() eng kuchli argumentni (#b = 1-0-0) oladi."),
      ch(".card { &:hover { } } natijada qaysi selektor?", ".card:hover", [".card :hover", ":hover .card", ".card > :hover"], "& probelsiz pseudo-class bilan birlashadi: .card:hover. Probel qo'yilsa (& :hover) avlod hover i bo'lardi."),
      ch("form:focus-within qachon ishlaydi?", "Form ichidagi istalgan element fokusda bo'lganda", ["Faqat form fokusda", "Faqat input checked", "Hech qachon"], "Avlodlardan biri fokusda bo'lsa, ota mos."),
      ch(".card { & .title { } } natijada qaysi selektor?", ".card .title", [".card.title", ".title .card", ".card > .title"], "& probel bilan ishlatilsa avlod selektori hosil bo'ladi."),
      ch(".card { &.active { } } natijada?", ".card.active", [".card .active", ".active .card", ".card > .active"], "& qo'shilsa probelsiz birlashadi."),
      ch("li:not(.done) nimani tanlaydi?", "done class siz barcha li", ["Faqat .done", "Faqat birinchi li", "Hamma li"], ":not() argumentga mos bo'lmaganlarni tanlaydi."),
      ch(":has() ning eng muhim yangiligi?", "Ota yoki oldingi aka-uka ni bola holatiga qarab tanlash", ["Tezlashtirish", "Class o'rniga", "Animatsiya"], "Ilgari faqat pastga va keyingi aka-ukaga qaralgan."),
      ch(":is(h1, h2) vs :where(h1, h2) amalda farqi?", "Specificity: :is eng kuchli argument, :where esa 0", ["Farqi yo'q", "Tezlik", "Faqat :is ishlaydi"], "Reset va kutubxona stillari uchun :where qulay: oson override qilinadi."),
    ],
  });

  /* 21 */
  lesson({
    title: 'Transform va transition',
    intro: "translate, scale, rotate, transform-origin, transition va unumdorlik.",
    theory: {
      analogy: { icon: '🪄', title: 'Qo\'g\'irchoq teatri', text: "Qo'g'irchoqni suradi, aylantiradi, kattalashtiradi, lekin sahnadagi boshqa qo'g'irchoqlar joyi o'zgarmaydi: transform layout ga ta'sir qilmaydi." },
      sections: [
        { code: { lang: 'css', text: '.card {\n  transition: transform .2s ease, box-shadow .2s;\n}\n.card:hover {\n  transform: translateY(-4px) scale(1.02);\n  transform-origin: center;\n}\n.rot { rotate: 45deg; scale: 1.2; translate: 10px 0; } /* alohida xususiyatlar */' } },
        { bullets: ["transform layout ni o'zgartirmaydi: element asl joyini saqlaydi.", "Transform tartib muhim: translate(100px) rotate(90deg) ≠ rotate(90deg) translate(100px) (o'qlar aylanadi).", "transition faqat O'ZGARISH paytida ishlaydi (hover, class) va animatsiyalanadigan xususiyatlar uchun (display: none dan block ga — yo'q).", "Silliq: transform va opacity (kompozitor, GPU) — width/top/left layout ni qayta hisoblatadi.", "transition: all — kutilmagan xususiyatlar ham animatsiya bo'ladi, aniq nom yozing.", "Transform ota ga stacking context va fixed uchun containing block yaratadi."] },
        { table: { head: ['Xususiyat', 'Misol'], rows: [['transition-property', 'transform, opacity'], ['transition-duration', '200ms'], ['transition-timing-function', 'ease, ease-in-out, cubic-bezier(...)'], ['transition-delay', '100ms']] } },
      ],
      recap: ["transform layout ni buzmaydi.", "Tartib muhim.", "Silliq animatsiya: transform + opacity.", "all dan qoching."],
    },
    defs: [
      ['Transform', "elementni layout ga ta'sir qilmay siljitish, aylantirish, o'lchamini o'zgartirish."],
      ['Transition', "xususiyat qiymati o'zgarganda silliq o'tish."],
      ['transform-origin', "transform amalga oshiriladigan tayanch nuqtasi."],
      ['Kompozitor', "brauzerning layout va paint dan keyin qatlamlarni GPU da birlashtiruvchi bosqichi."],
    ],
    life: [
      ['🚪', 'Eshik', "Eshik ochilganda hovli o'lchami o'zgarmaydi: bu transform. Devor suriladigan bo'lsa, hamma narsa qayta tartiblanadi: bu left/width."],
      ['🛗', 'Lift', "Lift bir qavatdan boshqasiga silliq (transition) o'tadi, sakramaydi."],
    ],
    practice: [
      { title: 'Hover kartasi', text: "transform: translateY(-4px) va soyali karta; transition faqat transform va box-shadow uchun." },
      { title: 'Tartib farqi', text: "translate(100px) rotate(45deg) va rotate(45deg) translate(100px) ni solishtiring va farqini tushuntiring." },
    ],
    items: [
      ch(".b element asl joyiga nisbatan qayerga siljiydi?", "Pastga 100px: avval o'qlar 90° aylanadi, keyin translate shu aylangan X o'qi bo'ylab", ["O'ngga 100px", "Joyida qoladi", "Yuqoriga 100px"], "Transform chapdan o'ngga koordinata tizimini o'zgartiradi: rotate(90deg) dan keyin X o'qi pastga qaraydi. translate(100px) rotate(90deg) esa o'ngga siljitardi.", '.b { transform: rotate(90deg) translate(100px); }'),
      ch("transform: translateX(100px) boshqa elementlar joyiga ta'sir qiladimi?", "Yo'q: element asl joyini egallab turadi", ["Ha, qo'shnilar siljiydi", "Faqat flex da", "Faqat absolute da"], "Transform layout dan keyin, vizual darajada qo'llanadi."),
      ch("Quyidagilardan qaysi birini animatsiya qilish eng silliq (GPU)?", "transform va opacity", ["width", "top va left", "margin"], "Qolganlari layout ni qayta hisoblaydi."),
      ch("transition: all .3s nima uchun yaxshi emas?", "Kutilmagan xususiyatlar ham animatsiya bo'ladi va keraksiz hisob ketadi", ["all ishlamaydi", "Faqat opacity ni oladi", "Brauzer xato beradi"], "Aniq xususiyat nomlarini yozing."),
      ch("display: none dan display: block ga o'tish transition qilinadimi?", "Yo'q (diskret xususiyat): opacity/visibility yoki @starting-style kerak", ["Ha", "Faqat ease bilan", "Faqat delay bilan"], "display oddiy interpolatsiya qilinmaydi."),
      ch("scale(2) elementning layout kengligini o'zgartiradimi?", "Yo'q, faqat ko'rinishini", ["Ha, 2 barobar", "Faqat width", "Faqat height"], "Qo'shnilar joyi o'zgarmaydi."),
      ch("Element chap yuqori burchak atrofida aylanishi uchun?", "transform-origin: 0 0", ["rotate-origin: top", "origin: left", "align: top-left"], "Standart origin: 50% 50% (markaz)."),
      ch("transform berilgan ota ichidagi position: fixed bola qanday?", "Ota ga nisbatan joylashadi", ["Doim viewport ga", "Yashirinadi", "Xato"], "transform containing block yaratadi."),
      ch("transition faqat qachon ishlaydi?", "Xususiyat qiymati o'zgargandagina (hover, class, JS)", ["Sahifa yuklanganda avtomatik", "Faqat @keyframes bilan", "Faqat JS bilan"], "Boshlang'ich holatsiz, o'zgarishsiz transition yo'q."),
      ch("Alohida rotate: 45deg; scale: 1.2 xususiyatlari afzalligi?", "transform ni qayta yozmasdan mustaqil boshqarish mumkin", ["Tezroq", "Ko'proq brauzer", "Layout ga ta'sir qiladi"], "Har biri o'z transition i bilan alohida animatsiya qilinadi."),
    ],
  });

  /* 22 */
  lesson({
    title: 'Animatsiya',
    intro: "@keyframes, animation xususiyatlari, fill-mode, steps() va reduced motion.",
    theory: {
      analogy: { icon: '🎬', title: 'Multfilm kadrlari', text: "Multfilmda asosiy kadrlar chiziladi, oralig'ini kompyuter to'ldiradi. @keyframes — asosiy kadrlar." },
      sections: [
        { code: { lang: 'css', text: '@keyframes pop {\n  0%   { transform: scale(.8); opacity: 0; }\n  60%  { transform: scale(1.05); }\n  100% { transform: scale(1);  opacity: 1; }\n}\n.toast {\n  animation: pop 400ms ease-out 100ms 1 normal both;\n  /* name duration timing delay iteration direction fill-mode */\n}' } },
        { table: { head: ['Xususiyat', 'Ma\'no'], rows: [['animation-iteration-count', "Necha marta (infinite)"], ['animation-direction', 'normal, reverse, alternate'], ['animation-fill-mode', "forwards: oxirgi kadr qoladi; backwards: delay paytida birinchi kadr; both"], ['animation-play-state', 'running / paused'], ['steps(n)', "Silliq emas, n ta qadamda (sprite, yozuv effekti)"]] } },
        { bullets: ["Transition: A dan B ga bitta o'tish. Animation: ko'p kadr, avtomatik boshlanadi, takrorlanadi.", "animation-fill-mode yo'q bo'lsa, tugagach element boshlang'ich holatiga sakraydi.", "@media (prefers-reduced-motion: reduce) da animatsiyani o'chiring/qisqartiring.", "Cheksiz animatsiya CPU/batareyani yeydi: faqat zarur joyda.", "animation-delay manfiy bo'lsa, animatsiya o'rtasidan boshlanadi."] },
      ],
      recap: ["fill-mode: forwards oxirgi kadrni saqlaydi.", "Transition — 2 holat, animation — ko'p kadr.", "steps() sakrovchi animatsiya.", "reduced-motion hurmat qilinsin."],
    },
    defs: [
      ['@keyframes', "animatsiyaning asosiy kadrlarini e'lon qilish."],
      ['animation-fill-mode', "animatsiya boshlanishidan oldin va tugagandan keyin stil qanday bo'lishini belgilaydi."],
      ['steps()', "oraliq kadrlarni silliq emas, qadamlar bilan beruvchi timing funksiya."],
      ['alternate', "animatsiya navbat bilan oldinga va orqaga yurishi."],
    ],
    life: [
      ['🎞️', 'Kino lentasi', "Asosiy kadrlar (keyframes) bo'lsa, oralig'ini proyektor (brauzer) to'ldiradi."],
      ['🚦', 'Svetofor', "Cheksiz takrorlanuvchi animatsiya: qizil-sariq-yashil, infinite bilan."],
    ],
    practice: [
      { title: 'Yuklanish spinneri', text: "Faqat transform: rotate va infinite linear bilan spinner yasang." },
      { title: 'Kirish animatsiyasi', text: "Sahifadagi kartalarga ketma-ket (animation-delay) kirish animatsiyasini bering va reduced-motion ni qo'llab-quvvatlang." },
    ],
    items: [
      ch("Animatsiya tugagach element nega boshiga sakraydi?", "animation-fill-mode: forwards berilmagan", ["iteration-count 1 bo'lgani uchun", "keyframes xato", "transition yo'q"], "forwards oxirgi kadrni saqlaydi.", '@keyframes slide { to { transform: translateX(200px); } }\n.a { animation: slide 1s; }'),
      ch("animation: spin 2s linear 3 qanday ishlaydi?", "2 soniyalik animatsiya, chiziqli, 3 marta takrorlanadi", ["3 soniya 2 marta", "Cheksiz", "Birinchi 2 marta"], "Birinchi vaqt duration, raqam — iteration-count."),
      ch("Delay paytida element birinchi kadr holatida turishi uchun?", "animation-fill-mode: backwards (yoki both)", ["forwards", "none", "paused"], "backwards delay paytida 0% kadrni qo'llaydi."),
      ch("animation-delay: -1s nimani bildiradi?", "Animatsiya darhol, lekin 1 soniya o'tgan holatdan boshlanadi", ["1 soniya kutadi", "Xato", "Orqaga yuradi"], "Manfiy delay animatsiyani oldinga suradi."),
      ch("steps(4) timing function nima beradi?", "4 ta sakrashli qadam: silliq emas", ["4 soniyalik animatsiya", "4 marta takrorlash", "4 ta kadr rangi"], "Sprite animatsiya va 'yozuv' effekti uchun."),
      ch("Transition va animation farqi?", "Transition ikki holat orasida, animation ko'p kadr va o'zi boshlanadi", ["Farqi yo'q", "Animation faqat hover da", "Transition cheksiz bo'ladi"], "Animation JS yoki hodisasiz ham ishga tushadi."),
      ch("alternate nima qiladi?", "Navbat bilan oldinga-orqaga yuradi", ["Ikki marta takrorlaydi", "Teskari tartibda boshlaydi", "Tezlashtiradi"], "Cheksiz pulsatsiya uchun qulay."),
      ch("Nega spinner uchun transform: rotate yaxshi?", "GPU da ishlaydi, layout ni qayta hisoblamaydi", ["Eng qisqa kod", "Brauzer majburlaydi", "Faqat shu ishlaydi"], "Layout/paint chaqirmaydi."),
      ch("prefers-reduced-motion: reduce da nima qilinadi?", "Animatsiya o'chiriladi yoki juda qisqartiriladi", ["Hech narsa", "Tezlashtiriladi", "Sahifa qayta yuklanadi"], "Vestibular buzilishi bor foydalanuvchilar uchun muhim."),
      ch("0% kadr berilmagan bo'lsa nima bo'ladi?", "Element joriy (computed) qiymatidan boshlanadi", ["Animatsiya ishlamaydi", "Xato", "Qora ekran"], "Yetishmagan 0%/100% kadr element hozirgi stilidan olinadi."),
    ],
  });

  /* 23 */
  lesson({
    title: 'CSS arxitekturasi',
    intro: "BEM, utility-first, CSS modules, specificity ni boshqarish va masshtablanuvchi tuzilma.",
    theory: {
      analogy: { icon: '🏗️', title: 'Shahar rejasi', text: "Reja bo'lmagan shahar tartibsiz o'sadi. CSS ham: nom berish, qatlam va tartib qoidalari bo'lmasa, 'kimdir buzib yubormasin' qo'rquvi paydo bo'ladi." },
      sections: [
        { table: { head: ['Yondashuv', 'Mohiyat', 'Kamchilik'], rows: [['BEM', "blok__element--modifikator: .card__title--big", "Uzun nomlar"], ['Utility-first', "Kichik bir vazifali class lar: .p-4 .flex", "HTML 'shovqinli'"], ['CSS Modules', "Class nomlari avtomatik noyob bo'ladi", "Qurish vositasi kerak"], ['@layer', "Ustunlikni specificity ga emas, tartibga bog'laydi", "Layer tartibini bilish kerak"]] } },
        { code: { lang: 'css', text: '/* BEM */\n.card { }\n.card__title { }\n.card__title--big { }\n\n@layer reset, base, components, utilities;\n\n/* Qoida: selektorni sayoz saqlang */\n.card__title { }            /* yaxshi: 0-1-0 */\n#page .card .title { }      /* yomon: kuchli va qattiq */' } },
        { bullets: ["Selektor sayoz (1-2 daraja), ID va !important dan qochish.", "Komponent o'z stilini o'zi boshqarsin: tashqi joylashuv (margin) ota dan kelsin.", "Chuqur ichma-ich (nesting 3+) specificity va bog'liqlikni oshiradi.", "Dizayn tokenlari (rang, masofa) custom property larda.", "Utility lar eng oxirgi layer da: komponent stilini bosib ketishi mumkin."] },
        { callout: { kind: 'tip', text: "Yaxshi CSS arxitekturasining mezoni: bitta komponentni o'zgartirsangiz, boshqa komponent buzilmaydi." } },
      ],
      recap: ["BEM: blok__element--modifikator.", "Selektorni sayoz saqlang.", "Ustunlik uchun @layer, !important emas.", "Tokenlar custom property da."],
    },
    defs: [
      ['BEM', "Block__Element--Modifier nomlash qoidasi."],
      ['Utility-first', "kichik, bitta vazifali class lardan elementni yig'ish yondashuvi."],
      ['Design token', "rang, masofa, shrift kabi qayta ishlatiladigan dizayn qiymatlari."],
      ['CSS Modules', "class nomlarini avtomatik noyob qilib beruvchi usul."],
    ],
    life: [
      ['🗂️', 'Hujjat shkafi', "Papka nomi qoidasi bo'lmasa, hujjat topilmaydi: BEM — papka nomlash qoidasi."],
      ['🧱', 'Lego', "Utility-first — mayda, standart g'ishtchalardan har narsa yasash."],
    ],
    practice: [
      { title: 'BEM ga o\'tkazish', text: "Tartibsiz CSS dagi 5 ta komponentni BEM nomlariga o'tkazing va nesting ni 2 darajagacha qisqartiring." },
      { title: 'Layer tuzilmasi', text: "@layer reset, base, components, utilities ni qo'yib, utilities orqali komponent stilini !important siz bosib ketishni tekshiring." },
    ],
    items: [
      ch("Quyidagilardan qaysi biri to'g'ri BEM nomi?", ".card__title--big", [".card-title-big", ".card.title.big", ".card > .title"], "blok__element--modifikator."),
      ch("BEM da .menu__item--active nimani bildiradi?", "menu blokining item elementi, active modifikatori bilan", ["menu ichidagi item ichidagi active", "Item ning menu ota si", "Active menu"], "Ikkita pastki chiziq — element, ikkita tire — modifikator."),
      ch("Nega #page .card .title yomon amaliyot?", "Specificity yuqori va qattiq: keyin uni bosib ketish uchun yana kuchli selektor/!important kerak bo'ladi", ["Sekin ishlaydi", "ID ishlamaydi", "Probel yaroqsiz"], "Selektor sayoz bo'lsa, boshqarish oson."),
      ch("Komponentning tashqi margin ini kim belgilashi kerak?", "Joylashtiruvchi (ota/layout): komponent o'z tashqi margin ini bilmaydi", ["Komponentning o'zi", "Brauzer", "Hech kim"], "Qayta ishlatish uchun komponent ota kontekstga bog'liq bo'lmasligi kerak."),
      ch("Utility class lar qaysi layer da bo'lishi to'g'ri?", "Eng oxirgi: komponentlardan keyin, ularni override qila olishi uchun", ["Eng birinchi", "Faqat reset da", "Layer siz bo'lmaydi"], "Keyingi layer yutadi."),
      ch("!important o'rniga nima qilish yaxshiroq?", "@layer yoki selektor tuzilmasini to'g'rilash", ["Yana !important", "ID qo'shish", "Inline style"], "Ustunlikni aniq arxitektura bilan boshqaring."),
      ch("Utility-first ning kamchiligi?", "HTML class lar bilan to'lib ketishi", ["Sekin ishlashi", "Brauzer qo'llamasligi", "Qayta ishlatib bo'lmasligi"], "Afzalligi esa CSS hajmi barqaror qolishi."),
      ch("Design token deb nimaga aytiladi?", "Qayta ishlatiladigan nomlangan dizayn qiymati (rang, masofa)", ["JS tokeni", "Brauzer tokeni", "Class nomi"], "Ko'pincha custom property sifatida saqlanadi."),
      ch("3+ daraja nesting (a { b { c { d {...} } } }) nega xavfli?", "Specificity oshadi va markup tuzilishiga qattiq bog'lanib qoladi", ["Brauzer qo'llamaydi", "Sekin yuklanadi", "Xato beradi"], "Markup o'zgarsa, stil buziladi."),
      ch("Yaxshi CSS arxitekturasi mezoni?", "Bitta komponent o'zgarsa boshqasi buzilmaydi", ["Eng qisqa fayl", "Eng ko'p ID", "Hamma narsa !important"], "Izolyatsiya va bashorat qilish mumkinligi."),
    ],
  });
};
