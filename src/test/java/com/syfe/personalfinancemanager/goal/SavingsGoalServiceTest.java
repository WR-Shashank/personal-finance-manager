package com.syfe.personalfinancemanager.goal;

import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import com.syfe.personalfinancemanager.goal.dto.CreateGoalRequest;
import com.syfe.personalfinancemanager.goal.dto.GoalResponse;
import com.syfe.personalfinancemanager.goal.dto.UpdateGoalRequest;
import com.syfe.personalfinancemanager.transaction.TransactionRepository;
import com.syfe.personalfinancemanager.user.CurrentUser;
import com.syfe.personalfinancemanager.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavingsGoalServiceTest {

    private static final Long USER_ID = 3L;
    private static final Clock FIXED =
            Clock.fixed(Instant.parse("2026-01-15T00:00:00Z"), ZoneOffset.UTC);
    private static final LocalDate TODAY = LocalDate.of(2026, 1, 15);

    @Mock private SavingsGoalRepository goalRepository;
    @Mock private TransactionRepository transactionRepository;
    @Mock private CurrentUser currentUser;

    private SavingsGoalService service;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder().id(USER_ID).username("darsh@example.com").build();
        service = new SavingsGoalService(goalRepository, transactionRepository, currentUser, FIXED);
    }

    @Test
    @DisplayName("start date defaults to today and progress is derived from transactions")
    void createDefaultsStartDateAndDerivesProgress() {
        when(currentUser.entity()).thenReturn(user);
        when(goalRepository.save(any(SavingsGoal.class))).thenAnswer(inv -> {
            SavingsGoal g = inv.getArgument(0);
            g.setId(1L);
            return g;
        });
        when(transactionRepository.netAmountBetween(eq(USER_ID), eq(TODAY), eq(TODAY)))
                .thenReturn(new BigDecimal("1000.00"));

        var req = new CreateGoalRequest("Emergency Fund", new BigDecimal("5000.00"),
                LocalDate.of(2027, 1, 1), null);

        GoalResponse res = service.create(req);

        assertThat(res.startDate()).isEqualTo(TODAY);
        assertThat(res.currentProgress()).isEqualByComparingTo("1000.00");
        assertThat(res.progressPercentage()).isEqualByComparingTo("20.00");
        assertThat(res.remainingAmount()).isEqualByComparingTo("4000.00");
    }

    @Test
    @DisplayName("a target date on or before the start date is rejected")
    void createRejectsTargetNotAfterStart() {
        when(currentUser.entity()).thenReturn(user);

        var req = new CreateGoalRequest("Bad", new BigDecimal("100.00"),
                LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 1));

        assertThatThrownBy(() -> service.create(req)).isInstanceOf(BusinessRuleException.class);
    }

    @Test
    @DisplayName("update changes target amount and date, recomputing progress")
    void updateRecomputesProgress() {
        SavingsGoal goal = SavingsGoal.builder()
                .id(1L).goalName("Fund").targetAmount(new BigDecimal("5000.00"))
                .targetDate(LocalDate.of(2027, 1, 1)).startDate(LocalDate.of(2025, 1, 1))
                .user(user).build();

        when(currentUser.id()).thenReturn(USER_ID);
        when(goalRepository.findByIdAndUserId(1L, USER_ID)).thenReturn(Optional.of(goal));
        when(goalRepository.save(any(SavingsGoal.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transactionRepository.netAmountBetween(eq(USER_ID), any(), any()))
                .thenReturn(new BigDecimal("1000.00"));

        var req = new UpdateGoalRequest(new BigDecimal("6000.00"), LocalDate.of(2027, 2, 1));
        GoalResponse res = service.update(1L, req);

        assertThat(res.targetAmount()).isEqualByComparingTo("6000.00");
        assertThat(res.targetDate()).isEqualTo(LocalDate.of(2027, 2, 1));
        assertThat(res.progressPercentage()).isEqualByComparingTo("16.67");
    }

    @Test
    @DisplayName("acting on a goal that isn't yours is a 404")
    void rejectsForeignGoal() {
        when(currentUser.id()).thenReturn(USER_ID);
        when(goalRepository.findByIdAndUserId(99L, USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.get(99L)).isInstanceOf(ResourceNotFoundException.class);
    }
}
