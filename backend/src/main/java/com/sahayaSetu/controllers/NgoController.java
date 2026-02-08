package com.sahayaSetu.controllers;

import com.sahayaSetu.dtos.*;

import com.sahayaSetu.services.NgoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngo")
public class NgoController {

    @Autowired
    private NgoService ngoService;

    // Token verification removed for testing as per user request
    // private Long getCurrentNgoId(Authentication authentication) { ... }

    @PostMapping("/requests/resource")
    public ResponseEntity<String> createResourceRequest(@Valid @RequestBody ResourceRequestDto dto,
            @RequestParam Long ngoId) {
        ngoService.createResourceRequest(ngoId, dto);
        return ResponseEntity.ok("Resource Request created successfully");
    }

    @PostMapping("/requests/volunteer")
    public ResponseEntity<String> createVolunteerRequest(@Valid @RequestBody VolunteerRequestDto dto,
            @RequestParam Long ngoId) {
        ngoService.createVolunteerRequest(ngoId, dto);
        return ResponseEntity.ok("Volunteer Request created successfully");
    }

    @PostMapping("/requests/fundraiser")
    public ResponseEntity<String> createFundraiserRequest(@Valid @RequestBody FundraiserRequestDto dto,
            @RequestParam Long ngoId) {
        ngoService.createFundraiserRequest(ngoId, dto);
        return ResponseEntity.ok("Fundraiser Request created successfully");
    }

    @GetMapping("/{ngoId}/requests")
    public ResponseEntity<List<RequestResponseDto>> getNgoRequests(@PathVariable Long ngoId) {
        return ResponseEntity.ok(ngoService.getNgoRequests(ngoId));
    }

    @GetMapping("/{ngoId}/donations")
    public ResponseEntity<List<DonationResponseDto>> getNgoDonations(@PathVariable Long ngoId) {
        return ResponseEntity.ok(ngoService.getNgoDonations(ngoId));
    }

    @PutMapping("/{ngoId}")
    public ResponseEntity<String> updateProfile(@PathVariable Long ngoId, @RequestBody NgoUpdateDto dto) {
        ngoService.updateNgoProfile(ngoId, dto);
        return ResponseEntity.ok("Profile updated");
    }

    @GetMapping("/fundraiser-donations")
    public ResponseEntity<List<DonationResponseDto>> getFundraiserDonations(@RequestParam Long ngoId) {
        return ResponseEntity.ok(ngoService.getFundraiserDonations(ngoId));
    }

    @PostMapping("/donation-response")
    public ResponseEntity<String> sendDonationResponse(@RequestBody DonationResponseRequestDto dto) {
        ngoService.sendDonationResponse(dto);
        return ResponseEntity.ok("Response sent successfully");
    }

    @PutMapping("/requests/{requestId}/close")
    public ResponseEntity<String> closeRequest(@PathVariable Long requestId, @RequestParam Long ngoId) {
        ngoService.closeRequest(requestId, ngoId);
        return ResponseEntity.ok("Request closed successfully");
    }

    @GetMapping("/requests/{requestId}/details")
    public ResponseEntity<Object> getRequestDetails(@PathVariable Long requestId) {
        return ResponseEntity.ok(ngoService.getRequestDetails(requestId));
    }
}
