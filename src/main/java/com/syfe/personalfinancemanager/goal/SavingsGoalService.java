package com.syfe.personalfinancemanager.goal;

import com.syfe.personalfinancemanager.common.exception.BusinessRuleException;
import com.syfe.personalfinancemanager.common.exception.ResourceNotFoundException;
import com.syfe.personalfinancemanager.goal.dto.CreateGoalRequest;
import com.syfe.personalfinancemanager.goal.dto.GoalResponse;
import com.syfe.personalfinancemanager.goal.dto.UpdateGoalRequest;
import com.syfe.personalfinancemanager.transaction.TransactionRepository;
import com.syfe.personalfinancemanager.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;

/**
 * Savings goal rules, with progress derived from the transaction ledger on read.
 * <p>
 * The {@link Clock} is injected so "today" can be fixed in tests; a service that
 * calls {@code LocalDate.now()} directly cannot have its date boundaries asserted.
 */
@Service
@RequiredArgsConstructor
public class SavingsGoalService {

    private final SavingsGoalRepository goalRepository;
    private final TransactionRepository transactionRepository;
    private final CurrentUser currentUser;
    private final Clock clock;

    @Transactional(readOnly = true)
    public List<GoalResponse> list() {
        return goalRepository.findByUserIdOrderByTargetDateAsc(currentUser.id()).stream()
                .map(this::withProgress)
                .toList();
    }

    @Transactional(readOnly = true)
    public GoalResponse get(Long id) {
        return withProgress(requireOwned(id));
    }

    @Transactional
    public GoalResponse create(CreateGoalRequest request) {
        LocalDate startDate = request.startDate() != null ? request.startDate() : LocalDate.now(clock);

        if (!request.targetDate().isAfter(startDate)) {
            throw new BusinessRuleException("Target date must be after the start date");
        }

        SavingsGoal goal = goalRepository.save(SavingsGoal.builder()
                .goalName(request.goalName())
                .targetAmount(request.targetAmount())
                .targetDate(request.targetDate())
                .startDate(startDate)
                .user(currentUser.entity())
                .build());

        return withProgress(goal);
    }

    @Transactional
    public GoalResponse update(Long id, UpdateGoalRequest request) {
        SavingsGoal goal = requireOwned(id);

        if (request.targetAmount() != null) {
            goal.setTargetAmount(request.targetAmount());
        }
        if (request.targetDate() != null) {
            if (!request.targetDate().isAfter(goal.getStartDate())) {
                throw new BusinessRuleException("Target date must be after the start date");
            }
            goal.setTargetDate(request.targetDate());
        }

        return withProgress(goalRepository.save(goal));
    }

    @Transactional
    public void delete(Long id) {
        goalRepository.delete(requireOwned(id));
    }

    /**
     * Recomputes progress from transactions dated between the goal's start date
     * and today, then assembles the response.
     */
    private GoalResponse withProgress(SavingsGoal goal) {
        var net = transactionRepository.netAmountBetween(
                goal.getUser().getId(), goal.getStartDate(), LocalDate.now(clock));

        GoalProgress progress = GoalProgress.of(net, goal.getTargetAmount());

        return new GoalResponse(
                goal.getId(),
                goal.getGoalName(),
                goal.getTargetAmount(),
                goal.getTargetDate(),
                goal.getStartDate(),
                progress.currentProgress(),
                progress.progressPercentage(),
                progress.remainingAmount());
    }

    private SavingsGoal requireOwned(Long id) {
        return goalRepository.findByIdAndUserId(id, currentUser.id())
                .orElseThrow(() -> ResourceNotFoundException.of("Savings goal", id));
    }
}
