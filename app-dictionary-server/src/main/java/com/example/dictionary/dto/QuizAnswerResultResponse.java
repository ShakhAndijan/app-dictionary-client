package com.example.dictionary.dto;

import java.util.List;

/**
 * Result of submitting an answer. {@code closeMatch} is true when the answer was accepted despite
 * a small typo (it still counts as {@code correct}). {@code nextPromptType}/{@code nextPromptText} are
 * {@code null} when the session just finished (see {@code progress.finished}). {@code xpGained} is the XP this
 * answer earned (0 for a wrong answer). {@code nextAnswerLanguage} is the language the next answer must be in
 * ("english" or "uzbek"), {@code null} when the session finished.
 */
public record QuizAnswerResultResponse(
        boolean correct,
        boolean closeMatch,
        String correctAnswer,
        String answeredPromptType,
        QuizProgressResponse progress,
        String nextPromptType,
        String nextPromptText,
        List<String> nextOptions,
        int xpGained,
        String nextAnswerLanguage
) {
}
