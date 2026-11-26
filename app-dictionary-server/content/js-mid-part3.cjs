// JavaScript, MIDDLE level, lessons 9-12: errors, modules, event loop and promises, events and fetch.
module.exports = ({ lesson, ch, fill, order }) => {
  const OUT = 'Konsolga nima chiqadi?';

  /* 9 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Xatolarni boshqarish strategiyasi",
    intro: "try, catch, finally tartibi, o'z xato klasslari, cause va asinxron xatolar.",
    what: "Xato — kutilmagan holat haqidagi signal. Middle dasturchi har joyga try qo'ymaydi: xatoni uni haqiqatan hal qila oladigan qatlamda ushlaydi, qolganida yuqoriga o'tkazadi va asl sababni yo'qotmaydi.",
    analogy: { icon: '🚑', title: "Tez yordam zanjiri", text: "Hamshira qo'lidan kelmaganini shifokorga uzatadi va nima bo'lganini yozib beradi. Muammoni jim berkitib qo'yish eng xavfli yo'l." },
    defs: [
      ['throw', "Bajarishni to'xtatib, xatoni yuqoriga uloqtirish."],
      ['finally', "Natija qanday bo'lishidan qat'i nazar bajariladigan blok."],
      ['Error cause', "Yangi xatoga asl xatoni biriktirish: { cause }."],
      ['Unhandled rejection', "Hech kim ushlamagan rad etilgan Promise."],
    ],
    uses: [
      ["Tashqi ma'lumot bilan", "JSON.parse, tarmoq, localStorage."],
      ["Qatlam chegarasida", "Past darajali xatoni tushunarli xatoga o'raysiz."],
      ["Resurs bo'shatishda", "finally da loading ni o'chirasiz."],
    ],
    sections: [
      { heading: "O'z xato klassi", code: { lang: 'js', text: 'class HttpError extends Error {\n  constructor(status, options) {\n    super("HTTP " + status, options);\n    this.name = "HttpError";\n    this.status = status;\n  }\n}' } },
      { heading: "O'rab uzatish", code: { lang: 'js', text: 'try {\n  return JSON.parse(raw);\n} catch (e) {\n  throw new Error("Sozlama buzilgan", { cause: e });\n}' } },
      { heading: 'try nimani ushlaydi', table: { head: ['Holat', 'Ushlanadimi'], rows: [['sinxron throw', 'ha'], ['await qilingan rad etish', 'ha'], ["await siz Promise", "yo'q"], ['setTimeout callback ichidagi throw', "yo'q"], ['sintaksis xatosi (parse)', "yo'q"]] } },
      { heading: 'finally tuzog\'i', callout: { kind: 'warn', text: "finally ichidagi return try yoki catch dagi return va throw ni bekor qiladi. U yerda qiymat qaytarmang." } },
    ],
    life: [
      ['⏳', "Spinner aylanib qoldi", "loading = false catch ga yozilmagan; finally da bo'lishi kerak edi."],
      ['🕳️', "Bo'sh catch", "Xato yutildi va nega ishlamayotgani hech kimga ma'lum emas."],
    ],
    tip: "Hal qila olmasangiz, ushlab yutmang: qayta uloqtiring.",
    mistakes: [
      ['Bo\'sh catch qoldirish.', "Hech bo'lmasa log va qayta throw.", "Xato izsiz yo'qoladi."],
      ['Satr uloqtirish.', "Error nusxasi.", "Stack va name yo'qoladi."],
      ['return promise ni try ichida yozish.', "return await promise.", "Aks holda catch ishlamaydi."],
    ],
    recap: [
      "finally har doim bajariladi.",
      "O'z xato klassi Error dan meros oladi.",
      "cause asl sababni saqlaydi.",
      "await siz xato try dan o'tib ketadi.",
    ],
    practice: [
      { title: 'HttpError', text: "status li xato klassi yozib, 401 va 500 ni turlicha qayta ishlang." },
      { title: 'Bo\'sh catch ovi', text: "Loyihadagi catch larni ko'rib, yutilayotgan xatolarni tuzating." },
    ],
    items: [
      ch(OUT, "try finally 1", ["try 1 finally", "finally try 1", "try 1"], "finally return dan oldin bajariladi, keyin qiymat tashqariga chiqadi.", 'function f() {\n  try { console.log("try"); return 1; }\n  finally { console.log("finally"); }\n}\nconsole.log(f());'),
      ch(OUT, "2", ["1", "undefined", "3"], "finally dagi return try dagi return ni bekor qiladi.", 'function f() {\n  try { return 1; }\n  finally { return 2; }\n}\nconsole.log(f());'),
      ch(OUT, "RangeError katta", ["Error katta", "RangeError undefined", "katta RangeError"], "name klass nomini, message berilgan matnni saqlaydi.", 'try {\n  throw new RangeError("katta");\n} catch (e) {\n  console.log(e.name, e.message);\n}'),
      ch(OUT, "tashqi ichki", ["ichki tashqi", "tashqi undefined", "ichki ichki"], "cause asl xatoni yangi xato ichida saqlaydi.", 'try {\n  try { throw new Error("ichki"); }\n  catch (e) { throw new Error("tashqi", { cause: e }); }\n} catch (e) {\n  console.log(e.message, e.cause.message);\n}'),
      ch(OUT, "keyin ushlandi", ["ushlandi keyin", "ushlandi", "keyin"], "await siz try rad etishni ushlamaydi: \"keyin\" sinxron chiqadi, .catch esa keyinroq.", 'try {\n  Promise.reject(new Error("x")).catch(() => console.log("ushlandi"));\n  console.log("keyin");\n} catch (e) {\n  console.log("try-catch");\n}'),
      ch(OUT, "true true", ["true false", "false true", "false false"], "Meros zanjiri tufayli HttpError nusxasi Error ga ham instanceof.", 'class HttpError extends Error {}\nconst e = new HttpError();\nconsole.log(e instanceof HttpError, e instanceof Error);'),
      ch("try { setTimeout(() => { throw new Error() }) } catch {} nima bo'ladi?", "catch ishlamaydi, xato ushlanmay qoladi", ["catch xatoni kechikib bo'lsa ham ushlaydi", "Taymer umuman ishga tushmay qoladi", "Xato jim holda e'tibordan chetda qoladi"], "Callback ishlaganda try bloki allaqachon tugagan."),
      ch("Funksiya xatoni hal qila olmasa, to'g'ri yondashuv qaysi?", "Yuqori qatlamga uzatish", ["null qaytarib davom etish", "catch ichida jim qolish", "Sahifani qayta yuklash"], "Qaror qabul qila oladigan qatlam ushlashi kerak."),
      ch("Nega `throw 'xato'` yomon amaliyot?", "Stack va name ma'lumoti bo'lmaydi", ["Satrni umuman uloqtirib bo'lmaydi", "catch satrlarni ushlay olmaydi", "finally bloki ishlamay qoladi"], "Error nusxasi diagnostika uchun kerakli ma'lumotlarni olib yuradi."),
      fill("Natijadan qat'i nazar bajariladigan blok kalit so'zi?", "finally", "Resurslarni bo'shatish joyi.", ["finally {}"]),
      fill("Ushlanmagan rad etilgan Promise uchun brauzer hodisasi nomi?", "unhandledrejection", "window.addEventListener(\"unhandledrejection\", ...).", ["onunhandledrejection"]),
      order("Xatoni qatlamlar bo'ylab to'g'ri uzatishni tartiblang.", ["Past qatlamda xato yuz beradi", "O'rta qatlam cause bilan o'raydi", "Yuqori qatlam ushlab log qiladi", "Foydalanuvchiga tushunarli xabar chiqadi"], "Texnik tafsilot logga, sodda xabar ekranga."),
    ],
  });

  /* 10 --------------------------------------------------------------------------------------- */
  lesson({
    title: "ES modullar va code splitting",
    intro: "named va default export, live binding, bir marta bajarilish, dynamic import, tree shaking.",
    what: "ES module — o'z scope iga ega fayl: nimani tashqariga berishini export, nimani olishini import bilan aytadi. Import statik bo'lgani uchun vositalar bog'liqliklarni kodni ishga tushirmasdan tahlil qila oladi — tree shaking va code splitting shunga tayanadi.",
    analogy: { icon: '🧰', title: "Ustaxona javonlari", text: "Har javon o'z asboblarini saqlaydi va faqat yorliq yopishtirilganlarini beradi. Sizga berilgani nusxa emas: javondagi asbob almashsa, siz ham yangisini ko'rasiz." },
    defs: [
      ['Named export', "Nomi bilan eksport; import da aynan shu nom yoki as."],
      ['Default export', "Moduldagi bitta asosiy eksport, nomi erkin."],
      ['Live binding (jonli bog\'lanish)', "Import qiymat nusxasi emas, eksport o'zgaruvchisiga bog'lanish."],
      ['Tree shaking', "Ishlatilmagan eksportlarni bundle dan olib tashlash."],
    ],
    uses: [
      ["Kodni bo'lishda", "Har fayl bitta mas'uliyat."],
      ["Og'ir sahifalarda", "import() bilan kerak paytda yuklash."],
      ["Umumiy holatda", "Modul bir marta bajarilgani uchun tabiiy singleton."],
    ],
    sections: [
      { heading: 'Sintaksis', code: { lang: 'js', text: 'export const add = (a, b) => a + b;\nexport default function App() {}\nimport App, { add as sum } from "./app.js";\nimport * as math from "./math.js";' } },
      { heading: 'Modul xususiyatlari', bullets: ["Doim strict rejim.", "Top-level this undefined.", "Necha joyda import qilinsa ham bir marta bajariladi.", "import lar ko'tariladi (hoisting).", "Import qilingan nomga qayta qiymat yozib bo'lmaydi."] },
      { heading: 'Dynamic import', code: { lang: 'js', text: 'button.onclick = async () => {\n  const { openChart } = await import("./chart.js");\n  openChart();\n};' }, text: "import() Promise qaytaradi; bundler bu joyda alohida chunk (bo'lak) yaratadi." },
      { heading: 'Siklik bog\'liqlik', callout: { kind: 'warn', text: "a.js b.js ni, b.js esa a.js ni import qilsa, biri hali tayyor bo'lmagan qiymatni o'qib ReferenceError olishi mumkin. Umumiy qismni uchinchi modulga chiqaring." } },
    ],
    life: [
      ['📉', "Bundle kichraydi", "Butun kutubxona o'rniga kerakli funksiya import qilindi."],
      ['📊', "Grafik sahifasi", "Chart kutubxonasi faqat tugma bosilganda yuklanadi."],
    ],
    tip: "Named export ko'proq ishlating: nom izchil va tree shaking aniqroq.",
    mistakes: [
      ['import qilingan nomni o\'zgartirishga urinish.', "Egasi bo'lgan modulda setter eksport qilish.", "TypeError beradi."],
      ['Hamma narsani bitta barrel dan olish.', "Kerakli fayldan import.", "Ortiqcha kod tortilishi mumkin."],
      ['import() natijasini sinxron deb o\'ylash.', "await yoki then.", "U Promise."],
    ],
    recap: [
      "Modul bir marta bajariladi.",
      "Import jonli bog'lanish.",
      "import() Promise va alohida chunk.",
      "Tree shaking statik import ga tayanadi.",
    ],
    practice: [
      { title: 'Lazy yuklash', text: "Bitta og'ir funksiyani import() ga o'tkazib, Network tabda alohida faylni ko'ring." },
      { title: 'Jonli bog\'lanish', text: "count va inc eksport qiluvchi modul yozib, importda qiymat o'zgarishini tekshiring." },
    ],
    items: [
      ch("count eksport qilingan, inc() uni oshiradi. Importer inc() dan keyin count da nimani ko'radi?", "Yangi qiymatni", ["Eski qiymatni", "undefined ni", "Funksiyani"], "Import jonli bog'lanish, nusxa emas.", '// counter.js\nexport let count = 0;\nexport const inc = () => { count += 1; };\n// main.js\nimport { count, inc } from "./counter.js";\ninc();\nconsole.log(count);'),
      ch("Importer `count = 5` deb yozsa nima bo'ladi?", "TypeError", ["Qiymat 5 bo'ladi", "Lokal nusxa o'zgaradi", "Jim e'tiborsiz qoladi"], "Import qilingan bog'lanish faqat o'qiladi.", 'import { count } from "./counter.js";\ncount = 5;'),
      ch("Bitta modulni uchta fayl import qilsa, uning tanasi necha marta bajariladi?", "Bir marta", ["Uch marta", "Har chaqiruvda", "Ikki marta"], "Modul keshlanadi — shu sabab u singleton bo'lib xizmat qiladi."),
      ch("`import('./chart.js')` nima qaytaradi?", "Modul obyektli Promise", ["Default eksportning o'zi", "Fayl matnini satr holida", "undefined, keyin global"], "await qilib, nomlangan eksportlarni ajratib olasiz."),
      ch("Tree shaking nega CommonJS require da qiyinroq?", "require ish vaqtida hisoblanadi", ["require faylni ikki marta o'qiydi", "require brauzerda tezroq ishlaydi", "require faqat default beradi"], "Statik import ni vosita kodni bajarmay tahlil qiladi."),
      ch("Default eksportni boshqa nom bilan import qilsa bo'ladimi?", "Ha, istalgan nom bilan", ["Yo'q, nom bir xil bo'lsin", "Faqat as bilan mumkin", "Faqat * bilan mumkin"], "Default ning nomi import qiluvchida tanlanadi."),
      ch("Modul faylida top-level this nimaga teng?", "undefined", ["window", "module", "globalThis"], "Modul scope strict va this bog'lanmagan."),
      ch("Siklik import muammosining eng to'g'ri yechimi?", "Umumiy qismni alohida modulga chiqarish", ["Ikkala faylga ham default export qo'shish", "import larni fayl oxiriga ko'chirish", "Har ikki modulni ikki marta import qilish"], "Bog'liqlik bir tomonlama bo'lishi kerak."),
      fill("Oddiy HTML da modul skriptini ulash uchun <script> ning type qiymati?", "module", "<script type=\"module\">; u defer kabi ishlaydi.", ['type="module"']),
      fill("Ishlatilmagan eksportlarni bundle dan olib tashlash inglizcha nomi?", "tree shaking", "Daraxtni silkitib quruq barglarni tushirish.", ["tree-shaking", "treeshaking"]),
      fill("`import { add as sum }` dan keyin funksiya qaysi nom bilan chaqiriladi?", "sum", "as lokal nomni o'zgartiradi.", ["sum()"]),
      order("Dynamic import bilan kerak paytda yuklashni tartiblang.", ["Foydalanuvchi tugmani bosadi", "import() so'rov yuboradi", "Chunk yuklanib bajariladi", "Eksport qilingan funksiya chaqiriladi"], "Sahifa birinchi ochilishda bu kodni yuklamaydi."),
    ],
  });

  /* 11 --------------------------------------------------------------------------------------- */
  lesson({
    title: "Event loop, Promise va async/await",
    intro: "Call stack, microtask va macrotask tartibi, zanjir, kombinatorlar va ketma-ket/parallel so'rovlar.",
    what: "JavaScript bitta oqimda ishlaydi. Event loop (hodisalar aylanasi) stek bo'shagach, avval barcha microtask larni, keyin bitta macrotask ni oladi. Promise va await — natija keyinroq keladigan ishlarni shu navbatlar orqali tartibga solish usuli.",
    analogy: { icon: '🍽️', title: "Bitta ofitsiant", text: "Ofitsiant avval qo'lidagi ishni tugatadi, keyin shoshilinch yozuvlarning hammasini bajaradi va faqat shundan so'ng navbatdagi bitta mijozga o'tadi." },
    defs: [
      ['Microtask', "then/catch/finally, await davomi, queueMicrotask."],
      ['Macrotask', "setTimeout, setInterval, foydalanuvchi hodisalari."],
      ['Promise holati', "pending, fulfilled yoki rejected; bir marta hal bo'ladi."],
      ['async funksiya', "Doim Promise qaytaradi."],
    ],
    uses: [
      ["Tartib xatolarini topishda", "Nima qachon bajarilishini oldindan aytasiz."],
      ["Mustaqil so'rovlarda", "Promise.all bilan parallel."],
      ["UI qotganda", "Uzun sinxron ishni bo'laklaysiz."],
    ],
    sections: [
      { heading: 'Tartib', flow: ["Sinxron kod", "Barcha microtask lar", "Render imkoniyati", "Bitta macrotask", "Yana microtask lar"] },
      { heading: 'Kombinatorlar', table: { head: ['Metod', 'Qachon hal bo\'ladi'], rows: [['all', 'hammasi bajarilsa; bitta xato — rad'], ['allSettled', 'hammasi tugagach, holatlar ro\'yxati'], ['race', 'birinchi tugagani (xato ham)'], ['any', 'birinchi muvaffaqiyatli']] } },
      { heading: 'Ketma-ket va parallel', code: { lang: 'js', text: '// ketma-ket: 2 soniya\nconst a = await getA();\nconst b = await getB();\n// parallel: 1 soniya\nconst [x, y] = await Promise.all([getA(), getB()]);' } },
      { heading: 'forEach va await', callout: { kind: 'warn', text: "forEach async callback ni kutmaydi. Ketma-ket kerak bo'lsa for...of, parallel kerak bo'lsa Promise.all + map." } },
    ],
    life: [
      ['🐢', "Sahifa 6 soniya", "Uchta mustaqil so'rov ketma-ket await qilingan."],
      ['🧊', "UI qotdi", "Cheksiz microtask yoki og'ir sikl render ga imkon bermaydi."],
    ],
    tip: "Natijalar bir-biriga bog'liq bo'lmasa, parallel boshlang.",
    mistakes: [
      ['setTimeout 0 darhol ishlaydi deb o\'ylash.', "U navbatdagi macrotask.", "Avval sinxron va microtask lar."],
      ['then ichida return ni unutish.', "Promise yoki qiymat qaytarish.", "Zanjir kutmaydi."],
      ['forEach ichida await.', "for...of yoki Promise.all.", "forEach Promise ni e'tiborsiz qoldiradi."],
    ],
    recap: [
      "Microtask macrotask dan oldin.",
      "async doim Promise qaytaradi.",
      "all tez yiqiladi, allSettled kutadi.",
      "Mustaqil ishlar parallel.",
    ],
    practice: [
      { title: 'Tartibni bashorat qiling', text: "setTimeout, then va await aralash kod yozib, natijani avval qog'ozda chiqaring." },
      { title: 'Parallelga o\'tkazing', text: "Ikki mustaqil await ni Promise.all ga o'tkazib, vaqtni performance.now bilan o'lchang." },
    ],
    items: [
      ch(OUT, "1 4 3 2", ["1 2 3 4", "1 4 2 3", "1 3 4 2"], "Avval sinxron 1 va 4, keyin microtask 3, oxirida macrotask 2.", 'console.log(1);\nsetTimeout(() => console.log(2));\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);'),
      ch(OUT, "A C B", ["A B C", "C A B", "B A C"], "await gacha sinxron: A. await davomi microtask, shu orada C chiqadi.", 'async function f() {\n  console.log("A");\n  await null;\n  console.log("B");\n}\nf();\nconsole.log("C");'),
      ch(OUT, "micro timer1 micro2 timer2", ["micro timer1 timer2 micro2", "timer1 timer2 micro micro2", "micro micro2 timer1 timer2"], "Har macrotask dan keyin uning microtask lari to'liq bajariladi.", 'setTimeout(() => {\n  console.log("timer1");\n  Promise.resolve().then(() => console.log("micro2"));\n});\nsetTimeout(() => console.log("timer2"));\nPromise.resolve().then(() => console.log("micro"));'),
      ch(OUT, "2", ["1", "undefined", "NaN"], "catch qiymat qaytargach zanjir tiklanadi: keyingi then 1 + 1 oladi.", 'Promise.reject(new Error("x"))\n  .catch(() => 1)\n  .then((v) => console.log(v + 1));'),
      ch(OUT, "undefined", ["5", "10", "Promise"], "Birinchi then qiymatni qaytarmadi, keyingisi undefined oladi.", 'Promise.resolve(5)\n  .then((v) => { v * 2; })\n  .then((v) => console.log(v));'),
      ch(OUT, "fulfilled rejected", ["rejected rejected", "fulfilled fulfilled", "rejected fulfilled"], "allSettled hech qachon rad etmaydi, har biriga status beradi.", 'Promise.allSettled([Promise.resolve(1), Promise.reject(2)])\n  .then((r) => console.log(r[0].status, r[1].status));'),
      ch(OUT, "ok", ["xato", "undefined", "AggregateError"], "any birinchi muvaffaqiyatlini kutadi, rad etilganlarni o'tkazib yuboradi.", 'Promise.any([Promise.reject("xato"), Promise.resolve("ok")])\n  .then((v) => console.log(v));'),
      ch("Har biri 1 soniya bo'lgan uchta mustaqil so'rov Promise.all bilan taxminan qancha davom etadi?", "1 soniya", ["3 soniya", "2 soniya", "0 soniya"], "Ular bir vaqtda kutiladi, umumiy vaqt eng sekinigacha."),
      ch("`list.forEach(async (x) => await save(x))` dan keyingi qator qachon bajariladi?", "Saqlashlar tugashini kutmay", ["Barcha saqlash tugagandan keyin", "Birinchi saqlash tugagandan so'ng", "Xato yuz bergan taqdirdagina"], "forEach callback qaytargan Promise ni kutmaydi."),
      fill(OUT, "true", "async funksiya qiymatni Promise ga o'raydi.", undefined, 'async function f() { return 1; }\nconsole.log(f() instanceof Promise);'),
      fill("Birortasi rad etilsa darhol rad etiladigan kombinator: Promise.___", "all", "Promise.all fail-fast ishlaydi.", ["Promise.all", "all()"]),
      order("Bajarilish navbatini tartiblang.", ["Sinxron kod", "Promise then callback", "setTimeout callback", "setTimeout ichidagi then"], "Ikkinchi then faqat o'z macrotask idan keyin microtask sifatida ishlaydi."),
    ],
  });

  /* 12 --------------------------------------------------------------------------------------- */
  lesson({
    title: "Hodisa delegatsiyasi, debounce va fetch",
    intro: "Capture va bubble, target va currentTarget, delegatsiya, debounce/throttle, response.ok va AbortController.",
    what: "Hodisa DOM daraxti bo'ylab yuradi: avval pastga (capture), nishonda, keyin yuqoriga (bubble). Shu yo'l tufayli bitta ota ishlovchi minglab bolalarni boshqaradi. fetch esa server bilan gaplashadi va uning xatti-harakatida ikki muhim nozik joy bor: HTTP xato rad etish emas va so'rovni bekor qilish kerak bo'ladi.",
    analogy: { icon: '🫧', title: "Suvdagi pufakcha", text: "Tubda paydo bo'lgan pufakcha yuqoriga ko'tarilib, har qatlamdan o'tadi. Suv yuzida turib hammasini ko'rish mumkin." },
    defs: [
      ['Event delegation (delegatsiya)', "Bolalar hodisasini bitta ota elementda tutish."],
      ['target / currentTarget', "Hodisa boshlangan element / ishlovchi turgan element."],
      ['Debounce / throttle', "Tinchlanishni kutish / belgilangan oraliqda bir marta."],
      ['AbortController', "Davom etayotgan so'rov yoki ishlovchini bekor qilish."],
    ],
    uses: [
      ["Dinamik ro'yxatlarda", "Yangi elementga ishlovchi ulash shart emas."],
      ["Qidiruv maydonida", "Debounce va eski so'rovni bekor qilish."],
      ["Scroll va resize da", "Throttle yoki observer."],
    ],
    sections: [
      { heading: 'Delegatsiya', code: { lang: 'js', text: 'list.addEventListener("click", (e) => {\n  const btn = e.target.closest("[data-id]");\n  if (!btn || !list.contains(btn)) return;\n  remove(btn.dataset.id);\n});' } },
      { heading: 'Boshqaruv metodlari', table: { head: ['Chaqiruv', 'Nima qiladi'], rows: [['preventDefault()', 'brauzer standart harakatini to\'xtatadi'], ['stopPropagation()', "keyingi elementlarga tarqalishni to'xtatadi"], ['{ once: true }', 'bir martadan keyin uziladi'], ['{ passive: true }', 'preventDefault qilmaslik va\'dasi']] } },
      { heading: 'Xavfsiz fetch', code: { lang: 'js', text: 'const res = await fetch(url, { signal: controller.signal });\nif (!res.ok) throw new Error("HTTP " + res.status);\nconst data = await res.json();' } },
      { heading: 'Race condition', callout: { kind: 'warn', text: "Eski so'rov yangisidan keyin javob qaytarsa, ekranda eskirgan natija qoladi. Yangi so'rovdan oldin eskisini abort qiling; AbortError ni xato deb ko'rsatmang." } },
    ],
    life: [
      ['🔍', "Qidiruv sakraydi", "\"ja\" javobi \"java\" javobidan keyin kelib, natijani almashtirdi."],
      ['📋', "Ming qatorli jadval", "Mingta ishlovchi o'rniga tbody da bittasi."],
    ],
    tip: "fetch 404 da ham muvaffaqiyatli hal bo'ladi: res.ok ni doim tekshiring.",
    mistakes: [
      ['e.target ni doim tugma deb o\'ylash.', "closest bilan topish.", "Ichidagi ikonka bosilishi mumkin."],
      ['res.ok ni tekshirmaslik.', "Statusni tekshirib throw qilish.", "HTTP xato catch ga tushmaydi."],
      ['Har bosishda yangi debounce yaratish.', "Bir marta yaratib qayta ishlatish.", "Aks holda taymer bekor bo'lmaydi."],
    ],
    recap: [
      "Hodisa capture, target, bubble bosqichlaridan o'tadi.",
      "Delegatsiyada closest ishlating.",
      "fetch faqat tarmoq xatosida rad etadi.",
      "AbortController eski so'rovni bekor qiladi.",
    ],
    practice: [
      { title: 'Delegatsiyali ro\'yxat', text: "Qo'shish va o'chirish bor ro'yxatni bitta ishlovchi bilan yozing." },
      { title: 'Qidiruv', text: "300 ms debounce va AbortController li qidiruv yozib, Network tabda bekor qilinganlarni ko'ring." },
    ],
    items: [
      ch("Tugma ichidagi ikonka bosildi, ishlovchi ul da. e.target va e.currentTarget nima?", "Ikonka va ul", ["Tugma va ul", "ul va ikonka", "Ikonka va tugma"], "target — eng ichki bosilgan element, currentTarget — ishlovchi turgan element."),
      ch("Ota va bolada oddiy (bubble) click ishlovchilari bor. Bola bosilsa tartib qanday?", "Avval bola, keyin ota", ["Avval ota, keyin bola", "Faqat bola ishlaydi", "Faqat ota ishlaydi"], "Standart bo'yicha hodisa pastdan yuqoriga ko'tariladi."),
      ch("`addEventListener('click', fn, true)` nimani bildiradi?", "Capture bosqichida ishlash", ["Bir marta ishlab uzilish", "preventDefault chaqirilishi", "Tarqalishni to'xtatish"], "Uchinchi argument true bo'lsa, ishlovchi yuqoridan pastga tushishda ishlaydi."),
      ch("Forma yuborilganda sahifa yangilanmasligi uchun nima chaqiriladi?", "e.preventDefault()", ["e.stopPropagation()", "e.stopImmediatePropagation()", "return e.target"], "Yangilanish brauzerning standart harakati."),
      ch("fetch 404 javob olganda Promise nima bo'ladi?", "Bajariladi, ok esa false", ["Rad etiladi va catch ishlaydi", "pending holatida qolib ketadi", "Avtomatik qayta so'rov ketadi"], "Rad etish faqat tarmoq, CORS yoki bekor qilishda."),
      ch("Bekor qilingan fetch qanday xato bilan rad etiladi?", "AbortError", ["TypeError", "NetworkError", "TimeoutError"], "e.name === \"AbortError\" bo'lsa, foydalanuvchiga xato ko'rsatmang."),
      ch("Foydalanuvchi yozishdan to'xtagach bitta so'rov yuborish uchun nima kerak?", "Debounce", ["Throttle", "Polling", "Delegatsiya"], "Debounce har yangi hodisada taymerni qayta boshlaydi."),
      ch("Debounce funksiyasida closure nima uchun kerak?", "Taymer identifikatorini saqlash uchun", ["Hodisani capture ga o'tkazish uchun", "So'rovni parallel qilish uchun", "DOM elementini klonlash uchun"], "Keyingi chaqiruv oldingi taymerni clearTimeout qilishi kerak.", 'function debounce(fn, ms) {\n  let id;\n  return (...args) => {\n    clearTimeout(id);\n    id = setTimeout(() => fn(...args), ms);\n  };\n}'),
      ch("Foydalanuvchi matnini DOM ga xavfsiz yozish uchun qaysi xossa?", "textContent", ["innerHTML", "outerHTML", "insertAdjacentHTML"], "textContent matnni HTML deb o'qimaydi — XSS dan himoya."),
      fill("Delegatsiyada nishondan yuqoriga mos ajdodni topadigan metod?", "closest", "e.target.closest(\"[data-id]\").", ["closest()", ".closest"]),
      fill("HTTP status 200-299 ekanini bildiruvchi Response xossasi?", "ok", "if (!res.ok) throw ...", ["res.ok", "response.ok"]),
      order("Qidiruv oqimini tartiblang.", ["Foydalanuvchi yozadi", "Debounce tinchlanishni kutadi", "Eski so'rov abort qilinadi", "Yangi natija ekranga chiqadi"], "Shunday qilib faqat oxirgi so'rov natijasi ko'rinadi."),
    ],
  });
};
