package com.example.schoolproject.controller;

import com.example.schoolproject.dto.AuthResponse;
import com.example.schoolproject.dto.LoginRequest;
import com.example.schoolproject.dto.MessageResponse;
import com.example.schoolproject.dto.RegisterRequest;
import com.example.schoolproject.security.TokenBlacklistService;
import com.example.schoolproject.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Register, log in and log out")
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(AuthService authService, TokenBlacklistService tokenBlacklistService) {
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Operation(summary = "Register a new account",
            description = "Creates an account with first name, last name, email, username and password. "
                    + "Returns a JWT so the new account is logged in immediately.")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @Operation(summary = "Log in", description = "Verifies username/password and returns a fresh JWT.")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Log out", description = "Invalidates (blacklists) the caller's token.")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            tokenBlacklistService.blacklist(authHeader.substring(BEARER_PREFIX.length()));
        }
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}
