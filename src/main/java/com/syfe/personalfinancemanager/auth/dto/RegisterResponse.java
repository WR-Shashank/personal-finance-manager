package com.syfe.personalfinancemanager.auth.dto;

/**
 * Returned on successful registration.
 *
 * @param message confirmation text
 * @param userId  id of the newly created account
 */
public record RegisterResponse(String message, Long userId) {
}
