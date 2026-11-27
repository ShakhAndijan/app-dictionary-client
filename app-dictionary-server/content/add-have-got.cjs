// Possession can be said with "have" or "have got": typed exercises accept both.
// Adds the other form to alsoAccept in resources/learn/*.json. Safe to run again.
// Run after the lesson builders (they rewrite the files): node content/add-have-got.cjs
// Actions ("have breakfast"), perfect tenses, "have to" and "have something done" are deliberately not listed.
const fs = require('fs');
const dir = 'src/main/resources/learn';

// Translations with possession, by their model answer.
const SENTENCES = `I have two brothers
I don't have a sister
I have two sisters
We have a dog
We don't have any rice
Have you got a pen
How many brothers have you got
Have you got a car
I have an account at the bank
My sister has got a bank card
I have got a red jacket
My sister has got a blue skirt
My brother has got new shoes
The children have got new hats
My father has got a black suit
I have two eyes and one nose
The child has a fever
I have a cough
I have five dollars
Do you have any money
My daughter has got fifteen dolls
I have got a new notebook
I haven't got an eraser
Today we have three lessons
I have got a small cat
My parents haven't got a dog
My brother has got two fish
Have you got a pet
I have got a ticket
I haven't got a passport
We have got a new ball
Have you got a racket
I have got a new toy
My aunt has got a big garden
Do you have a spoon
We have no lessons on Wednesday
I have one brother and one sister
My aunt has two children
How many relatives do you have
Do you have eggs
I have a new message
Do you have a phone
I have two phones
Do you have soup
I have a stomachache and I feel sick
Do you have any allergies
My child has a fever
Do you have enough money
We don't have enough time
We don't have enough chairs
We have enough time to get home
Do you have a smaller size
Does this product have a warranty
We don't have enough money to buy it
I will get up early tomorrow because I have an important meeting
If I have time today, I will go to the shop
You have time, don't you
We have enough food for the picnic
He doesn't have enough money to buy a car
I don't have enough time to read everything
I have a few good friends
We don't have any homework today
Every student in the class has a dictionary
I want to come back. However, I don't have time now
We have an important meeting today
We have enough petrol to start the journey
They got married in 2020 and now have three children
If I have a lot of money, I will buy a big house
If you do not have cash, use a card
If I have time tomorrow, I will help you
We do not have much time to drink coffee
How many friends do you have
This job needs experience, but I have very little experience
I do not have any information about this problem
He does not have many friends, so he is lonely
I have a friend who lives in Tashkent
I do not have much money
I have a little time`.split('\n');

// Gap-fill sentences with possession: prompt -> other correct ways to fill the gap.
const POS = ['have'];
const POS_S = ['has'];
const NOT = ["don't have", 'do not have', 'have not got'];
const NOT_S = ["doesn't have", 'does not have', 'has not got'];
const GAPS = {
  'She ___ a dog. (have)': ['has got'],
  'I ___ a new phone.': POS,
  'She ___ two brothers.': POS_S,
  'They ___ a big house.': POS,
  'He ___ a car.': NOT_S,
  'We ___ any money.': NOT,
  'My dog ___ big ears.': ['has got'],
  'The room ___ two windows.': POS_S,
  'I ___ a pen.': NOT,
  'Tom ___ a new bike.': POS_S,
  'She ___ any brothers.': ["hasn't got", 'has not got', 'does not have'],
  'My sister ___ long hair.': POS_S,
  'We ___ two cars.': POS,
  'He ___ a brother.': NOT_S,
  'They ___ any children.': NOT,
  'She ___ blue eyes.': POS_S,
  'The hotel ___ a swimming pool.': POS_S,
  'I ___ a car.': NOT,
  'My parents ___ a small flat.': POS,
  'It ___ a door.': NOT_S,
};

// "I have got" -> "I've got", "he has got" -> "he's got".
const shorten = (s) => s.replace(/\b(I|[Yy]ou|[Ww]e|[Tt]hey|[Hh]e|[Ss]he|[Ii]t) (have|has) got\b/, (m, who, verb) => `${who}${verb === 'have' ? "'ve" : "'s"} got`);

/** The same sentence said the other way; empty when there is no have / has to swap. */
function others(s) {
  let m;
  if (s === "You have time, don't you") return ["You have got time, haven't you", "You've got time, haven't you"];
  if (/\bhave no\b/.test(s)) {
    const out = [s.replace('have no', 'have got no'), s.replace('have no', "don't have any"), s.replace('have no', "haven't got any")];
    return [...out, ...out.map(shorten)];
  }
  // Questions: "Have you got ...?" <-> "Do you have ...?"
  if ((m = s.match(/^(Have|Has) (you|this product) got (.*)$/))) return [`${m[1] === 'Have' ? 'Do' : 'Does'} ${m[2]} have ${m[3]}`];
  if ((m = s.match(/^(Do|Does) (you|this product) have (.*)$/))) return [`${m[1] === 'Do' ? 'Have' : 'Has'} ${m[2]} got ${m[3]}`];
  if ((m = s.match(/^(How many \w+) have you got$/))) return [`${m[1]} do you have`];
  if ((m = s.match(/^(How many \w+) do you have$/))) return [`${m[1]} have you got`];
  // Negatives.
  const neg = /\b(haven't got|hasn't got|have not got|has not got|don't have|doesn't have|do not have|does not have)\b/;
  if ((m = s.match(neg))) {
    const third = /^(has|does)/.test(m[1]);
    const forms = third ? ["hasn't got", 'has not got', "doesn't have", 'does not have'] : ["haven't got", 'have not got', "don't have", 'do not have'];
    return forms.map((f) => s.replace(neg, f));
  }
  // Positives.
  if (/\b(have|has) got\b/.test(s)) return [s.replace(/\b(have|has) got\b/, '$1'), shorten(s)];
  const pos = /\b(have|has)\b/;
  if (pos.test(s)) {
    const got = s.replace(pos, '$1 got');
    return [got, shorten(got)];
  }
  return [];
}

const norm = (s) => s.toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ').trim();
const found = new Set();
let changed = 0;
for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const file = `${dir}/${name}`;
  const raw = fs.readFileSync(file, 'utf8');
  const lessons = JSON.parse(raw);
  let touched = 0;
  for (const lesson of lessons) {
    for (const item of lesson.items) {
      if (item.kind !== 'FILL') continue;
      let extra;
      if (SENTENCES.includes(item.answer)) {
        found.add(item.answer);
        // Variants of variants too, so a second run has nothing left to add.
        extra = [item.answer, ...(item.alsoAccept || [])];
        for (let pass = 0; pass < 3; pass += 1) extra = [...new Set([...extra, ...extra.flatMap(others)])];
        if (!item.alsoAccept?.length && extra.length === 1) throw new Error(`no other form for: ${item.answer}`);
      } else if (GAPS[item.prompt] && /\b(have|has)(n't)?\b/.test(item.answer)) {
        found.add(item.prompt);
        extra = GAPS[item.prompt];
      } else continue;
      const seen = new Set([item.answer, ...(item.alsoAccept || [])].map(norm));
      const add = extra.filter((e) => !seen.has(norm(e)) && seen.add(norm(e)));
      if (!add.length) continue;
      item.alsoAccept = [...(item.alsoAccept || []), ...add];
      touched += 1;
    }
  }
  if (!touched) continue;
  const out = JSON.stringify(lessons, null, 1);
  fs.writeFileSync(file, raw.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  console.log(name, 'exercises extended:', touched);
  changed += touched;
}
const missing = [...SENTENCES, ...Object.keys(GAPS)].filter((k) => !found.has(k));
console.log('total', changed, missing.length ? 'NOT FOUND: ' + missing.join(' | ') : 'all listed exercises found');
