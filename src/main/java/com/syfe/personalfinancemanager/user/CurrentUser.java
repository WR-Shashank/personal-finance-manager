package com.syfe.personalfinancemanager.user;

import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Single point of access to the authenticated user.
 * <p>
 * Services depend on this instead of reading {@code SecurityContextHolder}
 * directly, which keeps the static call out of the domain layer and means a
 * test can stub one collaborator rather than populate a thread-local.
 */
@Component
@RequiredArgsConstructor
public class CurrentUser {

    private final UserRepository userRepository;

    /** @return the authenticated user's id — the scope key for every query */
    public Long id() {
        return entity().getId();
    }

    /** @return the authenticated {@link User} row */
    public User entity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user no longer exists"));
    }
}
