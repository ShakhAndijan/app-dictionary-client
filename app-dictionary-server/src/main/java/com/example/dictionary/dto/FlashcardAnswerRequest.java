package com.example.dictionary.dto;

import jakarta.validation.constraints.NotNull;

/** The user's self-assessment of one flashcard. */
public record FlashcardAnswerRequest(
        @NotNull Long wordId,
        @NotNull Boolean known
) {
}
