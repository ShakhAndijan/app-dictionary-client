// Extra theory for the HTML module, keyed by lesson order.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  1: E(
    "HTML (HyperText Markup Language — gipermatnni belgilash tili) sahifaning tuzilishi va MA'NOSINI belgilaydi. Semantic (ma'noli) teg qismning nima ekanini aytadi: header — bosh qism, nav — menyu, main — asosiy tarkib, article — mustaqil maqola. Brauzer, qidiruv tizimi va ekran o'quvchi shu ma'noga tayanadi.",
    [['Har yangi sahifada', 'DOCTYPE, html lang, meta charset va viewport — majburiy skelet.'], ['Sahifani bo\'laklashda', 'div o\'rniga mos semantik teg tanlaysiz.'], ['Hamma foydalana olishi uchun', "Ekran o'quvchi sarlavhalar va bo'limlar bo'yicha sakrab yuradi."]],
    "Savol bering: «Bu qism NIMA?» — javobga mos teg bor bo'lsa, o'shani ishlating. div va span — mos teg topilmaganda.",
    [["Hamma narsani div bilan yozish.", "header, nav, main, section, article, footer.", "Ma'no yo'qoladi, accessibility buziladi."], ["Katta ko'rinsin deb h1 ni bir necha joyda ishlatish.", "Sarlavha darajasi tartib bilan; o'lcham CSS bilan.", "Sarlavhalar — mundarija."]],
  ),
  2: E(
    "Matn teglari so'zlarga ma'no beradi (strong — muhim, em — urg'u), a tegi sahifalarni bog'laydi, ro'yxat teglari esa bir turdagi narsalarni guruhlaydi: ul — tartibsiz, ol — tartibli, dl — atama va izoh.",
    [['Navigatsiya menyusida', 'nav ichida ul va li, har birida a.'], ['Qadamli ko\'rsatmada', 'ol — tartib muhim bo\'lganda.'], ['Sahifa ichida sakrashda', 'href="#bolim" va id="bolim".'], ['Tashqi havolada', 'target="_blank" bilan rel="noopener".']],
    "Havola — boshqa joyga OLIB BORADI, tugma — ish BAJARADI. Shuning uchun a va button ni almashtirmang.",
    [["<a href=\"#\" onclick=\"save()\">Saqlash</a>", "<button type=\"button\">Saqlash</button>", "Bu amal, havola emas."], ["Havola matni: «bu yerga bosing».", "Matn qayerga olib borishini aytsin: «Narxlar jadvali».", "Ekran o'quvchi havolalarni alohida o'qiydi."]],
  ),
  3: E(
    "Form (to'ldiriladigan shakl) foydalanuvchidan ma'lumot yig'ib, serverga yuboradi. Har maydonning name atributi yuboriladigan kalit nomi, label esa foydalanuvchi ko'radigan va ekran o'quvchi o'qiydigan izohdir.",
    [["Login va ro'yxatdan o'tishda", "type=\"email\", type=\"password\" mos klaviatura va tekshiruv beradi."], ['Qidiruvda', 'method="get" — natija havolasini ulashsa bo\'ladi.'], ["Ma'lumot yaratishda", 'method="post" — qiymatlar so\'rov tanasida ketadi.'], ['Maydonlarni guruhlashda', 'fieldset va legend.']],
    "name yo'q maydon serverga YUBORILMAYDI. label for va input id mos bo'lsin — yozuvni bossangiz maydon faollashadi.",
    [["placeholder ni label o'rniga ishlatish.", "Alohida label qo'yish.", "Yoza boshlaganda placeholder yo'qoladi."], ["Forma ichidagi tugmaga type bermaslik va faqat ochish/yopish kutish.", "type=\"button\" yozish.", "Standart turi submit — forma yuboriladi."]],
  ),
  4: E(
    "Validation (tekshirish) — ma'lumot yuborilishidan oldin to'g'riligini tekshirish. HTML buni tayyor atributlar bilan qiladi: required, type, minlength, max, pattern. Murakkab qoida uchun Constraint Validation API bor.",
    [["Majburiy maydonda", 'required.'], ['Format talab qilinganda', 'pattern (andoza) va tushunarli izoh.'], ["Maxsus qoida bo'lsa", 'setCustomValidity bilan o\'z xabaringizni berasiz.'], ["Qulaylik uchun", 'autocomplete brauzerga mos qiymatni taklif qildiradi.']],
    "Mijoz tekshiruvi — QULAYLIK uchun, server tekshiruvi — XAVFSIZLIK uchun. Ikkalasi ham kerak.",
    [["Faqat brauzer tekshiruviga ishonish.", "Serverda ham to'liq tekshirish.", "So'rovni brauzersiz ham yuborsa bo'ladi."], ["setCustomValidity xabarini tozalamaslik.", "Qiymat to'g'rilanganda setCustomValidity('').", "Aks holda maydon doim yaroqsiz."]],
  ),
  5: E(
    "Table (jadval) ikki o'lchovli ma'lumot uchun: qatorlar va ustunlar. Media teglari (img, picture, video) rasm va videoni joylaydi, ekranga mos variantni tanlaydi va yuklanishni tejaydi.",
    [['Narxlar va hisobotda', 'table, thead, th va scope.'], ["Har xil ekranda", 'srcset va sizes — mos o\'lchamdagi rasm.'], ['Boshqa format yoki kadr kerak bo\'lsa', 'picture va source.'], ["Pastdagi rasmlarda", 'loading="lazy".']],
    "alt savoli: «Rasm ko'rinmasa, o'rniga nima deyman?» Bezak rasm bo'lsa alt=\"\".",
    [["Sahifa joylashuvini jadval bilan qilish.", "Joylashuv uchun Flexbox yoki Grid.", "Jadval — faqat ma'lumot uchun."], ["Rasmga width va height bermaslik.", "O'lchamlarni ko'rsatish.", "Rasm yuklanganda sahifa sakraydi."]],
  ),
  6: E(
    "Zamonaviy HTML ko'p interaktiv narsani JavaScriptsiz yoki kam kod bilan beradi: details — ochiladigan bo'lim, dialog — modal oyna, popover — qalqib chiquvchi oyna, template — qayta ishlatiladigan qolip.",
    [["Ko'p so'raladigan savollarda", 'details va summary.'], ['Tasdiqlash oynasida', "dialog va showModal() — fokus va Esc o'zi boshqariladi."], ['Menyu va maslahat oynasida', 'popover atributi.'], ['Begona tarkibni ko\'rsatishda', 'iframe va sandbox (cheklangan muhit).']],
    "Avval tayyor HTML element bor-yo'qligini tekshiring: u klaviatura va ekran o'quvchini o'zi qo'llab-quvvatlaydi.",
    [["Modalni oddiy div bilan yasash.", "dialog va showModal().", "Fokus boshqaruvi va Esc qo'lda yozilishi kerak bo'ladi."], ["sandbox ga allow-scripts va allow-same-origin ni birga berish.", "Faqat zarur ruxsatni berish.", "Ichki sahifa cheklovni olib tashlay oladi."]],
  ),
  7: E(
    "SEO (qidiruv tizimlari uchun optimallashtirish) — sahifaning qidiruvda topilishi va to'g'ri ko'rinishi uchun qilinadigan ishlar. Asosiysi: aniq title, meta description, semantik tuzilma, canonical manzil va tuzilgan ma'lumot.",
    [['Har sahifada', 'Noyob title va description.'], ['Ijtimoiy tarmoqda ulashishda', 'Open Graph teglari rasm va sarlavhani belgilaydi.'], ['Bir tarkib ikki manzilda bo\'lsa', 'link rel="canonical".'], ['Boyitilgan natija uchun', 'JSON-LD ko\'rinishidagi structured data.']],
    "Qidiruv roboti — ko'zi ko'rmaydigan o'quvchi: matn, sarlavha va havolalarga tayanadi.",
    [["Hamma sahifada bir xil title.", "Har sahifaga mazmuniga mos title.", "Robot sahifalarni farqlay olmaydi."], ["robots.txt bilan sahifani natijadan o'chirishga urinish.", "meta robots noindex ishlatish.", "robots.txt faqat kirib o'qishni cheklaydi."]],
  ),
};
