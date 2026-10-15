package com.example.schoolproject.dto;

/** The next question in a quiz session. {@code promptType} is one of "english", "uzbek", "definition". */
public record QuizQuestionResponse(
        Long sessionId,
        String promptType,
        String promptText,
        QuizProgressResponse progress
) {
}
