package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Used during ingestion to skip records already present in the database.
    boolean existsBySourceId(String sourceId);
}
