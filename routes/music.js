const express = require("express");
const { getMusicFromMood } = require("../services/musicEngine");

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const mood = req.body.mood;

    if (!mood) {
      return res.status(400).json({ error: "mood required" });
    }

    const audio_url = await getMusicFromMood(mood);

    res.json({
      mood,
      audio_url
    });

  } catch (err) {
    console.error("MUSIC ERROR:", err);
    res.status(500).json({ error: "music failed" });
  }

});

module.exports = router;
