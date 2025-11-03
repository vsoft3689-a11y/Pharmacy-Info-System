package com.pharmacy.PharmacyInfoSystem.repository;

import com.pharmacy.PharmacyInfoSystem.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByNameContainingIgnoreCase(String name);

    long countByQuantityLessThan(int threshold);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.expiryDate <= :cutoffDate AND m.pharmacist.id = :pharmacistId")
    long countExpiringSoon(@Param("cutoffDate") LocalDate cutoffDate,
                           @Param("pharmacistId") Long pharmacistId);


//    List<Medicine> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);

    // Fetch all medicines below given stock threshold
    List<Medicine> findByQuantityLessThan(int threshold);
    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.pharmacist.id= :pharmacistId")
    long findTotalMedicinesByPharmacistId(@Param("pharmacistId") Long pharmacistId);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.quantity <= m.reorder_level AND m.pharmacist.id= :pharmacistId")
    long findMedicinesBelowReorderLevel(@Param("pharmacistId") Long pharmacistId);

    List<Medicine> findByPharmacistId(Long pharmacistId);

    List<Medicine> findBySupplierId(Long supplierId);

    Optional<Medicine> findByNameAndSupplierId(String name, Long supplierId);
}
