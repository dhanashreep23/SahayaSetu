package com.sahayaSetu.repositories;

import com.sahayaSetu.entities.VolunteerParticipation;
import com.sahayaSetu.entities.Donor;
import com.sahayaSetu.entities.VolunteerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VolunteerParticipationRepository extends JpaRepository<VolunteerParticipation, Long> {
    List<VolunteerParticipation> findByDonor(Donor donor);

    List<VolunteerParticipation> findByVolunteerRequest(VolunteerRequest request);
    
    long countByVolunteerRequest(VolunteerRequest request);
    
    boolean existsByDonorAndVolunteerRequest(Donor donor, VolunteerRequest request);
}
