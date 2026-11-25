// Extra theory for the Git and GitHub module, keyed by lesson order.
const E = (what, uses, tip, mistakes) => ({ what, uses, tip, mistakes });
module.exports = {
  1: E(
    "Git — kod tarixini saqlaydigan version control (versiyalarni boshqarish) tizimi. U fayllarning o'zgarishini emas, har commit da butun loyihaning «surati»ni (snapshot) saqlaydi. Har commit o'z hash raqami va oldingi commit ga havolasiga ega.",
    [['Xatodan qaytishda', "Istalgan oldingi holatni ko'rish va tiklash."], ['Kim nima qilganini bilishda', 'git log va git blame.'], ['Parallel ishlashda', 'Har ish alohida branch da.']],
    "Uch hudud: ish papkasi → staging area (tayyorlov zonasi) → repository (ombor).",
    [["Git va GitHub — bir narsa.", "Git — dastur, GitHub — Git omborlarini saqlaydigan xizmat.", "Git internetsiz ham ishlaydi."], ["add qilsam saqlandi deb o'ylash.", "Tarixga faqat commit yozadi.", "add faqat tayyorlaydi."]],
  ),
  2: E(
    "Kundalik ish davri: faylni o'zgartirasiz, git add bilan tanlaysiz, git commit bilan tarixga yozasiz. git status va git diff nima bo'layotganini ko'rsatadi.",
    [['Har ish boshida', 'git status.'], ["Nima o'zgarganini ko'rishda", 'git diff (staged emas), git diff --staged.'], ['Keraksiz fayllarda', '.gitignore.']],
    "Bir commit — bir mantiqiy o'zgarish; xabar «nima va nega»ni aytsin.",
    [["git add . bilan .env ni ham qo'shib yuborish.", "Avval .gitignore va git status.", "Maxfiy ma'lumot tarixda qoladi."], ["git commit -am yangi faylni ham oladi deb o'ylash.", "Yangi faylga git add shart.", "-a faqat kuzatilayotgan fayllar."]],
  ),
  3: E(
    "Git xatoni bir necha darajada qaytaradi: restore — fayldagi yoki staging dagi o'zgarish, reset — branch ko'rsatkichini orqaga surish, revert — eski commit ni bekor qiladigan YANGI commit.",
    [["Saqlanmagan o'zgarishni tashlashda", 'git restore fayl.'], ['Staging dan chiqarishda', 'git restore --staged fayl.'], ['Push qilinmagan commit da', 'git reset yoki commit --amend.'], ['Ulashilgan tarixda', 'git revert.']],
    "Boshqalar ko'rgan tarixni o'chirmang — ustiga tuzatuvchi commit qo'ying.",
    [["git reset --hard ni o'ylamay ishlatish.", "Avval status va stash.", "Saqlanmagan ish qaytmaydi."], ["Push qilingan commit ni amend qilib majburlab yuborish.", "revert yoki yangi commit.", "Jamoadoshlar tarixi buziladi."]],
  ),
  4: E(
    "Branch (shoxcha) — commit ga ko'rsatuvchi yengil harakatlanadigan nom. Merge ikki shoxni birlashtiradi: asos o'zgarmagan bo'lsa fast-forward, aks holda alohida merge commit.",
    [['Yangi imkoniyatda', 'git switch -c feature/login.'], ['Ishni qo\'shishda', 'main ga o\'tib, git merge.'], ['Tugagan shoxda', 'git branch -d.']],
    "Merge — «turgan joyingizga olib kelish»: avval qabul qiluvchi branch ga o'ting.",
    [["main da to'g'ridan-to'g'ri katta ish qilish.", "Alohida branch.", "main doim ishlaydigan holatda bo'lsin."], ["Teskari yo'nalishda merge qilish.", "git switch main, keyin git merge feature.", "Joriy branch o'zgaradi."]],
  ),
  5: E(
    "Conflict (to'qnashuv) — ikki shox bir joyni har xil o'zgartirganda Git tanlay olmasligi. Rebase esa commitlaringizni boshqa asos ustiga qayta yozib, tarixni to'g'ri chiziq qiladi.",
    [["Konfliktni yechishda", "Belgilar orasidan to'g'ri variantni qoldirib, add va davom."], ['O\'z shoxingizni yangilashda', 'git rebase main.'], ['Adashib qolganda', 'merge --abort yoki rebase --abort.'], ['Mayda commitlarni birlashtirishda', 'Squash merge.']],
    "Rebase — faqat hali hech kim bilan ulashilmagan commitlarda.",
    [["<<<<<<< belgilarini qoldirib commit qilish.", "Belgilarni o'chirib, kodni sinab ko'rish.", "Kod buziladi."], ["Umumiy main ni rebase qilish.", "O'z feature shoxingizni rebase qilish.", "Hamma uchun tarix o'zgaradi."]],
  ),
  6: E(
    "Kengaytirilgan vositalar kundalik muammolarni yechadi: stash — tugamagan ishni vaqtincha olib qo'yish, cherry-pick — bitta commit ni ko'chirish, tag — versiyani belgilash, bisect — xato kirgan commit ni topish.",
    [["Shoshilinch boshqa ishga o'tishda", 'git stash va git stash pop.'], ['Tuzatishni boshqa shoxga olishda', 'git cherry-pick hash.'], ['Reliz belgisida', 'git tag -a v1.0.0.'], ["Qachon buzilganini topishda", 'git bisect.']],
    "Stash — vaqtinchalik tortma, ombor emas: uzoq saqlamang.",
    [["Yangi (untracked) fayl stash ga kiradi deb o'ylash.", "git stash -u.", "Standart holatda kirmaydi."], ["Tag o'zi push bo'ladi deb o'ylash.", "git push origin v1.0.0.", "Teglar alohida yuboriladi."]],
  ),
  7: E(
    "Remote (masofadagi ombor) — loyihaning serverdagi nusxasi. origin/main — serverdagi holatning sizdagi oxirgi «surati». fetch olib keladi, pull olib kelib birlashtiradi, push yuboradi.",
    [["Loyihani olishda", 'git clone.'], ['Birinchi yuborishda', 'git push -u origin branch.'], ["Avval ko'rib olishda", 'git fetch, keyin git log origin/main.'], ['Ishni boshlashdan oldin', 'git pull.']],
    "fetch xavfsiz: sizning fayllaringizni o'zgartirmaydi.",
    [["Rad etilgan push ni --force bilan yuborish.", "Avval git pull (yoki rebase).", "Birovning ishi o'chib ketadi."], ["origin/main doim serverdagi eng yangi holat deb o'ylash.", "U oxirgi fetch paytidagi holat.", "Yangilash uchun fetch."]],
  ),
  8: E(
    "GitHub ish oqimi: branch ochiladi, commitlar push qilinadi, Pull Request (qabul qilish so'rovi) ochiladi, code review va avtomatik tekshiruvlar (CI) o'tadi, keyin merge qilinadi.",
    [["Jamoada o'zgarish kiritishda", 'Pull Request.'], ["Begona loyihaga hissa qo'shishda", 'fork, branch, PR.'], ['Sifatni saqlashda', 'Review va CI majburiy qilinadi.'], ['Versiya raqamida', 'MAJOR.MINOR.PATCH (semver).']],
    "Kichik PR tez va sifatli ko'riladi; bitta PR — bitta maqsad.",
    [["Minglab qatorli bitta PR ochish.", "Ishni kichik PR larga bo'lish.", "Review yuzaki bo'lib qoladi."], ["Tavsifsiz PR: «fix».", "Nima, nega va qanday tekshirilganini yozish.", "Ko'ruvchi kontekstni bilmaydi."]],
  ),
};
