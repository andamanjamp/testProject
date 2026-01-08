import Anthropic from '@anthropic-ai/sdk';

// ⚠️ IMPORTANT: In a real app, never hardcode API keys on the client value.
// You should use an environment variable (import.meta.env.VITE_ANTHROPIC_API_KEY)
// or use a backend proxy. For this demo, we'll assume the user inputs it or uses a proxy.
//
// Since we are running client-side, we must set "dangerouslyAllowBrowser: true".
const anthropic = new Anthropic({
    apiKey: 'YOUR_API_KEY_HERE', // User: Replace this with your key
    dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `
You are an expert Frontend Web Developer and UI Designer.
Your goal is to help the user build a website by generating HTML/CSS code.

RULES:
1. You will receive a history of messages and the CURRENT HTML code in the editor.
2. If the user asks for a change, modify the CURRENT HTML code or generate new code.
3. You must provide the FULL HTML code for the component or page requested.
4. Your response must be in this specific JSON format:
{
  "message": "A short, friendly message describing what you did.",
  "html": "The full HTML code here..."
}
5. Do NOT use markdown code blocks like \`\`\`html. Just return the raw string in the JSON "html" field.
6. Make the design modern, clean, and beautiful. Use inline styles for simplicity in this demo, or style tags.
`;

export const sendMessageToClaude = async (history, currentHtml) => {
    try {
        // Convert our internal message format { role, content } to Claude's format
        // Note: Claude expects alternating user/assistant messages.
        // We also need to filter out any system-like internal states if we had them.

        // We add a context message at the end to remind Claude of the current code state
        const messages = history.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
        }));

        // Add specific instruction for this turn
        messages.push({
            role: 'user',
            content: `Current HTML Code:\n${currentHtml}\n\nTask: Please update the code based on my previous requests or simply optimize it if no request was made. Remember to ONLY return the JSON object.`
        });

        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: messages,
        });

        const responseText = msg.content[0].text;

        // Parse the JSON response
        try {
            const parsed = JSON.parse(responseText);
            return {
                message: parsed.message,
                html: parsed.html
            };
        } catch {
            // Fallback if Claude didn't return valid JSON (it happens)
            console.warn("Claude response was not valid JSON, creating fallback.", responseText);
            return {
                message: "I updated the code, but there was a formatting issue with my response.",
                html: currentHtml // Safety fallback
            };
        }

    } catch (error) {
        console.error("Error calling Claude:", error);
        throw error;
    }
};
