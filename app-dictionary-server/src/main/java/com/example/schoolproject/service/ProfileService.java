package com.example.schoolproject.service;

import com.example.schoolproject.dto.ChangePasswordRequest;
import com.example.schoolproject.dto.UpdateProfileRequest;
import com.example.schoolproject.dto.UserResponse;
import com.example.schoolproject.model.AppUser;
import com.example.schoolproject.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

        return UserResponse.from(user);
    }

    /** Verifies the old password and, if correct, replaces it with the new one. */
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        AppUser user = findUser(username);

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }

    private AppUser findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
