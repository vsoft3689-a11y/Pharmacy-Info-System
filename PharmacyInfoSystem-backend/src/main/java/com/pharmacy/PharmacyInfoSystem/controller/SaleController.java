package com.pharmacy.PharmacyInfoSystem.controller;

import com.pharmacy.PharmacyInfoSystem.entity.*;
import com.pharmacy.PharmacyInfoSystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173") // update if needed
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private SaleItemRepository saleItemRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PharmacistRepository pharmacistRepository;

    // Create Sale
    @PostMapping("/create")
    public ResponseEntity<?> createSale(@RequestBody Sale sale) {
        try {
            // Set sale date
            sale.setSaleDate(LocalDateTime.now());

            double totalAmount = 0;

            // Process each sale item
            for (SaleItem item : sale.getSaleItems()) {
                Medicine med = medicineRepository.findById(item.getMedicine().getId()).orElseThrow(() -> new RuntimeException("Medicine not found: " + item.getMedicine().getId()));

                // Stock check
                if (med.getQuantity() < item.getQuantity()) {
                    return ResponseEntity.badRequest().body("Insufficient stock for medicine: " + med.getName());
                }

                // Set all required fields before saving
                item.setSale(sale);
                item.setMedicine(med);
                item.setPrice(med.getPrice());
                item.setTotal(med.getPrice() * item.getQuantity()); // total is set
                totalAmount += item.getTotal();

                // Update medicine stock
                med.setQuantity(med.getQuantity() - item.getQuantity());
                medicineRepository.save(med);
            }

            sale.setTotalAmount(totalAmount);

            // Save sale and items
            Sale savedSale = saleRepository.save(sale);
            for (SaleItem item : sale.getSaleItems()) {
                saleItemRepository.save(item);
            }

            return ResponseEntity.ok(savedSale);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating sale: " + e.getMessage());
        }
    }

    // Get sale by pharmacist
    @GetMapping("/pharmacist/{id}")
    public ResponseEntity<List<Sale>> getSalesByPharmacist(@PathVariable Long id) {
        Pharmacist pharmacist = pharmacistRepository.findById(id).orElseThrow(() -> new RuntimeException("Pharmacist not found"));
        return ResponseEntity.ok(saleRepository.findByPharmacist(pharmacist));
    }

    // Get all sales
    @GetMapping("/all")
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(saleRepository.findAll());
    }

}
