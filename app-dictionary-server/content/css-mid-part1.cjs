// CSS, MIDDLE level, lessons 1-4: specificity, inheritance and values, box model traps, flexbox math.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Specificity hisoblash va ziddiyatlar",
    intro: "(ID, class, type) hisobi, :is, :not, :has va :where qiymati, inline uslub va !important.",
    what: "Bir elementga bir xossa uchun bir nechta qoida to'qnashsa, cascade (qoidalar sharsharasi) g'olibni tanlaydi: avval kelib chiqish va muhimlik, keyin specificity (aniqlik darajasi), oxirida yozilish tartibi. Middle dasturchi \"nega ishlamayapti\" savoliga !important bilan emas, hisob bilan javob beradi.",
    analogy: { icon: '🏅', title: "Medallar jadvali", text: "Oltin (ID), kumush (class), bronza (type). Bitta oltin yuzta kumushdan ustun: raqamlar chapdan o'ngga solishtiriladi, qo'shib yuborilmaydi." },
    defs: [
      ['Specificity (aniqlik darajasi)', "Selektorning uch xonali og'irligi: (ID, class, type)."],
      ['Pseudo-class (soxta sinf)', "Holat selektori: :hover. Class kabi hisoblanadi."],
      ['Pseudo-element (soxta element)', "::before kabi qism. Type kabi hisoblanadi."],
      ['!important', "Qoidani alohida, yuqori cascade bosqichiga olib chiqadi."],
    ],
    uses: [
      ["Uslub qo'llanmasa", "DevTools da chizib tashlangan qoida va g'olibni solishtirasiz."],
      ["Kutubxona uslubini o'zgartirishda", "Kerakli kuchdagi eng sodda selektorni tanlaysiz."],
      ["Reset yozishda", ":where bilan nol og'irlik berasiz."],
    ],
    sections: [
      { heading: 'Hisob jadvali', table: { head: ['Selektor', 'Qiymat'], rows: [['*', '(0,0,0)'], ['li::marker', '(0,0,2)'], ['.nav a:hover', '(0,2,1)'], ['[type="text"]', '(0,1,0)'], ['#main .card p', '(1,1,1)']] } },
      { heading: 'Funksional pseudo-class lar', bullets: [":is(), :not(), :has() — ichidagi eng kuchli argument qiymatini oladi.", ":where() — har doim (0,0,0).", "Kombinatorlar (probel, >, +, ~) hisobga kirmaydi."] },
      { heading: 'Misol', code: { lang: 'css', text: ':is(#app, .x) p { color: red; }    /* (1,0,1) */\n:where(#app) p  { color: blue; }   /* (0,0,1) */\np               { color: green; }  /* (0,0,1) */' } },
      { heading: 'Yuqori bosqichlar', callout: { kind: 'warn', text: "style=\"\" hamma selektordan kuchli; uni faqat !important yengadi. !important qo'yish ziddiyatni yo'qotmaydi, keyingi bosqichga ko'chiradi." } },
    ],
    life: [
      ['🔧', "Tugma rangi o'zgarmayapti", ".btn qoidangizni #sidebar button (1,0,1) yengyapti."],
      ['⚔️', "!important urushi", "Biri qo'ydi, ikkinchisi ham qo'ydi — endi yana specificity solishtiriladi."],
    ],
    tip: "Selektorlarni past va bir xil kuchda ushlang: asosan bitta class.",
    mistakes: [
      ['11 ta class bitta ID ni yengadi deb o\'ylash.', "ID xonasi alohida.", "Xonalar bir-biriga o'tmaydi."],
      ['HTML dagi class tartibiga qarash.', "CSS dagi yozilish tartibiga qarash.", "class=\"b a\" va \"a b\" farq qilmaydi."],
      ['Har muammoni !important bilan yopish.', "Sababni DevTools da topish.", "Kod boshqarib bo'lmas holga keladi."],
    ],
    recap: [
      "(ID, class, type) chapdan solishtiriladi.",
      "Teng bo'lsa, CSS da keyingisi yutadi.",
      ":where nol, :is/:not/:has eng kuchli argument.",
      "Inline va !important alohida bosqich.",
    ],
    practice: [
      { title: 'Qo\'lda hisoblang', text: "Loyihangizdagi 5 ta selektorning qiymatini yozib, DevTools bilan tekshiring." },
      { title: '!important ni olib tashlang', text: "Bitta !important li joyni selektorni to'g'rilash orqali yeching." },
    ],
    items: [
      ch("Paragraf rangi qanday bo'ladi? HTML: <div id=\"box\"><p class=\"text\">A</p></div>", "red", ["blue", "green", "black"], "#box p = (1,0,1), .text = (0,1,0). ID xonasi yutadi.", '#box p { color: red; }\n.text  { color: blue; }\np      { color: green; }'),
      ch("Paragraf rangi? HTML: <p id=\"a\" class=\"b\">x</p>", "blue", ["red", "black", "purple"], ":where nol beradi: (0,0,1) < .b (0,1,0).", ':where(#a) { color: red; }\n.b         { color: blue; }'),
      ch("Paragraf rangi? HTML: <div class=\"x\"><p>x</p></div>", "red", ["blue", "black", "green"], ":is eng kuchli argumentni oladi: #y tufayli (1,0,1), garchi mos kelgani .x bo'lsa ham.", ':is(.x, #y) p { color: red; }\n.x p          { color: blue; }'),
      ch("`ul li.active > a:hover` ning qiymati?", "(0,2,3)", ["(0,1,3)", "(0,2,2)", "(0,3,2)"], "class va pseudo-class: .active, :hover = 2; type: ul, li, a = 3."),
      ch("`a:not(.external)::after` qiymati?", "(0,1,2)", ["(0,2,1)", "(0,1,1)", "(0,0,2)"], ":not argumenti .external (0,1,0); a va ::after — 2 ta type."),
      ch("Tugma rangi? HTML: <button class=\"b a\">x</button>", "green", ["red", "black", "blue"], "Kuch teng: CSS da keyin yozilgan .b yutadi; HTML tartibi ahamiyatsiz.", '.a { color: red; }\n.b { color: green; }'),
      ch("Element rangi? HTML: <p id=\"t\" style=\"color: red\">x</p>", "blue", ["red", "black", "green"], "!important inline oddiy uslubni ham yengadi.", '#t { color: green; }\np  { color: blue !important; }'),
      ch("Ikkala qoidada !important. Paragraf (<p class=\"c\" id=\"d\">) rangi?", "red", ["blue", "black", "green"], "Muhimlik teng, yana specificity: #d yutadi.", '#d { color: red !important; }\n.c { color: blue !important; }'),
      ch("Reset kutubxonasi foydalanuvchi oson bosib ketishi uchun selektorni nimaga o'raydi?", ":where()", [":is()", ":not()", ":has()"], ":where og'irligi nol."),
      fill("`#nav .item a` ning class xonasidagi son:", "1", "(1,1,1)."),
      fill("Selektor kuchi nol bo'ladigan universal selektor belgisi:", "*", "* (0,0,0)."),
      order("Kuchsizdan kuchliga tartiblang:", ['p', '.card', '#main', 'style=""'], "type < class < ID < inline."),
    ],
  });

  /* 2 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Inheritance va qiymatlarning hisoblanishi",
    intro: "Meros bo'ladigan xossalar, inherit, initial, unset, revert, em va line-height merosi, var() xatosi.",
    what: "Inheritance (meros) — ba'zi xossalarning qiymati ota elementdan bolaga o'tishi. Brauzer qiymatni bosqichma-bosqich hisoblaydi: yozilgan → computed (hisoblangan) → used (ishlatilgan). Bolaga aynan computed qiymat o'tadi, va ko'p kutilmagan natijalar shundan chiqadi.",
    analogy: { icon: '👨‍👧', title: "Oiladan o'tadigan belgi", text: "Ko'z rangi (color, font) bolaga o'tadi, ammo otaning uyi devorlari (margin, border) bolaga ko'chmaydi." },
    defs: [
      ['inherit', "Ota qiymatini ol."],
      ['initial', "Spetsifikatsiyadagi boshlang'ich qiymat."],
      ['unset', "Meros xossada inherit, boshqasida initial."],
      ['revert', "Brauzer standart uslubiga qaytar."],
      ['Computed value (hisoblangan qiymat)', "Nisbiy birliklar imkon qadar aniqlangan qiymat."],
    ],
    uses: [
      ["Butun sahifa shriftini berishda", "body ga bir marta, form elementlariga font: inherit."],
      ["Uchinchi tomon uslubini bekor qilishda", "revert yoki unset."],
      ["Ichma-ich o'lcham buzilsa", "em merosini tekshirasiz."],
    ],
    sections: [
      { heading: 'Nima meros bo\'ladi', table: { head: ["Meros bo'ladi", "Bo'lmaydi"], rows: [['color, font-*', 'margin, padding'], ['line-height, text-align', 'border, background'], ['visibility, cursor', 'width, height, display'], ['custom property (--x)', 'position']] } },
      { heading: 'em ko\'payishi', code: { lang: 'css', text: 'html { font-size: 16px; }\n.a { font-size: 1.5em; }   /* 24px */\n.a .a { }                  /* 36px: yana 1.5 marta */' } },
      { heading: 'line-height', code: { lang: 'css', text: 'body { font-size: 20px; line-height: 1.5; }  /* bolaga 1.5 (koeffitsient) */\nbody { font-size: 20px; line-height: 1.5em; } /* bolaga 30px (tayyor son) */' }, callout: { kind: 'tip', text: "line-height ni birliksiz yozing." } },
      { heading: 'var() yaroqsiz bo\'lsa', callout: { kind: 'warn', text: "var() natijasi xossaga mos kelmasa, brauzer oldingi qoidaga qaytmaydi: xossa unset kabi ishlaydi." } },
    ],
    life: [
      ['🔤', "Tugmada boshqa shrift", "button shriftni meros olmaydi — font: inherit kerak."],
      ['📏', "Menyu ichida menyu kattalashdi", "font-size em da yozilgan va har qavatda ko'paygan."],
    ],
    tip: "DevTools → Computed panelida yakuniy qiymat va u qayerdan kelganini ko'ring.",
    mistakes: [
      ['display: initial bilan "avvalgi holat"ni kutish.', "display: revert.", "initial qiymati inline."],
      ['line-height: 24px ni body ga yozish.', "line-height: 1.5.", "Katta sarlavhada qatorlar ustma-ust tushadi."],
      ['margin bolaga o\'tadi deb o\'ylash.', "Kerak bo'lsa inherit yozish.", "Layout xossalari meros bo'lmaydi."],
    ],
    recap: [
      "Matn xossalari meros bo'ladi, layout xossalari yo'q.",
      "initial va revert bir xil emas.",
      "Bolaga computed qiymat o'tadi.",
      "Birliksiz line-height — koeffitsient.",
    ],
    practice: [
      { title: 'Computed ni o\'qing', text: "Bitta paragrafning color qiymati qaysi ajdoddan kelganini toping." },
      { title: 'em tuzog\'i', text: "Uch qavatli em ro'yxat yasab, har qavatdagi piksel o'lchamini oldindan hisoblang." },
    ],
    items: [
      ch("Ichki .item ning shrift o'lchami? (html 16px, ikkala div ham class=\"item\", biri ikkinchisi ichida)", "36px", ["24px", "32px", "48px"], "16 × 1.5 = 24, keyin 24 × 1.5 = 36.", '.item { font-size: 1.5em; }'),
      ch("Xuddi shu holatda 1.5rem yozilsa ichki element necha px?", "24px", ["36px", "16px", "48px"], "rem faqat html ga nisbatan.", '.item { font-size: 1.5rem; }'),
      ch("h2 qator balandligi necha px?", "30px", ["60px", "20px", "40px"], "em qiymat otada hisoblanib (20 × 1.5), tayyor 30px meros bo'ladi.", 'body { font-size: 20px; line-height: 1.5em; }\nh2   { font-size: 40px; }'),
      ch("Endi h2 qator balandligi necha px?", "60px", ["30px", "40px", "20px"], "Birliksiz koeffitsient: 40 × 1.5.", 'body { font-size: 20px; line-height: 1.5; }\nh2   { font-size: 40px; }'),
      ch("div uchun display: initial natijasi?", "inline", ["block", "none", "flow-root"], "initial spetsifikatsiya qiymati, brauzer uslubi emas."),
      ch("div uchun display: revert natijasi?", "block", ["inline", "none", "contents"], "revert brauzer standart uslubiga qaytaradi."),
      ch("Havola ichidagi matn ota rangini olishi uchun?", "a { color: inherit; }", ["a { color: initial; }", "a { color: auto; }", "a { color: none; }"], "Brauzer a ga o'z rangini bergan, inherit uni almashtiradi."),
      ch("border: 1px solid li ota ichidagi bola chegara oladimi?", "Yo'q, border meros bo'lmaydi", ["Ha, hamma xossa meros bo'ladi", "Faqat border rangi o'tadi", "Faqat blok bolalar oladi"], "Layout va bezak xossalari meros bo'lmaydi."),
      ch("Paragraf rangi qanday bo'ladi? (body color: green)", "green", ["red", "black", "10px"], "var() natijasi rang emas — color unset bo'ladi va otadan meros oladi; red ga qaytmaydi.", ':root { --c: 10px; }\np { color: red; }\np { color: var(--c); }'),
      fill("Meros xossada inherit, boshqasida initial bo'ladigan kalit so'z:", "unset", "unset.", ["Unset"]),
      fill("input otaning shriftini olishi uchun: font: ...", "inherit", "font: inherit.", ["inherit;"]),
      fill("--gap: 8px; margin: var(--space, 4px) — --space aniqlanmagan bo'lsa margin necha? (px bilan)", "4px", "Fallback ishlaydi.", ['4 px', '4']),
    ],
  });

  /* 3 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Box model tuzoqlari",
    intro: "box-sizing hisobi, margin collapse, foizli padding, overflow va logical properties.",
    what: "Har element to'rt qatlamli quti: content, padding, border, margin. Muammolar odatda uch joyda: width nimani o'lchashi (box-sizing), vertikal margin larning birlashishi va foiz nimaga nisbatan hisoblanishi.",
    analogy: { icon: '📦', title: "Qadoqlangan sovg'a", text: "Sovg'a (content), yumshoq qog'oz (padding), quti devori (border), qutilar orasidagi joy (margin)." },
    defs: [
      ['content-box', "width faqat kontent kengligi."],
      ['border-box', "width padding va border bilan birga."],
      ['Margin collapse (chetlar birlashishi)', "Vertikal margin lardan faqat kattasi qoladi."],
      ['Logical properties (mantiqiy xossalar)', "Matn yo'nalishiga moslashadigan: margin-inline-start."],
    ],
    uses: [
      ["Gorizontal scroll chiqsa", "width + padding yig'indisini tekshirasiz."],
      ["Kutilmagan bo'shliq bo'lsa", "Margin collapse ni tekshirasiz."],
      ["RTL tillar uchun", "left/right o'rniga inline xossalari."],
    ],
    sections: [
      { heading: 'Hisob', table: { head: ['width: 200px; padding: 20px; border: 5px', "Ko'rinadigan kenglik"], rows: [['content-box', '200 + 40 + 10 = 250px'], ['border-box', '200px (kontent 150px)']] } },
      { heading: 'Margin collapse qoidalari', bullets: ["Faqat vertikal va oddiy block oqimida.", "Flex va grid bolalarida bo'lmaydi.", "Ota va birinchi bola margin-top i ham birlashadi.", "display: flow-root, padding yoki border buni to'xtatadi."] },
      { heading: 'Foizli padding', code: { lang: 'css', text: '.parent { width: 400px; }\n.child  { padding-top: 50%; }  /* 200px — ota KENGLIGIDAN */' } },
      { heading: 'Overflow', table: { head: ['Qiymat', 'Xatti-harakat'], rows: [['visible', 'tashqariga chiqadi'], ['hidden', 'kesadi, kod bilan scroll mumkin'], ['clip', "kesadi, scroll yo'q"], ['auto', 'kerak bo\'lsa scrollbar']] } },
    ],
    life: [
      ['↔️', "Sahifa yonga suriladi", "width: 100% va padding content-box da."],
      ['⬇️', "Sarlavha otani pastga itardi", "Bolaning margin-top i ota bilan birlashgan."],
    ],
    tip: "Elementlar orasidagi masofa uchun flex yoki grid dagi gap — collapse va ortiqcha chet bo'lmaydi.",
    mistakes: [
      ['Ikki blok margin i qo\'shiladi deb hisoblash.', "Kattasi qolishini bilish.", "30 va 20 → 30."],
      ['padding-top: 50% ni balandlikdan deb o\'ylash.', "Ota kengligidan hisoblash.", "Vertikal foiz ham kenglikdan."],
      ['Inline span ga width berish.', "inline-block yoki block.", "Inline element o'lcham olmaydi."],
    ],
    recap: [
      "border-box hisobni soddalashtiradi.",
      "Vertikal margin lar birlashadi, flex va grid da yo'q.",
      "Foizli padding/margin ota kengligidan.",
      "inline element width va height olmaydi.",
    ],
    practice: [
      { title: 'Box model paneli', text: "DevTools da element qutisining to'rt qatlamini va yakuniy kengligini tekshiring." },
      { title: 'Collapse ni yarating', text: "Ikki blok orasida margin birlashishini ko'rsatib, flow-root bilan ota holatini tuzating." },
    ],
    items: [
      ch("Element ko'rinadigan kengligi?", "250px", ["200px", "240px", "210px"], "200 + 2×20 + 2×5.", 'width: 200px; padding: 20px; border: 5px solid;\nbox-sizing: content-box;'),
      ch("border-box da kontent kengligi necha?", "150px", ["200px", "160px", "190px"], "200 − 40 − 10.", 'width: 200px; padding: 20px; border: 5px solid;\nbox-sizing: border-box;'),
      ch("Ikki blok orasidagi masofa?", "30px", ["50px", "20px", "10px"], "Vertikal margin lar birlashadi: kattasi.", '.a { margin-bottom: 30px; }\n.b { margin-top: 20px; }   /* ota: oddiy blok */'),
      ch("Shu ikki element flex-direction: column konteynerida. Masofa?", "50px", ["30px", "20px", "0px"], "Flex da collapse yo'q.", '.a { margin-bottom: 30px; }\n.b { margin-top: 20px; }'),
      ch("Bolaning padding-top i necha px?", "200px", ["50px", "100px", "25px"], "Foiz ota kengligidan: 400 × 50%.", '.parent { width: 400px; height: 100px; }\n.child  { padding-top: 50%; }'),
      ch("Bolaning margin-top i ota tashqarisiga \"chiqib ketyapti\". Eng toza yechim?", "Otaga display: flow-root", ["Bolaga z-index: 1 berish", "Otaga position: static", "Bolaga float: none yozish"], "flow-root yangi BFC yaratadi."),
      ch("span ga width: 200px berildi, ta'sir yo'q. Nega?", "Inline element o'lcham olmaydi", ["span ga CSS umuman qo'llanmaydi", "width faqat div da yozilishi shart", "Qiymat px da yozilmasligi kerak"], "display: inline-block yoki block kerak."),
      ch("overflow: hidden va clip farqi?", "clip da kod bilan ham scroll bo'lmaydi", ["hidden kontentni tashqariga chiqaradi", "clip doim scrollbar ko'rsatib turadi", "hidden faqat vertikal yo'nalishda ishlaydi"], "hidden elementni dasturiy scroll qilsa bo'ladi."),
      ch("Arab tilidagi sahifada ham \"matn boshidagi tomon\"ga joy berish uchun?", "margin-inline-start", ["margin-left", "margin-block-start", "margin-top"], "inline-start matn yo'nalishiga qarab chap yoki o'ng."),
      fill("padding va border width ichiga kiradigan box-sizing qiymati:", "border-box", "border-box.", ["Border-box"]),
      fill("Uch qator: overflow: hidden; white-space: nowrap; text-overflow: ...", "ellipsis", "Bir qatorli kesish.", ["ellipsis;"]),
      order("Quti qatlamlarini ichkaridan tashqariga tartiblang:", ['content', 'padding', 'border', 'margin'], "Kontent markazda, margin eng tashqarida."),
    ],
  });

  /* 4 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Flexbox: o'lcham hisoblari",
    intro: "flex-grow, shrink, basis qanday hisoblanadi, flex: 1 va auto farqi, min-width: 0 va margin: auto.",
    what: "Flex o'lchami uch qadamda chiqadi: har element flex-basis (boshlang'ich o'lcham) oladi, keyin bo'sh joy grow ulushlariga qarab tarqatiladi yoki yetmayotgan joy shrink va basis ga qarab ayiriladi, oxirida min/max cheklovlari qo'llanadi.",
    analogy: { icon: '🍰', title: "Tortni bo'lish", text: "Avval har kimga kafolatlangan bo'lak (basis), qolgani ulushga qarab (grow). Tort yetmasa, har kimdan kamaytiriladi (shrink)." },
    defs: [
      ['flex-basis', "Taqsimlashdan oldingi asosiy o'q o'lchami."],
      ['flex-grow', "Ortiqcha bo'sh joydan olinadigan ulush."],
      ['flex-shrink', "Joy yetmaganda kichrayish ulushi."],
      ['flex: 1', "1 1 0% — kontentga qaramay teng bo'lish."],
    ],
    uses: [
      ["Teng ustunlarda", "flex: 1."],
      ["Qat'iy yon panelda", "flex: 0 0 240px."],
      ["Matn kesilmay, sahifani kengaytirsa", "min-width: 0."],
    ],
    sections: [
      { heading: 'Qisqa yozuvlar', table: { head: ['Yozuv', 'To\'liq'], rows: [['flex: 1', '1 1 0%'], ['flex: auto', '1 1 auto'], ['flex: none', '0 0 auto'], ['standart', '0 1 auto']] } },
      { heading: 'Grow hisobi', code: { lang: 'text', text: 'Konteyner 600px, basis: 100 va 100, grow: 1 va 3\nbo\'sh joy = 600 - 200 = 400\nA = 100 + 400 * 1/4 = 200\nB = 100 + 400 * 3/4 = 400' } },
      { heading: 'min-width tuzog\'i', code: { lang: 'css', text: '.content { flex: 1; min-width: 0; }   /* uzun so\'z endi kengaytirmaydi */' }, callout: { kind: 'warn', text: "Flex elementning min-width standarti auto: u kontentdan kichraymaydi." } },
      { heading: 'margin: auto', text: "Flex ichida auto margin bo'sh joyni o'ziga oladi: oxirgi tugmani o'ngga surish uchun margin-left: auto yetarli." },
    ],
    life: [
      ['🧾', "Ellipsis ishlamayapti", "Matnli bolaga min-width: 0 yetishmaydi."],
      ['📌', "Footer pastda tursin", "Ustun flex, main ga flex: 1."],
    ],
    tip: "justify-content — asosiy o'q, align-items — ko'ndalang o'q. flex-direction o'qlarni almashtiradi.",
    mistakes: [
      ['flex: 1 va flex-grow: 1 bir xil deb o\'ylash.', "basis farqini bilish.", "flex-grow: 1 da basis auto qoladi."],
      ['column da justify-content ni gorizontal deb kutish.', "Asosiy o'q vertikal ekanini eslash.", "O'qlar almashgan."],
      ['order bilan mantiqiy tartibni o\'zgartirish.', "HTML tartibini o'zgartirish.", "Klaviatura DOM bo'yicha yuradi."],
    ],
    recap: [
      "Avval basis, keyin grow yoki shrink.",
      "flex: 1 teng, flex: auto kontentga qarab.",
      "min-width: auto uzun kontentda muammo.",
      "auto margin bo'sh joyni yutadi.",
    ],
    practice: [
      { title: 'Oldindan hisoblang', text: "Uch elementli konteyner uchun kengliklarni qog'ozda hisoblab, brauzerda tekshiring." },
      { title: 'Ellipsis', text: "Avatar va uzun ism qatorida ismni uch nuqta bilan kesing." },
    ],
    items: [
      ch("B elementining kengligi?", "400px", ["300px", "450px", "500px"], "Bo'sh joy 400, B ulushi 3/4 = 300, basis bilan 400.", '.box { display: flex; width: 600px; }\n.a { flex: 1 1 100px; }\n.b { flex: 3 1 100px; }'),
      ch("Har bir element kengligi? (kontent qisqa)", "200px", ["100px", "600px", "150px"], "basis 0%, grow teng: 600 / 3.", '.box { display: flex; width: 600px; }\n.box > * { flex: 1; }   /* 3 ta bola */'),
      ch("A ning kengligi?", "150px", ["200px", "100px", "250px"], "Jami basis 400px, joy 300px: yetishmagan 100px teng basis va shrink sababli 50px dan ayiriladi.", '.box { display: flex; width: 300px; }\n.a, .b { flex: 0 1 200px; }'),
      ch("Joy yetmayapti (konteyner 300px). B ning kengligi?", "200px", ["150px", "100px", "250px"], "B shrink 0 — qisqarmaydi; yetishmagan 100px hammasi A dan olinadi.", '.box { display: flex; width: 300px; }\n.a { flex: 0 1 200px; }\n.b { flex: 0 0 200px; }'),
      ch("flex: auto qaysi to'liq yozuvga teng?", "1 1 auto", ["1 1 0%", "0 0 auto", "0 1 auto"], "auto: kontentdan boshlab o'sadi."),
      ch("flex: 1 li bola ichidagi uzun URL sahifani kengaytirib yubordi. Yechim?", "min-width: 0", ["max-width: auto", "flex-shrink: 0", "width: max-content"], "Standart min-width: auto kontentdan kichraytirmaydi."),
      ch("flex-direction: column konteynerida bolalarni gorizontal markazlash uchun?", "align-items: center", ["justify-content: center", "text-align: justify", "flex-wrap: center"], "Ustunda ko'ndalang o'q gorizontal."),
      ch("Header da faqat oxirgi tugmani o'ng chekkaga surishning eng qisqa yo'li?", "Tugmaga margin-left: auto", ["Konteynerga text-align: right", "Tugmaga justify-self: end", "Tugmaga float: right berish"], "auto margin bo'sh joyni yutadi; flex da justify-self va float ishlamaydi."),
      ch("order: -1 berilgan tugma haqida qaysi gap to'g'ri?", "Tab tartibi DOM bo'yicha qoladi", ["DOM dagi joyi ham o'zgarib ketadi", "Ekran o'qigich uni o'tkazib yuboradi", "U konteynerdan tashqariga chiqadi"], "order faqat vizual."),
      fill("flex: none qisqa yozuvining flex-grow qiymati:", "0", "0 0 auto."),
      fill("Flex elementlari keyingi qatorga o'tishi uchun: flex-wrap: ...", "wrap", "flex-wrap: wrap.", ["wrap;"]),
      order("Flex o'lchami hisoblanish tartibi:", ['basis', "bo'sh joyni aniqlash", 'grow yoki shrink', 'min/max cheklovi'], "Boshlang'ich o'lchamdan yakuniy o'lchamga."),
    ],
  });
};
