package com.example.dictionary.service;

import com.example.dictionary.model.WordState;

/** What the review system knows about one word. */
public record WordInsight(WordState state, int lapses, boolean weak) {

    public static final WordInsight UNSEEN = new WordInsight(WordState.NEW, 0, false);
}
