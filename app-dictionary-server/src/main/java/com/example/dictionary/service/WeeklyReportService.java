package com.example.dictionary.service;

import com.example.dictionary.dto.WeeklyReportResponse;
import com.example.dictionary.dto.WeeklyReportResponse.Day;
import com.example.dictionary.dto.WeeklyReportResponse.Totals;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.repository.ReviewLogRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordRepository;
import com.example.dictionary.repository.XpEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** A week of learning (Monday to Sunday) compared with the week before. */
@Service
public class WeeklyReportService {

    static final int MAX_WEEKS_BACK = 104;

    private final ReviewLogRepository logRepository;
    private final XpEventRepository xpRepository;
    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final ZoneId zone = ZoneId.systemDefault();

    public WeeklyReportService(ReviewLogRepository logRepository, XpEventRepository xpRepository,
                               WordRepository wordRepository, UserRepository userRepository) {
        this.logRepository = logRepository;
        this.xpRepository = xpRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
    }

    /** @param weeksBack 0 for the current week, 1 for last week, and so on */
    @Transactional(readOnly = true)
    public WeeklyReportResponse report(String username, int weeksBack) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        int back = Math.min(Math.max(weeksBack, 0), MAX_WEEKS_BACK);

        LocalDate start = LocalDate.now(zone).with(DayOfWeek.MONDAY).minusWeeks(back);
        LocalDate prevStart = start.minusWeeks(1);

        Totals totals = totals(username, start, user.getDailyGoal());
        Totals previous = totals(username, prevStart, user.getDailyGoal());
        List<Day> days = days(username, start);

        LocalDate bestDay = null;
        int bestAnswers = 0;
        for (Day d : days) {
            if (d.answers() > bestAnswers) {
                bestAnswers = d.answers();
                bestDay = d.date();
            }
        }
        return new WeeklyReportResponse(start, start.plusDays(6), back == 0, totals, previous, days, bestDay);
    }

    private Instant at(LocalDate date) {
        return date.atStartOfDay(zone).toInstant();
    }

    private LocalDate dateOf(Object instant) {
        return ((Instant) instant).atZone(zone).toLocalDate();
    }

    private static int index(LocalDate start, LocalDate date) {
        return (int) ChronoUnit.DAYS.between(start, date);
    }

    private List<Day> days(String username, LocalDate start) {
        Instant from = at(start);
        Instant to = at(start.plusDays(7));

        int[] answers = new int[7];
        int[] correct = new int[7];
        int[] words = new int[7];
        int[] xp = new int[7];

        for (Object[] row : logRepository.answersBetween(username, from, to)) {
            int i = index(start, dateOf(row[0]));
            answers[i]++;
            if ((Boolean) row[1]) {
                correct[i]++;
            }
        }
        for (Object[] row : xpRepository.xpEventsBetween(username, from, to)) {
            xp[index(start, dateOf(row[0]))] += ((Number) row[1]).intValue();
        }
        wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, from).stream()
                .filter(w -> w.getCreatedAt().isBefore(to))
                .forEach(w -> words[index(start, dateOf(w.getCreatedAt()))]++);

        List<Day> result = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            result.add(new Day(start.plusDays(i), answers[i], correct[i], words[i], xp[i]));
        }
        return result;
    }

    private Totals totals(String username, LocalDate start, int dailyGoal) {
        Instant from = at(start);
        Instant to = at(start.plusDays(7));

        Set<Object> practiced = new HashSet<>();
        Map<LocalDate, Set<Object>> wordsPerDay = new HashMap<>();
        for (Object[] row : logRepository.answersBetween(username, from, to)) {
            practiced.add(row[2]);
            wordsPerDay.computeIfAbsent(dateOf(row[0]), d -> new HashSet<>()).add(row[2]);
        }

        int answers = 0;
        int correct = 0;
        int words = 0;
        int xp = 0;
        int active = 0;
        for (Day d : days(username, start)) {
            answers += d.answers();
            correct += d.correct();
            words += d.wordsAdded();
            xp += d.xp();
            if (d.answers() > 0 || d.wordsAdded() > 0) {
                active++;
            }
        }
        int goalDays = (int) wordsPerDay.values().stream().filter(s -> s.size() >= dailyGoal).count();
        double accuracy = answers == 0 ? 0.0 : Math.round(correct * 1000.0 / answers) / 10.0;
        return new Totals(answers, correct, accuracy, words, practiced.size(), xp, active, goalDays);
    }
}
