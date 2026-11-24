// Git va GitHub, lessons 1-4. English terms are followed by their Uzbek translation in parentheses.
module.exports = ({ lesson, ch, fill, order }) => {
  /* 1 */
  lesson({
    title: 'Git ichki tuzilishi',
    intro: "Versiyalarni boshqarish (version control), Git va GitHub farqi, uch zona (working directory, staging area, repository), obyektlar: blob, tree, commit, SHA-1 va HEAD.",
    theory: {
      analogy: { icon: '📸', title: 'Fotoalbom va suratlar', text: "Git — loyihangizning fotoalbomi. Har commit (saqlash nuqtasi) — butun loyihaning bir surati (snapshot — lahzali nusxa). Staging area (tayyorlov zonasi) — suratga tushishdan oldin odamlarni saf qilib turgan joy: kimni kadrga qo'shishni siz hal qilasiz. Albom (repository — ombor) esa suratlarni hech qachon o'chirmaydi: eski suratni istalgan payt qayta ochish mumkin." },
      sections: [
        { heading: 'Git, GitHub va versiyalarni boshqarish', text: "Version control system (VCS — versiyalarni boshqarish tizimi) fayllar tarixini saqlaydi: kim, qachon, nimani o'zgartirgani yozib boriladi va xohlagan eski holatga qaytish mumkin. Git — distributed VCS (taqsimlangan tizim): har bir dasturchida butun tarix (full history) to'liq nusxada turadi, shuning uchun commit qilish, tarixni ko'rish va branch ochish uchun internet kerak emas. GitHub esa Git emas, balki Git omborlarini (repository) internetda saqlaydigan va jamoaviy ishlash vositalarini (Pull Request, Issues, Actions) beradigan xizmat. GitLab va Bitbucket ham xuddi shunday xizmatlar." },
        { heading: 'Uch zona va uch holat', text: "Fayl Git da uch zonadan o'tadi. Working directory (ishchi papka) — diskdagi oddiy fayllar, ularni tahrir qilasiz. Staging area (index — tayyorlov zonasi) — keyingi commitga kiradigan o'zgarishlar ro'yxati; `git add` shu yerga qo'shadi. Repository (.git papkasi) — commitlar tarixi; `git commit` tayyorlov zonasidagilarni shu yerga muhrlaydi. Fayl holatlari: modified (o'zgargan), staged (tayyorlangan) va committed (saqlangan)." },
        { table: { head: ['Zona', 'Qayerda', 'Qaysi buyruq o\'tkazadi'], rows: [['Working directory', 'Diskdagi fayllar', 'Siz tahrir qilasiz'], ['Staging area (index)', '.git/index', 'git add'], ['Repository', '.git/objects', 'git commit']] } },
        { heading: 'Git obyektlari: blob, tree, commit', text: "Git ichida oddiy kalit-qiymat ombori (content-addressable storage — mazmun bo'yicha manzillanadigan ombor) bor. Har bir obyektning nomi — uning mazmunidan olingan SHA-1 hash (40 ta o'n oltilik belgi). Blob (binary large object) faqat fayl MAZMUNINI saqlaydi, fayl nomini emas. Tree papkani ifodalaydi: nomlar va ularga mos blob yoki ichki tree'larga havolalar. Commit — bitta tree'ga (loyiha holati), bitta yoki bir nechta parent commitga (ota), muallif va xabarga havola. Mazmun bir xil bo'lsa hash ham bir xil: ikkita bir xil fayl bitta blob sifatida saqlanadi." },
        { code: { lang: 'bash', text: "git hash-object -w a.txt        # blob yaratadi, hash qaytaradi\ngit cat-file -p HEAD            # commit obyektini ko'rsatadi\n# tree 9f1e...\n# parent 4b2c...\n# author Ali <ali@mail.uz> 1700000000 +0500\n#\n# Add login page" } },
        { heading: 'Branch va HEAD — shunchaki ko\'rsatkichlar', text: "Branch (shox) — nusxa emas, balki bitta commit hash yozilgan kichik fayl (.git/refs/heads/main). Yangi commit qilinsa, joriy branch ko'rsatkichi o'sha yangi commitga suriladi. HEAD — hozir qayerdaligingizni bildiruvchi ko'rsatkich: odatda branchga ishora qiladi (`ref: refs/heads/main`). Agar HEAD to'g'ridan-to'g'ri commit hashga ishora qilsa, bu detached HEAD (uzilgan HEAD) holati: shu paytda qilingan commitlarni hech qaysi branch ushlab turmaydi." },
        { callout: { kind: 'warn', text: "Commit hash ichiga fayllar daraxti, parent, muallif, vaqt va xabar kiradi. Shuning uchun commit xabarini yoki parentni o'zgartirsangiz, hash ham o'zgaradi. Tarixni qayta yozish (amend, rebase) aslida YANGI commitlar yaratishdir — eskilari o'chmaydi, shunchaki ko'rinmay qoladi." } },
      ],
      recap: ["Git — taqsimlangan VCS; GitHub — Git omborlarini saqlaydigan xizmat.", "Uch zona: working directory → staging area → repository.", "Blob — mazmun, tree — papka, commit — surat + parent + xabar; hammasi SHA-1 bilan nomlanadi.", "Branch va HEAD — commitga ishora qiluvchi ko'rsatkichlar; detached HEAD — HEAD to'g'ridan-to'g'ri commitda."],
    },
    defs: [
      ['Repository (ombor)', "loyiha fayllari va butun tarixi saqlanadigan joy. Mahalliy omborda `.git` papkasi tarixni ushlaydi; `.git` o'chirilsa, tarix yo'qoladi, fayllar esa qoladi."],
      ['Commit (saqlash nuqtasi)', "loyihaning o'sha paytdagi to'liq suratiga, parent (ota) commitga, muallif va xabarga havola qiluvchi obyekt. Diff emas, snapshot (surat) sifatida o'ylanadi."],
      ['Staging area / index (tayyorlov zonasi)', "keyingi commitga nima kirishini aniqlovchi oraliq ro'yxat. U tufayli bitta ishchi papkadan bir nechta mantiqiy alohida commit qilish mumkin."],
      ['SHA-1 hash', "obyekt mazmunidan hisoblangan 40 belgili identifikator. Mazmun o'zgarsa hash o'zgaradi: shu sababli tarix butunligi (integrity — buzilmaganlik) kafolatlanadi."],
      ['HEAD', "hozirgi pozitsiyani ko'rsatuvchi ko'rsatkich. Odatda branch nomiga, detached holatda esa to'g'ridan-to'g'ri commitga ishora qiladi."],
    ],
    life: [
      ['🎮', "O'yindagi saqlash nuqtalari", "Commit — o'yindagi save: istalgan payt shu holatga qaytasiz. Branch — alohida save-slot bo'lib, boshqa strategiyani xavfsiz sinab ko'rasiz."],
      ['📦', "Pochta jo'natmasi", "Staging area — quti: avval kerakli narsalarni solasiz (git add), keyin yopishtirib jo'natasiz (git commit). Qutiga nima solinishini siz tanlaysiz."],
    ],
    practice: [
      { title: "Obyektlarni ko'rish", text: "Yangi papkada `git init`, bitta fayl yarating, `git add` va `git commit` qiling. So'ng `git cat-file -p HEAD` va `git cat-file -p HEAD^{tree}` ni ishga tushirib commit va tree ichini o'qing; `ls .git/objects` da yangi obyektlarni toping." },
      { title: 'HEAD ni kuzatish', text: "`cat .git/HEAD` va `cat .git/refs/heads/main` ni bajaring. Yangi commit qiling va ikkinchi fayl hashi qanday o'zgarganini ko'ring. Keyin `git checkout <hash>` bilan detached HEAD holatiga o'tib `cat .git/HEAD` ni tekshiring." },
    ],
    items: [
      ch("Git va GitHub haqida qaysi gap to'g'ri?", "Git — dastur (VCS), GitHub — Git omborlarini internetda saqlaydigan xizmat", ["GitHub — dastur, Git — uning sayti", "Ikkalasi bir xil narsa", "Git ishlashi uchun doim GitHub akkaunti kerak"], "Git mahalliy ishlaydi va internetsiz ham to'liq tarixni saqlaydi; GitHub — alohida kompaniya xizmati."),
      ch("Git blob obyekti nimani saqlaydi?", "Faqat fayl mazmunini, nomini emas", ["Fayl nomi va mazmunini", "Papka tuzilmasini", "Commit xabarini"], "Nomlar tree obyektida saqlanadi. Shuning uchun mazmuni bir xil ikki fayl bitta blob bo'ladi."),
      ch("Ikkita fayl (a.txt va copy.txt) mazmuni aynan bir xil. Git ularni qanday saqlaydi?", "Bitta blob, ikkita nom (tree ichida)", ["Ikkita alohida blob", "Ikkinchisini rad etadi", "Faqat bitta fayl nomini eslab qoladi"], "Blob nomi mazmunning hashidan olinadi: bir xil mazmun — bir xil hash — bitta obyekt."),
      ch("Commit obyekti ichida NIMA yo'q?", "Fayllarning to'liq mazmuni (u blob'larda)", ["Tree'ga havola", "Parent commit hashi", "Muallif va xabar"], "Commit faqat havolalar va metama'lumotlarni saqlaydi; fayl mazmuni blob obyektlarida turadi."),
      ch("Commit xabari faqat bitta harfga o'zgartirildi (git commit --amend). Commit hashi...", "O'zgaradi, chunki xabar hash tarkibiga kiradi", ["O'zgarmaydi, chunki fayllar o'sha-o'sha", "Faqat oxirgi 7 belgisi o'zgaradi", "Faqat parent bo'lsa o'zgaradi"], "Hash butun commit obyektidan hisoblanadi. Amend aslida yangi commit yaratadi."),
      ch("Fayl hozir `git status` da 'Changes to be committed' bo'limida. U qaysi zonada?", "Staging area (index)", ["Faqat working directory", "Repository (commit qilingan)", "Remote ombor"], "git add dan keyin, lekin git commit dan oldin fayl staging area da turadi."),
      ch("Quyidagi natijaga ko'ra qaysi branchdasiz?", "feature/login", ["main", "HEAD", "Detached HEAD holatida, branch yo'q"], "HEAD fayli symbolic ref (ramziy havola) bo'lib, branchga ishora qiladi.", "$ cat .git/HEAD\nref: refs/heads/feature/login"),
      ch("Nima ro'y bergan?", "Detached HEAD holati: HEAD to'g'ridan-to'g'ri commitga ishora qilyapti", ["Repository buzilgan", "Branch o'chirilgan", "Remote ulanmagan"], "HEAD faylida 'ref:' bo'lmasa, u hashning o'ziga ishora qiladi. Bu holatda qilingan commitlar branchsiz qoladi.", "$ cat .git/HEAD\n4f2a9c1d7b0e3a8c5d6e1f20938ab47c5e0d1a22"),
      ch("Branch yaratish Git da nega juda tez bajariladi?", "Branch — faqat 41 baytlik hash yozilgan fayl, fayllar nusxalanmaydi", ["Git butun loyihani arxivlab qo'yadi", "Branch faqat serverda yaratiladi", "Git faqat o'zgarishlar ro'yxatini nusxalaydi"], "Yangi branch hozirgi commitga yangi ko'rsatkich qo'shishdan boshqa narsa emas."),
      ch("Git tarixi qayerda saqlanadi?", "Loyiha ildizidagi .git papkasida", ["Faqat GitHub serverida", "node_modules ichida", "Har bir faylning ichida"], ".git papkasini o'chirsangiz, fayllar qoladi, lekin butun tarix yo'qoladi."),
      ch("`git add` buyrug'i aslida nima qiladi?", "Fayl mazmunini obyektlar omboriga blob qilib yozadi va indexni yangilaydi", ["Faylni GitHub ga yuboradi", "Commit yaratadi", "Faylni o'chirib, qaytadan yaratadi"], "add paytidayoq blob yaratiladi; commit esa index asosida tree va commit obyektini yaratadi."),
      ch("Git 'taqsimlangan' (distributed) deyilishining sababi?", "Har bir klonda butun tarix to'liq nusxada bo'ladi", ["Fayllar bir necha serverga bo'lib saqlanadi", "Git faqat bir nechta odam bilan ishlaydi", "Commitlar avtomatik tarqatiladi"], "Shu sababli internetsiz ham log, branch va commit ishlaydi, server o'lsa ham tarix klonlarda saqlanadi."),
      fill("Hozirgi branch va HEAD holatini ko'rsatadigan buyruq (ikki so'z) qaysi? (fayllar holati ham chiqadi)", "git status", "`git status` branch nomini, staged, modified va untracked fayllarni ko'rsatadi."),
    ],
  });

  /* 2 */
  lesson({
    title: 'Asosiy buyruqlar',
    intro: "init, add, commit, status, diff, log, .gitignore va config: kundalik Git ish oqimi hamda har bir buyruqning aniq nima qilishi.",
    theory: {
      analogy: { icon: '📝', title: 'Kundalik daftar', text: "Git bilan ishlash — kundalik yuritishga o'xshaydi. Kun davomida sahifalarga yozasiz (working directory), kechqurun qaysi yozuvlarni daftarga muhrlashni tanlaysiz (git add), va sahifaga sarlavha qo'yib yopasiz (git commit -m). Keyin `git log` — daftarning mundarijasi." },
      sections: [
        { heading: "Asosiy tsikl", text: "Kundalik ish: fayllarni o'zgartirasiz → `git status` bilan holatni ko'rasiz → `git diff` bilan nima o'zgarganini tekshirasiz → `git add` bilan keraklisini tayyorlaysiz → `git commit -m \"xabar\"` bilan saqlaysiz. `git init` papkani Git omboriga aylantiradi (ichida `.git` yaratadi). Birinchi commitdan oldin branch ham 'tug'ilmagan' (unborn) bo'ladi." },
        { code: { lang: 'bash', text: "git init                       # ombor yaratish\ngit status                     # holat\ngit add a.txt                  # bitta faylni tayyorlash\ngit add .                      # hammasini (ignore qilinmagan) tayyorlash\ngit commit -m \"Add a.txt\"      # saqlash\ngit commit -am \"Fix typo\"      # kuzatilayotgan fayllarni add + commit\ngit log --oneline              # qisqa tarix" } },
        { heading: 'diff nimani ko\'rsatadi', table: { head: ['Buyruq', 'Solishtiradi', 'Qachon kerak'], rows: [['git diff', 'Working directory ↔ staging area', "Hali add qilinmagan o'zgarishlar"], ['git diff --staged', 'Staging area ↔ oxirgi commit', "Commitga nima kirishini tekshirish"], ['git diff HEAD', 'Working directory ↔ oxirgi commit', "Umumiy o'zgarish (staged + unstaged)"], ['git diff a b', 'Ikki commit/branch', "Branchlar orasidagi farq"]] } },
        { heading: "Yaxshi commit va -a tuzog'i", text: "Yaxshi commit — bitta mantiqiy o'zgarish, xabari esa 'nima va nega' ni qisqa aytadi (buyruq shaklida: 'Add', 'Fix'). `git commit -a` faqat allaqachon kuzatilayotgan (tracked) fayllarni oladi: yangi yaratilgan (untracked) fayl add qilinmasa, -a uni commitga qo'shmaydi. `git add .` esa .gitignore dagilardan tashqari hamma narsani (yangi fayllarni ham) qo'shadi — shuning uchun avval `git status` ni tekshiring, tasodifan .env yoki katta fayl commitga tushib qolmasin." },
        { heading: '.gitignore va config', text: "`.gitignore` — Git e'tiborsiz qoldiradigan fayl naqshlari ro'yxati: `node_modules/`, `*.log`, `.env`, `dist/`. U FAQAT hali kuzatilmayotgan fayllarga ta'sir qiladi: fayl allaqachon commit qilingan bo'lsa, keyin .gitignore ga yozish uni tarixdan olib tashlamaydi; buning uchun `git rm --cached fayl` kerak. `git config user.name` va `user.email` commitlarda muallif sifatida yoziladi; `--global` bayrog'i barcha omborlar uchun qo'llaydi." },
        { callout: { kind: 'warn', text: "Parol, token yoki .env fayli bir marta commit qilinib push bo'lsa, uni keyin o'chirish yetmaydi: tarixda qoladi. Bunday kalitni darhol almashtiring (rotate) — faqat tarixni tozalash xavfsizlik uchun yetarli emas." } },
      ],
      recap: ["add — tayyorlash, commit — muhrlash; status va diff — tekshirish.", "diff: unstaged, --staged: tayyorlangan, HEAD: ikkalasi.", "commit -a faqat tracked fayllarni oladi, yangi fayllarni emas.", ".gitignore faqat kuzatilmayotgan fayllarga ta'sir qiladi; sirlarni commit qilmang."],
    },
    defs: [
      ['Tracked / untracked (kuzatilayotgan / kuzatilmayotgan)', "Tracked — oxirgi commitda yoki indexda bor fayllar. Untracked — Git hali tanimaydigan yangi fayllar; ular `git add` qilinmaguncha commitga kirmaydi."],
      ['git add .', "joriy papkadagi barcha o'zgargan va yangi (ignore qilinmagan) fayllarni indexga qo'shadi. Qaysi fayl kirayotganini bilish uchun avval git status qiling."],
      ['git commit -am', "`-a` (all) va `-m` (message) ni birlashtirgan yozuv: kuzatilayotgan fayllardagi o'zgarishlarni avtomatik add qilib, commit qiladi. Yangi fayllarni qo'shmaydi."],
      ['.gitignore', "Git e'tibor bermaydigan fayl va papkalar naqshlari. Allaqachon commit qilingan fayllarga ta'sir qilmaydi."],
      ['Conventional commit message (odatiy xabar)', "Qisqa sarlavha (50 belgigacha), buyruq shaklida: 'Add login form'. Kerak bo'lsa bo'sh qator va batafsil izoh qo'shiladi."],
    ],
    life: [
      ['🧾', 'Chek yozish', "Savat — working directory, kassadagi tanlangan mahsulotlar — staging area. Kassada hammasini emas, kerakli narsalarni 'chekka' (commit) kiritasiz."],
      ['🧹', 'Chiqindi qutisi', ".gitignore — uyga kirmaydigan narsalar ro'yxati: iflos poyabzal (node_modules), vaqtinchalik qog'ozlar (*.log). Ular hech qachon albomga tushmaydi."],
    ],
    practice: [
      { title: 'Ikkita mantiqiy commit', text: "Bir papkada ikkita fayl (a.txt, b.txt) ni o'zgartiring. `git add a.txt` va commit qiling, keyin b.txt uchun alohida commit qiling. `git log --oneline` da ikki commitni ko'ring." },
      { title: ".gitignore sinovi", text: "`node_modules/` va `*.log` ni .gitignore ga yozing, `test.log` yarating va `git status` da ko'rinmasligini tekshiring. Keyin ignore qilinmagan faylni commit qilib, undan keyin .gitignore ga qo'shib ko'ring: nega hali kuzatilishini tushuntiring." },
    ],
    items: [
      ch("Natija qanday bo'ladi?", "Yangi.txt commitga kirmaydi, faqat a.txt dagi o'zgarish kiradi", ["Ikkala fayl ham commit bo'ladi", "Xato: -a faqat -m bilan ishlamaydi", "Hech narsa commit bo'lmaydi"], "-a faqat tracked fayllarni oladi. Yangi.txt kuzatilmagan, uni avval git add qilish kerak.", "echo x >> a.txt        # a.txt allaqachon commit qilingan\necho y > yangi.txt     # yangi fayl\ngit commit -am \"Update\""),
      ch("`git diff` natijasi BO'SH, lekin `git status` da fayl 'Changes to be committed' deb ko'rinyapti. Sabab?", "O'zgarishlar allaqachon staged: oddiy git diff faqat unstaged qismni ko'rsatadi", ["Git xato qilgan", "Fayl commit bo'lib bo'lgan", "diff faqat yangi fayllar uchun ishlaydi"], "Staged o'zgarishni ko'rish uchun `git diff --staged` kerak."),
      ch("Qaysi buyruq 'commitga aynan nima kirishini' oldindan ko'rsatadi?", "git diff --staged", ["git diff", "git log", "git status -s"], "--staged (yoki --cached) indexni oxirgi commit bilan solishtiradi."),
      ch("Qaysi holatda `git add .` NI ishlatish xavfli?", "Papkada .env kabi sirli fayl bo'lib, u .gitignore da yo'q bo'lsa", ["Faqat bitta fayl o'zgargan bo'lsa", "Yangi commit yaratayotganda", "Hech qachon xavfli emas"], "add . hamma narsani qo'shadi. Avval git status bilan nima kirayotganini tekshirish odat bo'lsin."),
      ch("`.env` allaqachon commit qilingan. Uni keyin .gitignore ga yozdingiz. Nima bo'ladi?", "Fayl baribir kuzatilishda davom etadi; uni indexdan git rm --cached bilan chiqarish kerak", ["Fayl avtomatik tarixdan o'chadi", "Git xato beradi", "Fayl diskdan o'chiriladi"], ".gitignore faqat untracked fayllarga ta'sir qiladi. Tarixdagi eski nusxa esa qoladi, kalitni almashtirish kerak."),
      ch("Quyida nechta commit hosil bo'ladi va ikkinchisida nima bo'ladi?", "2 ta: birinchisida faqat a.txt, ikkinchisida b.txt", ["1 ta, ikkala fayl bilan", "2 ta, ikkalasida ham ikkala fayl", "0 ta, chunki xabar yo'q"], "add faqat ko'rsatilgan faylni tayyorlaydi, keyingi commit shu faylni oladi.", "git add a.txt\ngit commit -m \"Add a\"\ngit add b.txt\ngit commit -m \"Add b\""),
      ch("Quyidagi `git status` natijasida nechta fayl commitga kiradi?", "1 ta (a.txt)", ["2 ta", "3 ta", "0 ta"], "Faqat 'Changes to be committed' bo'limidagi fayllar kiradi: a.txt. b.txt o'zgargan lekin staged emas, c.txt esa untracked.", "Changes to be committed:\n  modified:   a.txt\nChanges not staged for commit:\n  modified:   b.txt\nUntracked files:\n  c.txt"),
      ch("`git log --oneline` nimani ko'rsatadi?", "Har bir commit uchun bitta qator: qisqa hash va xabar", ["Faqat oxirgi commit", "O'zgargan fayllar ro'yxati", "Branchlar ro'yxati"], "--oneline tarixni ixcham ko'rinishga keltiradi."),
      ch("Commit xabari qaysi biri yaxshi amaliyotga mos?", "Fix crash when cart is empty", ["fixed stuff", "asdf", "Barcha o'zgarishlar va yangi narsalar va yana ko'p narsalar qo'shildi 2"], "Qisqa, buyruq shaklidagi, nima va nega qilinganini aytuvchi xabar tarixni o'qishni osonlashtiradi."),
      ch("`git init` ni bajargach, hech narsa commit qilinmasdan `git log` yozildi. Natija?", "Xato: hali birorta commit yo'q", ["Bo'sh ro'yxat va hech qanday xabar", "Avtomatik 'Initial commit' ko'rsatiladi", "Butun papka fayllari ro'yxati"], "Unborn branch da log: 'your current branch has no commits yet' xatosini beradi."),
      ch("Qaysi naqsh barcha .log fayllarini e'tiborsiz qoldiradi?", "*.log", ["log.*", "/log", "!*.log"], "* — istalgan belgilar. `!` esa istisno (ignore qilinmasin) degani."),
      fill("Barcha o'zgarishlarni (yangi fayllarni ham) tayyorlash uchun to'liq buyruqni yozing (nuqta bilan).", "git add .", "Nuqta joriy papkadagi hamma narsani bildiradi (ignore qilinmaganlarni).", ["git add -A", "git add --all"]),
    ],
  });

  /* 3 */
  lesson({
    title: 'Xatolarni qaytarish',
    intro: "restore, reset (--soft, --mixed, --hard), revert, commit --amend va reflog: har bir vaziyatda qaysi buyruq xavfsiz ekanini bilish.",
    theory: {
      analogy: { icon: '⏪', title: 'Matn muharriridagi Ctrl+Z', text: "Git — har bir bosqich uchun alohida Ctrl+Z. Faylni tahrir paytida buzsangiz — working directory ni qaytarasiz (restore). Noto'g'ri faylni tayyorlab qo'ysangiz — tayyorlovdan chiqarasiz (restore --staged). Noto'g'ri commit qilsangiz — commitni bekor qilasiz (reset yoki revert). Har qadamning o'z buyrug'i bor, eng muhimi — qaysi biri ma'lumotni yo'qotishini bilish." },
      sections: [
        { heading: 'Qaysi bosqichni qaytarish kerak', table: { head: ['Vaziyat', 'Buyruq', "Ma'lumot yo'qoladimi"], rows: [["Faylni noto'g'ri tahrir qildim (add qilmadim)", 'git restore fayl', "HA: saqlanmagan o'zgarish yo'qoladi"], ["Faylni add qilib yubordim, qaytarmoqchiman", 'git restore --staged fayl', "Yo'q: o'zgarish faylda qoladi"], ["Oxirgi commit xabarida xato", 'git commit --amend -m "..."', "Yo'q (yangi commit yaratiladi)"], ["Commitni bekor qilib, o'zgarishlarni qoldirmoqchiman", 'git reset --soft HEAD~1', "Yo'q"], ["Commit va tayyorlovni bekor qilaman", 'git reset HEAD~1', "Yo'q (fayllar o'zgargan holda qoladi)"], ["Hammasini tashlab yuboraman", 'git reset --hard HEAD~1', "HA: saqlanmaganlar yo'qoladi"], ["Ulashilgan (push qilingan) commitni qaytarish", 'git revert <commit>', "Yo'q: yangi teskari commit"]] } },
        { heading: "reset ning uch turi", text: "`git reset <commit>` joriy branch ko'rsatkichini boshqa commitga suradi. Farq — qo'shimcha nimani o'zgartirishida. --soft: faqat ko'rsatkichni suradi; indeks va fayllar tegilmaydi, ya'ni bekor qilingan commit o'zgarishlari 'staged' qoladi. --mixed (standart): ko'rsatkich + indeks; o'zgarishlar fayllarda qoladi, lekin staged emas. --hard: ko'rsatkich + indeks + fayllar; hammasi o'sha commit holatiga qaytadi, saqlanmagan o'zgarishlar yo'qoladi." },
        { code: { lang: 'bash', text: "# tarix: A - B - C (HEAD)\ngit reset --soft HEAD~1    # HEAD=B, C ning o'zgarishlari staged\ngit reset HEAD~1           # HEAD=B, C ning o'zgarishlari faylda (unstaged)\ngit reset --hard HEAD~1    # HEAD=B, C ning o'zgarishlari butunlay yo'q" } },
        { heading: 'reset va revert: ulashilgan tarix qoidasi', text: "reset tarixni 'orqaga suradi' va commitlarni tarixdan olib tashlaydi. Agar o'sha commit allaqachon push qilingan bo'lsa, boshqalarning tarixi bilan ziddiyat chiqadi. Shuning uchun ulashilgan tarixda `git revert` ishlatiladi: u bekor qilinayotgan commitga TESKARI o'zgarish bilan YANGI commit qo'shadi, eski tarix o'zgarmaydi. Xabar odatda 'Revert \"...\"' bo'ladi." },
        { heading: 'reflog — oxirgi najot yo\'li', text: "Reflog (reference log — ko'rsatkichlar jurnali) HEAD ning har bir harakatini (commit, reset, checkout, merge) mahalliy ravishda yozib boradi. `git reset --hard` dan keyin 'yo'qolgan' commit aslida obyektlar omborida turadi, faqat hech qaysi branch unga ishora qilmaydi. `git reflog` bilan uning o'rnini topib (`HEAD@{1}`) `git reset --hard HEAD@{1}` bilan qaytarish mumkin. Reflog faqat mahalliy va odatda ~90 kun saqlanadi." },
        { callout: { kind: 'warn', text: "`git restore fayl` va `git reset --hard` commit qilinmagan o'zgarishlarni TIKLAB BO'LMAYDIGAN qilib o'chiradi: ular hech qachon commit qilinmagani uchun reflogda ham yo'q. Commit qilingan narsa deyarli har doim qutqariladi, qilinmagani — yo'q." } },
      ],
      recap: ["Bosqichga mos buyruq: restore (fayl), restore --staged (index), reset (commit).", "--soft: faqat HEAD; --mixed: HEAD + index; --hard: HEAD + index + fayllar.", "Ulashilgan tarixda reset emas, revert ishlating.", "reflog commit qilingan 'yo'qolgan' ishni qaytaradi; commit qilinmaganini esa hech narsa."],
    },
    defs: [
      ['git restore', "ishchi papka yoki indeksdagi faylni boshqa holatdan (standart: index, --staged bilan: HEAD) tiklaydi. Commit tarixini o'zgartirmaydi."],
      ['git reset --soft / --mixed / --hard', "branch ko'rsatkichini suradi; mos ravishda hech narsaga tegmaydi / indeksni ham tiklaydi / indeks va fayllarni ham tiklaydi."],
      ['git revert', "belgilangan commitni bekor qiluvchi yangi (teskari) commit yaratadi. Tarix o'zgarmaydi, shuning uchun ulashilgan branchlar uchun xavfsiz."],
      ['git commit --amend', "oxirgi commitni almashtiradi (xabarini yoki tarkibini). Yangi hash hosil bo'ladi, shuning uchun push qilingan commit uchun tavsiya etilmaydi."],
      ['Reflog (ko\'rsatkichlar jurnali)', "HEAD ning mahalliy harakatlar tarixi. Yo'qolgan commitni topishning asosiy vositasi: HEAD@{n} ko'rinishida murojaat qilinadi."],
    ],
    life: [
      ['🧯', "O't o'chirgich", "revert — yong'in bo'lgan joyni yopuvchi yangi devor: tarix saqlanadi. reset --hard — butun xonani buzib tashlash: tez, lekin qaytib bo'lmaydi."],
      ['🗑️', 'Kompyuterdagi Axlat qutisi', "Reflog — Axlat qutisi: reset --hard dan keyin commit 'o'chgan' ko'rinadi, lekin bir muddat qutida yotadi. Faqat hech qachon saqlanmagan fayl qutiga tushmaydi."],
    ],
    practice: [
      { title: 'Uch reset ni solishtirish', text: "Uch commitli ombor yarating. Har safar `git reset --soft HEAD~1`, `git reset HEAD~1`, `git reset --hard HEAD~1` ni sinab (oralig'ida reflog bilan qaytib) `git status` va fayllar holatini jadvalga yozing." },
      { title: "Yo'qolgan commitni topish", text: "Commit qiling, `git reset --hard HEAD~1` bajaring, so'ng `git reflog` orqali commit hashini topib `git reset --hard HEAD@{1}` bilan tiklang." },
    ],
    items: [
      ch("Tarix A-B-C (HEAD). `git reset --soft HEAD~1` dan keyin nima bo'ladi?", "HEAD = B, C dagi o'zgarishlar staged holatda qoladi", ["HEAD = B, o'zgarishlar yo'qoladi", "HEAD = C, faqat indeks tozalanadi", "C commiti qaytadan yaratiladi"], "--soft faqat ko'rsatkichni suradi; indeks va fayllarga tegmaydi."),
      ch("Tarix A-B-C (HEAD). `git reset HEAD~1` (bayroqsiz) dan keyin C dagi o'zgarishlar...", "Fayllarda qoladi, lekin staged emas", ["Staged holatda qoladi", "Butunlay yo'qoladi", "Yangi branchga ko'chadi"], "Standart rejim --mixed: ko'rsatkich va indeks qaytadi, ishchi papka saqlanadi."),
      ch("Tarix A-B-C (HEAD), ishchi papkada commit qilinmagan o'zgarishlar bor. `git reset --hard HEAD~1` natijasi?", "HEAD = B; C ning ham, commit qilinmagan o'zgarishlar ham yo'qoladi", ["Faqat C yo'qoladi", "Hech narsa o'zgarmaydi", "Xato beradi"], "--hard ishchi papkani ham o'sha commit holatiga qaytaradi."),
      ch("Hamkasblar allaqachon pull qilgan commitni bekor qilish kerak. Qaysi buyruq to'g'ri?", "git revert <commit>", ["git reset --hard HEAD~1 va force push", "git commit --amend", "git restore ."], "revert yangi teskari commit qo'shadi, ulashilgan tarix buzilmaydi."),
      ch("`git revert HEAD` tarixni qanday o'zgartiradi?", "A-B-C ustiga yangi D (C ni bekor qiluvchi) qo'shadi", ["C ni tarixdan olib tashlaydi", "HEAD ni B ga qaytaradi, C yo'qoladi", "C ning xabarini o'zgartiradi"], "Revert yangi commit yaratadi: A-B-C-D, bunda D = C ning teskarisi."),
      ch("a.txt ni tahrir qildingiz, add qilmadingiz. `git restore a.txt` natijasi?", "a.txt indeksdagi (oxirgi staged yoki commit) holatiga qaytadi, tahrir yo'qoladi", ["a.txt unstaged bo'ladi, tahrir qoladi", "a.txt o'chadi", "Yangi commit yaratiladi"], "Bu buyruq ishchi papkani indeksdan qayta yozadi; saqlanmagan tahrir qaytmaydi."),
      ch("a.txt ni tahrir qilib `git add a.txt` qildingiz. Tayyorlovdan chiqarish, lekin tahrirni saqlash uchun?", "git restore --staged a.txt", ["git restore a.txt", "git reset --hard", "git checkout ."], "--staged indeksni HEAD dan tiklaydi, ishchi papkaga tegmaydi."),
      ch("`git commit --amend -m \"Yangi\"` dan keyin commit hashi...", "O'zgaradi: yangi commit yaratildi, eskisi esa reflogda qoladi", ["O'zgarmaydi", "Faqat parent o'zgaradi", "Eski commit tarixdan darhol butunlay o'chadi"], "Amend eski commitni almashtirmaydi, uning o'rniga yangisini ko'rsatadi."),
      ch("Nima ro'y beradi va nima qilish kerak?", "Reflogdan HEAD@{1} ni topib git reset --hard HEAD@{1} bilan qaytarish mumkin", ["Commit butunlay yo'qolgan, qaytarib bo'lmaydi", "git revert HEAD yetarli", "git pull bilan serverdan olish kerak"], "reset --hard branch ko'rsatkichini suradi, lekin commit obyekti omborda qoladi va reflogda yozilgan.", "$ git reset --hard HEAD~1     # xato qilib yubordim\n$ git reflog\n3a1f9c0 HEAD@{0}: reset: moving to HEAD~1\n8d2e4b7 HEAD@{1}: commit: Add payment"),
      ch("Qaysi holatda ma'lumotni reflog orqali ham TIKLAB BO'LMAYDI?", "Hech qachon commit/add qilinmagan o'zgarishlar restore yoki reset --hard bilan o'chirilganda", ["Commit qilingan va reset --hard qilingan ish", "Amend qilingan commit", "Revert qilingan commit"], "Git faqat obyektlar omborga yozilgan narsani saqlaydi. Hech qachon commit/add qilinmagan tahrir omborga tushmaydi."),
      ch("Xavfsizlik nuqtai nazaridan qaysi buyruq push qilingan umumiy branchda ISHLATILMASLIGI kerak?", "git reset --hard HEAD~3 va keyin force push", ["git revert", "git log", "git diff"], "Tarixni qayta yozish va majburlab yuborish hamkasblar nusxasini buzadi."),
      fill("Oxirgi commitni bekor qilib, o'zgarishlarni staged holatda qoldiradigan to'liq buyruqni yozing.", "git reset --soft HEAD~1", "--soft indeks va fayllarga tegmaydi, faqat HEAD ni bir commit orqaga suradi.", ["git reset --soft HEAD^"]),
    ],
  });

  /* 4 */
  lesson({
    title: 'Branch va merge',
    intro: "branch, switch/checkout, fast-forward va 3-way merge, --no-ff, branch o'chirish va merge-base: parallel ishlash asoslari.",
    theory: {
      analogy: { icon: '🛤️', title: "Yo'l ayrilishi", text: "Branch — yo'l ayrilishi: asosiy yo'l (main) ochiq qoladi, siz esa yon yo'lda yangi funksiya ustida tinch ishlaysiz. Tayyor bo'lgach, yon yo'lni asosiy yo'lga qo'shasiz (merge). Asosiy yo'ldagi harakat bu vaqt ichida to'xtamaydi, shuning uchun qo'shishda ba'zan ikki yo'l 'to'qnashadi'." },
      sections: [
        { heading: 'Branch bilan ishlash', text: "`git branch ism` yangi branch yaratadi, lekin unga o'tmaydi. `git switch ism` (yoki eski `git checkout ism`) o'tadi. `git switch -c ism` (yoki `git checkout -b ism`) yaratib, o'sha zahoti o'tadi. Branchlar ro'yxati: `git branch`; joriy branch yulduzcha (*) bilan belgilanadi. O'tishda ishchi papka o'sha branch commitiga mos o'zgaradi: fayllar avtomatik almashadi. Agar saqlanmagan o'zgarishlaringiz o'tish bilan to'qnashsa, Git o'tishni rad etadi." },
        { code: { lang: 'bash', text: "git switch -c feature/login     # yaratish + o'tish\n# ... ishlash va commit qilish ...\ngit switch main                 # asosiy branchga qaytish\ngit merge feature/login         # qo'shish\ngit branch -d feature/login     # qo'shilgan branchni o'chirish" } },
        { heading: 'Fast-forward va 3-way merge', text: "Merge — joriy branchga boshqa branch tarixini qo'shadi. Agar joriy branch ko'rsatkichi qo'shilayotgan branchning to'g'ridan-to'g'ri ajdodi bo'lsa (main o'sha paytdan beri o'zgarmagan), Git yangi commit yaratmaydi — faqat ko'rsatkichni oldinga suradi: fast-forward. Agar ikkala branch ham ajralgandan beri yangi commit olgan bo'lsa, Git merge-base (umumiy ajdod) va ikkala uchini solishtirib (3-way merge — uch tomonlama birlashtirish) yangi merge commit yaratadi, uning IKKITA parenti bo'ladi." },
        { table: { head: ['', 'Fast-forward', '3-way merge'], rows: [['Qachon', "Joriy branch ajdod bo'lsa", "Ikkala branch ham o'zgargan bo'lsa"], ['Yangi commit', "Yo'q (ko'rsatkich suriladi)", "Ha: merge commit"], ['Parentlar soni', '—', '2'], ['Tarix', "To'g'ri chiziq", "Ikki chiziq qo'shiladi"]] } },
        { heading: '--no-ff va branchni o\'chirish', text: "`git merge --no-ff ism` fast-forward mumkin bo'lsa ham merge commit yaratadi: tarixda 'bu funksiya alohida branchda ishlangan' izi qoladi. Merge qilingan branchni `git branch -d` bilan o'chirish xavfsiz — Git branch to'liq qo'shilganini tekshiradi va qo'shilmagan bo'lsa rad etadi. `-D` majburlab o'chiradi: qo'shilmagan commitlarga hech narsa ishora qilmay qoladi (reflogda bir muddat turadi). Branchni o'chirish commitlarni emas, faqat ko'rsatkichni o'chiradi." },
        { callout: { kind: 'info', text: "Merge faqat JORIY branchni o'zgartiradi. `git merge feature` ni main da bajarsangiz, main o'zgaradi, feature esa o'sha-o'sha qoladi. Teskarisi uchun avval feature ga o'ting." } },
      ],
      recap: ["Branch — commitga ko'rsatkich; switch -c yaratadi va o'tadi.", "Fast-forward: faqat ko'rsatkich suriladi; 3-way: ikki parentli merge commit.", "--no-ff fast-forward mumkin bo'lsa ham merge commit majburlaydi.", "branch -d faqat qo'shilgan branchni o'chiradi, -D majburlaydi."],
    },
    defs: [
      ['Branch (shox)', "alohida ish chizig'i: commitga ishora qiluvchi ko'rsatkich. Yaratish va almashtirish deyarli bepul."],
      ['Merge (birlashtirish)', "boshqa branch tarixini joriy branchga qo'shish. Natija fast-forward yoki merge commit bo'ladi."],
      ['Fast-forward', "joriy branch qo'shilayotgan branchning ajdodi bo'lganda faqat ko'rsatkichni oldinga surish; yangi commit yaratilmaydi."],
      ['Merge base (umumiy ajdod)', "ikki branch ajralgan oxirgi umumiy commit. 3-way merge shu commit va ikkala uchini solishtiradi."],
      ['Merge commit', "ikkita (yoki ko'proq) parentga ega commit; ikki tarixni birlashtiradi."],
    ],
    life: [
      ['🔀', "Yo'l qurilishi", "Asosiy yo'l ochiq, yon yo'lda ta'mirlash ishlari boradi. Ish tugagach yon yo'l asosiy yo'lga ulanadi — merge. Agar asosiy yo'l bu orada o'zgarmagan bo'lsa, ulanish oddiy (fast-forward)."],
      ['📄', 'Hujjatning nusxalari', "Branch — hujjatning alohida nusxasi (lekin Git da nusxa ko'chirilmaydi). Ikki kishi ikkala nusxani tahrir qilgach, ularni bitta hujjatga qo'shish — 3-way merge."],
    ],
    practice: [
      { title: 'Ikki turdagi merge', text: "main da bitta commit qiling. `feature` branch ochib commit qiling va main ga qaytib merge qiling: fast-forward bo'lishini `git log --graph --oneline` bilan ko'ring. So'ng yana ikkinchi branch ochib, har ikki branchda ham commit qilib, 3-way merge natijasini solishtiring." },
      { title: '--no-ff', text: "Xuddi shu fast-forward holatini `git reset --hard` bilan qaytarib, bu safar `git merge --no-ff feature` ni bajaring va tarix grafigidagi farqni tushuntiring." },
    ],
    items: [
      ch("`git branch yangi` dan keyin qaysi branchdasiz?", "Avvalgi branchda qolasiz: branch yaratildi, lekin o'tilmadi", ["yangi branchga o'tasiz", "Detached HEAD holati", "Xato: -c bayrog'i kerak"], "O'tish uchun `git switch yangi` yoki yaratish va o'tishni birlashtirgan `git switch -c yangi` kerak."),
      ch("Quyidagi holatda main da `git merge feature` nima qiladi?", "Fast-forward: main ko'rsatkichi C ga suriladi, yangi commit yaratilmaydi", ["Yangi merge commit yaratadi", "Konflikt chiqaradi", "Hech narsa qilmaydi"], "main (B) feature (C) ning ajdodi, shuning uchun faqat ko'rsatkich suriladi.", "A - B          <- main\n      \\\n       C       <- feature (B dan chiqqan)"),
      ch("Quyidagi holatda main da `git merge feature` natijasi?", "3-way merge: ikkita parentli yangi merge commit", ["Fast-forward", "main o'chib ketadi", "Faqat feature o'zgaradi"], "Ikkala branch ham A dan keyin ajralgan va yangi commit olgan: ajdod A, yangi merge commit hosil bo'ladi.", "A - B - D      <- main\n \\\n  C            <- feature"),
      ch("Merge commit nechta parentga ega bo'ladi?", "2 ta", ["1 ta", "0 ta", "Branchlar soniga qarab 3 ta"], "Bitta parent — joriy branch uchi, ikkinchisi — qo'shilayotgan branch uchi."),
      ch("`git merge --no-ff feature` ni fast-forward mumkin bo'lgan holatda ishlatsak...", "Baribir merge commit yaratiladi", ["Xato beradi", "Fast-forward bo'ladi", "feature o'chiriladi"], "--no-ff tarixda alohida branch izini qoldirish uchun merge commitni majburlaydi."),
      ch("main da turib `git merge feature` qilindi. Kim o'zgaradi?", "Faqat main (joriy branch); feature o'zgarmaydi", ["Ikkalasi ham", "Faqat feature", "Hech biri"], "Merge qo'shilayotgan branchni emas, joriy branchni yangilaydi."),
      ch("`git branch -d eski` xato berdi: 'not fully merged'. Bu nimani anglatadi?", "eski branchda hali joriy branchga qo'shilmagan commitlar bor", ["Branch mavjud emas", "Siz shu branchdasiz", "Git buzilgan"], "-d himoya vazifasini bajaradi. Commitlar kerak bo'lmasa -D bilan majburlash mumkin."),
      ch("`git branch -D eski` ni qo'shilmagan branchga ishlatdik. Commitlar...", "Branch ko'rsatkichi o'chadi, commitlar reflogda bir muddat qoladi va tiklash mumkin", ["Zudlik bilan butunlay yo'qoladi", "main ga ko'chadi", "GitHub ga yuboriladi"], "Commit obyektlari darhol o'chmaydi, reflog orqali topish mumkin."),
      ch("Natijaga ko'ra nima ro'y berdi?", "Saqlanmagan o'zgarish switch bilan to'qnashgani uchun Git o'tishni rad etdi", ["Branch mavjud emas", "Git buzilgan", "Remote ulanmagan"], "Git ishingizni yo'qotmaslik uchun o'tishni to'xtatadi: avval commit yoki stash qiling.", "$ git switch main\nerror: Your local changes to the following files would be overwritten by checkout:\n        app.js\nPlease commit your changes or stash them before you switch branches."),
      ch("Merge-base nima?", "Ikki branch ajralgan oxirgi umumiy commit", ["Birinchi commit", "Eng yangi merge commit", "main ning uchi"], "3-way merge shu ajdod bilan ikkala uchni solishtiradi: kim nimani o'zgartirganini shundan biladi."),
      ch("Fast-forward merge dan keyin `git log --oneline` tarixi qanday ko'rinadi?", "To'g'ri chiziq: merge commit yo'q", ["Ikki chiziq va merge commit", "Bo'sh", "Faqat feature commitlari"], "Fast-forward yangi commit yaratmaydi, faqat ko'rsatkichni suradi."),
      fill("Yangi 'feature' branch yaratib o'sha zahoti o'tadigan zamonaviy buyruqni yozing (switch bilan).", "git switch -c feature", "-c (create) bayrog'i branch yaratadi va unga o'tadi.", ["git checkout -b feature", "git switch --create feature"]),
    ],
  });
};
