package com.example.dictionary.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** One learner's activity in all three study areas: words, the English course and the programming course. */
public final class ActivityDtos {

    private ActivityDtos() {
    }

    /**
     * Answers of one area. {@code period*} cover the requested days, {@code previousAnswered} the same number of
     * days before them, so the two can be compared.
     */
    public record Area(long answered, long correct, int accuracy, long periodAnswered, long periodCorrect,
                       long previousAnswered, int activeDays, Instant lastAt) {
    }

    public record Words(Area answers, int total, int newCount, int learning, int mastered, int due, int quizzes,
                        int addedInPeriod) {
    }

    public record Skill(String skill, int lessonsPassed, int lessonsTotal, Integer percent) {
    }

    /** {@code level} is null while the learner has not chosen one. Lesson counts belong to that level. */
    public record English(Area answers, String level, int lessonsPassed, int lessonsTotal, int exams, int examsPassed,
                          int sentences, int sentenceScore, List<Skill> skills) {
    }

    public record Module(String key, int passed, int lessons) {
    }

    public record Dev(Area answers, String level, int lessonsPassed, int lessonsTotal, int exams, int examsPassed,
                      int labsDone, int labsTotal, List<Module> modules) {
    }

    /** One day of the chart. {@code dev} counts answered questions and solved labs. */
    public record Day(LocalDate date, int words, int english, int dev) {
    }

    /**
     * A finished piece of work. {@code area} is ENGLISH or DEV, {@code kind} LESSON, EXAM or LAB;
     * {@code percent} is null for labs.
     */
    public record Event(Instant at, String area, String kind, String title, Integer percent, boolean passed) {
    }

    /**
     * @param hours       actions per hour of the day (0-23) over the requested days
     * @param recent      the latest finished lessons, exams and labs, newest first
     * @param streak      days in a row, up to today or yesterday, with anything done in any area
     */
    public record Report(int days, Words words, English english, Dev dev, List<Day> series, int[] hours,
                         List<Event> recent, int streak, int bestStreak, int activeDays) {
    }
}
