package com.syfe.personalfinancemanager.goal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Progress arithmetic has no dependencies, so it is tested directly — no Spring
 * context, no mocks. Pulling the calculation out of the service is what makes
 * the edge cases cheap to cover.
 */
class GoalProgressTest {

    @ParameterizedTest(name = "saved {0} of {1} -> {2}% with {3} remaining")
    @CsvSource({
            "1000.00, 5000.00,  20.00, 4000.00",
            "   0.00, 5000.00,   0.00, 5000.00",
            "5000.00, 5000.00, 100.00,    0.00",
            "7500.00, 5000.00, 100.00,    0.00",   // overshoot is capped, not 150%
            "1666.67, 5000.00,  33.33, 3333.33"    // rounds half up to two places
    })
    @DisplayName("derives percentage and remaining amount from net savings")
    void derivesProgress(BigDecimal saved, BigDecimal target,
                         BigDecimal expectedPct, BigDecimal expectedRemaining) {

        GoalProgress progress = GoalProgress.of(saved, target);

        assertThat(progress.progressPercentage()).isEqualByComparingTo(expectedPct);
        assertThat(progress.remainingAmount()).isEqualByComparingTo(expectedRemaining);
    }

    @Test
    @DisplayName("reports negative net savings but never a negative percentage")
    void handlesNegativeNetSavings() {
        GoalProgress progress = GoalProgress.of(new BigDecimal("-250.00"), new BigDecimal("1000.00"));

        assertThat(progress.currentProgress()).isEqualByComparingTo("-250.00");
        assertThat(progress.progressPercentage()).isEqualByComparingTo("0.00");
        assertThat(progress.remainingAmount()).isEqualByComparingTo("1250.00");
    }
}
