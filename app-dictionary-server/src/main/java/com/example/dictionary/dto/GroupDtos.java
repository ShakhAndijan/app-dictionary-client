package com.example.dictionary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

/** Request and response shapes of the study-group endpoints. */
public final class GroupDtos {

    private GroupDtos() {
    }

    public record CreateGroupRequest(
            @NotBlank @Size(max = 40) String name,
            @Size(max = 8) String emoji
    ) {
    }

    public record JoinGroupRequest(@NotBlank @Size(max = 20) String code) {
    }

    public record GroupSummaryResponse(
            Long id,
            String name,
            String emoji,
            int memberCount,
            boolean ownedByMe
    ) {
    }

    /** {@code weekXp} resets every Monday; {@code totalXp} is all-time. {@code me} marks the caller's own row. */
    public record MemberResponse(
            Long userId,
            String name,
            String username,
            int level,
            String levelTitle,
            long weekXp,
            long totalXp,
            boolean me,
            boolean owner
    ) {
    }

    /** Members come sorted by {@code weekXp}, highest first. */
    public record GroupDetailResponse(
            Long id,
            String name,
            String emoji,
            String inviteCode,
            boolean ownedByMe,
            LocalDate weekStart,
            List<MemberResponse> members
    ) {
    }
}
