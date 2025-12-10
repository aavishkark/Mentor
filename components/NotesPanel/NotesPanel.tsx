'use client';

import { useState, useEffect } from 'react';
import NoteEditor from '../NoteEditor/NoteEditor';
import { createNote, updateNote, getNotesBySession, generateAISummary } from '@/lib/actions/companion.action';
import './NotesPanel.css';

interface NotesPanelProps {
    sessionId: string;
    companionId: string;
    companionName?: string;
}

const NotesPanel = ({ sessionId, companionId, companionName }: NotesPanelProps) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [currentNote, setCurrentNote] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generatingSummary, setGeneratingSummary] = useState(false);

    useEffect(() => {
        loadNotes();
    }, [sessionId]);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const sessionNotes = await getNotesBySession(sessionId);
            setNotes(sessionNotes);
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: { title: string; content: string; tags: string[] }) => {
        if (!data.title.trim() || !data.content.trim()) {
            alert('Please provide both title and content');
            return;
        }

        try {
            setSaving(true);

            if (currentNote?.id) {
                await updateNote({
                    id: currentNote.id,
                    ...data
                });
            } else {
                await createNote({
                    sessionId,
                    companionId,
                    ...data
                });
            }

            await loadNotes();
            setCurrentNote(null);
            setIsCreating(false);
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note');
        } finally {
            setSaving(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (!currentNote?.id) return;

        try {
            setGeneratingSummary(true);
            const updatedNote = await generateAISummary(currentNote.id);
            setCurrentNote(updatedNote);
            await loadNotes();
        } catch (error) {
            console.error('Error generating summary:', error);
            alert('Failed to generate summary');
        } finally {
            setGeneratingSummary(false);
        }
    };

    const handleEdit = (note: any) => {
        setCurrentNote(note);
        setIsCreating(true);
    };

    const handleNewNote = () => {
        setCurrentNote(null);
        setIsCreating(true);
    };

    const handleCancel = () => {
        setCurrentNote(null);
        setIsCreating(false);
    };

    return (
        <div className="notes-panel">
            <div className="notes-panel-header">
                <div className="header-info">
                    <h3>Session Notes</h3>
                    {companionName && <p className="session-mentor">{companionName}</p>}
                </div>
                {!isCreating && notes.length > 0 && (
                    <button onClick={handleNewNote} className="new-note-btn">
                        <span className="btn-icon">+</span>
                        New Note
                    </button>
                )}
            </div>

            {loading ? (
                <div className="notes-loading">Loading notes...</div>
            ) : isCreating ? (
                <div className="note-editor-container">
                    <NoteEditor
                        initialTitle={currentNote?.title || ''}
                        initialContent={currentNote?.content || ''}
                        initialTags={currentNote?.tags || []}
                        onSave={handleSave}
                        autoSave={false}
                    />

                    {currentNote?.ai_summary && (
                        <div className="ai-summary-box">
                            <h4>AI Summary</h4>
                            <p>{currentNote.ai_summary}</p>
                        </div>
                    )}

                    <div className="editor-actions">
                        {currentNote?.id && (
                            <button
                                onClick={handleGenerateSummary}
                                className="generate-summary-btn"
                                disabled={generatingSummary}
                            >
                                {generatingSummary ? 'Generating...' : '✨ Generate Summary'}
                            </button>
                        )}
                        <button onClick={handleCancel} className="cancel-btn">
                            Cancel
                        </button>
                    </div>

                    {saving && <div className="saving-indicator">Saving...</div>}
                </div>
            ) : (
                <div className="notes-list">
                    {notes.length === 0 ? (
                        <div className="empty-notes">
                            <div className="empty-icon">📝</div>
                            <h4>No notes yet</h4>
                            <p>Capture important insights during your session</p>
                            <button onClick={handleNewNote} className="create-first-note">
                                <span className="btn-icon">+</span>
                                Create Your First Note
                            </button>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} className="note-item" onClick={() => handleEdit(note)}>
                                <h4>{note.title}</h4>
                                <p className="note-preview">
                                    {note.content.substring(0, 100)}
                                    {note.content.length > 100 && '...'}
                                </p>
                                {note.tags && note.tags.length > 0 && (
                                    <div className="note-tags">
                                        {note.tags.map((tag: string, index: number) => (
                                            <span key={index} className="tag-badge">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="note-meta">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotesPanel;
