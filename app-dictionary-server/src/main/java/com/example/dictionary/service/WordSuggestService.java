package com.example.dictionary.service;

import com.example.dictionary.dto.WordSuggestionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/** Fills in the Uzbek translation and the English definition for a word the user is about to add. */
@Service
public class WordSuggestService {

    private static final int MAX_LENGTH = 60;
    private static final int MAX_DEFINITION_LENGTH = 300;
    private static final int CACHE_LIMIT = 5000;
    private static final Pattern ALLOWED = Pattern.compile("[\\p{L}][\\p{L} '\\-]*");

    private final WordLookupClient lookup;
    // Public APIs are rate limited, and the same common words get looked up again and again.
    private final Map<String, WordSuggestionResponse> cache = new ConcurrentHashMap<>();

    public WordSuggestService(WordLookupClient lookup) {
        this.lookup = lookup;
    }

    /**
     * Same as {@link #suggest(String)} for a user who typed the Uzbek word: the English word is looked up first,
     * and the Uzbek text stays exactly as typed.
     */
    public WordSuggestionResponse suggestFromUzbek(String uzbek) {
        String word = uzbek == null ? "" : uzbek.trim().replaceAll("\s+", " ");
        if (word.isEmpty() || word.length() > MAX_LENGTH || !ALLOWED.matcher(word).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid word");
        }
        Optional<String> english = lookup.englishFor(word);
        if (english.isEmpty() || !ALLOWED.matcher(english.get()).matches()) {
            return new WordSuggestionResponse(null, word, null, null, null, List.of());
        }
        WordSuggestionResponse found = suggest(english.get());
        return new WordSuggestionResponse(found.english(), word, found.definition(), found.example(), found.phonetic(), List.of());
    }

    /**
     * Same as {@link #suggest(String)} for a user who typed only a description of the word: the best matching
     * English word is looked up, and the other candidates come back as alternatives.
     */
    public WordSuggestionResponse suggestFromDefinition(String definition) {
        String text = definition == null ? "" : definition.trim().replaceAll("\s+", " ");
        if (text.length() < 3 || text.length() > MAX_DEFINITION_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid definition");
        }
        List<String> words = lookup.wordsForDefinition(text).stream()
                .filter(w -> ALLOWED.matcher(w).matches())
                .toList();
        if (words.isEmpty()) {
            return new WordSuggestionResponse(null, null, text, null, null, List.of());
        }
        WordSuggestionResponse found = suggest(words.get(0));
        return new WordSuggestionResponse(found.english(), found.uzbek(), text, found.example(), found.phonetic(),
                words.subList(1, Math.min(words.size(), 5)));
    }

    public WordSuggestionResponse suggest(String english) {
        String word = english == null ? "" : english.trim().replaceAll("\\s+", " ");
        if (word.isEmpty() || word.length() > MAX_LENGTH || !ALLOWED.matcher(word).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid word");
        }
        String key = word.toLowerCase(Locale.ROOT);
        WordSuggestionResponse cached = cache.get(key);
        if (cached != null) {
            return cached;
        }

        Optional<WordLookupClient.Entry> entry = lookup.definition(key);
        Optional<String> uzbek = lookup.translation(key);
        WordSuggestionResponse response = new WordSuggestionResponse(
                word,
                uzbek.orElse(null),
                entry.map(WordLookupClient.Entry::definition).orElse(null),
                entry.map(WordLookupClient.Entry::example).orElse(null),
                entry.map(WordLookupClient.Entry::phonetic).orElse(null),
                List.of());

        // A miss may be a temporary outage, so only real results are remembered.
        if (!response.isEmpty()) {
            if (cache.size() >= CACHE_LIMIT) {
                cache.clear();
            }
            cache.put(key, response);
        }
        return response;
    }
}
