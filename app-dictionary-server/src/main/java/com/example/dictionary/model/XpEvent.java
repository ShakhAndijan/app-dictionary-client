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

/**
 * One grant of experience points. XP is an append-only ledger: the total is the sum of the user's events,
 * so every point can be traced back to the answer, goal or achievement that earned it.
 */
@Entity
@Table(name = "xp_events", indexes = @Index(name = "idx_xp_owner_time", columnList = "owner_id, created_at"))
public class XpEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    /** The word that was answered; a plain id (no foreign key) so deleting a word never removes earned XP. */
    @Column(name = "word_id")
    private Long wordId;

    @Column(nullable = false)
    private int amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private XpSource source;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected XpEvent() {
        // Required by JPA.
    }

    public XpEvent(AppUser owner, Long wordId, int amount, XpSource source) {
        this.owner = owner;
        this.wordId = wordId;
        this.amount = amount;
        this.source = source;
        this.createdAt = Instant.now();
    }

    public int getAmount() {
        return amount;
    }
}
