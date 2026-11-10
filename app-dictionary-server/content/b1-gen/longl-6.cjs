const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
{
topic: "A family reunion in Samarkand",
audioText: "Good morning, listeners, and welcome to the weekend family programme. Today we are talking about family reunions, and we begin with a story from a listener called Dilnoza, who lives in Samarkand. Last summer she organised a reunion for her whole family, and she has kindly sent us the details.\n\nDilnoza says the idea came from her grandfather, Rustam, who turned eighty in June. He told her that he had not seen some of his cousins for more than twenty years, because they had moved to different countries. Dilnoza decided to find everyone and invite them. It took her three months, because she had to write letters, make phone calls and even ask old neighbours for addresses. In the end she found forty relatives, and thirty-two of them said they could come.\n\nThe reunion took place on the second Saturday of August in her aunt's large garden, which has apple trees and a long wooden table. The guests began arriving at ten in the morning. Some came by train from Tashkent, and two cousins even flew from Moscow. Dilnoza says the most emotional moment was when her grandfather met his younger sister, Gulbahor, who had lived in Kazakhstan since nineteen ninety. They simply held hands and did not speak for almost a minute.\n\nFor lunch, the women of the family cooked a huge pot of plov, and the men prepared kebabs. Children played football on the grass while the older guests looked through old photo albums. Dilnoza had also asked everybody to bring one photograph from their childhood, and by the afternoon they had made a family wall with more than one hundred pictures.\n\nIn the evening, her uncle Farhod, who plays the dutar, led the singing, and everyone danced until nearly midnight. Before leaving, the relatives agreed to meet again every two years, and next time the reunion will be in Bukhara.\n\nDilnoza ends her message with some advice. She says you should start planning early, choose a place with enough shade, and never forget to take a group photograph. Thank you, Dilnoza, and now let us hear some music.",
qs: [
Q("Who gave Dilnoza the idea for the reunion?", "Her grandfather", ["Her aunt", "Her grandfather", "Her uncle Farhod"]),
Q("How long did it take Dilnoza to find the relatives?", "Three months", ["Three weeks", "Three months", "Three years"]),
Q("How many relatives said they could come?", "Thirty-two", ["Forty", "Thirty-two", "Twenty"]),
Q("Where did the reunion take place?", "In an aunt's garden", ["In a restaurant", "In an aunt's garden", "In a hotel"]),
Q("What did each guest bring?", "A childhood photograph", ["A gift", "A childhood photograph", "A dish of food"]),
Q("Where will the next reunion be?", "Bukhara", ["Tashkent", "Bukhara", "Samarkand"]),
TF("Grandfather Rustam turned eighty in June.", true),
TF("The men cooked plov while the women made kebabs.", false, "The women cooked plov and the men prepared kebabs."),
Q("Her uncle Farhod plays the ___.", "dutar"),
Q("The relatives agreed to meet every two ___.", "years")
]
},
{
topic: "Back to school announcement",
audioText: "Attention, please, all students, parents and teachers of Green Valley School. This is an important announcement from the head teacher, Mrs Karimova, about the start of the new school year.\n\nFirst, the new term will begin on the first Monday of September. Students must arrive at the main gate before eight in the morning, because the opening ceremony starts at eight fifteen. It will take place in the sports hall, and it will last about forty minutes. Parents are warmly invited to attend, but please arrive early, because there are only two hundred seats.\n\nSecond, there are several changes this year. The school has built a new science laboratory on the second floor, and it is ready for use. Students in grades eight and nine will have chemistry lessons there every Tuesday and Thursday. The library has also been repaired. It now has a quiet reading room and thirty new computers, and it will stay open until five in the afternoon, one hour later than last year.\n\nThird, the timetable. Lessons will start at eight thirty and finish at two fifteen. The lunch break lasts forty-five minutes, and the canteen will offer a new healthy menu with soup, fresh salad and fruit. Students who bring their own lunch may eat it in the garden if the weather is good.\n\nFourth, we have two new teachers joining us. Mr Alisher Tursunov will teach English and drama, and Miss Sarah Bennett, who comes from Manchester, will help older students prepare for international exams. We hope everyone will welcome them warmly.\n\nFinally, a few reminders for parents. Every student needs a uniform, a school diary and a blue folder for homework. The uniform shop near the post office is open every day from nine until six, and it will give a ten percent discount during the first week. If your child has any health problems, please speak to our nurse, Mrs Yusupova, before the end of the first week.\n\nThe whole staff wishes you a happy, healthy and successful year. We look forward to seeing you all on the first day. Thank you for listening.",
qs: [
Q("When does the opening ceremony start?", "At eight fifteen", ["At eight", "At eight fifteen", "At eight thirty"]),
Q("How many seats are in the sports hall?", "Two hundred", ["One hundred", "Two hundred", "Three hundred"]),
Q("When do grades eight and nine have chemistry?", "Tuesday and Thursday", ["Monday and Friday", "Tuesday and Thursday", "Every day"]),
Q("How long is the lunch break?", "Forty-five minutes", ["Thirty minutes", "Forty-five minutes", "One hour"]),
Q("Where does Miss Bennett come from?", "Manchester", ["London", "Manchester", "Tashkent"]),
Q("What discount does the uniform shop offer?", "Ten percent", ["Five percent", "Ten percent", "Twenty percent"]),
TF("The library will close one hour earlier than last year.", false, "It will stay open one hour later."),
TF("The new science laboratory is on the second floor.", true),
Q("Mr Tursunov will teach English and ___.", "drama"),
Q("Parents should speak to the nurse before the end of the first ___.", "week")
]
},
{
topic: "A museum guide about the Silk Road",
audioText: "Welcome to the City History Museum. My name is Madina, and I will be your guide this morning. Our tour lasts about one hour, and it will take us through the story of the Silk Road, the ancient network of trade routes that connected East and West.\n\nLet us begin in this first hall. The Silk Road was not one single road, but many paths across deserts, mountains and rivers. It got its name from silk, which merchants carried from China to Europe. However, silk was only one of many goods. Traders also moved spices, glass, paper, horses, gold and even ideas. Notice the large map on the wall. The red line shows the main route, which began in Xi'an and ended in cities on the Mediterranean Sea. Our own region was right in the middle, and that is why cities such as Samarkand and Bukhara became so rich.\n\nIn the next hall you can see a caravan. A caravan was a group of merchants travelling together with camels. A camel could carry about two hundred kilograms and walk for many days without water. Journeys were long and dangerous. A trader might spend two years travelling from one end of the route to the other. Because of this, merchants rarely travelled the whole way. Instead, they sold their goods to another trader at a market town, and the goods moved slowly from hand to hand.\n\nNow please follow me to the glass cases on your left. Here we have some of the museum's most precious objects: a blue ceramic bowl from the twelfth century, a bronze lamp and some old coins from many different countries. Archaeologists found them near the old city wall, about ten years ago.\n\nFinally, in the last room you can try writing your name on handmade paper, just as scribes did centuries ago. Paper making came from China, and it changed the way people kept knowledge.\n\nBefore we begin, a few rules. Please do not touch the objects, and photography is allowed without a flash. If you have questions, just raise your hand. Shall we start?",
qs: [
Q("How long does the tour last?", "About one hour", ["About thirty minutes", "About one hour", "About two hours"]),
Q("Why is it called the Silk Road?", "Merchants carried silk", ["It was made of silk", "Merchants carried silk", "A king named it"]),
Q("Where did the main route begin?", "Xi'an", ["Samarkand", "Xi'an", "Bukhara"]),
Q("How much could a camel carry?", "About two hundred kilograms", ["About fifty kilograms", "About two hundred kilograms", "About one ton"]),
Q("Where did archaeologists find the objects?", "Near the old city wall", ["In a river", "Near the old city wall", "Inside a mosque"]),
Q("What can visitors try in the last room?", "Writing on handmade paper", ["Riding a camel", "Writing on handmade paper", "Making a bowl"]),
TF("Merchants usually travelled the whole route themselves.", false, "They sold goods to other traders at market towns."),
TF("Photography is allowed without a flash.", true),
Q("A caravan was a group of merchants travelling with ___.", "camels"),
Q("The blue ceramic bowl is from the twelfth ___.", "century")
]
},
{
topic: "An interview with a grandmother",
audioText: "Hello, and welcome to our series called Voices of the Past. Today our reporter, Jasmine, is talking to Mrs Zulfiya Nazarova, who is eighty-one years old and lives in a small house in Namangan. Here is the interview, told in prose.\n\nJasmine begins by asking about her childhood. Mrs Nazarova answers that she was born in nineteen forty-five, in a village near the river. Her family was big, with seven children, and they all slept in one room. Life was simple, and there was no electricity in the village until she was twelve. In the evenings they used oil lamps, and her mother told stories while the children did their homework.\n\nJasmine then asks about school. Mrs Nazarova smiles and says that she walked five kilometres to school every day, even in winter. Her favourite subject was geography, because she loved learning about faraway places. Her teacher, Mr Aliev, was very strict, but he lent her books from his own shelf. She still remembers the first book she read, which was about explorers in the Arctic.\n\nNext, Jasmine asks about work. After school Mrs Nazarova trained as a nurse, and she worked in the same hospital for thirty-eight years. She says it was hard work, with long night shifts, but she felt proud to help people. She met her husband, Karim, at the hospital, when he came as a patient with a broken leg. They married two years later and had three children.\n\nJasmine asks what has changed most in her lifetime. Mrs Nazarova thinks for a moment and says that it is communication. When she was young, a letter took two weeks to arrive. Now she can see her grandchildren in Germany on a small screen every Sunday. She laughs and adds that she prefers letters, but she has to admit that video calls are wonderful.\n\nFinally, Jasmine asks for her advice to young people. Mrs Nazarova says, be kind, work hard and never stop learning. Thank you, Mrs Nazarova, for sharing your memories with us.",
qs: [
Q("Where does Mrs Nazarova live now?", "Namangan", ["Namangan", "Samarkand", "Bukhara"]),
Q("How many children were in her family?", "Seven", ["Three", "Five", "Seven"]),
Q("When did the village get electricity?", "When she was twelve", ["When she was born", "When she was twelve", "When she was twenty"]),
Q("What was her favourite school subject?", "Geography", ["Geography", "History", "Biology"]),
Q("How long did she work in the hospital?", "Thirty-eight years", ["Eighteen years", "Thirty-eight years", "Forty-eight years"]),
Q("Where do her grandchildren live?", "In Germany", ["In Germany", "In Kazakhstan", "In Turkey"]),
TF("She walked five kilometres to school every day.", true),
TF("Her husband first came to the hospital as a doctor.", false, "He came as a patient with a broken leg."),
Q("Her teacher, Mr Aliev, lent her ___ from his shelf.", "books"),
Q("She says that a letter took two ___ to arrive.", "weeks")
]
},
{
topic: "A new tram line in the city",
audioText: "Good afternoon, citizens. This is a public announcement from the City Transport Department about an exciting new project: the opening of tram line number four.\n\nAfter two years of construction, the new tram line will open on the fifteenth of October. The line is eleven kilometres long, and it connects the main railway station with the university district in the north of the city. There are fourteen stops along the route, including the central market, the national library and the large park near the river. The journey from end to end takes twenty-six minutes, which is almost half the time of the bus.\n\nThe trams themselves are modern and comfortable. Each one is thirty metres long, has air conditioning and can carry two hundred and ten passengers. There are free wireless internet connections, charging points for phones and special places for wheelchairs and baby carriages. Because the trams run on electricity, they produce no smoke, and the city hopes that the new line will reduce traffic by about fifteen percent.\n\nNow, some practical information. Trams will run every seven minutes during the day and every fifteen minutes in the evening. The first tram leaves the station at five thirty in the morning, and the last one at eleven at night. A single ticket costs two thousand five hundred som, and you can pay by card or with the city travel app. Students and pensioners get a fifty percent discount, and children under seven travel for free. During the first week, all passengers will ride for free, so that everyone can try the new service.\n\nThe department also asks passengers to follow a few simple rules. Please let people leave the tram before you enter. Keep the doors clear, and give your seat to older people, pregnant women and parents with small children. Eating and loud music are not allowed on board.\n\nIf you need more information, call our helpline, which is open every day from eight until eight, or visit our website. We wish you a pleasant journey on the new tram. Thank you for your attention.",
qs: [
Q("When will the new tram line open?", "On the fifteenth of October", ["On the first of October", "On the fifteenth of October", "On the fifth of November"]),
Q("How long is the line?", "Eleven kilometres", ["Eleven kilometres", "Fourteen kilometres", "Twenty-six kilometres"]),
Q("How many stops are there?", "Fourteen", ["Eleven", "Fourteen", "Twenty-six"]),
Q("How often do trams run during the day?", "Every seven minutes", ["Every five minutes", "Every seven minutes", "Every fifteen minutes"]),
Q("Who gets a fifty percent discount?", "Students and pensioners", ["Everyone", "Students and pensioners", "Children under seven"]),
Q("What happens during the first week?", "Rides are free", ["Rides are half price", "Rides are free", "There are no trams"]),
TF("The new trams have free wireless internet.", true),
TF("The last tram leaves at midnight.", false, "The last tram leaves at eleven at night."),
Q("Eating and loud ___ are not allowed on board.", "music"),
Q("The helpline is open every day from eight until ___.", "eight")
]
},
{
topic: "Applying to university by phone",
audioText: "This is a story about a phone call between a student called Behzod and the admissions office of a university in Tashkent. Listen carefully and think about what advice you would give him.\n\nBehzod is eighteen, and he has just finished school with very good marks. He wants to study computer science, but he is not sure how to apply, so he calls the university on a Monday morning. A friendly woman named Mrs Ismoilova answers the phone.\n\nBehzod asks when the application period starts. Mrs Ismoilova explains that students can apply from the first of June until the thirty-first of July. He asks what documents he needs. She says he must bring his school certificate, a copy of his passport, six small photographs and a medical certificate. If he has any language certificates, such as an English test result, he should bring those too, because they can give him extra points.\n\nNext Behzod asks about the entrance exam. Mrs Ismoilova tells him that it has three parts: mathematics, physics and English. The exam lasts three hours, and it takes place in the main building on the fifth of August. Applicants who score above seventy percent receive a place on the budget, which means they do not pay for their studies. The others can still study, but they must pay a yearly fee of about eight million som.\n\nBehzod is a little worried about the cost, so he asks about scholarships. Mrs Ismoilova says that there are two kinds. One is for students with the best exam results, and the other is for students from families with a low income. He can find the full details on the university website, in a section called Student Support.\n\nFinally, Behzod asks whether he can visit the campus before applying. She answers that open days take place every Saturday in May, and guides will show visitors the lecture halls, the laboratories and the dormitory. Behzod thanks her, writes down the information, and decides to come on the next Saturday.",
qs: [
Q("What does Behzod want to study?", "Computer science", ["Medicine", "Computer science", "Law"]),
Q("When does the application period end?", "On the thirty-first of July", ["On the first of June", "On the thirty-first of July", "On the fifth of August"]),
Q("How many photographs does he need?", "Six", ["Two", "Four", "Six"]),
Q("How long does the entrance exam last?", "Three hours", ["Two hours", "Three hours", "Five hours"]),
Q("What score gives a budget place?", "Above seventy percent", ["Above fifty percent", "Above seventy percent", "Above ninety percent"]),
Q("When are the open days?", "Every Saturday in May", ["Every Monday", "Every Saturday in May", "Every day in June"]),
TF("Language certificates can give extra points.", true),
TF("There is only one kind of scholarship.", false, "There are two kinds."),
Q("Students must bring a copy of their ___.", "passport"),
Q("Guides will show visitors the lecture halls, the laboratories and the ___.", "dormitory")
]
},
{
topic: "The Navruz festival",
audioText: "Hello, everyone, and welcome to our cultural talk. This week we celebrate Navruz, the spring festival, and I would like to tell you about how the holiday is celebrated in our city.\n\nNavruz means new day in Persian, and it marks the beginning of spring. It takes place on the twenty-first of March, when day and night are exactly equal in length. People have celebrated this holiday for more than three thousand years, and today it is enjoyed by millions of people in many countries across Asia.\n\nPreparations begin weeks before the holiday. Families clean their houses, repay old debts and forgive old arguments, because the new year should start with a fresh heart. Children plant wheat seeds in small dishes, and by the day of the festival the green shoots are about ten centimetres tall. This dish of green wheat is called sumalak when it is cooked, and the women prepare it together during a long night. They stir a huge pot for almost twenty-four hours, singing songs and telling stories. According to tradition, nobody sleeps during that night, and everyone makes a wish.\n\nOn the day of the festival, the main square of our city is full of life. There are concerts, folk dances and traditional sports. Horse games, such as kupkari, attract large crowds, and wrestlers compete for a prize of a sheep. Along the streets, craftsmen sell pottery, carpets and wooden toys, and food stalls offer pilaf, samsa and sweets. Last year, more than fifty thousand visitors came to the square, and the organisers expect even more this year.\n\nFamilies also visit each other. Guests bring small gifts, and the host must offer a table full of food. It is said that the more generous the table, the happier the year will be. Children receive coins and sweets, and older people give blessings.\n\nNavruz is not only a celebration of nature, but also a time of kindness, friendship and hope. I wish you all a peaceful and happy Navruz. Now, let us listen to a traditional song.",
qs: [
Q("What does Navruz mean?", "New day", ["New year", "New day", "Spring flower"]),
Q("When does Navruz take place?", "On the twenty-first of March", ["On the first of January", "On the twenty-first of March", "On the first of May"]),
Q("What do children plant before the holiday?", "Wheat seeds", ["Flowers", "Wheat seeds", "Apple trees"]),
Q("How long do women stir the sumalak?", "Almost twenty-four hours", ["About two hours", "Almost twenty-four hours", "Three days"]),
Q("What do wrestlers compete for?", "A sheep", ["Money", "A sheep", "A carpet"]),
Q("How many visitors came to the square last year?", "More than fifty thousand", ["More than five thousand", "More than fifty thousand", "More than five hundred thousand"]),
TF("Families forgive old arguments before the holiday.", true),
TF("Navruz is only celebrated in one country.", false, "It is enjoyed by millions of people in many countries."),
Q("Craftsmen sell pottery, carpets and wooden ___.", "toys"),
Q("Children receive coins and ___.", "sweets")
]
},
{
topic: "An interview with a librarian",
audioText: "Welcome back to our morning programme. Today we are visiting the Central City Library, and we are speaking with the head librarian, Mr Otabek Rahimov. Here is a summary of our conversation.\n\nOur presenter, Laura, begins by asking how long the library has existed. Mr Rahimov explains that it was founded in nineteen twenty-six, with just two thousand books in a small room above a bakery. Today the collection has almost one million books, magazines and old newspapers, and it occupies a large building with five floors.\n\nLaura asks what a typical day looks like. Mr Rahimov laughs and says that no day is typical. He arrives at seven thirty, checks the mail and meets his team of twenty-two employees. The library opens at nine, and by ten there is usually a queue of students waiting for the reading room. In the afternoon, there are workshops for children, and in the evening the library hosts book clubs and language classes.\n\nNext Laura asks about the changes brought by technology. Mr Rahimov says that many people believe libraries are disappearing, but the opposite is true. The number of visitors has grown by thirty percent in the last five years. Readers can now borrow electronic books, listen to audiobooks and use free computers. However, he adds that paper books remain very popular, especially among teenagers, who enjoy fantasy and adventure novels.\n\nLaura then asks about the most valuable item in the collection. He answers that it is a handwritten manuscript from the fourteenth century, which contains poems and medical advice. It is kept in a special room with a controlled temperature, and visitors may see it only with permission. He adds that the library is now scanning old manuscripts so that people around the world can read them online.\n\nFinally, Laura asks what advice he would give to someone who does not like reading. Mr Rahimov smiles and says that you should just find the right book. Start with a subject you love, read ten pages every evening, and soon it will become a pleasant habit.\n\nThank you, Mr Rahimov, for your time.",
qs: [
Q("When was the library founded?", "In nineteen twenty-six", ["In nineteen sixteen", "In nineteen twenty-six", "In nineteen sixty-two"]),
Q("Where was the first library room?", "Above a bakery", ["Above a bakery", "In a school", "In a mosque"]),
Q("How many employees does the library have?", "Twenty-two", ["Twelve", "Twenty-two", "Thirty-two"]),
Q("How much has the number of visitors grown in five years?", "Thirty percent", ["Ten percent", "Thirty percent", "Fifty percent"]),
Q("What is the most valuable item in the collection?", "A fourteenth century manuscript", ["A fourteenth century manuscript", "A rare map", "A gold coin"]),
Q("What does Mr Rahimov advise non-readers to do?", "Read ten pages every evening", ["Buy many books", "Read ten pages every evening", "Join a book club"]),
TF("Paper books are still popular among teenagers.", true),
TF("The library opens at seven thirty.", false, "The library opens at nine."),
Q("In the afternoon there are workshops for ___.", "children"),
Q("The library is scanning old manuscripts so people can read them ___.", "online")
]
},
{
topic: "The history of the Registan",
audioText: "Good morning, everyone, and thank you for joining this lecture about one of the most famous squares in Central Asia, the Registan in Samarkand. My name is Professor Aziza Mirzaeva, and for the next forty minutes I will take you on a journey through its history.\n\nThe word Registan means sandy place in Persian. In the Middle Ages, it was an open area covered with sand, where people gathered to hear royal announcements, watch public events and trade goods. At that time there were no grand buildings, only simple shops and a small market.\n\nThe story of the great buildings began in the fifteenth century, during the rule of Ulugh Beg, the grandson of Timur. Ulugh Beg was not only a ruler but also a famous astronomer and mathematician. In fourteen twenty, he built a madrasa on the western side of the square, and it became one of the best schools in the Muslim world. Students came from many countries to study mathematics, astronomy, and philosophy. The building has a beautiful blue tiled entrance and two tall minarets.\n\nTwo centuries later, a governor named Yalangtush Bahodur decided to add two more buildings. The first, the Sher-Dor madrasa, was completed in sixteen thirty-six. It is famous for the pictures of tigers, or more exactly lions, chasing deer on its main arch, which is unusual because Islamic art rarely shows animals. The second building, the Tilya-Kori madrasa, was finished in sixteen sixty. Its name means covered with gold, and the inside of its mosque is decorated with thousands of gold leaves.\n\nOver the centuries the buildings suffered from earthquakes and neglect. By the nineteenth century, some walls were close to collapse. Restoration began in the twentieth century and continues to this day. In two thousand one, the Registan became part of the UNESCO World Heritage list.\n\nToday the square welcomes about two million visitors a year. In the evenings, lights and music transform the buildings into a magical show. When you visit, I advise you to arrive at sunset, when the tiles shine most brightly. Now, are there any questions?",
qs: [
Q("What does the word Registan mean?", "Sandy place", ["Sandy place", "Golden square", "Royal market"]),
Q("Who built the first madrasa on the square?", "Ulugh Beg", ["Timur", "Ulugh Beg", "Yalangtush Bahodur"]),
Q("Which subjects did students study there?", "Mathematics, astronomy and philosophy", ["Law and trade", "Mathematics, astronomy and philosophy", "Art and music"]),
Q("What is unusual about the Sher-Dor madrasa?", "It shows animals", ["It has no minarets", "It shows animals", "It is made of wood"]),
Q("What does Tilya-Kori mean?", "Covered with gold", ["Covered with gold", "House of lions", "School of stars"]),
Q("When did the Registan join the UNESCO list?", "In two thousand one", ["In nineteen ninety", "In two thousand one", "In two thousand ten"]),
TF("In the Middle Ages the Registan was full of grand buildings.", false, "There were only simple shops and a small market."),
TF("About two million visitors come to the square every year.", true),
Q("The first madrasa has a beautiful blue tiled ___.", "entrance"),
Q("The professor advises visitors to arrive at ___.", "sunset")
]
},
{
topic: "Cooking day with grandmother",
audioText: "This is a story about a phone call between two sisters, Nilufar and Malika. Nilufar lives in Tashkent, and Malika studies in London. They talk every Sunday evening, and this week the conversation was about food.\n\nNilufar starts by saying that she has had a wonderful weekend. On Saturday she went to visit their grandmother, Oyi, in her old house, and they spent the whole day cooking together. Oyi wanted to teach her the recipe for manti, the steamed dumplings that Malika loves so much.\n\nMalika asks how it went. Nilufar laughs and says that it was harder than she expected. First, they made the dough with flour, water, salt and a little oil. Oyi told her that the dough must rest for thirty minutes, and she should never hurry. Then they prepared the filling with lamb, onions and pumpkin. Nilufar had to cut the onions, and she cried like a child, which made her grandmother laugh.\n\nThe most difficult part was shaping the dumplings. Oyi can make a perfect manti in just a few seconds, but Nilufar needed almost five minutes for the first one. By the end of the afternoon they had made sixty, and Nilufar says that her last ones looked quite good. They steamed them for forty minutes and ate them with yoghurt and fresh dill.\n\nMalika says that she is a little jealous, because in London she cannot find a good restaurant for Uzbek food. Nilufar promises to write down the recipe and send it by email. She adds that Oyi also told her stories about her own childhood, when she cooked on an open fire for ten brothers and sisters. Nilufar felt that these stories were as important as the recipe.\n\nThey decide that when Malika comes home in July, the three of them will cook together again. This time Malika will make the dough, Nilufar will prepare the filling, and Oyi will show them how to be patient. Malika says that she cannot wait, and they say goodnight.",
qs: [
Q("Where does Malika study?", "In London", ["In Tashkent", "In London", "In Moscow"]),
Q("Which dish did they cook?", "Manti", ["Plov", "Samsa", "Manti"]),
Q("How long must the dough rest?", "Thirty minutes", ["Ten minutes", "Thirty minutes", "One hour"]),
Q("Which vegetable was in the filling with onions?", "Pumpkin", ["Potato", "Pumpkin", "Carrot"]),
Q("How many dumplings did they make?", "Sixty", ["Forty", "Sixty", "One hundred"]),
Q("What will Malika do when she comes home?", "Make the dough", ["Make the dough", "Prepare the filling", "Steam the manti"]),
TF("Nilufar made her first dumpling in a few seconds.", false, "It took her almost five minutes."),
TF("Their grandmother cooked for ten brothers and sisters as a child.", true),
Q("They ate the manti with yoghurt and fresh ___.", "dill"),
Q("Nilufar promises to send the recipe by ___.", "email")
]
},
{
topic: "A park clean-up announcement",
audioText: "Hello, neighbours, and welcome to this week's community radio news. We begin with an announcement about a big event for the whole city: the annual Clean Park Day.\n\nThis year the event will take place on the last Saturday of April at the Youth Park, which is the largest green area in our district. The organisers, a local group called Green Hands, are looking for at least five hundred volunteers. Last year only three hundred people came, but they collected an incredible two tonnes of rubbish in just four hours.\n\nThe programme is as follows. Volunteers should meet at the main entrance at nine in the morning, where they will get gloves, bags and a bright yellow vest. The organisers will divide everyone into groups of ten, and each group will clean a different part of the park. There are five zones: the lake, the playground, the forest path, the football field and the picnic area. At twelve there will be a short break, with free tea, bread and fruit for everyone. The work will end at one in the afternoon.\n\nAfter the clean-up, there will be some fun activities. Children can paint pictures on stones, which will be placed along the paths, and a local band will play music near the lake. At two o'clock, the mayor, Mr Sardor Aminov, will plant a young oak tree to mark the day. In addition, the city has promised to plant fifty new trees this spring and install twenty new benches and ten bins.\n\nThe leader of Green Hands, a young woman named Kamola, says that the aim is not only to clean but also to change people's habits. She asks everyone to take their rubbish home after a picnic and to use fewer plastic bags. She also reminds parents that children under twelve must come with an adult.\n\nTo register, send a message through the group's page or simply come on the day. Wear comfortable shoes and old clothes, and bring a bottle of water. Let us make our city cleaner together. Now, the weather report.",
qs: [
Q("When will Clean Park Day take place?", "On the last Saturday of April", ["On the first Saturday of April", "On the last Saturday of April", "On a Sunday in May"]),
Q("How many volunteers do the organisers want?", "At least five hundred", ["At least three hundred", "At least five hundred", "At least one thousand"]),
Q("How much rubbish did volunteers collect last year?", "Two tonnes", ["Two tonnes", "Five tonnes", "Ten tonnes"]),
Q("How big will each volunteer group be?", "Ten people", ["Five people", "Ten people", "Twenty people"]),
Q("What will the mayor do at two o'clock?", "Plant an oak tree", ["Give a speech", "Plant an oak tree", "Open a playground"]),
Q("Who must come with an adult?", "Children under twelve", ["Children under twelve", "Students", "Teenagers"]),
TF("Volunteers will receive gloves, bags and a yellow vest.", true),
TF("The work will finish at twelve.", false, "The work will end at one in the afternoon."),
Q("Children can paint pictures on ___.", "stones"),
Q("The leader of Green Hands is a young woman named ___.", "Kamola".toLowerCase())
]
},
{
topic: "A teacher's long career",
audioText: "Good evening, and welcome to our programme about people who make a difference. Tonight we tell the story of Mr Anvar Qodirov, a teacher who retired last month after forty-two years in the same school in Fergana.\n\nMr Qodirov was born in nineteen sixty-one in a family of farmers. As a boy, he did not plan to become a teacher. He wanted to be an engineer and build bridges. But in his last year at school, a history teacher called Mrs Saidova noticed his talent for explaining things to other students, and she suggested that he should think about teaching. He followed her advice, studied at the pedagogical institute in Tashkent, and in nineteen eighty-four he started work in a small school near his home town.\n\nOver the years he taught history, geography and, for a short time, even physical education. He says his first class was terrifying. There were thirty-five students, and some of them were only three years younger than he was. However, he soon discovered that the secret of good teaching was to listen. He asked students questions, let them argue, and used stories instead of dates to make history alive.\n\nHis students describe him as patient and funny. One former student, now a doctor, says that Mr Qodirov once took the whole class to a village to meet an old man who remembered the war. That meeting, she says, taught her more than any textbook. Another student, now an engineer, laughs and says that his teacher was proud of him even though he never became a historian.\n\nDuring his career, Mr Qodirov received three national awards, but he says that his greatest reward is meeting former students in the street. He estimates that he has taught more than two thousand people.\n\nNow that he is retired, he plans to write a book about local history and to spend more time with his five grandchildren. He also wants to learn to play the piano. His advice for young teachers is simple: love your subject, respect your students, and never stop being curious. Thank you for listening.",
qs: [
Q("How long did Mr Qodirov teach?", "Forty-two years", ["Thirty years", "Forty-two years", "Fifty years"]),
Q("What did he want to be as a boy?", "An engineer", ["A doctor", "An engineer", "A farmer"]),
Q("Who suggested that he should teach?", "Mrs Saidova", ["His father", "Mrs Saidova", "A student"]),
Q("What was the secret of good teaching, he says?", "Listening", ["Strict rules", "Listening", "Long homework"]),
Q("How many national awards did he receive?", "Three", ["Two", "Three", "Five"]),
Q("What will he do now that he is retired?", "Write a book", ["Move abroad", "Write a book", "Start a business"]),
TF("His first class had thirty-five students.", true),
TF("He became a teacher in a big school in Tashkent.", false, "He started work in a small school near his home town."),
Q("He has taught more than two ___ people.", "thousand"),
Q("He also wants to learn to play the ___.", "piano")
]
},
{
topic: "A night market tour",
audioText: "Hello, and welcome to our weekend guide to city life. Today we are visiting a place that comes alive after dark: the Night Market of Chilanzar. I walked there last Friday with my friend Sevara, and I would like to tell you about our evening.\n\nThe market opens at six in the evening and closes at one in the morning. It is held on the long street behind the old cinema, and it has more than two hundred stalls. When we arrived, the air was already full of delicious smells, and thousands of small lights hung above the street. Music came from every corner, and street performers juggled and played guitars.\n\nFirst, we looked at the clothes and accessories. Sevara bought a handmade leather bag for about one hundred and twenty thousand som, after a friendly discussion about the price. The seller, an old man called Mr Hakim, told us that he had made bags for thirty years and that his father had taught him the craft. I bought a pair of silver earrings for my mother, whose birthday is next week.\n\nThen we went to the food section, which is the heart of the market. There were dozens of choices. We tried grilled fish, fried dumplings and a sweet dish made of pumpkin and nuts. Sevara said that the best thing was a hot corn drink, which cost only five thousand som. We sat at a small plastic table, watched the crowd and talked for almost an hour.\n\nAfter dinner, we visited the book corner, where students sell second-hand books at very low prices. I found an old atlas for ten thousand som. Near the exit there was a small stage, where a group of young people performed a comedy show. The audience laughed so loudly that we could hear them from the other end of the street.\n\nWe left at about eleven and took a taxi home. My advice is to go early, because it becomes crowded after eight, and to bring cash, since not all stalls accept cards. Next week, we will visit the old town. Until then, enjoy your weekend.",
qs: [
Q("When does the market close?", "At one in the morning", ["At midnight", "At one in the morning", "At six in the evening"]),
Q("How many stalls are there?", "More than two hundred", ["More than fifty", "More than two hundred", "More than a thousand"]),
Q("What did Sevara buy?", "A leather bag", ["Silver earrings", "A leather bag", "An atlas"]),
Q("How long has Mr Hakim made bags?", "Thirty years", ["Ten years", "Thirty years", "Fifty years"]),
Q("What did the speaker buy for her mother?", "Silver earrings", ["A scarf", "Silver earrings", "A book"]),
Q("What did the speaker find in the book corner?", "An old atlas", ["A dictionary", "An old atlas", "A novel"]),
TF("The hot corn drink cost five thousand som.", true),
TF("All the stalls accept cards.", false, "Not all stalls accept cards, so you should bring cash."),
Q("A group of young people performed a ___ show on the small stage.", "comedy"),
Q("Next week they will visit the old ___.", "town")
]
},
{
topic: "Language school open day",
audioText: "Welcome, everyone, and thank you for coming to the open day of the Bright Future Language Centre. My name is Sherzod, and I am the director of studies. In the next few minutes I would like to tell you about our school, our courses and our teachers.\n\nOur centre opened eight years ago with only twelve students and two classrooms. Today we have more than nine hundred students, aged from six to sixty, and four branches in different parts of the city. We teach English, German, Korean and Turkish, but English is still our most popular language, with about sixty percent of all students.\n\nLet me explain how our courses work. Every new student takes a short test and a speaking interview, so that we can find the right level. There are six levels, from beginner to advanced. Each course lasts three months, and classes meet three times a week for ninety minutes. We keep our groups small, with a maximum of twelve students, so that everyone has a chance to speak. Beginners often tell us that they are afraid to make mistakes, but our teachers create a friendly atmosphere where mistakes are a natural part of learning.\n\nWe also offer special courses. For example, there is an exam preparation course for students who want to take international tests, and a business English course for people who work in offices. This summer we are starting a new programme for teenagers, which combines language lessons with sport and drama. It will run for six weeks in July and August.\n\nAbout our teachers: sixteen of them are local specialists with university degrees, and six are native speakers from Britain, America and Australia. All of them take part in training every month.\n\nFinally, the prices. A three-month course costs one million two hundred thousand som, but today only, anyone who registers will receive a twenty percent discount and a free notebook. You can also try a free trial lesson next Wednesday at five. Please take a leaflet at the door, and do not hesitate to ask me any questions. Thank you.",
qs: [
Q("How many years ago did the centre open?", "Eight", ["Five", "Eight", "Twelve"]),
Q("How many students does the centre have now?", "More than nine hundred", ["More than two hundred", "More than nine hundred", "More than two thousand"]),
Q("Which language is the most popular?", "English", ["German", "English", "Korean"]),
Q("How often do classes meet?", "Three times a week", ["Once a week", "Three times a week", "Every day"]),
Q("What is the maximum group size?", "Twelve students", ["Six students", "Twelve students", "Twenty students"]),
Q("What does the new teenage programme combine?", "Language, sport and drama", ["Language, sport and drama", "Language and music", "Language and travel"]),
TF("There are six levels from beginner to advanced.", true),
TF("All the teachers are native speakers.", false, "Sixteen are local specialists and six are native speakers."),
Q("Anyone who registers today receives a free ___.", "notebook"),
Q("The free trial lesson is next ___.", "wednesday")
]
},
{
topic: "A review of a city theatre",
audioText: "Hello, culture lovers, and welcome to our weekly arts review. This week I went to see a new play at the Navoi Theatre, and I would like to share my impressions with you.\n\nThe play is called The Last Train, and it was written by a young playwright from Tashkent named Ozoda Hamidova. It tells the story of a family in a small town in nineteen sixty, whose lives change when a new railway station opens. The main character is a grandmother called Hanifa, played by the experienced actress Mukhayyo Tursunova, and I must say that her performance was outstanding. She made the audience laugh in the first act and cry in the second.\n\nThe play lasts two hours and forty minutes, with one interval of twenty minutes. The set is simple but clever. A single wooden platform becomes a kitchen, a street and a train station, and the changes happen so quickly that you hardly notice them. The costumes are colourful and look authentic, and the music, performed live by a small group of three musicians, creates a warm atmosphere.\n\nI have only two small complaints. First, the beginning is a little slow, and it takes almost twenty minutes for the real action to start. Second, some of the younger actors speak too quietly, and sitting at the back, I could not hear every word. But these are minor problems.\n\nWhat I loved most was the message. The play shows how people can be afraid of change, but also how progress can bring families together. I left the theatre thinking about my own grandparents and the stories they told me. The audience, which was mostly families and students, stood and applauded for nearly five minutes.\n\nIf you would like to see it, there are performances every Friday and Saturday at seven in the evening until the end of next month. Tickets cost between forty and one hundred thousand som, and students pay half price. Book early, because the theatre has only four hundred seats, and the shows are almost sold out.\n\nMy rating is four and a half stars out of five. Join us next week, when we will talk about a new exhibition of modern art.",
qs: [
Q("What is the name of the play?", "The Last Train", ["The Last Train", "The New Station", "My Grandmother"]),
Q("Who plays the grandmother?", "Mukhayyo Tursunova", ["Ozoda Hamidova", "Mukhayyo Tursunova", "Hanifa Karimova"]),
Q("How long is the interval?", "Twenty minutes", ["Ten minutes", "Twenty minutes", "Forty minutes"]),
Q("How many musicians perform live?", "Three", ["Two", "Three", "Five"]),
Q("What is the reviewer's first complaint?", "The beginning is slow", ["The tickets are expensive", "The beginning is slow", "The music is too loud"]),
Q("How long did the audience applaud?", "Nearly five minutes", ["Nearly one minute", "Nearly five minutes", "Nearly ten minutes"]),
TF("The set uses a single wooden platform.", true),
TF("The theatre has four thousand seats.", false, "It has only four hundred seats."),
Q("Students pay ___ price.", "half"),
Q("Next week the programme will talk about an exhibition of modern ___.", "art")
]
}
];
