const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "A trip to the market",
    passage: [
      "Every Sunday, my mother and I go to the big market in Samarkand. We leave home at seven o'clock in the morning because the market is very busy later. My name is Dilnoza and I am nine years old. I like the market because it is full of colours and smells.",
      "First we go to the bread seller. He has a big round oven, and his bread is always hot. My mother buys two loaves from him. Then we walk to the fruit tables. There are red apples, yellow melons and green grapes. My mother likes grapes, but I like melons. The fruit seller is a kind old woman. She always gives me a small piece of melon to taste. It is very sweet.",
      "After the fruit, we buy vegetables. We need onions, carrots and potatoes for dinner. My mother asks the price and the man says, \"Carrots are three thousand sums for one kilo.\" She buys two kilos. The market is noisy, and people shout, laugh and talk. A little boy sells flowers near the gate. Today my mother buys a small bunch of white flowers for our table.",
      "We go home at ten o'clock. My bag is heavy, but I am happy. At home, my grandmother helps us wash the vegetables. In the evening, we cook a big dinner and the whole family eats together. I think the Sunday market is the best part of my week."
    ].join("\n\n"),
    qs: [
      Q("Where does Dilnoza go every Sunday?", "To the market in Samarkand", ["To the market in Samarkand", "To a shop in Tashkent", "To a school in Samarkand"]),
      Q("Why do they leave home at seven o'clock?", "The market is busy later", ["The market is busy later", "The market is closed later", "Grandmother is waiting"]),
      Q("Who likes grapes?", "Her mother", ["Dilnoza", "Her mother", "Her grandmother"]),
      Q("What does the old woman give Dilnoza?", "A piece of melon", ["A bunch of grapes", "A loaf of bread", "A piece of melon"]),
      TF("The bread seller has a big round oven.", true),
      Q("How many kilos of carrots does the mother buy?", "Two", ["One", "Two", "Three"]),
      Q("Who sells flowers near the gate?", "A little boy", ["An old man", "A kind woman", "A little boy"]),
      Q("My mother buys two ___ from the bread seller."  , "loaves"),
      TF("They go home at nine o'clock.", false, "They go home at ten o'clock."),
      Q("At home, my grandmother helps us wash the ___.", "vegetables")
    ]
  },
  {
    topic: "My favourite restaurant",
    passage: [
      "My favourite restaurant is called Silk Road. It is near my school in Tashkent. We go there on my father's birthday and on other special days. The restaurant is not big, but it is very clean and warm. There are ten tables, and each table has a small lamp and a green cloth.",
      "The waiter is a friendly man. His name is Aziz. He wears a white shirt and a black hat. He always says, \"Welcome, my friends!\" Then he gives us the menu. My father orders lagman, which is a soup with long noodles, meat and vegetables. My mother likes fish and rice. My little sister Madina eats only chips and chicken. I always choose samsa because it is hot and has tasty meat inside.",
      "The food comes after fifteen minutes. We drink green tea with our dinner, and Madina has orange juice. The music is soft, and people talk quietly. On the wall there are pictures of old cities like Bukhara and Khiva. I like to look at them while we eat.",
      "The prices are not high. A big dinner for four people costs about two hundred thousand sums. After dinner, Aziz brings a small cake for my father, and we sing a song. Then we say thank you and go home. I hope we can come back soon."
    ].join("\n\n"),
    qs: [
      Q("What is the name of the restaurant?", "Silk Road", ["Green Lamp", "Silk Road", "Old City"]),
      Q("Where is the restaurant?", "Near the writer's school", ["Near the writer's school", "Near the writer's house", "Near a big park"]),
      TF("There are ten tables in the restaurant.", true),
      Q("What is the waiter's name?", "Aziz", ["Karim", "Aziz", "Anvar"]),
      Q("What does the father order?", "Lagman", ["Samsa", "Lagman", "Fish and rice"]),
      Q("What does Madina eat?", "Chips and chicken", ["Fish and rice", "Samsa", "Chips and chicken"]),
      Q("The waiter wears a white ___.", "shirt"),
      Q("How long is the wait for the food?", "Fifteen minutes", ["Ten minutes", "Fifteen minutes", "Thirty minutes"]),
      Q("On the wall there are pictures of old ___ like Bukhara and Khiva.", "cities"),
      TF("A dinner for four people costs one hundred thousand sums.", false, "It costs about two hundred thousand sums.")
    ]
  },
  {
    topic: "Cooking plov with grandma",
    passage: [
      "On Friday I go to my grandmother's house. Her name is Halima and she is sixty-five years old. She lives in a small house with a big garden in Fergana. On Fridays we cook plov together. Plov is a famous dish in Uzbekistan. It has rice, meat, carrots and onions.",
      "First, Grandma puts a big black pot on the fire. She puts oil in the pot. When the oil is hot, she adds the onions. I cut the carrots into long thin pieces. I must be careful with the knife! Grandma says, \"Slowly, Gulnora, slowly.\" Then she puts the meat in the pot. After ten minutes, she adds the carrots and some salt.",
      "Next, we wash the rice three times. Grandma adds the rice and some warm water. She puts one whole garlic in the middle of the pot. Then we close the pot and wait for forty minutes. The kitchen smells wonderful. My grandfather comes in and says, \"I am very hungry!\"",
      "At one o'clock, the plov is ready. We put it on a large plate and take it to the table in the garden. We also have a salad of tomatoes and onions. All my cousins come, and there are eight people at the table. Everyone says the plov is delicious. I am proud because I helped. Grandma smiles and says I am a good cook."
    ].join("\n\n"),
    qs: [
      Q("How old is Grandma Halima?", "Sixty-five", ["Fifty-five", "Sixty-five", "Seventy-five"]),
      Q("Where does Grandma live?", "In a small house in Fergana", ["In a flat in Tashkent", "In a small house in Fergana", "In a house in Samarkand"]),
      TF("Plov has rice, meat, carrots and onions.", true),
      Q("Grandma puts a big black ___ on the fire.", "pot"),
      Q("What does Gulnora cut?", "The carrots", ["The onions", "The carrots", "The garlic"]),
      Q("How many times do they wash the rice?", "Three times", ["One time", "Two times", "Three times"]),
      Q("What does Grandma put in the middle of the pot?", "One whole garlic", ["One whole garlic", "A carrot", "Some salt"]),
      Q("How long do they wait after they close the pot?", "Forty minutes", ["Ten minutes", "Twenty minutes", "Forty minutes"]),
      TF("The plov is ready at two o'clock.", false, "The plov is ready at one o'clock."),
      Q("We also have a salad of tomatoes and ___.", "onions")
    ]
  },
  {
    topic: "A shopping list",
    passage: [
      "My name is Rustam and I am twelve years old. My mother is very busy on Saturday, so she writes a shopping list for me. I can go to the shop alone. The shop is only five minutes from our flat. My mother gives me twenty thousand sums and the list.",
      "The list says: one bottle of milk, six eggs, a kilo of rice, two tomatoes and a small bag of sugar. At the end of the list, my mother writes, \"Buy one sweet for yourself.\" I smile. I put the money in my pocket and I go.",
      "In the shop, there are many people. First, I find the milk. It is in the cold place at the back. Then I look for eggs. The eggs are on a shelf near the door. I take a box of six. The rice and sugar are on the next shelf. But I cannot find the tomatoes. I ask a woman who works in the shop. She says, \"Tomatoes are outside, near the fruit.\"",
      "At the till, the girl says, \"Eighteen thousand sums, please.\" I give her my money and she gives me two thousand sums back. I buy a small sweet for myself with that money. At home my mother says, \"Thank you, Rustam. You are a great helper.\" Then I sit in the kitchen and eat my sweet. Next Saturday I want to go to the shop again."
    ].join("\n\n"),
    qs: [
      Q("How old is Rustam?", "Twelve", ["Ten", "Twelve", "Fourteen"]),
      Q("How far is the shop from the flat?", "Five minutes", ["Five minutes", "Ten minutes", "Fifteen minutes"]),
      Q("My mother gives me twenty thousand ___ and the list.", "sums"),
      TF("Rustam goes to the shop with his mother.", false, "He goes to the shop alone."),
      Q("Where are the eggs?", "On a shelf near the door", ["At the back", "On a shelf near the door", "Outside"]),
      TF("The milk is in the cold place at the back.", true),
      Q("Where are the tomatoes?", "Outside, near the fruit", ["At the back", "Next to the rice", "Outside, near the fruit"]),
      Q("The rice and ___ are on the next shelf.", "sugar"),
      Q("How much money does the girl give back?", "Two thousand sums", ["Two thousand sums", "Five thousand sums", "Ten thousand sums"]),
      Q("What does Rustam buy for himself?", "A small sweet", ["A small sweet", "A bottle of juice", "A big cake"])
    ]
  },
  {
    topic: "A new clothes shop",
    passage: [
      "There is a new clothes shop in my street. It opens on Monday and its name is Fashion Land. My friend Nilufar and I walk there after school. The shop has big windows, and there are many bright clothes in them. A sign on the door says: \"Everything is cheaper this week.\"",
      "Inside, the shop is very big. There are two floors. Clothes for women are on the first floor and clothes for children are on the second floor. I look at the dresses. There is a long blue dress and a short red dress. Nilufar wants a yellow T-shirt. Her favourite colour is yellow. A young shop assistant helps us. Her name is Kamola.",
      "I try on the blue dress. It is too big, so Kamola brings a smaller one. This dress is perfect! It costs one hundred and twenty thousand sums, but this week it is eighty thousand. I do not have enough money. I have only fifty thousand sums. Kamola says, \"Come back on Friday, and we keep the dress for you.\" That is very kind.",
      "Nilufar buys her yellow T-shirt for thirty thousand sums. We take photos in front of the shop and we go home. On Friday my father gives me thirty thousand sums, and I buy the blue dress. I wear it to school on Monday and everybody says it is beautiful."
    ].join("\n\n"),
    qs: [
      Q("What is the name of the shop?", "Fashion Land", ["Style Street", "Fashion Land", "New Fashion"]),
      Q("When does the shop open?", "On Monday", ["On Monday", "On Friday", "On Saturday"]),
      Q("The shop has two ___.", "floors"),
      Q("Where are the children's clothes?", "On the second floor", ["On the first floor", "On the second floor", "Near the door"]),
      Q("What is Nilufar's favourite colour?", "Yellow", ["Blue", "Red", "Yellow"]),
      TF("Kamola brings a bigger dress.", false, "She brings a smaller dress."),
      Q("How much is the dress this week?", "Eighty thousand sums", ["Fifty thousand sums", "Eighty thousand sums", "One hundred and twenty thousand sums"]),
      Q("How much money does the writer have in the shop?", "Fifty thousand sums", ["Thirty thousand sums", "Fifty thousand sums", "Eighty thousand sums"]),
      TF("The writer buys the blue dress on Friday.", true),
      Q("At school, everybody says the dress is ___.", "beautiful")
    ]
  },
  {
    topic: "Breakfast around the world",
    passage: [
      "Hello, I am Mr Brown, an English teacher. Today I talk about breakfast around the world. Breakfast is the first meal of the day, and people eat very different things in different countries.",
      "In England, many people eat eggs, bacon, toast and beans. They drink tea with milk. In Japan, breakfast is often rice, fish and soup. People there also drink green tea. In France, breakfast is very small. People eat a croissant and drink coffee. They do not eat much in the morning.",
      "In Uzbekistan, breakfast is often bread with butter, cheese and tea. Some families eat hot soup or eggs with tomatoes. In Mexico, people like tortillas with beans and eggs. In Turkey, breakfast is big and has olives, cheese, tomatoes, eggs and bread. Families sit at the table for a long time and talk.",
      "In my class there are twenty students. I ask them, \"What do you eat for breakfast?\" Twelve students say bread and tea. Five students say eggs. Three students eat nothing! I tell them that breakfast is important because it gives you energy for school. My favourite breakfast is a bowl of porridge with honey. What is yours?"
    ].join("\n\n"),
    qs: [
      Q("What is Mr Brown's job?", "He is a teacher", ["He is a cook", "He is a teacher", "He is a doctor"]),
      Q("What do many people in England drink with breakfast?", "Tea with milk", ["Coffee", "Green tea", "Tea with milk"]),
      Q("What is a Japanese breakfast?", "Rice, fish and soup", ["Rice, fish and soup", "A croissant and coffee", "Bread and cheese"]),
      TF("Breakfast in France is very small.", true),
      Q("In France, people eat a ___ and drink coffee.", "croissant"),
      TF("Breakfast in Turkey is small.", false, "Breakfast in Turkey is big."),
      Q("How many students are in Mr Brown's class?", "Twenty", ["Twelve", "Twenty", "Thirty"]),
      Q("How many students say bread and tea?", "Twelve", ["Three", "Five", "Twelve"]),
      Q("What is Mr Brown's favourite breakfast?", "Porridge with honey", ["Eggs and toast", "Rice and fish", "Porridge with honey"]),
      Q("Breakfast gives you ___ for school.", "energy")
    ]
  },
  {
    topic: "A birthday cake",
    passage: [
      "Tomorrow is my sister's birthday. Her name is Sevara and she is seven years old. I am Jasur and I am twelve. I want to make a cake for her. I can bake a little. My mother says I can use the kitchen after lunch.",
      "I need flour, sugar, eggs, butter and milk. We have flour, sugar and milk at home, but there are no eggs. So I go to the shop and buy six eggs. I also buy strawberries and a small bottle of cream. Then I start. I put the butter and sugar in a bowl and mix them. Next I add the eggs, the flour and the milk. The mix looks yellow and soft.",
      "I pour it into a round tin, and my mother puts the tin in the oven. We bake the cake for thirty-five minutes. While it is in the oven, I make the cream. I wash the strawberries and cut them in halves. When the cake is cool, I cover it with cream and put the strawberries on top. I also write \"Happy Birthday Sevara\" with chocolate.",
      "The next day, at six o'clock, all our family sits in the living room. I bring the cake and put seven candles on it. Sevara closes her eyes and makes a wish. Then she blows out the candles. She says, \"This is the best cake in the world!\" Everyone has a big piece. I feel very proud and happy."
    ].join("\n\n"),
    qs: [
      Q("How old is Sevara?", "Seven", ["Six", "Seven", "Twelve"]),
      TF("Jasur is twelve years old.", true),
      Q("What is missing at home?", "Eggs", ["Flour", "Milk", "Eggs"]),
      Q("How many eggs does Jasur buy?", "Six", ["Four", "Six", "Ten"]),
      Q("I put the butter and ___ in a bowl and mix them.", "sugar"),
      Q("How long do they bake the cake?", "Thirty-five minutes", ["Fifteen minutes", "Thirty-five minutes", "Forty-five minutes"]),
      TF("Jasur puts bananas on the cake.", false, "He puts strawberries on the cake."),
      Q("What does Jasur write with chocolate?", "Happy Birthday Sevara", ["Happy New Year", "Happy Birthday Sevara", "I love you, Sevara"]),
      Q("What time does the family sit in the living room?", "At six o'clock", ["At five o'clock", "At six o'clock", "At eight o'clock"]),
      Q("Sevara closes her eyes and makes a ___.", "wish")
    ]
  },
  {
    topic: "The supermarket on Saturday",
    passage: [
      "On Saturday morning, my father and I go to the supermarket. My name is Malika. The supermarket is a big building with a large car park. It is open from eight in the morning to eleven at night. On Saturdays it is full of families, and we need a trolley.",
      "My father has a list. First, we go to the fruit and vegetable part. We buy bananas, oranges and potatoes. Then we go to the milk and cheese part. It is cold there, so I put on my jacket. Next to it is the meat part, and a man in a white hat cuts the meat for people. My father buys one kilo of beef.",
      "I love the sweet part best. There are biscuits, chocolates and many kinds of juice. My father says, \"You can choose one thing.\" I take a small orange juice. We also see a special offer on rice: two bags for the price of one. My father is happy and takes four bags.",
      "At the till, there is a long line. We wait for ten minutes. My father pays with his card. A boy helps us put the shopping into bags. Outside, we put the bags in the car. On the way home, I drink my juice and look at the cars. Shopping on Saturday is tiring, but it is fun."
    ].join("\n\n"),
    qs: [
      Q("When does the supermarket close?", "At eleven at night", ["At eight in the morning", "At six in the evening", "At eleven at night"]),
      Q("What do they need on Saturday?", "A trolley", ["A car", "A trolley", "A basket"]),
      Q("Why does Malika put on her jacket?", "It is cold in the milk and cheese part", ["It is raining", "It is cold in the milk and cheese part", "It is cold in the meat part"]),
      Q("A man in a white ___ cuts the meat.", "hat"),
      Q("How much beef does the father buy?", "One kilo", ["Half a kilo", "One kilo", "Two kilos"]),
      Q("What does Malika choose?", "A small orange juice", ["A small orange juice", "Some biscuits", "A chocolate"]),
      TF("There is a special offer on rice.", true),
      Q("How long do they wait at the till?", "Ten minutes", ["Five minutes", "Ten minutes", "Twenty minutes"]),
      TF("The father pays with cash.", false, "He pays with his card."),
      Q("A boy helps us put the shopping into ___.", "bags")
    ]
  },
  {
    topic: "A cafe menu",
    passage: [
      "My name is Akmal. Look at the menu of the Blue Cup cafe. It is a small cafe in Bukhara, and it opens at nine in the morning and closes at nine in the evening. My aunt Feruza works there as a cook, so I know the menu very well.",
      "The menu has three parts. The first part is hot drinks. Black tea costs five thousand sums, coffee costs eight thousand sums, and hot chocolate costs ten thousand sums. The second part is food. There are sandwiches, soup, pasta and pizza. A cheese sandwich costs twelve thousand sums, and a big pizza costs thirty thousand sums.",
      "The third part is sweet food. There is apple cake, ice cream and honey pancakes. The ice cream has three flavours: vanilla, chocolate and strawberry. Children love it. My aunt says the apple cake is her special recipe, and she uses her grandmother's old book. There is also a small sign on the wall. It says, \"Please do not use your phone at the table.\"",
      "Last Saturday, I go to the cafe with my friends Otabek and Sardor. I order a cheese sandwich and hot chocolate. Otabek takes a pizza, and Sardor orders pasta with a glass of cold water. After lunch, Aunt Feruza gives each of us a free piece of apple cake. We eat it and say it is the best cake in Bukhara."
    ].join("\n\n"),
    qs: [
      Q("Where is the Blue Cup cafe?", "In Bukhara", ["In Khiva", "In Bukhara", "In Samarkand"]),
      Q("What time does the cafe open?", "At nine in the morning", ["At eight in the morning", "At nine in the morning", "At ten in the morning"]),
      Q("Who works in the cafe as a cook?", "Akmal's aunt", ["Akmal's mother", "Akmal's aunt", "Akmal's friend"]),
      Q("The menu has three ___.", "parts"),
      Q("How much does coffee cost?", "Eight thousand sums", ["Five thousand sums", "Eight thousand sums", "Ten thousand sums"]),
      TF("A big pizza costs thirty thousand sums.", true),
      Q("How many flavours does the ice cream have?", "Three", ["Two", "Three", "Four"]),
      Q("What does Akmal order?", "A cheese sandwich and hot chocolate", ["A pizza", "Pasta and cold water", "A cheese sandwich and hot chocolate"]),
      Q("Sardor orders pasta with a glass of cold ___.", "water"),
      TF("Aunt Feruza gives them free ice cream.", false, "She gives them free apple cake.")
    ]
  },
  {
    topic: "Buying shoes",
    passage: [
      "My old shoes are too small, and they have a hole in one of them. My father says, \"Madina, today we go and buy new shoes.\" It is Thursday and the shoe shop is near our house. We go there after dinner.",
      "The shop has many kinds of shoes. There are black school shoes, white trainers, brown boots and pink sandals. A tall man says, \"Good evening! Can I help you?\" My father says, \"We need school shoes for my daughter.\" The man asks, \"What size are you?\" I do not know my size. He measures my foot with a metal tool. I am size thirty-three.",
      "He brings three pairs of black shoes. The first pair is too tight. The second pair is too long. The third pair is perfect. They are comfortable and soft. I walk in the shop, and I can run in them too! The price is two hundred and fifty thousand sums. My father says it is a lot, but good shoes last a long time.",
      "Then I see white trainers with a blue line. I really want them, and I look at my father with big eyes. He laughs and says, \"Not today. Maybe for your birthday in May.\" I say OK. We pay for the school shoes and the man puts my old shoes in a green bag. I wear my new shoes home. I cannot wait to show my friends tomorrow."
    ].join("\n\n"),
    qs: [
      Q("What is wrong with Madina's old shoes?", "They are too small and have a hole", ["They are dirty", "They are too big", "They are too small and have a hole"]),
      Q("What day is it?", "Thursday", ["Monday", "Thursday", "Saturday"]),
      TF("The shoe shop is far from their house.", false, "The shop is near their house."),
      Q("The man measures my ___ with a metal tool.", "foot"),
      Q("What size is Madina?", "Thirty-three", ["Thirty-one", "Thirty-three", "Thirty-five"]),
      Q("What is wrong with the first pair?", "It is too tight", ["It is too long", "It is too tight", "It is too dark"]),
      Q("How much are the school shoes?", "Two hundred and fifty thousand sums", ["One hundred and fifty thousand sums", "Two hundred and fifty thousand sums", "Three hundred thousand sums"]),
      Q("My father says good shoes last a long ___.", "time"),
      Q("When can Madina maybe get the white trainers?", "For her birthday in May", ["Tomorrow", "For New Year", "For her birthday in May"]),
      TF("Madina wears her new shoes home.", true)
    ]
  },
  {
    topic: "A picnic basket",
    passage: [
      "Next Saturday our class goes on a picnic to the Chimgan mountains. Our teacher, Ms Dilfuza, says every student must bring something to eat. I am Timur and I help my mother pack the picnic basket on Friday evening.",
      "We have a big brown basket with a red cloth inside. First, we put in a blanket for sitting on the grass. Then my mother makes eight sandwiches with cheese and cucumber. She puts them in a box. We also put in six boiled eggs, a bag of apples and a bunch of grapes. There is a big bottle of water, but there is no juice. My mother says water is better for a hot day.",
      "My mother says, \"Do not forget the plates, the cups and the napkins.\" I also take a ball and a small cake for my friends. At the end, we put a knife for the apples in the basket. The basket is very heavy! My father says he can carry it to the bus.",
      "On Saturday the weather is sunny and warm. The bus leaves at eight o'clock. After a one-hour trip, we arrive at the mountains. We find a nice place near a small river. We eat our food, play football and sing songs. My friend Bekzod forgets his water, so I give him half of my bottle. At four o'clock we clean the grass and take all our rubbish home. It is a lovely day."
    ].join("\n\n"),
    qs: [
      Q("Where does the class go for the picnic?", "To the Chimgan mountains", ["To a big forest", "To the Chimgan mountains", "To a river park"]),
      Q("What colour is the basket?", "Brown", ["Red", "Brown", "Green"]),
      Q("How many sandwiches does the mother make?", "Eight", ["Six", "Eight", "Ten"]),
      Q("My mother puts the sandwiches in a ___.", "box"),
      TF("There are six boiled eggs in the basket.", true),
      Q("Why is there no juice?", "The mother says water is better", ["Timur does not like it", "The mother says water is better", "There is no money"]),
      Q("Who carries the basket to the bus?", "Timur's father", ["Timur", "Timur's mother", "Timur's father"]),
      Q("What time does the bus leave?", "At eight o'clock", ["At seven o'clock", "At eight o'clock", "At nine o'clock"]),
      TF("Timur gives Bekzod a sandwich.", false, "He gives Bekzod half of his water."),
      Q("At four o'clock we take all our ___ home.", "rubbish")
    ]
  },
  {
    topic: "Healthy and unhealthy food",
    passage: [
      "My name is Dr Nodira, and I am a children's doctor. Today I want to talk about healthy and unhealthy food. Healthy food helps your body and makes you strong. Unhealthy food tastes good, but it is not good for you every day.",
      "Healthy food is fruit, vegetables, fish, eggs, milk and brown bread. Apples, carrots and tomatoes have vitamins. Milk and cheese are good for your bones and teeth. Fish and eggs help you to grow. You should eat five kinds of fruit and vegetables every day. You should also drink six glasses of water.",
      "Unhealthy food is sweets, chips, fizzy drinks and fast food. These have a lot of sugar, salt or oil. A small bottle of fizzy drink has about seven spoons of sugar! If you eat too many sweets, your teeth hurt and you can feel sleepy. But you can eat sweets sometimes. A piece of cake on Sunday is OK.",
      "Here is my advice. Eat breakfast every morning. Do not eat while you watch TV. Take fruit to school, not chips. Brush your teeth twice a day. And play outside for one hour every day. One of my patients, a boy called Sherzod, ate chips every day. Now he eats an apple at school and he feels much better. Remember: a healthy body is a happy body."
    ].join("\n\n"),
    qs: [
      Q("What is Dr Nodira's job?", "A children's doctor", ["A cook", "A children's doctor", "A teacher"]),
      Q("Apples, carrots and tomatoes have ___.", "vitamins"),
      Q("What is good for your bones and teeth?", "Milk and cheese", ["Chips", "Milk and cheese", "Fizzy drinks"]),
      TF("Fish and eggs help you to grow.", true),
      Q("How many glasses of water should you drink?", "Six", ["Four", "Six", "Eight"]),
      Q("How many spoons of sugar are in a small bottle of fizzy drink?", "About seven", ["About three", "About seven", "About ten"]),
      Q("When is a piece of cake OK?", "On Sunday", ["Every day", "On Sunday", "Never"]),
      TF("Dr Nodira says you must never eat sweets.", false, "She says you can eat sweets sometimes."),
      Q("Brush your teeth ___ a day.", "twice"),
      Q("What does Sherzod eat at school now?", "An apple", ["Chips", "Sweets", "An apple"])
    ]
  },
  {
    topic: "A bakery",
    passage: [
      "My uncle has a small bakery in Namangan. It is called Golden Bread. He gets up at three o'clock every morning, because the bread must be ready at six. My name is Sanjar, and in the summer holidays I help him.",
      "At the bakery, there are three workers. Uncle Karim makes the dough with flour, water, salt and yeast. Mr Olim puts the dough into the big oven. The oven is very hot, and the bread cooks for about twenty minutes. Mrs Gavhar makes cakes and sweet buns with sugar and nuts. The smell is wonderful, and people stand outside the door before we open.",
      "We sell many things. Round bread called non costs three thousand sums. Long white bread costs four thousand sums. A sweet bun costs two thousand sums, and a big chocolate cake costs fifty thousand sums. My job is easy. I put the bread in paper bags and say thank you to the customers. I also clean the tables at the end of the day.",
      "My favourite customer is an old man named Mr Tursun. Every day he buys two non and one bun. He always gives me a small gift, for example a pencil or a sweet. On Fridays, my uncle gives bread to poor families, and he does not take any money. I think my uncle is a very good man. One day I want to have my own bakery too."
    ].join("\n\n"),
    qs: [
      Q("What is the name of the bakery?", "Golden Bread", ["Fresh Bread", "Golden Bread", "Sweet Home"]),
      Q("When does the uncle get up?", "At three o'clock", ["At three o'clock", "At five o'clock", "At six o'clock"]),
      TF("Sanjar helps his uncle in the winter.", false, "He helps in the summer holidays."),
      Q("Who makes the dough?", "Uncle Karim", ["Uncle Karim", "Mr Olim", "Mrs Gavhar"]),
      Q("How long does the bread cook?", "About twenty minutes", ["About ten minutes", "About twenty minutes", "About an hour"]),
      TF("Mrs Gavhar makes cakes and sweet buns.", true),
      Q("How much does long white bread cost?", "Four thousand sums", ["Two thousand sums", "Three thousand sums", "Four thousand sums"]),
      Q("Sanjar puts the bread in paper ___.", "bags"),
      Q("What does Mr Tursun buy every day?", "Two non and one bun", ["One cake", "Two non and one bun", "Three buns"]),
      Q("On Fridays, the uncle gives bread to poor ___.", "families")
    ]
  },
  {
    topic: "A fruit seller",
    passage: [
      "Mr Rahim is a fruit seller. He has a small stall in front of our school in Andijan. He is fifty years old, and he works there every day from eight in the morning to six in the evening. I am Aziza, and I stop at his stall every afternoon.",
      "His stall is always neat and colourful. There are oranges, bananas, pears, plums and big green watermelons. In summer he also has sweet cherries and peaches. Each fruit has a small sign with a price. Bananas cost twelve thousand sums for a kilo, and apples cost eight thousand sums. Mr Rahim says, \"Good fruit is not cheap, but it is worth it.\"",
      "He knows his fruit very well. He can tell if a melon is sweet when he knocks on it. He tells us to wash the fruit before we eat it. He also shows us how to keep bananas fresh. We should put them in a cool and dry place, away from other fruit.",
      "One day it rains very hard, and the street is empty. I see Mr Rahim under a big blue umbrella. He is alone and cold. I run home and ask my mother for a cup of hot tea. I bring it to him. He is very happy and gives me three big red apples for my family. Now we are good friends, and my mother also buys fruit from him every week."
    ].join("\n\n"),
    qs: [
      Q("Where is Mr Rahim's stall?", "In front of the school", ["In the market", "In front of the school", "At the bus station"]),
      Q("How old is Mr Rahim?", "Fifty", ["Forty", "Fifty", "Sixty"]),
      TF("Mr Rahim works until six in the evening.", true),
      Q("In summer he also has sweet cherries and ___.", "peaches"),
      Q("How much do bananas cost for a kilo?", "Twelve thousand sums", ["Eight thousand sums", "Ten thousand sums", "Twelve thousand sums"]),
      TF("Apples cost twelve thousand sums for a kilo.", false, "Apples cost eight thousand sums."),
      Q("How can Mr Rahim tell if a melon is sweet?", "He knocks on it", ["He smells it", "He knocks on it", "He tastes it"]),
      Q("What colour is the umbrella?", "Blue", ["Red", "Green", "Blue"]),
      Q("What does Aziza bring to Mr Rahim?", "A cup of hot tea", ["An apple", "A coat", "A cup of hot tea"]),
      Q("Mr Rahim gives Aziza three big red ___.", "apples")
    ]
  },
  {
    topic: "A gift for mum",
    passage: [
      "Next Sunday is Mother's Day, and I want to buy a gift for my mum. My name is Laylo and I am eleven. I have fifty thousand sums in my money box. I save it for two months. My brother Doniyor says he can come with me to the shopping centre.",
      "On Saturday we take the bus to the centre. It is big and busy, with many shops. First, we look in a flower shop. Red roses are very beautiful, but they cost ten thousand sums for one flower. That is too much. Then we visit a shop for bags. A brown bag is nice, but it costs ninety thousand sums. Doniyor says, \"Mum has two bags already.\"",
      "In the next shop there are scarves. I find a soft green scarf with small white flowers. Green is my mother's favourite colour. The price is forty-five thousand sums. I take it to the shop assistant, and she puts it in a pretty box with a pink ribbon. I also buy a card for five thousand sums, so I have no money left.",
      "On Sunday morning, I make breakfast with Doniyor. We put the box and the card next to her tea. My mother comes in and sees the gift. She opens the box and her eyes are full of tears. She hugs us and says, \"This is the best gift in the world.\" She wears the scarf all day. I learn something important: a gift does not need to be expensive. It needs love."
    ].join("\n\n"),
    qs: [
      Q("How old is Laylo?", "Eleven", ["Ten", "Eleven", "Twelve"]),
      Q("How long does Laylo save her money?", "Two months", ["Two weeks", "Two months", "One year"]),
      Q("On Saturday they take the ___ to the centre.", "bus"),
      Q("How much is one red rose?", "Ten thousand sums", ["Five thousand sums", "Ten thousand sums", "Twenty thousand sums"]),
      Q("What does Doniyor say about the bag?", "Mum has two bags already", ["It is too small", "Mum has two bags already", "It is too dark"]),
      Q("What is the mother's favourite colour?", "Green", ["Pink", "Brown", "Green"]),
      Q("What colour is the ribbon?", "Pink", ["Green", "Pink", "Red"]),
      TF("Laylo has some money left after shopping.", false, "She has no money left."),
      Q("She opens the box and her eyes are full of ___.", "tears"),
      TF("Mum wears the scarf all day.", true)
    ]
  }
];
