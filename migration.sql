
ALTER TABLE session_history 
ADD COLUMN transcript JSONB DEFAULT '[]'::jsonb;

CREATE INDEX idx_session_transcript ON session_history USING gin(transcript);

COMMENT ON COLUMN session_history.transcript IS 'Stores session conversation transcript as array of {role, content, timestamp} objects';
