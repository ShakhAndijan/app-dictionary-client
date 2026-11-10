const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  { topic: "My sister's day", passage: "My sister Madina gets up at six o'clock. She eats bread and drinks tea. Then she goes to school by bus. She has five lessons every day. After school she does her homework with a friend. In the evening she helps my mother in the kitchen. She goes to bed at ten.", qs: [
    Q("What time does Madina get up?", "At six o'clock", ["At six o'clock", "At seven o'clock", "At ten o'clock"]),
    Q("How does she go to school?", "By bus", ["By bus", "By bike", "On foot"]),
    Q("Who does she do homework with?", "A friend", ["A friend", "My father", "A teacher"]),
    TF("Madina goes to bed at nine.", false, "She goes to bed at ten."),
    Q("She has five ___ every day.", "lessons") ] },
  { topic: "A bike ride", passage: "Today is sunny, so Tom rides his bike to the park. His bike is red and it has a small bell. In the park there is a big tree and a little river. Tom stops and drinks some water. Then he sees two ducks on the river. He takes a photo of them and rides home.", qs: [
    Q("What colour is Tom's bike?", "Red", ["Red", "Blue", "Green"]),
    Q("Where does Tom ride?", "To the park", ["To the park", "To school", "To a shop"]),
    Q("What does Tom see on the river?", "Two ducks", ["Two ducks", "A boat", "Some fish"]),
    TF("The weather is rainy today.", false, "Today is sunny."),
    Q("Tom drinks some ___ in the park.", "water") ] },
  { topic: "At the butcher's", passage: "Aziz goes to the butcher's with his mother. The shop is small and clean. His mother buys two kilos of beef and one chicken. The butcher is a kind man called Mr Karim. He puts the meat in a bag. Aziz carries the bag home. They are going to cook soup for dinner.", qs: [
    Q("Who goes to the butcher's with Aziz?", "His mother", ["His mother", "His sister", "His friend"]),
    Q("What does his mother buy?", "Beef and a chicken", ["Beef and a chicken", "Fish and rice", "Eggs and milk"]),
    Q("What is the butcher's name?", "Mr Karim", ["Mr Karim", "Mr Tom", "Mr Aziz"]),
    TF("They are going to cook soup for dinner.", true),
    Q("Aziz carries the ___ home.", "bag") ] },
  { topic: "My friend from another city", passage: "My friend Emma lives in London. She is twelve years old. We are friends because we write letters to each other. Emma has a brown dog called Max. She likes music and swimming. Next summer she is going to visit me in Tashkent. I am very happy about that.", qs: [
    Q("Where does Emma live?", "In London", ["In London", "In Tashkent", "In Paris"]),
    Q("What is the name of her dog?", "Max", ["Max", "Tom", "Ben"]),
    Q("How old is Emma?", "Twelve", ["Twelve", "Ten", "Fourteen"]),
    TF("Emma does not like swimming.", false, "Emma likes music and swimming."),
    Q("Emma and I write ___ to each other.", "letters") ] },
  { topic: "A Saturday morning", passage: "On Saturday I do not go to school. I wake up at eight and have eggs for breakfast. Then I clean my room with my brother. At ten o'clock we go to the market with Dad. We buy apples, bread and cheese. At home we play football in the yard until lunch.", qs: [
    Q("What time do I wake up?", "At eight", ["At eight", "At six", "At ten"]),
    Q("What do I have for breakfast?", "Eggs", ["Eggs", "Rice", "Soup"]),
    Q("Who goes to the market with us?", "Dad", ["Dad", "Mum", "Grandma"]),
    TF("We play football in the yard.", true),
    Q("We buy apples, bread and ___ at the market.", "cheese") ] },
  { topic: "A day at the lake", passage: "Last Sunday we were at the lake. The water was cold but clear. My father and uncle sat near the water and fished. My cousin and I swam for one hour. We had sandwiches and juice under a big tree. Dad caught three fish. We went home at six o'clock.", qs: [
    Q("When were they at the lake?", "Last Sunday", ["Last Sunday", "Last Friday", "Yesterday"]),
    Q("What did they eat under the tree?", "Sandwiches", ["Sandwiches", "Soup", "Pizza"]),
    Q("How many fish did Dad catch?", "Three", ["Three", "Five", "Ten"]),
    TF("The water was hot.", false, "The water was cold."),
    Q("We swam for one ___.", "hour") ] },
  { topic: "My hobby, dancing", passage: "My hobby is dancing. I go to a dance class on Monday and Thursday. The class is at five o'clock. Our teacher is Miss Laura. She is young and funny. We dance to fast music and we wear black shoes. My friend Dilnoza dances with me. I love my class.", qs: [
    Q("When is the dance class?", "On Monday and Thursday", ["On Monday and Thursday", "On Saturday", "Every day"]),
    Q("Who is the teacher?", "Miss Laura", ["Miss Laura", "Miss Dilnoza", "Mrs Smith"]),
    Q("What colour are the dance shoes?", "Black", ["Black", "White", "Red"]),
    TF("The class is at five o'clock.", true),
    Q("My friend ___ dances with me.", "dilnoza") ] },
  { topic: "A computer room", passage: "There is a computer room in our school. It has twelve computers and a big white screen. Students come here on Tuesday. The teacher, Mr Brown, shows us how to write and draw. We can not eat or drink in this room. I like it because I can play a learning game.", qs: [
    Q("How many computers are there?", "Twelve", ["Twelve", "Two", "Twenty"]),
    Q("When do students come to the room?", "On Tuesday", ["On Tuesday", "On Sunday", "On Friday"]),
    Q("Who is the teacher?", "Mr Brown", ["Mr Brown", "Mr Green", "Mr White"]),
    TF("Students can eat in the computer room.", false, "They can not eat or drink there."),
    Q("The room has a big white ___.", "screen") ] },
  { topic: "A horse", passage: "My uncle has a horse. It is big and brown, and its name is Star. Star lives in a small house next to the garden. He eats grass and carrots. Every morning my uncle gives him water. On Sundays I ride Star slowly. He is a very friendly animal.", qs: [
    Q("What is the horse's name?", "Star", ["Star", "Sun", "Moon"]),
    Q("What colour is the horse?", "Brown", ["Brown", "Black", "White"]),
    Q("What does Star eat?", "Grass and carrots", ["Grass and carrots", "Meat", "Bread"]),
    TF("The narrator rides the horse on Sundays.", true),
    Q("My ___ has a horse.", "uncle") ] },
  { topic: "A foggy morning", passage: "This morning it is foggy. I can not see the tall house across the street. The cars drive slowly and their lights are on. It is also a little cold, so I wear my warm coat. My brother says the fog is like a white cloud. At noon the sun comes out and the fog goes away.", qs: [
    Q("What is the weather this morning?", "Foggy", ["Foggy", "Sunny", "Snowy"]),
    Q("How do the cars drive?", "Slowly", ["Slowly", "Fast", "Loudly"]),
    Q("What does the narrator wear?", "A warm coat", ["A warm coat", "A hat", "Sunglasses"]),
    TF("The fog goes away at night.", false, "The fog goes away at noon."),
    Q("My brother says the fog is like a white ___.", "cloud") ] },
  { topic: "My grandfather's garden", passage: "My grandfather has a beautiful garden. There are red roses, yellow flowers and two apple trees. He works in the garden every morning. He wears an old hat and uses a small spade. In autumn we eat the apples together. My grandfather says, \"A garden makes people happy.\"", qs: [
    Q("How many apple trees are there?", "Two", ["Two", "Three", "Ten"]),
    Q("What does grandfather wear in the garden?", "An old hat", ["An old hat", "A new coat", "Big boots"]),
    Q("When does he work in the garden?", "Every morning", ["Every morning", "Every evening", "On Sundays"]),
    TF("There are red roses in the garden.", true),
    Q("We eat the apples in ___.", "autumn") ] },
  { topic: "A clothes shop", passage: "Sara and her mother are in a clothes shop. Sara wants a new dress for her birthday. There are many dresses on the wall. She likes a blue dress with small white flowers. It is thirty dollars. The shop assistant says, \"Do you want a bigger size?\" Sara says yes. Her mother pays.", qs: [
    Q("What does Sara want?", "A new dress", ["A new dress", "A new bag", "New shoes"]),
    Q("What colour is the dress?", "Blue", ["Blue", "Pink", "Yellow"]),
    Q("How much is the dress?", "Thirty dollars", ["Thirty dollars", "Ten dollars", "Fifty dollars"]),
    TF("Sara's father pays for the dress.", false, "Her mother pays."),
    Q("Sara wants a dress for her ___.", "birthday") ] },
  { topic: "My turtle", passage: "I have a turtle at home. Its name is Sami. Sami is small and green, and he is ten years old. He lives in a big box with water and stones. He eats lettuce and a little fruit. Sami is very slow, but he can swim well. I clean his box every Saturday.", qs: [
    Q("What is the turtle's name?", "Sami", ["Sami", "Sara", "Sam"]),
    Q("What colour is Sami?", "Green", ["Green", "Brown", "Grey"]),
    Q("What does Sami eat?", "Lettuce and fruit", ["Lettuce and fruit", "Meat", "Cake"]),
    TF("Sami can swim well.", true),
    Q("I clean his box every ___.", "saturday") ] },
  { topic: "A family dinner", passage: "On Friday we have a family dinner. My grandmother cooks plov, and my aunt makes a big salad. There are nine people at the table: my parents, my grandparents, my aunt, my uncle and two children. After dinner we drink tea and eat sweet cake. We talk and laugh a lot.", qs: [
    Q("What day is the family dinner?", "Friday", ["Friday", "Sunday", "Monday"]),
    Q("Who cooks plov?", "My grandmother", ["My grandmother", "My aunt", "My mother"]),
    Q("How many people are at the table?", "Nine", ["Nine", "Five", "Twelve"]),
    TF("My aunt makes a big salad.", true),
    Q("After dinner we drink ___ and eat cake.", "tea") ] },
  { topic: "A playground", passage: "There is a new playground near my house. It has two slides, three swings and a sandpit. Many children play there after school. Bobur likes the red slide best. His little sister plays in the sandpit with a blue bucket. Their mother sits on a bench and reads a book.", qs: [
    Q("How many swings are there?", "Three", ["Three", "Two", "Five"]),
    Q("What does Bobur like best?", "The red slide", ["The red slide", "The swings", "The sandpit"]),
    Q("What does his sister have?", "A blue bucket", ["A blue bucket", "A red ball", "A green toy"]),
    TF("The playground is far from my house.", false, "It is near my house."),
    Q("Their mother reads a ___ on a bench.", "book") ] },
  { topic: "A tea house", passage: "Near the market there is an old tea house. Men and women sit on soft carpets and drink green tea. The owner, Mr Rashid, brings hot bread and sweet raisins. It is quiet and warm inside. My father goes there every Sunday with his friends. They talk about the news for two hours.", qs: [
    Q("Where is the tea house?", "Near the market", ["Near the market", "Near the school", "Near the lake"]),
    Q("What do people drink?", "Green tea", ["Green tea", "Coffee", "Juice"]),
    Q("Who is the owner?", "Mr Rashid", ["Mr Rashid", "Mr Karim", "Mr Brown"]),
    TF("My father goes there every Sunday.", true),
    Q("Mr Rashid brings hot bread and sweet ___.", "raisins") ] },
  { topic: "My desk", passage: "I have a small desk in my room. It is brown and it stands near the window. On the desk there is a lamp, a green cup and four books. In the cup there are some pens and pencils. I do my homework at the desk every day. I keep it clean and tidy.", qs: [
    Q("Where is the desk?", "Near the window", ["Near the window", "Near the door", "In the kitchen"]),
    Q("What colour is the cup?", "Green", ["Green", "Red", "White"]),
    Q("How many books are on the desk?", "Four", ["Four", "Two", "Six"]),
    TF("There are pens and pencils in the cup.", true),
    Q("I do my ___ at the desk every day.", "homework") ] },
  { topic: "A wedding invitation", passage: "Today I have a letter from my cousin Zarina. It is a wedding invitation. The wedding is on Saturday, the tenth of June, at four o'clock. It is in a big white hall in the city. Zarina is going to wear a long red dress. I am happy and I am going to buy a present.", qs: [
    Q("Who sends the letter?", "My cousin Zarina", ["My cousin Zarina", "My aunt", "My friend"]),
    Q("What time is the wedding?", "At four o'clock", ["At four o'clock", "At six o'clock", "At noon"]),
    Q("What is the colour of Zarina's dress?", "Red", ["Red", "White", "Blue"]),
    TF("The wedding is on Sunday.", false, "The wedding is on Saturday."),
    Q("I am going to buy a ___.", "present") ] },
  { topic: "A swimming pool", passage: "The city swimming pool opens at eight o'clock. It is very big and the water is warm. There are six lanes for swimmers. Children learn to swim in the small pool. Each person must take a shower first and wear a hat. My brother swims there on Wednesday and Saturday.", qs: [
    Q("When does the pool open?", "At eight o'clock", ["At eight o'clock", "At nine o'clock", "At six o'clock"]),
    Q("How many lanes are there?", "Six", ["Six", "Two", "Ten"]),
    Q("Where do children learn to swim?", "In the small pool", ["In the small pool", "In the lake", "In the big pool"]),
    TF("The water in the pool is cold.", false, "The water is warm."),
    Q("Each person must take a ___ first.", "shower") ] },
  { topic: "A spring day", passage: "Spring is my favourite season. Today the sun is warm and the sky is blue. The trees have small green leaves and the birds sing. Children wear light jackets and play outside. My mother opens all the windows. After school I walk with my dog by the river.", qs: [
    Q("What is the narrator's favourite season?", "Spring", ["Spring", "Winter", "Summer"]),
    Q("What colour is the sky?", "Blue", ["Blue", "Grey", "White"]),
    Q("What does the mother open?", "All the windows", ["All the windows", "The door", "The shop"]),
    TF("The narrator walks with a dog.", true),
    Q("The birds ___ in the trees.", "sing") ] },
  { topic: "At the bus stop", passage: "It is half past seven and I am at the bus stop. There are five people here. An old man reads a newspaper and a girl listens to music. The bus number twelve comes at eight o'clock. Today it is late, so I wait for ten more minutes. At last the bus arrives and we get on.", qs: [
    Q("What time is it at the start?", "Half past seven", ["Half past seven", "Eight o'clock", "Six o'clock"]),
    Q("Which bus does the narrator take?", "Number twelve", ["Number twelve", "Number five", "Number ten"]),
    Q("What does the old man read?", "A newspaper", ["A newspaper", "A book", "A letter"]),
    TF("The bus is on time today.", false, "Today the bus is late."),
    Q("There are five ___ at the bus stop.", "people") ] },
  { topic: "A vegetable garden", passage: "Behind our house there is a small vegetable garden. We have tomatoes, onions and carrots. My mother waters the plants early in the morning. Some tomatoes are red now, but others are still green. My father says we can eat them next week. We do not buy vegetables in summer because our garden gives us enough.", qs: [
    Q("Where is the vegetable garden?", "Behind our house", ["Behind our house", "Near the school", "In the city"]),
    Q("Who waters the plants?", "My mother", ["My mother", "My father", "My brother"]),
    Q("When can we eat the green tomatoes?", "Next week", ["Next week", "Today", "Next year"]),
    TF("We have potatoes in the garden.", false, "We have tomatoes, onions and carrots."),
    Q("We have tomatoes, onions and ___.", "carrots") ] },
  { topic: "My favourite food", passage: "My favourite food is pasta with cheese. My mother makes it on Sundays. She cooks the pasta in hot water for ten minutes. Then she adds butter, cheese and a little salt. I eat two plates and drink a glass of milk. My sister does not like pasta. She likes pizza.", qs: [
    Q("What is the favourite food?", "Pasta with cheese", ["Pasta with cheese", "Pizza", "Rice with meat"]),
    Q("When does mother make it?", "On Sundays", ["On Sundays", "On Mondays", "Every day"]),
    Q("What does the narrator drink?", "Milk", ["Milk", "Tea", "Juice"]),
    TF("My sister likes pasta best.", false, "She does not like pasta. She likes pizza."),
    Q("She cooks the pasta for ten ___.", "minutes") ] },
  { topic: "A visit to a hospital", passage: "Yesterday I visited my aunt in the hospital. She has a bad leg, but she is better now. Her room is clean and bright. A kind nurse brings her medicine twice a day. I gave her some flowers and a magazine. She smiled and said thank you. She can go home on Friday.", qs: [
    Q("Who is in the hospital?", "My aunt", ["My aunt", "My uncle", "My friend"]),
    Q("What is wrong with her?", "A bad leg", ["A bad leg", "A bad head", "A bad tooth"]),
    Q("What did I give her?", "Flowers and a magazine", ["Flowers and a magazine", "Fruit and tea", "A book and a cake"]),
    TF("She can go home on Friday.", true),
    Q("A kind ___ brings her medicine twice a day.", "nurse") ] },
];
