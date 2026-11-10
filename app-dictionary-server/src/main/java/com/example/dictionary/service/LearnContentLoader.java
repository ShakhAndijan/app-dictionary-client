package com.example.dictionary.service;

import com.example.dictionary.model.LearnLesson;
import com.example.dictionary.repository.LearnLessonRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Loads the course content from {@code classpath:learn/*.json} into the database on every startup.
 * A lesson is matched by its {@code code}: existing lessons are updated, new ones inserted, so editing
 * a JSON file and restarting the server is all it takes to change the course. Invalid lessons are skipped
 * with a warning instead of stopping the server.
 */
@Component
public class LearnContentLoader implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(LearnContentLoader.class);

    @JsonIgnoreProperties(ignoreUnknown = true)
    record LessonFile(String code, String level, String skill, String topic, String title, String intro,
                      String passage, String audioText, Integer order, List<LearnItem> items) {
    }

    private final LearnLessonRepository lessons;
    private final ObjectMapper mapper = new ObjectMapper();

    public LearnContentLoader(LearnLessonRepository lessons) {
        this.lessons = lessons;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Resource[] files = new PathMatchingResourcePatternResolver().getResources("classpath:learn/*.json");
        int loaded = 0;
        Set<String> seen = new HashSet<>();
        for (Resource file : files) {
            try (InputStream in = file.getInputStream()) {
                for (LessonFile lf : mapper.readValue(in, LessonFile[].class)) {
                    String problem = problem(lf);
                    if (problem != null) {
                        log.warn("Skipping lesson {} in {}: {}", lf.code(), file.getFilename(), problem);
                        continue;
                    }
                    LearnLesson lesson = lessons.findByCode(lf.code()).orElseGet(() -> new LearnLesson(lf.code()));
                    lesson.apply(lf.level(), lf.skill(), lf.topic(), lf.title(), lf.intro(), lf.passage(),
                            lf.audioText(), lf.order() == null ? 0 : lf.order(), mapper.writeValueAsString(lf.items()));
                    lessons.save(lesson);
                    seen.add(lf.code());
                    loaded++;
                }
            } catch (Exception e) {
                log.warn("Could not read course file {}: {}", file.getFilename(), e.getMessage());
            }
        }
        // Lessons that no longer exist in the content files (old samples, renamed codes) are removed.
        if (!seen.isEmpty()) {
            List<LearnLesson> stale = lessons.findAll().stream().filter(l -> !seen.contains(l.getCode())).toList();
            if (!stale.isEmpty()) {
                lessons.deleteAll(stale);
                log.info("Course content: removed {} outdated lesson(s)", stale.size());
            }
        }
        log.info("Course content: {} lesson(s) loaded from {} file(s)", loaded, files.length);
    }

    static String problem(LessonFile lf) {
        if (lf.code() == null || lf.code().isBlank()) return "no code";
        if (lf.level() == null || !LearnService.LEVELS.contains(lf.level())) return "unknown level " + lf.level();
        if (lf.skill() == null || !LearnService.SKILLS.contains(lf.skill())) return "unknown skill " + lf.skill();
        if (lf.topic() == null || lf.title() == null) return "no topic or title";
        if (lf.items() == null || lf.items().isEmpty()) return "no items";
        Set<String> ids = new HashSet<>();
        for (LearnItem item : lf.items()) {
            String p = item.problem();
            if (p != null) return p;
            if (!ids.add(item.id())) return "duplicate item id " + item.id();
        }
        return null;
    }
}
