package com.sahayaSetu.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class VolunteerRequestResponseDto extends RequestResponseDto {
    private String skillsRequired;
    private int volunteersRequired;
    private long volunteerCount;
    private boolean hasApplied = false;
}
