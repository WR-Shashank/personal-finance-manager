package com.syfe.personalfinancemanager.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

/**
 * The single error shape every failing endpoint returns.
 *
 * @param timestamp   when the failure happened
 * @param status      HTTP status, repeated in the body for clients that log bodies only
 * @param error       short reason phrase
 * @param message     human-readable description of what went wrong
 * @param fieldErrors per-field messages, present only for bean-validation failures
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors) {

    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(Instant.now(), status, error, message, null);
    }

    public static ErrorResponse withFields(int status, String error, String message,
                                           Map<String, String> fieldErrors) {
        return new ErrorResponse(Instant.now(), status, error, message, fieldErrors);
    }
}
