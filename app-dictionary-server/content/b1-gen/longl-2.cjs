const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "A job interview",
    audioText: "Good morning, listeners, and welcome to Career Corner. Today I want to tell you about a young woman named Dilnoza, who attended a job interview last week at a logistics company in Samarkand. She was applying for the position of assistant manager in the warehouse department, and she was very nervous because it was her first interview in three years.\n\nDilnoza arrived at the office at half past nine, thirty minutes before the appointment. The receptionist, a friendly man called Rustam, offered her a glass of water and asked her to wait in a small room with a few magazines. At ten o'clock, the director, Mrs Patterson, came out and invited her into a bright meeting room on the second floor.\n\nMrs Patterson began by asking Dilnoza to describe her previous job. Dilnoza explained that she had worked for four years at a furniture factory, where she organised deliveries and trained new employees. Then the director asked about her greatest weakness. Dilnoza answered honestly that she sometimes spent too much time checking small details, but she added that she was learning to trust her team more. Mrs Patterson smiled and said that honesty was exactly what the company wanted.\n\nNext, the director explained the job. The assistant manager would lead a team of twelve workers, start every day at seven in the morning, and finish at four in the afternoon. The salary would be two thousand dollars a month, with a bonus every December if the warehouse met its targets. There was also a small canteen where employees could buy lunch at half price.\n\nTowards the end, Dilnoza asked about training. Mrs Patterson replied that all new managers attended a two week course in Tashkent, paid for by the company. Finally, she said she would phone every candidate by Friday evening.\n\nOn Thursday afternoon, Dilnoza received a call. She had been chosen from nine candidates! She will start on the first Monday of next month. Her advice for anyone attending an interview is simple: arrive early, be honest, and prepare some questions of your own. Thank you for listening, and join us again next week for more career tips.",
    qs: [
      Q("What job did Dilnoza apply for?", "Assistant manager in a warehouse", ["Receptionist in an office", "Assistant manager in a warehouse", "Driver for a delivery company"]),
      Q("How early did Dilnoza arrive before her appointment?", "Thirty minutes", ["Ten minutes", "Thirty minutes", "One hour"]),
      Q("Where did Dilnoza work before?", "At a furniture factory", ["At a bank", "At a school", "At a furniture factory"]),
      Q("What did Dilnoza say was her weakness?", "She checks small details too long", ["She is often late", "She checks small details too long", "She dislikes teamwork"]),
      Q("What time would the working day start?", "Seven in the morning", ["Six in the morning", "Seven in the morning", "Nine in the morning"]),
      Q("Where is the training course held?", "In Tashkent", ["In Samarkand", "In Tashkent", "In Bukhara"]),
      TF("The yearly bonus depends on the warehouse meeting its targets.", true),
      TF("Dilnoza was chosen from fifteen candidates.", false, "She was chosen from nine candidates."),
      Q("The receptionist offered her a glass of ___", "water"),
      Q("The assistant manager would lead a team of ___", "twelve")
    ]
  },
  {
    topic: "Opening a bakery",
    audioText: "Welcome back to Small Business Hour. This week I spoke with Aziz Karimov, who opened his own bakery six months ago in the centre of Namangan. I asked him how the idea began, and he told me a very honest story.\n\nAziz explained that for ten years he worked as a baker for a large hotel. He enjoyed the job, but he always dreamed of having a place of his own. Three years ago he started saving money, putting away two hundred dollars every month. When he had saved nearly six thousand dollars, his uncle Farhod offered to lend him another four thousand, and that made the dream possible.\n\nFinding the right building was not easy. Aziz looked at eleven different shops before he chose a small one near a school and a bus stop. He said that the location was the most important decision, because hungry students pass by every morning at eight o'clock. The rent was four hundred dollars a month, which he thought was fair.\n\nThe first weeks were difficult. Aziz baked alone from three in the morning, and he often fell asleep on a chair in the afternoon. Only a few customers came, and he almost lost hope. Then his wife, Malika, suggested a free sample of warm bread for everybody who walked past. The idea worked wonderfully. Within one week, there was a queue outside the door every morning.\n\nToday Aziz employs three people: two bakers and a young cashier named Zilola. The most popular product is a sweet cheese pastry, which sells out before noon. He also delivers cakes for weddings and birthdays, and this brings in nearly half of his profit.\n\nI asked Aziz what advice he would give to future business owners. He thought for a moment and said that people should never borrow more than they can repay, and that they should always listen to their customers. His next plan is to open a second shop in Kokand next spring. We wish him good luck, and we will be back after the news.",
    qs: [
      Q("How long did Aziz work in a hotel?", "Ten years", ["Three years", "Six months", "Ten years"]),
      Q("How much money did Aziz save every month?", "Two hundred dollars", ["Two hundred dollars", "Four hundred dollars", "Six thousand dollars"]),
      Q("Who lent Aziz extra money?", "His uncle", ["His wife", "His uncle", "A bank"]),
      Q("Why did he choose the shop he did?", "It is near a school and a bus stop", ["The rent was very cheap", "It is near a school and a bus stop", "It was close to his house"]),
      Q("What solved the problem of few customers?", "Free samples of warm bread", ["Lower prices", "Free samples of warm bread", "An advertisement on the radio"]),
      Q("Which part of the business brings nearly half of the profit?", "Cakes for weddings and birthdays", ["Cakes for weddings and birthdays", "Cheese pastries", "Bread for the hotel"]),
      TF("Aziz started baking at three in the morning in the first weeks.", true),
      TF("Aziz already has a second shop in Kokand.", false, "He plans to open it next spring."),
      Q("The rent for the shop is four hundred dollars a ___", "month"),
      Q("The most popular product is a sweet cheese ___", "pastry")
    ]
  },
  {
    topic: "Asking for a higher salary",
    audioText: "Hello everyone, and thank you for coming to today's workshop on money at work. My name is Nigora Tursunova, and for fifteen years I have helped employees prepare for difficult conversations with their managers. Today we will talk about one of the most stressful of all: asking for a higher salary.\n\nLet me begin with a short story. Last year, a client of mine named Bekzod worked as an accountant in a medium-sized company. He had been in the same job for four years and had never asked for more money. When he finally compared his salary with similar jobs, he discovered that he earned almost twenty percent less than other accountants in the city. He came to me feeling angry, but I told him that anger is a poor adviser.\n\nWe started by collecting facts. First, we found salary information on job websites and in a report published by the chamber of commerce. Second, we made a list of his achievements. For example, he had reduced the cost of paper and printing by a third, and he had trained two new colleagues without extra pay. I always say that managers listen to results, not to complaints.\n\nThen we chose the right moment. Many people ask at a bad time, such as on a Friday afternoon, when everybody is tired. Bekzod waited until the company finished its yearly report, because that was when the director was most pleased. He asked for a meeting on a Tuesday morning and began the conversation politely, by thanking the director for her support.\n\nHe did not ask for a small increase. He named a clear figure, and it was a little higher than he really wanted, which left space to negotiate. The director thought about it for a week. In the end she offered him fifteen percent more and an extra five days of holiday. Bekzod accepted immediately.\n\nSo remember three rules: prepare your facts, choose your moment, and ask for a specific amount. Now let us take a short break, and afterwards you can practise in pairs.",
    qs: [
      Q("How long has Nigora been helping employees?", "Fifteen years", ["Four years", "Fifteen years", "Twenty years"]),
      Q("What was Bekzod's job?", "Accountant", ["Teacher", "Manager", "Accountant"]),
      Q("How much less than others did Bekzod earn?", "About twenty percent", ["About twenty percent", "About fifteen percent", "About a third"]),
      Q("What was one of his achievements?", "He reduced paper and printing costs", ["He found new customers", "He reduced paper and printing costs", "He wrote a report for the director"]),
      Q("When did Bekzod ask for the meeting?", "On a Tuesday morning", ["On a Friday afternoon", "On a Tuesday morning", "On a Monday evening"]),
      Q("What did the director finally offer?", "Fifteen percent more and extra holiday", ["Ten percent more", "Fifteen percent more and extra holiday", "A new job title"]),
      TF("Bekzod trained two new colleagues and received extra pay for it.", false, "He trained them without extra pay."),
      TF("The speaker says that Friday afternoon is a bad time to ask.", true),
      Q("Bekzod named a clear ___ when he asked", "figure"),
      Q("The director thought about the request for a ___", "week")
    ]
  },
  {
    topic: "Working from home",
    audioText: "In this week's episode of our podcast about modern work, I want to share the experience of a woman called Laura Bennett, who has worked from home for two years. Laura is a translator, and before the change she travelled ninety minutes every day to an office in the middle of London.\n\nLaura says the biggest advantage was time. She used to leave the house at seven and return at half past seven in the evening. Now she wakes at eight, walks her dog in the park, and starts work at nine. She calculated that she saves almost three hours every day, and that she also saves about a hundred and fifty pounds a month on train tickets.\n\nHowever, working from home was not easy at first. Her flat is small, and she began working on the sofa. After a few weeks her back hurt, and she felt tired all the time. A friend advised her to create a proper workplace, so she bought a desk and a comfortable chair, and she put them in the quietest corner of the bedroom. She also decided to close the laptop every evening at six o'clock. Without this rule, she said, work slowly takes over your whole life.\n\nAnother problem was loneliness. In the office she had chatted with colleagues at lunch, and at home she sometimes went a whole day without speaking to anyone. To solve this, Laura joined a co-working space once a week, where she meets other freelancers and enjoys a coffee with them. She also phones her sister every Wednesday.\n\nI asked her whether she would return to an office. She laughed and said that she might, but only for two days a week. She believes the perfect job mixes both worlds. Companies, she thinks, should trust their employees more, because people who feel trusted usually work harder.\n\nThat is all for today. Next week we will visit a company in Leeds that has introduced a four day working week. Until then, take care of yourselves.",
    qs: [
      Q("What is Laura's profession?", "Translator", ["Teacher", "Translator", "Designer"]),
      Q("How long did her journey to the office take?", "Ninety minutes", ["Ninety minutes", "Three hours", "Half an hour"]),
      Q("How much does she save on tickets each month?", "About a hundred and fifty pounds", ["About fifty pounds", "About a hundred and fifty pounds", "About three hundred pounds"]),
      Q("Why did her back hurt?", "She worked on the sofa", ["She walked too much", "She worked on the sofa", "She carried a heavy bag"]),
      Q("What does Laura do once a week to avoid loneliness?", "She goes to a co-working space", ["She visits her sister", "She goes to a co-working space", "She joins a sports club"]),
      Q("How many days a week would Laura work in an office?", "Two", ["Two", "Four", "Five"]),
      TF("Laura closes her laptop every evening at six o'clock.", true),
      TF("Laura phones her sister every Monday.", false, "She phones her sister every Wednesday."),
      Q("She put her new desk in the quietest corner of the ___", "bedroom"),
      Q("Next week they will visit a company in ___", "leeds")
    ]
  },
  {
    topic: "Opening a savings account",
    audioText: "Good afternoon, and welcome to the customer information line of Silk Road Bank. I am going to tell you about our new savings account for young adults, which has been very popular since we launched it in January.\n\nTo begin with, let me describe a typical customer. Her name is Madina, she is twenty three years old, and she works as a nurse at a city hospital. Last month she visited our branch on Navoi Street because she wanted to start saving for a small flat. She spoke to an adviser called Mr Ismoilov, who explained the main features of the account.\n\nFirst, the account pays interest of seven percent a year, which is higher than most ordinary accounts. The interest is added every three months, so the money grows steadily. Second, there is no monthly fee, and customers can open the account with only fifty dollars. Third, savers may take out their money at any time, but if they withdraw more than twice in a year, the interest for that year becomes lower.\n\nMr Ismoilov also suggested a clever habit. He advised Madina to set up an automatic transfer on the day she receives her salary, which for her is the fifth of every month. In this way, she saves before she has the chance to spend. Madina decided to transfer one hundred and twenty dollars each month. In five years, she will have saved more than eight thousand dollars, including interest, and that will be enough for a deposit on a flat.\n\nWhat do you need to open the account? Bring your passport and a document that shows where you work. If you are under eighteen, a parent must come with you. The whole process takes about twenty minutes.\n\nWe also have a mobile application, so you can check your balance anytime. If you ever lose your bank card, please call our emergency number immediately, and we will block it within minutes.\n\nThank you for calling Silk Road Bank. If you would like to speak to an adviser, please stay on the line, and we will connect you shortly.",
    qs: [
      Q("What is Madina's job?", "Nurse", ["Teacher", "Nurse", "Cashier"]),
      Q("Why did Madina visit the bank?", "She wanted to save for a flat", ["She wanted a loan for a car", "She wanted to save for a flat", "She lost her bank card"]),
      Q("How much interest does the account pay?", "Seven percent a year", ["Three percent a year", "Seven percent a year", "Twelve percent a year"]),
      Q("How much money is needed to open the account?", "Fifty dollars", ["Fifty dollars", "One hundred dollars", "Twenty dollars"]),
      Q("When does Madina receive her salary?", "On the fifth of the month", ["On the first of the month", "On the fifth of the month", "On the twentieth of the month"]),
      Q("What must a customer under eighteen bring?", "A parent", ["A teacher", "A parent", "A letter from school"]),
      TF("There is a monthly fee for the account.", false, "There is no monthly fee."),
      TF("Interest is added every three months.", true),
      Q("Madina will transfer one hundred and twenty dollars each ___", "month"),
      Q("Opening the account takes about twenty ___", "minutes")
    ]
  },
  {
    topic: "Selling at the market",
    audioText: "Today's report from our radio series about local business takes us to the Chorsu bazaar, where we meet Gulnora Yusupova. Gulnora is fifty two years old, and for twenty years she has sold dried fruit and nuts from the same small stall near the entrance.\n\nI visited her at six o'clock in the morning, when the market was just waking up. Gulnora was already arranging apricots, raisins and walnuts in neat piles. She told me that the day begins even earlier at her house. She wakes at four, drinks tea, and drives to the wholesale market to buy fresh goods before the best products disappear.\n\nI asked her what makes a successful seller. She said that trust is everything. Her customers know that she never mixes old fruit with new, and that she always lets people taste before they buy. Many of them have come to her for ten years or more. One elderly man, Mr Anvar, visits every Saturday and buys exactly one kilogram of dried figs.\n\nThe work is hard, of course. Gulnora stands for ten hours, and in summer the heat under the roof is terrible. In winter her fingers become cold, and she wears woollen gloves with the ends cut off so she can count the money. Her profit changes during the year. The best season is just before the holidays, when customers buy large bags of nuts as presents. In those weeks she earns three times more than usual.\n\nRecently her daughter Sevara suggested that Gulnora should sell online. At first Gulnora laughed, because she does not trust the internet. But she agreed to try. Sevara made a simple page with photographs, and in the first month eleven people ordered from outside the city. Gulnora is now proud and says she is never too old to learn.\n\nWhen I left the bazaar, the morning crowd was arriving. Gulnora waved, smiled, and weighed a bag of raisins for her first customer of the day.",
    qs: [
      Q("What does Gulnora sell?", "Dried fruit and nuts", ["Fresh vegetables", "Dried fruit and nuts", "Clothes and shoes"]),
      Q("How long has she worked at the same stall?", "Twenty years", ["Ten years", "Twenty years", "Fifty years"]),
      Q("What time does Gulnora wake up?", "At four", ["At four", "At six", "At five"]),
      Q("Why do customers trust her?", "She never mixes old fruit with new", ["Her prices are the lowest", "She never mixes old fruit with new", "She gives gifts to children"]),
      Q("When does she earn three times more than usual?", "Before the holidays", ["In summer", "In winter", "Before the holidays"]),
      Q("Who suggested selling online?", "Her daughter", ["Her daughter", "Her husband", "Mr Anvar"]),
      TF("Gulnora immediately liked the idea of selling online.", false, "At first she laughed because she does not trust the internet."),
      TF("Mr Anvar buys figs every Saturday.", true),
      Q("In winter Gulnora wears woollen ___ with the ends cut off", "gloves"),
      Q("In the first month ___ people ordered from outside the city", "eleven")
    ]
  },
  {
    topic: "A company merger",
    audioText: "Good morning, everybody, and thank you for gathering in the main hall. I have an important announcement to make, and I want to tell you the news myself before you read it in the newspapers.\n\nAs you know, our company, Eastern Foods, has been producing biscuits and sweets for thirty years. Last night, after six months of private discussions, the board agreed to join with Golden Harvest, a larger company from Almaty. From the first of September, we will work together under a new name, which is Central Asia Foods.\n\nI understand that many of you are worried, so let me answer the three questions I have heard most often. First, will anybody lose their job? The answer is no. Nobody will be dismissed because of this change. In fact, we expect to hire about eighty new workers during the next two years, because the combined company will sell to more countries. Second, will your salary change? Your pay will stay the same for at least twelve months, and after that, everybody will be offered the same conditions as employees in Almaty. Third, will the factory close? Absolutely not. The factory in Andijan will remain our main production centre, and we plan to build a new warehouse next to it.\n\nThere will, of course, be some changes. The head office will move to a bigger building in Tashkent, and some managers will travel to Almaty for training. We will also introduce new computer software for orders, and each department will receive a lesson on how to use it in the first week of October.\n\nWhy are we doing this? The market is becoming more difficult, and small producers find it hard to compete with big imported brands. Together, we will be able to buy ingredients at lower prices and invest in modern machines.\n\nMy door is always open, and my assistant, Mrs Rakhimova, will organise small meetings for those with questions. Thank you for your hard work, and thank you for your trust. I am confident that the best years of our company are still ahead of us.",
    qs: [
      Q("How long has Eastern Foods existed?", "Thirty years", ["Six months", "Thirty years", "Eighty years"]),
      Q("Where is Golden Harvest from?", "Almaty", ["Almaty", "Andijan", "Tashkent"]),
      Q("What will the new company be called?", "Central Asia Foods", ["Golden Harvest", "Eastern Foods", "Central Asia Foods"]),
      Q("What will happen to the workers' jobs?", "Nobody will lose a job", ["Eighty will lose their jobs", "Nobody will lose a job", "Half will move to Almaty"]),
      Q("For how long will salaries stay the same?", "At least twelve months", ["At least twelve months", "Three months", "Two years"]),
      Q("Where will the head office move?", "To a bigger building in Tashkent", ["To Almaty", "To Andijan", "To a bigger building in Tashkent"]),
      TF("The factory in Andijan will close.", false, "It will remain the main production centre."),
      TF("Training on the new software starts in the first week of October.", true),
      Q("The company plans to build a new ___ next to the factory", "warehouse"),
      Q("Small producers find it hard to compete with big imported ___", "brands")
    ]
  },
  {
    topic: "Changing careers",
    audioText: "Hello and welcome to Second Chances, the programme about people who start a new life at work. Today I am talking to Timur Saidov, who was a school teacher for fourteen years and is now a computer programmer. Timur, thank you for joining us.\n\nTimur began by explaining why he left teaching. He said that he loved children, but he felt tired and underpaid. His salary was only four hundred dollars a month, and he had to give private lessons in the evening to support his family. One day his wife, Feruza, who works in a bank, told him that he was always at work and never at home. That conversation changed everything.\n\nHis first step was to choose a new field. He had always been good at mathematics, so he decided to try programming. He started with free videos on the internet, studying two hours every night after his children went to bed. After six months, he enrolled in an evening course at a technology academy, which cost nine hundred dollars. His brother Alisher lent him the money.\n\nThe hardest period came during the second year. Timur sent his documents to more than forty companies and received only three answers. He was almost thirty nine, and employers preferred younger candidates. He nearly gave up, but his teacher at the academy told him that his experience of explaining difficult ideas was valuable. In the end, a small software company in Tashkent offered him a junior position.\n\nToday he earns eleven hundred dollars a month, and he works mostly from home. He says that the first year was stressful because he was the oldest person in the team and made many mistakes. Yet his colleagues were kind, and slowly he gained confidence.\n\nI asked whether he regrets his decision. Timur smiled and said that he misses his students, so he now teaches a free programming club for teenagers on Saturdays. His advice to listeners is clear: it is never too late to change, but you need patience, a plan and support from the people you love.",
    qs: [
      Q("How long was Timur a teacher?", "Fourteen years", ["Four years", "Fourteen years", "Thirty nine years"]),
      Q("Why did Timur have to give private lessons?", "His salary was too low", ["His salary was too low", "He loved the evenings", "His school asked him to"]),
      Q("What did he use at the beginning to learn programming?", "Free videos on the internet", ["A book from his wife", "Free videos on the internet", "A course at the academy"]),
      Q("Who lent him money for the course?", "His brother", ["His wife", "His brother", "His teacher"]),
      Q("How many companies answered his documents?", "Three", ["Three", "Forty", "Eleven"]),
      Q("What does Timur do on Saturdays?", "Teaches a free programming club", ["Works in the software company", "Teaches a free programming club", "Studies at the academy"]),
      TF("Timur now earns eleven hundred dollars a month.", true),
      TF("Timur's wife works as a teacher.", false, "She works in a bank."),
      Q("He studied programming for two hours every ___", "night"),
      Q("The software company that hired him is in ___", "tashkent")
    ]
  },
  {
    topic: "Life as a freelance designer",
    audioText: "Welcome, everyone, to this evening's talk for young people who are thinking about working for themselves. I am Kamila Rahimova, and for six years I have been a freelance graphic designer. Tonight I would like to describe how my work really looks, because many people imagine it to be easier than it is.\n\nI left my office job in the spring of two thousand and eighteen. At that time, I had only three clients and about two months of savings in my bank account. My father warned me that I was taking a big risk, and he was partly right. In the first year my income was very uneven. In March I earned almost two thousand dollars, but in April I earned less than three hundred.\n\nThe lesson I learned was to plan for the bad months. Today, I keep an emergency fund that covers six months of expenses, and I never spend all of the money from a good month. I also learned to ask for a deposit of thirty percent before I begin any project. Otherwise, some clients disappear after receiving the finished work, and that happened to me twice.\n\nAnother difficulty is organising time. Nobody tells a freelancer when to start or finish, so you must be your own manager. I work from nine until five, and I use a simple notebook to list three important tasks for each day. When I complete them, I stop, even if it is only three in the afternoon.\n\nFinding customers is perhaps the biggest challenge. At first I used websites where designers compete for small jobs, but the pay was low. Now most of my clients find me through recommendations. One happy owner of a restaurant told her friends, and within two months I had four new projects.\n\nIs it worth it? For me, absolutely. I decide which jobs to accept, I travel when I want, and I earn nearly twice my old salary. But it demands discipline and courage. If you are ready, start slowly, keep your job for a while, and build your first clients in the evenings. Thank you, and now I will gladly answer your questions.",
    qs: [
      Q("How long has Kamila been a freelancer?", "Six years", ["Two years", "Six years", "Eighteen years"]),
      Q("How many clients did she have when she started?", "Three", ["Three", "Four", "Six"]),
      Q("How much did she earn in April of her first year?", "Less than three hundred dollars", ["Almost two thousand dollars", "Less than three hundred dollars", "About six hundred dollars"]),
      Q("What does she ask clients to pay before starting a project?", "Thirty percent", ["Ten percent", "Thirty percent", "Half"]),
      Q("How does she organise each day?", "She lists three important tasks", ["She lists three important tasks", "She works until midnight", "She follows a manager's plan"]),
      Q("How do most of her clients find her now?", "Through recommendations", ["On competition websites", "Through recommendations", "From newspaper advertisements"]),
      TF("Kamila now earns nearly twice her old salary.", true),
      TF("Her father said that leaving the job was no risk at all.", false, "He warned her that it was a big risk."),
      Q("Her emergency fund covers six months of ___", "expenses"),
      Q("A happy owner of a ___ told her friends about Kamila", "restaurant")
    ]
  },
  {
    topic: "Factory safety announcement",
    audioText: "Attention, please, all employees of the Bukhara Textile Factory. This is an important announcement from the safety department, and I ask you to listen carefully. Please also tell your colleagues if they are working in a different part of the building.\n\nAs you know, last month there was a small accident in the packing hall. A worker slipped on a wet floor and hurt his ankle. Fortunately, he is already recovering and will return next Monday. After an investigation, the management has decided to introduce new rules, which will begin on the first day of next month.\n\nFirst, everybody who enters the production area must wear safety shoes with rubber soles. The company will give each employee one pair free of charge. If you need a larger size, please tell Mrs Davletova in the supply office by this Friday. Second, protective glasses are now required near the cutting machines. They are available in the blue boxes by the main door, and they must be returned at the end of each shift.\n\nThird, we are going to paint yellow lines on the floor. These lines show the safe walking path, and no one should leave the path while machines are working. Please also report every spill immediately and never leave it for the next person. A clean floor is the cheapest way to prevent accidents.\n\nFourth, there will be a compulsory training session for all staff. It will take place in the canteen, and it will last ninety minutes. Employees from the morning shift will attend on Tuesday at two o'clock, and employees from the evening shift will attend on Wednesday at nine in the morning. The company will pay for the extra time. A doctor from the city hospital will also teach everybody basic first aid.\n\nFinally, we are installing a new emergency alarm, and next Thursday we will test it. Do not be afraid when you hear a loud sound. Remember that the main exit is on the north side, and the meeting point is the car park.\n\nSafety is everyone's responsibility. Thank you for your cooperation, and please keep working carefully.",
    qs: [
      Q("Where did the accident happen last month?", "In the packing hall", ["In the canteen", "In the packing hall", "In the car park"]),
      Q("What caused the accident?", "A wet floor", ["A broken machine", "A wet floor", "A missing glove"]),
      Q("What will every employee get free of charge?", "Safety shoes", ["Safety shoes", "Protective glasses", "A new uniform"]),
      Q("Where can workers find the protective glasses?", "In blue boxes by the main door", ["In the supply office", "In blue boxes by the main door", "In the canteen"]),
      Q("How long will the training session last?", "Ninety minutes", ["Thirty minutes", "Ninety minutes", "Two hours"]),
      Q("Who will teach first aid?", "A doctor from the city hospital", ["Mrs Davletova", "A doctor from the city hospital", "The factory director"]),
      TF("The evening shift will attend training on Wednesday morning.", true),
      TF("The meeting point in an emergency is the canteen.", false, "The meeting point is the car park."),
      Q("The yellow lines on the floor show the safe walking ___", "path"),
      Q("The main exit is on the north ___", "side")
    ]
  },
  {
    topic: "Applying for a business loan",
    audioText: "This is the story of a telephone call that took place last Tuesday between Otabek Nazarov, a young farmer, and a loan officer at the regional agricultural bank. I would like to tell you what they discussed, because many listeners have asked how business loans actually work.\n\nOtabek called at ten in the morning. He explained that he owns a small farm near Fergana where he grows tomatoes and cucumbers in greenhouses. He wants to build two more greenhouses, and the total cost will be about fourteen thousand dollars. He has saved four thousand dollars himself, so he needs to borrow the remaining ten thousand.\n\nThe officer, a calm woman named Mrs Hasanova, thanked him and asked several questions. First, she wanted to know how long the farm had been running. Otabek answered that it had operated for five years. Second, she asked about his income. He said that last year he earned about nineteen thousand dollars, after paying for seeds, water and workers. Third, she asked whether he had any other debts. He admitted that he still owed a small amount for a tractor, which he would finish repaying in eight months.\n\nThen Mrs Hasanova explained the conditions. The bank could offer a loan for three years with an interest rate of eleven percent. Otabek would repay the money in monthly parts of about three hundred and thirty dollars. She also mentioned that, because he works in agriculture, he would not need to pay anything during the first three months, which would help him while the greenhouses were being built.\n\nTo apply, he would have to send several documents. These included a copy of his passport, proof of land ownership, a business plan and statements from his bank for the last year. Mrs Hasanova advised him to prepare the business plan carefully, with clear numbers about future sales.\n\nOtabek thanked her warmly and promised to visit the branch on Thursday. After the call, he said he felt much calmer, because he now knew exactly what to prepare. A good conversation with the right person, he says, is worth more than a week of worry.",
    qs: [
      Q("What does Otabek grow?", "Tomatoes and cucumbers", ["Wheat and corn", "Tomatoes and cucumbers", "Apples and grapes"]),
      Q("How much money does Otabek need to borrow?", "Ten thousand dollars", ["Four thousand dollars", "Ten thousand dollars", "Fourteen thousand dollars"]),
      Q("How long has the farm been running?", "Five years", ["Three years", "Five years", "Eight years"]),
      Q("What other debt does Otabek have?", "For a tractor", ["For a house", "For a tractor", "For a car"]),
      Q("What is the interest rate offered?", "Eleven percent", ["Three percent", "Eleven percent", "Nineteen percent"]),
      Q("When will Otabek visit the branch?", "On Thursday", ["On Tuesday", "On Thursday", "On Friday"]),
      TF("Otabek does not have to pay anything during the first three months.", true),
      TF("The loan is for five years.", false, "The loan is for three years."),
      Q("Mrs Hasanova advised him to prepare a careful business ___", "plan"),
      Q("The bank wants proof of land ___", "ownership")
    ]
  },
  {
    topic: "Running an online shop",
    audioText: "Hello, and welcome to the weekly business podcast for young entrepreneurs. My guest today is Sardor Ergashev, who runs an online shop that sells handmade leather bags. He is only twenty six, but his shop already sends parcels to eight countries. Sardor, tell us how it all started.\n\nSardor explained that the idea came from his grandfather, a shoemaker in Margilan, who taught him to work with leather when he was a boy. After university, Sardor worked in an insurance company, but he spent every evening making bags in the garage. His friends liked them so much that they began asking him to sell some. He put photographs on a social media page, and within a week he had sold six bags.\n\nThe real growth began when he made his own website. It cost him about three hundred dollars, and he built it with the help of a free course. He says that good photographs are the secret of selling online, because customers cannot touch the product. He bought a simple camera and learned to take pictures near a large window, where the light is soft.\n\nHe also talked about mistakes. In his first year, he promised delivery in three days, but the post office often needed ten. Customers became upset, and some wrote bad comments. Now he explains the real time clearly on the page, and he sends a message at each step of the journey. Complaints have fallen by almost ninety percent.\n\nCurrently Sardor employs two craftsmen and one assistant who answers messages. The average bag costs eighty dollars, and last month the shop earned around nine thousand dollars. After paying for materials, salaries and delivery, about a quarter remained as profit.\n\nWhen I asked about his plans, he said that he wants to open a small workshop where tourists can watch the bags being made. He believes that people enjoy buying something when they know the story behind it. We wish him success, and we will return after a short break with advice about paying taxes.",
    qs: [
      Q("What does Sardor sell?", "Handmade leather bags", ["Handmade leather bags", "Leather shoes", "Insurance"]),
      Q("Who taught Sardor to work with leather?", "His grandfather", ["His father", "His grandfather", "His teacher"]),
      Q("How many bags did he sell in the first week?", "Six", ["Six", "Eight", "Ten"]),
      Q("What does Sardor say is the secret of selling online?", "Good photographs", ["Low prices", "Good photographs", "Fast replies"]),
      Q("What problem did he have in the first year?", "Deliveries were slower than he promised", ["Deliveries were slower than he promised", "His website did not work", "His bags broke easily"]),
      Q("How much profit remained from last month's earnings?", "About a quarter", ["About a quarter", "About half", "About ninety percent"]),
      TF("Sardor employs two craftsmen and one assistant.", true),
      TF("Sardor plans to close his shop and work in insurance.", false, "He plans to open a workshop for tourists."),
      Q("Sardor's shop sends parcels to ___ countries", "eight"),
      Q("An average bag costs eighty ___", "dollars")
    ]
  },
  {
    topic: "Planning for retirement",
    audioText: "Good evening, and thank you for joining this free lecture, organised by the city library, on planning your retirement. My name is Rustam Aliyev, and I have worked as a financial adviser for twenty two years. Many people think that retirement is a topic for old people. In fact, the best time to think about it is when you are young.\n\nLet me start with an example. Imagine two friends, Ilhom and Shirin. Ilhom began saving when he was twenty five. He put aside only fifty dollars each month. Shirin began at thirty five, but she saved one hundred dollars each month. When they both reach sixty five, who do you think has more money? Surprisingly, it is Ilhom. The reason is time. His money had ten extra years to grow, and small amounts become large when they stay in the account for a long time.\n\nNow let me explain the three main sources of income in retirement. The first is the state pension, which is paid by the government. It is useful, but for most people it covers only about half of their normal expenses. The second is the pension from your employer, and I always advise people to check whether their company offers one. Some employers add money to your account if you also contribute. The third is your own savings, which you control completely.\n\nWhat can you do today? First, make a simple budget and see how much you spend each month. Second, decide on a fixed amount, even if it is small, and move it to a separate account on payday. Third, avoid keeping all your money in one place. Some people prefer property, others prefer bank deposits, and a wise person uses both.\n\nA final warning concerns inflation. Prices rise slowly over the years, so money hidden under a mattress loses value. Please do not trust any person who promises to double your money in one month, because that is almost always a trick.\n\nThank you for listening. There are leaflets on the table by the door, and I will stay for half an hour to answer questions.",
    qs: [
      Q("How long has Rustam worked as a financial adviser?", "Twenty two years", ["Ten years", "Twenty two years", "Sixty five years"]),
      Q("Who has more money at sixty five in the example?", "Ilhom", ["Ilhom", "Shirin", "They have the same"]),
      Q("Why does Ilhom have more money?", "His money had more time to grow", ["He earned more", "His money had more time to grow", "He saved more each month"]),
      Q("How much of normal expenses does the state pension usually cover?", "About half", ["All of them", "About half", "About a tenth"]),
      Q("What is the second step the speaker suggests?", "Move a fixed amount to a separate account", ["Make a budget", "Move a fixed amount to a separate account", "Buy a flat"]),
      Q("What does the speaker say about people who promise to double your money in a month?", "It is usually a trick", ["They are good advisers", "It is usually a trick", "They work for banks"]),
      TF("Shirin began saving at the age of twenty five.", false, "Ilhom began at twenty five; Shirin began at thirty five."),
      TF("The speaker will stay for half an hour after the lecture.", true),
      Q("The state pension is paid by the ___", "government"),
      Q("Money hidden under a mattress loses ___ because of inflation", "value")
    ]
  },
  {
    topic: "Moving to a new office",
    audioText: "Good morning, colleagues, and thank you for being on time. I would like to take a few minutes to talk about our move to the new office, which will take place at the end of this month. I know that many of you have questions, so I will try to answer the most important ones now.\n\nFirst, the location. The new building is on Amir Temur Avenue, next to the metro station. For most of you, the journey will actually become shorter. The old office has been cramped for years, as everyone knows. The new one has three floors, and our company will occupy the second and the third. The ground floor contains a cafe and a small shop, where you will be able to buy lunch.\n\nSecond, the schedule. The movers will arrive on Friday the twenty sixth, at eight in the morning, and they will carry the furniture and the computers. Please put all your personal things into the boxes that Mrs Karimova will give you on Wednesday. Write your name and your department on each box in large letters. The office will be closed for the weekend, and everybody should come to the new address on Monday.\n\nThird, the layout. We have decided to try an open space for the sales and marketing teams, because they talk to each other all day. However, the accountants will have a separate quiet room, as they need to concentrate on numbers. There will also be two small meeting rooms, which you can book on the computer, and a relaxation area with sofas and a table tennis table.\n\nFourth, parking. Unfortunately, the new building has only twenty places for cars, so we will use a lottery system. The metro and the buses are an excellent alternative, and the company will pay half of the cost of a monthly ticket.\n\nFinally, I want to thank the whole team for your patience. Moving is stressful, but I truly believe that the new place will make our work happier and more efficient. If you have any concerns, please write to Mr Yusupov in the administration department. Now, let us return to work, and thank you again.",
    qs: [
      Q("Where is the new office?", "On Amir Temur Avenue", ["Next to the airport", "On Amir Temur Avenue", "In the old building"]),
      Q("How many floors will the company use?", "Two", ["One", "Two", "Three"]),
      Q("What is on the ground floor?", "A cafe and a small shop", ["A cafe and a small shop", "A car park", "A gym"]),
      Q("When will the movers arrive?", "Friday at eight in the morning", ["Wednesday at noon", "Friday at eight in the morning", "Monday at nine"]),
      Q("Who will have a separate quiet room?", "The accountants", ["The sales team", "The accountants", "The managers"]),
      Q("How will parking places be given out?", "By a lottery", ["By a lottery", "By seniority", "By payment"]),
      TF("The company will pay half of the cost of a monthly transport ticket.", true),
      TF("The new building has fifty parking places.", false, "It has only twenty."),
      Q("Mrs Karimova will give everyone ___ on Wednesday", "boxes"),
      Q("The relaxation area has sofas and a table ___ table", "tennis")
    ]
  },
  {
    topic: "Becoming an apprentice electrician",
    audioText: "Hello, listeners. In today's programme we look at a way of starting a career without going to university: the apprenticeship. To illustrate, I will tell you about Bobur Hamidov, an eighteen year old from Karshi who recently began training as an electrician.\n\nBobur finished school last summer with average marks. His parents hoped that he would study economics, but he knew that it was not for him. He enjoyed practical work, and he often helped his uncle repair lamps and sockets at home. In September he saw an advertisement for an apprenticeship at a building company, and he decided to apply.\n\nThe selection was not simple. First, there was a written test about basic mathematics, and sixty people took it. Then twenty were invited to an interview, and in the end only eight were accepted. Bobur says that the director asked him a strange question: what would he do if a colleague made a dangerous mistake? He answered that he would speak to the colleague immediately and, if necessary, inform the supervisor. The director nodded and wrote something down.\n\nThe programme lasts three years. Four days a week, Bobur works on real building sites with an experienced electrician named Mr Sultanov, and one day a week he studies theory at a technical college. For this, he receives a monthly payment of two hundred and fifty dollars, which will increase each year. When he finishes, he will earn at least ten times more than his first payment, though this depends on his skills.\n\nBobur says that the first week was frightening. He carried heavy cables up five floors and made a mistake with a switch. Mr Sultanov did not shout. He simply showed him again, patiently, and said that everyone starts this way. Now Bobur can read building plans and install lights without any help.\n\nExperts say that skilled workers like electricians will be needed for many years, because every new building requires them. Bobur's advice for school leavers is to look at all the options. A university is not the only road, and a good trade can bring both security and pride.",
    qs: [
      Q("Where is Bobur from?", "Karshi", ["Karshi", "Samarkand", "Fergana"]),
      Q("What did Bobur's parents want him to study?", "Economics", ["Electricity", "Economics", "Medicine"]),
      Q("How many people were finally accepted?", "Eight", ["Twenty", "Sixty", "Eight"]),
      Q("What would Bobur do if a colleague made a dangerous mistake?", "Speak to the colleague and tell the supervisor if needed", ["Ignore it", "Speak to the colleague and tell the supervisor if needed", "Leave the building site"]),
      Q("How many days a week does he work on building sites?", "Four", ["Two", "Four", "Five"]),
      Q("How did Mr Sultanov react to Bobur's mistake?", "He showed him again patiently", ["He shouted at him", "He showed him again patiently", "He sent him home"]),
      TF("The apprenticeship lasts three years.", true),
      TF("Bobur receives five hundred dollars a month at the start.", false, "He receives two hundred and fifty dollars."),
      Q("Bobur studies theory one day a week at a technical ___", "college"),
      Q("In the first week Bobur carried heavy ___ up five floors", "cables")
    ]
  }
];
