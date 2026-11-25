package com.example.dictionary.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SynonymVariantsTest {

    private static LearnItem translation(String uzbek, String answer) {
        return new LearnItem("t", "FILL", "Inglizchaga tarjima qiling: " + uzbek, null, answer, List.of(), null, null);
    }

    private static void accepts(String answer, String... given) {
        LearnItem item = translation("Gap.", answer);
        for (String g : given) assertTrue(item.matches(g), answer + " should accept: " + g);
    }

    private static void refuses(String answer, String... given) {
        LearnItem item = translation("Gap.", answer);
        for (String g : given) assertFalse(item.matches(g), answer + " should refuse: " + g);
    }

    @Test
    void synonymsAreAccepted() {
        accepts("I like reading books.", "I love reading books", "I enjoy reading books.");
        accepts("My father is a doctor.", "My dad is a doctor");
        accepts("We watched a film yesterday.", "We watched a movie yesterday");
        accepts("We live in a flat.", "We live in an apartment");
        accepts("The lesson starts at nine.", "The lesson begins at nine");
        accepts("She had already started the work.", "She had already begun the work");
        accepts("My job is very difficult.", "My job is very hard");
        accepts("I will take the exam.", "I will take the test");
        accepts("The doctor works at night too.", "The doctor works at night as well");
        accepts("My mother calls me every day.", "My mum phones me every day");
    }

    @Test
    void swapsThatBreakTheGrammarAreRefused() {
        refuses("I like to see new cities.", "I enjoy to see new cities");
        refuses("I would like a glass of water.", "I would enjoy a glass of water");
        refuses("My sister likes music.", "My sister love music");
        refuses("We live in a flat.", "We live in a apartment");
        refuses("The film started at eight.", "The film begun at eight");
        refuses("I have finished my homework.", "I have ended my homework");
        refuses("This city is more difficult.", "This city is more hard");
        refuses("My little brother plays football.", "My small brother plays football");
        refuses("What is the weather like today?", "What is the weather love today");
        refuses("He is afraid of dogs.", "He is afraid dogs");
        refuses("I like reading books.", "I like read books", "I hate reading books", "I like reading book");
    }

    @Test
    void onlyTranslationTasksTakeSynonyms() {
        LearnItem gap = new LearnItem("g", "FILL", "I ___ reading books.", null, "like", List.of(), null, null);
        assertFalse(gap.matches("love"));
        LearnItem order = new LearnItem("o", "ORDER", "Inglizchaga tarjima qiling: Gap.", null, "I like music",
                List.of(), List.of("I", "like", "music"), null);
        assertFalse(order.matches("I love music"));
    }
}
