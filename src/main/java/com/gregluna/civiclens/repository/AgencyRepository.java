package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgencyRepository extends JpaRepository<Agency, Integer> {

    Optional<Agency> findByCode(String code);
}
