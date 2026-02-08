package com.sahayaSetu.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class FundraiserRequestResponseDto extends RequestResponseDto {
    private BigDecimal targetAmount;
    private BigDecimal collectedAmount;
    private LocalDate deadline;
}
