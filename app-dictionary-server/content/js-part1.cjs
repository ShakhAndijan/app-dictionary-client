// JavaScript, lessons 1-8. English terms are followed by their Uzbek translation in parentheses.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 */
  lesson({
    title: 'JS qanday ishlaydi',
    intro: "Dvigatel (engine), JIT kompilyatsiya, host muhit (host environment), ECMAScript va bir oqimli (single-threaded) model.",
    theory: {
      analogy: { icon: '🍳', title: 'Oshxona va oshpaz', text: "JavaScript dvigateli (engine) — oshpaz: retseptni (kodni) o'qib, ovqat qiladi. Lekin oshpaz faqat bitta, ya'ni bir vaqtda bitta ishni bajaradi. Oshxonaning boshqa jihozlari (pech, taymer, kuryer) — brauzer yoki Node.js beradigan host muhit (host environment): ular oshpazning o'zidan alohida ishlaydi va tayyor bo'lganda unga xabar beradi." },
      sections: [
        { heading: 'Til, dvigatel va muhit — uch alohida narsa', text: "ECMAScript — tilning rasmiy spetsifikatsiyasi (specification — me'yoriy hujjat): sintaksis, tiplar, operatorlar nima ekanini aytadi. JavaScript — shu spetsifikatsiyaning eng mashhur amalga oshirilishi. Dvigatel (engine) — kodni o'qib bajaradigan dastur (Chrome va Node.js da V8, Firefox da SpiderMonkey, Safari da JavaScriptCore). Host muhit (host environment) — dvigatel ichiga o'ralgan platforma: brauzerda document, window, fetch, setTimeout, Node.js da fs, process. Ular ECMAScript ning qismi emas, muhit tomonidan beriladi." },
        { table: { head: ['Tushuncha', 'Misol', 'Kim beradi'], rows: [['Til yadrosi', 'Array, Promise, Map, JSON, Math', 'ECMAScript'], ['Brauzer API lari', 'document, fetch, localStorage', 'Brauzer (Web API)'], ['Node API lari', 'fs, process, require', 'Node.js'], ['setTimeout', "Til ichida emas", 'Host muhit (ikkalasi ham beradi)']] } },
        { heading: 'Dvigatel kodni qanday bajaradi', text: "Zamonaviy dvigatellar kodni oddiy 'qatorma-qator o'qish' bilan emas, JIT (Just-In-Time compilation — o'sha zahoti kompilyatsiya) bilan bajaradi. Avval kod tahlil qilinib (parsing — sintaksis tahlili) AST (Abstract Syntax Tree — mavhum sintaksis daraxti) hosil qilinadi, so'ng interpreter (talqinchi) uni bytecode (oraliq kod) ga aylantirib bajaradi. Ko'p chaqirilgan 'issiq' (hot) funksiyalar optimizing compiler (optimallashtiruvchi kompilyator) tomonidan mashina kodiga aylantiriladi. Agar taxmin (masalan, 'bu o'zgaruvchi doim son') buzilsa, deoptimization (optimallashtirishni bekor qilish) sodir bo'ladi." },
        { code: { lang: 'js', text: "// Tiplar doim bir xil bo'lsa, dvigatel tez kod yaratadi\nfunction add(a, b) { return a + b; }\nadd(1, 2); add(3, 4);        // doim son: tez\nadd('a', 'b');                // tip o'zgardi: deoptimizatsiya" } },
        { heading: 'Bir oqimli model', text: "JavaScript da asosiy kod bitta oqimda (thread) bajariladi: bir vaqtning o'zida faqat bitta funksiya ishlaydi. Uzoq davom etadigan sinxron kod (masalan, katta sikl) oqimni 'to'sib qo'yadi' (blocking) — sahifa qotib qoladi. Kutish talab qiladigan ishlar (tarmoq, taymer) host muhitga topshiriladi va tayyor bo'lganda callback (qayta chaqiriladigan funksiya) navbatga qo'yiladi." },
        { callout: { kind: 'info', text: "'use strict' (qat'iy rejim — strict mode) jimgina yutiladigan xatolarni ochiq xatoga aylantiradi: masalan, e'lon qilinmagan o'zgaruvchiga qiymat berish ReferenceError beradi. ES modullari va class ichida u avtomatik yoqiladi." } },
      ],
      recap: ["ECMAScript — spetsifikatsiya, V8 — dvigatel, brauzer/Node — host muhit.", "setTimeout, fetch, document til yadrosiga emas, muhitga tegishli.", "JIT: bytecode, issiq kod esa mashina kodiga aylanadi; tip o'zgarsa deoptimizatsiya.", "Bir oqim: uzoq sinxron kod hamma narsani to'sadi."],
    },
    defs: [
      ['Engine (dvigatel)', "JavaScript kodini tahlil qilib bajaradigan dastur; V8, SpiderMonkey, JavaScriptCore. U tilni biladi, lekin document yoki fetch kabi muhit imkoniyatlarini bilmaydi."],
      ['ECMAScript (til spetsifikatsiyasi)', "JavaScript tilining rasmiy me'yoriy hujjati. Yangi imkoniyatlar (masalan, async/await) avval shu hujjatga kiritiladi, keyin dvigatellar amalga oshiradi. ES2015 (ES6) eng katta yangilanish bo'lgan."],
      ['Host environment (host muhit)', "dvigatelni o'z ichiga olgan va unga qo'shimcha API beradigan platforma: brauzer yoki Node.js. Bir xil til, har xil imkoniyatlar."],
      ['JIT compilation (o\'sha zahotidagi kompilyatsiya)', "kod ishlayotgan vaqtda mashina kodiga aylantirilishi. Interpretatsiya (sodda) va kompilyatsiya (tez) afzalliklarini birlashtiradi."],
      ['Single-threaded (bir oqimli)', "asosiy kod bir vaqtda faqat bitta ishni bajarishi. Parallellik emas, navbatma-navbat bajarish."],
    ],
    life: [
      ['🍽️', 'Restoran oshxonasi', "Oshpaz (dvigatel) bitta, lekin pech va taymerlar (host muhit) alohida ishlaydi. Pechni yoqib qo'yib, oshpaz boshqa taom bilan band bo'ladi: bu asinxronlik."],
      ['🏧', 'Bankomat navbati', "Bankomat bir vaqtda bir odamga xizmat qiladi. Bitta odam juda uzoq tursa, butun navbat to'xtab qoladi: uzoq sinxron kod ham shunday."],
    ],
    practice: [
      { title: 'Muhit farqini ko\'rish', text: "Brauzer konsolida typeof window va typeof document ni, Node da typeof process va typeof require ni tekshiring. Qaysi biri qayerda mavjudligini yozib oling." },
      { title: 'Oqimni to\'sish', text: "Brauzerda 3 soniya davom etadigan while sikli yozib, shu paytda sahifa tugmalari bosilmasligini ko'ring. Keyin shu ishni setTimeout orqali bo'laklarga bo'ling." },
    ],
    items: [
      ch("ECMAScript va JavaScript haqida qaysi gap to'g'ri?", "ECMAScript — til spetsifikatsiyasi, JavaScript uning amalga oshirilishi", ["ECMAScript — brauzer, JavaScript — til", "Ikkalasi mutlaqo boshqa tillar", "ECMAScript — JavaScript ning eski nomi bo'lib, hozir ishlatilmaydi"], "ECMAScript — hujjat (standart), dvigatellar uni amalga oshiradi."),
      ch("Quyidagilardan qaysi biri til yadrosiga (ECMAScript) KIRMAYDI?", "setTimeout", ["Promise", "Array.prototype.map", "JSON.parse"], "setTimeout — host muhit (brauzer yoki Node) beradigan funksiya, spetsifikatsiyada yo'q."),
      ch("Natija qanday tartibda chiqadi?", "1, 3, 2", ["1, 2, 3", "2, 1, 3", "3, 1, 2"], "Callback navbatga tushadi va asosiy kod tugagach bajariladi, hatto kechikish 0 bo'lsa ham.", "console.log(1);\nsetTimeout(() => console.log(2), 0);\nconsole.log(3);"),
      ch("Nima bo'ladi?", "Qat'iy rejimda ReferenceError, oddiy rejimda esa global o'zgaruvchi yaratiladi", ["Doim x = 5 bo'ladi", "Doim SyntaxError", "undefined chiqadi"], "Strict mode e'lon qilinmagan nomga yozishni xatoga aylantiradi.", "function f() { x = 5; }\nf();\nconsole.log(x);"),
      ch("JIT kompilyatsiya nima qiladi?", "Ko'p chaqiriladigan kodni ishlash paytida mashina kodiga aylantirib tezlatadi", ["Kodni oldindan kompilyatsiya qilib .exe yaratadi", "Kodni faqat qatorma-qator talqin qiladi", "Kodni boshqa tilga tarjima qiladi"], "Dvigatel ish paytida profilaktika qiladi va 'issiq' funksiyalarni optimallashtiradi."),
      ch("add(1, 2) ko'p chaqirilib optimallashtirildi, keyin add('a', 'b') chaqirildi. Nima sodir bo'ladi?", "Deoptimizatsiya: taxmin (faqat sonlar) buzildi", ["Xato (TypeError)", "Hech narsa o'zgarmaydi", "Dvigatel to'xtaydi"], "Tiplar o'zgarsa, optimallashtirilgan kod bekor qilinib, sekinroq umumiy kodga qaytiladi."),
      ch("Nega uzoq davom etuvchi sinxron sikl sahifani qotirib qo'yadi?", "Bir oqim band bo'lgani uchun hodisalar va chizish navbatda kutadi", ["Brauzer siklni sevmaydi", "Sikl xotirani to'ldiradi", "setTimeout ishlamay qoladi"], "Asosiy oqim bo'sh bo'lmaguncha bosish va render bajarilmaydi."),
      ch("Node.js da console.log(typeof document) nima chiqaradi?", "undefined", ["object", "function", "ReferenceError"], "document brauzer muhitiga tegishli. typeof e'lon qilinmagan nom uchun xato bermaydi, 'undefined' qaytaradi."),
      ch("globalThis nima uchun kiritilgan?", "Brauzerda window, Node da global o'rniga bitta umumiy nom bo'lishi uchun", ["Faqat Node uchun yangi o'zgaruvchi", "Global o'zgaruvchilarni o'chirish uchun", "Strict mode ni yoqish uchun"], "Muhitdan qat'i nazar global obyektga murojaat qilish imkonini beradi."),
      ch("V8 nima?", "Chrome va Node.js ishlatadigan JavaScript dvigateli", ["Brauzer nomi", "JavaScript kutubxonasi", "CSS dvigateli"], "V8 — Google ning ochiq kodli dvigateli."),
      ch("JavaScript haqida eng aniq tavsif?", "Dinamik tipli, JIT kompilyatsiya qilinadigan, bir oqimli til", ["Statik tipli, faqat talqin qilinadigan til", "Ko'p oqimli, faqat kompilyatsiya qilinadigan til", "Faqat brauzerda ishlaydigan skript"], "Tiplar ish paytida aniqlanadi, dvigatel esa JIT ishlatadi."),
      ch("Strict rejimda oddiy funksiya chaqirilganda ichidagi this nima bo'ladi?", "undefined", ["window", "globalThis", "Funksiyaning o'zi"], "Oddiy rejimda this global obyekt bo'ladi, strict rejimda esa undefined.", "'use strict';\nfunction f() { return this; }\nconsole.log(f());"),
    ],
  });

  /* 2 */
  lesson({
    title: "O'zgaruvchilar va tiplar",
    intro: "var, let, const; primitiv (primitive) va havola (reference) tiplari; qiymat va havola bo'yicha uzatish.",
    theory: {
      analogy: { icon: '📦', title: 'Qutilar va yorliqlar', text: "O'zgaruvchi — qiymat solingan quti emas, balki qiymatga yopishtirilgan yorliq (label). Primitiv qiymat (son, matn) — yorliqdagi tayyor nusxa. Obyekt esa omborda turadi, yorliq faqat uning manzilini (reference — havola) ko'rsatadi: ikki yorliq bitta omborni ko'rsatishi mumkin." },
      sections: [
        { heading: "Tiplar", text: "JavaScript da 8 ta tip bor: 7 ta primitive (primitiv — oddiy, o'zgarmas qiymat): number, string, boolean, undefined, null, symbol, bigint va 1 ta object (obyekt — massiv, funksiya, sana ham shunga kiradi). Primitiv qiymatlar immutable (o'zgarmas): 'abc'[0] = 'X' hech narsa o'zgartirmaydi. Dinamik tiplash (dynamic typing) — tip o'zgaruvchiga emas, qiymatga tegishli." },
        { table: { head: ['Ifoda', 'Natija', 'Izoh'], rows: [['typeof 1', "'number'", ''], ['typeof null', "'object'", "Tarixiy xato, tuzatilmagan"], ['typeof undefined', "'undefined'", ''], ['typeof function(){}', "'function'", "Aslida object, lekin alohida ko'rsatiladi"], ['typeof []', "'object'", "Massivni aniqlash uchun Array.isArray"], ['typeof NaN', "'number'", "NaN — son tipidagi maxsus qiymat"]] } },
        { heading: 'var, let, const', table: { head: ['', 'var', 'let', 'const'], rows: [['Ko\'rinish (scope)', 'funksiya', 'blok', 'blok'], ['Qayta e\'lon', 'mumkin', "yo'q (SyntaxError)", "yo'q"], ['Qayta qiymat berish', 'mumkin', 'mumkin', "yo'q (TypeError)"], ['Hoisting', 'undefined bilan', 'TDZ (vaqtinchalik o\'lik zona)', 'TDZ']] } },
        { code: { lang: 'js', text: "const user = { name: 'Ali' };\nuser.name = 'Vali';     // mumkin: obyektning ichi o'zgardi\nuser = {};              // TypeError: yorliq boshqa joyga ko'chirilmaydi\n\nlet a = { n: 1 };\nlet b = a;              // ikkala yorliq bitta obyektni ko'rsatadi\nb.n = 2;\nconsole.log(a.n);       // 2" } },
        { callout: { kind: 'warn', text: "const o'zgarmaslikni (immutability) emas, qayta bog'lashni (rebinding) taqiqlaydi. Obyekt ichini o'zgarmas qilish uchun Object.freeze kerak (u ham faqat birinchi darajani muzlatadi)." } },
      ],
      recap: ["8 tip: 7 primitive + object.", "typeof null === 'object' — tarixiy xato.", "const qayta bog'lashni taqiqlaydi, ichki o'zgarishni emas.", "Primitiv — qiymat bo'yicha, obyekt — havola bo'yicha nusxalanadi."],
    },
    defs: [
      ['Primitive (primitiv qiymat)', "o'zgartirib bo'lmaydigan oddiy qiymat: number, string, boolean, undefined, null, symbol, bigint. O'zgaruvchilar orasida nusxalanganda qiymatning o'zi ko'chiriladi."],
      ['Reference type (havola tipi)', "obyekt, massiv, funksiya kabi murakkab tip. O'zgaruvchi qiymatning o'zini emas, xotiradagi manzilini saqlaydi, shuning uchun nusxalash manzilni nusxalaydi."],
      ['Binding (bog\'lanish)', "nom va qiymat orasidagi bog'lanish. const shu bog'lanishni qayta o'zgartirishni taqiqlaydi."],
      ['Dynamic typing (dinamik tiplash)', "tip kompilyatsiyada emas, ish paytida aniqlanishi. Bitta o'zgaruvchi avval son, keyin matn saqlashi mumkin."],
      ['Immutability (o\'zgarmaslik)', "yaratilgandan keyin qiymatni o'zgartirib bo'lmasligi. String shu xususiyatga ega, obyekt esa yo'q."],
    ],
    life: [
      ['🏠', 'Uy manzili', "Obyekt — uy, o'zgaruvchi — manzil yozilgan qog'oz. Qog'ozni nusxalasangiz, uy ikkinchi bo'lib qolmaydi: ikki qog'oz bitta uyga olib boradi."],
      ['📇', 'Visitka', "Primitiv — visitkaning nusxasi: nusxani yirtsangiz, asl visitka butun qoladi."],
    ],
    practice: [
      { title: 'Nusxalash tajribasi', text: "Son va obyekt uchun let b = a qiling, b ni o'zgartiring va a o'zgarishini kuzating. Keyin obyektni { ...a } bilan nusxalab, farqni ko'ring." },
      { title: 'typeof jadvali', text: "typeof ni 12 xil qiymatga (null, [], NaN, class, Symbol(), 10n va h.k.) qo'llab, jadval to'ldiring." },
    ],
    items: [
      ch("Natija?", "2", ["1", "undefined", "TypeError"], "const obyektning ichini o'zgartirishga to'sqinlik qilmaydi, faqat qayta bog'lashni taqiqlaydi.", "const o = { a: 1 };\no.a = 2;\nconsole.log(o.a);"),
      ch("Natija?", "TypeError", ["[3]", "[1, 2]", "undefined"], "const bog'lanishi qayta o'zgartirilmaydi.", "const arr = [1, 2];\narr = [3];"),
      ch("typeof null nima beradi?", "'object'", ["'null'", "'undefined'", "'number'"], "JavaScript ning dastlabki versiyasidagi xato, orqaga moslik uchun saqlanib qolgan."),
      ch("typeof typeof 1 nima?", "'string'", ["'number'", "'undefined'", "'object'"], "typeof 1 → 'number' (string), uning typeof i esa yana 'string'."),
      fill("a.x qiymati nima? (raqam)", '2', "b = a obyektni emas, havolani nusxalaydi: ikkalasi bitta obyektni ko'rsatadi.", null, "let a = { x: 1 };\nlet b = a;\nb.x = 2;\nconsole.log(a.x);"),
      ch("s qiymati nima?", "'abc'", ["'Xbc'", "TypeError", "undefined"], "String immutable: indeks orqali yozish jimgina e'tiborsiz qoladi (strict rejimda TypeError).", "let s = 'abc';\ns[0] = 'X';\nconsole.log(s);"),
      ch("q.v nima?", "1", ["2", "undefined", "{ v: 2 }"], "Parametr o ga yangi obyekt berish faqat lokal yorliqni ko'chiradi, tashqaridagi q ga ta'sir qilmaydi.", "function change(o) { o = { v: 2 }; }\nconst q = { v: 1 };\nchange(q);\nconsole.log(q.v);"),
      ch("q.v nima?", "2", ["1", "undefined", "TypeError"], "Bu safar obyektning O'ZI o'zgartirildi (mutation), havola esa tashqi obyektni ko'rsatadi.", "function change(o) { o.v = 2; }\nconst q = { v: 1 };\nchange(q);\nconsole.log(q.v);"),
      ch("0.1 + 0.2 === 0.3 nima beradi?", "false", ["true", "TypeError", "NaN"], "Sonlar ikkilik suzuvchi nuqtada (IEEE 754) saqlanadi: 0.1 + 0.2 = 0.30000000000000004."),
      ch("Quyidagilarda NaN === NaN va Object.is(NaN, NaN) natijalari?", "false va true", ["true va true", "false va false", "true va false"], "NaN o'ziga teng emas (===), Object.is esa uni bir xil deb hisoblaydi."),
      ch("let x = 1; { let x = 2; } console.log(x); nima chiqaradi?", "1", ["2", "undefined", "ReferenceError"], "let blok ichida alohida o'zgaruvchi yaratadi (shadowing — soya solish)."),
      ch("1n + 1 nima beradi?", "TypeError: bigint va number aralashtirib bo'lmaydi", ["2n", "2", "NaN"], "BigInt va Number ni ochiq (explicit) o'zgartirmasdan aralashtirib bo'lmaydi."),
      ch("Quyida nima chiqadi?", "'undefined' (xato bermaydi)", ["ReferenceError", "'object'", "null"], "typeof e'lon qilinmagan nom uchun ham xato bermaydi.", "console.log(typeof notDeclaredAnywhere);"),
    ],
  });

  /* 3 */
  lesson({
    title: 'Type coercion',
    intro: "Tipni avtomatik o'zgartirish (coercion): ==, +, truthy/falsy, ToPrimitive qoidalari.",
    theory: {
      analogy: { icon: '💱', title: 'Valyuta ayirboshlash', text: "Dollarni so'mga qo'shmoqchi bo'lsangiz, avval bittasini boshqasiga ayirboshlaysiz. JavaScript ham ikki xil tipdagi qiymat operator oldida kelganda, ularni avtomatik 'ayirboshlaydi' (coercion). Qoidani bilmasangiz, natija g'alati ko'rinadi, bilsangiz — to'liq bashorat qilsa bo'ladi." },
      sections: [
        { heading: 'Ikki turdagi o\'zgartirish', text: "Explicit coercion (ochiq o'zgartirish) — siz o'zingiz yozasiz: Number('5'), String(5), Boolean(0). Implicit coercion (yashirin o'zgartirish) — operator yoki taqqoslash vaqtida avtomatik: '5' * 2. Uchta yakuniy yo'nalish bor: ToString (matnga), ToNumber (songa), ToBoolean (mantiqiyga)." },
        { heading: '+ operatorining qoidasi', text: "+ ikki ish qiladi: qo'shish va birlashtirish (concatenation). Agar operandlardan birortasi string bo'lsa (obyekt bo'lsa avval ToPrimitive — primitivga aylantirish bajariladi), ikkinchisi ham matnga aylantirilib birlashtiriladi. Boshqa arifmetik operatorlar (-, *, /) doim sonlarga aylantiradi." },
        { code: { lang: 'js', text: "'5' + 3      // '53'  (matn birlashtirish)\n'5' - 3      // 2     (songa aylantirish)\ntrue + 1     // 2\n[] + []      // ''    (ikkala massiv '' ga aylanadi)\n[1,2] + [3]  // '1,23'\nnull + 1     // 1     (null → 0)\nundefined + 1// NaN   (undefined → NaN)" } },
        { heading: 'Falsy qiymatlar', text: "Boolean kontekstida false bo'ladigan roppa-rosa 8 ta qiymat bor: false, 0, -0, 0n, '' (bo'sh satr), null, undefined, NaN. Qolgan hamma narsa truthy, jumladan [], {}, '0', 'false', -1." },
        { heading: '== qoidalari', bullets: ["null == undefined → true, lekin ular boshqa hech narsaga == bo'lmaydi (0, '' ga ham).", "Son bilan satr taqqoslanganda satr songa aylanadi: '5' == 5 → true.", "Boolean bilan taqqoslanganda avval boolean songa aylanadi: true → 1.", "Obyekt bilan primitiv taqqoslanganda obyekt primitivga aylantiriladi.", "NaN hech narsaga teng emas, o'ziga ham."] },
        { callout: { kind: 'tip', text: "Amaliyotda doim === ishlating. Faqat x == null (null yoki undefined ni birga tekshirish) holati istisno sifatida qabul qilingan." } },
      ],
      recap: ["+ matn bo'lsa birlashtiradi, -,*,/ songa aylantiradi.", "8 ta falsy: false, 0, -0, 0n, '', null, undefined, NaN.", "== ning murakkab qoidalari bor, shuning uchun === afzal.", "Number(null)=0, Number(undefined)=NaN, Number([])=0."],
    },
    defs: [
      ['Coercion (tipni o\'zgartirish)', "qiymatning bir tipdan boshqasiga o'zgartirilishi. Implicit (yashirin) operatorlar tomonidan, explicit (ochiq) esa Number(), String() orqali bajariladi."],
      ['Truthy / Falsy (chin-yolg\'on qiymatlar)', "Boolean kontekstda true yoki false deb hisoblanadigan qiymatlar. Falsy faqat 8 ta, qolgan hamma narsa truthy."],
      ['ToPrimitive (primitivga aylantirish)', "obyektni primitivga aylantiruvchi ichki algoritm: avval Symbol.toPrimitive, keyin valueOf, keyin toString chaqiriladi (hint ga qarab tartib o'zgaradi)."],
      ['Abstract equality (==, erkin tenglik)', "tiplarni avtomatik moslashtirib taqqoslash. Strict equality (===, qat'iy tenglik) esa tiplarni o'zgartirmaydi."],
      ['NaN (Not a Number — son emas)', "noto'g'ri arifmetik amal natijasi; number tipiga kiradi va o'ziga ham teng emas."],
    ],
    life: [
      ['🌐', 'Tarjimon', "== — qo'pol tarjimon: ikki so'zni ma'nosini taxmin qilib moslashtiradi. === — tarjimasiz, so'zma-so'z solishtirish."],
      ['🚦', 'Svetofor', "Falsy — 'qizil chiroq' (sakkizta holat), qolgan har qanday signal 'yashil' (truthy), hatto bo'sh massiv ham."],
    ],
    practice: [
      { title: 'Bashorat jadvali', text: "15 ta ifoda yozing ('5'+3, [] == ![], null >= 0 ...). Avval natijani qog'ozda yozing, keyin konsolda tekshiring, noto'g'ri chiqqanlarining sababini topib yozing." },
      { title: 'valueOf bilan o\'ynash', text: "O'z obyektingizga valueOf va toString yozib, obj + 1 va `${obj}` har xil natija berishini ko'ring." },
    ],
    items: [
      ch("'5' + 3 ?", "'53'", ["8", "NaN", "TypeError"], "Bir operand string bo'lsa, + birlashtiradi."),
      ch("'5' - 3 ?", "2", ["'53'", "NaN", "'2'"], "- operatori doim songa aylantiradi."),
      ch("[] + [] ?", "'' (bo'sh satr)", ["[]", "0", "NaN"], "Ikkala massiv ham ''ga aylanadi va birlashtiriladi."),
      ch("[1, 2] + [3] ?", "'1,23'", ["[1, 2, 3]", "6", "'1,2,3'"], "[1,2] → '1,2', [3] → '3', birlashtirilsa '1,23'."),
      ch("[] == ![] ?", "true", ["false", "TypeError", "undefined"], "![] = false → 0; [] → '' → 0. Ikkala tomon 0 ga teng.", "console.log([] == ![]);"),
      ch("null == 0 va null >= 0 natijalari?", "false va true", ["true va true", "false va false", "true va false"], "== da null faqat undefined ga teng; >= esa null ni songa aylantirib 0 >= 0 ni tekshiradi.", "console.log(null == 0, null >= 0);"),
      fill("Falsy qiymatlar soni nechta? (raqam)", '8', "false, 0, -0, 0n, '', null, undefined, NaN.", null),
      ch("Boolean([]) ?", "true", ["false", "undefined", "TypeError"], "Bo'sh massiv va obyekt truthy."),
      ch("1 < 2 < 3 va 3 > 2 > 1 natijalari?", "true va false", ["true va true", "false va true", "false va false"], "3 > 2 → true, true > 1 → 1 > 1 → false. Taqqoslash chapdan o'ngga.", "console.log(1 < 2 < 3, 3 > 2 > 1);"),
      ch("[10, 9, 1].sort() natijasi?", "[1, 10, 9]", ["[1, 9, 10]", "[10, 9, 1]", "[9, 10, 1]"], "Standart sort elementlarni matnga aylantirib solishtiradi: '1' < '10' < '9'."),
      ch("Number(null), Number(undefined), Number([]), Number([5]) ?", "0, NaN, 0, 5", ["0, 0, 0, 5", "NaN, NaN, 0, NaN", "0, NaN, NaN, 5"], "Bo'sh massiv '' → 0, [5] → '5' → 5.", "console.log(Number(null), Number(undefined), Number([]), Number([5]));"),
      ch("parseInt('3px') va Number('3px') ?", "3 va NaN", ["NaN va 3", "3 va 3", "NaN va NaN"], "parseInt boshidagi raqamlarni oladi, Number butun satrni qat'iy songa aylantiradi."),
      ch("'' == 0 va '0' == false va '' == '0' ?", "true, true, false", ["true, true, true", "false, false, false", "true, false, false"], "Birinchi ikkitasida satr songa aylanadi: 0 == 0. Uchinchisida ikkala tomon string, shuning uchun to'g'ridan-to'g'ri taqqoslanadi.", "console.log('' == 0, '0' == false, '' == '0');"),
    ],
  });

  /* 4 */
  lesson({
    title: 'Raqamlar va satrlar',
    intro: "IEEE 754 aniqligi, xavfsiz butun sonlar, BigInt, satrlar va UTF-16.",
    theory: {
      analogy: { icon: '📐', title: 'Chizg\'ich va tirnoq', text: "Chizg'ichda 0.1 mm dan kichik bo'laklarni aniq o'lchab bo'lmaydi. Kompyuter ham o'nlik kasrlarni ikkilik tizimda saqlaydi va ba'zi kasrlar (0.1) cheksiz davriy bo'lgani uchun taxminan saqlanadi. Satr esa xuddi marjon kabi: har bir 'tosh' bir kod birligi (code unit), ba'zi belgilar (emoji) esa ikkita tosh egallaydi." },
      sections: [
        { heading: 'Number: hamma son — 64 bitli suzuvchi nuqtali', text: "JavaScript dagi number tipi IEEE 754 standartidagi 64 bitli floating-point (suzuvchi nuqtali son) formatida saqlanadi. Shuning uchun 0.1 + 0.2 = 0.30000000000000004. Butun sonlar faqat Number.MAX_SAFE_INTEGER (2^53 − 1 = 9007199254740991) gacha aniq. Undan katta sonlar uchun BigInt (juda katta butun son) ishlating." },
        { code: { lang: 'js', text: "0.1 + 0.2 === 0.3                        // false\nMath.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true (taqqoslash usuli)\n(1.005).toFixed(2)                        // '1.00' (matn qaytaradi!)\nMath.round(-2.5)                          // -2  (yarimlar +∞ tomon yaxlitlanadi)\nMath.round(2.5)                           // 3\nNumber.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2  // true" } },
        { heading: 'String: UTF-16 kod birliklari', text: "Satr UTF-16 kod birliklari (code unit) ketma-ketligi. Ko'pchilik belgilar bitta birlik, lekin emoji kabi belgilar surrogate pair (surrogat juftlik — ikkita birlik) egallaydi. Shuning uchun '😀'.length === 2. Haqiqiy belgilar (code point) bo'yicha yurish uchun [...str] yoki for...of ishlatiladi. Satrlar immutable: har bir metod YANGI satr qaytaradi." },
        { table: { head: ['Metod', 'Natija', 'Eslatma'], rows: [["'abcdef'.slice(-2)", "'ef'", "Manfiy indeks oxiridan"], ["'abcdef'.substring(4, 1)", "'bcd'", "Argumentlar o'rnini almashtiradi"], ["'abcdef'.slice(4, 1)", "''", "Almashtirmaydi"], ["'abc'.at(-1)", "'c'", "Manfiy indeks"], ["'7'.padStart(3, '0')", "'007'", ''], ["'a-b-c'.split('-', 2)", "['a', 'b']", "Ikkinchi argument — limit"]] } },
        { callout: { kind: 'warn', text: "Satrlarni < va > bilan solishtirish leksikografik (lug'at tartibida, kod birligi bo'yicha): '10' < '9' → true, 'B' < 'a' → true (katta harflar kodi kichik). Tilga mos solishtirish uchun localeCompare yoki Intl.Collator ishlating." } },
      ],
      recap: ["0.1 + 0.2 ≠ 0.3: ikkilik kasr; taqqoslashda EPSILON.", "MAX_SAFE_INTEGER dan keyin aniqlik yo'qoladi: BigInt kerak.", "Satr UTF-16: emoji uzunligi 2, [...str] to'g'ri sanaydi.", "toFixed matn qaytaradi, slice va substring manfiy/almashgan argumentda farq qiladi."],
    },
    defs: [
      ['Floating-point (suzuvchi nuqtali son)', "sonni mantissa va daraja ko'rinishida saqlash usuli. Juda katta va juda kichik sonlarni sig'diradi, lekin ko'p kasrlarni aniq ifodalay olmaydi."],
      ['IEEE 754', "suzuvchi nuqtali sonlarning xalqaro standarti; JavaScript ning barcha number lari 64 bitli (double precision — ikkilangan aniqlik)."],
      ['Number.EPSILON (eng kichik farq)', "1 va 1 dan keyingi eng kichik son orasidagi farq (~2.2e-16); kasr sonlarni 'deyarli teng' deb taqqoslashda ishlatiladi."],
      ['BigInt (katta butun son)', "o'lchamga chek qo'ymaydigan butun son tipi (123n). Number bilan aralashtirib bo'lmaydi."],
      ['Code unit / code point (kod birligi / kod nuqtasi)', "UTF-16 da bitta belgi bir yoki ikki kod birligidan iborat. length kod birliklarini sanaydi, belgilarni emas."],
    ],
    life: [
      ['🧮', 'Kalkulyator', "1 ÷ 3 = 0.3333...: har qanday kalkulyator uni yaxlitlaydi. Kompyuterda esa 0.1 ning o'zi ham ikkilik tizimda shunday cheksiz davriy kasr."],
      ['💳', 'Pul hisobi', "Pulni tiyinlarda (butun son) saqlash tavsiya qilinadi: 10.25 so'm emas 1025 tiyin, shunda yaxlitlash xatosi chiqmaydi."],
    ],
    practice: [
      { title: 'Pul kalkulyatori', text: "Narxlar ro'yxati yig'indisini avval float bilan, keyin tiyin (butun son) bilan hisoblab, farqni toping." },
      { title: 'Emoji uzunligi', text: "'👨‍👩‍👧'.length, [...'👨‍👩‍👧'].length va Intl.Segmenter bilan belgilar sonini taqqoslang." },
    ],
    items: [
      ch("0.1 * 3 natijasi?", "0.30000000000000004", ["0.3", "0.30000000000000001", "3"], "0.1 ikkilikda aniq emas, ko'paytirishda xato ko'rinadi.", "console.log(0.1 * 3);"),
      ch("(1.005).toFixed(2) ?", "'1.00' (matn)", ["1.01 (son)", "'1.01'", "1.005"], "1.005 aslida 1.00499999999999989... ko'rinishida saqlanadi; toFixed esa matn qaytaradi."),
      ch("Natija?", "true", ["false", "TypeError", "NaN"], "9007199254740993 ni double aniq saqlay olmaydi: ikkala ifoda ham 9007199254740992 ga yaxlitlanadi.", "console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2);"),
      fill("Math.round(-2.5) natijasi? (raqam)", '-2', "Yarim qiymatlar +∞ tomon yaxlitlanadi: -2.5 → -2, 2.5 → 3.", null, "console.log(Math.round(-2.5));"),
      fill("'😀'.length necha? (raqam)", '2', "Emoji surrogate juftlik: ikki UTF-16 kod birligi.", null),
      fill("[...'😀'].length necha? (raqam)", '1', "Spread satrni belgilar (code point) bo'yicha yoyadi.", null),
      ch("'abcdef'.substring(4, 1) ?", "'bcd'", ["''", "'ef'", "'cde'"], "substring boshi katta bo'lsa argumentlarni o'zaro almashtiradi.", "console.log('abcdef'.substring(4, 1));"),
      ch("'abcdef'.slice(4, 1) ?", "'' (bo'sh satr)", ["'bcd'", "'efab'", "TypeError"], "slice argumentlarni almashtirmaydi: boshi oxiridan katta bo'lsa bo'sh satr."),
      ch("'10' < '9' va 10 < 9 natijalari?", "true va false", ["false va false", "true va true", "false va true"], "Satrlar belgi bo'yicha solishtiriladi ('1' < '9'), sonlar esa qiymat bo'yicha.", "console.log('10' < '9', 10 < 9);"),
      ch("'7'.padStart(3, '0') ?", "'007'", ["'700'", "'07'", "7"], "padStart chap tomondan to'ldiradi."),
      ch("Math.max() va Math.min() argumentsiz chaqirilsa?", "-Infinity va Infinity", ["0 va 0", "NaN va NaN", "undefined va undefined"], "Bo'sh to'plam uchun neytral element: max uchun −∞, min uchun +∞."),
      ch("(255).toString(16) va parseInt('ff', 16) ?", "'ff' va 255", ["'FF' va 15", "'255' va 255", "'f' va 15"], "toString(asos) satrga, parseInt(satr, asos) songa aylantiradi."),
      ch("0.1 + 0.2 ni to'g'ri taqqoslash usuli?", "Math.abs(a - b) < Number.EPSILON", ["a == b", "a.equals(b)", "Number(a) === Number(b)"], "Farq juda kichik ekanini tekshirish kerak."),
    ],
  });

  /* 5 */
  lesson({
    title: 'Operatorlar va boshqaruv',
    intro: "??, ||, &&, ?., qisqa tutashuv (short-circuit), prefiks/postfiks, switch, siklllar.",
    theory: {
      analogy: { icon: '🚪', title: 'Ketma-ket eshiklar', text: "Qisqa tutashuv (short-circuit) — bir nechta eshikdan o'tish: birinchi eshik yopiq bo'lsa, qolganlariga umuman bormaysiz. && va || shunday: natija birinchi operandda aniq bo'lsa, ikkinchisi baholanmaydi (hatto chaqirilmaydi)." },
      sections: [
        { heading: 'Mantiqiy operatorlar qiymat qaytaradi', text: "|| va && boolean emas, OPERANDLARDAN BIRINING O'ZINI qaytaradi. a || b: a truthy bo'lsa a, aks holda b. a && b: a falsy bo'lsa a, aks holda b. ?? (nullish coalescing — null yoki undefined bo'lsa almashtirish) esa faqat null va undefined da o'ng tomonni oladi, 0 va '' ni saqlaydi." },
        { table: { head: ['Ifoda', 'Natija'], rows: [['0 || 5', '5'], ['0 ?? 5', '0'], ["'' && 'a'", "''"], ["'x' && 'a'", "'a'"], ['null ?? undefined ?? 3', '3'], ['undefined?.x', 'undefined (xatosiz)']] } },
        { heading: 'Optional chaining va mantiqiy tayinlash', code: { lang: 'js', text: "user?.address?.city          // yo'qolgan bo'lsa undefined, xato yo'q\nuser.getName?.()             // metod mavjud bo'lsagina chaqiradi\nlet x = 5;\nx ||= 10;   // x = x || 10  → 5\nx &&= 7;    // x = x && 7   → 7\nx ??= 1;    // x = x ?? 1   → 7" } },
        { heading: 'Ustuvorlik va tuzoqlar', bullets: ["** o'ngdan chapga: 2 ** 3 ** 2 = 2 ** 9 = 512.", "-5 % 3 = -2: qoldiq ishorasi bo'linuvchiniki.", "i++ qiymatni oldin qaytaradi, keyin oshiradi; ++i oldin oshiradi.", "a ?? b || c — qavssiz aralashtirish SyntaxError.", "switch qat'iy (===) taqqoslaydi va break bo'lmasa keyingi case ga o'tib ketadi (fallthrough).", "for...in kalitlarni (matn sifatida) aylanadi, for...of qiymatlarni."] },
        { callout: { kind: 'warn', text: "1 / 0 = Infinity, -1 / 0 = -Infinity, 0 / 0 = NaN, 1 / -0 = -Infinity: JavaScript nolga bo'lishda xato bermaydi." } },
      ],
      recap: ["|| va && operandning o'zini qaytaradi.", "?? faqat null/undefined da almashtiradi.", "Prefiks va postfiks farqi; ** o'ngdan chapga.", "switch da break unutilsa fallthrough."],
    },
    defs: [
      ['Short-circuit evaluation (qisqa tutashuv)', "&& va || natija aniq bo'lishi bilan ikkinchi operandni baholamasdan to'xtashi."],
      ['Nullish coalescing (??, nullish birlashtirish)', "chap tomon null yoki undefined bo'lsa, o'ng tomonni qaytaruvchi operator. 0 va '' ni 'qiymat bor' deb hisoblaydi."],
      ['Optional chaining (?., ixtiyoriy zanjir)', "oraliq qiymat null/undefined bo'lsa, xato o'rniga undefined qaytaruvchi murojaat usuli."],
      ['Operator precedence (ustuvorlik)', "bir ifodada bir nechta operator bo'lganda qaysi biri avval bajarilishini belgilovchi tartib."],
      ['Fallthrough (o\'tib ketish)', "switch da break bo'lmaganda keyingi case blokining ham bajarilishi."],
    ],
    life: [
      ['🛂', 'Chegara nazorati', "Pasport yo'q bo'lsa (birinchi shart yolg'on), keyingi tekshiruvlar (viza, bilet) umuman o'tkazilmaydi: qisqa tutashuv."],
      ['📞', 'Zaxira raqam', "?? — asosiy telefon raqami yo'q bo'lsagina (null) zaxira raqamni oling; 0 raqami ham haqiqiy qiymat sifatida qolsin."],
    ],
    practice: [
      { title: 'Sozlamalar birlashtirish', text: "config.timeout || 3000 va config.timeout ?? 3000 ni timeout = 0 bo'lgan holatda sinab, farqini tushuntiring." },
      { title: 'Fallthrough', text: "switch da bir necha case ni break siz yozib, kerakli (guruhlash) va xavfli holatlarni ajrating." },
    ],
    items: [
      ch("0 || 5 va 0 ?? 5 natijalari?", "5 va 0", ["0 va 5", "5 va 5", "0 va 0"], "|| falsy da almashtiradi, ?? esa faqat null/undefined da."),
      ch("'' && 'a' va 'x' && 'a' ?", "'' va 'a'", ["'a' va ''", "false va true", "'' va ''"], "&& birinchi falsy ni yoki oxirgi operandni qaytaradi."),
      fill("i++ + ++i natijasi? (raqam)", '4', "i = 1: i++ → 1 (i = 2 bo'ladi), ++i → 3. 1 + 3 = 4.", null, "let i = 1;\nconsole.log(i++ + ++i);"),
      fill("2 ** 3 ** 2 natijasi? (raqam)", '512', "** o'ngdan chapga: 3 ** 2 = 9, 2 ** 9 = 512.", null),
      fill("-5 % 3 natijasi? (raqam)", '-2', "Qoldiq ishorasi bo'linuvchiniki: -5 = 3 × (-1) + (-2).", null),
      ch("Nima chiqadi?", "'B', 'C'", ["'B'", "'C'", "'A', 'B', 'C'"], "x === 2 mos keldi, break yo'q: C ham bajariladi, default emas.", "const x = 2;\nswitch (x) {\n  case 1: console.log('A');\n  case 2: console.log('B');\n  case 3: console.log('C'); break;\n  default: console.log('D');\n}"),
      ch("for...in massivda nimani aylanadi?", "Indekslarni (matn ko'rinishida)", ["Qiymatlarni", "Faqat sonli indekslarni son sifatida", "Hech narsani"], "for...in obyekt kalitlarini matn sifatida beradi; qiymatlar uchun for...of.", "for (const k in ['a', 'b']) console.log(typeof k);"),
      ch("user undefined bo'lsa, user?.address.city nima beradi?", "undefined", ["TypeError", "null", "''"], "?. zanjiri undefined da to'xtaydi va qolgan qismni baholamaydi."),
      ch("a ?? b || c ni qavssiz yozsak?", "SyntaxError", ["Ikkala operator ham ishlaydi", "Faqat ?? ishlaydi", "Faqat || ishlaydi"], "?? ni || yoki && bilan qavssiz aralashtirish taqiqlangan."),
      ch("x = 5; x ||= 10; natijada x?", "5", ["10", "undefined", "true"], "x truthy, shuning uchun tayinlash bajarilmaydi."),
      ch("1 / -0 nima?", "-Infinity", ["Infinity", "NaN", "0"], "-0 mavjud, bo'lish esa ishorani saqlaydi."),
      ch("Natija?", "3 3 3", ["0 1 2", "0 0 0", "undefined undefined undefined"], "var funksiya darajasida bitta o'zgaruvchi; callback lar sikl tugagach (i = 3) bajariladi.", "for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));"),
      ch("Xuddi shu kodda var o'rniga let yozilsa?", "0 1 2", ["3 3 3", "0 0 0", "1 2 3"], "let har iteratsiyada yangi bog'lanish yaratadi.", "for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));"),
    ],
  });

  /* 6 */
  lesson({
    title: 'Funksiyalar asoslari',
    intro: "Declaration, expression, arrow; default va rest parametrlari; birinchi darajali funksiya (first-class function).",
    theory: {
      analogy: { icon: '🏭', title: 'Zavod uskunasi', text: "Funksiya — ishlab chiqarish liniyasi: xomashyo (parametrlar) beriladi, natija (return) chiqadi. JavaScript da bu liniyaning o'zini ham boshqa liniyaga uzatish, o'zgaruvchida saqlash, natija sifatida qaytarish mumkin: bu first-class function (birinchi darajali funksiya) deyiladi." },
      sections: [
        { heading: 'Uch yozilish shakli', table: { head: ['Shakl', 'Misol', 'Hoisting', 'this / arguments'], rows: [['Function declaration (e\'lon)', 'function f() {}', "To'liq ko'tariladi", "O'zining this va arguments i bor"], ['Function expression (ifoda)', 'const f = function() {}', "Faqat o'zgaruvchi ko'tariladi", "O'zining this i bor"], ['Arrow function (o\'q funksiya)', 'const f = () => {}', "Faqat o'zgaruvchi", "this va arguments TASHQARIDAN olinadi"]] } },
        { heading: 'Parametrlar', code: { lang: 'js', text: "function f(a, b = 2, ...rest) {}\nf.length    // 1  (default dan oldingi parametrlar soni; rest hisobga kirmaydi)\n\nfunction g(list = []) { list.push(1); return list.length; }\ng(); g();   // 1, 1  (default HAR chaqiruvda qayta hisoblanadi)\n\nMath.max(...[1, 5, 2])   // 5 (spread: massivni argumentlarga yoyish)" } },
        { heading: 'Qaytarish va ASI tuzog\'i', text: "ASI (Automatic Semicolon Insertion — nuqtali vergulni avtomatik qo'yish) return dan keyin yangi qator bo'lsa, shu yerga ; qo'yadi. Shuning uchun return dan keyin qiymatni yangi qatorga yozish undefined qaytaradi." },
        { code: { lang: 'js', text: "function a() {\n  return\n  { ok: true }      // hech qachon bajarilmaydi\n}\na();                 // undefined" } },
        { callout: { kind: 'info', text: "JavaScript da argumentlar 'sharing bo'yicha' uzatiladi (call by sharing): primitiv nusxalanadi, obyektda havola nusxalanadi. Obyektning ichini o'zgartirish tashqarida ko'rinadi, parametrga yangi obyekt berish esa yo'q." } },
      ],
      recap: ["Declaration to'liq ko'tariladi, expression va arrow yo'q.", "Arrow da o'z this va arguments yo'q.", "Default parametr har chaqiruvda qayta baholanadi.", "return dan keyin yangi qator — undefined (ASI)."],
    },
    defs: [
      ['First-class function (birinchi darajali funksiya)', "funksiya oddiy qiymat kabi o'zgaruvchiga berilishi, argument qilib uzatilishi va natija sifatida qaytarilishi mumkinligi."],
      ['Parameter va argument (parametr va argument)', "parametr — funksiya e'lonidagi nom, argument — chaqiruvda berilgan qiymat."],
      ['Rest parameter (qolgan parametrlar)', "...args — qolgan argumentlarni haqiqiy massivga yig'adi; doim oxirgi bo'lishi shart."],
      ['IIFE (darhol chaqiriladigan funksiya ifodasi)', "(function(){...})() — yozilishi bilan bajarilib, o'zining scope ini yaratadigan funksiya."],
      ['Pure function (sof funksiya)', "bir xil argumentga doim bir xil natija beradigan va tashqi holatni o'zgartirmaydigan (side effect siz) funksiya."],
    ],
    life: [
      ['☕', 'Kofe mashinasi', "Parametr — tanlagan kofe turi, return — tayyor stakan. Default parametr: hech narsa tanlamasangiz 'americano'."],
      ['🧾', 'Retsept', "Funksiya — retsept; retseptni boshqa oshpazga uzatish (callback) va 'tayyor bo'lganda menga ayt' deyish mumkin."],
    ],
    practice: [
      { title: 'Uch shaklni solishtirish', text: "Bitta funksiyani declaration, expression va arrow bilan yozing; e'londan oldin chaqirib, qaysi biri xato berishini yozib oling." },
      { title: 'Default tuzog\'i', text: "function f(x = Date.now()) {} ni ikki marta chaqirib, default har safar qayta baholanishini isbotlang." },
    ],
    items: [
      ch("a() nima qaytaradi?", "undefined", ["{ ok: true }", "true", "SyntaxError"], "ASI return dan keyin ; qo'yadi, obyekt esa alohida blok sifatida o'qiladi.", "function a() {\n  return\n  { ok: true }\n}\nconsole.log(a());"),
      fill("f.length qiymati? (raqam)", '1', "length — birinchi default parametrdan oldingi parametrlar soni (rest ham sanalmaydi).", null, "function f(a, b = 2, c) {}\nconsole.log(f.length);"),
      ch("g() ni ikki marta chaqirsak natija?", "1 va 1", ["1 va 2", "2 va 2", "1 va undefined"], "Default qiymat har chaqiruvda yangi massiv yaratadi.", "function g(list = []) { list.push(1); return list.length; }\nconsole.log(g(), g());"),
      ch("Nima bo'ladi?", "TypeError: sayHi is not a function", ["'salom' chiqadi", "ReferenceError", "undefined chiqadi"], "var sayHi hoisting da undefined bo'ladi, funksiya esa hali berilmagan.", "sayHi();\nvar sayHi = function () { console.log('salom'); };"),
      ch("Xuddi shunday, lekin function sayHi() {} e'lon bilan bo'lsa?", "Ishlaydi", ["TypeError", "ReferenceError", "undefined"], "Declaration to'liq (nomi va tanasi bilan) ko'tariladi."),
      ch("Arrow function ichida arguments nima?", "Tashqi funksiyaning arguments i (yoki ReferenceError)", ["Arrow ning o'z argumentlari", "Bo'sh massiv", "undefined"], "Arrow funksiyada o'z arguments obyekti yo'q, tashqi scope dan olinadi.", "function outer() {\n  const f = () => arguments[0];\n  return f(99);\n}\nconsole.log(outer(1));"),
      fill("outer(1) natijasi? (raqam)", '1', "Arrow o'zining 99 ini emas, outer ning arguments[0] ni (1) ko'radi.", null),
      ch("const f = () => {}; f.name nima?", "'f'", ["''", "'anonymous'", "undefined"], "Dvigatel o'zgaruvchi nomidan funksiya nomini aniqlaydi."),
      ch("Math.max(...[1, 5, 2]) ?", "5", ["[1, 5, 2]", "NaN", "TypeError"], "Spread massivni alohida argumentlarga yoyadi."),
      ch("Qaysi biri noto'g'ri?", "function f(...a, b) {}", ["function f(a, ...b) {}", "function f(a = 1, b) {}", "function f(...a) {}"], "Rest parametr oxirgi bo'lishi shart: SyntaxError."),
      ch("typeof (function () { return typeof arguments; })() ?", "'object'", ["'array'", "'function'", "'undefined'"], "arguments massivga o'xshash obyekt (array-like), haqiqiy massiv emas."),
      ch("Nega x o'zgarmadi?", "Parametrga yangi qiymat berish tashqi o'zgaruvchiga ta'sir qilmaydi", ["Funksiyalar hech narsa o'zgartira olmaydi", "x const bo'lgani uchun", "Brauzer xatosi"], "Primitiv nusxalanadi.", "let x = 1;\nfunction f(v) { v = 2; }\nf(x);\nconsole.log(x);"),
    ],
  });

  /* 7 */
  lesson({
    title: 'Execution context va call stack',
    intro: "Bajarilish konteksti (execution context), yaratilish va bajarilish fazalari, chaqiruvlar steki (call stack).",
    theory: {
      analogy: { icon: '🥞', title: 'Likopchalar uyumi', text: "Call stack — likopchalar uyumi: yangisi tepaga qo'yiladi, birinchi bo'lib tepadagisi olinadi (LIFO — last in, first out). Har bir likopcha bitta funksiya chaqiruvi, ya'ni uning o'z o'zgaruvchilari va 'ish daftari'." },
      sections: [
        { heading: 'Execution context nima', text: "Execution context (bajarilish konteksti) — kod bajarilayotgan muhitni tavsiflovchi ichki tuzilma. U ichida: Lexical Environment (leksik muhit — o'zgaruvchilar va ularning tashqi muhitga havolasi), this qiymati va (eski terminologiyada) Variable Environment bor. Turlari: global context (dastur boshlanganda bitta), function context (har bir chaqiruvda yangi) va eval context." },
        { heading: 'Ikki faza', table: { head: ['Faza', 'Nima bo\'ladi'], rows: [['Creation phase (yaratilish)', "Scope tuziladi: var → undefined, function declaration → to'liq funksiya, let/const → ishga tushirilmagan (TDZ), this aniqlanadi"], ['Execution phase (bajarilish)', "Kod qatorma-qator bajariladi, o'zgaruvchilarga haqiqiy qiymatlar beriladi"]] } },
        { heading: 'Call stack', code: { lang: 'js', text: "function a() { b(); console.log('a'); }\nfunction b() { c(); console.log('b'); }\nfunction c() { console.log('c'); }\na();\n// stek: [global] → [global, a] → [global, a, b] → [global, a, b, c]\n// chiqish: c, b, a  (c tugaydi → stekdan chiqadi → b davom etadi ...)" } },
        { bullets: ["Funksiya chaqirilganda yangi kontekst stekka push qilinadi, tugaganda pop qilinadi.", "Stek hajmi cheklangan: cheksiz rekursiya RangeError: Maximum call stack size exceeded beradi.", "Stek faqat bitta, shuning uchun bir vaqtda faqat eng tepadagi kontekst bajariladi.", "Obyektlar stekda emas, heap (uyum — dinamik xotira) da saqlanadi; stekda esa ularga havola turadi.", "Asinxron callback lar stek bo'shagandan keyin (event loop orqali) stekka qo'yiladi."] },
        { callout: { kind: 'tip', text: "DevTools → Sources → Call Stack panelida breakpoint da turgan paytingizda stekni jonli ko'rishingiz mumkin." } },
      ],
      recap: ["Har chaqiruv — yangi execution context, stekka push/pop.", "Creation fazasida var=undefined, function to'liq, let/const TDZ.", "Cheksiz rekursiya RangeError beradi.", "Obyektlar heap da, stekda faqat havolalar."],
    },
    defs: [
      ['Execution context (bajarilish konteksti)', "kod bajariladigan muhit: o'zgaruvchilar, tashqi muhitga havola va this ni o'z ichiga oladi. Har funksiya chaqiruvi yangisini yaratadi."],
      ['Call stack (chaqiruvlar steki)', "hozir bajarilayotgan va kutayotgan funksiya kontekstlarining LIFO tuzilmasi. Eng tepadagisi hozir ishlayotgani."],
      ['Lexical environment (leksik muhit)', "o'zgaruvchilar jadvali va tashqi (outer) muhitga havola; scope chain (ko'rinish zanjiri) shundan tuziladi."],
      ['Heap (uyum)', "obyektlar saqlanadigan katta tartibsiz xotira sohasi; garbage collector shu yerni tozalaydi."],
      ['Stack overflow (stek to\'lishi)', "stek hajmidan oshib ketishi, odatda to'xtamaydigan rekursiyadan."],
    ],
    life: [
      ['📚', 'Kitoblar ustida', "Kitobni o'qiyotib, boshqa kitobga havola topdingiz: birinchisini yopmay ustiga ikkinchisini qo'yasiz. Ikkinchisi tugagach, birinchisiga qaytasiz: stek shunday ishlaydi."],
      ['📞', 'Ichma-ich qo\'ng\'iroq', "Suhbat paytida kimdir sizga qo'ng'iroq qildi va siz uni kutish rejimiga qo'yib ikkinchisiga javob berdingiz. Ikkinchisi tugamaguncha birinchisiga qaytolmaysiz."],
    ],
    practice: [
      { title: 'Stekni chizish', text: "Uchta ichma-ich funksiya yozing, har biriga debugger qo'yib, Call Stack panelidagi o'zgarishlarni daftarga chizing." },
      { title: 'Stek chegarasi', text: "Rekursiv funksiya yozib, qaysi chuqurlikda RangeError chiqishini hisoblang (taxminan 10 ming atrofida)." },
    ],
    items: [
      ch("Chiqish tartibi?", "c, b, a", ["a, b, c", "a, c, b", "b, c, a"], "Eng ichkidagi funksiya birinchi tugaydi (LIFO).", "function a() { b(); console.log('a'); }\nfunction b() { c(); console.log('b'); }\nfunction c() { console.log('c'); }\na();"),
      ch("Nima bo'ladi?", "RangeError: Maximum call stack size exceeded", ["Cheksiz ishlaydi", "undefined chiqadi", "SyntaxError"], "Har chaqiruv stek hajmini egallaydi va to'xtash sharti yo'q.", "function f() { f(); }\nf();"),
      ch("Creation fazasida var o'zgaruvchi qanday qiymatda bo'ladi?", "undefined", ["Ishga tushirilmagan (TDZ)", "null", "0"], "var undefined bilan, let/const esa TDZ da turadi."),
      ch("Creation fazasida function declaration qanday holatda?", "To'liq (tana bilan) tayyor", ["undefined", "TDZ", "Mavjud emas"], "Shuning uchun e'londan oldin chaqirsa bo'ladi."),
      ch("Stek holati: a() chaqirilib, ichida b(), b ichida c() bajarilmoqda. Stekda nechta kontekst bor (global bilan)?", "4", ["3", "1", "2"], "global + a + b + c = 4."),
      ch("Obyekt qayerda saqlanadi?", "Heap da; o'zgaruvchida unga havola turadi", ["Stekda", "Faqat global muhitda", "Brauzer keshida"], "Stekda faqat primitiv qiymatlar va havolalar."),
      ch("Natija?", "undefined, 2", ["1, 2", "ReferenceError", "undefined, undefined"], "Creation fazasida a = undefined; bajarilishda log birinchi, a = 2 keyinroq.", "console.log(a);\nvar a = 1;\nvar b = 2;\nconsole.log(b);"),
      ch("Natija?", "ReferenceError", ["undefined", "1", "null"], "let TDZ da turgan paytda unga murojaat xato beradi.", "console.log(x);\nlet x = 1;"),
      ch("Asinxron callback qachon stekka tushadi?", "Stek bo'shagandan keyin, event loop orqali", ["Darhol chaqirilgan joyda", "Eng pastki qismiga", "Hech qachon"], "Callback navbatdan olinib bo'sh stekka qo'yiladi."),
      ch("Execution context ichida nimalar bor?", "Leksik muhit (o'zgaruvchilar + tashqi havola) va this", ["Faqat o'zgaruvchilar", "Faqat funksiya nomi", "DOM daraxti"], "Ikkalasi ham kontekstning asosiy qismlari."),
      ch("Funksiya chaqirilganda nechta YANGI kontekst yaratiladi?", "Har chaqiruvga bitta (rekursiyada har bir qadamga alohida)", ["Funksiya uchun bitta, qayta chaqiruvlarda ulashiladi", "Faqat birinchi chaqiruvda", "Umuman yaratilmaydi"], "Shuning uchun rekursiyada har bir qadamning o'z o'zgaruvchilari bor."),
    ],
  });

  /* 8 */
  lesson({
    title: 'Scope',
    intro: "Global, funksiya va blok ko'rinish sohalari; scope chain; leksik (lexical) scope; shadowing.",
    theory: {
      analogy: { icon: '🏘️', title: 'Mahalla va xonalar', text: "O'zgaruvchi qidirilayotganda avval o'z xonangizdan (joriy scope), topilmasa uydan (tashqi funksiya), keyin mahalladan (global) izlanadi. Ichkaridan tashqariga qarash mumkin, tashqaridan ichkariga esa yo'q." },
      sections: [
        { heading: 'Scope turlari', table: { head: ['Tur', 'Qanday yaratiladi', 'Kim ko\'rsatadi'], rows: [['Global scope (global ko\'rinish)', "Dastur boshida", "Hamma joyda ko'rinadi"], ['Function scope (funksiya ko\'rinishi)', 'Har funksiya', "var shu darajada"], ['Block scope (blok ko\'rinishi)', '{ } ichida', 'let va const shu darajada'], ['Module scope (modul ko\'rinishi)', 'ES moduli', "Modul ichida yopiq"]] } },
        { heading: 'Lexical scope', text: "Lexical scope (leksik scope — yozilish joyiga qarab scope): funksiya qaysi o'zgaruvchilarni ko'rishi uning QAYERDA YOZILGANIGA bog'liq, QAYERDAN CHAQIRILGANIGA emas. Scope chain (ko'rinish zanjiri) — joriy muhitdan boshlab tashqi muhitlarga qarab ketuvchi qidiruv yo'li." },
        { code: { lang: 'js', text: "const x = 'global';\nfunction outer() {\n  const x = 'outer';\n  function inner() { return x; }\n  return inner;\n}\nfunction caller() {\n  const x = 'caller';\n  return outer()();   // inner 'outer' ni ko'radi, 'caller' ni emas\n}\ncaller();             // 'outer'" } },
        { heading: 'var va let farqi', code: { lang: 'js', text: "if (true) { var a = 1; let b = 2; }\nconsole.log(a);          // 1  (var blokdan chiqib ketadi)\nconsole.log(typeof b);   // 'undefined' (b bu yerda ko'rinmaydi)\n\nvar g = 1;               // global obyektga yoziladi (window.g)\nlet h = 2;               // yozilmaydi" } },
        { bullets: ["Shadowing (soya solish): ichki scope dagi bir xil nomli o'zgaruvchi tashqisini berkitadi.", "Sloppy (oddiy) rejimda e'lon qilinmagan nomga tayinlash global o'zgaruvchi yaratadi (implicit global — yashirin global): xavfli.", "catch (e) dagi e faqat catch bloki ichida ko'rinadi.", "Siklda var bitta umumiy o'zgaruvchi, let esa har iteratsiyaga alohida."] },
      ],
      recap: ["var — funksiya, let/const — blok scope.", "Scope yozilish joyi bo'yicha belgilanadi (lexical).", "Scope chain: ichkaridan tashqariga qidiriladi.", "Global var window ga yoziladi, let esa yo'q."],
    },
    defs: [
      ['Scope (ko\'rinish sohasi)', "o'zgaruvchi qayerda mavjud va ko'rinishi sohasi."],
      ['Lexical scope (leksik scope)', "scope kod yozilgan joyga qarab belgilanishi; funksiya e'lon qilingan joydagi o'zgaruvchilarni ko'radi."],
      ['Scope chain (scope zanjiri)', "o'zgaruvchi topilmaguncha joriy scope dan global gacha ketma-ket qidirish yo'li."],
      ['Shadowing (soya solish)', "ichki scope dagi nom tashqi scope dagi bir xil nomni berkitishi."],
      ['Implicit global (yashirin global)', "e'lon qilinmagan nomga tayinlash natijasida (sloppy rejimda) yaratiladigan global o'zgaruvchi."],
    ],
    life: [
      ['🏢', 'Idora qavatlari', "Xodim o'z xonasidagi hujjatni ko'radi, topilmasa qavat arxividan, keyin umumiy arxivdan so'raydi. Teskarisi esa yo'q: umumiy arxiv xodimning shaxsiy javonini ko'ra olmaydi."],
      ['📜', 'Yozilgan buyruq', "Retseptda 'uydagi tuzni oling' yozilgan bo'lsa, uni oshxonaga yuborilsa ham, 'uydagi' tuz nazarda tutiladi, chaqirilgan joydagisi emas: lexical scope."],
    ],
    practice: [
      { title: 'Scope zanjiri chizmasi', text: "3 darajali ichma-ich funksiyalar yozing; har biriga bir xil nomli o'zgaruvchi qo'yib, qaysi biri ko'rinishini bashorat qiling va chizing." },
      { title: 'var va window', text: "Global var va let ni e'lon qilib, window.nom orqali murojaat qilib farqni ko'ring." },
    ],
    items: [
      ch("caller() natijasi?", "'outer'", ["'caller'", "'global'", "undefined"], "Lexical scope: inner funksiya yozilgan joyi (outer ichi) bo'yicha x ni topadi.", "const x = 'global';\nfunction outer() {\n  const x = 'outer';\n  return function inner() { return x; };\n}\nfunction caller() {\n  const x = 'caller';\n  return outer()();\n}\nconsole.log(caller());"),
      ch("console.log(a) natijasi?", "1", ["undefined", "ReferenceError", "null"], "var blok scope ga ega emas, funksiya (yoki global) darajasida ko'rinadi.", "if (true) { var a = 1; }\nconsole.log(a);"),
      ch("console.log(b) natijasi?", "ReferenceError", ["2", "undefined", "null"], "let faqat blok ichida ko'rinadi.", "if (true) { let b = 2; }\nconsole.log(b);"),
      ch("Brauzerning global scope ida var g = 1 va let h = 2 e'lon qilindi. window.g va window.h?", "1 va undefined", ["1 va 2", "undefined va 2", "undefined va undefined"], "Global var window xususiyatiga aylanadi, let esa alohida leksik muhitda."),
      ch("Natija?", "'inner'", ["'outer'", "undefined", "ReferenceError"], "Ichki x tashqisini berkitadi (shadowing).", "const x = 'outer';\nfunction f() {\n  const x = 'inner';\n  return x;\n}\nconsole.log(f());"),
      ch("Sloppy rejimda nima sodir bo'ladi?", "Global o'zgaruvchi yaratiladi va 5 chiqadi", ["ReferenceError", "undefined", "Hech narsa"], "e'lon qilinmagan nomga tayinlash implicit global yaratadi (strict rejimda xato).", "function f() { total = 5; }\nf();\nconsole.log(total);"),
      ch("catch (e) dagi e qayerda ko'rinadi?", "Faqat catch bloki ichida", ["Butun funksiyada", "Global scope da", "try blokida ham"], "e catch uchun blok-darajali parametr."),
      ch("Scope chain qaysi tartibda qidiradi?", "Joriy scope → tashqi → ... → global", ["Global → joriy", "Tasodifiy", "Faqat joriy scope"], "Topilmasa tashqariga qarab ketadi; global da ham topilmasa ReferenceError."),
      ch("Funksiya ichida var x ham, parametr x ham bor. Nima bo'ladi?", "Parametr qiymati saqlanadi: var qayta e'lon yangi o'zgaruvchi yaratmaydi", ["SyntaxError", "x doim undefined bo'ladi", "Ikkita alohida x paydo bo'ladi"], "var x (qiymat bermasdan) parametr qiymatini o'chirmaydi.", "function f(x) {\n  var x;\n  return x;\n}\nconsole.log(f(7));"),
      ch("Xuddi shu kodda let x yozilsa?", "SyntaxError: x allaqachon e'lon qilingan", ["7", "undefined", "Ishlaydi, x = 7"], "let bir scope da qayta e'lon qilishga ruxsat bermaydi, parametr va tana bir scope.", "function f(x) {\n  let x;\n}"),
      ch("typeof biror e'lon qilinmagan nom va let TDZ dagi nom uchun?", "Birinchisi 'undefined', ikkinchisi ReferenceError", ["Ikkalasi 'undefined'", "Ikkalasi ReferenceError", "Birinchisi ReferenceError, ikkinchisi 'undefined'"], "TDZ da turgan nomga typeof ham xato beradi.", "console.log(typeof missing);\nconsole.log(typeof tdz);\nlet tdz = 1;"),
    ],
  });
};
