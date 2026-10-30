package com.example.dictionary.dto;

import java.time.Instant;

/** One achievement with the user's progress towards it. {@code justUnlocked} = unlocked but not yet celebrated in the app. */
public record AchievementResponse(
        String code,
        String title,
        String description,
        String icon,
        String tier,
        int xpReward,
        int current,
        int target,
        boolean unlocked,
        Instant unlockedAt,
        boolean justUnlocked
) {
}
