package com.syfe.personalfinancemanager.transaction;

import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;

import java.time.LocalDate;

/**
 * The optional criteria a transaction listing can be narrowed by.
 * <p>
 * Grouping them into one object keeps the controller signature short and gives
 * the cross-field rule — start before end — a single place to live.
 *
 * @param startDate  inclusive lower bound, or null
 * @param endDate    inclusive upper bound, or null
 * @param categoryId restrict to one category, or null
 * @param type       restrict to INCOME or EXPENSE, or null
 */
public record TransactionFilter(LocalDate startDate,
                                LocalDate endDate,
                                Long categoryId,
                                TransactionType type) {

    public TransactionFilter {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new BusinessRuleException("startDate must not be after endDate");
        }
    }
}
