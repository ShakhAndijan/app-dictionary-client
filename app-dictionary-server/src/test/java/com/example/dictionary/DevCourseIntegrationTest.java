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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Frontend course: level choice, lessons, the level exam gate and the move up to the next level. */
@SpringBootTest
@AutoConfigureMockMvc
class DevCourseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository users;

    @BeforeEach
    @AfterEach
    void clean() {
        users.deleteAll();
    }

    @Test
    void juniorCourseRunsFromLessonsToExamAndMovesUp() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"dev@example.com\",\"username\":\"devuser\",\"password\":\"secret123\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");

        mockMvc.perform(get("/api/dev/overview").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.level").doesNotExist())
                .andExpect(jsonPath("$.levels.length()").value(3))
                .andExpect(jsonPath("$.levels[0].ready").value(true))
                .andExpect(jsonPath("$.levels[1].ready").value(false));
        mockMvc.perform(put("/api/dev/level").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"level\":\"EXPERT\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(put("/api/dev/level").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"level\":\"JUNIOR\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.level").value("JUNIOR"))
                .andExpect(jsonPath("$.total").value(119))
                .andExpect(jsonPath("$.passed").value(0))
                .andExpect(jsonPath("$.examUnlocked").value(false));

        // The exam waits until every lesson is passed.
        mockMvc.perform(get("/api/dev/exam").header("Authorization", auth)).andExpect(status().isConflict());

        // The lesson never reveals its answers.
        String lesson = mockMvc.perform(get("/api/dev/lessons/fe-internet-jr-01").header("Authorization", auth))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertTrue(!lesson.contains("\"answer\""));

        List<JsonNode> all = new java.util.ArrayList<>();
        for (String f : new String[]{"dev/frontend-internet-junior.json", "dev/frontend-html-junior.json", "dev/frontend-css-junior.json", "dev/frontend-javascript-junior.json", "dev/frontend-git-junior.json", "dev/frontend-npm-junior.json", "dev/frontend-react-junior.json"}) {
            new ObjectMapper().readTree(new ClassPathResource(f).getInputStream()).forEach(all::add);
        }
        Map<String, String> answers = new HashMap<>();

        // A wrong lesson attempt does not count; a right one does.
        for (JsonNode l : all) {
            String code = l.get("code").asText();
            StringBuilder wrong = new StringBuilder("{\"answers\":[]}");
            if (code.endsWith("01")) {
                mockMvc.perform(post("/api/dev/lessons/" + code + "/finish").header("Authorization", auth)
                                .contentType(MediaType.APPLICATION_JSON).content(wrong.toString()))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.passed").value(false))
                        .andExpect(jsonPath("$.score").value(0));
            }
            StringBuilder right = new StringBuilder("{\"answers\":[");
            boolean first = true;
            for (JsonNode it : l.get("items")) {
                answers.put(code + "#" + it.get("id").asText(), it.get("answer").asText());
                if (!first) right.append(',');
                first = false;
                right.append("{\"itemId\":\"").append(it.get("id").asText()).append("\",\"answer\":")
                        .append(new ObjectMapper().writeValueAsString(it.get("answer").asText())).append('}');
            }
            right.append("]}");
            mockMvc.perform(post("/api/dev/lessons/" + code + "/finish").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON).content(right.toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.passed").value(true))
                    .andExpect(jsonPath("$.score").value(100));
        }

        mockMvc.perform(get("/api/dev/overview").header("Authorization", auth))
                .andExpect(jsonPath("$.passed").value(119))
                .andExpect(jsonPath("$.percent").value(100))
                .andExpect(jsonPath("$.examUnlocked").value(true));

        String examBody = mockMvc.perform(get("/api/dev/exam").header("Authorization", auth))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        List<String> refs = JsonPath.read(examBody, "$[*].ref");
        assertEquals(20, refs.size());

        // Failing the exam keeps the level.
        StringBuilder bad = new StringBuilder("{\"answers\":[");
        for (int i = 0; i < refs.size(); i++) {
            if (i > 0) bad.append(',');
            bad.append("{\"ref\":\"").append(refs.get(i)).append("\",\"answer\":\"zzz\"}");
        }
        bad.append("]}");
        mockMvc.perform(post("/api/dev/exam").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON).content(bad.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.passed").value(false))
                .andExpect(jsonPath("$.newLevel").doesNotExist());
        mockMvc.perform(get("/api/dev/overview").header("Authorization", auth)).andExpect(jsonPath("$.level").value("JUNIOR"));

        // Passing it moves to the next level.
        StringBuilder good = new StringBuilder("{\"answers\":[");
        for (int i = 0; i < refs.size(); i++) {
            if (i > 0) good.append(',');
            good.append("{\"ref\":\"").append(refs.get(i)).append("\",\"answer\":")
                    .append(new ObjectMapper().writeValueAsString(answers.get(refs.get(i)))).append('}');
        }
        good.append("]}");
        mockMvc.perform(post("/api/dev/exam").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON).content(good.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.passed").value(true))
                .andExpect(jsonPath("$.percent").value(100))
                .andExpect(jsonPath("$.newLevel").value("MIDDLE"));
        mockMvc.perform(get("/api/dev/overview").header("Authorization", auth))
                .andExpect(jsonPath("$.level").value("MIDDLE"))
                .andExpect(jsonPath("$.total").value(0));
    }
}
