package com.example.dictionary;

import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Multiple-choice quizzes and the per-format statistics. */
@SpringBootTest
@AutoConfigureMockMvc
class ChoiceQuizIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

    private static final Map<String, String> TRANSLATIONS = Map.of(
            "apple", "olma", "olma", "apple",
            "book", "kitob", "kitob", "book",
            "cat", "mushuk", "mushuk", "cat",
            "dog", "it", "it", "dog");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private QuizSessionRepository quizSessionRepository;

    @BeforeEach
    @AfterEach
    void clean() {
        quizSessionRepository.deleteAll();
        wordRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String register(int wordCount) throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");
        String[][] pairs = {{"apple", "olma"}, {"book", "kitob"}, {"cat", "mushuk"}, {"dog", "it"}};
        for (int i = 0; i < wordCount; i++) {
            mockMvc.perform(post("/api/words").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"english\":\"" + pairs[i][0] + "\",\"uzbek\":\"" + pairs[i][1] + "\"}"))
                    .andExpect(status().isCreated());
        }
        return auth;
    }

    private String start(String auth, String mode, String format) throws Exception {
        return mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mode\":\"" + mode + "\",\"format\":" + format + "}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
    }

    @Test
    void choiceNeedsAtLeastFourWords() throws Exception {
        String auth = register(3);
        mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mode\":\"ALL\",\"format\":\"CHOICE\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void typedQuizHasNoOptions() throws Exception {
        String auth = register(4);
        String body = start(auth, "ALL", "null");
        assertThat((Object) JsonPath.read(body, "$.options")).isNull();
    }

    @Test
    void choiceQuestionOffersFourOptionsIncludingTheRightOne() throws Exception {
        String auth = register(4);
        String body = start(auth, "ALL", "\"CHOICE\"");
        List<String> options = JsonPath.read(body, "$.options");
        String prompt = JsonPath.read(body, "$.promptText");
        assertThat(options).hasSize(4).doesNotHaveDuplicates();
        if (TRANSLATIONS.containsKey(prompt)) {
            assertThat(options).contains(TRANSLATIONS.get(prompt));
        }
    }

    @Test
    void choiceAnswersAreScoredAndShownSeparatelyInStats() throws Exception {
        String auth = register(4);
        String body = start(auth, "ALL", "\"CHOICE\"");
        long sessionId = ((Number) JsonPath.read(body, "$.sessionId")).longValue();
        String prompt = JsonPath.read(body, "$.promptText");
        String right = TRANSLATIONS.get(prompt);

        // Only a definition prompt has no entry in TRANSLATIONS; this test words have none.
        mockMvc.perform(post("/api/quiz/" + sessionId + "/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"answer\":\"" + right + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true));

        mockMvc.perform(get("/api/stats/summary").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.formats.length()").value(6))
                .andExpect(jsonPath("$.formats[?(@.format=='CHOICE')].total").value(1))
                .andExpect(jsonPath("$.formats[?(@.format=='CHOICE')].correct").value(1))
                .andExpect(jsonPath("$.formats[?(@.format=='TYPED')].total").value(0))
                .andExpect(jsonPath("$.formats[?(@.format=='FLASHCARD')].total").value(0));
    }

    @Test
    void choiceAnswerNeverLiftsAWordAboveTheCap() throws Exception {
        String auth = register(4);
        // Five rounds of correct choice answers on the same word cannot push it into "mastered" (box 5+).
        for (int round = 0; round < 6; round++) {
            String body = start(auth, "ALL", "\"CHOICE\"");
            long sessionId = ((Number) JsonPath.read(body, "$.sessionId")).longValue();
            String prompt = JsonPath.read(body, "$.promptText");
            while (true) {
                String answered = mockMvc.perform(post("/api/quiz/" + sessionId + "/answer")
                                .header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                                .content("{\"answer\":\"" + TRANSLATIONS.get(prompt) + "\"}"))
                        .andReturn().getResponse().getContentAsString();
                Boolean finished = JsonPath.read(answered, "$.progress.finished");
                if (finished) {
                    break;
                }
                prompt = JsonPath.read(answered, "$.nextPromptText");
            }
        }
        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.masteredCount").value(0));
    }
}
