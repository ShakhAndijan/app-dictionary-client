// Tailwind, lessons 4-6.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 4 */
  lesson({
    title: 'Holat variantlari',
    intro: "hover, focus-visible, disabled, group, peer, aria va data atributlari bo'yicha stil berish.",
    theory: {
      analogy: { icon: '🚦', title: 'Svetofor', text: "Chorraha o'sha, lekin holatga qarab ko'rinish o'zgaradi. Variant — «shu holatda bo'lsa, mana bu stil» degan shart." },
      sections: [
        { heading: 'Asosiy variantlar', text: "`hover:`, `focus:`, `focus-visible:`, `active:`, `disabled:`, `first:`, `last:`, `odd:`, `even:`, `checked:`, `invalid:`. Prefiks klass oldiga yoziladi: `hover:bg-sky-700`." },
        { heading: 'group — ota holati', text: "Otaga `group`, bolaga `group-hover:`. Bir nechta bo'lsa nomlanadi: `group/item` va `group-hover/item:underline`." },
        { code: { lang: 'html', text: '<a class="group block rounded-lg p-4 hover:bg-sky-500">\n  <h3 class="group-hover:text-white">Loyiha</h3>\n  <span class="opacity-0 group-hover:opacity-100">→</span>\n</a>' } },
        { heading: 'peer — qo\'shni holati', text: "Oldingi qo'shniga `peer`, keyingisiga `peer-invalid:` yoki `peer-checked:`. Muhim: `peer` element DOM da OLDIN turishi kerak, chunki CSS faqat keyingi qo'shnini tanlay oladi." },
        { heading: 'aria va data', text: "`aria-expanded:rotate-180`, `data-[state=open]:block`, `has-checked:ring-2` (ichida belgilangan input bo'lsa)." },
        { callout: { kind: 'warn', text: "`outline-none` qo'yib, o'rniga hech narsa bermasangiz klaviatura foydalanuvchisi fokusni ko'rmaydi. `focus-visible:ring-2` kabi ko'rinadigan belgi qoldiring." } },
      ],
      recap: ["variant:utility.", "group — ota, peer — oldingi qo'shni.", "focus-visible — klaviatura fokusi.", "v4 da hover faqat hover qila oladigan qurilmada."],
    },
    defs: [
      ['Variant (shartli prefiks)', "utility qachon qo'llanishini belgilaydigan old qo'shimcha."],
      ['focus-visible', "brauzer fokus ko'rsatilishi kerak deb hisoblagan holat (odatda klaviatura)."],
    ],
    life: [['🔘', 'Tugma', "Bosilganda botadi, o'chirilgan bo'lsa xira — har holatning o'z ko'rinishi bor."]],
    practice: [{ title: 'Tugma holatlari', text: "hover, active, focus-visible va disabled holatlari bor tugma yasang." }, { title: 'Forma', text: "peer bilan noto'g'ri email ostida xato matnini ko'rsating." }],
    items: [
      ch('Ota ustiga kursor kelganda bola rangi o\'zgarishi uchun?', "Otaga group, bolaga group-hover:", ["Otaga peer, bolaga peer-hover:", "Otaga hover, bolaga child-hover:", "Bolaga hover:, otaga group-active:"], "group ota holatini kuzatadi."),
      ch('`peer-invalid:block` nega ishlamayapti?', "peer input matndan keyin turibdi", ["peer faqat tugmalarda ishlaydi", "invalid holati CSS da mavjud emas", "block o'rniga flex kerak edi"], "Faqat KEYINGI qo'shnini tanlash mumkin.", '<p class="hidden peer-invalid:block">Xato email</p>\n<input type="email" class="peer" />'),
      ch('`focus:` va `focus-visible:` farqi?', "visible odatda klaviatura fokusida ishlaydi", ["visible faqat sichqoncha bosilganda ishlaydi", "focus faqat inputlarda, visible tugmalarda", "Ikkalasi bir xil, faqat nomi boshqacha"], "Sichqoncha bosishda tugmada halqa chiqmaydi."),
      ch('O\'chirilgan tugmani xira va bosib bo\'lmaydigan ko\'rsatish?', 'disabled:opacity-50 disabled:cursor-not-allowed', ['hover:opacity-50 hover:cursor-not-allowed', 'opacity-50:disabled cursor-not-allowed:disabled', 'inactive:opacity-50 inactive:cursor-not-allowed'], "Variant utility oldidan yoziladi."),
      ch('Jadvalda har ikkinchi qatorni bo\'yash uchun?', 'even:bg-slate-100', ['second:bg-slate-100', 'nth-2:bg-slate-100 only', 'peer-2:bg-slate-100'], "even: / odd: variantlari."),
      ch('Tailwind v4 da `hover:` sensorli telefonda qanday tutadi?', "Hover qila olmaydigan qurilmada qo'llanmaydi", ["Har bosilganda doimiy yoqilgan holda qolaveradi", "Avtomatik ravishda active ga aylanadi", "Sahifa yuklanganda yoqilib turadi"], "v4 hover ni @media (hover: hover) ichiga oladi."),
      ch('Ikki ichma-ich group bor. Aynan tashqisiga bog\'lanish uchun?', "group/card va group-hover/card:", ["group-card va group-hover-card:", "group:card va card:hover:", "peer/card va peer-hover/card:"], "Nomlangan group."),
      ch('Akkordeon tugmasi ochilganda strelka burilsin. `aria-expanded="true"` bor. Qaysi klass tugmada?', 'aria-expanded:rotate-180', ['expanded:rotate-180', 'aria-open:expanded:rotate-180', 'hover:aria-expanded'], "aria-* variantlari tayyor."),
      ch('Radix komponenti `data-state="open"` qo\'yadi. Shunga stil berish?', 'data-[state=open]:bg-slate-100', ['state-open:bg-slate-100', 'data-[open=state]:bg-slate-100', 'data(state):open:bg-slate-100'], "data-[...] ixtiyoriy variant."),
      fill('Ichida belgilangan checkbox bo\'lgan label ga stil beruvchi variant: `____-checked:ring-2`', 'has', "has-checked: CSS :has() asosida."),
      order('group-hover ni qurish tartibi', ['Otaga group klassi', 'Bolani tanlash', 'group-hover: prefiksi', 'Kerakli utility'], "Avval kuzatiladigan ota, keyin bola stili."),
    ],
  });

  /* 5 */
  lesson({
    title: 'Dark mode va kaskad qatlamlari',
    intro: "dark: variant, klass orqali almashtirish, @layer qatlamlari va klasslar to'qnashganda kim yutishi.",
    theory: {
      analogy: { icon: '🌗', title: 'Kunduz va tun', text: "Xona o'sha, faqat yoritish almashadi. Har elementga tungi qiymatini oldindan yozib qo'yasiz." },
      sections: [
        { heading: 'dark: varianti', text: "`bg-white dark:bg-slate-900`. Odatiy holatda `dark:` operatsion tizim sozlamasiga (`prefers-color-scheme`) bog'lanadi." },
        { heading: 'Klass bilan boshqarish', text: "Saytda tugma bilan almashtirish kerak bo'lsa variant qayta e'lon qilinadi, keyin `<html class=\"dark\">` qo'shib-olib turiladi." },
        { code: { lang: 'css', text: '@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));' } },
        { heading: 'Qatlamlar', text: "Tailwind CSS ni `theme`, `base`, `components`, `utilities` qatlamlariga joylaydi. Keyingi qatlam specificity (ustunlik) dan qat'i nazar yutadi: shuning uchun utility `.card` kabi komponent klassini bosib o'tadi." },
        { heading: 'To\'qnashuv', text: "`class=\"p-4 p-8\"` da HTML dagi tartib ahamiyatsiz — natijani CSS fayldagi tartib hal qiladi. Bir xususiyatga ikki klass yozmang." },
        { callout: { kind: 'tip', text: "Muhimlik kerak bo'lib qolsa v4 da undov oxirida: `bg-red-500!`. Lekin avval qatlam va tartibni tekshiring." } },
      ],
      recap: ["dark: odatda tizim sozlamasi.", "Tugma bilan: @custom-variant dark.", "utilities qatlami components dan ustun.", "class satridagi tartib hech narsani hal qilmaydi."],
    },
    defs: [
      ['Cascade layer (kaskad qatlami)', "CSS qoidalarini ustuvorlik guruhlariga ajratish (@layer)."],
      ['prefers-color-scheme', "foydalanuvchi tizimida yorug' yoki qorong'i rejim tanlanganini bildiruvchi media so'rov."],
    ],
    life: [['📱', 'Telefon rejimi', "Tizimda tungi rejim yoqilsa ilovalar o'zi qorayadi."]],
    practice: [{ title: 'Tema tugmasi', text: "Tugma bosilganda `dark` klassini almashtirib, tanlovni localStorage da saqlang." }, { title: 'Kontrast', text: "Dark rejimda matn va fon kontrastini DevTools da tekshiring." }],
    items: [
      ch('Sozlama qilinmagan v4 loyihada `dark:` qachon ishlaydi?', "Tizimda qorong'i rejim tanlanganda", ["html tegiga dark klassi qo'shilganda", "Kechki soat oltidan keyin", "body fon rangi qora bo'lganda"], "Odatiy variant prefers-color-scheme."),
      ch('Klass bilan boshqarish uchun CSS ga nima yoziladi?', "@custom-variant dark (...)", ["@theme { --dark: true }", "@utility dark { ... }", "@layer dark { :root.dark {} }"], "dark variantini qayta e'lon qilasiz."),
      ch('`.btn` `@layer components` da `padding: 20px`, elementda `class="btn p-2"`. Padding?', '8px', ['20px', '28px', '0px'], "utilities qatlami components dan keyin."),
      ch('`class="text-red-500 text-blue-500"` da qaysi rang chiqishini nima hal qiladi?', "Yaratilgan CSS dagi qoidalar tartibi", ["class atributidagi yozilish tartibi", "Rang nomining uzunligi va soni", "Brauzer tasodifiy bittasini tanlaydi"], "HTML dagi klass tartibi kaskadga ta'sir qilmaydi."),
      ch('v4 da "important" qanday yoziladi?', 'bg-red-500!', ['bg-red-500:important', 'important-bg-red-500', 'bg-red-500 !!'], "Undov klass oxirida."),
      ch('Nega unlayered (qatlamsiz) oddiy CSS qoida utility ni bosib ketishi mumkin?', "Qatlamsiz stil qatlamlardan ustun turadi", ["Qatlamsiz stil har doim birinchi yuklanadi", "Utility larning specificity si nolga teng", "Tailwind qatlamsiz stilni o'chirib tashlaydi"], "Kaskad qatlami qoidasi."),
      ch('`bg-white dark:bg-slate-900` qorong\'i rejimda nimani beradi?', 'slate-900 fon', ['oq fon', 'ikkalasi aralash', 'shaffof fon'], "Shart bajarilsa dark: ustidan yozadi."),
      ch('Dark rejimda faqat fonni almashtirib, matnni unutsangiz nima bo\'ladi?', "Qora fonda qora matn o'qilmay qoladi", ["Matn rangi o'zi avtomatik teskarilanadi", "Brauzer sahifani umuman chizmay qo'yadi", "Tailwind build paytida xato beradi"], "Har rangning juftini bering."),
      ch('`@layer base` ga odatda nima yoziladi?', "Teglarga umumiy boshlang'ich stillar", ["Tugma va karta kabi tayyor komponentlar", "Eng ustun yordamchi klasslar", "Faqat animatsiya kadrlari"], "h1, a, body kabi."),
      fill('Tailwind ning ustuvorligi eng yuqori qatlami nomi?', 'utilities', "theme < base < components < utilities."),
      order('Qatlamlarni ustuvorligi pastdan yuqoriga tartiblang', ['theme', 'base', 'components', 'utilities'], "Oxirgisi yutadi."),
    ],
  });

  /* 6 */
  lesson({
    title: 'v4: @theme va o\'z utility laringiz',
    intro: "CSS-first sozlash: dizayn tokenlari, @utility, @custom-variant va @apply.",
    theory: {
      analogy: { icon: '🗂️', title: 'Brend kitobi', text: "Kompaniya ranglari bitta hujjatda. O'zgartirsangiz — hamma bosma mahsulot yangilanadi. `@theme` — saytning brend kitobi." },
      sections: [
        { heading: '@theme', text: "v4 da sozlama CSS ning o'zida. `--color-brand: #0ea5e9;` yozsangiz `bg-brand`, `text-brand`, `border-brand` utility lari paydo bo'ladi va `var(--color-brand)` ham ishlaydi." },
        { code: { lang: 'css', text: '@import "tailwindcss";\n\n@theme {\n  --color-brand: #0ea5e9;\n  --radius-card: 1.25rem;\n  --breakpoint-3xl: 120rem;\n}' } },
        { heading: 'Nom maydonlari', text: "`--color-*` ranglar, `--font-*` shriftlar, `--text-*` shrift o'lchami, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--spacing`. `--color-*: initial;` standart ranglarni olib tashlaydi." },
        { heading: '@utility va @custom-variant', text: "`@utility content-auto { content-visibility: auto; }` — o'z utility ngiz, u `md:content-auto`, `hover:content-auto` bilan ham ishlaydi. `@custom-variant theme-neon (&:where(.neon *));` — o'z variantingiz." },
        { heading: '@apply', text: "Utility larni CSS qoidasi ichida ishlatish: `.btn { @apply rounded-lg px-4 py-2; }`. Uchinchi tomon HTML i yoki juda takrorlanadigan holat uchun; hamma joyda ishlatsangiz utility-first ma'nosi yo'qoladi." },
        { callout: { kind: 'warn', text: "`@layer components` dagi oddiy klass bilan `hover:btn` ishlamaydi. Variantlar kerak bo'lsa `@utility` bilan e'lon qiling." } },
      ],
      recap: ["@theme tokeni = utility + CSS o'zgaruvchi.", "Nom maydoni utility turini belgilaydi.", "@utility variantlar bilan ishlaydi.", "@apply ni tejab ishlating."],
    },
    defs: [
      ['@theme', "dizayn tokenlari e'lon qilinadigan v4 direktivasi."],
      ['@utility', "variantlar bilan ishlaydigan yangi utility e'lon qilish."],
      ['@apply', "mavjud utility larni CSS qoidasiga qo'shish."],
    ],
    life: [['🏷️', 'Narx yorlig\'i', "Narx bitta bazada: o'zgarsa hamma yorliq yangilanadi."]],
    practice: [{ title: 'Tema', text: "Brend rangi, shrift va radius tokenlarini e'lon qilib, kartada ishlating." }, { title: 'Utility', text: "`text-balance-title` nomli o'z utility ngizni yarating." }],
    items: [
      ch('`@theme { --color-brand: #f00; }` dan keyin nima paydo bo\'ladi?', "bg-brand, text-brand kabi utility lar", ["Faqat .color-brand nomli bitta klass", "Hech narsa: JS config fayli ham shart bo'ladi", "Faqat brand() degan CSS funksiya"], "color nom maydoni rang utility larini yaratadi."),
      ch('`--radius-card: 20px` qaysi utility ni beradi?', 'rounded-card', ['radius-card', 'border-card', 'card-rounded'], "--radius-* → rounded-*."),
      ch('`--color-*: initial;` nima qiladi?', "Standart ranglarni olib tashlaydi", ["Hamma rangni qora rangga almashtiradi", "Ranglarni qayta tiklab beradi", "Rang utility larini ikkilaydi"], "Nom maydonini tozalaydi."),
      ch('`hover:btn` ishlashi uchun `btn` qanday e\'lon qilinadi?', '@utility btn { ... }', ['@layer components { .btn {} }', '.btn { ... }', '@theme { --btn: 1 }'], "Variantlar faqat utility lar bilan ishlaydi."),
      ch('v4 da `tailwind.config.js` haqida qaysi gap to\'g\'ri?', "Majburiy emas, sozlash CSS da", ["Har bir loyihada majburiy fayl", "Faqat ranglar uchun kerak", "O'rniga HTML ichida yoziladi"], "CSS-first konfiguratsiya."),
      ch('`@apply` ni haddan tashqari ishlatishning zarari?', "Yana nom o'ylash va CSS o'sishi qaytadi", ["Brauzer bunday CSS ni tushunmay qoladi", "Variantlar butun loyihada o'chib qoladi", "Build natijasi umuman hosil bo'lmaydi"], "Takrorni komponent bilan hal qilgan yaxshi."),
      ch('Bu koddan keyin `p-2` necha piksel (root 16px)?', '16px', ['8px', '2px', '32px'], "--spacing 0.5rem = 8px, p-2 = 2 qadam.", '@theme {\n  --spacing: 0.5rem;\n}'),
      ch('Yangi 1920px breakpoint qanday qo\'shiladi?', '--breakpoint-3xl: 120rem', ['--screen-3xl: 1920', '@media 3xl { }', '--container-3xl: 1920px;'], "So'ng 3xl: prefiksi ishlaydi."),
      ch('`@theme` va oddiy `:root` o\'zgaruvchisining farqi?', "@theme tokeni utility ham yaratadi", [":root o'zgaruvchisi tezroq ishlaydi", "@theme faqat dark rejimda ishlaydi", ":root v4 da taqiqlangan hisoblanadi"], ":root qiymati utility yaratmaydi."),
      fill('Mavjud utility larni CSS qoidasi ichida qo\'llaydigan direktiva: `@____`', 'apply', "@apply."),
      order('Brend rangini joriy qilish tartibi', ['@import tailwindcss', '@theme da token', 'HTML da bg-brand', 'Natijani tekshirish'], "Import, token, ishlatish."),
    ],
  });
};
