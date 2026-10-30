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

/** A group of friends whose XP is ranked against each other. People join with the invite code. */
@Entity
@Table(name = "study_groups",
        uniqueConstraints = @UniqueConstraint(name = "uk_study_group_code", columnNames = "invite_code"))
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40)
    private String name;

    @Column(nullable = false, length = 16)
    private String emoji;

    @Column(name = "invite_code", nullable = false, length = 8)
    private String inviteCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected StudyGroup() {
        // Required by JPA.
    }

    public StudyGroup(String name, String emoji, String inviteCode, AppUser owner) {
        this.name = name;
        this.emoji = emoji;
        this.inviteCode = inviteCode;
        this.owner = owner;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmoji() {
        return emoji;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public AppUser getOwner() {
        return owner;
    }

    public void setOwner(AppUser owner) {
        this.owner = owner;
    }
}
