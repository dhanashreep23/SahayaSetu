package com.sahayaSetu.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DonorResponseDto {
    private Long donorId;
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private LocalDate dateOfBirth;
}
