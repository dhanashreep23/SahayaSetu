-- Create volunteer_participation table if it doesn't exist
CREATE TABLE IF NOT EXISTS volunteer_participation (
    participation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    volunteer_request_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_request_id) REFERENCES requests(request_id),
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    UNIQUE KEY unique_volunteer_application (volunteer_request_id, donor_id)
);