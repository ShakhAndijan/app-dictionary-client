package com.example.dictionary.controller;

import com.example.dictionary.dto.DailyStatsResponse;
import com.example.dictionary.dto.MonthlyStatsResponse;
import com.example.dictionary.dto.StatsSummaryResponse;
import com.example.dictionary.dto.WeeklyReportResponse;
import com.example.dictionary.service.StatsService;
import com.example.dictionary.service.WeeklyReportService;
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
    private final WeeklyReportService weeklyReportService;

    public StatsController(StatsService statsService, WeeklyReportService weeklyReportService) {
        this.statsService = statsService;
        this.weeklyReportService = weeklyReportService;
    }

    @Operation(summary = "Daily stats",
            description = "One entry per day the user was active (oldest first) within the last `days` days. Unused days are omitted. "
                    + "`accuracyPercent` is correct answers out of all answers given that day.")
    @GetMapping("/daily")
    public ResponseEntity<List<DailyStatsResponse>> daily(@AuthenticationPrincipal UserDetails principal,
                                                            @RequestParam(defaultValue = "90") int days) {
        return ResponseEntity.ok(statsService.dailyStats(principal.getUsername(), days));
    }

    @Operation(summary = "Monthly stats",
            description = "One entry per active month (oldest first) within the last `months` months. Unused months are omitted. "
                    + "`accuracyPercent` is correct answers out of all answers given that month.")
    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyStatsResponse>> monthly(@AuthenticationPrincipal UserDetails principal,
                                                                @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(statsService.monthlyStats(principal.getUsername(), months));
    }

    @Operation(summary = "Weekly report",
            description = "A Monday-to-Sunday week with per-day answers, XP and new words, totals, and the previous week for comparison. "
                    + "`weeksBack` 0 is the current week, 1 is last week.")
    @GetMapping("/weekly")
    public ResponseEntity<WeeklyReportResponse> weekly(@AuthenticationPrincipal UserDetails principal,
                                                       @RequestParam(defaultValue = "0") int weeksBack) {
        return ResponseEntity.ok(weeklyReportService.report(principal.getUsername(), weeksBack));
    }

    @Operation(summary = "Stats summary",
            description = "All-time totals, accuracy, number of active days, and current/best streak of consecutive active days.")
    @GetMapping("/summary")
    public ResponseEntity<StatsSummaryResponse> summary(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(statsService.summary(principal.getUsername()));
    }
}
