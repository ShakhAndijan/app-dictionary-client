package com.example.dictionary.controller;

import com.example.dictionary.dto.FlashcardAnswerRequest;
import com.example.dictionary.dto.WordResponse;
import com.example.dictionary.model.QuizMode;
import com.example.dictionary.service.FlashcardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Flashcards", description = "Flip-card practice with self-assessment")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @Operation(summary = "Get a flashcard deck",
            description = "DUE = words to review today, WEAK = words the user keeps missing, "
                    + "ALL / TODAY = a random sample. Responds 400 when the deck would be empty.")
    @GetMapping
    public ResponseEntity<List<WordResponse>> deck(@AuthenticationPrincipal UserDetails principal,
                                                   @RequestParam QuizMode mode) {
        return ResponseEntity.ok(flashcardService.deck(principal.getUsername(), mode));
    }

    @Operation(summary = "Answer a flashcard", description = "known=true counts as correct, false as wrong.")
    @PostMapping("/answer")
    public ResponseEntity<Void> answer(@AuthenticationPrincipal UserDetails principal,
                                       @Valid @RequestBody FlashcardAnswerRequest request) {
        flashcardService.answer(principal.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}
