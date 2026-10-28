package com.example.dictionary.dto;

/** Returned on successful register/login/refresh/password change. The client sends {@code token}
 *  back as an {@code Authorization: Bearer <token>} header on later requests and keeps
 *  {@code refreshToken} to obtain a new access token once this one expires. */
public record AuthResponse(
        String token,
        String tokenType,
        String username,
        long expiresInSeconds,
        String refreshToken
) {
}
