'use client';

import { useState, useEffect } from 'react';
import { searchNotes, getAllTags } from '@/lib/actions/companion.action';
import './SearchNotes.css';

interface SearchNotesProps {
    onSearch: (query: string, tags: string[]) => void;
}

const SearchNotes = ({ onSearch }: SearchNotesProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    useEffect(() => {
        loadAvailableTags();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery, selectedTags);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedTags]);

    const loadAvailableTags = async () => {
        try {
            const tags = await getAllTags();
            setAvailableTags(tags);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTags([]);
    };

    return (
        <div className="search-notes">
            <div className="search-input-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-icon">🔍</span>
            </div>

            <div className="filter-controls">
                <div className="tag-filter-container">
                    <button
                        className="tag-filter-btn"
                        onClick={() => setShowTagDropdown(!showTagDropdown)}
                    >
                        🏷️ Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                    </button>

                    {showTagDropdown && (
                        <div className="tag-dropdown">
                            {availableTags.length === 0 ? (
                                <div className="no-tags">No tags available</div>
                            ) : (
                                availableTags.map((tag) => (
                                    <label key={tag} className="tag-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => toggleTag(tag)}
                                        />
                                        <span>{tag}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {(searchQuery || selectedTags.length > 0) && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        ✕ Clear Filters
                    </button>
                )}
            </div>

            {selectedTags.length > 0 && (
                <div className="active-tags">
                    {selectedTags.map((tag) => (
                        <span key={tag} className="active-tag">
                            {tag}
                            <button onClick={() => toggleTag(tag)} className="remove-tag-btn">
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchNotes;
