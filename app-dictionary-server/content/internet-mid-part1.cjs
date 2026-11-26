// Internet, MIDDLE level, lessons 1-5: transport and latency, cookies, HTTP cache, HTTPS, CORS.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Paketlar, TCP va UDP, latency",
    intro: "Ma'lumot qanday bo'linib ketadi, TCP va UDP farqi, three-way handshake, RTT va ulanish narxini hisoblash.",
    what: "Internetda ma'lumot paket (kichik bo'lak) larga bo'linib yuboriladi. TCP (ishonchli uzatish protokoli) yetib borishi va tartibni kafolatlaydi, UDP (kafolatsiz uzatish protokoli) esa shunchaki yuboradi. Sahifa tezligiga ko'pincha kanal kengligi emas, latency (kechikish) ta'sir qiladi.",
    analogy: { icon: '🚚', title: "Yo'l kengligi va uzunligi", text: "Yo'lni to'rt qatorli qilsangiz ko'proq mashina sig'adi (bandwidth), lekin Toshkentdan Buxorogacha masofa qisqarmaydi (latency). Sahifa esa ko'plab mayda qatnovlardan iborat." },
    defs: [
      ['Latency (kechikish)', "Xabar manzilga borishi uchun ketadigan vaqt."],
      ['RTT (Round Trip Time — borib-qaytish vaqti)', "So'rov borib, javob qaytguncha o'tgan vaqt."],
      ['Bandwidth (o\'tkazuvchanlik)', "Vaqt birligida o'tadigan ma'lumot miqdori."],
      ['Three-way handshake (uch bosqichli salomlashish)', "TCP ulanishini ochish: SYN → SYN-ACK → ACK."],
      ['Hop (sakrash)', "Paketning bir routerdan keyingisiga o'tishi."],
    ],
    uses: [
      ["Sayt \"sekin\" deyilganda", "Muammo hajmdami yoki kechikishdami, ajratasiz."],
      ["CDN yoki server joyini tanlashda", "Foydalanuvchiga yaqinlik RTT ni kamaytiradi."],
      ["Real vaqt funksiyasini loyihalashda", "Video uchun yo'qotishga chidamli, chat uchun ishonchli uzatish."],
    ],
    sections: [
      { heading: 'TCP va UDP', table: { head: ['', 'TCP', 'UDP'], rows: [['Ulanish', 'avval handshake', 'ulanishsiz'], ['Yetkazish va tartib', 'kafolatlanadi', "kafolat yo'q"], ["Yo'qolgan paket", 'qayta yuboriladi', 'qayta yuborilmaydi'], ['Ishlatilishi', 'HTTP/1.1, HTTP/2, email', "DNS, video qo'ng'iroq, QUIC (HTTP/3)"]] } },
      { heading: 'Yangi HTTPS ulanish narxi (RTT = 100 ms)', table: { head: ['Qadam', 'Vaqt'], rows: [["DNS (keshda bo'lmasa)", '~100 ms'], ['TCP handshake', '~100 ms'], ['TLS 1.3 handshake', '~100 ms'], ["HTTP so'rov va birinchi bayt", '~100 ms']] }, text: "Jami ~400 ms — server hali hisoblashga vaqt sarflamasdan. TLS 1.2 da yana bir RTT qo'shiladi." },
      { heading: 'Terminalda sinash', code: { lang: 'bash', text: 'ping google.com        # RTT\ntracert google.com     # paket yo\'li (Windows)\nnslookup google.com    # domenning IP manzili\ncurl -I https://example.com   # javob header\'lari' } },
      { heading: 'Slow start', callout: { kind: 'info', text: "TCP ulanish boshida ehtiyotkor: birinchi borishda taxminan 14 KB yuboradi va tezlikni asta oshiradi. Shuning uchun muhim HTML va CSS kichik bo'lsa, birinchi chizilish tezlashadi." } },
    ],
    life: [
      ['📞', "Video qo'ng'iroq", "Yarim soniya oldingi kadrni qayta yuborishdan ma'no yo'q — UDP asosidagi uzatish mos."],
      ['🌍', "Uzoqdagi server", "100 Mbit/s tarif bilan ham Amerikadagi serverga har so'rov 200 ms atrofida borib keladi."],
    ],
    tip: "Tezlikni yaxshilashda ikki savol: nechta borib-qaytish bor va har biri qancha masofaga?",
    mistakes: [
      ['"Tarifni oshirsak sayt tezlashadi".', "RTT soni va masofasini kamaytirish.", "Mayda so'rovlar bandwidth ga emas, latency ga bog'liq."],
      ["UDP ni \"yomon protokol\" deb hisoblash.", "Vazifaga qarab tanlash.", "DNS va HTTP/3 aynan UDP ustida."],
    ],
    recap: [
      "Ma'lumot paketlarga bo'linadi va tartibsiz kelishi mumkin.",
      "TCP kafolat beradi, UDP tezroq va yengil.",
      "Yangi HTTPS ulanish bir necha RTT turadi.",
      "Ulanishni qayta ishlatish va CDN kechikishni kamaytiradi.",
    ],
    practice: [
      { title: 'RTT ni solishtiring', text: "ping bilan yaqin (.uz) va uzoq mamlakatdagi saytning kechikishini o'lchab solishtiring." },
      { title: "Yo'lni kuzating", text: "tracert bilan bitta saytgacha nechta hop borligini sanang." },
    ],
    items: [
      ch("RTT 150 ms. DNS keshda yo'q, TCP + TLS 1.3. Birinchi bayt kamida qachon keladi (server vaqti hisobsiz)?", "600 ms", ["150 ms", "300 ms", "450 ms"], "DNS, TCP, TLS va so'rov — 4 ta RTT: 4 × 150 = 600 ms."),
      ch("Shu holatda ulanish allaqachon ochiq (qayta ishlatilyapti). Keyingi so'rovning birinchi bayti taxminan qachon?", "150 ms", ["600 ms", "450 ms", "0 ms"], "Faqat so'rov-javob: 1 RTT."),
      ch("TCP handshake tartibi qaysi?", "SYN, SYN-ACK, ACK", ["ACK, SYN, SYN-ACK", "SYN, ACK, FIN-ACK", "HELLO, OK, DONE"], "Mijoz SYN, server SYN-ACK, mijoz ACK yuboradi."),
      ch("TCP da yo'ldagi bitta paket yo'qolsa nima bo'ladi?", "U qayta yuboriladi", ["Ulanish darhol uziladi", "Ma'lumot kamchil beriladi", "Barcha fayl boshidan ketadi"], "Faqat yo'qolgan qism qayta yuboriladi va tartib tiklanadi."),
      ch("Onlayn o'yindagi qahramon joylashuvi uchun UDP nega qulay?", "Eskirgan paketni kutib turmaydi", ["Paketlar hech qachon yo'qolmaydi", "Ma'lumot avtomatik shifrlanadi", "Tartib qat'iy saqlab beriladi"], "Yangi joylashuv eskisini almashtiradi, qayta yuborish faqat kechiktiradi."),
      ch("Sahifa 80 ta mayda fayldan iborat va server uzoqda. Eng ko'p foyda beradigan chora qaysi?", "Fayllarni CDN dan tarqatish", ["Tarif tezligini ikki baravar qilish", "Server diskini kattalashtirish", "Rasmlarga alt matn yozish"], "CDN foydalanuvchiga yaqin, RTT ning o'zi kamayadi."),
      ch("tracert buyrug'i nimani ko'rsatadi?", "Paket o'tadigan routerlarni", ["Domen egasining ismini", "Serverdagi ochiq fayllarni", "Brauzer keshidagi yozuvlarni"], "Har bir qator — bitta hop."),
      ch("Nega katta fayl bitta bo'lakda emas, paketlarda yuboriladi?", "Yo'qolgan qismini alohida yuborish uchun", ["Fayl hajmini kichraytirib berish uchun", "Har paketga alohida domen berish uchun", "Serverga so'rovsiz yuborish uchun"], "Bundan tashqari kanal boshqalar bilan navbatma-navbat bo'lishiladi."),
      ch("TCP slow start frontendga qanday ta'sir qiladi?", "Boshlang'ich fayllar kichik bo'lgani ma'qul", ["Birinchi so'rov server tomonidan rad etiladi", "Rasmlar HTML dan oldin keladi", "Har sahifa ikki marta yuklanadi"], "Birinchi borishda cheklangan hajm (~14 KB) ketadi."),
      fill("So'rov borib, javob qaytguncha o'tgan vaqtning 3 harfli qisqartmasi:", "RTT", "Round Trip Time.", ["rtt"]),
      fill("HTTP/3 asosidagi QUIC protokoli TCP emas, qaysi protokol ustida ishlaydi?", "UDP", "QUIC UDP ustida, ishonchlilikni o'zi ta'minlaydi.", ["udp"]),
      order("Yangi HTTPS ulanishi qadamlarini tartiblang:", ['DNS', 'TCP handshake', 'TLS handshake', 'HTTP so\'rov'], "Avval IP topiladi, keyin ulanish, shifrlash va so'rov."),
    ],
  });

  /* 2 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Cookie va holatni saqlash",
    intro: "Stateless HTTP, Set-Cookie atributlari: HttpOnly, Secure, SameSite, Max-Age, Domain; sessiya va token.",
    what: "HTTP stateless (holatsiz): server oldingi so'rovni eslamaydi. Cookie — server Set-Cookie bilan beradigan, brauzer esa keyingi so'rovlarda o'zi qaytaradigan kichik yozuv. Login holati shu yo'l bilan saqlanadi.",
    analogy: { icon: '🎫', title: "Garderob raqami", text: "Palto garderobda (server), sizda faqat raqam (cookie). Raqamni ko'rsatsangiz, kimligingiz ma'lum bo'ladi. Raqamni o'g'irlatsangiz, paltoni boshqa odam oladi." },
    defs: [
      ['Session cookie (sessiya cookie si)', "Max-Age va Expires yo'q cookie; brauzer sessiyasi tugaguncha yashaydi."],
      ['HttpOnly', "JavaScript cookie ni o'qiy olmaydi."],
      ['Secure', "Cookie faqat HTTPS orqali yuboriladi."],
      ['SameSite', "Boshqa saytdan boshlangan so'rovda cookie yuborilishini cheklaydi."],
      ['CSRF (Cross-Site Request Forgery — soxta so\'rov)', "Begona sayt sizning cookie ngiz bilan so'rov yuborishi."],
    ],
    uses: [
      ["Login qilingan holatni saqlashda", "HttpOnly, Secure, SameSite li sessiya cookie."],
      ["Logout da", "Server Max-Age=0 bilan cookie ni o'chiradi."],
      ["Subdomenlar orasida", "Domain atributi bilan ulashasiz."],
    ],
    sections: [
      { heading: 'Misol', code: { lang: 'http', text: 'HTTP/1.1 200 OK\nSet-Cookie: session=abc123; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax\n\n---- keyingi so\'rov ----\nGET /me HTTP/1.1\nCookie: session=abc123' } },
      { heading: 'SameSite qiymatlari', table: { head: ['Qiymat', "Boshqa saytdan boshlangan so'rovda"], rows: [['Strict', 'yuborilmaydi'], ['Lax', "faqat havola orqali o'tishda (top-level GET) yuboriladi"], ['None', 'yuboriladi; Secure majburiy']] } },
      { heading: 'Domain va muddat', bullets: ["Domain yozilmasa, cookie faqat o'sha hostga tegishli.", "Domain=example.com bo'lsa, subdomenlarga ham yuboriladi.", "Max-Age soniyada; 0 — o'chirish.", "Cookie hajmi taxminan 4 KB va har mos so'rovda yuboriladi."] },
      { heading: 'fetch va cookie', code: { lang: 'js', text: "// Boshqa origin dagi API ga cookie yuborish uchun:\nfetch('https://api.example.com/me', { credentials: 'include' });\n// Server: Access-Control-Allow-Credentials: true\n//         Access-Control-Allow-Origin: https://app.example.com  (* EMAS)" } },
      { heading: 'Token qayerda?', callout: { kind: 'warn', text: "localStorage dagi tokenni har qanday XSS skripti o'qiy oladi. HttpOnly cookie ni o'qib bo'lmaydi, lekin u avtomatik yuborilgani uchun CSRF himoyasi kerak." } },
    ],
    life: [
      ['🚪', "Har safar login", "Cookie da Max-Age yo'q — brauzer yopilganda sessiya yo'qolishi mumkin."],
      ['🪤', "Begona saytdagi tugma", "SameSite bo'lmasa, soxta forma bankka sizning nomingizdan so'rov yuborishi mumkin."],
    ],
    tip: "Sessiya cookie si uchun standart to'plam: HttpOnly; Secure; SameSite=Lax.",
    mistakes: [
      ['Maxfiy tokenni localStorage da saqlash va xavfni o\'ylamaslik.', "HttpOnly cookie va CSRF himoyasi.", "XSS bo'lsa token o'g'irlanadi."],
      ['SameSite=None ni Secure siz yozish.', "SameSite=None; Secure.", "Brauzer bunday cookie ni rad etadi."],
      ['credentials ni unutish.', "credentials: 'include'.", "Boshqa origin ga cookie standart holatda ketmaydi."],
    ],
    recap: [
      "HTTP holatsiz, cookie holatni olib yuradi.",
      "HttpOnly — XSS dan o'qishga qarshi, Secure — faqat HTTPS.",
      "SameSite CSRF ga qarshi.",
      "Cross-origin cookie uchun credentials va CORS ruxsati kerak.",
    ],
    practice: [
      { title: "Application paneli", text: "DevTools → Application → Cookies da biror saytning cookie atributlarini o'qing." },
      { title: 'document.cookie', text: "Konsolda document.cookie ni chiqaring va HttpOnly cookie lar ro'yxatda yo'qligini solishtiring." },
    ],
    items: [
      ch("Konsolda document.cookie nimani ko'rsatadi?", "theme=dark", ["session=abc; theme=dark", "session=abc", "bo'sh satr"], "HttpOnly cookie JavaScript ga ko'rinmaydi.", 'Set-Cookie: session=abc; HttpOnly\nSet-Cookie: theme=dark'),
      ch("Set-Cookie da Max-Age ham, Expires ham yo'q. Bu cookie qancha yashaydi?", "Brauzer sessiyasi tugaguncha", ["Roppa-rosa 24 soat", "Server qayta ishga tushguncha", "Foydalanuvchi o'chirguncha abadiy"], "Bunday cookie — sessiya cookie si."),
      ch("SameSite=Strict cookie bor. Foydalanuvchi boshqa saytdagi havola orqali saytingizga o'tdi. Birinchi so'rovda cookie ketadimi?", "Yo'q, yuborilmaydi", ["Ha, chunki bu GET", "Ha, HTTPS bo'lsa", "Faqat ikkinchi marta bosilsa"], "Strict boshqa saytdan boshlangan navigatsiyada ham cookie yubormaydi; shu sahifa ichidagi keyingi so'rovlarda ketadi."),
      ch("SameSite=Lax cookie. Begona sayt yashirin forma bilan saytingizga POST yubordi. Nima bo'ladi?", "Cookie so'rovga qo'shilmaydi", ["Cookie odatdagidek qo'shiladi", "Brauzer so'rovni o'chiradi", "Cookie qiymati bo'sh ketadi"], "Lax faqat top-level GET navigatsiyada yuboradi; cross-site POST da yo'q."),
      ch("SameSite=None cookie ishlashi uchun yana qaysi atribut majburiy?", "Secure", ["HttpOnly", "Domain", "Max-Age"], "None faqat Secure bilan qabul qilinadi."),
      ch("app.example.com va api.example.com ikkalasiga ham cookie ketishi kerak. Qaysi atribut?", "Domain=example.com", ["Path=/api", "Domain=app.example.com", "SameSite=Strict"], "Domain ota domen bo'lsa, subdomenlarga ham yuboriladi."),
      ch("Foydalanuvchi logout qildi. Server cookie ni brauzerdan qanday o'chiradi?", "Max-Age=0 bilan qayta yuboradi", ["Cookie header ni javobga yozmaydi", "401 status kodi qaytaradi", "localStorage.clear() yuboradi"], "Bir xil nom, Path va Domain bilan muddati o'tgan cookie yuboriladi."),
      ch("Quyidagi so'rovda cookie ketmayapti (API boshqa origin da). Nima yetishmaydi?", "credentials: 'include'", ["mode: 'no-cors' qiymati", "cache: 'no-store' qiymati", "method: 'OPTIONS'"], "fetch ning standart credentials qiymati same-origin.", "fetch('https://api.shop.uz/me');"),
      ch("HttpOnly cookie qaysi hujumdan to'g'ridan-to'g'ri himoya qilmaydi?", "CSRF", ["XSS orqali o'qish", "document.cookie bilan o'qish", "Skript orqali nusxalash"], "Cookie avtomatik yuboriladi, shuning uchun CSRF ga SameSite yoki token kerak."),
      fill("Cookie faqat HTTPS orqali yuborilishini belgilaydigan atribut:", "Secure", "Secure atributi.", ["secure"]),
      fill("Server cookie o'rnatadigan javob header i:", "Set-Cookie", "Brauzer esa Cookie header i bilan qaytaradi.", ["set-cookie"]),
      fill("Har bir so'rov mustaqil, server oldingisini eslamaydi — bunday protokol: ... (inglizcha)", "stateless", "HTTP — stateless protokol.", ["Stateless"]),
    ],
  });

  /* 3 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "HTTP kesh",
    intro: "Cache-Control direktivalari, ETag va 304, CDN keshi va deploy dan keyin eski kod muammosi.",
    what: "Eng tez so'rov — umuman yuborilmagan so'rov. Cache (kesh — qayta ishlatish uchun saqlangan nusxa) aynan shuni beradi. Server Cache-Control header i bilan javobni qancha va kim saqlashi mumkinligini aytadi. Muddati o'tgan nusxani ETag (versiya belgisi) bilan arzon tekshirsa bo'ladi.",
    analogy: { icon: '🥛', title: "Muzlatgichdagi sut", text: "max-age — yaroqlilik muddati: tugamaguncha do'konga bormaysiz. Muddat tugagach, \"yangisi chiqdimi?\" deb so'raysiz (ETag): o'zgarmagan bo'lsa, eskisini ishlataverasiz (304)." },
    defs: [
      ['max-age', "Nusxa necha soniya \"yangi\" hisoblanadi."],
      ['ETag (resurs versiyasi belgisi)', "Server beradigan identifikator; brauzer If-None-Match bilan qaytaradi."],
      ['304 Not Modified', "O'zgarmagan: body yuborilmaydi, eski nusxa ishlatiladi."],
      ['Content hash (mazmun xeshi)', "Fayl nomiga qo'shiladigan, mazmun o'zgarsa o'zgaradigan belgi: app-a3f9.js."],
    ],
    uses: [
      ["Build fayllarini sozlashda", "Xeshli fayl — uzoq kesh, index.html — har safar tekshirish."],
      ["Shaxsiy ma'lumotli API da", "private yoki no-store."],
      ["\"Yangiladim, o'zgarmadi\" shikoyatida", "Cache-Control va CDN keshini tekshirasiz."],
    ],
    sections: [
      { heading: 'Direktivalar', table: { head: ['Direktiva', "Ma'nosi"], rows: [['max-age=3600', "1 soat so'ramasdan ishlat"], ['no-cache', "saqla, lekin har safar serverda tekshir"], ['no-store', 'umuman saqlama'], ['private', 'faqat brauzer saqlasin, CDN emas'], ['public', 'umumiy kesh ham saqlasa bo\'ladi'], ['s-maxage=600', 'umumiy kesh (CDN) uchun muddat'], ['immutable', "o'zgarmaydi, qayta tekshirma"], ['stale-while-revalidate=60', 'eskisini ber, fonda yangila']] } },
      { heading: 'ETag bilan tekshirish', code: { lang: 'http', text: 'HTTP/1.1 200 OK\nETag: "v7"\nCache-Control: no-cache\n\n---- keyingi safar ----\nGET /style.css\nIf-None-Match: "v7"\n\nHTTP/1.1 304 Not Modified   (body yo\'q)' } },
      { heading: 'Deploy strategiyasi', table: { head: ['Fayl', 'Header'], rows: [['assets/app-a3f9.js', 'public, max-age=31536000, immutable'], ['index.html', 'no-cache'], ["shaxsiy API javobi", 'private, no-store']] }, callout: { kind: 'warn', text: "no-cache \"keshlama\" degani EMAS. Umuman saqlamaslik uchun no-store." } },
    ],
    life: [
      ['🕰️', "Eski sayt ko'rinyapti", "index.html bir hafta keshlangan: foydalanuvchi eski JS fayllarga havola oladi."],
      ['🏦', "Birovning ma'lumoti", "Shaxsiy javob public keshlansa, CDN uni boshqa odamga berishi mumkin."],
    ],
    tip: "Nomida xesh bor faylni abadiy keshlang; unga yo'l ko'rsatadigan HTML ni har safar tekshiring.",
    mistakes: [
      ['index.html ga max-age=31536000.', "no-cache.", "Yangi versiya foydalanuvchiga yetmaydi."],
      ['no-cache ni "saqlanmaydi" deb tushunish.', "Kerak bo'lsa no-store.", "no-cache saqlaydi, faqat tekshiradi."],
      ['Xeshsiz app.js ga uzoq muddat.', "Nomga mazmun xeshi qo'shish.", "Brauzer o'zgarganini bilmaydi."],
    ],
    recap: [
      "max-age davomida so'rov umuman ketmaydi.",
      "no-cache — tekshir, no-store — saqlama.",
      "ETag + If-None-Match → 304.",
      "Xeshli assetlar uzoq, HTML esa qisqa keshlanadi.",
    ],
    practice: [
      { title: 'Network da kuzating', text: "Sahifani ikki marta yangilab, Size ustunida (disk cache), (memory cache) va 304 larni toping." },
      { title: 'Header larni o\'qing', text: "curl -I bilan o'zingiz ishlatadigan saytning HTML va JS fayli Cache-Control qiymatini solishtiring." },
    ],
    items: [
      ch("Javob: Cache-Control: max-age=600. 5 daqiqadan keyin shu fayl yana kerak bo'ldi. Brauzer nima qiladi?", "So'rovsiz keshdan oladi", ["If-None-Match bilan tekshiradi", "Faylni to'liq qayta yuklaydi", "304 kelguncha kutib turadi"], "600 soniya hali tugamagan."),
      ch("Cache-Control: no-cache haqida qaysi gap to'g'ri?", "Saqlaydi, ishlatishdan oldin tekshiradi", ["Brauzer javobni umuman saqlamaydi", "Faqat CDN saqlashiga ruxsat bermaydi", "Bir kun davomida so'ramay ishlatadi"], "Umuman saqlamaslik — no-store."),
      ch("Server 304 qaytardi. Brauzer kontentni qayerdan oladi?", "O'z keshidagi nusxadan", ["304 javobining body sidan", "CDN dan qayta yuklab oladi", "Hech qayerdan, sahifa bo'sh"], "304 body siz keladi."),
      ch("Brauzer ETag qiymatini keyingi so'rovda qaysi header bilan yuboradi?", "If-None-Match", ["If-Modified-Since", "ETag-Request", "Cache-Control"], "If-Modified-Since esa Last-Modified uchun."),
      ch("Vite build: assets/index-Bq3x.js. Eng to'g'ri header qaysi?", "max-age=31536000, immutable", ["no-store, must-revalidate", "max-age=0, private", "no-cache, max-age=60"], "Mazmun o'zgarsa nom ham o'zgaradi."),
      ch("Deploy dan keyin ba'zi foydalanuvchilar eski interfeysni ko'ryapti. Eng ehtimoliy sabab?", "index.html uzoq muddatga keshlangan", ["JS fayl nomida mazmun xeshi borligi", "Server 200 status qaytargani", "Rasmlarga lazy qo'yilgani"], "Eski HTML eski fayllarga ishora qiladi."),
      ch("Foydalanuvchining balans ma'lumotini qaytaradigan API uchun qaysi biri xavfsiz?", "private, no-store", ["public, max-age=300", "s-maxage=300, public", "max-age=31536000"], "Maxfiy javob umumiy keshga tushmasligi kerak."),
      ch("Cache-Control: max-age=60, s-maxage=600. CDN javobni necha soniya yangi deb hisoblaydi?", "600", ["60", "660", "0"], "s-maxage umumiy keshlar uchun max-age dan ustun."),
      ch("stale-while-revalidate nima beradi?", "Eskisini darhol berib, fonda yangilaydi", ["Eskirgan nusxani butunlay o'chiradi", "Yangisi kelguncha sahifani to'xtatadi", "Faqat offline holatda keshni yoqadi"], "Foydalanuvchi kutmaydi, keyingi safar yangisi tayyor."),
      fill("Javobni umuman saqlamaslik direktivasi:", "no-store", "Cache-Control: no-store.", ["No-Store"]),
      fill("O'zgarmagan resurs uchun status kodi (son):", "304", "304 Not Modified."),
      fill("CDN dagi eski nusxani majburan tozalash amali (inglizcha):", "purge", "Purge — keshni tozalash.", ["Purge", "invalidate"]),
    ],
  });

  /* 4 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "HTTPS va TLS",
    intro: "HTTPS nimani kafolatlaydi, TLS handshake, sertifikat va CA, mixed content va HSTS.",
    what: "HTTPS — TLS (Transport Layer Security — transport qatlami himoyasi) bilan o'ralgan HTTP. U uch narsani beradi: maxfiylik (yo'lda o'qib bo'lmaydi), yaxlitlik (o'zgartirilsa seziladi) va autentifikatsiya (server haqiqatan o'sha domen ekani sertifikat bilan tasdiqlanadi).",
    analogy: { icon: '📨', title: "Muhrlangan konvert", text: "Oddiy HTTP — ochiq otkritka: pochtadagi har kim o'qiydi. HTTPS — muhrli konvert va pasport tekshiruvi: ochib bo'lmaydi va kimga ketayotgani tasdiqlangan." },
    defs: [
      ['Certificate (sertifikat)', "Domen kimga tegishli ekanini va ochiq kalitni tasdiqlovchi hujjat."],
      ['CA (Certificate Authority — sertifikat markazi)', "Sertifikat beradigan ishonchli tashkilot, masalan Let's Encrypt."],
      ['Symmetric key (umumiy kalit)', "Handshake dan keyin ikki tomon ma'lumotni shifrlaydigan tez kalit."],
      ['HSTS', "Brauzerga saytga faqat HTTPS bilan kirishni buyuradigan header."],
      ['Mixed content (aralash kontent)', "HTTPS sahifada HTTP orqali so'ralgan resurs."],
    ],
    uses: [
      ["Deploy da", "Sertifikat o'rnatish va avtomatik yangilanishini tekshirish."],
      ["\"Ulanish xavfsiz emas\" xatosida", "Muddat, domen mosligi va zanjirni tekshirasiz."],
      ["Zamonaviy API larda", "Geolocation, Service Worker va boshqalar secure context talab qiladi."],
    ],
    sections: [
      { heading: 'TLS handshake (soddalashtirilgan)', flow: ['Mijoz: qo\'llaydigan algoritmlar', 'Server: sertifikat', 'Brauzer: tekshiradi', 'Umumiy kalit', 'Shifrlangan HTTP'] },
      { heading: 'Brauzer sertifikatda nimani tekshiradi', bullets: ["Ishonchli CA gacha zanjir bor.", "Muddati o'tmagan.", "Domen sertifikatdagi nomga mos.", "Bekor qilinmagan."] },
      { heading: 'HTTP dan HTTPS ga', code: { lang: 'nginx', text: 'server {\n  listen 80;\n  return 301 https://$host$request_uri;\n}\n\n# HTTPS javobida:\nadd_header Strict-Transport-Security "max-age=31536000" always;' }, callout: { kind: 'info', text: "TLS 1.3 handshake 1 RTT, TLS 1.2 esa 2 RTT oladi." } },
      { heading: 'Qulf belgisi', callout: { kind: 'warn', text: "Qulf \"sayt halol\" degani emas, faqat ulanish shifrlangan degani. Fishing sayti ham HTTPS bo'ladi." } },
    ],
    life: [
      ['☕', 'Kafedagi Wi-Fi', "HTTPS siz parol shu tarmoqdagi boshqa odamga ko'rinishi mumkin."],
      ['⏳', "Birdan ochilmay qolgan sayt", "Sertifikat muddati tugagan — avtomatik yangilash sozlanmagan."],
    ],
    tip: "Hamma narsani HTTPS qiling: HTML, API, rasm, shrift. Bitta http:// manzil ham muammo.",
    mistakes: [
      ['Sertifikat xatosini "baribir o\'tish" bilan yechish.', "Sababni tuzatish.", "O'rtadagi odam hujumi shunday ko'rinadi."],
      ['HTTPS sahifada http:// skript ulash.', "https:// manzil.", "Brauzer bunday skriptni bloklaydi."],
      ['Qulfni ishonch belgisi deb bilish.', "Domen nomini diqqat bilan o'qish.", "Sertifikatni soxta sayt ham oladi."],
    ],
    recap: [
      "HTTPS: maxfiylik, yaxlitlik, autentifikatsiya.",
      "Sertifikatni CA beradi va brauzer tekshiradi.",
      "Ma'lumot tez simmetrik kalit bilan shifrlanadi.",
      "HSTS va 301 foydalanuvchini HTTPS ga olib o'tadi.",
    ],
    practice: [
      { title: 'Sertifikatni oching', text: "Brauzerda qulf belgisidan sertifikatni ochib, kim bergani va qachon tugashini toping." },
      { title: 'Redirect ni ko\'ring', text: "curl -I http://example.com bilan HTTP dan HTTPS ga yo'naltirish bor-yo'qligini tekshiring." },
    ],
    items: [
      ch("HTTPS quyidagilardan qaysi birini kafolatlamaydi?", "Sayt egasining halolligini", ["Yo'lda o'qib bo'lmasligini", "O'zgartirilsa sezilishini", "Domen sertifikatga mosligini"], "Fishing sayti ham sertifikat olishi mumkin."),
      ch("Umumiy Wi-Fi dagi kuzatuvchi HTTPS so'rovda nimani odatda ko'ra oladi?", "Qaysi serverga ulanilayotganini", ["URL dagi query parametrlarini", "So'rovdagi cookie qiymatlarini", "Yuborilgan forma ma'lumotini"], "IP va ko'pincha domen nomi ko'rinadi; yo'l, header va body shifrlangan."),
      ch("Sertifikat www.shop.uz uchun, foydalanuvchi api.boshqa.uz ga shu sertifikat bilan ulandi. Natija?", "Brauzer ogohlantirish beradi", ["Ulanish shifrsiz davom etadi", "Sertifikat o'zi moslashadi", "Faqat cookie bloklanadi"], "Domen sertifikatdagi nomlarga mos kelishi shart."),
      ch("HTTPS sahifada <script src=\"http://cdn.uz/a.js\"> bor. Nima bo'ladi?", "Skript bloklanadi yoki HTTPS ga o'tkaziladi", ["Skript odatdagidek HTTP orqali ishlaydi", "Butun sahifa HTTP rejimiga qaytib ketadi", "Skript faqat o'qish rejimida ishlaydi"], "Aktiv mixed content bajarilishiga yo'l qo'yilmaydi."),
      ch("Ma'lumotning asosiy qismi qaysi usulda shifrlanadi?", "Kelishilgan simmetrik kalit bilan", ["Sertifikatdagi ochiq kalit bilan", "Domen nomidan olingan xesh bilan", "Foydalanuvchi paroli bilan"], "Asimmetrik kriptografiya kimlikni tasdiqlash va kelishuv uchun."),
      ch("HSTS header i nima qiladi?", "Brauzer keyin faqat HTTPS bilan kiradi", ["Server cookie larini avtomatik shifrlaydi", "Sertifikatni har kuni yangilab turadi", "HTTP so'rovlarni serverda log qiladi"], "Brauzer http:// ni o'zi https:// ga aylantiradi."),
      ch("TLS 1.3 handshake TLS 1.2 ga nisbatan nima beradi?", "Bir borib-qaytish tejaladi", ["Sertifikat talab qilinmaydi", "TCP handshake yo'qoladi", "Fayllar siqilib yuboriladi"], "1 RTT vs 2 RTT."),
      ch("HTTP so'rovlarni doimiy HTTPS ga yo'naltirish uchun qaysi status kodi mos?", "301", ["302", "404", "200"], "301 (yoki 308) — doimiy ko'chirilgan."),
      ch("Quyidagilardan qaysi biri localhost dan tashqarida HTTPS (secure context) talab qiladi?", "Service Worker ro'yxatga olish", ["querySelector bilan qidirish", "localStorage ga satr yozish", "CSS animatsiyasini ishlatish"], "Kuchli imkoniyatlar faqat xavfsiz kontekstda."),
      fill("Bepul sertifikat beradigan mashhur CA: Let's ...", "Encrypt", "Let's Encrypt.", ["encrypt", "Let's Encrypt"]),
      fill("HTTPS ning standart porti (son):", "443", "HTTP — 80, HTTPS — 443."),
      order("TLS ulanish qadamlarini tartiblang:", ['algoritmlar taklifi', 'sertifikat', 'tekshiruv', 'shifrlangan ma\'lumot'], "Sertifikat tekshirilgach shifrlangan almashinuv boshlanadi."),
    ],
  });

  /* 5 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "CORS va Same-Origin Policy",
    intro: "Origin nima, preflight qachon ketadi, credentials va yulduzcha, xatoni qayerda tuzatish.",
    what: "Same-Origin Policy (bir xil manba qoidasi) bo'yicha bir origin dagi skript boshqa origin javobini o'qiy olmaydi. CORS (Cross-Origin Resource Sharing — manbalararo ulashish) server o'z header lari bilan shu cheklovdan istisno berishidir. Origin — protokol, host va port uchligi.",
    analogy: { icon: '🛃', title: "Mehmonlar ro'yxati", text: "Qorovul (brauzer) javobni faqat uy egasi (server) ro'yxatga yozgan mehmonga beradi. Ro'yxatni mehmon o'zi to'ldira olmaydi — uni faqat uy egasi o'zgartiradi." },
    defs: [
      ['Origin (manba)', "Protokol + host + port."],
      ['Preflight (oldindan so\'rov)', "Asosiy so'rovdan oldin ketadigan OPTIONS so'rovi."],
      ['Access-Control-Allow-Origin', "Qaysi origin javobni o'qiy olishini aytadi."],
      ['Opaque response (ko\'rinmas javob)', "no-cors rejimidagi, ichini o'qib bo'lmaydigan javob."],
    ],
    uses: [
      ["Frontend va API alohida domenda", "Serverda aniq origin ga ruxsat."],
      ["Mahalliy ishlab chiqishda", "Vite proxy orqali bir origin dan so'rash."],
      ["\"Postman da ishlaydi, brauzerda yo'q\" holatida", "CORS header larini tekshirasiz."],
    ],
    sections: [
      { heading: 'Bir xil originmi?', table: { head: ["https://a.com bilan", 'Natija'], rows: [['https://a.com/x', 'bir xil'], ['http://a.com', 'boshqa (protokol)'], ['https://api.a.com', 'boshqa (host)'], ['https://a.com:8443', 'boshqa (port)']] } },
      { heading: 'Qachon preflight ketadi', bullets: ["Metod PUT, PATCH yoki DELETE.", "Authorization yoki o'zingizning header ingiz bor.", "Content-Type: application/json.", "Oddiy GET va urlencoded POST preflight siz ketadi."] },
      { heading: 'Server javobi', code: { lang: 'http', text: 'OPTIONS /orders        ← preflight\nOrigin: https://app.shop.uz\nAccess-Control-Request-Method: PUT\n\nHTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.shop.uz\nAccess-Control-Allow-Methods: GET, PUT\nAccess-Control-Allow-Headers: Content-Type, Authorization\nAccess-Control-Allow-Credentials: true\nAccess-Control-Max-Age: 600\nVary: Origin' } },
      { heading: 'Mahalliy proxy', code: { lang: 'js', text: "// vite.config.js\nexport default {\n  server: { proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } } },\n};" }, callout: { kind: 'warn', text: "CORS serverni himoya qilmaydi va frontendda \"o'chirib\" bo'lmaydi. Yechim server sozlamasida." } },
    ],
    life: [
      ['🔴', "Konsoldagi qizil xato", "\"blocked by CORS policy\": so'rov ketgan bo'lishi mumkin, lekin javob skriptga berilmagan."],
      ['⭐', "Yulduzcha va cookie", "Allow-Origin: * bilan credentials li so'rov ishlamaydi."],
    ],
    tip: "CORS xatosida Network panelidan OPTIONS va asosiy so'rovni alohida oching: qaysi header yetishmayotganini ko'rasiz.",
    mistakes: [
      ["mode: 'no-cors' bilan \"tuzatish\".", "Serverda ruxsat berish.", "Javob o'qib bo'lmaydigan bo'lib qoladi."],
      ['credentials bilan Allow-Origin: *.', "Aniq origin yozish.", "Brauzer rad etadi."],
      ['Brauzer kengaytmasi bilan CORS ni o\'chirish.', "Proxy yoki server sozlamasi.", "Foydalanuvchilarda bu kengaytma yo'q."],
    ],
    recap: [
      "Origin = protokol + host + port.",
      "Nostandart so'rovdan oldin OPTIONS ketadi.",
      "Credentials uchun aniq origin va Allow-Credentials.",
      "CORS brauzer cheklovi; curl ga ta'sir qilmaydi.",
    ],
    practice: [
      { title: 'Xatoni yarating', text: "Boshqa portdagi API dan fetch qilib CORS xatosini oling, keyin serverda ruxsat bering." },
      { title: 'Preflight ni toping', text: "Content-Type: application/json bilan POST yuborib, Network da OPTIONS so'rovini ko'ring." },
    ],
    items: [
      ch("http://localhost:5173 va http://localhost:8080 bir origin mi?", "Yo'q, portlari boshqa", ["Ha, host bir xil", "Ha, ikkalasi localhost", "Faqat dev rejimida bir xil"], "Port ham origin ning qismi."),
      ch("Qaysi so'rov preflight siz ketadi?", "Header qo'shilmagan GET", ["DELETE so'rovi", "Authorization li GET", "JSON body li POST"], "Qolgan uchtasi \"oddiy\" shartiga kirmaydi."),
      ch("Preflight javobida ruxsat yo'q. Asosiy PUT so'rovi nima bo'ladi?", "Umuman yuborilmaydi", ["Yuboriladi, javob yashiriladi", "GET ga aylantirib yuboriladi", "Ikki marta qayta yuboriladi"], "Brauzer preflight dan o'tmagan so'rovni jo'natmaydi."),
      ch("Oddiy (preflight siz) POST da server Allow-Origin bermadi. Qaysi gap to'g'ri?", "Server so'rovni olgan bo'lishi mumkin", ["So'rov serverga umuman yetib bormaydi", "Javob o'qiladi, faqat status yashiriladi", "Brauzer so'rovni avtomatik bekor qiladi"], "CORS javobni o'qishni to'sadi, yuborishni emas."),
      ch("Server: Access-Control-Allow-Origin: *. So'rov credentials: 'include' bilan. Natija?", "Brauzer javobni bloklaydi", ["Cookie bilan muvaffaqiyatli ishlaydi", "Cookie siz muvaffaqiyatli ishlaydi", "Server 401 status qaytaradi"], "Credentials bilan yulduzcha ruxsat etilmaydi."),
      ch("Postman da so'rov ishlaydi, brauzerda CORS xatosi. Nega?", "CORS ni faqat brauzer qo'llaydi", ["Postman boshqa DNS ishlatadi", "Brauzer faqat GET yubora oladi", "Postman HTTPS ni o'tkazib yuboradi"], "Same-Origin Policy brauzer himoyasi."),
      ch("mode: 'no-cors' qo'yilsa nima bo'ladi?", "Javob ichini o'qib bo'lmaydi", ["CORS to'liq o'chib, JSON keladi", "Server header lari qo'shib beriladi", "Preflight ikki marta yuboriladi"], "Opaque javob: status 0, body yo'q."),
      ch("Xatoni to'g'ri tuzatish joyi qayer?", "API server sozlamasi", ["React komponenti ichidagi fetch", "Brauzer kengaytmasi", "index.html dagi meta teg"], "Ruxsatni javob header lari bilan server beradi."),
      ch("Access-Control-Max-Age nima uchun?", "Preflight natijasini keshlash", ["Cookie muddatini belgilash", "So'rov kutish vaqtini cheklash", "Javob body sini keshlash"], "Shu vaqt ichida OPTIONS qayta yuborilmaydi."),
      fill("Preflight so'rovining HTTP metodi:", "OPTIONS", "Brauzer avval OPTIONS yuboradi.", ["options"]),
      fill("Origin uch qismdan iborat: protokol, host va ...", "port", "Masalan https, a.com, 443.", ["Port"]),
      fill("Javobni o'qishga ruxsat beradigan asosiy header: Access-Control-Allow-...", "Origin", "Access-Control-Allow-Origin.", ["origin", "Access-Control-Allow-Origin"]),
    ],
  });
};
