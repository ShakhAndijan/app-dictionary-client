// React, lessons 1-7. English terms are followed by their Uzbek translation in parentheses.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 */
  lesson({
    title: 'React falsafasi',
    intro: "UI = f(state), deklarativ yondashuv, komponentlar, bir yo'nalishli ma'lumot oqimi va virtual DOM nima uchun kerak.",
    theory: {
      analogy: { icon: '🗺️', title: 'Navigator', text: "Imperativ yo'l — haydovchiga har burilishni aytish: «o'ngga, yana chapga». Deklarativ yo'l — navigatorga manzilni berish. React ga ham «ekran shunday ko'rinsin» deysiz, qanday o'zgartirishni u o'zi hisoblaydi." },
      sections: [
        { heading: 'Deklarativ va imperativ', text: "Imperativ kodda DOM ni qo'lda o'zgartirasiz: element topasiz, matn yozasiz, klass qo'shasiz. Deklarativ kodda hozirgi ma'lumotga mos ko'rinishni tasvirlaysiz, xolos. Ma'lumot o'zgarsa, React yangi ko'rinishni qayta hisoblab, DOM dagi faqat farqni yangilaydi." },
        { code: { lang: 'jsx', text: "// imperativ\ncount += 1;\ndocument.querySelector('#n').textContent = count;\n\n// deklarativ\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}" } },
        { heading: 'Komponent va ma\'lumot oqimi', text: "Component (komponent — mustaqil UI bo'lagi) — kirish ma'lumotini olib, ekran tavsifini qaytaradigan funksiya. Ma'lumot faqat yuqoridan pastga, props orqali oqadi (one-way data flow — bir yo'nalishli oqim). Bola ota ma'lumotini o'zgartirmoqchi bo'lsa, ota bergan funksiyani chaqiradi." },
        { heading: 'Virtual DOM', text: "React komponentlar qaytargan elementlardan xotirada daraxt tuzadi va uni oldingisi bilan solishtiradi (reconciliation — moslashtirish). Virtual DOM sehrli tezlik emas: u deklarativ yozishni arzon qiladigan usul." },
        { callout: { kind: 'warn', text: "React boshqarayotgan DOM ni qo'lda (innerHTML, appendChild) o'zgartirmang: keyingi renderda o'zgarishingiz yo'qolishi yoki xato chiqishi mumkin." } },
      ],
      recap: ["UI — state funksiyasi: ma'lumot o'zgarsa, ko'rinish qayta hisoblanadi.", "Deklarativ: nima ko'rinishini yozasiz, qanday o'zgarishini emas.", "Ma'lumot yuqoridan pastga oqadi.", "Komponent nomi katta harf bilan boshlanadi."],
    },
    defs: [
      ['Declarative (deklarativ)', "natijani tasvirlash uslubi; bosqichma-bosqich buyruqlar emas."],
      ['Component (komponent)', "props va state asosida React elementi qaytaradigan funksiya."],
      ['One-way data flow (bir yo\'nalishli oqim)', "ma'lumot otadan bolaga o'tadi, teskarisi faqat callback orqali."],
      ['Virtual DOM', "ekran tavsifining xotiradagi daraxti; haqiqiy DOM farqlar asosida yangilanadi."],
    ],
    life: [['🧩', 'Lego', "Sayt — kichik bloklardan yig'ilgan model: har blok alohida va qayta ishlatiladi."], ['📺', 'Tablo', "Hisob o'zgarsa tablodagi raqam yangilanadi — siz chiroqlarni birma-bir yoqmaysiz."]],
    practice: [{ title: 'Loyiha ochish', text: "`npm create vite@latest my-app -- --template react` bilan loyiha oching, `App.jsx` dagi matnni o'zgartiring." }, { title: 'Komponentlarga bo\'lish', text: "Biror saytning bosh sahifasini qog'ozda komponentlarga ajrating va har biriga nom bering." }],
    items: [
      ch('`UI = f(state)` iborasi nimani anglatadi?', "Ko'rinish joriy ma'lumotdan hisoblanadi", ["Har bir funksiya ekranga chizadi", "State faqat UI ichida e'lon qilinadi", "DOM state ni avtomatik o'zgartiradi"], "Bir xil state — bir xil ko'rinish."),
      ch('Qaysi kod React uslubiga zid?', "document.getElementById('t').textContent = name", ['<h1>{name}</h1>', 'const full = first + " " + last;', 'items.map((x) => <li key={x.id}>{x.title}</li>)'], "React boshqargan DOM qo'lda o'zgartirilmaydi."),
      ch('Bola komponent otadagi sanagichni oshirishi kerak. To\'g\'ri yo\'l?', "Ota bergan funksiyani chaqirish", ["props.count++ deb yozish", "DOM dan sonni o'qib, oshirib qo'yish", "Global o'zgaruvchiga yozib qo'yish"], "Ma'lumot pastga, hodisa yuqoriga."),
      ch('Quyidagi komponent nima uchun ishlamaydi?', "Nomi kichik harfda: HTML teg deb olinadi", ["return ichida qavs yo'q", "Qavs va return yo'q: JSX chiqmaydi", "Funksiya arguments siz yozib qo'yilgan"], "<card /> — noma'lum HTML teg, <Card /> — komponent.", 'function card() {\n  return <div>Salom</div>;\n}\n// <card />'),
      ch('Virtual DOM haqida qaysi gap to\'g\'ri?', "Farqni hisoblab, DOM ga kerakligini yozadi", ["Har o'zgarishda butun DOM ni qayta quradi", "Har qanday qo'lda yozilgan koddan tez", "Faqat server tomonida ishlaydi"], "U qulaylik uchun to'lov, mo''jiza emas."),
      ch('Bitta state o\'zgardi. React DOM da nima qiladi?', "Faqat farq qilgan tugunlarni yangilaydi", ["Butun sahifani qayta yuklaydi", "body ichini to'liq qayta yozadi", "Hech narsa: DOM ni o'zingiz yangilaysiz"], "Render qayta hisoblaydi, commit esa farqni yozadi."),
      ch('Komponent qaytaradigan `<h1>Salom</h1>` aslida nima?', "Tavsiflovchi oddiy JavaScript obyekti", ["HTML matnidan iborat satr (string)", "HTML matni (string)", "Brauzer oynasiga buyruq"], "React element — arzon obyekt: type va props."),
      ch('Qaysi biri React ning vazifasi EMAS?', "Ma'lumotlar bazasini boshqarish", ["UI ni komponentlarga bo'lish", "State o'zgarsa qayta render qilish", "DOM ni samarali yangilash"], "React — UI kutubxonasi."),
      ch('Bir komponent ikki joyda `<Counter />` qilib ishlatildi. Ularning state i?', "Har biri o'z state iga ega", ["Ikkalasi bitta sonni ko'rsatadi", "Ikkinchisi birinchisidan nusxa oladi", "Faqat birinchisida state ishlaydi"], "State komponent nusxasiga bog'liq."),
      fill("React da ma'lumot otadan bolaga nima orqali uzatiladi?", 'props', "Properties qisqartmasi."),
      fill("«Nima ko'rinishi kerakligini yozish» uslubi inglizcha qanday ataladi (bitta so'z)?", 'declarative', "Imperativning teskarisi.", ['deklarativ']),
    ],
  });

  /* 2 */
  lesson({
    title: 'JSX',
    intro: "JSX qoidalari: bitta ildiz, fragment, {} ichida ifoda, className va htmlFor, style obyekti, JSX nimaga aylanadi.",
    theory: {
      analogy: { icon: '📝', title: 'Qoliplangan xat', text: "JSX — bo'sh joylari bor xat qolipi: o'zgarmas matn yonida {} qavslariga hozirgi ma'lumot qo'yiladi." },
      sections: [
        { heading: 'JSX nima', text: "JSX — JavaScript ichida teglarga o'xshash sintaksis. U HTML emas: build paytida oddiy funksiya chaqiruvlariga aylanadi va natijada React element (obyekt) hosil bo'ladi." },
        { code: { lang: 'jsx', text: "<h1 className=\"title\">Salom, {name}</h1>\n// taxminan shunga aylanadi:\nReact.createElement('h1', { className: 'title' }, 'Salom, ', name)" } },
        { heading: 'Qoidalar', table: { head: ['Qoida', 'Misol'], rows: [['Bitta ildiz element', '<>...</> (fragment)'], ['Hamma teg yopiladi', '<br />, <img />'], ['class → className', '<div className="box">'], ['for → htmlFor', '<label htmlFor="id">'], ['style — obyekt', 'style={{ fontSize: 14 }}'], ['Izoh', '{/* izoh */}']] } },
        { heading: '{} ichida nima bo\'ladi', text: "Qavs ichiga faqat expression (ifoda — qiymat qaytaradigan kod) yoziladi: o'zgaruvchi, funksiya chaqiruvi, ternary, map. `if`, `for` kabi statement (buyruq) yozilmaydi. false, null, undefined va true ekranga chiqmaydi, lekin 0 chiqadi. Oddiy obyektni to'g'ridan-to'g'ri chiqarib bo'lmaydi." },
        { callout: { kind: 'info', text: "{} ichidagi matn avtomatik ekranlanadi (escape), shuning uchun foydalanuvchi yozgan <script> teg sifatida ishga tushmaydi." } },
      ],
      recap: ["JSX → createElement → obyekt.", "Bitta ildiz kerak; keraksiz div o'rniga fragment.", "{} ichida ifoda, buyruq emas.", "0 ko'rinadi, false va null ko'rinmaydi."],
    },
    defs: [
      ['JSX', "JavaScript XML: elementlarni teg ko'rinishida yozish sintaksisi."],
      ['Fragment', "DOM ga ortiqcha tugun qo'shmasdan bir nechta elementni o'rash: <>...</>."],
      ['Expression (ifoda)', "qiymatga aylanadigan kod; JSX qavslarida faqat shu yoziladi."],
      ['Escape (ekranlash)', "maxsus belgilarni oddiy matnga aylantirish; XSS dan himoya."],
    ],
    life: [['🎟️', 'Chipta qolipi', "Ism va joy raqami bo'sh kataklarga yoziladi — qolip o'zgarmaydi."], ['📦', 'Quti', "Fragment — ko'rinmas quti: narsalarni birga ushlaydi, javonda joy egallamaydi."]],
    practice: [{ title: 'Profil kartasi', text: "Ism, rasm va qiziqishlar ro'yxatidan iborat JSX yozing; `className` va `style` ishlating." }, { title: 'createElement', text: "Bitta kichik JSX bo'lagini `React.createElement` bilan qayta yozing." }],
    items: [
      ch('Ekranda nima chiqadi?', '0', ["Hech narsa", "false", "Bo'sh ro'yxat"], "0 && ... natijasi 0, React sonni chizadi.", 'const items = [];\nreturn <div>{items.length && <List />}</div>;'),
      ch('Qaysi JSX xato beradi?', '<div><p>a</p></div><p>b</p>', ['<><p>a</p><p>b</p></>', '<div><br /><p>b</p></div>', '<p>{a ? "x" : "y"}</p>'], "return bitta ildiz qaytarishi kerak."),
      ch('Quyidagi kodning natijasi?', "Xato: obyektni bola sifatida chizib bo'lmaydi", ["Obyekt JSON ko'rinishida chiroyli chiqadi", "Faqat ism va yosh vergul bilan ajralib chiqadi", "Bo'sh p chiqadi"], "Obyekt maydonlarini alohida yozing.", 'const user = { name: "Ali", age: 20 };\nreturn <p>{user}</p>;'),
      ch('`style` ning to\'g\'ri yozilishi qaysi?', 'style={{ backgroundColor: "red" }}', ['style="background-color: red"', 'style={ background-color: red }', 'style={{ "background-color" = "red" }}'], "Tashqi {} — JS, ichki {} — obyekt."),
      ch('Natijada nechta matn ko\'rinadi?', "Faqat 'A'", ["'A', 'false' va 'null'", "'A' va 'true'", "Hech biri"], "boolean, null, undefined chizilmaydi.", 'return <p>A{false}{null}{undefined}{true}</p>;'),
      ch('{} ichida qaysi biri YOZILMAYDI?', 'if (ok) { "ha" }', ['ok ? "ha" : "yo\'q"', 'items.map((x) => x)', 'format(date)'], "if — statement, qiymat qaytarmaydi."),
      ch('Foydalanuvchi ismiga `<img src=x onerror=alert(1)>` yozdi. `<p>{name}</p>` nima qiladi?', "Matn sifatida ko'rsatadi", ["Rasm yaratib, alert chiqaradi", "Xato berib to'xtaydi", "Bo'sh p chiqaradi"], "React matnni ekranlaydi."),
      ch('JSX build dan keyin nimaga aylanadi?', "Funksiya chaqiruvlariga", ["HTML fayliga", "HTML hujjatining tayyor qismiga", "JSON matniga"], "Brauzer JSX ni to'g'ridan-to'g'ri tushunmaydi."),
      ch('`<label>` ni input ga bog\'lashning JSX yozuvi?', '<label htmlFor="email">', ['<label for="email">', '<label bind="email">', '<label htmlId="email">'], "for — JavaScript kalit so'zi, shuning uchun htmlFor."),
      fill('Ortiqcha DOM tugunisiz o\'rovchi element nomi (inglizcha, bitta so\'z)?', 'Fragment', "<>...</> yozuvi ham shu.", ['fragment', 'React.Fragment']),
      fill('JSX da HTML `class` atributi qanday yoziladi?', 'className', "class — JS da band so'z."),
    ],
  });

  /* 3 */
  lesson({
    title: 'Komponent va props',
    intro: "Props uzatish, destructuring, standart qiymatlar, children, props o'zgartirilmasligi va toza komponent.",
    theory: {
      analogy: { icon: '🍱', title: 'Buyurtma', text: "Props — oshpazga berilgan buyurtma varaqasi. Oshpaz uni o'qiydi, lekin varaqani o'zgartirmaydi: boshqa taom kerak bo'lsa, yangi buyurtma keladi." },
      sections: [
        { heading: 'Props', code: { lang: 'jsx', text: "function Badge({ label, color = 'gray', children }) {\n  return <span className={color}>{label}: {children}</span>;\n}\n\n<Badge label=\"Holat\" color=\"green\">faol</Badge>" } },
        { text: "Props — komponentga beriladigan yagona obyekt. Teg orasidagi mazmun `props.children` ga tushadi. Standart qiymat faqat prop `undefined` bo'lsa ishlaydi: `null` berilsa, null qoladi." },
        { heading: 'Props o\'zgartirilmaydi', text: "Komponent o'ziga kelgan props ni mutatsiya qilmasligi kerak. Pure component (toza komponent) bir xil kirishga bir xil natija beradi va render paytida tashqi dunyoni o'zgartirmaydi. StrictMode ishlab chiqish paytida komponentni ikki marta chaqirib, shu qoidani tekshiradi." },
        { heading: 'Spread va kompozitsiya', bullets: ["`<Button {...props} />` — barcha props ni uzatish.", "`key` va `ref` oddiy prop sifatida komponentga kelmaydi (React 18).", "Qiymatsiz atribut `true` degani: `<input disabled />`.", "Komponent ichida komponent E'LON QILINMAYDI: har renderda yangi tur bo'lib, state yo'qoladi."] },
        { callout: { kind: 'warn', text: "`<Card><Title /></Card>` da Title Card ichida emas, ota komponentda yaratiladi; Card uni faqat qayerga qo'yishni hal qiladi." } },
      ],
      recap: ["Props — faqat o'qiladi.", "children — teglar orasidagi mazmun.", "Standart qiymat undefined uchun ishlaydi.", "Komponentni komponent ichida e'lon qilmang."],
    },
    defs: [
      ['Props', "ota komponent bolaga beradigan o'zgarmas ma'lumotlar obyekti."],
      ['children', "komponent teglari orasida yozilgan mazmunni ushlovchi prop."],
      ['Pure function (toza funksiya)', "bir xil kirishga bir xil natija, yon ta'sirsiz."],
      ['StrictMode', "ishlab chiqishda xatolarni ochish uchun ayrim funksiyalarni ikki marta chaqiradigan rejim."],
    ],
    life: [['🖼️', 'Ramka', "Ramka (komponent) ichidagi rasmni (children) tanlamaydi, faqat joy beradi."], ['🏷️', 'Yorliq', "Bir xil yorliq qolipi turli nom va narx bilan chiqariladi."]],
    practice: [{ title: 'Card komponenti', text: "`title` va `children` oladigan Card yozing va uch xil mazmun bilan ishlating." }, { title: 'Toza emas komponent', text: "Render ichida tashqi massivga push qiling, StrictMode da nima bo'lishini kuzating." }],
    items: [
      ch('Ekranda nima chiqadi?', 'mehmon', ['undefined', "Bo'sh joy", 'null'], "Prop berilmadi → undefined → standart qiymat.", 'function Hi({ name = "mehmon" }) { return <p>{name}</p>; }\n<Hi />'),
      ch('Endi nima chiqadi?', "Hech narsa (bo'sh p)", ['mehmon', "'null' so'zi yozilgan holda chiqadi", 'Xato'], "null — qiymat, standart ishlamaydi.", '<Hi name={null} />   // function Hi({ name = "mehmon" })'),
      ch('Qaysi kod qoidani buzadi?', 'props.items.push("yangi")', ['const all = [...props.items, "yangi"]', 'const n = props.items.length', 'props.items.map((x) => x)'], "push ota massivini o'zgartiradi."),
      ch('`<Panel><b>A</b> va B</Panel>` da `children` nima?', "Element va matndan iborat massiv", ["Faqat <b> elementi", "HTML matni", "Bitta birlashtirilgan satr (string)"], "Bir nechta bola massiv bo'ladi."),
      ch('Nega komponentni boshqa komponent ichida e\'lon qilish yomon?', "Har renderda yangi tur bo'lib, state o'chadi", ["Ichki komponent props qabul qila olmay qoladi", "Props uzatib bo'lmay qoladi", "Faqat bir marta render bo'ladi"], "React turi o'zgargan daraxtni qayta quradi."),
      ch('`<input disabled />` da disabled qiymati?', 'true', ['"disabled"', 'undefined', '""'], "Qiymatsiz atribut — true."),
      ch('Child ichida `props.key` ni o\'qisak?', 'undefined', ['Berilgan key qiymati', "Elementning indeksi", "Xato otiladi"], "key React uchun, komponentga yetib bormaydi.", '<Child key="a" />'),
      ch('Natija qaysi?', 'type="button" va class="x" ikkalasi qo\'llanadi', ["Faqat class qo'llanadi", "Faqat type qo'llanadi", "Faqat oxirgi atribut qo'llanadi, boshqasi yo'q"], "Spread obyekt maydonlarini atributga yoyadi.", 'const p = { type: "button", className: "x" };\n<button {...p}>OK</button>'),
      ch('`<A n="5" />` va `<A n={5} />` farqi?', "Birinchisida string, ikkinchisida son", ["Farqi yo'q", "Birinchisi xato", "Ikkalasida ham son bo'lib yetib boradi"], "{} ichida JavaScript qiymati beriladi."),
      ch('StrictMode da console.log ikki marta chiqdi. Bu nima?', "Dev rejimda tozalikni tekshirish", ["Komponentda albatta xato bor", "Brauzerning nosozligi", "Production da ham doim shunday"], "Production da ikki marta chaqirilmaydi."),
      fill('Teglar orasidagi mazmun qaysi prop ga tushadi?', 'children', "props.children."),
    ],
  });

  /* 4 */
  lesson({
    title: "Shartli render va ro'yxatlar",
    intro: "if, ternary, && va uning 0 tuzog'i, map bilan ro'yxat, key qoidalari, filter va bo'sh holat.",
    theory: {
      analogy: { icon: '🚦', title: 'Svetofor va navbat', text: "Shartli render — svetofor: holatga qarab bitta chiroq yonadi. Ro'yxat — navbatdagi odamlar: har birining o'z raqami (key) bo'lsa, o'rin almashsa ham kim kimligi aniq." },
      sections: [
        { heading: 'Uch usul', code: { lang: 'jsx', text: "if (loading) return <Spinner />;               // erta qaytish\n{isAdmin ? <Admin /> : <User />}               // ikki variant\n{error && <p className=\"error\">{error}</p>}    // bor yoki yo'q" } },
        { text: "`a && b` ifodasi a yolg'on bo'lsa a ning o'zini qaytaradi. a = 0 bo'lsa ekranda 0 chiqadi, shuning uchun `count > 0 && ...` deb yozing. Komponent `null` qaytarsa, hech narsa chizmaydi, lekin hooklari ishlayveradi." },
        { heading: "Ro'yxat va key", code: { lang: 'jsx', text: "<ul>\n  {todos.filter((t) => !t.done).map((t) => (\n    <li key={t.id}>{t.title}</li>\n  ))}\n</ul>" } },
        { text: "key — ro'yxatdagi elementni renderlar orasida tanish uchun belgi. U qo'shni elementlar orasida yagona va barqaror bo'lishi kerak. `Math.random()` har renderda yangi key beradi, indeks esa tartib o'zgarsa noto'g'ri elementga yopishadi." },
        { callout: { kind: 'warn', text: "map ichida {} qavs ochsangiz `return` yozish shart: aks holda ro'yxat bo'sh chiqadi." } },
      ],
      recap: ["Erta return, ternary, && — uch asosiy usul.", "0 && ... ekranga 0 chiqaradi.", "key: yagona va barqaror.", "Bo'sh ro'yxat uchun alohida xabar ko'rsating."],
    },
    defs: [
      ['Conditional rendering (shartli render)', "holatga qarab turli JSX qaytarish."],
      ['key', "React ro'yxat elementini tanish uchun ishlatadigan barqaror belgi."],
      ['Empty state (bo\'sh holat)', "ma'lumot yo'qligida ko'rsatiladigan tushuntirish."],
    ],
    life: [['📋', 'Davomat', "O'quvchi raqam bilan emas, ID bilan yozilsa, partasi almashsa ham baho adashmaydi."], ['🚪', 'Qorovul', "Erta return — ruxsatsiz odam eshikdan qaytariladi, keyingi xonalarga bormaydi."]],
    practice: [{ title: 'Todo ro\'yxati', text: "Bajarilgan va bajarilmaganlarni alohida ro'yxatda ko'rsating, bo'sh bo'lsa xabar chiqaring." }, { title: 'Indeks key tuzog\'i', text: "Har qatorda input bo'lgan ro'yxatda indeksni key qiling va boshiga element qo'shib ko'ring." }],
    items: [
      ch('Ro\'yxat nega bo\'sh chiqadi?', "map callbacki hech narsa qaytarmayapti", ["key yozilmagan", "map JSX ichida {} bilan ishlatilmaydi", "x o'zgaruvchi nomi band"], "{ } ochilsa, return shart.", '{items.map((x) => {\n  <li key={x}>{x}</li>;\n})}'),
      ch('`count` = 0 bo\'lsa nima chiqadi?', '0', ["Hech narsa", "<Badge />", 'false'], "&& chap operandni qaytaradi.", '{count && <Badge n={count} />}'),
      ch('Qaysi key eng yaxshi?', 'user.id', ['index', 'Math.random()', '"item"'], "Barqaror va yagona."),
      ch('`key={Math.random()}` oqibati?', "Har renderda elementlar qayta yaratiladi", ["React tezroq ishlaydi", "Hech qanday farqi yo'q", "React eski elementlarni keshdan qayta oladi"], "Eski key topilmaydi: DOM va state yangidan."),
      ch('Ikki turli ro\'yxatda bir xil key bo\'lishi mumkinmi?', "Ha, yagonalik qo'shnilar orasida kerak", ["Yo'q, butun ilovada yagona bo'lsin", "Faqat ro'yxatlar yonma-yon bo'lmasa", "Yo'q, React xato otadi"], "key faqat bitta ota ichida solishtiriladi."),
      ch('Komponent `return null` qildi. Uning `useEffect` i?', "Baribir ishlaydi", ["Hech qachon ishlamaydi", "Faqat unmount da ishlaydi", "Xato chiqaradi"], "Komponent mavjud, faqat chizadigani yo'q."),
      ch('Hooklar bilan qaysi yozuv xato?', "Erta return dan KEYIN useState chaqirish", ["map ichida komponent elementini yaratish", "JSX ichida ternary ishlatish", "map dan oldin filter qilish"], "Hooklar har renderda bir xil tartibda chaqirilishi kerak."),
      ch('Natija nechta li?', '2', ['3', '1', '0'], "filter ikkitasini qoldiradi.", 'const n = [1, 2, 3];\nn.filter((x) => x > 1).map((x) => <li key={x}>{x}</li>)'),
      ch('Fragment ga key kerak bo\'lsa qaysi yozuv?', '<Fragment key={id}>', ['<key={id}>', '<> key={id}', '<Fragment id={id}>'], "Qisqa <> yozuvi key qabul qilmaydi."),
      ch('`{user ?? <Login />}` — `user` = `""` bo\'lsa?', "Hech narsa ko'rinmaydi", ["Bo'sh satr o'rnida Login chiqadi", "Xato chiqadi", "'null' chiqadi"], "?? faqat null/undefined uchun; bo'sh string qoladi."),
      fill("Ro'yxat elementlarida React talab qiladigan maxsus atribut nomi?", 'key', "Barqaror identifikator."),
    ],
  });

  /* 5 */
  lesson({
    title: 'State asoslari',
    intro: "useState, nega oddiy o'zgaruvchi yetmaydi, state snapshot sifatida, hooklar qoidalari va lazy initial state.",
    theory: {
      analogy: { icon: '📸', title: 'Surat', text: "Har render — state ning surati. Suratdagi soat strelkasi surat ichida harakatlanmaydi: yangi vaqtni ko'rish uchun yangi surat (render) kerak." },
      sections: [
        { heading: 'useState', code: { lang: 'jsx', text: "const [count, setCount] = useState(0);\n// count   — shu renderdagi qiymat\n// setCount — yangi qiymat va qayta render so'rovi" } },
        { heading: 'Nega oddiy o\'zgaruvchi emas', text: "Komponent funksiyasi har renderda qaytadan ishlaydi: lokal o'zgaruvchi boshlang'ich holatiga qaytadi. Uni o'zgartirish React ga ham xabar bermaydi. State esa React tomonida saqlanadi va set funksiyasi qayta renderni rejalashtiradi." },
        { heading: 'Snapshot', code: { lang: 'jsx', text: "function onClick() {\n  setCount(count + 1);\n  console.log(count); // hali eski qiymat\n}" } },
        { heading: 'Hooklar qoidasi', bullets: ["Faqat komponent yoki custom hook ning eng yuqori darajasida chaqiriladi.", "if, for, oddiy funksiya ichida chaqirilmaydi.", "React hooklarni chaqirilish tartibi bo'yicha taniydi.", "`useState(() => qimmatHisob())` — boshlang'ich qiymat faqat birinchi renderda hisoblanadi."] },
        { callout: { kind: 'info', text: "Object.is bo'yicha bir xil qiymat set qilinsa, React qayta renderni o'tkazib yuboradi." } },
      ],
      recap: ["State renderlar orasida saqlanadi.", "set darhol o'zgaruvchini o'zgartirmaydi.", "Hooklar tartibi doimiy bo'lishi kerak.", "Qimmat boshlang'ich qiymat — funksiya bilan."],
    },
    defs: [
      ['State (holat)', "komponent xotirasi: o'zgarsa, qayta render bo'ladigan ma'lumot."],
      ['Snapshot (surat)', "har render o'z props va state qiymatlarini ko'radi."],
      ['Hook (ilmoq)', "use bilan boshlanadigan, React imkoniyatlariga ulanuvchi funksiya."],
      ['Lazy initial state (dangasa boshlang\'ich qiymat)', "useState ga funksiya berib, hisobni faqat birinchi renderda bajarish."],
    ],
    life: [['🧮', 'Hisoblagich', "Tugma bosilganda ichki son o'zgaradi va ekran yangilanadi."], ['📓', 'Daftar', "Lokal o'zgaruvchi — doskadagi yozuv (har darsda o'chadi), state — daftardagi yozuv."]],
    practice: [{ title: 'Like tugmasi', text: "Bosilganda yonib-o'chadigan va sonni o'zgartiradigan tugma yozing." }, { title: 'Snapshot tajribasi', text: "set dan keyin console.log qiling va natijani tushuntiring." }],
    items: [
      ch('Bosilganda konsolda nima chiqadi?', '0', ['1', 'undefined', '2'], "count shu renderning surati.", 'const [count, setCount] = useState(0);\nfunction onClick() {\n  setCount(count + 1);\n  console.log(count);\n}'),
      ch('Bir bosishdan keyin ekranda?', '1', ['3', '0', '2'], "Uchala chaqiruv ham count=0 dan hisoblaydi.", 'setCount(count + 1);\nsetCount(count + 1);\nsetCount(count + 1);'),
      ch('Nega ekran o\'zgarmaydi?', "Lokal o'zgaruvchi renderni chaqirmaydi", ["onClick noto'g'ri yozilgan", "n ni JSX ichida o'qib bo'lmaydi aslida", "let o'rniga var kerak"], "State kerak.", 'let n = 0;\nreturn <button onClick={() => n++}>{n}</button>;'),
      ch('Qaysi chaqiruv hook qoidasini buzadi?', "if (open) { const [x] = useState(0); }", ["const [a] = useState(0); const [b] = useState(1);", "const [a] = useState(() => load());", "const x = useCustom(); // eng yuqorida"], "Shart ichida chaqirilsa tartib buziladi."),
      ch('`useState(readStorage())` va `useState(readStorage)` farqi?', "Birinchisi har renderda o'qiydi", ["Farqi yo'q", "Ikkinchisi har renderda o'qiydi", "Ikkinchisi xato beradi"], "Funksiya berilsa, faqat birinchi renderda chaqiriladi."),
      ch('`setName(name)` — aynan hozirgi qiymat berildi. Natija?', "Render amalda o'tkazib yuboriladi", ["Komponent ikki marta chizib olinadi", "State o'chib ketadi", "Xato otiladi"], "Object.is teng bo'lsa, bailout."),
      ch('`useState` nima qaytaradi?', "[qiymat, o'rnatuvchi] massivi", ["[eski, yangi] qiymatlar jufti", "Faqat qiymat", "Promise"], "Shuning uchun nomni o'zingiz tanlaysiz."),
      ch('setTimeout 3 s dan keyin `alert(count)` qiladi, bu orada tugma yana bosildi. Alert?', "Bosish paytidagi eski qiymat", ["Alert chiqqan paytdagi qiymat", "Har doim 0", "undefined"], "Closure o'sha renderning count ini ushlagan."),
      ch('Ikki `<Counter />` dan birini bosdik. Ikkinchisi?', "O'zgarmaydi", ["Birga oshadi", "Nolga qaytadi", "O'chib qayta chiziladi"], "State har nusxada alohida."),
      ch('Komponent qayta render bo\'lganda `useState(0)` dagi 0?', "E'tiborsiz qoldiriladi", ["State ni har safar nollaydi", "State ga qo'shiladi", "Faqat juft renderlarda ishlaydi"], "Boshlang'ich qiymat faqat mount da."),
      fill('Komponent xotirasini yaratadigan hook nomi?', 'useState', "Eng ko'p ishlatiladigan hook."),
    ],
  });

  /* 6 */
  lesson({
    title: "State'ni yangilash",
    intro: "Updater funksiya, batching, obyekt va massivni immutable yangilash, ichma-ich tuzilmalar.",
    theory: {
      analogy: { icon: '🧾', title: 'Navbatdagi buyurtmalar', text: "set chaqiruvlari — navbatga qo'yilgan buyurtmalar. «5 qil» desangiz oldingi buyurtma ustidan yoziladi; «yana bitta qo'sh» desangiz, oldingi natijaga qo'shiladi." },
      sections: [
        { heading: 'Updater funksiya', code: { lang: 'jsx', text: "setCount((c) => c + 1);\nsetCount((c) => c + 1); // natija: +2" } },
        { text: "Batching (to'plab bajarish): bitta hodisa ichidagi barcha set chaqiruvlari bitta renderga birlashtiriladi. React 18 da bu setTimeout va promise ichida ham ishlaydi." },
        { heading: 'Immutable yangilash', table: { head: ['Amal', "To'g'ri", 'Xato'], rows: [["Qo'shish", '[...list, x]', 'list.push(x)'], ["O'chirish", 'list.filter(...)', 'list.splice(i, 1)'], ["O'zgartirish", 'list.map(...)', 'list[i] = x'], ['Saralash', '[...list].sort()', 'list.sort()'], ['Obyekt', '{ ...user, age: 21 }', 'user.age = 21']] } },
        { code: { lang: 'jsx', text: "setUser((u) => ({\n  ...u,\n  address: { ...u.address, city: 'Buxoro' },\n}));" } },
        { callout: { kind: 'warn', text: "Spread sayoz (shallow) nusxa oladi: ichki obyektlar o'sha-o'sha qoladi, ularni ham alohida nusxalang." } },
      ],
      recap: ["Oldingi qiymatga bog'liq bo'lsa — updater.", "React 18 hamma joyda batching qiladi.", "State ni mutatsiya qilmang, yangi qiymat yarating.", "Ichma-ich o'zgarishda har darajani nusxalang."],
    },
    defs: [
      ['Updater function (yangilovchi funksiya)', "oldingi state ni olib yangisini qaytaradigan, set ga beriladigan funksiya."],
      ['Batching (to\'plash)', "bir nechta yangilanishni bitta renderga birlashtirish."],
      ['Immutability (o\'zgarmaslik)', "mavjud qiymatni o'zgartirmay, yangisini yaratish."],
      ['Shallow copy (sayoz nusxa)', "faqat birinchi darajasi yangi bo'lgan nusxa."],
    ],
    life: [['🧱', 'Qayta qurish', "Eski uyni bo'yamaysiz — o'zgargan xonasi bilan yangi chizma tuzasiz."], ['📨', 'Pochta', "Xatlar bir qutiga yig'ilib, bir yo'la yetkaziladi — batching."]],
    practice: [{ title: 'Savat', text: "Mahsulot qo'shish, sonini oshirish va o'chirishni mutatsiyasiz yozing." }, { title: 'Ichki obyekt', text: "Uch darajali obyektdagi bitta maydonni yangilang." }],
    items: [
      ch('Bosilgandan keyin count (boshida 0)?', '3', ['1', '0', '2'], "Har updater oldingi natijani oladi.", 'setCount((c) => c + 1);\nsetCount((c) => c + 1);\nsetCount((c) => c + 1);'),
      ch('Boshida 0. Natija?', '6', ['5', '1', '11'], "0+5=5 qo'yiladi, keyin updater 5+1.", 'setCount(count + 5);\nsetCount((c) => c + 1);'),
      ch('Boshida 0. Endi natija?', '42', ['43', '1', '41'], "Oxirgi oddiy qiymat navbatdagini almashtiradi.", 'setCount((c) => c + 1);\nsetCount(42);'),
      ch('Nega ro\'yxat yangilanmaydi?', "Massiv havolasi o'zgarmagan", ["push massivga qo'shmaydi", "setItems faqat sonlar uchun", "key yozilmagan"], "Object.is(eski, yangi) true bo'ladi.", 'items.push("x");\nsetItems(items);'),
      ch('Uch set chaqirilgan hodisada necha marta render bo\'ladi?', '1', ['3', '0', '2'], "Batching."),
      ch('`await fetch()` dan keyin ketma-ket 2 ta set (React 18). Renderlar?', "1 ta", ["2 ta", "0 ta", "4 ta"], "18 da avtomatik batching hamma joyda."),
      ch('Nima buziladi?', "Ichki address obyekti mutatsiya qilinadi", ["Spread xato beradi", "city o'chib ketadi", "Spread address ni nusxadan tashlab ketadi"], "Spread sayoz.", 'const next = { ...user };\nnext.address.city = "X";\nsetUser(next);'),
      ch('Qaysi usul asl massivni o\'zgartirmaydi?', 'filter', ['splice', 'sort', 'reverse'], "filter yangi massiv qaytaradi."),
      ch('Bitta elementni belgilashning to\'g\'ri yo\'li?', 'todos.map((t) => t.id === id ? { ...t, done: true } : t)', ['todos.find((t) => t.id === id).done = true', 'todos.forEach((t) => { if (t.id === id) t.done = true; })', 'todos[id].done = true'], "map + spread: faqat o'zgargan obyekt yangi."),
      ch('Updater funksiya ichida nima qilinmasligi kerak?', "API ga so'rov yuborish", ["Oldingi qiymatdan hisoblash", "Yangi obyekt qaytarish", "Shart bilan eskini qaytarish"], "Updater toza bo'lsin: StrictMode uni ikki marta chaqiradi."),
      fill("Bir nechta yangilanishni bitta renderga birlashtirish inglizcha nomi?", 'batching', "To'plab bajarish.", ['automatic batching']),
    ],
  });

  /* 7 */
  lesson({
    title: 'Render va commit',
    intro: "Trigger → render → commit bosqichlari, qachon qayta render bo'ladi, render sofligi va StrictMode.",
    theory: {
      analogy: { icon: '🍽️', title: 'Restoran', text: "Trigger — buyurtma keldi. Render — oshxonada taom tayyorlandi. Commit — ofitsiant stolga qo'ydi. Tayyorlash dasturxonni o'zgartirmaydi." },
      sections: [
        { heading: 'Uch bosqich', table: { head: ['Bosqich', 'Nima bo\'ladi'], rows: [['Trigger', 'birinchi mount yoki state o\'zgarishi'], ['Render', 'komponent funksiyalari chaqiriladi, yangi daraxt hisoblanadi'], ['Commit', 'farq DOM ga yoziladi, ref va effektlar ishlaydi']] } },
        { heading: 'Kim qayta render bo\'ladi', text: "State o'zgargan komponent va uning BARCHA avlodlari qayta render bo'ladi — props o'zgarmagan bo'lsa ham. Bu odatda arzon. Render bo'lish DOM o'zgarishi degani emas: farq bo'lmasa, DOM ga tegilmaydi." },
        { heading: 'Render toza bo\'lsin', bullets: ["Render paytida so'rov yubormang, DOM ni o'zgartirmang, tashqi o'zgaruvchini oshirmang.", "Yon ta'sirlar hodisa ishlovchisiga yoki useEffect ga yoziladi.", "Render paytida shartsiz set chaqirish cheksiz sikl beradi."] },
        { code: { lang: 'jsx', text: "function Bad() {\n  const [n, setN] = useState(0);\n  setN(n + 1);            // Too many re-renders\n  return <p>{n}</p>;\n}" } },
        { callout: { kind: 'info', text: "useLayoutEffect DOM yozilgach, brauzer chizishidan oldin ishlaydi; useEffect esa odatda chizilgandan keyin." } },
      ],
      recap: ["Trigger → render → commit.", "Ota render bo'lsa, bolalar ham.", "Render — hisob, yon ta'sir emas.", "Render ichida shartsiz set — cheksiz sikl."],
    },
    defs: [
      ['Render', "React komponent funksiyasini chaqirib, yangi ko'rinish tavsifini olishi."],
      ['Commit', "hisoblangan farqni haqiqiy DOM ga qo'llash."],
      ['Side effect (yon ta\'sir)', "funksiyadan tashqaridagi dunyoni o'zgartiradigan amal."],
      ['Mount / unmount', "komponentning daraxtga birinchi qo'shilishi / olib tashlanishi."],
    ],
    life: [['🎭', 'Mashq va spektakl', "Mashqni necha marta qilsangiz ham tomoshabin faqat yakuniy sahnani ko'radi."], ['🏗️', 'Chizma', "Chizmani qayta chizish bino g'ishtini qimirlatmaydi, faqat farq quriladi."]],
    practice: [{ title: 'Renderlarni sanash', text: "Ota va bolaga console.log qo'yib, ota state i o'zgarganda tartibni kuzating." }, { title: 'DevTools Profiler', text: "React DevTools da «Highlight updates» ni yoqib, qaysi qismlar render bo'layotganini ko'ring." }],
    items: [
      ch('Ota state i o\'zgardi, bolaga props berilmagan. Bola?', "Baribir qayta render bo'ladi", ["Render bo'lmaydi", "Unmount bo'ladi", "Faqat props berilsa render bo'ladi"], "Standart holda butun pastki daraxt render bo'ladi."),
      ch('Bola state i o\'zgardi. Ota?', "Render bo'lmaydi", ["Render bo'ladi", "Qayta mount bo'ladi", "Faqat DOM i yangilanadi"], "Yangilanish pastga tarqaladi, yuqoriga emas."),
      ch('Render natijasi oldingisi bilan bir xil. DOM?', "O'zgartirilmaydi", ["To'liq qayta yoziladi", "O'chirilib qo'shiladi", "Faqat klasslari yangilanadi"], "Commit faqat farqni yozadi."),
      ch('Quyidagi kod natijasi?', "Too many re-renders xatosi", ["1 ko'rsatiladi", "0 ko'rsatiladi", "1 chiqib, keyin to'xtaydi"], "Har render yana set chaqiradi.", 'const [n, setN] = useState(0);\nsetN(n + 1);'),
      ch('To\'g\'ri joylashtirilgan yon ta\'sir qaysi?', "Tugma bosilganda ishlovchi ichida so'rov", ["Komponent tanasida to'g'ridan-to'g'ri so'rov", "map ichida document.title o'zgartirish", "useState argumentida log yuborish"], "Hodisa ishlovchisi — yon ta'sir uchun tabiiy joy."),
      ch('Konsol tartibi (mount, StrictMode siz)?', 'render, effect', ['effect, render', 'faqat render', 'effect, render, effect'], "Effekt commit dan keyin.", 'console.log("render");\nuseEffect(() => console.log("effect"), []);'),
      ch('Ota va bola mount bo\'lganda effektlar tartibi?', "Avval bola, keyin ota", ["Avval ota, keyin bola", "Tartib tasodifiy", "Faqat otaniki ishlaydi"], "Effektlar daraxtning pastidan yuqoriga."),
      ch('Ota va bolaning render tartibi?', "Avval ota, keyin bola", ["Avval bola, keyin ota", "Parallel", "Bola ikki marta, ota yo'q"], "Render yuqoridan pastga."),
      ch('Render paytida `let total = 0; items.forEach(i => total += i)` qilish?', "Mumkin: lokal o'zgaruvchi o'zgaryapti", ["Taqiqlangan: mutatsiya bor", "Taqiqlangan: forEach render buzadi", "Faqat state bilan mumkin"], "Tashqi dunyo o'zgarmasa, komponent toza."),
      order("Yangilanish bosqichlarini tartiblang.", ["Hodisada set chaqiriladi", "Komponentlar render bo'ladi", "Farq DOM ga yoziladi", "useEffect ishlaydi"], "Trigger → render → commit → effect."),
      fill("Farqni DOM ga yozish bosqichi nomi (inglizcha)?", 'commit', "Render dan keyingi bosqich.", ['Commit']),
    ],
  });
};
