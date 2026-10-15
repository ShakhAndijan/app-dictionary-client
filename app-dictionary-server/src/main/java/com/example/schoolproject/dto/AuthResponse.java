package com.example.schoolproject.dto;

/** Returned on successful register/login. The client sends {@code token} back as
 *  an {@code Authorization: Bearer <token>} header on later requests. */
public record AuthResponse(
        String token,
        String tokenType,
        String username,
        long expiresInSeconds
) {
}
