package com.sahayaSetu.repositories;

import com.sahayaSetu.entities.ResourceContribution;
import com.sahayaSetu.entities.Donor;
import com.sahayaSetu.entities.ResourceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceContributionRepository extends JpaRepository<ResourceContribution, Long> {
    List<ResourceContribution> findByDonor(Donor donor);
    List<ResourceContribution> findByResourceRequest(ResourceRequest resourceRequest);
}