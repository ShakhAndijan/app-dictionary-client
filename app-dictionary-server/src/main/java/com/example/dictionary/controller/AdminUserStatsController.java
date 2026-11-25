package com.example.dictionary.controller;

import com.example.dictionary.dto.AdminDtos.Grade;
import com.example.dictionary.dto.DevDtos;
import com.example.dictionary.dto.LearnDtos;
import com.example.dictionary.dto.WeeklyReportResponse;
import com.example.dictionary.service.AdminUserStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Read-only statistics of one learner; closed to everyone but admins by the /api/admin/** rule. */
@RestController
@RequestMapping("/api/admin/users/{id}")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Usage statistics and account management; ADMIN role only")
public class AdminUserStatsController {

    private final AdminUserStatsService service;

    public AdminUserStatsController(AdminUserStatsService service) {
        this.service = service;
    }

    @Operation(summary = "A user's weekly report")
    @GetMapping("/weekly")
    public WeeklyReportResponse weekly(@PathVariable Long id, @RequestParam(defaultValue = "0") int weeksBack) {
        return service.weekly(id, weeksBack);
    }

    @Operation(summary = "A user's English course statistics")
    @GetMapping("/english")
    public LearnDtos.StatsResponse english(@PathVariable Long id) {
        return service.english(id);
    }

    @Operation(summary = "A user's programming course progress")
    @GetMapping("/programming")
    public DevDtos.Overview programming(@PathVariable Long id) {
        return service.programming(id);
    }

    @Operation(summary = "A user's marks", description = "Course lessons, exams and word quizzes, newest first.")
    @GetMapping("/grades")
    public List<Grade> grades(@PathVariable Long id) {
        return service.grades(id);
    }
}
