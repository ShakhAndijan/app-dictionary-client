// JavaScript, lessons 26-33: modules, DOM, events, timers, memory, regex, JSON/Date/Intl, patterns.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 26 */
  lesson({
    title: 'Modullar',
    intro: "ES modullari (ESM), CommonJS, named va default eksport, live binding, dinamik import.",
    theory: {
      analogy: { icon: '🧰', title: 'Asboblar qutisi', text: "Katta ustaxonada hamma asbob bitta uyumda bo'lmaydi: har biri alohida qutida, kerak bo'lganda olinadi. Modul — alohida quti: ichidagini faqat export qilganingizni boshqalar ko'radi." },
      sections: [
        { heading: 'ESM va CommonJS', table: { head: ['', 'ES Modules (ESM)', 'CommonJS (CJS)'], rows: [['Sintaksis', 'import / export', 'require / module.exports'], ['Yuklash', "Statik (kod bajarilishidan oldin tahlil qilinadi)", "Dinamik (bajarilish paytida)"], ['Qiymatlar', 'Live binding (jonli bog\'lanish)', "Qiymat NUSXASI"], ['this (moduldagi)', 'undefined', 'module.exports'], ['Strict rejim', 'Avtomatik', "Qo'lda"], ['Top-level await', 'Bor', "Yo'q"]] } },
        { code: { lang: 'js', text: "// counter.js\nexport let count = 0;\nexport function inc() { count++; }\nexport default function hello() {}\n\n// main.js\nimport hello, { count, inc } from './counter.js';\nconsole.log(count);   // 0\ninc();\nconsole.log(count);   // 1  (live binding: eksport qilingan o'zgaruvchining O'ZIGA havola)\ncount = 5;            // TypeError: import qilingan bog'lanish faqat o'qiladi\n\nconst m = await import('./heavy.js');   // dinamik import: Promise qaytaradi (lazy loading)" } },
        { heading: 'Muhim qoidalar', bullets: ["import e'lonlari ko'tariladi (hoisted) va modul kodidan oldin bajariladi.", "Modul faqat BIR marta bajariladi va keshlanadi: ikki joyda import qilinsa ham bitta nusxa (singleton).", "Circular import (aylanma bog'liqlik): modullar bir-birini import qilsa, ba'zi qiymatlar hali TDZ da bo'lishi mumkin.", "default eksport import paytida istalgan nom bilan olinadi, named eksport esa aynan shu nom bilan (yoki as bilan).", "Brauzerda <script type='module'> kerak; modullar defer kabi kechiktirilib yuklanadi va o'z scope iga ega.", "Tree shaking (daraxtni silkitish): ishlatilmagan named eksportlarni build vaqtida olib tashlash — faqat ESM statik bo'lgani uchun mumkin."] },
      ],
      recap: ["ESM statik va live binding, CJS dinamik va nusxa.", "Modul bir marta bajariladi va keshlanadi.", "import qilingan bog'lanishga yozib bo'lmaydi.", "Dinamik import() — lazy loading, Promise qaytaradi."],
    },
    defs: [
      ['Module (modul)', "o'z scope iga ega, export bilan tanlab imkoniyat ulashadigan va import bilan boshqalardan oladigan alohida fayl."],
      ['Live binding (jonli bog\'lanish)', "import qilingan nom eksport qiluvchi o'zgaruvchining o'ziga havola: u o'zgarsa, import qiluvchida ham o'zgarish ko'rinadi."],
      ['Named va default export (nomli va standart eksport)', "named — aniq nom bilan, bir faylda ko'p; default — modulning asosiy qiymati, bitta."],
      ['Dynamic import (dinamik import)', "import() funksiyasi: modulni kerak bo'lganda yuklaydigan, Promise qaytaradigan chaqiruv."],
      ['Tree shaking', "ishlatilmaydigan eksportlarni yig'ma (bundle) dan olib tashlash."],
    ],
    life: [
      ['📚', 'Kutubxona', "Modul — kitob javoni: faqat 'chiqarilgan' (export) kitoblarni o'qish mumkin, qolganlari ichki arxivda."],
      ['🪞', 'Live binding', "Nusxa — fotosurat (eskirishi mumkin), live binding — ko'zgu: manbada nima o'zgarsa, shu zahoti ko'rinadi."],
    ],
    practice: [
      { title: 'Live binding sinov', text: "Counter moduli yarating va import qilingan count ni o'zgartirishga urinib, TypeError ni ko'ring. CommonJS da shu tajribani qaytaring: qiymat nusxasi bo'lishini isbotlang." },
      { title: 'Lazy load', text: "Katta modulni tugma bosilganda import() bilan yuklang va Network panelida ko'ring." },
    ],
    items: [
      ch("Ikkinchi console.log nima chiqaradi?", "1", ["0", "undefined", "TypeError"], "ESM live binding: import qilingan count eksport qiluvchining o'zgaruvchisiga havola.", "// counter.js\nexport let count = 0;\nexport function inc() { count++; }\n\n// main.js\nimport { count, inc } from './counter.js';\nconsole.log(count);\ninc();\nconsole.log(count);"),
      ch("count = 5 (import qilingan nomga yozish) natijasi?", "TypeError: faqat o'qiladi", ["Ishlaydi", "undefined", "Eksport qiluvchiga ham o'zgaradi"], "Import qilingan bog'lanishni faqat eksport qiluvchi modul o'zgartira oladi."),
      ch("CommonJS da const { count, inc } = require('./counter') qilinsa, inc() dan keyin count?", "O'zgarmaydi: qiymat nusxasi", ["Yangilanadi", "TypeError", "undefined"], "CJS da destrukturizatsiya vaqtidagi qiymat nusxalanadi."),
      ch("Modul ikki joyda import qilinsa necha marta bajariladi?", "Bir marta (keshlanadi)", ["Ikki marta", "Har safar", "Faqat birinchisida"], "Modul singleton kabi ishlaydi."),
      ch("import e'lonlari qachon bajariladi?", "Modul kodidan oldin (ko'tariladi)", ["Qaerda yozilsa shu joyda", "Eng oxirida", "Faqat birinchi marta chaqirilganda"], "Statik tahlil: bog'liqliklar oldindan bilinadi."),
      ch("import('./a.js') nimani qaytaradi?", "Promise (modul obyekti bilan)", ["Modul obyektini to'g'ridan-to'g'ri", "undefined", "Funksiya"], "Dinamik import asinxron."),
      ch("Moduldagi top-level this nima?", "undefined", ["window", "module.exports", "globalThis"], "ESM avtomatik strict va this undefined."),
      ch("Tree shaking nima uchun faqat ESM bilan yaxshi ishlaydi?", "ESM statik: qaysi eksport ishlatilishi build vaqtida ma'lum", ["ESM tezroq", "CJS xavfsiz emas", "ESM kichikroq"], "require dinamik bo'lgani uchun tahlil qiyin."),
      ch("Circular import da xavf?", "Modul hali to'liq bajarilmagan bo'lib, eksport TDZ da bo'lishi mumkin", ["Cheksiz sikl", "Avtomatik xato bor", "Hech qanday"], "Bir-birini import qilgan modullarda tartib muhim."),
      ch("default eksport import paytida?", "Istalgan nom bilan olinadi", ["Faqat 'default' nomi bilan", "Faqat asl nomi bilan", "Import qilib bo'lmaydi"], "import anyName from './x.js'."),
      ch("Brauzerda ES modul ni ishlatish uchun?", "<script type=\"module\">", ["<script async>", "<script src=...>", "<module>"], "Modul scope i va kechiktirilgan yuklash."),
      ch("Modul darajasidagi o'zgaruvchi global bo'ladimi?", "Yo'q, modulga yopiq", ["Ha, window ga yoziladi", "Faqat var bo'lsa", "Faqat let bo'lsa"], "Modul o'z scope iga ega."),
    ],
  });

  /* 27 */
  lesson({
    title: 'DOM',
    intro: "Document Object Model: daraxt, tanlash, o'zgartirish, live/static ro'yxatlar, reflow va repaint.",
    theory: {
      analogy: { icon: '🌳', title: 'Oila daraxti', text: "HTML hujjat brauzerda daraxtga aylanadi: har bir teg — tugun (node). DOM — shu daraxtni JavaScript orqali o'qish va o'zgartirish imkoniyati. Daraxtni o'zgartirsangiz, sahifa darhol (yoki keyingi chizishda) yangilanadi." },
      sections: [
        { heading: 'Tugunlar', text: "DOM (Document Object Model — hujjat obyekt modeli) daraxtida turli tugunlar bor: Element (teg), Text (matn), Comment (izoh), Document. Element tugunlar HTMLElement dan meros oladi. childNodes matn va izohlarni ham (probel qatorlari ham matn tuguni!), children esa faqat elementlarni beradi." },
        { code: { lang: 'js', text: "const el = document.querySelector('.card');          // birinchisi yoki null\nconst all = document.querySelectorAll('.card');       // STATIK NodeList\nconst live = document.getElementsByClassName('card'); // JONLI HTMLCollection\n\nel.textContent = '<b>x</b>';   // matn sifatida (xavfsiz)\nel.innerHTML = '<b>x</b>';     // HTML sifatida (XSS xavfi: foydalanuvchi kiritishi bilan ishlatmang)\nel.classList.toggle('on');\nel.dataset.userId = '5';       // data-user-id=\"5\"\nel.setAttribute('aria-label', 'x');\n\nconst li = document.createElement('li');\nul.append(li);                 // oxiriga\nul.prepend(li);                // boshiga (mavjud tugunni KO'CHIRADI, nusxalamaydi)\nconst copy = li.cloneNode(true);" } },
        { heading: 'Live va static', table: { head: ['Qaytaruvchi', 'Tur', 'DOM o\'zgarsa'], rows: [['querySelectorAll', 'NodeList (statik)', "Yangilanmaydi"], ['getElementsByClassName / TagName', 'HTMLCollection (jonli)', "Avtomatik yangilanadi"], ['childNodes', 'NodeList (jonli)', "Yangilanadi"], ['children', 'HTMLCollection (jonli)', "Yangilanadi"]] } },
        { heading: 'Unumdorlik', bullets: ["Reflow (layout, qayta joylashtirish): o'lcham/joylashuv o'zgarsa hamma narsa qayta hisoblanadi — qimmat.", "Repaint (qayta chizish): faqat rang kabi ko'rinish o'zgarsa.", "Layout thrashing: o'qish (offsetHeight) va yozish (style) ni aralashtirish har gal reflow majbur qiladi: avval hammasini o'qing, keyin yozing.", "Ko'p tugun qo'shishda DocumentFragment yoki bir martalik innerHTML/append ishlating.", "transform va opacity reflow chaqirmaydi."] },
        { callout: { kind: 'warn', text: "innerHTML ga foydalanuvchi kiritgan matnni qo'ymang: <img onerror=...> orqali XSS (Cross-Site Scripting) yuzaga keladi. textContent xavfsiz." } },
      ],
      recap: ["querySelectorAll statik, getElementsBy* jonli.", "textContent xavfsiz, innerHTML xavfli.", "append mavjud tugunni ko'chiradi.", "O'qishni yozishdan ajrating (layout thrashing)."],
    },
    defs: [
      ['DOM (hujjat obyekt modeli)', "HTML hujjatning tugunlar daraxti ko'rinishidagi dasturiy modeli."],
      ['Node va Element (tugun va element)', "node — daraxtdagi har qanday bo'g'in (matn, izoh ham); element — teg tuguni."],
      ['Live collection (jonli to\'plam)', "DOM o'zgarishi bilan avtomatik yangilanadigan ro'yxat (HTMLCollection)."],
      ['Reflow va repaint (qayta joylashtirish va qayta chizish)', "reflow — o'lchamlarni qayta hisoblash, repaint — ko'rinishni qayta chizish."],
      ['XSS (saytlararo skript ijrosi)', "foydalanuvchi kiritgan zararli kodning sahifada bajarilishi."],
    ],
    life: [
      ['🏗️', 'Bino rejasi', "DOM — bino rejasi; uni o'zgartirish devor surish kabi (reflow) qimmat, bo'yoqni almashtirish (repaint) arzonroq."],
      ['📋', 'Jonli ro\'yxat', "Live collection — jonli efir ekrani: manba o'zgarsa, ko'rinish ham o'zgaradi; statik NodeList — suratga olingan ro'yxat."],
    ],
    practice: [
      { title: 'Live va static', text: "querySelectorAll va getElementsByClassName natijalari uzunligini element qo'shgandan keyin solishtiring." },
      { title: 'Thrashing o\'lchash', text: "Sikl ichida offsetHeight o'qib style.height yozing va o'qishni siklga qadar ajratgan variant bilan performance.now() orqali taqqoslang." },
    ],
    items: [
      ch("Yangi .card qo'shilgandan keyin all.length va live.length?", "2 va 3", ["3 va 3", "2 va 2", "3 va 2"], "querySelectorAll statik (suratga olingan), getElementsByClassName jonli.", "// boshida 2 ta .card\nconst all = document.querySelectorAll('.card');\nconst live = document.getElementsByClassName('card');\n// keyin yangi .card qo'shildi"),
      ch("document.querySelector('.yoq') natijasi agar mos element bo'lmasa?", "null", ["undefined", "[]", "TypeError"], "querySelector topilmasa null qaytaradi."),
      ch("Nega foydalanuvchi matnini innerHTML ga qo'yish xavfli?", "<img onerror=...> kabi zararli kod bajarilishi mumkin (XSS)", ["Sekin ishlaydi", "Brauzer rad etadi", "Matn buziladi"], "textContent matnni HTML emas, oddiy matn sifatida qo'yadi."),
      ch("ul.append(li) agar li allaqachon boshqa joyda bo'lsa?", "Tugun ko'chiriladi (nusxalanmaydi)", ["Nusxalanadi", "Xato beradi", "Hech narsa bo'lmaydi"], "Bir tugun DOM da faqat bitta joyda bo'la oladi; nusxa uchun cloneNode."),
      ch("children va childNodes farqi?", "children faqat elementlar, childNodes matn va izohlarni ham beradi", ["Farqi yo'q", "children matnni ham beradi", "childNodes faqat elementlar"], "Teglar orasidagi probel qator ham Text tugun."),
      ch("el.dataset.userId = '5' qanday atribut yaratadi?", "data-user-id=\"5\"", ["data-userId=\"5\"", "userId=\"5\"", "data_user_id=\"5\""], "camelCase kebab-case ga aylanadi."),
      ch("Layout thrashing nima?", "O'qish (offsetHeight) va yozish (style) ni aralash qilib, har safar reflow majburlash", ["Juda ko'p tugun yaratish", "CSS xatosi", "Xotira oqishi"], "Avval hamma o'qish, keyin hamma yozish."),
      ch("Quyidagilardan qaysi biri reflow keltirib chiqarmaydi?", "transform: translateX()", ["width o'zgartirish", "margin o'zgartirish", "font-size o'zgartirish"], "transform va opacity kompozitor darajasida."),
      ch("Katta ro'yxatni (1000 li) eng tez qo'shish usuli?", "Fragment ga yig'ib, bir marta qo'shish", ["Har birini alohida append", "Har birida innerHTML +=", "setInterval bilan"], "DOM ga kamroq murojaat: kam reflow."),
      ch("el.textContent = '<b>x</b>' ekranda nima ko'rinadi?", "<b>x</b> matn sifatida", ["Qalin x", "Hech narsa", "Xato"], "textContent teg sifatida talqin qilmaydi."),
      ch("document.getElementById('a') va querySelector('#a') ?", "Ikkalasi ham elementni qaytaradi (getElementById odatda tezroq)", ["Birinchisi ro'yxat qaytaradi", "Ikkinchisi ishlamaydi", "Ikkalasi null"], "Natija bir xil, id bo'yicha tanlash uchun ikkalasi ham to'g'ri."),
      ch("NodeList ga to'g'ridan-to'g'ri map chaqirib bo'ladimi?", "Yo'q: avval Array.from yoki [...] bilan massivga aylantirish kerak", ["Ha", "Faqat statik uchun", "Faqat jonli uchun"], "NodeList da forEach bor, map yo'q."),
      ch("el.classList.toggle('on') nima qiladi?", "Class bo'lsa olib tashlaydi, bo'lmasa qo'shadi", ["Doim qo'shadi", "Doim olib tashlaydi", "Class nomini o'zgartiradi"], "Ikkinchi argument bilan majburlash mumkin."),
    ],
  });

  /* 28 */
  lesson({
    title: 'Hodisalar',
    intro: "Event: capturing, bubbling, target, currentTarget, delegation, preventDefault va tinglovchilarni boshqarish.",
    theory: {
      analogy: { icon: '🫧', title: 'Pufakchalar', text: "Pufak suv ostida paydo bo'lib, yuzaga ko'tariladi (bubbling). Tugmani bossangiz, hodisa avval tugmada, keyin uning ota-onasida, ajdodlarida ... document gacha ko'tariladi. Capturing esa teskarisi: tepadan pastga tushish." },
      sections: [
        { heading: 'Hodisaning uch bosqichi', flow: ['Capturing (cho\'kish): window → ... → ota', 'Target (nishon element)', 'Bubbling (ko\'tarilish): ota → ... → window'] },
        { code: { lang: 'js', text: "list.addEventListener('click', (e) => {\n  // e.target — BOSILGAN eng ichki element\n  // e.currentTarget — tinglovchi biriktirilgan element (list)\n  const li = e.target.closest('li');\n  if (!li || !list.contains(li)) return;   // delegatsiya\n  console.log(li.dataset.id);\n});\n\nlink.addEventListener('click', e => e.preventDefault());   // standart xatti-harakatni to'xtatish\nbtn.addEventListener('click', e => e.stopPropagation());   // ko'tarilishni to'xtatish\nbtn.addEventListener('click', handler, { once: true });    // bir marta\nwindow.addEventListener('scroll', handler, { passive: true }); // scrollni bloklamaydi" } },
        { heading: 'Event delegation (hodisa delegatsiyasi)', text: "Har bir bola uchun alohida tinglovchi biriktirish o'rniga, ota elementga bitta tinglovchi qo'yiladi va e.target orqali qaysi bola bosilgani aniqlanadi. Afzalliklari: xotira tejaladi, keyin dinamik qo'shilgan elementlar ham ishlaydi. Faqat bubbling bo'ladigan hodisalarda ishlaydi (focus, blur bubble qilmaydi — focusin/focusout ishlating)." },
        { bullets: ["addEventListener ni bir xil funksiya havolasi bilan ikki marta qo'shsangiz, bir marta ishlaydi; anonim funksiyalar har safar yangi, removeEventListener uchun havola saqlash kerak.", "Tinglovchilar ro'yxatdan o'tgan tartibda chaqiriladi.", "stopPropagation ko'tarilishni to'xtatadi, stopImmediatePropagation shu elementdagi qolgan tinglovchilarni ham.", "e.target o'zgarmaydi, e.currentTarget esa har bosqichda tinglovchi biriktirilgan element.", "Arrow tinglovchida this tashqi scope, oddiy funksiyada this = currentTarget.", "Custom event: element.dispatchEvent(new CustomEvent('x', { detail }))."] },
      ],
      recap: ["Capturing → target → bubbling.", "target — bosilgan, currentTarget — tinglovchi turgan element.", "Delegatsiya: ota ga bitta tinglovchi, closest bilan aniqlash.", "preventDefault standartni, stopPropagation ko'tarilishni to'xtatadi."],
    },
    defs: [
      ['Event bubbling (hodisaning ko\'tarilishi)', "hodisa nishon elementdan ota-onalar bo'ylab document gacha ko'tarilishi."],
      ['Event capturing (hodisaning cho\'kishi)', "hodisa window dan nishon elementgacha tushishi; { capture: true } bilan tinglanadi."],
      ['Event delegation (hodisa delegatsiyasi)', "bitta ota tinglovchi orqali ko'p bola hodisalarini boshqarish."],
      ['target va currentTarget', "target — hodisa boshlangan element, currentTarget — tinglovchi biriktirilgan joriy element."],
      ['Passive listener (passiv tinglovchi)', "preventDefault chaqirmasligini va'da qilib, scroll ni to'sib qo'ymaydigan tinglovchi."],
    ],
    life: [
      ['🏢', 'Idora ovozi', "Xonada ovoz chiqarsangiz, qavat, bino (ajdodlar) ham eshitadi (bubbling). Menejer (ota) hammaga alohida emas, umumiy kuzatadi (delegatsiya)."],
      ['🚪', 'Bitta qo\'ng\'iroq tugmasi', "Ko'p kvartira uchun bitta eshik qo'ng'irog'i va ro'yxat (delegatsiya) — har bir xonadonga alohida o'rnatishdan arzon."],
    ],
    practice: [
      { title: 'Delegatsiya', text: "Dinamik qo'shiladigan ro'yxat elementlari uchun bitta tinglovchi yozing va closest bilan ishlating." },
      { title: 'Bubbling ni kuzatish', text: "Uch ichma-ich div ga click tinglovchi qo'yib, capture va bubble farqini, target/currentTarget qiymatlarini konsolga chiqaring." },
    ],
    items: [
      ch("Ichki tugma bosilganda ota va tugma tinglovchilari tartibi (hammasi bubbling)?", "Avval tugma, keyin ota", ["Avval ota, keyin tugma", "Faqat tugma", "Tasodifiy"], "Bubbling: ichkaridan tashqariga."),
      ch("Capture rejimida ({capture: true}) ota va bubble rejimidagi tugma tinglovchilari tartibi?", "Avval ota (capture), keyin tugma", ["Avval tugma", "Tasodifiy", "Faqat bittasi"], "Capturing bosqichi bubbling dan oldin."),
      ch("e.target va e.currentTarget list ga tinglovchi qo'yilgan, ichidagi li bosildi. Qaysi biri qaysi?", "target = li (bosilgan), currentTarget = list", ["target = list, currentTarget = li", "Ikkalasi li", "Ikkalasi list"], "target hodisa kelib chiqqan element."),
      ch("Delegatsiya afzalliklaridan biri?", "Keyin qo'shilgan elementlar ham avtomatik ishlaydi", ["Hodisa tezroq", "Faqat bitta element uchun", "Bubbling kerak emas"], "Tinglovchi ota da turadi."),
      ch("Delegatsiyada e.target ichki <span> bo'lsa, li ni qanday topasiz?", "e.target.closest('li')", ["e.target.parent", "e.currentTarget", "document.li"], "closest ajdodlar bo'ylab selektorga mos birinchisini topadi."),
      ch("preventDefault() nima qiladi?", "Brauzerning standart xatti-harakatini to'xtatadi (havolaga o'tish, forma yuborish)", ["Ko'tarilishni to'xtatadi", "Tinglovchini o'chiradi", "Hodisani o'chiradi"], "stopPropagation bilan adashtirmang."),
      ch("stopPropagation() nima qiladi?", "Hodisaning keyingi elementlarga ko'tarilishini to'xtatadi", ["Standart xatti-harakatni to'xtatadi", "Tinglovchini o'chiradi", "Hech narsa"], "Bir elementdagi qolgan tinglovchilar baribir ishlaydi (stopImmediatePropagation bundan mustasno)."),
      ch("removeEventListener ishlamayapti. Eng ehtimoliy sabab?", "Anonim (yangi) funksiya berilgan: havola bir xil emas", ["Brauzer xatosi", "Hodisa nomi katta harf", "Faqat bir marta olib tashlanadi"], "Bir xil funksiya havolasini saqlang."),
      ch("focus hodisasi bubbling qiladimi?", "Yo'q: focusin/focusout bubbling qiladi", ["Ha", "Faqat capture da", "Faqat input uchun"], "Delegatsiyada focusin ishlatiladi."),
      ch("{ passive: true} nima uchun?", "Brauzer scroll ni tinglovchi tugashini kutmasdan davom ettiradi (silliq scroll)", ["Tinglovchini bir marta ishlatish", "Bubbling ni to'xtatish", "Xotira tejash"], "Passiv tinglovchida preventDefault ishlamaydi."),
      ch("Bir xil funksiya havolasi bilan ikki marta addEventListener qilsak?", "Bir marta ishlaydi (takrorlanmaydi)", ["Ikki marta ishlaydi", "Xato beradi", "Oxirgisi eskisini o'chiradi"], "Bir xil (tur, funksiya, capture) juftlik ikkinchi marta qo'shilmaydi."),
      ch("CustomEvent ma'lumotini qayerdan olamiz?", "e.detail", ["e.data", "e.payload", "e.value"], "new CustomEvent('x', { detail })."),
    ],
  });

  /* 29 */
  lesson({
    title: 'Timerlar, debounce, throttle',
    intro: "setTimeout, setInterval, requestAnimationFrame, debounce va throttle.",
    theory: {
      analogy: { icon: '⏱️', title: 'Lift eshigi va kran', text: "Debounce — lift eshigi: har yangi odam kelganda yopilish vaqti qayta boshlanadi; hech kim kelmay qolganda yopiladi. Throttle — kran: qancha bosmang, sekundiga ko'pi bilan bir tomchi." },
      sections: [
        { heading: 'Timerlar', text: "setTimeout(fn, ms) — fn ni KAMIDA ms dan keyin bajarish (aniq vaqt kafolatlanmaydi: stek band bo'lsa kechikadi). setInterval — takrorlash; callback ish vaqti interval dan oshsa, chaqiruvlar to'planib qolishi mumkin. Tozalash: clearTimeout / clearInterval. requestAnimationFrame (rAF) — keyingi chizishdan oldin bajariladi (animatsiya uchun; ko'rinmas tabda to'xtaydi)." },
        { code: { lang: 'js', text: "// debounce: oxirgi chaqiruvdan keyin ms o'tgach bir marta\nfunction debounce(fn, ms) {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), ms);\n  };\n}\n\n// throttle: ms ichida eng ko'pi bilan bir marta\nfunction throttle(fn, ms) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= ms) { last = now; fn(...args); }\n  };\n}\n\nconst search = debounce(q => console.log('qidir', q), 300);\nsearch('a'); search('ab'); search('abc');   // faqat 'abc' bilan, bir marta" } },
        { table: { head: ['', 'Debounce', 'Throttle'], rows: [['Mantiq', "Tinchlik kutadi, oxirgisini bajaradi", "Vaqt oralig'ida bittasini bajaradi"], ['Qo\'llanilishi', "Qidiruv inputi, o'lcham o'zgarishi tugashi", "Scroll, mousemove, resize jarayoni"], ['Chaqiruv soni', "Faqat tinchlikdan keyin 1 ta", "Har oraliqda 1 tadan"]] } },
        { bullets: ["setTimeout(fn, 0) macrotask: sinxron kod va microtask lardan keyin.", "Cheksiz setInterval ni tozalamaslik — xotira oqishi va keraksiz ish.", "Ichma-ich setTimeout setInterval dan afzal: keyingi chaqiruv oldingisi tugagach rejalashtiriladi.", "Fon tabda brauzer taymerlarni sekinlatadi (≥1 s).", "this va argumentlarni debounce ichida saqlash uchun oddiy function va apply ishlatish mumkin."] },
      ],
      recap: ["Timer kechikishi kamida ms, aniq emas.", "Debounce — tinchlikdan keyin, throttle — oraliqda bittadan.", "clearTimeout/clearInterval bilan tozalang.", "Animatsiya uchun rAF."],
    },
    defs: [
      ['Debounce (kechiktirish, bostirish)', "ketma-ket chaqiruvlar to'xtagandan so'ng ma'lum vaqt o'tib bitta chaqiruvni bajarish."],
      ['Throttle (cheklash)', "funksiyaning belgilangan vaqt oralig'ida ko'pi bilan bir marta bajarilishini ta'minlash."],
      ['requestAnimationFrame', "keyingi ekran chizishdan oldin callback bajaruvchi, animatsiyaga mo'ljallangan brauzer funksiyasi."],
      ['Timer drift (taymer siljishi)', "taymerning belgilangan vaqtdan kechikib ishlashi."],
    ],
    life: [
      ['🛗', 'Lift', "Debounce — eshik har yangi odamga qayta ochiladi, hamma kirib bo'lgach yopiladi."],
      ['🚰', 'Tomchilatgich', "Throttle — nasos qanchalik bosilmasin, sekundiga bir tomchi."],
    ],
    practice: [
      { title: 'Qidiruv debounce', text: "Input ga debounce(300) qo'yib, har harfda emas, yozish to'xtaganda so'rov yuboring." },
      { title: 'Scroll throttle', text: "Scroll da throttle(200) bilan joriy pozitsiyani chiqaring; throttle siz sonini solishtiring." },
    ],
    items: [
      ch("search('a'); search('ab'); search('abc') (300 ms debounce) nechta marta va qaysi argument bilan chaqiriladi?", "Bir marta, 'abc' bilan", ["Uch marta", "Bir marta, 'a' bilan", "Hech qachon"], "Har yangi chaqiruv oldingi timer ni bekor qiladi.", "const search = debounce(q => console.log(q), 300);\nsearch('a'); search('ab'); search('abc');"),
      ch("Debounce va throttle ni to'g'ri moslang.", "Qidiruv inputi — debounce; scroll — throttle", ["Qidiruv — throttle; scroll — debounce", "Ikkalasi ham debounce", "Ikkalasi ham throttle"], "Debounce yozish tugashini kutadi, throttle uzluksiz jarayonda oraliq bilan bajaradi."),
      ch("setTimeout(fn, 100) aniq 100 ms da bajarilishi kafolatlanadimi?", "Yo'q: kamida 100 ms, stek band bo'lsa kechikadi", ["Ha", "Faqat brauzerda", "Faqat Node da"], "Event loop navbati sababli."),
      ch("Quyidagi kodda nima chiqadi?", "3 3 3", ["0 1 2", "0 0 0", "1 2 3"], "var umumiy i, callback lar sikl tugagach bajariladi.", "for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);"),
      ch("clearInterval chaqirilmasa nima bo'ladi?", "Callback abadiy takrorlanadi va xotira/CPU sarflaydi", ["Avtomatik to'xtaydi", "Xato beradi", "Faqat bir marta ishlaydi"], "Komponent o'chirilganda taymerni tozalash kerak."),
      ch("Ichma-ich setTimeout ning setInterval dan afzalligi?", "Keyingi chaqiruv oldingisi tugagach rejalashtiriladi: chaqiruvlar to'planmaydi", ["Tezroq ishlaydi", "Aniqroq vaqt", "Xotira tejaydi"], "Uzoq callback larda setInterval chaqiruvlari yig'ilib qolishi mumkin."),
      ch("Animatsiya uchun nima eng mos?", "requestAnimationFrame", ["setInterval(fn, 16)", "setTimeout(fn, 0)", "while sikli"], "Brauzer chizishiga moslashadi va ko'rinmas tabda to'xtaydi."),
      ch("Throttle(fn, 1000) ga 3 sekund davomida har 100 ms da chaqirilsa, taxminan nechta bajariladi?", "3-4 ta", ["30 ta", "1 ta", "0 ta"], "Har 1000 ms ichida eng ko'pi bilan bittadan."),
      ch("Debounce da 'trailing' va 'leading' farqi?", "leading — birinchi chaqiruvda darhol, trailing — tinchlikdan keyin bajarish", ["Farqi yo'q", "leading oxirgisini bajaradi", "trailing birinchisini bajaradi"], "Ko'pincha trailing ishlatiladi; tugma uchun leading qulay."),
      ch("setTimeout(fn, 0) va Promise.then ning tartibi?", "then avval, keyin setTimeout", ["setTimeout avval", "Tasodifiy", "Bir vaqtda"], "microtask macrotask dan oldin."),
      ch("Fon (ko'rinmas) tabda taymerlar qanday ishlaydi?", "Brauzer ularni sekinlatadi (~1 s dan kam emas)", ["O'zgarmaydi", "To'xtatiladi", "Tezlashadi"], "Energiya tejash uchun."),
      ch("debounce ichida oddiy () => fn(...args) yozilgan. this nima bo'ladi?", "Debounce qilingan funksiyaning this i saqlanmaydi (arrow tashqi this ni oladi)", ["Doim obyektning o'zi", "Doim window", "Doim undefined emas"], "this kerak bo'lsa, oddiy function va fn.apply(this, args) ishlating."),
    ],
  });

  /* 30 */
  lesson({
    title: 'Xotira boshqaruvi',
    intro: "Garbage collection (axlat yig'ish), erishuvchanlik (reachability), xotira oqishi (memory leak) manbalari.",
    theory: {
      analogy: { icon: '🧹', title: 'Hovli tozalovchisi', text: "Hovlida (xotirada) ishlatilmayotgan narsalarni tozalovchi (garbage collector) aylanib yuradi. U 'bu narsaga hali yo'l boryaptimi?' deb so'raydi: yo'l bor — qoldiradi, yo'l uzilgan — olib tashlaydi." },
      sections: [
        { heading: 'Reachability (erishuvchanlik)', text: "Garbage collector (GC — axlat yig'uvchi) 'mark-and-sweep' (belgilab-tozalash) algoritmidan foydalanadi: ildizlardan (global obyekt, joriy stek o'zgaruvchilari, faol closure lar) boshlab erishish mumkin bo'lgan hamma narsani belgilaydi, belgilanmagan obyektlarni o'chiradi. Ikkita obyekt bir-biriga havola qilgani (aylanma havola) ularni tirik qilmaydi — ildizdan erishib bo'lmasa, o'chiriladi." },
        { code: { lang: 'js', text: "let user = { name: 'Ali' };\nlet admin = user;\nuser = null;           // obyekt hali tirik: admin havola ushlab turibdi\nadmin = null;          // endi hech qanday havola yo'q → GC o'chirishi mumkin\n\n// aylanma havola: ildizdan erishilmasa baribir o'chiriladi\nfunction f() { const a = {}, b = {}; a.b = b; b.a = a; }\nf();" } },
        { heading: 'Xotira oqishi (memory leak) manbalari', table: { head: ['Manba', 'Nima uchun oqadi', 'Yechim'], rows: [['Tasodifiy global', "Global o'zgaruvchi ildizga bog'liq, hech qachon tozalanmaydi", "strict mode, let/const"], ['Tozalanmagan taymer/interval', "Callback va uning closure si ushlanib turadi", "clearInterval"], ['Olib tashlanmagan tinglovchi', "Element va closure tirik qoladi", "removeEventListener, AbortSignal"], ['Cheksiz o\'sadigan kesh/massiv', "Havola doim ushlanadi", "Limit, LRU, WeakMap/WeakRef"], ['Ajratilgan DOM tugunlari', "DOM dan olib tashlangan, lekin o'zgaruvchida saqlanadi", "Havolani null qilish"], ['Closure orqali katta ma\'lumot', "Ichki funksiya ota muhitni ushlab turadi", "Keraksiz katta ma'lumotga havolani uzish"]] } },
        { bullets: ["Xotirani qo'lda bo'shatib bo'lmaydi (delete obyektni emas, xossani o'chiradi); havolalarni uzish kerak.", "DevTools → Memory → Heap snapshot / Allocation timeline: ikki surat orasidagi o'sishni solishtirib oqishni topasiz.", "Sinxron katta ajratmalar GC to'xtashlariga (pause) sabab bo'ladi.", "WeakMap/WeakSet/WeakRef kuchsiz havola beradi: GC kalitni o'chirishi mumkin.", "Primitivlar va stek ma'lumotlari funksiya tugashi bilan avtomatik bo'shaydi."] },
      ],
      recap: ["GC erishib bo'lmaydigan obyektlarni o'chiradi.", "Aylanma havola o'zi-o'zidan oqish emas.", "Oqish manbalari: global, taymer, tinglovchi, kesh, DOM havolalari.", "Heap snapshot bilan toping."],
    },
    defs: [
      ['Garbage collection (axlat yig\'ish)', "endi erishib bo'lmaydigan obyektlarni xotiradan avtomatik o'chirish."],
      ['Reachability (erishuvchanlik)', "obyektga ildizdan (global, stek) havolalar zanjiri orqali yetib borish mumkinligi."],
      ['Mark-and-sweep (belgilash va tozalash)', "ildizdan erishiladiganlarni belgilab, qolganini o'chiruvchi GC algoritmi."],
      ['Memory leak (xotira oqishi)', "kerak bo'lmagan obyektlar havola ushlanib qolgani uchun xotirada to'planib borishi."],
      ['Detached DOM node (ajralgan DOM tuguni)', "DOM daraxtidan olib tashlangan, lekin JavaScript havolasi bor tugun."],
    ],
    life: [
      ['🗑️', 'Axlat mashinasi', "Uyda hali foydalanayotgan narsa (havola bor) olib ketilmaydi; hech kim ehtiyoj sezmagan narsa (havola yo'q) olib ketiladi."],
      ['🚰', 'Ochiq kran', "Tozalanmagan interval — ochiq kran: suv (xotira) to'xtovsiz oqadi."],
    ],
    practice: [
      { title: 'Heap snapshot', text: "Tinglovchi olib tashlanmaydigan komponent yasang; ochib-yopib, DevTools Memory da ikki snapshot orasidagi o'sishni toping." },
      { title: 'LRU kesh', text: "Cheksiz o'smaydigan, hajmi cheklangan kesh (Map bilan) yozing." },
    ],
    items: [
      ch("user = null dan keyin obyekt o'chiriladimi (admin = user bo'lgan)?", "Yo'q: admin hali havola ushlab turibdi", ["Ha", "Faqat strict rejimda", "Ha, darhol"], "Obyektga hali ildizdan havola bor.", "let user = { name: 'Ali' };\nlet admin = user;\nuser = null;"),
      ch("a.b = b; b.a = a (aylanma havola), funksiya tugagach?", "GC o'chiradi: ildizdan erishib bo'lmaydi", ["Doim oqish", "Xato", "Hech qachon o'chmaydi"], "Zamonaviy GC aylanma havolani muammo qilmaydi."),
      ch("Quyidagilardan qaysi biri xotira oqishiga olib keladi?", "clearInterval qilinmagan, katta ma'lumotni ushlagan setInterval", ["const o = {} lokal funksiyada", "Funksiya tugashi", "let i ni siklda e'lon qilish"], "Callback va uning muhiti abadiy tirik qoladi."),
      ch("Olib tashlanmagan event listener qanday oqish keltiradi?", "Element va closure ushlanib qoladi", ["Hech qanday", "Faqat tezlikni oshiradi", "Xato beradi"], "Tinglovchi element va closure muhitiga havola ushlab turadi."),
      ch("delete obj.big nima qiladi?", "Xossani o'chiradi; agar boshqa havola bo'lmasa, qiymat GC ga qoladi", ["Obyektni o'chiradi", "Xotirani darhol bo'shatadi", "Hech narsa"], "Xotira qo'lda bo'shatilmaydi."),
      ch("Ajralgan (detached) DOM tuguni nima?", "DOM dan olib tashlangan, lekin o'zgaruvchi hali havola qilib turgan tugun", ["Ko'rinmas element", "Bo'sh element", "Klonlangan element"], "GC uni o'chira olmaydi."),
      ch("Tasodifiy global o'zgaruvchi nega xavfli?", "Global ildiz: hech qachon tozalanmaydi", ["Sekin ishlaydi", "Xato beradi", "Faqat Node da"], "Strict mode xato bilan oldini oladi."),
      ch("Memory leak ni topish vositasi?", "DevTools → Memory → Heap snapshot", ["console.log", "Network paneli", "Lighthouse faqat"], "Ikki suratni solishtiring."),
      ch("WeakMap kesh nima uchun yaxshi?", "Kalit obyekt boshqa joyda o'chirilsa, kesh yozuvi ham o'zi tozalanadi", ["Tezroq", "Ko'proq ma'lumot sig'adi", "JSON ga o'tadi"], "Kuchsiz havola GC ga to'sqinlik qilmaydi."),
      ch("Cheksiz o'sadigan kesh massivi qanday yechiladi?", "Hajm chegarasi (LRU) qo'yish", ["Massivni const qilish", "freeze qilish", "async qilish"], "Eski elementlarni siqib chiqarish."),
      ch("Closure orqali xotira oqishining oldini olish?", "Keraksiz katta ma'lumotga havolani (null) uzish", ["Closure ishlatmaslik", "Faqat arrow ishlatish", "var ishlatish"], "Closure ota muhitni ushlab turadi."),
      ch("Mark-and-sweep da 'ildizlar' nimalar?", "Global obyekt, joriy stek o'zgaruvchilari, faol closure lar", ["Faqat DOM", "Faqat massivlar", "Faqat obyekt literallar"], "Ildizdan erishilganlar tirik hisoblanadi."),
    ],
  });

  /* 31 */
  lesson({
    title: 'Regular expressions',
    intro: "Regex sintaksisi: guruhlar, kvantifikatorlar, lookahead, flag lar, greedy va lazy.",
    theory: {
      analogy: { icon: '🔎', title: 'Naqsh bo\'yicha qidiruv', text: "'Qaysi so'zda 3 ta ketma-ket raqam bor?' kabi savollarni oddiy qidiruv bilan yechib bo'lmaydi. Regular expression (muntazam ifoda) — matndan naqsh (pattern) bo'yicha qidirish tili." },
      sections: [
        { heading: 'Asosiy belgilar', table: { head: ['Belgi', 'Ma\'no'], rows: [['\\d \\w \\s', "raqam, harf/raqam/_, bo'shliq (katta harf — teskarisi: \\D \\W \\S)"], ['. ', "Yangi qatordan boshqa istalgan belgi (s flag bilan hammasi)"], ['^  $', "Qator boshi / oxiri (m flag: har qator)"], ['* + ? {n,m}', "0+, 1+, 0 yoki 1, n dan m gacha"], ['( )  (?: )  (?<nom> )', "Guruh, guruhsiz (capturing yo'q), nomli guruh"], ['[abc] [^abc]', "Shu belgilardan biri / dan boshqa"], ['a|b', "a yoki b"], ['\\b', "So'z chegarasi"]] } },
        { code: { lang: 'js', text: "/\\d{3}/.test('ab123');                  // true\n'2024-05-17'.match(/(\\d+)-(\\d+)-(\\d+)/);   // ['2024-05-17','2024','05','17', ...]\n'<b>x</b><b>y</b>'.match(/<b>.*<\\/b>/)[0];    // '<b>x</b><b>y</b>' (greedy: ENG UZUNI)\n'<b>x</b><b>y</b>'.match(/<b>.*?<\\/b>/)[0];   // '<b>x</b>' (lazy: ENG QISQASI)\n'a1b2'.replace(/\\d/g, d => d * 2);          // 'a2b4'\n'a1b2'.replaceAll(/\\d/g, '#');               // 'a#b#'\n/(?<y>\\d{4})-(?<m>\\d{2})/.exec('2024-05').groups.y;   // '2024'\n'price: $5'.match(/(?<=\\$)\\d+/)[0];          // '5' (lookbehind)\n'foobar'.match(/foo(?=bar)/)[0];              // 'foo' (lookahead)" } },
        { heading: 'Flag lar va tuzoqlar', bullets: ["g (global — hammasini), i (katta-kichik harfni farqlamaslik), m (ko'p qator), s (nuqta yangi qatorni ham), u (Unicode), y (sticky).", "g flagli regexp da .test() va .exec() lastIndex ni saqlaydi: ketma-ket chaqirilsa navbat bilan true/false berishi mumkin.", "Nuqtani literal qidirish uchun \\. yozing, aks holda har qanday belgi.", "Greedy (ochko'z) kvantifikatorlar eng uzun moslikni, lazy (?) eng qisqasini oladi.", "Catastrophic backtracking (halokatli orqaga qaytish): ichma-ich takrorlanuvchi naqshlar ((a+)+) uzun matnda tizimni qotirishi mumkin.", "String.match g flag bilan faqat mosliklar massivini (guruhlarsiz), g siz esa guruhlar bilan qaytaradi; matchAll hammasini guruh bilan beradi."] },
      ],
      recap: ["Greedy eng uzun, lazy (?) eng qisqa moslik.", "g flagli regexp da test() lastIndex ni o'zgartiradi.", "Nuqta literal uchun \\. kerak.", "Lookahead (?=...) va lookbehind (?<=...) guruhsiz tekshiradi."],
    },
    defs: [
      ['Regular expression (muntazam ifoda)', "matndan naqsh bo'yicha qidirish va almashtirish uchun ixcham til."],
      ['Quantifier (kvantifikator, miqdor belgisi)', "belgi yoki guruh necha marta takrorlanishini bildiradi: *, +, ?, {n,m}."],
      ['Capture group (ushlovchi guruh)', "qavs ichidagi moslik alohida natija sifatida saqlanadigan qism."],
      ['Lookahead / lookbehind (oldinga / orqaga qarash)', "moslikka kirmaydigan, faqat oldidagi/ortidagi shartni tekshiradigan guruh."],
      ['Backtracking (orqaga qaytish)', "moslik topilmaganda dvigatel oldingi tanlovga qaytib, boshqa variant sinashi."],
    ],
    life: [
      ['🧲', 'Magnit', "Regex — magnit: matn ichidan naqshga mos 'temir bo'laklari' (moslik) ni tortib oladi."],
      ['🍫', 'Greedy va lazy', "Greedy — shokolad barini imkon qadar ko'p tishlash, lazy — eng birinchi bo'lak tugashi bilan to'xtash."],
    ],
    practice: [
      { title: 'Telefon va email', text: "O'zbekiston telefon raqami (+998 XX XXX XX XX) va oddiy email ni tekshiruvchi regex yozing; noto'g'ri holatlarni sinab ko'ring." },
      { title: 'Guruhlar bilan almashtirish', text: "'2024-05-17' ni nomli guruhlar bilan '17.05.2024' ga o'zgartiring." },
    ],
    items: [
      ch("'<b>x</b><b>y</b>'.match(/<b>.*<\\/b>/)[0] natijasi?", "'<b>x</b><b>y</b>'", ["'<b>x</b>'", "'<b>'", "null"], "Greedy .* eng uzun moslikni oladi.", "console.log('<b>x</b><b>y</b>'.match(/<b>.*<\\/b>/)[0]);"),
      ch("Xuddi shu satrda /<b>.*?<\\/b>/ natijasi?", "'<b>x</b>'", ["'<b>x</b><b>y</b>'", "'<b>y</b>'", "null"], "Lazy .*? eng qisqa moslikni oladi."),
      ch("'a1b22'.replace(/\\d/g, '#') natijasi?", "'a#b##'", ["'a#b#'", "'a#b22'", "'a1b22'"], "g flagi barcha raqamlarni, har birini alohida almashtiradi."),
      ch("'a1b22'.replace(/\\d+/g, '#') natijasi?", "'a#b#'", ["'a#b##'", "'a1b#'", "'a#b22'"], "\\d+ ketma-ket raqamlarni bitta moslik sifatida oladi."),
      ch("Natija?", "true, false", ["true, true", "false, false", "false, true"], "g flagli regexp lastIndex ni saqlaydi: ikkinchi test() oldingi joydan davom etadi.", "const re = /a/g;\nconsole.log(re.test('aa'), re.test('a'));"),
      ch("/a.c/.test('a.c') va /a.c/.test('abc') ?", "true va true", ["true va false", "false va true", "false va false"], "Nuqta istalgan belgi; literal nuqta uchun a\\.c."),
      ch("'2024-05'.match(/(?<y>\\d{4})-(?<m>\\d{2})/).groups.m ?", "'05'", ["'2024'", "'5'", "undefined"], "Nomli guruh m ikki raqam."),
      ch("'price: $5'.match(/(?<=\\$)\\d+/)[0] ?", "'5'", ["'$5'", "'price'", "null"], "Lookbehind $ ni moslikka kiritmaydi."),
      ch("'foobar'.match(/foo(?=bar)/)[0] ?", "'foo'", ["'foobar'", "'bar'", "null"], "Lookahead bar ni tekshiradi, lekin moslikka kiritmaydi."),
      ch("\\d{2,3} '12345' da birinchi moslik?", "'123'", ["'12'", "'1234'", "'45'"], "{2,3} greedy: iloji boricha ko'p (3 ta)."),
      ch("^ va $ m flag bilan nima qiladi?", "Har bir QATOR boshi va oxiriga mos keladi", ["Faqat butun matn boshi/oxiri", "Hech narsa", "So'z chegarasi"], "Flag siz faqat butun matn."),
      ch("Catastrophic backtracking nima?", "Ichma-ich takrorlanuvchi naqsh ((a+)+) da uzun matnda eksponensial urinishlar", ["Regex xotirasi to'lishi", "Noto'g'ri sintaksis", "g flag xatosi"], "Server tomonda xizmatni to'xtatishi (ReDoS) mumkin."),
    ],
  });

  /* 32 */
  lesson({
    title: 'JSON, Date, Intl',
    intro: "JSON ning cheklovlari, Date tuzoqlari (oy 0 dan), vaqt mintaqalari va Intl bilan formatlash.",
    theory: {
      analogy: { icon: '🌍', title: 'Xalqaro konferensiya', text: "Bir xil vaqt Toshkentda 15:00, Nyu-Yorkda 06:00. Date ichida vaqt faqat bitta (UTC dan millisekundlar), ko'rsatish esa mintaqaga bog'liq. Intl — tarjimon: sanani, sonni, valyutani har bir til va mamlakat odatiga moslab ko'rsatadi." },
      sections: [
        { heading: 'JSON', code: { lang: 'js', text: "JSON.stringify({ a: undefined, b: () => 1, c: Symbol(), d: NaN, e: new Date(0), f: [undefined] });\n// '{\"d\":null,\"e\":\"1970-01-01T00:00:00.000Z\",\"f\":[null]}'\n//  undefined/funksiya/symbol xossa TASHLANADI; massivda null bo'ladi; NaN → null; Date → ISO satr\n\nJSON.parse('{\"a\":1}', (k, v) => k === 'a' ? v * 2 : v);   // reviver: { a: 2 }\nJSON.parse(\"{'a':1}\");   // SyntaxError (yakka tirnoq yaroqsiz)\nJSON.parse('undefined'); // SyntaxError\n\nJSON.stringify({ a: 1, b: [1, 2] }, null, 2);   // chiroyli (indent)" } },
        { heading: 'Date tuzoqlari', code: { lang: 'js', text: "new Date(2024, 0, 31);              // OY 0 DAN: 0 = yanvar (31 yanvar)\nnew Date(2024, 1, 31);              // 31 fevral mavjud emas → 2 mart\nnew Date('2024-05-17');             // UTC yarim tun deb o'qiladi\nnew Date('2024-05-17T00:00');       // LOKAL yarim tun deb o'qiladi\nnew Date(0).toISOString();          // '1970-01-01T00:00:00.000Z'\nDate.now();                         // millisekundlar (son)\nnew Date('xato').getTime();         // NaN (Invalid Date)\nconst d = new Date(2024, 0, 31); d.setMonth(1);   // 2 mart (31 yanvar → 31 fevral → 2 mart)" } },
        { heading: 'Intl: tilga mos formatlash', code: { lang: 'js', text: "new Intl.NumberFormat('uz-UZ').format(1234567.891);         // '1 234 567,891' (taxminiy ko'rinish, joylashuvga bog'liq)\nnew Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(5);   // '$5.00'\nnew Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(0));   // '1 Jan 1970'\nnew Intl.PluralRules('en').select(1);    // 'one'\nnew Intl.RelativeTimeFormat('en').format(-1, 'day');   // '1 day ago'\n['ä', 'a', 'z'].sort(new Intl.Collator('de').compare);   // ['a', 'ä', 'z']" } },
        { bullets: ["Vaqtni saqlashda UTC (ISO satr yoki ms), ko'rsatishda lokal mintaqadan foydalaning.", "Date mutable: setMonth kabi metodlar o'zgartiradi, nusxa oling: new Date(d).", "getDay() hafta kuni (0 = yakshanba), getDate() oy kuni.", "Sanalarni ayirish millisekund beradi: (b - a) / 86400000 kunlar soni (DST da xato bo'lishi mumkin).", "Yangi Temporal API Date kamchiliklarini bartaraf etish uchun ishlab chiqilmoqda."] },
      ],
      recap: ["JSON: undefined/funksiya tashlanadi, NaN → null, Date → ISO satr.", "Date da oy 0 dan boshlanadi.", "'2024-05-17' UTC, '2024-05-17T00:00' lokal deb o'qiladi.", "Intl — til va mintaqaga mos formatlash."],
    },
    defs: [
      ['JSON (JavaScript Object Notation)', "ma'lumot almashish uchun matnli format; faqat string kalitlar, son, satr, bool, null, massiv, obyekt."],
      ['Serialization (ketma-ketlashtirish)', "obyektni saqlash yoki uzatish uchun matn/baytga aylantirish (JSON.stringify)."],
      ['UTC (koordinatsiyalangan jahon vaqti)', "mintaqaga bog'liq bo'lmagan umumiy vaqt standarti."],
      ['ISO 8601', "sana-vaqtni YYYY-MM-DDTHH:mm:ss.sssZ ko'rinishida yozish xalqaro standarti."],
      ['Intl (xalqarolashtirish API si)', "sana, son, valyuta, saralash va ko'plikni til/mintaqaga moslab formatlovchi o'rnatilgan API."],
    ],
    life: [
      ['✈️', 'Parvoz vaqti', "Samolyot UTC bo'yicha uchadi, har bir shahar o'zining soatini ko'rsatadi: ichki vaqt bitta, ko'rinishi har xil."],
      ['💱', 'Narx yorlig\'i', "Intl — bir xil 1234.5 ni AQShda '1,234.5', Germaniyada '1.234,5' yozadi."],
    ],
    practice: [
      { title: 'JSON tuzoqlari', text: "Undefined, funksiya, NaN, Date, Map va sirkulyar havola bo'lgan obyektni JSON.stringify ga berib natijani tushuntiring." },
      { title: 'Sana hisoblari', text: "Ikki sana orasidagi kunlar sonini hisoblab, DST o'tish kunida xato bo'lishini sinab ko'ring." },
    ],
    items: [
      ch("JSON.stringify({a: undefined, b: 1, c: () => 1}) natijasi?", "'{\"b\":1}'", ["'{\"a\":null,\"b\":1,\"c\":null}'", "'{\"a\":undefined,\"b\":1}'", "Xato"], "undefined va funksiya qiymatli xossalar tashlab ketiladi."),
      ch("JSON.stringify([undefined, NaN]) natijasi?", "'[null,null]'", ["'[undefined,NaN]'", "'[]'", "Xato"], "Massivda undefined va NaN null ga aylanadi."),
      ch("JSON.parse(\"{'a':1}\") natijasi?", "SyntaxError", ["{ a: 1 }", "null", "undefined"], "JSON da faqat qo'sh tirnoq yaroqli."),
      ch("new Date(2024, 0, 31).getMonth() ?", "0", ["1", "31", "12"], "Oylar 0 dan boshlanadi: 0 — yanvar."),
      ch("new Date(2024, 1, 31) qaysi sana?", "2 mart 2024", ["31 fevral", "Invalid Date", "29 fevral"], "Fevral 2024 da 29 kun: ortiqcha kunlar martga o'tadi."),
      ch("new Date('2024-05-17') va new Date('2024-05-17T00:00') farqi?", "Birinchisi UTC, ikkinchisi lokal yarim tun deb o'qiladi", ["Farqi yo'q", "Birinchisi lokal, ikkinchisi UTC", "Ikkalasi xato"], "Faqat sana ko'rinishi UTC deb o'qiladi."),
      ch("new Date('xato').getTime() ?", "NaN", ["0", "undefined", "TypeError"], "Noto'g'ri sana Invalid Date, getTime NaN."),
      ch("Date.now() nimani qaytaradi?", "1970-01-01 UTC dan millisekundlar soni", ["Sana obyekti", "Sekundlar soni", "ISO satr"], "Son (number) qaytaradi."),
      ch("d = new Date(2024, 0, 31); d.setMonth(1) dan keyin sana?", "2 mart 2024", ["29 fevral", "31 fevral", "Invalid Date"], "31 fevral yo'q, ortig'i martga o'tadi."),
      ch("Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(5) ?", "'$5.00'", ["'5 USD'", "'$5'", "'5.00'"], "Valyuta formati belgilangan."),
      ch("Vaqtni bazada qanday saqlash tavsiya qilinadi?", "UTC (ISO satr yoki ms), ko'rsatishda lokal mintaqaga o'tkazish", ["Lokal vaqtda matn sifatida", "Faqat soat va daqiqa", "Foydalanuvchi mintaqasida"], "Mintaqalar va DST chalkashligidan saqlaydi."),
      ch("['ä','a','z'].sort() va Intl.Collator('de').compare bilan sort farqi?", "Oddiy sort kod birligi bo'yicha ('ä' oxirga), Collator tilga mos tartib beradi", ["Farqi yo'q", "Collator sekin", "sort xato beradi"], "Til qoidalariga mos saralash uchun Intl.Collator."),
      ch("JSON.parse reviver (k, v) funksiyasi nima uchun?", "Parse paytida qiymatlarni o'zgartirish (masalan, sana satrini Date ga aylantirish)", ["Xatolarni ushlash", "Chiroyli chiqarish", "Kalitlarni saralash"], "Har bir kalit-qiymat juftligi uchun chaqiriladi."),
    ],
  });

  /* 33 */
  lesson({
    title: 'Design patterns',
    intro: "Module, Singleton, Factory, Observer (Pub/Sub), Strategy, Decorator, Proxy: JavaScript dagi qo'llanilishi.",
    theory: {
      analogy: { icon: '📐', title: 'Qurilish andozalari', text: "Me'morlar har safar yangidan o'ylamaydi: 'qavslar uchun kolonna', 'kirish uchun tambur' kabi sinalgan andozalardan foydalanadi. Design pattern (dizayn andoza) — dasturlashda tez-tez uchraydigan muammoning sinalgan yechimi." },
      sections: [
        { heading: 'Eng ko\'p ishlatiladigan andozalar', table: { head: ['Andoza', 'G\'oya', 'JS dagi misol'], rows: [['Module', "Ichki holatni yashirib, kerakli qismini ochish", "ES modul, closure"], ['Singleton', "Faqat bitta namuna", "Modul eksporti (keshlanadi)"], ['Factory (zavod)', "Yaratish mantig'ini bir joyga yig'ish", "createUser(type)"], ['Observer / Pub-Sub', "Obyektlar o'zgarishga obuna bo'ladi", "addEventListener, EventEmitter"], ['Strategy (strategiya)', "Almashtiriladigan algoritm", "sort(compareFn), obyekt-xarita"], ['Decorator (bezak)', "Funksiya/obyektga xossa qo'shib o'rash", "withLogging(fn), HOC"], ['Proxy (vakil)', "Murojaatlarni ushlab, boshqarish", "new Proxy(obj, handler)"]] } },
        { code: { lang: 'js', text: "// Observer / Pub-Sub\nclass Emitter {\n  #h = new Map();\n  on(e, fn) { (this.#h.get(e) ?? this.#h.set(e, []).get(e)).push(fn); return () => this.off(e, fn); }\n  off(e, fn) { this.#h.set(e, (this.#h.get(e) ?? []).filter(f => f !== fn)); }\n  emit(e, ...a) { (this.#h.get(e) ?? []).forEach(f => f(...a)); }\n}\n\n// Strategy: if/else o'rniga xarita\nconst fee = { card: a => a * 0.02, cash: () => 0 };\nfee['card'](100);   // 2\n\n// Decorator\nconst withLog = fn => (...a) => { console.log('chaqirildi', a); return fn(...a); };\n\n// Proxy (validatsiya)\nconst safe = new Proxy({}, {\n  set(t, k, v) { if (k === 'age' && typeof v !== 'number') throw new TypeError('son bo\\'lsin'); t[k] = v; return true; },\n});" } },
        { heading: 'Qachon kerak, qachon ortiqcha', bullets: ["Andozani muammo paydo bo'lgandan keyin qo'llang: oldindan 'har ehtimolga' ishlatish ortiqcha murakkablik.", "JavaScript da funksiyalar birinchi darajali va closure bor: ko'p andozalar (Strategy, Factory) oddiy funksiya yoki obyekt bilan yoziladi.", "Singleton global holat yaratadi va testlashni qiyinlashtiradi; DI (dependency injection — bog'liqlikni tashqaridan berish) ko'pincha yaxshiroq.", "Observer da obuna bekor qilinmasa, xotira oqishi bo'ladi.", "Redux, React Context, event emitter kabi mashhur kutubxonalar shu andozalarga asoslangan."] },
      ],
      recap: ["Andoza — sinalgan yechim, maqsad emas.", "Observer: obuna va xabar berish; obunani bekor qiling.", "Strategy: if/else ni obyekt-xaritaga almashtirish.", "Singleton testlashni qiyinlashtiradi."],
    },
    defs: [
      ['Design pattern (dizayn andoza)', "dasturiy muammoning keng qo'llaniladigan, sinalgan umumiy yechimi."],
      ['Observer (kuzatuvchi)', "obyektlar (obunachilar) boshqa obyekt o'zgarishi haqida xabar olib turadigan andoza; Pub/Sub uning vositachi orqali varianti."],
      ['Strategy (strategiya)', "almashtiriladigan algoritmlarni alohida funksiya/obyektga ajratib, ish vaqtida tanlash."],
      ['Decorator (bezovchi, o\'rovchi)', "funksiya yoki obyektga yangi imkoniyat qo'shib, asl xulqini o'zgartirmasdan o'rash."],
      ['Proxy (vakil obyekt)', "asl obyekt oldida turib, o'qish/yozish/chaqiruvlarni ushlaydigan va boshqaradigan obyekt."],
    ],
    life: [
      ['📰', 'Gazetaga obuna', "Observer: gazeta (obyekt) yangi son chiqarsa, obunachilarga yetkazadi; obunani bekor qilsangiz, olmaysiz."],
      ['🛎️', 'Resepshn', "Proxy — resepshn: mehmon xonaga to'g'ridan-to'g'ri emas, resepshn orqali kiradi va u tekshiradi."],
    ],
    practice: [
      { title: 'Emitter yozing', text: "on, off, once va emit metodli EventEmitter yozing va obunani bekor qiluvchi funksiya qaytaring." },
      { title: 'if/else dan Strategy ga', text: "Ko'p shartli switch ni obyekt-xaritaga o'zgartiring va yangi holat qo'shishda eski kodni o'zgartirmaslikni tekshiring." },
    ],
    items: [
      ch("Quyidagi kodda Strategy andozasi qayerda?", "fee obyektidagi almashtiriladigan funksiyalarda", ["Emitter klassida", "Proxy ichida", "Decorator da"], "Tanlov kalit orqali, shartlarsiz.", "const fee = { card: a => a * 0.02, cash: () => 0 };\nconst calc = (type, a) => fee[type](a);"),
      fill("fee['card'](100) natijasi? (raqam)", '2', "100 × 0.02 = 2.", null, "const fee = { card: a => a * 0.02, cash: () => 0 };"),
      ch("Observer (Pub/Sub) da obunani bekor qilmaslik oqibati?", "Tinglovchi va uning closure si xotirada qoladi (leak)", ["Hech narsa", "Xato", "Tezlashadi"], "off yoki qaytarilgan unsubscribe chaqirilishi kerak."),
      ch("JavaScript modulining Singleton xossasi qaerdan?", "Modul bir marta bajariladi va keshlanadi", ["Class static", "Object.freeze", "Proxy"], "Har import bitta namunani beradi."),
      ch("Singleton ning asosiy kamchiligi?", "Global holat: testlash qiyin, bog'liqlik yashirin", ["Sekin ishlashi", "Faqat Node da ishlashi", "Ko'p xotira"], "DI (bog'liqlikni tashqaridan berish) ko'pincha yaxshiroq."),
      ch("withLog(fn) qaysi andoza?", "Decorator", ["Singleton", "Factory", "Observer"], "Asl funksiyani o'rab, qo'shimcha xatti-harakat qo'shadi."),
      ch("Proxy ning set trap i nima uchun ishlatiladi?", "Xossaga yozishni ushlab, validatsiya yoki kuzatish uchun", ["Faqat o'qishni ushlash uchun", "Obyektni muzlatish uchun", "Prototype ni almashtirish uchun"], "set trap yozish amalini ushlaydi (Vue reaktivligi ham shunga qurilgan)."),
      ch("Factory andozasi nima beradi?", "Obyekt yaratish mantig'ini bir joyga yig'ish", ["Obyektni o'chirish", "Obyektni nusxalash", "Hodisalarni tinglash"], "createUser('admin') kabi."),
      ch("Andozani qachon qo'llash kerak?", "Muammo paydo bo'lgandan keyin, haqiqiy ehtiyoj bo'lganda", ["Har loyihada oldindan hammasini", "Faqat katta jamoalarda", "Hech qachon"], "Oldindan ortiqcha murakkablik yaratmang."),
      ch("JavaScript da Strategy va Factory nima uchun ko'pincha sodda yoziladi?", "Funksiyalar birinchi darajali va closure bor: oddiy funksiya/obyekt yetarli", ["Class bo'lmagani uchun", "Dvigatel buni talab qilgani uchun", "Brauzer cheklovi"], "Java dan farqli, alohida interfeys/klass shart emas."),
      ch("Pub/Sub va to'g'ridan-to'g'ri Observer farqi?", "Pub/Sub da vositachi (broker) bor: nashr qiluvchi va obunachi bir-birini bilmaydi", ["Farqi yo'q", "Pub/Sub sinxron emas", "Observer faqat DOM da"], "Bog'liqlik kamayadi."),
      ch("Redux store qaysi andozalarni birlashtiradi?", "Observer (subscribe) va yagona holat saqlash (Singleton-ga o'xshash)", ["Faqat Proxy", "Faqat Factory", "Faqat Decorator"], "subscribe orqali o'zgarishlarni kuzatish."),
    ],
  });
};
