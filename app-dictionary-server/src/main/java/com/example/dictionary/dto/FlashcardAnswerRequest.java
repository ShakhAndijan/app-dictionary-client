package com.example.dictionary.dto;

import com.example.dictionary.model.AnswerFormat;
import jakarta.validation.constraints.NotNull;

/** The user's self-assessment of one flashcard, or the result of one word in a matching game. */
public record FlashcardAnswerRequest(
        @NotNull Long wordId,
        @NotNull Boolean known,
        /** FLASHCARD (default) or MATCHING; anything else is treated as FLASHCARD. */
        AnswerFormat format
) {
}
