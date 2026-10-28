package com.example.dictionary.dto;

/**
 * Session progress. When {@code unlimited} is false, the session auto-finishes once
 * {@code answered == totalWords}; the client should show a "Tugatish" (finish) button
 * only when {@code unlimited} is true, since that mode never ends on its own.
 */
public record QuizProgressResponse(
        int answered,
        int correctCount,
        int incorrectCount,
        int totalWords,
        boolean unlimited,
        boolean finished
) {
}
