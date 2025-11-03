package com.pharmacy.PharmacyInfoSystem.controller;

import com.pharmacy.PharmacyInfoSystem.entity.Supplier;
import com.pharmacy.PharmacyInfoSystem.entity.User;
import com.pharmacy.PharmacyInfoSystem.repository.SupplierRepository;
import com.pharmacy.PharmacyInfoSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all suppliers
    @GetMapping("/all")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Create a new supplier
    @PostMapping
    public ResponseEntity<?> addSupplier(@RequestBody Supplier supplier) {
        if (supplier.getName() == null || supplier.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Supplier name is required");
        }
        Supplier saved = supplierRepository.save(supplier);
        return ResponseEntity.ok(saved);
    }

    // Get supplier by user ID
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getSupplierByUserId(@PathVariable Long userId) {
        Optional<Supplier> supplier = supplierRepository.findByUserId(userId);
        return supplier.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update supplier profile
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateSupplier(@PathVariable Long userId, @RequestBody Supplier updated) {
        Supplier supplier = new Supplier();
        supplier.setName(updated.getName());
        supplier.setCompanyName(updated.getCompanyName());
        supplier.setContact(updated.getContact());
        supplier.setEmail(updated.getEmail());
        supplier.setAddress(updated.getAddress());

        if (userId != null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            supplier.setUser(user);
        }

        Supplier saved = supplierRepository.save(supplier);
        return ResponseEntity.ok(saved);
    }

    // Delete supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok("Supplier deleted successfully");
    }
}
