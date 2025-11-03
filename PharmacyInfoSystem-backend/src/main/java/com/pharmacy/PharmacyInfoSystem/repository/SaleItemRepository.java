package com.pharmacy.PharmacyInfoSystem.repository;

import com.pharmacy.PharmacyInfoSystem.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
}

