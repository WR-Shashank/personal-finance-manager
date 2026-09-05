package com.syfe.personalfinancemanager.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Login payload.
 *
 * @param username email address used at registration
 * @param password plaintext password to verify against the stored hash
 */
public record LoginRequest(

        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        String password) {
}
