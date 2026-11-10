const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: 'School announcement',
    audioText: "Good morning, students. This is Mrs Karimova with the school announcements. Please listen carefully. Today is Monday, and lessons begin at eight thirty. The first lesson for every class is maths. Please go to your classroom quickly and quietly.\n\nThere is some good news this week. The school choir will sing in the main hall on Wednesday at two o'clock. Everyone can come and listen. Mr Brown, our music teacher, says the choir has practised for six weeks. The children are very ready, and they are a little excited.\n\nThere are also two small changes today. The library is closed this morning because workers are painting the walls. It will open again after lunch. The canteen has a new menu, too. Today there is chicken soup, rice and fruit. A bottle of water costs two hundred som, and a cup of tea costs one hundred som.\n\nFinally, a reminder about lost things. A blue jacket and a black bag are in the office. If they are yours, please ask Mr Aziz at the front desk. He is there until four o'clock every day.\n\nThank you for listening. Have a wonderful day, and please remember to be kind to each other.",
    qs: [
      Q('Who is giving the announcements?', 'Mrs Karimova', ['Mrs Karimova', 'Mr Brown', 'Mr Aziz']),
      Q('When do lessons begin today?', 'At eight thirty', ['At eight thirty', 'At nine o\'clock', 'At eight o\'clock']),
      Q('What is the first lesson for every class?', 'Maths', ['Maths', 'English', 'Music']),
      Q('When will the choir sing?', 'On Wednesday', ['On Monday', 'On Wednesday', 'On Friday']),
      Q('Why is the library closed this morning?', 'Workers are painting the walls', ['Workers are painting the walls', 'The heating is broken', 'The teachers have a meeting']),
      Q('What is on the canteen menu today?', 'Chicken soup, rice and fruit', ['Fish and bread', 'Chicken soup, rice and fruit', 'Pizza and juice']),
      TF('The choir has practised for six weeks.', true),
      TF('The library stays closed all day.', false, 'It opens again after lunch.'),
      Q('A bottle of water costs two hundred ___.', 'som'),
      Q('Lost things are at the front ___.', 'desk')
    ]
  },
  {
    topic: "Head teacher's speech",
    audioText: "Welcome back, everyone. My name is Mr Yusupov, and I am the head teacher of this school. It is the first day of the new year, and I am very happy to see you all.\n\nOur school has four hundred students and thirty teachers. This year we have some new things. We have a new sports hall, and we have twenty new computers in the computer room. We also have two new teachers. Miss Lola will teach English, and Mr Daniel will teach science.\n\nNow let me talk about our rules. They are simple. First, please come to school on time. The bell rings at eight fifteen. Second, wear your school uniform every day. Third, do your homework and bring your books. Fourth, be polite to teachers and to your friends. If you have a problem, you can always come to my office.\n\nI also have a big goal for this year. I want every student to read ten books. The library will help you choose them. At the end of the year, the best readers will get a small prize.\n\nStudents, learning is a long road, but you are not alone. Teachers, parents and friends are with you. Let us make this a great year. Thank you, and good luck.",
    qs: [
      Q('Who is speaking?', 'The head teacher', ['The head teacher', 'A new student', 'A parent']),
      Q('How many students are in the school?', 'Four hundred', ['Three hundred', 'Four hundred', 'Five hundred']),
      Q('What is new in the school this year?', 'A sports hall', ['A swimming pool', 'A sports hall', 'A big garden']),
      Q('What will Miss Lola teach?', 'English', ['English', 'Science', 'Maths']),
      Q('When does the bell ring?', 'At eight fifteen', ['At eight', 'At eight fifteen', 'At nine']),
      Q('What is the head teacher\'s big goal?', 'Every student reads ten books', ['Every student reads ten books', 'Every student wins a prize', 'Every student learns music']),
      TF('There are twenty new computers in the school.', true),
      TF('Students can wear any clothes they like.', false, 'They must wear a school uniform.'),
      Q('Students can go to the head teacher\'s ___ if they have a problem.', 'office'),
      Q('The best readers will get a small ___.', 'prize')
    ]
  },
  {
    topic: 'My day from morning to night',
    audioText: "My name is Aziza, and I am eleven years old. I want to tell you about my day. I get up at six thirty every morning. First I wash my face and brush my teeth. Then I have breakfast with my family. I usually eat bread, an egg and a cup of tea.\n\nI leave home at seven thirty. My school is not far, so I walk with my friend Malika. It takes fifteen minutes. Lessons start at eight and finish at two. I have six lessons every day. My favourite lesson is art because I love to draw.\n\nAfter school I go home and have lunch. My mother cooks soup or rice. Then I rest for half an hour. At three thirty I do my homework. It takes about one hour. After that, I play with my little brother in the garden. He is five years old, and he likes football.\n\nIn the evening we have dinner at seven o'clock. My father comes home from work, and we all sit together. After dinner I help my mother wash the plates. Then I read a book or watch a short film.\n\nI go to bed at nine thirty. Before I sleep, I say good night to my parents. I like my day because it is busy and happy.",
    qs: [
      Q('What time does Aziza get up?', 'At six thirty', ['At six', 'At six thirty', 'At seven']),
      Q('What does she usually eat for breakfast?', 'Bread, an egg and tea', ['Rice and soup', 'Bread, an egg and tea', 'Fruit and milk']),
      Q('Who walks to school with Aziza?', 'Malika', ['Her brother', 'Malika', 'Her mother']),
      Q('How many lessons does she have every day?', 'Six', ['Five', 'Six', 'Seven']),
      Q('How long does her homework take?', 'About one hour', ['About half an hour', 'About one hour', 'About two hours']),
      Q('What time is dinner?', 'At seven o\'clock', ['At six o\'clock', 'At seven o\'clock', 'At eight o\'clock']),
      TF('Aziza\'s favourite lesson is maths.', false, 'Her favourite lesson is art.'),
      TF('Her little brother is five years old.', true),
      Q('The walk to school takes fifteen ___.', 'minutes'),
      Q('Aziza goes to bed at nine ___.', 'thirty')
    ]
  },
  {
    topic: 'The timetable explained',
    audioText: "Today I will explain our class timetable. Please look at your paper and listen carefully. We have school from Monday to Friday. There is no school on Saturday or Sunday.\n\nOn Monday, we start with English at eight o'clock. After that we have maths at nine. At ten we have a short break for twenty minutes. Then we study history. On Tuesday, the first lesson is science. Today it is in the laboratory, not in our classroom. Please do not go to room five by mistake.\n\nWednesday is the busiest day. We have five lessons, and the last one is sport. Please bring your sports shoes and a bottle of water. On Thursday we have art and music. Many students like Thursday because there is no homework in those lessons.\n\nFriday is a short day. We have only four lessons, and school finishes at twelve thirty. In the last lesson, the teacher reads a story, and we can relax.\n\nLunch is at one o'clock on most days. Remember, the lunch break is forty minutes long. Please write the timetable in your notebook. Put a copy at home, too. If you forget it, you can ask me or a friend. Are there any questions? Good. Let us begin our first lesson.",
    qs: [
      Q('On which days is there school?', 'Monday to Friday', ['Monday to Saturday', 'Monday to Friday', 'Tuesday to Sunday']),
      Q('What is the first lesson on Monday?', 'English', ['Maths', 'English', 'History']),
      Q('How long is the short break?', 'Twenty minutes', ['Ten minutes', 'Twenty minutes', 'Forty minutes']),
      Q('Where is the science lesson today?', 'In the laboratory', ['In room five', 'In the laboratory', 'In the garden']),
      Q('What is the last lesson on Wednesday?', 'Sport', ['Sport', 'Art', 'Music']),
      Q('When does school finish on Friday?', 'At twelve thirty', ['At twelve', 'At twelve thirty', 'At one o\'clock']),
      TF('Wednesday has five lessons.', true),
      TF('Students have homework in art and music lessons.', false, 'There is no homework in those lessons.'),
      Q('On Wednesday students need sports shoes and a bottle of ___.', 'water'),
      Q('The lunch break is forty ___ long.', 'minutes')
    ]
  },
  {
    topic: 'A homework talk',
    audioText: "Bobur comes home from school at three o'clock. His mother, Nilufar, is in the kitchen. She asks him, \"How was school today?\" Bobur answers, \"It was good, Mum, but I have a lot of homework.\"\n\nNilufar asks him to tell her about it. Bobur says he has three tasks. First, he must write five sentences in English about his family. Second, he must do ten maths problems. Third, he must learn a poem for Friday. The poem has eight lines.\n\nNilufar smiles and says, \"Let us make a plan.\" She says that Bobur should eat a snack first and rest for twenty minutes. Then he can start with maths because it is the hardest. After maths he can write the English sentences. The poem is last, because he can learn it before bed.\n\nBobur says he is tired and wants to play football with his friend Sardor. Nilufar says no, not today. He can play on Saturday, after all the work is done. Bobur sighs, but he agrees.\n\nAt five o'clock Bobur has finished the maths. His mother checks it and says that nine answers are right. She shows him one mistake, and he fixes it. Bobur feels proud. Later his father listens to the poem, and Bobur says it without a single mistake.",
    qs: [
      Q('When does Bobur come home?', 'At three o\'clock', ['At two o\'clock', 'At three o\'clock', 'At four o\'clock']),
      Q('What must he write about in English?', 'His family', ['His family', 'His school', 'His friends']),
      Q('How many maths problems must he do?', 'Ten', ['Five', 'Eight', 'Ten']),
      Q('Which task does Nilufar say is the hardest?', 'Maths', ['Maths', 'The poem', 'The English sentences']),
      Q('When can Bobur play football?', 'On Saturday', ['Today', 'On Saturday', 'On Friday']),
      Q('How many maths answers are right?', 'Nine', ['Eight', 'Nine', 'Ten']),
      TF('The poem has eight lines.', true),
      TF('Bobur plays football with Sardor after school today.', false, 'His mother says no, not today.'),
      Q('Bobur should have a snack and rest for twenty ___.', 'minutes'),
      Q('Bobur says the poem to his ___.', 'father')
    ]
  },
  {
    topic: 'An exam notice',
    audioText: "Attention, please. This is an important notice about the end of year exams. Please listen to all the details, and write them down.\n\nThe exams begin on the third of June and finish on the tenth of June. There are five exams. The first is English on Monday. The second is maths on Tuesday. Science is on Thursday, history is on Friday, and the last exam is geography on the following Tuesday. Each exam starts at nine o'clock in the morning.\n\nAll exams take place in the main hall, not in your classrooms. Please arrive at eight forty so that you have time to find your seat. Students who arrive late cannot enter after nine fifteen.\n\nPlease bring two blue pens, a pencil, a ruler and a bottle of water. You cannot use a phone, a calculator or a dictionary in the hall. Please leave your bags outside.\n\nThe maths and science exams are one hour and thirty minutes long. The other exams are one hour. If you are ill on the day of an exam, ask a parent to call the school office as early as possible.\n\nFinally, relax and sleep well the night before. You are ready. The teachers believe in you. Good luck, everyone.",
    qs: [
      Q('When do the exams begin?', 'On the third of June', ['On the third of June', 'On the tenth of June', 'On the first of June']),
      Q('How many exams are there?', 'Five', ['Four', 'Five', 'Six']),
      Q('Which exam is on Monday?', 'English', ['English', 'Maths', 'History']),
      Q('Where do the exams take place?', 'In the main hall', ['In the classrooms', 'In the main hall', 'In the library']),
      Q('What time should students arrive?', 'At eight forty', ['At eight', 'At eight forty', 'At nine fifteen']),
      Q('Which thing can students use in the hall?', 'A ruler', ['A phone', 'A ruler', 'A dictionary']),
      TF('Each exam starts at nine o\'clock.', true),
      TF('The history exam is one hour and thirty minutes long.', false, 'Only maths and science are that long.'),
      Q('Students should leave their ___ outside the hall.', 'bags'),
      Q('If a student is ill, a parent should call the school ___.', 'office')
    ]
  },
  {
    topic: 'A library tour',
    audioText: "Welcome to our school library, new students. My name is Mrs Sultanova, and I am the librarian. Today I will show you around, and then you can get your own library card.\n\nThe library is open from eight in the morning until five in the afternoon. It is closed on Sundays. Please enter through the blue door on your left. We keep this room quiet, so please speak softly.\n\nOn the right you can see the story books. There are more than three thousand of them. The books for young readers have a green sticker. On the left are the books about science, animals and sport. The big table in the middle is for reading and homework. Six students can sit there together.\n\nBehind me there are eight computers. You can use them to search for information or to write your homework. Each student can use a computer for thirty minutes. Please do not eat or drink in this room.\n\nYou can borrow three books at one time. You must bring them back after two weeks. If you need more time, just tell me. If you lose a book, please tell me at once, and we will find a way to help.\n\nNow, who would like a library card first? Please make a line by the desk. Thank you.",
    qs: [
      Q('Who is the speaker?', 'The librarian', ['The librarian', 'The head teacher', 'A new student']),
      Q('When does the library close on weekdays?', 'At five in the afternoon', ['At four in the afternoon', 'At five in the afternoon', 'At six in the evening']),
      Q('What colour is the door?', 'Blue', ['Green', 'Blue', 'Red']),
      Q('What do books for young readers have?', 'A green sticker', ['A green sticker', 'A red card', 'A blue name']),
      Q('How many computers are there?', 'Eight', ['Six', 'Eight', 'Ten']),
      Q('How long can students keep a book?', 'Two weeks', ['One week', 'Two weeks', 'Three weeks']),
      TF('Students can borrow three books at one time.', true),
      TF('Students can eat at the computers.', false, 'They must not eat or drink in the room.'),
      Q('The librarian says there are more than three ___ story books.', 'thousand'),
      Q('Each student can use a computer for thirty ___.', 'minutes')
    ]
  },
  {
    topic: 'Sports day commentary',
    audioText: "Good afternoon, everyone, and welcome to our school sports day. The sun is shining, and the field looks beautiful. I am your commentator, Mr Karim, and I am very happy to be here.\n\nThe first race is the sixty metre run for the youngest children. There are eight runners. They are on the line, and now they go. Look at little Dilnoza in the red shirt. She is fast. She is first, and Omar is second. Dilnoza wins. What a great start.\n\nNext is the long jump. Jasur from class six jumps three metres. That is a very good jump. Then Emma tries and jumps two metres and eighty centimetres. Jasur is the winner so far.\n\nNow it is time for the team race. Each team has four runners, and they pass a small stick to each other. The blue team is quick, but the yellow team drops the stick. Oh no. The blue team wins easily, and the crowd is loud.\n\nThe last event is the parents' race. Many mothers and fathers are standing on the line. Some are laughing, and some are stretching. They run, and Mr Tahir, a father, finishes first. Everyone claps.\n\nThe prizes are ready, and there is cold water for everyone. Thank you for coming. It was a fantastic day.",
    qs: [
      Q('Who is the commentator?', 'Mr Karim', ['Mr Tahir', 'Mr Karim', 'Jasur']),
      Q('How long is the first race?', 'Sixty metres', ['Sixty metres', 'Eighty metres', 'One hundred metres']),
      Q('What colour is Dilnoza\'s shirt?', 'Red', ['Red', 'Blue', 'Yellow']),
      Q('How far does Jasur jump?', 'Three metres', ['Two metres', 'Three metres', 'Four metres']),
      Q('Why does the yellow team lose?', 'They drop the stick', ['They drop the stick', 'They start late', 'They fall down']),
      Q('Who wins the parents\' race?', 'Mr Tahir', ['Mr Karim', 'Mr Tahir', 'Omar']),
      TF('Each team in the team race has four runners.', true),
      TF('Omar wins the first race.', false, 'Dilnoza wins and Omar is second.'),
      Q('The weather is good, and the ___ is shining.', 'sun'),
      Q('At the end there is cold ___ for everyone.', 'water')
    ]
  },
  {
    topic: 'A lesson plan',
    audioText: "Ms Green is an English teacher. Every evening she makes a plan for the next day. Tonight she is planning a lesson for her class of twenty-two students. The lesson is about food, and it lasts forty-five minutes.\n\nFirst, she wants a warm-up. For five minutes, the students will say the names of fruit and vegetables. They will stand up and call out words, one by one. Ms Green thinks this wakes them up.\n\nSecond, she will show ten pictures on the board. The pictures show bread, cheese, milk, eggs, rice and other things. She will say each word, and the students will repeat it. This takes ten minutes.\n\nThird, there is a listening task. The students will hear a short talk about a boy at the market. They must write down what he buys. It will play twice. Then they will check their answers with a partner.\n\nFourth, the class will play a game. Students will work in groups of four. Each group makes a menu for a small cafe. They will draw it on a big piece of paper. The best menu wins a sticker.\n\nAt the end, Ms Green will give them a short homework task. They must write three sentences about their favourite food. She puts her notes in a blue folder and goes home happy.",
    qs: [
      Q('What does Ms Green teach?', 'English', ['English', 'Science', 'Art']),
      Q('How many students are in her class?', 'Twenty-two', ['Twenty', 'Twenty-two', 'Twenty-five']),
      Q('What is the topic of the lesson?', 'Food', ['Food', 'Animals', 'Weather']),
      Q('How long is the warm-up?', 'Five minutes', ['Five minutes', 'Ten minutes', 'Fifteen minutes']),
      Q('How many times will the listening play?', 'Twice', ['Once', 'Twice', 'Three times']),
      Q('How many students are in each group?', 'Four', ['Three', 'Four', 'Five']),
      TF('The lesson lasts forty-five minutes.', true),
      TF('The group with the best menu wins a book.', false, 'The best menu wins a sticker.'),
      Q('Ms Green will show ten ___ on the board.', 'pictures'),
      Q('For homework students write three sentences about their favourite ___.', 'food')
    ]
  },
  {
    topic: "A student's morning",
    audioText: "Jasur is a student in class seven. His mornings are always very busy. Today his alarm clock rings at six forty-five, but he does not want to get up. He turns it off and sleeps for five more minutes. Then his mother opens the door and says, \"Jasur, it is late.\"\n\nHe jumps out of bed, washes his face and puts on his school uniform. He cannot find his left sock. He looks under the bed, and there it is. His sister laughs at him.\n\nAt the table, there is hot porridge and a glass of milk. Jasur eats quickly because he does not want to miss the bus. His mother puts an apple and a small sandwich in his bag for lunch.\n\nAt seven twenty he runs to the bus stop. The bus usually comes at seven thirty. Today it is five minutes late, so he has time to breathe. His friend Ali is already there. They talk about the football match from last night.\n\nThe bus ride takes twenty minutes. When Jasur arrives at school, he remembers something terrible. His maths book is on the kitchen table. He is sad, but Ali says, \"Do not worry. You can share my book today.\" Jasur smiles and says thank you.",
    qs: [
      Q('What time does the alarm ring?', 'At six forty-five', ['At six thirty', 'At six forty-five', 'At seven']),
      Q('What can Jasur not find?', 'His left sock', ['His left sock', 'His shoes', 'His bag']),
      Q('What is there for breakfast?', 'Porridge and milk', ['Eggs and tea', 'Porridge and milk', 'Bread and cheese']),
      Q('What does his mother put in his bag?', 'An apple and a sandwich', ['An apple and a sandwich', 'Rice and soup', 'Fruit and a cake']),
      Q('How long is the bus ride?', 'Twenty minutes', ['Ten minutes', 'Twenty minutes', 'Thirty minutes']),
      Q('What does Jasur forget?', 'His maths book', ['His maths book', 'His lunch', 'His pen']),
      TF('The bus is five minutes late today.', true),
      TF('Jasur\'s brother laughs at him.', false, 'His sister laughs at him.'),
      Q('Jasur usually runs to the bus ___.', 'stop'),
      Q('His friend Ali says Jasur can ___ his book.', 'share')
    ]
  },
  {
    topic: 'A club schedule',
    audioText: "Hello, new students. I am Mr Anvar, and I will tell you about our after-school clubs. Every club is free, and everyone is welcome. Please choose one or two clubs that you like.\n\nOn Monday, there is the chess club. It starts at three thirty in room nine. Beginners learn simple moves, and older players have small games. On Tuesday, we have the drama club. They are making a short play about a lost dog. They need actors, and they also need students to make costumes.\n\nOn Wednesday, the football club meets on the school field at four o'clock. Please bring your sports shoes. The coach is Mr Aziz, and he is very friendly. On Thursday, there is the art club in room fourteen. Students paint, draw and make small models from paper.\n\nOn Friday, the reading club meets in the library at three o'clock. The members read one book each month and talk about it. This month the book is a funny story about a talking cat.\n\nAll clubs finish at five o'clock. Parents can come and take the children home at that time. If you want to join, please write your name on the list outside my office. The list closes on the end of this week. I hope to see you all soon.",
    qs: [
      Q('Who is speaking about the clubs?', 'Mr Anvar', ['Mr Aziz', 'Mr Anvar', 'Mr Brown']),
      Q('When does the chess club meet?', 'On Monday', ['On Monday', 'On Tuesday', 'On Thursday']),
      Q('What is the drama club\'s play about?', 'A lost dog', ['A lost dog', 'A talking cat', 'A big storm']),
      Q('Where does the football club meet?', 'On the school field', ['In room nine', 'On the school field', 'In the library']),
      Q('What do students do in the art club?', 'Paint, draw and make models', ['Play games', 'Paint, draw and make models', 'Read books']),
      Q('When do all the clubs finish?', 'At five o\'clock', ['At four o\'clock', 'At five o\'clock', 'At six o\'clock']),
      TF('The clubs are free.', true),
      TF('The reading club meets on Wednesday.', false, 'It meets on Friday.'),
      Q('The coach of the football club is Mr ___.', 'aziz'),
      Q('Students write their name on the ___ outside the office.', 'list')
    ]
  },
  {
    topic: 'A parent-teacher call',
    audioText: "Mrs Yusupova is a teacher at a primary school. This evening she is calling the mother of one of her students. The student is a nine-year-old girl called Sevara. The mother's name is Gulnora.\n\nMrs Yusupova says, \"Good evening, Mrs Gulnora. I have good news about Sevara.\" The mother is happy. The teacher says that Sevara is a kind and clever girl. She helps her friends and always listens in class. Her reading is excellent this term.\n\nThen the teacher says there is one small problem. Sevara often forgets her homework notebook. Last week she forgot it three times. Mrs Gulnora is surprised and says she will check the bag every night. The teacher thanks her and says that a small habit can solve the problem.\n\nMrs Yusupova also says that Sevara is a little shy in maths lessons. She does not like to answer in front of the class. The teacher suggests that Sevara practise at home. Ten minutes a day is enough. She can use number cards or a simple game.\n\nFinally, the teacher invites the mother to a meeting on Thursday at four o'clock. They will talk about the end of term. Mrs Gulnora says she will come. Both women say goodbye, and the call ends. It lasted about eight minutes.",
    qs: [
      Q('Who is the teacher calling?', 'A student\'s mother', ['A student\'s mother', 'The head teacher', 'A friend']),
      Q('How old is Sevara?', 'Nine', ['Eight', 'Nine', 'Ten']),
      Q('What is excellent this term?', 'Her reading', ['Her reading', 'Her drawing', 'Her sport']),
      Q('How many times did Sevara forget her notebook last week?', 'Three times', ['Once', 'Twice', 'Three times']),
      Q('How much should Sevara practise maths each day?', 'Ten minutes', ['Five minutes', 'Ten minutes', 'One hour']),
      Q('When is the meeting?', 'On Thursday at four o\'clock', ['On Monday at four o\'clock', 'On Thursday at four o\'clock', 'On Thursday at five o\'clock']),
      TF('Sevara is shy in maths lessons.', true),
      TF('The call lasted about twenty minutes.', false, 'It lasted about eight minutes.'),
      Q('The mother will check the ___ every night.', 'bag'),
      Q('Sevara can use number ___ to practise.', 'cards')
    ]
  },
  {
    topic: 'A lunch break chat',
    audioText: "It is twelve thirty, and the lunch break has started. Nodira and her friend Kate are in the school canteen. They are looking for a table. The room is noisy, and there are many children in line.\n\nNodira asks Kate, \"What would you like to eat today?\" Kate says she wants pasta with tomato sauce and a glass of apple juice. Nodira takes a plate of rice with chicken and a salad. The lady at the counter smiles and gives them each a small piece of cake. She says it is for the birthday of the cook.\n\nThey find a table near the window and sit down. Kate says her morning was difficult because of the science test. Nodira tells her not to worry. She says the test was not so hard, and Kate probably did well.\n\nThen they talk about the weekend. Nodira says she will visit her grandmother in the village. Her grandmother has many chickens and a big garden. Kate says she will go to the cinema with her older brother. They want to see a film about space.\n\nThe bell rings at one ten. The break is over. The girls take their trays to the kitchen window, say thank you, and walk back to class together.",
    qs: [
      Q('What time does the lunch break start?', 'Twelve thirty', ['Twelve', 'Twelve thirty', 'One o\'clock']),
      Q('What does Kate want to eat?', 'Pasta', ['Pasta', 'Rice', 'Soup']),
      Q('What does Nodira take?', 'Rice with chicken and a salad', ['Pasta and juice', 'Rice with chicken and a salad', 'Fish and bread']),
      Q('Why does the lady give them cake?', 'It is the cook\'s birthday', ['It is the cook\'s birthday', 'It is a school holiday', 'They won a prize']),
      Q('Where will Nodira go at the weekend?', 'To her grandmother\'s village', ['To the cinema', 'To her grandmother\'s village', 'To the sea']),
      Q('What does Kate\'s brother want to see?', 'A film about space', ['A film about space', 'A football match', 'A film about animals']),
      TF('Their table is near the window.', true),
      TF('Kate\'s morning was easy.', false, 'It was difficult because of the science test.'),
      Q('Kate drinks a glass of apple ___.', 'juice'),
      Q('The bell rings at one ___.', 'ten')
    ]
  },
  {
    topic: 'A school trip briefing',
    audioText: "Good morning, class seven. I am Mr Davron, and I want to tell you about next week's school trip. We are going to the National Museum in the city. It is an exciting day, so please listen to the plan.\n\nWe will meet at the school gate on Friday at seven forty-five. Please do not be late, because the bus leaves at eight o'clock exactly. The ride takes one hour. Please sit down and keep your seat belt on.\n\nAt the museum we will see old coins, clay pots and large maps. A guide called Miss Lena will show us around. The tour takes ninety minutes. You can ask her questions, but please do not touch anything. After the tour, we will have lunch in the museum garden. Please bring your own sandwich and a bottle of water. There is a small shop, but it is expensive.\n\nPlease wear comfortable shoes and a warm jacket. The weather will be cool. Bring a pen and a small notebook, too. After the visit, each student must write five sentences about their favourite thing.\n\nWe will come back to school at three o'clock. If you want to go, please give this paper to your parents. They must sign it and return it to me by Wednesday. Thank you, and I hope you enjoy the trip.",
    qs: [
      Q('Where is the class going?', 'To the National Museum', ['To the National Museum', 'To a zoo', 'To a mountain']),
      Q('When does the bus leave?', 'At eight o\'clock', ['At seven forty-five', 'At eight o\'clock', 'At nine o\'clock']),
      Q('How long is the bus ride?', 'One hour', ['Half an hour', 'One hour', 'Two hours']),
      Q('Who is the guide?', 'Miss Lena', ['Miss Lena', 'Mr Davron', 'Mrs Karimova']),
      Q('What should students bring for lunch?', 'A sandwich and water', ['Money for the shop', 'A sandwich and water', 'Hot soup']),
      Q('What will the weather be like?', 'Cool', ['Hot', 'Cool', 'Rainy']),
      TF('The museum tour takes ninety minutes.', true),
      TF('Students can touch the old coins.', false, 'They must not touch anything.'),
      Q('The parents must sign the paper and return it by ___.', 'wednesday'),
      Q('The class comes back to school at three ___.', 'o\'clock')
    ]
  },
  {
    topic: 'A weekend routine',
    audioText: "My name is Timur, and I am twelve years old. My weekdays are busy, but my weekends are slow and relaxed. I want to tell you what I usually do on Saturday and Sunday.\n\nOn Saturday I get up late, at nine o'clock. My mother makes pancakes, and we eat them with honey. After breakfast I clean my room and help my father in the garden. We water the flowers and pick some tomatoes. It takes about an hour.\n\nIn the afternoon I meet my friends at the park. We play football for two hours. Sometimes my cousin Anna comes with us, and she is a very good player. When we are tired, we sit under a tree and drink cold lemonade. At six o'clock I go home, take a shower and have dinner.\n\nOn Sunday I get up early, at eight, because we visit my grandparents. They live in a small house ten minutes away. My grandmother cooks a big lunch, and my grandfather tells old stories. I love his stories about the mountains.\n\nIn the evening, I pack my school bag for Monday and check my timetable. I read a book for half an hour and go to bed at nine thirty. A good weekend makes me ready for the new week.",
    qs: [
      Q('How old is Timur?', 'Twelve', ['Ten', 'Eleven', 'Twelve']),
      Q('What time does Timur get up on Saturday?', 'At nine o\'clock', ['At eight o\'clock', 'At nine o\'clock', 'At ten o\'clock']),
      Q('What does his mother make on Saturday?', 'Pancakes', ['Pancakes', 'Soup', 'Eggs']),
      Q('How long do the friends play football?', 'Two hours', ['One hour', 'Two hours', 'Three hours']),
      Q('Who is a very good player?', 'His cousin Anna', ['His cousin Anna', 'His father', 'His friend Ali']),
      Q('Whom does Timur visit on Sunday?', 'His grandparents', ['His grandparents', 'His cousins', 'His teacher']),
      TF('Timur\'s grandfather tells stories about the mountains.', true),
      TF('Timur goes to bed at ten o\'clock on Sunday.', false, 'He goes to bed at nine thirty.'),
      Q('On Saturday he helps his father in the ___.', 'garden'),
      Q('At the park they drink cold ___.', 'lemonade')
    ]
  }
];
