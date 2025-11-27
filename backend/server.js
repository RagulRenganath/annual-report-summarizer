import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-70b-8192"; // best free model

async function summarizeWithGroq(text) {
  const body = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You summarize long annual reports into simple 200–300 word explanations for beginners. Use simple English."
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.3,
    max_tokens: 400,
  };

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const chunks = [];
    const chunkSize = 3000;

    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    const partialSummaries = [];

    for (let chunk of chunks) {
      const s = await summarizeWithGroq("Summarize this:\n\n" + chunk);
      partialSummaries.push(s);
    }

    const combinedText = partialSummaries.join("\n\n");

    const finalSummary = await summarizeWithGroq(
      "Combine these summaries into one clear simple summary:\n\n" + combinedText
    );

    res.json({ summary: finalSummary });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => {
  res.send("Groq backend running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
