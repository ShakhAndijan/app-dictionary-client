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

import java.time.Instant;

/**
 * A vocabulary entry (English word, Uzbek translation, definition) that belongs to
 * the {@link AppUser} who added it.
 */
@Entity
@Table(name = "words")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String english;

    @Column(nullable = false)
    private String uzbek;

    @Column(columnDefinition = "TEXT")
    private String definition;

    /** Bumped whenever the picture changes (null = no picture); lets clients cache images safely. */
    @Column(name = "image_version")
    private Long imageVersion;

    /** Starred by the user. */
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean favorite;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    protected Word() {
        // Required by JPA.
    }

    public Word(String english, String uzbek, String definition, AppUser owner) {
        this.english = english;
        this.uzbek = uzbek;
        this.definition = definition;
        this.owner = owner;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    public String getUzbek() {
        return uzbek;
    }

    public void setUzbek(String uzbek) {
        this.uzbek = uzbek;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public Long getImageVersion() {
        return imageVersion;
    }

    public void setImageVersion(Long imageVersion) {
        this.imageVersion = imageVersion;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public AppUser getOwner() {
        return owner;
    }
}
