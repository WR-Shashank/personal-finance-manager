package com.syfe.personalfinancemanager.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

/**
 * Exposes the system clock as a bean.
 * <p>
 * Date rules run through this rather than {@code LocalDate.now()}, so a test can
 * inject a fixed clock and assert the boundaries — "today is allowed, tomorrow
 * is not" — instead of hoping the suite never runs at midnight.
 */
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
