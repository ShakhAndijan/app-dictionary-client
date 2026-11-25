package com.example.dictionary;

import com.example.dictionary.repository.UserRepository;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The combined statistics of words, the English course and the programming course. */
@SpringBootTest
@AutoConfigureMockMvc
class ActivityIntegrationTest {

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
    void courseWorkShowsUpInItsOwnAreaAndKeepsTheStreak() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"act@example.com\",\"username\":\"actuser\",\"password\":\"secret123\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");

        mockMvc.perform(get("/api/stats/activity").param("days", "14").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.series.length()").value(14))
                .andExpect(jsonPath("$.hours.length()").value(24))
                .andExpect(jsonPath("$.streak").value(0))
                .andExpect(jsonPath("$.dev.answers.answered").value(0));

        mockMvc.perform(post("/api/dev/lessons/fe-internet-jr-01/finish").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"answers\":[]}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/stats/activity").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.streak").value(1))
                .andExpect(jsonPath("$.activeDays").value(1))
                .andExpect(jsonPath("$.english.answers.answered").value(0))
                .andExpect(jsonPath("$.words.answers.answered").value(0))
                .andExpect(jsonPath("$.recent[0].area").value("DEV"))
                .andExpect(jsonPath("$.recent[0].kind").value("LESSON"))
                .andExpect(jsonPath("$.recent[0].percent").value(0));
    }
}
