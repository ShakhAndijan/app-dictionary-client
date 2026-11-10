const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'A student flat',
    passage: "Aziz and Tom are students. They live in a small flat near the university. There are two bedrooms, a kitchen and a bathroom. The kitchen is very small, but it has a new fridge. Aziz cooks rice on Monday. Tom cooks pasta on Tuesday. They pay one hundred pounds each week. They like the flat because it is cheap.",
    qs: [
      Q('Where is the flat?', 'near the university', ['near the university', 'near a hotel', 'near the sea'], 'The flat is near the university.'),
      Q('How many bedrooms are there?', 'two', ['one', 'two', 'three'], 'There are two bedrooms.'),
      Q('What does the kitchen have?', 'a new fridge', ['a new fridge', 'a big table', 'a TV'], 'The kitchen has a new fridge.'),
      TF('Tom cooks rice on Monday.', false, 'Aziz cooks rice on Monday.'),
      Q('Tom cooks ___', 'pasta'),
    ],
  },
  {
    topic: 'A walk to school',
    passage: "Dilnoza walks to school every morning. She leaves home at seven thirty. First she goes past a small shop. Then she crosses a big road with her friend Aisha. There is a park near the school. The walk takes twenty minutes. Dilnoza likes it because she can talk to her friend. Today it is sunny, so she is happy.",
    qs: [
      Q('What time does Dilnoza leave home?', 'seven thirty', ['seven thirty', "eight o'clock", 'seven fifteen'], 'She leaves home at seven thirty.'),
      Q('Who crosses the big road with Dilnoza?', 'Aisha', ['Aisha', 'her mother', 'her brother'], 'She crosses the road with her friend Aisha.'),
      Q('How long is the walk?', 'twenty minutes', ['ten minutes', 'twenty minutes', 'thirty minutes'], 'The walk takes twenty minutes.'),
      TF('There is a park near the school.', true, 'There is a park near the school.'),
      Q('First she goes past a small ___', 'shop'),
    ],
  },
  {
    topic: 'At the chemist',
    passage: "Mark has a headache, so he goes to the chemist. The chemist is a kind woman. She asks, \"Do you have a fever?\" Mark says no. She gives him some tablets and a bottle of water. The tablets cost four pounds. She says, \"Take one tablet after lunch.\" Mark says thank you and goes home to rest.",
    qs: [
      Q('Why does Mark go to the chemist?', 'He has a headache', ['He has a headache', 'He has a cough', 'He cut his finger'], 'Mark has a headache.'),
      Q('What does the chemist give Mark with the tablets?', 'a bottle of water', ['a bottle of water', 'a cream', 'a mask'], 'She gives him tablets and a bottle of water.'),
      Q('How much are the tablets?', 'four pounds', ['two pounds', 'four pounds', 'ten pounds'], 'The tablets cost four pounds.'),
      TF('Mark has a fever.', false, 'Mark says no to the fever question.'),
      Q('Take one tablet after ___', 'lunch'),
    ],
  },
  {
    topic: 'My English friend online',
    passage: "I have an English friend online. Her name is Emma and she lives in Leeds. She is fourteen years old. We talk on Sunday evenings. Emma likes cats and she has two cats at home. I like football. She wants to visit my city next year. I want to show her the old market.",
    qs: [
      Q('Where does Emma live?', 'Leeds', ['Leeds', 'Bristol', 'Oxford'], 'Emma lives in Leeds.'),
      Q('When do they talk?', 'on Sunday evenings', ['on Friday mornings', 'on Sunday evenings', 'on Monday afternoons'], 'They talk on Sunday evenings.'),
      Q('What animal does Emma like?', 'cats', ['cats', 'dogs', 'birds'], 'Emma likes cats.'),
      TF('Emma is fifteen years old.', false, 'Emma is fourteen years old.'),
      Q('I want to show her the old ___', 'market'),
    ],
  },
  {
    topic: 'A lazy holiday',
    passage: "Our holiday is very lazy this year. We stay at a small house by the sea. Every day we wake up late, at ten o'clock. We eat breakfast on the beach. My father reads a book and my mother sleeps. My brother and I swim a little. We do not visit museums. In the evening we eat fish and watch the sun go down.",
    qs: [
      Q('Where does the family stay?', 'in a house by the sea', ['in a house by the sea', 'in a city hotel', 'in a tent'], 'They stay at a small house by the sea.'),
      Q('What time do they wake up?', "ten o'clock", ["seven o'clock", "eight o'clock", "ten o'clock"], "They wake up at ten o'clock."),
      Q('What does the father do?', 'He reads a book', ['He reads a book', 'He swims', 'He cooks'], 'My father reads a book.'),
      TF('The family visits museums.', false, 'They do not visit museums.'),
      Q('In the evening we eat ___', 'fish'),
    ],
  },
  {
    topic: 'A camping night',
    passage: "Last Saturday, Bobur and his uncle went camping in the mountains. They put up a small tent near a river. At night they made a fire and cooked sausages. It was cold, so they wore warm jackets. Bobur saw many stars. He heard an owl in the trees. They slept in the tent and went home on Sunday.",
    qs: [
      Q('Where did they go camping?', 'in the mountains', ['in the mountains', 'at the beach', 'in a city park'], 'They went camping in the mountains.'),
      Q('What did they cook?', 'sausages', ['sausages', 'fish', 'eggs'], 'They cooked sausages.'),
      Q('What did Bobur hear?', 'an owl', ['an owl', 'a dog', 'a wolf'], 'He heard an owl in the trees.'),
      TF('It was hot at night.', false, 'It was cold.'),
      Q('They put up a small tent near a ___', 'river'),
    ],
  },
  {
    topic: 'My hobby singing',
    passage: "My hobby is singing. I sing every day after school. I like pop songs and old songs. My mother plays the piano and I sing with her. On Fridays I go to a singing club. There are ten children in the club. Our teacher is Mrs Karimova. Next month we are going to sing at a big concert.",
    qs: [
      Q('When does the writer sing every day?', 'after school', ['in the morning', 'after school', 'at night'], 'I sing every day after school.'),
      Q('Who plays the piano?', "the writer's mother", ["the writer's mother", "the writer's father", "the writer's sister"], 'My mother plays the piano.'),
      Q('How many children are in the club?', 'ten', ['five', 'ten', 'twelve'], 'There are ten children in the club.'),
      TF('The teacher is Mrs Karimova.', true, 'Our teacher is Mrs Karimova.'),
      Q('I go to a singing club on ___', 'fridays'),
    ],
  },
  {
    topic: 'An art class',
    passage: "Sarah goes to an art class on Wednesday. The class is in a bright room with big windows. Today the children paint a bowl of fruit. There are three apples, two bananas and one orange on the table. Sarah uses red, yellow and green paint. Her picture is not perfect, but the teacher says it is nice. Sarah smiles.",
    qs: [
      Q('Which day is the art class?', 'Wednesday', ['Tuesday', 'Wednesday', 'Thursday'], 'Sarah goes to art class on Wednesday.'),
      Q('What do the children paint today?', 'a bowl of fruit', ['a bowl of fruit', 'a house', 'a dog'], 'They paint a bowl of fruit.'),
      Q('How many apples are there?', 'three', ['two', 'three', 'four'], 'There are three apples.'),
      TF("Sarah's picture is perfect.", false, 'Her picture is not perfect, but it is nice.'),
      Q('The room has big ___', 'windows'),
    ],
  },
  {
    topic: 'A parrot',
    passage: "Our parrot is called Kiwi. He is green and yellow. He lives in a big cage in the living room. Kiwi can say five words: hello, good morning, thank you, Kiwi and banana. He eats seeds and fruit. He likes bananas best. When my grandmother comes, he says hello. She laughs every time.",
    qs: [
      Q('What colour is Kiwi?', 'green and yellow', ['red and blue', 'green and yellow', 'white'], 'He is green and yellow.'),
      Q('Where does Kiwi live?', 'in a cage in the living room', ['in a cage in the living room', 'in the garden', 'in the kitchen'], 'He lives in a big cage in the living room.'),
      Q('What does Kiwi like best?', 'bananas', ['apples', 'bananas', 'grapes'], 'He likes bananas best.'),
      TF('Kiwi can say ten words.', false, 'Kiwi can say five words.'),
      Q('He eats seeds and ___', 'fruit'),
    ],
  },
  {
    topic: 'A stormy night',
    passage: "Last night there was a big storm. The wind was strong and the rain was loud. Nodira was in bed, but she could not sleep. Then the lights went out. Her little brother came to her room. He was afraid. Nodira lit a candle and told him a funny story. Soon they both slept. In the morning the sun was out.",
    qs: [
      Q('What happened to the lights?', 'They went out', ['They went out', 'They got brighter', 'They turned blue'], 'The lights went out.'),
      Q("Who came to Nodira's room?", 'her little brother', ['her little brother', 'her mother', 'her dog'], 'Her little brother came to her room.'),
      Q('What did Nodira light?', 'a candle', ['a candle', 'a lamp', 'a fire'], 'Nodira lit a candle.'),
      TF('In the morning it was still raining.', false, 'In the morning the sun was out.'),
      Q('Nodira told her brother a funny ___', 'story'),
    ],
  },
  {
    topic: "My teacher's desk",
    passage: "Mr Brown's desk is at the front of the class. It is brown and quite old. On the desk there is a lamp, a laptop and a cup of tea. There are also some books and three red pens. There is not any chalk on it. The chalk is in a box by the board. Mr Brown sits at his desk and checks our homework.",
    qs: [
      Q('Where is the desk?', 'at the front of the class', ['at the front of the class', 'at the back of the class', 'near the door'], 'The desk is at the front of the class.'),
      Q('What drink is on the desk?', 'tea', ['tea', 'coffee', 'milk'], 'There is a cup of tea.'),
      Q('What colour are the pens?', 'red', ['blue', 'red', 'green'], 'There are three red pens.'),
      TF('There is chalk on the desk.', false, 'The chalk is in a box by the board.'),
      Q('Mr Brown checks our ___', 'homework'),
    ],
  },
  {
    topic: 'A gift shop',
    passage: "Lola goes to a gift shop to buy a present for her aunt. The shop has many nice things: cups, cards, candles and small bags. Lola looks at a blue cup. It costs six dollars. Then she sees a pretty card for two dollars. She buys both. The shop woman puts them in a paper bag. Lola pays eight dollars and says goodbye.",
    qs: [
      Q('Who is the present for?', 'her aunt', ['her aunt', 'her mother', 'her friend'], 'Lola buys a present for her aunt.'),
      Q('How much is the cup?', 'six dollars', ['four dollars', 'six dollars', 'eight dollars'], 'The cup costs six dollars.'),
      Q('What colour is the cup?', 'blue', ['red', 'blue', 'white'], 'Lola looks at a blue cup.'),
      TF('The card costs five dollars.', false, 'The card costs two dollars.'),
      Q('The woman puts the things in a paper ___', 'bag'),
    ],
  },
  {
    topic: 'A snail',
    passage: "A snail is a very slow animal. It has a soft body and a hard shell on its back. The shell is its home. When it rains, snails come out of the ground. They eat leaves and flowers. In my garden there are many snails. They move only a few metres in one day. My sister likes snails, but I do not touch them.",
    qs: [
      Q('What does a snail have on its back?', 'a shell', ['a shell', 'wings', 'legs'], 'It has a hard shell on its back.'),
      Q('When do snails come out?', 'when it rains', ['when it rains', 'when it is hot', 'at lunch'], 'When it rains, snails come out.'),
      Q('What do snails eat?', 'leaves and flowers', ['meat', 'leaves and flowers', 'bread'], 'They eat leaves and flowers.'),
      TF('Snails are fast animals.', false, 'A snail is a very slow animal.'),
      Q('The shell is its ___', 'home'),
    ],
  },
  {
    topic: 'Our family car trip',
    passage: "On Saturday our family drives to my grandparents' village. My father drives and my mother sits next to him. My sister and I sit in the back. The trip takes three hours. We listen to music and play word games. We stop once to eat sandwiches and drink juice. At five o'clock we arrive. My grandmother is waiting at the gate.",
    qs: [
      Q('Who drives the car?', 'the father', ['the father', 'the mother', 'the sister'], 'My father drives.'),
      Q('How long is the trip?', 'three hours', ['two hours', 'three hours', 'five hours'], 'The trip takes three hours.'),
      Q('What do they eat when they stop?', 'sandwiches', ['sandwiches', 'pizza', 'rice'], 'They eat sandwiches and drink juice.'),
      TF('They stop three times.', false, 'They stop once.'),
      Q('My grandmother is waiting at the ___', 'gate'),
    ],
  },
  {
    topic: 'A birthday cake',
    passage: "Today is Ali's birthday. He is ten years old. His mother makes a big chocolate cake. She puts ten candles on it. Ali's friends come at four o'clock. They sing a song and Ali blows out the candles. Then everyone eats a piece of cake. Ali gets a football and a book. He says, \"This is the best birthday!\"",
    qs: [
      Q('How old is Ali?', 'ten', ['nine', 'ten', 'eleven'], 'Ali is ten years old.'),
      Q('What kind of cake is it?', 'chocolate', ['chocolate', 'vanilla', 'strawberry'], 'His mother makes a chocolate cake.'),
      Q('When do the friends come?', "at four o'clock", ["at three o'clock", "at four o'clock", "at six o'clock"], "They come at four o'clock."),
      TF('Ali gets a bike.', false, 'Ali gets a football and a book.'),
      Q('Ali blows out the ___', 'candles'),
    ],
  },
  {
    topic: 'A burger place',
    passage: "Jack works at a burger place near the station. It opens at eleven o'clock. The place is small but busy. Customers can order a burger, chips or a milkshake. A burger costs five pounds and a milkshake costs three pounds. At lunchtime there are many people in a line. Jack is quick and friendly. He finishes work at eight o'clock.",
    qs: [
      Q('Where is the burger place?', 'near the station', ['near the station', 'near the school', 'near the park'], 'It is near the station.'),
      Q('How much is a burger?', 'five pounds', ['four pounds', 'five pounds', 'six pounds'], 'A burger costs five pounds.'),
      Q('What time does it open?', "eleven o'clock", ["nine o'clock", "ten o'clock", "eleven o'clock"], "It opens at eleven o'clock."),
      TF('A milkshake costs five pounds.', false, 'A milkshake costs three pounds.'),
      Q('Jack is quick and ___', 'friendly'),
    ],
  },
  {
    topic: 'My keys',
    passage: "I cannot find my keys. I look on the kitchen table, but they are not there. I look in my school bag and in my coat. They are not there, either. My little sister laughs and says, \"Look at the door!\" The keys are in the door. I am very tired and a little silly. Now I put my keys in a small blue box every night.",
    qs: [
      Q('Where are the keys?', 'in the door', ['in the door', 'in the bag', 'on the table'], 'The keys are in the door.'),
      Q('What colour is the box?', 'blue', ['red', 'blue', 'green'], 'The box is small and blue.'),
      Q('Who laughs?', 'the little sister', ['the little sister', 'the brother', 'the mother'], 'My little sister laughs.'),
      TF('The keys are in the coat.', false, 'The keys are in the door.'),
      Q('I look in my coat and in my school ___', 'bag'),
    ],
  },
  {
    topic: 'A school uniform',
    passage: "Our school has a uniform. The boys wear a white shirt, a grey jacket and black trousers. The girls wear a white blouse, a grey skirt and a grey jacket. Everyone wears black shoes. On Fridays we can wear jeans and a T-shirt. I like Fridays very much. My brother does not like the uniform because the jacket is hot.",
    qs: [
      Q('What colour is the jacket?', 'grey', ['grey', 'blue', 'black'], 'The jacket is grey.'),
      Q('Which day can students wear jeans?', 'Friday', ['Monday', 'Wednesday', 'Friday'], 'On Fridays they can wear jeans.'),
      Q('Why does the brother not like the uniform?', 'The jacket is hot', ['The jacket is hot', 'The shirt is small', 'The shoes are old'], 'He says the jacket is hot.'),
      TF('Everyone wears brown shoes.', false, 'Everyone wears black shoes.'),
      Q('The girls wear a white blouse, a grey jacket and a grey ___', 'skirt'),
    ],
  },
  {
    topic: 'A running race',
    passage: "On Sunday there is a running race in our town. It is five kilometres long. Kamila is twelve and she is going to run. She practises in the park every morning. At the race there are two hundred runners. It starts at nine o'clock. Kamila runs fast and finishes in thirty minutes. She does not win, but she is third. She gets a small medal.",
    qs: [
      Q('How long is the race?', 'five kilometres', ['two kilometres', 'five kilometres', 'ten kilometres'], 'It is five kilometres long.'),
      Q('Where does Kamila practise?', 'in the park', ['in the park', 'at school', 'in the street'], 'She practises in the park.'),
      Q('What place does Kamila get?', 'third', ['first', 'second', 'third'], 'She is third.'),
      TF('Kamila wins the race.', false, 'She does not win, but she is third.'),
      Q('She gets a small ___', 'medal'),
    ],
  },
  {
    topic: 'A snowy day',
    passage: "This morning everything is white. It is snowing in the city. Schools are closed, so Rustam stays at home. He puts on his hat, scarf and gloves and goes outside. He makes a big snowman with his cousin. They use a carrot for the nose and two stones for the eyes. After that they go inside and drink hot chocolate.",
    qs: [
      Q('Why does Rustam stay at home?', 'Schools are closed', ['Schools are closed', 'He is sick', 'It is a holiday'], 'Schools are closed.'),
      Q('What do they use for the nose?', 'a carrot', ['a carrot', 'a stone', 'a stick'], 'They use a carrot for the nose.'),
      Q('What do they drink?', 'hot chocolate', ['tea', 'hot chocolate', 'milk'], 'They drink hot chocolate.'),
      TF('Rustam makes the snowman alone.', false, 'He makes it with his cousin.'),
      Q('They use two stones for the ___', 'eyes'),
    ],
  },
  {
    topic: 'At the post office',
    passage: "Gulnora goes to the post office on Monday. She wants to send a parcel to her brother in Moscow. The parcel has a warm scarf and some sweets. A man at the desk weighs it. It is two kilos. He says, \"It costs twelve dollars.\" Gulnora pays and gets a small paper. The parcel will arrive in one week.",
    qs: [
      Q('Who is the parcel for?', 'her brother', ['her brother', 'her sister', 'her aunt'], 'It is for her brother.'),
      Q('What is in the parcel?', 'a scarf and sweets', ['books', 'a scarf and sweets', 'shoes'], 'It has a warm scarf and some sweets.'),
      Q('How much does it cost?', 'twelve dollars', ['ten dollars', 'twelve dollars', 'twenty dollars'], 'It costs twelve dollars.'),
      TF('The parcel will arrive in two weeks.', false, 'It will arrive in one week.'),
      Q('The parcel weighs two ___', 'kilos'),
    ],
  },
  {
    topic: 'An apple tree',
    passage: "There is an old apple tree in our garden. My grandfather planted it forty years ago. In spring it has white flowers. In summer the apples are small and green. In autumn they are big and red. We pick them in October. My mother makes apple pie and jam. Some apples we give to our neighbours. I like to sit under the tree and read.",
    qs: [
      Q('Who planted the tree?', 'the grandfather', ['the grandfather', 'the father', 'the neighbour'], 'My grandfather planted it.'),
      Q('What colour are the apples in autumn?', 'red', ['red', 'green', 'yellow'], 'In autumn they are big and red.'),
      Q('When do they pick the apples?', 'in October', ['in July', 'in October', 'in April'], 'They pick them in October.'),
      TF('The spring flowers are pink.', false, 'The flowers are white.'),
      Q('My mother makes apple pie and ___', 'jam'),
    ],
  },
  {
    topic: 'My favourite lesson',
    passage: "My favourite lesson is science. We have it on Tuesday and Thursday. Our teacher, Miss Lee, is funny. Last week we made a small volcano with soda and vinegar. It was very exciting, and everybody shouted. I want to be a doctor, so science is important for me. I do not like maths because it is difficult.",
    qs: [
      Q('When is the science lesson?', 'Tuesday and Thursday', ['Monday and Friday', 'Tuesday and Thursday', 'Wednesday only'], 'They have it on Tuesday and Thursday.'),
      Q('What did they make last week?', 'a small volcano', ['a small volcano', 'a robot', 'a kite'], 'They made a small volcano.'),
      Q('What does the writer want to be?', 'a doctor', ['a doctor', 'a teacher', 'a pilot'], 'I want to be a doctor.'),
      TF('The writer likes maths.', false, 'The writer does not like maths.'),
      Q('Our teacher, Miss Lee, is ___', 'funny'),
    ],
  },
  {
    topic: 'A bank visit',
    passage: "Farhod goes to the bank with his father. They want to open a bank account for Farhod. A young woman helps them. She asks for his name, age and address. Farhod is fifteen. She gives him a small card and a paper. He puts twenty dollars in his new account. His father says, \"Save a little money every month.\"",
    qs: [
      Q('Who goes to the bank with Farhod?', 'his father', ['his father', 'his mother', 'his teacher'], 'He goes with his father.'),
      Q('How much money does Farhod put in?', 'twenty dollars', ['ten dollars', 'twenty dollars', 'fifty dollars'], 'He puts twenty dollars in.'),
      Q('Who helps them?', 'a young woman', ['a young woman', 'an old man', 'a policeman'], 'A young woman helps them.'),
      TF('Farhod is twelve years old.', false, 'Farhod is fifteen.'),
      Q('She gives him a paper and a small ___', 'card'),
    ],
  },
];
