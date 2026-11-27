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
        if (alsoAccept != null && alsoAccept.stream().anyMatch(a -> g.equals(normalize(a)))) return true;
        if (!"FILL".equals(kind)) return false;
        // Typed answers: spellings that are equally right when the task leaves the choice open.
        boolean gender = genderNeutralPrompt();
        boolean polarity = PolarityVariants.neutralPrompt(prompt);
        boolean synonyms = SynonymVariants.appliesTo(prompt);
        if (!gender && !polarity && !synonyms) return false;
        String hint = PolarityVariants.hint(prompt);
        java.util.List<String> known = new java.util.ArrayList<>();
        known.add(normalize(answer));
        if (alsoAccept != null) alsoAccept.forEach(a -> known.add(normalize(a)));
        for (String k : known) {
            // "He works" / "She works"; "works" / "doesn't work"; and the two combined.
            java.util.Set<String> forms = new java.util.LinkedHashSet<>();
            forms.add(k);
            if (gender) forms.add(swapGender(k));
            if (polarity) {
                for (String f : java.util.List.copyOf(forms)) {
                    forms.addAll(PolarityVariants.of(f, hint));
                }
            }
            // "twenty five students in our class" / "twenty five pupils in our class"
            if (synonyms) {
                for (String f : java.util.List.copyOf(forms)) forms.addAll(schoolVariants(f));
            }
            if (forms.contains(g)) return true;
            // "I like reading books" / "I love reading books", only where the sentence stays grammatical.
            if (synonyms && forms.stream().anyMatch(f -> sameWithSynonyms(f, g))) return true;
        }
        return false;
    }

    /**
     * {@code given} is one of the synonym spellings of {@code known}, with numbers written as words or digits and
     * a time phrase at either end.
     */
    private static boolean sameWithSynonyms(String known, String given) {
        Set<String> variants = SynonymVariants.of(known);
        if (variants.contains(given)) return true;
        if (!SynonymVariants.hasNumberWord(known) && !SynonymVariants.hasNumberWord(given)
                && !TimePlacement.startsWithTime(known) && !TimePlacement.startsWithTime(given)) {
            return false;
        }
        String wanted = canonical(given);
        return variants.stream().anyMatch(v -> canonical(v).equals(wanted));
    }

    private static String canonical(String sentence) {
        return TimePlacement.timeLast(SynonymVariants.digits(sentence));
    }

    private static final java.util.regex.Pattern SCHOOL_CHILD = java.util.regex.Pattern.compile(
            "o['‘’ʻ`]quvchi", java.util.regex.Pattern.CASE_INSENSITIVE);

    /**
     * A pupil can always be called a student. The other way round only when the task says "o'quvchi":
     * a "talaba" is at university, so he or she is not a pupil.
     */
    private java.util.List<String> schoolVariants(String sentence) {
        java.util.List<String> out = new java.util.ArrayList<>();
        out.add(sentence.replaceAll("\\bpupil(s?)\\b", "student$1"));
        if (SCHOOL_CHILD.matcher(prompt).find()) out.add(sentence.replaceAll("\\bstudent(s?)\\b", "pupil$1"));
        return out;
    }

    private static final java.util.regex.Pattern GENDER_CUE = java.util.regex.Pattern.compile(
            "\\b(he|she|him|her|his|hers|himself|herself|man|woman|men|women|boy|girl|mr|mrs|ms|miss|brother|sister|father|mother|"
                    + "dad|mum|mom|husband|wife|uncle|aunt|son|daughter|grandfather|grandmother|grandpa|grandma|waiter|waitress|"
                    + "king|queen|actor|actress|gentleman|lady|boyfriend|girlfriend|nephew|niece|"
                    + "qiz|ayol|erkak|yigit|o'g'il|o‘g‘il|opa|aka|ota|ona|amaki|xola|tog'a|buvi|bobo|singil|uka|qaynona|qaynota)\\b",
            java.util.regex.Pattern.CASE_INSENSITIVE);
    private static final java.util.regex.Pattern NAME_CUE = java.util.regex.Pattern.compile("(?<!^)(?<![.?!:]\\s)\\b[A-Z][a-z]{1,}\\b");
    private static final Set<String> NOT_NAMES = Set.of("Is", "Are", "Do", "Does", "Did", "Was", "Were", "Has", "Have", "Can", "Will",
            "What", "Where", "When", "Why", "How", "Who", "Which", "Whose", "Inglizchaga", "Tarjima", "Complete", "Write",
            "The", "An", "My", "Your", "Our", "Their", "This", "That", "These", "Those", "It", "We", "You", "They", "There", "Here",
            "In", "On", "At", "Every", "Each", "Some", "Many", "Much", "Most", "Any", "No", "Not", "Please", "Let", "If", "Because",
            "After", "Before", "Yesterday", "Today", "Tomorrow", "Always", "Never", "Often", "Sometimes", "Usually", "Last", "Next",
            "Choose", "Fill", "Put", "Make", "Use", "Read", "Listen", "Look", "Come", "Go", "Tell", "Ask", "Give", "Take", "Open", "Close",
            "Mening", "Sening", "Uning", "Bizning", "Sizning", "Ularning");

    /** True when nothing in the prompt tells whether a man or a woman is meant (no name, no gendered word). */
    private boolean genderNeutralPrompt() {
        if (prompt == null) return false;
        if (GENDER_CUE.matcher(prompt).find()) return false;
        var m = NAME_CUE.matcher(prompt);
        while (m.find()) {
            if (!NOT_NAMES.contains(m.group())) return false;
        }
        // A name opening the sentence ("Anna ___ a doctor.").
        var first = java.util.regex.Pattern.compile("^([A-Z][a-z]+)\\b").matcher(prompt.trim());
        return !(first.find() && !NOT_NAMES.contains(first.group(1)));
    }

    private static final Set<String> OBJECT_FOLLOWERS = Set.of("a", "an", "the", "some", "any", "to", "in", "on", "at", "for", "with",
            "and", "every", "this", "that", "these", "those", "my", "your", "our", "their", "it", "me", "us", "you", "them", "of", "from", "about");

    /** The same sentence about the other gender: he/she, his/her, him/her, himself/herself. */
    static String swapGender(String s) {
        String[] w = s.split(" ", -1);
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < w.length; i++) {
            String x = w[i];
            String y = switch (x) {
                case "he" -> "she";
                case "she" -> "he";
                case "he's" -> "she's";
                case "she's" -> "he's";
                case "he'll" -> "she'll";
                case "she'll" -> "he'll";
                case "he'd" -> "she'd";
                case "she'd" -> "he'd";
                case "his" -> "her";
                case "him" -> "her";
                case "himself" -> "herself";
                case "herself" -> "himself";
                case "her" -> (i + 1 >= w.length || OBJECT_FOLLOWERS.contains(w[i + 1])) ? "him" : "his";
                default -> x;
            };
            if (i > 0) out.append(' ');
            out.append(y);
        }
        return out.toString();
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
