package com.example.dictionary.controller;

import com.example.dictionary.dto.AddWordRequest;
import com.example.dictionary.dto.UpdateWordRequest;
import com.example.dictionary.dto.WordResponse;
import com.example.dictionary.service.WordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Words", description = "Add, list, update and delete the signed-in user's vocabulary words")
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @Operation(summary = "Add a word",
            description = "Adds a new word (English, Uzbek translation, definition) for the signed-in user.")
    @PostMapping
    public ResponseEntity<WordResponse> addWord(@AuthenticationPrincipal UserDetails principal,
                                                 @Valid @RequestBody AddWordRequest request) {
        WordResponse response = wordService.addWord(principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "List my words", description = "Returns the signed-in user's words, newest first.")
    @GetMapping
    public ResponseEntity<List<WordResponse>> listWords(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(wordService.listWords(principal.getUsername()));
    }

    @Operation(summary = "Update a word",
            description = "Updates the given fields of a word owned by the signed-in user; omitted fields are left unchanged.")
    @PutMapping("/{id}")
    public ResponseEntity<WordResponse> updateWord(@AuthenticationPrincipal UserDetails principal,
                                                     @PathVariable Long id,
                                                     @RequestBody UpdateWordRequest request) {
        return ResponseEntity.ok(wordService.updateWord(principal.getUsername(), id, request));
    }

    @Operation(summary = "Delete a word", description = "Deletes a word owned by the signed-in user.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        wordService.deleteWord(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
