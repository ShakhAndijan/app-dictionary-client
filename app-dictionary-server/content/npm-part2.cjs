// Paket menejerlar, lessons 5-7: peer dependencies and local packages; pnpm, yarn, bun; workspaces.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 5 */
  lesson({
    title: 'Peer dependencies va lokal paket',
    intro: "peerDependencies nima uchun kerak, ERESOLVE xatosi, lokal paket yaratish: file:, npm link va npm publish.",
    theory: {
      analogy: { icon: '🔌', title: 'Qurilma va rozetka', text: "Plagin — changyutgich nasadkasi. U o'zi bilan changyutgich olib kelmaydi, «menga shu modeldagi changyutgich kerak» deydi. Bu — peer dependency." },
      sections: [
        { heading: 'peerDependencies', text: "Peer dependency (sherik bog'liqlik) — paket o'zi o'rnatmaydigan, balki uni ishlatadigan loyihada bo'lishini talab qiladigan paket. React komponent kutubxonasi react ni peerDependencies ga yozadi: aks holda ilovada ikki nusxa React paydo bo'lib, hooklar sinadi." },
        { code: { lang: 'json', text: "{\n  \"name\": \"my-ui-kit\",\n  \"version\": \"1.0.0\",\n  \"peerDependencies\": { \"react\": \"^18.0.0 || ^19.0.0\" },\n  \"devDependencies\": { \"react\": \"^19.0.0\" }\n}" } },
        { heading: 'ERESOLVE', text: "npm 7 dan boshlab yetishmayotgan peer avtomatik o'rnatiladi. Loyihadagi versiya talabga mos kelmasa, npm `ERESOLVE` xatosi bilan to'xtaydi. To'g'ri yechim — mos versiyani tanlash. `--legacy-peer-deps` tekshiruvni o'tkazib yuboradi: xato yo'qoladi, lekin nomuvofiqlik qoladi." },
        { heading: 'Lokal paketni ulash', table: { head: ['Usul', 'Qanday', "Xususiyati"], rows: [['file:', 'npm install ../my-utils', "package.json ga file:../my-utils yoziladi"], ['npm link', "paketda: npm link; loyihada: npm link my-utils", "package.json o'zgarmaydi, vaqtinchalik"], ['workspaces', 'monorepo ichida', "doimiy va jamoaviy yechim"]] } },
        { heading: 'Nashr qilish', code: { lang: 'bash', text: "npm login\nnpm version patch          # 1.0.0 -> 1.0.1\nnpm publish --dry-run      # nima ketishini ko'rish\nnpm publish                # nashr\nnpm publish --access=public  # @scope/nom uchun" } },
        { callout: { kind: 'warn', text: "Nashr qilingan versiyani qayta yozib bo'lmaydi: har nashr yangi versiya talab qiladi. Tarball ichiga .env tushmasligini `files` maydoni va dry-run bilan tekshiring." } },
      ],
      recap: ["Peer — loyihaning o'zi ta'minlaydigan bog'liqlik.", "ERESOLVE ni versiya bilan hal qiling, bayroq bilan yashirmang.", "Lokal paket: file: yoki npm link.", "Har nashrga yangi versiya."],
    },
    defs: [
      ['peerDependencies', "paket birga ishlaydigan, lekin ishlatuvchi loyiha o'rnatishi kerak bo'lgan paketlar."],
      ['ERESOLVE', "npm bog'liqliklar daraxtini ziddiyatsiz tuza olmaganini bildiruvchi xato."],
      ['npm link', "lokal paketga vaqtinchalik symlink (ramziy havola) orqali ulanish."],
      ['Scope (nom maydoni)', "@jamoa/paket ko'rinishidagi nomning @jamoa qismi."],
      ['Publish (nashr qilish)', "paketni registry ga yuklash; versiya takrorlanmasligi shart."],
    ],
    life: [
      ['🎮', "O'yin va konsol", "O'yin diski konsolni o'zi bilan olib kelmaydi, «shu avlod konsoli kerak» deydi — peer."],
      ['🧪', 'Namuna', "npm link — yangi detalni zavodga yubormasdan o'z mashinangizda sinab ko'rish."],
    ],
    practice: [
      { title: 'Lokal paket yaratib ulash', text: "`my-utils` papkasida paket yarating (name, version, index.js), asosiy loyihada `npm install ./my-utils` qiling va funksiyani import qiling." },
      { title: 'Tarballni tekshirish', text: "Paket papkasida `npm publish --dry-run` yoki `npm pack` qiling va qaysi fayllar kirayotganini ko'ring." },
    ],
    items: [
      ch('Nega React plagini `react` ni dependencies emas, peerDependencies ga yozadi?', "Ilovada React ning ikkinchi nusxasi paydo bo'lmasin", ["react bepul tarqatilmaydigan paket bo'lgani uchun", "Plagin React siz ham to'liq ishlay olishi uchun", "dependencies ga react yozish taqiqlangani uchun"], "Ikki nusxa React hooklar va context ni sindiradi."),
      ch('Loyihada react 19.0.0. `npm install react-datepicker-lite` (peer: react ^18.0.0). npm 7+ da natija?', 'ERESOLVE xatosi', ["react 18 ga o'zi tushiriladi", "Ikkita react o'rnatiladi", "Paket jimgina o'rnatiladi"], "Peer talabi loyihadagi versiyaga zid."),
      ch('`--legacy-peer-deps` aslida nima qiladi?', "Peer ziddiyatini tekshirmay o'rnatadi", ["Ziddiyatli paketni kodini tuzatadi", "Eski npm versiyasini qayta o'rnatadi", "react ni mos versiyaga almashtiradi"], "Muammo yo'qolmaydi, faqat xabar o'chadi."),
      ch('`npm install ../my-utils` dan keyin package.json da nima paydo bo\'ladi?', '"my-utils": "file:../my-utils"', ['"my-utils": "link:^1.0.0 ../utils"', '"../my-utils": "latest"', "Hech narsa yozilmaydi"], "Lokal papka file: protokoli bilan yoziladi."),
      ch('`file:` bilan o\'rnatishdan `npm link` ning asosiy farqi?', "link package.json ni o'zgartirmaydi", ["link paketni registry ga nashr qiladi", "link kodni nusxalab, aloqani uzadi", "link faqat devDependencies bilan ishlaydi"], "Shuning uchun u vaqtinchalik sinov uchun qulay, lekin jamoaga ko'rinmaydi."),
      ch('npm link ning to\'g\'ri tartibi qaysi?', "Avval paketda npm link, keyin loyihada npm link my-utils", ["Avval loyihada npm link my-utils, keyin paketda npm link", "Faqat loyihada npm install -g my-utils", "Ikkala papkada ham npm publish"], "Birinchi buyruq global havola yaratadi, ikkinchisi uni ulaydi."),
      ch('`1.0.0` nashr qilingan. Kodda xato tuzatib yana `npm publish` qildingiz. Natija?', "403 xatosi: bu versiya allaqachon bor", ["Eski 1.0.0 ustidan jimgina yozib ketiladi", "npm versiyani o'zi 1.0.1 qiladi", "Ikkita 1.0.0 yonma-yon turadi"], "Avval `npm version patch`."),
      ch('`2.4.7` da `npm version minor` bajarildi. Yangi versiya?', '2.5.0', ['2.5.7', '2.4.8', '3.0.0'], "MINOR oshsa, PATCH nolga tushadi."),
      ch('`@ali/utils` nomli paketni hamma uchun ochiq nashr qilish buyrug\'i?', 'npm publish --access=public', ['npm publish --private=false', 'npm publish -g', 'npm publish --scope=all'], "Scope li paketlar standart holatda xususiy hisoblanadi."),
      ch('Kutubxona yozayotganda react ham peer, ham devDependencies da turibdi. Nega?', "devDependencies — kutubxonaning o'zini test qilish uchun", ["Ikki nusxa React o'rnatilsa, kutubxona tezroq ishlagani uchun", "npm bir bo'limni e'tiborsiz qoldirgani uchun", "Bu xato: birini albatta o'chirish kerak"], "Peer ishlatuvchiga talab, dev esa ishlab chiqish uchun o'rnatish."),
      fill("Nashrdan oldin, hech narsa yuklamasdan natijani ko'rish bayrog'ini yozing (-- bilan).", '--dry-run', "Dry run — quruq mashq."),
    ],
  });

  /* 6 */
  lesson({
    title: 'pnpm, Yarn va Bun',
    intro: "Uch muqobil menejer: buyruqlari, lock fayllari, pnpm ning store va symlink tuzilishi, Yarn PnP, Bun tezligi.",
    theory: {
      analogy: { icon: '📚', title: 'Shahar kutubxonasi', text: "npm — har oilaga o'z kitoblarini sotib olib uyga qo'yish. pnpm — bitta shahar kutubxonasi va har uyda «kitob falon javonda» degan yo'llanma: kitob bir marta saqlanadi, hamma foydalanadi." },
      sections: [
        { heading: 'Buyruqlar solishtirmasi', table: { head: ['Amal', 'npm', 'pnpm', 'Yarn', 'Bun'], rows: [["Hammasini o'rnatish", 'npm install', 'pnpm install', 'yarn', 'bun install'], ["Paket qo'shish", 'npm install x', 'pnpm add x', 'yarn add x', 'bun add x'], ["Dev qo'shish", 'npm i -D x', 'pnpm add -D x', 'yarn add -D x', 'bun add -d x'], ["O'chirish", 'npm uninstall x', 'pnpm remove x', 'yarn remove x', 'bun remove x'], ['Bir martalik', 'npx x', 'pnpm dlx x', 'yarn dlx x', 'bunx x'], ['Lock fayl', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock']] } },
        { heading: 'pnpm tuzilishi', text: "pnpm har paket versiyasini kompyuterdagi bitta content-addressable store (mazmun bo'yicha manzillanadigan ombor) da saqlaydi va loyihalarga hard link qiladi. node_modules ildizida faqat package.json da yozilgan paketlar (symlink sifatida) ko'rinadi, o'tuvchilari `.pnpm` ichida. Natija: disk tejaladi va phantom dependency ishlamaydi." },
        { heading: 'Yarn va Bun', bullets: ["Yarn Classic (1.x) — npm ga o'xshash tekis node_modules.", "Yarn Berry (2+) — Plug'n'Play (PnP): node_modules o'rniga modullar xaritasi (.pnp.cjs).", "Bun — o'zi JavaScript runtime ham; o'rnatishi juda tez, npm registry bilan ishlaydi.", "Corepack va `packageManager` maydoni jamoada menejer versiyasini qayd etadi."] },
        { callout: { kind: 'warn', text: "Bitta loyihada bitta menejer: package-lock.json bilan pnpm-lock.yaml birga tursa, ikki xil daraxt paydo bo'ladi. Eski lock faylni o'chiring." } },
      ],
      recap: ["pnpm — umumiy store + symlink: tez va tejamkor.", "pnpm da faqat e'lon qilingan paketlar ko'rinadi.", "Yarn Berry PnP node_modules siz ishlaydi.", "Har menejerning o'z lock fayli; aralashtirmang."],
    },
    defs: [
      ['Content-addressable store (mazmun bo\'yicha ombor)', "fayllar mazmuni xeshi bo'yicha bir marta saqlanadigan umumiy joy."],
      ['Symlink (ramziy havola)', "boshqa papka yoki faylga ko'rsatuvchi yorliq."],
      ['Plug\'n\'Play (PnP)', "Yarn ning node_modules yaratmasdan modullarni xarita orqali topish usuli."],
      ['Corepack', "Node bilan keladigan, loyihadagi packageManager maydoniga mos menejerni ishga tushiruvchi vosita."],
      ['dlx', "paketni vaqtincha yuklab, buyrug'ini ishga tushirish (npx o'xshashi)."],
    ],
    life: [
      ['🎬', 'Striming', "Film bir serverda turadi, hammaga havola beriladi — pnpm store."],
      ['🗺️', 'Xarita', "PnP — hamma narsani uyga tashimasdan, qayerda turishini xaritadan topish."],
    ],
    practice: [
      { title: 'Tuzilmani solishtirish', text: "Bir xil `express` ni npm va pnpm bilan ikki papkaga o'rnating va node_modules ildizidagi papkalar sonini solishtiring." },
      { title: "Menejerni almashtirish", text: "npm loyihasidan package-lock.json va node_modules ni o'chirib `pnpm install` qiling; paydo bo'lgan lock faylni ko'ring." },
    ],
    items: [
      ch('express o\'rnatilgan (u debug ga bog\'liq). Kod `require("debug")` qiladi, package.json da debug yo\'q. npm va pnpm da natija?', "npm da ishlaydi, pnpm da topilmaydi", ["Ikkalasida ham bemalol ishlaydi", "npm da topilmaydi, pnpm da ishlaydi", "Ikkalasida ham topilmaydi"], "pnpm ildizda faqat e'lon qilingan paketlarni ko'rsatadi."),
      ch('10 ta loyiha bir xil lodash versiyasini ishlatadi. pnpm diskda nima qiladi?', "Bir nusxa saqlab, loyihalarga havola beradi", ["Har loyihaga to'liq nusxa ko'chiradi", "lodash ni faqat bitta loyihaga ruxsat beradi", "Har ishga tushirishda qayta yuklab oladi"], "Shu sabab disk va vaqt tejaladi."),
      ch('Repoda `yarn.lock` bor. Qaysi buyruq bilan o\'rnatish to\'g\'ri?', 'yarn install', ['npm install', 'pnpm install', 'npx install'], "Lock fayl qaysi menejer ishlatilishini ko'rsatadi."),
      ch('pnpm loyihasida kimdir `npm install` ishlatdi. Eng asosiy muammo?', "Ikkinchi lock fayl paydo bo'lib, daraxtlar ajraladi", ["npm package.json ni pnpm formatidan butunlay o'chirib yuboradi", "pnpm kompyuterdan o'chiriladi", "Hech qanday farq va muammo bo'lmaydi"], "Jamoa turli versiyalarni ola boshlaydi."),
      ch('Yarn Berry PnP rejimining belgisi qaysi?', "node_modules yo'q, .pnp.cjs fayli bor", ["node_modules ikki baravar katta bo'ladi", "package.json o'rniga yarn.json ishlatiladi", "Lock fayl umuman yaratilmaydi"], "Modul joylashuvi xaritada yoziladi."),
      ch('`pnpm dlx create-vite` npm dagi qaysi amalga o\'xshaydi?', 'npx create-vite', ['npm install -D create-vite', 'npm run create-vite', 'npm ci create-vite'], "dlx vaqtincha yuklab ishga tushiradi."),
      ch('CI da pnpm lock faylini o\'zgartirmay o\'rnatish buyrug\'i?', 'pnpm install --frozen-lockfile', ['pnpm update --no-save --recursive', 'pnpm install --force', 'pnpm add --lock'], "Bu npm ci ning muqobili."),
      ch('Bun haqida qaysi gap to\'g\'ri?', "Menejer bo'lishi bilan birga JavaScript runtime hamdir", ["Faqat React va Next.js asosidagi frontend loyihalari bilan ishlaydi", "npm registry dagi paketlarni o'rnata olmaydi", "package.json faylini ishlatmaydi"], "Bun paketlarni npm registry dan oladi."),
      fill('pnpm da `vite` ni devDependencies ga qo\'shadigan buyruqni yozing.', 'pnpm add -D vite', "add + -D.", ['pnpm add vite -D', 'pnpm add --save-dev vite']),
      fill('pnpm lock faylining to\'liq nomini yozing.', 'pnpm-lock.yaml', "YAML formatida."),
      ch('Jamoada hamma bir xil menejer versiyasini ishlatishi uchun package.json ga nima yoziladi?', '"packageManager": "pnpm@9.15.0"', ['"manager": "pnpm"', '"engines": "pnpm only"', '"scripts": { "preinstall": "pnpm@9" }'], "Corepack shu maydonni o'qiydi."),
    ],
  });

  /* 7 */
  lesson({
    title: 'Workspaces va monorepo',
    intro: "Bitta repoda bir nechta paket: npm/yarn workspaces, pnpm-workspace.yaml, --filter va umumiy paketni ulash.",
    theory: {
      analogy: { icon: '🏘️', title: 'Bitta hovlidagi uylar', text: "Monorepo — bitta hovli, bir nechta uy: web, admin, umumiy ui. Har uyning o'z eshigi (package.json) bor, lekin suv va gaz (node_modules, lock fayl) hovli bo'yicha umumiy." },
      sections: [
        { heading: 'Monorepo nima', text: "Monorepo (yagona ombor) — bir nechta loyiha yoki paket bitta Git omborida saqlanadi. Workspaces (ish maydonlari) — paket menejerining shu paketlarni birga o'rnatish va bir-biriga havola bilan ulash imkoniyati: umumiy paket o'zgarishi nashrsiz darhol ko'rinadi." },
        { code: { lang: 'text', text: "repo/\n  package.json           # private: true, workspaces\n  pnpm-workspace.yaml    # faqat pnpm uchun\n  apps/web/package.json\n  apps/admin/package.json\n  packages/ui/package.json" } },
        { heading: 'Sozlash', table: { head: ['Menejer', "Qayerda e'lon qilinadi", 'Bitta paketda buyruq'], rows: [['npm', 'package.json: "workspaces": ["apps/*"]', 'npm run build -w web'], ['Yarn', 'package.json: "workspaces"', 'yarn workspace web build'], ['pnpm', 'pnpm-workspace.yaml', 'pnpm --filter web build']] } },
        { heading: 'Ichki paketni ulash', code: { lang: 'bash', text: "# pnpm\npnpm --filter web add ui          # \"ui\": \"workspace:^\"\npnpm -r run build                 # barcha paketlarda\npnpm add -w -D typescript         # ildizga\n\n# npm\nnpm install ui -w web\nnpm run build --workspaces --if-present" } },
        { callout: { kind: 'info', text: "Ildiz package.json da `\"private\": true` yoziladi: ildiz — nashr qilinadigan paket emas, boshqaruv markazi. Lock fayl butun monorepo uchun bitta va ildizda turadi." } },
      ],
      recap: ["Monorepo — bitta repo, ko'p paket; workspaces ularni ulaydi.", "pnpm: pnpm-workspace.yaml va workspace: protokoli.", "-w / --filter bitta paketni, --workspaces / -r hammasini tanlaydi.", "Lock fayl bitta, ildizda."],
    },
    defs: [
      ['Monorepo (yagona ombor)', "bir nechta paket yoki ilova saqlanadigan bitta Git ombori."],
      ['Workspace (ish maydoni)', "monorepo ichidagi, o'z package.json iga ega paket."],
      ['workspace: protokoli', "bog'liqlik registry dan emas, faqat shu monorepodan olinishini bildiradi."],
      ['--filter', "pnpm buyrug'ini tanlangan paketlarga cheklaydi."],
      ['Polyrepo (ko\'p ombor)', "har loyiha alohida Git omborida turadigan yondashuv."],
    ],
    life: [
      ['🏭', 'Zavod sexlari', "Sexlar alohida, lekin ombor va tartib umumiy: bir detal o'zgarsa, qo'shni sex darhol oladi."],
      ['📒', 'Umumiy daftar', "Bitta lock fayl — butun hovli uchun bitta hisob daftari."],
    ],
    practice: [
      { title: 'pnpm workspace yaratish', text: "pnpm-workspace.yaml da `apps/*` va `packages/*` ni yozing, `packages/ui` va `apps/web` yarating, so'ng `pnpm --filter web add ui --workspace` qiling." },
      { title: 'Barcha paketlarda skript', text: "Har paketga `build` skripti yozib, ildizdan `pnpm -r run build` ni ishga tushiring." },
    ],
    items: [
      ch('npm da workspaces qayerda e\'lon qilinadi?', "Ildiz package.json ning workspaces maydonida", ["Har bir paket papkasidagi alohida .npmrc faylida", "package-lock.json ichida qo'lda", "node_modules/.workspaces papkasida"], "npm va Yarn shu maydonni o'qiydi."),
      ch('pnpm monorepo da paketlar ro\'yxati qaysi faylda?', 'pnpm-workspace.yaml', ['pnpm-lock.yaml', 'pnpm.workspaces.json', '.pnpmrc'], "Lock fayl esa avtomatik yaratiladi."),
      ch('`"ui": "workspace:^"` nimani bildiradi?', "ui faqat shu monorepodan olinadi", ["ui registry dan eng yangi versiyada olinadi", "ui faqat ishlab chiqishda kerak bo'ladi", "ui paketi o'chirilishi rejalashtirilgan"], "Nashr paytida bu yozuv oddiy versiyaga almashtiriladi."),
      ch('Faqat `web` paketining build skriptini ishga tushirish (pnpm)?', 'pnpm --filter web build', ['pnpm -r build web', 'pnpm build --only=web-app', 'pnpm web build'], "--filter paketni tanlaydi."),
      ch('`npm run test --workspaces --if-present` da `--if-present` nima uchun?', "test skripti yo'q paketda xato bermaslik uchun", ["Faqat o'zgargan paketlarni test qilish uchun", "Testlarni parallel ishga tushirish uchun", "Test topilsa, uni o'tkazib yuborish uchun"], "Skripti yo'q workspace shunchaki o'tib ketiladi."),
      ch('Monorepo da nechta lock fayl bo\'ladi?', "Bitta, ildizda", ["Har paketda bittadan", "Faqat apps papkasida bittadan", "Umuman bo'lmaydi"], "Butun daraxt birga hal qilinadi."),
      ch('Nega ildiz package.json da `"private": true` turadi?', "Ildiz nashr qilinadigan paket emas", ["Ichki paketlar ko'rinmasligi uchun", "Git omborni yopiq qilish uchun", "node_modules ni shifrlash uchun"], "Tasodifiy nashrning oldini oladi."),
      ch('pnpm workspace ildizida `pnpm add -D typescript` rad etildi. Nima yetishmayapti?', '-w bayrog\'i', ['-g bayrog\'i', '--force bayrog\'i', '--legacy bayrog\'i'], "pnpm ildizga qo'shishni aniq tasdiqlashni so'raydi."),
      ch('`packages/ui` dagi komponent o\'zgartirildi. `web` uni qachon ko\'radi?', "Darhol: ui havola orqali ulangan", ["ui registry ga nashr qilingandan keyin", "node_modules qo'lda o'chirilgandan keyin", "Faqat versiya MAJOR oshirilganda"], "Workspace — symlink, nusxa emas."),
      fill('npm da `web` workspace ga `zod` o\'rnatadigan buyruqni yozing (-w bilan, paket nomi oldin).', 'npm install zod -w web', "-w qaysi workspace ekanini bildiradi.", ['npm i zod -w web', 'npm install -w web zod', 'npm i -w web zod', 'npm install zod --workspace web', 'npm install zod --workspace=web']),
      order("pnpm monorepo qurish tartibini tuzing.", ["pnpm-workspace.yaml da paketlar yo'lini yozish", 'packages/ui papkasini yaratish', 'Papka ichida package.json ochish (pnpm init)', 'Ildizda pnpm install'], "Avval e'lon, keyin papka va paket, so'ng o'rnatish."),
    ],
  });
};
