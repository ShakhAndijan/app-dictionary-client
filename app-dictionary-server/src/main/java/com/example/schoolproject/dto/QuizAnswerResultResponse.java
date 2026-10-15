package com.example.schoolproject.dto;

/**
 * Result of submitting an answer. {@code nextPromptType}/{@code nextPromptText} are
 * {@code null} when the session just finished (see {@code progress.finished}).
 */
public record QuizAnswerResultResponse(
        boolean correct,
        String correctAnswer,
        String answeredPromptType,
        QuizProgressResponse progress,
        String nextPromptType,
        String nextPromptText
) {
}
