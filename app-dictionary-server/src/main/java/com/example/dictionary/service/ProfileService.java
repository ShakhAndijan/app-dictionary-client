package com.example.dictionary.service;

import com.example.dictionary.dto.AuthResponse;
import com.example.dictionary.dto.ChangePasswordRequest;
import com.example.dictionary.dto.UpdateProfileRequest;
import com.example.dictionary.dto.UserResponse;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    /** English: words (add and practise words), ielts. Programming: frontend. */
    static final java.util.List<String> MODULES = java.util.List.of("words", "course", "ielts", "frontend", "html", "css", "javascript", "react");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final AuthService authService;

    public ProfileService(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          RefreshTokenService refreshTokenService,
                          AuthService authService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.authService = authService;
    }

    /** Updates only the non-null fields of the given username's profile. */
    @Transactional
    public UserResponse updateProfile(String username, UpdateProfileRequest request) {
        AppUser user = findUser(username);

        if (request.email() != null && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already taken");
            }
            user.setEmail(request.email());
        }
        if (request.firstName() != null) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }
        if (request.dailyGoal() != null) {
            user.setDailyGoal(request.dailyGoal());
        }

        if (request.modules() != null) {
            java.util.List<String> chosen = request.modules().stream().map(String::trim).distinct().toList();
            if (!MODULES.containsAll(chosen)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown module");
            }
            // Keep the canonical order so the stored value is stable.
            user.setModules(MODULES.stream().filter(chosen::contains).toList());
        }

        return UserResponse.from(user);
    }

    /**
     * Verifies the old password and, if correct, replaces it. Every existing session (access and
     * refresh tokens) is invalidated, and fresh tokens are returned so the caller stays signed in.
     */
    @Transactional
    public AuthResponse changePassword(String username, ChangePasswordRequest request) {
        AppUser user = findUser(username);

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.incrementTokenVersion();
        refreshTokenService.revokeAll(user);

        return authService.issueTokens(user);
    }

    private AppUser findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
