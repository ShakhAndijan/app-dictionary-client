// CSS, lessons 9-16: Flexbox, Grid, Positioning, Stacking, Overflow.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 9 */
  lesson({
    title: 'Flexbox 1: asoslar',
    intro: "Bosh va ko'ndalang o'q, justify-content, align-items, gap va wrap.",
    theory: {
      analogy: { icon: '🚃', title: 'Poyezd vagonlari', text: "Vagonlar bir yo'nalishda (bosh o'q) ketma-ket turadi. Qo'shimcha joy bo'lsa, vagonlarni yo'l bo'ylab taqsimlash (justify-content), perronga nisbatan joylash esa (align-items) boshqa o'q bo'yicha bajariladi." },
      sections: [
        { heading: 'Ikkita o\'q', table: { head: ['Xususiyat', 'Qaysi o\'q bo\'yicha'], rows: [['justify-content', "BOSH o'q (flex-direction yo'nalishi)"], ['align-items', "KO'NDALANG o'q (bitta qator ichida)"], ['align-content', "Qatorlarning o'zaro joylashuvi (faqat wrap bo'lib, ko'p qator bo'lsa)"], ['flex-direction: column', "Bosh o'q vertikalga aylanadi, shuning uchun justify va align o'rin almashadi"]] } },
        { code: { lang: 'css', text: '.row {\n  display: flex;\n  justify-content: space-between; /* bosh o\'q bo\'ylab */\n  align-items: center;            /* ko\'ndalang o\'q bo\'ylab */\n  gap: 16px;                      /* elementlar orasidagi masofa */\n  flex-wrap: wrap;                /* sig\'masa, yangi qatorga */\n}' } },
        { bullets: ["Standart flex-direction: row, align-items: stretch (bolalar balandligi teng cho'ziladi).", "gap faqat elementlar ORASIDA masofa beradi (chetlarda yo'q).", "Flex element ichidagi margin: auto bo'sh joyni o'ziga oladi (masalan, bitta elementni o'ngga surish uchun margin-left: auto).", "Flex konteyner bolalari avtomatik 'blockified' bo'ladi."] },
      ],
      recap: ["justify — bosh o'q, align — ko'ndalang o'q.", "column bo'lsa o'qlar almashadi.", "align-content faqat ko'p qatorli (wrap) holatda ishlaydi.", "margin-left: auto bo'sh joyni yutadi."],
    },
    defs: [
      ['Flex konteyner', "display: flex berilgan ota element."],
      ['Bosh o\'q (main axis)', "flex-direction belgilagan, elementlar joylashadigan asosiy yo'nalish."],
      ['Ko\'ndalang o\'q (cross axis)', "bosh o'qqa perpendikulyar yo'nalish."],
      ['gap', "grid/flex elementlari orasidagi bo'sh joy."],
    ],
    life: [
      ['🛣️', "Yo'l va bo'laklar", "Avtobuslar bir yo'lak bo'ylab ketadi (bosh o'q). Ularni yo'lakning boshiga, o'rtasiga yoki teng oraliqda joylash — justify-content. Yo'lak kengligi bo'yicha chap yoki o'ng tomonga qisish — align-items."],
      ['🧰', 'Asboblar qutisi', "margin-left: auto — qutidagi bitta asbobni chetga surib qo'yishga o'xshaydi: bo'sh joy shu elementdan oldin to'planadi."],
    ],
    practice: [
      { title: 'Flexbox Froggy', text: "flexboxfroggy.com ning barcha 24 darajasini o'ynang." },
      { title: 'Navbar yasash', text: "Chapda logo, o'rtada havolalar, o'ngda tugma bo'lgan navbar ni faqat flex va margin: auto bilan yozing." },
    ],
    items: [
      ch("Elementlar qanday joylashadi?", "Birinchi va oxirgisi chetlarga, o'rtadagisi o'rtaga teng oraliqda", ["Hammasi chap tomonda", "Hammasi markazda", "Hammasi o'ngda"], "space-between bo'sh joyni elementlar ORASIGA teng taqsimlaydi, chetlarda bo'sh joy yo'q.", '.row { display: flex; justify-content: space-between; }\n/* 3 ta element */'),
      ch("Qaysi biri elementlarni vertikal (ko'ndalang o'q) markazlaydi?", "align-items: center", ["justify-content: center", "align-content: center", "vertical-align: middle"], "Standart row da ko'ndalang o'q vertikal, uni align-items boshqaradi."),
      ch("flex-direction: column bo'lganda elementlarni gorizontal markazlash uchun qaysi?", "align-items: center", ["justify-content: center", "text-align: center faqat", "margin: 0 auto faqat"], "column da bosh o'q vertikal, ko'ndalang o'q gorizontal: gorizontal markazlash align-items bilan."),
      ch("Ikkita elementdan ikkinchisi o'ng chetga siljiydi. Qaysi qoida?", ".b { margin-left: auto }", [".b { float: right } flex da ham ishlaydi", ".b { justify-self: end }", ".b { text-align: right }"], "Flex da auto margin bo'sh joyni egallaydi. float flex bolalarda ta'sirsiz.", '<div class="row"><div class="a"></div><div class="b"></div></div>'),
      ch("align-content nega hech narsa qilmayapti?", "Konteynerda bitta qator bor: wrap va ortiqcha vertikal joy kerak", ["align-content faqat grid da ishlaydi", "justify-content bilan birga ishlatib bo'lmaydi", "Bolalarga align-self berilgan"], "align-content qatorlar guruhini joylashtiradi: ko'p qator bo'lishi shart.", '.row { display: flex; height: 300px; align-content: center; }\n/* 1 qator */'),
      fill("Elementlar orasidagi masofani beruvchi xususiyat (bitta so'z)?", 'gap', "gap bolalar orasida masofa beradi, chetda emas.", ['gap']),
      ch("Flex konteynerda bolalar standart bo'yicha qanday cho'ziladi?", "Ko'ndalang o'qda eng uzun bolaning balandligigacha (align-items: stretch)", ["Bosh o'qda butun kenglikgacha", "Cho'zilmaydi", "Faqat width belgilanganlar"], "stretch standart qiymat: bolalar balandligi teng bo'ladi."),
      ch("Sig'may qolgan elementlar yangi qatorga tushishi uchun?", "flex-wrap: wrap", ["flex-flow: nowrap", "overflow: wrap", "flex-direction: wrap"], "Standart nowrap: sig'masa ham bitta qatorda qisiladi."),
      ch("Flex konteyner ichidagi span ga width: 100px berildi. Ishlaydimi?", "Ha: flex bola blockified bo'ladi", ["Yo'q, span inline", "Faqat inline-block da", "Faqat height ishlaydi"], "Flex bolalarining display i block-level ga aylantiriladi."),
      ch("flex-direction: row-reverse bo'lsa justify-content: flex-start elementlarni qayerga qo'yadi?", "O'ng tomonga: boshlanish nuqtasi ham teskari", ["Chap tomonga", "Markazga", "O'zgarmaydi: har doim chapda"], "flex-start bosh o'q boshlanishiga ishora qiladi; row-reverse da bu o'ng tomon."),
      ch("justify-content: center ishlayapti, lekin align-items: center yo'q. Konteyner balandligi 300px. Elementlar qayerda?", "Gorizontal markazda, vertikal tepada (stretch yoki flex-start)", ["Aniq markazda", "Chap pastda", "Ko'rinmaydi"], "Faqat bosh o'q markazlanadi."),
    ],
  });

  /* 10 */
  lesson({
    title: 'Flexbox 2: flex-grow, shrink, basis',
    intro: "flex shorthand, bo'sh joyni taqsimlash, qisilish va min-width: auto tuzog'i.",
    theory: {
      analogy: { icon: '🥧', title: 'Pirog bo\'laklari', text: "Pirog (bo'sh joy) bo'laklarga bo'linadi: grow nisbatida ko'proq oluvchi bor, shrink nisbatida kamroq qisiladigan bor. Basis — har kim stol boshida olgan boshlang'ich ulushi." },
      sections: [
        { heading: 'Uch qiymat', table: { head: ['Xususiyat', 'Standart', 'Ma\'no'], rows: [['flex-grow', '0', "Ortiqcha joyni nisbatda egallash"], ['flex-shrink', '1', "Joy yetmasa, nisbatda qisilish"], ['flex-basis', 'auto', "Boshlang'ich o'lcham (width dan oldin, bosh o'q bo'yicha)"]] } },
        { code: { lang: 'css', text: '.a { flex: 1; }      /* 1 1 0%  */\n.b { flex: auto; }   /* 1 1 auto */\n.c { flex: none; }   /* 0 0 auto: qotgan */\n.d { flex: 2 1 100px; }' } },
        { heading: 'Hisob', text: "Bo'sh joy = konteyner kengligi − barcha basis lar yig'indisi. Har bir element o'z grow nisbati qadar oladi: 600px konteynerda basis 0 va grow 1:2:3 bo'lsa, 100, 200, 300px. Basis 0 emas, balki auto/100px bo'lsa, avval basis ayiriladi va FAQAT qolgan joy bo'linadi." },
        { callout: { kind: 'warn', text: "Flex bolalarning min-width standart auto: uzun matn yoki rasm elementni qisishga qo'ymaydi, ota dan chiqib ketadi. Yechim: min-width: 0 (yoki overflow: hidden)." } },
      ],
      recap: ["flex: 1 = 1 1 0%.", "grow bo'sh joyni, shrink yetishmagan joyni taqsimlaydi.", "Bo'sh joy basis lar ayirilgandan keyin qolgani.", "min-width: 0 uzun matn bilan overflow ni hal qiladi."],
    },
    defs: [
      ['flex-grow', "ortiqcha bo'sh joyning qancha qismini olishni bildiruvchi koeffitsient."],
      ['flex-shrink', "joy yetishmaganda qisilish koeffitsienti."],
      ['flex-basis', "elementning grow/shrink dan oldingi boshlang'ich o'lchami."],
      ['min-width: auto', "flex elementning mazmunidan kichikroq qisilishiga yo'l qo'ymaydigan standart."],
    ],
    life: [
      ['🍕', 'Pitsa bo\'laklari', "Ikki do'st 1:2 nisbatda pitsa olishadi (grow 1 va 2). Agar avval har biriga 1 bo'lakdan berilgan bo'lsa (basis), qolgan bo'laklar ulushga qarab taqsimlanadi."],
      ['🧳', 'Chamadon', "Chamadon kichrayganda (joy yetishmasa) mayda narsalar qisiladi (shrink), lekin ba'zilari (min-width: auto) sig'maydigan darajada qattiq."],
    ],
    practice: [
      { title: '3 ustun hisobi', text: "600px konteynerda flex: 1, flex: 2, flex: 3 ustunlar yasang va DevTools da o'lchamlarini hisobingiz bilan solishtiring." },
      { title: 'Chiqib ketgan matn', text: "Flex ichida uzun URL matni bor element oling: nega chiqib ketdi? min-width: 0 bilan tuzating." },
    ],
    items: [
      fill("Uchinchi element kengligi necha px? (raqam)", '300', "flex: n = n 1 0%: basis 0, shuning uchun 600 ni 1:2:3 nisbatda bo'lamiz: 100, 200, 300.", null, '.wrap { display: flex; width: 600px; }\n.a { flex: 1; }\n.b { flex: 2; }\n.c { flex: 3; }'),
      fill("b kengligi necha px? (raqam)", '500', "Basis lar 100+100=200, bo'sh joy 600. Grow 1:2 → a +200, b +400. b = 100 + 400 = 500.", null, '.wrap { display: flex; width: 800px; }\n.a { flex: 1 1 100px; }\n.b { flex: 2 1 100px; }'),
      fill("b kengligi necha px? (raqam)", '240', "Basis lar 300+300 = 600, yetishmovchilik 120. Shrink ulushi basis×shrink ga proporsional: teng, shuning uchun har biri −60. b = 300 − 60 = 240.", null, '.wrap { display: flex; width: 480px; }\n.a, .b { flex: 0 1 300px; }'),
      fill("a kengligi necha px? (raqam)", '150', "flex: none = 0 0 auto: a qotgan 150px. b qolgan joyni oladi, shuning uchun a = 150.", null, '.wrap { display: flex; width: 500px; }\n.a { flex: none; width: 150px; }\n.b { flex: 1; }'),
      ch("flex: 1 bu qaysi shorthand ga teng?", "1 1 0%", ["1 1 auto", "0 1 auto", "1 0 auto"], "Bitta raqam grow, basis esa 0% bo'ladi (flex: auto esa 1 1 auto)."),
      ch("Flex ichidagi uzun URL matni ota dan chiqib ketyapti. Eng aniq yechim?", "Elementga min-width: 0 berish", ["flex-shrink: 0 berish", "width: auto berish", "display: block berish"], "min-width: auto mazmundan kichik qisilishga ruxsat bermaydi, 0 buni olib tashlaydi.", '.item { flex: 1; }   /* ichida uzun matn */'),
      ch("flex: 1 va flex: auto farqi?", "auto: o'z mazmun kengligidan boshlab bo'ladi, 1: noldan bo'ladi", ["Hech qanday farq yo'q", "auto qisilmaydi", "1 faqat column da ishlaydi"], "Basis 0% bo'lsa, hamma teng bo'linadi; auto bo'lsa mazmun kengligi hisobga olinadi."),
      ch("Qaysi element kengligi o'zgarmaydi (qisilmaydi, o'smaydi)?", "flex: 0 0 200px", ["flex: 1 1 200px", "flex: 0 1 200px", "flex: 1 0 200px"], "grow 0 va shrink 0: faqat basis bo'yicha qotib turadi."),
      ch("flex-basis va width ikkalasi berilgan (row). Qaysi yutadi?", "flex-basis (bosh o'q bo'yicha)", ["width", "Kattasi", "Brauzer xato beradi"], "Basis auto bo'lmasa width ni bosib ketadi (min/max-width esa hali ham chegara)."),
      ch("Bo'sh joy 600px, ikki elementning flex-grow i 1 va 3. Birinchisi qancha qo'shimcha oladi?", "150px", ["200px", "300px", "100px"], "600 × 1/4 = 150."),
      ch("order: -1 nima qiladi?", "Elementni vizual jihatdan eng boshiga o'tkazadi (DOM o'zgarmaydi)", ["DOM dan o'chiradi", "Elementni yashiradi", "Faqat column da ishlaydi"], "order vizual tartibni o'zgartiradi, klaviatura tab tartibini emas, bu qulaylik muammosi bo'lishi mumkin."),
    ],
  });

  /* 11 */
  lesson({
    title: 'Grid 1: ustun va qatorlar',
    intro: "grid-template-columns, fr, repeat(), minmax(), auto-fit/auto-fill.",
    theory: {
      analogy: { icon: '🗺️', title: 'Shahmat taxtasi', text: "Flexbox bir qatorli chiziq, grid esa katakli taxta: har bir element qaysi katakka tushishini ham ustun, ham qator bo'yicha belgilaysiz." },
      sections: [
        { code: { lang: 'css', text: '.grid {\n  display: grid;\n  grid-template-columns: 200px 1fr 2fr;       /* 1 qat., 1fr + 2fr qolgan joyni 1:2 */\n  grid-template-columns: repeat(3, 1fr);       /* 3 ta teng ustun */\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* responsiv */\n  gap: 16px;\n}' } },
        { heading: 'fr hisobi', text: "fr — qolgan joyning ulushi. Konteyner 700px, gap yo'q: 100px 1fr 2fr → qolgan 600px, 1fr = 200, 2fr = 400. gap ham joyni oladi: ustunlar orasidagi gaplar avval ayiriladi, keyin fr bo'linadi." },
        { heading: 'auto-fit va auto-fill', table: { head: ['Qiymat', 'Ustunlar yetmasa'], rows: [['auto-fill', "Bo'sh ustunlar qoladi (joy saqlanadi)"], ['auto-fit', "Bo'sh ustunlar 0 ga qisiladi, elementlar kengayadi"]] } },
        { bullets: ["Grid chiziqlari 1 dan boshlanadi: 3 ustunli gridda 4 ta chiziq.", "grid-column: 1 / 3 — 1-chiziqdan 3-chiziqqacha (2 ustun egallaydi), grid-column: span 2 — 2 ustun.", "minmax(0, 1fr) — 1fr ning min-width: auto tuzog'idan saqlaydi.", "Implicit (yashirin) qatorlar grid-auto-rows bilan boshqariladi."] },
      ],
      recap: ["fr — gap dan keyingi qolgan joyning ulushi.", "auto-fit bo'sh ustunni yig'adi, auto-fill saqlaydi.", "1/3 — chiziq raqamlari, span 2 — ustunlar soni.", "minmax(0, 1fr) — kengayib ketmaslik uchun."],
    },
    defs: [
      ['Grid konteyner', "display: grid berilgan ota element."],
      ['fr', "gridda qolgan bo'sh joyning ulushini bildiruvchi birlik."],
      ['Grid chiziq', "ustun/qator chegarasi, 1 dan boshlanadi."],
      ['Implicit grid', "e'lon qilinmagan, element ko'p bo'lgani uchun avtomatik yaratilgan qatorlar."],
    ],
    life: [
      ['🏢', 'Ko\'p qavatli bino', "Har bir xona o'z qavat va eshik raqamiga (qator, ustun) ega. Katta zal 2 ta xonani egallaydi (span 2)."],
      ['📰', 'Gazeta maketi', "Bosh sarlavha butun kenglikni (1 / -1), yangiliklar esa teng ustunlarni egallaydi."],
    ],
    practice: [
      { title: 'Grid Garden', text: "cssgridgarden.com ning barcha darajalarini o'ynang." },
      { title: 'Responsiv kartalar', text: "repeat(auto-fit, minmax(240px, 1fr)) bilan oynani toraytirganda ustunlar soni o'zgaradigan galereya yasang." },
    ],
    items: [
      fill("Uchinchi ustun kengligi necha px? (raqam)", '400', "Qolgan joy: 700 − 100 = 600. 1fr = 200, 2fr = 400.", null, '.grid { display: grid; width: 700px; grid-template-columns: 100px 1fr 2fr; }'),
      fill("Har bir ustun kengligi necha px? (raqam)", '320', "gap lar 2×20 = 40, qolgan 960 uch ustunga: 320.", null, '.grid {\n  display: grid; width: 1000px; gap: 20px;\n  grid-template-columns: repeat(3, 1fr);\n}'),
      ch("grid-column: 1 / 3 nechta ustunni egallaydi?", "2 ta", ["3 ta", "1 ta", "4 ta"], "Chiziqlar 1 dan 3 gacha: 1-ustun va 2-ustun."),
      ch("3 ustunli gridda nechta ustun chizig'i bor?", "4 ta", ["3 ta", "2 ta", "5 ta"], "n ustun uchun n+1 chiziq."),
      ch("Konteyner 3 ta 200px ga yetadi, lekin atigi 2 ta element bor. auto-fit va auto-fill farqi?", "auto-fit elementlarni kengaytiradi, auto-fill bo'sh ustun joyini saqlaydi", ["Farqi yo'q", "auto-fit elementlarni yashiradi", "auto-fill faqat qatorlarda ishlaydi"], "auto-fit bo'sh yo'laklarni 0 ga qisadi."),
      ch("1fr ustun ichida uzun so'z gridni kengaytirib yubordi. Yechim?", "minmax(0, 1fr)", ["repeat(auto, 1fr)", "width: fit-content", "gap: 0"], "1fr = minmax(auto, 1fr): min auto mazmun o'lchami; 0 buni bekor qiladi."),
      ch("grid-column: span 2 va 1 / span 2 farqi?", "Birinchisi joyni avtomatik topadi, ikkinchisi 1-chiziqdan boshlaydi", ["Farqi yo'q", "Birinchisi ikki qatorni egallaydi", "Ikkinchisi xato"], "span faqat o'lchamni belgilaydi."),
      ch("Quyidagilardan qaysi biri teng 4 ustun beradi?", "repeat(4, 1fr)", ["repeat(1fr, 4)", "4 * 1fr", "repeat(4fr)"], "Sintaksis: repeat(son, track)."),
      ch("grid-template-columns da 3 ustun, 7 ta element bor. Nechta qator bo'ladi?", "3 ta (ulardan 3-sida bitta element)", ["2 ta", "7 ta", "4 ta"], "7 / 3 yuqoriga yaxlitlanadi: 3 qator; yashirin qatorlar grid-auto-rows bilan o'lchanadi."),
      ch("Gridda gap: 20px 40px qaysi biriga qanday?", "20px qatorlar orasi, 40px ustunlar orasi", ["20px ustunlar, 40px qatorlar", "Ikkalasi 60px", "Faqat birinchisi qo'llanadi"], "gap: row-gap column-gap."),
      ch("repeat(auto-fit, minmax(200px, 1fr)) nimaga yaxshi?", "Media query siz ustunlar soni oyna kengligiga moslashadi", ["Faqat 200px ustun beradi", "Faqat mobil uchun", "Ustunlar soni 1 ga tenglashadi"], "Brauzer nechta 200px ustun sig'ishini o'zi hisoblaydi."),
    ],
  });

  /* 12 */
  lesson({
    title: 'Grid 2: areas va joylashuv',
    intro: "grid-template-areas, grid-area, align/justify-items, place-items.",
    theory: {
      analogy: { icon: '🧩', title: 'Xona rejasi', text: "Arxitektor xonalarni nom bilan chizadi: \"oshxona\", \"mehmonxona\". Elementlarga shu nom beriladi va ular o'z joyiga o'zi tushadi." },
      sections: [
        { code: { lang: 'css', text: '.layout {\n  display: grid;\n  grid-template-columns: 220px 1fr;\n  grid-template-areas:\n    "header header"\n    "side   main"\n    "footer footer";\n}\n.h { grid-area: header; }\n.s { grid-area: side; }' } },
        { bullets: ["Har bir qatordagi nomlar soni ustunlar soniga teng bo'lishi kerak.", "Bir xil nom faqat to'rtburchak hosil qilishi kerak (L shakl yaroqsiz).", "Bo'sh katak uchun nuqta (.) yoziladi.", "place-items: center = align-items + justify-items (grid katak ichida markazlash).", "justify-items katak ICHIDAGI gorizontal, justify-content esa grid trek larining konteyner ichidagi joylashuvi."] },
        { table: { head: ['Xususiyat', 'Nima'], rows: [['align-items / justify-items', "Elementni o'z katagi ichida"], ['align-content / justify-content', "Butun trek to'plamini konteyner ichida"], ['align-self / justify-self', "Bitta element uchun"]] } },
      ],
      recap: ["Areas to'rtburchak bo'lishi shart.", "Nuqta — bo'sh katak.", "items katak ichida, content treklar uchun.", "place-items: center — eng qisqa markazlash."],
    },
    defs: [
      ['grid-template-areas', "grid ni nomlangan hududlar ko'rinishida chizish usuli."],
      ['grid-area', "elementni nomlangan hududga joylashtiruvchi xususiyat."],
      ['place-items', "align-items va justify-items ning qisqa yozuvi."],
      ['Trek', "bitta ustun yoki qator."],
    ],
    life: [
      ['🏠', 'Kvartira rejasi', "Reja qog'ozida xonalar nomi yozilgan; qurilishda har bir ishchi o'z xonasini topadi."],
      ['🛒', 'Do\'kon javonlari', "Javon (katak) ichidagi mahsulotni markazga qo'yish — place-items, butun javonlar to'plamini devor bo'ylab surish — place-content."],
    ],
    practice: [
      { title: 'Sahifa maketi', text: "header, sidebar, main, footer maketini grid-template-areas bilan yozing, keyin ≤700px da sidebar ni main ustiga tushiring." },
      { title: 'Markazlash', text: "Grid va place-items: center bilan elementni 3 qatorda markazlang." },
    ],
    items: [
      ch("Bu areas yaroqlimi?", "Yo'q: 'a' L shakl hosil qilmoqda", ["Ha", "Faqat nuqta qo'shilsa", "Faqat ustunlar soni 3 bo'lsa"], "Nomlangan hudud to'rtburchak bo'lishi shart.", 'grid-template-areas:\n  "a a"\n  "a b"\n  "b b";\n/* b ham L shaklda */'),
      ch("Bu areas yaroqlimi?", "Yo'q: qatorlardagi nomlar soni teng emas", ["Ha", "Faqat gap bo'lsa", "Faqat bitta qator bo'lsa"], "Har qator bir xil sonli katak bo'lishi shart.", 'grid-template-areas:\n  "header header"\n  "side main extra";'),
      ch("Ikkinchi qatorda 'side' chap ustunda, 'main' o'ngda. Footer nechta ustunni egallaydi?", "2 ta (butun kenglik)", ["1 ta", "3 ta", "0 ta"], "footer footer — ikkala katakni egallaydi.", 'grid-template-areas:\n  "header header"\n  "side   main"\n  "footer footer";'),
      ch("Katakni bo'sh qoldirish uchun areas da nima yoziladi?", "Nuqta (.)", ["empty", "null", "Tire (-)"], "Bitta yoki bir nechta nuqta bo'sh katakni bildiradi."),
      ch("Element katak ichida markazlansin (ikki o'q bo'yicha). Eng qisqa yozuv?", "place-items: center", ["place-content: center", "align: center", "center-items: both"], "Grid ichidagi har bir elementni o'z katagida markazlaydi."),
      ch("justify-items va justify-content farqi?", "items katak ichida, content butun treklar to'plamini konteyner ichida joylaydi", ["Farqi yo'q", "items faqat flex da ishlaydi", "content faqat matn uchun"], "Treklar konteynerdan kichik bo'lsa, content ular guruhini suradi."),
      ch("Bitta elementni o'z katagida o'ngga surish?", "justify-self: end", ["align-self: end", "margin: right", "text-align: right"], "justify-self — gorizontal (inline) o'q bo'yicha o'z-o'ziga."),
      ch("grid-area: 2 / 1 / 3 / 3 nimani bildiradi?", "row-start / col-start / row-end / col-end", ["col-start / row-start / col-end / row-end", "top / right / bottom / left", "x / y / w / h"], "Tartib: row-start, column-start, row-end, column-end."),
      ch("Mobilda sidebar ni main ustiga tushirish uchun areas ni qanday o'zgartirasiz?", "Media query ichida areas va ustunlarni qayta e'lon qilish", ["Faqat display: flex qilish", "HTML tartibini o'zgartirish shart", "z-index berish"], "areas qayta e'lon qilinsa, markup o'zgarmaydi."),
      ch("Gridda nomlangan hudud elementiga width: 300px berildi, lekin katak 600px. Element qancha bo'ladi?", "300px: stretch faqat width auto bo'lsa ishlaydi", ["600px", "Katakdan 300 kam", "Xato"], "Stretch faqat o'lcham auto bo'lganda element kataki to'ldiradi."),
    ],
  });

  /* 13 */
  lesson({
    title: 'Grid 3: subgrid va murakkab holatlar',
    intro: "subgrid, grid-auto-flow: dense, masonry-ga alternativlar va grid vs flex tanlovi.",
    theory: {
      analogy: { icon: '🧱', title: 'Qurilish rejasi', text: "Katta reja (ota grid) ichida kichik xona (ichki element) o'z chiziqlarini yaratmasdan, katta rejadagi chiziqlardan foydalansa — bu subgrid." },
      sections: [
        { code: { lang: 'css', text: '.cards { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; }\n.card  { display: grid; grid-row: span 3; grid-template-rows: subgrid; }\n/* sarlavha, matn va tugma har bir kartada bir xil balandlikda chiqadi */\n\n.gallery { grid-auto-flow: dense; } /* bo\'sh kataklarni to\'ldirishga urinadi */' } },
        { table: { head: ['Vaziyat', 'Tanlov'], rows: [['Bir o\'lchamli qator/ustun, mazmun boshqaradi', 'Flexbox'], ['Ikki o\'lchamli maket, qat\'iy treklar', 'Grid'], ['Ichki elementlarni ota treklariga tekislash', 'Subgrid'], ['Navbar, tugmalar guruhi', 'Flexbox'], ['Sahifa maketi, kartalar galereyasi', 'Grid']] } },
        { bullets: ["Subgrid ichki gridning treklari ota ning treklariga tushadi: gap ota nikini oladi (override qilish mumkin).", "dense tartibni buzishi mumkin, klaviatura tartibi vizual tartibga mos kelmay qoladi.", "grid-auto-columns va grid-auto-rows implicit treklarni o'lchaydi.", "Flex va grid birga ishlatiladi: grid maket, flex komponent ichi."] },
      ],
      recap: ["Subgrid ota treklarini ulashadi.", "dense bo'sh joylarni to'ldiradi, lekin tartibni buzadi.", "Flex — bir o'lchamli, grid — ikki o'lchamli.", "Ikkalasini aralashtirish normal."],
    },
    defs: [
      ['Subgrid', "ichki grid ota grid treklarini o'zi uchun ishlatishi."],
      ['Dense packing', "bo'sh kataklarni keyingi elementlar bilan to'ldirish."],
      ['Implicit track', "e'lon qilinmagan, avtomatik yaratilgan trek."],
      ['Masonry', "turli balandlikdagi kartalarni bo'shliqsiz joylashtirish maketi."],
    ],
    life: [
      ['🧾', 'Jadval ustunlari', "Har bir karta ichidagi sarlavha va narx bir xil qatordan boshlanishi uchun ular alohida emas, umumiy jadval qatorlaridan foydalanishi kerak."],
      ['🚗', "Avtoturargoh", "dense — bo'sh joyga kichik mashinani joylash: tartib buzilsa ham, joy tejaladi."],
    ],
    practice: [
      { title: 'Subgrid karta', text: "3 ta karta yasang: har birida sarlavha, matn, tugma bor, matn uzunligi har xil. Subgrid bilan tugmalarni bir xil qatorda tekislang." },
      { title: 'Grid yoki flex', text: "5 ta komponentni (navbar, galereya, forma, kartalar, footer) ro'yxat qilib, har biri uchun flex yoki grid tanlovini asoslang." },
    ],
    items: [
      ch("Subgrid nima uchun kerak?", "Ichki elementlarning qatorlari ota gridning qatorlari bilan tekislanishi uchun", ["Ota gridni tezlashtirish uchun", "Gridga animatsiya qo'shish uchun", "display: contents o'rniga"], "Har bir karta ichidagi sarlavha, matn, tugma bir xil qatorda bo'ladi."),
      ch("grid-auto-flow: dense nimaning evaziga bo'sh joy to'ldiradi?", "Vizual tartib DOM tartibidan farq qilishi mumkin", ["Tezlik pasayadi", "Gap yo'qoladi", "Elementlar kichrayadi"], "Qulaylik (klaviatura/screen reader) uchun muammo bo'lishi mumkin."),
      ch("Navbar uchun nima mosroq?", "Flexbox", ["Grid", "float", "Subgrid"], "Bir o'lchamli, mazmun bo'yicha joylashuv — flex."),
      ch("Sahifa maketi (header, sidebar, main, footer) uchun nima mosroq?", "Grid", ["Faqat flex", "float", "inline-block"], "Ikki o'lchamli maket."),
      ch("Subgrid da gap qaysi qiymatni oladi?", "Standart bo'yicha ota gridning gap ini", ["Hech narsa", "Doim 0", "Brauzer standarti"], "Xohlasangiz o'zingiz gap berib o'zgartirasiz."),
      ch("grid-row: span 3 va subgrid birga ishlatilsa nima bo'ladi?", "Karta ota ning 3 qatorini egallaydi va ular ichida tekislanadi", ["Karta 3 marta takrorlanadi", "Xato beradi", "Faqat 1 qator"], "Ichki grid shu 3 qatorni o'z qatorlari sifatida oladi."),
      ch("Kartalar balandligi har xil, ular bo'shliqsiz tepadan joylashishi kerak (masonry). Hozir eng ishonchli yo'l?", "Ustunlar bo'yicha columns xususiyati yoki JS", ["Faqat grid-auto-rows: 1fr", "Faqat flex", "position: sticky"], "Masonry hozircha standart emas: CSS columns yoki kutubxona kerak bo'ladi."),
      ch("Implicit qatorlarni qanday o'lchaysiz?", "grid-auto-rows", ["grid-template-rows ni cheksiz qilib", "row-size", "auto-rows-fit"], "e'lon qilinmagan qatorlar balandligi grid-auto-rows bilan."),
      ch("Flex va grid birga ishlatilsa?", "Maket gridda, komponent ichi flexda — normal amaliyot", ["Mumkin emas", "Faqat bitta sahifada", "Brauzer xato beradi"], "Ular raqib emas, bir-birini to'ldiradi."),
      ch("Quyidagilardan qaysi ikki o'lchamli joylashuv beradi?", "Grid", ["Flex row", "Inline", "Float"], "Ham ustun, ham qator bo'yicha."),
    ],
  });

  /* 14 */
  lesson({
    title: 'Positioning',
    intro: "static, relative, absolute, fixed, sticky va inset.",
    theory: {
      analogy: { icon: '📌', title: 'Doskadagi qog\'ozlar', text: "Oddiy qog'oz o'z joyida turadi (static). Relative — o'z joyidan biroz siljitilgan, lekin joyi band. Absolute — butunlay boshqa joyga qadalgan (eng yaqin 'pozitsiyali' ota ga nisbatan). Fixed — devorga qadalgan. Sticky — aylantirganda yopishib qoladi." },
      sections: [
        { table: { head: ['position', 'Oqimda joy oladimi', 'Nisbat'], rows: [['static', 'Ha', "—"], ['relative', "Ha (asl joyi saqlanadi)", "O'z asl joyiga nisbatan"], ['absolute', "Yo'q", "Eng yaqin static bo'lmagan ota (containing block)"], ['fixed', "Yo'q", "Viewport (ba'zan transform li ota)"], ['sticky', "Ha", "Eng yaqin scroll konteynerga; chegara (top) bilan"]] } },
        { code: { lang: 'css', text: '.card   { position: relative; }\n.badge  { position: absolute; top: 8px; right: 8px; }   /* .card burchagida */\n.cover  { position: absolute; inset: 0; }             /* butun .card ni qoplaydi */\n.header { position: sticky; top: 0; }' } },
        { bullets: ["absolute elementning containing block i — eng yaqin position: static bo'lmagan ota; yo'q bo'lsa — viewport/initial containing block.", "inset: 0 = top, right, bottom, left: 0.", "sticky ishlamasa: ota (yoki ajdodlar) overflow: hidden/auto bo'lishi, top yo'qligi yoki ota juda past bo'lishi.", "transform/filter/perspective ota fixed va absolute elementlar uchun containing block yaratadi."] },
      ],
      recap: ["absolute — eng yaqin positioned ota ga nisbatan.", "relative joyini saqlaydi.", "sticky uchun top va scroll kerak.", "transform ota fixed ni ham 'ushlab' oladi."],
    },
    defs: [
      ['Containing block', "absolute/fixed element o'lchamlarini hisoblaydigan ota hudud."],
      ['inset', "top/right/bottom/left ning qisqa yozuvi."],
      ['Sticky', "oddiy oqimda turib, scroll chegaraga yetganda yopishadigan joylashuv."],
      ['Oqimdan chiqish', "element o'ziga joy ajratmaydigan holat (absolute, fixed, float)."],
    ],
    life: [
      ['🏷️', 'Narx yorlig\'i', "Mahsulotga yopishtirilgan 'Chegirma' yorlig'i mahsulot ga nisbatan joylashadi: ota relative, yorliq absolute."],
      ['📋', 'Sarlavhali jadval', "Sticky — uzun ro'yxatda sarlavha aylantirganda ham tepada qoladi."],
    ],
    practice: [
      { title: 'Badge', text: "Kartaning burchagida 'NEW' badge yasang va ota dan relative olib tashlab, badge sahifa burchagiga qanday chiqib ketishini ko'ring." },
      { title: 'Sticky sarlavha', text: "Jadvalning thead ini sticky qiling, so'ngra ota ga overflow: hidden berib, nega buzilishini toping." },
    ],
    items: [
      ch("Badge qayerda paydo bo'ladi?", "Sahifa (initial containing block) ning yuqori o'ng burchagida", ["Karta ning yuqori o'ng burchagida", "Kartaning markazida", "Karta ichida, oddiy oqimda"], "Ota static, shuning uchun absolute undan nisbat olmaydi.", '.card  { /* position berilmagan */ }\n.badge { position: absolute; top: 0; right: 0; }'),
      ch("Endi badge qayerda?", "Karta ning yuqori o'ng burchagida", ["Sahifa burchagida", "Karta pastida", "Oqimda"], "Ota relative: u containing block bo'ldi.", '.card  { position: relative; }\n.badge { position: absolute; top: 0; right: 0; }'),
      ch("relative element top: 20px bilan siljitilsa, uning asl joyi nima bo'ladi?", "Bo'sh joy saqlanadi, qolgan elementlar siljimaydi", ["Boshqa elementlar yuqoriga chiqadi", "Joy yo'qoladi", "Element oqimdan chiqadi"], "relative siljishi faqat vizual."),
      ch("position: sticky; top: 0 ishlamayapti. Eng ehtimoliy sabab?", "Ota yoki ajdodda overflow: hidden/auto bor", ["z-index yo'q", "Faqat fixed bilan ishlaydi", "top: 0 yetarli emas"], "Overflow berilgan ajdod scroll konteyner bo'lib qoladi va sticky shuning ichida yopishadi.", '.wrap { overflow: hidden; }\n.head { position: sticky; top: 0; }'),
      ch("position: fixed element qayerga nisbatan joylashadi?", "Viewport (oyna) ga", ["Eng yaqin positioned ota ga", "Body ga", "Birinchi bolaga"], "Istisno: transform/filter berilgan ajdod bo'lsa, shunga nisbatan."),
      ch("Ota da transform berilgan. Ichidagi fixed element qanday?", "Ota ga nisbatan joylashadi, viewport ga emas", ["Hech o'zgarmaydi", "Yo'qoladi", "Doim viewport da"], "transform yangi containing block yaratadi."),
      fill("top, right, bottom, left uchun 0 bo'lgan qisqa xususiyat (bitta so'z)?", 'inset', "inset: 0 butun containing block ni qoplaydi.", ['inset']),
      ch("absolute elementga width berilmagan, left: 0; right: 0 berilgan. Kenglik?", "Containing block ning to'liq kengligi", ["Mazmunga teng", "0", "Xato"], "left+right berilsa, width auto element oraliqni to'ldiradi."),
      ch("absolute element ichida % qiymat nimaga nisbatan?", "Containing block ning padding box iga", ["Viewport ga", "Content box ga", "Elementning o'ziga"], "absolute uchun containing block — eng yaqin ajdodning padding box i."),
      ch("Qaysi biri oqimda joy ajratmaydi?", "position: absolute", ["position: relative", "position: sticky", "position: static"], "absolute va fixed oqimdan chiqadi."),
      ch("Ikkita absolute element bir xil joyda. Qaysi biri ustida ko'rinadi?", "DOM da keyin kelgani (z-index bir xil bo'lsa)", ["Avval kelgani", "Katta o'lchamlisi", "Tasodifiy"], "Teng z-index da tartib hal qiladi."),
    ],
  });

  /* 15 */
  lesson({
    title: 'Stacking context va z-index',
    intro: "z-index nega ba'zan ishlamaydi, stacking context yaratuvchilar va painting order.",
    theory: {
      analogy: { icon: '🥞', title: 'Pancake qavatlari', text: "Har bir stacking context — alohida pancake likopchasi: ichidagi z-index 9999 bo'lsa ham, boshqa likopchadagi pancake ustida ko'rinmaydi, chunki likopchaning o'zi qavatda past turadi." },
      sections: [
        { heading: 'Stacking context yaratadi', bullets: ["position: relative/absolute + z-index (auto dan boshqa), fixed va sticky avtomatik.", "opacity < 1, transform, filter, perspective, clip-path, mask.", "isolation: isolate — aynan shu uchun yaratilgan toza usul.", "flex/grid bolalarida z-index position siz ham ishlaydi.", "will-change (transform kabi xususiyatlar uchun)."] },
        { heading: 'Chizilish tartibi (pastdan yuqoriga)', flow: ['Fon va border', 'Negativ z-index', 'Oqimdagi block', 'Float', 'Inline', 'z-index: 0 / auto (positioned)', "Pozitiv z-index"] },
        { code: { lang: 'css', text: '.modal-bg { position: fixed; inset: 0; z-index: 10; }\n.card     { opacity: .99; }    /* yangi stacking context! */\n/* card ichidagi z-index: 9999 baribir modal-bg dan past, agar card konteksti past bo\'lsa */' } },
        { callout: { kind: 'tip', text: "z-index urushidan qochish: komponentga isolation: isolate bering va z-index qiymatlarini CSS o'zgaruvchilarida tizim sifatida saqlang." } },
      ],
      recap: ["z-index faqat ota stacking context ichida taqqoslanadi.", "opacity va transform yangi context yaratadi.", "isolation: isolate — toza yechim.", "9999 yechim emas, tizim kerak."],
    },
    defs: [
      ['Stacking context', "ichidagi elementlar bitta yaxlit qatlam sifatida chizilib, tashqi tartibga bog'liq bo'lgan kontekst."],
      ['z-index', "positioned (yoki flex/grid bola) elementning qatlam tartibi."],
      ['isolation', "isolate qiymati yangi stacking context yaratadi."],
      ['Painting order', "elementlar ekranga chizilish ketma-ketligi."],
    ],
    life: [
      ['🏬', 'Savdo markazi qavatlari', "2-qavatdagi ko'rgazma (z-index: 9999) baribir 3-qavatdagi eng arzon do'kondan past: chunki qavatning o'zi past. Qavat = stacking context."],
      ['🎞️', "Shaffof plyonkalar", "Har bir plyonka (context) ichida rasm qatlam-qatlam, lekin butun plyonka boshqa plyonka ustiga qo'yiladi."],
    ],
    practice: [
      { title: 'z-index tuzog\'i', text: "A: z-index 1, B: z-index 2 yasang. A ni opacity: .9 li ota ga o'rang va B ning ustiga chiqarmoqchi bo'ling: nega bo'lmaydi?" },
      { title: 'DevTools 3D', text: "Chrome DevTools Layers/3D view bilan sahifadagi stacking context larni ko'ring." },
    ],
    items: [
      ch("Qizil element ko'k ustida chiqmayapti. Nega?", "Qizil .a ichida, uning stacking context i (z-index: 1) ko'k konteksti (z-index: 2) dan past", ["z-index 9999 yetarli emas", "Ko'k element fixed", "Qizil faqat opacity bilan chiqadi"], "Ichki z-index faqat o'z konteksti ichida taqqoslanadi.", '<div class="a"><div class="red"></div></div>\n<div class="b"></div>\n\n.a    { position: relative; z-index: 1; }\n.red  { position: absolute; z-index: 9999; }\n.b    { position: relative; z-index: 2; }'),
      ch("Quyidagilardan qaysi biri YANGI stacking context YARATMAYDI?", "color: red", ["opacity: 0.9", "transform: scale(1)", "isolation: isolate"], "color hech qanday kontekst yaratmaydi."),
      ch("Flex bola position siz z-index: 5 berdi. Ishlaydimi?", "Ha, flex/grid bolalarida z-index position siz ishlaydi", ["Yo'q", "Faqat position: relative bilan", "Faqat Firefox da"], "Flex va grid elementlari uchun maxsus qoida bor."),
      ch("Oddiy block element (static) ga z-index: 100 berildi (flex/grid emas). Natija?", "Hech narsa: static da z-index ishlamaydi", ["Eng yuqoriga chiqadi", "Xato", "Faqat pastga tushadi"], "z-index positioned yoki flex/grid bola uchun."),
      ch("Chizilish tartibida qaysi biri eng pastda?", "Negativ z-index li positioned elementlar (ota fonidan keyin)", ["Float lar", "Pozitiv z-index", "Inline matn"], "Stacking context fonidan keyin eng pastda — negativ z-index."),
      ch("Modal ustiga chiqayotgan dropdown ni qanday xavfsiz boshqarasiz?", "Komponentga isolation: isolate va z-index larni tizimli o'zgaruvchilarda saqlash", ["Hamma joyga z-index: 99999", "!important qo'shish", "Elementlarni pozitsiyasiz qilish"], "Raqamlar urushi emas, qatlam tizimi."),
      ch("position: fixed element nega ba'zan sahifa bilan skroll bo'lyapti?", "Ajdodda transform/filter bor: u containing block bo'lib qoldi", ["Fixed faqat bitta sahifada", "z-index kam", "Brauzer xatosi"], "Transform ajdodi fixed elementni 'ushlab' oladi."),
      ch("Ikki positioned element bir xil z-index da. Qaysi ustida?", "DOM da keyin kelgani", ["Avval kelgani", "Kattasi", "Tasodifiy"], "Teng bo'lsa — DOM tartibi."),
      fill("Yangi stacking context yaratish uchun toza usul: isolation: ______ (bitta so'z)", 'isolate', "isolation: isolate yon ta'sirsiz kontekst yaratadi.", ['isolate']),
      ch("z-index: -1 li element ota fonining orqasiga yashirinib qoldi. Sabab?", "Ota stacking context yaratmagan: negativ element ota fonidan ham pastga tushadi", ["z-index manfiy bo'lolmaydi", "opacity yo'q", "Brauzer xatosi"], "Ota da isolation/position+z-index bo'lsa, negativ element ota fonidan keyin chiziladi."),
    ],
  });

  /* 16 */
  lesson({
    title: 'Overflow va scroll',
    intro: "overflow, scroll-behavior, scroll-snap, sticky bilan munosabat va scrollbar-gutter.",
    theory: {
      analogy: { icon: '🪟', title: 'Deraza va ko\'cha', text: "Deraza (konteyner) kichik, tashqaridagi manzara (mazmun) katta. Deraza uni kesib qo'yadi (hidden), yoki aylantirishga (scroll) ruxsat beradi." },
      sections: [
        { table: { head: ['overflow', 'Natija'], rows: [['visible', "Mazmun tashqariga chiqib ko'rinadi (standart)"], ['hidden', "Kesadi, foydalanuvchi aylantira olmaydi (kod bilan mumkin)"], ['scroll', "Doim scrollbar"], ['auto', "Kerak bo'lganda scrollbar"], ['clip', "hidden kabi, lekin scroll konteyner yaratmaydi (sticky buzilmaydi)"]] } },
        { code: { lang: 'css', text: '.list   { max-height: 300px; overflow-y: auto; scroll-behavior: smooth; }\n.slider { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }\n.slide  { flex: 0 0 100%; scroll-snap-align: start; }\nhtml    { scrollbar-gutter: stable; }  /* scrollbar paydo bo\'lganda sakramasin */' } },
        { bullets: ["overflow: hidden BFC yaratadi va ichidagi sticky ni buzishi mumkin.", "overflow ning bir o'qi visible, ikkinchisi hidden/auto bo'lsa, visible auto ga aylanadi.", "overscroll-behavior: contain — modal ichida scroll ota ga o'tib ketmasin.", "100vh va mobil panel bilan scroll muammolari uchun dvh."] },
      ],
      recap: ["clip scroll konteyner yaratmaydi.", "overflow-x: hidden bilan overflow-y: visible mumkin emas: auto ga aylanadi.", "scroll-snap carousel uchun, mandatory va proximity.", "scrollbar-gutter layout sakrashini oldini oladi."],
    },
    defs: [
      ['Overflow', "mazmun konteynerga sig'masa nima qilish."],
      ['Scroll konteyner', "o'zida aylantirish mumkin bo'lgan element."],
      ['Scroll snap', "aylantirishda belgilangan nuqtalarga 'yopishish' mexanizmi."],
      ['scrollbar-gutter', "scrollbar uchun joy zaxiralash."],
    ],
    life: [
      ['🎠', 'Karusel', "Slayderlar ketma-ket turadi, foydalanuvchi aylantirsa, har bir slayd o'rtadagi ramkaga 'yopishadi'."],
      ['🪟', 'Kesilgan rasm', "hidden — rasm ramkasiga sig'magan qismi kesiladi; clip — bunga o'xshash, lekin yangi aylantirish zonasi yaratmaydi."],
    ],
    practice: [
      { title: 'Scroll snap karusel', text: "5 ta slaydli karusel yasang: scroll-snap-type: x mandatory, har slayd to'liq kenglikda." },
      { title: 'Sticky va overflow', text: "Sticky sarlavhani overflow: hidden ota ichiga qo'yib buzing, so'ngra overflow: clip bilan tuzating." },
    ],
    items: [
      ch("Quyidagilardan qaysi biri yangi scroll konteyner yaratmaydi?", "overflow: clip", ["overflow: hidden", "overflow: auto", "overflow: scroll"], "clip ichidagi sticky ishlashiga to'sqinlik qilmaydi."),
      ch("overflow-x: hidden; overflow-y: visible berildi. Natija?", "overflow-y ham auto kabi harakat qiladi (visible bo'lib qolmaydi)", ["Ikkalasi ishlaydi", "Faqat x kesiladi, y visible", "Xato"], "Spetsifikatsiya: bir o'q visible, ikkinchisi emas bo'lsa, visible auto ga aylanadi."),
      ch("Modal ichidagi ro'yxat oxiriga yetganda sahifa ham skroll bo'lyapti. Yechim?", "overscroll-behavior: contain", ["overflow: hidden ni body ga", "z-index oshirish", "position: fixed qo'shish"], "Scroll zanjirini to'xtatadi."),
      ch("scroll-snap-type: x mandatory nima?", "Gorizontal scroll doim snap nuqtasida to'xtaydi", ["Vertikal scroll", "Faqat tugma bosilganda ishlaydi", "Scroll o'chiriladi"], "mandatory majburiy, proximity esa yaqin bo'lsagina."),
      ch("Sahifada scrollbar paydo bo'lganda kontent chapga sakraydi. Yechim?", "scrollbar-gutter: stable", ["overflow: hidden", "width: 100vw", "margin: auto"], "Scrollbar uchun joy oldindan zaxiralanadi."),
      ch("Bola elementi sticky, ota overflow: hidden. Nima bo'ladi?", "Sticky ota ning scroll konteyneri ichida qoladi va kutilgan joyda yopishmaydi", ["Hech qanday ta'sir yo'q", "Sticky fixed ga aylanadi", "Ota yo'qoladi"], "Overflow berilgan ajdod sticky uchun scroll konteyner bo'ladi."),
      fill("Silliq aylantirish xususiyati: scroll-______: smooth (bitta so'z)", 'behavior', "scroll-behavior: smooth.", ['behavior']),
      ch("overflow: hidden ning yon foydasi?", "Yangi BFC yaratadi (float larni ushlaydi, margin collapse ni oldini oladi)", ["Elementni tezlashtiradi", "Scrollbar qo'shadi", "z-index beradi"], "Shuning uchun clearfix o'rniga ishlatilgan."),
      ch("Gorizontal scrollbar nega paydo bo'ldi?", "Element 100vw: scrollbar kengligini hisobga olmaydi", ["100vw ichida padding yo'q", "Faqat Safari xatosi", "overflow o'rnatilmagan emas"], "100vw vertikal scrollbar ni ham o'z ichiga oladi: 100% yaxshiroq.", '.hero { width: 100vw; }'),
      ch("Ichki elementning scroll pozitsiyasi qayerga tushishini boshqaruvchi xususiyat?", "scroll-snap-align", ["scroll-position", "snap-to", "align-scroll"], "Har bir slayd o'zining yopishish chizig'ini belgilaydi."),
    ],
  });
};
