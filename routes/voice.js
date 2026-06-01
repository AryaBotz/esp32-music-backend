const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "uploads/"
});

const {
  transcribe
} = require("../services/sttEngine");

const {
  analyzeMood
} = require("../services/aiEngine");

const {
  searchTrack
} = require("../services/jamendo");

router.post(
  "/",
  upload.single("audio"),
  async (req, res) => {

    try {

      // ==========
      // STT
      // ==========
      const text =
        await transcribe(req.file.path);

      // ==========
      // AI
      // ==========
      const ai =
        await analyzeMood(text);

      // ==========
      // JAMENDO
      // ==========
      const track =
        await searchTrack(ai.ai_query);

      fs.unlinkSync(req.file.path);

      return res.json({

        text,

        mood: ai.mood,

        intent: ai.intent,

        ai_query: ai.ai_query,

        title:
          track?.title ||
          "Relaxing Background Music",

        artist:
          track?.artist ||
          "Unknown",

        audio_url:
          track?.audio_url ||
          "https://prod-1.storage.jamendo.com/?trackid=1446611&format=mp31"
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: "Voice pipeline failed"
      });
    }
  }
);

module.exports = router;
