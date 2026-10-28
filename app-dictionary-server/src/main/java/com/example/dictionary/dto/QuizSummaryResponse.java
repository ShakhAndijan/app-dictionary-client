package com.example.dictionary.dto;

import com.example.dictionary.model.QuizMode;

import java.time.Instant;

/** Final result of a finished quiz session. */
public record QuizSummaryResponse(
        Long sessionId,
        QuizMode mode,
        int totalAnswered,
        int correctCount,
        int incorrectCount,
        Instant startedAt,
        Instant finishedAt
) {
}
