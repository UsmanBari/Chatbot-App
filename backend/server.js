// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer"; // Import multer

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// --- CHANGE MADE HERE: Updated model to gemini-2.5-flash ---
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Helper function to convert buffer to Gemini Part format
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// Updated route to match frontend POST to /api/chat with multer
app.post("/api/chat", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;

    if (!message && !file) {
      return res.status(400).json({ error: "Empty message or file received." });
    }

    let parts = [];
    if (message) {
      parts.push({ text: message });
    }

    if (file) {
      parts.push(fileToGenerativePart(file.buffer, file.mimetype));
    }
    
    // Send the constructed parts to the Gemini model
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const reply = result?.response?.text();

    if (!reply) {
      return res.status(500).json({ error: "No response from model." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
