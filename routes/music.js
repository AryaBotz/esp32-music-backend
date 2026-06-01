const express = require("express");
const { getMusicFromMood } = require("../services/musicEngine");

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const mood = req.body.mood;

    if (!mood) {
      return res.status(400).json({
        error: "mood required"
      });
    }

    const audio_url = getMusicFromMood(mood);

    res.json({
      mood,
      audio_url
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "music failed"
    });
  }
});

module.exports = router;
