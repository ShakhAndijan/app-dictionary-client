package com.example.dictionary;

import com.example.dictionary.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Level course: pick a level, finish lessons, take the exam, move up, read the statistics. */
@SpringBootTest
@AutoConfigureMockMvc
class LearnFlowIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    /** "lessonCode#itemId" (or "lessonCode" -> list of item ids) to the right answer, read from the content file. */
    private final Map<String, String> answers = new HashMap<>();
    private final Map<String, List<String>> itemIds = new HashMap<>();

    @BeforeEach
    @AfterEach
    void clean() {
        userRepository.deleteAll();
    }

    @BeforeEach
    void loadAnswers() throws Exception {
        for (org.springframework.core.io.Resource file : new org.springframework.core.io.support.PathMatchingResourcePatternResolver()
                .getResources("classpath:learn/a1-*.json")) {
            try (InputStream in = file.getInputStream()) {
                for (JsonNode lesson : new ObjectMapper().readTree(in)) {
                    String code = lesson.get("code").asText();
                    List<String> ids = new ArrayList<>();
                    for (JsonNode item : lesson.get("items")) {
                        ids.add(item.get("id").asText());
                        answers.put(code + "#" + item.get("id").asText(), item.get("answer").asText());
                    }
                    itemIds.put(code, ids);
                }
            }
        }
        lessonCount = itemIds.size();
    }

    private int lessonCount;

    private static String esc(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String register() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    private String overview(String auth) throws Exception {
        return mockMvc.perform(get("/api/learn/overview").header("Authorization", auth))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    private String finish(String auth, String code, boolean right) throws Exception {
        StringBuilder sb = new StringBuilder("{\"answers\":[");
        List<String> ids = itemIds.get(code);
        for (int i = 0; i < ids.size(); i++) {
            String a = right ? esc(answers.get(code + "#" + ids.get(i))) : "zzz";
            sb.append(i > 0 ? "," : "").append("{\"itemId\":\"").append(ids.get(i)).append("\",\"answer\":\"").append(a).append("\"}");
        }
        sb.append("]}");
        return mockMvc.perform(post("/api/learn/lessons/" + code + "/finish").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(sb.toString()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    private String exam(String auth, boolean right) throws Exception {
        String questions = mockMvc.perform(get("/api/learn/exam").header("Authorization", auth))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        List<String> refs = JsonPath.read(questions, "$[*].ref");
        StringBuilder sb = new StringBuilder("{\"answers\":[");
        for (int i = 0; i < refs.size(); i++) {
            String a = right ? esc(answers.get(refs.get(i))) : "zzz";
            sb.append(i > 0 ? "," : "").append("{\"ref\":\"").append(refs.get(i)).append("\",\"answer\":\"").append(a).append("\"}");
        }
        sb.append("]}");
        return mockMvc.perform(post("/api/learn/exam").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(sb.toString()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    @Test
    void fullCourseFlow() throws Exception {
        String auth = register();

        // No level yet.
        mockMvc.perform(get("/api/learn/overview").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.level").doesNotExist())
                .andExpect(jsonPath("$.levels.length()").value(5));
        mockMvc.perform(get("/api/learn/exam").header("Authorization", auth)).andExpect(status().isConflict());
        mockMvc.perform(put("/api/learn/level").header("Authorization", auth)
                .contentType(MediaType.APPLICATION_JSON).content("{\"level\":\"Z9\"}")).andExpect(status().isBadRequest());

        // Pick A1: goals exist only for the skills that have lessons.
        mockMvc.perform(put("/api/learn/level").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"level\":\"A1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.level").value("A1"))
                .andExpect(jsonPath("$.progress.total").value(lessonCount))
                .andExpect(jsonPath("$.examUnlocked").value(false))
                .andExpect(jsonPath("$.goals.length()").value(5));
        mockMvc.perform(get("/api/learn/exam").header("Authorization", auth)).andExpect(status().isConflict());

        // A lesson never exposes its answers.
        String lesson = mockMvc.perform(get("/api/learn/lessons/a1-gram-1-test").header("Authorization", auth))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertThat(lesson).doesNotContain("\"answer\"");

        // Instant feedback for one item.
        mockMvc.perform(post("/api/learn/lessons/a1-gram-1-test/check").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"itemId\":\"1\",\"answer\":\"AM\"}"))
                .andExpect(jsonPath("$.correct").value(true));

        // Wrong answers do not pass and earn nothing; right answers pass, XP only once per day.
        String bad = finish(auth, "a1-gram-1-test", false);
        assertThat((Boolean) JsonPath.read(bad, "$.passed")).isFalse();
        assertThat((Integer) JsonPath.read(bad, "$.xpGained")).isZero();
        String good = finish(auth, "a1-gram-1-test", true);
        assertThat((Boolean) JsonPath.read(good, "$.passed")).isTrue();
        assertThat((Integer) JsonPath.read(good, "$.xpGained")).isPositive();
        assertThat((Integer) JsonPath.read(finish(auth, "a1-gram-1-test", true), "$.xpGained")).isZero();

        // Finish the rest: progress is complete and the exam unlocks.
        for (String code : itemIds.keySet()) finish(auth, code, true);
        String ov = overview(auth);
        assertThat((Integer) JsonPath.read(ov, "$.progress.percent")).isEqualTo(100);
        assertThat((Boolean) JsonPath.read(ov, "$.examUnlocked")).isTrue();
        assertThat((Boolean) JsonPath.read(ov, "$.goalsDone")).isTrue();

        // A failed exam keeps the level and shows up in the statistics.
        String failed = exam(auth, false);
        assertThat((Boolean) JsonPath.read(failed, "$.passed")).isFalse();
        assertThat(overview(auth)).contains("\"level\":\"A1\"");
        mockMvc.perform(get("/api/learn/stats").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.weakest").exists());

        // Passing it moves to A2, which now has its own lessons (nothing finished yet).
        String passed = exam(auth, true);
        assertThat((Boolean) JsonPath.read(passed, "$.passed")).isTrue();
        assertThat((String) JsonPath.read(passed, "$.newLevel")).isEqualTo("A2");
        mockMvc.perform(get("/api/learn/overview").header("Authorization", auth))
                .andExpect(jsonPath("$.level").value("A2"))
                .andExpect(jsonPath("$.progress.total").value(org.hamcrest.Matchers.greaterThan(90)))
                .andExpect(jsonPath("$.progress.passed").value(0))
                .andExpect(jsonPath("$.examUnlocked").value(false));
    }

    @Test
    void requiresLogin() throws Exception {
        mockMvc.perform(get("/api/learn/overview")).andExpect(status().is4xxClientError());
    }
}
