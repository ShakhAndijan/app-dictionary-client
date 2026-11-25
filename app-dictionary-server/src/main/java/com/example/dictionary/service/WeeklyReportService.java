package com.example.dictionary.service;

import com.example.dictionary.dto.WeeklyReportResponse;
import com.example.dictionary.dto.WeeklyReportResponse.Course;
import com.example.dictionary.dto.WeeklyReportResponse.CourseDay;
import com.example.dictionary.dto.WeeklyReportResponse.CoursePrevious;
import com.example.dictionary.dto.WeeklyReportResponse.Part;
import com.example.dictionary.dto.WeeklyReportResponse.Day;
import com.example.dictionary.dto.WeeklyReportResponse.Totals;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.DevLabDone;
import com.example.dictionary.model.DevLesson;
import com.example.dictionary.model.DevResult;
import com.example.dictionary.model.LearnResult;
import com.example.dictionary.repository.DevLabDoneRepository;
import com.example.dictionary.repository.DevLessonRepository;
import com.example.dictionary.repository.DevResultRepository;
import com.example.dictionary.repository.LearnResultRepository;
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
import java.util.LinkedHashMap;
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
    private final LearnResultRepository learnResults;
    private final DevResultRepository devResults;
    private final DevLabDoneRepository devLabs;
    private final DevLessonRepository devLessons;
    private final ZoneId zone = ZoneId.systemDefault();

    public WeeklyReportService(ReviewLogRepository logRepository, XpEventRepository xpRepository,
                               WordRepository wordRepository, UserRepository userRepository,
                               LearnResultRepository learnResults, DevResultRepository devResults,
                               DevLabDoneRepository devLabs, DevLessonRepository devLessons) {
        this.logRepository = logRepository;
        this.xpRepository = xpRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
        this.learnResults = learnResults;
        this.devResults = devResults;
        this.devLabs = devLabs;
        this.devLessons = devLessons;
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
        return new WeeklyReportResponse(start, start.plusDays(6), back == 0, totals, previous, days, bestDay,
                english(username, start), programming(username, start));
    }

    /** One finished lesson or exam section; {@code lesson} is false for exams. */
    private record Entry(LocalDate date, String part, int answers, int correct, boolean lesson, boolean passed) {
    }

    private Course english(String username, LocalDate start) {
        List<Entry> entries = new ArrayList<>();
        for (LearnResult r : learnResults.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, at(start.minusWeeks(1)))) {
            entries.add(new Entry(dateOf(r.getCreatedAt()), r.getSkill(), r.getTotal(), r.getCorrect(),
                    LearnResult.LESSON.equals(r.getKind()), r.isPassed()));
        }
        return course(start, entries, List.of());
    }

    private Course programming(String username, LocalDate start) {
        Instant from = at(start.minusWeeks(1));
        Map<String, String> modules = new HashMap<>();
        List<Entry> entries = new ArrayList<>();
        for (DevResult r : devResults.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, from)) {
            String module = r.getLessonCode() == null ? "exam" : modules.computeIfAbsent(r.getLessonCode(),
                    code -> devLessons.findByCode(code).map(DevLesson::getModuleKey).orElse("other"));
            entries.add(new Entry(dateOf(r.getCreatedAt()), module, r.getTotal(), r.getCorrect(),
                    DevResult.LESSON.equals(r.getKind()), r.isPassed()));
        }
        List<LocalDate> labs = devLabs.findByOwnerUsername(username).stream()
                .map(DevLabDone::getCreatedAt)
                .filter(t -> !t.isBefore(from))
                .map(this::dateOf)
                .toList();
        return course(start, entries, labs);
    }

    /** Sums the entries of the week from {@code start}; the week before it only feeds {@code previous}. */
    private static Course course(LocalDate start, List<Entry> entries, List<LocalDate> labDates) {
        int[] answers = new int[7];
        int[] correct = new int[7];
        int[] lessons = new int[7];
        int[] labs = new int[7];
        int prevAnswers = 0;
        int prevCorrect = 0;
        int prevLessons = 0;
        int prevLabs = 0;
        int passed = 0;
        // {answers, correct, lessons} per skill or module
        Map<String, int[]> parts = new LinkedHashMap<>();

        for (Entry e : entries) {
            int i = index(start, e.date());
            if (i >= 0 && i < 7) {
                answers[i] += e.answers();
                correct[i] += e.correct();
                int[] part = parts.computeIfAbsent(e.part(), k -> new int[3]);
                part[0] += e.answers();
                part[1] += e.correct();
                if (e.lesson()) {
                    lessons[i]++;
                    part[2]++;
                    if (e.passed()) {
                        passed++;
                    }
                }
            } else if (i >= -7 && i < 0) {
                prevAnswers += e.answers();
                prevCorrect += e.correct();
                if (e.lesson()) {
                    prevLessons++;
                }
            }
        }
        for (LocalDate date : labDates) {
            int i = index(start, date);
            if (i >= 0 && i < 7) {
                labs[i]++;
            } else if (i >= -7 && i < 0) {
                prevLabs++;
            }
        }

        List<CourseDay> days = new ArrayList<>();
        int active = 0;
        int totalAnswers = 0;
        int totalCorrect = 0;
        int totalLessons = 0;
        int totalLabs = 0;
        for (int i = 0; i < 7; i++) {
            days.add(new CourseDay(start.plusDays(i), answers[i], correct[i], lessons[i], labs[i]));
            totalAnswers += answers[i];
            totalCorrect += correct[i];
            totalLessons += lessons[i];
            totalLabs += labs[i];
            if (answers[i] > 0 || labs[i] > 0) {
                active++;
            }
        }
        List<Part> list = parts.entrySet().stream()
                .map(p -> new Part(p.getKey(), p.getValue()[0], p.getValue()[1],
                        accuracy(p.getValue()[1], p.getValue()[0]), p.getValue()[2]))
                .toList();
        return new Course(totalAnswers, totalCorrect, accuracy(totalCorrect, totalAnswers), totalLessons, passed,
                totalLabs, active, new CoursePrevious(prevAnswers, accuracy(prevCorrect, prevAnswers), prevLessons, prevLabs),
                days, list);
    }

    private static double accuracy(int correct, int answers) {
        return answers == 0 ? 0.0 : Math.round(correct * 1000.0 / answers) / 10.0;
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
        return new Totals(answers, correct, accuracy(correct, answers), words, practiced.size(), xp, active, goalDays);
    }
}
