package com.example.dictionary.model;

/** How an answer was given. Kept in the review log so statistics can compare the formats. */
public enum AnswerFormat {
    /** The user typed the answer. */
    TYPED,
    /** The user picked one of several options. */
    CHOICE,
    /** The user flipped a flashcard and judged themselves. */
    FLASHCARD;

    /** Only a typed answer proves recall; the other formats are capped, see {@code ReviewService}. */
    public boolean isRecallProof() {
        return this == TYPED;
    }
}
