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

BEHAVIOR:
- If the user sends a new request, analyze their instruction and the current code.
- Apply the requested changes intelligently.
- If the user provides an image, try to replicate its design in the code.
- Be creative but faithful to the user's intent.

CRITICAL: Return ONLY valid JSON. Do not include markdown formatting or text outside the JSON object.`;

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
