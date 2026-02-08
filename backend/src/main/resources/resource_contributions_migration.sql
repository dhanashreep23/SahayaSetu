-- Create resource_contributions table to track individual resource donations
CREATE TABLE resource_contributions (
    contribution_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    resource_request_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    contributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY (resource_request_id) REFERENCES requests(request_id)
);