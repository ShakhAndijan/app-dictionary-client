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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Starred words: the flag, and practising only the starred ones. */
@SpringBootTest
@AutoConfigureMockMvc
class FavoriteWordsIntegrationTest {

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
                        .content("{\"english\":\"" + english + "\",\"uzbek\":\"" + uzbek + "\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.favorite").value(false))
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    private void setFavorite(String auth, int id, boolean value) throws Exception {
        mockMvc.perform(put("/api/words/" + id).header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"favorite\":" + value + "}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorite").value(value));
    }

    @Test
    void starringAndUnstarringKeepsTheRestOfTheWordIntact() throws Exception {
        String auth = register();
        int id = addWord(auth, "apple", "olma");

        setFavorite(auth, id, true);
        mockMvc.perform(get("/api/words").header("Authorization", auth))
                .andExpect(jsonPath("$[0].favorite").value(true))
                .andExpect(jsonPath("$[0].english").value("apple"))
                .andExpect(jsonPath("$[0].uzbek").value("olma"));

        setFavorite(auth, id, false);
    }

    @Test
    void editingOtherFieldsDoesNotClearTheStar() throws Exception {
        String auth = register();
        int id = addWord(auth, "apple", "olma");
        setFavorite(auth, id, true);

        mockMvc.perform(put("/api/words/" + id).header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"uzbek\":\"olma!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorite").value(true));
    }

    @Test
    void favoritesPoolContainsOnlyStarredWords() throws Exception {
        String auth = register();
        int apple = addWord(auth, "apple", "olma");
        addWord(auth, "book", "kitob");

        mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"FAVORITES\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/flashcards").param("mode", "FAVORITES").header("Authorization", auth))
                .andExpect(status().isBadRequest());

        setFavorite(auth, apple, true);

        mockMvc.perform(get("/api/flashcards").param("mode", "FAVORITES").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].english").value("apple"))
                .andExpect(jsonPath("$[0].favorite").value(true));

        mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"FAVORITES\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.progress.totalWords").value(1));
    }
}
