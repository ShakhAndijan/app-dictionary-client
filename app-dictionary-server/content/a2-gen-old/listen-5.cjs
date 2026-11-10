const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'A guitar lesson',
    audioText: 'Hello, Dilnoza. This is Mr Brown from the music school. Your guitar lesson on Thursday is now at five o\'clock, not four. Please bring your blue book and your own guitar, because the school guitars are being repaired. We will learn a new song called Sunny Day. It has only three easy chords. Practise for ten minutes every day before the lesson. See you on Thursday. Goodbye!',
    qs: [
      Q('Who is calling Dilnoza?', 'Her music teacher', ['Her music teacher', 'Her mother', 'A shop worker'], 'Mr Brown is from the music school.'),
      Q('What is the new time of the lesson?', 'Five o\'clock', ['Four o\'clock', 'Five o\'clock', 'Six o\'clock'], 'The lesson is now at five o\'clock.'),
      Q('Why must Dilnoza bring her own guitar?', 'The school guitars are being repaired', ['The school guitars are being repaired', 'The school has no room', 'The teacher is ill'], 'The school guitars are being repaired.'),
      TF('The new song has five chords.', false, 'It has only three easy chords.'),
      Q('Please bring your blue ___', 'book', undefined, 'Bring your blue book.'),
    ],
  },
  {
    topic: 'A chess club talk',
    audioText: 'Welcome to the school chess club. My name is Akmal, and I am the club leader. We meet every Tuesday in room twelve after lessons. The club is free, and everyone can join, even beginners. Last month we had twenty members. On the first Tuesday of each month, we play a small tournament and the winner gets a chocolate. Please tell your friends. Today we will learn how the knight moves.',
    qs: [
      Q('Who is Akmal?', 'The club leader', ['A new member', 'The club leader', 'A school teacher'], 'He says he is the club leader.'),
      Q('When does the club meet?', 'Every Tuesday', ['Every Monday', 'Every Tuesday', 'Every Friday'], 'They meet every Tuesday.'),
      Q('Where does the club meet?', 'In room twelve', ['In the library', 'In room twelve', 'In the hall'], 'They meet in room twelve.'),
      TF('The club costs money.', false, 'The club is free.'),
      Q('The winner of the tournament gets a ___', 'chocolate', undefined, 'The winner gets a chocolate.'),
    ],
  },
  {
    topic: 'A swimming schedule',
    audioText: 'Good morning, this is the city pool. Here is the new swimming schedule. Lessons for children are on Monday and Wednesday at four o\'clock. Adults can swim on Tuesday evening from seven to nine. On Saturday the pool opens early, at eight o\'clock, for families. The pool is closed on Sunday for cleaning. Please remember to wear a swimming hat. You can buy one at the front desk for two dollars.',
    qs: [
      Q('When can adults swim?', 'On Tuesday evening', ['On Monday afternoon', 'On Tuesday evening', 'On Saturday morning'], 'Adults swim on Tuesday evening.'),
      Q('What time does the pool open on Saturday?', 'Eight o\'clock', ['Seven o\'clock', 'Eight o\'clock', 'Nine o\'clock'], 'It opens at eight o\'clock.'),
      Q('When is the pool closed?', 'On Sunday', ['On Sunday', 'On Monday', 'On Wednesday'], 'It is closed on Sunday for cleaning.'),
      TF('You must wear a swimming hat.', true, 'The speaker says to remember a swimming hat.'),
      Q('You can buy a hat at the front ___', 'desk', undefined, 'You can buy one at the front desk.'),
    ],
  },
  {
    topic: 'A photography walk',
    audioText: 'Hi everyone, I am Sara. Next Saturday we are going on a photography walk in the old part of the city. We will meet at the big fountain at nine o\'clock. The walk takes about three hours. Bring your camera or your phone, and wear comfortable shoes. The weather will be sunny, so the pictures should be great. After the walk, we will drink tea together and look at our best photos.',
    qs: [
      Q('Where will the group meet?', 'At the big fountain', ['At the big fountain', 'At the station', 'At the museum'], 'They meet at the big fountain.'),
      Q('How long is the walk?', 'About three hours', ['About one hour', 'About two hours', 'About three hours'], 'The walk takes about three hours.'),
      Q('What should people wear?', 'Comfortable shoes', ['A warm coat', 'Comfortable shoes', 'A white shirt'], 'They should wear comfortable shoes.'),
      TF('The weather will be rainy.', false, 'The weather will be sunny.'),
      Q('After the walk, they will drink ___', 'tea', undefined, 'They will drink tea together.'),
    ],
  },
  {
    topic: 'A football training',
    audioText: 'Listen, boys. Coach Rustam speaking. Football training is tomorrow, not today, because the field is wet. We start at half past five and finish at seven. Everyone must bring water and a clean shirt. We have a big match against the Red Eagles on Sunday, so please do not be late. Jasur will be our goalkeeper this time. Tomorrow we will practise passing and running. Sleep well tonight!',
    qs: [
      Q('Why is training tomorrow?', 'The field is wet', ['The coach is ill', 'The field is wet', 'There is a match today'], 'The field is wet.'),
      Q('Who is the team playing on Sunday?', 'The Red Eagles', ['The Red Eagles', 'The Blue Stars', 'The Green Lions'], 'They play against the Red Eagles.'),
      Q('Who will be the goalkeeper?', 'Jasur', ['Rustam', 'Jasur', 'The coach'], 'Jasur will be the goalkeeper.'),
      TF('Training finishes at six o\'clock.', false, 'Training finishes at seven.'),
      Q('Everyone must bring water and a clean ___', 'shirt', undefined, 'Bring water and a clean shirt.'),
    ],
  },
  {
    topic: 'A painting class',
    audioText: 'Welcome to the painting class at the art centre. I am Helen, your teacher. Today we will paint a farm with animals. You have paper, brushes and six colours on your table. First, draw a big red barn. Then add a cow, two sheep and a small yellow sun. Do not use too much water, or the paper will become soft. The class is two hours long, and we have a break in the middle.',
    qs: [
      Q('What will the students paint today?', 'A farm with animals', ['A city street', 'A farm with animals', 'A blue sea'], 'They will paint a farm with animals.'),
      Q('How many colours are on the table?', 'Six', ['Four', 'Six', 'Ten'], 'There are six colours.'),
      Q('How long is the class?', 'Two hours', ['One hour', 'Two hours', 'Three hours'], 'The class is two hours long.'),
      TF('The students should use a lot of water.', false, 'Too much water makes the paper soft.'),
      Q('First, draw a big red ___', 'barn', undefined, 'First they draw a big red barn.'),
    ],
  },
  {
    topic: 'A book club',
    audioText: 'Hello, book lovers. The Friday book club meets this week at the library at six o\'clock. We are reading a story about a boy and his dog who get lost in a forest. Malika says the ending is very funny. Please finish the book before Friday. If you do not have a copy, you can borrow one from the front desk. We will also have biscuits and orange juice. New members are always welcome.',
    qs: [
      Q('What is the story about?', 'A boy and his dog in a forest', ['A girl and her cat', 'A boy and his dog in a forest', 'A king and a castle'], 'The boy and his dog get lost in a forest.'),
      Q('Where does the club meet?', 'At the library', ['At a cafe', 'At the library', 'At a school'], 'The club meets at the library.'),
      Q('Who says the ending is funny?', 'Malika', ['Malika', 'The librarian', 'A new member'], 'Malika says the ending is very funny.'),
      TF('Members must buy the book.', false, 'They can borrow a copy from the front desk.'),
      Q('There will be biscuits and orange ___', 'juice', undefined, 'There will be biscuits and orange juice.'),
    ],
  },
  {
    topic: 'A gardening tip',
    audioText: 'Today on Garden Time, I want to talk about tomatoes. Many people ask me how often to give them water. My answer is simple: water them every morning, but only a little. Tomatoes love the sun, so put them near a window or in a sunny corner of the garden. In summer, you will see small green fruit. Wait until the fruit is red before you pick it. Red tomatoes taste much sweeter.',
    qs: [
      Q('Which plant is the talk about?', 'Tomatoes', ['Potatoes', 'Tomatoes', 'Roses'], 'The talk is about tomatoes.'),
      Q('When should you water the plants?', 'Every morning', ['Every morning', 'Every evening', 'Once a week'], 'Water them every morning, but only a little.'),
      Q('When should you pick the fruit?', 'When it is red', ['When it is small', 'When it is green', 'When it is red'], 'Wait until the fruit is red.'),
      TF('Tomatoes love the shade.', false, 'Tomatoes love the sun.'),
      Q('Tomatoes love the ___', 'sun', undefined, 'Tomatoes love the sun.'),
    ],
  },
  {
    topic: 'A fishing trip',
    audioText: 'My grandfather Karim and I went fishing last Sunday. We left home at five in the morning and drove to a quiet lake near the mountains. The air was cold, so I wore a warm hat. Grandfather caught two big fish, and I caught only one small fish. We cooked the fish on a fire and ate them with bread. It was a lovely day, and I want to go again next month.',
    qs: [
      Q('Who went fishing with the speaker?', 'His grandfather', ['His brother', 'His grandfather', 'His teacher'], 'He went with his grandfather Karim.'),
      Q('What time did they leave home?', 'Five in the morning', ['Five in the morning', 'Seven in the morning', 'Noon'], 'They left at five in the morning.'),
      Q('How many fish did the grandfather catch?', 'Two', ['One', 'Two', 'Three'], 'Grandfather caught two big fish.'),
      TF('They cooked the fish on a fire.', true, 'They cooked the fish on a fire and ate them with bread.'),
      Q('The speaker wore a warm ___', 'hat', undefined, 'He wore a warm hat.'),
    ],
  },
  {
    topic: 'A dance rehearsal',
    audioText: 'Attention, dancers. This is a message from Nigora. Our dance rehearsal on Wednesday will be in the big hall, not in the small studio. Please arrive at four o\'clock and bring your red costumes. The show is in ten days, and we still need to practise the last song. Many parents will come to watch, so we must be perfect. Drink a lot of water and do not eat heavy food before the rehearsal.',
    qs: [
      Q('Where is the rehearsal?', 'In the big hall', ['In the small studio', 'In the big hall', 'In the park'], 'It is in the big hall.'),
      Q('What should the dancers bring?', 'Red costumes', ['Red costumes', 'Blue shoes', 'Their parents'], 'They should bring their red costumes.'),
      Q('When is the show?', 'In ten days', ['Tomorrow', 'In ten days', 'Next year'], 'The show is in ten days.'),
      TF('Many parents will come to watch.', true, 'Many parents will come to watch.'),
      Q('They still need to practise the last ___', 'song', undefined, 'They still need to practise the last song.'),
    ],
  },
  {
    topic: 'A hiking plan',
    audioText: 'Let us plan our hiking trip. We will go to Green Hill on Saturday. The bus leaves from the station at seven o\'clock, and the ride takes one hour. The walk to the top is about four kilometres, and it takes two hours. Take a sandwich, an apple and a bottle of water. Aziza will bring a first aid box. If it rains, we will stay home and try again next week.',
    qs: [
      Q('Where will the group go?', 'To Green Hill', ['To Green Hill', 'To a lake', 'To a village'], 'They will go to Green Hill.'),
      Q('When does the bus leave?', 'At seven o\'clock', ['At six o\'clock', 'At seven o\'clock', 'At eight o\'clock'], 'The bus leaves at seven o\'clock.'),
      Q('Who will bring the first aid box?', 'Aziza', ['Aziza', 'The driver', 'Nobody'], 'Aziza will bring a first aid box.'),
      TF('The bus ride takes two hours.', false, 'The bus ride takes one hour.'),
      Q('Take a sandwich, an apple and a bottle of ___', 'water', undefined, 'Take a bottle of water.'),
    ],
  },
  {
    topic: 'A video game review',
    audioText: 'I played a new video game this week called Space Farm. In the game, you grow plants on a small planet and sell them to visitors. I really like the music, because it is calm and happy. The game is easy to learn, so it is good for children. My only problem is the price. It costs thirty dollars, which is a bit expensive for me. I give it four stars out of five.',
    qs: [
      Q('What is the game called?', 'Space Farm', ['Space Farm', 'Happy Planet', 'Garden Star'], 'The game is called Space Farm.'),
      Q('What do you do in the game?', 'Grow plants and sell them', ['Fly a rocket', 'Grow plants and sell them', 'Build houses'], 'You grow plants and sell them to visitors.'),
      Q('What is the speaker\'s problem with the game?', 'The price', ['The music', 'The price', 'The pictures'], 'The price is a bit expensive.'),
      TF('The speaker gives the game five stars.', false, 'He gives it four stars.'),
      Q('The game costs thirty ___', 'dollars', undefined, 'It costs thirty dollars.'),
    ],
  },
  {
    topic: 'A cooking show',
    audioText: 'Welcome to Tasty Kitchen. Today we are making vegetable soup. First, cut two carrots, one onion and three potatoes into small pieces. Put them in a pot with water and a little salt. Cook the soup for twenty minutes on a low fire. Then add some green herbs and stir well. This soup is cheap, healthy and perfect for a cold day. Serve it with fresh bread.',
    qs: [
      Q('What are they making?', 'Vegetable soup', ['Chicken salad', 'Vegetable soup', 'Fruit cake'], 'They are making vegetable soup.'),
      Q('How many potatoes do you need?', 'Three', ['One', 'Two', 'Three'], 'You need three potatoes.'),
      Q('How long do you cook the soup?', 'Twenty minutes', ['Ten minutes', 'Twenty minutes', 'One hour'], 'Cook it for twenty minutes.'),
      TF('You cook the soup on a high fire.', false, 'You cook it on a low fire.'),
      Q('Serve the soup with fresh ___', 'bread', undefined, 'Serve it with fresh bread.'),
    ],
  },
  {
    topic: 'A cycling route',
    audioText: 'Here is our family cycling route for Sunday. We start at the park gate and ride along the river for six kilometres. After that, we turn left at the old bridge and go through a small village. There is a cafe in the village where we can have lunch. The road is flat, so it is easy for my little sister Zarina. We should be back home before four o\'clock.',
    qs: [
      Q('Where does the family start?', 'At the park gate', ['At the park gate', 'At the old bridge', 'At the cafe'], 'They start at the park gate.'),
      Q('Where will they have lunch?', 'In a cafe in the village', ['At home', 'In a cafe in the village', 'By the river'], 'There is a cafe in the village.'),
      Q('Why is the route easy for Zarina?', 'The road is flat', ['The road is flat', 'It is very short', 'She has a new bike'], 'The road is flat.'),
      TF('They turn right at the old bridge.', false, 'They turn left at the old bridge.'),
      Q('They ride along the ___', 'river', undefined, 'They ride along the river for six kilometres.'),
    ],
  },
  {
    topic: 'A yoga session',
    audioText: 'Good evening and welcome to our yoga session. I am Laura. Please sit on your mat and close your eyes. Breathe in slowly and count to four. Then breathe out slowly. We will do this five times. After that, we will stretch our arms and legs for ten minutes. Yoga helps you sleep better and feel calm. Remember to turn off your phone during the class. It is quiet time.',
    qs: [
      Q('Who is the teacher?', 'Laura', ['Laura', 'Sara', 'Helen'], 'The teacher says she is Laura.'),
      Q('How many times will they breathe in and out?', 'Five times', ['Four times', 'Five times', 'Ten times'], 'They will do it five times.'),
      Q('How long will they stretch?', 'Ten minutes', ['Five minutes', 'Ten minutes', 'One hour'], 'They stretch for ten minutes.'),
      TF('Yoga helps you sleep better.', true, 'The teacher says yoga helps you sleep better.'),
      Q('Please sit on your ___', 'mat', undefined, 'Please sit on your mat.'),
    ],
  },
  {
    topic: 'A tennis court booking',
    audioText: 'Hello, I would like to book a tennis court for Saturday, please. Of course. What time would you like? Ten o\'clock in the morning, for two hours. I am sorry, the court is full at ten. We have a free court at noon. That is fine. How much is it? It is twelve dollars for one hour. Good, I will take it for two hours. Can I have your name? It is Bobur.',
    qs: [
      Q('What does the caller want to book?', 'A tennis court', ['A swimming pool', 'A tennis court', 'A football field'], 'He wants to book a tennis court.'),
      Q('When is there a free court?', 'At noon', ['At ten', 'At noon', 'At night'], 'There is a free court at noon.'),
      Q('How much is one hour?', 'Twelve dollars', ['Two dollars', 'Ten dollars', 'Twelve dollars'], 'It is twelve dollars for one hour.'),
      TF('The caller\'s name is Bobur.', true, 'He says his name is Bobur.'),
      Q('He will take the court for ___ hours.', 'two', undefined, 'He will take it for two hours.'),
    ],
  },
  {
    topic: 'A stamp collection',
    audioText: 'My uncle Farhod has a big stamp collection. He started it when he was ten years old. Now he has more than two hundred stamps from many countries. His favourite stamp is from Japan, and it has a small blue bird on it. He keeps all the stamps in a special book and never touches them with his fingers. He says that stamps are like tiny pictures of history.',
    qs: [
      Q('Who has the stamp collection?', 'The speaker\'s uncle', ['The speaker\'s uncle', 'The speaker\'s father', 'The speaker\'s friend'], 'Uncle Farhod has the collection.'),
      Q('Where is his favourite stamp from?', 'Japan', ['Japan', 'China', 'Turkey'], 'His favourite stamp is from Japan.'),
      Q('What is on his favourite stamp?', 'A small blue bird', ['A red flower', 'A small blue bird', 'A big ship'], 'It has a small blue bird on it.'),
      TF('He touches the stamps with his fingers.', false, 'He never touches them with his fingers.'),
      Q('He keeps the stamps in a special ___', 'book', undefined, 'He keeps them in a special book.'),
    ],
  },
  {
    topic: 'A running diary',
    audioText: 'Today is day twelve of my running diary. I woke up at six and ran in the park for thirty minutes. My friend Timur ran with me, but he was faster than me. It was cool and cloudy, which is good weather for running. After the run, I drank water and ate a banana. My legs are tired, but I feel happy. Tomorrow I will rest, and on Friday I will try forty minutes.',
    qs: [
      Q('How long did the speaker run today?', 'Thirty minutes', ['Twenty minutes', 'Thirty minutes', 'Forty minutes'], 'He ran for thirty minutes.'),
      Q('Who ran with the speaker?', 'Timur', ['Timur', 'His father', 'His teacher'], 'His friend Timur ran with him.'),
      Q('What did the speaker eat after the run?', 'A banana', ['An apple', 'A banana', 'A sandwich'], 'He ate a banana.'),
      TF('The weather was hot and sunny.', false, 'It was cool and cloudy.'),
      Q('Tomorrow the speaker will ___', 'rest', undefined, 'Tomorrow he will rest.'),
    ],
  },
  {
    topic: 'A choir practice',
    audioText: 'Hello, choir members. This is Madina. Our next practice is on Thursday at six thirty in the school hall. We will sing three songs for the spring concert. Two of them are new, so please listen to the recordings at home. The concert is on the fifteenth of April, and tickets cost five dollars. Wear white shirts and dark trousers. If you cannot come, please call me before Thursday.',
    qs: [
      Q('When is the next practice?', 'On Thursday', ['On Tuesday', 'On Thursday', 'On Sunday'], 'The practice is on Thursday.'),
      Q('How many songs will they sing?', 'Three', ['Two', 'Three', 'Five'], 'They will sing three songs.'),
      Q('How much is a concert ticket?', 'Five dollars', ['Three dollars', 'Five dollars', 'Fifteen dollars'], 'Tickets cost five dollars.'),
      TF('The singers must wear white shirts.', true, 'They should wear white shirts and dark trousers.'),
      Q('The practice is in the school ___', 'hall', undefined, 'The practice is in the school hall.'),
    ],
  },
  {
    topic: 'A magic show',
    audioText: 'Ladies and gentlemen, welcome to the Big Magic Show. I am Max the Magician. Tonight I will pull a white rabbit out of this black hat. Then I will make a coin disappear and find it in the pocket of a child. The show lasts one hour, and there is a short break after thirty minutes. Please do not take photos with a flash. After the show, you can meet the rabbit, whose name is Snow.',
    qs: [
      Q('What will Max pull out of the hat?', 'A white rabbit', ['A white rabbit', 'A red flower', 'A coin'], 'He will pull a white rabbit out of the hat.'),
      Q('How long is the show?', 'One hour', ['Thirty minutes', 'One hour', 'Two hours'], 'The show lasts one hour.'),
      Q('What can people do after the show?', 'Meet the rabbit', ['Take a coin', 'Meet the rabbit', 'Buy the hat'], 'They can meet the rabbit.'),
      TF('People can take photos with a flash.', false, 'Please do not take photos with a flash.'),
      Q('The name of the rabbit is ___', 'snow', undefined, 'The rabbit is called Snow.'),
    ],
  },
  {
    topic: 'A skateboard park',
    audioText: 'The new skateboard park opens this Saturday near the river. It has two big ramps, a long rail and a safe area for beginners. The park is open every day from ten in the morning until eight in the evening. Entry is free, but you must wear a helmet. There is also a small shop that sells drinks and snacks. My brother Kamol cannot wait. He will go there with his friends at ten.',
    qs: [
      Q('Where is the new park?', 'Near the river', ['Near the river', 'Near the school', 'Near the station'], 'It is near the river.'),
      Q('What must skaters wear?', 'A helmet', ['A hat', 'A helmet', 'A jacket'], 'You must wear a helmet.'),
      Q('How much is entry?', 'It is free', ['It is free', 'One dollar', 'Five dollars'], 'Entry is free.'),
      TF('The park closes at six in the evening.', false, 'It is open until eight in the evening.'),
      Q('The small shop sells drinks and ___', 'snacks', undefined, 'The shop sells drinks and snacks.'),
    ],
  },
  {
    topic: 'A knitting group',
    audioText: 'Good afternoon. I am Gulnora, and I run a knitting group for women and girls in our street. We meet on Monday afternoons at two o\'clock in my living room. This winter we are knitting warm scarves for children in the hospital. You do not need to bring wool because I have a lot. Last week we finished ten scarves. Come and join us. We drink tea and talk while we knit.',
    qs: [
      Q('When does the group meet?', 'On Monday afternoons', ['On Monday afternoons', 'On Friday evenings', 'On Sunday mornings'], 'They meet on Monday afternoons at two.'),
      Q('What are they knitting this winter?', 'Scarves for children', ['Hats for men', 'Scarves for children', 'Socks for dogs'], 'They knit scarves for children in the hospital.'),
      Q('Who has the wool?', 'Gulnora', ['Gulnora', 'Every member', 'The hospital'], 'Gulnora has a lot of wool.'),
      TF('The group finished ten scarves last week.', true, 'Last week they finished ten scarves.'),
      Q('They meet in Gulnora\'s living ___', 'room', undefined, 'They meet in her living room.'),
    ],
  },
  {
    topic: 'A volunteer day',
    audioText: 'Next Sunday is our town volunteer day. We will meet at nine o\'clock in front of the library and clean the river park. The city gives us gloves and big bags. Please bring a hat and a bottle of water. Last year, forty people came, and we filled one hundred bags. At twelve we will have free pizza for all helpers. Our leader, Oliver, hopes to see even more people this year.',
    qs: [
      Q('Where will the volunteers meet?', 'In front of the library', ['In the river park', 'In front of the library', 'At the school'], 'They meet in front of the library.'),
      Q('What does the city give the volunteers?', 'Gloves and bags', ['Hats and water', 'Gloves and bags', 'Food and drinks'], 'The city gives gloves and big bags.'),
      Q('Who is the leader?', 'Oliver', ['Oliver', 'Daniel', 'Samir'], 'Oliver is the leader.'),
      TF('The pizza for helpers is free.', true, 'At twelve there is free pizza for all helpers.'),
      Q('At twelve there will be free ___', 'pizza', undefined, 'There will be free pizza.'),
    ],
  },
  {
    topic: 'A weekend hobby talk',
    audioText: 'What did you do at the weekend, Ali? I made a model plane with my father. It took two days. We painted it red and white. That sounds great. Do you like making models? Yes, it is my first model, and I want to make a boat next. My hobby is not expensive, because we use old boxes and glue. I would like to try. Come to my house on Saturday, and I will show you how.',
    qs: [
      Q('What did Ali make?', 'A model plane', ['A model boat', 'A model plane', 'A model car'], 'He made a model plane.'),
      Q('What colours did they paint it?', 'Red and white', ['Blue and green', 'Red and white', 'Black and yellow'], 'They painted it red and white.'),
      Q('What does Ali want to make next?', 'A boat', ['A boat', 'A house', 'A train'], 'He wants to make a boat next.'),
      TF('Ali\'s hobby is very expensive.', false, 'They use old boxes and glue, so it is not expensive.'),
      Q('They use old boxes and ___', 'glue', undefined, 'They use old boxes and glue.'),
    ],
  },
];
