// CSS, MIDDLE level, lessons 9-12: transform and transition, keyframes, architecture, critical CSS.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 9 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Transform va transition",
    intro: "translate, scale, rotate, tartib ta'siri, transition vaqtlari, timing funksiyalari va tuzoqlar.",
    what: "transform elementni layout ga tegmasdan vizual o'zgartiradi: qo'shnilar joyidan qimirlamaydi. transition (o'tish) esa ikki holat orasini vaqt davomida silliq bog'laydi. Ikkalasi birga arzon va sezgir interfeys beradi.",
    analogy: { icon: '🪞', title: "Ko'zgudagi aks", text: "Aksni siljitsangiz, xonadagi mebel joyida qoladi. transform ham elementning \"aksini\" siljitadi, joyi o'zgarmaydi." },
    defs: [
      ['translate', "Siljitish; foiz elementning o'z o'lchamidan."],
      ['transform-origin', "O'zgarish markazi."],
      ['transition-duration', "O'tish davomiyligi."],
      ['Timing function (tezlik egri chizig\'i)', "ease-out, ease-in, linear."],
    ],
    uses: [
      ["Hover va bosish javobida", "100–200 ms li o'tish."],
      ["Panel ochilishida", "left o'rniga translateX."],
      ["Markazlashda", "translate(-50%, -50%)."],
    ],
    sections: [
      { heading: 'Yozuv', code: { lang: 'css', text: '.button {\n  transition: background-color 150ms ease, transform 150ms ease-out 50ms;\n  /*          xossa             davomiylik  egri chiziq  kechikish */\n}\n.button:hover { transform: translateY(-2px) scale(1.02); }' } },
      { heading: 'Tartib muhim', text: "transform funksiyalari koordinata tizimini ketma-ket o'zgartiradi: rotate keyin translate va translate keyin rotate turli natija beradi." },
      { heading: 'Transition ishlamaydigan holatlar', bullets: ["display: none dan chiqqan element (boshlang'ich holat yo'q).", "height: auto ga o'tish.", "transition faqat :hover ichida yozilsa, qaytishda silliq bo'lmaydi."] },
      { heading: 'all dan qoching', callout: { kind: 'warn', text: "transition: all rejada bo'lmagan xossalarni ham animatsiya qiladi." } },
    ],
    life: [
      ['🖱️', "Kartochka ko'tariladi", "translateY qo'shnilarni siljitmaydi."],
      ['🚪', "Kirish tez, qaytish keskin", "transition asosiy holatga yozilmagan."],
    ],
    tip: "Kiruvchi element uchun ease-out, chiquvchi uchun ease-in tabiiy ko'rinadi.",
    mistakes: [
      ['transition ni faqat :hover ga yozish.', "Asosiy qoidaga yozish.", "Hover ketganda o'tish yo'qoladi."],
      ['display ni oddiy transition qilish.', "opacity va visibility.", "display silliq o'zgarmaydi."],
      ['Ikkinchi transform birinchisiga qo\'shiladi deb o\'ylash.', "Bitta qatorda yozish.", "Keyingi qiymat butunlay almashtiradi."],
    ],
    recap: [
      "transform layout ni o'zgartirmaydi.",
      "Funksiyalar tartibi natijaga ta'sir qiladi.",
      "transition asosiy holatda yoziladi.",
      "Aniq xossalarni sanang.",
    ],
    practice: [
      { title: 'Tugma javobi', text: "Hover va active holatli tugma yasang, 150 ms o'tish bilan." },
      { title: 'Yon panel', text: "Panelni translateX bilan ochib-yoping." },
    ],
    items: [
      ch("Element 200px keng. transform: translateX(50%) necha px suradi?", "100px", ["50px", "200px", "ota enining yarmi"], "Foiz elementning o'z o'lchamidan."),
      ch("scale(2) qilingan kartochkaning qo'shnilari nima qiladi?", "Joyida qoladi, ustiga chiqilishi mumkin", ["Ikki baravar joy ochib, pastga suriladi", "Kichrayib bo'sh joy ochib beradi", "Keyingi qatorga avtomatik o'tadi"], "transform layout ga ta'sir qilmaydi."),
      ch("Hover da element qancha suriladi va kattalashadimi?", "Faqat kattalashadi, surilmaydi", ["Suriladi va kattalashadi ham", "Faqat suriladi, kattalashmaydi", "Hech qanday o'zgarish bo'lmaydi"], "transform qiymati to'liq almashadi.", '.card       { transform: translateY(-4px); }\n.card:hover { transform: scale(1.1); }'),
      ch("Kursor ketganda rang nima bo'ladi?", "Darhol eski rangga qaytadi", ["300 ms da silliq qaytadi", "Yangi rangda qolib ketadi", "600 ms da silliq qaytadi"], "transition faqat hover holatida mavjud.", '.btn       { background: blue; }\n.btn:hover { background: red; transition: background 300ms; }'),
      ch("transition: opacity 200ms ease-in 100ms — 100ms nima?", "Boshlanishdan oldingi kechikish", ["O'tishning umumiy davomiyligi", "Tugagandan keyingi kutish vaqti", "Har bir kadr orasidagi vaqt"], "Ikkinchi vaqt qiymati — delay."),
      ch("Menyu display: none dan block ga o'tganda opacity transition ishlamaydi. Sabab?", "Boshlang'ich holat chizilmagan edi", ["opacity ni animatsiya qilib bo'lmaydi", "transition faqat hover da ishlaydi", "block elementga o'tish berilmaydi"], "@starting-style yoki visibility bilan yechiladi."),
      ch("Silliq ochiladigan panel uchun qaysi biri arzonroq?", "transform", ["left", "width", "margin-left"], "Layout qayta hisoblanmaydi."),
      ch("Element burchagi atrofida aylanishi uchun qaysi xossa o'zgartiriladi?", "transform-origin", ["transform-style", "perspective-origin", "object-position"], "Standart markaz — 50% 50%."),
      ch("Tezlik boshida sekin emas, oxirida sekinlashadigan egri chiziq?", "ease-out", ["ease-in", "linear", "step-start"], "Kiruvchi elementlarga mos."),
      fill("Aylantirish funksiyasi: ...(45deg)", "rotate", "rotate(45deg).", ["rotate()"]),
      fill("O'tish tugaganda JS da ishlaydigan hodisa:", "transitionend", "transitionend.", ["transitionEnd"]),
      order("transition qisqa yozuvidagi tartib:", ['property', 'duration', 'timing-function', 'delay'], "Xossa, davomiylik, egri chiziq, kechikish."),
    ],
  });

  /* 10 --------------------------------------------------------------------------------------- */
  lesson({
    title: "@keyframes animatsiya va unumdorlik",
    intro: "animation xossalari, fill-mode, iteration, direction, arzon xossalar va reduced motion.",
    what: "@keyframes bir nechta bosqichli, o'zi boshlanadigan va takrorlana oladigan animatsiya beradi. Silliqlik uchun asosan transform va opacity o'zgartiriladi: ular layout va paint ni qayta ishga tushirmasdan bajarilishi mumkin.",
    analogy: { icon: '🎞️', title: "Multfilm kadrlari", text: "Siz asosiy kadrlarni chizasiz (0%, 50%, 100%), oradagilarni brauzer o'zi to'ldiradi." },
    defs: [
      ['@keyframes', "Animatsiya bosqichlari."],
      ['animation-fill-mode', "Boshlanishdan oldin va tugagandan keyin qaysi holat saqlanishi."],
      ['animation-direction', "normal, reverse, alternate."],
      ['60 FPS', "Sekundiga 60 kadr: bir kadrga ~16 ms."],
    ],
    uses: [
      ["Yuklanish ko'rsatkichida", "Cheksiz aylanish yoki pulse."],
      ["Xabar paydo bo'lishida", "forwards bilan bir martalik animatsiya."],
      ["Foydalanuvchi harakatni xohlamasa", "reduced-motion da o'chirasiz."],
    ],
    sections: [
      { heading: 'Yozuv', code: { lang: 'css', text: '@keyframes pulse {\n  0%, 100% { opacity: 1; }\n  50%      { opacity: 0.4; }\n}\n.skeleton { animation: pulse 1.5s ease-in-out infinite; }' } },
      { heading: 'Xossalar', table: { head: ['Xossa', 'Vazifasi'], rows: [['iteration-count', 'takrorlar soni yoki infinite'], ['fill-mode: forwards', 'oxirgi holatda qoladi'], ['fill-mode: backwards', "kechikishda birinchi kadr qo'llanadi"], ['direction: alternate', 'oldinga va orqaga'], ['play-state', 'running yoki paused']] } },
      { heading: 'Narx', table: { head: ["O'zgarish", 'Qadamlar'], rows: [['width, top, margin', 'layout + paint + composite'], ['color, box-shadow', 'paint + composite'], ['transform, opacity', 'composite']] } },
      { heading: 'Reduced motion', code: { lang: 'css', text: '@media (prefers-reduced-motion: reduce) {\n  .hero { animation: none; }\n}' } },
    ],
    life: [
      ['↩️', "Animatsiya tugab, orqaga sakradi", "forwards yozilmagan."],
      ['🤢', "Bosh aylanadigan parallax", "reduced motion hisobga olinmagan."],
    ],
    tip: "Avval Performance panelida o'lchang; will-change ni hamma narsaga yozmang.",
    mistakes: [
      ['width ni cheksiz animatsiya qilish.', "transform: scaleX.", "Har kadrda layout."],
      ['will-change: transform ni barcha elementga.', "Faqat aniq muammoga.", "Har qatlam xotira oladi."],
      ['Muhim ma\'lumotni faqat animatsiya bilan berish.', "Matn yoki belgi ham qo'shish.", "Animatsiya o'chirilgan bo'lishi mumkin."],
    ],
    recap: [
      "keyframes ko'p bosqichli va takrorlanuvchi.",
      "forwards oxirgi holatni saqlaydi.",
      "transform va opacity eng arzon.",
      "Reduced motion ni hurmat qiling.",
    ],
    practice: [
      { title: 'Spinner', text: "Faqat transform bilan aylanuvchi yuklanish belgisi yasang." },
      { title: 'Toast', text: "Pastdan chiqib, joyida qoladigan xabar animatsiyasini yozing." },
    ],
    items: [
      ch("Animatsiya tugagach element qayerda turadi?", "Boshlang'ich joyiga qaytadi", ["200px siljigan holda qoladi", "Ekrandan butunlay yo'qoladi", "Yarim yo'lda, 100px da turadi"], "fill-mode standart none.", '@keyframes go { to { transform: translateX(200px); } }\n.box { animation: go 1s; }'),
      ch("Oxirgi holatda qolishi uchun nima qo'shiladi?", "forwards", ["backwards", "alternate", "infinite"], "animation-fill-mode: forwards."),
      ch("animation: move 2s ease 1s 3 — element harakati jami qachon tugaydi?", "7 soniyada", ["6 soniyada", "9 soniyada", "3 soniyada"], "1s kechikish bir marta + 3 × 2s."),
      ch("alternate va 2 marta takrorda element yakunda qayerda?", "Boshlang'ich holatda", ["Oxirgi kadr holatida", "O'rtadagi kadr holatida", "Ekrandan tashqarida"], "Birinchisi oldinga, ikkinchisi orqaga."),
      ch("Qaysi animatsiya har kadrda layout talab qiladi?", "width", ["opacity", "transform: scale", "transform: rotate"], "width atrofdagilarga ta'sir qiladi."),
      ch("60 FPS uchun bir kadrga taxminan qancha vaqt bor?", "16 ms", ["60 ms", "6 ms", "100 ms"], "1000 / 60."),
      ch("will-change ni har elementga yozishning zarari?", "Ortiqcha qatlamlar xotira oladi", ["Animatsiyalar butunlay o'chadi", "CSS fayli yuklanmay qoladi", "Selektor kuchi oshib ketadi"], "Faqat o'lchangan muammoda ishlating."),
      ch("Foydalanuvchi harakatni kamaytirishni yoqqan. Eng to'g'ri yondashuv?", "Harakatni o'chirish yoki soddalashtirish", ["Animatsiyani ikki baravar tezlashtirish", "Sozlamani e'tiborsiz qoldirib o'ynatish", "Butun sahifadagi kontentni yashirish"], "prefers-reduced-motion: reduce."),
      ch("JS 200 ms hisoblayapti. Qaysi animatsiya silliq davom etishi ehtimoli yuqori?", "transform animatsiyasi", ["left animatsiyasi", "height animatsiyasi", "JS bilan setInterval"], "Compositor oqimida bajarilishi mumkin."),
      fill("Cheksiz takrorlash qiymati:", "infinite", "animation-iteration-count: infinite.", ["Infinite"]),
      fill("Animatsiya bosqichlarini e'lon qiladigan at-rule:", "@keyframes", "@keyframes.", ["keyframes"]),
      fill("Animatsiyani to'xtatib turish: animation-play-state: ...", "paused", "paused.", ["paused;"]),
    ],
  });

  /* 11 --------------------------------------------------------------------------------------- */
  lesson({
    title: "CSS arxitekturasi: BEM, Modules, utility",
    intro: "Global nomlar muammosi, BEM nomlash, CSS Modules, Tailwind, CSS-in-JS va tanlov mezonlari.",
    what: "CSS global: bitta .title butun loyihaga ta'sir qiladi. Arxitektura uch muammoni yechadi: nomlar to'qnashmasin, specificity o'sib ketmasin va uslubni qo'rqmasdan o'chirib bo'lsin. Turli yondashuvlar buni turlicha beradi.",
    analogy: { icon: '🏢', title: "Katta binodagi eshiklar", text: "\"1-xona\" hamma qavatda bo'lsa chalkashadi. BEM — to'liq manzil yozish, CSS Modules — har qavatga avtomatik noyob raqam." },
    defs: [
      ['BEM (Block, Element, Modifier)', "card, card__title, card--featured."],
      ['CSS Modules', "Build paytida class nomlarini noyob qiladi."],
      ['Utility-first', "Kichik tayyor klasslarni birlashtirish (Tailwind)."],
      ['CSS-in-JS', "Uslubni JavaScript ichida yozish."],
    ],
    uses: [
      ["Oddiy ko'p sahifali saytda", "BEM — vosita shart emas."],
      ["React komponentlarida", "CSS Modules yoki Tailwind."],
      ["Dinamik qiymatda", "Custom property orqali uzatish."],
    ],
    sections: [
      { heading: 'BEM', code: { lang: 'css', text: '.card { }\n.card__title { }\n.card--featured { }' } },
      { heading: 'CSS Modules', code: { lang: 'jsx', text: "import styles from './Button.module.css';\n\n<button className={`${styles.button} ${primary ? styles.primary : ''}`}>OK</button>" } },
      { heading: 'Taqqoslash', table: { head: ['Yondashuv', 'Afzalligi', 'Kamchiligi'], rows: [['BEM', 'vositasiz', 'intizomga bog\'liq'], ['CSS Modules', 'lokal nom', 'dinamika uchun var kerak'], ['Tailwind', 'tez va izchil', 'uzun class ro\'yxati'], ['Runtime CSS-in-JS', 'dinamik uslub', 'ishlash vaqtidagi narx']] } },
      { heading: 'Tailwind tuzog\'i', callout: { kind: 'warn', text: "Class nomi kodda to'liq yozilgan bo'lishi kerak: `bg-${color}-500` ko'rinishida yig'ilgan nom build ga kirmaydi." } },
    ],
    life: [
      ['💥', "Bir sahifani tuzatdim, boshqasi buzildi", "Umumiy .title nomi."],
      ['🧹', "O'chirishga qo'rqiladigan 5000 qator", "Uslub komponentga bog'lanmagan."],
    ],
    tip: "\"Eng yaxshisi\" yo'q: jamoa, loyiha va mavjud kodga qarab tanlang va bittasiga izchil rioya qiling.",
    mistakes: [
      ['.card .header .title kabi chuqur selektorlar.', ".card__title.", "Kuch oshadi va HTML tuzilishiga bog'lanadi."],
      ['Tailwind class ini qismlardan yig\'ish.', "To'liq nomlar xaritasi.", "Skaner topa olmaydi."],
      ['Har dinamik qiymatga yangi class.', "style orqali custom property.", "Cheksiz variantlar kerak bo'lib qoladi."],
    ],
    recap: [
      "Muammo — global nom va o'suvchi specificity.",
      "BEM kelishuv, Modules avtomatika.",
      "Utility-first da komponent takrorni yechadi.",
      "Dinamik qiymat — custom property.",
    ],
    practice: [
      { title: 'BEM ga o\'tkazing', text: "Ichma-ich selektorli bitta kartochkani BEM nomlari bilan qayta yozing." },
      { title: 'Modules sinovi', text: "Ikki komponentda bir xil .title yozib, build dagi yakuniy nomlarni ko'ring." },
    ],
    items: [
      ch("BEM da \"card blokining sarlavha elementi\" qanday yoziladi?", ".card__title", [".card--title", ".card .title", ".card-title__"], "Element — ikki pastki chiziq."),
      ch("BEM da .card--featured nimani bildiradi?", "Blokning varianti (modifier)", ["Blok ichidagi bola element", "Butunlay boshqa mustaqil blok", "Faqat hover paytidagi holat"], "Ikki chiziqcha — modifier."),
      ch("CSS Modules da ikki faylda ham .title bor. Natija?", "Har biri noyob nom oladi", ["Keyingi fayl oldingisini bosadi", "Build xato berib to'xtab qoladi", "Ikkalasi bitta qoidaga birlashadi"], "Nom fayl bo'yicha lokal."),
      ch("Quyidagi Tailwind kodi nega uslub bermasligi mumkin?", "To'liq class nomi kodda yo'q", ["Tailwind da fon rangi mavjud emas", "className ga o'zgaruvchi yozib bo'lmaydi", "500 qiymati faqat matnga tegishli"], "Skaner qismlardan yig'ilgan nomni ko'rmaydi.", 'const color = "red";\n<div className={`bg-${color}-500`} />'),
      ch("Progress eni 0–100% oralig'ida ixtiyoriy. Eng toza yechim?", "style bilan custom property berish", ["Har foiz uchun alohida class yozish", "!important li klasslar yaratish", "Har o'zgarishda CSS faylni qayta yuklash"], "Qiymat o'zgaruvchi orqali, uslub CSS da qoladi."),
      ch("Utility-first ning asosiy kamchiligi?", "HTML da class ro'yxati uzayadi", ["Class nomlari doim to'qnashadi", "Media query yozib bo'lmaydi", "CSS fayli cheksiz o'saveradi"], "Takrorni komponentga ajratib kamaytiriladi."),
      ch("Runtime CSS-in-JS ning asosiy narxi?", "Brauzerda uslub yaratish vaqti", ["Nomlar to'qnashuvining ko'payishi", "Dinamik uslub bera olmaslik", "Komponentga bog'lab bo'lmaslik"], "JS bajarilib, uslub yaratiladi."),
      ch("`#page .sidebar ul li a` selektorining asosiy muammosi?", "Kuchli va tuzilishga bog'liq", ["Brauzer uni o'qiy olmaydi", "Faqat mobil ekranda ishlaydi", "Meros xossalarni o'chiradi"], "Bosib o'tish uchun yanada kuchli selektor kerak bo'ladi."),
      ch("Reset uslublari komponentlarga xalaqit bermasligi uchun nima yordam beradi?", ":where() yoki @layer", ["!important va ID lar", "inline style atributi", "Har qoidani ikki marta yozish"], "Past ustuvorlik beriladi."),
      fill("BEM qisqartmasidagi uchinchi so'z (inglizcha):", "Modifier", "Block, Element, Modifier.", ["modifier"]),
      fill("CSS Modules fayl nomi odatda: Button.....css", "module", "Button.module.css.", [".module", "module."]),
      fill("Dizayn qarorining nomlangan qiymati (masalan --color-action): design ...", "token", "Design token.", ["Token", "tokens"]),
    ],
  });

  /* 12 --------------------------------------------------------------------------------------- */
  lesson({
    title: "Critical CSS va yuklanish tezligi",
    intro: "CSS render-blocking, @import zanjiri, critical CSS, media atributi, Coverage va font-display.",
    what: "Brauzer CSS ni olmaguncha sahifani chizmaydi, shuning uchun uning hajmi va so'rovlar zanjiri birinchi ko'rinishga to'g'ridan-to'g'ri ta'sir qiladi. Critical CSS — birinchi ekran uchun kerakli kichik uslubni oldin yetkazish.",
    analogy: { icon: '🍽️', title: "Avval birinchi taom", text: "Hamma taom tayyor bo'lishini kutmasdan, birinchisini dasturxonga qo'yasiz — mehmon kutib qolmaydi." },
    defs: [
      ['Render-blocking (chizishni to\'suvchi)', "Yuklanmaguncha sahifa chizilmaydigan resurs."],
      ['Critical CSS', "Birinchi ekran uchun kerakli, <head> ga inline qilingan uslub."],
      ['FCP / LCP', "Birinchi va eng katta kontent chizilgan vaqt."],
      ['font-display', "Shrift yuklanayotganda matn qanday ko'rinishi."],
    ],
    uses: [
      ["Sahifa uzoq oq tursa", "CSS hajmi va zanjirini tekshirasiz."],
      ["Katta framework ulanganda", "Coverage bilan ishlatilmaganini topasiz."],
      ["Matn ko'rinmay tursa", "font-display: swap."],
    ],
    sections: [
      { heading: "@import o'rniga link", code: { lang: 'html', text: '<!-- ❌ a.css ichida @import "b.css"; — ketma-ket yuklanadi -->\n<!-- ✅ parallel -->\n<link rel="stylesheet" href="a.css">\n<link rel="stylesheet" href="b.css">' } },
      { heading: 'Media bo\'yicha ajratish', code: { lang: 'html', text: '<link rel="stylesheet" href="print.css" media="print">\n<link rel="stylesheet" href="wide.css" media="(min-width: 1000px)">' }, text: "Mos kelmaydigan media li fayl chizishni to'smaydi (baribir yuklanadi)." },
      { heading: 'Shrift', table: { head: ['font-display', 'Xatti-harakat'], rows: [['swap', 'darhol zaxira, keyin almashadi'], ['optional', 'kechiksa zaxira qoladi'], ['block', "matn biroz ko'rinmaydi"]] } },
      { heading: 'Asboblar', bullets: ["DevTools → Coverage: ishlatilmagan CSS.", "Network: render-blocking fayllar.", "Lighthouse: taklif va o'lchovlar."], callout: { kind: 'tip', text: "Avval o'lchang. Selektor tezligi kamdan-kam asosiy muammo." } },
    ],
    life: [
      ['⬜', "3 soniya oq ekran", "Katta CSS va ketma-ket @import."],
      ['👻', "Matn paydo bo'lmay turdi", "Shrift kutilyapti."],
    ],
    tip: "Birinchi ekranga kerak bo'lmagan uslubni kechiktiring, kerakligini kichraytiring.",
    mistakes: [
      ['Hamma CSS ni inline qilish.', "Faqat critical qismini.", "Kesh ishlamaydi va HTML shishadi."],
      ['CSS ichida @import zanjiri.', "link yoki build da birlashtirish.", "Har bosqich yangi borib-qaytish."],
      ['Ishlatilmagan kutubxonani to\'liq ulash.', "Kerakli qismini olish.", "Ortiqcha bayt chizishni kechiktiradi."],
    ],
    recap: [
      "CSS render-blocking resurs.",
      "@import ketma-ketlik yaratadi.",
      "Critical CSS birinchi chizilishni tezlashtiradi.",
      "font-display matn ko'rinishini boshqaradi.",
    ],
    practice: [
      { title: 'Coverage', text: "Bir saytda Coverage ni ishga tushirib, CSS ning necha foizi ishlatilganini yozing." },
      { title: 'Zanjirni toping', text: "Network waterfall da CSS ichidan boshlangan so'rovlarni qidiring." },
    ],
    items: [
      ch("CSS render-blocking degani nima?", "CSS kelmaguncha sahifa chizilmaydi", ["CSS kelguncha HTML yuklab olinmaydi", "CSS rasmlarni yuklashni taqiqlaydi", "CSS server javobini kechiktiradi"], "CSSOM tayyor bo'lishi kerak."),
      ch("a.css ichida @import url('b.css'). Yuklanish qanday boradi?", "a kelgach, keyin b so'raladi", ["Ikkalasi bir vaqtda so'raladi", "b birinchi bo'lib so'raladi", "b faqat bosilganda yuklanadi"], "Import fayl o'qilgandan keyin topiladi."),
      ch("RTT 200 ms. @import zanjiridagi uchinchi fayl kamida nechta qo'shimcha navbatdan keyin keladi (1-faylga nisbatan)?", "2", ["0", "1", "3"], "2-fayl 1-faylni, 3-fayl 2-faylni kutadi."),
      ch("<link rel=\"stylesheet\" href=\"print.css\" media=\"print\"> haqida to'g'ri gap?", "Yuklanadi, ekran chizishini to'smaydi", ["Chop etilmaguncha umuman yuklanmaydi", "Ekran chizilishini to'liq to'sadi", "Faqat tugma bosilganda yuklanadi"], "Past ustuvorlikda olinadi."),
      ch("Critical CSS qayerga qo'yiladi?", "head ichidagi style ga", ["body oxiridagi script ga", "Alohida @import fayliga", "Rasmlarning alt matniga"], "Qo'shimcha so'rovsiz darhol mavjud bo'ladi."),
      ch("Butun 300 kB CSS ni inline qilishning zarari?", "Har sahifada qayta yuklanadi", ["Selektorlar ishlamay qoladi", "Media query lar o'chib ketadi", "Specificity ikki baravar oshadi"], "Alohida fayl kabi keshlanmaydi."),
      ch("Ishlatilmagan CSS ulushini qaysi DevTools paneli ko'rsatadi?", "Coverage", ["Console", "Sources", "Application"], "Coverage."),
      ch("Matn darhol zaxira shriftda ko'rinsin. Qiymat?", "swap", ["block", "auto", "none"], "font-display: swap."),
      ch("Shrift almashganda maket sakrashini eng kam qiladigan qiymat?", "optional", ["swap", "block", "fallback"], "Kechiksa almashtirilmaydi."),
      fill("Birinchi kontent chizilgan vaqt qisqartmasi:", "FCP", "First Contentful Paint.", ["fcp"]),
      fill("Shrift uchun eng siqilgan zamonaviy format:", "WOFF2", "WOFF2.", ["woff2"]),
      order("Birinchi chizilish bosqichlari:", ['HTML olinadi', 'CSS olinadi', 'render tree', 'paint'], "CSSOM bo'lmasa chizilmaydi."),
    ],
  });
};
