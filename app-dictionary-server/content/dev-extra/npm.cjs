// Extra theory for the package managers module, keyed by lesson order.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  1: E(
    "npm — Node.js bilan keladigan paket menejeri. U tayyor kutubxonalarni registry dan yuklaydi va loyihaga nima kerakligini package.json faylida yozib boradi.",
    [['Yangi loyiha boshlashda', 'npm init -y.'], ['Tayyor kutubxona kerak bo\'lganda', 'npm install <paket>.'], ["Birovning loyihasini ochganda", 'npm install.']],
    "Retsept (package.json) Git da, masalliqlar (node_modules) yo'q.",
    [["node_modules ni commit qilish.", ".gitignore ga yozing.", "Papka package.json dan qayta yaratiladi."], ["Hamma paketni dependencies ga yozish.", "Vositalarni -D bilan o'rnating.", "Production keraksiz yuk olmaydi."]],
  ),
  2: E(
    "Semver — versiya raqami o'zgarish turini aytadigan kelishuv. npm shu raqamlar va ^ ~ belgilari orqali qaysi yangilanishlar xavfsiz ekanini aniqlaydi.",
    [['Paket yangilashda', 'npm outdated, keyin npm update.'], ["Katta o'tish oldidan", "MAJOR o'zgarish qo'llanmasini o'qish."], ['O\'z paketingizni chiqarishda', 'npm version.']],
    "^ — MAJOR qulfi, ~ — MINOR qulfi.",
    [["1.10.0 ni 1.9.0 dan kichik deb o'ylash.", "Har qismni alohida son deb solishtiring.", "10 > 9."], ["MAJOR ni tekshirmay yangilash.", "Avval changelog ni o'qing.", "Buzuvchi o'zgarish kodni sindiradi."]],
  ),
  3: E(
    "Lock fayl — o'rnatilgan har bir paketning aniq versiyasi yozilgan hisobot. U tufayli sizda, hamkasbingizda va serverda bir xil daraxt hosil bo'ladi.",
    [['Jamoada ishlashda', "Lock faylni commit qilish."], ['CI va deploy da', 'npm ci.'], ['«Menda ishlayapti» muammosida', "Lock dagi versiyalarni solishtirish."]],
    "Kompyuterda install, serverda ci.",
    [["package-lock.json ni .gitignore ga yozish.", "Uni commit qiling.", "Aks holda har kim boshqa versiya oladi."], ["package.json da yo'q paketni import qilish.", "Paketni aniq o'rnating.", "Hoisting o'zgarsa, import sinadi."]],
  ),
  4: E(
    "npm scripts — loyiha buyruqlariga nom beradigan bo'lim. npx esa paket ichidagi vositani global o'rnatmasdan ishga tushiradi.",
    [['Kundalik buyruqlarda', 'npm run dev, npm test.'], ['Build zanjirida', 'pre va post skriptlar.'], ['Bir martalik vositada', 'npx create-vite.']],
    "Jamoa uchun buyruqni yodlamang — skriptga yozing.",
    [["npm run test --watch deb yozish.", "npm run test -- --watch.", "-- siz bayroq npm da qolib ketadi."], ["Vositani global o'rnatish.", "devDependencies va skript.", "Hamma bir xil versiyani ishlatadi."]],
  ),
  5: E(
    "Peer dependency — paket o'zi o'rnatmaydigan, balki loyihada bo'lishini talab qiladigan bog'liqlik. Lokal paketni esa file: yoki npm link bilan nashr qilmasdan sinash mumkin.",
    [['Plagin yoki UI kutubxona yozishda', "Framework ni peer qiling."], ['ERESOLVE chiqqanda', "Versiyalarni moslang."], ['Nashrdan oldin sinashda', 'npm link yoki file:.']],
    "Ziddiyatni bayroq bilan yashirmang, sababini hal qiling.",
    [["Har doim --force yozish.", "Mos versiyani tanlang.", "Nomuvofiqlik ish paytida chiqadi."], ["Versiyani oshirmay qayta nashr qilish.", "Avval npm version.", "Nashr qilingan versiya o'zgarmaydi."]],
  ),
  6: E(
    "pnpm, Yarn va Bun — npm ning muqobillari. Hammasi package.json bilan ishlaydi, farqi o'rnatish tuzilishi, tezlik va lock faylda.",
    [['Disk va tezlik muhim bo\'lsa', 'pnpm.'], ['Mavjud yarn.lock li loyihada', 'yarn.'], ['Tez tajribada', 'bun.']],
    "Qaysi lock fayl bo'lsa, o'sha menejer.",
    [["Bir loyihada ikki menejer ishlatish.", "Bittasini tanlab, ortiqcha lockni o'chiring.", "Ikki daraxt ajralib ketadi."], ["pnpm da o'tuvchi paketni import qilish.", "Uni pnpm add bilan e'lon qiling.", "U ildizda ko'rinmaydi."]],
  ),
  7: E(
    "Workspaces — bitta repodagi bir nechta paketni birga o'rnatib, bir-biriga havola bilan ulash imkoniyati. Shunday repo monorepo deyiladi.",
    [['Sayt va admin panel umumiy kod ishlatsa', "Umumiy ui paketi."], ["Bir o'zgarish bir nechta ilovaga tegsa", 'Bitta PR.'], ['Katta jamoada', "Bitta lock va bitta qoidalar."]],
    "Ildiz private, lock bitta, buyruqni -w yoki --filter bilan yo'naltiring.",
    [["Har paket ichida alohida o'rnatib yurish.", "Ildizdan o'rnating.", "Lock va havolalar buziladi."], ["Ichki paketni registry versiyasi deb yozish.", "workspace: protokolidan foydalaning.", "Begona shu nomli paket tushib qolmaydi."]],
  ),
};
