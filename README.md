# Web Dev Playground

A powerful, AI-assisted web development playground that allows you to generate and edit HTML, CSS, and JavaScript code with live preview.

## Features

- **AI-Powered Coding**: Integrated with Claude to generate code based on your descriptions.
- **Live Preview**: See your changes instantly as you type or when the AI generates code.
- **Multi-File Editing**: Dedicated editors for HTML, CSS, and JavaScript.
- **Conversation History**: Save and manage multiple coding sessions.
- **Responsive Design**: The playground itself is responsive and user-friendly.

## How to Run

1.  **Prerequisites**:
    *   Node.js installed.
    *   An Anthropic API Key (for AI features).

2.  **Setup**:
    *   Navigate to the `server` directory:
        ```bash
        cd server
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `server` directory and add your API key:
        ```env
        ANTHROPIC_API_KEY=your_api_key_here
        ```

3.  **Start the Server**:
    *   Run the server:
        ```bash
        node index.js
        ```
    *   The terminal will show: `✅ Server running at http://localhost:3001`

4.  **Access the App**:
    *   Open your browser and go to `http://localhost:3001`.
    *   You can now use the playground directly! No need to open the HTML file manually.

## Usage

*   **Chat with AI**: Type your request in the bottom panel (e.g., "Create a login form") and hit Send.
*   **Manual Edit**: accessible the code directly in the HTML, CSS, and JS tabs on the right.
*   **Preview**: The center panel shows the live output of your code.
