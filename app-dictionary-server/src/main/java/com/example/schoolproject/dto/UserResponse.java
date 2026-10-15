package com.example.schoolproject.dto;

import com.example.schoolproject.model.AppUser;

/** Safe view of an {@link AppUser} for API responses (no password hash). */
public record UserResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String email
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail());
    }
}
