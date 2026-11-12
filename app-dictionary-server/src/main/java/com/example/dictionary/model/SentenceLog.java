package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

/** One graded sentence: feeds the daily goal and the sentence statistics. */
@Entity
@Table(name = "sentence_logs", indexes = @Index(name = "idx_sentence_owner_time", columnList = "owner_id, created_at"))
public class SentenceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(name = "word_id")
    private Long wordId;

    @Column(nullable = false)
    private int score;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected SentenceLog() {
    }

    public SentenceLog(AppUser owner, Long wordId, int score) {
        this.owner = owner;
        this.wordId = wordId;
        this.score = score;
        this.createdAt = Instant.now();
    }

    public int getScore() {
        return score;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
