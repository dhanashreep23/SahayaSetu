package com.sahayaSetu.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VolunteerRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String skillsRequired;

    @Min(value = 1, message = "Volunteers required must be at least 1")
    private int volunteersRequired;
}
