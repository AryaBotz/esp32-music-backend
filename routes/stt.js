const express = require("express");
const multer = require("multer");
const { transcribeAudio } = require("../services/whisperService");
const { processChat } = require("../services/aiEngine");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ error: "no audio file" });
    }

    console.log("STT: file received");

    const text = await transcribeAudio(req.file.path);

    console.log("TRANSCRIPT:", text);

    const result = await processChat(text);

    res.json({
      transcript: text,
      ...result
    });

  } catch (err) {
    console.error("STT ERROR:", err);
    res.status(500).json({ error: "stt failed" });
  }

});

module.exports = router;
