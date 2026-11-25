package com.example.dictionary.repository;

import com.example.dictionary.model.DevLabDone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevLabDoneRepository extends JpaRepository<DevLabDone, Long> {

    List<DevLabDone> findByOwnerUsername(String username);

    List<DevLabDone> findByOwnerUsernameAndLessonCode(String username, String lessonCode);

    boolean existsByOwnerUsernameAndLessonCodeAndLabId(String username, String lessonCode, String labId);
    /** Every solved lab as {owner id, createdAt}; for the admin figures. */
    @org.springframework.data.jpa.repository.Query("select d.owner.id, d.createdAt from DevLabDone d")
    List<Object[]> allSolved();
}
