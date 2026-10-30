package com.example.dictionary.repository;

import com.example.dictionary.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface WordRepository extends JpaRepository<Word, Long> {

    List<Word> findByOwnerUsernameOrderByCreatedAtDesc(String username);

    List<Word> findByOwnerUsernameAndFavoriteTrueOrderByCreatedAtDesc(String username);

    long countByOwnerUsername(String username);

    long countByOwnerUsernameAndFavoriteTrue(String username);

    long countByOwnerUsernameAndImageVersionNotNull(String username);

    Optional<Word> findByIdAndOwnerUsername(Long id, String username);

    List<Word> findByOwnerUsernameAndCreatedAtGreaterThanEqual(String username, Instant from);
}
