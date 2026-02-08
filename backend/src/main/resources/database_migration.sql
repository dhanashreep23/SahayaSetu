-- Add response fields to donations table for NGO-donor communication
-- Run this script on your database to add the new columns

ALTER TABLE donations 
ADD COLUMN response_status BOOLEAN DEFAULT FALSE,
ADD COLUMN response_message TEXT,
ADD COLUMN response_sent_at TIMESTAMP;

-- Update existing records to have response_status as false
UPDATE donations SET response_status = FALSE WHERE response_status IS NULL;