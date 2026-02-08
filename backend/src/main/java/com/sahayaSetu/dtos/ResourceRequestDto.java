package com.sahayaSetu.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResourceRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Resource Type is required")
    private String resourceType;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantityRequired;
}
