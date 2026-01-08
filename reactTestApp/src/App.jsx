import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import PreviewPane from './components/PreviewPane';
import CodeEditor from './components/CodeEditor';
import ProviderSelector from './components/ProviderSelector';

// Import All Services
import { sendMessageToOpenAI } from './services/openai';
import { sendMessageToClaude } from './services/claude';
import { sendMessageToAntigravity } from './services/antigravity';

import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [htmlCode, setHtmlCode] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('antigravity'); // Default to Google/Antigravity

  useEffect(() => {
    setMessages([
      { role: 'ai', content: "Hello! I'm ready to help you build. Use the menu in the sidebar to switch between AI models (OpenAI, Claude, Google)." }
    ]);
  }, []);

  const handleSendMessage = async (text) => {
    // 1. Snapshot History BEFORE updates
    setHistory(prev => [...prev, htmlCode]);

    // 2. Add user message
    const newMessage = { role: 'user', content: text };
    const newHistory = [...messages, newMessage];
    setMessages(newHistory);
    setLoading(true);

    try {
      let response;

      // 3. Switch Service based on State
      if (provider === 'openai') {
        response = await sendMessageToOpenAI(newHistory, htmlCode);
      } else if (provider === 'claude') {
        response = await sendMessageToClaude(newHistory, htmlCode);
      } else {
        // Default / Antigravity
        response = await sendMessageToAntigravity(newHistory, htmlCode);
      }

      // 4. Update State
      setHtmlCode(response.html);
      setMessages(prev => [...prev, { role: 'ai', content: response.message }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `**Error**: Could not connect to ${provider.toUpperCase()}.\n\nDetails: ${error.message}\n\nPlease check your API Key in \`src/services/${provider}.js\`.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousCode = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHtmlCode(previousCode);
    setHistory(newHistory);
  };

  const downloadFile = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const SidebarContent = (
    <div style={{ padding: '0 1rem' }}>
      <ProviderSelector
        currentProvider={provider}
        onSelect={setProvider}
      />

      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Recents</div>
        <div style={{ fontSize: '0.9rem', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'var(--bg-tertiary)' }}>
          New Chat
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      sidebarContent={SidebarContent}
      chatContent={
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loading}
        />
      }
      editorContent={
        <CodeEditor
          code={htmlCode}
          onChange={setHtmlCode}
        />
      }
      previewContent={
        <PreviewPane
          content={htmlCode}
          onSave={downloadFile}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
      }
    />
  );
}

export default App;
