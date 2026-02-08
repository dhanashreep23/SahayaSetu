package com.sahayaSetu.services;

import com.sahayaSetu.dtos.NgoResponseDto;
import com.sahayaSetu.dtos.RequestResponseDto;
import com.sahayaSetu.entities.Ngo;
import com.sahayaSetu.entities.enums.NgoStatus;
import com.sahayaSetu.repositories.NgoRepository;
import com.sahayaSetu.repositories.RequestRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private NgoRepository ngoRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<NgoResponseDto> getAllNgos() {
        return ngoRepository.findAll().stream()
                .map(ngo -> modelMapper.map(ngo, NgoResponseDto.class))
                .collect(Collectors.toList());
    }

    public List<RequestResponseDto> getAllRequests() {
        return requestRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Autowired
    private com.sahayaSetu.repositories.DonorRepository donorRepository;

    public List<com.sahayaSetu.dtos.DonorResponseDto> getAllDonors() {
        return donorRepository.findAll().stream()
                .map(donor -> {
                    com.sahayaSetu.dtos.DonorResponseDto dto = modelMapper.map(donor,
                            com.sahayaSetu.dtos.DonorResponseDto.class);
                    dto.setEmail(donor.getUser().getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private RequestResponseDto mapToDto(com.sahayaSetu.entities.Request request) {
        if (request instanceof com.sahayaSetu.entities.VolunteerRequest) {
            com.sahayaSetu.entities.VolunteerRequest vr = (com.sahayaSetu.entities.VolunteerRequest) request;
            com.sahayaSetu.dtos.VolunteerRequestResponseDto dto = modelMapper.map(vr,
                    com.sahayaSetu.dtos.VolunteerRequestResponseDto.class);
            // Manual mapping for safety
            dto.setDescription(vr.getDescription());
            dto.setSkillsRequired(vr.getSkillsRequired());
            dto.setVolunteersRequired(vr.getVolunteersRequired());
            return dto;
        } else if (request instanceof com.sahayaSetu.entities.ResourceRequest) {
            com.sahayaSetu.entities.ResourceRequest rr = (com.sahayaSetu.entities.ResourceRequest) request;
            com.sahayaSetu.dtos.ResourceRequestResponseDto dto = modelMapper.map(rr,
                    com.sahayaSetu.dtos.ResourceRequestResponseDto.class);
            // Manual mapping for safety
            dto.setResourceType(rr.getResourceType());
            dto.setQuantityRequired(rr.getQuantityRequired());
            dto.setQuantityReceived(rr.getQuantityReceived());
            return dto;
        } else if (request instanceof com.sahayaSetu.entities.FundraiserRequest) {
            com.sahayaSetu.entities.FundraiserRequest fr = (com.sahayaSetu.entities.FundraiserRequest) request;
            com.sahayaSetu.dtos.FundraiserRequestResponseDto dto = modelMapper.map(fr,
                    com.sahayaSetu.dtos.FundraiserRequestResponseDto.class);
            // Manual mapping for safety
            dto.setTargetAmount(fr.getTargetAmount());
            dto.setCollectedAmount(fr.getCollectedAmount());
            dto.setDeadline(fr.getDeadline());
            return dto;
        } else {
            return modelMapper.map(request, RequestResponseDto.class);
        }
    }

    @Autowired
    private MailService emailService;

    @Transactional
    public void approveNgo(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (ngo.getStatus() == NgoStatus.APPROVED) {
            throw new RuntimeException("NGO is already approved");
        }

        ngo.setStatus(NgoStatus.APPROVED);
        ngo.setApprovedAt(LocalDateTime.now());
        ngoRepository.save(ngo);

        emailService.sendNgoApprovalMail(ngo.getEmail(), ngo.getName());
    }

    @Transactional
    public void disapproveNgo(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (ngo.getStatus() == NgoStatus.REJECTED) {
            throw new RuntimeException("NGO is already rejected");
        }

        ngo.setStatus(NgoStatus.REJECTED);
        ngoRepository.save(ngo);

        // Send disapproval email
        emailService.sendDisapprovalEmail(ngo.getEmail(), ngo.getName());
    }

    @Transactional
    public void disableNgo(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        
        if (ngo.getStatus() == NgoStatus.DISABLED) {
            throw new RuntimeException("NGO is already disabled");
        }
        
        ngo.setStatus(NgoStatus.DISABLED);
        ngoRepository.save(ngo);
        
        // Send disable notification email
        emailService.sendNgoDisableEmail(ngo.getEmail(), ngo.getName());
    }

    @Transactional
    public void enableNgo(Long ngoId) {
        Ngo ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        ngo.setStatus(NgoStatus.APPROVED);
        ngoRepository.save(ngo);
    }
}
