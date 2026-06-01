const express = require("express");
const { analyzeWithLLM } = require("../services/llmEngine");
const { getMusicFromMood } = require("../services/musicEngine");

const router = express.Router();

async function processChat(text) {

  const ai = await analyzeWithLLM(text);

  const mood = ai.mood || "neutral";

  const audio_url = await getMusicFromMood(mood);

  return {
    mood,
    intent: ai.intent,
    ai_query: text,
    title: `AI Playlist for ${mood}`,
    audio_url
  };
}

// EXPORT CLEAN (INI KUNCI)
module.exports = {
  router,
  processChat
};

// express route
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
