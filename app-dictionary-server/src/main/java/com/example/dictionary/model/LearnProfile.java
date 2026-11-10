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

/** The CEFR level a user is currently studying (A1, A2, B1, B2, C1). Stored as text, not an enum column. */
@Entity
@Table(name = "learn_profiles", uniqueConstraints = @UniqueConstraint(name = "uk_learn_profile_owner", columnNames = "owner_id"))
public class LearnProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(nullable = false, length = 2)
    private String level;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected LearnProfile() {
        // Required by JPA.
    }

    public LearnProfile(AppUser owner, String level) {
        this.owner = owner;
        this.level = level;
        this.updatedAt = Instant.now();
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
        this.updatedAt = Instant.now();
    }
}
