package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Registration payload for new accounts. */
public record RegisterRequest(

        @NotBlank
        @Schema(example = "Ivan")
        String firstName,

        @NotBlank
        @Schema(example = "Ivanov")
        String lastName,

        @NotBlank
        @Email
        @Schema(example = "ivan@example.com")
        String email,

        @NotBlank
        @Size(min = 3, max = 50)
        @Schema(example = "ivan")
        String username,

        @NotBlank
        @Size(min = 6, max = 100)
        @Schema(example = "secret123")
        String password
) {
}
