const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'My aunt',
    audioText: "My aunt is called Maria. She is forty years old and she lives in a small house near the sea. She is a nurse and she works at a big hospital. She has two cats and a green car. Every Sunday she visits us and brings a chocolate cake. I love my aunt very much.",
    qs: [
      Q('Where does Maria live?', 'Near the sea', ['Near the sea', 'In the mountains', 'In a big city'], 'She lives in a small house near the sea.'),
      Q('What is her job?', 'Nurse', ['Teacher', 'Nurse', 'Cook'], 'She is a nurse.'),
      Q('What does she bring on Sunday?', 'A chocolate cake', ['Some flowers', 'A chocolate cake', 'Some apples'], 'She brings a chocolate cake.'),
      TF('Maria has a dog.', false, 'She has two cats.'),
      Q('Maria has ___ cats.', 'two'),
    ],
  },
  {
    topic: 'A message to dad',
    audioText: "Hello Dad, it is Peter. I am at school and I am fine. My last class finishes at four o'clock, so please do not come before that. After school I want to go to the library with my friend Tom. Can you pick me up at six? Please bring my blue coat because it is cold. Thank you. Bye.",
    qs: [
      Q('Where is Peter now?', 'At school', ['At home', 'At school', 'At the library'], 'He says he is at school.'),
      Q('Where does he want to go after school?', 'To the library', ['To the library', 'To the park', 'To the shop'], 'He wants to go to the library with Tom.'),
      Q('What should Dad bring?', 'A blue coat', ['A blue coat', 'A red bag', 'Some food'], 'He asks for his blue coat.'),
      TF("Dad should come before four o'clock.", false, 'Peter says not to come before four.'),
      Q("Peter wants Dad to pick him up at ___ o'clock.", 'six'),
    ],
  },
  {
    topic: 'Ordering a burger',
    audioText: "Good evening. Can I have a cheese burger, please? Yes, of course. Would you like chips? Yes, a small portion, please. And to drink, I would like an orange juice. Okay, that is eight dollars and fifty cents. Is that for here or to take away? To take away, please. Here is your food. Thank you very much.",
    qs: [
      Q('What kind of burger does the customer order?', 'A cheese burger', ['A chicken burger', 'A cheese burger', 'A fish burger'], 'He orders a cheese burger.'),
      Q('What does he want to drink?', 'Orange juice', ['Water', 'Orange juice', 'Cola'], 'He wants an orange juice.'),
      Q('How big are the chips?', 'Small', ['Small', 'Big', 'Very big'], 'He asks for a small portion.'),
      TF('The customer eats in the restaurant.', false, 'The food is to take away.'),
      Q('The food costs eight dollars and ___ cents.', 'fifty'),
    ],
  },
  {
    topic: 'Post office hours',
    audioText: "Welcome to the town post office. We are open from Monday to Friday. In the morning we open at nine o'clock and we close at one o'clock. We open again at two and we close at five. On Saturday we are open only in the morning. On Sunday we are closed. You can buy stamps at the front desk.",
    qs: [
      Q('When does the post office open in the morning?', 'At nine', ['At eight', 'At nine', 'At ten'], "It opens at nine o'clock."),
      Q('When does it close in the afternoon on weekdays?', 'At five', ['At four', 'At five', 'At six'], 'It closes at five.'),
      Q('What can you buy at the front desk?', 'Stamps', ['Stamps', 'Books', 'Tickets'], 'You can buy stamps.'),
      TF('The post office is open on Sunday.', false, 'It is closed on Sunday.'),
      Q("It closes at ___ o'clock for lunch.", 'one'),
    ],
  },
  {
    topic: 'A lost phone',
    audioText: "Excuse me, I have lost my phone. It is a black phone with a red case. I think I left it on the bus this morning. I took the number twelve bus at eight o'clock. My name is Anna Brown. My telephone number is on the paper. Please call me if you find it. Thank you for your help.",
    qs: [
      Q('What colour is the phone case?', 'Red', ['Red', 'Blue', 'Green'], 'The phone has a red case.'),
      Q('Where did she lose the phone?', 'On the bus', ['In a shop', 'On the bus', 'At school'], 'She left it on the bus.'),
      Q('What is her family name?', 'Brown', ['Black', 'Brown', 'White'], 'Her name is Anna Brown.'),
      TF('She took the bus in the evening.', false, 'She took it at eight in the morning.'),
      Q('She took bus number ___.', 'twelve'),
    ],
  },
  {
    topic: "A head teacher's notice",
    audioText: "Good morning, students. This is your head teacher. Tomorrow is a special day. There is no school because the teachers have a meeting. Please stay at home and do your homework. School starts again on Thursday at eight thirty. Remember to bring your sports clothes on Thursday because we have a football game. Have a nice day.",
    qs: [
      Q('Why is there no school tomorrow?', 'The teachers have a meeting', ['It is a holiday', 'The teachers have a meeting', 'It is very cold'], 'The teachers have a meeting.'),
      Q('When does school start again?', 'On Thursday', ['On Wednesday', 'On Thursday', 'On Friday'], 'School starts again on Thursday.'),
      Q('What should students bring on Thursday?', 'Sports clothes', ['Sports clothes', 'Lunch money', 'A pen'], 'They need sports clothes for football.'),
      TF('Students should do homework at home.', true, 'They should stay at home and do homework.'),
      Q('There is a ___ game on Thursday.', 'football'),
    ],
  },
  {
    topic: 'Meeting at the station',
    audioText: "Hi Lucy, it is Ben. Let us meet at the train station on Saturday. I will be there at ten o'clock. Please wait for me in front of the coffee shop, near the big clock. We can take the train to the lake together. The ticket is cheap. Bring some water and a hat because it will be hot. See you soon.",
    qs: [
      Q('Where will they meet?', 'In front of the coffee shop', ['At the lake', 'In front of the coffee shop', "At Lucy's house"], 'They meet in front of the coffee shop.'),
      Q('Where will they go by train?', 'To the lake', ['To the lake', 'To the sea', 'To a museum'], 'They take the train to the lake.'),
      Q('What should Lucy bring?', 'Water and a hat', ['Water and a hat', 'A book', 'A big bag'], 'Ben asks for water and a hat.'),
      TF('The train ticket is expensive.', false, 'The ticket is cheap.'),
      Q('They meet on ___.', 'saturday'),
    ],
  },
  {
    topic: 'Asking the price of a bag',
    audioText: "Excuse me, how much is this bag? The brown one? It is twenty five dollars. And the black bag? That one is thirty dollars. Hmm, the brown bag is nice, but it is small. Do you have a bigger one? Yes, this brown bag is bigger. It is thirty five dollars. Okay, I will take it. Thank you.",
    qs: [
      Q('How much is the small brown bag?', 'Twenty five dollars', ['Twenty dollars', 'Twenty five dollars', 'Thirty dollars'], 'It is twenty five dollars.'),
      Q('How much is the black bag?', 'Thirty dollars', ['Thirty dollars', 'Thirty five dollars', 'Forty dollars'], 'The black bag is thirty dollars.'),
      Q('Which bag does the woman buy?', 'The bigger brown bag', ['The black bag', 'The small brown bag', 'The bigger brown bag'], 'She takes the bigger brown bag.'),
      TF('The woman wants a smaller bag.', false, 'She wants a bigger one.'),
      Q('The bigger bag is thirty ___ dollars.', 'five'),
    ],
  },
  {
    topic: 'My school week',
    audioText: "I go to school from Monday to Friday. School starts at eight o'clock. On Monday and Wednesday I have English class. I like English because my teacher is funny. On Tuesday I have music and on Friday I have sport. I do not have school on Saturday or Sunday. At the weekend I play with my friends.",
    qs: [
      Q('When does school start?', "At eight o'clock", ["At seven o'clock", "At eight o'clock", "At nine o'clock"], 'School starts at eight.'),
      Q('Why does the speaker like English?', 'The teacher is funny', ['The teacher is funny', 'It is easy', 'It is short'], 'The English teacher is funny.'),
      Q('What lesson is on Tuesday?', 'Music', ['Sport', 'Music', 'Art'], 'On Tuesday there is music.'),
      TF('The speaker goes to school on Saturday.', false, 'There is no school on Saturday.'),
      Q('On Friday the speaker has ___.', 'sport'),
    ],
  },
  {
    topic: 'Weekend weather report',
    audioText: "Here is the weather for the weekend. On Saturday it will be sunny and warm, about twenty five degrees. It is a good day for the beach. On Sunday the sky will be grey and it will rain in the afternoon. It will also be windy and cooler, about eighteen degrees. Take an umbrella on Sunday.",
    qs: [
      Q('What is the weather on Saturday?', 'Sunny and warm', ['Sunny and warm', 'Rainy and cold', 'Windy and grey'], 'Saturday is sunny and warm.'),
      Q('When will it rain on Sunday?', 'In the afternoon', ['In the morning', 'In the afternoon', 'At night'], 'Rain comes in the afternoon.'),
      Q('What should you take on Sunday?', 'An umbrella', ['A hat', 'An umbrella', 'A towel'], 'Take an umbrella on Sunday.'),
      TF('Sunday will be warmer than Saturday.', false, 'Sunday is cooler.'),
      Q('On Sunday it will be about ___ degrees.', 'eighteen'),
    ],
  },
  {
    topic: 'A plane time',
    audioText: "Attention please. The flight to Rome will leave at half past six in the evening. Please go to gate seven. The plane is a little late because of the rain. Passengers must show their passport and ticket at the gate. Please do not forget your bags. The flight to Rome takes two hours. Thank you.",
    qs: [
      Q('Where is the plane going?', 'To Rome', ['To Rome', 'To Paris', 'To London'], 'The flight goes to Rome.'),
      Q('Which gate should passengers go to?', 'Gate seven', ['Gate five', 'Gate seven', 'Gate nine'], 'They go to gate seven.'),
      Q('Why is the plane late?', 'Because of the rain', ['Because of the rain', 'Because of a problem', 'Because of snow'], 'It is late because of the rain.'),
      TF('The flight takes five hours.', false, 'The flight takes two hours.'),
      Q('The plane leaves at half past ___.', 'six'),
    ],
  },
  {
    topic: 'A wedding invitation',
    audioText: "Dear friends, we are happy to tell you that we are getting married. The wedding is on the tenth of June at three o'clock. It will be in the garden of the Green Hotel. After the wedding there will be a big dinner and music. Please come and bring your family. Please tell us before the first of June. Love, Sara and Jack.",
    qs: [
      Q('Where is the wedding?', 'In a hotel garden', ['In a church', 'In a hotel garden', 'At the beach'], 'It is in the garden of the Green Hotel.'),
      Q('What happens after the wedding?', 'A dinner and music', ['A dinner and music', 'A football game', 'A long trip'], 'There is a big dinner and music.'),
      Q('What time is the wedding?', "At three o'clock", ["At two o'clock", "At three o'clock", "At four o'clock"], "It is at three o'clock."),
      TF('Guests can bring their family.', true, 'The invitation says to bring your family.'),
      Q('The wedding is in the month of ___.', 'june'),
    ],
  },
  {
    topic: 'Buying bread',
    audioText: "Good morning. I would like two loaves of white bread, please. Of course. Anything else? Yes, I would like some rolls. How many? Six, please. Is that all? Yes, thank you. That is four dollars and twenty cents. Here is a five dollar note. Your change is eighty cents. Have a nice day. You too.",
    qs: [
      Q('How many loaves of bread does the woman buy?', 'Two', ['One', 'Two', 'Three'], 'She buys two loaves.'),
      Q('What else does she buy?', 'Rolls', ['Cake', 'Rolls', 'Milk'], 'She also buys rolls.'),
      Q('How much money is her change?', 'Eighty cents', ['Twenty cents', 'Eighty cents', 'One dollar'], 'Her change is eighty cents.'),
      TF('She buys brown bread.', false, 'She buys white bread.'),
      Q('She buys ___ rolls.', 'six'),
    ],
  },
  {
    topic: 'My kitchen',
    audioText: "I like my kitchen. It is small, but it is very clean. There is a white table with four chairs. The fridge is next to the window. On the wall there is a big clock. My mother cooks dinner here every day. Our kitchen smells very good in the evening. I often help her wash the plates.",
    qs: [
      Q('How is the kitchen?', 'Small and clean', ['Big and old', 'Small and clean', 'Dark and dirty'], 'It is small but clean.'),
      Q('Where is the fridge?', 'Next to the window', ['Next to the door', 'Next to the window', 'Next to the table'], 'The fridge is next to the window.'),
      Q('Who cooks dinner?', 'Mother', ['The speaker', 'Mother', 'Father'], 'The speaker\'s mother cooks dinner.'),
      TF('The table has six chairs.', false, 'The table has four chairs.'),
      Q('There is a big ___ on the wall.', 'clock'),
    ],
  },
  {
    topic: 'My fish',
    audioText: "I have a small orange fish. Its name is Bubble. It lives in a glass bowl in my bedroom. Every morning I give Bubble some food. Bubble eats a little and then swims around. I clean the water on Saturdays. My sister wants a fish too, but our mother says one fish is enough.",
    qs: [
      Q('What colour is the fish?', 'Orange', ['Orange', 'Yellow', 'Blue'], 'The fish is orange.'),
      Q('Where does the fish live?', 'In a glass bowl', ['In a pond', 'In a glass bowl', 'In the kitchen'], 'It lives in a glass bowl in the bedroom.'),
      Q('When does the speaker clean the water?', 'On Saturdays', ['On Mondays', 'On Saturdays', 'Every day'], 'The water is cleaned on Saturdays.'),
      TF("The speaker's sister has a fish.", false, 'She wants one but does not have one.'),
      Q('The name of the fish is ___.', 'bubble'),
    ],
  },
  {
    topic: 'A museum rule',
    audioText: "Welcome to the city museum. Please listen to the rules. You can look at everything, but please do not touch the paintings. You can take photos, but please do not use a flash. Children must stay with an adult. Please do not eat or drink inside. There is a cafe on the first floor. The museum closes at six.",
    qs: [
      Q('What must visitors not touch?', 'The paintings', ['The paintings', 'The walls', 'The doors'], 'Do not touch the paintings.'),
      Q('Where is the cafe?', 'On the first floor', ['On the first floor', 'Outside', 'On the top floor'], 'The cafe is on the first floor.'),
      Q('When does the museum close?', 'At six', ['At five', 'At six', 'At seven'], 'It closes at six.'),
      TF('Visitors can use a flash for photos.', false, 'Do not use a flash.'),
      Q('Children must stay with an ___.', 'adult'),
    ],
  },
  {
    topic: 'At the taxi rank',
    audioText: "Hello, where are you going? To the airport, please. Okay, put your bag in the back. How long does it take? About twenty minutes if there is no traffic. How much is it? It is thirty dollars. Is that okay? Yes, that is fine. My flight is at noon, so I am not late. Please drive carefully.",
    qs: [
      Q('Where is the passenger going?', 'To the airport', ['To the airport', 'To the station', 'To a hotel'], 'She is going to the airport.'),
      Q('How long is the trip?', 'About twenty minutes', ['About ten minutes', 'About twenty minutes', 'About one hour'], 'It takes about twenty minutes.'),
      Q('How much is the taxi?', 'Thirty dollars', ['Twenty dollars', 'Thirty dollars', 'Forty dollars'], 'It is thirty dollars.'),
      TF('The passenger is late.', false, 'She says she is not late.'),
      Q('The flight is at ___.', 'noon'),
    ],
  },
  {
    topic: 'A breakfast order',
    audioText: "Good morning. What would you like for breakfast? I would like two eggs and toast, please. Do you want butter or jam on your toast? Jam, please. And to drink? A cup of tea with milk, no sugar. Okay. Would you like some fruit? Yes, one banana, please. It will be ready in ten minutes. Thank you.",
    qs: [
      Q('How many eggs does the guest want?', 'Two', ['One', 'Two', 'Three'], 'The guest wants two eggs.'),
      Q('What does the guest put on the toast?', 'Jam', ['Butter', 'Jam', 'Honey'], 'The guest chooses jam.'),
      Q('What fruit does the guest want?', 'A banana', ['An apple', 'A banana', 'An orange'], 'The guest wants a banana.'),
      TF('The guest wants sugar in the tea.', false, 'The guest wants no sugar.'),
      Q('The breakfast will be ready in ___ minutes.', 'ten'),
    ],
  },
  {
    topic: 'A chess club',
    audioText: "Do you like chess? Come to our school chess club. We meet every Wednesday after school in room twelve. The club starts at four o'clock and finishes at five thirty. Beginners are welcome. Mister Smith teaches the new players. You do not need to pay. Bring a friend and a good mood. We have snacks and juice for everyone.",
    qs: [
      Q('When does the club meet?', 'On Wednesdays', ['On Mondays', 'On Wednesdays', 'On Fridays'], 'They meet every Wednesday.'),
      Q('Who teaches new players?', 'Mister Smith', ['Mister Smith', 'Mister Brown', 'Missus Green'], 'Mister Smith teaches the new players.'),
      Q('What do they have for everyone?', 'Snacks and juice', ['Pizza', 'Snacks and juice', 'Cake and tea'], 'They have snacks and juice.'),
      TF('You must pay to join the club.', false, 'You do not need to pay.'),
      Q('The club is in room ___.', 'twelve'),
    ],
  },
  {
    topic: 'A message about a trip',
    audioText: "Hi Emma, it is Carlos. I have news about our trip to the mountains. The bus leaves on Friday at seven in the morning. We will stay in a small hotel for three nights. The hotel has a nice restaurant. Please bring warm clothes and strong shoes. We will walk a lot. I cannot wait to see you. Call me back, please.",
    qs: [
      Q('Where are they going?', 'To the mountains', ['To the mountains', 'To the beach', 'To a big city'], 'They go to the mountains.'),
      Q('How will they travel?', 'By bus', ['By bus', 'By train', 'By car'], 'The bus leaves on Friday.'),
      Q('What should Emma bring?', 'Warm clothes and strong shoes', ['A swimsuit', 'Warm clothes and strong shoes', 'A camera only'], 'Carlos asks for warm clothes and strong shoes.'),
      TF('They will stay in the hotel for one night.', false, 'They will stay for three nights.'),
      Q('The bus leaves at ___ in the morning.', 'seven'),
    ],
  },
  {
    topic: 'A room at a hostel',
    audioText: "Welcome to the Sunny Hostel. Your room is number fourteen, on the second floor. The room has four beds, and you share it with three other people. The bathroom is at the end of the hall. Breakfast is from seven to ten in the dining room. The wifi is free. The password is on the card. Enjoy your stay.",
    qs: [
      Q('Which floor is the room on?', 'The second floor', ['The first floor', 'The second floor', 'The third floor'], 'The room is on the second floor.'),
      Q('How many beds are in the room?', 'Four', ['Two', 'Four', 'Six'], 'The room has four beds.'),
      Q('Where is the bathroom?', 'At the end of the hall', ['In the room', 'At the end of the hall', 'Downstairs'], 'It is at the end of the hall.'),
      TF('The wifi costs extra money.', false, 'The wifi is free.'),
      Q('The room number is ___.', 'fourteen'),
    ],
  },
  {
    topic: 'Asking the way to the market',
    audioText: "Excuse me, where is the market, please? Go straight along this street. Turn left at the bank. Then walk past the school and you will see a big park. The market is behind the park, next to the river. Is it far? No, it is only ten minutes on foot. Thank you very much. You are welcome.",
    qs: [
      Q('Where should you turn left?', 'At the bank', ['At the bank', 'At the school', 'At the park'], 'Turn left at the bank.'),
      Q('Where is the market?', 'Behind the park', ['Behind the park', 'Next to the bank', 'In front of the school'], 'It is behind the park.'),
      Q('How long is the walk?', 'Ten minutes', ['Five minutes', 'Ten minutes', 'Twenty minutes'], 'It is ten minutes on foot.'),
      TF('The market is far away.', false, 'It is only ten minutes on foot.'),
      Q('The market is next to the ___.', 'river'),
    ],
  },
  {
    topic: 'My cousin',
    audioText: "My cousin is called Daniel. He is twelve years old and he is tall, with short black hair. He lives in Canada with his parents and his little brother. Daniel loves football and plays for his school team. He speaks English and a little Spanish. Next summer he will visit us for two weeks. I am very excited.",
    qs: [
      Q('How old is Daniel?', 'Twelve', ['Ten', 'Twelve', 'Fourteen'], 'He is twelve years old.'),
      Q('Where does Daniel live?', 'In Canada', ['In Canada', 'In Spain', 'In England'], 'He lives in Canada.'),
      Q('What does he love?', 'Football', ['Football', 'Swimming', 'Music'], 'He loves football.'),
      TF('Daniel has a little sister.', false, 'He has a little brother.'),
      Q('He will visit for ___ weeks.', 'two'),
    ],
  },
  {
    topic: 'A holiday plan',
    audioText: "This summer my family and I will go on holiday to Spain. We will fly from London at the start of August. We will stay in a small flat near the beach for ten days. My father wants to swim every day. My mother wants to visit old churches. I want to eat ice cream and play volleyball. It will be great.",
    qs: [
      Q('Where will the family go?', 'To Spain', ['To Italy', 'To Spain', 'To France'], 'They will go to Spain.'),
      Q('Where will they stay?', 'In a flat near the beach', ['In a hotel in the city', 'In a flat near the beach', 'In a tent'], 'They stay in a small flat near the beach.'),
      Q('What does the mother want to visit?', 'Old churches', ['Old churches', 'Shops', 'Museums'], 'She wants to visit old churches.'),
      TF('They will go by car.', false, 'They will fly from London.'),
      Q('They will stay for ___ days.', 'ten'),
    ],
  },
];
