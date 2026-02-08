package com.sahayaSetu.entities;

import com.sahayaSetu.entities.enums.NgoStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ngos")
@Data
public class Ngo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ngo_id")
    private Long ngoId;

    @Column(name = "darpan_id", unique = true, nullable = false)
    private String darpanId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Column(name = "contact_phone", nullable = false)
    private String contactPhone;

    @Column(name = "address_line1")
    private String addressLine1;

    private String city;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NgoStatus status = NgoStatus.PENDING;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
