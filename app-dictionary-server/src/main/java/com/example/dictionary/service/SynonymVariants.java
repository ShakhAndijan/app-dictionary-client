package com.example.dictionary.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Other correct ways to say a translated sentence with synonyms: "I like reading books" is also
 * "I love reading books" and "I enjoy reading books".
 *
 * <p>A word is swapped only where the new sentence stays grammatical, so every rule looks at the words around it
 * ("enjoy" needs an -ing form, never "to"; "big brother" is not "large brother"; "an exam" becomes "a test").
 * When in doubt there is no swap: refusing a rare right answer is better than accepting a wrong sentence.
 */
final class SynonymVariants {

    private SynonymVariants() {}

    private static final String TRANSLATION_PROMPT = "Inglizchaga tarjima qiling:";
    private static final int MAX_VARIANTS = 2000;

    /** Only "translate into English" tasks leave the choice of words to the learner. */
    static boolean appliesTo(String prompt) {
        return prompt != null && prompt.startsWith(TRANSLATION_PROMPT);
    }

    /** One replacement of {@code length} words starting at {@code at}. */
    private record Swap(int at, int length, String text) {}

    /** The sentence (normalised, lower-case) and all its synonym spellings. */
    static Set<String> of(String sentence) {
        Words s = new Words(sentence.split(" "));
        List<List<Swap>> swaps = new ArrayList<>();
        for (int i = 0; i < s.size(); i++) {
            List<Swap> here = new ArrayList<>();
            verbs(s, i, here);
            nouns(s, i, here);
            adjectives(s, i, here);
            others(s, i, here);
            swaps.add(here);
        }
        Set<String> out = new LinkedHashSet<>();
        out.add(sentence);
        build(s, swaps, 0, new ArrayList<>(), out);
        return out;
    }

    private static void build(Words s, List<List<Swap>> swaps, int i, List<String> done, Set<String> out) {
        if (out.size() >= MAX_VARIANTS) return;
        if (i >= s.size()) {
            out.add(String.join(" ", done));
            return;
        }
        List<String> kept = new ArrayList<>(done);
        kept.add(s.raw[i]);
        build(s, swaps, i + 1, kept, out);
        for (Swap swap : swaps.get(i)) {
            List<String> next = new ArrayList<>(done);
            String first = swap.text().split(" ")[0];
            // "an exam" -> "a test", "a flat" -> "an apartment".
            if (!next.isEmpty()) {
                String article = next.get(next.size() - 1);
                if (article.equals("a") || article.equals("an")) {
                    next.set(next.size() - 1, "aeio".indexOf(first.charAt(0)) >= 0 ? "an" : "a");
                }
            }
            next.add(swap.text() + s.tail[i + swap.length() - 1]);
            build(s, swaps, i + swap.length(), next, out);
        }
    }

    /** The words of a sentence, each split from the punctuation that follows it. */
    private static final class Words {
        final String[] raw;
        final String[] word;
        final String[] tail;

        Words(String[] raw) {
            this.raw = raw;
            word = new String[raw.length];
            tail = new String[raw.length];
            for (int i = 0; i < raw.length; i++) {
                int end = raw[i].length();
                while (end > 0 && ".,;:!?".indexOf(raw[i].charAt(end - 1)) >= 0) end--;
                word[i] = raw[i].substring(0, end);
                tail[i] = raw[i].substring(end);
            }
        }

        int size() {
            return raw.length;
        }

        /** The word {@code back} places earlier in the same clause, or "". */
        String prev(int i, int back) {
            for (int k = i - back; k < i; k++) {
                if (k < 0 || !tail[k].isEmpty()) return "";
            }
            return word[i - back];
        }

        String prev(int i) {
            return prev(i, 1);
        }

        /** The word {@code ahead} places later in the same clause, or "". */
        String next(int i, int ahead) {
            for (int k = i; k < i + ahead; k++) {
                if (k >= size() - 1 || !tail[k].isEmpty()) return "";
            }
            return word[i + ahead];
        }

        String next(int i) {
            return next(i, 1);
        }
    }

    private static boolean in(String word, String list) {
        return !word.isEmpty() && (" " + list + " ").contains(" " + word + " ");
    }

    private static final String DETERMINERS = "a an the this that these those my your his her our their its some any";
    private static final String POSSESSIVES = "my your his her our their";
    private static final String BE = "am is are was were be been being isn't aren't wasn't weren't i'm he's she's it's you're we're they're";

    private static boolean gerund(String w) {
        return w.length() > 4 && w.endsWith("ing")
                && !in(w, "thing something anything nothing everything morning evening spring king building ceiling wedding pudding");
    }

    // ---------------------------------------------------------------- verbs

    private static void verbs(Words s, int i, List<Swap> out) {
        likeLoveEnjoy(s, i, out);
        startBegin(s, i, out);
        finishEnd(s, i, out);
        speakTalk(s, i, out);
        repairFix(s, i, out);
        callPhone(s, i, out);
    }

    private static final String[][] LIKE = {{"like", "likes", "liked"}, {"love", "loves", "loved"}, {"enjoy", "enjoys", "enjoyed"}};

    private static void likeLoveEnjoy(Words s, int i, List<Swap> out) {
        String w = s.word[i];
        int verb = -1;
        int form = -1;
        for (int v = 0; v < LIKE.length; v++) {
            for (int f = 0; f < 3; f++) {
                if (LIKE[v][f].equals(w)) {
                    verb = v;
                    form = f;
                }
            }
        }
        if (verb < 0) return;
        // "like" and "love" are also a preposition and a noun: it is a verb only after a subject or an auxiliary.
        String before = in(s.prev(i), "really also still always never usually often") ? s.prev(i, 2) : s.prev(i);
        if (form == 0) {
            boolean subject = in(before, "i we they children people parents kids don't doesn't didn't would will might i'd we'd they'd you'd he'd she'd")
                    || (before.equals("you") && (i < 2 || in(s.prev(i, 2), "do don't did didn't would if when think")))
                    || (before.equals("not") && in(s.prev(i, 2), "do does did would will"))
                    || (before.equals("to") && in(s.prev(i, 2), "used use seem seems"));
            if (!subject) return;
        } else if (in(before, DETERMINERS + " and of in")) {
            return;
        }
        String after = s.next(i);
        boolean negative = false;
        boolean would = false;
        for (int back = 1; back <= 3; back++) {
            String p = s.prev(i, Math.min(back, i));
            if (i == 0) break;
            if (p.equals("not") || p.endsWith("n't")) negative = true;
            if (p.equals("would") || p.endsWith("'d")) would = true;
        }
        // Loving a person is not liking them.
        boolean person = in(after, "me you him her us them")
                || (in(after, POSSESSIVES) && in(s.next(i, 2), "family mother father mum mom dad parents wife husband children son daughter brother sister"));

        if (verb != 0 && !(verb == 1 && person)) out.add(new Swap(i, 1, LIKE[0][form]));
        // "don't love" is not "don't like"; "would love some tea" sounds wrong, "would love to" is fine.
        if (verb != 1 && !negative && !(would && !after.equals("to"))
                && !(verb == 2 && in(after, "myself yourself himself herself ourselves themselves"))) {
            out.add(new Swap(i, 1, LIKE[1][form]));
        }
        // "enjoy" takes an -ing form, never "to".
        if (verb != 2 && gerund(after) && !would) out.add(new Swap(i, 1, LIKE[2][form]));
    }

    private static final String EVENTS = "lesson lessons class classes film movie concert match game meeting show play work school lunch course";

    private static void startBegin(Words s, int i, List<Swap> out) {
        String w = s.word[i];
        if (!in(w, "start starts started starting begin begins began begun beginning")) return;
        if (in(s.prev(i), "the a an this that its")) return; // "at the start", "the beginning"
        String after = s.next(i);
        boolean safe = after.isEmpty() || in(after, "to at in on") || gerund(after) || in(after, EVENTS + " project")
                || (in(after, DETERMINERS) && (in(s.next(i, 2), EVENTS + " project") || in(s.next(i, 3), EVENTS + " project")));
        if (!safe) return;
        boolean perfect = false;
        for (int back = 1; back <= Math.min(3, i); back++) {
            String p = s.prev(i, back);
            if (in(p, "have has had haven't hasn't hadn't having") || p.endsWith("'ve")) perfect = true;
        }
        String swap = switch (w) {
            case "start" -> "begin";
            case "starts" -> "begins";
            case "starting" -> "beginning";
            case "started" -> perfect ? "begun" : "began";
            case "begin" -> "start";
            case "begins" -> "starts";
            case "beginning" -> "starting";
            default -> "started";
        };
        out.add(new Swap(i, 1, swap));
    }

    /** Only when nothing follows as an object: "the lesson ends at five", never "I ended my homework". */
    private static void finishEnd(Words s, int i, List<Swap> out) {
        String w = s.word[i];
        if (!in(w, "finish finishes finished end ends ended")) return;
        if (!in(s.prev(i), EVENTS) || in(s.prev(i), "school") || !(s.next(i).isEmpty() || in(s.next(i), "at"))) return;
        String swap = switch (w) {
            case "finish" -> "end";
            case "finishes" -> "ends";
            case "finished" -> "ended";
            case "end" -> "finish";
            case "ends" -> "finishes";
            default -> "finished";
        };
        out.add(new Swap(i, 1, swap));
    }

    private static void speakTalk(Words s, int i, List<Swap> out) {
        if (!in(s.next(i), "to with about")) return;
        String swap = switch (s.word[i]) {
            case "speak" -> "talk";
            case "speaks" -> "talks";
            case "speaking" -> "talking";
            case "spoke", "spoken" -> "talked";
            case "talk" -> "speak";
            case "talks" -> "speaks";
            case "talking" -> "speaking";
            default -> null;
        };
        // "a talk about" is a noun.
        if (swap != null && !in(s.prev(i), DETERMINERS)) out.add(new Swap(i, 1, swap));
    }

    private static void repairFix(Words s, int i, List<Swap> out) {
        if (!in(s.next(i), DETERMINERS + " it them") && !in(s.prev(i), "be been get got")) return;
        if (in(s.next(i, 2), "date time price")) return;
        String swap = switch (s.word[i]) {
            case "repair" -> "fix";
            case "repairs" -> "fixes";
            case "repaired" -> "fixed";
            case "repairing" -> "fixing";
            case "fix" -> "repair";
            case "fixes" -> "repairs";
            case "fixed" -> "repaired";
            case "fixing" -> "repairing";
            default -> null;
        };
        if (swap != null && !in(s.prev(i), DETERMINERS)) out.add(new Swap(i, 1, swap));
    }

    /** "call me tomorrow" is "phone me tomorrow", but "they call him Ali" is not. */
    private static void callPhone(Words s, int i, List<Swap> out) {
        String swap = switch (s.word[i]) {
            case "call" -> "phone";
            case "calls" -> "phones";
            case "called" -> "phoned";
            case "phone" -> "call";
            case "phones" -> "calls";
            case "phoned" -> "called";
            default -> null;
        };
        if (swap == null || in(s.prev(i), DETERMINERS)) return;
        int object = 0;
        if (in(s.next(i), "me you him her us them")
                && !(s.next(i).equals("her") && in(s.next(i, 2), "friend mother father mum mom brother sister parents"))) {
            object = 1;
        } else if (in(s.next(i), POSSESSIVES) && in(s.next(i, 2), "friend mother father mum mom dad brother sister parents")) {
            object = 2;
        }
        if (object == 0) return;
        String then = s.next(i, object + 1);
        if (then.isEmpty() || in(then, "tomorrow later tonight back yesterday now today soon when if after before in at again every more on")) {
            out.add(new Swap(i, 1, swap));
        }
    }

    // ---------------------------------------------------------------- nouns

    /** Pairs that can replace each other wherever the first one stands. */
    private static final String[][] SAME = {
            {"film", "movie"}, {"films", "movies"}, {"kid", "child"}, {"kids", "children"}, {"tv", "television"},
            {"bike", "bicycle"}, {"bikes", "bicycles"}, {"sofa", "couch"}, {"sofas", "couches"}, {"taxi", "cab"}, {"taxis", "cabs"},
            {"mum", "mom"}, {"maybe", "perhaps"}, {"nearly", "almost"}, {"till", "until"}, {"towards", "toward"},
            {"everybody", "everyone"}, {"somebody", "someone"}, {"anybody", "anyone"}, {"often", "frequently"}};

    private static void nouns(Words s, int i, List<Swap> out) {
        String w = s.word[i];
        String before = s.prev(i);
        String after = s.next(i);
        for (String[] pair : SAME) {
            if (w.equals(pair[0])) out.add(new Swap(i, 1, pair[1]));
            if (w.equals(pair[1])) out.add(new Swap(i, 1, pair[0]));
        }
        // Parents: only "my mother", not "Mother's Day" or "mother tongue".
        if (in(before, POSSESSIVES) && !in(after, "tongue country land")) {
            switch (w) {
                case "mother" -> add(out, i, "mum", "mom");
                case "mum", "mom" -> add(out, i, "mother");
                case "father" -> add(out, i, "dad");
                case "dad" -> add(out, i, "father");
                default -> { }
            }
        }
        boolean noun = in(before, DETERMINERS + " big small new old nice little");
        if (noun) {
            switch (w) {
                case "shop" -> add(out, i, "store");
                case "shops" -> add(out, i, "stores");
                case "store" -> add(out, i, "shop");
                case "stores" -> add(out, i, "shops");
                case "flat" -> {
                    if (!in(after, "tyre tire screen")) add(out, i, "apartment");
                }
                case "flats" -> add(out, i, "apartments");
                case "apartment" -> add(out, i, "flat");
                case "apartments" -> add(out, i, "flats");
                default -> { }
            }
        }
        if (noun || before.equals("what") || before.equals("birthday")) {
            switch (w) {
                case "present" -> add(out, i, "gift");
                case "presents" -> add(out, i, "gifts");
                case "gift" -> add(out, i, "present");
                case "gifts" -> add(out, i, "presents");
                default -> { }
            }
        }
        // A holiday as time off ("on holiday"), not as a festival ("holiday dishes").
        if (in(before, "on from my your our summer winter") && !in(after, "dishes table food")) {
            if (w.equals("holiday")) add(out, i, "vacation");
            if (w.equals("vacation")) add(out, i, "holiday");
        }
        if (in(before, "in last next this")) {
            if (w.equals("autumn")) add(out, i, "fall");
            if (w.equals("fall")) add(out, i, "autumn");
        }
        if (w.equals("photo")) add(out, i, "picture", "photograph");
        if (w.equals("photos")) add(out, i, "pictures", "photographs");
        if (w.equals("photograph")) add(out, i, "photo", "picture");
        if (w.equals("photographs")) add(out, i, "photos", "pictures");
        if (in(before, DETERMINERS + " mobile new old") || after.equals("number")) {
            if (w.equals("phone")) add(out, i, "telephone");
            if (w.equals("telephone")) add(out, i, "phone");
            if (w.equals("phones")) add(out, i, "telephones");
        }
        if (w.equals("football") && !before.equals("american")) add(out, i, "soccer");
        if (w.equals("soccer")) add(out, i, "football");
        if (!before.equals("by")) {
            if (w.equals("mistake") && !after.equals("for")) add(out, i, "error");
            if (w.equals("mistakes")) add(out, i, "errors");
            if (w.equals("error")) add(out, i, "mistake");
            if (w.equals("errors")) add(out, i, "mistakes");
        }
        // A "medical test" is something else than a "medical exam".
        if (w.equals("exam") && !before.equals("medical")) add(out, i, "test");
        if (w.equals("exams") && !before.equals("medical")) add(out, i, "tests");
        if (in(before, DETERMINERS + " easiest difficult easy")) {
            if (w.equals("test") && !in(after, "drive")) add(out, i, "exam");
            if (w.equals("tests")) add(out, i, "exams");
        }
    }

    private static void add(List<Swap> out, int at, String... texts) {
        for (String t : texts) out.add(new Swap(at, 1, t));
    }

    // ---------------------------------------------------------------- adjectives

    /** Things that have a size; "big brother" and "big mistake" are not on the list on purpose. */
    private static final String SIZED = "house houses home flat apartment room rooms bedroom bathroom kitchen garden yard city town village country "
            + "school building theatre stadium forest park shop store window mirror table box bag shirt dress trousers shoes coat "
            + "animal dog cat squirrel fountain pool plate plates cake tree trees family lake car classroom hotel museum";

    private static void adjectives(Words s, int i, List<Swap> out) {
        String w = s.word[i];
        String before = s.prev(i);
        String after = s.next(i);

        boolean attributive = in(after, SIZED);
        boolean predicative = false;
        if (after.isEmpty() || in(after, "for enough as")) {
            for (int k = 0; k < i; k++) predicative |= in(s.word[k], SIZED);
        }
        if (w.equals("big") && (attributive || predicative)) add(out, i, "large");
        if (w.equals("large") && (attributive || predicative)) add(out, i, "big");
        if (w.equals("small") && attributive) add(out, i, "little");
        if (w.equals("little") && attributive) add(out, i, "small");

        if (!in(before, "more most less")) {
            if (w.equals("beautiful")) add(out, i, "lovely");
            if (w.equals("lovely")) add(out, i, "beautiful");
        }
        if (in(w, "clever smart intelligent") && !in(after, "phone phones watch tv")) {
            for (String other : List.of("clever", "smart", "intelligent")) {
                if (!other.equals(w)) add(out, i, other);
            }
        }
        if (!after.equals("in")) {
            if (w.equals("rich")) add(out, i, "wealthy");
            if (w.equals("wealthy")) add(out, i, "rich");
        }
        if (w.equals("tasty") && !in(before, "more most")) add(out, i, "delicious");
        // "very delicious" is not good English.
        if (w.equals("delicious") && !in(before, "more most very too quite")) add(out, i, "tasty");
        // "more difficult" cannot become "more hard".
        if (w.equals("difficult") && !in(before, "more most less")) add(out, i, "hard");

        boolean afterBe = in(before, BE + " seem seems seemed")
                || (in(before, "very so too not") && in(s.prev(i, Math.min(2, i)), BE + " seem seems seemed"));
        if (w.equals("hard") && afterBe && (after.isEmpty() || after.equals("to"))) add(out, i, "difficult");
        if (w.equals("easy") && afterBe && (after.isEmpty() || in(after, "to for"))) add(out, i, "simple");
        if (w.equals("simple") && afterBe && (after.isEmpty() || in(after, "to for"))) add(out, i, "easy");
        // "glad" cannot stand in front of a noun.
        if (in(after, "to that")) {
            if (w.equals("happy")) add(out, i, "glad");
            if (w.equals("glad")) add(out, i, "happy");
        }
        if (w.equals("ill")) add(out, i, "sick");
        if (w.equals("sick") && (afterBe || in(before, "feel feels felt fell got get"))
                && (after.isEmpty() || in(after, "with today yesterday since for because"))) {
            add(out, i, "ill");
        }
        if (in(w, "afraid scared frightened") && (afterBe || in(before, "feel feels felt"))
                && (after.isEmpty() || in(after, "of to"))) {
            for (String other : List.of("afraid", "scared", "frightened")) {
                if (!other.equals(w)) add(out, i, other);
            }
        }
    }

    // ---------------------------------------------------------------- phrases and linking words

    private static void others(Words s, int i, List<Swap> out) {
        String w = s.word[i];
        String before = s.prev(i);
        String after = s.next(i);

        if (w.equals("nobody")) add(out, i, "no one");
        if (w.equals("no") && after.equals("one") && !s.next(i, 2).equals("of")) out.add(new Swap(i, 2, "nobody"));
        if (w.equals("a") && after.equals("lot") && s.next(i, 2).equals("of")) out.add(new Swap(i, 3, "lots of"));
        if (w.equals("lots") && after.equals("of")) out.add(new Swap(i, 2, "a lot of"));
        // "too" at the end of a clause means "also"; "too big" is something else.
        if (w.equals("too") && i > 0 && after.isEmpty()) add(out, i, "as well");
        if (w.equals("as") && after.equals("well") && i > 0 && s.next(i, 2).isEmpty()) out.add(new Swap(i, 2, "too"));
        if (w.equals("because") && in(after, DETERMINERS + " i you he she it we they there")
                && !in(before, "just only not is was it's that's simply partly mainly and or")
                && !s.word[0].equals("why")) {
            add(out, i, "since", "as");
        }
        boolean place = in(after, DETERMINERS + " here there me him us them");
        if (w.equals("near") && place && !in(before, "the a")) add(out, i, "close to");
        if (w.equals("close") && after.equals("to") && in(s.next(i, 2), DETERMINERS + " here there me him us them")
                && (i == 0 || in(before, BE + " house flat school park shop lives live stay stayed"))) {
            out.add(new Swap(i, 2, "near"));
        }
    }
}
