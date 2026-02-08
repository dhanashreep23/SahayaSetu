package com.sahayaSetu.controllers;

import com.sahayaSetu.dtos.NgoResponseDto;
import com.sahayaSetu.dtos.RequestResponseDto;
import com.sahayaSetu.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/ngos")
    public ResponseEntity<List<NgoResponseDto>> getAllNgos() {
        return ResponseEntity.ok(adminService.getAllNgos());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<RequestResponseDto>> getAllRequests() {
        return ResponseEntity.ok(adminService.getAllRequests());
    }

    @GetMapping("/donors")
    public ResponseEntity<List<com.sahayaSetu.dtos.DonorResponseDto>> getAllDonors() {
        return ResponseEntity.ok(adminService.getAllDonors());
    }

    @PutMapping("/ngos/{id}/approve")
    public ResponseEntity<String> approveNgo(@PathVariable Long id) {
        adminService.approveNgo(id);
        return ResponseEntity.ok("NGO approved successfully");
    }

    @PutMapping("/ngos/{id}/disapprove")
    public ResponseEntity<String> disapproveNgo(@PathVariable Long id) {
        adminService.disapproveNgo(id);
        return ResponseEntity.ok("NGO disapproved successfully");
    }

    @PutMapping("/ngos/{id}/disable")
    public ResponseEntity<String> disableNgo(@PathVariable Long id) {
        adminService.disableNgo(id);
        return ResponseEntity.ok("NGO disabled successfully");
    }

    @PutMapping("/ngos/{id}/enable")
    public ResponseEntity<String> enableNgo(@PathVariable Long id) {
        adminService.enableNgo(id);
        return ResponseEntity.ok("NGO enabled successfully");
    }
}
