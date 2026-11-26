// Internet, MIDDLE level, lessons 6-9: DNS setup, hosting and CDN, critical rendering path, DevTools Network.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 6 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "DNS sozlash: yozuvlar, TTL, subdomen",
    intro: "Domen qanday topiladi, A, AAAA, CNAME, TXT, MX yozuvlari, apex cheklovi, TTL va tekshirish buyruqlari.",
    what: "DNS (Domain Name System — domen nomlari tizimi) nomni IP manzilga aylantiradi. Domen egasi record (yozuv) lar qo'shadi, TTL (yashash muddati) esa javob keshda qancha turishini belgilaydi. Subdomen (ichki domen) uchun alohida domen sotib olish shart emas.",
    analogy: { icon: '📇', title: "Telefon daftari", text: "Siz ismni bilasiz, daftar raqamni beradi. Do'stlar raqamni eslab qoladi (kesh): raqam o'zgarsa, eski yozuvi bor odam biroz vaqt eskisiga qo'ng'iroq qiladi." },
    defs: [
      ['A / AAAA', "Nomni IPv4 / IPv6 manzilga bog'laydi."],
      ['CNAME', "Nomni boshqa nomga bog'laydi."],
      ['Apex (ildiz domen)', "Subdomensiz domen: example.uz."],
      ['TTL (Time To Live — yashash muddati)', "Javob keshda necha soniya saqlanadi."],
      ['Recursive resolver (qidiruvchi server)', "Sizning nomingizdan javobni qidirib topadigan DNS server."],
    ],
    uses: [
      ["Domenni hostingga ulashda", "A yoki CNAME yozuvi qo'shasiz."],
      ["Domen egaligini tasdiqlashda", "Xizmat bergan TXT yozuvini qo'shasiz."],
      ["Serverni almashtirishda", "TTL ni oldindan tushirasiz."],
    ],
    sections: [
      { heading: "So'rov yo'li", flow: ['Brauzer va OS keshi', 'Resolver', 'Root', 'TLD (.uz)', 'Authoritative'] },
      { heading: 'Yozuvlar', table: { head: ['Tur', 'Misol'], rows: [['A', 'example.uz → 203.0.113.10'], ['AAAA', 'example.uz → 2001:db8::1'], ['CNAME', 'www → loyiha.netlify.app'], ['MX', 'pochta serveri'], ['TXT', 'egalikni tasdiqlash, SPF'], ['NS', 'domenning nom serverlari']] } },
      { heading: 'Muhim cheklov', callout: { kind: 'warn', text: "Apex domenga (example.uz) odatda oddiy CNAME qo'yib bo'lmaydi: u yerda NS kabi boshqa yozuvlar bor. Provayderlar ALIAS yoki CNAME flattening beradi." } },
      { heading: 'Tekshirish', code: { lang: 'bash', text: 'nslookup example.uz\nnslookup -type=TXT example.uz\nipconfig /flushdns          # Windows DNS keshini tozalash\ndig example.uz A +short     # macOS / Linux' } },
    ],
    life: [
      ['🕐', '"DNS hali tarqalmadi"', "Aslida hech narsa tarqatilmaydi: eski javob keshlarda TTL tugaguncha yashaydi."],
      ['🧪', 'test.example.uz', "Bitta A yoki CNAME yozuvi bilan bepul sinov manzili."],
    ],
    tip: "Ko'chirishdan oldin TTL ni 300 ga tushiring va eski TTL muddati o'tishini kuting.",
    mistakes: [
      ['CNAME ga IP manzil yozish.', "IP uchun A yoki AAAA.", "CNAME faqat nomga ishora qiladi."],
      ['TTL ni o\'zgartirish bilan bir vaqtda IP ni almashtirish.', "Avval TTL, keyin kutish, keyin IP.", "Keshlarda eski katta TTL bilan javob turibdi."],
      ['Ishlatilmagan subdomen yozuvini qoldirish.', "O'chirib tashlash.", "Boshqa odam xizmatdagi nomni egallashi mumkin."],
    ],
    recap: [
      "DNS nomni IP ga aylantiradi va har qatlamda keshlaydi.",
      "A/AAAA — IP, CNAME — nom.",
      "Apex da oddiy CNAME yo'q.",
      "TTL o'zgarish qanchalik tez ko'rinishini belgilaydi.",
    ],
    practice: [
      { title: 'Yozuvlarni ko\'ring', text: "nslookup bilan bir domenning A, MX va TXT yozuvlarini toping." },
      { title: 'Subdomen rejasi', text: "Loyihangiz uchun app., api. va docs. subdomenlari qaysi yozuv bilan qayerga ishora qilishini yozib chiqing." },
    ],
    items: [
      ch("www.shop.uz ni shop.netlify.app ga bog'lash uchun qaysi yozuv?", "CNAME", ["A", "MX", "TXT"], "Nomdan nomga — CNAME."),
      ch("Hosting sizga 203.0.113.7 manzilini berdi. shop.uz uchun qaysi yozuv?", "A", ["CNAME", "AAAA", "NS"], "IPv4 — A yozuvi."),
      ch("api.shop.uz yaratish uchun nima kerak?", "DNS da yangi yozuv qo'shish", ["Yangi domen sotib olish", "Registry dan ruxsat olish", "Yangi TLD ro'yxatdan o'tkazish"], "Subdomenni domen egasi o'zi yaratadi."),
      ch("TTL 86400 edi, IP almashtirildi. Eng yomon holatda eski IP qancha vaqt ko'rinishi mumkin?", "24 soatgacha", ["5 daqiqagacha", "1 soatgacha", "Darhol yo'qoladi"], "86400 soniya = 24 soat."),
      ch("Nima uchun apex domenga oddiy CNAME qo'yilmaydi?", "U yerda boshqa yozuvlar ham bo'lishi shart", ["Apex domen IP manzilni qabul qilmaydi", "CNAME faqat .com domenida ishlaydi", "Brauzer apex domenni ochib bera olmaydi"], "CNAME o'sha nomda boshqa yozuvlar bilan birga turolmaydi."),
      ch("Pochta xizmati domenga qaysi yozuvni so'raydi (xat qabul qilish uchun)?", "MX", ["A", "CNAME", "AAAA"], "MX — mail exchanger."),
      ch("Qidiruv xizmati \"domen sizniki ekanini tasdiqlang\" dedi. Odatda nima qo'shiladi?", "TXT yozuvi", ["NS yozuvi", "A yozuvi", "MX yozuvi"], "Xizmat bergan satr TXT sifatida yoziladi."),
      ch("Resolver keshida javob yo'q. Root server undan keyin kimni so'rashni aytadi?", "TLD serverini", ["Authoritative serverni", "Brauzer keshini", "Hosting panelini"], "Root → TLD → authoritative."),
      ch("DNS ni o'zgartirdingiz, lekin faqat sizning kompyuteringizda eski IP chiqyapti. Birinchi qadam?", "Mahalliy DNS keshini tozalash", ["Serverni qayta o'rnatish", "Domenni boshqatdan sotib olish", "SSL sertifikatni o'chirish"], "ipconfig /flushdns va brauzer keshi."),
      fill("IPv6 manzil yozuvining turi:", "AAAA", "AAAA — nom → IPv6.", ["aaaa"]),
      fill("Javob keshda qancha saqlanishini belgilaydigan qiymat (3 harf):", "TTL", "Time To Live.", ["ttl"]),
      order("DNS qidiruv zanjirini tartiblang:", ['resolver', 'root', 'TLD', 'authoritative'], "Yakuniy javobni authoritative server beradi."),
    ],
  });

  /* 7 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Hosting: static, SSR va CDN",
    intro: "CSR, SSG va SSR farqi, CDN hit va miss, SPA fallback, muhit o'zgaruvchilari va rollback.",
    what: "Hosting tanlovi bitta savoldan boshlanadi: har so'rovda serverda kod ishlashi kerakmi? Yo'q bo'lsa — static hosting va CDN (Content Delivery Network — kontent yetkazish tarmog'i). Ha bo'lsa — SSR (server tomonda chizish) uchun ishlaydigan server kerak.",
    analogy: { icon: '🍱', title: "Tayyor taom va buyurtma", text: "Static — vitrinadagi tayyor taom: darhol beriladi. SSR — buyurtmaga pishirish: har kimga moslab, lekin kutish bilan. CDN — shahar bo'ylab filiallar." },
    defs: [
      ['CSR (mijozda chizish)', "Server bo'sh HTML beradi, sahifani JavaScript yig'adi."],
      ['SSG (oldindan yaratish)', "HTML build paytida tayyorlanadi."],
      ['SSR (serverda chizish)', "HTML har so'rovda serverda yaratiladi."],
      ['Cache hit / miss (keshda bor / yo\'q)', "CDN nuqtasida nusxa bor yoki origin dan olinadi."],
      ['Rollback (ortga qaytarish)', "Ishlamay qolgan versiyadan avvalgisiga qaytish."],
    ],
    uses: [
      ["Loyihani chiqarishda", "SPA, SSG yoki SSR ga qarab xizmat tanlaysiz."],
      ["Sahifani yangilaganda 404 chiqsa", "SPA fallback sozlaysiz."],
      ["Kalitlarni saqlashda", "Maxfiy narsa frontendga yozilmaydi."],
    ],
    sections: [
      { heading: 'Chizish usullari', table: { head: ['Usul', 'HTML qachon', 'Mos joyi'], rows: [['CSR', 'brauzerda', 'login ortidagi panel'], ['SSG', 'build paytida', 'blog, hujjat, landing'], ['SSR', "har so'rovda", "shaxsiy yoki tez o'zgaradigan ochiq sahifa"]] } },
      { heading: 'SPA fallback va kesh (nginx)', code: { lang: 'nginx', text: 'root /var/www/app/dist;\n\nlocation /assets/ {\n  add_header Cache-Control "public, max-age=31536000, immutable";\n}\n\nlocation / {\n  add_header Cache-Control "no-cache";\n  try_files $uri /index.html;\n}' } },
      { heading: 'Muhit o\'zgaruvchilari', callout: { kind: 'warn', text: "VITE_API_KEY kabi o'zgaruvchi build paytida JS fayliga yoziladi va hamma o'qiy oladi. Maxfiy kalit faqat serverda turadi." } },
      { heading: 'Deploy zanjiri', flow: ['push', 'test va lint', 'build', 'preview', 'production'] },
    ],
    life: [
      ['🔄', "Yangilasam 404", "/profile fayli diskda yo'q — server index.html qaytarishi kerak."],
      ['🌐', "Uzoq foydalanuvchi", "CDN fayllarni uning yaqinidagi nuqtadan beradi."],
    ],
    tip: "Avval eng soddasini tanlang: static yetarli bo'lsa, server ko'tarmang.",
    mistakes: [
      ['Maxfiy kalitni VITE_ o\'zgaruvchisiga yozish.', "Kalitni backendda saqlash.", "Build ichidan o'qib olinadi."],
      ['SPA uchun fallback siz deploy.', "try_files yoki rewrite.", "Ichki manzil to'g'ridan-to'g'ri ochilmaydi."],
      ['Rollback rejasiz chiqarish.', "Eski build ni saqlash.", "Xato chiqsa tez qaytib bo'lmaydi."],
    ],
    recap: [
      "SPA va SSG — static hosting; SSR — server kerak.",
      "CDN latency va origin yukini kamaytiradi.",
      "SPA da noma'lum yo'llar index.html ga qaytadi.",
      "Frontenddagi har narsa ochiq.",
    ],
    practice: [
      { title: 'Build ichini ko\'ring', text: "npm run build dan keyin dist papkasida VITE_ qiymatini qidirib toping." },
      { title: 'Hosting tanlang', text: "Blog, admin panel va internet-do'kon uchun rendering usuli va hosting turini asoslab yozing." },
    ],
    items: [
      ch("Vite + React SPA ni chiqarish uchun minimal nima yetarli?", "Static hosting", ["Doimiy Node serveri", "Ma'lumotlar bazasi serveri", "Har so'rovda serverless funksiya"], "Build natijasi — oddiy html, js, css."),
      ch("/orders sahifasi ichki havola bilan ochiladi, lekin yangilansa 404. Sabab?", "Serverda fallback sozlanmagan", ["JS fayllar keshlanib qolgan", "DNS yozuvi eskirib qolgan", "HTTPS sertifikat tugagan"], "Server orders nomli faylni qidiryapti."),
      ch("CDN nuqtasida fayl yo'q bo'lib, u origin dan olindi. Bu nima?", "Cache miss", ["Cache hit", "Purge", "Rollback"], "Keyingi so'rovlar hit bo'ladi."),
      ch("Quyidagi kodda qanday xavf bor?", "Maxfiy kalit brauzerga chiqib ketadi", ["O'zgaruvchi build da yo'qolib qoladi", "fetch muhit o'zgaruvchisini o'qimaydi", "Kalit faqat dev rejimida ishlaydi"], "VITE_ bilan boshlangan qiymatlar bundle ichiga yoziladi.", "fetch('https://pay.uz/charge', {\n  headers: { Authorization: import.meta.env.VITE_SECRET_KEY },\n});"),
      ch("Hujjatlar sayti kamdan-kam o'zgaradi va SEO muhim. Eng mos usul?", "SSG", ["CSR", "SSR", "WebSocket"], "Build paytida tayyor HTML: tez va arzon."),
      ch("Har foydalanuvchiga har so'rovda yangi ma'lumotli ochiq sahifa va SEO kerak. Qaysi usul?", "SSR", ["SSG", "CSR", "Static CDN"], "HTML so'rov paytida yaratiladi."),
      ch("CDN ning asosiy foydasi nima?", "Fayl yaqin nuqtadan beriladi", ["Kod xatolari avtomatik tuzaladi", "Ma'lumotlar bazasi tezlashadi", "Domen narxi arzonlashadi"], "Latency kamayadi, origin yengillashadi."),
      ch("Yangi versiya xato chiqdi. Eng tez yechim?", "Oldingi versiyaga rollback", ["Domenni boshqa serverga ko'chirish", "Foydalanuvchidan keshni tozalashni so'rash", "TTL ni nolga tushirish"], "Avval xizmatni tiklab, keyin xatoni tinch tuzatiladi."),
      ch("PR (pull request) uchun alohida vaqtinchalik manzil nima deyiladi?", "Preview deploy", ["Production", "Origin server", "Edge cache"], "Merge dan oldin natijani ko'rish uchun."),
      fill("HTML har so'rovda serverda yaratiladigan usul qisqartmasi:", "SSR", "Server-Side Rendering.", ["ssr"]),
      fill("nginx da fayl topilmasa index.html ga qaytaradigan direktiva:", "try_files", "try_files $uri /index.html;", ["try_files $uri /index.html"]),
      order("Deploy zanjirini tartiblang:", ['push', 'test', 'build', 'production'], "Test o'tgach build qilinadi va chiqariladi."),
    ],
  });

  /* 8 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Critical rendering path",
    intro: "DOM, CSSOM, render tree, layout, paint, composite; nima render va parserni to'sadi.",
    what: "Critical rendering path (muhim chizish yo'li) — brauzer baytlardan piksellargacha bosib o'tadigan qadamlar. Qaysi o'zgarish qaysi qadamni qayta ishga tushirishini bilsangiz, sekin sahifa va tutilib qoladigan animatsiya sababini topasiz.",
    analogy: { icon: '🎬', title: "Sahna tayyorlash", text: "Avval ssenariy (DOM) va kostyum ro'yxati (CSSOM), keyin kim sahnada (render tree), qayerda turadi (layout), bo'yash (paint) va qatlamlarni birlashtirish (composite)." },
    defs: [
      ['CSSOM', "CSS qoidalarining obyekt modeli."],
      ['Render tree (chizish daraxti)', "Ekranda ko'rinadigan elementlar va uslublari."],
      ['Layout / reflow (joylashuv hisobi)', "O'lcham va koordinatalarni hisoblash."],
      ['Paint (bo\'yash)', "Rang, matn va soyalarni chizish buyruqlari."],
      ['Composite (qatlam yig\'ish)', "Qatlamlarni ekranda birlashtirish."],
    ],
    uses: [
      ["Birinchi chizilish kech bo'lsa", "Render ni to'sayotgan CSS va skriptlarni kamaytirasiz."],
      ["Animatsiya tutilsa", "left/top o'rniga transform."],
      ["Sikl sekin ishlasa", "DOM o'qish va yozishni ajratasiz."],
    ],
    sections: [
      { heading: 'Qadamlar', flow: ['HTML → DOM', 'CSS → CSSOM', 'Render tree', 'Layout', 'Paint', 'Composite'] },
      { heading: "Nima to'sadi", bullets: ["CSS — render-blocking: usulsiz sahifa chizilmaydi.", "Oddiy script — parser-blocking.", "media=\"print\" li stil ekranni chizishni to'smaydi.", "Preload scanner parser kutayotganda ham resurslarni oldindan so'raydi."] },
      { heading: "O'zgarish narxi", table: { head: ["O'zgarish", 'Qayta ishlanadi'], rows: [['width, top, font-size', 'layout + paint + composite'], ['color, box-shadow', 'paint + composite'], ['transform, opacity', 'odatda faqat composite']] } },
      { heading: 'Layout thrashing', code: { lang: 'js', text: '// ❌ har qadamda majburiy layout\nfor (const el of items) el.style.width = box.offsetWidth + \'px\';\n\n// ✅ bir marta o\'qib, keyin yozish\nconst w = box.offsetWidth;\nfor (const el of items) el.style.width = w + \'px\';' } },
    ],
    life: [
      ['⬜', "Oq ekran", "Katta CSS yoki head dagi skript birinchi chizilishni kechiktiryapti."],
      ['🐢', "Tutilgan animatsiya", "left bilan har kadrda layout hisoblanyapti."],
    ],
    tip: "Kritik resurslar kam va kichik bo'lsa, foydalanuvchi mazmunni tezroq ko'radi.",
    mistakes: [
      ['Animatsiyada left/top.', "transform: translate.", "Layout har kadrda takrorlanadi."],
      ['display:none va visibility:hidden ni bir xil deb o\'ylash.', "Farqini bilib tanlash.", "visibility:hidden joy egallaydi."],
      ['Siklda o\'qib-yozishni aralashtirish.', "Avval o'qish, keyin yozish.", "Majburiy layout takrorlanadi."],
    ],
    recap: [
      "DOM + CSSOM → render tree → layout → paint → composite.",
      "CSS render ni, oddiy skript parser ni to'sadi.",
      "transform va opacity eng arzon.",
      "O'qish va yozishni guruhlang.",
    ],
    practice: [
      { title: 'Performance yozuvi', text: "DevTools → Performance da left va transform animatsiyasini yozib, Layout bloklarini solishtiring." },
      { title: 'Rendering paneli', text: "Paint flashing ni yoqib, qaysi joylar qayta bo'yalayotganini kuzating." },
    ],
    items: [
      ch("Quyidagi elementlardan qaysi biri render tree ga KIRMAYDI?", "display: none li element", ["visibility: hidden li element", "opacity: 0 li element", "Ekrandan tashqaridagi element"], "display:none umuman chizilmaydi va joy olmaydi."),
      ch("Faqat color o'zgardi. Qaysi qadam kerak EMAS?", "Layout", ["Paint", "Composite", "Hammasi kerak"], "Rang o'lcham va joylashuvga ta'sir qilmaydi."),
      ch("Silliq harakat uchun qaysi biri eng mos?", "transform: translateX()", ["left qiymatini o'zgartirish", "margin-left o'zgartirish", "width o'zgartirish"], "transform odatda faqat composite qadamida ishlaydi."),
      ch("Nega CSS render-blocking hisoblanadi?", "Uslubsiz sahifa chizilmasligi uchun", ["CSS HTML parsingni to'xtatgani uchun", "CSS JavaScript dan katta bo'lgani uchun", "CSS faqat server tomonda ishlagani uchun"], "Brauzer CSSOM tayyor bo'lmaguncha chizmaydi."),
      ch("<link rel=\"stylesheet\" href=\"p.css\" media=\"print\"> ekrandagi birinchi chizilishni to'sadimi?", "Yo'q, ekranga tegishli emas", ["Ha, har qanday CSS to'sadi", "Ha, chop etish tugaguncha", "Faqat mobil qurilmada to'sadi"], "Mos kelmaydigan media li stil render ni to'smaydi."),
      ch("Quyidagi kod nega sekin?", "Har qadamda layout majburlanadi", ["for...of sikli DOM da sekin", "style.width faqat o'qiladi", "offsetWidth serverga so'raydi"], "Yozilgandan keyin o'qish brauzerni qayta hisoblashga majbur qiladi.", "for (const el of items) {\n  el.style.width = box.offsetWidth + 'px';\n}"),
      ch("Preload scanner nima qiladi?", "Parser kutayotganda resurslarni oldindan so'raydi", ["Ishlatilmagan CSS qoidalarini oldindan o'chiradi", "Skriptlarni alohida tartibda bajarib chiqadi", "Sahifani offline holatda saqlab qo'yadi"], "Shuning uchun HTML da yozilgan resurs tezroq topiladi."),
      ch("JS bilan yaratiladigan rasm HTML dagi <img> ga nisbatan nega kech yuklanadi?", "Preload scanner uni ko'ra olmaydi", ["JS rasmlari doim siqilmaydi", "Brauzer ularga kesh bermaydi", "Ular faqat load dan keyin chiziladi"], "Rasm manzili skript bajarilgachgina ma'lum bo'ladi."),
      ch("Main thread (asosiy oqim) da 300 ms li hisob-kitob ishlayapti. Foydalanuvchi tugma bosdi. Nima bo'ladi?", "Javob hisob tugagach keladi", ["Tugma darhol ishlayveradi", "Brauzer hisobni bekor qiladi", "Bosish boshqa oqimda bajariladi"], "JS, layout va hodisalar bitta oqimda navbat bilan."),
      fill("CSS dan quriladigan obyekt model qisqartmasi:", "CSSOM", "CSS Object Model.", ["cssom"]),
      fill("O'lcham va joylashuvni qayta hisoblash (inglizcha, bir so'z):", "reflow", "Reflow yoki layout.", ["layout", "Reflow", "Layout"]),
      order("Chizish qadamlarini tartiblang:", ['render tree', 'layout', 'paint', 'composite'], "Daraxt, joylashuv, bo'yash, qatlam yig'ish."),
    ],
  });

  /* 9 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "DevTools Network: sekinlik sababini topish",
    intro: "Waterfall, Timing bosqichlari, TTFB, Size ustuni, throttling, Core Web Vitals va fetch xatolari.",
    what: "Network paneli har bir so'rov qancha kutgani, qancha hajm olgani va nega sekinligini ko'rsatadi. Middle dasturchi \"sekin\" degan shikoyatni taxmin bilan emas, o'lchov bilan tekshiradi: muammo ulanishdami, serverdami yoki fayl hajmidami.",
    analogy: { icon: '🩺', title: "Tashxis", text: "Shifokor dori yozishdan oldin tahlil oladi. Network paneli — sahifaning tahlili: og'riq qayerdaligini raqam bilan ko'rsatadi." },
    defs: [
      ['Waterfall (sharshara grafigi)', "So'rovlar vaqt bo'yicha qanday ketma-ketlikda ketgani."],
      ['TTFB (Time To First Byte — birinchi baytgacha vaqt)', "So'rovdan javobning birinchi bayti kelguncha o'tgan vaqt."],
      ['Content Download (yuklab olish)', "Javob body sini olish vaqti."],
      ['Throttling (sekinlashtirish)', "Sekin tarmoq yoki protsessorni taqlid qilish."],
      ['Core Web Vitals', "LCP (≤2.5 s), INP (≤200 ms), CLS (≤0.1)."],
    ],
    uses: [
      ["Sahifa sekin ochilsa", "Waterfall dan eng uzun zanjirni topasiz."],
      ["API xatosida", "Status, header va javob body sini o'qiysiz."],
      ["Mobil foydalanuvchini tekshirishda", "Throttling yoqasiz."],
    ],
    sections: [
      { heading: 'Timing bosqichlari', table: { head: ['Bosqich', 'Uzun bo\'lsa nimani anglatadi'], rows: [['Queueing / Stalled', "so'rov navbatda: ulanishlar band yoki ustuvorlik past"], ['DNS Lookup', 'DNS sekin'], ['Initial connection / SSL', 'server uzoq, ulanish qimmat'], ['Waiting (TTFB)', 'server sekin hisoblayapti yoki uzoq'], ['Content Download', "javob katta yoki tarmoq sekin"]] } },
      { heading: 'Foydali sozlamalar', bullets: ["Disable cache — faqat DevTools ochiq turganda ishlaydi.", "Preserve log — sahifa almashsa ham yozuv qoladi.", "Size ustunida (memory cache) yoki (disk cache) — tarmoqqa chiqilmagan.", "Copy as cURL — so'rovni terminalda takrorlash."] },
      { heading: 'fetch va status', code: { lang: 'js', text: "const res = await fetch('/api/user'); // 404 da ham reject BO'LMAYDI\nif (!res.ok) throw new Error('HTTP ' + res.status);\nconst data = await res.json();" }, callout: { kind: 'warn', text: "fetch faqat tarmoq (yoki CORS) xatosida reject bo'ladi." } },
    ],
    life: [
      ['⏱️', "2 soniya kutish", "TTFB 1.8 s — rasmni siqish yordam bermaydi, server tomonini tuzatish kerak."],
      ['📦', "5 MB rasm", "Download uzun — o'lcham va format muammosi."],
    ],
    tip: "Optimallashtirishdan oldin o'lchang, keyin yana o'lchab natijani solishtiring.",
    mistakes: [
      ['Faqat o\'z tez internetida sinash.', "Throttling bilan sinash.", "Foydalanuvchi tarmog'i boshqacha."],
      ['res.ok ni tekshirmaslik.', "Status ni tekshirib xato tashlash.", "404 javob ham muvaffaqiyatli promise."],
      ['Keshli o\'lchovni birinchi tashrif deb o\'ylash.', "Disable cache bilan o'lchash.", "Kesh natijani yaxshilab ko'rsatadi."],
    ],
    recap: [
      "Waterfall zanjirni, Timing bosqichni ko'rsatadi.",
      "TTFB — server va masofa, Download — hajm.",
      "fetch 4xx/5xx da reject bo'lmaydi.",
      "LCP, INP, CLS — foydalanuvchi tajribasi o'lchovlari.",
    ],
    practice: [
      { title: 'Eng sekin so\'rov', text: "Bir saytda Network ni Time bo'yicha tartiblab, eng sekin so'rovning Timing bo'limini tahlil qiling." },
      { title: 'Slow 4G', text: "Throttling ni yoqib sahifani oching va birinchi mazmun qachon chiqishini kuzating." },
    ],
    items: [
      ch("Timing: Waiting (TTFB) 2.4 s, Content Download 20 ms. Muammo qayerda?", "Server javobni kech beryapti", ["Javob fayli juda ham katta", "Brauzer chizishi sekin", "Rasm formati noto'g'ri"], "Yuklash tez, birinchi bayt kech."),
      ch("TTFB 80 ms, Content Download 6 s. Birinchi nima tekshiriladi?", "Javob hajmi va siqilishi", ["Ma'lumotlar bazasi so'rovi", "DNS yozuvining TTL i", "TLS sertifikat muddati"], "Server tez, lekin ko'p bayt kelyapti."),
      ch("Size ustunida \"(disk cache)\" yozilgan. Bu nima?", "So'rov tarmoqqa chiqmagan", ["Server 304 javob qaytargan", "Fayl diskka yozilmay qolgan", "CDN dan qayta yuklab olingan"], "304 bo'lsa status 304 ko'rinardi."),
      ch("Server 500 qaytardi. Quyidagi kodda qaysi biri ishlaydi?", "then bloki", ["catch bloki", "Ikkalasi ham", "Hech biri ishlamaydi"], "fetch HTTP xato statusida reject bo'lmaydi.", "fetch('/api')\n  .then(() => console.log('then'))\n  .catch(() => console.log('catch'));"),
      ch("Login dan keyin sahifa almashib, so'rov yozuvi yo'qolib qolyapti. Qaysi belgi yoqiladi?", "Preserve log", ["Disable cache", "Offline", "Big request rows"], "Preserve log yozuvlarni saqlab qoladi."),
      ch("LCP ning \"yaxshi\" chegarasi qaysi?", "2.5 soniyagacha", ["200 millisoniyagacha", "10 soniyagacha", "0.1 soniyagacha"], "200 ms — INP, 0.1 — CLS."),
      ch("Tugma bosilgandan keyin javob 800 ms kechikyapti. Qaysi metrika yomon?", "INP", ["LCP", "CLS", "TTFB"], "INP — interaksiyaga javob tezligi."),
      ch("Rasm yuklangach matn pastga sakrab ketadi. Qaysi metrika?", "CLS", ["INP", "LCP", "RTT"], "CLS maket siljishini o'lchaydi."),
      ch("Bir xil API so'rovini backend dasturchiga takrorlab berishning eng aniq yo'li?", "Copy as cURL", ["Ekran rasmini yuborish", "URL ni og'zaki aytish", "Disable cache yoqish"], "cURL buyrug'ida metod, header va body bor."),
      fill("Birinchi bayt kelguncha vaqt qisqartmasi:", "TTFB", "Time To First Byte.", ["ttfb"]),
      fill("Javob muvaffaqiyatli (200–299) ekanini bildiradigan Response property si:", "ok", "res.ok.", ["res.ok", "response.ok"]),
      fill("CLS ning yaxshi chegarasi (son):", "0.1", "CLS ≤ 0.1.", ["0,1", ".1"]),
    ],
  });
};
