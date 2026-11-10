const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "Calling a plumber",
    audioText: "On Monday morning, Aziza woke up and found water on the kitchen floor. The pipe under the sink was broken. She turned off the water, took her phone, and called a plumber named Mr Brown. A woman answered and said, Brown Plumbing, how can I help you? Aziza explained her problem. The woman asked for her address, and Aziza said it was number twelve, Garden Street, flat four. The woman asked if it was an emergency. Aziza said yes, because the water was running very fast before she turned it off.\n\nThe woman said the plumber could come at ten thirty. Aziza was happy, but then she remembered that she had a meeting at ten. She asked if the plumber could come at eleven. The woman checked the list and said that eleven was fine. She also told Aziza the price. The visit cost thirty dollars, and the new pipe would be about twenty dollars more. Aziza said that was no problem.\n\nBefore ending the call, the woman gave her some advice. She told Aziza to put a bucket under the pipe and to dry the floor with old towels. She also said Aziza should not use the sink until the plumber arrived. Aziza thanked her and wrote down the plumber's name, which was Peter.\n\nAt five to eleven, Aziza heard the doorbell. Peter was a tall man with a blue bag full of tools. He looked at the pipe and smiled. He said it was an old pipe and it was easy to change. In forty minutes he finished the job. Aziza paid him fifty dollars and thanked him again. Then she made tea for both of them, and Peter told her to check the pipes every year.",
    qs: [
      Q("What did Aziza find on Monday morning?", "Water on the kitchen floor", ["Water on the kitchen floor", "A broken window", "A cold oven"]),
      Q("What was the plumber company called?", "Brown Plumbing", ["Brown Plumbing", "Garden Plumbing", "Fast Pipes"]),
      Q("Which flat does Aziza live in?", "Flat four", ["Flat two", "Flat four", "Flat twelve"]),
      Q("Why could the plumber not come at ten thirty?", "Aziza had a meeting at ten", ["Aziza had a meeting at ten", "He was ill", "He had no tools"]),
      Q("How much did the visit cost?", "Thirty dollars", ["Twenty dollars", "Thirty dollars", "Fifty dollars"]),
      Q("What did the plumber do after the job?", "He drank tea with Aziza", ["He drank tea with Aziza", "He went to a meeting", "He called his boss"]),
      TF("The woman on the phone said Aziza could use the sink at once.", false, "She said not to use the sink until the plumber arrived."),
      TF("Peter finished the job in forty minutes.", true),
      Q("The plumber arrived at five to ___ .", "eleven"),
      Q("Aziza put a ___ under the pipe, the woman said.", "bucket")
    ]
  },
  {
    topic: "A teacher's voicemail",
    audioText: "Hello, this is Mrs Karimova, the class teacher of Dilnoza's class. I am calling about the school trip next week. I am sorry to leave a message, but I could not reach you this afternoon. Please listen carefully, because there are some changes.\n\nFirst, the trip is now on Thursday and not on Wednesday. The weather forecast says it will rain on Wednesday, so we moved it. The bus will leave from the school gate at eight fifteen in the morning. Please bring your child before eight o'clock, because we need time to count the children and check the list.\n\nSecond, we are going to the science museum in the city centre. The visit will take about four hours. The children will see a space show and make a small robot. Lunch is not included in the ticket, so please give Dilnoza a sandwich, an apple, and a bottle of water. She should not bring sweets or fizzy drinks.\n\nThird, the ticket costs eight dollars. You can pay me on Monday or Tuesday, in the classroom, before lessons start. If you cannot pay, please tell me and we will find a solution. I also need you to sign the paper which I gave Dilnoza last Friday. Without it, she cannot go on the bus.\n\nFinally, the children should wear comfortable shoes and a warm jacket. They will come back to school at about four in the afternoon, so you can collect them then.\n\nIf you have any questions, please call me back on my mobile phone after six in the evening. Thank you very much, and have a nice day. Goodbye.",
    qs: [
      Q("Why did the teacher leave a message?", "She could not reach the parent", ["She could not reach the parent", "Dilnoza was ill", "The school was closed"]),
      Q("Why was the trip moved to Thursday?", "It will rain on Wednesday", ["It will rain on Wednesday", "The bus is broken", "The museum is shut"]),
      Q("When does the bus leave?", "At eight fifteen", ["At eight", "At eight fifteen", "At four"]),
      Q("What will the children make at the museum?", "A small robot", ["A small robot", "A paper plane", "A painting"]),
      Q("What should Dilnoza NOT bring?", "Fizzy drinks", ["An apple", "Fizzy drinks", "A bottle of water"]),
      Q("When can the teacher be called back?", "After six in the evening", ["Before school", "After six in the evening", "At lunchtime"]),
      TF("Lunch is included in the ticket price.", false, "Lunch is not included."),
      TF("The children come back to school at about four.", true),
      Q("The ticket costs ___ dollars.", "eight"),
      Q("The children should wear comfortable shoes and a warm ___ .", "jacket")
    ]
  },
  {
    topic: "Cancelling an appointment",
    audioText: "Jasur had an appointment with his doctor on Friday at nine thirty. On Thursday evening, he got a bad cold. His nose was red, his head hurt, and he felt very tired. He decided to call the clinic and cancel the visit, because he did not want to give his cold to other people.\n\nThe next morning, he called the clinic at eight o'clock. A friendly receptionist called Nigora answered. Jasur said, Good morning, I would like to cancel my appointment for today at nine thirty. Nigora asked for his full name and date of birth. Jasur told her, and she found him on the computer. She said, I am sorry you are ill. Do you want to make a new appointment?\n\nJasur said he did, but only for next week, because he planned to stay in bed for the weekend. Nigora looked at the calendar. She said the doctor was free on Monday at four, or on Tuesday at ten fifteen. Jasur chose Tuesday, because he works in the afternoon on Monday. She wrote his name in the book and said she would send him a message to remind him the day before.\n\nThen Nigora gave him some advice. She told him to drink hot tea with lemon, eat soup, and sleep a lot. If he had a high temperature, he should call the clinic again and not wait. Jasur thanked her and said goodbye.\n\nOn Saturday he felt a little better, and on Tuesday he went to the clinic. The doctor said it was only a cold and told him to rest for three more days.",
    qs: [
      Q("When was the original appointment?", "Friday at nine thirty", ["Thursday evening", "Friday at nine thirty", "Monday at four"]),
      Q("Why did Jasur cancel it?", "He had a bad cold", ["He had a bad cold", "He had no time", "He lost his phone"]),
      Q("Who answered the phone?", "Nigora", ["Nigora", "The doctor", "Jasur's sister"]),
      Q("What did Nigora ask for first?", "His name and date of birth", ["His address", "His name and date of birth", "His phone number"]),
      Q("Why did Jasur not choose Monday?", "He works in the afternoon", ["He works in the afternoon", "The clinic is shut", "He wanted to travel"]),
      Q("What was the advice about?", "Hot tea, soup and sleep", ["Hot tea, soup and sleep", "Cold water and sport", "Pizza and coffee"]),
      TF("Jasur called the clinic on Thursday evening.", false, "He called the next morning at eight."),
      TF("The doctor said Jasur only had a cold.", true),
      Q("Nigora said she would send a ___ to remind him.", "message"),
      Q("The doctor told him to rest for three more ___ .", "days")
    ]
  },
  {
    topic: "Renting a flat",
    audioText: "Malika is a student, and she needs a flat near her university. She saw an advert on the internet for a small flat on Park Road. The advert said, one bedroom, a kitchen, and a balcony, two hundred and fifty dollars a month. She called the number in the advert. A man named Mr Rashidov answered the phone.\n\nMalika said, Hello, I am calling about the flat on Park Road. Is it still free? He said yes and asked her some questions. He wanted to know if she was a student, if she had pets, and if she smoked. Malika said she was a student, she had a cat, and she did not smoke. Mr Rashidov thought for a moment. He said that cats were fine, but she must keep the flat clean.\n\nMalika then asked about the price. He said the rent was two hundred and fifty dollars, and water and internet were included, but she must pay for gas and electricity. She also asked how far the flat was from the university. He said it was ten minutes on foot, and there was a bus stop near the door.\n\nThey agreed to meet on Saturday at eleven o'clock in front of the building. Mr Rashidov said he would bring the keys and show her every room. He also asked her to bring her passport and a letter from the university.\n\nAfter the call, Malika was very excited. She wrote the date in her notebook, and she told her mother the good news. Her mother said she should check the windows and the heating carefully before she signed anything.",
    qs: [
      Q("Where did Malika see the advert?", "On the internet", ["In a shop", "On the internet", "In a newspaper"]),
      Q("How much is the rent?", "Two hundred and fifty dollars", ["Two hundred dollars", "Two hundred and fifty dollars", "Three hundred dollars"]),
      Q("What pet does Malika have?", "A cat", ["A dog", "A cat", "A bird"]),
      Q("What must Malika pay for herself?", "Gas and electricity", ["Water", "Internet", "Gas and electricity"]),
      Q("How far is the flat from the university?", "Ten minutes on foot", ["Ten minutes on foot", "One hour by bus", "Five minutes by car"]),
      Q("What should Malika bring on Saturday?", "Her passport and a letter", ["Her cat", "Her passport and a letter", "Money for a year"]),
      TF("Mr Rashidov does not allow cats in the flat.", false, "He said cats were fine."),
      TF("They will meet on Saturday at eleven.", true),
      Q("The flat has a kitchen and a ___ .", "balcony"),
      Q("Malika's mother said to check the windows and the ___ .", "heating")
    ]
  },
  {
    topic: "A wrong number",
    audioText: "It was nine o'clock in the evening, and Sardor was watching a football match with his brother. Suddenly his phone rang. The number was new to him, but he answered it. A woman said, Hello, Anvar, is that you? I am so happy to hear you! Sardor was surprised. He said, Sorry, I am not Anvar. My name is Sardor. The woman laughed and said, Oh no, I must have the wrong number. I am very sorry.\n\nSardor said it was no problem. But the woman sounded worried. She explained that she was trying to call her cousin Anvar, who lives in Samarkand. She wanted to tell him that her train would arrive on Sunday and not on Saturday. She had his number in an old notebook, and maybe it was wrong.\n\nSardor felt sorry for her. He asked what number she was calling. She read the numbers slowly, and Sardor listened. He noticed that the last two numbers were in the wrong order. He told her, Try seven, nine at the end, not nine, seven. The woman said thank you and promised to try again.\n\nFive minutes later, the phone rang again. It was the same woman. She said, Sardor, it worked! Anvar answered, and he will meet me at the station. I want to say thank you very much. She told him her name was Gulnora, and she invited him for tea if he ever visited her city.\n\nSardor smiled and told his brother the story. His brother said it was the nicest wrong number he had ever heard of. Then they went back to the match.",
    qs: [
      Q("What was Sardor doing when the phone rang?", "Watching football", ["Watching football", "Eating dinner", "Sleeping"]),
      Q("Who did the woman want to call?", "Her cousin Anvar", ["Her brother", "Her cousin Anvar", "Her teacher"]),
      Q("Where does Anvar live?", "In Samarkand", ["In Samarkand", "In Tashkent", "In Bukhara"]),
      Q("What message did she want to give Anvar?", "Her train arrives on Sunday", ["Her train arrives on Sunday", "She had lost her bag", "She wanted money"]),
      Q("What was wrong with the number?", "The last two numbers were in the wrong order", ["It had too many numbers", "The last two numbers were in the wrong order", "It was an old number"]),
      Q("What did Gulnora offer Sardor?", "Tea at her home", ["A ticket", "Tea at her home", "A football match"]),
      TF("Sardor was angry about the wrong number.", false, "He said it was no problem and tried to help."),
      TF("Gulnora called Sardor again after five minutes.", true),
      Q("Sardor watched the match with his ___ .", "brother"),
      Q("Anvar will meet her at the ___ .", "station")
    ]
  },
  {
    topic: "A message about a lost wallet",
    audioText: "Last Tuesday, Kamola lost her wallet on the bus. She noticed it only when she arrived at work and wanted to buy a coffee. She looked in her bag, in her coat, and in every pocket, but the wallet was gone. It was a small red wallet, and it had her bank card, some money, and a photo of her grandmother. She felt terrible.\n\nShe went back to the bus station at lunchtime and asked the driver. The driver said nobody had given him a wallet. Kamola left her phone number and went home with a heavy heart.\n\nThat evening, at seven o'clock, she received a text message from a number she did not know. It said, Hello, my name is Timur. I found a red wallet on bus number twenty-two. Is it yours? There is a photo of an old lady inside. Kamola read the message three times and her eyes filled with tears. She called him at once.\n\nTimur was a young man who worked at a bakery. He said he found the wallet under a seat. He opened it to find the owner's name, and he saw the photo and a card. He did not take anything. He offered to bring it to her the next day, but Kamola said she would come to the bakery herself.\n\nOn Wednesday morning, she went to the bakery on Lenin Street. Timur gave her the wallet, and she checked everything. All the money was inside. She wanted to give him a reward, but he said no. So she bought ten warm loaves of bread and thanked him with a big smile.",
    qs: [
      Q("Where did Kamola lose her wallet?", "On the bus", ["At work", "On the bus", "In a shop"]),
      Q("What colour was the wallet?", "Red", ["Red", "Black", "Brown"]),
      Q("What photo was in the wallet?", "Her grandmother", ["Her mother", "Her grandmother", "Her dog"]),
      Q("When did she get the text message?", "At seven in the evening", ["At lunchtime", "At seven in the evening", "On Wednesday morning"]),
      Q("What is Timur's job?", "He works at a bakery", ["He drives a bus", "He works at a bakery", "He is a teacher"]),
      Q("What did Kamola do to thank Timur?", "She bought bread", ["She gave him money", "She bought bread", "She cooked dinner"]),
      TF("The bus driver had the wallet.", false, "He said nobody had given him a wallet."),
      TF("Timur took some money from the wallet.", false, "He did not take anything."),
      Q("Timur found the wallet on bus number twenty-___ .", "two"),
      Q("The bakery is on ___ Street.", "lenin")
    ]
  },
  {
    topic: "A hotel call",
    audioText: "Mr and Mrs Evans arrived at a small hotel in Bukhara late on Friday evening. They were tired after a long flight. In their room, Mrs Evans noticed that the air conditioner did not work, and it was very hot. She picked up the phone near the bed and pressed the number for reception.\n\nA young man answered. He said, Good evening, reception, this is Bobur. How can I help you? Mrs Evans explained that the air conditioner in room number two hundred and five was not working. Bobur apologised and said he would send a technician in ten minutes. He asked if they needed anything else.\n\nMrs Evans said they were hungry, but the restaurant was already closed. Bobur said the kitchen could prepare two sandwiches and a pot of tea for them. It would take about twenty minutes, and he would send it to their room. Mrs Evans was very pleased.\n\nThen she asked about breakfast. Bobur said breakfast was served from seven to ten o'clock on the ground floor, next to the garden. He also told her that the hotel offered a free city tour on Saturday morning at nine. The guide would meet the guests in the lobby, and the tour would last three hours.\n\nTen minutes later, a technician knocked on the door and fixed the machine in fifteen minutes. Soon a waiter brought the food. The Evans family ate their sandwiches on the small balcony, listened to the quiet city, and went to bed. They decided to tell their friends about this friendly hotel.",
    qs: [
      Q("When did the Evans family arrive?", "On Friday evening", ["On Friday evening", "On Saturday morning", "On Sunday night"]),
      Q("What was wrong in their room?", "The air conditioner did not work", ["The bed was broken", "The air conditioner did not work", "There was no water"]),
      Q("Who answered the phone at reception?", "Bobur", ["Bobur", "Mr Evans", "A technician"]),
      Q("What did the kitchen send to the room?", "Sandwiches and tea", ["Soup and bread", "Sandwiches and tea", "Rice and salad"]),
      Q("Where is breakfast served?", "On the ground floor next to the garden", ["On the balcony", "On the ground floor next to the garden", "In the room"]),
      Q("How long does the free tour last?", "Three hours", ["One hour", "Three hours", "All day"]),
      TF("The restaurant was open when the Evans family called.", false, "The restaurant was already closed."),
      TF("The technician fixed the air conditioner.", true),
      Q("Their room number was two hundred and ___ .", "five"),
      Q("The guide meets the guests in the ___ .", "lobby")
    ]
  },
  {
    topic: "Booking a dentist",
    audioText: "Farhod had a toothache for three days. At first he thought it would go away, but on Wednesday the pain became very strong. He could not eat his dinner, and he could not sleep. On Thursday morning he decided to call a dentist.\n\nHe found the number of a clinic called Smile Dental on the internet. He called at nine o'clock, and a receptionist named Lola answered. Farhod said, Hello, I have a very bad toothache. Can I see a dentist today? Lola said she was sorry to hear that. She checked the computer and said that the first free time was at two forty in the afternoon with Doctor Yusupova.\n\nFarhod said that time was fine. Lola asked for his name, his age, and his phone number. She also asked if he was afraid of dentists. Farhod laughed and said, A little. Lola told him not to worry, because Doctor Yusupova was kind and gentle.\n\nThen Lola explained some rules. He should arrive ten minutes before the appointment to fill in a form. He should not eat or drink anything hot before the visit, and he should clean his teeth carefully. She said a check would cost fifteen dollars, and a filling would be more.\n\nAt two thirty, Farhod arrived at the clinic. The doctor looked at his tooth and said he had a small hole. She made a filling in half an hour, and the pain went away. At the end she told him to eat less sugar and visit the clinic every six months.",
    qs: [
      Q("How long did Farhod have a toothache?", "Three days", ["One day", "Three days", "A week"]),
      Q("What is the clinic called?", "Smile Dental", ["Smile Dental", "White Teeth", "City Clinic"]),
      Q("When is the appointment?", "At two forty in the afternoon", ["At nine in the morning", "At two forty in the afternoon", "At six in the evening"]),
      Q("Who is the doctor?", "Doctor Yusupova", ["Doctor Lola", "Doctor Yusupova", "Doctor Farhod"]),
      Q("How early should Farhod arrive?", "Ten minutes before", ["Ten minutes before", "One hour before", "Five minutes after"]),
      Q("What did the doctor tell him at the end?", "To eat less sugar", ["To eat less sugar", "To drink more tea", "To stop work"]),
      TF("Farhod was not afraid of dentists at all.", false, "He said he was a little afraid."),
      TF("A check costs fifteen dollars.", true),
      Q("The doctor found a small ___ in his tooth.", "hole"),
      Q("The doctor said to visit the clinic every six ___ .", "months")
    ]
  },
  {
    topic: "Customer service",
    audioText: "Shirin bought a new phone from an online shop three weeks ago. At first she loved it, but then the battery began to die very fast. She charged it in the morning, and by lunchtime it was empty. On Sunday she decided to call customer service.\n\nShe dialled the number on the shop's website and heard a recorded voice. It said, Press one for orders, press two for problems with a product, and press three to speak to a person. Shirin pressed two and waited for eight minutes while she listened to music. At last a man answered. His name was Kamran.\n\nKamran asked for her order number, which was in her email. Shirin read it slowly. He asked what the problem was, and she explained about the battery. He said she should turn the phone off and on, and then check the settings. Shirin tried it, but it did not help. Kamran said he was sorry and told her that the phone was still under guarantee for two years.\n\nHe offered two choices. She could send the phone back and wait ten days for a new one, or she could take it to a service centre in her city and get it repaired in three days. Shirin chose the second option because she needed a phone for work. Kamran sent her the address of the centre by text message.\n\nHe also gave her a case number, which was important. She wrote it on a piece of paper and thanked him. On Tuesday, the centre changed the battery for free. Shirin was very happy with the help and wrote a nice review online.",
    qs: [
      Q("What is wrong with Shirin's phone?", "The battery dies fast", ["The screen is broken", "The battery dies fast", "It has no sound"]),
      Q("How long did she wait for a person to answer?", "Eight minutes", ["Two minutes", "Eight minutes", "One hour"]),
      Q("What number did she press for problems with a product?", "Two", ["One", "Two", "Three"]),
      Q("How long is the guarantee?", "Two years", ["Six months", "One year", "Two years"]),
      Q("Why did Shirin choose the service centre?", "She needed a phone for work", ["It was free", "She needed a phone for work", "It was near her house"]),
      Q("How did Kamran send the address?", "By text message", ["By letter", "By text message", "By email"]),
      TF("Turning the phone off and on solved the problem.", false, "It did not help."),
      TF("The centre changed the battery for free.", true),
      Q("Shirin bought the phone from an ___ shop.", "online"),
      Q("The centre repaired the phone on ___ .", "tuesday")
    ]
  },
  {
    topic: "A job enquiry",
    audioText: "Nodira is twenty years old, and she is looking for a part-time job. Last week she saw a sign in the window of a bookshop. It said, we need a helper, please call. She wrote the phone number in her notebook and called the shop the same afternoon.\n\nThe owner of the shop, Mr Hamidov, answered. Nodira said, Good afternoon, I am calling about the job in your window. Is it still free? He said yes and asked her to tell him about herself. Nodira said she was a student of English at the university, she studied in the morning, and she loved books. She also said she had worked in a cafe last summer and knew how to talk to customers.\n\nMr Hamidov explained the job. The helper would work from two in the afternoon until seven in the evening, four days a week. She would put books on the shelves, help customers find books, and use the computer at the cash desk. The pay was two dollars an hour, and she could take home one book every month.\n\nNodira asked if she could work on Saturdays, because she had lessons on Wednesday. Mr Hamidov said Saturdays were very busy, so he would be glad. He invited her to the shop for a short talk on Friday at four o'clock. She should bring her student card and a list of the books she liked best.\n\nAfter the call, Nodira smiled all evening. She spent two hours making her list. She chose twelve books, and her favourite was a story about a young girl and a horse.",
    qs: [
      Q("Where did Nodira see the sign?", "In a bookshop window", ["In a cafe window", "In a bookshop window", "At the university"]),
      Q("What does Nodira study?", "English", ["English", "History", "Music"]),
      Q("What did she do last summer?", "She worked in a cafe", ["She travelled", "She worked in a cafe", "She sold books"]),
      Q("How many days a week would she work?", "Four", ["Two", "Four", "Six"]),
      Q("Why did she ask about Saturdays?", "She has lessons on Wednesday", ["She has lessons on Wednesday", "She likes shopping", "She wants more money"]),
      Q("What should she bring on Friday?", "Her student card and a list of books", ["Her student card and a list of books", "A letter from her mother", "A computer"]),
      TF("The helper would work in the morning.", false, "The work is from two in the afternoon until seven."),
      TF("Nodira could take home one book every month.", true),
      Q("The talk is on Friday at ___ o'clock.", "four"),
      Q("Her favourite book is about a girl and a ___ .", "horse")
    ]
  },
  {
    topic: "Apologising for being late",
    audioText: "Bekzod had an important meeting with his boss at nine o'clock on Monday. He woke up at seven, had breakfast, and left the house at eight. Everything was normal until he reached the bus stop. The bus did not come. He waited for twenty minutes, and the street was full of cars that did not move. There had been an accident near the bridge.\n\nAt eight forty, Bekzod understood that he would be late. He took his phone and called his boss, Mrs Saidova. She answered after four rings. Bekzod said, Good morning, Mrs Saidova. I am so sorry, but I will be late for our meeting. There is a big traffic jam near the bridge, and my bus is stuck.\n\nMrs Saidova was calm. She asked how late he thought he would be. Bekzod said maybe thirty minutes, but he was not sure. She said that was all right and told him they could start at nine thirty instead. She also asked him not to run, because the road was wet and dangerous.\n\nBekzod thanked her three times. Then he decided to get off the bus and walk to the metro station, which was only ten minutes away. He took the train, and it was fast. At nine twenty-five he arrived at the office, out of breath but happy.\n\nIn the meeting room, he said sorry again. Mrs Saidova smiled and said it was not his fault. After the meeting, Bekzod bought a small cake for the office as a way to say sorry. Everybody enjoyed it, and the boss said he was a very polite person.",
    qs: [
      Q("What time was the meeting?", "At nine o'clock", ["At eight", "At nine o'clock", "At ten"]),
      Q("Why was the bus late?", "There was an accident near the bridge", ["There was an accident near the bridge", "It was broken", "The driver was ill"]),
      Q("Who is Mrs Saidova?", "Bekzod's boss", ["Bekzod's mother", "Bekzod's boss", "A bus driver"]),
      Q("What new time did the boss suggest?", "Nine thirty", ["Nine fifteen", "Nine thirty", "Ten"]),
      Q("How did Bekzod go to the office in the end?", "By metro", ["By taxi", "By metro", "On foot all the way"]),
      Q("What did he buy for the office?", "A cake", ["Coffee", "A cake", "Flowers"]),
      TF("Mrs Saidova was angry with Bekzod.", false, "She was calm and said it was not his fault."),
      TF("Bekzod waited at the bus stop for twenty minutes.", true),
      Q("She told him not to ___ because the road was wet.", "run"),
      Q("The metro station was ten ___ away.", "minutes")
    ]
  },
  {
    topic: "A parcel call",
    audioText: "Laylo ordered a pair of winter boots from a website. The boots were blue, size thirty-eight, and they cost forty dollars. The shop said the parcel would arrive in five days. On the fourth day, her phone rang while she was at the university.\n\nA man said, Hello, this is the delivery company. My name is Rustam. I have a parcel for Laylo Nazarova. Are you at home? Laylo said she was not at home, because she was at university until four o'clock. Rustam said he was near her street at that moment and could wait only ten minutes. Laylo said that was too short.\n\nThey looked for a solution. Rustam suggested that he could leave the parcel with a neighbour. Laylo thought about it and said her neighbour, Mrs Tursunova, lived in the flat next to hers and was usually at home. She gave him the flat number, which was nine. Rustam said he would knock on the door, and if the neighbour was at home, he would leave the parcel with her.\n\nTwenty minutes later, Rustam sent a text message. It said that Mrs Tursunova had taken the box, and he had taken a photo as proof. Laylo thanked him and wrote back that she would collect the parcel in the evening.\n\nAt five o'clock, she knocked at her neighbour's door. Mrs Tursunova gave her the box with a smile and offered her a cup of tea and some sweet cakes. Laylo opened the box at home. The boots were perfect, and they were warm and soft. She wore them the next morning.",
    qs: [
      Q("What did Laylo order?", "Winter boots", ["A coat", "Winter boots", "A bag"]),
      Q("How much did they cost?", "Forty dollars", ["Thirty dollars", "Forty dollars", "Fifty dollars"]),
      Q("Where was Laylo when the delivery man called?", "At university", ["At home", "At work", "At university"]),
      Q("How long could Rustam wait?", "Ten minutes", ["Ten minutes", "One hour", "Five minutes"]),
      Q("Who took the parcel?", "Mrs Tursunova", ["Laylo's mother", "Mrs Tursunova", "Rustam"]),
      Q("What did Rustam send as proof?", "A photo", ["A photo", "A letter", "A paper bill"]),
      TF("The boots arrived on the fifth day.", false, "The delivery man called on the fourth day."),
      TF("Laylo's neighbour offered her tea.", true),
      Q("Laylo gave the flat number, which was ___ .", "nine"),
      Q("The boots were warm and ___ .", "soft")
    ]
  },
  {
    topic: "A landlord's message",
    audioText: "Hello Ravshan, this is Mr Alimov, your landlord. I am leaving you this message because I could not reach you on the phone. It is Tuesday morning, and I want to tell you some important things about the flat.\n\nFirst, next Monday some workers will come to your building. They will change the old water pipes in all the flats. They will start at nine in the morning and finish at about three in the afternoon. During this time, there will be no water. Please fill some bottles on Sunday evening, so you can wash and drink. Also, one worker must enter the bathroom, so someone has to be at home. If you cannot be there, you can leave the key with Mrs Orlova on the second floor.\n\nSecond, I want to talk about the rent. It is due on the fifth of every month, and I have not received this month's payment yet. I am sure it is just a small mistake, but please send the money by Friday. You can send it to my bank account, as usual.\n\nThird, you told me last week that the kitchen window does not close well. I looked for a carpenter, and he will visit you on Thursday afternoon at about five. Please show him the window, and he will repair it for free.\n\nFinally, I hope you are happy in the flat. If you have any problems, please call me on my mobile phone after seven in the evening, because I work during the day. Thank you, and good luck with your studies. Goodbye for now.",
    qs: [
      Q("Why is Mr Alimov leaving a message?", "He could not reach Ravshan", ["He could not reach Ravshan", "He lost his key", "He wants to sell the flat"]),
      Q("What will the workers change?", "The water pipes", ["The windows", "The water pipes", "The doors"]),
      Q("When will there be no water?", "From nine to about three on Monday", ["All week", "From nine to about three on Monday", "On Sunday evening"]),
      Q("Who can keep the key?", "Mrs Orlova", ["Mrs Orlova", "The carpenter", "A neighbour on the first floor"]),
      Q("What should Ravshan do by Friday?", "Send the rent", ["Send the rent", "Fix the window", "Call the workers"]),
      Q("When will the carpenter come?", "Thursday at about five", ["Monday morning", "Thursday at about five", "Friday at seven"]),
      TF("The carpenter will charge money for the repair.", false, "The repair is free."),
      TF("The rent is due on the fifth of every month.", true),
      Q("Mrs Orlova lives on the ___ floor.", "second"),
      Q("Mr Alimov works during the ___ .", "day")
    ]
  },
  {
    topic: "An internet problem",
    audioText: "On Saturday evening, Sevara wanted to watch a film with her sister, but the internet did not work. The little light on the router was red, and every page on her computer said no connection. She restarted the router three times, but nothing changed. Finally, she called her internet company.\n\nA woman named Dilbar answered. She said, Good evening, thank you for calling. How can I help? Sevara explained the problem. Dilbar asked her to read the numbers on the back of the router. Then she asked if the other lights were green. Sevara said that only the power light was green, and the others were red. Dilbar said that this probably meant a problem on the line outside, not in the house.\n\nShe checked her computer and found that there was a damaged cable in Sevara's street. A repair team was already working on it. Dilbar said the internet would come back in about two hours, and she was very sorry for the trouble. She also promised that the company would take off one day from Sevara's monthly bill.\n\nSevara thanked her. Dilbar added that if the internet did not work by eleven at night, Sevara should call again, and the company would send a technician in the morning.\n\nSince there was no film, the sisters decided to play a board game. They made popcorn and laughed for two hours. Just before ten, the router light turned green. Sevara said it was a nice evening anyway, and they did not need the internet to have fun.",
    qs: [
      Q("What did Sevara want to do on Saturday evening?", "Watch a film", ["Watch a film", "Do homework", "Call a friend"]),
      Q("What colour was the light on the router?", "Red", ["Green", "Red", "Blue"]),
      Q("How many times did she restart the router?", "Three", ["Once", "Three", "Ten"]),
      Q("What was the real problem?", "A damaged cable in the street", ["A broken computer", "A damaged cable in the street", "An old router"]),
      Q("What did the company promise?", "To take off one day from the bill", ["To give a new router", "To take off one day from the bill", "To send flowers"]),
      Q("What did the sisters do instead of watching a film?", "They played a board game", ["They played a board game", "They went out", "They slept"]),
      TF("The internet came back before ten o'clock.", true),
      TF("Dilbar said the problem was inside the house.", false, "She said it was probably on the line outside."),
      Q("Dilbar said the internet would return in about two ___ .", "hours"),
      Q("The sisters made ___ while they played.", "popcorn")
    ]
  },
  {
    topic: "A surprise call from abroad",
    audioText: "On a quiet Sunday afternoon, Otabek was cleaning his room when his phone rang. The number began with a strange code, and he did not know it. He almost did not answer, but something made him press the green button. A voice said, Hello, Otabek, it is me, Daniel!\n\nOtabek could not believe it. Daniel was his best friend from school, who moved to Canada six years ago. They had not spoken for a long time, because Daniel lost his old phone and Otabek did not have his new number. Now Daniel was calling from the city of Toronto.\n\nDaniel said he found Otabek's number through a school friend on social media. He was so happy to hear his voice. They talked for almost an hour. Daniel told him about his life. He had a job in a bank, a small flat near a big lake, and a dog called Max. In winter, it was minus twenty degrees there, and he missed the warm weather of home.\n\nOtabek told him about his own news. He had finished university, and he now worked as a teacher in a small school. Last year he got married, and his wife was expecting a baby in the spring. Daniel was very excited and said he would send a present.\n\nBefore they said goodbye, Daniel made a big announcement. He had bought a plane ticket, and he would visit Tashkent in July. Otabek promised to meet him at the airport. When the call ended, Otabek sat on the bed with a huge smile, and he could not stop thinking about July.",
    qs: [
      Q("What was Otabek doing when the phone rang?", "Cleaning his room", ["Cleaning his room", "Cooking lunch", "Reading a book"]),
      Q("Who was calling?", "His old school friend Daniel", ["His boss", "His old school friend Daniel", "His brother"]),
      Q("Where did Daniel live now?", "In Toronto", ["In Toronto", "In London", "In Moscow"]),
      Q("How did Daniel find the number?", "Through a school friend on social media", ["From a book", "Through a school friend on social media", "From the school"]),
      Q("What is Daniel's job?", "He works in a bank", ["He is a teacher", "He works in a bank", "He is a driver"]),
      Q("When will Daniel visit Tashkent?", "In July", ["In the spring", "In July", "In winter"]),
      TF("Daniel moved to Canada six years ago.", true),
      TF("Otabek is not married.", false, "He got married last year."),
      Q("Daniel has a dog called ___ .", "max"),
      Q("Otabek's wife was expecting a baby in the ___ .", "spring")
    ]
  }
];
