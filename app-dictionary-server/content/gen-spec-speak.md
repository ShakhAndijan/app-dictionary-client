# Spec for generated SPEAKING lessons (phrases to read aloud)

Write ONE CommonJS file exporting an array of 5 lessons:

```js
module.exports = [
  { title: "Uzbek lesson title (short)", topic: "English topic", phrases: [ "English sentence.", /* exactly 30 */ ] },
  /* 5 lessons */
];
```

Rules: EXACTLY 5 lessons, EXACTLY 30 phrases each, all phrases distinct. Each phrase is a natural English sentence or question whose length and grammar match the level given in your task (useful real-life speech for the given themes), easy to read aloud, with end punctuation. Double-quoted JS strings. Variety of subjects and structures.

Verify (replace FILE):

```
node -e "const a=require('FILE');console.log(a.length,a.every(l=>l.phrases.length===30&&l.title&&l.topic),new Set(a.flatMap(l=>l.phrases)).size)"
```

Fix until it prints `5 true 150`. Reply only 'done'.
