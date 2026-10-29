package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Spaced-repetition state of one {@link Word}. A word without a row here has never been answered.
 */
@Entity
@Table(name = "word_progress")
public class WordProgress {

    public static final int RECOVERY_STREAK = 3;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "word_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Word word;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(nullable = false)
    private int box;

    @Column(name = "next_review_date", nullable = false)
    private LocalDate nextReviewDate;

    @Column(name = "last_reviewed_at", nullable = false)
    private Instant lastReviewedAt;

    @Column(nullable = false)
    private int reps;

    /** Number of times the word was forgotten (answered wrong). */
    @Column(nullable = false)
    private int lapses;

    @Column(name = "correct_streak", nullable = false)
    private int correctStreak;

    @Version
    private long version;

    protected WordProgress() {
        // Required by JPA.
    }

    public WordProgress(Word word, AppUser owner) {
        this.word = word;
        this.owner = owner;
    }

    public Word getWord() {
        return word;
    }

    public int getBox() {
        return box;
    }

    public LocalDate getNextReviewDate() {
        return nextReviewDate;
    }

    public int getLapses() {
        return lapses;
    }

    public int getCorrectStreak() {
        return correctStreak;
    }

    public int getReps() {
        return reps;
    }

    /** A word is weak after a mistake until it has been answered correctly {@value #RECOVERY_STREAK} times in a row. */
    public boolean isWeak() {
        return lapses > 0 && correctStreak < RECOVERY_STREAK;
    }

    /** Applies a new schedule after an answer. */
    public void apply(int newBox, LocalDate newNextReviewDate, boolean correct) {
        this.box = newBox;
        this.nextReviewDate = newNextReviewDate;
        this.lastReviewedAt = Instant.now();
        this.reps++;
        if (correct) {
            this.correctStreak++;
        } else {
            this.lapses++;
            this.correctStreak = 0;
        }
    }
}
