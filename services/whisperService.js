const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function transcribeAudio(filePath) {

  const form = new FormData();

  form.append("file", fs.createReadStream(filePath));
  form.append("model", "whisper-large-v3");

  const res = await axios.post(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    form,
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        ...form.getHeaders()
      }
    }
  );

  return res.data.text;
}

module.exports = { transcribeAudio };
