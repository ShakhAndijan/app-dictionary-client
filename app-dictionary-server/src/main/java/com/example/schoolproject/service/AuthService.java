package com.example.schoolproject.service;

import com.example.schoolproject.dto.AuthResponse;
import com.example.schoolproject.dto.LoginRequest;
import com.example.schoolproject.dto.RegisterRequest;
import com.example.schoolproject.model.AppUser;
import com.example.schoolproject.repository.UserRepository;
import com.example.schoolproject.security.JwtService;
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

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /** Registers a new account (storing only a BCrypt hash) and returns a token so
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

        return buildAuthResponse(user);
    }

    /** Verifies the credentials via the {@code AuthenticationManager} and returns a fresh token. */
    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException (-> 401) when username/password don't match.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        AppUser user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(AppUser user) {
        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(
                token,
                "Bearer",
                user.getUsername(),
                jwtService.getExpirationSeconds());
    }
}
