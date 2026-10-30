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

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Answers given offline are uploaded in a batch, safely and in time order. */
@SpringBootTest
@AutoConfigureMockMvc
class OfflineAnswersIntegrationTest {

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

    private String register() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    private int addWord(String auth) throws Exception {
        String body = mockMvc.perform(post("/api/words").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"english\":\"apple\",\"uzbek\":\"olma\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nextReviewDate").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    private String batch(int wordId, String idA, String idB, Instant a, Instant b) {
        return "{\"answers\":["
                + "{\"clientId\":\"" + idA + "\",\"wordId\":" + wordId + ",\"known\":true,\"format\":\"FLASHCARD\","
                + "\"answeredAt\":\"" + a + "\"},"
                + "{\"clientId\":\"" + idB + "\",\"wordId\":" + wordId + ",\"known\":true,\"format\":\"SPEED\","
                + "\"answeredAt\":\"" + b + "\"}]}";
    }

    @Test
    void uploadAppliesAnswersAndRepeatingItChangesNothing() throws Exception {
        String auth = register();
        int wordId = addWord(auth);
        Instant twoDaysAgo = Instant.now().minus(2, ChronoUnit.DAYS);
        Instant yesterday = Instant.now().minus(1, ChronoUnit.DAYS);
        String body = batch(wordId, "aaa-1", "bbb-2", yesterday, twoDaysAgo);

        mockMvc.perform(post("/api/flashcards/answers/batch").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applied").value(2))
                .andExpect(jsonPath("$.skipped").value(0));

        // Same upload again (e.g. the first response was lost): nothing is applied twice.
        mockMvc.perform(post("/api/flashcards/answers/batch").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(jsonPath("$.applied").value(0))
                .andExpect(jsonPath("$.skipped").value(2));

        String stats = mockMvc.perform(get("/api/stats/summary").header("Authorization", auth))
                .andReturn().getResponse().getContentAsString();
        java.util.List<Integer> speed = JsonPath.read(stats, "$.formats[?(@.format=='SPEED')].total");
        java.util.List<Integer> flash = JsonPath.read(stats, "$.formats[?(@.format=='FLASHCARD')].total");
        assertThat(speed.get(0)).isEqualTo(1);
        assertThat(flash.get(0)).isEqualTo(1);

        // The word now carries its next review date, which the app needs to build a due deck offline.
        String words = mockMvc.perform(get("/api/words").header("Authorization", auth))
                .andReturn().getResponse().getContentAsString();
        String next = JsonPath.read(words, "$[0].nextReviewDate");
        assertThat(LocalDate.parse(next)).isAfter(LocalDate.now(ZoneId.systemDefault()).minusDays(2));
    }

    @Test
    void answersForDeletedWordsAreSkippedNotFailed() throws Exception {
        String auth = register();
        int wordId = addWord(auth);
        Instant now = Instant.now();
        mockMvc.perform(post("/api/flashcards/answers/batch").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(batch(wordId + 999, "x-1", "x-2", now, now)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applied").value(0))
                .andExpect(jsonPath("$.skipped").value(2));
    }

    @Test
    void oversizedBatchesAreRejected() throws Exception {
        String auth = register();
        StringBuilder sb = new StringBuilder("{\"answers\":[");
        for (int i = 0; i < 501; i++) {
            if (i > 0) {
                sb.append(',');
            }
            sb.append("{\"clientId\":\"c").append(i).append("\",\"wordId\":1,\"known\":true,\"answeredAt\":\"")
                    .append(Instant.now()).append("\"}");
        }
        sb.append("]}");
        mockMvc.perform(post("/api/flashcards/answers/batch").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(sb.toString()))
                .andExpect(status().isBadRequest());
    }
}
