package com.example.dictionary.dto;

import com.example.dictionary.model.AppUser;

/** Safe view of an {@link AppUser} for API responses (no password hash). */
public record UserResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String email,
        int dailyGoal
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDailyGoal());
    }
}
