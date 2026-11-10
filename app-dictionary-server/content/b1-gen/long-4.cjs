const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
{
topic: "Smartphone addiction",
passage: "When Dilnoza Karimova, a nineteen-year-old student from Samarkand, counted how often she touched her phone, she could not believe the result. An app on her screen showed that she had unlocked it one hundred and eighty times in a single day. She had never thought of herself as an addict, but the numbers made her feel uncomfortable, and she decided to find out what was happening.\n\nResearchers say that Dilnoza is not unusual. A study carried out at a university in Tashkent last year followed four hundred young people for three months. The scientists discovered that the average student spent five and a half hours a day on a phone. Many of them said that they checked their messages even when nothing had rung or buzzed. If the phone was out of sight, they felt nervous, and some had trouble concentrating on lessons.\n\nDilnoza decided to experiment. First, she turned off all notifications except calls from her family. Then she bought an old alarm clock, so that her phone no longer had to sleep next to her bed. She had often looked at videos until two in the morning, and she had always woken up tired. After a week of the new routine, she was going to bed at eleven and feeling much more awake in the morning.\n\nThe hardest part was lunchtime. Her friends were used to taking photos of their food and sharing them immediately, and at first they laughed at her. However, after two weeks, her friend Aziz admitted that he had started to feel the same way. Together they made a rule: the first person to touch a phone during a meal would pay for everyone's tea. Aziz lost the game three times in the first week.\n\nDoctors do not tell people to throw their phones away. Dr. Malika Rustamova, who led the Tashkent study, explains that phones are useful tools, and that the problem is only the habit of checking them without thinking. She suggests keeping the phone in another room while studying and setting a daily limit of three hours. Dilnoza now spends about two hours a day on her phone, and she says she has finished more books this year than in the previous five years.",
qs: [
Q("How many times a day had Dilnoza unlocked her phone?", "One hundred and eighty", ["One hundred and eighty", "Four hundred", "Eighty"]),
Q("How many young people took part in the Tashkent study?", "Four hundred", ["Two hundred", "Four hundred", "Five hundred"]),
Q("On average, how long did the students use their phones each day?", "Five and a half hours", ["Three hours", "Five and a half hours", "Eight hours"]),
Q("Which notifications did Dilnoza keep?", "Calls from her family", ["Calls from her family", "Messages from friends", "Alarm sounds from apps"]),
Q("Why did Dilnoza buy an old alarm clock?", "So her phone did not sleep next to her bed", ["It was cheaper than a phone", "So her phone did not sleep next to her bed", "Her phone had broken"]),
Q("Who lost the tea game three times in the first week?", "Aziz", ["Dilnoza", "Aziz", "Dr. Rustamova"]),
TF("The researchers told people to throw their phones away.", false, "Doctors do not tell people to throw phones away."),
TF("Dilnoza now goes to bed at eleven.", true),
Q("Dr. Rustamova suggests keeping the phone in another room while ___", "studying"),
Q("Dilnoza now spends about two hours a day on her ___", "phone")
]
},
{
topic: "A robot in a hospital",
passage: "At the City Children's Hospital in Bukhara, a new member of staff started work in March. It is a white robot called Nuri, about the height of a ten-year-old child, and it has two large blue eyes on a round screen. Nuri does not give medicine and it does not perform operations. Its job is to carry food, bring blankets and, most importantly, keep young patients company.\n\nThe idea came from a nurse named Gulnora Saidova. She had noticed that many children were frightened when they arrived at the hospital. They missed their parents, they disliked the smell of the corridors, and they refused to eat. Gulnora read about a similar robot in a hospital in Japan, and she wrote a long letter to the hospital director. After six months of discussion, the hospital agreed to buy one machine as a test.\n\nNuri can speak three languages: Uzbek, Russian and English. It tells jokes, sings short songs and plays simple games, such as guessing which hand hides a small coin. When a child is crying, it uses its sensors to notice the sad face and says quietly, \"Would you like to hear a story?\" Nurses say that the effect is almost magical. A seven-year-old boy named Timur, who had not spoken for two days after his operation, started laughing at the robot's dancing.\n\nOf course, some doctors were worried at first. They feared that the robot might replace nurses, or that it would make mistakes with the equipment. Dr. Farhod Aliyev explained that these fears were not realistic. Nuri is controlled by a program that only allows it to move on a fixed route, and it is never left alone with a child for more than fifteen minutes. A nurse always watches the screen in the main office.\n\nAfter eight months, the hospital measured the results. The number of children who finished their meals had risen by almost thirty percent, and parents reported that their sons and daughters were calmer before treatment. The director has now asked for two more robots, which are expected to arrive next spring. Gulnora says that the best part of her job is hearing children say goodbye to Nuri at the door.",
qs: [
Q("In which city is the hospital?", "Bukhara", ["Samarkand", "Bukhara", "Tashkent"]),
Q("What is the robot's main job?", "Keeping young patients company", ["Performing operations", "Giving medicine", "Keeping young patients company"]),
Q("Who suggested buying a robot?", "A nurse named Gulnora", ["The director", "A nurse named Gulnora", "Dr. Aliyev"]),
Q("Where did Gulnora read about a similar robot?", "In Japan", ["In Japan", "In Russia", "In England"]),
Q("What did Timur do when he watched the robot?", "He started laughing", ["He started laughing", "He started crying", "He fell asleep"]),
Q("How long can Nuri stay alone with a child?", "No more than fifteen minutes", ["No more than five minutes", "No more than fifteen minutes", "As long as needed"]),
TF("Nuri is able to perform small operations.", false, "It does not perform operations."),
TF("The hospital wants to get more robots.", true),
Q("The number of children who finished their meals rose by almost thirty ___", "percent"),
Q("The new robots are expected to arrive next ___", "spring")
]
},
{
topic: "Shopping online",
passage: "Last November, Sevara Yusupova decided to buy a winter coat for her mother's birthday. She was living in Namangan then, and the nearest big shopping centre was a two-hour bus ride away. Her friend suggested that she try an online store, and Sevara, who had never ordered anything over the internet before, felt a little nervous. She opened the website of a well-known company and began to browse.\n\nThere were more than four hundred coats in the women's section. Sevara used the filters to look only at warm coats in dark green, because her mother loved that colour. She read the descriptions carefully and spent almost an hour studying customers' reviews. One reviewer wrote that the sleeves were too short, so Sevara chose a larger size. In the end, she paid ninety-five thousand som, which included a discount of twenty percent.\n\nThe delivery was supposed to take three days, but the parcel did not arrive until the sixth day. Sevara was worried, and she wrote to the customer service team. A young man called Bobur answered within ten minutes. He told her that a snowstorm had closed the main road and that her parcel was now only fifty kilometres away. He also promised to refund the delivery fee, and he kept his promise the next morning.\n\nWhen the coat finally came, Sevara opened the box with excitement, but her smile quickly disappeared. The colour was not dark green but light grey. She had been warned by her friend that this could happen, so she did not panic. She photographed the coat, filled in a return form and left the box at the post office. A week later, the correct coat arrived, and this time it fitted perfectly.\n\nSevara now says that online shopping is a good idea if people are careful. She advises beginners to read the return policy before paying, to check the reviews and never to use public wifi when entering bank details. Her mother wore the coat to the party on Saturday and received many compliments. Sevara has already ordered a pair of boots for herself, and she hopes they will come in the right colour.",
qs: [
Q("Why did Sevara shop online?", "The nearest big shopping centre was far away", ["She wanted a cheaper price", "The nearest big shopping centre was far away", "Her mother asked her to"]),
Q("How many coats were in the women's section?", "More than four hundred", ["More than two hundred", "More than four hundred", "About fifty"]),
Q("Why did Sevara choose a larger size?", "A reviewer said the sleeves were too short", ["A reviewer said the sleeves were too short", "Her mother is tall", "The smaller size was sold out"]),
Q("How much discount did she get?", "Twenty percent", ["Ten percent", "Twenty percent", "Thirty percent"]),
Q("Why was the delivery late?", "A snowstorm closed the main road", ["A snowstorm closed the main road", "The shop forgot the order", "The bus broke down"]),
Q("What was wrong with the first coat?", "It was the wrong colour", ["It was too small", "It was the wrong colour", "It had a hole"]),
TF("Bobur refunded the delivery fee.", true),
TF("Sevara got the correct coat in two days.", false, "It arrived a week later."),
Q("Sevara advises people never to use public ___ when entering bank details.", "wifi"),
Q("Her mother wore the coat to a party on ___", "saturday")
]
},
{
topic: "A space mission",
passage: "In the early hours of a cold morning in September, a rocket rose slowly from a launch site in Kazakhstan. On board were three astronauts, one from Russia, one from Italy and one from Canada, who were beginning a six-month mission to the International Space Station. Millions of people around the world watched the launch on their screens, and many schools in Uzbekistan arranged special lessons so that children could follow it live.\n\nThe journey to the station took only six hours, which was much shorter than the old two-day flights. When the spacecraft finally connected with the station, the crew had to wait for two hours while engineers checked that the doors were safe. Italian astronaut Chiara Ferrari later said that those two hours had felt like a whole day, because she had been dreaming about this moment since she was a little girl.\n\nLife in space is very different from life on Earth. Because there is almost no gravity, the astronauts float rather than walk, and they sleep in bags fixed to the wall. They exercise for two hours every day to protect their muscles and bones, which become weaker in space. Food is also unusual. Water is recycled, even the water from the astronauts' sweat, and fresh fruit is a rare treat that arrives only with new supply ships.\n\nThe main purpose of the mission was science. The crew carried out forty-two experiments, including a study of how plants grow without soil. One experiment tested a new kind of glass that might be used in future telescopes. Another examined whether certain medicines work in the same way in space. The scientists on Earth hope that the results will help doctors treat patients and will also help farmers grow food in difficult places.\n\nThe astronauts returned to Earth in March, landing in a flat field near the city of Dzhezkazgan. After such a long time without gravity, they could not stand up on their own and had to be carried to a medical tent. Within a week, however, they were walking normally. Chiara said that the first thing she did at home was to drink a glass of cold water and listen to the rain.",
qs: [
Q("Where did the rocket take off?", "Kazakhstan", ["Russia", "Kazakhstan", "Canada"]),
Q("How many astronauts were on board?", "Three", ["Two", "Three", "Six"]),
Q("How long did the journey to the station take?", "Six hours", ["Six hours", "Two days", "Two hours"]),
Q("Why did the crew wait two hours after connecting?", "Engineers checked the doors", ["Engineers checked the doors", "They were sleeping", "The weather was bad"]),
Q("What do astronauts do for two hours every day?", "Exercise", ["Study", "Exercise", "Cook"]),
Q("How many experiments did the crew carry out?", "Forty-two", ["Twelve", "Twenty-four", "Forty-two"]),
TF("Fresh fruit is common on the space station.", false, "It is a rare treat."),
TF("The astronauts could walk normally within a week of returning.", true),
Q("The astronauts sleep in bags fixed to the ___", "wall"),
Q("The crew landed in a flat field near the city of ___", "dzhezkazgan")
]
},
{
topic: "A young video blogger",
passage: "Sixteen-year-old Jasur Normatov never expected that a short video about his grandmother's cooking would change his life. He had filmed it with an old phone in the kitchen of their house in Khiva, intending to show it only to his cousins. His grandmother was making traditional bread, and she talked to the camera as though she were telling a story to a child. Within a week, more than two hundred thousand people had watched the video.\n\nSuddenly, Jasur had hundreds of messages every day. Some people asked for recipes, others wanted to visit Khiva, and a few offered him money to advertise their products. His parents were surprised, and a little worried. His father, who works as a teacher, told him that popularity could disappear as quickly as it arrived. They agreed on a rule: Jasur could continue making videos, but only after finishing his homework.\n\nJasur learned that making a good video was much harder than it looked. He spent four hours filming and about eight hours editing a single ten-minute episode. He taught himself to use free editing software and bought a cheap microphone after reading that bad sound was the main reason viewers stopped watching. He also learned to be careful. When a company offered him a large sum to say that a medicine was perfect, he refused, because he had not tried it himself.\n\nBy the end of the year, his channel had almost a million followers. Jasur used the money he earned to buy a better camera, but he also donated a part of it to the village school near Khiva, which needed new computers. He says that the best feeling in the world is receiving a letter from a stranger who cooked his grandmother's bread and enjoyed it.\n\nNot everyone is positive, of course. Some people write unkind comments, and Jasur admits that they used to ruin his day. His grandmother gave him some useful advice: \"If a person does not like the bread, you do not stop baking.\" Now he reads the comments only once a week. He plans to study film at university, but he says that he will never stop visiting his grandmother's kitchen.",
qs: [
Q("What was Jasur's first popular video about?", "His grandmother's cooking", ["His grandmother's cooking", "A school trip", "A football match"]),
Q("Where does Jasur live?", "Khiva", ["Bukhara", "Khiva", "Namangan"]),
Q("How many people watched the video in a week?", "More than two hundred thousand", ["More than two thousand", "More than two hundred thousand", "About one million"]),
Q("What was the family rule?", "Homework must be finished before making videos", ["No videos at weekends", "Homework must be finished before making videos", "No advertising at all"]),
Q("Why did Jasur refuse the company's offer?", "He had not tried the medicine himself", ["The money was too small", "He had not tried the medicine himself", "His father said no"]),
Q("What did he give to the village school?", "Part of his money", ["A camera", "Part of his money", "Some old phones"]),
TF("Jasur's father is a doctor.", false, "He works as a teacher."),
TF("Jasur now reads the comments only once a week.", true),
Q("Jasur bought a cheap ___ because bad sound makes viewers stop watching.", "microphone"),
Q("He plans to study ___ at university.", "film")
]
},
{
topic: "A hacked account",
passage: "On a Tuesday evening in October, Rustam Ergashev, a bank clerk from Andijan, received an email that seemed to come from his favourite online music service. The message said that his account would be closed in twenty-four hours unless he confirmed his password. Rustam was tired after a long day, and he clicked on the link without thinking. The page looked exactly like the real website, so he typed in his details.\n\nThe next morning, he discovered that he could not enter his account. His password had been changed, and someone had bought three expensive gift cards using his bank card. Rustam felt sick. He called the bank at once, and an employee named Zarina helped him to block the card. Fortunately, the bank returned most of the money, because Rustam had reported the problem so quickly.\n\nLater, a computer expert explained what had happened. The email was an example of phishing, a trick in which criminals pretend to be a trusted company in order to steal information. The expert, Anvar, pointed out that Rustam could have noticed several warning signs. The sender's address contained a spelling mistake, the message used strange language, and the link led to a web address that was slightly different from the original.\n\nAnvar gave Rustam a list of simple rules. First, never click on links in emails that ask for personal information. Instead, open the website yourself and log in. Second, use a different password for every important account, and make each one at least twelve characters long. Third, turn on two-step verification, which sends a code to your phone every time someone tries to enter your account. If Rustam had used this system, the criminals would not have succeeded.\n\nRustam followed all of the advice, and he now uses a program that stores his passwords safely. He has also talked to his colleagues and to his elderly parents about the danger. His mother, who had once received a similar message, admitted that she had almost answered it. Rustam says that the experience was unpleasant, but it taught him that a few minutes of caution can save weeks of trouble.",
qs: [
Q("What did the email say?", "His account would be closed in twenty-four hours", ["He had won a prize", "His account would be closed in twenty-four hours", "His bank card had expired"]),
Q("What is Rustam's job?", "Bank clerk", ["Teacher", "Bank clerk", "Computer expert"]),
Q("What did the criminals buy with his card?", "Three gift cards", ["Three gift cards", "A phone", "Some music"]),
Q("Who helped Rustam to block his card?", "Zarina", ["Anvar", "Zarina", "His mother"]),
Q("What was one warning sign in the email?", "A spelling mistake in the sender's address", ["A spelling mistake in the sender's address", "A photograph", "A phone number"]),
Q("How long should each password be, according to Anvar?", "At least twelve characters", ["At least six characters", "At least twelve characters", "Exactly twenty characters"]),
TF("The bank returned all of the money for free after a month.", false, "It returned most of the money, and quickly."),
TF("Rustam's mother had once received a similar message.", true),
Q("A trick in which criminals pretend to be a trusted company is called ___", "phishing"),
Q("Two-step verification sends a code to your ___", "phone")
]
},
{
topic: "Electric cars",
passage: "Ten years ago, an electric car was a rare sight on the streets of Tashkent. Today, the city has more than twelve thousand of them, and the number is growing every month. The government has reduced taxes on electric vehicles, and new charging stations have appeared near shopping centres, hotels and petrol stations. Many drivers say that they will never return to a petrol engine.\n\nOne of them is Otabek Rahimov, a taxi driver who bought his first electric car two years ago. He had been spending about forty percent of his income on fuel, and he was tired of the noise and smell of the old engine. After the change, he found that his monthly costs dropped by almost half. Electricity is cheaper than petrol, and the car needs fewer repairs, because it has fewer moving parts.\n\nOf course, electric cars have problems too. The biggest worry is distance. Otabek's car can travel about three hundred kilometres on a full battery, but in cold winter weather the figure falls to about two hundred and twenty. He has learned to plan his day carefully and to charge the car during his lunch break. A fast charger can fill eighty percent of the battery in thirty minutes, but a slow charger at home needs the whole night.\n\nEngineers are working on new batteries that would solve these difficulties. A factory near Jizzakh will begin producing batteries next year, and its managers claim that they will last for ten years. Scientists are also testing roads that charge cars while they are driving, although this technology is still very expensive. Some experts doubt that it will ever be widely used.\n\nCritics point out that electric cars are only clean if the electricity itself is produced in a clean way. At present, much of the power in the country comes from natural gas, but new solar farms in the desert are changing this slowly. Otabek is hopeful. He says that when he started driving, the air in the city centre made his eyes hurt. Now, after a rainy morning, he can sometimes smell flowers from the park.",
qs: [
Q("How many electric cars are there in Tashkent today?", "More than twelve thousand", ["More than two thousand", "More than twelve thousand", "More than a million"]),
Q("What has the government done to help electric vehicles?", "Reduced taxes", ["Reduced taxes", "Built new roads", "Banned petrol cars"]),
Q("What was Otabek's job?", "Taxi driver", ["Engineer", "Taxi driver", "Factory manager"]),
Q("How much did his costs fall after the change?", "By almost half", ["By almost half", "By ten percent", "They did not change"]),
Q("How far can the car travel in cold winter weather?", "About two hundred and twenty kilometres", ["About three hundred kilometres", "About two hundred and twenty kilometres", "About eighty kilometres"]),
Q("What will the factory near Jizzakh produce?", "Batteries", ["Batteries", "Electric cars", "Solar panels"]),
TF("A slow home charger fills the battery in thirty minutes.", false, "A fast charger takes thirty minutes; a slow one needs the whole night."),
TF("Some experts doubt that roads which charge cars will be widely used.", true),
Q("Electric cars have fewer moving ___", "parts"),
Q("Much of the country's power comes from natural ___", "gas")
]
},
{
topic: "Making a film",
passage: "Making an animated film is a slow and patient job. In a small studio in Tashkent, a team of twenty-three artists spent almost three years creating a twelve-minute cartoon about a fox who wants to learn how to fly. The director, Shahlo Mirzaeva, says that when she first suggested the story, nobody believed that it could be finished. The studio had very little money, and most of the artists were young and inexperienced.\n\nThe process began with a script and hundreds of drawings. These pictures, called a storyboard, show every scene in the order in which it will appear. Shahlo drew the first version of the storyboard herself, working at her kitchen table in the evenings. Then the team discussed each scene. Sometimes they changed the ending completely; in the first version, the fox actually succeeded in flying, but they decided that it was more touching if he only learned to jump very high.\n\nNext came the animation. For every second of film, the artists need to create twenty-four separate pictures. This means that the twelve-minute cartoon contained more than seventeen thousand images. Computers helped with the colours and the backgrounds, but the movements of the fox were drawn by hand. A young animator named Sardor said that he practised the fox's walk for a month, watching real foxes in a video from a nature programme.\n\nSound was another challenge. The voices were recorded by children from a local school, because the director wanted the characters to sound natural. The music was written by a violinist, and the sound of the wind was created by a student blowing across the top of a bottle. When the team added the sound to the pictures, they all agreed that the film suddenly seemed alive.\n\nThe cartoon was shown for the first time at a festival in Samarkand last spring, where it won a prize for the best short film by a new studio. Afterwards, an international television company bought it, and it has been translated into six languages. Shahlo says that the success was a surprise, but the most precious moment was watching a small girl in the cinema who cried when the fox fell and clapped when he got up.",
qs: [
Q("How many artists worked on the cartoon?", "Twenty-three", ["Twelve", "Twenty-three", "Seventeen"]),
Q("How long did the project take?", "Almost three years", ["Almost one year", "Almost three years", "Almost ten years"]),
Q("Where did Shahlo draw the first storyboard?", "At her kitchen table", ["In the studio", "At her kitchen table", "At a school"]),
Q("What happens to the fox at the end of the final film?", "He learns to jump very high", ["He flies away", "He learns to jump very high", "He gets lost"]),
Q("How many pictures are needed for every second of film?", "Twenty-four", ["Twelve", "Twenty-four", "Sixty"]),
Q("Who recorded the voices?", "Children from a local school", ["Professional actors", "Children from a local school", "The artists"]),
TF("The movements of the fox were made by computers.", false, "They were drawn by hand."),
TF("The cartoon won a prize at a festival in Samarkand.", true),
Q("The music was written by a ___", "violinist"),
Q("The film has been translated into six ___", "languages")
]
},
{
topic: "Artificial intelligence and homework",
passage: "When the new artificial intelligence programs became popular, the teachers at School Number Twelve in Fergana were not sure what to do. Some of them wanted to forbid the programs completely. Others said that students would use them anyway, so it would be better to teach them how to use the tools sensibly. After a long meeting in September, the headmaster, Mr. Ismoilov, announced a compromise.\n\nThe new rule was simple. Students could ask the programs for explanations and examples, but they were not allowed to copy answers into their homework. Every student also had to write a short note describing how they had used the program. Mr. Ismoilov explained that the aim was honesty, not punishment. If a pupil had asked the machine to explain a difficult grammar rule, that was perfectly acceptable.\n\nThe English teacher, Ms. Kamola Aripova, was surprised by the results. She had expected that her students would become lazy, but the opposite happened. One of her pupils, Madina, asked the program to explain the difference between the past simple and the present perfect and then wrote her own examples. When Ms. Kamola checked them, she found only two mistakes. Madina said that the program had been patient and never got angry, even when she asked the same question four times.\n\nHowever, the teachers also noticed some problems. The programs sometimes gave wrong information with great confidence. In a history lesson, one student wrote that a famous scientist had been born in the wrong century, because the machine had made a mistake. After this, Ms. Kamola taught her classes a new habit: always check important facts in a book or on a trusted website.\n\nBy December, most teachers agreed that the experiment had been a success. Test results had improved slightly, and fewer students had copied from each other. Mr. Ismoilov plans to organise a workshop for parents next month, where they can learn how the programs work. He believes that technology will not replace teachers, but teachers who understand technology may replace those who do not.",
qs: [
Q("Which school is the article about?", "School Number Twelve in Fergana", ["School Number Twelve in Fergana", "A university in Tashkent", "A school in Khiva"]),
Q("What did some teachers want at first?", "To forbid the programs completely", ["To buy more computers", "To forbid the programs completely", "To close the school"]),
Q("What must every student write?", "A note about how they used the program", ["A long essay", "A note about how they used the program", "A letter to the headmaster"]),
Q("What did Madina ask the program to explain?", "The past simple and the present perfect", ["The future tenses", "The past simple and the present perfect", "A history topic"]),
Q("How many mistakes did Ms. Kamola find in Madina's examples?", "Two", ["None", "Two", "Four"]),
Q("What mistake did the machine make in the history lesson?", "It gave the wrong century for a scientist's birth", ["It gave the wrong century for a scientist's birth", "It forgot a date of a war", "It spelled a name wrongly"]),
TF("Students were allowed to copy the answers directly into their homework.", false, "Copying was not allowed."),
TF("Mr. Ismoilov will organise a workshop for parents.", true),
Q("Ms. Kamola's students now check important facts in a book or on a trusted ___", "website"),
Q("Test results had improved ___", "slightly")
]
},
{
topic: "A weather research station",
passage: "High in the Chimgan mountains, about eighty kilometres from Tashkent, there is a small white building with a large antenna on its roof. This is a weather research station, and it has been collecting information about the climate for more than sixty years. Five scientists work there throughout the year, and in winter they sometimes cannot leave for weeks because the road is covered with snow.\n\nThe head of the station, Dr. Nilufar Hamidova, begins every day at six o'clock. First, she reads the numbers from the instruments outside: temperature, wind speed, humidity and the amount of snow on the ground. These measurements are sent by computer to the national weather service, which uses them to make forecasts for the whole country. If the data are wrong, the forecasts will be wrong as well, so she checks every instrument twice.\n\nIn recent years, the scientists have noticed worrying changes. The glaciers near the station are melting faster than before. A photograph taken in 1985 shows a thick river of ice reaching almost to the valley, while today the ice ends nearly two kilometres higher. Because many farmers in the region depend on water from melting snow, this change could cause serious problems in the future.\n\nThe station also uses satellites. A satellite can photograph huge areas of land in a single day and can measure the thickness of clouds. Dr. Nilufar explained that the satellite pictures are most useful when they are compared with measurements from the ground. \"The satellite sees the whole forest,\" she says, \"but we can touch the trees.\" Together, the two methods give a much clearer picture of what is happening.\n\nThe work is not always comfortable. The station has no shop, the nearest village is a two-hour walk away, and the internet connection often fails during storms. However, the scientists say they would not change their jobs. Last summer, a group of schoolchildren visited the station, and Dr. Nilufar showed them how to launch a weather balloon. When it reached the clouds, one boy shouted that he wanted to become a scientist too.",
qs: [
Q("How far is the station from Tashkent?", "About eighty kilometres", ["About eighty kilometres", "About two hundred kilometres", "About sixty kilometres"]),
Q("How many scientists work at the station?", "Five", ["Three", "Five", "Sixty"]),
Q("What time does Dr. Nilufar start work?", "Six o'clock", ["Six o'clock", "Eight o'clock", "Noon"]),
Q("Who uses the measurements from the station?", "The national weather service", ["Local farmers", "The national weather service", "A television company"]),
Q("What does the photograph from 1985 show?", "A thick river of ice reaching almost to the valley", ["A thick river of ice reaching almost to the valley", "A village in summer", "The new antenna"]),
Q("Why are satellite pictures compared with ground measurements?", "To give a clearer picture", ["To save money", "To give a clearer picture", "To train students"]),
TF("The nearest village is a two-hour drive away.", false, "It is a two-hour walk away."),
TF("The internet connection often fails during storms.", true),
Q("Dr. Nilufar checks every instrument ___", "twice"),
Q("The schoolchildren learned how to launch a weather ___", "balloon")
]
},
{
topic: "Esports",
passage: "Not long ago, many parents thought that playing computer games was a waste of time. Today, however, professional gaming, known as esports, has become a serious sport with big prizes and millions of fans. Last year, the final of an international tournament in Seoul attracted more than forty thousand spectators in the stadium and several million more online.\n\nOne of the rising stars of the Uzbek esports scene is Sherzod Tursunov, a twenty-year-old player from Qarshi. He started playing strategy games at the age of eleven, in an internet cafe near his home. At first, his father was against it, and Sherzod had to hide his hobby. The situation changed when he won a regional competition and received a prize of five million som. His father, who had been a football player in his youth, finally understood that talent can appear in many forms.\n\nLife as a professional player is not as easy as it looks. Sherzod's team trains for eight hours every day, six days a week. They analyse recordings of their games, discuss mistakes and practise new tactics. The coach, a former player named Ilhom, insists that they also do physical exercise, because sitting for long hours without moving can damage the back and wrists. Every morning begins with a thirty-minute run.\n\nThe team also pays attention to health and sleep. Ilhom has forbidden energy drinks and late-night snacks, and he asks the players to be in bed by midnight. He says that concentration is more important than speed. \"A tired player makes silly mistakes,\" he often repeats. In a recent tournament, the team lost a match because one player had slept for only three hours the night before.\n\nSherzod knows that a career in esports is short, because players usually retire at around twenty-six. For this reason, he is studying computer science by distance learning. He hopes to become a game designer one day. Meanwhile, his team is preparing for the national championship in Tashkent in March, and they believe that this year they have a real chance of winning the first place.",
qs: [
Q("Where was the international final held?", "Seoul", ["Tashkent", "Seoul", "Qarshi"]),
Q("How old was Sherzod when he began to play?", "Eleven", ["Eleven", "Fifteen", "Twenty"]),
Q("What did Sherzod's father used to be?", "A football player", ["A football player", "A coach", "A teacher"]),
Q("How much money did Sherzod win in the regional competition?", "Five million som", ["Five million som", "Fifty thousand som", "One million som"]),
Q("How many hours does the team train every day?", "Eight", ["Four", "Six", "Eight"]),
Q("Why did the team lose a recent match?", "One player had slept for only three hours", ["One player was ill", "One player had slept for only three hours", "The coach was absent"]),
TF("Players in esports usually retire at about twenty-six.", true),
TF("The coach encourages energy drinks before matches.", false, "He has forbidden energy drinks."),
Q("Every morning begins with a thirty-minute ___", "run"),
Q("Sherzod is studying computer science by distance ___", "learning")
]
},
{
topic: "A community radio podcast",
passage: "In a quiet street in Nukus, in a room above a bakery, two friends record a podcast every Friday evening. The programme is called Voices of the Aral, and it tells stories about the people who live near the old sea. Its creators, Aysulu and Daniyar, started it three years ago with a cheap microphone and a laptop that sometimes switched itself off in the middle of a recording.\n\nThe idea came from Aysulu's grandfather, who used to be a fisherman. As a child, she listened to his stories about enormous fish, dangerous storms and a harbour that was full of boats. When the sea disappeared, the stories seemed to disappear too. Aysulu realised that the older generation would not live for ever, and that somebody had to record their memories. She asked her friend Daniyar, who studied journalism, to help her.\n\nThe first episode was not a success. The sound was bad, the interview was too long, and only eleven people downloaded it. However, the friends did not give up. They watched videos about interviewing, practised speaking clearly and chose shorter topics. After six months, they had about three hundred listeners, and a local radio station offered them a short slot on Sunday mornings.\n\nToday the podcast has more than twelve thousand listeners, many of them living abroad. One episode, about a woman who had saved her village's last boat, was heard by a famous writer, who invited the pair to a book festival in Tashkent. Daniyar says that the most important lesson was patience. \"At the beginning, we thought that success would come in a week,\" he laughs. \"It took three years.\"\n\nThe friends have also noticed that the podcast has changed the community. Young people have started to ask their grandparents questions, and several families have found old photographs to share. Next month, Aysulu and Daniyar will open a small exhibition in the town library. It will show those photographs together with a map of the old harbour and recordings of the voices, which visitors can hear through headphones.",
qs: [
Q("In which town do the friends record the podcast?", "Nukus", ["Nukus", "Bukhara", "Fergana"]),
Q("When do they record the programme?", "On Friday evenings", ["On Sunday mornings", "On Friday evenings", "On Monday afternoons"]),
Q("What did Aysulu's grandfather do?", "He was a fisherman", ["He was a journalist", "He was a fisherman", "He was a baker"]),
Q("How many people downloaded the first episode?", "Eleven", ["Eleven", "Three hundred", "Twelve thousand"]),
Q("What did the local radio station offer them?", "A short slot on Sunday mornings", ["A job", "A short slot on Sunday mornings", "A new microphone"]),
Q("Who invited the pair to a book festival?", "A famous writer", ["A famous writer", "A radio director", "A librarian"]),
TF("The podcast started with expensive equipment.", false, "It started with a cheap microphone and a laptop."),
TF("The exhibition will be in the town library.", true),
Q("The podcast now has more than twelve thousand ___", "listeners"),
Q("Daniyar says that the most important lesson was ___", "patience")
]
},
{
topic: "3D printing a new hand",
passage: "Eleven-year-old Bekzod lost three fingers on his left hand in an accident with a farm machine when he was seven. For four years, he found it difficult to do ordinary things, like tying his shoes, opening a bottle or holding a pencil. A traditional artificial hand would have cost more than eight thousand dollars, and his family, who live in a village near Termez, could not afford it.\n\nThen a volunteer from a university heard about his case. Dr. Ravshan Tojiev leads a small group of engineers who make artificial hands with a 3D printer. The machine builds objects slowly, layer by layer, from plastic. Each hand costs only about fifty dollars for the materials, and the design is available free on the internet. The team has already made nineteen hands for children in different parts of the country.\n\nMaking Bekzod's hand took three weeks. First, the engineers measured his arm and took photographs from different angles. They used a computer program to adjust the design so that the hand would fit comfortably. The printing itself lasted about thirty hours, and then the parts were joined with small strings and screws. When Bekzod moves his wrist, the fingers close, and he can hold light objects.\n\nThe first day with the new hand was emotional. Bekzod picked up a glass of water by himself and drank from it, and his mother started to cry. Later, he tried to catch a ball, which was much harder, and he dropped it nine times. However, he laughed every time. The engineers chose a bright orange colour because Bekzod said that he wanted a hand that looked like a robot's.\n\nBecause children grow quickly, the hands have to be replaced about once a year, and this is one reason why 3D printing is so useful. A new, larger hand can be produced in a few days at a low price. Dr. Ravshan hopes to open a workshop in every region of the country. He says that the technology is not magic, but it gives children something precious: the chance to play like everyone else.",
qs: [
Q("How old is Bekzod?", "Eleven", ["Seven", "Eleven", "Nineteen"]),
Q("How did Bekzod lose his fingers?", "In an accident with a farm machine", ["In a fire", "In an accident with a farm machine", "In a car crash"]),
Q("How much would a traditional hand cost?", "More than eight thousand dollars", ["More than eight hundred dollars", "More than eight thousand dollars", "About fifty dollars"]),
Q("How many hands has the team already made?", "Nineteen", ["Nineteen", "Fifty", "Three"]),
Q("How long did the printing itself last?", "About thirty hours", ["About three weeks", "About thirty hours", "About nine hours"]),
Q("Why did the engineers choose an orange colour?", "Bekzod wanted a hand like a robot's", ["Bekzod wanted a hand like a robot's", "It was the cheapest plastic", "His mother liked it"]),
TF("Bekzod dropped the ball nine times.", true),
TF("A hand lasts for ten years without changes.", false, "Hands must be replaced about once a year."),
Q("The 3D printer builds objects layer by ___", "layer"),
Q("Dr. Ravshan hopes to open a workshop in every ___", "region")
]
},
{
topic: "The online encyclopedia",
passage: "Many students use the online encyclopedia every day, but few of them know how it is written. Unlike a traditional encyclopedia, which is produced by a small group of experts and printed in heavy volumes, this one is created by volunteers. Anyone with an internet connection can add information, correct a mistake or improve an explanation. The site was founded in 2001, and today it contains articles in more than three hundred languages.\n\nOne of the volunteers is Laylo Abdullaeva, a retired librarian from Margilan. She began to edit articles six years ago after she noticed that the page about her town was very short and contained several errors. Laylo spent two weeks in the local archive, reading old newspapers and books about the history of silk production. Then she wrote a new article of three thousand words, with photographs and a list of sources.\n\nAccording to the rules of the site, every statement must be supported by a reliable source. If an editor writes that a bridge was opened in 1950, he or she must show a book or newspaper which says the same. Other volunteers check the new articles, and if there is no evidence, they remove the sentence. Laylo says that this system is not perfect, but that it works better than most people expect.\n\nVandalism is a problem, however. Sometimes people add silly or false information just for fun. Special programs help to find such changes, and experienced volunteers can restore the old version within minutes. Laylo remembers an occasion when someone changed the page about her town to say that it had a population of ten million. It was corrected in less than four minutes.\n\nTeachers have mixed opinions about the encyclopedia. Some say that students should never use it, because anybody can change it. Others, like Laylo, think that it is a good place to begin research, as long as students follow the links to the original sources. She often visits schools and teaches children how to edit articles. In her opinion, the best way to understand how knowledge works is to take part in making it.",
qs: [
Q("When was the online encyclopedia founded?", "In 2001", ["In 1990", "In 2001", "In 2010"]),
Q("In how many languages does it have articles?", "More than three hundred", ["More than thirty", "More than three hundred", "More than three thousand"]),
Q("What is Laylo's former job?", "Librarian", ["Teacher", "Librarian", "Journalist"]),
Q("Why did Laylo begin to edit articles?", "The page about her town was short and had errors", ["She was paid", "The page about her town was short and had errors", "A teacher asked her"]),
Q("How long did Laylo work in the archive?", "Two weeks", ["Two days", "Two weeks", "Two years"]),
Q("How quickly was the false population number corrected?", "In less than four minutes", ["In less than four minutes", "In a day", "In a week"]),
TF("Every statement in an article must be supported by a reliable source.", true),
TF("All teachers agree that students should never use the encyclopedia.", false, "Teachers have mixed opinions."),
Q("Laylo read old newspapers and books about the history of silk ___", "production"),
Q("She often visits schools and teaches children how to ___ articles.", "edit")
]
},
{
topic: "Drones on the farm",
passage: "Farmers in the Kashkadarya region have always depended on the weather, but recently a new helper has appeared in their fields. It flies, it makes a soft buzzing sound, and it carries a camera. The helper is a drone, and it is changing the way people grow cotton and wheat. Many farmers were doubtful at first, but the results have convinced even the most traditional ones.\n\nBahrom Qodirov, who owns sixty hectares of land near Shahrisabz, bought his first drone two seasons ago. Before that, he used to walk around the fields every morning to look for problems, and this took him nearly four hours. Now the drone covers the same area in twenty minutes. The pictures show him which parts of the field are too dry, which plants are sick and where insects have appeared.\n\nThe drone does not only take pictures. A special program studies the colours of the leaves and creates a map in which healthy areas are green and weak areas are red. Using this map, Bahrom waters only the places that need water. In the first year, he reduced his water use by about a quarter. In a region where water is scarce, this is an enormous advantage.\n\nSome larger drones can also spread fertiliser or protect plants from insects. They fly low above the field and release exactly the right amount of liquid. Experts say that this method uses fewer chemicals than a tractor, which covers the whole ground. It is also safer for workers, because nobody needs to stand in a cloud of spray.\n\nHowever, drones are not cheap. A good model costs about three thousand dollars, and training is necessary. To help small farms, the regional government has organised a shared service, in which several farmers pay together for a pilot and a machine. Bahrom is the head of one such group. He says that his father laughed at the idea of a flying machine in a field, but last harvest, the old man asked for a flight to see his favourite apple tree from above.",
qs: [
Q("Which region is the article about?", "Kashkadarya", ["Kashkadarya", "Karakalpakstan", "Fergana"]),
Q("How many hectares does Bahrom own?", "Sixty", ["Sixteen", "Sixty", "Six hundred"]),
Q("How long did Bahrom's morning walk around the fields take?", "Nearly four hours", ["Twenty minutes", "Nearly four hours", "About one hour"]),
Q("What do the red areas on the map show?", "Weak areas", ["Weak areas", "Healthy areas", "Roads"]),
Q("By how much did Bahrom reduce his water use in the first year?", "About a quarter", ["About a half", "About a quarter", "About ten percent"]),
Q("How does the government help small farms?", "By organising a shared drone service", ["By giving free drones", "By organising a shared drone service", "By reducing taxes"]),
TF("A good drone costs about three thousand dollars.", true),
TF("Drones use more chemicals than tractors, according to experts.", false, "They use fewer chemicals."),
Q("The pictures show which plants are ___", "sick"),
Q("Bahrom's father wanted to see his favourite apple ___ from above.", "tree")
]
}
];
