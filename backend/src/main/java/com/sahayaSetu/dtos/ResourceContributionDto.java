package com.sahayaSetu.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ResourceContributionDto {
    private Integer quantity;
    private String resourceType;
    private String requestTitle;
    private LocalDateTime contributedAt;
}