package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** The user's answer to the current question. Compared case-insensitively, trimmed. */
public record SubmitQuizAnswerRequest(
        @Schema(example = "apple")
        String answer
) {
}
