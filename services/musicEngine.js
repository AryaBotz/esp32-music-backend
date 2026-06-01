

const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

async function getMusicFromMood(mood) {

  const tagMap = {
    sad: "sad",
    happy: "happy",
    focus: "chill",
    sleep: "sleep",
    neutral: "ambient"
  };

  const tag = tagMap[mood] || "ambient";

  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1&tags=${tag}&audioformat=mp31`;

  const res = await fetch(url);
  const data = await res.json();

  const track = data?.results?.[0];

  if (!track) return null;

  return track.audio;
}

module.exports = { getMusicFromMood };
