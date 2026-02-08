package com.sahayaSetu.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DonorRegistrationDto {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    @jakarta.validation.constraints.Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number. Must be 10 digits starting with 6-9")
    private String phone;

    @Past(message = "Date of Birth must be in the past")
    private LocalDate dateOfBirth;

    private String address;
    private String city;
}
