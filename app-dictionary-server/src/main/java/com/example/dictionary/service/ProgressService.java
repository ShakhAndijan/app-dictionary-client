package com.example.dictionary.service;

import com.example.dictionary.dto.AchievementResponse;
import com.example.dictionary.dto.ProgressResponse;
import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.UserAchievement;
import com.example.dictionary.model.Word;
import com.example.dictionary.model.WordProgress;
import com.example.dictionary.model.XpEvent;
import com.example.dictionary.model.XpSource;
import com.example.dictionary.repository.ReviewLogRepository;
import com.example.dictionary.repository.UserAchievementRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordProgressRepository;
import com.example.dictionary.repository.WordRepository;
import com.example.dictionary.repository.XpEventRepository;
import com.example.dictionary.service.Achievement.Metric;
import com.example.dictionary.service.ReviewScheduler.Outcome;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** XP, levels and achievements. XP is granted as answers come in; achievements are checked when progress is read. */
@Service
public class ProgressService {

    private final XpEventRepository xpRepository;
    private final UserAchievementRepository achievementRepository;
    private final ReviewLogRepository logRepository;
    private final WordRepository wordRepository;
    private final WordProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final StatsService statsService;
    private final ZoneId zone = ZoneId.systemDefault();

    public ProgressService(XpEventRepository xpRepository,
                           UserAchievementRepository achievementRepository,
                           ReviewLogRepository logRepository,
                           WordRepository wordRepository,
                           WordProgressRepository progressRepository,
                           UserRepository userRepository,
                           StatsService statsService) {
        this.xpRepository = xpRepository;
        this.achievementRepository = achievementRepository;
        this.logRepository = logRepository;
        this.wordRepository = wordRepository;
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
        this.statsService = statsService;
    }

    /**
     * Grants the XP an answer earned, plus the daily-goal bonus if this answer completed the goal.
     * Call after the answer has been written to the review log.
     *
     * @return the XP granted by this answer
     */
    @Transactional
    public int awardForAnswer(AppUser owner, Word word, Outcome outcome, AnswerFormat format,
                              int boxBefore, int boxAfter) {
        String username = owner.getUsername();
        Instant startOfToday = LocalDate.now(zone).atStartOfDay(zone).toInstant();

        long earnedToday = xpRepository.countByOwnerUsernameAndWordIdAndSourceAndCreatedAtGreaterThanEqual(
                username, word.getId(), XpSource.ANSWER, startOfToday);
        boolean repeat = earnedToday >= XpRules.FULL_ANSWERS_PER_WORD_PER_DAY;
        int gained = XpRules.answerXp(format, outcome, boxAfter > boxBefore, repeat);
        if (gained > 0) {
            xpRepository.save(new XpEvent(owner, word.getId(), gained, XpSource.ANSWER));
        }

        long doneToday = logRepository.countDistinctWordsAnsweredSince(username, startOfToday);
        if (doneToday >= owner.getDailyGoal()
                && !xpRepository.existsByOwnerUsernameAndSourceAndCreatedAtGreaterThanEqual(
                        username, XpSource.DAILY_GOAL, startOfToday)) {
            xpRepository.save(new XpEvent(owner, null, XpRules.DAILY_GOAL_BONUS, XpSource.DAILY_GOAL));
            gained += XpRules.DAILY_GOAL_BONUS;
        }
        return gained;
    }

    /** The user's XP and achievements; unlocks anything newly earned first, so reading is also the check. */
    @Transactional
    public ProgressResponse progress(String username) {
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        unlockEarned(owner);

        long totalXp = xpRepository.totalXp(username);
        int level = Levels.levelFor(totalXp);
        long levelStart = Levels.thresholdFor(level);
        long levelSpan = Levels.thresholdFor(level + 1) - levelStart;

        LocalDate today = LocalDate.now(zone);
        Instant startOfToday = today.atStartOfDay(zone).toInstant();
        Instant startOfWeek = today.with(DayOfWeek.MONDAY).atStartOfDay(zone).toInstant();

        Map<String, UserAchievement> unlocked = new HashMap<>();
        achievementRepository.findByOwnerUsername(username).forEach(a -> unlocked.put(a.getCode(), a));
        Map<Metric, Integer> metrics = metrics(username, totalXp);

        List<AchievementResponse> achievements = new ArrayList<>();
        for (Achievement a : Achievement.values()) {
            UserAchievement got = unlocked.get(a.name());
            int current = Math.min(metrics.getOrDefault(a.metric(), 0), a.target());
            achievements.add(new AchievementResponse(a.name(), a.title(), a.description(), a.icon(),
                    a.tier().name(), a.xpReward(), got != null ? a.target() : current, a.target(),
                    got != null, got == null ? null : got.getUnlockedAt(), got != null && !got.isSeen()));
        }
        return new ProgressResponse(totalXp, level, Levels.titleFor(level), totalXp - levelStart, levelSpan,
                xpRepository.xpSince(username, startOfToday), xpRepository.xpSince(username, startOfWeek),
                unlocked.size(), Achievement.values().length, achievements);
    }

    /** Marks every unlock as celebrated, so the app shows each one only once. */
    @Transactional
    public void markAllSeen(String username) {
        achievementRepository.findByOwnerUsername(username).stream()
                .filter(a -> !a.isSeen())
                .forEach(UserAchievement::markSeen);
    }

    private void unlockEarned(AppUser owner) {
        String username = owner.getUsername();
        Map<String, UserAchievement> have = new HashMap<>();
        achievementRepository.findByOwnerUsername(username).forEach(a -> have.put(a.getCode(), a));

        // An achievement's XP reward can lift the level and unlock a level achievement, so repeat until stable.
        boolean changed = true;
        while (changed) {
            changed = false;
            Map<Metric, Integer> metrics = metrics(username, xpRepository.totalXp(username));
            for (Achievement a : Achievement.values()) {
                if (!have.containsKey(a.name()) && metrics.getOrDefault(a.metric(), 0) >= a.target()) {
                    have.put(a.name(), achievementRepository.save(new UserAchievement(owner, a.name())));
                    xpRepository.save(new XpEvent(owner, null, a.xpReward(), XpSource.ACHIEVEMENT));
                    changed = true;
                }
            }
        }
    }

    private Map<Metric, Integer> metrics(String username, long totalXp) {
        Map<Metric, Integer> m = new EnumMap<>(Metric.class);
        m.put(Metric.WORDS, (int) wordRepository.countByOwnerUsername(username));
        m.put(Metric.FAVORITES, (int) wordRepository.countByOwnerUsernameAndFavoriteTrue(username));
        m.put(Metric.IMAGES, (int) wordRepository.countByOwnerUsernameAndImageVersionNotNull(username));
        m.put(Metric.LEVEL, Levels.levelFor(totalXp));
        m.put(Metric.GOAL_DAYS, (int) xpRepository.countByOwnerUsernameAndSource(username, XpSource.DAILY_GOAL));
        m.put(Metric.MASTERED, (int) progressRepository.findByOwnerUsername(username).stream()
                .filter(p -> isMastered(p))
                .count());

        long correctTotal = 0;
        for (Object[] row : logRepository.countByFormat(username)) {
            AnswerFormat format = (AnswerFormat) row[0];
            int total = ((Number) row[1]).intValue();
            int correct = ((Number) row[2]).intValue();
            correctTotal += correct;
            switch (format) {
                case LISTENING -> m.put(Metric.LISTENING_CORRECT, correct);
                case CHOICE -> m.put(Metric.CHOICE_CORRECT, correct);
                case MATCHING -> m.put(Metric.MATCHING_CORRECT, correct);
                case SPEED -> m.put(Metric.SPEED_ANSWERS, total);
                case FLASHCARD -> m.put(Metric.FLASHCARD_ANSWERS, total);
                case TYPED -> {
                    // Counted in the total only.
                }
            }
        }
        m.put(Metric.CORRECT_ANSWERS, (int) correctTotal);
        m.put(Metric.STREAK, statsService.summary(username).bestStreak());
        return m;
    }

    private static boolean isMastered(WordProgress p) {
        return ReviewScheduler.stateOf(p.getBox()) == com.example.dictionary.model.WordState.MASTERED;
    }
}
