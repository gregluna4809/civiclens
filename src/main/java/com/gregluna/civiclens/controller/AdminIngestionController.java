package com.gregluna.civiclens.controller;

import com.gregluna.civiclens.dto.IngestionJobResponse;
import com.gregluna.civiclens.entity.IngestionJob;
import com.gregluna.civiclens.service.IngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Admin-only ingestion endpoints; authentication will be added in Phase 7.
@RestController
@RequestMapping("/api/admin/ingest")
@RequiredArgsConstructor
public class AdminIngestionController {

    private final IngestionService ingestionService;

    // Triggers a synchronous ingestion run and returns the resulting job record.
    @PostMapping("/311")
    public ResponseEntity<IngestionJobResponse> ingest(
            @RequestParam(defaultValue = "100") int limit) {
        IngestionJob job = ingestionService.ingest(limit);
        return ResponseEntity.ok(toResponse(job));
    }

    @GetMapping("/jobs")
    public List<IngestionJobResponse> getJobs() {
        return ingestionService.getAllJobs().stream()
                .map(this::toResponse)
                .toList();
    }

    private IngestionJobResponse toResponse(IngestionJob job) {
        return new IngestionJobResponse(
                job.getId(),
                job.getJobType(),
                job.getStatus(),
                job.getStartedAt(),
                job.getFinishedAt(),
                job.getRecordsProcessed(),
                job.getErrorMessage()
        );
    }
}
