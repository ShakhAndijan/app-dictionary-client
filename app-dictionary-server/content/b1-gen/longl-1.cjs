const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
const J = (a) => a.join("\n\n");
module.exports = [
  {
    topic: "Airport delay announcement",
    audioText: J([
      "Good morning, ladies and gentlemen, and welcome to Tashkent International Airport. This is an important announcement for all passengers travelling on the flight to Samarkand. Because of thick fog that covered the city early this morning, our aircraft arrived late from Moscow, and the departure has been delayed by two hours. The flight was due to leave at eight thirty, but the new departure time is half past ten. We are very sorry for the inconvenience, and we thank you for your patience.",
      "While you wait, the airline would like to offer every passenger a free breakfast. Please take the voucher that our staff are giving out at gate number twelve and show it at the Blue Garden cafe on the first floor. The voucher is valid for one hot drink and one sandwich or pastry. Passengers who are travelling with small children can also use the quiet family room next to gate fourteen, where there are comfortable chairs, toys and a small kitchen for warming baby food.",
      "If you have a connecting flight, please do not worry. Our service desk, which is located near the main entrance, will help you change your ticket without any extra payment. The desk is open from six in the morning until midnight, and the staff speak Uzbek, Russian and English. Passengers who decide that they no longer want to travel today may ask for a full refund, but they must do it before nine o'clock.",
      "We also remind you that the weather is expected to improve soon. The forecast says that the fog will disappear by nine, and the sun will come out later in the morning. Please keep an eye on the information screens, because the gate may change at short notice. Boarding will begin forty minutes before departure, and we ask all passengers to have their passports and boarding passes ready. Remember that each passenger may carry one small bag into the cabin, and heavier bags must go into the hold. The flight to Samarkand takes about fifty minutes, and the captain, Mr Karimov, promises a smooth journey. Thank you once again, and we wish you a pleasant stay at our airport."
    ]),
    qs: [
      Q("Why has the flight been delayed?", "Because of thick fog", ["Because of thick fog", "Because of a strike", "Because of a technical problem"]),
      Q("What is the new departure time?", "Half past ten", ["Half past ten", "Eight thirty", "Nine o'clock"]),
      Q("Where can passengers use the free breakfast voucher?", "At the Blue Garden cafe", ["At the Blue Garden cafe", "At gate twelve", "At the service desk"]),
      Q("Where is the quiet family room?", "Next to gate fourteen", ["Next to gate fourteen", "Near the main entrance", "On the first floor"]),
      Q("Until what time is the service desk open?", "Midnight", ["Midnight", "Six in the morning", "Nine o'clock"]),
      Q("Passengers who want a refund must ask before", "nine o'clock", ["nine o'clock", "ten o'clock", "noon"]),
      TF("The flight to Samarkand takes about fifty minutes.", true),
      TF("Boarding begins one hour before departure.", false, "It begins forty minutes before departure."),
      Q("The voucher is valid for one hot ___ and one sandwich or pastry.", "drink"),
      Q("Each passenger may carry one small ___ into the cabin.", "bag")
    ]
  },
  {
    topic: "Booking a hotel in Istanbul",
    audioText: J([
      "Dilnoza wanted to spend a long weekend in Istanbul with her sister Malika, so on Monday evening she telephoned a small hotel near the Blue Mosque. A friendly man called Mehmet answered the phone and asked how he could help. Dilnoza explained that she needed a double room with two separate beds for three nights, from the fourteenth to the seventeenth of May. Mehmet checked his computer and said that he had one room left on the third floor with a view of the sea.",
      "Dilnoza asked about the price. Mehmet answered that the room cost ninety euros a night, and breakfast was included. She thought that was a little expensive, so she asked whether there was a cheaper room. He said that a room without a view on the ground floor cost seventy euros, but it was next to the kitchen and could be noisy in the morning. Dilnoza decided that she preferred to pay more and sleep well, so she chose the room with the sea view.",
      "Then she asked some practical questions. How far was the hotel from the airport? Mehmet explained that it was about forty kilometres away, and that the hotel could send a car for twenty-five euros. A taxi from the street would be cheaper, but the driver might choose a longer road. Dilnoza liked the idea of a safe car waiting for them, because their plane would land very late at night, at a quarter to midnight. Mehmet promised that the driver would hold a sign with her name.",
      "Finally, Mehmet asked for her details. She spelled her name slowly, gave her email address and said that she would pay by credit card. He told her that she could cancel the booking free of charge until a week before arrival. After that, the hotel would keep the price of the first night. Dilnoza thanked him warmly, and Mehmet said that he would send a confirmation message within ten minutes. When she put the phone down, she called Malika at once to share the good news. Her sister was delighted and immediately began to make a list of the places they wanted to see, including the Grand Bazaar and a boat trip on the Bosphorus."
    ]),
    qs: [
      Q("Who will Dilnoza travel with?", "Her sister", ["Her sister", "Her mother", "Her friend"]),
      Q("On which floor is the room she booked?", "The third floor", ["The third floor", "The ground floor", "The first floor"]),
      Q("How much is the room with the sea view per night?", "Ninety euros", ["Ninety euros", "Seventy euros", "Eighty euros"]),
      Q("Why did Dilnoza not choose the cheaper room?", "It could be noisy", ["It could be noisy", "It was too small", "It had no bathroom"]),
      Q("How much does the hotel car from the airport cost?", "Twenty-five euros", ["Twenty-five euros", "Forty euros", "Fifteen euros"]),
      Q("When will their plane land?", "At a quarter to midnight", ["At a quarter to midnight", "At half past ten", "At noon"]),
      TF("Breakfast is included in the price of the room.", true),
      TF("Dilnoza can cancel for free until a day before arrival.", false, "She can cancel free of charge until a week before arrival."),
      Q("Mehmet said he would send a confirmation ___ within ten minutes.", "message"),
      Q("Malika began to make a ___ of the places they wanted to see.", "list")
    ]
  },
  {
    topic: "A radio talk about train travel",
    audioText: J([
      "Welcome to Travel Talk on Radio Silk Road. I am your host, Aziza, and today I want to speak about the joys of travelling by train. Many people think that trains are slow and old fashioned, but I have changed my mind this year after a journey from Tashkent to Bukhara on the high-speed train. The trip takes only about three hours, and the carriages are clean, quiet and very comfortable.",
      "Let me tell you about my own journey. I arrived at the station at seven in the morning, an hour before the train left, because I wanted to buy a coffee and read the newspaper. Tickets can be bought online, and I paid forty dollars for a seat in second class. First class costs about sixty dollars, but the only real difference is a little more space and a free snack. My seat was next to the window, and I could watch the villages, the cotton fields and the desert go past. A young man named Bobur sat beside me, and we talked for most of the trip. He is a student of history, and he was going to Bukhara to visit his grandmother.",
      "Of course, train travel has some disadvantages too. In the summer the stations can be very hot and crowded, and tickets often sell out several days before a holiday. If you want to travel on a Friday or a Sunday, you should book at least a week in advance. Also, the luggage space is small, so please do not bring three suitcases. One medium bag is enough for a short trip.",
      "Why do I prefer the train to the plane? First, you do not need to go through long security checks. Second, the stations are in the centre of the city, so you save time and money on taxis. Third, and most important for me, you see the country with your own eyes. At the end of the show I would like to hear from you. Send me a message about your favourite train journey, and I will read the best stories next Thursday. Now, let us listen to some music before our next guest arrives, a professor who will explain how the railway changed Central Asia."
    ]),
    qs: [
      Q("How long does the trip from Tashkent to Bukhara take?", "About three hours", ["About three hours", "About five hours", "About eight hours"]),
      Q("How much did Aziza pay for her ticket?", "Forty dollars", ["Forty dollars", "Sixty dollars", "Fifty dollars"]),
      Q("What is the main difference in first class?", "A little more space and a free snack", ["A little more space and a free snack", "A faster train", "A bed for the night"]),
      Q("Who sat next to Aziza?", "A history student named Bobur", ["A history student named Bobur", "A teacher named Bobur", "Her grandmother"]),
      Q("How early should you book for a Friday or a Sunday?", "At least a week", ["At least a week", "One day", "One month"]),
      Q("Why are taxis less necessary when you take the train?", "The stations are in the city centre", ["The stations are in the city centre", "Taxis are free", "The train stops at your door"]),
      TF("First class costs about sixty dollars.", true),
      TF("Aziza arrived at the station two hours before the train left.", false, "She arrived an hour before."),
      Q("She watched the villages, the cotton ___ and the desert go past.", "fields"),
      Q("Tickets often sell ___ several days before a holiday.", "out")
    ]
  },
  {
    topic: "Interview with a tour guide in Khiva",
    audioText: J([
      "Today the reporter Sanjar is interviewing Gulnora, a tour guide who has worked in the old city of Khiva for twelve years. Sanjar begins by asking why she chose this job. Gulnora smiles and says that she grew up inside the old walls, and as a child she used to follow the groups of tourists and listen to the stories. By the age of sixteen she knew every street, and she decided to study languages at university so that she could share her city with the world.",
      "Sanjar then asks about a typical day. Gulnora explains that she meets her group at eight o'clock at the West Gate, because the morning light is best for photographs and the heat is not yet strong. The walk takes about four hours and includes the Kalta Minor minaret, the Juma Mosque with its forest of wooden columns, and the Tosh Hovli Palace. After the tour she takes everyone to a small family restaurant for a lunch of lamb soup and fresh bread.",
      "The reporter wants to know about the most difficult part of her work. Gulnora says it is the summer weather. Temperatures can reach forty-five degrees, and some visitors forget to bring water or hats. She always carries extra bottles in her bag, and she tells her groups to rest in the shade at noon. Another challenge is the large number of tourists in April and October, when she sometimes leads thirty people at once. In that case she uses a small microphone so that everybody can hear her.",
      "Next, Sanjar asks what advice she would give to a first-time visitor. Gulnora recommends staying for at least two nights, because Khiva looks completely different in the evening, when the walls turn orange and the streets become quiet. She also suggests wearing comfortable shoes, since the old stones are uneven. Finally, she says that visitors should talk to the local craftsmen, who make carpets, silk scarves and wooden boxes. She says that a small gift bought directly from a craftsman is the best memory of the trip. Sanjar thanks her for the interview and wishes her a busy and successful season."
    ]),
    qs: [
      Q("How long has Gulnora worked as a guide?", "Twelve years", ["Twelve years", "Sixteen years", "Two years"]),
      Q("Where does she meet her groups?", "At the West Gate", ["At the West Gate", "At the Juma Mosque", "At the restaurant"]),
      Q("Why does she start the tour at eight o'clock?", "The light is good and it is not yet hot", ["The light is good and it is not yet hot", "The shops open then", "The palace closes early"]),
      Q("What is the hardest part of her work?", "The summer weather", ["The summer weather", "The long walks", "Learning languages"]),
      Q("How many people does she sometimes lead in April and October?", "Thirty", ["Thirty", "Ten", "Fifty"]),
      Q("How long does she advise visitors to stay?", "At least two nights", ["At least two nights", "One day", "A full week"]),
      TF("Gulnora grew up inside the old walls of Khiva.", true),
      TF("When she leads a big group she uses a loudspeaker on a car.", false, "She uses a small microphone."),
      Q("She decided to study ___ at university.", "languages"),
      Q("She tells her groups to rest in the ___ at noon.", "shade")
    ]
  },
  {
    topic: "Lost luggage in London",
    audioText: J([
      "When Jasur landed in London after a nine hour flight, he was tired but happy. He was going to spend two weeks there at a language school, and he had a big blue suitcase with all his clothes, books and a new winter coat. He waited at the baggage belt for almost forty minutes, watching the same bags go round and round. One by one, the other passengers took their luggage and left, and finally the belt stopped. His suitcase had not arrived.",
      "Jasur felt worried, but he remembered his teacher's advice to stay calm and speak to the airline staff. He walked to the lost luggage office, where a woman called Mrs Taylor was sitting behind a desk. She asked him to fill in a form with his name, flight number and a description of the case. Jasur wrote that it was blue, medium sized, with a red ribbon on the handle. Mrs Taylor typed the information into her computer and discovered that the suitcase had been sent by mistake to Frankfurt, in Germany.",
      "She told him not to worry, because the case would arrive in London the next morning on the first flight, and the airline would deliver it to his address by lunchtime. Jasur was relieved, but he asked what he should do tonight, because he had no clothes, no toothbrush and no phone charger. Mrs Taylor gave him a small emergency bag with a T-shirt, a toothbrush, soap and a towel. She also explained that the airline would pay up to eighty pounds for any necessary things he had to buy, if he kept the receipts.",
      "Jasur took the underground to his host family's house, which was in a quiet street in the north of the city. The host mother, Mrs Evans, welcomed him with a cup of tea and lent him some pyjamas that belonged to her son. The next day the suitcase really did arrive at one o'clock, just as promised, and Jasur was delighted to see his winter coat again. He learned an important lesson from the adventure. From now on, he said, he would always keep a spare shirt, a charger and his medicine in his hand luggage, and he would take a photograph of his suitcase before every trip. He also told his friends to put a bright ribbon on their bags, because it makes them easier to recognise."
    ]),
    qs: [
      Q("How long was Jasur's flight?", "Nine hours", ["Nine hours", "Five hours", "Twelve hours"]),
      Q("How long did Jasur wait at the baggage belt?", "Almost forty minutes", ["Almost forty minutes", "Almost two hours", "About ten minutes"]),
      Q("Where had the suitcase been sent by mistake?", "Frankfurt", ["Frankfurt", "Moscow", "Paris"]),
      Q("How much would the airline pay for necessary things?", "Up to eighty pounds", ["Up to eighty pounds", "Up to fifty pounds", "Nothing"]),
      Q("Who lent Jasur some pyjamas?", "Mrs Evans", ["Mrs Evans", "Mrs Taylor", "His teacher"]),
      Q("When did the suitcase arrive the next day?", "At one o'clock", ["At one o'clock", "At nine o'clock", "At midnight"]),
      TF("Jasur's suitcase was blue with a red ribbon on the handle.", true),
      TF("Jasur spent the first night in a hotel.", false, "He stayed with a host family."),
      Q("Jasur had no clothes, no ___ and no phone charger.", "toothbrush"),
      Q("Jasur took the ___ to his host family's house.", "underground")
    ]
  },
  {
    topic: "A cycling holiday in Wales",
    audioText: J([
      "Hello everyone, and thank you for coming to my talk at the Adventure Club. My name is Rachel, and tonight I will tell you about the cycling holiday that I took last summer with my brother Tom through the north of Wales. We covered three hundred kilometres in eight days, and it was the best trip of my life, although it was also the hardest.",
      "We started in the small town of Conwy, where we hired two mountain bikes for sixty pounds each for the whole week. The man at the shop gave us a map, a repair kit and a piece of good advice: always check the weather before leaving in the morning. We ignored him on the second day, and that was a mistake. Halfway up a long hill, heavy rain began, and within ten minutes we were wet to the skin. We found shelter in a tiny cafe, where the owner, an old lady called Gwen, made us hot chocolate and dried our jackets next to the fire.",
      "The most beautiful part of the journey was the road around Snowdonia National Park. On the fourth day we cycled beside a blue lake called Llyn Padarn, and we stopped for lunch under a tree. Tom had a puncture there, and we spent an hour repairing the tyre, laughing at how little we knew about bicycles. Each evening we stayed in a different guesthouse. The cheapest was thirty pounds a night, with a big Welsh breakfast, and the most expensive was fifty, with a swimming pool.",
      "There were difficult moments, too. On the sixth day Tom's knee started to hurt, and we had to take a train for part of the route. Still, we both agree that the trip taught us patience and teamwork. If you are thinking about a similar holiday, I have three tips. First, do not carry too much luggage; one small backpack is plenty. Second, drink water regularly, even when you do not feel thirsty. Third, start early in the day, because the afternoon wind can be strong. Now, I will show some photographs, and then I will be happy to answer your questions."
    ]),
    qs: [
      Q("Who did Rachel travel with?", "Her brother", ["Her brother", "Her husband", "A cycling club"]),
      Q("How far did they cycle in eight days?", "Three hundred kilometres", ["Three hundred kilometres", "One hundred kilometres", "Eight hundred kilometres"]),
      Q("How much did each bike cost to hire for the week?", "Sixty pounds", ["Sixty pounds", "Thirty pounds", "Fifty pounds"]),
      Q("Who dried their jackets?", "Gwen", ["Gwen", "The shop owner", "Tom"]),
      Q("Where did they stop for lunch on the fourth day?", "Beside a lake", ["Beside a lake", "In a cafe", "At a guesthouse"]),
      Q("What happened on the sixth day?", "Tom's knee started to hurt", ["Tom's knee started to hurt", "The bikes were stolen", "It snowed heavily"]),
      TF("Rachel and Tom hired their bikes in the town of Conwy.", true),
      TF("The cheapest guesthouse cost fifty pounds a night.", false, "The cheapest cost thirty pounds."),
      Q("The shop owner advised them to always check the ___ before leaving.", "weather"),
      Q("Tom had a ___ and they repaired the tyre for an hour.", "puncture")
    ]
  },
  {
    topic: "Bus station timetable changes",
    audioText: J([
      "Attention please, all passengers at the Central Bus Station. We have some important changes to the timetable this week, so please listen carefully. Because the road between Tashkent and Fergana is being repaired near the Kamchik Pass, all buses to Fergana, Andijan and Namangan will leave forty minutes later than usual until the end of the month.",
      "The morning bus to Fergana, which normally leaves at seven fifteen, will now depart at five to eight from platform six. The afternoon bus will leave at two o'clock from platform seven. The journey, which usually takes five hours, may take up to six and a half, so passengers should bring food and water. The driver will make a stop at a roadside restaurant after three hours, and the break will last twenty minutes.",
      "Tickets are available at the counters on the ground floor, in the mobile app and at the machines near the main entrance. A single ticket to Fergana costs seventy thousand soums, and a return ticket costs one hundred and twenty thousand. Students and pensioners get a discount of twenty percent if they show their cards. Please remember that tickets bought on the bus are more expensive, and the driver cannot accept cards, only cash.",
      "We also have news about the services to Samarkand. A new express bus has started on Mondays, Wednesdays and Fridays. It has air conditioning, free wifi and large seats, and it goes without a stop in the middle. It leaves at nine in the morning and arrives at about two in the afternoon. The station manager, Mr Rustamov, says that many passengers asked for such a service. For safety, we remind everybody to keep their bags with them and not to leave them unattended in the waiting hall. Lost items can be collected at the information desk which is open every day until eight in the evening. The toilets are on the first floor, and the pharmacy is beside the cafe. Thank you for travelling with us, and we apologise for any delay."
    ]),
    qs: [
      Q("Why are the buses leaving later than usual?", "The road is being repaired", ["The road is being repaired", "There is heavy snow", "There are not enough drivers"]),
      Q("What is the new morning departure time to Fergana?", "Five to eight", ["Five to eight", "Seven fifteen", "Two o'clock"]),
      Q("Which platform does the afternoon bus use?", "Platform seven", ["Platform seven", "Platform six", "Platform two"]),
      Q("How long is the break at the roadside restaurant?", "Twenty minutes", ["Twenty minutes", "One hour", "Five minutes"]),
      Q("How much discount do students get?", "Twenty percent", ["Twenty percent", "Ten percent", "Half price"]),
      Q("On which days does the new express to Samarkand run?", "Monday, Wednesday and Friday", ["Monday, Wednesday and Friday", "Every day", "Saturday and Sunday"]),
      TF("A return ticket to Fergana costs one hundred and twenty thousand soums.", true),
      TF("The driver on the bus accepts cards.", false, "The driver accepts only cash."),
      Q("The new express bus has air conditioning, free ___ and large seats.", "wifi"),
      Q("Lost items can be collected at the information ___.", "desk")
    ]
  },
  {
    topic: "Camping in the mountains",
    audioText: J([
      "Last weekend my friends and I went camping in the Chimgan mountains, about eighty kilometres from Tashkent. There were five of us: me, my cousin Farrukh, our classmates Madina and Otabek, and Madina's little brother Ali, who is only ten. We met at six in the morning at the bus stop, each of us carrying a heavy backpack with a tent, a sleeping bag, food for two days and warm clothes.",
      "The minibus took us to the village at the bottom of the mountain in two hours, and we started walking at half past eight. The path was steep and stony, and after an hour Ali was already complaining that his legs hurt. Otabek, who is the most experienced of us, carried Ali's bag for a while, and we stopped every thirty minutes to drink water and eat dried apricots. At last, around one o'clock, we reached a flat green place beside a small river. It was perfect for the camp.",
      "We put up the tents first, which took us almost an hour because Farrukh had forgotten the instructions. Then we collected wood and made a fire. Madina cooked rice with carrots and beef in a big pot, and it tasted wonderful after the long walk. In the evening, the temperature dropped to five degrees, and we sat around the fire in our jackets, singing songs and telling stories. Otabek played the guitar. Later, when we looked up, the sky was full of stars, more than any of us had ever seen in the city.",
      "The next morning we woke up early because of the cold. We had tea and bread for breakfast and decided to climb to a small waterfall that a shepherd had told us about. It took forty minutes, and the view was worth it. Before going home, we cleaned the place carefully and took all our rubbish back with us, because we want the mountains to stay beautiful. The way back was easier since it was downhill. We reached Tashkent at eight in the evening, tired, dirty and very happy. Everyone agreed to repeat the trip in autumn, and this time Ali wants to bring his own small tent."
    ]),
    qs: [
      Q("How far are the Chimgan mountains from Tashkent?", "About eighty kilometres", ["About eighty kilometres", "About twenty kilometres", "About two hundred kilometres"]),
      Q("How many people went on the trip?", "Five", ["Five", "Four", "Seven"]),
      Q("Who carried Ali's bag for a while?", "Otabek", ["Otabek", "Farrukh", "Madina"]),
      Q("What was the temperature in the evening?", "Five degrees", ["Five degrees", "Fifteen degrees", "Zero degrees"]),
      Q("Who played the guitar?", "Otabek", ["Otabek", "Farrukh", "Ali"]),
      Q("How long did it take to reach the waterfall?", "Forty minutes", ["Forty minutes", "Two hours", "Ten minutes"]),
      TF("The minibus journey to the village took two hours.", true),
      TF("Ali is twelve years old.", false, "Ali is ten."),
      Q("Then we collected ___ and made a fire.", "wood"),
      Q("Madina cooked ___ with carrots and beef in a big pot.", "rice")
    ]
  },
  {
    topic: "A Mediterranean cruise",
    audioText: J([
      "This is Holiday Hour, and today our guest is Mr Peter Collins, who has just returned from a ten day cruise around the Mediterranean with his wife Susan. Peter, welcome to the programme. He begins by explaining that he never wanted to go on a cruise because he thought it would be boring and full of old people. His wife booked the holiday as a surprise for their fortieth wedding anniversary, and he did not want to disappoint her.",
      "The ship left from Barcelona on a Saturday afternoon, and it carried about two thousand passengers. Peter was surprised by its size. It had five restaurants, three swimming pools, a cinema and even a small theatre. Their cabin was on the sixth deck, and it had a little balcony with a view of the sea. He says that the first night he did not sleep well because the waves moved the ship, but by the second day he was used to it.",
      "The ship visited five ports: Marseille, Genoa, Rome, Naples and Valletta. In each port the passengers could go on an organised tour or explore by themselves. In Rome, Peter and Susan chose a guided tour of the Colosseum, which cost seventy euros each, and he thought it was excellent. In Naples they tried real Italian pizza in a tiny family restaurant, and he says it was the best meal of the whole trip. However, the days in port were short, and sometimes they had only six hours before they had to return to the ship.",
      "The host asks about the disadvantages. Peter admits that cruises can be expensive, because drinks, trips and internet are not included in the price. The holiday cost them about three thousand euros in total. Another problem is the crowd; at breakfast there were long queues for the coffee machines. Still, Peter now says that he would go again, and he especially recommends it to people who hate packing and unpacking, because you carry your hotel with you. He advises listeners to book at least six months in advance to get a cheaper price, and to choose a cabin in the middle of the ship, where the movement is smaller. The host thanks him and promises to ask next week's guest about walking holidays in Scotland."
    ]),
    qs: [
      Q("How long was the cruise?", "Ten days", ["Ten days", "Seven days", "Two weeks"]),
      Q("Why did Peter go on the cruise?", "His wife booked it for their anniversary", ["His wife booked it for their anniversary", "He won it in a competition", "His company paid for it"]),
      Q("Where did the ship leave from?", "Barcelona", ["Barcelona", "Marseille", "Naples"]),
      Q("On which deck was their cabin?", "The sixth deck", ["The sixth deck", "The first deck", "The tenth deck"]),
      Q("Where did Peter eat the best meal of the trip?", "In Naples", ["In Naples", "In Rome", "On the ship"]),
      Q("How much did the holiday cost in total?", "About three thousand euros", ["About three thousand euros", "About one thousand euros", "About ten thousand euros"]),
      TF("The ship carried about two thousand passengers.", true),
      TF("The tour of the Colosseum was free.", false, "It cost seventy euros each."),
      Q("Peter never wanted to go on a ___ because he thought it would be boring.", "cruise"),
      Q("He advises choosing a cabin in the ___ of the ship.", "middle")
    ]
  },
  {
    topic: "Renting a car in Georgia",
    audioText: J([
      "Lola and her husband Anvar were planning a road trip around Georgia, and they decided to rent a car for a week. On Tuesday morning Lola called a rental company in Tbilisi called Caucasus Cars. A young woman named Nino answered and asked what kind of car they wanted. Lola said that they needed a small, economical car for two adults and two suitcases, because they did not want to spend too much on petrol.",
      "Nino recommended a white Toyota hatchback. It cost thirty-five dollars a day, and the price included insurance and unlimited kilometres. A bigger car, such as a jeep, was fifty-five dollars a day, but Lola said that they did not need it. Nino also asked whether they had international driving licences. Lola replied that Anvar had one, and he would be the only driver. Nino said that this was fine, but a second driver could be added for five dollars a day.",
      "Next, Lola asked about the pick up. Nino explained that the office was in the city centre, next to the central railway station, and it opened at nine o'clock. The car would be ready on Saturday morning, and the customers had to bring their passports, licences and a credit card for a deposit of two hundred dollars. The deposit would be returned a few days after they brought the car back, as long as there was no damage. She also advised them to take photographs of the car before driving away, to avoid any problems later.",
      "Lola wanted to know about fuel. Nino said that the car would have a full tank at the start, and they should return it full as well, otherwise they would pay a fee. She added that petrol stations are easy to find on the main roads, but in the mountains they are rare, so it is wise to fill up whenever the tank is half empty. Lola also asked if the car had a navigation system. Nino answered that it did not, but she could give them a free paper map or they could use their phones. Lola agreed to book the car, paid a small advance by card and received a confirmation by email. She hung up and told Anvar that everything was ready. He was so pleased that he immediately started to plan the route to the mountain town of Kazbegi."
    ]),
    qs: [
      Q("What is the name of the rental company?", "Caucasus Cars", ["Caucasus Cars", "Tbilisi Rent", "Georgia Wheels"]),
      Q("How much does the small car cost per day?", "Thirty-five dollars", ["Thirty-five dollars", "Fifty-five dollars", "Five dollars"]),
      Q("How much extra is a second driver per day?", "Five dollars", ["Five dollars", "Ten dollars", "Fifteen dollars"]),
      Q("How big is the deposit?", "Two hundred dollars", ["Two hundred dollars", "One hundred dollars", "Five hundred dollars"]),
      Q("What must customers do with the fuel?", "Return the car with a full tank", ["Return the car with a full tank", "Return it empty", "Pay for the fuel in advance"]),
      Q("What does Nino offer instead of a navigation system?", "A free paper map", ["A free paper map", "A mobile phone", "A driver"]),
      TF("The price of the car includes insurance.", true),
      TF("The rental office opens at eight o'clock.", false, "It opens at nine o'clock."),
      Q("Lola needed a small, economical ___ for two adults and two suitcases.", "car"),
      Q("Customers must bring passports, licences and a credit ___ for the deposit.", "card")
    ]
  },
  {
    topic: "A city break in Prague",
    audioText: J([
      "Good afternoon, everybody, and welcome to our travel evening at Sunrise Holidays. I am Kamola, a travel agent, and tonight I would like to talk about one of our most popular city breaks: four days in Prague, the capital of the Czech Republic. Many of our customers say that it is like a fairy tale city, with old bridges, colourful houses and a huge castle above the river.",
      "Let us begin with the practical side. Our package includes return flights from Tashkent with a change in Istanbul, three nights in a three star hotel in the old town, and breakfast every morning. The price is six hundred and fifty dollars per person, if two people share a room. If you want a single room, you should add one hundred dollars. The flights leave on Thursday evenings, and you return on Monday afternoon, so you only miss two working days.",
      "What should you do in Prague? On the first day, we suggest a walk across Charles Bridge early in the morning, before the crowds arrive. Then visit the castle, where you can see the cathedral and the beautiful gardens. Tickets cost about twenty dollars, and it is better to buy them online. The second day could be spent in the museums or on a river cruise, which lasts one hour and includes a cold drink. In the evening, do not miss a traditional dinner with roast pork, dumplings and local beer. If you do not drink alcohol, try the hot apple juice, which is very popular in winter.",
      "Now a few tips. The best time to travel is April or September, when the weather is mild and the hotels are cheaper. In July and August the city is very busy, and in December it can be extremely cold. The local currency is the crown, not the euro, so we recommend that you change a small amount of money at the airport and then use your card. Public transport is excellent, and a three day ticket costs only about thirteen dollars. Finally, learn two or three words in Czech, such as thank you, because local people are always happy when visitors try to speak their language. If you have any questions, please come to my desk after the talk, and I will give each of you a free brochure."
    ]),
    qs: [
      Q("What is the name of the travel agency?", "Sunrise Holidays", ["Sunrise Holidays", "Czech Tours", "Golden Bridge"]),
      Q("How much does the package cost per person in a shared room?", "Six hundred and fifty dollars", ["Six hundred and fifty dollars", "Four hundred dollars", "Seven hundred and fifty dollars"]),
      Q("Where do passengers change planes?", "Istanbul", ["Istanbul", "Dubai", "Moscow"]),
      Q("When do the flights leave?", "On Thursday evenings", ["On Thursday evenings", "On Monday afternoons", "On Saturday mornings"]),
      Q("How long does the river cruise last?", "One hour", ["One hour", "Three hours", "Half a day"]),
      Q("When is the best time to travel?", "April or September", ["April or September", "July or August", "December"]),
      TF("A single room costs one hundred dollars extra.", true),
      TF("The Czech Republic uses the euro.", false, "The local currency is the crown."),
      Q("At the castle you can see the ___ and the beautiful gardens.", "cathedral"),
      Q("A traditional dinner has roast pork, ___ and local beer.", "dumplings")
    ]
  },
  {
    topic: "Interview with a ferry captain",
    audioText: J([
      "In this week's programme, journalist Dildora talks to Captain Nilsson, who has driven passenger ferries between Sweden and Finland for twenty-six years. She starts by asking him how he became a captain. He explains that his father was a fisherman, and as a boy he spent every summer on small boats in the harbour. At eighteen, he went to a maritime school in Gothenburg, where he studied for four years, and his first job was as an assistant on a cargo ship.",
      "Dildora asks about his present ferry. It is a big white ship with eight decks, and it can carry sixteen hundred passengers and four hundred cars. The crossing takes about eleven hours overnight, leaving Stockholm at five in the afternoon and arriving in Helsinki at four in the morning. Many passengers sleep in comfortable cabins, while others enjoy the restaurants, the shops or the dance floor. Captain Nilsson says that, in his opinion, the sunset over the islands is the most beautiful moment of the trip.",
      "What is the most difficult part of the job? The captain answers that it is the weather, especially in winter when ice forms in the sea and storms are common. Once, five years ago, a storm was so strong that the waves reached the fourth deck and the ferry arrived six hours late. He had to stay on the bridge for twenty hours without sleeping. However, he adds that safety is always the first priority. Before every trip, the crew checks the engines, the radios and the life boats, and every passenger watches a short safety video.",
      "Finally, Dildora asks what he does in his free time. Captain Nilsson laughs and says that, surprisingly, he loves the water so much that he spends his holidays sailing in a small boat with his wife and their two daughters. He also grows tomatoes and potatoes in his garden. When he retires in four years, he wants to travel by train across Asia, because he has never seen the mountains. Dildora thanks him for the interesting conversation and wishes him calm seas and good weather. Next week she will talk to an air traffic controller about the work behind the busy skies. Do not miss it."
    ]),
    qs: [
      Q("How long has Captain Nilsson been a captain?", "Twenty-six years", ["Twenty-six years", "Eighteen years", "Four years"]),
      Q("What was his father's job?", "Fisherman", ["Fisherman", "Teacher", "Ship captain"]),
      Q("How many passengers can the ferry carry?", "Sixteen hundred", ["Sixteen hundred", "Four hundred", "Eight hundred"]),
      Q("How long does the crossing take?", "About eleven hours", ["About eleven hours", "About five hours", "About twenty hours"]),
      Q("How late was the ferry after the strong storm?", "Six hours", ["Six hours", "One hour", "Twenty hours"]),
      Q("What does he do on holidays?", "Sails with his family", ["Sails with his family", "Travels by train", "Grows tomatoes abroad"]),
      TF("The ferry leaves Stockholm at five in the afternoon.", true),
      TF("The captain stayed on the bridge for ten hours during the storm.", false, "He stayed for twenty hours."),
      Q("The captain says the sunset over the ___ is the most beautiful moment.", "islands"),
      Q("The weather is difficult in winter when ice forms in the ___ and storms are common.", "sea")
    ]
  },
  {
    topic: "Welcome talk at a youth hostel",
    audioText: J([
      "Welcome to Green Door Hostel, everybody. My name is Sam, and I am the manager. Before you go to your rooms, I would like to explain a few things that will make your stay easier and more enjoyable. We have forty beds in total in six rooms, and each guest has a locker under the bed, so please bring a lock. If you forgot one, you can buy a small lock at reception for two euros.",
      "Check in is from two in the afternoon, and check out is at eleven in the morning. If you need to leave later, you can keep your bags in the storage room for free. Breakfast is served from seven thirty to ten in the dining room, and it is included in the price, which is eighteen euros per night. It includes bread, jam, eggs, fruit and coffee. For dinner, you can use the shared kitchen on the ground floor, but please wash your plates afterwards, and do not leave food in the fridge for more than three days.",
      "The wifi is free, and the password is written on the board behind reception. We have a quiet rule after ten at night, so if you want to talk or play music, please go to the common room or the garden. The front door is locked at midnight, but you will receive a key card if you plan to return late. Please do not lose it, because a new one costs ten euros. We also organise activities. Every Wednesday evening there is a free walking tour of the old town, which starts at six, and on Fridays we cook a big international dinner together.",
      "Now some advice about the city. The nearest metro station is five minutes on foot, and a day ticket costs six euros. The best market is on Saturday mornings near the river, and it is cheap and full of local food. Be careful with your phone and wallet in crowded places, because pickpockets are active in tourist areas. If you have any problems, you can always find me or my colleague Elena at the desk. We are here day and night. Finally, please remember to turn off the lights and the air conditioning when you leave the room. We care about the environment, and we hope you do, too. Enjoy your stay, and thank you for choosing our hostel."
    ]),
    qs: [
      Q("What is the manager's name?", "Sam", ["Sam", "Elena", "Peter"]),
      Q("How much is one night including breakfast?", "Eighteen euros", ["Eighteen euros", "Ten euros", "Six euros"]),
      Q("Until what time is breakfast served?", "Ten o'clock", ["Ten o'clock", "Seven thirty", "Eleven o'clock"]),
      Q("How much does a new key card cost?", "Ten euros", ["Ten euros", "Two euros", "Six euros"]),
      Q("When is the free walking tour?", "Wednesday evening at six", ["Wednesday evening at six", "Friday evening at six", "Saturday morning"]),
      Q("When is the best market?", "On Saturday mornings", ["On Saturday mornings", "On Friday evenings", "On Wednesday afternoons"]),
      TF("Check out is at eleven in the morning.", true),
      TF("The front door is locked at ten at night.", false, "It is locked at midnight."),
      Q("Each guest has a ___ under the bed, so please bring a lock.", "locker"),
      Q("The wifi is free, and the ___ is written on the board behind reception.", "password")
    ]
  },
  {
    topic: "A night train with my grandfather",
    audioText: J([
      "Last winter I took a night train from Tashkent to Termez with my grandfather, and it was an experience that I will never forget. I am Bekzod, and I am nineteen years old. My grandfather, Abdulla, is seventy-eight, and he wanted to visit his old friend in the south before the winter got too cold. My parents were worried about his health, so I volunteered to travel with him.",
      "The train left at nine in the evening from the main station, and we had a small compartment with four beds. Our travelling companions were a quiet teacher from Surkhandarya, named Shahlo, and her daughter, who was about six. Grandfather quickly started a conversation with them, and soon we were all drinking tea from the conductor's big kettle. The tea cost only a few thousand soums per glass, and it came with sugar and a little biscuit. The rhythm of the wheels made me feel sleepy, and I went to bed at eleven.",
      "The journey lasted about thirteen hours, and in the middle of the night something unexpected happened. The train stopped for nearly an hour at a small station because of snow on the line. The conductor, a tall man with a moustache, explained that workers were clearing the rails and told us not to worry. Grandfather said that when he was young such stops were normal, and he began telling stories about his first train trip in nineteen sixty-two. He had gone to a technical college in Tashkent, and the journey took two days then.",
      "When I woke up in the morning, the landscape outside had completely changed. There was no snow anymore, only dry hills and the sun shining on a wide river. We arrived in Termez at ten, almost two hours late. Grandfather's friend, Murod, was waiting on the platform with a bunch of flowers and a huge smile, and the two old men hugged each other for a long time. Watching them, I understood why my grandfather had wanted to make this trip so much. I stayed in Termez for three days, ate delicious melons even in winter, visited the ancient Buddhist ruins and took a plane back to Tashkent, because Grandfather decided to stay a month. Next time, I promise, I will take the train again."
    ]),
    qs: [
      Q("How old is Bekzod's grandfather?", "Seventy-eight", ["Seventy-eight", "Nineteen", "Sixty-two"]),
      Q("Why did Bekzod go with his grandfather?", "His parents were worried about his health", ["His parents were worried about his health", "He had a free ticket", "He wanted to see a new city alone"]),
      Q("When did the train leave Tashkent?", "At nine in the evening", ["At nine in the evening", "At eleven at night", "At ten in the morning"]),
      Q("Who shared their compartment?", "A teacher and her daughter", ["A teacher and her daughter", "Two students", "A doctor and his son"]),
      Q("Why did the train stop in the night?", "There was snow on the line", ["There was snow on the line", "The engine broke", "A passenger was ill"]),
      Q("How did Bekzod return to Tashkent?", "By plane", ["By plane", "By train", "By bus"]),
      TF("The tea came with sugar and a little biscuit.", true),
      TF("The train arrived in Termez early in the morning, before ten.", false, "It arrived at ten, almost two hours late."),
      Q("They had a small ___ with four beds.", "compartment"),
      Q("Grandfather quickly started a ___ with their companions.", "conversation")
    ]
  },
  {
    topic: "A safari holiday in Kenya",
    audioText: J([
      "Hello, listeners. This week on our travel podcast I want to share my experience of a safari holiday in Kenya, which my husband Timur and I took in August. We had dreamed about it for years, and finally we saved enough money. The trip lasted nine days, and the main part took place in the Masai Mara reserve, which is about two hundred and fifty kilometres west of Nairobi.",
      "We flew from Tashkent to Nairobi with one change in Dubai. The total flight took around twelve hours. In Nairobi, a driver called Joseph met us at the airport, and he was our guide for the whole safari. He was a cheerful man in his forties who knew everything about animals. The next day we travelled to the reserve in a white jeep with an open roof, and the road was so bumpy that I thought my back would break. After six hours, however, we arrived at our camp, which was a group of large tents with real beds and a hot shower.",
      "The first morning, we got up at five thirty, before the sun rose, because that is the best time to see animals. We drank hot coffee and drove into the grassland. Within half an hour we saw a family of elephants with a tiny baby, and then a group of giraffes eating leaves from the tall trees. The most exciting moment came on the third day, when we found a lion sleeping under a bush only ten metres from our jeep. Joseph switched off the engine, and we sat in complete silence for twenty minutes. I could hear my own heart.",
      "Of course, there were some difficulties. It was colder than we expected in the early mornings, so I advise taking a warm jacket. There was also a lot of dust, and my camera nearly stopped working. We had to follow strict rules: never leave the jeep, never feed the animals and never make loud noises. But these rules protect both tourists and wildlife. The whole trip cost four thousand dollars for two people, which is not cheap, but we think that every dollar was worth it. If you are planning a safari, the best months are July to October, when the animals gather near the rivers. Thank you for listening, and join me next week when I will talk about a winter holiday in Norway."
    ]),
    qs: [
      Q("In which month did they travel?", "August", ["August", "January", "October"]),
      Q("How far is the Masai Mara reserve from Nairobi?", "About two hundred and fifty kilometres", ["About two hundred and fifty kilometres", "About twelve kilometres", "About nine hundred kilometres"]),
      Q("Who was their guide?", "Joseph", ["Joseph", "Timur", "Nairobi"]),
      Q("What time did they get up on the first morning?", "Five thirty", ["Five thirty", "Seven o'clock", "Four o'clock"]),
      Q("How far was the lion from the jeep?", "Ten metres", ["Ten metres", "Fifty metres", "Two metres"]),
      Q("How much did the whole trip cost for two people?", "Four thousand dollars", ["Four thousand dollars", "Nine thousand dollars", "Two thousand dollars"]),
      TF("They changed planes in Dubai on the way to Nairobi.", true),
      TF("They slept in a hotel with a swimming pool.", false, "They slept in large tents."),
      Q("They found a lion sleeping under a ___ on the third day.", "bush"),
      Q("They saw giraffes eating ___ from the tall trees.", "leaves")
    ]
  }
];
