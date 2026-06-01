const { analyzeWithLLM } = require("../services/llmEngine");
const { getMusicFromMood } = require("../services/musicEngine");

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

// expose for STT
module.exports.__processChat = processChat;

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const text = req.body.text;

    const result = await processChat(text);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "chat failed" });
  }

});

module.exports = router;
