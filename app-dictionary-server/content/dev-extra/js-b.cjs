// Extra theory for JavaScript lessons 18-33.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  18: E(
    "Symbol — har safar noyob bo'ladigan qiymat, odatda to'qnashmaydigan kalit sifatida ishlatiladi. Iterable (aylanib chiqsa bo'ladigan) obyekt Symbol.iterator metodiga ega va for...of, spread bilan ishlaydi.",
    [["O'z obyektingizni for...of ga moslashda", 'Symbol.iterator yozasiz.'], ["Kutubxona kalitini yashirishda", 'Symbol kalit.'], ['Spread nega ishlamayotganini bilishda', "Oddiy obyekt iterable emas."]],
    "Iterator — next() chaqirilganda { value, done } beradigan obyekt.",
    [["for...of bilan oddiy obyektni aylanish.", "Object.entries(obj).", "Oddiy obyekt iterable emas."], ["Symbol('a') === Symbol('a') true deb kutish.", "Har Symbol noyob.", "Umumiysi uchun Symbol.for('a')."]],
  ),
  19: E(
    "Generator — bajarilishni to'xtatib, keyin davom ettira oladigan funksiya (function*). Har yield bitta qiymat beradi; qiymatlar faqat so'ralganda hisoblanadi.",
    [["Cheksiz ketma-ketlikda", "Faqat keraklicha olasiz."], ["Iterator yozishni soddalashtirishda", '*[Symbol.iterator]().'], ["Bosqichli jarayonda", "Har qadamni next() boshqaradi."]],
    "yield — «pauza va natija»; keyingi next() shu joydan davom etadi.",
    [["Generatorni chaqirsam darhol ishlaydi deb o'ylash.", "next() kerak.", "Chaqiruv faqat generator obyektini yaratadi."], ["Tugagan generatorni qayta aylanish.", "Yangi generator yaratish.", "U bir martalik."]],
  ),
  20: E(
    "Exception (istisno holat) — bajarilishni to'xtatib, uni ushlaydigan joygacha yuqoriga ko'tariladigan xato. try/catch ushlaydi, finally har qanday holatda ishlaydi, throw esa xato tashlaydi.",
    [['Tashqi ma\'lumotni o\'qishda', 'JSON.parse atrofida try.'], ["O'z xato turingizda", 'class ValidationError extends Error.'], ['Sababni saqlashda', 'new Error(msg, { cause }).'], ['Resursni yopishda', 'finally.']],
    "Xatoni faqat nima qilishni bilsangiz ushlang; aks holda yuqoriga qo'yib yuboring.",
    [["catch (e) {} — bo'sh ushlash.", "Hech bo'lmasa log qilish yoki qayta tashlash.", "Xato jimgina yo'qoladi."], ["try ichida setTimeout xatosini ushlashni kutish.", "try ni callback ICHIGA qo'yish yoki promise + await.", "Callback boshqa stack da bajariladi."]],
  ),
  21: E(
    "Event loop (hodisalar sikli) — bitta oqimli JavaScript asinxron ishlarni qanday navbatga qo'yishini boshqaruvchi mexanizm. Stack bo'shagach avval barcha microtask (promise), keyin bitta macrotask (timer, hodisa) bajariladi.",
    [["Chiqish tartibini bashorat qilishda", 'Sinxron → microtask → macrotask.'], ['UI qotmasligi uchun', "Og'ir ishni bo'laklash yoki Web Worker."], ['setTimeout 0 ni tushunishda', "«Darhol» emas, «navbat kelganda»."]],
    "Avval qo'lingdagi ish (stack), keyin shoshilinch qog'ozlar (microtask), keyin navbatdagi mijoz (macrotask).",
    [["setTimeout(fn, 0) promise dan oldin ishlaydi deb kutish.", "Promise callback i oldin.", "Microtask ustuvor."], ["Uzun sinxron sikl bilan kutish.", "Taymer yoki await ishlatish.", "Sahifa butunlay qotadi."]],
  ),
  22: E(
    "Callback — keyin chaqirib yuborish uchun berilgan funksiya. Promise (va'da) esa kelajakdagi natija obyekti: pending, fulfilled yoki rejected. then zanjiri asinxron qadamlarni tekis yozish imkonini beradi.",
    [['Ketma-ket asinxron qadamlarda', 'then zanjiri.'], ['Xatoni bir joyda ushlashda', 'Zanjir oxirida catch.'], ["Callback API ni o'rashda", 'new Promise((resolve, reject) => …).']],
    "then ichida return qilsangiz, keyingi then o'sha qiymatni oladi.",
    [["then ichida return ni unutish.", "return fetch(…).", "Keyingi bosqich kutmaydi, undefined oladi."], ["Tayyor promise ni yana new Promise ga o'rash.", "O'zini qaytarish.", "Keraksiz va xato yo'qolishi mumkin."]],
  ),
  23: E(
    "Promise kombinatorlari bir nechta va'dani birga boshqaradi: all — hammasi muvaffaqiyatli bo'lishi kerak, allSettled — hammasining natijasini kutadi, race — birinchi tugagani, any — birinchi muvaffaqiyatli.",
    [['Mustaqil so\'rovlarda', 'Promise.all — parallel va tez.'], ['Qisman natija ham yarasa', 'allSettled.'], ['Vaqt chegarasi qo\'yishda', 'race.'], ['Zaxira serverlarda', 'any.']],
    "all — «hammasi yoki hech narsa», allSettled — «hisobot», race — «kim birinchi», any — «bittasi yetsa bo'ldi».",
    [["Mustaqil so'rovlarni ketma-ket await qilish.", "await Promise.all([a(), b()]).", "Vaqt qo'shilib ketadi."], ["race yutqazganlarni to'xtatadi deb o'ylash.", "To'xtatish uchun AbortController.", "Qolganlari ishlashda davom etadi."]],
  ),
  24: E(
    "async/await — promise bilan sinxron ko'rinishda ishlash sintaksisi. async funksiya doim promise qaytaradi; await natija kelguncha faqat shu funksiyani to'xtatadi.",
    [["So'rov natijasini olishda", 'const data = await getData().'], ['Xatoda', 'try/catch.'], ['Parallellikda', 'Avval hammasini boshlab, keyin Promise.all.']],
    "await — «shu qatorda kut», lekin butun dastur emas, faqat shu funksiya kutadi.",
    [["items.forEach(async …) tugashini kutish.", "for...of yoki Promise.all(items.map(…)).", "forEach promise larni kutmaydi."], ["async funksiya natijasini await'siz ishlatish.", "await qo'yish.", "Qo'lingizda qiymat emas, promise."]],
  ),
  25: E(
    "fetch — tarmoq so'rovi yuborishning standart usuli. U Response obyektini qaytaradi, tanani alohida o'qiysiz. AbortController so'rovni bekor qiladi. CORS — brauzer boshqa manbadan javob o'qishni server ruxsati bilan cheklashi.",
    [["Ma'lumot olishda", 'const r = await fetch(url); if (!r.ok) …; await r.json().'], ['Yuborishda', 'method, headers, body.'], ['Qidiruvda eski so\'rovni to\'xtatishda', 'controller.abort().'], ['Vaqt chegarasida', 'AbortSignal.timeout(ms).']],
    "fetch uchun 404 ham «javob keldi» — xato emas. response.ok ni doim tekshiring.",
    [["await r.json() ni ok tekshirmasdan chaqirish.", "Avval if (!r.ok).", "Xato sahifasi JSON bo'lmasligi mumkin."], ["mode: 'no-cors' bilan CORS ni «tuzatish».", "Serverda ruxsat headerini sozlash.", "no-cors javobini o'qib bo'lmaydi."]],
  ),
  26: E(
    "Module — o'z sohasiga ega fayl: kerakli narsani export qiladi, boshqa fayl import qiladi. Import jonli bog'lanish beradi. Dynamic import kodni kerak bo'lganda yuklaydi.",
    [["Kodni fayllarga bo'lishda", 'export va import.'], ['Boshlang\'ich yukni kamaytirishda', 'await import(\'./chart.js\').'], ["Ishlatilmagan kodni tashlashda", 'Tree shaking (nomli eksportlar bilan yaxshi).']],
    "Nomli export — figurali qavs bilan, aynan shu nomda; default — qavssiz, istalgan nomda.",
    [["Default eksportni { } bilan import qilish.", "import App from './App.js'.", "{ } faqat nomli eksport uchun."], ["Import qilingan nomga yangi qiymat berish.", "Qiymatni eksport qilgan modul o'zgartiradi.", "Import faqat o'qiladi."]],
  ),
  27: E(
    "DOM (hujjat obyekt modeli) — sahifaning JavaScript boshqara oladigan obyektlar daraxti. Element topiladi, o'qiladi, o'zgartiriladi yoki yangi element qo'shiladi.",
    [['Element topishda', 'querySelector va querySelectorAll.'], ['Matn qo\'yishda', 'textContent.'], ['Holatni o\'zgartirishda', 'classList.add / toggle.'], ["Ko'p element qo'shishda", 'DocumentFragment yoki bitta append.']],
    "Foydalanuvchidan kelgan matn — doim textContent, hech qachon innerHTML.",
    [["el.innerHTML = userInput.", "el.textContent = userInput.", "XSS — begona skript bajariladi."], ["Siklda o'qish va yozishni aralashtirish.", "Avval hammasini o'qib, keyin yozish.", "Har safar qayta joylashtirish (reflow)."]],
  ),
  28: E(
    "Event (hodisa) — bosish, yozish, yuklanish kabi voqea. U avval yuqoridan nishongacha (capturing), keyin nishondan yuqoriga (bubbling) yuradi. Shu sababli otaga bitta listener qo'yib, hamma bolalarni boshqarsa bo'ladi.",
    [["Dinamik ro'yxatda", 'Event delegation va closest().'], ['Formada', 'preventDefault().'], ['Bir marta ishlash kerak bo\'lsa', '{ once: true }.'], ["Aylantirishni sekinlatmaslikda", '{ passive: true }.']],
    "target — hodisa boshlangan element, currentTarget — listener turgan element.",
    [["removeEventListener ga yangi arrow berish.", "O'sha funksiya havolasini berish.", "Boshqa funksiya — o'chmaydi."], ["stopPropagation ni o'ylamay ishlatish.", "Faqat zarur bo'lsa.", "Tashqi menyu va analitika ishlamay qoladi."]],
  ),
  29: E(
    "Timerlar (setTimeout, setInterval) ishni kechiktiradi yoki takrorlaydi. Debounce — hodisalar to'xtagach bir marta bajarish, throttle — belgilangan oraliqda ko'pi bilan bir marta bajarish.",
    [['Qidiruv maydonida', 'debounce.'], ['Aylantirish va o\'lcham o\'zgarishida', 'throttle.'], ['Silliq animatsiyada', 'requestAnimationFrame.'], ['Taymerni to\'xtatishda', 'clearTimeout va clearInterval.']],
    "Debounce — «gapirib bo'lishingni kutaman»; throttle — «har 200 ms da bir marta eshitaman».",
    [["Har render da yangi debounce funksiyasi yaratish.", "Bitta nusxani saqlash.", "Eski taymer bekor bo'lmaydi."], ["Interval ni tozalamaslik.", "Komponent yopilganda clearInterval.", "Fon rejimida ishlashda davom etadi."]],
  ),
  30: E(
    "JavaScript da xotira avtomatik boshqariladi: ildizdan (root) yetib bo'lmaydigan obyekt tozalanadi. Memory leak (xotira sizishi) — keraksiz obyektga havola qolib ketishi.",
    [['Sahifa sekinlashsa', 'DevTools Memory bo\'limida snapshot solishtirasiz.'], ["Tinglovchi va taymerlarda", "Kerak bo'lmaganda olib tashlaysiz."], ['Kesh yozishda', 'Hajmini cheklaysiz yoki WeakMap.']],
    "Savol «obyekt kerakmi?» emas, «unga hali ham yetib boradigan yo'l bormi?».",
    [["delete yoki null hamma xotirani darhol bo'shatadi deb o'ylash.", "Faqat havola uziladi; tozalash vaqtini engine tanlaydi.", "Boshqa havola qolsa tozalanmaydi."], ["Olib tashlangan DOM tugunini o'zgaruvchida saqlash.", "Havolani ham tozalash.", "Detached node sizishi."]],
  ),
  31: E(
    "Regular expression (matn andozasi) — matndan naqsh bo'yicha qidirish, tekshirish va almashtirish tili. Belgilar sinfi, miqdor belgilari, guruhlar va langarlar (^ $) dan tuziladi.",
    [['Formatni tekshirishda', 'test().'], ['Qismlarni ajratishda', 'match va nomli guruhlar.'], ["Ko'p joyda almashtirishda", 'replaceAll yoki g bayrog\'i.']],
    "Andozani kichik qismlarga bo'lib o'qing: nima → nechta → qayerda.",
    [["^ va $ siz tekshirish.", "/^\\d{4}$/.", "Aks holda ichida 4 raqam bo'lsa ham o'tadi."], ["g bayroqli regex ni test() da qayta ishlatish.", "g siz tekshirish yoki lastIndex ni 0 qilish.", "Natija navbatma-navbat true/false bo'ladi."]],
  ),
  32: E(
    "JSON — ma'lumot almashish uchun matn formati. Date — vaqt nuqtasini millisekundlarda saqlaydi. Intl — son, pul va sanani tilga mos formatlaydi.",
    [['Server bilan almashishda', 'JSON.stringify va JSON.parse.'], ['Brauzerda saqlashda', 'localStorage faqat matn oladi.'], ['Pul va sanani ko\'rsatishda', 'Intl.NumberFormat, Intl.DateTimeFormat.'], ["Vaqtni uzatishda", 'ISO 8601 va UTC.']],
    "Saqlash — UTC da, ko'rsatish — foydalanuvchi mintaqasida.",
    [["new Date(2025, 1, 1) yanvar deb o'ylash.", "Oylar 0 dan boshlanadi: 1 — fevral.", "Eng ko'p uchraydigan sana xatosi."], ["Date va undefined JSON da o'zicha qaytadi deb kutish.", "Date matnga aylanadi, undefined maydon tushib qoladi.", "Qayta o'qiganda o'zingiz tiklaysiz."]],
  ),
  33: E(
    "Design pattern (loyihalash andozasi) — tez-tez uchraydigan muammoning sinovdan o'tgan yechim shakli. Tayyor kod emas, g'oya: observer, strategy, decorator, proxy va boshqalar.",
    [['Hodisalarga obuna bo\'lishda', 'Observer.'], ["Ko'p if o'rniga", 'Strategy: algoritmlar lug\'ati.'], ["Funksiyaga imkoniyat qo'shishda", 'Decorator.'], ['Murojaatni nazorat qilishda', 'Proxy.']],
    "Avval muammo, keyin andoza. Andoza uchun muammo o'ylab topmang.",
    [["Oddiy kodni andozalar bilan murakkablashtirish.", "Eng sodda yechimdan boshlash.", "O'qish qiyinlashadi."], ["Obunani bekor qilish imkonini bermaslik.", "subscribe unsubscribe funksiyasini qaytarsin.", "Xotira sizadi."]],
  ),
};
