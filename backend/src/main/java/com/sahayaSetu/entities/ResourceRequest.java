package com.sahayaSetu.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "resource_requests")
@Data
@EqualsAndHashCode(callSuper = true)
public class ResourceRequest extends Request {

    // PK is shared with Request via @PrimaryKeyJoinColumn implied by JOINED
    // strategy

    @Column(name = "resource_type", nullable = false)
    private String resourceType;

    @Column(name = "quantity_required", nullable = false)
    private int quantityRequired;

    @Column(name = "quantity_received")
    private int quantityReceived = 0;
}
