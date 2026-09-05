package com.syfe.personalfinancemanager.common.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Minimal public endpoints for uptime checks and a friendly root.
 * <p>
 * Kept out of the feature packages because they belong to no domain — they exist
 * so a load balancer or a curious browser gets a 200 instead of a 401.
 */
@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("service", "personal-finance-manager", "status", "up");
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
