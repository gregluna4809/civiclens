package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.ComplaintType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComplaintTypeRepository extends JpaRepository<ComplaintType, Integer> {

    Optional<ComplaintType> findByName(String name);
}
