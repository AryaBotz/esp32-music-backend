const fetch = global.fetch || require("node-fetch");

/**
 * =========================
 * JAMENDO SEARCH ENGINE
 * =========================
 */
async function searchMusic(query) {
  try {
    if (!query) query = "lofi chill";

    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT_ID
      }&format=json&limit=1&search=${encodeURIComponent(query)}&audioformat=mp31`;

    const res = await fetch(url);
    const data = await res.json();

    const track = data?.results?.[0];

    if (!track) {
      return fallbackTrack();
    }

    return {
      title: track.name,
      artist: track.artist_name,
      audio_url: track.audio
    };

  } catch (err) {
    console.error("[MUSIC ERROR]", err.message);
    return fallbackTrack();
  }
}

/**
 * =========================
 * FALLBACK TRACK
 * =========================
 */
function fallbackTrack() {
  return {
    title: "Relaxing Background Music",
    artist: "System Default",
    audio_url:
      "https://prod-1.storage.jamendo.com/?trackid=1446611&format=mp31"
  };
}

module.exports = {
  searchMusic
};
