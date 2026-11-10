package com.example.dictionary.controller;

import com.example.dictionary.dto.LearnDtos.*;
import com.example.dictionary.service.LearnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/learn")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Learn", description = "Level-based English course: daily goals, lessons, level exam, skill statistics")
public class LearnController {

    private final LearnService service;

    public LearnController(LearnService service) {
        this.service = service;
    }

    @Operation(summary = "Current level, level progress, today's goals per skill and exam availability")
    @GetMapping("/overview")
    public ResponseEntity<Overview> overview(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.overview(principal.getUsername()));
    }

    @Operation(summary = "Choose the CEFR level to study (A1, A2, B1, B2, C1)")
    @PutMapping("/level")
    public ResponseEntity<Overview> setLevel(@AuthenticationPrincipal UserDetails principal,
                                             @Valid @RequestBody LevelRequest request) {
        service.setLevel(principal.getUsername(), request.level());
        return ResponseEntity.ok(service.overview(principal.getUsername()));
    }

    @Operation(summary = "Lessons of the current level, optionally one skill only")
    @GetMapping("/lessons")
    public ResponseEntity<List<LessonSummary>> lessons(@AuthenticationPrincipal UserDetails principal,
                                                       @RequestParam(required = false) String skill) {
        return ResponseEntity.ok(service.lessons(principal.getUsername(), skill));
    }

    @Operation(summary = "A lesson with its exercises (answers are not included)")
    @GetMapping("/lessons/{code}")
    public ResponseEntity<LessonDetail> lesson(@PathVariable String code) {
        return ResponseEntity.ok(service.lesson(code));
    }

    @Operation(summary = "Check one answer while working through a lesson (nothing is saved)")
    @PostMapping("/lessons/{code}/check")
    public ResponseEntity<CheckResponse> check(@PathVariable String code, @Valid @RequestBody CheckRequest request) {
        return ResponseEntity.ok(service.check(code, request.itemId(), request.answer()));
    }

    @Operation(summary = "Finish a lesson: grades all answers, saves the result and grants XP")
    @PostMapping("/lessons/{code}/finish")
    public ResponseEntity<FinishResponse> finish(@AuthenticationPrincipal UserDetails principal,
                                                 @PathVariable String code,
                                                 @Valid @RequestBody FinishRequest request) {
        return ResponseEntity.ok(service.finish(principal.getUsername(), code, request.answers()));
    }

    @Operation(summary = "Questions of the level exam (409 until every lesson of the level is passed)")
    @GetMapping("/exam")
    public ResponseEntity<List<ExamQuestion>> exam(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.startExam(principal.getUsername()));
    }

    @Operation(summary = "Submit the level exam; passing it moves the user to the next level")
    @PostMapping("/exam")
    public ResponseEntity<ExamResult> submitExam(@AuthenticationPrincipal UserDetails principal,
                                                 @Valid @RequestBody ExamSubmit request) {
        return ResponseEntity.ok(service.submitExam(principal.getUsername(), request.answers()));
    }

    @Operation(summary = "Per-skill statistics of the current level and the weakest skill")
    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> stats(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.stats(principal.getUsername()));
    }
}
