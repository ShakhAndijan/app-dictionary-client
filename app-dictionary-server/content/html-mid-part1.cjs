// HTML, MIDDLE level, lessons 1-4: semantic structure, parser and content model, script loading, images and media.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Semantik arxitektura va landmarklar",
    intro: "Sahifani ma'noli qismlarga ajratish: landmarklar, sarlavhalar daraxti, section / article / div tanlovi va to'g'ri jadval.",
    what: "Middle dasturchi tegni ko'rinishiga qarab emas, vazifasiga qarab tanlaydi. Semantic (ma'noli) teg brauzerga, qidiruv tizimiga va screen reader (ekran o'qish dasturi) ga qism nima ekanini aytadi. Natija: landmark (mo'ljal) lar paydo bo'ladi va foydalanuvchi sahifa bo'ylab sakrab yura oladi.",
    analogy: { icon: '🏢', title: "Bino ko'rsatkichlari", text: "Katta binoda \"Chiqish\", \"Qabulxona\", \"Lift\" yozuvlari bo'lmasa, har bir eshikni ochib ko'rishga to'g'ri keladi. Landmark ham shunday ko'rsatkich: ekran o'qish dasturi foydalanuvchisi \"asosiy qismga\" yoki \"navigatsiyaga\" bir tugma bilan o'tadi." },
    defs: [
      ['Landmark (mo\'ljal)', "Sahifaning katta qismini bildiruvchi rol: banner, navigation, main, complementary, contentinfo, search, region."],
      ['Accessible name (element nomi)', "Ekran o'qish dasturi element uchun aytadigan nom. nav va section ga aria-label yoki aria-labelledby bilan beriladi."],
      ['Heading outline (sarlavhalar daraxti)', "h1–h6 darajalaridan hosil bo'ladigan mundarija."],
      ['Content model (tarkib qoidasi)', "Element ichiga nima qo'yish mumkinligini belgilovchi qoida."],
    ],
    uses: [
      ['Yangi sahifa maketini boshlashda', "Avval landmarklar va sarlavhalar daraxtini chizasiz, keyin stil."],
      ["Code review (kod ko'rigi) da", "Hamma narsa div bo'lib qolgan joylarni semantik teglarga almashtirasiz."],
      ["Test yozishda", "getByRole faqat to'g'ri rol va nom bo'lsa elementni topadi."],
    ],
    sections: [
      { heading: 'Teg va landmark roli', table: { head: ['Teg', 'Landmark roli', 'Shart'], rows: [['header', 'banner', "faqat article/section/aside/nav/main ichida BO'LMASA"], ['footer', 'contentinfo', "xuddi shu shart"], ['nav', 'navigation', "doim"], ['main', 'main', "ko'rinadigani bitta"], ['aside', 'complementary', "yondosh mazmun"], ['section', 'region', "faqat nomi (aria-label / labelledby) bo'lsa"], ['form', 'form', "faqat nomi bo'lsa"], ['search', 'search', "qidiruv yoki filtr"]] } },
      { heading: 'Ikkita nav: nom bering', code: { lang: 'html', text: '<header>\n  <nav aria-label="Asosiy">...</nav>\n</header>\n<main>\n  <nav aria-label="Sahifa mundarijasi">...</nav>\n  <section aria-labelledby="rev-title">\n    <h2 id="rev-title">Sharhlar</h2>\n    <article>\n      <h3>Zo\'r noutbuk</h3>\n      <footer>Ali, 12-noyabr</footer>\n    </article>\n  </section>\n</main>' } },
      { heading: "section, article yoki div?", bullets: ["Alohida olinganda ham ma'noli va boshqa joyga ko'chirsa bo'ladi (post, sharh, mahsulot kartasi): article.", "Sarlavhaga loyiq mavzuli bo'lim: section.", "Faqat CSS yoki JS uchun o'rash: div. div yomon emas, u ma'nosiz konteyner."] },
      { heading: "To'g'ri jadval", code: { lang: 'html', text: '<table>\n  <caption>Oktyabr sotuvlari</caption>\n  <thead>\n    <tr><th scope="col">Mahsulot</th><th scope="col">Soni</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">Noutbuk</th><td>12</td></tr>\n  </tbody>\n</table>' }, callout: { kind: 'info', text: "caption — jadval nomi, th — sarlavha katagi, scope — sarlavha ustungami (col) yoki qatorgami (row) tegishli ekanini aytadi." } },
    ],
    life: [
      ['🗞️', 'Yangiliklar sayti', "Har bir yangilik article, \"O'qishni tavsiya etamiz\" bloki aside, bo'limlar section."],
      ['🛒', "Do'kon filtri", "Filtr formasi search ichida, mahsulot kartalari article."],
    ],
    tip: "Avval so'rang: \"Bu qism nima?\" Javobga mos teg bo'lsa, o'shani yozing. Sarlavha darajasi tuzilish uchun, o'lcham CSS uchun.",
    mistakes: [
      ['Har bir o\'ramni <section> qilish.', "Sarlavhasiz o'ram uchun div.", "Keraksiz section hech narsa bermaydi va tuzilishni xiralashtiradi."],
      ['<main> ni header ichiga qo\'yish.', "main alohida, header va footer yonida.", "main sahifaning asosiy mazmuni."],
      ['Jadvalni sahifa maketi uchun ishlatish.', "Maket uchun CSS Grid yoki Flexbox.", "Ekran o'qish dasturi uni ma'lumot jadvali deb o'qiydi."],
    ],
    recap: [
      "header/footer faqat body darajasida banner/contentinfo bo'ladi.",
      "section nomi bo'lsagina region landmarkiga aylanadi.",
      "Bir xil turdagi bir nechta landmarkka alohida nom beriladi.",
      "Sarlavhalar darajasi sakramaydi; jadvalda caption, th va scope bor.",
    ],
    practice: [
      { title: 'Landmarklarni tekshiring', text: "Ixtiyoriy saytda F12 → Elements → Accessibility panelida header, nav, main qanday rol olganini ko'ring." },
      { title: 'Maketni qayta yozing', text: "Faqat div dan iborat sahifa yozing, keyin uni header, nav, main, article, aside, footer bilan qayta tuzing." },
    ],
    items: [
      ch("Quyidagi kodda ichki <footer> qanday landmark rolini oladi?", "Landmark olmaydi", ["contentinfo", "complementary", "banner"], "footer article ichida bo'lsa, u shu maqolaning oxiri xolos. contentinfo faqat sahifa darajasidagi footer ga beriladi.", '<body>\n  <article>\n    <h2>Post</h2>\n    <footer>Muallif: Ali</footer>\n  </article>\n</body>'),
      ch("<section> qachon ekran o'qish dasturida region landmarki bo'lib ko'rinadi?", "Unga accessible name berilganda", ["Ichida kamida ikkita paragraf bo'lganda", "main ichida joylashganda doim", "Unga id atributi yozilganda"], "Nom aria-label yoki aria-labelledby bilan beriladi. Nomsiz section landmark hisoblanmaydi."),
      ch("Sahifada asosiy menyu va maqola mundarijasi bor, ikkalasi ham <nav>. Eng to'g'ri yechim qaysi?", "Har biriga alohida aria-label berish", ["Ikkinchisini <div> ga almashtirish", "Ikkalasini bitta <nav> ga birlashtirish", "Birinchisiga role=\"main\" qo'shish"], "Aks holda foydalanuvchi ro'yxatda ikkita bir xil \"navigation\" ko'radi va farqlay olmaydi."),
      ch("Internet-do'konda har bir mahsulot kartasi uchun qaysi teg eng mos?", "<article>", ["<aside>", "<section>", "<figure>"], "Karta alohida olinganda ham to'liq ma'noga ega va boshqa joyda qayta ishlatiladi."),
      ch("Ushbu belgilashdagi asosiy muammo nima?", "Sarlavha darajasi sakragan", ["main ichida h1 bo'lishi mumkin emas", "section ichida h4 umuman taqiqlangan", "p dan keyin sarlavha kelishi mumkin emas"], "h1 dan keyin h2 kutiladi. Sarlavhalar bo'yicha yuradigan foydalanuvchi o'rtada bo'lim yo'qolgan deb o'ylaydi.", '<main>\n  <h1>Kurs</h1>\n  <section>\n    <h4>Dars rejasi</h4>\n    <p>...</p>\n  </section>\n</main>'),
      ch("Jadvalning birinchi ustunidagi mahsulot nomi o'z qatoriga sarlavha. To'g'ri yozuv qaysi?", "<th scope=\"row\">Noutbuk</th>", ["<th scope=\"col\">Noutbuk</th>", "<td scope=\"row\">Noutbuk</td>", "<td class=\"th\">Noutbuk</td>"], "scope=\"row\" shu qatordagi kataklar sarlavhasi ekanini bildiradi, ekran o'qish dasturi katak bilan birga o'qiydi."),
      ch("Qaysi gap NOTO'G'RI?", "Sahifada <header> faqat bir marta yozilishi mumkin", ["<footer> bir sahifada bir necha marta bo'lishi mumkin", "<article> ichida o'z <header> qismi bo'lishi mumkin", "Ko'rinadigan <main> sahifada bitta bo'ladi"], "header har bir article yoki section da bo'lishi mumkin; faqat sahifa darajasidagisi banner roli oladi."),
      ch("Testda screen.getByRole('region', { name: 'Sharhlar' }) elementni topmayapti. Kod: <section><h2>Sharhlar</h2></section>. Tuzatish qaysi?", "section ga aria-labelledby bilan h2 id sini bog'lash", ["h2 ni h1 ga almashtirish", "section ga class=\"region\" yozish", "h2 ga role=\"region\" va aria-level=\"2\" atributlarini qo'shish"], "Ichidagi sarlavha o'zi section ga nom bermaydi; bog'lanishni aniq ko'rsatish kerak."),
      fill("Jadvalning nomini beradigan teg qaysi? (faqat teg nomini yozing)", "caption", "caption table ning birinchi bolasi bo'ladi va jadval nomi sifatida o'qiladi.", ["<caption>"]),
      fill("Filtr va qidiruv qismi uchun search landmarkini beradigan HTML teg nomi:", "search", "<search> — qidiruv yoki filtr boshqaruvlarini o'raydigan teg.", ["<search>"]),
      fill("Sahifa darajasidagi <header> oladigan landmark roli (inglizcha):", "banner", "body darajasidagi header — banner, footer — contentinfo."),
      order("Hujjat tuzilishini yuqoridan pastga tartiblang:", ['<header>', '<nav>', '</header>', '<main>', '</main>', '<footer>'], "Odatda nav header ichida turadi, keyin main, oxirida footer."),
    ],
  });

  /* 2 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Parser, content model va atributlar",
    intro: "Brauzer xato HTML ni qanday \"tuzatadi\", nimani nima ichiga qo'yish mumkin, boolean va data-* atributlari qanday ishlaydi.",
    what: "HTML parser (tahlil qiluvchi) xato ko'rsatmaydi: u spetsifikatsiya qoidasi bo'yicha DOM (hujjat obyekt modeli) daraxtini o'zi tuzatadi. Shu sababli siz yozgan kod va brauzerdagi DOM boshqacha bo'lishi mumkin. Bu CSS buglari va React dagi hydration (serverdan kelgan HTML ni jonlantirish) xatolarining yashirin sababi.",
    analogy: { icon: '📮', title: "Tirishqoq pochtachi", text: "Manzil xato yozilgan xatni pochtachi qaytarmaydi, o'zicha taxmin qilib yetkazadi. Ko'pincha to'g'ri chiqadi, lekin ba'zan boshqa eshikka tashlab ketadi — va siz nima bo'lganini bilmaysiz." },
    defs: [
      ['Void element (ichi bo\'sh element)', "Kontenti va yopuvchi tegi yo'q: img, input, br, hr, meta, link, source, track."],
      ['Boolean attribute (mantiqiy atribut)', "Mavjudligining o'zi \"ha\" degani: disabled, checked, required, readonly, multiple."],
      ['Standards / quirks mode (standart / eski rejim)', "DOCTYPE bo'lsa standart rejim, bo'lmasa brauzer eski xatolarni taqlid qiladi."],
      ['data-* (o\'z atributingiz)', "Elementga ma'lumot biriktirish; JavaScript da dataset orqali o'qiladi."],
    ],
    uses: [
      ["Bug qidirishda", "Elements panelida real DOM ni ko'rib, kod bilan solishtirasiz."],
      ["SSR (server tomonda chizish) da", "Noto'g'ri ichma-ich joylash hydration xatosini beradi."],
      ["JS bilan bog'lashda", "data-id kabi atributlar orqali elementdan ma'lumot olasiz."],
    ],
    sections: [
      { heading: 'Parser tuzatadigan holatlar', code: { lang: 'html', text: '<p><div>Matn</div></p>\n<!-- DOM: <p></p><div>Matn</div><p></p> -->\n\n<table><tr><td>1</td></tr></table>\n<!-- DOM: <table><tbody><tr>... -->\n\n<div />Salom\n<!-- "/" e\'tiborsiz: div OCHIQ qoladi, Salom uning ichida -->' } },
      { heading: "Ichma-ich joylash qoidalari", bullets: ["p ichiga blok element (div, ul, h2, table) qo'yilmaydi.", "a va button ichiga boshqa interaktiv element qo'yilmaydi.", "ul va ol ning bevosita bolasi li bo'ladi.", "a ichiga blok element qo'yish mumkin (ota element ruxsat bersa): butun kartani havola qilish yaroqli.", "form ichiga form qo'yilmaydi."] },
      { heading: 'Atribut va property farqi', code: { lang: 'js', text: '// <input id="q" value="a" disabled="false">\nq.disabled;                 // true — qiymatga qaralmaydi\nq.value = \'b\';\nq.value;                    // "b"  (property: hozirgi holat)\nq.getAttribute(\'value\');    // "a"  (atribut: boshlang\'ich qiymat)\n\n// <li data-product-id="42" data-in-stock="false">\nli.dataset.productId;       // "42" — doim satr\nli.dataset.inStock;         // "false" — bu ham satr!' } },
    ],
    life: [
      ['🧩', 'Next.js xatosi', "<p> ichiga <div> chiqaradigan komponent \"Hydration failed\" beradi, chunki brauzer DOM ni o'zgartirgan."],
      ['🎛️', 'Yoqilmayotgan tugma', "disabled=\"false\" yozilgan tugma baribir o'chiq: atributni butunlay olib tashlash kerak."],
    ],
    tip: "Shubha bo'lsa, kodni emas, Elements panelidagi DOM ni tekshiring — brauzer aynan shu bilan ishlaydi.",
    mistakes: [
      ['disabled="false" bilan tugmani yoqish.', "button.disabled = false yoki atributni olib tashlash.", "Boolean atributda qiymat o'qilmaydi."],
      ['<div /> ni o\'zi yopiladi deb o\'ylash.', "<div></div> yozish.", "Void bo'lmagan elementda \"/\" e'tiborsiz qoldiriladi."],
      ['dataset qiymatini son deb qo\'shish.', "Number(el.dataset.price) bilan o'girish.", "dataset doim satr qaytaradi."],
    ],
    recap: [
      "Parser xatoni jim tuzatadi va DOM kodingizdan farq qilishi mumkin.",
      "p ichida blok element, a/button ichida interaktiv element bo'lmaydi.",
      "Boolean atributning qiymati ahamiyatsiz.",
      "Atribut — boshlang'ich holat, property — hozirgi holat; dataset — satr.",
    ],
    practice: [
      { title: "DOM ni solishtiring", text: "<p><ul><li>a</li></ul></p> yozing va Elements panelida brauzer nima yasaganini ko'ring." },
      { title: "dataset bilan ishlang", text: "Uchta tugmaga data-price bering va bosilganda jami summani sonlar sifatida hisoblang." },
    ],
    items: [
      ch("Brauzer quyidagi koddan qanday DOM yasaydi?", "<p></p><div>Salom</div><p></p>", ["<p><div><p>Salom</p></div></p>", "<div><p>Salom</p></div>", "<div>Salom</div>"], "div boshlanishi bilan p yopiladi; ortib qolgan </p> esa yana bitta bo'sh p yaratadi.", '<p><div>Salom</div></p>'),
      ch("Konsolda nima chiqadi?", "true", ["false", "\"false\"", "undefined"], "disabled boolean atribut: yozilganining o'zi true, qiymati o'qilmaydi.", '<button id="b" disabled="false">Yuborish</button>\n<script>\n  console.log(b.disabled);\n</script>'),
      ch("Konsolda nima chiqadi?", "105", ["15", "NaN", "TypeError"], "dataset satr qaytaradi: \"10\" + 5 birlashtirish bo'lib \"105\" chiqadi.", '<li id="x" data-price="10">...</li>\n<script>\n  console.log(x.dataset.price + 5);\n</script>'),
      ch("Foydalanuvchi maydonga \"Vali\" deb yozdi. input.getAttribute('value') nima qaytaradi? (kod: <input value=\"Ali\">)", "\"Ali\"", ["\"Vali\"", "null", "\"AliVali\""], "Atribut boshlang'ich qiymatni saqlaydi; hozirgi qiymat input.value da."),
      ch("data-user-role=\"admin\" atributi JavaScript da qanday o'qiladi?", "el.dataset.userRole", ["el.dataset['user-role']", "el.data.userRole", "el.dataset.user_role"], "Defisdan keyingi harf katta harfga aylanadi (camelCase)."),
      ch("Quyidagilardan qaysi biri HTML qoidasiga zid?", "<a href=\"/p\"><button>Olish</button></a>", ["<a href=\"/p\"><div><h3>Nom</h3></div></a>", "<ul><li><ul><li>a</li></ul></li></ul>", "<label>Ism <input name=\"n\"></label>"], "a ichida boshqa interaktiv element bo'lmaydi: fokus va bosish xatti-harakati chalkashadi."),
      ch("CSS da \"table > tr\" selektori nega ishlamaydi? (HTML da tbody yozilmagan)", "Parser o'zi tbody qo'shadi", ["tr ga > operatori qo'llanmaydi", "table bolalarini CSS ko'rmaydi", "Selektorda td ham yozilishi shart"], "DOM da zanjir table > tbody > tr bo'ladi."),
      ch("Sahifada <!DOCTYPE html> yozilmasa nima bo'ladi?", "Brauzer quirks mode da ishlaydi", ["Sahifa umuman ochilmaydi", "CSS fayllari yuklanmaydi", "JavaScript strict mode yoqiladi"], "Quirks mode (eski rejim) da box model va o'lchamlar eski brauzerlardek hisoblanadi."),
      ch("Quyidagi kodda \"Matn\" qaysi element ichida bo'ladi?", "span ichida", ["span dan tashqarida", "body ning o'zida", "Alohida p ichida"], "span void element emas, \"/\" e'tiborsiz — u ochiq qoladi va keyingi matnni o'z ichiga oladi.", '<body>\n  <span class="icon" />Matn\n</body>'),
      fill("Bir elementga faqat bitta sahifada yagona identifikator beradigan global atribut:", "id", "id takrorlanmasligi kerak: label for, ARIA va # havolalar shunga tayanadi."),
      fill("Kontenti va yopuvchi tegi bo'lmaydigan elementlar nima deb ataladi? (bitta inglizcha so'z) ... element", "void", "img, input, br, meta, link — void elementlar.", ["void element"]),
      fill("Matnda < belgisini teg bo'lib ketmasdan ko'rsatadigan entity:", "&lt;", "&lt; — less than, &gt; — greater than, &amp; — ampersand.", ["&#60;"]),
    ],
  });

  /* 3 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Skript va resurslarni yuklash",
    intro: "defer, async va module farqi, bajarilish tartibi, DOMContentLoaded va load, preload / preconnect / prefetch.",
    what: "Oddiy <script> parser ni to'xtatadi: brauzer faylni yuklab, bajarib bo'lmaguncha HTML ni o'qishni davom ettirmaydi. defer (kechiktirish), async (asinxron) va type=\"module\" yuklashni parallel qiladi, lekin bajarilish vaqti va tartibi har xil. Resource hint (resurs maslahati) lar esa kerakli faylni oldindan topib beradi.",
    analogy: { icon: '👨‍🍳', title: "Oshxona", text: "Oddiy skript — oshpaz masalliq olib kelguncha hamma ishni to'xtatib turadi. defer — yordamchi olib keladi, oshpaz ovqatni tayyorlab bo'lgach ishlatadi. async — yordamchi kelishi bilan oshpazni bo'ladi." },
    defs: [
      ['Parser-blocking (parserni to\'xtatuvchi)', "HTML tahlilini vaqtincha to'xtatib turadigan resurs."],
      ['DOMContentLoaded', "HTML o'qib bo'lingan va defer/module skriptlar bajarilgan payt."],
      ['load', "Rasm, stil va boshqa barcha resurslar ham yuklangan payt."],
      ['Preload (oldindan yuklash)', "Shu sahifaga aniq kerak resursni yuqori ustuvorlikda yuklash."],
    ],
    uses: [
      ["Sahifa sekin ochilganda", "Parserni to'xtatayotgan skriptlarga defer qo'yasiz."],
      ["Analytics ulashda", "Mustaqil uchinchi tomon skriptiga async."],
      ["Shrift yoki asosiy rasm kech chiqsa", "preload bilan brauzerga erta xabar berasiz."],
    ],
    sections: [
      { heading: "To'rt xil usul", table: { head: ['Yozuv', 'Yuklash', 'Bajarilish', 'Tartib'], rows: [['<script src>', "parserni to'xtatadi", 'darhol', 'yozilgan tartibda'], ['defer', 'parallel', 'HTML tugagach, DOMContentLoaded dan oldin', 'yozilgan tartibda'], ['async', 'parallel', "tayyor bo'lishi bilan", 'kafolat yo\'q'], ['type="module"', 'parallel', 'odatda defer kabi', 'yozilgan tartibda']] } },
      { heading: 'Nozik qoidalar', bullets: ["defer va async faqat src li klassik skriptda ishlaydi; inline skriptda e'tiborsiz.", "type=\"module\" inline bo'lsa ham kechiktiriladi va strict mode (qat'iy rejim) da ishlaydi.", "document.createElement('script') bilan qo'shilgan skript odatiy holatda async kabi bajariladi; tartib kerak bo'lsa s.async = false.", "Oddiy skript oldidan CSS yuklanayotgan bo'lsa, brauzer CSS ni kutadi."] },
      { heading: 'Resource hints', code: { lang: 'html', text: '<link rel="dns-prefetch" href="https://stats.example.com">\n<link rel="preconnect" href="https://cdn.example.com" crossorigin>\n<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="modulepreload" href="/js/chart.js">\n<link rel="prefetch" href="/keyingi-sahifa.js">' }, callout: { kind: 'warn', text: "preload da as atributi shart; shrift uchun crossorigin ham kerak, aks holda fayl ikki marta yuklanadi." } },
    ],
    life: [
      ['📊', 'Statistika skripti', "Sahifaga bog'liq emas — async."],
      ['🧱', 'Ilova va kutubxona', "lib.js dan keyin app.js kerak — ikkalasiga ham defer, tartib saqlanadi."],
    ],
    tip: "Odatiy tanlov: defer yoki type=\"module\". async — faqat hech narsaga bog'liq bo'lmagan skript uchun.",
    mistakes: [
      ['Bog\'liq ikki skriptga async qo\'yish.', "Ikkalasiga defer.", "async da qaysi biri oldin bajarilishi noma'lum."],
      ['Inline skriptga defer yozish.', "Kodni faylga chiqaring yoki type=\"module\".", "Inline klassik skriptda defer ishlamaydi."],
      ['Hamma resursga preload qo\'yish.', "Faqat 1–2 ta haqiqatan kritik faylga.", "Ortiqcha preload muhimlari bilan raqobat qiladi."],
    ],
    recap: [
      "Oddiy skript parserni to'xtatadi.",
      "defer — tartib saqlanadi, DOM tayyor; async — tartib yo'q.",
      "module odatiy holatda kechiktirilgan va strict.",
      "preload — shu sahifa uchun, prefetch — keyingi sahifa uchun.",
    ],
    practice: [
      { title: "Tartibni kuzating", text: "Uch faylga console.log yozib, ularni oddiy, defer va async bilan ulang va konsoldagi tartibni bir necha marta yangilab solishtiring." },
      { title: "Network panelida preload", text: "Shriftga preload qo'shib, Network panelida u qachon yuklanishni boshlaganini oldin va keyin solishtiring." },
    ],
    items: [
      ch("a.js katta, b.js kichik fayl. Qaysi biri birinchi bajariladi?", "Doim a.js", ["Doim b.js", "Qaysi biri oldin yuklansa", "Brauzer tasodifiy tanlaydi"], "defer skriptlar yozilgan tartibda bajariladi, hajmi ahamiyatsiz.", '<script src="a.js" defer></script>\n<script src="b.js" defer></script>'),
      ch("Shu kodda esa b.js a.js dan oldin bajarilishi mumkinmi?", "Ha, oldin yuklansa", ["Yo'q, tartib saqlanadi", "Faqat Firefox brauzerida", "Faqat HTTP/1.1 bo'lsa"], "async skript tayyor bo'lishi bilan bajariladi.", '<script src="a.js" async></script>\n<script src="b.js" async></script>'),
      ch("Konsolda nima chiqadi?", "null", ["\"Salom\"", "undefined", "Hech narsa chiqmaydi"], "Inline skriptda defer ishlamaydi: u darhol bajariladi, h1 esa hali o'qilmagan.", '<head>\n  <script defer>\n    console.log(document.querySelector("h1"));\n  </script>\n</head>\n<body><h1>Salom</h1></body>'),
      ch("Konsolda qanday tartib chiqadi? (m.js ichida console.log(\"M\"))", "I, M, D", ["M, I, D", "I, D, M", "D, I, M"], "module kechiktiriladi: avval inline I, keyin modul M, so'ng DOMContentLoaded.", '<script type="module" src="m.js"></script>\n<script>\n  document.addEventListener("DOMContentLoaded", () => console.log("D"));\n  console.log("I");\n</script>'),
      ch("DOMContentLoaded va load hodisasining asosiy farqi nima?", "load rasmlar kabi resurslarni ham kutadi", ["load faqat modul skriptlarda ishlaydi", "DOMContentLoaded rasmlardan keyin chiqadi", "load HTML o'qilishidan oldin chiqadi"], "DOMContentLoaded — DOM tayyor; load — barcha resurslar yuklangan."),
      ch("Boshqa domendagi API ga sahifa ochilishi bilan so'rov ketadi. Ulanishni (DNS, TCP, TLS) oldindan ochadigan hint qaysi?", "preconnect", ["prefetch", "dns-prefetch", "modulepreload"], "dns-prefetch faqat DNS ni, preconnect esa butun ulanishni tayyorlaydi."),
      ch("Shrift preload qilingan, lekin Network panelida ikki marta yuklanyapti. Eng ehtimoliy sabab?", "crossorigin atributi yozilmagan", ["rel=\"prefetch\" qo'shilmagan", "Shriftga defer qo'yilmagan", "Fayl woff2 formatida ekanligi"], "Shriftlar CORS rejimida so'raladi; preload ham shu rejimda bo'lmasa, brauzer uni qayta yuklaydi.", '<link rel="preload" href="/f.woff2" as="font">'),
      ch("JS bilan ikki skript qo'shildi va ular yozilgan tartibda bajarilishi kerak. Nima qilish kerak?", "Har birida s.async = false qilish", ["Har birida s.async = true qilish", "Skriptlarni body boshiga qo'shish", "src dan oldin s.type = 'text' berish"], "Dinamik skript odatiy holatda async; async=false tartibni saqlaydi."),
      ch("Foydalanuvchi keyingi sahifaga o'tishi ehtimoli katta. Uning faylini past ustuvorlikda oldindan olish uchun?", "rel=\"prefetch\"", ["rel=\"preload\"", "rel=\"preconnect\"", "rel=\"stylesheet\""], "prefetch — kelajakdagi navigatsiya uchun, preload — joriy sahifa uchun."),
      fill("preload da resurs turini ko'rsatadigan majburiy atribut nomi:", "as", "as=\"font\", as=\"image\", as=\"script\" — brauzer ustuvorlikni shundan biladi."),
      fill("ES modul skriptini ulash: <script type=\"...\">", "module", "type=\"module\" import/export ni yoqadi va skriptni kechiktiradi."),
      order("defer skriptli sahifada hodisalarni tartiblang:", ["HTML o'qiladi", "defer skript bajariladi", "DOMContentLoaded", "load"], "defer skriptlar DOMContentLoaded dan oldin, load esa barcha resurslardan keyin."),
    ],
  });

  /* 4 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Responsive rasmlar va media",
    intro: "alt qoidalari, width/height va CLS, lazy yuklash, srcset / sizes / picture, video subtitrlari va xavfsiz iframe.",
    what: "Rasm — sahifaning eng og'ir qismi. Middle dasturchi har bir ekranga mos o'lchamdagi faylni beradi (srcset), joyini oldindan ajratib sahifa sakrashining oldini oladi (width, height), pastdagi rasmlarni keyin yuklaydi (loading=\"lazy\") va alt matnini rasm vazifasiga qarab yozadi.",
    analogy: { icon: '👕', title: "Kiyim o'lchami", text: "Do'konda hammaga bitta XXL kiyim berilmaydi: S, M, L bor. srcset ham rasmning bir necha o'lchami, brauzer esa xaridorga mosini tanlaydi." },
    defs: [
      ['CLS (Cumulative Layout Shift — maketning sakrashi)', "Yuklanish paytida elementlarning kutilmaganda siljishi."],
      ['LCP (Largest Contentful Paint — eng katta kontent chizilishi)', "Ekrandagi eng katta element (ko'pincha asosiy rasm) ko'ringan vaqt."],
      ['DPR (device pixel ratio — piksel zichligi)', "Bir CSS pikselga to'g'ri keladigan qurilma pikseli."],
      ['Art direction (kadrni boshqarish)', "Kichik ekranga boshqacha kesilgan rasm berish."],
    ],
    uses: [
      ["Bir rasm turli ekranda", "srcset + sizes."],
      ["Yangi format (AVIF/WebP) va zaxira", "picture + source type."],
      ["Telefonda boshqa kadr", "picture + source media."],
      ["Tashqi video yoki xarita", "iframe: title, loading=\"lazy\", sandbox."],
    ],
    sections: [
      { heading: 'srcset va sizes', code: { lang: 'html', text: '<img src="hero-800.jpg"\n     srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"\n     sizes="(max-width: 700px) 100vw, 50vw"\n     width="1600" height="900"\n     alt="Toshkent kechasi">' }, callout: { kind: 'info', text: "Hisob: kerakli kenglik ≈ sizes bergan CSS kenglik × DPR. 400px ekran, DPR 2, 100vw → 800px → hero-800.jpg." } },
      { heading: 'picture', code: { lang: 'html', text: '<picture>\n  <source media="(max-width: 600px)" srcset="kvadrat.jpg">\n  <source srcset="keng.avif" type="image/avif">\n  <source srcset="keng.webp" type="image/webp">\n  <img src="keng.jpg" alt="Jamoamiz" width="1200" height="600">\n</picture>' }, text: "Brauzer birinchi MOS source ni oladi, qolganini ko'rmaydi. img doim bo'lishi shart: alt va o'lcham unda." },
      { heading: 'alt qoidalari', table: { head: ['Rasm turi', 'alt'], rows: [["Mazmunli rasm", "nimani bildirsa o'sha"], ["Bezak", 'alt="" (bo\'sh)'], ["Havola yoki tugma ichidagi yagona ikonka", "amal yoki manzil: \"Savatga o'tish\""], ["Diagramma", "asosiy xulosa, to'liq ma'lumot yonida matnda"]] } },
      { heading: 'Video va iframe', code: { lang: 'html', text: '<video controls preload="metadata" poster="kadr.jpg">\n  <source src="dars.webm" type="video/webm">\n  <source src="dars.mp4" type="video/mp4">\n  <track kind="captions" src="uz.vtt" srclang="uz" label="O\'zbekcha" default>\n</video>\n\n<iframe src="https://example.com/map" title="Do\'kon manzili"\n        loading="lazy" sandbox="allow-scripts"></iframe>' }, bullets: ["autoplay ko'p brauzerda faqat muted bilan ishlaydi.", "sandbox bo'sh yozilsa hamma narsa taqiqlanadi, allow-* bilan ruxsat qo'shiladi."] },
    ],
    life: [
      ['📱', 'Mobil trafik', "400px telefonga 4000px rasm yuborish — foydalanuvchi puli va vaqti isrofi."],
      ['🦘', "Sakraydigan matn", "O'lchamsiz rasm kelganda o'qiyotgan matningiz pastga tushib ketadi."],
    ],
    tip: "Birinchi ekrandagi asosiy rasm: lazy EMAS, fetchpriority=\"high\". Pastdagilar: loading=\"lazy\". Hammasida width va height.",
    mistakes: [
      ['LCP rasmiga loading="lazy".', "fetchpriority=\"high\", lazy siz.", "Asosiy rasm kech yuklanadi va LCP yomonlashadi."],
      ['Bezak rasmidan alt ni olib tashlash.', 'alt="" yozish.', "alt yo'q bo'lsa fayl nomi o'qilishi mumkin."],
      ['srcset w bilan sizes ni unutish.', "sizes qo'shish.", "sizes bo'lmasa brauzer 100vw deb hisoblaydi."],
    ],
    recap: [
      "width/height — joyni oldindan ajratadi (CLS kamayadi).",
      "srcset + sizes — o'lcham, picture — format yoki kadr.",
      "alt rasm vazifasini aytadi; bezakda bo'sh.",
      "iframe ga title, videoga captions (subtitr).",
    ],
    practice: [
      { title: "currentSrc ni tekshiring", text: "srcset li rasm yarating, ekran kengligini o'zgartirib (keshni o'chirgan holda) konsolda img.currentSrc qiymatini kuzating." },
      { title: "alt audit", text: "O'z loyihangizdagi har bir rasmni bezak, mazmunli yoki amal turiga ajratib, alt ni qayta yozing." },
    ],
    items: [
      ch("Ekran 400px, DPR 2. Brauzer odatda qaysi faylni tanlaydi?", "b.jpg (800w)", ["a.jpg (400w)", "c.jpg (1600w)", "Uchalasini ham yuklaydi"], "100vw = 400 CSS px, DPR 2 → 800 qurilma pikseli.", '<img src="a.jpg"\n     srcset="a.jpg 400w, b.jpg 800w, c.jpg 1600w"\n     sizes="100vw" alt="...">'),
      ch("sizes=\"(max-width: 600px) 100vw, 33vw\". Ekran 1200px, DPR 1. Rasm uchun brauzer taxminan necha piksel kerak deb hisoblaydi?", "400", ["1200", "600", "100"], "600px sharti bajarilmaydi, shuning uchun 33vw: 1200 × 0.33 ≈ 400."),
      ch("AVIF ni ham, WebP ni ham qo'llaydigan brauzer nimani yuklaydi?", "x.avif", ["x.webp", "x.jpg", "Eng kichik hajmlisini"], "picture da birinchi mos source olinadi — hajm solishtirilmaydi.", '<picture>\n  <source srcset="x.avif" type="image/avif">\n  <source srcset="x.webp" type="image/webp">\n  <img src="x.jpg" alt="">\n</picture>'),
      ch("Sahifa tepasidagi katta banner uchun qaysi yozuv to'g'ri?", "fetchpriority=\"high\"", ["loading=\"lazy\"", "decoding=\"sync\" va lazy", "rel=\"prefetch\""], "Banner — LCP elementi; uni kechiktirmasdan, ustuvorlik bilan yuklash kerak."),
      ch("<img> ga width va height atributlarini yozish asosan nimaga xizmat qiladi?", "Joyni oldindan ajratishga", ["Fayl hajmini kamaytirishga", "Rasmni siqib yuklashga", "Keshlash muddatini uzaytirishga"], "Brauzer nisbatni biladi va rasm kelguncha joy qoldiradi — CLS kamayadi."),
      ch("Tugmada faqat savat ikonkasi (img) bor. Eng to'g'ri alt qaysi?", "alt=\"Savatga qo'shish\"", ["alt=\"\"", "alt=\"savat ikonkasi rasmi\"", "alt=\"cart.png\""], "Ikonka tugmaning yagona mazmuni, shuning uchun alt amalni aytadi."),
      ch("Video autoplay yozilgan, lekin o'zi boshlanmayapti. Eng ehtimoliy sabab?", "muted atributi yo'q", ["controls atributi yo'q", "poster berilmagan", "track qo'shilmagan"], "Brauzerlar ovozli videoni foydalanuvchi harakatisiz boshlashga ruxsat bermaydi."),
      ch("<iframe sandbox> (qiymatsiz) ichidagi sahifada skript ishlaydimi?", "Yo'q, skriptlar bloklanadi", ["Ha, sandbox faqat cookie ga ta'sir qiladi", "Ha, faqat inline skriptlar", "Faqat bir xil domendan bo'lsa"], "Bo'sh sandbox hamma cheklovni yoqadi; skript uchun allow-scripts kerak."),
      ch("Kar yoki ovozni o'chirib ko'radigan foydalanuvchi uchun videoga nima qo'shiladi?", "<track kind=\"captions\">", ["<source type=\"text/vtt\">", "title atributida matn", "aria-label=\"video\""], "captions — nutq va muhim tovushlarning matni."),
      fill("Ko'rinish chegarasidan pastdagi rasmni keyin yuklash: loading=\"...\"", "lazy", "loading=\"lazy\" rasm ekranga yaqinlashganda yuklaydi."),
      fill("Kichik ekranga boshqa kadr berish uchun <img> ni o'raydigan teg nomi:", "picture", "picture ichida source media bilan art direction qilinadi.", ["<picture>"]),
      fill("JavaScript da brauzer aslida tanlagan rasm manzilini beradigan img property si:", "currentSrc", "img.currentSrc — srcset dan tanlangan fayl.", ["currentsrc"]),
    ],
  });
};
