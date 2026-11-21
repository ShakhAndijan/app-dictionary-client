package com.example.dictionary.repository;

import com.example.dictionary.model.DevProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DevProfileRepository extends JpaRepository<DevProfile, Long> {

    Optional<DevProfile> findByOwnerUsername(String username);
}
