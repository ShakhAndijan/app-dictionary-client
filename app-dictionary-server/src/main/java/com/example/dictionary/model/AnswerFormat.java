package com.example.dictionary.model;

/** How an answer was given. Kept in the review log so statistics can compare the formats. */
public enum AnswerFormat {
    /** The user typed the answer. */
    TYPED,
    /** The user picked one of several options. */
    CHOICE,
    /** The user flipped a flashcard and judged themselves. */
    FLASHCARD,
    /** The user heard the English word read aloud and typed it. */
    LISTENING,
    /** The user matched English words with their translations. Recognition only, so it is capped like a choice. */
    MATCHING,
    /** Timed multiple-choice rapid fire. Answered like a choice question, counted separately. */
    SPEED;

    /** Formats whose questions come with options to pick from. */
    public boolean hasOptions() {
        return this == CHOICE || this == SPEED;
    }

    /** Only a typed answer proves recall; the other formats are capped, see {@code ReviewService}. */
    public boolean isRecallProof() {
        return this == TYPED || this == LISTENING;
    }
}
