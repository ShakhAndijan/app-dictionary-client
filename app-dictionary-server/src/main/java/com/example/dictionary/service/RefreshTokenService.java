package com.example.dictionary.service;

import com.example.dictionary.model.AppUser;
import com.example.dictionary.model.RefreshToken;
import com.example.dictionary.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

/**
 * Issues, rotates and revokes refresh tokens.
 *
 * <p>Every refresh token is single-use: {@link #rotate} marks it used and hands out a new one in
 * the same family. Presenting an already-used token means it was probably stolen, so the entire
 * family (that login's whole chain) is revoked.
 */
@Service
public class RefreshTokenService {

    private static final SecureRandom RANDOM = new SecureRandom();

    /** The owner of a rotated token together with the freshly issued raw refresh token. */
    public record Rotation(AppUser owner, String refreshToken) {
    }

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshExpirationMs;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    /** Starts a new token family (a fresh login) and returns the raw token to give to the client. */
    @Transactional
    public String issue(AppUser owner) {
        return create(owner, UUID.randomUUID().toString());
    }

    /**
     * Exchanges a valid refresh token for a new one. The reuse-detection revocation must survive
     * the 401 that follows, hence {@code noRollbackFor}.
     */
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public Rotation rotate(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> unauthorized("Invalid refresh token"));

        if (token.isRevoked()) {
            refreshTokenRepository.revokeFamily(token.getFamilyId());
            throw unauthorized("Refresh token has already been used");
        }
        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw unauthorized("Refresh token has expired");
        }

        token.revoke();
        return new Rotation(token.getOwner(), create(token.getOwner(), token.getFamilyId()));
    }

    /** Ends the login session the given token belongs to (logout). Unknown tokens are ignored. */
    @Transactional
    public void revoke(String rawToken) {
        refreshTokenRepository.findByTokenHash(hash(rawToken))
                .ifPresent(token -> refreshTokenRepository.revokeFamily(token.getFamilyId()));
    }

    /** Ends every login session of the user (e.g. after a password change). */
    @Transactional
    public void revokeAll(AppUser owner) {
        refreshTokenRepository.revokeAllByOwner(owner);
    }

    /** Hourly housekeeping so expired rows do not pile up. */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void purgeExpired() {
        refreshTokenRepository.deleteExpired(Instant.now());
    }

    private String create(AppUser owner, String familyId) {
        byte[] bytes = new byte[48];
        RANDOM.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        refreshTokenRepository.save(new RefreshToken(
                hash(rawToken), owner, familyId, Instant.now().plusMillis(refreshExpirationMs)));
        return rawToken;
    }

    private static String hash(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }

    private static ResponseStatusException unauthorized(String message) {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, message);
    }
}
