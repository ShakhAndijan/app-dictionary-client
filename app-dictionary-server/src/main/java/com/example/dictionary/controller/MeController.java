package com.example.dictionary.controller;

import com.example.dictionary.dto.ChangePasswordRequest;
import com.example.dictionary.dto.AuthResponse;
import com.example.dictionary.dto.UpdateProfileRequest;
import com.example.dictionary.dto.UserResponse;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Profile", description = "The signed-in user's own profile")
public class MeController {

    private final UserRepository userRepository;
    private final ProfileService profileService;

    public MeController(UserRepository userRepository, ProfileService profileService) {
        this.userRepository = userRepository;
        this.profileService = profileService;
    }

    @Operation(summary = "Get my profile", description = "Returns the profile of the authenticated user.")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> currentUser(@AuthenticationPrincipal UserDetails principal) {
        AppUser user = userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @Operation(summary = "Update my profile",
            description = "Updates the given fields (firstName, lastName, email) of the signed-in user; "
                    + "omitted fields are left unchanged.")
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@AuthenticationPrincipal UserDetails principal,
                                                        @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(principal.getUsername(), request));
    }

    @Operation(summary = "Change my password",
            description = "Verifies the old password and replaces it. All other sessions are signed out; "
                    + "fresh tokens for this session are returned.")
    @PutMapping("/profile/password")
    public ResponseEntity<AuthResponse> changePassword(@AuthenticationPrincipal UserDetails principal,
                                                       @Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(profileService.changePassword(principal.getUsername(), request));
    }
}
