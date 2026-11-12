package com.example.dictionary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class SentenceDtos {

    private SentenceDtos() {
    }

    public record SentenceCheckRequest(
            @NotNull Long wordId,
            @NotBlank @Size(max = 600) String sentence) {
    }

    /**
     * @param score        0-100
     * @param usesWord     the sentence really uses the target word
     * @param corrected    the sentence with mistakes fixed (the same text when it was already right)
     * @param feedback     a short explanation in Uzbek
     * @param xpGained     XP earned by this check
     * @param remainingToday checks the user still has today
     */
    public record SentenceCheckResponse(int score, boolean usesWord, String corrected, String feedback,
                                        int xpGained, int remainingToday) {
    }

    /** @param enabled false when the server has no Gemini key configured */
    public record SentenceStatusResponse(boolean enabled, int remainingToday, int dailyLimit,
                                         int dailyGoal, int doneToday, int goodToday) {
    }

    /** One day of the last-week chart. */
    public record SentenceDay(String date, int count) {
    }

    public record SentenceStatsResponse(long total, int averageScore, long good, int dailyGoal,
                                        int goalDays, java.util.List<SentenceDay> last7) {
    }
}
