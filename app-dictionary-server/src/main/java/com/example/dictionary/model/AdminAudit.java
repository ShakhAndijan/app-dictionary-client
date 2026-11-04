package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * One admin action: who did what to whom. Usernames are copied in (not referenced) so the trail
 * survives if an account is later renamed or removed.
 */
@Entity
@Table(name = "admin_audit", indexes = @Index(name = "idx_admin_audit_time", columnList = "created_at"))
public class AdminAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String actor;

    @Column(nullable = false, length = 30)
    private String action;

    @Column(name = "target_username", length = 50)
    private String targetUsername;

    @Column(length = 500)
    private String details;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected AdminAudit() {
        // Required by JPA.
    }

    public AdminAudit(String actor, String action, String targetUsername, String details) {
        this.actor = actor;
        this.action = action;
        this.targetUsername = targetUsername;
        this.details = details == null || details.length() <= 500 ? details : details.substring(0, 500);
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getActor() {
        return actor;
    }

    public String getAction() {
        return action;
    }

    public String getTargetUsername() {
        return targetUsername;
    }

    public String getDetails() {
        return details;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
