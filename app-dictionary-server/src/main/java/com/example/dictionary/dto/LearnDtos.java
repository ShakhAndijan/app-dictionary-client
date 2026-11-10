package com.example.dictionary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

/** Request/response shapes of the level-based English course ("Ingliz tili"). */
public final class LearnDtos {

    private LearnDtos() {
    }

    public record LevelRequest(@NotBlank String level) {
    }

    /** A lesson in a list. {@code bestScore} is the best percentage so far, null when never finished. */
    public record LessonSummary(String code, String skill, String topic, String title, int unit, int itemCount,
                                Integer bestScore, boolean passed) {
    }

    /** Today's target for one skill: finish {@code target} lessons; {@code suggested} are the next ones to take. */
    public record Goal(String skill, int target, int done, List<LessonSummary> suggested) {
    }

    public record LevelProgress(int passed, int total, int percent) {
    }

    public record ExamInfo(int percent, boolean passed, Instant at) {
    }

    public record SkillProgress(String skill, int lessonsTotal, int lessonsPassed) {
    }

    /**
     * @param level        null until the user has picked a starting level
     * @param examUnlocked every lesson of the level is passed, so the level exam can be taken
     */
    public record Overview(String level, List<String> levels, LevelProgress progress, boolean examUnlocked,
                           ExamInfo lastExam, List<Goal> goals, boolean goalsDone, List<SkillProgress> skills) {
    }

    /** An exercise as the learner sees it: never contains the answer. */
    public record ItemView(String id, String kind, String prompt, List<String> options, List<String> words,
                           String passage, String audioText) {
    }

    public record LessonDetail(String code, String level, String skill, String topic, String title, String intro,
                               String passage, String audioText, List<ItemView> items) {
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

    public record FinishResponse(int correct, int total, int score, boolean passed, int xpGained,
                                 List<ItemResult> results) {
    }

    public record ExamQuestion(String ref, String skill, String kind, String prompt, List<String> options,
                               List<String> words, String passage, String audioText) {
    }

    public record ExamAnswer(@NotBlank String ref, @Size(max = 600) String answer) {
    }

    public record ExamSubmit(@NotNull @Size(max = 200) List<ExamAnswer> answers) {
    }

    public record SkillScore(String skill, int correct, int total, int percent) {
    }

    /** @param newLevel the level the user moved up to, null when the exam was not passed (or already at the top) */
    public record ExamResult(int percent, boolean passed, List<SkillScore> skills, String newLevel, int xpGained) {
    }

    /**
     * @param lessonPercent average score of lessons in this skill, null with no data
     * @param examPercent   score of the latest exam section, null with no exam
     * @param percent       the number used to rank skills (average of the two, or whichever exists)
     */
    public record SkillStat(String skill, int lessonsTotal, int lessonsPassed, Integer lessonPercent,
                            Integer examPercent, Integer percent, int attempts, int answered, int correct,
                            String lastAt, List<RecentResult> recent, List<WeakLesson> weakLessons) {
    }

    /** One finished lesson attempt, newest first in {@link SkillStat#recent()}. */
    public record RecentResult(String code, String title, int percent, boolean passed, String at) {
    }

    /** A lesson that was tried but is still below the pass mark. */
    public record WeakLesson(String code, String title, int bestScore) {
    }

    /** @param weakest the skill with the lowest percent, null while there is no data yet */
    public record StatsResponse(String level, List<SkillStat> skills, String weakest, int answered, int correct,
                                int activeDays, int examsTaken, int passMark) {
    }
}
