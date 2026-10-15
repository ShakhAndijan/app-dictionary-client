package com.example.schoolproject.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A single run of the "Baholash" quiz. Tracks progress so the client can ask for the
 * next question / submit an answer without re-sending the whole word pool each time.
 *
 * When the eligible word pool has 20 or fewer words ({@link #unlimited} is false), the
 * pool is shuffled once into {@link #remainingQueue} and each word is asked exactly
 * once; the session finishes automatically once the queue is empty. When there are
 * more than 20 eligible words, {@link #unlimited} is true and words are drawn at
 * random (with repeats) until the client explicitly finishes the session.
 */
@Entity
@Table(name = "quiz_sessions")
public class QuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuizMode mode;

    @Column(nullable = false)
    private boolean unlimited;

    @Column(name = "total_words", nullable = false)
    private int totalWords;

    @ElementCollection
    @CollectionTable(name = "quiz_session_queue", joinColumns = @JoinColumn(name = "session_id"))
    @OrderColumn(name = "queue_index")
    @Column(name = "word_id", nullable = false)
    private List<Long> remainingQueue = new ArrayList<>();

    @Column(name = "answered_count", nullable = false)
    private int answeredCount;

    @Column(name = "correct_count", nullable = false)
    private int correctCount;

    @Column(name = "incorrect_count", nullable = false)
    private int incorrectCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuizStatus status;

    @Column(name = "current_word_id")
    private Long currentWordId;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_prompt_type", length = 20)
    private PromptType currentPromptType;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_answer_field", length = 20)
    private AnswerField currentAnswerField;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    protected QuizSession() {
        // Required by JPA.
    }

    public QuizSession(AppUser owner, QuizMode mode, boolean unlimited, int totalWords) {
        this.owner = owner;
        this.mode = mode;
        this.unlimited = unlimited;
        this.totalWords = totalWords;
        this.status = QuizStatus.IN_PROGRESS;
        this.startedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public AppUser getOwner() {
        return owner;
    }

    public QuizMode getMode() {
        return mode;
    }

    public boolean isUnlimited() {
        return unlimited;
    }

    public int getTotalWords() {
        return totalWords;
    }

    public List<Long> getRemainingQueue() {
        return remainingQueue;
    }

    public int getAnsweredCount() {
        return answeredCount;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public int getIncorrectCount() {
        return incorrectCount;
    }

    public QuizStatus getStatus() {
        return status;
    }

    public void setStatus(QuizStatus status) {
        this.status = status;
    }

    public Long getCurrentWordId() {
        return currentWordId;
    }

    public PromptType getCurrentPromptType() {
        return currentPromptType;
    }

    public AnswerField getCurrentAnswerField() {
        return currentAnswerField;
    }

    /** Sets the question the user is currently expected to answer. */
    public void setCurrentQuestion(Long wordId, PromptType promptType, AnswerField answerField) {
        this.currentWordId = wordId;
        this.currentPromptType = promptType;
        this.currentAnswerField = answerField;
    }

    /** Clears the pending question (called when the session finishes). */
    public void clearCurrentQuestion() {
        this.currentWordId = null;
        this.currentPromptType = null;
        this.currentAnswerField = null;
    }

    public void recordAnswer(boolean correct) {
        this.answeredCount++;
        if (correct) {
            this.correctCount++;
        } else {
            this.incorrectCount++;
        }
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }

    public void finish() {
        this.status = QuizStatus.FINISHED;
        this.finishedAt = Instant.now();
        clearCurrentQuestion();
    }
}
