package com.syfe.personalfinancemanager.goal.dto;

import com.syfe.personalfinancemanager.common.validation.FutureDate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload for amending a goal. Only the target amount and date are changeable;
 * the name and start date are fixed, because moving a start date would silently
 * rewrite every progress figure already reported against the goal.
 *
 * @param targetAmount new target, or null to keep the current one
 * @param targetDate   new deadline, or null to keep the current one
 */
public record UpdateGoalRequest(

        @DecimalMin(value = "0.01", message = "Target amount must be greater than zero")
        @Digits(integer = 13, fraction = 2, message = "Target amount may have at most two decimal places")
        BigDecimal targetAmount,

        @FutureDate(message = "Target date must be in the future")
        LocalDate targetDate) {
}
