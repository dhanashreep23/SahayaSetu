package com.sahayaSetu.dtos;

import com.sahayaSetu.entities.enums.NgoStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NgoResponseDto {
    private Long ngoId;
    private String darpanId;
    private String name;
    private String email;
    private String contactPhone;
    private String addressLine1;
    private String city;
    private NgoStatus status;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
}
