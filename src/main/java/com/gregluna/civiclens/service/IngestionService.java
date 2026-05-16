package com.gregluna.civiclens.service;

import com.gregluna.civiclens.client.NycOpenDataClient;
import com.gregluna.civiclens.dto.NycServiceRequestRecord;
import com.gregluna.civiclens.entity.*;
import com.gregluna.civiclens.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngestionService {

    private static final int MAX_ERROR_LENGTH = 1000;

    private final NycOpenDataClient nycOpenDataClient;
    private final IngestionJobRepository ingestionJobRepo;
    private final ComplaintRepository complaintRepo;
    private final BoroughRepository boroughRepo;
    private final AgencyRepository agencyRepo;
    private final ComplaintTypeRepository complaintTypeRepo;

    // The HTTP fetch runs inside the transaction for simplicity; acceptable at MVP scale with small limits.
    // A future refactor could fetch outside the transaction to reduce connection hold time.
    @Transactional
    public IngestionJob ingest(int limit) {
        IngestionJob job = ingestionJobRepo.save(IngestionJob.builder()
                .jobType("MANUAL")
                .status("RUNNING")
                .startedAt(LocalDateTime.now())
                .build());

        log.info("Ingestion job {} started: limit={}", job.getId(), limit);

        try {
            List<NycServiceRequestRecord> records = nycOpenDataClient.fetchRecords(limit);
            int saved = 0;

            for (NycServiceRequestRecord record : records) {
                if (isInvalid(record)) continue;
                if (complaintRepo.existsBySourceId(record.uniqueKey())) continue;
                saveComplaint(record);
                saved++;
            }

            job.setStatus("COMPLETED");
            job.setRecordsProcessed(saved);
            job.setFinishedAt(LocalDateTime.now());
            log.info("Ingestion job {} completed: {} new records saved", job.getId(), saved);

        } catch (Exception e) {
            // Catch here so the transaction commits with FAILED status rather than rolling back.
            job.setStatus("FAILED");
            job.setErrorMessage(truncate(e.getMessage()));
            job.setFinishedAt(LocalDateTime.now());
            log.error("Ingestion job {} failed: {}", job.getId(), e.getMessage());
        }

        return job;
    }

    @Transactional(readOnly = true)
    public List<IngestionJob> getAllJobs() {
        return ingestionJobRepo.findAllByOrderByStartedAtDesc();
    }

    private void saveComplaint(NycServiceRequestRecord record) {
        Borough borough = resolveBorough(record.borough());
        Agency agency = findOrCreateAgency(record.agencyCode(), record.agencyName());
        ComplaintType complaintType = findOrCreateComplaintType(record.complaintType());

        complaintRepo.save(Complaint.builder()
                .sourceId(record.uniqueKey())
                .borough(borough)
                .agency(agency)
                .complaintType(complaintType)
                .descriptor(record.descriptor())
                .status(record.status() != null ? record.status() : "Unknown")
                .incidentZip(record.incidentZip())
                .latitude(parseDouble(record.latitude()))
                .longitude(parseDouble(record.longitude()))
                .createdAt(parseDate(record.createdDate()))
                .closedAt(parseDate(record.closedDate()))
                .ingestedAt(LocalDateTime.now())
                .build());
    }

    // "Unspecified" borough maps to null so analytics groupings aren't polluted by a catch-all bucket.
    private Borough resolveBorough(String name) {
        if (name == null || name.isBlank() || name.equalsIgnoreCase("Unspecified")) {
            return null;
        }
        return boroughRepo.findByName(name)
                .orElseGet(() -> boroughRepo.save(Borough.builder().name(name).build()));
    }

    private Agency findOrCreateAgency(String code, String name) {
        return agencyRepo.findByCode(code)
                .orElseGet(() -> agencyRepo.save(
                        Agency.builder().code(code).name(name != null ? name : code).build()));
    }

    private ComplaintType findOrCreateComplaintType(String name) {
        return complaintTypeRepo.findByName(name)
                .orElseGet(() -> complaintTypeRepo.save(
                        ComplaintType.builder().name(name).build()));
    }

    // Skip records missing fields required by NOT NULL schema constraints.
    private boolean isInvalid(NycServiceRequestRecord record) {
        return record.uniqueKey() == null
                || record.agencyCode() == null
                || record.complaintType() == null;
    }

    private LocalDateTime parseDate(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private Double parseDouble(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String truncate(String message) {
        if (message == null) return "Unknown error";
        return message.length() > MAX_ERROR_LENGTH ? message.substring(0, MAX_ERROR_LENGTH) : message;
    }
}
