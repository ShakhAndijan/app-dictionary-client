package com.example.dictionary.repository;

import com.example.dictionary.model.WordImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordImageRepository extends JpaRepository<WordImage, Long> {
}
