package com.syfe.personalfinancemanager.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Raised when input is syntactically valid but breaks a domain rule — an expense
 * filed against an income category, a category that still has transactions.
 */
public class BusinessRuleException extends ApiException {

    public BusinessRuleException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
