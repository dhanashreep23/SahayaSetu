package com.sahayaSetu.repositories;

import com.sahayaSetu.entities.Donation;
import com.sahayaSetu.entities.Donor;
import com.sahayaSetu.entities.FundraiserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(Donor donor);

    List<Donation> findByFundraiserRequest(FundraiserRequest request);
    
    @org.springframework.data.jpa.repository.Query("SELECT d FROM Donation d WHERE d.fundraiserRequest.ngo = :ngo")
    
    List<Donation> findDonationsByNgo(@org.springframework.data.repository.query.Param("ngo") com.sahayaSetu.entities.Ngo ngo);
}
