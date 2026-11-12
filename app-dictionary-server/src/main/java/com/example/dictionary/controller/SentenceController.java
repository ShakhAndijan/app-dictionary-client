package com.example.dictionary.controller;

import com.example.dictionary.dto.SentenceDtos.SentenceCheckRequest;
import com.example.dictionary.dto.SentenceDtos.SentenceCheckResponse;
import com.example.dictionary.dto.SentenceDtos.SentenceStatusResponse;
import com.example.dictionary.service.SentenceCheckService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sentences")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Sentences", description = "Write a sentence with a word and have an AI grade it")
public class SentenceController {

    private final SentenceCheckService service;

    public SentenceController(SentenceCheckService service) {
        this.service = service;
    }

    @Operation(summary = "Is sentence checking available, and how many checks are left today")
    @GetMapping("/status")
    public ResponseEntity<SentenceStatusResponse> status(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.status(principal.getUsername()));
    }

    @Operation(summary = "Word ids for a practice mode (TODAY, WEAK or ALL)")
    @GetMapping("/words")
    public ResponseEntity<java.util.List<Long>> words(@AuthenticationPrincipal UserDetails principal,
                                                      @org.springframework.web.bind.annotation.RequestParam(defaultValue = "ALL") String mode) {
        return ResponseEntity.ok(service.wordIds(principal.getUsername(), mode));
    }

    @Operation(summary = "Sentence totals, average score and the last 7 days")
    @GetMapping("/stats")
    public ResponseEntity<com.example.dictionary.dto.SentenceDtos.SentenceStatsResponse> stats(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.stats(principal.getUsername()));
    }

    @Operation(summary = "Grade a sentence written with one of the user's words",
            description = "503 when AI is not configured, 429 when the daily limit is used up, 502 when the AI failed "
                    + "(the check is not counted in that case).")
    @PostMapping("/check")
    public ResponseEntity<SentenceCheckResponse> check(@AuthenticationPrincipal UserDetails principal,
                                                       @Valid @RequestBody SentenceCheckRequest request) {
        return ResponseEntity.ok(service.check(principal.getUsername(), request.wordId(), request.sentence()));
    }
}
