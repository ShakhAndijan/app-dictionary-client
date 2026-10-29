package com.example.dictionary.service;

import com.example.dictionary.dto.DailyStatsResponse;
import com.example.dictionary.dto.FormatStatsResponse;
import com.example.dictionary.dto.MonthlyStatsResponse;
import com.example.dictionary.dto.StatsSummaryResponse;
import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.model.QuizSession;
import com.example.dictionary.model.Word;
import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.ReviewLogRepository;
import com.example.dictionary.repository.WordRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/** Builds the daily/monthly activity stats shown on the Profil tab, with accuracy as a percentage. */
@Service
public class StatsService {

    private static final int MAX_DAYS = 365;
    private static final int MAX_MONTHS = 24;

    private final WordRepository wordRepository;
    private final QuizSessionRepository quizSessionRepository;
    private final ReviewLogRepository reviewLogRepository;
    private final ZoneId zone = ZoneId.systemDefault();

    public StatsService(WordRepository wordRepository, QuizSessionRepository quizSessionRepository,
                        ReviewLogRepository reviewLogRepository) {
        this.reviewLogRepository = reviewLogRepository;
        this.wordRepository = wordRepository;
        this.quizSessionRepository = quizSessionRepository;
    }

    /** Returns one entry per day the user was active (added a word or took a quiz), oldest first, within the last {@code days} days. */
    public List<DailyStatsResponse> dailyStats(String username, int days) {
        int rangeDays = Math.min(Math.max(days, 1), MAX_DAYS);
        LocalDate today = LocalDate.now(zone);
        LocalDate rangeStart = today.minusDays(rangeDays - 1L);
        Instant from = rangeStart.atStartOfDay(zone).toInstant();

        Map<LocalDate, Long> wordsByDay = wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, from)
                .stream()
                .collect(Collectors.groupingBy(w -> toLocalDate(w.getCreatedAt()), Collectors.counting()));

        Map<LocalDate, List<QuizSession>> sessionsByDay = quizSessionRepository
                .findByOwnerUsernameAndStartedAtGreaterThanEqual(username, from)
                .stream()
                .collect(Collectors.groupingBy(s -> toLocalDate(s.getStartedAt())));

        List<DailyStatsResponse> result = new ArrayList<>();
        for (LocalDate date = rangeStart; !date.isAfter(today); date = date.plusDays(1)) {
            List<QuizSession> sessions = sessionsByDay.getOrDefault(date, List.of());
            long words = wordsByDay.getOrDefault(date, 0L);
            if (words == 0 && sessions.isEmpty()) {
                continue; // unused days are not reported
            }
            int correct = sessions.stream().mapToInt(QuizSession::getCorrectCount).sum();
            int incorrect = sessions.stream().mapToInt(QuizSession::getIncorrectCount).sum();

            result.add(new DailyStatsResponse(
                    date,
                    (int) words,
                    sessions.size(),
                    correct,
                    incorrect,
                    accuracyPercent(correct, incorrect)));
        }
        return result;
    }

    /** Returns one entry per month the user was active, oldest first, within the last {@code months} months. */
    public List<MonthlyStatsResponse> monthlyStats(String username, int months) {
        int rangeMonths = Math.min(Math.max(months, 1), MAX_MONTHS);
        YearMonth thisMonth = YearMonth.now(zone);
        YearMonth rangeStart = thisMonth.minusMonths(rangeMonths - 1L);
        Instant from = rangeStart.atDay(1).atStartOfDay(zone).toInstant();

        Map<YearMonth, Long> wordsByMonth = wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, from)
                .stream()
                .collect(Collectors.groupingBy(w -> toYearMonth(w.getCreatedAt()), Collectors.counting()));

        Map<YearMonth, List<QuizSession>> sessionsByMonth = quizSessionRepository
                .findByOwnerUsernameAndStartedAtGreaterThanEqual(username, from)
                .stream()
                .collect(Collectors.groupingBy(s -> toYearMonth(s.getStartedAt())));

        List<MonthlyStatsResponse> result = new ArrayList<>();
        for (YearMonth month = rangeStart; !month.isAfter(thisMonth); month = month.plusMonths(1)) {
            List<QuizSession> sessions = sessionsByMonth.getOrDefault(month, List.of());
            long words = wordsByMonth.getOrDefault(month, 0L);
            if (words == 0 && sessions.isEmpty()) {
                continue;
            }
            int correct = sessions.stream().mapToInt(QuizSession::getCorrectCount).sum();
            int incorrect = sessions.stream().mapToInt(QuizSession::getIncorrectCount).sum();

            result.add(new MonthlyStatsResponse(
                    month,
                    (int) words,
                    sessions.size(),
                    correct,
                    incorrect,
                    accuracyPercent(correct, incorrect)));
        }
        return result;
    }

    /** All-time totals plus the current and best streak of consecutive active days. */
    public StatsSummaryResponse summary(String username) {
        List<Word> words = wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH);
        List<QuizSession> sessions = quizSessionRepository
                .findByOwnerUsernameAndStartedAtGreaterThanEqual(username, Instant.EPOCH);

        Set<LocalDate> activeDays = new TreeSet<>();
        words.forEach(w -> activeDays.add(toLocalDate(w.getCreatedAt())));
        sessions.forEach(s -> activeDays.add(toLocalDate(s.getStartedAt())));

        int correct = sessions.stream().mapToInt(QuizSession::getCorrectCount).sum();
        int incorrect = sessions.stream().mapToInt(QuizSession::getIncorrectCount).sum();

        int best = 0;
        int run = 0;
        LocalDate previous = null;
        for (LocalDate day : activeDays) {
            run = previous != null && previous.plusDays(1).equals(day) ? run + 1 : 1;
            best = Math.max(best, run);
            previous = day;
        }

        LocalDate today = LocalDate.now(zone);
        int current = 0;
        LocalDate cursor = activeDays.contains(today) ? today : today.minusDays(1);
        while (activeDays.contains(cursor)) {
            current++;
            cursor = cursor.minusDays(1);
        }

        return new StatsSummaryResponse(words.size(), sessions.size(), correct, incorrect,
                accuracyPercent(correct, incorrect), activeDays.size(), current, best, formatStats(username));
    }

    /** Typed / multiple-choice / flashcard results side by side; formats never used show zeros. */
    private List<FormatStatsResponse> formatStats(String username) {
        Map<AnswerFormat, long[]> totals = new EnumMap<>(AnswerFormat.class);
        for (Object[] row : reviewLogRepository.countByFormat(username)) {
            totals.put((AnswerFormat) row[0], new long[]{((Number) row[1]).longValue(), ((Number) row[2]).longValue()});
        }
        List<FormatStatsResponse> result = new ArrayList<>();
        for (AnswerFormat format : AnswerFormat.values()) {
            long[] t = totals.getOrDefault(format, new long[]{0, 0});
            result.add(new FormatStatsResponse(format, (int) t[0], (int) t[1],
                    t[0] == 0 ? 0 : Math.round(t[1] * 1000.0 / t[0]) / 10.0));
        }
        return result;
    }

    private LocalDate toLocalDate(Instant instant) {
        return instant.atZone(zone).toLocalDate();
    }

    private YearMonth toYearMonth(Instant instant) {
        return YearMonth.from(instant.atZone(zone));
    }

    /** Correct answers as a percentage of all answers given, rounded to one decimal place; 0 when nothing was answered. */
    private double accuracyPercent(int correct, int incorrect) {
        int total = correct + incorrect;
        if (total == 0) {
            return 0.0;
        }
        return Math.round(correct * 1000.0 / total) / 10.0;
    }
}
