const express = require("express");
const router = express.Router();

async function processChat(text) {
  return {
    mood: "neutral",
    audio_url: "test"
  };
}

router.post("/", async (req, res) => {
  const result = await processChat(req.body.text);
  res.json(result);
});

module.exports = router;
module.exports.processChat = processChat;
