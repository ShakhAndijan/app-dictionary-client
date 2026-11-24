// JavaScript, lessons 9-16.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 9 */
  lesson({
    title: 'Hoisting va TDZ',
    intro: "Hoisting (ko'tarilish), TDZ (Temporal Dead Zone — vaqtinchalik o'lik zona), funksiya va o'zgaruvchi e'lonlari.",
    theory: {
      analogy: { icon: '📋', title: 'Mehmonlar ro\'yxati', text: "To'yda mehmonlar ro'yxati oldindan tuziladi (creation phase): ism bor, lekin hali stolga o'tirmagan (qiymat yo'q). var mehmoni 'kelmagan' deb yozilgan (undefined), let mehmoni esa 'ro'yxatda bor, lekin kirish taqiqlangan, kelguncha unga murojaat qilish xato' (TDZ)." },
      sections: [
        { heading: 'Hoisting aslida nima', text: "Hoisting (ko'tarilish) — kod bajarilishidan oldin, creation fazasida dvigatel scope dagi barcha e'lonlarni topib, xotirada joy ajratishi. Kod fizik ravishda 'yuqoriga ko'chirilmaydi', faqat e'lonlar oldindan ma'lum bo'ladi. Qiymat berish esa o'z joyida qoladi." },
        { table: { head: ['E\'lon', 'Ko\'tariladimi', 'E\'londan oldin murojaat'], rows: [['function f() {}', "Ha, to'liq (nom + tana)", 'Ishlaydi'], ['var x = 1', 'Ha, faqat e\'lon (undefined)', 'undefined'], ['let / const', "Ha, lekin TDZ da", 'ReferenceError'], ['class A {}', 'Ha, lekin TDZ da', 'ReferenceError'], ['const f = () => {}', 'Faqat o\'zgaruvchi (TDZ)', 'ReferenceError'], ['var f = function(){}', "var kabi (undefined)", 'TypeError: f is not a function']] } },
        { heading: 'TDZ', text: "Temporal Dead Zone (vaqtinchalik o'lik zona) — scope boshidan let/const qatoriga yetgunicha bo'lgan oraliq. Bu vaqtda o'zgaruvchi mavjud, lekin ishga tushirilmagan, unga murojaat (hatto typeof ham) ReferenceError beradi. 'Vaqtinchalik' deyilishining sababi: zona joyga emas, bajarilish VAQTIGA bog'liq." },
        { code: { lang: 'js', text: "console.log(typeof a);   // 'undefined' (var)\nvar a = 1;\n\ntry { console.log(b); } catch (e) { console.log(e.name); }  // 'ReferenceError'\nlet b = 2;\n\nfoo();                   // ishlaydi\nfunction foo() { console.log('foo'); }\n\nvar x = 'tashqi';\nfunction f() {\n  console.log(x);        // undefined! ichkaridagi var x ko'tarilgan va tashqisini berkitgan\n  var x = 'ichki';\n}\nf();" } },
        { bullets: ["Funksiya va var bir nomda bo'lsa, funksiya yutadi (keyin var tayinlash qiymatni almashtiradi).", "Funksiya ichidagi var o'zgaruvchi shu funksiyaning boshiga ko'tariladi, blokning emas.", "TDZ shu uchun yaxshi: e'londan oldin ishlatish xatolarini bartaraf etadi."] },
      ],
      recap: ["Hoisting — e'lonlar oldindan ma'lum, qiymat joyida.", "var → undefined, let/const/class → TDZ.", "Function declaration to'liq ko'tariladi.", "Ichki var tashqi nomni berkitishi mumkin."],
    },
    defs: [
      ['Hoisting (ko\'tarilish)', "dvigatel e'lonlarni kod bajarilishidan oldin scope boshiga 'qayd etishi'. Kod ko'chmaydi, faqat e'lonlar oldindan xotirada joy oladi."],
      ['TDZ (Temporal Dead Zone, vaqtinchalik o\'lik zona)', "let/const/class uchun scope boshidan e'lon qatorigacha bo'lgan vaqt oralig'i; bu paytda murojaat ReferenceError beradi."],
      ['Declaration va initialization (e\'lon va boshlang\'ich qiymat berish)', "declaration — nomni yaratish, initialization — birinchi qiymat berish. var da ikkalasi ajratilgan: e'lon ko'tariladi, initialization yo'q."],
      ['Function declaration hoisting (funksiya e\'lonining ko\'tarilishi)', "funksiyaning nomi va tanasi to'liq oldindan tayyor turishi."],
    ],
    life: [
      ['🎟️', 'Chipta bron qilish', "Joy oldindan bron qilingan (e'lon ko'tarilgan), lekin chiptani olmaguningizcha (initialization) zalga kira olmaysiz: TDZ."],
      ['🧾', 'Menyudagi taom', "Menyuda (creation) taom bor, lekin oshxonada hali tayyor emas (undefined). Let — 'tayyor bo'lmaguncha buyurtma qabul qilinmaydi'."],
    ],
    practice: [
      { title: 'Hoisting sinov', text: "var, let, function, class va arrow uchun e'londan oldin chaqirish tajribasini o'tkazing va natijalar jadvalini to'ldiring." },
      { title: 'Berkitish tuzog\'i', text: "Tashqi var x bor, funksiya ichida ham var x bor holat yozing va log nima chiqarishini tushuntiring." },
    ],
    items: [
      ch("Natija?", "undefined", ["ReferenceError", "5", "null"], "var e'loni ko'tariladi va undefined bilan boshlanadi.", "console.log(a);\nvar a = 5;"),
      ch("Natija?", "ReferenceError", ["undefined", "5", "null"], "let TDZ da turibdi.", "console.log(a);\nlet a = 5;"),
      ch("f() natijasi?", "undefined", ["'tashqi'", "'ichki'", "ReferenceError"], "Ichki var x funksiya boshiga ko'tarilib, tashqi x ni berkitadi, lekin hali qiymat berilmagan.", "var x = 'tashqi';\nfunction f() {\n  console.log(x);\n  var x = 'ichki';\n}\nf();"),
      ch("Xuddi shu kodda ichkaridagi var x o'rniga let x bo'lsa?", "ReferenceError", ["'tashqi'", "undefined", "'ichki'"], "Ichki let x butun funksiya blokida TDZ yaratadi va tashqi x ni berkitadi.", "var x = 'tashqi';\nfunction f() {\n  console.log(x);\n  let x = 'ichki';\n}\nf();"),
      ch("hello() nima qiladi?", "TypeError: hello is not a function", ["'salom' chiqaradi", "ReferenceError", "undefined chiqaradi"], "var hello undefined bo'lib ko'tariladi, funksiya esa keyinroq beriladi.", "hello();\nvar hello = function () { console.log('salom'); };"),
      ch("Nima chiqadi?", "'b'", ["'a'", "undefined", "TypeError"], "Funksiya va var bir nomda: funksiya ko'tariladi, hech narsa qayta tayinlanmaguncha shu qoladi. Tayinlash esa kod ichida bajariladi. Bu yerda tayinlash yo'q.", "var f;\nfunction f() { return 'b'; }\nconsole.log(f());"),
      ch("Nima chiqadi?", "'a'", ["'b'", "undefined", "TypeError"], "Funksiya ko'tariladi, keyin bajarilish davomida var f = ... qatori f ni qayta yozadi.", "function f() { return 'b'; }\nvar f = function () { return 'a'; };\nconsole.log(f());"),
      ch("class e'lonidan oldin new A() chaqirilsa?", "ReferenceError (TDZ)", ["Ishlaydi", "TypeError", "undefined"], "class ham TDZ qoidasiga bo'ysunadi."),
      ch("typeof foo, agar foo keyinroq let foo bilan e'lon qilingan (TDZ) bo'lsa?", "ReferenceError", ["'undefined'", "'object'", "'function'"], "TDZ da typeof ham xato beradi."),
      ch("TDZ nima uchun 'temporal' (vaqtinchalik) deyiladi?", "Zona joyga emas, bajarilish vaqtiga bog'liq", ["U faqat 1 soniya davom etadi", "U taymerlarga bog'liq", "U faqat asinxron kodda bor"], "Bir xil kod joyi, lekin murojaat vaqti e'londan oldin bo'lsa xato."),
      ch("Funksiya ichida console.log(typeof g); function g(){} natijasi?", "'function'", ["'undefined'", "ReferenceError", "'object'"], "Function declaration to'liq ko'tariladi.", "function t() {\n  console.log(typeof g);\n  function g() {}\n}\nt();"),
      ch("Hoisting haqida eng to'g'ri gap?", "Kod ko'chmaydi: dvigatel e'lonlarni oldindan scope ga qayd etadi", ["Kod haqiqatan yuqoriga ko'chadi", "Faqat var ko'tariladi", "Faqat funksiya ko'tariladi"], "Qiymat berish o'z joyida qoladi."),
    ],
  });

  /* 10 */
  lesson({
    title: 'Closure (yopilma)',
    intro: "Closure nima, qanday saqlanadi, siklda tuzoq, xususiy holat (private state) va xotira oqishi.",
    theory: {
      analogy: { icon: '🎒', title: 'Sayohat ryukzagi', text: "Funksiya tug'ilgan joyidan 'ryukzak' olib ketadi: o'sha joydagi o'zgaruvchilar. Uni boshqa joyga olib borib chaqirsangiz ham, ryukzak ichidagi narsalar o'sha-o'shaligicha ishlatiladi. Bu ryukzak — closure." },
      sections: [
        { heading: "Closure nima", text: "Closure (yopilma) — funksiya va u e'lon qilingan leksik muhitga (lexical environment) havolasining birgalikdagi to'plami. Ichki funksiya tashqi funksiya tugagandan keyin ham tashqi o'zgaruvchilarni 'eslab qoladi', chunki dvigatel ular turgan muhitni (hayotda ushlab turadi) tozalamaydi. MUHIM: closure qiymatni emas, O'ZGARUVCHINING O'ZINI (bog'lanishni) ushlaydi — shuning uchun keyingi o'zgarishlar ham ko'rinadi." },
        { code: { lang: 'js', text: "function counter() {\n  let n = 0;                // xususiy holat\n  return () => ++n;\n}\nconst a = counter(), b = counter();\na(); a();   // 1, 2\nb();        // 1  (har chaqiruv o'z muhitini yaratadi)" } },
        { heading: 'Siklda klassik tuzoq', code: { lang: 'js', text: "var fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nfns.map(f => f());     // [3, 3, 3]  bitta umumiy i\n\nlet fns2 = [];\nfor (let j = 0; j < 3; j++) fns2.push(() => j);\nfns2.map(f => f());    // [0, 1, 2]  har iteratsiyaga alohida j" } },
        { heading: 'Qayerda ishlatiladi', bullets: ["Private state (xususiy holat) — tashqaridan kirib bo'lmaydigan o'zgaruvchi (counter, bank hisobi).", "Function factory (funksiya zavodi) — sozlangan funksiya qaytarish: multiplier(2).", "Currying va partial application (qisman qo'llash).", "Module pattern (modul andozasi) va memoization (natijani keshlash).", "Callback va event handler lar atrofdagi o'zgaruvchilarni ushlab turadi."] },
        { callout: { kind: 'warn', text: "Closure xotirani ushlab turadi: katta massivga havola qoldirgan uzoq yashovchi funksiya (masalan, hodisa tinglovchisi) uni garbage collector dan saqlab, memory leak (xotira oqishi) keltirib chiqarishi mumkin." } },
      ],
      recap: ["Closure = funksiya + leksik muhitga havola.", "Qiymatni emas, o'zgaruvchining o'zini ushlaydi.", "var siklida hammasi bitta i ni ko'radi, let da alohida.", "Xususiy holat va factory uchun ishlatiladi."],
    },
    defs: [
      ['Closure (yopilma)', "funksiyaning o'zi e'lon qilingan muhitdagi o'zgaruvchilarga, tashqi funksiya tugagandan keyin ham, kirish imkoniyatini saqlab qolishi."],
      ['Lexical environment (leksik muhit)', "o'zgaruvchilar jadvali va tashqi muhitga havola; closure shu havolani ushlab turadi."],
      ['Private state (xususiy holat)', "tashqaridan to'g'ridan-to'g'ri o'zgartirib bo'lmaydigan, faqat berilgan funksiyalar orqali boshqariladigan ma'lumot."],
      ['Function factory (funksiya zavodi)', "parametrga qarab sozlangan yangi funksiyalar yasab beruvchi funksiya."],
      ['Memory leak (xotira oqishi)', "endi kerak bo'lmagan ma'lumot havola ushlab turilgani uchun tozalanmasligi."],
    ],
    life: [
      ['🏦', 'Seyf', "Seyf kaliti (qaytarilgan funksiya) faqat sizda. Ichidagi pulga (xususiy o'zgaruvchi) boshqa hech kim to'g'ridan-to'g'ri qo'l tegiza olmaydi."],
      ['📸', 'Eslab qolgan xona', "Fotoaparatdan chiqqan rasm vaqtida 'xona' o'zgarmaydi; closure esa rasm emas, xonaning o'ziga kalit: xona o'zgarsa, kalit orqali o'zgarishni ko'rasiz."],
    ],
    practice: [
      { title: 'once() yozing', text: "Funksiyani faqat bir marta bajaradigan once(fn) yozing (closure da called bayrog'i bilan)." },
      { title: 'Memoize', text: "Sekin funksiya natijasini argument bo'yicha keshlaydigan memoize(fn) yozing va chaqiruvlar sonini o'lchang." },
    ],
    items: [
      ch("a() ni ikki marta, keyin b() ni bir marta chaqirsak natija?", "a: 1 va 2, b: 1", ["a: 1, 1 va b: 1", "a: 1, 2 va b: 3", "a: 2, 2 va b: 2"], "Har counter() chaqiruvi o'z leksik muhitini yaratadi.", "function counter() {\n  let n = 0;\n  return () => ++n;\n}\nconst a = counter(), b = counter();\na(); a(); b();"),
      ch("fns.map(f => f()) natijasi?", "[3, 3, 3]", ["[0, 1, 2]", "[1, 2, 3]", "[undefined, undefined, undefined]"], "var bitta umumiy i; sikl tugagach i = 3.", "var fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f()));"),
      ch("Xuddi shu kodda var o'rniga let ishlatilsa?", "[0, 1, 2]", ["[3, 3, 3]", "[2, 2, 2]", "[1, 2, 3]"], "let har iteratsiyaga yangi bog'lanish yaratadi."),
      ch("Natija?", "2", ["1", "undefined", "ReferenceError"], "Closure qiymatni emas, o'zgaruvchining o'zini ushlaydi: keyingi o'zgarish ko'rinadi.", "let x = 1;\nconst f = () => x;\nx = 2;\nconsole.log(f());"),
      ch("Natija?", "1", ["2", "undefined", "NaN"], "Argument parametrga nusxalandi: f ushlagan v tashqi x dan ajralgan.", "let x = 1;\nfunction make(v) { return () => v; }\nconst f = make(x);\nx = 2;\nconsole.log(f());"),
      ch("secret o'zgaruvchiga tashqaridan qanday erishiladi?", "Faqat qaytarilgan get/set funksiyalari orqali", ["obj.secret", "window.secret", "Hech qanday usulsiz, hatto get orqali ham"], "Closure xususiy holatni yashiradi.", "function box() {\n  let secret = 42;\n  return { get: () => secret, set: v => { secret = v; } };\n}"),
      ch("Natija?", "'b', 'b'", ["'a', 'b'", "'a', 'a'", "undefined, 'b'"], "ikkala funksiya ham bitta name o'zgaruvchisini ushlaydi; sikldan keyin u 'b'.", "const fs = [];\nlet name = 'a';\nfs.push(() => name);\nname = 'b';\nfs.push(() => name);\nconsole.log(fs[0](), fs[1]());"),
      ch("Closure memory leak ga qachon olib kelishi mumkin?", "Katta obyektga havola ushlagan uzoq yashovchi funksiya (masalan, tinglovchi) tozalanmasa", ["Har doim", "Hech qachon", "Faqat arrow funksiyalarda"], "Havola bor ekan, garbage collector obyektni o'chira olmaydi."),
      ch("add(1)(2)(3) bajarilishi uchun add qanday yozilgan bo'lishi kerak?", "Har bir qadam keyingi funksiyani qaytaradi (currying)", ["Massiv qaytaradi", "Obyekt qaytaradi", "Hech narsa qaytarmaydi"], "Har ichki funksiya oldingi argumentlarni closure da ushlab turadi.", "const add = a => b => c => a + b + c;"),
      fill("add(1)(2)(3) natijasi? (raqam)", '6', "a = 1, b = 2, c = 3; yig'indi 6.", null, "const add = a => b => c => a + b + c;\nconsole.log(add(1)(2)(3));"),
      ch("Quyidagilardan qaysi biri closure namunasi EMAS?", "Faqat global o'zgaruvchini ishlatadigan, ichki scope dan hech narsa ushlamaydigan funksiya", ["Taymer callback i atrofdagi o'zgaruvchini o'qiydi", "Counter factory", "Event handler tashqi o'zgaruvchini o'zgartiradi"], "Texnik jihatdan har funksiya closure, lekin amaliy ma'noda 'ushlab turish' bor joyda ahamiyatli."),
      ch("Funksiya qaerdan chaqirilishining closure ga ta'siri?", "Hech qanday: closure e'lon joyi bo'yicha belgilanadi", ["Chaqirilgan joyning o'zgaruvchilarini ko'radi", "Global scope ni ko'radi", "Har safar o'zgaradi"], "Lexical scope: yozilgan joy hal qiladi."),
    ],
  });

  /* 11 */
  lesson({
    title: 'this kalit so\'zi',
    intro: "this qiymati qanday aniqlanadi: chaqiruv usuli, call/apply/bind, new va arrow funksiya.",
    theory: {
      analogy: { icon: '🙋', title: '"Men" so\'zi', text: "'Men' deganda gapirayotgan odam nazarda tutiladi: kim gapirsa, 'men' o'sha. this ham shunday: funksiya QAYERDA YOZILGANIGA emas, QANDAY CHAQIRILGANIGA qarab boshqa obyektni bildiradi. Arrow funksiya esa istisno: u o'zining 'men' i yo'q, atrofdagi 'men' ni ishlatadi." },
      sections: [
        { heading: 'this ni aniqlash tartibi (ustuvorlik)', table: { head: ['Chaqiruv', 'this', 'Misol'], rows: [['new bilan', "Yangi yaratilgan obyekt", 'new F()'], ['call / apply / bind', "Ko'rsatilgan obyekt", 'f.call(obj)'], ['Metod sifatida', "Nuqtadan oldingi obyekt", 'obj.f()'], ['Oddiy chaqiruv', "undefined (strict) yoki global", 'f()'], ['Arrow function', "Tashqi scope dagi this (leksik)", '() => this']] } },
        { code: { lang: 'js', text: "const user = {\n  name: 'Ali',\n  hi() { return this.name; },\n  arrow: () => typeof this,\n};\nuser.hi();            // 'Ali'\nconst f = user.hi;\nf();                  // this yo'qoldi: strict rejimda TypeError (undefined.name)\n\nconst bound = user.hi.bind({ name: 'Vali' });\nbound();              // 'Vali'\nbound.call({ name: 'Sami' });  // hali ham 'Vali' (bind qayta bog'lanmaydi)" } },
        { heading: 'Eng ko\'p uchraydigan xatolar', bullets: ["Metodni o'zgaruvchiga olib chaqirish: this yo'qoladi (lost this — yo'qolgan this).", "Metodni callback sifatida uzatish: setTimeout(obj.method, 0) da this boshqa bo'ladi.", "Arrow funksiyani obyekt metodi qilish: this obyekt emas, tashqi scope bo'lib qoladi.", "bind bir marta bog'laydi: keyingi call/apply uni o'zgartira olmaydi; arrow da call/apply this ni o'zgartirmaydi.", "Klass metodlari ham 'this yo'qoladi' xatosiga uchraydi: konstruktorda bind yoki class field arrow bilan hal qilinadi."] },
        { callout: { kind: 'tip', text: "Chaqiruvga qarab this ni aniqlash uchun avval 'nuqta bormi?' deb so'rang: obj.f() — obj; f() — undefined/global; new F() — yangi obyekt; arrow — tashqi." } },
      ],
      recap: ["this chaqirilish usuliga qarab belgilanadi.", "Tartib: new > call/apply/bind > metod > oddiy.", "Arrow da o'z this yo'q: leksik.", "Metodni ajratib olsangiz this yo'qoladi."],
    },
    defs: [
      ['this (kontekst obyekti)', "funksiya qaysi obyekt nomidan chaqirilayotganini bildiruvchi maxsus qiymat; chaqiruv paytida aniqlanadi (arrow dan tashqari)."],
      ['Implicit binding (yashirin bog\'lash)', "obj.method() ko'rinishida nuqtadan oldingi obyekt this bo'lishi."],
      ['Explicit binding (ochiq bog\'lash)', "call, apply yoki bind orqali this ni aniq ko'rsatish."],
      ['Lexical this (leksik this)', "arrow funksiyaning this ni o'zi e'lon qilingan tashqi scope dan olishi."],
      ['Lost this (yo\'qolgan this)', "metodni obyektdan ajratib chaqirish natijasida this ning o'zgarishi."],
    ],
    life: [
      ['🎤', 'Mikrofon', "Mikrofonni kim ushlab tursa, 'men' o'sha. Mikrofonni boshqaga uzatsangiz (metodni olib chaqirsangiz), 'men' o'zgaradi."],
      ['🪪', 'Vakillik', "bind — vakolatnomani qo'ldan bermaslik: hujjat bir marta ma'lum odamga bog'langan; keyin kim uni ko'tarib yursa ham, vakil o'zgarmaydi."],
    ],
    practice: [
      { title: 'this jadvali', text: "Bir funksiyani 6 xil usulda (oddiy, metod, new, call, bind, arrow) chaqirib this ni chiqaring va jadval tuzing." },
      { title: 'setTimeout tuzog\'i', text: "obj.method ni setTimeout ga to'g'ridan-to'g'ri va arrow bilan o'rab uzating; farqni toping." },
    ],
    items: [
      ch("user.hi() natijasi?", "'Ali'", ["undefined", "TypeError", "'Vali'"], "Nuqtadan oldingi obyekt this bo'ladi.", "const user = { name: 'Ali', hi() { return this.name; } };\nconsole.log(user.hi());"),
      ch("f() chaqirilsa (strict rejimda)?", "TypeError (this undefined)", ["'Ali'", "undefined", "''"], "Metod ajratib olindi: this yo'qoldi. Strict rejimda undefined.name xato beradi.", "'use strict';\nconst user = { name: 'Ali', hi() { return this.name; } };\nconst f = user.hi;\nf();"),
      ch("bound() va bound.call({name:'Sami'}) natijalari?", "'Vali' va 'Vali'", ["'Vali' va 'Sami'", "'Ali' va 'Sami'", "undefined va undefined"], "bind natijasi qayta bog'lanmaydi: call this ni o'zgartira olmaydi.", "const user = { name: 'Ali', hi() { return this.name; } };\nconst bound = user.hi.bind({ name: 'Vali' });\nconsole.log(bound(), bound.call({ name: 'Sami' }));"),
      ch("Obyekt literalidagi arrow funksiya (f: () => ...) ichida this qayerdan olinadi?", "Obyektni o'rab turgan tashqi scope dan, obyektdan emas", ["Doim obyektdan (obj.f() deb chaqirilgani uchun)", "Doim undefined", "Funksiyaning o'zidan"], "Arrow this ni e'lon joyidagi leksik scope dan oladi; obyekt literali scope yaratmaydi."),
      ch("Natija?", "'Ali' (arrow ichki funksiya)", ["undefined", "TypeError", "'timer'"], "Arrow this ni metod hi() dan oladi (u obyektga bog'langan).", "const user = {\n  name: 'Ali',\n  hi() { return [1].map(() => this.name)[0]; },\n};\nconsole.log(user.hi());"),
      ch("Xuddi shu kodda ichki arrow o'rniga function () { return this.name } bo'lsa (strict rejim)?", "TypeError", ["'Ali'", "undefined", "''"], "Oddiy function map callback sifatida chaqirilganda this undefined bo'ladi.", "'use strict';\nconst user = {\n  name: 'Ali',\n  hi() { return [1].map(function () { return this.name; })[0]; },\n};\nuser.hi();"),
      ch("new F() da this nima?", "Yangi yaratilgan obyekt", ["Global obyekt", "F ning o'zi", "undefined"], "new yangi obyekt yaratib this ga bog'laydi."),
      ch("setTimeout(user.hi, 0) da this nima?", "Odatda user emas (yo'qoladi)", ["Doim user", "Doim funksiyaning o'zi", "Doim null"], "Metod ajratib uzatildi, callback sifatida chaqirilganda nuqtadan oldingi obyekt yo'q."),
      ch("call va apply farqi?", "call argumentlarni vergul bilan, apply massiv sifatida beradi", ["Farqi yo'q", "call this ni o'zgartirmaydi", "apply faqat metodlarda"], "f.call(o, 1, 2) va f.apply(o, [1, 2])."),
      ch("Arrow funksiyani new bilan chaqirsak?", "TypeError: arrow constructor emas", ["Ishlaydi", "this global bo'ladi", "undefined qaytaradi"], "Arrow ning prototype i va o'z this i yo'q."),
      ch("this ni aniqlashda eng yuqori ustuvorlik kimda?", "new", ["bind", "obj.method()", "Oddiy chaqiruv"], "new bilan yaratilgan obyekt bind qilingan this dan ham ustun."),
      ch("Metodning this ini yo'qotmaslik uchun qaysi biri xavfsiz?", "setTimeout(() => user.hi(), 0)", ["setTimeout(user.hi, 0)", "const f = user.hi; f()", "setTimeout(user.hi(), 0)"], "Arrow ichida chaqiruv obj.method() ko'rinishida qoladi."),
    ],
  });

  /* 12 */
  lesson({
    title: 'Obyektlar',
    intro: "Xossalar, descriptor lar, nusxalash (shallow va deep), getter/setter, freeze va tartib qoidalari.",
    theory: {
      analogy: { icon: '🗃️', title: 'Hujjat shkafi', text: "Obyekt — yorliqli tortmalari bor shkaf: har bir tortma (xossa) nomi bilan topiladi. Shkafning nusxasini olganingizda tortmalar nusxalanadi, ammo ichidagi papkalar (ichki obyektlar) bo'lsa, ular ikkala shkafda ham bitta o'sha papka bo'lib qoladi: bu shallow copy." },
      sections: [
        { heading: 'Xossa tartibi', text: "Obyekt xossalari tartibi qat'iy: avval butun son kalitlar o'sish tartibida ('1', '2', '10'), keyin satr kalitlar qo'shilish tartibida, keyin Symbol lar. Shuning uchun { b: 1, 2: 1, a: 1, 1: 1 } kalitlari 1, 2, b, a tartibida chiqadi." },
        { heading: 'Property descriptor (xossa tavsifnomasi)', table: { head: ['Atribut', 'Ma\'no'], rows: [['value', "Qiymat"], ['writable', "O'zgartirsa bo'ladimi"], ['enumerable', "for...in / Object.keys da ko'rinadimi"], ['configurable', "O'chirish va atributlarni o'zgartirish mumkinmi"], ['get / set', "Accessor (kirish funksiyalari)"]] } },
        { code: { lang: 'js', text: "const o = {};\nObject.defineProperty(o, 'id', { value: 1 });  // writable/enumerable/configurable: false\no.id = 2;              // jimgina e'tiborsiz (strict rejimda TypeError)\nObject.keys(o);        // [] (enumerable emas)\n\nconst frozen = Object.freeze({ a: 1, inner: { b: 1 } });\nfrozen.a = 2;          // o'zgarmaydi\nfrozen.inner.b = 2;    // O'ZGARADI: freeze faqat birinchi darajani muzlatadi" } },
        { heading: 'Nusxalash', table: { head: ['Usul', 'Chuqurlik'], rows: [['{ ...o }, Object.assign({}, o)', 'Shallow (ichki obyektlar ulashiladi)'], ['structuredClone(o)', "Deep (funksiya va DOM ni nusxalamaydi)"], ['JSON.parse(JSON.stringify(o))', "Deep, lekin Date, undefined, funksiya, Map yo'qoladi/buziladi"]] } },
        { bullets: ["Optional chaining va destructuring (destrukturizatsiya — tarkibni bo'lish): const { a, b: { c } = {} } = o.", "Computed property (hisoblanuvchi xossa): { [key]: 1 }.", "in operatori prototype ni ham tekshiradi, Object.hasOwn(o, k) esa faqat o'zining xossasini.", "Getter/setter: get area() { return this.w * this.h }."] },
      ],
      recap: ["Kalitlar tartibi: butun sonlar, satrlar, Symbol.", "freeze va spread — shallow.", "Descriptor: writable/enumerable/configurable.", "Deep copy uchun structuredClone."],
    },
    defs: [
      ['Property descriptor (xossa tavsifnomasi)', "xossaning value, writable, enumerable, configurable atributlarini tavsiflovchi obyekt; Object.defineProperty bilan o'rnatiladi."],
      ['Shallow copy (yuzaki nusxa)', "faqat birinchi daraja nusxalanadi, ichki obyektlar esa ikkala nusxada bitta bo'lib qoladi."],
      ['Deep copy (chuqur nusxa)', "barcha ichki daraja ham mustaqil nusxalanadi."],
      ['Destructuring (destrukturizatsiya)', "obyekt yoki massiv qiymatlarini alohida o'zgaruvchilarga qisqa sintaksis bilan ajratib olish."],
      ['Accessor property (kirish xossasi)', "qiymat o'rniga get/set funksiyalari bilan aniqlanadigan xossa."],
    ],
    life: [
      ['📁', 'Papkaning nusxasi', "Papkaning ichidagi hujjatlar nusxalansa, lekin ichki 'qulflangan konvert' (ichki obyekt) bitta bo'lib qolsa — bu yuzaki nusxa. Konvertga yozsangiz, ikkala papkada ham o'zgaradi."],
      ['🔒', 'Freeze', "Muzlatilgan shkaf: tortmalarni qo'shib-olib bo'lmaydi, lekin ichidagi alohida seyf (ichki obyekt) hali ochiq."],
    ],
    practice: [
      { title: 'Deep clone yozish', text: "Rekursiv deepClone(o) yozing va structuredClone bilan natijalarini solishtiring (Date, sirkulyar havola)." },
      { title: 'defineProperty', text: "Yashirin (enumerable: false) va faqat o'qiladigan xossalar yarating, Object.keys va JSON.stringify natijasiga qarang." },
    ],
    items: [
      ch("Object.keys natijasi?", "['1', '2', 'b', 'a']", ["['b', '2', 'a', '1']", "['1', '2', 'a', 'b']", "['b', 'a', '2', '1']"], "Butun sonli kalitlar birinchi (o'sish tartibida), keyin satrlar qo'shilish tartibida.", "console.log(Object.keys({ b: 1, 2: 1, a: 1, 1: 1 }));"),
      ch("frozen.inner.b natijasi?", "2", ["1", "TypeError", "undefined"], "Object.freeze faqat birinchi darajani muzlatadi.", "const frozen = Object.freeze({ inner: { b: 1 } });\nfrozen.inner.b = 2;\nconsole.log(frozen.inner.b);"),
      ch("copy.inner.x natijasi?", "2", ["1", "undefined", "TypeError"], "Spread yuzaki nusxa: inner ikkala obyektda bitta.", "const o = { inner: { x: 1 } };\nconst copy = { ...o };\ncopy.inner.x = 2;\nconsole.log(o.inner.x);"),
      ch("c.inner.x natijasi?", "1", ["2", "undefined", "TypeError"], "structuredClone chuqur nusxa yaratadi.", "const o = { inner: { x: 1 } };\nconst c = structuredClone(o);\nc.inner.x = 2;\nconsole.log(o.inner.x);"),
      ch("JSON.parse(JSON.stringify({ a: undefined, d: new Date(0), f() {} })) natijasi?", "{ d: '1970-01-01T00:00:00.000Z' }", ["{ a: undefined, d: Date, f: Function }", "{}", "Xato"], "undefined va funksiya tushib qoladi, Date esa satrga aylanadi."),
      ch("Object.defineProperty(o, 'id', { value: 1 }) dan keyin Object.keys(o)?", "[] (enumerable false)", ["['id']", "['1']", "Xato"], "Berilmagan atributlar default false."),
      ch("'toString' in {} va Object.hasOwn({}, 'toString') natijalari?", "true va false", ["true va true", "false va false", "false va true"], "in prototype zanjirini ham tekshiradi; hasOwn faqat o'zining xossasini."),
      ch("Natija?", "undefined", ["TypeError", "'x'", "null"], "Mavjud bo'lmagan xossaga murojaat undefined beradi, xato emas.", "const o = {};\nconsole.log(o.a);"),
      ch("Natija?", "TypeError", ["undefined", "1", "null"], "undefined xossasiga murojaat xato beradi; ?. buni oldini oladi.", "const o = {};\nconsole.log(o.a.b);"),
      ch("const { a, b: { c } = {} } = { a: 1 }; c natijasi?", "undefined", ["TypeError", "1", "null"], "b yo'q, default {} ishlatildi, undan c esa undefined.", "const { a, b: { c } = {} } = { a: 1 };\nconsole.log(c);"),
      ch("Getter nima uchun kerak?", "Xossaga murojaat qilganda hisoblash bajarish uchun", ["Faqat private qilish uchun", "Obyektni muzlatish uchun", "Tezroq ishlash uchun"], "get area() — o'qilganda hisoblanadi, xossa sifatida ko'rinadi."),
      ch("Object.assign({}, a, b) da ikkala obyektda bir xil kalit bo'lsa?", "Oxirgi (b) qiymati yutadi", ["Birinchisi yutadi", "Xato", "Ikkalasi massivga birlashadi"], "Keyingi manba oldingisini ustidan yozadi."),
    ],
  });

  /* 13 */
  lesson({
    title: 'Prototype',
    intro: "Prototype zanjiri (prototype chain), [[Prototype]], __proto__, Object.create va meros.",
    theory: {
      analogy: { icon: '🧬', title: 'Oila daraxti', text: "Bola biror narsani bilmasa, otasidan so'raydi, ota bilmasa — bobosidan. Obyekt ham xossani topa olmasa, o'zining prototype iga (otasiga), keyin uning prototype iga qarab zanjir bo'ylab ko'tariladi, null ga yetguncha." },
      sections: [
        { heading: 'Prototype zanjiri', text: "Har bir obyektning yashirin [[Prototype]] havolasi bor (u __proto__ yoki Object.getPrototypeOf(o) orqali ko'rinadi). Xossaga murojaat qilinganda avval obyektning o'zida, topilmasa prototype da, keyin uning prototype ida qidiriladi, zanjir null bilan tugaydi: topilmasa undefined. Yozish (assignment) esa doim obyektning O'ZIGA bajariladi, prototype ga emas (setter bo'lmasa)." },
        { code: { lang: 'js', text: "const animal = { eats: true, walk() { return 'yuradi'; } };\nconst rabbit = Object.create(animal);\nrabbit.jumps = true;\nrabbit.eats;                       // true (prototype dan)\nObject.keys(rabbit);               // ['jumps'] (faqat o'zining)\nrabbit.eats = false;               // rabbit ning O'ZIGA yoziladi, animal o'zgarmaydi\n\nfunction Person(n) { this.name = n; }\nPerson.prototype.hi = function () { return 'Hi ' + this.name; };\nconst p = new Person('Ali');\np.hi();                            // 'Hi Ali'\nObject.getPrototypeOf(p) === Person.prototype;   // true" } },
        { heading: 'prototype va [[Prototype]] farqi', table: { head: ['Nom', 'Kimda bor', 'Ma\'no'], rows: [['Fn.prototype', 'Faqat funksiyalarda', "new Fn() bilan yaratilgan obyektlarning [[Prototype]] i bo'ladigan obyekt"], ['obj.__proto__ / getPrototypeOf', 'Har obyektda', "Shu obyektning haqiqiy prototype i"]] } },
        { bullets: ["instanceof: o'ng tomondagi konstruktorning prototype i chap obyektning zanjirida bormi, shuni tekshiradi.", "Object.create(null) — prototype siz 'toza' obyekt (toString va boshqalar yo'q): lug'at sifatida qulay.", "for...in prototype dagi enumerable xossalarni ham aylanadi: hasOwn bilan filtrlang.", "Prototype ni dasturda keyin o'zgartirish (setPrototypeOf) unumdorlikni pasaytiradi."] },
      ],
      recap: ["Qidiruv zanjir bo'ylab ko'tariladi, yozish esa o'ziga.", "Fn.prototype — namunalarning prototype i, [[Prototype]] — obyektning o'z prototype i.", "Object.create(null) prototype siz obyekt.", "instanceof zanjirni tekshiradi."],
    },
    defs: [
      ['Prototype (prototip)', "boshqa obyektga xossa va metodlarni 'meros' qilib beradigan obyekt."],
      ['Prototype chain (prototip zanjiri)', "xossa topilmaguncha obyektdan prototype ga, undan keyingisiga ketma-ket qidirish yo'li; null da tugaydi."],
      ['Own property (o\'z xossasi)', "obyektning o'zida (prototype da emas) turgan xossa."],
      ['Constructor function (konstruktor funksiya)', "new bilan chaqirilib yangi obyekt yasaydigan funksiya."],
      ['Delegation (delegatsiya, vakolat berish)', "obyekt bilmagan narsani prototype ga topshirish mexanizmi (JavaScript merosi shunga qurilgan)."],
    ],
    life: [
      ['👨‍👩‍👦', 'Oiladagi ko\'nikmalar', "Bola suzishni bilmasa, ota-onasidan so'raladi. Otasi ham bilmasa, bobosidan. Hech kim bilmasa — javob 'yo'q' (undefined)."],
      ['📖', 'Lug\'at havolasi', "Ichki lug'atda so'z topilmasa, 'umumiy lug'at'ga havola qilinadi, o'sha ham topmasa — null."],
    ],
    practice: [
      { title: 'Zanjir chizish', text: "[] dan boshlab Object.getPrototypeOf ni ketma-ket chaqirib, to null gacha bo'lgan zanjirni chiqaring." },
      { title: 'new ni qo\'lda yozish', text: "myNew(Constructor, ...args) funksiyasini Object.create va apply yordamida yozing." },
    ],
    items: [
      ch("rabbit.eats = false dan keyin animal.eats?", "true (o'zgarmaydi)", ["false", "undefined", "Xato"], "Yozish obyektning o'ziga bajariladi, prototype ga emas.", "const animal = { eats: true };\nconst rabbit = Object.create(animal);\nrabbit.eats = false;\nconsole.log(animal.eats);"),
      ch("Object.keys(rabbit) natijasi?", "['jumps']", ["['eats', 'jumps']", "['jumps', 'eats']", "[]"], "keys faqat o'zining enumerable xossalarini qaytaradi.", "const animal = { eats: true };\nconst rabbit = Object.create(animal);\nrabbit.jumps = true;\nconsole.log(Object.keys(rabbit));"),
      ch("for...in qaysi kalitlarni chiqaradi?", "'jumps', 'eats'", ["Faqat 'jumps'", "Faqat 'eats'", "Hech narsa"], "for...in prototype dagi enumerable xossalarni ham aylanadi (o'zi birinchi).", "const animal = { eats: true };\nconst rabbit = Object.create(animal);\nrabbit.jumps = true;\nfor (const k in rabbit) console.log(k);"),
      ch("Object.getPrototypeOf(p) === Person.prototype?", "true", ["false", "undefined", "Xato"], "new Person() obyektining [[Prototype]] i Person.prototype ga ulanadi.", "function Person(n) { this.name = n; }\nconst p = new Person('Ali');"),
      ch("Object.create(null) dan olingan obyektda o.toString?", "undefined", ["function", "null", "TypeError"], "Prototype yo'q, zanjir darhol null da tugaydi."),
      ch("[].__proto__.__proto__.__proto__ nima?", "null", ["Object.prototype", "undefined", "Array.prototype"], "[] → Array.prototype → Object.prototype → null."),
      ch("p instanceof Person qanday tekshiriladi?", "Person.prototype p ning prototype zanjirida bormi", ["p.constructor === Person", "p.name mavjudmi", "typeof p === 'Person'"], "instanceof zanjirni yuqoriga yurib tekshiradi."),
      ch("Metodni Person.prototype.hi ga qo'yish nima uchun yaxshi?", "Barcha namunalar bitta funksiyani ulashadi: xotira tejaladi", ["Tezroq chaqiriladi", "Private bo'ladi", "Static bo'ladi"], "Konstruktorda this.hi = function... har namuna uchun alohida nusxa yaratadi."),
      ch("a.hasOwnProperty('x') va 'x' in a farqi?", "Birinchisi faqat o'zining, ikkinchisi prototype ni ham tekshiradi", ["Farqi yo'q", "in tezroq", "hasOwnProperty faqat massivlarda"], "Zamonaviy variant: Object.hasOwn(a, 'x')."),
      ch("Natija?", "'Hi Ali'", ["undefined", "TypeError", "'Hi undefined'"], "hi prototype da, lekin this chaqiruvchi p bo'ladi.", "function Person(n) { this.name = n; }\nPerson.prototype.hi = function () { return 'Hi ' + this.name; };\nconsole.log(new Person('Ali').hi());"),
      ch("Prototype zanjiri nimada tugaydi?", "null", ["undefined", "Object", "Function"], "Object.prototype ning [[Prototype]] i null."),
      ch("Function.prototype va obyekt [[Prototype]] farqi?", "prototype faqat funksiyada: new orqali yaratilgan obyektlarning prototype i bo'ladigan obyekt", ["Ular bir xil narsa", "[[Prototype]] faqat funksiyada", "prototype faqat obyektlarda"], "Aniq: Fn.prototype 'namunalar uchun andoza', obj.__proto__ 'meniki'."),
    ],
  });

  /* 14 */
  lesson({
    title: 'Class',
    intro: "Class sintaksisi, constructor, extends, super, static, private maydonlar (#) va getter/setter.",
    theory: {
      analogy: { icon: '🏭', title: 'Qolip', text: "Class — qolip: undan ko'p bir xil shakldagi obyektlar quyiladi. Meros (extends) — asosiy qolipni olib, ustiga yangi shakl qo'shish." },
      sections: [
        { heading: 'Class — prototype ustidagi qulay sintaksis', text: "class sintaksisi (syntactic sugar — sintaktik shakar) ostida hamon funksiya va prototype ishlaydi, lekin farqlar bor: class e'loni TDZ da (hoisting da ishlamaydi), tanasi doim strict rejimda, new siz chaqirib bo'lmaydi, metodlar enumerable emas." },
        { code: { lang: 'js', text: "class Animal {\n  #energy = 10;                 // private maydon (tashqaridan ko'rinmaydi)\n  static count = 0;             // klassning o'ziga tegishli\n  constructor(name) { this.name = name; Animal.count++; }\n  speak() { return this.name + ' ovoz chiqardi'; }\n  get energy() { return this.#energy; }\n}\nclass Dog extends Animal {\n  constructor(name) { super(name); this.tricks = []; }   // super() this dan oldin shart!\n  speak() { return super.speak() + ': hov'; }\n}\nconst d = new Dog('Rex');\nd.speak();          // 'Rex ovoz chiqardi: hov'\nd.#energy;          // SyntaxError (class dan tashqarida)" } },
        { bullets: ["Hosila class konstruktorida this dan oldin super() chaqirilishi shart, aks holda ReferenceError.", "static metodlar instansiyada emas, klassning o'zida turadi: Animal.create().", "#xususiy maydonlar class tashqarisidan ham, hosila class dan ham ko'rinmaydi.", "Metodni callback sifatida uzatsangiz, this yo'qoladi: class field arrow (handle = () => {...}) bilan hal qilinadi.", "extends Array, Error kabi o'rnatilgan klasslarni ham kengaytirish mumkin."] },
        { table: { head: ['Xususiyat', 'class', 'Eski konstruktor funksiya'], rows: [['Hoisting', 'TDZ', "To'liq ko'tariladi"], ['new siz chaqirish', 'TypeError', "Ishlaydi (this xato bo'ladi)"], ['Metodlar enumerable', "Yo'q", 'Ha (prototype ga qo\'shilsa)'], ['Strict rejim', 'Avtomatik', "Qo'lda"]] } },
      ],
      recap: ["class — prototype ustidagi qulay sintaksis.", "Hosilada super() this dan oldin.", "#private tashqaridan ko'rinmaydi, static — klassga tegishli.", "Class new siz chaqirilmaydi va TDZ da."],
    },
    defs: [
      ['Class (sinf)', "bir xil tuzilishdagi obyektlar yaratish uchun andoza; ichida constructor va metodlar bor."],
      ['Inheritance (meros)', "bir klassning boshqa klass xususiyatlarini extends orqali olishi."],
      ['super', "ota klassning konstruktorini (super()) yoki metodlarini (super.method()) chaqirish."],
      ['Private field (xususiy maydon)', "#nom bilan e'lon qilingan, faqat class ichidan ko'rinadigan maydon."],
      ['Static member (statik a\'zo)', "namunaga emas, klassning o'ziga tegishli metod yoki maydon."],
    ],
    life: [
      ['🧁', 'Pishiriq qolipi', "Bitta qolipdan ko'p bir xil pishiriq olinadi. Hosila klass — qolipga qo'shimcha naqsh qo'shish."],
      ['🏢', 'Kompaniya shtati', "Static — kompaniyaning umumiy ma'lumoti (xodimlar soni), private — xodimning shaxsiy maoshi: faqat o'zi ko'radi."],
    ],
    practice: [
      { title: 'Meros zanjiri', text: "Shape → Rectangle → Square meros zanjirini yozing; har biri area() ni super bilan kengaytirsin." },
      { title: 'Private va static', text: "Klassga #id va static counter qo'shib, har new da counter oshishini va #id tashqaridan ko'rinmasligini sinab ko'ring." },
    ],
    items: [
      ch("Nima bo'ladi?", "ReferenceError: super() this dan oldin chaqirilmagan", ["Ishlaydi", "undefined chiqadi", "SyntaxError"], "Hosila klass konstruktorida this faqat super() dan keyin mavjud.", "class A {}\nclass B extends A {\n  constructor() { this.x = 1; super(); }\n}\nnew B();"),
      ch("d.speak() natijasi?", "'Rex ovoz chiqardi: hov'", ["'Rex ovoz chiqardi'", "': hov'", "TypeError"], "super.speak() ota metodini chaqiradi, so'ng ' : hov' qo'shiladi.", "class Animal {\n  constructor(n) { this.name = n; }\n  speak() { return this.name + ' ovoz chiqardi'; }\n}\nclass Dog extends Animal {\n  speak() { return super.speak() + ': hov'; }\n}\nconsole.log(new Dog('Rex').speak());"),
      ch("class A {} ni new siz chaqirsak (A())?", "TypeError", ["undefined qaytaradi", "Ishlaydi", "ReferenceError"], "Class faqat new bilan chaqiriladi."),
      ch("new A() e'londan oldin chaqirilsa?", "ReferenceError (TDZ)", ["Ishlaydi", "TypeError", "undefined"], "class e'loni let kabi TDZ da turadi.", "new A();\nclass A {}"),
      ch("Class tashqarisida obj.#secret ga murojaat?", "SyntaxError", ["undefined", "Qiymat qaytadi", "TypeError"], "Private maydonga faqat class tanasi ichidan murojaat qilish mumkin."),
      ch("static count klassga tegishli. new A().count?", "undefined", ["0", "TypeError", "1"], "Static a'zo namunada emas, A.count orqali ko'rinadi.", "class A { static count = 0; }\nconsole.log(new A().count);"),
      ch("Class metodi callback ga uzatilganda this nima uchun yo'qoladi?", "Metod obyektdan ajraldi: chaqiruvda nuqtadan oldingi obyekt yo'q", ["Class metodlar this ni qo'llamaydi", "Class strict emas", "Metodlar frozen"], "Yechim: bind yoki arrow class field."),
      ch("class field arrow (handle = () => this.x) afzalligi?", "Har namunada this tegishli namunaga qotib qoladi", ["Prototype da joy tejaydi", "Tezroq ishlaydi", "Static bo'ladi"], "Kamchiligi: har namuna uchun alohida funksiya yaratiladi."),
      ch("class ostida aslida nima ishlaydi?", "Funksiya va prototype", ["Alohida obyekt turi", "Faqat Java kabi sinflar", "Proxy"], "typeof class A {} === 'function'."),
      ch("typeof class {} nima?", "'function'", ["'class'", "'object'", "'undefined'"], "Class — funksiyaning maxsus turi."),
      ch("Hosila klass konstruktorsiz yozilsa?", "Standart konstruktor argumentlarni super ga uzatadi", ["Xato", "Obyekt yaratilmaydi", "Argumentlar yo'qoladi"], "constructor(...args) { super(...args); } avtomatik."),
      ch("Dog.prototype.__proto__ === Animal.prototype?", "true", ["false", "undefined", "TypeError"], "extends prototype zanjirini shunday ulaydi."),
    ],
  });

  /* 15 */
  lesson({
    title: 'Massivlar',
    intro: "Massiv metodlari: map, filter, reduce, sort, splice; tuzoqlar va massiv 'bo'shliqlari' (holes).",
    theory: {
      analogy: { icon: '🚂', title: 'Vagonlar', text: "Massiv — raqamlangan vagonlar poyezdi. map har vagonni almashtirib yangi poyezd yasaydi, filter ba'zi vagonlarni ajratadi, reduce hammasidan bitta yuk yig'adi." },
      sections: [
        { heading: 'Mutating va non-mutating metodlar', table: { head: ['Asl massivni O\'ZGARTIRADI', 'Yangi massiv qaytaradi'], rows: [['push, pop, shift, unshift', 'map, filter, slice, concat'], ['splice, sort, reverse', 'toSorted, toReversed, toSpliced, with'], ['fill, copyWithin', 'flat, flatMap, spread']] } },
        { code: { lang: 'js', text: "[10, 9, 1].sort();                 // [1, 10, 9] (matn bo'yicha!)\n[10, 9, 1].sort((a, b) => a - b);   // [1, 9, 10]\n\nconst a = [1, 2, 3, 4, 5];\na.splice(1, 2);        // [2, 3] qaytaradi, a = [1, 4, 5]\na.slice(1, 3);         // asl massiv o'zgarmaydi\n\n[1, 2, 3].reduce((acc, x) => acc + x, 0);   // 6\n[].reduce((a, b) => a + b);                  // TypeError (boshlang'ich qiymat yo'q)\n\n['1', '2', '3'].map(parseInt);   // [1, NaN, NaN] (map indeksni ham beradi!)" } },
        { heading: 'Muhim tafsilotlar', bullets: ["map/forEach/filter callback ga (element, indeks, massiv) beradi: parseInt(str, radix) bilan to'qnashadi.", "forEach async callback ni kutmaydi: for...of + await ishlating.", "Bo'sh joylar (holes — teshiklar): [1, , 3] da index 1 mavjud emas; map ularni o'tkazib yuboradi.", "length ni kamaytirish massivni qisqartiradi: a.length = 0 tozalaydi.", "Massivlar obyekt: [] == [] false (har xil havola).", "includes NaN ni topadi, indexOf topmaydi.", "at(-1) — oxirgi element; flat(Infinity) — to'liq tekislash."] },
        { callout: { kind: 'warn', text: "sort() standart holda elementlarni MATNGA aylantirib solishtiradi. Sonlar uchun doim (a, b) => a - b bering." } },
      ],
      recap: ["splice, sort, reverse asl massivni o'zgartiradi, slice/map/filter yo'q.", "sort() default matn bo'yicha: sonlarga taqqoslash funksiyasi kerak.", "map(parseInt) tuzog'i: indeks radix bo'lib ketadi.", "reduce ga boshlang'ich qiymat bering."],
    },
    defs: [
      ['Array (massiv)', "tartiblangan, indeks bilan nomerlangan ro'yxat; JavaScript da massiv — maxsus obyekt."],
      ['Mutation (o\'zgartirish)', "asl ma'lumotni joyida o'zgartirish. Immutable (o'zgarmas) yondashuvda esa yangi nusxa qaytariladi."],
      ['Callback (qayta chaqiriladigan funksiya)', "boshqa funksiyaga argument qilib uzatiladigan va u tomonidan chaqiriladigan funksiya."],
      ['Reduce (yig\'ish, qisqartirish)', "massivni bitta qiymatga (son, obyekt, massiv) jamlash usuli."],
      ['Holes (teshiklar)', "massivdagi mavjud bo'lmagan indekslar ([1, , 3]); undefined dan farq qiladi."],
    ],
    life: [
      ['🏭', 'Konveyer', "map — har bir detalni bir xil ishlov bilan o'tkazish, filter — nuqsonlilarini ajratish, reduce — hammasini bitta qutiga yig'ish."],
      ['📝', 'Qog\'ozdagi ro\'yxat', "sort/splice asl qog'ozning o'ziga yozadi, slice/map esa nusxa olib ishlaydi."],
    ],
    practice: [
      { title: 'Ma\'lumotni guruhlash', text: "reduce bilan foydalanuvchilar massivini shahar bo'yicha guruhlab { Toshkent: [...], ... } obyektiga aylantiring." },
      { title: 'sort tuzog\'i', text: "[10, 2, 33, 4].sort() va sort((a, b) => a - b) natijalarini solishtiring; keyin satrlarni localeCompare bilan saralang." },
    ],
    items: [
      ch("[10, 9, 1].sort() natijasi?", "[1, 10, 9]", ["[1, 9, 10]", "[10, 9, 1]", "[9, 10, 1]"], "Standart sort matn bo'yicha: '1' < '10' < '9'."),
      ch("a ning oxirgi holati?", "[1, 4, 5]", ["[2, 3]", "[1, 2, 3, 4, 5]", "[1, 4]"], "splice(1, 2) asl massivdan 2 ta elementni olib tashlaydi va ularni qaytaradi.", "const a = [1, 2, 3, 4, 5];\na.splice(1, 2);\nconsole.log(a);"),
      ch("['1','2','3'].map(parseInt) natijasi?", "[1, NaN, NaN]", ["[1, 2, 3]", "[1, 1, 1]", "[NaN, NaN, NaN]"], "map (element, indeks) beradi: parseInt('2', 1) va parseInt('3', 2) NaN.", "console.log(['1', '2', '3'].map(parseInt));"),
      ch("[].reduce((a, b) => a + b) ?", "TypeError", ["0", "undefined", "NaN"], "Bo'sh massivda boshlang'ich qiymat bo'lmasa reduce xato beradi."),
      fill("[1, 2, 3, 4].reduce((acc, x) => acc + x, 10) natijasi? (raqam)", '20', "10 dan boshlab 1+2+3+4 qo'shiladi: 20.", null),
      ch("[] == [] natijasi?", "false", ["true", "TypeError", "undefined"], "Ikkita alohida massiv — ikkita har xil havola."),
      ch("[NaN].includes(NaN) va [NaN].indexOf(NaN) ?", "true va -1", ["true va 0", "false va -1", "false va 0"], "includes SameValueZero ishlatadi, indexOf esa === ni."),
      ch("[1, , 3].map(x => x * 2) natijasi?", "[2, empty, 6]", ["[2, NaN, 6]", "[2, 0, 6]", "[2, undefined, 6]"], "map teshiklarni o'tkazib yuboradi, teshik saqlanadi.", "console.log([1, , 3].map(x => x * 2));"),
      ch("const a = [1, 2, 3]; a.length = 1; a ?", "[1]", ["[1, 2, 3]", "[3]", "Xato"], "length ni kamaytirish massivni qisqartiradi."),
      ch("[3, 1, 2].toSorted() va asl massiv?", "Yangi saralangan massiv qaytadi, asl o'zgarmaydi", ["Asl saralanadi", "Xato", "undefined qaytadi"], "toSorted — non-mutating variant."),
      ch("Quyida nima chiqadi?", "undefined", ["Promise", "1, 2, 3 keyin 'tugadi'", "Xato"], "forEach return qiymatiga ega emas va async callback larni kutmaydi.", "const r = [1, 2, 3].forEach(async x => await x);\nconsole.log(r);"),
      ch("[[1, [2]], [3]].flat() natijasi?", "[1, [2], 3]", ["[1, 2, 3]", "[[1, 2], 3]", "[[1, [2]], [3]]"], "flat() standart chuqurligi 1."),
      ch("Massiv oxirgi elementiga zamonaviy murojaat?", "arr.at(-1)", ["arr[-1]", "arr.last", "arr.end()"], "arr[-1] undefined beradi (indeks emas, oddiy xossa nomi)."),
    ],
  });

  /* 16 */
  lesson({
    title: 'Funksional dasturlash',
    intro: "Sof funksiyalar, immutability, high-order funksiyalar, currying, compose va pipe.",
    theory: {
      analogy: { icon: '🧮', title: 'Matematik formula', text: "f(x) = x + 1 formulasi bir xil x ga doim bir xil natija beradi va hech narsani o'zgartirmaydi. Funksional dasturlash kodni shu darajada bashorat qilinadigan qilib yozishga intiladi." },
      sections: [
        { heading: 'Asosiy g\'oyalar', bullets: ["Pure function (sof funksiya): faqat argumentga bog'liq, tashqi holatni o'zgartirmaydi (side effect — yon ta'sir yo'q).", "Immutability (o'zgarmaslik): ma'lumotni joyida o'zgartirish o'rniga yangi nusxa yaratish.", "Higher-order function (yuqori tartibli funksiya): funksiyani argument sifatida oladi yoki funksiya qaytaradi (map, filter).", "First-class function: funksiya — qiymat.", "Declarative (deklarativ) uslub: 'qanday' emas, 'nima' deb yozish."] },
        { code: { lang: 'js', text: "// sof emas: tashqi o'zgaruvchini o'zgartiradi\nlet total = 0;\nconst add = x => (total += x);\n\n// sof: yangi qiymat qaytaradi\nconst addPure = (total, x) => total + x;\n\n// immutable yangilash\nconst user = { name: 'Ali', age: 20 };\nconst older = { ...user, age: 21 };\n\n// currying\nconst mul = a => b => a * b;\nconst double = mul(2);   // qisman qo'llash (partial application)\ndouble(5);               // 10\n\n// compose / pipe\nconst pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\npipe(x => x + 1, x => x * 2)(3);   // 8" } },
        { heading: 'compose va pipe farqi', table: { head: ['', 'Tartib', 'Misol'], rows: [['pipe', "Chapdan o'ngga (o'qilishi tabiiy)", 'pipe(f, g)(x) = g(f(x))'], ['compose', "O'ngdan chapga (matematik)", 'compose(f, g)(x) = f(g(x))']] } },
        { callout: { kind: 'info', text: "Sof funksiyalarni test qilish oson, parallel ishga tushirish xavfsiz va natijani keshlash (memoization) mumkin, chunki bir xil kirish doim bir xil chiqish beradi." } },
      ],
      recap: ["Sof funksiya: bir xil kirish, bir xil chiqish, yon ta'sirsiz.", "Immutability: spread va map bilan yangi nusxa.", "Currying: f(a, b) → f(a)(b).", "pipe chapdan o'ngga, compose o'ngdan chapga."],
    },
    defs: [
      ['Pure function (sof funksiya)', "natijasi faqat argumentlarga bog'liq va hech qanday tashqi holatni o'zgartirmaydigan funksiya."],
      ['Side effect (yon ta\'sir)', "funksiyaning o'z natijasidan tashqari narsani o'zgartirishi: global o'zgaruvchi, DOM, tarmoq, konsol."],
      ['Higher-order function (yuqori tartibli funksiya)', "funksiyani argument sifatida oladigan yoki funksiya qaytaradigan funksiya."],
      ['Currying (karring)', "ko'p argumentli funksiyani bir argumentli funksiyalar zanjiriga aylantirish."],
      ['Composition (kompozitsiya)', "kichik funksiyalarni ketma-ket ulab, yangi funksiya yasash."],
    ],
    life: [
      ['🥤', 'Sharbat siqgich', "Bir xil olma doim bir xil sharbat beradi va olma qutisini o'zgartirmaydi: sof funksiya."],
      ['🏭', 'Montaj liniyasi', "pipe — detal bir stanokdan keyingisiga uzatiladi: kesish → silliqlash → bo'yash."],
    ],
    practice: [
      { title: 'Sof qilish', text: "Global o'zgaruvchini o'zgartiradigan 3 ta funksiyani topib, ularni sof ko'rinishga o'zgartiring." },
      { title: 'pipe ni yozing', text: "pipe va compose ni reduce/reduceRight bilan yozing va kamida 3 ta funksiya bilan sinang." },
    ],
    items: [
      ch("Quyidagilardan qaysi biri sof funksiya?", "const sq = x => x * x", ["const add = x => (total += x)", "const now = () => Date.now()", "const log = x => console.log(x)"], "Faqat argumentga bog'liq va hech narsani o'zgartirmaydi."),
      ch("Nima uchun Math.random() sof emas?", "Bir xil kirishda har xil natija beradi", ["Sonlar qaytaradi", "Tashqi massivlarni o'zgartiradi", "Asinxron"], "Sof funksiyaning asosiy sharti: bashorat qilinadigan natija."),
      ch("pipe(x => x + 1, x => x * 2)(3) natijasi?", "8", ["7", "10", "6"], "Avval 3 + 1 = 4, keyin 4 * 2 = 8.", "const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\nconsole.log(pipe(x => x + 1, x => x * 2)(3));"),
      ch("compose(x => x + 1, x => x * 2)(3) natijasi (o'ngdan chapga)?", "7", ["8", "10", "6"], "Avval 3 * 2 = 6, keyin 6 + 1 = 7.", "const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\nconsole.log(compose(x => x + 1, x => x * 2)(3));"),
      fill("double(5) natijasi? (raqam)", '10', "mul(2) ikkinchi argumentni kutuvchi funksiya qaytaradi: 2 * 5.", null, "const mul = a => b => a * b;\nconst double = mul(2);\nconsole.log(double(5));"),
      ch("older.age va user.age natijalari?", "21 va 20", ["21 va 21", "20 va 20", "20 va 21"], "Spread yangi obyekt yaratadi, asl obyekt o'zgarmaydi.", "const user = { name: 'Ali', age: 20 };\nconst older = { ...user, age: 21 };\nconsole.log(older.age, user.age);"),
      ch("Immutability nima beradi?", "Kutilmagan o'zgarishlar yo'q: kodni tushunish va debug oson", ["Tezroq ishlash", "Kamroq kod", "Avtomatik tarmoq so'rovlari"], "Ma'lumot kim va qachon o'zgartirgani aniq."),
      ch("Higher-order function ga qaysi biri misol?", "arr.map(fn)", ["const x = 5", "if (a) b()", "typeof x"], "map funksiyani argument sifatida oladi."),
      ch("Currying (f(a, b, c) → f(a)(b)(c)) nima beradi?", "Qisman qo'llash: ba'zi argumentlarni oldindan belgilash", ["Tezlik", "Asinxronlik", "Xotira tejash"], "const add5 = add(5) kabi sozlangan funksiyalar hosil bo'ladi."),
      ch("Side effect ga qaysi biri misol?", "console.log, DOM o'zgartirish, global o'zgaruvchini o'zgartirish", ["Qiymat qaytarish", "Argument qabul qilish", "Lokal o'zgaruvchi yaratish"], "Funksiyaning natijasidan tashqari dunyoga ta'siri."),
      ch("Nega sof funksiyani keshlash (memoization) xavfsiz?", "Bir xil kirish doim bir xil natija beradi", ["Chunki sekin", "Chunki async", "Chunki u global"], "Natijani eslab qolsa, qayta hisoblash shart emas."),
      ch("Quyidagi kod sof emasligining sababi?", "Tashqi massivni o'zgartiradi (mutation)", ["sort sekin", "Funksiya arrow", "Qiymat qaytarmaydi"], "arr tashqaridan keladi va joyida saralanadi.", "const sortAsc = arr => arr.sort((a, b) => a - b);"),
    ],
  });
};
