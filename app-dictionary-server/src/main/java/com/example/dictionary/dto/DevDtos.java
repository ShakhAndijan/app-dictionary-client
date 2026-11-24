package com.example.dictionary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Request/response shapes of the programming course (frontend roadmap). */
public final class DevDtos {

    private DevDtos() {
    }

    public record LevelRequest(@NotBlank String level) {
    }

    /** A level of the course; {@code ready} is false while it has no lessons yet. */
    public record LevelInfo(String level, boolean ready, int lessons) {
    }

    public record LessonSummary(String code, String module, String title, String intro, int unit, int itemCount,
                                Integer bestScore, boolean passed, int labCount, int labsDone) {
    }

    public record ModuleInfo(String key, int lessons, int passed) {
    }

    public record ExamInfo(int percent, boolean passed, String at) {
    }

    /** {@code level} is null until chosen. */
    public record Overview(String level, List<LevelInfo> levels, int passed, int total, int percent,
                           boolean examUnlocked, ExamInfo lastExam, int passMark, int examPassMark,
                           List<ModuleInfo> modules, List<LessonSummary> lessons) {
    }

    public record ItemView(String id, String kind, String prompt, List<String> options, List<String> words,
                           String passage) {
    }

    /** Theory and practice are JSON text; the web page renders them. */
    public record LessonDetail(String code, String level, String module, String title, String intro,
                               String theory, String practice, List<ItemView> items,
                               List<LabView> labs, List<String> labsDone) {
    }

    public record LabTestView(String call, String expect) {
    }

    /** A coding lab without its solution. */
    public record LabView(String id, String title, String task, String starter, List<LabTestView> tests, String hint) {
    }

    public record LabSolution(String solution) {
    }

    public record LabDoneResponse(int done, int total) {
    }

    public record CheckRequest(@NotBlank String itemId, @Size(max = 600) String answer) {
    }

    public record CheckResponse(boolean correct, String answer, String explain) {
    }

    public record AnswerEntry(@NotBlank String itemId, @Size(max = 600) String answer) {
    }

    public record FinishRequest(@NotNull @Size(max = 200) List<AnswerEntry> answers) {
    }

    public record ItemResult(String itemId, boolean correct, String answer, String explain) {
    }

    public record FinishResponse(int correct, int total, int score, boolean passed, List<ItemResult> results) {
    }

    public record ExamQuestion(String ref, String module, String kind, String prompt, List<String> options,
                               List<String> words, String passage) {
    }

    public record ExamAnswer(@NotBlank String ref, @Size(max = 600) String answer) {
    }

    public record ExamSubmit(@NotNull @Size(max = 200) List<ExamAnswer> answers) {
    }

    /** One exam question as graded, so the learner can review mistakes. */
    public record ExamReview(String ref, boolean correct, String answer, String explain) {
    }

    /** {@code newLevel} is the level moved up to, null when not passed or already at the top. */
    public record ExamResult(int percent, boolean passed, int correct, int total, int passMark, String newLevel,
                             List<ExamReview> review) {
    }
}
