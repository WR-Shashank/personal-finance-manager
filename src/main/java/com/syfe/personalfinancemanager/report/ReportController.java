package com.syfe.personalfinancemanager.report;

import com.syfe.personalfinancemanager.report.dto.MonthlyReportResponse;
import com.syfe.personalfinancemanager.report.dto.YearlyReportResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * GET /api/reports/monthly/{year}/{month}
 * GET /api/reports/yearly/{year}
 * </pre>
 *
 * The period is part of the path rather than a query string: a report for a
 * given month is a distinct resource, not a filtered view of a collection.
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/monthly/{year}/{month}")
    public MonthlyReportResponse monthly(@PathVariable int year, @PathVariable int month) {
        return reportService.monthly(year, month);
    }

    @GetMapping("/yearly/{year}")
    public YearlyReportResponse yearly(@PathVariable int year) {
        return reportService.yearly(year);
    }
}
