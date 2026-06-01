const { detectMood } = require("./moodEngine");
const { getMusicFromMood } = require("./musicEngine");

async function processChat(text) {

  const mood = detectMood(text);

  const ai_query = buildQuery(text, mood);

  const audio_url = getMusicFromMood(mood);

  return {
    mood,
    ai_query,
    title: generateTitle(mood),
    audio_url
  };
}

function buildQuery(text, mood) {
  return `${mood} ${text}`;
}

function generateTitle(mood) {
  return `Playlist for ${mood}`;
}

module.exports = { processChat };
