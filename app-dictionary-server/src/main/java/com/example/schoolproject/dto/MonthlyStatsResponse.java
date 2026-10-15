package com.example.schoolproject.dto;

import java.time.YearMonth;

/** One month's activity. {@code accuracyPercent} is {@code correctAnswers} out of all answers given that month. */
public record MonthlyStatsResponse(
        YearMonth month,
        int wordsAdded,
        int quizzesTaken,
        int correctAnswers,
        int incorrectAnswers,
        double accuracyPercent
) {
}
