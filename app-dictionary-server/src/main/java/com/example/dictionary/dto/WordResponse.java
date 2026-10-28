package com.example.dictionary.dto;

import com.example.dictionary.model.Word;

import java.time.Instant;

/** API view of a {@link Word}. */
public record WordResponse(
        Long id,
        String english,
        String uzbek,
        String definition,
        Instant createdAt
) {
    public static WordResponse from(Word word) {
        return new WordResponse(
                word.getId(),
                word.getEnglish(),
                word.getUzbek(),
                word.getDefinition(),
                word.getCreatedAt());
    }
}
