// JavaScript, MIDDLE level, lessons 5-8: this, prototypes, classes, arrays and collections.
module.exports = ({ lesson, ch, fill, order }) => {
  const OUT = 'Konsolga nima chiqadi?';

  /* 5 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "this, call, apply va bind",
    intro: "this chaqirish usuliga bog'liqligi, kontekst yo'qolishi, arrow funksiya va majburiy bog'lash.",
    what: "this — funksiya qaysi obyekt nomidan ishlayotganini bildiruvchi kalit so'z. Oddiy funksiyada u yozilgan joyga emas, chaqirilish shakliga qarab aniqlanadi. Arrow funksiyada esa o'z this i yo'q: tashqi scope dagisini oladi. \"this is undefined\" xatosining deyarli hammasi shu qoidadan.",
    analogy: { icon: '🎤', title: "Mikrofon", text: "\"Men\" so'zi kimni bildirishi mikrofon kimning qo'lida ekaniga bog'liq. Metodni obyektdan uzib olsangiz, mikrofon endi o'sha obyektda emas." },
    defs: [
      ['this', "Chaqiruv konteksti: funksiya kim nomidan ishlayapti."],
      ['call / apply', "this ni berib darhol chaqiradi; apply argumentlarni massivda oladi."],
      ['bind', "this i qotirilgan yangi funksiya qaytaradi."],
      ['Context loss (kontekst yo\'qolishi)', "Metod obyektsiz chaqirilib, this yo'qolishi."],
    ],
    uses: [
      ["Metodni callback qilib berishda", "bind yoki arrow o'ram ishlatasiz."],
      ["Metodni qarzga olishda", "call bilan boshqa obyektda chaqirasiz."],
      ["Class ishlovchilarida", "Arrow maydon yoki constructor da bind."],
    ],
    sections: [
      { heading: 'Qoidalar tartibi', table: { head: ['Chaqiruv', 'this'], rows: [['new F()', 'yangi obyekt'], ['f.call(x), f.bind(x)()', 'x'], ['obj.f()', 'obj'], ['f()', 'undefined (strict) yoki global'], ['arrow', 'tashqi scope niki']] } },
      { heading: "Yo'qolish holati", code: { lang: 'js', text: 'const save = user.save;\nsave();                       // this yo\'q\nsetTimeout(user.save, 100);   // xuddi shu muammo\nsetTimeout(() => user.save(), 100); // to\'g\'ri' } },
      { heading: 'bind xususiyati', bullets: ["bind bir marta bog'laydi: ikkinchi bind this ni o'zgartirmaydi.", "bind argumentlarni ham oldindan berib qo'yadi (partial application).", "Arrow funksiyada call/bind this ga ta'sir qilmaydi."] },
      { heading: 'Qachon arrow yozmaslik kerak', callout: { kind: 'warn', text: "Obyekt metodini arrow qilib yozsangiz, this obyektni emas, tashqi scope ni ko'rsatadi." } },
    ],
    life: [
      ['🖱️', "Tugma bosilganda xato", "addEventListener ga this.handleClick berilgan — this endi tugma."],
      ['📞', "Logger", "const log = console.log.bind(console, \"[app]\") — prefiks oldindan berilgan."],
    ],
    tip: "Nuqtadan oldin kim turganiga qarang: obj.f() da this = obj.",
    mistakes: [
      ['this ni funksiya yozilgan obyekt deb bilish.', "Chaqiruv shakliga qarash.", "Arrow bundan mustasno."],
      ['Metodni arrow bilan yozish.', "Qisqa metod sintaksisi.", "Arrow o'z this iga ega emas."],
      ['removeEventListener ga yangi bind berish.', "Bind natijasini saqlab qo'yish.", "Har bind yangi funksiya, uzilmaydi."],
    ],
    recap: [
      "this chaqiruv shakliga bog'liq.",
      "Arrow this ni tashqaridan oladi.",
      "call va apply darhol, bind keyin chaqiriladi.",
      "Uzib olingan metod this ni yo'qotadi.",
    ],
    practice: [
      { title: 'myBind yozing', text: "apply va rest parametrlardan foydalanib o'z bind funksiyangizni yozing." },
      { title: 'Uch yechim', text: "setTimeout da this yo'qolishini arrow, bind va class maydoni bilan tuzating." },
    ],
    items: [
      ch(OUT, "Ali undefined", ["Ali Ali", "undefined undefined", "TypeError"], "u.who() da this = u. f() da this global obyekt, unda userName yo'q.", 'const u = { userName: "Ali", who() { return this && this.userName; } };\nconst f = u.who;\nconsole.log(u.who(), f());'),
      ch(OUT, "undefined", ["Ali", "TypeError", "null"], "Arrow o'z this iga ega emas: obyekt literali yangi scope yaratmaydi.", 'const u = { userName: "Ali", who: () => this?.userName };\nconsole.log(u.who());'),
      ch(OUT, "A A", ["A B", "B B", "B A"], "bind qilingan funksiyani qayta bind yoki call qilish this ni o'zgartirmaydi.", 'function id() { return this.id; }\nconst a = id.bind({ id: "A" });\nconst b = a.bind({ id: "B" });\nconsole.log(b(), a.call({ id: "B" }));'),
      ch(OUT, "Salom, Vali!", ["Salom, undefined!", "Vali, Salom!", "TypeError"], "apply this ni va argumentlarni massivda beradi.", 'function hi(word, mark) { return word + ", " + this.n + mark; }\nconsole.log(hi.apply({ n: "Vali" }, ["Salom", "!"]));'),
      ch(OUT, "1 2", ["undefined 2", "1 1", "TypeError"], "Metod ichidagi arrow tashqi metodning this ini oladi.", 'const box = {\n  items: [1, 2],\n  all() { return this.items.map((i) => this.items[i - 1]).join(" "); }\n};\nconsole.log(box.all());'),
      ch(OUT, "TypeError", ["0", "undefined", "NaN"], "Class tanasi strict: uzib olingan metodda this undefined, this.n o'qish TypeError.", 'class C {\n  n = 0;\n  get() { return this.n; }\n}\nconst g = new C().get;\ntry { console.log(g()); } catch (e) { console.log(e.name); }'),
      ch("`const log = console.log.bind(console, '[app]')` nima qiladi?", "Prefiks oldindan berilgan funksiya yasaydi", ["Darhol [app] ni konsolga chiqarib qo'yadi", "console.log ni global almashtiradi", "Xabarlarni faqat saqlab boradi"], "bind chaqirmaydi; keyingi argumentlar [app] dan so'ng qo'shiladi."),
      ch("addEventListener ni keyin uzish uchun to'g'ri usul qaysi?", "bind natijasini o'zgaruvchida saqlash", ["Uzishda bind ni qaytadan yana chaqirish", "Anonim arrow bilan uzish", "Elementga this ni yozib qo'yish"], "removeEventListener aynan o'sha funksiya havolasini talab qiladi."),
      ch("`new` bilan chaqirilgan funksiyada this nima?", "Yangi yaratilgan obyekt", ["Funksiyaning o'zi", "Global obyekt", "Funksiya prototype i"], "new yangi obyekt yaratib, uni this qiladi va qaytaradi."),
      fill("this ni qotirib, funksiyani chaqirmasdan yangisini qaytaradigan metod nomi?", "bind", "call va apply darhol chaqiradi, bind esa yo'q.", [".bind", "bind()"]),
      fill(OUT, "5", "call this = { x: 5 } qilib darhol chaqiradi.", undefined, 'function getX() { return this.x; }\nconsole.log(getX.call({ x: 5 }));'),
      order("this ni aniqlash ustuvorligini yuqoridan pastga tartiblang.", ["new bilan chaqiruv", "call, apply yoki bind", "obyekt nuqtasi orqali chaqiruv", "oddiy chaqiruv"], "Arrow funksiya bu ro'yxatdan tashqarida: u this ni tashqaridan oladi."),
    ],
  });

  /* 6 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Prototype zanjiri va new",
    intro: "[[Prototype]] bog'lanishi, xossa qidirish, prototype va __proto__ farqi, new ning to'rt qadami.",
    what: "Har bir obyektning yashirin [[Prototype]] bog'lanishi bor. Xossa obyektning o'zida topilmasa, qidiruv shu zanjir bo'ylab yuqoriga ko'tariladi. Class sintaksisi ham ostida aynan shu mexanizm bilan ishlaydi: metodlar nusxalanmaydi, ulashiladi.",
    analogy: { icon: '📚', title: "Kutubxona zanjiri", text: "Kitob uy javonida bo'lmasa mahalla kutubxonasiga, u yerda ham bo'lmasa shahar kutubxonasiga borasiz. Kitob uyingizga ko'chirib qo'yilmaydi." },
    defs: [
      ['[[Prototype]]', "Obyekt xossa topolmasa murojaat qiladigan boshqa obyekt."],
      ['Constructor.prototype', "new bilan yaratilganlarga prototip bo'ladigan obyekt."],
      ['Own property (o\'z xossasi)', "Obyektning o'zida turgan xossa."],
      ['Shadowing (berkitish)', "O'z xossasi prototipdagi shu nomni to'sib qo'yishi."],
    ],
    uses: [
      ["Metodlarni tejashda", "Ming nusxa bitta metodni ulashadi."],
      ["Debug da", "DevTools da [[Prototype]] ni ochib metod qayerdanligini ko'rasiz."],
      ["Xavfsizlikda", "Prototype pollution xavfini tushunasiz."],
    ],
    sections: [
      { heading: 'new ning qadamlari', flow: ["Bo'sh obyekt yaratiladi", "[[Prototype]] = F.prototype", "F shu obyekt bilan bajariladi", "Obyekt qaytariladi (F boshqa obyekt qaytarmasa)"] },
      { heading: 'Zanjir', code: { lang: 'js', text: 'const arr = [];\n// arr -> Array.prototype -> Object.prototype -> null\nObject.getPrototypeOf(arr) === Array.prototype; // true' } },
      { heading: 'Tekshiruvlar', table: { head: ['Ifoda', "Zanjirni ko'radimi"], rows: [['"k" in obj', 'ha'], ['Object.hasOwn(obj, "k")', "yo'q"], ['Object.keys(obj)', "yo'q"], ['for...in', 'ha (sanaladiganlarni)'], ['obj instanceof F', 'ha']] } },
      { heading: 'Ogohlantirish', callout: { kind: 'warn', text: "Object.prototype ga xossa qo'shish barcha obyektlarga ta'sir qiladi. Tashqi JSON kalitlarini (\"__proto__\") tekshirmasdan birlashtirmang." } },
    ],
    life: [
      ['🐞', "Kutilmagan kalit", "for...in prototipdan kelgan xossani ham ro'yxatga qo'shib yubordi."],
      ['🗺️', "Lug'at obyekti", "Object.create(null) da toString kabi meros kalitlar yo'q."],
    ],
    tip: "O'qish zanjirdan yuqoriga chiqadi, yozish esa obyektning o'ziga tushadi.",
    mistakes: [
      ['prototype va __proto__ ni aralashtirish.', "prototype — funksiyada, [[Prototype]] — har obyektda.", "Ular turli narsa."],
      ['Massivni prototipda saqlash.', "constructor da yaratish.", "Hamma nusxa bitta massivni ulashadi."],
      ['obj.hasOwnProperty ga ishonish.', "Object.hasOwn.", "null prototipli obyektda u yo'q."],
    ],
    recap: [
      "Xossa zanjir bo'ylab qidiriladi.",
      "new prototipni F.prototype ga bog'laydi.",
      "Yozish o'z xossasini yaratadi.",
      "Object.hasOwn faqat o'zinikini tekshiradi.",
    ],
    practice: [
      { title: 'new ni qayta yozing', text: "Object.create va apply bilan myNew(F, ...args) yozing." },
      { title: 'Zanjirni chizing', text: "class Dog extends Animal uchun instance dan null gacha zanjirni chizing." },
    ],
    items: [
      ch(OUT, "true false", ["true true", "false false", "false true"], "in zanjirni ko'radi, Object.hasOwn faqat obyektning o'zini.", 'const base = { eats: true };\nconst rabbit = Object.create(base);\nconsole.log("eats" in rabbit, Object.hasOwn(rabbit, "eats"));'),
      ch(OUT, "2 1", ["2 2", "1 1", "1 2"], "b.n = 2 o'z xossasini yaratadi, prototipdagi n o'zgarmaydi.", 'const a = { n: 1 };\nconst b = Object.create(a);\nb.n = 2;\nconsole.log(b.n, a.n);'),
      ch(OUT, "2", ["1", "0", "undefined"], "tags prototipda bitta: ikkala nusxa ham o'sha massivga push qiladi.", 'function P() {}\nP.prototype.tags = [];\nconst x = new P();\nconst y = new P();\nx.tags.push("a");\ny.tags.push("b");\nconsole.log(x.tags.length);'),
      ch(OUT, "salom", ["TypeError", "undefined", "xayr"], "Metod nusxalanmagan: chaqiruv paytida prototipdan topiladi, keyin qo'shilgani ham ishlaydi.", 'function G() {}\nconst g = new G();\nG.prototype.say = () => "salom";\nconsole.log(g.say());'),
      ch(OUT, "obj", ["F", "undefined", "TypeError"], "Konstruktor obyekt qaytarsa, new yangi this o'rniga shuni beradi.", 'function F() {\n  this.name = "F";\n  return { name: "obj" };\n}\nconsole.log(new F().name);'),
      ch(OUT, "true true", ["true false", "false true", "false false"], "Massiv zanjirida Array.prototype ham, Object.prototype ham bor.", 'console.log([] instanceof Array, [] instanceof Object);'),
      ch("`const d = new Dog()` bo'lsa, qaysi tenglik to'g'ri?", "Object.getPrototypeOf(d) === Dog.prototype", ["d.prototype === Dog.prototype", "Dog.__proto__ === d.__proto__", "Object.getPrototypeOf(Dog) === d.prototype"], "new yangi obyekt [[Prototype]] ini Dog.prototype ga bog'laydi; instance da prototype xossasi yo'q."),
      ch("Object.create(null) nima uchun ishlatiladi?", "Meros kalitlarsiz toza lug'at uchun", ["Muzlatilgan obyekt yaratish uchun", "Obyektni xotiradan o'chirish uchun", "Chuqur nusxa olish uchun"], "Prototipi yo'q obyektda toString, constructor kabi kalitlar chalkashtirmaydi."),
      ch("Prototype pollution nima?", "Umumiy prototipga begona xossa yozilishi", ["Prototip zanjirining haddan tashqari uzayishi", "Xotirada nusxalarning ko'payishi", "Class metodlarining qayta yozilishi"], "Tekshirilmagan __proto__ kalitli kirish barcha obyektlarga ta'sir qilishi mumkin."),
      fill(OUT, "null", "Object.prototype zanjirning oxiri: uning prototipi null.", undefined, 'console.log(Object.getPrototypeOf(Object.prototype));'),
      fill("Xossa aynan obyektning o'zida borligini tekshiruvchi statik metod: Object.___", "hasOwn", "Object.hasOwn(obj, key).", ["Object.hasOwn", "hasOwn()"]),
      order("new User() qadamlarini tartiblang.", ["Bo'sh obyekt yaratiladi", "Prototip User.prototype ga ulanadi", "User tanasi this bilan bajariladi", "Obyekt qaytariladi"], "Konstruktor boshqa obyekt qaytarmasa, aynan yaratilgan obyekt qaytadi."),
    ],
  });

  /* 7 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Class, meros va composition",
    intro: "constructor, super, static, private maydonlar, getter va meros o'rniga tarkib.",
    what: "class — prototip mexanizmi ustidagi qulay va qat'iyroq sintaksis. U strict rejimda ishlaydi, new siz chaqirilmaydi va # bilan haqiqiy xususiy maydon beradi. Middle dasturchi extends yozishdan oldin \"bu haqiqatan ham turi shumi, yoki shunchaki qobiliyati bormi\" deb so'raydi.",
    analogy: { icon: '🧩', title: "Shajara va asboblar kamari", text: "Meros — shajara: kim kimning avlodi, o'zgartirish qiyin. Composition (tarkib) — kamarga asbob osish: kerakligini qo'shasiz, keraksizini olasiz." },
    defs: [
      ['super', "Ota klass konstruktori yoki metodiga murojaat."],
      ['static', "Nusxaga emas, klassning o'ziga tegishli a'zo."],
      ['Private field (xususiy maydon)', "#nom: faqat klass ichidan ko'rinadi."],
      ['Composition (tarkib)', "Xatti-harakatni boshqa obyektlardan yig'ish."],
    ],
    uses: [
      ["Holat va xatti-harakat birga bo'lsa", "Masalan, EventEmitter yoki xato turlari."],
      ["Invariantni himoyalashda", "# maydon va metodlar orqali o'zgartirish."],
      ["Variantlar ko'payganda", "Meros daraxti o'rniga composition."],
    ],
    sections: [
      { heading: 'Anatomiya', code: { lang: 'js', text: 'class Account {\n  #balance = 0;\n  static from(x) { const a = new Account(); a.add(x); return a; }\n  get balance() { return this.#balance; }\n  add(x) { if (x > 0) this.#balance += x; }\n}' } },
      { heading: 'Meros qoidalari', bullets: ["extends klassda constructor yozsangiz, this dan oldin super() shart.", "super.metod() ota amalga oshirishni chaqiradi.", "Ota konstruktorida chaqirilgan metod bola versiyasini ishlatadi, lekin bola maydonlari hali yo'q."] },
      { heading: 'Maydon va metod', table: { head: ['Yozuv', 'Qayerda turadi'], rows: [['x = 1', 'har bir nusxada'], ['m() {}', 'prototipda, ulashilgan'], ['h = () => {}', 'har nusxada alohida funksiya'], ['static s() {}', 'klassning o\'zida']] } },
      { heading: 'Composition', code: { lang: 'js', text: 'const canSwim = (s) => ({ swim: () => s.name + " suzadi" });\nconst duck = (name) => { const s = { name }; return { ...s, ...canSwim(s) }; };' }, callout: { kind: 'tip', text: "\"X bu Y\" bo'lsa meros, \"X da Y qobiliyati bor\" bo'lsa composition." } },
    ],
    life: [
      ['🏦', "Balans himoyasi", "#balance ni tashqaridan manfiy qilib bo'lmaydi."],
      ['🦆', "Uchadigan va suzadigan", "Meros daraxti tarmoqlanib ketadi, composition esa yig'iladi."],
    ],
    tip: "Meros chuqurligini bir-ikki qavatdan oshirmang.",
    mistakes: [
      ['super() dan oldin this ishlatish.', "Avval super().", "ReferenceError beradi."],
      ['_nom ni xususiy deb o\'ylash.', "# ishlatish.", "Pastki chiziq faqat kelishuv."],
      ['Faqat kod ulashish uchun extends.', "Funksiya yoki composition.", "Keraksiz bog'liqlik paydo bo'ladi."],
    ],
    recap: [
      "class ostida prototype turadi.",
      "# maydon haqiqatan xususiy.",
      "static klass orqali chaqiriladi.",
      "Moslashuvchanlik uchun composition.",
    ],
    practice: [
      { title: 'Account klassi', text: "#balance, add, withdraw va static from bilan klass yozing, noto'g'ri qiymatni rad eting." },
      { title: 'Merosdan tarkibga', text: "FlyingSwimmingDuck daraxtini qobiliyat funksiyalariga o'tkazing." },
    ],
    items: [
      ch(OUT, "function true", ["class true", "object false", "function false"], "class ham funksiya; metodlar prototype da turadi.", 'class A { hi() {} }\nconsole.log(typeof A, new A().hi === A.prototype.hi);'),
      ch(OUT, "false true", ["true true", "false false", "true false"], "Metod ulashilgan, arrow maydon esa har nusxada yangi.", 'class A {\n  f = () => 1;\n  m() {}\n}\nconst x = new A();\nconst y = new A();\nconsole.log(x.f === y.f, x.m === y.m);'),
      ch(OUT, "undefined function", ["function function", "function undefined", "undefined undefined"], "static metod nusxada emas, klassning o'zida.", 'class M { static make() {} }\nconsole.log(typeof new M().make, typeof M.make);'),
      ch(OUT, "hayvon: vov", ["vov", "hayvon", "hayvon: undefined"], "super.say() ota metodini chaqiradi, this.sound() esa bolaniki.", 'class Animal {\n  say() { return "hayvon: " + this.sound(); }\n  sound() { return "..."; }\n}\nclass Dog extends Animal {\n  say() { return super.say(); }\n  sound() { return "vov"; }\n}\nconsole.log(new Dog().say());'),
      ch(OUT, "ReferenceError", ["SyntaxError", "undefined", "TypeError"], "Meros klassda super() dan oldin this ga tegib bo'lmaydi.", 'class A {}\nclass B extends A {\n  constructor() { this.x = 1; super(); }\n}\ntry { new B(); console.log(1); } catch (e) { console.log(e.name); }'),
      ch(OUT, "TypeError", ["Account", "undefined", "ReferenceError"], "class ni new siz chaqirib bo'lmaydi.", 'class Account {}\ntry { Account(); } catch (e) { console.log(e.name); }'),
      ch(OUT, "undefined 10", ["10 10", "undefined undefined", "0 10"], "# maydon tashqaridan oddiy kalit sifatida ko'rinmaydi; getter orqali o'qiladi.", 'class W {\n  #sum = 10;\n  get sum() { return this.#sum; }\n}\nconst w = new W();\nconsole.log(w["#sum"], w.sum);'),
      ch("Qaysi holatda composition merosdan afzal?", "Qobiliyatlar turli kombinatsiyada kerak", ["Xato turi Error dan kelib chiqishi kerak", "instanceof tekshiruvi talab qilinadi", "Bola ota bilan to'liq bir turda"], "Kombinatsiyalar ko'paysa meros daraxti portlaydi."),
      ch("`_secret` bilan `#secret` farqi nima?", "# ni til tashqaridan yopadi", ["_ ni brauzer o'zi yashiradi", "# faqat static a'zolarda ishlaydi", "Ikkalasi faqat kelishuv xolos"], "_ shunchaki nomlash odati, # esa sintaktik cheklov."),
      fill(OUT, "true", "Meros zanjiri tufayli Dog nusxasi Animal ga ham instanceof.", undefined, 'class Animal {}\nclass Dog extends Animal {}\nconsole.log(new Dog() instanceof Animal);'),
      fill("Ota klass konstruktorini chaqirish uchun qaysi kalit so'z ishlatiladi?", "super", "super(...args).", ["super()"]),
      order("Meros klass nusxasi yaratilish tartibini tuzing.", ["new Bola chaqiriladi", "super ota konstruktorini ishga tushiradi", "Bola maydonlari o'rnatiladi", "Bola konstruktorining qolgan qismi bajariladi"], "Bola maydonlari super() qaytgandan keyin paydo bo'ladi."),
    ],
  });

  /* 8 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Massivlar, destructuring, Map va Set",
    intro: "O'zgartiruvchi va o'zgartirmaydigan metodlar, sort tuzog'i, rest/spread, Map va Set tanlovi.",
    what: "Massiv metodlarining bir qismi asl massivni o'zgartiradi (mutating), bir qismi yangisini qaytaradi. Destructuring (parchalash) qiymatlarni qulay ajratadi. Map va Set esa oddiy obyekt va massiv yomon bajaradigan vazifalar uchun: ixtiyoriy kalit va tez a'zolik tekshiruvi.",
    analogy: { icon: '🗂️', title: "Asl hujjat va nusxa", text: "Ba'zi amallar asl hujjatning ustiga yozadi, ba'zilari nusxa chiqarib o'shanda ishlaydi. Qaysi biri qaysiligini bilmasangiz, arxiv buziladi." },
    defs: [
      ['Mutating method', "Asl massivni o'zgartiradi: push, splice, sort, reverse."],
      ['Destructuring (parchalash)', "Massiv yoki obyektdan qiymatlarni o'zgaruvchilarga ajratish."],
      ['Map', "Istalgan turdagi kalitli, tartibli lug'at."],
      ['Set', "Takrorsiz qiymatlar to'plami."],
    ],
    uses: [
      ["React holatida", "toSorted, filter, map — asl massivga tegmaydi."],
      ["Takrorlarni olib tashlashda", "[...new Set(list)]."],
      ["Obyektni kalit qilishda", "Map yoki WeakMap."],
    ],
    sections: [
      { heading: 'Qaysi biri o\'zgartiradi', table: { head: ["O'zgartiradi", "O'zgartirmaydi"], rows: [['sort', 'toSorted'], ['reverse', 'toReversed'], ['splice', 'slice, toSpliced'], ['push, pop, shift', 'concat, [...a, x]']] } },
      { heading: 'Destructuring', code: { lang: 'js', text: 'const [first, , third = 0, ...rest] = list;\nconst { id, name: title = "-", ...other } = item;\n[a, b] = [b, a]; // almashtirish' } },
      { heading: 'Map va obyekt', bullets: ["Map kaliti istalgan tur, obyekt kaliti satr yoki symbol.", "Map.size tayyor, obyektda Object.keys(o).length.", "Map JSON ga to'g'ridan-to'g'ri yozilmaydi.", "WeakMap kaliti obyekt bo'lib, GC ga xalaqit bermaydi."] },
      { heading: 'sort', callout: { kind: 'warn', text: "Taqqoslash funksiyasisiz sort elementlarni satr sifatida tartiblaydi: [1, 10, 2]. Sonlar uchun (a, b) => a - b." } },
    ],
    life: [
      ['🔀', "Asl tartib yo'qoldi", "list.sort() boshqa komponentdagi ro'yxatni ham o'zgartirdi."],
      ['🏷️', "Tanlangan elementlar", "Set.has bilan tekshirish massiv includes dan tezroq o'sadi."],
    ],
    tip: "Holat bilan ishlaganda to* metodlar va spread ni tanlang.",
    mistakes: [
      ['sort() ni sonlarga komparatorsiz qo\'llash.', "(a, b) => a - b.", "Aks holda satr tartibi."],
      ['default null uchun ishlaydi deb o\'ylash.', "Default faqat undefined da.", "null o'tib ketadi."],
      ['Map ni obyekt kabi map[key] bilan yozish.', "set va get.", "Aks holda oddiy xossa yaratiladi."],
    ],
    recap: [
      "sort, reverse, splice aslini o'zgartiradi.",
      "Default faqat undefined da ishlaydi.",
      "Set takrorsiz, Map ixtiyoriy kalitli.",
      "find topmasa undefined, findIndex -1.",
    ],
    practice: [
      { title: 'groupBy', text: "Map qaytaradigan groupBy(list, keyFn) funksiyasini yozing." },
      { title: 'Mutatsiyani yo\'qoting', text: "sort va splice ishlatilgan joyni toSorted va toSpliced ga o'tkazing." },
    ],
    items: [
      ch(OUT, "1,10,2", ["1,2,10", "10,2,1", "2,10,1"], "Komparatorsiz sort satr sifatida solishtiradi.", 'console.log([10, 1, 2].sort().join(","));'),
      ch(OUT, "3,1,2 1,2,3", ["1,2,3 1,2,3", "3,1,2 3,1,2", "1,2,3 3,1,2"], "toSorted yangi massiv qaytaradi, asl o'zgarmaydi.", 'const a = [3, 1, 2];\nconst b = a.toSorted((x, y) => x - y);\nconsole.log(a.join(","), b.join(","));'),
      ch(OUT, "2,3 1,4", ["2,3 1,2,3,4", "1,2 3,4", "2,3,4 1"], "splice(1, 2) 1-indeksdan 2 ta elementni olib tashlab qaytaradi va asl massivni o'zgartiradi.", 'const a = [1, 2, 3, 4];\nconst cut = a.splice(1, 2);\nconsole.log(cut.join(","), a.join(","));'),
      ch(OUT, "5 null", ["5 5", "undefined null", "null null"], "Default qiymat faqat undefined bo'lganda ishlaydi; null saqlanadi.", 'const { a = 5, b = 5 } = { a: undefined, b: null };\nconsole.log(a, b);'),
      ch(OUT, "1 3,4", ["1 2,3,4", "2 3,4", "1 4"], "Bo'sh vergul ikkinchi elementni tashlab o'tadi, rest qolganini yig'adi.", 'const [x, , ...rest] = [1, 2, 3, 4];\nconsole.log(x, rest.join(","));'),
      ch(OUT, "3", ["4", "2", "5"], "Set takrorlarni olib tashlaydi: 1, \"1\", 2. Son 1 va satr \"1\" har xil.", 'console.log(new Set([1, "1", 1, 2, 2]).size);'),
      ch(OUT, "birinchi undefined", ["birinchi birinchi", "undefined undefined", "undefined birinchi"], "Map obyekt kalitni havola bo'yicha solishtiradi: o'xshash literal boshqa kalit.", 'const key = { id: 1 };\nconst m = new Map([[key, "birinchi"]]);\nconsole.log(m.get(key), m.get({ id: 1 }));'),
      ch(OUT, "true false", ["true true", "false false", "false true"], "includes NaN ni topadi (SameValueZero), indexOf esa === ishlatib topolmaydi.", 'const a = [NaN];\nconsole.log(a.includes(NaN), a.indexOf(NaN) !== -1);'),
      ch("DOM elementiga bog'liq ma'lumotni xotira oqizmasdan saqlash uchun nima mos?", "WeakMap", ["Map", "Set", "Oddiy massiv"], "WeakMap kalitga kuchsiz havola ushlaydi: element yo'qolsa yozuv ham yig'iladi."),
      fill(OUT, "-1", "findIndex topmasa -1 qaytaradi.", undefined, 'console.log([1, 2].findIndex((n) => n > 5));'),
      fill(OUT, "3", "Array.from uzunlik va funksiya bilan [1, 2, 3] yasaydi; oxirgisi 3.", undefined, 'console.log(Array.from({ length: 3 }, (_, i) => i + 1).at(-1));'),
      order("Takrorsiz va tartiblangan ro'yxat olish qadamlarini tuzing.", ["Massivni Set ga bering", "Set ni spread bilan massivga aylantiring", "toSorted ni komparator bilan chaqiring", "Yangi massivni qaytaring"], "[...new Set(a)].toSorted((x, y) => x - y)."),
    ],
  });
};
