// CSS, MIDDLE level, lessons 5-8: grid placement, positioning, mobile-first, fluid sizing.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 5 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Grid: chiziqlar, areas, auto-fit",
    intro: "fr hisobi, grid chiziqlari, span, grid-template-areas, auto-fit va auto-fill, 1fr tuzog'i.",
    what: "Grid ikki o'lchamli layout (joylashuv tizimi): avval ustun va qatorlar chiziladi, keyin elementlar ularga joylanadi. Chiziq raqamlari, nomlangan hududlar va repeat/minmax bilan ko'p hollarda media query siz ham moslashuvchan sahifa chiqadi.",
    analogy: { icon: '🪟', title: "Kataklangan daftar", text: "Avval chiziqlar tortiladi, keyin har rasm qaysi kataklarni egallashi aytiladi." },
    defs: [
      ['fr', "Qolgan bo'sh joyning ulushi."],
      ['Grid line (to\'r chizig\'i)', "Trek chegarasi; 1 dan, oxiridan -1 dan sanaladi."],
      ['Implicit grid (yashirin to\'r)', "Brauzer o'zi qo'shgan qator va ustunlar."],
      ['auto-fit / auto-fill', "Sig'adigancha trek; fit bo'shlarini yig'adi, fill saqlaydi."],
    ],
    uses: [
      ["Sahifa karkasida", "grid-template-areas."],
      ["Kartochkalar to'plamida", "repeat(auto-fit, minmax())."],
      ["Qator va ustun bo'ylab bir tekislashda", "Grid, flex emas."],
    ],
    sections: [
      { heading: 'fr hisobi', code: { lang: 'text', text: 'width 640px; columns: 100px 1fr 2fr; gap 20px\nbo\'sh = 640 - 100 - 2*20 = 500\n1fr = 500/3 ≈ 166.7px, 2fr ≈ 333.3px' } },
      { heading: 'Joylash', code: { lang: 'css', text: '.hero { grid-column: 1 / -1; }      /* butun kenglik */\n.side { grid-row: 2 / span 2; }    /* 2-chiziqdan 2 qator */' } },
      { heading: 'Areas', code: { lang: 'css', text: '.page {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-areas: "head head" "nav main";\n}\nheader { grid-area: head; }' } },
      { heading: 'Moslashuvchan kartochkalar', code: { lang: 'css', text: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));\n  gap: 16px;\n}' }, callout: { kind: 'warn', text: "1fr aslida minmax(auto, 1fr): uzun kontent ustunni kengaytiradi. Teng ustun uchun minmax(0, 1fr)." } },
    ],
    life: [
      ['🗞️', "Gazeta sahifasi", "Sarlavha butun kenglikni, ustunlar esa bir qismini egallaydi."],
      ['🛍️', "Mahsulotlar ro'yxati", "Ekran kengligiga qarab 1, 2 yoki 4 ustun."],
    ],
    tip: "DevTools da grid belgisini yoqing: chiziq raqamlari va areas ko'rinadi.",
    mistakes: [
      ['Chiziqni ustun raqami bilan adashtirish.', "3 ustunda 4 chiziq borligini bilish.", "1 / 3 ikki ustunni egallaydi."],
      ['areas qatorlarida har xil katak soni yozish.', "Hamma qatorda teng son.", "Aks holda butun qoida yaroqsiz."],
      ['Uzun kod bilan 1fr 1fr teng bo\'ladi deb kutish.', "minmax(0, 1fr).", "auto minimum kontentdan kichraymaydi."],
    ],
    recap: [
      "fr — qolgan joy ulushi, gap oldin ayiriladi.",
      "-1 oxirgi chiziq.",
      "auto-fit bo'sh treklarni yig'adi.",
      "Grid — ikki o'lcham, flex — bir o'lcham.",
    ],
    practice: [
      { title: 'Sahifa karkasi', text: "areas bilan header, nav, main, footer yasang va tor ekranda bitta ustunga o'tkazing." },
      { title: 'fit va fill', text: "Ikkita kartochka bilan auto-fit va auto-fill farqini ko'ring." },
    ],
    items: [
      ch("Ustun kengliklari?", "100px 230px 230px", ["100px 250px 250px", "100px 200px 200px", "200px 200px 200px"], "600 − 100 − 2×20 = 460, ikkiga: 230.", 'width: 600px; gap: 20px;\ngrid-template-columns: 100px 1fr 1fr;'),
      ch("grid-template-columns: repeat(3, 1fr) da nechta vertikal chiziq bor?", "4", ["3", "2", "6"], "Treklar soni + 1."),
      ch("grid-column: 1 / 3 element nechta ustunni egallaydi?", "2", ["3", "1", "4"], "1-chiziqdan 3-chiziqqacha ikki trek."),
      ch("Ustunlar soni qancha bo'lsa ham butun kenglikni egallash uchun?", "grid-column: 1 / -1", ["grid-column: 0 / 100", "grid-column: all", "grid-column: span auto"], "-1 oxirgi aniq chiziq."),
      ch("900px konteyner, 2 ta element, gap yo'q. Har biri necha px?", "450px", ["200px", "225px", "300px"], "auto-fit bo'sh treklarni yig'ib, elementlarni cho'zadi.", 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));'),
      ch("Xuddi shu holatda auto-fill. Har biri necha px?", "225px", ["450px", "200px", "300px"], "900 ga 4 trek sig'adi va bo'shlari saqlanadi.", 'grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));'),
      ch("minmax(min(250px, 100%), 1fr) dagi min() nima uchun?", "Tor ekranda toshib chiqmaslik uchun", ["Ustunlar sonini ikkitada ushlab turish uchun", "Qator balandligini bir xil qilish uchun", "gap qiymatini avtomatik hisoblash uchun"], "Konteyner 250px dan tor bo'lsa, trek 100% bo'ladi."),
      ch("Quyidagi areas nega ishlamaydi?", "Qatorlarda kataklar soni har xil", ["Nomlarni qo'shtirnoqsiz yozish kerak", "header so'zi band qilingan so'z", "areas faqat uch ustunda ishlaydi"], "Har satrda bir xil sondagi katak bo'lishi shart.", 'grid-template-areas:\n  "header header"\n  "main";'),
      ch("Elementlar explicit qatorlardan ko'p. Qo'shimcha qatorlar balandligini nima belgilaydi?", "grid-auto-rows", ["grid-template-rows", "grid-auto-columns", "align-content"], "Implicit qatorlar uchun."),
      fill("Bo'sh joy ulushini bildiradigan grid birligi:", "fr", "fr.", ["FR"]),
      fill("Bolani grid ichida ikki o'qda markazlashning qisqa xossasi: place-...: center (konteynerga yoziladi)", "items", "place-items: center.", ["place-items"]),
      order("Kengliklarni hisoblash tartibi:", ["qat'iy treklar", 'gap', "qolgan joy", 'fr ulushlari'], "Avval qat'iylar va gap ayiriladi."),
    ],
  });

  /* 6 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Position, containing block va z-index",
    intro: "relative, absolute, fixed, sticky, containing block, sticky nega ishlamaydi, stacking asoslari.",
    what: "position elementning oqimdagi joyi va koordinatalar nimaga nisbatan olinishini belgilaydi. Containing block (tayanch quti) — top, left va foizlar hisoblanadigan quti. z-index esa faqat bitta stacking context (ustma-ustlik konteksti) ichida solishtiriladi.",
    analogy: { icon: '📌', title: "Doskaga qadalgan qog'ozlar", text: "Qog'oz qaysi doskaga qadalgan bo'lsa, o'rni shu doskadan o'lchanadi. Pastdagi doskadagi qog'oz yuqoridagi doska ustiga chiqolmaydi." },
    defs: [
      ['static', "Standart: top/left va z-index ta'sir qilmaydi."],
      ['relative', "Joyi saqlanadi, o'ziga nisbatan siljiydi."],
      ['absolute', "Oqimdan chiqadi, eng yaqin positioned ajdodga nisbatan."],
      ['sticky', "Chegaraga yetguncha oqimda, keyin yopishadi."],
      ['Stacking context (ustma-ustlik konteksti)', "Ichidagi z-index lar o'zaro solishtiriladigan qatlam."],
    ],
    uses: [
      ["Kartochka burchagidagi belgi", "Otaga relative, belgiga absolute."],
      ["Yopishqoq sarlavha", "position: sticky; top: 0."],
      ["Modal pastda qolib ketsa", "Ajdodlardagi kontekstni topasiz."],
    ],
    sections: [
      { heading: 'Badge', code: { lang: 'css', text: '.card  { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; }\n.overlay { position: absolute; inset: 0; }' } },
      { heading: 'sticky ishlamasa', bullets: ["top (yoki boshqa chegara) yozilmagan.", "Ajdodda overflow: hidden, auto yoki scroll bor.", "Ota element bola bilan bir xil balandlikda."] },
      { heading: 'Kontekst yaratuvchilar', bullets: ["position + z-index (auto emas).", "opacity < 1.", "transform, filter.", "position: fixed va sticky.", "isolation: isolate."] },
      { heading: 'fixed tuzog\'i', callout: { kind: 'warn', text: "Ajdodda transform yoki filter bo'lsa, fixed bola viewport ga emas, o'sha ajdodga nisbatan joylashadi." } },
    ],
    life: [
      ['🪤', "z-index: 9999 ham yordam bermadi", "Ota konteksti qo'shnisidan past."],
      ['📍', "Belgi sahifa burchagiga uchib ketdi", "Otaga position: relative unutilgan."],
    ],
    tip: "z-index uchun kichik shkala tuting (--z-dropdown: 10, --z-modal: 100), tasodifiy 9999 emas.",
    mistakes: [
      ['static elementga z-index yozish.', "position berish.", "static da ta'sir qilmaydi."],
      ['sticky ni top siz qoldirish.', "top: 0.", "Qayerda yopishishi noma'lum."],
      ['Muammoni kattaroq son bilan yechish.', "Kontekstni topish.", "Son kontekstdan chiqmaydi."],
    ],
    recap: [
      "absolute eng yaqin positioned ajdodga tayanadi.",
      "fixed ni transform li ajdod o'zgartiradi.",
      "sticky chegara va scroll joyini talab qiladi.",
      "z-index kontekst ichida ishlaydi.",
    ],
    practice: [
      { title: 'Sticky sarlavha', text: "Jadval sarlavhasini yopishtiring, keyin otaga overflow: hidden qo'yib nima bo'lishini ko'ring." },
      { title: 'Kontekst ovi', text: "Biror ochiladigan menyu uchun qaysi ajdodlar stacking context yaratayotganini toping." },
    ],
    items: [
      ch(".badge qayerga joylashadi? (.card da position yozilmagan, boshqa positioned ajdod yo'q)", "Sahifaning boshlang'ich qutisiga nisbatan", ["Kartochka qutisining o'ng yuqori burchagiga", "Oldingi qo'shni elementga nisbatan", "Hech qayerga, top ta'sir qilmaydi"], "Initial containing block tayanch bo'ladi.", '.badge { position: absolute; top: 0; right: 0; }'),
      ch("position: relative; top: 20px — keyingi element nima qiladi?", "Joyidan qimirlamaydi", ["20px pastga suriladi", "20px yuqoriga chiqadi", "Elementning o'rnini egallaydi"], "relative da asl joy saqlanadi."),
      ch("Ustda qaysi element ko'rinadi? (ikkalasi bir joyda)", ".b", [".child", ".a", "DOM dagi birinchisi"], "child ning 999 qiymati .a konteksti (1) ichida qoladi, .b = 2.", '.a     { position: relative; z-index: 1; }\n.child { position: absolute; z-index: 999; }  /* .a ichida */\n.b     { position: relative; z-index: 2; }'),
      ch("static elementga z-index: 10 berildi. Natija?", "Hech narsa o'zgarmaydi", ["Hammadan ustga chiqadi", "Yangi kontekst yaratadi", "Element yo'qolib qoladi"], "z-index positioned (va flex/grid) elementlarda ishlaydi."),
      ch("sticky sarlavha yopishmayapti, top: 0 bor. Yana qaysi sabab ehtimoliy?", "Ajdodda overflow: hidden bor", ["Sarlavhada background yozilgan", "Sahifada box-sizing border-box", "Elementga class bilan uslub berilgan"], "Bunday ajdod scroll konteyneriga aylanadi."),
      ch("transform: translateZ(0) li ota ichida position: fixed modal. U nimaga nisbatan joylashadi?", "O'sha otaga nisbatan", ["Viewport ga nisbatan", "body elementiga nisbatan", "Oldingi qo'shniga nisbatan"], "transform containing block yaratadi."),
      ch("Quyidagilardan qaysi biri stacking context YARATMAYDI?", "position: relative (z-index siz)", ["opacity: 0.9 qiymati berilgan element", "transform: scale(1)", "isolation: isolate"], "relative z-index: auto bilan kontekst yaratmaydi."),
      ch("Komponent ichidagi z-index larni tashqaridan ajratishning eng toza usuli?", "isolation: isolate", ["opacity: 0.99", "transform: scale(1)", "z-index: 9999"], "Faqat kontekst yaratadi, ko'rinishga tegmaydi."),
      ch("inset: 0 nimaga teng?", "top, right, bottom, left: 0", ["margin va padding: 0 qiymati", "width va height: 0 qiymati", "z-index va order: 0 qiymati"], "To'rt tomonning qisqa yozuvi."),
      fill("Yopishqoq element uchun position qiymati:", "sticky", "position: sticky.", ["Sticky"]),
      fill("Bola absolute bo'lishi uchun otaga odatda yoziladigan position qiymati:", "relative", "position: relative.", ["Relative"]),
      fill("Viewport ga qotirilgan element uchun position qiymati:", "fixed", "position: fixed.", ["Fixed"]),
    ],
  });

  /* 7 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Mobile-first responsive",
    intro: "viewport meta, min-width bosqichlari, breakpoint tanlash, hover, pointer va prefers-* so'rovlari.",
    what: "Mobile-first (avval mobil) usulida asosiy uslub kichik ekran uchun yoziladi, kattaroq ekranlar uchun min-width so'rovlari bilan qo'shiladi. Responsive faqat ekran eni emas: foydalanuvchi sozlamalari va kirish usuli (barmoq yoki sichqoncha) ham hisobga olinadi.",
    analogy: { icon: '🧳', title: "Kichik chamadondan boshlash", text: "Avval eng zarurini joylaysiz, katta chamadon bo'lsa qo'shimchasini solasiz. Teskarisi — ortiqchasini chiqarib tashlash qiyinroq." },
    defs: [
      ['Breakpoint (o\'zgarish nuqtasi)', "Layout o'zgaradigan kenglik."],
      ['Media query (muhit so\'rovi)', "Shart bajarilsa ishlaydigan CSS bloki."],
      ['pointer: coarse', "Aniqligi past ko'rsatkich: barmoq."],
      ['prefers-reduced-motion', "Foydalanuvchi harakatni kamaytirishni so'ragan."],
    ],
    uses: [
      ["Yangi sahifa verstkasida", "Bitta ustundan boshlaysiz."],
      ["Hover telefonda yopishsa", "@media (hover: hover)."],
      ["Chop etishda", "@media print."],
    ],
    sections: [
      { heading: 'Majburiy meta', code: { lang: 'html', text: '<meta name="viewport" content="width=device-width, initial-scale=1">' } },
      { heading: 'Mobile-first', code: { lang: 'css', text: '.grid { display: grid; gap: 16px; }\n\n@media (width >= 700px) { .grid { grid-template-columns: 1fr 1fr; } }\n@media (width >= 1100px) { .grid { grid-template-columns: repeat(3, 1fr); } }' } },
      { heading: 'Foydalanuvchi sozlamalari', table: { head: ["So'rov", 'Nimani bildiradi'], rows: [['prefers-color-scheme', "yorug' yoki qorong'i"], ['prefers-reduced-motion', 'harakat kamaytirilsin'], ['hover: hover', 'haqiqiy hover bor'], ['pointer: coarse', 'barmoq bilan bosiladi']] } },
      { heading: 'Breakpoint qoidasi', callout: { kind: 'tip', text: "Qurilma ro'yxatiga emas, kontent qayerda buzila boshlashiga qarang." } },
    ],
    life: [
      ['📱', "Telefonda mayda sahifa", "viewport meta yo'q."],
      ['👆', "Barmoq bilan bosib bo'lmaydi", "pointer: coarse da tugmani kattalashtiring."],
    ],
    tip: "Oynani sekin toraytirib-kengaytiring: breakpoint o'zi ko'rinadi.",
    mistakes: [
      ['user-scalable=no qo\'yish.', "Zoom ga ruxsat berish.", "Ko'rishi zaif foydalanuvchi kattalashtira olmaydi."],
      ['min-width so\'rovlarini kattadan kichikka yozish.', "Kichikdan kattaga.", "Keyingi qoida oldingisini bosib ketadi."],
      ['Muhim amalni faqat hover ga bog\'lash.', "Bosish va fokus bilan ham ochish.", "Sensorli ekranda hover yo'q."],
    ],
    recap: [
      "Asos — mobil, qo'shimcha — min-width.",
      "viewport meta shart.",
      "Breakpoint kontentga qarab.",
      "hover, pointer, prefers-* ni hisobga oling.",
    ],
    practice: [
      { title: 'Uch bosqich', text: "Kartochkalar ro'yxatini 1, 2 va 3 ustunli qilib mobile-first yozing." },
      { title: 'Rendering paneli', text: "DevTools da prefers-color-scheme va reduced-motion ni taqlid qilib sahifani tekshiring." },
    ],
    items: [
      ch("Oyna 900px. .box rangi?", "blue", ["red", "green", "black"], "700 bajarildi, 1100 yo'q.", '.box { color: red; }\n@media (min-width: 700px)  { .box { color: blue; } }\n@media (min-width: 1100px) { .box { color: green; } }'),
      ch("Oyna 1200px. .box rangi?", "blue", ["green", "red", "black"], "Ikkala shart bajariladi, keyin yozilgan blue yutadi — tartib teskari yozilgan.", '@media (min-width: 1100px) { .box { color: green; } }\n@media (min-width: 700px)  { .box { color: blue; } }'),
      ch("(width >= 700px) qaysi biriga teng?", "(min-width: 700px)", ["(max-width: 700px)", "(min-device-width: 700em)", "(width: 700px)"], "Range sintaksisi."),
      ch("viewport meta yo'q sahifa telefonda qanday ko'rinadi?", "Kichraytirilgan desktop sahifa kabi", ["Faqat mobil uslublar bilan ochiladi", "Umuman ochilmay, bo'sh qoladi", "Gorizontal holatga majburan o'tadi"], "Brauzer keng virtual viewport oladi."),
      ch("Hover soyasi faqat haqiqiy hover bor qurilmada ishlashi uchun?", "@media (hover: hover)", ["@media (pointer: coarse)", "@media (orientation: portrait)", "@media screen and (hover: none)"], "Sensorli ekranda hover yopishib qolmaydi."),
      ch("Barmoq bilan boshqariladigan qurilmani aniqlaydigan so'rov?", "pointer: coarse", ["pointer: fine", "hover: hover", "resolution: 2dppx"], "coarse — dag'al ko'rsatkich."),
      ch("Media query ning specificity ga ta'siri?", "Hech qanday ta'sir qilmaydi", ["Class kabi bir ball qo'shadi", "ID kabi bir ball qo'shadi", "Qoidani !important qiladi"], "Faqat shart; ichidagi selektor kuchi o'zgarmaydi."),
      ch("Quyidagi holatda 800px oynada rang?", "red", ["blue", "black", "green"], "Specificity: .card.big (0,2,0) media ichidagi .card dan kuchli.", '.card.big { color: red; }\n@media (min-width: 700px) { .card { color: blue; } }'),
      ch("Breakpoint ni nimaga qarab tanlash to'g'ri?", "Kontent buzila boshlagan kenglikka", ["Eng yangi telefon modelining eniga", "Dizayner monitorining o'lchamiga", "Har 100px da bittadan qilib"], "Qurilmalar ro'yxati o'zgarib turadi."),
      fill("Harakatni kamaytirish so'rovi: prefers-reduced-...", "motion", "prefers-reduced-motion.", ["motion: reduce"]),
      fill("Qorong'i temani aniqlash: prefers-color-...", "scheme", "prefers-color-scheme.", ["scheme: dark"]),
      fill("Chop etish uchun media turi: @media ...", "print", "@media print.", ["Print"]),
    ],
  });

  /* 8 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Ravon o'lchamlar: clamp, min, max",
    intro: "rem, em, vw, ch va dvh; calc, min, max, clamp hisoblari; intrinsic layout va aspect-ratio.",
    what: "Har ekran uchun alohida qiymat yozish o'rniga o'lchamni oraliq bilan berish mumkin. min(), max() va clamp() qiymatni sharoitga qarab tanlaydi. Intrinsic layout (ichki o'lchamga tayangan joylashuv) esa kontent va bo'sh joyga o'zi moslashadi.",
    analogy: { icon: '🎚️', title: "Chegarali regulyator", text: "Ovoz xonaga qarab o'zgaradi, lekin juda past ham, juda baland ham bo'lmaydi — bu clamp(min, ideal, max)." },
    defs: [
      ['rem', "html shrift o'lchamiga nisbatan."],
      ['ch', "\"0\" belgisi kengligi; qator uzunligi uchun qulay."],
      ['dvh', "Mobil panel o'zgarishiga moslashadigan viewport balandligi."],
      ['clamp(min, ideal, max)', "Ideal qiymatni oraliqda ushlaydi."],
    ],
    uses: [
      ["Sarlavha o'lchamida", "clamp bilan ravon o'sish."],
      ["Maqola kengligida", "min(100% - 32px, 70ch)."],
      ["Rasm joyini oldindan ajratishda", "aspect-ratio."],
    ],
    sections: [
      { heading: 'Hisoblash', table: { head: ['Yozuv', 'Natija'], rows: [['min(500px, 100%) — ota 300px', '300px'], ['max(16px, 2vw) — oyna 400px', '16px'], ['clamp(200px, 50%, 400px) — ota 1000px', '400px']] } },
      { heading: 'Amaliy qoliplar', code: { lang: 'css', text: '.article { width: min(100% - 32px, 70ch); margin-inline: auto; }\nh1 { font-size: clamp(1.75rem, 1.2rem + 2vw, 3rem); }\n.screen { min-height: 100dvh; }\nimg { max-width: 100%; height: auto; }' } },
      { heading: 'calc yozilishi', callout: { kind: 'warn', text: "+ va - atrofida probel shart: calc(100% - 20px)." } },
      { heading: 'Nega rem', text: "Foydalanuvchi brauzer shriftini kattalashtirsa, rem bilan yozilgan matn ham kattalashadi, px — yo'q. Shrift formulasida faqat vw qoldirmang." },
    ],
    life: [
      ['📲', "Telefonda tagi kesildi", "100vh o'rniga 100dvh."],
      ['📖', "Qator juda uzun", "max-width: 65ch."],
    ],
    tip: "min() — yuqori chegara kabi, max() — pastki chegara kabi ishlaydi.",
    mistakes: [
      ['calc(100%-20px) yozish.', "calc(100% - 20px).", "Probelsiz yozuv yaroqsiz."],
      ['font-size: 4vw.', "clamp() va rem qo'shish.", "Zoom ga javob bermaydi, chegarasi yo'q."],
      ['Rasmga qat\'iy width va height berib cho\'zish.', "aspect-ratio yoki object-fit.", "Proporsiya buziladi."],
    ],
    recap: [
      "rem foydalanuvchi sozlamasiga mos.",
      "min yuqori, max pastki chegara.",
      "clamp uchalasini birlashtiradi.",
      "aspect-ratio sakrashni kamaytiradi.",
    ],
    practice: [
      { title: 'Ravon sarlavha', text: "360px va 1440px oynada h1 o'lchamini o'lchab, clamp chegaralarini tekshiring." },
      { title: 'Media query siz', text: "Bitta bo'limni faqat min, clamp va flex-wrap bilan moslashtiring." },
    ],
    items: [
      ch("Ota 300px. width: min(500px, 100%) natijasi?", "300px", ["500px", "100px", "800px"], "Eng kichigi tanlanadi."),
      ch("Ota 1000px. width: clamp(200px, 50%, 400px)?", "400px", ["500px", "200px", "1000px"], "Ideal 500 maksimaldan oshdi."),
      ch("Ota 300px. width: clamp(200px, 50%, 400px)?", "200px", ["150px", "300px", "400px"], "Ideal 150 minimaldan kichik."),
      ch("Oyna eni 400px. padding: max(16px, 2vw)?", "16px", ["8px", "24px", "32px"], "2vw = 8px; kattasi 16px."),
      ch("html font-size 20px. 2.5rem necha px?", "50px", ["40px", "45px", "25px"], "2.5 × 20."),
      ch("Quyidagi qoida nega ishlamaydi?", "Minus atrofida probel yo'q", ["calc foizni qo'llab-quvvatlamaydi", "width da calc ishlatib bo'lmaydi", "px va foizni birga ayirib bo'lmaydi"], "Brauzer -20px ni alohida qiymat deb o'qiydi.", 'width: calc(100%-20px);'),
      ch("Foydalanuvchi brauzerda asosiy shriftni kattalashtirdi. Qaysi matn o'zgarmay qoladi?", "font-size: 16px", ["font-size: 1rem", "font-size: 1.2em", "font-size: 100%"], "px sozlamaga bog'lanmagan."),
      ch("Telefonda panel ochilib-yopiladi, blok doim ko'rinadigan balandlikka moslashsin. Qaysi birlik?", "100dvh", ["100vh", "100lvh", "100vw"], "dvh joriy holatga moslashadi."),
      ch("Matn qatori o'qishga qulay bo'lishi uchun eng mos cheklov?", "max-width: 65ch", ["max-width: 100vw", "min-width: 120ch", "height: 65ch"], "45–75 belgi qulay."),
      fill("Rasm yuklanmasdan nisbatli joy ajratadigan xossa:", "aspect-ratio", "aspect-ratio: 16 / 9.", ["aspect-ratio: 16 / 9"]),
      fill("Rasmni qutiga proporsiyani buzmay, kesib to'ldirish: object-fit: ...", "cover", "object-fit: cover.", ["cover;"]),
      order("clamp argumentlari tartibi:", ['minimum', 'ideal', 'maksimum'], "clamp(min, ideal, max)."),
    ],
  });
};
