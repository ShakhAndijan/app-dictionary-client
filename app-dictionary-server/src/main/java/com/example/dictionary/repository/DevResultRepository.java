package com.example.dictionary.repository;

import com.example.dictionary.model.DevResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevResultRepository extends JpaRepository<DevResult, Long> {

    List<DevResult> findByOwnerUsernameAndLevelOrderByCreatedAtDesc(String username, String level);
}
