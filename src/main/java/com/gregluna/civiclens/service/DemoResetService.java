package com.gregluna.civiclens.service;

import com.gregluna.civiclens.dto.DemoResetResponse;
import com.gregluna.civiclens.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DemoResetService {

    private final ComplaintRepository complaintRepo;
    private final ComplaintTypeRepository complaintTypeRepo;
    private final AgencyRepository agencyRepo;
    private final BoroughRepository boroughRepo;
    private final IngestionJobRepository ingestionJobRepo;

    // Deletes all ingested data in FK-safe order.
    // Complaints hold foreign keys to agencies, boroughs, and complaint_types,
    // so they must be removed first to satisfy constraint checks.
    // deleteAllInBatch() executes a single bulk DELETE per table, avoiding N+1 deletes.
    @Transactional
    public DemoResetResponse resetAll() {
        log.warn("Demo data reset initiated — all data tables will be cleared.");
        complaintRepo.deleteAllInBatch();
        complaintTypeRepo.deleteAllInBatch();
        agencyRepo.deleteAllInBatch();
        boroughRepo.deleteAllInBatch();
        ingestionJobRepo.deleteAllInBatch();

        LocalDateTime deletedAt = LocalDateTime.now();
        log.warn("Demo data reset complete at {}", deletedAt);
        return new DemoResetResponse("All demo data deleted successfully.", deletedAt);
    }
}
