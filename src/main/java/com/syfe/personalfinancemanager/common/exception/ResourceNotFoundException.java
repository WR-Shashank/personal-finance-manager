package com.syfe.personalfinancemanager.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Raised when a resource does not exist, or exists but belongs to another user.
 * <p>
 * Both cases return 404 on purpose: answering 403 for someone else's row would
 * confirm that the id exists, which leaks data across accounts.
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }

    public static ResourceNotFoundException of(String resource, Object id) {
        return new ResourceNotFoundException(resource + " not found: " + id);
    }
}
