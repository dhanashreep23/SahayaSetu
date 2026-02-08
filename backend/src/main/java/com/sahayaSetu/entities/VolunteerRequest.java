package com.sahayaSetu.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "volunteer_requests")
@Data
@EqualsAndHashCode(callSuper = true)
public class VolunteerRequest extends Request {

    @Column(name = "skills_required")
    private String skillsRequired;

    @Column(name = "volunteers_required", nullable = false)
    private int volunteersRequired;
}
