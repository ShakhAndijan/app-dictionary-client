package com.example.dictionary.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.InputStream;

import static org.assertj.core.api.Assertions.assertThat;

/** Typed exercises about possession take both "have" and "have got" (content/add-have-got.cjs). */
class HaveGotContentTest {

    private static LearnItem item(String file, String prompt) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        try (InputStream in = HaveGotContentTest.class.getResourceAsStream("/learn/" + file)) {
            for (JsonNode lesson : mapper.readTree(in)) {
                for (JsonNode item : lesson.get("items")) {
                    if ("FILL".equals(item.get("kind").asText()) && item.get("prompt").asText().endsWith(prompt)) {
                        return mapper.treeToValue(item, LearnItem.class);
                    }
                }
            }
        }
        throw new AssertionError("No exercise: " + prompt);
    }

    @Test
    void translationsTakeEitherForm() throws Exception {
        LearnItem notebook = item("a1-writing.json", "Mening yangi daftarim bor.");
        assertThat(notebook.matches("I have got a new notebook")).isTrue();
        assertThat(notebook.matches("I have a new notebook.")).isTrue();
        assertThat(notebook.matches("I've got a new notebook")).isTrue();

        LearnItem brothers = item("a1-writing.json", "Mening ikkita akam bor.");
        assertThat(brothers.matches("I have got two brothers")).isTrue();
    }

    @Test
    void gapsTakeEitherFormForPossession() throws Exception {
        assertThat(item("a1-grammar.json", "I ___ a new phone.").matches("have")).isTrue();
        assertThat(item("a1-grammar.json", "He ___ a car.").matches("doesn't have")).isTrue();
        assertThat(item("a1-grammar.json", "My dog ___ big ears.").matches("has got")).isTrue();
    }

    @Test
    void actionsStillNeedPlainHave() throws Exception {
        LearnItem breakfast = item("a1-grammar.json", "I ___ breakfast at eight.");
        assertThat(breakfast.matches("have")).isTrue();
        assertThat(breakfast.matches("have got")).isFalse();
    }
}
