package com.example.dictionary.dto;

import java.util.List;

/** What could be looked up for an English word; every field is null when nothing was found. */
public record WordSuggestionResponse(
        String english,
        String uzbek,
        String definition,
        String example,
        String phonetic,
        List<String> alternatives
) {
    /** Same suggestion, with other words that fit a typed definition. */
    public WordSuggestionResponse withAlternatives(List<String> others) {
        return new WordSuggestionResponse(english, uzbek, definition, example, phonetic, others);
    }

    public boolean isEmpty() {
        return english == null || (uzbek == null && definition == null);
    }
}
