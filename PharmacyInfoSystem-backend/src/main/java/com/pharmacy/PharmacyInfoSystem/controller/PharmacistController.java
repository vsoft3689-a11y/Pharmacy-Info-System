package com.pharmacy.PharmacyInfoSystem.controller;

import com.pharmacy.PharmacyInfoSystem.entity.Medicine;
import com.pharmacy.PharmacyInfoSystem.entity.Pharmacist;
import com.pharmacy.PharmacyInfoSystem.entity.User;
import com.pharmacy.PharmacyInfoSystem.repository.MedicineRepository;
import com.pharmacy.PharmacyInfoSystem.repository.PharmacistRepository;
import com.pharmacy.PharmacyInfoSystem.repository.SaleRepository;
import com.pharmacy.PharmacyInfoSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pharmacist")
public class PharmacistController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all")
    private List<Pharmacist> getAllPharmacists(){
        return pharmacistRepository.findAll();
    }

    @PostMapping("/create")
    public Pharmacist addPharmacist(@RequestBody Pharmacist pharmacist) {
        return pharmacistRepository.save(pharmacist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePharmacist(@PathVariable Long id) {
        if (!pharmacistRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pharmacistRepository.deleteById(id);
        return ResponseEntity.ok("Pharmacist deleted");
    }

    // Get pharmacist by user ID
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getPharmacistByUserId(@PathVariable Long userId) {
        Optional<Pharmacist> pharmacist = pharmacistRepository.findByUserId(userId);

        return pharmacist
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update pharmacist profile
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updatePharmacist(@PathVariable Long userId, @RequestBody Pharmacist updated) {
        Pharmacist pharmacist = new Pharmacist();
        pharmacist.setName(updated.getName());
        pharmacist.setContact(updated.getContact());
        pharmacist.setAddress(updated.getAddress());
        pharmacist.setEmail(updated.getEmail());
        pharmacist.setQualification(updated.getQualification());

        // Fetch and set User by ID
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            pharmacist.setUser(user);
        }
        Pharmacist saved = pharmacistRepository.save(pharmacist);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/summary/{pharmacistId}")
    public Map<String, Object> getSummary(@PathVariable Long pharmacistId) {
        long totalMedicines = medicineRepository.findTotalMedicinesByPharmacistId(pharmacistId);

        long lowStock = medicineRepository.findMedicinesBelowReorderLevel(pharmacistId); // e.g. threshold 10

        LocalDate cutoffDate = LocalDate.now().plusDays(30);
        long expiringSoon = medicineRepository.countExpiringSoon(cutoffDate,pharmacistId); // expiry < 30 days

        double todaySales = saleRepository.sumSalesForToday(pharmacistId);

        return Map.of(
                "totalMedicines", totalMedicines,
                "lowStock", lowStock,
                "expiringSoon", expiringSoon,
                "todaySales", todaySales
        );
    }

//    @GetMapping("/low-stock")
//    public List<Medicine> getLowStockMedicines() {
//        int threshold = 10; // you can adjust this value
//        return medicineRepository.findByQuantityLessThan(threshold);
//    }
//
//    @GetMapping("/expiring-soon")
//    public List<Medicine> getExpiringSoonMedicines() {
//        LocalDate today = LocalDate.now();
//        LocalDate upcoming = today.plusDays(30); // next 30 days
//
//        return medicineRepository.findByExpiryDateBetween(today, upcoming);
//    }
}

