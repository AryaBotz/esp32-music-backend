const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;

// ======================
// 1. MOOD DETECTOR
// ======================
function getMood(text) {
  text = text.toLowerCase();

  if (text.includes("fokus") || text.includes("belajar")) {
    return { core: "focus" };
  }

  if (text.includes("sedih")) {
    return { core: "sad" };
  }

  if (text.includes("semangat") || text.includes("gym")) {
    return { core: "energy" };
  }

  if (text.includes("tidur")) {
    return { core: "sleep" };
  }

  if (text.includes("tenang") || text.includes("santai")) {
    return { core: "relax" };
  }

  return { core: "chill" };
}

// ======================
// 2. QUERY MAPPER
// ======================
function buildQuery(core) {
  const map = {
    chill: "lofi chill ambient",
    focus: "lofi study piano",
    sad: "sad piano ambient",
    energy: "electronic workout",
    relax: "calm ambient soft",
    sleep: "sleep rain ambient"
  };

  return map[core] || "lofi chill";
}

// ======================
// 3. SAFE TRACK HANDLER
// ======================
function safeTrack(results) {
  if (results && results.length > 0) {
    return results[0];
  }
  return null;
}

// ======================
// 4. JAMENDO REQUEST
// ======================
async function searchJamendo(query) {
  try {
    const url =
      `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=1&search=${encodeURIComponent(query)}`;

    const res = await axios.get(url);

    return safeTrack(res.data.results);
  } catch (err) {
    console.log("Jamendo error:", err.message);
    return null;
  }
}

// ======================
// 5. MAIN ROUTE
// ======================
app.post("/music", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({
        error: "no text input"
      });
    }

    // STEP 1: mood detect
    const mood = getMood(text);

    // STEP 2: build query
    let query = buildQuery(mood.core);

    // STEP 3: search jamendo
    let track = await searchJamendo(query);

    // STEP 4: fallback query kalau kosong
    if (!track) {
      console.log("Fallback triggered");

      const fallbackMap = {
        chill: "lofi",
        focus: "piano",
        sad: "sad piano",
        energy: "electronic",
        relax: "ambient",
        sleep: "sleep"
      };

      query = fallbackMap[mood.core] || "lofi";

      track = await searchJamendo(query);
    }

    // STEP 5: hard fallback radio
    if (!track) {
      return res.json({
        core: mood.core,
        title: "Radio fallback",
        audio_url: "http://stream.zeno.fm/fq6k5f5z5f8uv"
      });
    }

    // STEP 6: success response
    return res.json({
      core: mood.core,
      title: track.name,
      audio_url: track.audio
    });

  } catch (err) {
    console.log("Server error:", err);

    return res.json({
      error: "server crash",
      audio_url: "http://stream.zeno.fm/fq6k5f5z5f8uv"
    });
  }
});

// ======================
// 6. START SERVER
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
