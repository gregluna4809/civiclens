package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.Borough;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoroughRepository extends JpaRepository<Borough, Integer> {

    Optional<Borough> findByName(String name);
}
