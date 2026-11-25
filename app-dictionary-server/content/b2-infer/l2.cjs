const Q = (prompt, a, b, c, explain) => ({ prompt, answer: a, options: [a, b, c], explain });
module.exports = {
  "A doctor's advice call": [
    Q("Why might the doctor not prescribe medicine yet?", "The level has improved and lifestyle changes may be enough", "Bobur refused to take any tablets", "Medicine does not lower cholesterol", "It is still high but much better, so she suggests walking and diet first."),
    Q("What can we infer from the question about Bobur's father?", "Family history may affect Bobur's own risk", "The doctor also treats his father today", "His father will join him for walks", "Heart problems often run in families."),
  ],
  "A radio talk on sleep": [
    Q("Why might sleeping late at weekends make someone feel worse?", "It disturbs the body's regular timing", "It reduces the bedroom temperature", "It makes naps impossible", "A changing schedule matters even when total sleep is longer."),
    Q("Why does the professor advise making only one change at a time?", "It is easier to keep and turn into a habit", "Two changes are dangerous to health", "Only one change ever works", "Keep one change for two weeks before adding another."),
  ],
  "A gym tour": [
    Q("Why might the yearly plan be a poor choice for James despite being cheaper?", "He may not stay long enough to use it", "It does not include the pool", "It costs more per month", "He is moving to another city in the spring."),
    Q("Why does Malika recommend the introduction with a trainer?", "Beginners could injure themselves without guidance", "It is required by law", "It lets members skip the joining fee", "She mentions people hurting their backs by lifting too much."),
  ],
  "A nutritionist interview": [
    Q("What can we infer from the doctor changing her advice about meals?", "She updates her views when new research appears", "She never believed in her old advice", "Research on food has stopped", "The research changed, and so did her recommendation."),
    Q("Why is home cooking presented as the one simple rule?", "It lets people control what goes into their food", "It always takes less time", "Restaurants do not serve vegetables", "You control salt, oil and portions."),
  ],
  "A conversation in a pharmacy": [
    Q("Why is the question about allergies important before Sanjar buys anything?", "Some medicines could be dangerous for him", "Allergies decide the price", "It shows whether he needs a syrup", "He is allergic to penicillin, which she notes as very important."),
    Q("Why would the cheaper brand be risky for Sanjar in particular?", "It may make him sleepy while he drives for work", "It contains penicillin and alcohol", "It is only for children", "He drives a delivery van and that brand causes drowsiness."),
  ],
  "A marathon preparation talk": [
    Q("Why does the coach limit the longest training run to thirty two kilometres?", "A full distance would require too much recovery", "Runners are not allowed to run further", "The race has been shortened", "The damage would cost more than it gives."),
    Q("Why does he ask beginners to start the race slowly?", "Excitement can make them use up energy too early", "The first kilometres are uphill", "Fast runners start later", "Beginners usually start far too fast because of the crowd."),
  ],
  "A dentist appointment": [
    Q("What does Kamila's delay teach in this story?", "Treating a problem early can prevent bigger treatment", "Tooth pain always disappears by itself", "Dentists prefer patients to wait", "Another month might have meant a root treatment."),
    Q("Why might the dentist ask her to come back in six months?", "He wants to catch problems such as gum disease early", "The filling lasts only six months", "Her insurance ends then", "Her gums are already slightly red and she waited too long before."),
  ],
  "A lecture on stress": [
    Q("Why might a long working day cause less harm for some workers?", "They have some control over how they organise it", "They are paid more for each hour", "They are all women over forty", "Control mattered more than the amount of work."),
    Q("What does the lecturer's mention of last time suggest?", "Many students prepared too late before", "The test has been cancelled", "Chapter six was not available", "He tells them not to leave it until the last night, as many did."),
  ],
  "A cooking show introduction": [
    Q("Why did the producer's comment change the recipe?", "Frying in lots of oil did not fit a healthy programme", "The studio had no frying pan", "Chickpeas cannot be fried", "She reminded him that it is a healthy eating show."),
    Q("Why does the chef delay adding salt?", "The tinned chickpeas may already make it salty enough", "Salt stops the oven working", "Yoghurt cannot be mixed with salt", "Chickpeas from a tin contain some, so taste at the end."),
  ],
  "A school nurse announcement": [
    Q("Why does the nurse stress that lice have nothing to do with cleanliness?", "So that affected children are not embarrassed or blamed", "To stop parents checking hair", "Because only grade five washes", "She says it is not a reason for shame."),
    Q("Why has the cafeteria changed what it sells?", "To protect students who could react badly to peanuts", "Peanuts became too expensive", "Teachers dislike the smell", "Two students are severely allergic."),
  ],
  "A physiotherapy session": [
    Q("What does Ravshan's final decision about the tournament show?", "He puts the long-term health of his knee first", "He no longer likes football", "He does not believe the therapist", "He would rather miss one tournament than be hurt permanently."),
    Q("Why might breaststroke be harmful while front crawl is not?", "Its leg movement puts a twisting strain on the knee", "It is swum in colder water", "It requires no leg movement", "The kicking movement twists the knee."),
  ],
  "A first aid talk before a hike": [
    Q("Why does Timur want no arguments about turning back?", "Safety in a storm matters more than reaching the lake", "He does not want to reach the lake at all", "The programme forbids walking after noon", "If the sky looks dark they turn back."),
    Q("Why is the radio so important on this route?", "It works for help where phones do not", "It gives the weather in other countries", "It is needed to find snakes", "There is no phone signal after the second bridge."),
  ],
  "A podcast about a digital detox": [
    Q("What does reaching for her pocket reveal about Zarina's phone use?", "Much of it was automatic habit rather than real need", "She was waiting for a work call", "Her sister had returned the phone", "She missed the habit more than messages."),
    Q("Why would a total ban not suit everyone?", "Some people must stay contactable", "Phones cannot be put in drawers", "Psychologists have forbidden it", "People caring for sick relatives need to be reachable."),
  ],
  "A yoga retreat booking call": [
    Q("Why does Leyla advise Dana to decide quickly?", "The programme she wants is nearly full", "The prices change every day", "The retreat closes in September", "Only two places are left."),
    Q("Why might Dana expect the first two days to be hard?", "She is used to drinking coffee", "She dislikes vegetarian food", "She cannot bring her phone to her room", "There is only herbal tea, and she says she will manage."),
  ],
  "A blood donation drive": [
    Q("Why does the speaker ask donors to be completely honest?", "Health information is needed to keep donors and patients safe", "Answers are published for students", "Honest donors receive more vouchers", "Restrictions depend on private facts, and everything is confidential."),
    Q("Why might hospitals especially welcome donations before summer?", "Shortages tend to be worse at that time", "Blood is not needed in winter", "The university is closed to nurses", "Hospitals are short of blood especially in summer."),
  ],
};
