import { ChevronDown, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './ProviderSelector.css';

const PROVIDERS = [
    { id: 'openai', name: 'OpenAI', model: 'GPT-4o', color: '#10a37f' },
    { id: 'antigravity', name: 'Google', model: 'Gemini 1.5 Pro', color: '#4285F4' },
    { id: 'claude', name: 'Anthropic', model: 'Claude 3.5 Sonnet', color: '#D97757' },
];

export default function ProviderSelector({ currentProvider, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const activeProvider = PROVIDERS.find(p => p.id === currentProvider) || PROVIDERS[0];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="provider-selector" ref={dropdownRef}>
            <label className="selector-label">AI Model</label>
            <button
                className="selector-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{ borderColor: isOpen ? activeProvider.color : 'transparent' }}
            >
                <div className="btn-content">
                    <Cpu size={16} style={{ color: activeProvider.color }} />
                    <div className="provider-info">
                        <span className="provider-name">{activeProvider.name}</span>
                        <span className="model-name">{activeProvider.model}</span>
                    </div>
                </div>
                <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {PROVIDERS.map(provider => (
                        <button
                            key={provider.id}
                            className={`dropdown-item ${currentProvider === provider.id ? 'active' : ''}`}
                            onClick={() => {
                                onSelect(provider.id);
                                setIsOpen(false);
                            }}
                        >
                            <div
                                className="provider-dot"
                                style={{ backgroundColor: provider.color }}
                            />
                            <div className="item-info">
                                <span className="item-name">{provider.name}</span>
                                <span className="item-model">{provider.model}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
