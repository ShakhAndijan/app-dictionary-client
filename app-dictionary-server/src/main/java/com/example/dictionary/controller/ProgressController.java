package com.example.dictionary.controller;

import com.example.dictionary.dto.ProgressResponse;
import com.example.dictionary.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Progress", description = "XP, levels and achievements")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @Operation(summary = "Get XP, level and achievements",
            description = "Also unlocks any achievement the user has just earned. Achievements with "
                    + "justUnlocked=true have not been celebrated yet; call POST /seen after showing them.")
    @GetMapping
    public ResponseEntity<ProgressResponse> progress(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(progressService.progress(principal.getUsername()));
    }

    @Operation(summary = "Mark all unlocked achievements as seen")
    @PostMapping("/seen")
    public ResponseEntity<Void> markSeen(@AuthenticationPrincipal UserDetails principal) {
        progressService.markAllSeen(principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
