package com.example.dictionary.service;

import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.Role;
import com.example.dictionary.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the admin account on startup when it does not exist yet. An existing account with the same
 * username is never touched, so a regular user can't be promoted (or a changed password reset) by a restart.
 */
@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;
    private final String email;

    public AdminSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${app.admin.username:}") String username,
                       @Value("${app.admin.password:}") String password,
                       @Value("${app.admin.email:superadmin@dictionary.local}") String email) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (username.isBlank() || password.isBlank() || userRepository.existsByUsername(username)) {
            return;
        }
        AppUser admin = new AppUser(username, passwordEncoder.encode(password), "Super", "Admin", email);
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        log.info("Created admin account '{}'", username);
    }
}
