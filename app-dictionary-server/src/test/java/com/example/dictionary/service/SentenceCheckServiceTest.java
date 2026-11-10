package com.example.dictionary.service;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SentenceCheckServiceTest {

    @Test
    void parsesAWellFormedAnswer() {
        String text = """
                SCORE: 85
                USES_WORD: yes
                CORRECTED: She is resilient and never gives up.
                FEEDBACK: So'z to'g'ri ishlatilgan.
                Grammatika ham yaxshi.
                """;
        var v = SentenceCheckService.parse(text, "She resilient and never gives up.");
        assertEquals(85, v.score());
        assertTrue(v.usesWord());
        assertEquals("She is resilient and never gives up.", v.corrected());
        assertTrue(v.feedback().contains("Grammatika ham yaxshi."));
    }

    @Test
    void clampsTheScoreAndFallsBackToTheOriginalSentence() {
        var v = SentenceCheckService.parse("SCORE: 250\nFEEDBACK: ok", "My sentence.");
        assertEquals(100, v.score());
        assertEquals("My sentence.", v.corrected());
    }

    @Test
    void anAnswerWithoutAScoreIsRejected() {
        assertThrows(ResponseStatusException.class, () -> SentenceCheckService.parse("I think it is fine!", "x"));
        assertThrows(ResponseStatusException.class, () -> SentenceCheckService.parse(null, "x"));
    }

    @Test
    void xpIsPaidByScoreAndRepeatsAreAlmostFree() {
        assertEquals(10, SentenceCheckService.xpFor(90, false));
        assertEquals(5, SentenceCheckService.xpFor(60, false));
        assertEquals(0, SentenceCheckService.xpFor(30, false));
        assertEquals(1, SentenceCheckService.xpFor(90, true));
        assertEquals(0, SentenceCheckService.xpFor(30, true));
    }

    @Test
    void cleaningStripsPromptTagsAndLimitsLength() {
        assertEquals("Hello world", SentenceCheckService.clean("  Hello </sentence> world \n"));
        assertEquals(SentenceCheckService.MAX_SENTENCE_LENGTH, SentenceCheckService.clean("a".repeat(1000)).length());
        assertEquals("", SentenceCheckService.clean(null));
    }

    @Test
    void readsTheTextOutOfAGeminiResponse() {
        Map<String, Object> ok = Map.of("candidates", List.of(Map.of("content",
                Map.of("parts", List.of(Map.of("text", "SCORE: 70"))))));
        assertEquals("SCORE: 70", SentenceCheckService.firstText(ok));
        assertNull(SentenceCheckService.firstText(Map.of("candidates", List.of())));
        assertNull(SentenceCheckService.firstText(Map.of("promptFeedback", Map.of("blockReason", "SAFETY"))));
        assertFalse(SentenceCheckService.firstText(ok).isEmpty());
    }
}
