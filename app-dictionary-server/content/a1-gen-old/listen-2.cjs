const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'My uncle',
    audioText: "My uncle is called Peter. He is forty years old and he lives in a small house near the sea. He is a baker. Every morning he gets up at four o'clock and makes bread. His shop opens at six. He has two dogs and they sit outside the shop. I visit him every summer and I love his warm bread.",
    qs: [
      Q("What is Peter's job?", 'A baker', ['A teacher', 'A baker', 'A doctor'], 'Peter is a baker.'),
      Q('Where does Peter live?', 'Near the sea', ['In a big city', 'On a farm', 'Near the sea'], 'He lives in a small house near the sea.'),
      Q('How many dogs does he have?', 'Two', ['One', 'Two', 'Three'], 'He has two dogs.'),
      TF("Peter gets up at six o'clock.", false, "He gets up at four o'clock."),
      Q("Peter's shop opens at ___ o'clock.", 'six'),
    ],
  },
  {
    topic: 'A voice message to mum',
    audioText: "Hi Mum, it is Anna. I am at school and I am fine. I have a maths test today, but I am not afraid. After school I am going to Lily's house to do homework. I will be home at six o'clock. Please do not cook for me, I will eat pizza with Lily. I love you. See you tonight. Bye.",
    qs: [
      Q('Where is Anna now?', 'At school', ['At home', 'At school', 'At the park'], 'She says she is at school.'),
      Q('What test does Anna have?', 'A maths test', ['An English test', 'A maths test', 'A music test'], 'She has a maths test.'),
      Q('Whose house will Anna visit?', "Lily's house", ["Lily's house", "Her uncle's house", "Her teacher's house"], "She is going to Lily's house."),
      TF("Anna will be home at five o'clock.", false, "She will be home at six o'clock."),
      Q('Anna will eat ___ with Lily.', 'pizza'),
    ],
  },
  {
    topic: 'Ordering coffee and cake',
    audioText: "Good morning. Can I have a coffee with milk, please? Of course. Would you like a cake too? Yes, I would like a piece of chocolate cake. That is four pounds fifty. Do you want to sit inside or outside? Outside, please, because the sun is warm today. Here is your coffee. I will bring the cake in a minute. Thank you very much.",
    qs: [
      Q('What drink does the customer order?', 'Coffee with milk', ['Tea with milk', 'Coffee with milk', 'Orange juice'], 'She orders a coffee with milk.'),
      Q('Which cake does the customer want?', 'Chocolate cake', ['Apple cake', 'Chocolate cake', 'Carrot cake'], 'She wants chocolate cake.'),
      Q('Where does the customer sit?', 'Outside', ['Outside', 'Inside', 'At the bar'], 'She sits outside.'),
      TF('The coffee and cake cost five pounds.', false, 'They cost four pounds fifty.'),
      Q('The sun is ___ today.', 'warm'),
    ],
  },
  {
    topic: 'Bank opening hours',
    audioText: "Welcome to City Bank. Our bank is open from Monday to Friday. On those days we open at nine o'clock in the morning and close at five in the afternoon. On Saturday we open at ten and close at one. We are closed on Sunday. You can use our machine at any time, day or night. Thank you for calling.",
    qs: [
      Q('When does the bank open from Monday to Friday?', 'At nine', ['At eight', 'At nine', 'At ten'], "It opens at nine o'clock."),
      Q('When does the bank close on Saturday?', 'At one', ['At one', 'At five', 'At six'], 'It closes at one.'),
      Q('What about Sunday?', 'The bank is closed', ['It is open all day', 'It opens at ten', 'The bank is closed'], 'The bank is closed on Sunday.'),
      TF('You can use the machine only in the daytime.', false, 'You can use it day or night.'),
      Q('On weekdays the bank closes at ___ in the afternoon.', 'five'),
    ],
  },
  {
    topic: 'A lost bag',
    audioText: "Excuse me, I have lost my bag. It is a small blue bag with a long strap. I left it on the train this morning. My name is Tom Brown. In the bag there are my keys, a book and a red umbrella. My phone number is on the bag. Can you look for it, please? I will wait here for an hour.",
    qs: [
      Q('What colour is the bag?', 'Blue', ['Red', 'Blue', 'Black'], 'It is a blue bag.'),
      Q('Where did Tom leave the bag?', 'On the train', ['On the bus', 'In a shop', 'On the train'], 'He left it on the train.'),
      Q('What is in the bag?', 'A red umbrella', ['A laptop', 'A red umbrella', 'A hat'], 'There is a red umbrella.'),
      TF("Tom's phone number is on the bag.", true),
      Q('Tom will wait here for one ___.', 'hour'),
    ],
  },
  {
    topic: "A teacher's message",
    audioText: "Hello class, this is Mrs Green. There is no school on Friday because the teachers have a meeting. Please do your English homework on page twenty. Read the story and write five new words. On Monday we have a spelling test. Please bring your books and a pen. Have a nice weekend. See you on Monday.",
    qs: [
      Q('Which day is there no school?', 'Friday', ['Monday', 'Friday', 'Saturday'], 'There is no school on Friday.'),
      Q('Which page is the homework on?', 'Page twenty', ['Page five', 'Page twelve', 'Page twenty'], 'The homework is on page twenty.'),
      Q('What do the students have on Monday?', 'A spelling test', ['A spelling test', 'A trip', 'A party'], 'They have a spelling test on Monday.'),
      TF('The spelling test is on Friday.', false, 'The test is on Monday.'),
      Q('Students must write five new ___.', 'words'),
    ],
  },
  {
    topic: 'Meeting at the park',
    audioText: "Hi Sam, it is Julia. Let's meet at the park on Saturday afternoon. I will be at the big tree near the lake at three o'clock. Please bring a ball and some water. Maria and her brother are coming too. We can play football and then eat ice cream. If it rains, we will meet at my house. Call me tonight.",
    qs: [
      Q('Where will they meet?', 'At the big tree near the lake', ['At the school gate', 'At the big tree near the lake', 'At the cafe'], 'They meet at the big tree near the lake.'),
      Q('What time will they meet?', 'At three', ['At two', 'At three', 'At four'], "They meet at three o'clock."),
      Q('What should Sam bring?', 'A ball and water', ['A ball and water', 'A book and a pen', 'A camera'], 'He should bring a ball and some water.'),
      TF('If it rains, they will still meet at the park.', false, "They will meet at Julia's house."),
      Q('Maria and her ___ are coming too.', 'brother'),
    ],
  },
  {
    topic: 'The price of a jacket',
    audioText: "Excuse me, how much is this jacket? It is forty pounds. Oh, that is a little expensive. Do you have a cheaper one? Yes, this green jacket is thirty pounds. I like it. Do you have it in a smaller size? Yes, here is a small one. Great, I will take it. Do you want a bag? No, thank you. I can pay by card.",
    qs: [
      Q('How much is the first jacket?', 'Forty pounds', ['Thirty pounds', 'Forty pounds', 'Fifty pounds'], 'It is forty pounds.'),
      Q('How much is the green jacket?', 'Thirty pounds', ['Thirty pounds', 'Twenty pounds', 'Forty pounds'], 'The green jacket is thirty pounds.'),
      Q('Which size does the customer take?', 'Small', ['Small', 'Medium', 'Large'], 'She takes a small one.'),
      TF('The customer wants a bag.', false, 'She says no, thank you.'),
      Q('The customer will pay by ___.', 'card'),
    ],
  },
  {
    topic: 'My weekend timetable',
    audioText: "This is my weekend timetable. On Saturday morning I play tennis with my friend Ben. At twelve o'clock we have lunch at a cafe. In the afternoon I clean my room and do my homework. On Saturday evening I watch a film. On Sunday I get up late and visit my grandmother. We cook dinner together at six.",
    qs: [
      Q('What does the speaker do on Saturday morning?', 'Plays tennis', ['Plays tennis', 'Goes shopping', 'Cleans the room'], 'He plays tennis with Ben.'),
      Q('What does the speaker do on Saturday evening?', 'Watches a film', ['Does homework', 'Watches a film', 'Plays football'], 'He watches a film.'),
      Q('Who does the speaker visit on Sunday?', 'His grandmother', ['His uncle', 'His friend Ben', 'His grandmother'], 'He visits his grandmother.'),
      TF("They have lunch at one o'clock.", false, "They have lunch at twelve o'clock."),
      Q('They cook dinner together at ___.', 'six'),
    ],
  },
  {
    topic: 'Weather report for tomorrow',
    audioText: "Here is the weather for tomorrow. In the morning it will be cloudy and cold, about five degrees. In the afternoon the sun will come out and it will be warmer, about ten degrees. In the evening there will be rain, so take an umbrella. The wind will be strong near the sea. Have a good day.",
    qs: [
      Q('What is the weather in the morning?', 'Cloudy and cold', ['Sunny and hot', 'Cloudy and cold', 'Rainy and warm'], 'It will be cloudy and cold.'),
      Q('What is the weather in the evening?', 'Rain', ['Snow', 'Sun', 'Rain'], 'There will be rain.'),
      Q('What should you take?', 'An umbrella', ['A hat', 'An umbrella', 'Sun cream'], 'Take an umbrella.'),
      TF('The wind will be strong in the city centre.', false, 'The wind will be strong near the sea.'),
      Q('In the afternoon it will be about ___ degrees.', 'ten'),
    ],
  },
  {
    topic: 'A bus time',
    audioText: "Excuse me, when is the next bus to the city centre? The next bus is at ten past nine. That is in five minutes. How much is the ticket? It is two pounds. You can buy it from the driver. Which stop? Stop number four, across the road. Thank you. The bus is red, and it is number twelve.",
    qs: [
      Q('When is the next bus?', 'Ten past nine', ["Nine o'clock", 'Ten past nine', 'Half past nine'], 'The bus is at ten past nine.'),
      Q('How much is the ticket?', 'Two pounds', ['One pound', 'Two pounds', 'Five pounds'], 'The ticket is two pounds.'),
      Q('Which stop is it?', 'Stop four', ['Stop two', 'Stop four', 'Stop twelve'], 'It is stop number four.'),
      TF('The bus is blue.', false, 'The bus is red.'),
      Q('The bus is number ___.', 'twelve'),
    ],
  },
  {
    topic: 'A party invitation',
    audioText: "Hello Karen, I am having a birthday party on Saturday. I will be ten years old. The party is at my house at four o'clock. We will eat pizza and cake, and we will play games. Please wear a funny hat. Please tell my mum by Thursday if you can come. I hope to see you there. Love, Ali.",
    qs: [
      Q('Which day is the party?', 'Saturday', ['Friday', 'Saturday', 'Sunday'], 'The party is on Saturday.'),
      Q('What time does the party start?', 'At four', ['At two', 'At three', 'At four'], "It starts at four o'clock."),
      Q('What should Karen wear?', 'A funny hat', ['A funny hat', 'A white shirt', 'A warm coat'], 'She should wear a funny hat.'),
      TF('The party is at the park.', false, "The party is at Ali's house."),
      Q('Ali will be ___ years old.', 'ten'),
    ],
  },
  {
    topic: 'Buying vegetables',
    audioText: "Good morning. I would like one kilo of potatoes, please. Here you are. Anything else? Yes, three tomatoes and two onions. Do you have carrots? Yes, they are very fresh today. I will take five carrots. That is six pounds in total. Here is ten pounds. Your change is four pounds. Have a nice day.",
    qs: [
      Q('How many potatoes does she buy?', 'One kilo', ['One kilo', 'Two kilos', 'Five kilos'], 'She buys one kilo of potatoes.'),
      Q('How many tomatoes does she buy?', 'Three', ['Two', 'Three', 'Five'], 'She buys three tomatoes.'),
      Q('What is the total price?', 'Six pounds', ['Four pounds', 'Six pounds', 'Ten pounds'], 'The total is six pounds.'),
      TF('The carrots are not fresh.', false, 'The carrots are very fresh.'),
      Q('She buys five ___.', 'carrots'),
    ],
  },
  {
    topic: 'My bedroom',
    audioText: "This is my bedroom. It is small but I like it. There is a bed next to the window and a brown desk in the corner. On the desk there is a lamp and my computer. My clothes are in a big wardrobe. On the wall there are three pictures of animals. I read books on my bed every night.",
    qs: [
      Q('Where is the bed?', 'Next to the window', ['Next to the door', 'Next to the window', 'In the corner'], 'The bed is next to the window.'),
      Q('What is on the desk?', 'A lamp and a computer', ['A lamp and a computer', 'Books and a clock', 'A cat'], 'There is a lamp and a computer.'),
      Q('What are the pictures of?', 'Animals', ['Flowers', 'Animals', 'Cars'], 'The pictures are of animals.'),
      TF('The wardrobe is small.', false, 'The wardrobe is big.'),
      Q('There are ___ pictures on the wall.', 'three'),
    ],
  },
  {
    topic: 'My pets',
    audioText: "I have three pets. I have a black cat called Milo, a small white rabbit called Snow and a goldfish. Milo likes to sleep on the sofa. Snow eats carrots and lettuce. The goldfish lives in a bowl in the kitchen. I feed my pets every morning before school. My sister helps me at the weekend. I love them very much.",
    qs: [
      Q("What is the cat's name?", 'Milo', ['Snow', 'Milo', 'Max'], 'The cat is called Milo.'),
      Q('What does the rabbit eat?', 'Carrots and lettuce', ['Fish', 'Carrots and lettuce', 'Bread'], 'Snow eats carrots and lettuce.'),
      Q('Where does the goldfish live?', 'In the kitchen', ['In the garden', 'In the bedroom', 'In the kitchen'], 'The goldfish lives in the kitchen.'),
      TF('Milo sleeps on the bed.', false, 'Milo sleeps on the sofa.'),
      Q('Milo is a ___ cat.', 'black'),
    ],
  },
  {
    topic: 'A swimming pool rule',
    audioText: "Welcome to the city swimming pool. Please listen to the rules. First, take a shower before you swim. Second, do not run near the water. Children under eight must have an adult with them. You cannot eat food in the pool area. The pool closes at eight o'clock. Please keep our pool clean and have fun.",
    qs: [
      Q('Who must children under eight have with them?', 'An adult', ['A teacher', 'An adult', 'A friend'], 'They must have an adult.'),
      Q('What can you not do in the pool area?', 'Eat food', ['Swim', 'Eat food', 'Talk'], 'You cannot eat food there.'),
      Q('When does the pool close?', 'At eight', ['At six', 'At seven', 'At eight'], "It closes at eight o'clock."),
      TF('You can run near the water.', false, 'You must not run near the water.'),
      Q('You must take a ___ before you swim.', 'shower'),
    ],
  },
  {
    topic: 'At the airport desk',
    audioText: "Good afternoon. Can I see your passport, please? Here you are. You are flying to Rome, and the flight leaves at two thirty. Do you have any bags? Yes, one big suitcase. Please put it here. Your seat is next to the window. Go to gate five. Boarding starts at two o'clock. Enjoy your flight.",
    qs: [
      Q('Where is the passenger flying to?', 'Rome', ['Paris', 'Rome', 'London'], 'She is flying to Rome.'),
      Q('Where is her seat?', 'Next to the window', ['Next to the door', 'Next to the window', 'At the back'], 'Her seat is next to the window.'),
      Q('Which gate must she go to?', 'Gate five', ['Gate three', 'Gate five', 'Gate nine'], 'She must go to gate five.'),
      TF("The flight leaves at two o'clock.", false, 'Boarding starts at two; the flight leaves at two thirty.'),
      Q('She has one big ___.', 'suitcase'),
    ],
  },
  {
    topic: 'A dinner order',
    audioText: "Are you ready to order? Yes, I would like the chicken soup, please. And for the main dish? I would like fish with rice. What would you like to drink? Water for me, and an orange juice for my daughter. Would you like dessert? Not now, thank you. Maybe later. Your food will come in ten minutes.",
    qs: [
      Q('What soup does the man order?', 'Chicken soup', ['Tomato soup', 'Chicken soup', 'Fish soup'], 'He orders chicken soup.'),
      Q('What is his main dish?', 'Fish with rice', ['Fish with rice', 'Chicken with potatoes', 'Pasta'], 'He orders fish with rice.'),
      Q('What does his daughter drink?', 'Orange juice', ['Water', 'Milk', 'Orange juice'], 'His daughter has orange juice.'),
      TF('They order dessert now.', false, 'They say maybe later.'),
      Q('The food will come in ___ minutes.', 'ten'),
    ],
  },
  {
    topic: 'A music club',
    audioText: "Do you like music? Join our school music club. We meet every Wednesday after school in room six. You can play the guitar, the piano or the drums, or you can sing. Our teacher is Mr Lopez. He is very kind. The club is free. We have a concert in June. Come and make new friends.",
    qs: [
      Q('When does the club meet?', 'On Wednesday', ['On Monday', 'On Wednesday', 'On Friday'], 'It meets every Wednesday.'),
      Q('Which room is it?', 'Room six', ['Room two', 'Room six', 'Room ten'], 'It is room six.'),
      Q('Who is the teacher?', 'Mr Lopez', ['Mr Lopez', 'Mrs Green', 'Mr Brown'], 'The teacher is Mr Lopez.'),
      TF('The club costs money.', false, 'The club is free.'),
      Q('The concert is in ___.', 'june'),
    ],
  },
  {
    topic: 'A message about a test',
    audioText: "Hi Dan, it is Emma. Do you remember the English test tomorrow? It is at nine o'clock in room eight. We must study unit five, the words about food and family. I am studying at the library now. Do you want to come? Bring a pencil and a dictionary. After the test, let's have lunch together. Call me back.",
    qs: [
      Q('Which room is the test in?', 'Room eight', ['Room five', 'Room eight', 'Room nine'], 'The test is in room eight.'),
      Q('Which unit must they study?', 'Unit five', ['Unit three', 'Unit five', 'Unit eight'], 'They must study unit five.'),
      Q('What are the words about?', 'Food and family', ['Food and family', 'Sport and music', 'Travel and weather'], 'The words are about food and family.'),
      TF('Emma is studying at home.', false, 'She is at the library.'),
      Q('Dan should bring a pencil and a ___.', 'dictionary'),
    ],
  },
  {
    topic: 'A hotel booking for two nights',
    audioText: "Hello, I would like to book a room for two nights, please. For which days? From Friday to Sunday. For how many people? Two adults. We have a double room with a bathroom. It is eighty pounds a night. Breakfast is included and it is from seven to ten. Great, my name is Laura Smith. Thank you, your room is ready.",
    qs: [
      Q('How many nights does Laura want?', 'Two', ['One', 'Two', 'Three'], 'She wants two nights.'),
      Q('What kind of room is it?', 'A double room with a bathroom', ['A single room', 'A double room with a bathroom', 'A family room'], 'It is a double room with a bathroom.'),
      Q('How much is the room for one night?', 'Eighty pounds', ['Fifty pounds', 'Eighty pounds', 'One hundred pounds'], 'It is eighty pounds a night.'),
      TF('Breakfast is not included.', false, 'Breakfast is included.'),
      Q('They will arrive on ___.', 'friday'),
    ],
  },
  {
    topic: 'The way to the bank',
    audioText: "Excuse me, where is the bank? Go straight along this street. Turn left at the traffic lights. The bank is next to the post office, on your right. Is it far? No, it is five minutes on foot. Thank you. You are welcome. Look for a big grey building with a green door.",
    qs: [
      Q('Where do you turn left?', 'At the traffic lights', ['At the traffic lights', 'At the school', 'At the park'], 'Turn left at the traffic lights.'),
      Q('What is next to the bank?', 'The post office', ['The cafe', 'The post office', 'The library'], 'The bank is next to the post office.'),
      Q('How long does it take on foot?', 'Five minutes', ['Two minutes', 'Five minutes', 'Ten minutes'], 'It takes five minutes.'),
      TF('You must turn right at the lights.', false, 'You must turn left.'),
      Q('The bank has a ___ door.', 'green'),
    ],
  },
  {
    topic: 'My grandfather',
    audioText: "My grandfather is seventy-five years old. His name is George. He has white hair and wears glasses. He was a train driver, but now he does not work. Every day he walks in the garden and grows flowers. On Sundays he cooks soup for the family. He tells wonderful stories, and I listen to him for hours.",
    qs: [
      Q('How old is George?', 'Seventy-five', ['Sixty-five', 'Seventy-five', 'Eighty-five'], 'He is seventy-five.'),
      Q('What was his job?', 'A train driver', ['A teacher', 'A train driver', 'A farmer'], 'He was a train driver.'),
      Q('What does he cook on Sundays?', 'Soup', ['Soup', 'Fish', 'Cake'], 'He cooks soup on Sundays.'),
      TF('George has black hair.', false, 'He has white hair.'),
      Q('He grows ___ in the garden.', 'flowers'),
    ],
  },
  {
    topic: 'A Sunday plan',
    audioText: "On Sunday I want to relax. I will get up at nine and have a big breakfast with eggs. Then I will go to the market with my sister to buy fruit. In the afternoon we will visit our cousins and play cards. In the evening I will call my friend Nina and prepare my bag for school. I like quiet Sundays.",
    qs: [
      Q('What will she have for breakfast?', 'Eggs', ['Eggs', 'Cereal', 'Pancakes'], 'She will have eggs.'),
      Q('Who will she go to the market with?', 'Her sister', ['Her mother', 'Her sister', 'Nina'], 'She will go with her sister.'),
      Q('What will they do in the afternoon?', 'Visit their cousins', ['Visit their cousins', 'Go swimming', 'Watch a film'], 'They will visit their cousins.'),
      TF('She will buy fruit at the supermarket.', false, 'She will buy fruit at the market.'),
      Q("She will get up at ___ o'clock.", 'nine'),
    ],
  },
];
