package com.pharmacy.PharmacyInfoSystem.controller;

import com.pharmacy.PharmacyInfoSystem.entity.Medicine;
import com.pharmacy.PharmacyInfoSystem.entity.Pharmacist;
import com.pharmacy.PharmacyInfoSystem.entity.Supplier;
import com.pharmacy.PharmacyInfoSystem.entity.User;
import com.pharmacy.PharmacyInfoSystem.repository.MedicineRepository;
import com.pharmacy.PharmacyInfoSystem.repository.PharmacistRepository;
import com.pharmacy.PharmacyInfoSystem.repository.SupplierRepository;
import com.pharmacy.PharmacyInfoSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    @PostMapping("/add-medicines")
    public ResponseEntity<?> addMedicine(@RequestBody Map<String, Object> req) {
        Long supplierId = Long.valueOf(req.get("supplierId").toString());
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        Long pharmacistId = Long.valueOf(req.get("pharmacistId").toString());
        Pharmacist pharmacist = pharmacistRepository.findById(pharmacistId).
                orElseThrow(()->new RuntimeException("Pharmacist not found"));

        Medicine medicine = new Medicine();
        medicine.setName(req.get("name").toString());
        medicine.setBatch_no(req.get("batch_no").toString());
        medicine.setPrice(Double.parseDouble(req.get("price").toString()));
        medicine.setQuantity(Integer.parseInt(req.get("quantity").toString()));
        medicine.setReorder_level(Integer.parseInt(req.get("reorder_level").toString()));
        medicine.setExpiryDate(LocalDate.parse(req.get("expiryDate").toString()));
        medicine.setSupplier(supplier);
        medicine.setPharmacist(pharmacist);

        medicineRepository.save(medicine);
        return ResponseEntity.ok("Medicine added successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        List<Medicine> medicines = medicineRepository.findAll();
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/by-pharmacist/{pharmacistId}")
    public ResponseEntity<?> getMedicineByPharmacistId(@PathVariable Long pharmacistId) {
        if (pharmacistId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Pharmacist ID is required");
        }

        List<Medicine> medicines = medicineRepository.findByPharmacistId(pharmacistId);

//        if (medicines.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body("No medicines found for this pharmacist");
//        }

        return ResponseEntity.ok(medicines);
    }


    @GetMapping("/by-supplier/{userId}")
    public ResponseEntity<?> getMedicineBySupplierId(@PathVariable Long userId){
        if(userId!=null){
            User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"));
        }
            List<Medicine> medicine = medicineRepository.findBySupplierId(userId);
            return ResponseEntity.ok(medicine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Medicine updatedMedicine) {
        Optional<Medicine> existingOpt = medicineRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Medicine not found");
        }

        Medicine existing = existingOpt.get();

        existing.setPrice(updatedMedicine.getPrice());
        existing.setQuantity(updatedMedicine.getQuantity());
        existing.setReorder_level(updatedMedicine.getReorder_level());
        existing.setExpiryDate(updatedMedicine.getExpiryDate());

        // Update supplier only if provided
        if (updatedMedicine.getSupplier() != null && updatedMedicine.getSupplier().getId() != null) {
            supplierRepository.findById(updatedMedicine.getSupplier().getId())
                    .ifPresent(existing::setSupplier);
        }

        medicineRepository.save(existing);
        return ResponseEntity.ok("Medicine updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineRepository.deleteById(id);
        return ResponseEntity.ok("Medicine deleted successfully");
    }

}
