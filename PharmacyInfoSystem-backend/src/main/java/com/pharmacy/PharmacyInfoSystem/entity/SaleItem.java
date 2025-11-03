package com.pharmacy.PharmacyInfoSystem.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private double price;

    private double total; // calculated: quantity * price

    // Each SaleItem belongs to one sale
    @ManyToOne
    @JoinColumn(name = "sale_id")
    @JsonBackReference
    private Sale sale;

    // Each SaleItem refers to one medicine
    @ManyToOne
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

}

