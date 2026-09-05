package com.syfe.personalfinancemanager.report.dto;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Income and expense totals for one calendar month, broken down by category.
 *
 * @param month         1-12
 * @param year          four-digit year
 * @param totalIncome   income per category name
 * @param totalExpenses expenses per category name
 * @param netSavings    income minus expenses
 */
public record MonthlyReportResponse(int month,
                                    int year,
                                    Map<String, BigDecimal> totalIncome,
                                    Map<String, BigDecimal> totalExpenses,
                                    BigDecimal netSavings) {
}
