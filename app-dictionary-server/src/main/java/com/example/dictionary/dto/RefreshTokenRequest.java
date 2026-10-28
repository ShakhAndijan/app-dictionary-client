package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/** Payload for {@code POST /api/auth/refresh}; also accepted (optionally) by {@code /logout}. */
public record RefreshTokenRequest(

        @NotBlank
        @Schema(example = "q1w2e3...")
        String refreshToken
) {
}
