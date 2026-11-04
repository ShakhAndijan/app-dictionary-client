package com.example.dictionary.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Talks to the two free public APIs behind the "auto-fill" button: dictionaryapi.dev for the English
 * definition and MyMemory for the Uzbek translation. Both are best effort: any failure just means
 * "nothing found", never an error for the user.
 */
@Component
public class WordLookupClient {

    private static final Logger log = LoggerFactory.getLogger(WordLookupClient.class);
    private static final Pattern CYRILLIC = Pattern.compile("[\\u0400-\\u04FF]");

    /** Definition data for one English word. */
    public record Entry(String definition, String example, String phonetic) {
    }

    private final RestClient http;

    public WordLookupClient() {
        // HttpURLConnection based: it needs no extra sockets, so it also starts on locked-down machines.
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(4));
        factory.setReadTimeout(Duration.ofSeconds(6));
        // Some of these services answer 403 to the default Java user agent.
        this.http = RestClient.builder()
                .requestFactory(factory)
                .defaultHeader("User-Agent", "Mozilla/5.0 (compatible; DictionaryApp/1.0)")
                .build();
    }

    /**
     * The English definition. dictionaryapi.dev is tried first (also for the base form of an inflected word:
     * "running" -> "run"); Wiktionary covers what it does not know.
     */
    public Optional<Entry> definition(String word) {
        for (String candidate : baseForms(word)) {
            Optional<Entry> found = fromDictionaryApi(candidate);
            if (found.isPresent()) {
                return found;
            }
        }
        return fromWiktionary(word);
    }

    /**
     * The Uzbek translation. Google's public endpoint is far better than MyMemory at single words and
     * returns several senses, so it goes first; MyMemory remains as the fallback.
     */
    public Optional<String> translation(String word) {
        Optional<String> google = fromGoogle(word);
        if (google.isPresent()) {
            return google;
        }
        return fromMyMemory(word);
    }

    /** The English word for an Uzbek one (the form's "auto" button when only the translation was typed). */
    public Optional<String> englishFor(String uzbek) {
        try {
            List<?> body = http.get()
                    .uri("https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=en&dt=t&dt=bd&q={q}", uzbek)
                    .retrieve()
                    .body(List.class);
            List<String> found = body == null ? List.of() : googleCandidates(uzbek, body);
            if (!found.isEmpty()) {
                return Optional.of(found.get(0));
            }
        } catch (Exception e) {
            log.warn("Google uz->en for '{}' failed: {}", uzbek, e.getMessage());
        }
        try {
            Map<?, ?> body = http.get()
                    .uri("https://api.mymemory.translated.net/get?q={q}&langpair=uz|en", uzbek)
                    .retrieve()
                    .body(Map.class);
            return body == null ? Optional.empty() : parseTranslation(uzbek, body);
        } catch (Exception e) {
            log.warn("MyMemory uz->en for '{}' failed: {}", uzbek, e.getMessage());
            return Optional.empty();
        }
    }

    /** English words that fit a description (Datamuse "means like"), best match first. */
    public List<String> wordsForDefinition(String text) {
        try {
            List<?> body = http.get()
                    .uri("https://api.datamuse.com/words?ml={q}&max=8", text)
                    .retrieve()
                    .body(List.class);
            return body == null ? List.of() : parseDatamuse(body);
        } catch (Exception e) {
            log.warn("Datamuse lookup for '{}' failed: {}", text, e.getMessage());
            return List.of();
        }
    }

    private Optional<Entry> fromDictionaryApi(String word) {
        try {
            List<?> entries = http.get()
                    .uri("https://api.dictionaryapi.dev/api/v2/entries/en/{word}", word)
                    .retrieve()
                    .body(List.class);
            return entries == null ? Optional.empty() : parseEntries(entries);
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        } catch (Exception e) {
            log.warn("dictionaryapi.dev lookup for '{}' failed: {}", word, e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<Entry> fromWiktionary(String word) {
        try {
            Map<?, ?> body = http.get()
                    .uri("https://en.wiktionary.org/api/rest_v1/page/definition/{word}", word)
                    .retrieve()
                    .body(Map.class);
            return body == null ? Optional.empty() : parseWiktionary(body);
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        } catch (Exception e) {
            log.warn("Wiktionary lookup for '{}' failed: {}", word, e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<String> fromGoogle(String word) {
        try {
            List<?> body = http.get()
                    .uri("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uz&dt=t&dt=bd&q={q}", word)
                    .retrieve()
                    .body(List.class);
            return body == null ? Optional.empty() : parseGoogle(word, body);
        } catch (Exception e) {
            log.warn("Google translation for '{}' failed: {}", word, e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<String> fromMyMemory(String word) {
        try {
            Map<?, ?> body = http.get()
                    .uri("https://api.mymemory.translated.net/get?q={q}&langpair=en|uz", word)
                    .retrieve()
                    .body(Map.class);
            return body == null ? Optional.empty() : parseTranslation(word, body);
        } catch (Exception e) {
            log.warn("MyMemory translation for '{}' failed: {}", word, e.getMessage());
            return Optional.empty();
        }
    }

    // ---- inflections ----

    /** The word itself, then plausible base forms of a single inflected word. */
    static List<String> baseForms(String word) {
        List<String> forms = new ArrayList<>();
        forms.add(word);
        if (word.contains(" ") || word.length() < 4) {
            return forms;
        }
        if (word.endsWith("ies")) {
            forms.add(word.substring(0, word.length() - 3) + "y");
        }
        if (word.endsWith("es")) {
            forms.add(word.substring(0, word.length() - 2));
        }
        if (word.endsWith("s")) {
            forms.add(word.substring(0, word.length() - 1));
        }
        for (String suffix : List.of("ing", "ed")) {
            if (word.endsWith(suffix) && word.length() > suffix.length() + 2) {
                String stem = word.substring(0, word.length() - suffix.length());
                forms.add(stem);
                forms.add(stem + "e");
                // "running" -> "run", "stopped" -> "stop"
                if (stem.length() > 2 && stem.charAt(stem.length() - 1) == stem.charAt(stem.length() - 2)) {
                    forms.add(stem.substring(0, stem.length() - 1));
                }
            }
        }
        return forms.stream().distinct().toList();
    }

    // ---- parsing (package-private so tests can feed it canned responses) ----

    static Optional<Entry> parseEntries(List<?> entries) {
        String phonetic = null;
        String definition = null;
        String example = null;
        for (Object raw : entries) {
            if (!(raw instanceof Map<?, ?> entry)) {
                continue;
            }
            if (phonetic == null) {
                phonetic = firstNonBlank(entry.get("phonetic"), phoneticFromList(entry.get("phonetics")));
            }
            if (!(entry.get("meanings") instanceof List<?> meanings)) {
                continue;
            }
            for (Object meaningRaw : meanings) {
                if (!(meaningRaw instanceof Map<?, ?> meaning) || !(meaning.get("definitions") instanceof List<?> defs)) {
                    continue;
                }
                for (Object defRaw : defs) {
                    if (!(defRaw instanceof Map<?, ?> def)) {
                        continue;
                    }
                    if (definition == null) {
                        definition = firstNonBlank(def.get("definition"));
                    }
                    if (example == null) {
                        example = firstNonBlank(def.get("example"));
                    }
                }
            }
        }
        if (definition == null && example == null && phonetic == null) {
            return Optional.empty();
        }
        return Optional.of(new Entry(definition, example, phonetic));
    }

    /** Wiktionary answers {"en": [{"definitions": [{"definition": "<html>", "examples": [...]}]}]}. */
    static Optional<Entry> parseWiktionary(Map<?, ?> body) {
        if (!(body.get("en") instanceof List<?> senses)) {
            return Optional.empty();
        }
        for (Object senseRaw : senses) {
            if (!(senseRaw instanceof Map<?, ?> sense) || !(sense.get("definitions") instanceof List<?> defs)) {
                continue;
            }
            for (Object defRaw : defs) {
                if (!(defRaw instanceof Map<?, ?> def) || !(def.get("definition") instanceof String html)) {
                    continue;
                }
                String text = html.replaceAll("<[^>]*>", "").replace("&nbsp;", " ").trim();
                if (text.isEmpty()) {
                    continue;
                }
                String example = null;
                if (def.get("examples") instanceof List<?> examples && !examples.isEmpty()
                        && examples.get(0) instanceof String ex) {
                    example = ex.replaceAll("<[^>]*>", "").trim();
                }
                return Optional.of(new Entry(text, example, null));
            }
        }
        return Optional.empty();
    }

    /**
     * Google answers [[["tarjima","source",...]], [["noun", ["a","b"], ...], ...], ...]: the main translation
     * first, then the other senses grouped by part of speech. Up to three distinct ones are kept.
     */
    static Optional<String> parseGoogle(String source, List<?> body) {
        List<String> found = googleCandidates(source, body);
        if (found.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(String.join(", ", found.subList(0, Math.min(3, found.size()))));
    }

    /** Distinct usable translations, the main one first. */
    static List<String> googleCandidates(String source, List<?> body) {
        List<String> found = new ArrayList<>();
        if (!body.isEmpty() && body.get(0) instanceof List<?> segments) {
            StringBuilder joined = new StringBuilder();
            for (Object segRaw : segments) {
                if (segRaw instanceof List<?> seg && !seg.isEmpty() && seg.get(0) instanceof String t) {
                    joined.append(t);
                }
            }
            addCandidate(found, source, joined.toString());
        }
        boolean singleWord = !source.trim().contains(" ");
        if (singleWord && body.size() > 1 && body.get(1) instanceof List<?> byPos) {
            for (Object posRaw : byPos) {
                if (posRaw instanceof List<?> pos && pos.size() > 1 && pos.get(1) instanceof List<?> words) {
                    for (int i = 0; i < Math.min(2, words.size()); i++) {
                        if (words.get(i) instanceof String w) {
                            addCandidate(found, source, w);
                        }
                    }
                }
            }
        }
        return found;
    }

    private static void addCandidate(List<String> found, String source, String raw) {
        String cleaned = raw == null ? "" : raw.trim();
        final String candidate = cleaned;
        if (cleaned.isEmpty()
                || cleaned.equalsIgnoreCase(source.trim())
                || CYRILLIC.matcher(cleaned).find()
                || found.stream().anyMatch(f -> f.equalsIgnoreCase(candidate))) {
            return;
        }
        // Keep the user's casing: "apple" should come back as "olma", not "Olma".
        if (Character.isLowerCase(source.trim().charAt(0))) {
            cleaned = Character.toLowerCase(cleaned.charAt(0)) + cleaned.substring(1);
        }
        found.add(cleaned);
    }

    static List<String> parseDatamuse(List<?> body) {
        List<String> words = new ArrayList<>();
        for (Object raw : body) {
            if (raw instanceof Map<?, ?> m && m.get("word") instanceof String w && !w.isBlank()) {
                words.add(w.trim());
            }
        }
        return words;
    }

    static Optional<String> parseTranslation(String source, Map<?, ?> body) {
        List<String> candidates = new ArrayList<>();
        if (body.get("responseData") instanceof Map<?, ?> data && data.get("translatedText") instanceof String text) {
            candidates.add(text);
        }
        if (body.get("matches") instanceof List<?> matches) {
            for (Object m : matches) {
                if (m instanceof Map<?, ?> match && match.get("translation") instanceof String t) {
                    candidates.add(t);
                }
            }
        }
        for (String candidate : candidates) {
            String cleaned = candidate.trim();
            if (cleaned.isEmpty()
                    || cleaned.equalsIgnoreCase(source.trim())
                    || cleaned.toUpperCase().contains("MYMEMORY WARNING")
                    || cleaned.toUpperCase().contains("QUERY LENGTH LIMIT")
                    || CYRILLIC.matcher(cleaned).find()) {
                continue;
            }
            // Keep the user's casing: "apple" should come back as "olma", not "Olma".
            if (Character.isLowerCase(source.trim().charAt(0))) {
                cleaned = Character.toLowerCase(cleaned.charAt(0)) + cleaned.substring(1);
            }
            return Optional.of(cleaned);
        }
        return Optional.empty();
    }

    private static String phoneticFromList(Object phonetics) {
        if (phonetics instanceof List<?> list) {
            for (Object p : list) {
                if (p instanceof Map<?, ?> map && map.get("text") instanceof String text && !text.isBlank()) {
                    return text;
                }
            }
        }
        return null;
    }

    private static String firstNonBlank(Object... values) {
        for (Object v : values) {
            if (v instanceof String s && !s.isBlank()) {
                return s.trim();
            }
        }
        return null;
    }
}
