package com.example.dictionary;

import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.service.WordLookupClient;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** The auto-fill endpoint, with the two public APIs replaced by a stub. */
@SpringBootTest
@AutoConfigureMockMvc
class WordSuggestIntegrationTest {

    private static final String IVAN = """
            {"firstName":"Ivan","lastName":"Ivanov","email":"ivan@example.com",
             "username":"ivan","password":"secret123"}""";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private WordLookupClient lookup;

    @BeforeEach
    @AfterEach
    void clean() {
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
    void returnsTranslationDefinitionAndExample() throws Exception {
        String auth = register();
        when(lookup.definition("lemon")).thenReturn(
                Optional.of(new WordLookupClient.Entry("A yellow citrus fruit.", "Add a lemon.", "/ˈlem.ən/")));
        when(lookup.translation("lemon")).thenReturn(Optional.of("limon"));

        mockMvc.perform(get("/api/words/suggest").param("english", "  Lemon ").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.english").value("Lemon"))
                .andExpect(jsonPath("$.uzbek").value("limon"))
                .andExpect(jsonPath("$.definition").value("A yellow citrus fruit."))
                .andExpect(jsonPath("$.example").value("Add a lemon."))
                .andExpect(jsonPath("$.phonetic").value("/ˈlem.ən/"));

        // The second lookup of the same word is served from memory.
        mockMvc.perform(get("/api/words/suggest").param("english", "lemon").header("Authorization", auth))
                .andExpect(status().isOk());
        verify(lookup, times(1)).translation("lemon");
    }

    @Test
    void unknownWordGivesEmptyFieldsNotAnError() throws Exception {
        String auth = register();
        when(lookup.definition(anyString())).thenReturn(Optional.empty());
        when(lookup.translation(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/words/suggest").param("english", "zzzxq").header("Authorization", auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uzbek").doesNotExist())
                .andExpect(jsonPath("$.definition").doesNotExist());
    }

    @Test
    void rejectsInvalidInputWithoutCallingOutside() throws Exception {
        String auth = register();
        mockMvc.perform(get("/api/words/suggest").param("english", "   ").header("Authorization", auth))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/words/suggest").param("english", "a/b?x=1").header("Authorization", auth))
                .andExpect(status().isBadRequest());
        verify(lookup, never()).definition(anyString());
    }

    @Test
    void requiresSignIn() throws Exception {
        mockMvc.perform(get("/api/words/suggest").param("english", "lemon"))
                .andExpect(status().isUnauthorized());
    }
}
