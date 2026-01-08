import './CodeEditor.css';
import { FileCode } from 'lucide-react';

export default function CodeEditor({ code, onChange }) {
    return (
        <div className="code-editor-pane">
            <div className="editor-header">
                <FileCode size={16} />
                <span className="editor-title">HTML Editor</span>
            </div>
            <div className="editor-content">
                <textarea
                    className="code-textarea"
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="<h1>Type HTML here...</h1>"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
