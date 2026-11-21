package com.example.dictionary.service;

import com.example.dictionary.model.DevLesson;
import com.example.dictionary.repository.DevLessonRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
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
 * Loads the programming course from {@code classpath:dev/*.json} into the database on every startup,
 * matching lessons by {@code code} (same approach as {@link LearnContentLoader}). Invalid lessons are skipped
 * with a warning instead of stopping the server.
 */
@Component
public class DevContentLoader implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevContentLoader.class);

    @JsonIgnoreProperties(ignoreUnknown = true)
    record LessonFile(String code, String level, String module, String title, String intro, Integer order,
                      JsonNode theory, JsonNode practice, List<LearnItem> items) {
    }

    private final DevLessonRepository lessons;
    private final ObjectMapper mapper = new ObjectMapper();

    public DevContentLoader(DevLessonRepository lessons) {
        this.lessons = lessons;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Resource[] files = new PathMatchingResourcePatternResolver().getResources("classpath:dev/*.json");
        int loaded = 0;
        Set<String> seen = new HashSet<>();
        for (Resource file : files) {
            try (InputStream in = file.getInputStream()) {
                for (LessonFile lf : mapper.readValue(in, LessonFile[].class)) {
                    String problem = problem(lf);
                    if (problem != null) {
                        log.warn("Skipping dev lesson {} in {}: {}", lf.code(), file.getFilename(), problem);
                        continue;
                    }
                    DevLesson lesson = lessons.findByCode(lf.code()).orElseGet(() -> new DevLesson(lf.code()));
                    lesson.apply(lf.level(), lf.module(), lf.title(), lf.intro(), json(lf.theory()), json(lf.practice()),
                            lf.order() == null ? 0 : lf.order(), mapper.writeValueAsString(lf.items()));
                    lessons.save(lesson);
                    seen.add(lf.code());
                    loaded++;
                }
            } catch (Exception e) {
                log.warn("Could not read dev course file {}: {}", file.getFilename(), e.getMessage());
            }
        }
        if (!seen.isEmpty()) {
            List<DevLesson> stale = lessons.findAll().stream().filter(l -> !seen.contains(l.getCode())).toList();
            if (!stale.isEmpty()) {
                lessons.deleteAll(stale);
                log.info("Dev course: removed {} outdated lesson(s)", stale.size());
            }
        }
        log.info("Dev course: {} lesson(s) loaded from {} file(s)", loaded, files.length);
    }

    private String json(JsonNode node) throws Exception {
        return node == null || node.isNull() ? null : mapper.writeValueAsString(node);
    }

    static String problem(LessonFile lf) {
        if (lf.code() == null || lf.code().isBlank()) return "no code";
        if (lf.level() == null || !DevService.LEVELS.contains(lf.level())) return "unknown level " + lf.level();
        if (lf.module() == null || lf.module().isBlank()) return "no module";
        if (lf.title() == null) return "no title";
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
