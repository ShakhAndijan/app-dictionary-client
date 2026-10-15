package com.example.schoolproject.security;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Remembers tokens that have been invalidated by an explicit logout.
 *
 * <p>A JWT is stateless, so it stays cryptographically valid until it expires.
 * To make logout take effect immediately we record the logged-out token here and
 * reject it in {@link JwtAuthenticationFilter}.
 *
 * <p>This in-memory store is fine for a single-instance app. In production you would
 * use a shared store (e.g. Redis) and let each entry expire at the token's own
 * expiry so the set cannot grow without bound.
 */
@Service
public class TokenBlacklistService {

    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    public void blacklist(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}
