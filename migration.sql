-- Feature 2: Export Transcripts as PDF
-- Add transcript storage to session_history table

-- Add transcript column to store conversation history as JSONB
ALTER TABLE session_history 
ADD COLUMN transcript JSONB DEFAULT '[]'::jsonb;

-- Create GIN index for efficient transcript queries
CREATE INDEX idx_session_transcript ON session_history USING gin(transcript);

-- Verify the changes
COMMENT ON COLUMN session_history.transcript IS 'Stores session conversation transcript as array of {role, content, timestamp} objects';
