package com.syfe.personalfinancemanager.report.dto;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Income and expense totals for a calendar year, broken down by category.
 *
 * @param year          four-digit year
 * @param totalIncome   income per category name
 * @param totalExpenses expenses per category name
 * @param netSavings    income minus expenses
 */
public record YearlyReportResponse(int year,
                                   Map<String, BigDecimal> totalIncome,
                                   Map<String, BigDecimal> totalExpenses,
                                   BigDecimal netSavings) {
}
