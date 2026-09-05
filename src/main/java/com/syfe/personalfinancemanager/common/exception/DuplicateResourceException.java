package com.syfe.personalfinancemanager.common.exception;

import org.springframework.http.HttpStatus;

/** Raised when a uniqueness rule is violated: duplicate username or category name. */
public class DuplicateResourceException extends ApiException {

    public DuplicateResourceException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
