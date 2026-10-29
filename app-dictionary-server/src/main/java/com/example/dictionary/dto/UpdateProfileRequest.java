package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

/** Partial-update payload for the signed-in user's profile: any field left {@code null} is left unchanged. */
public record UpdateProfileRequest(

        @Schema(example = "Ivan")
        String firstName,

        @Schema(example = "Ivanov")
        String lastName,

        @Email
        @Schema(example = "ivan@example.com")
        String email,

        @Min(1)
        @Max(100)
        @Schema(example = "10", description = "Words to practise per day, 1-100")
        Integer dailyGoal
) {
}
