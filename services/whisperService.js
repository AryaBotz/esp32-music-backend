const fs = require("fs");
const fetch = require("node-fetch");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function transcribeAudio(filePath) {

  const file = fs.readFileSync(filePath);

  const formData = new FormData();
  formData.append("file", new Blob([file]), "audio.wav");
  formData.append("model", "whisper-large-v3");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: formData
  });

  const data = await res.json();

  return data.text;
}

module.exports = { transcribeAudio };
