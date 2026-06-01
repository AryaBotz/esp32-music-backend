const express = require("express");
const router = express.Router();
const { analyzeWithLLM } = require("../services/llmEngine");
const { getMusicFromMood } = require("../services/musicEngine");

async function processChat(text) {

  // 🔥 1. LLM ANALYSIS
  const ai = await analyzeWithLLM(text);

  console.log("LLM RESULT:", ai);

  const mood = ai?.mood || "neutral";

  // 🔥 2. MUSIC GENERATION
  const audio_url = await getMusicFromMood(mood);

  return {
    mood,
    intent: ai?.intent || "unknown",
    ai_query: text,
    title: `AI Mood: ${mood}`,
    audio_url
  };
}

// ROUTE
router.post("/", async (req, res) => {
  try {
    const text = req.body.text;

    const result = await processChat(text);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "chat failed" });
  }
});

module.exports = router;
module.exports.processChat = processChat;
