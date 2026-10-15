package com.example.schoolproject.service;

import com.example.schoolproject.dto.QuizAnswerResultResponse;
import com.example.schoolproject.dto.QuizProgressResponse;
import com.example.schoolproject.dto.QuizQuestionResponse;
import com.example.schoolproject.dto.QuizSummaryResponse;
import com.example.schoolproject.model.AnswerField;
import com.example.schoolproject.model.AppUser;
import com.example.schoolproject.model.PromptType;
import com.example.schoolproject.model.QuizMode;
import com.example.schoolproject.model.QuizSession;
import com.example.schoolproject.model.QuizStatus;
import com.example.schoolproject.model.Word;
import com.example.schoolproject.repository.QuizSessionRepository;
import com.example.schoolproject.repository.UserRepository;
import com.example.schoolproject.repository.WordRepository;
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

    private final QuizSessionRepository quizSessionRepository;
    private final WordRepository wordRepository;
    private final UserRepository userRepository;

    public QuizService(QuizSessionRepository quizSessionRepository,
                        WordRepository wordRepository,
                        UserRepository userRepository) {
        this.quizSessionRepository = quizSessionRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public QuizQuestionResponse startQuiz(String username, QuizMode mode) {
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<Word> eligible = eligibleWords(username, mode);
        if (eligible.isEmpty()) {
            String message = mode == QuizMode.TODAY
                    ? "Bugun hech qanday so'z qo'shilmagan"
                    : "Baholash uchun so'zlar mavjud emas";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }

        boolean unlimited = eligible.size() > UNLIMITED_THRESHOLD;
        QuizSession session = new QuizSession(owner, mode, unlimited, eligible.size());

        Word firstWord;
        if (unlimited) {
            firstWord = eligible.get(ThreadLocalRandom.current().nextInt(eligible.size()));
        } else {
            List<Word> shuffled = new ArrayList<>(eligible);
            Collections.shuffle(shuffled);
            firstWord = shuffled.get(0);
            for (int i = 1; i < shuffled.size(); i++) {
                session.getRemainingQueue().add(shuffled.get(i).getId());
            }
        }

        PromptType promptType = pickPromptType(firstWord);
        AnswerField answerField = pickAnswerField(promptType);
        session.setCurrentQuestion(firstWord.getId(), promptType, answerField);

        quizSessionRepository.save(session);

        return new QuizQuestionResponse(session.getId(), promptTypeName(promptType),
                textFor(firstWord, promptType), progressOf(session));
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
        boolean correct = normalize(answer).equals(normalize(expectedAnswer));
        String answeredPromptType = promptTypeName(session.getCurrentPromptType());
        session.recordAnswer(correct);

        Word nextWord = pickNextWord(session);
        String nextPromptType = null;
        String nextPromptText = null;

        if (nextWord == null) {
            session.finish();
        } else {
            PromptType promptType = pickPromptType(nextWord);
            AnswerField answerField = pickAnswerField(promptType);
            session.setCurrentQuestion(nextWord.getId(), promptType, answerField);
            nextPromptType = promptTypeName(promptType);
            nextPromptText = textFor(nextWord, promptType);
        }

        return new QuizAnswerResultResponse(correct, expectedAnswer, answeredPromptType,
                progressOf(session), nextPromptType, nextPromptText);
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
        return pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
    }

    private List<Word> eligibleWords(String username, QuizMode mode) {
        if (mode == QuizMode.TODAY) {
            Instant startOfToday = LocalDate.now(ZoneId.systemDefault()).atStartOfDay(ZoneId.systemDefault()).toInstant();
            return wordRepository.findByOwnerUsernameAndCreatedAtGreaterThanEqual(username, startOfToday);
        }
        return wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username);
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

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
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
