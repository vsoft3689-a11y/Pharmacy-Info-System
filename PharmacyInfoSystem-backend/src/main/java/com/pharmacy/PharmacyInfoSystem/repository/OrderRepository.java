package com.pharmacy.PharmacyInfoSystem.repository;

import com.pharmacy.PharmacyInfoSystem.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findBySupplierId(Long supplierId);
    List<Order> findByPharmacistId(Long pharmacistId);
    long countByStatus(String status);
}
