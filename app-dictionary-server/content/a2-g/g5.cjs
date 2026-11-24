// Topics 34, 35, 48, 49
module.exports = {
  // ------------------------------------------------------------------ 34 So do I / Neither do I
  34: {
    trap: [
      ["A: I like spicy food. B: ___ I.", "So do", ["So am", "Neither do", "So like"], "Darak gap (like — Present Simple): So + do + I. Yordamchi fe'l asosiy gapdagi zamonga mos."],
      ["A: I don't like coffee. B: ___ I.", "Neither do", ["So do", "Neither don't", "Neither like"], "Inkor gapga qo'shilish: Neither + do + I. Neither o'zi inkor, shuning uchun do (don't emas)."],
      ["A: I am tired. B: ___ I.", "So am", ["So do", "Neither am", "So is"], "A da be fe'li (am), shuning uchun So am I."],
      ["A: I can't swim. B: ___ I.", "Neither can", ["So can", "Neither do", "Neither can't"], "Can't gapiga: Neither can I."],
      ["A: She went to Paris last year. B: So ___ I.", "did", ["do", "was", "went"], "O'tgan zamon (went): So did I."],
      ["A: I have never been to Japan. B: ___ I.", "Neither have", ["So have", "Neither do", "Neither haven't"], "Have never inkor: Neither have I."],
      ["A: I'm not hungry. B: ___ I.", "Neither am", ["So am", "Neither do", "Neither I'm"], "Am not gapiga: Neither am I."],
      ["A: I will help you. B: So ___ I.", "will", ["do", "am", "would"], "Will bilan: So will I."],
      ["A: He doesn't eat meat. B: ___ his wife.", "Neither does", ["So does", "Neither do", "Neither doesn't"], "He doesn't ga: Neither does + ega (his wife birlik)."],
      ["A: I love this song. B: ___ my sister.", "So does", ["So do", "Neither does", "So is"], "Sister birlik, love Present Simple: So does my sister."],
      ["A: I didn't see the film. B: ___ I.", "Neither did", ["So did", "Neither do", "Neither didn't"], "Didn't ga: Neither did I."],
      ["A: I was very nervous before the exam. B: So ___ I.", "was", ["did", "am", "were"], "Was ga: So was I."]
    ],
    error: [
      ["Aziz likes football, and so Dilnoza does.","so Dilnoza does",["Aziz likes football","and"],"So + yordamchi fe'l + ega: and so does Dilnoza."],
      ["I don't like coffee, and so does my sister.","so does",["I don't like coffee","my sister","and"],"Inkor gapga qo'shilish Neither bilan: and neither does my sister."],
      ["She is a doctor, and so do her parents.","so do",["She is a doctor","her parents","and"],"Birinchi gapda be fe'li (is), shuning uchun yordamchi fe'l ham be: and so are her parents."],
      ["I can't swim, and neither can't she.","neither can't",["I can't swim","she","and"],"Neither o'zi inkor: and neither can she (can't emas)."],
      ["We went to the party, and so do they.","so do they",["We went to the party","and"],"O'tgan zamon (went): and so did they."],
      ["He hasn't called, and neither I have.","neither I have",["He hasn't called","and"],"Yordamchi fe'l ega oldiga chiqadi: and neither have I."],
      ["I was very tired, and so did my friends.","so did my friends",["I was very tired","and"],"Birinchi gapda was (be): and so were my friends."],
      ["She doesn't eat meat, and neither doesn't her husband.","neither doesn't her husband",["She doesn't eat meat","and"],"Ikkita inkor bo'lmaydi: and neither does her husband."],
      ["They will come tomorrow, and so do I.","so do I",["They will come tomorrow","and"],"Will bilan: and so will I."],
      ["He didn't know the answer, and neither do I.","neither do I",["He didn't know the answer","and"],"O'tgan zamon inkor: and neither did I."],
      ["I've finished my work, and so is my sister.","so is my sister",["I've finished my work","and"],"Present Perfect (have/has): and so has my sister."],
      ["My mother is not at home, and neither do my father.","neither do my father",["My mother is not at home","and"],"Be fe'li (is not): and neither is my father."]
    ],
    fill: [
      ["Qo'shiling (ijobiy): 'I love chocolate.' - '___ I.'", "So do", [], "Darak gap Present Simple: So do I."],
      ["Qo'shiling (inkor): 'I don't speak French.' - '___ I.'", "Neither do", [], "Inkor: Neither do I."],
      ["Qo'shiling (o'tgan): 'I visited Samarkand last year.' - '___ I.'", "So did", [], "Past Simple: So did I."],
      ["Qo'shiling (be): 'I am very busy today.' - '___ I.'", "So am", [], "Be fe'li (am): So am I."],
      ["Qo'shiling (can): 'I can't drive.' - '___ I.'", "Neither can", [], "Can't: Neither can I."],
      ["Qo'shiling (have): 'I have never seen a ghost.' - '___ I.'", "Neither have", [], "Have never: Neither have I."]
    ],
    order: [
      ["I like pizza and so does my brother", "So does + ega: qo'shilish."],
      ["She doesn't eat meat and neither does he", "Inkor: neither does + ega."],
      ["I went to bed late and so did Aziz", "O'tgan zamon: so did."],
      ["We can't swim and neither can they", "Can't: neither can."],
      ["I have seen that film and so has she", "Present Perfect: so has."],
      ["He wasn't at home and neither was his wife", "Was: neither was."]
    ]
  },

  // ------------------------------------------------------------------ 35 indirect questions
  35: {
    trap: [
      ["Excuse me, do you know where ___?", "the station is", ["is the station", "does the station is", "the station"], "Ichki savolda so'z tartibi darak gapdagidek: where + ega + fe'l (the station is)."],
      ["Could you tell me what time ___ ?", "the bank opens", ["does the bank open", "opens the bank", "the bank open"], "Ichki savol: yordamchi fe'l (does) kerak emas, fe'l ega'ga mos shaklda: the bank opens."],
      ["I don't know where ___ yesterday.", "she went", ["did she go", "went she", "she did go"], "Ichki savol: ega + fe'l, did ishlatilmaydi."],
      ["Do you know how much ___ ?", "this bag costs", ["does this bag cost", "costs this bag", "cost this bag"], "How much + ega + fe'l: this bag costs."],
      ["Can you tell me who ___ the window?", "broke", ["did break", "broked", "does broke"], "Who ega bo'lsa, so'z tartibi o'zgarmaydi: who broke."],
      ["I wonder why ___ so late.", "he is", ["is he", "does he", "he does"], "Ichki savol: ega oldin: he is."],
      ["Do you know if ___ at home?", "she is", ["is she", "does she", "she does"], "Ha / yo'q ichki savol: if + ega + fe'l."],
      ["She asked me where ___ .", "I lived", ["did I live", "lived I", "I did live"], "Ichki savol (o'tgan): ega + fe'l (lived)."],
      ["Could you tell me whether ___ any rooms free?", "there are", ["are there", "do there are", "there is"], "Whether + ega + fe'l: there are."],
      ["Do you know how long ___ ?", "the film is", ["is the film", "does the film is", "the film does"], "How long + ega + fe'l."],
      ["I'd like to know what ___ for dinner.", "we are having", ["are we having", "we having", "do we have"], "Ichki savol: we are having."],
      ["Can you tell me when ___ ?", "the train leaves", ["does the train leave", "leaves the train", "the train does leave"], "When + ega + fe'l."]
    ],
    error: [
      ["Do you know where is the library?","where is the library",["Do you","know"],"Ichki savolda so'z tartibi darak gapdagidek: where the library is."],
      ["Can you tell me what time does the film start?","what time does the film start",["Can you","tell me"],"Ichki savol: what time the film starts (does kerak emas)."],
      ["I don't know where did he go.","where did he go",["I","don't know"],"Ichki savol: where he went."],
      ["Could you tell me how much does it cost?","how much does it cost",["Could you","tell me"],"Ichki savol: how much it costs."],
      ["Do you know who is she?","who is she",["Do you","know"],"Ichki savol: who she is."],
      ["I wonder why is he late today.","why is he",["I wonder","late today"],"Ichki savol: why he is late today."],
      ["She asked me where did I buy the bag.","where did I buy",["She asked me","the bag"],"Ichki savol: where I bought the bag."],
      ["I know the way, but I don't know where is the museum.","where is the museum",["I know the way","but I don't know"],"Ichki savol: where the museum is."],
      ["Do you know if does he speak English?","does he speak",["Do you know if","English"],"If + ega + fe'l: if he speaks English."],
      ["I'd like to know when does the shop open.","when does the shop open",["I'd like","to know"],"When the shop opens."],
      ["Could you tell me what is your name?","what is your name",["Could you","tell me"],"Ichki savol: what your name is."],
      ["Do you know how old is Dilnoza?","how old is Dilnoza",["Do you","know"],"how old Dilnoza is."]
    ],
    fill: [
      ["Odobli savolga aylantiring: Where is the station? (Do you know ...?)", "Do you know where the station is", [], "Ichki savol: where + ega + fe'l."],
      ["Aylantiring: What time does the shop open? (Could you tell me ...?)", "Could you tell me what time the shop opens", [], "Ichki savolda does ishlatilmaydi: the shop opens."],
      ["Aylantiring: Where did she go? (I don't know ...)", "I don't know where she went", [], "Ichki savol, o'tgan zamon: where she went."],
      ["Aylantiring: How much is this bag? (Can you tell me ...?)", "Can you tell me how much this bag is", [], "Ichki savol: how much + ega + fe'l."],
      ["Aylantiring (if): Is she at home? (Do you know ...?)", "Do you know if she is at home", ["Do you know whether she is at home"], "Ha/yo'q savol: if / whether + ega + fe'l."],
      ["Aylantiring: Why is he angry? (I wonder ...)", "I wonder why he is angry", [], "Ichki savol: why he is angry."]
    ],
    order: [
      ["Do you know where the bus station is", "Ichki savol: where + ega + fe'l."],
      ["Could you tell me what time the shop opens", "Ichki savolda yordamchi fe'l yo'q."],
      ["I don't know where he went yesterday", "Ichki savol, o'tgan zamon: went."],
      ["Can you tell me how much this book costs", "How much + ega + fe'l."],
      ["She asked me if I was ready for the exam", "If bilan ichki savol."],
      ["I wonder why he is late again today", "Why + ega + fe'l."]
    ]
  },

  // ------------------------------------------------------------------ 48 adjective vs adverb
  48: {
    trap: [
      ["She speaks English very ___ . I can understand her easily.", "clearly", ["clear", "clears", "clearness"], "Fe'lni (speaks) tasvirlash uchun ravish: clearly."],
      ["He is a very ___ driver, so he never has accidents.", "careful", ["carefully", "care", "carefulness"], "Otni (driver) tasvirlash uchun sifat: careful."],
      ["The children played ___ in the garden all afternoon.", "happily", ["happy", "happier", "happiness"], "Fe'l (played) — ravish: happily."],
      ["This soup tastes ___ . Did you add a lot of salt?", "salty", ["saltily", "salt", "saltiness"], "Taste (ta'm tutmoq) — bog'lovchi fe'l, keyin sifat: salty."],
      ["Aziz works very ___ , so his boss likes him.", "hard", ["hardly", "harder", "hardness"], "Hard — sifat va ravish bir xil: work hard. Hardly esa 'deyarli yo'q' degan boshqa ma'no."],
      ["He drives ___ than his father. His father is very careful.", "more carefully", ["more careful", "carefuller", "most carefully"], "Ravish qiyoslanganda more + ravish: more carefully than. Sifat shakli (more careful) fe'lni tasvirlamaydi."],
      ["She sings ___ . Everyone loves her voice.", "beautifully", ["beautiful", "beauty", "beautifulness"], "Sings fe'lini tasvirlaydi: beautifully."],
      ["The film was ___ . I fell asleep.", "boring", ["boringly", "bored", "bore"], "Was dan keyin sifat: boring."],
      ["He answered the question ___ and got a high mark.", "correctly", ["correct", "correctness", "corrects"], "Answered fe'lini tasvirlaydi: correctly."],
      ["It is raining ___ today. We can't go outside.", "heavily", ["heavy", "heavier", "heaviness"], "Raining fe'liga ravish: heavily."],
      ["You look ___ today. Did you sleep well?", "good", ["well", "goodly", "gooder"], "Look (ko'rinmoq) bog'lovchi fe'l: sifat good. Well — ravish."],
      ["She drives ___ . She has never had an accident.", "carefully", ["careful", "care", "carefuller"], "Fe'lga ravish: carefully."]
    ],
    error: [
      ["He drives very quick.", "quick", ["He", "drives", "very"], "Fe'lni tasvirlash uchun ravish: He drives very quickly."],
      ["She is a carefully driver.", "carefully", ["She is", "a", "driver"], "Otni tasvirlash uchun sifat: She is a careful driver."],
      ["The test was easily, so everybody passed.", "easily", ["The test was", "so", "everybody passed"], "Was dan keyin sifat: The test was easy."],
      ["He speaks English very good.", "good", ["He", "speaks English", "very"], "Ravish kerak: He speaks English very well."],
      ["They worked hardly on the project.", "hardly", ["They", "worked", "on the project"], "Hardly — deyarli yo'q. Ravish hard: They worked hard."],
      ["She looks happily today.", "happily", ["She", "looks", "today"], "Look dan keyin sifat: She looks happy."],
      ["The baby is sleeping quiet.", "quiet", ["The baby", "is sleeping"], "Fe'lga ravish: The baby is sleeping quietly."],
      ["This pizza smells deliciously.", "deliciously", ["This pizza", "smells"], "Smell dan keyin sifat: This pizza smells delicious."],
      ["I can hardly to wait for the holiday.", "to wait", ["I", "can hardly", "for the holiday"], "Hardly + asosiy fe'l: I can hardly wait."],
      ["He arrived lately for the meeting.", "lately", ["He", "arrived", "for the meeting"], "Kech kelgan: late (ravish ham late). Lately — 'yaqinda'."],
      ["She plays the piano very beautiful.", "beautiful", ["She", "plays the piano", "very"], "Ravish: She plays the piano very beautifully."],
      ["It was a terribly accident.", "terribly", ["It was", "a", "accident"], "Sifat kerak: It was a terrible accident."]
    ],
    fill: [
      ["Ravishga aylantiring: She is a quick runner. -> She runs ___.", "quickly", [], "Sifat + ly = ravish: quick - quickly."],
      ["Sifatga aylantiring: He sings beautifully. -> He has a ___ voice.", "beautiful", [], "Otni tasvirlash uchun sifat: beautiful voice."],
      ["To'ldiring: He is a good player. He plays ___.", "well", [], "Good (sifat) — well (ravish)."],
      ["To'ldiring: The soup smells ___ . (delicious)", "delicious", [], "Smell dan keyin sifat."],
      ["Qayta yozing (ravish): He is a slow walker.", "He walks slowly", [], "Sifat o'rniga ravish: slow - slowly."],
      ["Qayta yozing (sifat): She dances gracefully. -> She is a ___ dancer.", "graceful", [], "Sifat: graceful."]
    ],
    order: [
      ["She speaks English very clearly and slowly", "Fe'lni tasvirlovchi ravishlar."],
      ["He is a careful driver and never has accidents", "Sifat + ot: careful driver."],
      ["The children played happily in the garden all day", "Fe'l + ravish: played happily."],
      ["This soup tastes salty and a little bit cold", "Taste + sifat."],
      ["You look tired did you sleep well last night", "Look + sifat; sleep + well."],
      ["Aziz works hard so his boss likes him a lot", "Hard — sifat va ravish bir xil."]
    ]
  },

  // ------------------------------------------------------------------ 49 comparatives
  49: {
    trap: [
      ["My brother is ___ than me. He is 1.85 m and I am 1.75 m.", "taller", ["more tall", "tallest", "the taller"], "Qisqa sifat + -er + than: taller than."],
      ["This book is ___ than that one. It has a better plot.", "more interesting", ["interestinger", "most interesting", "the more interesting"], "Uzun sifat: more + sifat + than."],
      ["Today is ___ than yesterday. Take a warm coat.", "colder", ["more cold", "coldest", "the colder"], "Qisqa sifat: colder than."],
      ["Tashkent is ___ than Samarkand.", "bigger", ["more big", "biger", "biggest"], "Bitta unli + bitta undosh: undosh ikki marta yoziladi: bigger."],
      ["Your English is ___ than mine. You speak more fluently.", "better", ["more good", "gooder", "best"], "Good - better - best (qoidasiz)."],
      ["The weather today is ___ than yesterday. It's getting colder.", "worse", ["more bad", "badder", "worst"], "Bad - worse - worst."],
      ["This exercise is ___ than the last one. I made fewer mistakes.", "easier", ["more easy", "easyer", "easiest"], "-y bilan tugasa: i + er: easier."],
      ["Gold is ___ than silver.", "more expensive", ["expensiver", "most expensive", "more expensiver"], "Uzun sifat: more expensive than."],
      ["A car is ___ than a bicycle.", "faster", ["more fast", "fastest", "fastly"], "Qisqa sifat: faster than."],
      ["She is ___ than her sister. She has a better job.", "more successful", ["successfuler", "most successful", "more successfuler"], "Uzun sifat: more successful."],
      ["My new phone is ___ than my old one.", "lighter", ["more light", "lightest", "the lighter"], "Qisqa sifat: lighter than."],
      ["A: Which is ___ , Moscow or Tashkent? B: Moscow is much colder.", "colder", ["more cold", "coldest", "the colder"], "Ikki narsa: colder."]
    ],
    error: [
      ["My sister is taller that me.", "that", ["My sister is taller", "me"], "Than: My sister is taller than me."],
      ["This film is more good than that one.", "more good", ["This film is", "than that one"], "Good — better: This film is better than that one."],
      ["He is more tall than his brother.", "more tall", ["He is", "than his brother"], "Qisqa sifat: taller."],
      ["Today is hoter than yesterday.", "hoter", ["Today is", "than yesterday"], "Undosh ikkilanadi: hotter."],
      ["This exercise is more easy than the last one.", "more easy", ["This exercise is", "than the last one"], "Easy - easier."],
      ["Gold is expensiver than silver.", "expensiver", ["Gold is", "than silver"], "Uzun sifat: more expensive."],
      ["Her English is gooder than mine.", "gooder", ["Her English is", "than mine"], "Good - better: better than mine."],
      ["Samarkand is more old than Tashkent.", "more old", ["Samarkand is", "than Tashkent"], "Old - older (qisqa sifat)."],
      ["This bag is more cheap than that one.", "more cheap", ["This bag is", "than that one"], "Cheap - cheaper."],
      ["My room is more small than yours.", "more small", ["My room is", "than yours"], "Small - smaller."],
      ["She speaks more quick than me.", "more quick", ["She speaks", "than me"], "Quickly — more quickly yoki quick (fast) - faster."],
      ["The weather is more bad today.", "more bad", ["The weather is", "today"], "Bad - worse: The weather is worse today."]
    ],
    fill: [
      ["Qiyoslang: Tom is 1.80 m. Ali is 1.70 m. Tom is ___ than Ali.", "taller", [], "Qisqa sifat: tall - taller."],
      ["Qiyoslang: This book is interesting. That book is boring. This book is ___ than that one.", "more interesting", [], "Uzun sifat: more + sifat."],
      ["Qiyoslang: The weather today is bad. Yesterday it was okay. Today is ___ than yesterday.", "worse", [], "Bad - worse."],
      ["Qayta yozing: My house is small. Your house is bigger. My house is ___ than yours.", "smaller", [], "Small - smaller."],
      ["Qayta yozing: Football is more popular than tennis. Tennis is ___ than football.", "less popular", [], "Teskari: less + sifat."],
      ["Savolga javob bering (qiyosiy): Which is faster, a plane or a train? (plane)", "A plane is faster than a train", ["A plane is faster"], "Qisqa sifat: faster than."]
    ],
    order: [
      ["My brother is taller than me but I am older", "Qiyosiy daraja + than."],
      ["This book is more interesting than that one", "Uzun sifat: more ... than."],
      ["Today is colder than yesterday so wear a coat", "Qisqa sifat + -er."],
      ["She speaks English better than her sister", "Ravish better."],
      ["The new phone is lighter and cheaper than the old one", "Ikki qiyosiy daraja."],
      ["Samarkand is older than Tashkent but Tashkent is bigger", "Ikkita qiyosiy daraja: older than va bigger."]
    ]
  }
};
