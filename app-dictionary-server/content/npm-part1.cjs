// Paket menejerlar, lessons 1-4 (plan topic "npm chuqur"). English terms are followed by their Uzbek translation.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 */
  lesson({
    title: 'npm va package.json',
    intro: "Package manager (paket menejer) nima, registry, package.json maydonlari, dependencies va devDependencies, node_modules.",
    theory: {
      analogy: { icon: '🛒', title: "Xarid ro'yxati va omborxona", text: "package.json — oshxona uchun xarid ro'yxati: nima kerak va qaysi navdan. npm registry — ulgurji omborxona. node_modules — olib kelingan mahsulotlar turgan javon. Do'stingizga javonni ko'tarib yubormaysiz, ro'yxatni berasiz: u o'zi sotib oladi." },
      sections: [
        { heading: 'Package manager nima qiladi', text: "Package manager (paket menejer) — loyiha foydalanadigan tayyor kutubxonalarni yuklab o'rnatadigan, versiyasini kuzatadigan va olib tashlaydigan dastur. npm Node.js bilan birga keladi. Registry (paketlar ombori) — paketlar e'lon qilinadigan server, standart holatda registry.npmjs.org. Bitta paket o'zi ham boshqa paketlarga bog'liq bo'ladi: bunday bilvosita bog'liqlik transitive dependency (o'tuvchi bog'liqlik) deyiladi." },
        { heading: 'package.json maydonlari', table: { head: ['Maydon', 'Vazifasi'], rows: [['name, version', 'Paket nomi va versiyasi; nashr qilishda majburiy'], ['dependencies', "Dastur ishlayotganda kerak paketlar"], ['devDependencies', 'Faqat ishlab chiqishda kerak paketlar (build, test, lint)'], ['scripts', "`npm run` bilan ishga tushadigan buyruqlar"], ['private', "true bo'lsa paketni nashr qilib bo'lmaydi"], ['type', "'module' bo'lsa .js fayllar ES module sifatida o'qiladi"]] } },
        { heading: "O'rnatish va o'chirish", code: { lang: 'bash', text: "npm init -y                  # package.json yaratish\nnpm install axios            # dependencies ga\nnpm install -D vite          # devDependencies ga\nnpm install                  # package.json dagi hammasini o'rnatish\nnpm uninstall axios          # o'chirish\nnpm install --omit=dev       # devDependencies siz o'rnatish" } },
        { heading: 'node_modules haqida', text: "node_modules — o'rnatilgan paketlar papkasi. U juda katta bo'ladi va package.json bilan lock fayldan har doim qayta yaratiladi, shuning uchun Git ga qo'shilmaydi (.gitignore ga yoziladi). Papkani o'chirib `npm install` qilish — xavfsiz amal." },
        { callout: { kind: 'warn', text: "`npm install` qilganda paket o'z o'rnatish skriptlarini (postinstall) ishga tushirishi mumkin. Nomi mashhur paketga o'xshatib qo'yilgan soxta paketlar (typosquatting) bor: nomni o'rnatishdan oldin diqqat bilan tekshiring." } },
      ],
      recap: ["package.json — ro'yxat, node_modules — o'rnatilgan natija.", "dependencies — ishlayotgan dasturga, devDependencies — ishlab chiqishga.", "node_modules Git ga kirmaydi, undan qayta yaratish mumkin.", "Paket nomini tekshirib o'rnating."],
    },
    defs: [
      ['Package (paket)', "package.json ga ega kod papkasi: kutubxona, vosita yoki butun dastur."],
      ['Registry (paketlar ombori)', "paketlar nashr qilinadigan va yuklab olinadigan server. Standarti — npm registry."],
      ['dependencies', "ilova ishlayotganda `import` qilinadigan paketlar ro'yxati."],
      ['devDependencies', "faqat ishlab chiqish va yig'ish paytida kerak paketlar: vite, vitest, eslint, typescript."],
      ['Transitive dependency (o\'tuvchi bog\'liqlik)', "siz o'zingiz so'ramagan, lekin bog'liqligingiz talab qilgani uchun o'rnatilgan paket."],
    ],
    life: [
      ['🍲', 'Retsept', "package.json — retsept: masalliqlar ro'yxati. node_modules — tayyorlab qo'yilgan masalliqlar; retsept bor bo'lsa ularni qayta yig'ish mumkin."],
      ['🧰', 'Usta asboblari', "devDependencies — ustaning asboblari: uy qurishda kerak, lekin tayyor uyda qolib ketmaydi."],
    ],
    practice: [
      { title: 'Yangi loyiha', text: "Bo'sh papkada `npm init -y` qiling, `npm install dayjs` va `npm install -D prettier` bajaring. package.json da ikkalasi qaysi bo'limga tushganini ko'ring." },
      { title: 'node_modules ni qayta yaratish', text: "node_modules papkasini o'chiring va `npm install` qiling. Paketlar qaytganini hamda package.json o'zgarmaganini tekshiring." },
    ],
    items: [
      ch('`npm install -D vitest` dan keyin vitest qayerga yoziladi?', 'devDependencies bo\'limiga', ["dependencies bo'limiga", "scripts ichidagi test kalitiga", "peerDependencies bo'limiga"], "-D (--save-dev) paketni devDependencies ga yozadi."),
      ch('Production serverda `npm install --omit=dev` bajarildi. Kod `import express` va `import vite` qiladi. package.json quyidagicha. Nima bo\'ladi?', "express topiladi, vite topilmaydi", ["Ikkalasi ham topiladi, farqi yo'q", "Ikkalasi ham topilmaydi", "O'rnatish xato bilan to'xtaydi"], "--omit=dev devDependencies ni o'rnatmaydi. Ishlayotgan kodga kerak paket dependencies da turishi shart.", '"dependencies":    { "express": "^5.0.1" },\n"devDependencies": { "vite": "^6.0.3" }'),
      ch('Nega node_modules Git ga qo\'shilmaydi?', "U package.json va lock fayldan qayta yaratiladi", ["Git katta papkalarni umuman saqlay olmaydi", "U har safar parol bilan shifrlanadi", "npm uni commit qilishni texnik jihatdan bloklaydi"], "Natijani emas, uni yaratadigan retseptni saqlash yetarli."),
      ch('Loyihada faqat `express` o\'rnatilgan, lekin node_modules da `debug` va `ms` ham bor. Ular nima?', "express talab qilgan o'tuvchi bog'liqliklar", ["npm ning o'zi ishlashi uchun kerak fayllar", "Xato o'rnatilgan, o'chirish kerak paketlar", "package.json ga avtomatik yozilgan devDependencies"], "express debug ga, debug esa ms ga bog'liq. Ular package.json ga yozilmaydi."),
      ch('`"private": true` nima uchun yoziladi?', "Loyiha tasodifan registry ga nashr bo'lib ketmasligi uchun", ["Kodni boshqa dasturchilar o'qiy olmasligi va ko'chirmasligi uchun", "node_modules ni shifrlab saqlash uchun", "Paketlar faqat xususiy registry dan olinishi uchun"], "private: true bo'lsa `npm publish` rad etadi."),
      ch('Quyidagi buyruqlardan keyin package.json da lodash qayerda turadi?', "Faqat devDependencies da", ["Ikkala bo'limda ham bir vaqtda", "Faqat dependencies da", "Hech qaysi bo'limda qolmaydi"], "Paketni boshqa bo'limga qayta o'rnatsangiz, npm uni ko'chiradi.", 'npm install lodash\nnpm install -D lodash'),
      ch('React kutubxonasi bilan yozilgan saytda qaysi paket `devDependencies` ga to\'g\'ri keladi?', 'eslint', ['react', 'react-dom', 'axios'], "eslint faqat kodni tekshiradi, brauzerda ishlayotgan saytga kerak emas."),
      fill("Bo'sh papkada savollarsiz package.json yaratadigan buyruqni yozing.", 'npm init -y', "-y barcha savollarga standart javob beradi.", ['npm init --yes']),
      fill("dependencies ro'yxatidagi `axios` ni o'chiradigan buyruqni yozing.", 'npm uninstall axios', "uninstall paketni package.json dan ham olib tashlaydi.", ['npm un axios', 'npm remove axios', 'npm rm axios']),
      ch('`npm install axois` (harflar almashgan) buyrug\'i nega xavfli?', "Shu nomli soxta paket bo'lsa, uning skripti ishga tushadi", ["npm xato nomni o'zi tuzatib, paketning eski versiyasini o'rnatadi", "package.json butunlay o'chib ketadi", "node.js qayta o'rnatilishi kerak bo'lib qoladi"], "Typosquatting: mashhur nomga o'xshash zararli paketlar."),
      order("Yangi loyihani boshlash tartibini joylashtiring.", ['npm init -y', 'npm install express', 'echo node_modules > .gitignore', 'git add .'], "Avval package.json, keyin paketlar, commitdan oldin esa .gitignore."),
    ],
  });

  /* 2 */
  lesson({
    title: 'Semver: versiyalar va oraliqlar',
    intro: "Semantic versioning (ma'noli versiyalash): MAJOR.MINOR.PATCH, ^ va ~ belgilari, npm update va npm outdated.",
    theory: {
      analogy: { icon: '📚', title: 'Kitob nashrlari', text: "PATCH — xato harflari tuzatilgan qayta bosma. MINOR — yangi bob qo'shilgan nashr: eski boblar o'z o'rnida. MAJOR — butunlay qayta yozilgan kitob: eski sahifa raqamlariga ishonib bo'lmaydi." },
      sections: [
        { heading: 'MAJOR.MINOR.PATCH', text: "Versiya uch sondan iborat: MAJOR.MINOR.PATCH, masalan 4.17.21. PATCH — orqaga mos xato tuzatish. MINOR — orqaga mos yangi imkoniyat. MAJOR — breaking change (moslikni buzuvchi o'zgarish). Katta son oshganda undan o'ngdagilar nolga tushadi: 1.4.2 → 1.5.0 → 2.0.0." },
        { heading: "Oraliq belgilari", table: { head: ['Yozuv', "Ruxsat etilgan oraliq", "Ma'nosi"], rows: [['^4.17.1', '>=4.17.1 <5.0.0', 'MINOR va PATCH yangilanadi'], ['~4.17.1', '>=4.17.1 <4.18.0', 'faqat PATCH yangilanadi'], ['4.17.1', 'faqat 4.17.1', 'aniq versiya'], ['^0.21.3', '>=0.21.3 <0.22.0', '0.x da MINOR ham buzuvchi hisoblanadi'], ['^0.0.3', 'faqat 0.0.3', 'eng qattiq holat']] } },
        { heading: 'Tekshirish va yangilash', code: { lang: 'bash', text: "npm install lodash@4.17.20   # aniq versiya so'rash\nnpm install -E zod           # ^ siz yozish (--save-exact)\nnpm outdated                 # current / wanted / latest\nnpm update                   # package.json oralig'i ichida yangilash\nnpm install zod@latest       # oraliqdan tashqari, yangi MAJOR\nnpm view react versions      # barcha versiyalar" } },
        { callout: { kind: 'info', text: "`npm outdated` dagi Wanted — package.json oralig'iga mos eng yuqori versiya, Latest — registry dagi eng yangisi. `npm update` faqat Wanted gacha ko'taradi." } },
      ],
      recap: ["PATCH — tuzatish, MINOR — yangi imkoniyat, MAJOR — buzuvchi o'zgarish.", "^ MAJOR ni, ~ MINOR ni qulflaydi.", "0.x versiyalarda ^ ancha qattiq ishlaydi.", "npm update oraliqdan chiqmaydi."],
    },
    defs: [
      ['Semver (ma\'noli versiyalash)', "versiya raqami o'zgarish turini bildiradigan kelishuv: MAJOR.MINOR.PATCH."],
      ['Caret (^)', "eng chapdagi nol bo'lmagan sonni o'zgartirmaydigan versiyalarga ruxsat beradi. npm standart holatda shuni yozadi."],
      ['Tilde (~)', "MINOR ko'rsatilgan bo'lsa faqat PATCH yangilanishiga ruxsat beradi."],
      ['Breaking change (buzuvchi o\'zgarish)', "eski kodni o'zgartirmasdan ishlatib bo'lmaydigan o'zgarish; MAJOR ni oshiradi."],
      ['Prerelease (dastlabki nashr)', "1.0.0-beta.1 kabi sinov versiyasi; oddiy oraliqlar uni avtomatik tanlamaydi."],
    ],
    life: [
      ['📱', 'Telefon yangilanishi', "Kichik xavfsizlik yamog'i — PATCH, yangi funksiyalar — MINOR, butunlay yangi tizim — MAJOR."],
      ['🔌', 'Rozetka', "MAJOR o'zgarishi — rozetka shakli almashishi: eski vilka endi tushmaydi."],
    ],
    practice: [
      { title: 'Oraliqni sinash', text: "`npm install lodash@4.17.20` qiling, package.json da `^4.17.20` yozilganini ko'ring. `npm outdated` va `npm update` natijasini solishtiring." },
      { title: 'Versiyalar tarixi', text: "`npm view react versions` ni ishga tushiring va oxirgi MAJOR qachon almashganini toping." },
    ],
    items: [
      ch('`^4.17.1` oralig\'iga quyidagilardan qaysi versiya MOS EMAS?', '5.0.0', ['4.17.1', '4.18.0', '4.99.9'], "^ MAJOR ni o'zgartirishga ruxsat bermaydi."),
      ch('`~2.3.4` oralig\'idagi eng yuqori mos versiya qaysi? Mavjud: 2.3.4, 2.3.9, 2.4.0, 3.0.0.', '2.3.9', ['2.4.0', '3.0.0', '2.3.4'], "~ faqat PATCH yangilanishiga ruxsat beradi."),
      ch('`^0.21.3` yozilgan. Registry da 0.21.5 va 0.24.0 bor. `npm install` qaysi birini oladi (lock fayl yo\'q)?', '0.21.5', ['0.24.0', '0.21.3', 'Xato beradi'], "0.x da ^ MINOR ni qulflaydi: >=0.21.3 <0.22.0."),
      ch('1.9.9 versiyadagi paketga orqaga mos yangi funksiya qo\'shildi. Keyingi versiya?', '1.10.0', ['2.0.0', '1.9.10', '1.9.9-new'], "Yangi mos imkoniyat MINOR ni oshiradi; 9 dan keyin 10 keladi, bu o'nli kasr emas."),
      ch('Quyidagi natijada `npm update lodash` dan keyin qaysi versiya turadi?', '4.17.21', ['5.1.0', '4.17.15', '4.18.0'], "update faqat Wanted gacha, ya'ni oraliq ichida ko'taradi.", 'Package  Current  Wanted   Latest\nlodash   4.17.15  4.17.21  5.1.0'),
      ch('Qaysi yozuv `1.4.0` va `2.1.0` ni qabul qiladi, lekin `3.0.0` ni qabul qilmaydi?', '^1.0.0 || ^2.0.0', ['>=1.0.0 <=3.0.0', '^1.0.0 && ^2.0.0', '~1.4.0 || ~2.0.0'], "|| — oraliqlardan istalgan biri."),
      ch('`npm install -E zod` natijasi package.json da qanday ko\'rinadi (zod latest 3.24.1)?', '"zod": "3.24.1"', ['"zod": "^3.24.1"', '"zod": "~3.24.1"', '"zod": "latest"'], "-E (--save-exact) belgisiz aniq versiya yozadi."),
      ch('Paket muallifi funksiya nomini o\'zgartirib, uni PATCH sifatida chiqardi. `^2.1.0` ishlatayotgan loyihaga nima bo\'lishi mumkin?', "Yangilanishda kod sinadi, chunki semver — faqat kelishuv", ["npm buzuvchi o'zgarishni aniqlab, yangi paketni o'rnatmaydi", "Eski funksiya nomi avtomatik saqlanib qoladi", "Hech narsa: PATCH texnik jihatdan buza olmaydi"], "npm versiya raqamiga ishonadi; mualliflik xatosini tekshirmaydi."),
      ch('Versiyalarni o\'sish tartibida to\'g\'ri joylashtirgan qator qaysi?', '1.2.9, 1.2.10, 1.10.0', ['1.10.0, 1.2.9, 1.2.10', '1.2.10, 1.2.9, 1.10.0', '1.2.9, 1.10.0, 1.2.10'], "Har bir qism alohida son sifatida solishtiriladi."),
      fill('Qaysi buyruq o\'rnatilgan, kerakli (wanted) va eng yangi (latest) versiyalarni jadval qilib ko\'rsatadi?', 'npm outdated', "outdated faqat ko'rsatadi, hech narsani o'zgartirmaydi."),
      fill('`~1.4.2` oralig\'iga 1.5.0 kiradimi? "ha" yoki "yo\'q" deb yozing.', "yo'q", "~1.4.2 = >=1.4.2 <1.5.0.", ["yoq", "yo‘q"]),
    ],
  });

  /* 3 */
  lesson({
    title: "Lock fayl va node_modules",
    intro: "package-lock.json nima uchun kerak, npm ci va npm install farqi, hoisting va ichma-ich node_modules.",
    theory: {
      analogy: { icon: '🧾', title: 'Aniq chek', text: "package.json — «taxminan shunday un oling» degan ro'yxat. Lock fayl — chek: aynan qaysi firma, qaysi partiya olingani. Chek bo'yicha borsangiz, har kim bir xil non yopadi." },
      sections: [
        { heading: 'package-lock.json', text: "package.json oraliqlarni yozadi, shuning uchun turli kunlarda `^4.17.0` turli versiyani berishi mumkin. Lock fayl o'rnatilgan HAR BIR paketning (o'tuvchilarni ham) aniq versiyasi, manzili va integrity (butunlik) xeshini saqlaydi. U Git ga commit qilinadi: jamoa va CI bir xil daraxtni oladi." },
        { heading: 'npm install va npm ci', table: { head: ['', 'npm install', 'npm ci'], rows: [['Lock fayl', 'kerak bo\'lsa o\'zgartiradi', "hech qachon o'zgartirmaydi"], ['Lock yo\'q bo\'lsa', 'yaratadi', 'xato beradi'], ["package.json bilan mos emas", 'lockni yangilaydi', 'xato beradi'], ['node_modules', 'mavjudini moslaydi', "avval o'chiradi"], ['Qayerda', 'kompyuteringizda', 'CI va deploy da']] } },
        { heading: "Lock bilan o'rnatish qoidasi", text: "Lock dagi versiya package.json oralig'iga mos bo'lsa, `npm install` aynan o'sha versiyani oladi — registry da yangisi chiqqan bo'lsa ham. Versiyani ko'tarish uchun `npm update` yoki `npm install paket@versiya` kerak." },
        { heading: 'Hoisting (yuqoriga ko\'tarish)', code: { lang: 'text', text: "node_modules/\n  express/            # express@4 debug@2.6.9 ni so'raydi\n  debug/              # 2.6.9  — ildizga ko'tarilgan\n  ms/                 # 2.1.3  — siz o'rnatgan\n  debug/node_modules/\n    ms/               # 2.0.0  — to'qnashuv, ichkarida" } },
        { text: "npm paketlarni iloji boricha ildiz node_modules ga chiqaradi (hoisting). Bir nomning ikki xil versiyasi kerak bo'lsa, bittasi so'ragan paket ichiga joylanadi. Hoisting tufayli kod o'zi so'ramagan paketni ham `import` qila oladi — bu phantom dependency (arvoh bog'liqlik) va u keyinchalik kutilmaganda sinadi." },
        { callout: { kind: 'warn', text: "package-lock.json dagi merge konfliktini qo'lda tahrir qilmang: package.json ni hal qiling va `npm install` ga lockni qayta yaratdiring." } },
      ],
      recap: ["Lock fayl aniq daraxtni saqlaydi va commit qilinadi.", "CI da npm ci: tez, takrorlanadigan, lockni o'zgartirmaydi.", "Hoisting paketlarni ildizga chiqaradi, to'qnashuvda ichkariga qo'yadi.", "package.json da yo'q paketni import qilmang."],
    },
    defs: [
      ['Lock file (qulf fayli)', "o'rnatilgan daraxtning aniq versiyalarini yozib boradigan fayl: package-lock.json, pnpm-lock.yaml, yarn.lock, bun.lock."],
      ['npm ci (clean install — toza o\'rnatish)', "node_modules ni o'chirib, faqat lock fayl bo'yicha o'rnatadi."],
      ['Integrity (butunlik) xeshi', "yuklab olingan arxiv o'zgartirilmaganini tekshiradigan nazorat summasi."],
      ['Hoisting (yuqoriga ko\'tarish)', "o'tuvchi bog'liqliklarni ildiz node_modules ga tekislab joylash."],
      ['Phantom dependency (arvoh bog\'liqlik)', "package.json da yo'q, lekin hoisting tufayli import qilinayotgan paket."],
    ],
    life: [
      ['📸', 'Surat', "Lock fayl — javonning surati: ro'yxat bir xil bo'lsa ham, surat aniq qaysi mahsulot turganini ko'rsatadi."],
      ['🏢', 'Umumiy oshxona', "Hoisting — hamma foydalanadigan idish umumiy oshxonaga chiqariladi; boshqacha turi kerak bo'lsa, u xonaning o'zida saqlanadi."],
    ],
    practice: [
      { title: 'npm ci ni sinash', text: "Loyihada `npm install` qiling, so'ng package.json ga qo'lda yangi bog'liqlik yozing va `npm ci` ni ishga tushiring. Xato matnini o'qing." },
      { title: "Daraxtni ko'rish", text: "`npm install express` dan keyin `npm ls --all` va `npm explain ms` buyruqlari bilan ms nega o'rnatilganini toping." },
    ],
    items: [
      ch('Lock faylda `lodash 4.17.20`, package.json da `^4.17.20`. Registry da 4.17.21 chiqdi. Hamkasbingiz `npm install` qildi. Qaysi versiya o\'rnatiladi?', '4.17.20', ['4.17.21', 'Ikkalasi birga', 'Xato chiqadi'], "Lock dagi versiya oraliqqa mos — o'sha olinadi."),
      ch('CI da qaysi buyruq to\'g\'ri tanlov?', 'npm ci', ['npm update', 'npm install --force', 'npm init -y'], "npm ci takrorlanadigan toza o'rnatish beradi va lockni o'zgartirmaydi."),
      ch('package.json ga qo\'lda yangi paket yozildi, lock yangilanmadi. `npm ci` natijasi?', "Mos emaslik haqida xato bilan to'xtaydi", ["Yangi paketni o'rnatib, lockni yangilaydi", "Yangi paketni jimgina o'tkazib yuboradi", "package.json dan o'sha qatorni o'chiradi"], "npm ci package.json va lock mos bo'lishini talab qiladi."),
      ch('package-lock.json bilan nima qilish kerak?', "Git ga commit qilish", [".gitignore ga yozish", "Har deploy dan oldin o'chirish", "Faqat o'z kompyuteringizda saqlash"], "Aks holda har kim boshqacha daraxt oladi."),
      ch('Quyidagi daraxtda ildizdagi koddan `require("ms")` qaysi versiyani oladi?', '2.1.3', ['2.0.0', 'Ikkalasini ham', 'Topilmaydi'], "Node eng yaqin node_modules dan yuqoriga qarab qidiradi; ildiz kodi ildizdagisini topadi.", 'node_modules/ms                      2.1.3\nnode_modules/debug                   2.6.9\nnode_modules/debug/node_modules/ms   2.0.0'),
      ch('O\'sha daraxtda `debug` ichidagi `require("ms")` qaysi versiyani oladi?', '2.0.0', ['2.1.3', 'Eng yangisini', 'Tasodifiy birini'], "Avval o'zining node_modules papkasi tekshiriladi."),
      ch('Kod `import ms from "ms"` qiladi, lekin ms package.json da yo\'q va express orqali kelgan. Xavf nimada?', "express yangilanib ms ni tashlasa, import sinadi", ["Brauzer bunday importni hech qachon bajarmaydi", "npm ms ni har safar o'chirib tashlaydi", "express ishlashdan butunlay to'xtaydi"], "Bu phantom dependency: o'zingiz ishlatadigan paketni o'zingiz yozing."),
      ch('Lock fayldagi `integrity` nima uchun?', "Yuklab olingan arxiv o'zgartirilmaganini tekshirish uchun", ["Paket litsenziyasi va muallifi haqidagi ma'lumotni saqlash uchun", "Paket tezligini o'lchash uchun", "Foydalanuvchi parolini shifrlash uchun"], "Xesh mos kelmasa o'rnatish to'xtaydi."),
      ch('Merge paytida package-lock.json da konflikt chiqdi. Eng to\'g\'ri yo\'l?', "package.json ni hal qilib, npm install bilan lockni qayta yaratish", ["Lock fayldagi konflikt belgilarini qo'lda birma-bir tahrirlab chiqish", "Lock faylni butunlay repodan chiqarib tashlash", "node_modules ni commit qilib qo'yish"], "Lock — avtomatik yaratiladigan fayl."),
      fill('Lock faylni o\'zgartirmaydigan "toza o\'rnatish" buyrug\'ini yozing.', 'npm ci', "ci = clean install.", ['npm clean-install']),
      order('`^` oraliqdagi paketni xavfsiz yangilab jamoaga yetkazish tartibini tuzing.', ['npm outdated', 'npm update', 'npm test', 'git commit -am "Update deps"'], "Avval ko'rish, keyin yangilash, test, so'ng package.json va lockni commit qilish."),
    ],
  });

  /* 4 */
  lesson({
    title: 'npm scripts va npx',
    intro: "scripts bo'limi, pre va post hooklari, argument uzatish, node_modules/.bin va npx.",
    theory: {
      analogy: { icon: '🎛️', title: 'Pultdagi tugmalar', text: "scripts — pultdagi nomlangan tugmalar: «build» bosilsa, orqasida uzun buyruq ishlaydi. Jamoadagi hech kim uzun buyruqni yodlab yurmaydi." },
      sections: [
        { heading: 'scripts qanday ishlaydi', code: { lang: 'json', text: "{\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"prebuild\": \"rimraf dist\",\n    \"build\": \"tsc && vite build\",\n    \"test\": \"vitest run\",\n    \"start\": \"node server.js\"\n  }\n}" } },
        { text: "`npm run build` skriptni ishga tushiradi. `test` va `start` uchun `run` shart emas: `npm test`, `npm start`. Skript ichida node_modules/.bin PATH ga qo'shiladi, shuning uchun lokal o'rnatilgan `vite` ni to'liq yo'lsiz yozish mumkin." },
        { heading: 'pre, post va argumentlar', bullets: ["`prebuild` build dan oldin, `postbuild` keyin avtomatik ishlaydi.", "`a && b` — a muvaffaqiyatli tugasagina b ishlaydi.", "`npm run test -- --watch` — `--` dan keyingilar skriptdagi buyruqqa uzatiladi.", "`npm run` (nomsiz) — mavjud skriptlar ro'yxati."] },
        { heading: 'npx', text: "npx paket ichidagi bajariladigan faylni ishga tushiradi. Avval loyihadagi node_modules/.bin dan qidiradi; topilmasa paketni vaqtincha yuklab olib ishlatadi. Shuning uchun bir martalik vositalar (`npx create-vite`) global o'rnatilmaydi." },
        { callout: { kind: 'warn', text: "Global o'rnatilgan vosita (npm install -g) har kompyuterda boshqa versiyada bo'ladi. Loyiha vositasini devDependencies ga qo'ying va skript orqali chaqiring." } },
      ],
      recap: ["npm run <nom> skriptni ishga tushiradi; test va start da run shart emas.", "pre/post nomli skriptlar avtomatik ishlaydi.", "-- dan keyingi argumentlar skript buyrug'iga o'tadi.", "npx lokal binary ni, bo'lmasa vaqtincha yuklanganini ishlatadi."],
    },
    defs: [
      ['Script (skript)', "package.json da nomlangan terminal buyrug'i."],
      ['Lifecycle hook (hayot davri ilmog\'i)', "pre va post qo'shimchali yoki install paytida avtomatik ishlaydigan skriptlar."],
      ['node_modules/.bin', "o'rnatilgan paketlarning bajariladigan fayllari havolalari turadigan papka."],
      ['npx', "paket buyrug'ini global o'rnatmasdan ishga tushirish vositasi."],
      ['Exit code (chiqish kodi)', "buyruq natijasi raqami: 0 — muvaffaqiyat, boshqasi — xato."],
    ],
    life: [
      ['☕', 'Qahva apparati', "«Kapuchino» tugmasi (script) ortida bir necha qadam bor: oldin suv qizdiriladi (pre), keyin tozalanadi (post)."],
      ['🚕', 'Taksi', "npx — mashina sotib olmasdan bir marta foydalanish; devDependencies — o'z mashinangiz."],
    ],
    practice: [
      { title: 'pre va post', text: "prebuild, build, postbuild skriptlarini `echo` bilan yozing va `npm run build` da ishlash tartibini kuzating." },
      { title: 'npx bilan sinov', text: "`npx cowsay salom` ni ishga tushiring, keyin package.json o'zgarmaganini tekshiring." },
    ],
    items: [
      ch('`npm run build` da nima ketma-ketlikda chiqadi?', 'A, B, C', ['B, A, C', 'Faqat B', 'B, C, A'], "pre skript oldin, post skript keyin ishlaydi.", '"prebuild": "echo A",\n"build": "echo B",\n"postbuild": "echo C"'),
      ch('`tsc` xato bilan tugasa, `"build": "tsc && vite build"` da nima bo\'ladi?', "vite build ishga tushmaydi", ["vite build baribir ishlaydi", "tsc qayta-qayta takrorlanadi", "Skript muvaffaqiyatli deb hisoblanadi"], "&& faqat oldingi buyruq 0 kodi bilan tugasa davom etadi."),
      ch('Qaysi buyruq `run` so\'zisiz ishlaydi?', 'npm test', ['npm build', 'npm dev', 'npm lint'], "test va start — maxsus nomlar."),
      ch('`vitest` ga `--coverage` bayrog\'ini skript orqali uzatishning to\'g\'ri yo\'li?', 'npm run test -- --coverage', ['npm run test --coverage', 'npm run --coverage test', 'npm run test && --coverage'], "-- siz bayroqni npm o'ziniki deb o'qiydi."),
      ch('vite faqat loyihaga o\'rnatilgan. Terminalda `vite` — "command not found", lekin `npm run dev` ishlaydi. Nega?', "Skript ichida node_modules/.bin PATH ga qo'shiladi", ["npm run vite ni har safar global o'rnatadi", "Terminal xavfsizlik uchun vite nomli buyruqni bloklaydi", "Skript brauzer ichida bajariladi"], "Terminalda esa `npx vite` yozish kerak."),
      ch('Loyihada cowsay o\'rnatilmagan. `npx cowsay hi` nima qiladi?', "Vaqtincha yuklab olib ishga tushiradi", ["Kompyuterga doimiy global o'rnatib qo'yadi", "package.json ga dependency yozadi", "Darhol xato berib to'xtaydi"], "npx paketni keshga oladi, package.json o'zgarmaydi."),
      ch('Nega loyiha vositasini `-g` bilan emas, devDependencies ga qo\'yish afzal?', "Hamma bir xil versiyani ishlatadi", ["Global paketlar pullik bo'ladi", "Global paketlar faqat Linux da ishlaydi", "devDependencies saytga tezlik beradi"], "Versiya loyiha bilan birga qayd etiladi."),
      ch('`postinstall` skripti qachon ishlaydi?', "O'rnatish tugagandan keyin avtomatik", ["Faqat `npm run build` muvaffaqiyatli bo'lsa", "Faqat paketni nashr qilishda", "Hech qachon, qo'lda chaqirilmasa"], "Shu sabab notanish paketlar xavfli bo'lishi mumkin."),
      ch('Mavjud bo\'lmagan skript chaqirilsa (`npm run depoy`) nima bo\'ladi?', '"Missing script" xatosi chiqadi', ["npm o'xshash nomni o'zi ishga tushiradi", "Bo'sh skript yaratib qo'yadi", "Jimgina muvaffaqiyatli tugaydi"], "npm nomni aniq talab qiladi."),
      fill('`lint` nomli skriptni ishga tushiradigan buyruqni yozing.', 'npm run lint', "Maxsus bo'lmagan nomlarda run shart.", ['npm run-script lint']),
      fill('Paketni o\'rnatmasdan uning buyrug\'ini ishga tushiradigan vosita nomi (3 harf)?', 'npx', "npx npm bilan birga keladi."),
    ],
  });
};
