package com.example.dictionary.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * "Yesterday I was at school" and "I was at school yesterday" are the same answer: a time phrase may open or close
 * a simple statement. Both spellings are compared with the phrase moved to the end.
 *
 * <p>Left alone: questions, sentences with more than one clause (moving the time could move it to the other one)
 * and sentences where the time is the subject ("Yesterday was Monday").
 */
final class TimePlacement {

    private TimePlacement() {}

    private static final String PART = "(?: (?:morning|afternoon|evening|night))?";
    private static final String PERIOD = "(?:week|month|year|weekend|summer|winter|spring|autumn|morning|afternoon|evening|night"
            + "|monday|tuesday|wednesday|thursday|friday|saturday|sunday)";

    private static final Pattern LEADING = Pattern.compile("^(yesterday" + PART + "|tomorrow" + PART + "|today|tonight|nowadays|now"
            + "|(?:last|next|this) " + PERIOD + "|every (?:day|" + PERIOD.substring(3)
            + "|(?:a|an|one|[a-z0-9-]+) (?:minutes?|hours?|days?|weeks?|months?|years?) ago),? (.+)$");

    /** The rest starts with a verb or a question word: a question, or the time was the subject. */
    private static final Pattern NOT_A_SUBJECT = Pattern.compile("^(?:am|is|are|was|were|will|would|shall|should|can|could|may|might"
            + "|must|do|does|did|have|has|had|isn't|aren't|wasn't|weren't|won't|don't|doesn't|didn't|what|where|when|why|who|how|which)\\b.*");

    private static final Pattern TWO_CLAUSES = Pattern.compile("[,;:?]|[.!] |\\b(?:that|when|if|because|while|but|and|who|which|where"
            + "|what|how|why|whether|although|though|until|unless|than|said|told|asked|think|thought|know|knew|hope)\\b");

    /** "... for", "... since": the time phrase belongs to the preposition and cannot be moved there. */
    private static final Pattern OPEN_END = Pattern.compile(".*\\b(?:for|since|till|from|by|of|before|after|right|just|later|earlier)$");

    /** The normalised (lower-case) sentence with a leading time phrase moved to the end. */
    static String timeLast(String sentence) {
        Matcher m = LEADING.matcher(sentence);
        if (!m.matches()) return sentence;
        String rest = m.group(2);
        if (NOT_A_SUBJECT.matcher(rest).matches() || TWO_CLAUSES.matcher(rest).find() || OPEN_END.matcher(rest).matches()) {
            return sentence;
        }
        return rest + " " + m.group(1);
    }

    static boolean startsWithTime(String sentence) {
        return LEADING.matcher(sentence).matches();
    }
}
