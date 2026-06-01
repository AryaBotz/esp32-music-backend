const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
const { whisper } = require("../services/groq");

router.post("/", upload.single("audio"), async (req, res) => {

  try {

    const fileStream = fs.createReadStream(req.file.path);

    const result = await whisper(fileStream);

    fs.unlinkSync(req.file.path);

    res.json({
      text: result.text || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "STT failed" });
  }
});

module.exports = router;
