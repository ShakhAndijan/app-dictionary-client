package com.example.dictionary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * One entry in an admin's private "saved messages" chat: text, a file (image, video, document) or both.
 * Only the owner ever sees it. The file itself lives on disk (see AdminNoteService); only its name is kept here.
 */
@Entity
@Table(name = "admin_notes", indexes = @Index(name = "idx_admin_note_owner", columnList = "owner, id"))
public class AdminNote {

    public enum Kind {
        NONE,
        IMAGE,
        VIDEO,
        FILE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String owner;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Kind kind = Kind.NONE;

    /** Name of the stored file inside the notes directory; null when the note has no attachment. */
    @Column(name = "stored_name", length = 80)
    private String storedName;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "content_type", length = 120)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "edited_at")
    private Instant editedAt;

    protected AdminNote() {
        // Required by JPA.
    }

    public AdminNote(String owner, String text) {
        this.owner = owner;
        this.text = text;
        this.createdAt = Instant.now();
    }

    public void attach(Kind kind, String storedName, String fileName, String contentType, long fileSize) {
        this.kind = kind;
        this.storedName = storedName;
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
    }

    public void editText(String text) {
        this.text = text;
        this.editedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getOwner() { return owner; }
    public String getText() { return text; }
    public Kind getKind() { return kind; }
    public String getStoredName() { return storedName; }
    public String getFileName() { return fileName; }
    public String getContentType() { return contentType; }
    public Long getFileSize() { return fileSize; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getEditedAt() { return editedAt; }
}
