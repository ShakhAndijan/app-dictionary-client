// Tailwind, lessons 1-3. English terms are followed by their Uzbek translation in parentheses.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 */
  lesson({
    title: 'Utility-first asoslari',
    intro: "Tayyor kichik klasslar bilan stil berish, spacing (masofa) shkalasi, ranglar va ixtiyoriy qiymatlar.",
    theory: {
      analogy: { icon: '🧱', title: "G'isht va tayyor devor", text: "Bootstrap tayyor devor beradi: tez, lekin boshqacha ko'rinish qiyin. Tailwind esa bir xil o'lchamli g'ishtlar beradi: har bir klass bitta ishni qiladi va siz ulardan istalgan shaklni yig'asiz." },
      sections: [
        { heading: 'Bitta klass — bitta vazifa', text: "Utility class (yordamchi klass) odatda bitta CSS e'lonini beradi: `p-4` — padding, `text-center` — text-align, `font-bold` — font-weight. CSS faylga o'tmasdan, nom o'ylamasdan HTML ning o'zida stil berasiz." },
        { code: { lang: 'html', text: '<button class="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white">\n  Saqlash\n</button>' } },
        { heading: 'Spacing shkalasi', text: "Tailwind v4 da bitta qadam 0.25rem, ya'ni odatiy sozlamada 4px. `p-1` = 4px, `p-4` = 16px, `m-6` = 24px, `w-64` = 256px, `size-10` = 40×40px. `px-` chap-o'ng, `py-` tepa-past, `mt-`/`pb-` bitta tomon." },
        { heading: 'Ranglar va shaffoflik', text: "Rang nomi va 50–950 daraja: `bg-red-500`, `text-slate-900`, `border-sky-200`. Shaffoflik slash bilan yoziladi: `bg-black/50`." },
        { heading: 'Ixtiyoriy qiymat', text: "Shkalada yo'q qiymat kerak bo'lsa kvadrat qavs: `w-[137px]`, `top-[3.2rem]`, `grid-cols-[200px_1fr]` (pastki chiziq probel o'rnida). CSS o'zgaruvchisi uchun v4 qisqa shakli: `bg-(--brand)`." },
        { callout: { kind: 'warn', text: "Tailwind manba fayllarni oddiy matn sifatida o'qiydi. `'bg-' + rang + '-500'` kabi yig'ilgan klass CSS ga tushmaydi — to'liq klass nomlarini yozing." } },
      ],
      recap: ["Har utility bitta ishni qiladi.", "1 qadam = 4px (0.25rem).", "Shaffoflik: rang/foiz.", "Klass nomi kodda to'liq ko'rinishi shart."],
    },
    defs: [
      ['Utility class (yordamchi klass)', "bitta aniq stil beradigan kichik CSS klass."],
      ['Design token (dizayn tokeni)', "dizayndagi nomlangan qiymat: rang, masofa, radius."],
      ['Arbitrary value (ixtiyoriy qiymat)', "kvadrat qavs ichida berilgan, shkalada yo'q qiymat."],
    ],
    life: [['🎨', 'Rang kartasi', "Do'konda bo'yoq kodlari bor: har kim o'zicha rang aralashtirmaydi, tayyor shkaladan tanlaydi."]],
    practice: [{ title: 'Loyiha', text: "Vite loyihasiga `tailwindcss` va `@tailwindcss/vite` ni o'rnating, CSS faylga `@import \"tailwindcss\";` yozing." }, { title: 'Karta', text: "Rasm, sarlavha, matn va tugmadan iborat kartani faqat utility klasslar bilan yasang." }],
    items: [
      ch('`p-6` necha piksel padding beradi (odatiy sozlamada)?', '24px', ['6px', '12px', '48px'], "6 × 4px = 24px."),
      ch('`class="px-4 py-2"` bo\'lgan elementning chap padding i necha?', '16px', ['4px', '8px', '32px'], "px — chap va o'ng: 4 × 4px."),
      ch('`size-12` qanday natija beradi?', 'Eni ham, balandligi ham 48px', ["Shrift o'lchami 48px bo'ladi", "Faqat element eni 48px bo'ladi", "Hamma tomonda 48px padding"], "size-* width va height ni birga beradi."),
      ch('Fon qora, 50% shaffof bo\'lsin. Tailwind v4 da qaysi yozuv?', 'bg-black/50', ['bg-black-50', 'bg-opacity-50', 'bg-black opacity'], "bg-opacity-* v4 da yo'q; opacity-50 esa matnni ham xiralashtiradi."),
      ch('Nega bu kodda rang chiqmasligi mumkin?', "To'liq klass nomi manbada yo'q", ["React shablon satrni qabul qilmaydi", "Tailwind faqat HTML faylni o'qiydi", "bg- klassi tugmada ishlamaydi"], "Skaner `bg-${color}-500` ni klass deb tanimaydi.", '<button className={`bg-${color}-500`}>OK</button>'),
      ch('Shkalada yo\'q 137px kenglik kerak. Qaysi biri to\'g\'ri?', 'w-[137px]', ['w-137px', 'w(137px)', 'w-{137px}'], "Ixtiyoriy qiymat kvadrat qavsda."),
      ch('`grid-cols-[200px_1fr]` dagi pastki chiziq nima vazifada?', "Probel o'rnini bosadi", ["Ustunlarni guruhlaydi", "Minus belgisini beradi", "Qiymatni o'chiradi"], "Klass nomida probel bo'lmaydi, shuning uchun _ yoziladi."),
      ch('`class="p-2 px-6"` natijasi?', 'Tepa-past 8px, chap-o\'ng 24px', ["Hamma tomonda 8px padding", "Hamma tomonda 24px padding bo'ladi", "Tepa-past 24px, yonlar 8px"], "px yon tomonlarni qayta yozadi."),
      ch('`class="text-red-500 ..."` ni CSS ga qaysi mexanizm aylantiradi?', "Skaner topgan klasslar uchun generatsiya", ["Brauzer klass nomini o'zi tushunadi", "Butun kutubxona har safar to'liq yuklanadi", "JavaScript har render da style yozadi"], "Faqat ishlatilgan utility lar CSS ga tushadi."),
      fill('Tailwind da `mt-8` yuqoridan necha piksel margin beradi? Faqat son yozing.', '32', "8 × 4 = 32."),
      order('Tailwind v4 ni Vite loyihasiga ulash tartibi', ['Paketlarni o\'rnatish', 'Vite plaginini qo\'shish', 'CSS ga @import yozish', 'Klasslarni ishlatish'], "Avval o'rnatish, keyin ulash, keyin ishlatish."),
    ],
  });

  /* 2 */
  lesson({
    title: 'Flex, grid va o\'lchamlar',
    intro: "Joylashtirish utility lari, gap, kenglik cheklovlari, matnni kesish va ustma-ust qo'yish.",
    theory: {
      analogy: { icon: '📦', title: 'Javonga terish', text: "Flex — bitta qatorga yoki ustunga terish, grid — katakli javon. Tailwind da ularning har bir sozlamasi alohida klass." },
      sections: [
        { heading: 'Flex', text: "`flex`, `flex-col`, `items-center` (ko'ndalang o'q), `justify-between` (asosiy o'q), `gap-4`, `flex-1` (bo'sh joyni egallash), `shrink-0` (siqilmaslik), `flex-wrap`." },
        { code: { lang: 'html', text: '<header class="flex items-center justify-between gap-4 p-4">\n  <a class="shrink-0 font-bold">Logo</a>\n  <input class="min-w-0 flex-1 rounded border px-3" />\n  <button class="shrink-0">Kirish</button>\n</header>' } },
        { heading: 'Grid', text: "`grid grid-cols-3 gap-4`, element uchun `col-span-2`, `row-span-2`. Murakkab ustunlar: `grid-cols-[240px_1fr]`." },
        { heading: "O'lcham va joylashuv", text: "`w-full`, `w-1/2`, `max-w-md` (448px), `mx-auto` (markazga), `min-h-screen`, `aspect-video`. Ustma-ust: ota `relative`, bola `absolute inset-0` yoki `top-2 right-2`." },
        { heading: 'Matnni kesish', text: "`truncate` — bir qatorda `…`, `line-clamp-3` — uch qator. Flex ichida `truncate` ishlashi uchun elementga `min-w-0` kerak, chunki flex bola odatda mazmunidan kichik bo'lmaydi." },
        { callout: { kind: 'tip', text: "Elementlar orasidagi masofa uchun margin emas, ota ustidagi `gap-*` qulayroq: oxirgi elementda ortiqcha bo'shliq qolmaydi." } },
      ],
      recap: ["justify — asosiy o'q, items — ko'ndalang o'q.", "gap otaga yoziladi.", "truncate + flex = min-w-0.", "absolute bola uchun otada relative."],
    },
    defs: [
      ['Main axis (asosiy o\'q)', "flex elementlari teriladigan yo'nalish."],
      ['Gap (oraliq)', "flex yoki grid elementlari orasidagi masofa."],
    ],
    life: [['🪟', 'Vitrina', "Grid — vitrinadagi kataklar: mahsulot qo'shilsa yangi qator ochiladi."]],
    practice: [{ title: 'Navbar', text: "Logo chapda, menyu o'rtada, tugma o'ngda turadigan navbar yasang." }, { title: 'Galereya', text: "6 ta rasmni 3 ustunli gridda, birinchisini 2 ustunga yoyib joylang." }],
    items: [
      ch('`flex items-center justify-between` da `justify-between` nima qiladi?', "Asosiy o'q bo'yicha bo'sh joyni taqsimlaydi", ["Ko'ndalang o'q bo'yicha markazga joylashtiradi", "Elementlar orasiga qat'iy 16px qo'yadi", "Matnni ikki chetga tekislab chiqadi"], "justify — asosiy o'q."),
      ch('`flex flex-col items-center` da `items-center` qaysi yo\'nalishda ta\'sir qiladi?', 'Gorizontal', ['Vertikal', 'Ikkalasida', 'Hech qaysida'], "Ustunda ko'ndalang o'q gorizontal."),
      ch('Flex ichidagi uzun matn `truncate` bo\'lsa ham sig\'may chiqib ketyapti. Nima qo\'shiladi?', 'min-w-0', ['w-auto', 'shrink-0', 'overflow-visible'], "Flex bolaning min-width i odatda auto."),
      ch('Sahifada blokni markazga qo\'yib, kengligini cheklash uchun?', 'mx-auto max-w-md', ['text-center w-full', 'items-center flex-1', 'my-auto min-w-md'], "mx-auto yon margin larni teng bo'ladi."),
      ch('600px li `grid grid-cols-3` (gap yo\'q) da `col-span-2` element eni?', '400px', ['200px', '300px', '600px'], "Har ustun 200px, ikkitasi 400px."),
      ch('Rasm burchagiga belgi qo\'yish uchun to\'g\'ri juftlik?', "Ota relative, belgi absolute", ["Ota absolute, belgi relative", "Ota static, belgi sticky", "Ota fixed, belgi static"], "absolute eng yaqin joylashgan ajdodga bog'lanadi."),
      ch('`flex-1` va `shrink-0` farqi?', "Biri bo'sh joyni oladi, biri siqilmaydi", ["Ikkalasi ham kenglikni 100% ga tenglaydi", "Biri o'sishni, biri joyni almashtiradi", "Ikkalasi faqat grid ichida ishlaydi"], "flex-1 o'sadi/siqiladi, shrink-0 o'lchamini saqlaydi."),
      ch('Quyidagida tugma qayerda turadi?', "Qatorning o'ng chetida", ["Qatorning chap chetida", "Qatorning aniq o'rtasida", "Matnning pastki qatorida"], "justify-between ikki bolani chetlarga suradi.", '<div class="flex justify-between">\n  <h2>Savat</h2>\n  <button>Tozalash</button>\n</div>'),
      ch('Kartalar orasidagi masofa uchun nega `gap-4` `mr-4` dan qulay?', "Oxirgi elementda ortiqcha joy qolmaydi", ["gap brauzerda margindan tezroq chiziladi", "margin flex ichida umuman ishlamaydi", "gap element ichki masofasini oshiradi"], "gap faqat elementlar orasiga tushadi."),
      fill('Uch qatordan keyin matnni "…" bilan kesadigan klass: `line-____-3`', 'clamp', "line-clamp-3."),
      order('Modal fonini va oynasini qurish tartibi', ['fixed inset-0 qatlam', 'flex bilan markazlash', 'Oynaga max-w-md', 'Oyna ichiga mazmun'], "Tashqaridan ichkariga."),
    ],
  });

  /* 3 */
  lesson({
    title: 'Responsive dizayn',
    intro: "Mobile-first (avval mobil) tamoyili, breakpoint (burilish nuqtasi) prefikslari va container query.",
    theory: {
      analogy: { icon: '👕', title: 'Kiyim qatlamlari', text: "Avval asosiy kiyim — u hamma havoda bor. Sovuqlashsa ustiga qatlam qo'shiladi. Tailwind da prefikssiz klass hamma ekranda, `md:` esa kattalashganda ustiga qo'shiladi." },
      sections: [
        { heading: 'Breakpoint lar', text: "`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. `md:flex` — 768px va undan KATTA ekranda. Prefikssiz klass eng kichik ekrandan boshlab ishlaydi." },
        { code: { lang: 'html', text: '<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">…</div>\n<nav class="hidden md:flex">menyu</nav>\n<button class="md:hidden">☰</button>' } },
        { heading: 'Oraliq va teskari variantlar', text: "`max-md:` — 768px dan kichik ekranda. `md:max-lg:` — faqat 768–1023px oralig'ida." },
        { heading: 'Container query', text: "Ekran emas, ota blok kengligiga qarab: otaga `@container`, bolaga `@md:flex-row`. Bir xil karta tor yon panelda ustun, keng joyda qator bo'ladi." },
        { callout: { kind: 'warn', text: "`sm:` — «kichik ekran» degani emas! U 640px dan boshlab ishlaydi. Mobil stil prefikssiz yoziladi." } },
      ],
      recap: ["Prefikssiz = mobil va hamma.", "md: = 768px va katta.", "max-md: = 768px dan kichik.", "@container + @md: = ota kengligi."],
    },
    defs: [
      ['Breakpoint (burilish nuqtasi)', "stil o'zgaradigan ekran kengligi."],
      ['Mobile-first (avval mobil)', "asosiy stil kichik ekran uchun, kattasi ustiga qo'shiladi."],
      ['Container query (konteyner so\'rovi)', "ota element kengligiga qarab stil berish."],
    ],
    life: [['📰', 'Gazeta', "Katta varaqda 4 ustun, telefonda bitta ustun — mazmun o'sha."]],
    practice: [{ title: 'Responsive grid', text: "Mahsulotlar: telefonda 1, planshetda 2, kompyuterda 4 ustun." }, { title: 'Menyu', text: "Katta ekranda menyu, kichikda ☰ tugmasi ko'rinsin." }],
    items: [
      ch('`class="text-sm md:text-lg"` 500px ekranda qaysi o\'lcham?', 'text-sm', ['text-lg', 'text-base', "ikkalasi birga"], "500 < 768, shuning uchun md: ishlamaydi."),
      ch('`md:flex` qaysi kengliklarda ishlaydi?', "768px va undan katta", ["768px va undan kichik", "faqat roppa-rosa 768px", "640px dan 768px gacha"], "min-width so'rovi."),
      ch('`hidden md:block` nimani anglatadi?', "Kichikda yashirin, 768px dan ko'rinadi", ["Kichikda ko'rinadi, 768px dan yashirin", "Hamma ekranda yashirin bo'lib qoladi", "Faqat 768px lik ekranda yashirinadi"], "Avval hidden, keyin md:block ustiga."),
      ch('Faqat telefonda (640px dan kichik) qizil fon berishning to\'g\'ri yozuvi?', 'max-sm:bg-red-500', ['sm:bg-red-500', 'xs:bg-red-500', 'min-sm:bg-red-500'], "sm: 640 dan KATTA uchun; max-sm: kichik uchun."),
      ch('900px ekranda ustunlar soni?', '2', ['1', '3', '4'], "900 ≥ 768, lekin < 1024.", '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">'),
      ch('`md:max-lg:hidden` qachon yashiradi?', "768px dan 1023px gacha", ["768px dan boshlab doim", "1024px dan katta ekranda", "768px dan kichik ekranda"], "Ikki shart birga."),
      ch('Karta yon panelda ham, keng sahifada ham o\'ziga mos tursin. Nima ishlatiladi?', "@container va @md: variantlari", ["md: va lg: ekran breakpoint lari", "max-md: bilan hidden klassi", "w-screen va overflow-hidden"], "Ekran emas, ota kengligi muhim."),
      ch('Nega `sm:text-center` telefonda matnni markazlamaydi?', "sm: 640px dan boshlab ishlaydi", ["sm: faqat flex ichida ishlaydi", "text-center uchun md: majburiy", "Telefonda prefikslar o'chiriladi"], "Mobil uchun prefikssiz yozing."),
      ch('Qaysi tartib mobile-first ga mos?', 'w-full lg:w-1/3', ['w-1/3 max-lg:w-full', 'lg:w-full w-1/3', 'sm:w-full lg:w-1/3'], "Avval mobil qiymat, keyin kattasi."),
      fill('`lg:` breakpoint i necha pikseldan boshlanadi? Faqat son.', '1024', "lg = 64rem = 1024px."),
      order('Breakpoint larni kichigidan kattasiga tartiblang', ['sm', 'md', 'lg', 'xl', '2xl'], "640, 768, 1024, 1280, 1536."),
    ],
  });
};
