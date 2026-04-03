import express from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

// Use memory storage so we never have a temp-file path issue
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

const router = express.Router();

// Lazy-require both parsers to avoid ESM interop errors
let pdfParse: any;
let mammoth: any;

const getPdfParse = () => {
  if (!pdfParse) pdfParse = require("pdf-parse");
  return pdfParse;
};

const getMammoth = () => {
  if (!mammoth) mammoth = require("mammoth");
  return mammoth;
};

// --------------------------------------------------
// POST /api/ai/ask  – plain LLM query
// --------------------------------------------------
router.post("/ask", async (req: any, res: any) => {
  try {
    const { question } = req.body;
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi3",
      prompt: question,
      stream: false
    });
    res.json({ answer: response.data.response });
  } catch (error) {
    console.error("Ollama error:", error);
    res.status(500).json({ answer: "AI failed to respond." });
  }
});

// --------------------------------------------------
// POST /api/ai/parse  – upload file, extract text
// --------------------------------------------------
router.post("/parse", upload.single("file"), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer: Buffer = req.file.buffer;
    const originalName: string = req.file.originalname || "";
    const ext = path.extname(originalName).toLowerCase();
    const mimeType: string = req.file.mimetype || "";

    let extractedText = "";

    if (mimeType === "application/pdf" || ext === ".pdf") {
      const data = await getPdfParse()(buffer);
      extractedText = data.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      ext === ".docx" ||
      ext === ".doc"
    ) {
      const result = await getMammoth().extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF or DOCX." });
    }

    if (!extractedText.trim()) {
      return res.status(422).json({ error: "Could not extract any text from the document. It may be image-based or password-protected." });
    }

    res.json({ text: extractedText });
  } catch (error: any) {
    console.error("Parse error:", error);
    res.status(500).json({ error: `Failed to parse document: ${error?.message || "unknown error"}` });
  }
});

// --------------------------------------------------
// POST /api/ai/parse-url  – parse an already-uploaded file by URL
// --------------------------------------------------
router.post("/parse-url", async (req: any, res: any) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.status(400).json({ error: "No URL provided" });

    // Support both /uploads/ paths and full http URLs for resources
    let buffer: Buffer;
    let ext: string;

    if (/^https?:\/\//i.test(fileUrl)) {
      // External or same-origin http URL – fetch via axios
      const urlObj = new URL(fileUrl);
      ext = path.extname(urlObj.pathname).toLowerCase();
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      buffer = Buffer.from(response.data);
    } else {
      // Relative /uploads/ style path
      const urlParts = fileUrl.split("/uploads/");
      if (urlParts.length < 2) {
        return res.status(400).json({ error: "Only local server uploads are supported for direct parsing." });
      }
      const filename = urlParts[urlParts.length - 1];
      ext = path.extname(filename).toLowerCase();
      const filePath = path.join(process.cwd(), "uploads", filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on server." });
      }
      buffer = fs.readFileSync(filePath);
    }

    let extractedText = "";
    if (ext === ".pdf") {
      const data = await getPdfParse()(buffer);
      extractedText = data.text;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await getMammoth().extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type for parsing." });
    }

    if (!extractedText.trim()) {
      return res.status(422).json({ error: "Could not extract text from the document." });
    }

    res.json({ text: extractedText });
  } catch (error: any) {
    console.error("Parse URL error:", error);
    res.status(500).json({ error: `Failed to parse document from URL: ${error?.message || "unknown error"}` });
  }
});


export default router;