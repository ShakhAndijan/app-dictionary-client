package com.example.dictionary.repository;

import com.example.dictionary.model.AdminNote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminNoteRepository extends JpaRepository<AdminNote, Long> {

    List<AdminNote> findByOwnerOrderByIdDesc(String owner, Pageable page);

    List<AdminNote> findByOwnerAndIdLessThanOrderByIdDesc(String owner, Long before, Pageable page);

    Optional<AdminNote> findByIdAndOwner(Long id, String owner);
}
