package com.sahayaSetu.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DonationResponseDto {

    private Long donationId;
    private String donorName;
    private String donorEmail;
    private BigDecimal amount;
    private String fundraiserTitle;
    private LocalDateTime donationDate;
    private Boolean responseStatus;
    private String responseMessage;
}
