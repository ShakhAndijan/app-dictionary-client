package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Payload for changing the signed-in user's password. */
public record ChangePasswordRequest(

        @NotBlank
        @Schema(example = "secret123")
        String oldPassword,

        @NotBlank
        @Size(min = 6, max = 100)
        @Schema(example = "newSecret456")
        String newPassword
) {
}
