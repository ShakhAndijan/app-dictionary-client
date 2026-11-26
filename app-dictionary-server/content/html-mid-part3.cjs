// HTML, MIDDLE level, lessons 9-12: accessible names and ARIA, native interactive elements, SEO, HTML security.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 9 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Accessible name va ARIA asoslari",
    intro: "Element nomi qanday hisoblanadi, ARIA qachon kerak va qachon zarar, aria-expanded va live region.",
    what: "Brauzer DOM yonida accessibility tree (qulaylik daraxti) quradi va ekran o'qish dasturi shuni o'qiydi. Unda har elementning roli, nomi va holati bor. ARIA (Accessible Rich Internet Applications) atributlari faqat shu daraxtni o'zgartiradi — fokus va klaviatura xatti-harakatini qo'shmaydi.",
    analogy: { icon: '🏷️', title: "Yorliq va mexanizm", text: "Qutiga \"tugma\" deb yorliq yopishtirsangiz, u bosiladigan bo'lib qolmaydi. role=\"button\" ham yorliq xolos: mexanizmini (fokus, Enter, Space) o'zingiz yasaysiz." },
    defs: [
      ['Role (rol)', "Element nima ekani: button, link, dialog, tab."],
      ['Accessible name (element nomi)', "aria-labelledby → aria-label → label/alt/legend/caption → ichki matn → title tartibida qidiriladi (soddalashtirilgan)."],
      ['State (holat)', "aria-expanded, aria-pressed, aria-checked, aria-invalid."],
      ['Live region (jonli hudud)', "Matni o'zgarsa, ekran o'qish dasturi o'zi e'lon qiladigan element."],
    ],
    uses: [
      ["Ikonka tugmada", "aria-label bilan nom."],
      ["Akkordeon va menyuda", "aria-expanded holatni aytadi."],
      ["\"Saqlandi\", \"3 ta natija\" kabi xabarda", "role=\"status\"."],
    ],
    sections: [
      { heading: 'ARIA qoidalari', bullets: ["Tayyor HTML element bo'lsa, ARIA emas, o'shani ishlating.", "Elementning tabiiy ma'nosini buzmang (<h2 role=\"tab\"> yomon).", "ARIA li interaktiv element klaviaturada ishlashi shart.", "Fokuslanadigan elementga aria-hidden=\"true\" qo'ymang.", "Noto'g'ri ARIA — ARIA yo'qligidan yomon."] },
      { heading: 'Eng ko\'p kerak bo\'ladigan naqshlar', code: { lang: 'html', text: '<button type="button" aria-label="Savatdan o\'chirish">\n  <svg aria-hidden="true">...</svg>\n</button>\n\n<button type="button" aria-expanded="false" aria-controls="filters">Filtrlar</button>\n<div id="filters" hidden>...</div>\n\n<nav><a href="/narxlar" aria-current="page">Narxlar</a></nav>' } },
      { heading: 'Live region', table: { head: ['Yozuv', "Qachon o'qiydi", 'Misol'], rows: [['role="status" (polite)', "hozirgi o'qishni tugatgach", "Saqlandi, natija soni"], ['role="alert" (assertive)', 'darhol, bo\'lib', "To'lov o'tmadi"]] }, callout: { kind: 'warn', text: "Live region sahifada OLDINDAN turishi kerak; matn keyin yoziladi. Matni bilan birga yaratilgan element ko'pincha e'lon qilinmaydi." } },
      { heading: 'Yashirish usullari', table: { head: ['Usul', "Ko'rinadi", "Ekran o'qish dasturi o'qiydi"], rows: [['display:none yoki hidden', "yo'q", "yo'q"], ['visibility:hidden', "yo'q", "yo'q"], ['opacity:0', "yo'q", 'ha'], ['aria-hidden="true"', 'ha', "yo'q"], ['.sr-only klassi', "yo'q", 'ha']] } },
    ],
    life: [
      ['🔔', "Jimgina saqlandi", "Ko'radigan odam yashil xabarni ko'radi, ko'ziojiz odam role=\"status\" bo'lmasa hech narsani bilmaydi."],
      ['✖️', "\"Tugma, tugma, tugma\"", "Nomsiz uchta ikonka tugmasi ekran o'qish dasturida farqsiz eshitiladi."],
    ],
    tip: "Birinchi ARIA qoidasi: ARIA yozishdan oldin oddiy HTML element yetmasligiga ishonch hosil qiling.",
    mistakes: [
      ['<div role="button"> yozib to\'xtash.', "<button> ishlatish.", "Rol klaviaturani qo'shmaydi."],
      ['Ko\'rinadigan matndan boshqa aria-label.', "Nom ko'rinadigan matnni o'z ichiga olsin.", "Ovoz bilan boshqaruvchi tugmani topolmaydi."],
      ['Hamma xabarga role="alert".', "Oddiy xabarga status.", "alert o'qishni bo'lib, asabga tegadi."],
    ],
    recap: [
      "ARIA faqat daraxtni o'zgartiradi.",
      "aria-labelledby ustun, keyin aria-label, keyin tabiiy manba.",
      "Holat o'zgarsa atributni ham yangilang.",
      "status — muloyim, alert — shoshilinch.",
    ],
    practice: [
      { title: 'Daraxtni o\'qing', text: "DevTools → Elements → Accessibility panelida o'z tugmalaringizning role va name qiymatini tekshiring." },
      { title: 'Ekran o\'qish dasturi', text: "NVDA yoki VoiceOver ni yoqib, ko'zingizni yumib login formasidan o'ting." },
    ],
    items: [
      ch("Bu tugmaning accessible name i nima?", "Yopish", ["×", "Yopish ×", "Nomi yo'q"], "aria-label ichki matndan ustun.", '<button aria-label="Yopish">×</button>'),
      ch("Bu tugmaning nomi nima?", "Buyurtma", ["Yuborish", "Tasdiqlash", "Buyurtma Tasdiqlash"], "aria-labelledby aria-label dan ham, ichki matndan ham ustun.", '<h2 id="t">Buyurtma</h2>\n<button aria-labelledby="t" aria-label="Tasdiqlash">Yuborish</button>'),
      ch("<div role=\"button\">Saqlash</div> haqida qaysi gap to'g'ri?", "Fokus va Enter o'zi qo'shilmaydi", ["Space bilan bosiladi, Enter bilan yo'q", "Tab tartibiga o'zi qo'shiladi", "Forma ichida submit bo'ladi"], "ARIA xatti-harakat bermaydi: tabindex va klaviatura hodisalarini qo'lda yozish kerak."),
      ch("Akkordeon ochilganda sarlavha tugmasida nima yangilanishi kerak?", "aria-expanded=\"true\"", ["aria-hidden=\"false\"", "aria-checked=\"true\"", "aria-live=\"polite\""], "aria-expanded ochiq/yopiq holatini aytadi."),
      ch("Qidiruvdan keyin \"12 ta natija\" matni o'qilishini xohlaysiz. Qaysi yechim ishonchli?", "Oldindan turgan role=\"status\" ga matn yozish", ["Matnli yangi role=\"status\" elementni qo'shish", "Natija soniga title atributi berish", "alert() oynasini chiqarish"], "Live region avval DOM da bo'lib, keyin matni o'zgarsa e'lon qilinadi."),
      ch("role=\"alert\" qaysi xabar uchun o'rinli?", "To'lov amalga oshmadi", ["Qoralama saqlandi", "5 ta natija topildi", "Salom, Ali"], "alert darhol bo'lib o'qiydi — faqat jiddiy holatda."),
      ch("Quyidagi kodning muammosi nima?", "Fokuslanadigan element daraxtdan yashirilgan", ["button ga type yozilsa, aria-hidden ishlamaydi", "aria-hidden faqat div uchun", "Tugma Tab tartibidan o'zi chiqadi"], "Klaviatura fokus oladi, lekin ekran o'qish dasturi hech narsa aytmaydi.", '<button aria-hidden="true">Menyu</button>'),
      ch("Matn ko'rinmasin, lekin ekran o'qish dasturi o'qisin. Qaysi usul?", ".sr-only klassi", ["display: none", "visibility: hidden", "hidden atributi"], "Qolgan uchtasi elementni daraxtdan ham chiqaradi."),
      ch("Menyuda joriy sahifa havolasini belgilash uchun?", "aria-current=\"page\"", ["aria-selected=\"page\"", "aria-active=\"true\"", "role=\"current\""], "aria-current to'plamdagi joriy elementni bildiradi."),
      fill("Qo'shimcha izoh (xato yoki yordam matni) ni elementga bog'laydigan atribut:", "aria-describedby", "aria-describedby izoh elementining id sini oladi."),
      fill("Dekorativ SVG ikonkani ekran o'qish dasturidan yashiradi: aria-hidden=\"...\"", "true", "aria-hidden=\"true\" daraxtdan olib tashlaydi."),
      fill("role=\"status\" ning aria-live qiymati:", "polite", "status — polite, alert — assertive."),
    ],
  });

  /* 10 --------------------------------------------------------------------------------------- */
  lesson({
    title: "Native interaktiv elementlar: dialog, popover, details",
    intro: "Kutubxonasiz modal, menyu va akkordeon; top layer, light dismiss, inert va hidden.",
    what: "Brauzer modal oyna, ochiluvchi menyu va akkordeonni o'zi bera oladi: dialog, popover va details. Ular fokus, Esc tugmasi va accessibility ni qo'lda yozishdan qutqaradi.",
    analogy: { icon: '🪟', title: "Tayyor deraza", text: "Derazani o'zingiz yasasangiz, tutqich, qulf va muhrni unutib qo'yasiz. Zavod derazasi (dialog) hammasi bilan keladi." },
    defs: [
      ['Modal (to\'suvchi oyna)', "Ochiq turganda orqadagi sahifa bilan ishlab bo'lmaydigan oyna."],
      ['Top layer (eng ustki qatlam)', "Har qanday z-index dan yuqorida turadigan brauzer qatlami."],
      ['Light dismiss (yengil yopish)', "Tashqariga bosish yoki Esc bilan yopilish."],
      ['inert (harakatsiz)', "Element va ichidagilar bosilmaydi, fokus olmaydi, daraxtdan chiqadi."],
    ],
    uses: [
      ["\"O'chirasizmi?\" tasdiqlashida", "dialog + showModal()."],
      ["Foydalanuvchi menyusi, tooltip, toast da", "popover."],
      ["Savol-javob (FAQ) da", "details + summary."],
    ],
    sections: [
      { heading: 'dialog', code: { lang: 'html', text: '<dialog id="confirm" aria-labelledby="t">\n  <h2 id="t">Buyurtma o\'chirilsinmi?</h2>\n  <form method="dialog">\n    <button value="cancel">Bekor qilish</button>\n    <button value="delete">O\'chirish</button>\n  </form>\n</dialog>\n<script>\n  confirm.showModal();\n  confirm.onclose = () => console.log(confirm.returnValue);\n</script>' }, bullets: ["showModal(): top layer, orqa fon to'siladi, fokus ichkariga o'tadi, Esc yopadi, ::backdrop ishlaydi.", "show() va qo'lda open atributi modal rejim BERMAYDI.", "method=\"dialog\" serverga yubormaydi, oynani yopadi va tugma value sini returnValue ga yozadi."] },
      { heading: 'popover', code: { lang: 'html', text: '<button popovertarget="menu">Menyu</button>\n<div id="menu" popover>\n  <a href="/profil">Profil</a>\n</div>' } },
      { heading: 'dialog va popover', table: { head: ['Xususiyat', 'modal dialog', 'popover (auto)'], rows: [['Orqa fon', 'bloklangan', 'ishlaydi'], ['Esc', 'yopadi', 'yopadi'], ['Tashqariga bosish', "odatda yopmaydi", 'yopadi'], ["Boshqasi ochilsa", 'ustiga ochiladi', 'avvalgisi yopiladi']] }, text: 'popover="manual" o\'zi yopilmaydi — toast uchun qulay.' },
      { heading: 'details, inert, hidden', code: { lang: 'html', text: '<details name="faq" open>\n  <summary>Yetkazish qancha?</summary>\n  <p>2–3 kun.</p>\n</details>\n<details name="faq">\n  <summary>Qaytarsa bo\'ladimi?</summary>\n  <p>14 kun ichida.</p>\n</details>' }, callout: { kind: 'warn', text: "hidden atributi kuchsiz: CSS da display: flex yozilgan element hidden bo'lsa ham ko'rinib qoladi." } },
    ],
    life: [
      ['🧱', 'z-index urushi', "Qo'lda yasalgan modal header ostida qolib ketadi; top layer da bunday bo'lmaydi."],
      ['📚', 'FAQ', "Bir xil name li details lar bittadan ochiladi — JavaScript kerak emas."],
    ],
    tip: "Tanlov: javobni majburlash kerakmi — modal dialog; shunchaki qo'shimcha oynacha — popover; matnni yig'ish — details.",
    mistakes: [
      ['Modalni open atributi bilan ochish.', "dialog.showModal().", "open fokus va fonni boshqarmaydi."],
      ['Modalni div + z-index bilan yasash.', "<dialog> ishlatish.", "Fokus tuzog'i, Esc va daraxtni qo'lda yozishga to'g'ri keladi."],
      ['[hidden] ustidan display berib qo\'yish.', "[hidden] { display: none !important }.", "Muallif CSS si brauzer uslubidan ustun."],
    ],
    recap: [
      "showModal — haqiqiy modal.",
      "popover — light dismiss li qatlam.",
      "details name — bittasi ochiq.",
      "inert butun bo'lakni muzlatadi.",
    ],
    practice: [
      { title: 'Tasdiqlash oynasi', text: "dialog bilan o'chirishni tasdiqlash yozing, returnValue ga qarab amal bajaring va fokus qayerga qaytishini tekshiring." },
      { title: 'JavaScript siz menyu', text: "popovertarget bilan menyu yasab, Esc va tashqariga bosishni sinang." },
    ],
    items: [
      ch("Qaysi usul dialogni modal qilib ochadi?", "d.showModal()", ["d.show()", "d.setAttribute('open', '')", "d.open = true"], "Faqat showModal top layer va fon bloklashni beradi."),
      ch("\"O'chirish\" bosilganda konsolda nima chiqadi?", "delete", ["cancel", "O'chirish", "true"], "method=\"dialog\" bosilgan tugmaning value sini returnValue ga yozadi.", "<dialog id=\"d\">\n  <form method=\"dialog\">\n    <button value=\"cancel\">Bekor</button>\n    <button value=\"delete\">O'chirish</button>\n  </form>\n</dialog>\n<script>\n  d.onclose = () => console.log(d.returnValue);\n  d.showModal();\n</script>"),
      ch("Modal dialogni z-index siz ham header ustida chiqishiga nima sabab?", "U top layer ga chiqadi", ["Uning z-index i cheksiz", "U body oxiriga ko'chiriladi", "Header vaqtincha yashiriladi"], "Top layer oddiy stacking context lardan yuqorida."),
      ch("Ikkita popover (auto) bor. Birinchisi ochiq turib ikkinchisi ochilsa?", "Birinchisi yopiladi", ["Ikkalasi ochiq qoladi", "Ikkinchisi ochilmaydi", "Xatolik chiqadi"], "auto rejimda (ichma-ich bo'lmasa) bittasi ochiq turadi."),
      ch("Tashqariga bosilganda ham yopilmaydigan, faqat kod bilan yopiladigan toast uchun?", "popover=\"manual\"", ["popover=\"auto\"", "popover=\"toast\"", "dialog open modal"], "manual light dismiss ni o'chiradi."),
      ch("Ikkinchi savol ochilganda birinchisi o'zi yopilishi uchun details larga nima beriladi?", "Bir xil name", ["Bir xil id", "Bir xil class", "open=\"single\""], "Bir xil name li details lar eksklyuziv guruh bo'ladi."),
      ch("Konsolda emas, ekranda nima bo'ladi?", "Element ko'rinib turadi", ["Element yashirin bo'ladi", "Joyi qoladi, o'zi ko'rinmaydi", "CSS e'tiborsiz qoladi"], "Brauzerning [hidden] uslubi muallif CSS sidagi display bilan bosiladi.", '<style>.row { display: flex; }</style>\n<div class="row" hidden>Salom</div>'),
      ch("Yon panel ochilganda orqadagi sahifaga na sichqoncha, na Tab yetmasin. Eng qisqa yechim?", "Orqa qismga inert qo'yish", ["Orqa qismga opacity: 0.5 berish", "Orqa qismga aria-hidden qo'yish", "body ga overflow: hidden berish"], "aria-hidden fokusni to'smaydi, inert esa hammasini to'sadi."),
      ch("dialog.showModal() dan keyin dialog yopilganda fokus odatda qayerga boradi?", "Uni ochgan elementga", ["body ning boshiga", "Sahifadagi birinchi havolaga", "Dialog ichida qoladi"], "Brauzer avvalgi fokusni tiklaydi."),
      fill("Tugmani popover bilan JavaScript siz bog'laydigan atribut:", "popovertarget", "popovertarget=\"popover-id\"."),
      fill("Modal dialog orqasidagi fonni bezaydigan pseudo-element: ::...", "backdrop", "dialog::backdrop { background: rgb(0 0 0 / 50%) }.", ["::backdrop"]),
      fill("details ichida bosiladigan sarlavha tegi:", "summary", "summary klaviaturada ham ishlaydi.", ["<summary>"]),
    ],
  });

  /* 11 --------------------------------------------------------------------------------------- */
  lesson({
    title: "SEO: canonical, indeks nazorati va ijtimoiy kartochka",
    intro: "crawl va index farqi, canonical, robots meta va robots.txt, Open Graph, hreflang va sitemap.",
    what: "SEO (Search Engine Optimization — qidiruv tizimiga moslash) da HTML ning vazifasi: bot sahifani topsin (crawl — aylanib o'qish), to'g'ri indeksga (index — qidiruv bazasi) kiritsin va to'g'ri ko'rsatsin. Havola ulashilganda chiqadigan kartochka esa Open Graph teglaridan olinadi.",
    analogy: { icon: '📚', title: "Kutubxona katalogi", text: "Kutubxonachi kitobni topadi (crawl), kartotekaga yozadi (index) va so'rovga qarab beradi (rank). canonical — \"bu kitobning asl nusxasi manavi\" degan yozuv." },
    defs: [
      ['canonical (asosiy manzil)', "Bir xil mazmunli URL lar ichida qaysi biri asosiy ekanini taklif qiladi."],
      ['noindex', "Sahifani qidiruv natijasiga qo'shmaslik."],
      ['robots.txt', "Botga qaysi yo'llarni aylanmaslikni aytadigan fayl."],
      ['Open Graph', "Ijtimoiy tarmoq kartochkasi uchun og:title, og:image, og:url."],
      ['hreflang', "Sahifaning boshqa til variantini ko'rsatadi."],
    ],
    uses: [
      ["?utm_source li manzillarda", "canonical toza URL ni ko'rsatadi."],
      ["Admin va savat sahifasida", "noindex."],
      ["Telegram da chiroyli havola uchun", "Open Graph teglari."],
    ],
    sections: [
      { heading: 'Asosiy teglar', code: { lang: 'html', text: '<title>Noutbuk X1 narxi — MyShop</title>\n<meta name="description" content="16 GB xotira, bepul yetkazish.">\n<link rel="canonical" href="https://myshop.uz/laptops/x1">\n<meta name="robots" content="noindex, follow">  <!-- faqat kerak sahifada -->\n\n<meta property="og:title" content="Noutbuk X1">\n<meta property="og:image" content="https://myshop.uz/og/x1.jpg">\n<meta property="og:url" content="https://myshop.uz/laptops/x1">\n<meta name="twitter:card" content="summary_large_image">' } },
      { heading: 'robots.txt va noindex', table: { head: ['Vosita', 'Nima qiladi'], rows: [['robots.txt Disallow', "aylanishni to'xtatadi, lekin URL indeksda qolishi mumkin"], ['meta robots noindex', 'indeksdan chiqaradi — bot sahifani O\'QIY OLISHI kerak']] }, callout: { kind: 'warn', text: "Disallow bilan yopilgan sahifadagi noindex ni bot ko'rmaydi. Indeksdan chiqarish uchun aylanishga ruxsat bering va noindex qo'ying." } },
      { heading: 'Ko\'p til va bot', code: { lang: 'html', text: '<html lang="uz">\n<link rel="alternate" hreflang="uz" href="https://myshop.uz/uz/x1">\n<link rel="alternate" hreflang="ru" href="https://myshop.uz/ru/x1">\n<link rel="alternate" hreflang="x-default" href="https://myshop.uz/x1">' }, bullets: ["Har til varianti o'zini ham, boshqalarni ham ko'rsatadi.", "Bot onclick ni bosmaydi: havolalar haqiqiy <a href> bo'lsin.", "Ko'p ijtimoiy botlar JavaScript bajarmaydi: og teglari server HTML ida bo'lsin.", "sitemap.xml sahifalar ro'yxatini beradi."] },
    ],
    life: [
      ['🪞', "Bir mahsulot, to'rt manzil", "Filtr va utm parametrlari dublikat yaratadi — canonical bittaga yig'adi."],
      ['🖼️', "Bo'sh kartochka", "React SPA da og teglari JS bilan qo'yilsa, Telegram ularni ko'rmaydi."],
    ],
    tip: "title har sahifada noyob va muhim so'z boshida bo'lsin; og:image — to'liq (absolute) URL.",
    mistakes: [
      ['Indeksdan chiqarish uchun faqat robots.txt.', "noindex meta.", "Disallow indeksni kafolatlamaydi."],
      ['Hamma sahifaga bosh sahifa canonical i.', "Har sahifa o'z manzilini ko'rsatsin.", "Boshqa sahifalar indeksdan tushib qolishi mumkin."],
      ['og:image="/og.jpg".', "https://... to'liq manzil.", "Tashqi bot nisbiy yo'lni ocholmasligi mumkin."],
    ],
    recap: [
      "crawl → index → rank.",
      "canonical — taklif, buyruq emas.",
      "noindex ko'rinishi uchun sahifa ochiq bo'lishi kerak.",
      "OG teglari server HTML ida va absolute URL bilan.",
    ],
    practice: [
      { title: 'Kartochkani tekshiring', text: "Biror havolani o'zingizning Saqlangan xabarlaringizga tashlab, kartochka qaysi teglardan olinganini sahifa kodidan toping." },
      { title: 'View source', text: "SPA va server renderli saytning \"View page source\" natijasini solishtiring: matn va meta teglar bormi?" },
    ],
    items: [
      ch("/x1?utm_source=tg manzili /x1 bilan bir xil mazmunda. Nima qo'yiladi?", "/x1 ga ishora qiluvchi canonical", ["utm li sahifaga robots.txt Disallow", "Har ikkisiga noindex", "utm li sahifaga yangi h1"], "canonical dublikatlarni asosiy manzilga yig'adi."),
      ch("Sahifa robots.txt da Disallow qilingan va ichida noindex bor, lekin natijada ko'rinyapti. Nega?", "Bot noindex ni o'qiy olmayapti", ["noindex faqat title bilan ishlaydi", "Disallow noindex ni bekor qilib index qiladi", "noindex faqat sitemap.xml ga yoziladi"], "Aylanish taqiqlangan sahifaning HTML i yuklanmaydi."),
      ch("meta name=\"description\" haqida qaysi gap to'g'ri?", "Natijadagi matnga ta'sir qilishi mumkin", ["Reytingni to'g'ridan-to'g'ri ko'taradi", "Sahifada foydalanuvchiga ko'rinadi", "Yozilmasa sahifa indekslanmaydi"], "Google uni snippet sifatida olishi mumkin; bosish ehtimoliga ta'sir qiladi."),
      ch("Quyidagilardan qaysi birida bot ichki sahifaga o'ta oladi?", "<a href=\"/narx\">Narx</a>", ["<span onclick=\"go('/narx')\">Narx</span>", "<button data-url=\"/narx\">Narx</button>", "<a onclick=\"go('/narx')\">Narx</a>"], "Bot href bo'yicha yuradi, hodisalarni bosmaydi."),
      ch("React SPA da og:title useEffect bilan qo'yildi, Telegram kartochkasi bo'sh. Yechim?", "Teglarni serverdan HTML ichida berish", ["useEffect o'rniga useLayoutEffect yozish", "og o'rniga data-og atributi", "Teglarni body oxiriga ko'chirish"], "Ko'p ijtimoiy botlar JavaScript ni bajarmaydi."),
      ch("Open Graph teglarida qaysi atribut ishlatiladi?", "property", ["name", "rel", "itemprop"], "<meta property=\"og:title\" content=\"...\">; Twitter teglarida esa name."),
      ch("uz va ru sahifalar uchun hreflang qayerga yoziladi?", "Har ikkisiga ikkala havola ham", ["Faqat asosiy tildagi sahifaga", "Har biriga faqat boshqasining havolasi", "Faqat robots.txt fayliga"], "Har variant o'zini va boshqalarni ko'rsatadi, aks holda e'tiborga olinmasligi mumkin."),
      ch("Mavjud bo'lmagan mahsulot sahifasi \"Topilmadi\" matni bilan 200 status qaytaryapti. Nima to'g'ri?", "404 status qaytarish", ["200 qoldirib title ni o'zgartirish", "canonical ni bosh sahifaga berish", "Sahifani sitemap ga qo'shish"], "Aks holda bot bo'sh sahifalarni haqiqiy deb indekslaydi (soft 404)."),
      ch("noindex, follow nimani anglatadi?", "Indeksga qo'shma, havolalardan yur", ["Indeksga qo'sh, havolalardan yurma", "Na indeksla, na havolalardan yur", "Faqat bir marta indeksla"], "noindex — natijada ko'rsatma; follow — havolalarni kuzat."),
      fill("Sahifaning asosiy manzilini bildiradi: <link rel=\"...\">", "canonical", "rel=\"canonical\" href=\"to'liq URL\"."),
      fill("Mos til topilmaganlar uchun hreflang qiymati:", "x-default", "x-default — standart variant."),
      order("Qidiruv tizimi bosqichlarini tartiblang:", ["crawl", "index", "rank"], "Avval topib o'qiydi, keyin bazaga yozadi, so'rovda tartiblaydi."),
    ],
  });

  /* 12 --------------------------------------------------------------------------------------- */
  lesson({
    title: "HTML xavfsizligi: XSS, iframe va CSP",
    intro: "Foydalanuvchi matnini xavfsiz chiqarish, javascript: havolalari, rel=noopener, sandbox, CSP va hidden maydon.",
    what: "XSS (Cross-Site Scripting — sahifaga begona skript kiritish) — foydalanuvchi kiritgan matn kod bo'lib bajarilishi. Asosiy qoida: ishonchsiz ma'lumotni HTML sifatida emas, matn sifatida chiqaring. Qolgan himoyalar (CSP, sandbox, SameSite) zararni kamaytiradi.",
    analogy: { icon: '✉️', title: "Xatdagi buyruq", text: "Kotib kelgan xatni ovoz chiqarib o'qishi kerak (matn), ichidagi \"seyfni och\" degan gapni bajarishi emas (kod). innerHTML — xatdagi buyruqni bajaradigan kotib." },
    defs: [
      ['Escape (zararsizlantirish)', "< kabi belgilarni matn bo'lib qoladigan shaklga o'tkazish."],
      ['Sanitize (tozalash)', "Ruxsat etilgan teglardan boshqasini olib tashlash (masalan DOMPurify)."],
      ['CSP (Content Security Policy — kontent xavfsizligi siyosati)', "Server sarlavhasi: qaysi manbadan kod yuklash mumkin."],
      ['SRI (Subresource Integrity — resurs butunligi)', "integrity xeshi mos kelmasa fayl bajarilmaydi."],
    ],
    uses: [
      ["Izoh va chat chiqarishda", "textContent yoki freymvorkning avtomatik escape i."],
      ["Foydalanuvchi bergan havolada", "protokolni allowlist bilan tekshirish."],
      ["Tashqi vidjet ulashda", "iframe sandbox va SRI."],
    ],
    sections: [
      { heading: 'Matn yoki HTML', code: { lang: 'js', text: "const comment = '<img src=x onerror=\"steal()\">';\nel.textContent = comment; // matn: xavfsiz\nel.innerHTML = comment;   // HTML: onerror ISHLAYDI\n\n// innerHTML orqali qo'shilgan <script> bajarilmaydi,\n// lekin onerror, onload kabi atributlar bajariladi." } },
      { heading: 'Havolani tekshirish', code: { lang: 'js', text: "function safeUrl(v) {\n  try {\n    const u = new URL(v, location.origin);\n    return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? u.href : '#';\n  } catch {\n    return '#';\n  }\n}\nsafeUrl('javascript:alert(1)'); // '#'" } },
      { heading: 'Himoya qatlamlari', table: { head: ['Vosita', 'Nimadan'], rows: [['CSP script-src', "begona va inline skript"], ['frame-ancestors (faqat header)', 'clickjacking (boshqa saytga joylab aldash)'], ['rel="noopener"', 'yangi tab window.opener orqali boshqarishi'], ['sandbox', "iframe ruxsatlarini cheklash"], ['SameSite cookie + token', 'CSRF (soxta so\'rov)']] }, callout: { kind: 'warn', text: "input type=\"hidden\" hech narsani yashirmaydi: foydalanuvchi qiymatni o'zgartirib yuborishi mumkin. Narx va ruxsatni server hisoblaydi." } },
    ],
    life: [
      ['🍪', "Izohdagi tuzoq", "Bitta zararli izoh uni ochgan har bir odamning nomidan so'rov yuborishi mumkin."],
      ['💸', "1 so'mlik telefon", "Narx hidden maydonda yuborilib, serverda tekshirilmasa, xaridor uni o'zgartiradi."],
    ],
    tip: "Ma'lumot qayerdan kelganiga qarang: foydalanuvchidan kelgan har narsa — shubhali.",
    mistakes: [
      ['"<script> ni olib tashladim, xavfsiz".', "textContent yoki ishonchli sanitizer.", "Hodisa atributlari ham kod bajaradi."],
      ['Client tekshiruviga ishonish.', "Serverda qayta tekshirish.", "So'rovni DevTools siz ham yuborsa bo'ladi."],
      ['sandbox="allow-scripts allow-same-origin" ni o\'z domeningiz kontentiga berish.', "Ikkalasidan birini olib tashlang yoki boshqa domendan bering.", "Ichki skript sandbox atributini olib tashlay oladi."],
    ],
    recap: [
      "Ishonchsiz matn — textContent.",
      "innerHTML da onerror bajariladi.",
      "javascript: havolalarini bloklang.",
      "hidden va client tekshiruvi — himoya emas.",
    ],
    practice: [
      { title: "textContent va innerHTML", text: "Mahalliy sahifada <img src=x onerror=\"alert(1)\"> matnini ikkala usulda chiqarib farqni ko'ring." },
      { title: 'CSP sarlavhalari', text: "Network panelida bir necha yirik saytning Content-Security-Policy sarlavhasini o'qing." },
    ],
    items: [
      ch("Nima bo'ladi?", "alert ishlaydi", ["Matn ko'rinadi, kod ishlamaydi", "Brauzer innerHTML ni rad etadi", "Faqat bo'sh joy chiqadi"], "Rasm yuklanmaydi va onerror bajariladi.", "el.innerHTML = '<img src=\"x\" onerror=\"alert(1)\">';"),
      ch("Bu kodda alert chiqadimi?", "Yo'q, bu script bajarilmaydi", ["Ha, darhol chiqadi", "Ha, sahifa qayta yangilangach", "Faqat strict mode da"], "innerHTML bilan qo'shilgan script ishga tushmaydi — lekin bu XSS yo'q degani emas.", "el.innerHTML = '<script>alert(1)</scr' + 'ipt>';"),
      ch("Foydalanuvchi ismini sahifaga chiqarishning xavfsiz yo'li?", "el.textContent = name", ["el.innerHTML = name", "el.outerHTML = name", "el.insertAdjacentHTML('beforeend', name)"], "textContent hech narsani teg deb o'qimaydi."),
      ch("Profildagi \"veb-sayt\" maydonidan <a href> yasaladi. Asosiy xavf?", "javascript: manzili", ["Juda uzun domen nomi", "http o'rniga https", "Havolaning ko'k rangi"], "javascript: bosilganda kod bajaradi; protokol allowlist qilinadi."),
      ch("target=\"_blank\" havolada rel=\"noopener\" nimani to'sadi?", "window.opener orqali boshqarishni", ["Yangi sahifada cookie yuborishni", "Yangi tabda skript ishlashini", "Havolaning indekslanishini"], "Zamonaviy brauzerlar buni o'zi qiladi, lekin aniq yozish yaxshi odat."),
      ch("noreferrer qo'shimcha nima qiladi?", "Referer manzilini yubormaydi", ["Havolani yangi tabda ochadi", "Sahifani keshlamaydi", "Cookie larni o'chiradi"], "Tashqi sayt qayerdan kelinganini bilmaydi."),
      ch("Sahifangizni boshqa sayt iframe ga joylab aldamasligi uchun?", "CSP: frame-ancestors 'none'", ["meta robots noindex", "iframe da sandbox yozish", "CSP: img-src 'none'"], "Bu direktiva faqat HTTP sarlavha orqali ishlaydi."),
      ch("CDN dagi kutubxona fayli almashtirib qo'yilsa bajarilmasligi uchun?", "integrity atributi (SRI)", ["defer atributi", "async atributi", "referrerpolicy atributi"], "Xesh mos kelmasa brauzer faylni rad etadi."),
      ch("Quyidagi forma haqida qaysi gap to'g'ri?", "Narxni foydalanuvchi o'zgartira oladi", ["hidden qiymat shifrlab yuboriladi", "Brauzer hidden qiymatni qulflab qo'yadi", "POST bo'lgani uchun o'zgarmaydi"], "Server narxni o'z bazasidan olishi kerak.", '<form method="post" action="/buy">\n  <input type="hidden" name="price" value="900000">\n  <button>Sotib olish</button>\n</form>'),
      fill("HTML ni ruxsat etilgan teglargacha tozalaydigan mashhur kutubxona:", "DOMPurify", "HTML chiqarish shart bo'lsa, avval sanitize qiling.", ["dompurify"]),
      fill("Matnni teg sifatida o'qitmay yozadigan DOM property:", "textContent", "el.textContent — xavfsiz chiqarish.", ["textcontent", "el.textContent"]),
      fill("iframe ruxsatlarini cheklaydigan atribut:", "sandbox", "sandbox bo'sh bo'lsa hamma cheklov yoqiladi."),
    ],
  });
};
