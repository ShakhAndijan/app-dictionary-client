package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * A registered account. The {@link #password} column stores only the BCrypt hash.
 */
@Entity
@Table(name = "users")
public class AppUser {

    public static final int DEFAULT_DAILY_GOAL = 10;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    /** Embedded in every access token; bumping it invalidates all tokens issued before. */
    @Column(name = "token_version", nullable = false, columnDefinition = "integer default 0")
    private int tokenVersion;

    /** How many different words the user wants to practise per day. */
    @Column(name = "daily_goal", nullable = false, columnDefinition = "integer default 10")
    private int dailyGoal = DEFAULT_DAILY_GOAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'USER'")
    private Role role = Role.USER;

    /** Null for accounts that existed before this column was added. */
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    /** A blocked account cannot log in, refresh or use its existing tokens. */
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean blocked;

    protected AppUser() {
        // Required by JPA.
    }

    public AppUser(String username, String password, String firstName, String lastName, String email) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getDailyGoal() {
        return dailyGoal;
    }

    public void setDailyGoal(int dailyGoal) {
        this.dailyGoal = dailyGoal;
    }

    public int getTokenVersion() {
        return tokenVersion;
    }

    public void incrementTokenVersion() {
        this.tokenVersion++;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(Instant lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }
}
