// HTML, MIDDLE level, lessons 5-8: form submission and FormData, validation, field types and autofill, keyboard and focus.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 5 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Forma yuborish va FormData",
    intro: "Yuborish mexanikasi, GET va POST, tugma turlari, requestSubmit, FormData qoidalari va fayl yuklash.",
    what: "Forma yuborilganda brauzer tekshiradi, submit hodisasini chiqaradi, name atributli maydonlardan name=value juftliklarini yig'adi va action manziliga method bilan jo'natadi. FormData (forma ma'lumoti) obyekti shu yig'ish qoidalarini JavaScript ga beradi.",
    analogy: { icon: '📦', title: "Pochta posilkasi", text: "Posilkaga faqat yorlig'i (name) bor va yo'qotilmagan (disabled emas) narsalar solinadi. Yorliqsiz buyum uyda qoladi — serverga yetib bormaydi." },
    defs: [
      ['Implicit submission (yashirin yuborish)', "Matn maydonida Enter bosilganda formaning birinchi submit tugmasi bosilgandek ishlashi."],
      ['FormData (forma ma\'lumoti)', "Formadagi yuboriladigan juftliklar to'plami."],
      ['enctype (kodlash turi)', "POST tanasi qanday shaklda jo'natilishi: urlencoded yoki multipart/form-data."],
      ['Submitter (yuborgan tugma)', "Formani yuborishga sabab bo'lgan tugma."],
    ],
    uses: [
      ["Login, qidiruv, sozlamalar", "Brauzerning tayyor yuborish xatti-harakatidan foydalanasiz."],
      ["AJAX so'rovda", "fetch ga body: new FormData(form) berasiz."],
      ["Bir formada ikki amal", "formaction, formmethod, formnovalidate."],
    ],
    sections: [
      { heading: 'GET va POST', table: { head: ['', 'GET', 'POST'], rows: [['Ma\'lumot qayerda', "URL query da", "so'rov tanasida"], ['Ulashsa bo\'ladimi', 'ha', "yo'q"], ['Qachon', 'qidiruv, filtr', "yaratish, o'zgartirish, parol, fayl"]] } },
      { heading: 'Tugma turlari', code: { lang: 'html', text: '<form action="/order" method="post">\n  <input name="note">\n  <button type="button">Hisoblash</button>      <!-- yubormaydi -->\n  <button>Buyurtma</button>                     <!-- type yo\'q = submit -->\n  <button formnovalidate formaction="/draft">Qoralama</button>\n</form>' }, bullets: ["form.submit() validatsiya qilmaydi va submit hodisasini chiqarmaydi.", "form.requestSubmit() tugma bosilgandek ishlaydi.", "Forma tashqarisidagi tugma form=\"id\" bilan ulanadi."] },
      { heading: 'FormData qoidalari', bullets: ["name yo'q maydon yuborilmaydi.", "disabled maydon yuborilmaydi, readonly yuboriladi.", "Belgilanmagan checkbox umuman yo'q; belgilangani value, u bo'lmasa \"on\".", "Bir xil nomlilar uchun getAll(); Object.fromEntries oxirgisini qoldiradi.", "Tugmaning name/value si new FormData(form) ga kirmaydi (submitter berilmasa)."] },
      { heading: 'Fayl yuklash', code: { lang: 'js', text: "// HTML: <form method=\"post\" enctype=\"multipart/form-data\">\nform.addEventListener('submit', async (e) => {\n  e.preventDefault();\n  await fetch('/api/upload', {\n    method: 'POST',\n    body: new FormData(form), // Content-Type ni QO'LDA YOZMANG\n  });\n});" }, callout: { kind: 'warn', text: "Content-Type ni qo'lda yozsangiz boundary (qismlar chegarasi) yo'qoladi va server faylni o'qiy olmaydi." } },
    ],
    life: [
      ['🔁', "Sahifa o'zi yangilanib ketdi", "Forma ichidagi \"Filtr\" tugmasida type=\"button\" yo'q edi."],
      ['🔗', "Qidiruv havolasi", "method=\"get\" bo'lgani uchun /search?q=react ni do'stga yuborsa bo'ladi."],
    ],
    tip: "Forma ichidagi har bir amal tugmasiga type=\"button\" yozing; yuboradigani bitta va aniq bo'lsin.",
    mistakes: [
      ['Parolni method="get" bilan yuborish.', "method=\"post\" va HTTPS.", "URL tarixda va server loglarida qoladi."],
      ['Dasturiy yuborishda form.submit().', "form.requestSubmit().", "submit() tekshiruv va hodisani chetlab o'tadi."],
      ['submit o\'rniga tugmaning click hodisasini tinglash.', "form ning submit hodisasi.", "Enter bilan yuborish ham ushlanadi."],
    ],
    recap: [
      "Standart: type yozilmagan tugma — submit.",
      "FormData name li va disabled bo'lmagan maydonlarni oladi.",
      "Fayl uchun multipart/form-data.",
      "Hodisani forma submit ida tinglang.",
    ],
    practice: [
      { title: "Network panelida ko'ring", text: "Bitta formani avval GET, keyin POST bilan yuborib, ma'lumot URL da yoki Payload bo'limida ekanini solishtiring." },
      { title: "FormData ni chop eting", text: "submit da [...new FormData(form)] ni konsolga chiqarib, disabled, readonly va checkbox maydonlarini sinang." },
    ],
    items: [
      ch("Forma yuborilganda FormData da qaysi kalitlar bo'ladi?", "b va d", ["a, b va d", "a, b, c va d", "faqat d"], "a disabled, c belgilanmagan checkbox. readonly (b) va hidden (d) yuboriladi.", '<input name="a" value="1" disabled>\n<input name="b" value="2" readonly>\n<input name="c" type="checkbox">\n<input name="d" type="hidden" value="4">'),
      ch("Konsolda nima chiqadi?", "\"css\"", ["\"js\"", "\"js,css\"", "[\"js\",\"css\"]"], "Object.fromEntries bir xil kalitning oxirgi qiymatini qoldiradi.", '<input type="checkbox" name="tag" value="js" checked>\n<input type="checkbox" name="tag" value="css" checked>\n<script>\n  const o = Object.fromEntries(new FormData(f));\n  console.log(o.tag);\n</script>'),
      ch("data.get('news') nima qaytaradi? (<input type=\"checkbox\" name=\"news\" checked>, value yozilmagan)", "\"on\"", ["true", "\"checked\"", "null"], "value yo'q checkbox belgilansa, standart qiymat \"on\"."),
      ch("\"Ochish\" bosilganda nima bo'ladi?", "Forma yuboriladi", ["Faqat click hodisasi ishlaydi", "Hech narsa bo'lmaydi", "Maydonlar tozalanadi"], "type yozilmagan tugma forma ichida submit hisoblanadi.", '<form action="/save">\n  <input name="q">\n  <button onclick="openPanel()">Ochish</button>\n</form>'),
      ch("JavaScript dan formani validatsiya va submit hodisasi bilan yuborish uchun?", "form.requestSubmit()", ["form.submit()", "form.send()", "form.dispatchEvent(new Event('send'))"], "requestSubmit tugma bosilgandek ishlaydi."),
      ch("Fayl tanlangan, lekin serverga faqat fayl nomi bormoqda. Nima yetishmayapti?", "enctype=\"multipart/form-data\"", ["accept=\"multipart/form-data\"", "method=\"get\"", "multiple atributi"], "Standart urlencoded kodlash faylning o'zini yubora olmaydi."),
      ch("Quyidagi kodda server faylni o'qiy olmayapti. Sabab nima?", "Content-Type qo'lda yozilgan", ["FormData fetch bilan ishlamaydi", "POST o'rniga PUT kerak", "body JSON.stringify qilinmagan"], "Brauzer boundary ni o'zi qo'shishi kerak; qo'lda yozilgan sarlavhada u yo'q.", "fetch('/up', {\n  method: 'POST',\n  headers: { 'Content-Type': 'multipart/form-data' },\n  body: new FormData(form),\n});"),
      ch("\"Qoralama\" tugmasi bo'sh majburiy maydonlar bilan ham formani yuborishi kerak. Qaysi atribut?", "formnovalidate", ["novalidate-button", "type=\"reset\"", "formtarget"], "formnovalidate shu tugma orqali yuborilganda tekshiruvni o'chiradi."),
      ch("Qaysi holatda method=\"get\" to'g'ri tanlov?", "Mahsulot qidiruvi va filtr", ["Login va parol bilan hisobga kirish", "Rasm yuklash", "Hisobni o'chirish"], "GET faqat o'qish uchun; natija URL da saqlanadi va ulashiladi."),
      fill("Bir xil nomli barcha qiymatlarni massiv qilib beradigan FormData metodi:", "getAll", "data.getAll('tag') — [\"js\", \"css\"].", ["getAll()"]),
      fill("Forma tashqarisidagi tugmani id=\"pay\" formaga ulaydigan atribut nomi:", "form", "<button form=\"pay\">To'lash</button>."),
      order("Foydalanuvchi yuborish tugmasini bosgandan keyingi tartib:", ["validatsiya", "submit hodisasi", "juftliklar yig'iladi", "so'rov yuboriladi"], "Validatsiyadan o'tmasa submit hodisasi umuman chiqmaydi."),
    ],
  });

  /* 6 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Validatsiya va xatolarni ko'rsatish",
    intro: "required, pattern, min/max, :user-invalid, Constraint Validation API va xatoni hamma uchun tushunarli qilish.",
    what: "Constraint validation (cheklov tekshiruvi) — brauzerning o'zida bor forma tekshiruvi: atributlar qoidani beradi, validity obyekti qaysi qoida buzilganini aytadi, setCustomValidity esa o'z xatoingizni qo'shadi. Bu foydalanuvchi qulayligi uchun, xavfsizlik uchun emas: server hammasini qayta tekshiradi.",
    analogy: { icon: '🛂', title: "Ikki nazorat", text: "Aeroportda kirishdagi tekshiruv navbatni tezlashtiradi (brauzer), lekin asosiy nazorat chegarada (server). Birinchisini chetlab o'tsa bo'ladi, ikkinchisini yo'q." },
    defs: [
      ['Constraint (cheklov)', "Maydon qiymatiga qo'yilgan talab."],
      ['validity (yaroqlilik obyekti)', "valueMissing, typeMismatch, patternMismatch kabi bayroqlar."],
      ['setCustomValidity', "O'z xato xabaringizni o'rnatadi; bo'sh satr bilan bekor qilinadi."],
      ['aria-invalid / aria-describedby', "Maydon xato ekanini va xato matni qayerdaligini bildiradi."],
    ],
    uses: [
      ["Ro'yxatdan o'tishda", "Maydon ostida aniq xato matni ko'rsatasiz."],
      ["\"Bu login band\" kabi server xatosida", "setCustomValidity yoki aria-invalid bilan maydonga bog'laysiz."],
      ["O'z dizayningiz kerak bo'lsa", "novalidate + checkValidity."],
    ],
    sections: [
      { heading: 'validity bayroqlari', table: { head: ['Bayroq', 'Qachon true'], rows: [['valueMissing', "required, qiymat bo'sh"], ['typeMismatch', 'email yoki url formati xato'], ['patternMismatch', "pattern ga TO'LIQ mos emas"], ['tooShort / tooLong', 'uzunlik chegarasi (foydalanuvchi tahririda)'], ['rangeUnderflow / rangeOverflow', 'min / max buzilgan'], ['stepMismatch', 'step ga mos emas'], ['customError', 'setCustomValidity berilgan']] } },
      { heading: 'Nozik qoidalar', bullets: ["pattern butun qiymatga mos kelishi kerak (^ va $ yozilgandek).", "Bo'sh ixtiyoriy maydon pattern va minlength tekshiruvidan o'tadi.", "disabled va readonly maydonlar tekshirilmaydi.", ":invalid sahifa ochilishi bilan ishlaydi, :user-invalid foydalanuvchi maydon bilan ishlagandan keyin."] },
      { heading: "O'z xabaringiz", code: { lang: 'js', text: "form.noValidate = true;\nform.addEventListener('submit', (e) => {\n  if (!form.checkValidity()) {\n    e.preventDefault();\n    const bad = form.querySelector(':invalid');\n    bad.setAttribute('aria-invalid', 'true');\n    errorBox.textContent = bad.validationMessage;\n    bad.focus();\n  }\n});\n\nlogin.setCustomValidity('Bu login band');\nlogin.addEventListener('input', () => login.setCustomValidity(''));" } },
      { heading: 'Tushunarli xato', code: { lang: 'html', text: '<label for="email">Email</label>\n<input id="email" type="email" aria-invalid="true"\n       aria-describedby="email-err">\n<p id="email-err">Email noto\'g\'ri. Masalan: ali@example.com</p>' }, callout: { kind: 'warn', text: "Faqat qizil chegara yetarli emas: rangni ko'rmaydigan odam va ekran o'qish dasturi xatoni bilmay qoladi." } },
    ],
    life: [
      ['😤', "Sahifa ochilishi bilan qizil", ":invalid ishlatilgan — :user-invalid kerak."],
      ['🧨', 'curl bilan chetlab o\'tish', "required faqat brauzerda; serverga bo'sh qiymat baribir kelishi mumkin."],
    ],
    tip: "Xato xabari ikki narsani aytsin: nima noto'g'ri va qanday tuzatish. Yuborilganda fokusni birinchi xato maydonga o'tkazing.",
    mistakes: [
      ['setCustomValidity xabarini tozalamaslik.', "input da setCustomValidity('').", "Maydon abadiy xato bo'lib qoladi."],
      ['Har harfda xato ko\'rsatish.', "blur yoki submit da tekshirish.", "Yozib bo'lmagan odamni urishmang."],
      ['Faqat client validatsiyaga ishonish.', "Serverda ham tekshirish.", "So'rovni qo'lda yuborish oson."],
    ],
    recap: [
      "Atribut qoidani beradi, validity sababni aytadi.",
      "pattern to'liq moslikni talab qiladi.",
      "Custom xatoni bo'sh satr bilan tozalang.",
      "Xato matn bilan va maydonga bog'langan bo'lsin.",
    ],
    practice: [
      { title: "validity ni kuzating", text: "Maydonga turli qiymat yozib, konsolda input.validity obyektini ko'ring." },
      { title: "O'z xatolaringiz", text: "novalidate li ro'yxatdan o'tish formasi yozing: xato matni, aria-invalid, aria-describedby va birinchi xatoga fokus." },
    ],
    items: [
      ch("pattern=\"[0-9]{3}\" li ixtiyoriy bo'lmagan maydonga \"1234\" yozildi. Holat qanday?", "Xato: patternMismatch", ["Yaroqli: ichida 3 raqam bor", "Xato: rangeOverflow", "Xato: valueMissing"], "pattern butun qiymatga qo'llanadi, qisman moslik hisoblanmaydi."),
      ch("<input pattern=\"[a-z]+\"> bo'sh qoldirildi, required yo'q. Forma yuboriladimi?", "Ha, maydon yaroqli", ["Yo'q, patternMismatch", "Yo'q, valueMissing", "Faqat Enter bosilsa"], "Bo'sh qiymat pattern bilan tekshirilmaydi; majburiylik uchun required kerak."),
      ch("Konsolda nima chiqadi?", "false", ["true", "undefined", "\"Band\""], "customError bor, shuning uchun checkValidity false qaytaradi.", "input.value = 'ali';\ninput.setCustomValidity('Band');\nconsole.log(input.checkValidity());"),
      ch("Foydalanuvchi loginni o'zgartirdi, lekin forma hali ham yuborilmayapti. Kodda faqat setCustomValidity('Bu login band') bor. Nima unutilgan?", "Xabarni bo'sh satr bilan tozalash", ["novalidate atributini qo'shish", "reportValidity ni o'chirish", "required ni olib tashlash"], "Custom xato o'zi yo'qolmaydi."),
      ch("Maydon sahifa ochilishi bilan qizil bo'lmasligi, faqat foydalanuvchi ishlagach qizarishi kerak. Selektor?", "input:user-invalid", ["input:invalid", "input:required:invalid", "input[invalid]"], ":invalid darhol ishlaydi."),
      ch("<input type=\"text\" required disabled> bo'sh. form.checkValidity() natijasi? (boshqa maydon yo'q)", "true", ["false", "undefined", "Xatolik tashlaydi"], "disabled maydon tekshiruvda qatnashmaydi."),
      ch("novalidate qo'yilgan formada checkValidity() qanday ishlaydi?", "Qoidalarni avvalgidek tekshiradi", ["Doim true qaytaradi", "Doim false qaytaradi", "Faqat required maydonni tekshiradi"], "novalidate faqat yuborishdagi avtomatik tekshiruv va pufakchani o'chiradi."),
      ch("age maydoni: type=\"number\" min=\"18\". Qiymat \"15\". Qaysi bayroq true?", "rangeUnderflow", ["rangeOverflow", "stepMismatch", "tooShort"], "Qiymat pastki chegaradan kichik."),
      ch("Xato matnini maydonga ekran o'qish dasturi uchun bog'laydigan juftlik qaysi?", "aria-invalid va aria-describedby", ["title va placeholder", "role=\"error\" va data-error-text", "aria-hidden va data-error"], "aria-invalid holatni, aria-describedby matnni bog'laydi."),
      fill("Brauzer pufakchalarisiz o'zingiz tekshirish uchun formaga qo'yiladigan atribut:", "novalidate", "Qoidalar saqlanadi, standart xabar chiqmaydi."),
      fill("Maydonning brauzer yaratgan xato matnini beradigan property:", "validationMessage", "input.validationMessage — foydalanuvchi tilidagi xabar.", ["validationmessage"]),
      fill("Pufakchani ko'rsatib tekshiradigan metod: ...Validity()", "report", "reportValidity() checkValidity() dan farqli ravishda xabarni ekranga chiqaradi.", ["reportValidity", "reportValidity()"]),
    ],
  });

  /* 7 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Input turlari, autocomplete va mobil qulaylik",
    intro: "To'g'ri type, inputmode, autocomplete tokenlari, number tuzoqlari, fieldset va datalist.",
    what: "To'g'ri type va autocomplete (avtomatik to'ldirish) bepul foyda beradi: mos telefon klaviaturasi, format tekshiruvi, parol menejeri va manzilni bir bosishda to'ldirish. input.value esa turdan qat'i nazar doim satr qaytaradi.",
    analogy: { icon: '⌨️', title: "Mos asbob", text: "Usta har ish uchun boshqa kalit oladi. Telefon raqami uchun raqamli klaviatura, email uchun @ tugmasi bor klaviatura — foydalanuvchining barmog'i charchamaydi." },
    defs: [
      ['inputmode (kiritish rejimi)', "Faqat klaviatura turini tanlaydi, tekshiruv qo'shmaydi."],
      ['autocomplete token (to\'ldirish belgisi)', "Maydon ma'nosi: email, current-password, one-time-code."],
      ['fieldset / legend', "Bog'liq maydonlar guruhi va uning nomi."],
      ['datalist (takliflar ro\'yxati)', "Taklif beradi, lekin boshqa qiymat yozishga ruxsat beradi."],
    ],
    uses: [
      ["Checkout (to'lov) sahifasida", "Manzil va karta tokenlari bilan to'ldirish tezlashadi."],
      ["SMS kod maydonida", "autocomplete=\"one-time-code\" va inputmode=\"numeric\"."],
      ["Radio guruhida", "fieldset + legend savolni aytadi."],
    ],
    sections: [
      { heading: 'autocomplete tokenlari', table: { head: ['Token', 'Qayerda'], rows: [['username, current-password', 'kirish formasi'], ['new-password', "ro'yxatdan o'tish, parol almashtirish"], ['one-time-code', 'SMS / bir martalik kod'], ['name, email, tel', 'aloqa'], ['street-address, postal-code', 'manzil'], ['cc-number, cc-exp, cc-csc', "to'lov kartasi"]] } },
      { heading: 'number tuzoqlari', bullets: ["Karta raqami, pochta indeksi, pasport raqami son EMAS: type=\"text\" inputmode=\"numeric\".", "type=\"number\" da o'q tugmalar bor, scroll qiymatni o'zgartirishi mumkin.", "Noto'g'ri kiritilgan matnda value bo'sh satr bo'ladi.", "Son kerak bo'lsa valueAsNumber."] },
      { heading: 'Kod maydoni', code: { lang: 'html', text: '<input name="code" type="text" inputmode="numeric"\n       autocomplete="one-time-code" enterkeyhint="done"\n       maxlength="6" pattern="[0-9]{6}">' } },
      { heading: 'Guruh', code: { lang: 'html', text: '<fieldset>\n  <legend>Yetkazib berish</legend>\n  <label><input type="radio" name="d" value="courier" checked> Kuryer</label>\n  <label><input type="radio" name="d" value="pickup"> Olib ketish</label>\n</fieldset>' }, callout: { kind: 'info', text: "Radiolar bitta guruh bo'lishi uchun name bir xil bo'ladi. fieldset disabled ichidagi hamma maydonni o'chiradi." } },
    ],
    life: [
      ['🔐', 'Parol menejeri', "current-password va new-password to'g'ri bo'lsa, menejer kerakli parolni taklif qiladi yoki yangisini yaratadi."],
      ['📲', 'SMS kod', "one-time-code bilan telefon kodni klaviatura ustida taklif qiladi."],
    ],
    tip: "Har maydon uchun uch savol: type nima, klaviatura qanday, brauzer uni nima deb to'ldiradi (autocomplete).",
    mistakes: [
      ['Telefon uchun type="number".', "type=\"tel\".", "+ va boshidagi nollar buziladi."],
      ['placeholder ni label o\'rniga.', "label for.", "Yozganda yo'qoladi va kontrasti past."],
      ['Parol maydonida autocomplete="off".', "current-password yoki new-password.", "Parol menejeri zaif parolga majburlamaydi."],
    ],
    recap: [
      "value doim satr; valueAsNumber va valueAsDate qulay.",
      "inputmode klaviatura, type esa ma'no va tekshiruv.",
      "autocomplete tokenlari to'ldirishni yoqadi.",
      "Radio guruhi: bir xil name + fieldset/legend.",
    ],
    practice: [
      { title: 'Telefonda sinang', text: "type=text, email, tel, url va inputmode=numeric maydonlarini telefonda ochib klaviaturalarni solishtiring." },
      { title: 'Checkout formasi', text: "Ism, telefon, manzil va karta maydonlariga to'g'ri type va autocomplete bering." },
    ],
    items: [
      ch("Konsolda nima chiqadi?", "\"251\"", ["26", "\"26\"", "NaN"], "value satr: \"25\" + 1 = \"251\".", '<input id="n" type="number" value="25">\n<script>\n  console.log(n.value + 1);\n</script>'),
      ch("Pochta indeksi \"010001\" uchun eng to'g'ri maydon qaysi?", "type=\"text\" inputmode=\"numeric\"", ["type=\"number\" inputmode=\"decimal\"", "type=\"tel\" step=\"any\"", "type=\"range\" min=\"0\""], "Indeks identifikator: boshidagi nol saqlanishi kerak."),
      ch("Parol almashtirish formasida yangi parol maydonining autocomplete qiymati?", "new-password", ["current-password", "off", "password"], "new-password menejerga yangi kuchli parol taklif qilishni aytadi."),
      ch("inputmode=\"numeric\" harf yozishni taqiqlaydimi?", "Yo'q, faqat klaviaturani tanlaydi", ["Ha, harflar umuman kiritilmaydi", "Ha, forma yuborilmay qoladi", "Faqat iPhone da taqiqlaydi"], "Tekshiruv uchun pattern va server kerak."),
      ch("Ikkala radio ham bir vaqtda tanlanyapti. Sabab?", "name qiymatlari har xil", ["fieldset yozilmagan", "value atributi yo'q", "label ichida joylashgan"], "Radio guruhi name bo'yicha hosil bo'ladi.", '<input type="radio" name="d1" value="a">\n<input type="radio" name="d2" value="b">'),
      ch("Foydalanuvchi ro'yxatdan tanlashi ham, o'z shahrini yozishi ham mumkin bo'lsin. Nima ishlatiladi?", "input + datalist", ["select + option", "radio guruhi", "select multiple"], "select faqat tayyor variantlarni beradi."),
      ch("number maydonga \"12a\" kabi yaroqsiz narsa kiritilsa input.value nima?", "bo'sh satr", ["\"12a\"", "12", "null qiymat"], "Yaroqsiz son uchun value \"\" bo'ladi."),
      ch("<label> bilan input to'g'ri bog'langan variant qaysi?", "<label for=\"c\">Shahar</label><input id=\"c\">", ["<label id=\"c\">Shahar</label><input for=\"c\">", "<label name=\"c\">Shahar</label><input name=\"c\">", "<label>Shahar</label><input id=\"c\">"], "for label da, id input da turadi (yoki input label ichiga joylanadi)."),
      ch("Barcha to'lov maydonlarini birdaniga o'chirishning eng qisqa yo'li?", "<fieldset disabled>", ["<form disabled>", "<div inert-form>", "<legend disabled>"], "fieldset disabled ichidagi boshqaruvlarni o'chiradi; form da disabled atributi yo'q."),
      fill("SMS kodni telefon taklif qilishi uchun: autocomplete=\"...\"", "one-time-code", "one-time-code — bir martalik kod."),
      fill("Mobil klaviaturadagi Enter tugmasi yozuvini o'zgartiradigan atribut:", "enterkeyhint", "next, send, search, done qiymatlarini oladi."),
      fill("type=\"number\" qiymatini to'g'ridan-to'g'ri son qilib beradigan property:", "valueAsNumber", "input.valueAsNumber — satrni o'girib o'tirmaysiz.", ["valueasnumber"]),
    ],
  });

  /* 8 ---------------------------------------------------------------------------------------- */
  lesson({
    title: "Klaviatura, fokus va kontrast",
    intro: "WCAG tamoyillari, tabindex, fokus tartibi va ko'rinishi, skip link, kontrast va bosish maydoni.",
    what: "Accessibility (a11y — hamma foydalana olishi) ning eng amaliy sinovi: sichqonchani chetga qo'yib, sahifani faqat klaviatura bilan ishlata olasizmi va qayerda turganingizni ko'rasizmi. WCAG (veb-kontent qulayligi standarti) 2.2 da odatda AA darajasi maqsad qilinadi.",
    analogy: { icon: '🔦', title: "Qorong'ida chiroq", text: "Fokus halqasi klaviatura foydalanuvchisining chirog'i. outline: none yozish — chiroqni o'chirib, \"yo'lni o'zing top\" deyish." },
    defs: [
      ['Focus (fokus)', "Klaviatura buyruqlari yo'naltirilgan element."],
      ['Tab order (Tab tartibi)', "Fokus elementlar bo'ylab yurish ketma-ketligi; odatda DOM tartibi."],
      ['Skip link (o\'tib ketish havolasi)', "Menyuni sakrab asosiy mazmunga olib boradigan havola."],
      ['Contrast ratio (kontrast nisbati)', "Matn va fon yorqinligi farqi: 1:1 dan 21:1 gacha."],
      ['POUR', "Perceivable, Operable, Understandable, Robust — WCAG ning to'rt tamoyili."],
    ],
    uses: [
      ["Har bir yangi komponentda", "Tab, Shift+Tab, Enter, Space, Esc bilan sinaysiz."],
      ["Dizayn kelganda", "Kontrastni DevTools rang tanlagichida tekshirasiz."],
      ["Ikonka tugmalarda", "Bosish maydoni kamida 24×24 CSS piksel."],
    ],
    sections: [
      { heading: 'tabindex qiymatlari', table: { head: ['Qiymat', 'Natija'], rows: [['0', "tabiiy tartibga qo'shadi"], ['-1', "Tab yetmaydi, lekin element.focus() ishlaydi"], ['1 va yuqori', "boshqalardan OLDIN keladi, tartibni buzadi — ishlatmang"]] } },
      { heading: 'Klaviatura xatti-harakati', bullets: ["a[href]: Enter. button: Enter va Space. checkbox: Space.", "radio guruhi ichida o'q tugmalari, guruhga bitta Tab.", "href siz <a> fokus olmaydi.", "div onclick klaviaturada ishlamaydi: button ishlating."] },
      { heading: "Fokus ko'rinishi va skip link", code: { lang: 'html', text: '<a class="skip" href="#main">Asosiy qismga o\'tish</a>\n<header>...</header>\n<main id="main" tabindex="-1">...</main>\n\n<style>\n  button:focus-visible { outline: 3px solid #2f6fde; outline-offset: 2px; }\n  .skip { position: absolute; left: -999px; }\n  .skip:focus { left: 8px; top: 8px; }\n</style>' } },
      { heading: 'AA raqamlari', table: { head: ['Talab', 'Qiymat'], rows: [['Oddiy matn kontrasti', '4.5:1'], ['Katta matn (24px yoki qalin ~19px)', '3:1'], ['UI element va ikonka', '3:1'], ['Bosish maydoni', 'kamida 24×24 px'], ['Kattalashtirish', "200% da ishlashi kerak"]] }, callout: { kind: 'warn', text: "Ma'noni faqat rang bilan bermang: xato maydonida qizil rang bilan birga matn yoki belgi bo'lsin." } },
    ],
    life: [
      ['🖱️', "Singan sichqoncha", "Forma to'ldirib, buyurtma bera olasizmi? Yo'q bo'lsa, ko'p odam ham bera olmaydi."],
      ['☀️', "Quyoshli ko'cha", "Och kulrang matn telefonda ko'rinmaydi — kontrast hammaga kerak."],
    ],
    tip: "Har bir ish oxirida 2 daqiqa: faqat Tab bilan sahifani aylaning.",
    mistakes: [
      ['button:focus { outline: none }', ":focus-visible bilan o'z uslubingiz.", "Klaviatura foydalanuvchisi yo'qoladi."],
      ['Tartibni tabindex="1", "2" bilan tuzatish.', "DOM tartibini to'g'rilash.", "Musbat tabindex hamma narsani chalkashtiradi."],
      ['CSS order bilan ko\'rinishni almashtirish.', "DOM ni ko'rinish tartibida yozish.", "Fokus ekran bo'ylab sakraydi."],
    ],
    recap: [
      "Hamma amal klaviaturada ishlashi kerak.",
      "tabindex faqat 0 yoki -1.",
      "Fokus doim ko'rinadi.",
      "Matn 4.5:1, katta matn va UI 3:1.",
    ],
    practice: [
      { title: 'Sichqonchasiz sinov', text: "Yaxshi bilgan saytingizda faqat klaviatura bilan ro'yxatdan o'tishga harakat qiling va to'siqlarni yozib boring." },
      { title: 'Kontrastni o\'lchang', text: "DevTools rang tanlagichida loyihangizdagi kulrang matnlarning nisbatini tekshiring." },
    ],
    items: [
      ch("Tab bosilganda fokus qaysi tartibda yuradi?", "C, A, B", ["A, B, C", "C, B, A", "A, C, B"], "Musbat tabindex li element birinchi, keyin qolganlari DOM tartibida.", '<button>A</button>\n<button>B</button>\n<button tabindex="1">C</button>'),
      ch("tabindex=\"-1\" nima uchun ishlatiladi?", "Fokusni faqat JavaScript bilan berish", ["Elementni Tab tartibida oxiriga qo'yish", "Elementni ekrandan butunlay yashirish", "Elementni birinchi bo'lib fokuslash"], "Masalan, xato ro'yxati yoki main ga focus() qilish."),
      ch("Quyidagi \"tugma\" haqida qaysi gap to'g'ri?", "Klaviatura bilan ishlatib bo'lmaydi", ["Enter bilan ishlaydi, Space bilan yo'q", "Brauzer unga button rolini beradi", "Tab uni o'zi topadi"], "div fokus olmaydi va hech qanday rolga ega emas.", '<div class="btn" onclick="save()">Saqlash</div>'),
      ch("Quyidagi elementlardan qaysi biri Tab bilan fokus OLMAYDI?", "<a>Batafsil</a>", ["<a href=\"/x\">Batafsil</a>", "<button>Batafsil</button>", "<input type=\"checkbox\">"], "href siz a havola emas, fokuslanmaydi."),
      ch("14px oddiy matn uchun AA kontrast talabi?", "4.5:1", ["3:1", "2:1", "7:1"], "7:1 — AAA darajasi; 3:1 — katta matn."),
      ch("Dizayner fokus halqasi sichqoncha bosilganda chiqmasligini so'radi, klaviaturada esa qolsin. Yechim?", ":focus-visible da uslub berish", [":focus { outline: none } yozish", "tabindex=\"-1\" qo'shish", "mousedown da blur() qilish"], "Brauzer klaviatura fokusida :focus-visible ni yoqadi."),
      ch("Skip link bosilganda fokus asosiy qismga o'tishi uchun main ga nima qo'shish foydali?", "tabindex=\"-1\"", ["tabindex=\"1\"", "autofocus", "role=\"link\""], "Shunda main dasturiy fokus ola oladi va keyingi Tab o'sha yerdan davom etadi."),
      ch("Elementlar CSS bilan o'ngdan chapga qayta joylashtirildi. Qanday muammo chiqadi?", "Tab tartibi ko'rinishga mos kelmaydi", ["Elementlar fokus olmay qoladi", "Enter tugmasi ishlamay qoladi", "Kontrast nisbati o'zidan o'zi pasayadi"], "Tab DOM tartibida yuradi, CSS order ga qaramaydi."),
      ch("Radio guruhida (3 ta radio) variantlar orasida klaviaturada qanday yuriladi?", "O'q tugmalari bilan", ["Har biriga alohida Tab bilan", "Enter tugmasi bilan", "Page Up va Page Down bilan"], "Guruhga Tab bilan kiriladi, ichida o'qlar ishlaydi."),
      fill("WCAG 2.2 AA da bosish maydonining eng kichik tomoni necha CSS piksel? (son)", "24", "Kamida 24×24 CSS piksel."),
      fill("WCAG tamoyillarining qisqartmasi (4 harf):", "POUR", "Perceivable, Operable, Understandable, Robust.", ["pour"]),
      fill("Hozir fokusdagi elementni beradigan property: document....", "activeElement", "document.activeElement — fokus qayerdaligini tekshirish.", ["activeelement", "document.activeElement"]),
    ],
  });
};
