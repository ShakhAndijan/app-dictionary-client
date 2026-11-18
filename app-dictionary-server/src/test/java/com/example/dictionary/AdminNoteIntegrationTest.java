package com.example.dictionary;

import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.Role;
import com.example.dictionary.repository.AdminNoteRepository;
import com.example.dictionary.repository.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The admin's private saved-messages chat: text and files, visible to nobody else. */
@SpringBootTest
@AutoConfigureMockMvc
class AdminNoteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository users;
    @Autowired
    private AdminNoteRepository notes;
    @Autowired
    private PasswordEncoder encoder;

    @BeforeEach
    @AfterEach
    void clean() {
        notes.deleteAll();
        users.deleteAll();
    }

    private String login(String username, Role role) throws Exception {
        AppUser u = new AppUser(username, encoder.encode("Passw0rd!"), "A", "B", username + "@example.com");
        u.setRole(role);
        users.save(u);
        String body = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\",\"password\":\"Passw0rd!\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    @Test
    void textAndFileNotesStayPrivateToTheirAdmin() throws Exception {
        String boss = login("boss", Role.ADMIN);
        String other = login("other", Role.ADMIN);
        String user = login("plain", Role.USER);

        mockMvc.perform(multipart("/api/admin/notes").param("text", "  eslatma  ").header("Authorization", boss))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("eslatma"))
                .andExpect(jsonPath("$.kind").value("NONE"));

        byte[] bytes = "not-really-a-video-but-bytes".getBytes();
        String made = mockMvc.perform(multipart("/api/admin/notes")
                        .file(new MockMultipartFile("file", "clip.mp4", "video/mp4", bytes))
                        .param("text", "dars videosi").header("Authorization", boss))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.kind").value("VIDEO"))
                .andExpect(jsonPath("$.fileName").value("clip.mp4"))
                .andReturn().getResponse().getContentAsString();
        Integer id = JsonPath.read(made, "$.id");
        String url = "/api" + JsonPath.read(made, "$.fileUrl");

        // Nothing at all without text or file.
        mockMvc.perform(multipart("/api/admin/notes").header("Authorization", boss)).andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/admin/notes").header("Authorization", boss))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].kind").value("VIDEO")); // newest first
        mockMvc.perform(get("/api/admin/notes").header("Authorization", other)).andExpect(jsonPath("$.length()").value(0));
        mockMvc.perform(get("/api/admin/notes").header("Authorization", user)).andExpect(status().isForbidden());

        // The signed link works without any header and serves the bytes; a forged one does not.
        mockMvc.perform(get(url)).andExpect(status().isOk()).andExpect(content().bytes(bytes));
        mockMvc.perform(get(url.replaceAll("sig=.", "sig=x"))).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/notes/" + id + "/file?exp=1&sig=abc")).andExpect(status().isForbidden());

        // Someone else's note can be neither edited nor deleted.
        mockMvc.perform(delete("/api/admin/notes/" + id).header("Authorization", other)).andExpect(status().isNotFound());
        mockMvc.perform(put("/api/admin/notes/" + id).header("Authorization", boss)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"text\":\"yangilandi\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.text").value("yangilandi"))
                .andExpect(jsonPath("$.editedAt").exists());

        mockMvc.perform(delete("/api/admin/notes/" + id).header("Authorization", boss)).andExpect(status().isNoContent());
        assertEquals(1, notes.count());
        mockMvc.perform(get(url)).andExpect(status().isNotFound());
    }
}
