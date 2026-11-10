package com.example.dictionary.repository;

import com.example.dictionary.model.LearnProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnProfileRepository extends JpaRepository<LearnProfile, Long> {

    Optional<LearnProfile> findByOwnerUsername(String username);
}
