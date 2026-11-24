package com.example.dictionary.controller;

import com.example.dictionary.dto.DevDtos.*;
import com.example.dictionary.service.DevService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dev")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dev", description = "Programming course (frontend): levels, topic lessons, level exam")
public class DevController {

    private final DevService service;

    public DevController(DevService service) {
        this.service = service;
    }

    @Operation(summary = "Current level, its modules and lessons with progress, exam availability")
    @GetMapping("/overview")
    public ResponseEntity<Overview> overview(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.overview(principal.getUsername()));
    }

    @Operation(summary = "Choose the level to study (JUNIOR, MIDDLE, SENIOR)")
    @PutMapping("/level")
    public ResponseEntity<Overview> setLevel(@AuthenticationPrincipal UserDetails principal,
                                             @Valid @RequestBody LevelRequest request) {
        service.setLevel(principal.getUsername(), request.level());
        return ResponseEntity.ok(service.overview(principal.getUsername()));
    }

    @Operation(summary = "A lesson: theory, hands-on tasks and exercises (answers are not included)")
    @GetMapping("/lessons/{code}")
    public ResponseEntity<LessonDetail> lesson(@AuthenticationPrincipal UserDetails principal,
                                               @PathVariable String code) {
        return ResponseEntity.ok(service.lesson(principal.getUsername(), code));
    }

    @Operation(summary = "Mark a coding lab solved (the browser ran its tests)")
    @PostMapping("/lessons/{code}/labs/{labId}/done")
    public ResponseEntity<LabDoneResponse> labDone(@AuthenticationPrincipal UserDetails principal,
                                                   @PathVariable String code, @PathVariable String labId) {
        return ResponseEntity.ok(service.labDone(principal.getUsername(), code, labId));
    }

    @Operation(summary = "Reference solution of a coding lab")
    @GetMapping("/lessons/{code}/labs/{labId}/solution")
    public ResponseEntity<LabSolution> labSolution(@PathVariable String code, @PathVariable String labId) {
        return ResponseEntity.ok(service.labSolution(code, labId));
    }

    @Operation(summary = "Check one answer while working through a lesson (nothing is saved)")
    @PostMapping("/lessons/{code}/check")
    public ResponseEntity<CheckResponse> check(@PathVariable String code, @Valid @RequestBody CheckRequest request) {
        return ResponseEntity.ok(service.check(code, request.itemId(), request.answer()));
    }

    @Operation(summary = "Finish a lesson: grades all answers and saves the result")
    @PostMapping("/lessons/{code}/finish")
    public ResponseEntity<FinishResponse> finish(@AuthenticationPrincipal UserDetails principal,
                                                 @PathVariable String code,
                                                 @Valid @RequestBody FinishRequest request) {
        return ResponseEntity.ok(service.finish(principal.getUsername(), code, request.answers()));
    }

    @Operation(summary = "Level exam questions (409 until every lesson of the level is passed)")
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
}
