package com.syfe.personalfinancemanager.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Clock;
import java.time.LocalDate;

/**
 * Validator for {@link NotFuture}.
 * <p>
 * Takes a {@link Clock} from the context so "today" is injectable, which lets
 * boundary cases be tested without freezing the system clock.
 */
public class NotFutureValidator implements ConstraintValidator<NotFuture, LocalDate> {

    private final Clock clock;

    public NotFutureValidator() {
        this(Clock.systemDefaultZone());
    }

    NotFutureValidator(Clock clock) {
        this.clock = clock;
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
        // Null is @NotNull's job, not ours.
        return value == null || !value.isAfter(LocalDate.now(clock));
    }
}
