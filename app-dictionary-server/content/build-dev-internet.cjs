// Builds resources/dev/frontend-internet-junior.json (Frontend course, module "Internet", level JUNIOR).
// Source of the material: roadmap "1-bo'lim: Internet" (roadmap.sh/frontend). Run: node content/build-dev-internet.cjs
//
// Lesson shape: { code, level, module, order, title, intro, theory, practice, items }
//   theory:   { analogy:{icon,title,text}, sections:[{heading,text?,bullets?,table?:{head,rows},code?:{lang,text},flow?,callout?:{kind,text}}], recap:[] }
//   practice: [{ title, text, cmd? }]   hands-on tasks done outside the app
//   items:    CHOICE / FILL / ORDER exercises (see LearnItem)
const fs = require('fs');
const path = require('path');

const L = [];
let n = 0;
function lesson(o) {
  n += 1;
  const code = `fe-internet-jr-${String(n).padStart(2, '0')}`;
  const items = o.items.map((it, i) => ({ id: String(i + 1), ...it }));
  L.push({ code, level: 'JUNIOR', module: 'internet', order: n, title: o.title, intro: o.intro, theory: o.theory, practice: o.practice || [], items });
}
const ch = (prompt, answer, wrong, explain) => ({ kind: 'CHOICE', prompt, options: [answer, ...wrong], answer, explain });
const fill = (prompt, answer, explain, alsoAccept) => ({ kind: 'FILL', prompt, answer, explain, ...(alsoAccept ? { alsoAccept } : {}) });
// Multi-word steps stay one chip: their inner spaces are non-breaking so the loader sees single words.
const order = (prompt, steps, explain) => { const w = steps.map((x) => x.replace(/ /g, ' ')); return { kind: 'ORDER', prompt, words: w, answer: w.join(' '), explain }; };

/* 1 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Internet va web: farqi nimada',
  intro: "Internet nima, web nima va ular nega bir narsa emas.",
  theory: {
    analogy: { icon: '📮', title: 'Pochta tizimi', text: "Xat yuborish uchun manzil kerak. Xat bir nechta pochta bo'limidan o'tadi va hech bir bo'lim butun yo'lni bilmaydi: u xatni faqat keyingi to'g'ri bo'limga uzatadi. Internetda xat o'rnida paket, pochta bo'limi o'rnida router, uy manzili o'rnida IP manzil bor." },
    sections: [
      { heading: 'Internet: tarmoqlar tarmog\'i', text: "Internet dunyodagi millionlab kompyuter tarmoqlarini bir-biriga ulaydigan katta tarmoq. Uyingizdagi Wi-Fi bitta kichik tarmoq, provayderingiz tarmog'i undan kattaroq, Google va banklarning data markazlari esa alohida tarmoqlar. Internet ularni umumiy qoidalar bilan bog'laydi." },
      { heading: 'Internet va web bir narsa emas', table: { head: ['', 'Nima', 'Misol'], rows: [['Internet', 'Infratuzilma: kabellar, routerlar, uzatish qoidalari', 'Optik kabel, Wi-Fi, router'], ['Web', "Internet ustida ishlaydigan xizmat: saytlar, havolalar, HTTP", 'google.com, wikipedia.org'], ['Boshqalar', 'Internetdan foydalanadi, lekin web emas', 'Email, onlayn o\'yin, video qo\'ng\'iroq']] } },
      { callout: { kind: 'tip', text: "\"Bulut\" degani sehr emas: bu boshqa birovning data markazidagi haqiqiy kompyuter." } },
    ],
    recap: ["Internet — tarmoqlar tarmog'i, ya'ni infratuzilma.", "Web — internet ustidagi xizmatlardan biri.", "Ma'lumot paketlarga bo'linib, routerlar orqali yetib boradi."],
  },
  practice: [{ title: "Paket yo'lini ko'ring", text: "Terminalda google.com gacha paket qaysi routerlardan o'tishini ko'ring. Har bir qator — bitta hop.", cmd: 'tracert google.com   (macOS/Linux: traceroute google.com)' }],
  items: [
    ch("Internet deb nimaga aytiladi?", "Millionlab tarmoqlarni bir-biriga ulaydigan katta tarmoq", ["Faqat saytlar to'plami", "Google'ning serverlari", "Brauzer dasturi"], "Internet — tarmoqlar tarmog'i (network of networks)."),
    ch("Quyidagilardan qaysi biri web HAMDA internet xizmati, lekin email emas?", "Sayt ochish (HTTP orqali)", ["Email yuborish", "Video qo'ng'iroq", "Onlayn o'yin"], "Web — saytlar va HTTP. Email, o'yin va video qo'ng'iroq internetdan foydalanadi, lekin web emas."),
    ch("Pochta analogiyasida pochta bo'limi internetda nimaga to'g'ri keladi?", 'Router', ['Brauzer', 'Domen', 'Cookie'], "Router paketni keyingi to'g'ri tugunga uzatadi, butun yo'lni bilmaydi."),
    ch("Pochta analogiyasida uy manzili nimaga to'g'ri keladi?", 'IP manzil', ['Parol', 'Brauzer', 'Fayl nomi'], "IP manzil paket qayerga borishini belgilaydi."),
    fill("Katta ma'lumot internetda kichik bo'laklarga bo'linib yuboriladi. Bu bo'laklar nima deb ataladi? (bitta so'z, inglizcha)", 'packet', "Ma'lumot paketlarga (packet) bo'linadi.", ['paket', 'packet']),
    ch("\"Bulut\" (cloud) aslida nima?", "Boshqa birovning data markazidagi haqiqiy kompyuterlar", ["Havodagi maxsus tarmoq", "Brauzerning ichki xotirasi", "Sun'iy yo'ldosh"], "Bulut — boshqalarning data markazidagi serverlar."),
    ch("Uyingizdagi Wi-Fi tarmog'i nima?", "Internetni tashkil etuvchi kichik tarmoqlardan biri", ["Butun internet", "Web-sayt", "Server"], "Internet shunday kichik va katta tarmoqlarning birikmasidir."),
    ch("Web va internet haqida qaysi gap to'g'ri?", "Web — internet ustida ishlaydigan xizmat", ["Web va internet bir xil narsa", "Internet — web ning bir qismi", "Web — kabellar va routerlar"], "Internet — infratuzilma, web — shu infratuzilmadagi xizmat."),
  ],
});

/* 2 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Mijoz va server',
  intro: "So'rov yuboruvchi va javob beruvchi: client-server modeli.",
  theory: {
    analogy: { icon: '🍽️', title: 'Restoran', text: "Siz mijozsiz, ofitsiant so'rovingizni oshxonaga olib boradi, oshxona ovqat tayyorlaydi. Oshxona ichida nima bo'layotganini ko'rmaysiz, faqat tayyor taomni olasiz. Brauzer ham serverning ichki ishini ko'rmaydi, faqat javobni oladi." },
    sections: [
      { heading: 'Ikki rol', bullets: ["Mijoz (client) so'rov yuboradi. Frontendda mijoz odatda brauzer, ba'zan mobil ilova yoki curl buyrug'i.", "Server so'rovni qabul qilib qayta ishlaydi va javob qaytaradi. U sehrli mashina emas: tarmoqqa ulangan, so'rovlarni kutib turgan dastur."] },
      { flow: ['Brauzer (mijoz)', "So'rov →", 'Server', '← Javob', 'Brauzer'] },
      { heading: 'Bitta kompyuter ikkala rolda ham bo\'lishi mumkin', text: "npm run dev buyrug'i kompyuteringizda Vite serverini ishga tushiradi, brauzeringiz esa localhost:5173 ga mijoz sifatida murojaat qiladi. Ya'ni siz ham mijoz, ham server egasisiz." },
      { callout: { kind: 'info', text: "Server o'zidan-o'zi xabar yubormaydi: avval so'rov bo'lishi kerak. Real vaqtli aloqa uchun boshqa vositalar bor (keyingi darajalarda)." } },
    ],
    recap: ["Mijoz so'raydi, server javob beradi.", "Brauzer — eng keng tarqalgan mijoz.", "Bitta kompyuter ham mijoz, ham server bo'lishi mumkin."],
  },
  practice: [{ title: "Mijoz bo'lib ko'ring", text: "curl brauzersiz ham mijoz ekanini ko'rsatadi: u so'rov yuboradi va javobni terminalga chiqaradi.", cmd: 'curl https://example.com' }],
  items: [
    ch("Client-server modelida so'rovni kim yuboradi?", 'Mijoz (client)', ['Server', 'Router', 'DNS'], "So'rovni mijoz yuboradi, server javob qaytaradi."),
    ch("Frontendda mijoz odatda nima bo'ladi?", 'Brauzer', ['Ma\'lumotlar bazasi', 'Router', 'Kabel'], "Frontendda mijoz ko'pincha brauzer."),
    ch("Server nima?", "Tarmoqqa ulangan, so'rovlarni kutib turgan dastur", ["Faqat maxsus qimmat kompyuter", "Brauzerning bir qismi", "Internet kabeli"], "Server — sehr emas, oddiy dastur."),
    ch("Restoran analogiyasida oshxona nimaga o'xshaydi?", 'Server', ['Brauzer', 'Mijoz', 'Foydalanuvchi'], "Oshxona so'rovni qayta ishlaydi, mijoz uning ichini ko'rmaydi."),
    ch("Kompyuteringizda npm run dev ishga tushsa, brauzer nima rolda bo'ladi?", 'Mijoz', ['Server', 'Router', 'Registrar'], "Brauzer localhost:5173 ga mijoz sifatida murojaat qiladi."),
    order("So'rov-javob tartibini tuzing.", ['Mijoz', "so'rov yuboradi", 'server', 'javob qaytaradi'], "Avval mijoz so'raydi, keyin server javob beradi."),
    ch("Server o'zidan-o'zi mijozga HTTP javob yuboradimi?", "Yo'q, avval so'rov bo'lishi kerak", ['Ha, istalgan paytda', "Faqat kechasi", "Faqat Wi-Fi bilan"], "HTTP da avval so'rov, keyin javob."),
    ch("Quyidagilardan qaysi biri mijoz bo'la OLADI?", 'curl buyrug\'i', ['Faqat Chrome', 'Faqat telefon', 'Faqat Google'], "Brauzer, mobil ilova va curl — hammasi mijoz."),
  ],
});

/* 3 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'IP manzil va port',
  intro: "Qurilma manzili (IP) va undagi xizmat raqami (port).",
  theory: {
    analogy: { icon: '🏢', title: 'Bino va xonadon', text: "IP manzil binoning manziliga o'xshaydi: paket qaysi kompyuterga borishini aytadi. Port esa xonadon raqami: shu kompyuterda qaysi dastur javob berishini belgilaydi." },
    sections: [
      { heading: 'IPv4 va IPv6', table: { head: ['', 'Hajmi', 'Misol'], rows: [['IPv4', '32 bit (taxminan 4,3 mlrd variant, deyarli tugagan)', '142.250.74.46'], ['IPv6', '128 bit (amalda cheksiz)', '2606:4700:4700::1111']] } },
      { heading: 'Public va private manzillar', text: "Uyingizdagi telefon va noutbukda 192.168.x.x kabi ichki (private) manzil bor. Ular internetga routeringizning bitta umumiy public IP manzili orqali chiqadi. Routerning bu ishi NAT deyiladi.", callout: { kind: 'tip', text: "127.0.0.1 yoki localhost — kompyuterning o'ziga qaytadigan maxsus manzil." } },
      { heading: 'Mashhur portlar', table: { head: ['Port', 'Xizmat', 'Izoh'], rows: [['80', 'HTTP', 'Shifrlanmagan web'], ['443', 'HTTPS', 'Shifrlangan web'], ['53', 'DNS', 'Domenni IP ga aylantirish'], ['22', 'SSH', 'Serverga xavfsiz kirish'], ['5432', 'PostgreSQL', "Ma'lumotlar bazasi"], ['3000, 5173', 'Dev serverlar', "Next.js va Vite'ning odatiy portlari"]] } },
      { callout: { kind: 'info', text: "https://example.com deb yozganingizda portni ko'rsatmaysiz: brauzer HTTPS uchun avtomatik 443 ni ishlatadi." } },
    ],
    recap: ["IP — qurilma manzili, port — undagi dastur raqami.", "HTTP 80, HTTPS 443, DNS 53, SSH 22.", "127.0.0.1 / localhost — o'z kompyuteringiz."],
  },
  practice: [{ title: 'Manzilingizni ko\'ring', text: "Kompyuteringizning ichki IP manzilini toping. Keyin saytda \"mening IP manzilim\" deb qidirib public manzilni solishtiring.", cmd: 'ipconfig   (macOS/Linux: ifconfig yoki ip a)' }],
  items: [
    ch("IP manzil nima uchun kerak?", "Paket qaysi qurilmaga borishini belgilaydi", ["Saytga parol qo'yadi", "Faylni siqadi", "Rasmni chizadi"], "IP manzil — tarmoqdagi qurilma manzili."),
    fill("HTTPS uchun standart port raqami nechta?", '443', "HTTPS — 443, HTTP — 80."),
    fill("Shifrlanmagan HTTP uchun standart port raqami nechta?", '80', "HTTP — 80."),
    ch("DNS qaysi portda ishlaydi?", '53', ['22', '80', '5432'], "DNS — 53."),
    ch("SSH (serverga xavfsiz kirish) porti qaysi?", '22', ['53', '443', '3000'], "SSH — 22."),
    ch("Qaysi manzil kompyuterning o'ziga qaytadi?", '127.0.0.1', ['192.168.0.1', '8.8.8.8', '255.255.255.255'], "127.0.0.1 (localhost) — loopback manzil."),
    ch("Uydagi barcha qurilmalar internetga bitta public IP orqali chiqadi. Routerning bu ishi nima deyiladi?", 'NAT', ['DNS', 'HTTP', 'CDN'], "NAT ichki manzillarni umumiy public IP ga o'giradi."),
    ch("IP manzil binoga o'xshasa, port nimaga o'xshaydi?", 'Xonadon raqami', ["Bino rangi", "Ko'cha nomi", "Pochta markasi"], "Port shu kompyuterdagi dasturni aniqlaydi."),
    ch("IPv6 ning asosiy afzalligi nima?", "Manzillar soni amalda cheksiz", ["Tezroq ishlaydi, chunki kabel boshqa", "Faqat telefon uchun", "Parolsiz ishlaydi"], "IPv4 manzillari deyarli tugagan, IPv6 128 bitli."),
  ],
});

/* 4 ------------------------------------------------------------------------------------------ */
lesson({
  title: "HTTP: so'rov va javob",
  intro: "Brauzer va server qanday gaplashadi.",
  theory: {
    analogy: { icon: '🙋', title: "Har safar yangi ofitsiant", text: "HTTP stateless: har bir so'rov mustaqil, server oldingisini eslab qolmaydi. Xuddi har safar sizni birinchi marta ko'rayotgan ofitsiantga o'xshaydi. Shuning uchun kimligingizni har so'rovda bildirish kerak." },
    sections: [
      { heading: 'HTTP nima', text: "HTTP (HyperText Transfer Protocol) — brauzer va server orasidagi muloqot qoidalari. Naqsh oddiy: mijoz request yuboradi, server response qaytaradi." },
      { heading: "So'rov (request) ko'rinishi", code: { lang: 'http', text: 'GET /api/users/42 HTTP/1.1\nHost: api.example.com\nAccept: application/json' } },
      { heading: 'Javob (response) ko\'rinishi', code: { lang: 'http', text: 'HTTP/1.1 200 OK\nContent-Type: application/json\nContent-Length: 34\n\n{"id":42,"name":"Ali","age":27}' } },
      { table: { head: ['', 'Qismlari'], rows: [["So'rov", "metod (GET), yo'l (/api/users/42), header'lar, ixtiyoriy body"], ['Javob', "status kodi (200), header'lar, body"]] } },
    ],
    recap: ["HTTP: mijoz so'raydi, server javob beradi.", "So'rov: metod + yo'l + header + body.", "Javob: status + header + body.", "HTTP stateless: har so'rov mustaqil."],
  },
  practice: [{ title: "Haqiqiy so'rov va javobni ko'ring", text: "-v bayrog'i yuborilgan so'rovni va kelgan javobni to'liq ko'rsatadi.", cmd: 'curl -v https://example.com' }],
  items: [
    ch("HTTP nimaning qisqartmasi?", 'HyperText Transfer Protocol', ['High Transfer Text Process', 'Home Tool Transfer Protocol', 'HyperText Terminal Page'], "HyperText Transfer Protocol."),
    ch("HTTP ning asosiy naqshi qaysi?", "Mijoz so'rov yuboradi, server javob qaytaradi", ["Server so'rov yuboradi, mijoz javob beradi", "Ikkalasi bir vaqtda gapiradi", "Faqat brauzer ishlaydi"], "Request → response."),
    ch("\"HTTP stateless\" nimani anglatadi?", "Server oldingi so'rovni avtomatik eslab qolmaydi", ["Server hech qachon o'chmaydi", "Protokol faqat matn yuboradi", "So'rovlar shifrlanadi"], "Har so'rov mustaqil, shuning uchun kimlik har safar yuboriladi."),
    ch("Javobning (response) birinchi muhim qismi qaysi?", 'Status kodi', ['Metod', "So'rov yo'li", 'Host nomi'], "Javob status kodi (masalan, 200) bilan boshlanadi."),
    ch("Qaysi biri faqat so'rovda bo'ladi?", "Metod (masalan, GET)", ['Status kodi', 'Javob body', 'Content-Length javobda'], "Metod so'rovning qismi, status kodi esa javobning."),
    order("HTTP javob qatorini tartiblang: versiya, status kodi, matn.", ['HTTP/1.1', '200', 'OK'], "Javobning birinchi qatori: HTTP/1.1 200 OK."),
    fill("GET /api/users/42 so'rovida \"/api/users/42\" qismi nima deb ataladi? (inglizcha, bitta so'z)", 'path', "Bu so'rovning yo'li (path).", ['path', "yo'l"]),
    ch("Server kimligingizni har so'rovda eslamasa, foydalanuvchi holati qanday saqlanadi?", "Cookie yoki token orqali har so'rovda yuboriladi", ["Brauzer o'chirilmaydi", "IP manzil o'zgarmaydi", "Server o'zi taxmin qiladi"], "Stateless protokolda kimlik har so'rov bilan birga keladi."),
  ],
});

/* 5 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'URL tuzilishi',
  intro: "Manzil qismlarga qanday bo'linadi.",
  theory: {
    analogy: { icon: '🧭', title: 'To\'liq pochta manzili', text: "Pochta manzili mamlakat, shahar, ko'cha va uy raqamidan iborat. URL ham shunday: protokol, domen, port, yo'l va qo'shimcha parametrlar." },
    sections: [
      { heading: 'Qismlarga ajratamiz', code: { lang: 'text', text: 'https://api.example.com:8443/users/42?tab=posts&sort=new#comments\n└─┬─┘   └───────┬───────┘└─┬─┘└───┬────┘└────────┬───────┘└───┬────┘\nprotocol      hostname  port  pathname      query         fragment' } },
      { table: { head: ['Qism', 'Ma\'nosi', 'Misolda'], rows: [['protocol', 'Qanday gaplashamiz', 'https:'], ['hostname', 'Qaysi server (domen)', 'api.example.com'], ['port', 'Serverdagi xizmat', '8443'], ['pathname', 'Qaysi resurs', '/users/42'], ['query', "Qo'shimcha parametrlar", '?tab=posts&sort=new'], ['fragment', 'Sahifa ichidagi joy', '#comments']] } },
      { heading: "JavaScript'da URL klassi", code: { lang: 'js', text: "const url = new URL('https://api.example.com:8443/users/42?tab=posts#comments');\nurl.hostname;                 // 'api.example.com'\nurl.pathname;                 // '/users/42'\nurl.searchParams.get('tab');  // 'posts'" } },
      { callout: { kind: 'warn', text: "#fragment qismi serverga umuman yuborilmaydi: u faqat brauzerda ishlaydi." } },
    ],
    recap: ["URL: protocol, hostname, port, pathname, query, fragment.", "Query ? bilan boshlanadi, fragment # bilan.", "Fragment serverga yuborilmaydi.", "URL ni qo'lda kesmang, URL klassidan foydalaning."],
  },
  practice: [{ title: 'URL klassini sinang', text: "Brauzer konsolida (F12 → Console) o'zingiz yoqtirgan URL ni qismlarga ajrating.", cmd: "new URL('https://shop.example.com:8443/cart?id=7#total')" }],
  items: [
    fill("https://shop.example.com:8443/cart?id=7#total manzilida port raqami nechta?", '8443', "Port — domendan keyin ikki nuqtadan keyingi raqam."),
    fill("Shu manzilda pathname qaysi? (masalan /abc ko'rinishida yozing)", '/cart', "Pathname — porttan keyingi yo'l: /cart.", ['/cart']),
    fill("Shu manzilda hostname nima?", 'shop.example.com', "Hostname — protokoldan keyingi domen qismi."),
    ch("Shu manzilda query qismi qaysi?", '?id=7', ['#total', '/cart', ':8443'], "Query ? bilan boshlanadi."),
    ch("Qaysi qism serverga yuborilmaydi?", "Fragment (#total)", ['Query (?id=7)', 'Pathname (/cart)', 'Hostname'], "Fragment faqat brauzerda ishlaydi."),
    ch("https://example.com manzilida port ko'rsatilmagan. Qaysi port ishlatiladi?", '443', ['80', '3000', '8080'], "HTTPS uchun brauzer avtomatik 443 ni ishlatadi."),
    ch("new URL('https://a.com/x?q=1').searchParams.get('q') nima qaytaradi?", "'1'", ["'q'", "'a.com'", 'undefined'], "searchParams query parametrlarini o'qiydi."),
    ch("Query parametrlari qaysi belgi bilan boshlanadi?", 'Savol belgisi (?)', ['Panjara (#)', 'Slesh (/)', 'Ikki nuqta (:)'], "Query ? dan boshlanadi, parametrlar & bilan ajratiladi."),
  ],
});

/* 6 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'HTTP metodlari',
  intro: "GET, POST, PUT, PATCH, DELETE: qaysi biri qachon.",
  theory: {
    analogy: { icon: '📝', title: 'Buyurtma turlari', text: "Menyuni ko'rish (GET), yangi buyurtma berish (POST), buyurtmani butunlay almashtirish (PUT), bitta taomni o'zgartirish (PATCH), buyurtmani bekor qilish (DELETE)." },
    sections: [
      { table: { head: ['Metod', 'Vazifasi', 'Safe', 'Idempotent', 'Body'], rows: [['GET', "Ma'lumot olish", 'Ha', 'Ha', "Yo'q"], ['HEAD', "Faqat header'larni olish", 'Ha', 'Ha', "Yo'q"], ['OPTIONS', 'Imkoniyatlarni so\'rash (CORS)', 'Ha', 'Ha', 'Odatda yo\'q'], ['POST', 'Yangi resurs yaratish / amal', "Yo'q", "Yo'q", 'Ha'], ['PUT', "To'liq almashtirish", "Yo'q", 'Ha', 'Ha'], ['PATCH', "Qisman o'zgartirish", "Yo'q", "Odatda yo'q", 'Ha'], ['DELETE', "O'chirish", "Yo'q", 'Ha', 'Ixtiyoriy']] } },
      { heading: 'Ikki muhim atama', bullets: ["Safe — serverdagi holatni o'zgartirmaydi (GET).", "Idempotent — bir marta yoki o'n marta yuborish bir xil yakuniy natija beradi."] },
      { callout: { kind: 'warn', text: "DELETE /users/42 ni ikki marta yuborish foydalanuvchini ikki marta o'chirmaydi. Lekin POST /orders ni ikki marta yuborish ikkita buyurtma yaratishi mumkin." } },
    ],
    recap: ["GET — olish, POST — yaratish, PUT — almashtirish, PATCH — qisman o'zgartirish, DELETE — o'chirish.", "GET, HEAD, OPTIONS — safe.", "GET, PUT, DELETE — idempotent, POST — yo'q."],
  },
  practice: [{ title: 'Metodni o\'zgartirib ko\'ring', text: "curl bilan POST yuboring va javobni ko'ring (test servis).", cmd: "curl -X POST https://httpbin.org/post -d \"name=Ali\"" }],
  items: [
    ch("Ma'lumotni o'qish uchun qaysi metod ishlatiladi?", 'GET', ['POST', 'DELETE', 'PUT'], "GET — ma'lumot olish."),
    ch("Yangi resurs yaratish uchun odatda qaysi metod?", 'POST', ['GET', 'HEAD', 'OPTIONS'], "POST — yangi resurs yaratadi."),
    ch("Resursni TO'LIQ almashtiradigan metod qaysi?", 'PUT', ['PATCH', 'GET', 'HEAD'], "PUT — to'liq almashtirish."),
    ch("Resursni QISMAN o'zgartiradigan metod qaysi?", 'PATCH', ['PUT', 'POST', 'GET'], "PATCH — qisman o'zgartirish."),
    ch("Resursni o'chiradigan metod qaysi?", 'DELETE', ['REMOVE', 'CLEAR', 'POP'], "DELETE."),
    ch("\"Safe\" metod nimani anglatadi?", "Serverdagi holatni o'zgartirmaydi", ["Shifrlangan yuboriladi", "Hech qachon xato bermaydi", "Faqat HTTPS da ishlaydi"], "Safe — o'qish uchun, holat o'zgarmaydi."),
    ch("Qaysi metod idempotent EMAS?", 'POST', ['GET', 'PUT', 'DELETE'], "POST ni ikki marta yuborsangiz, ikkita resurs yaratilishi mumkin."),
    ch("To'lov tugmasini bosgandan keyin uni disabled qilish nega muhim?", "POST qayta yuborilsa ikki marta to'lov bo'lishi mumkin", ["Brauzer tez ishlashi uchun", "Server o'chib qolmasligi uchun", "CSS xato bermasligi uchun"], "POST idempotent emas, takroriy yuborish xavfli."),
    ch("Qaysi metod body'siz faqat header'larni qaytaradi?", 'HEAD', ['GET', 'PUT', 'PATCH'], "HEAD — GET ga o'xshaydi, lekin body yo'q."),
  ],
});

/* 7 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Status kodlari',
  intro: "Server javobining natijasi uch xonali raqamda.",
  theory: {
    analogy: { icon: '🚦', title: 'Svetofor', text: "Birinchi raqam guruhni bildiradi, xuddi svetoforning rangi kabi: 2 — hammasi joyida, 3 — boshqa yo'ldan boring, 4 — xato sizda, 5 — xato serverda." },
    sections: [
      { heading: 'Guruhlar', table: { head: ['Guruh', 'Ma\'nosi'], rows: [['2xx', 'Muvaffaqiyat'], ['3xx', "Yo'naltirish"], ['4xx', 'Mijoz xatosi'], ['5xx', 'Server xatosi']] } },
      { heading: 'Eng ko\'p uchraydiganlari', table: { head: ['Kod', 'Nomi', 'Qachon'], rows: [['200', 'OK', "So'rov muvaffaqiyatli"], ['201', 'Created', 'Yangi resurs yaratildi'], ['204', 'No Content', "Muvaffaqiyatli, lekin body yo'q"], ['301', 'Moved Permanently', "Doimiy ko'chirildi"], ['304', 'Not Modified', 'Kesh yangi, body yuborilmaydi'], ['400', 'Bad Request', "So'rov noto'g'ri tuzilgan"], ['401', 'Unauthorized', 'Autentifikatsiya kerak: "siz kimsiz?"'], ['403', 'Forbidden', "Kimligingiz ma'lum, lekin ruxsat yo'q"], ['404', 'Not Found', 'Resurs topilmadi'], ['500', 'Internal Server Error', 'Server ichidagi xato'], ['503', 'Service Unavailable', 'Server vaqtincha band']] } },
      { heading: 'Tuzoq: fetch va status kodlari', text: "fetch faqat tarmoq xatosida reject bo'ladi. Server 404 yoki 500 qaytarsa ham promise fulfilled bo'ladi. Shuning uchun res.ok ni har doim tekshiring.", code: { lang: 'js', text: "const res = await fetch('/api/users/1');\nif (!res.ok) throw new Error(`HTTP ${res.status}`);\nconst user = await res.json();" } },
    ],
    recap: ["2xx — yaxshi, 3xx — yo'naltirish, 4xx — mijoz xatosi, 5xx — server xatosi.", "401: kimligingiz noma'lum. 403: ruxsat yo'q.", "fetch 404 da reject bo'lmaydi: res.ok ni tekshiring."],
  },
  practice: [{ title: "Turli status kodlarini ko'ring", text: "Test servis berilgan kodni qaytaradi. -i bayrog'i status qatorini ko'rsatadi.", cmd: 'curl -i https://httpbin.org/status/404' }],
  items: [
    ch("Qaysi kod \"sahifa topilmadi\" degani?", '404', ['200', '403', '500'], "404 Not Found."),
    ch("Muvaffaqiyatli so'rov kodi qaysi?", '200', ['301', '404', '500'], "200 OK."),
    ch("5xx kodlari nimani bildiradi?", 'Server xatosi', ['Mijoz xatosi', 'Muvaffaqiyat', "Yo'naltirish"], "5xx — server ichidagi muammo."),
    ch("4xx kodlari nimani bildiradi?", "Mijoz tomonidagi xato (so'rov noto'g'ri)", ['Server o\'chgan', 'Hammasi joyida', "Doimiy ko'chirish"], "4xx — so'rovda muammo bor."),
    ch("401 va 403 farqi qaysi?", "401: kimligingiz noma'lum; 403: kimligingiz ma'lum, lekin ruxsat yo'q", ["Ikkalasi bir xil", "401: ruxsat yo'q; 403: sahifa topilmadi", "401: server xatosi; 403: mijoz xatosi"], "401 — autentifikatsiya kerak, 403 — ruxsat yo'q."),
    ch("Yangi resurs yaratilganda (POST dan keyin) qaysi kod mos?", '201', ['200', '204', '404'], "201 Created."),
    ch("Server vaqtincha band yoki texnik ishlar ketmoqda. Qaysi kod?", '503', ['404', '401', '301'], "503 Service Unavailable."),
    ch("fetch('/api/x') serverdan 404 oldi. Promise nima bo'ladi?", "Fulfilled bo'ladi, res.ok esa false", ["Reject bo'ladi", "Hech qachon tugamaydi", "Avtomatik qayta yuboriladi"], "fetch faqat tarmoq xatosida reject bo'ladi."),
    fill("fetch javobida muvaffaqiyatni tekshiradigan xossa nomi nima? (res. dan keyingi qismi)", 'ok', "res.ok — status 200-299 bo'lsa true.", ['ok', 'res.ok']),
  ],
});

/* 8 ------------------------------------------------------------------------------------------ */
lesson({
  title: "Header'lar",
  intro: "So'rov va javob haqidagi qo'shimcha ma'lumot.",
  theory: {
    analogy: { icon: '✉️', title: 'Konvertdagi yozuvlar', text: "Xat matnidan tashqari konvertda ham yozuvlar bor: kimdan, qaysi tilda, shoshilinchmi. Header'lar ham so'rov va javobning konvert yozuvlari." },
    sections: [
      { text: "Header'lar Nom: qiymat ko'rinishida yoziladi, nomining katta-kichik harfi ahamiyatsiz." },
      { table: { head: ['Header', 'Kim yuboradi', "Ma'nosi"], rows: [['Accept', 'Mijoz', 'Qaysi formatda javob kutilmoqda'], ['Authorization', 'Mijoz', 'Token yoki boshqa identifikatsiya'], ['Cookie', 'Mijoz', "Saqlangan cookie'lar"], ['User-Agent', 'Mijoz', 'Brauzer va qurilma haqida'], ['Content-Type', 'Ikkalasi', "Body formati, masalan application/json"], ['Cache-Control', 'Ikkalasi', 'Kesh qoidalari'], ['Set-Cookie', 'Server', 'Brauzerga cookie yozish'], ['Location', 'Server', 'Redirect manzili']] } },
      { heading: 'JSON yuborish', code: { lang: 'js', text: "await fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Ali' }),\n});" } },
      { callout: { kind: 'tip', text: "Cookie — server Set-Cookie bilan yozadi, brauzer esa keyingi so'rovlarda avtomatik qaytaradi. Garderobdagi raqam kabi: palto serverda, sizda faqat raqam." } },
    ],
    recap: ["Header — Nom: qiymat juftligi.", "Content-Type body formatini aytadi.", "Authorization kimlikni, Cookie saqlangan holatni yuboradi.", "Set-Cookie serverdan, Cookie mijozdan keladi."],
  },
  practice: [{ title: "Header'larni ko'ring", text: "Faqat javob header'larini olish uchun -I (HEAD so'rovi) ishlating. Content-Type va Server qiymatlarini yozib oling.", cmd: 'curl -I https://example.com' }],
  items: [
    ch("Header qanday ko'rinishda yoziladi?", 'Nom: qiymat', ['Nom = qiymat', '<nom>qiymat</nom>', '[nom] qiymat'], "Masalan Content-Type: application/json."),
    ch("JSON body yuborayotganda Content-Type qiymati qaysi?", 'application/json', ['text/json-file', 'json/application', 'application/text'], "application/json."),
    ch("Server brauzerga cookie yozishi uchun qaysi header ishlatadi?", 'Set-Cookie', ['Cookie', 'Authorization', 'Accept'], "Server Set-Cookie yuboradi."),
    ch("Brauzer saqlangan cookie'larni qaysi header bilan qaytaradi?", 'Cookie', ['Set-Cookie', 'Location', 'Server'], "Brauzer Cookie header'i bilan qaytaradi."),
    ch("Token yuborish uchun odatda qaysi header ishlatiladi?", 'Authorization', ['Accept', 'User-Agent', 'Location'], "Authorization: Bearer ..."),
    ch("Redirect (yo'naltirish) manzili qaysi header'da keladi?", 'Location', ['Accept', 'Cookie', 'Content-Type'], "Location — yangi manzil."),
    ch("Header nomlarida katta-kichik harf ahamiyatlimi?", "Yo'q, ahamiyatsiz", ['Ha, albatta', "Faqat so'rovda", "Faqat javobda"], "Content-Type va content-type bir xil."),
    ch("Accept header'i nimani bildiradi?", "Mijoz qaysi formatda javob kutayotganini", ["Server qaysi tilda yozilgani", "Cookie muddati", "Parolni"], "Accept — kutilayotgan javob formati."),
  ],
});

/* 9 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Domen nomi',
  intro: "IP manzilni odam o'qiy oladigan nomga aylantirish.",
  theory: {
    analogy: { icon: '📒', title: 'Telefon kontaktlari', text: "Telefoningizda do'stlaringiz raqamini yodlamaysiz, ismini saqlaysiz. Domen ham shunday: 142.250.74.46 o'rniga google.com. Server IP manzili o'zgarsa ham, foydalanuvchi uchun manzil o'zgarmaydi." },
    sections: [
      { heading: "Domen o'ngdan chapga o'qiladi", code: { lang: 'text', text: 'blog.shop.example.co.uk\n│    │    │       └── co.uk   public suffix\n│    │    └────────── example  ro\'yxatdan o\'tkazilgan nom\n│    └─────────────── shop     subdomen\n└──────────────────── blog     subdomen' } },
      { bullets: ["TLD — eng oxirgi qism: .com, .org, .uz, .dev.", "Second-level domain — siz sotib oladigan nom: example.com dagi example.", "Subdomen — egasi o'zi yaratadigan qism: app.example.com, api.example.com. Buning uchun qo'shimcha domen sotib olish shart emas."] },
      { heading: 'Domen kimniki', text: "Domen abadiy sotib olinmaydi, u muddatli ijaraga olinadi (odatda yiliga).", table: { head: ['Ishtirokchi', 'Vazifasi'], rows: [['ICANN', 'Global domen tizimini muvofiqlashtiradi'], ['Registry', "TLD reyestrini boshqaradi (.com uchun Verisign)"], ['Registrar', "Domen sotadigan kompaniya (Namecheap, Cloudflare)"], ['Registrant', 'Domen egasi, ya\'ni siz']] } },
    ],
    recap: ["Domen — IP manzilga bog'langan odam o'qiy oladigan nom.", "TLD: .com, .uz. Subdomen: app., api.", "Domen ijaraga olinadi, muddati tugasa yo'qoladi."],
  },
  practice: [{ title: "Domenning IP manzilini toping", text: "nslookup domen nomini IP manzilga aylantirib ko'rsatadi.", cmd: 'nslookup google.com' }],
  items: [
    ch("Domen nomi nima uchun kerak?", "IP manzil o'rniga odam eslab qoladigan nom bo'lishi uchun", ["Saytni tezlashtirish uchun", "Parolni himoya qilish uchun", "Rasmlarni siqish uchun"], "Domen odam uchun qulay nom."),
    ch("blog.example.com manzilida TLD qaysi?", '.com', ['blog', 'example', 'blog.example'], "TLD — eng oxirgi qism."),
    ch("api.example.com da api nima?", 'Subdomen', ['TLD', 'Registrar', 'Port'], "Subdomen — domen egasi yaratadigan qism."),
    ch("Subdomen yaratish uchun yana bir domen sotib olish kerakmi?", "Yo'q, kerak emas", ['Ha, har safar', "Faqat .com da", "Faqat Cloudflare'da"], "Subdomenni domen egasi bepul yaratadi."),
    ch("Domen kimdan olinadi?", 'Registrar (masalan, Namecheap)', ['Provayder routeridan', 'Brauzerdan', 'Serverning o\'zidan avtomatik'], "Registrar — domen sotadigan kompaniya."),
    ch("Domen qanday egalik qilinadi?", "Muddatli ijaraga olinadi", ["Abadiy sotib olinadi", "Bepul va cheksiz", "Faqat davlat beradi"], "Odatda yiliga to'lanadi."),
    ch("Domen o'qish tartibi qaysi?", "O'ngdan chapga (TLD → nom → subdomen)", ["Chapdan o'ngga", "Tasodifiy", "Faqat oxirgi nuqtagacha"], "blog.shop.example.com: com → example → shop → blog."),
    ch("Server IP manzili o'zgarsa, foydalanuvchilar nima qiladi?", "Hech narsa: domen o'sha-o'sha qoladi", ["Yangi IP ni eslab qolishadi", "Saytni qayta o'rnatishadi", "Brauzerni yangilashadi"], "Domen IP o'zgarishini foydalanuvchidan yashiradi."),
  ],
});

/* 10 ----------------------------------------------------------------------------------------- */
lesson({
  title: 'DNS va yozuvlar (A, CNAME)',
  intro: "Domen IP manzilga qanday aylanadi.",
  theory: {
    analogy: { icon: '📖', title: 'Telefon kitobi', text: "DNS — internetning telefon kitobi: u example.com kabi nomni 93.184.216.34 kabi IP manzilga aylantiradi. Bu butun dunyo bo'ylab tarqatilgan tizim, har bir daraja faqat o'z qismini biladi." },
    sections: [
      { heading: 'Domen IP ni qanday topadi', flow: ['Brauzer / OS keshi', 'Resolver (1.1.1.1, 8.8.8.8)', 'Root server', 'TLD server (.com)', 'Authoritative server', 'IP manzil'] },
      { text: "Avval brauzer va OS keshi tekshiriladi. Topilmasa so'rov resolver ga boradi, u root dan TLD ni, TLD dan authoritative serverni so'raydi. Yakuniy IP topilgach javob keshga saqlanadi." },
      { heading: 'Eng muhim yozuvlar', table: { head: ['Yozuv', 'Vazifasi', 'Misol'], rows: [['A', 'Nom → IPv4', 'example.com → 93.184.216.34'], ['AAAA', 'Nom → IPv6', 'example.com → 2606:2800:220:1::1'], ['CNAME', 'Nom → boshqa nom', 'www → example.netlify.app'], ['TXT', "Matn: domen egaligini tasdiqlash", 'SPF, tasdiqlash kodi'], ['MX', 'Pochta serveri', 'mail.example.com']] } },
      { callout: { kind: 'warn', text: "Domenning o'zi (example.com, apex) odatda oddiy CNAME ololmaydi. www.example.com esa CNAME bo'lishi mumkin." } },
    ],
    recap: ["DNS nomni IP ga aylantiradi.", "A — IPv4, AAAA — IPv6, CNAME — boshqa nomga yo'naltirish.", "Javoblar keshlanadi."],
  },
  practice: [{ title: 'DNS yozuvlarini tekshiring', text: "Domen uchun A va TXT yozuvlarini so'rang.", cmd: 'nslookup -type=TXT example.com' }],
  items: [
    ch("DNS nima qiladi?", "Domen nomini IP manzilga aylantiradi", ["Saytni shifrlaydi", "Rasmlarni siqadi", "Parolni saqlaydi"], "DNS — internetning telefon kitobi."),
    ch("Domenni IPv4 manzilga bog'laydigan yozuv qaysi?", 'A', ['MX', 'TXT', 'NS'], "A yozuvi nomni IPv4 ga bog'laydi."),
    ch("IPv6 manzil uchun yozuv qaysi?", 'AAAA', ['A', 'CNAME', 'MX'], "AAAA — IPv6."),
    ch("Bir nomni boshqa nomga yo'naltiradigan yozuv qaysi?", 'CNAME', ['A', 'AAAA', 'TXT'], "CNAME — alias."),
    ch("Domen egaligini tasdiqlash uchun ko'pincha qaysi yozuv ishlatiladi?", 'TXT', ['A', 'CNAME', 'AAAA'], "TXT matnli ma'lumot saqlaydi."),
    ch("Domen pochta serveri uchun qaysi yozuv?", 'MX', ['A', 'TXT', 'CNAME'], "MX — mail exchange."),
    order("DNS qidiruv tartibini tuzing.", ['Brauzer keshi', 'Resolver', 'Root server', 'TLD server', 'Authoritative server'], "Avval kesh, keyin resolver, root → TLD → authoritative."),
    ch("www.example.com ni example.netlify.app ga yo'naltirish uchun qaysi yozuv?", 'CNAME', ['A', 'MX', 'NS'], "www — odatda CNAME."),
    ch("Domenning o'zida (example.com) odatda nima ishlamaydi?", "Oddiy CNAME", ["A yozuvi", "TXT yozuvi", "AAAA yozuvi"], "Apex domenda CNAME muammo; ALIAS/ANAME ishlatiladi."),
  ],
});

/* 11 ----------------------------------------------------------------------------------------- */
lesson({
  title: 'Hosting va deploy',
  intro: "Sayt qayerda turadi va uni internetga qanday chiqaramiz.",
  theory: {
    analogy: { icon: '🏠', title: 'Manzil va bino', text: "Domen manzil bo'lsa, hosting shu manzildagi bino: saytingiz fayllari va dasturi joylashgan hamda internetdan doimiy kirish mumkin bo'lgan kompyuter xizmati." },
    sections: [
      { heading: 'Hosting turlari', table: { head: ['Tur', 'Analogiya', 'Afzalligi'], rows: [['Shared', 'Yotoqxona', 'Juda arzon, oson'], ['VPS', 'Kvartira', 'Nazorat ko\'p'], ['Dedicated', 'Xususiy uy', 'Maksimal quvvat'], ['PaaS', 'Tayyor ofis', 'Deploy juda oson'], ['Static + CDN', 'Vitrina', 'Arzon, tez, xavfsiz'], ['Serverless', 'Taksi', "Faqat ishlatgan vaqt uchun to'lov"]] } },
      { heading: 'Ilova turi hostingni belgilaydi', table: { head: ['Ilova', 'Natijasi', 'Qayerga'], rows: [['SPA (Vite + React)', 'Statik html, js, css', 'Static hosting yoki CDN'], ['SSR (Next.js)', "Har so'rovda server kodi", 'Node serveri, Vercel, konteyner'], ['API va baza', 'Doimiy backend', 'VPS, PaaS']] } },
      { heading: 'Deploy jarayoni', flow: ["Git'ga push", 'CI: test va lint', 'npm run build', 'Preview URL', 'Production'] },
      { callout: { kind: 'warn', text: "Frontend env o'zgaruvchilari maxfiy emas: VITE_API_URL kabilar build vaqtida JS fayliga yoziladi, har kim ko'ra oladi. Maxfiy kalitlarni frontend kodiga qo'ymang." } },
    ],
    recap: ["Hosting — saytingiz turadigan kompyuter xizmati.", "SPA uchun static hosting yetarli.", "Deploy: push → CI → build → production.", "Maxfiy kalit frontendda saqlanmaydi."],
  },
  practice: [{ title: "SPA ni deploy qiling", text: "Vite + React loyihasini build qiling va dist papkasini static hostingga (Netlify, Cloudflare Pages) yuklang. /about sahifasini yangilaganda 404 chiqmasligini tekshiring.", cmd: 'npm run build' }],
  items: [
    ch("Hosting nima?", "Sayt fayllari turadigan va internetdan kirish mumkin bo'lgan kompyuter xizmati", ["Domen nomining boshqa nomi", "Brauzer kengaytmasi", "Kod muharriri"], "Hosting — saytingiz uyi."),
    ch("Domen va hosting munosabati qaysi?", "Domen — manzil, hosting — shu manzildagi bino", ["Ikkalasi bir xil", "Hosting — manzil, domen — bino", "Ikkalasi ham brauzer ichida"], "Domen nomni, hosting fayllarni beradi."),
    ch("Vite + React SPA qayerga deploy qilinadi?", "Static hosting yoki CDN", ["Faqat dedicated serverga", "Faqat ma'lumotlar bazasiga", "Faqat telefon ilovaga"], "SPA build natijasi — statik fayllar."),
    ch("Eng arzon, lekin qo'shni yuklamasi ta'sir qiladigan hosting turi qaysi?", 'Shared', ['Dedicated', 'VPS', 'Serverless'], "Shared — yotoqxona."),
    ch("Doimiy backend va ma'lumotlar bazasi uchun qaysi hosting mos?", 'VPS yoki PaaS', ['Faqat static CDN', 'Faqat email hosting', 'Brauzer keshi'], "Doimiy ishlaydigan server kerak."),
    order("Zamonaviy deploy tartibini tuzing.", ["Git'ga push", 'CI testlar', 'build', 'production'], "Push → CI → build → production."),
    ch("VITE_API_URL kabi o'zgaruvchilar haqida qaysi gap to'g'ri?", "Build vaqtida JS ga yoziladi va har kim ko'ra oladi", ["Maxfiy, faqat server biladi", "Faqat dev rejimida ko'rinadi", "Brauzer ularni shifrlaydi"], "Frontend env maxfiy emas."),
    ch("npm run build nima qiladi?", "Production uchun tayyor fayllarni yaratadi", ["Serverni o'chiradi", "Domen sotib oladi", "DNS ni yangilaydi"], "Build dist papkasini yaratadi."),
  ],
});

/* 12 ----------------------------------------------------------------------------------------- */
lesson({
  title: 'Brauzer: sahifa HTML dan quriladi',
  intro: "Brauzer ichida nima bor va u sahifani qanday chizadi.",
  theory: {
    analogy: { icon: '🏗️', title: 'Qurilish', text: "HTML — rejasi (tuzilma), CSS — bo'yoq va bezak, JavaScript — elektr va mexanizmlar. Brauzer shu uchtasini olib, ko'rinadigan binoni quradi." },
    sections: [
      { heading: 'Brauzer — kichik operatsion tizim', table: { head: ['Brauzer', 'Rendering engine', 'JavaScript engine'], rows: [['Chrome, Edge, Brave', 'Blink', 'V8'], ['Firefox', 'Gecko', 'SpiderMonkey'], ['Safari', 'WebKit', 'JavaScriptCore']] } },
      { text: "Rendering engine HTML va CSS ni piksellarga aylantiradi, JavaScript engine esa JS kodni bajaradi. Bir xil kod har xil engine da farqli ishlashi mumkin, shuning uchun turli brauzerda sinash kerak." },
      { heading: "Sahifa qanday quriladi", flow: ['HTML → DOM', 'CSS → CSSOM', 'Render tree', 'Layout', 'Paint', 'Composite'] },
      { bullets: ["DOM — sahifa tuzilishining xotiradagi daraxt modeli.", "CSSOM — CSS qoidalarining xotiradagi modeli.", "Layout — har elementning o'lchami va joyi hisoblanadi.", "Paint — ranglar, matn, soyalar chiziladi."] },
    ],
    recap: ["Brauzer HTML dan DOM, CSS dan CSSOM quradi.", "Keyin layout, paint va composite bosqichlari keladi.", "Chrome — Blink + V8, Firefox — Gecko, Safari — WebKit."],
  },
  practice: [{ title: 'Elements panelini oching', text: "Istalgan saytda F12 → Elements. DOM daraxtini ko'ring, bir elementni tanlab rangini o'zgartiring. Bu CSSOM ni jonli o'zgartirishdir." }],
  items: [
    ch("HTML dan brauzer xotirasida nima quriladi?", 'DOM', ['CSSOM', 'Render tree', 'Cookie'], "HTML → DOM."),
    ch("CSS dan nima quriladi?", 'CSSOM', ['DOM', 'Layout', 'Paint'], "CSS → CSSOM."),
    ch("DOM nima?", "Sahifa tuzilishining xotiradagi daraxt modeli", ["CSS fayli", "Server nomi", "Brauzer sozlamasi"], "DOM — Document Object Model."),
    ch("Chrome ishlatadigan JavaScript engine qaysi?", 'V8', ['SpiderMonkey', 'JavaScriptCore', 'Gecko'], "Chrome — V8."),
    ch("Firefox ning rendering engine'i qaysi?", 'Gecko', ['Blink', 'WebKit', 'V8'], "Firefox — Gecko."),
    order("Sahifa qurilish bosqichlarini tartiblang.", ['DOM va CSSOM', 'Render tree', 'Layout', 'Paint', 'Composite'], "Parsing → render tree → layout → paint → composite."),
    ch("Layout bosqichida nima hisoblanadi?", "Har bir elementning aniq o'lchami va joylashuvi", ["Ranglar", "IP manzil", "Cookie muddati"], "Layout — o'lcham va joy."),
    ch("Nega turli brauzerlarda sinash kerak?", "Bir xil kod har xil engine da farqli ishlashi mumkin", ["Brauzerlar parolni so'raydi", "Faqat tezlik uchun", "Server buni talab qiladi"], "Cross-browser testlar shu uchun."),
  ],
});

/* 13 ----------------------------------------------------------------------------------------- */
lesson({
  title: 'URL yozilganda nima bo\'ladi',
  intro: "Frontend intervyularining eng mashhur savoli: hamma bilganingizni bir zanjirga yig'amiz.",
  theory: {
    analogy: { icon: '🛰️', title: 'Sayohat', text: "Brauzerga manzil yozish — sayohatga chiqish kabi: manzilni aniqlaysiz (DNS), yo'l ochasiz (ulanish), so'rov yuborasiz, javob olasiz va uni ekranda quraysiz." },
    sections: [
      { heading: 'To\'qqiz qadam', flow: ['URL tahlili', 'DNS', 'Ulanish (TCP + TLS)', 'HTTP so\'rov', 'Server javobi', 'HTML parsing', 'Render', 'JavaScript', 'Keyingi ishlar'] },
      { bullets: ["URL tahlili: brauzer matn qidiruvmi yoki manzilmi aniqlaydi.", "DNS: domen IP ga aylanadi (kesh, resolver, root → TLD → authoritative).", "Ulanish: TCP va TLS handshake o'rnatiladi.", "HTTP so'rov: cookie va header'lar bilan GET yuboriladi.", "Server javobi: statik fayl yoki backend javobi qaytadi.", "Parsing: HTML o'qiladi, DOM va CSSOM quriladi.", "Render: layout, paint, composite.", "JavaScript: skriptlar bajariladi, React ilova ishga tushadi.", "Keyingi ishlar: API so'rovlari va foydalanuvchi harakatlari."] },
      { callout: { kind: 'tip', text: "Har bir qadamda kesh bor: DNS, HTTP, CDN. Sekinlikni taxmin qilmang, Network panelida o'lchang." } },
    ],
    recap: ["DNS → ulanish → HTTP → javob → DOM → render → JS.", "Har qadam o'z sekinlik sabablariga ega.", "Taxmin qilmay o'lchang: DevTools Network."],
  },
  practice: [
    { title: "Network panelida kuzating", text: "F12 → Network. \"Disable cache\" ni yoqib sahifani yangilang. Eng katta 5 ta resurs, birinchi so'rov vaqti (TTFB) va ishlatilgan protokolni (h2 yoki h3) yozib oling." },
    { title: "Zanjirni o'z so'zingiz bilan ayting", text: "Qog'ozsiz, ovoz chiqarib 1-2 daqiqada javob bering: brauzerga URL yozilganda nima bo'ladi?" },
  ],
  items: [
    order("Brauzerga URL yozilgandan keyingi asosiy qadamlarni tartiblang.", ['DNS', 'Ulanish', 'HTTP so\'rov', 'Server javobi', 'Render'], "DNS → ulanish → so'rov → javob → render."),
    ch("URL yozilganda birinchi bo'lib nima qilinadi?", "URL tahlil qilinadi va IP topish uchun DNS ishlaydi", ["Rasmlar yuklanadi", "JavaScript bajariladi", "Cookie o'chiriladi"], "Avval manzil aniqlanadi, keyin IP topiladi."),
    ch("HTTPS ulanishida ma'lumot yuborishdan oldin qaysi handshake'lar bo'ladi?", 'TCP va TLS', ['Faqat DNS', 'Faqat HTTP', 'CSS va JS'], "TCP, keyin TLS handshake."),
    ch("Birinchi bayt kelguncha ketgan vaqt qanday ataladi?", 'TTFB', ['LCP', 'DOM', 'NAT'], "TTFB — Time To First Byte."),
    ch("JavaScript qadami nima qiladi?", "Skriptlarni bajaradi, React ilova ishga tushadi", ["IP manzil beradi", "Domen sotadi", "Faylni siqadi"], "JS sahifani interaktiv qiladi."),
    ch("Sahifa sekin ochilsa, avval nima qilinadi?", "Network paneli bilan o'lchanadi", ["React ni almashtirish", "Serverni o'chirish", "Taxmin bilan optimizatsiya"], "Avval o'lchang, keyin tuzating."),
    ch("DNS javobi qayerda keshlanishi mumkin?", "Brauzer, OS va resolver keshlarida", ["Faqat serverda", "Hech qayerda", "Faqat CSS faylida"], "DNS bir necha joyda keshlanadi."),
    ch("Brauzer HTML ni olgach nima quradi?", 'DOM', ['Domen', 'Router', 'Port'], "HTML parsing DOM daraxtini hosil qiladi."),
    ch("Server HTML javobini qaytargach, brauzerda qaysi bosqich keladi?", 'Parsing va render', ["DNS qidiruv", "TCP handshake", "Domen ro'yxatdan o'tkazish"], "Javobdan keyin parsing va render."),
  ],
});

const out = path.join(__dirname, '..', 'src', 'main', 'resources', 'dev', 'frontend-internet-junior.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(L, null, 1));
console.log(`wrote ${L.length} lessons, ${L.reduce((s, l) => s + l.items.length, 0)} items -> ${out}`);
