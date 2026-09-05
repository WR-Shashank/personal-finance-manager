package com.syfe.personalfinancemanager.report;

import com.syfe.personalfinancemanager.common.TransactionType;
import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.report.dto.MonthlyReportResponse;
import com.syfe.personalfinancemanager.report.dto.YearlyReportResponse;
import com.syfe.personalfinancemanager.transaction.TransactionRepository;
import com.syfe.personalfinancemanager.user.CurrentUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    private static final Long USER_ID = 2L;

    @Mock private TransactionRepository transactionRepository;
    @Mock private CurrentUser currentUser;

    private ReportService service;

    @BeforeEach
    void setUp() {
        service = new ReportService(transactionRepository, currentUser);
        lenient().when(currentUser.id()).thenReturn(USER_ID);
    }

    @Test
    @DisplayName("monthly report groups by category and computes net savings")
    void monthlyReport() {
        LocalDate from = LocalDate.of(2024, 1, 1);
        LocalDate to = LocalDate.of(2024, 1, 31);
        when(transactionRepository.totalsByCategory(eq(USER_ID), eq(TransactionType.INCOME), eq(from), eq(to)))
                .thenReturn(List.of(new Object[]{"Salary", new BigDecimal("3000.00")}));
        when(transactionRepository.totalsByCategory(eq(USER_ID), eq(TransactionType.EXPENSE), eq(from), eq(to)))
                .thenReturn(List.of(
                        new Object[]{"Food", new BigDecimal("400.00")},
                        new Object[]{"Rent", new BigDecimal("1200.00")}));

        MonthlyReportResponse res = service.monthly(2024, 1);

        assertThat(res.month()).isEqualTo(1);
        assertThat(res.year()).isEqualTo(2024);
        assertThat(res.totalIncome()).containsEntry("Salary", new BigDecimal("3000.00"));
        assertThat(res.totalExpenses()).containsKeys("Food", "Rent");
        assertThat(res.netSavings()).isEqualByComparingTo("1400.00");
    }

    @Test
    @DisplayName("yearly report spans the whole year")
    void yearlyReport() {
        when(transactionRepository.totalsByCategory(eq(USER_ID), eq(TransactionType.INCOME), any(), any()))
                .thenReturn(List.of(new Object[]{"Salary", new BigDecimal("36000.00")}));
        when(transactionRepository.totalsByCategory(eq(USER_ID), eq(TransactionType.EXPENSE), any(), any()))
                .thenReturn(List.of(new Object[]{"Rent", new BigDecimal("14400.00")}));

        YearlyReportResponse res = service.yearly(2024);

        assertThat(res.year()).isEqualTo(2024);
        assertThat(res.netSavings()).isEqualByComparingTo("21600.00");
    }

    @Test
    @DisplayName("an out-of-range month is a bad request")
    void rejectsBadMonth() {
        assertThatThrownBy(() -> service.monthly(2024, 13)).isInstanceOf(BusinessRuleException.class);
    }

    @Test
    @DisplayName("an out-of-range year is a bad request")
    void rejectsBadYear() {
        assertThatThrownBy(() -> service.yearly(1000)).isInstanceOf(BusinessRuleException.class);
    }
}
