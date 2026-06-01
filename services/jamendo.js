const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

async function searchTrack(query) {

  const url =
  `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=1&search=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  const data = await res.json();

  const track = data.results?.[0];

  if (!track) return null;

  return {
    title: track.name,
    audio_url: track.audio,
    artist: track.artist_name
  };
}

module.exports = { searchTrack };
