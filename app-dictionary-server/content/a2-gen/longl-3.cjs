const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "A flight gate change",
    audioText: "Good morning, passengers. This is an important announcement from Baku International Airport. Flight B K four one two to Istanbul has changed its gate. The flight was leaving from gate twelve, but it will now leave from gate twenty-three. Please do not go to gate twelve, because the staff are cleaning that area and it is closed until noon. The new gate is on the second floor, next to the bookshop and the coffee bar. It takes about ten minutes to walk there from the main hall, so please leave now.\n\nThe departure time has also changed. The plane was going to leave at nine fifteen, but there is a small delay because of heavy fog this morning. The new departure time is nine fifty. Boarding will start at nine twenty-five. Passengers with small children and passengers who need help will board first. Please have your passport and boarding card ready, and remember that you can take only one small bag onto the plane.\n\nPassengers who are waiting for the delayed flight can get a free sandwich and a drink. Please show your boarding card at the Blue Cafe, which is near gate nineteen. The cafe is open until ten thirty. Free water is also available at the information desk.\n\nA reminder for Mr Rustam Karimov and Mrs Dilfuza Karimova. Please go to the information desk, because someone has found your brown umbrella. Also, a green backpack is waiting at the security office. If it is yours, please collect it before you leave.\n\nFinally, the airport bus to the city centre now leaves every twenty minutes from door four. Thank you for flying with us, and we wish you a pleasant journey.",
    qs: [
      Q("Which airport is the announcement from?", "Baku International Airport", ["Baku International Airport", "Istanbul Airport", "Tashkent Airport"]),
      Q("Why is gate twelve closed?", "Staff are cleaning it", ["Staff are cleaning it", "There is heavy fog", "The door is broken"]),
      Q("Where is the new gate?", "On the second floor near the bookshop", ["On the second floor near the bookshop", "On the first floor near door four", "Next to the security office"]),
      TF("The plane will leave at nine fifteen.", false, "The new departure time is nine fifty."),
      Q("Why is the flight late?", "Because of fog", ["Because of fog", "Because of snow", "Because of a strike"]),
      Q("Who boards the plane first?", "Passengers with small children and those who need help", ["Passengers with small children and those who need help", "Passengers with big bags", "Passengers who arrived first"]),
      Q("Where can passengers get a free sandwich?", "At the Blue Cafe", ["At the Blue Cafe", "At the information desk", "At the bookshop"]),
      TF("Free water is available at the information desk.", true),
      Q("Someone found a brown ___"  , "umbrella"),
      Q("The airport bus leaves every twenty minutes from door ___", "four")
    ]
  },
  {
    topic: "A metro closure",
    audioText: "Attention, please. This is a message from the Tashkent Metro. Because of a water pipe problem, the Chilonzor line will be closed this weekend. The closure begins on Saturday at six in the morning and ends on Monday at five in the morning. Between Beruniy station and Olmazor station, no trains will run at all. Trains will still run on the other lines as usual.\n\nTo help passengers, the city will provide free buses. The buses will leave every eight minutes from outside each closed station. The yellow buses have the letter M on the front. Please follow the orange signs in the station to find the bus stop. The buses are free, so you do not need to buy a ticket, but you must still tap your travel card at the door. The journey by bus takes about thirty minutes, which is ten minutes longer than the train.\n\nWorkers will replace two old pipes and clean the tunnel. The manager of the metro, Mrs Gulnora Saidova, says that she is sorry for the problem. She says the repair is necessary because last month water came into the tunnel after the heavy rain, and one train stopped for an hour.\n\nIf you are going to the football stadium on Sunday evening, please leave home earlier, because the buses will be very busy. Passengers who use wheelchairs can ask a station worker for a special bus, which is free and comes every twenty minutes. You can also find more information on the metro website or by calling the number on the posters. Thank you for your patience, and have a safe weekend.",
    qs: [
      Q("What caused the closure?", "A water pipe problem", ["A water pipe problem", "A train accident", "A football match"]),
      Q("When does the closure end?", "Monday at five in the morning", ["Monday at five in the morning", "Sunday evening", "Saturday at six in the morning"]),
      Q("Between which stations will no trains run?", "Beruniy and Olmazor", ["Beruniy and Olmazor", "Chilonzor and Beruniy", "Olmazor and the stadium"]),
      Q("How often do the free buses leave?", "Every eight minutes", ["Every eight minutes", "Every ten minutes", "Every twenty minutes"]),
      TF("Passengers must buy a ticket for the free buses.", false, "They do not need a ticket, but they must tap their travel card."),
      Q("How much longer is the bus journey than the train?", "Ten minutes", ["Ten minutes", "Thirty minutes", "Twenty minutes"]),
      Q("Why is the repair necessary?", "Water came into the tunnel after heavy rain", ["Water came into the tunnel after heavy rain", "There was a fire in a station", "The trains are very old"]),
      TF("The special bus for wheelchairs comes every twenty minutes.", true),
      Q("Follow the orange ___ in the station to find the bus stop.", "signs"),
      Q("The bus journey takes about ___ minutes.", "thirty")
    ]
  },
  {
    topic: "A school closed by snow",
    audioText: "Good evening, parents and students of Green Hill School. This is Mr Anvar Yusupov, the head teacher. I am calling with important news. Because of the heavy snow tonight, the school will be closed tomorrow, Thursday. About thirty centimetres of snow fell today, and the weather office says that another twenty centimetres will arrive before morning. The roads near the school are icy, and the school buses cannot drive safely.\n\nStudents should stay at home tomorrow. Please do not wait at the bus stop. Teachers will put homework on the school website by eight in the morning. Younger students in grades one to four will have a reading task and a short drawing task. Older students will have a maths worksheet and a science video to watch. Students do not need to send the homework back until Monday.\n\nThe exam for grade nine will not be tomorrow. It will take place next Tuesday at nine o'clock instead. Please tell your children, and remind them to bring a pen and a calculator.\n\nThe school football match against Riverside School is also cancelled. The new date is the twelfth of next month. The school concert on Friday evening will still take place, if the roads are clear. We will send a message at noon on Friday to confirm.\n\nThe caretaker, Mr Bobur, and some volunteer parents will clear the snow from the school yard tomorrow. If you would like to help, please come at ten o'clock with a shovel. Hot tea will be ready in the kitchen. Please stay warm, drive carefully, and enjoy the snow. Thank you.",
    qs: [
      Q("Who is speaking?", "The head teacher", ["The head teacher", "The caretaker", "A bus driver"]),
      Q("How much snow fell today?", "About thirty centimetres", ["About thirty centimetres", "About twenty centimetres", "About fifty centimetres"]),
      Q("Why can the school buses not drive?", "The roads are icy", ["The roads are icy", "The drivers are ill", "The buses are broken"]),
      Q("What will older students have?", "A maths worksheet and a science video", ["A maths worksheet and a science video", "A reading task and a drawing task", "A test at home"]),
      TF("Students must send the homework back tomorrow.", false, "They do not need to send it back until Monday."),
      Q("When is the grade nine exam?", "Next Tuesday at nine o'clock", ["Next Tuesday at nine o'clock", "Tomorrow morning", "On Monday"]),
      Q("What should students bring to the exam?", "A pen and a calculator", ["A pen and a calculator", "A book and a ruler", "A laptop"]),
      TF("The football match against Riverside School is cancelled.", true),
      Q("The school concert is on ___ evening.", "friday"),
      Q("Hot tea will be ready in the ___", "kitchen")
    ]
  },
  {
    topic: "A news report about a bridge",
    audioText: "Good afternoon. This is the lunchtime news with Malika Nazarova. Our main story today is about the Red Bridge, which opened this morning after two years of work. The bridge crosses the river Zarafshan, and it connects the old town with the new hospital. The mayor, Mr Jasur Tursunov, cut a red ribbon at ten o'clock, and about five hundred people came to watch.\n\nThe old bridge was built in nineteen sixty and was very narrow. Many drivers waited for half an hour each morning to cross it. The new bridge has four lanes for cars, a lane for bicycles, and a wide path for people who walk. It is two hundred metres long, and it cost eight million dollars. The money came from the city and from a national fund.\n\nMany people are very happy. A taxi driver named Sherzod says his journey to the hospital now takes five minutes instead of twenty. A student named Aisha says she likes the bicycle lane because it is safe and has lights at night.\n\nHowever, not everyone is pleased. Some shop owners near the old road say they will have fewer customers, because fewer cars will pass their shops. The mayor says the town will build a new market near the bridge next year.\n\nThe bridge is open every day from six in the morning until midnight. Heavy lorries are not allowed on it, and they must use the ring road. Police will check the traffic carefully this week. That is all for the main news. After the break, we will bring you the sport and the weather.",
    qs: [
      Q("What does the new bridge connect?", "The old town and the new hospital", ["The old town and the new hospital", "A school and a market", "Two different cities"]),
      Q("Who cut the red ribbon?", "The mayor", ["The mayor", "A taxi driver", "The news reader"]),
      Q("When was the old bridge built?", "Nineteen sixty", ["Nineteen sixty", "Nineteen eighty", "Two thousand"]),
      Q("What does the new bridge have?", "Four car lanes, a bicycle lane and a wide path", ["Four car lanes, a bicycle lane and a wide path", "Two car lanes and a train line", "One lane for buses only"]),
      TF("The new bridge cost eight million dollars.", true),
      Q("Why are some shop owners unhappy?", "Fewer cars will pass their shops", ["Fewer cars will pass their shops", "The bridge is too noisy", "Prices are higher"]),
      Q("Who may not use the bridge?", "Heavy lorries", ["Heavy lorries", "Bicycles", "Taxis"]),
      TF("The bridge is open all night.", false, "It is open until midnight."),
      Q("The new bridge is two ___ metres long.", "hundred"),
      Q("The bridge is open from six in the morning until ___", "midnight")
    ]
  },
  {
    topic: "A radio traffic report",
    audioText: "Good morning, drivers. This is the Radio City traffic report with Farhod Ismoilov. It is seven thirty on a cold, wet Monday morning, and the roads are very busy. Let me start with the worst news. There was an accident on Navoi Avenue near the central market. A bus and a small white van hit each other at about six forty. Nobody is badly hurt, but one lane is closed, and traffic is moving very slowly. The police say the road will be clear by nine o'clock. Please use Amir Temur Street instead.\n\nOn the ring road, the news is better. Traffic is moving well in both directions, though there is a short delay near the airport turn, because workers are painting new white lines on the road. Please drive slowly there.\n\nNow some news about the buses. Buses number five and number twelve are running about fifteen minutes late today because of the rain. Bus number twenty is running as normal. If you take the train, there are no problems at all, and all trains are on time.\n\nParking is difficult near the hospital, because a large truck is blocking the entrance to the car park. If you are visiting a patient, we suggest you take a taxi or walk from the park.\n\nA short weather note. The rain will stop at ten o'clock, but the roads will stay slippery, so please keep a safe distance from the car in front. Our next traffic report is in twenty minutes. Until then, drive carefully, and enjoy the music with Radio City.",
    qs: [
      Q("What is the weather like?", "Cold and wet", ["Cold and wet", "Hot and sunny", "Windy and dry"]),
      Q("Where was the accident?", "On Navoi Avenue near the central market", ["On Navoi Avenue near the central market", "On the ring road", "Near the airport"]),
      Q("Which vehicles were in the accident?", "A bus and a van", ["A bus and a van", "Two cars", "A lorry and a bicycle"]),
      Q("Which street should drivers use instead?", "Amir Temur Street", ["Amir Temur Street", "The ring road", "The airport road"]),
      TF("Somebody was badly hurt in the accident.", false, "Nobody is badly hurt."),
      Q("Why is there a delay near the airport turn?", "Workers are painting lines", ["Workers are painting lines", "There was an accident", "There is fog"]),
      Q("Which bus is running as normal?", "Number twenty", ["Number twenty", "Number five", "Number twelve"]),
      TF("All the trains are on time.", true),
      Q("A large truck is blocking the car park near the ___", "hospital"),
      Q("The next traffic report is in ___ minutes.", "twenty")
    ]
  },
  {
    topic: "A museum opening",
    audioText: "Welcome to the news from the city of Bukhara. Today the new Silk Road Museum opens its doors to visitors. The museum is in a beautiful old building near the main square. Before this, the building was a school for more than eighty years, and then it was empty for ten years. The city spent three years changing it into a museum.\n\nInside, there are five large rooms. The first room tells the story of the old trade roads, with maps and small models of camels. The second room shows silk, carpets, and beautiful clothes. In the third room, children can touch some of the objects and try on traditional hats. The fourth room has old coins and jewellery, and the last room has a small cinema, which shows a short film every hour.\n\nThe director, Mrs Nigora Rahimova, says she wants every family to visit. For this reason, the museum is free on the first Sunday of each month. On other days, a ticket for an adult costs fifty thousand soums, and a ticket for a student costs twenty thousand. Children under seven do not pay.\n\nThe museum is open from nine in the morning until six in the evening, from Tuesday to Sunday. It is closed on Mondays. There is a gift shop on the ground floor, which sells postcards, scarves, and books. On the roof, there is a cafe with a lovely view of the town, and it serves tea and sweet pastries.\n\nGuided tours in English start at eleven o'clock and at three o'clock. You do not need to book a place. Just come to the front desk a few minutes before the tour begins.",
    qs: [
      Q("What was the building before it was a museum?", "A school", ["A school", "A hospital", "A market"]),
      Q("How long did the city work on the building?", "Three years", ["Three years", "Ten years", "Eighty years"]),
      Q("What can children do in the third room?", "Try on traditional hats", ["Try on traditional hats", "Watch a film", "Look at old coins"]),
      Q("What does the cinema show?", "A short film every hour", ["A short film every hour", "A long film at noon", "Maps of the old roads"]),
      TF("The museum is free on the first Sunday of each month.", true),
      Q("How much is a student ticket?", "Twenty thousand soums", ["Twenty thousand soums", "Fifty thousand soums", "It is free"]),
      Q("When is the museum closed?", "On Mondays", ["On Mondays", "On Sundays", "On Tuesdays"]),
      TF("You must book a place for the guided tour.", false, "You do not need to book a place."),
      Q("The gift shop sells postcards, scarves, and ___", "books"),
      Q("The museum has ___ large rooms.", "five")
    ]
  },
  {
    topic: "A supermarket promotion",
    audioText: "Attention, shoppers. Welcome to Fresh Market on Mustaqillik Street. We have some wonderful offers for you this week, starting today and ending on Sunday night. Please listen carefully.\n\nIn the fruit and vegetable section, apples are half price. A kilo of red apples costs only six thousand soums. Fresh tomatoes are also cheap this week, and if you buy two kilos, you get the third kilo free. Our bananas come from Ecuador, and they are on sale at the front of the shop.\n\nIn the bakery, you can buy two loaves of bread and get one sweet bun for free. The bakery makes fresh bread at seven in the morning and again at four in the afternoon. Please come then if you like warm bread.\n\nAt the dairy counter, all yoghurts have a ten percent discount. Milk costs the same as last week, but there is a special offer for large boxes of eggs. A box of thirty eggs costs twenty thousand soums.\n\nWe also have a new offer for our customers with a Fresh Market card. If you spend one hundred thousand soums or more, you will receive a free reusable bag, which is made from recycled plastic. You can ask for a card at the customer desk near the entrance. It is free, and it takes only two minutes.\n\nFor families, there is a play area for children next to the pharmacy, and a student called Kamila will look after the children while you shop. It is open from ten o'clock to six o'clock.\n\nFinally, the shop will stay open until eleven o'clock every evening this week. Thank you for shopping with us.",
    qs: [
      Q("Which fruit is half price?", "Apples", ["Apples", "Bananas", "Tomatoes"]),
      Q("What is the offer on tomatoes?", "Buy two kilos and get the third free", ["Buy two kilos and get the third free", "Half price", "Ten percent discount"]),
      Q("Where do the bananas come from?", "Ecuador", ["Ecuador", "Brazil", "Spain"]),
      Q("What is the bread offer?", "Buy two loaves and get a sweet bun free", ["Buy two loaves and get a sweet bun free", "Buy one loaf and get one free", "All bread is half price"]),
      TF("The bakery makes fresh bread at four in the morning.", false, "It makes bread at seven in the morning and four in the afternoon."),
      Q("How much discount do yoghurts have?", "Ten percent", ["Ten percent", "Half price", "Twenty percent"]),
      Q("What do customers get if they spend one hundred thousand soums?", "A free reusable bag", ["A free reusable bag", "Free milk", "A discount coupon"]),
      TF("The Fresh Market card is free.", true),
      Q("A box of thirty eggs costs ___ thousand soums.", "twenty"),
      Q("The play area is next to the ___", "pharmacy")
    ]
  },
  {
    topic: "A train strike",
    audioText: "Here is an important travel notice from National Railways. The train drivers' union has announced a strike for next Wednesday and Thursday. This means that many trains will not run on those two days. We are very sorry for the problem, and we want to help you plan your journey.\n\nOn Wednesday, only one train in three will run. The fast train between Tashkent and Samarkand will leave at seven in the morning and at five in the afternoon only. On Thursday, the situation will be a little better, and about half of the trains will run. There will be no night trains on either day.\n\nIf you have a ticket for a train that is cancelled, you can have your money back, or you can change your ticket for another day. You can do this on our website, at the station, or by phone. The refund will come to your bank card in about five working days. Please do not come to the station if your train is cancelled, because the ticket office will be very crowded.\n\nThe drivers say they want better pay and shorter working days. They say they now work ten hours a day, and they want to work eight. The railway company says it is ready to talk, and a meeting will take place on Monday at two o'clock.\n\nIf the meeting goes well, the strike may stop. We will put the latest news on our website on Monday evening and send a text message to all passengers.\n\nIn the meantime, you can travel by bus. Extra buses will leave from the main station every hour. Thank you for understanding.",
    qs: [
      Q("Who announced the strike?", "The train drivers' union", ["The train drivers' union", "The bus drivers", "The airport workers"]),
      Q("How many trains will run on Wednesday?", "One in three", ["One in three", "Half of them", "All of them"]),
      Q("When will the fast train to Samarkand leave on Wednesday?", "At seven in the morning and five in the afternoon", ["At seven in the morning and five in the afternoon", "At noon only", "Every hour"]),
      Q("What will happen on Thursday?", "About half of the trains will run", ["About half of the trains will run", "No trains will run", "All trains will run"]),
      TF("Night trains will run on Thursday.", false, "There will be no night trains on either day."),
      Q("How long does a refund take to arrive?", "About five working days", ["About five working days", "One hour", "One month"]),
      Q("What do the drivers want?", "Better pay and shorter working days", ["Better pay and shorter working days", "More holidays", "New trains"]),
      TF("A meeting will take place on Monday at two o'clock.", true),
      Q("The drivers now work ten hours a day, and they want to work ___", "eight"),
      Q("Extra buses will leave from the main station every ___", "hour")
    ]
  },
  {
    topic: "A weather warning",
    audioText: "This is a weather warning from the national weather service. A strong storm is coming to the north of the country tonight. The warning starts at six o'clock this evening and lasts until noon tomorrow. People in the towns of Nukus, Muynak, and Kungrad should listen carefully.\n\nThe storm will bring very strong wind. In some places, the wind will reach ninety kilometres an hour. It will also bring heavy rain, and in the hills, the rain may become snow after midnight. Temperatures will fall from fifteen degrees to just two degrees by morning.\n\nWhat should you do? First, stay at home if you can. Do not drive at night, because trees may fall across the roads. Second, put your garden chairs, flower pots, and bicycles inside, because the wind can blow them away. Third, charge your phone and keep a torch near your bed, because there may be power cuts. Please do not use candles, because they can cause fires.\n\nIf you live near the river, please watch the water carefully. The river Amu Darya may rise by one metre. The local council has opened a safe shelter in the sports hall of School number seven. Anyone who needs to leave home can go there. It has beds, food, and hot drinks, and it is free.\n\nFarmers should keep animals in a barn tonight. Fishermen should not go out on the lake.\n\nThe weather will improve tomorrow afternoon. By Friday, we expect sunshine and light winds. We will give another report at ten o'clock tonight, and our website has a live map. Please stay safe.",
    qs: [
      Q("When does the warning start?", "At six o'clock this evening", ["At six o'clock this evening", "At noon tomorrow", "At midnight"]),
      Q("How fast will the wind be in some places?", "Ninety kilometres an hour", ["Ninety kilometres an hour", "Fifty kilometres an hour", "One hundred kilometres an hour"]),
      Q("What may the rain become in the hills?", "Snow", ["Snow", "Hail", "Fog"]),
      Q("What will the temperature be by morning?", "Two degrees", ["Two degrees", "Fifteen degrees", "Zero degrees"]),
      TF("People should use candles if the power goes off.", false, "Candles can cause fires."),
      Q("Why should people put their garden chairs inside?", "The wind can blow them away", ["The wind can blow them away", "The rain can break them", "Thieves may take them"]),
      Q("Where is the safe shelter?", "In the sports hall of School number seven", ["In the sports hall of School number seven", "In the town hall", "In the hospital"]),
      TF("The shelter is free.", true),
      Q("The river Amu Darya may rise by one ___", "metre"),
      Q("Keep a ___ near your bed because there may be power cuts.", "torch")
    ]
  },
  {
    topic: "A sports report",
    audioText: "Welcome to the evening sports news. Last night, in the big city derby, Bunyodkor beat Pakhtakor by three goals to two. More than twenty thousand fans came to the stadium, and the weather was warm and dry.\n\nPakhtakor scored first, after only six minutes. Their striker, Eldor, kicked the ball from outside the box, and the goalkeeper could not stop it. Bunyodkor answered quickly. In the twenty-second minute, a young player named Sardor, who is only eighteen, scored with his head. Just before half time, Bunyodkor scored again, and at the break it was two to one.\n\nIn the second half, Pakhtakor scored again in the sixtieth minute, and the game was two all. Everyone thought it would be a draw. But in the last minute, a long pass found Sardor, and he scored his second goal. The crowd went wild. The coach, Mr Alisher Normatov, said it was the best night of his life. He said his team worked very hard in training this week.\n\nIn other sports news, the national swimming team returned from Dubai with four medals. They won one gold, two silver, and one bronze. The gold medal went to Nilufar, aged sixteen, in the one hundred metre race.\n\nFinally, tickets for next Saturday's tennis final are now on sale. The final will be at the city tennis centre at four in the afternoon. Tickets cost thirty thousand soums and can be bought online.\n\nThat is all for sport. Join us again tomorrow.",
    qs: [
      Q("What was the final score of the derby?", "Three to two to Bunyodkor", ["Three to two to Bunyodkor", "Two to one to Pakhtakor", "Two all"]),
      Q("How many fans came to the stadium?", "More than twenty thousand", ["More than twenty thousand", "About ten thousand", "About fifty thousand"]),
      Q("When did Pakhtakor score first?", "After six minutes", ["After six minutes", "After twenty-two minutes", "After sixty minutes"]),
      Q("How did Sardor score his first goal?", "With his head", ["With his head", "From a penalty", "From a free kick"]),
      TF("Sardor is eighteen years old.", true),
      Q("What was the score at half time?", "Two to one", ["Two to one", "One all", "Three to two"]),
      Q("How many medals did the swimming team win?", "Four", ["Four", "Two", "Six"]),
      TF("Tickets for the tennis final cost fifty thousand soums.", false, "They cost thirty thousand soums."),
      Q("Nilufar won gold in the one hundred ___ race.", "metre"),
      Q("The tennis final is at the city tennis ___", "centre")
    ]
  },
  {
    topic: "A marathon road closure",
    audioText: "Attention, residents of Tashkent. This is a message from the city council about the Spring Marathon, which takes place this Sunday. More than eight thousand runners will take part, so many roads in the centre will be closed.\n\nThe race starts at eight o'clock in the morning in front of the Opera Theatre and finishes in Independence Square. The roads on the route will close at six in the morning and open again at two in the afternoon. Closed roads include Amir Temur Avenue, Shota Rustaveli Street, and the road beside the river. Please do not park on these streets from Saturday night, because police will move any cars left there.\n\nBuses will not use the centre during the race. Bus lines three and nine will start and end at the Chorsu bazaar, and line fourteen will use the ring road. The metro will run as normal, and it will open an hour earlier, at five in the morning, so runners and families can arrive in time. Taxis will not be able to enter the area, and the best way to reach the race is on foot or by metro.\n\nIf you live on the route and need to leave home by car, please call the number on your letter. Doctors and ambulances will be able to cross the route at special points.\n\nRunners can choose a full race of forty-two kilometres, a half race of twenty-one kilometres, or a family run of five kilometres. The family run begins at ten o'clock. Money from the race will help build a new playground at the children's hospital.\n\nCome and cheer for the runners. There will be music, free water, and fruit on the route. Thank you for your help.",
    qs: [
      Q("How many runners will take part?", "More than eight thousand", ["More than eight thousand", "About eighty", "About eighteen thousand"]),
      Q("Where does the race start?", "In front of the Opera Theatre", ["In front of the Opera Theatre", "In Independence Square", "At the Chorsu bazaar"]),
      Q("When will the roads open again?", "At two in the afternoon", ["At two in the afternoon", "At noon", "At eight in the morning"]),
      Q("What will police do with cars left on the route?", "Move them", ["Move them", "Ignore them", "Give the owners a gift"]),
      TF("The metro will run as normal.", true),
      Q("Which bus line will use the ring road?", "Line fourteen", ["Line fourteen", "Line three", "Line nine"]),
      Q("When does the family run begin?", "At ten o'clock", ["At ten o'clock", "At eight o'clock", "At two o'clock"]),
      TF("Taxis can enter the race area.", false, "Taxis will not be able to enter the area."),
      Q("The family run is ___ kilometres long.", "five"),
      Q("Money from the race will help build a playground at the children's ___", "hospital")
    ]
  },
  {
    topic: "A new park",
    audioText: "Good news for the people of Namangan. After eighteen months of work, the new Friendship Park will open next Saturday at ten o'clock. It is the biggest park in the city, and it is built on the land of an old factory. The factory closed twenty years ago, and for a long time the land was empty and dirty.\n\nThe park has a big green lawn, a lake, and more than two thousand new trees. Workers planted apple, cherry, and plane trees. Around the lake there is a path for walking and running, and it is three kilometres long. You can rent a small boat for twenty minutes for ten thousand soums. Children will love the large playground with swings, a climbing wall, and a water garden, which is open in summer only.\n\nThere is also a sports area with two football pitches, a basketball court, and a table tennis area. People can use them for free, but they must book a time on the park website at weekends.\n\nFor visitors who like quiet, there is a library garden with benches, where people can borrow books and read under the trees. There is also a small cafe, which sells tea, sandwiches, and ice cream. Dogs are welcome on the lawn, but they must stay on a lead.\n\nThe park will be open from six in the morning until ten at night. Parking is free for the first two hours, and there is a bicycle path from the town centre. Bus number eight stops at the main gate every ten minutes.\n\nThe opening day has a free concert at four o'clock, and the mayor will plant the last tree. Please bring your family and friends.",
    qs: [
      Q("What was on the land before the park?", "A factory", ["A factory", "A school", "A farm"]),
      Q("How long did the work take?", "Eighteen months", ["Eighteen months", "Two years", "Six months"]),
      Q("How many new trees are there?", "More than two thousand", ["More than two thousand", "About two hundred", "About twenty"]),
      Q("How long is the path around the lake?", "Three kilometres", ["Three kilometres", "Five kilometres", "Ten kilometres"]),
      TF("The water garden is open all year.", false, "It is open in summer only."),
      Q("How much does a boat cost for twenty minutes?", "Ten thousand soums", ["Ten thousand soums", "Twenty thousand soums", "It is free"]),
      Q("Which bus stops at the main gate?", "Number eight", ["Number eight", "Number five", "Number ten"]),
      TF("Dogs are allowed on the lawn if they are on a lead.", true),
      Q("The park will be open until ten at ___", "night"),
      Q("The free concert is at ___ o'clock.", "four")
    ]
  },
  {
    topic: "A power cut",
    audioText: "This is an important notice from the City Electricity Company. Tomorrow, Tuesday, there will be a planned power cut in the east of the city. We are sorry, but our workers must change some old cables, and it is not safe to work with electricity on.\n\nThe power will go off at nine in the morning and come back at three in the afternoon. This is six hours without electricity. The cut affects the Yangiobod district, the area around Green Hospital, and the streets near the football stadium. If you are not sure about your street, you can look at the map on our website or phone the helpline, which is open from seven in the morning.\n\nHow can you get ready? First, please charge your phones, laptops, and torches tonight. Second, if you work from home, save your files often and, if possible, work in a library or a cafe in another district. Third, keep your fridge and freezer doors closed, because food stays cold for several hours if you do not open them. Fourth, turn off your oven and your washing machine before nine, and do not turn them on again until the power returns, because a sudden return of electricity can break machines.\n\nGreen Hospital has its own generator, so it will work normally. Traffic lights near the stadium will not work, and police officers will help drivers at the main crossings. Please drive slowly there.\n\nWater will not stop. However, the water pressure may be low on high floors, so fill a bottle or a bucket in the morning if you live on the ninth floor or above.\n\nWe will send a text message when the power returns. If it is still off at four, please call us. Thank you for your patience.",
    qs: [
      Q("Why is there a power cut?", "Workers must change old cables", ["Workers must change old cables", "There was a big storm", "People did not pay their bills"]),
      Q("When will the power come back?", "At three in the afternoon", ["At three in the afternoon", "At noon", "At six in the evening"]),
      Q("Which area is affected?", "The streets near the football stadium", ["The streets near the football stadium", "The streets near the airport", "The streets near the university"]),
      Q("When does the helpline open?", "At seven in the morning", ["At seven in the morning", "At nine in the morning", "At eight in the morning"]),
      TF("You should keep the fridge doors closed.", true),
      Q("Why should you turn off the oven and washing machine?", "A sudden return of electricity can break machines", ["A sudden return of electricity can break machines", "It saves money", "They may start a fire in the night"]),
      Q("What will not work near the stadium?", "Traffic lights", ["Traffic lights", "Buses", "Phones"]),
      TF("The water supply will stop during the power cut.", false, "Water will not stop."),
      Q("Green Hospital has its own ___", "generator"),
      Q("If you live on a high floor, fill a bottle or a ___ with water.", "bucket")
    ]
  },
  {
    topic: "A bus route change",
    audioText: "This is a service message from Metro Bus. From next Monday, some bus routes in our city will change. We hope the changes will make your journey faster.\n\nBus number seven will no longer go through the old market, because the road there is now only for people on foot. Instead, it will turn left at the Post Office and go along Furqat Street to the university. This makes the journey four minutes shorter. The bus stop at the old market will close, and a new stop will open outside the library.\n\nBus number twenty-one is a new route. It will connect the railway station with the airport, and it will run every fifteen minutes from five in the morning until midnight. A ticket costs three thousand soums, and you can pay by card or with the Metro app. There is room for suitcases at the back of the bus.\n\nBus number thirteen will run less often in the middle of the day. It will come every twenty minutes between ten and three, but it will still come every ten minutes in the rush hour.\n\nAll buses will now have free wifi and screens that show the next stop. The screens also speak in English and in Uzbek, which will help visitors.\n\nStudents under eighteen travel at half price with a school card. Older people over sixty-five travel free on every route.\n\nYou can find the new maps at every bus stop from Friday, and a printed leaflet is available from the information desk at the main station. For questions, please call our friendly team. Thank you for travelling with us.",
    qs: [
      Q("Why will bus seven change its route?", "The road is now only for people on foot", ["The road is now only for people on foot", "There was an accident", "The bridge is closed"]),
      Q("Where will bus seven turn left?", "At the Post Office", ["At the Post Office", "At the library", "At the university"]),
      Q("How much shorter will the journey be?", "Four minutes", ["Four minutes", "Ten minutes", "Fifteen minutes"]),
      Q("What does bus twenty-one connect?", "The railway station and the airport", ["The railway station and the airport", "The university and the hospital", "The market and the library"]),
      Q("How often will bus thirteen come in the middle of the day?", "Every twenty minutes", ["Every twenty minutes", "Every ten minutes", "Every fifteen minutes"]),
      Q("Who travels free on every route?", "People over sixty-five", ["People over sixty-five", "All students", "Children under ten"]),
      TF("A ticket for bus twenty-one costs three thousand soums.", true),
      TF("Students under eighteen pay full price.", false, "They travel at half price with a school card."),
      Q("A new bus stop will open outside the ___", "library"),
      Q("Bus twenty-one will run every ___ minutes.", "fifteen")
    ]
  },
  {
    topic: "A festival timetable",
    audioText: "Welcome to the Spring Music and Food Festival in Khiva. The festival begins this Friday and finishes on Sunday. Here is the timetable for the three days.\n\nOn Friday, the gates open at four in the afternoon. At five, there is the opening parade, with dancers in colourful costumes. It starts at the East Gate and ends in the main square. At seven, a famous singer, Shahzoda, will give a concert on the big stage. The first day finishes at ten with fireworks.\n\nSaturday is the busiest day. From ten in the morning, children can join workshops, where they can make paper masks and clay pots. At noon, there is a cooking show, and the chef Rustam will show how to make plov for three hundred people. Everyone can taste it for free at one o'clock. In the afternoon, at three, a young band from Bukhara plays folk music. At six, there is a poetry evening in the old library, and tickets cost five thousand soums. Please book early, because there are only eighty seats.\n\nOn Sunday, the festival is quieter. At eleven, there is a bicycle tour around the old city walls, which takes ninety minutes. At two o'clock, a street theatre group will perform a funny story for families. The final concert starts at five and finishes at eight, when the festival closes.\n\nFood stands are open on all three days from noon to nine. You can try sweet pastries, grilled fish, and fresh fruit juice. Please bring your own bottle, because water refills are free.\n\nTickets for the festival cost twenty thousand soums for one day, or fifty thousand for all three days. Children under ten enter free. Please arrive early, and wear comfortable shoes.",
    qs: [
      Q("When does the festival begin?", "On Friday", ["On Friday", "On Saturday", "On Sunday"]),
      Q("Where does the opening parade start?", "At the East Gate", ["At the East Gate", "In the main square", "In the old library"]),
      Q("What happens at ten on Friday night?", "Fireworks", ["Fireworks", "A concert", "A parade"]),
      Q("What can children make in the workshops?", "Paper masks and clay pots", ["Paper masks and clay pots", "Plov and bread", "Music and songs"]),
      TF("Everyone can taste the plov for free.", true),
      Q("How many seats are there at the poetry evening?", "Eighty", ["Eighty", "Three hundred", "Fifty"]),
      Q("How long is the bicycle tour?", "Ninety minutes", ["Ninety minutes", "One hour", "Two hours"]),
      TF("Children under twelve enter the festival free.", false, "Children under ten enter free."),
      Q("The name of the chef is ___", "rustam"),
      Q("The food stands are open from noon to ___", "nine")
    ]
  }
];
