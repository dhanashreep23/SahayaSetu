package com.sahayaSetu.entities;

import com.sahayaSetu.entities.enums.VolunteerParticipationStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "volunteer_participation")
@Data
public class VolunteerParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participation_id")
    private Long participationId;

    @ManyToOne
    @JoinColumn(name = "volunteer_request_id", nullable = false)
    private VolunteerRequest volunteerRequest;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VolunteerParticipationStatus status = VolunteerParticipationStatus.APPLIED;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;
}
