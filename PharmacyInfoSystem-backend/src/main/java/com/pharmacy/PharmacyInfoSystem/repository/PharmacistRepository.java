package com.pharmacy.PharmacyInfoSystem.repository;

import com.pharmacy.PharmacyInfoSystem.entity.Pharmacist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PharmacistRepository extends JpaRepository<Pharmacist, Long> {
    Optional<Pharmacist> findByUserId(Long userId);
}
