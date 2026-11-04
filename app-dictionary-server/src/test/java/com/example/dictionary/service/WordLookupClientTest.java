package com.example.dictionary.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class WordLookupClientTest {

    @Test
    void parsesTheFirstDefinitionExampleAndPhonetic() {
        List<?> response = List.of(Map.of(
                "word", "apple",
                "phonetic", "/ˈæp.əl/",
                "meanings", List.of(Map.of(
                        "partOfSpeech", "noun",
                        "definitions", List.of(
                                Map.of("definition", "A round fruit."),
                                Map.of("definition", "A tree.", "example", "An apple a day."))))));

        WordLookupClient.Entry entry = WordLookupClient.parseEntries(response).orElseThrow();

        assertThat(entry.definition()).isEqualTo("A round fruit.");
        assertThat(entry.example()).isEqualTo("An apple a day.");
        assertThat(entry.phonetic()).isEqualTo("/ˈæp.əl/");
    }

    @Test
    void returnsNothingForAnEmptyResponse() {
        assertThat(WordLookupClient.parseEntries(List.of())).isEmpty();
    }

    @Test
    void takesTheTranslatedTextAndKeepsLowercase() {
        Map<?, ?> body = Map.of("responseData", Map.of("translatedText", "Olma"), "matches", List.of());
        assertThat(WordLookupClient.parseTranslation("apple", body)).contains("olma");
    }

    @Test
    void skipsWarningsCyrillicAndUntranslatedEchoes() {
        Map<?, ?> body = Map.of(
                "responseData", Map.of("translatedText", "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS"),
                "matches", List.of(
                        Map.of("translation", "олма"),
                        Map.of("translation", "apple"),
                        Map.of("translation", "olma")));
        assertThat(WordLookupClient.parseTranslation("apple", body)).contains("olma");
    }

    @Test
    void returnsNothingWhenNoCandidateIsUsable() {
        Map<?, ?> body = Map.of("responseData", Map.of("translatedText", "apple"), "matches", List.of());
        assertThat(WordLookupClient.parseTranslation("apple", body)).isEmpty();
    }

    @Test
    void googleKeepsTheMainTranslationAndUpToTwoOtherSenses() {
        List<?> body = List.of(
                List.of(List.of("yugur", "run")),
                List.of(
                        List.of("noun", List.of("yugurish", "aylanish")),
                        List.of("verb", List.of("yugurmoq", "aylanmoq"))));
        assertThat(WordLookupClient.parseGoogle("run", body)).contains("yugur, yugurish, aylanish");
    }

    @Test
    void googleIgnoresAnUntranslatedEcho() {
        List<?> body = List.of(List.of(List.of("Apple", "apple")));
        assertThat(WordLookupClient.parseGoogle("apple", body)).isEmpty();
    }

    @Test
    void googleUsesOnlyTheSentenceTranslationForPhrases() {
        List<?> body = List.of(
                List.of(List.of("yaxshi ", "good "), List.of("kun", "day")),
                List.of(List.of("noun", List.of("boshqa"))));
        assertThat(WordLookupClient.parseGoogle("good day", body)).contains("yaxshi kun");
    }

    @Test
    void wiktionaryStripsHtml() {
        Map<?, ?> body = Map.of("en", List.of(Map.of("definitions", List.of(
                Map.of("definition", "A <a href=\"x\">round</a> fruit.", "examples", List.of("An <b>apple</b>."))))));
        WordLookupClient.Entry entry = WordLookupClient.parseWiktionary(body).orElseThrow();
        assertThat(entry.definition()).isEqualTo("A round fruit.");
        assertThat(entry.example()).isEqualTo("An apple.");
    }

    @Test
    void baseFormsCoverCommonInflections() {
        assertThat(WordLookupClient.baseForms("running")).contains("run");
        assertThat(WordLookupClient.baseForms("studies")).contains("study");
        assertThat(WordLookupClient.baseForms("liked")).contains("like");
        assertThat(WordLookupClient.baseForms("good day")).containsExactly("good day");
    }
}
