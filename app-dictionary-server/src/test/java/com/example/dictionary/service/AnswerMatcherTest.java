package com.example.dictionary.service;

import com.example.dictionary.service.AnswerMatcher.Result;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AnswerMatcherTest {

    private static Result match(String given, String expected) {
        return AnswerMatcher.match(given, expected);
    }

    @Test
    void ignoresCaseWhitespaceAndPunctuation() {
        assertThat(match("  Apple ", "apple")).isEqualTo(Result.EXACT);
        assertThat(match("apple!", "apple")).isEqualTo(Result.EXACT);
        assertThat(match("ice   cream", "Ice cream")).isEqualTo(Result.EXACT);
        assertThat(match("mother in law", "mother-in-law")).isEqualTo(Result.EXACT);
    }

    @Test
    void treatsAllApostropheVariantsAsEqual() {
        assertThat(match("oʻzbek", "o'zbek")).isEqualTo(Result.EXACT);
        assertThat(match("o’zbek", "o'zbek")).isEqualTo(Result.EXACT);
        assertThat(match("mo`l-ko`l", "mo'l-ko'l")).isEqualTo(Result.EXACT);
    }

    @Test
    void ignoresLeadingToTheAAn() {
        assertThat(match("to run", "run")).isEqualTo(Result.EXACT);
        assertThat(match("run", "to run")).isEqualTo(Result.EXACT);
        assertThat(match("the apple", "apple")).isEqualTo(Result.EXACT);
    }

    @Test
    void doesNotStripAFillerWordThatIsTheWholeAnswer() {
        assertThat(match("to", "to")).isEqualTo(Result.EXACT);
        assertThat(match("the", "apple")).isEqualTo(Result.WRONG);
    }

    @Test
    void acceptsAnyOneOfSeveralStoredTranslations() {
        assertThat(match("olxo'ri", "olma, olxo'ri")).isEqualTo(Result.EXACT);
        assertThat(match("olma", "olma; olxo'ri")).isEqualTo(Result.EXACT);
        assertThat(match("olma, olxo'ri", "olma, olxo'ri")).isEqualTo(Result.EXACT);
        assertThat(match("nok", "olma, olxo'ri")).isEqualTo(Result.WRONG);
    }

    @Test
    void parenthesisedTextIsOptional() {
        assertThat(match("run", "run (fast)")).isEqualTo(Result.EXACT);
        assertThat(match("run fast", "run (fast)")).isEqualTo(Result.EXACT);
    }

    @Test
    void toleratesASingleTypoInMediumWords() {
        assertThat(match("aple", "apple")).isEqualTo(Result.TYPO);      // missing letter
        assertThat(match("appple", "apple")).isEqualTo(Result.TYPO);    // extra letter
        assertThat(match("applo", "apple")).isEqualTo(Result.TYPO);     // wrong letter
        assertThat(match("aplpe", "apple")).isEqualTo(Result.TYPO);     // swapped neighbours
        assertThat(match("aple", "apple").isCorrect()).isTrue();
    }

    @Test
    void allowsTwoTyposOnlyInLongWords() {
        assertThat(match("embarasment", "embarrassment")).isEqualTo(Result.TYPO);
        assertThat(match("aplpe", "apple")).isEqualTo(Result.TYPO);
        assertThat(match("apxxe", "apple")).isEqualTo(Result.WRONG);
    }

    @Test
    void shortWordsGetNoTypoTolerance() {
        assertThat(match("car", "cat")).isEqualTo(Result.WRONG);
        assertThat(match("sun", "son")).isEqualTo(Result.WRONG);
        assertThat(match("cat", "cat")).isEqualTo(Result.EXACT);
    }

    @Test
    void rejectsBlankAndDifferentAnswers() {
        assertThat(match("", "apple")).isEqualTo(Result.WRONG);
        assertThat(match("   ", "apple")).isEqualTo(Result.WRONG);
        assertThat(match(null, "apple")).isEqualTo(Result.WRONG);
        assertThat(match("banana", "apple")).isEqualTo(Result.WRONG);
        assertThat(match("apple", null)).isEqualTo(Result.WRONG);
    }

    @Test
    void worksForCyrillicAnswers() {
        assertThat(match("Олма", "олма")).isEqualTo(Result.EXACT);
    }
}
