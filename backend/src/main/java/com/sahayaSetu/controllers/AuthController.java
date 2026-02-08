package com.sahayaSetu.controllers;

import com.sahayaSetu.dtos.*;
import com.sahayaSetu.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> registerDonor(@Valid @RequestBody DonorRegistrationDto dto) {
        return ResponseEntity.ok(authService.registerDonor(dto));
    }

    @PostMapping("/register-ngo")
    public ResponseEntity<AuthResponseDto> registerNgo(@Valid @RequestBody NgoRegistrationDto dto) {
        return ResponseEntity.ok(authService.registerNgo(dto));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<AuthResponseDto> registerAdmin(@Valid @RequestBody AdminRegistrationDto dto) {
        return ResponseEntity.ok(authService.registerAdmin(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto dto) {
        return ResponseEntity.ok(authService.loginUser(dto));
    }

    @PostMapping("/login-ngo")
    public ResponseEntity<AuthResponseDto> loginNgo(@Valid @RequestBody LoginDto dto) {
        return ResponseEntity.ok(authService.loginNgo(dto));
    }
}
