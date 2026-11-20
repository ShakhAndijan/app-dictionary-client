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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The study directions a user picks in the profile (words, IELTS, frontend). */
@SpringBootTest
@AutoConfigureMockMvc
class StudyModulesIntegrationTest {

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
    void modulesDefaultToWordsAndCanBeChosen() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"mod@example.com\",\"username\":\"mod\",\"password\":\"secret123\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String auth = "Bearer " + JsonPath.read(body, "$.token");

        // Nobody loses what they had: the original words practice is on by default.
        mockMvc.perform(get("/api/me").header("Authorization", auth))
                .andExpect(jsonPath("$.modules.length()").value(1))
                .andExpect(jsonPath("$.modules[0]").value("words"));

        mockMvc.perform(put("/api/profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"modules\":[\"frontend\",\"ielts\",\"ielts\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modules.length()").value(2))
                .andExpect(jsonPath("$.modules[0]").value("ielts"))
                .andExpect(jsonPath("$.modules[1]").value("frontend"));
        mockMvc.perform(get("/api/me").header("Authorization", auth)).andExpect(jsonPath("$.modules[0]").value("ielts"));

        // Choosing nothing is allowed; an unknown module is not; other profile updates leave the choice alone.
        mockMvc.perform(put("/api/profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"modules\":[]}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.modules.length()").value(0));
        mockMvc.perform(put("/api/profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"modules\":[\"cooking\"]}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(put("/api/profile").header("Authorization", auth).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dailyGoal\":15}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.modules.length()").value(0));
    }
}
