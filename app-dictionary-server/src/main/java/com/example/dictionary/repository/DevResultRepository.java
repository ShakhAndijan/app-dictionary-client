package com.example.dictionary.repository;

import com.example.dictionary.model.DevResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface DevResultRepository extends JpaRepository<DevResult, Long> {

    List<DevResult> findByOwnerUsernameAndLevelOrderByCreatedAtDesc(String username, String level);
    List<DevResult> findByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);

    /** Every result as {owner id, createdAt, total, correct}; for the admin figures. */
    @org.springframework.data.jpa.repository.Query("select r.owner.id, r.createdAt, r.total, r.correct from DevResult r")
    List<Object[]> allAnswers();
}
