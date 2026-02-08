package com.sahayaSetu.dtos;

import java.time.LocalDateTime;

import com.sahayaSetu.entities.enums.RequestStatus;
import com.sahayaSetu.entities.enums.RequestType;

import lombok.Data;

@Data
public class RequestResponseDto {
    private Long requestId;
    private String title;
    private String description;
    private RequestType requestType;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private NgoResponseDto ngo;
}
