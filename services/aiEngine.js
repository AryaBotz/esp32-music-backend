const { detectMood } = require("./moodEngine");
const { getMusicFromMood } = require("./musicEngine");

async function processChat(text) {

  const mood = detectMood(text);

  return {
    mood,
    ai_query: `${mood} ${text}`,
    title: `Playlist for ${mood}`,
    audio_url: await getMusicFromMood(mood)
  };
}

module.exports = { processChat };
