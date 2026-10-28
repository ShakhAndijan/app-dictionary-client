package com.example.dictionary.service;

import com.example.dictionary.dto.AddWordRequest;
import com.example.dictionary.dto.UpdateWordRequest;
import com.example.dictionary.dto.WordResponse;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.Word;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.repository.WordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WordService {

    private final WordRepository wordRepository;
    private final UserRepository userRepository;

    public WordService(WordRepository wordRepository, UserRepository userRepository) {
        this.wordRepository = wordRepository;
        this.userRepository = userRepository;
    }

    /** Adds a new word owned by the given username. */
    @Transactional
    public WordResponse addWord(String username, AddWordRequest request) {
        AppUser owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Word word = new Word(request.english(), request.uzbek(), blankToNull(request.definition()), owner);
        wordRepository.save(word);

        return WordResponse.from(word);
    }

    /** Lists the given username's words, most recently added first. */
    public List<WordResponse> listWords(String username) {
        return wordRepository.findByOwnerUsernameOrderByCreatedAtDesc(username).stream()
                .map(WordResponse::from)
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

        return WordResponse.from(word);
    }

    /** Deletes a word owned by the given username. */
    @Transactional
    public void deleteWord(String username, Long id) {
        Word word = findOwnedWord(username, id);
        wordRepository.delete(word);
    }

    private Word findOwnedWord(String username, Long id) {
        return wordRepository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Word not found"));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
