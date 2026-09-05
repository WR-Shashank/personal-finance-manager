package com.syfe.personalfinancemanager.goal.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** A goal together with its progress, recomputed at read time. */
public record GoalResponse(Long id,
                           String goalName,
                           BigDecimal targetAmount,
                           LocalDate targetDate,
                           LocalDate startDate,
                           BigDecimal currentProgress,
                           BigDecimal progressPercentage,
                           BigDecimal remainingAmount) {
}
