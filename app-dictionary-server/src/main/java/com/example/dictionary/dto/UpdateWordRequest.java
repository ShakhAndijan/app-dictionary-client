package com.example.dictionary.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Partial-update payload for a word: any field left {@code null} is left unchanged. */
public record UpdateWordRequest(

        @Schema(example = "apple")
        String english,

        @Schema(example = "olma")
        String uzbek,

        @Schema(example = "A round fruit with red or green skin.")
        String definition,

        @Schema(description = "true = add to favourites, false = remove; omit to leave unchanged")
        Boolean favorite
) {
}
