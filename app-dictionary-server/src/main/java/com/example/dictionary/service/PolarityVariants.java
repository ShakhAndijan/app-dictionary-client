package com.example.dictionary.service;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * "She ___ today. (work)" does not say whether she works or does not, so "works" and "doesn't work" are both right.
 * This builds the opposite-polarity spelling of a (normalised) answer, but only for short, context-free prompts.
 */
final class PolarityVariants {

    private PolarityVariants() {}

    private static final Pattern HINT = Pattern.compile("\\(([a-z' ]+)\\)\\s*[.?!]?\\s*$", Pattern.CASE_INSENSITIVE);
    private static final Pattern CLAUSE = Pattern.compile("^[^,;:.?!]*___[^,;:.?!]*\\.?$");
    private static final Pattern CONTEXT_WORDS = Pattern.compile(
            "\\b(not|never|no|nobody|nothing|n't|but|so|because|if|when|while|although|unless|and|or|than|since|yet|still|already|just|ever|"
                    + "only|too|either|neither|please)\\b",
            Pattern.CASE_INSENSITIVE);
    /** In front of the blank these mean the blank is not the finite verb ("She can ___", "He is ___", "needs ___"). */
    private static final Pattern BEFORE_ONLY = Pattern.compile(
            "\\b(should|must|can|could|will|would|may|might|to|do|does|did|am|is|are|was|were|has|have|had|be|been|get|gets|got|"
                    + "need|needs|want|wants|like|likes|love|loves|hate|hates|let|make|makes|help|helps|enjoy|enjoys|stop|stops|start|starts)\\b",
            Pattern.CASE_INSENSITIVE);

    private static final Map<String, String[]> NEGATIVE_OF_AUX = Map.ofEntries(
            Map.entry("am", new String[]{"am not"}),
            Map.entry("is", new String[]{"isn't", "is not"}),
            Map.entry("are", new String[]{"aren't", "are not"}),
            Map.entry("was", new String[]{"wasn't", "was not"}),
            Map.entry("were", new String[]{"weren't", "were not"}),
            Map.entry("has", new String[]{"hasn't", "has not"}),
            Map.entry("have", new String[]{"haven't", "have not"}),
            Map.entry("had", new String[]{"hadn't", "had not"}),
            Map.entry("can", new String[]{"can't", "cannot", "can not"}),
            Map.entry("could", new String[]{"couldn't", "could not"}),
            Map.entry("will", new String[]{"won't", "will not"}),
            Map.entry("would", new String[]{"wouldn't", "would not"}),
            Map.entry("should", new String[]{"shouldn't", "should not"}),
            Map.entry("must", new String[]{"mustn't", "must not"}));

    private static final Map<String, String> AFFIRMATIVE_OF_CONTRACTION = Map.ofEntries(
            Map.entry("isn't", "is"), Map.entry("aren't", "are"), Map.entry("wasn't", "was"), Map.entry("weren't", "were"),
            Map.entry("hasn't", "has"), Map.entry("haven't", "have"), Map.entry("hadn't", "had"), Map.entry("can't", "can"),
            Map.entry("cannot", "can"), Map.entry("couldn't", "could"), Map.entry("won't", "will"), Map.entry("wouldn't", "would"),
            Map.entry("shouldn't", "should"), Map.entry("mustn't", "must"));

    private static final Map<String, String> IRREGULAR_PAST = Map.ofEntries(
            Map.entry("go", "went"), Map.entry("see", "saw"), Map.entry("take", "took"), Map.entry("buy", "bought"),
            Map.entry("eat", "ate"), Map.entry("drink", "drank"), Map.entry("write", "wrote"), Map.entry("come", "came"),
            Map.entry("give", "gave"), Map.entry("get", "got"), Map.entry("have", "had"), Map.entry("make", "made"),
            Map.entry("say", "said"), Map.entry("tell", "told"), Map.entry("find", "found"), Map.entry("know", "knew"),
            Map.entry("think", "thought"), Map.entry("leave", "left"), Map.entry("meet", "met"), Map.entry("run", "ran"),
            Map.entry("sit", "sat"), Map.entry("speak", "spoke"), Map.entry("sleep", "slept"), Map.entry("bring", "brought"),
            Map.entry("begin", "began"), Map.entry("win", "won"), Map.entry("lose", "lost"), Map.entry("pay", "paid"),
            Map.entry("send", "sent"), Map.entry("sing", "sang"), Map.entry("swim", "swam"), Map.entry("teach", "taught"),
            Map.entry("wear", "wore"), Map.entry("forget", "forgot"), Map.entry("drive", "drove"), Map.entry("fly", "flew"),
            Map.entry("fall", "fell"), Map.entry("feel", "felt"), Map.entry("keep", "kept"), Map.entry("hear", "heard"),
            Map.entry("build", "built"), Map.entry("draw", "drew"), Map.entry("grow", "grew"), Map.entry("break", "broke"),
            Map.entry("choose", "chose"), Map.entry("steal", "stole"), Map.entry("wake", "woke"), Map.entry("do", "did"));

    /** The verb in brackets after the blank, e.g. "work" in "She ___ today. (work)"; null when there is none. */
    static String hint(String prompt) {
        if (prompt == null) return null;
        Matcher m = HINT.matcher(prompt.trim());
        return m.find() ? m.group(1).trim().toLowerCase() : null;
    }

    /** True for a one-clause prompt with nothing around the blank that would fix affirmative or negative. */
    static boolean neutralPrompt(String prompt) {
        if (prompt == null || prompt.indexOf("___") < 0) return false;
        String t = HINT.matcher(prompt.trim()).replaceAll("").trim();
        if (!CLAUSE.matcher(t).matches()) return false;
        int at = t.indexOf("___");
        String before = t.substring(0, at).trim();
        String after = t.substring(at + 3).replaceAll("[.]+$", "").trim();
        if (before.isEmpty() || before.split("\\s+").length > 3) return false; // starts with the blank or a long lead-in
        if (!after.isEmpty() && after.split("\\s+").length > 6) return false;
        // The lead-in is a subject only: no auxiliary / modal / "to" in front of the blank, nothing negative or contrasting anywhere.
        return !CONTEXT_WORDS.matcher(before).find() && !BEFORE_ONLY.matcher(before).find() && !CONTEXT_WORDS.matcher(after).find();
    }

    /** Opposite-polarity spellings of {@code answer} (normalised, lower-case); empty when it cannot be built safely. */
    static Set<String> of(String answer, String hint) {
        Set<String> out = new LinkedHashSet<>();
        if (answer == null || answer.isBlank()) return out;
        String[] w = answer.split(" ", -1);
        String first = w[0];
        String rest = w.length > 1 ? " " + String.join(" ", java.util.Arrays.copyOfRange(w, 1, w.length)) : "";

        // Already negative with an auxiliary: drop the negation.
        if (AFFIRMATIVE_OF_CONTRACTION.containsKey(first)) {
            out.add(AFFIRMATIVE_OF_CONTRACTION.get(first) + rest);
            return out;
        }
        if (w.length > 1 && w[1].equals("not") && NEGATIVE_OF_AUX.containsKey(first)) {
            out.add(first + (w.length > 2 ? " " + String.join(" ", java.util.Arrays.copyOfRange(w, 2, w.length)) : ""));
            return out;
        }
        // Affirmative with an auxiliary: add the negation.
        if (NEGATIVE_OF_AUX.containsKey(first)) {
            for (String neg : NEGATIVE_OF_AUX.get(first)) out.add(neg + rest);
            return out;
        }
        if (hint == null || hint.isBlank() || hint.contains(" ")) return out;

        // do-support negatives: don't / doesn't / didn't + verb.
        if (first.equals("don't") || first.equals("doesn't") || first.equals("didn't")
                || (w.length > 1 && w[1].equals("not") && (first.equals("do") || first.equals("does") || first.equals("did")))) {
            String verb = first.endsWith("n't") ? (w.length > 1 ? w[1] : "") : (w.length > 2 ? w[2] : "");
            if (!verb.equals(hint)) return out;
            String tail = w.length > (first.endsWith("n't") ? 2 : 3)
                    ? " " + String.join(" ", java.util.Arrays.copyOfRange(w, first.endsWith("n't") ? 2 : 3, w.length)) : "";
            if (first.startsWith("did")) {
                out.add(past(hint) + tail);
            } else if (first.startsWith("does")) {
                out.add(thirdPerson(hint) + tail);
            } else {
                out.add(hint + tail);
            }
            return out;
        }
        // Plain affirmative verb, as given by the hint: present, third person or past.
        if (first.equals(thirdPerson(hint))) {
            out.add("doesn't " + hint + rest);
            out.add("does not " + hint + rest);
        } else if (first.equals(hint)) {
            out.add("don't " + hint + rest);
            out.add("do not " + hint + rest);
        } else if (first.equals(past(hint))) {
            out.add("didn't " + hint + rest);
            out.add("did not " + hint + rest);
        }
        return out;
    }

    private static String thirdPerson(String v) {
        if (v.matches(".*(s|sh|ch|x|z|o)$")) return v + "es";
        if (v.matches(".*[^aeiou]y$")) return v.substring(0, v.length() - 1) + "ies";
        return v + "s";
    }

    private static String past(String v) {
        String irregular = IRREGULAR_PAST.get(v);
        if (irregular != null) return irregular;
        if (v.endsWith("e")) return v + "d";
        if (v.matches(".*[^aeiou]y$")) return v.substring(0, v.length() - 1) + "ied";
        return v + "ed";
    }
}
