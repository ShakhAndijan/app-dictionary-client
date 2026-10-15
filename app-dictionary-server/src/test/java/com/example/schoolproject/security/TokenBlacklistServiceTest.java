package com.example.schoolproject.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TokenBlacklistServiceTest {

    private final TokenBlacklistService blacklist = new TokenBlacklistService();

    @Test
    void tokenIsNotBlacklistedByDefault() {
        assertThat(blacklist.isBlacklisted("token-a")).isFalse();
    }

    @Test
    void blacklistedTokenIsReported() {
        blacklist.blacklist("token-a");

        assertThat(blacklist.isBlacklisted("token-a")).isTrue();
    }

    @Test
    void blacklistingOneTokenDoesNotAffectOthers() {
        blacklist.blacklist("token-a");

        assertThat(blacklist.isBlacklisted("token-b")).isFalse();
    }
}
