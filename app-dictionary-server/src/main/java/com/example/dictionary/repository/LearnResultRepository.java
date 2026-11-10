package com.example.dictionary.repository;

import com.example.dictionary.model.LearnResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface LearnResultRepository extends JpaRepository<LearnResult, Long> {

    List<LearnResult> findByOwnerUsernameAndLevelOrderByCreatedAtDesc(String username, String level);

    List<LearnResult> findByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);
}
