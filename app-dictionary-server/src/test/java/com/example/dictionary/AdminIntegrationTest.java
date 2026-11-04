package com.example.dictionary;

import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.Role;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The admin endpoints are closed to regular users and count only regular accounts. */
@SpringBootTest
@AutoConfigureMockMvc
class AdminIntegrationTest {

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.example.dictionary.repository.AnnouncementRepository announcementRepository;

    @Autowired
    private com.example.dictionary.repository.AdminAuditRepository auditRepository;

    @BeforeEach
    @AfterEach
    void clean() {
        wordRepository.deleteAll();
        announcementRepository.deleteAll();
        auditRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String registerIvan() throws Exception {
        String body = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    private String adminToken() throws Exception {
        AppUser admin = new AppUser("boss", passwordEncoder.encode("Passw0rd!"), "Boss", "Man", "boss@example.com");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"boss\",\"password\":\"Passw0rd!\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    @Test
    void regularUserCannotReadAdminData() throws Exception {
        String auth = registerIvan();

        mockMvc.perform(get("/api/admin/overview").header("Authorization", auth)).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/users").header("Authorization", auth)).andExpect(status().isForbidden());
    }

    @Test
    void adminCanRenameAUserButRegularUsersCannot() throws Exception {
        String ivan = registerIvan();
        String admin = adminToken();
        Long id = userRepository.findByUsername("ivan").orElseThrow().getId();
        String body = "{\"firstName\":\" Pyotr \",\"lastName\":\"Petrov\"}";

        mockMvc.perform(put("/api/admin/users/" + id).header("Authorization", ivan)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/admin/users/" + id).header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Pyotr"))
                .andExpect(jsonPath("$.fullName").value("Pyotr Petrov"));

        mockMvc.perform(put("/api/admin/users/" + id).header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"firstName\":\"\",\"lastName\":\"X\"}"))
                .andExpect(status().isBadRequest());

        Long adminId = userRepository.findByUsername("boss").orElseThrow().getId();
        mockMvc.perform(put("/api/admin/users/" + adminId).header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void blockingSignsTheUserOutEverywhereAndUnblockingRestoresLogin() throws Exception {
        String registered = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON).content(IVAN))
                .andReturn().getResponse().getContentAsString();
        String ivan = "Bearer " + JsonPath.read(registered, "$.token");
        String refresh = JsonPath.read(registered, "$.refreshToken");
        String admin = adminToken();
        Long id = userRepository.findByUsername("ivan").orElseThrow().getId();

        mockMvc.perform(get("/api/me").header("Authorization", ivan)).andExpect(status().isOk());

        mockMvc.perform(put("/api/admin/users/" + id + "/blocked").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"blocked\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.blocked").value(true));

        // The old access token, the refresh token and a fresh login are all refused.
        mockMvc.perform(get("/api/me").header("Authorization", ivan)).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/refresh").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"" + refresh + "\"}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/admin/users/" + id + "/blocked").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"blocked\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.blocked").value(false));
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void adminCanGrantAndRemoveTheAdminRoleWithGuards() throws Exception {
        registerIvan();
        String boss = adminToken();
        Long ivanId = userRepository.findByUsername("ivan").orElseThrow().getId();
        Long bossId = userRepository.findByUsername("boss").orElseThrow().getId();

        // Nobody changes their own role, and the only admin cannot be removed.
        mockMvc.perform(put("/api/admin/users/" + bossId + "/role").header("Authorization", boss)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"role\":\"USER\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(put("/api/admin/users/" + ivanId + "/role").header("Authorization", boss)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));

        // The new admin's existing token works for admin endpoints straight away.
        String ivanLogin = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"ivan\",\"password\":\"secret123\"}"))
                .andReturn().getResponse().getContentAsString();
        String ivan = "Bearer " + JsonPath.read(ivanLogin, "$.token");
        mockMvc.perform(get("/api/admin/overview").header("Authorization", ivan)).andExpect(status().isOk());

        // Two admins now, so the second one can remove the first.
        mockMvc.perform(put("/api/admin/users/" + bossId + "/role").header("Authorization", ivan)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"role\":\"USER\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/audit").header("Authorization", ivan))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].action").value("REVOKE_ADMIN"))
                .andExpect(jsonPath("$[1].action").value("GRANT_ADMIN"))
                .andExpect(jsonPath("$[1].actor").value("boss"))
                .andExpect(jsonPath("$[1].target").value("ivan"));
    }

    @Test
    void userPageInsightsAndAnnouncements() throws Exception {
        String ivan = registerIvan();
        String admin = adminToken();
        Long id = userRepository.findByUsername("ivan").orElseThrow().getId();

        mockMvc.perform(post("/api/words").header("Authorization", ivan).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"english\":\"apple\",\"uzbek\":\"olma\"}"))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/admin/users/" + id).header("Authorization", admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("ivan"))
                .andExpect(jsonPath("$.words.length()").value(1))
                .andExpect(jsonPath("$.words[0].english").value("apple"))
                .andExpect(jsonPath("$.weekly.days.length()").value(7))
                .andExpect(jsonPath("$.totalAchievements").isNumber());

        mockMvc.perform(get("/api/admin/insights?days=30").header("Authorization", admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.retention.length()").value(3))
                .andExpect(jsonPath("$.formats").isArray());

        mockMvc.perform(get("/api/admin/overview?days=30").header("Authorization", admin))
                .andExpect(jsonPath("$.series.length()").value(30));

        // Announcements: admins publish, every signed-in user reads, only admins delete.
        String created = mockMvc.perform(post("/api/admin/announcements").header("Authorization", admin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"Texnik ishlar soat 22:00 da\",\"severity\":\"WARNING\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Number announcementId = JsonPath.read(created, "$.id");

        mockMvc.perform(post("/api/admin/announcements").header("Authorization", ivan)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"message\":\"hack\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/announcements").header("Authorization", ivan))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Texnik ishlar soat 22:00 da"))
                .andExpect(jsonPath("$[0].severity").value("WARNING"));

        mockMvc.perform(delete("/api/admin/announcements/" + announcementId.longValue()).header("Authorization", admin))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/announcements").header("Authorization", ivan))
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void adminCanDeleteAUserTogetherWithTheirData() throws Exception {
        String ivan = registerIvan();
        String admin = adminToken();
        Long id = userRepository.findByUsername("ivan").orElseThrow().getId();
        Long bossId = userRepository.findByUsername("boss").orElseThrow().getId();

        mockMvc.perform(post("/api/words").header("Authorization", ivan).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"english\":\"apple\",\"uzbek\":\"olma\"}"))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/groups").header("Authorization", ivan).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Sinf\",\"emoji\":\"x\"}"))
                .andExpect(status().isCreated());

        // Not for admins, not for regular users.
        mockMvc.perform(delete("/api/admin/users/" + bossId).header("Authorization", admin))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete("/api/admin/users/" + id).header("Authorization", ivan))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/admin/users/" + id).header("Authorization", admin))
                .andExpect(status().isNoContent());

        org.junit.jupiter.api.Assertions.assertTrue(userRepository.findByUsername("ivan").isEmpty());
        org.junit.jupiter.api.Assertions.assertEquals(0, wordRepository.count());
        mockMvc.perform(get("/api/admin/audit").header("Authorization", admin))
                .andExpect(jsonPath("$[0].action").value("DELETE_USER"))
                .andExpect(jsonPath("$[0].target").value("ivan"));
    }

    @Test
    void anonymousIsRejected() throws Exception {
        mockMvc.perform(get("/api/admin/overview")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminSeesOnlyRegularAccountsInTheNumbers() throws Exception {
        registerIvan();
        String admin = adminToken();

        mockMvc.perform(get("/api/admin/overview").header("Authorization", admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(1))
                .andExpect(jsonPath("$.newToday").value(1))
                .andExpect(jsonPath("$.series.length()").value(14));

        mockMvc.perform(get("/api/admin/users").header("Authorization", admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[?(@.username=='ivan')].wordCount").value(0))
                .andExpect(jsonPath("$[?(@.username=='boss')].role").value("ADMIN"));

        mockMvc.perform(get("/api/me").header("Authorization", admin))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }
}
