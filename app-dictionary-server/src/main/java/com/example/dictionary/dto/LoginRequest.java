package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/** Payload for {@code POST /api/auth/login}. */
public record LoginRequest(

        @NotBlank
        @Schema(example = "ivan")
        String username,

        @NotBlank
        @Schema(example = "secret123")
        String password
) {
}
