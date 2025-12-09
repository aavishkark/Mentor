'use client';

import { useState, useEffect } from 'react';
import { getUserNotes, deleteNote, searchNotes } from '@/lib/actions/companion.action';
import NoteCard from '@/components/NoteCard/NoteCard';
import SearchNotes from '@/components/SearchNotes/SearchNotes';
import { exportNoteToPDF } from '@/lib/pdf-export';
import './notes.css';

const NotesPage = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        loadNotes();
    }, [currentPage, selectedTags]);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const result = await getUserNotes({
                page: currentPage,
                limit: 12,
                tags: selectedTags.length > 0 ? selectedTags : undefined
            });
            setNotes(result.notes);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string, tags: string[]) => {
        setSearchQuery(query);
        setSelectedTags(tags);
        setCurrentPage(1);

        if (query.trim()) {
            try {
                setLoading(true);
                const results = await searchNotes(query);

                const filtered = tags.length > 0
                    ? results.filter(note =>
                        note.tags?.some((tag: string) => tags.includes(tag))
                    )
                    : results;

                setNotes(filtered);
                setTotalPages(1);
            } catch (error) {
                console.error('Error searching notes:', error);
            } finally {
                setLoading(false);
            }
        } else {
            loadNotes();
        }
    };

    const handleDelete = async (noteId: string) => {
        try {
            await deleteNote(noteId);
            loadNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    };

    const handleExport = async (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            exportNoteToPDF({
                title: note.title,
                content: note.content,
                tags: note.tags,
                aiSummary: note.ai_summary,
                createdAt: note.created_at,
                updatedAt: note.updated_at,
                companionName: note.companion?.name
            });
        }
    };

    return (
        <main className="notes-page">
            <section className="notes-header">
                <div>
                    <h1>My Notes</h1>
                    <p className="notes-subtitle">
                        All your session notes in one place
                    </p>
                </div>
            </section>

            <SearchNotes onSearch={handleSearch} />

            {loading ? (
                <div className="notes-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading notes...</p>
                </div>
            ) : notes.length === 0 ? (
                <div className="notes-empty">
                    <div className="empty-icon">📝</div>
                    <h2>No notes found</h2>
                    <p>
                        {searchQuery || selectedTags.length > 0
                            ? 'Try adjusting your search or filters'
                            : 'Start taking notes during your mentor sessions!'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="notes-grid">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                id={note.id}
                                title={note.title}
                                content={note.content}
                                tags={note.tags}
                                createdAt={note.created_at}
                                updatedAt={note.updated_at}
                                companion={note.companion}
                                onDelete={handleDelete}
                                onExport={handleExport}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                ← Previous
                            </button>
                            <span className="pagination-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default NotesPage;
