package com.sahayaSetu.services;

import com.sahayaSetu.dtos.DonationDto;
import com.sahayaSetu.dtos.RequestResponseDto;
import com.sahayaSetu.entities.*;
import com.sahayaSetu.entities.enums.RequestStatus;
import com.sahayaSetu.entities.enums.VolunteerParticipationStatus;
import com.sahayaSetu.repositories.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sahayaSetu.dtos.FundraiserRequestResponseDto;
import com.sahayaSetu.dtos.ResourceRequestResponseDto;
import com.sahayaSetu.dtos.VolunteerRequestResponseDto;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private VolunteerParticipationRepository volunteerParticipationRepository;

    @Autowired
    private ResourceContributionRepository resourceContributionRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<RequestResponseDto> getAllOpenRequests() {
        // For now, return without donor-specific info since we don't have donorId in this method
        // This will be handled by a new method that accepts donorId
        return requestRepository.findByStatus(RequestStatus.OPEN).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<RequestResponseDto> getAllOpenRequestsForDonor(Long donorId) {
        Donor donor = donorRepository.findById(donorId).orElse(null);
        return requestRepository.findByStatus(RequestStatus.OPEN).stream()
                .map(request -> mapToDtoWithDonorInfo(request, donor))
                .collect(Collectors.toList());
    }

    /* =====================================================
       🔥 GET OPEN FUNDRAISERS (SPECIFIC)
       ===================================================== */
    public List<FundraiserRequestResponseDto> getOpenFundraisers() {
        return requestRepository.findOpenFundraisers(RequestStatus.OPEN).stream()
                .map(r -> modelMapper.map(r, FundraiserRequestResponseDto.class))
                .collect(Collectors.toList());
    }

    private RequestResponseDto mapToDto(Request request) {
        return mapToDtoWithDonorInfo(request, null);
    }

    private RequestResponseDto mapToDtoWithDonorInfo(Request request, Donor donor) {
        if (request instanceof VolunteerRequest) {
            VolunteerRequest vr = (VolunteerRequest) request;
            VolunteerRequestResponseDto dto = modelMapper.map(vr, VolunteerRequestResponseDto.class);
            dto.setSkillsRequired(vr.getSkillsRequired());
            dto.setVolunteersRequired(vr.getVolunteersRequired());
            // Count current volunteers
            long currentVolunteers = volunteerParticipationRepository.countByVolunteerRequest(vr);
            dto.setVolunteerCount(currentVolunteers);
            // Check if donor has already applied
            if (donor != null) {
                boolean hasApplied = volunteerParticipationRepository.existsByDonorAndVolunteerRequest(donor, vr);
                dto.setHasApplied(hasApplied);
            }
            return dto;
        } else if (request instanceof ResourceRequest) {
            ResourceRequest rr = (ResourceRequest) request;
            ResourceRequestResponseDto dto = modelMapper.map(rr, ResourceRequestResponseDto.class);
            dto.setResourceType(rr.getResourceType());
            dto.setQuantityRequired(rr.getQuantityRequired());
            dto.setQuantityReceived(rr.getQuantityReceived());
            return dto;
        } else if (request instanceof FundraiserRequest) {
            return modelMapper.map(request, FundraiserRequestResponseDto.class);
        } else {
            return modelMapper.map(request, RequestResponseDto.class);
        }
    }

    @Transactional
    public void donateToFundraiser(Long donorId, Long requestId, DonationDto dto) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!(request instanceof FundraiserRequest)) {
            throw new RuntimeException("Request is not a fundraiser");
        }

        FundraiserRequest fundraiser = (FundraiserRequest) request;
        if (fundraiser.getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Fundraiser is closed");
        }

        // Create Donation
        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setFundraiserRequest(fundraiser);
        donation.setAmount(dto.getAmount());
        donation.setPaymentMode(dto.getPaymentMode());
        donation.setPaymentReference(dto.getPaymentReference());
        donationRepository.save(donation);

        // Update Fundraiser Collection
        fundraiser.setCollectedAmount(fundraiser.getCollectedAmount().add(dto.getAmount()));

        // Auto-close if target reached
        if (fundraiser.getCollectedAmount().compareTo(fundraiser.getTargetAmount()) >= 0) {
            fundraiser.setStatus(RequestStatus.FULFILLED);
        }

        requestRepository.save(fundraiser);
    }

    @Transactional
    public void applyForVolunteer(Long donorId, Long requestId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!(request instanceof VolunteerRequest)) {
            throw new RuntimeException("Request is not a volunteer opportunity");
        }

        VolunteerRequest volunteerRequest = (VolunteerRequest) request;
        if (volunteerRequest.getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Volunteer opportunity is closed");
        }

        // Check if already applied
        boolean alreadyApplied = volunteerParticipationRepository.existsByDonorAndVolunteerRequest(donor, volunteerRequest);
        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this volunteer opportunity");
        }

        VolunteerParticipation participation = new VolunteerParticipation();
        participation.setDonor(donor);
        participation.setVolunteerRequest(volunteerRequest);
        participation.setStatus(VolunteerParticipationStatus.APPLIED);
        volunteerParticipationRepository.save(participation);
    }

    @Transactional
    public void fulfillResourceRequest(Long donorId, Long requestId, int quantity) {
        System.out.println("🔍 fulfillResourceRequest called with donorId: " + donorId + ", requestId: " + requestId + ", quantity: " + quantity);
        
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        System.out.println("✅ Found donor: " + donor.getFullName());

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!(request instanceof ResourceRequest)) {
            throw new RuntimeException("Request is not for resources");
        }

        ResourceRequest resourceRequest = (ResourceRequest) request;
        if (resourceRequest.getStatus() != RequestStatus.OPEN) {
            throw new RuntimeException("Resource request is closed");
        }

        int current = resourceRequest.getQuantityReceived();
        int needed = resourceRequest.getQuantityRequired();

        if (current + quantity > needed) {
            throw new RuntimeException("Quantity exceeds requirement. Needed: " + (needed - current));
        }

        // Update request quantity and create contribution record
        resourceRequest.setQuantityReceived(current + quantity);
        if (resourceRequest.getQuantityReceived() >= needed) {
            resourceRequest.setStatus(RequestStatus.FULFILLED);
        }
        requestRepository.save(resourceRequest);
        System.out.println("✅ Updated resource request quantity");

        // Create ResourceContribution record
        ResourceContribution contribution = new ResourceContribution();
        contribution.setDonor(donor);
        contribution.setResourceRequest(resourceRequest);
        contribution.setQuantity(quantity);
        ResourceContribution saved = resourceContributionRepository.save(contribution);
        System.out.println("✅ Resource contribution saved: ID=" + saved.getContributionId() + ", Quantity=" + quantity);
    }

    @Transactional(readOnly = true)
    public com.sahayaSetu.dtos.ContributionSummaryDto getDonorContributions(Long donorId) {
        if (donorId == null || donorId <= 0) {
            throw new RuntimeException("Invalid donor ID provided");
        }
        
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with ID: " + donorId));

        com.sahayaSetu.dtos.ContributionSummaryDto summary = new com.sahayaSetu.dtos.ContributionSummaryDto();
        
        // Get donations (existing table)
        try {
            List<Donation> donations = donationRepository.findByDonor(donor);
            summary.setDonations(donations.stream().map(d -> {
                com.sahayaSetu.dtos.DonationContributionDto dto = new com.sahayaSetu.dtos.DonationContributionDto();
                dto.setAmount(d.getAmount());
                dto.setFundraiserTitle(d.getFundraiserRequest().getTitle());
                dto.setDonatedAt(d.getDonatedAt());
                return dto;
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            System.err.println("Error fetching donations: " + e.getMessage());
            summary.setDonations(new java.util.ArrayList<>());
        }
        
        // Get volunteer participations (existing table)
        try {
            List<VolunteerParticipation> volunteerParticipations = volunteerParticipationRepository.findByDonor(donor);
            summary.setVolunteerApplications(volunteerParticipations.stream().map(v -> {
                com.sahayaSetu.dtos.VolunteerContributionDto dto = new com.sahayaSetu.dtos.VolunteerContributionDto();
                dto.setRequestTitle(v.getVolunteerRequest().getTitle());
                dto.setStatus(v.getStatus().toString());
                dto.setAppliedAt(v.getJoinedAt());
                return dto;
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            System.err.println("Error fetching volunteer applications: " + e.getMessage());
            summary.setVolunteerApplications(new java.util.ArrayList<>());
        }
        
        // Get resource contributions
        try {
            List<ResourceContribution> resourceContributions = resourceContributionRepository.findByDonor(donor);
            System.out.println("🔍 Found " + resourceContributions.size() + " resource contributions for donor " + donorId);
            summary.setResourceContributions(resourceContributions.stream().map(r -> {
                com.sahayaSetu.dtos.ResourceContributionDto dto = new com.sahayaSetu.dtos.ResourceContributionDto();
                dto.setQuantity(r.getQuantity());
                dto.setResourceType(r.getResourceRequest().getResourceType());
                dto.setRequestTitle(r.getResourceRequest().getTitle());
                dto.setContributedAt(r.getContributedAt());
                return dto;
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            System.err.println("Error fetching resource contributions: " + e.getMessage());
            summary.setResourceContributions(new java.util.ArrayList<>());
        }
        
        return summary;
    }
}
