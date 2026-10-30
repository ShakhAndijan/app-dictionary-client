package com.example.dictionary.controller;

import com.example.dictionary.dto.GroupDtos.CreateGroupRequest;
import com.example.dictionary.dto.GroupDtos.GroupDetailResponse;
import com.example.dictionary.dto.GroupDtos.GroupSummaryResponse;
import com.example.dictionary.dto.GroupDtos.JoinGroupRequest;
import com.example.dictionary.service.GroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Groups", description = "Study groups with a friends' XP leaderboard")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @Operation(summary = "My groups")
    @GetMapping
    public ResponseEntity<List<GroupSummaryResponse>> list(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(groupService.list(principal.getUsername()));
    }

    @Operation(summary = "Create a group", description = "The caller becomes the owner and first member.")
    @PostMapping
    public ResponseEntity<GroupSummaryResponse> create(@AuthenticationPrincipal UserDetails principal,
                                                       @Valid @RequestBody CreateGroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.create(principal.getUsername(), request));
    }

    @Operation(summary = "Join a group with its invite code")
    @PostMapping("/join")
    public ResponseEntity<GroupSummaryResponse> join(@AuthenticationPrincipal UserDetails principal,
                                                     @Valid @RequestBody JoinGroupRequest request) {
        return ResponseEntity.ok(groupService.join(principal.getUsername(), request.code()));
    }

    @Operation(summary = "Group details and leaderboard",
            description = "Members sorted by this week's XP. Only members can see a group.")
    @GetMapping("/{id}")
    public ResponseEntity<GroupDetailResponse> detail(@AuthenticationPrincipal UserDetails principal,
                                                      @PathVariable Long id) {
        return ResponseEntity.ok(groupService.detail(principal.getUsername(), id));
    }

    @Operation(summary = "Leave a group")
    @DeleteMapping("/{id}/members/me")
    public ResponseEntity<Void> leave(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        groupService.leave(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Remove a member (owner only)")
    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id,
                                             @PathVariable Long userId) {
        groupService.removeMember(principal.getUsername(), id, userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a group (owner only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        groupService.delete(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
