package com.example.dictionary;

import com.example.dictionary.repository.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Exercises registration/login/logout with mock data against in-memory H2, printing a transcript. */
@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

    private static final String MARIA = """
            {"firstName":"Maria","lastName":"Petrova","email":"maria@example.com",
             "username":"maria","password":"secret123"}""";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void registrationLoginLogoutFlow() throws Exception {
        System.out.println("\n========  REGISTRATION FLOW (mock data)  ========");

        // 1. Register -> 201 + token.
        MvcResult ivanReg = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("ivan"))
                .andReturn();
        log("1) register (firstName/lastName/email/username/password) -> 201", ivanReg);
        String ivanToken = JsonPath.read(ivanReg.getResponse().getContentAsString(), "$.token");

        // 2. Profile shows first/last name and email.
        MvcResult ivanMe = mockMvc.perform(get("/api/me").header("Authorization", "Bearer " + ivanToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("ivan"))
                .andExpect(jsonPath("$.firstName").value("Ivan"))
                .andExpect(jsonPath("$.lastName").value("Ivanov"))
                .andExpect(jsonPath("$.email").value("ivan@example.com"))
                .andReturn();
        log("2) GET /api/me -> 200", ivanMe);

        // 3. Second account registers fine.
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(MARIA))
                .andExpect(status().isCreated());
        log("3) second account register -> 201", null);

        // 4. Duplicate username -> 409.
        MvcResult duplicateUsername = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isConflict())
                .andReturn();
        log("4) DUPLICATE username -> 409", duplicateUsername);

        // 5. Duplicate email (different username) -> 409.
        String duplicateEmailBody = """
                {"firstName":"Someone","lastName":"Else","email":"ivan@example.com",
                 "username":"someone","password":"secret123"}""";
        MvcResult duplicateEmail = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(duplicateEmailBody))
                .andExpect(status().isConflict())
                .andReturn();
        log("5) DUPLICATE email -> 409", duplicateEmail);

        // 6. Login (correct) -> 200, login (wrong) -> 401.
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"wrong-pass\"}"))
                .andExpect(status().isUnauthorized());

        // 7. Logout revokes the refresh token, so the session cannot be renewed any more.
        String ivanRefresh = JsonPath.read(ivanReg.getResponse().getContentAsString(), "$.refreshToken");
        String refreshBody = "{\"refreshToken\":\"" + ivanRefresh + "\"}";
        mockMvc.perform(post("/api/auth/logout").contentType(MediaType.APPLICATION_JSON).content(refreshBody))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content(refreshBody))
                .andExpect(status().isUnauthorized());

        System.out.println("========  END  ========\n");
    }

    private static void log(String label, MvcResult result) throws Exception {
        System.out.println();
        System.out.println("--- " + label + " ---");
        if (result == null) {
            return;
        }
        System.out.println("HTTP " + result.getResponse().getStatus());
        String body = result.getResponse().getContentAsString();
        if (body != null && !body.isBlank()) {
            System.out.println(body);
        }
    }
}
