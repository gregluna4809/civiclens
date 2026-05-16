package com.gregluna.civiclens.controller;

import java.time.Instant;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public HealthResponse health() {
        // Public readiness check used by demos and deployment smoke tests.
        return new HealthResponse("UP", "CivicLens API", Instant.now());
    }

    public record HealthResponse(String status, String service, Instant timestamp) {
    }
}
