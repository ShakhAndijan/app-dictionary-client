const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
const P = (...paras) => paras.join("\n\n");
module.exports = [
  {
    topic: "Evening news bulletin: river flooding",
    audioText: P(
      "Good evening, and welcome to the nine o'clock news on Radio Calder Valley. Our main story tonight is the flooding in the town of Marwick, where the river burst its banks early this morning. Police say that about three hundred and fifty residents were asked to leave their homes, although only thirteen families have so far accepted a place in the emergency shelter at the sports hall. Most people have chosen to stay with relatives instead. A council spokeswoman, Helen Draper, first told reporters that the water had reached two metres in the high street, but an hour later she corrected herself and said it was one and a half metres, which is still the highest level since nineteen ninety-eight.",
      "The main road bridge has been closed to all traffic, and engineers will inspect it tomorrow morning. Buses will not run between Marwick and Thornby until at least Friday, but the railway line is open, and the company has promised extra trains at seven and again at eight in the morning. Drivers are told not to use the old mill road, which many people suggested as a shortcut, because it is also under water. Schools in the town will stay shut tomorrow, though the primary school in the neighbouring village of Ashby will open as normal.",
      "Our reporter, Dilnoza Rakhimova, spoke to a baker whose shop was flooded. Mr Okafor said he had not expected the river to rise so quickly, because the last warning, on Sunday, had said the rain would stop by midnight. He admitted that he had ignored a text message from the council the previous evening, thinking it was an advertisement. He lost all his flour and two ovens, but he says he is not angry with anyone. What bothers him, he said, is that the flood barrier promised after the last flood was never built. The council answered that the money had been approved but that building work was delayed by a dispute over the land, and that it would now start in spring.",
      "Volunteers have been brilliant, according to the shelter manager. More than sixty people turned up with blankets and hot food, so the organisers have asked people to stop bringing clothes, since the hall is already full of them. What is still needed is bottled water and baby food, and these can be left at the library until noon. The weather service expects light rain overnight, but the heavy rain forecast for Thursday is now expected to miss the valley and move north. Even so, the river will not return to normal levels for several days. We will bring you more news at ten, when we speak to the mayor."
    ),
    qs: [
      Q("How many families have accepted a place in the shelter?", "Thirteen", ["Thirty", "Thirteen", "Three hundred and fifty"]),
      Q("According to the spokeswoman's correction, how deep was the water in the high street?", "One and a half metres", ["Two metres", "One and a half metres", "Half a metre"]),
      Q("Which transport will definitely not be available until Friday?", "Buses between Marwick and Thornby", ["Trains to Thornby", "Buses between Marwick and Thornby", "Buses to Ashby"]),
      Q("Why did Mr Okafor ignore the council's message?", "He thought it was an advertisement", ["He was asleep", "He thought it was an advertisement", "He did not have a phone"]),
      Q("Why was the flood barrier never built?", "There was a dispute over the land", ["The money was refused", "There was a dispute over the land", "Engineers found the bridge unsafe"]),
      Q("What are people asked to stop bringing to the shelter?", "Clothes", ["Blankets", "Clothes", "Hot food"]),
      TF("The primary school in Ashby will be closed tomorrow.", false, "It will open as normal; only the schools in Marwick are shut."),
      TF("The heavy rain forecast for Thursday is now expected to miss the valley.", true),
      Q("Most residents who left their homes are staying with ___."),
      Q("Water and baby food can be left at the ___ until noon.")
    ].map((q, i) => i === 8 ? { ...q, answer: "relatives" } : i === 9 ? { ...q, answer: "library" } : q)
  },
  {
    topic: "Radio call-in about a new bus lane",
    audioText: P(
      "Welcome back to Morning Talk, I'm Jamshid Karimov, and today we are discussing the new bus lane on Victoria Street, which opened on Monday. Our first caller was Brenda, a nurse, who said she was delighted. Her journey to the hospital used to take fifty minutes, and now it takes thirty-five. Jamshid reminded her that the council had promised twenty-five, and Brenda laughed and said she would happily accept any improvement at all, because she starts work at six and hates being late.",
      "The second caller, a taxi driver named Gareth, was far less happy. He said the bus lane was a ridiculous idea because taxis are not allowed to use it, and he had already lost two customers who refused to wait in traffic. He admitted, however, that he had not read the whole leaflet, and Jamshid explained that taxis may use the lane after seven in the evening. Gareth said that was fine for night work but useless for him, since most of his regular passengers travel in the morning. He suggested that the council should have asked drivers before spending the money, and he was surprised to hear that a public meeting had taken place in March.",
      "Next came a shopkeeper, Mrs Yusupova, who owns a flower stall near the market. She was not against the lane itself, but she complained that delivery vans could no longer stop outside her shop. Her supplier now has to park two streets away and carry the boxes, which takes an extra twenty minutes. She said that she had called the council twice, and nobody had answered. Jamshid promised to pass her number to the transport department, which he said would be listening to the programme. At that moment a producer told him that the department's director, Mr Lindqvist, was already on the other line.",
      "Mr Lindqvist said he understood the complaints and would allow vans to stop in the lane for ten minutes between ten and noon, starting from next month. He did not agree, though, that the scheme should be cancelled. Fines for private cars in the lane, he said, would begin only after a fortnight of warnings, so nobody has been charged yet. The last caller, a student called Marcus, said that he would prefer a cycle path to a bus lane, and that he had stopped cycling to college because of the fumes. Jamshid thanked everybody and said the council would publish traffic figures in six weeks. After the news and weather, we turn to the story of a dog that has learned to catch the bus on its own."
    ),
    qs: [
      Q("How long does Brenda's journey take now?", "Thirty-five minutes", ["Fifty minutes", "Twenty-five minutes", "Thirty-five minutes"]),
      Q("Why was Gareth unhappy about the lane?", "Taxis cannot use it during the day", ["Taxis cannot use it during the day", "He had to pay a fine", "He was not allowed to park at all"]),
      Q("When do most of Gareth's regular passengers travel?", "In the morning", ["In the evening", "At night", "In the morning"]),
      Q("What is Mrs Yusupova's problem?", "Delivery vans cannot stop outside her shop", ["Her flowers are damaged by fumes", "Delivery vans cannot stop outside her shop", "Customers cannot reach the market"]),
      Q("What change will Mr Lindqvist make?", "Vans may stop in the lane for ten minutes in the morning", ["Taxis may use the lane all day", "Vans may stop in the lane for ten minutes in the morning", "The lane will close at noon"]),
      Q("Why did Marcus stop cycling to college?", "The fumes bothered him", ["The fumes bothered him", "He was fined", "There was no cycle path at all"]),
      TF("Private cars in the lane have already been fined.", false, "There is a fortnight of warnings first, so nobody has been charged yet."),
      TF("The council will publish traffic figures in six weeks.", true),
      Q("Brenda hates being late because she starts work at ___."),
      Q("Mrs Yusupova owns a ___ stall near the market.")
    ].map((q, i) => i === 8 ? { ...q, answer: "six" } : i === 9 ? { ...q, answer: "flower" } : q)
  },
  {
    topic: "A mayor's speech at a library reopening",
    audioText: P(
      "Good afternoon, everybody, and thank you for coming in spite of the rain. I had planned to cut the ribbon outside, but as you can see, we have moved everything into the reading hall, which, I must say, looks better than I imagined. I am Mayor Aziza Nurmatova, and it gives me great pleasure to reopen the Central Library after eighteen months of building work. When we started, I promised it would take twelve months. I was wrong, and I apologise, but I hope you will agree that the delay was worth it.",
      "Let me remind you why we did this. Fifteen years ago the building had no lift, and an elderly visitor had to be carried up the stairs. Today there are two lifts, a ramp, and a quiet room for people who find crowds difficult. The collection has grown to nearly ninety thousand books, though I should point out that only about half are on the open shelves; the rest are in the basement and can be ordered at the desk. Some critics said we should have spent the money on schools instead. I understand that view, and I do not think it is silly. But the library is where many children do their homework when it is too noisy at home.",
      "The total cost was four point two million, which is more than the three point eight million in the original budget. Most of the difference came from the roof, which turned out to be in a much worse state than the surveyors had said. Two thirds of the money came from the national lottery fund, and the remainder from the city, so I want to thank every person in this country who bought a lottery ticket. I also want to thank Mr Haddad, the chief architect, who, I am told, has not had a proper holiday since the summer before last.",
      "Now a few practical things. The library will open at eight in the morning and close at nine at night, except on Sundays, when it closes at five. Membership is free for anyone under eighteen, and for adults it costs five pounds a year, though pensioners pay nothing. There will be no fines for late books during the first month, which I expect will make some of you very happy. Finally, a change to the programme: the author who was supposed to give today's talk is ill, so instead our youngest member, nine-year-old Timur, will read from his favourite story. I am told that he has been practising for a week and is not at all nervous. Please welcome him, and enjoy your library."
    ),
    qs: [
      Q("Why was the ceremony held indoors?", "It was raining", ["It was raining", "The building was unfinished", "The mayor was ill"]),
      Q("How long did the building work take?", "Eighteen months", ["Twelve months", "Fifteen months", "Eighteen months"]),
      Q("About how many books are on the open shelves?", "About forty-five thousand", ["About ninety thousand", "About forty-five thousand", "About nine thousand"]),
      Q("What mainly caused the budget to be exceeded?", "The state of the roof", ["The new lifts", "The state of the roof", "The architect's fee"]),
      Q("What is the mayor's attitude to the critics who wanted the money spent on schools?", "She respects their opinion", ["She thinks they are silly", "She respects their opinion", "She ignores them"]),
      Q("Who will give the talk instead of the author?", "A nine-year-old member", ["The chief architect", "A nine-year-old member", "The mayor herself"]),
      TF("Adults can join the library for nothing.", false, "Adults pay five pounds a year; only pensioners and under-eighteens join free."),
      TF("The library closes earlier on Sundays than on other days.", true),
      Q("The library now has two lifts, a ramp and a quiet ___."),
      Q("Two thirds of the money came from the national ___ fund.")
    ].map((q, i) => i === 8 ? { ...q, answer: "room" } : i === 9 ? { ...q, answer: "lottery" } : q)
  },
  {
    topic: "Interview with a food bank volunteer",
    audioText: P(
      "In today's programme, our reporter Kamila Ergasheva interviews Daniel Mbeki, a volunteer at the Eastside Food Bank. Daniel explains that he began helping three years ago, soon after he lost his job as a warehouse manager. He expected to stay for a month, until he found something new, but he now works there four days a week, even though he has been employed again since last spring. Kamila asks whether that annoys his new employer, and Daniel laughs and says that his boss actually lets him leave early on Thursdays.",
      "Kamila asks what surprises people most. Daniel answers that visitors are rarely who you expect. Many are not unemployed at all. They are teachers, drivers or care workers whose wages simply do not cover rent and food in the same month. Last winter the food bank served about four hundred families a week, compared with two hundred and forty the winter before. He says he used to believe that the problem would shrink as the economy recovered, but he no longer thinks so, because prices have risen faster than salaries.",
      "Asked about the biggest difficulty, Daniel does not mention money. It is storage. Fresh vegetables arrive on Mondays and Fridays, and half of them must be handed out within two days. The charity has one small cold room, which holds only a third of what is delivered. A supermarket has offered a second fridge, but the volunteers cannot accept it until they find an electrician who will install it without charge. Daniel jokes that if any listener knows one, he will make that person a cup of tea every day for a year. Kamila points out that he does not drink tea himself, only coffee, and Daniel says that is exactly why the offer is generous.",
      "She then asks whether he has ever wanted to give up. He says only once, last December, when a man shouted at him because the bread had run out. Afterwards he sat in the car for ten minutes feeling miserable. But the next morning the same man came back to apologise and stayed to help carry boxes, and he is still there. Daniel believes the lesson is not to take anger personally. He adds that the food bank always needs drivers more than cash, because the van is old and fuel is expensive. People who are interested can call the number on the website, or simply come on a Saturday morning, when new volunteers are given a short training session before they start. Daniel says there is no need to be strong; patience matters much more than muscles."
    ),
    qs: [
      Q("Why did Daniel first start volunteering?", "He had lost his job", ["He had retired", "He had lost his job", "His employer sent him"]),
      Q("How often does Daniel volunteer now?", "Four days a week", ["Three days a week", "Four days a week", "Only on Thursdays"]),
      Q("According to Daniel, who often uses the food bank?", "Working people on low wages", ["Mostly unemployed people", "Working people on low wages", "Students and pensioners"]),
      Q("How many families a week did the food bank serve last winter?", "About four hundred", ["About forty", "About two hundred and forty", "About four hundred"]),
      Q("What does Daniel say is the biggest difficulty?", "Storing fresh food", ["Lack of money", "Storing fresh food", "Finding volunteers"]),
      Q("What does the food bank need more than money?", "Drivers", ["Drivers", "Fridges", "Training sessions"]),
      TF("Daniel drinks tea every day.", false, "He only drinks coffee, which is why his tea offer is generous."),
      TF("The man who shouted at Daniel came back the next morning.", true),
      Q("The cold room holds only a ___ of what is delivered."),
      Q("New volunteers receive a short ___ session on Saturday mornings.")
    ].map((q, i) => i === 8 ? { ...q, answer: "third" } : i === 9 ? { ...q, answer: "training" } : q)
  },
  {
    topic: "Documentary narration: the first newspaper in a market town",
    audioText: P(
      "In the early eighteen hundreds, the market town of Eldermere had no newspaper at all. News arrived by letter, by coach, or, most often, by gossip. That changed in eighteen twenty-three, when a young printer named Josiah Pell bought a second-hand press for forty pounds, a sum which took him six years to save. Many people assumed that he would fail within a year. In fact the first issue, which appeared on a rainy Saturday in October, sold out by noon, although it contained only four pages and two of them were advertisements.",
      "Pell was not a talented writer, and he knew it. Instead he relied on a network of correspondents: a vicar who sent reports from the villages, a coach driver who collected stories along his route, and, rather surprisingly, a schoolgirl called Martha Lowe, who wrote about local events under a man's name because her father disapproved. Historians once believed that the paper's best articles were by Pell himself. It was only in nineteen sixty, when a box of letters was discovered in an attic, that the truth emerged, and Martha is now remembered as the town's first woman journalist.",
      "The paper was never without trouble. In eighteen thirty-one the town's magistrate sued Pell for printing a story that said he had taken bribes. Pell lost the case and paid a heavy fine, but the publicity doubled his readers. Thereafter he was more careful, checking each claim with two sources, a habit which he called his golden rule. Ironically, the one big mistake of his career was not about corruption at all. In eighteen forty he announced the death of a popular doctor, who walked into the printing office the next day, very much alive, and asked for a copy to keep.",
      "By the eighteen sixties the paper had sixteen pages, a staff of nine and a circulation of three thousand, which was remarkable for a town of only eleven thousand people. Then came the telegraph and the railway, and national newspapers began to arrive by the morning train. Local readers did not abandon Pell's paper, but they began to treat it differently: no longer as the place where they learned what had happened in the world, but as the place where they learned what had happened in their street. Some experts argue that this is exactly the role local media should play today. The press itself was eventually sold for scrap, but the doctor's copy of that famous issue is still on display in the town museum."
    ),
    qs: [
      Q("How long did it take Josiah Pell to save for his press?", "Six years", ["One year", "Six years", "Forty years"]),
      Q("What happened to the first issue?", "It sold out by noon", ["It sold out by noon", "Nobody bought it", "It had sixteen pages"]),
      Q("Why did Martha Lowe write under a man's name?", "Her father disapproved", ["Her father disapproved", "The vicar asked her to", "Pell wanted it"]),
      Q("How did historians learn the truth about her articles?", "A box of letters was found in an attic", ["Pell confessed before he died", "A box of letters was found in an attic", "The vicar told them"]),
      Q("What was the effect of the magistrate's lawsuit?", "The paper's readership doubled", ["The paper closed", "The paper's readership doubled", "Pell stopped writing"]),
      Q("After the telegraph and railway arrived, readers used Pell's paper mainly for ___.", "news about their own streets", ["national politics", "news about their own streets", "advertisements"]),
      TF("Pell wrote most of the paper's best articles himself.", false, "Many were written by his correspondents, especially Martha Lowe."),
      TF("The doctor's copy of the famous issue is in the town museum.", true),
      Q("Pell called his habit of checking each claim with two sources his ___ rule."),
      Q("By the eighteen sixties the paper had a staff of ___.")
    ].map((q, i) => i === 8 ? { ...q, answer: "golden" } : i === 9 ? { ...q, answer: "nine" } : q)
  },
  {
    topic: "Community meeting about a playground",
    audioText: P(
      "The meeting at Greenfield Community Centre began ten minutes late, because the chairperson, Mrs Odinaeva, had to find enough chairs. About ninety residents had come, far more than the thirty the organisers expected, which she took as proof that people care about the old playground on Mill Lane. She began by explaining the situation: the council had offered to pay half the cost of a new playground, provided the neighbourhood could raise the other half, which comes to about eighteen thousand.",
      "The first speaker, a father named Rob, argued that safety was the only issue that mattered. Two children had broken arms last year on the old climbing frame, and he thought it should be removed immediately. A retired teacher, Mr Samadov, disagreed. He said that children needed some risk, and that the real problem was the broken fence, which let dogs in. Several people clapped, though a young mother pointed out that she would rather have a fence and a safe climbing frame. Mrs Odinaeva suggested that it was not necessary to choose between the two.",
      "Then came the question of money. A local café owner, Fatima, offered to hold a cake sale every Sunday for three months, and a builder promised to lend a digger free of charge for two days. Someone suggested asking the big supermarket on the ring road, but Mr Samadov warned that it had refused a similar request last year. Another man proposed that every household should pay twenty a year, and this idea was received badly. One woman said that many pensioners could not afford it, and that a voluntary contribution would be fairer. After a lot of discussion the chairperson put the idea aside.",
      "The most surprising moment came near the end. A twelve-year-old boy, Anvar, stood up at the back and asked whether anyone had asked the children what they wanted. There was a short silence, and then Mrs Odinaeva admitted that nobody had. She promised to invite pupils from the local school to draw their ideas, and she said the final design would not be chosen until all the drawings had been seen. The vote was therefore postponed from next Tuesday to the end of the month. Before everyone left, volunteers signed up for a working group of seven, which will meet at the café on Thursday evenings. Mrs Odinaeva closed the meeting at nine, apologising for the length, but several people told her afterwards it was the most interesting meeting they had ever attended."
    ),
    qs: [
      Q("Why did the meeting start late?", "The chairperson had to find more chairs", ["The chairperson was ill", "The chairperson had to find more chairs", "Too few people had arrived"]),
      Q("Roughly how many residents came to the meeting?", "About ninety", ["About thirty", "About nineteen", "About ninety"]),
      Q("What has the council offered?", "To pay half the cost", ["To pay the whole cost", "To pay half the cost", "To build the fence"]),
      Q("What does Mr Samadov think is the real problem?", "The broken fence", ["The old climbing frame", "The broken fence", "The lack of money"]),
      Q("Why was the idea of a yearly payment dropped?", "Many pensioners could not afford it", ["The builder refused", "Many pensioners could not afford it", "The council forbade it"]),
      Q("What happened to the vote?", "It was postponed until the end of the month", ["It was cancelled", "It was held on Tuesday", "It was postponed until the end of the month"]),
      TF("The supermarket on the ring road has agreed to help.", false, "It had refused a similar request last year."),
      TF("The working group will meet on Thursday evenings.", true),
      Q("The neighbourhood must raise about ___ thousand."),
      Q("The café owner offered to hold a ___ sale every Sunday.")
    ].map((q, i) => i === 8 ? { ...q, answer: "eighteen" } : i === 9 ? { ...q, answer: "cake" } : q)
  },
  {
    topic: "A journalist's voice message to her editor",
    audioText: P(
      "Hi Sanjar, it's Leila. I'm calling from the train, so forgive me if the line breaks up. I wanted to update you on the harbour story before tomorrow's meeting. First, the good news: the interview with the port director is confirmed. I said Wednesday in my email, but it's actually Thursday at half past two, because he has a hospital appointment on Wednesday. Please tell Marta, because she's booked the photographer for the wrong day.",
      "Second, the numbers. I told you last week that the port had lost about fifteen jobs. I've now seen the official document, and the figure is fifty, not fifteen. I'm sorry about the mistake; I misread the page. It's still a story, and, frankly, a bigger one. The company says that the jobs were lost through natural leaving and retirement, but two former workers I spoke to yesterday claim that at least twenty of them were told to go. Neither wants their name used, so we must be careful. I'd like to use the phrase according to former employees, not sources close to the port, which sounds too vague.",
      "Third, the problem. The union leader, Mr Castellano, who promised to talk to me, has gone quiet. His assistant says he is travelling until Monday, but I saw him in the café opposite the station this morning. I don't think he is lying exactly; I think he's nervous because of the legal letter the company sent him. So I won't push him this week. If we publish on Saturday, we can say he declined to comment, but I'd prefer to wait until we have his side, even if that means missing the weekend edition. I know you'll say we can't afford to wait, because the rival paper is chasing the same story. My feeling is that they only have the first set of figures, the wrong ones, and will probably repeat them.",
      "Last thing. Don't worry about the photographs of the empty offices; I took them myself on my phone and they're perfectly good, though not for the front page. Could you ask the legal department whether they can look at my draft by Friday morning? I'll send it at lunchtime. Oh, and the train's just arriving, so I need to go. I'm back in the office on Tuesday, but on Monday I'll be working from home, so call me there if you need anything. And please, no more jokes about my handwriting at the meeting. Right, speak soon. Bye."
    ),
    qs: [
      Q("When is the interview with the port director?", "On Thursday afternoon", ["On Wednesday afternoon", "On Thursday afternoon", "On Tuesday morning"]),
      Q("Why was the interview not held on Wednesday?", "The director has a hospital appointment", ["The photographer is busy", "The director has a hospital appointment", "Leila is travelling"]),
      Q("How many jobs did the port really lose?", "Fifty", ["Fifteen", "Fifty", "Twenty"]),
      Q("What do the two former workers claim?", "At least twenty people were told to leave", ["Everybody retired", "At least twenty people were told to leave", "The union leader lied"]),
      Q("Why does Leila think Mr Castellano has gone quiet?", "He is nervous about a legal letter", ["He is ill", "He is nervous about a legal letter", "He is abroad"]),
      Q("What does Leila believe about the rival paper?", "It is probably using the wrong figures", ["It has better sources", "It is probably using the wrong figures", "It will publish on Saturday"]),
      TF("Leila took the photographs of the empty offices with a professional camera.", false, "She took them with her phone."),
      TF("Leila will work from home on Monday.", true),
      Q("Leila saw the union leader in the café opposite the ___."),
      Q("Leila wants to use the phrase according to former ___.")
    ].map((q, i) => i === 8 ? { ...q, answer: "station" } : i === 9 ? { ...q, answer: "employees" } : q)
  },
  {
    topic: "A charity appeal for elderly people's heating",
    audioText: P(
      "Good evening. My name is Dr Rustam Aliev, and I am speaking to you on behalf of Warm Homes, a small charity which helps elderly people in our region heat their homes through the winter. Last January, a volunteer visited a woman of eighty-four who was wearing her coat indoors because she could not afford to turn on the heating. She told us she was fine and did not want to be a bother. That is what we hear again and again, and it is the reason I am asking for your help tonight.",
      "Let me give you some figures. Last winter we helped one thousand two hundred households, and this year the number of requests is already thirteen hundred, although the real winter has not even started. At the same time, our government grant has been cut by a fifth. Please do not misunderstand me, I am not blaming anybody; the officials were honest and explained that they had to make difficult choices. But the result is a gap of ninety thousand, and we have until the end of November to close it.",
      "What will your money do? A gift of twenty will pay for a week of heating for one household. Forty will buy proper insulation for a window, which can reduce bills by ten percent for years. One hundred will pay for a full check of a home by a trained adviser, who also helps with applications for benefits that many older people do not realise they can claim. You might think that we should simply give money, but our experience shows that practical help works better. Some people even refuse cash, because they feel ashamed, but they happily accept a free visit from a neighbour who brings a draught excluder.",
      "There are three ways to help. You can donate through our website, or by ringing the number I will give you in a moment. You can volunteer: we need drivers and people who can spare two hours on a Saturday. Or you can simply knock on the door of an older neighbour tonight and ask if they are warm enough. This costs nothing at all, and it may be the most valuable thing of the three. Finally, a small announcement: a local firm has promised to match every donation made this week, so your twenty becomes forty. The number is oh eight hundred, five five five, one one two. Thank you for listening, and please keep your neighbours warm."
    ),
    qs: [
      Q("Why was the elderly woman wearing her coat indoors?", "She could not afford heating", ["She was ill", "She could not afford heating", "Her heating was broken"]),
      Q("How many requests for help has the charity received so far this year?", "About thirteen hundred", ["About thirty", "About one thousand two hundred", "About thirteen hundred"]),
      Q("By how much has the government grant been cut?", "A fifth", ["A tenth", "A fifth", "A third"]),
      Q("What does a gift of forty pay for?", "Insulation for a window", ["A week of heating", "A full home check", "Insulation for a window"]),
      Q("Why does the charity prefer practical help to cash?", "Some people feel ashamed to take money", ["Cash is stolen", "Some people feel ashamed to take money", "It is cheaper to run"]),
      Q("What does the speaker say may be the most valuable thing a listener can do?", "Check on an older neighbour", ["Volunteer as a driver", "Check on an older neighbour", "Donate through the website"]),
      TF("The speaker blames the government for the cut in funding.", false, "He says he is not blaming anybody."),
      TF("A local firm will match donations made this week.", true),
      Q("A trained adviser also helps with applications for ___ that older people may not know they can claim."),
      Q("The charity needs drivers and people who can spare two ___ on a Saturday.")
    ].map((q, i) => i === 8 ? { ...q, answer: "benefits" } : i === 9 ? { ...q, answer: "hours" } : q)
  },
  {
    topic: "A street survey on Sunday shop opening",
    audioText: P(
      "For this week's programme, our reporter Nargiza spent a morning in the main square asking passers-by whether shops in the city should be allowed to open on Sundays. She said the first person she stopped, a retired bus driver named Walter, was firmly against the idea. He worked on Sundays for thirty years and missed almost every family lunch. He said nobody should have to do that, and certainly not for the sake of a few extra sales.",
      "The second person, a student called Ines, took the opposite view. She works in a bookshop during the week and studies in the evenings, so Sunday is the only day she can shop. She said that closing shops on the one day people are free is simply illogical. But when Nargiza asked whether she would be happy to work on Sundays herself, Ines hesitated and then said she would, as long as she was paid double. Nargiza noticed that most younger people gave a similar answer: they were in favour, but only with better pay.",
      "A woman with two small children, Mrs Tashkentova, said she was undecided. Sunday opening would be convenient, but she worried about the smaller shops. Big supermarkets can afford extra staff, whereas the family bakery next to her house cannot, so customers would drift away from it. A man selling newspapers from a kiosk said he did not care in the least, because he has opened every day of the year since the nineteen nineties, including Christmas, and nobody has ever thanked him for it. Nargiza says he said this with a smile.",
      "Out of fifty people questioned, twenty-two supported Sunday opening, eighteen were against, and ten could not decide. Nargiza pointed out that this is hardly scientific, as the survey took place in a square near several cafés and so probably reached more young people than elderly ones. The mayor's office has said it will not make a decision until the autumn, when a proper study is finished. Meanwhile one shop owner, who asked not to be named, told Nargiza privately that he is already preparing, and has hired two extra assistants, just in case. Her conclusion was that almost everybody agreed on one point: if shops do open, the workers must be treated fairly. Next week she will ask people about the price of coffee."
    ),
    qs: [
      Q("Why is Walter against Sunday opening?", "He missed family lunches when he worked Sundays", ["He dislikes supermarkets", "He missed family lunches when he worked Sundays", "He never shops on Sundays"]),
      Q("On what condition would Ines work on Sundays?", "She would be paid double", ["She would be paid double", "She could study in the shop", "She could leave early"]),
      Q("What worries Mrs Tashkentova?", "Small shops could lose customers", ["Her children would be bored", "Small shops could lose customers", "Supermarkets would close"]),
      Q("What is the newspaper seller's attitude?", "He is completely indifferent", ["He is strongly against", "He is completely indifferent", "He is strongly in favour"]),
      Q("How many of the people questioned were against Sunday opening?", "Eighteen", ["Eighty", "Twenty-two", "Eighteen"]),
      Q("Why does Nargiza say her survey is not scientific?", "It probably reached too many young people", ["Too few people were asked", "It probably reached too many young people", "People were paid to answer"]),
      TF("The mayor's office will decide this month.", false, "It will not decide until autumn, when a proper study is finished."),
      TF("One shop owner has already hired two extra assistants.", true),
      Q("Walter used to work as a bus ___."),
      Q("Next week Nargiza will ask people about the price of ___.")
    ].map((q, i) => i === 8 ? { ...q, answer: "driver" } : i === 9 ? { ...q, answer: "coffee" } : q)
  },
  {
    topic: "Podcast on a night market in the city",
    audioText: P(
      "Welcome to Street Level, the podcast about how we really live in our cities. I'm your host, Oksana, and this week I'm in the old harbour district, where a night market has appeared on Friday evenings over the past two years. When I arrived at seven, I assumed I would find tourists. In fact, I found mostly local people, many of them carrying their own shopping bags, and a queue for dumplings that was easily thirty metres long.",
      "I spoke first to Kofi, who runs a stall selling grilled corn. He told me that he used to work in an office and left his job two years ago, a decision that his mother still calls crazy. He now earns less money, he admits, but he is much happier, and he says the market has given him something unexpected: friends. The man at the next stall lends him a gas bottle when his own runs out, and in return Kofi supplies him with lunch. Then he stopped himself and said that, strictly speaking, he gives him dinner, because the market opens in the evening.",
      "Not everyone is delighted. A woman who lives above the square, Mrs Bianchi, told me the noise continues until midnight and the street smells of frying oil on Saturday mornings. She does not wish to close the market, she said, only to make it end one hour earlier. The organiser, Tomas, replied that he had already agreed to stop music at ten, and that the cleaning team starts at eleven, so by dawn there is nothing left. They disagree about whether that is true. Frankly, when I walked through the square at eight on Saturday morning, it was clean, though there was a slight smell of onions.",
      "Why does this matter for the city? Urban planners I talked to say that evening markets bring life to streets that are empty after five. Shops nearby report that their sales on Friday have risen by about a quarter, though a restaurant owner complained that the market takes away his customers. I think both things are true. There are, however, plans to move the market to a car park outside the centre, because of the rent the harbour authority wants. Tomas says that would destroy it, since people come precisely because it is where they can walk after work. I'm inclined to agree. Next week we visit a rooftop garden. Until then, walk somewhere new."
    ),
    qs: [
      Q("Who did Oksana mostly find at the market?", "Local people", ["Tourists", "Local people", "Stall owners' families"]),
      Q("How long was the queue for dumplings?", "About thirty metres", ["About thirteen metres", "About three hundred metres", "About thirty metres"]),
      Q("What does Kofi say the market has given him?", "Friends", ["More money", "Friends", "A better office job"]),
      Q("What does Kofi give his neighbour in return for the gas bottle?", "Dinner", ["Lunch", "Dinner", "Corn for free every day"]),
      Q("What does Mrs Bianchi want?", "The market to finish one hour earlier", ["The market to close for good", "The market to finish one hour earlier", "The music to start later"]),
      Q("Why might the market be moved to a car park?", "The harbour authority wants a high rent", ["The harbour authority wants a high rent", "Residents have complained about smells", "Planners want empty streets"]),
      TF("The organiser has agreed to stop the music at midnight.", false, "He agreed to stop it at ten."),
      TF("Sales in nearby shops on Fridays have risen by about a quarter.", true),
      Q("The night market takes place on Friday ___."),
      Q("Next week the podcast visits a rooftop ___.")
    ].map((q, i) => i === 8 ? { ...q, answer: "evenings" } : i === 9 ? { ...q, answer: "garden" } : q)
  },
  {
    topic: "A workshop talk on spotting false stories",
    audioText: P(
      "Thank you all for coming to this workshop on spotting false stories online. My name is Professor Imani Okoro, and I teach media studies at the university. I'd like to begin with an uncomfortable fact: when researchers tested students last year, about three quarters could not tell a real news article from a paid advertisement that looked like one. I assumed that older people would be worse, but they were actually slightly better, perhaps because they still read printed papers.",
      "Let me describe a simple method called lateral reading. Most people, when they see a strange website, stay on that website and read it carefully. Professional fact-checkers do the opposite: they leave the page after a few seconds and search for what other sources say about it. This takes about two minutes, not twenty, and it works much better. Please don't think that you must become a detective. You only need to ask three questions. Who is behind this? What is the evidence? And what do other sources say?",
      "Here is a true example. Last spring a photograph went around showing a flooded airport, with people swimming in the terminal. It was shared more than two hundred thousand times. A journalist in my class needed only five minutes to discover that the picture came from a film trailer, made two years earlier. What interests me is that many of those who shared it did not believe it was real. They simply thought it was funny, or they wanted to show that they were worried about climate change. Intentions matter, but the effect is the same: a false picture becomes part of what people remember.",
      "Now a word about our own habits. Most of us share a story because of how it makes us feel, not because we believe it. So here is my rule: if a headline makes you very angry, wait ten minutes before you share it. It sounds simple, and it is not a perfect solution, but studies suggest that it reduces sharing of false material by almost a third. I would add one warning, though. Do not become so suspicious that you believe nothing. That is just as dangerous, because then even honest reporters cannot persuade you of anything. After the break, you will work in pairs on three examples I have prepared. Please bring your phones, and not just your laptops, because most false stories travel on phones. The session ends at four, not at five, as the programme says, since the room is needed afterwards."
    ),
    qs: [
      Q("What did the research on students show?", "Most could not tell an article from an advert", ["Most could not tell an article from an advert", "Most believed everything online", "Most never read news"]),
      Q("How did older people perform?", "Slightly better than students", ["Much worse than students", "Slightly better than students", "Exactly the same as students"]),
      Q("What do professional fact-checkers do with a strange website?", "Leave it and check other sources", ["Read it very carefully", "Leave it and check other sources", "Ask the owner"]),
      Q("Where did the flooded airport picture come from?", "A film trailer", ["A news agency", "A film trailer", "A real flood two years earlier"]),
      Q("What does the professor say about many people who shared it?", "They did not really believe it was real", ["They wanted to deceive others", "They did not really believe it was real", "They had checked it carefully"]),
      Q("What is the professor's warning at the end?", "Do not become suspicious of everything", ["Do not use phones at all", "Do not become suspicious of everything", "Do not trust older people"]),
      TF("Lateral reading takes about twenty minutes.", false, "It takes about two minutes."),
      TF("Participants should bring their phones as well as laptops.", true),
      Q("If a headline makes you very ___, wait ten minutes before you share it."),
      Q("The airport picture was shared more than two hundred ___ times.")
    ].map((q, i) => i === 8 ? { ...q, answer: "angry" } : i === 9 ? { ...q, answer: "thousand" } : q)
  },
  {
    topic: "Recap of a mayoral election debate",
    audioText: P(
      "Last night's debate between the two candidates for mayor of Hartley took place in the town hall, in front of about four hundred people. The incumbent, Councillor Patricia Moyo, and her challenger, the local doctor Farhod Ismoilov, had agreed on three subjects: housing, transport and the future of the old swimming pool. The evening started badly when the microphone for Dr Ismoilov failed and he had to speak without it for the first ten minutes, which he said afterwards was good practice for a doctor who has often had to shout across a crowded waiting room.",
      "On housing, both candidates agreed that the town needs more homes, but they disagreed about where to build them. Councillor Moyo wants new flats on the former factory site by the canal, which would provide about two hundred homes. Dr Ismoilov thinks that is too crowded, and prefers smaller developments on the edge of town, near the school. When asked about the green fields there, he said he would protect the best of them, but not all, and some in the audience booed. He answered that honesty was better than a promise he could not keep.",
      "The most heated exchange was about transport. Councillor Moyo defended the increase in parking charges, saying it paid for new buses. Dr Ismoilov replied that the buses were still not reliable and that parking prices had driven away customers from the market. She answered that the number of bus passengers had gone up by twelve percent, and he accused her of choosing figures that suited her. At that point the host, a retired teacher, reminded them politely that the audience had not come to listen to an argument, but to learn what each candidate would do. Both apologised and, to general surprise, shook hands.",
      "The swimming pool, which closed last year, produced the biggest surprise. Everyone expected the candidates to promise to reopen it. Instead, Councillor Moyo said she would not, because it would cost one million a year to run and the town simply could not pay. Dr Ismoilov said he would reopen it, but only if the neighbouring towns shared the costs. Most commentators think he gained more support from this answer, although an opinion poll published this morning shows Councillor Moyo still ahead by four points. The election will be held on the third of next month, and the final debate on the radio takes place a week earlier. Voters who cannot attend can listen to both on our website."
    ),
    qs: [
      Q("What went wrong at the start of the debate?", "Dr Ismoilov's microphone failed", ["Councillor Moyo arrived late", "Dr Ismoilov's microphone failed", "The host forgot the questions"]),
      Q("Where does Councillor Moyo want to build new flats?", "On the former factory site by the canal", ["Near the school", "On the former factory site by the canal", "On the green fields"]),
      Q("What does Dr Ismoilov prefer?", "Smaller developments on the edge of town", ["One large estate by the canal", "Smaller developments on the edge of town", "No new homes at all"]),
      Q("Why did the host interrupt the argument about transport?", "The audience wanted to hear plans, not an argument", ["The candidates were rude about the audience", "The audience wanted to hear plans, not an argument", "The time had run out"]),
      Q("What is Councillor Moyo's position on the swimming pool?", "She will not reopen it because it is too expensive", ["She will reopen it at once", "She will not reopen it because it is too expensive", "She will reopen it if other towns pay"]),
      Q("What does the latest opinion poll show?", "Councillor Moyo is four points ahead", ["Dr Ismoilov is four points ahead", "Councillor Moyo is four points ahead", "The candidates are level"]),
      TF("Dr Ismoilov promised to protect all the green fields.", false, "He said he would protect the best of them, but not all."),
      TF("The two candidates shook hands during the debate.", true),
      Q("The factory site could provide about two hundred ___."),
      Q("Dr Ismoilov would reopen the pool only if neighbouring towns shared the ___.")
    ].map((q, i) => i === 8 ? { ...q, answer: "homes" } : i === 9 ? { ...q, answer: "costs" } : q)
  },
  {
    topic: "An editor addresses her newsroom about a mistake",
    audioText: P(
      "Good morning, everyone. I asked you to come in early because we have to talk about Tuesday's front page. As most of you know, we reported that the new sports centre would cost eleven million and open in June. Both facts were wrong. The cost is going to be about seventeen million, and the opening is planned for September. Eleven and seventeen sound nothing alike, so it was not a simple misreading. It happened because the figure from last year's draft was used instead of the current one.",
      "I'm not looking for someone to blame. The reporter, Stefan, did what he was told to do, and the desk editor was on holiday. But the system failed, and the system is my responsibility. From today, every number in a story must be checked against a document, not against another article, and the name of the person who checked it will be noted on the page. I know that some of you will find this irritating. A few years ago I would have, too. But I have learned that readers forgive an honest mistake far more easily than a silent correction.",
      "Which brings me to the correction itself. My first idea was to publish a short note on page two, as we usually do. I changed my mind after the mayor's office rang. They were polite, but they pointed out that nearly four hundred people had written to them to complain about the cost. So we are going to run a correction on the front page, in the same place as the original, and also on the website at the top of the story, with a line explaining what changed. This is going to be uncomfortable, but it is the right thing. The online version will be updated by noon, and the printed note appears tomorrow.",
      "Finally, something positive. Despite the mistake, our website had its best week ever, with ninety thousand visitors. The sad part is that the story with the error was the most read. I'd like to think that people come for the news, not for the mistakes, but I am not certain. Anyway, on Friday we have a training session with a data journalist, Ravshan, who will show us how to check statistics quickly. Attendance is not compulsory, but I'd like everyone from the news desk to come. Lunch will be provided, which I'm told is the real reason many of you will attend. Right. Thank you, and please, let's make next week's paper boring in the best possible way: with no corrections at all."
    ),
    qs: [
      Q("What was wrong with Tuesday's front page?", "The cost and the opening date", ["Only the cost", "Only the opening date", "The cost and the opening date"]),
      Q("What is the correct cost of the sports centre?", "About seventeen million", ["About eleven million", "About seventeen million", "About seventy million"]),
      Q("How did the mistake happen?", "An old draft figure was used", ["The reporter misheard a number", "An old draft figure was used", "The mayor gave wrong information"]),
      Q("What is the new rule?", "Numbers must be checked against a document", ["Numbers must be checked against another article", "Numbers must be checked against a document", "Only editors may write numbers"]),
      Q("Why did the editor change her mind about the correction on page two?", "Many people had complained to the mayor's office", ["Stefan asked her to", "Many people had complained to the mayor's office", "The website was down"]),
      Q("Which story was the most read that week?", "The one with the error", ["The one with the error", "The one about the training", "The one on page two"]),
      TF("Stefan will be punished for the mistake.", false, "The editor says she is not looking for someone to blame."),
      TF("Attendance at Friday's training session is not compulsory.", true),
      Q("The printed correction will appear ___."),
      Q("The website had ninety thousand ___ this week.")
    ].map((q, i) => i === 8 ? { ...q, answer: "tomorrow" } : i === 9 ? { ...q, answer: "visitors" } : q)
  },
  {
    topic: "A news feature: a mountain village gets a phone signal",
    audioText: P(
      "For most of us, losing a mobile signal is a minor irritation. For the people of Karakul, a mountain village of about two hundred houses, it was a normal part of life until last month. Our reporter, Bahodir Yunusov, travelled there by a road that took four hours, although the map suggests it should take two, and he found a community still getting used to the idea that a phone can work at home.",
      "The change began when a telecommunications company agreed, after nearly six years of requests, to put an antenna on a hill above the village. Before that, residents who wanted to make a call had to walk up to a rock known as the Telephone Stone, forty minutes uphill, and stand on one leg, according to the local joke. The village teacher, Mrs Rahmonova, told Bahodir that she once learned of her mother's illness two days late because nobody could reach her. She cried when she described it, and admitted that she had not told anyone how she felt until now.",
      "Not everyone is thrilled. The village elder, Mr Abdulloev, who is seventy-eight, worries that young people will spend their evenings staring at screens instead of talking. He has already noticed that three boys who used to play football after school now sit on a wall watching videos. His grandson disagrees, pointing out that he is taking online lessons in English, which would have been impossible before. Mr Abdulloev, to his credit, said that he might be wrong, but that he reserved the right to complain. A shop owner, meanwhile, is delighted. She can now order goods by phone instead of driving down the valley each week, which saves her a day of work and a lot of fuel.",
      "Doctors are also pleased. A nurse who visits the village twice a month can now call a specialist during an examination, and last week she avoided a trip to hospital for a farmer with a badly cut hand. There are still problems. The signal disappears when it snows heavily, and the antenna is powered by solar panels, which do not work well in winter. The company promises a back-up battery by December, but residents have heard promises before. Even so, on the evening Bahodir left, a small crowd had gathered at the village square for no particular reason. They simply wanted, as one man put it, to stand there and hear their phones ring."
    ),
    qs: [
      Q("How long did the journey to Karakul take the reporter?", "Four hours", ["Two hours", "Four hours", "Forty minutes"]),
      Q("How long had residents been asking for an antenna?", "Nearly six years", ["Nearly two years", "Nearly six years", "Nearly forty years"]),
      Q("What happened to Mrs Rahmonova?", "She learned of her mother's illness two days late", ["She lost her job", "She learned of her mother's illness two days late", "She missed a hospital visit"]),
      Q("What is Mr Abdulloev's attitude?", "He is worried but admits he may be wrong", ["He is delighted", "He is worried but admits he may be wrong", "He refuses to listen to anyone"]),
      Q("How does the new signal help the shop owner?", "She no longer has to drive down the valley each week", ["She sells more phones", "She no longer has to drive down the valley each week", "She can open on Sundays"]),
      Q("What is one remaining problem?", "The signal disappears in heavy snow", ["The signal disappears in heavy snow", "The antenna is too expensive", "Few people own phones"]),
      TF("Mr Abdulloev's grandson agrees with his worries about screens.", false, "He disagrees and uses his phone for online English lessons."),
      TF("A nurse avoided a hospital trip last week thanks to the signal.", true),
      Q("The antenna was placed on a ___ above the village."),
      Q("The company promises a back-up ___ by December.")
    ].map((q, i) => i === 8 ? { ...q, answer: "hill" } : i === 9 ? { ...q, answer: "battery" } : q)
  },
  {
    topic: "Podcast debate: mobile phones in schools",
    audioText: P(
      "On this week's episode of Talking Education, hosts Lucia and Hamid discuss whether schools should ban mobile phones completely. Lucia begins by telling a story from her daughter's school, which introduced a ban in January. She expected chaos, but after two weeks the head teacher reported that playground conversation had returned and that the number of arguments over online messages had fallen sharply. Lucia admits that she was sceptical to start with and is now partly convinced.",
      "Hamid takes the opposite side, as he says, on purpose. He argues that a complete ban is the lazy solution. Teachers, he says, should teach children how to use phones sensibly, because they will have phones for the rest of their lives. He mentions a school in the north where pupils use their phones as dictionaries and cameras in science lessons. Lucia replies that she is not against phones in lessons when the teacher decides, only in the corridors and at break. Hamid concedes that this is a reasonable middle position, though he insists that it is not a ban, but a rule, and that the difference matters.",
      "They then discuss research. Lucia has read a study of forty schools which found that results improved slightly after bans, mostly among weaker pupils, while strong pupils hardly changed. Hamid points out that the improvement was small, only about two percent, and that the study was paid for by a company that sells lockers for phones. Lucia laughs and says that this is a fair point she had not noticed. She promises to look for independent evidence and put the links on the website. They agree that the most reliable fact is that nobody really knows yet.",
      "A listener, a teacher named Yusuf, wrote in to say that the real difficulty is parents. Many of them text their children during lessons, and some become angry when the school tries to stop it. His school solved the problem by giving parents the office number and asking them to call that instead. It reduced messages by about half within a month. Hamid says this is the most useful idea he has heard all year. In the end, the hosts do not agree, and they say this is fine. Next week they will talk about whether homework should be abolished, and they would like listeners to send examples of the best and worst homework they ever received. Messages can be sent until Thursday."
    ),
    qs: [
      Q("What changed at Lucia's daughter's school after the ban?", "Pupils talked more and argued less online", ["Pupils talked more and argued less online", "There was chaos for two weeks", "Results fell sharply"]),
      Q("What does Hamid think schools should do?", "Teach pupils to use phones sensibly", ["Ban phones in lessons only", "Teach pupils to use phones sensibly", "Let pupils use phones anywhere"]),
      Q("What is Lucia's position on phones in lessons?", "Acceptable if the teacher decides", ["Acceptable if the teacher decides", "Never acceptable", "Acceptable only in corridors"]),
      Q("Why does Hamid distrust the study?", "A phone locker company paid for it", ["It covered too few schools", "A phone locker company paid for it", "It was published years ago"]),
      Q("According to the study, who benefited most from the bans?", "Weaker pupils", ["Strong pupils", "Weaker pupils", "Teachers"]),
      Q("How did Yusuf's school reduce messages from parents?", "It asked parents to call the office instead", ["It confiscated pupils' phones", "It asked parents to call the office instead", "It told parents to text after school"]),
      TF("Hamid sincerely believes that a complete ban is the best solution.", false, "He takes the opposite side on purpose."),
      TF("Lucia promises to look for independent evidence.", true),
      Q("The study found an improvement of only about two ___."),
      Q("Next week the hosts will discuss whether ___ should be abolished.")
    ].map((q, i) => i === 8 ? { ...q, answer: "percent" } : i === 9 ? { ...q, answer: "homework" } : q)
  }
];
