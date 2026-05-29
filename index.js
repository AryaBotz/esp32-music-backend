const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = "YOUR_JAMENDO_CLIENT_ID";

// mapping mood → query Jamendo
function buildQuery(core, sub) {
  const map = {
    chill: "lofi chill ambient",
    focus: "deep study ambient piano",
    happy: "upbeat acoustic pop",
    sad: "sad piano cinematic",
    energy: "electronic workout hype",
    relax: "calm soft ambient",
    sleep: "deep sleep rain ambient",
    romantic: "love acoustic piano",
    dark: "dark cinematic ambient"
  };

  return (map[core] || "lofi chill") + " " + (sub || "");
}

// (optional) simple mock AI kalau Groq belum dipakai
async function getMood(text) {
  if (text.includes("fokus")) return { core: "focus", sub: "deep focus" };
  if (text.includes("sedih")) return { core: "sad", sub: "lonely piano" };
  if (text.includes("semangat")) return { core: "energy", sub: "workout" };
  return { core: "chill", sub: "lofi" };
}

app.post("/music", async (req, res) => {
  try {
    const { text } = req.body;

    // 1. convert ke mood
    const mood = await getMood(text);

    // 2. build query
    const query = buildQuery(mood.core, mood.sub);

    // 3. search Jamendo
    const url =
      `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=1&search=${encodeURIComponent(query)}`;

    const response = await axios.get(url);

    const track = response.data.results?.[0];

    if (!track) {
      return res.json({ error: "not found", mood });
    }

    // 4. return audio
    res.json({
      core: mood.core,
      sub: mood.sub,
      title: track.name,
      audio_url: track.audio
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.listen(process.env.PORT || 3000);
