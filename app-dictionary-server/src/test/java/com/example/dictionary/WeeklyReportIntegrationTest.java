package com.example.dictionary;

import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.DevLabDone;
import com.example.dictionary.model.DevResult;
import com.example.dictionary.model.LearnResult;
import com.example.dictionary.repository.DevLabDoneRepository;
import com.example.dictionary.repository.DevResultRepository;
import com.example.dictionary.repository.LearnResultRepository;
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

import java.time.DayOfWeek;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The weekly report through the real endpoint. */
@SpringBootTest
@AutoConfigureMockMvc
class WeeklyReportIntegrationTest {

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

    @Autowired
    private LearnResultRepository learnResultRepository;

    @Autowired
    private DevResultRepository devResultRepository;

    @Autowired
    private DevLabDoneRepository devLabDoneRepository;

    @BeforeEach
    @AfterEach
    void clean() {
        learnResultRepository.deleteAll();
        devResultRepository.deleteAll();
        devLabDoneRepository.deleteAll();
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

    @Test
    void emptyWeekHasSevenZeroDays() throws Exception {
        String auth = register();
        LocalDate monday = LocalDate.now().with(DayOfWeek.MONDAY);
        mockMvc.perform(get("/api/stats/weekly").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.weekStart").value(monday.toString()))
                .andExpect(jsonPath("$.weekEnd").value(monday.plusDays(6).toString()))
                .andExpect(jsonPath("$.currentWeek").value(true))
                .andExpect(jsonPath("$.days.length()").value(7))
                .andExpect(jsonPath("$.totals.answers").value(0))
                .andExpect(jsonPath("$.totals.activeDays").value(0))
                .andExpect(jsonPath("$.bestDay").doesNotExist());
    }

    @Test
    void thisWeekCountsAnswersWordsAndXp() throws Exception {
        String auth = register();
        mockMvc.perform(post("/api/words").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"english\":\"apple\",\"uzbek\":\"olma\"}"))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/flashcards/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"wordId\":" + firstWordId(auth) + ",\"known\":true}"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/stats/weekly").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totals.answers").value(1))
                .andExpect(jsonPath("$.totals.correct").value(1))
                .andExpect(jsonPath("$.totals.accuracyPercent").value(100.0))
                .andExpect(jsonPath("$.totals.wordsAdded").value(1))
                .andExpect(jsonPath("$.totals.wordsPracticed").value(1))
                .andExpect(jsonPath("$.totals.activeDays").value(1))
                .andExpect(jsonPath("$.totals.xp").value(8))
                .andExpect(jsonPath("$.previous.answers").value(0))
                .andExpect(jsonPath("$.bestDay").value(LocalDate.now().toString()));

        mockMvc.perform(get("/api/stats/weekly?weeksBack=1").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentWeek").value(false))
                .andExpect(jsonPath("$.totals.answers").value(0));
    }

    @Test
    void coursesAreReportedByDirection() throws Exception {
        String auth = register();
        AppUser ivan = userRepository.findByUsername("ivan").orElseThrow();
        learnResultRepository.save(new LearnResult(ivan, LearnResult.LESSON, "A1", "READING", "a1-reading-1", 8, 10, true));
        learnResultRepository.save(new LearnResult(ivan, LearnResult.LESSON, "A1", "WRITING", "a1-writing-1", 2, 10, false));
        devResultRepository.save(new DevResult(ivan, DevResult.LESSON, "JUNIOR", "fe-css-jr-01", 9, 10, true));
        devLabDoneRepository.save(new DevLabDone(ivan, "fe-css-jr-01", "1"));

        mockMvc.perform(get("/api/stats/weekly").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.english.answers").value(20))
                .andExpect(jsonPath("$.english.correct").value(10))
                .andExpect(jsonPath("$.english.accuracyPercent").value(50.0))
                .andExpect(jsonPath("$.english.lessons").value(2))
                .andExpect(jsonPath("$.english.passed").value(1))
                .andExpect(jsonPath("$.english.activeDays").value(1))
                .andExpect(jsonPath("$.english.days.length()").value(7))
                .andExpect(jsonPath("$.english.parts.length()").value(2))
                .andExpect(jsonPath("$.programming.answers").value(10))
                .andExpect(jsonPath("$.programming.labs").value(1))
                .andExpect(jsonPath("$.programming.parts[0].key").value("css"))
                .andExpect(jsonPath("$.programming.previous.answers").value(0));

        mockMvc.perform(get("/api/stats/weekly?weeksBack=1").header("Authorization", auth))
                .andExpect(jsonPath("$.english.answers").value(0))
                .andExpect(jsonPath("$.programming.labs").value(0));
    }

    private int firstWordId(String auth) throws Exception {
        String body = mockMvc.perform(get("/api/words").header("Authorization", auth))
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$[0].id");
    }
}
