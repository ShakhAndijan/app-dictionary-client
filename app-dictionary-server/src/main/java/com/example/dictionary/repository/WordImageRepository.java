package com.example.dictionary.repository;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.Modifying;

import com.example.dictionary.model.WordImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordImageRepository extends JpaRepository<WordImage, Long> {

    @Modifying
    @Query("delete from WordImage i where i.wordId in (select w.id from Word w where w.owner.id = :ownerId)")
    int deleteByWordOwnerId(@Param("ownerId") Long ownerId);

}
