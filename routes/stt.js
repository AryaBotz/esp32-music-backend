const express = require("express");
const multer = require("multer");
const { transcribeAudio } = require("../services/whisperService");
const chatRoute = require("./chat");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {

  try {

    const text = await transcribeAudio(req.file.path);

    const result = await chatRoute.processChat(text);

    res.json({
      transcript: text,
      ...result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "stt failed" });
  }

});

module.exports = router;
