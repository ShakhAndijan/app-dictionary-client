// React, lessons 22-28.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 22 */
  lesson({
    title: 'Performance: memo, useMemo, useCallback',
    intro: "O'lchab optimallashtirish, memo, useMemo va useCallback, state ni pastga tushirish, virtual ro'yxat va kodni bo'lish.",
    theory: {
      analogy: { icon: '🩺', title: 'Avval tashxis', text: "Shifokor tekshirmasdan dori yozmaydi: avval Profiler bilan qayer sekinligini toping, keyin davolang." },
      sections: [
        { heading: 'Uch asbob', table: { head: ['Asbob', 'Nimani eslab qoladi'], rows: [['memo(Comp)', "props o'zgarmasa renderni o'tkazadi"], ['useMemo(fn, deps)', 'hisob natijasini'], ['useCallback(fn, deps)', "funksiya havolasini"]] } },
        { code: { lang: 'jsx', text: "const Row = memo(function Row({ item, onSelect }) { ... });\n\nconst visible = useMemo(() => filter(items, query), [items, query]);\nconst onSelect = useCallback((id) => setSelected(id), []);" } },
        { text: "memo props ni sayoz (shallow) solishtiradi: har renderda yangi obyekt, massiv, funksiya yoki JSX berilsa, memo foydasiz. useCallback faqat havolani saqlaydi — u memo li bola yoki effekt bog'liqligi bo'lgandagina ahamiyatli." },
        { heading: 'Avval tuzilma', bullets: ["State ni undan foydalanadigan kichik komponentga tushiring.", "Og'ir qismni children sifatida uzating.", "Minglab qator — virtualizatsiya: faqat ko'rinayotganini chizing.", "Katta sahifalarni `lazy` bilan alohida bo'lakka ajrating.", "Production buildda o'lchang: dev rejim sekinroq."] },
        { callout: { kind: 'warn', text: "useMemo kafolat emas, optimallashtirish: kod usiz ham to'g'ri ishlashi kerak." } },
      ],
      recap: ["Avval o'lchang.", "memo + barqaror props birga ishlaydi.", "Tuzilmani o'zgartirish ko'pincha memo dan yaxshi.", "Uzun ro'yxat — virtualizatsiya."],
    },
    defs: [
      ['Memoization (eslab qolish)', "natijani saqlab, bir xil kirishda qayta hisoblamaslik."],
      ['Shallow comparison (sayoz solishtirish)', "faqat birinchi darajadagi qiymatlarni Object.is bilan solishtirish."],
      ['Virtualization (virtualizatsiya)', "uzun ro'yxatning faqat ko'rinadigan qismini DOM ga chizish."],
      ['Code splitting (kodni bo\'lish)', "bundle ni kerak paytda yuklanadigan bo'laklarga ajratish."],
      ['Profiler', "qaysi komponent qancha render bo'lganini o'lchaydigan vosita."],
    ],
    life: [['🧠', 'Eslab qolish', "2×2 ni har safar qayta hisoblamaysiz."], ['🪟', 'Deraza', "Poyezd oynasidan faqat ko'rinayotgan manzarani ko'rasiz — virtualizatsiya."]],
    practice: [{ title: 'Profiler', text: "Sekin ro'yxatni Profiler bilan o'lchang, memo qo'shib qayta o'lchang." }, { title: 'State ni tushirish', text: "Input state ini katta sahifadan kichik komponentga ko'chiring." }],
    items: [
      ch('`<Row style={{ color: "red" }} />`, Row memo li. Ota render bo\'lsa?', "Row baribir render bo'ladi", ["Row render bo'lmaydi", "Row qayta mount bo'ladi", "memo xato chiqaradi"], "style har safar yangi obyekt."),
      ch('`<Row onClick={() => pick(id)} />` memo li Row uchun?', "memo foydasiz bo'lib qoladi", ["memo funksiyani e'tiborsiz qoldiradi", "onClick barqaror bo'lib qoladi", "Row faqat bosilganda render"], "Yangi funksiya."),
      ch('useCallback yozilgan, lekin bola memo li emas. Foyda?', "Deyarli yo'q", ["Bola render bo'lmaydi", "Funksiya tezroq ishlaydi", "Xotira butunlay tejaladi"], "Bola baribir render bo'ladi."),
      ch('`<Memo><b>x</b></Memo>` — ota render bo\'lsa?', "Render bo'ladi: children yangi element", ["O'tkazib yuboradi: matn o'sha", "Faqat b elementi yangilanadi", "memo children ni chuqur solishtiradi"], "JSX har safar yangi obyekt."),
      ch('`useMemo(() => items.filter(f), [])`, items prop o\'zgardi. Natija?', "Eski natija qaytaveradi", ["Yangi natija hisoblanadi", "Xato otiladi", "undefined qaytadi"], "Bog'liqlik yozilmagan."),
      ch('useMemo va useCallback farqi?', "Biri natijani, biri funksiyani saqlaydi", ["Biri effektda, biri renderda ishlaydi", "Biri async, ikkinchisi sinxron ishlaydi", "Farqi yo'q, faqat nomlari boshqa"], "useCallback(fn) ≈ useMemo(() => fn)."),
      ch('Birinchi qadam qaysi bo\'lishi kerak?', "Profiler bilan o'lchash", ["Hamma joyga memo qo'yish", "Barcha state ni ref qilish", "Kutubxonani almashtirish"], "Taxmin emas, o'lchov."),
      ch('10 000 qatorli jadval sekin. Eng samarali yechim?', "Virtualizatsiya", ["Har katakka useCallback", "key ni indeks qilish", "StrictMode ni o'chirish"], "DOM tugunlari kamayadi."),
      ch('`memo(Row, areEqual)` da areEqual `true` qaytarsa?', "Render o'tkazib yuboriladi", ["Render majburan bajariladi", "Komponent unmount bo'ladi", "State boshlang'ichga qaytadi"], "true — props teng."),
      ch('React Compiler siz, qaysi holda useMemo oqilona?', "Hisob qimmat va tez-tez takrorlansa", ["Ikki sonni qo'shish natijasi uchun", "Har bir o'zgaruvchi uchun oldindan", "Faqat string birlashtirish uchun"], "Narxi bilan foydasini solishtiring."),
      fill("Katta bundle ni bo'laklab yuklash inglizcha: code ___?", 'splitting', "Code splitting."),
    ],
  });

  /* 23 */
  lesson({
    title: 'Error boundary va Suspense',
    intro: "Render xatolarini ushlash, boundary nimani ushlamaydi, lazy va Suspense, fallback va joylashtirish.",
    theory: {
      analogy: { icon: '🧯', title: "Yong'in eshigi", text: "Bir xonada yong'in chiqsa, eshik uni butun binoga tarqatmaydi: faqat o'sha qism yopiladi." },
      sections: [
        { heading: 'Error boundary', code: { lang: 'jsx', text: "class ErrorBoundary extends Component {\n  state = { error: null };\n  static getDerivedStateFromError(error) { return { error }; }\n  componentDidCatch(error, info) { log(error, info); }\n  render() {\n    return this.state.error ? this.props.fallback : this.props.children;\n  }\n}" } },
        { text: "Boundary hozircha faqat klass komponent bilan yoziladi (yoki react-error-boundary kutubxonasi). U render, lifecycle va konstruktor xatolarini ushlaydi. Ushlamaydi: hodisa ishlovchilari, setTimeout va promise ichidagi xatolar, o'zining render xatosi." },
        { heading: 'Suspense', code: { lang: 'jsx', text: "const Chart = lazy(() => import('./Chart'));\n\n<Suspense fallback={<Spinner />}>\n  <Chart />\n</Suspense>" } },
        { bullets: ["Suspense bola «hali tayyor emas» desa fallback ko'rsatadi.", "lazy komponent modul darajasida e'lon qilinadi.", "Oddiy useEffect dagi fetch Suspense ni ishga tushirmaydi.", "Boundary va Suspense ni mantiqiy bo'limlar atrofiga qo'ying."] },
        { callout: { kind: 'info', text: "Xatoli holatdan chiqish uchun boundary ga yangi key bering yoki uning state ini tozalang." } },
      ],
      recap: ["Boundary — render xatolari uchun.", "Hodisadagi xato — try/catch.", "Suspense — kutish uchun fallback.", "Yuklanmay qolsa, uni boundary ushlaydi."],
    },
    defs: [
      ['Error boundary (xato to\'sig\'i)', "pastki daraxtdagi render xatosini ushlab, zaxira UI ko'rsatadigan komponent."],
      ['Suspense (kutib turish)', "bola tayyor bo'lguncha fallback ko'rsatish mexanizmi."],
      ['Lazy loading (dangasa yuklash)', "kodni faqat kerak bo'lganda yuklash."],
      ['Fallback (zaxira)', "xato yoki kutish paytida ko'rsatiladigan UI."],
    ],
    life: [['🔌', 'Saqlagich', "Bitta xonadagi qisqa tutashuv butun uyni qorong'i qilmaydi."], ['⏳', 'Qum soat', "Tayyor bo'lguncha kutish belgisi — fallback."]],
    practice: [{ title: 'Boundary', text: "Qayta urinish tugmasi bor ErrorBoundary yozing." }, { title: 'Lazy sahifa', text: "Route larni lazy bilan yuklab, Network panelida bo'laklarni ko'ring." }],
    items: [
      ch('onClick ichida `throw`. Error boundary?', "Ushlamaydi", ["Ushlaydi", "Qayta urinadi", "Ilovani yopadi"], "Bu render xatosi emas."),
      ch('Boundary yo\'q, bir komponent renderda xato otdi (React 18). Natija?', "Butun daraxt olib tashlanadi", ["Faqat o'sha komponent yashirinadi", "Eski UI joyida qolaveradi", "Xato faqat konsolga yoziladi"], "Oq ekran."),
      ch('Fallback ko\'rsatish uchun qaysi metod state qaytaradi?', 'getDerivedStateFromError', ['componentWillUnmount', 'shouldComponentUpdate', 'getSnapshotBeforeUpdate'], "Static metod."),
      ch('componentDidCatch odatda nima uchun?', "Xatoni jurnalga yozish", ["Fallback JSX ni qaytarish", "Xatoni qaytadan otish", "State ni to'g'ridan o'qish"], "Logging."),
      ch('setTimeout ichidagi xatoni boundary ga yetkazish usuli?', "State ga saqlab, renderda throw qilish", ["setTimeout ni boundary ichida e'lon qilish", "Boundary ni ikki marta o'rash", "window.alert orqali xabar berish"], "Render paytida otilsa ushlanadi."),
      ch('`lazy` ni komponent ICHIDA e\'lon qilsak?', "Har renderda qayta yaratiladi", ["Yuklash tezroq bo'lib qoladi", "Suspense kerak bo'lmay qoladi", "Faqat bir marta yuklanadi"], "State yo'qoladi."),
      ch('lazy komponent bor, Suspense yo\'q (birinchi yuklash). Nima kerak?', "Yuqorida Suspense o'rami", ["Komponentda try/catch bloki", "useEffect ichida import", "key={Date.now()} berish"], "Fallback berilishi kerak."),
      ch('useEffect ichida fetch qiladigan komponent Suspense ichida. Fallback?', "Ko'rsatilmaydi", ["Javobgacha turadi", "Ikki marta chiqadi", "Xato bilan turadi"], "Effekt Suspense ni to'xtatmaydi."),
      ch('Bitta Suspense ichida ikki lazy komponent, biri hali yuklanmagan?', "Ikkalasi o'rnida bitta fallback", ["Tayyori darhol ko'rinib turadi", "Har biriga alohida fallback", "Xato otilib, bo'sh qoladi"], "Chegara butunligicha kutadi."),
      ch('lazy import muvaffaqiyatsiz bo\'ldi. Kim ushlaydi?', 'Error boundary', ['Suspense fallback', 'useEffect cleanup', 'React Router'], "Rejected promise render xatosiga aylanadi."),
      fill("Bola tayyor bo'lguncha ko'rsatiladigan Suspense prop i?", 'fallback', "fallback={...}."),
    ],
  });

  /* 24 */
  lesson({
    title: "Qo'shimcha API'lar",
    intro: "useId, useTransition, useDeferredValue, useLayoutEffect, createPortal, useSyncExternalStore, flushSync.",
    theory: {
      analogy: { icon: '🧰', title: 'Maxsus asboblar', text: "Har kuni bolg'a ishlatasiz, ammo ba'zan aniq bir vintga maxsus kalit kerak bo'ladi." },
      sections: [
        { heading: 'Qaysi biri qachon', table: { head: ['API', 'Vazifa'], rows: [['useId', "server va klientda mos, yagona id (label va input uchun)"], ['useTransition', "yangilanishni shoshilinch emas deb belgilash, isPending"], ['useDeferredValue', "qiymatning kechikishga ruxsat berilgan nusxasi"], ['useLayoutEffect', 'DOM o\'lchash — chizilishdan oldin'], ['createPortal', 'bolani boshqa DOM tuguniga chizish (modal, tooltip)'], ['useSyncExternalStore', 'tashqi store ga obuna'], ['flushSync', "yangilanishni darhol DOM ga yozish (kamdan-kam)"]] } },
        { code: { lang: 'jsx', text: "const [isPending, startTransition] = useTransition();\nsetText(value);                            // shoshilinch\nstartTransition(() => setQuery(value));    // to'xtatib turilishi mumkin" } },
        { text: "Transition — debounce emas: kechiktirilgan vaqt yo'q, React shunchaki muhimroq yangilanishni birinchi bajaradi va og'ir renderni to'xtatib turishi mumkin. Portal DOM da boshqa joyda bo'lsa ham, hodisalar React daraxti bo'ylab ko'piradi." },
        { callout: { kind: 'warn', text: "useId ro'yxat key i uchun emas. flushSync va useLayoutEffect ni zaruratsiz ishlatmang — chizishni to'sadi." } },
      ],
      recap: ["useId — accessibility uchun id.", "Transition — ustuvorlik, kechikish emas.", "Layout effekt — o'lchash.", "Portal — DOM boshqa, daraxt o'sha."],
    },
    defs: [
      ['Transition (o\'tish)', "shoshilinch bo'lmagan, to'xtatib turilishi mumkin yangilanish."],
      ['Portal', "komponentni ota DOM tugunidan tashqarida chizish usuli."],
      ['Concurrent rendering (parallel renderlash)', "React renderni to'xtatib, muhimrog'ini oldin bajara olishi."],
      ['Hydration (jonlantirish)', "serverdan kelgan HTML ga hodisa va state ulash."],
    ],
    life: [['🚑', 'Tez yordam', "Navbatdagi mashinalar kutadi, shoshilinch o'tadi — transition ustuvorligi."], ['🪟', 'Deraza', "Portal — xonadagi narsani devordagi teshikdan tashqariga chiqarib qo'yish."]],
    practice: [{ title: 'Qidiruv', text: "Og'ir ro'yxatli qidiruvda useDeferredValue ni sinab ko'ring." }, { title: 'Modal portal', text: "createPortal bilan body ga chiziladigan modal yozing." }],
    items: [
      ch('useId nima uchun kerak?', "label va inputni yagona id bilan bog'lash", ["Ro'yxat elementlariga key yaratish", "Server bazasida yozuv raqami olish", "Server bazasidagi yozuvga raqam ajratish"], "SSR bilan ham mos."),
      ch('Nega `Math.random()` bilan id yaratish SSR da yomon?', "Server va klientda id mos kelmaydi", ["Math serverda umuman mavjud emas", "id lar juda uzun chiqib ketadi", "React raqamli id ni rad etadi"], "Hydration mismatch."),
      ch('startTransition ichidagi yangilanish haqida?', "Muhimrog'i uni to'xtatib turishi mumkin", ["U requestIdleCallback tugagach ishlaydi", "U alohida oqimda (thread) ishlaydi", "U DOM ga hech qachon yozilmaydi"], "Ustuvorlik pasaytirilgan."),
      ch('Controlled input qiymatini startTransition ichida set qilish?', "Noto'g'ri: yozish kechikib qoladi", ["To'g'ri va tavsiya etiladigan usul", "Input shunda uncontrolled bo'ladi", "Faqat Enter bosilganda ishlaydi"], "Input yangilanishi shoshilinch."),
      ch('useDeferredValue nima qaytaradi?', "Orqada qolishi mumkin bo'lgan nusxa", ["Promise ichidagi yakuniy qiymat", "Debounce taymerining id raqami", "Qiymatni o'zgartiruvchi funksiya"], "Og'ir qism keyin yangilanadi."),
      ch('Portal ichidagi tugma bosildi. React ota komponentidagi onClick?', "Ishlaydi: React daraxti bo'yicha", ["Ishlamaydi: DOM da boshqa joyda", "Faqat capture bosqichida ishlaydi", "Faqat document da ushlanadi"], "Ko'pirish React daraxtida."),
      ch('Tooltip o\'rnini hisoblash uchun miltillashsiz variant?', 'useLayoutEffect', ['useEffect', 'useMemo', 'useTransition'], "Brauzer chizishidan oldin."),
      ch('`useTransition` qaytaradigan birinchi element?', 'isPending', ['startTransition', 'deferredValue', 'transitionId'], "[isPending, startTransition]."),
      ch('flushSync nima qiladi?', "Yangilanishni darhol DOM ga yozadi", ["Barcha effektlarni bekor qiladi", "State ni boshlang'ichga qaytaradi", "Renderni fon oqimiga o'tkazadi"], "Kamdan-kam kerak."),
      ch('`window.matchMedia` yoki `navigator.onLine` ga obuna uchun eng mos hook?', 'useSyncExternalStore', ['useDeferredValue', 'useImperativeHandle', 'useReducer'], "Tashqi manba."),
      fill("Bolani boshqa DOM tuguniga chizadigan funksiya?", 'createPortal', "react-dom dan.", ['createPortal()']),
    ],
  });

  /* 25 */
  lesson({
    title: 'React 19',
    intro: "Actions, useActionState, useFormStatus, useOptimistic, use, ref prop sifatida, form action.",
    theory: {
      analogy: { icon: '📮', title: 'Yetkazib berish xizmati', text: "Ilgari posilkaning har bosqichini (yo'lda, yetdi, qaytdi) o'zingiz yozib borardingiz; endi xizmat buni o'zi kuzatadi." },
      sections: [
        { heading: 'Actions', code: { lang: 'jsx', text: "const [error, submitAction, isPending] = useActionState(async (prev, formData) => {\n  const err = await save(formData.get('name'));\n  return err ?? null;\n}, null);\n\n<form action={submitAction}>\n  <input name=\"name\" />\n  <button disabled={isPending}>Saqlash</button>\n</form>" } },
        { heading: 'Yangiliklar', table: { head: ['API', 'Vazifa'], rows: [['useActionState', "action natijasi va isPending"], ['useFormStatus', "ota forma yuborilayotganini bilish (react-dom)"], ['useOptimistic', 'javobgacha vaqtincha qiymat'], ['use(promise | context)', "renderda qiymatni o'qish; shart ichida ham mumkin"], ['ref prop', "funksiya komponentiga ref oddiy prop"], ['<Context>', 'Context.Provider o\'rniga']] } },
        { text: "Action — async funksiya bilan bajariladigan transition: kutish holati va xato boshqaruvi React tomonidan yuritiladi. `use` ga renderda har safar yangi yaratilgan promise berilmaydi — u keshlangan bo'lishi kerak." },
        { callout: { kind: 'info', text: "Laboratoriyalar React 18 da ishlaydi: 19 dagi g'oyalarni (pending, natija holati, optimistik qiymat) o'z hooklaringiz bilan yozib ko'rasiz." } },
      ],
      recap: ["form action funksiya qabul qiladi.", "useOptimistic action tugagach haqiqiy qiymatga qaytadi.", "use shart ichida chaqirilishi mumkin.", "forwardRef endi shart emas."],
    },
    defs: [
      ['Action (amal)', "transition ichida bajariladigan, odatda asinxron funksiya."],
      ['useActionState', "action ning oxirgi natijasi va kutish holatini beradigan hook."],
      ['useOptimistic', "action davomida ko'rsatiladigan taxminiy state."],
      ['use', "promise yoki context qiymatini render paytida o'qiydigan API."],
    ],
    life: [['💬', 'Xabar', "Yuborilgan xabar darhol «yuborilmoqda» belgisi bilan ko'rinadi — optimistik."], ['🚦', 'Holat chirog\'i', "Forma o'zi band yoki bo'shligini ko'rsatadi."]],
    practice: [{ title: 'React 19 loyiha', text: "Yangi loyihada useActionState bilan forma yozing." }, { title: 'Solishtirish', text: "O'sha formani React 18 uslubida yozib, qator sonini solishtiring." }],
    items: [
      ch('`useActionState(fn, init)` dagi fn ning birinchi argumenti?', 'Oldingi state', ['FormData', 'Hodisa obyekti', 'isPending bayrog\'i'], "(prevState, formData)."),
      ch('useActionState qaytaradigan uchlik?', '[state, formAction, isPending]', ["[formData, submit, error, reset]", '[data, error, refetch]', '[value, setValue, reset]'], "Tartib shunday."),
      ch('`<form action={fn}>` da fn nima oladi?', 'FormData', ['SubmitEvent', 'form elementi', 'input massivi'], "name bo'yicha o'qiysiz."),
      ch('useFormStatus qayerda chaqirilishi kerak?', "Forma ICHIDAGI bola komponentda", ["Formani chizayotgan komponentda", "Faqat ildiz App komponentida", "useEffect ning cleanup qismida"], "Ota forma holatini o'qiydi."),
      ch('useOptimistic qiymati action tugagach?', "Asl state ga qaytadi", ["Abadiy saqlanib qoladi", "undefined bo'lib qoladi", "localStorage ga yoziladi"], "Haqiqiy state yangilangan bo'lishi kerak."),
      ch('`use` ning hooklardan farqi?', "Shart va sikl ichida chaqirsa bo'ladi", ["Komponentdan tashqarida ham ishlaydi", "Faqat useEffect ichida chaqiriladi", "Render qilmasdan qiymat beradi"], "Lekin faqat render paytida."),
      ch('`use(fetch(url))` ni to\'g\'ridan renderda yozish?', "Har renderda yangi promise chiqadi", ["Eng tavsiya etiladigan yozuv shu", "fetch avtomatik keshlab qolinadi", "Faqat bir marta so'rov ketadi"], "Promise keshlanishi kerak."),
      ch('React 19 da funksiya komponentiga ref?', "Oddiy prop sifatida keladi", ["Faqat forwardRef orqali keladi", "Umuman uzatib bo'lmaydi", "Faqat context orqali keladi"], "forwardRef endi shart emas."),
      ch('`use(ThemeContext)` va `useContext` farqi?', "use ni shartdan keyin ham chaqirsa bo'ladi", ["use faqat eng yaqin Provider ni o'qimaydi", "useContext React 19 dan olib tashlangan", "use context o'zgarishini kuzatib turmaydi"], "Erta return dan keyin ham."),
      ch('Action ichida kutilmagan xato otilsa?', "Eng yaqin error boundary ushlaydi", ["Forma xatoni o'zi e'tiborsiz qiladi", "Forma sahifani qayta yuklaydi", "isPending doim true qoladi"], "Kutilgan xatoni state qilib qaytaring."),
      fill("Javobni kutmay vaqtincha qiymat ko'rsatadigan hook?", 'useOptimistic', "React 19.", ['useOptimistic()']),
    ],
  });

  /* 26 */
  lesson({
    title: 'Server Components va React Compiler',
    intro: "Server va Client komponentlar, 'use client' va 'use server', SSR bilan farq, React Compiler va memoizatsiya.",
    theory: {
      analogy: { icon: '🍲', title: 'Oshxona va stol', text: "Server Component — oshxonada tayyorlanadigan qism: retsept va qozonlar zalga chiqmaydi. Client Component — stol ustida o'zingiz aralashtiradigan qism." },
      sections: [
        { heading: 'Ikki tur', table: { head: ['', 'Server Component', 'Client Component'], rows: [['Qayerda ishlaydi', 'serverda (yoki build paytida)', 'brauzerda (va SSR da)'], ['state, effekt, onClick', "yo'q", 'bor'], ['Bazaga to\'g\'ridan murojaat', 'mumkin', "yo'q"], ['JS bundle ga kiradi', "yo'q", 'ha']] } },
        { text: "'use client' fayl boshiga yoziladi va klient chegarasini belgilaydi: undan import qilingan modullar ham klient bundle iga tushadi. 'use server' esa klientdan chaqiriladigan server funksiyalarini (Server Functions) belgilaydi — ularni ochiq API kabi himoyalang." },
        { code: { lang: 'jsx', text: "// Server Component\nexport default async function Page() {\n  const posts = await db.posts.findMany();\n  return <List posts={posts} />;\n}\n\n// Like.jsx\n'use client';\nexport function Like() { const [n, setN] = useState(0); ... }" } },
        { heading: 'React Compiler', text: "Compiler build paytida komponent va qiymatlarni avtomatik memoizatsiya qiladi, ko'p holda useMemo/useCallback/memo ni qo'lda yozish shart bo'lmaydi. U React qoidalariga (sof render, mutatsiyasizlik, hooklar tartibi) rioya qilinishiga tayanadi." },
        { callout: { kind: 'info', text: "SSR — HTML ni serverda yaratish; keyin o'sha komponentlar klientda hydrate bo'ladi. RSC esa kodi klientga umuman bormaydigan komponentlar." } },
      ],
      recap: ["Server Component interaktiv emas.", "Chegara — 'use client'.", "Server → Client props serializatsiya bo'lishi kerak.", "Compiler qoidaga rioya qilingan kodni optimallashtiradi."],
    },
    defs: [
      ['Server Component (server komponenti)', "faqat serverda bajariladigan, klientga natijasi boradigan komponent."],
      ['Client Component (klient komponenti)', "brauzerda ham ishlaydigan, state va hodisalarga ega komponent."],
      ['Serialization (seriyalash)', "qiymatni tarmoqdan uzatiladigan shaklga aylantirish."],
      ['SSR', "Server-Side Rendering: sahifa HTML ini serverda tayyorlash."],
      ['React Compiler', "memoizatsiyani avtomatik qo'shadigan build vositasi."],
    ],
    life: [['📦', 'Tayyor mebel', "Zavodda yig'ilib keladi — uyda asbob kerak emas (server komponent)."], ['🤖', 'Yordamchi', "Compiler — takror ishlarni o'zi eslab qoladigan yordamchi."]],
    practice: [{ title: 'Next.js', text: "App Router da server komponentdan ma'lumot olib, ichida client tugma ishlating." }, { title: 'Chegara tahlili', text: "O'z sahifangiz sxemasida qaysi qismlar client bo'lishi shartligini belgilang." }],
    items: [
      ch('Server Component da qaysi biri ishlamaydi?', 'useState', ['async/await', 'Bazaga so\'rov', 'Fayl o\'qish'], "Interaktivlik klientda."),
      ch('Server komponentdan klient komponentga qaysi prop o\'tmaydi?', "Oddiy funksiya (callback)", ["Satrlar massivi", "Oddiy obyekt va son", "JSX elementi (children)"], "Funksiya serializatsiya bo'lmaydi."),
      ch("'use client' yozilgan fayl SSR paytida?", "Serverda ham HTML ga render bo'ladi", ["Faqat brauzerda render bo'ladi", "Umuman render qilinmay qoladi", "Brauzergacha hech render qilinmaydi"], "Nomi chalg'itmasin."),
      ch('Client Component ichiga Server Component ni qanday joylash mumkin?', "children yoki prop qilib uzatib", ["Uni to'g'ridan import qilib olib", "useEffect ichida import qilib", "Context ga komponent solib"], "Import qilinsa, klientga aylanadi."),
      ch("'use server' nimani belgilaydi?", "Klientdan chaqiriladigan server funksiyasi", ["Server Component faylining birinchi qatori", "Faqat serverda yashaydigan state turi", "SSR ni yoqadigan umumiy sozlama"], "Server komponent uchun direktiva yo'q."),
      ch('Server funksiyasiga kelgan argumentlar haqida?', "Ishonchsiz: tekshirish va ruxsat shart", ["React ularni o'zi tekshirib beradi", "Faqat o'z UI ingizdan keladi xolos", "Turi TypeScript bilan kafolatlanadi"], "Ochiq endpoint kabi."),
      ch('RSC ning asosiy yutug\'i?', "Klientga kamroq JavaScript boradi", ["Barcha komponent interaktiv bo'ladi", "Server umuman kerak bo'lmay qoladi", "CSS avtomatik yozilib chiqadi"], "Kutubxonalar serverda qoladi."),
      ch('React Compiler nimani avtomatlashtiradi?', 'Memoizatsiyani', ['Test yozishni', 'Marshrutlashni', 'Stil berishni'], "Qo'lda useMemo kamayadi."),
      ch('Compiler bilan ham muammo bo\'lib qoladigan kod?', "Render paytida mutatsiya qiladigan", ["Sof va kichik komponentlardan iborat", "Hooklarni yuqorida chaqiradigan", "Props ni faqat o'qiydigan"], "Qoidalar buzilsa optimallashtirolmaydi."),
      ch('Hydration nima?', "Server HTML iga hodisalarni ulash", ["HTML ni siqib yuborish jarayoni", "Bazani keshga yuklash jarayoni", "CSS ni komponentga bo'lish"], "Statik sahifa jonlanadi."),
      fill("Klient chegarasini belgilovchi direktiva: 'use ___'?", 'client', "'use client'.", ["use client", "'use client'"]),
    ],
  });

  /* 27 */
  lesson({
    title: 'React patterns',
    intro: "Compound components, render props, HOC, controlled va uncontrolled komponent API, provider pattern, headless hook.",
    theory: {
      analogy: { icon: '🧩', title: 'Sinalgan chizmalar', text: "Pattern — ko'p marta qurilgan uy chizmasi: har safar devorni qayta ixtiro qilmaysiz." },
      sections: [
        { heading: 'Compound components', code: { lang: 'jsx', text: "<Tabs defaultValue=\"a\">\n  <Tabs.List>\n    <Tabs.Tab value=\"a\">A</Tabs.Tab>\n    <Tabs.Tab value=\"b\">B</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel value=\"a\">...</Tabs.Panel>\n</Tabs>" } },
        { text: "Qismlar bir-biri bilan yashirin context orqali gaplashadi, foydalanuvchi esa tartib va ko'rinishni erkin tanlaydi." },
        { heading: 'Boshqa usullar', table: { head: ['Pattern', "G'oya"], rows: [['Render props', "chizishni funksiya sifatida berish"], ['HOC', 'komponent olib, kengaytirilgan komponent qaytarish'], ['Headless hook', 'mantiq hookda, ko\'rinish chaqiruvchida'], ['Controlled/uncontrolled', '`value` + `onChange` yoki `defaultValue`'], ['Provider', 'umumiy xizmatni context orqali berish']] } },
        { callout: { kind: 'tip', text: "Bugun HOC va render props o'rniga ko'pincha custom hook sodda. Pattern ni muammo bo'lganda qo'llang, bezak uchun emas." } },
      ],
      recap: ["Compound — qismlar + context.", "HOC: withX(Component).", "Headless — mantiq va ko'rinish ajratilgan.", "Moslashuvchan komponent ikki rejimni qo'llaydi."],
    },
    defs: [
      ['Pattern (andoza)', "takrorlanadigan muammoning sinalgan yechim sxemasi."],
      ['HOC', "Higher-Order Component: komponent qabul qilib komponent qaytaradigan funksiya."],
      ['Compound components (tarkibiy komponentlar)', "birgalikda ishlaydigan, umumiy holatli komponentlar to'plami."],
      ['Headless (ko\'rinishsiz)', "faqat mantiq beradigan, UI chizmaydigan kod."],
    ],
    life: [['🍔', 'Konstruktor', "Burger qismlarini o'zingiz tartiblaysiz, lekin ular bitta taom."], ['🎁', "O'ram", "HOC — sovg'ani o'sha-o'sha holida, ustiga bezak bilan berish."]],
    practice: [{ title: 'Tabs', text: "Compound Tabs komponentini context bilan yozing." }, { title: 'HOC dan hook ga', text: "withLoading HOC ni custom hook bilan qayta yozing." }],
    items: [
      ch('HOC nima?', "Komponent olib, komponent qaytaruvchi funksiya", ["Boshqa komponentni meros qilib oluvchi klass", "Faqat context qiymatini o'qiydigan hook", "children siz ishlaydigan maxsus komponent"], "withX(Component)."),
      ch('HOC ni render ICHIDA chaqirsak?', "Har renderda yangi komponent turi chiqadi", ["Bir marta yaratilib keshlab qo'yiladi", "Faqat props o'zgarganda qayta yaratiladi", "React xato berib, ishlashni to'xtatadi"], "State yo'qoladi."),
      ch('HOC o\'z props idan boshqasini nima qilishi kerak?', "O'ralgan komponentga uzatishi", ["Hammasini tashlab yuborishi", "State ga nusxalab qo'yishi", "Konsolga yozib chiqarishi"], "{...props}."),
      ch('Compound components qismlari odatda qanday aloqa qiladi?', 'Context orqali', ['Global o\'zgaruvchi', 'DOM atributlari', 'localStorage'], "Yashirin umumiy state."),
      ch('`value` berilsa boshqariladigan, berilmasa ichki state ishlatadigan komponent?', "Ikki rejimli (controlled/uncontrolled)", ["Faqat boshqariladigan (controlled) turdagi", "Server komponenti deb ataluvchi turi", "Sof prezentatsion komponent turi"], "input kabi API."),
      ch('Headless hook ning afzalligi?', "Bir mantiqni turli ko'rinishda ishlatish", ["CSS ni o'zi avtomatik yozib berishi", "Komponentni serverga ko'chirib berishi", "State ni butunlay keraksiz qilishi"], "UI chaqiruvchida."),
      ch('`<Mouse render={(pos) => <Cat {...pos} />} />` qaysi pattern?', 'Render props', ['HOC', 'Controlled', 'Portal'], "Funksiya prop."),
      ch('Zamonaviy kodda render props o\'rnini ko\'pincha nima bosadi?', 'Custom hook', ['Klass merosi', 'Global event', 'iframe'], "Soddaroq."),
      ch('Ikki HOC bir xil nomli prop bersa?', "Biri ikkinchisini bosib yozadi", ["Ikkalasi massivga birlashadi", "React ogohlantirib to'xtaydi", "Prop butunlay yo'qoladi"], "HOC larning kamchiligi."),
      ch('Prezentatsion va konteyner ajratishda prezentatsion qism?', "Faqat props olib, chizadi", ["Ma'lumot yuklab, saqlaydi", "Store ga yozib boradi", "Marshrutni boshqaradi"], "Qayta ishlatish va test oson."),
      fill("Komponent qabul qilib komponent qaytaruvchi funksiya qisqartmasi?", 'HOC', "Higher-Order Component.", ['hoc', 'Higher-Order Component']),
    ],
  });

  /* 28 */
  lesson({
    title: 'React takrori',
    intro: "Modul bo'yicha aralash savollar: render, state, effekt, key, context, performance va arxitektura.",
    theory: {
      analogy: { icon: '🏁', title: 'Yakuniy aylanma', text: "Marraga yetishdan oldin butun trassani bir yo'la bosib o'tasiz — qayerda sekinlashsangiz, o'sha mavzuga qayting." },
      sections: [
        { heading: 'Asosiy zanjir', bullets: ["UI = f(state); ma'lumot pastga, hodisa yuqoriga.", "set → yangi render → snapshot.", "key va pozitsiya state ni belgilaydi.", "Effekt — tashqi tizim bilan sinxronlash.", "Hisoblanadiganini saqlamang.", "Avval o'lchang, keyin optimallashtiring."] },
        { heading: 'Qaysi vosita', table: { head: ['Vazifa', 'Vosita'], rows: [['lokal holat', 'useState / useReducer'], ['uzoqqa uzatish', 'kompozitsiya, context'], ['server ma\'lumoti', 'query kutubxonasi'], ['DOM / taymer id', 'useRef'], ['mantiqni ulashish', 'custom hook'], ['xato va kutish', 'Error boundary, Suspense']] } },
        { callout: { kind: 'tip', text: "Xato qilgan har savolingiz uchun kichik komponent yozib, javobni o'z ko'zingiz bilan ko'ring." } },
      ],
      recap: ["Render sof bo'lsin.", "State minimal bo'lsin.", "Bog'liqliklar rost bo'lsin.", "Soddasidan boshlang."],
    },
    defs: [
      ['Idempotent render', "necha marta chaqirilsa ham bir xil natija beradigan render."],
      ['Source of truth (haqiqat manbasi)', "ma'lumotning yagona egasi."],
      ['Trade-off (murosa)', "bir foyda evaziga boshqa narsadan voz kechish."],
    ],
    life: [['🧠', 'Imtihon', "Aralash savollar bilimni haqiqiy sinaydi."], ['🛠️', 'Usta', "Qaysi asbobni qachon olishni bilish — asosiy mahorat."]],
    practice: [{ title: 'Yakuniy loyiha', text: "Router, context+reducer, ma'lumot yuklash va error boundary li kichik ilova yozing." }, { title: 'O\'z so\'zingiz bilan', text: "«Nega key kerak» va «qachon effekt kerak emas» savollariga og'zaki javob bering." }],
    items: [
      ch('Konsol (bir bosish, n=0)?', '0 0', ['1 2', '0 1', '1 1'], "n — snapshot.", 'setN(n + 1);\nconsole.log(n);\nsetN((v) => v + 1);\nconsole.log(n);'),
      ch('Yuqoridagi koddan keyin ekranda?', '2', ['1', '0', '3'], "1 qo'yiladi, keyin updater +1."),
      ch('`<List key={filter} />` — filter o\'zgarsa?', "List qayta mount bo'ladi", ["List faqat qayta render", "List o'zgarmay qoladi", "key e'tiborsiz qoladi"], "State tozalanadi."),
      ch('`useEffect(() => setTotal(a + b), [a, b])` o\'rniga?', 'const total = a + b', ['useMemo(setTotal, [])', 'useRef(a + b)', 'useLayoutEffect'], "Effekt kerak emas."),
      ch('Qaysi biri state bo\'lishi shart?', "Input ga yozilgan matn", ["Ikki propning yig'indisi", "Ro'yxatning uzunligi", "Taymerning id raqami"], "Boshqalari hosila yoki ref."),
      ch('Sahifa ochilganda oq ekran, konsolda render xatosi. Himoya?', 'Error boundary', ['Suspense', 'StrictMode', 'useCallback'], "Zaxira UI."),
      ch('Bola har ota renderida render bo\'lyapti va bu og\'ir. Birinchi nomzod?', 'memo va barqaror props', ['useLayoutEffect', 'forwardRef va useId', 'dangerouslySetInnerHTML'], "O'lchagandan keyin."),
      ch('`dangerouslySetInnerHTML` ning xavfi?', 'XSS hujumi', ['Cheksiz render', 'Key to\'qnashuvi', 'Xotira kamayishi'], "Matn tozalanmaydi."),
      ch('`{list.length && <List />}` bo\'sh ro\'yxatda?', "Ekranda 0 chiqadi", ["Hech narsa chiqmaydi", "Xato chiqadi", "<List /> chiqadi"], "0 && ..."),
      ch('Hooklar nega shart ichida chaqirilmaydi?', "React ularni tartib bo'yicha taniydi", ["JavaScript sintaksisi buni taqiqlaydi", "Shart ichida closure ishlamay qoladi", "Hooklar faqat bir marta chaqiriladi"], "Chaqiruv tartibi — identifikator."),
      order("Birinchi ko'rsatishdagi tartib.", ["Komponent render bo'ladi", "DOM yaratiladi", "ref ulanadi", "useEffect ishlaydi"], "Render → commit → ref → effect."),
      fill("Komponent natijasi faqat props va state ga bog'liq bo'lsa, u qanday funksiya (inglizcha)?", 'pure', "Toza funksiya.", ['pure function']),
    ],
  });
};
