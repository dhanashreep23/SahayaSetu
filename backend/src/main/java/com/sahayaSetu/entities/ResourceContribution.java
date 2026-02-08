package com.sahayaSetu.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resource_contributions")
@Data
public class ResourceContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contribution_id")
    private Long contributionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_request_id", nullable = false)
    private ResourceRequest resourceRequest;

    @Column(nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "contributed_at", updatable = false)
    private LocalDateTime contributedAt;
}