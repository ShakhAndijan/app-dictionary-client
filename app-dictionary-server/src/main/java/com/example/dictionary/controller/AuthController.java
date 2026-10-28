package com.example.dictionary.controller;

import com.example.dictionary.dto.AuthResponse;
import com.example.dictionary.dto.LoginRequest;
import com.example.dictionary.dto.MessageResponse;
import com.example.dictionary.dto.RefreshTokenRequest;
import com.example.dictionary.dto.RegisterRequest;
import com.example.dictionary.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Register, log in, refresh and log out")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Register a new account",
            description = "Creates an account with first name, last name, email, username and password. "
                    + "Returns an access token and a refresh token so the new account is logged in immediately.")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @Operation(summary = "Log in", description = "Verifies username/password and returns an access token and a refresh token.")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Refresh the access token",
            description = "Exchanges a refresh token for a new access token and a new refresh token. "
                    + "Refresh tokens are single-use; re-using one revokes the whole login session.")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }

    @Operation(summary = "Log out",
            description = "Revokes the given refresh token's session. Needs no access token, so a user "
                    + "whose access token has expired can still sign out.")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        authService.logout(request == null ? null : request.refreshToken());
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}
