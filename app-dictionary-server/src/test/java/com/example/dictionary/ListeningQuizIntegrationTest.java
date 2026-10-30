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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Dictation quizzes: the English word is spoken by the client and typed back. */
@SpringBootTest
@AutoConfigureMockMvc
class ListeningQuizIntegrationTest {

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

    private String registerWithWords() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");
        for (String[] pair : new String[][]{{"apple", "olma"}, {"book", "kitob"}}) {
            mockMvc.perform(post("/api/words").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"english\":\"" + pair[0] + "\",\"uzbek\":\"" + pair[1] + "\"}"))
                    .andExpect(status().isCreated());
        }
        return auth;
    }

    @Test
    void listeningAlwaysPromptsTheEnglishWordWithoutOptions() throws Exception {
        String auth = registerWithWords();
        for (int i = 0; i < 5; i++) {
            String body = mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"mode\":\"ALL\",\"format\":\"LISTENING\"}"))
                    .andExpect(status().isCreated())
                    .andReturn().getResponse().getContentAsString();
            assertThat((String) JsonPath.read(body, "$.promptType")).isEqualTo("english");
            assertThat((String) JsonPath.read(body, "$.promptText")).isIn("apple", "book");
            assertThat((Object) JsonPath.read(body, "$.options")).isNull();
        }
    }

    @Test
    void typedAnswerIsScoredAndCountedUnderListening() throws Exception {
        String auth = registerWithWords();
        String body = mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mode\":\"ALL\",\"format\":\"LISTENING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long sessionId = ((Number) JsonPath.read(body, "$.sessionId")).longValue();
        String word = JsonPath.read(body, "$.promptText");

        mockMvc.perform(post("/api/quiz/" + sessionId + "/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"answer\":\"" + word + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true))
                .andExpect(jsonPath("$.correctAnswer").value(word));

        mockMvc.perform(get("/api/stats/summary").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.formats[?(@.format=='LISTENING')].total").value(1))
                .andExpect(jsonPath("$.formats[?(@.format=='LISTENING')].correct").value(1))
                .andExpect(jsonPath("$.formats[?(@.format=='TYPED')].total").value(0));
    }
}
