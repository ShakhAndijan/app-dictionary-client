package com.example.dictionary.dto;

import com.example.dictionary.model.AnswerFormat;

/** All-time results for one answer format (typed, multiple choice, flashcard). */
public record FormatStatsResponse(
        AnswerFormat format,
        int total,
        int correct,
        double accuracyPercent
) {
}
