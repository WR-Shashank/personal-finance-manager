package com.syfe.personalfinancemanager.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Clock;
import java.time.LocalDate;

/** Validator for {@link FutureDate}. */
public class FutureDateValidator implements ConstraintValidator<FutureDate, LocalDate> {

    private final Clock clock;

    public FutureDateValidator() {
        this(Clock.systemDefaultZone());
    }

    FutureDateValidator(Clock clock) {
        this.clock = clock;
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
        return value == null || value.isAfter(LocalDate.now(clock));
    }
}
