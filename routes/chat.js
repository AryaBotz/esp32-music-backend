const express = require("express");
const router = express.Router();

const { analyzeWithLLM } = require("../services/llmEngine");
const { getMusicFromMood } = require("../services/musicEngine");

async function processChat(text) {

  const ai = await analyzeWithLLM(text);

  console.log("LLM RESULT:", ai);

  const mood = ai?.mood || "neutral";

  const audio_url = await getMusicFromMood(mood);

  return {
    mood,
    intent: ai?.intent || "music",
    ai_query: text,
    title: `AI Mood: ${mood}`,
    audio_url
  };
}

router.post("/", async (req, res) => {
  try {

    const text = req.body.text;

    if (!text) {
      return res.status(400).json({ error: "text required" });
    }

    const result = await processChat(text);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "chat failed" });
  }
});

module.exports = router;
module.exports.processChat = processChat;
