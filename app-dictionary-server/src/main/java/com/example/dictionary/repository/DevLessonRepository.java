package com.example.dictionary.repository;

import com.example.dictionary.model.DevLesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DevLessonRepository extends JpaRepository<DevLesson, Long> {

    Optional<DevLesson> findByCode(String code);

    List<DevLesson> findByLevelOrderByOrderIndexAscIdAsc(String level);
}
