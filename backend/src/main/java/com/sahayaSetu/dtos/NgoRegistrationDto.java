package com.sahayaSetu.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NgoRegistrationDto {

    /*
     * NGO Name
     */
    @NotBlank(message = "NGO Name is required")
    private String name;

    /*
     * Registration Number (Darpan ID)
     */
    @NotBlank(message = "Registration Number is required")
    @jakarta.validation.constraints.Pattern(regexp = "^[A-Z]{2}/[0-9]{4}/[0-9]{7}$", message = "Invalid Darpan ID format. Format: XX/YYYY/NNNNNNN")
    private String darpanId;

    /*
     * Email
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    /*
     * Contact Phone
     */
    @NotBlank(message = "Contact Phone is required")
    @jakarta.validation.constraints.Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number. Must be 10 digits starting with 6-9")
    private String contactPhone;

    /*
     * Address
     */
    @NotBlank(message = "Address is required")
    private String addressLine1;

    /*
     * City
     */
    @NotBlank(message = "City is required")
    private String city;

    /*
     * Password
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
