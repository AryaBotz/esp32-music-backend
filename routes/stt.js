const express = require("express");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "uploads/"
});

const { whisper } = require("../services/groq");

router.post(
  "/",
  upload.single("audio"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          error: "No audio file uploaded"
        });
      }

      console.log(
        "[UPLOADED FILE]",
        req.file.originalname
      );

      console.log(
        "[MIME TYPE]",
        req.file.mimetype
      );

      console.log(
        "[FILE SIZE]",
        req.file.size
      );

      const fileStream =
        fs.createReadStream(req.file.path);

      const result =
        await whisper(fileStream);

      console.log(
        "[WHISPER RESULT]",
        JSON.stringify(result, null, 2)
      );

      fs.unlinkSync(req.file.path);

      res.json({
        text: result.text || ""
      });

    } catch (err) {

      console.error(
        "[STT ERROR]",
        err
      );

      res.status(500).json({
        error: "STT failed"
      });
    }
  }
);

module.exports = router;
