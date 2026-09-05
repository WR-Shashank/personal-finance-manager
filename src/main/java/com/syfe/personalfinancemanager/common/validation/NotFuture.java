package com.syfe.personalfinancemanager.common.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * The annotated {@link java.time.LocalDate} must be today or earlier.
 * <p>
 * Kept as a constraint rather than an {@code if} in the service so the rule is
 * declared once, next to the field it governs, and is reported through the same
 * field-error channel as every other validation failure.
 */
@Documented
@Constraint(validatedBy = NotFutureValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotFuture {

    String message() default "Date cannot be in the future";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
