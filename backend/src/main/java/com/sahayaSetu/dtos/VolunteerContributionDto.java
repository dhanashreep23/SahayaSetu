package com.sahayaSetu.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VolunteerContributionDto {
    private String requestTitle;
    private String status;
    private LocalDateTime appliedAt;
}