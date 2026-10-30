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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Study groups and their leaderboard through the real endpoints. */
@SpringBootTest
@AutoConfigureMockMvc
class GroupIntegrationTest {

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

    private String register(String username) throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":\"" + username + "\",\"lastName\":\"Test\",\"email\":\"" + username
                                + "@example.com\",\"username\":\"" + username + "\",\"password\":\"secret123\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    private int createGroup(String auth, String name) throws Exception {
        String body = mockMvc.perform(post("/api/groups").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + name + "\",\"emoji\":\"🚀\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ownedByMe").value(true))
                .andExpect(jsonPath("$.memberCount").value(1))
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    private String codeOf(String auth, int groupId) throws Exception {
        String body = mockMvc.perform(get("/api/groups/" + groupId).header("Authorization", auth))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.inviteCode");
    }

    private void join(String auth, String code, int expectedStatus) throws Exception {
        mockMvc.perform(post("/api/groups/join").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"code\":\"" + code + "\"}"))
                .andExpect(status().is(expectedStatus));
    }

    /** Adds a word and answers it once, which is worth a few XP. */
    private void earnSomeXp(String auth) throws Exception {
        String body = mockMvc.perform(post("/api/words").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"english\":\"apple\",\"uzbek\":\"olma\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        int wordId = JsonPath.read(body, "$.id");
        mockMvc.perform(post("/api/flashcards/answer").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"wordId\":" + wordId + ",\"known\":true}"))
                .andExpect(status().isNoContent());
    }

    @Test
    void friendsJoinWithTheCodeAndAreRankedByWeeklyXp() throws Exception {
        String ivan = register("ivan");
        String anna = register("anna");
        int groupId = createGroup(ivan, "Sinfdoshlar");
        String code = codeOf(ivan, groupId);
        assertThat(code).hasSize(6);

        earnSomeXp(anna);
        join(anna, code.toLowerCase(), 200);

        mockMvc.perform(get("/api/groups/" + groupId).header("Authorization", anna))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sinfdoshlar"))
                .andExpect(jsonPath("$.ownedByMe").value(false))
                .andExpect(jsonPath("$.members.length()").value(2))
                .andExpect(jsonPath("$.members[0].username").value("anna"))
                .andExpect(jsonPath("$.members[0].me").value(true))
                .andExpect(jsonPath("$.members[0].weekXp").value(8))
                .andExpect(jsonPath("$.members[1].username").value("ivan"))
                .andExpect(jsonPath("$.members[1].owner").value(true))
                .andExpect(jsonPath("$.members[1].weekXp").value(0));

        mockMvc.perform(get("/api/groups").header("Authorization", anna))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].memberCount").value(2));
    }

    @Test
    void badCodesAndDoubleJoinsAreRejected() throws Exception {
        String ivan = register("ivan");
        int groupId = createGroup(ivan, "Sinfdoshlar");
        join(ivan, codeOf(ivan, groupId), 409);
        join(ivan, "ZZZZZZ", 404);
    }

    @Test
    void outsidersCannotSeeAGroup() throws Exception {
        String ivan = register("ivan");
        String anna = register("anna");
        int groupId = createGroup(ivan, "Sinfdoshlar");
        mockMvc.perform(get("/api/groups/" + groupId).header("Authorization", anna)).andExpect(status().isNotFound());
        mockMvc.perform(delete("/api/groups/" + groupId).header("Authorization", anna)).andExpect(status().isNotFound());
    }

    @Test
    void ownerCanRemoveMembersButMembersCannot() throws Exception {
        String ivan = register("ivan");
        String anna = register("anna");
        int groupId = createGroup(ivan, "Sinfdoshlar");
        join(anna, codeOf(ivan, groupId), 200);

        String detail = mockMvc.perform(get("/api/groups/" + groupId).header("Authorization", ivan))
                .andReturn().getResponse().getContentAsString();
        java.util.List<Integer> annaIds = JsonPath.read(detail, "$.members[?(@.username=='anna')].userId");
        java.util.List<Integer> ivanIds = JsonPath.read(detail, "$.members[?(@.username=='ivan')].userId");

        mockMvc.perform(delete("/api/groups/" + groupId + "/members/" + ivanIds.get(0)).header("Authorization", anna))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/groups/" + groupId + "/members/" + ivanIds.get(0)).header("Authorization", ivan))
                .andExpect(status().isBadRequest());
        mockMvc.perform(delete("/api/groups/" + groupId + "/members/" + annaIds.get(0)).header("Authorization", ivan))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/groups/" + groupId).header("Authorization", anna)).andExpect(status().isNotFound());
    }

    @Test
    void ownerLeavingPassesOwnershipAndTheLastOneOutClosesTheGroup() throws Exception {
        String ivan = register("ivan");
        String anna = register("anna");
        int groupId = createGroup(ivan, "Sinfdoshlar");
        join(anna, codeOf(ivan, groupId), 200);

        mockMvc.perform(delete("/api/groups/" + groupId + "/members/me").header("Authorization", ivan))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/groups/" + groupId).header("Authorization", anna))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ownedByMe").value(true))
                .andExpect(jsonPath("$.members.length()").value(1));

        mockMvc.perform(delete("/api/groups/" + groupId + "/members/me").header("Authorization", anna))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/groups").header("Authorization", anna)).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void ownerCanDeleteTheGroup() throws Exception {
        String ivan = register("ivan");
        String anna = register("anna");
        int groupId = createGroup(ivan, "Sinfdoshlar");
        join(anna, codeOf(ivan, groupId), 200);

        mockMvc.perform(delete("/api/groups/" + groupId).header("Authorization", anna)).andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/groups/" + groupId).header("Authorization", ivan)).andExpect(status().isNoContent());
        mockMvc.perform(get("/api/groups").header("Authorization", anna)).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void blankNamesAreRejected() throws Exception {
        String ivan = register("ivan");
        mockMvc.perform(post("/api/groups").header("Authorization", ivan)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"  \"}"))
                .andExpect(status().isBadRequest());
    }
}
