package com.example.dictionary.repository;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Modifying;

import com.example.dictionary.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface WordRepository extends JpaRepository<Word, Long> {

    List<Word> findByOwnerUsernameOrderByCreatedAtDesc(String username);

    List<Word> findByOwnerUsernameAndFavoriteTrueOrderByCreatedAtDesc(String username);

    long countByOwnerUsername(String username);

    /** Per owner: {owner id, word count}. */
    @Query("select w.owner.id, count(w) from Word w group by w.owner.id")
    List<Object[]> countByOwner();

    long countByOwnerUsernameAndFavoriteTrue(String username);

    long countByOwnerUsernameAndImageVersionNotNull(String username);

    Optional<Word> findByIdAndOwnerUsername(Long id, String username);

    List<Word> findByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);

    @Modifying
    @Query("delete from Word w where w.owner.id = :ownerId")
    int deleteByOwnerId(@Param("ownerId") Long ownerId);

}
