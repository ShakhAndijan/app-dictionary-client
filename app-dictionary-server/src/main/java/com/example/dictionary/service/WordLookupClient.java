package com.example.dictionary.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
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
        factory.setConnectTimeout(Duration.ofSeconds(3));
        factory.setReadTimeout(Duration.ofSeconds(4));
        this.http = RestClient.builder().requestFactory(factory).build();
    }

    public Optional<Entry> definition(String word) {
        try {
            List<?> entries = http.get()
                    .uri("https://api.dictionaryapi.dev/api/v2/entries/en/{word}", word)
                    .retrieve()
                    .body(List.class);
            return entries == null ? Optional.empty() : parseEntries(entries);
        } catch (Exception e) {
            // A 404 is the normal "unknown word" answer; anything else is only worth a debug line.
            log.debug("Dictionary lookup for '{}' failed: {}", word, e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<String> translation(String word) {
        try {
            Map<?, ?> body = http.get()
                    .uri("https://api.mymemory.translated.net/get?q={q}&langpair=en|uz", word)
                    .retrieve()
                    .body(Map.class);
            return body == null ? Optional.empty() : parseTranslation(word, body);
        } catch (Exception e) {
            log.debug("Translation lookup for '{}' failed: {}", word, e.getMessage());
            return Optional.empty();
        }
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
