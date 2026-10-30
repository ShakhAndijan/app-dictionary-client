package com.example.dictionary.service;

import com.example.dictionary.dto.WordSuggestionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/** Fills in the Uzbek translation and the English definition for a word the user is about to add. */
@Service
public class WordSuggestService {

    private static final int MAX_LENGTH = 60;
    private static final int CACHE_LIMIT = 5000;
    private static final Pattern ALLOWED = Pattern.compile("[\\p{L}][\\p{L} '\\-]*");

    private final WordLookupClient lookup;
    // Public APIs are rate limited, and the same common words get looked up again and again.
    private final Map<String, WordSuggestionResponse> cache = new ConcurrentHashMap<>();

    public WordSuggestService(WordLookupClient lookup) {
        this.lookup = lookup;
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
                entry.map(WordLookupClient.Entry::phonetic).orElse(null));

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
