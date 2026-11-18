package com.example.dictionary.controller;

import com.example.dictionary.model.AdminNote;
import com.example.dictionary.service.AdminNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.TimeUnit;

/** The admin's private "saved messages" chat. Every call only touches the signed-in admin's own notes. */
@RestController
@RequestMapping("/api/admin/notes")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin notes", description = "Private saved-messages chat of an admin; ADMIN role only")
public class AdminNoteController {

    public record NoteResponse(Long id, String text, String kind, String fileName, String contentType, Long fileSize,
                               String fileUrl, Instant createdAt, Instant editedAt) {
    }

    public record EditRequest(String text) {
    }

    private final AdminNoteService service;

    public AdminNoteController(AdminNoteService service) {
        this.service = service;
    }

    @Operation(summary = "Newest notes first", description = "At most `limit` (1-100) notes older than `before` (note id).")
    @GetMapping
    public List<NoteResponse> list(@AuthenticationPrincipal UserDetails admin,
                                   @RequestParam(required = false) Long before,
                                   @RequestParam(defaultValue = "40") int limit) {
        return service.list(admin.getUsername(), before, limit).stream().map(this::view).toList();
    }

    @Operation(summary = "Add a note", description = "Multipart: optional `text` and optional `file` (at least one).")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoteResponse> create(@AuthenticationPrincipal UserDetails admin,
                                               @RequestParam(required = false) String text,
                                               @RequestParam(required = false) MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(view(service.create(admin.getUsername(), text, file)));
    }

    @Operation(summary = "Edit the text of a note")
    @PutMapping("/{id}")
    public NoteResponse edit(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id,
                             @RequestBody EditRequest request) {
        return view(service.edit(admin.getUsername(), id, request.text()));
    }

    @Operation(summary = "Delete a note and its file")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails admin, @PathVariable Long id) {
        service.delete(admin.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    /**
     * The attachment. Public in SecurityConfig but only reachable with the signed exp/sig pair that the list call
     * hands out, so img and video tags (with seeking) work without headers.
     */
    @Operation(summary = "Attachment of a note (signed link)")
    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> file(@PathVariable Long id, @RequestParam long exp, @RequestParam String sig,
                                         @RequestParam(defaultValue = "false") boolean download) {
        AdminNote note = service.fileFor(id, exp, sig);
        Resource body = new FileSystemResource(service.pathOf(note));
        boolean inline = !download && (note.getKind() == AdminNote.Kind.IMAGE || note.getKind() == AdminNote.Kind.VIDEO);
        MediaType type;
        try {
            type = MediaType.parseMediaType(note.getContentType());
        } catch (Exception e) {
            type = MediaType.APPLICATION_OCTET_STREAM;
        }
        ContentDisposition disposition = (inline ? ContentDisposition.inline() : ContentDisposition.attachment())
                .filename(note.getFileName(), StandardCharsets.UTF_8).build();
        return ResponseEntity.ok()
                .contentType(type)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .header("X-Content-Type-Options", "nosniff")
                .header("Content-Security-Policy", "sandbox; default-src 'none'")
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePrivate())
                .body(body);
    }

    private NoteResponse view(AdminNote n) {
        return new NoteResponse(n.getId(), n.getText(), n.getKind().name(), n.getFileName(), n.getContentType(),
                n.getFileSize(), service.linkFor(n), n.getCreatedAt(), n.getEditedAt());
    }
}
