package com.example.dictionary.model;

/** How well the user knows a word, derived from its Leitner box. */
public enum WordState {
    /** Never answered yet. */
    NEW,
    /** Answered at least once but not yet reliably remembered. */
    LEARNING,
    /** Remembered across several increasingly long intervals. */
    MASTERED
}
