// Git va GitHub, lessons 5-8. English terms are followed by their Uzbek translation in parentheses.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 5 */
  lesson({
    title: 'Konfliktlar va rebase',
    intro: "Merge konflikti nima, uni qanday hal qilish, rebase bilan merge farqi, rebase da ours/theirs almashishi va rebase ning oltin qoidasi.",
    theory: {
      analogy: { icon: '✍️', title: 'Ikki muharrir bitta qatorda', text: "Ikki muharrir bitta maqolaning aynan bitta jumlasini turlicha o'zgartirdi. Hakam (Git) qaysi biri to'g'riligini bilmaydi, shuning uchun ikkala variantni ham qog'ozga yozib qo'yadi va 'o'zingiz tanlang' deydi. Bu — merge konflikti. Rebase esa o'zgarishlaringizni boshqa yo'l boshidan qaytadan 'ko'chirib yozish' kabi." },
      sections: [
        { heading: 'Konflikt qachon chiqadi', text: "Git ikki branchni qatorlar darajasida birlashtiradi. Turli fayllar yoki bitta faylning turli joylaridagi o'zgarishlar avtomatik qo'shiladi. Konflikt faqat ikkala tomon ham AYNAN BIR joyni turlicha o'zgartirganda (yoki bir tomon faylni o'chirib, ikkinchisi o'zgartirganda) chiqadi. Konflikt xato emas, bu Git ning 'inson qarori kerak' degan signali." },
        { code: { lang: 'bash', text: "<<<<<<< HEAD\nconst color = 'blue';      // joriy branch (ours) versiyasi\n=======\nconst color = 'green';     // qo'shilayotgan branch (theirs) versiyasi\n>>>>>>> feature/theme" } },
        { heading: 'Konfliktni hal qilish ketma-ketligi', text: "1) `git status` konfliktli fayllarni 'both modified' deb ko'rsatadi. 2) Faylni ochib, `<<<<<<<`, `=======`, `>>>>>>>` belgilarini O'CHIRIB, kerakli yakuniy mazmunni qoldirasiz (birini tanlash yoki ikkalasini birlashtirish). 3) `git add fayl` — 'hal qilindi' deb belgilaydi. 4) `git commit` (merge uchun) yoki `git rebase --continue` (rebase uchun). Ortga qaytish: `git merge --abort` yoki `git rebase --abort` — jarayon boshlanmagan holatga qaytaradi." },
        { heading: 'Rebase: tarixni qayta joylashtirish', text: "Rebase joriy branchdagi commitlarni boshqa branch uchiga (yangi base — asos) ketma-ket qaytadan qo'llaydi. Natija — to'g'ri chiziqli tarix, lekin har bir commit YANGI hash oladi (parent o'zgargani uchun). Merge esa tarixni o'zgartirmaydi va merge commit qo'shadi. Oltin qoida: boshqalar ishlatayotgan (push qilingan, umumiy) branchni hech qachon rebase qilmang — hamkasblaringizdagi eski hashli commitlar bilan yangi nusxalar to'qnashadi." },
        { table: { head: ['', 'merge', 'rebase'], rows: [['Tarix', "Haqiqiy tarix saqlanadi, merge commit qo'shiladi", "To'g'ri chiziqli, commitlar qayta yoziladi"], ['Commit hashlari', "O'zgarmaydi", "Yangi hashlar"], ['Ulashilgan branch uchun', "Xavfsiz", "Xavfli (oltin qoida)"], ['Konflikt', "Bir marta (merge commitda)", "Har bir commit uchun alohida bo'lishi mumkin"]] } },
        { callout: { kind: 'warn', text: "Rebase paytida 'ours' va 'theirs' ma'nosi ALMASHADI: HEAD (ours) — siz rebase qilayotgan asos (masalan main), 'theirs' — qaytadan qo'llanayotgan SIZNING commitingiz. Chunki Git avval asosga o'tadi, keyin sizning commitlaringizni birin-ketin ustiga qo'yadi." } },
      ],
      recap: ["Konflikt — ikkala tomon bir joyni turlicha o'zgartirganda; belgilarni olib tashlab, add va commit/continue qilinadi.", "merge --abort / rebase --abort jarayonni bekor qiladi.", "Rebase commitlarni yangi hash bilan qayta yozadi: chiziqli tarix, lekin ulashilgan branch uchun xavfli.", "Rebase da ours = asos branch, theirs = sizning commitingiz."],
    },
    defs: [
      ['Merge conflict (birlashtirish konflikti)', "Git ikki o'zgarishni avtomatik qo'sha olmaydigan holat: bir joyni ikki tomon turlicha o'zgartirgan. Fayl konflikt belgilari bilan to'ladi."],
      ['Conflict markers (konflikt belgilari)', "<<<<<<< , ======= va >>>>>>> qatorlari: ular ikkala versiyani ajratib turadi. Commitdan oldin ularning hammasi olib tashlanishi shart."],
      ['Rebase', "commitlarni boshqa asos (base) ustiga qayta qo'llash. Yangi hashlar yaratadi, tarix chiziqli bo'ladi."],
      ['Squash merge (siqib birlashtirish)', "branchning barcha commitlarini bitta o'zgarishga siqib, maqsad branchga bitta oddiy commit sifatida qo'shish; merge commit yaratilmaydi."],
      ['Abort (bekor qilish)', "boshlangan merge yoki rebase ni to'xtatib, jarayondan oldingi holatga qaytarish: `git merge --abort`, `git rebase --abort`."],
    ],
    life: [
      ['📝', 'Birgalikda yozilayotgan hujjat', "Ikki hamkasb bitta bandni turlicha yozdi. Dastur o'zi tanlay olmaydi, ikkala versiyani ko'rsatadi, siz yakuniy matnni yozasiz."],
      ['🧱', "G'ishtlarni ko'chirish", "Rebase — g'isht devorni boshqa poydevorga tosh-toshdan qayta terish: yangi poydevorda har bir g'isht yangi 'seriya raqami' oladi."],
    ],
    practice: [
      { title: 'Konflikt yaratish va yechish', text: "Ikkita branchda bir xil faylning bir xil qatorini turlicha o'zgartirib merge qiling. Konflikt belgilarini ko'rib, yakuniy matnni yozing, `git add` va `git commit` bilan yakunlang." },
      { title: 'Merge va rebase solishtirish', text: "Bir xil holatni ikki nusxada tayyorlab, biriga merge, ikkinchisiga rebase qiling. `git log --graph --oneline` va commit hashlarini solishtiring." },
    ],
    items: [
      ch("Quyidagi holatda konflikt chiqadimi?", "Yo'q: turli qatorlar o'zgargan, Git avtomatik qo'shadi", ["Ha, chunki ikkalasi ham bir faylni o'zgartirgan", "Ha, chunki branchlar turli", "Faqat rebase da chiqadi"], "Git qatorlar darajasida ishlaydi; bir faylning turli joylaridagi o'zgarishlar avtomatik qo'shiladi.", "# main:    app.js 1-qatorni o'zgartirdi\n# feature: app.js 40-qatorni o'zgartirdi\ngit merge feature"),
      ch("Quyidagi faylda HEAD qismi nimani bildiradi?", "Joriy branch (merge qilayotgan branch) dagi versiya", ["Qo'shilayotgan branchdagi versiya", "Eng eski versiya", "Server versiyasi"], "<<<<<<< HEAD va ======= orasi — ours (siz turgan branch). ======= va >>>>>>> orasi — theirs.", "<<<<<<< HEAD\nconst port = 3000;\n=======\nconst port = 8080;\n>>>>>>> feature"),
      ch("Konflikt belgilarini o'chirmasdan commit qilsak nima bo'ladi?", "Belgilar kodda qoladi va dastur sinadi (Git o'zi tekshirmaydi, add qilish yetarli)", ["Git commitga ruxsat bermaydi", "Belgilar avtomatik o'chadi", "Merge bekor qilinadi"], "git add qilgach, Git konflikt hal bo'ldi deb hisoblaydi. Belgilar faylda qolsa, bu sizning xatongiz."),
      ch("Konfliktni qo'lda hal qilgandan keyingi to'g'ri ketma-ketlik?", "Faylni tahrirlash → git add fayl → git commit", ["git commit → git add → tahrirlash", "git merge --continue → git push --force", "Faylni o'chirib qayta clone qilish"], "add — 'hal qilindi' belgisi, commit esa merge ni yakunlaydi."),
      ch("Merge konflikti paytida hammasini bekor qilish uchun?", "git merge --abort", ["git reset --soft HEAD", "git revert --abort", "git clean -fd"], "--abort merge boshlanmagan holatga qaytaradi."),
      ch("Rebase dan keyin feature branchdagi commitlar...", "Yangi hashlarga ega bo'ladi, chunki ularning parenti o'zgargan", ["Oldingi hashlarda qoladi", "Birlashtirilib bitta commit bo'ladi", "O'chib ketadi"], "Hash parentni ham o'z ichiga oladi, parent o'zgarsa hash o'zgaradi."),
      ch("Quyidagi rebase paytidagi konfliktda 'ours' (HEAD) nima?", "main — ustiga qo'llayotgan asos branch", ["feature dagi sizning commitingiz", "Server versiyasi", "Eng yangi stash"], "Rebase da Git avval main ga o'tadi va commitlaringizni ustiga qo'yadi: shuning uchun ours = main, theirs = sizning commit.", "$ git switch feature\n$ git rebase main\nCONFLICT (content): Merge conflict in app.js"),
      ch("Oltin qoida: qaysi branchni rebase qilmaslik kerak?", "Boshqalar ham foydalanayotgan (push qilingan umumiy) branchni", ["Faqat mahalliy, hech kim ko'rmagan branchni", "Hech qanday branchni", "Faqat main dan chiqqan branchni"], "Ulashilgan branchda commit hashlari o'zgarishi hamkasblarning nusxalarini buzadi."),
      ch("Chiziqli tarix kerak, branch esa faqat sizda. Qaysi buyruq mos?", "git rebase main (feature branch da turib)", ["git merge --no-ff main", "git reset --hard main", "git revert main"], "Rebase commitlaringizni main uchiga qaytadan qo'llab, to'g'ri chiziq hosil qiladi."),
      ch("Rebase paytida konfliktni hal qildingiz. Davom etish uchun?", "git add fayl, so'ng git rebase --continue", ["git commit, so'ng git merge", "git rebase --abort", "git push"], "Rebase da commit yaratishni --continue o'zi bajaradi."),
      ch("Squash merge ning asosiy xususiyati?", "Branchning barcha commitlari main ga bitta commit bo'lib tushadi, merge commit yaratilmaydi", ["Commitlar o'chiriladi va yo'qoladi", "Branch avtomatik o'chiriladi", "Konfliktlar chiqmaydi"], "Squash tarixni ixchamlashtiradi, lekin alohida commitlar tarixi maqsad branchda saqlanmaydi."),
      fill("Boshlangan rebase ni bekor qilib avvalgi holatga qaytaruvchi to'liq buyruqni yozing.", "git rebase --abort", "--abort rebase boshlanmasdan oldingi holatga qaytaradi.", []),
    ],
  });

  /* 6 */
  lesson({
    title: 'Kengaytirilgan Git',
    intro: "stash, cherry-pick, tag (lightweight va annotated), interaktiv rebase (squash, fixup, reword), bisect va reflog bilan murakkab vaziyatlarni hal qilish.",
    theory: {
      analogy: { icon: '🧰', title: "Ustaning asboblar qutisi", text: "Asosiy buyruqlar — bolg'a va ombir. Kengaytirilgan Git — ustaning maxsus asboblari: stash — ishni vaqtincha tortmaga yashirish, cherry-pick — boshqa branchdan bitta commitni 'terib olish', interactive rebase — commitlarni tartibga solish, bisect — xatoni ikkilik qidiruv bilan topish." },
      sections: [
        { heading: 'stash: ishni vaqtincha yashirish', text: "Ish o'rtasida boshqa branchga shoshilinch o'tish kerak bo'lsa, `git stash` kuzatilayotgan fayllardagi o'zgarishlarni (staged va unstaged) alohida joyga yashirib, ishchi papkani tozalaydi. Standart holatda untracked (yangi) fayllar stashga KIRMAYDI: ular uchun `git stash -u`. `git stash list` ro'yxat, `git stash pop` oxirgisini qaytarib ro'yxatdan olib tashlaydi, `git stash apply` qaytaradi lekin ro'yxatda qoldiradi, `git stash drop` o'chiradi. Pop paytida konflikt chiqsa, stash ro'yxatdan o'chirilmaydi." },
        { code: { lang: 'bash', text: "git stash -u -m \"login ishi\"   # yangi fayllar bilan, nom berib\ngit switch hotfix\n# ... tuzatish va commit ...\ngit switch feature\ngit stash pop                  # ishni qaytarish" } },
        { heading: 'cherry-pick va tag', text: "`git cherry-pick <commit>` boshqa branchdagi bitta commitning o'zgarishini joriy branchga YANGI commit (yangi hash) sifatida ko'chiradi; asl commit joyida qoladi. Hotfixni release branchga o'tkazishda foydali. Tag — tarixdagi muhim nuqtaga (odatda release) o'zgarmas nom: `git tag v1.0.0`. Lightweight tag — shunchaki ko'rsatkich; annotated tag (`git tag -a v1.0.0 -m \"Release\"`) esa muallif, sana va xabarni saqlaydigan to'liq obyekt, release uchun tavsiya etiladi. Taglar `git push` bilan o'zi yuborilmaydi: `git push origin v1.0.0` yoki `git push --tags`." },
        { heading: 'Interaktiv rebase: tarixni tozalash', text: "`git rebase -i HEAD~3` oxirgi 3 commitni ro'yxat qilib muharrirda ochadi, har biriga amal tanlanadi: pick (qoldirish), reword (xabarni o'zgartirish), edit (to'xtab o'zgartirish), squash (oldingisiga qo'shish, xabarlarni birlashtirish), fixup (oldingisiga qo'shish, xabarini tashlab yuborish), drop (o'chirish). Qatorlar tartibini o'zgartirish commitlar tartibini o'zgartiradi. Bu tarixni qayta yozadi, shuning uchun faqat hali ulashilmagan (push qilinmagan) commitlar uchun ishlatiladi." },
        { table: { head: ['Amal', 'Nima qiladi', 'Xabar'], rows: [['pick', 'Commitni o\'z holicha qoldiradi', 'Saqlanadi'], ['reword', "Xabarni o'zgartirish", "Yangi xabar"], ['squash', "Oldingi commitga qo'shadi", "Ikkala xabar birlashadi"], ['fixup', "Oldingi commitga qo'shadi", "Bu commit xabari tashlanadi"], ['drop', "Commitni butunlay o'chiradi", '—']] } },
        { heading: 'bisect: xatoni ikkilik qidiruv bilan topish', text: "Bug qaysi commitda paydo bo'lganini bilmaysiz, lekin eski holatda ishlagani va hozir ishlamayotgani aniq. `git bisect start`, `git bisect bad` (hozirgi — buzuq), `git bisect good <eski commit>` (ma'lum yaxshi) deysiz. Git o'rtadagi commitni checkout qiladi, siz tekshirib `good` yoki `bad` deysiz va qidiruv har safar yarmiga qisqaradi: 100 ta commit uchun ~7 qadam (log₂ n). `git bisect run <test>` jarayonni avtomatlashtiradi, `git bisect reset` oddiy holatga qaytaradi." },
        { callout: { kind: 'info', text: "Qutqaruv zanjiri: tasodifan o'chirilgan commit — `git reflog`; yo'qolgan stash — `git fsck --unreachable` dan topish mumkin; noto'g'ri rebase — `git reflog` dagi rebase oldingi nuqtaga `git reset --hard` qilish." } },
      ],
      recap: ["stash tracked o'zgarishlarni yashiradi (-u bilan yangilarni ham); pop qaytaradi va olib tashlaydi.", "cherry-pick commitni yangi hash bilan ko'chiradi; annotated tag release uchun yaxshi, taglar push bilan o'zi ketmaydi.", "Interaktiv rebase: pick, reword, squash, fixup, drop; faqat push qilinmagan tarix uchun.", "bisect ikkilik qidiruv: n ta commit uchun ~log₂ n qadam."],
    },
    defs: [
      ['Stash (vaqtinchalik yashirin ombor)', "commit qilinmagan o'zgarishlarni vaqtincha saqlab, ishchi papkani oxirgi commit holatiga qaytaruvchi mexanizm. Stack (stek) tartibida ishlaydi: oxirgisi birinchi chiqadi."],
      ['Cherry-pick (tanlab ko\'chirish)', "boshqa branchdagi bitta commit o'zgarishini joriy branchga yangi commit sifatida qo'llash. Hash o'zgaradi, chunki parent boshqa."],
      ['Annotated tag (izohli teg)', "muallif, sana va xabar saqlovchi to'liq Git obyekti; release belgilash uchun tavsiya etiladi. Lightweight tag — oddiy ko'rsatkich."],
      ['Interactive rebase (interaktiv rebase)', "`git rebase -i` bilan commitlarni qayta tartiblash, birlashtirish, o'chirish yoki xabarini o'zgartirish. Tarixni qayta yozadi."],
      ['Bisect (ikkilik qidiruv)', "yaxshi va yomon commit oralig'ini har safar yarmiga qisqartirib, bug kiritgan commitni topish usuli."],
    ],
    life: [
      ['🗄️', "Tortmaga yashirish", "Stol ustidagi ishni (stash) tortmaga yashirib, shoshilinch topshiriq bilan shug'ullanasiz, keyin tortmadan olib davom etasiz."],
      ['🔍', 'Kitobda xatoni qidirish', "500 betlik kitobning qaysi betida xato boshlanganini bilish uchun o'rtasini ochasiz: xato bormi? Yarmini tashlab yuborasiz. Bisect shu usulda ishlaydi."],
    ],
    practice: [
      { title: 'Stash bilan hotfix', text: "feature da tugallanmagan o'zgarish qiling, `git stash -u`, main ga o'tib kichik tuzatishni commit qiling, qaytib `git stash pop`. Stash ro'yxatining bo'shashini tekshiring." },
      { title: "bisect o'yini", text: "10 commitli ombor yarating, 6-commitda ataylab bug kiriting va `git bisect start/bad/good` bilan uni qaysi qadamlarda topishingizni yozing; keyin `git bisect run` bilan avtomatlashtiring." },
    ],
    items: [
      ch("Quyidagilardan keyin stashda nima bo'ladi?", "Faqat a.txt dagi o'zgarish; yangi.txt (untracked) ishchi papkada qoladi", ["Ikkala fayl ham stashda", "Hech narsa: stash xato beradi", "Faqat yangi.txt stashda"], "Standart stash untracked fayllarni olmaydi; ular uchun -u kerak.", "echo x >> a.txt           # tracked fayl\necho y > yangi.txt        # untracked\ngit stash"),
      ch("`git stash pop` va `git stash apply` farqi?", "pop qaytarib, stash ro'yxatidan olib tashlaydi; apply ro'yxatda qoldiradi", ["Farqi yo'q", "apply stashni o'chiradi, pop qoldiradi", "pop faqat yangi fayllar uchun"], "apply xavfsizroq: natijani tekshirgach `git stash drop` qilinadi."),
      ch("Pop paytida konflikt chiqdi. Stash...", "Ro'yxatdan o'chirilmaydi: qo'lda drop qilish kerak", ["Avtomatik o'chadi", "Butunlay yo'qoladi", "Remote ga yuboriladi"], "Git konflikt bo'lsa ma'lumotni yo'qotmaslik uchun stashni saqlab qoladi."),
      ch("`git cherry-pick abc123` dan keyin yangi commit hashi...", "Asl commitdan farq qiladi (yangi parent tufayli)", ["Aynan bir xil", "Faqat birinchi 3 belgi", "Hash yaratilmaydi"], "Cherry-pick yangi commit yaratadi: tarkibi o'xshash, lekin parent va hash boshqa."),
      ch("Hotfix main da qilindi va release/1.2 ga ham kerak. Eng mos buyruq?", "release/1.2 da git cherry-pick <hotfix commit>", ["git reset --hard main", "git stash pop", "git rebase -i HEAD~1"], "Cherry-pick faqat bitta commit o'zgarishini kerakli branchga ko'chiradi."),
      ch("Annotated tag va lightweight tag farqi?", "Annotated — muallif, sana, xabar saqlaydigan obyekt; lightweight — shunchaki ko'rsatkich", ["Lightweight faqat GitHub da ishlaydi", "Annotated faqat branch uchun", "Farqi yo'q"], "Release uchun `git tag -a v1.0.0 -m \"...\"` tavsiya etiladi."),
      ch("`git tag v1.0.0` qilgach `git push` qilindi. GitHub da tag bormi?", "Yo'q: taglar alohida yuboriladi (git push origin v1.0.0 yoki --tags)", ["Ha, avtomatik", "Faqat annotated bo'lsa", "Faqat main da bo'lsa"], "Oddiy push faqat branchlarni yuboradi, taglarni emas."),
      ch("Interaktiv rebase ro'yxatida quyidagi o'zgartirishdan keyin nechta commit qoladi va xabar qanday bo'ladi?", "2 ta: 2-commit 1-ga qo'shiladi, uning xabari tashlab yuboriladi (fixup)", ["3 ta, hammasi o'z holicha", "1 ta", "2 ta, ikkala xabar birlashadi"], "fixup oldingi commitga qo'shadi va o'z xabarini tashlaydi; squash esa xabarlarni birlashtiradi.", "pick a1b2c3 Add form\nfixup d4e5f6 typo\npick 7g8h9i Add tests"),
      ch("Interaktiv rebase ni qaysi commitlarda xavfsiz ishlatish mumkin?", "Hali push qilinmagan (faqat sizdagi) commitlarda", ["Allaqachon main ga merge bo'lgan commitlarda", "Hamkasblar pull qilgan commitlarda", "Istalgan commitda, farqi yo'q"], "Tarixni qayta yozish hash larni o'zgartiradi; ulashilgan commitlarda muammo tug'diradi."),
      ch("Interaktiv rebase da commitni butunlay olib tashlash uchun qaysi so'z?", "drop", ["squash", "reword", "pick"], "drop commitni tarixdan chiqaradi (yoki qatorni o'chirish ham xuddi shu ishni qiladi)."),
      ch("Bisect: 128 ta commit orasidan bug topish uchun taxminan nechta qadam kerak?", "7 ta (log₂ 128)", ["64 ta", "128 ta", "2 ta"], "Har qadamda oraliq yarmiga qisqaradi: 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1."),
      fill("Bisect tugagach oddiy holatga qaytaradigan to'liq buyruqni yozing.", "git bisect reset", "reset bisect rejimini tugatib, boshlang'ich branchga qaytaradi.", []),
    ],
  });

  /* 7 */
  lesson({
    title: 'Remote va GitHub asoslari',
    intro: "remote, origin, clone, push, fetch va pull farqi, upstream, remote-tracking branch, rad etilgan push, force-with-lease, fork va autentifikatsiya.",
    theory: {
      analogy: { icon: '🌐', title: 'Mahalliy daftar va umumiy daftar', text: "Mahalliy omborim — mening shaxsiy daftarim. GitHub dagi ombor — jamoaning umumiy daftari. `push` — o'zimning yozuvlarimni umumiy daftarga ko'chirish; `fetch` — umumiy daftarda nima o'zgarganini faqat ko'rib kelish (o'z daftarimga tegmasdan); `pull` — ko'rib kelish va darrov o'z daftarimga qo'shish." },
      sections: [
        { heading: 'Remote va clone', text: "Remote — boshqa joydagi (odatda server) omborga berilgan nom va manzil. Odatiy nom — `origin`. `git clone <url>` butun tarixni yuklab oladi, `origin` remote ni avtomatik qo'shadi va standart branchni checkout qiladi. Mavjud omborga qo'lda: `git remote add origin <url>`; ro'yxat: `git remote -v`. Shallow clone (`--depth 1`) faqat oxirgi commitni oladi: tez, lekin to'liq tarixsiz." },
        { code: { lang: 'bash', text: "git remote add origin https://github.com/ali/proj.git\ngit remote -v\ngit push -u origin main     # birinchi push + upstream o'rnatish\ngit push                    # keyingi pushlar: -u tufayli qisqa\ngit clone https://github.com/ali/proj.git" } },
        { heading: 'fetch, pull va remote-tracking branch', text: "`origin/main` — remote-tracking branch (masofaviy ombor holati nusxasi): u serverdagi main ning oxirgi MA'LUM holatini ko'rsatadi, uni faqat fetch/pull/push yangilaydi. `git fetch` yangi commitlarni yuklaydi va origin/main ni yangilaydi, lekin sizning mahalliy branchingiz va ishchi papkangizga tegmaydi. `git pull` = `git fetch` + `git merge origin/main` (yoki `pull --rebase` bo'lsa rebase). Fetch har doim xavfsiz; pull esa merge konflikt keltirib chiqarishi mumkin." },
        { table: { head: ['Buyruq', 'Serverdan oladimi', 'Mahalliy branchni o\'zgartiradimi'], rows: [['git fetch', 'Ha', "Yo'q (faqat origin/main yangilanadi)"], ['git pull', 'Ha', "Ha (merge yoki rebase)"], ['git push', "Yuboradi", "Yo'q (server yangilanadi)"]] } },
        { heading: 'Rad etilgan push va force', text: "Server tarixida sizda yo'q commit bo'lsa, `git push` 'rejected (non-fast-forward)' xatosi bilan rad etiladi: avval `git pull` (yoki fetch + rebase) qilib tarixlarni birlashtiring. `git push --force` serverdagi tarixni ko'r-ko'rona ustiga yozadi va hamkasblarning commitlarini o'chirib yuborishi mumkin. Rebase yoki amend dan keyin zarurat bo'lsa, `--force-with-lease` ishlating: u serverdagi branch siz oxirgi ko'rgan holatda bo'lsagina yozadi, aks holda rad etadi." },
        { heading: 'Fork va autentifikatsiya', text: "Fork — GitHub da boshqa kishi omborining o'zingizdagi nusxasi. Odatiy oqim: fork qilasiz → o'z forkingizni clone qilasiz (origin) → asl omborni `upstream` nomi bilan remote qo'shasiz → upstream dan yangilanib turasiz → o'z forkingizga push qilib, asl omborga Pull Request ochasiz. Autentifikatsiya: HTTPS + Personal Access Token (token — parol o'rniga, GitHub endi oddiy parolni qabul qilmaydi) yoki SSH kalit (ochiq kalit GitHub da, yopiq kalit kompyuteringizda)." },
        { callout: { kind: 'warn', text: "Tokenni yoki .env ni hech qachon commit qilmang. Agar tasodifan push bo'lsa, tokenni DARHOL bekor qilib (revoke), yangisini yarating: tarixni tozalash allaqachon ko'rilgan bo'lishi mumkin bo'lgan kalitni qaytarmaydi." } },
      ],
      recap: ["origin — odatiy remote nomi; clone to'liq tarix va origin ni beradi.", "fetch faqat yuklaydi, pull = fetch + merge/rebase, push yuboradi.", "origin/main — remote-tracking branch, faqat tarmoq buyruqlari yangilaydi.", "Rad etilgan push: avval pull; majburlash kerak bo'lsa --force-with-lease, --force emas."],
    },
    defs: [
      ['Remote (masofaviy ombor)', "boshqa joydagi ombor uchun nom va manzil (origin). Bitta omborda bir nechta remote bo'lishi mumkin (origin, upstream)."],
      ['Remote-tracking branch', "origin/main kabi mahalliy ko'rsatkich: serverdagi branchning oxirgi ma'lum holati. Uni faqat fetch, pull va push yangilaydi."],
      ['Upstream branch', "mahalliy branch bog'langan masofaviy branch (-u bilan o'rnatiladi); shuning uchun parametrsiz push va pull ishlaydi. Fork da `upstream` — asl ombor remote nomi."],
      ['Fetch / Pull', "fetch — yangi ma'lumotlarni yuklash (mahalliy ishga tegmaydi); pull — fetch va merge (yoki rebase)."],
      ['Force with lease', "`git push --force-with-lease`: faqat serverdagi branch siz oxirgi ko'rgan holatda bo'lsa yozadi. Oddiy --force dan xavfsizroq."],
    ],
    life: [
      ['☁️', "Umumiy fayl ombori", "Remote — umumiy bulutli papka. Push — o'z fayllarimni yuklash; fetch — kimlar nima yuklaganini ko'rish; pull — yuklab, o'z papkamga qo'shish."],
      ['🍴', 'Retsept nusxasi (fork)', "Fork — boshqa oshpazning retseptidan o'z daftaringizga nusxa olish: istagancha o'zgartirasiz, yaxshi o'zgarishni asl oshpazga taklif qilasiz (PR)."],
    ],
    practice: [
      { title: "fetch va pull farqi", text: "Ikkita papkada bitta omborni clone qiling. Birida commit va push qiling. Ikkinchisida avval `git fetch` bajarib `git log origin/main` va `git log main` ni solishtiring; keyin `git pull` qiling." },
      { title: "Fork oqimi", text: "Biror ochiq omborni fork qilib clone qiling, `git remote add upstream <asl url>` qo'shing va `git remote -v` natijasini tushuntiring." },
    ],
    items: [
      ch("`git clone <url>` dan keyin remote ro'yxatida nima bor?", "origin: clone qilingan url", ["Hech narsa, qo'lda qo'shish kerak", "upstream", "github"], "clone avtomatik ravishda origin nomli remote qo'shadi."),
      ch("`git fetch` mahalliy main branchingizni o'zgartiradimi?", "Yo'q, faqat origin/main ni yangilaydi", ["Ha, avtomatik merge qiladi", "Ha, uni o'chiradi", "Faqat konflikt bo'lsa"], "Fetch faqat ma'lumot yuklaydi; birlashtirish uchun merge yoki pull kerak."),
      ch("`git pull` aslida qaysi ikkita buyruqqa teng?", "git fetch + git merge", ["git add + git commit", "git clone + git push", "git stash + git pop"], "pull --rebase bo'lsa fetch + rebase."),
      ch("Quyidagi xatoga sabab va to'g'ri qadam?", "Serverda sizda yo'q commitlar bor; avval pull (fetch + merge/rebase) qiling", ["Git buzilgan; force push qiling", "Internet yo'q", "Branch nomi noto'g'ri"], "non-fast-forward: server tarixi sizniki bilan ajralgan. Avval birlashtirish kerak.", "$ git push\n ! [rejected]        main -> main (non-fast-forward)\nerror: failed to push some refs"),
      ch("Rebase qilgandan keyin feature branchni pushlash uchun qaysi biri xavfsizroq?", "git push --force-with-lease", ["git push --force", "git push --no-verify", "git push origin HEAD~1"], "--force-with-lease serverda kutilmagan o'zgarish bo'lsa rad etadi, boshqa odam ishini ustidan yozmaydi."),
      ch("`origin/main` nima?", "Serverdagi main ning oxirgi ma'lum holatiga ishora qiluvchi mahalliy remote-tracking branch", ["Serverning o'zi", "Mahalliy main ning nusxasi", "Yangi remote"], "Uni faqat fetch, pull va push yangilaydi; qo'lda commit qilib bo'lmaydi."),
      ch("`git push -u origin main` dagi -u nima uchun?", "Mahalliy main ni origin/main ga bog'laydi (upstream), keyin parametrsiz push va pull ishlaydi", ["Majburlab yozadi", "Tag yuboradi", "Barcha branchlarni yuboradi"], "-u (--set-upstream) bog'lanishni o'rnatadi."),
      ch("Fork qilingan omborda asl ombor odatda qaysi nom bilan remote qo'shiladi?", "upstream", ["origin (u fork ning o'zi)", "fork", "main"], "origin — sizning forkingiz, upstream — asl ombor: undan fetch qilib yangilanasiz."),
      ch("Quyidagi buyruq nima qiladi?", "Faqat 'origin' nomi va manzilini saqlaydi; hech narsa yuborilmaydi", ["Barcha fayllarni GitHub ga yuklaydi", "GitHub da yangi ombor yaratadi", "Mavjud omborni o'chirib, qaytadan clone qiladi"], "git remote add faqat nom va manzilni mahalliy konfiguratsiyaga yozadi. Yuborish uchun git push kerak.", "git remote add origin https://github.com/ali/proj.git"),
      ch("GitHub da HTTPS orqali push qilishda parol o'rniga nima ishlatiladi?", "Personal Access Token", ["Oddiy akkaunt paroli", "SSH ochiq kaliti", "Email manzil"], "GitHub 2021 dan oddiy parol bilan Git amallarini qabul qilmaydi; token yoki SSH kerak."),
      ch("Shallow clone (`--depth 1`) ning kamchiligi?", "Faqat oxirgi commit bor: to'liq tarix, log va bisect cheklangan", ["Fayllar yo'q bo'ladi", "Push qilib bo'lmaydi", "Branchlar o'chadi"], "Tez va kichik, CI uchun qulay; lekin to'liq tarix kerak bo'lsa `git fetch --unshallow`."),
      fill("'origin' nomli yangi remote qo'shish buyrug'ini url dan oldingi qismigacha yozing.", "git remote add origin", "`add` yangi remote qo'shadi: git remote add <nom> <url>.", []),
    ],
  });

  /* 8 */
  lesson({
    title: 'GitHub ish oqimi',
    intro: "Pull Request va code review, birlashtirish usullari, Conventional Commits va semver, branch strategiyalari (GitHub Flow, Git Flow, trunk-based), branch protection va GitHub Actions asoslari.",
    theory: {
      analogy: { icon: '🏗️', title: 'Qurilishda qabul komissiyasi', text: "Pull Request (PR — o'zgarishni qo'shish so'rovi) — qurilgan qismni asosiy binoga ulashdan oldin qabul komissiyasiga ko'rsatish. Komissiya (reviewer) tekshiradi, izoh qoldiradi; avtomatik tekshiruvlar (CI) — texnik nazorat. Hammasi o'tsagina qism asosiy binoga ulanadi (merge)." },
      sections: [
        { heading: 'Pull Request va code review', text: "PR — branchingizdagi o'zgarishlarni asosiy branchga qo'shishni so'rash va muhokama qilish joyi. Odatiy hayot sikli: branch ochish → commitlar → push → PR ochish (sarlavha, tavsif, bog'liq issue) → CI tekshiruvlari va review → izohlarni tuzatish (yangi commit push qilinsa PR avtomatik yangilanadi) → merge. Reviewer uchta natija beradi: Approve (ma'qullash), Request changes (o'zgartirish talab qilish) yoki oddiy Comment. Tavsifda `Closes #12` yozilsa, PR merge bo'lganda 12-issue avtomatik yopiladi. Kichik PR (bitta mavzu, ~200-400 qator) tezroq va sifatliroq ko'riladi." },
        { heading: 'GitHub dagi 3 ta merge usuli', table: { head: ['Usul', 'Natija', 'Qachon qulay'], rows: [['Create a merge commit', "Barcha commitlar + merge commit; tarix to'liq", "Tarixni aynan saqlash kerak bo'lsa"], ['Squash and merge', "PR bitta commit bo'lib tushadi", "Ko'p 'wip', 'fix typo' commitlarini tozalash"], ['Rebase and merge', "Commitlar main ga chiziqli, yangi hashlar bilan qo'yiladi", "Chiziqli tarix, commitlar toza bo'lsa"]] } },
        { heading: 'Conventional Commits va semver', text: "Conventional Commits — commit xabarlari uchun kelishuv: `tur(soha): tavsif`. Asosiy turlar: feat (yangi imkoniyat), fix (xato tuzatish), docs, style (format), refactor, test, chore (yordamchi ishlar), perf, ci. Buzuvchi o'zgarish `feat!:` yoki xabarda `BREAKING CHANGE:` bilan belgilanadi. Bu Semantic Versioning (semver — MAJOR.MINOR.PATCH) bilan bog'lanadi: fix → PATCH (1.2.3 → 1.2.4), feat → MINOR (1.2.3 → 1.3.0), breaking → MAJOR (1.2.3 → 2.0.0). Shu orqali versiya va changelog avtomatik hosil qilinadi." },
        { code: { lang: 'bash', text: "feat(auth): add Google login\nfix(cart): prevent negative quantity\ndocs: update README install steps\nfeat(api)!: remove v1 endpoints\n\nBREAKING CHANGE: /v1/users is no longer available" } },
        { heading: 'Branch strategiyalari', text: "GitHub Flow: main doim deploy qilishga tayyor; har ish qisqa muddatli branchda, PR orqali main ga qo'shiladi va darrov deploy qilinadi. Oddiy, doimiy yetkazib berish uchun mos. Git Flow: main, develop, feature/*, release/*, hotfix/* — rejali release lar uchun murakkabroq. Trunk-based development: hamma kichik o'zgarishlarni kuniga bir necha marta bitta 'trunk' (main) ga qo'shadi, tugallanmagan ish feature flag bilan yashiriladi. Branch protection (himoya qoidalari) main ga to'g'ridan-to'g'ri push qilishni taqiqlab, PR, review va o'tgan CI ni talab qiladi." },
        { heading: 'GitHub Actions asoslari', text: "GitHub Actions — repository ichida ishlaydigan avtomatlashtirish (CI/CD). Workflow — `.github/workflows/*.yml` faylidagi YAML. Asosiy qismlari: `on` (qaysi hodisada ishga tushadi: push, pull_request), `jobs` (ishlar; parallel ishlaydi), `runs-on` (mashina: ubuntu-latest), `steps` (qadamlar: `uses` tayyor action ishlatadi, masalan actions/checkout, `run` shell buyrug'ini bajaradi). Maxfiy qiymatlar (tokenlar) `secrets` da saqlanadi va YAML ga yozilmaydi." },
        { code: { lang: 'yaml', text: "name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20 }\n      - run: npm ci\n      - run: npm test" } },
      ],
      recap: ["PR — review va CI orqali o'zgarishni main ga olib kirish; Closes #n issueni yopadi.", "Merge usullari: merge commit, squash (bitta commit), rebase (chiziqli).", "Conventional Commits: fix → PATCH, feat → MINOR, breaking → MAJOR.", "GitHub Flow oddiy; Git Flow rejali release; trunk-based — kichik tez o'zgarishlar; Actions — .github/workflows/*.yml."],
    },
    defs: [
      ['Pull Request (PR)', "branchdagi o'zgarishlarni asosiy branchga qo'shishni so'rash, muhokama va tekshirish joyi: kod review va CI shu yerda o'tadi."],
      ["Code review (kodni ko'rib chiqish)", "jamoadoshlarning o'zgarishni merge dan oldin tekshirishi: xatolar, o'qilishi, arxitektura. Natija: Approve, Request changes yoki Comment."],
      ['Conventional Commits (kelishilgan commit formati)', "`tur(soha): tavsif` ko'rinishidagi xabarlar (feat, fix, docs, ...). Versiyani va changelogni avtomatik aniqlashga imkon beradi."],
      ['Semantic versioning (semver, ma\'noli versiyalash)', "MAJOR.MINOR.PATCH: buzuvchi o'zgarish MAJOR ni, yangi imkoniyat MINOR ni, tuzatish PATCH ni oshiradi."],
      ['CI (continuous integration — uzluksiz integratsiya)', "har bir push/PR da testlar va tekshiruvlarni avtomatik ishga tushirish. GitHub da GitHub Actions orqali amalga oshiriladi."],
    ],
    life: [
      ['🧑‍⚖️', "Maqolani muharrirga topshirish", "PR — maqolani nashrdan oldin muharrirga berish: u xatolarni belgilaydi, siz tuzatasiz, keyin nashr (merge) bo'ladi."],
      ['🏷️', "Mahsulot yorlig'i", "Semver — mahsulot versiyasi yorlig'i: faqat kichik tuzatish bo'lsa 1.2.4, yangi funksiya qo'shilsa 1.3.0, eski ishlar buzilsa 2.0.0."],
    ],
    practice: [
      { title: "PR shabloni va CI", text: ".github/pull_request_template.md yarating (nima o'zgardi, qanday tekshirildi, bog'liq issue) va .github/workflows/ci.yml da `npm ci` va `npm test` ishlatuvchi workflow yozing. Test PR oching va CI natijasini kuzating." },
      { title: 'Commit xabarlarini tuzatish', text: "Oxirgi 5 commit xabarini Conventional Commits formatiga keltiring (interaktiv rebase reword bilan, faqat push qilinmagan commitlarda) va qaysi biri MINOR yoki PATCH berishini yozing." },
    ],
    items: [
      ch("PR tavsifida `Closes #12` yozilsa nima bo'ladi?", "PR merge bo'lganda 12-issue avtomatik yopiladi", ["PR darhol yopiladi", "12-commit o'chadi", "Hech narsa"], "GitHub 'Closes', 'Fixes', 'Resolves' kalit so'zlarini issue bilan bog'laydi."),
      ch("Review so'ragandan keyin izohlarni tuzatish uchun nima qilinadi?", "Shu branchga yangi commit push qilinadi: PR avtomatik yangilanadi", ["Yangi PR ochiladi", "Eski PR o'chiriladi", "main ga to'g'ridan-to'g'ri push qilinadi"], "PR branchga bog'liq: branch yangilansa, PR ham yangilanadi."),
      ch("Branchda 12 ta 'wip', 'fix typo' commit bor. Main tarixi toza qolishi uchun qaysi merge usuli?", "Squash and merge", ["Create a merge commit", "Faqat force push", "Rebase and merge har doim"], "Squash butun PR ni bitta commitga aylantiradi."),
      ch("Quyidagi xabar uchun semver qanday o'zgaradi (1.4.2 dan)?", "1.5.0 (MINOR): feat yangi imkoniyat", ["1.4.3", "2.0.0", "1.4.2 qoladi"], "feat → MINOR oshadi va PATCH nolga tushadi.", "feat(cart): add promo code field"),
      ch("Quyidagi xabar uchun semver (1.4.2 dan)?", "2.0.0 (MAJOR): ! buzuvchi o'zgarish belgisi", ["1.5.0", "1.4.3", "1.4.2"], "feat! yoki BREAKING CHANGE — MAJOR ni oshiradi, MINOR va PATCH nolga tushadi.", "feat(api)!: remove v1 endpoints"),
      ch("`fix(login): trim email` xabari qaysi turga kiradi va versiyaga ta'siri?", "fix: PATCH oshadi", ["feat: MINOR", "docs: ta'sir yo'q", "chore: MAJOR"], "fix xatoni tuzatadi → PATCH."),
      ch("GitHub Flow haqida qaysi gap to'g'ri?", "main doim deploy qilishga tayyor; ishlar qisqa branchlarda PR orqali qo'shiladi", ["develop va release branchlari majburiy", "Hamma to'g'ridan-to'g'ri main ga push qiladi", "Faqat bitta uzoq muddatli feature branch bor"], "Oddiy model: branch → PR → review/CI → merge → deploy."),
      ch("Git Flow ning o'ziga xosligi?", "develop, release/* va hotfix/* kabi doimiy tuzilmaga ega branchlar", ["Faqat main bor", "Rebase majburiy", "Branchlar yo'q"], "Rejali release lar uchun mos, lekin ko'proq jarayon talab qiladi."),
      ch("Branch protection yoqilganda nima taqiqlanadi?", "main ga to'g'ridan-to'g'ri push: PR, review va o'tgan CI talab qilinadi", ["Branch yaratish", "Commit qilish", "Clone qilish"], "Himoya qoidalari sifat nazoratini majburiy qiladi."),
      ch("GitHub Actions workflow fayli qayerda turadi?", ".github/workflows/ papkasida (.yml)", ["Loyiha ildizidagi actions.js", ".git/hooks ichida", "package.json ichida"], "Har bir .yml fayl alohida workflow."),
      ch("Quyidagi workflow qachon ishga tushadi?", "Har bir push va har bir pull request da", ["Faqat release da", "Faqat qo'lda", "Faqat main ga merge bo'lganda"], "`on` ro'yxati ishga tushiruvchi hodisalarni belgilaydi.", "name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest"),
      fill("Workflow qadamida tayyor action ishlatish uchun qaysi kalit so'z yoziladi (masalan: ... actions/checkout@v4)? Bitta so'z.", "uses", "`uses` tayyor action ni ishga tushiradi, `run` esa shell buyrug'ini bajaradi.", []),
    ],
  });
};
