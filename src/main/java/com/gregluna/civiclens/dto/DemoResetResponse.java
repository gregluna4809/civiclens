package com.gregluna.civiclens.dto;

import java.time.LocalDateTime;

// Response DTO confirming a demo data reset. Intentionally lightweight.
public record DemoResetResponse(
        String message,
        LocalDateTime deletedAt
) {}
