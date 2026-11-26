// React, lessons 15-21.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 15 */
  lesson({
    title: 'useReducer',
    intro: "action va reducer, dispatch, reducer sofligi, murakkab state, useState bilan taqqoslash.",
    theory: {
      analogy: { icon: '🏦', title: 'Bank kassiri', text: "Siz seyfni o'zingiz ochmaysiz: ariza (action) topshirasiz, kassir (reducer) qoidaga qarab yangi balans yozadi." },
      sections: [
        { heading: 'Uch qism', code: { lang: 'jsx', text: "function reducer(state, action) {\n  switch (action.type) {\n    case 'add':\n      return { ...state, items: [...state.items, action.item] };\n    case 'clear':\n      return { ...state, items: [] };\n    default:\n      throw new Error('Noma\\'lum action: ' + action.type);\n  }\n}\nconst [state, dispatch] = useReducer(reducer, { items: [] });\ndispatch({ type: 'add', item: 'olma' });" } },
        { heading: 'Qoidalar', bullets: ["Reducer toza: so'rov, taymer, mutatsiya yo'q.", "Har case yangi state qaytaradi.", "Action — nima BO'LGANINI aytadi (`added`, `submitted`), qanday o'zgartirishni emas.", "`dispatch` havolasi renderlar orasida o'zgarmaydi.", "Uchinchi argument — lazy init: `useReducer(reducer, arg, init)`."] },
        { table: { head: ['', 'useState', 'useReducer'], rows: [['Mos holat', 'sodda, mustaqil qiymat', "bog'liq maydonlar, ko'p amal"], ['Mantiq joyi', 'ishlovchilarda', 'bitta funksiyada'], ['Test', 'komponent orqali', 'oddiy funksiya sifatida']] } },
        { callout: { kind: 'info', text: "dispatch dan keyin ham state o'sha renderda eskicha qoladi — u ham snapshot." } },
      ],
      recap: ["(state, action) => yangi state.", "dispatch action yuboradi.", "Reducer toza bo'lsin.", "Bir xil state qaytsa, render o'tkazib yuborilishi mumkin."],
    },
    defs: [
      ['Reducer (yig\'uvchi funksiya)', "joriy state va action dan yangi state hisoblaydigan toza funksiya."],
      ['Action (harakat)', "nima sodir bo'lganini tavsiflovchi obyekt, odatda type maydoni bilan."],
      ['dispatch (yuborish)', "action ni reducerga jo'natuvchi funksiya."],
      ['Payload (yuk)', "action bilan birga keladigan ma'lumot."],
    ],
    life: [['🎮', 'Pult', "Tugma bosildi (action) — televizor o'z qoidasi bo'yicha holatini o'zgartiradi."], ['🧾', 'Kvitansiya', "Har amal yozib boriladi — nima bo'lganini kuzatish oson."]],
    practice: [{ title: 'Savat reducer', text: "added, removed, changedQty, cleared action lari bilan savat yozing." }, { title: 'Reducer testi', text: "Reducer ni komponentsiz, oddiy funksiya sifatida tekshiring." }],
    items: [
      ch("Konsolda nima chiqadi (n boshida 0)?", 'eski 0', ["yangi 1", "undefined", "action obyekti"], "state snapshot.", 'dispatch({ type: "inc" });\nconsole.log(state.n);'),
      ch('Reducer ning qaysi satri xato?', 'state.count++; return state;', ['return { ...state, count: state.count + 1 };', 'return { count: 0, history: [] };', 'return state.count > 0 ? reset(state) : state;'], "Mutatsiya + o'sha havola: render bo'lmaydi."),
      ch('Reducer `default` da hech narsa qaytarmasa, noma\'lum action dan keyin state?', 'undefined', ['Eski state qoladi', 'Bo\'sh obyekt bo\'ladi', 'null bo\'lib qoladi'], "Funksiya undefined qaytaradi."),
      ch('Reducer ichida nima qilish mumkin?', "Yangi massivni hisoblash", ["fetch bilan so'rov yuborish", "localStorage ga yozib qo'yish", "setTimeout bilan kechiktirish"], "Toza hisob."),
      ch('StrictMode da reducer ikki marta chaqirildi. `items.push` bo\'lsa?', "Element ikki marta qo'shiladi", ["Hech qanday farq bo'lmaydi", "Xato bilan to'xtab qoladi", "Element umuman qo'shilmaydi"], "Nopoklik shu bilan fosh bo'ladi."),
      ch('Qaysi action nomi yaxshiroq?', "{ type: 'item_added' }", ["{ type: 'set_items_array' }", "{ type: 'setState_value' }", "{ type: 'update_1' }"], "Hodisani tavsiflaydi."),
      ch('dispatch ni prop qilib bersak, memo li bola?', "dispatch tufayli render bo'lmaydi", ["Har renderda yangi dispatch oladi", "dispatch ni chaqira olmaydi", "Faqat birinchi renderda ishlaydi"], "Havolasi barqaror."),
      ch('Uchta dispatch({type:"inc"}) ketma-ket (n=0). Natija?', '3', ['1', '0', '2'], "Har action oldingi natijaga qo'llanadi."),
      ch('`useReducer(reducer, 10, (n) => ({ count: n * 2 }))` boshlang\'ich state?', '{ count: 20 }', ['{ count: 10 }', '10', '{ count: 2 }'], "init funksiyasi argumentni aylantiradi."),
      ch('Qachon useReducer qulayroq?', "Maydonlar bir-biriga bog'liq bo'lsa", ["Bitta boolean bayroq kerak bo'lsa", "Qiymat ekranda ko'rinmasa", "DOM tuguniga murojaat kerak bo'lsa"], "Mantiq bir joyda."),
      fill("action ni reducerga yuboruvchi funksiya nomi?", 'dispatch', "dispatch(action)."),
    ],
  });

  /* 16 */
  lesson({
    title: 'Context',
    intro: "createContext, Provider, useContext, standart qiymat, ichma-ich provider, qayta render narxi.",
    theory: {
      analogy: { icon: '📡', title: 'Radio stansiya', text: "Provider eshittirish tarqatadi, xohlagan komponent o'z priyomnigi (useContext) bilan tinglaydi — oraliqdagilarga xat tashitish shart emas." },
      sections: [
        { heading: 'Uch qadam', code: { lang: 'jsx', text: "const ThemeContext = createContext('light');\n\n<ThemeContext.Provider value={theme}>\n  <Page />\n</ThemeContext.Provider>\n\nconst theme = useContext(ThemeContext);" } },
        { text: "useContext daraxtda yuqoriga qarab eng yaqin Provider qiymatini oladi. Provider bo'lmasa, createContext ga berilgan standart qiymat qaytadi. Provider shu komponentning o'zida turgan bo'lsa, u o'sha komponentga ta'sir qilmaydi." },
        { heading: 'Qayta render', bullets: ["value o'zgarsa (Object.is), shu context ni o'qiydigan barcha komponentlar render bo'ladi.", "memo bu yangilanishni to'xtata olmaydi.", "`value={{ user, setUser }}` har renderda yangi obyekt — useMemo bilan barqarorlashtiring.", "Tez o'zgaradigan va kam o'zgaradigan ma'lumotni alohida context larga ajrating."] },
        { callout: { kind: 'tip', text: "Context — state menejer emas, ma'lumot uzatish yo'li. State baribir useState/useReducer da turadi." } },
      ],
      recap: ["createContext → Provider → useContext.", "Eng yaqin Provider yutadi.", "value havolasiga e'tibor bering.", "Avval kompozitsiya, keyin context."],
    },
    defs: [
      ['Context (kontekst)', "ma'lumotni daraxt bo'ylab props siz uzatish mexanizmi."],
      ['Provider (ta\'minlovchi)', "context qiymatini pastki daraxtga beruvchi komponent."],
      ['Consumer (iste\'molchi)', "context qiymatini o'qiydigan komponent."],
    ],
    life: [['🌐', 'Til sozlamasi', "Butun ilova bitta tanlangan tilni biladi."], ['🏢', 'Bino ob-havosi', "Har qavatda eng yaqin konditsioner havosi sezilishi — eng yaqin Provider."]],
    practice: [{ title: 'Mavzu', text: "ThemeContext bilan light/dark almashtirgich yozing." }, { title: 'useAuth', text: "Provider tashqarisida chaqirilsa tushunarli xato beradigan hook yozing." }],
    items: [
      ch('Natija?', 'light', ['dark', 'undefined', 'Xato'], "Provider shu komponentning O'ZIDA — o'ziga ta'sir qilmaydi.", 'const Ctx = createContext("light");\nfunction App() {\n  const t = useContext(Ctx);\n  return <Ctx.Provider value="dark"><p>{t}</p></Ctx.Provider>;\n}'),
      ch('Ichma-ich ikki Provider: tashqi "a", ichki "b". Ichkaridagi o\'quvchi?', 'b', ['a', 'ab', 'standart qiymat'], "Eng yaqin Provider."),
      ch('`createContext("x")`, `<Ctx.Provider>` value siz. O\'quvchi?', 'undefined', ['"x" satri', 'null', '""'], "Standart qiymat faqat Provider umuman bo'lmaganda."),
      ch('`value={{ user }}` ota har renderlanganda. Oqibat?', "Barcha o'quvchilar qayta render bo'ladi", ["React obyektni chuqur solishtirib tejaydi", "O'quvchilar eski qiymatni ko'rib turaveradi", "Faqat birinchi o'quvchi render bo'ladi"], "Havola yangi."),
      ch('memo li komponent useContext ishlatadi, context o\'zgardi. U?', "Baribir render bo'ladi", ["memo tufayli o'tkazadi", "Eski qiymatni oladi", "Unmount bo'lib qoladi"], "memo faqat props ni tekshiradi."),
      ch('Context o\'zgarganda uni o\'qimaydigan, memo li komponent?', "Render bo'lmaydi", ["Render bo'ladi", "Qayta mount bo'ladi", "State i nollanadi"], "Faqat o'quvchilar."),
      ch('Context nima uchun eng mos?', "Mavzu, til, joriy foydalanuvchi", ["Har bosishda o'zgaruvchi koordinata", "Bitta inputning vaqtinchalik matni", "Ota va bolasi orasidagi bitta prop"], "Kam o'zgaradi, ko'p joyga kerak."),
      ch('Provider tashqarisida jim ishlamaslik uchun yaxshi usul?', "Custom hook da null ni tekshirib xato otish", ["Standart qiymatga bo'sh funksiyalar yozish", "Har komponentda try/catch bilan o'rash", "window obyektidan zaxira qiymat olish"], "useAuth() ichida tekshiruv."),
      ch('Context o\'zi state saqlaydimi?', "Yo'q, faqat qiymatni uzatadi", ["Ha, o'z ichida xotirasi bor", "Ha, lekin faqat obyektlarni", "Faqat Provider ichida saqlaydi"], "State Provider qiluvchi komponentda."),
      ch('Ikki xil context: Theme va User. Theme o\'zgarsa faqat User o\'qiydigan komponent?', "Context sabab render bo'lmaydi", ["Ikkalasi ham doim render qiladi", "User qiymati yo'qolib qoladi", "Xato: ikki context mumkin emas"], "Obuna context bo'yicha."),
      fill("Context qiymatini o'qiydigan hook nomi?", 'useContext', "useContext(Ctx)."),
    ],
  });

  /* 17 */
  lesson({
    title: 'Context va reducer birga',
    intro: "Global state ni useReducer + context bilan qurish, state va dispatch ni ajratish, Provider va custom hook.",
    theory: {
      analogy: { icon: '🏛️', title: 'Idora', text: "Reducer — nizom, state — arxiv, dispatch — ariza qutisi. Context ularni binoning har xonasidan ochiq qiladi." },
      sections: [
        { heading: 'Tuzilma', code: { lang: 'jsx', text: "const TasksCtx = createContext(null);\nconst DispatchCtx = createContext(null);\n\nfunction TasksProvider({ children }) {\n  const [tasks, dispatch] = useReducer(tasksReducer, []);\n  return (\n    <TasksCtx.Provider value={tasks}>\n      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>\n    </TasksCtx.Provider>\n  );\n}\nexport const useTasks = () => useContext(TasksCtx);\nexport const useTasksDispatch = () => useContext(DispatchCtx);" } },
        { heading: 'Nega ikkita context', text: "dispatch havolasi o'zgarmaydi. Uni alohida context ga qo'ysangiz, faqat amal yuboradigan komponentlar (masalan, «qo'shish» formasi) state o'zgarganda qayta render bo'lmaydi." },
        { heading: 'Chegara', bullets: ["Provider ni kerakli shoxga qo'ying, har doim ildizga emas.", "Context da selector yo'q: o'quvchi butun qiymatga obuna.", "Tez-tez o'zgaradigan katta state uchun maxsus kutubxona qulayroq.", "`children` prop orqali o'tgani uchun Provider state i o'zgarsa, faqat o'quvchilar yangilanadi."] },
        { callout: { kind: 'tip', text: "Komponentlar useContext ni to'g'ridan-to'g'ri emas, useTasks kabi hook orqali ishlatsin — ichki tuzilmani almashtirish oson." } },
      ],
      recap: ["useReducer — mantiq, context — yetkazish.", "state va dispatch ni ajrating.", "Custom hook bilan yoping.", "Context da selector yo'q."],
    },
    defs: [
      ['Global state (umumiy holat)', "ilovaning uzoq qismlariga kerak bo'lgan ma'lumot."],
      ['Selector (tanlovchi)', "state dan kerakli bo'lagini oladigan funksiya."],
      ['Store (ombor)', "state va uni o'zgartirish qoidalari saqlanadigan joy."],
    ],
    life: [['📬', 'Ariza qutisi', "Ariza tashlaydigan odam arxivdagi o'zgarishlarni kuzatib o'tirishi shart emas."], ['🗄️', 'Arxiv', "Bitta nusxa — hamma o'sha yerdan o'qiydi."]],
    practice: [{ title: 'TasksProvider', text: "Qo'shish, belgilash va o'chirishli vazifalar ilovasini yozing." }, { title: 'Render kuzatish', text: "state va dispatch ni bir va ikki context da solishtiring." }],
    items: [
      ch('Nega state va dispatch alohida context larda?', "Faqat yuboruvchilar ortiqcha render bo'lmaydi", ["dispatch va state turi bir xil bo'lmagani uchun", "dispatch aks holda har renderda o'zgaradi", "useReducer ikkita Provider talab qiladi"], "dispatch qiymati o'zgarmas."),
      ch('`value={{ state, dispatch }}` bitta context. «Qo\'shish» tugmasi faqat dispatch oladi. state o\'zgarsa?', "Tugma ham qayta render bo'ladi", ["Tugma render bo'lmaydi", "dispatch ishlamay qoladi", "Tugma bundan butunlay xabarsiz qoladi"], "Obyekt yangi, selector yo'q."),
      ch('Provider ichida `{children}` ishlatilgan. Reducer state i o\'zgarsa, context o\'qimaydigan bolalar?', "Render bo'lmaydi", ["Hammasi render bo'ladi", "Qayta mount bo'ladi", "Eski nusxasi qoladi"], "children elementlari o'zgarmagan."),
      ch('`useTasks()` Provider siz chaqirildi, `createContext(null)`. Qiymat?', 'null', ['[]', 'undefined', '{}'], "Standart qiymat."),
      ch('Ikki joyda `<TasksProvider>` alohida ishlatilsa?', "Har biri mustaqil state yaratadi", ["Ikkalasi bitta ro'yxatni ulashadi", "Ikkinchisi birinchisini o'chiradi", "React xato beradi"], "State Provider nusxasida."),
      ch('Context + useReducer ning asosiy kamchiligi?', "Qismga obuna bo'lib bo'lmaydi", ["Action yuborib bo'lmaydi", "State saqlanib qolmaydi", "Faqat bitta o'quvchi bo'ladi"], "Selector yo'q."),
      ch('Server dan yuklash qayerda bo\'lishi kerak?', "Hodisa yoki effektda, keyin dispatch", ["Reducer case ichida await bilan", "createContext argumentida", "Provider JSX ichida to'g'ridan-to'g'ri"], "Reducer toza."),
      ch('Barcha state ni bitta ulkan context ga yig\'ish?', "Ko'p ortiqcha renderga olib keladi", ["Eng tez va tavsiya etilgan usul", "React uni avtomatik bo'lib chiqadi", "Faqat xotirani tejaydi, zarari yo'q"], "Mavzu bo'yicha ajrating."),
      ch('`const addTask = (t) => dispatch({ type: "added", t })` — bu nima uchun qulay?', "Action tuzilishi bir joyda yashirinadi", ["dispatch shu bilan asinxron bo'ladi", "Reducer yozish shart bo'lmay qoladi", "State mutatsiyasiga ruxsat beradi"], "Action creator."),
      ch('Provider ni qayerga qo\'yish ma\'qul?', "Ma'lumot kerak shoxning tepasiga", ["Har doim index.html ichiga", "Har bir o'quvchining ichiga", "Faqat ildiz index.html dagi div ichiga"], "Doirani toraytiring."),
      fill("State dan kerakli bo'lakni tanlab oladigan funksiya inglizcha nomi?", 'selector', "Context da u yo'q."),
    ],
  });

  /* 18 */
  lesson({
    title: "Custom hook'lar",
    intro: "Mantiqni qayta ishlatish, nomlash qoidasi, har chaqiruvda alohida state, useToggle, useFetch, useDebounce, useLocalStorage.",
    theory: {
      analogy: { icon: '🍳', title: 'Retsept', text: "Custom hook — retsept: ikki oshpaz bir retsept bo'yicha pishirsa, har birining o'z qozoni bo'ladi. Usul umumiy, ovqat (state) alohida." },
      sections: [
        { heading: 'Yozilishi', code: { lang: 'jsx', text: "function useToggle(initial = false) {\n  const [on, setOn] = useState(initial);\n  const toggle = useCallback(() => setOn((v) => !v), []);\n  return [on, toggle];\n}" } },
        { heading: 'Qoidalar', bullets: ["Nomi `use` bilan boshlanadi — linter hook qoidalarini shundan biladi.", "Ichida boshqa hooklar chaqiriladi; chaqirilmasa, bu oddiy funksiya.", "Har chaqiruv o'z state va effektiga ega.", "JSX emas, qiymat va funksiyalar qaytaradi.", "Parametr o'zgarsa effekt qayta ishlaydi — bog'liqliklarni yozing."] },
        { code: { lang: 'jsx', text: "function useDebounce(value, ms) {\n  const [v, setV] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setV(value), ms);\n    return () => clearTimeout(id);\n  }, [value, ms]);\n  return v;\n}" } },
        { callout: { kind: 'tip', text: "`useData(url)` kabi aniq maqsadli hook yozing; `useMount` kabi lifecycle taqlidlari bog'liqliklarni yashiradi." } },
      ],
      recap: ["Hook mantiqni ulashadi, state ni emas.", "use bilan boshlang.", "Debounce = timeout + cleanup.", "Bir xil qaytarish shakli: massiv yoki obyekt."],
    },
    defs: [
      ['Custom hook (maxsus ilmoq)', "ichida hooklar ishlatadigan, use bilan boshlanuvchi o'z funksiyangiz."],
      ['Debounce (kechiktirib yig\'ish)', "qiymat o'zgarishi to'xtagandan keyingina amal bajarish."],
      ['Abstraction (mavhumlashtirish)', "tafsilotni yashirib, sodda interfeys berish."],
    ],
    life: [['🔁', 'Shablon', "Ariza shabloni bitta, har kim o'z nusxasini to'ldiradi."], ['🛗', 'Lift eshigi', "Debounce: odam kirib tursa, eshik yopilishi kechiktiriladi."]],
    practice: [{ title: 'useLocalStorage', text: "useState kabi ishlaydigan, lekin saqlaydigan hook yozing." }, { title: 'useFetch', text: "data, error, loading qaytaradigan va eski javobni tashlaydigan hook yozing." }],
    items: [
      ch('Ikki komponent `useCounter()` chaqirdi. Birida oshirildi. Ikkinchisida?', "O'zgarmaydi", ["Birga oshadi", "Nollanadi", "Xato chiqadi"], "Har chaqiruv alohida state."),
      ch('Funksiya nomi `getUser` , ichida useState. Muammo?', "Linter va o'quvchi hook ekanini bilmaydi", ["JavaScript buni sintaksis xatosi deb biladi", "useState undefined qaytarib qo'yadi", "State global bo'lib qoladi"], "use prefiksi shart."),
      ch('`useSorted(list)` ichida hech qanday hook yo\'q. Tavsiya?', "Oddiy funksiya qilib, use ni olib tashlash", ["Ichiga sun'iy useState qo'shib qoldirish", "Uni komponentga aylantirib yuborish", "Natijani global o'zgaruvchiga yozish"], "Hook bo'lmasa, use ortiqcha."),
      ch('`const [on, toggle] = useToggle()`; `<button onClick={toggle}>`. `useState` da `setOn(!on)` o\'rniga `v => !v` nega yaxshi?', "toggle ni barqaror qilish mumkin", ["Boolean ni faqat shunday o'zgartiradi", "Render umuman bo'lmay qoladi", "State localStorage ga yoziladi"], "Bog'liqlik kerak emas."),
      ch('useDebounce(q, 300): foydalanuvchi har 100 ms da 5 harf yozdi. Nechta yangilanish chiqadi?', 'Bitta, oxirgi qiymat', ['Beshta, har harfga', 'Nol, hech qachon', 'Ikkita: birinchi va oxirgi'], "Har o'zgarishda taymer bekor."),
      ch('useDebounce da cleanup unutilsa?', "Har harf uchun kechikkan yangilanish keladi", ["Qiymat umuman yangilanmay qoladi", "Kechikish ikki barobar uzayib ketadi xolos", "Taymer brauzerda avtomatik o'chadi"], "Taymerlar to'planadi."),
      ch('Hook `{ data }` emas JSX qaytaryapti. Bu nima bo\'lgani ma\'qul?', "Komponent", ["Reducer", "Context", "Effekt"], "UI qaytaradigan narsa komponentdir."),
      ch('`useFetch(url)` effektida `[]` yozilgan. url o\'zgarsa?', "Eski ma'lumot qolib ketadi", ["Yangi so'rov avtomatik ketadi", "Komponent qayta mount bo'ladi", "Hook xato otadi"], "[url] bo'lishi kerak."),
      ch('Custom hook ni shart ichida chaqirish?', "Mumkin emas, hook qoidasi", ["Mumkin, u oddiy funksiya", "Faqat effektsiz bo'lsa mumkin", "Faqat birinchi renderda mumkin"], "Ichida hooklar bor."),
      ch('Ikki komponent bitta ma\'lumotni ULASHishi kerak. Custom hook yetadimi?', "Yo'q: ko'tarish yoki context kerak", ["Ha, hook state ni o'zi ulashadi", "Ha, agar nomi bir xil bo'lsa", "Ha, useCallback bilan o'ralsa"], "Hook mantiqni ulashadi."),
      fill("Custom hook nomi qaysi uch harf bilan boshlanadi?", 'use', "useSomething."),
    ],
  });

  /* 19 */
  lesson({
    title: 'Server state va TanStack Query',
    intro: "Server state nima, useQuery va queryKey, staleTime va gcTime, useMutation, invalidate, optimistic update.",
    theory: {
      analogy: { icon: '🗞️', title: 'Gazeta', text: "Server ma'lumoti — kechagi gazeta nusxasi: qo'lingizda turibdi, lekin eskirishi mumkin. Kutubxona qachon yangisini olishni boshqaradi." },
      sections: [
        { heading: 'Server state boshqacha', text: "Server state — egasi server bo'lgan ma'lumot: u asinxron, eskiradi, boshqalar ham o'zgartiradi. Uni qo'lda useEffect bilan boshqarish loading, xato, kesh, takroriy so'rov va race muammolarini qayta yozishni talab qiladi." },
        { code: { lang: 'jsx', text: "const { data, isPending, error } = useQuery({\n  queryKey: ['users', id],\n  queryFn: () => getUser(id),\n  staleTime: 60_000,\n});\n\nconst mutation = useMutation({\n  mutationFn: createUser,\n  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),\n});" } },
        { heading: 'Asosiy tushunchalar', table: { head: ['Atama', 'Ma\'nosi'], rows: [['queryKey', 'kesh manzili; o\'zgarsa yangi so\'rov'], ['staleTime', "ma'lumot qancha vaqt «yangi» sanaladi (standart 0)"], ['gcTime', "ishlatilmayotgan kesh qancha turadi (standart 5 daqiqa)"], ['invalidate', "keshni eskirgan deb belgilab qayta olish"], ['optimistic update', "javobni kutmasdan UI ni yangilash, xatoda qaytarish"]] } },
        { text: "queryFn xato bo'lganda reject qilishi kerak: fetch 404/500 da o'zi reject qilmaydi, `res.ok` ni tekshiring. Bir xil queryKey li bir nechta komponent bitta so'rovni ulashadi (deduplication)." },
        { callout: { kind: 'info', text: "Laboratoriyalarda kutubxona yuklanmaydi: shu g'oyalarni (kesh, holatlar, invalidate, optimistik yangilash) o'zingiz qo'lda yozib ko'rasiz." } },
      ],
      recap: ["Server state ≠ client state.", "queryKey — kesh kaliti.", "staleTime va gcTime boshqa-boshqa.", "Mutatsiyadan keyin invalidate."],
    },
    defs: [
      ['Server state (server holati)', "serverda saqlanadigan va klientda vaqtincha keshlanadigan ma'lumot."],
      ['Cache (kesh)', "qayta so'ramaslik uchun saqlangan nusxa."],
      ['Stale (eskirgan)', "yangilanishi kerak deb hisoblangan ma'lumot."],
      ['Mutation (o\'zgartirish)', "serverdagi ma'lumotni yaratish, yangilash yoki o'chirish."],
      ['Optimistic update (optimistik yangilash)', "muvaffaqiyatni taxmin qilib UI ni oldindan o'zgartirish."],
    ],
    life: [['🧊', 'Muzlatgich', "Ovqat bor bo'lsa do'konga bormaysiz, muddati o'tsa yangilaysiz — staleTime."], ['❤️', 'Like', "Yurakcha darhol bo'yaladi, server rad etsa qaytadi."]],
    practice: [{ title: 'useQuery taqlidi', text: "status, data, error qaytaradigan va natijani Map da keshlaydigan hook yozing." }, { title: 'TanStack Query', text: "O'z loyihangizga @tanstack/react-query o'rnatib, bitta ro'yxat va qo'shish formasini ulang." }],
    items: [
      ch('Qaysi biri server state?', "Bazadagi buyurtmalar ro'yxati", ["Modal ochiq yoki yopiqligi", "Inputga yozilayotgan matn", "Tanlangan tab raqami"], "Egasi server."),
      ch('`queryKey: ["user"]`, lekin queryFn `id` dan foydalanadi. Muammo?', "id o'zgarsa ham eski kesh qaytadi", ["So'rov umuman yuborilmaydi", "Har renderda so'rov ketadi", "queryFn id ni umuman o'qiy olmaydi"], "Kalitga barcha o'zgaruvchilar kiradi."),
      ch('Standart `staleTime`?', '0', ['5 daqiqa', '1 daqiqa', 'cheksiz'], "Darhol eskirgan sanaladi."),
      ch('Standart `gcTime`?', '5 daqiqa', ['0', '1 soat', '30 soniya'], "Ishlatilmayotgan kesh."),
      ch('fetch 404 qaytardi, queryFn `res.json()` qildi. Query holati?', "success bo'lib qolishi mumkin", ["error holatiga o'tadi", "pending da qotib qoladi", "Avtomatik invalidate bo'ladi"], "res.ok tekshirib throw qiling."),
      ch('Uch komponent bir xil queryKey bilan useQuery qildi. So\'rovlar?', 'Bitta', ['Uchta', 'Oltita', 'Nol'], "Deduplication."),
      ch('Mutatsiyadan keyin ro\'yxatni yangilashning to\'g\'ri yo\'li?', 'invalidateQueries', ['window.location.reload', 'queryClient.clearAll', 'useState bilan nusxa'], "Kerakli kalitlar qayta olinadi."),
      ch('Optimistik yangilashda server xato qaytarsa?', "Oldingi qiymatni tiklash kerak", ["UI ni shunday qoldirish kerak", "Sahifani qayta yuklash kerak", "So'rovni cheksiz takrorlash"], "onError da rollback."),
      ch('Keshda ma\'lumot bor va eskirgan. Komponent mount bo\'ldi. Nima ko\'rinadi?', "Eski ma'lumot, fonda yangilanadi", ["Faqat spinner, kesh o'chiriladi", "Hech narsa, xato ko'rinadi", "Eski ma'lumot, so'rov ketmaydi"], "stale-while-revalidate."),
      ch('Server ma\'lumotini Redux/Zustand ga nusxalashning kamchiligi?', "Sinxronlash va eskirish o'zingizga qoladi", ["Bunday saqlash texnik jihatdan imkonsiz", "Ma'lumot brauzerdan serverga yo'qoladi", "Komponentlar uni o'qiy olmay qoladi"], "Ikkinchi manba."),
      fill("Keshni eskirgan deb belgilab qayta oldirish metodi: ___Queries?", 'invalidate', "invalidateQueries.", ['invalidateQueries']),
    ],
  });

  /* 20 */
  lesson({
    title: 'Client state: Zustand va Redux Toolkit',
    intro: "Qachon tashqi store kerak, selector, Zustand, Redux oqimi, slice, immer, useSyncExternalStore.",
    theory: {
      analogy: { icon: '📰', title: 'Obuna', text: "Store — tahririyat. Har komponent faqat o'ziga kerak rukn (selector) ga obuna bo'ladi va o'sha rukn o'zgargandagina xabar oladi." },
      sections: [
        { heading: 'Avval savol', bullets: ["Faqat bitta komponentga kerak → useState.", "Aka-ukalarga kerak → ko'tarish.", "Kam o'zgaradigan umumiy → context.", "Server ma'lumoti → query kutubxonasi.", "Ko'p joyda, tez o'zgaradigan klient holati → store."] },
        { heading: 'Zustand', code: { lang: 'jsx', text: "const useCart = create((set) => ({\n  items: [],\n  add: (item) => set((s) => ({ items: [...s.items, item] })),\n}));\n\nconst count = useCart((s) => s.items.length); // selector" } },
        { heading: 'Redux Toolkit', code: { lang: 'js', text: "const cart = createSlice({\n  name: 'cart',\n  initialState: { items: [] },\n  reducers: {\n    added(state, action) { state.items.push(action.payload); }, // immer\n  },\n});\n// UI → dispatch(action) → reducer → store → useSelector" } },
        { text: "Redux Toolkit ichidagi immer tufayli reducer da «mutatsiya» yozish mumkin: aslida draft o'zgaradi va yangi immutable state yaratiladi. Bu faqat createSlice/createReducer ichida ishlaydi. Tashqi store React ga `useSyncExternalStore` orqali ulanadi." },
        { callout: { kind: 'warn', text: "Selector har safar yangi obyekt/massiv qaytarsa (`s => s.items.filter(...)`), ortiqcha render yoki sikl chiqishi mumkin." } },
      ],
      recap: ["Store — React dan tashqaridagi state.", "Selector faqat kerakli qismga obuna qiladi.", "RTK: slice, immer, DevTools.", "Zustand: kam kod, Provider shart emas."],
    },
    defs: [
      ['Store (ombor)', "state saqlaydigan va o'zgarishdan obunachilarni xabardor qiladigan obyekt."],
      ['Slice (bo\'lak)', "bitta mavzuga oid state, reducer va action lar to'plami."],
      ['Subscribe (obuna bo\'lish)', "o'zgarish haqida xabar olish uchun funksiya ro'yxatdan o'tkazish."],
      ['useSyncExternalStore', "tashqi manbaga xavfsiz obuna bo'lish hooki."],
    ],
    life: [['🏪', 'Ombor', "Bo'limlar tovarni bitta ombordan oladi."], ['🔔', 'Bildirishnoma', "Faqat o'zingiz yoqqan mavzu bo'yicha xabar keladi — selector."]],
    practice: [{ title: "O'z store ingiz", text: "createStore(getState, setState, subscribe) yozib useSyncExternalStore bilan ulang." }, { title: 'Ikki kutubxona', text: "Bir savatni Zustand va Redux Toolkit da yozib solishtiring." }],
    items: [
      ch('Modal ochiqligi faqat bitta komponentga kerak. Qayerda saqlanadi?', 'useState', ['Redux store', 'Zustand store', 'Context'], "Lokal state."),
      ch('`const state = useCart()` (selectorsiz). Oqibat?', "Store dagi har o'zgarishda render", ["Faqat items o'zgarsa render", "Faqat add chaqirilganda render", "Faqat birinchi o'zgarishda"], "Butun state ga obuna."),
      ch('`useCart((s) => s.add)` olgan komponent items o\'zgarsa?', "Render bo'lmaydi", ["Render bo'ladi", "add yangilanadi", "Xato chiqadi"], "Tanlangan qiymat o'zgarmagan."),
      ch('RTK createSlice reducer ida `state.items.push(x)`?', "To'g'ri: immer yangi state yasaydi", ["Xato: mutatsiya store ni buzadi", "Hech qanday o'zgarish bo'lmaydi", "Faqat DevTools o'chiq bo'lsa ishlaydi"], "Draft ustida ishlanadi."),
      ch('Oddiy useReducer reducer ida `state.items.push(x)`?', "Xato: immer yo'q, mutatsiya", ["To'g'ri, React o'zi nusxalaydi", "To'g'ri, agar return qilinmasa", "Faqat massivlar uchun to'g'ri"], "immer faqat RTK ichida."),
      ch('Immer reducer da ham draft ni o\'zgartirib, ham yangi obyekt return qilish?', "Xato: faqat bittasi tanlanadi", ["Ikkalasi birlashtirib yuboriladi", "return e'tiborsiz qoldiriladi", "Mutatsiya e'tiborsiz qoldiriladi"], "Immer xato otadi."),
      order("Redux oqimini tartiblang.", ["UI dispatch qiladi", "Reducer yangi state hisoblaydi", "Store yangilanadi", "Selector orqali komponent render bo'ladi"], "Bir yo'nalishli oqim."),
      ch('Tashqi store ni React ga ulaydigan hook?', 'useSyncExternalStore', ['useImperativeHandle', 'useDeferredValue', 'useLayoutEffect'], "subscribe va getSnapshot oladi."),
      ch('getSnapshot har chaqiruvda yangi obyekt qaytarsa?', "Cheksiz render sikli xatosi chiqadi", ["Render tezroq bajarila boshlaydi", "Obuna avtomatik bekor qilinadi", "Faqat bir marta render bo'ladi"], "Natija barqaror bo'lishi shart."),
      ch('Server dan keladigan mahsulotlar uchun odatda nima afzal?', 'RTK Query yoki TanStack Query', ['Qo\'lda yozilgan global massiv', 'Faqat Context va useState', 'sessionStorage ga yozib o\'qish'], "Kesh va eskirish tayyor."),
      fill("Store dan kerakli qismni tanlaydigan funksiya (inglizcha)?", 'selector', "s => s.items."),
    ],
  });

  /* 21 */
  lesson({
    title: 'React Router',
    intro: "Marshrutlar, Link va NavLink, dinamik parametr, ichma-ich route va Outlet, useNavigate, query parametrlar, himoyalangan sahifa.",
    theory: {
      analogy: { icon: '🧭', title: 'Bino xaritasi', text: "URL — xona manzili. Router manzilga qarab qaysi xonani ochishni hal qiladi, lekin binodan chiqib qayta kirmaysiz (sahifa qayta yuklanmaydi)." },
      sections: [
        { heading: 'Asos', code: { lang: 'jsx', text: "<BrowserRouter>\n  <Routes>\n    <Route path=\"/\" element={<Layout />}>\n      <Route index element={<Home />} />\n      <Route path=\"users/:id\" element={<User />} />\n      <Route path=\"*\" element={<NotFound />} />\n    </Route>\n  </Routes>\n</BrowserRouter>" } },
        { heading: 'Hooklar', table: { head: ['Hook', 'Nima beradi'], rows: [['useParams', "yo'l parametrlari (satr)"], ['useSearchParams', '?q=... ni o\'qish va yozish'], ['useNavigate', "dasturiy o'tish"], ['useLocation', 'joriy manzil va state']] } },
        { heading: 'Muhim jihatlar', bullets: ["`<a href>` sahifani qayta yuklaydi; `<Link to>` — yo'q.", "Ota route `<Outlet />` chizmasa, ichki route ko'rinmaydi.", "`NavLink` faol havolaga `active` klassi beradi.", "`<Navigate to=\"/login\" replace />` — render orqali yo'naltirish.", "BrowserRouter da server har yo'lga index.html qaytarishi kerak."] },
        { callout: { kind: 'warn', text: "Klientdagi himoyalangan route faqat qulaylik: haqiqiy ruxsat serverda tekshiriladi." } },
      ],
      recap: ["Routes eng mos yo'lni tanlaydi.", "Parametrlar satr.", "Layout + Outlet.", "Link, useNavigate — qayta yuklamasdan."],
    },
    defs: [
      ['Client-side routing (klient marshrutlash)', "URL almashganda sahifani serverdan qayta olmay, komponentni almashtirish."],
      ['Dynamic segment (dinamik bo\'lak)', ":id kabi o'zgaruvchi yo'l qismi."],
      ['Outlet (chiqish joyi)', "ota route ichida bola route chiziladigan o'rin."],
      ['Protected route (himoyalangan yo\'l)', "shart bajarilmasa boshqa sahifaga yo'naltiradigan marshrut."],
    ],
    life: [['📍', 'Manzil', "Havolani do'stingizga yuborsangiz, o'sha sahifa ochiladi — holat URL da."], ['🚪', 'Qabulxona', "Ruxsatsiz odam login xonasiga yo'naltiriladi."]],
    practice: [{ title: 'Blog', text: "Ro'yxat, bitta maqola (:id), 404 va umumiy layout yarating." }, { title: 'Filtr URL da', text: "Qidiruv matnini useSearchParams da saqlang." }],
    items: [
      ch('`/users/42` da `useParams().id` ning turi?', 'string', ['number', 'object', 'array'], "URL qismi doim satr."),
      ch('`id === 42` sharti nega ishlamaydi?', "id aslida '42' satri", ["useParams bo'sh qaytadi", "=== URL da ishlamaydi", "id faqat effektda keladi"], "Number(id) qiling."),
      ch('Ichki route ko\'rinmayapti. Eng ehtimoliy sabab?', "Ota elementda <Outlet /> yo'q", ["Link o'rniga NavLink ishlatilgan", "path oxirida / belgisi yo'q", "BrowserRouter ikki marta yozilgan"], "Outlet — bola joyi."),
      ch('`<a href="/about">` va `<Link to="/about">` farqi?', "a sahifani to'liq qayta yuklaydi", ["Link yangi oynada ochadi", "a faqat tashqi saytga ishlaydi", "Farqi faqat ko'rinishida"], "State yo'qoladi."),
      ch('`<Route index element={<Home />} />` qachon chiziladi?', "Aynan ota yo'liga mos kelganda", ["Hech bir yo'l mos kelmaganda", "Har qanday ichki yo'lda", "Faqat /index manzilida"], "Standart bola."),
      ch('Login dan keyin Back bosilganda login ga qaytmasin?', "navigate('/home', { replace: true })", ["navigate('/home', { back: false })", "window.history.go(0) chaqirish", "navigate(-1) chaqirish"], "Tarixdagi yozuv almashtiriladi."),
      ch('Komponent tanasida `navigate("/login")` chaqirish?', "Noto'g'ri: effekt yoki <Navigate> kerak", ["To'g'ri va tavsiya etilgan usul", "Faqat birinchi renderda to'g'ri ishlaydi", "navigate komponentda umuman ishlamaydi"], "Render yon ta'sirsiz."),
      ch('`/search?q=react&page=2` dan `page`?', "params.get('page') → '2'", ["useParams().query.page", "location.page → '2'", "params.page → 2"], "URLSearchParams."),
      ch('Productionda `/users/1` ni yangilasa 404. Sabab?', "Server index.html ga qaytarmayapti", ["Route path noto'g'ri yozilgan", "useParams productionda ishlamaydi", "Link o'rniga a ishlatilgan"], "SPA fallback sozlang."),
      ch('`path="*"` nima uchun?', "Mos kelmagan yo'llar uchun", ["Barcha yo'llarda qo'shimcha", "Bosh sahifa uchun", "Dinamik parametr uchun"], "404 sahifa."),
      fill("Ota route ichida bola route chiziladigan komponent?", 'Outlet', "<Outlet />.", ['outlet', '<Outlet />']),
    ],
  });
};
