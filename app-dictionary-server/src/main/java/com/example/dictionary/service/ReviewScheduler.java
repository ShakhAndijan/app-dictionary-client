package com.example.dictionary.service;

import com.example.dictionary.model.WordState;

import java.time.LocalDate;

/**
 * Leitner-box scheduling for spaced repetition. Pure logic with no persistence, so it can be
 * tested in isolation.
 *
 * <p>A word with no progress is in box 0 ("new"). Every box above it has a review interval;
 * a correct answer moves the word one box up, a wrong one drops it back to box 1.
 */
public final class ReviewScheduler {

    public static final int NEW_BOX = 0;
    public static final int MAX_BOX = 7;
    public static final int MASTERED_FROM_BOX = 5;

    /** Days until the next review, indexed by box. Box 0 is unused. */
    private static final int[] INTERVAL_DAYS = {0, 1, 3, 7, 14, 30, 60, 120};

    public enum Outcome {
        CORRECT,
        /** Counted as correct, but the spelling was off: the box does not advance. */
        TYPO,
        WRONG
    }

    /** The word's position after an answer. */
    public record Schedule(int box, LocalDate nextReviewDate) {
    }

    private ReviewScheduler() {
    }

    /**
     * Computes the new schedule after an answer.
     *
     * @param box            the current box (0 = never answered)
     * @param nextReviewDate the current due date (ignored when {@code box} is 0)
     * @param due            whether the word was due when answered; correct answers to words that were
     *                       not due (free practice) do not advance the box, so practising cannot inflate progress
     */
    public static Schedule next(int box, LocalDate nextReviewDate, Outcome outcome, boolean due, LocalDate today) {
        switch (outcome) {
            case WRONG:
                return new Schedule(1, today.plusDays(INTERVAL_DAYS[1]));
            case TYPO:
                int held = Math.max(box, 1);
                return new Schedule(held, today.plusDays(INTERVAL_DAYS[1]));
            default:
                if (!due && box > NEW_BOX) {
                    return new Schedule(box, nextReviewDate);
                }
                int promoted = Math.min(box + 1, MAX_BOX);
                return new Schedule(promoted, today.plusDays(INTERVAL_DAYS[promoted]));
        }
    }

    /** Days until the next review for a word in {@code box}. */
    public static int intervalDays(int box) {
        return INTERVAL_DAYS[Math.max(0, Math.min(box, MAX_BOX))];
    }

    public static boolean isDue(int box, LocalDate nextReviewDate, LocalDate today) {
        return box == NEW_BOX || nextReviewDate == null || !nextReviewDate.isAfter(today);
    }

    public static WordState stateOf(int box) {
        if (box <= NEW_BOX) {
            return WordState.NEW;
        }
        return box >= MASTERED_FROM_BOX ? WordState.MASTERED : WordState.LEARNING;
    }
}
