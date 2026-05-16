package com.gregluna.civiclens.dto;

import java.time.LocalDateTime;

public record IngestionJobResponse(
        Long id,
        String jobType,
        String status,
        LocalDateTime startedAt,
        LocalDateTime finishedAt,
        Integer recordsProcessed,
        String errorMessage
) {}
