package com.example.dictionary.service;

import com.example.dictionary.dto.ActivityDtos;
import com.example.dictionary.dto.DevDtos;
import com.example.dictionary.dto.LearnDtos;
import com.example.dictionary.dto.ReviewSummaryResponse;
import com.example.dictionary.model.DevLabDone;
import com.example.dictionary.model.DevLesson;
import com.example.dictionary.model.DevResult;
import com.example.dictionary.model.LearnLesson;
import com.example.dictionary.model.LearnResult;
import com.example.dictionary.model.SentenceLog;
import com.example.dictionary.model.Word;
import com.example.dictionary.repository.DevLabDoneRepository;
import com.example.dictionary.repository.DevLessonRepository;
import com.example.dictionary.repository.DevResultRepository;
import com.example.dictionary.repository.LearnLessonRepository;
import com.example.dictionary.repository.LearnResultRepository;
import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.ReviewLogRepository;
import com.example.dictionary.repository.SentenceLogRepository;
import com.example.dictionary.repository.WordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Brings the three study areas together: what one learner did in words, English and programming, per day and
 * overall. The home page and the admin's user page both read it.
 */
@Service
@Transactional(readOnly = true)
public class ActivityService {

    private static final int MIN_DAYS = 7;
    private static final int MAX_DAYS = 90;
    private static final int RECENT_EVENTS = 20;

    private final ReviewLogRepository reviewLogRepository;
    private final WordRepository wordRepository;
    private final QuizSessionRepository quizSessionRepository;
    private final SentenceLogRepository sentenceLogRepository;
    private final LearnResultRepository learnResultRepository;
    private final LearnLessonRepository learnLessonRepository;
    private final DevResultRepository devResultRepository;
    private final DevLessonRepository devLessonRepository;
    private final DevLabDoneRepository devLabDoneRepository;
    private final ReviewService reviewService;
    private final LearnService learnService;
    private final DevService devService;
    private final ZoneId zone = ZoneId.systemDefault();

    public ActivityService(ReviewLogRepository reviewLogRepository, WordRepository wordRepository,
                           QuizSessionRepository quizSessionRepository, SentenceLogRepository sentenceLogRepository,
                           LearnResultRepository learnResultRepository, LearnLessonRepository learnLessonRepository,
                           DevResultRepository devResultRepository, DevLessonRepository devLessonRepository,
                           DevLabDoneRepository devLabDoneRepository, ReviewService reviewService,
                           LearnService learnService, DevService devService) {
        this.reviewLogRepository = reviewLogRepository;
        this.wordRepository = wordRepository;
        this.quizSessionRepository = quizSessionRepository;
        this.sentenceLogRepository = sentenceLogRepository;
        this.learnResultRepository = learnResultRepository;
        this.learnLessonRepository = learnLessonRepository;
        this.devResultRepository = devResultRepository;
        this.devLessonRepository = devLessonRepository;
        this.devLabDoneRepository = devLabDoneRepository;
        this.reviewService = reviewService;
        this.learnService = learnService;
        this.devService = devService;
    }

    /** Running totals of one area while its history is read. */
    private static final class Tally {
        long answered;
        long correct;
        long periodAnswered;
        long periodCorrect;
        long previousAnswered;
        Instant lastAt;
        final Set<LocalDate> days = new TreeSet<>();
        final Map<LocalDate, Integer> perDay = new HashMap<>();
    }

    private final class Period {
        final LocalDate today = LocalDate.now(zone);
        final LocalDate from;
        final LocalDate previousFrom;
        final int[] hours = new int[24];

        Period(int days) {
            from = today.minusDays(days - 1L);
            previousFrom = from.minusDays(days);
        }

        /** Books {@code answers} (of which {@code correct}) made at {@code at}; {@code weight} goes into the chart. */
        void add(Tally t, Instant at, int answers, int correct, int weight) {
            LocalDate day = at.atZone(zone).toLocalDate();
            t.answered += answers;
            t.correct += correct;
            t.days.add(day);
            t.perDay.merge(day, weight, Integer::sum);
            if (t.lastAt == null || at.isAfter(t.lastAt)) t.lastAt = at;
            if (!day.isBefore(from)) {
                t.periodAnswered += answers;
                t.periodCorrect += correct;
                hours[at.atZone(zone).getHour()] += weight;
            } else if (!day.isBefore(previousFrom)) {
                t.previousAnswered += answers;
            }
        }
    }

    public ActivityDtos.Report report(String username, int requestedDays) {
        int days = Math.max(MIN_DAYS, Math.min(MAX_DAYS, requestedDays));
        Period period = new Period(days);
        Instant periodStart = period.from.atStartOfDay(zone).toInstant();

        Tally words = new Tally();
        Instant tomorrow = Instant.now().plus(1, ChronoUnit.DAYS);
        for (Object[] row : reviewLogRepository.answersBetween(username, Instant.EPOCH, tomorrow)) {
            period.add(words, (Instant) row[0], 1, (Boolean) row[1] ? 1 : 0, 1);
        }
        // Days spent only adding words count as active too.
        List<Word> owned = wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH);
        int added = 0;
        for (Word w : owned) {
            words.days.add(w.getCreatedAt().atZone(zone).toLocalDate());
            if (!w.getCreatedAt().isBefore(periodStart)) added++;
        }

        List<ActivityDtos.Event> events = new ArrayList<>();

        Tally english = new Tally();
        List<LearnResult> learnResults =
                learnResultRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH);
        Map<String, String> learnTitles = new HashMap<>();
        // An exam is stored as one row per skill, saved together: merge them back into one attempt.
        Map<Long, int[]> learnExams = new HashMap<>();
        Map<Long, LearnResult> learnExamRows = new HashMap<>();
        for (LearnResult r : learnResults) {
            period.add(english, r.getCreatedAt(), r.getTotal(), r.getCorrect(), r.getTotal());
            if (LearnResult.EXAM.equals(r.getKind())) {
                long key = r.getCreatedAt().getEpochSecond() / 5;
                int[] sum = learnExams.computeIfAbsent(key, k -> new int[2]);
                sum[0] += r.getCorrect();
                sum[1] += r.getTotal();
                learnExamRows.put(key, r);
            } else {
                String title = learnTitles.computeIfAbsent(r.getLessonCode(), code ->
                        learnLessonRepository.findByCode(code).map(LearnLesson::getTitle).orElse(code));
                events.add(new ActivityDtos.Event(r.getCreatedAt(), "ENGLISH", "LESSON", title,
                        LearnService.percent(r.getCorrect(), r.getTotal()), r.isPassed()));
            }
        }
        int englishExamsPassed = 0;
        for (Map.Entry<Long, int[]> e : learnExams.entrySet()) {
            LearnResult r = learnExamRows.get(e.getKey());
            if (r.isPassed()) englishExamsPassed++;
            events.add(new ActivityDtos.Event(r.getCreatedAt(), "ENGLISH", "EXAM", r.getLevel(),
                    LearnService.percent(e.getValue()[0], e.getValue()[1]), r.isPassed()));
        }
        List<SentenceLog> sentences =
                sentenceLogRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH);
        long scoreSum = 0;
        for (SentenceLog s : sentences) {
            scoreSum += s.getScore();
            // A written sentence is practice, not a right/wrong answer, so it only marks the day.
            period.add(english, s.getCreatedAt(), 0, 0, 1);
        }

        Tally dev = new Tally();
        Map<String, String> devTitles = new HashMap<>();
        int devExams = 0;
        int devExamsPassed = 0;
        List<DevResult> devResults =
                devResultRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, Instant.EPOCH);
        for (DevResult r : devResults) {
            period.add(dev, r.getCreatedAt(), r.getTotal(), r.getCorrect(), r.getTotal());
            boolean exam = DevResult.EXAM.equals(r.getKind());
            if (exam) {
                devExams++;
                if (r.isPassed()) devExamsPassed++;
            }
            String title = exam ? r.getLevel() : devTitle(devTitles, r.getLessonCode());
            events.add(new ActivityDtos.Event(r.getCreatedAt(), "DEV", r.getKind(), title,
                    LearnService.percent(r.getCorrect(), r.getTotal()), r.isPassed()));
        }
        List<DevLabDone> labs = devLabDoneRepository.findByOwnerUsername(username);
        for (DevLabDone lab : labs) {
            period.add(dev, lab.getCreatedAt(), 0, 0, 1);
            events.add(new ActivityDtos.Event(lab.getCreatedAt(), "DEV", "LAB",
                    devTitle(devTitles, lab.getLessonCode()), null, true));
        }

        List<ActivityDtos.Day> series = new ArrayList<>();
        for (LocalDate d = period.from; !d.isAfter(period.today); d = d.plusDays(1)) {
            series.add(new ActivityDtos.Day(d, words.perDay.getOrDefault(d, 0), english.perDay.getOrDefault(d, 0),
                    dev.perDay.getOrDefault(d, 0)));
        }

        events.sort(Comparator.comparing(ActivityDtos.Event::at).reversed());

        TreeSet<LocalDate> all = new TreeSet<>(words.days);
        all.addAll(english.days);
        all.addAll(dev.days);

        ReviewSummaryResponse review = reviewService.summary(username);
        ActivityDtos.Words wordsPart = new ActivityDtos.Words(area(words), review.totalWords(), review.newCount(),
                review.learningCount(), review.masteredCount(), review.dueCount(),
                quizSessionRepository.findByOwnerUsernameAndStartedAtGreaterThanEqual(username, Instant.EPOCH).size(),
                added);

        return new ActivityDtos.Report(days, wordsPart,
                englishPart(username, english, learnExams.size(), englishExamsPassed, sentences.size(),
                        sentences.isEmpty() ? 0 : (int) Math.round((double) scoreSum / sentences.size())),
                devPart(username, dev, devExams, devExamsPassed, labs.size()),
                series, period.hours,
                events.size() > RECENT_EVENTS ? List.copyOf(events.subList(0, RECENT_EVENTS)) : events,
                currentStreak(all, period.today), bestStreak(all), all.size());
    }

    private String devTitle(Map<String, String> cache, String code) {
        return cache.computeIfAbsent(code, c -> devLessonRepository.findByCode(c).map(DevLesson::getTitle).orElse(c));
    }

    private ActivityDtos.English englishPart(String username, Tally tally, int exams, int examsPassed,
                                             int sentences, int sentenceScore) {
        LearnDtos.StatsResponse stats = learnService.stats(username);
        List<ActivityDtos.Skill> skills = stats.skills().stream()
                .filter(s -> s.lessonsTotal() > 0)
                .map(s -> new ActivityDtos.Skill(s.skill(), s.lessonsPassed(), s.lessonsTotal(), s.percent()))
                .toList();
        return new ActivityDtos.English(area(tally), stats.level(),
                skills.stream().mapToInt(ActivityDtos.Skill::lessonsPassed).sum(),
                skills.stream().mapToInt(ActivityDtos.Skill::lessonsTotal).sum(),
                exams, examsPassed, sentences, sentenceScore, skills);
    }

    private ActivityDtos.Dev devPart(String username, Tally tally, int exams, int examsPassed, int labsDone) {
        DevDtos.Overview o = devService.overview(username);
        List<ActivityDtos.Module> modules = o.modules().stream()
                .map(m -> new ActivityDtos.Module(m.key(), m.passed(), m.lessons()))
                .toList();
        return new ActivityDtos.Dev(area(tally), o.level(), o.passed(), o.total(), exams, examsPassed, labsDone,
                o.lessons().stream().mapToInt(DevDtos.LessonSummary::labCount).sum(), modules);
    }

    private static ActivityDtos.Area area(Tally t) {
        return new ActivityDtos.Area(t.answered, t.correct,
                t.answered == 0 ? 0 : (int) Math.round(t.correct * 100.0 / t.answered),
                t.periodAnswered, t.periodCorrect, t.previousAnswered, t.days.size(), t.lastAt);
    }

    private static int currentStreak(Set<LocalDate> days, LocalDate today) {
        int streak = 0;
        for (LocalDate d = days.contains(today) ? today : today.minusDays(1); days.contains(d); d = d.minusDays(1)) {
            streak++;
        }
        return streak;
    }

    private static int bestStreak(TreeSet<LocalDate> days) {
        int best = 0;
        int run = 0;
        LocalDate previous = null;
        for (LocalDate day : days) {
            run = previous != null && previous.plusDays(1).equals(day) ? run + 1 : 1;
            best = Math.max(best, run);
            previous = day;
        }
        return best;
    }
}
