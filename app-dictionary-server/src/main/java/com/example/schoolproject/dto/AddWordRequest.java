package com.example.schoolproject.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/** Payload for adding a new vocabulary word. */
public record AddWordRequest(

        @NotBlank
        @Schema(example = "apple")
        String english,

        @NotBlank
        @Schema(example = "olma")
        String uzbek,

        @Schema(example = "A round fruit with red or green skin.")
        String definition
) {
}
