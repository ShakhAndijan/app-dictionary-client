package com.example.dictionary.repository;

import com.example.dictionary.model.LearnLesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearnLessonRepository extends JpaRepository<LearnLesson, Long> {

    Optional<LearnLesson> findByCode(String code);

    List<LearnLesson> findByLevelOrderByOrderIndexAscIdAsc(String level);
}
