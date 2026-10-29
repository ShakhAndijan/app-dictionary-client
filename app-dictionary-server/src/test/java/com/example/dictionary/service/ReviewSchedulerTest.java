package com.example.dictionary.service;

import com.example.dictionary.model.WordState;
import com.example.dictionary.service.ReviewScheduler.Outcome;
import com.example.dictionary.service.ReviewScheduler.Schedule;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class ReviewSchedulerTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 10, 29);

    @Test
    void firstCorrectAnswerMovesNewWordToBoxOneDueTomorrow() {
        Schedule s = ReviewScheduler.next(0, null, Outcome.CORRECT, true, TODAY);
        assertThat(s.box()).isEqualTo(1);
        assertThat(s.nextReviewDate()).isEqualTo(TODAY.plusDays(1));
    }

    @Test
    void correctAnswerToDueWordAdvancesWithGrowingIntervals() {
        assertThat(ReviewScheduler.next(1, TODAY, Outcome.CORRECT, true, TODAY))
                .isEqualTo(new Schedule(2, TODAY.plusDays(3)));
        assertThat(ReviewScheduler.next(2, TODAY, Outcome.CORRECT, true, TODAY))
                .isEqualTo(new Schedule(3, TODAY.plusDays(7)));
        assertThat(ReviewScheduler.next(4, TODAY, Outcome.CORRECT, true, TODAY))
                .isEqualTo(new Schedule(5, TODAY.plusDays(30)));
    }

    @Test
    void boxNeverExceedsTheMaximum() {
        Schedule s = ReviewScheduler.next(ReviewScheduler.MAX_BOX, TODAY, Outcome.CORRECT, true, TODAY);
        assertThat(s.box()).isEqualTo(ReviewScheduler.MAX_BOX);
    }

    @Test
    void wrongAnswerDropsToBoxOneDueTomorrowFromAnyBox() {
        assertThat(ReviewScheduler.next(6, TODAY, Outcome.WRONG, true, TODAY))
                .isEqualTo(new Schedule(1, TODAY.plusDays(1)));
        assertThat(ReviewScheduler.next(0, null, Outcome.WRONG, true, TODAY))
                .isEqualTo(new Schedule(1, TODAY.plusDays(1)));
    }

    @Test
    void wrongAnswerDuringFreePracticeStillResetsTheWord() {
        assertThat(ReviewScheduler.next(4, TODAY.plusDays(10), Outcome.WRONG, false, TODAY).box()).isEqualTo(1);
    }

    @Test
    void typoKeepsTheBoxButReviewsAgainTomorrow() {
        assertThat(ReviewScheduler.next(3, TODAY, Outcome.TYPO, true, TODAY))
                .isEqualTo(new Schedule(3, TODAY.plusDays(1)));
        assertThat(ReviewScheduler.next(0, null, Outcome.TYPO, true, TODAY).box()).isEqualTo(1);
    }

    @Test
    void correctAnswerToWordThatIsNotDueDoesNotAdvance() {
        LocalDate due = TODAY.plusDays(5);
        assertThat(ReviewScheduler.next(3, due, Outcome.CORRECT, false, TODAY)).isEqualTo(new Schedule(3, due));
    }

    @Test
    void dueRules() {
        assertThat(ReviewScheduler.isDue(0, null, TODAY)).isTrue();
        assertThat(ReviewScheduler.isDue(2, TODAY, TODAY)).isTrue();
        assertThat(ReviewScheduler.isDue(2, TODAY.minusDays(3), TODAY)).isTrue();
        assertThat(ReviewScheduler.isDue(2, TODAY.plusDays(1), TODAY)).isFalse();
    }

    @Test
    void stateIsDerivedFromBox() {
        assertThat(ReviewScheduler.stateOf(0)).isEqualTo(WordState.NEW);
        assertThat(ReviewScheduler.stateOf(1)).isEqualTo(WordState.LEARNING);
        assertThat(ReviewScheduler.stateOf(4)).isEqualTo(WordState.LEARNING);
        assertThat(ReviewScheduler.stateOf(5)).isEqualTo(WordState.MASTERED);
    }
}
