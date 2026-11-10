const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });

module.exports = [
  {
    topic: 'Returning a broken lamp',
    audioText: 'Hello, my name is Dilnoza. I bought this lamp on Monday, but it does not work. I put in a new bulb, and the light still does not come on. I have the receipt here. The shop assistant, Mr Brown, says I can have my money back or choose another lamp. I think I will take a different one, a small blue lamp for my bedroom. It costs twelve pounds.',
    qs: [
      Q('When did Dilnoza buy the lamp?', 'On Monday', ['On Monday', 'On Friday', 'Yesterday']),
      Q('What did she try first?', 'A new bulb', ['A new bulb', 'A new plug', 'A new shade']),
      Q('What does she choose?', 'A small blue lamp', ['A small blue lamp', 'Her money back', 'A big red lamp']),
      TF('The new lamp is for the kitchen.', false, 'It is for her bedroom.'),
      Q('The new lamp costs twelve ___.', 'pounds'),
    ],
  },
  {
    topic: 'At the tailor',
    audioText: 'Good morning. I am Bobur. These trousers are too long for me, and I need them for a wedding on Saturday. Can you make them shorter? The tailor looks at them and says it is easy. He will finish them by Thursday afternoon. The price is five dollars. Bobur is happy and says he will come back on Thursday at four o\'clock to pick them up.',
    qs: [
      Q('Why does Bobur need the trousers?', 'For a wedding', ['For a wedding', 'For work', 'For a birthday']),
      Q('What is the problem with the trousers?', 'They are too long', ['They are too long', 'They are too small', 'They are dirty']),
      Q('When will the tailor finish?', 'On Thursday', ['On Thursday', 'On Saturday', 'On Tuesday']),
      TF('The work costs ten dollars.', false, 'The price is five dollars.'),
      Q('Bobur will come back at ___ o\'clock.', 'four'),
    ],
  },
  {
    topic: 'A bank loan question',
    audioText: 'Hello, I would like to ask about a small loan. My name is Sophie. I want to buy a new laptop for my studies, and it costs six hundred dollars. The bank clerk says I need to show my passport and a paper from my work. I can pay back the money in twelve months. She gives me a form, and I will bring it back tomorrow.',
    qs: [
      Q('What does Sophie want to buy?', 'A laptop', ['A laptop', 'A car', 'A phone']),
      Q('What must she show?', 'Her passport and a work paper', ['Her passport and a work paper', 'Her old laptop', 'Her bank card only']),
      Q('How long can she take to pay back?', 'Twelve months', ['Twelve months', 'Six months', 'Two years']),
      TF('Sophie will bring the form back today.', false, 'She will bring it back tomorrow.'),
      Q('The laptop costs six ___ dollars.', 'hundred'),
    ],
  },
  {
    topic: 'A car wash',
    audioText: 'Welcome to Sunny Car Wash. Our basic wash costs eight dollars, and it takes fifteen minutes. If you want the inside cleaned too, you pay fourteen dollars. Today, customers get a free air freshener. Our shop is open every day from eight in the morning until seven in the evening. You can wait in our small cafe and drink free tea while we clean your car.',
    qs: [
      Q('How much is the basic wash?', 'Eight dollars', ['Eight dollars', 'Fourteen dollars', 'Fifteen dollars']),
      Q('What do customers get today?', 'A free air freshener', ['A free air freshener', 'A free coffee', 'A free wash']),
      Q('When does the shop close?', 'At seven in the evening', ['At seven in the evening', 'At eight in the morning', 'At noon']),
      TF('The cafe gives free tea.', true),
      Q('The basic wash takes ___ minutes.', 'fifteen'),
    ],
  },
  {
    topic: 'Booking a haircut',
    audioText: 'Hello, is this Star Hair Salon? My name is Aziza. I would like a haircut for my little son, Rustam. He is six years old. Can we come on Wednesday? The woman says there is a free time at half past three. Aziza says that is perfect because school finishes at two. The woman asks for a phone number, and Aziza gives it to her.',
    qs: [
      Q('Who needs the haircut?', 'Aziza\'s son', ['Aziza\'s son', 'Aziza', 'Aziza\'s husband']),
      Q('Which day do they want to go?', 'Wednesday', ['Wednesday', 'Thursday', 'Tuesday']),
      Q('What time is the appointment?', 'Half past three', ['Half past three', 'Two o\'clock', 'Half past two']),
      TF('Rustam is ten years old.', false, 'He is six years old.'),
      Q('School finishes at ___.', 'two'),
    ],
  },
  {
    topic: 'A delivery delay',
    audioText: 'Hello, this is a message for Mr Karimov from Fast Furniture. Your new table was ready for delivery today, but our truck has a problem. We are very sorry. The driver will bring the table on Friday morning between nine and eleven. Please be at home. If you cannot, call us on the number on your paper. You do not need to pay for delivery because of the delay.',
    qs: [
      Q('What is the message about?', 'A delayed delivery', ['A delayed delivery', 'A broken table', 'A new price']),
      Q('What is the problem?', 'The truck has a problem', ['The truck has a problem', 'The table is broken', 'The shop is closed']),
      Q('When will the table come?', 'Friday morning', ['Friday morning', 'Today', 'Friday evening']),
      TF('Mr Karimov must pay for delivery.', false, 'Delivery is free because of the delay.'),
      Q('The driver will come between nine and ___.', 'eleven'),
    ],
  },
  {
    topic: 'A pharmacy queue',
    audioText: 'There were many people in the pharmacy today. I stood in the queue for twenty minutes. The man in front of me, Jack, was buying medicine for his cough. The woman behind me had a bad headache. At last, the pharmacist called my name. I needed some cream for my dry hands. It cost four dollars, and the pharmacist told me to use it twice a day.',
    qs: [
      Q('How long did the speaker wait?', 'Twenty minutes', ['Twenty minutes', 'Ten minutes', 'One hour']),
      Q('What did Jack want?', 'Medicine for a cough', ['Medicine for a cough', 'Cream for his hands', 'Medicine for a headache']),
      Q('What did the speaker buy?', 'Cream for dry hands', ['Cream for dry hands', 'Cough medicine', 'A toothbrush']),
      TF('The woman behind the speaker had a headache.', true),
      Q('The cream costs four ___.', 'dollars'),
    ],
  },
  {
    topic: 'Comparing two phones',
    audioText: 'Madina is in a phone shop with her brother Timur. She likes two phones. The black phone is cheap, but the camera is not very good. The white phone is more expensive, and its battery is very strong. Timur says the camera is not important for her. She uses the phone mostly for calls and music. In the end, she buys the white phone because of the battery.',
    qs: [
      Q('Who is with Madina?', 'Her brother', ['Her brother', 'Her mother', 'Her friend']),
      Q('What is good about the white phone?', 'The battery', ['The battery', 'The camera', 'The price']),
      Q('What does she use the phone for?', 'Calls and music', ['Calls and music', 'Games', 'Photos']),
      TF('The black phone is more expensive.', false, 'The white phone is more expensive.'),
      Q('The black phone is ___.', 'cheap'),
    ],
  },
  {
    topic: 'A bicycle repair shop',
    audioText: 'My bicycle has a flat tire, so I went to the repair shop near the park. The owner, Mr Evans, looked at it and smiled. He said the tire needs a new tube. The repair takes only twenty minutes. I waited outside and read a magazine. The price was six pounds. Before I left, he checked my brakes for free and said they were fine.',
    qs: [
      Q('What was wrong with the bicycle?', 'A flat tire', ['A flat tire', 'Broken brakes', 'A broken chain']),
      Q('Where is the shop?', 'Near the park', ['Near the park', 'Near the school', 'Near the station']),
      Q('What did the speaker do while waiting?', 'Read a magazine', ['Read a magazine', 'Drank tea', 'Called a friend']),
      TF('Mr Evans checked the brakes for free.', true),
      Q('The repair costs six ___.', 'pounds'),
    ],
  },
  {
    topic: 'At the dry cleaner',
    audioText: 'Hello. I have a jacket and two shirts to clean, please. I am Kamola. The jacket has a coffee mark on the sleeve. The young man at the desk says he can clean it, but it may take two days. Normal service takes one day. Kamola is not in a hurry, so she chooses the normal price. The total is nine dollars, and she can collect everything on Tuesday.',
    qs: [
      Q('What does Kamola bring?', 'A jacket and two shirts', ['A jacket and two shirts', 'Two jackets', 'A coat and a dress']),
      Q('What is on the jacket?', 'A coffee mark', ['A coffee mark', 'A hole', 'A tea mark']),
      Q('When can she collect her clothes?', 'On Tuesday', ['On Tuesday', 'On Sunday', 'Today']),
      TF('Kamola is in a big hurry.', false, 'She is not in a hurry.'),
      Q('The total price is ___ dollars.', 'nine'),
    ],
  },
  {
    topic: 'A restaurant complaint',
    audioText: 'Excuse me, I have a small problem. I asked for chicken soup, but this soup has fish in it. I cannot eat fish because I am allergic. The waiter, Sam, is very sorry. He takes the bowl away and brings a new soup in ten minutes. The manager also comes to the table and says the soup is free today. Ravshan thanks them and enjoys his meal.',
    qs: [
      Q('What did Ravshan order?', 'Chicken soup', ['Chicken soup', 'Fish soup', 'Vegetable soup']),
      Q('Why can he not eat fish?', 'He is allergic', ['He is allergic', 'He does not like it', 'He is full']),
      Q('What does the manager say?', 'The soup is free', ['The soup is free', 'The soup is cold', 'The restaurant is closing']),
      TF('The new soup comes in twenty minutes.', false, 'It comes in ten minutes.'),
      Q('The waiter\'s name is ___.', 'sam'),
    ],
  },
  {
    topic: 'Choosing a gift',
    audioText: 'It is my mother\'s birthday next week, and I need a gift. My name is Jasur. First I looked at a scarf, but she has many. Then I saw a nice teapot with yellow flowers on it. She loves drinking tea every evening, so I chose that one. It costs fifteen dollars. The shop will put it in a pretty box for free.',
    qs: [
      Q('Whose birthday is it?', 'Jasur\'s mother', ['Jasur\'s mother', 'Jasur\'s sister', 'Jasur\'s friend']),
      Q('Why did he not buy the scarf?', 'She has many', ['She has many', 'It was too expensive', 'It was ugly']),
      Q('What is on the teapot?', 'Yellow flowers', ['Yellow flowers', 'Blue birds', 'Red stars']),
      TF('The shop charges extra for the box.', false, 'The box is free.'),
      Q('His mother drinks tea every ___.', 'evening'),
    ],
  },
  {
    topic: 'A discount sale',
    audioText: 'Attention, shoppers. Our big winter sale starts today at Green Street Store. All coats are thirty percent cheaper, and boots are half price. If you buy two pairs of gloves, the third pair is free. The sale ends on Sunday at six o\'clock. Please remember that we do not take back sale items after seven days. Thank you for shopping with us, and enjoy the bargains.',
    qs: [
      Q('Which items are half price?', 'Boots', ['Boots', 'Coats', 'Gloves']),
      Q('How much cheaper are the coats?', 'Thirty percent', ['Thirty percent', 'Half', 'Ten percent']),
      Q('When does the sale end?', 'On Sunday', ['On Sunday', 'On Monday', 'On Saturday']),
      TF('You can return sale items after ten days.', false, 'They are not taken back after seven days.'),
      Q('Buy two pairs of gloves and the ___ pair is free.', 'third'),
    ],
  },
  {
    topic: 'A supermarket card',
    audioText: 'At the supermarket, the cashier asks Laylo if she has a Smart Card. She does not, so the cashier explains. With the card, you get one point for every dollar. When you have one hundred points, you receive a five dollar voucher. The card is free, and you only need your name and phone number. Laylo fills in the form quickly and gets her card in two minutes.',
    qs: [
      Q('What does the cashier ask about?', 'A Smart Card', ['A Smart Card', 'A bag', 'A receipt']),
      Q('How many points do you get for one dollar?', 'One point', ['One point', 'Two points', 'Ten points']),
      Q('What do you get for one hundred points?', 'A five dollar voucher', ['A five dollar voucher', 'A free bag', 'A free meal']),
      TF('The card costs five dollars.', false, 'The card is free.'),
      Q('Laylo gets her card in two ___.', 'minutes'),
    ],
  },
  {
    topic: 'Booking a taxi',
    audioText: 'Hello, I need a taxi, please. My name is Oliver, and I am at the Grand Hotel on Park Road. I must go to the airport for a flight at noon. The woman on the phone says a car will arrive in ten minutes. The trip takes forty minutes, and it costs twenty five dollars. Oliver has two big bags, so he asks for a large car.',
    qs: [
      Q('Where is Oliver now?', 'At a hotel', ['At a hotel', 'At the airport', 'At a station']),
      Q('Where does he want to go?', 'To the airport', ['To the airport', 'To the train station', 'To a hotel']),
      Q('Why does he want a large car?', 'He has two big bags', ['He has two big bags', 'He has friends', 'He likes big cars']),
      TF('The taxi will come in ten minutes.', true),
      Q('The trip takes ___ minutes.', 'forty'),
    ],
  },
  {
    topic: 'At the laundry',
    audioText: 'There is no washing machine in my flat, so I go to the laundry on Saturdays. It is near my bus stop. I put my clothes in a big machine and pay three dollars. The wash takes thirty minutes. While I wait, I usually read my book or talk to the owner, Mrs Lee. She is very kind and sometimes gives me a cup of tea.',
    qs: [
      Q('Why does the speaker go to the laundry?', 'There is no washing machine at home', ['There is no washing machine at home', 'It is free', 'It is close to work']),
      Q('When does the speaker go?', 'On Saturdays', ['On Saturdays', 'On Sundays', 'On Fridays']),
      Q('What does the speaker do while waiting?', 'Reads a book', ['Reads a book', 'Watches television', 'Sleeps']),
      TF('The wash takes one hour.', false, 'It takes thirty minutes.'),
      Q('The owner is Mrs ___.', 'lee'),
    ],
  },
  {
    topic: 'Ordering a book',
    audioText: 'Hello, I am looking for a book called The Silver River. The shop assistant checks the computer and says they do not have it now. However, she can order it for Nodira. It will arrive in four days. The book costs eleven dollars, and Nodira must pay half today. She pays five dollars fifty and leaves her phone number so the shop can call her.',
    qs: [
      Q('What is the name of the book?', 'The Silver River', ['The Silver River', 'The Golden Road', 'The Blue Sea']),
      Q('When will the book arrive?', 'In four days', ['In four days', 'Tomorrow', 'In two weeks']),
      Q('How much must Nodira pay today?', 'Half the price', ['Half the price', 'The full price', 'Nothing']),
      TF('The shop has the book now.', false, 'They do not have it now.'),
      Q('Nodira leaves her ___ number.', 'phone'),
    ],
  },
  {
    topic: 'A market bargain',
    audioText: 'On Sunday I went to the market with my aunt. We wanted some apples and a basket. The seller first asked ten dollars for the basket, which seemed too much. My aunt smiled and said she would give seven. The seller laughed and agreed. We also bought two kilos of apples for four dollars. We carried everything home in our new basket.',
    qs: [
      Q('Who went to the market with the speaker?', 'An aunt', ['An aunt', 'A sister', 'A neighbour']),
      Q('How much did the aunt pay for the basket?', 'Seven dollars', ['Seven dollars', 'Ten dollars', 'Four dollars']),
      Q('What else did they buy?', 'Apples', ['Apples', 'Bread', 'Flowers']),
      TF('The seller refused the price.', false, 'The seller agreed.'),
      Q('They bought two ___ of apples.', 'kilos'),
    ],
  },
  {
    topic: 'At a travel agency',
    audioText: 'Hello, we would like a holiday by the sea. My name is Sardor, and I am here with my wife. The agent shows us a hotel in Turkey for one week. Breakfast and dinner are included, and the beach is only five minutes away. The price is nine hundred dollars for two people. We think about it for a moment and decide to book it for July.',
    qs: [
      Q('What kind of holiday do they want?', 'By the sea', ['By the sea', 'In the mountains', 'In a city']),
      Q('Which meals are included?', 'Breakfast and dinner', ['Breakfast and dinner', 'Only lunch', 'All three meals']),
      Q('When do they book the holiday?', 'July', ['July', 'June', 'August']),
      TF('The beach is far from the hotel.', false, 'It is five minutes away.'),
      Q('The hotel is in ___.', 'turkey'),
    ],
  },
  {
    topic: 'Sending a parcel',
    audioText: 'I am at the post office to send a parcel to my friend in London. The clerk, Mr Ali, puts it on the scale. It weighs two kilos. He asks if there is anything dangerous inside, and I say no, only books and a scarf. Normal post takes ten days, but express takes three days. I choose express and pay twenty dollars.',
    qs: [
      Q('Where is the parcel going?', 'To London', ['To London', 'To Paris', 'To Tashkent']),
      Q('What is inside the parcel?', 'Books and a scarf', ['Books and a scarf', 'Clothes and shoes', 'Food']),
      Q('How long does express post take?', 'Three days', ['Three days', 'Ten days', 'One day']),
      TF('The parcel weighs five kilos.', false, 'It weighs two kilos.'),
      Q('The speaker pays ___ dollars.', 'twenty'),
    ],
  },
  {
    topic: 'At the florist',
    audioText: 'Good afternoon. I need flowers for my grandmother, please. Her name is Gulnora, and today she is seventy years old. The florist suggests red roses, but I prefer white tulips because they are her favourite. She puts ten tulips in a paper wrapper and ties a ribbon. They cost twelve dollars. I thank her and walk to my grandmother\'s house.',
    qs: [
      Q('Who are the flowers for?', 'The speaker\'s grandmother', ['The speaker\'s grandmother', 'The speaker\'s mother', 'The florist']),
      Q('How old is Gulnora today?', 'Seventy', ['Seventy', 'Sixty', 'Eighty']),
      Q('Which flowers does the speaker choose?', 'White tulips', ['White tulips', 'Red roses', 'Yellow daisies']),
      TF('The florist ties a ribbon.', true),
      Q('There are ___ tulips in the wrapper.', 'ten'),
    ],
  },
  {
    topic: 'A furniture shop',
    audioText: 'Anna and her husband are in a furniture shop. They need a sofa for their new living room. The first sofa is grey and very soft, but it costs six hundred dollars. The second one is green and cheaper, only four hundred. Anna likes the grey one more. However, her husband says the room is small, so the green sofa is better because it is smaller. They buy the green one.',
    qs: [
      Q('What do they want to buy?', 'A sofa', ['A sofa', 'A bed', 'A table']),
      Q('How much is the grey sofa?', 'Six hundred dollars', ['Six hundred dollars', 'Four hundred dollars', 'Five hundred dollars']),
      Q('Why do they choose the green one?', 'It is smaller and cheaper', ['It is smaller and cheaper', 'It is softer', 'It is newer']),
      TF('Anna likes the green sofa more.', false, 'Anna likes the grey one more.'),
      Q('The room is ___.', 'small'),
    ],
  },
  {
    topic: 'At the optician',
    audioText: 'My eyes hurt when I read, so I visited the optician on Monday. The doctor, Ms Clark, tested my eyes and said I need glasses for reading. I chose black frames from a long wall of choices. They are light and comfortable. The glasses cost sixty dollars and will be ready in one week. I am happy because now I can read my books easily again.',
    qs: [
      Q('When did the speaker visit the optician?', 'On Monday', ['On Monday', 'On Sunday', 'Last year']),
      Q('What kind of glasses does the speaker need?', 'Reading glasses', ['Reading glasses', 'Sun glasses', 'Swimming glasses']),
      Q('What colour are the frames?', 'Black', ['Black', 'Brown', 'Silver']),
      TF('The glasses will be ready in one week.', true),
      Q('The glasses cost ___ dollars.', 'sixty'),
    ],
  },
  {
    topic: 'A mobile plan',
    audioText: 'Hi, I would like a new mobile plan, please. I am Feruza, a student. The shop assistant explains two plans. The first costs five dollars a month and gives ten gigabytes of internet. The second costs eight dollars and gives thirty gigabytes. Feruza watches many videos, so she takes the second plan. The assistant puts a new card into her phone and the plan starts right away.',
    qs: [
      Q('What is Feruza?', 'A student', ['A student', 'A teacher', 'A doctor']),
      Q('How much is the first plan?', 'Five dollars a month', ['Five dollars a month', 'Eight dollars a month', 'Ten dollars a month']),
      Q('Why does she choose the second plan?', 'She watches many videos', ['She watches many videos', 'It is cheaper', 'She makes many calls']),
      TF('The plan starts next week.', false, 'It starts right away.'),
      Q('The second plan gives thirty ___ of internet.', 'gigabytes'),
    ],
  },
];
