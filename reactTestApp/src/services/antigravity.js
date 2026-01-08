import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ IMPORTANT: In a real app, never hardcode API keys. 
// Use import.meta.env.VITE_GOOGLE_API_KEY
const API_KEY = 'AIzaSyA77qJjn5XubfUT0XY-BiXydK05coMSi'; // User: Replace this with your key

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
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

export const sendMessageToAntigravity = async (history, currentHtml) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Gemini requires the history to start with a 'user' role.
        // We filter the history to ensure this.
        let mappedHistory = history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        // Remove any leading model messages
        while (mappedHistory.length > 0 && mappedHistory[0].role === 'model') {
            mappedHistory.shift();
        }

        const chat = model.startChat({
            history: mappedHistory,
        });

        const prompt = `Current HTML Code:\n${currentHtml}\n\nTask: Please update the code based on my previous requests or simply optimize it if no request was made. Remember to ONLY return the JSON object.`;

        const result = await chat.sendMessage(prompt);
        const responseText = result.response.text();

        // Clean up markdown block if present (Gemini sometimes adds ```json ... ```)
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(cleanedText);
            return {
                message: parsed.message,
                html: parsed.html
            };
        } catch (e) {
            console.warn("Gemini response was not valid JSON, creating fallback.", responseText);
            // Attempt to just grab message if it failed
            return {
                message: "I updated the code, but there was a formatting issue with my response.",
                html: currentHtml
            };
        }

    } catch (error) {
        console.error("Error calling Antigravity (Gemini):", error);
        throw error;
    }
};
