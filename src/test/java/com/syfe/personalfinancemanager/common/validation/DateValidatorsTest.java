package com.syfe.personalfinancemanager.common.validation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The validators take a {@link Clock}, so "today" is a fixed point here rather
 * than whatever the wall clock says when the suite runs.
 */
class DateValidatorsTest {

    private static final Clock FIXED =
            Clock.fixed(Instant.parse("2026-06-15T10:00:00Z"), ZoneOffset.UTC);
    private static final LocalDate TODAY = LocalDate.of(2026, 6, 15);

    @Test
    @DisplayName("@NotFuture accepts today and the past, rejects tomorrow")
    void notFuture() {
        var v = new NotFutureValidator(FIXED);

        assertThat(v.isValid(TODAY, null)).isTrue();
        assertThat(v.isValid(TODAY.minusDays(1), null)).isTrue();
        assertThat(v.isValid(TODAY.plusDays(1), null)).isFalse();
        assertThat(v.isValid(null, null)).isTrue(); // null is @NotNull's job
    }

    @Test
    @DisplayName("@FutureDate accepts tomorrow, rejects today and the past")
    void futureDate() {
        var v = new FutureDateValidator(FIXED);

        assertThat(v.isValid(TODAY.plusDays(1), null)).isTrue();
        assertThat(v.isValid(TODAY, null)).isFalse();
        assertThat(v.isValid(TODAY.minusDays(1), null)).isFalse();
        assertThat(v.isValid(null, null)).isTrue();
    }
}
