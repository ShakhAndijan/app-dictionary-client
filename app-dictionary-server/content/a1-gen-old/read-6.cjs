const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  { topic: 'A small office',
    passage: "Aziz works in a small office. There are four desks and one big window. Aziz sits near the window. He has a computer and a phone. Every morning his boss, Mrs. Brown, brings coffee for everyone. The office is quiet, but at lunch time the workers talk and laugh.",
    qs: [
      Q('Where does Aziz sit?', 'near the window', ['near the window', 'near the door', 'near the boss']),
      Q('Who brings the coffee?', 'Mrs. Brown', ['Aziz', 'Mrs. Brown', 'a waiter']),
      Q('What does Aziz have?', 'a computer and a phone', ['a computer and a phone', 'a book and a pen', 'a lamp and a radio']),
      TF('The office is noisy all day.', false, 'The office is quiet, but the workers talk at lunch time.'),
      Q('There are ___ desks in the office.', 'four')
    ] },
  { topic: 'A school bell',
    passage: "The school bell rings at eight o'clock. Dilnoza runs to her class because she does not want to be late. Her teacher, Mr. Smith, closes the door at five past eight. The bell rings again at ten for a short break. Then the children go outside and play in the yard.",
    qs: [
      Q('When does the bell ring first?', "at eight o'clock", ["at seven o'clock", "at eight o'clock", "at ten o'clock"]),
      Q('Who is the teacher?', 'Mr. Smith', ['Mr. Smith', 'Dilnoza', 'Mrs. Brown']),
      Q('Where do the children play?', 'in the yard', ['in the class', 'in the yard', 'in the kitchen']),
      TF('Dilnoza wants to be late.', false, 'She does not want to be late.'),
      Q('The teacher closes the door at five past ___.', 'eight')
    ] },
  { topic: 'At the greengrocer',
    passage: "Malika goes to the greengrocer on Saturday. She buys two kilos of potatoes, some tomatoes and a big melon. The tomatoes are red and fresh. There are no bananas today. The greengrocer, Mr. Karim, is very friendly. He gives Malika a free apple.",
    qs: [
      Q('When does Malika go to the greengrocer?', 'on Saturday', ['on Friday', 'on Saturday', 'on Sunday']),
      Q('What does Malika buy?', 'potatoes, tomatoes and a melon', ['potatoes, tomatoes and a melon', 'bananas and apples', 'carrots and onions']),
      Q('What does Mr. Karim give her?', 'a free apple', ['a free melon', 'a free apple', 'a free banana']),
      TF('There are bananas today.', false, 'There are no bananas today.'),
      Q('The tomatoes are red and ___.', 'fresh')
    ] },
  { topic: 'My uncle in Russia',
    passage: "My uncle Rustam lives in Russia. He lives in a big city called Moscow. He works in a hospital and he is a doctor. In winter it is very cold there. Every summer he comes to Uzbekistan with his wife. We eat plov together and talk a lot.",
    qs: [
      Q('Where does Uncle Rustam live?', 'in Moscow', ['in Tashkent', 'in Moscow', 'in London']),
      Q('What is his job?', 'doctor', ['teacher', 'doctor', 'driver']),
      Q('When does he come to Uzbekistan?', 'every summer', ['every winter', 'every summer', 'every spring']),
      TF('Winter in Russia is warm.', false, 'It is very cold there in winter.'),
      Q('They eat ___ together.', 'plov')
    ] },
  { topic: 'A cooking afternoon',
    passage: "On Sunday afternoon, Sara and her mother cook together. They make soup and a salad. Sara cuts the carrots and the onions. Her mother puts some salt in the soup. There is no rice, so they use pasta. At six o'clock the whole family eats dinner.",
    qs: [
      Q('What do they make?', 'soup and a salad', ['soup and a salad', 'cake and tea', 'rice and meat']),
      Q('What does Sara cut?', 'carrots and onions', ['bread and cheese', 'carrots and onions', 'apples and pears']),
      Q('What do they use instead of rice?', 'pasta', ['pasta', 'potatoes', 'bread']),
      TF("The family eats dinner at six o'clock.", true),
      Q("Sara's mother puts some ___ in the soup.", 'salt')
    ] },
  { topic: 'A forest walk',
    passage: "Tom and his dog Max walk in the forest. The trees are tall and green. There are many birds and they sing loudly. Tom sees a small river and some flowers. Max drinks water from the river. After one hour, they sit under a big tree and eat sandwiches.",
    qs: [
      Q('Who goes to the forest?', 'Tom and his dog', ['Tom and his dog', 'Tom and his sister', 'Max and a cat']),
      Q('What does Max do at the river?', 'He drinks water', ['He swims', 'He drinks water', 'He sleeps']),
      Q('What do they eat?', 'sandwiches', ['apples', 'sandwiches', 'soup']),
      TF('They walk for five hours.', false, 'They walk for one hour.'),
      Q('The trees are tall and ___.', 'green')
    ] },
  { topic: 'My hobby chess',
    passage: "My hobby is chess. I learn it from my grandfather. He plays very well. We play every Friday evening after dinner. I can move the pawn and the king, but the queen is difficult for me. Last week I win one game. My grandfather smiles and says, \"Good job!\"",
    qs: [
      Q('Who teaches the writer chess?', 'his grandfather', ['his father', 'his grandfather', 'his teacher']),
      Q('When do they play?', 'on Friday evening', ['on Friday evening', 'on Monday morning', 'on Sunday afternoon']),
      Q('Which piece is difficult?', 'the queen', ['the king', 'the pawn', 'the queen']),
      TF('The writer wins a game last week.', true),
      Q('My grandfather plays very ___.', 'well')
    ] },
  { topic: 'A science class',
    passage: "Today we have a science class. The teacher, Ms. Green, has a small plant and a glass of water. She says plants need water and light. We put the plant near the window. Every day we look at it. After one week, there are two new leaves. We are very happy.",
    qs: [
      Q('Who is the teacher?', 'Ms. Green', ['Ms. Green', 'Mr. Smith', 'Mrs. Brown']),
      Q('What do plants need?', 'water and light', ['water and light', 'milk and bread', 'sand and stones']),
      Q('Where do they put the plant?', 'near the window', ['near the door', 'near the window', "on the teacher's desk"]),
      TF('After one week the plant has three new leaves.', false, 'There are two new leaves.'),
      Q('Every day we ___ at the plant.', 'look')
    ] },
  { topic: 'A duck',
    passage: "There is a white duck on the lake near my house. Her name is Daisy. She has orange feet and a yellow beak. Every morning I give her some bread. Daisy swims fast and she can also fly. In spring, she has five small ducklings. They follow her everywhere.",
    qs: [
      Q('What colour is the duck?', 'white', ['white', 'black', 'brown']),
      Q('What colour are her feet?', 'orange', ['yellow', 'orange', 'red']),
      Q('What does the writer give the duck?', 'bread', ['rice', 'bread', 'apples']),
      TF('The duck cannot fly.', false, 'Daisy can swim and fly.'),
      Q('In spring, she has five small ___.', 'ducklings')
    ] },
  { topic: 'A sunny beach day',
    passage: "It is a hot and sunny day. Ali and his friends are at the beach. They swim in the sea and play with a red ball. Ali's sister makes a sandcastle. Everybody wears sunglasses and a hat. At noon they drink cold juice and eat ice cream. They go home at five.",
    qs: [
      Q('What is the weather like?', 'hot and sunny', ['cold and rainy', 'hot and sunny', 'windy and cloudy']),
      Q("What does Ali's sister make?", 'a sandcastle', ['a sandcastle', 'a boat', 'a cake']),
      Q('What colour is the ball?', 'red', ['blue', 'red', 'green']),
      TF('They go home at five.', true),
      Q('At noon they drink cold ___.', 'juice')
    ] },
  { topic: "My sister's wardrobe",
    passage: "My sister Nodira has a big wardrobe in her bedroom. It is full of clothes. There are ten dresses, six skirts and many blouses. Her favourite colour is pink, so she has three pink dresses. She does not have many jeans. On Sundays she tidies her wardrobe.",
    qs: [
      Q('Where is the wardrobe?', 'in her bedroom', ['in the kitchen', 'in her bedroom', 'in the hall']),
      Q('How many dresses does she have?', 'ten', ['six', 'ten', 'three']),
      Q('What is her favourite colour?', 'pink', ['pink', 'blue', 'white']),
      TF('Nodira has many jeans.', false, 'She does not have many jeans.'),
      Q('On Sundays she ___ her wardrobe.', 'tidies')
    ] },
  { topic: 'A shoe repair shop',
    passage: "Mr. Anvar has a small shoe repair shop near the market. He opens it at nine o'clock. People bring old shoes and bags. He fixes the heels and changes the laces. A repair costs five dollars. His shop is not big, but it always smells of leather. Many people like him.",
    qs: [
      Q('Where is the shop?', 'near the market', ['near the school', 'near the market', 'near the bank']),
      Q('When does Mr. Anvar open the shop?', "at nine o'clock", ["at eight o'clock", "at nine o'clock", "at ten o'clock"]),
      Q('How much is a repair?', 'five dollars', ['two dollars', 'five dollars', 'ten dollars']),
      TF('The shop is very big.', false, 'The shop is not big.'),
      Q('The shop always smells of ___.', 'leather')
    ] },
  { topic: 'A hamster',
    passage: "My brother has a small hamster. Its name is Nibbles. It is brown and very soft. Nibbles lives in a cage in my brother's room. He eats seeds and a little carrot. At night he runs on his wheel and it is noisy. In the day, he sleeps in a box.",
    qs: [
      Q("What is the hamster's name?", 'Nibbles', ['Max', 'Nibbles', 'Daisy']),
      Q('What colour is it?', 'brown', ['brown', 'white', 'black']),
      Q('What does it eat?', 'seeds and a little carrot', ['meat and rice', 'seeds and a little carrot', 'bread and fish']),
      TF('The hamster sleeps at night.', false, 'He runs on his wheel at night and sleeps in the day.'),
      Q('The hamster lives in a ___.', 'cage')
    ] },
  { topic: 'A long bus trip',
    passage: "Bobur goes to Samarkand by bus. The trip is long. It takes five hours. He sits next to the window and looks at the mountains. He listens to music and reads a book. The bus stops once for lunch. Bobur eats a samsa and drinks tea. He arrives at four o'clock.",
    qs: [
      Q('Where does Bobur go?', 'to Samarkand', ['to Tashkent', 'to Samarkand', 'to Bukhara']),
      Q('How long is the trip?', 'five hours', ['two hours', 'five hours', 'ten hours']),
      Q('What does Bobur eat for lunch?', 'a samsa', ['a samsa', 'a sandwich', 'plov']),
      TF('The bus stops many times.', false, 'The bus stops once for lunch.'),
      Q('He listens to music and reads a ___.', 'book')
    ] },
  { topic: 'A pet shop',
    passage: "There is a pet shop on my street. In the window there are two puppies and a grey kitten. Inside, there are fish in big tanks and birds in small cages. The shop owner, Mrs. Lee, is kind. She sells food for dogs and cats, too. My little brother wants a puppy.",
    qs: [
      Q('Where is the pet shop?', 'on my street', ['on my street', 'in a park', 'near a school']),
      Q('What is in the window?', 'two puppies and a kitten', ['two puppies and a kitten', 'birds and fish', 'two cats and a dog']),
      Q('Who is the shop owner?', 'Mrs. Lee', ['Mrs. Lee', 'Mrs. Brown', 'Ms. Green']),
      TF('The fish are in small cages.', false, 'The fish are in big tanks; the birds are in small cages.'),
      Q("The writer's little brother wants a ___.", 'puppy')
    ] },
  { topic: 'A bakery morning',
    passage: "Mr. Salim is a baker. He gets up at four o'clock every morning. First, he makes the dough. Then he puts the bread in a hot oven. At six o'clock the bakery smells wonderful. Customers come at seven. They buy fresh bread, rolls and sweet cakes. By noon, everything is sold.",
    qs: [
      Q('What time does Mr. Salim get up?', "four o'clock", ["four o'clock", "six o'clock", "seven o'clock"]),
      Q('What does he make first?', 'the dough', ['the cake', 'the dough', 'the tea']),
      Q('When do customers come?', 'at seven', ['at four', 'at six', 'at seven']),
      TF('By noon, everything is sold.', true),
      Q("At six o'clock the bakery smells ___.", 'wonderful')
    ] },
  { topic: 'My watch',
    passage: "I have a new watch. My father gives it to me on my birthday. It is blue and it has a round face. I can see the time and the date on it. It is also waterproof, so I wear it in the pool. I never lose it. I put it on a shelf at night.",
    qs: [
      Q('Who gives the watch to the writer?', 'his father', ['his father', 'his uncle', 'his friend']),
      Q('What colour is the watch?', 'blue', ['red', 'blue', 'black']),
      Q('Where does he put it at night?', 'on a shelf', ['in a bag', 'on a shelf', 'in the pool']),
      TF('The watch is waterproof.', true),
      Q('The watch has a ___ face.', 'round')
    ] },
  { topic: 'A school party',
    passage: "Our school has a party on Friday. The classroom is full of balloons. Some students bring cakes and juice. Kamila brings her speaker and we dance. Our teacher, Mr. Smith, takes photos. There are twenty children in my class. Nobody is sad. At three o'clock, we clean the room and go home.",
    qs: [
      Q('When is the party?', 'on Friday', ['on Monday', 'on Friday', 'on Sunday']),
      Q('What does Kamila bring?', 'her speaker', ['her speaker', 'a cake', 'balloons']),
      Q('What does Mr. Smith do?', 'He takes photos', ['He dances', 'He takes photos', 'He brings juice']),
      TF('There are thirty children in the class.', false, 'There are twenty children in the class.'),
      Q('The classroom is full of ___.', 'balloons')
    ] },
  { topic: 'A volleyball game',
    passage: "Today there is a volleyball game at our school. The red team plays against the blue team. Each team has six players. Dana is tall, so she can hit the ball very high. The red team wins by two points. All the players shake hands. Then they drink water and rest.",
    qs: [
      Q('Who plays against the red team?', 'the blue team', ['the green team', 'the blue team', 'the yellow team']),
      Q('How many players are in each team?', 'six', ['four', 'six', 'ten']),
      Q('Why can Dana hit the ball high?', 'She is tall', ['She is tall', 'She is fast', 'She is new']),
      TF('The blue team wins.', false, 'The red team wins by two points.'),
      Q('After the game, all the players shake ___.', 'hands')
    ] },
  { topic: 'A night at home',
    passage: "It is Tuesday night and I am at home. My parents watch TV in the living room. My little sister draws a picture. I do my homework at my desk. At nine o'clock I take a shower. Then I read a book in bed. I turn off the light at ten and go to sleep.",
    qs: [
      Q('What do the parents do?', 'They watch TV', ['They cook dinner', 'They watch TV', 'They read books']),
      Q('What does the sister do?', 'She draws a picture', ['She does homework', 'She draws a picture', 'She sleeps']),
      Q('When does the writer take a shower?', "at nine o'clock", ["at eight o'clock", "at nine o'clock", "at ten o'clock"]),
      TF('The writer reads a book in bed.', true),
      Q('I turn off the light at ___.', 'ten')
    ] },
  { topic: 'At the cinema',
    passage: "Laylo and her friend go to the cinema on Saturday. The film starts at seven. They buy two tickets and one big popcorn. The film is a funny story about a cat. There are many people in the room. Laylo laughs a lot. After the film, they walk home together.",
    qs: [
      Q('When do they go to the cinema?', 'on Saturday', ['on Saturday', 'on Sunday', 'on Tuesday']),
      Q('What do they buy?', 'two tickets and popcorn', ['two tickets and popcorn', 'one ticket and juice', 'ice cream and cake']),
      Q('What is the film about?', 'a cat', ['a dog', 'a cat', 'a duck']),
      TF('The film is sad.', false, 'The film is funny and Laylo laughs a lot.'),
      Q('The film starts at ___.', 'seven')
    ] },
  { topic: 'A rose garden',
    passage: "My grandmother has a beautiful rose garden. There are red, white and yellow roses. She waters them every morning and evening. Bees visit the flowers and the garden smells sweet. Grandmother wears gloves because roses have thorns. In June she cuts some roses and puts them in a vase on the table.",
    qs: [
      Q('Who has the rose garden?', "the writer's grandmother", ["the writer's mother", "the writer's grandmother", "the writer's teacher"]),
      Q('When does she water the roses?', 'morning and evening', ['only at noon', 'morning and evening', 'only at night']),
      Q('Why does she wear gloves?', 'Roses have thorns', ['It is cold', 'Roses have thorns', 'She likes gloves']),
      TF('The roses are pink and blue.', false, 'The roses are red, white and yellow.'),
      Q('In June she puts roses in a ___.', 'vase')
    ] },
  { topic: 'My favourite sport',
    passage: "My favourite sport is swimming. I go to the pool three times a week: on Monday, Wednesday and Saturday. My coach is Mr. Ivanov. He is strict, but he is nice. I can swim fast now. Swimming makes me strong and happy. One day I want to win a big race.",
    qs: [
      Q('How often does the writer swim?', 'three times a week', ['every day', 'three times a week', 'once a week']),
      Q('Who is the coach?', 'Mr. Ivanov', ['Mr. Ivanov', 'Mr. Karim', 'Mr. Smith']),
      Q('What does the writer want to do one day?', 'win a big race', ['win a big race', 'be a coach', 'play chess']),
      TF('The writer goes to the pool on Friday.', false, 'He goes on Monday, Wednesday and Saturday.'),
      Q('Swimming makes me strong and ___.', 'happy')
    ] },
  { topic: 'A hair salon',
    passage: "Gulnora goes to the hair salon on Thursday. The hairdresser, Anna, washes her hair first. Then she cuts it. Gulnora wants short hair this time. The salon has big mirrors and comfortable chairs. It takes one hour. Gulnora pays ten dollars and says, \"Thank you!\" She loves her new hair.",
    qs: [
      Q('Who is the hairdresser?', 'Anna', ['Anna', 'Sara', 'Malika']),
      Q('What does Gulnora want?', 'short hair', ['long hair', 'short hair', 'red hair']),
      Q('How long does it take?', 'one hour', ['one hour', 'two hours', 'ten minutes']),
      TF('Gulnora pays twenty dollars.', false, 'She pays ten dollars.'),
      Q('The salon has big ___ and comfortable chairs.', 'mirrors')
    ] }
];
