const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: "My brother's room",
    passage: "My brother Jasur has a small room. There is a bed, a desk and a blue chair in it. On the desk there is a computer and two books. The walls are white. There are many football posters on the walls. Jasur likes his room very much. He does his homework there every day after school.",
    qs: [
      Q("What colour is the chair?", "Blue", ["Blue", "Red", "White"], "The chair is blue."),
      Q("What are on the walls?", "Football posters", ["Football posters", "Photos", "Maps"], "There are football posters."),
      Q("When does Jasur do his homework?", "After school", ["After school", "In the morning", "At night"], "He does homework after school."),
      TF("Jasur's room is big.", false, "His room is small."),
      Q("On the desk there is a computer and two ___", "books", undefined, "Two books.")
    ]
  },
  {
    topic: "A taxi ride",
    passage: "Anna is at the station. She has a big bag. She takes a yellow taxi to the hotel. The driver is a friendly man called Tom. The ride is ten minutes long. The hotel is near the park. Anna pays five dollars. She says thank you and gets out of the taxi.",
    qs: [
      Q("Where is Anna at the start?", "At the station", ["At the station", "At the hotel", "At the park"], "She is at the station."),
      Q("What colour is the taxi?", "Yellow", ["Yellow", "Black", "Green"], "The taxi is yellow."),
      Q("Where is the hotel?", "Near the park", ["Near the park", "Near the station", "Near the school"], "It is near the park."),
      TF("The taxi driver is a woman.", false, "The driver is a man called Tom."),
      Q("The taxi ride to the hotel is ten ___", "minutes", undefined, "Ten minutes.")
    ]
  },
  {
    topic: "A fruit market",
    passage: "Every Saturday Dilnoza goes to the fruit market with her mother. There are many apples, oranges and bananas. The apples are red and sweet. A kilo of bananas is two dollars. Her mother buys three kilos of apples. Dilnoza likes grapes, so she buys some grapes too. They go home with two full bags.",
    qs: [
      Q("When do they go to the market?", "On Saturday", ["On Saturday", "On Sunday", "On Friday"], "Every Saturday."),
      Q("How much is a kilo of bananas?", "Two dollars", ["Two dollars", "Three dollars", "One dollar"], "Two dollars."),
      Q("What fruit does Dilnoza like?", "Grapes", ["Grapes", "Oranges", "Bananas"], "Dilnoza likes grapes."),
      TF("Her mother buys three kilos of apples.", true),
      Q("They go home with two full ___", "bags", undefined, "Two full bags.")
    ]
  },
  {
    topic: "My neighbour",
    passage: "My neighbour is Mr Brown. He is seventy years old. He lives in the house next to mine. He has a big garden with many roses. He also has a small dog called Max. Every morning he walks with Max in the park. Mr Brown is kind and he always says hello to me.",
    qs: [
      Q("How old is Mr Brown?", "Seventy", ["Seventy", "Sixty", "Eighty"], "He is seventy."),
      Q("What is the name of his dog?", "Max", ["Max", "Tom", "Rex"], "The dog is called Max."),
      Q("What is in his garden?", "Roses", ["Roses", "Apples", "Bananas"], "He has many roses."),
      TF("Mr Brown walks in the park in the evening.", false, "He walks every morning."),
      Q("Every morning Mr Brown walks with Max in the ___", "park", undefined, "In the park.")
    ]
  },
  {
    topic: "A weekend at home",
    passage: "This weekend I stay at home. On Saturday I clean my room and help my mother cook. We make soup and bread. In the evening I watch a film with my sister. On Sunday I read a book and call my friend Ali. I like quiet weekends. They are good for me.",
    qs: [
      Q("What does the writer do on Saturday?", "Cleans the room", ["Cleans the room", "Goes to school", "Plays football"], "The writer cleans the room."),
      Q("Who watches the film with the writer?", "A sister", ["A sister", "A brother", "A friend"], "The sister."),
      Q("Who does the writer call on Sunday?", "Ali", ["Ali", "Tom", "Anna"], "A friend called Ali."),
      TF("The writer goes out on Sunday.", false, "The writer reads and calls a friend at home."),
      Q("They make soup and ___", "bread", undefined, "Soup and bread.")
    ]
  },
  {
    topic: "A picnic by the river",
    passage: "On Sunday our family has a picnic by the river. The weather is sunny and warm. Father brings a big blanket. Mother has sandwiches, cheese and juice. My little brother plays with a ball. I sit under a tree and look at the water. There are four ducks on the river. We are very happy.",
    qs: [
      Q("What is the weather like?", "Sunny and warm", ["Sunny and warm", "Rainy", "Cold"], "Sunny and warm."),
      Q("Who brings the blanket?", "Father", ["Father", "Mother", "Brother"], "Father brings it."),
      Q("What does the little brother play with?", "A ball", ["A ball", "A kite", "A dog"], "A ball."),
      TF("There are four ducks on the river.", true),
      Q("The writer sits under a ___", "tree", undefined, "Under a tree.")
    ]
  },
  {
    topic: "My hobby photography",
    passage: "My hobby is photography. I have an old camera from my uncle. I take photos of flowers, birds and people. I walk in the city every Saturday and look for nice things. At home I put my photos on my computer. My mother likes the pictures of the old bridge best. One day I want a new camera.",
    qs: [
      Q("Who gives the writer the camera?", "An uncle", ["An uncle", "A father", "A friend"], "It is from his or her uncle."),
      Q("What does the writer take photos of?", "Flowers, birds and people", ["Flowers, birds and people", "Cars and trains", "Food only"], "Flowers, birds and people."),
      Q("Which pictures does mother like best?", "The old bridge", ["The old bridge", "The birds", "The flowers"], "The old bridge."),
      TF("The writer has a new camera now.", false, "The camera is old; the writer wants a new one."),
      Q("The writer walks in the city every ___", "saturday", undefined, "Every Saturday.")
    ]
  },
  {
    topic: "A bookshop",
    passage: "There is a small bookshop near my school. It has books for children and for adults. Mrs Lee works there. She is very helpful. The books for children are on the left. There are also pens, notebooks and maps. I go there on Fridays. Last week I bought a story book for six dollars.",
    qs: [
      Q("Where is the bookshop?", "Near the school", ["Near the school", "Near the park", "Near the bank"], "Near my school."),
      Q("Who works in the bookshop?", "Mrs Lee", ["Mrs Lee", "Mr Brown", "Miss Kim"], "Mrs Lee."),
      Q("Where are the children's books?", "On the left", ["On the left", "On the right", "Upstairs"], "On the left."),
      TF("The writer bought a story book for six dollars.", true),
      Q("The writer goes to the shop on ___", "fridays", undefined, "On Fridays.")
    ]
  },
  {
    topic: "A cat on the roof",
    passage: "There is a cat on our roof. It is small and grey. It cannot come down. Our neighbour Karim has a long ladder. He puts the ladder on the wall and goes up. The cat is afraid, but Karim is gentle. He takes the cat in his arms. The children give the cat some milk.",
    qs: [
      Q("What colour is the cat?", "Grey", ["Grey", "Black", "White"], "Small and grey."),
      Q("Who helps the cat?", "Karim", ["Karim", "Ali", "Tom"], "Karim."),
      Q("What does Karim use?", "A ladder", ["A ladder", "A rope", "A box"], "A long ladder."),
      TF("The cat is big.", false, "The cat is small."),
      Q("The children give the cat some ___", "milk", undefined, "Some milk.")
    ]
  },
  {
    topic: "A windy day",
    passage: "Today is a very windy day. The wind is strong and cold. Leaves fly in the air and my hat goes down the street. I run after it, but I cannot catch it. A boy picks it up and brings it to me. I say thank you. Then I go home. I want a hot cup of tea.",
    qs: [
      Q("What is the weather like today?", "Windy", ["Windy", "Sunny", "Snowy"], "Very windy."),
      Q("What goes down the street?", "The writer's hat", ["The writer's hat", "A bag", "A ball"], "The hat."),
      Q("Who brings it back?", "A boy", ["A boy", "A girl", "A man"], "A boy."),
      TF("The writer catches the hat alone.", false, "A boy picks it up."),
      Q("At home the writer wants a hot cup of ___", "tea", undefined, "Tea.")
    ]
  },
  {
    topic: "My mother's job",
    passage: "My mother is a nurse. She works at a big hospital in our city. She starts work at seven in the morning. She helps sick people and talks to their families. Sometimes she works at night. She comes home tired, but she is always kind. I want to be a nurse like her.",
    qs: [
      Q("What is the mother's job?", "Nurse", ["Nurse", "Teacher", "Driver"], "She is a nurse."),
      Q("When does she start work?", "At seven", ["At seven", "At eight", "At nine"], "Seven in the morning."),
      Q("Where does she work?", "At a hospital", ["At a hospital", "At a school", "At a shop"], "At a big hospital."),
      TF("She never works at night.", false, "Sometimes she works at night."),
      Q("Like her, the writer wants to be a ___", "nurse", undefined, "A nurse.")
    ]
  },
  {
    topic: "A toy shop",
    passage: "Sara and her father go to a toy shop. It is full of toys. There are dolls, cars, robots and games. Sara looks at a big white teddy bear. It costs twelve dollars. Her father says yes. Sara is very happy. She holds the bear and says, \"Thank you, Dad!\" They go home.",
    qs: [
      Q("Who goes to the toy shop with Sara?", "Her father", ["Her father", "Her mother", "Her brother"], "Her father."),
      Q("What colour is the teddy bear?", "White", ["White", "Brown", "Pink"], "White."),
      Q("How much is the bear?", "Twelve dollars", ["Twelve dollars", "Ten dollars", "Two dollars"], "Twelve dollars."),
      TF("Sara's father says no.", false, "He says yes."),
      Q("In the shop there are dolls, cars, robots and ___", "games", undefined, "Games.")
    ]
  },
  {
    topic: "A bird in the garden",
    passage: "A small bird comes to our garden every morning. It is red and brown. It sits on the apple tree and sings. My grandmother puts some seeds on the table for it. The bird eats and then flies away. I like to watch it from my window. It is my little friend.",
    qs: [
      Q("When does the bird come?", "Every morning", ["Every morning", "Every night", "Every Sunday"], "Every morning."),
      Q("Where does the bird sit?", "On the apple tree", ["On the apple tree", "On the roof", "On the wall"], "On the apple tree."),
      Q("Who puts out seeds?", "Grandmother", ["Grandmother", "Mother", "Sister"], "Grandmother."),
      TF("The bird is blue.", false, "It is red and brown."),
      Q("I watch the bird from my ___", "window", undefined, "From my window.")
    ]
  },
  {
    topic: "My father's car",
    passage: "My father has an old car. It is green and very small. He drives it to work every day. On Sundays we wash it together. The car has four doors and a big boot. Father says it is slow, but it is a good car. One day he wants to buy a red car.",
    qs: [
      Q("What colour is father's car?", "Green", ["Green", "Red", "Blue"], "Green."),
      Q("When do they wash the car?", "On Sundays", ["On Sundays", "On Mondays", "Every day"], "On Sundays."),
      Q("How many doors does the car have?", "Four", ["Four", "Two", "Five"], "Four doors."),
      TF("Father wants a red car one day.", true),
      Q("Every day father drives the car to ___", "work", undefined, "To work.")
    ]
  },
  {
    topic: "A school lunch",
    passage: "At twelve o'clock we have lunch at school. Today there is rice with chicken and a salad. There is also an apple for each child. I sit with my friends Madina and Leo. Madina does not eat meat, so she has rice and salad. We drink water. After lunch we play outside for twenty minutes.",
    qs: [
      Q("What time is lunch?", "Twelve o'clock", ["Twelve o'clock", "One o'clock", "Eleven o'clock"], "At twelve."),
      Q("What is there for each child?", "An apple", ["An apple", "A cake", "A banana"], "An apple."),
      Q("What do the children drink?", "Water", ["Water", "Juice", "Milk"], "Water."),
      TF("Madina eats chicken.", false, "She does not eat meat."),
      Q("After lunch they play for twenty ___", "minutes", undefined, "Twenty minutes.")
    ]
  },
  {
    topic: "A pizza restaurant",
    passage: "On Friday evening we go to a pizza restaurant. It is near our house. The waiter is a young man. My father orders a big cheese pizza. My sister wants a small pizza with tomatoes. I have a pizza with mushrooms. The pizzas are hot and very good. We pay and say goodbye.",
    qs: [
      Q("When do they go to the restaurant?", "On Friday evening", ["On Friday evening", "On Monday", "On Sunday morning"], "Friday evening."),
      Q("What pizza does father order?", "A big cheese pizza", ["A big cheese pizza", "A small pizza", "A mushroom pizza"], "A big cheese pizza."),
      Q("What does the writer have on the pizza?", "Mushrooms", ["Mushrooms", "Tomatoes", "Chicken"], "Mushrooms."),
      TF("The restaurant is far from their house.", false, "It is near their house."),
      Q("The waiter is a young ___", "man", undefined, "A young man.")
    ]
  },
  {
    topic: "My pencil case",
    passage: "I have a new pencil case. It is purple and it has a zip. Inside there are three pencils, two pens and a ruler. There is also a small rubber and a sharpener. My aunt gives it to me for my birthday. I take it to school every day. I never lose it.",
    qs: [
      Q("What colour is the pencil case?", "Purple", ["Purple", "Pink", "Black"], "Purple."),
      Q("How many pens are there?", "Two", ["Two", "Three", "Four"], "Two pens."),
      Q("Who gives the pencil case?", "An aunt", ["An aunt", "A mother", "A teacher"], "An aunt."),
      TF("The pencil case has a ruler inside.", true),
      Q("Every day the writer takes it to ___", "school", undefined, "To school.")
    ]
  },
  {
    topic: "A new teacher",
    passage: "We have a new English teacher. Her name is Miss Green. She is young and tall. She comes from London. She has long black hair and a big smile. Her classes are fun. We sing songs and play word games. On Monday she gives us a small test. I think we all like her.",
    qs: [
      Q("What is the teacher's name?", "Miss Green", ["Miss Green", "Mrs Lee", "Miss Kim"], "Miss Green."),
      Q("Where does she come from?", "London", ["London", "Paris", "Tashkent"], "London."),
      Q("What colour is her hair?", "Black", ["Black", "Brown", "Red"], "Long black hair."),
      TF("Miss Green is old.", false, "She is young."),
      Q("On Monday she gives a small ___", "test", undefined, "A small test.")
    ]
  },
  {
    topic: "A basketball game",
    passage: "Today our school plays basketball against Green School. The game is at four o'clock. Our team wears red shirts. There are many fans in the hall. Rustam is our best player. He scores ten points. At the end the score is forty to thirty-five. We win! Everybody shouts and the team is very happy.",
    qs: [
      Q("What time is the game?", "Four o'clock", ["Four o'clock", "Five o'clock", "Three o'clock"], "At four."),
      Q("What colour are the shirts?", "Red", ["Red", "Blue", "Green"], "Red shirts."),
      Q("Who is the best player?", "Rustam", ["Rustam", "Leo", "Jasur"], "Rustam."),
      TF("Their school loses the game.", false, "They win."),
      Q("Rustam scores ten ___", "points", undefined, "Ten points.")
    ]
  },
  {
    topic: "A cold winter night",
    passage: "It is a cold winter night. There is snow on the street and the sky is dark. We stay in the living room. Father makes a fire and mother brings hot tea. I wear a warm sweater and big socks. My cat sleeps near the fire. Soon I feel sleepy and go to bed.",
    qs: [
      Q("What is on the street?", "Snow", ["Snow", "Rain", "Leaves"], "Snow."),
      Q("Who makes the fire?", "Father", ["Father", "Mother", "Brother"], "Father."),
      Q("Where does the cat sleep?", "Near the fire", ["Near the fire", "On the bed", "In the garden"], "Near the fire."),
      TF("Mother brings hot tea.", true),
      Q("The writer wears big socks and a warm ___", "sweater", undefined, "A warm sweater.")
    ]
  },
  {
    topic: "At the airport",
    passage: "Karina and her parents are at the airport. They are going to fly to Turkey. First they give their bags to a woman at the desk. Then they show their tickets and passports. Their plane leaves at nine. They sit and wait in a big hall. Karina buys a magazine and a bottle of water.",
    qs: [
      Q("Where are they going to fly?", "To Turkey", ["To Turkey", "To Russia", "To Spain"], "To Turkey."),
      Q("What time does the plane leave?", "At nine", ["At nine", "At ten", "At seven"], "At nine."),
      Q("What does Karina buy?", "A magazine and water", ["A magazine and water", "A book and juice", "A hat"], "A magazine and a bottle of water."),
      TF("They show their tickets and passports.", true),
      Q("They give their bags to a woman at the ___", "desk", undefined, "At the desk.")
    ]
  },
  {
    topic: "A flower shop",
    passage: "Mrs Rose has a flower shop in the town centre. It opens at eight o'clock. There are red roses, yellow tulips and white lilies. The shop smells very nice. Today Bobur buys flowers for his grandmother. He chooses ten tulips. Mrs Rose puts them in pink paper. Bobur pays and smiles.",
    qs: [
      Q("Where is the flower shop?", "In the town centre", ["In the town centre", "Near the school", "At the station"], "In the town centre."),
      Q("What time does it open?", "At eight", ["At eight", "At nine", "At seven"], "Eight o'clock."),
      Q("What flowers does Bobur buy?", "Tulips", ["Tulips", "Roses", "Lilies"], "Ten tulips."),
      TF("Bobur buys the flowers for his mother.", false, "They are for his grandmother."),
      Q("Mrs Rose puts them in pink ___", "paper", undefined, "Pink paper.")
    ]
  },
  {
    topic: "My favourite animal",
    passage: "My favourite animal is the elephant. It is the biggest animal on land. Elephants live in Africa and Asia. They eat grass, leaves and fruit. An elephant has a long nose called a trunk. It uses it to drink water. Elephants are very clever. I see one at the zoo every summer.",
    qs: [
      Q("What is the writer's favourite animal?", "The elephant", ["The elephant", "The lion", "The horse"], "The elephant."),
      Q("Where do elephants live?", "Africa and Asia", ["Africa and Asia", "Europe", "America"], "Africa and Asia."),
      Q("What does an elephant use its trunk for?", "To drink water", ["To drink water", "To run", "To sleep"], "To drink water."),
      TF("Elephants eat meat.", false, "They eat grass, leaves and fruit."),
      Q("Every summer the writer sees one at the ___", "zoo", undefined, "At the zoo.")
    ]
  },
  {
    topic: "A trip to the dentist",
    passage: "Today I go to the dentist because my tooth hurts. The dentist is Dr Karimov. He is a tall man with glasses. I am afraid, but he is very kind. He looks at my teeth and says, \"You have one small hole.\" It takes ten minutes. Then I can go home. I must brush my teeth twice a day.",
    qs: [
      Q("Why does the writer go to the dentist?", "A tooth hurts", ["A tooth hurts", "A leg hurts", "A head hurts"], "My tooth hurts."),
      Q("What is the dentist's name?", "Dr Karimov", ["Dr Karimov", "Dr Brown", "Dr Lee"], "Dr Karimov."),
      Q("How many holes are there?", "One", ["One", "Two", "Three"], "One small hole."),
      TF("The dentist is not kind.", false, "He is very kind."),
      Q("The writer must brush his or her teeth twice a ___", "day", undefined, "Twice a day.")
    ]
  }
];
