package com.example.dictionary.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** Spelling, American words, numbers and safe synonyms in "translate into English" tasks. */
class EverydayVariantsTest {

    private static boolean accepts(String answer, String given) {
        return new LearnItem("1", "FILL", "Inglizchaga tarjima qiling: gap", null, answer, null, null, null).matches(given);
    }

    @Test
    void britishAndAmerican() {
        assertThat(accepts("My favourite colour is blue", "My favorite color is blue.")).isTrue();
        assertThat(accepts("The museum is in the centre", "The museum is in the center")).isTrue();
        assertThat(accepts("I went to the cinema yesterday", "I went to the movie theater yesterday")).isTrue();
        assertThat(accepts("There is a long queue at the post office", "There is a long line at the post office")).isTrue();
        assertThat(accepts("You mustn't use the lift during a fire", "You mustn't use the elevator during a fire")).isTrue();
        assertThat(accepts("We go for a walk at weekends", "We go for a walk on weekends")).isTrue();
    }

    @Test
    void numbersAsWordsOrDigits() {
        assertThat(accepts("There are twenty five students in our class", "There are 25 students in our class")).isTrue();
        assertThat(accepts("There are twenty five students in our class", "there are twenty-five students in our class")).isTrue();
        assertThat(accepts("I have two brothers", "I have 2 brothers")).isTrue();
        assertThat(accepts("Work finishes at five", "Work finishes at 5")).isTrue();
        assertThat(accepts("I have two brothers", "I have 3 brothers")).isFalse();
    }

    @Test
    void everydaySynonyms() {
        assertThat(accepts("Our house is new", "Our home is new")).isTrue();
        assertThat(accepts("The lesson starts at nine", "The class starts at nine")).isTrue();
        assertThat(accepts("My job is very difficult", "My work is very difficult")).isTrue();
        assertThat(accepts("My grandfather wears glasses", "My grandpa wears glasses")).isTrue();
    }

    @Test
    void wrongSentencesStayWrong() {
        assertThat(accepts("I want a new job", "I want a new work")).isFalse();
        assertThat(accepts("There is a chess club in our class", "There is a chess club in our lesson")).isFalse();
        assertThat(accepts("This is my home town", "This is my house town")).isFalse();
        assertThat(accepts("Sweets are not good for your teeth", "Candy are not good for your teeth")).isFalse();
        assertThat(accepts("The bus stop is in the street", "The bus stop is in the road")).isFalse();
    }
}
