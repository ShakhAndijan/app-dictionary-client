const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
module.exports = {
  "Calling a plumber": [
    Q("Why did Aziza ask for eleven o'clock?", "She had a meeting at ten", ["The plumber was late", "She had a meeting at ten", "She wanted to sleep"], "She remembered the meeting after the woman offered ten thirty."),
    Q("Why did the woman tell her to put a bucket under the pipe?", "To collect leaking water until the plumber came", ["To clean the floor", "To collect leaking water until the plumber came", "To wash the pipe"], "The pipe was broken, and she should not use the sink."),
  ],
  "A teacher's voicemail": [
    Q("Why was the trip moved to Thursday?", "Rain is forecast for Wednesday", ["The bus was busy", "Rain is forecast for Wednesday", "The museum was closed"], "The teacher says it directly."),
    Q("Why is the signed paper important?", "Without it the child cannot go on the bus", ["It is a ticket", "Without it the child cannot go on the bus", "It is a lunch order"], "The teacher states this condition."),
  ],
  "Cancelling an appointment": [
    Q("Why did Jasur cancel his visit?", "He did not want to give his cold to others", ["He was busy", "He did not want to give his cold to others", "He lost the address"], "He had a bad cold and decided to stay away."),
    Q("Why did he choose Tuesday?", "He works on Monday afternoon", ["It was cheaper", "He works on Monday afternoon", "The doctor was ill"], "Monday at four clashed with his work."),
  ],
  "Renting a flat": [
    Q("Why did Mr Rashidov ask if she had pets?", "He wanted to know if animals would live in the flat", ["He likes cats", "He wanted to know if animals would live in the flat", "It was a rule of the university"], "A landlord asks such questions; he accepted a cat if she kept the flat clean."),
    Q("Why did Malika's mother tell her to check windows and heating?", "Problems are easier to find before signing", ["The flat was old", "Problems are easier to find before signing", "She wanted to visit"], "It is practical advice before the contract."),
  ],
  "A wrong number": [
    Q("What was the problem with the woman's number?", "The last two digits were in the wrong order", ["It was too long", "The last two digits were in the wrong order", "It was a new number"], "Sardor noticed 97 instead of 79."),
    Q("What does the story show about Sardor?", "He is kind and helpful to a stranger", ["He is angry", "He is kind and helpful to a stranger", "He is busy"], "He helped her find the correct number."),
  ],
  "A message about a lost wallet": [
    Q("How did Timur find the owner?", "He looked at the photo and the card inside", ["He asked the driver", "He looked at the photo and the card inside", "He used a phone book"], "The text says he opened the wallet to find the owner's name."),
    Q("Why did Kamola buy ten loaves of bread?", "Timur would not accept a reward, so she thanked him this way", ["She was hungry", "Timur would not accept a reward, so she thanked him this way", "The bakery was cheap"], "He worked at a bakery and refused money."),
  ],
  "A hotel call": [
    Q("Why did Bobur offer sandwiches?", "The restaurant was closed and the guests were hungry", ["Sandwiches were free", "The restaurant was closed and the guests were hungry", "It was breakfast"], "Mrs Evans said they were hungry."),
    Q("What does the end of the story suggest?", "The guests were pleased with the hotel's service", ["They changed hotels", "The guests were pleased with the hotel's service", "They were angry"], "They decided to tell their friends about the friendly hotel."),
  ],
  "Booking a dentist": [
    Q("Why did Lola tell Farhod not to worry?", "He said he was a little afraid of dentists", ["He was late", "He said he was a little afraid of dentists", "The price was low"], "She said the doctor was kind and gentle."),
    Q("Why should Farhod arrive ten minutes early?", "To fill in a form", ["To pay", "To fill in a form", "To meet Lola"], "Lola explained it as a rule."),
  ],
  "Customer service": [
    Q("Why did Shirin choose the service centre?", "She needed a phone for work and the repair was faster", ["It was free", "She needed a phone for work and the repair was faster", "It was closer to her home"], "Three days is shorter than ten days."),
    Q("Why was the case number important?", "It identifies the problem at the service centre", ["It was a discount code", "It identifies the problem at the service centre", "It was a phone number"], "Kamran said it was important; it links the repair to the call."),
  ],
  "A job enquiry": [
    Q("Why was Mr Hamidov glad about Saturdays?", "Saturdays are very busy in the shop", ["He is closed", "Saturdays are very busy in the shop", "He likes weekends"], "He said Saturdays were busy so he would be glad."),
    Q("Why did Nodira make a list of books?", "Mr Hamidov asked her to bring her favourite books", ["She wanted to buy them", "Mr Hamidov asked her to bring her favourite books", "The shop needed a list"], "She should bring the list on Friday."),
  ],
  "Apologising for being late": [
    Q("Why did Mrs Saidova tell Bekzod not to run?", "The road was wet and dangerous", ["She was angry", "The road was wet and dangerous", "She had no time"], "The text gives this reason."),
    Q("Why did Bekzod buy a cake?", "To apologise to the office in a friendly way", ["It was a birthday", "To apologise to the office in a friendly way", "He was hungry"], "It was a way to say sorry."),
  ],
  "A parcel call": [
    Q("Why did Rustam suggest leaving the parcel with a neighbour?", "Laylo could not be at home in ten minutes", ["He lost the box", "Laylo could not be at home in ten minutes", "It was cheaper"], "He could wait only ten minutes."),
    Q("Why did Rustam send a photo?", "As proof that the parcel was delivered", ["For advertising", "As proof that the parcel was delivered", "He liked the neighbour"], "The text says he took a photo as proof."),
  ],
  "A landlord's message": [
    Q("Why should someone be at home on Monday?", "A worker must enter the bathroom", ["The landlord will visit", "A worker must enter the bathroom", "A carpenter will come"], "The workers change pipes in every flat."),
    Q("What does 'I am sure it is just a small mistake' suggest?", "The landlord politely reminds Ravshan about rent", ["He is angry", "The landlord politely reminds Ravshan about rent", "He wants to leave"], "He is polite but asks for the money by Friday."),
  ],
  "An internet problem": [
    Q("Why did Dilbar think the problem was outside the house?", "Several lights on the router were red", ["The router was old", "Several lights on the router were red", "The computer was wrong"], "The text says this probably meant a problem on the line outside."),
    Q("What does the end of the story show?", "The sisters enjoyed the evening without the internet", ["They were angry", "The sisters enjoyed the evening without the internet", "They called again"], "They played a board game and laughed."),
  ],
  "A surprise call from abroad": [
    Q("Why had the friends not spoken for a long time?", "Daniel lost his phone and Otabek had no new number", ["They were angry", "Daniel lost his phone and Otabek had no new number", "They were busy"], "The text gives this reason."),
    Q("Why did Otabek not stop thinking about July?", "Daniel is going to visit him then", ["It is his birthday", "Daniel is going to visit him then", "The baby is born in July"], "Daniel bought a ticket to Tashkent."),
  ],
};
