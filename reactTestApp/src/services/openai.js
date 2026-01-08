import OpenAI from 'openai';

// ⚠️ IMPORTANT: In a real app, never hardcode API keys on the client value.
// You should use an environment variable (import.meta.env.VITE_OPENAI_API_KEY)
// or use a backend proxy. For this demo, we'll assume the user inputs it.
//
// Since we are running client-side, we must set "dangerouslyAllowBrowser: true".
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Key loaded from .env
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

export const sendMessageToOpenAI = async (history, currentHtml) => {
    try {
        // 1. Prepare messages
        // OpenAI supports system messages, so we put the main prompt there.
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.map(msg => ({
                role: msg.role === 'ai' ? 'assistant' : 'user', // "ai" -> "assistant"
                content: msg.content
            }))
        ];

        // Add specific instruction/context for this turn
        messages.push({
            role: 'user',
            content: `Current HTML Code:\n${currentHtml}\n\nTask: Please update the code based on my previous requests or simply optimize it if no request was made. Remember to ONLY return the JSON object.`
        });

        // 2. Interface with OpenAI
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4o-mini", // Using a capable model for coding
            response_format: { type: "json_object" }, // Force JSON output
        });

        const responseText = completion.choices[0].message.content;

        // 3. Parse JSON
        try {
            const parsed = JSON.parse(responseText);
            return {
                message: parsed.message,
                html: parsed.html
            };
        } catch (e) {
            console.warn("OpenAI response was not valid JSON, creating fallback.", responseText);
            return {
                message: "I updated the code, but there was a formatting issue with my response.",
                html: currentHtml // Safety fallback
            };
        }

    } catch (error) {
        console.error("Error calling OpenAI:", error);
        throw error;
    }
};
