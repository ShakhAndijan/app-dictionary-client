// CSS, lessons 1-8. Questions are deliberately demanding: code reading, calculation, traps.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Selektorlar',
    intro: "Elementlarni aniq tanlash: kombinatorlar, atribut, pseudo-class va pseudo-element.",
    theory: {
      analogy: { icon: '🎯', title: 'Manzil bo\'yicha qidirish', text: "Selektor — manzil. \"Chilonzor, 9-uy\" deganda hamma uylar emas, aniq bittasi nazarda tutiladi. \"9-uydagi har bir xonadon\" (avlod) yoki \"faqat 9-uyning eshigi yonidagi birinchi xonadon\" (to'g'ridan-to'g'ri bola) desangiz, tanlov torayadi. Selektorlar shu aniqlikni beradi." },
      sections: [
        { heading: 'Asosiy selektorlar va kombinatorlar', table: { head: ['Selektor', 'Nimani tanlaydi'], rows: [['p', "Barcha p elementlari"], ['.card', 'class="card" bo\'lganlar'], ['#hero', 'id="hero" bo\'lgan bitta element'], ['ul li', "ul ichidagi HAR QANDAY chuqurlikdagi li (avlod)"], ['ul > li', 'Faqat ul ning TO\'G\'RIDAN-TO\'G\'RI bolalari'], ['h1 + p', "h1 dan DARHOL keyingi bitta p (aka-uka)"], ['h1 ~ p', "h1 dan keyingi BARCHA p aka-ukalar"], ['.a.b', 'Bir vaqtda ikkala class (probelsiz)'], ['.a .b', '.a ichidagi .b (probel = avlod)']] } },
        { heading: 'Atribut selektorlari', code: { lang: 'css', text: 'a[href]            { }  /* href bor */\na[href^="https"]   { }  /* https bilan BOSHLANADI */\na[href$=".pdf"]    { }  /* .pdf bilan TUGAYDI */\na[href*="uz"]      { }  /* ichida "uz" bor */\ninput[type="text"] { }  /* aniq qiymat */' } },
        { heading: 'Pseudo-class va pseudo-element', bullets: [":hover, :focus-visible, :first-child, :nth-child(2n), :not(.x) — elementning HOLATI yoki o'rniga qarab (bitta ikki nuqta).", "::before, ::after, ::first-line, ::placeholder — elementning bir QISMINI yoki sun'iy qismini (ikki ikki nuqta).", "::before va ::after content xususiyatisiz chizilmaydi.", ":first-child — o'z ota-onasining birinchi bolasi bo'lishi shart. :first-of-type — o'z turining birinchisi."] },
        { callout: { kind: 'warn', text: ".a.b va .a .b butunlay boshqa narsa: birinchisi bitta elementda ikkita class, ikkinchisi ichma-ich ikki element." } },
      ],
      recap: ["Probel avlodni, > to'g'ridan-to'g'ri bolani, + darhol keyingini, ~ barcha keyingilarni bildiradi.", "[attr^=], [attr$=], [attr*=] qiymatning boshi, oxiri, ichi.", "Pseudo-class — holat (:), pseudo-element — qism (::).", ":first-child turga emas, o'ringa qaraydi."],
    },
    defs: [
      ['Selektor', "CSS qoidasi qaysi elementlarga tegishli ekanini aniqlovchi naqsh."],
      ['Kombinator', "ikki selektor orasidagi munosabat belgisi: probel, >, +, ~."],
      ['Pseudo-class', "elementning holati yoki o'rnini tanlaydi (:hover, :nth-child)."],
      ['Pseudo-element', "elementning bir qismi yoki sun'iy yaratilgan qismi (::before, ::first-line)."],
    ],
    life: [
      ['🏙️', 'Shahar manzili', "\"Toshkent shahri\" (probel) ichidagi har qanday ko'cha, \"Toshkent > Chilonzor\" esa to'g'ridan-to'g'ri tuman. Xuddi shunday ul li hammasini, ul > li faqat birinchi qavatdagilarni tanlaydi."],
      ['🚌', 'Avtobus navbati', "h1 + p — navbatda sizdan darhol keyingi odam, h1 ~ p — sizdan keyingi butun navbat."],
    ],
    practice: [
      { title: 'CSS Diner', text: "flukeout.github.io/ (CSS Diner) o'yinini oxirigacha o'ynang. Har bosqichda nega aynan shu selektor ishlashini o'z so'zingiz bilan yozib boring." },
      { title: 'Selektor sinov sahifasi', text: "ul ichida ichki ul li bo'lgan menyu yozing va ul li, ul > li, li + li, li:nth-child(odd) har birini turli rangga bo'yab, nima bo'yalganini bashorat qiling, keyin tekshiring." },
    ],
    items: [
      ch("Qaysi harflar qizil bo'ladi?", "B va D", ["A va C", "Faqat B", "A, B, C, D"], "2n — juft tartib raqamlar: 2-chi (B) va 4-chi (D).", '<ul class="menu">\n  <li>A</li>\n  <li class="on">B</li>\n  <li>C</li>\n  <li>D</li>\n</ul>\n\n.menu li:nth-child(2n) { color: red; }'),
      ch(".on + li { color: blue } qaysi elementni bo'yaydi?", "Faqat C", ["C va D", "A", "B"], "+ faqat DARHOL keyingi bitta aka-ukani tanlaydi.", '<ul class="menu">\n  <li>A</li>\n  <li class="on">B</li>\n  <li>C</li>\n  <li>D</li>\n</ul>'),
      ch(".on ~ li { color: blue } qaysi elementlarni bo'yaydi?", "C va D", ["Faqat C", "A va C", "A, C, D"], "~ keyingi BARCHA aka-ukalarni tanlaydi. A esa .on dan oldin turadi.", '<ul class="menu">\n  <li>A</li>\n  <li class="on">B</li>\n  <li>C</li>\n  <li>D</li>\n</ul>'),
      fill(".menu li qoidasiga nechta li elementi mos keladi? (raqam)", '4', ".menu ichidagi HAR QANDAY chuqurlikdagi li: 2 ta tashqi va 2 ta ichki.", null, '<ul class="menu">\n  <li>Bosh sahifa</li>\n  <li>Xizmatlar\n    <ul>\n      <li>Dizayn</li>\n      <li>Kod</li>\n    </ul>\n  </li>\n</ul>'),
      fill(".menu > li qoidasiga nechta li elementi mos keladi? (raqam)", '2', "> faqat to'g'ridan-to'g'ri bolalarni oladi: Bosh sahifa va Xizmatlar.", null, '<ul class="menu">\n  <li>Bosh sahifa</li>\n  <li>Xizmatlar\n    <ul>\n      <li>Dizayn</li>\n      <li>Kod</li>\n    </ul>\n  </li>\n</ul>'),
      fill("a[href$=\".pdf\"] nechta havolani tanlaydi? (raqam)", '2', "$= qiymat OXIRI \".pdf\" bo'lishi kerak. 3-havola \".pdf\" emas \"/pdf\", 4-chisi esa ?v=2 bilan tugaydi.", null, '<a href="/cv.pdf">1</a>\n<a href="https://site.uz/a.pdf">2</a>\n<a href="https://site.uz/pdf">3</a>\n<a href="/cv.pdf?v=2">4</a>'),
      ch("span:first-child qaysi elementni tanlaydi?", "Hech birini", ["B", "C", "B va C"], "Div ning birinchi bolasi p, span emas. :first-child o'z turini emas, o'rnini tekshiradi. span:first-of-type esa B ni tanlardi.", '<div>\n  <p>A</p>\n  <span>B</span>\n  <span>C</span>\n</div>'),
      ch(".a .b (probel bilan) qaysi elementni tanlaydi?", "Faqat Y", ["Faqat X", "X va Y", "Hech birini"], "Probel avlod degani: .a ichidagi .b. X ning o'zi ham .a, ham .b (ichma-ich emas), shuning uchun u .a.b ga mos.", '<div class="a b">X</div>\n<div class="a"><p class="b">Y</p></div>'),
      ch("Quyidagilardan qaysi biri pseudo-ELEMENT?", "::first-line", [":first-child", ":hover", ":focus-visible"], "Pseudo-element elementning bir qismi (ikki ikki nuqta bilan), qolganlari holat yoki o'rin (pseudo-class)."),
      ch("p::before da rang berilgan, lekin hech narsa ko'rinmayapti. Sabab?", "content xususiyati berilmagan", ["::before faqat div da ishlaydi", "Rang xususiyati ::before da ishlamaydi", "p::before o'rniga p:before yozish kerak"], "::before va ::after chizilishi uchun content (hatto content: \"\") shart.", 'p::before {\n  color: red;\n}'),
      fill("Faqat klaviatura bilan fokus olganda ishlaydigan pseudo-class? (ikki nuqta bilan)", ':focus-visible', ":focus-visible sichqoncha bilan bosilganda emas, klaviatura fokusida ishga tushadi.", ['focus-visible']),
    ],
  });

  /* 2 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Cascade va specificity',
    intro: "Qoidalar to'qnashganda kim yutadi: origin, importance, specificity va tartib.",
    theory: {
      analogy: { icon: '⚖️', title: 'Sud tartibi', text: "Ikki qoida bir-biriga zid bo'lsa, \"sud\" bosqichma-bosqich hal qiladi: avval kimning gapi muhimroq (origin va !important), keyin kim aniqroq (specificity), oxirida kim keyin aytgan (tartib). Aniqroq ko'rsatma har doim umumiyidan ustun turadi." },
      sections: [
        { heading: 'Cascade qaror tartibi', flow: ['Origin va importance', 'Layer (@layer)', 'Specificity', 'Source order (tartib)'] },
        { heading: 'Specificity hisoblash', table: { head: ['Qism', 'Misol', "Qiymat (ID-class-element)"], rows: [['Inline style', 'style="..."', 'hammadan kuchli'], ['ID', '#hero', '1-0-0'], ['Class, atribut, pseudo-class', '.card, [type], :hover', '0-1-0'], ['Element, pseudo-element', 'p, ::before', '0-0-1'], ['*, kombinatorlar, :where()', '', '0-0-0']] } },
        { code: { lang: 'css', text: '#nav .item a:hover   /* 1-2-1: 1 id, 2 (class + :hover), 1 element */\ndiv p.note           /* 0-1-2 */\n.box .note           /* 0-2-0  <- yuqoridagidan KUCHLI */' } },
        { bullets: ["Xonalar alohida taqqoslanadi: 0-2-0 ham 0-1-9 dan kuchli (o'nlik hisob emas).", ":is() ichidagi eng yuqori argumentning specificity sini oladi, :where() esa har doim 0.", "Bir xil specificity bo'lsa — keyin yozilgani yutadi.", "!important cascade ni buzadi: u bilan kurashish faqat yana !important bilan mumkin."] },
        { callout: { kind: 'tip', text: "Ziddiyatni !important bilan emas, selektorni soddalashtirish yoki @layer bilan hal qiling." } },
      ],
      recap: ["Tartib: origin/importance, layer, specificity, source order.", "Specificity xonalari alohida taqqoslanadi.", "Atribut va pseudo-class class bilan teng.", ":where() = 0, :is() = eng kuchli argument."],
    },
    defs: [
      ['Cascade', "bir elementga tegishli bir nechta zid qoidadan qaysi biri qo'llanishini hal qilish algoritmi."],
      ['Specificity', "selektorning aniqlik darajasi, 3 xonali (ID, class, element) ball."],
      ['Source order', "bir xil kuchdagi qoidalardan oxirida yozilgani yutadi."],
      ['!important', "e'lonni oddiy qoidalardan ustun qo'yadigan belgi (cascade ni buzadi)."],
    ],
    life: [
      ['🏛️', 'Qonun darajalari', "Konstitutsiya (origin) oddiy qonundan, aniq buyruq (specificity) umumiy yo'riqnomadan ustun. Ikki bir xil kuchdagi buyruqdan keyin chiqqani amal qiladi."],
      ['📦', 'Jo\'natma yozuvi', "Konvertga \"Chilonzor, 9-uy, 45-xonadon\" yozilgan bo'lsa, faqat \"Toshkent\" yozilganidan aniqroq: pochtachi aniqini tanlaydi."],
    ],
    practice: [
      { title: '15 ta specificity mashqi', text: "O'zingizga 15 ta selektor juftligi tuzing (id, class, atribut, :where, :is aralash). Har biri uchun ID-class-element ballni qog'ozda yozib, g'olibni bashorat qiling, keyin DevTools bilan tekshiring." },
      { title: 'Overridden stillar', text: "DevTools'ning Styles panelida chizib tashlangan (overridden) qoidalarni toping va nega yutqazganini specificity yoki tartib bilan tushuntiring." },
    ],
    items: [
      ch("p elementi qaysi rangda bo'ladi?", "Yashil", ["Qizil", "Ko'k", "Qora (standart)"], "#intro (1-0-0) .note (0-1-0) dan ham, p (0-0-1) dan ham kuchli.", '<p id="intro" class="note">Matn</p>\n\np      { color: red; }\n.note  { color: blue; }\n#intro { color: green; }'),
      ch("p.note matni qaysi rangda?", "Ko'k", ["Qizil", "Ikkalasi aralashadi", "Qaror aniq emas"], "div p.note = 0-1-2, .box .note = 0-2-0. Class xonasi 2 > 1, element xonasi hisobga olinmaydi.", '<div class="box"><p class="note">Matn</p></div>\n\ndiv p.note  { color: red; }\n.box .note  { color: blue; }'),
      fill("#nav .item a:hover selektorining specificity si? (ID-class-element, masalan 0-1-2)", '1-2-1', "1 ID, 2 (class .item va pseudo-class :hover), 1 element (a).", ['121', '1,2,1', '(1,2,1)', '1-2-1']),
      ch("Matn qaysi rangda?", "Ko'k", ["Qizil", "Qora", "Rang berilmaydi (ziddiyat)"], "!important inline style dan ham kuchli (oddiy inline e'lon uchun).", '<p style="color: red">Matn</p>\n\np { color: blue !important; }'),
      ch("Hover paytida tugma qaysi fonda bo'ladi?", "Qizil", ["Ko'k", "Hover ishlamaydi", "Aralash rang"], "Ikkalasi ham 0-2-0 (class+class va class+pseudo-class). Teng bo'lsa, keyin yozilgani yutadi.", '<button class="btn primary">OK</button>\n\n.btn.primary { background: blue; }\n.btn:hover   { background: red; }'),
      ch("Input qaysi rangli ramkaga ega?", "Qizil", ["Ko'k", "Ramkasiz", "Qora"], "input[type=\"text\"] = 0-1-1 (atribut class kabi + element), .field = 0-1-0. Birinchisi kuchli.", '<input type="text" class="field">\n\ninput[type="text"] { border: 1px solid red; }\n.field             { border: 1px solid blue; }'),
      ch(":is(#a, .b) selektorining specificity si qancha?", "1-0-0 (eng kuchli argument)", ["0-1-0", "1-1-0", "0-0-0"], ":is() eng yuqori specificity li argumentni oladi, :where() esa doim 0."),
      ch("Quyidagilardan qaysi biri specificity 0-0-0 beradi?", ":where(.card)", ["*.card", "p", ":is(.card)"], ":where() ning o'zi va ichidagisi ham 0. *.card esa 0-1-0, :is(.card) 0-1-0."),
      order("Cascade qaror bosqichlarini tartiblang (birinchi tekshiriladigandan boshlab).", ['Origin va importance', 'Specificity', 'Source order'], "Avval qoida kimdan va qanchalik muhim, keyin selektor aniqligi, oxirida yozilish tartibi."),
      ch("Siz `.title { color: blue }` yozdingiz, lekin sarlavha qizil. Sabab?", "ID li qoida specificity bo'yicha yutyapti", ["Brauzer .title ni qo'llamaydi", "Rang xususiyati faqat p da ishlaydi", "CSS fayl yuklanmagan"], "#card .title = 1-1-0, .title = 0-1-0. !important qo'shishdan ko'ra, qoida tuzilmasini to'g'rilang.", '<div id="card"><h2 class="title">Sarlavha</h2></div>\n\n#card .title { color: red; }'),
      ch("Quyidagi gaplardan qaysi biri TO'G'RI?", "0-2-0 specificity 0-1-9 dan kuchli", ["0-1-9 chunki umumiy ball 10 dan katta", "Ikkalasi teng, tartib hal qiladi", "Element soni ko'p bo'lgani yutadi"], "Xonalar o'nlik hisob emas, chapdan o'ngga alohida taqqoslanadi."),
    ],
  });

  /* 3 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Inheritance va @layer',
    intro: "Meros bo'ladigan xususiyatlar, inherit/initial/unset/revert va cascade layer.",
    theory: {
      analogy: { icon: '👪', title: 'Oilaviy meros', text: "Bola ota-onasidan ba'zi narsalarni (ko'z rangi) meros oladi, boshqalarini (uy-joy) olmaydi. CSS ham shunday: color va font avlodga o'tadi, margin va border esa o'tmaydi. @layer esa katta oiladagi kim kimdan ustun ekanini oldindan kelishib qo'yish usuli." },
      sections: [
        { heading: 'Nima meros bo\'ladi', table: { head: ['Meros bo\'ladi', "Meros bo'lmaydi"], rows: [['color, font-*, line-height, text-align, visibility, cursor', 'margin, padding, border, background, width, height, display']] } },
        { heading: 'Maxsus kalit so\'zlar', table: { head: ['Qiymat', 'Ma\'nosi'], rows: [['inherit', "Ota-onaning hisoblangan qiymatini oladi (meros bo'lmaydigan xususiyatda ham)"], ['initial', "Xususiyatning o'z boshlang'ich qiymati (spetsifikatsiyadagi)"], ['unset', "Meros bo'ladiganda inherit, bo'lmaydiganda initial"], ['revert', "Brauzerning (user-agent) standart stiliga qaytaradi"]] } },
        { heading: '@layer: qoidalarni qatlamlash', code: { lang: 'css', text: '@layer base, components, utilities;   /* tartib shu yerda belgilanadi */\n\n@layer components { .btn { padding: 8px 16px; } }\n@layer utilities  { .p-0 { padding: 0; } }  /* keyingi layer yutadi */' } },
        { bullets: ["Keyingi layer oldingisidan ustun, specificity dan qat'i nazar.", "Layerdan TASHQARIDAGI oddiy qoidalar har qanday layerdagidan ustun.", "!important da tartib TESKARI: birinchi layerdagi important yutadi.", "Layer ichida esa odatdagi specificity va tartib ishlaydi."] },
      ],
      recap: ["color va font meros bo'ladi, box xususiyatlari yo'q.", "unset: meros bo'ladiganda inherit, bo'lmaganda initial.", "Layer tartibi e'lon tartibi bilan belgilanadi, blok tartibi bilan emas.", "Layerlanmagan stil layerdagidan kuchli."],
    },
    defs: [
      ['Inheritance (meros)', "ba'zi xususiyatlar qiymatining avtomatik avlodga o'tishi."],
      ['Hisoblangan qiymat', "cascade va birliklar hal bo'lgandan keyingi yakuniy qiymat; meros shuni uzatadi."],
      ['Cascade layer', "qoidalarni guruhlab, ularning o'zaro ustunligini specificity dan oldin belgilaydigan qatlam (@layer)."],
      ['Unlayered stil', "hech qanday @layer ichida bo'lmagan oddiy stil."],
    ],
    life: [
      ['🧬', 'Genetika', "Ko'z rangi (color) avlodga o'tadi, ota-onaning ish joyi (border) esa yo'q. Biroq bola \"ota-onam kabi bo'lay\" desa (inherit), hatto o'tmaydigan narsani ham oladi."],
      ['🏢', 'Kompaniya ierarxiyasi', "@layer — bo'limlar tartibi: \"Direktor > Menejer > Xodim\". Xodim qanchalik malakali (specificity) bo'lmasin, tartibda past bo'lsa yutqazadi."],
    ],
    practice: [
      { title: 'Layerli reset', text: "@layer reset, base, components, utilities; yozing. Har layerga bittadan qoida qo'yib, utilities dagi qoidaning specificity si past bo'lsa ham yutishini tekshiring." },
      { title: 'Meros xaritasi', text: "div > p > span zanjirida div ga color, border, padding bering. Qaysilari span ga o'tganini DevTools Computed panelidan toping." },
    ],
    items: [
      ch("Quyidagilardan qaysi xususiyat standart bo'yicha MEROS bo'lib o'tadi?", "color", ["margin", "border", "padding"], "Matnga oid xususiyatlar (color, font, line-height) meros bo'ladi, box xususiyatlari esa yo'q."),
      ch("p da nima ko'rinadi?", "Matn qizil, ramka faqat div da", ["Matn va ramka ikkalasi p da ham", "Faqat ramka p da", "Hech narsa"], "color meros bo'ladi, border yo'q.", '<div class="a"><p>X</p></div>\n\n.a { border: 1px solid red; color: red; }'),
      ch("p matni qaysi rangda?", "Qora (color ning boshlang'ich qiymati)", ["Qizil", "Shaffof", "Ota elementning rangi"], "initial ota qiymatga emas, xususiyatning o'z boshlang'ich qiymatiga qaytaradi.", '<div class="a"><p>X</p></div>\n\n.a   { color: red; }\n.a p { color: initial; }'),
      ch("margin: unset qanday ishlaydi?", "initial kabi: margin 0 bo'ladi", ["inherit kabi: ota margin ni oladi", "Hech narsa o'zgarmaydi", "Brauzer standartiga qaytadi"], "unset: xususiyat meros bo'lmasa initial, bo'lsa inherit. margin meros bo'lmaydi."),
      ch("revert qiymati nimaga qaytaradi?", "Brauzerning (user-agent) standart stiliga", ["Xususiyatning boshlang'ich qiymatiga", "Ota qiymatga", "Oldingi qoidadagi qiymatga"], "initial = spetsifikatsiya, revert = brauzer stili (masalan h1 uchun display: block, font-size: 2em)."),
      ch("Matn qaysi rangda?", "Qizil", ["Ko'k", "Layerlar ziddiyatda xato beradi", "Qora"], "Layer tartibi: base < components < utilities. Keyingi layer yutadi, blokning yozilish joyi emas, e'lon tartibi hal qiladi.", '@layer base, components, utilities;\n\n@layer utilities  { .p { color: red; } }\n@layer components { .p { color: blue; } }'),
      ch("Layerdan tashqaridagi oddiy qoida layer ichidagi bilan to'qnashsa, qaysi yutadi?", "Layerdan tashqaridagi (unlayered)", ["Layer ichidagi", "Specificity kuchlisi", "Ikkalasi aralashadi"], "Unlayered stillar har doim layerlardan ustun, specificity hisobga olinmaydi."),
      ch("<p id=\"x\"> qaysi rangda bo'ladi?", "Ko'k", ["Qizil", "Qora", "Xato"], "Layerlar specificity dan oldin tekshiriladi: keyingi layer (b) #x ga ega layer (a) dan ustun, p ning specificity si past bo'lsa ham.", '@layer a, b;\n\n@layer a { #x { color: red; } }\n@layer b { p  { color: blue; } }'),
      ch("!important e'lonlarida layer tartibi qanday?", "Teskari: birinchi layerdagi important yutadi", ["Oddiy qoidalar bilan bir xil: oxirgi yutadi", "Layer hisobga olinmaydi", "Hamma important teng"], "Spetsifikatsiya shunday: important da tartib teskari bo'ladi, shunda asosiy (base) himoya qoidalari buzilmaydi."),
      fill("Layerlarni e'lon qiladigan at-qoida: @____ base, components; (bitta so'z)", 'layer', "@layer qoidasi layer tartibini belgilaydi.", ['layer']),
      ch("Quyidagi gaplardan qaysi biri TO'G'RI?", "inherit meros bo'lmaydigan xususiyatda ham ota qiymatni oladi", ["inherit faqat meros bo'ladigan xususiyatlarda ishlaydi", "initial ota qiymatni oladi", "unset har doim initial beradi"], "border: inherit ham yozish mumkin: ota elementning border ini oladi."),
    ],
  });

  /* 4 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Box model',
    intro: "content, padding, border, margin, box-sizing va margin collapse qoidalari.",
    theory: {
      analogy: { icon: '📦', title: 'Sovg\'a qutisi', text: "Sovg'a (content) yumshoq qog'oz bilan o'ralgan (padding), uni quti devori (border) o'rab turadi va qutilar orasida bo'sh joy (margin) qoldiriladi. Quti hajmi o'zgarsa, javonda joylashuv ham o'zgaradi." },
      sections: [
        { heading: 'To\'rt qatlam', flow: ['content', 'padding', 'border', 'margin'] },
        { heading: 'box-sizing: kengligi qanday hisoblanadi', table: { head: ['Qiymat', 'width nimani bildiradi'], rows: [['content-box (standart)', "FAQAT content. Padding va border ustiga qo'shiladi"], ['border-box', "content + padding + border (margin emas). Hisob oson"]] } },
        { code: { lang: 'css', text: '.a { width: 200px; padding: 20px; border: 5px solid; }\n/* content-box: ko\'rinadigan kenglik = 200 + 2*20 + 2*5 = 250px */\n.b { box-sizing: border-box; width: 200px; padding: 20px; border: 5px solid; }\n/* border-box: kenglik 200px, content = 200 - 40 - 10 = 150px */' } },
        { heading: 'Margin collapse', bullets: ["Ketma-ket block elementlarning vertikal margin lari qo'shilmaydi: kattasi qoladi (30 va 20 bo'lsa 30).", "Ota va birinchi bola orasida padding/border bo'lmasa, bolaning yuqori margin i ota tashqarisiga 'o'tib ketadi'.", "Flex va grid elementlarida margin collapse yo'q.", "Faqat vertikal margin lar collapse bo'ladi."] },
        { callout: { kind: 'info', text: "padding: 10% va margin: 10% foizi ota elementning KENGLIGIdan hisoblanadi, hatto yuqori va past uchun ham." } },
      ],
      recap: ["content-box da padding va border width ga qo'shiladi, border-box da kiradi.", "Vertikal margin lar collapse bo'ladi, gorizontal yo'q.", "margin: 0 auto uchun width kerak.", "outline joy egallamaydi."],
    },
    defs: [
      ['Box model', "har bir elementning content, padding, border va margin dan iborat to'rtburchak model."],
      ['box-sizing', "width/height nimani o'z ichiga olishini belgilaydi."],
      ['Margin collapse', "qo'shni vertikal margin larning qo'shilmay, kattasiga tenglashishi."],
      ['Outline', "border kabi chiziladi, lekin joy egallamaydi va layout ga ta'sir qilmaydi."],
    ],
    life: [
      ['🍱', 'Tushlik qutisi', "Ovqat (content), ichidagi yumshoq qog'oz (padding), qutining devori (border) va stoldagi boshqa qutilar bilan masofa (margin). Quti kengligini \"1 metr\" desangiz, ichidagi ovqat uchun joy nechaligi box-sizing ga bog'liq."],
      ['🧱', 'Devorlar orasidagi tor yo\'lak', "Ikki qo'shni uy 30 va 20 metr hovli qoldirgan bo'lsa, ular orasi 50 emas, 30 metr: bu margin collapse."],
    ],
    practice: [
      { title: 'Margin collapse laboratoriyasi', text: "Ketma-ket ikki p ga margin-bottom: 30px va margin-top: 20px bering va oraliqni ruler bilan o'lchang. Keyin ota ga display: flow-root qo'yib, ota-bola margin collapse yo'qolishini ko'ring." },
      { title: 'box-sizing hisobi', text: "Bir xil width, padding, border li ikki div yasang: biri content-box, biri border-box. DevTools box model diagrammasi bilan hisobingizni tekshiring." },
    ],
    items: [
      fill("Ko'rinadigan kenglik (margin hisobsiz) necha px? (raqam)", '250', "content-box: 200 + 2×20 padding + 2×5 border = 250.", null, '.a {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid;\n  margin: 10px;\n}'),
      fill("Content (ichki) kengligi necha px? (raqam)", '220', "border-box: 300 - 2×30 padding - 2×10 border = 220.", null, '.a {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 30px;\n  border: 10px solid;\n}'),
      fill("Ikki qo'shni p orasidagi vertikal masofa necha px? (raqam)", '30', "Margin lar collapse bo'ladi: kattasi (30) qoladi, 50 emas.", null, 'p.a { margin-bottom: 30px; }\np.b { margin-top: 20px; }\n\n<p class="a">…</p>\n<p class="b">…</p>'),
      ch("40px margin qayerda ko'rinadi?", "Ota elementning tashqarisida: butun ota 40px pastga siljiydi", ["Ota ichida, p ning tepasida", "Hech qayerda: margin yo'qoladi", "Ota va bola orasida ikkiga bo'linadi"], "Ota da padding/border yo'q, shuning uchun bolaning yuqori margin i ota margin i bilan birlashib, ota tashqarisiga chiqadi.", '<div class="parent">\n  <p style="margin-top: 40px">Matn</p>\n</div>\n\n.parent { /* padding va border yo\'q */ }'),
      ch("Qayerda vertikal margin collapse BO'LMAYDI?", "Flex konteyner ichidagi elementlar orasida", ["Ketma-ket p elementlar orasida", "Ota va birinchi bola orasida (padding yo'q bo'lsa)", "Ketma-ket div larning orasida"], "Flex va grid elementlari collapse qilmaydi."),
      fill("Chap margin necha px? (raqam)", '20', "To'rt qiymatdan qisqa yozuv: 3 qiymatda margin: yuqori | chap=o'ng | past.", null, 'div { margin: 10px 20px 30px; }'),
      ch("div { margin: 0 auto } markazlamayapti. Eng ehtimoliy sabab?", "Block element standart bo'yicha to'liq kenglikni egallaydi: width/max-width kerak", ["margin: auto faqat flex da ishlaydi", "auto o'rniga 50% yozish kerak", "div ga display: block berish kerak"], "Kenglik auto bo'lsa, bo'sh joy yo'q: markazlash uchun aniq width yoki max-width kerak."),
      ch("padding: 10% foizi nimadan hisoblanadi?", "Ota elementning KENGLIGIdan (yuqori va past uchun ham)", ["Elementning o'z balandligidan", "Ota elementning balandligidan", "Ekran kengligidan"], "Barcha foizli padding va margin lar containing block ning kengligiga nisbatan."),
      ch("Qaysi biri atrofdagi elementlarning joylashuviga umuman ta'sir qilmaydi?", "outline", ["border", "padding", "margin"], "outline joy egallamaydi va faqat ustidan chiziladi."),
      fill("Elementning umumiy kengligi necha px? (raqam, border yo'q)", '280', "content: 50% × 400 = 200. Padding: 10% × 400 (ota kengligi) = 40 har tomonda. Jami 200 + 80 = 280.", null, '.parent { width: 400px; }\n.child  { width: 50%; padding: 10%; }   /* content-box */'),
      order("Box model qatlamlarini ichkaridan tashqariga tartiblang.", ['content', 'padding', 'border', 'margin'], "Markazda content, uni padding, keyin border, eng tashqarida margin o'rab turadi."),
    ],
  });

  /* 5 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Birliklar va funksiyalar',
    intro: "px, rem, em, %, vw/vh, dvh, ch va calc(), min(), max(), clamp().",
    theory: {
      analogy: { icon: '📏', title: 'O\'lchov vositalari', text: "Metr aniq o'lchaydi (px), \"ko'ylak bo'yi\" esa kimga kiyilishiga qarab o'zgaradi (em, rem). Foydalanuvchi ko'zi zaif bo'lsa, shrift katta qilib qo'yadi. O'lchovingiz shunga moslashsa, dizayn hammaga mos tushadi." },
      sections: [
        { table: { head: ['Birlik', 'Nimaga nisbatan', 'Qachon'], rows: [['px', "Mutlaq piksel", "Ramka, soya, ingichka chiziqlar"], ['em', "Elementning O'Z font-size i (font-size da esa ota nikiga)", "Komponent ichidagi masofalar"], ['rem', "html (ildiz) font-size i", "Shrift va masofalar, ichma-ichda ko'paymaydi"], ['%', "Ota xususiyatiga (xususiyatga qarab)", "Kenglik, padding"], ['vw / vh', "Ko'rinish oynasi kengligi / balandligi", "To'liq ekran bloklari"], ['dvh', "Dinamik oyna balandligi (mobil panel hisobga olinadi)", "Mobilda to'liq ekran"], ['ch', "'0' belgisining kengligi", "Matn qator uzunligi (max-width: 65ch)"]] } },
        { heading: 'Funksiyalar', code: { lang: 'css', text: 'width: calc(100% - 2rem);           /* turli birliklarni aralashtirish */\nwidth: min(50%, 300px);             /* ikkisidan KICHIGI */\nwidth: max(50%, 300px);             /* ikkisidan KATTASI */\nfont-size: clamp(1rem, 2.5vw, 2rem); /* min, ideal, max */' } },
        { heading: 'line-height tuzog\'i', text: "line-height: 1.5 (birliksiz) har bir avlodda o'z font-size iga ko'paytiriladi. line-height: 150% esa ota elementda hisoblanib, tayyor piksel qiymati avlodga meros bo'ladi: katta sarlavha torlashib qoladi." },
        { callout: { kind: 'warn', text: "100vh mobil brauzerda manzil paneli ko'ringanda pastki qismni kesib yuboradi. 100dvh bu muammoni hal qiladi." } },
      ],
      recap: ["rem ildizga, em joriy (yoki ota) font-size ga bog'liq.", "clamp(min, ideal, max) — o'rtadagi qiymatni chegaralaydi.", "Birliksiz line-height avlodda qayta hisoblanadi.", "rem foydalanuvchi shrift sozlamasiga moslashadi, px yo'q."],
    },
    defs: [
      ['Nisbiy birlik', "boshqa qiymatga (shrift, ota, oyna) nisbatan hisoblanadigan birlik."],
      ['Viewport', "brauzerning ko'rinadigan oynasi; vw va vh shunga nisbatan."],
      ['calc()', "turli birliklarni aralashtirib hisoblaydigan CSS funksiyasi."],
      ['clamp()', "qiymatni minimal va maksimal oralig'ida ushlab turuvchi funksiya."],
    ],
    life: [
      ['🧥', 'Kiyim o\'lchami', "px — \"48-o'lcham\" (mutlaq), em/rem — \"egasi qanday bo'lsa, shunga mos\". Bobongiz uchun kattaroq shrift kerak bo'lsa, rem ishlatgan sayt avtomatik moslashadi."],
      ['🛗', 'Lift sig\'imi', "clamp — liftning yuk sig'imi: kamida 1 kishi, ideal 8 kishi, ko'pi bilan 10. Qancha kishi kirmasin, qiymat shu oralikda qoladi."],
    ],
    practice: [
      { title: 'Fluid typography shkalasi', text: "h1 uchun clamp(1.75rem, 1rem + 3vw, 3rem) yozing, brauzer oynasini toraytirib-kengaytirib, shrift qaysi nuqtalarda qotib qolishini kuzating." },
      { title: 'Brauzer shriftini kattalashtirish', text: "Brauzer sozlamalarida shrift o'lchamini 'Katta' qiling. Qaysi elementlar (rem) kattalashdi, qaysi biri (px) qotib qoldi?" },
    ],
    items: [
      fill("b ning font-size i necha px? (raqam)", '30', "em font-size da OTA elementning o'lchamiga ko'paytiriladi: 20 × 1.5 = 30.", null, '<div class="a"><span class="b">X</span></div>\n\nhtml { font-size: 16px; }\n.a   { font-size: 20px; }\n.a .b { font-size: 1.5em; }'),
      fill("p ning padding i necha px? (raqam)", '30', "p ning font-size i 2rem = 20px (html 10px). padding da em o'z font-size ga bog'liq: 1.5 × 20 = 30.", null, 'html { font-size: 10px; }\np    { font-size: 2rem; padding: 1.5em; }'),
      fill("Element kengligi necha px? (raqam, ota 800px kenglikda, html 16px)", '768', "100% = 800px, 2rem = 32px: 800 - 32 = 768.", null, '.child { width: calc(100% - 2rem); }'),
      fill("Oyna kengligi 1000px bo'lsa, font-size necha px? (raqam)", '25', "2.5vw = 25px; 16px (1rem) va 32px (2rem) oralig'ida, shuning uchun 25.", null, 'font-size: clamp(1rem, 2.5vw, 2rem);   /* html 16px */'),
      fill("Oyna kengligi 400px bo'lsa, font-size necha px? (raqam)", '16', "2.5vw = 10px, lekin minimal 1rem = 16px: clamp 16 ni oladi.", null, 'font-size: clamp(1rem, 2.5vw, 2rem);   /* html 16px */'),
      fill("Ota 500px kenglikda. Element kengligi necha px? (raqam)", '250', "min() ikkisidan kichigini oladi: 50% = 250, 300px dan kichik.", null, '.child { width: min(50%, 300px); }'),
      ch("100vh mobilda nega muammo tug'diradi?", "Manzil paneli ko'ringanda pastki qism kesilishi mumkin; yechim 100dvh", ["vh faqat desktopda ishlaydi", "vh piksel emas foiz, shuning uchun noaniq", "100vh sahifani ikki barobar uzaytiradi"], "vh brauzer panelsiz eng katta balandlikni oladi, dvh esa joriy ko'rinadigan balandlikni."),
      ch("max-width: 65ch nimani bildiradi?", "Taxminan 65 ta belgi kengligi (shriftga bog'liq)", ["65 ta piksel", "Ota kengligining 65 foizi", "65 ta so'z"], "ch — shriftdagi '0' belgisining kengligi. O'qish uchun qulay qator uzunligi."),
      fill("h1 ning line-height i necha px bo'ladi? (raqam)", '24', "150% ota (body) da hisoblanadi: 16 × 1.5 = 24px va tayyor piksel sifatida meros bo'ladi, 40px h1 uchun juda tor. Birliksiz 1.5 bo'lsa 60px bo'lardi.", null, 'body { font-size: 16px; line-height: 150%; }\nh1   { font-size: 40px; }'),
      fill("p ning margin-top i necha px? (raqam)", '20', "margin da em ELEMENTNING o'z font-size iga ko'paytiriladi: 2 × 10 = 20.", null, '.a   { font-size: 20px; }\n.a p { font-size: 10px; margin-top: 2em; }'),
      ch("Nega ichma-ich komponentlarda rem em dan xavfsizroq?", "rem faqat html font-size iga bog'liq, ichma-ichda ko'paymaydi", ["rem em dan tezroq hisoblanadi", "em faqat pikselga aylanadi", "rem faqat shrift uchun ishlaydi"], "em ichma-ich bo'lganda ketma-ket ko'payib ketadi (1.2 × 1.2 × 1.2 ...)."),
    ],
  });

  /* 6 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Display va normal flow',
    intro: "block, inline, inline-block, flow-root va Block Formatting Context.",
    theory: {
      analogy: { icon: '📄', title: 'Qog\'ozga yozish', text: "Oddiy qog'ozda matn chapdan o'ngga, qatordan qatorga yoziladi: bu normal flow. Block — alohida abzas, inline — qator ichidagi so'z. Float va position elementni shu tartibdan 'chiqarib' olishi mumkin." },
      sections: [
        { table: { head: ['display', 'Yangi qatordan boshlanadi', 'width/height qabul qiladi'], rows: [['block', 'Ha, to\'liq kenglik', 'Ha'], ['inline', "Yo'q, matn ichida", "Yo'q (faqat gorizontal margin/padding aniq)"], ['inline-block', "Yo'q, matn ichida", 'Ha'], ['none', "Umuman yo'q", '—'], ['flow-root', "Block, yangi BFC yaratadi", 'Ha'], ['contents', "Elementning o'zi yo'qoladi, bolalari ota layout iga qo'shiladi", '—']] } },
        { heading: 'Yashirish usullari', table: { head: ['Usul', 'Joy egallaydimi', 'Bosish/screen reader'], rows: [['display: none', "Yo'q", "Ikkalasi ham yo'q"], ['visibility: hidden', 'Ha', "Ikkalasi ham yo'q"], ['opacity: 0', 'Ha', "Bosish va screen reader BOR"]] } },
        { heading: 'Block Formatting Context (BFC)', bullets: ["BFC — ichidagi block lar o'ziga xos qoidalar bilan joylashadigan 'izolyatsiyalangan' zona.", "Yangi BFC yaratadi: float, overflow (visible dan boshqa), display: flow-root, position: absolute/fixed, flex va grid elementlari.", "position: relative BFC yaratmaydi.", "BFC ichidagi float lar ota balandligiga kiradi va margin lar tashqariga collapse bo'lmaydi."] },
        { code: { lang: 'css', text: '.wrap { display: flow-root; }  /* ichidagi float bolalar balandlikni "ushlab turadi" */\nimg   { display: block; }      /* inline rasm ostidagi bo\'sh joyni yo\'qotadi */' } },
      ],
      recap: ["block qatorni to'liq oladi, inline matn kabi oqadi, inline-block ikkalasini birlashtiradi.", "visibility: hidden joyni saqlaydi, display: none yo'q.", "float ota balandligiga kirmaydi: flow-root yechadi.", "Inline rasm ostida bo'shliq qoladi (baseline)."],
    },
    defs: [
      ['Normal flow', "elementlarning hech qanday maxsus joylashuvsiz, block lar tepadan pastga, inline lar chapdan o'ngga oqishi."],
      ['Block element', "yangi qatordan boshlanib, mavjud kenglikni to'liq egallaydigan element."],
      ['Inline element', "matn kabi qator ichida oqadigan, width/height qabul qilmaydigan element."],
      ['BFC', "ichidagi elementlar tashqaridan mustaqil joylashadigan layout konteksti."],
    ],
    life: [
      ['📰', 'Gazeta ustunlari', "Float — gazetada rasm ustun chetiga qo'yilib, matn uni aylanib o'tishi. Ota (maqola) balandligi esa faqat matnga qarab hisoblansa, rasm 'ostidan chiqib ketadi': flow-root maqolaga rasmni ham hisobga olishni buyuradi."],
      ['🚪', 'Mehmonxona nomeri', "display: none — nomer umuman yo'q. visibility: hidden — nomer bor, lekin yopiq va kirib bo'lmaydi. opacity: 0 — nomer shaffof shishali: ko'rinmaydi, lekin eshigini ochish mumkin."],
    ],
    practice: [
      { title: 'Float va flow-root', text: "Ota div ga ramka bering, ichiga float: left bolalar joylang: ota qisqarib qolganini ko'ring. Keyin ota ga display: flow-root qo'shing." },
      { title: 'Rasm ostidagi bo\'shliq', text: "Div ichiga rasm qo'yib, div balandligini DevTools da o'lchang. Rasmga display: block bering va farqni toping." },
    ],
    items: [
      ch("Natija qanday?", "width va height e'tiborga olinmaydi; span matn o'lchamida qoladi", ["Span 200×50 bo'ladi", "Faqat width ishlaydi", "Faqat height ishlaydi"], "inline elementda width va height ta'sir qilmaydi. inline-block yoki block kerak.", 'span {\n  width: 200px;\n  height: 50px;\n  background: red;\n}'),
      ch("Ketma-ket yozilgan uchta inline-block div orasida nega bo'shliq paydo bo'ladi?", "HTML dagi probel/yangi qator matn kabi chiziladi", ["Brauzer avtomatik margin qo'shadi", "inline-block ning o'zida 4px margin bor", "Bu faqat Safari xatosi"], "Inline-level elementlar orasidagi probel belgi sifatida o'lchanadi. Flex yoki font-size: 0 yechadi."),
      ch("Qaysi usul elementni ko'rinmas qiladi, joyini saqlaydi va screen reader ham o'qimaydi?", "visibility: hidden", ["display: none", "opacity: 0", "height: 0"], "display: none joyni ham yo'qotadi, opacity: 0 esa ko'rinmas, lekin bosiladi va o'qiladi."),
      ch("Ota (.wrap) balandligi qanday?", "Faqat ramka qalinligi (taxminan 2px): float bola oqimdan chiqqan", ["100px", "102px", "Bolaning balandligi + ramka"], "Float elementlar ota balandligiga hisoblanmaydi.", '<div class="wrap"><div class="col"></div></div>\n\n.wrap { border: 1px solid; }\n.col  { float: left; height: 100px; }'),
      fill("Shu muammoni yechish uchun .wrap ga qanday display qiymati berasiz? (bitta so'z, defis bilan)", 'flow-root', "display: flow-root yangi BFC yaratadi va float larni ota balandligiga qo'shadi.", ['flow-root', 'flowroot']),
      ch("Quyidagilardan qaysi biri YANGI BFC yaratmaydi?", "position: relative", ["overflow: hidden", "display: flow-root", "float: left"], "relative element oqimdan chiqmaydi va BFC yaratmaydi."),
      ch("display: contents nima qiladi?", "Elementning o'z box i yo'qoladi, bolalari ota layout iga qo'shiladi", ["Element ko'rinmas bo'ladi, bolalari ham", "Element inline ga aylanadi", "Elementni ikki ustunga bo'ladi"], "Layout uchun element 'shaffof' bo'ladi: bolalari uning o'rniga ota ning flex/grid bolasi kabi ishlaydi."),
      ch("clear: both nima qiladi?", "Element ikkala tomondagi float lardan pastga tushadi", ["Float larni o'chiradi", "Elementni float qiladi", "Ota elementni tozalaydi"], "clear elementni float lardan keyin boshlanishga majbur qiladi."),
      ch("Div balandligi rasmdan 4-5 px ortiq. Sabab?", "img inline: baseline ostida matn tagi (descender) uchun bo'sh joy qoladi; display: block yechadi", ["img da avtomatik margin bor", "Div da yashirin padding bor", "Brauzer rasmni kattalashtiradi"], "Inline elementlar qator (line box) ichida, baseline bo'yicha joylashadi.", '<div><img src="a.jpg" height="100"></div>'),
      fill("Matn qatorida turadi, lekin width/height qabul qiladi. display: ______ (bitta so'z, defis bilan)", 'inline-block', "inline-block ikkala xususiyatni birlashtiradi.", ['inline-block', 'inlineblock']),
      ch("HTML hidden atributi nima qiladi?", "Brauzer stilida display: none beradi; sizning display qoidangiz uni bekor qilishi mumkin", ["Elementni DOM dan o'chiradi", "Faqat screen reader dan yashiradi", "visibility: hidden beradi"], "hidden — brauzerning (user-agent) display: none qoidasi. .x { display: flex } uni bosib ketadi."),
    ],
  });

  /* 7 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Ranglar va fon',
    intro: "hex, rgb, hsl, oklch, color-mix(), gradient va background qatlamlari.",
    theory: {
      analogy: { icon: '🎨', title: 'Rassom palitrasi', text: "Rassom ranglarni aralashtirib, soya qo'shib, qatlam-qatlam bo'yaydi. CSS ham shunday: rangni turli yo'l bilan yozish mumkin (hex, hsl, oklch), ranglarni aralashtirish mumkin (color-mix) va fon ko'p qatlamdan iborat bo'lishi mumkin." },
      sections: [
        { heading: 'Rang yozuvlari', table: { head: ['Format', 'Misol', 'Eslatma'], rows: [['hex', '#336699, #369, #33669980', "3 raqamli qisqartma, 8 raqamli — alfa bilan"], ['rgb', 'rgb(51 102 153 / 50%)', 'Slash dan keyin shaffoflik'], ['hsl', 'hsl(210 50% 40%)', 'Hue (0-360), to\'yinganlik, yorqinlik'], ['oklch', 'oklch(60% 0.15 250)', "Idrokka teng yorqinlik; zamonaviy"], ['color-mix', 'color-mix(in srgb, red 50%, blue)', 'Ikki rangni aralashtiradi']] } },
        { heading: 'Gradient va fon qatlamlari', code: { lang: 'css', text: 'background:\n  linear-gradient(to right, rgb(0 0 0 / .5), transparent),  /* ENG TEPADA */\n  url(hero.jpg) center / cover no-repeat,\n  #1f2937;                                               /* eng pastda */\n\n.hard { background: linear-gradient(red 0 50%, blue 50% 100%); } /* qattiq chegara */' } },
        { bullets: ["background: shorthand yozilsa, hamma background-* xususiyatlari qayta tiklanadi: oldingi background-image yo'qoladi.", "cover rasmni to'ldirib kesadi, contain butunlay sig'dirib bo'sh joy qoldiradi.", "currentColor — joriy color qiymati: border: 2px solid currentColor.", "opacity butun elementni (bolalari bilan) shaffof qiladi; faqat fon uchun rgb(... / .5)."] },
        { callout: { kind: 'tip', text: "Oddiy matn uchun WCAG AA minimal kontrast nisbati 4.5:1, katta matn uchun 3:1." } },
      ],
      recap: ["Qisqa hex: #336699 = #369.", "Birinchi yozilgan background qatlami eng tepada turadi.", "background shorthand oldingi qatlamlarni qayta o'rnatadi.", "opacity bolalariga ham ta'sir qiladi, rgb alfa faqat o'ziga."],
    },
    defs: [
      ['Alfa kanal', "rangning shaffofligi (0 butunlay shaffof, 1 to'liq ko'rinadigan)."],
      ['HSL', "rangni tus (hue), to'yinganlik va yorqinlik bilan beruvchi model."],
      ['oklch', "inson ko'ziga mos bir tekis yorqinlikka ega zamonaviy rang modeli."],
      ['Gradient', "bir rangdan boshqasiga silliq o'tish; CSS da background-image qiymati."],
    ],
    life: [
      ['🧁', 'Tort qatlamlari', "Birinchi yozilgan fon qatlami — tortning eng yuqori krem qatlami: u ostidagi biskvitni yopib turadi."],
      ['🪟', 'Rangli shisha', "opacity butun derazani (ramka va shisha) shaffof qiladi, rgb alfa esa faqat shishani. Ramka qora bo'lib qolsin desangiz, rgb alfa ishlating."],
    ],
    practice: [
      { title: 'Gradient kartalar to\'plami', text: "6 ta karta yasang: har biri linear, radial va conic gradient dan birini ishlatsin, ustiga yarim shaffof qatlam qo'ying." },
      { title: 'Kontrast tekshiruvi', text: "DevTools ning Color picker ida kontrast nisbatini ko'rib, AA dan o'tmagan rang juftlarini to'g'rilang." },
    ],
    items: [
      fill("#336699 ning qisqartirilgan shakli? (# bilan)", '#369', "Har bir juft bir xil raqamdan iborat bo'lsa, qisqartiriladi: 33 → 3, 66 → 6, 99 → 9.", ['369']),
      ch("hsl(240 100% 50%) qaysi rang?", "Ko'k", ["Qizil", "Yashil", "Sariq"], "Hue 0 qizil, 120 yashil, 240 ko'k."),
      ch("Qizil qayerda joylashadi?", "Chap tomonda: gradient chapdan o'ngga qizildan ko'kka o'tadi", ["O'ng tomonda", "Tepada", "Pastda"], "to right boshlanishi chapda, birinchi rang shu yerda.", '.box { background: linear-gradient(to right, red, blue); }'),
      ch("Bu gradient qanday ko'rinadi?", "Yuqori yarmi qizil, pastki yarmi ko'k, o'tishsiz (qattiq chegara)", ["Qizildan ko'kka silliq o'tish", "Faqat qizil", "Faqat ko'k"], "Ikkala rang ham 50% da to'xtaydi: o'tish zonasi nol.", '.box { background: linear-gradient(red 0 50%, blue 50% 100%); }'),
      ch("Qaysi rasm eng tepada ko'rinadi?", "a.png", ["b.png", "Oq rang", "Hammasi aralashadi"], "Birinchi ko'rsatilgan qatlam eng yuqorida joylashadi.", '.box { background: url(a.png), url(b.png), #fff; }'),
      ch("Element fonida rasm yo'qolib qoldi. Sabab?", "background shorthand oldingi background-image ni qayta o'rnatdi", ["#eee rasmdan kuchli", "background-image faqat bir marta yoziladi", "Brauzer xatosi"], "Shorthand ichida ko'rsatilmagan qiymatlar boshlang'ichga qaytadi.", '.a { background-image: url(x.png); }\n.a { background: #eee; }'),
      ch("border qaysi rangda?", "Qizil", ["Qora", "Ko'k", "Shaffof"], "currentColor — shu elementning joriy color qiymati.", '.btn {\n  color: red;\n  border: 2px solid currentColor;\n}'),
      ch("Faqat FONNI yarim shaffof qilish (matn aniq qolishi) uchun qaysi to'g'ri?", "background: rgb(0 0 0 / 0.5)", ["opacity: 0.5", "filter: opacity(.5) hamma narsaga", "visibility: 0.5"], "opacity element va bolalarini birga shaffof qiladi."),
      ch("background-size: cover nima qiladi?", "Rasmni elementni to'liq qoplaguncha kattalashtiradi, ortig'i kesiladi", ["Rasmni butunlay sig'dirib, bo'sh joy qoldiradi", "Rasmni takrorlaydi", "Rasmni cho'zib buzadi"], "contain esa butunlay sig'dirib bo'sh joy qoldirishi mumkin."),
      ch("color-mix(in srgb, red 50%, blue) natijasi?", "Binafsha (qizil va ko'k teng aralashmasi)", ["To'q qizil", "Yashil", "Kulrang (#808080)"], "50/50 aralashma #800080 ga yaqin."),
      fill("Oddiy matn uchun WCAG AA minimal kontrast nisbati (X:1)? (raqam)", '4.5', "Katta matn uchun 3:1, oddiy matn uchun 4.5:1.", ['4,5', '4.5:1']),
      ch("oklch ning hsl dan afzalligi nimada?", "Bir xil yorqinlikdagi ranglar ko'zga ham bir xil yorqin ko'rinadi", ["Faqat eski brauzerlarda ishlaydi", "Faqat shaffoflikni qo'llaydi", "Fayl hajmini kamaytiradi"], "hsl da bir xil L ga ega sariq va ko'k yorqinligi juda farq qiladi, oklch da yo'q."),
    ],
  });

  /* 8 ------------------------------------------------------------------------------------------ */
  lesson({
    title: 'Tipografiya',
    intro: "font stack, @font-face, font-display, line-height va variable fontlar.",
    theory: {
      analogy: { icon: '✒️', title: 'Bosmaxona', text: "Yaxshi kitobda shrift tanlangan, qatorlar orasi qulay, qator uzunligi ko'zni charchatmaydi. Agar sevimli shrift bosmaxonada topilmasa, zaxira shrift ishlatiladi: font stack aynan shu zaxira tartib." },
      sections: [
        { code: { lang: 'css', text: 'body {\n  font-family: "Inter", system-ui, -apple-system, sans-serif; /* oxirida generic oila */\n  font: 400 1rem/1.6 "Inter", sans-serif; /* shorthand: weight size/line-height family */\n}\n\n@font-face {\n  font-family: "Inter";\n  src: url(/fonts/inter.woff2) format("woff2");\n  font-weight: 100 900;   /* variable font: oraliq */\n  font-display: swap;\n}' } },
        { heading: 'font-display', table: { head: ['Qiymat', 'Xatti-harakat'], rows: [['block', "Shrift kelguncha matn ko'rinmaydi (FOIT)"], ['swap', "Darhol zaxira shrift, keyin almashadi (FOUT)"], ['optional', "Tez yuklansa ishlatiladi, aks holda umuman almashmaydi"]] } },
        { heading: 'Matn bilan ishlash', bullets: ["text-overflow: ellipsis ishlashi uchun overflow: hidden va white-space: nowrap ham kerak.", "white-space: pre-wrap yangi qator va ketma-ket probellarni saqlaydi, kerak bo'lsa o'raydi.", "hyphens: auto ishlashi uchun html da lang atributi bo'lishi shart.", "text-wrap: balance sarlavha qatorlarini teng taqsimlaydi.", "Qator uzunligi 45-75 belgi (max-width: 65ch) o'qishga qulay."] },
        { callout: { kind: 'info', text: "system-ui stack tez, chunki qo'shimcha shrift yuklanmaydi: qurilmaning o'z shrifti ishlatiladi." } },
      ],
      recap: ["Font stack oxirida generic oila (sans-serif) bo'lsin.", "font-display: swap FOIT ni oldini oladi.", "Ellipsis uchun uchta xususiyat kerak.", "hyphens: auto lang atributisiz ishlamaydi."],
    },
    defs: [
      ['Font stack', "birinchi mavjud shriftni tanlaydigan font-family ro'yxati."],
      ['Variable font', "bitta fayl ichida og'irlik/kenglik oralig'ini saqlaydigan shrift."],
      ['FOIT / FOUT', "shrift yuklanguncha matn ko'rinmasligi / zaxira shrift bilan ko'rinib, keyin almashishi."],
      ['line-height', "qatorlar orasidagi vertikal masofa."],
    ],
    life: [
      ['🧳', 'Zaxira sumka', "Safarga chiqayotganda asosiy sumka yo'q bo'lsa, zaxirasini olasiz. Font stack shu: Inter bo'lmasa system-ui, u ham bo'lmasa sans-serif."],
      ['📖', 'Kitob qatori', "Juda uzun qator ko'zni adashtiradi: gazeta ustunlari tor, chunki ko'z qatordan qatorga o'tishi osonroq."],
    ],
    practice: [
      { title: 'Tipografiya tizimi', text: "html da font-size: 100%, h1-h4 uchun clamp() lik shkala va body uchun line-height: 1.6 yozing; matn bloklari uchun max-width: 65ch bering." },
      { title: 'FOUT ni kuzatish', text: "DevTools Network da throttling ni Slow 3G qilib, font-display: block va swap bilan sahifa yuklanishini solishtiring." },
    ],
    items: [
      ch("Nega font stack oxirida generic oila (sans-serif) yoziladi?", "Hech bir nomlangan shrift topilmasa ham brauzer mos oilani tanlay oladi", ["Fayl hajmini kamaytirish uchun", "Shrift yuklanishini tezlatish uchun", "Brauzer shuni talab qiladi, aks holda xato beradi"], "Generic oila oxirgi zaxira bo'lib, matn har holda o'qiladigan shriftda chiqadi."),
      ch("Yuklanguncha matn ko'rinmay turishi (FOIT) ni oldini olish uchun qaysi?", "font-display: swap", ["font-display: block", "font-display: none", "font-weight: swap"], "swap darhol zaxira shriftda ko'rsatadi va keyin almashtiradi."),
      fill("h1 ning line-height i necha px? (raqam)", '48', "Birliksiz 1.6 har elementda o'z font-size iga ko'paytiriladi: 30 × 1.6 = 48.", null, 'body { line-height: 1.6; }\nh1   { font-size: 30px; }'),
      ch("text-overflow: ellipsis ishlamayapti. Sabab?", "overflow: hidden va white-space: nowrap ham kerak", ["ellipsis faqat div da ishlaydi", "Faqat font-size ga bog'liq", "Shrift yuklanmagan"], "Uch xususiyat birga ishlaydi: nowrap qatorni uzmaydi, hidden ortig'ini kesadi, ellipsis ... qo'yadi.", '.t { text-overflow: ellipsis; }'),
      ch("font: 700 16px/1.4 serif da 1.4 nima?", "line-height", ["letter-spacing", "font-size ning ikkinchi qiymati", "font-weight"], "font shorthand: weight size/line-height family."),
      ch("text-wrap: balance qaysi elementlar uchun ko'proq mos?", "Qisqa sarlavhalar: qatorlarni teng taqsimlaydi", ["Uzun maqola matni", "Jadval kataklari", "Kod bloklari"], "Balance qisqa matn (taxminan 6 qatorgacha) uchun mo'ljallangan."),
      ch("Matndagi yangi qator va ketma-ket probellarni saqlab, kerak bo'lsa o'raydigan qiymat?", "white-space: pre-wrap", ["white-space: pre", "white-space: nowrap", "white-space: pre-line"], "pre o'ramaydi, pre-line probellarni birlashtiradi, nowrap hamma narsani bir qatorga tiqadi."),
      ch("hyphens: auto ishlamayapti. Eng ehtimoliy sabab?", "html da lang atributi yo'q: brauzer tilni bilmasdan bo'g'in qoidasini topa olmaydi", ["hyphens faqat Safari da ishlaydi", "overflow-wrap bilan birga ishlatib bo'lmaydi", "font-size juda kichik"], "Brauzer so'z bo'g'inlarini til lug'ati bo'yicha ajratadi: <html lang=\"uz\"> kerak."),
      ch("Variable shrift afzalligi nima?", "Bitta fayl ichida og'irliklar oralig'i bor (100-900), alohida fayl kerak emas", ["Faqat kursivda ishlaydi", "Har doim kichikroq hajm", "Brauzerning o'z shrifti"], "font-weight: 100 900 oralig'i @font-face da e'lon qilinadi."),
      fill("@font-face ichida shrift fayli manzilini beruvchi xususiyat? (bitta so'z)", 'src', "src: url(...) format(...).", ['src']),
      ch("Nega system-ui stack tez yuklanadi?", "Hech qanday shrift fayli yuklanmaydi, qurilmaning o'z shrifti ishlatiladi", ["U siqilgan shrift", "Brauzer uni oldindan keshlagan", "U faqat lotin harflarini o'z ichiga oladi"], "Tarmoq so'rovi yo'q, FOIT/FOUT yo'q."),
    ],
  });
};
