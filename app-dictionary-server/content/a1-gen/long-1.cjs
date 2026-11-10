const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "A Family Weekend",
    passage: "My name is Aziz and I live in Samarkand with my family. There are five people in my family: my mother Dilnoza, my father Rustam, my sister Malika, my little brother Jasur and me. We are very busy during the week, but the weekend is special for us.\n\nOn Saturday morning we get up at eight o'clock. My father makes breakfast. He makes eggs and bread for everyone. After breakfast, my mother and Malika go to the market. They buy fruit, rice and meat. My brother and I clean our room and help my father in the garden. We have many apple trees and some flowers. The flowers are red and yellow.\n\nIn the afternoon we visit my grandmother. She lives near the park, only ten minutes from our house. She cooks plov for us, and it is very good. We eat together and talk about school and work. Then Jasur plays football with our cousins in the park.\n\nOn Sunday we stay at home. We do not go to school or to work. My mother reads a book, and my father watches a film. Malika and I play cards. In the evening we all walk by the river. It is a quiet and beautiful place. We come home at seven o'clock and have tea.\n\nI love our weekends. We are together and we are happy. I think family time is the best time of the week.",
    qs: [
      Q("Where does Aziz live?", "Samarkand", ["Samarkand", "Bukhara", "Tashkent"]),
      Q("There are ___ people in Aziz's family.", "five"),
      Q("What does Aziz's father make for breakfast?", "eggs and bread", ["plov and tea", "eggs and bread", "rice and meat"]),
      Q("What do Dilnoza and Malika do on Saturday morning?", "They go to the market.", ["They go to the market.", "They work in the garden.", "They visit a cousin."]),
      TF("Aziz and Jasur clean the kitchen on Saturday.", false, "They clean their room."),
      Q("How far is the grandmother's house?", "ten minutes", ["five minutes", "ten minutes", "one hour"]),
      Q("What does the grandmother cook?", "plov", ["soup", "plov", "pizza"]),
      Q("What does Aziz's father do on Sunday?", "He watches a film.", ["He plays cards.", "He reads a book.", "He watches a film."]),
      TF("The family walks by the river on Sunday evening.", true),
      Q("The flowers in the garden are red and ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "yellow" } : q)
  },
  {
    topic: "My Grandmother's House",
    passage: "My grandmother lives in a small village near Fergana. Her name is Zulfiya, and she is seventy years old. I visit her every summer. I love her house very much.\n\nThe house is old, but it is clean and warm. There are four rooms: a kitchen, a living room and two bedrooms. In the living room there is a big carpet on the floor. The carpet is red and blue. There is also a small table and a TV, but my grandmother does not watch it often. She likes the radio more.\n\nBehind the house there is a garden. There are two cherry trees, a vine and many vegetables. My grandmother grows tomatoes, onions and carrots. In the morning we get vegetables from the garden and make a salad. There are also six chickens in the yard. I give them water and bread every day. My favourite chicken is white and its name is Oq.\n\nIn the evening we sit outside on a wooden bed called a sufa. My grandmother makes green tea and puts sweets on a plate. She tells me stories about her childhood. Sometimes she sings an old song. I do not know all the words, but I love the music.\n\nThere is no shop in the village, so my grandmother makes bread in a tandoor. The bread is hot and soft. It smells wonderful. I eat three pieces and she laughs. This house is my second home.",
    qs: [
      Q("Where does the grandmother live?", "In a village near Fergana", ["In a village near Fergana", "In a flat in Tashkent", "In a town near Samarkand"]),
      Q("Zulfiya is ___ years old.", "seventy"),
      Q("How many rooms are there in the house?", "four", ["three", "four", "five"]),
      TF("The grandmother watches TV a lot.", false, "She likes the radio more."),
      Q("What colours is the carpet?", "red and blue", ["green and white", "red and blue", "black and yellow"]),
      Q("How many chickens are in the yard?", "six", ["two", "six", "ten"]),
      Q("What is the favourite chicken's name?", "Oq", ["Oq", "Zulfiya", "Sufa"]),
      Q("What does the grandmother put on the plate in the evening?", "sweets", ["bread", "sweets", "carrots"]),
      TF("There is a shop in the village.", false, "There is no shop in the village."),
      Q("The grandmother makes bread in a ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "tandoor" } : q)
  },
  {
    topic: "A Nurse's Day",
    passage: "Gulnora is a nurse in a big hospital in Tashkent. She is thirty-two years old and she has two children. Her job is hard, but she loves it. She helps sick people every day.\n\nGulnora gets up at five o'clock in the morning. She makes tea and wakes her children at six. Her husband takes them to school. Gulnora goes to work by bus. The bus ride takes forty minutes. She starts work at seven o'clock.\n\nFirst, she checks the patients. She takes their temperature and asks, \"How are you today?\" Some patients are old, and some are very young. There is a little boy named Bobur in room twelve. He has a bad leg. Gulnora always brings him a book, and he smiles. She gives medicine to the patients at nine o'clock and again at two o'clock.\n\nAt twelve o'clock she has lunch with two other nurses. They eat in a small room. Gulnora usually has soup and bread. She cannot sit for a long time because the phone rings often. There are many new patients on Mondays.\n\nShe finishes work at four o'clock. At home she cooks dinner, helps her children with homework and tells them a story. She goes to bed at ten. Gulnora says, \"I am tired in the evening, but I am happy. I help people, and that is important.\"",
    qs: [
      Q("Where does Gulnora work?", "In a hospital", ["In a school", "In a hospital", "In a shop"]),
      Q("Gulnora has ___ children.", "two"),
      Q("What time does she get up?", "At five o'clock", ["At five o'clock", "At six o'clock", "At seven o'clock"]),
      Q("How does Gulnora go to work?", "By bus", ["By car", "By bus", "On foot"]),
      Q("What does Gulnora bring to Bobur?", "A book", ["A toy", "A book", "Sweets"]),
      TF("Bobur has a bad arm.", false, "He has a bad leg."),
      Q("When does she give medicine to the patients?", "At nine and at two", ["At seven and at four", "At nine and at two", "At twelve and at ten"]),
      Q("What does Gulnora usually have for lunch?", "Soup and bread", ["Rice and meat", "Soup and bread", "Eggs and tea"]),
      TF("Gulnora finishes work at four o'clock.", true),
      Q("There are many new patients on ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "mondays" } : q)
  },
  {
    topic: "Moving to a New Flat",
    passage: "Last month my family moved to a new flat in Namangan. My name is Sardor and I am twelve years old. Our old flat was very small, and there was only one bedroom. Now we have three bedrooms, and I have my own room. I am very happy.\n\nThe new flat is on the fourth floor. There is a lift in the building, but it is often broken. So we usually use the stairs. In the flat there is a big kitchen with a window. In the kitchen there is a table for six people. My mother loves this room. She says, \"At last I can cook for all the family.\"\n\nMoving day was very busy. My uncle Anvar came with his small truck. We put the beds, the sofa and many boxes in it. My sister Zarina was careful with the plates. I carried my books. There were twenty boxes of books, and my father laughed at me. The work took six hours. In the evening we were very hungry, so we ate pizza on the floor.\n\nThere are good things near the new flat. There is a school across the road, and there is a small park behind the building. I can walk to school in five minutes. I can also play football in the park with my new friends.\n\nThe flat is not perfect because the neighbours upstairs are noisy. But we love our new home.",
    qs: [
      Q("Where did Sardor's family move?", "To Namangan", ["To Namangan", "To Bukhara", "To Andijan"]),
      Q("The old flat had only ___ bedroom.", "one"),
      Q("On which floor is the new flat?", "The fourth", ["The second", "The third", "The fourth"]),
      Q("What is often broken in the building?", "The lift", ["The lift", "The door", "The window"]),
      Q("Who came with a small truck?", "Uncle Anvar", ["Uncle Anvar", "Sardor's father", "Zarina"]),
      TF("Sardor carried twenty boxes of books.", true),
      Q("How long did the moving work take?", "six hours", ["two hours", "four hours", "six hours"]),
      Q("What did the family eat in the evening?", "pizza", ["plov", "pizza", "soup"]),
      TF("The school is behind the building.", false, "The school is across the road."),
      Q("The neighbours upstairs are ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "noisy" } : q)
  },
  {
    topic: "A Letter to a Pen Friend",
    passage: "Dear Emma,\n\nThank you for your letter. It was a great surprise! I am happy to be your pen friend. Let me tell you about myself and my family.\n\nMy name is Kamola, and I am eleven years old. I live in Bukhara, a very old city in Uzbekistan. There are six people in my house: my parents, my grandfather, my brother and my sister. My grandfather is eighty years old. He is funny and kind. He has a long white beard, and he wears a small hat every day.\n\nMy father is a driver. He works in the city centre and comes home late. My mother is a teacher. She teaches English at a small school. That is why I can write to you in English! My brother Otabek is fifteen, and he plays the guitar very well. My sister Madina is only four. She likes drawing and she draws cats everywhere.\n\nI go to school from Monday to Saturday. My favourite subjects are English and art. After school I do my homework and help my mother in the kitchen. On Fridays I go to a swimming pool with my friend Sevara.\n\nPlease write to me about your family and your town. Do you have a pet? I have a white cat. Her name is Luna.\n\nWith love,\nKamola",
    qs: [
      Q("Where does Kamola live?", "In Bukhara", ["In Bukhara", "In Khiva", "In Samarkand"]),
      Q("There are ___ people in Kamola's house.", "six"),
      Q("How old is Kamola's grandfather?", "eighty", ["seventy", "eighty", "ninety"]),
      Q("What does the grandfather wear every day?", "A small hat", ["A small hat", "A long coat", "Glasses"]),
      Q("What is Kamola's father's job?", "He is a driver.", ["He is a teacher.", "He is a driver.", "He is a doctor."]),
      TF("Kamola's mother teaches maths.", false, "She teaches English."),
      Q("What does Otabek play?", "The guitar", ["The guitar", "The piano", "Football"]),
      Q("What does Madina like?", "Drawing", ["Swimming", "Drawing", "Singing"]),
      TF("Kamola goes to school on Saturday.", true),
      Q("The name of Kamola's white cat is ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "luna" } : q)
  },
  {
    topic: "My Busy Mother",
    passage: "My mother is the busiest person I know. Her name is Barno, and she has three jobs: she is a mother, a shop assistant and a student. I am very proud of her.\n\nMy mother gets up at half past five. First she makes breakfast for my father, my sister and me. Then she packs my lunch. She always puts an apple and a sandwich in my bag. At seven o'clock she takes my sister Dilya to kindergarten. After that she walks to her shop. It is a clothes shop in the centre of town.\n\nShe works there from eight o'clock to three o'clock. She is polite and she smiles at everybody. Many customers know her name. They say, \"Barno is the best!\" On her lunch break she does not rest. She calls my grandmother and asks, \"Are you well? Do you need anything?\"\n\nAt half past three she picks up Dilya. Then she goes home and cooks dinner. We eat at six o'clock. After dinner she washes the dishes, and I dry them. At eight o'clock she opens her books. She studies business at a small college. She has classes only on Tuesday and Thursday evenings, so on other days she studies at home.\n\nShe goes to bed very late, at eleven o'clock. I say to her, \"Mum, you are amazing!\" She laughs and says, \"Thank you, my dear.\"",
    qs: [
      Q("Barno has ___ jobs.", "three"),
      Q("What time does Barno get up?", "At half past five", ["At five o'clock", "At half past five", "At seven o'clock"]),
      Q("What does Barno put in the lunch bag?", "An apple and a sandwich", ["An apple and a sandwich", "Rice and meat", "A banana and tea"]),
      Q("Where does Barno take Dilya at seven o'clock?", "To kindergarten", ["To school", "To kindergarten", "To the shop"]),
      Q("What kind of shop does Barno work in?", "A clothes shop", ["A food shop", "A book shop", "A clothes shop"]),
      TF("Barno works in the shop until three o'clock.", true),
      Q("Who does Barno call on her lunch break?", "Her grandmother", ["Her husband", "Her grandmother", "Her sister"]),
      Q("When do the family eat dinner?", "At six o'clock", ["At five o'clock", "At six o'clock", "At eight o'clock"]),
      TF("Barno has classes every evening.", false, "She has classes only on Tuesday and Thursday."),
      Q("Barno studies ___ at a small college.")
    ].map((q, i) => i === 9 ? { ...q, answer: "business" } : q)
  },
  {
    topic: "A Family Dinner",
    passage: "Every Friday evening our whole family has dinner at my grandparents' house. My name is Lola. I am nine years old and I love Friday dinners.\n\nWe arrive at six o'clock. My uncle Farhod and his wife Shahlo are already there with their baby son. The baby is called Timur, and he is only eight months old. He has big brown eyes and two small teeth. Everybody wants to hold him.\n\nMy grandmother cooks all day. On the table there is a big plate of plov, a green salad, fresh bread and a bowl of yoghurt. For dessert there is a sweet melon. My grandmother says, \"Eat, eat! There is plenty of food!\" I always eat too much.\n\nMy grandfather sits at the head of the table. He is a quiet man, but he likes to ask questions. He asks me, \"What do you learn at school, Lola?\" Then he listens carefully. My father tells funny stories about his work. My mother and my aunt talk about clothes and shops. My cousins and I laugh a lot.\n\nAfter dinner the men drink tea and the women wash the dishes. The children play a game in the garden. We go home at nine o'clock. In the car I am sleepy, and I fall asleep before we arrive. Friday dinner is the best part of my week.",
    qs: [
      Q("When does the family have dinner at the grandparents' house?", "Every Friday", ["Every Friday", "Every Sunday", "Every Monday"]),
      Q("What time does Lola's family arrive?", "At six o'clock", ["At five o'clock", "At six o'clock", "At seven o'clock"]),
      Q("How old is baby Timur?", "eight months", ["two months", "eight months", "one year"]),
      Q("What is on the table?", "Plov, salad, bread and yoghurt", ["Plov, salad, bread and yoghurt", "Fish, rice and soup", "Pizza and chicken"]),
      Q("The dessert is a sweet ___.", "melon"),
      TF("The grandmother says there is not much food.", false, "She says there is plenty of food."),
      Q("Where does the grandfather sit?", "At the head of the table", ["Near the door", "At the head of the table", "In the garden"]),
      Q("What does the grandfather ask Lola about?", "School", ["School", "Her friends", "Her toys"]),
      TF("The children play in the garden after dinner.", true),
      Q("The family goes home at ___ o'clock.")
    ].map((q, i) => i === 9 ? { ...q, answer: "nine" } : q)
  },
  {
    topic: "My Little Brother",
    passage: "I have a little brother. His name is Behruz and he is five years old. He is small, but he has a very big voice! I am his big sister, and my name is Sabina. I am thirteen.\n\nBehruz has short black hair and a round face. He is always happy, and he talks all day. In the morning he wakes me up at six o'clock and says, \"Sabina, I am hungry!\" I make him milk and toast with honey. He eats very slowly because he plays with his food.\n\nHe loves cars. In his room there are fifty small cars. They are red, blue, yellow and green. He puts them in a long line on the floor and says their names. His favourite car is a small red fire truck. He takes it everywhere, even to the bathroom. At night he sleeps with it under his pillow.\n\nHe also loves animals. He wants a dog, but my mother says no. She says, \"We live in a flat, and a dog needs a garden.\" So Behruz has two fish. Their names are Bubble and Splash. He feeds them every morning and talks to them.\n\nSometimes Behruz is naughty. Last week he drew a picture on the wall with my pen. My mother was not happy. But then he said, \"I am sorry, I love you,\" and she smiled. I think my little brother is a small hero.",
    qs: [
      Q("Behruz is ___ years old.", "five"),
      Q("What time does Behruz wake Sabina up?", "At six o'clock", ["At five o'clock", "At six o'clock", "At seven o'clock"]),
      Q("What does Sabina make for him?", "Milk and toast with honey", ["Eggs and tea", "Milk and toast with honey", "Rice and soup"]),
      Q("How many small cars does Behruz have?", "fifty", ["fifteen", "thirty", "fifty"]),
      Q("What is his favourite car?", "A red fire truck", ["A blue taxi", "A red fire truck", "A yellow bus"]),
      TF("Behruz sleeps with his fire truck under his pillow.", true),
      Q("Why does his mother say no to a dog?", "They live in a flat.", ["They live in a flat.", "She does not like animals.", "Dogs are expensive."]),
      Q("What are the names of the fish?", "Bubble and Splash", ["Bubble and Splash", "Red and Blue", "Luna and Oq"]),
      TF("Behruz drew a picture on the wall with his own pen.", false, "He used Sabina's pen."),
      Q("Sabina thinks her little brother is a small ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "hero" } : q)
  },
  {
    topic: "Cleaning Day",
    passage: "Every Saturday is cleaning day in our house. My name is Jahongir and I live with my parents and my two sisters. Our flat is not big, but it gets dirty very fast, so we all help.\n\nWe start at nine o'clock. My mother gives everybody a job. She is like a small boss! My father cleans the windows and the balcony. My older sister, Nodira, washes the kitchen floor. My younger sister, Kamila, is only seven, so she waters the flowers and puts her toys in a box. My job is the living room. I put the books on the shelf, I take the dust from the table and I clean the carpet with a machine.\n\nMy mother does the hardest work. She washes the clothes and the curtains. There is a big washing machine in the bathroom, but it is very old and very loud. When it works, we cannot hear the radio. Then she hangs the clothes on the balcony. In summer they are dry in two hours.\n\nAt twelve o'clock the flat is clean and shiny. We are tired and hungry. Dad makes a big pot of soup, and we eat it with fresh bread. After lunch we rest.\n\nI do not like cleaning, but I like the result. A clean room feels good. In the evening I sit on the sofa and read my book. It is very quiet and fresh.",
    qs: [
      Q("Every ___ is cleaning day.", "saturday"),
      Q("What time does the cleaning start?", "At nine o'clock", ["At eight o'clock", "At nine o'clock", "At ten o'clock"]),
      Q("What does Jahongir's father clean?", "The windows and the balcony", ["The kitchen floor", "The windows and the balcony", "The carpet"]),
      Q("What does Kamila do?", "She waters the flowers.", ["She washes the floor.", "She waters the flowers.", "She cleans the windows."]),
      Q("What does Jahongir clean the carpet with?", "A machine", ["A machine", "A brush", "A cloth"]),
      TF("The washing machine is new and quiet.", false, "It is old and loud."),
      Q("Where does the mother hang the clothes?", "On the balcony", ["In the bathroom", "On the balcony", "In the garden"]),
      Q("How long do the clothes take to dry in summer?", "two hours", ["one hour", "two hours", "five hours"]),
      TF("The father makes soup for lunch.", true),
      Q("At twelve o'clock the flat is clean and ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "shiny" } : q)
  },
  {
    topic: "A Family Holiday",
    passage: "Last summer my family went on holiday to a lake in the mountains. My name is Ulugbek and I am ten years old. We went for one week, and it was the best week of the year.\n\nWe left home at five o'clock in the morning. My father drove, and my mother sat next to him with the map. My grandmother came with us too, and she brought a big bag of food. There were cakes, apples, cheese and a bottle of cold tea. My sister and I slept in the back of the car for two hours.\n\nThe lake was very beautiful. The water was clear and blue, and there were high green mountains around it. We stayed in a small wooden house near the water. There was no TV and no internet. At first I was not happy, but then I loved it.\n\nEvery day we did something fun. On Monday we swam in the lake. The water was cold! On Tuesday my father and I caught three fish, and my grandmother cooked them for dinner. On Wednesday we walked up a small mountain. From the top we saw sheep and horses. My sister took a lot of photos.\n\nIn the evenings we made a fire and sang songs. There were thousands of stars in the sky. I never see so many stars at home. On the last day I was sad. I said, \"Can we come back next year?\" My father said, \"Of course!\"",
    qs: [
      Q("Where did Ulugbek's family go on holiday?", "To a lake in the mountains", ["To the sea", "To a lake in the mountains", "To a big city"]),
      Q("The family stayed at the lake for one ___.", "week"),
      Q("What time did they leave home?", "At five o'clock", ["At five o'clock", "At seven o'clock", "At noon"]),
      Q("Who came with the family?", "The grandmother", ["The uncle", "The grandmother", "A friend"]),
      Q("Where did they stay?", "In a small wooden house", ["In a hotel", "In a tent", "In a small wooden house"]),
      TF("There was a TV in the house near the lake.", false, "There was no TV and no internet."),
      Q("What did Ulugbek and his father catch on Tuesday?", "Three fish", ["Three fish", "Five fish", "Nothing"]),
      Q("What did they see from the top of the mountain?", "Sheep and horses", ["Cows and dogs", "Sheep and horses", "Birds and cats"]),
      TF("Ulugbek's sister took many photos.", true),
      Q("In the evenings the family made a ___ and sang songs.")
    ].map((q, i) => i === 9 ? { ...q, answer: "fire" } : q)
  },
  {
    topic: "My Father's Work",
    passage: "My father is a builder. His name is Hamid, and he builds houses and small shops. I am Nargiza, and I am eleven. I think my father has an interesting job.\n\nHe gets up very early, at half past four, because the work starts at six o'clock. He drinks a cup of black tea and eats a piece of bread. Then he takes his yellow hat and his boots and goes out. He travels to work by an old white bus. Today he is building a new house on the edge of our town.\n\nMy father works with five other men. Their boss is Mr Karimov. Every day they carry bricks, mix cement and put up walls. It is hot in summer and cold in winter. My father says, \"It is hard work, but I like to see a house grow.\" When a house is ready, he takes me to see it. I am always amazed.\n\nAt noon the men stop for lunch. They sit under a tree and eat bread, boiled eggs and tomatoes. My mother puts the lunch in a blue box for my father. Sometimes she adds a small sweet for him.\n\nHe comes home at five o'clock and he is very dirty. First he takes a shower, then he plays with my little brother. On Sundays he does not work. He rests and sometimes he fixes our chairs and doors. He can fix everything!",
    qs: [
      Q("What is Hamid's job?", "He is a builder.", ["He is a driver.", "He is a builder.", "He is a teacher."]),
      Q("What time does Hamid get up?", "At half past four", ["At half past four", "At six o'clock", "At seven o'clock"]),
      Q("Hamid drinks a cup of black ___ in the morning.", "tea"),
      Q("How does Hamid travel to work?", "By an old white bus", ["By car", "By bicycle", "By an old white bus"]),
      Q("Who is the boss?", "Mr Karimov", ["Mr Karimov", "Hamid", "Mr Rashidov"]),
      TF("It is hot at the building site in winter.", false, "It is cold in winter."),
      Q("Where do the men eat lunch?", "Under a tree", ["In a small shop", "Under a tree", "In the bus"]),
      Q("What does Hamid's lunch box look like?", "It is blue.", ["It is red.", "It is blue.", "It is yellow."]),
      TF("Hamid does not work on Sundays.", true),
      Q("When he comes home, Hamid is very ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "dirty" } : q)
  },
  {
    topic: "Our Neighbours",
    passage: "We live in a big building with twenty flats. I like our neighbours very much. My name is Dilshod, and I want to tell you about them.\n\nOn the first floor there lives an old man called Mr Ergash. He is seventy-five and he lives alone. He has a green parrot named Chiroq. The parrot can say \"Hello\" and \"Good morning\". Every day I stop at his door and talk to Chiroq. Mr Ergash always gives me a sweet.\n\nOn the second floor there is a family with four children. The mother is called Aziza, and she is a hairdresser. The children are noisy, but they are very friendly. Sometimes we play football together in the yard. The youngest girl is called Aysha and she is only three. She cannot run fast, but she tries.\n\nOur flat is on the third floor, and next door there lives a young doctor, Doctor Sherzod. He is single and very busy. He works at night, so in the day he sleeps. We are quiet in the afternoon because of him. When my mother is ill, he comes and helps for free. We are lucky to have him.\n\nOn the top floor there is a nice lady called Mrs Hilola. She bakes cakes every Sunday and gives a piece to everybody in the building. Her apple cake is the best in town.\n\nGood neighbours are like a second family.",
    qs: [
      Q("The building has ___ flats.", "twenty"),
      Q("Who lives alone on the first floor?", "Mr Ergash", ["Mr Ergash", "Doctor Sherzod", "Aziza"]),
      Q("What is the parrot's name?", "Chiroq", ["Chiroq", "Aysha", "Oq"]),
      Q("What does Aziza do?", "She is a hairdresser.", ["She is a nurse.", "She is a hairdresser.", "She is a teacher."]),
      TF("Aziza has two children.", false, "She has four children."),
      Q("How old is Aysha?", "three", ["three", "five", "seven"]),
      Q("On which floor is Dilshod's flat?", "The third", ["The first", "The second", "The third"]),
      Q("Why is Dilshod's family quiet in the afternoon?", "The doctor sleeps then.", ["The doctor sleeps then.", "Mr Ergash is ill.", "The children study."]),
      TF("Mrs Hilola bakes cakes every Sunday.", true),
      Q("Mrs Hilola's ___ cake is the best in town.")
    ].map((q, i) => i === 9 ? { ...q, answer: "apple" } : q)
  },
  {
    topic: "A Surprise Birthday",
    passage: "Last Saturday was my mother's birthday. She is forty years old now. My name is Rayhon, and my brother Doniyor and I wanted to give her a big surprise.\n\nWe planned everything with our father one week before. He said, \"Your mother thinks we forget her birthday. Let's make a party!\" So we called her sister, Aunt Mavluda, and my grandmother. They agreed to come at four o'clock. My mother was at work until three, so we had enough time.\n\nOn Saturday morning my father took my mother to the market. She did not know the reason. Meanwhile Doniyor and I made decorations. We cut paper hearts and stars and put them on the walls. We also blew up twenty balloons. They were pink, white and blue. Aunt Mavluda came early and brought a huge chocolate cake with forty small candles.\n\nAt half past four my mother came home. All the lights were off. She opened the door and we all shouted, \"Happy birthday!\" She was so surprised that she dropped her bag. Then she began to cry and laugh at the same time. \"I cannot believe it,\" she said.\n\nWe sang a song and she blew out the candles. My present was a small blue scarf, and she put it on at once. We ate cake, drank tea and danced. It was the happiest day of the year for our family.",
    qs: [
      Q("Whose birthday was it?", "Rayhon's mother's", ["Rayhon's mother's", "Rayhon's sister's", "Doniyor's"]),
      Q("Rayhon's mother is ___ years old now.", "forty"),
      Q("Who is Aunt Mavluda?", "The mother's sister", ["The mother's sister", "The father's sister", "A neighbour"]),
      Q("What time did the guests plan to come?", "At four o'clock", ["At three o'clock", "At four o'clock", "At five o'clock"]),
      Q("Where did the father take the mother in the morning?", "To the market", ["To the market", "To the park", "To the shop"]),
      TF("Rayhon and Doniyor cut paper hearts and stars.", true),
      Q("What colour were the balloons?", "Pink, white and blue", ["Red and yellow", "Pink, white and blue", "Green and black"]),
      Q("Who brought the cake?", "Aunt Mavluda", ["Aunt Mavluda", "The grandmother", "The father"]),
      TF("The lights were on when the mother opened the door.", false, "All the lights were off."),
      Q("Rayhon's present was a small blue ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "scarf" } : q)
  },
  {
    topic: "The Family Album",
    passage: "In our living room there is an old brown cupboard. On the top shelf there is a big family album. My name is Shahzod. On rainy days I take the album and look at the photos with my grandmother.\n\nThe first photo is black and white. It shows my grandparents on their wedding day. My grandmother is young and beautiful. She wears a long white dress and holds red flowers. My grandfather is thin and tall, and he has a big smile. They were only twenty years old.\n\nThe next page has photos of my father as a child. He is four years old and sits on a small horse. He looks afraid, and my grandmother always laughs when she sees this photo. There is also a photo of my father at school. He wears a white shirt and a blue tie.\n\nMy favourite photo is of my parents on a boat. It was their honeymoon in Turkey. They are young and happy, and the sea is bright blue behind them. My mother has long hair in this photo. Now it is short.\n\nThe last pages are for me and my sister. There is a photo of me on my first birthday with cake all over my face. My sister Zebo says, \"Please do not show this photo to my friends!\"\n\nI love our album. It tells the story of our family, and I want to add many new photos to it.",
    qs: [
      Q("Where is the family album?", "On the top shelf of a cupboard", ["Under the bed", "On the top shelf of a cupboard", "On the table"]),
      Q("When does Shahzod look at the album?", "On rainy days", ["On rainy days", "Every morning", "On Sundays"]),
      Q("What is the first photo?", "Grandparents' wedding day", ["Grandparents' wedding day", "A school photo", "A birthday party"]),
      Q("The grandparents were only ___ years old at the wedding.", "twenty"),
      Q("What is the father doing in the photo as a child?", "He sits on a small horse.", ["He plays football.", "He sits on a small horse.", "He rides a bicycle."]),
      TF("The father looks afraid in the horse photo.", true),
      Q("Where did the parents go on their honeymoon?", "To Turkey", ["To Turkey", "To Russia", "To Egypt"]),
      Q("What is behind the parents in the boat photo?", "The blue sea", ["The mountains", "The blue sea", "A big city"]),
      TF("Shahzod's mother has long hair now.", false, "Now her hair is short."),
      Q("Shahzod has cake all over his face in the photo of his first ___.")
    ].map((q, i) => i === 9 ? { ...q, answer: "birthday" } : q)
  },
  {
    topic: "My Grandfather's Stories",
    passage: "My grandfather knows a thousand stories. His name is Tohir, and he is eighty-two years old. I am Muhammad, and I am eight. Every evening after dinner I sit next to him and ask, \"Grandpa, tell me a story!\"\n\nHe sits in his big green chair and puts on his glasses. First he drinks a little tea. Then he starts: \"A long time ago, when I was a boy...\" I love these words. They mean a new adventure begins.\n\nMy favourite story is about his first job. When he was fourteen, he worked on a farm near a river. He got up at four o'clock every morning and gave food to the cows. His boss was an old woman, and she had a very loud voice. One day a small cow ran away. My grandfather ran after it for three hours. At last he found it in a garden. The old woman gave him a big watermelon as a prize.\n\nAnother story is about his bicycle. It was his first bicycle and it was red. He paid for it with his own money. He rode it to school every day. One winter day he fell into the snow, and everyone laughed.\n\nSometimes his stories are sad, but most of them are funny. When I ask if they are true, he smiles and says, \"A good story is always a little bit true.\"\n\nI want to remember them all. Tomorrow I will bring my notebook and write them down.",
    qs: [
      Q("How old is Muhammad's grandfather?", "eighty-two", ["seventy-two", "eighty-two", "ninety-two"]),
      Q("When does Muhammad ask for a story?", "After dinner", ["In the morning", "After dinner", "At lunch"]),
      Q("What does the grandfather do before he starts a story?", "He drinks a little tea.", ["He drinks a little tea.", "He eats an apple.", "He reads a book."]),
      Q("The grandfather was ___ when he got his first job.", "fourteen"),
      Q("What did he give to the cows?", "Food", ["Water", "Food", "Milk"]),
      TF("The boss on the farm was a quiet old man.", false, "She was an old woman with a loud voice."),
      Q("How long did he run after the small cow?", "three hours", ["one hour", "three hours", "five hours"]),
      Q("What prize did the old woman give him?", "A big watermelon", ["A big watermelon", "Some money", "A red bicycle"]),
      TF("The grandfather's first bicycle was red.", true),
      Q("Tomorrow Muhammad will bring his ___ and write the stories down.")
    ].map((q, i) => i === 9 ? { ...q, answer: "notebook" } : q)
  }
];
