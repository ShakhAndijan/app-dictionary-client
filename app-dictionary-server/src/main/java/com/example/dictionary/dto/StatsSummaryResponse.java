package com.example.dictionary.dto;

import java.util.List;

/**
 * All-time totals for the Profil tab. {@code currentStreak} counts consecutive active days ending today
 * (or yesterday, so the streak is not lost before the user has practised today).
 */
public record StatsSummaryResponse(
        int totalWords,
        int totalQuizzes,
        int totalCorrect,
        int totalIncorrect,
        double accuracyPercent,
        int activeDays,
        int currentStreak,
        int bestStreak,
        List<FormatStatsResponse> formats
) {
}
