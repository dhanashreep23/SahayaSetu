package com.sahayaSetu.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ResourceRequestResponseDto extends RequestResponseDto {
    private String resourceType;
    private int quantityRequired;
    private int quantityReceived;
}
