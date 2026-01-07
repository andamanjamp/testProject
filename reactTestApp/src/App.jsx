// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState, useRef, useEffect } from 'react';
import { Send, Code, Eye } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you modify HTML code. Paste your HTML in the middle panel and tell me what changes you\'d like to make.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (iframeRef.current) {
      const blob = new Blob([htmlInput], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [htmlInput]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are an HTML expert assistant. The user has the following HTML code:

${htmlInput}

The user wants: ${inputText}

Please provide the modified HTML code. Return ONLY the complete HTML code without any explanation, markdown formatting, or code blocks. Just the raw HTML starting with <!DOCTYPE html>.`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantReply = data.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      setMessages(prev => [...prev, { role: 'assistant', content: 'I\'ve updated the HTML in the middle panel!' }]);
      
      // Extract HTML if it's wrapped in code blocks
      let cleanedHTML = assistantReply.trim();
      if (cleanedHTML.startsWith('```')) {
        cleanedHTML = cleanedHTML.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      setHtmlInput(cleanedHTML);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel - Chat */}
      <div className="w-1/3 flex flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5" />
            AI Assistant
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg p-3 text-gray-800">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to modify the HTML..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Panel - HTML Input */}
      <div className="w-1/3 flex flex-col bg-gray-50 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            HTML Input
          </h2>
        </div>
        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
          spellCheck="false"
        />
      </div>

      {/* Right Panel - HTML Output */}
      <div className="w-1/3 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview
          </h2>
        </div>
        <iframe
          ref={iframeRef}
          title="HTML Preview"
          className="flex-1 w-full border-0 bg-white"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}