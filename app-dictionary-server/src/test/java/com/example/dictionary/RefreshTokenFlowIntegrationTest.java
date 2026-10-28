package com.example.dictionary;

import com.example.dictionary.repository.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Refresh-token rotation, reuse detection, logout and password-change invalidation. */
@SpringBootTest
@AutoConfigureMockMvc
class RefreshTokenFlowIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    private record Tokens(String access, String refresh) {
    }

    private Tokens readTokens(ResultActions result) throws Exception {
        String body = result.andReturn().getResponse().getContentAsString();
        return new Tokens(JsonPath.read(body, "$.token"), JsonPath.read(body, "$.refreshToken"));
    }

    private Tokens register() throws Exception {
        return readTokens(mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty()));
    }

    private ResultActions refresh(String refreshToken) throws Exception {
        return mockMvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON)
                .content("{\"refreshToken\":\"" + refreshToken + "\"}"));
    }

    private ResultActions me(String accessToken) throws Exception {
        return mockMvc.perform(get("/api/me").header("Authorization", "Bearer " + accessToken));
    }

    @Test
    void refreshRotatesTokensAndTheNewAccessTokenWorks() throws Exception {
        Tokens first = register();

        Tokens second = readTokens(refresh(first.refresh()).andExpect(status().isOk()));

        assertThat(second.refresh()).isNotEqualTo(first.refresh());
        me(second.access()).andExpect(status().isOk()).andExpect(jsonPath("$.username").value("ivan"));
    }

    @Test
    void reusingAnAlreadyUsedRefreshTokenRevokesTheWholeSession() throws Exception {
        Tokens first = register();
        Tokens second = readTokens(refresh(first.refresh()).andExpect(status().isOk()));

        // The old token is replayed (e.g. by a thief): rejected...
        refresh(first.refresh()).andExpect(status().isUnauthorized());
        // ...and the legitimate newer token of the same session is dead as well.
        refresh(second.refresh()).andExpect(status().isUnauthorized());
    }

    @Test
    void logoutRevokesOnlyThatSession() throws Exception {
        register();
        Tokens phone = readTokens(mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk()));
        Tokens tablet = readTokens(mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk()));

        mockMvc.perform(post("/api/auth/logout").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"" + phone.refresh() + "\"}"))
                .andExpect(status().isOk());

        refresh(phone.refresh()).andExpect(status().isUnauthorized());
        refresh(tablet.refresh()).andExpect(status().isOk());
    }

    @Test
    void logoutWithoutBodyOrWithUnknownTokenIsHarmless() throws Exception {
        mockMvc.perform(post("/api/auth/logout")).andExpect(status().isOk());
        mockMvc.perform(post("/api/auth/logout").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"does-not-exist\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void unknownOrMissingRefreshTokenIsRejected() throws Exception {
        refresh("does-not-exist").andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void changingThePasswordSignsOutOtherSessionsButKeepsTheCurrentOne() throws Exception {
        Tokens current = register();
        Tokens other = readTokens(mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk()));

        Tokens renewed = readTokens(mockMvc.perform(put("/api/profile/password")
                        .header("Authorization", "Bearer " + current.access())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"oldPassword\":\"secret123\",\"newPassword\":\"newSecret456\"}"))
                .andExpect(status().isOk()));

        // Everything issued before the change is dead...
        me(current.access()).andExpect(status().isUnauthorized());
        me(other.access()).andExpect(status().isUnauthorized());
        refresh(current.refresh()).andExpect(status().isUnauthorized());
        refresh(other.refresh()).andExpect(status().isUnauthorized());

        // ...while the tokens returned by the password change work.
        me(renewed.access()).andExpect(status().isOk());
        refresh(renewed.refresh()).andExpect(status().isOk());
    }
}
