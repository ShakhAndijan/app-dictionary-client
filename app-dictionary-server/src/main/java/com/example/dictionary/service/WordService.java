package com.example.dictionary.service;

import com.example.dictionary.dto.AddWordRequest;
import com.example.dictionary.dto.UpdateWordRequest;
import com.example.dictionary.dto.WordImagePayload;
import com.example.dictionary.dto.WordResponse;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.Word;
import com.example.dictionary.model.WordImage;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordImageRepository;
import com.example.dictionary.repository.WordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class WordService {

    private static final int MAX_IMAGE_BYTES = 1_000_000;
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final WordRepository wordRepository;
    private final UserRepository userRepository;
    private final ReviewService reviewService;
    private final WordImageRepository imageRepository;

    public WordService(WordRepository wordRepository, UserRepository userRepository, ReviewService reviewService,
                       WordImageRepository imageRepository) {
        this.imageRepository = imageRepository;
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
    }

    /** Adds a new word owned by the given username. */
    @Transactional
    public WordResponse addWord(String username, AddWordRequest request) {
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Word word = new Word(request.english(), request.uzbek(), blankToNull(request.definition()), owner);
        wordRepository.save(word);

        return WordResponse.from(word, WordInsight.UNSEEN);
    }

    /** Lists the given username's words, most recently added first. */
    public List<WordResponse> listWords(String username) {
        Map<Long, WordInsight> insights = reviewService.insightsByWordId(username);
        return wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username).stream()
                .map(w -> WordResponse.from(w, insights.getOrDefault(w.getId(), WordInsight.UNSEEN)))
                .toList();
    }

    /** Updates only the non-null fields of a word owned by the given username. */
    @Transactional
    public WordResponse updateWord(String username, Long id, UpdateWordRequest request) {
        Word word = findOwnedWord(username, id);

        if (request.english() != null) {
            word.setEnglish(request.english());
        }
        if (request.uzbek() != null) {
            word.setUzbek(request.uzbek());
        }
        if (request.definition() != null) {
            word.setDefinition(blankToNull(request.definition()));
        }
        if (request.favorite() != null) {
            word.setFavorite(request.favorite());
        }

        WordInsight insight = reviewService.insightsByWordId(username).getOrDefault(word.getId(), WordInsight.UNSEEN);
        return WordResponse.from(word, insight);
    }

    /** Deletes a word owned by the given username. */
    @Transactional
    public void deleteWord(String username, Long id) {
        Word word = findOwnedWord(username, id);
        wordRepository.delete(word);
    }

    /** Attaches (or replaces) the word's picture. */
    @Transactional
    public WordResponse setImage(String username, Long id, WordImagePayload payload) {
        Word word = findOwnedWord(username, id);
        String type = payload.contentType().toLowerCase();
        if (!ALLOWED_IMAGE_TYPES.contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported image type");
        }
        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(payload.data());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image is not valid base64");
        }
        if (bytes.length == 0 || bytes.length > MAX_IMAGE_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image must be between 1 byte and 1 MB");
        }
        WordImage image = imageRepository.findById(word.getId()).orElse(null);
        if (image == null) {
            imageRepository.save(new WordImage(word, type, bytes));
        } else {
            image.replace(type, bytes);
        }
        word.setImageVersion(System.currentTimeMillis());
        return toResponse(username, word);
    }

    @Transactional(readOnly = true)
    public WordImagePayload getImage(String username, Long id) {
        Word word = findOwnedWord(username, id);
        WordImage image = imageRepository.findById(word.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Word has no image"));
        return new WordImagePayload(image.getContentType(), Base64.getEncoder().encodeToString(image.getData()));
    }

    @Transactional
    public WordResponse deleteImage(String username, Long id) {
        Word word = findOwnedWord(username, id);
        imageRepository.deleteById(word.getId());
        word.setImageVersion(null);
        return toResponse(username, word);
    }

    /** Converts the given words to API responses, attaching each one's learning state. */
    public List<WordResponse> toResponses(String username, List<Word> words) {
        Map<Long, WordInsight> insights = reviewService.insightsByWordId(username);
        return words.stream()
                .map(w -> WordResponse.from(w, insights.getOrDefault(w.getId(), WordInsight.UNSEEN)))
                .toList();
    }

    private WordResponse toResponse(String username, Word word) {
        WordInsight insight = reviewService.insightsByWordId(username).getOrDefault(word.getId(), WordInsight.UNSEEN);
        return WordResponse.from(word, insight);
    }

    private Word findOwnedWord(String username, Long id) {
        return wordRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Word not found"));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
