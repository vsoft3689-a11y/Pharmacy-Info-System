package com.pharmacy.PharmacyInfoSystem.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // store encoded password

    @Column(nullable = false)
    private String role; // e.g., ROLE_ADMIN, ROLE_PHARMACIST

    private String resetToken;
}
