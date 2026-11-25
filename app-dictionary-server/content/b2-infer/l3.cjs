const Q = (prompt, a, b, c, explain) => ({ prompt, answer: a, options: [a, b, c], explain });
module.exports = {
  "A tech support call about a broken connection": [
    Q("Why would buying a new router probably not have helped Dilnoza?", "The fault seems to be outside her home", "Routers are no longer sold", "Her router had never been switched on", "The orange light points to a problem outside the house, and a fault was found on the street cable."),
    Q("What can we infer about Dilnoza's trust in the company?", "Past experiences have made her cautious", "She has always been completely satisfied", "She has never used the company before", "She will believe the repair when she sees it because they let her down twice."),
  ],
  "A radio report on a new telescope": [
    Q("Why is using many small mirrors an advantage?", "One can be replaced without halting the whole telescope", "It makes the telescope the biggest in the world", "Small mirrors never break", "A damaged mirror can be replaced in a week without stopping observations."),
    Q("Why might the villagers still be worried?", "They have not yet seen proof that their water is safe", "The observatory has closed their old well", "The telescope blocks the sunlight", "A farmer wants to see the well working first."),
  ],
  "A talk on passwords and online safety": [
    Q("Why is reusing one password especially dangerous?", "One leak can open many different accounts", "Reused passwords are shorter", "Banks refuse repeated passwords", "Criminals tried the leaked details on banks and social networks."),
    Q("Why are hurried people more likely to lose money?", "They act on alarming messages without checking", "They type their passwords too slowly", "They use longer passwords", "He says to stop when a message causes panic."),
  ],
  "A guided tour of a research laboratory": [
    Q("Why might the freezer have an alarm for an open door?", "The samples could be damaged if the room warms up", "Visitors might steal the equipment", "The alarm saves electricity for the robots", "Samples must stay at minus eighty degrees."),
    Q("What does 'a seed is a tiny promise' suggest?", "Each seed holds the possibility of future plants", "Scientists promise to sell the seeds", "Seeds are very expensive to keep", "He hopes they may help farmers one day."),
  ],
  "An interview with a bridge engineer": [
    Q("Why might Jasur wait for the first winter before relaxing?", "He wants to see how the bridge copes with real conditions", "The bridge will be closed until then", "His holiday starts in spring", "He says he will only relax once the first winter has passed."),
    Q("What does the busy path on sunny Saturdays suggest?", "His idea proved useful to people", "The road is closed at weekends", "The committee was right to call it a waste", "The path he argued for is busier than the road."),
  ],
  "A science museum audio guide": [
    Q("Why are Hartley's notebooks particularly impressive?", "He produced careful work without formal schooling", "They were written by a famous professor", "They were printed in the museum shop", "He never went to school yet made careful drawings."),
    Q("Why might the moon rock be shown for only part of the year?", "It is too valuable to display all the time", "It is too heavy to keep inside", "It belongs to the café", "The guide says its value limits the display."),
  ],
  "A podcast about artificial intelligence in medicine": [
    Q("Why should doctors still check the program's results?", "It can make mistakes that a person would never make", "It disagrees with doctors in most cases", "It cannot look at chest pictures", "It confused jewellery with a tumour."),
    Q("Why might Lena test the programs in rural clinics?", "Places with few specialists could benefit most", "City hospitals have banned the programs", "Rural patients refuse human doctors", "There are few specialists, so help there would show its worth."),
  ],
  "A conversation in a phone shop": [
    Q("Why does Bobur accept the case and protector in the end?", "A possible repair would be far more expensive", "They are free with the phone", "The shop will not sell the phone without them", "A repair would cost more than ten times as much."),
    Q("What does Malika's answer about storage show about her?", "She gives realistic advice about what the customer needs", "She wants to sell the cheapest phone only", "She does not know the models", "She says honestly that 64 GB would fill within a year."),
  ],
  "A university lecture on batteries": [
    Q("Why should a phone not be left in a hot car?", "Heat can permanently reduce the battery's capacity", "The phone will charge too quickly", "Lithium turns into nickel", "Heat is the real enemy of batteries."),
    Q("What can we infer about the lecturer's doubts over solid-state batteries?", "Long-promised technology should be judged by real products", "He believes such batteries are impossible", "He already owns a car that uses one", "He will believe it when he can buy a car with one."),
  ],
  "An app launch announcement": [
    Q("Why was an official timetable not enough for the founders?", "Buses often did not arrive at the stated times", "There were no timetables at all", "Drivers refused to follow any route", "Buses are often late."),
    Q("Why might the company charge a small subscription?", "To pay for improvements without showing adverts", "To stop people using the free map", "Because drivers demand payment for trackers", "A small income lets them keep improving without advertisements."),
  ],
  "A news report about a drone delivery trial": [
    Q("Why are drones especially useful for this pharmacy?", "Some patients are far away and hard to reach by road", "The village has no medicines", "Vans are not allowed in Wales", "Farms are difficult to reach over mountain roads."),
    Q("Why might winter decide whether the trial succeeds?", "The drones have not yet been proven in snow", "Patients need no medicine in winter", "The company stops in summer", "Snow will be the real challenge."),
  ],
  "An evening talk about buying an electric car": [
    Q("Why should buyers plan with the smaller range figure?", "Real conditions can reduce the distance considerably", "The official test is illegal", "Winter makes the car go further", "In winter the range can fall by about a fifth."),
    Q("Why does Mrs Okafor mention her own former doubts?", "To show that experience can change an opinion", "To advise people not to buy electric cars", "To complain about her son", "She was against them until her son borrowed one."),
  ],
  "Judging a school science fair": [
    Q("Why does Ms Ibragimova praise the girls' report?", "They honestly admit their result may be chance", "They proved that music makes plants grow", "They wrote it in a single day", "The difference was small and they say so."),
    Q("Why are appearance marks excluded?", "The quality of the science should decide", "The hall is too dark to see the boards", "Colourful boards are forbidden", "A plain board with a good experiment is better."),
  ],
  "A beginners' 3D printing workshop": [
    Q("Why does Arman mention that he still produces spaghetti?", "To reassure beginners that mistakes are normal", "To advise them to bring lunch", "To show that his printers are broken", "Even after six years it happens to him."),
    Q("Why did the makerspace stop opening printers on Sundays?", "Too few members were using them then", "The plastic is not sold on Sundays", "Arman stopped teaching", "Too few people came."),
  ],
  "Planning a smart home installation": [
    Q("Why might sensors be a better choice than indoor cameras?", "They warn of openings without recording private pictures", "They record better video than cameras", "They need no connection at all and cost more", "A hacked camera could show the inside of the flat."),
    Q("Why does Peter correct the savings figure?", "He wants her expectations to be realistic", "He wants her to cancel the order", "The advertisement was too modest", "He does not want her to be disappointed."),
  ],
};
