// React, lessons 8-14.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 8 */
  lesson({
    title: 'Reconciliation va key',
    intro: "React daraxtlarni qanday solishtiradi, state qachon saqlanadi yoki o'chadi, key bilan komponentni qayta boshlash.",
    theory: {
      analogy: { icon: '🪑', title: "Partadagi o'rin", text: "React state ni ism bo'yicha emas, o'rin bo'yicha eslaydi: o'sha partada o'sha turdagi o'quvchi o'tirsa, daftari qoladi. key — o'quvchining shaxsiy guvohnomasi." },
      sections: [
        { heading: 'Solishtirish qoidalari', bullets: ["Bir joyda tur (type) o'zgarsa — eski daraxt yo'q qilinib, yangisi quriladi.", "Tur bir xil bo'lsa — DOM tuguni va state saqlanadi, faqat props yangilanadi.", "Bolalar ro'yxati key bo'yicha, key bo'lmasa indeks bo'yicha moslanadi."] },
        { heading: 'State qayerda yashaydi', text: "State komponent kodida emas, React daraxtidagi pozitsiyada saqlanadi. Shuning uchun `{isA ? <Counter user=\"A\" /> : <Counter user=\"B\" />}` da state umumiy bo'lib qoladi: pozitsiya va tur bir xil." },
        { heading: 'key bilan qayta boshlash', code: { lang: 'jsx', text: "<Chat key={contactId} contactId={contactId} />\n// contactId o'zgarsa: eski Chat unmount, yangisi mount — draft matn tozalanadi" } },
        { table: { head: ['Holat', 'State'], rows: [['<A /> → <A /> (o\'sha joy)', 'saqlanadi'], ['<A /> → <B />', "o'chadi"], ['<div><A/></div> → <section><A/></section>', "o'chadi"], ['key o\'zgardi', "o'chadi"], ['false && <X/> qo\'shni o\'rnida', "boshqalar joyi o'zgarmaydi"]] } },
        { callout: { kind: 'warn', text: "Indeksni key qilib, boshiga element qo'shsangiz, input matnlari qo'shni qatorga «ko'chib» qoladi." } },
      ],
      recap: ["Tur + pozitsiya (yoki key) bir xil bo'lsa state qoladi.", "Tur o'zgarsa butun pastki daraxt qayta quriladi.", "key — state ni ataylab nollash vositasi.", "Indeks key tartib o'zgarmaydigan ro'yxatga yaraydi."],
    },
    defs: [
      ['Reconciliation (moslashtirish)', "yangi va eski element daraxtlarini solishtirib, minimal o'zgarishni topish."],
      ['Remount (qayta ulash)', "komponentni o'chirib, noldan qayta yaratish."],
      ['Identity (shaxsiyat)', "React komponent nusxasini tur, pozitsiya va key orqali tanishi."],
    ],
    life: [['🏨', 'Mehmonxona', "Xona raqami o'zgarmasa, ichidagi narsalar qoladi; xona almashsa, bo'sh xona beriladi."], ['🔖', 'Xatcho\'p', "key o'zgardi — yangi kitob, xatcho'p boshidan."]],
    practice: [{ title: 'Chat draft', text: "Kontakt almashganda input tozalanadigan va tozalanmaydigan ikki variant yozing." }, { title: 'Indeks tajribasi', text: "Indeks key li ro'yxatga input qo'yib, birinchi elementni o'chiring." }],
    items: [
      ch("Tugma bosilib `isRed` almashdi. Sanagich qiymati?", "Saqlanib qoladi", ["Nolga qaytadi", "Ikki barobar bo'ladi", "undefined bo'ladi"], "Tur va pozitsiya o'zgarmadi.", 'return isRed\n  ? <Counter color="red" />\n  : <Counter color="blue" />;'),
      ch('`wide` almashganda Counter state i?', "Yo'qoladi: ota teg turi o'zgardi", ["Saqlanadi: Counter o'rni o'zgarmadi", "Faqat DOM saqlanadi", "localStorage ga yoziladi"], "div → section: butun shox qayta quriladi.", 'return wide\n  ? <div><Counter /></div>\n  : <section><Counter /></section>;'),
      ch('`{showHint && <Hint />}<Form />` — showHint almashdi. Form state i?', "Saqlanadi", ["O'chadi", "Hint ga o'tadi", "Ikkilanadi"], "false ham o'rin egallaydi: Form joyi o'zgarmaydi."),
      ch('Bir xil joyda ikki profil uchun state alohida bo\'lsin. Yechim?', "Har biriga turli key berish", ["Ikkala joyda useState(null)", "useEffect ichida DOM ni tozalash", "Komponentni App ichida e'lon qilish"], "key identifikatsiyani ajratadi."),
      ch('Indeks key. Birinchi qator o\'chirilsa, uning inputidagi matn?', "Keyingi qatorda qolib ketadi", ["Qator bilan birga o'chadi", "Barcha inputlar tozalanadi", "Oxirgi qatorga ko'chadi"], "0-indeks hali bor, DOM qayta ishlatiladi."),
      ch('Qachon indeksni key qilish xavfsiz?', "Ro'yxat o'zgarmas va state siz bo'lsa", ["Ro'yxat har soniyada yangilanib tursa", "Ro'yxat tez-tez saralansa", "Elementlarda input bo'lsa"], "Tartib o'zgarmasa muammo yo'q."),
      ch('Ro\'yxat boshiga element qo\'shildi, key = barqaror id. Eski DOM tugunlari?', "Qayta ishlatiladi", ["Hammasi qayta yaratiladi", "Matni almashib chiqadi", "Oxirgisi o'chiriladi"], "Faqat yangi tugun qo'shiladi."),
      ch('Bu kodda nima yomon?', "Har renderda Inner yangi tur bo'ladi", ["Inner da props yo'q", "Inner hech qanday props olmayotgani", "Funksiya nomi katta harfda"], "Input fokusi va state yo'qoladi.", 'function App() {\n  function Inner() { return <input />; }\n  return <Inner />;\n}'),
      ch('`<Form key={Date.now()} />` oqibati?', "Har renderda forma qaytadan yaratiladi", ["Forma tezroq ishlaydi", "State doimiy saqlanadi", "Forma faqat birinchi marta chiziladi"], "key har safar yangi."),
      ch('React ikki daraxtni solishtirishda nimaga tayanadi?', "Element turi va key ga", ["CSS klass nomlariga", "Komponent matniga", "DOM balandligiga"], "Shu evristika solishtirishni tez qiladi."),
      fill("Eski va yangi daraxtni solishtirish jarayoni inglizcha nomi?", 'reconciliation', "Moslashtirish."),
    ],
  });

  /* 9 */
  lesson({
    title: 'Hodisalar',
    intro: "onClick va boshqa hodisalar, funksiyani uzatish va chaqirish farqi, SyntheticEvent, preventDefault, stopPropagation, capture.",
    theory: {
      analogy: { icon: '🔔', title: "Qo'ng'iroq", text: "Ishlovchi berish — qo'ng'iroqqa kim javob berishini aytib qo'yish. Uni darhol chaqirib qo'yish — qo'ng'iroq jiringlamasdan eshikni ochib yuborish." },
      sections: [
        { heading: "Funksiyani bering, chaqirmang", code: { lang: 'jsx', text: "<button onClick={save}>OK</button>          // to'g'ri\n<button onClick={() => remove(id)}>x</button> // to'g'ri\n<button onClick={remove(id)}>x</button>       // render paytida ishlaydi!" } },
        { heading: 'Hodisa obyekti', text: "Ishlovchiga SyntheticEvent (sun'iy hodisa — brauzer hodisasi ustidagi yagona qobiq) keladi. `e.target` — hodisa boshlangan element, `e.currentTarget` — ishlovchi biriktirilgan element. `e.preventDefault()` brauzerning standart harakatini, `e.stopPropagation()` ko'pirishni to'xtatadi." },
        { heading: "Ko'pirish va capture", bullets: ["Hodisa ichkaridan tashqariga ko'piradi (bubbling).", "`onClickCapture` — tashqaridan ichkariga bosqichida ishlaydi.", "React 17 dan boshlab hodisalar ildiz (root) konteynerida delegatsiya qilinadi.", "`return false` hech narsani to'xtatmaydi."] },
        { table: { head: ['Hodisa', 'Qachon'], rows: [['onChange', "input qiymati o'zgarganda (har belgi)"], ['onSubmit', 'forma yuborilganda'], ['onKeyDown', 'tugma bosilganda'], ['onBlur / onFocus', 'fokus ketdi / keldi']] } },
        { callout: { kind: 'info', text: "Ishlovchi ichida xato chiqsa, error boundary uni ushlamaydi — try/catch yozing." } },
      ],
      recap: ["onClick ga funksiya beriladi.", "preventDefault ≠ stopPropagation.", "target va currentTarget farq qiladi.", "Hodisa nomlari camelCase."],
    },
    defs: [
      ['Event handler (hodisa ishlovchisi)', "hodisa yuz berganda chaqiriladigan funksiya."],
      ['SyntheticEvent', "React bergan, brauzerlararo bir xil hodisa obyekti."],
      ['Bubbling (ko\'pirish)', "hodisaning ichki elementdan tashqiga tarqalishi."],
      ['Event delegation (delegatsiya)', "ko'p element uchun bitta yuqori ishlovchi."],
    ],
    life: [['🫧', 'Pufakcha', "Suv tubidagi pufakcha har qatlamdan o'tib yuqoriga chiqadi — bubbling."], ['🛑', 'Qorovul', "stopPropagation — xabarni yuqori boshliqqa yetkazmaslik."]],
    practice: [{ title: 'Modal', text: "Fonga bosilganda yopiladigan, ichiga bosilganda yopilmaydigan modal yozing." }, { title: 'Klaviatura', text: "Enter bosilganda qo'shadigan, Escape da tozalaydigan input yozing." }],
    items: [
      ch('Komponent render bo\'lishi bilan nima bo\'ladi?', "remove(1) darhol chaqiriladi", ["Bosilguncha hech narsa", "Xato: funksiya kutilgan", "Faqat ikkinchi bosishda ishlaydi"], "Qavs — chaqiruv.", '<button onClick={remove(1)}>x</button>'),
      ch("Ichki tugma bosildi. Konsol?", "ichki, tashqi", ["tashqi, ichki", "faqat ichki", "faqat tashqi"], "Ko'pirish ichkaridan tashqariga.", '<div onClick={() => console.log("tashqi")}>\n  <button onClick={() => console.log("ichki")}>b</button>\n</div>'),
      ch('Tashqisi `onClickCapture` bo\'lsa-chi?', "tashqi, ichki", ["ichki, tashqi", "faqat tashqi", "faqat ichki"], "Capture avval ishlaydi."),
      ch('Havola sahifaga o\'tmasin. Qaysi biri?', 'e.preventDefault()', ['e.stopPropagation()', 'return false', 'e.cancel()'], "Standart harakatni bekor qiladi."),
      ch('`ul` ga bitta onClick. `li` bosilganda `e.currentTarget`?', 'ul', ['li', 'document', 'body'], "currentTarget — ishlovchi turgan element; target — li."),
      ch('React da `return false` ishlovchidan qaytsa?', "Hech qanday ta'siri yo'q", ["Ko'pirishni to'xtatadi", "Standart harakat bekor bo'ladi", "Render bekor qilinadi"], "preventDefault ni aniq chaqiring."),
      ch('`onChange` text input da qachon ishlaydi?', "Har bir o'zgarishda darhol", ["Faqat fokus ketganda", "Faqat Tab bosib chiqilganda", "Forma yuborilganda"], "Native change dan farqli."),
      ch('Ishlovchiga argument ham, e ham kerak. To\'g\'ri yozuv?', 'onClick={(e) => pick(id, e)}', ["onClick={pick.bind(id)()}", 'onClick={pick, id}', 'onClick="pick(id)"'], "Strelka funksiya bilan o'rang."),
      ch('Ishlovchi ichida `throw` bo\'lsa, Error Boundary?', "Uni ushlamaydi", ["Ushlab, fallback ko'rsatadi", "Ilovani qayta yuklaydi", "Hodisani qayta chaqiradi"], "Boundary faqat render va lifecycle xatolari uchun."),
      ch('Forma ichidagi `<button>` (type siz) bosilsa?', "Forma yuboriladi", ["Hech narsa bo'lmaydi", "Forma tozalanadi", "Faqat onClick ishlaydi"], "Standart type — submit."),
      fill("Standart brauzer harakatini bekor qiluvchi metod nomi?", 'preventDefault', "e.preventDefault().", ['preventDefault()', 'e.preventDefault()']),
    ],
  });

  /* 10 */
  lesson({
    title: 'Formalar',
    intro: "Controlled va uncontrolled input, onSubmit, FormData, bir nechta maydon, checkbox va select, validatsiya.",
    theory: {
      analogy: { icon: '🎛️', title: 'Pult va tetik', text: "Controlled input — pultdagi ruchka: qiymatni state belgilaydi. Uncontrolled — oddiy daftar: yozilgani o'zida qoladi, kerak paytda o'qiysiz." },
      sections: [
        { heading: 'Controlled', code: { lang: 'jsx', text: "const [name, setName] = useState('');\n<input value={name} onChange={(e) => setName(e.target.value)} />" } },
        { text: "`value` berib `onChange` bermasangiz, input faqat o'qiladigan bo'lib qoladi. Boshlang'ich qiymati `undefined` bo'lsa, input uncontrolled boshlanadi va keyin controlled ga o'tganda ogohlantirish chiqadi — shuning uchun `''` bilan boshlang." },
        { heading: 'Uncontrolled va FormData', code: { lang: 'jsx', text: "function onSubmit(e) {\n  e.preventDefault();\n  const data = new FormData(e.target);\n  save(data.get('email'));\n}\n<input name=\"email\" defaultValue=\"a@b.uz\" />" } },
        { heading: 'Turli maydonlar', table: { head: ['Element', 'Prop', "O'qish"], rows: [['text, textarea', 'value', 'e.target.value'], ['checkbox', 'checked', 'e.target.checked'], ['radio', 'checked', 'e.target.value'], ['select', 'value (select da)', 'e.target.value']] } },
        { callout: { kind: 'tip', text: "Xato matnini state da saqlash shart emas: ko'pincha uni qiymatlardan render paytida hisoblash mumkin." } },
      ],
      recap: ["Controlled: value + onChange.", "Checkbox: checked.", "Uncontrolled: defaultValue va FormData / ref.", "Submit da preventDefault."],
    },
    defs: [
      ['Controlled component (boshqariladigan)', "qiymati React state orqali belgilanadigan input."],
      ['Uncontrolled (boshqarilmaydigan)', "qiymati DOM ning o'zida saqlanadigan input."],
      ['FormData', "forma maydonlarini name bo'yicha o'qiydigan brauzer obyekti."],
      ['Validation (tekshiruv)', "kiritilgan ma'lumot qoidaga mosligini tekshirish."],
    ],
    life: [['🧾', 'Anketa', "Kassir har harfni darhol kompyuterga teradi (controlled) yoki to'ldirilgan varaqni oxirida oladi (uncontrolled)."], ['🚫', 'Turniket', "Validatsiya — talabga mos kelmasa o'tkazmaydi."]],
    practice: [{ title: "Ro'yxatdan o'tish", text: "Email, parol, rozilik checkbox li forma; hammasi to'g'ri bo'lmaguncha tugma disabled." }, { title: 'FormData varianti', text: "O'sha formani state siz, FormData bilan qayta yozing." }],
    items: [
      ch('Foydalanuvchi yozsa nima bo\'ladi?', "Matn o'zgarmaydi", ["Matn oddiy yoziladi", "Input o'chib ketadi", "Cheksiz render boshlanadi"], "value qotirilgan, onChange yo'q.", '<input value="Ali" />'),
      ch('Nega ogohlantirish chiqadi?', "uncontrolled dan controlled ga o'tdi", ["name atributi yozilmagan", "setV satr qiymatni qabul qilmaydi", "onChange nomi noto'g'ri"], "undefined → string.", 'const [v, setV] = useState();\n<input value={v} onChange={(e) => setV(e.target.value)} />'),
      ch('Checkbox qiymati qayerdan o\'qiladi?', 'e.target.checked', ['e.target.value', 'e.checked', 'e.target.selected'], "value odatda 'on'."),
      ch('Boshlang\'ich qiymat berib, keyin boshqarmaslik uchun?', 'defaultValue', ['value', 'initialValue', 'placeholder'], "Uncontrolled input uchun."),
      ch('`new FormData(form).get("age")` — type="number" ga 5 yozilgan. Natija?', '"5" (string)', ['5 (number)', 'null', 'undefined'], "FormData qiymatlari satr."),
      ch('FormData maydonni nima bo\'yicha topadi?', 'name', ['id', 'className', 'htmlFor'], "name siz maydon yuborilmaydi."),
      ch('Submit ishlovchisida preventDefault unutilsa?', "Sahifa qayta yuklanadi", ["Forma ikki marta renderlanadi", "State saqlanib qoladi", "Hech narsa o'zgarmaydi"], "Brauzer formani o'zi yuboradi."),
      ch('Bir nechta maydon uchun umumiy ishlovchi?', 'setF({ ...f, [e.target.name]: e.target.value })', ['setF({ name: e.target.value })', 'setF(f.name = e.target.value)', "setF({ ...f, name: e.target.name, value: e })"], "Hisoblangan kalit."),
      ch('`<select>` da tanlanganni boshqarish?', "select ga value berish", ["option ga selected berish", "option ga checked berish", "select ga checked berish"], "React da selected o'rniga value."),
      ch('Number input controlled: `setAge(Number(e.target.value))`. Maydon tozalansa?', "State 0 bo'lib qoladi", ["State bo'sh satr bo'ladi", "State NaN bo'ladi", "State undefined bo'ladi"], "Number('') = 0 — foydalanuvchiga noqulay."),
      fill("Qiymati React state dan boshqariladigan input inglizcha qanday ataladi (bitta so'z)?", 'controlled', "Boshqariladigan."),
    ],
  });

  /* 11 */
  lesson({
    title: "State'ni loyihalash",
    intro: "Hisoblanadigan qiymat, dublikatdan qochish, state ni ko'tarish, bir-biriga zid bayroqlar, tekis tuzilma.",
    theory: {
      analogy: { icon: '📒', title: 'Bitta daftar', text: "Bir ma'lumot ikki daftarga yozilsa, ertami-kechmi ular farq qilib qoladi. Bitta manbaga yozing, qolganini undan hisoblang." },
      sections: [
        { heading: 'Besh tamoyil', bullets: ["Birga o'zgaradiganlarni birlashtiring (x va y → position).", "Zid holatlarni yo'q qiling: `isLoading` + `isError` o'rniga `status`.", "Hisoblab bo'ladiganni saqlamang (fullName, total).", "Dublikat saqlamang: obyekt o'rniga `selectedId`.", "Chuqur ichma-ich tuzilmani tekislang (normalizatsiya)."] },
        { code: { lang: 'jsx', text: "// yomon: sinxronlash kerak\nconst [items, setItems] = useState([]);\nconst [total, setTotal] = useState(0);\n\n// yaxshi\nconst total = items.reduce((s, i) => s + i.price, 0);" } },
        { heading: "State ni ko'tarish", text: "Ikki komponentga bir xil ma'lumot kerak bo'lsa, state ularning eng yaqin umumiy otasiga ko'chiriladi (lifting state up — holatni ko'tarish). Bolalar qiymat va o'zgartiruvchi funksiyani props orqali oladi. State imkon qadar kerakli joyga yaqin turishi kerak." },
        { callout: { kind: 'warn', text: "Prop ni state ga nusxalash (`useState(props.value)`) keyingi o'zgarishlarni ko'rmaydi. Yo to'g'ridan-to'g'ri prop ishlating, yo key bilan qayta boshlang." } },
      ],
      recap: ["Single source of truth — yagona manba.", "Derived qiymat renderda hisoblanadi.", "Umumiy state — eng yaqin umumiy otada.", "status satri bir nechta boolean dan xavfsiz."],
    },
    defs: [
      ['Derived state (hosila holat)', "mavjud state yoki props dan hisoblab olinadigan qiymat."],
      ['Lifting state up (holatni ko\'tarish)', "state ni umumiy ota komponentga ko'chirish."],
      ['Single source of truth (yagona haqiqat manbasi)', "har bir ma'lumot faqat bitta joyda saqlanishi."],
      ['Normalization (tekislash)', "ma'lumotni id bo'yicha tekis jadval ko'rinishida saqlash."],
    ],
    life: [['🌡️', 'Termometr', "Farengeytni alohida saqlamaysiz — selsiydan hisoblaysiz."], ['🏠', 'Oila kassasi', "Ikkalasiga kerak pul umumiy joyda turadi, har birining cho'ntagida nusxa emas."]],
    practice: [{ title: 'Ortiqcha state', text: "Beshta useState li formani tekshirib, qaysilari hisoblanishini toping." }, { title: "Ko'tarish", text: "Qidiruv inputi va natijalar ro'yxatini ikki aka-uka komponent qilib ulang." }],
    items: [
      ch('Qaysi state ortiqcha?', 'fullName', ['firstName', 'lastName', 'Uchalasi ham kerak'], "Ikkitasidan hisoblanadi."),
      ch("Tanlangan elementni qanday saqlash ma'qul?", "Faqat id sini", ["Obyektning to'liq nusxasini", "DOM elementini", "Indeks va nusxani birga"], "Nusxa eskirib qoladi."),
      ch('`isSending` va `isSent` bir vaqtda true bo\'lib qolishi mumkin. Yaxshi yechim?', "Bitta status satri", ["Uchinchi boolean qo'shish", "Ikkalasini ref ga olish", "useEffect bilan tuzatib turish"], "Zid holat imkonsiz bo'ladi."),
      ch('Ota `color` prop ini yangiladi. Ekrandagi rang?', "Eski rang qoladi", ["Yangi rangga o'tadi", "Rang yo'qoladi", "Xato chiqadi"], "useState faqat birinchi qiymatni oladi.", 'function Dot({ color }) {\n  const [c] = useState(color);\n  return <i>{c}</i>;\n}'),
      ch("Prop dan state ni `useEffect` bilan sinxronlashning kamchiligi?", "Ortiqcha render va eskirgan kadr", ["Effekt props ni ko'ra olmaydi", "Props o'zgarib ketadi", "State butunlay o'chadi"], "Renderda hisoblash yaxshiroq."),
      ch('Ikki panel: faqat bittasi ochiq bo\'lsin. State qayerda?', "Umumiy ota komponentda", ["Har panelning o'zida", "Global o'zgaruvchida", "Birinchi panelda"], "Ota activeIndex ni boshqaradi."),
      ch('State ni keragidan yuqoriga ko\'tarishning zarari?', "Ko'p komponent ortiqcha render bo'ladi", ["State pastki komponentlarga yetib bormaydi", "State saqlanmay qoladi", "key ishlamay qoladi"], "State ni yaqin joyda saqlang."),
      ch('Filtrlangan ro\'yxatni qanday olish kerak?', "Renderda items va query dan hisoblash", ["Alohida state ga nusxalash", "Har bosishda serverdan qayta olish", "DOM dan yashirib qo'yish"], "Derived qiymat."),
      ch('`x` va `y` doim birga yangilanadi. Tavsiya?', "Bitta obyektda saqlash", ["Ikkita ref ishlatish", "Bittasini effektda yangilash", "Ikkalasini global qilish"], "Biri unutilib qolmaydi."),
      ch("3 darajali ichma-ich izohlar daraxtini yangilash qiyin. Yechim?", "id bo'yicha tekis saqlash", ["Har darajaga alohida root", "JSON.stringify bilan saqlash", "Mutatsiyaga ruxsat berish"], "Normalizatsiya."),
      fill("State ni umumiy otaga ko'chirish inglizcha: lifting state ___?", 'up', "Lifting state up.", ['Up']),
    ],
  });

  /* 12 */
  lesson({
    title: 'Komponent kompozitsiyasi',
    intro: "children va slotlar, ixtisoslashtirish, prop drilling dan qochish, meros o'rniga kompozitsiya.",
    theory: {
      analogy: { icon: '🧰', title: 'Asboblar qutisi', text: "Har ish uchun yangi quti yasamaysiz: bitta qutining bo'limlariga kerakli asbobni solasiz." },
      sections: [
        { heading: 'children va slotlar', code: { lang: 'jsx', text: "function Dialog({ title, actions, children }) {\n  return (\n    <div role=\"dialog\">\n      <h2>{title}</h2>\n      {children}\n      <footer>{actions}</footer>\n    </div>\n  );\n}" } },
        { heading: 'Ixtisoslashtirish', text: "Maxsus variant umumiy komponentni props bilan sozlaydi: `ConfirmDialog` ichida `Dialog` ishlatiladi. React da meros (inheritance) o'rniga kompozitsiya tavsiya etiladi." },
        { heading: 'Prop drilling ga qarshi', text: "Prop drilling — ma'lumotni ishlatmaydigan oraliq qatlamlardan o'tkazish. Context dan oldin kompozitsiyani sinang: tayyor elementni uzatsangiz, oraliq komponent ma'lumotni bilishi shart emas." },
        { code: { lang: 'jsx', text: "// <Page user={user} />  → Layout → Header → Avatar\n<Layout header={<Avatar user={user} />}>...</Layout>" } },
        { callout: { kind: 'tip', text: "Yana bir foyda: state o'zgaradigan komponentga og'ir qismni children qilib bersangiz, u qayta render bo'lmaydi." } },
      ],
      recap: ["children — asosiy slot.", "Bir nechta joy — nomli prop lar.", "Meros emas, kompozitsiya.", "Tayyor element uzatish drilling ni kamaytiradi."],
    },
    defs: [
      ['Composition (kompozitsiya)', "kichik komponentlarni birlashtirib kattasini yig'ish."],
      ['Slot (bo\'sh joy)', "komponentning tashqaridan to'ldiriladigan qismi."],
      ['Prop drilling', "prop ni ko'p qatlam orqali quduq qazigandek tushirish."],
    ],
    life: [['🥪', 'Sendvich', "Non (layout) o'sha, ichiga solinadigan narsa (children) har xil."], ['🔌', 'Rozetka', "Slot — har qanday mos vilka tiqiladigan joy."]],
    practice: [{ title: 'Dialog', text: "Umumiy Dialog va undan ConfirmDialog yarating." }, { title: 'Drilling', text: "Uch qatlamli prop uzatishni element uzatishga o'zgartiring." }],
    items: [
      ch("Tugma bosilib Box state i o'zgardi. `Slow` render bo'ladimi?", "Yo'q: elementi otada yaratilgan", ["Ha, Box ichida turibdi", "Ha, chunki state Box ichida o'zgardi", "Faqat birinchi bosishda"], "children havolasi o'zgarmagan.", '<Box>\n  <Slow />\n</Box>\n// Box: useState + <div>{children}</div>'),
      ch('React da komponentni qayta ishlatishning tavsiya etilgan yo\'li?', "Kompozitsiya", ["Klass merosi", "Kodni nusxalash", "Global funksiyalar"], "composition over inheritance."),
      ch('`function Box({ children }) { return <div /> }` va `<Box><b>x</b></Box>`. Natija?', "Bo'sh div", ["div ichida b", "Faqat b", "Xato chiqadi"], "children o'zi chizilmaydi."),
      ch('Prop drilling nima?', "Prop ni oraliq qatlamlardan o'tkazish", ["Prop turini har qatlamda tekshirib borish", "Prop ni localStorage ga yozish", "Prop turini tekshirish"], "Oraliqdagilar uni ishlatmaydi."),
      ch('Context dan oldin nimani sinash kerak?', "Element yoki children uzatishni", ["Global o'zgaruvchini", "Barcha ma'lumotni window ga yozish", "Har joyda fetch qilishni"], "Ko'pincha yetarli."),
      ch('Bir nechta mustaqil joy (header, sidebar) kerak. Yechim?', "Nomli JSX prop lar berish", ["children ni split qilish", "innerHTML bilan qo'yish", "Ikki root yaratish"], "Slot lar."),
      ch('`cloneElement(child, { active: true })` nima qiladi?', "Yangi prop li nusxa element qaytaradi", ["Asl elementning prop ini o'zgartiradi", "DOM tugunini nusxalaydi", "Child state ini ko'chiradi"], "Element o'zgarmas obyekt."),
      ch('`<Dialog><Form /></Dialog>` — Form ni kim «yaratadi»?', "Dialog ni ishlatayotgan komponent", ["ReactDOM ning ildiz render funksiyasi", "Form ning o'zi", "ReactDOM ildizi"], "Shu sabab Form otaning ma'lumotini oladi."),
      ch('`<List renderItem={(x) => <li>{x}</li>} />` — bu qaysi pattern?', 'Render props', ['Higher-order component', 'Singleton', 'Portal'], "Chizish usuli funksiya bilan beriladi."),
      ch('Boolean prop lar ko\'payib ketdi (`isModal`, `isBig`, `hasIcon` ...). Yaxshiroq?', "children va slot larga bo'lish", ["Yana bitta bayroq qo'shish", "Barchasini bitta satrga yozish", "Har holatga nusxa komponent"], "Konfiguratsiya o'rniga kompozitsiya."),
      fill("Komponent teglari orasidagi mazmunni qabul qiladigan prop?", 'children', "Asosiy slot."),
    ],
  });

  /* 13 */
  lesson({
    title: 'useEffect',
    intro: "Effekt nima uchun, dependency massivi, tozalash (cleanup), ma'lumot yuklash va race condition, keraksiz effektlar.",
    theory: {
      analogy: { icon: '🔌', title: 'Ulash va uzish', text: "Effekt — asbobni tarmoqqa ulash, cleanup — vilkani sug'urish. Boshqa rozetkaga o'tishdan oldin eskisidan uzasiz." },
      sections: [
        { heading: 'Sinxronlash vositasi', text: "useEffect komponentni React dan tashqaridagi tizim (server, taymer, obuna, document.title) bilan moslashtiradi. Hodisaga javob effektga emas, ishlovchiga yoziladi." },
        { code: { lang: 'jsx', text: "useEffect(() => {\n  const id = setInterval(() => setSec((s) => s + 1), 1000);\n  return () => clearInterval(id);   // cleanup\n}, []);" } },
        { heading: 'Dependency massivi', table: { head: ['Yozuv', 'Qachon ishlaydi'], rows: [['massiv yo\'q', 'har renderdan keyin'], ['[]', 'mount da (dev StrictMode: ikki marta)'], ['[a, b]', "mount da va a yoki b o'zgarganda"]] } },
        { text: "Effekt ichida ishlatilgan barcha reaktiv qiymatlar massivda bo'lishi kerak. Obyekt va funksiya har renderda yangi havola oladi, shuning uchun ularni effekt ichiga ko'chiring. Cleanup keyingi effektdan oldin va unmount da ishlaydi." },
        { heading: 'Race condition', code: { lang: 'jsx', text: "useEffect(() => {\n  let ignore = false;\n  fetch(`/api/users/${id}`)\n    .then((r) => r.json())\n    .then((u) => { if (!ignore) setUser(u); });\n  return () => { ignore = true; };\n}, [id]);" } },
        { callout: { kind: 'tip', text: "Qiymatni props/state dan hisoblash uchun effekt kerak emas. AbortController so'rovning o'zini ham bekor qiladi." } },
      ],
      recap: ["Effekt — tashqi tizim bilan sinxronlash.", "Cleanup: keyingi ishga tushishdan oldin va unmount da.", "Bog'liqliklarni yashirmang.", "Eski javobni e'tiborsiz qoldiring."],
    },
    defs: [
      ['Effect (effekt)', "renderdan keyin tashqi tizim bilan ishlaydigan kod."],
      ['Cleanup (tozalash)', "effekt qaytaradigan, ulanishni bekor qiluvchi funksiya."],
      ['Dependency array (bog\'liqliklar massivi)', "effekt qachon qayta ishlashini belgilovchi qiymatlar ro'yxati."],
      ['Race condition (poyga holati)', "javoblar kelish tartibi noto'g'ri natijaga olib kelishi."],
      ['Stale closure (eskirgan yopilma)', "funksiya eski renderdagi qiymatni ushlab qolishi."],
    ],
    life: [['📻', 'Radio', "Boshqa to'lqinga o'tishdan oldin eskisidan uzilasiz."], ['📮', 'Kechikkan xat', "Manzil o'zgargach kelgan eski xatni o'qimaysiz — ignore bayrog'i."]],
    practice: [{ title: 'Taymer', text: "Start/stop li sekundomer yozing, cleanup ni tekshiring." }, { title: 'Qidiruv', text: "Query o'zgarganda yuklaydigan va eski javobni tashlaydigan komponent yozing." }],
    items: [
      ch('Ekranda 3 soniyadan keyin?', '1 da qotib qoladi', ["3 gacha to'g'ri sanab boradi", "0 da qoladi", "Xato beradi"], "Closure n=0 ni ushlagan: har safar 0+1.", 'useEffect(() => {\n  const id = setInterval(() => setN(n + 1), 1000);\n  return () => clearInterval(id);\n}, []);'),
      ch('Konsol tartibi: id 1 dan 2 ga o\'zgardi?', 'uzish 1, ulash 2', ['ulash 2, uzish 1', 'faqat ulash 2', 'uzish 2, ulash 2'], "Cleanup eski qiymat bilan, keyin yangi effekt.", 'useEffect(() => {\n  console.log("ulash " + id);\n  return () => console.log("uzish " + id);\n}, [id]);'),
      ch('Nima uchun cheksiz sikl?', "Har renderda yangi massiv set qilinadi", ["fetch effektda ishlamaydi", "load() har safar xato bilan qaytadi", "Cleanup yozilmagani uchun"], "Massivsiz effekt → set → render → effekt.", 'useEffect(() => {\n  load().then((data) => setList([...data]));\n});'),
      ch('Dependency `[options]`, `options = { id }` komponent tanasida. Effekt?', "Har renderdan keyin ishlaydi", ["Faqat mount da ishlaydi", "Faqat id o'zgarganda ishlaydi", "Umuman ishlamaydi"], "Har renderda yangi obyekt."),
      ch('`useEffect(async () => {...}, [])` nima uchun noto\'g\'ri?', "Effekt cleanup o'rniga Promise qaytaradi", ["async funksiya effektda umuman chaqirilmaydi", "await effektda xato beradi", "Massiv bo'sh bo'lolmaydi"], "Ichida alohida async funksiya yozing."),
      ch("Dev rejimda `[]` effekt ikki marta ishladi. Sabab?", "StrictMode cleanup ni sinaydi", ["Komponent ikki joyda ulangan", "React dagi xato", "fetch ikki javob beradi"], "mount → unmount → mount."),
      ch('Qaysi biriga effekt KERAK EMAS?', "Ro'yxatni query bo'yicha filtrlash", ["WebSocket ga ulanish", "WebSocket orqali xonaga ulanish", "window resize ga obuna"], "Render paytida hisoblanadi."),
      ch('Tugma bosilganda buyurtma yuborish qayerga yoziladi?', "onClick ishlovchisiga", ["useEffect ichiga", "Komponent tanasiga", "useState argumentiga"], "Sabab — aniq hodisa."),
      ch('Tez-tez id almashsa, eski javob keyin kelib qoladi. Himoya?', "Cleanup da ignore = true qilish", ["Dependency ga [] yozib qo'yish", "setTimeout qo'shish", "Javobni alert qilish"], "Yoki AbortController.abort()."),
      ch('`addEventListener` bor, cleanup yo\'q, dep `[x]`. Natija?', "Ishlovchilar to'planib boraveradi", ["Faqat oxirgisi qoladi", "Brauzer o'zi o'chiradi", "Eski ishlovchi yangisiga almashadi"], "Har ishga tushishda yangi tinglovchi."),
      order("id o'zgargandagi tartibni qo'ying.", ["Komponent yangi id bilan render bo'ladi", "DOM yangilanadi", "Eski effektning cleanup i ishlaydi", "Yangi effekt ishlaydi"], "Render → commit → cleanup → effect."),
      fill("Effekt qaytaradigan bekor qiluvchi funksiya inglizcha nomi?", 'cleanup', "Tozalash.", ['clean-up', 'cleanup function']),
    ],
  });

  /* 14 */
  lesson({
    title: 'useRef',
    intro: "DOM ga murojaat, renderga ta'sir qilmaydigan qiymat saqlash, forwardRef, ref va state farqi.",
    theory: {
      analogy: { icon: '🧷', title: "Cho'ntak daftarcha", text: "ref — cho'ntagingizdagi qayd: o'zgartirsangiz hech kim e'lon qilmaydi, lekin u yo'qolmaydi ham. state — e'lonlar doskasi: yozsangiz hamma qayta o'qiydi." },
      sections: [
        { heading: 'Ikki vazifa', code: { lang: 'jsx', text: "const inputRef = useRef(null);       // DOM tuguni\nconst timerRef = useRef(null);       // ichki qiymat\n\n<input ref={inputRef} />\ninputRef.current.focus();" } },
        { heading: 'ref va state', table: { head: ['', 'state', 'ref'], rows: [['O\'zgarsa render', 'ha', "yo'q"], ['Qiymat', 'snapshot', 'doim oxirgisi'], ['O\'zgartirish', 'set funksiyasi', '.current ga yozish'], ['Renderda o\'qish', 'ha', "tavsiya etilmaydi"]] } },
        { text: "DOM ref commit paytida to'ldiriladi: birinchi render vaqtida `current` hali `null`. Shuning uchun unga hodisa ishlovchisi yoki effektda murojaat qiling." },
        { heading: 'O\'z komponentingizga ref', code: { lang: 'jsx', text: "const Input = forwardRef(function Input(props, ref) {\n  return <input ref={ref} {...props} />;\n});" } },
        { callout: { kind: 'info', text: "React 18 da funksiya komponentiga ref oddiy prop bo'lib kelmaydi — forwardRef kerak. React 19 da ref oddiy prop bo'ldi. useImperativeHandle ota ko'radigan metodlarni cheklaydi." } },
      ],
      recap: ["ref.current o'zgarishi render chaqirmaydi.", "Ekranda ko'rinadigan narsa — state.", "Taymer id, oldingi qiymat — ref.", "DOM ref commit dan keyin tayyor."],
    },
    defs: [
      ['ref', "renderlar orasida saqlanadigan { current } qutisi."],
      ['forwardRef', "otadan kelgan ref ni ichki elementga o'tkazuvchi o'ram."],
      ['Imperative (buyruqli)', "focus, scroll, play kabi to'g'ridan-to'g'ri buyruq bilan ishlash."],
    ],
    life: [['🔑', 'Kalit', "ref — aniq bitta eshikning kaliti (DOM tuguni)."], ['⏲️', 'Taymer raqami', "Sekundomer id sini ko'rsatmaysiz, faqat to'xtatish uchun saqlaysiz."]],
    practice: [{ title: 'Autofocus', text: "Sahifa ochilganda inputga fokus bering." }, { title: 'Sekundomer', text: "interval id ni ref da saqlab start/stop yozing." }],
    items: [
      ch('3 marta bosildi. Ekrandagi matn?', '0', ['3', '1', 'undefined'], "ref o'zgarishi qayta render qilmaydi.", 'const n = useRef(0);\nreturn <button onClick={() => n.current++}>{n.current}</button>;'),
      ch('`let timer` komponent tanasida, start va stop tugmalari. Nega stop ishlamasligi mumkin?', "Qayta renderda timer yana undefined", ["clearInterval komponentda yo'q", "let ni funksiyada yozib bo'lmaydi", "setInterval id qaytarmaydi"], "useRef kerak."),
      ch('Birinchi render paytida `inputRef.current`?', 'null', ['input elementi', 'undefined', '{}'], "DOM hali yaratilmagan."),
      ch('Qaysi qiymat ref uchun mos?', "setInterval id si", ["Ekranda ko'rinadigan hisob", "Forma xato xabari", "Tanlangan tab nomi"], "Ko'rinmaydigan ichki qiymat."),
      ch('React 18: `<MyInput ref={r} />`, MyInput oddiy funksiya. Natija?', "r ulanmaydi, ogohlantirish chiqadi", ["r ichki input ga ulanadi", "r komponent nusxasini saqlab oladi", "Ilova to'xtab qoladi"], "forwardRef kerak."),
      ch('Oldingi render qiymatini saqlash uchun qayerda yoziladi?', "useEffect ichida ref ga", ["Render paytida state ga", "useState argumentida", "JSX ichida o'zgaruvchiga"], "Effekt renderdan keyin: ref eski qiymatni beradi."),
      ch('Nega render paytida `ref.current = x` yozish tavsiya etilmaydi?', "Render toza bo'lishi kerak", ["Sintaksis xatosi beradi", "ref faqat o'qiladi", "DOM o'chib ketadi"], "Qayta chaqiruvda natija o'zgarib ketadi."),
      ch('`ref={(el) => ...}` yozuvi nima?', 'Callback ref', ['Render prop', 'Hodisa ishlovchisi', 'Effekt'], "Element ulanganda va uzilganda chaqiriladi."),
      ch('Ota faqat `focus` va `clear` ni chaqira olsin. Qaysi hook?', 'useImperativeHandle', ['useLayoutEffect', 'useSyncExternalStore', 'useId'], "ref qiymatini o'zingiz belgilaysiz."),
      ch('`useRef(0)` har renderda yangi obyekt beradimi?', "Yo'q, o'sha obyektni qaytaradi", ["Ha, har safar yangi quti", "Ha, lekin current ko'chirib o'tiladi", "Faqat StrictMode da yangi"], "Havola barqaror."),
      fill("ref ning qiymati qaysi maydonda turadi?", 'current', "ref.current.", ['.current', 'ref.current']),
    ],
  });
};
