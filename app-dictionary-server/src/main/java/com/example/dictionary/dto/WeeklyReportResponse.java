package com.example.dictionary.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * One Monday-to-Sunday week of activity next to the week before it. {@code days} always has seven entries;
 * {@code bestDay} is the day with the most answers (null for an empty week).
 * {@code totals}, {@code days} and {@code bestDay} describe the word trainer; {@code english} and
 * {@code programming} describe the two courses. XP in {@code totals} counts every direction.
 */
public record WeeklyReportResponse(
        LocalDate weekStart,
        LocalDate weekEnd,
        boolean currentWeek,
        Totals totals,
        Totals previous,
        List<Day> days,
        LocalDate bestDay,
        Course english,
        Course programming
) {

    /**
     * A week in one course. {@code answers} are the graded exercises of finished lessons and exams,
     * {@code labs} the coding labs solved (programming only).
     */
    public record Course(
            int answers,
            int correct,
            double accuracyPercent,
            int lessons,
            int passed,
            int labs,
            int activeDays,
            CoursePrevious previous,
            List<CourseDay> days,
            List<Part> parts
    ) {
    }

    public record CoursePrevious(int answers, double accuracyPercent, int lessons, int labs) {
    }

    public record CourseDay(LocalDate date, int answers, int correct, int lessons, int labs) {
    }

    /** One skill of the English course or one module of the programming course ("exam" for level exams). */
    public record Part(String key, int answers, int correct, double accuracyPercent, int lessons) {
    }

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
