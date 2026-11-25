const Q = (prompt, a, b, c, explain) => ({ prompt, answer: a, options: [a, b, c], explain });
module.exports = {
  "Flight change announcement": [
    Q("Why might passengers need to start walking to the new gate early?", "The gate is some distance away", "The plane has already left", "The gate closes for cleaning at once", "It is at the far end of the corridor, about ten minutes on foot."),
    Q("What can we infer about the possibility of cancellation?", "It is unlikely but not yet ruled out", "The flight has definitely been cancelled", "It is completely impossible", "They do not expect it, but the inspection is not finished."),
  ],
  "Tour guide at a fortress": [
    Q("Why does the guide question the guidebooks' claim?", "Most of what stands today is much more recent", "Archaeologists found nothing at all", "The fortress was built last century", "The visible walls were mostly rebuilt after later damage."),
    Q("Why does she ask the group to stay together?", "The courtyards are easy to confuse", "The gardeners dislike visitors", "Tickets are checked in groups", "Courtyards look similar and a visitor once wandered off."),
  ],
  "Radio talk on climate and farming": [
    Q("Why can an early melt be harmful to fruit growers?", "Blossom may be exposed to a later frost", "Trees receive too much shade", "Fruit ripens only in snow", "Melting in February is followed by an April frost that destroys blossom."),
    Q("Why are owners of larger farms unhappy with the subsidy rule?", "They use much water but cannot get help", "They already have free irrigation", "They are forced to grow cotton", "Only small farms qualify."),
  ],
  "Hotel complaint call": [
    Q("Why is Marcus reluctant to move rooms?", "It is late and he has an early start", "He wants to join the wedding", "The new room is on the garden side", "He has a meeting at seven and does not want to pack at midnight."),
    Q("What does his note about Madina suggest?", "He separates the receptionist's effort from the management's failure", "He blames her for the whole problem", "He will never stay there again", "He praises her and complains only about the lack of information."),
  ],
  "Interview with a conservationist": [
    Q("Why might paying into a fund reduce killings of leopards?", "Herders no longer bear the whole loss of a dead animal", "Leopards stop eating sheep when paid", "The herders are no longer allowed to keep sheep", "The fund covers losses, so revenge is less likely."),
    Q("What does refusing the film company show about her priorities?", "Protecting the animals matters more than money", "She dislikes all films", "She needs no donations", "She refused despite a large donation because of the helicopter."),
  ],
  "Festival programme": [
    Q("Why should visitors arrive early for the film?", "The indoor venue has limited room", "The film is shown twice", "The park closes at five", "Space in the cultural centre is limited."),
    Q("Why will single-use bottles not be sold?", "The organisers want to cut plastic waste", "There is no water at the festival", "Bottles are banned on shuttle buses", "Free water points were installed to reduce plastic."),
  ],
  "Train timetable change": [
    Q("Why should passengers not rely on the website yet?", "It describes a faster service that has not begun", "It has been closed", "It shows prices from last century", "Repairs are not complete, so the old journey time applies at first."),
    Q("Why does the speaker doubt the company's delay target?", "Weather cannot be reliably predicted", "No new machines were bought", "Trains no longer run in winter", "She is not sure it is realistic because of the weather."),
  ],
  "A talk about culture shock": [
    Q("What caused the misunderstanding at dinner?", "The two cultures treat a first refusal differently", "Fiona did not like her guest", "The food had run out", "In Scotland a polite no usually means no."),
    Q("Why might constant comparing have been a problem?", "It tired the people the speaker wanted to befriend", "It made cooking impossible", "It was against university rules", "Friends quickly became tired of it."),
  ],
  "Campsite welcome": [
    Q("Why are campers asked not to feed animals?", "They may come to rely on people for food", "Food is too expensive at the shop", "Animals only eat firewood", "Human food makes animals dependent."),
    Q("Why is Rustam so strict about fires?", "A past fire damaged part of the forest", "Firewood is free", "Fire rings are not available", "A family's fire destroyed about two hectares."),
  ],
  "Museum audio guide": [
    Q("Why might touching the carpet cause lasting damage?", "Oils from skin harm the fibres over time", "The red dye is poisonous", "The carpet is not fixed to the wall", "The museum has had to replace a section twice."),
    Q("What does the size of the child's coat tell us about its purpose?", "It was a special garment meant to last as the child grew", "Children were much bigger then", "It was made for an adult", "It was for a ceremony, and the child would grow into it."),
  ],
  "Council recycling announcement": [
    Q("Why might some residents try to cheat the discount system?", "The reward is based on weight", "The bins have no colours", "Fines are paid to residents", "Heavy useless items could increase the measured amount."),
    Q("Why is the council promoting sorting now?", "Burying waste is becoming too costly", "The national average is lower than the city's", "Schools asked for new bins", "The landfill is nearly full and a new one is expensive."),
  ],
  "Boat trip to a bird island": [
    Q("Why could walking off the path harm the puffins?", "Their nests are hidden under the grass", "They only nest on the white stones", "Gulls follow people off the path", "The birds nest in burrows."),
    Q("Why does the captain mention last year's cancelled landings?", "To show that caution proved right in the end", "To say that refunds are never paid", "To advise people not to board", "Passengers eventually agreed she had been right."),
  ],
  "Travel vlog from a desert camp": [
    Q("Why should visitors charge their phones before arriving?", "The yurts have no electricity", "Phones are banned at the camp", "The signal drains the battery in the car", "There are only solar lamps in the yurts."),
    Q("What can we infer about the sister's advice?", "The speaker was glad to have followed it", "It was the reason the trip was cancelled", "It was ignored completely", "She said the speaker would regret not going, and as usual was right."),
  ],
  "Planning a cycling holiday": [
    Q("Why might Shirin's own experience make her advice persuasive?", "She found the pass difficult herself", "She has never cycled", "She sells rental bicycles", "She had to walk the last stretch."),
    Q("Why should a rented bicycle be checked carefully?", "Its condition may not be reliable", "Rental bikes have no wheels", "Airlines inspect only rented bikes", "She warned they were not always in good condition."),
  ],
  "Night market food tour": [
    Q("How might a visitor misunderstand a half-full cup?", "As a sign that the host is being mean", "As a sign that the tea is free", "As an invitation to leave", "The guide says it is not stinginess but respect."),
    Q("Why should people with allergies speak before tasting desserts?", "Many of them may contain nuts", "Desserts are all made with lamb", "The sweets are too hot", "Nuts are used in most desserts."),
  ],
};
