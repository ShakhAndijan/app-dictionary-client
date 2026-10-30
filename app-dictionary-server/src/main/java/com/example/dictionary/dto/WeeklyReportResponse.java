package com.example.dictionary.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * One Monday-to-Sunday week of activity next to the week before it. {@code days} always has seven entries;
 * {@code bestDay} is the day with the most answers (null for an empty week).
 */
public record WeeklyReportResponse(
        LocalDate weekStart,
        LocalDate weekEnd,
        boolean currentWeek,
        Totals totals,
        Totals previous,
        List<Day> days,
        LocalDate bestDay
) {

    /** {@code goalDays} counts the days on which the daily goal was reached. */
    public record Totals(
            int answers,
            int correct,
            double accuracyPercent,
            int wordsAdded,
            int wordsPracticed,
            int xp,
            int activeDays,
            int goalDays
    ) {
    }

    public record Day(
            LocalDate date,
            int answers,
            int correct,
            int wordsAdded,
            int xp
    ) {
    }
}
