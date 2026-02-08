package com.sahayaSetu.services;

import com.sahayaSetu.dtos.*;
import com.sahayaSetu.entities.*;
import com.sahayaSetu.entities.enums.NgoStatus;
import com.sahayaSetu.entities.enums.RequestStatus;
import com.sahayaSetu.entities.enums.RequestType;
import com.sahayaSetu.repositories.NgoRepository;
import com.sahayaSetu.repositories.RequestRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.sahayaSetu.dtos.FundraiserRequestResponseDto;
import com.sahayaSetu.dtos.ResourceRequestResponseDto;
import com.sahayaSetu.dtos.VolunteerRequestResponseDto;

@Service
public class NgoService {

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private com.sahayaSetu.repositories.DonationRepository donationRepository;

    @Autowired
    private com.sahayaSetu.repositories.VolunteerParticipationRepository volunteerParticipationRepository;

    @Autowired
    private com.sahayaSetu.repositories.ResourceContributionRepository resourceContributionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public void createResourceRequest(Long ngoId, ResourceRequestDto dto) {
        Ngo ngo = getNgoIfApproved(ngoId);
        ResourceRequest request = modelMapper.map(dto, ResourceRequest.class);
        // Manual mapping to ensure fields are set
        request.setResourceType(dto.getResourceType());
        request.setQuantityRequired(dto.getQuantityRequired());

        request.setNgo(ngo);
        request.setRequestType(RequestType.RESOURCE);
        request.setStatus(RequestStatus.OPEN);
        request.setQuantityReceived(0);
        requestRepository.save(request);
    }

    @Transactional
    public void createVolunteerRequest(Long ngoId, VolunteerRequestDto dto) {
        Ngo ngo = getNgoIfApproved(ngoId);
        VolunteerRequest request = modelMapper.map(dto, VolunteerRequest.class);
        request.setNgo(ngo);
        request.setRequestType(RequestType.VOLUNTEER);
        request.setStatus(RequestStatus.OPEN);
        requestRepository.save(request);
    }

    @Transactional
    public void createFundraiserRequest(Long ngoId, FundraiserRequestDto dto) {
        Ngo ngo = getNgoIfApproved(ngoId);
        FundraiserRequest request = modelMapper.map(dto, FundraiserRequest.class);
        request.setNgo(ngo);
        request.setRequestType(RequestType.FUNDRAISER);
        request.setStatus(RequestStatus.OPEN);
        requestRepository.save(request);
    }

    public List<RequestResponseDto> getNgoRequests(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        return requestRepository.findByNgo(ngo).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /*
     * =========================
     * 🔥 NGO VIEW DONATIONS
     * =========================
     */
    public List<DonationResponseDto> getNgoDonations(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        // Needed to inject DonationRepository since it wasn't autowired before
        return donationRepository.findDonationsByNgo(ngo).stream()
                .map(d -> {
                    DonationResponseDto dto = new DonationResponseDto();
                    dto.setDonationId(d.getDonationId());
                    dto.setDonorName(d.getDonor().getFullName());
                    dto.setDonorEmail(d.getDonor().getUser().getEmail());
                    dto.setAmount(d.getAmount());
                    dto.setFundraiserTitle(d.getFundraiserRequest().getTitle());
                    dto.setDonationDate(d.getDonatedAt());
                    dto.setResponseStatus(d.getResponseStatus());
                    dto.setResponseMessage(d.getResponseMessage());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<DonationResponseDto> getFundraiserDonations(Long ngoId) {
        return getNgoDonations(ngoId);
    }

    @Transactional
    public void sendDonationResponse(DonationResponseRequestDto dto) {
        Donation donation = donationRepository.findById(dto.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        
        donation.setResponseStatus(true);
        donation.setResponseMessage(dto.getMessage());
        donation.setResponseSentAt(java.time.LocalDateTime.now());
        
        donationRepository.save(donation);
    }

    private RequestResponseDto mapToDto(Request request) {
        if (request instanceof VolunteerRequest) {
            VolunteerRequest vr = (VolunteerRequest) request;
            VolunteerRequestResponseDto dto = modelMapper.map(vr, VolunteerRequestResponseDto.class);
            dto.setDescription(vr.getDescription());
            dto.setSkillsRequired(vr.getSkillsRequired());
            dto.setVolunteersRequired(vr.getVolunteersRequired());
            return dto;
        } else if (request instanceof ResourceRequest) {
            ResourceRequest rr = (ResourceRequest) request;
            ResourceRequestResponseDto dto = modelMapper.map(rr, ResourceRequestResponseDto.class);
            dto.setResourceType(rr.getResourceType());
            dto.setQuantityRequired(rr.getQuantityRequired());
            dto.setQuantityReceived(rr.getQuantityReceived());
            return dto;
        } else if (request instanceof FundraiserRequest) {
            FundraiserRequest fr = (FundraiserRequest) request;
            FundraiserRequestResponseDto dto = modelMapper.map(fr, FundraiserRequestResponseDto.class);
            dto.setTargetAmount(fr.getTargetAmount());
            dto.setCollectedAmount(fr.getCollectedAmount());
            dto.setDeadline(fr.getDeadline());
            return dto;
        } else {
            return modelMapper.map(request, RequestResponseDto.class);
        }
    }

    @Transactional
    public void updateNgoProfile(Long ngoId, NgoUpdateDto dto) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        modelMapper.map(dto, ngo); // Updates ngo with non-null values from dto (configured in ModelMapperConfig)

        ngoRepository.save(ngo);
    }

    private Ngo getNgoIfApproved(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        if (ngo.getStatus() != NgoStatus.APPROVED) {
            throw new RuntimeException("NGO is not approved to create requests");
        }
        return ngo;
    }

    @Transactional
    public void closeRequest(Long requestId, Long ngoId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!request.getNgo().getNgoId().equals(ngoId)) {
            throw new RuntimeException("Unauthorized to close this request");
        }
        
        if (request.getStatus() == RequestStatus.CLOSED) {
            throw new RuntimeException("Request is already closed");
        }
        
        request.setStatus(RequestStatus.CLOSED);
        requestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public Object getRequestDetails(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        java.util.Map<String, Object> details = new java.util.HashMap<>();
        
        if (request instanceof VolunteerRequest) {
            VolunteerRequest vr = (VolunteerRequest) request;
            java.util.List<com.sahayaSetu.entities.VolunteerParticipation> participations = 
                volunteerParticipationRepository.findByVolunteerRequest(vr);
            
            details.put("applicants", participations.stream().map(p -> {
                java.util.Map<String, Object> applicant = new java.util.HashMap<>();
                applicant.put("donorName", p.getDonor().getFullName());
                applicant.put("donorEmail", p.getDonor().getUser().getEmail());
                applicant.put("appliedAt", p.getJoinedAt());
                applicant.put("status", p.getStatus().toString());
                return applicant;
            }).collect(java.util.stream.Collectors.toList()));
            
        } else if (request instanceof ResourceRequest) {
            ResourceRequest rr = (ResourceRequest) request;
            java.util.List<com.sahayaSetu.entities.ResourceContribution> contributions = 
                resourceContributionRepository.findByResourceRequest(rr);
            
            details.put("contributors", contributions.stream().map(c -> {
                java.util.Map<String, Object> contributor = new java.util.HashMap<>();
                contributor.put("donorName", c.getDonor().getFullName());
                contributor.put("donorEmail", c.getDonor().getUser().getEmail());
                contributor.put("quantity", c.getQuantity());
                contributor.put("contributedAt", c.getContributedAt());
                return contributor;
            }).collect(java.util.stream.Collectors.toList()));
            
        } else if (request instanceof FundraiserRequest) {
            FundraiserRequest fr = (FundraiserRequest) request;
            java.util.List<com.sahayaSetu.entities.Donation> donations = 
                donationRepository.findByFundraiserRequest(fr);
            
            details.put("donors", donations.stream().map(d -> {
                java.util.Map<String, Object> donor = new java.util.HashMap<>();
                donor.put("donorName", d.getDonor().getFullName());
                donor.put("donorEmail", d.getDonor().getUser().getEmail());
                donor.put("amount", d.getAmount());
                donor.put("donatedAt", d.getDonatedAt() != null ? d.getDonatedAt().toString() : null);
                return donor;
            }).collect(java.util.stream.Collectors.toList()));
        }
        
        return details;
    }
}
