const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/resolve-song", async (req, res) => {

  const { song, artist } = req.body;

  const query = `${song} ${artist}`;

  const result = await ytSearch(query);

  if (!result.videos.length) {
    return res.json({ error: "not found" });
  }

  const video = result.videos[0];

  const info = await ytdl.getInfo(video.url);
  const audio = ytdl.filterFormats(info.formats, "audioonly")[0];

  res.json({
    title: video.title,
    audio_url: audio.url
  });

});

app.listen(process.env.PORT || 3000);
