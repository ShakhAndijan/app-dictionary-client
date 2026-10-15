package com.example.schoolproject.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/** Unit tests for the JWT mechanics (no Spring context needed). */
class JwtServiceTest {

    private static final String SECRET =
            "XOx00perpblMuNIUPDWvu4ZC3wuCmnCuB7rnYqalsLroCVYFsNS0CEfGot3Wlx8U";
    private static final String OTHER_SECRET =
            "gptkbhpHDoU+zZCE+nvsDtLOWOvKQAQLv4X2xZJxWtg+hIPzIf4TObmz6xvxCGDX";

    private final JwtService jwt = new JwtService(SECRET, 3_600_000L);

    @Test
    void generatesTokenAndReadsBackTheUsername() {
        String token = jwt.generateToken("ivan");

        assertThat(jwt.extractUsername(token)).isEqualTo("ivan");
        assertThat(jwt.isTokenValid(token)).isTrue();
    }

    @Test
    void reportsExpirationInSeconds() {
        assertThat(jwt.getExpirationSeconds()).isEqualTo(3_600L);
    }

    @Test
    void rejectsExpiredToken() {
        JwtService alreadyExpired = new JwtService(SECRET, -1_000L);
        String token = alreadyExpired.generateToken("ivan");

        assertThat(alreadyExpired.isTokenValid(token)).isFalse();
    }

    @Test
    void rejectsTamperedToken() {
        String token = jwt.generateToken("ivan");
        String tampered = token.substring(0, token.length() - 1) + (token.endsWith("a") ? "b" : "a");

        assertThat(jwt.isTokenValid(tampered)).isFalse();
    }

    @Test
    void rejectsTokenSignedWithAnotherKey() {
        JwtService other = new JwtService(OTHER_SECRET, 3_600_000L);
        String foreignToken = other.generateToken("ivan");

        assertThat(jwt.isTokenValid(foreignToken)).isFalse();
    }

    @Test
    void rejectsGarbageToken() {
        assertThat(jwt.isTokenValid("definitely-not-a-jwt")).isFalse();
    }
}
