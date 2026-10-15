package com.example.schoolproject.controller;

import com.example.schoolproject.dto.DailyStatsResponse;
import com.example.schoolproject.dto.MonthlyStatsResponse;
import com.example.schoolproject.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Stats", description = "Daily/monthly word and quiz activity, with accuracy as a percentage")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @Operation(summary = "Daily stats",
            description = "One entry per day (oldest first) for the last `days` days, including today. "
                    + "`accuracyPercent` is correct answers out of all answers given that day.")
    @GetMapping("/daily")
    public ResponseEntity<List<DailyStatsResponse>> daily(@AuthenticationPrincipal UserDetails principal,
                                                            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(statsService.dailyStats(principal.getUsername(), days));
    }

    @Operation(summary = "Monthly stats",
            description = "One entry per month (oldest first) for the last `months` months, including this one. "
                    + "`accuracyPercent` is correct answers out of all answers given that month.")
    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyStatsResponse>> monthly(@AuthenticationPrincipal UserDetails principal,
                                                                @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(statsService.monthlyStats(principal.getUsername(), months));
    }
}
