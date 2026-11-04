package com.example.dictionary.repository;

import com.example.dictionary.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.dictionary.model.Role;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<AppUser> findByRole(Role role);

    long countByRole(Role role);
}
