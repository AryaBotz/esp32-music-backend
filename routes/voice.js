const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "uploads/",
});

const { transcribe } = require("../services/sttEngine");
const { analyzeMood } = require("../services/aiEngine");
const { searchTrack } = require("../services/jamendo");

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    // 🔴 VALIDASI FILE WAJIB
    if (!req.file) {
      return res.status(400).json({
        error: "No audio file received. Field name must be 'audio'"
      });
    }

    console.log("[UPLOAD]", req.file);

    const filePath = req.file.path;

    // ========= STT =========
    const text = await transcribe(filePath);

    // ========= AI =========
    const ai = await analyzeMood(text);

    // ========= MUSIC SEARCH =========
    const track = await searchTrack(ai.ai_query);

    // cleanup
    fs.unlinkSync(filePath);

    return res.json({
      text,
      mood: ai.mood,
      intent: ai.intent,
      ai_query: ai.ai_query,
      title: track?.title || "Relaxing Background Music",
      artist: track?.artist || "Unknown",
      audio_url:
        track?.audio_url ||
        "https://prod-1.storage.jamendo.com/?trackid=1446611&format=mp31"
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Voice pipeline failed",
      detail: err.message
    });
  }
});

module.exports = router;
