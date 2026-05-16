package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.IngestionJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngestionJobRepository extends JpaRepository<IngestionJob, Long> {
}
