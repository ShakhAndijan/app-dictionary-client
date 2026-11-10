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

/**
 * One finished lesson, or one skill section of a level exam. Daily goals, level progress and the
 * "weakest skill" statistics are all derived from these rows.
 */
@Entity
@Table(name = "learn_results", indexes = @Index(name = "idx_learn_result_owner_time", columnList = "owner_id, created_at"))
public class LearnResult {

    public static final String LESSON = "LESSON";
    public static final String EXAM = "EXAM";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(nullable = false, length = 10)
    private String kind;

    @Column(nullable = false, length = 2)
    private String level;

    @Column(nullable = false, length = 20)
    private String skill;

    /** Set for lessons, null for exam sections. */
    @Column(name = "lesson_code", length = 80)
    private String lessonCode;

    @Column(nullable = false)
    private int correct;

    @Column(nullable = false)
    private int total;

    /** Lesson: score reached the pass mark. Exam section: the whole exam was passed. */
    @Column(nullable = false)
    private boolean passed;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected LearnResult() {
        // Required by JPA.
    }

    public LearnResult(AppUser owner, String kind, String level, String skill, String lessonCode,
                       int correct, int total, boolean passed) {
        this.owner = owner;
        this.kind = kind;
        this.level = level;
        this.skill = skill;
        this.lessonCode = lessonCode;
        this.correct = correct;
        this.total = total;
        this.passed = passed;
        this.createdAt = Instant.now();
    }

    public String getKind() { return kind; }
    public String getLevel() { return level; }
    public String getSkill() { return skill; }
    public String getLessonCode() { return lessonCode; }
    public int getCorrect() { return correct; }
    public int getTotal() { return total; }
    public boolean isPassed() { return passed; }
    public Instant getCreatedAt() { return createdAt; }
}
