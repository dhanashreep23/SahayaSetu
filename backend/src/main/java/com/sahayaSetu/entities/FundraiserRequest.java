package com.sahayaSetu.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fundraiser_requests")
@Data
@EqualsAndHashCode(callSuper = true)
public class FundraiserRequest extends Request {

    @Column(name = "target_amount", nullable = false)
    private BigDecimal targetAmount;

    @Column(name = "collected_amount")
    private BigDecimal collectedAmount = BigDecimal.ZERO;

    private LocalDate deadline;
}
