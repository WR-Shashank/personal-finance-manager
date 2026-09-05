package com.syfe.personalfinancemanager.auth.dto;

/**
 * A bare {@code {"message": "..."}} body, used by endpoints whose only output
 * is confirmation that the operation succeeded.
 */
public record MessageResponse(String message) {
}
