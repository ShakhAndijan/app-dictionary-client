package com.example.dictionary.dto;

import java.util.List;

/** The next question in a quiz session. {@code promptType} is one of "english", "uzbek", "definition".
 * {@code options} holds the choices for a multiple-choice session and is {@code null} for typed ones. */
public record QuizQuestionResponse(
        Long sessionId,
        String promptType,
        String promptText,
        QuizProgressResponse progress,
        List<String> options
) {
}
