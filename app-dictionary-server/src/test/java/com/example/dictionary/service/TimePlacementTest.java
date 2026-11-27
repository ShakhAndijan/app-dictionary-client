package com.example.dictionary.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TimePlacementTest {

    private static boolean accepts(String answer, String given) {
        return new LearnItem("1", "FILL", "Inglizchaga tarjima qiling: gap", null, answer, null, null, null).matches(given);
    }

    @Test
    void timeMayOpenOrCloseAStatement() {
        assertThat(accepts("Yesterday I was at school", "i was at school yesterday")).isTrue();
        assertThat(accepts("I was at school yesterday", "Yesterday, I was at school.")).isTrue();
        assertThat(accepts("We have breakfast every day", "Every day we have breakfast")).isTrue();
        assertThat(accepts("Tomorrow morning I will go to Samarkand", "I will go to Samarkand tomorrow morning")).isTrue();
        assertThat(accepts("He left two days ago", "2 days ago he left")).isTrue();
        assertThat(accepts("Last week we visited the museum", "We visited the museum last week")).isTrue();
    }

    @Test
    void otherSentencesKeepTheirOrder() {
        assertThat(accepts("Yesterday was Monday", "Was Monday yesterday")).isFalse();
        assertThat(accepts("Did you go to school yesterday", "Yesterday did you go to school")).isFalse();
        assertThat(accepts("I think he will come tomorrow", "Tomorrow I think he will come")).isFalse();
        assertThat(accepts("He said that he was ill yesterday", "Yesterday he said that he was ill")).isFalse();
        assertThat(accepts("Yesterday I was at school", "I was at school")).isFalse();
        assertThat(accepts("Yesterday I was at school", "I was yesterday at school")).isFalse();
    }
}
