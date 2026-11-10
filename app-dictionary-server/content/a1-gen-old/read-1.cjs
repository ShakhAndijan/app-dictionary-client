const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'My bedroom',
    passage: "My name is Aziz. My bedroom is small, but I like it. There is a bed, a desk and a blue chair. On the desk there is a lamp and three books. I have one window. In the morning, the sun comes into my room. My cat sleeps on the bed.",
    qs: [
      Q('How many windows are in the room?', 'One', ['One', 'Two', 'Three']),
      Q('What colour is the chair?', 'Blue', ['Red', 'Blue', 'Green']),
      Q('Where does the cat sleep?', 'On the bed', ['On the desk', 'On the bed', 'On the chair']),
      TF('The bedroom is very big.', false, 'The bedroom is small.'),
      Q('There are three books on the ___', 'desk'),
    ],
  },
  {
    topic: 'A bus ride',
    passage: "Every morning, Dilnoza takes the number five bus to school. The bus comes at eight o'clock. It is often full, but today there is a seat near the window. The ride is twenty minutes long. She looks at the shops and the people. She gets off at the school gate.",
    qs: [
      Q('Which bus does Dilnoza take?', 'Number five', ['Number three', 'Number five', 'Number eight']),
      Q('How long is the ride?', 'Twenty minutes', ['Ten minutes', 'Twenty minutes', 'One hour']),
      Q('Where is her seat today?', 'Near the window', ['Near the door', 'Near the window', 'At the back']),
      TF('The bus is always empty.', false, 'The bus is often full.'),
      Q('She gets off at the school ___', 'gate'),
    ],
  },
  {
    topic: 'At the bakery',
    passage: "Tom goes to the bakery with his mother on Saturday. The bakery smells very good. They buy two loaves of bread and six rolls. Tom also wants a chocolate cake, but it is too expensive. The baker is a kind woman. She gives Tom a small biscuit for free.",
    qs: [
      Q('Who goes to the bakery with Tom?', 'His mother', ['His mother', 'His sister', 'His teacher']),
      Q('How many rolls do they buy?', 'Six', ['Two', 'Six', 'Ten']),
      Q('Why does Tom not get the cake?', 'It is too expensive', ['It is too expensive', 'It is too big', 'It is finished']),
      TF('The baker gives Tom a biscuit.', true),
      Q('They go to the bakery on ___', 'saturday'),
    ],
  },
  {
    topic: 'My cousin',
    passage: "My cousin is called Jasur. He is twelve years old and he lives in Samarkand. He is tall and he has short black hair. Jasur likes chess and he plays every evening. In summer, he visits my family. We swim in the river and eat melon together.",
    qs: [
      Q('How old is Jasur?', 'Twelve', ['Ten', 'Twelve', 'Fifteen']),
      Q('Where does Jasur live?', 'In Samarkand', ['In Samarkand', 'In Tashkent', 'In Bukhara']),
      Q('What game does he like?', 'Chess', ['Football', 'Chess', 'Cards']),
      TF('Jasur visits the family in winter.', false, 'He visits in summer.'),
      Q('Jasur has short black ___', 'hair'),
    ],
  },
  {
    topic: 'A school day',
    passage: "Anna gets up at seven o'clock. She eats breakfast and walks to school with her friend Sara. Lessons start at half past eight. Anna has maths, English and art today. At lunch, she eats a sandwich and an apple. School finishes at three, and she goes home.",
    qs: [
      Q('When does Anna get up?', 'At seven', ['At six', 'At seven', 'At eight']),
      Q('Who walks to school with Anna?', 'Sara', ['Sara', 'Her mother', 'Her brother']),
      Q('What does Anna eat at lunch?', 'A sandwich and an apple', ['Rice and soup', 'A sandwich and an apple', 'Pizza and juice']),
      TF('School finishes at three.', true),
      Q('Anna has maths, English and ___ today.', 'art'),
    ],
  },
  {
    topic: 'A picnic',
    passage: "On Sunday, our family goes for a picnic by the lake. Father carries a big blanket. Mother makes sandwiches and fruit salad. My brother Ali brings a ball. We sit under a tree and eat. There are some ducks on the water. After lunch, we play games and take photos.",
    qs: [
      Q('Where is the picnic?', 'By the lake', ['By the lake', 'In the forest', 'At school']),
      Q('Who brings a ball?', 'Ali', ['Father', 'Mother', 'Ali']),
      Q('What does Mother make?', 'Sandwiches and fruit salad', ['Soup and bread', 'Sandwiches and fruit salad', 'Cake and tea']),
      TF('There are no animals at the lake.', false, 'There are some ducks on the water.'),
      Q('We sit under a ___', 'tree'),
    ],
  },
  {
    topic: 'My hobby: drawing',
    passage: "My hobby is drawing. I draw every day after school. I have a big box of pencils and a book with white pages. I like to draw animals, and my best picture is a horse. My teacher says it is very good. On Friday, I want to give it to my grandfather.",
    qs: [
      Q('When does the writer draw?', 'After school', ['In the morning', 'After school', 'At night']),
      Q('What is the best picture?', 'A horse', ['A cat', 'A horse', 'A bird']),
      Q('Who likes the picture?', 'The teacher', ['The teacher', 'The doctor', 'The baker']),
      TF('The writer wants to give the picture to a friend.', false, 'The picture is for the writer\'s grandfather.'),
      Q('The writer draws ___ day.', 'every'),
    ],
  },
  {
    topic: 'The library',
    passage: "Our school library is quiet and warm. There are many shelves with books for children. Maria goes there on Tuesday and Thursday. She can take two books home for one week. Today she takes a book about dogs. The librarian, Mr Karim, writes the name in a big notebook.",
    qs: [
      Q('Which days does Maria go to the library?', 'Tuesday and Thursday', ['Monday and Friday', 'Tuesday and Thursday', 'Saturday and Sunday']),
      Q('How many books can she take home?', 'Two', ['One', 'Two', 'Five']),
      Q('What is her book about?', 'Dogs', ['Dogs', 'Cars', 'Space']),
      TF('The library is noisy.', false, 'The library is quiet.'),
      Q('The librarian is Mr ___', 'karim'),
    ],
  },
  {
    topic: "My uncle's farm",
    passage: "My uncle has a farm near the mountains. There are five cows, ten sheep and many chickens. Every morning, my uncle gets fresh milk from the cows. I help him in the holidays. I give food to the chickens and collect eggs. The farm is noisy, but I love it.",
    qs: [
      Q('How many cows are there?', 'Five', ['Five', 'Ten', 'Twelve']),
      Q('What does the uncle get from the cows?', 'Milk', ['Eggs', 'Milk', 'Wool']),
      Q('When does the writer help on the farm?', 'In the holidays', ['In the holidays', 'On Mondays', 'At night']),
      TF('The farm is near the sea.', false, 'It is near the mountains.'),
      Q('I collect ___ from the chickens.', 'eggs'),
    ],
  },
  {
    topic: 'A rainy morning',
    passage: "It is a rainy morning. The sky is grey and the wind is cold. Nodira takes her red umbrella and wears her yellow coat. The streets are wet and there are puddles everywhere. A little boy jumps in a puddle and laughs. Nodira smiles. She likes the rain, but she wants a hot tea.",
    qs: [
      Q('What colour is the umbrella?', 'Red', ['Red', 'Yellow', 'Grey']),
      Q('What does the little boy do?', 'He jumps in a puddle', ['He runs home', 'He jumps in a puddle', 'He sings a song']),
      Q('What does Nodira want?', 'A hot tea', ['A hot tea', 'A cold drink', 'A new coat']),
      TF('The sky is blue.', false, 'The sky is grey.'),
      Q('The streets are ___', 'wet'),
    ],
  },
  {
    topic: 'Our class timetable',
    passage: "Our class timetable is on the wall. On Monday, we have English and music. On Tuesday, we have science and sport. Wednesday is my favourite day because we have art all morning. On Thursday, we have maths. On Friday, we have a short test and then we go home early.",
    qs: [
      Q('What lessons do they have on Monday?', 'English and music', ['English and music', 'Science and sport', 'Maths and art']),
      Q("Which day is the writer's favourite?", 'Wednesday', ['Tuesday', 'Wednesday', 'Friday']),
      Q('What do they have on Thursday?', 'Maths', ['Maths', 'Art', 'Sport']),
      TF('They have a test on Friday.', true),
      Q('The timetable is on the ___', 'wall'),
    ],
  },
  {
    topic: 'A new shoe shop',
    passage: "There is a new shoe shop in our street. It opens at nine o'clock every day. The shop sells black, white and brown shoes. Kamila wants a pair of white shoes for school. The shoes are forty dollars. She tries a size thirty-six, and they are too small. The man brings size thirty-seven.",
    qs: [
      Q('When does the shop open?', 'At nine', ['At eight', 'At nine', 'At ten']),
      Q('What colour shoes does Kamila want?', 'White', ['Black', 'White', 'Brown']),
      Q('How much are the shoes?', 'Forty dollars', ['Ten dollars', 'Forty dollars', 'Sixty dollars']),
      TF('Size thirty-six is too big.', false, 'Size thirty-six is too small.'),
      Q('The shop is in our ___', 'street'),
    ],
  },
  {
    topic: 'A fish tank',
    passage: "We have a fish tank in the living room. There are six small fish in it. Two fish are orange and four are silver. I give them food every morning. My father cleans the tank on Sundays. There are green plants and a little house at the bottom. My sister likes to watch the fish.",
    qs: [
      Q('How many fish are there?', 'Six', ['Four', 'Six', 'Eight']),
      Q('What colour are two of the fish?', 'Orange', ['Orange', 'Blue', 'Black']),
      Q('Who cleans the tank?', 'Father', ['Mother', 'Father', 'Sister']),
      TF('The writer feeds the fish in the evening.', false, 'The writer feeds them every morning.'),
      Q('The tank is in the living ___', 'room'),
    ],
  },
  {
    topic: "My grandmother's kitchen",
    passage: "My grandmother's kitchen is my favourite place. It is warm and it smells of bread. There is a big table in the middle. Grandmother cooks soup and plov for us on Sundays. She has an old green teapot on the stove. I sit at the table and help her cut the carrots.",
    qs: [
      Q('What does the kitchen smell of?', 'Bread', ['Fish', 'Bread', 'Flowers']),
      Q('What colour is the teapot?', 'Green', ['Green', 'White', 'Red']),
      Q('What does the writer cut?', 'Carrots', ['Onions', 'Carrots', 'Apples']),
      TF('Grandmother cooks on Sundays.', true),
      Q('There is a big ___ in the middle.', 'table'),
    ],
  },
  {
    topic: 'The park on Sunday',
    passage: "On Sunday, the park is full of people. Children play on the swings and the slide. An old man sits on a bench and reads a newspaper. Two girls ride their bikes on the path. There is a small shop near the gate. It sells ice cream, and there is a long line of children.",
    qs: [
      Q('Where do the children play?', 'On the swings and the slide', ['On the swings and the slide', 'In the lake', 'In the shop']),
      Q('What does the old man read?', 'A newspaper', ['A book', 'A newspaper', 'A letter']),
      Q('What does the small shop sell?', 'Ice cream', ['Ice cream', 'Shoes', 'Flowers']),
      TF('The two girls ride bikes.', true),
      Q('The old man sits on a ___', 'bench'),
    ],
  },
  {
    topic: 'A small cafe',
    passage: "Ben works in a small cafe near the station. The cafe has six tables and a big window. It opens at seven in the morning. Many people come for coffee and toast. Ben makes the coffee, and his friend Lena takes the money. On cold days, the cafe is very busy.",
    qs: [
      Q('How many tables are there?', 'Six', ['Four', 'Six', 'Ten']),
      Q('When does the cafe open?', 'At seven', ['At six', 'At seven', 'At nine']),
      Q('Who makes the coffee?', 'Ben', ['Ben', 'Lena', 'The owner']),
      TF('The cafe is far from the station.', false, 'The cafe is near the station.'),
      Q('People come for coffee and ___', 'toast'),
    ],
  },
  {
    topic: 'My school bag',
    passage: "My school bag is new. It is black and it has two big pockets. In one pocket, I put my books and notebooks. In the other pocket, I put my pencil case and my lunch box. My bag is heavy on Mondays because I have five lessons. My mother bought it for me in September.",
    qs: [
      Q('What colour is the bag?', 'Black', ['Black', 'Blue', 'Pink']),
      Q('What is in the other pocket?', 'A pencil case and a lunch box', ['Books and notebooks', 'A pencil case and a lunch box', 'A phone and keys']),
      Q('Why is the bag heavy on Mondays?', 'There are five lessons', ['There are five lessons', 'There is a big lunch', 'There is a new bag']),
      TF('The bag has two pockets.', true),
      Q('My mother bought it in ___', 'september'),
    ],
  },
  {
    topic: 'A birthday card',
    passage: "Today is my friend Leyla's birthday. She is ten years old. I make a card for her with red paper. On the card, I draw a big cake and ten candles. I write, \"Happy birthday, Leyla!\" Then I put the card in a blue envelope. I give it to her at the party at four o'clock.",
    qs: [
      Q('How old is Leyla?', 'Ten', ['Nine', 'Ten', 'Twelve']),
      Q('What colour is the paper of the card?', 'Red', ['Red', 'Blue', 'White']),
      Q('What does the writer draw on the card?', 'A cake and candles', ['A cat', 'A cake and candles', 'A house']),
      TF("The party is at six o'clock.", false, "The party is at four o'clock."),
      Q('The card is in a blue ___', 'envelope'),
    ],
  },
  {
    topic: 'A football team',
    passage: "Our school has a football team. There are eleven players and a coach. The coach is Mr Brown. The team trains on Wednesday and Friday after school. The players wear green shirts and white shorts. On Saturday, they have a big match against another school. Everyone wants to win, but it is most important to have fun.",
    qs: [
      Q('How many players are in the team?', 'Eleven', ['Seven', 'Eleven', 'Twenty']),
      Q('When does the team train?', 'Wednesday and Friday', ['Monday and Tuesday', 'Wednesday and Friday', 'Saturday and Sunday']),
      Q('What colour are the shirts?', 'Green', ['Green', 'Red', 'Yellow']),
      TF('The match is on Saturday.', true),
      Q('The coach is Mr ___', 'brown'),
    ],
  },
  {
    topic: 'A hot summer day',
    passage: "Today is a very hot summer day. The sun is bright and there are no clouds. Omar and his sister stay home in the morning. They drink cold water and eat watermelon. In the afternoon, they go to the pool. The water is cool and nice. They swim for two hours and then go home.",
    qs: [
      Q('What is the weather like?', 'Hot and sunny', ['Cold and rainy', 'Hot and sunny', 'Windy and grey']),
      Q('What do they eat at home?', 'Watermelon', ['Watermelon', 'Soup', 'Pizza']),
      Q('Where do they go in the afternoon?', 'To the pool', ['To school', 'To the pool', 'To the market']),
      TF('They swim for two hours.', true),
      Q('There are no ___ in the sky.', 'clouds'),
    ],
  },
  {
    topic: 'At the train station',
    passage: "Rustam and his father are at the train station. The train to Bukhara is at ten fifteen. Father buys two tickets at the small window. The platform is busy with many people and bags. Rustam sees the train coming. It is long and blue. They find their seats in carriage four.",
    qs: [
      Q('Where is the train going?', 'To Bukhara', ['To Bukhara', 'To Khiva', 'To Termez']),
      Q('How many tickets does Father buy?', 'Two', ['One', 'Two', 'Three']),
      Q('What colour is the train?', 'Blue', ['Blue', 'Red', 'White']),
      TF('Their seats are in carriage four.', true),
      Q('Father buys the tickets at the small ___', 'window'),
    ],
  },
  {
    topic: 'A garden',
    passage: "Grandfather has a lovely garden behind his house. There are red roses, yellow flowers and a big apple tree. He also has some tomatoes and onions. He works in the garden every morning before breakfast. In autumn, I help him pick the apples. We put them in a basket and take them to the kitchen.",
    qs: [
      Q("What is behind Grandfather's house?", 'A garden', ['A garden', 'A shop', 'A river']),
      Q('What colour are the roses?', 'Red', ['Red', 'Pink', 'White']),
      Q('When does Grandfather work in the garden?', 'Before breakfast', ['Before breakfast', 'After dinner', 'At night']),
      TF('The writer picks apples in spring.', false, 'The writer picks apples in autumn.'),
      Q('We put the apples in a ___', 'basket'),
    ],
  },
  {
    topic: 'My favourite colour',
    passage: "My favourite colour is green. Grass is green and many trees are green. My room has green walls and a green carpet. I have a green jacket, too. My friend Timur likes red because it is the colour of his football team. My little sister likes pink. What is your favourite colour?",
    qs: [
      Q("What is the writer's favourite colour?", 'Green', ['Green', 'Red', 'Pink']),
      Q('Why does Timur like red?', "It is his team's colour", ["It is his team's colour", 'It is the colour of his room', 'It is the colour of grass']),
      Q('Which colour does the little sister like?', 'Pink', ['Blue', 'Pink', 'Yellow']),
      TF('The writer has a green jacket.', true),
      Q('The walls in the room are ___', 'green'),
    ],
  },
  {
    topic: 'A visit to the doctor',
    passage: "Yesterday, Sofia had a sore throat and a headache. Her mother took her to the doctor. The doctor was a friendly man. He looked at her throat and said, \"You have a cold.\" He gave Sofia some medicine. She must drink warm tea and stay in bed for two days. Today she feels a little better.",
    qs: [
      Q('What was wrong with Sofia?', 'She had a cold', ['She had a cold', 'She broke her leg', 'She was hungry']),
      Q('Who took Sofia to the doctor?', 'Her mother', ['Her mother', 'Her father', 'Her teacher']),
      Q('How long must she stay in bed?', 'Two days', ['One day', 'Two days', 'One week']),
      TF('The doctor was unfriendly.', false, 'The doctor was friendly.'),
      Q('She must drink warm ___', 'tea'),
    ],
  },
];
