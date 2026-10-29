package com.example.dictionary.dto;

import java.util.List;

/**
 * Result of submitting an answer. {@code closeMatch} is true when the answer was accepted despite
 * a small typo (it still counts as {@code correct}). {@code nextPromptType}/{@code nextPromptText} are
 * {@code null} when the session just finished (see {@code progress.finished}).
 */
public record QuizAnswerResultResponse(
        boolean correct,
        boolean closeMatch,
        String correctAnswer,
        String answeredPromptType,
        QuizProgressResponse progress,
        String nextPromptType,
        String nextPromptText,
        List<String> nextOptions
) {
}
