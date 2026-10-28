package com.example.dictionary.service;

import com.example.dictionary.dto.AuthResponse;
import com.example.dictionary.dto.LoginRequest;
import com.example.dictionary.dto.RegisterRequest;
import com.example.dictionary.model.AppUser;
import com.example.dictionary.repository.UserRepository;
import com.example.dictionary.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Unit tests for the registration/login rules, with all collaborators mocked. */
class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        authenticationManager = mock(AuthenticationManager.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, jwtService, refreshTokenService);
    }

    private RegisterRequest request(String username, String email) {
        return new RegisterRequest("Ivan", "Ivanov", email, username, "secret123");
    }

    private void stubSuccessfulSave(String username, String email) {
        when(userRepository.existsByUsername(username)).thenReturn(false);
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("HASH");
        when(jwtService.generateToken(username, 0)).thenReturn("TOKEN");
        when(refreshTokenService.issue(any())).thenReturn("REFRESH");
        when(jwtService.getExpirationSeconds()).thenReturn(3_600L);
    }

    @Test
    void registersAndHashesPassword() {
        stubSuccessfulSave("ivan", "ivan@example.com");

        AuthResponse response = authService.register(request("ivan", "ivan@example.com"));

        assertThat(response.token()).isEqualTo("TOKEN");
        assertThat(response.refreshToken()).isEqualTo("REFRESH");
        assertThat(response.username()).isEqualTo("ivan");

        ArgumentCaptor<AppUser> saved = ArgumentCaptor.forClass(AppUser.class);
        verify(userRepository).save(saved.capture());
        AppUser user = saved.getValue();
        assertThat(user.getUsername()).isEqualTo("ivan");
        assertThat(user.getPassword()).isEqualTo("HASH");
        assertThat(user.getFirstName()).isEqualTo("Ivan");
        assertThat(user.getLastName()).isEqualTo("Ivanov");
        assertThat(user.getEmail()).isEqualTo("ivan@example.com");
    }

    @Test
    void rejectsDuplicateUsername() {
        when(userRepository.existsByUsername("ivan")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request("ivan", "ivan@example.com")))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        verify(userRepository, never()).save(any());
    }

    @Test
    void rejectsDuplicateEmail() {
        when(userRepository.existsByUsername("ivan")).thenReturn(false);
        when(userRepository.existsByEmail("ivan@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request("ivan", "ivan@example.com")))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        verify(userRepository, never()).save(any());
    }

    @Test
    void loginReturnsTokenWhenAuthenticationSucceeds() {
        AppUser user = new AppUser("ivan", "HASH", "Ivan", "Ivanov", "ivan@example.com");
        when(userRepository.findByUsername("ivan")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("ivan", 0)).thenReturn("TOKEN");
        when(refreshTokenService.issue(any())).thenReturn("REFRESH");
        when(jwtService.getExpirationSeconds()).thenReturn(3_600L);

        AuthResponse response = authService.login(new LoginRequest("ivan", "secret123"));

        assertThat(response.token()).isEqualTo("TOKEN");
        assertThat(response.refreshToken()).isEqualTo("REFRESH");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginPropagatesBadCredentials() {
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad"));

        assertThatThrownBy(() -> authService.login(new LoginRequest("ivan", "wrong-pass")))
                .isInstanceOf(BadCredentialsException.class);
        verify(userRepository, never()).findByUsername(any());
    }
}
