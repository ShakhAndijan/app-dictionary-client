package com.example.dictionary.dto;

import com.example.dictionary.model.AnswerFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

/** Answers given without internet, uploaded later in one batch. */
public final class OfflineAnswerDtos {

    private OfflineAnswerDtos() {
    }

    /**
     * One answer. {@code clientId} is made up by the app and makes the upload safe to repeat: an answer whose
     * id was already stored is skipped. {@code format} is FLASHCARD (default), MATCHING or SPEED.
     */
    public record OfflineAnswer(
            @NotBlank @Size(max = 40) String clientId,
            @NotNull Long wordId,
            @NotNull Boolean known,
            AnswerFormat format,
            @NotNull Instant answeredAt
    ) {
    }

    public record OfflineAnswersRequest(@NotNull @Size(max = 500) List<@Valid OfflineAnswer> answers) {
    }

    /** {@code skipped} counts answers already uploaded before and answers for words that no longer exist. */
    public record OfflineAnswersResponse(int applied, int skipped) {
    }
}
