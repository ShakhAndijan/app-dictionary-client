package com.example.dictionary.service;

import com.example.dictionary.dto.QuizAnswerResultResponse;
import com.example.dictionary.dto.QuizProgressResponse;
import com.example.dictionary.dto.QuizQuestionResponse;
import com.example.dictionary.dto.QuizSummaryResponse;
import com.example.dictionary.model.AnswerField;
import com.example.dictionary.model.AnswerFormat;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.PromptType;
import com.example.dictionary.model.QuizMode;
import com.example.dictionary.model.QuizSession;
import com.example.dictionary.model.QuizStatus;
import com.example.dictionary.model.Word;
import com.example.dictionary.repository.QuizSessionRepository;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Runs "Baholash" quiz sessions. A session draws from either all of the user's words
 * or just today's, shows one of {english, uzbek, definition} as the question, and
 * always expects an english-or-uzbek answer (never a definition).
 *
 * Pools of 20 or fewer words are asked exactly once each, in a shuffled order, and the
 * session finishes automatically when the pool is exhausted. Pools larger than 20 draw
 * a random word (with repeats) every time and only finish when the client calls
 * {@link #finishQuiz}.
 */
@Service
public class QuizService {

    private static final int UNLIMITED_THRESHOLD = 20;
    private static final int CHOICE_OPTIONS = 4;
    private static final int MIN_WORDS_FOR_CHOICE = 4;

    private final QuizSessionRepository quizSessionRepository;
    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;

    public QuizService(QuizSessionRepository quizSessionRepository,
                        WordRepository wordRepository,
                        UserRepository userRepository,
                        ReviewService reviewService) {
        this.quizSessionRepository = quizSessionRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
    }

    @Transactional
    public QuizQuestionResponse startQuiz(String username, QuizMode mode, AnswerFormat requestedFormat) {
        AnswerFormat format = requestedFormat == null || requestedFormat == AnswerFormat.FLASHCARD
                ? AnswerFormat.TYPED
                : requestedFormat;
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Word> eligible = eligibleWords(username, mode);
        if (eligible.isEmpty()) {
            String message = switch (mode) {
                case TODAY -> "Bugun hech qanday so'z qo'shilmagan";
                case DUE -> "Bugun takrorlash uchun so'z yo'q";
                case WEAK -> "Zaif so'zlar yo'q";
                case FAVORITES -> "Sevimli so'zlar yo'q. Avval so'zga yulduzcha qo'ying";
                case ALL -> "Baholash uchun so'zlar mavjud emas";
            };
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }

        if (format.hasOptions()
                && wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username).size() < MIN_WORDS_FOR_CHOICE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Variantli va tezkor test uchun kamida " + MIN_WORDS_FOR_CHOICE + " ta so'z kerak");
        }

        // A review session is a fixed queue that ends by itself; only free practice can run forever.
        // A speed round runs against the clock, so it must never run out of questions.
        boolean unlimited = format == AnswerFormat.SPEED
                || (mode == QuizMode.ALL || mode == QuizMode.TODAY) && eligible.size() > UNLIMITED_THRESHOLD;
        QuizSession session = new QuizSession(owner, mode, format, unlimited, eligible.size());

        Word firstWord;
        if (unlimited) {
            firstWord = reviewService.pickWeighted(username, eligible);
        } else {
            List<Word> shuffled = new ArrayList<>(eligible);
            Collections.shuffle(shuffled);
            firstWord = shuffled.get(0);
            for (int i = 1; i < shuffled.size(); i++) {
                session.getRemainingQueue().add(shuffled.get(i).getId());
            }
        }

        PromptType promptType = pickPromptType(format, firstWord);
        AnswerField answerField = pickAnswerField(format, promptType);
        session.setCurrentQuestion(firstWord.getId(), promptType, answerField);

        quizSessionRepository.save(session);

        return new QuizQuestionResponse(session.getId(), promptTypeName(promptType),
                textFor(firstWord, promptType), progressOf(session), optionsFor(session, firstWord, answerField));
    }

    @Transactional
    public QuizAnswerResultResponse submitAnswer(String username, Long sessionId, String answer) {
        QuizSession session = findOwnedSession(username, sessionId);
        if (session.getStatus() == QuizStatus.FINISHED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Quiz session has already finished");
        }

        Word currentWord = wordRepository.findById(session.getCurrentWordId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "The current word no longer exists"));

        String expectedAnswer = textFor(currentWord, session.getCurrentAnswerField());
        AnswerMatcher.Result match = AnswerMatcher.match(answer, expectedAnswer);
        // A near-miss is a different option in a multiple-choice question, never a typo of the right one.
        if (session.getAnswerFormat().hasOptions() && match == AnswerMatcher.Result.TYPO) {
            match = AnswerMatcher.Result.WRONG;
        }
        boolean correct = match.isCorrect();
        ReviewScheduler.Outcome outcome = switch (match) {
            case EXACT -> ReviewScheduler.Outcome.CORRECT;
            case TYPO -> ReviewScheduler.Outcome.TYPO;
            case WRONG -> ReviewScheduler.Outcome.WRONG;
        };
        String answeredPromptType = promptTypeName(session.getCurrentPromptType());
        session.recordAnswer(correct);
        int xpGained = reviewService.recordAnswer(session.getOwner(), currentWord, outcome, session.getCurrentPromptType(),
                session.getAnswerFormat());
        if (!correct && session.getMode() == QuizMode.DUE) {
            session.queueRetry(currentWord.getId());
        }

        Word nextWord = pickNextWord(session);
        String nextPromptType = null;
        String nextPromptText = null;
        List<String> nextOptions = null;

        if (nextWord == null) {
            session.finish();
        } else {
            PromptType promptType = pickPromptType(session.getAnswerFormat(), nextWord);
            AnswerField answerField = pickAnswerField(session.getAnswerFormat(), promptType);
            session.setCurrentQuestion(nextWord.getId(), promptType, answerField);
            nextPromptType = promptTypeName(promptType);
            nextPromptText = textFor(nextWord, promptType);
            nextOptions = optionsFor(session, nextWord, answerField);
        }

        return new QuizAnswerResultResponse(correct, match == AnswerMatcher.Result.TYPO, expectedAnswer, answeredPromptType,
                progressOf(session), nextPromptType, nextPromptText, nextOptions, xpGained);
    }

    @Transactional
    public QuizSummaryResponse finishQuiz(String username, Long sessionId) {
        QuizSession session = findOwnedSession(username, sessionId);
        if (session.getStatus() == QuizStatus.IN_PROGRESS) {
            session.finish();
        }
        return summaryOf(session);
    }

    private QuizSession findOwnedSession(String username, Long sessionId) {
        return quizSessionRepository.findByIdAndOwnerUsername(sessionId, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz session not found"));
    }

    /** Picks the word for the next question, or {@code null} if the session is exhausted. */
    private Word pickNextWord(QuizSession session) {
        if (!session.isUnlimited()) {
            List<Long> queue = session.getRemainingQueue();
            while (!queue.isEmpty()) {
                Long nextId = queue.remove(0);
                Optional<Word> word = wordRepository.findById(nextId);
                if (word.isPresent()) {
                    return word.get();
                }
                // Word was deleted mid-session; skip it and try the next one in the queue.
            }
            return null;
        }

        List<Word> pool = eligibleWords(session.getOwner().getUsername(), session.getMode());
        if (pool.isEmpty()) {
            return null;
        }
        return reviewService.pickWeighted(session.getOwner().getUsername(), pool);
    }

    private List<Word> eligibleWords(String username, QuizMode mode) {
        if (mode == QuizMode.TODAY) {
            Instant startOfToday = LocalDate.now(ZoneId.systemDefault()).atStartOfDay(ZoneId.systemDefault()).toInstant();
            return wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, startOfToday);
        }
        if (mode == QuizMode.DUE) {
            return reviewService.reviewQueue(username);
        }
        if (mode == QuizMode.WEAK) {
            return reviewService.weakWords(username);
        }
        if (mode == QuizMode.FAVORITES) {
            return wordRepository.findByOwnerUsernameAndFavoriteTrueOrderByCreatedAtDesc(username);
        }
        return wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username);
    }

    /** Dictation always speaks the English word; the client hides its text and reads it aloud. */
    private PromptType pickPromptType(AnswerFormat format, Word word) {
        return format == AnswerFormat.LISTENING ? PromptType.ENGLISH : pickPromptType(word);
    }

    private AnswerField pickAnswerField(AnswerFormat format, PromptType promptType) {
        return format == AnswerFormat.LISTENING ? AnswerField.ENGLISH : pickAnswerField(promptType);
    }

    /** Randomly picks what to show as the question; DEFINITION is only eligible when the word has one. */
    private PromptType pickPromptType(Word word) {
        List<PromptType> candidates = new ArrayList<>();
        candidates.add(PromptType.ENGLISH);
        candidates.add(PromptType.UZBEK);
        if (word.getDefinition() != null) {
            candidates.add(PromptType.DEFINITION);
        }
        return candidates.get(ThreadLocalRandom.current().nextInt(candidates.size()));
    }

    /**
     * Picks what the user must answer with. Never DEFINITION: if the prompt itself is
     * english/uzbek, the answer is forced to the other one; if the prompt is the
     * definition, either english or uzbek is accepted at random.
     */
    private AnswerField pickAnswerField(PromptType promptType) {
        return switch (promptType) {
            case ENGLISH -> AnswerField.UZBEK;
            case UZBEK -> AnswerField.ENGLISH;
            case DEFINITION -> ThreadLocalRandom.current().nextBoolean() ? AnswerField.ENGLISH : AnswerField.UZBEK;
        };
    }

    /** The shuffled choices (right answer plus look-alike wrong ones) for a multiple-choice session, else null. */
    private List<String> optionsFor(QuizSession session, Word word, AnswerField field) {
        if (!session.getAnswerFormat().hasOptions()) {
            return null;
        }
        String correct = textFor(word, field);
        List<String> pool = wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(session.getOwner().getUsername())
                .stream()
                .filter(w -> !w.getId().equals(word.getId()))
                .map(w -> textFor(w, field))
                .toList();
        List<String> options = new ArrayList<>(
                DistractorPicker.pick(correct, pool, CHOICE_OPTIONS - 1, ThreadLocalRandom.current()));
        options.add(correct);
        Collections.shuffle(options);
        return options;
    }

    private String textFor(Word word, PromptType type) {
        return switch (type) {
            case ENGLISH -> word.getEnglish();
            case UZBEK -> word.getUzbek();
            case DEFINITION -> word.getDefinition();
        };
    }

    private String textFor(Word word, AnswerField field) {
        return switch (field) {
            case ENGLISH -> word.getEnglish();
            case UZBEK -> word.getUzbek();
        };
    }

    private String promptTypeName(PromptType promptType) {
        return promptType.name().toLowerCase(Locale.ROOT);
    }

    private QuizProgressResponse progressOf(QuizSession session) {
        return new QuizProgressResponse(
                session.getAnsweredCount(),
                session.getCorrectCount(),
                session.getIncorrectCount(),
                session.getTotalWords(),
                session.isUnlimited(),
                session.getStatus() == QuizStatus.FINISHED);
    }

    private QuizSummaryResponse summaryOf(QuizSession session) {
        return new QuizSummaryResponse(
                session.getId(),
                session.getMode(),
                session.getAnsweredCount(),
                session.getCorrectCount(),
                session.getIncorrectCount(),
                session.getStartedAt(),
                session.getFinishedAt());
    }
}
