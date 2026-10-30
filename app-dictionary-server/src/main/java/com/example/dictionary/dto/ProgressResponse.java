package com.example.dictionary.dto;

import java.util.List;

/**
 * The user's XP, level and achievements. {@code xpIntoLevel} / {@code xpForLevel} describe the progress bar
 * towards the next level (xpIntoLevel of xpForLevel).
 */
public record ProgressResponse(
        long totalXp,
        int level,
        String levelTitle,
        long xpIntoLevel,
        long xpForLevel,
        long todayXp,
        long weekXp,
        int unlockedCount,
        int totalAchievements,
        List<AchievementResponse> achievements
) {
}
