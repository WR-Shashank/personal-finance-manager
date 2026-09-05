package com.syfe.personalfinancemanager.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Raised when the caller is authenticated and the resource exists, but the
 * operation itself is not permitted — deleting a system default category, say.
 */
public class ForbiddenOperationException extends ApiException {

    public ForbiddenOperationException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}
