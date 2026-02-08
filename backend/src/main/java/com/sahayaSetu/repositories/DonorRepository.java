package com.sahayaSetu.repositories;

import com.sahayaSetu.entities.Donor;
import com.sahayaSetu.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByUser(User user);
}
