package com.example.dictionary.service;

import com.example.dictionary.dto.ReviewSummaryResponse;
import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.PromptType;
import com.example.dictionary.model.ReviewLog;
import com.example.dictionary.model.Word;
import com.example.dictionary.model.WordProgress;
import com.example.dictionary.model.WordState;
import com.example.dictionary.repository.ReviewLogRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordProgressRepository;
import com.example.dictionary.repository.WordRepository;
import com.example.dictionary.service.ReviewScheduler.Outcome;
import com.example.dictionary.service.ReviewScheduler.Schedule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

/** Spaced repetition on top of the user's words: records answers and builds the daily review queue. */
@Service
public class ReviewService {

    private static final int WEAK_SESSION_LIMIT = 30;
    /** Highest box a multiple-choice or flashcard answer can lift a word to. */
    private static final int NON_TYPED_BOX_CAP = 3;

    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final WordProgressRepository progressRepository;
    private final ReviewLogRepository logRepository;
    private final ZoneId zone = ZoneId.systemDefault();
    private final int newPerDay;
    private final int reviewsPerDay;

    public ReviewService(WordRepository wordRepository,
                         UserRepository userRepository,
                         WordProgressRepository progressRepository,
                         ReviewLogRepository logRepository,
                         @Value("${app.review.new-per-day:10}") int newPerDay,
                         @Value("${app.review.reviews-per-day:40}") int reviewsPerDay) {
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
        this.progressRepository = progressRepository;
        this.logRepository = logRepository;
        this.newPerDay = newPerDay;
        this.reviewsPerDay = reviewsPerDay;
    }

    /** Updates the word's schedule for an answer and appends it to the review log. */
    @Transactional
    public void recordAnswer(AppUser owner, Word word, Outcome outcome, PromptType promptType,
                             AnswerFormat format) {
        LocalDate today = LocalDate.now(zone);
        WordProgress progress = progressRepository.findByWordId(word.getId()).orElse(null);

        int boxBefore = progress == null ? ReviewScheduler.NEW_BOX : progress.getBox();
        LocalDate dueDate = progress == null ? null : progress.getNextReviewDate();
        boolean due = ReviewScheduler.isDue(boxBefore, dueDate, today);

        Schedule schedule = ReviewScheduler.next(boxBefore, dueDate, outcome, due, today);
        if (!format.isRecallProof() && outcome != Outcome.WRONG && schedule.box() > NON_TYPED_BOX_CAP) {
            // Recognising the right option (or judging yourself) is weaker evidence than typing it:
            // such answers can lift a word only up to the cap, never further.
            int capped = Math.max(boxBefore, NON_TYPED_BOX_CAP);
            if (capped < schedule.box()) {
                LocalDate next = due || dueDate == null
                        ? today.plusDays(ReviewScheduler.intervalDays(capped))
                        : dueDate;
                schedule = new Schedule(capped, next);
            }
        }

        if (progress == null) {
            progress = new WordProgress(word, owner);
        }
        progress.apply(schedule.box(), schedule.nextReviewDate(), outcome != Outcome.WRONG);
        progressRepository.save(progress);

        logRepository.save(new ReviewLog(owner, word, outcome != Outcome.WRONG, boxBefore, schedule.box(), promptType,
                format));
    }

    /**
     * The words to ask in a "Takrorlash" session: overdue words first (most overdue first, capped),
     * followed by a limited number of never-answered words.
     */
    @Transactional(readOnly = true)
    public List<Word> reviewQueue(String username) {
        QueueParts parts = queueParts(username);
        List<Word> queue = new ArrayList<>(parts.due());
        queue.addAll(parts.fresh());
        return queue;
    }

    @Transactional(readOnly = true)
    public ReviewSummaryResponse summary(String username) {
        List<Word> words = wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username);
        Map<Long, WordProgress> progress = progressByWordId(username);
        int learning = 0;
        int mastered = 0;
        for (Word word : words) {
            WordProgress p = progress.get(word.getId());
            WordState state = ReviewScheduler.stateOf(p == null ? ReviewScheduler.NEW_BOX : p.getBox());
            if (state == WordState.LEARNING) {
                learning++;
            } else if (state == WordState.MASTERED) {
                mastered++;
            }
        }
        QueueParts parts = queueParts(username);
        int weak = (int) progress.values().stream().filter(WordProgress::isWeak).count();
        int dailyGoal = userRepository.findByUsername(username)
                .map(AppUser::getDailyGoal)
                .orElse(AppUser.DEFAULT_DAILY_GOAL);
        Instant startOfToday = LocalDate.now(zone).atStartOfDay(zone).toInstant();
        int todayDone = (int) logRepository.countDistinctWordsAnsweredSince(username, startOfToday);
        return new ReviewSummaryResponse(parts.due().size(), parts.fresh().size(), learning, mastered,
                words.size(), weak, dailyGoal, todayDone);
    }

    /** Insight for every word the user has answered; words missing from the map are {@link WordInsight#UNSEEN}. */
    @Transactional(readOnly = true)
    public Map<Long, WordInsight> insightsByWordId(String username) {
        Map<Long, WordInsight> insights = new HashMap<>();
        progressByWordId(username).forEach((id, p) ->
                insights.put(id, new WordInsight(ReviewScheduler.stateOf(p.getBox()), p.getLapses(), p.isWeak())));
        return insights;
    }

    /** The words the user keeps getting wrong, worst first. */
    @Transactional(readOnly = true)
    public List<Word> weakWords(String username) {
        return progressRepository.findByOwnerUsername(username).stream()
                .filter(WordProgress::isWeak)
                .sorted(Comparator.comparingInt(WordProgress::getLapses).reversed())
                .limit(WEAK_SESSION_LIMIT)
                .map(WordProgress::getWord)
                .toList();
    }

    /**
     * Picks a random word from {@code pool}, favouring weak ones (low box, many lapses, never answered)
     * so free practice spends time where it helps most.
     */
    @Transactional(readOnly = true)
    public Word pickWeighted(String username, List<Word> pool) {
        Map<Long, WordProgress> progress = progressByWordId(username);
        int[] weights = new int[pool.size()];
        int total = 0;
        for (int i = 0; i < pool.size(); i++) {
            WordProgress p = progress.get(pool.get(i).getId());
            int box = p == null ? ReviewScheduler.NEW_BOX : p.getBox();
            int lapses = p == null ? 0 : Math.min(p.getLapses(), 5);
            weights[i] = 1 + (ReviewScheduler.MAX_BOX - box) + lapses;
            total += weights[i];
        }
        int roll = ThreadLocalRandom.current().nextInt(total);
        for (int i = 0; i < pool.size(); i++) {
            roll -= weights[i];
            if (roll < 0) {
                return pool.get(i);
            }
        }
        return pool.get(pool.size() - 1);
    }

    private record QueueParts(List<Word> due, List<Word> fresh) {
    }

    private QueueParts queueParts(String username) {
        LocalDate today = LocalDate.now(zone);
        Instant startOfToday = today.atStartOfDay(zone).toInstant();

        List<Word> words = wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username);
        Map<Long, WordProgress> progress = progressByWordId(username);

        List<WordProgress> overdue = new ArrayList<>();
        List<Word> neverAnswered = new ArrayList<>();
        for (Word word : words) {
            WordProgress p = progress.get(word.getId());
            if (p == null) {
                neverAnswered.add(word);
            } else if (ReviewScheduler.isDue(p.getBox(), p.getNextReviewDate(), today)) {
                overdue.add(p);
            }
        }

        overdue.sort(Comparator.comparing(WordProgress::getNextReviewDate));
        List<Word> due = overdue.stream().limit(reviewsPerDay).map(WordProgress::getWord).toList();

        long introducedToday = logRepository.countByOwnerUsernameAndStartBoxAndAnsweredAtGreaterThanEqual(
                username, ReviewScheduler.NEW_BOX, startOfToday);
        int allowance = (int) Math.max(0, newPerDay - introducedToday);
        // Oldest never-answered words first, so the backlog is worked through in the order it was added.
        neverAnswered.sort(Comparator.comparing(Word::getCreatedAt));
        List<Word> fresh = neverAnswered.stream().limit(allowance).toList();

        return new QueueParts(due, fresh);
    }

    private Map<Long, WordProgress> progressByWordId(String username) {
        Map<Long, WordProgress> map = new HashMap<>();
        for (WordProgress p : progressRepository.findByOwnerUsername(username)) {
            map.put(p.getWord().getId(), p);
        }
        return map;
    }
}
