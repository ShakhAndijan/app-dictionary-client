package com.example.dictionary.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Set;

/**
 * One exercise of a lesson, as written in the content files.
 *
 * <ul>
 *   <li>CHOICE: pick one of {@code options}; {@code answer} is one of them.</li>
 *   <li>FILL: type the missing word(s); {@code answer} plus any {@code alsoAccept} spelling is correct.</li>
 *   <li>ORDER: put the {@code words} into a sentence; {@code answer} is the finished sentence.</li>
 *   <li>SPEAK: the learner says the {@code prompt} aloud; the app sends back what the speech recognition heard,
 *       and it counts when most of the {@code answer} words were heard in order.</li>
 *   <li>WRITE is reserved for later (it needs an AI grader).</li>
 * </ul>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record LearnItem(String id, String kind, String prompt, List<String> options, String answer,
                        List<String> alsoAccept, List<String> words, String explain,
                        String passage, String audio) {

    /** Item without its own text or audio (the lesson may carry one for all its items). */
    public LearnItem(String id, String kind, String prompt, List<String> options, String answer,
                     List<String> alsoAccept, List<String> words, String explain) {
        this(id, kind, prompt, options, answer, alsoAccept, words, explain, null, null);
    }

    public static final Set<String> OBJECTIVE_KINDS = Set.of("CHOICE", "FILL", "ORDER", "SPEAK");

    /** Share of the target words that must be heard for a spoken answer to count. */
    public static final double SPEECH_PASS = 0.75;

    public boolean objective() {
        return OBJECTIVE_KINDS.contains(kind);
    }

    /** Lower-cases, unifies apostrophes, collapses spaces and drops trailing punctuation. */
    static String normalize(String text) {
        if (text == null) return "";
        String t = text.replace('’', '\'').replace('‘', '\'').trim().toLowerCase();
        t = t.replaceAll("\\s+", " ");
        return t.replaceAll("[.!?]+$", "").trim();
    }

    public boolean matches(String given) {
        String g = normalize(given);
        if (g.isEmpty()) return false;
        if ("SPEAK".equals(kind)) return speechScore(answer, given) >= SPEECH_PASS;
        if (g.equals(normalize(answer))) return true;
        return alsoAccept != null && alsoAccept.stream().anyMatch(a -> g.equals(normalize(a)));
    }

    /** Words of a sentence with contractions spelled out, so "I'm" and "I am" are the same thing. */
    static List<String> speechWords(String text) {
        String t = normalize(text)
                .replace("n't", " not").replace("'m", " am").replace("'re", " are")
                .replace("'ll", " will").replace("'ve", " have").replace("'s", " is").replace("'d", " would")
                .replaceAll("[^a-z0-9 ]", " ").trim();
        return t.isEmpty() ? List.of() : java.util.Arrays.asList(t.split("\\s+"));
    }

    /** Fraction of the target words found, in order, in what was heard (longest common subsequence). */
    static double speechScore(String target, String heard) {
        List<String> t = speechWords(target);
        List<String> h = speechWords(heard);
        if (t.isEmpty() || h.isEmpty()) return 0;
        int[][] dp = new int[t.size() + 1][h.size() + 1];
        for (int i = 1; i <= t.size(); i++) {
            for (int j = 1; j <= h.size(); j++) {
                dp[i][j] = t.get(i - 1).equals(h.get(j - 1)) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[t.size()][h.size()] / (double) t.size();
    }

    /** Problem description when the item can not be used, otherwise null. Used when loading content files. */
    public String problem() {
        if (id == null || id.isBlank()) return "item without id";
        if (prompt == null || prompt.isBlank()) return "item " + id + " has no prompt";
        if (answer == null || answer.isBlank()) return "item " + id + " has no answer";
        if (kind == null) return "item " + id + " has no kind";
        switch (kind) {
            case "CHOICE":
                if (options == null || options.size() < 2) return "item " + id + " needs at least 2 options";
                if (options.stream().noneMatch(o -> normalize(o).equals(normalize(answer)))) {
                    return "item " + id + ": answer is not among the options";
                }
                return null;
            case "FILL":
                return null;
            case "ORDER":
                if (words == null || words.size() < 2) return "item " + id + " needs at least 2 words";
                if (!sameWords(words, answer)) return "item " + id + ": words do not form the answer";
                return null;
            case "SPEAK":
            case "WRITE":
                return null;
            default:
                return "item " + id + " has unknown kind " + kind;
        }
    }

    private static boolean sameWords(List<String> words, String answer) {
        List<String> a = words.stream().map(LearnItem::normalize).sorted().toList();
        List<String> b = java.util.Arrays.stream(normalize(answer).split(" ")).sorted().toList();
        return a.equals(b);
    }
}
