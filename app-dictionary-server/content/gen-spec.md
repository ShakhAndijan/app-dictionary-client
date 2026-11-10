# Spec for generated long English texts (read this fully)

You write ONE JS file (CommonJS) exporting an array of 15 items for an English course app.

File header (copy exactly):

```js
const Q = (prompt, answer, options, explain) => ({ prompt, answer, options, explain });
const TF = (prompt, value, explain) => ({ prompt, answer: value ? 'True' : 'False', options: ['True', 'False'], explain });
module.exports = [ /* 15 items */ ];
```

Item shape:
- READING file: `{ topic, passage, qs }`
- LISTENING file: `{ topic, audioText, qs }`  (audioText is read aloud by text-to-speech: no digits, write numbers/times/years as words; no speaker labels; flowing sentences or a dialogue told in prose such as "Anna asks ... Tom answers ...")

Question helpers:
- `Q(prompt, answer, [3 options])` multiple choice. The answer MUST be exactly one of the options; no duplicate options.
- `Q(prompt)` without options = fill-in. Answer is ONE lowercase word (or number word like 'two') taken from the text; the prompt ends with a blank `___`.
- `TF(statement, true|false, 'short reason if false')` True/False.

Every item has EXACTLY 10 questions: 6 multiple-choice, 2 TF, 2 fill-in, in roughly text order, each answerable only from the text, details spread over the whole text (not just the beginning).

Texts are LONG (about one full page): several paragraphs separated by `\n\n` inside the string, with a real story / letter / blog / report / talk and concrete details (names, numbers, times, places, reasons). Word counts are given in your task. Use varied Uzbek and English names. 15 items on 15 DIFFERENT topics in the given domain. Use double-quoted JS strings and escape inner double quotes (or avoid them).

Verify before finishing (replace FILE, MINWORDS, FIELD = passage or audioText):

```
node -e "const a=require('FILE');console.log(a.length,a.every(p=>p.qs.length===10&&p[FIELD].split(/\s+/).length>=MINWORDS&&p.qs.every(q=>!q.options||q.options.includes(q.answer))),Math.min(...a.map(p=>p[FIELD].split(/\s+/).length)))"
```

Fix until it prints `15 true <number>= MINWORDS`. Reply only 'done'.
