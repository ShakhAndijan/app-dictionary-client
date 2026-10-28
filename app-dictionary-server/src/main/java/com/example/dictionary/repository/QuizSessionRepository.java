package com.example.dictionary.repository;

import com.example.dictionary.model.QuizSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface QuizSessionRepository extends JpaRepository<QuizSession, Long> {

    Optional<QuizSession> findByIdAndOwnerUsername(Long id, String username);

    List<QuizSession> findByOwnerUsernameAndStartedAtGreaterThanEqual(String username, Instant from);
}
