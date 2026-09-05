package com.syfe.personalfinancemanager.transaction.dto;

import com.syfe.personalfinancemanager.common.validation.NotFuture;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload for recording a transaction.
 * <p>
 * There is no {@code type} field: the type is a property of the category, and
 * deriving it server-side removes the possibility of an INCOME transaction
 * filed against an expense category.
 *
 * @param amount      positive, at most two decimal places
 * @param date        today or earlier
 * @param category    name of a default or the caller's own category
 * @param description optional free text
 */
public record CreateTransactionRequest(

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        @Digits(integer = 13, fraction = 2, message = "Amount may have at most two decimal places")
        BigDecimal amount,

        @NotNull(message = "Date is required")
        @NotFuture(message = "Date cannot be in the future")
        LocalDate date,

        @NotBlank(message = "Category is required")
        String category,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description) {
}
