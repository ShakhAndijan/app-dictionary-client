// Extra tricky exercises (plausible distractors) appended to each Internet JUNIOR lesson. Used by build-dev-internet.cjs.
const ch = (prompt, answer, wrong, explain) => ({ kind: 'CHOICE', prompt, options: [answer, ...wrong], answer, explain });
const fill = (prompt, answer, explain, alsoAccept) => ({ kind: 'FILL', prompt, answer, explain, ...(alsoAccept ? { alsoAccept } : {}) });

module.exports = {
  1: [
    ch("Qaysi gap NOTO'G'RI?", "Web — internetning o'zi, ikkalasi bir xil", ["Email internetdan foydalanadi, lekin web emas", "Web internet ustida ishlaydi", "Internet web paydo bo'lishidan oldin ham bor edi"], "Internet 1960–80-yillarda paydo bo'lgan, web esa 1989–91-yillarda. Ular bir xil emas."),
    ch("Do'stingiz Telegram orqali video yubordi. Qaysi javob eng aniq?", "Internet ishlatildi, lekin brauzerdagi web sayt ochilmadi", ["Web ishlatildi, chunki ma'lumot yuborildi", "Internet ishlatilmadi, chunki bu ilova", "Faqat Wi-Fi ishlatildi, internet emas"], "Ilova ham internet orqali ishlaydi, lekin web (HTTP orqali saytlar) bu yerda shart emas."),
    ch("Router paketni uzatishda nimaga qaraydi?", "Paketdagi qabul qiluvchi manzilga", ["Paket ichidagi matn mazmuniga", "Jo'natuvchining brauzeriga", "Sayt dizayniga"], "Router faqat manzilga qarab keyingi tugunni tanlaydi, mazmun uning ishi emas."),
  ],
  2: [
    ch("Qaysi holatda brauzer SERVER vazifasini bajaradi?", "Odatda hech qachon: brauzer mijoz bo'ladi", ["Sayt ochilganda", "Rasm yuklanganda", "Sahifa yangilanganda"], "Brauzer so'rov yuboradi (mijoz). Javob beradigan tomon — server."),
    ch("Bitta kompyuter ham mijoz, ham server bo'la oladimi?", "Ha, rol dasturga qarab belgilanadi, qurilmaga emas", ["Yo'q, server faqat maxsus katta kompyuter", "Faqat Linux bo'lsa", "Faqat internetsiz holatda"], "Server — dastur roli. Noutbukingizda ham server ishga tushirib qo'yish mumkin."),
    ch("\"Server qulab tushdi\" degani nimani anglatadi?", "So'rovlarga javob beradigan dastur yoki mashina ishlamay qoldi", ["Mijozning interneti uzildi", "Brauzer yangilandi", "Domen muddati tugadi"], "Server javob bermasa, boshqa mijozlar ham saytni ocholmaydi."),
  ],
  3: [
    ch("192.168.0.15 manzili haqida to'g'ri gap qaysi?", "Bu private IP: faqat ichki tarmoqda ishlaydi", ["Bu public IP: butun dunyodan ko'rinadi", "Bu port raqami", "Bu domen nomi"], "192.168.x.x, 10.x.x.x va 172.16–31.x.x doiralari private (ichki) manzillardir."),
    ch("localhost:5173 manzilidagi 5173 nima?", "Port: qaysi dastur javob berishini bildiradi", ["Server joylashgan davlat kodi", "IP manzilning oxirgi qismi", "Fayl hajmi"], "Port — kompyuter ichidagi dastur eshigi. Vite odatda 5173 portda ishlaydi."),
    ch("HTTPS uchun standart port qaysi?", "443", ["80", "8080", "22"], "HTTP — 80, HTTPS — 443, SSH — 22. 8080 ko'pincha sinov uchun ishlatiladi."),
  ],
  4: [
    ch("HTTP stateless bo'lsa, foydalanuvchi sayt ichida qanday tanilib turadi?", "Har so'rovda cookie yoki token yuboriladi", ["Server hamma so'rovlarni avtomatik eslab qoladi", "IP manzil o'zgarmagani uchun", "Brauzer serverga avval kirganini aytmaydi"], "Server oldingini eslamaydi. Shuning uchun kimligini ko'rsatuvchi cookie yoki token qayta-qayta yuboriladi."),
    ch("Qaysi biri HTTP so'rovning (request) bir qismi EMAS?", "Status kodi", ["Metod", "Header", "Yo'l (path)"], "Status kodi javobda (response) bo'ladi. So'rovda metod, yo'l va headerlar bor."),
    ch("Javob (response) ichida odatda nima bo'ladi?", "Status kodi, headerlar va body", ["Faqat HTML fayl", "Faqat IP manzil", "Metod va yo'l"], "Javob: status qatori, headerlar va (ko'pincha) body."),
  ],
  5: [
    ch("https://shop.uz:8443/cart?id=7#top manzilida id=7 qaysi qism?", "Query (so'rov parametri)", ["Path", "Fragment", "Hostname"], "? dan keyin query boshlanadi. # dan keyin fragment."),
    ch("Fragment (#top) haqida to'g'ri gap qaysi?", "Serverga yuborilmaydi, faqat brauzer ishlatadi", ["Serverga yo'l bilan birga yuboriladi", "Port raqamini bildiradi", "Protokolni bildiradi"], "Fragment faqat brauzerda sahifa ichidagi joyga o'tish uchun xizmat qiladi."),
    ch("https://example.com/blog.html manzilida hostname qaysi?", "example.com", ["example.com/blog.html", "blog.html", "https"], "Hostname — protokoldan keyingi, yo'ldan oldingi qism."),
  ],
  6: [
    ch("Ma'lumotni faqat o'qish uchun mo'ljallangan, serverni o'zgartirmaydigan metod qaysi?", "GET", ["POST", "PUT", "DELETE"], "GET xavfsiz (safe) metod: faqat oladi."),
    ch("PUT va PATCH farqi nimada?", "PUT resursni to'liq almashtiradi, PATCH uning bir qismini o'zgartiradi", ["PUT yaratadi, PATCH o'chiradi", "Farqi yo'q", "PATCH faqat rasm yuklaydi"], "Profilda faqat telefon o'zgarsa PATCH, butun profil almashsa PUT."),
    ch("Qaysi metod idempotent EMAS?", "POST", ["GET", "PUT", "DELETE"], "POST har yuborilganda yangi resurs yaratishi mumkin. Shuning uchun ikki marta bosish xavfli."),
  ],
  7: [
    ch("Foydalanuvchi tizimga kirmagan, lekin yopiq sahifani ochmoqchi. Odatda qaysi status qaytadi?", "401", ["403", "404", "500"], "401 — kimligi noma'lum. 403 — kim ekani ma'lum, lekin ruxsat yo'q."),
    ch("Server kodida xato bor va u so'rovni bajara olmadi. Qaysi status to'g'ri?", "500", ["400", "404", "301"], "5xx — server tomoni xatosi. 4xx — mijoz tomoni."),
    ch("Qaysi status yangi resurs yaratilganini bildiradi?", "201", ["200", "204", "302"], "201 Created — POST dan keyin yangi resurs yaratilganini bildiradi. 200 — oddiy OK, 204 — body yo'q."),
  ],
  8: [
    ch("Content-Type: application/json headeri nimani bildiradi?", "Body JSON formatda ekanini", ["Sahifa JavaScript bilan yozilganini", "Server Node.js ekanini", "Foydalanuvchi tilini"], "Content-Type body formatini aytadi, shunda qabul qiluvchi uni to'g'ri o'qiydi."),
    ch("Authorization: Bearer abc123 headerida abc123 nima?", "Token: kimligingizni tasdiqlovchi belgi", ["Domen nomi", "Cookie nomi", "Fayl yo'li"], "Bearer token yuborilib, server foydalanuvchini tanib oladi."),
    ch("Cookie qayerda saqlanadi?", "Brauzerda, har so'rovda serverga qaytariladi", ["Faqat serverda", "Routerda", "DNS serverda"], "Server brauzerga Set-Cookie bilan beradi, brauzer keyin Cookie headerida qaytaradi."),
  ],
  9: [
    ch("api.example.com da api nima?", "Subdomen", ["TLD", "Protokol", "Port"], "example.com — asosiy domen, api — uning subdomeni."),
    ch("shop.example.com da TLD qaysi?", "com", ["shop", "example", "shop.example"], "TLD — eng oxirgi qism."),
    ch("Domen muddati tugasa nima bo'lishi mumkin?", "Boshqa kishi uni ro'yxatdan o'tkazib olishi mumkin", ["Domen avtomatik cheksiz uzayadi", "Sayt faqat tezlashadi", "Faqat IP manzil o'zgaradi"], "Domen ijaraga olinadi. To'lov to'xtasa, u bo'shab qolishi mumkin."),
  ],
  10: [
    ch("Domenni to'g'ridan-to'g'ri IPv4 manzilga bog'laydigan DNS yozuvi qaysi?", "A", ["CNAME", "TXT", "MX"], "A — IPv4, AAAA — IPv6, CNAME — boshqa nomga alias."),
    ch("Nega www.site.uz ni CNAME bilan boshqa domenga yo'naltirish qulay?", "Manzil o'zgarsa, faqat nishon domenni o'zgartirish yetadi", ["CNAME IP manzilni tezlashtiradi", "CNAME parolni himoya qiladi", "CNAME domenni bepul qiladi"], "CNAME nomdan nomga ishora qiladi. IP almashsa, hosting tomoni yangilaydi."),
    ch("DNS javobi keshlanganda nima bo'ladi?", "Keyingi so'rovlar tezroq javob oladi, lekin yangi o'zgarish kech ko'rinishi mumkin", ["DNS yozuvlari butunlay o'chadi", "Domen narxi tushadi", "Sayt har safar qayta quriladi"], "TTL tugaguncha eski javob ishlatiladi. Shu sababli DNS o'zgarishi tarqalishi vaqt oladi."),
  ],
  11: [
    ch("Static hostingga qaysi sayt mos EMAS?", "Har foydalanuvchi uchun serverda bazadan hisoblanadigan sahifalar", ["Portfolio sayt", "Hujjatlar sayti", "Landing page"], "Static hosting tayyor fayllarni beradi. Serverda kod ishlatish kerak bo'lsa, boshqa hosting kerak."),
    ch("Deploy oldidan build nima uchun kerak?", "Kodni production uchun optimallashtirilgan fayllarga aylantirish uchun", ["Domenni sotib olish uchun", "DNS yozuvini o'zgartirish uchun", "Brauzer keshini o'chirish uchun"], "Masalan, npm run build kodni siqadi va dist papkasini yaratadi."),
    ch("CDN nima uchun foydali?", "Fayllar foydalanuvchiga yaqin serverdan yetkaziladi", ["U kodni xatosiz qiladi", "U domenni bepul qiladi", "U brauzer o'rniga ishlaydi"], "Yaqin joydan olingan fayl kam kechikish bilan yuklanadi."),
  ],
  12: [
    ch("Brauzer sahifani qurishda qaysi tartib to'g'ri?", "HTML dan DOM, CSS dan CSSOM, keyin layout va paint", ["Avval paint, keyin HTML o'qiladi", "Avval CSS, keyin JavaScript, oxirida HTML", "Avval layout, keyin DOM"], "DOM va CSSOM birlashib render daraxtini beradi, so'ng joylashuv va chizish bo'ladi."),
    ch("DOM nima?", "HTML dan xotirada hosil bo'lgan sahifa daraxti", ["Domen nomi tizimi (DNS)", "CSS fayl", "Server papkasi"], "DOM — Document Object Model. JavaScript uni o'zgartira oladi."),
    ch("Nega katta JavaScript fayl sahifani sekinlashtirishi mumkin?", "Brauzer uni yuklab, o'qib, bajarishi kerak, bu vaqt oladi", ["JavaScript IP manzilni o'zgartiradi", "U DNS ni o'chirib qo'yadi", "U faqat serverda ishlaydi"], "Yuklash va ishlatish ikkalasi ham vaqt talab qiladi, ayniqsa sekin telefonda."),
  ],
  13: [
    ch("Brauzer manzil yozilgach, serverga ulanishdan OLDIN nimani aniqlaydi?", "Domenning IP manzilini (DNS orqali)", ["Sahifa dizaynini", "Cookie hajmini", "HTML teglarini"], "Avval DNS orqali IP topiladi, so'ng ulanish o'rnatiladi."),
    ch("Sayt sekin ochilyapti. Birinchi navbatda nima qilish to'g'ri?", "Network panelida qaysi bosqich uzoq davom etayotganini o'lchash", ["Hamma kodni qayta yozish", "Domenni o'zgartirish", "Taxmin bilan rasmlarni o'chirish"], "Avval o'lchash: DNS, server javobi yoki fayl hajmi qaysi biri sekin."),
    ch("TTFB nimani o'lchaydi?", "So'rovdan birinchi javob bayti kelguncha o'tgan vaqtni", ["Sahifa to'liq chizilgan vaqtni", "Faylning hajmini", "DNS yozuvi sonini"], "TTFB — Time To First Byte. Server va tarmoq tezligini ko'rsatadi."),
  ],
};
