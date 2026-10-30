package com.example.dictionary.service;

/**
 * XP to level conversion. Reaching level {@code n} takes {@code 50 * n * (n - 1)} XP in total, so each level asks
 * 100 XP more than the previous one: level 2 at 100, level 5 at 1,000, level 10 at 4,500, level 20 at 19,000.
 */
public final class Levels {

    private static final int STEP = 50;

    private Levels() {
    }

    /** Total XP needed to reach {@code level} (level 1 starts at 0). */
    public static long thresholdFor(int level) {
        return (long) STEP * level * (level - 1);
    }

    public static int levelFor(long xp) {
        long safe = Math.max(0, xp);
        int level = (int) ((1 + Math.sqrt(1 + 4.0 * safe / STEP)) / 2);
        // The square root is only an estimate; settle it exactly.
        while (thresholdFor(level + 1) <= safe) {
            level++;
        }
        while (level > 1 && thresholdFor(level) > safe) {
            level--;
        }
        return Math.max(level, 1);
    }

    public static String titleFor(int level) {
        if (level >= 30) {
            return "Afsona";
        }
        if (level >= 20) {
            return "Donishmand";
        }
        if (level >= 15) {
            return "Ustoz";
        }
        if (level >= 10) {
            return "Mohir";
        }
        if (level >= 7) {
            return "Bilimdon";
        }
        if (level >= 5) {
            return "Izlanuvchi";
        }
        if (level >= 3) {
            return "O'quvchi";
        }
        return "Boshlovchi";
    }
}
