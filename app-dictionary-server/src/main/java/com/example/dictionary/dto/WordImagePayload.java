package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/** A word's picture as it travels over the API: base64 text plus its media type. */
public record WordImagePayload(

        @NotBlank
        @Schema(example = "image/jpeg", description = "image/jpeg, image/png or image/webp")
        String contentType,

        @NotBlank
        @Schema(description = "Base64-encoded image bytes, at most 1 MB once decoded")
        String data
) {
}
