const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "Training for a first marathon",
    audioText: "Good evening, listeners, and welcome to Active Life. Tonight our guest is Dilnoza Karimova, a teacher from Samarkand who ran her first marathon last spring. Dilnoza says she never imagined herself as a runner. Three years ago she could hardly run for five minutes without stopping, because she spent most of her days sitting in a classroom or at her desk marking homework.\n\nThe change began when her younger brother Jasur challenged her to join a charity race of five kilometres. She finished it in thirty-eight minutes and felt proud, but also very tired. That evening she decided to follow a proper training plan. She chose a programme that lasted twenty weeks and asked her to run four days a week. Three of those runs were short or medium, and the fourth was a long run on Sunday morning, which grew a little longer every week.\n\nDilnoza admits that the hardest part was not her legs but her motivation. In the dark winter mornings she often wanted to stay in bed. To solve this problem she found a running partner, a neighbour called Mark, who is originally from Manchester. They agreed to meet at six thirty outside her building, and because Mark was waiting for her in the cold, she never dared to cancel.\n\nFood was another important lesson. At first she ate almost nothing before a long run and felt weak after twelve kilometres. A sports nutritionist told her to eat porridge with honey and a banana two hours before running, and to carry a small bag of dried apricots. After that change her energy improved immediately.\n\nOn the day of the marathon the weather was warm, and she started slowly on purpose. Many runners rushed ahead, but she kept a steady speed and passed several of them later. Around the thirty-second kilometre she hit what runners call the wall, and her legs felt like stone. She repeated to herself that she only needed to reach the next water station. Finally she crossed the finish line in four hours and twenty minutes, with her whole family cheering.\n\nHer advice for beginners is simple: start small, be patient, never skip rest days, and find someone to share the road with you.",
    qs: [
      Q("What is Dilnoza's job?", "She is a teacher", ["She is a nurse", "She is a teacher", "She is a nutritionist"]),
      Q("Who challenged her to join the first charity race?", "Her brother", ["Her neighbour", "Her brother", "Her colleague"]),
      Q("How many days a week did the plan ask her to run?", "Four", ["Three", "Four", "Six"]),
      Q("Why did she find a running partner?", "To stay motivated", ["To run faster", "To stay motivated", "To learn a route"]),
      Q("What did the nutritionist recommend before a long run?", "Porridge with honey and a banana", ["Rice and chicken", "Porridge with honey and a banana", "Only a glass of water"]),
      Q("What did she do at the start of the marathon?", "She started slowly", ["She started slowly", "She ran at top speed", "She waited for Mark"]),
      TF("Dilnoza finished the first charity race in under thirty minutes.", false, "It took her thirty-eight minutes."),
      TF("The weather on marathon day was warm.", true),
      Q("She and Mark met outside her building at six ___ in the morning.", "thirty"),
      Q("She carried a small bag of dried ___ during long runs.", "apricots")
    ]
  },
  {
    topic: "A healthy breakfast talk",
    audioText: "Hello everyone, and thank you for coming to this morning's talk at the community health centre. My name is Doctor Malika Rakhimova, and today I would like to speak about the most discussed meal of the day: breakfast.\n\nMany people tell me they simply do not have time to eat in the morning. They drink a cup of coffee and run to the bus. I understand this completely, because I used to do exactly the same when I was a student. However, after a night without food, your body needs fuel. A good breakfast helps you concentrate, keeps your mood stable, and stops you from eating too many sweets before lunch.\n\nSo what makes a good breakfast? First, it should contain protein. Eggs, yoghurt, cottage cheese or a handful of nuts are all excellent choices. Protein keeps you feeling full for much longer than bread alone. Second, it should include slow carbohydrates, such as oats, whole grain bread or fruit. These give your brain a steady supply of energy through the morning. Third, try to add something fresh, like a tomato, a cucumber or an apple.\n\nI must also warn you about some breakfast traps. Many cereals sold in colourful boxes contain a surprising amount of sugar. One bowl can have as much sugar as two chocolate biscuits. Fruit juice from a carton is another trap, because it has less fibre than a whole fruit. If you love juice, please drink only a small glass.\n\nHere is a quick plan for busy people. On Sunday evening, boil six eggs and keep them in the fridge. Prepare a jar of oats with milk and let it stand overnight. In the morning you only need to add a spoonful of honey and some berries. It takes three minutes.\n\nFinally, children are especially affected. A study in a school in Tashkent found that pupils who ate breakfast scored higher in morning tests than pupils who skipped it. So please make sure your children eat before school.\n\nNow, before the break, I will answer your questions, and after that we will taste some healthy recipes together in the kitchen next door.",
    qs: [
      Q("Where is the talk taking place?", "At a community health centre", ["At a school", "At a community health centre", "At a restaurant"]),
      Q("Why do many people skip breakfast?", "They say they have no time", ["They are not hungry", "They say they have no time", "They dislike eggs"]),
      Q("Which food is mentioned as a source of protein?", "Cottage cheese", ["Cottage cheese", "Oats", "Apples"]),
      Q("What is the problem with many cereals?", "They contain a lot of sugar", ["They are too expensive", "They contain a lot of sugar", "They have no taste"]),
      Q("What should you do on Sunday evening according to the plan?", "Boil eggs", ["Buy fruit juice", "Boil eggs", "Cook porridge"]),
      Q("What happens after the break?", "The audience tastes recipes", ["The audience tastes recipes", "A second doctor speaks", "A film is shown"]),
      TF("Fruit juice has more fibre than a whole fruit.", false, "It has less fibre."),
      TF("Pupils who ate breakfast did better in morning tests.", true),
      Q("One bowl of some cereals has as much sugar as two chocolate ___.", "biscuits"),
      Q("Doctor Rakhimova mixes oats with milk and leaves them overnight in a ___.", "jar")
    ]
  },
  {
    topic: "Booking a doctor's appointment",
    audioText: "Last Tuesday morning, Bobur Tursunov woke up with a terrible pain in his back. He had spent the whole weekend helping his cousin move to a new flat, carrying boxes and furniture up four floors, and now he could hardly stand straight. He decided to call the clinic near his home.\n\nThe receptionist, a friendly woman called Nargiza, answered on the third ring. Bobur explained that he needed to see a doctor as soon as possible. Nargiza asked him for his full name and his date of birth, and then she asked whether he had visited the clinic before. Bobur said that he had been there two years ago for a sore throat. She found his file on the computer and told him that his family doctor, Doctor Alimov, was away on holiday until the end of the week.\n\nBobur was disappointed, but Nargiza suggested another doctor, a young specialist named Doctor Yusupova, who had an appointment free that same afternoon at a quarter past three. She added that it would be better to arrive ten minutes early, because new patients had to fill in a short form. Bobur wrote down the time and thanked her.\n\nThen Nargiza asked whether he was taking any medicine. Bobur said that he had taken one painkiller in the morning, and it had not helped much. She told him not to take any more until he had talked to the doctor, and she reminded him to bring his identity card and his insurance paper.\n\nAt the clinic that afternoon, Doctor Yusupova examined his back carefully and asked him to bend forward and then to the side. She explained that he had pulled a muscle and that nothing was seriously wrong. She advised him to rest for two days, to use a warm compress for twenty minutes in the evening, and to start gentle stretching exercises on Friday. She also gave him a cream to rub into the sore place twice a day.\n\nBobur left the clinic relieved. On the way home he promised himself that next time he would ask his cousin to hire movers.",
    qs: [
      Q("Why was Bobur's back painful?", "He carried furniture", ["He played football", "He carried furniture", "He slept badly"]),
      Q("When had Bobur last visited the clinic?", "Two years ago", ["Last month", "Two years ago", "Never"]),
      Q("Why could he not see Doctor Alimov?", "The doctor was on holiday", ["The doctor was on holiday", "The doctor was ill", "The doctor had moved"]),
      Q("What time was the appointment?", "A quarter past three", ["Half past two", "A quarter past three", "Four o'clock"]),
      Q("What did the receptionist tell him to bring?", "His identity card and insurance paper", ["His old file", "His identity card and insurance paper", "A friend"]),
      Q("What was the diagnosis?", "A pulled muscle", ["A broken bone", "A pulled muscle", "A cold"]),
      TF("Bobur had taken two painkillers before calling.", false, "He had taken one."),
      TF("The doctor gave him a cream to use twice a day.", true),
      Q("Bobur had carried boxes up four ___.", "floors"),
      Q("He should use a warm ___ for twenty minutes in the evening.", "compress")
    ]
  },
  {
    topic: "Swimming club announcement",
    audioText: "Attention please, all members and visitors of the Riverside Sports Centre. This is an important announcement about our new swimming programme, which begins next month.\n\nAfter many requests from parents and local residents, we are happy to tell you that the main pool will now be open for lessons on weekday evenings. Beginners' classes for adults will take place on Monday and Wednesday from seven until eight in the evening. Our children's group, for pupils between six and ten years old, will meet on Tuesday and Thursday at five o'clock. Each lesson lasts forty-five minutes, and every group has no more than twelve people so that the coach can pay attention to everyone.\n\nThe lessons will be taught by Coach Sherzod Normatov, who was a national junior champion in backstroke and has worked with young swimmers for eleven years. He will be helped by two assistants, Laura from Spain and Aziza from Bukhara, both of whom are qualified lifeguards.\n\nPlease note several rules. First, everyone must take a shower before entering the water. Second, swimming caps are compulsory, and you can borrow one at the front desk for a small deposit. Third, children under eight must always be accompanied by an adult in the changing rooms. Finally, please do not run on the wet floor, because it is very slippery.\n\nThe price of a monthly course is two hundred thousand sum for adults and one hundred and fifty thousand for children. Members of the centre receive a discount of ten percent. If you bring a friend, you will both get an extra free lesson. You can register at the front desk, on our website, or by telephone between nine in the morning and six in the evening.\n\nWe also want to remind you that the small pool, which is warmer, is reserved for older people and for those who are recovering from injuries. It is open every morning except Sunday.\n\nThe first free trial lesson will be held on Saturday at ten o'clock, and everybody is welcome to come and try. Thank you for your attention, and we hope to see you in the water very soon.",
    qs: [
      Q("When do the adult beginners' classes take place?", "Monday and Wednesday evenings", ["Tuesday and Thursday evenings", "Monday and Wednesday evenings", "Saturday mornings"]),
      Q("How old are the children in the children's group?", "Between six and ten", ["Between four and six", "Between six and ten", "Between ten and fourteen"]),
      Q("What was Coach Sherzod's sport as a junior champion?", "Backstroke", ["Backstroke", "Diving", "Water polo"]),
      Q("What is compulsory in the pool?", "A swimming cap", ["Goggles", "A swimming cap", "A towel"]),
      Q("What discount do members get?", "Ten percent", ["Five percent", "Ten percent", "Twenty percent"]),
      Q("Who uses the small pool?", "Older people and people recovering from injuries", ["Beginners", "Older people and people recovering from injuries", "Children only"]),
      TF("Each group has up to twenty people.", false, "No more than twelve."),
      TF("The free trial lesson is on Saturday at ten o'clock.", true),
      Q("Assistant Laura comes from ___.", "spain"),
      Q("Children under eight must be accompanied by an adult in the changing ___.", "rooms")
    ]
  },
  {
    topic: "Becoming vegetarian",
    audioText: "Welcome back to the programme. Our next guest is Gulnora Saidova, a university student who stopped eating meat two years ago. Gulnora, thank you for joining us.\n\nThank you for inviting me. Well, my story is not very dramatic. The presenter asks why she changed her diet, and Gulnora answers that it started with a school project about farms. She visited a large chicken farm with her classmates and felt uncomfortable about the conditions there. A few weeks later she decided to try a vegetarian month, just as an experiment, and she never went back.\n\nThe presenter then asks about her family, because in Uzbekistan meat is a very important part of many meals. Gulnora laughs and says that her grandmother was shocked. Her grandmother kept offering her soup with beef and said she would become weak. Gulnora's mother was more understanding, but she worried about her health, so the whole family went to see a doctor together. The doctor explained that a vegetarian diet can be perfectly healthy if you eat enough beans, lentils, nuts, eggs and dairy, and if you check your iron and vitamin levels once a year.\n\nThe presenter wonders whether it is difficult to eat out with friends. Gulnora says that it was hard at the beginning, because many cafes only offered salad. Now the situation is much better, and she even found a small restaurant near her university where the chef makes a wonderful pumpkin samsa and a lentil soup. She also likes to cook at home. Her favourite dish is stuffed peppers with rice, herbs and chickpeas.\n\nAbout money, she says that vegetarian food is usually cheaper, especially in summer, when vegetables at the bazaar cost very little. She spends roughly a third less on food than before.\n\nAs a final question, the presenter asks what advice she would give. Gulnora replies that people should not feel pressure to change quickly. She suggests starting with one meat-free day a week, learning a few easy recipes, and being kind to friends and relatives who eat differently. Respect, she says, works better than arguing.",
    qs: [
      Q("What was Gulnora's job or status?", "A university student", ["A chef", "A university student", "A doctor"]),
      Q("What made her think about changing her diet?", "A visit to a chicken farm", ["A visit to a chicken farm", "A television show", "A health problem"]),
      Q("How did her grandmother react?", "She was shocked", ["She was happy", "She was shocked", "She was angry at the doctor"]),
      Q("What did the doctor say about vegetarian diets?", "They can be healthy with the right foods", ["They are always dangerous", "They can be healthy with the right foods", "They need many vitamins pills"]),
      Q("What is Gulnora's favourite dish?", "Stuffed peppers", ["Pumpkin samsa", "Stuffed peppers", "Lentil soup"]),
      Q("How much less does she spend on food?", "About a third", ["About a half", "About a third", "About a quarter"]),
      TF("Gulnora decided to stop eating meat after one week of trying.", false, "She tried it for a month first."),
      TF("She suggests starting with one meat-free day a week.", true),
      Q("The doctor said she should check her iron and vitamin levels once a ___.", "year"),
      Q("In summer, vegetables at the ___ cost very little.", "bazaar")
    ]
  },
  {
    topic: "Why sleep matters",
    audioText: "Good afternoon, students. Today I want to talk about something that most of you probably do not get enough of: sleep. My name is Professor Anvar Ismoilov, and I have studied sleep for almost twenty years.\n\nLet me begin with a simple fact. Teenagers and young adults need between eight and ten hours of sleep each night. Yet in a survey at our university last year, the average student slept only six hours. That is a serious gap, and it has consequences.\n\nWhen you sleep, your brain is not resting in the way people often imagine. In fact, it is very busy. During deep sleep it organises the information you learned during the day and moves it into long-term memory. This is why studying all night before an exam is a bad idea. You may read more pages, but you will remember less of them.\n\nLack of sleep also affects your body. Tired people are more likely to catch colds, because their immune system works less well. They also tend to eat more sugary food, since tiredness changes the hormones that control hunger. And of course, sleepy drivers cause thousands of accidents every year.\n\nSo how can you sleep better? I have five practical tips. First, go to bed and wake up at the same time every day, even at the weekend. Second, stop using your phone at least one hour before bed, because the bright screen tells your brain that it is still daytime. Third, avoid coffee and strong tea after four o'clock in the afternoon. Fourth, keep your bedroom cool, dark and quiet. Fifth, if you cannot fall asleep after twenty minutes, get up, read a few pages of a boring book, and return to bed when you feel sleepy.\n\nSome of you will say that you are night owls and work best late in the evening. It is true that people have different natural rhythms, but most students who call themselves night owls are simply short of sleep.\n\nFinally, I would like to invite you to take part in a two-week experiment in my laboratory. You will wear a small bracelet that measures your sleep, and you will receive a free report at the end. Please sign up with my assistant after the lecture.",
    qs: [
      Q("How long has the professor studied sleep?", "Almost twenty years", ["Almost ten years", "Almost twenty years", "Almost thirty years"]),
      Q("How many hours did the average student sleep in the survey?", "Six", ["Six", "Eight", "Ten"]),
      Q("What does the brain do during deep sleep?", "It moves information into long-term memory", ["It stops working", "It moves information into long-term memory", "It burns calories"]),
      Q("Why do tired people eat more sugar?", "Tiredness changes the hunger hormones", ["They have no time to cook", "Tiredness changes the hunger hormones", "Sugar tastes better at night"]),
      Q("When should you avoid coffee?", "After four in the afternoon", ["After lunch", "After four in the afternoon", "After dinner"]),
      Q("What should you do if you cannot fall asleep after twenty minutes?", "Get up and read a boring book", ["Watch television", "Get up and read a boring book", "Drink strong tea"]),
      TF("The professor says it is a good idea to study all night before an exam.", false, "You will remember less."),
      TF("Participants in the experiment wear a bracelet.", true),
      Q("The bright ___ of a phone tells your brain it is still daytime.", "screen"),
      Q("You will wear a small ___ that measures your sleep.", "bracelet")
    ]
  },
  {
    topic: "Youth football tournament",
    audioText: "Good morning, everyone, and welcome to the Spring Youth Football Tournament in Namangan. My name is Rustam Aliyev, and I am the chief organiser of today's event. Before the first match starts, I would like to explain the schedule and a few important rules.\n\nThis year we have sixteen teams from six different cities, and more than two hundred young players between twelve and fifteen years old. The tournament will last two days. Today we will play the group matches on four pitches, and tomorrow we will have the quarter-finals, the semi-finals and the final. The final will start at four o'clock tomorrow afternoon on the main pitch, which has real grass and a small stand for the supporters.\n\nEvery match consists of two halves of twenty minutes, with a break of five minutes in the middle. If a group match ends in a draw, each team gets one point. A win brings three points. In the knockout games, if the score is level after the second half, we will go straight to penalties.\n\nI want to thank our sponsors, a local bakery and a sports shop, who have given us the medals, the trophies and the water for the players. The winners will receive a silver cup and a ball signed by a famous goalkeeper, who will also be visiting us tomorrow to meet the children.\n\nPlease remember some practical points. Players must wear shin guards, and no metal studs are allowed on the boots. Parents are asked to stay behind the white line along the pitch and to support all the teams politely. The referees are volunteers, many of them former players, and their decisions are final. A doctor and two nurses are on duty in the white tent next to the car park, in case someone is hurt.\n\nThere is a small cafe near the entrance, where you can buy tea, sandwiches and fruit. Please use the rubbish bins, because we want to leave this field as clean as we found it.\n\nAbove all, remember that football is a game, and the most important thing is to have fun. Now I call the first two teams to pitch number one. Good luck to everybody.",
    qs: [
      Q("How many teams take part?", "Sixteen", ["Twelve", "Sixteen", "Twenty"]),
      Q("How old are the players?", "Between twelve and fifteen", ["Between ten and twelve", "Between twelve and fifteen", "Between fifteen and eighteen"]),
      Q("When does the final start?", "Tomorrow at four o'clock", ["Today at noon", "Tomorrow at four o'clock", "Tomorrow at ten o'clock"]),
      Q("How long is each half?", "Twenty minutes", ["Fifteen minutes", "Twenty minutes", "Forty-five minutes"]),
      Q("What happens in a knockout game if the score is level?", "Penalties", ["Extra time", "Penalties", "A replay"]),
      Q("Who gave the medals and trophies?", "A local bakery and a sports shop", ["The city council", "A local bakery and a sports shop", "A bank"]),
      TF("A win in a group match gives two points.", false, "A win gives three points."),
      TF("The referees are volunteers.", true),
      Q("Players must wear shin ___.", "guards"),
      Q("The doctor and nurses are in the white ___.", "tent")
    ]
  },
  {
    topic: "A plov cooking class",
    audioText: "Last Saturday, my friend Zarina invited me to a cooking class in the old part of Bukhara, and I want to tell you about it, because it was one of the best mornings I have had this year.\n\nThe class took place in a small courtyard with a vine growing over the roof. The teacher was an elderly man called Ustoz Karim, who has been cooking plov for more than fifty years. He wore a white apron and spoke very slowly, with a lot of jokes. There were nine students, including two tourists from Germany and a young couple from Almaty.\n\nFirst, Ustoz Karim showed us the ingredients. He said that the secret of a good plov is not any magic spice but the quality of the rice, the carrots and the oil. We needed one kilo of rice, one and a half kilos of yellow carrots, one kilo of lamb, three onions, a whole head of garlic and a handful of dried barberries. He insisted that the rice should be washed seven times, until the water becomes completely clear, and then left in warm salty water for an hour.\n\nThen we started to cook in a huge black cauldron over a wood fire. We heated the oil until it smoked a little, fried the onions until they were golden brown, and added the meat. After that came the carrots, cut into long thin sticks. My sticks were a bit thick, and Ustoz Karim smiled and said that they were brave carrots. We added water and spices, and let everything simmer slowly for about forty minutes to make the rich base called zirvak.\n\nNext we added the rice carefully, so that it did not mix with the base, pushed the garlic into the middle and covered the cauldron. The most difficult part was patience. We waited another thirty minutes without opening the lid.\n\nAt last we mixed the plov on a big round plate and sat down together at a long table in the courtyard. The Germans said it was the tastiest dish of their holiday. We ate, laughed and drank green tea until the afternoon. Before leaving, each of us received a small certificate and a recipe card. I am planning to cook plov for my parents next week.",
    qs: [
      Q("Where did the cooking class take place?", "In a courtyard in Bukhara", ["In a restaurant in Samarkand", "In a courtyard in Bukhara", "In a school kitchen"]),
      Q("How long has Ustoz Karim been cooking plov?", "More than fifty years", ["Ten years", "More than fifty years", "Twenty years"]),
      Q("What does he say is the secret of good plov?", "The quality of the ingredients", ["A magic spice", "The quality of the ingredients", "A large pot"]),
      Q("How many times should the rice be washed?", "Seven", ["Three", "Five", "Seven"]),
      Q("What is the base of the plov called?", "Zirvak", ["Zirvak", "Samsa", "Lagman"]),
      Q("How did the Germans describe the dish?", "The tastiest of their holiday", ["Too oily", "The tastiest of their holiday", "Too spicy"]),
      TF("Ustoz Karim said the carrots were perfect.", false, "He joked that they were brave carrots."),
      TF("The group cooked on a wood fire.", true),
      Q("There were ___ students in the class.", "nine"),
      Q("Each student received a small certificate and a recipe ___.", "card")
    ]
  },
  {
    topic: "Cycling to work",
    audioText: "Hello, and welcome to the Morning Commute podcast. Today's story is about a man named Eldor Hasanov, who decided to leave his car at home and cycle to work every day for a whole year.\n\nEldor lives in Tashkent and works in an insurance office about eleven kilometres from his flat. For years he drove there, and every morning he sat in traffic for nearly fifty minutes. He often arrived angry and tired, and he had gained almost ten kilos. One autumn day his doctor told him that his blood pressure was too high and that he needed to move more.\n\nHe bought a second-hand bicycle from a colleague for a very fair price and began riding on Mondays only. The first week was painful. His legs hurt, he was out of breath on every small hill, and he arrived at the office completely wet from sweat. But after a month he noticed that the journey took only thirty-five minutes, which was faster than driving. He also discovered a quiet route along a canal, away from the main road, with trees and even a few ducks.\n\nBy the end of winter he was cycling five days a week, even in light snow. He bought warm gloves, a bright jacket, and lights for the front and the back of the bike. His boss, impressed, arranged a safe place to keep bicycles in the office basement and a small shower for staff. Soon three other colleagues joined him, and they started a small group called the Wheel Team.\n\nAfter twelve months Eldor had lost eleven kilos, his blood pressure was normal, and he had saved a lot of money on petrol and parking. He says that the biggest surprise was how much happier he felt. He no longer arrived at work stressed, because the ride cleared his mind.\n\nOf course, there were some problems. Twice he got a flat tyre, and once a car almost hit him at a crossroads. For this reason he insists that every cyclist wears a helmet and follows the traffic rules.\n\nHis advice is to start slowly, choose a safe route, and look for friends to ride with. As he says, every journey begins with the first push on the pedals.",
    qs: [
      Q("Where does Eldor live?", "In Tashkent", ["In Tashkent", "In Bukhara", "In Namangan"]),
      Q("What kind of company does he work for?", "An insurance office", ["A bank", "An insurance office", "A school"]),
      Q("Why did he decide to start cycling?", "His doctor said his blood pressure was too high", ["He lost his car", "His doctor said his blood pressure was too high", "Petrol became expensive"]),
      Q("How long did the ride take after one month?", "Thirty-five minutes", ["Twenty minutes", "Thirty-five minutes", "Fifty minutes"]),
      Q("What did his boss arrange?", "A bicycle room and a shower", ["A free car", "A bicycle room and a shower", "A longer lunch break"]),
      Q("How many kilos did he lose in a year?", "Eleven", ["Ten", "Eleven", "Fifteen"]),
      TF("Eldor bought a brand new bicycle from a shop.", false, "It was second-hand from a colleague."),
      TF("He found a quiet route along a canal.", true),
      Q("He and his colleagues started a group called the Wheel ___.", "team"),
      Q("Every cyclist should wear a ___.", "helmet")
    ]
  },
  {
    topic: "Joining a gym",
    audioText: "This is the story of how my sister Sevara finally joined a gym, told as she told it to me over dinner last Friday.\n\nSevara had been thinking about it for months. She works long hours as an accountant, and she wanted to feel stronger and less tired. One day a leaflet arrived in her letterbox, advertising a new fitness centre only ten minutes from her home. She called the number at the bottom and spoke to a young man named Timur.\n\nTimur explained that the centre had three types of membership. The basic one cost three hundred thousand sum a month and allowed use of the gym and the changing rooms. The standard one cost four hundred thousand and included group classes, such as yoga and dance. The premium one, at six hundred thousand, also gave access to a swimming pool and a sauna. Sevara asked whether she could try before paying, and Timur said that every new client could have one free day.\n\nThe next evening she went there with her friend Madina. A trainer named Olga showed them around and explained how each machine worked. Olga asked Sevara about her goals, and Sevara said that she mostly wanted to improve her back and sleep better. Olga wrote a simple plan for three sessions a week, each lasting about an hour. It included ten minutes of warming up, thirty minutes of exercises with light weights, and a long stretch at the end.\n\nSevara was surprised how much she enjoyed the dance class that followed. The teacher played loud music, and for forty minutes nobody thought about work. She went home exhausted but happy. In the end she chose the standard membership and paid for three months in advance, which gave her a small discount.\n\nAfter six weeks, she told me, her back hurts much less, and she falls asleep faster. The hardest part, she says, is still leaving the house on cold evenings. To help herself she packs her sports bag the night before and leaves it by the door.\n\nMadina, however, stopped going after two weeks, and Sevara thinks that this is because she had no clear plan. So her main advice is to ask a trainer to write one for you.",
    qs: [
      Q("What is Sevara's job?", "She is an accountant", ["She is a teacher", "She is an accountant", "She is a trainer"]),
      Q("How did she find out about the fitness centre?", "From a leaflet", ["From a leaflet", "From a friend", "From the internet"]),
      Q("How much does the standard membership cost?", "Four hundred thousand sum", ["Three hundred thousand sum", "Four hundred thousand sum", "Six hundred thousand sum"]),
      Q("What does the premium membership include that others do not?", "A swimming pool and a sauna", ["Group classes", "A swimming pool and a sauna", "A personal trainer"]),
      Q("What was Sevara's main goal?", "To improve her back and sleep better", ["To lose weight", "To improve her back and sleep better", "To win a race"]),
      Q("What does she do to make going out easier?", "She packs her bag the night before", ["She goes in the morning", "She packs her bag the night before", "She asks Madina to call"]),
      TF("New clients have to pay for the first day.", false, "They can have one free day."),
      TF("Madina stopped going after two weeks.", true),
      Q("Sevara paid for three ___ in advance.", "months"),
      Q("The dance class lasted forty ___.", "minutes")
    ]
  },
  {
    topic: "Drinking enough water",
    audioText: "Hello and welcome to Healthy Habits. I am your host, Nilufar, and in today's short programme we are going to talk about the simplest health advice in the world: drink more water.\n\nOur bodies are about sixty percent water. We use it to control our temperature, to move food through the stomach, and to carry oxygen around the body. Even a small loss of water can make us feel tired, give us headaches, and make it harder to concentrate. A study among office workers found that people who drank two glasses of water in the morning solved problems faster than those who drank none.\n\nHow much do we actually need? There is no magic number, but most experts suggest about two litres a day for an adult. You will need more if the weather is hot, if you play sports, or if you are ill with a fever. You also get some water from your food. Watermelon, cucumbers, soup and oranges contain a lot of it.\n\nMany of my listeners tell me that they simply forget to drink. Here are some tricks that work well. Keep a bottle on your desk where you can see it. Drink a glass when you wake up and another before each meal. Add a slice of lemon or a few leaves of mint if plain water is boring. Use a phone app that reminds you every two hours. Some people even choose a bottle with times written on its side, which shows how much you should have finished by noon and by evening.\n\nA word about other drinks. Sweet fizzy drinks and packaged juices contain a large amount of sugar, and a single can may have seven spoons of it. Coffee and tea count partly, but too much caffeine can make you lose sleep. Energy drinks are best avoided completely, especially by young people.\n\nHow can you check that you are drinking enough? Look at the colour of your urine. It should be pale yellow. If it is dark, you need more water.\n\nOn next week's programme we will talk to a dietitian about healthy snacks for school children. Until then, take care, and do not forget your glass of water.",
    qs: [
      Q("What percentage of the body is water?", "About sixty percent", ["About forty percent", "About sixty percent", "About eighty percent"]),
      Q("What did the study of office workers find?", "Water drinkers solved problems faster", ["Water drinkers solved problems faster", "They slept better", "They ate less"]),
      Q("How much water do most experts suggest for an adult?", "About two litres a day", ["About one litre a day", "About two litres a day", "About four litres a day"]),
      Q("Which food contains a lot of water?", "Watermelon", ["Bread", "Watermelon", "Rice"]),
      Q("What is a trick to remember to drink?", "Keep a bottle on your desk", ["Drink only at night", "Keep a bottle on your desk", "Eat more salt"]),
      Q("Who should avoid energy drinks completely?", "Especially young people", ["Only athletes", "Especially young people", "Only old people"]),
      TF("A single can of a sweet fizzy drink may contain seven spoons of sugar.", true),
      TF("The programme next week will be about running.", false, "It will be about healthy snacks."),
      Q("Add a slice of lemon or a few leaves of ___ to plain water.", "mint"),
      Q("Your urine should be pale ___.", "yellow")
    ]
  },
  {
    topic: "Yoga and stress",
    audioText: "Good evening, and welcome to our weekly wellbeing talk. I am Kamola Yusupova, a yoga teacher, and tonight I would like to tell you how yoga helped me to deal with stress, and how it can help you.\n\nFive years ago I was working as a manager in a large bank in Tashkent. I left home at seven in the morning and came back after nine in the evening. I slept badly, I had constant headaches, and I shouted at my family for small things. One weekend my neighbour invited me to a beginners' yoga class in a nearby park. I almost refused, because I thought yoga was only for people who could touch their toes. But she insisted, and I went.\n\nThe class was gentle and slow. The teacher, a calm woman in her sixties, began by asking us to close our eyes and simply notice our breathing. For the first time in weeks I felt my shoulders drop. After the class I slept for ten hours without waking up.\n\nI started to go twice a week. Gradually I learned that yoga is not about being flexible. It is about connecting your movement with your breath. When you hold a pose and breathe slowly, your heart rate falls and your brain releases chemicals that make you feel calm. Scientists have measured this effect in many studies.\n\nAfter a year, I made a big decision. I reduced my hours at the bank, and I trained to become a teacher. Now I work three days at the bank and teach yoga on the other days, and I have never been happier.\n\nIf you would like to try yoga, here are my tips. Choose a class for beginners and tell the teacher about any injuries. Wear comfortable clothes, and practise on an empty stomach, or at least two hours after a meal. Do not compare yourself to other people. And even at home, five minutes of slow breathing in the evening is enough to start.\n\nNow I invite everybody to stand, take a mat from the pile at the back, and join me for a short, gentle session. Please place your mats about one metre apart.",
    qs: [
      Q("What was Kamola's job five years ago?", "A bank manager", ["A yoga teacher", "A bank manager", "A doctor"]),
      Q("What symptoms did she have from stress?", "Bad sleep and headaches", ["Bad sleep and headaches", "A sore knee", "A cough"]),
      Q("Who invited her to the first class?", "Her neighbour", ["Her sister", "Her neighbour", "Her boss"]),
      Q("Where was the first class held?", "In a park", ["In a park", "In a bank", "In a gym"]),
      Q("According to Kamola, what is yoga really about?", "Connecting movement with breath", ["Being flexible", "Connecting movement with breath", "Lifting weights"]),
      Q("How does she divide her work now?", "Three days at the bank and teaching on other days", ["Only teaching", "Three days at the bank and teaching on other days", "Five days at the bank"]),
      TF("After the first class she slept for ten hours.", true),
      TF("Kamola says you should compare yourself to others.", false, "She says not to compare."),
      Q("She suggests practising on an empty ___.", "stomach"),
      Q("Please place your mats about one ___ apart.", "metre")
    ]
  },
  {
    topic: "A visit to the farmers market",
    audioText: "Hello, this is Feruza Mirzaeva, reporting for Radio Fergana from the Saturday farmers market in the centre of town. The sun is shining, the stalls are full of colour, and the smell of fresh bread is everywhere.\n\nThis market has been open every weekend for nearly fifteen years, but this season it has become bigger than ever. There are more than ninety stalls, and many of the sellers are small farmers who drive in from villages in the hills early in the morning. I spoke with Abdulla Qosimov, who sells apples, pears and dried fruit. He explained that this year his apples are especially sweet because the summer was dry and warm. A kilo costs eight thousand sum, and he said that he gives a free apple to every child who passes his stall.\n\nNext to him I met a young woman called Dildora, who sells goat cheese and yoghurt. She learned the recipe from her grandmother and makes everything in a small kitchen at home. She told me that her customers like her cheese because it has no chemicals and no preservatives, and she showed me a small piece with herbs. I tried it, and it was delicious.\n\nOn the other side of the market there is a corner for bakers. A man named Otabek was taking hot flatbread out of a clay oven called a tandoor. He said that he starts work at three in the morning and bakes about four hundred loaves before the market opens. People were queuing to buy them while they were still warm.\n\nThe market also organises activities for families. Today there is a cooking show with a local chef at eleven o'clock, and an art workshop for children at noon, where they will paint pictures using vegetables. There is also a small box at the entrance where visitors can leave unwanted food for people in need.\n\nA practical tip for shoppers: bring your own cloth bag, because the market has stopped giving out plastic ones this year. Come early for the best choice, and bargain politely. It is part of the tradition.\n\nThe market is open until three in the afternoon. This is Feruza Mirzaeva, and now it is back to the studio.",
    qs: [
      Q("Which radio station is reporting?", "Radio Fergana", ["Radio Tashkent", "Radio Fergana", "Radio Samarkand"]),
      Q("How long has the market been open?", "Nearly fifteen years", ["Nearly five years", "Nearly fifteen years", "Nearly thirty years"]),
      Q("Why are Abdulla's apples especially sweet?", "The summer was dry and warm", ["The summer was dry and warm", "He uses sugar", "They are imported"]),
      Q("What does Dildora sell?", "Goat cheese and yoghurt", ["Bread", "Goat cheese and yoghurt", "Honey"]),
      Q("What time does Otabek start work?", "Three in the morning", ["Three in the morning", "Six in the morning", "Midnight"]),
      Q("What will children do at noon?", "Paint pictures with vegetables", ["Watch a cooking show", "Paint pictures with vegetables", "Plant trees"]),
      TF("The market gives out free plastic bags.", false, "It has stopped giving them out."),
      TF("The market is open until three in the afternoon.", true),
      Q("Abdulla gives a free ___ to every child.", "apple"),
      Q("Otabek bakes bread in a clay oven called a ___.", "tandoor")
    ]
  },
  {
    topic: "A mountain hiking trip",
    audioText: "Last August, six friends and I went on a three-day hiking trip in the Chimgan mountains, and I would like to tell you how it went, because we learned several useful lessons.\n\nWe met at the bus station at five in the morning. Our leader was Akmal, an experienced climber who works as a mountain guide. He checked our bags and made us leave behind anything unnecessary. My rucksack, for example, contained a heavy book and three extra pairs of jeans, and Akmal just shook his head. In the end my bag weighed nine kilos, which was still too heavy for me.\n\nThe first day was easy. We followed a path through a forest of walnut trees and stopped by a river for lunch. We had bread, boiled eggs, cheese and tomatoes, and we washed everything down with cold, clear water from the stream. By the afternoon we reached the first camp, at an altitude of about two thousand metres. We put up our tents, collected firewood and cooked a big pot of soup. In the evening the sky was full of stars, and Akmal told us stories about wolves and snow leopards.\n\nOn the second day the weather changed. Dark clouds came over the ridge, and a cold wind began to blow. Akmal decided to leave early to avoid rain at the top. The climb was steep, and my knees hurt, but the view from the pass was unforgettable. We could see a blue lake far below and, behind it, mountains with snow on the tops. Unfortunately, halfway down it started to rain, and the path became slippery. One of us, Lola, fell and hurt her ankle. Akmal quickly bandaged it with a first aid kit and shared the weight of her bag between the rest of us.\n\nWe arrived at the second camp wet and tired, but a hot meal and a dry sleeping bag made everything better.\n\nOn the last morning we walked slowly back to the road, where a minibus was waiting. Lola's ankle was swollen, but she was smiling.\n\nWhat did I learn? Always bring proper boots, a waterproof jacket and a first aid kit. Pack light. Listen to your guide. And never ignore a weather forecast.",
    qs: [
      Q("How long did the trip last?", "Three days", ["Two days", "Three days", "A week"]),
      Q("What was Akmal's job?", "A mountain guide", ["A doctor", "A mountain guide", "A bus driver"]),
      Q("What was too heavy in the narrator's bag?", "A book and jeans", ["Food", "A book and jeans", "A tent"]),
      Q("What did the group eat for lunch on the first day?", "Bread, eggs, cheese and tomatoes", ["Soup", "Bread, eggs, cheese and tomatoes", "Rice and meat"]),
      Q("Why did Akmal want to leave early on the second day?", "To avoid rain at the top", ["To avoid rain at the top", "Because of wolves", "Because the camp was cold"]),
      Q("What happened to Lola?", "She hurt her ankle", ["She lost her bag", "She hurt her ankle", "She got lost"]),
      TF("The first camp was at about two thousand metres.", true),
      TF("A minibus took the group to the first camp.", false, "A minibus was waiting at the end of the trip."),
      Q("They saw a blue ___ far below from the pass.", "lake"),
      Q("The narrator advises always bringing proper ___.", "boots")
    ]
  },
  {
    topic: "Sugar and healthy teeth",
    audioText: "Good morning, children, and good morning to the teachers and parents too. My name is Doctor Sanjar Ergashev, and I am a dentist. Today I am going to talk about your teeth, and I promise that it will not hurt at all.\n\nLet me start with a question. How many teeth do adults have? The answer is thirty-two. And how many do you have right now? Most of you have about twenty, because you are still losing your baby teeth. This is completely normal. But the new teeth that grow in place of them must last you for the rest of your lives, so it is very important to take good care of them.\n\nWhat is the enemy of teeth? Sugar. When you eat sweets, small bacteria in your mouth feed on the sugar and make acid. This acid slowly makes tiny holes in your teeth. We call them cavities. The longer sugar stays on your teeth, the more damage it does. That is why it is better to eat a whole cake at one time, and then clean your teeth, than to eat a biscuit every half hour all day.\n\nNow, I am not saying that you should never eat sweets. Of course you can have a piece of chocolate with your friends. But remember these simple rules. First, brush your teeth twice a day, for two minutes each time, in the morning and before bed. Second, use a soft brush and a toothpaste with fluoride, which makes your teeth stronger. Third, change your toothbrush every three months. Fourth, drink water after sweet food. Fifth, visit the dentist at least once every six months, even if nothing hurts.\n\nSome foods are friends of your teeth. Cheese, for example, helps to remove acid. Crunchy vegetables like carrots and cucumbers clean your teeth as you chew. Milk gives you calcium, which builds strong bones and teeth.\n\nI have brought some models of teeth and big toothbrushes, so everybody will have a chance to practise. In a few minutes I will call volunteers to come to the front. At the end, each child will get a small gift: a toothbrush in your favourite colour and a sticker that says that you are a Tooth Hero. Who is ready to begin?",
    qs: [
      Q("What is Doctor Ergashev's profession?", "A dentist", ["A teacher", "A dentist", "A doctor of sports"]),
      Q("How many teeth do adults have?", "Thirty-two", ["Twenty", "Twenty-eight", "Thirty-two"]),
      Q("What do bacteria make from sugar?", "Acid", ["Acid", "Calcium", "Water"]),
      Q("How long should you brush your teeth each time?", "Two minutes", ["One minute", "Two minutes", "Five minutes"]),
      Q("How often should you change your toothbrush?", "Every three months", ["Every month", "Every three months", "Every year"]),
      Q("Which food helps to remove acid?", "Cheese", ["Cheese", "Bread", "Chocolate"]),
      TF("Fluoride makes teeth stronger.", true),
      TF("Children only need to visit the dentist when something hurts.", false, "They should go every six months."),
      Q("Crunchy vegetables like carrots and ___ clean teeth as you chew.", "cucumbers"),
      Q("At the end, each child gets a sticker that says Tooth ___.", "hero")
    ]
  }
];
