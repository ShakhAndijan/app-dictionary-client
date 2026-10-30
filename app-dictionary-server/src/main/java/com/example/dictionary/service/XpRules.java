package com.example.dictionary.service;

import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.service.ReviewScheduler.Outcome;

/**
 * How much XP an answer is worth. Pure rules, no state, so they are easy to test and to tune.
 *
 * <p>Harder formats pay more (typing proves recall, tapping an option only proves recognition), moving a word
 * to a higher box earns a bonus, and a word stops paying full XP after a couple of answers a day so that
 * repeating one easy word is never the best way to level up.
 */
final class XpRules {

    /** Full-price answers per word per day; later ones are worth {@link #REPEAT_XP}. */
    static final int FULL_ANSWERS_PER_WORD_PER_DAY = 2;
    static final int REPEAT_XP = 1;
    static final int BOX_UP_BONUS = 5;
    static final int DAILY_GOAL_BONUS = 25;

    private XpRules() {
    }

    static int baseXp(AnswerFormat format) {
        return switch (format) {
            case TYPED, LISTENING -> 10;
            case CHOICE, SPEED -> 5;
            case MATCHING -> 4;
            case FLASHCARD -> 3;
        };
    }

    /**
     * @param boxAdvanced the answer moved the word to a higher box
     * @param repeat      the word already earned its full-price answers today
     */
    static int answerXp(AnswerFormat format, Outcome outcome, boolean boxAdvanced, boolean repeat) {
        if (outcome == Outcome.WRONG) {
            return 0;
        }
        if (repeat) {
            return REPEAT_XP;
        }
        int base = baseXp(format);
        int xp = outcome == Outcome.TYPO ? Math.max(1, base / 2) : base;
        return boxAdvanced ? xp + BOX_UP_BONUS : xp;
    }
}
