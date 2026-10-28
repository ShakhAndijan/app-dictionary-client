package com.example.dictionary.dto;

/** The next question in a quiz session. {@code promptType} is one of "english", "uzbek", "definition". */
public record QuizQuestionResponse(
        Long sessionId,
        String promptType,
        String promptText,
        QuizProgressResponse progress
) {
}
