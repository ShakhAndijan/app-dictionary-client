const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
  {
    topic: "A new friend introduces herself",
    audioText: "Hello! My name is Dilnoza. I am eleven years old, and I am from Samarkand. Today is my first day at your school, and I am a little nervous. I want to tell you about myself so we can be friends.\n\nI live with my mother, my father and my little sister. My sister is called Malika. She is six years old and she loves cats. We have one cat at home. Her name is Mushuk, which means cat in Uzbek. My mother is a doctor in a small clinic. My father drives a bus in the city. They both work very hard, but we always eat dinner together at seven o'clock.\n\nMy favourite subject is art. I like to draw flowers and birds. I also like swimming. Every Saturday I go to the pool with my cousin at ten o'clock. I cannot play football, but I would like to learn.\n\nMy best colour is green, and my favourite food is plov.\n\nNow I want to know about you. What is your name? Do you have brothers or sisters? What do you like to do after school? Maybe we can sit together at lunch tomorrow. I have an apple and a sandwich, and I can share them with you. Thank you for listening, and I hope to see you soon!",
    qs: [
      Q("Where is Dilnoza from?", "Samarkand", ["Samarkand", "Bukhara", "Tashkent"]),
      Q("How old is her sister Malika?", "six", ["four", "six", "eleven"]),
      Q("What does Dilnoza's mother do?", "She is a doctor", ["She is a doctor", "She is a teacher", "She drives a bus"]),
      Q("When does the family eat dinner?", "At seven o'clock", ["At six o'clock", "At seven o'clock", "At eight o'clock"]),
      Q("Dilnoza's favourite subject at school is ___."  , "art"),
      Q("When does Dilnoza go to the pool?", "On Saturday", ["On Friday", "On Saturday", "On Sunday"]),
      TF("Dilnoza can play football well.", false, "She cannot play football, but she would like to learn."),
      TF("The family has one cat.", true),
      Q("Her favourite food is ___.", "plov"),
      Q("What can Dilnoza share at lunch?", "An apple and a sandwich", ["An apple and a sandwich", "Plov and bread", "A cake and tea"])
    ]
  },
  {
    topic: "My family tour",
    audioText: "Welcome to my home! My name is Sardor, and today I will show you my family.\n\nIn the middle you can see my grandfather. His name is Karim, and he is seventy years old. He has white hair and a kind face. Next to him is my grandmother, Halima. She makes the best bread in our street.\n\nOn the left is my father, Anvar. He is a teacher of maths. He is tall and he wears glasses. My mother, Feruza, is standing next to him. She works in a shop that sells shoes. She comes home at five o'clock every day.\n\nNow look at the children. The tall boy is my older brother, Jamshid. He is fifteen and he plays the guitar. The girl in the red dress is my sister, Nilufar. She is nine, and she is very funny. She loves to dance. And the small boy at the front is me! I am twelve years old, and I like computers.\n\nWe also have a dog in the garden. His name is Bars, and he is two years old. He is brown and very friendly.\n\nEvery Friday, all of us have lunch together in the big room. We talk, we laugh and we eat soup. I love my family very much. Now, would you like some tea?",
    qs: [
      Q("Who is seventy years old?", "Sardor's grandfather", ["Sardor's father", "Sardor's grandfather", "Sardor's brother"]),
      Q("What is special about Halima?", "She makes very good bread", ["She makes very good bread", "She plays the guitar", "She sells shoes"]),
      Q("What does Sardor's father teach?", "Maths", ["English", "Maths", "Music"]),
      Q("When does Sardor's mother come home?", "At five o'clock", ["At four o'clock", "At five o'clock", "At six o'clock"]),
      TF("Sardor's older brother plays the guitar.", true),
      Q("Sardor's sister Nilufar is nine and she loves to ___.", "dance"),
      Q("How old is Sardor?", "Twelve", ["Nine", "Twelve", "Fifteen"]),
      Q("What colour is the dog Bars?", "Brown", ["Black", "Brown", "White"]),
      TF("The family has lunch together every Sunday.", false, "They have lunch together every Friday."),
      Q("On Fridays the family eats ___ in the big room.", "soup")
    ]
  },
  {
    topic: "A pen friend's voice message",
    audioText: "Hi Jasur! This is Emma from England. This is my first voice message to you, and I am very happy to be your pen friend. My teacher gave me your name last week.\n\nI am twelve years old, and I live in a small town near London. My house is next to a park, and I walk there with my dog every morning. His name is Max. He is a white dog with one black ear. He is very noisy!\n\nI live with my mum, my dad and my brother Oliver. Oliver is seven. He likes football and he plays all day. My mum works in a library, so she knows many good books. My dad is a bus driver, and he starts work very early, at five o'clock in the morning.\n\nAt school, my best subject is English, of course, but I also like science. My worst subject is maths. I have three good friends in my class. Their names are Lucy, Sophie and Ben. After school we often go to the cafe and drink hot chocolate.\n\nI want to learn about your country. Do you have a big family? What food do you like? Please tell me about the city of Tashkent. I also want to learn a few words in Uzbek. How do you say hello?",
    qs: [
      Q("Who gave Emma the name of her pen friend?", "Her teacher", ["Her mother", "Her teacher", "Her friend Lucy"]),
      Q("Where does Emma live?", "In a small town near London", ["In London city", "In a small town near London", "In a village by the sea"]),
      Q("What is special about Max the dog?", "He has one black ear", ["He has one black ear", "He is very old", "He is very quiet"]),
      Q("What does Emma's mother do?", "She works in a library", ["She is a nurse", "She works in a library", "She drives a bus"]),
      TF("Emma's father starts work at five o'clock in the morning.", true),
      Q("Her little brother Oliver is ___ years old.", "seven"),
      Q("Which subject does Emma find hardest?", "Maths", ["English", "Science", "Maths"]),
      Q("Where do Emma and her friends go after school?", "To the cafe", ["To the park", "To the cafe", "To the library"]),
      TF("Emma has two good friends in her class.", false, "She has three good friends: Lucy, Sophie and Ben."),
      Q("After school they drink hot ___.", "chocolate")
    ]
  },
  {
    topic: "A talk about my best friend",
    audioText: "Today I want to tell you about my best friend. His name is Aziz, and we are both ten years old. We met three years ago, on the first day of school. He sat next to me, and he gave me a pencil because I forgot mine. After that day, we were always together.\n\nAziz is a tall boy with short black hair and big brown eyes. He is very friendly, and everybody in our class likes him. He is also very kind. When a new child comes to our school, Aziz always says hello first.\n\nWe live in the same street, so every morning I knock on his door at half past seven. Then we walk to school together. It takes us fifteen minutes.\n\nAziz loves sport. His favourite game is basketball, and he plays in the school team on Tuesday and Thursday. I am not good at basketball, so I watch him and shout his name. I am good at drawing, so I sometimes draw pictures for him. Last month I drew his dog, and he put the picture on his wall.\n\nOn Saturdays we go to the river with his father. We catch small fish and then let them go. Aziz says that a good friend is someone who helps you and listens to you. I think he is right, and I am happy to have him.",
    qs: [
      Q("How old are the two boys?", "Ten", ["Eight", "Ten", "Twelve"]),
      Q("How did the boys become friends?", "Aziz gave a pencil to the speaker", ["Aziz gave a pencil to the speaker", "They played basketball", "They lived in the same house"]),
      Q("What does Aziz look like?", "Tall with short black hair", ["Small with long hair", "Tall with short black hair", "Tall with red hair"]),
      Q("What time does the speaker knock on Aziz's door?", "Half past seven", ["Seven o'clock", "Half past seven", "Eight o'clock"]),
      Q("It takes them ___ minutes to walk to school.", "fifteen"),
      TF("Aziz plays basketball on Monday and Friday.", false, "He plays on Tuesday and Thursday."),
      Q("What is the speaker good at?", "Drawing", ["Basketball", "Drawing", "Singing"]),
      Q("What did the speaker draw last month?", "Aziz's dog", ["Aziz's dog", "A river", "A school"]),
      TF("On Saturdays the boys catch fish and let them go.", true),
      Q("Aziz says that a good friend is someone who helps you and ___ to you.", "listens")
    ]
  },
  {
    topic: "A class presentation about my brother",
    audioText: "Good morning, teacher and friends. My name is Madina, and today I will talk about my brother. His name is Timur. He is nineteen years old, and he is a student at the university in Tashkent.\n\nTimur is tall and strong. He has a small beard, and he always wears a blue jacket. He studies computers, and he wants to become a programmer. He lives in a small flat with two other students, so I do not see him every day. But he comes home every second weekend.\n\nWhen Timur is at home, our house is full of noise. He plays music, he cooks pasta for everyone, and he helps my mother in the garden. He is very good at cooking. His special dish is chicken soup with potatoes. My father says it is better than a restaurant!\n\nTimur has a hobby. He takes photos. He has an old camera, and he takes pictures of trees, birds and old buildings. Last summer he took a photo of a bird on our roof, and a newspaper put it on its page. We were all very proud.\n\nTimur is also a good teacher. When I have problems with maths, he explains the lesson slowly and kindly. He never gets angry. I want to be like him one day. Thank you very much for listening. Do you have any questions about my brother?",
    qs: [
      Q("How old is Timur?", "Nineteen", ["Fifteen", "Seventeen", "Nineteen"]),
      Q("What does Timur study?", "Computers", ["Music", "Computers", "Cooking"]),
      Q("How often does Timur come home?", "Every second weekend", ["Every day", "Every second weekend", "Once a year"]),
      TF("Timur lives alone in a flat.", false, "He lives with two other students."),
      Q("What is Timur's special dish?", "Chicken soup with potatoes", ["Pasta with cheese", "Chicken soup with potatoes", "Plov with meat"]),
      Q("Timur's hobby is taking ___.", "photos"),
      Q("What happened to his photo of a bird?", "A newspaper printed it", ["A newspaper printed it", "He sold it to a shop", "It won a school prize"]),
      Q("What does Timur do when Madina has problems with maths?", "He explains the lesson kindly", ["He does her homework", "He explains the lesson kindly", "He tells her to ask the teacher"]),
      TF("Timur never gets angry when he helps Madina.", true),
      Q("What colour is the jacket that Timur always wears? It is ___.", "blue")
    ]
  },
  {
    topic: "A grandmother's story",
    audioText: "Come and sit near me, children. Today I will tell you about my life when I was small. My name is Zulfiya, and I am seventy-two years old now. But once I was a little girl, just like you.\n\nI was born in a village near Fergana. We had a small house with a big garden. My father worked in the fields, and my mother made bread every morning. I had four brothers and one sister, so our house was always full of people. We did not have a television, and we did not have a telephone. But we were happy.\n\nEvery day I walked to school with my sister. The school was far away, and the walk took one hour. In winter the road was cold and white, and our feet were wet. My teacher was a kind woman called Miss Saida. She taught me to read and write, and I still remember her face.\n\nAfter school I helped my mother. I fed the chickens, and I carried water from the well. In the evening my grandfather told us stories by the fire.\n\nWhen I was twenty, I met your grandfather at a wedding. He was shy and he gave me a red apple. One year later we got married. Now we have six grandchildren, and that is the best gift of my life.",
    qs: [
      Q("How old is Zulfiya now?", "Seventy-two", ["Sixty-two", "Seventy", "Seventy-two"]),
      Q("Where was she born?", "In a village near Fergana", ["In a village near Fergana", "In Samarkand", "In a big city"]),
      Q("Zulfiya had ___ brothers and one sister.", "four"),
      TF("Zulfiya's family had a television.", false, "They had no television and no telephone."),
      Q("How long was the walk to school?", "One hour", ["Ten minutes", "One hour", "Two hours"]),
      Q("Who was her teacher?", "Miss Saida", ["Miss Saida", "Miss Halima", "Her mother"]),
      Q("She carried water from the ___.", "well"),
      Q("Who told stories by the fire in the evening?", "Her grandfather", ["Her father", "Her grandfather", "Her teacher"]),
      Q("What did her future husband give her at the wedding?", "A red apple", ["A red apple", "A flower", "A book"]),
      TF("Zulfiya has six grandchildren.", true)
    ]
  },
  {
    topic: "Meeting a neighbour",
    audioText: "Gulnora has just moved to a new flat on the third floor. On Saturday morning she carries a box up the stairs, and she meets a woman at the door next to hers. The woman smiles and says hello.\n\nThe woman says, \"Hello! My name is Mrs Brown. I am your new neighbour. Welcome to the building!\" Gulnora says, \"Thank you. My name is Gulnora. Nice to meet you.\" Mrs Brown asks, \"Are you from this city?\" Gulnora answers, \"No, I come from Namangan. I am a student of medicine, and I study at the university near here.\"\n\nMrs Brown tells her about the building. She says that the shop on the corner opens at eight o'clock and closes at nine o'clock in the evening. The best bakery is behind the bus stop. The lift does not work, so everyone uses the stairs.\n\nMrs Brown is sixty years old, and she lives with her cat, Lily. Her son lives in Canada, and he calls her every Sunday. She likes gardening, and she has many flowers on her balcony.\n\nThen Mrs Brown says, \"Would you like to have tea with me tomorrow at four o'clock?\" Gulnora is very happy. She says, \"Yes, please. I will bring some sweets from my home town.\" They say goodbye, and Gulnora feels much better in her new home.",
    qs: [
      Q("Which floor is Gulnora's new flat on?", "The third floor", ["The first floor", "The third floor", "The fifth floor"]),
      Q("Where does Gulnora come from?", "Namangan", ["Namangan", "Bukhara", "Samarkand"]),
      Q("What does Gulnora study?", "Medicine", ["Medicine", "Art", "Law"]),
      Q("What time does the shop on the corner close?", "At nine o'clock in the evening", ["At eight o'clock in the evening", "At nine o'clock in the evening", "At six o'clock in the evening"]),
      Q("Where is the best bakery? It is behind the bus ___.", "stop"),
      TF("The lift in the building works well.", false, "The lift does not work."),
      Q("What is the name of Mrs Brown's cat?", "Lily", ["Max", "Lily", "Bella"]),
      Q("When does Mrs Brown's son call her?", "Every Sunday", ["Every Sunday", "Every Monday", "Every evening"]),
      TF("Mrs Brown has flowers on her balcony.", true),
      Q("Mrs Brown invites Gulnora for tea at ___ o'clock tomorrow.", "four")
    ]
  },
  {
    topic: "A job talk by a nurse",
    audioText: "Hello, children. Thank you for inviting me to your class. My name is Kamola, and I am a nurse. Today I want to tell you about my job.\n\nI work in a children's hospital in the centre of the city. I start work at seven o'clock in the morning, and I finish at three o'clock in the afternoon. I wear a white coat and a small blue hat, and I always keep a pen in my pocket.\n\nWhat do I do every day? First, I say good morning to the children in the hospital. Then I take their temperature and check their pulse. I give them medicine, and I write everything in a big book. I also help the doctors. When a child is afraid, I sit with him, and I tell him a story or sing a song. This is the best part of my work.\n\nTo be a nurse, you need to study for four years. You must also be kind, patient and calm. You must wash your hands many times a day. That is very important because it stops germs.\n\nI work with eight other nurses and five doctors. At lunch we eat soup and bread together. I love my job because I help people every day. If you want to be a nurse one day, work hard at school. Are there any questions?",
    qs: [
      Q("Where does Kamola work?", "In a children's hospital", ["In a school", "In a children's hospital", "In a small clinic"]),
      Q("What time does she start work in the morning?", "At seven o'clock", ["At seven o'clock", "At eight o'clock", "At three o'clock"]),
      Q("What does she wear at work?", "A white coat and a blue hat", ["A green dress", "A white coat and a blue hat", "A black jacket"]),
      Q("What does Kamola do when a child is afraid?", "She tells a story or sings a song", ["She calls the doctor", "She tells a story or sings a song", "She gives him sweets"]),
      TF("Kamola finishes work at three o'clock in the afternoon.", true),
      Q("How long must a person study to become a nurse?", "Four years", ["Two years", "Four years", "Eight years"]),
      Q("Washing hands is important because it stops ___.", "germs"),
      TF("Kamola works with three doctors.", false, "She works with five doctors and eight other nurses."),
      Q("What do the staff eat together at lunch?", "Soup and bread", ["Rice and meat", "Soup and bread", "Salad and fruit"]),
      Q("Kamola says that nurses must be kind, patient and ___.", "calm")
    ]
  },
  {
    topic: "A teacher's welcome",
    audioText: "Good morning, everyone, and welcome to class five B! My name is Mr Karimov, and I am your new English teacher.\n\nLet me tell you a little about myself. I am thirty-five years old, and I come from the city of Bukhara. I studied English at university for four years, and I have been a teacher for ten years. I have a wife and two children. My son is called Ali, and he is five. My daughter is called Zarina, and she is two. They keep me very busy at home!\n\nIn my free time, I like reading and playing chess. I also like football. Every Sunday I play with my friends in the park.\n\nNow, let me tell you about our class. We have English lessons on Monday, Wednesday and Friday. Each lesson is forty minutes long. Please bring your book, your notebook and a pen. We will read stories, sing songs and play games. I want you to speak English in every lesson, even if you make mistakes. Mistakes are good because we learn from them.\n\nHere are my rules. Be on time, be kind and listen to each other. If you do not understand something, please put your hand up and ask me. I am here to help you. Now, let us begin. Please tell me your names, one by one.",
    qs: [
      Q("What is the teacher's name?", "Mr Karimov", ["Mr Karimov", "Mr Ali", "Mr Brown"]),
      Q("Where does Mr Karimov come from?", "Bukhara", ["Samarkand", "Bukhara", "Tashkent"]),
      Q("How long has he been a teacher?", "Ten years", ["Four years", "Ten years", "Thirty-five years"]),
      Q("His daughter Zarina is ___ years old.", "two"),
      TF("Mr Karimov plays football every Sunday.", true),
      Q("Which game does he like to play besides football? He likes ___.", "chess"),
      Q("On which days are the English lessons?", "Monday, Wednesday and Friday", ["Tuesday and Thursday", "Monday, Wednesday and Friday", "Every day"]),
      Q("How long is each lesson?", "Forty minutes", ["Thirty minutes", "Forty minutes", "One hour"]),
      TF("Mr Karimov says that mistakes are bad.", false, "He says mistakes are good because we learn from them."),
      Q("What should students do if they do not understand?", "Put a hand up and ask", ["Put a hand up and ask", "Look at the book", "Wait until the end"])
    ]
  },
  {
    topic: "A club introduction",
    audioText: "Hello, everybody! My name is Nigora, and I am the leader of the school chess club. Today I want to invite you to join us. Chess is a fun game, and anyone can learn it.\n\nOur club started three years ago. At first there were only five members, but now we have twenty-eight. We meet every Wednesday after lessons, at half past two, in room number twelve. The meeting lasts one hour. We have eight boards, so students play in pairs.\n\nIn the first part of the meeting, I teach a new idea. For example, last week I showed the little children how a horse moves. After that, we play games, and we drink tea and eat biscuits. Our teacher, Mr Rustam, helps us when we have questions. He plays chess very well, and he once won a big prize in Tashkent.\n\nChess is good for your brain. It teaches you to think slowly and to be patient. It also teaches you to lose without being sad. I lost my first twenty games, but I did not stop, and now I am the best player in the school.\n\nIn May, we will have a tournament with another school. The winner will get a silver cup. Just come to room twelve next Wednesday and say hello. I promise you will have fun!",
    qs: [
      Q("What is Nigora's job in the club?", "She is the leader", ["She is the leader", "She is the teacher", "She is the newest member"]),
      Q("How many members does the club have now?", "Twenty-eight", ["Five", "Twenty-eight", "Eight"]),
      Q("When does the club meet?", "On Wednesday at half past two", ["On Monday at two o'clock", "On Wednesday at half past two", "On Friday at three o'clock"]),
      Q("The club meets in room number ___.", "twelve"),
      TF("The meeting lasts one hour.", true),
      Q("What did Nigora show the little children last week?", "How a horse moves", ["How a horse moves", "How to win quickly", "How to make tea"]),
      Q("What does the club have with tea?", "Biscuits", ["Cake", "Biscuits", "Fruit"]),
      Q("What did Mr Rustam once win?", "A big prize in Tashkent", ["A cup in Samarkand", "A big prize in Tashkent", "A new chess board"]),
      TF("Nigora won her first twenty games.", false, "She lost her first twenty games."),
      Q("The winner of the tournament in May will get a silver ___.", "cup")
    ]
  },
  {
    topic: "My cousin's visit",
    audioText: "Last week my cousin Bobur came to visit us. He lives in the city of Khiva, and he stayed with us for five days. I was very happy because I had not seen him for a year.\n\nBobur arrived on Monday morning by train. My father met him at the station at nine o'clock. Bobur had a big green bag and a present for me. The present was a box of dried apricots from his mother, my aunt Sevara. She makes them every summer.\n\nBobur is fourteen years old, two years older than I am. He is thin and very funny. He can make an animal sound with his mouth, and he made my little sister laugh all the time. He also speaks a little Russian and some English, and he helped me with my English homework.\n\nOn Tuesday we took him to the big market. He bought a hat for his father and a scarf for his mother. On Wednesday we went to the park and rode bicycles. I fell off mine, but I was not hurt. On Thursday my mother cooked a special dinner with rice, meat and carrots, and the whole family sat together.\n\nOn Friday afternoon, he went home. I felt sad at the station. Bobur said, \"Next time, you must come to Khiva.\" I said yes.",
    qs: [
      Q("Where does Bobur live?", "Khiva", ["Khiva", "Bukhara", "Fergana"]),
      Q("How long did Bobur stay?", "Five days", ["Two days", "Five days", "A week"]),
      Q("How did Bobur arrive?", "By train", ["By train", "By bus", "By car"]),
      Q("What was the present from his mother?", "Dried apricots", ["A hat", "Dried apricots", "A scarf"]),
      TF("Bobur is two years younger than the speaker.", false, "Bobur is fourteen, two years older than the speaker."),
      Q("What did Bobur help the speaker with?", "English homework", ["Maths homework", "English homework", "Cooking"]),
      Q("What did Bobur buy for his father at the market?", "A hat", ["A hat", "A scarf", "A bag"]),
      Q("On Wednesday they rode ___ in the park.", "bicycles"),
      TF("The speaker was hurt when he fell off the bicycle.", false, "He fell, but he was not hurt."),
      Q("When did Bobur go home? He went home on ___.", "friday")
    ]
  },
  {
    topic: "A birthday speech",
    audioText: "Dear family and friends, thank you for coming to my daughter's party. Today is a very special day. Madina is ten years old! I am her father, and I want to say a few words.\n\nTen years ago, on a cold morning in January, I held Madina for the first time. She was very small, and she had a lot of black hair. I looked at her, and I was the happiest man in the world. Her mother cried, and so did I.\n\nWhen Madina was two, she began to talk. Her first word was not mum or dad. It was cat! We still laugh about that. At four, she learned to ride a bicycle. At six, she started school, and her backpack was bigger than she was. Now she is in the fourth class, and her teacher says she is one of the best readers.\n\nMadina is a kind girl. She shares her sweets, she helps her little brother with his shoes, and she always says thank you. She loves to sing, and she is learning the piano. Maybe one day she will play for the whole country.\n\nMadina, my dear, we love you very much. May you always be healthy and happy. Now, please, everybody, stand up, and let us sing together. After that, we will eat the big chocolate cake that her grandmother made. Happy birthday, Madina!",
    qs: [
      Q("How old is Madina today?", "Ten", ["Six", "Ten", "Twelve"]),
      Q("Who is making the speech?", "Madina's father", ["Madina's father", "Madina's teacher", "Madina's grandfather"]),
      Q("In which month was Madina born?", "January", ["January", "May", "September"]),
      Q("What was Madina's first word?", "Cat", ["Mum", "Dad", "Cat"]),
      TF("Madina learned to ride a bicycle at the age of four.", true),
      Q("When Madina started school at six, her ___ was bigger than she was.", "backpack"),
      Q("What does her teacher say about her?", "She is one of the best readers", ["She is one of the best readers", "She is the best singer", "She is the tallest girl"]),
      Q("What is Madina learning to play?", "The piano", ["The guitar", "The piano", "The drum"]),
      TF("Madina's grandmother bought the birthday cake in a shop.", false, "Her grandmother made the chocolate cake."),
      Q("What will the guests do after the speech? They will stand up and ___ together.", "sing")
    ]
  },
  {
    topic: "A guest at the door",
    audioText: "It is Sunday afternoon, and Sevara is at home with her grandmother. Suddenly someone knocks at the door. Sevara opens it and sees a young man with a red bag. He smiles and says, \"Hello! Is this the home of Mr Aliev?\"\n\nSevara says, \"Yes, it is. He is my grandfather. But he is not at home now. He is at the market.\" The young man says, \"Oh, I see. My name is Tom. I come from England. I am a friend of his son, Farhod. Farhod told me to visit his father when I was in town.\"\n\nSevara asks, \"Are you tired? Please come in. Would you like some water or tea?\" Tom says, \"Tea, please. Thank you very much.\" Sevara takes him to the living room, and her grandmother brings green tea, bread and sweets. She smiles and says, \"You are welcome in our house.\"\n\nTom takes a small box from his bag. He says, \"This is a present from Farhod. It is a watch.\" Grandmother says, \"How kind! My husband will be very happy.\"\n\nAfter twenty minutes, Mr Aliev comes back from the market with a big melon. He is surprised to see a stranger, but he quickly understands. He hugs Tom and says, \"You must stay for dinner tonight.\" Tom laughs and says, \"With pleasure!\"",
    qs: [
      Q("What day is it?", "Sunday", ["Saturday", "Sunday", "Monday"]),
      Q("Who is the guest looking for?", "Mr Aliev", ["Farhod", "Mr Aliev", "Sevara"]),
      Q("Where is Sevara's grandfather at the beginning?", "At the market", ["At the market", "At work", "In the garden"]),
      Q("Tom comes from ___.", "england"),
      Q("What colour is Tom's bag? It is ___.", "red"),
      TF("Tom is a friend of Mr Aliev's son.", true),
      Q("What does Tom drink?", "Tea", ["Water", "Tea", "Juice"]),
      Q("What is the present from Farhod?", "A watch", ["A book", "A watch", "A hat"]),
      TF("Mr Aliev comes back after two hours.", false, "He comes back after twenty minutes."),
      Q("What does Mr Aliev bring from the market?", "A big melon", ["A big melon", "A box of tea", "Some bread"])
    ]
  },
  {
    topic: "A talk about my hero",
    audioText: "My name is Otabek, and I want to talk about my hero. My hero is my uncle Rahim. He is a firefighter, and he works in the city of Andijan.\n\nMy uncle is thirty-eight years old. He is tall and strong, and he has a loud, warm voice. He wears a yellow helmet and heavy boots at work. His red truck is very big, and he lets me sit in it when I visit him.\n\nWhy is he my hero? Two years ago, there was a fire in a house near our street. It was late at night. The family was inside, and they could not get out. My uncle came with his team. He went into the house and carried out a small girl and her grandmother. Then he went back for their cat! The next day, the mayor gave him a medal.\n\nBut my uncle says he is not special. He says it is just his job. He also says that a hero is someone who helps others without waiting for thanks.\n\nMy uncle works two days and then rests for two days. On his days off, he visits schools and tells children how to stay safe. He says, \"Never play with matches, and always know two ways out of your home.\" I always remember these words. One day I want to be a firefighter, like him.",
    qs: [
      Q("Who is Otabek's hero?", "His uncle Rahim", ["His father", "His uncle Rahim", "His teacher"]),
      Q("In which city does his uncle work?", "Andijan", ["Andijan", "Tashkent", "Fergana"]),
      Q("What colour is the helmet?", "Yellow", ["Red", "Yellow", "Blue"]),
      TF("The uncle's truck is small.", false, "The red truck is very big."),
      Q("Who did the uncle carry out of the burning house?", "A small girl and her grandmother", ["A small girl and her grandmother", "Two old men", "A teacher and a boy"]),
      Q("He also went back into the house for their ___.", "cat"),
      Q("Who gave the uncle a medal?", "The mayor", ["The mayor", "The president", "The teacher"]),
      Q("What does the uncle say a hero is?", "Someone who helps without waiting for thanks", ["Someone who is very strong", "Someone who helps without waiting for thanks", "Someone who gets prizes"]),
      Q("The uncle works ___ days and then rests for two days.", "two"),
      TF("On his days off the uncle visits schools.", true)
    ]
  },
  {
    topic: "My daily life as a driver",
    audioText: "Hello, my name is Rustam, and I am a taxi driver in Tashkent. I am forty years old, and I have been a driver for twelve years. Let me tell you about my day.\n\nI get up at five o'clock in the morning. I drink a cup of black tea and eat a piece of bread with honey. Then I check my car. It is a small white car, and I wash it every second day. I leave home at six o'clock.\n\nIn the morning, many people go to work, so I am very busy. I take them to offices, schools and the railway station. I like to talk with my customers. Some are sleepy and quiet, but others are happy and tell me about their lives. Once a woman told me a funny story about her parrot. It could say my name!\n\nAt twelve o'clock I stop for lunch. I usually eat in a small cafe near the market. I have rice with meat and a salad. After lunch I rest for twenty minutes, and then I work again until seven o'clock in the evening.\n\nThe hardest part of my job is the traffic. In the afternoon, the streets are full of cars, and I wait a long time.\n\nI come home at eight o'clock. I play with my daughter and have dinner with my wife.",
    qs: [
      Q("How long has Rustam been a driver?", "Twelve years", ["Two years", "Twelve years", "Forty years"]),
      Q("What does Rustam eat in the morning?", "Bread with honey", ["Rice with meat", "Bread with honey", "Eggs and milk"]),
      Q("Rustam has a small ___ car.", "white"),
      Q("He leaves home at ___ o'clock.", "six"),
      TF("Rustam washes his car every day.", false, "He washes it every second day."),
      Q("What did the woman's parrot say?", "Rustam's name", ["Rustam's name", "Hello", "Goodbye"]),
      Q("Where does Rustam eat lunch?", "In a small cafe near the market", ["At home", "In a small cafe near the market", "At the railway station"]),
      Q("How long does he rest after lunch?", "Twenty minutes", ["Ten minutes", "Twenty minutes", "One hour"]),
      Q("What is the hardest part of Rustam's job?", "The traffic", ["The early morning", "The traffic", "The customers"]),
      TF("Rustam comes home at eight o'clock.", true)
    ]
  }
];
