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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Timed rapid-fire rounds: multiple choice that never runs out of questions. */
@SpringBootTest
@AutoConfigureMockMvc
class SpeedQuizIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

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

    private String registerWithWords(int count) throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");
        String[][] pairs = {{"apple", "olma"}, {"book", "kitob"}, {"cat", "mushuk"}, {"dog", "it"}};
        for (int i = 0; i < count; i++) {
            mockMvc.perform(post("/api/words").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"english\":\"" + pairs[i][0] + "\",\"uzbek\":\"" + pairs[i][1] + "\"}"))
                    .andExpect(status().isCreated());
        }
        return auth;
    }

    private String startSpeed(String auth) throws Exception {
        return mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mode\":\"ALL\",\"format\":\"SPEED\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
    }

    @Test
    void speedRoundNeedsAtLeastFourWords() throws Exception {
        String auth = registerWithWords(3);
        mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mode\":\"ALL\",\"format\":\"SPEED\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void speedRoundNeverRunsOutOfQuestionsAndOffersOptions() throws Exception {
        String auth = registerWithWords(4);
        String body = startSpeed(auth);
        long sessionId = ((Number) JsonPath.read(body, "$.sessionId")).longValue();
        assertThat((Boolean) JsonPath.read(body, "$.progress.unlimited")).isTrue();
        assertThat((List<?>) JsonPath.read(body, "$.options")).hasSize(4);

        // Ten answers from a four-word pool: a normal quiz would have ended after four.
        for (int i = 0; i < 10; i++) {
            String answered = mockMvc.perform(post("/api/quiz/" + sessionId + "/answer")
                            .header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                            .content("{\"answer\":\"nope\"}"))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();
            assertThat((Boolean) JsonPath.read(answered, "$.progress.finished")).isFalse();
            assertThat((List<?>) JsonPath.read(answered, "$.nextOptions")).hasSize(4);
        }

        mockMvc.perform(get("/api/stats/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.formats[?(@.format=='SPEED')].total").value(10))
                .andExpect(jsonPath("$.formats[?(@.format=='CHOICE')].total").value(0));
    }
}
