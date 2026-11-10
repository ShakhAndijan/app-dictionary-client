const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'Introducing myself',
    audioText: "Hello, my name is Anna. I am twelve years old. I am from Poland, but now I live in London with my mum, my dad and my little brother. I am a student. I like music and I play the guitar every day. My favourite colour is green. I have a dog and his name is Max. Nice to meet you!",
    qs: [
      Q('Where does Anna live now?', 'London', ['Warsaw', 'London', 'Paris']),
      Q('What does Anna play every day?', 'the guitar', ['the piano', 'the guitar', 'the drums']),
      Q('What is her favourite colour?', 'green', ['blue', 'red', 'green']),
      TF('Anna has a cat.', false, 'Anna has a dog.'),
      Q("The dog's name is ___", 'max'),
    ],
  },
  {
    topic: 'A phone call to a friend',
    audioText: "Hi Tom, it is Lucy. Are you at home? I am at the market with my sister. We want to go to the park at three o'clock. Do you want to come with us? Please bring your ball. Call me back before two o'clock. My number is the same as before. See you later, bye!",
    qs: [
      Q('Who is Lucy with?', 'her sister', ['her mother', 'her sister', 'her teacher']),
      Q('What time do they go to the park?', "three o'clock", ["four o'clock", "three o'clock", "five o'clock"]),
      Q('What should Tom bring?', 'a ball', ['a book', 'a bag', 'a ball']),
      TF('Lucy is at home.', false, 'Lucy is at the market.'),
      Q("Tom must call Lucy before ___ o'clock.", 'two'),
    ],
  },
  {
    topic: 'Ordering tea',
    audioText: "Good morning. Can I have a cup of tea, please? Yes, of course. Black or with milk? With milk, please, and one sugar. Would you like something to eat? Yes, I would like a small cake. That is three pounds, please. Here you are. Thank you very much. Enjoy your tea!",
    qs: [
      Q('How does the customer take his tea?', 'with milk', ['black', 'with lemon', 'with milk']),
      Q('What does he want to eat?', 'a cake', ['a sandwich', 'a cake', 'an apple']),
      Q('How much is it?', 'three pounds', ['two pounds', 'five pounds', 'three pounds']),
      TF('The man drinks his tea black.', false, 'He wants his tea with milk.'),
      Q('He wants milk and one ___ in his tea.', 'sugar'),
    ],
  },
  {
    topic: 'Shop opening times',
    audioText: "Welcome to Green Street Books. We are open from Monday to Saturday. In the week, we open at nine o'clock and close at six o'clock. On Saturday we close early, at four o'clock. We are closed on Sunday. Children's books are on the first floor. Today all children's books are two pounds. Thank you for shopping with us.",
    qs: [
      Q('When does the shop close in the week?', "at six o'clock", ["at six o'clock", "at four o'clock", "at nine o'clock"]),
      Q('When does the shop close on Saturday?', "at four o'clock", ["at five o'clock", "at six o'clock", "at four o'clock"]),
      Q("Where are the children's books?", 'on the first floor', ['on the ground floor', 'on the first floor', 'on the second floor']),
      TF('The shop is open on Sunday.', false, 'The shop is closed on Sunday.'),
      Q("Today children's books are ___ pounds.", 'two'),
    ],
  },
  {
    topic: 'A lost cat',
    audioText: "Hello, I am looking for my cat. She is small and white with a black tail. Her name is Lily. She is two years old. I lost her yesterday near the school. She is very friendly and she likes fish. If you see her, please call me. My name is Mrs Brown. I am very sad without her.",
    qs: [
      Q('What colour is the cat?', 'white', ['black', 'white', 'brown']),
      Q('Where did Mrs Brown lose her cat?', 'near the school', ['near the park', 'near the shop', 'near the school']),
      Q('What does the cat like?', 'fish', ['milk', 'meat', 'fish']),
      TF('Lily is five years old.', false, 'Lily is two years old.'),
      Q('Lily has a ___ tail.', 'black'),
    ],
  },
  {
    topic: 'A school announcement',
    audioText: "Good morning, students. This is an announcement. Tomorrow is a special day. There is no maths class in the morning. Instead, we have a sports day on the football field. Please wear your sports clothes and bring a bottle of water. The day starts at nine o'clock. Lunch is at twelve. Please be on time. Thank you.",
    qs: [
      Q('Which class is not on tomorrow?', 'maths', ['English', 'maths', 'art']),
      Q('Where is the sports day?', 'on the football field', ['in the hall', 'in the gym', 'on the football field']),
      Q('What should students bring?', 'a bottle of water', ['a bottle of water', 'a book', 'their lunch']),
      TF("Lunch is at one o'clock.", false, 'Lunch is at twelve.'),
      Q("The day starts at ___ o'clock.", 'nine'),
    ],
  },
  {
    topic: 'Meeting at the cinema',
    audioText: "Hi Ben, are you free tonight? Let us go to the cinema. The film starts at seven thirty. Meet me in front of the cinema at seven o'clock. I have the tickets. They are eight pounds each. We can buy popcorn there. Bring your friend Sam too, if you like. It is a funny film about a dog. See you tonight!",
    qs: [
      Q('What time does the film start?', 'seven thirty', ['seven thirty', "eight o'clock", "seven o'clock"]),
      Q('Where do they meet?', 'in front of the cinema', ['at the bus stop', 'at her house', 'in front of the cinema']),
      Q('What is the film about?', 'a dog', ['a car', 'a boy', 'a dog']),
      TF('The tickets are ten pounds each.', false, 'The tickets are eight pounds each.'),
      Q('They can buy ___ at the cinema.', 'popcorn'),
    ],
  },
  {
    topic: 'Asking the price of shoes',
    audioText: "Excuse me, how much are these shoes? They are forty pounds. Oh, that is expensive. Do you have a cheaper pair? Yes, these brown shoes are twenty five pounds. What size are they? They are size five. Do you have size six? Yes, here you are. Great, I will take them. Can I pay by card? Yes, you can.",
    qs: [
      Q('How much are the first shoes?', 'forty pounds', ['forty pounds', 'twenty pounds', 'fifty pounds']),
      Q('How much are the brown shoes?', 'twenty five pounds', ['fifteen pounds', 'twenty five pounds', 'thirty pounds']),
      Q('How does the woman pay?', 'by card', ['by cash', 'by phone', 'by card']),
      TF('The woman buys size five.', false, 'She wants size six.'),
      Q('She wants size ___.', 'six'),
    ],
  },
  {
    topic: 'My daily timetable',
    audioText: "I get up at seven o'clock every day. I have breakfast at half past seven. I go to school by bus at eight. School starts at nine and finishes at three. After school I do my homework. I have dinner with my family at six. In the evening I watch television for one hour. I go to bed at ten o'clock.",
    qs: [
      Q('When does he get up?', "at seven o'clock", ["at six o'clock", "at seven o'clock", "at eight o'clock"]),
      Q('How does he go to school?', 'by bus', ['by bus', 'by car', 'on foot']),
      Q('When does he have dinner?', "at six o'clock", ["at five o'clock", "at seven o'clock", "at six o'clock"]),
      TF('School finishes at four.', false, 'School finishes at three.'),
      Q("He goes to bed at ___ o'clock.", 'ten'),
    ],
  },
  {
    topic: 'A weather report',
    audioText: "Good morning, here is the weather for today. It is cold and windy in the north. In the south it is sunny and warm, with twenty degrees. In the east it is rainy all day, so take an umbrella. In the afternoon it is cloudy in the west. Tomorrow will be sunnier. Have a nice day!",
    qs: [
      Q('What is the weather like in the south?', 'sunny and warm', ['rainy', 'sunny and warm', 'cold and windy']),
      Q('What is the weather like in the east?', 'rainy', ['rainy', 'cloudy', 'sunny']),
      Q('What should you take in the east?', 'an umbrella', ['a hat', 'an umbrella', 'a coat']),
      TF('It is warm in the north.', false, 'It is cold and windy in the north.'),
      Q('In the afternoon it is ___ in the west.', 'cloudy'),
    ],
  },
  {
    topic: 'A train time',
    audioText: "Attention, please. The train to Manchester leaves from platform four at ten fifteen. It is a fast train. The next train is at eleven fifteen. Please do not forget your bags. A ticket is twelve pounds. You can buy a ticket at the machine or at the desk. Thank you for travelling with us.",
    qs: [
      Q('Which platform is the train to Manchester?', 'platform four', ['platform two', 'platform four', 'platform six']),
      Q('What time does the train leave?', 'ten fifteen', ['ten fifteen', 'eleven fifteen', 'ten thirty']),
      Q('How much is a ticket?', 'twelve pounds', ['ten pounds', 'twelve pounds', 'twenty pounds']),
      TF('The next train is at twelve fifteen.', false, 'The next train is at eleven fifteen.'),
      Q('The train goes to ___.', 'manchester'),
    ],
  },
  {
    topic: 'A birthday invitation',
    audioText: "Hello everyone! It is my birthday on Saturday. I am ten years old. I have a party at my house at four o'clock. We will have cake, games and pizza. Please bring a small present, not a big one. Call my mum if you can come. Her name is Julia. I hope you can come!",
    qs: [
      Q('How old is the speaker?', 'ten', ['nine', 'ten', 'twelve']),
      Q('What day is the party?', 'Saturday', ['Sunday', 'Friday', 'Saturday']),
      Q('What time is the party?', "four o'clock", ["four o'clock", "five o'clock", "three o'clock"]),
      TF('Guests should bring a big present.', false, 'Guests should bring a small present.'),
      Q("Guests should call the speaker's ___.", 'mum'),
    ],
  },
  {
    topic: 'Buying fruit',
    audioText: "Good afternoon. I would like some fruit, please. Of course. We have apples, bananas and oranges today. Apples are two pounds a kilo. Bananas are one pound. I want two kilos of apples and one kilo of bananas. Anything else? Yes, five oranges, please. That is eight pounds. Here is ten pounds. Your change is two pounds.",
    qs: [
      Q('How much are apples for one kilo?', 'two pounds', ['one pound', 'two pounds', 'three pounds']),
      Q('How many kilos of apples does she buy?', 'two', ['one', 'two', 'five']),
      Q('How much is the total?', 'eight pounds', ['ten pounds', 'eight pounds', 'two pounds']),
      TF('Her change is three pounds.', false, 'Her change is two pounds.'),
      Q('She also buys five ___.', 'oranges'),
    ],
  },
  {
    topic: 'My new flat',
    audioText: "I have a new flat. It is on the third floor, so there is a lift. It has two bedrooms, a small kitchen and a bathroom. The living room is big and bright. I have a balcony with flowers. My bedroom is blue. The flat is near the metro station, so it is easy to get to work. I love my new home.",
    qs: [
      Q('Which floor is the flat on?', 'the third floor', ['the first floor', 'the third floor', 'the fifth floor']),
      Q('How many bedrooms are there?', 'two', ['one', 'three', 'two']),
      Q('What colour is the bedroom?', 'blue', ['blue', 'green', 'white']),
      TF('The flat is far from the metro station.', false, 'The flat is near the metro station.'),
      Q('The balcony has ___.', 'flowers'),
    ],
  },
  {
    topic: 'A family photo',
    audioText: "This is a photo of my family. This is my father, Peter. He is a doctor. Next to him is my mother, Sara. She is a teacher. These are my two sisters. They are twins and they are six. The old man is my grandfather. He is seventy. We are at the beach in this photo. It is a sunny day.",
    qs: [
      Q("What is the father's job?", 'doctor', ['teacher', 'doctor', 'driver']),
      Q("What is the mother's job?", 'teacher', ['teacher', 'nurse', 'doctor']),
      Q('Where is the family in the photo?', 'at the beach', ['at home', 'in a park', 'at the beach']),
      TF('The twin sisters are ten years old.', false, 'They are six years old.'),
      Q('The grandfather is ___.', 'seventy'),
    ],
  },
  {
    topic: 'A library rule',
    audioText: "Welcome to the city library. Please read the rules. You can take five books home. You must bring them back after two weeks. Please be quiet in the library, because people are reading. You cannot eat or drink here. You can use the computers for one hour. The library is open every day, except Monday. Thank you.",
    qs: [
      Q('How many books can you take home?', 'five', ['two', 'five', 'ten']),
      Q('When must you bring the books back?', 'after two weeks', ['after one week', 'after two weeks', 'after a month']),
      Q('Which day is the library closed?', 'Monday', ['Sunday', 'Monday', 'Saturday']),
      TF('You can eat in the library.', false, 'You cannot eat or drink in the library.'),
      Q('You can use the computers for one ___.', 'hour'),
    ],
  },
  {
    topic: 'At the bus station',
    audioText: "Excuse me, which bus goes to the airport? It is bus number twenty two. Where is the bus stop? It is over there, next to the cafe. How often does the bus come? Every ten minutes. How much is a ticket? It is three pounds. You can pay the driver. Thank you very much. You are welcome. Have a good trip!",
    qs: [
      Q('Which bus goes to the airport?', 'number twenty two', ['number twelve', 'number twenty two', 'number thirty']),
      Q('Where is the bus stop?', 'next to the cafe', ['next to the cafe', 'next to the bank', 'next to the shop']),
      Q('How much is a ticket?', 'three pounds', ['two pounds', 'three pounds', 'ten pounds']),
      TF('The bus comes every twenty minutes.', false, 'The bus comes every ten minutes.'),
      Q('You can pay the ___.', 'driver'),
    ],
  },
  {
    topic: 'A lunch order',
    audioText: "Hello, I would like to order lunch, please. I would like a chicken sandwich and a salad. Anything to drink? A glass of orange juice, please. Would you like soup too? No, thank you, but I would like an ice cream. Is that to eat here? No, to take away. That is eleven pounds. Your lunch is ready in ten minutes.",
    qs: [
      Q('What kind of sandwich does she order?', 'chicken', ['cheese', 'chicken', 'egg']),
      Q('What does she drink?', 'orange juice', ['orange juice', 'tea', 'water']),
      Q('What sweet food does she order?', 'ice cream', ['a cake', 'ice cream', 'fruit']),
      TF('She eats her lunch in the cafe.', false, 'It is to take away.'),
      Q('The lunch is ready in ten ___.', 'minutes'),
    ],
  },
  {
    topic: 'A sports club',
    audioText: "Welcome to the Sunshine Sports Club. We have football, tennis and swimming. Football is on Tuesday and Thursday at five o'clock. Tennis is on Wednesday. Swimming is every morning at seven. It costs ten pounds a month. You need sports shoes and a towel. Our teacher is Mr Green. He is very kind. Come and join us today!",
    qs: [
      Q('When is football?', 'Tuesday and Thursday', ['Monday and Friday', 'Tuesday and Thursday', 'Wednesday']),
      Q('What time is swimming?', 'seven in the morning', ['seven in the morning', 'five in the evening', 'nine in the morning']),
      Q('How much is the club?', 'ten pounds a month', ['five pounds a month', 'ten pounds a month', 'ten pounds a week']),
      TF('Tennis is on Friday.', false, 'Tennis is on Wednesday.'),
      Q('The teacher is Mr ___.', 'green'),
    ],
  },
  {
    topic: 'A message about homework',
    audioText: "Hi Emma, it is Jack. Do we have homework today? I think we have to read page twelve in our English book. We also have to write five sentences about our family. The homework is for Friday. The maths homework is easy this time. Please send me a message if you have a different answer. Thanks a lot. See you at school tomorrow!",
    qs: [
      Q('Which page must they read?', 'page twelve', ['page two', 'page twelve', 'page twenty']),
      Q('How many sentences must they write?', 'five', ['three', 'five', 'ten']),
      Q('When is the homework for?', 'Friday', ['Monday', 'Friday', 'Sunday']),
      TF('The maths homework is hard.', false, 'The maths homework is easy.'),
      Q('The book is for ___ class.', 'english'),
    ],
  },
  {
    topic: 'A hotel booking',
    audioText: "Good evening. I have a room for tonight. My name is Mr Lee. Yes, Mr Lee. A single room for one night. It is room two zero five on the second floor. The price is sixty pounds with breakfast. Breakfast is from seven to ten in the restaurant. Here is your key. Check out is at eleven o'clock tomorrow. Enjoy your stay.",
    qs: [
      Q('How many nights does Mr Lee stay?', 'one night', ['one night', 'two nights', 'three nights']),
      Q('How much is the room?', 'sixty pounds', ['fifty pounds', 'sixty pounds', 'seventy pounds']),
      Q('When does breakfast start?', 'at seven', ['at six', 'at seven', 'at ten']),
      TF("Check out is at ten o'clock.", false, "Check out is at eleven o'clock."),
      Q('The room is on the ___ floor.', 'second'),
    ],
  },
  {
    topic: 'Asking the way to the park',
    audioText: "Excuse me, where is the park? Go straight on this street. Turn left at the bank. Then turn right at the traffic lights. The park is on your left, next to the big school. It is about ten minutes on foot. Is it far? No, it is not far. Thank you so much. No problem. Have a nice day!",
    qs: [
      Q('Where do you turn left?', 'at the bank', ['at the bank', 'at the school', 'at the shop']),
      Q('Where do you turn right?', 'at the traffic lights', ['at the park', 'at the traffic lights', 'at the cafe']),
      Q('What is the park next to?', 'the school', ['the bank', 'the cafe', 'the school']),
      TF('The park is very far.', false, 'It is not far.'),
      Q('The park is about ten ___ on foot.', 'minutes'),
    ],
  },
  {
    topic: 'My best friend',
    audioText: "My best friend is Carlos. He is eleven years old and he lives next to me. He is tall and has short black hair. He is funny and very kind. We go to the same school. We play football together every weekend. His favourite food is pasta. He has a big family: three brothers and one sister. I like him a lot.",
    qs: [
      Q('Where does Carlos live?', 'next to the speaker', ['far away', 'next to the speaker', 'in another city']),
      Q('What is his hair like?', 'short and black', ['long and brown', 'short and black', 'short and red']),
      Q('What is his favourite food?', 'pasta', ['pizza', 'rice', 'pasta']),
      TF('Carlos has two sisters.', false, 'He has one sister.'),
      Q('They play ___ together.', 'football'),
    ],
  },
  {
    topic: 'A Saturday plan',
    audioText: "This Saturday I have a nice plan. In the morning, I clean my room and help my mum. At twelve o'clock I meet my cousin for lunch at a small cafe. In the afternoon, we go to the lake and take photos. In the evening, I make dinner for my family. Then we watch a film together. I love Saturdays!",
    qs: [
      Q('What does the speaker do in the morning?', 'cleans her room', ['goes shopping', 'cleans her room', 'plays tennis']),
      Q('Who does she have lunch with?', 'her cousin', ['her mum', 'her friend', 'her cousin']),
      Q('Where do they go in the afternoon?', 'to the lake', ['to the lake', 'to the park', 'to the cinema']),
      TF('In the evening they go to the cinema.', false, 'They watch a film at home.'),
      Q('In the evening she makes ___ for her family.', 'dinner'),
    ],
  },
];
