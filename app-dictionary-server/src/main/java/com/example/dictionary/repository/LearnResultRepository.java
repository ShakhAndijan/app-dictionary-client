package com.example.dictionary.repository;

import com.example.dictionary.model.LearnResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface LearnResultRepository extends JpaRepository<LearnResult, Long> {

    List<LearnResult> findByOwnerUsernameAndLevelOrderByCreatedAtDesc(String username, String level);

    List<LearnResult> findByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);
    /** Every result as {owner id, createdAt, total, correct}; for the admin figures. */
    @org.springframework.data.jpa.repository.Query("select r.owner.id, r.createdAt, r.total, r.correct from LearnResult r")
    List<Object[]> allAnswers();
}
