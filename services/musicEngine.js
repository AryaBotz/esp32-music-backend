const axios = require("axios");

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

async function getMusicFromMood(mood) {

  const map = {
    sad: "lofi sad",
    happy: "happy upbeat",
    focus: "lofi focus",
    sleep: "sleep ambient",
    neutral: "chill"
  };

  const query = map[mood] || "chill";

  try {

    const res = await axios.get(
      "https://api.jamendo.com/v3.0/tracks/",
      {
        params: {
          client_id: CLIENT_ID,
          format: "json",
          limit: 1,
          search: query,
          audioformat: "mp31"
        }
      }
    );

    const track = res.data.results?.[0];

    if (!track) {
      return fallback();
    }

    return track.audio;

  } catch (err) {
    console.error("Jamendo error:", err.message);
    return fallback();
  }
}

function fallback() {
  return "https://filesamples.com/samples/audio/mp3/sample1.mp3";
}

module.exports = { getMusicFromMood };
