package com.example.dictionary.dto;

import com.example.dictionary.model.Word;
import com.example.dictionary.model.WordState;
import com.example.dictionary.service.WordInsight;

import java.time.Instant;

/** API view of a {@link Word}. */
public record WordResponse(
        Long id,
        String english,
        String uzbek,
        String definition,
        Instant createdAt,
        WordState state,
        int lapses,
        boolean weak,
        Long imageVersion
) {
    public static WordResponse from(Word word, WordInsight insight) {
        return new WordResponse(
                word.getId(),
                word.getEnglish(),
                word.getUzbek(),
                word.getDefinition(),
                word.getCreatedAt(),
                insight.state(),
                insight.lapses(),
                insight.weak(),
                word.getImageVersion());
    }
}
