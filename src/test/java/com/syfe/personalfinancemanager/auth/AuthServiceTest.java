package com.syfe.personalfinancemanager.auth;

import com.syfe.personalfinancemanager.auth.dto.RegisterRequest;
import com.syfe.personalfinancemanager.common.exception.DuplicateResourceException;
import com.syfe.personalfinancemanager.user.User;
import com.syfe.personalfinancemanager.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private AuthService authService;

    private RegisterRequest request() {
        return new RegisterRequest("darsh@example.com", "password123", "Darsh Dave", "+919876543210");
    }

    @Test
    @DisplayName("hashes the password and never stores plaintext")
    void hashesPassword() {
        when(userRepository.existsByUsername("darsh@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class)))
                .thenAnswer(inv -> { User u = inv.getArgument(0); u.setId(1L); return u; });

        Long id = authService.register(request());

        assertThat(id).isEqualTo(1L);
        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertThat(saved.getValue().getPassword()).isEqualTo("$2a$hashed");
        assertThat(saved.getValue().getPassword()).isNotEqualTo("password123");
    }

    @Test
    @DisplayName("a taken username is a 409 conflict, and nothing is saved")
    void rejectsDuplicateUsername() {
        when(userRepository.existsByUsername("darsh@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request()))
                .isInstanceOf(DuplicateResourceException.class);

        verify(userRepository, never()).save(any());
    }
}
