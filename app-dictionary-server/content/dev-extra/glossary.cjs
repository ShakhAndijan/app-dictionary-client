// English term -> Uzbek meaning. add-dev-theory.cjs writes it in parentheses after the first use in a lesson.
module.exports = {
  // internet
  'client-server': 'mijoz-server', client: 'mijoz', server: 'xizmat ko\'rsatuvchi kompyuter', request: "so'rov", response: 'javob',
  router: "yo'naltirgich", packet: "ma'lumot bo'lagi", protocol: 'aloqa qoidalari', provider: 'internet ta\'minotchisi', bandwidth: "o'tkazuvchanlik", latency: 'kechikish',
  'IP address': 'tarmoq manzili', port: 'dastur eshigi raqami', private: 'ichki', public: 'ochiq', stateless: 'holatni eslamaydigan', header: 'sarlavha ma\'lumoti', body: 'asosiy tana',
  hostname: 'xost nomi', pathname: "yo'l", query: "so'rov parametrlari", fragment: 'sahifa ichidagi bo\'lak', endpoint: 'API manzili', payload: 'yuborilayotgan ma\'lumot',
  idempotent: 'takrorlansa ham natijasi o\'zgarmaydigan', redirect: "qayta yo'naltirish", timeout: 'kutish vaqti tugashi', cache: 'vaqtinchalik xotira', caching: 'keshlash',
  cookie: 'brauzerdagi kichik ma\'lumot', session: 'seans', token: 'ruxsat kaliti', authentication: 'kimligini tekshirish', authorization: 'ruxsatni tekshirish',
  domain: 'domen nomi', subdomain: 'quyi domen', registrar: "domen ro'yxatga oluvchi", registrant: 'domen egasi', resolver: 'nomni manzilga aylantiruvchi',
  hosting: 'saytni serverda saqlash xizmati', deploy: 'serverga joylash', build: "yig'ish", 'static hosting': 'tayyor fayllar xostingi', CDN: 'tarkib yetkazish tarmog\'i',
  'rendering engine': 'chizish dvigateli', 'JavaScript engine': 'JavaScript dvigateli', render: 'ekranga chizish', rendering: 'ekranga chizish', handshake: "qo'l berib ulanish", hydration: 'tayyor HTML ni jonlantirish',
  browser: 'brauzer dasturi', frontend: 'foydalanuvchi ko\'radigan qism', backend: 'server qismi', framework: 'tayyor karkas', library: 'kutubxona', tool: 'vosita',
  // html
  tag: 'teg', element: 'sahifa unsuri', attribute: 'xususiyat belgisi', semantic: "ma'noli", accessibility: "hamma foydalana olishi", 'screen reader': "ekranni o'qib beruvchi dastur",
  viewport: "ko'rinadigan oyna", hyperlink: 'havola', anchor: 'langar, ichki havola', label: 'maydon yorlig\'i', input: 'kiritish maydoni', form: "to'ldiriladigan shakl",
  validation: 'tekshirish', pattern: 'andoza', placeholder: "o'rin egallovchi matn", autocomplete: "avtomatik to'ldirish", fieldset: 'maydonlar guruhi', submit: 'yuborish', required: 'majburiy', disabled: "o'chirilgan",
  'lazy loading': 'kerak bo\'lganda yuklash', responsive: 'ekranga moslashuvchan', modal: 'ustida ochiladigan oyna', popover: 'qalqib chiquvchi oyna', template: 'qolip', sandbox: 'cheklangan xavfsiz muhit',
  SEO: 'qidiruv tizimlari uchun optimallashtirish', canonical: 'asosiy nusxa', 'structured data': 'tuzilgan ma\'lumot', 'Open Graph': 'ijtimoiy tarmoq ko\'rinishi belgilari', meta: 'sahifa haqidagi ma\'lumot',
  // css
  selector: 'tanlovchi', combinator: 'selektorlarni bog\'lovchi', 'pseudo-class': 'holat selektori', 'pseudo-element': 'sun\'iy element', cascade: 'qoidalar ustunligi tartibi', specificity: 'aniqlik darajasi',
  inheritance: 'meros olish', 'cascade layer': 'qoidalar qatlami', 'box model': 'quti modeli', margin: "tashqi bo'shliq", padding: "ichki bo'shliq", border: 'chegara chizig\'i', outline: 'tashqi kontur',
  'margin collapse': "tashqi bo'shliqlarning qo'shilib ketishi", 'normal flow': "odatiy joylashish oqimi", block: 'blokli', inline: 'qatorli', gradient: "rang o'tishi",
  'font stack': 'shriftlar zaxira ro\'yxati', 'variable font': "o'zgaruvchan shrift", 'line-height': 'qator balandligi', flexbox: 'moslashuvchan bir o\'lchovli joylash', 'main axis': "bosh o'q", 'cross axis': "ko'ndalang o'q",
  gap: "oraliq masofa", grid: "to'r (ikki o'lchovli joylash)", track: 'ustun yoki qator yo\'li', subgrid: "ichki to'r", positioning: 'joylashtirish', 'containing block': 'hisob olinadigan quti', sticky: 'yopishib turuvchi',
  'stacking context': 'qatlamlar konteksti', overflow: 'toshib chiqish', scroll: 'aylantirish', 'scroll snap': 'aylantirishda yopishish', breakpoint: "dizayn o'zgaradigan nuqta", 'media query': 'ekran shartini so\'rash',
  'mobile-first': 'avval telefon uchun yozish', 'container query': "ota quti o'lchamini so'rash", 'custom property': "o'zgaruvchi", fallback: 'zaxira qiymat', nesting: 'ichma-ich yozish',
  transform: "shaklini o'zgartirish", transition: "silliq o'tish", animation: 'harakat', keyframes: 'harakat kadrlari', 'design token': "dizayn o'zgaruvchisi", 'utility-first': 'mayda yordamchi classlar usuli',
  component: "qayta ishlatiladigan bo'lak", layout: 'joylashuv', wrapper: "o'rovchi element", container: 'konteyner, idish', property: 'xususiyat', value: 'qiymat',
  // javascript
  engine: 'dvigatel', runtime: 'bajarilish muhiti', variable: "o'zgaruvchi", function: 'funksiya', argument: 'uzatilgan qiymat', parameter: 'qabul qiluvchi nom', object: 'obyekt', array: 'massiv', string: 'matn qatori',
  number: 'son', boolean: 'mantiqiy qiymat', primitive: 'oddiy (primitiv) qiymat', reference: 'havola', scope: "ko'rinish sohasi", closure: 'yopilma', hoisting: "e'lonning ko'tarilishi", callback: 'keyin chaqiriladigan funksiya',
  promise: "va'da obyekti", 'async': 'asinxron', asynchronous: 'asinxron, navbatsiz', synchronous: 'ketma-ket bajariladigan', 'event loop': 'hodisalar sikli', 'call stack': 'chaqiruvlar steki', heap: 'obyektlar xotirasi',
  'garbage collection': 'axlat yig\'ish', 'memory leak': 'xotira sizishi', coercion: 'tipni avtomatik o\'zgartirish', mutation: "joyida o'zgartirish", immutable: "o'zgarmas", mutable: "o'zgaruvchan", 'side effect': "yon ta'sir",
  'pure function': 'sof funksiya', method: 'obyekt funksiyasi', constructor: 'yasovchi funksiya', instance: 'nusxa obyekt', prototype: 'prototip, namuna obyekt', iterator: 'takrorlagich', iterable: 'aylanib chiqsa bo\'ladigan', generator: 'qiymat ishlab chiqaruvchi',
  exception: 'istisno holat', debounce: "to'xtagandan keyin chaqirish", throttle: "chaqiruvlar sonini cheklash", module: 'modul', import: 'olib kirish', export: 'tashqariga berish', 'event delegation': 'hodisani ota elementga topshirish',
  bubbling: "hodisaning yuqoriga ko'tarilishi", capturing: 'hodisaning pastga tushishi', listener: 'tinglovchi', handler: 'ishlov beruvchi', event: 'hodisa', 'regular expression': 'matn andozasi', serialization: 'matnga aylantirish',
  // git
  repository: 'ombor', commit: 'saqlangan holat', branch: 'shoxcha', merge: 'birlashtirish', rebase: 'asosini ko\'chirish', conflict: "to'qnashuv", remote: 'masofadagi ombor', push: 'serverga yuborish', pull: 'serverdan olib birlashtirish',
  fetch: 'yuklab olish', clone: "to'liq nusxa olish", fork: "o'z hisobingizga nusxa", stash: 'vaqtincha olib qo\'yish', tag: 'teg, belgi', checkout: "o'tish", 'staging area': 'tayyorlov zonasi', 'working directory': 'ish papkasi',
  'pull request': "o'zgarishni qabul qilish so'rovi", 'code review': "kodni ko'rib chiqish", release: 'chiqarilgan versiya', revert: 'teskari commit', reset: 'orqaga qaytarish', 'cherry-pick': 'bitta commitni tanlab olish',
  // common
  bug: 'dasturdagi xato', debug: 'xatoni izlash', default: 'standart holat', error: 'xato', log: "yozuv jurnali", update: 'yangilash', file: 'fayl', config: 'sozlamalar',
};
