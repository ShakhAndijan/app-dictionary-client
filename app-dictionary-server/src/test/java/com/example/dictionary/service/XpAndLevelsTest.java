package com.example.dictionary.service;

import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.service.ReviewScheduler.Outcome;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class XpAndLevelsTest {

    @Test
    void typingPaysMoreThanTappingAnOption() {
        int typed = XpRules.answerXp(AnswerFormat.TYPED, Outcome.CORRECT, false, false);
        int choice = XpRules.answerXp(AnswerFormat.CHOICE, Outcome.CORRECT, false, false);
        int flashcard = XpRules.answerXp(AnswerFormat.FLASHCARD, Outcome.CORRECT, false, false);
        assertThat(typed).isGreaterThan(choice);
        assertThat(choice).isGreaterThan(flashcard);
    }

    @Test
    void wrongAnswersEarnNothingAndTyposEarnHalf() {
        assertThat(XpRules.answerXp(AnswerFormat.TYPED, Outcome.WRONG, true, false)).isZero();
        assertThat(XpRules.answerXp(AnswerFormat.TYPED, Outcome.TYPO, false, false))
                .isEqualTo(XpRules.baseXp(AnswerFormat.TYPED) / 2);
    }

    @Test
    void movingAWordUpAddsABonus() {
        int plain = XpRules.answerXp(AnswerFormat.TYPED, Outcome.CORRECT, false, false);
        int promoted = XpRules.answerXp(AnswerFormat.TYPED, Outcome.CORRECT, true, false);
        assertThat(promoted - plain).isEqualTo(XpRules.BOX_UP_BONUS);
    }

    @Test
    void repeatingAWordPaysAlmostNothing() {
        assertThat(XpRules.answerXp(AnswerFormat.TYPED, Outcome.CORRECT, true, true)).isEqualTo(XpRules.REPEAT_XP);
    }

    @Test
    void levelThresholdsGrowAndInvertExactly() {
        assertThat(Levels.thresholdFor(1)).isZero();
        assertThat(Levels.thresholdFor(2)).isEqualTo(100);
        assertThat(Levels.thresholdFor(5)).isEqualTo(1000);
        assertThat(Levels.thresholdFor(10)).isEqualTo(4500);

        assertThat(Levels.levelFor(0)).isEqualTo(1);
        assertThat(Levels.levelFor(99)).isEqualTo(1);
        assertThat(Levels.levelFor(100)).isEqualTo(2);
        assertThat(Levels.levelFor(999)).isEqualTo(4);
        assertThat(Levels.levelFor(1000)).isEqualTo(5);
        assertThat(Levels.levelFor(-5)).isEqualTo(1);
        for (int level = 1; level <= 60; level++) {
            long start = Levels.thresholdFor(level);
            assertThat(Levels.levelFor(start)).isEqualTo(level);
            assertThat(Levels.levelFor(Levels.thresholdFor(level + 1) - 1)).isEqualTo(level);
        }
    }

    @Test
    void everyLevelHasATitle() {
        for (int level = 1; level <= 40; level++) {
            assertThat(Levels.titleFor(level)).isNotBlank();
        }
    }
}
