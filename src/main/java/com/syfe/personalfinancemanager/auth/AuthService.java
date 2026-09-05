package com.syfe.personalfinancemanager.auth;

import com.syfe.personalfinancemanager.auth.dto.RegisterRequest;
import com.syfe.personalfinancemanager.common.exception.DuplicateResourceException;
import com.syfe.personalfinancemanager.user.User;
import com.syfe.personalfinancemanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Account creation. Session handling lives in {@link AuthController}, since it is
 * a servlet concern rather than a domain one.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates an account with a hashed password.
     *
     * @param request validated registration payload
     * @return the id of the new user
     * @throws DuplicateResourceException if the username is already taken
     */
    @Transactional
    public Long register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException(
                    "An account already exists for " + request.username());
        }

        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phoneNumber(request.phoneNumber())
                .build();

        return userRepository.save(user).getId();
    }
}
