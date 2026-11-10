const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
{
topic: "A Famous Inventor: Alexander Graham Bell",
passage: "Alexander Graham Bell was born in Edinburgh, Scotland, in 1847. His father and grandfather were both teachers of speech, so Alexander grew up surrounded by the study of sounds and voices. His mother gradually lost her hearing, and this experience made him determined to find better ways of helping people who could not hear. When he was twenty-three, his family moved to Canada because the doctors feared that the damp Scottish weather might damage his health.\n\nA year later Bell moved to Boston, where he started to teach deaf children how to speak. He was a patient and enthusiastic teacher, and many parents were grateful to him. In the evenings, however, he worked on his own experiments. He believed that it was possible to send the human voice along a wire, just as telegraph machines already sent short electrical signals. Many of his friends laughed at the idea, but he refused to give up.\n\nHe could not do the work alone, so he hired a young electrician named Thomas Watson. The two men spent months in a small, noisy workshop, building strange machines and testing them late into the night. On the tenth of March, 1876, something extraordinary happened. Bell was in one room and Watson was in another when Bell spilled some acid on his clothes. He called out, \"Mr. Watson, come here, I want to see you.\" Watson heard every word through the machine and ran to tell him the good news.\n\nBell had already received his patent for the telephone a few days earlier, and within a year the new invention was being used in offices and homes. Later he helped to start a company that eventually became one of the largest telephone businesses in the world. Yet he never stopped being a teacher at heart. He spent his later years working on flying machines, boats and medical devices, and he always said that his real success was helping deaf people. When he died in 1922, telephone companies across North America stopped service for one minute to honour him.",
qs: [
Q("Why did Bell's family move to Canada?", "Because the doctors worried about his health", ["Because his father found a new job", "Because the doctors worried about his health", "Because he wanted to study at a university"]),
Q("What did Bell do in Boston?", "He taught deaf children to speak", ["He built telegraph machines", "He taught deaf children to speak", "He worked as an electrician"]),
Q("What did Bell's friends think about his idea?", "They laughed at it", ["They paid for it", "They laughed at it", "They already used it"]),
Q("Who was Thomas Watson?", "A young electrician who helped Bell", ["Bell's teacher", "A young electrician who helped Bell", "A doctor from Edinburgh"]),
Q("What happened on the tenth of March, 1876?", "Bell spoke to Watson through the machine", ["Bell received a patent", "Bell spoke to Watson through the machine", "Watson left the workshop"]),
Q("What did Bell say was his real success?", "Helping deaf people", ["Making money", "Helping deaf people", "Building boats"]),
TF("Bell's mother was a famous teacher of speech.", false, "His father and grandfather were teachers; his mother lost her hearing."),
TF("Telephone companies stopped service for one minute when Bell died.", true),
Q("Bell worked in a small, noisy ___ with Watson.", "workshop"),
Q("Bell received his ___ for the telephone a few days before the famous call.", "patent")
]
},
{
topic: "A Traditional Uzbek Wedding",
passage: "My cousin Dilnoza got married last month, and I want to tell you about the celebration because it was the most colourful wedding I have ever attended. The preparations had started almost half a year before the event. Both families had met several times to discuss the date, the guests and the food. In the end they decided to hold the ceremony in late September, when the weather in Samarkand is warm but not too hot and the fruit in the gardens is ripe.\n\nThe celebration began on Thursday evening with a small party called the kina kechasi, or henna night. The women of the family gathered at the bride's house and sang old songs while the bride's friends painted her hands with henna. Dilnoza wore a simple red dress, and my grandmother, who had brought the same songs from her own village, cried a little because she remembered her own wedding fifty years earlier.\n\nOn Saturday the main ceremony took place in a big hall decorated with hundreds of white and pink flowers. About four hundred guests had been invited, and many of them had travelled from other cities. The groom, Sardor, arrived in a black car with his brothers and friends, and a band played traditional music at the entrance. The imam read a blessing, and the couple promised to care for each other. Afterwards the bride bowed politely to every older relative, which is a sign of respect that has been kept for centuries.\n\nThe dinner was served at eight o'clock. There was plov cooked in huge pots, fresh salads, grilled meat and, of course, tables full of sweets and fruit. Between the courses, relatives performed dances, and even my little brother joined in, although he had said he would be too shy. The party finished after midnight. All the guests agreed that the evening had been unforgettable, warm and full of laughter. Dilnoza says that if she could do it again, she would change nothing, except perhaps the shoes, which hurt her feet by the end of the night.",
qs: [
Q("When did the families decide to hold the ceremony?", "In late September", ["In early spring", "In late September", "In December"]),
Q("Why did they choose that time of year?", "The weather is warm and the fruit is ripe", ["The hall was cheaper", "The weather is warm and the fruit is ripe", "Both families were on holiday"]),
Q("What happened at the henna night?", "Friends painted the bride's hands", ["Guests ate plov", "Friends painted the bride's hands", "The imam read a blessing"]),
Q("Why did the narrator's grandmother cry?", "She remembered her own wedding", ["She was unwell", "She remembered her own wedding", "She missed her village school"]),
Q("How did the groom arrive at the main ceremony?", "In a black car with his friends", ["On horseback", "In a black car with his friends", "On foot with the band"]),
Q("What would Dilnoza change about the day?", "Her shoes", ["The food", "Her shoes", "The music"]),
TF("About four hundred guests were invited to the main ceremony.", true),
TF("The narrator's little brother refused to dance.", false, "He joined the dancing although he had said he would be shy."),
Q("The main ceremony took place in a big hall decorated with white and pink ___.", "flowers"),
Q("The party finished after ___.", "midnight")
]
},
{
topic: "Student Life at University",
passage: "When Aziza started her first year at the Tashkent University of Economics, she was both excited and nervous. She had grown up in a small town in the Fergana Valley, and she had never lived away from her parents before. On her first morning she got lost twice on her way to the main building, and she arrived at her lecture ten minutes late. Fortunately, the professor was kind and simply asked her to sit down near the front.\n\nIn the beginning, the most difficult thing was managing her time. At school, the teachers had told her exactly what to study every day, but at university she had to organise her own work. She often stayed up until two o'clock in the morning to finish essays, and then she felt too tired to concentrate during classes. After the first exams, in which she received lower marks than she had expected, she decided to change her habits. She bought a notebook, wrote a weekly plan and promised herself to go to bed before midnight.\n\nThe change worked. Within a month she was getting better results, and she also had enough free time to join the university debate club. There she met students from many different faculties, and she discovered that she enjoyed speaking in public. Her new friend Kamran, who studied law, taught her how to prepare strong arguments. If she had not joined the club, she says, she would probably still be shy.\n\nLife in the dormitory was not always comfortable. Four girls shared a small room, and the kitchen was often crowded. However, the girls cooked together at weekends, shared notes before exams and helped each other when someone was ill. Aziza now thinks that these friendships are the most valuable part of her education. She is in her third year, and she hopes to work for an international bank after graduation. Her advice to new students is simple: do not be afraid to ask for help, and start preparing for exams earlier than you think you need to.",
qs: [
Q("Where did Aziza grow up?", "In a small town in the Fergana Valley", ["In Tashkent", "In a small town in the Fergana Valley", "In Samarkand"]),
Q("What happened on her first morning?", "She got lost and was late", ["She missed the exam", "She got lost and was late", "She met Kamran"]),
Q("What was the hardest thing at the beginning?", "Managing her time", ["Understanding the professors", "Managing her time", "Cooking meals"]),
Q("What did she do after her disappointing exam results?", "She made a weekly plan", ["She left the dormitory", "She made a weekly plan", "She changed her faculty"]),
Q("What did Kamran teach her?", "How to prepare strong arguments", ["How to cook plov", "How to prepare strong arguments", "How to manage money"]),
Q("What does Aziza hope to do after graduation?", "Work for an international bank", ["Teach at a school", "Work for an international bank", "Study law"]),
TF("Aziza studies law at the university.", false, "Kamran studies law; Aziza studies economics."),
TF("Four girls shared one room in the dormitory.", true),
Q("Aziza joined the university debate ___.", "club"),
Q("She promised herself to go to bed before ___.", "midnight")
]
},
{
topic: "The Old Bazaar",
passage: "Every city has a place where its heart can be felt, and in my hometown that place is the old bazaar. It was founded more than three hundred years ago, when caravans from China and Persia used to stop here to rest and sell their goods. Although the city has changed a great deal since then, the market still stands in the same spot, and many of the shops have been run by the same families for generations.\n\nMy uncle Rustam sells dried fruit and nuts at a small stall near the main gate. He starts work at five o'clock in the morning, long before the first customers arrive, because he likes to arrange the apricots, raisins and almonds in neat pyramids. His father had the same stall before him, and he still uses the old brass scales that his grandfather bought in 1950. When I was a child, he let me weigh the nuts for customers, and I felt very important.\n\nThe bazaar is divided into sections. In one corner, bakers sell warm bread that has just come out of clay ovens, and the smell reaches you from fifty metres away. In another, coppersmiths hit metal with small hammers, making teapots and trays with beautiful patterns. There is also a covered hall where women sell colourful silk scarves, and a quiet street for spices, where the air smells of pepper, cumin and saffron.\n\nIn recent years, the bazaar has had to face new challenges. Big supermarkets have opened nearby, and some young people prefer to shop there because the prices are fixed and there is air conditioning. However, tourists love the market, and the city council has decided to repair the old roof and to put up signs in English. Many of the older shopkeepers feel sad about these changes, but they also hope that new customers will arrive. My uncle is not worried. He says that people do not come to the bazaar only to buy things; they come to talk, to bargain, to taste and to feel that they belong to something older than themselves.",
qs: [
Q("Who used to stop at the bazaar long ago?", "Caravans from China and Persia", ["Soldiers from Russia", "Caravans from China and Persia", "Sailors from India"]),
Q("What time does Uncle Rustam start work?", "At five in the morning", ["At five in the morning", "At nine in the morning", "At noon"]),
Q("What did the narrator do as a child at the stall?", "He weighed nuts for customers", ["He sold bread", "He weighed nuts for customers", "He repaired scales"]),
Q("What do coppersmiths make?", "Teapots and trays", ["Teapots and trays", "Silk scarves", "Clay ovens"]),
Q("Why do some young people prefer supermarkets?", "Prices are fixed and there is air conditioning", ["They are cheaper", "Prices are fixed and there is air conditioning", "They are closer to home"]),
Q("What is the city council going to do?", "Repair the roof and add English signs", ["Close the market", "Repair the roof and add English signs", "Build a new supermarket"]),
TF("The market stands in a different place from where it started.", false, "It still stands in the same spot."),
TF("Uncle Rustam's grandfather bought the brass scales.", true),
Q("The spice street smells of pepper, cumin and ___.", "saffron"),
Q("The bakers cook bread in clay ___.", "ovens")
]
},
{
topic: "The Navruz Festival",
passage: "Navruz is the most joyful holiday of the year in Central Asia. It is celebrated on the twenty-first of March, the day when winter finally gives way to spring, and its history goes back more than three thousand years. The word itself means \"new day\", and for many families it is the real beginning of the year, with new hopes and new plans.\n\nPreparations usually begin several weeks earlier. Housewives clean their homes from top to bottom, because it is believed that the new year should start in a tidy house. People also pay back old debts and forgive old arguments. In the last week of winter, women prepare sumalak, a sweet dish made from wheat sprouts, flour and water. It must be cooked slowly for about twenty-four hours, and neighbours often take turns stirring the huge pot through the night. They sing songs and tell stories to stay awake, and the evening becomes a small party.\n\nOn the day of Navruz itself, the streets are full of people in bright clothes. In the parks and squares, there are concerts, folk dances and sports competitions. Children watch puppet shows, and men try to win wrestling contests, which are among the oldest traditions of the holiday. Many cities organise a large fair where craftsmen sell pottery, carpets and wooden toys. If the weather is good, entire families have picnics under blossoming trees.\n\nThe table at Navruz is always generous. Besides sumalak, there are samsa with pumpkin, boiled eggs, nuts and a special soup called halim. Even strangers who happen to pass by are invited inside for a cup of tea. Guests are welcome at any house, and it is considered polite to visit at least three families during the day. Last year, the festival was added to an international list of cultural heritage, and the organisers hope that this will help young people to remember how much the old customs mean. For my grandmother, however, the meaning has never changed: Navruz is simply a day when everybody is kind to everybody else.",
qs: [
Q("When is Navruz celebrated?", "On the twenty-first of March", ["On the first of January", "On the twenty-first of March", "On the first of September"]),
Q("What does the word Navruz mean?", "New day", ["New day", "Happy spring", "Old year"]),
Q("Why do people clean their homes?", "The new year should start in a tidy house", ["Guests are coming from abroad", "The new year should start in a tidy house", "It is a rule of the city"]),
Q("How long must sumalak be cooked?", "About twenty-four hours", ["About two hours", "About twelve hours", "About twenty-four hours"]),
Q("What can children watch on Navruz?", "Puppet shows", ["Puppet shows", "Football matches", "Films"]),
Q("How many families is it polite to visit?", "At least three", ["At least one", "At least three", "All the neighbours"]),
TF("Sumalak is made from wheat sprouts, flour and water.", true),
TF("Navruz is a very new holiday that started a hundred years ago.", false, "Its history goes back more than three thousand years."),
Q("Wrestling contests are among the oldest ___ of the holiday.", "traditions"),
Q("Neighbours take turns stirring the huge ___ through the night.", "pot")
]
},
{
topic: "The Silk Road Merchant",
passage: "Many centuries ago, a merchant named Mansur lived in Bukhara. He was a quiet man with a sharp mind, and he had made a living by trading silk, spices and paper between Central Asia and the cities of the east. Every spring he gathered a caravan of about forty camels and travelled for nearly six months, crossing deserts and mountains before he reached the markets of China.\n\nThe journey was never easy. Before he left, Mansur always studied the weather and the roads, and he hired guides who knew where to find water. Even so, there were dangers. Once, a sandstorm had lasted three days, and the caravan lost two camels and a large part of its food, so the travellers had to wait several days for new supplies to arrive. On another occasion, thieves had followed the travellers for a week, waiting for a chance to attack. Mansur only saved his goods because he had paid a local leader to send soldiers with the caravan.\n\nAt the stops along the road, merchants from different countries met, ate together and exchanged news. Mansur learned to speak four languages, and he said that this was more valuable than gold. He also brought back ideas as well as goods. From one trip he returned with the secret of making fine paper, and from another with seeds of new fruit trees that later grew in the gardens of his home city.\n\nWhen he grew old, Mansur stopped travelling and opened a small guesthouse near the city gate, where he welcomed other caravans. In the evenings, young traders sat around him and listened to his stories. He always ended with the same advice: a successful merchant must be honest, because a damaged reputation travels faster than any camel. Historians say that men like Mansur did more than sell goods. They connected distant peoples and helped science, art and religion to spread across continents, and their influence can still be seen in the cities of the Silk Road today.",
qs: [
Q("Where did Mansur live?", "In Bukhara", ["In Bukhara", "In Beijing", "In Baghdad"]),
Q("How long did the journey to China take?", "Nearly six months", ["About two weeks", "Nearly six months", "More than two years"]),
Q("What happened during the sandstorm?", "The caravan lost two camels", ["The caravan lost two camels", "Thieves attacked", "The guides ran away"]),
Q("How did Mansur save his goods from the thieves?", "He paid for soldiers to travel with the caravan", ["He hid them in the desert", "He paid for soldiers to travel with the caravan", "He sold them early"]),
Q("What did Mansur say was more valuable than gold?", "Speaking four languages", ["Speaking four languages", "Owning forty camels", "Knowing the weather"]),
Q("What did he do when he grew old?", "He opened a guesthouse", ["He moved to China", "He opened a guesthouse", "He became a teacher"]),
TF("Mansur once brought back seeds of new fruit trees.", true),
TF("Mansur believed that honesty was not important for merchants.", false, "He said a merchant must be honest."),
Q("Every spring Mansur gathered a caravan of about forty ___.", "camels"),
Q("A damaged ___ travels faster than any camel, he used to say.", "reputation")
]
},
{
topic: "Life in a Big Family",
passage: "In our house in Namangan, eleven people live under one roof: my grandparents, my parents, my two aunts, my older brother, my sister, my little cousin and me. Many of my friends find this surprising, but for us it is completely normal. In Uzbekistan, it is traditional for several generations to live together, and I have come to believe that this way of life has more advantages than disadvantages.\n\nOf course, there are some difficulties. In the morning, everybody wants to use the bathroom at the same time, so my father made a timetable and stuck it on the door. My sister and I have to share a room, and she often complains that I leave my books on her bed. Dinner is usually noisy because everybody speaks at once, and my grandmother has to ask for silence before we start eating.\n\nOn the other hand, we never feel lonely. When I come home from school, there is always somebody who wants to hear about my day. If I have a problem with my homework, my aunt, who is a maths teacher, helps me, and my brother, who studies computer science, explains difficult tasks on the computer. When my mother was ill last winter, the whole family took care of her, and the house never stopped running smoothly.\n\nMy grandfather is the head of the family, and everybody respects his opinion. Every Friday he gathers us in the garden and tells stories about his youth. He grew up in a village without electricity, and he walked six kilometres to school every day. We always laugh when he says that today's children would not survive such a walk. He says it kindly, and we all know he is proud of us. Still, I think his stories teach us more than any textbook.\n\nIf I move to another city after school, I will probably miss this noisy house very much. Perhaps one day I will have a big family of my own, and I will make a timetable for the bathroom too.",
qs: [
Q("How many people live in the narrator's house?", "Eleven", ["Seven", "Nine", "Eleven"]),
Q("Why did the father make a timetable?", "Everybody wants the bathroom in the morning", ["Everybody wants the bathroom in the morning", "The children were late for school", "The kitchen was too crowded"]),
Q("What does the narrator's sister complain about?", "He leaves his books on her bed", ["He is too noisy", "He leaves his books on her bed", "He eats her food"]),
Q("Who helps with maths homework?", "An aunt", ["A brother", "An aunt", "A grandmother"]),
Q("What does the grandfather do every Friday?", "He tells stories in the garden", ["He tells stories in the garden", "He cooks dinner", "He visits the school"]),
Q("How did the grandfather get to school as a child?", "He walked six kilometres", ["He rode a donkey", "He took a bus", "He walked six kilometres"]),
TF("The narrator thinks big families have more advantages than disadvantages.", true),
TF("The narrator's brother studies medicine.", false, "He studies computer science."),
Q("Dinner is usually ___ because everybody speaks at once.", "noisy"),
Q("The grandfather grew up in a village without ___.", "electricity")
]
},
{
topic: "The History of Samarkand",
passage: "Samarkand is one of the oldest cities in the world. Archaeologists believe that people have lived on this site for more than twenty-five centuries, and in ancient times the city was already famous under the name Marakanda. When Alexander the Great arrived in 329 BC, he is said to have described it as even more beautiful than he had imagined.\n\nThe city grew rich because it stood at the crossroads of the Silk Road. Merchants brought silk from China, glass from the Mediterranean and horses from the steppes, and Samarkand became a centre of crafts, science and trade. In the thirteenth century, however, it was almost completely destroyed by Mongol armies, and for many years the population was very small.\n\nThe greatest period in its history began in 1370, when Amir Timur chose Samarkand as the capital of his empire. He brought skilled builders, painters and scholars from all the countries he had conquered, and he ordered them to create a city that would impress the whole world. During his reign, the huge mosque of Bibi-Khanym and the beautiful Shah-i-Zinda complex were built, with their blue tiles that still shine in the sun today.\n\nHis grandson Ulugh Beg continued the tradition of learning. He was a ruler, but he was even more interested in mathematics and astronomy. In the 1420s he built an enormous observatory, where he and his colleagues observed the stars with great accuracy. The catalogue of stars they produced was used by scientists in Europe for more than two hundred years. Sadly, Ulugh Beg was killed in 1449, and the observatory was later destroyed.\n\nToday, visitors come from all over the world to see the Registan Square, where three magnificent madrasas face each other. In 2001, UNESCO added Samarkand to its World Heritage List, and the government has spent a lot of money on repairing the old buildings. Many local people work as guides, ceramic makers or hotel managers, and they are proud that their ancestors left such a remarkable legacy.",
qs: [
Q("How long have people lived on the site of Samarkand?", "More than twenty-five centuries", ["About five hundred years", "More than twenty-five centuries", "Exactly one thousand years"]),
Q("What was the ancient name of the city?", "Marakanda", ["Marakanda", "Bukhara", "Registan"]),
Q("Why did Samarkand become rich?", "It stood at the crossroads of the Silk Road", ["It had gold mines", "It stood at the crossroads of the Silk Road", "It had a large port"]),
Q("What happened in the thirteenth century?", "Mongol armies almost destroyed the city", ["Mongol armies almost destroyed the city", "Timur chose it as his capital", "UNESCO visited the city"]),
Q("What was Ulugh Beg most interested in?", "Mathematics and astronomy", ["War and conquest", "Mathematics and astronomy", "Architecture and music"]),
Q("When was Samarkand added to the World Heritage List?", "In 2001", ["In 1449", "In 1991", "In 2001"]),
TF("Amir Timur made Samarkand his capital in 1370.", true),
TF("Ulugh Beg's star catalogue was never used outside Central Asia.", false, "It was used by European scientists for over two hundred years."),
Q("At the Registan Square, three magnificent ___ face each other.", "madrasas"),
Q("The blue ___ of Shah-i-Zinda still shine in the sun today.", "tiles")
]
},
{
topic: "A Day in a City Library",
passage: "The central library of our city is a large grey building with tall windows, and I have been going there almost every Saturday since I was twelve. At the time I only wanted a quiet place to read, because my little brothers made so much noise at home that I could not even finish a page. I never imagined that the library would become such an important part of my life.\n\nThe building is open from nine o'clock in the morning until eight in the evening, and by half past nine the reading rooms are usually full. Students prepare for exams, retired men read newspapers and young mothers bring small children to the story hour, which is held every Saturday at eleven. The librarian, Mrs Karimova, has worked there for thirty years, and she knows the name of nearly every regular visitor. She always seems to remember what kind of books people like, and she once recommended a novel to me that I still consider my favourite.\n\nIn recent years the library has changed a lot. Ten years ago it only had paper books, but now there are also computers, free internet and a section where visitors can borrow e-readers. Some people worried that nobody would visit any more because everything can be found online. In fact, the opposite happened. The number of visitors has increased by almost forty per cent, because the library started organising language clubs, film evenings and workshops for children.\n\nLast month I joined a volunteer programme. Two afternoons a week, I help elderly people to use smartphones and to send messages to their grandchildren abroad. One old gentleman, Mr Usmanov, was so happy when he made his first video call that he brought me a bag of apples the next day. I realised then that a library is not just a collection of books; it is a place where a city shares knowledge and kindness. If I become a teacher one day, I would like to work in a place like this.",
qs: [
Q("Why did the narrator first start going to the library?", "It was too noisy at home", ["It was too noisy at home", "Her teacher told her to go", "She wanted to meet friends"]),
Q("When is the story hour held?", "Every Saturday at eleven", ["Every Sunday at nine", "Every Saturday at eleven", "Every evening at eight"]),
Q("How long has Mrs Karimova worked at the library?", "Thirty years", ["Ten years", "Twelve years", "Thirty years"]),
Q("What do people borrow in the new section?", "E-readers", ["E-readers", "Films", "Computers"]),
Q("What happened to the number of visitors?", "It increased by almost forty per cent", ["It fell by forty per cent", "It increased by almost forty per cent", "It stayed the same"]),
Q("What does the narrator do as a volunteer?", "Helps elderly people use smartphones", ["Reads stories to children", "Helps elderly people use smartphones", "Repairs old books"]),
TF("The library is open until midnight.", false, "It closes at eight in the evening."),
TF("Mr Usmanov brought the narrator some apples.", true),
Q("The library started organising language clubs, film evenings and ___ for children.", "workshops"),
Q("Mrs Karimova once recommended a ___ that the narrator still loves.", "novel")
]
},
{
topic: "Learning from a Grandmother's Stories",
passage: "When I was nine years old, my grandmother, Zulfiya, moved in with us after my grandfather died. At first I was not very happy about it, because I had to give her my bedroom and sleep on a folding bed in the living room. However, I soon discovered that she was the best storyteller I had ever met, and I changed my mind completely.\n\nEvery evening, after dinner, she sat in her armchair with a cup of green tea and began to talk about her childhood. She was born in 1941, during a difficult time, and her family lived in a small village near Andijan. Her father had gone away to the war and never returned, so her mother had to raise five children alone. My grandmother started working in the cotton fields when she was only eleven. She told me that she used to wake up before sunrise, walk two kilometres to the field and come home with blisters on her hands.\n\nDespite those hard times, her stories were never sad. She remembered the songs the women sang while they worked and the way the neighbours shared their bread when somebody had nothing to eat. She said that the war had taught her people one important lesson: if you help others today, someone will help you tomorrow. She also told me about her teacher, who had walked from house to house to persuade parents to send their daughters to school. Thanks to that teacher, my grandmother learned to read, and later she became a nurse.\n\nI am seventeen now, and my grandmother is eighty-three. Last year I decided to write down her stories before I forgot them. I bought a thick notebook and recorded her voice on my phone as well. My teacher liked the project so much that she suggested I should send it to a national competition for young historians. I did not win, but I received a certificate, and my grandmother kept it on her shelf next to her old photographs. She says it is the most precious thing she owns.",
qs: [
Q("Why did the narrator's grandmother move in?", "Her husband had died", ["Her husband had died", "Her village was destroyed", "She became a nurse"]),
Q("Where did the narrator sleep after she arrived?", "On a folding bed in the living room", ["In the garden", "On a folding bed in the living room", "In his parents' bed"]),
Q("What happened to the grandmother's father?", "He went to the war and never returned", ["He became a farmer", "He went to the war and never returned", "He moved to Andijan"]),
Q("How old was she when she started working in the cotton fields?", "Eleven", ["Nine", "Eleven", "Fifteen"]),
Q("What lesson did the war teach her people?", "If you help others, someone will help you", ["Always save money", "If you help others, someone will help you", "Never leave your village"]),
Q("What did the narrator do with the stories?", "Wrote them down and recorded them", ["Wrote them down and recorded them", "Made a film", "Sold them to a magazine"]),
TF("The grandmother's teacher persuaded parents to send daughters to school.", true),
TF("The narrator won the national competition.", false, "He did not win, but he received a certificate."),
Q("The grandmother always drank green ___ in the evening.", "tea"),
Q("She kept the certificate on her shelf next to her old ___.", "photographs")
]
},
{
topic: "A Visit to the Museum of Applied Arts",
passage: "Last weekend our class visited the Museum of Applied Arts, and I think it was the most interesting school trip we have had this year. We met our teacher, Mr Ismoilov, at the bus station at nine o'clock, and after a forty-minute ride we arrived at a beautiful building with a garden full of roses. The museum was once the house of a rich diplomat, and it was built at the beginning of the twentieth century.\n\nA guide named Gulnora welcomed us and gave each of us a small audio device. She explained that the museum keeps over five thousand objects, including embroidery, ceramics, jewellery and wooden furniture from every region of the country. We began with the textile hall, where she showed us a famous silk wall hanging called suzani. She told us that, in the past, a bride's family began to sew a suzani as soon as a girl was born, and the work could take many years. Every pattern had a special meaning: the sun for happiness, the pomegranate for a large family and the moon for hope.\n\nIn the ceramics room, we learned that every city has its own style. Pottery from Rishtan is famous for its deep blue and green colours, while the plates from Khiva are decorated with simple geometric lines. Gulnora said that some of the recipes for the glaze had been kept secret in the same families for hundreds of years. We even met a master potter who was working in the corner of the room, and he allowed a few students to try the wheel. My friend Jasur made a very crooked bowl, and everyone laughed, including Jasur himself.\n\nAfter lunch in the garden, we had one hour to explore on our own. I spent most of it in the jewellery room, where I admired silver earrings that were nearly two hundred years old. In the end, I bought a small postcard of a suzani for my mother. On the bus back to school, Mr Ismoilov asked us to write a short report. I think mine will be easy, because I will never forget what I saw.",
qs: [
Q("How long was the bus ride?", "Forty minutes", ["Twenty minutes", "Forty minutes", "Two hours"]),
Q("Who used to live in the museum building?", "A rich diplomat", ["A rich diplomat", "A famous potter", "A king"]),
Q("What was a suzani traditionally made for?", "A bride", ["A school", "A bride", "A king"]),
Q("What does the pomegranate pattern mean?", "A large family", ["Happiness", "Hope", "A large family"]),
Q("What are Rishtan plates famous for?", "Deep blue and green colours", ["Deep blue and green colours", "Geometric lines", "Silver edges"]),
Q("What did the narrator buy?", "A postcard of a suzani", ["A silver earring", "A postcard of a suzani", "A small bowl"]),
TF("The museum keeps over five thousand objects.", true),
TF("Jasur made a perfect bowl on the wheel.", false, "His bowl was very crooked."),
Q("A master ___ allowed a few students to try the wheel.", "potter"),
Q("The students ate lunch in the ___.", "garden")
]
},
{
topic: "Moving to a Big City",
passage: "Three years ago, my family moved from a quiet village near Karshi to Tashkent. My father had been offered a job in a construction company, and my parents decided that the capital would give me and my sister better opportunities for education. I was fourteen at the time, and I was not at all happy. I had to leave my friends, my school and my grandfather's orchard, where I had spent every summer of my life.\n\nThe first weeks were hard. The city seemed enormous and noisy, with cars everywhere and thousands of people rushing in all directions. I was afraid of the metro, and I took the wrong train on my first day and ended up at the other end of the line. A kind old woman noticed that I looked lost, and she explained how to get back. That small act of kindness made me feel a little better.\n\nSchool was another challenge. My new class had thirty-two students, and most of them had known each other since the first grade. They spoke quickly, used words I had never heard and often joked about things I did not understand. I sat alone at lunch for nearly a month. Then one day a boy named Timur asked if I wanted to join the school football team. I was not a great player, but I ran fast and worked hard, and soon I had a whole group of friends.\n\nNow I cannot imagine living anywhere else. I love the long boulevards, the tall glass buildings and the evenings when the whole city lights up. There are many things to do: I can visit museums, go to concerts or simply walk by the river with my friends. Of course, I still miss the fresh air and the silence of the village. Every holiday we travel back to see my grandfather, and I help him pick apples. I have learned that you do not have to choose between two places; you can belong to both.",
qs: [
Q("Why did the family move to Tashkent?", "The father got a job and the children could study better", ["The father got a job and the children could study better", "The village was flooded", "The grandfather asked them"]),
Q("How old was the narrator when they moved?", "Fourteen", ["Ten", "Fourteen", "Eighteen"]),
Q("What happened on the first day in the metro?", "He took the wrong train", ["He took the wrong train", "He lost his phone", "He met Timur"]),
Q("Who helped him find his way?", "A kind old woman", ["A police officer", "A kind old woman", "A taxi driver"]),
Q("How did he make friends at school?", "He joined the football team", ["He joined the football team", "He helped with homework", "He started a band"]),
Q("What does he do in the village on holidays?", "He helps pick apples", ["He helps pick apples", "He studies for exams", "He plays football"]),
TF("The narrator's class had thirty-two students.", true),
TF("The narrator now wants to move back to the village for good.", false, "He says he cannot imagine living anywhere else."),
Q("He sat alone at lunch for nearly a ___.", "month"),
Q("He loves the long boulevards and the tall glass ___.", "buildings")
]
},
{
topic: "The Story of the Printing Press",
passage: "Before the fifteenth century, books were extremely rare and expensive. Every copy had to be written by hand, usually by monks who spent months on a single volume. Because of this, only kings, churches and very rich families could afford to own a library, and most ordinary people never saw a book in their entire lives.\n\nAround 1440, a German goldsmith named Johannes Gutenberg started to experiment with a new method. He already knew how to work with metal, and he realised that it would be possible to make small metal letters that could be arranged in rows, covered with ink and pressed onto paper. After the page was printed, the letters could be taken apart and used again for the next page. The idea sounds simple today, but it took him many years and a lot of borrowed money to make it work.\n\nHis most famous achievement was a Bible, which was completed in about 1455. It is said that around one hundred and eighty copies were produced, and each one was a work of art, with beautiful black letters and hand-painted decorations. However, Gutenberg did not become rich. He had borrowed money from a businessman named Johann Fust, and when he could not pay it back on time, Fust took the equipment and started his own printing business. Gutenberg spent his last years in relative poverty.\n\nThe new technology spread extremely fast. By the year 1500, printing workshops had opened in more than two hundred European cities, and millions of books had been produced. Prices fell, more people learned to read, and new ideas travelled across borders in a matter of weeks instead of years. Scientists could share their discoveries, and religious reformers could reach thousands of readers. Many historians believe that without the printing press, the Renaissance and the scientific revolution would have happened much more slowly. Today, in the age of the internet, we sometimes forget that the first information revolution began with a few small pieces of metal.",
qs: [
Q("Who usually copied books before the fifteenth century?", "Monks", ["Teachers", "Monks", "Merchants"]),
Q("What was Gutenberg's job before printing?", "He was a goldsmith", ["He was a monk", "He was a goldsmith", "He was a teacher"]),
Q("What was special about his metal letters?", "They could be used again", ["They were made of gold", "They could be used again", "They were very large"]),
Q("When was Gutenberg's famous Bible finished?", "About 1455", ["About 1440", "About 1455", "About 1500"]),
Q("Why did Gutenberg lose his equipment?", "He could not repay a loan", ["It was stolen", "He could not repay a loan", "A fire destroyed it"]),
Q("What happened to book prices after 1500?", "They fell", ["They fell", "They rose", "They did not change"]),
TF("Gutenberg became very rich because of his invention.", false, "He spent his last years in relative poverty."),
TF("Printing workshops opened in more than two hundred European cities by 1500.", true),
Q("Every copy of the early books had to be written by ___.", "hand"),
Q("Gutenberg spent his last years in relative ___.", "poverty")
]
},
{
topic: "A Neighbourhood Street Festival",
passage: "Every year, on the first Saturday of June, the people of our neighbourhood close the main street to traffic and hold a festival. It began eleven years ago, when an elderly teacher named Mr Rakhimov suggested that neighbours should get to know each other better. At that time, many people in our street did not even know the names of those living next door, and he thought that a party would be a good way to change this.\n\nPreparations begin about a month before the event. A committee of volunteers meets every Wednesday evening in the yard of the local school to plan the programme. This year they decided to organise a children's painting contest, a cooking competition and a small concert on a stage built from wooden boxes. My mother, who is a nurse, offered to arrange a free health check for older residents, and my father promised to fix the sound system, which had broken the previous year.\n\nOn the day of the festival, the street was full of colour. Neighbours put up tables along the pavement and covered them with bright tablecloths. Everybody brought something to share: homemade bread, pickles, cakes and big bowls of fruit. A grandmother from number twelve won the cooking competition with a delicious pumpkin pie, although she claimed that her granddaughter had done most of the work. In the afternoon, a group of teenagers performed a dance they had been practising for weeks, and even the shyest members of the audience clapped.\n\nThe most touching moment came in the evening. Mr Rakhimov, who is now eighty-six and uses a walking stick, walked slowly onto the stage and thanked everybody for keeping his idea alive. He said that a city is not made of buildings but of people who care about each other. The crowd stood up and applauded for nearly a minute. As the lights went down, the children were still running between the tables, and the adults were already discussing next year's plans.",
qs: [
Q("When is the festival held?", "On the first Saturday of June", ["On the last Sunday of May", "On the first Saturday of June", "On New Year's Eve"]),
Q("Who had the original idea for the festival?", "Mr Rakhimov", ["The narrator's mother", "Mr Rakhimov", "A school director"]),
Q("Where does the committee meet?", "In the school yard", ["In the school yard", "In the library", "In a cafe"]),
Q("What did the narrator's father promise to do?", "Fix the sound system", ["Cook a pie", "Fix the sound system", "Paint the stage"]),
Q("Who won the cooking competition?", "A grandmother with a pumpkin pie", ["A nurse with a cake", "A grandmother with a pumpkin pie", "A teenager with bread"]),
Q("What did Mr Rakhimov say about a city?", "It is made of people who care about each other", ["It needs more roads", "It is made of people who care about each other", "It should have fewer cars"]),
TF("The festival began eleven years ago.", true),
TF("The stage was built from stone blocks.", false, "It was built from wooden boxes."),
Q("A committee of volunteers plans the ___ in the school yard.", "programme"),
Q("Neighbours covered their tables with bright ___.", "tablecloths")
]
},
{
topic: "Education Around the World",
passage: "Education systems differ enormously from one country to another, and learning about these differences can help us to understand our own schools better. In Finland, for example, children do not start formal school until the age of seven. Before that, they spend their time playing in kindergarten, and the teachers believe that play is the best way to prepare for later study. Finnish students also have less homework than students in many other countries, and there are almost no standardised tests until the end of secondary school.\n\nIn Japan, the school year begins in April, when the cherry trees are in blossom. Students are responsible for keeping their school clean: after lunch, they sweep the floors, wipe the desks and even clean the toilets. Teachers hope that this routine will teach respect for shared spaces. Many Japanese children also attend extra classes in the evening, called juku, because competition for places at good universities is very strong.\n\nIn South Korea, the pressure is even greater. Some pupils study until ten or eleven o'clock at night, and the government has tried to limit the number of hours that private academies are allowed to stay open. Critics say that the system produces excellent results but leaves young people exhausted and unhappy. As a result, several schools have introduced free afternoons for sports and hobbies.\n\nIn some rural areas of Africa and Asia, the situation is completely different. In many villages, there is only one school for several kilometres, and some children walk for two hours each way. Classes can be very large, with sometimes more than seventy pupils in one room and only a few textbooks to share. Non-governmental organisations have been building new classrooms and providing bicycles so that children, especially girls, can reach school safely.\n\nExperts agree that no single system is perfect. The best results, they say, come when students feel curious and supported, whether they study in a modern city or a small village. If young people enjoy learning, they will continue to learn throughout their lives, and that is the real purpose of education.",
qs: [
Q("At what age do Finnish children start formal school?", "Seven", ["Five", "Six", "Seven"]),
Q("What do Finnish teachers believe about play?", "It is the best preparation for later study", ["It wastes time", "It is the best preparation for later study", "It should happen only at home"]),
Q("When does the school year begin in Japan?", "In April", ["In April", "In September", "In January"]),
Q("Why do Japanese students clean their school?", "To learn respect for shared spaces", ["Because there are no cleaners", "To learn respect for shared spaces", "To save money"]),
Q("What do critics say about the South Korean system?", "It leaves young people exhausted", ["It has poor results", "It leaves young people exhausted", "It has too few exams"]),
Q("How do organisations help rural children?", "They build classrooms and provide bicycles", ["They build classrooms and provide bicycles", "They send teachers abroad", "They close small schools"]),
TF("Finnish students have lots of standardised tests in primary school.", false, "There are almost no standardised tests until the end of secondary school."),
TF("Some classes in rural areas have more than seventy pupils.", true),
Q("Extra evening classes in Japan are called ___.", "juku"),
Q("Experts agree that no single ___ is perfect.", "system")
]
}
];
