// Internet, MIDDLE level, lessons 10-12: HTTP versions and compression, retries and realtime, browser storage and sandbox.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 10 --------------------------------------------------------------------------------------- */
  lesson({
    title: "HTTP versiyalari va siqish",
    intro: "HTTP/1.1, HTTP/2 va HTTP/3 farqi, head-of-line blocking, Brotli va gzip.",
    what: "HTTP ning mazmuni (metod, status, header) o'zgarmagan, lekin uni tashish usuli o'zgargan. Yangi versiyalar bitta ulanishda ko'p so'rovni parallel olib yuradi. Compression (siqish) esa matnli fayllarni yo'lda bir necha baravar kichraytiradi.",
    analogy: { icon: '🏪', title: "Kassadagi navbat", text: "HTTP/1.1 — har kassada bittadan mijoz, kassalar soni cheklangan. HTTP/2 — bitta kassa hamma buyurtmani bo'laklab parallel xizmat qiladi. Siqish — xaridni ixcham qadoqlash." },
    defs: [
      ['Multiplexing (birlashtirib uzatish)', "Bitta ulanishda bir nechta so'rov va javobning aralash oqishi."],
      ['Head-of-line blocking (navbat boshi to\'sig\'i)', "Oldindagisi tiqilib, orqadagilarni ushlab qolishi."],
      ['QUIC', "UDP ustidagi, shifrlashi o'z ichida bo'lgan transport; HTTP/3 shunda ishlaydi."],
      ['Content-Encoding', "Javob qaysi usulda siqilganini aytadigan header."],
    ],
    uses: [
      ["Server yoki CDN sozlashda", "HTTP/2 yoki 3 va br/gzip yoqilganini tekshirasiz."],
      ["Eski maslahatlarni baholashda", "Domen sharding va hamma narsani bitta faylga yig'ish HTTP/2 da kam foydali."],
      ["Fayl katta ko'ringanda", "Transferred va Resource hajmini solishtirasiz."],
    ],
    sections: [
      { heading: 'Versiyalar', table: { head: ['', 'HTTP/1.1', 'HTTP/2', 'HTTP/3'], rows: [['Transport', 'TCP', 'TCP', 'QUIC (UDP)'], ['Format', 'matn', 'binar', 'binar'], ['Parallellik', 'domenga ~6 ulanish', 'bitta ulanishda ko\'p oqim', 'mustaqil oqimlar'], ["Paket yo'qolsa", "o'sha ulanish kutadi", 'barcha oqim kutadi', "faqat o'sha oqim kutadi"]] } },
      { heading: 'Siqish', code: { lang: 'http', text: 'GET /app.js\nAccept-Encoding: zstd, br, gzip\n\nHTTP/1.1 200 OK\nContent-Encoding: br\nVary: Accept-Encoding' }, text: "Brauzer qo'llaydigan usullarini aytadi, server birini tanlaydi, brauzer o'zi ochadi." },
      { heading: 'Nimani siqish kerak', bullets: ["HTML, CSS, JS, JSON, SVG — ha, katta foyda.", "JPEG, WebP, MP4, WOFF2 — allaqachon siqilgan, qayta siqish deyarli foydasiz."] },
      { heading: 'Qaysi versiyani ko\'rish', callout: { kind: 'tip', text: "Network panelida Protocol ustunini yoqing: http/1.1, h2 yoki h3." } },
    ],
    life: [
      ['🧱', "Navbatdagi so'rovlar", "HTTP/1.1 da 30 ta fayl: bir qismi Queueing holatida kutadi."],
      ['🚆', "Metroda internet", "HTTP/3 Wi-Fi dan mobil tarmoqqa o'tishda ulanishni saqlab qolishi mumkin."],
    ],
    tip: "Avval server tomonda siqish va HTTP/2 yoqilganini tekshiring: bu kod yozmasdan olinadigan tezlik.",
    mistakes: [
      ['Rasmlarni gzip bilan "kichraytirish".', "Mos format va o'lcham tanlash.", "Rasm formati allaqachon siqilgan."],
      ['HTTP/2 hamma sekinlikni hal qiladi deb o\'ylash.', "Avval o'lchash.", "Katta fayl va sekin server o'zgarmaydi."],
    ],
    recap: [
      "HTTP/2: binar, multiplexing, header siqish.",
      "HTTP/3: QUIC, TCP navbat to'sig'isiz.",
      "br va gzip matnli fayllar uchun.",
      "Protocol ustuni versiyani ko'rsatadi.",
    ],
    practice: [
      { title: 'Protocol ustuni', text: "Network da Protocol ustunini yoqib, uch xil saytning HTTP versiyasini yozib oling." },
      { title: 'Siqish foydasi', text: "Bitta JS faylning transferred va resource hajmini solishtiring, nisbatni hisoblang." },
    ],
    items: [
      ch("HTTP/2 ning HTTP/1.1 dan asosiy farqi qaysi?", "Bitta ulanishda parallel oqimlar", ["Metodlar o'rniga yangi buyruqlar", "Status kodlarining bekor qilinishi", "TCP o'rniga UDP ishlatilishi"], "UDP — HTTP/3 da."),
      ch("HTTP/3 qaysi transport ustida ishlaydi?", "QUIC (UDP)", ["TCP + TLS", "WebSocket", "SMTP"], "QUIC UDP ustida."),
      ch("HTTP/2 da bitta TCP paket yo'qoldi. Nima bo'ladi?", "Barcha oqimlar uni kutib turadi", ["Faqat bitta so'rov bekor bo'ladi", "Ulanish HTTP/1.1 ga o'tib ketadi", "Qolgan oqimlar to'xtamay davom etadi"], "TCP tartibni saqlaydi — transport darajasidagi head-of-line blocking."),
      ch("Quyidagi javobda brauzer nima qiladi?", "O'zi ochib, JS ga oddiy matn beradi", ["Faylni .br kengaytmada yuklab oladi", "Dasturchi kodida ochishni talab qiladi", "Javobni xato deb hisoblab, rad etadi"], "Ochish brauzer ichida avtomatik.", 'Content-Encoding: br\nContent-Type: text/javascript'),
      ch("Qaysi faylni siqishdan eng kam foyda bor?", "photo.webp", ["bundle.js", "data.json", "styles.css"], "WebP allaqachon siqilgan."),
      ch("Brauzer qaysi siqish usullarini tushunishini qaysi header bilan aytadi?", "Accept-Encoding", ["Content-Encoding", "Content-Type", "Accept-Language"], "Content-Encoding — serverning javobi."),
      ch("DevTools: transferred 90 kB, resource 400 kB. Bu nimani anglatadi?", "Javob siqib yuborilgan", ["Fayl yarmi yo'qolgan", "310 kB xato qaytgan", "Kesh to'lib qolgan"], "Tarmoqda 90 kB o'tdi, ochilgach 400 kB."),
      ch("Siqilgan 400 kB li JS haqida qaysi gap to'g'ri?", "Brauzer baribir 400 kB ni bajaradi", ["Brauzer faqat siqilgan qismni o'qiydi", "Parse vaqti ham xuddi shuncha kamayadi", "Fayl xotirada siqilgan holda ishlaydi"], "Siqish yuklashni tezlashtiradi, parse va bajarishni emas."),
      ch("Eski \"domain sharding\" (resurslarni ko'p domenga bo'lish) HTTP/2 da nega zararli bo'lishi mumkin?", "Ortiqcha ulanishlar ochiladi", ["Cookie lar butunlay o'chadi", "Fayllar siqilmay qoladi", "Preflight ikki marta ketadi"], "Har domen — yangi DNS, TCP va TLS."),
      fill("Bitta ulanishda ko'p so'rovni aralash uzatish (inglizcha):", "multiplexing", "Multiplexing.", ["Multiplexing"]),
      fill("Brotli siqishining Content-Encoding dagi qisqa nomi:", "br", "Content-Encoding: br.", ["BR"]),
      order("Versiyalarni eskidan yangiga tartiblang:", ['HTTP/1.0', 'HTTP/1.1', 'HTTP/2', 'HTTP/3'], "Har biri oldingisining cheklovini yumshatadi."),
    ],
  });

  /* 11 --------------------------------------------------------------------------------------- */
  lesson({
    title: "Idempotentlik, qayta urinish va real vaqt",
    intro: "Safe va idempotent metodlar, 401/403/409/429/503, retry va backoff; polling, SSE, WebSocket.",
    what: "Tarmoq ishonchsiz: javob yo'qolsa, so'rov bajarilgan-bajarilmaganini bilmaysiz. Idempotent (takrorlansa ham natija o'zgarmaydigan) amalni qayta yuborish xavfsiz. Server yangilikni o'zi yetkazishi kerak bo'lsa, polling, SSE yoki WebSocket tanlanadi.",
    analogy: { icon: '🛗', title: "Lift tugmasi", text: "Lift tugmasini besh marta bossangiz ham bitta lift keladi (idempotent). Do'konda \"yana bitta bering\"ni besh marta aytsangiz, beshta olasiz (idempotent emas)." },
    defs: [
      ['Safe method (xavfsiz metod)', "Serverdagi ma'lumotni o'zgartirishga mo'ljallanmagan: GET, HEAD."],
      ['Idempotent', "Bir marta yoki bir necha marta yuborish natijasi bir xil: GET, PUT, DELETE."],
      ['Exponential backoff (ortib boruvchi kutish)', "Qayta urinishlar orasini 1, 2, 4 s qilib uzaytirish."],
      ['SSE (Server-Sent Events)', "Serverdan mijozga bir tomonlama oqim."],
      ['WebSocket', "Doimiy ikki tomonlama ulanish."],
    ],
    uses: [
      ["To'lov va buyurtmada", "Ikki marta bosish va takroriy so'rovdan himoya."],
      ["API xatosini qayta ishlashda", "Statusga qarab: login, ruxsat, kutib qayta urinish."],
      ["Jonli yangilanishda", "Yo'nalish va chastotaga qarab usul tanlanadi."],
    ],
    sections: [
      { heading: 'Metodlar', table: { head: ['Metod', 'Safe', 'Idempotent'], rows: [['GET', 'ha', 'ha'], ['PUT', "yo'q", 'ha'], ['DELETE', "yo'q", 'ha'], ['POST', "yo'q", "yo'q"], ['PATCH', "yo'q", 'kafolatlanmagan']] } },
      { heading: 'Muhim status kodlari', table: { head: ['Kod', 'Frontend nima qiladi'], rows: [['401', 'qayta login yoki token yangilash'], ['403', "ruxsat yo'qligini ko'rsatish"], ['409', 'ziddiyatni tushuntirish'], ['422', 'forma xatolarini ko\'rsatish'], ['429', 'Retry-After ni kutish'], ['503', 'keyinroq qayta urinish']] } },
      { heading: 'Takrorlanmas buyurtma', code: { lang: 'js', text: "const key = crypto.randomUUID(); // bitta buyurtma uchun bitta kalit\nawait fetch('/orders', {\n  method: 'POST',\n  headers: { 'Idempotency-Key': key, 'Content-Type': 'application/json' },\n  body: JSON.stringify(order),\n});" } },
      { heading: 'Real vaqt usullari', table: { head: ['Usul', "Yo'nalish", 'Qachon'], rows: [['Polling', "mijoz qayta-qayta so'raydi", 'kamdan-kam o\'zgarish'], ['SSE', 'server → mijoz', 'xabarnoma, progress'], ['WebSocket', 'ikki tomon', 'chat, o\'yin'], ['WebRTC', "foydalanuvchidan foydalanuvchiga", "video qo'ng'iroq"]] } },
    ],
    life: [
      ['💳', "Ikki marta yechilgan pul", "Javob kechikdi, tugma yana bosildi, ikkinchi POST yangi to'lov yaratdi."],
      ['📊', "Yuklash jarayoni", "Server faqat foizni yuboradi — SSE yetarli."],
    ],
    tip: "Qayta urinishdan oldin so'rang: bu amal ikki marta bajarilsa nima bo'ladi?",
    mistakes: [
      ['Har xatoda darhol cheksiz retry.', "Cheklangan urinish va backoff.", "Qiynalayotgan serverni battar yuklaydi."],
      ['4xx xatoni ham qayta yuboraverish.', "So'rovni tuzatish.", "Noto'g'ri so'rov o'zgarmasa, natija ham o'zgarmaydi."],
      ['Faqat tugmani o\'chirishga tayanish.', "Server tomonda idempotency kaliti ham.", "Tarmoq qayta yuborishi yoki sahifa yangilanishi mumkin."],
    ],
    recap: [
      "GET, PUT, DELETE idempotent; POST emas.",
      "401 — kim ekaning noma'lum, 403 — ruxsat yo'q.",
      "429 va 503 da kutib, backoff bilan.",
      "Bir tomonlama — SSE, ikki tomonlama — WebSocket.",
    ],
    practice: [
      { title: 'Retry funksiyasi', text: "fetch ni 3 marta, 1-2-4 soniya oraliq bilan qayta uradigan funksiya yozing; 4xx da to'xtasin." },
      { title: 'Usul tanlang', text: "Valyuta kursi, chat va fayl qayta ishlash progressi uchun usul tanlab, sababini yozing." },
    ],
    items: [
      ch("Qaysi metod idempotent emas?", "POST", ["GET", "PUT", "DELETE"], "Har POST yangi resurs yaratishi mumkin."),
      ch("DELETE /cart/5 birinchi marta 204, ikkinchi marta 404 qaytardi. DELETE idempotentmi?", "Ha, server holati bir xil", ["Yo'q, status kodi o'zgardi", "Yo'q, ikkinchi so'rov xato", "Faqat 204 qaytsa bo'ladi"], "Idempotentlik server holatiga ta'sir haqida, javob kodi haqida emas."),
      ch("Token muddati tugagan. Odatda qaysi status keladi?", "401", ["403", "404", "409"], "401 — autentifikatsiya kerak."),
      ch("Oddiy foydalanuvchi admin API sini chaqirdi (login qilingan). Status?", "403", ["401", "429", "503"], "Kimligi ma'lum, ruxsati yo'q."),
      ch("Javob: 429, Retry-After: 30. Mijoz nima qilishi kerak?", "30 soniya kutib, qayta urinish", ["Darhol 30 marta qayta yuborish", "Foydalanuvchini logout qilish", "So'rov metodini GET qilish"], "429 — juda ko'p so'rov."),
      ch("To'lov POST ida tarmoq uzildi va javob kelmadi. Eng xavfsiz yechim?", "O'sha Idempotency-Key bilan qayta yuborish", ["Yangi kalit yaratib, darhol qayta yuborish", "So'rovni GET metodiga almashtirib yuborish", "To'lov bo'lmagan deb ekranda xabar berish"], "Server bir xil kalitni ikkinchi marta bajarmaydi."),
      ch("Server vaqti-vaqti bilan faqat bildirishnoma yuboradi, mijoz javob yubormaydi. Eng sodda mos usul?", "SSE", ["WebSocket", "WebRTC", "Preflight"], "Bir tomonlama oqim, oddiy HTTP ustida."),
      ch("Ikki tomonlama, tez-tez xabarli chat uchun qaysi biri mos?", "WebSocket", ["SSE", "Soatlik polling", "301 redirect"], "Doimiy ikki tomonlama kanal."),
      ch("1 000 mijoz har 1 soniyada polling qilyapti, ma'lumot soatda bir o'zgaradi. Muammo?", "Deyarli hamma so'rov behuda", ["Server javob bera olmasligi shart", "CORS xatosi albatta chiqadi", "Cookie hajmi o'sib boraveradi"], "Soniyasiga 1 000 ta bo'sh so'rov."),
      fill("Takrorlansa ham natija o'zgarmaydigan amal xususiyati (inglizcha):", "idempotent", "Idempotent.", ["Idempotent", "idempotency"]),
      fill("Juda ko'p so'rov yuborildi degan status kodi (son):", "429", "429 Too Many Requests."),
      fill("Qayta urinishlar orasini 1, 2, 4 soniya qilib uzaytirish: exponential ...", "backoff", "Exponential backoff.", ["Backoff"]),
    ],
  });

  /* 12 --------------------------------------------------------------------------------------- */
  lesson({
    title: "Brauzer xotirasi, dvigatellar va sandbox",
    intro: "cookie, localStorage, sessionStorage, IndexedDB, Cache API; Blink, Gecko, WebKit; ruxsatlar va secure context.",
    what: "Brauzer saytga ma'lumot saqlash uchun bir nechta joy beradi va har biri o'z vazifasiga mos. Saytlar sandbox (ajratilgan muhit) ichida ishlaydi: bir sayt boshqasining ma'lumotiga va kompyuteringiz fayllariga o'zi kira olmaydi.",
    analogy: { icon: '🗄️', title: "Idoradagi saqlash joylari", text: "Cho'ntakdagi guvohnoma (cookie, har eshikda ko'rsatiladi), stoldagi daftar (localStorage), qoralama qog'oz (sessionStorage), katta arxiv (IndexedDB)." },
    defs: [
      ['localStorage', "Origin bo'yicha, muddatsiz, sinxron satr xotirasi."],
      ['sessionStorage', "Faqat shu tab uchun, tab yopilguncha."],
      ['IndexedDB', "Katta, strukturali ma'lumot uchun asinxron baza."],
      ['Cache API', "So'rov-javob juftlarini saqlash; Service Worker bilan offline."],
      ['Rendering engine (chizish dvigateli)', "Blink (Chrome, Edge), Gecko (Firefox), WebKit (Safari)."],
    ],
    uses: [
      ["Sozlama va qoralama saqlashda", "Muddat va hajmga qarab joy tanlaysiz."],
      ["Offline ishlashda", "Cache API va IndexedDB."],
      ["\"Safari da buzilyapti\" holatida", "Dvigatel farqini va qo'llab-quvvatlashni tekshirasiz."],
    ],
    sections: [
      { heading: 'Qaysi biri qachon', table: { head: ['Joy', 'Hajm', 'Serverga ketadimi', 'Misol'], rows: [['Cookie', '~4 KB', 'ha, o\'zi', 'sessiya'], ['localStorage', 'bir necha MB', "yo'q", 'til, mavzu'], ['sessionStorage', 'bir necha MB', "yo'q", 'tabdagi forma qadami'], ['IndexedDB', 'katta', "yo'q", 'offline xabarlar'], ['Cache API', 'katta', "yo'q", 'fayl va javoblar']] } },
      { heading: 'Faqat satr', code: { lang: 'js', text: "localStorage.setItem('cart', JSON.stringify([1, 2]));\nconst cart = JSON.parse(localStorage.getItem('cart') ?? '[]');" }, callout: { kind: 'warn', text: "Xotira o'chirilishi, to'lishi yoki bloklanishi mumkin: o'qish va yozishni xatoga tayyorlang." } },
      { heading: 'Ko\'p jarayonli tuzilish', bullets: ["Har sayt odatda alohida jarayonda: bittasi qulasa, qolganlari ishlaydi.", "JavaScript dvigatellari: V8, SpiderMonkey, JavaScriptCore.", "Kamera, mikrofon, joylashuv — foydalanuvchi ruxsati bilan.", "Kuchli imkoniyatlar secure context talab qiladi (HTTPS yoki localhost)."] },
      { heading: 'Qo\'llab-quvvatlash', code: { lang: 'js', text: "if ('geolocation' in navigator) {\n  // imkoniyat bor — ishlatamiz\n}" }, text: "Brauzer nomini emas, imkoniyat borligini tekshiring (feature detection)." },
    ],
    life: [
      ['🛒', "Savat saqlanib qoldi", "localStorage: brauzer yopilib ochilsa ham turadi."],
      ['🪟', "Ikkinchi tabda bo'sh", "sessionStorage har tabda alohida."],
    ],
    tip: "Serverga kerak bo'lmagan ma'lumotni cookie ga yozmang: u har so'rovda ortiqcha yuk bo'ladi.",
    mistakes: [
      ['localStorage ga obyektni to\'g\'ridan-to\'g\'ri yozish.', "JSON.stringify / JSON.parse.", "\"[object Object]\" saqlanadi."],
      ['Katta ro\'yxatni localStorage da saqlash.', "IndexedDB.", "Sinxron o'qish asosiy oqimni to'sadi."],
      ['userAgent ga qarab imkoniyatni taxmin qilish.', "Feature detection.", "Satr ishonchsiz va o'zgaradi."],
    ],
    recap: [
      "Cookie serverga ketadi, Web Storage ketmaydi.",
      "sessionStorage — tab umri.",
      "IndexedDB va Cache API — katta va offline ma'lumot.",
      "Sandbox, ruxsatlar va secure context himoya qiladi.",
    ],
    practice: [
      { title: 'Application paneli', text: "Biror sayt Local Storage, Session Storage va IndexedDB da nima saqlayotganini ko'ring." },
      { title: 'Xavfsiz o\'qish', text: "localStorage dan o'qishda xato va buzilgan JSON ga chidamli funksiya yozing." },
    ],
    items: [
      ch("Quyidagi kod nimani chiqaradi?", '"[object Object]"', ['"{theme:dark}"', 'obyektning o\'zi', "null qiymat"], "Qiymat satrga aylantiriladi.", "localStorage.setItem('u', { theme: 'dark' });\nconsole.log(localStorage.getItem('u'));"),
      ch("Ma'lumot faqat shu tab yopilguncha yashashi kerak. Qaysi joy?", "sessionStorage", ["localStorage", "IndexedDB", "Cache API"], "Tab umri bilan cheklangan."),
      ch("Offline ishlaydigan ilovada minglab xabarni saqlash uchun?", "IndexedDB", ["Cookie", "sessionStorage", "URL query"], "Katta, asinxron va strukturali."),
      ch("Qaysi biri har mos HTTP so'rovda serverga avtomatik yuboriladi?", "Cookie", ["localStorage", "sessionStorage", "IndexedDB"], "Shuning uchun cookie kichik bo'lishi kerak."),
      ch("http://a.uz da yozilgan localStorage ni https://a.uz ko'radimi?", "Yo'q, origin boshqa", ["Ha, domen bir xil", "Ha, faqat o'qiy oladi", "Faqat bitta tab ichida"], "Protokol ham origin qismi."),
      ch("Safari qaysi chizish dvigatelida ishlaydi?", "WebKit", ["Blink", "Gecko", "V8"], "V8 — JavaScript dvigateli."),
      ch("Sayt foydalanuvchi kompyuteridagi ixtiyoriy faylni o'zi o'qiy oladimi?", "Yo'q, sandbox ichida ishlaydi", ["Ha, HTTPS bo'lsa o'qiydi", "Ha, localStorage orqali o'qiydi", "Ha, agar cookie ruxsati bo'lsa"], "Fayl faqat foydalanuvchi o'zi tanlasa beriladi."),
      ch("Imkoniyatni ishlatishdan oldin eng to'g'ri tekshiruv?", "'share' in navigator", ["navigator.userAgent.includes('Chrome')", "window.innerWidth > 768", "location.protocol === 'file:'"], "Feature detection brauzer nomiga bog'liq emas."),
      ch("localStorage ning katta hajmda yomon tomoni nima?", "Sinxron: asosiy oqimni to'sadi", ["Ma'lumot serverga ketib qoladi", "Har yangilashda o'chib ketadi", "Faqat sonlarni saqlay oladi"], "O'qish va yozish tugamaguncha JS kutadi."),
      fill("Service Worker bilan so'rov-javoblarni saqlaydigan API: ... API", "Cache", "Cache API.", ["cache", "Cache API"]),
      fill("Chrome va Edge ning chizish dvigateli:", "Blink", "Blink.", ["blink"]),
      fill("localStorage ga obyekt yozishdan oldin chaqiriladigan metod: JSON.…", "stringify", "JSON.stringify.", ["JSON.stringify", "stringify()", "JSON.stringify()"]),
    ],
  });
};
