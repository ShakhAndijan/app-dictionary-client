package com.example.dictionary;

import com.example.dictionary.model.AppUser;
import com.example.dictionary.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Verifies the JPA mapping, lookups, unique constraint, and that passwords are stored hashed. */
@SpringBootTest
class UserPersistenceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void savesAndFindsByUsername() {
        userRepository.save(new AppUser("ivan", "HASH", "Ivan", "Ivanov", "ivan@example.com"));

        assertThat(userRepository.findByUsername("ivan")).isPresent();
        assertThat(userRepository.existsByUsername("ivan")).isTrue();
        assertThat(userRepository.existsByUsername("absent")).isFalse();
    }

    @Test
    void storesPasswordHashedNotInPlaintext() {
        String raw = "secret123";
        userRepository.save(new AppUser("maria", passwordEncoder.encode(raw),
                "Maria", "Petrova", "maria@example.com"));

        AppUser found = userRepository.findByUsername("maria").orElseThrow();
        assertThat(found.getPassword()).isNotEqualTo(raw);
        assertThat(passwordEncoder.matches(raw, found.getPassword())).isTrue();
        assertThat(found.getEmail()).isEqualTo("maria@example.com");
    }

    @Test
    void usernameMustBeUnique() {
        userRepository.saveAndFlush(new AppUser("ivan", "HASH", "Ivan", "Ivanov", "ivan@example.com"));

        assertThatThrownBy(() -> userRepository.saveAndFlush(
                new AppUser("ivan", "HASH2", "Other", "Name", "other@example.com")))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
