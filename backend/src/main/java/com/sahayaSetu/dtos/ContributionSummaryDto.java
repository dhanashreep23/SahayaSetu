package com.sahayaSetu.dtos;

import lombok.Data;
import java.util.List;

@Data
public class ContributionSummaryDto {
    private List<DonationContributionDto> donations;
    private List<ResourceContributionDto> resourceContributions;
    private List<VolunteerContributionDto> volunteerApplications;
}