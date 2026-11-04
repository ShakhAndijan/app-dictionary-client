package com.example.dictionary.repository;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.Modifying;

import com.example.dictionary.model.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByOwnerUsername(String username);

    @Modifying
    @Query("delete from UserAchievement a where a.owner.id = :ownerId")
    int deleteByOwnerId(@Param("ownerId") Long ownerId);

}
