package com.syfe.personalfinancemanager.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Payload for amending a transaction. Every field is optional; a null field is
 * left untouched.
 * <p>
 * There is deliberately no {@code date} here. The contract forbids changing the
 * date, and the cleanest way to enforce that is to give the client nowhere to
 * put one — a rule expressed in the type is a rule that cannot be forgotten in
 * a service method later.
 *
 * @param amount      new amount, or null to keep the current one
 * @param category    new category name, or null to keep the current one
 * @param description new description, or null to keep the current one
 */
public record UpdateTransactionRequest(

        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        @Digits(integer = 13, fraction = 2, message = "Amount may have at most two decimal places")
        BigDecimal amount,

        String category,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description) {
}
