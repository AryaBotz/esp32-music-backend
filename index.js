const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const moods = {
  focus: [
    "lofi study",
    "deep focus ambient",
    "coding synthwave",
    "study beat hiphop"
  ],

  sad: [
    "sad piano",
    "emotional ambient",
    "lonely guitar",
    "melancholic chill"
  ],

  happy: [
    "happy upbeat",
    "summer pop",
    "funk groove",
    "dance electronic"
  ],

  relax: [
    "rain ambient",
    "calm meditation",
    "soft sleep music",
    "nature chill"
  ],

  energetic: [
    "workout edm",
    "rock energy",
    "gaming trap",
    "epic motivation"
  ]
};

async function askGroq(userText) {

  const prompt = `
You are an AI mood detector.

Analyze the user's emotion.

Return JSON only.

Format:
{
  "core":"focus",
  "query":"lofi coding night"
}

Available moods:
focus
sad
happy
relax
energetic

User:
${userText}
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const raw =
    response.data.choices[0].message.content;

  return JSON.parse(raw);
}

async function searchJamendo(query) {

  const url =
    `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT_ID}&format=json&limit=10&search=${encodeURIComponent(query)}&audioformat=mp31`;

  const response = await axios.get(url);

  const results = response.data.results;

  if (!results || results.length === 0) {
    return null;
  }

  const random =
    results[Math.floor(Math.random() * results.length)];

  return {
    title: random.name,
    audio_url: random.audio
  };
}

async function fallbackMusic(coreMood) {

  const arr = moods[coreMood] || moods.relax;

  const randomQuery =
    arr[Math.floor(Math.random() * arr.length)];

  return await searchJamendo(randomQuery);
}

app.post("/music", async (req, res) => {

  try {

    const userText = req.body.text;

    console.log("USER:", userText);

    const ai = await askGroq(userText);

    console.log("AI:", ai);

    let music =
      await searchJamendo(ai.query);

    if (!music) {

      console.log("Fallback activated");

      music =
        await fallbackMusic(ai.core);
    }

    if (!music) {

      return res.json({
        error: "music not found"
      });
    }

    res.json({
      mood: ai.core,
      ai_query: ai.query,
      title: music.title,
      audio_url: music.audio_url
    });

  } catch (err) {

    console.log(err.message);

    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("ESP32 AI MUSIC SERVER ONLINE");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
