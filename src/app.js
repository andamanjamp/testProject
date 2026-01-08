// ========== DOM ELEMENTS ==========
const tabs = document.querySelectorAll('.tab');
const editors = document.querySelectorAll('.editor');
const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const previewFrame = document.getElementById('previewFrame');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const newConversationBtn = document.getElementById('newConversationBtn');
const resetBtn = document.getElementById('resetBtn');
const conversationList = document.getElementById('conversationList');
const modelItems = document.querySelectorAll('.model-item');

// Sidebar and resizers
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const resizerLeft = document.getElementById('resizerLeft');
const resizerRight = document.getElementById('resizerRight');
const resizerBottom = document.getElementById('resizerBottom');

// ========== STATE ==========
// ========== STATE ==========
let currentModel = 'gpt4';
let conversations = [];
let currentConversationId = null;

// Code History State
let currentCodeState = { html: '', css: '', js: '' };
let previousCodeState = { html: '', css: '', js: '' };
let isViewingPrevious = false;

// Version Toggle Elements
const btnCurrent = document.getElementById('btnCurrent');
const btnPrevious = document.getElementById('btnPrevious');

// Toggle Version
function toggleVersion(viewPrevious) {
    if (viewPrevious === isViewingPrevious) return;

    // Save current state of editor before switching (in case of manual edits)
    if (!isViewingPrevious) {
        currentCodeState = {
            html: htmlCode.value,
            css: cssCode.value,
            js: jsCode.value
        };
    }

    isViewingPrevious = viewPrevious;

    // Update UI
    if (isViewingPrevious) {
        btnPrevious.classList.add('active');
        btnCurrent.classList.remove('active');

        // Load previous code
        htmlCode.value = previousCodeState.html || '';
        cssCode.value = previousCodeState.css || '';
        jsCode.value = previousCodeState.js || '';

        // Add visual indicator (optional)
        document.querySelector('.preview-panel .panel-header').style.background = 'linear-gradient(135deg, #718096 0%, #4a5568 100%)';
    } else {
        btnCurrent.classList.add('active');
        btnPrevious.classList.remove('active');

        // Load current code
        htmlCode.value = currentCodeState.html || '';
        cssCode.value = currentCodeState.css || '';
        jsCode.value = currentCodeState.js || '';

        // Restore header color
        document.querySelector('.preview-panel .panel-header').style.background = '';
    }

    updatePreview();
}

btnCurrent.addEventListener('click', () => toggleVersion(false));
btnPrevious.addEventListener('click', () => toggleVersion(true));

// ========== SIDEBAR TOGGLE ==========
let sidebarCollapsed = false;

toggleSidebarBtn.addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed');

    // Update CSS variable for grid layout
    const newWidth = sidebarCollapsed ? '48px' : '240px';
    document.documentElement.style.setProperty('--sidebar-width', newWidth);

    // Save state
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed);
});

// Load sidebar state
const savedSidebarState = localStorage.getItem('sidebar-collapsed');
if (savedSidebarState === 'true') {
    sidebarCollapsed = true;
    sidebar.classList.add('collapsed');
    document.documentElement.style.setProperty('--sidebar-width', '48px');
}

// ========== PANEL RESIZING ==========

// Left sidebar resizer
let isResizingLeft = false;
let startXLeft = 0;
let startWidthLeft = 0;

resizerLeft.addEventListener('mousedown', (e) => {
    isResizingLeft = true;
    startXLeft = e.clientX;
    startWidthLeft = parseInt(getComputedStyle(sidebar).width, 10);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
});

// Right panel resizer
let isResizingRight = false;
let startXRight = 0;
let startWidthRight = 0;

resizerRight.addEventListener('mousedown', (e) => {
    isResizingRight = true;
    startXRight = e.clientX;
    const editorPanel = document.querySelector('.editor-panel');
    startWidthRight = parseInt(getComputedStyle(editorPanel).width, 10);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
});

// Bottom chat panel resizer
let isResizingBottom = false;
let startYBottom = 0;
let startHeightBottom = 0;

resizerBottom.addEventListener('mousedown', (e) => {
    isResizingBottom = true;
    startYBottom = e.clientY;
    const chatPanel = document.querySelector('.chat-panel');
    startHeightBottom = parseInt(getComputedStyle(chatPanel).height, 10);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
});

// Global mouse move handler
document.addEventListener('mousemove', (e) => {
    if (isResizingLeft) {
        const deltaX = e.clientX - startXLeft;
        const newWidth = Math.max(48, Math.min(500, startWidthLeft + deltaX));
        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    }

    if (isResizingRight) {
        const deltaX = startXRight - e.clientX;
        const newWidth = Math.max(300, Math.min(800, startWidthRight + deltaX));
        document.documentElement.style.setProperty('--editor-width', `${newWidth}px`);
    }

    if (isResizingBottom) {
        const deltaY = startYBottom - e.clientY;
        const newHeight = Math.max(150, Math.min(600, startHeightBottom + deltaY));
        document.documentElement.style.setProperty('--chat-height', `${newHeight}px`);
    }
});

// Global mouse up handler
document.addEventListener('mouseup', () => {
    if (isResizingLeft || isResizingRight || isResizingBottom) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Save panel sizes
        if (isResizingLeft) {
            const sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
            localStorage.setItem('sidebar-width', sidebarWidth);
        }
        if (isResizingRight) {
            const editorWidth = getComputedStyle(document.documentElement).getPropertyValue('--editor-width');
            localStorage.setItem('editor-width', editorWidth);
        }
        if (isResizingBottom) {
            const chatHeight = getComputedStyle(document.documentElement).getPropertyValue('--chat-height');
            localStorage.setItem('chat-height', chatHeight);
        }
    }

    isResizingLeft = false;
    isResizingRight = false;
    isResizingBottom = false;
});

// Load saved panel sizes
const savedSidebarWidth = localStorage.getItem('sidebar-width');
const savedEditorWidth = localStorage.getItem('editor-width');
const savedChatHeight = localStorage.getItem('chat-height');

if (savedSidebarWidth) {
    document.documentElement.style.setProperty('--sidebar-width', savedSidebarWidth);
}
if (savedEditorWidth) {
    document.documentElement.style.setProperty('--editor-width', savedEditorWidth);
}
if (savedChatHeight) {
    document.documentElement.style.setProperty('--chat-height', savedChatHeight);
}

// ========== CODE EDITOR FUNCTIONALITY ==========

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and editors
        tabs.forEach(t => t.classList.remove('active'));
        editors.forEach(e => e.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding editor
        const lang = tab.dataset.lang;
        document.getElementById(`${lang}Editor`).classList.add('active');
    });
});

// ========== COPY / PASTE FUNCTIONALITY ==========
const copyFullBtn = document.getElementById('copyFullBtn');
const pasteFullBtn = document.getElementById('pasteFullBtn');
const pasteModal = document.getElementById('pasteModal');
const pasteInput = document.getElementById('pasteInput');
const cancelPasteBtn = document.getElementById('cancelPasteBtn');
const importPasteBtn = document.getElementById('importPasteBtn');

// Copy Full Code
copyFullBtn.addEventListener('click', () => {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${js}
    <\/script>
</body>
</html>`;

    navigator.clipboard.writeText(fullCode).then(() => {
        const originalText = copyFullBtn.innerHTML;
        copyFullBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyFullBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
});

// Paste Functionality
pasteFullBtn.addEventListener('click', () => {
    pasteInput.value = '';
    pasteModal.showModal();
});

cancelPasteBtn.addEventListener('click', () => {
    pasteModal.close();
});

importPasteBtn.addEventListener('click', () => {
    const fullCode = pasteInput.value;
    if (parseAndLoadCode(fullCode)) {
        pasteModal.close();
        // Save state immediately after import if we are in a conversation
        if (currentConversationId) {
            const currentConv = conversations.find(c => c.id === currentConversationId);
            if (currentConv) {
                currentConv.code = {
                    html: htmlCode.value,
                    css: cssCode.value,
                    js: jsCode.value
                };
                saveConversations();
            }
        }
    }
});

// Helper to parse HTML string and populate editors
function parseAndLoadCode(fullCode) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(fullCode, 'text/html');

        // Extract CSS
        // Join multiple style tags if present
        const styles = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML).join('\n\n');

        // Extract JS
        // Join multiple script tags if present
        const scripts = Array.from(doc.querySelectorAll('script')).map(s => s.innerHTML).join('\n\n');

        // Extract HTML Body (excluding script tags from body if possible, though parser moves them? 
        // DOMParser usually puts scripts in body or head depending on placement. 
        // We'll clone body and remove scripts/styles to get pure html)
        const bodyClone = doc.body.cloneNode(true);
        const bodyScripts = bodyClone.querySelectorAll('script');
        bodyScripts.forEach(s => s.remove());
        const bodyStyles = bodyClone.querySelectorAll('style');
        bodyStyles.forEach(s => s.remove());

        let bodyContent = bodyClone.innerHTML;

        // Trim whitespace
        bodyContent = bodyContent.replace(/^\s*\n/gm, '').trim();

        // Update Editors
        htmlCode.value = bodyContent;
        cssCode.value = styles.trim();
        jsCode.value = scripts.trim();

        updatePreview();
        return true;
    } catch (e) {
        console.error('Error parsing code:', e);
        alert('Error parsing HTML code. Please ensure it is valid HTML.');
        return false;
    }
}


// Live Preview Update
function updatePreview() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    // Create complete HTML document
    // NOTE: Editor now contains BODY content only, so we wrap it here
    const completeHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>
                try {
                    ${js}
                } catch (error) {
                    console.error('JavaScript Error:', error);
                }
            <\/script>
        </body>
        </html>
    `;

    // Update iframe
    const blob = new Blob([completeHTML], { type: 'text/html' });
    previewFrame.src = URL.createObjectURL(blob);
}

// Listen for code changes
htmlCode.addEventListener('input', debounce(updatePreview, 500));
cssCode.addEventListener('input', debounce(updatePreview, 500));
jsCode.addEventListener('input', debounce(updatePreview, 500));

// Debounce function to prevent excessive updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initial preview
updatePreview();

// ========== CHAT FUNCTIONALITY ==========

// Add message to chat
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (role === 'assistant') {
        const header = document.createElement('div');
        header.className = 'message-header';
        header.textContent = 'AI Assistant';
        contentDiv.appendChild(header);
    }

    const textNode = document.createTextNode(content);
    contentDiv.appendChild(textNode);

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

// Show loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant';
    loadingDiv.id = 'loadingMessage';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'loading-dots';
    dotsDiv.innerHTML = `
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
    `;

    contentDiv.appendChild(dotsDiv);
    loadingDiv.appendChild(contentDiv);
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove loading indicator
function removeLoading() {
    const loadingMsg = document.getElementById('loadingMessage');
    if (loadingMsg) {
        loadingMsg.remove();
    }
}

// Get AI Response
async function getAIResponse(userMessage, imageData = null) {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                html: html,
                css: css,
                javascript: js,
                image: imageData
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch AI response:', error);
        throw error;
    }
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    // Allow sending if there's a message OR an image (if we add image support later)
    if (!message) return;

    // Add user message to UI
    addMessage('user', message);
    messageInput.value = '';

    // Show loading
    showLoading();

    try {
        // SNAPSHOT: Save current code state before AI update
        if (!isViewingPrevious) {
            previousCodeState = { html: htmlCode.value, css: cssCode.value, js: jsCode.value };
            currentCodeState = { ...previousCodeState };
        } else {
            toggleVersion(false);
            previousCodeState = { html: htmlCode.value, css: cssCode.value, js: jsCode.value };
        }
        // Get AI response
        // Note: Image upload support can be added here by passing selected image data
        const data = await getAIResponse(message);

        // Remove loading
        removeLoading();

        // Update Editors with new code
        if (data.html) {
            htmlCode.value = data.html;
            currentCodeState.html = data.html;
        }
        if (data.css) {
            cssCode.value = data.css;
            currentCodeState.css = data.css;
        }
        if (data.javascript) {
            jsCode.value = data.javascript;
            currentCodeState.js = data.javascript;
        }

        // Trigger preview update
        updatePreview();

        // PERSISTENCE: Save updated code to conversation
        if (currentConversationId) {
            const currentConv = conversations.find(c => c.id === currentConversationId);
            if (currentConv) {
                currentConv.code = {
                    html: htmlCode.value,
                    css: cssCode.value,
                    js: jsCode.value
                };
                saveConversations();
            }
        }

        // Add AI explanation to chat
        const explanation = data.explanation || "I've updated the code based on your request.";
        addMessage('assistant', explanation);

        // Save to conversation
        saveMessageToConversation(message, explanation);

    } catch (error) {
        removeLoading();
        addMessage('assistant', 'Sorry, I encountered an error communicating with the server. Please make sure the backend is running and your API key is set.');
        console.error('Error:', error);
    }
}

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Enter key to send
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// ========== CONVERSATION MANAGEMENT ==========

// Initialize conversation
function initializeConversation() {
    const conversationId = Date.now().toString();
    currentConversationId = conversationId;

    const conversation = {
        id: conversationId,
        title: 'New Conversation',
        date: new Date().toISOString(),
        messages: [],
        model: currentModel,
        // Initial code state
        code: {
            html: `<div class="container">
    <h1>Welcome to Web Dev Playground</h1>
    <p>Start coding and see live results!</p>
</div>`,
            css: cssCode.value,
            js: jsCode.value
        }
    };

    conversations.unshift(conversation);
    saveConversations();
    return conversation;
}

// ... renameConversation and deleteConversation functions remain same ... (skipping to loadConversation logic)

// Load a conversation
function loadConversation(conversationId) {
    // Save current editor state to CURRENT conversation before switching
    if (currentConversationId) {
        const currentConv = conversations.find(c => c.id === currentConversationId);
        if (currentConv) {
            currentConv.code = {
                html: htmlCode.value,
                css: cssCode.value,
                js: jsCode.value
            };
            saveConversations();
        }
    }

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    currentConversationId = conversationId;

    // Reset UI for new chat context
    chatMessages.innerHTML = '';

    // Restore Code from this conversation (or default if missing)
    if (conversation.code) {
        htmlCode.value = conversation.code.html || '';
        cssCode.value = conversation.code.css || '';
        jsCode.value = conversation.code.js || '';

        // Update trackers
        currentCodeState = { ...conversation.code };
        // Reset previous code state since we switched context
        previousCodeState = { ...conversation.code };
        isViewingPrevious = false;

        // Reset toggle UI
        btnCurrent.classList.add('active');
        btnPrevious.classList.remove('active');
        document.querySelector('.preview-panel .panel-header').style.background = '';
    } else {
        // Legacy conversation with no saved code - keep current or clear?
        // Let's clear to avoid confusion, or keep current as "fork"? 
        // Best UX: Don't change editors if no data, BUT warn user? 
        // actually, let's just initialize it with current values so it starts tracking from here
        conversation.code = {
            html: htmlCode.value,
            css: cssCode.value,
            js: jsCode.value
        };
    }

    // Update Preview
    updatePreview();

    // Add welcome message
    addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');

    // Load messages
    conversation.messages.forEach(msg => {
        addMessage(msg.role, msg.content);
    });

    // Update UI
    updateConversationList();
}

function renameConversation(conversationId, newTitle) {
    if (!conversationId || !newTitle?.trim()) return false;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return false;

    conversation.title = newTitle.trim();
    saveConversations();
    updateConversationList();
    return true;
}

function deleteConversation(conversationId) {
    const index = conversations.findIndex(c => c.id === conversationId);
    if (index === -1) return false;

    conversations.splice(index, 1);

    // Reset current conversation if deleted
    if (currentConversationId === conversationId) {
        currentConversationId = conversations[0]?.id || null;
        if (currentConversationId) {
            loadConversation(currentConversationId);
        } else {
            // No conversations left
            chatMessages.innerHTML = '';
            addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');
        }
    }

    saveConversations();
    updateConversationList();
    return true;
}

// Save message to current conversation
function saveMessageToConversation(userMessage, aiResponse) {
    if (!currentConversationId) {
        initializeConversation();
    }

    const conversation = conversations.find(c => c.id === currentConversationId);
    if (conversation) {
        conversation.messages.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        });
        conversation.messages.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
        });

        // Update title based on first message
        if (conversation.messages.length === 2) {
            conversation.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
        }

        saveConversations();
        updateConversationList();
    }
}

// Save conversations to localStorage
function saveConversations() {
    localStorage.setItem('webdev_conversations', JSON.stringify(conversations));
}

// Load conversations from localStorage
function loadConversations() {
    const saved = localStorage.getItem('webdev_conversations');
    if (saved) {
        conversations = JSON.parse(saved);
    }
}

// Update conversation list UI
function updateConversationList() {
    conversationList.innerHTML = '';

    conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        if (conv.id === currentConversationId) {
            item.classList.add('active');
        }

        // Title and Date container
        const infoDiv = document.createElement('div');
        infoDiv.className = 'conversation-info';

        const title = document.createElement('div');
        title.className = 'conversation-title';
        title.textContent = conv.title;

        const date = document.createElement('div');
        date.className = 'conversation-date';
        date.textContent = formatDate(conv.date);

        infoDiv.appendChild(title);
        infoDiv.appendChild(date);

        // Actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'conversation-actions';

        const renameBtn = document.createElement('button');
        renameBtn.className = 'action-btn rename-btn';
        renameBtn.innerHTML = '✏️';
        renameBtn.title = 'Rename';
        renameBtn.onclick = (e) => {
            e.stopPropagation();
            const newTitle = prompt('Enter new title:', conv.title);
            if (newTitle) renameConversation(conv.id, newTitle);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteConversation(conv.id);
        };

        actionsDiv.appendChild(renameBtn);
        actionsDiv.appendChild(deleteBtn);

        item.appendChild(infoDiv);
        item.appendChild(actionsDiv);

        item.addEventListener('click', () => loadConversation(conv.id));

        conversationList.appendChild(item);
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

// New conversation

// New conversation
newConversationBtn.addEventListener('click', () => {
    initializeConversation();
    chatMessages.innerHTML = '';
    addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');
    updateConversationList();
});

// Reset conversation
resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the current conversation?')) {
        chatMessages.innerHTML = '';
        addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');

        if (currentConversationId) {
            const conversation = conversations.find(c => c.id === currentConversationId);
            if (conversation) {
                conversation.messages = [];
                saveConversations();
            }
        }
    }
});

// ========== MODEL SELECTION ==========
modelItems.forEach(item => {
    item.addEventListener('click', () => {
        modelItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentModel = item.dataset.model;

        const modelName = item.querySelector('.model-name').textContent;
        addMessage('assistant', `Switched to ${modelName} model.`);
    });
});

// ========== INITIALIZATION ==========
loadConversations();
if (conversations.length > 0) {
    updateConversationList();
} else {
    initializeConversation();
    updateConversationList();
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        updatePreview();
    }

    // Ctrl/Cmd + K to focus chat input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }

    // Ctrl/Cmd + B to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebarBtn.click();
    }
});

console.log('🚀 Web Dev Playground initialized!');
console.log('💡 Shortcuts: Ctrl+Enter (update preview) | Ctrl+K (focus chat) | Ctrl+B (toggle sidebar)');
