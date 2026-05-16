package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.IngestionJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngestionJobRepository extends JpaRepository<IngestionJob, Long> {

    List<IngestionJob> findAllByOrderByStartedAtDesc();
}
