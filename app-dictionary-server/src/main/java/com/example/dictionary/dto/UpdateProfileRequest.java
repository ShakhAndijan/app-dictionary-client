package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;

/** Partial-update payload for the signed-in user's profile: any field left {@code null} is left unchanged. */
public record UpdateProfileRequest(

        @Schema(example = "Ivan")
        String firstName,

        @Schema(example = "Ivanov")
        String lastName,

        @Email
        @Schema(example = "ivan@example.com")
        String email
) {
}
