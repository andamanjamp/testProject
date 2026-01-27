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
const newPageBtn = document.getElementById('newPageBtn');
const resetBtn = document.getElementById('resetBtn');
const conversationList = document.getElementById('conversationList');
const pageList = document.getElementById('pageList');
const modelItems = document.querySelectorAll('.model-item');

// Sidebar and resizers
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const resizerLeft = document.getElementById('resizerLeft');
const resizerRight = document.getElementById('resizerRight');
const resizerBottom = document.getElementById('resizerBottom');

// ========== STATE ==========
let currentModel = 'gpt4';
let conversations = [];
let pages = [];
let currentConversationId = null;
let currentPageId = null;
let currentAttachment = null;

// Template Mock Data
const templateComponents = [
    {
        id: 'template-hero-1',
        title: 'Hero Section - Modern',
        category: 'Hero',
        code: {
            html: `<section class="hero-modern">
    <div class="hero-content">
        <h1 class="hero-title">Build Something Amazing</h1>
        <p class="hero-subtitle">Create stunning websites with our powerful tools and intuitive interface</p>
        <div class="hero-buttons">
            <button class="btn-primary">Get Started</button>
            <button class="btn-secondary">Learn More</button>
        </div>
    </div>
</section>`,
            css: `.hero-modern {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 120px 20px;
    text-align: center;
    color: white;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 56px;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 20px;
    opacity: 0.9;
    margin-bottom: 32px;
}

.hero-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.btn-primary, .btn-secondary {
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: white;
    color: #667eea;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255,255,255,0.3);
}

.btn-secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: rgba(255,255,255,0.3);
}`,
            js: `document.querySelectorAll('.hero-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Button clicked:', btn.textContent);
    });
});`
        }
    },
    {
        id: 'template-card-1',
        title: 'Feature Cards - 3 Column',
        category: 'Cards',
        code: {
            html: `<section class="features-section">
    <div class="container">
        <h2 class="section-title">Our Features</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🚀</div>
                <h3>Fast Performance</h3>
                <p>Lightning-fast load times and optimized code for the best user experience</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎨</div>
                <h3>Beautiful Design</h3>
                <p>Stunning visuals and modern aesthetics that captivate your audience</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>Secure & Safe</h3>
                <p>Enterprise-grade security to keep your data protected at all times</p>
            </div>
        </div>
    </div>
</section>`,
            css: `.features-section {
    padding: 80px 20px;
    background: #f9fafb;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    text-align: center;
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 60px;
    color: #1f2937;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
}

.feature-card {
    background: white;
    padding: 40px 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.feature-icon {
    font-size: 48px;
    margin-bottom: 20px;
}

.feature-card h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1f2937;
}

.feature-card p {
    color: #6b7280;
    line-height: 1.6;
}`,
            js: `const cards = document.querySelectorAll('.feature-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderLeft = '4px solid #667eea';
    });
    card.addEventListener('mouseleave', () => {
        card.style.borderLeft = 'none';
    });
});`
        }
    },
    {
        id: 'template-navbar-1',
        title: 'Navigation Bar - Transparent',
        category: 'Navigation',
        code: {
            html: `<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <span class="logo-icon">🎯</span>
            <span class="logo-text">BrandName</span>
        </div>
        <ul class="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="nav-cta">Sign Up</button>
    </div>
</nav>`,
            css: `.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
}

.logo-icon {
    font-size: 28px;
}

.nav-menu {
    display: flex;
    gap: 32px;
    list-style: none;
    margin: 0;
}

.nav-menu a {
    text-decoration: none;
    color: #4b5563;
    font-weight: 500;
    transition: color 0.2s;
}

.nav-menu a:hover {
    color: #667eea;
}

.nav-cta {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.nav-cta:hover {
    transform: translateY(-2px);
}`,
            js: `window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});`
        }
    },
    {
        id: 'template-footer-1',
        title: 'Footer - Multi Column',
        category: 'Footer',
        code: {
            html: `<footer class="footer">
    <div class="footer-container">
        <div class="footer-column">
            <h4>Company</h4>
            <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Product</h4>
            <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Security</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <h4>Support</h4>
            <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Status</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2024 BrandName. All rights reserved.</p>
    </div>
</footer>`,
            css: `.footer {
    background: #1f2937;
    color: white;
    padding: 60px 20px 20px;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
}

.footer-column h4 {
    font-size: 18px;
    margin-bottom: 16px;
    color: white;
}

.footer-column ul {
    list-style: none;
    padding: 0;
}

.footer-column ul li {
    margin-bottom: 12px;
}

.footer-column a {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-column a:hover {
    color: white;
}

.footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #374151;
    color: #9ca3af;
    font-size: 14px;
}`,
            js: ``
        }
    }
];

// Code History State (Undo/Redo)
let codeHistory = [];
let historyIndex = -1;
const MAX_HISTORY = 50;

// Version Toggle Elements
const btnUndo = document.getElementById('btnPrevious');
const btnRedo = document.getElementById('btnCurrent');

// Rename buttons
if (btnUndo) btnUndo.textContent = 'Undo';
if (btnRedo) btnRedo.textContent = 'Redo';

// Save current state to history
function saveToHistory() {
    const currentState = {
        html: htmlCode.value,
        css: cssCode.value,
        js: jsCode.value,
        timestamp: Date.now()
    };
    
    // Remove any forward history when making a new change
    if (historyIndex < codeHistory.length - 1) {
        codeHistory = codeHistory.slice(0, historyIndex + 1);
    }
    
    // Add new state
    codeHistory.push(currentState);
    
    // Limit history size
    if (codeHistory.length > MAX_HISTORY) {
        codeHistory.shift();
    } else {
        historyIndex++;
    }
    
    updateHistoryButtons();
}

// Undo function
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const state = codeHistory[historyIndex];
        
        htmlCode.value = state.html;
        cssCode.value = state.css;
        jsCode.value = state.js;
        
        updatePreview();
        updateHistoryButtons();
        
        // Save to conversation
        if (currentConversationId) {
            const conv = conversations.find(c => c.id === currentConversationId);
            if (conv) {
                conv.code = { html: state.html, css: state.css, js: state.js };
                saveConversations();
            }
        }
    }
}

// Redo function
function redo() {
    if (historyIndex < codeHistory.length - 1) {
        historyIndex++;
        const state = codeHistory[historyIndex];
        
        htmlCode.value = state.html;
        cssCode.value = state.css;
        jsCode.value = state.js;
        
        updatePreview();
        updateHistoryButtons();
        
        // Save to conversation
        if (currentConversationId) {
            const conv = conversations.find(c => c.id === currentConversationId);
            if (conv) {
                conv.code = { html: state.html, css: state.css, js: state.js };
                saveConversations();
            }
        }
    }
}

// Update button states
function updateHistoryButtons() {
    if (btnUndo) {
        btnUndo.disabled = historyIndex <= 0;
        btnUndo.style.opacity = historyIndex <= 0 ? '0.5' : '1';
        btnUndo.style.cursor = historyIndex <= 0 ? 'not-allowed' : 'pointer';
    }
    
    if (btnRedo) {
        btnRedo.disabled = historyIndex >= codeHistory.length - 1;
        btnRedo.style.opacity = historyIndex >= codeHistory.length - 1 ? '0.5' : '1';
        btnRedo.style.cursor = historyIndex >= codeHistory.length - 1 ? 'not-allowed' : 'pointer';
    }
}

// Bind buttons
if (btnUndo) btnUndo.addEventListener('click', undo);
if (btnRedo) btnRedo.addEventListener('click', redo);

// ========== SIDEBAR TOGGLE ==========
let sidebarCollapsed = false;

toggleSidebarBtn.addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed');

    const newWidth = sidebarCollapsed ? '48px' : '240px';
    document.documentElement.style.setProperty('--sidebar-width', newWidth);

    localStorage.setItem('sidebar-collapsed', sidebarCollapsed);
});

const savedSidebarState = localStorage.getItem('sidebar-collapsed');
if (savedSidebarState === 'true') {
    sidebarCollapsed = true;
    sidebar.classList.add('collapsed');
    document.documentElement.style.setProperty('--sidebar-width', '48px');
}

// ========== PANEL RESIZING ==========
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

document.addEventListener('mouseup', () => {
    if (isResizingLeft || isResizingRight || isResizingBottom) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

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
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        editors.forEach(e => e.classList.remove('active'));

        tab.classList.add('active');

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
        saveToHistory();
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

function parseAndLoadCode(fullCode) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(fullCode, 'text/html');

        const styles = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML).join('\n\n');
        const scripts = Array.from(doc.querySelectorAll('script')).map(s => s.innerHTML).join('\n\n');

        const bodyClone = doc.body.cloneNode(true);
        const bodyScripts = bodyClone.querySelectorAll('script');
        bodyScripts.forEach(s => s.remove());
        const bodyStyles = bodyClone.querySelectorAll('style');
        bodyStyles.forEach(s => s.remove());

        let bodyContent = bodyClone.innerHTML;
        bodyContent = bodyContent.replace(/^\s*\n/gm, '').trim();

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

function updatePreview() {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

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

    const blob = new Blob([completeHTML], { type: 'text/html' });
    previewFrame.src = URL.createObjectURL(blob);
}

htmlCode.addEventListener('input', debounce(() => {
    saveToHistory();
    updatePreview();
}, 1000));

cssCode.addEventListener('input', debounce(() => {
    saveToHistory();
    updatePreview();
}, 1000));

jsCode.addEventListener('input', debounce(() => {
    saveToHistory();
    updatePreview();
}, 1000));

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

updatePreview();

// ========== CHAT FUNCTIONALITY ==========
function addMessage(role, content, attachment = null) {
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

    if (attachment && role === 'user') {
        const attachmentDiv = document.createElement('div');
        attachmentDiv.className = 'attachment-indicator';
        attachmentDiv.innerHTML = `
            <img src="${attachment.dataUrl}" alt="Attachment">
            <span>📎 ${attachment.name}</span>
        `;
        contentDiv.appendChild(attachmentDiv);
    }

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

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

function removeLoading() {
    const loadingMsg = document.getElementById('loadingMessage');
    if (loadingMsg) {
        loadingMsg.remove();
    }
}

async function getAIResponse(userMessage, imageData = null) {
    const html = htmlCode.value;
    const css = cssCode.value;
    const js = jsCode.value;

    try {
        const response = await fetch(`http://localhost:3009/api/chat`, {
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

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message && !currentAttachment) return;

    const attachmentToSend = currentAttachment;

    addMessage('user', message || '(Image attached)', attachmentToSend);
    messageInput.value = '';
    
    if (currentAttachment) {
        currentAttachment = null;
        const attachmentSection = document.getElementById('attachmentSection');
        const attachmentPreview = document.getElementById('attachmentPreview');
        attachmentSection.style.display = 'none';
        attachmentPreview.innerHTML = '';
    }

    showLoading();

    try {
        saveToHistory();
        
        const imageData = attachmentToSend ? attachmentToSend.dataUrl : null;
        const data = await getAIResponse(message || 'Please analyze this image and update the code accordingly', imageData);

        removeLoading();

        if (data.html) htmlCode.value = data.html;
        if (data.css) cssCode.value = data.css;
        if (data.javascript) jsCode.value = data.javascript;

        saveToHistory();
        updatePreview();

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

        const explanation = data.explanation || "I've updated the code based on your request.";
        addMessage('assistant', explanation);

        const userMessageContent = message || '(Image attached)';
        saveMessageToConversation(userMessageContent, explanation);

    } catch (error) {
        removeLoading();
        addMessage('assistant', 'Sorry, I encountered an error communicating with the server. Please make sure the backend is running and your API key is set.');
        console.error('Error:', error);
    }
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (messageInput.value.trim() || currentAttachment) {
            sendMessage();
        }
    }
});

// ========== SHAPE SELECTION FOR AI EDITING (IMPROVED) ==========
const shapeSelectBtn = document.getElementById('shapeSelectBtn');
const shapeModal = document.getElementById('shapeModal');
const cancelShapeBtn = document.getElementById('cancelShapeBtn');
const shapeOptionBtns = document.querySelectorAll('.shape-option-btn');
const selectionCanvas = document.getElementById('selectionCanvas');
const selectionInfo = document.getElementById('selectionInfo');
const editSelectionModal = document.getElementById('editSelectionModal');
const selectedElementsInfo = document.getElementById('selectedElementsInfo');
const editInstructionInput = document.getElementById('editInstructionInput');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const sendEditBtn = document.getElementById('sendEditBtn');

let isSelectionMode = false;
let selectedShape = null;
let isDrawing = false;
let startX = 0;
let startY = 0;

// Store multiple selections with their shapes
let allSelections = []; // Array of {bounds, elements, number, shape}
let selectionCounter = 1;

// Open shape selection modal
shapeSelectBtn.addEventListener('click', () => {
    if (isSelectionMode) {
        // If already in selection mode, show options to finish or continue
        if (allSelections.length > 0) {
            const action = confirm(`You have ${allSelections.length} selection(s). Click OK to finish and edit, or Cancel to continue selecting.`);
            if (action) {
                finishSelection();
            }
        } else {
            deactivateSelectionMode();
        }
    } else {
        shapeModal.showModal();
    }
});

// Cancel shape selection
cancelShapeBtn.addEventListener('click', () => {
    shapeModal.close();
});

// Select shape and activate selection mode
shapeOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedShape = btn.dataset.shape;
        shapeModal.close();
        activateSelectionMode();
    });
});

function activateSelectionMode() {
    isSelectionMode = true;
    shapeSelectBtn.classList.add('active');
    shapeSelectBtn.title = 'Finish selection';
    
    // Reset selections if starting fresh
    if (allSelections.length === 0) {
        selectionCounter = 1;
    }
    
    // Setup canvas
    const previewWrapper = document.querySelector('.preview-wrapper');
    const rect = previewWrapper.getBoundingClientRect();
    
    selectionCanvas.width = rect.width - 24;
    selectionCanvas.height = rect.height - 24;
    selectionCanvas.style.display = 'block';
    selectionCanvas.classList.add('active');
    
    // Show info
    updateSelectionInfo();
    
    // Add event listeners
    selectionCanvas.addEventListener('mousedown', handleSelectionStart);
    selectionCanvas.addEventListener('mousemove', handleSelectionMove);
    selectionCanvas.addEventListener('mouseup', handleSelectionEnd);
    
    // Redraw existing selections
    redrawAllSelections();
}

function deactivateSelectionMode() {
    isSelectionMode = false;
    shapeSelectBtn.classList.remove('active');
    shapeSelectBtn.title = 'Select area to edit';
    
    selectionCanvas.style.display = 'none';
    selectionCanvas.classList.remove('active');
    selectionInfo.style.display = 'none';
    
    // Remove event listeners
    selectionCanvas.removeEventListener('mousedown', handleSelectionStart);
    selectionCanvas.removeEventListener('mousemove', handleSelectionMove);
    selectionCanvas.removeEventListener('mouseup', handleSelectionEnd);
    
    // Clear canvas and selections
    const ctx = selectionCanvas.getContext('2d');
    ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    
    allSelections = [];
    selectionCounter = 1;
    selectedShape = null;
}

function updateSelectionInfo() {
    const shapeType = selectedShape || 'shape';
    const count = allSelections.length;
    selectionInfo.innerHTML = `
        <strong>Selection Mode Active</strong><br>
        Drawing: ${shapeType} | Selected: ${count} area(s)<br>
        <small>Click and drag to select. Click the button above to finish.</small>
    `;
    selectionInfo.style.display = 'block';
}

function handleSelectionStart(e) {
    isDrawing = true;
    const rect = selectionCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
}

function handleSelectionMove(e) {
    if (!isDrawing) return;
    
    const rect = selectionCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // Redraw all existing selections first
    redrawAllSelections();
    
    // Draw current shape being created
    const ctx = selectionCanvas.getContext('2d');
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
    ctx.setLineDash([5, 5]); // Dashed line for current drawing
    
    if (selectedShape === 'rectangle') {
        const width = currentX - startX;
        const height = currentY - startY;
        ctx.fillRect(startX, startY, width, height);
        ctx.strokeRect(startX, startY, width, height);
    } else if (selectedShape === 'circle') {
        const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    
    ctx.setLineDash([]); // Reset dash
}

function handleSelectionEnd(e) {
    if (!isDrawing) return;
    isDrawing = false;
    
    const rect = selectionCanvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    // Ignore very small selections (likely accidental clicks)
    const minSize = 10;
    if (Math.abs(endX - startX) < minSize && Math.abs(endY - startY) < minSize) {
        redrawAllSelections();
        return;
    }
    
    // Calculate selection bounds
    const selectionBounds = calculateSelectionBounds(startX, startY, endX, endY);
    
    // Find elements in selection
    const elements = findElementsInSelection(selectionBounds);
    
    if (elements.length > 0) {
        // Store this selection
        allSelections.push({
            bounds: selectionBounds,
            elements: elements,
            number: selectionCounter++,
            shape: selectedShape
        });
        
        // Redraw all selections with their numbers
        redrawAllSelections();
        updateSelectionInfo();
        
        // Provide feedback
        console.log(`Selection #${selectionCounter - 1}: Found ${elements.length} element(s)`);
    } else {
        alert('No elements found in selection. Try selecting a larger area or different location.');
        redrawAllSelections();
    }
}

function redrawAllSelections() {
    const ctx = selectionCanvas.getContext('2d');
    ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    
    allSelections.forEach((selection, index) => {
        const bounds = selection.bounds;
        const number = selection.number;
        
        // Draw shape
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.setLineDash([]);
        
        if (bounds.shape === 'rectangle') {
            const width = bounds.right - bounds.left;
            const height = bounds.bottom - bounds.top;
            ctx.fillRect(bounds.left, bounds.top, width, height);
            ctx.strokeRect(bounds.left, bounds.top, width, height);
            
            // Draw number label
            drawNumberLabel(ctx, bounds.left + 5, bounds.top + 5, number);
        } else if (bounds.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(bounds.centerX, bounds.centerY, bounds.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            
            // Draw number label at center
            drawNumberLabel(ctx, bounds.centerX - 10, bounds.centerY - 10, number);
        }
    });
}

function drawNumberLabel(ctx, x, y, number) {
    // Draw background circle
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(x + 12, y + 12, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw number
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), x + 12, y + 13);
}

function calculateSelectionBounds(x1, y1, x2, y2) {
    if (selectedShape === 'rectangle') {
        return {
            left: Math.min(x1, x2),
            top: Math.min(y1, y2),
            right: Math.max(x1, x2),
            bottom: Math.max(y1, y2),
            shape: 'rectangle'
        };
    } else if (selectedShape === 'circle') {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return {
            centerX: x1,
            centerY: y1,
            radius: radius,
            shape: 'circle'
        };
    }
}

function findElementsInSelection(bounds) {
    const elements = [];
    
    try {
        const iframe = document.getElementById('previewFrame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        if (!iframeDoc || !iframeDoc.body) {
            console.error('Cannot access iframe document');
            return elements;
        }
        
        const allElements = iframeDoc.body.querySelectorAll('*');
        
        // Get precise iframe position
        const iframeRect = iframe.getBoundingClientRect();
        const canvasRect = selectionCanvas.getBoundingClientRect();
        
        // Calculate offset (iframe position relative to canvas)
        const offsetX = iframeRect.left - canvasRect.left;
        const offsetY = iframeRect.top - canvasRect.top;
        
        allElements.forEach(element => {
            const elementRect = element.getBoundingClientRect();
            
            // Skip if element has no size
            if (elementRect.width === 0 || elementRect.height === 0) return;
            
            // Adjust element position to canvas coordinates
            const adjustedRect = {
                left: elementRect.left - iframeRect.left,
                top: elementRect.top - iframeRect.top,
                right: elementRect.right - iframeRect.left,
                bottom: elementRect.bottom - iframeRect.top,
                width: elementRect.width,
                height: elementRect.height
            };
            
            // Check if element overlaps with selection (improved accuracy)
            if (isElementInSelection(bounds, adjustedRect)) {
                elements.push({
                    element: element,
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    textContent: element.textContent?.trim().substring(0, 50),
                    rect: adjustedRect
                });
            }
        });
    } catch (error) {
        console.error('Error accessing iframe:', error);
    }
    
    return elements;
}

function isElementInSelection(selectionBounds, elementRect) {
    if (selectionBounds.shape === 'rectangle') {
        // Check for overlap (not just full containment)
        return !(
            elementRect.right < selectionBounds.left ||
            elementRect.left > selectionBounds.right ||
            elementRect.bottom < selectionBounds.top ||
            elementRect.top > selectionBounds.bottom
        );
    } else if (selectionBounds.shape === 'circle') {
        // Check if any corner or center of element is within circle
        const points = [
            { x: elementRect.left, y: elementRect.top },
            { x: elementRect.right, y: elementRect.top },
            { x: elementRect.left, y: elementRect.bottom },
            { x: elementRect.right, y: elementRect.bottom },
            { x: (elementRect.left + elementRect.right) / 2, y: (elementRect.top + elementRect.bottom) / 2 }
        ];
        
        return points.some(point => {
            const distance = Math.sqrt(
                Math.pow(point.x - selectionBounds.centerX, 2) + 
                Math.pow(point.y - selectionBounds.centerY, 2)
            );
            return distance <= selectionBounds.radius;
        });
    }
    
    return false;
}

function finishSelection() {
    if (allSelections.length === 0) {
        alert('No areas selected. Please select at least one area first.');
        return;
    }
    
    showEditModal();
}

function showEditModal() {
    // Build comprehensive summary of all selections
    let summary = `You have selected ${allSelections.length} area(s):\n\n`;
    
    allSelections.forEach(selection => {
        summary += `━━━ AREA #${selection.number} (${selection.shape}) ━━━\n`;
        summary += `Elements found: ${selection.elements.length}\n`;
        
        const elementSummary = selection.elements.slice(0, 5).map(el => {
            let desc = `  • <${el.tagName.toLowerCase()}`;
            if (el.id) desc += ` id="${el.id}"`;
            if (el.className) desc += ` class="${el.className.substring(0, 30)}"`;
            desc += '>';
            if (el.textContent) desc += ` "${el.textContent.substring(0, 30)}..."`;
            return desc;
        }).join('\n');
        
        summary += elementSummary;
        if (selection.elements.length > 5) {
            summary += `\n  ... and ${selection.elements.length - 5} more`;
        }
        summary += '\n\n';
    });
    
    selectedElementsInfo.textContent = summary;
    editInstructionInput.value = '';
    editInstructionInput.placeholder = `Tell AI what to change. Reference areas by number (e.g., "Make area #1 blue and area #2 larger")`;
    
    editSelectionModal.showModal();
}

cancelEditBtn.addEventListener('click', () => {
    editSelectionModal.close();
    // Don't deactivate - let user continue selecting
});

sendEditBtn.addEventListener('click', async () => {
    const instruction = editInstructionInput.value.trim();
    if (!instruction) {
        alert('Please enter editing instructions');
        return;
    }
    
    // Build user-visible message with selection summary
    let userDisplayMessage = instruction + '\n\n';
    userDisplayMessage += `📍 Selected ${allSelections.length} area(s):\n`;
    
    allSelections.forEach(selection => {
        userDisplayMessage += `\n▸ Area #${selection.number} (${selection.shape}): ${selection.elements.length} elements\n`;
        
        // Show first 3 elements as preview
        const preview = selection.elements.slice(0, 3).map(el => {
            let desc = `  • <${el.tagName.toLowerCase()}`;
            if (el.id) desc += ` #${el.id}`;
            if (el.className) desc += ` .${el.className.split(' ')[0]}`;
            desc += '>';
            return desc;
        }).join('\n');
        
        userDisplayMessage += preview;
        if (selection.elements.length > 3) {
            userDisplayMessage += `\n  • ... and ${selection.elements.length - 3} more`;
        }
    });
    
    // Build comprehensive context for AI with full details
    let enhancedMessage = `${instruction}\n\n`;
    enhancedMessage += `=== SELECTED AREAS (${allSelections.length}) ===\n`;
    
    allSelections.forEach(selection => {
        enhancedMessage += `\nAREA #${selection.number} (${selection.shape}):\n`;
        const elementsContext = selection.elements.map(el => ({
            tag: el.tagName,
            id: el.id,
            class: el.className,
            text: el.textContent
        }));
        enhancedMessage += JSON.stringify(elementsContext, null, 2) + '\n';
    });
    
    // Close modal and deactivate selection mode
    editSelectionModal.close();
    deactivateSelectionMode();
    
    // Show user message with selection context in chat
    addMessage('user', userDisplayMessage);
    messageInput.value = '';
    
    showLoading();
    
    try {
        // Save to history before AI update
        saveToHistory();
        
        // Send enhanced message with all selection context to AI
        const data = await getAIResponse(enhancedMessage);
        
        removeLoading();
        
        // Update editors
        if (data.html) {
            htmlCode.value = data.html;
        }
        if (data.css) {
            cssCode.value = data.css;
        }
        if (data.javascript) {
            jsCode.value = data.javascript;
        }
        
        // Save to history after AI update
        saveToHistory();
        
        updatePreview();
        
        // Save to conversation
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
        
        const explanation = data.explanation || "I've updated the code based on your selected areas.";
        addMessage('assistant', explanation);
        
        // Save user message with selection context to conversation history
        saveMessageToConversation(userDisplayMessage, explanation);
        
    } catch (error) {
        removeLoading();
        addMessage('assistant', 'Sorry, I encountered an error communicating with the server. Please check the console for details.');
        console.error('Error in sendEditBtn:', error);
    }
});

// ========== FILE/IMAGE ATTACHMENT ==========
const attachFileBtn = document.getElementById('attachFileBtn');
const fileInput = document.getElementById('fileInput');
const attachmentSection = document.getElementById('attachmentSection');
const attachmentPreview = document.getElementById('attachmentPreview');
const removeAttachmentBtn = document.getElementById('removeAttachmentBtn');

attachFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        fileInput.value = '';
        return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        fileInput.value = '';
        return;
    }

    try {
        const dataUrl = await fileToBase64(file);
        
        currentAttachment = {
            file: file,
            type: file.type,
            dataUrl: dataUrl,
            name: file.name,
            size: formatFileSize(file.size)
        };

        showAttachmentPreview();
    } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    }

    fileInput.value = '';
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showAttachmentPreview() {
    attachmentPreview.innerHTML = `
        <img src="${currentAttachment.dataUrl}" alt="Preview">
        <div class="file-info">
            <div class="file-name">${currentAttachment.name}</div>
            <div class="file-size">${currentAttachment.size}</div>
        </div>
    `;
    attachmentSection.style.display = 'flex';
}

removeAttachmentBtn.addEventListener('click', () => {
    currentAttachment = null;
    attachmentSection.style.display = 'none';
    attachmentPreview.innerHTML = '';
});

// ========== PAGE MANAGEMENT ==========
function initializePage() {
    const pageId = Date.now().toString();
    currentPageId = pageId;

    const page = {
        id: pageId,
        title: 'New Page',
        date: new Date().toISOString(),
        conversationIds: [],
    };

    pages.unshift(page);
    savePages();
    return page;
}

function savePages() {
    localStorage.setItem('webdev_pages', JSON.stringify(pages));
}

function loadPagesData() {
    const saved = localStorage.getItem('webdev_pages');
    if (saved) {
        pages = JSON.parse(saved);
    }
}

function updatePageList() {
    pageList.innerHTML = '';

    pages.forEach(page => {
        const item = document.createElement('div');
        item.className = 'page-item';
        if (page.id === currentPageId) {
            item.classList.add('active');
        }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'page-info';

        const title = document.createElement('div');
        title.className = 'page-title';
        title.textContent = page.title;

        const date = document.createElement('div');
        date.className = 'page-date';
        date.textContent = formatDate(page.date);

        infoDiv.appendChild(title);
        infoDiv.appendChild(date);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'conversation-actions';

        const renameBtn = document.createElement('button');
        renameBtn.className = 'action-btn rename-btn';
        renameBtn.innerHTML = '✏️';
        renameBtn.title = 'Rename';
        renameBtn.onclick = (e) => {
            e.stopPropagation();
            const newTitle = prompt('Enter new title:', page.title);
            if (newTitle) renamePage(page.id, newTitle);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deletePage(page.id);
        };

        actionsDiv.appendChild(renameBtn);
        actionsDiv.appendChild(deleteBtn);

        item.appendChild(infoDiv);
        item.appendChild(actionsDiv);

        item.addEventListener('click', () => loadPage(page.id));

        pageList.appendChild(item);
    });
}

function renamePage(pageId, newTitle) {
    if (!pageId || !newTitle?.trim()) return false;

    const page = pages.find(p => p.id === pageId);
    if (!page) return false;

    page.title = newTitle.trim();
    savePages();
    updatePageList();
    return true;
}

function deletePage(pageId) {
    const index = pages.findIndex(p => p.id === pageId);
    if (index === -1) return false;

    pages.splice(index, 1);

    if (currentPageId === pageId) {
        currentPageId = pages[0]?.id || null;
        if (currentPageId) {
            loadPage(currentPageId);
        }
    }

    savePages();
    updatePageList();
    return true;
}

newPageBtn.addEventListener('click', () => {
    initializePage();
    updatePageList();
});

// ========== CONVERSATION MANAGEMENT ==========
function initializeConversation() {
    const conversationId = Date.now().toString();
    currentConversationId = conversationId;

    const conversation = {
        id: conversationId,
        title: 'New Conversation',
        date: new Date().toISOString(),
        messages: [],
        model: currentModel,
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
    
    // Initialize history with starting state
    codeHistory = [conversation.code];
    historyIndex = 0;
    updateHistoryButtons();
    
    return conversation;
}

function loadConversation(conversationId) {
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

    chatMessages.innerHTML = '';

    if (conversation.code) {
        htmlCode.value = conversation.code.html || '';
        cssCode.value = conversation.code.css || '';
        jsCode.value = conversation.code.js || '';
    } else {
        conversation.code = {
            html: htmlCode.value,
            css: cssCode.value,
            js: jsCode.value
        };
    }

    // Reset history for this conversation
    codeHistory = [conversation.code];
    historyIndex = 0;
    updateHistoryButtons();

    updatePreview();

    addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');

    conversation.messages.forEach(msg => {
        addMessage(msg.role, msg.content);
    });

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

    if (currentConversationId === conversationId) {
        currentConversationId = null;
        
        if (conversations.length > 0) {
            loadConversation(conversations[0].id);
        } else {
            currentConversationId = null;
            htmlCode.value = '';
            cssCode.value = '';
            jsCode.value = '';
            codeHistory = [];
            historyIndex = -1;
            updateHistoryButtons();
            updatePreview();
            chatMessages.innerHTML = '';
            addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');
        }
    }

    saveConversations();
    updateConversationList();
    return true;
}

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

        if (conversation.messages.length === 2) {
            conversation.title = userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '');
        }

        saveConversations();
        updateConversationList();
    }
}

function saveConversations() {
    localStorage.setItem('webdev_conversations', JSON.stringify(conversations));
}

function loadConversationsData() {
    const saved = localStorage.getItem('webdev_conversations');
    if (saved) {
        conversations = JSON.parse(saved);
    }
}

function updateConversationList() {
    conversationList.innerHTML = '';

    conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        if (conv.id === currentConversationId) {
            item.classList.add('active');
        }

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

        item.addEventListener('click', () => {
            closePageDisplay();
            loadConversation(conv.id);
        });

        conversationList.appendChild(item);
    });
}

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

newConversationBtn.addEventListener('click', () => {
    const newConv = initializeConversation();
    
    htmlCode.value = newConv.code.html;
    cssCode.value = newConv.code.css;
    jsCode.value = newConv.code.js;
    
    updatePreview();
    
    chatMessages.innerHTML = '';
    addMessage('assistant', 'Welcome! I\'m your coding assistant. Ask me anything about web development.');
    updateConversationList();
});

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

// ========== PAGE DISPLAY MANAGEMENT ==========
const pageDisplayContent = document.getElementById('pageDisplayContent');
const componentList = document.getElementById('componentList');
const selectedComponents = document.getElementById('selectedComponents');
const pagePreviewFrame = document.getElementById('pagePreviewFrame');
const closePageBtn = document.getElementById('closePageBtn');

let currentPageComponents = [];

function openPageDisplay(pageId) {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    currentPageId = pageId;
    
    if (page.conversationIds) {
        if (page.conversationIds.length > 0 && typeof page.conversationIds[0] === 'string') {
            currentPageComponents = page.conversationIds.map(convId => ({
                convId: convId,
                instanceId: Date.now() + Math.random()
            }));
        } else {
            currentPageComponents = page.conversationIds || [];
        }
    } else {
        currentPageComponents = [];
    }

    document.querySelector('.preview-panel').style.display = 'none';
    document.querySelector('.editor-panel').style.display = 'none';
    document.querySelector('.chat-panel').style.display = 'none';
    document.querySelector('.resizer-right').style.display = 'none';
    document.querySelector('.resizer-bottom').style.display = 'none';

    pageDisplayContent.style.display = 'grid';
    closePageBtn.style.display = 'flex';

    loadAvailableComponents();
    updateSelectedComponentsUI();
    updatePagePreview();
}

function closePageDisplay() {
    if (currentPageId) {
        const page = pages.find(p => p.id === currentPageId);
        if (page) {
            page.conversationIds = currentPageComponents;
            savePages();
        }
    }

    document.querySelector('.preview-panel').style.display = 'flex';
    document.querySelector('.editor-panel').style.display = 'flex';
    document.querySelector('.chat-panel').style.display = 'flex';
    document.querySelector('.resizer-right').style.display = 'block';
    document.querySelector('.resizer-bottom').style.display = 'block';

    pageDisplayContent.style.display = 'none';
    closePageBtn.style.display = 'none';

    currentPageId = null;
    currentPageComponents = [];
}

function loadAvailableComponents() {
    componentList.innerHTML = '';

    if (conversations.length === 0) {
        componentList.innerHTML = '<p style="color: #666; font-size: 12px;">No components available. Create conversations first.</p>';
        return;
    }

    conversations.forEach(conv => {
        const card = document.createElement('div');
        card.className = 'component-card';
        
        const usageCount = currentPageComponents.filter(c => c.convId === conv.id).length;
        
        card.innerHTML = `
            <div class="component-card-header">
                <h4>${conv.title} ${usageCount > 0 ? `(${usageCount})` : ''}</h4>
                <button class="add-component-btn" data-conv-id="${conv.id}">
                    + Add
                </button>
            </div>
            <p>${conv.messages.length} messages • ${formatDate(conv.date)}</p>
        `;

        const addBtn = card.querySelector('.add-component-btn');
        addBtn.addEventListener('click', () => addComponent(conv.id));

        componentList.appendChild(card);
    });
}

function addComponent(conversationId) {
    const newInstance = {
        convId: conversationId,
        instanceId: Date.now() + Math.random()
    };
    
    currentPageComponents.push(newInstance);
    loadAvailableComponents();
    updateSelectedComponentsUI();
    updatePagePreview();
}

function removeComponent(instanceId) {
    const index = currentPageComponents.findIndex(c => c.instanceId === instanceId);
    if (index > -1) {
        currentPageComponents.splice(index, 1);
    }
    
    loadAvailableComponents();
    updateSelectedComponentsUI();
    updatePagePreview();
}

let draggedElement = null;
let draggedIndex = null;

function updateSelectedComponentsUI() {
    selectedComponents.innerHTML = '';

    if (currentPageComponents.length === 0) {
        selectedComponents.innerHTML = '<p style="color: #666; margin: 0; font-size: 12px;">No components added yet</p>';
        return;
    }

    currentPageComponents.forEach((component, index) => {
        const conv = conversations.find(c => c.id === component.convId);
        if (!conv) return;

        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.draggable = true;
        tag.dataset.instanceId = component.instanceId;
        tag.dataset.index = index;
        
        tag.innerHTML = `
            ${conv.title}
            <button onclick="removeComponent(${component.instanceId})" title="Remove component">×</button>
        `;

        tag.addEventListener('dragstart', handleDragStart);
        tag.addEventListener('dragend', handleDragEnd);
        tag.addEventListener('dragover', handleDragOver);
        tag.addEventListener('drop', handleDrop);
        tag.addEventListener('dragenter', handleDragEnter);
        tag.addEventListener('dragleave', handleDragLeave);

        selectedComponents.appendChild(tag);
    });
}

function handleDragStart(e) {
    draggedElement = e.target;
    draggedIndex = parseInt(e.target.dataset.index);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    
    document.querySelectorAll('.selected-tag').forEach(tag => {
        tag.classList.remove('drag-over');
    });
    
    draggedElement = null;
    draggedIndex = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (e.target.classList.contains('selected-tag') && e.target !== draggedElement) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('selected-tag')) {
        e.target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    e.target.classList.remove('drag-over');
    
    if (draggedElement !== e.target && e.target.classList.contains('selected-tag')) {
        const dropIndex = parseInt(e.target.dataset.index);
        
        const draggedItem = currentPageComponents[draggedIndex];
        currentPageComponents.splice(draggedIndex, 1);
        currentPageComponents.splice(dropIndex, 0, draggedItem);
        
        updateSelectedComponentsUI();
        updatePagePreview();
    }
    
    return false;
}

function updatePagePreview() {
    const mergedCode = currentPageComponents.reduce((acc, component) => {
        const conv = conversations.find(c => c.id === component.convId);
        if (conv && conv.code) {
            acc.html += `
    <!-- Component: ${conv.title} (Instance: ${component.instanceId}) -->
    <div class="component-section" data-component-id="${component.convId}" data-instance-id="${component.instanceId}">
        <div class="component-header">
            <h3>${conv.title}</h3>
        </div>
        <div class="component-content">
            ${conv.code.html || ''}
        </div>
    </div>
`;
            acc.css += `\n/* Component: ${conv.title} */\n${conv.code.css || ''}\n`;
            acc.js += `\n// Component: ${conv.title}\n${conv.code.js || ''}\n`;
        }
        return acc;
    }, { html: '', css: '', js: '' });

    const baseStyles = `
        body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }
        
        .component-section {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #e0e0e0;
            padding: 20px;
        }
        
        .component-section:last-child {
            border-bottom: none;
        }
        
        .component-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
        }
        
        .component-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .component-content {
            flex: 1;
        }
    `;

    const completeHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${baseStyles}
                ${mergedCode.css}
            </style>
        </head>
        <body>
            ${mergedCode.html}
            <script>
                try {
                    ${mergedCode.js}
                } catch (error) {
                    console.error('JavaScript Error:', error);
                }
            <\/script>
        </body>
        </html>
    `;

    const blob = new Blob([completeHTML], { type: 'text/html' });
    pagePreviewFrame.src = URL.createObjectURL(blob);
}

window.removeComponent = removeComponent;

closePageBtn.addEventListener('click', closePageDisplay);

function loadPage(pageId) {
    openPageDisplay(pageId);
}

// Page Preview Action Buttons
const viewCodeBtn = document.getElementById('viewCodeBtn');
const codeViewWrapper = document.getElementById('codeViewWrapper');
const pagePreviewWrapper = document.querySelector('.page-preview-wrapper');
const fullPageCodeElement = document.getElementById('fullPageCode');
const copyCodeFromViewBtn = document.getElementById('copyCodeFromViewBtn');

let isViewingCode = false;

viewCodeBtn.addEventListener('click', () => {
    isViewingCode = !isViewingCode;
    
    if (isViewingCode) {
        pagePreviewWrapper.style.display = 'none';
        codeViewWrapper.style.display = 'flex';
        viewCodeBtn.innerHTML = '👁️ View Preview';
        
        const { mergedCode, baseStyles } = generateMergedPageCode(false);
        const fullPageCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
${baseStyles}
${mergedCode.css}
    </style>
</head>
<body>
${mergedCode.html}
    <script>
        try {
${mergedCode.js}
        } catch (error) {
            console.error('JavaScript Error:', error);
        }
    <\/script>
</body>
</html>`;
        
        fullPageCodeElement.textContent = fullPageCode;
    } else {
        pagePreviewWrapper.style.display = 'block';
        codeViewWrapper.style.display = 'none';
        viewCodeBtn.innerHTML = '👁️ View Code';
    }
});

copyCodeFromViewBtn.addEventListener('click', () => {
    const code = fullPageCodeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = copyCodeFromViewBtn.innerHTML;
        copyCodeFromViewBtn.innerHTML = '✅ Copied!';
        setTimeout(() => {
            copyCodeFromViewBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
});

const viewFullscreenBtn = document.getElementById('viewFullscreenBtn');
const fullscreenOverlay = document.getElementById('fullscreenOverlay');
const fullscreenFrame = document.getElementById('fullscreenFrame');
const closeFullscreenBtn = document.getElementById('closeFullscreenBtn');

viewFullscreenBtn.addEventListener('click', () => {
    const { mergedCode, baseStyles } = generateMergedPageCode(false);
    const completeHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${baseStyles}
                ${mergedCode.css}
            </style>
        </head>
        <body>
            ${mergedCode.html}
            <script>
                try {
                    ${mergedCode.js}
                } catch (error) {
                    console.error('JavaScript Error:', error);
                }
            <\/script>
        </body>
        </html>
    `;
    
    const blob = new Blob([completeHTML], { type: 'text/html' });
    fullscreenFrame.src = URL.createObjectURL(blob);
    fullscreenOverlay.classList.add('active');
});

closeFullscreenBtn.addEventListener('click', () => {
    fullscreenOverlay.classList.remove('active');
    fullscreenFrame.src = '';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
        closeFullscreenBtn.click();
    }
});

const exportPageBtn = document.getElementById('exportPageBtn');

exportPageBtn.addEventListener('click', () => {
    const { mergedCode, baseStyles } = generateMergedPageCode(false);

    const fullPageCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <style>
${baseStyles}
${mergedCode.css}
    </style>
</head>
<body>
${mergedCode.html}
    <script>
        try {
${mergedCode.js}
        } catch (error) {
            console.error('JavaScript Error:', error);
        }
    <\/script>
</body>
</html>`;

    const blob = new Blob([fullPageCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const page = pages.find(p => p.id === currentPageId);
    const fileName = page ? `${page.title.replace(/\s+/g, '_')}.html` : 'my_page.html';
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const originalText = exportPageBtn.innerHTML;
    exportPageBtn.innerHTML = '✅ Exported!';
    setTimeout(() => {
        exportPageBtn.innerHTML = originalText;
    }, 2000);
});

const resetPageBtn = document.getElementById('resetPageBtn');

resetPageBtn.addEventListener('click', () => {
    if (currentPageComponents.length === 0) {
        alert('No components to reset.');
        return;
    }

    if (confirm('Are you sure you want to remove all components from this page?')) {
        currentPageComponents = [];
        
        if (currentPageId) {
            const page = pages.find(p => p.id === currentPageId);
            if (page) {
                page.conversationIds = [];
                savePages();
            }
        }

        loadAvailableComponents();
        updateSelectedComponentsUI();
        updatePagePreview();
    }
});

function generateMergedPageCode(includeHeaders = true) {
    const mergedCode = currentPageComponents.reduce((acc, component) => {
        const conv = conversations.find(c => c.id === component.convId);
        if (conv && conv.code) {
            if (includeHeaders) {
                acc.html += `
    <!-- Component: ${conv.title} -->
    <div class="component-section" data-component-id="${component.convId}" data-instance-id="${component.instanceId}">
        <div class="component-header">
            <h3>${conv.title}</h3>
        </div>
        <div class="component-content">
            ${conv.code.html || ''}
        </div>
    </div>
`;
            } else {
                acc.html += `
    <!-- Component: ${conv.title} -->
    ${conv.code.html || ''}

`;
            }
            acc.css += `\n/* Component: ${conv.title} */\n${conv.code.css || ''}\n`;
            acc.js += `\n// Component: ${conv.title}\n${conv.code.js || ''}\n`;
        }
        return acc;
    }, { html: '', css: '', js: '' });

    const baseStyles = includeHeaders ? `
        body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }
        
        .component-section {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid #e0e0e0;
            padding: 20px;
        }
        
        .component-section:last-child {
            border-bottom: none;
        }
        
        .component-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
        }
        
        .component-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .component-content {
            flex: 1;
        }
    ` : `
        body {
            margin: 0;
            padding: 0;
        }
    `;

    return { mergedCode, baseStyles };
}

// ========== TEMPLATE FUNCTIONALITY ==========
const templateBtn = document.getElementById('templateBtn');
const templateModal = document.getElementById('templateModal');
const closeTemplateBtn = document.getElementById('closeTemplateBtn');
const templateGrid = document.getElementById('templateGrid');
const templateCategories = document.getElementById('templateCategories');

let currentCategory = 'all';

templateBtn.addEventListener('click', () => {
    loadTemplates(currentCategory);
    templateModal.showModal();
});

closeTemplateBtn.addEventListener('click', () => {
    templateModal.close();
});

templateCategories.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        loadTemplates(currentCategory);
    }
});

function loadTemplates(category) {
    templateGrid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? templateComponents 
        : templateComponents.filter(t => t.category === category);
    
    filtered.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.innerHTML = `
            <span class="template-category-tag">${template.category}</span>
            <h4>${template.title}</h4>
            <p>Click to add this component to your page</p>
        `;
        
        card.addEventListener('click', () => addTemplateToPage(template));
        templateGrid.appendChild(card);
    });
}

function addTemplateToPage(template) {
    const conversationId = Date.now().toString();
    
    const conversation = {
        id: conversationId,
        title: template.title,
        date: new Date().toISOString(),
        messages: [],
        model: currentModel,
        code: {
            html: template.code.html,
            css: template.code.css,
            js: template.code.js
        }
    };
    
    conversations.unshift(conversation);
    saveConversations();
    
    if (currentPageId) {
        const newInstance = {
            convId: conversationId,
            instanceId: Date.now() + Math.random()
        };
        currentPageComponents.push(newInstance);
        
        loadAvailableComponents();
        updateSelectedComponentsUI();
        updatePagePreview();
    }
    
    templateModal.close();
    
    alert(`✅ "${template.title}" added successfully!`);
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        updatePreview();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        messageInput.focus();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebarBtn.click();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
    }
});

// ========== INITIALIZATION ==========
loadConversationsData();
loadPagesData();

if (conversations.length > 0) {
    updateConversationList();
    updatePageList();
} else {
    initializeConversation();
    updateConversationList();
}

console.log('🚀 Web Dev Playground initialized!');
console.log('💡 Shortcuts: Ctrl+Enter (update) | Ctrl+K (chat) | Ctrl+B (sidebar) | Ctrl+Z (undo) | Ctrl+Shift+Z (redo)');