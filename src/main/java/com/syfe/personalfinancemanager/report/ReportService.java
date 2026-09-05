package com.syfe.personalfinancemanager.report;

import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.report.dto.MonthlyReportResponse;
import com.syfe.personalfinancemanager.report.dto.YearlyReportResponse;
import com.syfe.personalfinancemanager.transaction.TransactionRepository;
import com.syfe.personalfinancemanager.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Monthly and yearly reporting.
 * <p>
 * Monthly and yearly differ only in the date range they cover, so both delegate
 * to one aggregation routine. Grouping happens in SQL rather than by streaming
 * a year of rows into memory and folding them here.
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private static final int MIN_YEAR = 1900;
    private static final int MAX_YEAR = 2999;

    private final TransactionRepository transactionRepository;
    private final CurrentUser currentUser;

    @Transactional(readOnly = true)
    public MonthlyReportResponse monthly(int year, int month) {
        requireValidYear(year);
        if (month < 1 || month > 12) {
            throw new BusinessRuleException("Month must be between 1 and 12");
        }

        YearMonth period = YearMonth.of(year, month);
        Totals totals = totalsBetween(period.atDay(1), period.atEndOfMonth());

        return new MonthlyReportResponse(month, year, totals.income(), totals.expenses(), totals.net());
    }

    @Transactional(readOnly = true)
    public YearlyReportResponse yearly(int year) {
        requireValidYear(year);

        Totals totals = totalsBetween(LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31));

        return new YearlyReportResponse(year, totals.income(), totals.expenses(), totals.net());
    }

    private Totals totalsBetween(LocalDate from, LocalDate to) {
        Long userId = currentUser.id();

        Map<String, BigDecimal> income = groupByCategory(userId, TransactionType.INCOME, from, to);
        Map<String, BigDecimal> expenses = groupByCategory(userId, TransactionType.EXPENSE, from, to);

        BigDecimal net = sum(income).subtract(sum(expenses));

        return new Totals(income, expenses, net);
    }

    private Map<String, BigDecimal> groupByCategory(Long userId, TransactionType type,
                                                    LocalDate from, LocalDate to) {
        List<Object[]> rows = transactionRepository.totalsByCategory(userId, type, from, to);

        // LinkedHashMap preserves the repository's ORDER BY, so the JSON key
        // order is deterministic across calls.
        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        for (Object[] row : rows) {
            totals.put((String) row[0], ((BigDecimal) row[1]).setScale(2, RoundingMode.HALF_UP));
        }
        return totals;
    }

    private BigDecimal sum(Map<String, BigDecimal> totals) {
        return totals.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /** Internal carrier so the two public methods share one aggregation path. */
    private record Totals(Map<String, BigDecimal> income,
                          Map<String, BigDecimal> expenses,
                          BigDecimal net) {
    }

    private void requireValidYear(int year) {
        if (year < MIN_YEAR || year > MAX_YEAR) {
            throw new BusinessRuleException("Year must be between " + MIN_YEAR + " and " + MAX_YEAR);
        }
    }
}
