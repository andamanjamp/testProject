import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import './ChatInterface.css';

export default function ChatInterface({ messages, onSendMessage }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="chat-interface">
            <div className="messages-list">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="greeting">
                            <h2>Good afternoon, User</h2>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.role}`}>
                            <div className="bubble-content">
                                {msg.role === 'ai' && <div className="ai-icon">AI</div>}
                                <div className="text-content">
                                    {msg.role === 'ai' ? (
                                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area-container">
                <form className="input-box" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="How can I help you today?"
                            rows={1}
                        />
                    </div>
                    <div className="input-actions">
                        <button type="button" className="action-btn">
                            <Paperclip size={18} />
                        </button>
                        <button type="submit" className={`send-btn ${input.trim() ? 'active' : ''}`} disabled={!input.trim()}>
                            <Send size={18} />
                        </button>
                    </div>
                </form>
                <div className="footer-text">
                    AI can make mistakes. Please verify important information.
                </div>
            </div>
        </div>
    );
}
