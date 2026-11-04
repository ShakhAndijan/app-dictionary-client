package com.example.dictionary.controller;

import com.example.dictionary.dto.AdminDtos.AnnouncementRequest;
import com.example.dictionary.dto.AdminDtos.AnnouncementResponse;
import com.example.dictionary.dto.AdminDtos.AuditEntry;
import com.example.dictionary.dto.AdminDtos.BlockRequest;
import com.example.dictionary.dto.AdminDtos.InsightsResponse;
import com.example.dictionary.dto.AdminDtos.OverviewResponse;
import com.example.dictionary.dto.AdminDtos.RoleRequest;
import com.example.dictionary.dto.AdminDtos.UpdateNamesRequest;
import com.example.dictionary.dto.AdminDtos.UserDetail;
import com.example.dictionary.dto.AdminDtos.UserRow;
import com.example.dictionary.service.AdminService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Admin-only (see {@code SecurityConfig}): how many people use the app, what they do, and account management. */
@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Usage statistics and account management; ADMIN role only")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Operation(summary = "Usage overview",
            description = "Account, activity and learning totals plus a signup/activity series for the last `days` days (7-90).")
    @GetMapping("/overview")
    public ResponseEntity<OverviewResponse> overview(@RequestParam(defaultValue = "14") int days) {
        return ResponseEntity.ok(adminService.overview(days));
    }

    @Operation(summary = "Insights",
            description = "Answers per format over the last `days` days, retention of older signups and the hardest words.")
    @GetMapping("/insights")
    public ResponseEntity<InsightsResponse> insights(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(adminService.insights(days));
    }

    @Operation(summary = "All users", description = "Every account with its own usage numbers.")
    @GetMapping("/users")
    public ResponseEntity<List<UserRow>> users() {
        return ResponseEntity.ok(adminService.users());
    }

    @Operation(summary = "One user's page", description = "Words, recent answers, this week's activity and achievements.")
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDetail> detail(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.detail(id));
    }

    @Operation(summary = "Rename a user", description = "Changes the first and last name of a regular account.")
    @PutMapping("/users/{id}")
    public ResponseEntity<UserRow> rename(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id,
                                          @Valid @RequestBody UpdateNamesRequest request) {
        return ResponseEntity.ok(adminService.updateNames(admin.getUsername(), id, request));
    }

    @Operation(summary = "Block or unblock a user",
            description = "A blocked user is signed out everywhere and cannot log in until unblocked.")
    @PutMapping("/users/{id}/blocked")
    public ResponseEntity<UserRow> block(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id,
                                         @RequestBody BlockRequest request) {
        return ResponseEntity.ok(adminService.setBlocked(admin.getUsername(), id, request.blocked()));
    }

    @Operation(summary = "Delete a user",
            description = "Permanently removes a regular account and all of its data. Admins must be demoted first.")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id) {
        adminService.deleteUser(admin.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Grant or remove the admin role",
            description = "You cannot change your own role, and the last admin cannot be removed.")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserRow> role(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id,
                                        @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(adminService.setRole(admin.getUsername(), id, request.role()));
    }

    @Operation(summary = "Announcements", description = "Notices every signed-in user currently sees.")
    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementResponse>> announcements() {
        return ResponseEntity.ok(adminService.announcements());
    }

    @Operation(summary = "Publish an announcement")
    @PostMapping("/announcements")
    public ResponseEntity<AnnouncementResponse> announce(@AuthenticationPrincipal UserDetails admin,
                                                         @Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.announce(admin.getUsername(), request));
    }

    @Operation(summary = "Delete an announcement")
    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id) {
        adminService.deleteAnnouncement(admin.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Audit trail", description = "Who changed what, newest first.")
    @GetMapping("/audit")
    public ResponseEntity<List<AuditEntry>> audit(@RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(adminService.audit(limit));
    }
}
