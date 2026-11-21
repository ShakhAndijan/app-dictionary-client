// Builds resources/dev/frontend-html-junior.json (Frontend course, module "html", level JUNIOR).
// Topics follow Frontend-roadmap-kunlik.docx (module 2, HTML). Run: node content/build-dev-html.cjs
const fs = require('fs');
const path = require('path');

const L = [];
let n = 0;
function lesson(o) {
  n += 1;
  const code = `fe-html-jr-${String(n).padStart(2, '0')}`;
  const items = o.items.map((it, i) => ({ id: String(i + 1), ...it }));
  const t = o.theory;
  const sections = [];
  if (o.defs) sections.push({ heading: "Asosiy ta'riflar", defs: o.defs.map(([term, text]) => ({ term, text })) });
  sections.push(...t.sections);
  if (o.life) sections.push({ heading: 'Hayotdan misollar', life: o.life.map(([icon, title, text]) => ({ icon, title, text })) });
  L.push({ code, level: 'JUNIOR', module: 'html', order: n, title: o.title, intro: o.intro, theory: { analogy: t.analogy, sections, recap: t.recap }, practice: o.practice || [], items });
}
const ch = (prompt, answer, wrong, explain) => ({ kind: 'CHOICE', prompt, options: [answer, ...wrong], answer, explain });
const fill = (prompt, answer, explain, alsoAccept) => ({ kind: 'FILL', prompt, answer, explain, ...(alsoAccept ? { alsoAccept } : {}) });
const order = (prompt, steps, explain) => { const w = steps.map((x) => x.replace(/ /g, ' ')); return { kind: 'ORDER', prompt, words: w, answer: w.join(' '), explain }; };

/* 1 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Hujjat tuzilishi va semantika',
  intro: "HTML hujjat skeleti, head va body, semantik teglar va sarlavhalar tartibi.",
  theory: {
    analogy: { icon: '🏠', title: 'Uy rejasi', text: "HTML uyning rejasiga o'xshaydi: unda xonalar (bo'limlar), eshiklar (havolalar) va yozuvlar (matn) belgilanadi. Reja \"bu xona oshxona, bu yotoqxona\" deydi, ya'ni har qismning ma'nosini aytadi. Semantik HTML aynan shu: element faqat joy egallamaydi, nima ekanini ham bildiradi." },
    sections: [
      { heading: 'Minimal hujjat skeleti', code: { lang: 'html', text: '<!DOCTYPE html>\n<html lang="uz">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>Mening sahifam</title>\n  </head>\n  <body>\n    <h1>Salom, dunyo</h1>\n  </body>\n</html>' } },
      { heading: 'Head va body nima uchun alohida', table: { head: ['Qism', 'Vazifasi', 'Foydalanuvchi ko\'radimi'], rows: [['head', "Sahifa haqida ma'lumot: sarlavha, kodlash, stil, meta", "Yo'q (title brauzer tabida ko'rinadi)"], ['body', "Sahifaning ko'rinadigan mazmuni", 'Ha']] } },
      { heading: 'Semantik elementlar', table: { head: ['Element', 'Ma\'nosi'], rows: [['header', 'Sahifa yoki bo\'lim boshi: logo, sarlavha'], ['nav', 'Asosiy havolalar bloki'], ['main', 'Sahifaning asosiy mazmuni (sahifada bitta)'], ['section', "Mavzuli bo'lim, odatda o'z sarlavhasi bilan"], ['article', "Mustaqil mazmun: maqola, yangilik, izoh"], ['aside', "Asosiy mazmunga bevosita bog'liq bo'lmagan qo'shimcha"], ['footer', "Sahifa yoki bo'lim oxiri: aloqa, huquqiy ma'lumot"]] } },
      { heading: 'Sarlavhalar tartibi', text: "h1 dan h6 gacha sarlavhalar sahifa tuzilmasini beradi: h1 asosiy mavzu, h2 uning bo'limlari, h3 ichki bo'limlar. Darajalarni sakrab o'tmang (h2 dan keyin h4 emas). Screen reader foydalanuvchilari sahifani aynan sarlavhalar ro'yxati orqali kezib chiqadi." },
      { callout: { kind: 'warn', text: "Sarlavha darajasini matn o'lchamiga qarab tanlamang. Kattalik CSS ishi, daraja esa tuzilma haqida." } },
    ],
    recap: ["doctype brauzerni standart rejimga o'tkazadi.", "head — sahifa haqida, body — ko'rinadigan mazmun.", "Ma'noga mos semantik element div dan afzal.", "Sarlavhalar h1 dan boshlab, sakramasdan ketma-ket."],
  },
  defs: [
    ['DOCTYPE', "hujjat HTML5 ekanini bildiruvchi birinchi qator; brauzerni standart (quirks emas) rejimga o'tkazadi."],
    ['Semantik element', "nomining o'zi ma'nosini bildiradigan element (nav, article), div esa ma'no bermaydi."],
    ['Meta teg', "sahifa haqida ma'lumot beruvchi teg: kodlash, ko'rinish oynasi, tavsif."],
    ['Viewport', "mobil qurilmada sahifa ko'rinadigan oyna kengligi."],
  ],
  life: [
    ['📰', 'Gazeta sahifasi', "Gazetada bosh sarlavha (h1), rubrikalar (h2), alohida maqolalar (article), yon tarafdagi reklama (aside) va pastda muharrir ma'lumoti (footer) bor. Ularning har biri ma'no bilan ajratilgan, faqat katta-kichik shriftdan iborat emas." ],
    ['🏢', 'Bino va xonalar', "Binoda kirish (header), yo'laklar (nav), asosiy zal (main) va chiqish (footer) bor. div esa \"nomsiz xona\": yo'lboshchi tablichkasi yo'q, ko'zi ojiz mehmon adashadi."],
  ],
  practice: [
    { title: 'Blog sahifasi', text: "Faqat semantik teglar bilan blog sahifasini yozing: header, nav, main (ichida article va aside) va footer. div ishlatmang. Keyin brauzer DevTools'da Accessibility panelini ochib, tuzilmaga qarang." },
    { title: 'Sarlavhalar xaritasi', text: "O'zingiz yozgan sahifadagi barcha h1–h6 larni sanab chiqing: daraja sakragan joy bormi? Bo'lsa to'g'rilang." },
  ],
  items: [
    ch("<!DOCTYPE html> qatori nima uchun kerak?", "Brauzerni standart rejimda ishlashga o'tkazadi", ["Sahifa sarlavhasini belgilaydi", "JavaScript ni yoqadi", "Sahifani serverga yuboradi"], "DOCTYPE bo'lmasa brauzer eski quirks rejimiga o'tib, sahifa kutilmagan ko'rinishi mumkin."),
    ch("Sahifada ko'rinmaydi, lekin brauzer va qidiruv tizimiga ma'lumot beradigan element qaysi?", "<head>", ["<header>", "<aside>", "<nav>"], "head — hujjat ma'lumoti. header esa sahifada ko'rinadigan bosh qism. Ikkalasini aralashtirmang."),
    ch("<meta charset=\"UTF-8\"> nimani ta'minlaydi?", "o', g', emoji kabi belgilar to'g'ri ko'rinishini", ["Sahifa tezroq yuklanishini", "Rasmlar siqilishini", "Sahifa mobilga moslashishini"], "Kodlash noto'g'ri bo'lsa, harflar o'rniga \"?\" yoki belgilar aralashmasi chiqadi."),
    ch("viewport meta tegi nima qiladi?", "Mobilda sahifa kengligini qurilma kengligiga moslaydi", ["Rasmlarni avtomatik kichraytiradi", "Sahifa fon rangini beradi", "Katta ekranda sahifani kattalashtiradi"], "Usiz mobil brauzer sahifani kompyuter kengligida chizib, kichraytirib ko'rsatadi."),
    ch("Saytning asosiy havolalar bloki uchun qaysi element eng mos?", "<nav>", ["<aside>", "<header>", "<section>"], "nav asosiy navigatsiyani bildiradi. Header ichida bo'lishi mumkin, lekin o'zi nav emas."),
    ch("Bitta sahifada ko'rinadigan <main> elementi nechta bo'lishi kerak?", "Bitta", ["Har bo'limga bittadan", "Kamida ikkita", "Cheksiz"], "main sahifaning asosiy mazmuni, shuning uchun ko'rinadigani bitta."),
    ch("Matn kichikroq ko'rinsin deb h2 o'rniga h4 yozish to'g'rimi?", "Yo'q: ko'rinish CSS bilan beriladi, daraja esa tuzilmani bildiradi", ["Ha, h4 kichikroq chiqadi", "Ha, qidiruv tizimi baribir tushunadi", "Faqat mobilda to'g'ri"], "Darajani sakrab o'tish screen reader foydalanuvchisini adashtiradi."),
    ch("Boshqa saytga ko'chirilsa ham ma'nosi saqlanadigan mustaqil blog yozuvi uchun qaysi element?", "<article>", ["<section>", "<aside>", "<div>"], "article — mustaqil mazmun. section esa mavzuli bo'lim bo'lib, ko'pincha katta hujjat ichida bo'ladi."),
    ch("Qaysi gap NOTO'G'RI?", "div o'z ma'nosi bilan sahifa qismini bildiradi (semantik)", ["footer odatda aloqa va huquqiy ma'lumot uchun ishlatiladi", "main sahifaning asosiy mazmunini o'raydi", "header bo'lim boshini bildiradi"], "div hech qanday ma'no bermaydi, u faqat umumiy konteyner."),
    fill("Sahifa tilini bildiruvchi atribut nomi qanday? (html tegida, bitta so'z)", 'lang', "<html lang=\"uz\"> screen reader va tarjimon uchun muhim.", ['lang']),
    order("Minimal HTML hujjatni to'g'ri tartibda joylashtiring.", ['<!DOCTYPE html>', '<html lang="uz">', '<head>', '<title>', '<body>'], "doctype, so'ng html, uning ichida head (title shu yerda), keyin body."),
  ],
});

/* 2 ------------------------------------------------------------------------------------------ */
lesson({
  title: "Matn, havolalar, ro'yxatlar",
  intro: "Paragraf, ta'kid, havola, ro'yxat, iqtibos va rasm bilan sarlavha.",
  theory: {
    analogy: { icon: '📚', title: 'Kitob va ma\'no belgilari', text: "Kitobda muhim joy qalin yoziladi, iqtibos alohida ajratiladi, ro'yxat band-band keladi. Bu belgilarni o'qiyotganda ma'no ham yetib boradi. HTML matn teglari ham shunday: ular shrift emas, ma'no belgisi." },
    sections: [
      { heading: 'Matn elementlari', table: { head: ['Teg', 'Ma\'nosi', 'Chalkashtirmang'], rows: [['p', 'Paragraf', "br ketma-ketligi paragraf emas"], ['strong', 'Muhim, ogohlantirish', 'b faqat ko\'rinish uchun qalin'], ['em', "Ohang urg'usi", 'i faqat kursiv ko\'rinish'], ['blockquote', 'Uzun iqtibos (blok)', 'q qator ichidagi qisqa iqtibos'], ['code', 'Dastur kodi', 'pre bilan qatorlar saqlanadi']] } },
      { heading: 'Havola (a)', code: { lang: 'html', text: '<a href="/blog">Blog</a>\n<a href="#narxlar">Narxlar bo\'limiga</a>\n<a href="https://example.com" target="_blank" rel="noopener noreferrer">Tashqi sayt</a>' } },
      { bullets: ['href — qayerga olib borishi. # bilan boshlansa, sahifa ichidagi id ga.', "target=\"_blank\" havolani yangi tabda ochadi, rel=\"noopener\" esa yangi sahifa eskisini boshqarishining oldini oladi.", "rel=\"nofollow\" qidiruv tizimiga bu havolaga ishonmaslikni aytadi.", "Havola matni mazmunli bo'lsin: \"Narxlarni ko'rish\", \"Bu yerni bosing\" emas."] },
      { heading: "Ro'yxatlar", table: { head: ['Teg', 'Qachon'], rows: [['ul', 'Tartibsiz ro\'yxat (ingredientlar)'], ['ol', 'Tartibli ro\'yxat (qadamlar)'], ['dl, dt, dd', "Atama va ta'rif juftlari (lug'at)"]] } },
      { heading: 'Rasm va sarlavhasi', code: { lang: 'html', text: '<figure>\n  <img src="chart.png" alt="2026-yil sotuvlar grafigi" />\n  <figcaption>1-rasm. Sotuvlar o\'sishi</figcaption>\n</figure>' } },
    ],
    recap: ["p — paragraf, br faqat qator uzish uchun.", "strong va em ma'no beradi, b va i faqat ko'rinish.", "Tashqi havolada rel=\"noopener\" qo'ying.", "Ketma-ketlik uchun ol, boshqasi uchun ul, atama-ta'rif uchun dl."],
  },
  defs: [
    ['Havola (hyperlink)', "bosilganda boshqa sahifa yoki sahifa ichidagi joyga o'tkazadigan element."],
    ['Atribut', "elementga qo'shimcha ma'lumot beruvchi juft: nom=\"qiymat\", masalan href=\"/blog\"."],
    ['Anchor (langar)', "id berilgan element; # bilan unga to'g'ridan-to'g'ri o'tiladi."],
    ['Iqtibos', "boshqa manbadan olingan matn: uzun bo'lsa blockquote, qisqa bo'lsa q."],
  ],
  life: [
    ['🧭', "Yo'l ko'rsatkich", "href — yo'l ko'rsatkichdagi manzil, havola matni esa ustidagi yozuv. \"Bu yerga\" yozuvi hech narsa demaydi, \"Samarqand, 270 km\" esa darrov tushunarli."],
    ['🍳', 'Retsept kitobi', "Masalliqlar tartib talab qilmaydi (ul), pishirish qadamlari esa qat'iy ketma-ket (ol). Tartibni noto'g'ri ro'yxatga solsangiz, oshpaz xamirni pishirib bo'lgach tuxum qo'shadi."],
    ['⚠️', 'Dori yo\'riqnomasi', "\"Bo'sh oshqozonga ichmang\" gapi qalin yoziladi, chunki bu ko'rinish emas, muhim ogohlantirish. Shuning uchun strong, b emas."],
  ],
  practice: [
    { title: 'Maqola sahifasi', text: "Maqola yozing: h1, bir necha p, ichida strong va em, blockquote, bitta ol va ul, figure bilan rasm. Hamma tashqi havolaga rel=\"noopener noreferrer\" qo'shing." },
    { title: 'Havola matnlari tekshiruvi', text: "Sahifadagi barcha havola matnlarini o'qing: ularni boshqa kontekstda ko'rsangiz tushunarlimi? \"Batafsil\" kabi matnlarni aniqroq qiling." },
  ],
  items: [
    ch("Ikki paragrafni ajratish uchun <br><br> yozish to'g'rimi?", "Yo'q: har paragraf uchun <p> ishlatiladi, br faqat she'r yoki manzil kabi qator uzishda", ["Ha, vizual natija bir xil bo'lgani uchun to'g'ri", "Ha, p dan tezroq ishlaydi", "Faqat mobil uchun"], "p ma'noni bildiradi, br esa faqat qator uzadi."),
    ch("Muhim ogohlantirishni qaysi teg bilan belgilash to'g'ri?", "<strong>", ["<b>", "<i>", "<u>"], "strong ma'no (muhimlik) beradi. b esa shunchaki qalin ko'rsatadi."),
    ch("target=\"_blank\" bilan birga rel=\"noopener\" nima uchun yoziladi?", "Yangi sahifa eski sahifani window.opener orqali boshqarib qo'ymasligi uchun", ["Havola tezroq ochilishi uchun", "Havola qidiruvdan yashirilishi uchun", "Yangi tab bloklanishi uchun"], "Yangi brauzerlar buni o'zi qiladi, lekin aniq yozish xavfsiz odat."),
    ch("rel=\"nofollow\" nimani bildiradi?", "Qidiruv tizimiga bu havolaga ishonch ko'rsatmaslikni", ["Havola yangi tabda ochilishini", "Sahifa eski sahifani boshqarolmasligini", "Havola o'chirilganini"], "nofollow reklama yoki ishonchsiz havolalar uchun. noopener bilan adashtirmang."),
    ch("O'rnatish qadamlari (1, 2, 3) uchun qaysi teg?", "<ol>", ["<ul>", "<dl>", "<menu>"], "Ketma-ketlik muhim bo'lsa ol, bo'lmasa ul."),
    ch("<dl>, <dt>, <dd> qanday ma'lumot uchun?", "Atama va uning ta'rifi juftlari (lug'at)", ["Jadval qatorlari", "Menyu bandlari", "Sahifa bo'limlari"], "dt — atama, dd — ta'rif."),
    ch("<blockquote> va <q> farqi nimada?", "blockquote uzun blok iqtibos, q qator ichidagi qisqa iqtibos", ["Farqi yo'q", "q faqat rasm uchun", "blockquote kodga oid"], "q brauzerda qo'shtirnoqni o'zi qo'shadi."),
    ch("<figure> va <figcaption> nimaga xizmat qiladi?", "Rasm (yoki kod, diagramma) va uning sarlavhasini bitta birlik qiladi", ["Rasmni siqadi", "Rasm uchun alt matn yozadi", "Rasmni markazga qo'yadi"], "figcaption figure bilan bog'langan sarlavha."),
    ch("href=\"#about\" bosilganda nima bo'ladi?", "id=\"about\" bo'lgan elementga sahifa ichida o'tiladi", ["about.html ochiladi", "Yangi tab ochiladi", "Sahifa yangilanadi va yuqoriga qaytadi"], "# dan keyin id yoziladi. Bu fragment: serverga yuborilmaydi."),
    ch("\"Bu yerni bosing\" havola matni nega yomon?", "Screen reader havolalar ro'yxatida ma'nosiz eshitiladi", ["Havola ishlamaydi", "Qidiruv tizimi uni bloklaydi", "Brauzer uni qizil qiladi"], "Havola matni o'zi bilan ma'noni olib yurishi kerak."),
    fill("Havola yaratadigan elementning nomi nima? (bitta harf)", 'a', "<a href=\"...\"> — anchor.", ['a']),
    order("Tartibsiz ro'yxatni to'g'ri tartibda yozing.", ['<ul>', '<li>', 'Olma', '</li>', '</ul>'], "ul ichida li, li ichida matn."),
  ],
});

/* 3 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Formalar 1: maydonlar va yuborish',
  intro: "input turlari, label, name, fieldset va forma qanday yuboriladi.",
  theory: {
    analogy: { icon: '🧾', title: 'Qog\'oz anketa', text: "Qog'oz anketada maydon nomi (label), to'ldiriladigan joy (input) va topshirish joyi (submit) bor. Topshirilganda ma'lumot maydon nomi bo'yicha ajratiladi. HTML formada ham shunday: label tushuntiradi, input yig'adi, name esa har bir qiymatga kalit beradi." },
    sections: [
      { heading: 'Eng kichik forma', code: { lang: 'html', text: '<form action="/register" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required />\n\n  <fieldset>\n    <legend>Tarif</legend>\n    <label><input type="radio" name="plan" value="free" /> Bepul</label>\n    <label><input type="radio" name="plan" value="pro" /> Pro</label>\n  </fieldset>\n\n  <button type="submit">Yuborish</button>\n</form>' } },
      { heading: 'id va name: ikkalasi ham kerak', table: { head: ['Atribut', 'Kim ishlatadi', 'Vazifasi'], rows: [['id', 'label, CSS, JS', 'Sahifada noyob belgi'], ['name', 'Server', 'Yuboriladigan qiymat kaliti: email=a@b.uz'], ['value', 'Server', 'Yuboriladigan qiymat (radio va checkbox uchun belgilanadi)']] } },
      { heading: 'Input turlari', table: { head: ['type', 'Nima beradi'], rows: [['text, email, tel, url', "Mos klaviatura va oddiy tekshiruv"], ['password', "Belgilar yashirinadi (xavfsiz uzatish emas, HTTPS kerak)"], ['number, range, date', "Raqam, slayder, sana tanlash"], ['checkbox', "Mustaqil yoqish/o'chirish; belgilanmasa yuborilmaydi"], ['radio', "Bir xil name li guruhdan faqat bittasi"]] } },
      { heading: 'GET va POST', text: "GET qiymatlarni URL ga qo'yadi (?q=olma), shuning uchun qidiruv uchun mos, lekin parol uchun yaramaydi. POST qiymatlarni so'rov body'sida yuboradi." },
      { callout: { kind: 'tip', text: "Forma ichidagi button type bermasangiz, u submit bo'ladi. Boshqa vazifa uchun type=\"button\" yozing." } },
    ],
    recap: ["Har input uchun label (for va id orqali).", "name bo'lmasa qiymat yuborilmaydi.", "Radio guruhida bir xil name.", "Qidiruv — GET, ma'lumot yuborish — POST."],
  },
  defs: [
    ['Forma (form)', "foydalanuvchi ma'lumotini yig'ib, serverga yuboradigan element."],
    ['Label', "maydonga nom beruvchi element; bosilganda maydonga fokus beradi."],
    ['name atributi', "formani yuborishda qiymat uchun kalit vazifasini o'taydi."],
    ['Fieldset', "bog'liq maydonlarni guruhlaydigan element, legend esa guruh nomi."],
  ],
  life: [
    ['🏦', 'Bank anketasi', "Anketada \"Ism\" maydoni yonidagi yozuv — label, maydonning o'zi — input. Xodim anketani qabul qilganda \"Ism: Aziz\" kabi juftlarni o'qiydi. name aynan shu \"Ism\" yorlig'i."],
    ['🎚️', 'Radio tugmalar', "Eski radioda to'lqin tugmalaridan bittasi bosilsa, boshqasi o'zi chiqib ketar edi. Radio input ham shunday: bir xil name li guruhdan faqat bittasi tanlanadi."],
    ['📮', 'Pochta xati va ochiq xat', "GET — ochiq otkritka: matnni hamma ko'radi (URL da). POST — yopiq konvert: ma'lumot ichida. Parolni otkritkaga yozmaysiz."],
  ],
  practice: [
    { title: "Ro'yxatdan o'tish formasi", text: "Ism, email, parol, tarif (radio), shartlarga rozilik (checkbox) bilan forma yozing. Hamma maydonda label bo'lsin va label bosilganda maydon tanlansin." },
    { title: 'Nima yuborilayapti?', text: "Formani method=\"get\" qilib yuboring va manzil qatoriga qarang. Qaysi maydon ko'rinmayapti? Sababi name yo'qligidir." },
  ],
  items: [
    ch("<label for=\"email\"> qanday ishlashi uchun nima kerak?", "input da id=\"email\" bo'lishi", ["input da name=\"email\" bo'lishi", "label ichida input bo'lmasligi", "form da action bo'lishi"], "for qiymati input id siga teng bo'lishi shart. name esa boshqa maqsad uchun."),
    ch("placeholder label o'rnini bosa oladimi?", "Yo'q: yozishni boshlaganda yo'qoladi va screen reader uchun yetarli emas", ["Ha, ikkalasi bir xil", "Ha, agar rangi to'q bo'lsa", "Faqat mobilda"], "placeholder maslahat, label esa maydonning nomi."),
    ch("id va name farqi nima?", "id sahifada noyob belgi (label, CSS, JS), name esa yuboriladigan kalit", ["Ikkalasi bir xil", "id serverga yuboriladi, name esa yuborilmaydi", "name CSS uchun, id server uchun"], "Server qiymatni name orqali oladi."),
    ch("name atributi yo'q input yuborilganda nima bo'ladi?", "Uning qiymati serverga yuborilmaydi", ["id bo'yicha yuboriladi", "Xato beradi", "Bo'sh qiymat bilan yuboriladi"], "name bo'lmasa maydon formaga qo'shilmaydi."),
    ch("Radio tugmalardan faqat bittasi tanlanishi uchun nima qilinadi?", "Hammasiga bir xil name beriladi", ["Hammasiga turli id beriladi", "Hammasi fieldset ichiga qo'yiladi", "required yoziladi"], "Radio guruhini name belgilaydi, fieldset esa faqat vizual va ma'noviy guruh."),
    ch("Belgilanmagan checkbox yuborilganda nima bo'ladi?", "Serverga umuman yuborilmaydi", ["off qiymati bilan yuboriladi", "false qiymati bilan yuboriladi", "Bo'sh satr yuboriladi"], "Faqat belgilangan checkbox qiymati yuboriladi."),
    ch("Forma ichida type'siz <button> bosilsa nima bo'ladi?", "Forma yuboriladi (submit)", ["Hech narsa bo'lmaydi", "Forma tozalanadi", "Sahifa yangilanadi, lekin yuborilmaydi"], "Standart type submit. Boshqa vazifa uchun type=\"button\"."),
    ch("Qidiruv formasi uchun qaysi method ma'qul?", "GET: qidiruv so'zi URL da qoladi va havola sifatida ulashish mumkin", ["POST, chunki xavfsizroq", "PUT", "DELETE"], "Qidiruv ma'lumot o'qish, shuning uchun GET."),
    ch("Parol POST bilan yuborilsa xavfsiz bo'ladimi?", "Yo'q: baribir HTTPS kerak, aks holda yo'lda o'qilishi mumkin", ["Ha, POST hamma narsani shifrlaydi", "Ha, type=password shifrlaydi", "Faqat Chrome da"], "type=password faqat ekranda yashiradi."),
    ch("<fieldset> va <legend> nima uchun?", "Bog'liq maydonlarni guruhlab, guruhga nom berish uchun", ["Maydonlarni rangli qilish uchun", "Formani tekshirish uchun", "Yuborish manzilini belgilash uchun"], "Ayniqsa radio guruhlari uchun screen reader savolni o'qib beradi."),
    fill("Forma yuboriladigan manzilni belgilovchi atribut nomi? (bitta so'z)", 'action', "<form action=\"/register\">.", ['action']),
    order("Forma yuborilishi jarayonini tartiblang.", ["Foydalanuvchi to'ldiradi", 'Submit bosiladi', 'Brauzer tekshiradi', "So'rov yuboriladi", 'Server javob beradi'], "Avval to'ldirish va bosish, keyin brauzer tekshiruvi, so'ng so'rov va javob."),
  ],
});

/* 4 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Formalar 2: validatsiya',
  intro: "Validatsiya atributlari, Constraint Validation API, autocomplete va inputmode.",
  theory: {
    analogy: { icon: '🛂', title: 'Chegara posti', text: "Chegarada pasportni birinchi navbatda tekshiradigan xodim bor: bu brauzer validatsiyasi. Lekin asosiy nazorat mamlakat ichida ham bo'ladi: server tekshiruvi. Xodimni aldab o'tish mumkin, shuning uchun faqat unga tayanib bo'lmaydi." },
    sections: [
      { heading: 'Validatsiya atributlari', table: { head: ['Atribut', "Nimani tekshiradi"], rows: [['required', "Bo'sh bo'lmasligi"], ['minlength, maxlength', "Matn uzunligi"], ['min, max, step', "Raqam yoki sana qiymati"], ['pattern', "Regex (masalan [0-9]{4})"], ['type=email, url', "Format"]] } },
      { heading: "Maxsus xabar (Constraint Validation API)", code: { lang: 'js', text: "const input = document.querySelector('#age');\ninput.addEventListener('input', () => {\n  if (input.validity.rangeUnderflow) {\n    input.setCustomValidity('Yoshingiz 18 dan kam bo\\'lmasin');\n  } else {\n    input.setCustomValidity(''); // xatoni tozalash\n  }\n});" } },
      { bullets: ["checkValidity() — true yoki false qaytaradi.", "reportValidity() — tekshirib, xabarni ko'rsatadi.", "setCustomValidity('matn') — maydonni xato qiladi, bo'sh satr esa xatoni tozalaydi.", "novalidate — brauzer tekshiruvini o'chiradi (o'zingiz boshqarsangiz)."] },
      { heading: 'Qulaylik atributlari', table: { head: ['Atribut', 'Vazifasi'], rows: [['autocomplete="email"', "Brauzer saqlangan manzilni taklif qiladi"], ['autocomplete="one-time-code"', "SMS kodni avtomatik qo'yish"], ['inputmode="numeric"', "Mobilda raqam klaviaturasi (qiymatni tekshirmaydi)"], ['type="tel"', "Telefon uchun, boshidagi nol va + saqlanadi"]] } },
      { callout: { kind: 'warn', text: "Brauzer validatsiyasi faqat qulaylik. Foydalanuvchi uni o'chirib qo'yishi mumkin, shuning uchun server tekshiruvi har doim shart." } },
    ],
    recap: ["required, min/max, pattern — HTML ning o'z tekshiruvi.", "setCustomValidity('') xatoni tozalaydi.", "Server tekshiruvi har doim shart.", "Telefon uchun number emas, tel va inputmode."],
  },
  defs: [
    ['Validatsiya', "kiritilgan ma'lumot qoidalarga mos ekanini tekshirish."],
    ['Pattern', "matn mos kelishi kerak bo'lgan regular expression (naqsh)."],
    ['Constraint Validation API', "brauzerda tekshiruv holatini JavaScript orqali o'qish va xabarni o'zgartirish imkoni."],
    ['Autocomplete', "brauzerga maydonda qanday ma'lumot kutilayotganini aytib, avto to'ldirishga yordam beruvchi atribut."],
  ],
  life: [
    ['🎟️', 'Kino kassasi', "Kassir \"18+ filmga yoshingiz yetmaydi\" desa, bu o'z xabari (setCustomValidity). Kassir yo'q kunlari ham zal eshigida nazorat bo'ladi, bu server tekshiruvi."],
    ['📱', 'SMS kod', "Bank SMS kodini yuborganda telefon uni klaviatura tepasida taklif qiladi: autocomplete=\"one-time-code\" shu uchun."],
    ['☎️', 'Telefon raqami', "+998 90 123 45 67 ni number maydoniga yozsangiz, \"+\" va bo'shliqlar o'tmaydi, strelka bilan raqam o'zgarib ketadi. Shuning uchun tel."],
  ],
  practice: [
    { title: 'Maxsus xabarlar', text: "Ro'yxatdan o'tish formasida parol uzunligi, email formati va yosh uchun o'zingizning o'zbekcha xabarlaringizni setCustomValidity bilan chiqaring." },
    { title: 'Brauzer o\'chirilsa', text: "DevTools'da required atributini o'chirib formani yuborib ko'ring. Serveringiz shu holatda nima qiladi? Server tekshiruvini qo'shing." },
  ],
  items: [
    ch("required atributi nimani ta'minlaydi?", "Maydon bo'sh bo'lsa, forma yuborilmaydi", ["Maydon avtomatik to'ldiriladi", "Maydon yashiriladi", "Serverga alohida so'rov ketadi"], "required — eng oddiy tekshiruv."),
    ch("minlength va min farqi nima?", "minlength matn uzunligi uchun, min raqam yoki sana qiymati uchun", ["Ikkalasi bir xil", "min matn uchun, minlength raqam uchun", "minlength faqat parol uchun"], "Raqam uchun min/max, matn uchun minlength/maxlength."),
    ch("pattern=\"[0-9]{4}\" nimani talab qiladi?", "Aynan 4 ta raqam", ["Kamida 4 ta har qanday belgi", "Eng ko'pi 4 ta harf", "4 dan katta raqam"], "pattern regex orqali tekshiradi."),
    ch("novalidate atributi nima qiladi?", "Brauzerning o'z tekshiruvini o'chiradi", ["Formani yuborishni taqiqlaydi", "Server tekshiruvini o'chiradi", "Faqat required ni o'chiradi"], "Maxsus tekshiruvni o'zingiz boshqarsangiz ishlatiladi."),
    ch("input.setCustomValidity('') chaqirilsa nima bo'ladi?", "Maxsus xato tozalanadi, maydon yana to'g'ri hisoblanadi", ["Maydon xato bo'lib qoladi", "Maydon tozalanadi", "Forma yuboriladi"], "Bo'sh satr xatoni olib tashlaydi. Tozalamasangiz forma doim yuborilmaydi."),
    ch("form.checkValidity() nima qaytaradi?", "true yoki false: forma to'g'rimi", ["Xato matnini", "Maydonlar sonini", "Server javobini"], "reportValidity esa tekshirib, xabarni ham ko'rsatadi."),
    ch("Brauzer validatsiyasi bo'lsa, serverda tekshirish kerakmi?", "Ha: foydalanuvchi brauzer tekshiruvini chetlab o'tishi mumkin", ["Yo'q, brauzer yetarli", "Faqat parol uchun kerak", "Faqat mobilda kerak"], "HTML tekshiruvi qulaylik, himoya emas."),
    ch("autocomplete=\"one-time-code\" nima uchun?", "SMS orqali kelgan kodni avtomatik taklif qilish uchun", ["Parolni saqlash uchun", "Maydonni yashirish uchun", "Kodni shifrlash uchun"], "Maydon turini brauzerga to'g'ri aytish foydalanuvchiga qulay."),
    ch("inputmode=\"numeric\" nimani o'zgartiradi?", "Mobilda raqamli klaviatura chiqadi, lekin qiymat tekshirilmaydi", ["Faqat raqam kiritishni majburlaydi", "Maydonni number turiga aylantiradi", "Qiymatni avto raqamga o'giradi"], "Tekshiruv uchun pattern yoki type kerak."),
    ch("Telefon raqami uchun type=\"number\" nega yomon?", "Boshidagi nol va + belgisi yo'qoladi, scroll qiymatni o'zgartiradi", ["Telefon raqamlari juda uzun", "number faqat kompyuterda ishlaydi", "number uchun label kerak emas"], "type=\"tel\" bilan inputmode ishlating."),
    ch("Foydalanuvchi hali yozmagan maydon sahifa ochilganda qizil bo'lmasligi uchun qaysi CSS pseudo-class?", ":user-invalid", [":invalid", ":required", ":checked"], ":invalid sahifa ochilganda ham ishlaydi, :user-invalid esa foydalanuvchi yozgandan keyin."),
    fill("Maxsus xato matnini beradigan metod nomi? (setCustom... davomini yozing)", 'setCustomValidity', "input.setCustomValidity('xabar') maydonni xato qiladi.", ['setCustomValidity']),
  ],
});

/* 5 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Jadvallar va media',
  intro: "Jadval semantikasi, rasm (alt, srcset, picture), video va audio.",
  theory: {
    analogy: { icon: '📊', title: 'Hisobot va fotoalbom', text: "Jadval — hisobot ko'rinishidagi ma'lumot: ustun va qator sarlavhalari ma'no beradi. Rasm esa fotoalbom: ko'ra olmaydigan odam uchun har surat ostida izoh (alt) kerak. HTML ikkalasiga ham ma'noli belgilar beradi." },
    sections: [
      { heading: 'Jadval tuzilishi', code: { lang: 'html', text: '<table>\n  <caption>2026-yil sotuvlari</caption>\n  <thead>\n    <tr><th scope="col">Oy</th><th scope="col">Sotuv</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope="row">Yanvar</th><td>120</td></tr>\n  </tbody>\n</table>' } },
      { bullets: ["Jadval ma'lumot uchun, sahifa joylashuvi uchun emas (u CSS ishi).", "caption jadval nomi, th sarlavha katak, scope sarlavha ustunmi yoki qatorni bildiradi.", "colspan ustunlarni, rowspan qatorlarni birlashtiradi."] },
      { heading: 'Rasm: alt, o\'lcham, lazy', code: { lang: 'html', text: '<img src="cat.jpg" alt="Deraza tagida uxlayotgan mushuk"\n     width="800" height="600" loading="lazy" />' } },
      { table: { head: ['alt', 'Qachon'], rows: [['Tavsifli matn', 'Rasm ma\'no olib yursa'], ['alt=""', "Rasm bezak bo'lsa: screen reader o'tkazib yuboradi"], ["atribut yo'q", "Xato: screen reader fayl nomini o'qiydi"]] } },
      { heading: 'Responsive rasm', code: { lang: 'html', text: '<img src="p-800.jpg"\n     srcset="p-400.jpg 400w, p-800.jpg 800w, p-1600.jpg 1600w"\n     sizes="(min-width: 800px) 50vw, 100vw" alt="Mahsulot" />\n\n<picture>\n  <source srcset="p.avif" type="image/avif" />\n  <source srcset="p.webp" type="image/webp" />\n  <img src="p.jpg" alt="Mahsulot" />\n</picture>' } },
      { heading: 'Video va audio', code: { lang: 'html', text: '<video controls width="640" poster="cover.jpg">\n  <source src="clip.mp4" type="video/mp4" />\n  <track kind="subtitles" src="uz.vtt" srclang="uz" label="O\'zbekcha" />\n</video>' } },
      { callout: { kind: 'tip', text: "Birinchi ekrandagi katta rasmga loading=\"lazy\" qo'ymang: u tezroq yuklanishi kerak. Lazy faqat ekrandan pastdagi rasmlar uchun." } },
    ],
    recap: ["Jadval — ma'lumot uchun; th va scope ma'no beradi.", "Rasmda alt shart; bezak rasmda alt=\"\".", "width va height sahifa sakrashini kamaytiradi.", "srcset+sizes o'lcham, picture format tanlash uchun."],
  },
  defs: [
    ['alt matni', "rasm ko'rinmaganda yoki screen reader uchun uning o'rniga o'qiladigan tavsif."],
    ['srcset', "brauzerga bir rasmning turli o'lchamdagi variantlari ro'yxatini beruvchi atribut."],
    ['picture', "turli format yoki ekranga mos manbalardan birini tanlatadigan o'rama element."],
    ['Lazy loading', "ekranga yaqinlashguncha rasmni yuklamaslik usuli."],
  ],
  life: [
    ['📋', 'Maktab jurnali', "Jurnalda yuqorida fanlar (ustun sarlavhasi), chapda o'quvchilar (qator sarlavhasi) turadi. scope aynan shuni aytadi: bu sarlavha ustunniki yoki qatorniki."],
    ['🖼️', 'Radiodan futbol', "Radiodan futbolni kuzatgan odam maydonni ko'rmaydi, lekin sharhlovchi so'z bilan tushuntiradi. alt shu sharhlovchi, ko'ra olmaydigan foydalanuvchi uchun."],
    ['📦', 'Do\'kon vitrina', "Vitrina uchun kichik, ombor uchun katta quti: srcset ham kerakli o'lchamni beradi. Telefonga 4K rasm yuborish — bir dona sovunni yuk mashinasida olib borishdek."],
  ],
  practice: [
    { title: 'Accessible jadval', text: "Haftalik dars jadvalini caption, thead, tbody va scope bilan yozing. Screen reader (yoki DevTools Accessibility daraxti) qanday o'qiyotganini tekshiring." },
    { title: 'Responsive galereya', text: "Uchta rasmni srcset va sizes bilan joylang, birini picture orqali AVIF/WebP qilib bering. Network panelida kichik ekranda qaysi fayl yuklanayotganini kuzating." },
  ],
  items: [
    ch("Sahifa joylashuvini (ustun-ustun chiqarish) jadval bilan qilish to'g'rimi?", "Yo'q: jadval ma'lumot uchun, joylashuv CSS (flex, grid) bilan qilinadi", ["Ha, jadval eng ishonchli", "Ha, mobilda ham yaxshi ishlaydi", "Faqat email uchun yo'q"], "Layout uchun jadval screen reader va responsive ishini buzadi."),
    ch("<th scope=\"col\"> nimani bildiradi?", "Bu katak ustun sarlavhasi ekanini", ["Katak qatorlarni birlashtirishini", "Katak rangini", "Jadval nomini"], "scope screen readerga sarlavha qaysi yo'nalishga tegishli ekanini aytadi."),
    ch("<caption> nima uchun?", "Jadvalning nomi (sarlavhasi)", ["Jadval ostidagi izoh rasm", "Katak chegarasi", "Ustun kengligi"], "caption table ichida birinchi element bo'ladi."),
    ch("colspan=\"2\" nima qiladi?", "Katak ikkita ustunni egallaydi", ["Katak ikki qator egallaydi", "Ikkita katak qo'shadi", "Ustunni yashiradi"], "Qatorlar uchun rowspan."),
    ch("Faqat bezak vazifasidagi rasmda alt qanday bo'lishi kerak?", "alt=\"\" (bo'sh)", ["alt yozilmaydi", "alt=\"rasm\"", "alt=\"bezak\""], "Bo'sh alt screen reader o'tkazib yuborishini bildiradi. Atributni butunlay tashlab ketish esa fayl nomini o'qitadi."),
    ch("img da width va height berishdan maqsad nima?", "Rasm yuklanguncha joy zahiralanadi, sahifa sakramaydi", ["Rasm sifatini oshiradi", "Rasm tezroq yuklanadi", "Rasm markazga tushadi"], "Bu CLS (kutilmagan sakrash) ni kamaytiradi."),
    ch("srcset va sizes birgalikda nima beradi?", "Brauzer ekran kengligiga mos rasm variantini tanlaydi", ["Rasm formatini o'zgartiradi", "Rasmni animatsiya qiladi", "Rasm uchun alt yozadi"], "srcset — variantlar, sizes — rasm sahifada qancha joy olishi."),
    ch("<picture> qachon kerak?", "Brauzer qo'llasa AVIF/WebP, aks holda JPG berish uchun", ["Rasmga ramka qo'yish uchun", "Rasmni orqa fon qilish uchun", "Rasmni siqish uchun"], "Oxirgi img — majburiy zaxira (fallback)."),
    ch("Brauzerlar autoplay ni odatda qachon ruxsat qiladi?", "Video ovozsiz (muted) bo'lganda", ["Har doim", "Hech qachon", "Faqat controls bo'lsa"], "Foydalanuvchini kutilmagan ovozdan himoya qilish uchun."),
    ch("loading=\"lazy\" ni qaysi rasmga qo'ymaslik kerak?", "Birinchi ekrandagi katta (hero) rasmga", ["Sahifa pastidagi rasmlarga", "Galereyadagi rasmlarga", "Footer dagi rasmlarga"], "Hero rasm tez yuklanishi kerak, aks holda sahifa sekin ko'rinadi."),
    ch("Video uchun subtitrni qaysi element beradi?", "<track>", ["<caption>", "<source>", "<figcaption>"], "track kind=\"subtitles\" bilan."),
    fill("Rasmning matnli tavsifini beruvchi atribut nomi? (bitta so'z)", 'alt', "<img alt=\"...\">.", ['alt']),
  ],
});

/* 6 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'Interaktiv elementlar',
  intro: "dialog, details/summary, popover, template va iframe sandbox.",
  theory: {
    analogy: { icon: '🪟', title: 'Deraza va eshiklar', text: "Interaktiv elementlar uyning deraza va eshiklariga o'xshaydi: ochiladi, yopiladi, qulf bo'lishi mumkin. Avval ularni JavaScript bilan yasardik. Endi brauzer tayyor, to'g'ri ishlaydigan eshiklarni o'zi beradi." },
    sections: [
      { heading: 'dialog: modal oyna', code: { lang: 'html', text: '<dialog id="confirm">\n  <form method="dialog">\n    <p>O\'chirishni tasdiqlaysizmi?</p>\n    <button value="cancel">Yo\'q</button>\n    <button value="ok">Ha</button>\n  </form>\n</dialog>\n<button onclick="confirm.showModal()">O\'chirish</button>' } },
      { bullets: ["showModal() — modal ochadi: orqa fon bloklanadi, Esc yopadi, fokus ichida qoladi.", "show() — modalsiz ochadi.", "form method=\"dialog\" bosilganda dialogni yopadi va tugma value sini returnValue ga yozadi.", "Orqa fonni ::backdrop bilan bezaysiz."] },
      { heading: 'details va summary', code: { lang: 'html', text: '<details>\n  <summary>To\'lov qanday amalga oshadi?</summary>\n  <p>Karta yoki naqd.</p>\n</details>' } },
      { heading: 'popover atributi', code: { lang: 'html', text: '<button popovertarget="tip">Maslahat</button>\n<div id="tip" popover>Parol kamida 8 belgi bo\'lsin.</div>' } },
      { table: { head: ['Element', 'JavaScript kerakmi', 'Nima uchun'], rows: [['details', "Yo'q", "FAQ, yig'iladigan blok"], ['popover', "Yo'q", "Tooltip, menyu, kichik oyna"], ['dialog', "Ochish uchun ha", "Modal va tasdiqlash"], ['template', "Ha (klonlash uchun)", "Ko'rinmaydigan HTML andoza"]] } },
      { heading: 'iframe va sandbox', text: "iframe boshqa sahifani ichiga joylaydi. Ishonchsiz mazmun uchun sandbox atributini qo'ying: bo'sh sandbox hamma narsani cheklaydi, kerakli ruxsatlarni (allow-scripts kabi) birma-bir qo'shasiz. Ba'zi saytlar X-Frame-Options yoki CSP frame-ancestors bilan iframe ichida ochilishni taqiqlaydi." },
    ],
    recap: ["Modal uchun dialog.showModal(), div emas.", "details/summary va popover JavaScript siz ishlaydi.", "template ichi sahifada ko'rinmaydi, JS bilan klonlanadi.", "iframe da sandbox ishlating."],
  },
  defs: [
    ['Modal oyna', "ochiq turganda orqadagi sahifa bilan ishlashni to'xtatadigan oyna."],
    ['Popover', "tugma bosilganda ochiladigan, tashqariga bosilganda yopiladigan engil oyna."],
    ['Template', "sahifada ko'rinmaydigan va JS yordamida nusxalanadigan HTML andoza."],
    ['Sandbox', "iframe ichidagi kodga ruxsatlarni cheklaydigan atribut."],
  ],
  life: [
    ['🏧', 'Bankomat tasdiqlash oynasi', "\"Pul yechilsinmi?\" oynasi chiqqach, siz boshqa tugmani bosa olmaysiz: oldin shuni hal qilasiz. Bu modal dialog."],
    ['❓', "Savol-javob (FAQ)", "Qo'llanmada savolni bosasiz, javob ochiladi. details/summary shu ishni JavaScript siz qiladi."],
    ['🧊', "Qolipdan nusxa", "template — shirinlik qolipi: o'zi pishirilmaydi, lekin kerak bo'lganda undan istalgancha nusxa olinadi."],
  ],
  practice: [
    { title: 'dialog va popover', text: "O'chirish tugmasi bosilganda dialog bilan tasdiqlash so'rang. Alohida tugma uchun popover tooltip qo'shing. Esc va tashqariga bosish qanday ishlashini tekshiring." },
    { title: 'FAQ bloki', text: "5 savolli FAQ ni details/summary bilan yasang va ochilgan holatda turishi uchun open atributini sinab ko'ring." },
  ],
  items: [
    ch("dialog.showModal() va show() farqi nima?", "showModal() orqa fonni bloklaydi va Esc bilan yopiladi, show() esa modalsiz", ["Farqi yo'q", "show() modalni ochadi, showModal() yopadi", "showModal() faqat mobilda"], "Modal dialog 'top layer' da turadi va fokusni ichida ushlaydi."),
    ch("div bilan yasalgan modal qaysi imkoniyatlarni o'zi bermaydi?", "Fokusni ichida ushlash, Esc bilan yopish, ma'noviy rol", ["Rang berishni", "Matn yozishni", "Havola qo'yishni"], "dialog bularni tayyor beradi."),
    ch("<form method=\"dialog\"> ichidagi tugma bosilsa nima bo'ladi?", "Dialog yopiladi va tugma qiymati returnValue ga yoziladi", ["Sahifa serverga yuboriladi", "Sahifa yangilanadi", "Hech narsa bo'lmaydi"], "Server so'rovisiz dialog natijasini olish uchun qulay."),
    ch("details/summary ni nima uchun ishlatamiz?", "JavaScript siz ochiladigan va yopiladigan blok yasash uchun", ["Jadval yasash uchun", "Rasm yuklash uchun", "Havola yasash uchun"], "FAQ uchun ideal."),
    ch("summary elementi bo'lmasa <details> da nima ko'rinadi?", "Brauzer standart \"Details\" sarlavhasini qo'yadi", ["Hech narsa ko'rinmaydi", "Matn yashirin qoladi", "Xato chiqadi"], "Doimo aniq summary yozing."),
    ch("<details open> da open nimani bildiradi?", "Blok ochiq holatda boshlanadi", ["Blok bloklangan", "Blok yangi tabda ochiladi", "Blok yashirin"], "Atribut olib tashlansa yopiq holat."),
    ch("popover atributli element qanday ochiladi?", "popovertarget li tugma orqali, JavaScript siz", ["Faqat CSS hover bilan", "Faqat fetch bilan", "Faqat dialog ichida"], "Odatiy (auto) popover tashqarini bosganda yopiladi."),
    ch("<template> ichidagi HTML nima bo'ladi?", "Sahifada ko'rinmaydi, JS orqali klonlab ishlatiladi", ["Oddiy ko'rinadi", "Server tomonida chiqariladi", "Faqat bosilganda ko'rinadi"], "template kontenti render qilinmaydi."),
    ch("iframe sandbox atributi qanday ishlaydi?", "Bo'sh sandbox hamma narsani cheklaydi, ruxsatlar alohida qo'shiladi", ["Faqat rasmni cheklaydi", "Iframe ni tezlashtiradi", "Iframe ni yashiradi"], "Masalan sandbox=\"allow-scripts\" faqat skriptga ruxsat beradi."),
    ch("Nega ba'zi saytlar iframe ichida ochilmaydi?", "Server X-Frame-Options yoki CSP frame-ancestors bilan taqiqlagan", ["Brauzer iframe ni qo'llamaydi", "Sayt juda katta", "Iframe faqat bitta bo'ladi"], "Bu clickjacking dan himoya."),
    fill("Dialogni modal ochuvchi metod nomi? (showModal)", 'showModal', "dialog.showModal() modal ochadi.", ['showModal']),
    order("Dialog hayot siklini tartiblang.", ['Tugma bosiladi', 'showModal() chaqiriladi', "Dialog top layer'ga chiqadi", 'Esc yoki close() bilan yopiladi'], "Avval chaqiriladi, keyin ko'rinadi, oxirida yopiladi."),
  ],
});

/* 7 ------------------------------------------------------------------------------------------ */
lesson({
  title: 'SEO va meta teglar',
  intro: "title, description, canonical, Open Graph, robots, sitemap va JSON-LD.",
  theory: {
    analogy: { icon: '📇', title: 'Vizitka va ko\'rsatkich', text: "Sayt sahifasi qidiruv tizimi uchun kitob javonidagi kitobga o'xshaydi: muqovasi (title), orqa tomondagi qisqa tavsif (description) va qaysi bo'limdaligi (sitemap) bo'lsa, uni tez topishadi. Meta teglar shu muqova va ko'rsatkichlarni tayyorlaydi." },
    sections: [
      { heading: 'Eng zarur meta teglar', code: { lang: 'html', text: '<title>HTML kursi: boshlang\'ich daraja | Lug\'at</title>\n<meta name="description" content="HTML ni noldan o\'rganing: teglar, formalar, semantika va amaliy mashqlar." />\n<link rel="canonical" href="https://example.uz/html-kursi" />\n<meta property="og:title" content="HTML kursi" />\n<meta property="og:image" content="https://example.uz/og.png" />' } },
      { table: { head: ['Teg', 'Nima uchun', 'Eslatma'], rows: [['title', "Qidiruv natijasida sarlavha, brauzer tabida nom", "Taxminan 50–60 belgi, har sahifada noyob"], ['description', "Qidiruv natijasidagi tavsif", "Reytingga to'g'ridan-to'g'ri ta'sir qilmaydi, bosishlar soniga ta'sir qiladi"], ['canonical', "Bir xil mazmunli URL lardan asosiysini ko'rsatadi", "Dublikat sahifalar uchun"], ['og:*', "Telegram, Facebook kabilarda havola ko'rinishi", "og:title, og:description, og:image"], ['robots', "Indekslash qoidasi", "noindex sahifani natijalardan chiqaradi"]] } },
      { heading: 'robots.txt va sitemap.xml', bullets: ["robots.txt — botlarga qaysi yo'llarga kirmaslikni aytadi. Bu indeksdan chiqarishni kafolatlamaydi.", "meta robots noindex — sahifani qidiruv natijasidan chiqaradi. Bot sahifaga kira olsagina ko'radi.", "sitemap.xml — indekslash kerak bo'lgan sahifalar ro'yxati."] },
      { heading: 'JSON-LD', code: { lang: 'html', text: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "HTML kursi",\n  "author": { "@type": "Person", "name": "Aziz" }\n}\n</script>' } },
      { callout: { kind: 'info', text: "JSON-LD sahifa mazmunini mashinaga tushunarli qiladi (maqola, mahsulot, savol-javob). Qidiruv natijasida boy ko'rinish (rating, narx) chiqishi mumkin." } },
    ],
    recap: ["Har sahifada noyob title va description.", "canonical dublikatlar orasidan asosiyni ko'rsatadi.", "robots.txt kirishni, noindex indekslashni boshqaradi.", "JSON-LD mazmunni mashinaga tushuntiradi."],
  },
  defs: [
    ['SEO', "sayt qidiruv tizimlarida to'g'ri topilishi va tushunilishi uchun qilinadigan ishlar (Search Engine Optimization)."],
    ['Canonical URL', "bir xil mazmunning bir nechta manzili orasidagi asosiy manzil."],
    ['Open Graph', "havola ulashilganda ijtimoiy tarmoqda ko'rinadigan sarlavha, tavsif va rasmni belgilovchi teglar."],
    ['Indekslash', "qidiruv tizimi sahifani o'z bazasiga qo'shishi."],
    ['Structured data', "mazmunni mashinaga tushunarli formatda (JSON-LD, schema.org) berish."],
  ],
  life: [
    ['📚', 'Kutubxona kartochkasi', "Kutubxonachi kitobni muqovasiga qarab emas, kartochkadagi nom, muallif va qisqa tavsifga qarab topadi. title va description sizning sahifangiz kartochkasi."],
    ['✈️', 'Telegramda havola', "Do'stingizga havola tashlasangiz, chiroyli rasm va sarlavha chiqadi. Bu og:image va og:title ishi. Ularsiz havola quruq matn bo'lib ketadi."],
    ['🚧', "\"Kirish mumkin emas\" yozuvi", "robots.txt — eshikdagi yozuv: halol botlar kirmaydi. Lekin yozuv sahifa borligini yashirmaydi. Yashirish uchun noindex kerak."],
  ],
  practice: [
    { title: 'To\'liq SEO paketi', text: "Landing sahifaga title, description, canonical, og:title, og:description, og:image va JSON-LD qo'shing. Keyin Lighthouse'ni ishga tushirib SEO ballini ko'ring." },
    { title: 'Havola ko\'rinishi', text: "Sahifa manzilini Telegram yoki boshqa messenjerga tashlab, og teglarisiz va ular bilan qanday ko'rinishini solishtiring." },
  ],
  items: [
    ch("<title> nima uchun muhim?", "Qidiruv natijasida sarlavha bo'lib chiqadi va brauzer tabida ko'rinadi", ["Faqat rasmlarni yuklaydi", "Sahifa rangini belgilaydi", "Faqat serverga yuboriladi"], "Har sahifada noyob va tavsifli title yozing."),
    ch("meta description reytingga ta'sir qiladimi?", "To'g'ridan-to'g'ri yo'q, lekin natijada bosishlar sonini oshirishi mumkin", ["Ha, eng muhim omil", "Yo'q, umuman ko'rinmaydi", "Faqat mobil natijada ta'sir qiladi"], "Description — qidiruv natijasidagi tavsif matni."),
    ch("canonical nima qiladi?", "Bir xil mazmunli bir necha URL orasidan asosiysini ko'rsatadi", ["Sahifani o'chiradi", "Sahifani tezlashtiradi", "Sahifani parol bilan himoyalaydi"], "Masalan ?utm= bilan kelgan manzillar uchun."),
    ch("og:image nimani belgilaydi?", "Havola ulashilganda ko'rinadigan rasm", ["Sayt ikonkasini", "Sahifa fonini", "Qidiruvdagi rasmlarni"], "Open Graph teglari ijtimoiy tarmoqlar uchun."),
    ch("robots.txt dagi Disallow sahifa indeksdan chiqishini kafolatlaydimi?", "Yo'q: bu faqat botlarning kirishini cheklaydi, sahifani chiqarish uchun noindex kerak", ["Ha, har doim", "Ha, faqat Google uchun", "Yo'q, u umuman ishlamaydi"], "Boshqa saytlar havola bergan bo'lsa, manzil baribir natijada chiqishi mumkin."),
    ch("sitemap.xml nima?", "Indekslash uchun sahifalar manzillari ro'yxati", ["Sayt xaritasi rasmi", "Server sozlamalari fayli", "CSS fayl"], "Botga yangi va muhim sahifalarni topishda yordam beradi."),
    ch("JSON-LD nima uchun?", "Sahifa mazmunini mashinaga tushunarli (schema.org) formatda berish uchun", ["Sahifa dizayni uchun", "Rasm yuklash uchun", "Server so'rovlarini kuzatish uchun"], "Natijada boy ko'rinish (rating, narx) chiqishi mumkin."),
    ch("noindex qo'yilgan sahifani sitemap.xml ga qo'shish to'g'rimi?", "Yo'q: bu ziddiyat, sitemapda faqat indekslanishi kerak sahifalar bo'ladi", ["Ha, har doim", "Ha, tezroq o'chiriladi", "Farqi yo'q"], "Sitemap — \"mana bularni indekslang\" degan taklif."),
    ch("Title uzunligi taxminan qancha bo'lgani ma'qul?", "Taxminan 50–60 belgi", ["500 belgi", "5 belgi", "Cheklov yo'q"], "Uzunroq title natijada kesilib qoladi."),
    ch("Lighthouse SEO ball 100 degani nimani anglatadi?", "Texnik asoslar to'g'ri, lekin mazmun sifati baholanmagan", ["Sayt birinchi o'rinda chiqadi", "Reyting kafolatlangan", "Barcha ijtimoiy teglar bor"], "Avtomatik tekshiruv faqat texnik qismni ko'radi."),
    fill("Qidiruv natijasidagi tavsifni beruvchi meta name qiymati? (bitta so'z)", 'description', "<meta name=\"description\" content=\"...\">.", ['description']),
    ch("canonical qanday teg bilan yoziladi?", "<link rel=\"canonical\" href=\"...\">", ["<meta name=\"canonical\">", "<a rel=\"canonical\">", "<canonical>"], "Bu link, meta emas va head ichida turadi."),
  ],
});

const out = path.join(__dirname, '..', 'src', 'main', 'resources', 'dev', 'frontend-html-junior.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(L, null, 1));
console.log(`wrote ${L.length} lessons, ${L.reduce((a, l) => a + l.items.length, 0)} items -> ${out}`);
