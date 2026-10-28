package com.example.dictionary.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

/**
 * Creates and verifies the signed JWTs handed out at login/registration.
 * Tokens are signed with HMAC-SHA using the Base64 secret from {@code app.jwt.secret}.
 */
@Service
public class JwtService {

    private static final String VERSION_CLAIM = "ver";

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String base64Secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
        this.expirationMs = expirationMs;
    }

    /** Issues an access token whose subject is the given username, stamped with the user's token version. */
    public String generateToken(String username, int tokenVersion) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(username)
                .claim(VERSION_CLAIM, tokenVersion)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(signingKey)
                .compact();
    }

    /** Username (subject) carried by the token. Throws if the token is invalid. */
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    /** Token version carried by the token, or -1 if it has none (so it can never match a user). */
    public int extractTokenVersion(String token) {
        Integer version = parseClaims(token).get(VERSION_CLAIM, Integer.class);
        return version == null ? -1 : version;
    }

    /** True only if the signature checks out and the token has not expired. */
    public boolean isTokenValid(String token) {
        try {
            return parseClaims(token).getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    public long getExpirationSeconds() {
        return expirationMs / 1000;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
