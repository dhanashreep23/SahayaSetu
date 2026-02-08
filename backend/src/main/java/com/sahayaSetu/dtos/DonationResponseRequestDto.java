package com.sahayaSetu.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DonationResponseRequestDto {
    
    @NotNull(message = "Donation ID is required")
    private Long donationId;
    
    @NotBlank(message = "Response message is required")
    private String message;
    
    // Constructors
    public DonationResponseRequestDto() {}
    
    public DonationResponseRequestDto(Long donationId, String message) {
        this.donationId = donationId;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getDonationId() {
        return donationId;
    }
    
    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}