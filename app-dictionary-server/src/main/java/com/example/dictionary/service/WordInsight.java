package com.example.dictionary.service;

import com.example.dictionary.model.WordState;

import java.time.LocalDate;

/** What the review system knows about one word. */
/** {@code nextReviewDate} is null for a word that was never answered. */
public record WordInsight(WordState state, int lapses, boolean weak, LocalDate nextReviewDate) {

    public static final WordInsight UNSEEN = new WordInsight(WordState.NEW, 0, false, null);
}
