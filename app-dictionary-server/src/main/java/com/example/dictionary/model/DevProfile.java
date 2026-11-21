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

/** The level (JUNIOR, MIDDLE, SENIOR) a user is studying in the programming course. */
@Entity
@Table(name = "dev_profiles", uniqueConstraints = @UniqueConstraint(name = "uk_dev_profile_owner", columnNames = "owner_id"))
public class DevProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private AppUser owner;

    @Column(nullable = false, length = 10)
    private String level;

    protected DevProfile() {
    }

    public DevProfile(AppUser owner, String level) {
        this.owner = owner;
        this.level = level;
    }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
