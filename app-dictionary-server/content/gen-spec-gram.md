# Spec for generated B1 GRAMMAR topics (text file)

You write ONE UTF-8 text file with EXACTLY 4 grammar topics (the topic numbers/titles are given in your task). Format, one topic after another:

```
# 7 | Topic title in English | Qoida: short Uzbek explanation of the rule with 1-2 English examples | Short Uzbek tip (one sentence)
I [have been working] here since 2019. | worked, am working, have worked ~ work
She [doesn't] like coffee. | don't, isn't, hasn't
```

Header line: `# <number> | <title> | <Uzbek rule, 2-4 sentences> | <Uzbek tip>`. Use ` | ` exactly 3 times in the header. The rule text must not contain ` | `.

Rows (one per line), at least 38 rows per topic:
- English sentence with EXACTLY ONE `[correct answer]` in square brackets (the answer may be 1-3 words, e.g. `[have been working]`, `[would have gone]`).
- then ` | ` and 2 or 3 WRONG options separated by `, ` (commas). Wrong options must be plausible mistakes learners really make, must differ from the answer and from each other, and must clearly be wrong in that sentence (exactly one option may fit). Never put a comma inside an option.
- optional ` ~ base verb` hint at the very end (shown in fill-in mode), e.g. ` ~ work`. Use it when the answer is a verb form built from a given verb.
- At least 34 of the 38+ rows must be SHORT: the whole sentence containing the bracket must be 4-9 words after replacing the bracket by its answer (used for a word-order exercise). The rest may be longer (up to 14 words).
- Sentences within a topic must all be distinct, vary in subject, tense forms, affirmative/negative/question, and everyday vocabulary at B1 level. Single-sentence rows only (no two sentences in one row).
- Use plain apostrophes (') and no other `|` or `[` `]` characters inside sentences. No blank lines inside a topic; one blank line between topics.

Quality: every row must have exactly one correct answer; double check that none of the wrong options is also grammatical in that sentence.

Verify before finishing (replace FILE):

```
node content/check-gram.cjs FILE
```

(run it from `app-dictionary-server`, i.e. the parent of `content`.) Fix until it prints `OK` for all 4 topics. Reply only 'done'.
