// JavaScript, MIDDLE level, lessons 1-4: references and copies, coercion, scope and closures, higher-order functions.
// Items whose prompt is OUT have a passage that check-js-output.cjs really runs and compares with the answer.
module.exports = ({ lesson, ch, fill, order }) => {
  const OUT = 'Konsolga nima chiqadi?';

  /* 1 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Reference, nusxalash va immutability",
    intro: "Primitive va reference farqi, shallow va deep copy, structuredClone va holatni o'zgartirmasdan yangilash.",
    what: "Primitive (oddiy) qiymat o'zgaruvchiga qiymatning o'zi sifatida yoziladi, obyekt esa reference (havola) orqali. Middle dasturchi har safar \"men yangi obyekt yaratdimmi yoki eskisiga ikkinchi nom berdimmi\" degan savolga aniq javob beradi: React holati, kesh va bug'larning katta qismi shunga bog'liq.",
    analogy: { icon: '🏠', title: "Manzil yozilgan qog'oz", text: "Obyekt — uy, o'zgaruvchi — uy manzili yozilgan qog'oz. Qog'ozdan nusxa olsangiz, uy ikkita bo'lib qolmaydi: ikkala qog'oz ham bitta uyga olib boradi." },
    defs: [
      ['Reference (havola)', "Xotiradagi obyektga ko'rsatkich; o'zlashtirishda aynan u nusxalanadi."],
      ['Shallow copy (yuza nusxa)', "Faqat birinchi qavat yangi; ichki obyektlar umumiy qoladi."],
      ['Deep copy (chuqur nusxa)', "Barcha ichma-ich obyektlar ham yangidan yaratiladi."],
      ['Immutability (o\'zgarmaslik)', "Mavjud qiymatni o'zgartirmay, yangi qiymat yasash."],
    ],
    uses: [
      ["React holatini yangilashda", "O'zgargan yo'ldagi har bir obyektdan yangi nusxa yaratasiz."],
      ["Funksiyaga obyekt uzatishda", "Argumentni o'zgartirib qo'ymaslikni nazorat qilasiz."],
      ["Kesh va taqqoslashda", "Reference tengligi arzon \"o'zgardimi\" tekshiruvi bo'ladi."],
    ],
    sections: [
      { heading: 'Argument qanday uzatiladi', text: "JavaScript da argument doim qiymat bo'yicha uzatiladi. Obyektda bu qiymat — havola. Shuning uchun funksiya ichida xossani o'zgartirsangiz tashqarida ko'rinadi, parametrning o'ziga boshqa obyekt yozsangiz ko'rinmaydi.", code: { lang: 'js', text: 'function f(u) {\n  u.name = "B";        // tashqarida ko\'rinadi\n  u = { name: "C" };   // faqat lokal nom o\'zgaradi\n}' } },
      { heading: 'Nusxalash usullari', table: { head: ['Usul', 'Chuqurlik', 'Cheklov'], rows: [['{ ...obj }, [...arr]', 'yuza', 'prototip va getter saqlanmaydi'], ['Object.assign', 'yuza', 'setter larni chaqiradi'], ['structuredClone', 'chuqur', 'funksiya va DOM tugunini nusxalay olmaydi'], ['JSON.parse(JSON.stringify())', 'chuqur', 'Date satrga aylanadi, undefined yo\'qoladi']] } },
      { heading: 'Immutable yangilash', code: { lang: 'js', text: 'const next = {\n  ...state,\n  user: { ...state.user, city: "Buxoro" }\n};\n// o\'zgarmagan shoxlar eski havolada qoladi' } },
      { heading: 'const va freeze', callout: { kind: 'warn', text: "const faqat qayta o'zlashtirishni taqiqlaydi, obyekt ichi o'zgaraveradi. Object.freeze ham yuza: ichki obyektlar muzlamaydi." } },
    ],
    life: [
      ['🛒', "Savatcha yangilanmayapti", "items.push() dan keyin havola o'sha-o'sha, React o'zgarishni sezmaydi."],
      ['📋', "Forma \"bekor qilish\"", "Yuza nusxa olingani uchun ichki manzil maydoni asl obyektda ham o'zgarib ketadi."],
    ],
    tip: "Spread faqat bir qavatni nusxalaydi: nimani o'zgartirsangiz, o'sha yo'lni to'liq nusxalang.",
    mistakes: [
      ['{...obj} ni chuqur nusxa deb o\'ylash.', "structuredClone yoki yo'l bo'ylab nusxalash.", "Ichki obyekt umumiy qoladi."],
      ['[] === [] true deb kutish.', "Mazmunni alohida solishtirish.", "Ikki xil havola hech qachon teng emas."],
      ['const obyektni o\'zgarmas deb bilish.', "Kerak bo'lsa freeze yoki intizom.", "const nomni bog'laydi, qiymatni emas."],
    ],
    recap: [
      "Obyekt o'zgaruvchida havola sifatida turadi.",
      "Spread va Object.assign yuza nusxa.",
      "structuredClone chuqur, lekin funksiyasiz.",
      "Immutable yangilash o'zgargan yo'lni nusxalaydi.",
    ],
    practice: [
      { title: 'Uch qavatli yangilash', text: "state.a.b.c qiymatini asl obyektga tegmasdan o'zgartiring va qaysi havolalar saqlanganini === bilan tekshiring." },
      { title: 'Nusxa usullarini solishtiring', text: "Date, undefined va Map bor obyektni JSON va structuredClone bilan nusxalab, farqni yozing." },
    ],
    items: [
      ch(OUT, "2 1", ["1 1", "2 2", "1 2"], "{ ...a } yuza nusxa: n umumiy emas (b.top alohida), lekin inner obyekti umumiy. inner.x = 2 asl obyektda ham ko'rinadi, top esa yo'q.", 'const a = { top: 1, inner: { x: 1 } };\nconst b = { ...a };\nb.inner.x = 2;\nb.top = 2;\nconsole.log(a.inner.x, a.top);'),
      ch(OUT, "B", ["A", "C", "undefined"], "u.name = \"B\" umumiy obyektni o'zgartiradi; keyingi u = {...} faqat lokal parametrni boshqa obyektga bog'laydi.", 'function f(u) {\n  u.name = "B";\n  u = { name: "C" };\n}\nconst user = { name: "A" };\nf(user);\nconsole.log(user.name);'),
      ch(OUT, "false true", ["true true", "false false", "true false"], "Ikki literal — ikki xil havola; c = a esa o'sha havolaning o'zi.", 'const a = [1];\nconst b = [1];\nconst c = a;\nconsole.log(a === b, a === c);'),
      ch(OUT, "3", ["2", "1", "TypeError"], "const havolani o'zgartirishni taqiqlaydi, massiv ichini emas.", 'const list = [1, 2];\nlist.push(3);\nconsole.log(list.length);'),
      ch(OUT, "1 9", ["1 2", "9 9", "9 2"], "freeze yuza: o.a o'zgarmaydi (strict bo'lmagan rejimda jim), ichki o.b.c esa o'zgaradi.", 'const o = Object.freeze({ a: 1, b: { c: 2 } });\no.a = 9;\no.b.c = 9;\nconsole.log(o.a, o.b.c);'),
      ch(OUT, "string undefined", ["object undefined", "string null", "object function"], "JSON orqali Date satrga aylanadi, qiymati undefined bo'lgan xossa esa butunlay tushib qoladi.", 'const src = { at: new Date(0), skip: undefined };\nconst copy = JSON.parse(JSON.stringify(src));\nconsole.log(typeof copy.at, typeof copy.skip);'),
      ch("structuredClone qaysi qiymatda xato (DataCloneError) beradi?", "Metodli obyektda", ["Map ichidagi Set", "Siklik havolali obyekt", "Ichma-ich Date"], "Funksiyalar klonlanmaydi. Map, Set, Date va siklik havolalar muammosiz klonlanadi."),
      ch("state.user.city ni immutable yangilashda qaysi biri to'g'ri?", "{ ...state, user: { ...state.user, city } }", ["{ ...state, city: city, user: state.user }", "Object.assign(state.user, { city: city })", "{ ...state.user, city: city, user: state }"], "Ildizdan o'zgargan joygacha har bir qavat yangi obyekt bo'lishi kerak."),
      ch("Immutable yangilashda o'zgarmagan state.settings bilan nima bo'ladi?", "Eski havolasi qayta ishlatiladi", ["Chuqur nusxasi yangidan yaratiladi", "undefined bo'lib qoladi", "Avtomatik muzlatiladi"], "Bu structural sharing: arzon va \"o'zgardimi\" ni havola bilan tekshirish mumkin."),
      fill(OUT, "1", "map yangi massiv qaytaradi, lekin elementlar o'sha obyektlar; bu yerda esa yangi obyekt yaratilgani uchun asl qty 1 qoladi.", undefined, 'const items = [{ qty: 1 }];\nconst next = items.map((i) => ({ ...i, qty: i.qty + 1 }));\nconsole.log(items[0].qty);'),
      fill("Barcha ichma-ich obyektlarni ham nusxalaydigan o'rnatilgan funksiya nomini yozing.", "structuredClone", "Brauzer va Node da mavjud global funksiya.", ["structuredClone()", "structuredclone"]),
      order("Immutable yangilash tartibini tuzing.", ["Ildiz obyektdan nusxa ol", "O'zgaradigan ichki qavatni nusxala", "Yangi qiymatni yoz", "Yangi ildizni qaytar"], "Tashqaridan ichkariga nusxalanadi, asl obyektga tegilmaydi."),
    ],
  });

  /* 2 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Coercion va taqqoslash qoidalari",
    intro: "Yashirin tur o'zgarishi, ToPrimitive, == algoritmi, Object.is, ||, ?? va ?.",
    what: "Coercion (tur o'zgarishi) — qiymatning bir turdan boshqasiga o'tishi. Yashirin coercion tasodifiy emas, aniq qoidalar bo'yicha ishlaydi. Middle dasturchi \"JS g'alati\" demaydi: + qachon qo'shadi, qachon ulaydi va == qaysi tomonni songa aylantirishini biladi.",
    analogy: { icon: '💱', title: "Valyuta ayirboshlash shoxobchasi", text: "Ikki xil valyutani solishtirishdan oldin bittasiga o'tkaziladi. JavaScript ham == da qiymatlarni umumiy turga o'tkazadi — kurs jadvali esa spetsifikatsiyada yozilgan." },
    defs: [
      ['Coercion (tur o\'zgarishi)', "Qiymatning boshqa turga aylantirilishi, aniq yoki yashirin."],
      ['ToPrimitive', "Obyektdan primitive olish: avval valueOf yoki toString."],
      ['Falsy qiymatlar', "false, 0, -0, 0n, \"\", null, undefined, NaN."],
      ['Nullish', "Faqat null va undefined."],
    ],
    uses: [
      ["Forma qiymatlari bilan", "input.value doim satr — songa o'zingiz o'tkazasiz."],
      ["Standart qiymat berishda", "0 va \"\" haqiqiy qiymat bo'lsa ?? tanlaysiz."],
      ["API javobini o'qishda", "?. bilan yo'q xossada yiqilmaysiz."],
    ],
    sections: [
      { heading: '+ va boshqa arifmetika', bullets: ["Binar + da bir tomon satr bo'lsa — ulash.", "-, *, /, % doim songa o'tkazadi.", "Hisob chapdan o'ngga: 1 + 2 + \"3\" avval 3 ni beradi.", "[] satrga \"\", {} esa \"[object Object]\" bo'ladi."] },
      { heading: '== qisqacha algoritmi', table: { head: ['Juftlik', 'Nima bo\'ladi'], rows: [['null == undefined', 'true, boshqa hech narsaga teng emas'], ['son == satr', 'satr songa'], ['boolean == x', 'boolean songa'], ['obyekt == primitive', 'obyekt ToPrimitive'], ['NaN == NaN', 'false']] } },
      { heading: 'Uch xil tenglik', code: { lang: 'js', text: 'NaN === NaN            // false\nObject.is(NaN, NaN)    // true\n0 === -0               // true\nObject.is(0, -0)       // false' } },
      { heading: '|| va ??', callout: { kind: 'info', text: "|| chap tomon falsy bo'lsa o'ngini oladi, ?? faqat nullish bo'lsa. ?? ni || yoki && bilan qavssiz aralashtirish sintaksis xatosi." } },
    ],
    life: [
      ['🧾', "Chegirma 0% edi", "discount || 10 yozilgani uchun mijoz baribir 10% oldi."],
      ['🔢', "\"5\" + 1", "Input dan kelgan miqdor qo'shilmay, \"51\" bo'lib ulanib ketdi."],
    ],
    tip: "=== ishlating, turni chegarada (input, URL, localStorage) aniq o'zgartiring.",
    mistakes: [
      ['if (count) bilan 0 ni yo\'qotish.', "count !== undefined deb tekshirish.", "0 falsy, lekin haqiqiy qiymat."],
      ['NaN ni === bilan tekshirish.', "Number.isNaN.", "NaN o'ziga ham teng emas."],
      ['parseInt va Number ni bir xil deb bilish.', "Vazifaga mosini tanlash.", "parseInt(\"12px\") = 12, Number esa NaN."],
    ],
    recap: [
      "+ satrni ko'rsa ulaydi, qolgan amallar songa o'tkazadi.",
      "null faqat undefined ga == bo'ladi.",
      "Object.is NaN va -0 ni to'g'ri ajratadi.",
      "?? faqat null va undefined uchun.",
    ],
    practice: [
      { title: 'Bashorat jadvali', text: "10 ta g'alati ifodani yozib, avval javobini taxmin qiling, keyin konsolda tekshiring." },
      { title: '|| auditi', text: "Loyihangizdagi standart qiymat uchun ishlatilgan || larni ko'rib, qaysilari ?? bo'lishi kerakligini toping." },
    ],
    items: [
      ch(OUT, "33 123", ["123 123", "6 6", "33 6"], "Chapdan: 1 + 2 = 3, keyin 3 + \"3\" = \"33\". Ikkinchisida \"1\" + 2 = \"12\", + 3 = \"123\".", 'console.log(1 + 2 + "3", "1" + 2 + 3);'),
      ch(OUT, "3 21", ["21 21", "3 3", "NaN 21"], "- songa o'tkazadi: \"5\" - 2 = 3. + esa satr bilan ulaydi: \"21\".", 'console.log("5" - 2, "2" + 1);'),
      ch(OUT, "true false", ["true true", "false false", "false true"], "null == undefined maxsus qoida bilan true; null == 0 esa false, chunki null songa aylantirilmaydi.", 'console.log(null == undefined, null == 0);'),
      ch(OUT, "true false", ["false false", "true true", "false true"], "[] == false: ikkalasi 0 ga keladi. Lekin if da [] obyekt bo'lgani uchun truthy, ![] = false.", 'console.log([] == false, ![]);'),
      ch(OUT, "0 10", ["10 10", "0 0", "10 0"], "?? 0 ni haqiqiy qiymat deb saqlaydi, || esa falsy deb almashtiradi.", 'const d = 0;\nconsole.log(d ?? 10, d || 10);'),
      ch(OUT, "false true", ["true true", "false false", "true false"], "NaN === NaN false, Object.is(NaN, NaN) true.", 'console.log(NaN === NaN, Object.is(NaN, NaN));'),
      ch(OUT, "12 NaN", ["12 12", "NaN NaN", "NaN 12"], "parseInt boshidagi raqamlarni o'qiydi, Number butun satr son bo'lishini talab qiladi.", 'console.log(parseInt("12px", 10), Number("12px"));'),
      ch(OUT, "11", ["2", "[object Object]1", "NaN"], "+ obyektdan primitive so'raydi: avval valueOf chaqiriladi va 10 qaytaradi.", 'const price = { valueOf: () => 10, toString: () => "narx" };\nconsole.log(price + 1);'),
      ch("`user.address?.street` da address null bo'lsa natija nima?", "undefined", ["null", "TypeError", "Bo'sh satr"], "?. chap tomon nullish bo'lsa to'xtaydi va doim undefined qaytaradi."),
      fill(OUT, "object", "typeof null tarixiy xato sabab \"object\" qaytaradi.", undefined, 'console.log(typeof null);'),
      fill(OUT, "false", "0.1 + 0.2 ikkilik kasrda 0.30000000000000004 chiqadi (IEEE 754).", undefined, 'console.log(0.1 + 0.2 === 0.3);'),
      order("`\"1\" == true` taqqoslash qadamlarini tartiblang.", ["true songa aylanadi: 1", "Satr bilan son qoldi", "\"1\" songa aylanadi: 1", "1 === 1 natijasi true"], "Boolean avval songa o'tadi, keyin satr ham songa."),
    ],
  });

  /* 3 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Scope, hoisting va closure amalda",
    intro: "Leksik scope, TDZ, closure bilan xususiy holat, sikl savoli va eskirgan closure.",
    what: "Closure (yopilma) — funksiya va u yaratilgan joydagi o'zgaruvchilarga havola. Funksiya qayerda chaqirilsa ham, o'z \"tug'ilgan joyi\"dagi o'zgaruvchilarni ko'radi. Hodisa ishlovchilari, taymerlar, modullar va React hook lari — hammasi shu mexanizm ustida.",
    analogy: { icon: '🎒', title: "Sayohat ryukzagi", text: "Funksiya uyidan chiqayotganda ryukzagiga o'zi ishlatadigan narsalarni oladi. Ryukzakda narsaning rasmi emas, o'zi turadi: keyin o'zgarsa, yangisini ko'radi." },
    defs: [
      ['Lexical scope (leksik ko\'rinish)', "O'zgaruvchi ko'rinishi kod yozilgan joyga qarab aniqlanadi."],
      ['Closure (yopilma)', "Funksiyaning tashqi o'zgaruvchilarga saqlanib qolgan bog'lanishi."],
      ['Hoisting (ko\'tarilish)', "E'lonlar bajarishdan oldin ro'yxatga olinishi."],
      ['TDZ (vaqtinchalik o\'lik zona)', "let/const e'longacha o'qilsa ReferenceError."],
    ],
    uses: [
      ["Xususiy holat kerak bo'lganda", "Hisoblagich, once, kesh."],
      ["Hodisa va taymerlarda", "Ishlovchi qaysi qiymatni ko'rishini bilasiz."],
      ["Funksiya ishlab chiqarishda", "Sozlamani eslab qoladigan funksiya yasaysiz."],
    ],
    sections: [
      { heading: "E'lon turlari", table: { head: ["E'lon", 'Scope', 'Oldin o\'qilsa'], rows: [['var', 'funksiya', 'undefined'], ['let / const', 'blok', 'ReferenceError (TDZ)'], ['function nom() {}', 'blok yoki funksiya', 'ishlaydi'], ['const f = () => {}', 'blok', 'ReferenceError']] } },
      { heading: 'Sikl savoli', code: { lang: 'js', text: 'for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3\nfor (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 0 1 2' }, text: "var da bitta umumiy i bor, let esa har aylanishga yangi bog'lanish yaratadi." },
      { heading: 'Xususiy holat', code: { lang: 'js', text: 'function once(fn) {\n  let done = false, result;\n  return (...args) => {\n    if (!done) { done = true; result = fn(...args); }\n    return result;\n  };\n}' } },
      { heading: 'Eskirgan closure', callout: { kind: 'warn', text: "Funksiya eski renderda yaratilgan bo'lsa, o'sha renderdagi o'zgaruvchilarni ko'radi. React da bu stale closure deb ataladi." } },
    ],
    life: [
      ['🔘', "Ikki marta to'lov", "once bilan o'ralgan funksiya ikkinchi bosishda ishlamaydi."],
      ['⏱️', "Taymer doim 0 ko'rsatadi", "setInterval ishlovchisi birinchi yaratilgandagi qiymatni ushlab qolgan."],
    ],
    tip: "Closure qiymatni emas, o'zgaruvchining o'zini eslaydi.",
    mistakes: [
      ['Closure qiymat nusxasini oladi deb o\'ylash.', "Bog'lanish saqlanadi.", "Keyingi o'zgarish ko'rinadi."],
      ['let hoisting qilinmaydi deyish.', "Qilinadi, lekin TDZ da turadi.", "Shuning uchun tashqi nom ham ko'rinmaydi."],
      ['Katta ma\'lumotni keraksiz ushlab turish.', "Ishlovchini uzish yoki havolani bo'shatish.", "GC uni yig'a olmaydi."],
    ],
    recap: [
      "Scope yozilgan joyga qarab aniqlanadi.",
      "let/const TDZ da, var undefined.",
      "Closure o'zgaruvchining o'ziga bog'lanadi.",
      "let sikl har aylanishda yangi bog'lanish beradi.",
    ],
    practice: [
      { title: 'once va memoize', text: "once(fn) va bitta argumentli memoize(fn) ni closure bilan yozing." },
      { title: 'Sikl savoli', text: "var li sikldagi muammoni uch xil usulda (let, IIFE, bind) tuzating." },
    ],
    items: [
      ch(OUT, "1 2 1", ["1 2 3", "1 1 1", "0 1 0"], "Har bir counter() chaqiruvi alohida n yaratadi; a o'z holatini saqlaydi, b yangidan boshlaydi.", 'function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = counter();\nconst b = counter();\nconsole.log(a(), a(), b());'),
      ch(OUT, "3 3 3", ["0 1 2", "2 2 2", "1 2 3"], "var da bitta i bor; taymerlar ishlaganda sikl tugagan, i = 3.", 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n}'),
      ch(OUT, "0 1 2", ["3 3 3", "1 2 3", "2 1 0"], "let har aylanishda yangi i bog'lanishini yaratadi.", 'for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i));\n}'),
      ch(OUT, "B", ["A", "undefined", "ReferenceError"], "Closure qiymat nusxasini emas, o'zgaruvchini ko'radi: chaqiruv paytida name = \"B\".", 'let name = "A";\nconst show = () => console.log(name);\nname = "B";\nshow();'),
      ch(OUT, "global", ["local", "undefined", "ReferenceError"], "Leksik scope: print global joyda yozilgan, chaqirilgan joy muhim emas.", 'const x = "global";\nfunction print() { console.log(x); }\nfunction run() {\n  const x = "local";\n  print();\n}\nrun();'),
      ch(OUT, "undefined", ["5", "null", "ReferenceError"], "Funksiya ichidagi var v ko'tariladi va tashqi v ni berkitadi; o'qish paytida u hali undefined.", 'var v = 5;\nfunction f() {\n  console.log(v);\n  var v = 10;\n}\nf();'),
      ch(OUT, "ReferenceError", ["tashqi", "undefined", "SyntaxError"], "Blok ichidagi let mode ko'tariladi, lekin TDZ da turadi — tashqi nom ham ko'rinmaydi.", 'const mode = "tashqi";\ntry {\n  {\n    console.log(mode);\n    let mode = "ichki";\n  }\n} catch (e) {\n  console.log(e.name);\n}'),
      ch(OUT, "6 6", ["6 7", "3 3", "6 undefined"], "once birinchi natijani saqlab qoladi, keyingi chaqiruvda fn ishlamaydi.", 'function once(fn) {\n  let done = false, result;\n  return (x) => {\n    if (!done) { done = true; result = fn(x); }\n    return result;\n  };\n}\nconst twice = once((x) => x * 2);\nconsole.log(twice(3), twice(7));'),
      ch("setInterval ichidagi funksiya doim boshlang'ich qiymatni ko'rsatyapti. Eng ehtimoliy sabab?", "Funksiya eski scope ga bog'lanib qolgan", ["Taymer o'zgaruvchini muzlatib qo'yadi", "setInterval qiymatni keshlaydi", "Garbage collector qiymatni qaytaradi"], "Bu stale closure: ishlovchi bir marta yaratilgan va o'sha paytdagi bog'lanishni ko'radi."),
      fill(OUT, "function", "Function declaration to'liq ko'tariladi, shuning uchun e'londan oldin ham funksiya.", undefined, 'console.log(typeof hello);\nfunction hello() {}'),
      fill("let o'zgaruvchisi e'longacha turadigan zonaning qisqartma nomini yozing.", "TDZ", "Temporal Dead Zone — vaqtinchalik o'lik zona.", ["tdz", "Temporal Dead Zone"]),
      order("Closure paydo bo'lish jarayonini tartiblang.", ["Tashqi funksiya chaqiriladi", "Ichki funksiya yaratiladi", "Tashqi funksiya qaytadi", "Ichki funksiya eski o'zgaruvchini o'qiydi"], "Tashqi funksiya tugasa ham, o'zgaruvchi ichki funksiya havolasi tufayli yashaydi."),
    ],
  });

  /* 4 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Higher-order funksiyalar va sof kod",
    intro: "map, filter, reduce, funksiya qaytaruvchi funksiya, currying, pipe va side effect lar.",
    what: "Higher-order function (yuqori tartibli funksiya) — funksiyani argument sifatida oladigan yoki funksiya qaytaradigan funksiya. Pure function (sof funksiya) esa bir xil kirishga bir xil natija beradi va tashqi dunyoni o'zgartirmaydi. Ikkalasi birga kodni kichik, sinaladigan bo'laklarga ajratadi.",
    analogy: { icon: '🏭', title: "Konveyer", text: "Har bir stanok bitta ish qiladi: elaydi, bo'yaydi, o'raydi. Stanoklarni almashtirish yoki qayta tartiblash mumkin, chunki ular bir-birining ichiga qo'l tiqmaydi." },
    defs: [
      ['Higher-order function (yuqori tartibli funksiya)', "Funksiya qabul qiluvchi yoki qaytaruvchi funksiya."],
      ['Pure function (sof funksiya)', "Natijasi faqat argumentlarga bog'liq, tashqi ta'siri yo'q."],
      ['Side effect (yon ta\'sir)', "Tashqi holatni o'zgartirish, tarmoq, DOM, log."],
      ['Currying', "f(a, b) ni f(a)(b) ko'rinishiga o'tkazish."],
    ],
    uses: [
      ["Ro'yxatni qayta ishlashda", "filter, map, reduce zanjiri."],
      ["Takrorlangan mantiqda", "Sozlanadigan funksiya zavodi yozasiz."],
      ["Test yozishda", "Sof funksiya mock siz sinaladi."],
    ],
    sections: [
      { heading: 'Asosiy uchlik', table: { head: ['Metod', 'Qaytaradi', 'Uzunlik'], rows: [['map', 'yangi massiv', 'o\'zgarmaydi'], ['filter', 'yangi massiv', 'teng yoki kichik'], ['reduce', 'istalgan bitta qiymat', '-'], ['forEach', 'undefined', '-']] } },
      { heading: 'reduce bilan guruhlash', code: { lang: 'js', text: 'const byRole = users.reduce((acc, u) => {\n  (acc[u.role] ??= []).push(u.name);\n  return acc;\n}, {});' } },
      { heading: 'pipe', code: { lang: 'js', text: 'const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst slug = pipe((s) => s.trim(), (s) => s.toLowerCase());' } },
      { heading: 'Tuzoqlar', callout: { kind: 'warn', text: "map uch argument uzatadi: (element, indeks, massiv). Shuning uchun [\"1\",\"2\",\"3\"].map(parseInt) kutilmagan natija beradi. Bo'sh massivda boshlang'ich qiymatsiz reduce TypeError tashlaydi." } },
    ],
    life: [
      ['🧮', "Savatcha summasi", "reduce bilan, boshlang'ich qiymat 0 — bo'sh savatcha ham ishlaydi."],
      ['🔎', "Qidiruv va saralash", "filter keyin toSorted: asl ro'yxat buzilmaydi."],
    ],
    tip: "Hisoblashni sof funksiyaga, side effect ni chetga chiqaring.",
    mistakes: [
      ['map ni faqat sikl sifatida ishlatish.', "forEach yoki for...of.", "Qaytgan massiv tashlab yuboriladi."],
      ['reduce da return ni unutish.', "Har qadamda akkumulyator qaytarish.", "Keyingi qadam undefined oladi."],
      ['Argumentni joyida o\'zgartirish.', "Nusxa qaytarish.", "Funksiya sofligini yo'qotadi."],
    ],
    recap: [
      "map, filter yangi massiv qaytaradi.",
      "reduce ga boshlang'ich qiymat bering.",
      "Sof funksiya sinashga eng oson.",
      "map callback uch argument oladi.",
    ],
    practice: [
      { title: 'map ni qayta yozing', text: "reduce yordamida myMap va myFilter yozing." },
      { title: 'Sofga aylantiring', text: "Global o'zgaruvchiga yozadigan funksiyani sof qilib qayta yozing va test qo'shing." },
    ],
    items: [
      ch(OUT, "1,NaN,NaN", ["1,2,3", "1,1,1", "NaN,NaN,NaN"], "parseInt ikkinchi argument sifatida indeksni oladi: parseInt(\"2\",1) va parseInt(\"3\",2) NaN.", 'console.log(["1", "2", "3"].map(parseInt).join(","));'),
      ch(OUT, "TypeError", ["0", "undefined", "NaN"], "Bo'sh massivda boshlang'ich qiymatsiz reduce xato tashlaydi.", 'try {\n  console.log([].reduce((a, b) => a + b));\n} catch (e) {\n  console.log(e.name);\n}'),
      ch(OUT, "20,30", ["2,3", "10,20,30", "30,20"], "filter 1 dan kattalarni qoldiradi, map ularni 10 ga ko'paytiradi.", 'const r = [1, 2, 3].filter((n) => n > 1).map((n) => n * 10);\nconsole.log(r.join(","));'),
      ch(OUT, "2,4 undefined", ["2,4 2,4", "1,2 undefined", "2,4 0"], "forEach doim undefined qaytaradi, map esa yangi massiv.", 'const a = [1, 2].map((n) => n * 2);\nconst b = [1, 2].forEach((n) => n * 2);\nconsole.log(a.join(","), b);'),
      ch(OUT, "6", ["3", "5", "NaN"], "add(1) funksiya qaytaradi, u yana funksiya: 1 + 2 + 3.", 'const add = (a) => (b) => (c) => a + b + c;\nconsole.log(add(1)(2)(3));'),
      ch(OUT, "8", ["7", "9", "16"], "pipe chapdan o'ngga: 3 + 1 = 4, keyin 4 * 2 = 8.", 'const pipe = (...f) => (x) => f.reduce((v, g) => g(v), x);\nconsole.log(pipe((n) => n + 1, (n) => n * 2)(3));'),
      ch("Qaysi funksiya sof (pure)?", "(a, b) => ({ ...a, total: b })", ["(a) => a.push(1)", "() => Date.now()", "(x) => { count += x; return x; }"], "U argumentlarni o'zgartirmaydi va natija faqat ulardan kelib chiqadi."),
      ch("reduce ichida return unutilsa, keyingi qadamda akkumulyator nima bo'ladi?", "undefined", ["Oldingi qiymat", "Joriy element", "Boshlang'ich qiymat"], "Akkumulyator har doim callback qaytargan qiymatdir."),
      ch("Natijasi kerak bo'lmagan, faqat yon ta'sir uchun aylanishda qaysi biri mos?", "for...of yoki forEach", ["map yoki reduceRight", "filter yoki find", "reduce yoki sort"], "map natija massivi uchun; keraksiz massiv yaratmang."),
      fill(OUT, "3", "flatMap map qiladi va bir qavat tekislaydi: [\"a b\", \"c\"] dan 3 ta so'z.", undefined, 'console.log(["a b", "c"].flatMap((s) => s.split(" ")).length);'),
      fill("Funksiyani argument oladigan yoki funksiya qaytaradigan funksiya inglizcha qanday ataladi?", "higher-order function", "Yuqori tartibli funksiya.", ["higher order function", "higher-order", "HOF"]),
      order("pipe(trim, lower, split) ishlash tartibini tuzing.", ["Kirish satri olinadi", "trim bo'shliqlarni kesadi", "lower kichik harfga o'tkazadi", "split massivga bo'ladi"], "pipe chapdan o'ngga, compose esa o'ngdan chapga bajaradi."),
    ],
  });
};
