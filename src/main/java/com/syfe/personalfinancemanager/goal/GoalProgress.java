package com.syfe.personalfinancemanager.goal;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * The three derived figures the API reports for a goal.
 *
 * @param currentProgress    net saved since the goal's start date
 * @param progressPercentage share of the target reached, 0-100, two decimals
 * @param remainingAmount    what is still to be saved, floored at zero
 */
public record GoalProgress(BigDecimal currentProgress,
                           BigDecimal progressPercentage,
                           BigDecimal remainingAmount) {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int SCALE = 2;

    /**
     * Derives progress from a net saved amount against a target.
     * <p>
     * Negative net savings are reported as they are rather than clamped: a user
     * who has spent more than they earned since starting the goal should see that.
     * The percentage is clamped to 0 so a progress bar never renders backwards,
     * and remaining is floored at 0 once the target is met.
     *
     * @param netSaved     income minus expenses since the start date
     * @param targetAmount the goal's target, strictly positive
     */
    public static GoalProgress of(BigDecimal netSaved, BigDecimal targetAmount) {
        BigDecimal progress = netSaved.setScale(SCALE, RoundingMode.HALF_UP);

        BigDecimal percentage = progress.max(BigDecimal.ZERO)
                .multiply(HUNDRED)
                .divide(targetAmount, SCALE, RoundingMode.HALF_UP)
                .min(HUNDRED);

        BigDecimal remaining = targetAmount.subtract(progress)
                .max(BigDecimal.ZERO)
                .setScale(SCALE, RoundingMode.HALF_UP);

        return new GoalProgress(progress, percentage, remaining);
    }
}
