package com.example.dictionary.service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Decides whether a typed quiz answer matches the stored word.
 *
 * <p>Matching is forgiving about things that are not real mistakes:
 * <ul>
 *   <li>case, surrounding/duplicate whitespace, punctuation and hyphens ({@code "Mother-in-law!"});</li>
 *   <li>the different apostrophes used for Uzbek {@code o'} / {@code g'} ({@code ' ʻ ʼ ’ ` ´});</li>
 *   <li>a leading {@code to}, {@code the}, {@code a}, {@code an} ({@code "to run"} for {@code "run"});</li>
 *   <li>text in parentheses, which is treated as optional ({@code "run (fast)"});</li>
 *   <li>stored answers listing several translations ({@code "olma, olxo'ri"}): any single one is accepted.</li>
 * </ul>
 * A small typo (one wrong, missing, extra or swapped letter) is still accepted but reported as
 * {@link Result#TYPO} so the client can show the correct spelling. Very short words never get
 * typo tolerance, otherwise {@code cat} and {@code car} would be interchangeable.
 */
public final class AnswerMatcher {

    public enum Result {
        /** Matches once normalised. */
        EXACT,
        /** Within the allowed edit distance: counted as correct, but the spelling was off. */
        TYPO,
        WRONG;

        public boolean isCorrect() {
            return this != WRONG;
        }
    }

    private static final Pattern APOSTROPHES = Pattern.compile("[‘’ʻʼʹ′`´]");
    private static final Pattern PARENTHESISED = Pattern.compile("\\([^)]*\\)");
    private static final Pattern SEPARATORS = Pattern.compile("[,;/]");
    private static final Pattern NOISE = Pattern.compile("[^\\p{L}\\p{N}' ]");
    private static final Pattern WHITESPACE = Pattern.compile("\\s+");
    private static final Pattern LEADING_FILLER = Pattern.compile("^(to|the|a|an) (?=.)");

    private AnswerMatcher() {
    }

    public static Result match(String given, String expected) {
        String answer = normalize(given);
        if (answer.isEmpty()) {
            return Result.WRONG;
        }

        List<String> candidates = candidates(expected);
        if (candidates.contains(answer)) {
            return Result.EXACT;
        }
        for (String candidate : candidates) {
            if (editDistance(answer, candidate) <= allowedTypos(candidate)) {
                return Result.TYPO;
            }
        }
        return Result.WRONG;
    }

    /** The full stored answer plus each of its comma/semicolon/slash separated translations. */
    private static List<String> candidates(String expected) {
        List<String> result = new ArrayList<>();
        if (expected == null) {
            return result;
        }
        addDistinct(result, normalize(expected));
        // "run (fast)" is also accepted as "run".
        addDistinct(result, normalize(PARENTHESISED.matcher(expected).replaceAll(" ")));
        for (String part : SEPARATORS.split(expected)) {
            addDistinct(result, normalize(part));
            addDistinct(result, normalize(PARENTHESISED.matcher(part).replaceAll(" ")));
        }
        return result;
    }

    private static void addDistinct(List<String> list, String value) {
        if (!value.isEmpty() && !list.contains(value)) {
            list.add(value);
        }
    }

    static String normalize(String value) {
        if (value == null) {
            return "";
        }
        String text = Normalizer.normalize(value, Normalizer.Form.NFC);
        text = APOSTROPHES.matcher(text).replaceAll("'").toLowerCase(Locale.ROOT);
        text = text.replace('-', ' ');
        text = NOISE.matcher(text).replaceAll(" ");
        text = WHITESPACE.matcher(text).replaceAll(" ").trim();
        return LEADING_FILLER.matcher(text).replaceFirst("");
    }

    /** How many single-letter edits are forgiven for an expected answer of this length. */
    private static int allowedTypos(String expected) {
        int length = expected.length();
        if (length <= 3) {
            return 0;
        }
        return length <= 7 ? 1 : 2;
    }

    /** Optimal string alignment distance: insert, delete, substitute or swap two neighbouring letters. */
    static int editDistance(String a, String b) {
        int[][] d = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) {
            d[i][0] = i;
        }
        for (int j = 0; j <= b.length(); j++) {
            d[0][j] = j;
        }
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                d[i][j] = Math.min(Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1), d[i - 1][j - 1] + cost);
                if (i > 1 && j > 1 && a.charAt(i - 1) == b.charAt(j - 2) && a.charAt(i - 2) == b.charAt(j - 1)) {
                    d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
                }
            }
        }
        return d[a.length()][b.length()];
    }
}
