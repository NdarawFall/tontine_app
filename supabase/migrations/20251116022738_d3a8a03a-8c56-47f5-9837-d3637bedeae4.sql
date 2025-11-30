-- Add database constraints for tontine input validation
-- This ensures data integrity at the database level

-- Add constraint to ensure positive amounts
ALTER TABLE tontines 
ADD CONSTRAINT positive_amount CHECK (amount > 0);

-- Add constraint to ensure valid member counts (minimum 2, maximum 100)
ALTER TABLE tontines 
ADD CONSTRAINT valid_members CHECK (max_members >= 2 AND max_members <= 100);

-- Add constraint to ensure non-negative penalty amounts
ALTER TABLE tontines 
ADD CONSTRAINT valid_penalty CHECK (penalty_amount >= 0);

-- Add constraint to ensure name is not empty and has reasonable length
ALTER TABLE tontines 
ADD CONSTRAINT valid_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100);

-- Add constraint to ensure description has reasonable length if provided
ALTER TABLE tontines 
ADD CONSTRAINT valid_description_length CHECK (description IS NULL OR char_length(description) <= 500);