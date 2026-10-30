package com.example.dictionary.service;

import com.example.dictionary.dto.OfflineAnswerDtos.OfflineAnswer;
import com.example.dictionary.dto.OfflineAnswerDtos.OfflineAnswersResponse;
import com.example.dictionary.repository.ReviewLogRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import com.example.dictionary.dto.FlashcardAnswerRequest;
import com.example.dictionary.dto.WordResponse;
import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.PromptType;
import com.example.dictionary.model.QuizMode;
import com.example.dictionary.model.Word;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordRepository;
import com.example.dictionary.service.ReviewScheduler.Outcome;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Flashcard practice: the user flips a card and says whether they knew it. The self-assessment feeds
 * the same spaced-repetition schedule as typed quiz answers.
 */
@Service
public class FlashcardService {

    private static final int FREE_DECK_SIZE = 20;
    private static final int MAX_OFFLINE_AGE_DAYS = 30;

    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;
    private final WordService wordService;
    private final ReviewLogRepository logRepository;

    public FlashcardService(WordRepository wordRepository, UserRepository userRepository,
                            ReviewService reviewService, WordService wordService,
                            ReviewLogRepository logRepository) {
        this.logRepository = logRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
        this.wordService = wordService;
    }

    /** Builds a deck: due words (DUE), the weakest words (WEAK) or a random sample of all words. */
    @Transactional(readOnly = true)
    public List<WordResponse> deck(String username, QuizMode mode) {
        List<Word> words = switch (mode) {
            case DUE -> reviewService.reviewQueue(username);
            case WEAK -> reviewService.weakWords(username);
            case ALL, TODAY, FAVORITES -> sample(username, mode);
        };
        if (words.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No words to practise");
        }
        return wordService.toResponses(username, words);
    }

    /** Records the self-assessment. "Known" counts as correct, "not known" as wrong. */
    @Transactional
    public void answer(String username, FlashcardAnswerRequest request) {
        Word word = wordRepository.findByIdAndOwnerUsername(request.wordId(), username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Word not found"));
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Outcome outcome = request.known() ? Outcome.CORRECT : Outcome.WRONG;
        AnswerFormat format = request.format() == AnswerFormat.MATCHING ? AnswerFormat.MATCHING : AnswerFormat.FLASHCARD;
        reviewService.recordAnswer(owner, word, outcome, PromptType.ENGLISH, format);
    }

    /**
     * Stores answers that were given offline. Safe to repeat: an answer whose client id is already stored is
     * skipped, as is an answer for a word that has been deleted since. Answers are applied oldest first.
     */
    @Transactional
    public OfflineAnswersResponse answerOffline(String username, List<OfflineAnswer> answers) {
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Instant now = Instant.now();
        Instant oldest = now.minus(MAX_OFFLINE_AGE_DAYS, ChronoUnit.DAYS);

        int applied = 0;
        int skipped = 0;
        for (OfflineAnswer a : answers.stream().sorted(Comparator.comparing(OfflineAnswer::answeredAt)).toList()) {
            Word word = wordRepository.findByIdAndOwnerUsername(a.wordId(), username).orElse(null);
            if (word == null || logRepository.existsByOwnerUsernameAndClientId(username, a.clientId())) {
                skipped++;
                continue;
            }
            Instant at = a.answeredAt().isAfter(now) ? now : a.answeredAt().isBefore(oldest) ? oldest : a.answeredAt();
            Outcome outcome = a.known() ? Outcome.CORRECT : Outcome.WRONG;
            AnswerFormat format = a.format() == AnswerFormat.MATCHING || a.format() == AnswerFormat.SPEED
                    ? a.format() : AnswerFormat.FLASHCARD;
            reviewService.recordAnswer(owner, word, outcome, PromptType.ENGLISH, format, at, a.clientId());
            applied++;
        }
        return new OfflineAnswersResponse(applied, skipped);
    }

    private List<Word> sample(String username, QuizMode mode) {
        List<Word> pool = new ArrayList<>(wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username));
        if (mode == QuizMode.TODAY) {
            java.time.Instant start = java.time.LocalDate.now().atStartOfDay(java.time.ZoneId.systemDefault()).toInstant();
            pool = new ArrayList<>(wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, start));
        }
        if (mode == QuizMode.FAVORITES) {
            pool = new ArrayList<>(wordRepository.findByOwnerUsernameAndFavoriteTrueOrderByCreatedAtDesc(username));
        }
        Collections.shuffle(pool);
        return pool.size() > FREE_DECK_SIZE ? new ArrayList<>(pool.subList(0, FREE_DECK_SIZE)) : pool;
    }
}
