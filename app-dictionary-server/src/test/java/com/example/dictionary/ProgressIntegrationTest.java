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

/** XP, levels and achievements through the real endpoints. */
@SpringBootTest
@AutoConfigureMockMvc
class ProgressIntegrationTest {

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
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    private static boolean flag(String body, String code, String field) {
        java.util.List<Boolean> values = JsonPath.read(body, "$.achievements[?(@.code=='" + code + "')]." + field);
        return values.get(0);
    }

    private String progress(String auth) throws Exception {
        return mockMvc.perform(get("/api/progress").header("Authorization", auth))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
    }

    @Test
    void newUserStartsAtLevelOneWithNothingUnlocked() throws Exception {
        String auth = register();
        mockMvc.perform(get("/api/progress").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalXp").value(0))
                .andExpect(jsonPath("$.level").value(1))
                .andExpect(jsonPath("$.levelTitle").value("Boshlovchi"))
                .andExpect(jsonPath("$.unlockedCount").value(0))
                .andExpect(jsonPath("$.achievements.length()").value(23));
    }

    @Test
    void addingTheFirstWordUnlocksAnAchievementWithAReward() throws Exception {
        String auth = register();
        addWord(auth, "apple", "olma");

        String body = progress(auth);
        assertThat((Integer) JsonPath.read(body, "$.unlockedCount")).isEqualTo(1);
        assertThat((Integer) JsonPath.read(body, "$.totalXp")).isEqualTo(20);
        assertThat(flag(body, "FIRST_WORD", "unlocked")).isTrue();
        assertThat(flag(body, "FIRST_WORD", "justUnlocked")).isTrue();

        // Reading again must not pay the reward twice.
        assertThat((Integer) JsonPath.read(progress(auth), "$.totalXp")).isEqualTo(20);

        mockMvc.perform(post("/api/progress/seen").header("Authorization", auth)).andExpect(status().isNoContent());
        assertThat(flag(progress(auth), "FIRST_WORD", "justUnlocked"))
                .isFalse();
    }

    @Test
    void correctAnswersEarnXpAndReportItInTheQuizResponse() throws Exception {
        String auth = register();
        addWord(auth, "apple", "olma");
        // Settle the first-word reward so the next numbers are only about the answer.
        int before = JsonPath.read(progress(auth), "$.totalXp");

        String start = mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"ALL\",\"format\":\"TYPED\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long sessionId = ((Number) JsonPath.read(start, "$.sessionId")).longValue();
        String prompt = JsonPath.read(start, "$.promptText");
        String right = "apple".equals(prompt) ? "olma" : "apple";

        String answered = mockMvc.perform(post("/api/quiz/" + sessionId + "/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"answer\":\"" + right + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true))
                .andReturn().getResponse().getContentAsString();
        int gained = JsonPath.read(answered, "$.xpGained");
        // A typed answer pays 10, +5 for moving the word up; the daily goal (default 5 words) is not reached.
        assertThat(gained).isEqualTo(15);

        int after = JsonPath.read(progress(auth), "$.totalXp");
        assertThat(after - before).isEqualTo(gained);
    }

    @Test
    void wrongAnswersEarnNoXp() throws Exception {
        String auth = register();
        addWord(auth, "apple", "olma");
        String start = mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"ALL\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long sessionId = ((Number) JsonPath.read(start, "$.sessionId")).longValue();

        mockMvc.perform(post("/api/quiz/" + sessionId + "/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"answer\":\"zzzzzz\"}"))
                .andExpect(jsonPath("$.correct").value(false))
                .andExpect(jsonPath("$.xpGained").value(0));
    }

    @Test
    void repeatingTheSameWordStopsPayingFullXp() throws Exception {
        String auth = register();
        int id = addWord(auth, "apple", "olma");

        int[] gains = new int[4];
        for (int i = 0; i < gains.length; i++) {
            mockMvc.perform(post("/api/flashcards/answer").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"wordId\":" + id + ",\"known\":true}"))
                    .andExpect(status().isNoContent());
        }
        // Two full-price flashcard answers (3 XP, the first also +5 for leaving box 0), then 1 XP each.
        // Plus the 20 XP of the "first word" achievement unlocked on read.
        assertThat((Integer) JsonPath.read(progress(auth), "$.totalXp")).isEqualTo(8 + 3 + 1 + 1 + 20);
    }
}
