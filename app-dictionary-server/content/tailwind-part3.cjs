// Tailwind and libraries, lessons 7-9.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 7 */
  lesson({
    title: 'clsx, tailwind-merge va variantlar',
    intro: "Shartli klasslar, to'qnashuvni hal qilish, cn yordamchisi va komponent variantlari.",
    theory: {
      analogy: { icon: '🧾', title: 'Buyurtma varag\'i', text: "Ofitsiant avval hamma istakni yozadi, keyin bir-biriga zid bo'lsa oxirgisini oladi. clsx yozadi, tailwind-merge ziddiyatni hal qiladi." },
      sections: [
        { heading: 'clsx', text: "Shartli klasslarni birlashtiradi: matn, massiv va obyekt qabul qiladi, yolg'on (falsy) qiymatlarni tashlaydi." },
        { code: { lang: 'js', text: "clsx('btn', active && 'btn-on', { 'opacity-50': disabled });\n// active=false, disabled=true  →  'btn opacity-50'" } },
        { heading: 'tailwind-merge', text: "`twMerge('px-4 py-2 bg-blue-500', 'bg-red-500 p-6')` → `'bg-red-500 p-6'`: bir xususiyatga tegishli eski klasslarni olib tashlab, keyingisini qoldiradi. clsx bunday qilmaydi." },
        { heading: 'cn', text: "Ko'p loyihada ikkisi birlashtiriladi: `const cn = (...x) => twMerge(clsx(x));`. Komponent o'z klasslarini yozadi, tashqaridan kelgan `className` ularni bosib o'ta oladi." },
        { heading: 'Variantlar (cva)', text: "class-variance-authority tugmaning `variant` va `size` kombinatsiyalarini bitta joyda tasvirlaydi: asosiy klasslar, variantlar jadvali va standart qiymatlar." },
        { callout: { kind: 'warn', text: "`className` ni birlashtirishda tartib muhim: tashqi klass OXIRIDA bo'lsin, aks holda u komponent klasslarini yenga olmaydi." } },
      ],
      recap: ["clsx — shartli birlashtirish.", "tailwind-merge — to'qnashuvni hal qilish.", "cn = twMerge(clsx()).", "Tashqi className oxirida."],
    },
    defs: [
      ['Falsy (yolg\'on qiymat)', "false, 0, '', null, undefined, NaN."],
      ['Variant (komponent turi)', "komponentning oldindan belgilangan ko'rinishi: primary, danger."],
    ],
    life: [['☕', 'Kofe buyurtmasi', "«Shakarli… yo'q, shakarsiz» — oxirgi gap hisobga olinadi."]],
    practice: [{ title: 'cn', text: "Loyihaga `clsx` va `tailwind-merge` o'rnatib, `cn` yordamchisini yozing." }, { title: 'Button', text: "variant (primary/outline) va size (sm/lg) li tugma komponenti yasang." }],
    items: [
      ch("`clsx('a', false && 'b', { c: true, d: 0 })` natijasi?", "'a c'", ["'a b c'", "'a c d'", "'a false c'"], "false va 0 tashlanadi."),
      ch("`twMerge('p-4', 'p-2')` natijasi?", "'p-2'", ["'p-4'", "'p-4 p-2'", "'p-6'"], "Keyingi klass yutadi."),
      ch("`twMerge('px-2 py-1', 'p-3')` natijasi?", "'p-3'", ["'px-2 py-1 p-3'", "'px-2 p-3'", "'px-2 py-1'"], "p- ikkala o'qni ham qamraydi."),
      ch("`twMerge('p-3', 'px-5')` natijasi?", "'p-3 px-5'", ["'px-5'", "'p-3'", "'px-5 p-3'"], "px faqat yonlarni yozadi, p-3 tepa-past uchun kerak."),
      ch("Nega faqat `clsx` yetarli emas?", "Zid klasslarning ikkalasini qoldiradi", ["Shartli klasslarni qo'sha olmaydi", "Faqat bitta argument qabul qiladi", "Tailwind klasslarini o'chirib yuboradi"], "Natijani CSS tartibi hal qilib qo'yadi."),
      ch('Tashqi `className` komponent stilini yenga olmayapti. Sababi?', "cn ga className birinchi berilgan", ["className prop nomi band qilingan", "twMerge faqat ranglarni birlashtiradi", "React className ni e'tiborsiz qoldiradi"], "Oxirgi argument yutadi.", "<button className={cn(className, 'bg-blue-500')} />"),
      ch("`twMerge('text-sm text-red-500')` natijasi?", "'text-sm text-red-500'", ["'text-red-500'", "'text-sm text-red-500 p-0'", "''"], "Biri o'lcham, biri rang — ziddiyat yo'q."),
      ch("`twMerge('bg-red-500 hover:bg-red-600', 'bg-blue-500')` natijasi?", "'hover:bg-red-600 bg-blue-500'", ["'bg-blue-500'", "'bg-red-500 hover:bg-blue-500'", "'hover:bg-blue-500'"], "hover varianti alohida holat."),
      ch('cva nimani hal qiladi?', "Variant va o'lcham klasslarini bir joyda", ["CSS faylni siqib, hajmini kichraytirib beradi", "Klass nomlarini xeshlab yashiradi", "Komponentni serverda chizib beradi"], "Variantlar jadvali."),
      fill("`clsx` va `twMerge` ni birlashtiruvchi yordamchining odatiy nomi?", 'cn', "cn()."),
      order('cn ishlash tartibi', ['Argumentlar keladi', 'clsx birlashtiradi', 'twMerge ziddiyatni yechadi', 'Satr qaytadi'], "Avval yig'ish, keyin tozalash."),
    ],
  });

  /* 8 */
  lesson({
    title: 'shadcn/ui va Radix',
    intro: "Headless (stilsiz) komponentlar, accessibility (qulaylik), shadcn tuzilishi va moslashtirish.",
    theory: {
      analogy: { icon: '🚗', title: 'Dvigatel va kuzov', text: "Radix — tayyor dvigatel va tormoz: klaviatura, fokus, ARIA. Ko'rinishi — kuzov — o'zingizniki." },
      sections: [
        { heading: 'Headless komponent', text: "Radix Primitives xatti-harakat va accessibility ni beradi, deyarli stil bermaydi: Dialog fokusni ichida ushlaydi, Esc bilan yopiladi, yopilganda fokusni qaytaradi." },
        { heading: 'shadcn/ui nima', text: "Bu npm dan o'rnatiladigan komponent kutubxonasi emas. CLI komponent KODINI loyihangizga ko'chiradi (`npx shadcn@latest add button`), keyin u sizning faylingiz — xohlagancha o'zgartirasiz. Ichida Radix, Tailwind, cva va cn." },
        { code: { lang: 'jsx', text: '<Dialog.Root open={open} onOpenChange={setOpen}>\n  <Dialog.Trigger asChild><Button>O\'chirish</Button></Dialog.Trigger>\n  <Dialog.Portal>\n    <Dialog.Overlay />\n    <Dialog.Content>\n      <Dialog.Title>Tasdiqlang</Dialog.Title>\n    </Dialog.Content>\n  </Dialog.Portal>\n</Dialog.Root>' } },
        { heading: 'asChild', text: "`asChild` komponent o'z elementini chizmay, xulqini bolaga beradi. Aks holda tugma ichida tugma kabi noto'g'ri HTML chiqadi." },
        { heading: 'Moslashtirish', text: "Ranglar CSS o'zgaruvchilarida: `--background`, `--foreground`, `--primary`. Holatlar `data-state` atributi orqali stillanadi." },
        { callout: { kind: 'warn', text: "Dialog.Title ni olib tashlamang: ekran o'quvchi oyna nima haqidaligini shundan biladi. Ko'rinmasin desangiz `sr-only` bering." } },
      ],
      recap: ["Radix — xulq, siz — ko'rinish.", "shadcn kodi loyihangizda yashaydi.", "asChild — o'ramsiz.", "data-state orqali stil."],
    },
    defs: [
      ['Headless (stilsiz)', "xulq va qulaylikni berib, ko'rinishni foydalanuvchiga qoldiradigan komponent."],
      ['Focus trap (fokus tutqichi)', "oyna ochiq paytida Tab fokusni oynadan chiqarmasligi."],
      ['Portal', "elementni DOM daraxtining boshqa joyiga (odatda body) chizish."],
    ],
    life: [['🏠', 'Tayyor karkas', "Uy karkasi va simlari tayyor, devor rangini o'zingiz tanlaysiz."]],
    practice: [{ title: 'shadcn', text: "`npx shadcn@latest init`, so'ng `add button dialog` va tugma rangini o'zgartiring." }, { title: 'Klaviatura', text: "Dialogni faqat klaviatura bilan ochib-yopib ko'ring." }],
    items: [
      ch('shadcn/ui ni boshqa UI kutubxonalardan ajratadigan jihat?', "Komponent kodi loyihangizga ko'chiriladi", ["Faqat CDN orqali sahifaga ulanadi", "Komponent stillarini o'zgartirib bo'lmaydi", "React siz toza HTML da ishlaydi"], "Kod sizniki bo'lib qoladi."),
      ch('Radix Primitives asosan nimani beradi?', "Xulq, klaviatura va ARIA qo'llovi", ["Tayyor rang va tipografiya to'plami", "Server bilan ma'lumot almashinuvi", "Rasm va ikonka kutubxonasi"], "Headless."),
      ch('`asChild` siz `Dialog.Trigger` ichiga `<Button>` qo\'yilsa nima bo\'ladi?', "button ichida button: noto'g'ri HTML", ["Tugma umuman ekranda ko'rinmaydi", "Dialog sahifa ochilishi bilan chiqadi", "Button props lari hammasi yo'qoladi"], "Trigger o'zi ham button chizadi."),
      ch('Modal Dialog ochiq. Oxirgi elementda Tab bosilsa fokus?', "Oynaning birinchi elementiga qaytadi", ["Sahifadagi keyingi havolaga o'tadi", "Brauzer manzil qatoriga o'tib ketadi", "Dialog yopilib, fokus yo'qoladi"], "Focus trap."),
      ch('Dialog yopilgach fokus qayerga borishi kerak?', "Uni ochgan tugmaga", ["Sahifaning boshiga", "body elementiga", "Birinchi inputga"], "Klaviatura foydalanuvchisi joyini yo'qotmaydi."),
      ch('Dialog tashqaridan boshqarilishi uchun qaysi juftlik?', 'open va onOpenChange', ['value va onChange', 'visible va onDismiss', 'state va setState'], "Controlled rejim."),
      ch('Nega Dialog mazmuni Portal orqali chiziladi?', "Ota overflow va z-index ta'sirisiz chiqishi", ["Mazmun serverda tezroq tayyor bo'lishi", "React qayta chizishni butunlay to'xtatib qo'yishi", "CSS fayl hajmini sezilarli kamaytirish"], "body ga chiqariladi."),
      ch('Sarlavha ko\'rinmasin, lekin ekran o\'quvchi o\'qisin. To\'g\'risi?', "Title ni qoldirib, sr-only berish", ["Title ni butunlay o'chirib tashlash", "Title ga display none stilini berish", "Title ga aria-hidden qo'shib qo'yish"], "display:none ekran o'quvchidan ham yashiradi."),
      ch('shadcn tugmasiga yangi `variant="success"` qanday qo\'shiladi?', "button faylidagi cva variantlariga yozib", ["node_modules ichidagi paket kodini tahrirlab", "Kutubxona muallifidan so'rov yuborib", "HTML ga yangi atribut qo'shib qo'yib"], "Kod loyihada."),
      fill('Ochiq/yopiq holatni bildiruvchi Radix atributi: `data-____`', 'state', "data-state=\"open\"."),
      order('Dialog qismlarini tashqaridan ichkariga tartiblang', ['Root', 'Portal', 'Content', 'Title'], "Root hammasini o'raydi."),
    ],
  });

  /* 9 */
  lesson({
    title: 'CSS Modules va CSS-in-JS',
    intro: "Uch yondashuv farqi: lokal klasslar, ish vaqtidagi (runtime) narx va qachon qaysi biri.",
    theory: {
      analogy: { icon: '🏷️', title: 'Familiya', text: "Sinfda ikki Ali bo'lsa familiya ajratadi. CSS Modules klass nomiga «familiya» qo'shib, to'qnashuvni yo'q qiladi." },
      sections: [
        { heading: 'CSS Modules', text: "`Button.module.css` dagi klass nomlari build paytida noyob qilinadi. JS da obyekt sifatida olinadi: `styles.primary`, `styles['btn-big']`. Ish vaqtida qo'shimcha JavaScript yo'q." },
        { code: { lang: 'jsx', text: "import styles from './Button.module.css';\n\nexport const Button = ({ big }) => (\n  <button className={clsx(styles.button, big && styles.big)}>OK</button>\n);" } },
        { heading: ':global va composes', text: "`:global(.modal-open)` nomni o'zgartirmaydi. `composes: base;` bir klass boshqasining stillarini qo'shib oladi." },
        { heading: 'CSS-in-JS', text: "styled-components va Emotion stilni JavaScript ichida yozdiradi, props ga qarab dinamik. Klassik variantida CSS brauzerda ish vaqtida yaratiladi: qo'shimcha JS yuki va React Server Components bilan cheklov." },
        { heading: 'Zero-runtime', text: "vanilla-extract, Linaria, Panda kabi vositalar CSS ni build paytida chiqaradi: yozish JS da, brauzerda oddiy CSS." },
        { callout: { kind: 'tip', text: "Tez-tez o'zgaradigan qiymat (masalan, progress eni) uchun CSS o'zgaruvchisi yoki style atributi yetarli — har qiymatga yangi klass yaratmang." } },
      ],
      recap: ["Modules — lokal nom, runtime yo'q.", "Runtime CSS-in-JS — dinamik, lekin narxi bor.", "Zero-runtime — build paytida CSS.", "Dinamik son uchun CSS o'zgaruvchi."],
    },
    defs: [
      ['Scoped styles (cheklangan stillar)', "faqat o'z komponentiga ta'sir qiladigan stillar."],
      ['Runtime cost (ish vaqti narxi)', "brauzerda ishlash paytida sarflanadigan JS va hisoblash."],
    ],
    life: [['📮', 'Pochta indeksi', "Bir xil ko'cha nomi ikki shaharda bo'lsa ham indeks ularni adashtirmaydi."]],
    practice: [{ title: 'Uch usul', text: "Bitta tugmani CSS Modules, Tailwind va styled-components bilan yozib solishtiring." }, { title: 'Bundle', text: "Har variantda build hajmini taqqoslang." }],
    items: [
      ch('Ikki `.module.css` faylda `.title` bor. Nima bo\'ladi?', "Nomlar har xil bo'ladi, to'qnashmaydi", ["Keyin yuklangani birinchisini bosadi", "Build paytida xatolik chiqib to'xtaydi", "Ikkala stil bitta klassga qo'shiladi"], "Nomlar noyob qilinadi."),
      ch('`.btn-big` klassini JS da qanday olasiz?', "styles['btn-big']", ['styles.btn-big', 'styles.btn_big', "styles('btn-big')"], "Defis bilan nuqta yozuvi ayirish bo'lib qoladi."),
      ch('Mavjud bo\'lmagan `styles.primry` (imlo xatosi) natijasi?', "undefined: xato chiqmaydi, stil yo'q", ["Build darhol to'xtab xato ko'rsatadi", "Klass nomi o'zi to'g'rilanib ketadi", "Brauzer konsoliga TypeError otiladi"], "Oddiy obyekt xossasi."),
      ch('`:global(.open)` nima uchun kerak?', "Nomni o'zgartirmasdan qoldirish uchun", ["Stilni boshqa fayllardan yashirish", "Klassni build natijasidan chiqarib tashlash", "Stilni faqat serverda qo'llash uchun"], "Tashqi kutubxona klassi uchun."),
      ch('Klassik runtime CSS-in-JS ning asosiy narxi?', "Brauzerda CSS yaratish va qo'shimcha JS", ["CSS xususiyatlarining yarmi ishlamasligi", "Har sahifa uchun alohida server kerakligi", "Media so'rovlarni yozib bo'lmasligi"], "Ish vaqtida hisoblanadi."),
      ch('Progress chizig\'i eni sekundiga 60 marta o\'zgaradi. Eng ma\'qul usul?', "style orqali CSS o'zgaruvchi berish", ["Har qiymat uchun yangi styled klass", "100 ta tayyor CSS klass yozib chiqish", "Har safar yangi style tegi qo'shish"], "Bitta qoida, o'zgaruvchi almashadi."),
      ch('React Server Component da qaysi usul muammosiz ishlaydi?', 'CSS Modules', ['useState li styled-components', 'ThemeProvider li Emotion', "ish vaqtida inject qiladigan kutubxona"], "Runtime va context talab qilmaydi."),
      ch('Zero-runtime kutubxonaning ma\'nosi?', "CSS build paytida tayyor bo'ladi", ["Kutubxona hech qanday CSS bermaydi", "Stillar faqat brauzerda yaratiladi", "Loyihada JavaScript ishlatilmaydi"], "vanilla-extract kabi."),
      ch('`composes: base;` nima qiladi?', "base klassini ham elementga qo'shadi", ["base qoidalarini o'chirib tashlaydi", "base faylini global qilib qo'yadi", "base nomini boshqa nomga almashtirib qo'yadi"], "styles.x ikkita nomni qaytaradi."),
      fill('CSS Modules fayli nomi: `Card.____.css`', 'module', "Card.module.css."),
      order('CSS Modules bilan ishlash tartibi', ['.module.css yozish', 'JS ga import qilish', 'styles.nom berish', 'Build noyob nom qiladi'], "Yozish, import, ishlatish, build."),
    ],
  });
};
