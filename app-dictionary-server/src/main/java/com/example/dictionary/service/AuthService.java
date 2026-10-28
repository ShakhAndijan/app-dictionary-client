package com.example.dictionary.service;

import com.example.dictionary.dto.AuthResponse;
import com.example.dictionary.dto.LoginRequest;
import com.example.dictionary.dto.RegisterRequest;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    /** Registers a new account (storing only a BCrypt hash) and returns tokens so
     *  the new account is logged in immediately. */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already taken");
        }

        AppUser user = new AppUser(
                request.username(),
                passwordEncoder.encode(request.password()),
                request.firstName(),
                request.lastName(),
                request.email());
        userRepository.save(user);

        return issueTokens(user);
    }

    /** Verifies the credentials via the {@code AuthenticationManager} and returns fresh tokens. */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException (-> 401) when username/password don't match.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        AppUser user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        return issueTokens(user);
    }

    /**
     * Swaps a refresh token for a new access token and a new refresh token. The reuse-detection
     * revocation done in {@link RefreshTokenService#rotate} must be committed even though a 401 is
     * thrown, hence {@code noRollbackFor}.
     */
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AuthResponse refresh(String refreshToken) {
        RefreshTokenService.Rotation rotation = refreshTokenService.rotate(refreshToken);
        return buildAuthResponse(rotation.owner(), rotation.refreshToken());
    }

    /** Ends the login session the refresh token belongs to; a missing/unknown token is a no-op. */
    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revoke(refreshToken);
        }
    }

    /** Starts a new login session for the user: an access token plus a new refresh token family. */
    @Transactional
    public AuthResponse issueTokens(AppUser user) {
        return buildAuthResponse(user, refreshTokenService.issue(user));
    }

    private AuthResponse buildAuthResponse(AppUser user, String refreshToken) {
        return new AuthResponse(
                jwtService.generateToken(user.getUsername(), user.getTokenVersion()),
                "Bearer",
                user.getUsername(),
                jwtService.getExpirationSeconds(),
                refreshToken);
    }
}
