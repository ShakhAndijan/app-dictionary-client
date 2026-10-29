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

import java.util.Base64;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Word pictures and the flashcard deck / self-assessment endpoints. */
@SpringBootTest
@AutoConfigureMockMvc
class FlashcardImageIntegrationTest {

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

    private int addWord(String auth, String english, String uzbek) throws Exception {
        String body = mockMvc.perform(post("/api/words").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"english\":\"" + english + "\",\"uzbek\":\"" + uzbek + "\",\"definition\":\"d\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.imageVersion").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    private static String imageJson(String type, byte[] bytes) {
        return "{\"contentType\":\"" + type + "\",\"data\":\"" + Base64.getEncoder().encodeToString(bytes) + "\"}";
    }

    @Test
    void imageCanBeAttachedReadAndRemoved() throws Exception {
        String auth = register();
        int id = addWord(auth, "apple", "olma");
        byte[] bytes = {1, 2, 3, 4, 5};

        mockMvc.perform(get("/api/words/" + id + "/image").header("Authorization", auth))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/words/" + id + "/image").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(imageJson("image/jpeg", bytes)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageVersion").isNumber());

        mockMvc.perform(get("/api/words/" + id + "/image").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contentType").value("image/jpeg"))
                .andExpect(jsonPath("$.data").value(Base64.getEncoder().encodeToString(bytes)));

        mockMvc.perform(put("/api/words/" + id + "/image").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(imageJson("image/png", new byte[]{9})))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/words/" + id + "/image").header("Authorization", auth))
                .andExpect(jsonPath("$.contentType").value("image/png"));

        mockMvc.perform(delete("/api/words/" + id + "/image").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageVersion").doesNotExist());
        mockMvc.perform(get("/api/words/" + id + "/image").header("Authorization", auth))
                .andExpect(status().isNotFound());
    }

    @Test
    void invalidImagesAreRejected() throws Exception {
        String auth = register();
        int id = addWord(auth, "apple", "olma");

        mockMvc.perform(put("/api/words/" + id + "/image").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(imageJson("text/html", new byte[]{1})))
                .andExpect(status().isBadRequest());
        mockMvc.perform(put("/api/words/" + id + "/image").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"contentType\":\"image/png\",\"data\":\"***not base64***\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(put("/api/words/" + id + "/image").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(imageJson("image/png", new byte[1_000_001])))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deletingAWordRemovesItsImage() throws Exception {
        String auth = register();
        int id = addWord(auth, "apple", "olma");
        mockMvc.perform(put("/api/words/" + id + "/image").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(imageJson("image/jpeg", new byte[]{1, 2})))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/words/" + id).header("Authorization", auth))
                .andExpect(status().isNoContent());
    }

    @Test
    void flashcardAnswersFeedTheSchedule() throws Exception {
        String auth = register();
        int apple = addWord(auth, "apple", "olma");
        addWord(auth, "book", "kitob");

        mockMvc.perform(get("/api/flashcards").param("mode", "DUE").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].definition").value("d"));

        mockMvc.perform(get("/api/flashcards").param("mode", "WEAK").header("Authorization", auth))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/flashcards/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"wordId\":" + apple + ",\"known\":false}"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/flashcards").param("mode", "WEAK").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].english").value("apple"));

        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.todayDone").value(1));

        mockMvc.perform(get("/api/flashcards").param("mode", "ALL").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
