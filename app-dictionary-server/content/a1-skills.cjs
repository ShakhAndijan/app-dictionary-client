// A1 reading, listening, speaking and writing lessons. Turned into JSON by build-a1.cjs.
// Q(prompt, answer, options)  -> CHOICE when options are given, FILL otherwise.
// TF(prompt, true|false)      -> True / False question.
const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

const reading = [
  {
    title: 'Mening oilam', topic: 'My family',
    intro: "Matnni diqqat bilan o'qing, so'ng savollarga javob bering.",
    passage: "My name is Anna. I am ten years old. I live in a small house with my mother, my father and my brother. My brother's name is Tom. He is six. We have a cat. Its name is Mimi. I love my family.",
    qs: [
      Q('How old is Anna?', 'Ten', ['Six', 'Ten', 'Twelve']),
      Q("What is her brother's name?", 'Tom', ['Tom', 'Mimi', 'Sam']),
      Q("What is the cat's name?", 'Mimi', ['Anna', 'Tom', 'Mimi']),
      TF('Tom is ten years old.', false, 'Tom is six.'),
      Q('Anna lives in a small ___.', 'house'),
    ],
  },
  {
    title: 'Mening kunim', topic: 'My day',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "I get up at seven o'clock. I have breakfast at half past seven. I go to school by bus. School starts at eight thirty. I come home at three. In the evening I do my homework and watch TV. I go to bed at ten.",
    qs: [
      Q('What time does the writer get up?', 'At seven', ['At six', 'At seven', 'At eight']),
      Q('How does the writer go to school?', 'By bus', ['By bus', 'By car', 'On foot']),
      Q('What time does school start?', 'Eight thirty', ['Eight', 'Eight thirty', 'Nine']),
      Q('What does the writer do in the evening?', 'Homework and TV', ['Plays football', 'Homework and TV', 'Goes shopping']),
      Q('The writer goes to bed at ___ o\'clock.', 'ten'),
    ],
  },
  {
    title: 'Mening xonam', topic: 'My room',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "This is my room. It is small but nice. There is a bed next to the window. There is a desk and a chair near the door. On the desk there is a lamp and some books. There is a big poster of a football player on the wall. I like my room.",
    qs: [
      Q('Is the room big?', 'No, it is small', ['Yes, it is big', 'No, it is small', 'It is very old']),
      Q('Where is the bed?', 'Next to the window', ['Next to the window', 'Near the door', 'On the desk']),
      Q('What is on the desk?', 'A lamp and some books', ['A poster', 'A lamp and some books', 'A football']),
      TF('There is a poster on the wall.', true),
      Q('The desk and the chair are near the ___.', 'door'),
    ],
  },
  {
    title: 'Kafeda', topic: 'At the café',
    intro: "Menyu va suhbatni o'qing, so'ng savollarga javob bering.",
    passage: "Menu: Tea - 1 dollar. Coffee - 2 dollars. Sandwich - 3 dollars. Salad - 4 dollars. Cake - 2 dollars. Waiter: Hello! What would you like? Sam: I'd like a coffee and a sandwich, please. Waiter: Anything else? Sam: No, thank you. How much is it? Waiter: That is five dollars.",
    qs: [
      Q('What does Sam order?', 'A coffee and a sandwich', ['Tea and cake', 'A coffee and a sandwich', 'A salad']),
      Q('How much is the cake?', '2 dollars', ['1 dollar', '2 dollars', '4 dollars']),
      TF('Sam orders a cake.', false, 'Sam orders a coffee and a sandwich.'),
      Q('How much does Sam pay?', '5 dollars', ['3 dollars', '5 dollars', '6 dollars']),
      Q('A salad is ___ dollars.', '4'),
    ],
  },
  {
    title: 'Mening shahrim', topic: 'My town',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "I live in a small town. There is a big park in the centre. There is a library next to the park. There are two schools and one hospital. There isn't a cinema, but there is a nice café near my house. The people in my town are friendly.",
    qs: [
      Q('Where is the park?', 'In the centre', ['In the centre', 'Near the hospital', 'Next to the school']),
      Q('What is next to the park?', 'A library', ['A café', 'A library', 'A cinema']),
      Q('How many schools are there?', 'Two', ['One', 'Two', 'Three']),
      TF('There is a cinema in the town.', false, "There isn't a cinema."),
      Q('The people in the town are ___.', 'friendly'),
    ],
  },
  {
    title: 'Ob-havo', topic: 'The weather',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "Today is Monday. It is sunny and warm in the morning. In the afternoon it is cloudy and windy. Tomorrow it is going to rain. It is going to be cold, about ten degrees. I need my umbrella and a warm jacket.",
    qs: [
      Q('What is the weather like in the morning?', 'Sunny and warm', ['Rainy', 'Sunny and warm', 'Cold and windy']),
      Q('What is the weather like in the afternoon?', 'Cloudy and windy', ['Sunny', 'Cloudy and windy', 'Snowy']),
      Q('What is the weather going to be like tomorrow?', 'Rainy and cold', ['Sunny and hot', 'Rainy and cold', 'Windy and warm']),
      TF('Tomorrow it is going to be hot.', false),
      Q('The writer needs an ___ and a warm jacket.', 'umbrella'),
    ],
  },
  {
    title: "Mening qiziqishlarim", topic: 'My hobbies',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "My name is Dilya. I like sports and music. I play volleyball on Tuesdays and Thursdays. I don't play football. I play the guitar in the evening. On Sundays I go swimming with my friends. I don't like cooking.",
    qs: [
      Q('When does Dilya play volleyball?', 'On Tuesdays and Thursdays', ['On Sundays', 'On Tuesdays and Thursdays', 'Every day']),
      Q('What instrument does she play?', 'The guitar', ['The piano', 'The guitar', 'The drums']),
      Q('What does she do on Sundays?', 'She goes swimming', ['She plays football', 'She goes swimming', 'She cooks']),
      TF('Dilya likes cooking.', false, "She doesn't like cooking."),
      Q('She plays ___ on Tuesdays and Thursdays.', 'volleyball'),
    ],
  },
  {
    title: 'Maktab kuni', topic: 'A school day',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "Our school day starts at eight o'clock. We have four lessons in the morning: English, maths, science and history. Lunch is at twelve. In the afternoon we have art and sport. Our English teacher is Mrs Green. She is kind and funny. School finishes at three o'clock.",
    qs: [
      Q('What time does school start?', 'At eight', ['At seven', 'At eight', 'At nine']),
      Q('How many lessons are there in the morning?', 'Four', ['Two', 'Three', 'Four']),
      Q('What lessons are there in the afternoon?', 'Art and sport', ['Maths and science', 'Art and sport', 'English and history']),
      TF('Mrs Green is the English teacher.', true),
      Q('School finishes at ___ o\'clock.', 'three'),
    ],
  },
  {
    title: "Do'stga xat", topic: 'An email to a friend',
    intro: "Xatni o'qing va savollarga javob bering.",
    passage: "Hi Ben, How are you? I am fine. I am in Samarkand with my family. It is a beautiful city. The weather is hot and sunny. Yesterday we visited the Registan. Today we are eating plov in a restaurant. Tomorrow we are going to take a train to Bukhara. See you soon! Love, Nodira",
    qs: [
      Q('Where is Nodira?', 'In Samarkand', ['In Bukhara', 'In Samarkand', 'At home']),
      Q('What is the weather like?', 'Hot and sunny', ['Cold and rainy', 'Hot and sunny', 'Windy']),
      Q('What did they visit yesterday?', 'The Registan', ['The Registan', 'A museum', 'A restaurant']),
      Q('What are they doing today?', 'Eating plov', ['Taking a train', 'Eating plov', 'Visiting a park']),
      Q('Tomorrow they are going to Bukhara by ___.', 'train'),
    ],
  },
  {
    title: 'Bozorda', topic: 'At the market',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "Every Saturday my mother and I go to the market. We buy fruit and vegetables. Apples are two dollars a kilo. Tomatoes are three dollars a kilo. We buy two kilos of apples and one kilo of tomatoes. We also buy some bread. The market is busy and noisy, but I like it.",
    qs: [
      Q('When do they go to the market?', 'Every Saturday', ['Every Sunday', 'Every Saturday', 'Every day']),
      Q('How many kilos of apples do they buy?', 'Two', ['One', 'Two', 'Three']),
      Q('How much are the tomatoes?', '3 dollars a kilo', ['2 dollars a kilo', '3 dollars a kilo', '5 dollars a kilo']),
      TF('The market is quiet.', false, 'It is busy and noisy.'),
      Q('They also buy some ___.', 'bread'),
    ],
  },
  {
    title: "Eng yaqin do'stim", topic: 'My best friend',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "My best friend is Jasur. He is twelve years old. He is tall and has short black hair. He lives near my house. We go to the same school. Jasur is very funny and he is good at maths. After school we play computer games together.",
    qs: [
      Q('How old is Jasur?', 'Twelve', ['Ten', 'Eleven', 'Twelve']),
      Q('What does Jasur look like?', 'Tall with short black hair', ['Short with long hair', 'Tall with short black hair', 'Tall with blond hair']),
      Q('What is Jasur good at?', 'Maths', ['Maths', 'Sport', 'Music']),
      TF('They go to different schools.', false, 'They go to the same school.'),
      Q('After school they play ___ games.', 'computer'),
    ],
  },
  {
    title: 'Dam olish', topic: 'A holiday',
    intro: "Matnni o'qing va savollarga javob bering.",
    passage: "Last summer we went to the seaside for a week. We stayed in a small hotel near the beach. Every morning we swam in the sea. In the afternoon we played volleyball on the sand. In the evening we ate fish in a restaurant. The weather was great. We had a wonderful holiday.",
    qs: [
      Q('How long was the holiday?', 'A week', ['A day', 'A week', 'A month']),
      Q('Where did they stay?', 'In a small hotel', ['In a tent', 'In a small hotel', 'With friends']),
      Q('What did they do in the afternoon?', 'Played volleyball', ['Swam', 'Played volleyball', 'Ate fish']),
      TF('The weather was bad.', false, 'The weather was great.'),
      Q('They ate ___ in a restaurant.', 'fish'),
    ],
  },
];

const listening = [
  {
    title: 'Salomlashish', topic: 'Greetings',
    audioText: "Hello! My name is John. Nice to meet you. I am from England. I am twenty years old. I am a student.",
    qs: [Q('What is his name?', 'John', ['John', 'Tom', 'Jack']), Q('Where is he from?', 'England', ['America', 'England', 'Spain']), Q('How old is he?', 'Twenty', ['Ten', 'Twenty', 'Thirty']), Q('He is a ___.', 'student')],
  },
  {
    title: "Do'konda", topic: 'At the shop',
    audioText: "I want two apples and one bottle of water, please. How much is it? It is three dollars. Here you are. Thank you.",
    qs: [Q('How many apples does the customer want?', 'Two', ['One', 'Two', 'Three']), Q('How much is it?', 'Three dollars', ['Two dollars', 'Three dollars', 'Five dollars']), Q('The customer also wants a bottle of ___.', 'water'), TF('The customer says thank you.', true)],
  },
  {
    title: 'Telefon raqami', topic: 'Phone number and age',
    audioText: "Hi, I am Sara. I am fifteen years old. My phone number is five five five, two one three, four seven eight. My birthday is on the tenth of May.",
    qs: [Q('How old is Sara?', 'Fifteen', ['Fourteen', 'Fifteen', 'Sixteen']), Q('When is her birthday?', 'On the tenth of May', ['On the fifth of May', 'On the tenth of May', 'On the tenth of June']), Q('What is the last number of her phone number?', 'Eight', ['Seven', 'Eight', 'Three']), TF('Sara is sixteen.', false)],
  },
  {
    title: 'Kafeda buyurtma', topic: 'In a café',
    audioText: "Good morning. Can I have a cup of tea and a piece of cake, please? Of course. Would you like sugar? No, thank you. That is three dollars fifty. Here you are.",
    qs: [Q('What does the customer drink?', 'Tea', ['Coffee', 'Tea', 'Juice']), Q('What does the customer eat?', 'Cake', ['A sandwich', 'Cake', 'Salad']), TF('The customer wants sugar.', false), Q('How much is it?', 'Three dollars fifty', ['Two dollars', 'Three dollars fifty', 'Five dollars'])],
  },
  {
    title: "Yo'l so'rash", topic: 'Directions',
    audioText: "Excuse me, where is the post office? Go straight on, then turn left at the traffic lights. The post office is next to the bank. Thank you very much. You are welcome.",
    qs: [Q('What is the man looking for?', 'The post office', ['The bank', 'The post office', 'The station']), Q('Where must he turn left?', 'At the traffic lights', ['At the bank', 'At the traffic lights', 'At the park']), Q('The post office is next to the ___.', 'bank'), TF('He must turn right.', false)],
  },
  {
    title: 'Vaqt va jadval', topic: 'Time and schedule',
    audioText: "The train to Tashkent leaves at half past eight. The train to Samarkand leaves at a quarter past ten. The shops open at nine o'clock and close at six in the evening.",
    qs: [Q('When does the train to Tashkent leave?', 'At half past eight', ['At eight', 'At half past eight', 'At a quarter past ten']), Q('When does the train to Samarkand leave?', 'At a quarter past ten', ['At ten', 'At a quarter past ten', 'At six']), Q('The shops open at ___ o\'clock.', 'nine'), TF('The shops close at six.', true)],
  },
  {
    title: 'Ob-havo prognozi', topic: 'Weather forecast',
    audioText: "Here is the weather for tomorrow. In the morning it is cold and foggy. In the afternoon it is sunny, but windy. In the evening it is going to rain. The temperature is twelve degrees.",
    qs: [Q('What is the weather like in the morning?', 'Cold and foggy', ['Hot and sunny', 'Cold and foggy', 'Rainy']), Q('What is the weather like in the afternoon?', 'Sunny and windy', ['Sunny and windy', 'Snowy', 'Cloudy']), Q('When is it going to rain?', 'In the evening', ['In the morning', 'In the afternoon', 'In the evening']), Q('The temperature is ___ degrees.', 'twelve')],
  },
  {
    title: 'Mening oilam', topic: 'My family',
    audioText: "I have a big family. There are six people: my parents, my two sisters, my brother and me. My father is a driver. My mother is a teacher. My sisters are students. My brother is only five years old.",
    qs: [Q('How many people are in the family?', 'Six', ['Four', 'Five', 'Six']), Q("What is the father's job?", 'Driver', ['Teacher', 'Driver', 'Doctor']), Q('How old is the brother?', 'Five', ['Five', 'Ten', 'Fifteen']), TF('The sisters are students.', true)],
  },
  {
    title: 'Mashg\'ulotlar', topic: 'Hobbies',
    audioText: "I love sports. I play tennis on Monday and Wednesday. On Saturday I go swimming. I don't like football. In the evening I read books or listen to music.",
    qs: [Q('When does he play tennis?', 'Monday and Wednesday', ['Tuesday and Friday', 'Monday and Wednesday', 'Saturday']), Q('What does he do on Saturday?', 'Goes swimming', ['Plays tennis', 'Goes swimming', 'Plays football']), TF('He likes football.', false), Q('In the evening he reads books or listens to ___.', 'music')],
  },
  {
    title: 'Mehmonxonada', topic: 'At the hotel',
    audioText: "Good evening. I have a room for two nights. What is your name, please? It is Brown. Yes, room twelve on the second floor. Breakfast is from seven to ten. Here is your key.",
    qs: [Q('How many nights is the room?', 'Two', ['One', 'Two', 'Three']), Q('Which room is it?', 'Twelve', ['Two', 'Ten', 'Twelve']), Q('When is breakfast?', 'From seven to ten', ['From six to nine', 'From seven to ten', 'From eight to eleven']), Q('The room is on the second ___.', 'floor')],
  },
  {
    title: 'Kundalik tartib', topic: 'Daily routine',
    audioText: "My name is Ali. I get up at six thirty. I have a shower and eat breakfast. I leave home at seven fifteen. I work in a bank. I finish work at five. In the evening I cook dinner and watch TV.",
    qs: [Q('What time does Ali get up?', 'Six thirty', ['Six', 'Six thirty', 'Seven']), Q('Where does Ali work?', 'In a bank', ['In a school', 'In a bank', 'In a shop']), Q('What time does he finish work?', 'Five', ['Four', 'Five', 'Six']), TF('He cooks dinner in the evening.', true)],
  },
  {
    title: 'Aeroportda', topic: 'At the airport',
    audioText: "Attention, please. Flight number two four seven to Istanbul now boards at gate five. Passengers must show their passport and ticket. The flight leaves at three forty. Thank you.",
    qs: [Q('Where is the flight going?', 'To Istanbul', ['To London', 'To Istanbul', 'To Moscow']), Q('Which gate is it?', 'Gate five', ['Gate three', 'Gate five', 'Gate seven']), Q('When does the flight leave?', 'At three forty', ['At two forty', 'At three forty', 'At four']), Q('Passengers must show their passport and ___.', 'ticket')],
  },
];

const speaking = [
  { title: 'Salomlashish', topic: 'Greetings', phrases: ['Hello, how are you?', 'I am fine, thank you.', 'Nice to meet you.', 'Good morning!', 'Good evening!', 'See you tomorrow.', 'Have a nice day!', 'Goodbye, see you later.'] },
  { title: "O'zingizni tanishtirish", topic: 'Introducing yourself', phrases: ['My name is Ali.', 'I am from Uzbekistan.', 'I am twenty years old.', 'I am a student.', 'I live in Tashkent.', 'I speak Uzbek and Russian.', 'I like music and football.', 'What is your name?'] },
  { title: 'Oila haqida', topic: 'My family', phrases: ['This is my mother.', 'I have two brothers.', 'My father is a doctor.', 'My sister is ten years old.', 'We live in a big house.', 'I love my family.', 'My grandmother cooks very well.', 'Do you have any sisters?'] },
  { title: 'Kundalik tartib', topic: 'Daily routine', phrases: ['I get up at seven o\'clock.', 'I have breakfast at eight.', 'I go to work by bus.', 'I come home at six.', 'I watch TV in the evening.', 'I go to bed at eleven.', 'What time do you get up?', 'I brush my teeth every morning.'] },
  { title: 'Ovqat va ichimlik', topic: 'Food and drinks', phrases: ['I would like a cup of tea.', 'Can I have some water, please?', 'I like pizza and salad.', 'I don\'t like fish.', 'What would you like to eat?', 'The soup is very good.', 'I am hungry.', 'The bill, please.'] },
  { title: 'Xarid qilish', topic: 'Shopping', phrases: ['How much is this?', 'I would like a bottle of milk.', 'Do you have a bigger size?', 'It is too expensive.', 'I will take it.', 'Can I pay by card?', 'Where is the supermarket?', 'Thank you, goodbye.'] },
  { title: "Yo'l so'rash", topic: 'Directions', phrases: ['Excuse me, where is the bank?', 'Go straight on.', 'Turn left at the corner.', 'Turn right at the traffic lights.', 'It is next to the park.', 'It is near the station.', 'Is it far from here?', 'Thank you very much.'] },
  { title: 'Vaqt va kunlar', topic: 'Time and days', phrases: ['What time is it?', 'It is half past three.', 'It is a quarter to nine.', 'Today is Monday.', 'My birthday is in May.', 'I have English on Friday.', 'See you at six o\'clock.', 'The shop opens at nine.'] },
  { title: 'Ob-havo', topic: 'Weather', phrases: ['It is sunny today.', 'It is cold and windy.', 'It is raining now.', 'I need an umbrella.', 'What is the weather like?', 'It is going to snow tomorrow.', 'I love warm weather.', 'It is very hot in summer.'] },
  { title: 'Qiziqishlar', topic: 'Hobbies', phrases: ['I like playing football.', 'I go swimming on Saturdays.', 'She plays the guitar very well.', 'We watch films at the weekend.', 'I don\'t like cooking.', 'What do you do in your free time?', 'My hobby is reading books.', 'I would like to learn English.'] },
];

// [Uzbek, English]; contractions are accepted automatically (I am = I'm).
const writing = [
  { title: "O'zim haqimda", topic: 'About me', items: [
    ['Men talabaman.', 'I am a student.'], ['Mening ismim Ali.', 'My name is Ali.'], ["Men O'zbekistondanman.", 'I am from Uzbekistan.'], ['Men yigirma yoshdaman.', 'I am twenty years old.'],
    ['Men Toshkentda yashayman.', 'I live in Tashkent.'], ["Men ingliz tilini o'rganaman.", 'I study English.'], ['Men musiqani yaxshi ko\'raman.', 'I like music.'], ['Men charchamadim.', 'I am not tired.'],
  ] },
  { title: 'Oilam', topic: 'My family', items: [
    ['Mening ikkita akam bor.', 'I have two brothers.'], ['Otam shifokor.', 'My father is a doctor.'], ['Onam o\'qituvchi.', 'My mother is a teacher.'], ['Singlim o\'n yoshda.', 'My sister is ten years old.'],
    ['Bizning oilamiz katta.', 'Our family is big.'], ['Buvim juda yaxshi ovqat pishiradi.', 'My grandmother cooks very well.'], ["Mening opam yo'q.", "I don't have a sister."], ['Ular uyda.', 'They are at home.'],
  ] },
  { title: 'Uyim', topic: 'My home', items: [
    ['Bizning uyimiz katta.', 'Our house is big.'], ['Xonamda karavot bor.', 'There is a bed in my room.'], ["Stolda kitoblar bor.", 'There are some books on the table.'], ['Oshxona yashash xonasining yonida.', 'The kitchen is next to the living room.'],
    ["Derazaning yonida stol bor.", 'There is a table next to the window.'], ["Bu mening xonam.", 'This is my room.'], ['Mening xonam kichkina.', 'My room is small.'], ["Bog'da gullar bor.", 'There are flowers in the garden.'],
  ] },
  { title: 'Ovqat va ichimlik', topic: 'Food and drinks', items: [
    ['Men choy ichaman.', 'I drink tea.'], ['U kofe yoqtirmaydi.', "She doesn't like coffee."], ['Men bir stakan suv xohlayman.', 'I would like a glass of water.'], ["Siz non xohlaysizmi?", 'Would you like some bread?'],
    ['Muzlatgichda sut bor.', 'There is some milk in the fridge.'], ['Men och emasman.', 'I am not hungry.'], ['Biz tushlikda palov yeymiz.', 'We eat plov for lunch.'], ['Meva sog\'lom.', 'Fruit is healthy.'],
  ] },
  { title: 'Kundalik tartib', topic: 'Daily routine', items: [
    ['Men soat yettida turaman.', 'I get up at seven.'], ['U maktabga avtobusda boradi.', 'He goes to school by bus.'], ['Biz soat sakkizda nonushta qilamiz.', 'We have breakfast at eight.'], ['Men kechqurun televizor ko\'raman.', 'I watch TV in the evening.'],
    ['U soat o\'nda uxlaydi.', 'She goes to bed at ten.'], ['Siz qachon ishga borasiz?', 'When do you go to work?'], ["Men dushanba kuni ishlamayman.", "I don't work on Monday."], ['Dars soat to\'qqizda boshlanadi.', 'The lesson starts at nine.'],
  ] },
  { title: "O'tgan kun", topic: 'Yesterday', items: [
    ['Kecha men kinoga bordim.', 'I went to the cinema yesterday.'], ['U kecha uyda edi.', 'He was at home yesterday.'], ['Biz futbol o\'ynadik.', 'We played football.'], ["Men dugonamni uchratdim.", 'I met my friend.'],
    ['U yangi kitob sotib oldi.', 'She bought a new book.'], ['Men kecha televizor ko\'rmadim.', "I didn't watch TV yesterday."], ['Siz nima qildingiz?', 'What did you do?'], ['Ular kech kelishdi.', 'They came late.'],
  ] },
  { title: 'Shahar va joylar', topic: 'Places', items: [
    ['Bank maktabning yonida.', 'The bank is next to the school.'], ["Bu yerda yaqin joyda kafe bormi?", 'Is there a café near here?'], ['Bekat kasalxonaning qarshisida.', 'The bus stop is opposite the hospital.'], ['Parkda ko\'p odam bor.', 'There are many people in the park.'],
    ['Do\'kon soat to\'qqizda ochiladi.', 'The shop opens at nine.'], ['Poyezd Toshkentga ketadi.', 'The train goes to Tashkent.'], ['Mening shahrim kichkina.', 'My town is small.'], ['Kutubxona yopiq.', 'The library is closed.'],
  ] },
  { title: 'Rejalar', topic: 'Plans', items: [
    ['Ertaga yomg\'ir yog\'adi.', 'It is going to rain tomorrow.'], ['Men dam olish kunida do\'stimga boraman.', 'I am going to visit my friend at the weekend.'], ["Biz kechqurun film ko'ramiz.", 'We are going to watch a film tonight.'], ['U shifokor bo\'ladi.', 'She is going to be a doctor.'],
    ['Men ertaga ishlamayman.', 'I am not going to work tomorrow.'], ['Siz nima qilmoqchisiz?', 'What are you going to do?'], ['Men suzishni bilaman.', 'I can swim.'], ['U mashina haydashni bilmaydi.', "He can't drive."],
  ] },
  { title: 'Savollar', topic: 'Questions', items: [
    ['Siz qayerda yashaysiz?', 'Where do you live?'], ['Sizning ismingiz nima?', 'What is your name?'], ['Bu kim?', 'Who is this?'], ['U necha yoshda?', 'How old is he?'],
    ['Bu qancha turadi?', 'How much is this?'], ["Sizning tug'ilgan kuningiz qachon?", 'When is your birthday?'], ['Sizda ruchka bormi?', 'Have you got a pen?'], ['Siz ingliz tilida gapirasizmi?', 'Do you speak English?'],
  ] },
];

module.exports = { reading, listening, speaking, writing };
