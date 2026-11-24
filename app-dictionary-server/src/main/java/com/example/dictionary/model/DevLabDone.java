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
import jakarta.persistence.UniqueConstraint;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

/** A coding lab of a lesson that the learner solved (all its tests passed in the browser). */
@Entity
@Table(name = "dev_lab_done",
        uniqueConstraints = @UniqueConstraint(name = "uk_dev_lab_done", columnNames = {"owner_id", "lesson_code", "lab_id"}),
        indexes = @Index(name = "idx_dev_lab_done_owner", columnList = "owner_id"))
public class DevLabDone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(name = "lesson_code", nullable = false, length = 80)
    private String lessonCode;

    @Column(name = "lab_id", nullable = false, length = 40)
    private String labId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected DevLabDone() {
    }

    public DevLabDone(AppUser owner, String lessonCode, String labId) {
        this.owner = owner;
        this.lessonCode = lessonCode;
        this.labId = labId;
        this.createdAt = Instant.now();
    }

    public String getLessonCode() { return lessonCode; }
    public String getLabId() { return labId; }
}
