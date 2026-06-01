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

// EXPORT ROUTER SAJA (INI PENTING)
module.exports = router;

// expose function via attach (optional pattern)
router.processChat = processChat;
