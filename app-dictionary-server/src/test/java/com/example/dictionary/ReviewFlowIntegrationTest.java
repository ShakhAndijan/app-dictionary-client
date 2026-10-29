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

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Spaced repetition end to end: the review summary, the "DUE" quiz mode and word states. */
@SpringBootTest
@AutoConfigureMockMvc
class ReviewFlowIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

    private static final Map<String, String> TRANSLATIONS = Map.of(
            "apple", "olma", "olma", "apple",
            "book", "kitob", "kitob", "book",
            "cat", "mushuk", "mushuk", "cat");

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

    private String registerWithThreeWords() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");
        for (String[] pair : new String[][]{{"apple", "olma"}, {"book", "kitob"}, {"cat", "mushuk"}}) {
            mockMvc.perform(post("/api/words").header("Authorization", auth)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"english\":\"" + pair[0] + "\",\"uzbek\":\"" + pair[1] + "\"}"))
                    .andExpect(status().isCreated());
        }
        return auth;
    }

    private String startDue(String auth) throws Exception {
        return mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"DUE\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
    }

    private String answer(String auth, int sessionId, String text) throws Exception {
        return mockMvc.perform(post("/api/quiz/" + sessionId + "/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"answer\":\"" + text + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
    }

    @Test
    void newWordsAreOfferedForReviewAndBecomeLearningAfterACorrectAnswer() throws Exception {
        String auth = registerWithThreeWords();

        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.newCount").value(3))
                .andExpect(jsonPath("$.dueCount").value(0))
                .andExpect(jsonPath("$.learningCount").value(0))
                .andExpect(jsonPath("$.totalWords").value(3));

        String started = startDue(auth);
        int sessionId = ((Number) JsonPath.read(started, "$.sessionId")).intValue();
        assertThat((Integer) JsonPath.read(started, "$.progress.totalWords")).isEqualTo(3);
        assertThat((Boolean) JsonPath.read(started, "$.progress.unlimited")).isFalse();

        String prompt = JsonPath.read(started, "$.promptText");
        int answered = 0;
        while (prompt != null) {
            String result = answer(auth, sessionId, TRANSLATIONS.get(prompt));
            assertThat((Boolean) JsonPath.read(result, "$.correct")).isTrue();
            answered++;
            prompt = JsonPath.read(result, "$.nextPromptText");
        }
        assertThat(answered).isEqualTo(3);

        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.newCount").value(0))
                .andExpect(jsonPath("$.dueCount").value(0))
                .andExpect(jsonPath("$.learningCount").value(3));
        mockMvc.perform(get("/api/words").header("Authorization", auth))
                .andExpect(jsonPath("$[0].state").value("LEARNING"));
    }

    @Test
    void aWrongAnswerInAReviewSessionGetsExactlyOneRetry() throws Exception {
        String auth = registerWithThreeWords();
        String started = startDue(auth);
        int sessionId = ((Number) JsonPath.read(started, "$.sessionId")).intValue();
        String prompt = JsonPath.read(started, "$.promptText");

        // First answer is wrong: the word is queued again, so the session grows from 3 to 4 questions.
        String wrong = answer(auth, sessionId, "zzzzzzzz");
        assertThat((Boolean) JsonPath.read(wrong, "$.correct")).isFalse();
        assertThat((Integer) JsonPath.read(wrong, "$.progress.totalWords")).isEqualTo(4);

        // Being wrong on the retry must not queue it a third time.
        int questions = 1;
        prompt = JsonPath.read(wrong, "$.nextPromptText");
        while (prompt != null) {
            String result = answer(auth, sessionId, "zzzzzzzz");
            questions++;
            assertThat((Integer) JsonPath.read(result, "$.progress.totalWords")).isLessThanOrEqualTo(6);
            prompt = JsonPath.read(result, "$.nextPromptText");
        }
        // 3 words, each wrong once and retried once: 6 answers in total.
        assertThat(questions).isEqualTo(6);
    }

    @Test
    void reviewSessionWithNothingToReviewIsRejected() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");

        mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"DUE\"}"))
                .andExpect(status().isBadRequest());
    }

    private String start(String auth, String mode) throws Exception {
        return mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"" + mode + "\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
    }

    /** Answers every question of a session correctly and returns how many were asked. */
    private int answerAllCorrectly(String auth, String started) throws Exception {
        int sessionId = ((Number) JsonPath.read(started, "$.sessionId")).intValue();
        String prompt = JsonPath.read(started, "$.promptText");
        int asked = 0;
        while (prompt != null) {
            String result = answer(auth, sessionId, TRANSLATIONS.get(prompt));
            asked++;
            prompt = JsonPath.read(result, "$.nextPromptText");
        }
        return asked;
    }

    @Test
    void wordsAnsweredWrongBecomeWeakAndRecoverAfterThreeCorrectAnswersInARow() throws Exception {
        String auth = registerWithThreeWords();

        // Get every word wrong in a review session (each also gets its single retry).
        String started = startDue(auth);
        int sessionId = ((Number) JsonPath.read(started, "$.sessionId")).intValue();
        String prompt = JsonPath.read(started, "$.promptText");
        while (prompt != null) {
            prompt = JsonPath.read(answer(auth, sessionId, "zzzzzzzz"), "$.nextPromptText");
        }

        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.weakCount").value(3));
        mockMvc.perform(get("/api/words").header("Authorization", auth))
                .andExpect(jsonPath("$[0].weak").value(true))
                .andExpect(jsonPath("$[0].lapses").value(2));

        // Weak-word practice: a fixed queue with no retries.
        String weakSession = start(auth, "WEAK");
        assertThat((Boolean) JsonPath.read(weakSession, "$.progress.unlimited")).isFalse();
        assertThat(answerAllCorrectly(auth, weakSession)).isEqualTo(3);
        assertThat(answerAllCorrectly(auth, start(auth, "WEAK"))).isEqualTo(3);
        assertThat(answerAllCorrectly(auth, start(auth, "WEAK"))).isEqualTo(3);

        // Three correct answers in a row: the words have recovered.
        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.weakCount").value(0));
        mockMvc.perform(post("/api/quiz/start").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mode\":\"WEAK\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void dailyGoalDefaultsToTenCanBeChangedAndTodayProgressCountsDistinctWords() throws Exception {
        String auth = registerWithThreeWords();

        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.dailyGoal").value(10))
                .andExpect(jsonPath("$.todayDone").value(0));
        mockMvc.perform(get("/api/me").header("Authorization", auth))
                .andExpect(jsonPath("$.dailyGoal").value(10));

        mockMvc.perform(put("/api/profile").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"dailyGoal\":20}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dailyGoal").value(20));
        mockMvc.perform(put("/api/profile").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"dailyGoal\":0}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(put("/api/profile").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"dailyGoal\":101}"))
                .andExpect(status().isBadRequest());

        // Answering the same three words twice counts three distinct words, not six.
        answerAllCorrectly(auth, startDue(auth));
        answerAllCorrectly(auth, start(auth, "ALL"));
        mockMvc.perform(get("/api/review/summary").header("Authorization", auth))
                .andExpect(jsonPath("$.dailyGoal").value(20))
                .andExpect(jsonPath("$.todayDone").value(3));
    }
}
