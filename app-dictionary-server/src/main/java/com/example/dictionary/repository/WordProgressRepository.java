package com.example.dictionary.repository;

import com.example.dictionary.model.WordProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WordProgressRepository extends JpaRepository<WordProgress, Long> {

    Optional<WordProgress> findByWordId(Long wordId);

    List<WordProgress> findByOwnerUsername(String username);
}
