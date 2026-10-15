package com.example.schoolproject.dto;

import java.time.LocalDate;

/** One day's activity. {@code accuracyPercent} is {@code correctAnswers} out of all answers given that day. */
public record DailyStatsResponse(
        LocalDate date,
        int wordsAdded,
        int quizzesTaken,
        int correctAnswers,
        int incorrectAnswers,
        double accuracyPercent
) {
}
