package com.sahayaSetu.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DonationContributionDto {
    private BigDecimal amount;
    private String fundraiserTitle;
    private LocalDateTime donatedAt;
}