package com.example.dictionary.service;

import com.example.dictionary.dto.AdminDtos.Grade;
import com.example.dictionary.dto.DevDtos;
import com.example.dictionary.dto.LearnDtos;
import com.example.dictionary.dto.WeeklyReportResponse;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.DevLesson;
import com.example.dictionary.model.DevResult;
import com.example.dictionary.model.LearnLesson;
import com.example.dictionary.model.LearnResult;
import com.example.dictionary.model.QuizSession;
import com.example.dictionary.repository.DevLessonRepository;
import com.example.dictionary.repository.DevResultRepository;
import com.example.dictionary.repository.LearnLessonRepository;
import com.example.dictionary.repository.LearnResultRepository;
import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** What the admin sees about one learner: the learner's own statistics pages, plus every mark. */
@Service
@Transactional(readOnly = true)
public class AdminUserStatsService {

    private final UserRepository userRepository;
    private final WeeklyReportService weeklyReportService;
    private final LearnService learnService;
    private final DevService devService;
    private final LearnResultRepository learnResults;
    private final LearnLessonRepository learnLessons;
    private final DevResultRepository devResults;
    private final DevLessonRepository devLessons;
    private final QuizSessionRepository quizSessions;

    public AdminUserStatsService(UserRepository userRepository, WeeklyReportService weeklyReportService,
                                 LearnService learnService, DevService devService,
                                 LearnResultRepository learnResults, LearnLessonRepository learnLessons,
                                 DevResultRepository devResults, DevLessonRepository devLessons,
                                 QuizSessionRepository quizSessions) {
        this.userRepository = userRepository;
        this.weeklyReportService = weeklyReportService;
        this.learnService = learnService;
        this.devService = devService;
        this.learnResults = learnResults;
        this.learnLessons = learnLessons;
        this.devResults = devResults;
        this.devLessons = devLessons;
        this.quizSessions = quizSessions;
    }

    public WeeklyReportResponse weekly(Long id, int weeksBack) {
        return weeklyReportService.report(username(id), weeksBack);
    }

    public LearnDtos.StatsResponse english(Long id) {
        return learnService.stats(username(id));
    }

    public DevDtos.Overview programming(Long id) {
        return devService.overview(username(id));
    }

    /** Every mark of the learner, newest first: course lessons, level exams and word quizzes. */
    public List<Grade> grades(Long id) {
        String username = username(id);
        List<Grade> grades = new ArrayList<>();

        Map<String, String> titles = new HashMap<>();
        for (LearnResult r : learnResults.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH)) {
            String title = r.getLessonCode() == null ? null : titles.computeIfAbsent(r.getLessonCode(),
                    code -> learnLessons.findByCode(code).map(LearnLesson::getTitle).orElse(code));
            grades.add(grade(r.getCreatedAt(), "ENGLISH", r.getKind(), r.getLevel(), r.getSkill(), title,
                    r.getCorrect(), r.getTotal(), r.isPassed()));
        }

        Map<String, DevLesson> lessons = new HashMap<>();
        for (DevResult r : devResults.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH)) {
            DevLesson lesson = r.getLessonCode() == null ? null
                    : lessons.computeIfAbsent(r.getLessonCode(), code -> devLessons.findByCode(code).orElse(null));
            grades.add(grade(r.getCreatedAt(), "DEV", r.getKind(), r.getLevel(),
                    lesson == null ? null : lesson.getModuleKey(),
                    lesson == null ? r.getLessonCode() : lesson.getTitle(),
                    r.getCorrect(), r.getTotal(), r.isPassed()));
        }

        for (QuizSession q : quizSessions.findByOwnerUsernameAndStartedAtGreaterThanEqual(username, Instant.EPOCH)) {
            if (q.getAnsweredCount() == 0) continue;
            boolean passed = LearnService.percent(q.getCorrectCount(), q.getAnsweredCount()) >= LearnService.LESSON_PASS_PERCENT;
            grades.add(grade(q.getStartedAt(), "WORDS", "QUIZ", null, q.getAnswerFormat().name(), null,
                    q.getCorrectCount(), q.getAnsweredCount(), passed));
        }

        grades.sort(Comparator.comparing(Grade::at).reversed());
        return grades;
    }

    private static Grade grade(Instant at, String area, String kind, String level, String part, String title,
                               int correct, int total, boolean passed) {
        return new Grade(at, area, kind, level, part, title, correct, total,
                total == 0 ? 0 : LearnService.percent(correct, total), passed);
    }

    private String username(Long id) {
        return userRepository.findById(id).map(AppUser::getUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
