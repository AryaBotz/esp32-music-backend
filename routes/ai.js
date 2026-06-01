const express = require("express");
const router = express.Router();

const { chat } = require("../services/groq");
const { searchTrack } = require("../services/jamendo");

// =========================
// SAFE JSON PARSER
// =========================
function safeParse(text) {
  try {
    // ambil JSON pertama yang valid dari output LLM
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// =========================
// MAIN ROUTE
// =========================
router.post("/", async (req, res) => {

  try {

    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Empty text" });
    }

    // =========================
    // 1. MOOD-AWARE PROMPT
    // =========================
    const llm = await chat([
      {
        role: "system",
        content: `
You are a MUSIC MOOD ENGINE.

Task:
Analyze user text and generate music intent.

RULES:
- mood must be ONE of: sad, happy, focus, sleep, neutral
- ai_query must strongly match mood
- output ONLY valid JSON (no markdown, no text)

MOOD GUIDELINES:

1. sad →
   ai_query: calm piano, emotional, soft sad music, ambient slow

2. happy →
   ai_query: upbeat pop, happy instrumental, energetic chill

3. focus →
   ai_query: lofi study beats, ambient work music, concentration music

4. sleep →
   ai_query: deep sleep music, rain sounds, calm ambient, soft piano

5. neutral →
   ai_query: chill music, background music, relaxing instrumental

OUTPUT FORMAT:
{
  "mood": "",
  "ai_query": "",
  "intent": "music"
}
`
      },
      {
        role: "user",
        content: text
      }
    ]);

    const content = llm.choices?.[0]?.message?.content || "";

    const parsed = safeParse(content);

    if (!parsed) {
      return res.status(500).json({
        error: "LLM parse failed",
        raw: content
      });
    }

    // =========================
    // 2. JAMENDO SEARCH
    // =========================
    const track = await searchTrack(parsed.ai_query);

    // fallback kalau jamendo kosong
    const result = {
      mood: parsed.mood,
      intent: "music",
      ai_query: parsed.ai_query,
      title: track?.title || "Relaxing Music",
      audio_url: track?.audio_url || null
    };

    // =========================
    // 3. RESPONSE
    // =========================
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI pipeline failed" });
  }
});

module.exports = router;
