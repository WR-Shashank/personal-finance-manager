package com.syfe.personalfinancemanager.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base type for every error this application raises deliberately.
 * <p>
 * Each subclass fixes its own HTTP status, so {@link GlobalExceptionHandler}
 * maps one type rather than a growing list of unrelated ones. A new failure
 * mode is a new subclass, not an edit to the handler.
 */
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;

    protected ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
