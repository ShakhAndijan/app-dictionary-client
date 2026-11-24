// Topics 15-18
module.exports = {
  // ------------------------------------------------------------------ 15 ever / never
  15: {
    trap: [
      ["A: ___ you ever been to Istanbul? B: Yes, twice. I loved the food.", "Have", ["Did", "Do", "Has"], "Hayotda bironta marta bo'lganmi: Have you ever been...? You bilan have."],
      ["I ___ seen snow in my life, because it never snows in my city.", "have never", ["never have", "did never", "have ever"], "Never darak gapda have dan keyin keladi: have never seen. 'have ever' inkor ma'no bermaydi."],
      ["My sister is afraid of horses. She ___ ridden one.", "has never", ["have never", "is never", "never has"], "Sister birlik, shuning uchun has never + 3-shakl. 'never has' so'z tartibi xato."],
      ["A: Has your brother ___ travelled by plane? B: No, he's afraid of flying.", "ever", ["never", "yet", "already"], "Savol gapda hayotda biror marta ma'nosida ever ishlatiladi. Never savolda (oddiy savolda) kelmaydi."],
      ["This is the best cake I have ___ eaten! Who made it?", "ever", ["never", "just", "yet"], "Orttirma darajadan keyin ever: eng yaxshisi... bundan oldin tatiganlarim ichida."],
      ["We ___ met the new neighbours, so we don't know their names.", "have never", ["never have", "have ever", "ever have"], "Hech qachon uchrashmaganmiz: have never met. Ever inkor gapda ko'pincha not bilan keladi."],
      ["A: Have you ever eaten sushi? B: Yes, I ___ it twice in Tashkent.", "have eaten", ["did eat", "am eating", "has eaten"], "Javobda ham Present Perfect: Yes, I have eaten it twice. I bilan have."],
      ["She ___ been late for work. She is always on time.", "has never", ["have never", "did never", "ever has"], "Hech qachon kech qolmagan: has never been. She — has."],
      ["___ your parents ever visited Samarkand?", "Have", ["Has", "Did", "Do"], "Parents ko'plik, shuning uchun Have your parents ever visited...?"],
      ["I'm sure I have ___ seen that man before. His face looks very familiar.", "never", ["ever", "yet", "already"], "Sure I have ... seen — 'hech qachon ko'rmaganman' ma'nosida never. Ever darak gapda bu ma'noni bermaydi."],
      ["Have you ever ___ a horse?", "ridden", ["rode", "riding", "ride"], "Have you ever + 3-shakl: ride - rode - ridden."],
      ["A: What a beautiful dress! B: Thanks! I have ___ worn it before; it's brand new.", "never", ["ever", "already", "yet"], "Brand new — hech qachon kiymaganman: never. Ever darak gapda mos emas."]
    ],
    error: [
      ["Have you ever be to London?", "be", ["Have you", "ever", "to London"], "Have + ever + 3-shakl: been. Have you ever been to London?"],
      ["I have ever seen a ghost, and I don't believe in them.", "have ever seen", ["I", "a ghost", "I don't believe in them"], "Darak gapda hech qachon: I have never seen a ghost."],
      ["She has never went to a concert in her life.", "has never went", ["She", "to a concert", "in her life"], "Has never + 3-shakl: has never gone / been (go - went - gone)."],
      ["Do you ever been to Paris?", "Do", ["ever been", "to Paris"], "Present Perfect savoli: Have you ever been to Paris?"],
      ["My brother have never tried Chinese food.", "have never tried", ["My brother", "Chinese food", "tried"], "Brother birlik: has never tried."],
      ["Did you ever see a whale? I mean, in your whole life.", "Did you ever see", ["a whale", "I mean", "in your whole life"], "Hayot davomidagi tajriba: Have you ever seen a whale?"],
      ["We never have visited our grandmother's village.", "never have visited", ["We", "our grandmother's village", "visited"], "Never have dan keyin emas, oldin: We have never visited... Ravish have bilan 3-shakl orasida turadi."],
      ["She has ever flown in a plane, so she is very nervous today.", "has ever flown", ["She", "in a plane", "so she is very nervous today"], "Hech qachon uchmagani uchun hayajonda: She has never flown in a plane. Ever darak gapda bu ma'noni bermaydi."],
      ["Have you ever eat snails or frogs?", "eat", ["Have you", "ever", "snails or frogs"], "Eat - ate - eaten: Have you ever eaten...?"],
      ["I haven't never been abroad.", "haven't never", ["I", "been", "abroad"], "Ikkilangan inkor: I have never been abroad yoki I haven't ever been abroad."],
      ["Has she ever meet a famous person?", "meet", ["Has she", "ever", "a famous person"], "Has she ever met a famous person? (met - 3-shakl)."],
      ["They has never played chess before today.", "has never played", ["They", "chess", "before today"], "They bilan have: They have never played chess."]
    ],
    fill: [
      ["Savol tuzing (ever): You have been to Dubai. Savol bering.", "Have you ever been to Dubai", [], "Hayotiy tajriba savoli: Have + ega + ever + 3-shakl."],
      ["Qayta yozing (never): I haven't visited Japan in my life.", "I have never visited Japan", [], "Hayotda hech qachon: have + never + 3-shakl."],
      ["Inkor qiling (never): She has tried snails.", "She has never tried snails", [], "Never bilan: has + never + 3-shakl. 'has not' ham mumkin, lekin 'never' ma'noni kuchaytiradi."],
      ["Qayta yozing (ever, orttirma daraja): This is the best film. I saw it in my life.", "This is the best film I have ever seen", [], "Orttirma darajadan keyin ever va Present Perfect: the best ... I have ever seen."],
      ["Qisqa javob bering (Yes): Have you ever ridden a camel? (Yes, ...)", "Yes, I have", [], "Qisqa javobda faqat Yes, I have / No, I haven't."],
      ["Qayta yozing (never): My parents didn't fly in a plane until now.", "My parents have never flown in a plane", [], "Hozirgacha bo'lmagan tajriba: have never + flown (fly - flew - flown)."]
    ],
    order: [
      ["Have you ever been to a country in Africa", "Savol: Have + you + ever + been + to ..."],
      ["I have never eaten food from Mexico before", "Never have dan keyin; before oxirida."],
      ["She has never seen a real elephant in her life", "Has never + 3-shakl (seen); in her life — hayot davomida."],
      ["This is the most interesting book I have ever read", "Orttirma daraja + I have ever + 3-shakl."],
      ["My brother has never travelled outside Uzbekistan", "Birlik ega + has never + 3-shakl."],
      ["Has anyone in your class ever won a prize", "Has + anyone (birlik) + ever + 3-shakl (won)."]
    ]
  },

  // ------------------------------------------------------------------ 16 just / already / yet
  16: {
    trap: [
      ["Don't worry about the report. I have ___ finished it, and it's on your desk.", "already", ["yet", "ever", "never"], "Allaqachon tugatdim (darak gap): already fe'l oldida. Yet esa savol va inkorda gap oxirida keladi."],
      ["A: Have you eaten lunch ___? B: No, not yet. I'm waiting for Aziz.", "yet", ["ago", "just", "never"], "Savolda 'hali' ma'nosida gap oxirida yet turadi. Ago Past Simple bilan, just va never esa savol oxirida kelmaydi."],
      ["The film hasn't started ___. We have time to buy popcorn.", "yet", ["already", "just", "ever"], "Inkor gapda 'hali' — yet, gap oxirida."],
      ["Quick! Hide it! My mother has ___ come in. She's in the kitchen now.", "just", ["yet", "never", "ever"], "Hozirgina kirdi: just fe'l oldida (have + just + 3-shakl)."],
      ["I have ___ told you three times. Please listen carefully.", "already", ["yet", "ever", "never"], "Allaqachon aytdim (kutilganidan erta): already fe'l oldida. Yet bu yerda mos emas."],
      ["A: Is Dilnoza here? B: Yes, she ___ arrived. She's in the next room.", "has just", ["has yet", "just has", "is just"], "Hozirgina keldi: has just + 3-shakl. 'Just has' so'z tartibi xato."],
      ["I haven't called my grandmother ___, but I will do it tonight.", "yet", ["already", "just", "ever"], "Hali qo'ng'iroq qilmaganman: inkorda yet, gap oxirida."],
      ["We have ___ bought the tickets, so you don't need to buy them.", "already", ["yet", "never", "ever"], "Tayyor, shuning uchun sizga kerak emas: already (darak gapda, fe'l oldida)."],
      ["Have they decided where to go on holiday ___?", "yet", ["just", "never", "ago"], "Savolda yet gap oxirida: Have they decided ... yet? Just va never savol oxirida kelmaydi, ago esa Past Simple bilan."],
      ["I'm sorry, I can't give you the book. I have ___ lent it to Aziz.", "just", ["yet", "ever", "never"], "Hozirgina qarz berdim: just fe'l oldida (have just lent)."],
      ["She hasn't finished her homework ___, so she can't go out.", "yet", ["just", "already", "ever"], "Hali tugatmagan: inkor + yet, gap oxirida."],
      ["A: Would you like some coffee? B: No, thanks. I have ___ had two cups this morning.", "already", ["yet", "never", "ever"], "Allaqachon ichdim: already. Yet darak gapda ishlatilmaydi."]
    ],
    error: [
      ["I have yet finished my homework.", "have yet finished", ["I", "my homework", "finished"], "Darak gapda yet ishlatilmaydi: I have already finished yoki I haven't finished it yet."],
      ["The film has started just, so hurry up!", "started just", ["The film", "so hurry up", "has"], "Just fe'l oldida, have/has dan keyin: The film has just started."],
      ["She has just went out, so you can't speak to her now.", "has just went", ["She", "so you can't speak", "to her now"], "Just + 3-shakl: has just gone."],
      ["We haven't eaten already, so we are very hungry.", "already", ["We", "eaten", "very hungry"], "Inkorda yet kerak: We haven't eaten yet."],
      ["They have arrived yet, and the party started.", "have arrived yet", ["They", "the party", "started"], "Darak gapda already (yoki just): They have already arrived."],
      ["He has already called yet, so you don't need to call him.", "already called yet", ["He", "so you don't need", "call him"], "Bitta gapda ikkalasi emas: He has already called."],
      ["I have finished just my homework.", "finished just", ["I have", "my homework", "I"], "Just fe'l oldida: I have just finished my homework."],
      ["I have seen yet that film, so I don't want to see it again.", "have seen yet", ["that film", "so I don't want", "to see it again"], "Darak gapda yet ishlatilmaydi: I have already seen that film."],
      ["My parents have left just, so they can't answer the phone.", "have left just", ["My parents", "so they can't answer", "the phone"], "Just have dan keyin: My parents have just left."],
      ["My sister has yet washed the dishes, so we can sit down.", "has yet washed", ["My sister", "the dishes", "so we can sit down"], "Darak gapda yet emas, already: My sister has already washed the dishes."],
      ["I've just meet Aziz in the street. He says hello.", "just meet", ["I've", "in the street", "He says hello"], "Just + 3-shakl: I've just met Aziz."],
      ["She hasn't yet decide what to wear.", "decide", ["She", "hasn't yet", "what to wear"], "Hasn't + 3-shakl: hasn't yet decided."]
    ],
    fill: [
      ["Qayta yozing (just): Dilnoza arrived a minute ago.", "Dilnoza has just arrived", [], "Hozirgina bo'lgan ish: has + just + 3-shakl."],
      ["Savol tuzing (yet): You have done your homework.", "Have you done your homework yet", [], "Savolda yet gap oxirida: Have you ... yet?"],
      ["Qayta yozing (already): The film started. It started before we arrived.", "The film has already started", [], "Kutilganidan oldin bo'lgan ish: already fe'l oldida."],
      ["Inkor qiling (yet): They have paid the bill.", "They haven't paid the bill yet", ["They have not paid the bill yet"], "Inkorda yet gap oxirida."],
      ["Qisqa javob bering: Have you finished yet? (Yo'q, hali emas.)", "No, not yet", ["No, I haven't", "No, I haven't yet"], "Hali emas: No, not yet. Yoki No, I haven't."],
      ["Qayta yozing (already): I have a cup of tea. It was before you came.", "I have already had a cup of tea", [], "Already have va 3-shakl orasida: have already had."]
    ],
    order: [
      ["I have just finished my homework and I am free now", "Just have va 3-shakl orasida; keyin natija."],
      ["Have you called your grandmother yet", "Savol + yet gap oxirida."],
      ["She has already bought tickets for the concert", "Already have/has dan keyin, 3-shakl oldida."],
      ["The bus hasn't arrived yet and we are late", "Inkorda yet gap oxirida (arrived dan keyin)."],
      ["My brother has just gone out to buy some bread", "Just + gone: hozirgina chiqib ketdi."],
      ["We haven't decided where to go on holiday yet", "Inkor + yet oxirida (decided dan keyin, savol qismidan oldin ham bo'ladi)."]
    ]
  },

  // ------------------------------------------------------------------ 17 for / since
  17: {
    trap: [
      ["I have lived in this city ___ ten years. I love it here.", "for", ["since", "from", "during"], "Muddat (ten years) — for. Since boshlang'ich payt bilan (since 2015) ishlatiladi."],
      ["She has worked in the bank ___ 2019.", "since", ["for", "from", "at"], "2019 — aniq boshlang'ich payt: since."],
      ["A: How long have you known Aziz? B: We have been friends ___ we were at school.", "since", ["for", "when", "during"], "Since + gap (we were at school): qachondan beri. 'For' faqat muddat bilan keladi."],
      ["They have been married ___ three months.", "for", ["since", "ago", "from"], "Uch oy — davomiylik: for three months."],
      ["Dilnoza has had her phone ___ last summer.", "since", ["for", "from", "in"], "Last summer — boshlang'ich payt: since last summer."],
      ["How long ___ you ___ English?", "have / studied", ["did / study", "are / studying", "do / study"], "How long + have + ega + 3-shakl: hozirgacha qancha vaqtdan beri. Did you study o'tgan, tugagan davrni anglatadi."],
      ["He has been ill ___ Monday, so he hasn't gone to work.", "since", ["for", "from", "at"], "Monday — boshlang'ich payt: since Monday."],
      ["We have waited for the bus ___ half an hour.", "for", ["since", "from", "during"], "Half an hour muddat: for. Since half an hour emas."],
      ["My parents have had this car ___ about fifteen years.", "for", ["since", "ago", "from"], "Fifteen years — muddat: for."],
      ["I haven't seen my cousin ___ last New Year.", "since", ["for", "ago", "from"], "Last New Year — boshlang'ich payt (oxirgi marta ko'rganimdan beri): since."],
      ["Sardor ___ in Samarkand since he was a child.", "has lived", ["lived", "have lived", "is living"], "Since + hozirgacha davom etgan holat: has lived. Sardor birlik."],
      ["A: How long has she been a teacher? B: She has been a teacher ___ eight years.", "for", ["since", "ago", "from"], "Eight years — muddat: for. 'Since eight years' xato."]
    ],
    error: [
      ["I have known him since five years.", "since five years", ["I have known", "him", "I"], "Muddat uchun for: I have known him for five years."],
      ["She has lived here for 2018.", "for 2018", ["She has lived", "here", "She"], "Yil — boshlang'ich payt: since 2018."],
      ["How long do you know Dilnoza?", "do you know", ["How long", "Dilnoza", "know"], "Hozirgacha davom etgan holat: How long have you known Dilnoza?"],
      ["We are friends since primary school.", "are", ["We", "friends", "since primary school"], "Present Perfect kerak: We have been friends since primary school."],
      ["He has worked in the factory since a long time.", "since a long time", ["He has worked", "in the factory", "He"], "Muddat uchun for: for a long time."],
      ["They have been in London for last Monday.", "for last Monday", ["They have been", "in London", "They"], "Boshlang'ich payt: since last Monday."],
      ["I am waiting here for two hours.", "am waiting", ["I", "here", "for two hours"], "Hozirgacha davom etgan: I have been waiting here for two hours."],
      ["How long have you been learn English?", "been learn", ["How long", "have you", "English"], "Have been + -ing: How long have you been learning English?"],
      ["She hasn't called me for Sunday.", "for Sunday", ["She hasn't called", "me", "She"], "Since Sunday: yakshanbadan beri."],
      ["My sister has a bike since her birthday.", "has", ["My sister", "a bike", "since her birthday"], "Present Perfect + since: My sister has had a bike since her birthday (have fe'li 'has had')."],
      ["They have been married since twenty years.", "since twenty years", ["They have been", "married", "They"], "Muddat — for: for twenty years."],
      ["It has rained for the morning.", "for the morning", ["It", "has rained"], "Since the morning: ertalabdan beri (boshlang'ich payt)."]
    ],
    fill: [
      ["Qayta yozing (for): I started living here in 2018 and it is 2023 now. (muddat)", "I have lived here for five years", [], "Muddat (5 yil) — for. 2018 dan beri — since 2018."],
      ["Qayta yozing (since): She has been a nurse for ten years. (2013)", "She has been a nurse since 2013", [], "Muddat o'rniga boshlang'ich payt: since + yil."],
      ["Savol tuzing (How long): He has lived in Tashkent for a year.", "How long has he lived in Tashkent", [], "How long + have/has + ega + 3-shakl."],
      ["Inkor qiling (for): I saw my uncle two years ago. (inkor, Present Perfect)", "I haven't seen my uncle for two years", ["I have not seen my uncle for two years"], "Inkor Present Perfect + for: oxirgi marta ko'rganimga ikki yil bo'ldi."],
      ["Qayta yozing (since): We last met on Sunday.", "We haven't met since Sunday", ["We have not met since Sunday"], "Yakshanbadan beri uchrashmadik: haven't + 3-shakl + since."],
      ["Qisqa javob bering (for): How long have you waited? (45 daqiqa)", "I have waited for forty-five minutes", ["I have waited for 45 minutes", "I've waited for forty-five minutes"], "Muddat uchun for: 45 daqiqa."]
    ],
    order: [
      ["I have lived in this city since I was a child", "Since + gap: bolaligimdan beri."],
      ["How long have you been waiting for the doctor", "How long + have + you + been + -ing."],
      ["She has worked in this hospital for twelve years", "Has worked + for + muddat."],
      ["We haven't seen our grandmother since last summer", "Inkor + since + boshlang'ich payt."],
      ["They have been friends since the first day of school", "Have been + since + payt."],
      ["My father has had the same job for twenty years", "Has had + for + muddat."]
    ]
  },

  // ------------------------------------------------------------------ 18 Present Perfect vs Past Simple
  18: {
    trap: [
      ["A: When did you buy that bag? B: I ___ it last Saturday.", "bought", ["have bought", "buy", "has bought"], "Last Saturday — aniq o'tgan vaqt: Past Simple (bought)."],
      ["A: Have you finished? B: Yes, I ___ it ten minutes ago.", "finished", ["have finished", "has finished", "finish"], "Ago aniq o'tgan vaqtni bildiradi: Past Simple."],
      ["I ___ my keys, so I can't open the door now.", "have lost", ["lost yesterday", "lose", "was losing"], "Natija hozirda (eshikni ocholmayman): Present Perfect. Aniq vaqt aytilmagan."],
      ["Mozart ___ more than six hundred pieces of music.", "wrote", ["has written", "have written", "writes"], "Mozart vafot etgan, davr tugagan: Past Simple (wrote)."],
      ["A: ___ you ever ___ a camel? B: Yes, once, in Bukhara.", "Have / ridden", ["Did / ride", "Do / ride", "Were / riding"], "Hayotiy tajriba haqida savol: Have you ever ridden...? Javobda aniq joy (in Bukhara) bo'lsa Past Simple (I rode)."],
      ["We ___ to Turkey last summer, and the weather was perfect.", "went", ["have gone", "go", "have been"], "Last summer — tugagan aniq davr: went."],
      ["She ___ in Paris for two years, but she moved to London in 2020.", "lived", ["has lived", "have lived", "is living"], "Endi Parijda yashamaydi, davr tugagan: Past Simple."],
      ["I ___ in Tashkent for ten years, and I still love living here.", "have lived", ["lived", "has lived", "was living"], "Hozir ham yashayapman: Present Perfect + for."],
      ["A: What time ___ the meeting ___? B: At ten, but I was late.", "did / start", ["has / started", "have / started", "does / start"], "Aniq vaqt (at ten) so'ralganda Past Simple: What time did the meeting start?"],
      ["Aziz ___ his homework, so now he can play outside.", "has finished", ["finished yesterday", "finishes", "was finishing"], "Natija hozir bilan bog'liq (endi o'ynashi mumkin): has finished."],
      ["My grandfather ___ in 1950 and ___ in the same village all his life.", "was born / lived", ["has been born / has lived", "is born / lived", "was born / has lived"], "Vafot etgan odam haqida hikoya: ikkalasi ham Past Simple."],
      ["I ___ this film three times. It's my favourite.", "have seen", ["saw", "was seeing", "had seen"], "Hayot davomidagi tajriba, vaqt aytilmagan: Present Perfect."]
    ],
    error: [
      ["I have seen him yesterday.", "have seen", ["I", "him", "yesterday"], "Yesterday bilan Past Simple: I saw him yesterday."],
      ["Did you ever visit London?", "Did", ["ever visit", "London"], "Hayotiy tajriba: Have you ever visited London?"],
      ["She has lived in Rome in 2015.", "has lived", ["She", "in Rome", "in 2015"], "2015 aniq yil: She lived in Rome in 2015."],
      ["We have went to the cinema last night.", "have went", ["We", "to the cinema", "last night"], "Last night aniq vaqt: We went to the cinema last night."],
      ["When have you bought that car?", "have you bought", ["When", "that car", "you"], "Aniq vaqt so'ralganda Past Simple: When did you buy that car?"],
      ["I lost my passport, so I can't travel now.", "lost", ["I", "so I can't travel", "now"], "Natija hozirda: I have lost my passport."],
      ["He has finished school in 2018 and then he started work.", "has finished", ["He", "in 2018", "he started work"], "2018 aniq yil: He finished school in 2018."],
      ["How long did you know Dilnoza? You still see her every day.", "did you know", ["How long", "Dilnoza", "still see her"], "Hozir ham tanish: How long have you known Dilnoza?"],
      ["They have lived here since ten years.", "since ten years", ["They have lived", "here", "They"], "Muddat uchun for: for ten years."],
      ["Mozart has composed beautiful music in the 18th century.", "has composed", ["Mozart", "beautiful music", "in the 18th century"], "18-asr — tugagan davr: Mozart composed beautiful music."],
      ["I didn't finish my homework yet, so I can't go out.", "didn't finish", ["I", "my homework", "so I can't go out"], "Yet va hozirgi natija: I haven't finished my homework yet."],
      ["She has called me two hours ago.", "has called", ["She", "me", "two hours ago"], "Ago bilan Past Simple: She called me two hours ago."]
    ],
    fill: [
      ["Qayta yozing (aniq vaqt): I have met her. It was last week.", "I met her last week", [], "Aniq vaqt (last week) — Past Simple."],
      ["Qayta yozing (natija hozir): I lost my phone. (hozir yo'q)", "I have lost my phone", ["I've lost my phone"], "Hozirgi natija — Present Perfect."],
      ["Savol tuzing (qachon): You bought this bag. (When)", "When did you buy this bag", [], "When bilan Past Simple: When + did + ega + fe'l."],
      ["Savol tuzing (hayotda): You have eaten sushi. (ever)", "Have you ever eaten sushi", [], "Tajriba savoli: Present Perfect + ever."],
      ["Qayta yozing (to'g'ri zamon): She has gone to Spain in 2019.", "She went to Spain in 2019", [], "Aniq yil — Past Simple."],
      ["Qayta yozing (hozirgacha): I live here. It started ten years ago. (for)", "I have lived here for ten years", [], "Hozirgacha davom etayotgan holat: Present Perfect + for."]
    ],
    order: [
      ["I have never seen such a beautiful sunset before", "Never + Present Perfect: tajriba, vaqt aniq emas."],
      ["She met her husband in Samarkand two years ago", "Ago aniq o'tgan vaqt: Past Simple."],
      ["Have you finished your homework yet", "Yet bilan Present Perfect savoli."],
      ["We went to the beach last summer and swam every day", "Last summer — tugagan davr, ketma-ket Past Simple."],
      ["He has lived in this house since he was born", "Since + gap bilan Present Perfect."],
      ["When did you move to this city", "Aniq vaqt so'ralganda did bilan Past Simple."]
    ]
  }
};
