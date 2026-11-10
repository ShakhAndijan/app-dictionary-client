# Spec for generated WRITING lessons (Uzbek -> English translation)

Write ONE CommonJS file that exports an array of 6 lessons:

```js
module.exports = [
  { title: "Uzbek lesson title (short)", topic: "English topic", items: [
    ["O'zbekcha gap.", "English translation."],
    // exactly 30 pairs
  ] },
  // 6 lessons
];
```

Rules:
- EXACTLY 6 lessons, EXACTLY 30 pairs each, all sentences within a file distinct.
- Learners type the English sentence from memory, so each Uzbek sentence must have ONE obvious, natural English translation (avoid sentences with many valid renderings, avoid idioms, avoid optional words). Use full forms and common contractions only the way a textbook would (I am / I'm both accepted by the app, so prefer the full form "I am", "do not" is NOT needed: write "don't" style normally, either is fine). No quotes inside text except apostrophes; use double-quoted JS strings so apostrophes need no escaping. Uzbek sentences use the apostrophe (o', g', ') normally.
- Sentence length 4-12 words. Vocabulary and grammar must match the level given in your task. Each lesson focuses on its given theme/grammar, sentences vary in subject and structure.
- Finish with the end punctuation in both languages.

Verify before finishing (replace FILE):

```
node -e "const a=require('FILE');console.log(a.length,a.every(l=>l.items.length===30&&l.items.every(p=>p.length===2&&p[0]&&p[1])),new Set(a.flatMap(l=>l.items.map(p=>p[1]))).size)"
```

Fix until it prints `6 true 180`. Reply only 'done'.
