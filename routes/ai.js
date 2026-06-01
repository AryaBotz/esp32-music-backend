const express = require("express");
const router = express.Router();

const { chat } = require("../services/groq");

// =========================
// SAFE PARSER (ANTI CRASH)
// =========================
function safeParse(text) {
  try {
    if (!text) return null;

    // ambil JSON dari output LLM
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    const jsonStr = text.substring(start, end + 1);

    return JSON.parse(jsonStr);

  } catch (err) {
    console.log("[LLM RAW OUTPUT]:", text);
    return null;
  }
}

// =========================
// MAIN ROUTE
// =========================
router.post("/", async (req, res) => {

  try {

    const { text } = req.body;

    // =========================
    // VALIDATION INPUT
    // =========================
    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Missing or invalid text"
      });
    }

    console.log("[USER TEXT]:", text);

    // =========================
    // CALL LLM
    // =========================
    const llm = await chat([
      {
        role: "system",
        content: `
You are a STRICT JSON music mood engine.

RULES:
- Output ONLY valid JSON
- No markdown
- No explanation
- No extra text
- No code block

MOODS:
- sad
- happy
- focus
- sleep
- neutral

MAP USER TEXT → MUSIC INTENT

OUTPUT FORMAT:
{
  "mood": "",
  "ai_query": "",
  "intent": "music"
}

EXAMPLES:
- sad → slow piano emotional ambient
- happy → upbeat happy pop chill
- focus → lofi study beats calm focus
- sleep → rain ambient deep sleep music
- neutral → chill background music
`
      },
      {
        role: "user",
        content: text
      }
    ]);

    const content = llm?.choices?.[0]?.message?.content || "";

    console.log("[LLM RAW]:", content);

    const parsed = safeParse(content);

    // =========================
    // FALLBACK IF PARSE FAIL
    // =========================
    if (!parsed) {
      console.log("[FALLBACK USED]");

      return res.json({
        mood: "neutral",
        ai_query: "chill ambient music",
        intent: "music"
      });
    }

    // =========================
    // FINAL RESPONSE
    // =========================
    res.json({
      mood: parsed.mood || "neutral",
      ai_query: parsed.ai_query || "chill music",
      intent: parsed.intent || "music"
    });

  } catch (err) {

    console.error("[AI ERROR]:", err);

    res.status(500).json({
      error: "AI processing failed"
    });
  }
});

module.exports = router;
