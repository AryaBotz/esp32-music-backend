const express = require("express");
const { getMusicFromMood } = require("../services/musicEngine");

const router = express.Router();

router.post("/", (req, res) => {

  const mood = req.body.mood;

  if (!mood) {
    return res.status(400).json({ error: "mood required" });
  }

  res.json({
    mood,
    audio_url: getMusicFromMood(mood)
  });

});

module.exports = router;
