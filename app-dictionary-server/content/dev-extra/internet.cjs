// Extra theory for the Internet module, keyed by lesson order.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  1: E(
    "Internet — dunyodagi kompyuter tarmoqlarini bir-biriga ulovchi infratuzilma (asosiy qurilma va aloqa yo'llari). Web esa shu infratuzilma ustida ishlaydigan xizmat: bir-biriga havola bilan bog'langan sahifalar. Frontend dasturchi aynan web uchun yozadi, lekin tagida internet qanday ishlashini bilmasa, xatolarni tushuntira olmaydi.",
    [['Sayt ochilmayotganda', "Muammo internetda (aloqa yo'q) mi yoki web serverida (sayt ishlamayapti) mi — ajratib olasiz."], ['Tezlikni tahlil qilganda', "Ma'lumot paketlarga bo'linib bir nechta router orqali o'tishini bilsangiz, kechikish qayerdan kelishini tushunasiz."], ["Suhbatda tushuntirganda", "Junior intervyuda «internet va web farqi» eng ko'p so'raladigan savollardan."]],
    "Internet — yo'l, web — shu yo'lda yuradigan transport turlaridan biri. Pochta (email) ham shu yo'ldan yuradi, lekin web emas.",
    [["Internet va web — bir narsa.", "Web — internet ustidagi xizmatlardan biri.", "Email va onlayn o'yin ham internetdan foydalanadi."], ["Ma'lumot bitta butun bo'lib uchadi.", "Ma'lumot paketlarga bo'linadi va qayta yig'iladi.", "Har bir paket boshqa yo'ldan ketishi mumkin."]],
  ),
  2: E(
    "Client-server — webning asosiy modeli: bir tomon so'raydi (mijoz), ikkinchi tomon javob beradi (server). Mijoz odatda brauzer yoki mobil ilova, server esa doim yoqilgan va so'rov kutib turgan dastur. Bu rollar kompyuterning turiga emas, suhbatdagi vazifasiga bog'liq.",
    [['Frontend va backendni ajratishda', "Brauzerda ishlaydigan kod — mijoz tomoni, ma'lumotlar bazasi bilan ishlaydigan kod — server tomoni."], ['Lokal ishlab chiqishda', 'npm run dev kompyuteringizda server ochadi, brauzer esa unga mijoz bo\'lib ulanadi.'], ['Xavfsizlik haqida o\'ylaganda', "Mijozdagi kodni foydalanuvchi ko'ra oladi va o'zgartira oladi, shuning uchun tekshiruv serverda ham bo'lishi shart."]],
    "Kim birinchi gapirsa — o'sha mijoz. Oddiy HTTP da server hech qachon suhbatni o'zi boshlamaydi.",
    [["Maxfiy kalitni frontend kodiga yozish.", "Maxfiy kalit faqat serverda saqlanadi.", "Brauzerdagi har narsani ko'rish mumkin."], ["Server — bu albatta katta maxsus kompyuter.", "Server — so'rov kutuvchi dastur.", "Oddiy noutbuk ham server bo'la oladi."]],
  ),
  3: E(
    "IP address (tarmoq manzili) kompyuterni tarmoqda topish uchun, port (dastur eshigi raqami) esa shu kompyuterdagi aniq dasturni topish uchun kerak. Ikkalasi birga «qaysi uyning qaysi eshigi» degan to'liq manzilni beradi.",
    [['Lokal serverga kirishda', 'localhost:5173 — bu kompyuterning o\'zi, 5173-eshikdagi dastur.'], ['Ikki dastur to\'qnashganda', '«Port is already in use» xatosi: bu eshikni boshqa dastur egallab turibdi.'], ['Telefonda sinab ko\'rishda', "Kompyuteringizning ichki IP manzili orqali bir xil Wi-Fi dagi telefondan ochasiz."]],
    "IP — uy manzili, port — xonadon raqami. 80 — HTTP, 443 — HTTPS (brauzer ularni yozmasa ham biladi).",
    [["localhost havolasini do'stga yuborish.", "localhost faqat o'z kompyuteringizni bildiradi.", "Tashqariga ochish uchun deploy kerak."], ["Ichki 192.168.x.x manzil internetdan ko'rinadi.", "Ichki manzil faqat lokal tarmoqda ishlaydi.", "Tashqariga router NAT orqali chiqaradi."]],
  ),
  4: E(
    "HTTP — mijoz va server gaplashadigan matnli protocol (aloqa qoidalari). Har suhbat ikki xabardan iborat: so'rov (usul, manzil, sarlavhalar, tana) va javob (status kodi, sarlavhalar, tana). HTTP stateless: server oldingi so'rovni o'zi eslab qolmaydi.",
    [['API bilan ishlaganda', "fetch yozganda aslida HTTP so'rov tuzasiz: usul, header va body ni tanlaysiz."], ['Xatoni izlaganda', "DevTools → Network bo'limida so'rov va javobni to'liq ko'rasiz."], ['Login tizimida', "Stateless bo'lgani uchun foydalanuvchini har so'rovda cookie yoki token orqali tanitish kerak."]],
    "Har so'rov — yangi tanishuv. Server sizni faqat so'rov bilan birga yuborgan «guvohnoma» orqali taniydi.",
    [["Server avvalgi so'rovni eslab qoladi deb o'ylash.", "Har so'rovda kerakli ma'lumotni qayta yuborish.", "HTTP stateless."], ["HTTPS — boshqa protokol.", "HTTPS — o'sha HTTP, faqat shifrlangan kanal (TLS) ichida.", "So'rov tuzilishi bir xil."]],
  ),
  5: E(
    "URL — internetdagi resursning to'liq manzili. U bir nechta qismdan tuziladi va har qismning o'z vazifasi bor: qaysi protokol, qaysi server, qaysi port, qaysi sahifa, qanday parametrlar va sahifaning qaysi joyi.",
    [['Routing yozganda', 'React Router va shunga o\'xshash vositalar pathname ga qarab sahifa tanlaydi.'], ['Filtr va qidiruvda', "?page=2&sort=price kabi query parametrlar holatni havolada saqlaydi."], ['Havolani tahlil qilishda', "new URL(manzil) obyektidan hostname, pathname, searchParams ni o'qiysiz."]],
    "Tartib: protokol → domen → port → yo'l → ?so'rov → #bo'lak. # dan keyingi qism serverga yuborilmaydi.",
    [["Maxfiy ma'lumotni query ga qo'yish.", "Parol va tokenni header yoki body da yuborish.", "URL tarixda va server jurnalida qoladi."], ["Bo'sh joyli qiymatni to'g'ridan-to'g'ri ulash.", "encodeURIComponent yoki URLSearchParams ishlatish.", "Maxsus belgilar kodlanishi shart."]],
  ),
  6: E(
    "HTTP method (so'rov usuli) server bilan NIMA qilmoqchi ekaningizni bildiradi: o'qish, yaratish, yangilash yoki o'chirish. To'g'ri usul tanlansa, API tushunarli va xavfsiz bo'ladi, brauzer hamda proksilar ham to'g'ri ishlaydi.",
    [["Ma'lumot olishda", 'GET — hech narsani o\'zgartirmaydi, keshlanishi mumkin.'], ['Yangi yozuv yaratishda', 'POST — har chaqiruvda yangi natija yaratishi mumkin.'], ['Yangilashda', "PUT — to'liq almashtiradi, PATCH — faqat ko'rsatilgan maydonlarni o'zgartiradi."], ["O'chirishda", 'DELETE — takrorlansa ham natija bir xil: yozuv yo\'q.']],
    "Safe — hech narsani o'zgartirmaydi (GET). Idempotent — ikki marta bossangiz ham natija bir xil (GET, PUT, DELETE). POST esa ikki marta bosilsa ikkita buyurtma yaratishi mumkin.",
    [["O'chirish uchun GET ishlatish.", "DELETE ishlatish.", "GET havolalarini bot va brauzer o'zi ochib yuborishi mumkin."], ["«Yuborish» tugmasini bloklamay POST jo'natish.", "So'rov ketayotganda tugmani o'chirib qo'yish.", "Ikki marta bosish dublikat yaratadi."]],
  ),
  7: E(
    "Status code (javob holati raqami) so'rov natijasini bir qarashda aytadi. Birinchi raqam guruhni bildiradi: 2xx — muvaffaqiyat, 3xx — boshqa manzilga yo'naltirish, 4xx — mijoz xatosi, 5xx — server xatosi.",
    [['fetch natijasini tekshirishda', "response.ok faqat 200–299 oralig'ida true bo'ladi."], ['Foydalanuvchiga xabar berishda', '401 — qayta login, 403 — ruxsat yo\'q, 404 — topilmadi, 500 — birozdan keyin urinib ko\'ring.'], ['Xatoni kimdan izlashni bilishda', "4xx bo'lsa so'rovingizni, 5xx bo'lsa server jurnalini tekshirasiz."]],
    "401 — «Kimsan?», 403 — «Taniyman, lekin mumkin emas», 404 — «Bunday narsa yo'q».",
    [["fetch 404 da o'zi xato tashlaydi deb o'ylash.", "if (!response.ok) bilan tekshirish.", "fetch faqat tarmoq xatosida reject bo'ladi."], ["Xatoda ham 200 qaytarib, ichiga error yozish.", "Mos 4xx yoki 5xx kodini qaytarish.", "Mijoz va monitoring chalg'iydi."]],
  ),
  8: E(
    "Header — so'rov yoki javob bilan birga yuboriladigan qo'shimcha ma'lumot (nom: qiymat juftligi). Body xatning o'zi bo'lsa, header konvertdagi yozuv: tarkib turi, tili, kimligi, keshlash qoidasi.",
    [["JSON yuborishda", "Content-Type: application/json — server tanani to'g'ri o'qiydi."], ['Himoyalangan API da', 'Authorization: Bearer token — kimligingizni bildiradi.'], ['Keshni boshqarishda', 'Cache-Control javobni qancha saqlash mumkinligini aytadi.'], ['CORS xatosini tuzatishda', 'Access-Control-Allow-Origin ni SERVER qo\'yadi.']],
    "Header nomlari katta-kichik harfga sezgir emas: content-type va Content-Type bir xil.",
    [["CORS xatosini frontend header bilan tuzatishga urinish.", "Ruxsat headerini serverga qo'shish.", "Bu javob headeri, uni mijoz bera olmaydi."], ["Content-Type siz JSON.stringify yuborish.", "Content-Type ni aniq ko'rsatish.", "Server tanani oddiy matn deb o'qishi mumkin."]],
  ),
  9: E(
    "Domain (domen nomi) — raqamli IP manzil o'rniga odam eslab qoladigan nom. U o'ngdan chapga o'qiladi: avval TLD (.uz, .com), keyin asosiy nom, keyin subdomain (api., www.).",
    [['Loyihani ommaga chiqarishda', 'Registrar (domen sotuvchi) dan nom ijaraga olasiz.'], ['Xizmatlarni ajratishda', "api.site.uz, admin.site.uz kabi subdomenlar alohida serverlarga yo'naltiriladi."], ['Cookie va CORS da', "Subdomen boshqa bo'lsa, brauzer uni boshqa origin (manba) deb hisoblaydi."]],
    "Domen sotib olinmaydi, ijaraga olinadi: muddati tugasa va to'lamasangiz, uni boshqa odam olishi mumkin.",
    [["Domen sotib olsam sayt o'zi paydo bo'ladi.", "Domendan tashqari hosting va DNS sozlash kerak.", "Domen — faqat nom."], ["www.site.uz va site.uz doim bir xil ishlaydi.", "Ikkalasi uchun DNS yozuvi yoki redirect sozlash.", "Aslida ular alohida nomlar."]],
  ),
  10: E(
    "DNS (domen nomlari tizimi) — domen nomini IP manzilga aylantiruvchi dunyo bo'ylab tarqalgan «telefon daftari». Yozuv turlari har xil savolga javob beradi: A — qaysi IPv4, CNAME — qaysi boshqa nomga qarang, TXT — qo'shimcha matn.",
    [['Domenni serverga ulashda', 'A yozuvi qo\'yib, server IP manzilini ko\'rsatasiz.'], ['Platformaga ulashda', "CNAME bilan o'z nomingizni platforma bergan nomga yo'naltirasiz."], ['Egalikni isbotlashda', 'Email va boshqa xizmatlar TXT yozuvi qo\'shishni so\'raydi.']],
    "DNS o'zgarishi darhol ko'rinmaydi: eski javob TTL (saqlash muddati) tugaguncha keshda turadi.",
    [["CNAME ga IP manzil yozish.", "IP uchun A (yoki AAAA) yozuvi.", "CNAME faqat boshqa nomni ko'rsatadi."], ["Yozuvni o'zgartirib, bir daqiqada ishlamasa qayta-qayta o'zgartirish.", "TTL muddatini kutish va nslookup bilan tekshirish.", "Kesh sababli eski javob turadi."]],
  ),
  11: E(
    "Hosting — saytingiz fayllari va dasturi doim yoqilgan serverda turadigan xizmat. Deploy (serverga joylash) — kodni o'sha yerga chiqarish jarayoni: odatda build (yig'ish) qilinadi, keyin natija serverga ko'chiriladi.",
    [['Statik saytda', "HTML, CSS, JS fayllar CDN dan tarqatiladi — arzon va tez."], ['Server kodi bor loyihada', "Doim ishlab turadigan server yoki konteyner kerak."], ['Jamoada ishlaganda', "main ga push qilinganda avtomatik deploy (CI/CD) sozlanadi."]],
    "Kompyuteringizda ishlashi yetarli emas: boshqalar ko'rishi uchun build + hosting + domen kerak.",
    [["node_modules va .env ni serverga ko'chirish.", "Faqat kerakli fayllar; maxfiy qiymatlar server sozlamasida.", "Maxfiy ma'lumot oshkor bo'ladi."], ["src papkasini to'g'ridan-to'g'ri joylash.", "Avval npm run build, keyin dist/ ni joylash.", "Brauzer manba kodni o'qiy olmasligi mumkin."]],
  ),
  12: E(
    "Brauzer — HTML, CSS va JavaScript ni olib, ekranga chizadigan dastur. U HTML dan DOM daraxtini, CSS dan CSSOM daraxtini quradi, ikkalasini birlashtirib joylashuvni hisoblaydi va piksellarni chizadi.",
    [['Sahifa sekin ochilganda', "Qaysi fayl chizishni to'xtatib turganini (render-blocking) topasiz."], ['Script joylashtirishda', 'defer yoki type="module" HTML o\'qilishini to\'xtatmaydi.'], ['Animatsiyada', "O'lchamni o'zgartirish qayta joylashtirishni chaqiradi, transform esa yengilroq."]],
    "Zanjir: HTML → DOM, CSS → CSSOM, keyin render tree → layout → paint → composite.",
    [["Katta scriptni head ga defer'siz qo'yish.", "defer qo'shish yoki type=\"module\".", "Parser script yuklanguncha to'xtaydi."], ["DOM — bu HTML faylning o'zi.", "DOM — HTML dan qurilgan, JS o'zgartira oladigan obyektlar daraxti.", "DevTools DOM ni ko'rsatadi, fayl matnini emas."]],
  ),
  13: E(
    "«URL yozib Enter bosganda nima bo'ladi» — butun modulni birlashtiruvchi savol: URL tahlili → DNS → TCP va TLS ulanishi → HTTP so'rov → javob → HTML o'qish → qo'shimcha fayllar → chizish → JavaScript ishga tushishi.",
    [['Intervyuda', 'Bu — eng mashhur savol; bosqichlarni tartib bilan aytish kutiladi.'], ['Tezlikni yaxshilashda', 'Qaysi bosqich uzoqligini aniqlab, aynan o\'shani tuzatasiz (DNS, TTFB, render).'], ['Muammoni lokalizatsiya qilishda', "«Server topilmadi» — DNS, «ulanmadi» — tarmoq yoki port, «500» — server kodi."]],
    "Qisqacha: Nom → Manzil → Ulanish → So'rov → Javob → Chizish.",
    [["Brauzer avval HTTP so'rov yuboradi, keyin DNS qidiradi.", "Avval DNS orqali IP topiladi, keyin ulanish va so'rov.", "Manzilsiz so'rov yuborib bo'lmaydi."], ["Bitta so'rov bilan butun sahifa keladi.", "HTML kelgach, CSS, JS va rasmlar uchun alohida so'rovlar ketadi.", "Network bo'limida o'nlab so'rov ko'rinadi."]],
  ),
};
