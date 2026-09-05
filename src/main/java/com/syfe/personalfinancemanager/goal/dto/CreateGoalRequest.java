package com.syfe.personalfinancemanager.goal.dto;

import com.syfe.personalfinancemanager.common.validation.FutureDate;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Payload for creating a savings goal.
 *
 * @param goalName     descriptive label
 * @param targetAmount positive target
 * @param targetDate   must be after today
 * @param startDate    optional; defaults to today when omitted
 */
public record CreateGoalRequest(

        @NotBlank(message = "Goal name is required")
        @Size(max = 100, message = "Goal name must not exceed 100 characters")
        String goalName,

        @NotNull(message = "Target amount is required")
        @DecimalMin(value = "0.01", message = "Target amount must be greater than zero")
        @Digits(integer = 13, fraction = 2, message = "Target amount may have at most two decimal places")
        BigDecimal targetAmount,

        @NotNull(message = "Target date is required")
        @FutureDate(message = "Target date must be in the future")
        LocalDate targetDate,

        LocalDate startDate) {
}
