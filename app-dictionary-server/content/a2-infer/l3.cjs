const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
module.exports = {
  "A flight gate change": [
    Q("Why has the departure time changed?", "There is fog this morning", ["The gate is closed", "There is fog this morning", "The plane is being cleaned"], "The announcer says a small delay is caused by heavy fog."),
    Q("Why should passengers not go to gate twelve?", "The area is being cleaned and is closed", ["It is full", "The area is being cleaned and is closed", "The flight is cancelled"], "It is closed until noon because staff are cleaning it."),
  ],
  "A metro closure": [
    Q("Why is the Chilonzor line closing?", "A pipe problem needs repair after last month's water in the tunnel", ["A football match", "A pipe problem needs repair after last month's water in the tunnel", "A strike"], "The manager explains that water came into the tunnel after heavy rain."),
    Q("Why should people going to the stadium leave earlier?", "The replacement buses will be very busy", ["The stadium is far", "The replacement buses will be very busy", "The metro is closed all week"], "The announcement says the buses will be very busy on Sunday evening."),
  ],
  "A school closed by snow": [
    Q("Why is the school closed?", "The roads are icy and buses cannot drive safely", ["The teachers are ill", "The roads are icy and buses cannot drive safely", "There is no heating"], "The head teacher gives this reason after heavy snow."),
    Q("What can we guess about the Friday concert?", "It may still happen if the roads are clear", ["It is cancelled", "It may still happen if the roads are clear", "It has moved to Monday"], "The head teacher will confirm at noon on Friday."),
  ],
  "A news report about a bridge": [
    Q("Why are some shop owners not pleased?", "Fewer cars will pass their shops", ["The bridge is too long", "Fewer cars will pass their shops", "They lost their jobs"], "The old road will have less traffic."),
    Q("Why are heavy lorries not allowed on the bridge?", "They must use the ring road to protect the bridge and traffic", ["The bridge is too narrow", "They must use the ring road to protect the bridge and traffic", "They are noisy"], "The report says heavy lorries must use the ring road; the bridge is for light traffic."),
  ],
  "A radio traffic report": [
    Q("Why should drivers use Amir Temur Street?", "Navoi Avenue has a closed lane after an accident", ["It is shorter", "Navoi Avenue has a closed lane after an accident", "It has no rain"], "The report says traffic is slow on Navoi and the road will be clear by nine."),
    Q("Why does the reporter say to keep a safe distance?", "The roads will stay slippery after the rain", ["Cars are old", "The roads will stay slippery after the rain", "The police asked"], "Rain stops at ten, but wet roads are slippery."),
  ],
  "A museum opening": [
    Q("Why is the museum free on the first Sunday?", "The director wants every family to visit", ["It is a holiday", "The director wants every family to visit", "The cafe is closed"], "She says so about free entry."),
    Q("What do we know about the building's history?", "It was a school and then empty before becoming a museum", ["It was always a museum", "It was a school and then empty before becoming a museum", "It was a hospital"], "It was a school for eighty years and empty for ten."),
  ],
  "A supermarket promotion": [
    Q("Why should shoppers come to the bakery at seven or four?", "That is when fresh bread is made", ["The bakery closes", "That is when fresh bread is made", "Bread is cheap then"], "The speaker mentions the times of fresh baking."),
    Q("What do you need to get the free reusable bag?", "Spend a hundred thousand soums or more", ["Buy bread", "Spend a hundred thousand soums or more", "Visit on Sunday"], "The announcement gives this condition for customers with a card."),
  ],
  "A train strike": [
    Q("Why are the drivers on strike?", "They want better pay and shorter working days", ["The trains are old", "They want better pay and shorter working days", "A bridge closed"], "They want to work eight hours instead of ten."),
    Q("What may stop the strike?", "A successful meeting on Monday", ["Extra buses", "A successful meeting on Monday", "Refunds"], "The company says it is ready to talk and the strike may stop if the meeting goes well."),
  ],
  "A weather warning": [
    Q("Why should people put garden chairs inside?", "The strong wind can blow them away", ["It will snow", "The strong wind can blow them away", "They may rust"], "The warning gives wind up to ninety kilometres an hour."),
    Q("Why should people not use candles?", "They can cause fires", ["They are too weak", "They can cause fires", "They are expensive"], "They advise a torch instead."),
  ],
  "A sports report": [
    Q("Why did the crowd go wild at the end?", "Sardor scored a winning goal in the last minute", ["The game was a draw", "Sardor scored a winning goal in the last minute", "The coach left"], "It was two all until the final minute."),
    Q("What does 'the best night of his life' say about the coach?", "He is very happy with the victory", ["He is tired", "He is very happy with the victory", "He will retire"], "His team worked hard and won."),
  ],
  "A marathon road closure": [
    Q("Why does the metro open an hour earlier?", "So runners and families can arrive in time", ["It is cheaper", "So runners and families can arrive in time", "There is a strike"], "It opens at five for race day."),
    Q("What will the race money be used for?", "A new playground at the children's hospital", ["Road repairs", "A new playground at the children's hospital", "Metro tickets"], "It is stated at the end."),
  ],
  "A new park": [
    Q("Why was the land empty and dirty before?", "An old factory had closed twenty years ago", ["It was a market", "An old factory had closed twenty years ago", "It was a lake"], "The land was unused after the factory closed."),
    Q("Why must dogs stay on a lead?", "To keep other visitors comfortable and safe", ["Dogs are not welcome", "To keep other visitors comfortable and safe", "The lawn is new"], "Dogs are welcome on the lawn, but they must stay on a lead."),
  ],
  "A power cut": [
    Q("Why is the power cut planned?", "Workers must change old cables safely", ["There is a storm", "Workers must change old cables safely", "The hospital asked"], "It is not safe to work with electricity on."),
    Q("Why should people turn off ovens before nine?", "A sudden return of electricity can break machines", ["Ovens use water", "A sudden return of electricity can break machines", "Food will spoil"], "The speaker explains this."),
  ],
  "A bus route change": [
    Q("Why will bus seven avoid the old market?", "The road is now only for pedestrians", ["The market is closed", "The road is now only for pedestrians", "The bus is old"], "The text says so."),
    Q("Why do the buses' screens speak English and Uzbek?", "To help visitors", ["To help drivers", "To help visitors", "To save money"], "The speaker says it will help visitors."),
  ],
  "A festival timetable": [
    Q("Why should people book the poetry evening early?", "There are only eighty seats", ["It is free", "There are only eighty seats", "It is on Friday"], "The speaker gives this reason."),
    Q("Why should visitors bring their own bottle?", "Water refills are free", ["Water is dirty", "Water refills are free", "Bottles are cheap"], "The speaker says so."),
  ],
};
