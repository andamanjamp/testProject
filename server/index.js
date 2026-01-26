import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();

// Initialize Anthropic client
// Defaults to process.env.ANTHROPIC_API_KEY
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from the src directory
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../src')));

const SYSTEM_PROMPT = `You are an expert Frontend Web Developer and UI Designer acting as an intelligent coding agent.

Your goal is to help the user build and modify a web page by generating HTML, CSS, and JavaScript code.

INPUT CONTEXT:
The user will provide you with:
1. The user's request/instruction.
2. The current state of HTML, CSS, and JavaScript code.
3. Optionally, an image for reference.

OUTPUT FORMAT:
You must return a JSON object with the following structure:
{
  "html": "The complete HTML code",
  "css": "The complete CSS code",
  "javascript": "The complete JavaScript code",
  "explanation": "A brief explanation of what you changed or created"
}

GUIDELINES:
1. **Complete Code**: Always return the FULL code for each section (HTML, CSS, JS), not just snippets. If a section hasn't changed, return the existing code for that section.
2. **Modern Standards**: Use modern HTML5, CSS3 (Flexbox, Grid), and ES6+ JavaScript.
3. **Visual Aesthetics**: prioritizing premium, modern designs (gradients, shadows, rounded corners, good typography) unless requested otherwise.
4. **Safety**: Ensure the code is safe to run in a browser.
5. **Responsiveness**: Try to make designs responsive where applicable.
6. **Uniqueness**: The class name of the element must contain timestamp to prevent same class name collision on css

BEHAVIOR:
- If the user sends a new request, analyze their instruction and the current code.
- Apply the requested changes intelligently.
- If the user provides an image, try to replicate its design in the code.
- Be creative but faithful to the user's intent.

CRITICAL: Return ONLY valid JSON. Do not include markdown formatting or text outside the JSON object.`;

const IMAGE_TO_CODE_SYSTEM_PROMPT = `You are an expert Frontend Developer specializing in converting design mockups to production-ready code.

TASK: Convert the provided design image into pixel-perfect HTML and CSS that matches the design exactly.

RESPONSE FORMAT:
{
    "message": "Description of changes and the color Hex found in the code",
    "html": "Complete HTML code with proper escaping",
    "css": "Complete CSS code with proper escaping",
    "js": "Complete JavaScript code with proper escaping"
}

CRITICAL REQUIREMENTS:
1. COLOR ACCURACY: Extract exact colors from the image and use them precisely
2. LAYOUT FIDELITY: Match spacing, alignment, and proportions exactly
3. TYPOGRAPHY: Match font sizes, weights, and styles as closely as possible
4. RESPONSIVE: Make it mobile-friendly with breakpoints
5. MODERN CSS: Use Flexbox/Grid, CSS variables for colors
6. NO EXTERNAL LIBS: No Tailwind, Bootstrap, or CDN dependencies
7. PLACEHOLDER IMAGES: Use via.placeholder.com or similar for any images
8. FULL-WIDTH: Make layouts edge-to-edge unless it's clearly a centered component
9. PRODUCTION-READY: Clean, well-structured, commented code


Do NOT wrap in markdown code blocks.
ONLY return the raw JSON object.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, html, css, javascript, image } = req.body;

    // Construct the user message
    const userContent = [];

    // Add image if present
    if (image) {
      // Assuming image is a base64 data URL
      const base64Image = image.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
      const mediaType = image.match(/^data:image\/(png|jpeg|webp);base64,/)?.[1] || "jpeg";

      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: `image/${mediaType}`,
          data: base64Image,
        },
      });
    }

    // Add text context
    let contextMessage = `User Request: ${message || "Create a web page based on my input."}\n\n`;

    if (html || css || javascript) {
      contextMessage += `CURRENT CODE STATE:\n`;
      if (html) contextMessage += `HTML:\n${html}\n\n`;
      if (css) contextMessage += `CSS:\n${css}\n\n`;
      if (javascript) contextMessage += `JavaScript:\n${javascript}\n\n`;
    }

    contextMessage += `\nPlease generate the updated full HTML, CSS, and JS code based on the request.`;

    userContent.push({
      type: "text",
      text: contextMessage,
    });

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0.1, // Low temperature for code determinism
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    // Parse the response
    let responseText = msg.content[0].text;


    // Attempt to extract JSON if Claude wraps it in markdown (though we asked it not to)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse JSON from Claude:", responseText);
      // Fallback if JSON parsing fails - simple heuristic or error
      parsedResponse = {
        html: html || "",
        css: css || "",
        javascript: javascript || "",
        explanation: "Sorry, I had trouble generating the structured code. Please try again."
      };
    }

    res.json(parsedResponse);

  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: "Failed to process request with Claude API" });
  }
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


// export const sendMessageToClaude = async (history, currentHtml, currentCss, currentJs) => {
//     try {
//         const messages = [
//             ...history.map(msg => ({
//                 role: msg.role === 'ai' ? 'assistant' : 'user',
//                 content: msg.content
//             })),
//             {
//                 role: 'user',
//                 content: `Current Code State:
// HTML:
// ${currentHtml}

// CSS:
// ${currentCss}

// JS:
// ${currentJs}

// Task: Please update the code based on my previous requests. Return ONLY valid JSON.`
//             }
//         ];
//         //claude-haiku-4-5-20251001
//         //claude-sonnet-4-5-20250929

//         //2048,4096,8192
//         const msg = await anthropic.messages.create({
//             model: "claude-haiku-4-5-20251001",
//             max_tokens: 8192,
//             system: SYSTEM_PROMPT,
//             messages: messages,
//         });

//         const responseText = msg.content[0].text;

//         console.log("Raw response length:", responseText.length);

//         // AGGRESSIVE MARKDOWN REMOVAL
//         let jsonText = responseText.trim();

//         // Method 1: Remove markdown code blocks with regex
//         jsonText = jsonText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');

//         // Method 2: If still has backticks, find the JSON object directly
//         if (jsonText.includes('```')) {
//             const firstBrace = jsonText.indexOf('{');
//             const lastBrace = jsonText.lastIndexOf('}');

//             if (firstBrace !== -1 && lastBrace !== -1) {
//                 jsonText = jsonText.substring(firstBrace, lastBrace + 1);
//             }
//         }

//         // Final cleanup
//         jsonText = jsonText.trim();

//         console.log("Cleaned JSON (first 200 chars):", jsonText.substring(0, 200));
//         console.log("Cleaned JSON (last 200 chars):", jsonText.substring(jsonText.length - 200));

//         // Parse with better error handling
//         let parsed;
//         try {
//             parsed = JSON.parse(jsonText);
//         } catch (parseError) {
//             console.error("JSON Parse Error:", parseError.message);
//             console.error("Failed at position:", parseError.message.match(/position (\d+)/)?.[1]);
//             console.error("Problematic section:", jsonText.substring(
//                 Math.max(0, (parseError.message.match(/position (\d+)/)?.[1] || 0) - 50),
//                 Math.min(jsonText.length, (parseError.message.match(/position (\d+)/)?.[1] || 0) + 50)
//             ));

//             // Last resort: try to extract manually
//             console.log("Attempting manual extraction...");
//             const messageMatch = jsonText.match(/"message"\s*:\s*"([^"\\]*(\\.[^"\\]*)*)"/);
//             const htmlMatch = jsonText.match(/"html"\s*:\s*"([\s\S]*?)"\s*,\s*"css"/);
//             const cssMatch = jsonText.match(/"css"\s*:\s*"([\s\S]*?)"\s*,\s*"js"/);
//             const jsMatch = jsonText.match(/"js"\s*:\s*"([\s\S]*?)"\s*\}/);

//             if (messageMatch || htmlMatch) {
//                 parsed = {
//                     message: messageMatch ? messageMatch[1] : 'Code updated',
//                     html: htmlMatch ? htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : currentHtml,
//                     css: cssMatch ? cssMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : currentCss,
//                     js: jsMatch ? jsMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : currentJs
//                 };
//                 console.log("✅ Manual extraction successful");
//             } else {
//                 throw parseError;
//             }
//         }

//         if (!parsed || typeof parsed !== 'object') {
//             throw new Error('Invalid response format');
//         }

//         console.log("✅ Successfully parsed response");
//         console.log("Message:", parsed.message);
//         console.log("HTML length:", parsed.html?.length || 0);
//         console.log("CSS length:", parsed.css?.length || 0);
//         console.log("JS length:", parsed.js?.length || 0);

//         return {
//             message: parsed.message || 'Code updated successfully',
//             html: parsed.html || currentHtml || '',
//             css: parsed.css || currentCss || '',
//             js: parsed.js || currentJs || ''
//         };

//     } catch (error) {
//         console.error("❌ Failed to parse Claude response:", error.message);
//         console.error("Full raw response (first 1000 chars):",
//             error.response?.substring(0, 1000) || responseText?.substring(0, 1000) || "No response text");

//         return {
//             message: "I updated the code, but there was a formatting issue with my response.",
//             html: currentHtml,
//             css: currentCss,
//             js: currentJs
//         };
//     }
// };

