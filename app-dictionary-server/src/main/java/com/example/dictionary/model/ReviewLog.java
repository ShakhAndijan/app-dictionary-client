package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

/** Append-only history of answers: the basis for per-word stats and any future algorithm tuning. */
@Entity
@Table(name = "review_log", indexes = @Index(name = "idx_review_log_owner_time", columnList = "owner_id, answered_at"))
public class ReviewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "word_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Word word;

    @Column(name = "answered_at", nullable = false)
    private Instant answeredAt;

    @Column(nullable = false)
    private boolean correct;

    @Column(name = "box_before", nullable = false)
    private int startBox;

    @Column(name = "box_after", nullable = false)
    private int endBox;

    @Enumerated(EnumType.STRING)
    @Column(name = "prompt_type", length = 20)
    private PromptType promptType;

    @Enumerated(EnumType.STRING)
    @Column(name = "answer_format", nullable = false, length = 20, columnDefinition = "varchar(20) default 'TYPED'")
    private AnswerFormat answerFormat = AnswerFormat.TYPED;

    /** Set for answers uploaded from the offline queue; makes the upload safe to repeat. */
    @Column(name = "client_id", length = 40)
    private String clientId;

    protected ReviewLog() {
        // Required by JPA.
    }

    public ReviewLog(AppUser owner, Word word, boolean correct, int boxBefore, int boxAfter, PromptType promptType,
                     AnswerFormat answerFormat) {
        this(owner, word, correct, boxBefore, boxAfter, promptType, answerFormat, Instant.now(), null);
    }

    public ReviewLog(AppUser owner, Word word, boolean correct, int boxBefore, int boxAfter, PromptType promptType,
                     AnswerFormat answerFormat, Instant answeredAt, String clientId) {
        this.owner = owner;
        this.word = word;
        this.correct = correct;
        this.startBox = boxBefore;
        this.endBox = boxAfter;
        this.promptType = promptType;
        this.answerFormat = answerFormat;
        this.answeredAt = answeredAt;
        this.clientId = clientId;
    }
}
