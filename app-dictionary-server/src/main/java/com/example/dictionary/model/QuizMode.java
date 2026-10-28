package com.example.dictionary.model;

/** Which pool of words a quiz session draws from. */
public enum QuizMode {
    /** All of the user's words. */
    ALL,
    /** Only words the user added today. */
    TODAY
}
