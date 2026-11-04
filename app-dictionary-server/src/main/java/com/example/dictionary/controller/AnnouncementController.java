package com.example.dictionary.controller;

import com.example.dictionary.dto.AdminDtos.AnnouncementResponse;
import com.example.dictionary.repository.AnnouncementRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Announcements", description = "Notices from the admins, shown inside the apps")
public class AnnouncementController {

    private static final int SHOWN = 5;

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Operation(summary = "Current announcements", description = "The latest notices, newest first.")
    @GetMapping
    public ResponseEntity<List<AnnouncementResponse>> current() {
        return ResponseEntity.ok(announcementRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, SHOWN))
                .stream().map(AnnouncementResponse::from).toList());
    }
}
