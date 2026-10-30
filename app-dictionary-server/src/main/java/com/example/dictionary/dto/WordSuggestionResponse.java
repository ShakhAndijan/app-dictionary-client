package com.example.dictionary.dto;

/** What could be looked up for an English word; every field is null when nothing was found. */
public record WordSuggestionResponse(
        String english,
        String uzbek,
        String definition,
        String example,
        String phonetic
) {
    public boolean isEmpty() {
        return uzbek == null && definition == null;
    }
}
