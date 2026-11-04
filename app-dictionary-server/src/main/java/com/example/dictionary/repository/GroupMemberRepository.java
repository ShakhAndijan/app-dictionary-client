package com.example.dictionary.repository;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.Modifying;

import com.example.dictionary.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByUserUsernameOrderByJoinedAtAsc(String username);

    List<GroupMember> findByGroupIdOrderByJoinedAtAsc(Long groupId);

    Optional<GroupMember> findByGroupIdAndUserUsername(Long groupId, String username);

    Optional<GroupMember> findByGroupIdAndUserId(Long groupId, Long userId);

    boolean existsByGroupIdAndUserUsername(Long groupId, String username);

    long countByGroupId(Long groupId);

    long countByUserUsername(String username);

    @Modifying
    @Query("delete from GroupMember m where m.user.id = :userId")
    int deleteByUserId(@Param("userId") Long userId);

}
