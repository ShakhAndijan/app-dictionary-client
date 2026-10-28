package com.example.dictionary.dto;

import com.example.dictionary.model.QuizMode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/** Which word pool to start a "Baholash" quiz session from. */
public record StartQuizRequest(

        @NotNull
        @Schema(example = "ALL", description = "ALL = every word the user has added; TODAY = only words added today")
        QuizMode mode
) {
}
