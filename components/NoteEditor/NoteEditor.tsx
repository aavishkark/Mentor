'use client';

import { useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './NoteEditor.css';

interface NoteEditorProps {
    initialTitle?: string;
    initialContent?: string;
    initialTags?: string[];
    onSave?: (data: { title: string; content: string; tags: string[] }) => void;
    onChange?: (data: { title: string; content: string; tags: string[] }) => void;
    autoSave?: boolean;
    autoSaveDelay?: number;
}

const NoteEditor = ({
    initialTitle = '',
    initialContent = '',
    initialTags = [],
    onSave,
    onChange,
    autoSave = true,
    autoSaveDelay = 2000
}: NoteEditorProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [tagInput, setTagInput] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        const words = content.trim().split(/\s+/).filter(w => w.length > 0);
        setWordCount(words.length);
        setCharCount(content.length);
    }, [content]);

    useEffect(() => {
        if (!autoSave || !onChange) return;

        const timer = setTimeout(() => {
            onChange({ title, content, tags });
        }, autoSaveDelay);

        return () => clearTimeout(timer);
    }, [title, content, tags, autoSave, autoSaveDelay, onChange]);

    const insertMarkdown = (syntax: string, cursorOffset = 0) => {
        const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let newText = '';
        let newCursorPos = start;

        switch (syntax) {
            case 'bold':
                newText = `**${selectedText || 'bold text'}**`;
                newCursorPos = start + 2 + (selectedText ? selectedText.length : 0);
                break;
            case 'italic':
                newText = `*${selectedText || 'italic text'}*`;
                newCursorPos = start + 1 + (selectedText ? selectedText.length : 0);
                break;
            case 'heading':
                newText = `## ${selectedText || 'Heading'}`;
                newCursorPos = start + 3 + (selectedText ? selectedText.length : 0);
                break;
            case 'list':
                newText = `- ${selectedText || 'List item'}`;
                newCursorPos = start + 2 + (selectedText ? selectedText.length : 0);
                break;
            case 'code':
                newText = `\`${selectedText || 'code'}\``;
                newCursorPos = start + 1 + (selectedText ? selectedText.length : 0);
                break;
            case 'codeblock':
                newText = `\`\`\`\n${selectedText || 'code block'}\n\`\`\``;
                newCursorPos = start + 4 + (selectedText ? selectedText.length : 0);
                break;
            default:
                return;
        }

        const newContent = content.substring(0, start) + newText + content.substring(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave({ title, content, tags });
        }
    };

    return (
        <div className="note-editor">
            <div className="note-editor-header">
                <input
                    type="text"
                    className="note-title-input"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="markdown-toolbar">
                <button onClick={() => insertMarkdown('bold')} title="Bold" type="button">
                    <strong>B</strong>
                </button>
                <button onClick={() => insertMarkdown('italic')} title="Italic" type="button">
                    <em>I</em>
                </button>
                <button onClick={() => insertMarkdown('heading')} title="Heading" type="button">
                    H
                </button>
                <button onClick={() => insertMarkdown('list')} title="List" type="button">
                    ≡
                </button>
                <button onClick={() => insertMarkdown('code')} title="Inline Code" type="button">
                    {'<>'}
                </button>
                <button onClick={() => insertMarkdown('codeblock')} title="Code Block" type="button">
                    {'{ }'}
                </button>
                <div className="toolbar-divider"></div>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={showPreview ? 'active' : ''}
                    type="button"
                >
                    {showPreview ? '✏️ Edit' : '👁️ Preview'}
                </button>
            </div>

            <div className="note-editor-body">
                {showPreview ? (
                    <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content || '*No content to preview*'}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <TextareaAutosize
                        id="note-content"
                        className="note-content-input"
                        placeholder="Start writing your notes... (Markdown supported)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        minRows={10}
                        maxRows={30}
                    />
                )}
            </div>

            <div className="note-editor-footer">
                <div className="tag-section">
                    <input
                        type="text"
                        className="tag-input"
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={addTag} className="add-tag-btn" type="button">
                        + Add
                    </button>
                    <div className="tags-list">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="remove-tag" type="button">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="editor-stats">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{charCount} characters</span>
                </div>

                {onSave && (
                    <button onClick={handleSave} className="save-btn" type="button">
                        Save Note
                    </button>
                )}
            </div>
        </div>
    );
};

export default NoteEditor;
