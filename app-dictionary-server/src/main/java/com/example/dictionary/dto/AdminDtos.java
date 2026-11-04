package com.example.dictionary.dto;

import com.example.dictionary.model.Announcement;
import com.example.dictionary.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** Request and response shapes of the admin endpoints. */
public final class AdminDtos {

    private AdminDtos() {
    }

    /** One day of the signup / activity chart. */
    public record DayPoint(LocalDate date, int newUsers, int activeUsers) {
    }

    public record OverviewResponse(
            long totalUsers,
            long newToday,
            long newLast7Days,
            long newLast30Days,
            long activeToday,
            long activeLast7Days,
            long activeLast30Days,
            long totalWords,
            long totalReviews,
            int accuracyPercent,
            long totalQuizSessions,
            List<DayPoint> series
    ) {
    }

    /** Answers given in a format over the chosen period. */
    public record FormatUsage(String format, long answers, long correct) {
    }

    /** Of the accounts at least {@code days} old, how many were still answering {@code days} after signing up. */
    public record RetentionPoint(int days, long cohort, long retained) {
    }

    public record HardWord(String english, long answers, long wrong) {
    }

    public record InsightsResponse(
            int days,
            List<FormatUsage> formats,
            List<RetentionPoint> retention,
            List<HardWord> hardestWords
    ) {
    }

    public record UpdateNamesRequest(
            @NotBlank @Size(max = 100) String firstName,
            @NotBlank @Size(max = 100) String lastName
    ) {
    }

    public record BlockRequest(boolean blocked) {
    }

    public record RoleRequest(@NotNull Role role) {
    }

    public record UserRow(
            Long id,
            String username,
            String firstName,
            String lastName,
            String fullName,
            String email,
            String role,
            Instant createdAt,
            Instant lastLoginAt,
            Instant lastActiveAt,
            long wordCount,
            long reviewCount,
            long correctCount,
            long totalXp,
            boolean blocked
    ) {
    }

    public record ReviewEntry(Instant answeredAt, String english, boolean correct, String format) {
    }

    public record AchievementEntry(String code, String title, String description, String icon, String tier,
                                   Instant unlockedAt) {
    }

    /** Everything the admin sees on one user's page. */
    public record UserDetail(
            UserRow user,
            int level,
            String levelTitle,
            List<WordResponse> words,
            List<ReviewEntry> recentReviews,
            WeeklyReportResponse weekly,
            List<AchievementEntry> achievements,
            int totalAchievements
    ) {
    }

    public record AuditEntry(Long id, String actor, String action, String target, String details, Instant at) {
    }

    public record AnnouncementRequest(
            @NotBlank @Size(max = 500) String message,
            Announcement.Severity severity
    ) {
    }

    public record AnnouncementResponse(Long id, String message, String severity, String createdBy, Instant createdAt) {
        public static AnnouncementResponse from(Announcement a) {
            return new AnnouncementResponse(a.getId(), a.getMessage(), a.getSeverity().name(), a.getCreatedBy(),
                    a.getCreatedAt());
        }
    }
}
