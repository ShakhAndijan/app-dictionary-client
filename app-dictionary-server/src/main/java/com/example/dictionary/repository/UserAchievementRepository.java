package com.example.dictionary.repository;

import com.example.dictionary.model.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByOwnerUsername(String username);
}
