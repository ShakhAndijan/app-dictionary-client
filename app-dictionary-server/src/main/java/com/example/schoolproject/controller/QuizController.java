package com.example.schoolproject.controller;

import com.example.schoolproject.dto.QuizAnswerResultResponse;
import com.example.schoolproject.dto.QuizQuestionResponse;
import com.example.schoolproject.dto.QuizSummaryResponse;
import com.example.schoolproject.dto.StartQuizRequest;
import com.example.schoolproject.dto.SubmitQuizAnswerRequest;
import com.example.schoolproject.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Quiz", description = "\"Baholash\" quiz sessions over the signed-in user's words")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @Operation(summary = "Start a quiz session",
            description = "Starts a new session over either all of the user's words or just today's. "
                    + "Pools of 20 or fewer words finish automatically once every word has been asked once; "
                    + "larger pools draw random words forever until /finish is called.")
    @PostMapping("/start")
    public ResponseEntity<QuizQuestionResponse> start(@AuthenticationPrincipal UserDetails principal,
                                                        @Valid @RequestBody StartQuizRequest request) {
        QuizQuestionResponse response = quizService.startQuiz(principal.getUsername(), request.mode());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Submit an answer",
            description = "Checks the answer to the session's current question and returns the next one "
                    + "(or null next-question fields if the session just auto-finished).")
    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<QuizAnswerResultResponse> answer(@AuthenticationPrincipal UserDetails principal,
                                                             @PathVariable Long sessionId,
                                                             @RequestBody SubmitQuizAnswerRequest request) {
        return ResponseEntity.ok(quizService.submitAnswer(principal.getUsername(), sessionId, request.answer()));
    }

    @Operation(summary = "Finish a quiz session",
            description = "Ends the session immediately (the \"Tugatish\" button) and returns the final score.")
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<QuizSummaryResponse> finish(@AuthenticationPrincipal UserDetails principal,
                                                        @PathVariable Long sessionId) {
        return ResponseEntity.ok(quizService.finishQuiz(principal.getUsername(), sessionId));
    }
}
