// Extra theory for the Tailwind module, keyed by lesson order.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  1: E(
    "Tailwind CSS — tayyor kichik klasslardan dizayn yig'ish vositasi. U kodingizni o'qib, faqat ishlatilgan klasslar uchun CSS yaratadi.",
    [['Tez prototipda', 'CSS faylsiz.'], ['Yagona dizaynda', "bir xil shkala va ranglar."], ['Komponentli loyihada', 'stil komponent bilan birga.']],
    "Klass nomi kodda to'liq yozilsin.",
    [["Klass nomini bo'laklardan yig'ish.", "To'liq nomlar jadvalini yozing.", 'Skaner uni topa olmaydi.'], ['Har yerda ixtiyoriy qiymat.', 'Shkaladan foydalaning.', "Dizayn tartibsiz bo'lib qoladi."]],
  ),
  2: E(
    "Joylashtirish utility lari — flex, grid va o'lcham xususiyatlarining qisqa klass shakllari.",
    [['Navbar va tugmalar qatorida', 'flex.'], ['Kartalar katagida', 'grid.'], ['Belgi va modalda', 'absolute va fixed.']],
    "Oraliq uchun gap.",
    [['truncate ni min-w-0 siz kutish.', "Flex bolaga min-w-0 qo'shing.", 'Matn konteynerdan chiqadi.'], ['absolute ga relative otani unutish.', 'Otaga relative bering.', 'Element sahifaga nisbatan joylashadi.']],
  ),
  3: E(
    "Responsive utility lar — prefiks orqali ma'lum kenglikdan boshlab ishlaydigan klasslar.",
    [['Telefon va kompyuterga moslashda', 'md:, lg:.'], ['Menyuni almashtirishda', 'hidden md:flex.'], ['Qayta ishlatiladigan kartada', '@container.']],
    "Avval mobil, keyin kattasi.",
    [['sm: ni telefon deb tushunish.', 'Mobilni prefikssiz yozing.', 'sm: 640px dan boshlanadi.'], ['Har ekranga hamma klassni takrorlash.', "Faqat o'zgarganini yozing.", 'Kichik qiymat kattasiga ham o\'tadi.']],
  ),
  4: E(
    "Variant — utility qaysi holatda qo'llanishini belgilaydigan old qo'shimcha.",
    [['Tugma va havolalarda', 'hover, focus-visible.'], ['Formalarda', 'invalid, disabled, peer.'], ['Ochiladigan bloklarda', 'aria va data.']],
    "Fokus belgisini hech qachon yo'qotmang.",
    [['peer ni inputdan oldin kutish.', "Input ni oldinga qo'ying.", 'CSS faqat keyingi qo\'shnini tanlaydi.'], ["outline-none qo'yib ketish.", 'focus-visible:ring bering.', "Klaviatura foydalanuvchisi adashadi."]],
  ),
  5: E(
    "Dark mode — qorong'i muhit uchun ikkinchi ranglar to'plami; kaskad qatlamlari esa qaysi qoida yutishini boshqaradi.",
    [['Tema tugmasida', '@custom-variant dark.'], ['Umumiy teg stillarida', '@layer base.'], ["To'qnashuvni hal qilishda", 'qatlam tartibi.']],
    "Har rangga juftini bering.",
    [['Faqat fonni almashtirish.', "Matn va chegarani ham bering.", "Matn o'qilmay qoladi."], ["Qatlamsiz CSS bilan utility ni bosish.", '@layer ichida yozing.', 'Qatlamsiz stil doim ustun.']],
  ),
  6: E(
    "v4 sozlamasi CSS ning o'zida: @theme tokenlari utility yaratadi, @utility esa yangisini qo'shadi.",
    [['Brend ranglari va shriftlarida', '@theme.'], ["O'z klassingizda", '@utility.'], ['Tashqi HTML ni stillashda', '@apply.']],
    "Variant kerak bo'lsa @utility.",
    [['Rangni --brand deb nomlash.', '--color-brand yozing.', "Nom maydonisiz utility yaratilmaydi."], ["Hammasini @apply bilan klassga o'rash.", 'Komponent yarating.', 'Utility-first afzalligi yo\'qoladi.']],
  ),
  7: E(
    "clsx shartli klasslarni yig'adi, tailwind-merge ziddiyatlarni yechadi, cva esa komponent variantlarini tartibga soladi.",
    [['Holatga bog\'liq klasslarda', 'clsx.'], ['className qabul qiluvchi komponentda', 'cn.'], ['Tugma turlarida', 'cva.']],
    "Tashqi className oxirgi argument.",
    [['Shablon satr bilan hamma narsani ulash.', 'cn ishlating.', "false yoki zid klasslar qolib ketadi."], ['className ni birinchi berish.', "Oxiriga qo'ying.", 'Aks holda u yengiladi.']],
  ),
  8: E(
    "Radix — stilsiz, qulaylikka tayyor komponentlar; shadcn/ui — ular ustiga yozilgan va loyihangizga ko'chiriladigan kod.",
    [['Dialog va dropdown da', 'Radix.'], ['Tayyor dizaynli boshlanishda', 'shadcn.'], ['Dizayn tizimida', 'kodni moslashtirish.']],
    "Accessibility ni olib tashlamang.",
    [["Dialog.Title ni o'chirish.", 'sr-only bilan qoldiring.', "Ekran o'quvchi oynani nomlay olmaydi."], ['asChild ni unutish.', "O'z tugmangizni asChild bilan bering.", 'button ichida button chiqadi.']],
  ),
  9: E(
    "CSS Modules klass nomlarini lokal qiladi, CSS-in-JS stilni JavaScript da yozdiradi; farqi — brauzerdagi ish vaqti narxida.",
    [['Oddiy CSS ni saqlab qolishda', 'CSS Modules.'], ['Props ga bog\'liq stilda', 'CSS-in-JS.'], ['Tezlik muhim bo\'lsa', 'zero-runtime.']],
    "Dinamik son uchun CSS o'zgaruvchi.",
    [['Har qiymatga yangi klass yaratish.', "O'zgaruvchi bering.", "Uslublar jadvali shishib ketadi."], ['styles.xato ni sezmaslik.', 'Nomlarni tekshiring.', 'undefined jim o\'tadi.']],
  ),
};
