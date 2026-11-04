package com.example.dictionary.repository;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.Modifying;

import com.example.dictionary.model.WordProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WordProgressRepository extends JpaRepository<WordProgress, Long> {

    Optional<WordProgress> findByWordId(Long wordId);

    List<WordProgress> findByOwnerUsername(String username);

    @Modifying
    @Query("delete from WordProgress p where p.owner.id = :ownerId")
    int deleteByOwnerId(@Param("ownerId") Long ownerId);

}
