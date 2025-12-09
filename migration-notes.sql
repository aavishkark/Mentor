-- Migration for Note-Taking System
-- Creates notes table with full-text search capabilities

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    session_id UUID REFERENCES session_history(id) ON DELETE CASCADE,
    companion_id UUID REFERENCES companions(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    ai_summary TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_session_id ON notes(session_id);
CREATE INDEX IF NOT EXISTS idx_notes_companion_id ON notes(companion_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Create GIN index for full-text search on content
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON notes USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_notes_title_search ON notes USING gin(to_tsvector('english', title));

-- Create GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING gin(tags);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on note updates
DROP TRIGGER IF EXISTS notes_updated_at_trigger ON notes;
CREATE TRIGGER notes_updated_at_trigger
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_notes_updated_at();

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own notes
CREATE POLICY "Users can view own notes"
    ON notes FOR SELECT
    USING (auth.jwt() ->> 'sub' = user_id);

-- Users can insert their own notes
CREATE POLICY "Users can insert own notes"
    ON notes FOR INSERT
    WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update own notes"
    ON notes FOR UPDATE
    USING (auth.jwt() ->> 'sub' = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
    ON notes FOR DELETE
    USING (auth.jwt() ->> 'sub' = user_id);

-- Add comment for documentation
COMMENT ON TABLE notes IS 'Stores user notes taken during mentor sessions with markdown support and AI summaries';
COMMENT ON COLUMN notes.content IS 'Note content in markdown format';
COMMENT ON COLUMN notes.ai_summary IS 'AI-generated summary of the note content';
COMMENT ON COLUMN notes.tags IS 'Array of tags for categorizing notes';
