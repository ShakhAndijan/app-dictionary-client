package com.example.dictionary.service;

import com.example.dictionary.dto.DevDtos.*;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.DevLesson;
import com.example.dictionary.model.DevProfile;
import com.example.dictionary.model.DevResult;
import com.example.dictionary.model.DevLabDone;
import com.example.dictionary.repository.DevLabDoneRepository;
import com.example.dictionary.repository.DevLessonRepository;
import com.example.dictionary.repository.DevProfileRepository;
import com.example.dictionary.repository.DevResultRepository;
import com.example.dictionary.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Programming course (frontend roadmap): three levels (junior, middle, senior), lessons grouped in topic modules,
 * a level exam that moves the learner up when the pass mark is reached.
 */
@Service
public class DevService {

    public static final List<String> LEVELS = List.of("JUNIOR", "MIDDLE", "SENIOR");
    public static final int LESSON_PASS_PERCENT = 70;
    public static final int EXAM_QUESTIONS = 20;
    public static final int EXAM_PASS_PERCENT = 70;

    private final DevLessonRepository lessonRepository;
    private final DevProfileRepository profileRepository;
    private final DevResultRepository resultRepository;
    private final UserRepository userRepository;
    private final DevLabDoneRepository labDoneRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public DevService(DevLessonRepository lessonRepository, DevProfileRepository profileRepository,
                      DevResultRepository resultRepository, UserRepository userRepository,
                      DevLabDoneRepository labDoneRepository) {
        this.labDoneRepository = labDoneRepository;
        this.lessonRepository = lessonRepository;
        this.profileRepository = profileRepository;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void setLevel(String username, String level) {
        if (!LEVELS.contains(level)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown level");
        DevProfile profile = profileRepository.findByOwnerUsername(username).orElse(null);
        if (profile == null) {
            profileRepository.save(new DevProfile(user(username), level));
        } else {
            profile.setLevel(level);
        }
    }

    @Transactional(readOnly = true)
    public Overview overview(String username) {
        List<LevelInfo> levels = new ArrayList<>();
        for (String l : LEVELS) {
            int n = lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(l).size();
            levels.add(new LevelInfo(l, n > 0, n));
        }
        String level = profileRepository.findByOwnerUsername(username).map(DevProfile::getLevel).orElse(null);
        if (level == null) {
            return new Overview(null, levels, 0, 0, 0, false, null, LESSON_PASS_PERCENT, EXAM_PASS_PERCENT, List.of(), List.of());
        }
        List<DevResult> results = resultRepository.findByOwnerUsernameAndLevelOrderByCreatedAtDesc(username, level);
        Map<String, Integer> best = bestScores(results);
        List<DevLesson> lessons = lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(level);

        Map<String, Integer> labsDone = new HashMap<>();
        for (DevLabDone d : labDoneRepository.findByOwnerUsername(username)) labsDone.merge(d.getLessonCode(), 1, Integer::sum);
        List<LessonSummary> summaries = new ArrayList<>();
        Map<String, int[]> perModule = new LinkedHashMap<>();
        int passed = 0;
        int unit = 0;
        for (DevLesson l : lessons) {
            Integer b = best.get(l.getCode());
            boolean ok = b != null && b >= LESSON_PASS_PERCENT;
            if (ok) passed++;
            int[] m = perModule.computeIfAbsent(l.getModuleKey(), k -> new int[2]);
            m[0]++;
            if (ok) m[1]++;
            summaries.add(new LessonSummary(l.getCode(), l.getModuleKey(), l.getTitle(), l.getIntro(), ++unit,
                    objective(l).size(), b, ok, labs(l).size(), labsDone.getOrDefault(l.getCode(), 0)));
        }
        List<ModuleInfo> modules = new ArrayList<>();
        perModule.forEach((k, v) -> modules.add(new ModuleInfo(k, v[0], v[1])));
        int total = lessons.size();
        ExamInfo last = results.stream().filter(r -> DevResult.EXAM.equals(r.getKind())).findFirst()
                .map(r -> new ExamInfo(percent(r.getCorrect(), r.getTotal()), r.isPassed(), r.getCreatedAt().toString()))
                .orElse(null);
        return new Overview(level, levels, passed, total, percent(passed, total), total > 0 && passed == total, last,
                LESSON_PASS_PERCENT, EXAM_PASS_PERCENT, modules, summaries);
    }

    @Transactional(readOnly = true)
    public LessonDetail lesson(String username, String code) {
        DevLesson l = lessonByCode(code);
        List<ItemView> items = objective(l).stream().map(DevService::view).toList();
        List<LabView> labs = labs(l).stream().map(b -> new LabView(b.id(), b.title(), b.task(), b.starter(),
                b.tests().stream().map(t -> new LabTestView(t.call(), t.expect(), t.label())).toList(), b.hint(),
                b.kind(), b.setup())).toList();
        List<String> done = labDoneRepository.findByOwnerUsernameAndLessonCode(username, code).stream()
                .map(DevLabDone::getLabId).toList();
        return new LessonDetail(l.getCode(), l.getLevel(), l.getModuleKey(), l.getTitle(), l.getIntro(), l.getTheory(),
                l.getPractice(), items, labs, done);
    }

    /** Marks a lab solved (the browser ran the tests); idempotent. */
    @Transactional
    public LabDoneResponse labDone(String username, String code, String labId) {
        DevLesson l = lessonByCode(code);
        List<DevLab> labs = labs(l);
        if (labs.stream().noneMatch(b -> b.id().equals(labId))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Lab not found");
        }
        if (!labDoneRepository.existsByOwnerUsernameAndLessonCodeAndLabId(username, code, labId)) {
            labDoneRepository.save(new DevLabDone(user(username), code, labId));
        }
        return new LabDoneResponse(labDoneRepository.findByOwnerUsernameAndLessonCode(username, code).size(), labs.size());
    }

    @Transactional(readOnly = true)
    public LabSolution labSolution(String code, String labId) {
        return labs(lessonByCode(code)).stream().filter(b -> b.id().equals(labId)).findFirst()
                .map(b -> new LabSolution(b.solution()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lab not found"));
    }

    @Transactional(readOnly = true)
    public CheckResponse check(String code, String itemId, String answer) {
        LearnItem item = item(lessonByCode(code), itemId);
        return new CheckResponse(item.matches(answer), item.answer(), item.explain());
    }

    @Transactional
    public FinishResponse finish(String username, String code, List<AnswerEntry> answers) {
        DevLesson lesson = lessonByCode(code);
        Map<String, String> given = new HashMap<>();
        for (AnswerEntry a : answers) given.put(a.itemId(), a.answer());
        List<ItemResult> results = new ArrayList<>();
        int correct = 0;
        List<LearnItem> gradable = objective(lesson);
        for (LearnItem item : gradable) {
            boolean ok = item.matches(given.get(item.id()));
            if (ok) correct++;
            results.add(new ItemResult(item.id(), ok, item.answer(), item.explain()));
        }
        int total = gradable.size();
        int score = percent(correct, total);
        boolean passed = score >= LESSON_PASS_PERCENT;
        resultRepository.save(new DevResult(user(username), DevResult.LESSON, lesson.getLevel(), code, correct, total, passed));
        return new FinishResponse(correct, total, score, passed, results);
    }

    @Transactional(readOnly = true)
    public List<ExamQuestion> startExam(String username) {
        String level = requireLevel(username);
        if (!overview(username).examUnlocked()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Finish every lesson of the level first");
        }
        List<ExamQuestion> pool = new ArrayList<>();
        for (DevLesson l : lessonRepository.findByLevelOrderByOrderIndexAscIdAsc(level)) {
            for (LearnItem item : objective(l)) {
                ItemView v = view(item);
                pool.add(new ExamQuestion(l.getCode() + "#" + item.id(), l.getModuleKey(), v.kind(), v.prompt(), v.options(), v.words(), v.passage()));
            }
        }
        Collections.shuffle(pool);
        return new ArrayList<>(pool.subList(0, Math.min(EXAM_QUESTIONS, pool.size())));
    }

    @Transactional
    public ExamResult submitExam(String username, List<ExamAnswer> answers) {
        String level = requireLevel(username);
        Set<String> seen = new HashSet<>();
        List<ExamReview> review = new ArrayList<>();
        int correct = 0;
        for (ExamAnswer a : answers) {
            if (!seen.add(a.ref())) continue;
            int hash = a.ref().indexOf('#');
            if (hash < 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad question reference");
            DevLesson lesson = lessonByCode(a.ref().substring(0, hash));
            if (!level.equals(lesson.getLevel())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question is not from your level");
            }
            LearnItem item = item(lesson, a.ref().substring(hash + 1));
            boolean ok = item.matches(a.answer());
            if (ok) correct++;
            review.add(new ExamReview(a.ref(), ok, item.answer(), item.explain()));
        }
        if (review.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No answers");
        int total = review.size();
        int percent = percent(correct, total);
        boolean passed = percent >= EXAM_PASS_PERCENT;
        resultRepository.save(new DevResult(user(username), DevResult.EXAM, level, null, correct, total, passed));
        String newLevel = null;
        if (passed) {
            int next = LEVELS.indexOf(level) + 1;
            if (next < LEVELS.size()) {
                newLevel = LEVELS.get(next);
                profileRepository.findByOwnerUsername(username).ifPresent(p -> p.setLevel(LEVELS.get(next)));
            }
        }
        return new ExamResult(percent, passed, correct, total, EXAM_PASS_PERCENT, newLevel, review);
    }

    /* ------------------------------------------------------------------ helpers */

    private String requireLevel(String username) {
        return profileRepository.findByOwnerUsername(username).map(DevProfile::getLevel)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Choose a level first"));
    }

    private AppUser user(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private DevLesson lessonByCode(String code) {
        return lessonRepository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lesson not found"));
    }

    private List<LearnItem> items(DevLesson l) {
        try {
            return mapper.readValue(l.getItemsJson(), new TypeReference<List<LearnItem>>() { });
        } catch (Exception e) {
            throw new IllegalStateException("Broken items of lesson " + l.getCode(), e);
        }
    }

    private List<DevLab> labs(DevLesson l) {
        if (l.getLabsJson() == null) return List.of();
        try {
            return mapper.readValue(l.getLabsJson(), new TypeReference<List<DevLab>>() { });
        } catch (Exception e) {
            throw new IllegalStateException("Broken labs of lesson " + l.getCode(), e);
        }
    }

    private List<LearnItem> objective(DevLesson l) {
        return items(l).stream().filter(LearnItem::objective).toList();
    }

    private LearnItem item(DevLesson l, String id) {
        return items(l).stream().filter(i -> i.id().equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    private static ItemView view(LearnItem i) {
        return new ItemView(i.id(), i.kind(), i.prompt(), shuffled(i.options()), shuffled(i.words()), i.passage());
    }

    private static List<String> shuffled(List<String> list) {
        if (list == null) return null;
        List<String> copy = new ArrayList<>(list);
        Collections.shuffle(copy);
        return copy;
    }

    private static Map<String, Integer> bestScores(List<DevResult> results) {
        Map<String, Integer> best = new HashMap<>();
        for (DevResult r : results) {
            if (!DevResult.LESSON.equals(r.getKind()) || r.getLessonCode() == null) continue;
            best.merge(r.getLessonCode(), percent(r.getCorrect(), r.getTotal()), Math::max);
        }
        return best;
    }

    private static int percent(int part, int whole) {
        return whole == 0 ? 0 : Math.round(part * 100f / whole);
    }
}
