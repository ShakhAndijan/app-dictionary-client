package com.example.dictionary.repository;

import com.example.dictionary.model.SentenceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface SentenceLogRepository extends JpaRepository<SentenceLog, Long> {

    long countByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);

    long countByOwnerUsernameAndScoreGreaterThanEqualAndCreatedAtGreaterThanEqual(String username, int score, Instant from);

    List<SentenceLog> findByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);

    long countByOwnerUsername(String username);
}
