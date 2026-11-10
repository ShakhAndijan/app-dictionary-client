const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [
{
topic: "A Job Interview",
passage: "Dilnoza had been looking for a job for almost four months when she received an email from a travel company in Samarkand. The company wanted to invite her for an interview on Thursday at ten o'clock. She had studied tourism at university, but she had never worked in an office before, so she felt both excited and nervous.\n\nThe night before the interview, Dilnoza prepared carefully. She read everything she could find about the company, which had been founded in 2009 and organised tours for visitors from Europe and Asia. She also wrote a list of questions she expected to hear, such as \"Why do you want this job?\" and \"What is your biggest weakness?\". Her older brother Rustam, who works as an engineer, listened to her answers and told her to speak more slowly. \"If you rush, people will think you are afraid,\" he said.\n\nOn Thursday morning she left home at eight because she did not want to be late. The bus was crowded, and it arrived at the office twenty minutes early. She waited in a small room with a glass of water and tried to breathe calmly. At ten exactly, a tall woman called Mrs. Karimova invited her in. Another manager, Mr. Brown, from England, was sitting next to her.\n\nThe interview lasted forty minutes. First, they asked about her education and her English. Dilnoza explained that she had lived in Tashkent for a year as an exchange student and that she had often helped foreign tourists at a local museum. Then Mr. Brown asked what she would do if a group of guests lost their luggage at the airport. Dilnoza thought for a moment and said she would stay calm, call the airline immediately, and arrange clean clothes for the guests until the bags were found. Both managers smiled at this answer.\n\nThe last question surprised her. Mrs. Karimova asked, \"If you were offered the job, when could you start?\" Dilnoza said she could begin in two weeks, because she had to finish a small course first. The managers said they would make a decision by Monday and thanked her for coming.\n\nShe left the building feeling lighter than she had expected. On Saturday, before the deadline, her phone rang. It was Mrs. Karimova, who told her that the company had chosen her from eleven candidates. The salary was not very high at the beginning, but there would be training and a chance to travel. Dilnoza accepted at once and called Rustam to thank him for his advice.",
qs: [
Q("How long had Dilnoza been looking for a job?", "Almost four months", ["Almost four months", "Two weeks", "One year"]),
Q("Where is the travel company?", "Samarkand", ["Tashkent", "Samarkand", "Bukhara"]),
Q("What did Rustam advise her to do?", "Speak more slowly", ["Speak more slowly", "Wear a suit", "Arrive late"]),
Q("How early did she arrive at the office?", "Twenty minutes", ["Ten minutes", "Twenty minutes", "One hour"]),
Q("What would she do if guests lost their luggage?", "Call the airline", ["Call the airline", "Buy new bags", "Ask the police"]),
Q("When could she start work?", "In two weeks", ["Next day", "In two weeks", "In two months"]),
TF("The company was founded in 2009.", true),
TF("Mr. Brown was a manager from Germany.", false, "He was from England."),
Q("The interview lasted forty ___.", "minutes"),
Q("The company chose her from eleven ___.", "candidates"),
]
},
{
topic: "My First Salary",
passage: "When I was nineteen, I got my first real salary. I had worked in my uncle's garage during the summers, but he only gave me a little pocket money. This time it was different. I had a proper job at a bookshop in Tashkent, and at the end of the month the manager handed me an envelope with two million som inside.\n\nI remember walking home that evening and feeling very rich. In my head I had already spent the money three times. I wanted to buy a new phone, a pair of white sneakers, and a gift for my mother, who had supported me for years. My father, Akmal, was waiting on the balcony. When I showed him the envelope, he smiled and said, \"Sit down, Bobur. Let's talk before you spend a single som.\"\n\nHe explained that money disappears quickly if you do not make a plan. He had learned this the hard way. When he received his first salary many years earlier, he had bought an expensive watch and then had to borrow money to pay for lunch for two weeks. He suggested that I divide my salary into three parts. Half would go to the things I needed, such as transport and food. One third would be for things I wanted. The rest, about two hundred thousand som, I should put into a savings account.\n\nAt first I thought this was boring. I wanted to enjoy the money immediately. But I agreed to try for one month. I bought the sneakers, which cost three hundred thousand som, and a scarf for my mother. The phone I postponed. Every evening I wrote down how much I had spent in a small notebook.\n\nAfter a month I was surprised. For the first time, I still had money at the end of the month, and I did not feel poor at all. In fact, I felt proud. Two months later I had saved enough to buy the phone without borrowing anything. My mother cried a little when I gave her the scarf, and my father simply said, \"If you had spent everything on the first day, you would still be waiting for that phone.\"\n\nToday I work in a bank, and I often tell young colleagues the same thing: plan first, spend later. It is the best lesson my first salary taught me.",
qs: [
Q("Where did Bobur work for his first real salary?", "At a bookshop", ["In a garage", "At a bookshop", "In a bank"]),
Q("How much money was in the envelope?", "Two million som", ["Two million som", "Three hundred thousand som", "Two hundred thousand som"]),
Q("What had Bobur's father bought with his first salary?", "An expensive watch", ["A phone", "An expensive watch", "A pair of sneakers"]),
Q("How much of the salary should go into savings?", "About two hundred thousand som", ["Half", "About two hundred thousand som", "Nothing"]),
Q("What did Bobur use to track his spending?", "A small notebook", ["A phone app", "A small notebook", "A bank card"]),
Q("What did Bobur buy his mother?", "A scarf", ["A watch", "A scarf", "A phone"]),
TF("Bobur's father borrowed money for lunch after his first salary.", true),
TF("Bobur bought the phone in the first month.", false, "He postponed the phone."),
Q("Bobur's father waited for him on the ___.", "balcony"),
Q("Today Bobur works in a ___.", "bank"),
]
},
{
topic: "A Small Shop Owner",
passage: "Gulnora Yusupova owns a small grocery shop near the bus station in Namangan. She opened it fifteen years ago, after she lost her job at a textile factory. At that time she had only three hundred dollars in savings, and many of her friends thought that opening a shop was a terrible idea. \"You will never compete with the big supermarkets,\" they said. She decided to prove them wrong.\n\nThe first year was very difficult. She woke up at five every morning to buy fresh bread and vegetables from the wholesale market, and she did not close the shop until ten at night. She could not afford to hire anyone, so her husband and her teenage son helped her on weekends. Often she earned only enough to pay the rent and buy new goods for the next day. More than once she thought about giving up.\n\nThe turning point came when she noticed what customers really wanted. The big supermarkets were far away, and elderly people did not like walking so long. Gulnora started to deliver groceries for free to neighbours who could not leave their homes. She also allowed regular customers to buy on credit and pay at the end of the month. She wrote every name in a thick green notebook, and she never forgot who owed her money. Because she trusted people, people trusted her.\n\nSlowly, the shop became popular. After four years she was able to rent the empty room next door and double the size of the shop. She added a small corner where customers could drink tea and read the newspaper. Many people said that this corner made her shop feel like a second home. Today she employs five workers, and her monthly sales are about ten times higher than in the first year.\n\nWhen young people ask her for advice, Gulnora always gives the same three rules. First, know your customers by name. Second, never sell old products, even if you lose a little money. Third, keep learning. Last winter she attended a course on online marketing, and now she takes orders by phone and through a messaging app.\n\n\"Big shops have more goods,\" she says, \"but small shops have more heart.\" Her customers clearly agree, because the shop is full every evening.",
qs: [
Q("Why did Gulnora open the shop?", "She lost her factory job", ["She lost her factory job", "Her husband asked her", "She inherited it"]),
Q("How much money did she have when she started?", "Three hundred dollars", ["Three hundred dollars", "Ten thousand dollars", "Nothing"]),
Q("What time did she wake up in the first year?", "At five", ["At five", "At seven", "At nine"]),
Q("How did she help elderly customers?", "She delivered groceries for free", ["She lowered prices", "She delivered groceries for free", "She opened earlier"]),
Q("What did she add after renting the next room?", "A tea corner", ["A tea corner", "A bakery", "A parking space"]),
Q("What did she learn last winter?", "Online marketing", ["Accounting", "Online marketing", "English"]),
TF("Gulnora's friends believed her idea was excellent.", false, "They thought it was a terrible idea."),
TF("She writes the names of customers who owe money in a notebook.", true),
Q("Today she employs five ___.", "workers"),
Q("She wrote every name in a thick green ___.", "notebook"),
]
},
{
topic: "Working From Home",
passage: "Two years ago, Sanjar worked in a big software company in the centre of Tashkent. Every morning he spent almost two hours on crowded buses and in traffic jams. By the time he reached his desk, he was already tired. When the company announced that employees could work from home three days a week, he was delighted.\n\nAt first, everything seemed perfect. He did not need to wake up at six, he could have breakfast with his wife, and he saved about two hundred thousand som a month on transport. However, after a few weeks he noticed some problems. His desk was in the living room, where his children played and his wife watched television. He found it hard to concentrate, and he often worked until late at night because the line between work and free time had disappeared.\n\nHe also missed his colleagues. In the office, he used to talk to them at lunch about football, films and new ideas. At home, he only saw them as small faces on a computer screen during meetings. One day he realised that he had not spoken to anyone outside his family for three days.\n\nSanjar decided to change his routine. First, he rented a small room near his flat, which he used as a quiet office. It cost him a hundred and fifty thousand som per month, but the result was worth it. Second, he set clear working hours, from nine to six, and he turned off his laptop at six sharp. Third, he arranged a weekly lunch with two friends from the company, so that he could keep in touch with real people.\n\nThe new routine worked well. His boss noticed that he finished projects faster, and last spring Sanjar was promoted to team leader. He now advises other employees who are struggling with remote work. His advice is simple: have a separate place for work, keep fixed hours, and do not forget to meet people face to face.\n\n\"Working from home is a great opportunity,\" he says, \"but only if you manage it, and do not let it manage you.\" His company is now thinking of offering similar rooms to all its staff.",
qs: [
Q("How long did Sanjar's journey to work take?", "Almost two hours", ["Twenty minutes", "Almost two hours", "Five hours"]),
Q("How many days a week could employees work from home?", "Three", ["Two", "Three", "Five"]),
Q("What was the first problem Sanjar noticed at home?", "It was hard to concentrate", ["It was hard to concentrate", "The internet was slow", "He had no laptop"]),
Q("What did he miss most?", "His colleagues", ["His colleagues", "His boss", "The bus"]),
Q("How much did he pay for the small room?", "One hundred and fifty thousand som", ["Two hundred thousand som", "One hundred and fifty thousand som", "Nothing"]),
Q("What happened last spring?", "He became team leader", ["He changed jobs", "He became team leader", "He moved to a new flat"]),
TF("Sanjar's colleagues rent the room together with him.", false, "He rented it alone; he had lunch weekly with two friends."),
TF("He turns off his laptop at six.", true),
Q("He used to talk to colleagues about football, films and new ___.", "ideas"),
Q("He set clear working ___.", "hours"),
]
},
{
topic: "Learning to Save Money",
passage: "Madina is twenty-six years old and works as a nurse in a hospital in Bukhara. For years she had a problem that many young people have: no matter how much she earned, she never had anything left at the end of the month. Her salary was not small, but she spent it on coffee, taxis, clothes and online orders. When her grandmother became ill last year and the family needed money for medicine, Madina realised that she had nothing to offer.\n\nThat experience changed her. She decided to take saving seriously and began by looking carefully at her bank statements. She was shocked to discover that she had spent almost five hundred thousand som on taxis in a single month, even though the hospital was only fifteen minutes from her flat by bus. She had also bought three jackets that she hardly wore.\n\nMadina created a simple budget. She wrote down her fixed costs, such as rent, electricity and phone, which together came to about forty percent of her income. Then she decided to move ten percent of her salary into a separate account on the very day she was paid. If the money was not in her main account, she could not spend it. She also deleted two shopping apps from her phone, which made impulse buying much harder.\n\nThe first months were not easy. Her friends invited her to cafes and she often had to say no. Sometimes she felt lonely and wondered if saving was worth it. But she found cheaper ways to meet them, such as cooking dinner at home or walking in the park on Sundays. Gradually she began to enjoy these evenings more than expensive restaurants.\n\nAfter ten months, Madina had saved enough to cover three months of living costs. She felt much calmer, because she knew that she could handle an emergency. This spring she even used part of her savings to take a professional course in intensive care, which will help her earn a higher salary.\n\n\"Saving is not about being mean,\" she explains. \"It is about buying yourself freedom.\" She now teaches a small group of younger nurses how to make a budget, and she hopes that none of them will have to learn the lesson the hard way.",
qs: [
Q("What is Madina's job?", "Nurse", ["Teacher", "Nurse", "Banker"]),
Q("Why did she realise she needed savings?", "Her grandmother became ill", ["Her grandmother became ill", "She lost her job", "She wanted to travel"]),
Q("How much did she spend on taxis in one month?", "Almost five hundred thousand som", ["Almost five hundred thousand som", "Fifty thousand som", "Two million som"]),
Q("What percentage of her income did fixed costs take?", "About forty percent", ["About ten percent", "About forty percent", "About seventy percent"]),
Q("What did she do to make impulse buying harder?", "Deleted shopping apps", ["Cut up her bank card", "Deleted shopping apps", "Stopped using her phone"]),
Q("What did she use some savings for this spring?", "A professional course", ["A holiday", "A professional course", "A new flat"]),
TF("Madina moved ten percent of her salary to a separate account.", true),
TF("Her hospital was an hour away from her flat by bus.", false, "It was fifteen minutes away."),
Q("She had bought three ___ that she hardly wore.", "jackets"),
Q("Her savings could cover three ___ of living costs.", "months"),
]
},
{
topic: "Opening a Bakery",
passage: "Everyone in the neighbourhood agreed that Azamat made the best bread in Khiva. For years he had baked at home for his family and friends, and people often told him he should sell it. His wife, Feruza, was the first to take the idea seriously. \"If you do not try now,\" she said, \"you will regret it when you are old.\"\n\nThe problem was money. A small bakery needed an oven, tables, flour, and rent for a place on a busy street. Azamat calculated that he needed about forty million som. He had saved fifteen million, and his brother promised to lend him another ten. For the rest, he went to a bank and asked for a loan. The bank officer, a serious man with round glasses, asked to see a business plan. Azamat had never written one, so he asked a former teacher to help him.\n\nThe plan took three weeks to prepare. It included the cost of ingredients, the expected number of customers, and a list of competitors. Azamat discovered that there were only two other bakeries within two kilometres, and neither of them opened before eight. He decided to open at five-thirty so that workers could buy fresh bread on their way to the factory. This small difference, he believed, would bring him a lot of customers.\n\nThe bank approved the loan, and in March the bakery opened. On the first day Azamat prepared two hundred loaves, and by nine o'clock they were all sold. He was so happy that he almost forgot to eat. However, in the second month a problem appeared: the price of flour rose by twenty percent. He could not raise his prices too much without losing customers, so he started buying flour directly from a farmer, which saved him money.\n\nToday the bakery employs four people and produces about six hundred loaves a day. Azamat has also added sweet pastries, which are especially popular with children. His next plan is to open a second branch near the university.\n\n\"The most important thing,\" he says, \"is to start. A good idea is only a dream until you open the door and light the oven.\"",
qs: [
Q("In which city does Azamat live?", "Khiva", ["Bukhara", "Khiva", "Fergana"]),
Q("Who first encouraged him to open a bakery?", "His wife", ["His wife", "His brother", "His teacher"]),
Q("How much money did he need in total?", "About forty million som", ["About fifteen million som", "About forty million som", "About ten million som"]),
Q("Who helped him with the business plan?", "A former teacher", ["A bank officer", "A former teacher", "His brother"]),
Q("At what time did he decide to open?", "Five-thirty", ["Five-thirty", "Eight", "Seven"]),
Q("How did he solve the problem of expensive flour?", "He bought it from a farmer", ["He raised prices a lot", "He bought it from a farmer", "He closed for a month"]),
TF("Both competitors opened before eight o'clock.", false, "Neither opened before eight."),
TF("Azamat plans to open a second branch near the university.", true),
Q("On the first day he baked two hundred ___.", "loaves"),
Q("The price of flour rose by twenty ___.", "percent"),
]
},
{
topic: "Changing Careers at Forty",
passage: "For fifteen years, Olim worked as an accountant in a construction company in Fergana. He was good at his job, and his boss trusted him completely. However, every Sunday evening he felt a heavy feeling in his stomach, because he knew that he would have to return to the same grey office the next morning. He had never really wanted to be an accountant. He had chosen the profession because his parents believed it was safe.\n\nOn his fortieth birthday, his daughter Laylo gave him a small gift: a book about cooking. Olim had always enjoyed cooking for the family, and when he opened the book, he suddenly asked himself, \"If I could do anything, what would I choose?\" The answer came immediately. He wanted to teach people how to cook.\n\nHe did not leave his job at once. That would have been foolish, because he had a mortgage and two children at school. Instead, he started a cooking class on Saturday mornings in a rented kitchen. At first only three students came, all of them his neighbours. But he put short videos of his lessons on the internet, and within a few months, there were twenty students, some of whom travelled from other cities.\n\nFor a year Olim did both jobs. He slept very little, and his wife worried about his health. Nevertheless, he did not complain, because for the first time in years he was looking forward to the weekend. When his income from the classes became almost equal to his salary, he finally decided to resign. His boss was surprised and a little sad, but he wished him luck.\n\nThe beginning was risky. In the first three months of full-time teaching, Olim earned less than he had earned as an accountant. Yet he did not regret his choice. He opened a small cooking school with two assistants, and today it has more than a hundred students every month.\n\n\"People told me that forty was too late to change,\" he says. \"But if I had waited until sixty, I would have lost twenty more years of happiness.\" He still does his own accounts, which he says is the only useful thing he kept from his old career.",
qs: [
Q("How long did Olim work as an accountant?", "Fifteen years", ["Five years", "Fifteen years", "Forty years"]),
Q("Why had he chosen accounting?", "His parents thought it was safe", ["He loved numbers", "His parents thought it was safe", "It paid the most"]),
Q("What gift did his daughter give him?", "A cooking book", ["A cooking book", "A new laptop", "A cooking course"]),
Q("When did the cooking classes take place?", "On Saturday mornings", ["On Saturday mornings", "On weekday evenings", "On Sunday nights"]),
Q("How did students from other cities find him?", "Through videos on the internet", ["Through a newspaper", "Through videos on the internet", "Through his boss"]),
Q("When did he decide to resign?", "When his class income nearly equalled his salary", ["After his boss's advice", "When his class income nearly equalled his salary", "On his fortieth birthday"]),
TF("Olim left his job immediately after his birthday.", false, "He did both jobs for a year."),
TF("He earned less during the first three months of full-time teaching.", true),
Q("Today his school has more than a hundred ___ every month.", "students"),
Q("He had a mortgage and two children at ___.", "school"),
]
},
{
topic: "Selling Online",
passage: "Kamola was twenty-two and still a student of design when she began to sell things on the internet. It started by accident. She had knitted a wool hat for herself, and a classmate asked where she had bought it. When Kamola said that she had made it, the classmate immediately offered to pay twenty thousand som for one just like it.\n\nThat evening Kamola took photographs of three hats and posted them on a social media page called \"Warm Heads\". She did not expect much, but by morning she had received seven messages. By the end of the week, she had sold fourteen hats and could not keep up with the orders. She spent every evening knitting until midnight, and she learned an important lesson: demand can be bigger than your ability to produce.\n\nKamola decided to take the business more seriously. She bought wool in larger quantities, which made each hat cheaper to produce. She also asked her grandmother, who was a skilled knitter, to join her. In return, Kamola gave her a third of the profit. Together they could make about thirty hats a week.\n\nThe next challenge was delivery. At the beginning, Kamola had taken parcels to the post office herself, and this wasted a lot of time. She found a courier company that collected the parcels from her door for a small fee. Some customers complained that the hats arrived late, so she began to write the exact delivery date in each message, and the complaints stopped.\n\nPhotographs also made a big difference. When she started to take pictures in daylight, near a window, sales increased by almost half. She also learned to write honest descriptions. If a hat was a little smaller than usual, she said so, because she preferred a returned order to an unhappy customer.\n\nBy the end of the year, Kamola had more than two thousand followers and a monthly income that was higher than her mother's salary. After graduation, she plans to expand her shop to scarves and gloves. \"My teachers say design needs a client,\" she says with a laugh. \"I found mine before I finished my degree.\"",
qs: [
Q("What was Kamola studying?", "Design", ["Business", "Design", "Languages"]),
Q("How much did the classmate offer for a hat?", "Twenty thousand som", ["Twenty thousand som", "Fourteen thousand som", "Two thousand som"]),
Q("What was the name of her social media page?", "Warm Heads", ["Warm Heads", "Knit Fashion", "Soft Wool"]),
Q("What share of the profit did her grandmother get?", "A third", ["Half", "A third", "A quarter"]),
Q("How did she stop complaints about late parcels?", "She wrote the exact delivery date", ["She changed her prices", "She wrote the exact delivery date", "She stopped using couriers"]),
Q("What increased sales by almost half?", "Daylight photographs", ["Daylight photographs", "Lower prices", "A bigger page"]),
TF("Kamola sold fourteen hats in the first week.", true),
TF("She prefers to hide small problems in her descriptions.", false, "She writes honest descriptions."),
Q("Together they could make about thirty hats a ___.", "week"),
Q("After graduation she wants to sell scarves and ___.", "gloves"),
]
},
{
topic: "A Difficult Colleague",
passage: "Shirin had been working in the marketing department of a furniture company for only six months when she met the biggest challenge of her career. His name was Mr. Aliyev, a senior manager who had worked in the company for twenty years. He was clever and experienced, but he had a habit of criticising other people in front of the whole team. More than once he told Shirin that her ideas were \"childish\".\n\nAt first, she tried to ignore him. She thought that if she worked harder, he would eventually respect her. But the situation got worse. During an important meeting in March, he interrupted her presentation and said that the figures were wrong. Shirin was embarrassed, and she almost cried in front of her colleagues. Later she discovered that her figures had been correct; Mr. Aliyev had simply used an old file.\n\nThat night she could not sleep. She considered resigning, but she needed the job and she liked the other people in her department. Instead, she asked her friend Jamshid, who had worked in human resources, for advice. Jamshid told her not to answer anger with anger. He suggested that she should ask Mr. Aliyev for a private conversation and speak calmly about specific problems, not about his character.\n\nThe next Monday, Shirin knocked on his door at four o'clock. She said, \"I respect your experience, and I would like to learn from you. But when you criticise me in public, I cannot work well. Could we discuss my reports privately before the meetings?\" Mr. Aliyev looked surprised. For a moment he said nothing, and then he admitted that he was under a lot of pressure because the company had lost an important customer.\n\nTheir relationship did not change overnight, but it improved. Mr. Aliyev started to check her work in his office, and he even praised her campaign for a new kitchen collection, which increased sales by fifteen percent. In June he recommended her for a small promotion.\n\nShirin often says that this experience taught her two things. First, people who behave badly are sometimes afraid. Second, it is much better to speak honestly and politely than to complain behind someone's back. She now helps new employees who have similar difficulties.",
qs: [
Q("In which department does Shirin work?", "Marketing", ["Marketing", "Sales", "Human resources"]),
Q("How long had Mr. Aliyev worked in the company?", "Twenty years", ["Six months", "Twenty years", "Two years"]),
Q("What was wrong during the March meeting?", "He used an old file", ["She forgot her laptop", "He used an old file", "Her figures were wrong"]),
Q("Who advised Shirin?", "Jamshid", ["Jamshid", "Her mother", "Her boss"]),
Q("What time did she visit his office?", "At four o'clock", ["At nine o'clock", "At four o'clock", "At noon"]),
Q("Why was Mr. Aliyev under pressure?", "The company lost a customer", ["He was ill", "The company lost a customer", "He wanted her job"]),
TF("Shirin resigned after the meeting in March.", false, "She stayed and talked to him."),
TF("Her campaign increased sales by fifteen percent.", true),
Q("She asked to discuss her reports ___.", "privately"),
Q("In June he recommended her for a small ___.", "promotion"),
]
},
{
topic: "Getting a Bank Loan",
passage: "Farhod and his wife Nigora had wanted to buy their own flat since the day they got married. For five years they rented a small apartment on the outskirts of Andijan, and every month a large part of their income went to the owner. \"We are paying for someone else's dream,\" Farhod often said. They tried to save money, but flat prices rose faster than their savings.\n\nIn the end, they decided to apply for a bank loan. The flat they liked cost three hundred and sixty million som. They had saved eighty million, which was more than twenty percent of the price, and the bank said that this was the minimum for a mortgage. The remaining amount would be paid back over fifteen years.\n\nBefore going to the bank, Farhod spent a week reading about different offers. He found that three banks had different interest rates, from nineteen to twenty-three percent. He also discovered that some banks charged extra fees which were not mentioned in the advertisements. He wrote everything down in a table and compared the total cost of each offer. \"The lowest monthly payment is not always the cheapest loan,\" he explained to his wife.\n\nThey chose a state bank with an interest rate of nineteen percent. The application was long and tiring. They had to bring documents about their jobs, their income, and even their rental agreement. A bank officer called Mrs. Sultanova checked everything carefully and asked them several times whether they were sure that they could afford the monthly payment. Nigora admitted that she was a little frightened.\n\nAfter three weeks, the bank approved the loan. On the day of signing, Farhod read each page slowly, even though the officer looked impatient. He wanted to be sure that he understood every condition, especially the rules about late payments.\n\nThey moved into their flat in October. It is not large, only two rooms and a kitchen, but it belongs to them, or at least it will in fifteen years. Every month they pay the instalment on the first day, and they have already decided not to buy anything unnecessary until the debt becomes smaller. \"A loan is a promise,\" says Farhod. \"You must keep it.\"",
qs: [
Q("Where did Farhod and Nigora rent an apartment?", "Andijan", ["Andijan", "Namangan", "Tashkent"]),
Q("How much did the flat cost?", "Three hundred and sixty million som", ["Eighty million som", "Three hundred and sixty million som", "Fifteen million som"]),
Q("How long would they pay back the loan?", "Fifteen years", ["Five years", "Ten years", "Fifteen years"]),
Q("What did Farhod discover about some banks?", "They charged extra fees", ["They charged extra fees", "They refused young people", "They had no offers"]),
Q("Which interest rate did they choose?", "Nineteen percent", ["Nineteen percent", "Twenty-three percent", "Twenty percent"]),
Q("Who checked their documents at the bank?", "Mrs. Sultanova", ["Mrs. Sultanova", "Nigora's mother", "Mr. Karimov"]),
TF("The couple saved more than twenty percent of the flat's price.", true),
TF("The bank approved the loan after one week.", false, "It took three weeks."),
Q("The flat has two rooms and a ___.", "kitchen"),
Q("They pay the instalment on the first ___ of the month.", "day"),
]
},
{
topic: "A Freelance Translator",
passage: "Aziza used to work in an office, but three years ago she became a freelance translator. She translates documents from English and Russian into Uzbek, mostly for law firms and small businesses. Many people imagine that working for yourself means more freedom and less stress. Aziza says the truth is more complicated.\n\nThe biggest advantage, she says, is flexibility. She can start at seven in the morning, when her mind is fresh, and finish at two. In the afternoon she picks up her son from school and takes him to swimming lessons. When she worked in an office, she often saw her son for only an hour before bedtime. For her, this change alone was worth the risk.\n\nHowever, there are disadvantages. A freelancer has no fixed salary. In some months Aziza earns eight million som, and in others only three. She learned this lesson in her first winter, when clients disappeared and she could hardly pay her rent. Since then she has kept an emergency fund equal to four months of expenses. She also sends a polite reminder to clients who do not pay on time, because sometimes people simply forget.\n\nAnother difficulty is finding new customers. At the beginning, she sent more than a hundred emails and received only five answers. She improved her profile on a professional website and asked satisfied clients to write short reviews. Soon, work started to come to her instead. Last year she translated a book about medicine, which took almost five months and brought her the highest payment of her career.\n\nAziza also had to learn discipline. At home there are many distractions, and nobody checks whether she is working. She uses a simple rule: she does not open social media before she has translated at least five pages. She also takes a short walk every two hours, which helps her concentrate.\n\nWhen friends ask whether they should become freelancers, she answers carefully. \"It is wonderful if you can plan your money and your time,\" she says. \"If you cannot, you should stay in an office until you learn.\"",
qs: [
Q("What does Aziza translate for?", "Law firms and small businesses", ["Schools", "Law firms and small businesses", "Hospitals"]),
Q("What time does she start work?", "At seven in the morning", ["At seven in the morning", "At noon", "At ten at night"]),
Q("What does she do in the afternoon?", "Takes her son to swimming lessons", ["Takes her son to swimming lessons", "Meets new clients", "Sleeps"]),
Q("How large is her emergency fund?", "Four months of expenses", ["One month of expenses", "Four months of expenses", "A year of expenses"]),
Q("How many answers did her first hundred emails receive?", "Five", ["Five", "Fifty", "None"]),
Q("What was her biggest project?", "A book about medicine", ["A legal contract", "A book about medicine", "A film script"]),
TF("Aziza earns the same amount every month.", false, "Her income changes from three to eight million som."),
TF("She takes a short walk every two hours.", true),
Q("Her profile is on a professional ___.", "website"),
Q("She does not open social media before translating five ___.", "pages"),
]
},
{
topic: "A Day at the Market",
passage: "The bazaar in Margilan opens before sunrise, and by six o'clock Rahim has already arranged his stall. He sells dried fruit and nuts: apricots, raisins, almonds and walnuts. He inherited the stall from his father, who had stood in the same place for thirty-five years. Rahim started to help him when he was only eleven, carrying heavy bags and weighing goods on an old metal scale.\n\nAccording to Rahim, selling at a market is a skill that cannot be learned from books. The first rule is to be polite to everyone, even those who do not buy anything. A customer who leaves today may return tomorrow with five relatives. The second rule is to let people taste the goods. When a woman tries a sweet apricot, she rarely walks away without buying a kilo. The third rule is to remember prices. Wholesale prices change almost every week, and a trader who forgets this will soon lose money.\n\nA normal day is long. In the morning, Rahim sells mainly to housewives and restaurant owners. Around noon, when the sun is strong, the market becomes quieter, and he takes a short rest in the shade and drinks green tea with the neighbouring traders. In the afternoon, tourists appear, and he sells small packages as gifts. He has learned a few words in English, French and Korean, which, he says, are worth more than any advertisement.\n\nThere are also difficult periods. Last summer a heavy rainstorm damaged part of his goods, and he lost nearly two million som. In winter, there are fewer customers because people travel less. To avoid risks, Rahim now sells through a messaging app as well, and he delivers orders to nearby towns twice a week.\n\nAt six in the evening he closes the stall and counts the money carefully. He writes the total in a small book, as his father did. Then he walks home, which takes ten minutes, and eats dinner with his three children.\n\n\"The market is not just a place for business,\" Rahim says. \"It is where I learned how to talk to people, and that is more valuable than money.\"",
qs: [
Q("In which town is the bazaar?", "Margilan", ["Margilan", "Khiva", "Termez"]),
Q("What does Rahim sell?", "Dried fruit and nuts", ["Clothes", "Dried fruit and nuts", "Vegetables"]),
Q("How long had his father worked at the stall?", "Thirty-five years", ["Eleven years", "Thirty-five years", "Fifty years"]),
Q("What is the second rule of selling?", "Let people taste the goods", ["Be polite", "Let people taste the goods", "Remember prices"]),
Q("What happens around noon?", "The market becomes quieter", ["The market closes", "The market becomes quieter", "Tourists arrive"]),
Q("How much did he lose in the summer rainstorm?", "Nearly two million som", ["Nearly two million som", "Ten thousand som", "Twenty million som"]),
TF("Rahim began helping his father at the age of eleven.", true),
TF("Rahim only sells goods at the market stall.", false, "He also sells through a messaging app and delivers orders."),
Q("In the afternoon he sells small packages as ___.", "gifts"),
Q("He eats dinner with his three ___.", "children"),
]
},
{
topic: "A Summer Internship",
passage: "Last summer, Jasur was accepted for a two-month internship at an advertising agency in Tashkent. He was a second-year student of economics, and he had been applying for internships since January. He had sent forty applications and received only two invitations, so when the agency called him, he nearly jumped with joy.\n\nThe internship was unpaid, but the agency offered lunch and a monthly transport card. On the first day, a young manager called Dildora showed him around the office and introduced him to the team of twelve people. Jasur expected to make coffee and copy documents, which was what his cousin had done during his own internship. To his surprise, Dildora gave him a real task: to collect information about the habits of young customers for a new campaign for a juice company.\n\nJasur spent the first week reading reports and preparing a short survey. He asked eighty students from his university to answer the questions, and he discovered that most of them preferred drinks with less sugar. He presented the results at a team meeting, and his hands were shaking. Fortunately, nobody laughed. The director, Mr. Tursunov, said that the information was useful and asked a few difficult questions, which Jasur answered honestly, even when he did not know the answer.\n\nOf course, he also made mistakes. In the third week he sent an email to the wrong client, and the agency had to apologise. Jasur was afraid that he would be dismissed. Instead, Dildora told him that everybody makes mistakes, and showed him a simple rule: check the name of the receiver twice before pressing \"send\".\n\nAt the end of the summer, the agency organised a small farewell party. Mr. Tursunov told Jasur that the juice company had used his idea of a low-sugar drink in its final campaign. He also offered him a part-time job for the autumn, with a real salary. Jasur accepted immediately.\n\nLooking back, he says that the internship taught him more than a whole year at university. \"At lectures, I learned theory,\" he explains. \"At the agency, I learned how people actually work together.\"",
qs: [
Q("How many applications had Jasur sent?", "Forty", ["Two", "Forty", "Eighty"]),
Q("What did the agency offer besides the experience?", "Lunch and a transport card", ["A salary", "Lunch and a transport card", "A computer"]),
Q("What was Jasur's first real task?", "Collecting information about young customers", ["Making coffee", "Collecting information about young customers", "Copying documents"]),
Q("How many students answered his survey?", "Eighty", ["Twelve", "Eighty", "Forty"]),
Q("What mistake did he make in the third week?", "He emailed the wrong client", ["He lost a file", "He emailed the wrong client", "He arrived late"]),
Q("What did the agency offer him at the end?", "A part-time job", ["A full-time job", "A part-time job", "A free course"]),
TF("The internship was paid.", false, "It was unpaid."),
TF("Mr. Tursunov is the director of the agency.", true),
Q("Most students preferred drinks with less ___.", "sugar"),
Q("Dildora is a young ___.", "manager"),
]
},
{
topic: "Driving for a Living",
passage: "Bahrom has been a taxi driver in Tashkent for eleven years. Before that he worked as a mechanic, but the salary was low, and when his second daughter was born, he needed more income. A friend lent him a car, and he started to drive passengers. Today he has his own car, a white sedan which he looks after as carefully as a member of the family.\n\nA typical working day for Bahrom begins at six in the morning. He checks the oil and the tyres, washes the windows, and drinks a cup of strong tea before he leaves. The first customers are usually people going to the airport or the railway station. Between nine and eleven the roads are full of traffic, and he sometimes spends half an hour in one place. He says that patience is the most important quality of a driver, more important than speed.\n\nSince the arrival of ride-hailing apps, the work has changed a lot. Passengers can see the price in advance and give the driver a rating after the trip. Bahrom admits that at first he did not like this. The company takes about twenty percent of each fare, and drivers can be punished for a bad rating. However, he has also noticed advantages. He no longer waits for hours at the station, and he receives orders even at night.\n\nHe has met many interesting people in his car: a famous singer, a foreign doctor, and once a young couple who were hurrying to their own wedding. Bahrom drove so fast that he received a fine, but the couple arrived on time and invited him to the party. \"That was the best fine I ever paid,\" he jokes.\n\nThe job is not easy. He works about twelve hours a day, six days a week, and his back often hurts. He also worries about the rising price of petrol. His dream is to save enough money to open a small car service with his brother, where he can use his old skills as a mechanic.\n\nNevertheless, he does not complain. \"A driver sees the whole city every day,\" he says. \"And every passenger has a story. I am paid to listen, too.\"",
qs: [
Q("How long has Bahrom been a taxi driver?", "Eleven years", ["Two years", "Eleven years", "Twenty years"]),
Q("What was his previous job?", "Mechanic", ["Teacher", "Mechanic", "Cook"]),
Q("What time does his day begin?", "At six in the morning", ["At six in the morning", "At nine", "At noon"]),
Q("What percentage of each fare does the app company take?", "About twenty percent", ["About ten percent", "About twenty percent", "About fifty percent"]),
Q("Why did he receive a fine?", "He drove too fast to a wedding", ["He parked illegally", "He drove too fast to a wedding", "He had no licence"]),
Q("What is his dream?", "To open a small car service", ["To buy a bus", "To open a small car service", "To become a singer"]),
TF("Bahrom works twelve hours a day, six days a week.", true),
TF("Bahrom always disliked the ride-hailing apps and sees no advantage.", false, "He sees advantages, such as not waiting for hours."),
Q("His car is a white ___.", "sedan"),
Q("He worries about the rising price of ___.", "petrol"),
]
},
{
topic: "A Family Business Passes On",
passage: "For forty years, Mr. Hamidov ran a small furniture workshop in Kokand. He had started it with two friends in 1985, and it slowly grew into a business with eighteen workers. The tables and chairs from his workshop could be found in schools, offices, and in thousands of homes across the country. Now he was sixty-eight, and it was time to decide who would continue the work.\n\nHe had two children. His son, Ilhom, lived in Dubai, where he worked as a manager in a hotel. His daughter, Mohira, had studied design and had worked in the workshop during her university holidays. Mr. Hamidov secretly hoped that she would take over, but he did not want to force anyone.\n\nOne evening in January, the whole family gathered for dinner. Mr. Hamidov explained that his health was no longer good and that he wanted to retire by the end of the year. To his surprise, Mohira had already prepared a plan. She said that she loved the workshop, but she believed that it needed to change. The old catalogue was out of date, the workshop had no website, and young customers were buying cheap furniture from abroad.\n\nMr. Hamidov was worried. He had always done things in the traditional way, and he feared that changes might ruin the quality. Mohira promised that the quality would not change. She suggested that they should keep the best traditional designs and add a modern line made from the same wood. She also wanted to sell through the internet and to offer delivery to other cities.\n\nThey agreed on a trial period of six months, during which Mr. Hamidov would remain as an adviser. The new collection was ready in June, and the first online orders came within a week. By September, sales had risen by thirty percent, and Mohira had hired three new workers. Her father, who had been the most doubtful, was now the first to show customers the new chairs.\n\nIn December, the family organised a small ceremony in the workshop. Mr. Hamidov gave his daughter the keys and said, \"I built the workshop with my hands. You will build its future with your head.\" Ilhom, who had flown in from Dubai, promised to help with advertising abroad.",
qs: [
Q("In which city was the workshop?", "Kokand", ["Kokand", "Samarkand", "Nukus"]),
Q("How many workers did the workshop have?", "Eighteen", ["Two", "Eighteen", "Thousand"]),
Q("What was Ilhom's job in Dubai?", "Hotel manager", ["Engineer", "Hotel manager", "Designer"]),
Q("What problem did Mohira see?", "Young customers bought cheap furniture from abroad", ["The wood was too expensive", "Young customers bought cheap furniture from abroad", "The workers were lazy"]),
Q("How long was the trial period?", "Six months", ["Six months", "One year", "One month"]),
Q("By how much did sales rise by September?", "Thirty percent", ["Ten percent", "Thirty percent", "Fifty percent"]),
TF("Mr. Hamidov forced his daughter to take over the workshop.", false, "He did not want to force anyone."),
TF("The family held a ceremony in December.", true),
Q("Mohira had studied ___.", "design"),
Q("Mr. Hamidov stayed as an ___ during the trial period.", "adviser"),
]
}
];
