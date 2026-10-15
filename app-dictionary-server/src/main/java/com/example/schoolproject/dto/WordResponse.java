package com.example.schoolproject.dto;

import com.example.schoolproject.model.Word;

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
