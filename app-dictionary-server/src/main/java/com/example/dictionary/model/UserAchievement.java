package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

/** An achievement a user has unlocked. {@code seen} turns true once the app has shown the unlock celebration. */
@Entity
@Table(name = "user_achievements",
        uniqueConstraints = @UniqueConstraint(name = "uk_user_achievement", columnNames = {"owner_id", "code"}))
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(nullable = false, length = 40)
    private String code;

    @Column(name = "unlocked_at", nullable = false)
    private Instant unlockedAt;

    @Column(nullable = false)
    private boolean seen;

    protected UserAchievement() {
        // Required by JPA.
    }

    public UserAchievement(AppUser owner, String code) {
        this.owner = owner;
        this.code = code;
        this.unlockedAt = Instant.now();
    }

    public String getCode() {
        return code;
    }

    public Instant getUnlockedAt() {
        return unlockedAt;
    }

    public boolean isSeen() {
        return seen;
    }

    public void markSeen() {
        this.seen = true;
    }
}
