// Extra theory for JavaScript lessons 1-17.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  1: E(
    "JavaScript — brauzer va serverda ishlaydigan dasturlash tili. Kodni engine (dvigatel, masalan V8) bajaradi: avval o'qib tahlil qiladi, keyin ishlatish davomida mashina kodiga aylantiradi (JIT). Tilning o'zi ECMAScript standartida, document yoki fetch kabi imkoniyatlar esa muhit tomonidan beriladi.",
    [['Sahifani jonlantirishda', 'Brauzerda hodisalarga javob berasiz.'], ['Server yozishda', 'Node.js da fayl va tarmoq bilan ishlaysiz.'], ['«Bu yerda nega ishlamayapti» degan savolda', "window serverda yo'q — u muhitga bog'liq."]],
    "Til bitta, muhit har xil: Array — tilniki, document — brauzerniki.",
    [["JavaScript va Java — bir til.", "Ular butunlay boshqa tillar.", "Nom o'xshashligi tarixiy."], ["Bir oqimli bo'lgani uchun kutish paytida hech narsa qilolmaydi.", "Kutishlarni muhit bajaradi, natija navbat orqali qaytadi.", "Shu sabab sahifa qotmaydi."]],
  ),
  2: E(
    "Variable (o'zgaruvchi) — qiymatga berilgan nom. const nomni boshqa qiymatga qayta bog'lashni taqiqlaydi, let ruxsat beradi, var eskirgan. Qiymatlar ikki xil: primitive (nusxalanadi) va obyektlar (havolasi nusxalanadi).",
    [['Odatiy holatda', 'const.'], ["Qiymat o'zgarishi kerak bo'lsa", 'let.'], ['Tipni bilishda', "typeof va Array.isArray."]],
    "const — «yorliqni boshqa narsaga yopishtirib bo'lmaydi», lekin quti ichini o'zgartirsa bo'ladi.",
    [["const obyektni o'zgarmas deb o'ylash.", "Ichini o'zgartirish mumkin; kerak bo'lsa Object.freeze.", "const faqat bog'lanishni qotiradi."], ["typeof null === 'null' deb kutish.", "typeof null — 'object'.", "null ni === null bilan tekshiring."]],
  ),
  3: E(
    "Type coercion (tipni avtomatik o'zgartirish) — operator mos kelmagan tipni o'zi boshqasiga aylantirishi. + da bitta tomon matn bo'lsa birlashtiradi, - * / esa songa aylantiradi. == tiplarni moslab solishtiradi, === esa tipni ham tekshiradi.",
    [['Solishtirishda', 'Doim === va !==.'], ['Inputdan son olganda', 'Number(value) bilan ochiq aylantirish.'], ["Bo'shligini tekshirishda", "Falsy qiymatlarni bilish: false, 0, -0, 0n, '', null, undefined, NaN."]],
    "Yashirin o'zgarishga ishonmang — o'zingiz yozing: Number(), String(), Boolean().",
    [["input.value + 1 → «51».", "Number(input.value) + 1.", "value doim matn."], ["if (count) bilan 0 ni ham «yo'q» deb hisoblash.", "if (count !== undefined).", "0 — falsy."]],
  ),
  4: E(
    "JavaScript da number bitta tip: 64 bitli suzuvchi nuqtali son. Juda katta butun sonlar uchun BigInt bor. String (matn) o'zgarmas: har metod yangi satr qaytaradi.",
    [['Pul hisobida', "Tiyinlarda butun son bilan hisoblash."], ['Matn yig\'ishda', 'Template literal: `Salom, ${name}`.'], ['Formatlashda', 'toFixed, padStart, Intl.NumberFormat.']],
    "0.1 + 0.2 aniq 0.3 emas — kasrlarni to'g'ridan-to'g'ri === bilan solishtirmang.",
    [["toFixed natijasiga son sifatida qo'shish.", "Number(x.toFixed(2)).", "toFixed matn qaytaradi."], ["str.toUpperCase() satrni o'zgartiradi deb o'ylash.", "str = str.toUpperCase().", "Satrlar immutable."]],
  ),
  5: E(
    "Operatorlar qiymatlar ustida amal bajaradi, boshqaruv konstruksiyalari (if, switch, for, while) esa kod qaysi tartibda bajarilishini belgilaydi. && va || qisqa tutashadi: natija aniq bo'lsa, o'ng tomon hisoblanmaydi.",
    [['Zaxira qiymatda', '?? — faqat null va undefined uchun.'], ['Ichki maydonni xavfsiz o\'qishda', 'user?.address?.city.'], ['Shartli chaqiruvda', 'onDone?.().'], ["Ko'p variantda", 'switch va break.']],
    "|| har qanday falsy ni almashtiradi, ?? esa faqat «qiymat yo'q» ni.",
    [["const limit = input || 10 (0 kiritilsa 10 bo'ladi).", "input ?? 10.", "0 to'g'ri qiymat."], ["switch da break ni unutish.", "Har case oxirida break yoki return.", "Keyingi case ham bajariladi (fallthrough)."]],
  ),
  6: E(
    "Function (funksiya) — qayta ishlatiladigan amallar to'plami: parametr qabul qiladi va natija qaytaradi. JavaScript da funksiya oddiy qiymat: o'zgaruvchiga saqlash, argument qilib uzatish va qaytarish mumkin.",
    [['Takrorni yo\'qotishda', "Bir xil kodni bitta funksiyaga chiqarasiz."], ['Standart qiymatda', 'function f(x = 1).'], ["Noma'lum sonli argumentda", '...args.'], ['Qisqa callback da', 'Arrow funksiya.']],
    "Bitta funksiya — bitta vazifa. Nomi fe'l bo'lsin: getUser, calcTotal.",
    [["Figurali qavsli arrow da return ni unutish.", "x => { return x * 2 } yoki x => x * 2.", "Aks holda undefined qaytadi."], ["onClick={save()} kabi darhol chaqirish.", "Funksiyaning o'zini berish: save.", "() — hozir bajar degani."]],
  ),
  7: E(
    "Execution context (bajarilish konteksti) — kod bajarilayotgan muhit: o'zgaruvchilar, this va tashqi muhitga havola. Har funksiya chaqiruvi call stack (chaqiruvlar steki) ga yangi qavat qo'shadi; tugagach qavat olinadi.",
    [["Xato izini o'qishda", 'Stack trace — qaysi funksiya qaysinisini chaqirgani.'], ['Rekursiyada', "To'xtash sharti bo'lmasa stack to'ladi."], ["Debugger da", 'Call Stack paneli orqali qadamlarni kuzatasiz.']],
    "Stack — likopchalar taxlami: oxirgi qo'yilgani birinchi olinadi.",
    [["Rekursiyada asosiy holatni yozmaslik.", "Avval to'xtash shartini yozish.", "RangeError: Maximum call stack size exceeded."], ["Obyekt stack da saqlanadi deb o'ylash.", "Obyekt heap da, o'zgaruvchida havolasi.", "Shuning uchun nusxa havola bo'ladi."]],
  ),
  8: E(
    "Scope (ko'rinish sohasi) — o'zgaruvchi qayerdan ko'rinishini belgilaydi: global, funksiya va blok. Lexical scope: soha kod YOZILGAN joyga qarab aniqlanadi, chaqirilgan joyga emas.",
    [['Nomlar to\'qnashuvini oldini olishda', "O'zgaruvchini eng tor sohada e'lon qilasiz."], ['Siklda', 'let har aylanishda yangi nom yaratadi.'], ['Xato izlashda', "Qiymat scope chain bo'ylab ichkaridan tashqariga qidiriladi."]],
    "Ichkaridan tashqarini ko'rsa bo'ladi, tashqaridan ichkarini — yo'q.",
    [["e'lonsiz x = 5 yozish.", "let yoki const bilan e'lon qilish.", "Tasodifiy global o'zgaruvchi yaraladi."], ["Ichki blokda bir xil nom bilan tashqisini yopib qo'yish.", "Boshqa nom tanlash.", "Shadowing chalg'itadi."]],
  ),
  9: E(
    "Hoisting (e'lonning ko'tarilishi) — bajarishdan oldin e'lonlar ro'yxatga olinadi. function e'loni to'liq tayyor bo'ladi, var undefined bilan, let va const esa e'lon qatorigacha TDZ (vaqtinchalik o'lik zona) da turadi.",
    [['Xatoni tushunishda', "«Cannot access before initialization» — TDZ."], ['Kod tartibida', "Avval e'lon, keyin ishlatish."], ["Eski kod o'qishda", 'var nega undefined berayotganini bilasiz.']],
    "function — to'liq ko'tariladi; var — bo'sh quti; let/const — qulflangan quti.",
    [["const fn = () => {} ni e'londan oldin chaqirish.", "Avval yozib, keyin chaqirish.", "Bu o'zgaruvchi qoidasiga bo'ysunadi."], ["Hoisting kodni jismonan tepaga ko'chiradi deb o'ylash.", "Faqat e'lonlar oldindan qayd qilinadi.", "Qiymat berish joyida qoladi."]],
  ),
  10: E(
    "Closure (yopilma) — funksiya o'zi yaratilgan sohadagi o'zgaruvchilarni, tashqi funksiya tugagandan keyin ham, eslab qolishi. Qiymatning nusxasi emas, o'zgaruvchining o'zi saqlanadi.",
    [['Xususiy holatda', 'Hisoblagich: qiymatni faqat funksiya o\'zgartiradi.'], ['Sozlangan funksiya yasashda', 'multiplier(3).'], ['Event handler va timerda', "Kerakli qiymat keyin ham mavjud."], ['Debounce da', 'Timer identifikatori closure da turadi.']],
    "Funksiya ryukzak bilan yuradi: tug'ilgan joyidagi o'zgaruvchilar ichida.",
    [["var bilan siklda timer qo'yish — hammasi oxirgi qiymat.", "let ishlatish.", "var da bitta umumiy o'zgaruvchi."], ["Keraksiz katta ma'lumotni closure da ushlab turish.", "Faqat kerakli qiymatni saqlash.", "Xotira bo'shamaydi."]],
  ),
  11: E(
    "this — funksiya QANDAY CHAQIRILGANIGA qarab aniqlanadigan kontekst obyekti. obj.f() da obj, new bilan yangi obyekt, call/apply/bind da berilgan qiymat. Arrow funksiyaning o'z this i yo'q — tashqaridagisini oladi.",
    [['Obyekt metodida', 'this.name orqali o\'z maydonini o\'qiysiz.'], ['Metodni uzatishda', 'bind yoki arrow bilan o\'rash.'], ["Class ichidagi callback da", 'Arrow maydon this ni saqlaydi.']],
    "Nuqtadan oldingi narsa — this. Nuqta yo'q bo'lsa — yo'qolgan this.",
    [["setTimeout(user.greet, 100).", "setTimeout(() => user.greet(), 100).", "Metod obyektdan uzilib qoladi."], ["Obyekt metodini arrow bilan yozish va this kutish.", "Oddiy metod sintaksisi: greet() {}.", "Arrow tashqi this ni oladi."]],
  ),
  12: E(
    "Object (obyekt) — nom va qiymat juftliklari to'plami. U havola bo'yicha uzatiladi, shuning uchun nusxalash alohida e'tibor talab qiladi: spread yuzaki, structuredClone chuqur nusxa beradi.",
    [["Ma'lumotni guruhlashda", "{ id, name, price }."], ["Qismini ajratishda", 'const { name, ...rest } = user.'], ["O'zgartirmasdan yangilashda", '{ ...user, age: 21 }.'], ["Kalitlar bo'ylab yurishda", 'Object.entries.']],
    "= nusxa olmaydi, ikkinchi nom beradi.",
    [["const copy = user; copy.name = 'X' (asli ham o'zgaradi).", "const copy = { ...user }.", "Havola bir xil."], ["Spread chuqur nusxa deb o'ylash.", "Ichki obyektni ham yoyish yoki structuredClone.", "Ichki obyekt umumiy qoladi."]],
  ),
  13: E(
    "Prototype (prototip) — obyekt o'zida topolmagan xususiyatni qidiradigan boshqa obyekt. Shu zanjir orqali metodlar hamma nusxalar uchun bitta joyda saqlanadi. class sintaksisi ham shu mexanizm ustida.",
    [['Metodlar qayerdan kelganini tushunishda', "[].map — Array.prototype dan."], ["O'z xususiyatini ajratishda", 'Object.hasOwn(obj, key).'], ["Bog'lab obyekt yaratishda", 'Object.create(proto).']],
    "Qidiruv zinapoyasi: o'zim → prototipim → uning prototipi → null.",
    [["Object.prototype ga o'z metodingizni qo'shish.", "Alohida funksiya yoki class yozish.", "Hamma obyektga ta'sir qiladi."], ["for...in faqat o'z kalitlarini beradi deb o'ylash.", "Object.keys yoki hasOwn.", "for...in meros kalitlarni ham aylanadi."]],
  ),
  14: E(
    "class — bir xil tuzilishdagi obyektlarni yaratish qolipi. constructor boshlang'ich holatni beradi, metodlar prototipda turadi, extends meros beradi, # bilan yozilgan maydon tashqaridan ko'rinmaydi.",
    [['Holat va xatti-harakat birga bo\'lganda', 'Savat, taymer, o\'yinchi.'], ['Umumiy asosdan variant yasashda', 'extends va super.'], ["Ichki ma'lumotni yashirishda", '#balance.'], ['Nusxasiz yordamchi funksiyada', 'static.']],
    "extends qilgan class constructor ida this dan oldin super() shart.",
    [["Class ni new'siz chaqirish.", "new User().", "TypeError beradi."], ["super() dan oldin this ishlatish.", "Avval super().", "this hali yaratilmagan."]],
  ),
  15: E(
    "Array (massiv) — tartibli ro'yxat. Metodlar ikki turga bo'linadi: asl massivni o'zgartiradigan (push, splice, sort) va yangisini qaytaradigan (map, filter, slice, toSorted).",
    [['Har elementni aylantirishda', 'map.'], ['Saralab olishda', 'filter.'], ['Bitta natija yig\'ishda', 'reduce.'], ["Birinchi mosini topishda", 'find va findIndex.']],
    "map — son saqlanadi, filter — kamayadi, reduce — bittaga yig'iladi.",
    [["[10, 1, 5].sort() raqam tartibi deb kutish.", "sort((a, b) => a - b).", "Standart saralash matn bo'yicha."], ["forEach natijasini o'zgaruvchiga olish.", "map ishlatish.", "forEach undefined qaytaradi."]],
  ),
  16: E(
    "Functional programming (funksional dasturlash) — dasturni sof funksiyalardan tuzish yondashuvi: bir xil kirishga bir xil natija, tashqi holatni o'zgartirmaslik, funksiyalarni birlashtirish.",
    [['Sinash oson bo\'lishi uchun', 'Hisob-kitobni sof funksiyaga ajratasiz.'], ["Holatni yangilashda (React)", "Eskisini o'zgartirmay yangisini qaytarasiz."], ["Qayta sozlashda", 'Currying va yuqori tartibli funksiya.']],
    "Sof funksiya — avtomat: bir xil tanga, bir xil ichimlik, boshqa hech narsa o'zgarmaydi.",
    [["Funksiya ichida kiruvchi massivga push qilish.", "return [...list, item].", "Chaqiruvchining ma'lumoti buziladi."], ["Yon ta'sirni umuman yo'qotishga urinish.", "Uni chegarada to'plash (tarmoq, DOM).", "Dastur baribir tashqi dunyoga yozadi."]],
  ),
  17: E(
    "Map — har qanday tipdagi kalitga ega lug'at, Set — takrorlanmas qiymatlar to'plami. WeakMap va WeakSet kalit obyektini kuchsiz ushlaydi: obyekt boshqa joyda qolmasa, xotiradan tozalanadi.",
    [["Takrorlarni olib tashlashda", '[...new Set(arr)].'], ["Tez qidiruvda", 'set.has va map.get.'], ["Kalit obyekt bo'lsa", 'Map.'], ["Obyektga yashirin ma'lumot bog'lashda", 'WeakMap.']],
    "Kalitlar oldindan ma'lum bo'lsa — object, dinamik va ko'p bo'lsa — Map.",
    [["new Set([{a:1},{a:1}]) takrorni o'chiradi deb o'ylash.", "Obyektlar havola bo'yicha solishtiriladi.", "Ikki xil obyekt — ikki element."], ["map['key'] = 1 yozish.", "map.set('key', 1).", "Aks holda Map yozuvi emas, oddiy xususiyat."]],
  ),
};
