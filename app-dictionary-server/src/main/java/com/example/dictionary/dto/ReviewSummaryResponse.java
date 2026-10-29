package com.example.dictionary.dto;

/**
 * What the user can review right now. {@code dueCount} and {@code newCount} already respect the daily limits,
 * so they are exactly the size of a "Takrorlash" session.
 */
public record ReviewSummaryResponse(
        int dueCount,
        int newCount,
        int learningCount,
        int masteredCount,
        int totalWords,
        int weakCount,
        int dailyGoal,
        int todayDone
) {
}
