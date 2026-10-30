package com.example.dictionary.model;

/** Which pool of words a quiz session draws from. */
public enum QuizMode {
    /** All of the user's words. */
    ALL,
    /** Only words the user added today. */
    TODAY,
    /** Spaced repetition: words due for review today plus a limited number of new ones. */
    DUE,
    /** Practice on the words the user keeps getting wrong. */
    WEAK,
    /** Only the words the user starred. */
    FAVORITES
}
