package com.example.dictionary.service;

import com.example.dictionary.model.AdminNote;
import com.example.dictionary.model.AdminNote.Kind;
import com.example.dictionary.repository.AdminNoteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * The admin's private "saved messages": a chat with nobody else in it. Text and files (photos, videos, documents)
 * are stored per admin. Files are written to app.notes.dir; the browser loads them through signed links so a plain
 * img / video tag works without an Authorization header.
 */
@Service
public class AdminNoteService {

    public static final int MAX_TEXT = 8000;

    private final AdminNoteRepository notes;
    private final Path dir;
    private final byte[] secret;
    private final long linkSeconds;

    public AdminNoteService(AdminNoteRepository notes,
                            @Value("${app.notes.dir:${java.io.tmpdir}/dictionary-notes}") String dir,
                            @Value("${app.jwt.secret}") String jwtSecret,
                            @Value("${app.notes.link-hours:12}") long linkHours) {
        this.notes = notes;
        this.dir = Path.of(dir).toAbsolutePath().normalize();
        this.secret = jwtSecret.getBytes(StandardCharsets.UTF_8);
        this.linkSeconds = linkHours * 3600;
    }

    @Transactional(readOnly = true)
    public List<AdminNote> list(String owner, Long before, int limit) {
        PageRequest page = PageRequest.of(0, Math.min(Math.max(limit, 1), 100));
        return before == null
                ? notes.findByOwnerOrderByIdDesc(owner, page)
                : notes.findByOwnerAndIdLessThanOrderByIdDesc(owner, before, page);
    }

    @Transactional
    public AdminNote create(String owner, String text, MultipartFile file) {
        String body = text == null ? null : text.strip();
        if (body != null && body.isEmpty()) body = null;
        boolean hasFile = file != null && !file.isEmpty();
        if (body == null && !hasFile) throw bad("Matn yoki fayl kiriting");
        if (body != null && body.length() > MAX_TEXT) throw bad("Matn juda uzun");

        AdminNote note = new AdminNote(owner, body);
        if (hasFile) {
            String contentType = file.getContentType() == null ? "application/octet-stream" : file.getContentType();
            String original = cleanName(file.getOriginalFilename());
            String stored = UUID.randomUUID() + extension(original);
            try {
                Files.createDirectories(dir);
                try (InputStream in = file.getInputStream()) {
                    Files.copy(in, dir.resolve(stored), StandardCopyOption.REPLACE_EXISTING);
                }
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Faylni saqlab bo'lmadi");
            }
            note.attach(kindOf(contentType), stored, original, contentType, file.getSize());
        }
        return notes.save(note);
    }

    @Transactional
    public AdminNote edit(String owner, Long id, String text) {
        AdminNote note = find(owner, id);
        String body = text == null ? null : text.strip();
        if (body != null && body.isEmpty()) body = null;
        if (body == null && note.getStoredName() == null) throw bad("Matn bo'sh bo'lishi mumkin emas");
        if (body != null && body.length() > MAX_TEXT) throw bad("Matn juda uzun");
        note.editText(body);
        return note;
    }

    @Transactional
    public void delete(String owner, Long id) {
        AdminNote note = find(owner, id);
        notes.delete(note);
        if (note.getStoredName() != null) {
            try {
                Files.deleteIfExists(dir.resolve(note.getStoredName()));
            } catch (IOException ignored) {
                // The row is gone; a leftover file is harmless.
            }
        }
    }

    /** The note of a signed attachment link, after the signature and expiry have been checked. */
    @Transactional(readOnly = true)
    public AdminNote fileFor(Long id, long exp, String sig) {
        boolean valid = exp >= Instant.now().getEpochSecond()
                && MessageDigest.isEqual(sign(id, exp).getBytes(StandardCharsets.UTF_8),
                String.valueOf(sig).getBytes(StandardCharsets.UTF_8));
        if (!valid) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Havola yaroqsiz yoki muddati tugagan");
        AdminNote note = notes.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (note.getStoredName() == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return note;
    }

    public Path pathOf(AdminNote note) {
        Path p = dir.resolve(note.getStoredName()).normalize();
        if (!p.startsWith(dir) || !Files.isRegularFile(p)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return p;
    }

    /** Relative, signed URL (valid for app.notes.link-hours). */
    public String linkFor(AdminNote note) {
        if (note.getStoredName() == null) return null;
        long exp = Instant.now().getEpochSecond() + linkSeconds;
        return "/admin/notes/" + note.getId() + "/file?exp=" + exp + "&sig=" + sign(note.getId(), exp);
    }

    private AdminNote find(String owner, Long id) {
        return notes.findByIdAndOwner(id, owner).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private String sign(long id, long exp) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            byte[] raw = mac.doFinal(("note:" + id + ":" + exp).getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    static Kind kindOf(String contentType) {
        String t = contentType.toLowerCase(Locale.ROOT);
        if (t.startsWith("image/") && !t.contains("svg")) return Kind.IMAGE;
        if (t.startsWith("video/")) return Kind.VIDEO;
        return Kind.FILE;
    }

    private static String cleanName(String name) {
        String n = name == null ? "file" : name.replace('\\', '/');
        n = n.substring(n.lastIndexOf('/') + 1).strip();
        if (n.isEmpty()) n = "file";
        return n.length() > 200 ? n.substring(n.length() - 200) : n;
    }

    private static String extension(String name) {
        int dot = name.lastIndexOf('.');
        if (dot < 0 || name.length() - dot > 10) return "";
        String ext = name.substring(dot).toLowerCase(Locale.ROOT);
        return ext.matches("\\.[a-z0-9]{1,9}") ? ext : "";
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
