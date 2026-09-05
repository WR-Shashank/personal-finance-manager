package com.syfe.personalfinancemanager.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Registration payload. The username is the user's email address, per the API contract.
 *
 * @param username    email address, used as the login identifier
 * @param password    plaintext password; hashed before it reaches the database
 * @param fullName    display name
 * @param phoneNumber contact number, optionally prefixed with a country code
 */
public record RegisterRequest(

        @NotBlank(message = "Username is required")
        @Email(message = "Username must be a valid email address")
        @Size(max = 120, message = "Username must not exceed 120 characters")
        String username,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
        String password,

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must not exceed 100 characters")
        String fullName,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[0-9]{7,15}$",
                 message = "Phone number must be 7-15 digits, optionally prefixed with '+'")
        String phoneNumber) {
}
