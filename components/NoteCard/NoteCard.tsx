'use client';

import Link from 'next/link';
import { getSubjectColor } from '@/lib/utils';
import './NoteCard.css';

interface NoteCardProps {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    companion?: {
        id: string;
        name: string;
        subject: string;
        topic: string;
    } | null;
    onDelete?: (id: string) => void;
    onExport?: (id: string) => void;
}

const NoteCard = ({
    id,
    title,
    content,
    tags = [],
    createdAt,
    updatedAt,
    companion,
    onDelete,
    onExport
}: NoteCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete && confirm('Are you sure you want to delete this note?')) {
            onDelete(id);
        }
    };

    const handleExport = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onExport) {
            onExport(id);
        }
    };

    return (
        <div className="note-card">
            <div className="note-card-header">
                <h3 className="note-card-title">{title}</h3>
                <div className="note-card-actions">
                    {onExport && (
                        <button
                            onClick={handleExport}
                            className="note-action-btn export-btn"
                            title="Export to PDF"
                        >
                            📄
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="note-action-btn delete-btn"
                            title="Delete note"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            <p className="note-card-content">
                {content.substring(0, 200)}
                {content.length > 200 && '...'}
            </p>

            {tags && tags.length > 0 && (
                <div className="note-card-tags">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="note-tag">
                            {tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="note-tag-more">+{tags.length - 3}</span>
                    )}
                </div>
            )}

            {companion && (
                <Link href={`/mentors/${companion.id}`} className="note-mentor-link">
                    <div
                        className="mentor-badge"
                        style={{ backgroundColor: getSubjectColor(companion.subject) }}
                    >
                        <span className="mentor-name">{companion.name}</span>
                        <span className="mentor-subject">{companion.subject}</span>
                    </div>
                </Link>
            )}

            <div className="note-card-footer">
                <div className="note-dates">
                    <span className="note-date">
                        Created: {formatDate(createdAt)}
                    </span>
                    {createdAt !== updatedAt && (
                        <span className="note-date">
                            Updated: {formatDate(updatedAt)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
