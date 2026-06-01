const express = require("express");
const { processChat } = require("../services/aiEngine");

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const text = req.body.text;

    if (!text) {
      return res.status(400).json({ error: "text required" });
    }

    const result = await processChat(text);

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "chat failed" });
  }

});

module.exports = router;
