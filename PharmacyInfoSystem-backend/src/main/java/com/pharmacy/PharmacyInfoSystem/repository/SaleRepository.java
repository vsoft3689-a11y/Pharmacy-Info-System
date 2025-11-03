package com.pharmacy.PharmacyInfoSystem.repository;

import com.pharmacy.PharmacyInfoSystem.entity.Pharmacist;
import com.pharmacy.PharmacyInfoSystem.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s WHERE DATE(s.saleDate) = CURRENT_DATE AND s.pharmacist.id= :pharmacistId")
    double sumSalesForToday(@Param("pharmacistId") Long pharmacistId);
    List<Sale> findByPharmacist(Pharmacist pharmacist);
    @Query("SELECT SUM(s.totalAmount) FROM Sale s")
    Double findTotalSalesAmount();
}
