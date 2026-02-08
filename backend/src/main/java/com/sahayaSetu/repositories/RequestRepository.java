package com.sahayaSetu.repositories;

import com.sahayaSetu.entities.Request;
import com.sahayaSetu.entities.Ngo;
import com.sahayaSetu.entities.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByNgo(Ngo ngo);

    List<Request> findByStatus(RequestStatus status);

    List<Request> findByNgoAndStatus(Ngo ngo, RequestStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Request r WHERE TYPE(r) = FundraiserRequest AND r.status = :status")
    List<com.sahayaSetu.entities.FundraiserRequest> findOpenFundraisers(
            @org.springframework.data.repository.query.Param("status") RequestStatus status);
}
