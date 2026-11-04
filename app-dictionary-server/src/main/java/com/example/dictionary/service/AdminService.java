package com.example.dictionary.service;

import com.example.dictionary.dto.AdminDtos.AchievementEntry;
import com.example.dictionary.dto.AdminDtos.AnnouncementRequest;
import com.example.dictionary.dto.AdminDtos.AnnouncementResponse;
import com.example.dictionary.dto.AdminDtos.AuditEntry;
import com.example.dictionary.dto.AdminDtos.DayPoint;
import com.example.dictionary.dto.AdminDtos.FormatUsage;
import com.example.dictionary.dto.AdminDtos.HardWord;
import com.example.dictionary.dto.AdminDtos.InsightsResponse;
import com.example.dictionary.dto.AdminDtos.OverviewResponse;
import com.example.dictionary.dto.AdminDtos.RetentionPoint;
import com.example.dictionary.dto.AdminDtos.ReviewEntry;
import com.example.dictionary.dto.AdminDtos.UpdateNamesRequest;
import com.example.dictionary.dto.AdminDtos.UserDetail;
import com.example.dictionary.dto.AdminDtos.UserRow;
import com.example.dictionary.model.AdminAudit;
import com.example.dictionary.model.Announcement;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.Role;
import com.example.dictionary.repository.AdminAuditRepository;
import com.example.dictionary.repository.AnnouncementRepository;
import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.ReviewLogRepository;
import com.example.dictionary.repository.UserAchievementRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordRepository;
import com.example.dictionary.repository.XpEventRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Usage numbers and account management for the admin pages. Admin accounts are left out of every
 * figure, and every change is written to the audit trail.
 */
@Service
@Transactional(readOnly = true)
public class AdminService {

    private static final int MIN_DAYS = 7;
    private static final int MAX_DAYS = 90;
    private static final int HARD_WORD_MIN_ANSWERS = 3;

    private final UserRepository userRepository;
    private final WordRepository wordRepository;
    private final ReviewLogRepository reviewLogRepository;
    private final QuizSessionRepository quizSessionRepository;
    private final XpEventRepository xpEventRepository;
    private final UserAchievementRepository achievementRepository;
    private final AdminAuditRepository auditRepository;
    private final AnnouncementRepository announcementRepository;
    private final RefreshTokenService refreshTokenService;
    private final com.example.dictionary.repository.WordProgressRepository wordProgressRepository;
    private final com.example.dictionary.repository.WordImageRepository wordImageRepository;
    private final com.example.dictionary.repository.GroupMemberRepository groupMemberRepository;
    private final com.example.dictionary.repository.StudyGroupRepository studyGroupRepository;
    private final com.example.dictionary.repository.RefreshTokenRepository refreshTokenRepository;
    private final jakarta.persistence.EntityManager entityManager;
    private final WordService wordService;
    private final WeeklyReportService weeklyReportService;

    public AdminService(UserRepository userRepository,
                        WordRepository wordRepository,
                        ReviewLogRepository reviewLogRepository,
                        QuizSessionRepository quizSessionRepository,
                        XpEventRepository xpEventRepository,
                        UserAchievementRepository achievementRepository,
                        AdminAuditRepository auditRepository,
                        AnnouncementRepository announcementRepository,
                        RefreshTokenService refreshTokenService,
                        com.example.dictionary.repository.WordProgressRepository wordProgressRepository,
                        com.example.dictionary.repository.WordImageRepository wordImageRepository,
                        com.example.dictionary.repository.GroupMemberRepository groupMemberRepository,
                        com.example.dictionary.repository.StudyGroupRepository studyGroupRepository,
                        com.example.dictionary.repository.RefreshTokenRepository refreshTokenRepository,
                        jakarta.persistence.EntityManager entityManager,
                        WordService wordService,
                        WeeklyReportService weeklyReportService) {
        this.userRepository = userRepository;
        this.wordRepository = wordRepository;
        this.reviewLogRepository = reviewLogRepository;
        this.quizSessionRepository = quizSessionRepository;
        this.xpEventRepository = xpEventRepository;
        this.achievementRepository = achievementRepository;
        this.auditRepository = auditRepository;
        this.announcementRepository = announcementRepository;
        this.refreshTokenService = refreshTokenService;
        this.wordProgressRepository = wordProgressRepository;
        this.wordImageRepository = wordImageRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.entityManager = entityManager;
        this.wordService = wordService;
        this.weeklyReportService = weeklyReportService;
    }

    /* ------------------------------------------------------------ statistics */

    private static int clampDays(int days) {
        return Math.max(MIN_DAYS, Math.min(MAX_DAYS, days));
    }

    public OverviewResponse overview(int requestedDays) {
        int days = clampDays(requestedDays);
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        List<AppUser> users = userRepository.findByRole(Role.USER);
        Set<Long> ids = new HashSet<>();
        for (AppUser u : users) {
            ids.add(u.getId());
        }

        // Which days each user answered something (long enough to cover the 30-day totals and the chart).
        Instant from = today.minusDays(Math.max(30, days) - 1L).atStartOfDay(zone).toInstant();
        Map<Long, Set<LocalDate>> activeDays = new HashMap<>();
        for (Object[] row : reviewLogRepository.answersSince(from)) {
            Long owner = (Long) row[0];
            if (ids.contains(owner)) {
                activeDays.computeIfAbsent(owner, k -> new HashSet<>())
                        .add(((Instant) row[1]).atZone(zone).toLocalDate());
            }
        }

        long newToday = 0;
        long new7 = 0;
        long new30 = 0;
        Map<LocalDate, Integer> signups = new HashMap<>();
        for (AppUser u : users) {
            if (u.getCreatedAt() == null) {
                continue;
            }
            LocalDate d = u.getCreatedAt().atZone(zone).toLocalDate();
            signups.merge(d, 1, Integer::sum);
            if (d.equals(today)) newToday++;
            if (d.isAfter(today.minusDays(7))) new7++;
            if (d.isAfter(today.minusDays(30))) new30++;
        }

        Map<LocalDate, Integer> activePerDay = new HashMap<>();
        long activeToday = 0;
        long active7 = 0;
        long active30 = 0;
        for (Set<LocalDate> userDays : activeDays.values()) {
            boolean in30 = userDays.stream().anyMatch(d -> d.isAfter(today.minusDays(30)));
            if (in30) active30++;
            if (userDays.contains(today)) activeToday++;
            if (userDays.stream().anyMatch(d -> d.isAfter(today.minusDays(7)))) active7++;
            for (LocalDate d : userDays) {
                activePerDay.merge(d, 1, Integer::sum);
            }
        }

        List<DayPoint> series = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            series.add(new DayPoint(d, signups.getOrDefault(d, 0), activePerDay.getOrDefault(d, 0)));
        }

        long totalReviews = 0;
        long totalCorrect = 0;
        long totalWords = 0;
        for (Object[] row : reviewLogRepository.statsByOwner()) {
            if (ids.contains((Long) row[0])) {
                totalReviews += (Long) row[1];
                totalCorrect += ((Number) row[2]).longValue();
            }
        }
        for (Object[] row : wordRepository.countByOwner()) {
            if (ids.contains((Long) row[0])) {
                totalWords += (Long) row[1];
            }
        }
        int accuracy = totalReviews == 0 ? 0 : (int) Math.round(totalCorrect * 100.0 / totalReviews);

        return new OverviewResponse(users.size(), newToday, new7, new30, activeToday, active7, active30,
                totalWords, totalReviews, accuracy, quizSessionRepository.count(), series);
    }

    /** Format usage over the period, retention of old signups and the words that are answered wrongly most. */
    public InsightsResponse insights(int requestedDays) {
        int days = clampDays(requestedDays);
        ZoneId zone = ZoneId.systemDefault();
        Instant from = LocalDate.now(zone).minusDays(days - 1L).atStartOfDay(zone).toInstant();

        List<FormatUsage> formats = new ArrayList<>();
        for (Object[] row : reviewLogRepository.formatUsageSince(from)) {
            formats.add(new FormatUsage(String.valueOf(row[0]), (Long) row[1], ((Number) row[2]).longValue()));
        }
        formats.sort(Comparator.comparingLong(FormatUsage::answers).reversed());

        // Retention: an account counts as retained when it answered something at least N days after it signed up.
        Map<Long, Instant> lastActive = new HashMap<>();
        for (Object[] row : reviewLogRepository.statsByOwner()) {
            lastActive.put((Long) row[0], (Instant) row[3]);
        }
        Instant now = Instant.now();
        List<RetentionPoint> retention = new ArrayList<>();
        for (int n : new int[] {1, 7, 30}) {
            long cohort = 0;
            long retained = 0;
            for (AppUser u : userRepository.findByRole(Role.USER)) {
                Instant created = u.getCreatedAt();
                if (created == null || created.plus(Duration.ofDays(n)).isAfter(now)) {
                    continue;
                }
                cohort++;
                Instant last = lastActive.get(u.getId());
                if (last != null && !last.isBefore(created.plus(Duration.ofDays(n)))) {
                    retained++;
                }
            }
            retention.add(new RetentionPoint(n, cohort, retained));
        }

        List<HardWord> hard = new ArrayList<>();
        for (Object[] row : reviewLogRepository.wordDifficulty(HARD_WORD_MIN_ANSWERS)) {
            long wrong = ((Number) row[2]).longValue();
            if (wrong > 0) {
                hard.add(new HardWord(String.valueOf(row[0]), (Long) row[1], wrong));
            }
        }
        hard.sort(Comparator.comparingDouble((HardWord h) -> (double) h.wrong() / h.answers()).reversed()
                .thenComparing(Comparator.comparingLong(HardWord::answers).reversed()));

        return new InsightsResponse(days, formats, retention, hard.size() > 10 ? hard.subList(0, 10) : hard);
    }

    /* ------------------------------------------------------------ users */

    /** Every account with its own usage numbers, most recently active first. */
    public List<UserRow> users() {
        Map<Long, Long> words = new HashMap<>();
        for (Object[] row : wordRepository.countByOwner()) {
            words.put((Long) row[0], (Long) row[1]);
        }
        Map<Long, Object[]> reviews = new HashMap<>();
        for (Object[] row : reviewLogRepository.statsByOwner()) {
            reviews.put((Long) row[0], row);
        }
        Map<Long, Long> xp = new HashMap<>();
        for (Object[] row : xpEventRepository.totalXpByOwner()) {
            xp.put((Long) row[0], ((Number) row[1]).longValue());
        }

        List<UserRow> rows = new ArrayList<>();
        for (AppUser u : userRepository.findAll()) {
            Object[] r = reviews.get(u.getId());
            rows.add(new UserRow(
                    u.getId(),
                    u.getUsername(),
                    u.getFirstName(),
                    u.getLastName(),
                    (u.getFirstName() + " " + u.getLastName()).trim(),
                    u.getEmail(),
                    u.getRole().name(),
                    u.getCreatedAt(),
                    u.getLastLoginAt(),
                    r == null ? null : (Instant) r[3],
                    words.getOrDefault(u.getId(), 0L),
                    r == null ? 0 : (Long) r[1],
                    r == null ? 0 : ((Number) r[2]).longValue(),
                    xp.getOrDefault(u.getId(), 0L),
                    u.isBlocked()));
        }
        rows.sort(Comparator.comparing(
                (UserRow r) -> latest(r.lastActiveAt(), r.lastLoginAt()),
                Comparator.nullsLast(Comparator.reverseOrder())));
        return rows;
    }

    private UserRow row(Long id) {
        return users().stream().filter(r -> r.id().equals(id)).findFirst()
                .orElseThrow(() -> notFound());
    }

    /** One account's words, recent answers, this week's activity and achievements. */
    public UserDetail detail(Long id) {
        AppUser user = userRepository.findById(id).orElseThrow(AdminService::notFound);
        String username = user.getUsername();

        List<ReviewEntry> reviews = new ArrayList<>();
        for (Object[] r : reviewLogRepository.recentAnswers(id, PageRequest.of(0, 40))) {
            reviews.add(new ReviewEntry((Instant) r[0], String.valueOf(r[1]), (Boolean) r[2], String.valueOf(r[3])));
        }

        List<AchievementEntry> achievements = new ArrayList<>();
        achievementRepository.findByOwnerUsername(username).forEach(got -> {
            try {
                Achievement a = Achievement.valueOf(got.getCode());
                achievements.add(new AchievementEntry(a.name(), a.title(), a.description(), a.icon(),
                        a.tier().name(), got.getUnlockedAt()));
            } catch (IllegalArgumentException ignored) {
                // An achievement that no longer exists in the code.
            }
        });
        achievements.sort(Comparator.comparing(AchievementEntry::unlockedAt).reversed());

        long totalXp = xpEventRepository.totalXp(username);
        int level = Levels.levelFor(totalXp);
        return new UserDetail(row(id), level, Levels.titleFor(level), wordService.listWords(username), reviews,
                weeklyReportService.report(username, 0), achievements, Achievement.values().length);
    }

    /** Renames a regular account; admin accounts are not editable here. Returns the refreshed row. */
    @Transactional
    public UserRow updateNames(String actor, Long id, UpdateNamesRequest request) {
        AppUser user = regularUser(id);
        String before = (user.getFirstName() + " " + user.getLastName()).trim();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        userRepository.save(user);
        record(actor, "RENAME", user, before + " → " + user.getFirstName() + " " + user.getLastName());
        return row(id);
    }

    /**
     * Blocks or unblocks a regular account. Blocking also bumps the token version (all access tokens stop
     * working at once) and revokes every refresh token.
     */
    @Transactional
    public UserRow setBlocked(String actor, Long id, boolean blocked) {
        AppUser user = regularUser(id);
        if (user.isBlocked() != blocked) {
            user.setBlocked(blocked);
            if (blocked) {
                user.incrementTokenVersion();
                refreshTokenService.revokeAll(user);
            }
            userRepository.save(user);
            record(actor, blocked ? "BLOCK" : "UNBLOCK", user, null);
        }
        return row(id);
    }

    /** Makes an account an admin or a regular user again. Nobody changes their own role or removes the last admin. */
    @Transactional
    public UserRow setRole(String actor, Long id, Role role) {
        AppUser user = userRepository.findById(id).orElseThrow(AdminService::notFound);
        if (user.getUsername().equals(actor)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot change your own role");
        }
        if (user.getRole() != role) {
            if (role == Role.ADMIN && user.isBlocked()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unblock the account first");
            }
            if (role == Role.USER && userRepository.countByRole(Role.ADMIN) <= 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The last admin cannot be removed");
            }
            user.setRole(role);
            userRepository.save(user);
            record(actor, role == Role.ADMIN ? "GRANT_ADMIN" : "REVOKE_ADMIN", user, null);
        }
        return row(id);
    }

    /**
     * Permanently deletes a regular account with everything it owns: words and pictures, progress, answers,
     * XP, achievements, quiz sessions, sign-ins, memberships and the groups it owns. Admins must be demoted first.
     */
    @Transactional
    public void deleteUser(String actor, Long id) {
        AppUser user = regularUser(id);
        String label = user.getUsername() + " (" + user.getEmail() + ")";

        reviewLogRepository.deleteByOwnerId(id);
        xpEventRepository.deleteByOwnerId(id);
        achievementRepository.deleteByOwnerId(id);
        wordProgressRepository.deleteByOwnerId(id);
        wordImageRepository.deleteByWordOwnerId(id);
        quizSessionRepository.deleteAll(quizSessionRepository.findByOwnerId(id));
        groupMemberRepository.deleteByUserId(id);
        for (var group : studyGroupRepository.findByOwnerId(id)) {
            groupMemberRepository.deleteAll(groupMemberRepository.findByGroupIdOrderByJoinedAtAsc(group.getId()));
            studyGroupRepository.delete(group);
        }
        refreshTokenRepository.deleteByOwnerId(id);
        quizSessionRepository.flush();
        wordRepository.deleteByOwnerId(id);
        entityManager.flush();
        entityManager.clear();
        userRepository.deleteById(id);
        record(actor, "DELETE_USER", user, label);
    }

    private AppUser regularUser(Long id) {
        return userRepository.findById(id)
                .filter(u -> u.getRole() == Role.USER)
                .orElseThrow(AdminService::notFound);
    }

    /* ------------------------------------------------------------ announcements */

    public List<AnnouncementResponse> announcements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 50)).stream()
                .map(AnnouncementResponse::from).toList();
    }

    @Transactional
    public AnnouncementResponse announce(String actor, AnnouncementRequest request) {
        Announcement.Severity severity = request.severity() == null ? Announcement.Severity.INFO : request.severity();
        Announcement saved = announcementRepository.save(new Announcement(request.message().trim(), severity, actor));
        record(actor, "ANNOUNCE", null, saved.getMessage());
        return AnnouncementResponse.from(saved);
    }

    @Transactional
    public void deleteAnnouncement(String actor, Long id) {
        Announcement a = announcementRepository.findById(id).orElseThrow(AdminService::notFound);
        announcementRepository.delete(a);
        record(actor, "ANNOUNCE_DELETE", null, a.getMessage());
    }

    /* ------------------------------------------------------------ audit trail */

    public List<AuditEntry> audit(int limit) {
        int size = Math.max(1, Math.min(500, limit));
        return auditRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, size)).stream()
                .map(a -> new AuditEntry(a.getId(), a.getActor(), a.getAction(), a.getTargetUsername(),
                        a.getDetails(), a.getCreatedAt()))
                .toList();
    }

    private void record(String actor, String action, AppUser target, String details) {
        auditRepository.save(new AdminAudit(actor, action, target == null ? null : target.getUsername(), details));
    }

    private static ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found");
    }

    private static Instant latest(Instant a, Instant b) {
        if (a == null) return b;
        if (b == null) return a;
        return a.isAfter(b) ? a : b;
    }
}
