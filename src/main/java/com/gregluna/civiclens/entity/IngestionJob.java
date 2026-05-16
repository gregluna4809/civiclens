package com.gregluna.civiclens.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Tracks each ingestion execution for monitoring, auditing, and failure diagnosis.
@Entity
@Table(name = "ingestion_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngestionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Distinguishes ingestion strategies, e.g. FULL_LOAD vs INCREMENTAL.
    @Column(name = "job_type", nullable = false, length = 50)
    private String jobType;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Builder.Default
    @Column(name = "records_processed", nullable = false)
    private Integer recordsProcessed = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
}
