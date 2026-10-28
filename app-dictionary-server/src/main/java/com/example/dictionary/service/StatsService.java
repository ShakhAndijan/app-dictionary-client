package com.example.dictionary.service;

import com.example.dictionary.dto.DailyStatsResponse;
import com.example.dictionary.dto.MonthlyStatsResponse;
import com.example.dictionary.model.QuizSession;
import com.example.dictionary.model.Word;
import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.WordRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Builds the daily/monthly activity stats shown on the Profil tab, with accuracy as a percentage. */
@Service
public class StatsService {

    private static final int MAX_DAYS = 365;
    private static final int MAX_MONTHS = 24;

    private final WordRepository wordRepository;
    private final QuizSessionRepository quizSessionRepository;
    private final ZoneId zone = ZoneId.systemDefault();

    public StatsService(WordRepository wordRepository, QuizSessionRepository quizSessionRepository) {
        this.wordRepository = wordRepository;
        this.quizSessionRepository = quizSessionRepository;
    }

    /** Returns one entry per day, oldest first, covering the last {@code days} days (including today). */
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
            int correct = sessions.stream().mapToInt(QuizSession::getCorrectCount).sum();
            int incorrect = sessions.stream().mapToInt(QuizSession::getIncorrectCount).sum();

            result.add(new DailyStatsResponse(
                    date,
                    wordsByDay.getOrDefault(date, 0L).intValue(),
                    sessions.size(),
                    correct,
                    incorrect,
                    accuracyPercent(correct, incorrect)));
        }
        return result;
    }

    /** Returns one entry per month, oldest first, covering the last {@code months} months (including this one). */
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
            int correct = sessions.stream().mapToInt(QuizSession::getCorrectCount).sum();
            int incorrect = sessions.stream().mapToInt(QuizSession::getIncorrectCount).sum();

            result.add(new MonthlyStatsResponse(
                    month,
                    wordsByMonth.getOrDefault(month, 0L).intValue(),
                    sessions.size(),
                    correct,
                    incorrect,
                    accuracyPercent(correct, incorrect)));
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
