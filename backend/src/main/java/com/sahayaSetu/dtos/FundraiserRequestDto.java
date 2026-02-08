package com.sahayaSetu.dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FundraiserRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Target amount is required")
    @Min(value = 1, message = "Target amount must be positive")
    private BigDecimal targetAmount;

    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;
}
