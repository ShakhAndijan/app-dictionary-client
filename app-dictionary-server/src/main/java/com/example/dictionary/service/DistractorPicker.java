package com.example.dictionary.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;

/**
 * Picks wrong options for a multiple-choice question. Options that look like the correct answer
 * (similar length, same first/last letter, small edit distance) are preferred, so the test cannot be
 * passed by simply spotting the odd one out.
 */
final class DistractorPicker {

    /** How many of the most similar candidates the final picks are drawn from, per option wanted. */
    private static final int POOL_PER_OPTION = 2;

    private DistractorPicker() {
    }

    /**
     * @param correct the right answer
     * @param pool    other values that could serve as wrong options (the user's other words)
     * @param count   how many wrong options are needed
     * @return up to {@code count} distinct wrong options, in random order
     */
    static List<String> pick(String correct, Collection<String> pool, int count, Random random) {
        String target = correct.toLowerCase(Locale.ROOT).trim();

        Map<String, String> unique = new LinkedHashMap<>();
        for (String value : pool) {
            if (value == null || value.isBlank()) {
                continue;
            }
            String key = value.toLowerCase(Locale.ROOT).trim();
            if (key.equals(target) || AnswerMatcher.match(value, correct) == AnswerMatcher.Result.EXACT) {
                continue;
            }
            unique.putIfAbsent(key, value);
        }

        List<String> ranked = new ArrayList<>(unique.keySet());
        ranked.sort(Comparator.comparingInt((String candidate) -> distance(target, candidate)));
        List<String> closest = new ArrayList<>(ranked.subList(0, Math.min(ranked.size(), count * POOL_PER_OPTION)));
        java.util.Collections.shuffle(closest, random);

        List<String> picked = new ArrayList<>();
        for (String key : closest.subList(0, Math.min(count, closest.size()))) {
            picked.add(unique.get(key));
        }
        return picked;
    }

    /** Lower is more similar. */
    private static int distance(String target, String candidate) {
        int score = editDistance(target, candidate) + Math.abs(target.length() - candidate.length());
        if (!target.isEmpty() && !candidate.isEmpty()) {
            if (target.charAt(0) == candidate.charAt(0)) {
                score -= 3;
            }
            if (target.charAt(target.length() - 1) == candidate.charAt(candidate.length() - 1)) {
                score -= 1;
            }
        }
        return score;
    }

    private static int editDistance(String a, String b) {
        int[] previous = new int[b.length() + 1];
        int[] current = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) {
            previous[j] = j;
        }
        for (int i = 1; i <= a.length(); i++) {
            current[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                current[j] = Math.min(Math.min(current[j - 1] + 1, previous[j] + 1), previous[j - 1] + cost);
            }
            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return previous[b.length()];
    }
}
