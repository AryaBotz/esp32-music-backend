const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;

// ======================
// MOOD DETECTOR (bisa nanti diganti Groq)
// ======================
function getMood(text) {
  text = text.toLowerCase();

  if (text.includes("fokus") || text.includes("belajar")) return { core: "focus" };
  if (text.includes("sedih")) return { core: "sad" };
  if (text.includes("semangat") || text.includes("gym")) return { core: "energy" };
  if (text.includes("tidur")) return { core: "sleep" };
  if (text.includes("tenang") || text.includes("santai")) return { core: "relax" };

  return { core: "chill" };
}

// ======================
// QUERY MAP
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
// CLEAN URL (FIX BUG KAMU)
// ======================
function cleanUrl(url) {
  if (!url) return null;
  return url.replace(/\s/g, "");
}

// ======================
// JAMENDO SEARCH
// ======================
async function searchJamendo(query) {
  try {
    const url =
      `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=1&search=${encodeURIComponent(query)}`;

    const res = await axios.get(url);

    return res.data.results?.[0] || null;
  } catch (e) {
    console.log("Jamendo error:", e.message);
    return null;
  }
}

// ======================
// MAIN API
// ======================
app.post("/music", async (req, res) => {
  try {
    const { text } = req.body;

    const mood = getMood(text);
    let query = buildQuery(mood.core);

    let track = await searchJamendo(query);

    // fallback 1
    if (!track) {
      const fallback = {
        chill: "lofi",
        focus: "piano",
        sad: "sad piano",
        energy: "electronic",
        relax: "ambient",
        sleep: "sleep"
      };

      query = fallback[mood.core] || "lofi";
      track = await searchJamendo(query);
    }

    // fallback 2 (radio)
    if (!track) {
      return res.json({
        core: mood.core,
        title: "radio fallback",
        audio_url: "http://stream.zeno.fm/fq6k5f5z5f8uv"
      });
    }

    return res.json({
      core: mood.core,
      title: track.name,
      audio_url: cleanUrl(track.audio)
    });

  } catch (err) {
    console.log(err);

    return res.json({
      error: "server error",
      audio_url: "http://stream.zeno.fm/fq6k5f5z5f8uv"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running:", PORT));
