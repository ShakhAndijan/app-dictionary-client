package com.example.schoolproject.dto;

import com.example.schoolproject.model.QuizMode;

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
