import { useState } from 'react';
import { Menu } from 'lucide-react';
import './Layout.css';

export default function Layout({
    chatContent,
    editorContent,
    previewContent,
    sidebarContent
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="layout-container">
            {/* 1. Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={20} />
                    </button>
                    {sidebarOpen && <span className="logo-text">Claude Mock</span>}
                </div>
                {sidebarOpen && sidebarContent}
            </div>

            {/* 2. Chat Area */}
            <section className="pane chat-pane">
                {chatContent}
            </section>

            {/* 3. Editor Area */}
            <section className="pane editor-pane">
                {editorContent}
            </section>

            {/* 4. Preview Area */}
            <section className="pane preview-pane-wrapper">
                {previewContent}
            </section>
        </div>
    );
}
