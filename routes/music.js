const express = require("express");
const router = express.Router();
const { searchTrack } = require("../services/jamendo");

// =====================
// MUSIC ENDPOINT
// =====================
router.post("/", async (req, res) => {

  try {

    const { ai_query } = req.body;

    // VALIDATION
    if (!ai_query || typeof ai_query !== "string") {
      return res.status(400).json({
        error: "ai_query is required"
      });
    }

    console.log("[MUSIC QUERY]:", ai_query);

    // =====================
    // SEARCH JAMENDO
    // =====================
    const track = await searchTrack(ai_query);

    // =====================
    // FALLBACK (BIAR TIDAK NULL)
    // =====================
    if (!track) {
      return res.json({
        title: "Relaxing Background Music",
        audio_url: "https://prod-1.storage.jamendo.com/?trackid=1446611&format=mp31",
        fallback: true
      });
    }

    // =====================
    // RESPONSE
    // =====================
    res.json({
      title: track.title,
      audio_url: track.audio_url,
      artist: track.artist
    });

  } catch (err) {
    console.error("[MUSIC ERROR]:", err);

    res.status(500).json({
      error: "Music service failed"
    });
  }
});

module.exports = router;
