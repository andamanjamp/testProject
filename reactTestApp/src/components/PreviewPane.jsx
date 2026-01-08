import { Eye, Check, Undo } from 'lucide-react';
import './PreviewPane.css';
import { useState } from 'react';

export default function PreviewPane({ content, onSave, onUndo, canUndo }) {
    const [feedbackState, setFeedbackState] = useState(null); // 'saved' | 'undone' | null

    const handleSave = () => {
        onSave();
        setFeedbackState('saved');
        setTimeout(() => setFeedbackState(null), 2000);
    };

    const handleUndo = () => {
        if (!canUndo) return;
        onUndo();
        setFeedbackState('undone');
        setTimeout(() => setFeedbackState(null), 2000);
    };

    return (
        <div className="preview-pane">
            <div className="preview-header">
                <div className="header-left">
                    <Eye size={16} className="text-secondary" />
                    <span className="metadata-title">Output Preview</span>
                </div>
                <div className="header-right">
                    <div className="feedback-group">
                        {feedbackState === 'saved' && <span className="feedback-text success">Saved!</span>}
                        {feedbackState === 'undone' && <span className="feedback-text warning">Undone</span>}

                        <button className="action-btn success-btn" onClick={handleSave} title="Correct - Save File">
                            <Check size={16} />
                            <span>Correct</span>
                        </button>
                        <button
                            className={`action-btn danger-btn ${!canUndo ? 'disabled' : ''}`}
                            onClick={handleUndo}
                            disabled={!canUndo}
                            title="Undo - Revert to previous version"
                        >
                            <Undo size={16} />
                            <span>Undo</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="preview-content">
                <div className="preview-frame-container">
                    <iframe
                        srcDoc={content}
                        title="Preview"
                        className="preview-iframe"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>
        </div>
    );
}
