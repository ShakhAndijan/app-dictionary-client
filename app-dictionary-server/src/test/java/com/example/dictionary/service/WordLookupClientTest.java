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
}
