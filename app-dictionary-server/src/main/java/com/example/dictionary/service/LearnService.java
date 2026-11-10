package com.example.dictionary.service;

import com.example.dictionary.dto.LearnDtos.*;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.LearnLesson;
import com.example.dictionary.model.LearnProfile;
import com.example.dictionary.model.LearnResult;
import com.example.dictionary.model.XpEvent;
import com.example.dictionary.model.XpSource;
import com.example.dictionary.repository.LearnLessonRepository;
import com.example.dictionary.repository.LearnProfileRepository;
import com.example.dictionary.repository.LearnResultRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.XpEventRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The level-based course: pick a CEFR level, finish lessons in five skills (daily goals), pass the level
 * exam to move up, and see which skill is the weakest.
 */
@Service
public class LearnService {

    public static final List<String> LEVELS = List.of("A1", "A2", "B1", "B2", "C1");
    public static final List<String> SKILLS = List.of("READING", "LISTENING", "SPEAKING", "WRITING", "GRAMMAR");

    /** A lesson counts as passed from this percentage. */
    public static final int LESSON_PASS_PERCENT = 70;
    /** Level exam: questions per skill, the overall pass mark and the minimum for each skill. */
    public static final int EXAM_QUESTIONS_PER_SKILL = 6;
    public static final int EXAM_PASS_PERCENT = 70;
    public static final int EXAM_SKILL_MIN_PERCENT = 50;
    public static final int EXAM_XP = 50;

    /** Lessons per skill to finish each day (never more than the lessons that exist at the level). */
    static final Map<String, Integer> DAILY_TARGET = Map.of(
            "READING", 1, "LISTENING", 1, "SPEAKING", 1, "WRITING", 1, "GRAMMAR", 3);

    private final LearnLessonRepository lessonRepository;
    private final LearnProfileRepository profileRepository;
    private final LearnResultRepository resultRepository;
    private final UserRepository userRepository;
    private final XpEventRepository xpRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private final ZoneId zone = ZoneId.systemDefault();

    public LearnService(LearnLessonRepository lessonRepository, LearnProfileRepository profileRepository,
                        LearnResultRepository resultRepository, UserRepository userRepository,
                        XpEventRepository xpRepository) {
        this.lessonRepository = lessonRepository;
        this.profileRepository = profileRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
        this.xpRepository = xpRepository;
    }

    /* ------------------------------------------------------------------ level */

    @Transactional
    public void setLevel(String username, String level) {
        if (!LEVELS.contains(level)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown level");
        }
        LearnProfile profile = profileRepository.findByOwnerUsername(username).orElse(null);
        if (profile == null) {
            profileRepository.save(new LearnProfile(user(username), level));
        } else {
            profile.setLevel(level);
        }
    }

    /* ------------------------------------------------------------------ overview */

    @Transactional(readOnly = true)
    public Overview overview(String username) {
        String level = levelOf(username);
        if (level == null) {
            return new Overview(null, LEVELS, new LevelProgress(0, 0, 0), false, null, List.of(), false, List.of());
        }
        List<LearnLesson> lessons = lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(level);
        List<LearnResult> results = resultRepository.findByOwnerUsernameAndLevelOrderByCreatedAtDesc(username, level);
        Map<String, Integer> best = bestScores(results);
        Set<String> passedToday = passedLessonsSince(results, startOfToday());

        int passed = 0;
        Map<String, List<LearnLesson>> bySkill = new LinkedHashMap<>();
        for (String skill : SKILLS) bySkill.put(skill, new ArrayList<>());
        for (LearnLesson l : lessons) {
            bySkill.get(l.getSkill()).add(l);
            if (isPassed(best.get(l.getCode()))) passed++;
        }

        List<Goal> goals = new ArrayList<>();
        List<SkillProgress> skills = new ArrayList<>();
        for (String skill : SKILLS) {
            List<LearnLesson> list = bySkill.get(skill);
            if (list.isEmpty()) continue;
            int lessonsPassed = (int) list.stream().filter(l -> isPassed(best.get(l.getCode()))).count();
            skills.add(new SkillProgress(skill, list.size(), lessonsPassed));

            int done = (int) list.stream().filter(l -> passedToday.contains(l.getCode())).count();
            // Never ask for more than what is left to learn (plus what was finished today).
            int left = (int) list.stream().filter(l -> !isPassed(best.get(l.getCode()))).count();
            int target = Math.min(DAILY_TARGET.getOrDefault(skill, 1), left + done);
            List<LessonSummary> suggested = list.stream()
                    .filter(l -> !isPassed(best.get(l.getCode())))
                    .limit(Math.max(0, target - done))
                    .map(l -> summary(l, best.get(l.getCode())))
                    .toList();
            goals.add(new Goal(skill, target, Math.min(done, target), suggested));
        }
        boolean goalsDone = !goals.isEmpty() && goals.stream().allMatch(g -> g.done() >= g.target());
        int total = lessons.size();
        boolean unlocked = total > 0 && passed == total;

        ExamInfo lastExam = results.stream()
                .filter(r -> LearnResult.EXAM.equals(r.getKind()))
                .findFirst()
                .map(first -> examInfo(results, first.getCreatedAt()))
                .orElse(null);

        return new Overview(level, LEVELS, new LevelProgress(passed, total, percent(passed, total)), unlocked,
                lastExam, goals, goalsDone, skills);
    }

    /* ------------------------------------------------------------------ lessons */

    @Transactional(readOnly = true)
    public List<LessonSummary> lessons(String username, String skill) {
        String level = levelOf(username);
        if (level == null) return List.of();
        Map<String, Integer> best = bestScores(resultRepository.findByOwnerUsernameAndLevelOrderByCreatedAtDesc(username, level));
        return lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(level).stream()
                .filter(l -> skill == null || skill.equals(l.getSkill()))
                .map(l -> summary(l, best.get(l.getCode())))
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonDetail lesson(String code) {
        LearnLesson l = lessonByCode(code);
        List<ItemView> items = new ArrayList<>();
        for (LearnItem item : items(l)) {
            if (item.objective()) items.add(view(item));
        }
        return new LessonDetail(l.getCode(), l.getLevel(), l.getSkill(), l.getTopic(), l.getTitle(), l.getIntro(),
                l.getPassage(), l.getAudioText(), items);
    }

    /** Feedback for one answer while the learner works through a lesson. Nothing is stored. */
    @Transactional(readOnly = true)
    public CheckResponse check(String code, String itemId, String answer) {
        LearnItem item = item(lessonByCode(code), itemId);
        return new CheckResponse(item.matches(answer), item.answer(), item.explain());
    }

    @Transactional
    public FinishResponse finish(String username, String code, List<AnswerEntry> answers) {
        LearnLesson lesson = lessonByCode(code);
        Map<String, String> given = new HashMap<>();
        for (AnswerEntry a : answers) given.put(a.itemId(), a.answer());

        List<ItemResult> results = new ArrayList<>();
        int correct = 0;
        List<LearnItem> gradable = items(lesson).stream().filter(LearnItem::objective).toList();
        for (LearnItem item : gradable) {
            boolean ok = item.matches(given.get(item.id()));
            if (ok) correct++;
            results.add(new ItemResult(item.id(), ok, item.answer(), item.explain()));
        }
        int total = gradable.size();
        int score = percent(correct, total);
        boolean passed = isPassed(score);

        AppUser user = user(username);
        boolean firstPassToday = passed
                && !passedLessonsSince(resultRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, startOfToday()),
                startOfToday()).contains(code);
        resultRepository.save(new LearnResult(user, LearnResult.LESSON, lesson.getLevel(), lesson.getSkill(), code,
                correct, total, passed));
        int xp = firstPassToday ? 10 + correct : 0;
        if (xp > 0) xpRepository.save(new XpEvent(user, null, xp, XpSource.ANSWER));
        return new FinishResponse(correct, total, score, passed, xp, results);
    }

    /* ------------------------------------------------------------------ exam */

    @Transactional(readOnly = true)
    public List<ExamQuestion> startExam(String username) {
        String level = requireLevel(username);
        Overview overview = overview(username);
        if (!overview.examUnlocked()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Finish every lesson of the level first");
        }
        List<ExamQuestion> questions = new ArrayList<>();
        for (String skill : SKILLS) {
            List<ExamQuestion> pool = new ArrayList<>();
            for (LearnLesson l : lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(level)) {
                if (!skill.equals(l.getSkill())) continue;
                for (LearnItem item : items(l)) {
                    if (item.objective()) {
                        ItemView v = view(item);
                        pool.add(new ExamQuestion(l.getCode() + "#" + item.id(), skill, v.kind(), v.prompt(),
                                v.options(), v.words(), v.passage() != null ? v.passage() : l.getPassage(),
                                v.audioText() != null ? v.audioText() : l.getAudioText()));
                    }
                }
            }
            Collections.shuffle(pool);
            questions.addAll(pool.subList(0, Math.min(EXAM_QUESTIONS_PER_SKILL, pool.size())));
        }
        return questions;
    }

    @Transactional
    public ExamResult submitExam(String username, List<ExamAnswer> answers) {
        String level = requireLevel(username);
        Map<String, int[]> perSkill = new LinkedHashMap<>();
        Set<String> seen = new HashSet<>();
        for (ExamAnswer a : answers) {
            if (!seen.add(a.ref())) continue;
            int hash = a.ref().indexOf('#');
            if (hash < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad question reference");
            LearnLesson lesson = lessonByCode(a.ref().substring(0, hash));
            if (!level.equals(lesson.getLevel())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question is not from your level");
            }
            LearnItem item = item(lesson, a.ref().substring(hash + 1));
            int[] counts = perSkill.computeIfAbsent(lesson.getSkill(), k -> new int[2]);
            counts[1]++;
            if (item.matches(a.answer())) counts[0]++;
        }
        if (perSkill.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No answers");

        int correct = perSkill.values().stream().mapToInt(c -> c[0]).sum();
        int total = perSkill.values().stream().mapToInt(c -> c[1]).sum();
        int percent = percent(correct, total);
        boolean passed = percent >= EXAM_PASS_PERCENT
                && perSkill.values().stream().allMatch(c -> percent(c[0], c[1]) >= EXAM_SKILL_MIN_PERCENT);

        AppUser user = user(username);
        List<SkillScore> scores = new ArrayList<>();
        for (Map.Entry<String, int[]> e : perSkill.entrySet()) {
            int[] c = e.getValue();
            scores.add(new SkillScore(e.getKey(), c[0], c[1], percent(c[0], c[1])));
            resultRepository.save(new LearnResult(user, LearnResult.EXAM, level, e.getKey(), null, c[0], c[1], passed));
        }

        String newLevel = null;
        int xp = 0;
        if (passed) {
            xp = EXAM_XP;
            xpRepository.save(new XpEvent(user, null, xp, XpSource.ANSWER));
            int next = LEVELS.indexOf(level) + 1;
            if (next < LEVELS.size()) {
                newLevel = LEVELS.get(next);
                profileRepository.findByOwnerUsername(username).ifPresent(p -> p.setLevel(LEVELS.get(next)));
            }
        }
        return new ExamResult(percent, passed, scores, newLevel, xp);
    }

    /* ------------------------------------------------------------------ statistics */

    @Transactional(readOnly = true)
    public StatsResponse stats(String username) {
        String level = levelOf(username);
        if (level == null) return new StatsResponse(null, List.of(), null, 0, 0, 0, 0, LESSON_PASS_PERCENT);
        List<LearnLesson> lessons = lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(level);
        List<LearnResult> results = resultRepository.findByOwnerUsernameAndLevelOrderByCreatedAtDesc(username, level);
        Map<String, Integer> best = bestScores(results);

        List<SkillStat> stats = new ArrayList<>();
        for (String skill : SKILLS) {
            List<LearnLesson> list = lessons.stream().filter(l -> skill.equals(l.getSkill())).toList();
            int lessonsPassed = (int) list.stream().filter(l -> isPassed(best.get(l.getCode()))).count();

            int c = 0, t = 0;
            for (LearnResult r : results) {
                if (LearnResult.LESSON.equals(r.getKind()) && skill.equals(r.getSkill())) {
                    c += r.getCorrect();
                    t += r.getTotal();
                }
            }
            Integer lessonPercent = t > 0 ? percent(c, t) : null;
            // Results are newest first, so the first exam section of this skill is the latest one.
            Integer examPercent = results.stream()
                    .filter(r -> LearnResult.EXAM.equals(r.getKind()) && skill.equals(r.getSkill()))
                    .findFirst().map(r -> percent(r.getCorrect(), r.getTotal())).orElse(null);
            List<LearnResult> mine = results.stream()
                    .filter(r -> LearnResult.LESSON.equals(r.getKind()) && skill.equals(r.getSkill())).toList();
            Map<String, String> titles = new HashMap<>();
            for (LearnLesson l : list) titles.put(l.getCode(), l.getTitle());
            List<RecentResult> recent = mine.stream().limit(5)
                    .map(r -> new RecentResult(r.getLessonCode(), titles.getOrDefault(r.getLessonCode(), r.getLessonCode()),
                            percent(r.getCorrect(), r.getTotal()), r.isPassed(), r.getCreatedAt().toString()))
                    .toList();
            List<WeakLesson> weak = list.stream()
                    .filter(l -> best.get(l.getCode()) != null && !isPassed(best.get(l.getCode())))
                    .sorted(Comparator.comparingInt(l -> best.get(l.getCode())))
                    .limit(3).map(l -> new WeakLesson(l.getCode(), l.getTitle(), best.get(l.getCode()))).toList();
            String lastAt = mine.isEmpty() ? null : mine.get(0).getCreatedAt().toString();
            stats.add(new SkillStat(skill, list.size(), lessonsPassed, lessonPercent, examPercent,
                    combine(lessonPercent, examPercent), mine.size(), t, c, lastAt, recent, weak));
        }
        String weakest = stats.stream()
                .filter(s -> s.percent() != null)
                .min(Comparator.comparingInt(SkillStat::percent))
                .map(SkillStat::skill).orElse(null);
        int answered = 0, correct = 0;
        Set<LocalDate> days = new HashSet<>();
        Map<String, Integer> examCount = new HashMap<>();
        for (LearnResult r : results) {
            days.add(r.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate());
            if (LearnResult.LESSON.equals(r.getKind())) {
                answered += r.getTotal();
                correct += r.getCorrect();
            } else {
                examCount.merge(r.getSkill(), 1, Integer::sum);
            }
        }
        int exams = examCount.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        return new StatsResponse(level, stats, weakest, answered, correct, days.size(), exams, LESSON_PASS_PERCENT);
    }

    /* ------------------------------------------------------------------ helpers */

    static Integer combine(Integer a, Integer b) {
        if (a == null) return b;
        if (b == null) return a;
        return Math.round((a + b) / 2f);
    }

    static int percent(int correct, int total) {
        return total <= 0 ? 0 : Math.round(correct * 100f / total);
    }

    static boolean isPassed(Integer score) {
        return score != null && score >= LESSON_PASS_PERCENT;
    }

    private Instant startOfToday() {
        return LocalDate.now(zone).atStartOfDay(zone).toInstant();
    }

    /** Best lesson percentage per lesson code. */
    private static Map<String, Integer> bestScores(List<LearnResult> results) {
        Map<String, Integer> best = new HashMap<>();
        for (LearnResult r : results) {
            if (!LearnResult.LESSON.equals(r.getKind()) || r.getLessonCode() == null) continue;
            best.merge(r.getLessonCode(), percent(r.getCorrect(), r.getTotal()), Math::max);
        }
        return best;
    }

    private static Set<String> passedLessonsSince(List<LearnResult> results, Instant from) {
        Set<String> codes = new HashSet<>();
        for (LearnResult r : results) {
            if (LearnResult.LESSON.equals(r.getKind()) && r.isPassed() && !r.getCreatedAt().isBefore(from)) {
                codes.add(r.getLessonCode());
            }
        }
        return codes;
    }

    /** Percentage of one exam attempt: all sections saved at (about) the same moment. */
    private static ExamInfo examInfo(List<LearnResult> results, Instant latest) {
        int c = 0, t = 0;
        boolean passed = false;
        for (LearnResult r : results) {
            if (LearnResult.EXAM.equals(r.getKind()) && java.time.Duration.between(r.getCreatedAt(), latest).abs().getSeconds() < 5) {
                c += r.getCorrect();
                t += r.getTotal();
                passed = r.isPassed();
            }
        }
        return new ExamInfo(percent(c, t), passed, latest);
    }

    private LessonSummary summary(LearnLesson l, Integer best) {
        int count = (int) items(l).stream().filter(LearnItem::objective).count();
        return new LessonSummary(l.getCode(), l.getSkill(), l.getTopic(), l.getTitle(), l.getOrderIndex(), count, best, isPassed(best));
    }

    private ItemView view(LearnItem item) {
        List<String> options = item.options() == null ? null : new ArrayList<>(item.options());
        List<String> words = item.words() == null ? null : new ArrayList<>(item.words());
        if (options != null) Collections.shuffle(options);
        if (words != null) Collections.shuffle(words);
        return new ItemView(item.id(), item.kind(), item.prompt(), options, words, item.passage(), item.audio());
    }

    List<LearnItem> items(LearnLesson lesson) {
        try {
            return mapper.readValue(lesson.getItemsJson(), new TypeReference<List<LearnItem>>() { });
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lesson content is broken");
        }
    }

    private LearnItem item(LearnLesson lesson, String itemId) {
        return items(lesson).stream()
                .filter(i -> i.id().equals(itemId) && i.objective())
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    private LearnLesson lessonByCode(String code) {
        return lessonRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
    }

    private String levelOf(String username) {
        return profileRepository.findByOwnerUsername(username).map(LearnProfile::getLevel).orElse(null);
    }

    private String requireLevel(String username) {
        String level = levelOf(username);
        if (level == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "Pick a level first");
        return level;
    }

    private AppUser user(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
