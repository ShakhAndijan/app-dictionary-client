package com.example.dictionary.controller;

import com.example.dictionary.dto.ReviewSummaryResponse;
import com.example.dictionary.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/review")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Review", description = "Spaced repetition: what is due for review today")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @Operation(summary = "Review summary",
            description = "How many words are due for review and how many new words can be started today "
                    + "(daily limits applied), plus the number of learning and mastered words.")
    @GetMapping("/summary")
    public ResponseEntity<ReviewSummaryResponse> summary(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(reviewService.summary(principal.getUsername()));
    }
}
