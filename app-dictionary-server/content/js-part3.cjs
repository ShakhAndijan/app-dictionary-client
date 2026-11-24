// JavaScript, lessons 17-25: collections, symbols, generators, errors, event loop, promises, async/await, fetch.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 17 */
  lesson({
    title: 'Map, Set va Weak kolleksiyalar',
    intro: "Map, Set, WeakMap, WeakSet, WeakRef; obyekt va Map farqi; SameValueZero tengligi.",
    theory: {
      analogy: { icon: '📇', title: 'Kartoteka', text: "Obyekt — faqat matnli yorliqli tortmalar shkafi. Map — har qanday narsa (hatto boshqa obyekt) yorliq bo'la oladigan kartoteka. Set — takrorlanmaydigan elementlar savati. Weak variantlar esa 'yorliq tashlab yuborilsa, kartochka ham o'zi yo'qoladi' degan aqlli kartoteka." },
      sections: [
        { heading: 'Map va obyekt', table: { head: ['', 'Object', 'Map'], rows: [['Kalit tipi', "Satr yoki Symbol (qolgani satrga aylanadi)", 'Har qanday qiymat (obyekt, funksiya, NaN)'], ['Tartib', "Butun sonlar birinchi, keyin qo'shilish tartibi", "Faqat qo'shilish tartibi"], ['Hajm', 'Object.keys(o).length', 'map.size'], ['Prototype kalitlari', "Bor (toString va h.k.)", "Yo'q"], ['Tez qo\'shish/o\'chirish', "Kamroq optimallashgan", 'Optimallashgan']] } },
        { code: { lang: 'js', text: "const o = {};\no[1] = 'a'; o['1'] = 'b';\nObject.keys(o);                 // ['1'] (kalit satrga aylandi, bittagina)\n\nconst m = new Map();\nm.set(1, 'a').set('1', 'b');\nm.size;                         // 2 (1 va '1' farqli)\nm.get(NaN) === undefined;\nm.set(NaN, 'x'); m.get(NaN);    // 'x' (NaN kalit sifatida ishlaydi)\n\nnew Set([1, 1, 2, NaN, NaN]).size;   // 3\n[...new Set([3, 1, 3])];            // [3, 1] (takrorlarni olib tashlash)\nnew Set([{}, {}]).size;             // 2 (har xil obyektlar)" } },
        { heading: 'Tenglik qoidasi', text: "Map va Set kalitlarni SameValueZero algoritmi bilan solishtiradi: === kabi, lekin NaN o'ziga teng deb hisoblanadi, +0 va -0 esa bir xil. Obyektlar esa faqat bir xil havola bo'lsagina teng." },
        { heading: 'Weak kolleksiyalar', bullets: ["WeakMap/WeakSet kalitlari faqat obyekt bo'lishi mumkin (primitiv TypeError beradi).", "Kalit obyektga boshqa havola qolmasa, garbage collector uni (va qiymatini) o'chiradi: memory leak bo'lmaydi.", "Aylanib bo'lmaydi: size, keys, forEach, clear yo'q (chunki tarkibi GC ga bog'liq va noaniq).", "Odatiy qo'llanilishi: obyektga yashirin metama'lumot biriktirish, kesh, private ma'lumot.", "WeakRef — obyektga 'kuchsiz' havola: .deref() obyekt hali tirik bo'lsa uni qaytaradi, aks holda undefined."] },
      ],
      recap: ["Map kaliti har qanday tipda bo'la oladi, obyekt kaliti esa satrga aylanadi.", "Set takrorlarni olib tashlaydi; NaN o'ziga teng (SameValueZero).", "WeakMap/WeakSet faqat obyekt kalit, aylanib bo'lmaydi.", "Weak: GC kalitni olib tashlasa, yozuv ham yo'qoladi."],
    },
    defs: [
      ['Map (xarita)', "kalit-qiymat juftliklari to'plami; kalit har qanday tipda, tartib qo'shilish tartibida saqlanadi."],
      ['Set (to\'plam)', "takrorlanmaydigan qiymatlar to'plami; qo'shilish tartibi saqlanadi."],
      ['SameValueZero (bir xil qiymat, nol bilan)', "Map/Set/includes ishlatadigan tenglik: === ga o'xshash, lekin NaN o'ziga teng."],
      ['WeakMap (kuchsiz xarita)', "kalitlari faqat obyekt bo'lgan va kalitga boshqa havola qolmasa tozalanadigan xarita."],
      ['Garbage collection (axlat yig\'ish)', "endi erishib bo'lmaydigan obyektlarni xotiradan avtomatik o'chirish jarayoni."],
    ],
    life: [
      ['🧳', 'Chamadon yorliqlari', "Weak: yo'lovchi (kalit) ketib qolsa, uning chamadon yorlig'i ham tashlab yuboriladi; oddiy Map esa yorliqni abadiy saqlab, yo'lovchining o'zini ham 'ushlab' turadi."],
      ['🎟️', 'Takrorlanmas chiptalar', "Set — har bir kishiga bitta chipta: ikkinchi marta urinsa, e'tiborsiz qoldiriladi."],
    ],
    practice: [
      { title: 'Takrorlarni olib tashlash', text: "Massivdan takrorlarni Set bilan olib tashlang; obyektlar massivini id bo'yicha Map yordamida tozalang." },
      { title: 'WeakMap kesh', text: "Obyekt bo'yicha hisoblash natijasini WeakMap da keshlaydigan funksiya yozing." },
    ],
    items: [
      fill("m.size necha? (raqam)", '2', "Map da 1 (son) va '1' (satr) alohida kalit.", null, "const m = new Map();\nm.set(1, 'a').set('1', 'b');\nconsole.log(m.size);"),
      ch("Object.keys(o) natijasi?", "['1']", ["['1', '1']", "[1, '1']", "[]"], "Obyekt kalitlari satrga aylanadi: o[1] va o['1'] bitta xossa.", "const o = {};\no[1] = 'a';\no['1'] = 'b';\nconsole.log(Object.keys(o));"),
      fill("new Set([1, 1, 2, NaN, NaN]).size necha? (raqam)", '3', "1, 2 va NaN: NaN o'ziga teng deb hisoblanadi (SameValueZero).", null),
      fill("new Set([{}, {}]).size necha? (raqam)", '2', "Ikki alohida obyekt — har xil havola.", null),
      ch("[...new Set([3, 1, 3, 2, 1])] natijasi?", "[3, 1, 2]", ["[1, 2, 3]", "[3, 1, 3, 2, 1]", "{3, 1, 2}"], "Set qo'shilish tartibini saqlaydi."),
      ch("new WeakMap().set('a', 1) nima beradi?", "TypeError: kalit obyekt bo'lishi shart", ["Ishlaydi", "undefined qaytaradi", "null qaytaradi"], "WeakMap faqat obyekt (va non-registered symbol) kalit qabul qiladi."),
      ch("WeakMap da nega size va forEach yo'q?", "Tarkibi garbage collector ga bog'liq, shuning uchun aniq emas", ["Yangi funksiyalar yetishmaydi", "Xavfsizlik uchun", "Sekin ishlaydi"], "Kalitlar istalgan payt yo'qolishi mumkin."),
      ch("Map ni obyektdan afzal qilish sababi (kalit nuqtai nazaridan)?", "Kalit sifatida obyekt, funksiya, NaN ishlatish mumkin va satrga aylanmaydi", ["Map tezroq yoziladi", "Map JSON ga o'tadi", "Map prototype ga ega"], "Obyektda kalit satr yoki Symbol bo'lishi shart."),
      ch("JSON.stringify(new Map([[1, 'a']])) natijasi?", "'{}'", ["'[[1,\"a\"]]'", "'{\"1\":\"a\"}'", "Xato"], "Map xossalari JSON uchun enumerable emas; Object.fromEntries(map) yoki [...map] kerak."),
      ch("Set operatsiyasi: A = {1,2,3}, B = {2,3,4}. Kesishma (intersection)?", "{2, 3}", ["{1, 4}", "{1, 2, 3, 4}", "{1}"], "Ikkalasida bor elementlar: [...A].filter(x => B.has(x))."),
      ch("WeakRef.deref() obyekt yig'ib olingan bo'lsa nima qaytaradi?", "undefined", ["null", "TypeError", "Obyektning nusxasi"], "deref tirik bo'lsa obyektni, aks holda undefined qaytaradi."),
      ch("Obyekt metama'lumotini private saqlash uchun nima mos?", "WeakMap (obyekt → ma'lumot)", ["Map", "Massiv", "JSON"], "Obyekt o'chirilsa, ma'lumot ham GC ga ketadi: leak yo'q."),
      ch("m.get({}) agar m.set({}, 1) qilingan bo'lsa?", "undefined", ["1", "null", "TypeError"], "Ikkita {} har xil havola: kalit topilmaydi.", "const m = new Map();\nm.set({}, 1);\nconsole.log(m.get({}));"),
    ],
  });

  /* 18 */
  lesson({
    title: 'Symbol va iterator',
    intro: "Symbol (belgi), iterable va iterator protokollari, for...of, spread va maxsus (well-known) symbol lar.",
    theory: {
      analogy: { icon: '🎫', title: 'Noyob chipta', text: "Symbol — hech qachon takrorlanmaydigan noyob chipta: bir xil yozuvli ikki chipta bir-biriga teng emas. Iterator esa 'keyingi' tugmasi bor pult: har bosganda navbatdagi elementni beradi." },
      sections: [
        { heading: 'Symbol', code: { lang: 'js', text: "Symbol('a') === Symbol('a')          // false (har biri noyob)\nSymbol.for('k') === Symbol.for('k')  // true (global reyestr)\n\nconst id = Symbol('id');\nconst u = { name: 'Ali', [id]: 1 };\nObject.keys(u);          // ['name']  (symbol ko'rinmaydi)\nJSON.stringify(u);       // '{\"name\":\"Ali\"}'\nfor (const k in u) {}    // faqat 'name'\nObject.getOwnPropertySymbols(u);  // [Symbol(id)]" } },
        { heading: 'Iterable va iterator protokollari', text: "Iterable (takrorlanuvchi) — [Symbol.iterator]() metodi bor obyekt; bu metod iterator qaytaradi. Iterator (takrorlagich) — next() metodi bor obyekt, u { value, done } qaytaradi. for...of, spread (...), destructuring, Array.from, Map/Set konstruktori iterable bilan ishlaydi. Oddiy obyekt iterable emas." },
        { code: { lang: 'js', text: "const range = {\n  from: 1, to: 3,\n  [Symbol.iterator]() {\n    let cur = this.from, last = this.to;\n    return { next: () => cur <= last ? { value: cur++, done: false } : { value: undefined, done: true } };\n  },\n};\n[...range];                // [1, 2, 3]\nfor (const x of range) {}  // 1, 2, 3\n\nconst o = { a: 1 };\n[...o];                    // TypeError: o is not iterable\n[...'a😀'];                // ['a', '😀'] (satr code point bo'yicha)" } },
        { bullets: ["Well-known symbols (mashhur symbol lar): Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance, Symbol.toStringTag, Symbol.asyncIterator.", "for...of da break qilinsa, iteratorning return() metodi chaqiriladi (resurslarni tozalash uchun).", "Massiv, string, Map, Set, arguments, NodeList — o'rnatilgan iterable lar.", "Symbol tavsifi (description) faqat tuzatish uchun, noyoblikka ta'sir qilmaydi."] },
      ],
      recap: ["Symbol noyob; Symbol.for global reyestrdan oladi.", "Symbol kalitlari keys/JSON/for-in da ko'rinmaydi.", "Iterable: [Symbol.iterator]() → iterator: next() → { value, done }.", "Oddiy obyekt iterable emas."],
    },
    defs: [
      ['Symbol (belgi)', "noyob va o'zgarmas primitiv qiymat; asosan obyekt xossalari uchun to'qnashmaydigan kalit sifatida ishlatiladi."],
      ['Iterable (takrorlanuvchi obyekt)', "[Symbol.iterator]() metodi orqali iterator beradigan obyekt; for...of va spread shuni talab qiladi."],
      ['Iterator (takrorlagich)', "next() metodi { value, done } qaytaradigan obyekt."],
      ['Well-known symbols (mashhur symbol lar)', "tilning ichki xatti-harakatlarini sozlaydigan o'rnatilgan symbol lar (Symbol.iterator, Symbol.toPrimitive)."],
      ['Global symbol registry (global symbol reyestri)', "Symbol.for(kalit) orqali bir xil kalit uchun bir xil symbol beradigan umumiy jadval."],
    ],
    life: [
      ['🎟️', 'Noyob chipta', "Ikkita 'VIP' yozuvli chipta bir xil emas: har birining o'z raqami bor. Symbol('id') ham shunday."],
      ['📺', 'Pult', "next() — 'keyingi kanal' tugmasi: har bosilganda navbatdagi element, kanallar tugasa done: true."],
    ],
    practice: [
      { title: 'Iterable yozing', text: "Fibonacci ketma-ketligini beradigan cheksiz iterable yozing va birinchi 10 tasini oling." },
      { title: 'Symbol kalit', text: "Symbol kalitli xossa yarating va uning keys, JSON.stringify va getOwnPropertySymbols da qanday ko'rinishini tekshiring." },
    ],
    items: [
      ch("Symbol('a') === Symbol('a')?", "false", ["true", "TypeError", "undefined"], "Har bir Symbol() chaqiruvi yangi noyob qiymat beradi."),
      ch("Symbol.for('k') === Symbol.for('k')?", "true", ["false", "TypeError", "undefined"], "Global reyestr bir xil kalitga bir xil symbol beradi."),
      ch("Object.keys(u) natijasi?", "['name']", ["['name', 'Symbol(id)']", "['name', id]", "[]"], "Symbol kalitlari keys da ko'rinmaydi.", "const id = Symbol('id');\nconst u = { name: 'Ali', [id]: 1 };\nconsole.log(Object.keys(u));"),
      ch("JSON.stringify({ a: 1, [Symbol('s')]: 2 }) natijasi?", "'{\"a\":1}'", ["'{\"a\":1,\"s\":2}'", "'{}'", "Xato"], "JSON symbol kalitlarni tashlab ketadi."),
      ch("[...{ a: 1 }] nima beradi?", "TypeError: iterable emas", ["[['a', 1]]", "['a']", "[1]"], "Oddiy obyekt [Symbol.iterator] ga ega emas; Object.entries(o) kerak."),
      ch("[...'a😀'] natijasi?", "['a', '😀']", ["['a', '\\ud83d', '\\ude00']", "['a']", "TypeError"], "Satr iteratsiyasi belgilar (code point) bo'yicha ishlaydi."),
      ch("Iterator next() nima qaytaradi?", "{ value, done } obyekti", ["Faqat qiymat", "Massiv", "Promise"], "done: true bo'lganda iteratsiya tugaydi."),
      ch("range ni [...range] qilish uchun nima yetarli?", "[Symbol.iterator]() metodi next() li obyekt qaytarishi", ["length xossasi", "map metodi", "toString metodi"], "Iterable protokoli shu."),
      ch("for...of da break qilinsa iteratorda nima chaqiriladi?", "return() metodi (bor bo'lsa)", ["throw()", "next() yana bir marta", "Hech narsa"], "Resurslarni tozalashga imkon beradi."),
      ch("Quyidagilardan qaysi biri o'rnatilgan iterable EMAS?", "Oddiy obyekt ({})", ["Massiv", "Map", "String"], "Obyekt iterable emas."),
      ch("Symbol.toPrimitive nima uchun?", "Obyektning primitivga aylanish usulini sozlash uchun", ["Symbol ni songa aylantirish uchun", "Massivni iterable qilish uchun", "JSON uchun"], "obj + 1, `${obj}` kabi holatlarda chaqiriladi."),
      ch("Object.getOwnPropertySymbols(u) nimani qaytaradi?", "O'zining symbol kalitlari massivini", ["Barcha kalitlarni", "Prototype dagi symbol larni", "Faqat satr kalitlarni"], "Symbol kalitlarini ko'rishning rasmiy yo'li."),
    ],
  });

  /* 19 */
  lesson({
    title: 'Generatorlar',
    intro: "function*, yield, next(qiymat), return, throw, yield*, cheksiz ketma-ketliklar va dangasa hisoblash (lazy evaluation).",
    theory: {
      analogy: { icon: '⏯️', title: 'Pauza tugmasi', text: "Oddiy funksiya boshlangach oxirigacha to'xtamay ishlaydi. Generator esa videodagi pauza tugmasi kabi: yield da to'xtaydi, next() bilan davom ettiriladi va har gal tashqariga bitta qiymat beradi." },
      sections: [
        { heading: 'Asosiy xususiyatlar', text: "Generator funksiya (function*) chaqirilganda kodni bajarmaydi, generator obyekti (iterator) qaytaradi. next() chaqirilganda kod birinchi yield gacha bajariladi va { value, done: false } qaytadi. Generator ham iterator, ham iterable bo'lgani uchun for...of va spread bilan ishlaydi. Lazy evaluation (dangasa hisoblash) — qiymat faqat so'ralganda hisoblanadi, shuning uchun cheksiz ketma-ketlik mumkin." },
        { code: { lang: 'js', text: "function* g() {\n  const x = yield 1;      // next(10) dagi 10 shu yerga keladi\n  console.log('x =', x);\n  const y = yield x + 1;\n  return y;\n}\nconst it = g();\nit.next('E');    // { value: 1, done: false }   ('E' e'tiborsiz: birinchi next argumenti yo'q)\nit.next(10);     // x = 10  → { value: 11, done: false }\nit.next(5);      // { value: 5, done: true }\nit.next();       // { value: undefined, done: true }\n\nfunction* nat() { let n = 0; while (true) yield n++; }   // cheksiz\nfunction* take(n, it) { for (const v of it) { if (n-- <= 0) return; yield v; } }\n[...take(3, nat())];   // [0, 1, 2]\n\nfunction* all() { yield* [1, 2]; yield* 'ab'; }   // delegatsiya\n[...all()];            // [1, 2, 'a', 'b']" } },
        { bullets: ["yield ifodasi next(arg) dan kelgan qiymatga baholanadi.", "return(v) generatorni tugatadi: { value: v, done: true }; finally bloklari bajariladi.", "throw(err) yield joyida xato tashlaydi (try/catch bilan ushlash mumkin).", "return orqali berilgan qiymat for...of va spread da ko'rinmaydi (done: true bilan keladi).", "Asinxron generator: async function* va for await...of."] },
      ],
      recap: ["Generator chaqirilganda kodni emas, iteratorni qaytaradi.", "next(arg) qiymatni oldingi yield ga yuboradi.", "Birinchi next ning argumenti e'tiborsiz.", "yield* boshqa iterable ga delegatsiya qiladi."],
    },
    defs: [
      ['Generator (generator funksiya)', "function* bilan e'lon qilinadi, yield da bajarilishini to'xtatib, keyin davom ettira oladigan funksiya."],
      ['yield', "qiymatni tashqariga berib, generatorni to'xtatuvchi kalit so'z; next() dan so'ng shu joydan davom etadi."],
      ['Lazy evaluation (dangasa hisoblash)', "qiymatlarning faqat kerak bo'lganda hisoblanishi; cheksiz ketma-ketliklarga imkon beradi."],
      ['yield* (delegatsiya)', "boshqa iterable yoki generatorning barcha qiymatlarini shu generator nomidan berib chiqish."],
      ['Generator object (generator obyekti)', "function* chaqirilganda qaytadigan, next/return/throw metodli iterator."],
    ],
    life: [
      ['🎬', 'Kinoni pauzaga qo\'yish', "Film pauzaga qo'yildi (yield), kimdir 'davom et' dedi (next) — aynan shu kadrdan boshlanadi."],
      ['🏧', 'Raqam beruvchi avtomat', "Navbat raqamini faqat so'ralganda beradi, cheksiz ketma-ketlikni oldindan chop etib qo'ymaydi."],
    ],
    practice: [
      { title: 'ID generatori', text: "Cheksiz, takrorlanmaydigan id beruvchi generator yozing va uni take(5, ...) bilan oling." },
      { title: 'Ikki tomonlama aloqa', text: "next(qiymat) bilan generatorga ma'lumot yuboradigan 'suhbat' generatori yozing." },
    ],
    items: [
      ch("Quyidagi kod nima chiqaradi?", "x = 10", ["x = E", "x = undefined", "Hech narsa"], "Birinchi next('E') argumenti e'tiborsiz; ikkinchi next(10) 10 ni birinchi yield ifodasiga yuboradi.", "function* g() {\n  const x = yield 1;\n  console.log('x =', x);\n}\nconst it = g();\nit.next('E');\nit.next(10);"),
      ch("it.next() birinchi chaqirilganda natija?", "{ value: 1, done: false }", ["{ value: undefined, done: false }", "1", "{ value: 1, done: true }"], "Birinchi yield gacha bajariladi.", "function* g() { yield 1; yield 2; }\nconst it = g();\nconsole.log(it.next());"),
      ch("[...g()] natijasi?", "[1, 2]", ["[1, 2, 3]", "[1, 2, undefined]", "[3]"], "return qiymati (3) spread da ko'rinmaydi: done: true bilan keladi.", "function* g() { yield 1; yield 2; return 3; }\nconsole.log([...g()]);"),
      ch("Funksiya g() chaqirilishi bilan kodi bajariladimi?", "Yo'q, faqat generator obyekti qaytadi", ["Ha, birinchi yield gacha", "Ha, to'liq", "Faqat birinchi qator"], "Kod birinchi next() da boshlanadi."),
      fill("[...take(3, nat())] ning uzunligi? (raqam)", '3', "take faqat 3 ta qiymat oladi, shundan so'ng return qiladi.", null, "function* nat() { let n = 0; while (true) yield n++; }\nfunction* take(n, it) { for (const v of it) { if (n-- <= 0) return; yield v; } }"),
      ch("[...all()] natijasi?", "[1, 2, 'a', 'b']", ["[[1, 2], 'ab']", "[1, 2]", "TypeError"], "yield* iterable ning qiymatlarini birma-bir beradi.", "function* all() { yield* [1, 2]; yield* 'ab'; }\nconsole.log([...all()]);"),
      ch("it.return(7) dan keyin it.next()?", "{ value: undefined, done: true }", ["{ value: 7, done: true }", "Davom etadi", "TypeError"], "return generatorni tugatadi; keyingi next doim done: true."),
      ch("Nima uchun cheksiz generator xotirani to'ldirmaydi?", "Qiymatlar faqat so'ralganda hisoblanadi (lazy)", ["Brauzer cheklaydi", "Avtomatik to'xtaydi", "Qiymatlar saqlanmaydi, aslida u xato beradi"], "Har next() faqat bitta qiymat hisoblaydi."),
      ch("throw(err) generator ichida qanday ishlaydi?", "yield joyida xato tashlanadi va try/catch ushlay oladi", ["Generatorni o'chiradi", "Hech narsa qilmaydi", "next ga o'tadi"], "Tashqaridan ichkariga xato yuborish usuli."),
      ch("Generator ham iterator ham iterable. Bu nimani anglatadi?", "for...of va next() ikkalasi ham ishlaydi", ["Faqat for...of", "Faqat next()", "Hech qaysi"], "[Symbol.iterator]() generatorning o'zini qaytaradi."),
      ch("async function* va for await...of nima uchun?", "Asinxron ketma-ketlikni (masalan, sahifalar) birma-bir olish uchun", ["Tezroq sikl uchun", "Massivlarni saralash uchun", "Xatolarni ushlash uchun"], "Har yield Promise ga o'ralgan bo'lishi mumkin."),
    ],
  });

  /* 20 */
  lesson({
    title: 'Xatolar',
    intro: "try/catch/finally, Error turlari, maxsus xatolar, error.cause, async xatolar.",
    theory: {
      analogy: { icon: '🛟', title: 'Qutqaruv xizmati', text: "try — xavfli ish, catch — qutqaruvchi brigada, finally — 'baribir' bajariladigan tozalash: ish yaxshi tugadimi yoki yo'q, chiroqni o'chirasiz." },
      sections: [
        { heading: 'Asosiy qurilma', code: { lang: 'js', text: "try {\n  JSON.parse('{xato');\n} catch (e) {\n  console.log(e.name, e instanceof SyntaxError);   // 'SyntaxError' true\n} finally {\n  console.log('har doim');\n}\n\nfunction f() { try { return 'a'; } finally { return 'b'; } }\nf();   // 'b'  (finally ichidagi return natijani bosib ketadi)" } },
        { heading: 'Error turlari', table: { head: ['Tur', 'Qachon'], rows: [['SyntaxError', "Sintaksis noto'g'ri (JSON.parse, eval)"], ['ReferenceError', "E'lon qilinmagan nom yoki TDZ"], ['TypeError', "Noto'g'ri tipdagi amal (undefined.x, const ga yozish)"], ['RangeError', "Qiymat ruxsat etilgan oraliqdan tashqari (stek, new Array(-1))"], ['URIError, EvalError', "Kamdan-kam"], ['AggregateError', "Bir nechta xato (Promise.any)"]] } },
        { heading: 'Maxsus xato va cause', code: { lang: 'js', text: "class AppError extends Error {\n  constructor(msg, opts) { super(msg, opts); this.name = 'AppError'; }\n}\ntry {\n  try { JSON.parse('{'); }\n  catch (e) { throw new AppError('Sozlama buzuq', { cause: e }); }\n} catch (e) {\n  console.log(e.name, e.cause.name);   // 'AppError' 'SyntaxError'\n}" } },
        { heading: 'Asinxron xatolar', bullets: ["try/catch faqat sinxron kodni (va await ni) ushlaydi: setTimeout ichidagi xatoni tashqi try ushlamaydi.", "Promise xatosi .catch() yoki await + try/catch bilan ushlanadi; ushlanmasa unhandledrejection hodisasi.", "throw har qanday qiymatni tashlay oladi (throw 'xato' mumkin), lekin Error tashlash stack trace beradi.", "catch ni parametrsiz yozish mumkin: catch { ... }."] },
      ],
      recap: ["finally har doim bajariladi, ichidagi return natijani bosib ketadi.", "Xato turi: Reference, Type, Syntax, Range.", "Maxsus xato: extends Error, cause bilan zanjir.", "setTimeout xatosini tashqi try ushlamaydi."],
    },
    defs: [
      ['Exception (istisno, xato holati)', "normal bajarilishni to'xtatib, eng yaqin catch gacha ko'tariladigan holat (throw bilan boshlanadi)."],
      ['Stack trace (stek izi)', "xato qayerda va qaysi chaqiruvlar zanjirida yuz berganini ko'rsatuvchi ro'yxat."],
      ['Error cause (xato sababi)', "yangi xato ichiga asl xatoni cause sifatida biriktirish; sabablar zanjirini saqlaydi."],
      ['Custom error (maxsus xato)', "Error dan meros olib, o'z nomi va maydonlari bilan yaratilgan xato klassi."],
      ['Unhandled rejection (ushlanmagan rad etish)', "catch bilan ushlanmagan Promise xatosi."],
    ],
    life: [
      ['🔥', 'Yong\'in signalizatsiyasi', "Xato — signal, catch — javob beruvchi xodim, finally — chiqishda eshiklarni yopish: har doim bajariladi."],
      ['🧾', 'Xato hisoboti', "cause — 'nega buzildi?' degan so'rovga sabablar zanjirini ko'rsatadi: sozlama buzuq ← JSON noto'g'ri."],
    ],
    practice: [
      { title: 'Xato zanjiri', text: "Uch qatlamli funksiya yozing: pastki xato yuqorida AppError({cause}) ga o'ralib, eng yuqorida to'liq zanjir chiqarilsin." },
      { title: 'Asinxron tuzoq', text: "setTimeout ichidagi xatoni tashqi try/catch ushlamasligini namoyish qiling, keyin to'g'ri ushlash usulini yozing." },
    ],
    items: [
      ch("f() natijasi?", "'b'", ["'a'", "undefined", "Xato"], "finally ichidagi return try dagi natijani bosib ketadi.", "function f() {\n  try { return 'a'; } finally { return 'b'; }\n}\nconsole.log(f());"),
      ch("Chiqish tartibi?", "try, catch, finally", ["try, finally", "try, catch", "catch, finally"], "Xato bo'lsa catch, har holda finally.", "try {\n  console.log('try'); null.x;\n} catch {\n  console.log('catch');\n} finally {\n  console.log('finally');\n}"),
      ch("null.x qanday xato beradi?", "TypeError", ["ReferenceError", "SyntaxError", "RangeError"], "null ning xossasiga murojaat TypeError."),
      ch("new Array(-1) qanday xato beradi?", "RangeError", ["TypeError", "SyntaxError", "ReferenceError"], "Noto'g'ri uzunlik: ruxsat etilgan oraliqdan tashqari."),
      ch("Nima chiqadi?", "Xato ushlanmaydi (uncaught)", ["'ushlandi'", "'xato' chiqadi, so'ng 'ushlandi'", "Hech narsa"], "setTimeout callback i keyinroq, try/catch tugagach bajariladi.", "try {\n  setTimeout(() => { throw new Error('x'); }, 0);\n} catch (e) {\n  console.log('ushlandi');\n}"),
      ch("e.cause.name qiymati?", "'SyntaxError'", ["'AppError'", "undefined", "'Error'"], "cause asl xatoni ushlab turadi.", "class AppError extends Error {}\ntry {\n  try { JSON.parse('{'); }\n  catch (e) { throw new AppError('Buzuq', { cause: e }); }\n} catch (e) {\n  console.log(e.cause.name);\n}"),
      ch("throw 'xato' mumkinmi?", "Ha, lekin stack trace bo'lmaydi: Error tashlash afzal", ["Yo'q, SyntaxError", "Faqat son tashlanadi", "Faqat obyekt tashlanadi"], "JavaScript har qanday qiymatni tashlaydi."),
      ch("await bilan chaqirilgan rad etilgan promise ni qanday ushlash mumkin?", "try/catch bilan", ["Ushlab bo'lmaydi", "Faqat .then bilan", "Faqat finally bilan"], "await rad etishni xato sifatida tashlaydi."),
      ch("e instanceof Error uchun class AppError extends Error {} dan new AppError()?", "true", ["false", "undefined", "TypeError"], "Meros zanjiri bo'yicha."),
      ch("catch ni parametrsiz yozish mumkinmi?", "Ha: catch { ... }", ["Yo'q, e shart", "Faqat strict rejimda", "Faqat async da"], "ES2019 dan beri."),
      ch("Quyidagilardan qaysi biri ReferenceError beradi?", "console.log(noSuchVar)", ["null.x", "JSON.parse('{')", "new Array(-1)"], "E'lon qilinmagan nom."),
      ch("finally nima uchun kerak?", "Natijadan qat'i nazar tozalash (resursni yopish, loaderni o'chirish)", ["Xatoni ushlash uchun", "Xatoni ko'tarish uchun", "Asinxronlik uchun"], "return yoki throw bo'lsa ham bajariladi."),
    ],
  });

  /* 21 */
  lesson({
    title: 'Event loop',
    intro: "Call stack, Web API, task queue (macrotask), microtask queue va bajarilish tartibi.",
    theory: {
      analogy: { icon: '🍽️', title: 'Restoran', text: "Oshpaz (call stack) bitta. Ofitsiant (event loop) tayyor buyurtmalarni oshpazga faqat u bo'sh bo'lganda olib keladi. 'VIP buyurtmalar' (microtask — promise) har doim oddiy navbat (macrotask — setTimeout) dan oldin, hatto u yerdagi navbatdagi ishdan oldin ham olib kelinadi." },
      sections: [
        { heading: 'Qismlar', table: { head: ['Qism', 'Vazifa'], rows: [['Call stack', "Hozir bajarilayotgan sinxron kod"], ['Web API / host', "Taymer, tarmoq, DOM hodisalari: stek dan tashqarida kutadi"], ['Task queue (macrotask)', "setTimeout, setInterval, hodisalar, I/O callback lari"], ['Microtask queue', "Promise.then/catch/finally, queueMicrotask, MutationObserver"], ['Event loop', "Stek bo'sh bo'lsa navbatdan keyingi ishni oladi"]] } },
        { heading: 'Qoida', flow: ['Sinxron kod (stek bo\'shaguncha)', 'BARCHA microtask lar (yangilari ham)', 'Brauzer chizishi (render, kerak bo\'lsa)', 'BITTA macrotask', 'Yana microtask lar ...'] },
        { code: { lang: 'js', text: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// 1, 4, 3, 2\n\nPromise.resolve().then(() => {\n  console.log('A');\n  Promise.resolve().then(() => console.log('B'));   // microtask ichida microtask: baribir timer dan oldin\n});\nsetTimeout(() => console.log('C'), 0);\n// A, B, C" } },
        { bullets: ["new Promise((res) => {...}) ichidagi executor SINXRON bajariladi; faqat .then callback lari microtask.", "async funksiyada birinchi await gacha kod sinxron, await dan keyingisi microtask.", "setTimeout(fn, 0) darhol emas: kamida bitta macrotask navbatidan keyin (brauzerda ~1-4 ms minimum).", "Uzun sinxron kod yoki cheksiz microtask zanjiri macrotask va renderni 'ochlikka' mahkum qiladi (starvation).", "Node.js da qo'shimcha: process.nextTick (promise lardan ham oldin), setImmediate."] },
      ],
      recap: ["Sinxron → barcha microtask → (render) → bitta macrotask.", "Promise.then microtask, setTimeout macrotask.", "Executor sinxron, await dan keyingi kod microtask.", "setTimeout 0 hamma sinxron kod va microtask lardan keyin."],
    },
    defs: [
      ['Event loop (hodisalar sikli)', "stek bo'shaganda navbatlardan keyingi ishni olib bajaradigan cheksiz sikl; asinxronlikning markazi."],
      ['Macrotask (katta vazifa)', "setTimeout, hodisa, I/O kabi navbatdagi vazifa; har aylanishda bittadan bajariladi."],
      ['Microtask (kichik vazifa)', "Promise reaksiyalari va queueMicrotask; joriy vazifa tugashi bilan, keyingi macrotask dan oldin, hammasi bajariladi."],
      ['Web API (brauzer interfeyslari)', "setTimeout, fetch, DOM hodisalari kabi brauzer ta'minlaydigan, stek dan tashqarida ishlaydigan imkoniyatlar."],
      ['Starvation (ochlikka qolish)', "birgina uzoq yoki cheksiz vazifa boshqa navbatlarni bajarilishga qo'ymasligi."],
    ],
    life: [
      ['🏥', 'Shifoxona qabuli', "Shifokor (stek) bitta bemor bilan. 'Shoshilinch' (microtask) bemorlar oddiy navbatdan (macrotask) oldin, hatto yangi shoshilinch kelsa ham, hammasi qabul qilinadi."],
      ['🎰', 'Navbat raqamlari', "setTimeout 0 — 'raqam oldim, lekin hamma shoshilinchlar o'tib bo'lgach chaqirilaman'."],
    ],
    practice: [
      { title: 'Tartibni bashorat', text: "Promise, setTimeout, async/await va queueMicrotask aralash 5 ta kodni yozing; avval tartibini yozing, keyin konsolda tekshiring." },
      { title: 'Oqimni bo\'laklash', text: "Katta massivni setTimeout yoki requestIdleCallback bilan bo'laklab qayta ishlang: sahifa qotmasligini tekshiring." },
    ],
    items: [
      ch("Chiqish tartibi?", "1, 4, 3, 2", ["1, 2, 3, 4", "1, 3, 4, 2", "1, 4, 2, 3"], "Sinxron (1, 4), keyin microtask (3), keyin macrotask (2).", "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');"),
      ch("Chiqish tartibi?", "A, B, C", ["A, C, B", "C, A, B", "A, B, C emas, hammasi bir vaqtda"], "Microtask ichidagi microtask ham macrotask (timer) dan oldin bajariladi.", "Promise.resolve().then(() => {\n  console.log('A');\n  Promise.resolve().then(() => console.log('B'));\n});\nsetTimeout(() => console.log('C'), 0);"),
      ch("Chiqish tartibi?", "A, B, D, C", ["A, B, C, D", "A, D, B, C", "B, A, D, C"], "Promise executor sinxron (B), then callback microtask (C).", "console.log('A');\nnew Promise(res => {\n  console.log('B');\n  res();\n}).then(() => console.log('C'));\nconsole.log('D');"),
      ch("Chiqish tartibi?", "a, c, b", ["a, b, c", "c, a, b", "b, a, c"], "await dan oldingi kod sinxron, keyingisi microtask.", "async function f() {\n  console.log('a');\n  await null;\n  console.log('b');\n}\nf();\nconsole.log('c');"),
      ch("Chiqish tartibi?", "1, 3, 2", ["1, 2, 3", "3, 1, 2", "2, 1, 3"], "Ikkala timer ham macrotask; kechikishi kam bo'lgani oldin.", "setTimeout(() => console.log('2'), 10);\nsetTimeout(() => console.log('3'), 0);\nconsole.log('1');"),
      ch("Natija tartibi qanday?", "sync, micro, macro", ["sync, macro, micro", "micro, sync, macro", "macro, sync, micro"], "queueMicrotask promise reaksiyasi kabi microtask.", "setTimeout(() => console.log('macro'), 0);\nqueueMicrotask(() => console.log('micro'));\nconsole.log('sync');"),
      ch("setTimeout(fn, 0) nima uchun darhol bajarilmaydi?", "Callback macrotask navbatiga tushadi va stek bo'shaguncha kutadi", ["Brauzer 0 ni e'tiborsiz qoldiradi", "Xatolik tufayli", "Faqat 100 ms dan keyin ishlaydi"], "0 — minimal kechikish, hamma sinxron va microtask lardan keyin."),
      ch("Cheksiz microtask zanjiri (har then yana then yaratadi) nimaga olib keladi?", "Macrotask va renderni bloklaydi (starvation)", ["Hech narsaga", "Avtomatik to'xtaydi", "Xato beradi"], "Microtask lar to'liq bo'shamaguncha event loop keyingi bosqichga o'tmaydi."),
      ch("Chiqish tartibi?", "1, 2, 3", ["1, 3, 2", "3, 2, 1", "2, 1, 3"], "Hammasi sinxron chaqiruvlar: then bo'lmaganda ketma-ket.", "console.log('1');\n(function () { console.log('2'); })();\nconsole.log('3');"),
      ch("Quyidagilardan qaysi biri macrotask?", "setTimeout callback i", ["Promise.then callback i", "queueMicrotask callback i", "await dan keyingi kod"], "Qolganlari microtask."),
      ch("Uzun while sikli (3 s) davomida setTimeout(fn, 0) qachon ishlaydi?", "Sikl tugagandan keyin", ["Darhol", "Sikl o'rtasida", "Hech qachon"], "Stek band bo'lsa, event loop navbatga qaramaydi."),
      ch("Brauzer chizishi (render) qayerga to'g'ri keladi?", "Microtask lar bo'shagach, macrotask lar orasida", ["Har microtask dan oldin", "Faqat setTimeout da", "Hech qachon"], "Render macrotask lar orasida bajarilishi mumkin."),
    ],
  });

  /* 22 */
  lesson({
    title: 'Callback va Promise',
    intro: "Callback do'zaxi (callback hell), Promise holatlari, then zanjiri, xatolarni uzatish.",
    theory: {
      analogy: { icon: '🍕', title: 'Pitsa buyurtmasi', text: "Callback — 'tayyor bo'lsa, shu raqamga qo'ng'iroq qiling'. Promise esa buyurtma kvitansiyasi: hozircha pitsa yo'q (pending), keyin yoki tayyor bo'ladi (fulfilled) yoki 'xamir tugagan' (rejected). Kvitansiyani ushlab, keyingi rejalarni uning ustiga qurish mumkin." },
      sections: [
        { heading: 'Promise holatlari', table: { head: ['Holat', 'Ma\'no'], rows: [['pending (kutilmoqda)', "Hali natija yo'q"], ['fulfilled (bajarildi)', "resolve(qiymat) chaqirildi"], ['rejected (rad etildi)', "reject(sabab) yoki xato tashlandi"]] } },
        { text: "Promise bir marta 'settled' (hal bo'lgan) bo'ladi: keyingi resolve/reject chaqiruvlari e'tiborsiz. Hal bo'lgan promise holati o'zgarmaydi." },
        { code: { lang: 'js', text: "const p = new Promise((resolve, reject) => {\n  resolve(1);\n  resolve(2);        // e'tiborsiz\n  reject(new Error('x'));  // e'tiborsiz\n});\n\nPromise.resolve(1)\n  .then(v => v + 1)            // 2\n  .then(v => { throw new Error('boom'); })\n  .then(v => console.log('o\\'tkazib yuboriladi'))\n  .catch(e => 'tiklandi')      // zanjir tiklanadi\n  .then(v => console.log(v))   // 'tiklandi'\n  .finally(() => console.log('tugadi'));" } },
        { heading: 'then zanjiri qoidalari', bullets: ["then har doim YANGI promise qaytaradi; callback ning return qiymati keyingi qadamga uzatiladi.", "Callback da promise qaytarilsa, zanjir uning hal bo'lishini kutadi (flatten — yassilash).", "then ichida throw, zanjirni rad etilgan holatga o'tkazadi; catch uni ushlab, normal holatga qaytaradi.", "then ga ikkinchi argument (onRejected) faqat OLDINGI qadam xatosini ushlaydi, o'zining onFulfilled xatosini emas.", "finally qiymatni o'zgartirmaydi (xato tashlamasa), faqat tozalash uchun."] },
        { callout: { kind: 'warn', text: "then ichida promise ni 'return' qilishni unutsangiz, zanjir kutmaydi: keyingi qadam undefined bilan darhol ishga tushadi." } },
      ],
      recap: ["Promise bir marta hal bo'ladi.", "then yangi promise qaytaradi, return qiymati uzatiladi.", "catch zanjirni tiklaydi.", "return unutilsa zanjir kutmaydi."],
    },
    defs: [
      ['Promise (va\'da)', "kelajakdagi natijani (yoki xatoni) ifodalovchi obyekt: pending, fulfilled yoki rejected holatda."],
      ['Callback hell (callback do\'zaxi)', "ichma-ich callback lardan hosil bo'lgan o'qib bo'lmaydigan, xatoni boshqarish qiyin kod."],
      ['Settled (hal bo\'lgan)', "fulfilled yoki rejected; qaytib o'zgarmaydi."],
      ['Promise chaining (promise zanjiri)', "bir nechta then ni ketma-ket ulash; har biri oldingisining natijasini oladi."],
      ['Thenable', "then metodi bor obyekt; Promise kabi qabul qilinadi."],
    ],
    life: [
      ['📦', 'Kuryerlik kvitansiyasi', "Kvitansiya (promise) bor, buyum hali yo'qda (pending). Yetkazilsa (fulfilled) yoki yo'qolsa (rejected) — bir marta aniqlanadi."],
      ['🔗', 'Zanjir', "Har bir bo'g'in oldingisi tugagach boshlanadi; biri uzilsa (xato), keyingilari o'tkazib yuboriladi, to catch topilmaguncha."],
    ],
    practice: [
      { title: 'Callback dan Promise ga', text: "Callback uslubidagi funksiyani Promise qaytaradigan ko'rinishga (promisify) o'zgartiring." },
      { title: 'Zanjir tuzoqlari', text: "then ichida return qilmaslik, throw qilish va catch dan keyin then bo'lgan 3 ta zanjir yozib, natijalarini bashorat qiling." },
    ],
    items: [
      ch("Natija?", "1", ["2", "Xato", "undefined"], "Promise faqat birinchi resolve/reject bilan hal bo'ladi.", "new Promise((res, rej) => {\n  res(1);\n  res(2);\n  rej(new Error('x'));\n}).then(console.log);"),
      ch("Oxirgi then nima chiqaradi?", "'tiklandi'", ["undefined", "Error: boom", "Hech narsa"], "catch xatoni ushlab, qaytargan qiymati bilan zanjirni qayta fulfilled qiladi.", "Promise.resolve()\n  .then(() => { throw new Error('boom'); })\n  .catch(() => 'tiklandi')\n  .then(v => console.log(v));"),
      ch("Natija?", "3", ["1", "undefined", "Promise"], "return qilingan qiymatlar zanjir bo'ylab uzatiladi: 1 + 1 + 1.", "Promise.resolve(1)\n  .then(v => v + 1)\n  .then(v => v + 1)\n  .then(console.log);"),
      ch("Natija?", "undefined", ["10", "Promise", "Xato"], "Promise qaytarilmagan (return yo'q): zanjir kutmaydi va qiymat uzatilmaydi.", "Promise.resolve()\n  .then(() => { Promise.resolve(10); })\n  .then(console.log);"),
      ch("Natija?", "10", ["undefined", "Promise", "Xato"], "Callback da promise qaytarilsa, zanjir uning hal bo'lishini kutadi (yassilash).", "Promise.resolve()\n  .then(() => Promise.resolve(10))\n  .then(console.log);"),
      ch("then(a, b) da b qaysi xatolarni ushlaydi?", "Faqat oldingi qadamning xatosini, a ning xatosini emas", ["a ning xatosini", "Ikkalasini", "Hech birini"], "a ichida xato bo'lsa, undan keyingi qadam ushlaydi."),
      ch("finally nima qiladi?", "Natijadan qat'i nazar bajariladi; qiymatni o'zgartirmaydi", ["Faqat xatoda bajariladi", "Qiymatni almashtiradi", "Zanjirni to'xtatadi"], "Tozalash uchun."),
      ch("Chiqish tartibi?", "A, C, B", ["A, B, C", "B, A, C", "C, A, B"], "then callback i microtask: sinxron C dan keyin.", "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');"),
      ch("Callback hell ning asosiy muammosi?", "O'qish va xatoni boshqarish qiyin (ichma-ich daraxt)", ["Sekin ishlashi", "Brauzer qo'llamasligi", "Xotira ko'p ketishi"], "Promise va async/await shuni tekislaydi."),
      ch("Promise.reject(new Error('x')) catch qilinmasa?", "unhandledrejection hodisasi / konsol ogohlantirishi", ["Hech narsa bo'lmaydi", "Sahifa yopiladi", "Xato avtomatik ushlanadi"], "Ushlanmagan rad etish xato hisoblanadi."),
      ch("Thenable nima?", "then metodi bor obyekt: Promise kabi qabul qilinadi", ["Faqat Promise", "Massiv", "Funksiya"], "await va Promise.resolve thenable larni ham yassilaydi."),
      ch("new Promise ichidagi kod qachon ishga tushadi?", "Darhol, sinxron (executor)", ["then chaqirilganda", "Keyingi macrotask da", "await da"], "Faqat then callback lari asinxron."),
    ],
  });

  /* 23 */
  lesson({
    title: 'Promise kombinatorlari',
    intro: "Promise.all, allSettled, race, any; xatoga munosabat va natija tuzilmasi.",
    theory: {
      analogy: { icon: '🏁', title: 'Poyga turlari', text: "all — hamma yetib kelishi shart (biri to'xtasa, butun jamoa chiqib ketadi). allSettled — hamma yetib kelguncha kutamiz, kim qanday natija ko'rsatganini yozib olamiz. race — birinchi finishga yetgan g'olib (yutgan ham, yiqilgan ham). any — birinchi MUVAFFAQIYATLI g'olib." },
      sections: [
        { table: { head: ['Metod', 'Fulfilled bo\'ladi', 'Rejected bo\'ladi'], rows: [['Promise.all', "Hammasi bajarilsa: natijalar massivi (tartib saqlanadi)", "Birinchi rad etilgan promise sababi bilan, darhol"], ['Promise.allSettled', "Doim: [{status, value | reason}, ...]", "Hech qachon"], ['Promise.race', "Birinchi hal bo'lgan fulfilled bo'lsa", "Birinchi hal bo'lgan rejected bo'lsa"], ['Promise.any', "Birinchi fulfilled", "Hammasi rad etilsa: AggregateError"]] } },
        { code: { lang: 'js', text: "const ok = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));\nconst bad = (m, ms) => new Promise((_, j) => setTimeout(() => j(new Error(m)), ms));\n\nawait Promise.all([ok('a', 30), ok('b', 10)]);        // ['a', 'b'] (tartib: kiritilgan tartib)\nawait Promise.all([ok('a', 30), bad('x', 10)]);       // rad etiladi: Error('x') (10 ms da)\nawait Promise.allSettled([ok('a', 1), bad('x', 1)]);  // [{status:'fulfilled',value:'a'},{status:'rejected',reason:Error}]\nawait Promise.race([ok('a', 30), bad('x', 10)]);      // rad etiladi: Error('x')\nawait Promise.any([bad('x', 10), ok('a', 30)]);       // 'a' (birinchi muvaffaqiyatli)\nawait Promise.any([bad('x', 1), bad('y', 2)]);        // AggregateError" } },
        { bullets: ["all ning natijalari kiritilgan tartibda keladi, hal bo'lish tartibida emas.", "all rad etilganda qolgan promise lar bekor qilinmaydi, ular baribir ishlaydi (faqat natijasi e'tiborsiz).", "race bilan timeout: Promise.race([fetch(...), timeout(3000)]).", "Bo'sh massiv: all → [] ga fulfilled, race → abadiy pending, any → AggregateError.", "Kombinatorlar iterable qabul qiladi, oddiy qiymatlar ham (Promise.resolve ga o'raladi)."] },
      ],
      recap: ["all — hammasi kerak, biri xato bo'lsa rad.", "allSettled — doim fulfilled, har birining holati bilan.", "race — birinchi hal bo'lgani (xato ham).", "any — birinchi muvaffaqiyatli, hammasi xato bo'lsa AggregateError."],
    },
    defs: [
      ['Promise.all', "barcha promise lar bajarilsa natijalar massivini beradi; birinchi rad etilgani butun natijani rad qiladi."],
      ['Promise.allSettled', "barcha promise lar hal bo'lguncha kutadi va har birining holatini (status, value/reason) qaytaradi."],
      ['Promise.race', "birinchi hal bo'lgan promise natijasini (bajarilgan yoki rad) qaytaradi."],
      ['Promise.any', "birinchi muvaffaqiyatli promise ni qaytaradi; hammasi rad bo'lsa AggregateError."],
      ['AggregateError', "bir nechta xatoni errors massivida jamlovchi xato turi."],
    ],
    life: [
      ['🧩', 'Jamoaviy topshiriq', "all — loyiha hamma qismlar tayyor bo'lgandagina topshiriladi, biri bajarilmasa — loyiha rad."],
      ['📊', 'So\'rovnoma natijalari', "allSettled — kimdir javob berdi, kimdir rad etdi: hammasining holati yozib olinadi, hech kim chiqarib tashlanmaydi."],
    ],
    practice: [
      { title: 'Timeout bilan race', text: "Har qanday promise ga timeout qo'shadigan withTimeout(promise, ms) funksiyasini Promise.race bilan yozing." },
      { title: 'Parallel so\'rovlar', text: "3 ta URL ni all va allSettled bilan so'rab, bittasi xato bo'lganda farqni ko'ring." },
    ],
    items: [
      ch("Promise.all([ok('a', 30), ok('b', 10)]) natijasi?", "['a', 'b']", ["['b', 'a']", "'b'", "'a'"], "Natijalar kiritilgan tartibda, hal bo'lish tartibida emas."),
      ch("Promise.all([ok('a', 30), bad('x', 10)]) natijasi?", "Error('x') bilan rad etiladi", ["['a', Error]", "['a']", "Kutadi va fulfilled"], "Birinchi rad etilgan promise butun all ni rad qiladi."),
      ch("Promise.allSettled natijasi qaysi?", "[{ status: 'fulfilled', value: 'a' }, { status: 'rejected', reason: Error }]", ["['a', Error]", "Error", "['a']"], "Har bir element status va value yoki reason bilan."),
      ch("Promise.race([ok('a', 30), bad('x', 10)]) natijasi?", "Error('x') bilan rad etiladi", ["'a'", "['a']", "Hech qachon hal bo'lmaydi"], "Birinchi hal bo'lgan (xato bo'lsa ham) g'olib."),
      ch("Promise.any([bad('x', 10), ok('a', 30)]) natijasi?", "'a'", ["Error('x')", "AggregateError", "['a']"], "any xatolarni o'tkazib birinchi muvaffaqiyatlisini oladi."),
      ch("Promise.any([bad('x', 1), bad('y', 2)]) natijasi?", "AggregateError (errors massivi bilan)", ["Error('x')", "undefined", "[]"], "Hamma rad etilsa AggregateError."),
      ch("Promise.all([]) natijasi?", "[] bilan darhol fulfilled", ["Abadiy pending", "Rad etiladi", "undefined"], "Bo'sh to'plam uchun neytral natija."),
      ch("Promise.race([]) natijasi?", "Abadiy pending", ["[] bilan fulfilled", "Rad etiladi", "undefined"], "Birinchi hal bo'lgani yo'q va bo'lmaydi."),
      ch("all rad etilganda qolgan promise lar nima bo'ladi?", "Bekor qilinmaydi: ishlashda davom etadi, natijasi e'tiborsiz", ["Avtomatik bekor qilinadi", "Xato beradi", "Qayta boshlanadi"], "Promise larni bekor qilib bo'lmaydi; AbortController kerak."),
      ch("Hamma so'rovlarni xato bo'lsa ham kutib, natijalarni ko'rish uchun?", "Promise.allSettled", ["Promise.all", "Promise.race", "Promise.any"], "Hech qachon rad etilmaydi."),
      ch("Promise.race bilan timeout qanday?", "Promise.race([asosiy, timeoutPromise]) — kim oldin hal bo'lsa", ["Promise.all([asosiy, timeout])", "Promise.any([asosiy])", "setTimeout(asosiy)"], "Timeout promise rad etilsa, race ham rad etiladi."),
      ch("Promise.all([1, Promise.resolve(2)]) natijasi?", "[1, 2]", ["Xato", "[1]", "[Promise, 2]"], "Oddiy qiymatlar ham Promise.resolve bilan o'raladi."),
    ],
  });

  /* 24 */
  lesson({
    title: 'async/await',
    intro: "async funksiya, await, xatolar, ketma-ket va parallel bajarish, forEach tuzog'i.",
    theory: {
      analogy: { icon: '☕', title: 'Kafedagi buyurtma', text: "await — 'kofe tayyor bo'lguncha o'tirib kutaman', lekin o'sha vaqt davomida kafe (dastur) boshqa mijozlarga xizmat qilaveradi: kod shu funksiya ichida to'xtaydi, butun dastur emas." },
      sections: [
        { heading: 'Qoidalar', bullets: ["async funksiya DOIM Promise qaytaradi: oddiy qiymat qaytarsa, fulfilled promise ga o'raladi, xato tashlasa — rejected.", "await faqat async funksiya ichida (yoki modul darajasida — top-level await).", "await ifodasi promise hal bo'lguncha funksiyani to'xtatadi va qolgan qismini microtask sifatida davom ettiradi.", "await ni ketma-ket qo'ysangiz, ishlar ketma-ket bajariladi; mustaqil ishlarni Promise.all bilan parallel qiling.", "try/catch rad etilgan promise larni ham ushlaydi (await orqali)."] },
        { code: { lang: 'js', text: "const wait = (ms) => new Promise(r => setTimeout(r, ms));\n\nasync function seq() {            // ~200 ms\n  await wait(100);\n  await wait(100);\n}\nasync function par() {            // ~100 ms\n  await Promise.all([wait(100), wait(100)]);\n}\n\n// forEach async callback ni KUTMAYDI\nasync function bad() {\n  [1, 2, 3].forEach(async (x) => { await wait(10); console.log(x); });\n  console.log('tugadi');          // 'tugadi' birinchi chiqadi\n}\nasync function good() {\n  for (const x of [1, 2, 3]) { await wait(10); console.log(x); }   // ketma-ket\n}\n\nasync function f() { return 1; }\nf() instanceof Promise;           // true" } },
        { heading: 'return await', text: "try ichida return await p yozilsa, p ning rad etilishi shu try/catch da ushlanadi. Faqat return p yozilsa, promise tashqariga qaytib ketadi va xato catch dan o'tib ketadi (ushlanmaydi). Bu ko'p uchraydigan tuzoq." },
        { callout: { kind: 'warn', text: "await ni siklda mustaqil so'rovlar uchun ishlatish sekin: 10 ta so'rov ketma-ket 10 barobar uzoq davom etadi. Mustaqil bo'lsa Promise.all ishlating." } },
      ],
      recap: ["async doim Promise qaytaradi.", "await funksiyani to'xtatadi, dasturni emas.", "Mustaqil ishlar uchun Promise.all.", "forEach + async ishlamaydi, for...of ishlaydi."],
    },
    defs: [
      ['async function (asinxron funksiya)', "doim Promise qaytaradigan va ichida await ishlatiladigan funksiya."],
      ['await', "promise hal bo'lguncha funksiyani to'xtatib, natijani qaytaradigan operator; rad etilsa xato tashlaydi."],
      ['Top-level await (yuqori daraja await)', "ES modullarida funksiyasiz, to'g'ridan-to'g'ri await ishlatish."],
      ['Sequential va parallel (ketma-ket va parallel)', "ishlarni birin-ketin yoki bir vaqtda boshlash; parallelda umumiy vaqt eng uzun ish vaqtiga teng."],
    ],
    life: [
      ['🍳', 'Ikki konfor', "Birinchi konforni yoqib kutish, keyin ikkinchisini — ketma-ket (2x vaqt). Ikkalasini birga yoqish — parallel (1x vaqt)."],
      ['📞', 'Kutish rejimi', "await — qo'ng'iroq kutish rejimi: sizning navbatingiz kelgunicha boshqalar xizmat oladi."],
    ],
    practice: [
      { title: 'Vaqtni o\'lchash', text: "console.time bilan ketma-ket va Promise.all variantlari vaqtini o'lchang." },
      { title: 'return await', text: "try/catch ichida return p va return await p ning farqini rad etilgan promise bilan sinang." },
    ],
    items: [
      ch("async function f() { return 1 } f() nimani qaytaradi?", "Promise (1 bilan fulfilled)", ["1", "undefined", "Obyekt"], "async funksiya doim Promise qaytaradi."),
      ch("async funksiya ichida throw new Error('x') nima qiladi?", "Rad etilgan promise qaytaradi", ["Dasturni to'xtatadi", "Hech narsa", "undefined qaytaradi"], "Xato promise rad etilishiga aylanadi."),
      ch("Quyida nima chiqadi?", "'tugadi', keyin 1, 2, 3", ["1, 2, 3, keyin 'tugadi'", "Faqat 'tugadi'", "Hech narsa"], "forEach async callback larni kutmaydi.", "async function bad() {\n  [1, 2, 3].forEach(async x => { await wait(10); console.log(x); });\n  console.log('tugadi');\n}"),
      fill("seq() taxminan necha ms davom etadi? (raqam)", '200', "Ikkita 100 ms kutish ketma-ket: 200.", null, "async function seq() {\n  await wait(100);\n  await wait(100);\n}"),
      fill("par() taxminan necha ms davom etadi? (raqam)", '100', "Ikkalasi bir vaqtda boshlanadi: eng uzuni 100.", null, "async function par() {\n  await Promise.all([wait(100), wait(100)]);\n}"),
      ch("Natija?", "'ushlandi'", ["Xato ushlanmaydi", "undefined", "'ok'"], "return await rad etishni shu try ichida ushlaydi.", "async function f() {\n  try {\n    return await Promise.reject(new Error('x'));\n  } catch {\n    return 'ushlandi';\n  }\n}\nf().then(console.log);"),
      ch("Xuddi shu kodda return await o'rniga return yozilsa?", "Xato catch da ushlanmaydi, chaqiruvchiga rad etilgan promise ketadi", ["Baribir 'ushlandi'", "undefined", "'ok'"], "return p promise ni tashqariga uzatadi, catch uni 'ko'rmaydi'."),
      ch("Chiqish tartibi?", "1, 3, 2", ["1, 2, 3", "2, 1, 3", "3, 1, 2"], "async funksiya chaqirilganda await gacha sinxron, undan keyin chaqiruvchi kod davom etadi.", "async function f() {\n  console.log('1');\n  await null;\n  console.log('2');\n}\nf();\nconsole.log('3');"),
      ch("10 ta mustaqil so'rovni eng tez bajarish usuli?", "await Promise.all(urls.map(fetch))", ["for ichida await fetch", "forEach + await", "setTimeout bilan"], "Hammasi bir vaqtda boshlanadi."),
      ch("await dan keyingi kod qachon davom etadi?", "Promise hal bo'lgach, microtask sifatida", ["Darhol", "Keyingi macrotask da", "Hech qachon"], "Funksiya holati saqlanib turadi."),
      ch("Modul darajasida (funksiyasiz) await mumkinmi?", "Ha, ES modullarida (top-level await)", ["Yo'q, hech qachon", "Faqat Node da", "Faqat class ichida"], "Modul yuklanishini kutadi."),
      ch("await ni oddiy (async emas) funksiyada ishlatsak?", "SyntaxError", ["Ishlaydi", "undefined qaytaradi", "Promise qaytaradi"], "await faqat async kontekstda."),
    ],
  });

  /* 25 */
  lesson({
    title: 'Fetch va AbortController',
    intro: "fetch, Response, HTTP xatolari, so'rovni bekor qilish (AbortController), timeout va CORS asoslari.",
    theory: {
      analogy: { icon: '📮', title: 'Pochta xizmati', text: "fetch — xat jo'natish. Xat manzilga yetdi (javob keldi) — lekin 'bunday uy yo'q' (404) degan javob ham 'xat yetib bordi' hisoblanadi: fetch faqat tarmoq buzilganda xato beradi. AbortController — 'xatni qaytarib oling' tugmasi." },
      sections: [
        { heading: 'fetch haqida eng muhim tuzoq', text: "fetch HTTP xatolarida (404, 500) rad ETMAYDI. Promise faqat tarmoq xatosi (internet yo'q, CORS rad, DNS) bo'lganda rad etiladi. Shuning uchun response.ok (200-299 oralig'i) yoki response.status ni o'zingiz tekshirishingiz shart." },
        { code: { lang: 'js', text: "async function getUser(id, signal) {\n  const res = await fetch('/api/users/' + id, { signal });\n  if (!res.ok) throw new Error('HTTP ' + res.status);   // 404 ham shu yerga tushadi\n  return res.json();                                    // json() ham Promise qaytaradi\n}\n\nconst ctrl = new AbortController();\nconst p = getUser(1, ctrl.signal);\nctrl.abort();                       // so'rov bekor\ntry { await p; } catch (e) { e.name; }   // 'AbortError'\n\n// timeout (zamonaviy):\nfetch(url, { signal: AbortSignal.timeout(3000) });   // 3 s dan keyin 'TimeoutError'\n\nconst res = await fetch(url);\nawait res.text();\nawait res.json();                   // TypeError: body allaqachon o'qilgan\nres.clone();                        // o'qishdan OLDIN nusxa olish mumkin" } },
        { table: { head: ['Narsa', 'Natija'], rows: [['404 javobi', "fetch fulfilled, res.ok = false"], ['Internet yo\'q', "fetch rad etiladi (TypeError)"], ['abort()', "AbortError bilan rad etiladi"], ['res.json() noto\'g\'ri JSON da', "SyntaxError bilan rad etiladi"]] } },
        { bullets: ["Response tanasi (body) faqat BIR marta o'qiladi; ikki marta o'qish uchun clone().", "POST uchun: method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data).", "Boshqa origin ga so'rovda brauzer CORS (Cross-Origin Resource Sharing — turli manbalar o'rtasida resurs ulashish) ni tekshiradi; server ruxsat berishi shart.", "Cookie yuborish uchun credentials: 'include'.", "Bekor qilingan so'rovni qayta ishlatib bo'lmaydi: yangi AbortController kerak."] },
      ],
      recap: ["fetch 404/500 da rad etmaydi: res.ok ni tekshiring.", "abort() so'rovni AbortError bilan to'xtatadi.", "Body bir marta o'qiladi.", "AbortSignal.timeout(ms) — oson timeout."],
    },
    defs: [
      ['fetch', "HTTP so'rov yuboruvchi brauzer API si; Response uchun Promise qaytaradi."],
      ['Response.ok', "status 200-299 oralig'ida bo'lsa true bo'ladigan xususiyat."],
      ['AbortController (bekor qilish boshqaruvchisi)', "signal beradi va abort() bilan shu signal ulangan so'rovni bekor qiladi."],
      ['CORS (turli manbalar o\'rtasida resurs ulashish)', "brauzerning boshqa domen so'rovlarini cheklovchi xavfsizlik mexanizmi; server sarlavhalari bilan ruxsat beriladi."],
      ['Preflight (oldindan tekshiruv)', "murakkab CORS so'rovdan oldin brauzer yuboradigan OPTIONS so'rovi."],
    ],
    life: [
      ['📮', 'Pochta javobi', "'Bunday manzil yo'q' (404) — pochta ishladi, javob keldi. Xat yo'qolsa (internet yo'q) — bu haqiqiy xato."],
      ['🔙', 'Bekor qilish', "Buyurtmani yo'ldaligida bekor qilish: AbortController."],
    ],
    practice: [
      { title: 'Xavfsiz fetch', text: "!res.ok bo'lsa xato tashlaydigan va JSON qaytaradigan fetchJson(url) yozing." },
      { title: 'Qidiruv bekor qilish', text: "Qidiruv inputida har yangi harfda oldingi so'rovni AbortController bilan bekor qiling." },
    ],
    items: [
      ch("Server 404 qaytardi. fetch promise i qanday?", "Fulfilled, res.ok = false", ["Rejected", "Pending qoladi", "Xato tashlaydi"], "fetch faqat tarmoq xatosida rad etiladi."),
      ch("Internet uzilgan holatda fetch?", "TypeError bilan rad etiladi", ["404 bilan fulfilled", "Pending", "undefined qaytaradi"], "Tarmoq xatosi — haqiqiy rad etish."),
      ch("abort() chaqirilgan so'rov qanday xato bilan tugaydi?", "AbortError", ["TimeoutError", "NetworkError", "TypeError"], "e.name === 'AbortError'."),
      ch("Natija?", "TypeError: body allaqachon o'qilgan", ["Matn qaytadi ikki marta", "undefined", "null"], "Response body bir marta o'qiladi.", "const res = await fetch(url);\nawait res.text();\nawait res.json();"),
      ch("Body ni ikki marta o'qish uchun nima qilinadi?", "O'qishdan OLDIN res.clone()", ["res.reset()", "res.json() ni ikki marta chaqirish", "Imkonsiz"], "clone alohida o'qiladigan nusxa beradi."),
      ch("3 soniyalik timeout ning zamonaviy usuli?", "fetch(url, { signal: AbortSignal.timeout(3000) })", ["fetch(url, { timeout: 3000 })", "setTimeout(fetch, 3000)", "fetch(url).timeout(3000)"], "fetch da timeout parametri yo'q: signal kerak."),
      ch("res.json() ham asinxronmi?", "Ha, Promise qaytaradi", ["Yo'q, sinxron", "Faqat katta javobda", "Faqat Node da"], "Body ni o'qish asinxron."),
      ch("POST da JSON yuborish uchun to'g'ri variant?", "body: JSON.stringify(data) va Content-Type: application/json", ["body: data", "body: JSON.parse(data)", "json: data"], "Obyektni matnga aylantirish kerak."),
      ch("CORS xatosi qayerda yuz beradi?", "Brauzerda: server ruxsat sarlavhasini bermasa so'rov natijasi o'qilmaydi", ["Serverda", "Faqat Node da", "DNS da"], "Server javob beradi, lekin brauzer JS ga bermaydi."),
      ch("Bekor qilingan AbortController ni qayta ishlatish mumkinmi?", "Yo'q: signal doim aborted holatda qoladi; yangisini yarating", ["Ha, reset() bilan", "Ha, avtomatik", "Faqat bir marta"], "Har so'rov uchun yangi controller."),
      ch("Cookie ni boshqa origin ga yuborish uchun?", "credentials: 'include'", ["cookies: true", "withCookies: 1", "mode: 'cookie'"], "Server ham Allow-Credentials sarlavhasini berishi kerak."),
      ch("fetch da 500 javob kelganda to'g'ri xatti-harakat?", "res.ok ni tekshirib, o'zimiz xato tashlash", ["catch avtomatik ishlaydi", "Hech narsa qilmaslik", "Qayta fetch qilish"], "Aks holda xato bilan JSON o'qishga urinasiz."),
    ],
  });
};
